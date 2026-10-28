import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Unlock, Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MemorySpace, CampusSpot } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface TimeCapsuleCardProps {
  space: MemorySpace;
  spot?: CampusSpot | null;
  mediaCount?: number;
}

export const TimeCapsuleCard: React.FC<TimeCapsuleCardProps> = ({ space, spot, mediaCount = 0 }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    if (!space.unlock_date) return;

    const calculateTime = () => {
      const target = new Date(space.unlock_date!).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [space.unlock_date]);

  const triggerConfetti = (e: React.MouseEvent) => {
    if (timeLeft.isPast) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const isUnlocked = timeLeft.isPast;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover with Frosted Lock Effect */}
        <div className="relative aspect-16/9 overflow-hidden bg-slate-900">
          <ImageWithFallback
            src={space.cover_url}
            alt={space.title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              !isUnlocked ? 'filter blur-md brightness-50 scale-105' : 'filter brightness-95'
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent"></div>

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            {isUnlocked ? (
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500 text-white flex items-center gap-1.5 shadow-md">
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlocked! 🔓</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500 text-white flex items-center gap-1.5 shadow-md">
                <Lock className="w-3.5 h-3.5" />
                <span>Locked Capsule 🔒</span>
              </span>
            )}
          </div>

          {/* Centered Message & Lock Visual */}
          {!isUnlocked ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white mb-2 shadow-lg animate-pulse">
                <Lock className="w-6 h-6" />
              </div>
              <p className="text-xs font-medium text-white/90 drop-shadow-sm max-w-xs">
                "This memory is waiting for its moment."
              </p>
            </div>
          ) : (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <Sparkles className="w-4 h-4" />
              <span>Memories Revealed • Ready to Relive</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-bold text-lg text-slate-900 leading-snug">{space.title}</h3>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{space.description}</p>

          {/* Real-time Ticking Countdown / Status Box */}
          <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            {!isUnlocked ? (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Countdown to Unlock</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-lg font-black text-slate-900 font-mono">{timeLeft.days}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Days</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-lg font-black text-slate-900 font-mono">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">Hours</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-lg font-black text-slate-900 font-mono">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">Mins</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-lg font-black text-amber-600 font-mono">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">Secs</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  🎉
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Capsule Opened!</div>
                  <div className="text-[11px] text-slate-500">
                    All {mediaCount} campus archives and memories are unlocked for viewing.
                  </div>
                </div>
              </div>
            )}

            <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>
                  Unlock Date: {space.unlock_date ? new Date(space.unlock_date).toLocaleDateString() : 'N/A'}
                </span>
              </span>
              {spot && <span className="font-semibold text-indigo-600">{spot.spot_name}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 pb-6 pt-1">
        {isUnlocked ? (
          <Link
            to={`/spaces/${space.space_id}`}
            onClick={triggerConfetti}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs shadow-emerald-100"
          >
            <span>Open Unlocked Memory Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            to={`/spaces/${space.space_id}`}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>View Vault Details</span>
          </Link>
        )}
      </div>
    </div>
  );
};
