export default function Section({ title, items, mono = false, defaultOpen = true }) {
  if (!items || items.length === 0) return null;
  return (
    <details open={defaultOpen} className="rounded-2xl border border-slate-200 bg-white p-4">
      <summary className="cursor-pointer select-none text-sm font-semibold text-slate-900">{title}</summary>
      <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {items.map((item, index) => (
          <div key={index} className={`rounded-xl bg-slate-50 px-3 py-2 ${mono ? "font-mono text-[13px]" : ""}`}>
            {item}
          </div>
        ))}
      </div>
    </details>
  );
}
