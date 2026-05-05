"use client";

import {
  Card,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
  type ComboboxData,
  type ComboboxItem,
} from "@mantine/core";
import { IconArrowsExchange, IconRulerMeasure } from "@tabler/icons-react";
import { useMemo, useState } from "react";

type DimensionKey = "length" | "weight" | "volume" | "area";

type UnitDefinition = {
  value: string;
  label: string;
  shortLabel: string;
  dimension: DimensionKey;
  conversionToBase: number;
};

type UnitGroup = {
  key: DimensionKey;
  label: string;
  baseUnitLabel: string;
  units: UnitDefinition[];
};

type UnitMeta = UnitDefinition & {
  groupLabel: string;
  baseUnitLabel: string;
};

const UNIT_GROUPS: UnitGroup[] = [
  {
    key: "length",
    label: "Length",
    baseUnitLabel: "m",
    units: [
      {
        value: "mm",
        label: "Millimeters (mm)",
        shortLabel: "mm",
        dimension: "length",
        conversionToBase: 0.001,
      },
      {
        value: "cm",
        label: "Centimeters (cm)",
        shortLabel: "cm",
        dimension: "length",
        conversionToBase: 0.01,
      },
      {
        value: "m",
        label: "Meters (m)",
        shortLabel: "m",
        dimension: "length",
        conversionToBase: 1,
      },
      {
        value: "km",
        label: "Kilometers (km)",
        shortLabel: "km",
        dimension: "length",
        conversionToBase: 1000,
      },
      {
        value: "in",
        label: "Inches (in)",
        shortLabel: "in",
        dimension: "length",
        conversionToBase: 0.0254,
      },
      {
        value: "ft",
        label: "Feet (ft)",
        shortLabel: "ft",
        dimension: "length",
        conversionToBase: 0.3048,
      },
      {
        value: "yd",
        label: "Yards (yd)",
        shortLabel: "yd",
        dimension: "length",
        conversionToBase: 0.9144,
      },
      {
        value: "mi",
        label: "Miles (mi)",
        shortLabel: "mi",
        dimension: "length",
        conversionToBase: 1609.344,
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
        shortLabel: "mg",
        dimension: "weight",
        conversionToBase: 0.001,
      },
      {
        value: "g",
        label: "Grams (g)",
        shortLabel: "g",
        dimension: "weight",
        conversionToBase: 1,
      },
      {
        value: "kg",
        label: "Kilograms (kg)",
        shortLabel: "kg",
        dimension: "weight",
        conversionToBase: 1000,
      },
      {
        value: "oz",
        label: "Ounces (oz)",
        shortLabel: "oz",
        dimension: "weight",
        conversionToBase: 28.349523125,
      },
      {
        value: "lb",
        label: "Pounds (lb)",
        shortLabel: "lb",
        dimension: "weight",
        conversionToBase: 453.59237,
      },
      {
        value: "st",
        label: "Stone (st)",
        shortLabel: "st",
        dimension: "weight",
        conversionToBase: 6350.29318,
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
        shortLabel: "mL",
        dimension: "volume",
        conversionToBase: 1,
      },
      {
        value: "l",
        label: "Liters (L)",
        shortLabel: "L",
        dimension: "volume",
        conversionToBase: 1000,
      },
      {
        value: "tsp",
        label: "Teaspoons (US)",
        shortLabel: "tsp",
        dimension: "volume",
        conversionToBase: 4.92892159375,
      },
      {
        value: "tbsp",
        label: "Tablespoons (US)",
        shortLabel: "tbsp",
        dimension: "volume",
        conversionToBase: 14.78676478125,
      },
      {
        value: "floz",
        label: "Fluid ounces (US fl oz)",
        shortLabel: "fl oz",
        dimension: "volume",
        conversionToBase: 29.5735295625,
      },
      {
        value: "cup",
        label: "Cups (US)",
        shortLabel: "cup",
        dimension: "volume",
        conversionToBase: 236.5882365,
      },
      {
        value: "pt",
        label: "Pints (US)",
        shortLabel: "pt",
        dimension: "volume",
        conversionToBase: 473.176473,
      },
      {
        value: "qt",
        label: "Quarts (US)",
        shortLabel: "qt",
        dimension: "volume",
        conversionToBase: 946.352946,
      },
      {
        value: "gal",
        label: "Gallons (US)",
        shortLabel: "gal",
        dimension: "volume",
        conversionToBase: 3785.411784,
      },
    ],
  },
  {
    key: "area",
    label: "Area",
    baseUnitLabel: "m2",
    units: [
      {
        value: "sqcm",
        label: "Square centimeters (cm2)",
        shortLabel: "cm2",
        dimension: "area",
        conversionToBase: 0.0001,
      },
      {
        value: "sqm",
        label: "Square meters (m2)",
        shortLabel: "m2",
        dimension: "area",
        conversionToBase: 1,
      },
      {
        value: "hectare",
        label: "Hectares (ha)",
        shortLabel: "ha",
        dimension: "area",
        conversionToBase: 10000,
      },
      {
        value: "sqin",
        label: "Square inches (in2)",
        shortLabel: "in2",
        dimension: "area",
        conversionToBase: 0.00064516,
      },
      {
        value: "sqft",
        label: "Square feet (ft2)",
        shortLabel: "ft2",
        dimension: "area",
        conversionToBase: 0.09290304,
      },
      {
        value: "sqyd",
        label: "Square yards (yd2)",
        shortLabel: "yd2",
        dimension: "area",
        conversionToBase: 0.83612736,
      },
      {
        value: "acre",
        label: "Acres",
        shortLabel: "ac",
        dimension: "area",
        conversionToBase: 4046.8564224,
      },
    ],
  },
];

const UNIT_LIST: UnitMeta[] = UNIT_GROUPS.flatMap((group) =>
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

const GROUPED_UNIT_OPTIONS: ComboboxData = UNIT_GROUPS.map((group) => ({
  group: group.label,
  items: group.units.map((unit) => ({
    value: unit.value,
    label: unit.label,
  })),
}));

const OPTIONS_BY_DIMENSION: Record<DimensionKey, ComboboxItem[]> =
  UNIT_GROUPS.reduce((acc, group) => {
    acc[group.key] = group.units.map((unit) => ({
      value: unit.value,
      label: unit.label,
    }));
    return acc;
  }, {} as Record<DimensionKey, ComboboxItem[]>);

const resultFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 8,
});

const compactFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 4,
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

export default function UnitConversionCalculatorPage() {
  const [quantity, setQuantity] = useState<number | "">("");
  const [sourceUnit, setSourceUnit] = useState<string | null>(null);
  const [targetUnit, setTargetUnit] = useState<string | null>(null);

  const selectedSource = sourceUnit ? UNIT_LOOKUP[sourceUnit] : undefined;
  const selectedTarget = targetUnit ? UNIT_LOOKUP[targetUnit] : undefined;

  const targetOptions = selectedSource
    ? OPTIONS_BY_DIMENSION[selectedSource.dimension]
    : [];

  const conversion = useMemo(() => {
    if (
      typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      !selectedSource ||
      !selectedTarget
    ) {
      return null;
    }

    const baseQuantity = quantity * selectedSource.conversionToBase;
    const convertedQuantity = baseQuantity / selectedTarget.conversionToBase;

    if (!Number.isFinite(convertedQuantity)) {
      return null;
    }

    return {
      baseQuantity,
      convertedQuantity,
    };
  }, [quantity, selectedSource, selectedTarget]);

  const handleSourceChange = (value: string | null) => {
    setSourceUnit(value);

    if (!value) {
      setTargetUnit(null);
      return;
    }

    const nextSource = UNIT_LOOKUP[value];
    if (!nextSource || selectedTarget?.dimension !== nextSource.dimension) {
      setTargetUnit(null);
    }
  };

  return (
    <Stack gap="xl">
      <Stack gap="sm">
        <Title order={1} className="section-title">
          Unit conversion calculator
        </Title>
        <Text className="lede">
          Convert quantities across compatible length, weight, volume, and area
          units. Target units unlock after you choose the original unit.
        </Text>
      </Stack>

      <Card className="tool-card" p={{ base: "md", sm: "lg" }}>
        <Stack gap="lg">
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={{ base: "md", sm: "lg" }}>
            <NumberInput
              label="Quantity"
              placeholder="0"
              leftSection={<IconRulerMeasure size={18} />}
              value={quantity}
              hideControls
              size="sm"
              inputMode="decimal"
              onChange={(value) => setQuantity(parseNumberInput(value))}
            />
            <Select
              label="Units"
              placeholder="Select unit"
              data={GROUPED_UNIT_OPTIONS}
              value={sourceUnit}
              searchable
              clearable
              size="sm"
              onChange={handleSourceChange}
            />
            <Select
              label="Target units"
              placeholder={
                selectedSource ? "Select target unit" : "Select units first"
              }
              data={targetOptions}
              value={targetUnit}
              searchable
              clearable
              disabled={!selectedSource}
              leftSection={<IconArrowsExchange size={18} />}
              size="sm"
              onChange={setTargetUnit}
            />
          </SimpleGrid>

          {selectedSource ? (
            <Group gap="xs">
              <span className="stat-chip">{selectedSource.groupLabel}</span>
              <span className="stat-chip">
                Base: {selectedSource.baseUnitLabel}
              </span>
            </Group>
          ) : null}
        </Stack>
      </Card>

      <Card
        className={conversion ? "result-card" : "tool-card"}
        p={{ base: "md", sm: "lg" }}
      >
        {conversion && selectedSource && selectedTarget ? (
          <Stack gap="md">
            <Group justify="space-between" align="flex-end" gap="lg">
              <Stack gap={4}>
                <Text size="sm" className="result-muted">
                  Converted quantity
                </Text>
                <Text className="result-number">
                  {resultFormatter.format(conversion.convertedQuantity)}
                </Text>
              </Stack>
              <span className="stat-chip" data-tone="success">
                {selectedTarget.shortLabel}
              </span>
            </Group>

            <Text className="result-muted">
              {compactFormatter.format(quantity as number)}{" "}
              {selectedSource.shortLabel} equals{" "}
              {resultFormatter.format(conversion.convertedQuantity)}{" "}
              {selectedTarget.shortLabel}.
            </Text>
          </Stack>
        ) : (
          <Text className="quiet-text">
            Enter a quantity, choose its unit, then choose a compatible target
            unit.
          </Text>
        )}
      </Card>
    </Stack>
  );
}
