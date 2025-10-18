"use client";

import {
  Badge,
  Button,
  Card,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  ThemeIcon,
  Title,
  type ComboboxData,
  type ComboboxItem
} from "@mantine/core";
import { IconCurrencyDollar, IconTrash, IconX } from "@tabler/icons-react";
import { useMemo, useState } from "react";

type MeasurementKey = "units" | "volume" | "weight" | "length";

type UnitDefinition = {
  value: string;
  label: string;
  measurement: MeasurementKey;
  conversionToBase: number;
};

type MeasurementGroup = {
  key: MeasurementKey;
  label: string;
  baseUnitLabel: string;
  units: UnitDefinition[];
};

type UnitMeta = UnitDefinition & {
  groupLabel: string;
  baseUnitLabel: string;
};

type ProductInput = {
  price: number | "";
  amount: number | "";
  unit: string | null;
};

type NormalizedProduct = {
  pricePerBase: number;
  baseAmount: number;
  baseUnitLabel: string;
  measurement: MeasurementKey;
};

const MEASUREMENT_GROUPS: MeasurementGroup[] = [
  {
    key: "units",
    label: "Units",
    baseUnitLabel: "unit",
    units: [
      {
        value: "unit",
        label: "Units",
        measurement: "units",
        conversionToBase: 1,
      },
      {
        value: "pair",
        label: "Pairs",
        measurement: "units",
        conversionToBase: 2,
      },
      {
        value: "dozen",
        label: "Dozens",
        measurement: "units",
        conversionToBase: 12,
      },
    ],
  },
  {
    key: "volume",
    label: "Volume",
    baseUnitLabel: "mL",
    units: [
      {
        value: "ml",
        label: "Milliliters (mL)",
        measurement: "volume",
        conversionToBase: 1,
      },
      {
        value: "l",
        label: "Liters (L)",
        measurement: "volume",
        conversionToBase: 1000,
      },
      {
        value: "floz",
        label: "Fluid ounces (fl oz)",
        measurement: "volume",
        conversionToBase: 29.5735,
      },
      {
        value: "cup",
        label: "Cups (US)",
        measurement: "volume",
        conversionToBase: 240,
      },
      {
        value: "pint",
        label: "Pints (US)",
        measurement: "volume",
        conversionToBase: 473.176,
      },
      {
        value: "quart",
        label: "Quarts (US)",
        measurement: "volume",
        conversionToBase: 946.353,
      },
      {
        value: "gal",
        label: "Gallons (US)",
        measurement: "volume",
        conversionToBase: 3785.41,
      },
    ],
  },
  {
    key: "weight",
    label: "Weight",
    baseUnitLabel: "g",
    units: [
      {
        value: "mg",
        label: "Milligrams (mg)",
        measurement: "weight",
        conversionToBase: 0.001,
      },
      {
        value: "g",
        label: "Grams (g)",
        measurement: "weight",
        conversionToBase: 1,
      },
      {
        value: "kg",
        label: "Kilograms (kg)",
        measurement: "weight",
        conversionToBase: 1000,
      },
      {
        value: "oz",
        label: "Ounces (oz)",
        measurement: "weight",
        conversionToBase: 28.3495,
      },
      {
        value: "lb",
        label: "Pounds (lb)",
        measurement: "weight",
        conversionToBase: 453.592,
      },
    ],
  },
  {
    key: "length",
    label: "Length",
    baseUnitLabel: "m",
    units: [
      {
        value: "mm",
        label: "Millimeters (mm)",
        measurement: "length",
        conversionToBase: 0.001,
      },
      {
        value: "cm",
        label: "Centimeters (cm)",
        measurement: "length",
        conversionToBase: 0.01,
      },
      {
        value: "m",
        label: "Meters (m)",
        measurement: "length",
        conversionToBase: 1,
      },
      {
        value: "km",
        label: "Kilometers (km)",
        measurement: "length",
        conversionToBase: 1000,
      },
      {
        value: "inch",
        label: "Inches (in)",
        measurement: "length",
        conversionToBase: 0.0254,
      },
      {
        value: "ft",
        label: "Feet (ft)",
        measurement: "length",
        conversionToBase: 0.3048,
      },
      {
        value: "yd",
        label: "Yards (yd)",
        measurement: "length",
        conversionToBase: 0.9144,
      },
      {
        value: "mi",
        label: "Miles (mi)",
        measurement: "length",
        conversionToBase: 1609.34,
      },
    ],
  },
];

const UNIT_LIST: UnitMeta[] = MEASUREMENT_GROUPS.flatMap((group) =>
  group.units.map((unit) => ({
    ...unit,
    groupLabel: group.label,
    baseUnitLabel: group.baseUnitLabel,
  }))
);

const UNIT_LOOKUP: Record<string, UnitMeta> = UNIT_LIST.reduce(
  (acc, unit) => {
    acc[unit.value] = unit;
    return acc;
  },
  {} as Record<string, UnitMeta>
);

const GROUPED_SELECT_DATA: ComboboxData = MEASUREMENT_GROUPS.map((group) => ({
  group: group.label,
  items: group.units.map((unit) => ({
    value: unit.value,
    label: unit.label,
  })),
}));

const OPTIONS_BY_MEASUREMENT: Record<MeasurementKey, ComboboxItem[]> =
  MEASUREMENT_GROUPS.reduce((acc, group) => {
    acc[group.key] = group.units.map((unit) => ({
      value: unit.value,
      label: unit.label,
    }));
    return acc;
  }, {} as Record<MeasurementKey, ComboboxItem[]>);

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 4,
});

export default function Home() {
  const [products, setProducts] = useState<ProductInput[]>([
    { price: "", amount: "", unit: null },
    { price: "", amount: "", unit: null },
  ]);

  const [activeMeasurement, setActiveMeasurement] = useState<
    MeasurementKey | undefined
  >(undefined);
  const [lastUpdatedIndex, setLastUpdatedIndex] = useState<number | null>(null);

  const normalizedProducts = useMemo<(NormalizedProduct | null)[]>(() => {
    return products.map((product) => {
      if (!product.unit) {
        return null;
      }

      const unitMeta = UNIT_LOOKUP[product.unit];

      if (!unitMeta) {
        return null;
      }

      const price =
        typeof product.price === "number"
          ? product.price
          : Number(product.price);
      const amount =
        typeof product.amount === "number"
          ? product.amount
          : Number(product.amount);

      if (!Number.isFinite(price) || price <= 0) {
        return null;
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        return null;
      }

      const baseAmount = amount * unitMeta.conversionToBase;

      if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
        return null;
      }

      return {
        pricePerBase: price / baseAmount,
        baseAmount,
        baseUnitLabel: unitMeta.baseUnitLabel,
        measurement: unitMeta.measurement,
      };
    });
  }, [products]);

  const cheapestInfo = useMemo(() => {
    const entries = normalizedProducts
      .map((product, index) =>
        product ? { index, ...product } : null
      )
      .filter(
        (
          entry
        ): entry is (NormalizedProduct & { index: number }) => entry !== null
      );

    if (entries.length === 0) {
      return { cheapestIndices: [] as number[], baseUnitLabel: undefined };
    }

    const measurementToCompare =
      activeMeasurement ?? entries[0].measurement ?? undefined;

    const comparable = measurementToCompare
      ? entries.filter(
        (entry) => entry.measurement === measurementToCompare
      )
      : entries;

    if (comparable.length === 0) {
      return { cheapestIndices: [] as number[], baseUnitLabel: undefined };
    }

    if (comparable.length < 2) {
      return {
        cheapestIndices: [] as number[],
        baseUnitLabel: comparable[0]?.baseUnitLabel,
      };
    }

    const minPrice = Math.min(
      ...comparable.map((entry) => entry.pricePerBase)
    );
    const tolerance = 1e-6;

    const cheapestIndices = comparable
      .filter(
        (entry) => Math.abs(entry.pricePerBase - minPrice) <= tolerance
      )
      .map((entry) => entry.index);

    return {
      cheapestIndices,
      baseUnitLabel: comparable[0]?.baseUnitLabel,
    };
  }, [activeMeasurement, normalizedProducts]);

  const handleNumberChange = (
    index: number,
    field: "price" | "amount",
    value: string | number
  ) => {
    setProducts((prev) => {
      const next = [...prev];
      let parsed: number | "" = "";

      if (value === "" || value === null) {
        parsed = "";
      } else if (typeof value === "number") {
        parsed = Number.isNaN(value) ? "" : value;
      } else {
        const numeric = Number(value);
        parsed = Number.isNaN(numeric) ? "" : numeric;
      }

      next[index] = {
        ...next[index],
        [field]: parsed,
      };

      return next;
    });
  };

  const handleUnitChange = (index: number, unitValue: string | null) => {
    let nextMeasurement: MeasurementKey | undefined;
    let nextLastUpdated: number | null = null;

    setProducts((prev) => {
      const next = prev.map((product, idx) =>
        idx === index ? { ...product, unit: unitValue } : product
      );

      if (unitValue) {
        const selected = UNIT_LOOKUP[unitValue];

        if (selected) {
          nextMeasurement = selected.measurement;
          nextLastUpdated = index;

          for (let i = 0; i < next.length; i += 1) {
            if (i === index) {
              continue;
            }
            const otherUnit = next[i].unit;
            if (!otherUnit) {
              continue;
            }
            const otherMeta = UNIT_LOOKUP[otherUnit];
            if (!otherMeta || otherMeta.measurement !== selected.measurement) {
              next[i] = { ...next[i], unit: null };
            }
          }
        }
      } else {
        for (let i = 0; i < next.length; i += 1) {
          const currentUnit = next[i].unit;
          if (!currentUnit) {
            continue;
          }
          const currentMeta = UNIT_LOOKUP[currentUnit];
          if (!currentMeta) {
            next[i] = { ...next[i], unit: null };
            continue;
          }
          if (!nextMeasurement) {
            nextMeasurement = currentMeta.measurement;
            nextLastUpdated = i;
          } else if (currentMeta.measurement !== nextMeasurement) {
            next[i] = { ...next[i], unit: null };
          }
        }
      }

      return next;
    });

    setActiveMeasurement(nextMeasurement);
    setLastUpdatedIndex(nextLastUpdated);
  };

  const handleAddProduct = () => {
    setProducts((prev) => [
      ...prev,
      { price: "", amount: "", unit: null },
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    if (products.length <= 2) {
      return;
    }

    let nextMeasurement: MeasurementKey | undefined;
    let nextLastUpdated: number | null = null;

    setProducts((prev) => {
      const next = prev
        .filter((_, idx) => idx !== index)
        .map((product) => ({ ...product }));

      for (let i = 0; i < next.length; i += 1) {
        const currentUnit = next[i].unit;
        if (!currentUnit) {
          continue;
        }
        const currentMeta = UNIT_LOOKUP[currentUnit];
        if (!currentMeta) {
          next[i] = { ...next[i], unit: null };
          continue;
        }
        if (!nextMeasurement) {
          nextMeasurement = currentMeta.measurement;
          nextLastUpdated = i;
        } else if (currentMeta.measurement !== nextMeasurement) {
          next[i] = { ...next[i], unit: null };
        }
      }

      return next;
    });

    setActiveMeasurement(nextMeasurement);
    setLastUpdatedIndex(nextLastUpdated);
  };

  const getSelectDataForIndex = (index: number): ComboboxData => {
    if (
      !activeMeasurement ||
      lastUpdatedIndex === null ||
      lastUpdatedIndex === index
    ) {
      return GROUPED_SELECT_DATA;
    }

    return OPTIONS_BY_MEASUREMENT[activeMeasurement] ?? GROUPED_SELECT_DATA;
  };

  return (
    <Stack gap="lg">
      <Title order={1}>Unit price calculator</Title>
      <Stack gap="lg">
        {products.map((product, index) => {
          const normalized = normalizedProducts[index];
          const selectData = getSelectDataForIndex(index);
          const isCheapest = cheapestInfo.cheapestIndices.includes(index);
          const cardBorderColor = isCheapest
            ? "var(--mantine-color-teal-4)"
            : undefined;
          const badgeColor = normalized
            ? isCheapest
              ? "teal"
              : "gray"
            : "gray";

          return (
            <Card
              key={`product-${index}`}
              withBorder
              shadow="sm"
              radius="lg"
              p="lg"
              style={
                cardBorderColor ? { borderColor: cardBorderColor } : undefined
              }
            >
              <Stack gap="md">
                <Group gap="xs" justify="space-between">
                  <Group gap="xs" align="center">
                    {normalized ? (
                      <Badge color={badgeColor} variant="light" radius="sm">
                        {`${currencyFormatter.format(normalized.pricePerBase)} / ${normalized.baseUnitLabel
                          }`}
                      </Badge>
                    ) : null}
                    {isCheapest && normalized ? (
                      <Badge color="teal" variant="filled" radius="sm">
                        Cheapest
                      </Badge>
                    ) : null}
                  </Group>
                  {products.length > 2 ?
                    <ThemeIcon
                      variant="outline"
                      aria-label="Remove product"
                      onClick={() => handleRemoveProduct(index)}
                    >
                      <IconTrash />
                    </ThemeIcon> : null
                  }

                </Group>

                <SimpleGrid
                  cols={{ base: 1, sm: 2, md: 3 }}
                  spacing={{ base: "sm", sm: "md" }}
                >
                  <NumberInput
                    label="Price"
                    leftSection={<IconCurrencyDollar />}
                    placeholder="0.00"
                    value={product.price}
                    min={0}
                    hideControls
                    size="sm"
                    inputMode="decimal"
                    onChange={(value) =>
                      handleNumberChange(index, "price", value)
                    }
                  />
                  <NumberInput
                    label="Amount"
                    leftSection={<IconX />}
                    placeholder="0"
                    value={product.amount}
                    min={0}
                    hideControls
                    size="sm"
                    inputMode="decimal"
                    onChange={(value) =>
                      handleNumberChange(index, "amount", value)
                    }
                  />
                  <Select
                    label="Unit"
                    placeholder="Select a unit"
                    searchable
                    clearable
                    nothingFoundMessage="No matching units"
                    size="sm"
                    data={selectData}
                    value={product.unit}
                    onChange={(value) => handleUnitChange(index, value)}
                  />
                </SimpleGrid>
              </Stack>
            </Card>
          );
        })}
      </Stack>

      <Button
        variant="light"
        size="md"
        leftSection="+"
        onClick={handleAddProduct}
        style={{ alignSelf: "flex-start" }}
      >
        Add product
      </Button>
    </Stack>
  );
}
