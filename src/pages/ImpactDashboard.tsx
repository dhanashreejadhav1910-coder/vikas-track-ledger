import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { getChain, getStats } from '../lib/blockchain';
import StatTile from '../components/StatTile';

Chart.register(...registerables);

const ImpactDashboard = () => {
  const stats = getStats();
  const chain = getChain().filter(b => b.index > 0);
  const sectorRef = useRef<HTMLCanvasElement>(null);
  const companyRef = useRef<HTMLCanvasElement>(null);
  const monthlyRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const charts: Chart[] = [];

    // Sector allocation (doughnut)
    if (sectorRef.current) {
      const sectorMap: Record<string, number> = {};
      chain.forEach(b => {
        const s = b.data.sector || 'Other';
        sectorMap[s] = (sectorMap[s] || 0) + b.data.amount;
      });
      charts.push(new Chart(sectorRef.current, {
        type: 'doughnut',
        data: {
          labels: Object.keys(sectorMap),
          datasets: [{ data: Object.values(sectorMap), backgroundColor: ['#0A7E8C', '#0D2A4A', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'] }],
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } },
      }));
    }

    // Top companies (bar)
    if (companyRef.current) {
      const compMap: Record<string, number> = {};
      chain.forEach(b => { compMap[b.data.company] = (compMap[b.data.company] || 0) + b.data.amount; });
      const sorted = Object.entries(compMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
      charts.push(new Chart(companyRef.current, {
        type: 'bar',
        data: {
          labels: sorted.map(s => s[0]),
          datasets: [{ label: 'Total (₹)', data: sorted.map(s => s[1]), backgroundColor: '#0A7E8C' }],
        },
        options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false } } },
      }));
    }

    // Monthly flow (line)
    if (monthlyRef.current) {
      const monthMap: Record<string, number> = {};
      chain.forEach(b => {
        const m = b.timestamp.slice(0, 7);
        monthMap[m] = (monthMap[m] || 0) + b.data.amount;
      });
      const sorted = Object.entries(monthMap).sort();
      charts.push(new Chart(monthlyRef.current, {
        type: 'line',
        data: {
          labels: sorted.map(s => s[0]),
          datasets: [{ label: 'Fund Flow (₹)', data: sorted.map(s => s[1]), borderColor: '#0A7E8C', backgroundColor: 'rgba(10,126,140,0.1)', fill: true, tension: 0.3 }],
        },
        options: { responsive: true },
      }));
    }

    return () => charts.forEach(c => c.destroy());
  }, []);

  return (
    <div className="page-container">
      <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--deep-navy)' }}>
        📊 Impact Dashboard
      </h2>
      <p className="text-muted">CSR fund impact visualized in real-time</p>

      <div className="row g-4 mb-4">
        <div className="col-6 col-md-3"><StatTile icon="💰" value={`₹${(stats.totalFunds / 100000).toFixed(1)}L`} label="Total Funds" /></div>
        <div className="col-6 col-md-3"><StatTile icon="🏢" value={stats.totalCompanies} label="Companies" /></div>
        <div className="col-6 col-md-3"><StatTile icon="🤝" value={stats.totalNGOs} label="NGOs" /></div>
        <div className="col-6 col-md-3"><StatTile icon="🔗" value={stats.totalBlocks} label="Blocks" /></div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 style={{ fontFamily: 'Poppins', fontWeight: 600 }}>Sector Allocation</h6>
              <canvas ref={sectorRef}></canvas>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 style={{ fontFamily: 'Poppins', fontWeight: 600 }}>Top Companies by Contribution</h6>
              <canvas ref={companyRef}></canvas>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 style={{ fontFamily: 'Poppins', fontWeight: 600 }}>Monthly Fund Flow</h6>
              <canvas ref={monthlyRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboard;
