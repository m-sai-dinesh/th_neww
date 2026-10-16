import sponsordata from "../assets/sponsors26.json";

/**
 * The current Turing Cup edition: everything that changes from year to year.
 *
 * The page works out where the contest stands from these dates on its own:
 * the hero, the countdown, the round cards and the closing call to action all
 * follow. For a new edition, change this object and nothing else. Leave
 * `prizePool` at 0 or `sponsors` empty to hide those sections.
 */
export const turingCupSections = {
  registerButton: false,
  registrationForm: false,
  timers: false,
  timeline: false,
  prizePool: false,
  sponsors: false
};

export const registrationUrl =
  "https://unstop.com/hackathons/turing-cup-2k26-vallurupalli-nageswara-rao-vignana-jyothi-institute-of-engineering-technology-telangana-1634555";

export const edition = {
  name: "Turing Cup 2K26",
  short: "2K26",
  registrationUrl:
    "https://unstop.com/hackathons/turing-cup-2k26-vallurupalli-nageswara-rao-vignana-jyothi-institute-of-engineering-technology-telangana-1634555",
  prizePool: 75000,
  sponsors: sponsordata.sponsors,
  rounds: [
    {
      letter: "A",
      title: "Registration",
      // No start: open from whenever the page goes up until `end`
      start: null,
      end: "2026-02-24T23:59:00+05:30",
      details: [
        ["Eligibility", "Any full-time undergraduate, any branch"],
        ["Team size", "1–2"],
        ["Fee", "Free for Round 1 · ₹300 per team for Round 2"]
      ]
    },
    {
      letter: "B",
      title: "Round 1 · Qualifier",
      start: "2026-02-28T20:30:00+05:30",
      end: "2026-02-28T22:00:00+05:30",
      details: [
        ["Mode", "Online"],
        ["Time limit", "1h 30m"],
        ["Note", "Ranklist final after plagiarism check"]
      ]
    },
    {
      letter: "C",
      title: "Round 2 · Onsite Final",
      start: "2026-03-18T10:00:00+05:30",
      end: "2026-03-18T13:00:00+05:30",
      details: [
        ["Mode", "Offline"],
        ["Time limit", "3h 00m"],
        ["Venue", "VNR VJIET, Bachupally, Hyderabad"]
      ]
    }
  ]
};

/** Where a round stands at `now`: "upcoming", "live" or "done". */
export function roundStatus(round, now = Date.now()) {
  if (round.start && now < Date.parse(round.start)) return "upcoming";
  if (now < Date.parse(round.end)) return "live";
  return "done";
}

/**
 * Where the edition stands: "registration" while sign-ups are open, "live"
 * while a round is running, "between" while the next round is still ahead,
 * "wrapped" once the final is over.
 */
export function editionPhase(now = Date.now()) {
  const [registration, ...contestRounds] = edition.rounds;
  if (contestRounds.some(round => roundStatus(round, now) === "live")) {
    return "live";
  }
  if (roundStatus(registration, now) === "live") return "registration";
  if (contestRounds.some(round => roundStatus(round, now) === "upcoming")) {
    return "between";
  }
  return "wrapped";
}

/** The next contest round that has not started yet, if any. */
export function nextRound(now = Date.now()) {
  return edition.rounds
    .slice(1)
    .find(round => roundStatus(round, now) === "upcoming");
}
