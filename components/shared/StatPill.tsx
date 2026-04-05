export default function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 bg-grey-100 rounded-lg px-4 py-3">
      <span className="text-[10px] uppercase tracking-widest text-grey-500 font-medium whitespace-nowrap">
        {label}
      </span>
      <span className="text-sm font-semibold text-grey-900">{value}</span>
    </div>
  );
}