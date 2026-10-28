import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Image as ImageIcon, Lock, Sparkles } from 'lucide-react';
import { MemorySpace, CampusSpot, FullUserProfile } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface SpaceCardProps {
  space: MemorySpace;
  spot?: CampusSpot | null;
  creator?: FullUserProfile | null;
  memberCount?: number;
  mediaCount?: number;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({
  space,
  spot,
  creator,
  memberCount = 1,
  mediaCount = 0,
}) => {
  const isLocked = space.is_time_locked && space.unlock_date && new Date(space.unlock_date) > new Date();

  return (
    <Link
      to={`/spaces/${space.space_id}`}
      className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
          <ImageWithFallback
            src={space.cover_url}
            alt={space.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

          {/* Type Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 text-slate-800 backdrop-blur-md shadow-xs">
              {space.space_type}
            </span>

            {isLocked && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                <Lock className="w-3 h-3" />
                <span>Time-Locked</span>
              </span>
            )}
          </div>

          {/* Spot Badge */}
          {spot && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-medium text-white/90 drop-shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-indigo-300" />
              <span>{spot.spot_name}</span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-5">
          <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {space.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {space.description || 'A collaborative memory space for NSUT campus experiences.'}
          </p>
        </div>
      </div>

      {/* Footer Details */}
      <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
            {creator?.full_name ? creator.full_name[0] : 'U'}
          </div>
          <span className="truncate max-w-[100px] text-slate-700 font-medium">
            {creator?.full_name || 'Student'}
          </span>
        </div>

        <div className="flex items-center gap-3 font-medium">
          <span className="flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>{mediaCount}</span>
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{memberCount}</span>
          </span>
        </div>
      </div>
    </Link>
  );
};
