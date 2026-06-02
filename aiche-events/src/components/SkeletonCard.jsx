// Shows a shimmering placeholder while real cards load
// Uses the .skeleton CSS class defined in index.css
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="skeleton h-44 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-20 rounded-full" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-12 w-full rounded" />
        <div className="skeleton h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export default SkeletonCard;
