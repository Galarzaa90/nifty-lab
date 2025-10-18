export type CalculatorMeta = {
  slug: string;
  name: string;
  shortDescription: string;
  href: string;
  tags: string[];
};

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "unit-price",
    name: "Unit Price Calculator",
    shortDescription:
      "Compare product prices in different presentations to find the best offer.",
    href: "/calculators/unit-price",
    tags: ["shopping", "comparison"],
  },
    {
    slug: "discount",
    name: "Discount Calculator",
    shortDescription:
      "Stack multiple discounts to see the real final price and total savings.",
    href: "/calculators/discount",
    tags: ["shopping", "savings"],
  },
];
