// API/musicbrainz/method.ts

export async function getAlbums(artistName: string, albumName: string) {
  const response = await fetch(
    `/api/musicbrainz?artistName=${artistName}&albumName=${albumName}`
  );
  const data = await response.json();

  return data.results;
}