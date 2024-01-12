import LeadForm from "@/components/LeadForm";
import StateMap from "@/components/StateMap";
import * as d3 from "d3";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <StateMap />
    </main>
  );
}
