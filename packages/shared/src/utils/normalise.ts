/**
 * Normalise entity name to create a valid Firestore document ID
 * Examples: "Bouncy Bug" -> "bouncy-bug", "Mix-Up Mouse" -> "mix-up-mouse"
 */
export function normaliseEntityName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}
