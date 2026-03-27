import { useState } from 'react';
import { addBlock, getChain, type BlockData } from '../lib/blockchain';
import StatusBadge from '../components/StatusBadge';

const CorporateDashboard = () => {
  const [company, setCompany] = useState('');
  const [ngo, setNgo] = useState('');
  const [amount, setAmount] = useState('');
  const [projectId, setProjectId] = useState('');
  const [sector, setSector] = useState('Education');
  const [blocks, setBlocks] = useState(getChain().filter(b => b.data.type === 'deposit' && b.index > 0));
  const [lastHash, setLastHash] = useState('');

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !ngo || !amount || !projectId) return;
    const data: BlockData = {
      company, ngo, amount: Number(amount), project_id: projectId,
      invoice_hash: '', type: 'deposit', status: 'Verified', sector,
    };
    const block = addBlock(data);
    setLastHash(block.current_hash);
    setBlocks(getChain().filter(b => b.data.type === 'deposit' && b.index > 0));
    setCompany(''); setNgo(''); setAmount(''); setProjectId('');
  };

  const totalDeposited = blocks.reduce((s, b) => s + b.data.amount, 0);

  return (
    <div className="page-container">
      <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--deep-navy)' }}>
        🏢 Corporate Dashboard
      </h2>
      <p className="text-muted">Deposit CSR funds and generate Vikas Tokens</p>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-tile text-center">
            <div className="stat-number">₹{(totalDeposited / 100000).toFixed(1)}L</div>
            <div className="stat-label">Total Deposited</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-tile text-center">
            <div className="stat-number">{totalDeposited.toLocaleString()}</div>
            <div className="stat-label">Vikas Tokens (1:1)</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-tile text-center">
            <div className="stat-number">{blocks.length}</div>
            <div className="stat-label">Deposit Blocks</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 style={{ fontFamily: 'Poppins', fontWeight: 600 }}>New Deposit</h5>
              <form onSubmit={handleDeposit}>
                <div className="mb-3">
                  <label className="form-label small">Company Name</label>
                  <input className="form-control" value={company} onChange={e => setCompany(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small">NGO Recipient</label>
                  <input className="form-control" value={ngo} onChange={e => setNgo(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Amount (₹)</label>
                  <input type="number" className="form-control" value={amount} onChange={e => setAmount(e.target.value)} required min="1" />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Project ID</label>
                  <input className="form-control" value={projectId} onChange={e => setProjectId(e.target.value)} placeholder="PRJ-XXX" required />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Sector</label>
                  <select className="form-select" value={sector} onChange={e => setSector(e.target.value)}>
                    {['Education', 'Healthcare', 'Environment', 'Water & Sanitation', 'Digital Literacy', 'Rural Development'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-teal w-100">
                  💰 Deposit & Create Block
                </button>
              </form>
              {lastHash && (
                <div className="alert alert-success mt-3 small">
                  ✅ Block created! Hash: <code>{lastHash.slice(0, 16)}...</code>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 style={{ fontFamily: 'Poppins', fontWeight: 600 }}>Recent Transactions</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead style={{ backgroundColor: 'var(--off-white)' }}>
                    <tr>
                      <th>#</th><th>Company</th><th>NGO</th><th>Amount</th><th>Project</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blocks.slice().reverse().map(b => (
                      <tr key={b.index}>
                        <td>{b.index}</td>
                        <td>{b.data.company}</td>
                        <td>{b.data.ngo}</td>
                        <td>₹{b.data.amount.toLocaleString()}</td>
                        <td><code>{b.data.project_id}</code></td>
                        <td><StatusBadge status={b.data.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateDashboard;
