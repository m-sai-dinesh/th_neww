import { useRef } from "react";
import { Box } from "@mui/material";
import { Seo } from "../components/Seo";
import CupChampions from "../components/TuringCup/CupChampions";
import CupClock from "../components/TuringCup/CupClock";
import CupEasterEgg from "../components/TuringCup/CupEasterEgg";
import CupFaqs from "../components/TuringCup/CupFaqs";
import CupFinale from "../components/TuringCup/CupFinale";
import CupPrizes from "../components/TuringCup/CupPrizes";
import CupStory from "../components/TuringCup/CupStory";
import CupTrends from "../components/TuringCup/CupTrends";
import { edition, nextRound } from "../data/turingCup";
import useReveal from "../hooks/useReveal";

function Turingcup() {
  const page = useRef(null);
  const upcoming = nextRound();
  useReveal(page);

  return (
    <Box ref={page}>
      <Seo routename={"Turing Cup"} />
      <CupFinale />
      <CupStory />
      <CupTrends />
      {upcoming && <CupClock round={upcoming} />}
      <CupChampions />
      {edition.prizePool > 0 && <CupPrizes />}
      <CupFaqs />
      <CupEasterEgg />
    </Box>
  );
}

export default Turingcup;
