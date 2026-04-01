import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Section from "./components/Section";
import { STAGES, DOMAINS_EXTENDED, nodes, edges, kindStyle, areaFilters } from "./data/mapData";
import { buildDomainY, buildStageX, matchesQuery, pos } from "./utils/mapUtils";

const stageFilters = ["All", ...STAGES];
const levelFilters = ["All", "IB Core", "University Bridge"];
const edgeTypeStyle = {
  concept: { stroke: "#94a3b8" },
  limit: { stroke: "#fb7185" },
  exam: { stroke: "#16a34a" },
};

const examPaths = [
  ["motiondefs", "newton2", "circularmotion"],
  ["thermaldefs", "gasequation"],
  ["inductiondef", "faraday", "generator"],
  ["nuclearstructure", "radioactive", "bindingenergy", "fissionfusion"],
];

export default function PhysicsConceptMap() {
  const [selectedNodeId, setSelectedNodeId] = useState("suvat");
  const [selectedEdgeId, setSelectedEdgeId] = useState("e4");
  const [areaFilter, setAreaFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [showLabels, setShowLabels] = useState(true);
  const [examPathMode, setExamPathMode] = useState(false);

  const stageX = useMemo(() => buildStageX(STAGES), []);
  const domainY = useMemo(() => buildDomainY(DOMAINS_EXTENDED), []);

  const visibleNodes = useMemo(() => {
    return nodes.filter((node) => {
      const areaOk = areaFilter === "All" || node.domain === areaFilter;
      const stageOk = stageFilter === "All" || node.stage === stageFilter;
      const levelOk = levelFilter === "All" || node.level === levelFilter;
      const queryOk = matchesQuery(node, query);
      const examOk = !examPathMode || examPaths.some((path) => path.includes(node.id));
      return areaOk && stageOk && levelOk && queryOk && examOk;
    });
  }, [areaFilter, stageFilter, levelFilter, query, examPathMode]);

  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = useMemo(() => edges.filter((e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)), [visibleNodeIds]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || visibleNodes[0] || nodes[0];
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId) || visibleEdges[0] || edges[0];

  const neighborIds = useMemo(() => {
    const ids = new Set([selectedNode?.id]);
    edges.forEach((edge) => {
      if (edge.source === selectedNode?.id) ids.add(edge.target);
      if (edge.target === selectedNode?.id) ids.add(edge.source);
    });
    return ids;
  }, [selectedNode]);

  const mapHeight = 330 + DOMAINS_EXTENDED.length * 250;

  return (
    <div className="min-h-screen w-full bg-slate-50 p-6">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Physics Knowledge Map — Structured IB to University Bridge</h1>
          <p className="mt-1 text-sm text-slate-600">Multi-file refactor with exam-path mode and color-coded edge types.</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="flex flex-wrap gap-2">{areaFilters.map((item) => <Button key={item} variant={areaFilter === item ? "default" : "outline"} className="rounded-2xl" onClick={() => setAreaFilter(item)}>{item}</Button>)}</div>
            <div className="flex flex-wrap gap-2">{stageFilters.map((item) => <Button key={item} variant={stageFilter === item ? "default" : "outline"} className="rounded-2xl" onClick={() => setStageFilter(item)}>{item}</Button>)}</div>
            <div className="flex flex-wrap gap-2">{levelFilters.map((item) => <Button key={item} variant={levelFilter === item ? "default" : "outline"} className="rounded-2xl" onClick={() => setLevelFilter(item)}>{item}</Button>)}</div>
          </div>
          <div className="mt-3 flex flex-col gap-3 md:flex-row">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="rounded-2xl" />
            <Button variant="outline" className="rounded-2xl" onClick={() => setShowLabels((s) => !s)}>{showLabels ? "Hide relation labels" : "Show relation labels"}</Button>
            <Button variant={examPathMode ? "default" : "outline"} className="rounded-2xl" onClick={() => setExamPathMode((s) => !s)}>{examPathMode ? "Exam-path mode: On" : "Exam-path mode: Off"}</Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <Card className="overflow-hidden rounded-3xl border-slate-200 shadow-sm"><CardContent className="p-0"><div className="overflow-x-auto bg-white">
            <svg viewBox={`0 0 1400 ${mapHeight}`} className="h-[980px] w-full min-w-[1260px]"><rect x="0" y="0" width="1400" height={mapHeight} fill="#f8fafc" />
              {STAGES.map((stage, index) => <g key={stage}><rect x={70 + index * 260} y={32} width={220} height={mapHeight - 100} rx={28} fill="#ffffff" stroke="#e2e8f0" /><text x={180 + index * 260} y={72} textAnchor="middle" className="fill-slate-900 text-[16px] font-semibold">{stage}</text></g>)}
              {DOMAINS_EXTENDED.map((domain, idx) => <g key={domain}><rect x={20} y={110 + idx * 250} width={42} height={170} rx={18} fill="#0f172a" opacity="0.95" /><text transform={`translate(41 ${195 + idx * 250}) rotate(-90)`} textAnchor="middle" className="fill-white text-[13px] font-semibold">{domain}</text></g>)}

              {visibleEdges.map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.source);
                const targetNode = nodes.find((n) => n.id === edge.target);
                const source = pos(sourceNode.stage, sourceNode.domain, sourceNode.slot, stageX, domainY);
                const target = pos(targetNode.stage, targetNode.domain, targetNode.slot, stageX, domainY);
                const midX = (source.x + target.x) / 2;
                const midY = (source.y + target.y) / 2;
                const isSelected = selectedEdge?.id === edge.id;
                const baseColor = edgeTypeStyle[edge.type || "concept"].stroke;
                return (<g key={edge.id}><line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={isSelected ? "#0f172a" : baseColor} strokeWidth={isSelected ? 4 : 2.2} opacity={isSelected ? 1 : 0.8} /><line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="transparent" strokeWidth={18} className="cursor-pointer" onClick={() => { setSelectedEdgeId(edge.id); setSelectedNodeId(edge.source); }} />{showLabels && <g transform={`translate(${midX}, ${midY})`}><rect x={-52} y={-12} width={104} height={24} rx={10} fill="white" opacity={0.93} /><text textAnchor="middle" dominantBaseline="middle" className="fill-slate-600 text-[11px] font-medium">{edge.relation}</text></g>}</g>);
              })}

              {visibleNodes.map((node) => {
                const { x, y } = pos(node.stage, node.domain, node.slot, stageX, domainY);
                const isSelected = selectedNode?.id === node.id;
                const isNeighbor = neighborIds.has(node.id);
                return (<g key={node.id} transform={`translate(${x - 85}, ${y - 30})`} className="cursor-pointer" onClick={() => { setSelectedNodeId(node.id); setSelectedEdgeId(""); }} style={{ opacity: selectedNode ? (isNeighbor ? 1 : 0.52) : 1 }}><rect width="170" height="60" rx="18" fill={kindStyle[node.kind].fill} stroke={isSelected ? "#0f172a" : "#cbd5e1"} strokeWidth={isSelected ? 2.6 : 1.5} /><text x="85" y="21" textAnchor="middle" className="fill-slate-900 text-[14px] font-semibold">{node.label}</text><text x="85" y="39" textAnchor="middle" className="fill-slate-500 text-[11px]">{node.kind} · {node.level}</text><text x="85" y="52" textAnchor="middle" className="fill-slate-400 text-[10px]">{node.domain}</text></g>);
              })}
            </svg>
          </div></CardContent></Card>

          <div className="space-y-4">
            <motion.div layout><Card className="rounded-3xl border-slate-200 shadow-sm"><CardHeader><CardTitle className="text-lg">Selected Node</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><h2 className="text-xl font-semibold text-slate-900">{selectedNode.label}</h2><p className="text-sm text-slate-500">{selectedNode.domain} · {selectedNode.stage} · {selectedNode.kind} · {selectedNode.level}</p>{selectedNode.formula && <div className="mt-2 rounded-xl bg-white px-3 py-2 font-mono text-sm text-slate-800 ring-1 ring-slate-200">{selectedNode.formula}</div>}<p className="mt-2 text-sm leading-6 text-slate-700">{selectedNode.summary}</p></div>
              <Section title="Algebraic derivation" items={selectedNode.derivation} />
              <Section title="What makes it possible conceptually" items={selectedNode.enabling} />
              <Section title="Units" items={selectedNode.units} mono />
              <Section title="Assumptions" items={selectedNode.assumptions} />
              <Section title="Common mistakes" items={selectedNode.commonMistakes} />
              <Section title="Typical IB exam uses" items={selectedNode.ibUse} />
            </CardContent></Card></motion.div>

            <Card className="rounded-3xl border-slate-200 shadow-sm"><CardHeader><CardTitle className="text-lg">Selected Connection</CardTitle></CardHeader><CardContent><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="text-lg font-semibold text-slate-900">{selectedEdge.relation}</div><p className="mt-2 text-sm leading-6 text-slate-700">{selectedEdge.explanation}</p></div></CardContent></Card>
          </div>
        </div>
      </div>
    </div>
  );
}
