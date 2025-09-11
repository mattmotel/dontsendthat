// Generate consistent real photo URLs based on name using RandomUser.me
export function generateProfileAvatar(name: string, _size: number = 40): string {
  // Use the person's name as seed for consistent photos
  const seed = name.toLowerCase().replace(/\s+/g, '');
  
  // Create a simple hash from the name to get a consistent number
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value to ensure positive number  
  const photoId = Math.abs(hash) % 1000;
  
  // Use RandomUser.me API which provides real photos of people
  // Mix of men and women photos for variety
  const genders = ['men', 'women'];
  const gender = genders[photoId % 2];
  const id = (photoId % 99) + 1; // RandomUser has portraits 1-99
  
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
}

