export const MAX_DUEL_NUMBER = 100
export const MAX_DUEL = (songsLength: number): number => {
  const possiblePairsMax = (songsLength * (songsLength - 1)) / 2
  return possiblePairsMax < 100 ? possiblePairsMax : MAX_DUEL_NUMBER
}
