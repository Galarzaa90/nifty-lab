export type CalculatorMeta = {
  slug: string;
  name: string;
  shortDescription: string;
  eyebrow: string;
  href: string;
};

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "unit-price",
    name: "Unit Price Calculator",
    shortDescription:
      "Compare product prices in different presentations to find the best offer.",
    eyebrow: "Price comparison",
    href: "/calculators/unit-price",
  },
  {
    slug: "discount",
    name: "Discount Calculator",
    shortDescription:
      "Stack multiple discounts to see the real final price and total savings.",
    eyebrow: "Checkout math",
    href: "/calculators/discount",
  },
];
