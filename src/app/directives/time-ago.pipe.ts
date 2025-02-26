import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: false // Ensures it updates dynamically
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const now = new Date();
    const past = new Date(value);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else if (diffInSeconds < 604800) { // Less than 7 days
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    } else if (diffInSeconds < 2592000) { // Less than a month
      return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    } else if (diffInSeconds < 31536000) { // Less than a year
      return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    } else {
      return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    }
  }
}
