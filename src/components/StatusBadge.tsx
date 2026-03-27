const StatusBadge = ({ status }: { status: 'Verified' | 'Pending' | 'Flagged' }) => {
  const cls = status === 'Verified' ? 'badge-verified' : status === 'Pending' ? 'badge-pending' : 'badge-flagged';
  return <span className={`badge ${cls} px-2 py-1`}>{status}</span>;
};
export default StatusBadge;
