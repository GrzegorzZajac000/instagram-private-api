import { AbstractFeed } from './abstract.feed';
import {
  MediaCommentsFeedResponseCommentsItem,
  MediaCommentsFeedResponseRootObject,
} from '../responses/media-comments.feed.response';

export class MediaCommentsFeed extends AbstractFeed<MediaCommentsFeedResponseCommentsItem> {
  id: string;
  async request() {
    const { body: json } = await this.client.request.send<MediaCommentsFeedResponseRootObject>({
      url: `/api/v1/media/${this.id}/comments/`,
      qs: {
        can_support_threading: true,
        min_id: this.cursor,
      },
    });
    this.moreAvailable = !!json.next_min_id;
    if (this.moreAvailable) this.setCursor(json.next_min_id);
    return json;
  }
  async items() {
    const response = await this.request();
    return response.comments;
  }
}