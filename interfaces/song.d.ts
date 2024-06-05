interface Song {
  id: number
  title: string
  image: {
    height?: number
    url: string
    width?: number
  }
}

type SongVersus = [Song, Song]

type Album = SpotifyApi.AlbumObjectSimplified
