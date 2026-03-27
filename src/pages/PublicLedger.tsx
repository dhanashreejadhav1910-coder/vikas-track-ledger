import { useState } from 'react';
import { getChain, type Block } from '../lib/blockchain';
import StatusBadge from '../components/StatusBadge';

const PublicLedger = () => {
  const chain = getChain();
  const [search, setSearch] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  const filtered = chain.filter(b => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      b.data.company.toLowerCase().includes(s) ||
      b.data.ngo.toLowerCase().includes(s) ||
      b.data.project_id.toLowerCase().includes(s) ||
      b.current_hash.toLowerCase().includes(s)
    );
  });

  return (
    <div className="page-container">
      <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--deep-navy)' }}>
        🔍 Public Ledger — Block Explorer
      </h2>
      <p className="text-muted">Etherscan-style transparency for CSR funds</p>

      <div className="mb-4">
        <input
          className="form-control form-control-lg"
          placeholder="Search by company, NGO, project ID, or hash..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ borderColor: 'var(--civic-teal)', borderWidth: 2 }}
        />
      </div>

      <div className="mb-3 text-muted small">
        Showing {filtered.length} of {chain.length} blocks
      </div>

      <div className="row g-3">
        {filtered.slice().reverse().map(b => (
          <div className="col-12" key={b.index}>
            <div
              className="block-card card border-0 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedBlock(b)}
            >
              <div className="card-body d-flex flex-wrap align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center"
                  style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: 'var(--off-white)', fontFamily: 'Poppins', fontWeight: 700, color: 'var(--civic-teal)' }}>
                  #{b.index}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <strong>{b.data.company}</strong>
                    <span className="text-muted">→</span>
                    <strong>{b.data.ngo}</strong>
                    <StatusBadge status={b.data.status} />
                  </div>
                  <div className="small text-muted mt-1">
                    <code>{b.current_hash.slice(0, 24)}...</code>
                    <span className="ms-3">{new Date(b.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-end">
                  <div style={{ fontFamily: 'Poppins', fontWeight: 600, color: 'var(--civic-teal)' }}>
                    ₹{b.data.amount.toLocaleString()}
                  </div>
                  <small className="text-muted">{b.data.project_id}</small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Block Detail Modal */}
      {selectedBlock && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedBlock(null)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: 'var(--deep-navy)', color: 'white' }}>
                <h5 className="modal-title" style={{ fontFamily: 'Poppins' }}>Block #{selectedBlock.index} Details</h5>
                <button className="btn-close btn-close-white" onClick={() => setSelectedBlock(null)}></button>
              </div>
              <div className="modal-body">
                <table className="table table-bordered mb-0">
                  <tbody>
                    <tr><th style={{ width: '35%' }}>Block Index</th><td>#{selectedBlock.index}</td></tr>
                    <tr><th>Timestamp</th><td>{new Date(selectedBlock.timestamp).toLocaleString()}</td></tr>
                    <tr><th>Company</th><td>{selectedBlock.data.company}</td></tr>
                    <tr><th>NGO</th><td>{selectedBlock.data.ngo}</td></tr>
                    <tr><th>Amount</th><td>₹{selectedBlock.data.amount.toLocaleString()}</td></tr>
                    <tr><th>Project ID</th><td>{selectedBlock.data.project_id}</td></tr>
                    <tr><th>Type</th><td className="text-capitalize">{selectedBlock.data.type}</td></tr>
                    <tr><th>Status</th><td><StatusBadge status={selectedBlock.data.status} /></td></tr>
                    {selectedBlock.data.sector && <tr><th>Sector</th><td>{selectedBlock.data.sector}</td></tr>}
                    {selectedBlock.data.invoice_hash && <tr><th>Invoice Hash</th><td><code>{selectedBlock.data.invoice_hash}</code></td></tr>}
                    <tr><th>Previous Hash</th><td style={{ wordBreak: 'break-all' }}><code className="small">{selectedBlock.previous_hash}</code></td></tr>
                    <tr><th>Current Hash</th><td style={{ wordBreak: 'break-all' }}><code className="small">{selectedBlock.current_hash}</code></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicLedger;
