"use client";

import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconCurrencyDollar, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";

type DiscountBreakdown = {
  label: string;
  rate: number;
  amount: number;
  remaining: number;
};

type DiscountResult = {
  basePrice: number;
  finalPrice: number;
  totalSavings: number;
  effectiveDiscount: number;
  breakdown: DiscountBreakdown[];
};

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
});

const clampPercentage = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(Math.max(value, 0), 100);
};

const formatPercent = (value: number) => `${percentFormatter.format(value)}%`;

const sanitizePercent = (value: number | "") => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  return clampPercentage(value);
};

export default function DiscountCalculatorPage() {
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [primaryDiscount, setPrimaryDiscount] = useState<number | "">("");
  const [additionalDiscounts, setAdditionalDiscounts] = useState<
    (number | "")[]
  >([]);

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

  const handleAdditionalChange = (index: number, value: string | number) => {
    setAdditionalDiscounts((prev) => {
      const next = [...prev];
      next[index] = parseNumberInput(value);
      return next;
    });
  };

  const handleRemoveAdditional = (index: number) => {
    setAdditionalDiscounts((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddAdditional = () => {
    setAdditionalDiscounts((prev) => [...prev, ""]);
  };

  const result = useMemo<DiscountResult | null>(() => {
    if (typeof originalPrice !== "number" || originalPrice <= 0) {
      return null;
    }

    let workingPrice = originalPrice;
    const breakdown: DiscountBreakdown[] = [];

    const normalizedPrimary = sanitizePercent(primaryDiscount);
    if (normalizedPrimary !== null && normalizedPrimary > 0) {
      const rate = normalizedPrimary / 100;
      const amount = workingPrice * rate;
      workingPrice -= amount;
      breakdown.push({
        label: "Primary discount",
        rate: normalizedPrimary,
        amount,
        remaining: workingPrice,
      });
    }

    const normalizedExtras = additionalDiscounts
      .map(sanitizePercent)
      .filter((value): value is number => value !== null && value > 0);

    normalizedExtras.forEach((value, index) => {
      const rate = value / 100;
      const amount = workingPrice * rate;
      workingPrice -= amount;
      breakdown.push({
        label: `Additional discount ${index + 1}`,
        rate: value,
        amount,
        remaining: workingPrice,
      });
    });

    const finalPrice = Math.max(workingPrice, 0);
    const totalSavings = Math.max(originalPrice - finalPrice, 0);
    const effectiveDiscount =
      originalPrice > 0
        ? clampPercentage((totalSavings / originalPrice) * 100)
        : 0;

    return {
      basePrice: originalPrice,
      finalPrice,
      totalSavings,
      effectiveDiscount,
      breakdown,
    };
  }, [additionalDiscounts, originalPrice, primaryDiscount]);

  return (
      <Stack gap="xl">
        <Stack gap="sm">
        <Title order={1} className="section-title">
          Discount calculator
        </Title>
        <Text className="lede">
          Combine multiple discounts to see the true final price and how much you
          save.
        </Text>
      </Stack>

      <Card className="tool-card" p={{ base: "md", sm: "lg" }}>
        <Stack gap="lg">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={{ base: "md", sm: "lg" }}>
            <NumberInput
              label="Original price"
              placeholder="0.00"
              leftSection={<IconCurrencyDollar />}
              value={originalPrice}
              min={0}
              hideControls
              size="sm"
              inputMode="decimal"
              onChange={(value) => setOriginalPrice(parseNumberInput(value))}
            />
            <NumberInput
              label="Primary discount"
              placeholder="0"
              value={primaryDiscount}
              min={0}
              max={100}
              hideControls
              size="sm"
              inputMode="decimal"
              suffix="%"
              onChange={(value) => setPrimaryDiscount(parseNumberInput(value))}
            />
          </SimpleGrid>

          <Stack gap="sm">
            {additionalDiscounts.map((value, index) => (
              <Group key={`additional-${index}`} align="flex-end" gap="sm">
                <NumberInput
                  flex={1}
                  label={`Additional discount ${index + 1}`}
                  placeholder="0"
                  value={value}
                  min={0}
                  max={100}
                  hideControls
                  size="sm"
                  inputMode="decimal"
                  suffix="%"
                  onChange={(nextValue) =>
                    handleAdditionalChange(index, nextValue)
                  }
                />
                <ActionIcon
                  color="red"
                  variant="subtle"
                  aria-label={`Remove additional discount ${index + 1}`}
                  onClick={() => handleRemoveAdditional(index)}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </Group>
            ))}
            <Button
              variant="outline"
              color="dark"
              size="sm"
              className="mobile-wide-action"
              leftSection={<IconPlus size={16} />}
              onClick={handleAddAdditional}
            >
              Add another discount
            </Button>
          </Stack>
        </Stack>
      </Card>

      <Card
        className={result ? "result-card" : "tool-card"}
        p={{ base: "md", sm: "lg" }}
      >
        <Stack gap="md">
          {result ? (
            <>
              <Group justify="space-between" align="flex-end" gap="lg">
                <Stack gap={4}>
                  <Text size="sm" className="result-muted">
                    Final price
                  </Text>
                  <Text className="result-number">
                    {currencyFormatter.format(result.finalPrice)}
                  </Text>
                </Stack>
                <span
                  className="stat-chip"
                  data-tone={result.totalSavings > 0 ? "success" : undefined}
                >
                  {formatPercent(result.effectiveDiscount)} off
                </span>
              </Group>

              <Text className="result-muted">
                You save {currencyFormatter.format(result.totalSavings)}.
              </Text>

              {result.breakdown.length > 0 ? (
                <>
                  <Divider />
                  <Stack gap="sm">
                    <Text
                      size="sm"
                      fw={760}
                      className="result-muted"
                      tt="uppercase"
                    >
                      Discount breakdown
                    </Text>
                    {result.breakdown.map((entry, index) => (
                      <Stack key={`${entry.label}-${index}`} gap={4}>
                        <Group justify="space-between" gap="xs">
                          <Text fw={600}>{entry.label}</Text>
                          <span className="stat-chip">
                            {formatPercent(entry.rate)}
                          </span>
                        </Group>
                        <Text size="sm">
                          Savings: {currencyFormatter.format(entry.amount)}
                        </Text>
                        <Text size="sm" className="result-muted">
                          Subtotal after discount:{" "}
                          {currencyFormatter.format(entry.remaining)}
                        </Text>
                        {index < result.breakdown.length - 1 ? <Divider /> : null}
                      </Stack>
                    ))}
                  </Stack>
                </>
              ) : null}
            </>
          ) : (
            <Text className="quiet-text">
              Enter an original price greater than zero to see your savings.
            </Text>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
