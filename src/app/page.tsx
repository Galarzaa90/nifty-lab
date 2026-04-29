import { CALCULATORS } from "@/data/calculators";
import { Card, Container, Group, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="app-shell">
      <Container size="xl" py={{ base: "md", md: "xl" }}>
        <div className="directory-shell">
          <aside className="directory-sidebar">
            <Stack gap="xl">
              <span className="brand-mark">Nifty Lab</span>
              <Stack gap="md">
                <Text className="sidebar-group-title">Greatest hits</Text>
                <Stack gap="xs">
                  {CALCULATORS.map((calculator) => (
                    <Link
                      key={calculator.slug}
                      className="mini-link"
                      href={calculator.href}
                    >
                      <Text size="sm" fw={650}>
                        {calculator.name}
                      </Text>
                    </Link>
                  ))}
                </Stack>
              </Stack>
              <Stack gap={4}>
                <Text className="sidebar-group-title">Notes</Text>
                <Text size="sm" className="quiet-text">
                  No accounts. No saved data. Just local calculations.
                </Text>
              </Stack>
            </Stack>
          </aside>

          <Stack className="directory-main" gap={44} py={{ md: "lg" }}>
            <span className="brand-mark">Nifty Lab</span>
            <Stack gap="lg" maw={760}>
              <Title order={1} className="page-title">
                Tiny calculators for ordinary decisions.
              </Title>
              <Text className="lede">
                A small collection of low-friction tools for checkout math,
                grocery comparisons, and the little numbers that interrupt your
                day.
              </Text>
            </Stack>

            <Stack gap="md">
              <Group justify="space-between" align="end">
                <Title order={2} size="1.35rem">
                  Calculators
                </Title>
                <Text ff="monospace" size="xs" className="quiet-text">
                  {CALCULATORS.length} tools
                </Text>
              </Group>
              <div className="home-tool-grid">
                {CALCULATORS.map((calculator) => (
                  <Card
                    key={calculator.slug}
                    className="tool-link"
                    p="lg"
                    component={Link}
                    href={calculator.href}
                    shadow="none"
                  >
                    <Stack gap="xs">
                      <Group justify="space-between" wrap="nowrap">
                        <Text className="meta-label">{calculator.eyebrow}</Text>
                        <IconArrowRight size={17} stroke={1.8} />
                      </Group>
                      <Text fw={720}>{calculator.name}</Text>
                      <Text size="sm" className="quiet-text">
                        {calculator.shortDescription}
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </div>
            </Stack>
          </Stack>
        </div>
      </Container>
    </main>
  );
}
