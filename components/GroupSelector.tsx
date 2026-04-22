"use client"

interface GroupSelectorProps {
  selectedGroup: number | null;
  onSelectGroup: (group: number) => void;
}

export default function GroupSelector({ selectedGroup, onSelectGroup }: GroupSelectorProps) {
  const groups = [1, 2, 3, 4];
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
      {groups.map((num) => (
        <button 
          key={num}
          onClick={() => onSelectGroup(num)}
          className={`p-4 rounded-xl border-2 font-bold transition-all ${
            selectedGroup === num 
              ? 'border-blue-600 bg-blue-100 text-blue-800 scale-105 shadow-md' 
              : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
          }`}
        >
          Kelompok {num}
        </button>
      ))}
    </div>
  );
}