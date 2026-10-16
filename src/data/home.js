import icpcData from "../lib/icpc-timeline-data.json";
import { editions } from "../utils/content";
import { eventCards } from "../utils/eventCards";
import contestdetails from "./pastContests";

// Everything the home page claims is derived from the site's own data, so
// it stays true as events, editions, seasons and contests are added.

export const FOUNDED = 2017;

export const MEMBERSHIP_URL = "https://groups.google.com/g/turing-hut-members";

/** Registrations per Turing Cup, oldest first: { year, teams, colleges }. */
export const turingCupRegistrations = contestdetails
  .map(({ year, info }) => {
    const match = /(\d[\d,]*) teams from (\d[\d,]*) different colleges/.exec(
      info
    );
    return (
      match && {
        year: Number(year),
        teams: Number(match[1].replace(/,/g, "")),
        colleges: Number(match[2].replace(/,/g, ""))
      }
    );
  })
  .filter(Boolean)
  .sort((a, b) => a.year - b.year);

export const latestTuringCup = {
  ...turingCupRegistrations.at(-1),
  participants: 2641
};

const rankOf = entry => Number(/Rank (\d+)/.exec(entry.rank)?.[1]) || null;

const icpcEntries = icpcData.timeline.flatMap(season =>
  season.entries.map(entry => ({ ...entry, season: season.year }))
);

/** ICPC: seasons with a team at the regionals, since when, and the best rank. */
export const icpc = (() => {
  const ranked = icpcEntries.filter(rankOf);
  const best = ranked.reduce((a, b) => (rankOf(b) < rankOf(a) ? b : a));
  const latestSeason = icpcData.timeline[0];
  const latestPhoto =
    [...latestSeason.entries]
      .filter(entry => entry.imagePath)
      .sort((a, b) => (rankOf(a) ?? Infinity) - (rankOf(b) ?? Infinity))[0] ??
    null;
  const startYears = icpcData.timeline.map(season =>
    Number(season.year.slice(0, 4))
  );
  const firstYear = Math.min(...startYears);
  return {
    seasons: icpcData.timeline.length,
    firstYear,
    // one season per year from the first to the latest
    consecutive:
      new Set(startYears).size === Math.max(...startYears) - firstYear + 1,
    bestRank: rankOf(best),
    latestSeason: latestSeason.year,
    latestPhoto
  };
})();

export const latestEdition = editions[0];

/** Events for the home page: upcoming ones if any, else the most recent. */
export const homeEvents = (() => {
  const upcoming = eventCards.filter(event => event.status).reverse();
  return upcoming.length > 0
    ? { upcoming: true, list: upcoming.slice(0, 3) }
    : { upcoming: false, list: eventCards.slice(0, 3) };
})();

export const stats = [
  {
    label: "Years running",
    value: new Date().getFullYear() - FOUNDED,
    suffix: "+"
  },
  { label: "Events hosted", value: eventCards.length, suffix: "+" },
  {
    label: `Participants at Turing Cup ${latestTuringCup.year}`,
    value: 2641
  }
];
