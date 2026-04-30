"use client";

import {
  ActionIcon,
  Button,
  Card,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCurrencyDollar,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

type BillingCycle = "week" | "month" | "quarter" | "year";

type PlanInput = {
  price: number | "";
  cycle: BillingCycle;
};

type NormalizedPlan = {
  annualCost: number;
  monthlyEquivalent: number;
};

const BILLING_MULTIPLIERS: Record<BillingCycle, number> = {
  week: 52,
  month: 12,
  quarter: 4,
  year: 1,
};

const BILLING_OPTIONS = [
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
  { value: "quarter", label: "Quarterly" },
  { value: "year", label: "Yearly" },
];

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const parseNumberInput = (value: string | number): number | "" => {
  if (value === "" || value === null) {
    return "";
  }
  if (typeof value === "number") {
    return Number.isNaN(value) ? "" : value;
  }
  const numeric = Number(value);
  return Number.isNaN(numeric) ? "" : numeric;
};

const getPlanLabel = (index: number) => `Subscription ${index + 1}`;

export default function SubscriptionCostCalculatorPage() {
  const [plans, setPlans] = useState<PlanInput[]>([
    { price: "", cycle: "month" },
  ]);

  const normalizedPlans = useMemo<(NormalizedPlan | null)[]>(() => {
    return plans.map((plan) => {
      const price = typeof plan.price === "number" ? plan.price : Number(plan.price);

      if (!Number.isFinite(price) || price <= 0) {
        return null;
      }

      const annualCost = price * BILLING_MULTIPLIERS[plan.cycle];

      return {
        annualCost,
        monthlyEquivalent: annualCost / 12,
      };
    });
  }, [plans]);

  const summary = useMemo(() => {
    const entries = normalizedPlans
      .map((plan, index) => (plan ? { index, ...plan } : null))
      .filter(
        (entry): entry is NormalizedPlan & { index: number } => entry !== null
      );

    if (entries.length === 0) {
      return null;
    }

    const cheapest = entries.reduce((best, entry) =>
      entry.annualCost < best.annualCost ? entry : best
    );
    const mostExpensive = entries.reduce((worst, entry) =>
      entry.annualCost > worst.annualCost ? entry : worst
    );

    return {
      cheapestIndex: cheapest.index,
      cheapestAnnualCost: cheapest.annualCost,
      cheapestMonthlyEquivalent: cheapest.monthlyEquivalent,
      savingsAgainstHighest: mostExpensive.annualCost - cheapest.annualCost,
    };
  }, [normalizedPlans]);

  const handlePlanChange = <Field extends keyof PlanInput>(
    index: number,
    field: Field,
    value: PlanInput[Field]
  ) => {
    setPlans((prev) =>
      prev.map((plan, planIndex) =>
        planIndex === index ? { ...plan, [field]: value } : plan
      )
    );
  };

  const handleAddPlan = () => {
    setPlans((prev) => [
      ...prev,
      { price: "", cycle: "month" },
    ]);
  };

  const handleRemovePlan = (index: number) => {
    if (plans.length <= 1) {
      return;
    }
    setPlans((prev) => prev.filter((_, planIndex) => planIndex !== index));
  };

  return (
      <Stack gap="xl">
        <Stack gap="sm">
        <Title order={1} className="section-title">
          Subscription cost calculator
        </Title>
        <Text className="lede">
          Compare plans with different billing cycles by their monthly
          equivalent and real yearly cost.
        </Text>
      </Stack>

      <Stack gap="lg">
        {plans.map((plan, index) => {
          const normalized = normalizedPlans[index];
          const isCheapest = summary?.cheapestIndex === index;

          return (
            <Card
              key={`subscription-${index}`}
              className="tool-card calculator-row"
              data-winning={isCheapest}
              p={{ base: "md", sm: "lg" }}
            >
              <Stack gap="md">
                <Group justify="space-between" align="flex-start" gap="md">
                  <Stack gap={3}>
                    <Text className="meta-label">{getPlanLabel(index)}</Text>
                    {normalized ? (
                      <Text ff="monospace" fw={760}>
                        {currencyFormatter.format(normalized.monthlyEquivalent)} / mo
                      </Text>
                    ) : (
                      <Text size="sm" className="quiet-text">
                        Waiting for price and billing cycle
                      </Text>
                    )}
                  </Stack>

                  <Group gap="xs">
                    {isCheapest && normalized ? (
                      <span className="stat-chip" data-tone="success">
                        Lowest yearly
                      </span>
                    ) : null}
                    {plans.length > 1 ? (
                      <ActionIcon
                        color="red"
                        variant="outline"
                        aria-label={`Remove ${getPlanLabel(index)}`}
                        onClick={() => handleRemovePlan(index)}
                      >
                        <IconTrash size={17} />
                      </ActionIcon>
                    ) : null}
                  </Group>
                </Group>

                <SimpleGrid
                  cols={{ base: 1, sm: 2 }}
                  spacing={{ base: "sm", sm: "md" }}
                >
                  <NumberInput
                    label="Price"
                    placeholder="0.00"
                    leftSection={<IconCurrencyDollar size={18} />}
                    value={plan.price}
                    min={0}
                    hideControls
                    size="sm"
                    inputMode="decimal"
                    onChange={(value) =>
                      handlePlanChange(index, "price", parseNumberInput(value))
                    }
                  />
                  <Select
                    label="Billed"
                    data={BILLING_OPTIONS}
                    value={plan.cycle}
                    size="sm"
                    allowDeselect={false}
                    onChange={(value) =>
                      handlePlanChange(
                        index,
                        "cycle",
                        (value ?? "month") as BillingCycle
                      )
                    }
                  />
                </SimpleGrid>

                {normalized ? (
                  <Group gap="xs">
                    <span className="stat-chip">
                      {currencyFormatter.format(normalized.annualCost)} / year
                    </span>
                    <span className="stat-chip">
                      {compactCurrencyFormatter.format(normalized.annualCost * 2)} / 2 yrs
                    </span>
                  </Group>
                ) : null}
              </Stack>
            </Card>
          );
        })}
      </Stack>

      <Button
        variant="filled"
        color="dark"
        size="md"
        className="mobile-wide-action"
        leftSection={<IconPlus size={17} />}
        onClick={handleAddPlan}
      >
        Add subscription
      </Button>

      <Card
        className={summary ? "result-card" : "tool-card"}
        p={{ base: "md", sm: "lg" }}
      >
        {summary ? (
          <Stack gap="md">
            <Group justify="space-between" align="flex-end" gap="lg">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" flex={1}>
                <Stack gap={4}>
                  <Text size="sm" className="result-muted">
                    Monthly equivalent
                  </Text>
                  <Text className="result-number">
                    {currencyFormatter.format(summary.cheapestMonthlyEquivalent)}
                  </Text>
                </Stack>
                <Stack gap={4}>
                  <Text size="sm" className="result-muted">
                    Yearly cost
                  </Text>
                  <Text className="result-number">
                    {currencyFormatter.format(summary.cheapestAnnualCost)}
                  </Text>
                </Stack>
              </SimpleGrid>
              <span className="stat-chip" data-tone="success">
                {getPlanLabel(summary.cheapestIndex)}
              </span>
            </Group>

            <Text className="result-muted">
              {summary.savingsAgainstHighest > 0
                ? `Cheapest option saves ${currencyFormatter.format(
                    summary.savingsAgainstHighest
                  )} per year versus the most expensive valid option.`
                : "Add another valid plan to compare yearly savings."}
            </Text>
          </Stack>
        ) : (
          <Text className="quiet-text">
            Enter at least one subscription price to see yearly cost.
          </Text>
        )}
      </Card>
    </Stack>
  );
}
