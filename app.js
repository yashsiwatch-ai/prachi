/**
 * NEXUS.OS — Tactical Cloud Engine
 * Pure Vanilla JavaScript (ES6+), Zero Build Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Region Selector & Live Latency Engine
  const regionButtons = document.querySelectorAll('.region-btn');
  const activeLatencyVal = document.getElementById('activeLatencyVal');
  const activeRegionLabel = document.getElementById('activeRegionLabel');
  const activeThroughputVal = document.getElementById('activeThroughputVal');
  let currentBaseLatency = 18.4;
  let currentRegionId = 'sfo-1';

  const regionNames = {
    'sfo-1': 'San Francisco (SFO-1)',
    'fra-1': 'Frankfurt (FRA-1)',
    'hnd-1': 'Tokyo Haneda (HND-1)',
    'lhr-1': 'London Heathrow (LHR-1)'
  };

  const switchRegion = (regId, baseLat) => {
    currentRegionId = regId;
    currentBaseLatency = parseFloat(baseLat);

    regionButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.region === regId);
    });

    activeRegionLabel.textContent = `Routing through ${regionNames[regId]}`;
    activeLatencyVal.textContent = (currentBaseLatency + (Math.random() * 0.4 - 0.2)).toFixed(1);
    showNexusToast(`Active edge node set to ${regId.toUpperCase()}`);
    appendAuditFeed('ROUTING', `Switched primary ingress point to ${regId}`);
  };

  regionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      switchRegion(btn.dataset.region, btn.dataset.latency);
    });
  });

  // Micro-jitter for real-time telemetry feeling
  setInterval(() => {
    const jitter = (Math.random() * 0.6 - 0.3);
    activeLatencyVal.textContent = (currentBaseLatency + jitter).toFixed(1);
    const reqs = 148000 + Math.floor(Math.random() * 1200);
    activeThroughputVal.textContent = reqs.toLocaleString();
  }, 2200);

  // 2. Interactive API Request Sandbox & Endpoint Tester
  const methodTabs = document.querySelectorAll('.method-tab');
  const endpointField = document.getElementById('endpointField');
  const btnExecuteRequest = document.getElementById('btnExecuteRequest');
  const btnExecuteText = document.getElementById('btnExecuteText');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalTime = document.getElementById('terminalTime');
  const btnCopyJson = document.getElementById('btnCopyJson');

  let currentMethod = 'GET';
  let currentEndpoint = '/v1/telemetry/nodes';

  const endpointPayloads = {
    'GET /v1/telemetry/nodes': () => ({
      status: 'success',
      cluster: 'nexus-edge-global',
      active_region: currentRegionId,
      edge_latency_ms: parseFloat(activeLatencyVal.textContent),
      nodes_online: 32,
      routing_protocol: 'HTTP/3 BGP Anycast',
      security_shield: 'AES-256-GCM nominal',
      timestamp: new Date().toISOString()
    }),
    'POST /v1/edge/purge-cache': () => ({
      status: 'cache_purged',
      invalidated_keys_count: 14820,
      purge_duration_ms: 12.4,
      propagation_status: 'SYNCHRONIZED_GLOBAL',
      initiator: 'admin@nexus.io',
      timestamp: new Date().toISOString()
    }),
    'GET /v1/deployments/active': () => ({
      status: 'success',
      active_deployment_id: 'dpl_98a72b',
      git_branch: 'main',
      commit_hash: '3f9a12cf4819',
      traffic_allocation_pct: 100,
      build_environment: 'Vercel Serverless Edge Runtime',
      timestamp: new Date().toISOString()
    })
  };

  methodTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      methodTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentMethod = tab.dataset.method;
      currentEndpoint = tab.dataset.endpoint;
      endpointField.value = currentEndpoint;
    });
  });

  const executeApiRequest = () => {
    btnExecuteRequest.classList.add('loading');
    btnExecuteText.textContent = 'Executing...';

    const execStartTime = performance.now();
    setTimeout(() => {
      btnExecuteRequest.classList.remove('loading');
      btnExecuteText.textContent = 'Execute →';

      const key = `${currentMethod} ${currentEndpoint}`;
      const payloadFn = endpointPayloads[key] || endpointPayloads['GET /v1/telemetry/nodes'];
      const data = payloadFn();
      const execDuration = Math.round(performance.now() - execStartTime + 14);

      terminalOutput.innerHTML = `<code>${JSON.stringify(data, null, 2)}</code>`;
      const byteSize = new TextEncoder().encode(JSON.stringify(data)).length;
      terminalTime.textContent = `${execDuration} ms • ${byteSize} bytes`;

      showNexusToast(`200 OK — ${currentMethod} ${currentEndpoint}`);
      appendAuditFeed('API', `${currentMethod} ${currentEndpoint} returned 200 OK (${execDuration}ms)`);
    }, 280);
  };

  btnExecuteRequest.addEventListener('click', executeApiRequest);

  btnCopyJson.addEventListener('click', () => {
    const code = terminalOutput.innerText;
    navigator.clipboard.writeText(code).then(() => {
      btnCopyJson.querySelector('span').textContent = 'Copied!';
      setTimeout(() => {
        btnCopyJson.querySelector('span').textContent = 'Copy';
      }, 1800);
      showNexusToast('JSON payload copied to clipboard');
    });
  });

  // 3. API Token Studio & Secrets Minting
  const tokenNameInput = document.getElementById('tokenNameInput');
  const scopeChips = document.querySelectorAll('.scope-chip');
  const btnMintToken = document.getElementById('btnMintToken');
  const tokenString = document.getElementById('tokenString');
  const btnCopyToken = document.getElementById('btnCopyToken');
  const copyTokenLabel = document.getElementById('copyTokenLabel');

  scopeChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cb = chip.querySelector('.scope-cb');
      cb.checked = !cb.checked;
      chip.classList.toggle('active', cb.checked);
    });
  });

  const generateHex = (len) => {
    const chars = '0123456789abcdef';
    let out = '';
    for (let i = 0; i < len; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  };

  const mintTacticalToken = () => {
    const prefix = 'nxs_live_';
    const rawKey = prefix + generateHex(24);
    tokenString.textContent = rawKey;
    const name = tokenNameInput.value.trim() || 'default-worker';

    showNexusToast(`Token minted for [${name}]`);
    appendAuditFeed('TOKEN', `Minted new key: ${rawKey.substring(0, 16)}...`);
  };

  btnMintToken.addEventListener('click', mintTacticalToken);

  btnCopyToken.addEventListener('click', () => {
    navigator.clipboard.writeText(tokenString.textContent).then(() => {
      copyTokenLabel.textContent = 'Copied!';
      setTimeout(() => {
        copyTokenLabel.textContent = 'Copy';
      }, 1800);
      showNexusToast('API Key copied to clipboard');
    });
  });

  // 4. Deployments & Rollback Simulation
  const deploymentsTableBody = document.getElementById('deploymentsTableBody');

  deploymentsTableBody.addEventListener('click', (e) => {
    const rollbackBtn = e.target.closest('.btn-rollback');
    if (!rollbackBtn) return;

    const targetDpl = rollbackBtn.dataset.dpl;
    const rows = deploymentsTableBody.querySelectorAll('tr');

    rows.forEach((row) => {
      const dplCode = row.querySelector('code').textContent;
      const statusCell = row.cells[2];
      const actionCell = row.cells[4];

      if (dplCode === targetDpl) {
        statusCell.innerHTML = '<span class="tag-live"><span class="dot-live"></span> ACTIVE</span>';
        actionCell.innerHTML = '<button class="btn-table-action" disabled>Current Live</button>';
      } else {
        statusCell.innerHTML = '<span class="tag-superseded">SUPERSEDED</span>';
        actionCell.innerHTML = `<button class="btn-table-action btn-rollback" data-dpl="${dplCode}">Rollback &rarr;</button>`;
      }
    });

    showNexusToast(`Rolled back live traffic to ${targetDpl}`);
    appendAuditFeed('ROLLBACK', `Traffic redirected to release ${targetDpl}`);
  });

  // 5. Audit Feed Helper
  const activityFeed = document.getElementById('activityFeed');
  const appendAuditFeed = (badgeText, descText) => {
    const entry = document.createElement('div');
    entry.className = 'feed-entry';
    const now = new Date().toTimeString().split(' ')[0];
    entry.innerHTML = `
      <span class="feed-time">${now}</span>
      <span class="feed-badge badge-cyan">${badgeText}</span>
      <span class="feed-desc">${descText}</span>
    `;
    activityFeed.insertBefore(entry, activityFeed.firstChild);
    if (activityFeed.children.length > 6) {
      activityFeed.removeChild(activityFeed.lastChild);
    }
  };

  // 6. Linear-Style Command Palette (⌘K)
  const paletteBackdrop = document.getElementById('paletteBackdrop');
  const btnOpenPalette = document.getElementById('btnOpenPalette');
  const paletteSearchInput = document.getElementById('paletteSearchInput');
  const paletteResults = document.getElementById('paletteResults');

  const openPalette = () => {
    paletteBackdrop.classList.add('open');
    paletteBackdrop.setAttribute('aria-hidden', 'false');
    paletteSearchInput.value = '';
    paletteSearchInput.focus();
    filterPalette('');
  };

  const closePalette = () => {
    paletteBackdrop.classList.remove('open');
    paletteBackdrop.setAttribute('aria-hidden', 'true');
  };

  btnOpenPalette.addEventListener('click', openPalette);
  paletteBackdrop.addEventListener('click', (e) => {
    if (e.target === paletteBackdrop) closePalette();
  });

  const filterPalette = (query) => {
    const q = query.toLowerCase().trim();
    const items = paletteResults.querySelectorAll('.palette-item');
    items.forEach((item) => {
      const text = item.querySelector('.p-item-title').textContent.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
  };

  paletteSearchInput.addEventListener('input', (e) => {
    filterPalette(e.target.value);
  });

  paletteResults.addEventListener('click', (e) => {
    const item = e.target.closest('.palette-item');
    if (!item) return;

    const action = item.dataset.action;
    closePalette();

    switch (action) {
      case 'run-endpoint':
        executeApiRequest();
        break;
      case 'mint-token':
        mintTacticalToken();
        break;
      case 'switch-fra':
        switchRegion('fra-1', 26);
        break;
      case 'switch-sfo':
        switchRegion('sfo-1', 18);
        break;
      case 'purge-cache':
        currentMethod = 'POST';
        currentEndpoint = '/v1/edge/purge-cache';
        endpointField.value = currentEndpoint;
        methodTabs.forEach((t) => t.classList.toggle('active', t.dataset.method === 'POST'));
        executeApiRequest();
        break;
    }
  });

  // 7. Global Keyboard Navigation (⌘K, Escape, E, T)
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (paletteBackdrop.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape' && paletteBackdrop.classList.contains('open')) {
      closePalette();
    } else if (e.key.toLowerCase() === 'e' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      executeApiRequest();
    } else if (e.key.toLowerCase() === 't' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      mintTacticalToken();
    }
  });

  // 8. Toast Feedback Utility
  const nexusToast = document.getElementById('nexusToast');
  let toastTimer = null;

  function showNexusToast(msg) {
    nexusToast.textContent = msg;
    nexusToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      nexusToast.classList.remove('show');
    }, 2600);
  }
});

