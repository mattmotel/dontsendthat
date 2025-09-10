import { createAvatar } from '@dicebear/core';
import { personas } from '@dicebear/collection';

export function generateAvatarUrl(seed: string): string {
  const avatar = createAvatar(personas, {
    seed,
    size: 128,
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
  });
  
  return avatar.toDataUri();
}

export function generateProfileAvatar(name: string, size: number = 40): string {
  // Use the person's name as seed for consistent avatars
  const seed = name.toLowerCase().replace(/\s+/g, '');
  
  const avatar = createAvatar(personas, {
    seed,
    size,
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
    // Make avatars look more professional
    eyes: ['open', 'happy', 'wink', 'glasses'],
    mouth: ['smile', 'frown', 'surprise', 'bigSmile'],
  });
  
  return avatar.toDataUri();
}
