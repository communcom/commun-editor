// @flow

export default function getExtension(fileName: string): string {
  if (!fileName || typeof fileName !== "string") {
    throw new Error("Path must be a string");
  }

  const parts = fileName.split("/");

  const lastPart = parts[parts.length - 1];

  if (!lastPart) {
    return "";
  }

  const match = lastPart.match(/\.([^.]+)$/);

  if (match) {
    return match[1];
  }

  return "";
}
