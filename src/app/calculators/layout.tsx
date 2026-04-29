"use client";

import { CALCULATORS } from "@/data/calculators";
import {
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
    <Stack gap="xs">
      {CALCULATORS.map((calculator) => {
        const isActive =
          pathname === calculator.href ||
          pathname.startsWith(`${calculator.href}/`);

        return (
          <Card
            key={calculator.slug}
            className="tool-link"
            data-active={isActive}
            p="md"
            component={Link}
            href={calculator.href}
            shadow="none"
            onClick={onNavigate}
          >
            <Stack gap={8}>
              <Text className="meta-label">{calculator.eyebrow}</Text>
              <Group justify="space-between" gap="xs" wrap="nowrap">
                <Text fw={760}>{calculator.name}</Text>
                <IconArrowRight size={16} stroke={1.8} />
              </Group>
              <Text size="sm" className="quiet-text">
                {calculator.shortDescription}
              </Text>
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
    <main className="app-shell">
      <Container size="lg" py={{ base: "xl", md: 56 }}>
        <Group
          className="mobile-topbar"
          justify="space-between"
          align="center"
          mb="md"
          hiddenFrom="md"
        >
          <Group gap="xs">
            <Burger
              opened={mobileNavOpened}
              onClick={toggleMobileNav}
              aria-label="Toggle calculator menu"
              size="sm"
            />
            <span className="brand-mark">Nifty Lab</span>
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
          gap={{ base: "xl", md: 44 }}
          align="flex-start"
        >
          <Card
            className="tool-panel"
            p="lg"
            visibleFrom="md"
            style={{
              flexShrink: 0,
              flexBasis: "min(320px, 100%)",
            }}
          >
            <Stack gap="lg">
              <Stack gap={4}>
                <span className="brand-mark">Nifty Lab</span>
                <Text className="meta-label" mt="md">
                  Switch tools
                </Text>
              </Stack>
              <CalculatorLinks pathname={pathname} />
            </Stack>
          </Card>

          <Stack gap="xl" flex={1} w="100%">
            {children}
          </Stack>
        </Flex>
      </Container>
    </main>
  );
}
