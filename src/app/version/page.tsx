import { Card, Container, Group, Stack, Text, Title } from "@mantine/core";
import type { Metadata } from "next";
import { execSync } from "node:child_process";
import { BuildDate } from "./build-date";

export const metadata: Metadata = {
  title: "Version",
};

const getGitHash = () => {
  const envHash =
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.GITHUB_SHA ??
    process.env.COMMIT_SHA;

  if (envHash) {
    return envHash.slice(0, 12);
  }

  try {
    return execSync("git rev-parse --short=12 HEAD", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "unknown";
  }
};

const buildInfo = {
  buildDate: new Date().toISOString(),
  gitHash: getGitHash(),
};

export default function VersionPage() {
  return (
    <main className="app-shell">
      <Container size="xs" py={{ base: "xl", md: 96 }}>
        <Card className="tool-card" p={{ base: "lg", sm: "xl" }} shadow="none">
          <Stack gap="lg">
            <Stack gap={4}>
              <Text className="meta-label">Deployment</Text>
              <Title order={1} size="1.7rem">
                Version
              </Title>
            </Stack>

            <Stack gap="sm">
              <Group justify="space-between" gap="lg" wrap="nowrap">
                <Text className="quiet-text">Build Date</Text>
                <BuildDate value={buildInfo.buildDate} />
              </Group>
              <Group justify="space-between" gap="lg" wrap="nowrap">
                <Text className="quiet-text">Git Hash</Text>
                <Text ff="monospace" ta="right">
                  {buildInfo.gitHash}
                </Text>
              </Group>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </main>
  );
}
