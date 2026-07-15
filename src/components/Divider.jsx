export default function Divider({ className = 'py-20' }) {
  return (
    <div className={`flex w-full flex-col items-start ${className}`}>
      <div className="h-px w-full border-t border-dashed border-[#e8e8e8]" />
    </div>
  )
}
