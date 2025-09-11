import React, { useEffect, useRef } from 'react';
import './StatsCard.css';
import { motion } from 'framer-motion';
import anime from 'animejs';

const StatsCard = ({ title, value, change, changeType, icon, color = 'default' }) => {
  const valueRef = useRef(null);

  useEffect(() => {
    if (!valueRef.current) return;
    // Count-up animation using Anime.js
    const numeric = parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0;
    const obj = { val: 0 };
    anime({
      targets: obj,
      val: numeric,
      duration: 1000,
      easing: 'easeOutQuad',
      update: () => {
        if (valueRef.current) valueRef.current.textContent = String(Math.floor(obj.val)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    });
  }, [value]);

  return (
    <motion.div
      className={`stat-card ${color} bg-white rounded-xl shadow-soft p-4 md:p-5 hover:shadow-lg transition-shadow`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="stat-header flex items-center gap-4">
        <div className="stat-icon text-2xl">{icon}</div>
        <div className="stat-info">
          <p className="stat-label text-slate-600 text-sm">{title}</p>
          <h3 className="stat-value text-2xl font-semibold text-eco">
            <span ref={valueRef}>{value}</span>
          </h3>
          {change && (
            <span className={`stat-change ${changeType} text-xs ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {change} from last month
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;


