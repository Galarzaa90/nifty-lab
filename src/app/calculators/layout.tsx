"use client";

import { CALCULATORS } from "@/data/calculators";
import {
  Badge,
  Burger,
  Card,
  Container,
  Drawer,
  Flex,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function CalculatorLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <Stack gap={4}>
      {CALCULATORS.map((calculator) => {
        const isActive =
          pathname === calculator.href ||
          pathname.startsWith(`${calculator.href}/`);

        return (
          <Card
            key={calculator.slug}
            withBorder
            p="md"
            radius="md"
            component={Link}
            href={calculator.href}
            shadow="none"
            onClick={onNavigate}
            style={{
              textDecoration: "none",
              borderColor: isActive
                ? "var(--mantine-color-blue-4)"
                : undefined,
            }}
          >
            <Stack gap={6}>
              <Group justify="space-between" gap="xs">
                <Text fw={600}>{calculator.name}</Text>
                <IconArrowRight size={16} />
              </Group>
              <Text size="sm" c="dimmed">
                {calculator.shortDescription}
              </Text>
              <Group gap={6}>
                {calculator.tags.map((tag) => (
                  <Badge key={tag} variant="light" color="gray" size="sm">
                    {tag}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileNavOpened, { toggle: toggleMobileNav, close: closeMobileNav }] =
    useDisclosure(false);

  return (
    <Container size="lg" py={{ base: "xl", md: "3xl" }}>
      <Group justify="space-between" align="center" mb="md" hiddenFrom="md">
        <Group gap="xs">
          <Burger
            opened={mobileNavOpened}
            onClick={toggleMobileNav}
            aria-label="Toggle calculator menu"
            size="sm"
          />
          <Text fw={600}>Nifty Lab</Text>
        </Group>
      </Group>

      <Drawer
        opened={mobileNavOpened}
        onClose={closeMobileNav}
        title="Nifty Lab"
        padding="lg"
        size="md"
        hiddenFrom="md"
      >
        <CalculatorLinks pathname={pathname} onNavigate={closeMobileNav} />
      </Drawer>

      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: "xl", md: "3xl" }}
        align="stretch"
      >
        <Card
          withBorder
          radius="lg"
          p="lg"
          shadow="sm"
          visibleFrom="md"
          style={{
            flexShrink: 0,
            flexBasis: "min(280px, 100%)",
          }}
        >
          <Stack gap="md">
            <Stack gap={4}>
              <Text fw={600} size="sm" c="dimmed" tt="uppercase">
                Calculators
              </Text>
              <Text size="lg" fw={600}>
                Switch tools
              </Text>
            </Stack>
            <CalculatorLinks pathname={pathname} />
          </Stack>
        </Card>

        <Stack gap="xl" flex={1}>
          {children}
        </Stack>
      </Flex>
    </Container>
  );
}
