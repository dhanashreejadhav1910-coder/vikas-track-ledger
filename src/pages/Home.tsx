import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatTile from '../components/StatTile';
import { getStats, seedMockData } from '../lib/blockchain';

const Home = () => {
  const [stats, setStats] = useState(getStats());

  useEffect(() => {
    seedMockData();
    setStats(getStats());
  }, []);

  const utilization = stats.totalFunds > 0 ? Math.min(Math.round((stats.verifiedCount / stats.totalBlocks) * 100), 100) : 0;

  return (
    <>
      {/* Hero */}
      <section className="hero-section d-flex align-items-center">
        <div className="container text-center py-5">
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '2.8rem' }}>
            Vikas-Track
          </h1>
          <p className="lead mt-3 mb-4" style={{ maxWidth: 600, margin: '0 auto', opacity: 0.9 }}>
            The Shadow Blockchain Transparency Engine — every rupee tracked, hashed, and verified.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/ledger" className="btn btn-teal btn-lg px-4">View Public Ledger</Link>
            <Link to="/corporate" className="btn btn-outline-light btn-lg px-4">Corporate Portal</Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ backgroundColor: 'var(--deep-navy)', padding: '1.2rem 0' }}>
        <div className="container">
          <div className="row g-3 text-center" style={{ color: 'white' }}>
            {[
              { v: `₹${(stats.totalFunds / 100000).toFixed(1)}L`, l: 'Total Funds Tracked' },
              { v: stats.totalBlocks, l: 'Blocks Created' },
              { v: stats.totalCompanies, l: 'Companies' },
              { v: stats.totalNGOs, l: 'NGOs' },
            ].map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div style={{ fontSize: '1.5rem', fontFamily: 'Poppins', fontWeight: 700 }}>{s.v}</div>
                <small style={{ opacity: 0.7 }}>{s.l}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="page-container">
        {/* Navigation Tiles */}
        <div className="row g-4 my-4">
          {[
            { icon: '🏢', title: 'Corporate Dashboard', desc: 'Deposit CSR funds & generate Vikas Tokens', to: '/corporate' },
            { icon: '🤝', title: 'NGO Dashboard', desc: 'Upload invoices & verify fund utilization', to: '/ngo' },
            { icon: '🔍', title: 'Public Ledger', desc: 'Explore the transparent blockchain ledger', to: '/ledger' },
            { icon: '📊', title: 'Impact Dashboard', desc: 'Visualize CSR impact with live charts', to: '/impact' },
          ].map((t, i) => (
            <div className="col-md-6 col-lg-3" key={i}>
              <Link to={t.to} className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                  <div className="card-body text-center py-4">
                    <div style={{ fontSize: '2.5rem' }}>{t.icon}</div>
                    <h5 className="mt-3" style={{ fontFamily: 'Poppins', fontWeight: 600, color: 'var(--deep-navy)' }}>{t.title}</h5>
                    <p className="text-muted small mb-0">{t.desc}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Impact Meter */}
        <div className="card border-0 shadow-sm p-4 mt-4">
          <h5 style={{ fontFamily: 'Poppins', fontWeight: 600, color: 'var(--deep-navy)' }}>
            🌍 Live Impact Meter
          </h5>
          <p className="text-muted small">Overall fund utilization transparency score</p>
          <div style={{ background: '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
            <div className="impact-meter-bar" style={{ width: `${utilization}%` }}></div>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <small className="text-muted">0%</small>
            <small style={{ color: 'var(--civic-teal)', fontWeight: 600 }}>{utilization}% Verified</small>
            <small className="text-muted">100%</small>
          </div>
        </div>

        {/* Stats */}
        <div className="row g-4 mt-4">
          <div className="col-6 col-md-3"><StatTile icon="✅" value={stats.verifiedCount} label="Verified" /></div>
          <div className="col-6 col-md-3"><StatTile icon="⏳" value={stats.pendingCount} label="Pending" /></div>
          <div className="col-6 col-md-3"><StatTile icon="🚩" value={stats.flaggedCount} label="Flagged" /></div>
          <div className="col-6 col-md-3"><StatTile icon="🔗" value={stats.totalBlocks} label="Total Blocks" /></div>
        </div>
      </div>
    </>
  );
};

export default Home;
