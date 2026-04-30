"use client";

import { CALCULATORS } from "@/data/calculators";
import { Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export default function CalculatorsIndex() {
  return (
      <Stack gap="xl">
        <Stack gap="sm">
        <Title order={1} className="section-title">
          Pick a calculator
        </Title>
        <Text className="lede">
          Select a focused calculator and keep the inputs visible while you work.
        </Text>
      </Stack>

      <Stack gap="md">
        {CALCULATORS.map((calculator, index) => (
          <Card
            key={calculator.slug}
            className="tool-link"
            p="lg"
            component={Link}
            href={calculator.href}
            shadow="none"
          >
            <Stack gap="sm">
              <Group justify="space-between" gap="xs" wrap="nowrap">
                <Group gap="md" wrap="nowrap">
                  <Text ff="monospace" size="sm" className="quiet-text">
                    {(index + 1).toString().padStart(2, "0")}
                  </Text>
                  <Stack gap={3}>
                    <Title order={3} size="1.35rem">
                      {calculator.name}
                    </Title>
                  </Stack>
                </Group>
                <IconArrowRight size={20} stroke={1.8} />
              </Group>
              <Text className="quiet-text">{calculator.shortDescription}</Text>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
