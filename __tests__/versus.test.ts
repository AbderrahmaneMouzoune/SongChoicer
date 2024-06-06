import { MAX_DUEL } from '@/config'
import {
  countHowMuchTimeThisSoungAppear,
  generateAllPairPossible,
  generateDuels,
} from '@/lib/duels'
import '@testing-library/jest-dom'

const NUMBER_OF_TRACK = 4

describe('generateDuels', () => {
  const songs: Song[] = Array.from({ length: NUMBER_OF_TRACK })
    .fill(null)
    .map((_, index) => ({
      id: index,
      title: `Titre ${index}`,
      image: {
        url: 'https://i.scdn.co/image/ab67616d0000b2732ac57e231c742bda1ef89d3c',
        width: 640,
        height: 640,
      },
    }))

  it(`should have ${NUMBER_OF_TRACK} songs`, () => {
    expect(songs.length).toBe(NUMBER_OF_TRACK)
  })

  it(`should not have the same pair`, () => {
    const possibleUniquePairs = generateAllPairPossible(songs)
    const expectedNumberDuels = (songs.length * (songs.length - 1)) / 2
    expect(possibleUniquePairs.length).toBe(expectedNumberDuels)

    // Vérifie qu'il n'y a pas de paires en double
    const pairIds = new Set<string>()
    possibleUniquePairs.forEach(([songA, songB]) => {
      const pairId = `${songA.id}-${songB.id}`
      expect(pairIds.has(pairId)).toBe(false) // Vérifie qu'aucune paire n'est déjà présente
      pairIds.add(pairId)
    })
  })

  it(`should generate less/equal than ${MAX_DUEL(songs.length)} duels`, () => {
    const duels = generateDuels(songs)
    expect(duels.length).toBeLessThanOrEqual(MAX_DUEL(songs.length))
  })

  it('should ensure each song appears at least once', () => {
    const duels = generateDuels(songs)
    const allSongs = new Set(songs.map((song) => song.id))
    const appearedSongs = new Set<number>()

    duels.forEach(([song1, song2]) => {
      appearedSongs.add(song1.id)
      appearedSongs.add(song2.id)
    })

    expect(appearedSongs.size).toBe(allSongs.size)
    // @ts-ignore
    expect([...appearedSongs].sort()).toEqual([...allSongs].sort())
  })

  it('should distribute song appearances approximately equally', () => {
    const duels = generateDuels(songs)
    const appearanceCount: { [key: number]: number } =
      countHowMuchTimeThisSoungAppear(duels)

    const minCount = Math.min(...Object.values(appearanceCount))
    const maxCount = Math.max(...Object.values(appearanceCount))

    expect(maxCount - minCount).toBeLessThanOrEqual(1)
  })

  it('should not exceed the maximum number of duels', () => {
    const duels = generateDuels(songs)
    expect(duels.length).toBeLessThanOrEqual(MAX_DUEL(songs.length))
  })
})
