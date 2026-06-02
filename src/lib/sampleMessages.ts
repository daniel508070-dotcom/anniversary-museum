import type { RawMessage } from "@/types/relationship";

export const sampleMessages: RawMessage[] = [
  {
    id: "sample-001",
    sender: "Daniel",
    timestamp: "2022-11-02T20:14:00",
    text: "Hey, I am glad we started talking.",
    mediaKind: "text"
  },
  {
    id: "sample-002",
    sender: "Isabella",
    timestamp: "2022-11-02T20:17:00",
    text: "Me too :)",
    mediaKind: "text"
  },
  {
    id: "sample-003",
    sender: "Daniel",
    timestamp: "2023-03-12T22:05:00",
    text: "I love you.",
    mediaKind: "text"
  },
  {
    id: "sample-004",
    sender: "Isabella",
    timestamp: "2023-03-12T22:06:00",
    text: "Te amo ❤️",
    mediaKind: "text"
  },
  {
    id: "sample-005",
    sender: "Isabella",
    timestamp: "2024-04-20T23:58:00",
    text: "I kept thinking about us.",
    mediaKind: "text"
  },
  {
    id: "sample-006",
    sender: "Daniel",
    timestamp: "2024-09-03T08:11:00",
    text: "Seeing you again at school felt unreal. Te amo felt close again.",
    mediaKind: "text"
  },
  {
    id: "sample-007",
    sender: "Daniel",
    timestamp: "2026-01-02T21:30:00",
    text: "I cannot believe we are engaged.",
    mediaKind: "photo",
    mediaPath: "/media/engagement-placeholder.jpg"
  },
  {
    id: "sample-008",
    sender: "Isabella",
    timestamp: "2026-05-27T19:45:00",
    text: "My husband. Te amo forever 💍",
    mediaKind: "photo",
    mediaPath: "/media/marriage-placeholder.jpg"
  }
];
