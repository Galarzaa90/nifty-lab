"use client";

import { Text } from "@mantine/core";
import { useMemo } from "react";

type BuildDateProps = {
  value: string;
};

export function BuildDate({ value }: BuildDateProps) {
  const formattedDate = useMemo(() => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "long",
    }).format(date);
  }, [value]);

  return (
    <Text ff="monospace" ta="right">
      {formattedDate}
    </Text>
  );
}
