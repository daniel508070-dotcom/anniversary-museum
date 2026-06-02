import relationshipData from "../../data/generated/relationship.json";
import { AccessGate } from "@/components/AccessGate";
import { CathedralExperience } from "@/components/CathedralExperience";
import type { RelationshipData } from "@/types/relationship";

const data = relationshipData as RelationshipData;

export default function Home() {
  return (
    <AccessGate>
      <CathedralExperience data={data} />
    </AccessGate>
  );
}
