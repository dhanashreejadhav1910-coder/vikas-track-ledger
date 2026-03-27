const StatTile = ({ icon, value, label }: { icon: string; value: string | number; label: string }) => (
  <div className="stat-tile text-center">
    <div style={{ fontSize: '1.8rem' }}>{icon}</div>
    <div className="stat-number">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);
export default StatTile;
