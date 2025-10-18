"use client"
import { CALCULATORS } from "@/data/calculators";
import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export default function CalculatorsIndex() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Title order={1}>Pick a calculator</Title>
        <Text c="dimmed">
          Select a tool from the list to get started.
        </Text>
      </Stack>

      <Stack gap="md">
        {CALCULATORS.map((calculator) => (
          <Card
            key={calculator.slug}
            withBorder
            radius="lg"
            p="lg"
            component={Link}
            href={calculator.href}
            shadow="sm"
            style={{ textDecoration: "none" }}
          >
            <Stack gap="sm">
              <Group justify="space-between" gap="xs">
                <Title order={3} size="1.5rem">
                  {calculator.name}
                </Title>
                <IconArrowRight size={20} />
              </Group>
              <Text c="dimmed">{calculator.shortDescription}</Text>
              <Group gap={6}>
                {calculator.tags.map((tag) => (
                  <Badge key={tag} variant="light" color="gray" size="sm">
                    {tag}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
