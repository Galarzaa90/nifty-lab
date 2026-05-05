export type CalculatorMeta = {
  slug: string;
  name: string;
  shortDescription: string;
  href: string;
};

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "unit-price",
    name: "Unit Price Calculator",
    shortDescription:
      "Compare product prices in different presentations to find the best offer.",
    href: "/calculators/unit-price",
  },
  {
    slug: "discount",
    name: "Discount Calculator",
    shortDescription:
      "Stack multiple discounts to see the real final price and total savings.",
    href: "/calculators/discount",
  },
  {
    slug: "unit-conversion",
    name: "Unit Conversion Calculator",
    shortDescription:
      "Convert quantities between compatible length, weight, volume, and area units.",
    href: "/calculators/unit-conversion",
  },
  {
    slug: "subscription-cost",
    name: "Subscription Cost Calculator",
    shortDescription:
      "Compare weekly, monthly, and yearly subscriptions by their real annual cost.",
    href: "/calculators/subscription-cost",
  },
];
