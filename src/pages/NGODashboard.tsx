import { useState } from 'react';
import { addBlock, getChain, hashFile, type BlockData } from '../lib/blockchain';
import StatusBadge from '../components/StatusBadge';

const NGODashboard = () => {
  const [ngo, setNgo] = useState('');
  const [company, setCompany] = useState('');
  const [amount, setAmount] = useState('');
  const [projectId, setProjectId] = useState('');
  const [sector, setSector] = useState('Education');
  const [file, setFile] = useState<File | null>(null);
  const [invoiceHash, setInvoiceHash] = useState('');
  const [hashing, setHashing] = useState(false);
  const [lastHash, setLastHash] = useState('');
  const invoiceBlocks = getChain().filter(b => b.data.type === 'invoice' && b.index > 0);
  const [blocks, setBlocks] = useState(invoiceBlocks);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setHashing(true);
    const hash = await hashFile(f);
    setInvoiceHash(hash);
    setHashing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ngo || !company || !amount || !projectId || !invoiceHash) return;
    const data: BlockData = {
      company, ngo, amount: Number(amount), project_id: projectId,
      invoice_hash: invoiceHash, type: 'invoice', status: 'Pending', sector,
    };
    const block = addBlock(data);
    setLastHash(block.current_hash);
    setBlocks(getChain().filter(b => b.data.type === 'invoice' && b.index > 0));
    setNgo(''); setCompany(''); setAmount(''); setProjectId('');
    setFile(null); setInvoiceHash('');
  };

  const totalClaimed = blocks.reduce((s, b) => s + b.data.amount, 0);

  return (
    <div className="page-container">
      <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--deep-navy)' }}>
        🤝 NGO Dashboard
      </h2>
      <p className="text-muted">Upload invoices and verify fund utilization</p>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-tile text-center">
            <div className="stat-number">₹{(totalClaimed / 100000).toFixed(1)}L</div>
            <div className="stat-label">Total Claimed</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-tile text-center">
            <div className="stat-number">{blocks.length}</div>
            <div className="stat-label">Invoice Blocks</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-tile text-center">
            <div className="stat-number">{blocks.filter(b => b.data.status === 'Verified').length}</div>
            <div className="stat-label">Verified Invoices</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 style={{ fontFamily: 'Poppins', fontWeight: 600 }}>Upload Invoice</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small">NGO Name</label>
                  <input className="form-control" value={ngo} onChange={e => setNgo(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Funding Company</label>
                  <input className="form-control" value={company} onChange={e => setCompany(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Invoice Amount (₹)</label>
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
                <div className="mb-3">
                  <label className="form-label small">Invoice File (PDF)</label>
                  <input type="file" className="form-control" accept=".pdf" onChange={handleFileChange} />
                </div>
                {hashing && <div className="alert alert-info small">⏳ Generating SHA-256 hash...</div>}
                {invoiceHash && (
                  <div className="alert alert-secondary small">
                    🔒 SHA-256: <code>{invoiceHash.slice(0, 32)}...</code>
                  </div>
                )}
                <button type="submit" className="btn btn-teal w-100" disabled={!invoiceHash}>
                  📄 Submit Invoice & Create Block
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
              <h5 style={{ fontFamily: 'Poppins', fontWeight: 600 }}>Invoice Transactions</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead style={{ backgroundColor: 'var(--off-white)' }}>
                    <tr>
                      <th>#</th><th>NGO</th><th>Company</th><th>Amount</th><th>Invoice Hash</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blocks.slice().reverse().map(b => (
                      <tr key={b.index}>
                        <td>{b.index}</td>
                        <td>{b.data.ngo}</td>
                        <td>{b.data.company}</td>
                        <td>₹{b.data.amount.toLocaleString()}</td>
                        <td><code className="small">{b.data.invoice_hash.slice(0, 12)}...</code></td>
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

export default NGODashboard;
