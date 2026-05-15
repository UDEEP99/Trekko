"use client";

/**
 * ItinerarySkeleton — Premium skeleton loader that mimics the real Day Card layout.
 * Rendered while the AI generation API is fetching, replacing the basic spinner.
 * Uses Tailwind's animate-pulse with neutral blocks for a polished loading state.
 */
export default function ItinerarySkeleton() {
  return (
    <section className="px-6 pb-16">
      <div className="max-w-3xl mx-auto space-y-5">
        {[0, 1, 2].map((cardIdx) => (
          <div
            key={cardIdx}
            className="relative rounded-2xl p-6 bg-white/65 dark:bg-slate-900/55 backdrop-blur-md border border-gray-200/60 dark:border-slate-700/50 shadow-sm overflow-hidden"
            style={{ animationDelay: `${cardIdx * 0.12}s` }}
          >
            {/* Gradient accent bar skeleton */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-slate-700 animate-pulse" />

            {/* Day Header skeleton */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-20 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse" />
                <div
                  className="h-3 w-36 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse"
                  style={{ animationDelay: "0.15s" }}
                />
              </div>
            </div>

            {/* Activity rows skeleton */}
            <div className="space-y-3">
              {[0, 1, 2].map((actIdx) => (
                <div
                  key={actIdx}
                  className="flex items-start gap-3.5 p-4 rounded-xl bg-gray-50/80 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-700/30"
                >
                  {/* Left: time + icon */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0 w-14">
                    <div
                      className="h-3 w-12 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse"
                      style={{ animationDelay: `${actIdx * 0.1}s` }}
                    />
                    <div
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse"
                      style={{ animationDelay: `${actIdx * 0.1 + 0.05}s` }}
                    />
                  </div>

                  {/* Center: title + description lines */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div
                      className="h-4 w-3/5 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse"
                      style={{ animationDelay: `${actIdx * 0.1 + 0.1}s` }}
                    />
                    <div
                      className="h-3 w-full rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse"
                      style={{ animationDelay: `${actIdx * 0.1 + 0.15}s` }}
                    />
                    <div
                      className="h-3 w-4/5 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse"
                      style={{ animationDelay: `${actIdx * 0.1 + 0.2}s` }}
                    />
                    {/* Tour link skeleton */}
                    <div
                      className="h-6 w-24 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse mt-1"
                      style={{ animationDelay: `${actIdx * 0.1 + 0.25}s` }}
                    />
                  </div>

                  {/* Right: image thumbnail */}
                  <div
                    className="w-[4.5rem] h-[4.5rem] rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse flex-shrink-0"
                    style={{ animationDelay: `${actIdx * 0.1 + 0.1}s` }}
                  />
                </div>
              ))}
            </div>

            {/* Hotel banner skeleton */}
            <div className="mt-6 flex items-center gap-3.5 p-4 rounded-xl bg-gray-50/80 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-700/30">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse" />
                <div
                  className="h-3 w-1/2 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse"
                  style={{ animationDelay: "0.1s" }}
                />
              </div>
              <div
                className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse flex-shrink-0"
                style={{ animationDelay: "0.15s" }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
