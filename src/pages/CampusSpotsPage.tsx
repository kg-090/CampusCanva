import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Layers, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { CampusSpot, MemorySpace, MediaItem } from '../types';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const CampusSpotsPage: React.FC = () => {
  const [spots, setSpots] = useState<CampusSpot[]>([]);
  const [spaces, setSpaces] = useState<MemorySpace[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [st, sp, me] = await Promise.all([
          api.getCampusSpots(),
          api.getMemorySpaces(),
          api.getAllMedia(),
        ]);
        setSpots(st);
        setSpaces(sp);
        setMediaList(me);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>CAMPUS_SPOT Relational Entity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          NSUT Campus Landmarks
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Recognizable geographical spots where college experiences, fest nights, and daily memories
          happen.
        </p>
      </div>

      {/* Spots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spots.map((spot) => {
          const associatedSpaces = spaces.filter((s) => s.spot_id === spot.spot_id);
          const associatedSpaceIds = associatedSpaces.map((s) => s.space_id);
          const associatedMediaCount = mediaList.filter((m) =>
            associatedSpaceIds.includes(m.space_id)
          ).length;

          return (
            <Link
              key={spot.spot_id}
              to={`/explore?spot=${spot.spot_id}`}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Spot Cover Photo */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                  <ImageWithFallback
                    src={spot.cover_url}
                    alt={spot.spot_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="text-lg font-bold flex items-center gap-1.5 drop-shadow-sm">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      <span>{spot.spot_name}</span>
                    </div>
                  </div>
                </div>

                {/* Spot Description */}
                <div className="p-5">
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {spot.description}
                  </p>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{associatedSpaces.length} Spaces</span>
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{associatedMediaCount} Photos</span>
                  </span>
                </div>

                <div className="text-indigo-600 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
