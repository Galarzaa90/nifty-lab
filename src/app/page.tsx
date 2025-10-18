import Link from "next/link";
import {
  Anchor,
  Badge,
  Card,
  Container,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowRight, IconSparkles } from "@tabler/icons-react";
import { CALCULATORS } from "@/data/calculators";

export default function Home() {
  return (
    <Container size="lg" py={{ base: "xl", md: "3xl" }}>
      <Stack gap="xl">
        <Badge
          leftSection={<IconSparkles size={14} />}
          size="lg"
          radius="xl"
          variant="light"
          maw={200}
        >
          Nifty Lab
        </Badge>

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
            style={{
              flexShrink: 0,
              flexBasis: "min(280px, 100%)",
            }}
          >
            <Stack gap="md">
              <Text fw={600} size="sm" c="dimmed" tt="uppercase">
                Nifty Lab
              </Text>
              <Stack gap={4}>
                {CALCULATORS.map((calculator) => (
                  <Card
                    key={calculator.slug}
                    withBorder
                    p="md"
                    radius="md"
                    component={Link}
                    href={calculator.href}
                    shadow="none"
                    style={{ textDecoration: "none" }}
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
                ))}
              </Stack>
            </Stack>
          </Card>
        </Flex>
      </Stack>
    </Container>
  );
}
