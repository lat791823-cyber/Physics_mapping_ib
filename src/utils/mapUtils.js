export function buildStageX(stages) {
  return Object.fromEntries(stages.map((stage, i) => [stage, 180 + i * 260]));
}

export function buildDomainY(domains) {
  return Object.fromEntries(domains.map((domain, i) => [domain, 150 + i * 250]));
}

export function pos(stage, domain, slot, stageX, domainY) {
  return { x: stageX[stage], y: domainY[domain] + slot * 78 };
}

export function matchesQuery(node, query) {
  if (!query.trim()) return true;
  const haystack = [
    node.label,
    node.kind,
    node.stage,
    node.domain,
    node.level,
    node.formula || "",
    node.summary || "",
    node.details || "",
    ...(node.derivation || []),
    ...(node.enabling || []),
    ...(node.units || []),
    ...(node.assumptions || []),
    ...(node.commonMistakes || []),
    ...(node.ibUse || []),
    node.bridgeNote || "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}
