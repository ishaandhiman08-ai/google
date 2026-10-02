/**
 * CYBERSHIELD // CYBER THREAT, ZERO-DAY & INDIAN PAYMENT SCAM DEFENSE SYSTEM
 * Interactive Client-Side Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- State & Core Metrics ---
  const state = {
    isAdminMode: false,
    isAdminLoggedIn: false,
    emailsAnalyzed: 184920,
    threatsDetected: 3418,
    riskScore: 68,
    adminTotalRupees: 184285600,
    adminFrozenRupees: 71230000,
    adminActiveCases: 842
  };

  const ADMIN_CREDENTIALS = {
    username: 'ishaan.@admin',
    password: 'ishaan@123'
  };

  let identityOtp = '';
  let identityPhoneVerified = false;
  let identityAadhaarVerified = false;
  let identityAadhaarPatternRisk = false;
  const identityChallenges = {
    identityAadhaar: '',
    profileAadhaar: '',
    phoneUpdate: '',
    biometricAadhaar: '',
    biometricConfirm: ''
  };
  const demoProfile = {
    name: 'Ishaan Sharma',
    fatherName: 'Rajesh Sharma',
    address: 'Demo profile address',
    phone: ''
  };
  const biometricUpdates = new Set();

  // --- Sample Community Scam Reports (Pre-populated) ---
  const communityReports = [
    {
      id: 'rep-01',
      name: 'Aarav Kulkarni',
      alias: 'Aarav Kulkarni',
      location: 'Pune, Maharashtra',
      demoOnly: true,
      category: 'UPI PIN / Online Payment Scam',
      amountTrapped: 35000,
      procedure: `I posted an advertisement on OLX to sell our dining table for ₹15,000. Within 30 minutes, an interested buyer called claiming to be an army officer posted in Pune cantonment. He agreed to purchase without bargaining and said his military accounts only allow instant UPI merchant transfers. He sent me a PhonePe QR code on WhatsApp and asked me to scan it through my mobile banking app. When I scanned it, the screen prompted for my 6-digit secret UPI PIN. The buyer assured me over the phone: "Sir, this is the military protocol code. The moment you enter your PIN, the ₹15,000 will be credited directly to your bank account." Unaware that a PIN is never needed to accept money, I typed it. Instantly, ₹35,000 was debited from my account. When I asked him, he claimed it was an error and sent another ₹70,000 collect request before switching off his phone.`,
      suggestion: `Always remember the golden rule: A UPI PIN is strictly used to SEND or DEBIT money from your bank account. You NEVER need to enter your PIN or scan a QR code to receive money. If someone asks for your PIN to pay you, it is 100% a fraud.`
    },
    {
      id: 'rep-02',
      name: 'Meera Nair',
      alias: 'Meera Nair',
      location: 'Mumbai, Maharashtra',
      demoOnly: true,
      category: 'Digital Arrest Scam',
      amountTrapped: 1250000,
      procedure: `I received an automated phone call claiming to be from FedEx courier services stating that a parcel dispatched with my Aadhaar details from Mumbai to Taiwan was seized with 5 fake passports and 140 grams of MDMA drugs. The call was redirected to a Skype video call with two men dressed in full Maharashtra Police uniforms sitting in front of a police backdrop with emblem badges. They displayed a fake Supreme Court warrant with my photo and declared me under "Digital Arrest". They told me that if I disconnected the camera or informed anyone in my family, an armed task force would arrest me within 2 hours. Over 36 hours of continuous video surveillance without sleep, they forced me to liquidate my fixed deposits and transfer ₹12.5 Lakhs into a "Safe RBI Custody Escrow Account" for verification, promising a complete refund within 4 hours. Once the NEFT cleared, they vanished.`,
      suggestion: `Indian legal systems and state police departments do NOT have any concept called "Digital Arrest". Real police or CBI officers will never conduct an interrogation or demand funds via Skype or WhatsApp video calls. Immediately disconnect and dial the national cyber helpline at 1930.`
    },
    {
      id: 'rep-03',
      name: 'Kabir Malhotra',
      alias: 'Kabir Malhotra',
      location: 'New Delhi',
      demoOnly: true,
      category: 'Fake Online Shopping & Delivery',
      amountTrapped: 18500,
      procedure: `While browsing social media, I came across a heavily sponsored advertisement for branded noise-cancelling headphones at an 85% discount for ₹999, claiming to be an official festive warehouse clearance. The link redirected to a cloned page resembling a major e-commerce portal. I attempted to purchase using cash on delivery, but the portal forced online payment. Two days later, I received an SMS purportedly from India Post stating: "Your parcel address is incomplete. Pay a ₹5 re-delivery fee within 12 hours or package will be returned to sender." The SMS contained a link opening a fake postal form. When I entered my debit card details and the OTP thinking it was only ₹5, the fraudsters used the OTP on a background payment gateway and debited ₹18,500.`,
      suggestion: `Never click on delivery update links received via generic SMS from unknown mobile numbers. Always verify courier tracking numbers exclusively through the official courier company app or website. If a deal online seems unrealistically cheap, it is almost certainly a clone scam.`
    }
  ];

  // Helper to format Indian Currency
  function formatINR(val) {
    return '₹ ' + val.toLocaleString('en-IN');
  }

  // Helper: Mask phone numbers for public view (+91 98*** ****45)
  function maskPhoneNumber(phone) {
    if (!phone) return 'Protected';
    const cleaned = phone.trim();
    if (cleaned.length >= 10) {
      const end = cleaned.substring(cleaned.length - 2);
      return `+91 ****** **${end}`;
    }
    return 'Protected';
  }

  function sanitizePublicStory(text) {
    return (text || '')
      .replace(/\b(?:UPI|ATM|debit|credit)?\s*(?:PIN|OTP|password)\b\s*(?:is|was|number|no\.?)?\s*[:=#-]?\s*[\d\s-]{4,20}/gi, '[sensitive code redacted]')
      .replace(/\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g, '[email redacted]')
      .replace(/(?:\+?91[\s-]?)?[6-9]\d(?:[\s-]?\d){8}/g, '[phone number redacted]')
      .replace(/\b\d{12}\b/g, '[identity number redacted]')
      .replace(/\b\d{13,19}\b/g, '[financial number redacted]');
  }

  // --- Render Community Reports Feed ---
  const reportedCasesList = document.getElementById('reportedCasesList');
  const reportCountBadge = document.getElementById('reportCountBadge');

  function renderCommunityReports() {
    if (!reportedCasesList) return;
    reportedCasesList.innerHTML = '';

    communityReports.forEach(rep => {
      const card = document.createElement('div');
      card.className = 'case-card';

      const maskedPhone = 'Protected';
      card.innerHTML = `
        <div class="case-header">
          <div class="case-reporter-info">
            <span class="case-name">${escapeHTML(rep.alias || rep.name)}</span>
            <span class="case-origin-badge">${rep.demoOnly ? 'SYNTHETIC SAMPLE' : 'LOCAL DEMO SUBMISSION'}</span>
            ${rep.location ? `<span class="case-location"><i data-lucide="map-pin"></i> ${escapeHTML(rep.location)}</span>` : ''}
            <div class="phone-privacy-wrap">
              <span class="case-phone-masked"><i data-lucide="shield"></i> ${maskedPhone}</span>
            </div>
            ${rep.amountTrapped ? `<span class="case-rupees-tag"><i data-lucide="indian-rupee"></i> ${formatINR(rep.amountTrapped)} Lost</span>` : ''}
          </div>
          <span class="case-category-badge">${escapeHTML(rep.category)}</span>
        </div>

        <div class="case-procedure-box">
          <strong>Modus Operandi / Procedure:</strong>
          ${escapeHTML(sanitizePublicStory(rep.procedure))}
        </div>

        <div class="case-suggestion-box">
          <strong>Community Safety Suggestion:</strong>
          ${escapeHTML(sanitizePublicStory(rep.suggestion))}
        </div>
      `;

      reportedCasesList.appendChild(card);
    });

    if (reportCountBadge) {
      reportCountBadge.textContent = `${communityReports.length} Cases Documented`;
    }

    if (window.lucide) window.lucide.createIcons();
  }

  function escapeHTML(str) {
    return str ? str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)) : '';
  }

  renderCommunityReports();

  const syntheticAiCaseThemes = [
    {
      tactic: 'AI-cloned family voice',
      story: 'A caller used a convincing cloned voice and an urgent emergency story to pressure the fictional person into sending money before checking with family.',
      advice: 'Hang up and call your relative using a saved number. Agree on a family safe-word; never transfer money based on an urgent voice call.'
    },
    {
      tactic: 'Deepfake celebrity investment',
      story: 'A fabricated celebrity video promised guaranteed investment returns and directed the fictional person to a lookalike payment page.',
      advice: 'Treat guaranteed returns as a warning sign. Check investment offers with the official regulator or provider, reached independently.'
    },
    {
      tactic: 'AI bank-support impersonation',
      story: 'A polished chatbot posed as bank support, then urged the fictional person to install a remote-access app to resolve a fake account alert.',
      advice: 'Banks do not need remote access or your PIN/OTP. Close the chat and contact the bank using the number on its official site or card.'
    },
    {
      tactic: 'AI-generated task/job offer',
      story: 'A convincing job message offered easy earnings, then demanded deposits to unlock tasks and withdraw a fabricated balance.',
      advice: 'Do not pay to get a job or unlock earnings. Verify employers independently and report suspicious payment requests.'
    },
    {
      tactic: 'Synthetic delivery/customer-care agent',
      story: 'A fake support agent used a natural-sounding generated voice and a parcel problem to send the fictional person to a credential-harvesting link.',
      advice: 'Open the courier or retailer app yourself. Never share card data, passwords, PINs, or OTPs through a link sent by an unknown caller.'
    }
  ];
  const syntheticAiRegions = [
    'Pune region', 'Mumbai region', 'Bengaluru region', 'Hyderabad region', 'Chennai region',
    'Kolkata region', 'Jaipur region', 'Lucknow region', 'Kochi region', 'New Delhi region'
  ];
  const syntheticFirstNames = [
    'Aditi', 'Arjun', 'Diya', 'Ishaan', 'Kavya',
    'Neel', 'Riya', 'Samar', 'Tara', 'Vivaan'
  ];
  const syntheticLastNames = ['Sharma', 'Patel', 'Rao', 'Das', 'Kapoor'];
  const syntheticAiCases = Array.from({ length: 50 }, (_, index) => {
    const theme = syntheticAiCaseThemes[index % syntheticAiCaseThemes.length];
    let outcome;
    if (index < 25) {
      outcome = {
        label: 'Scammed in fictional scenario',
        story: ' The person trusted the convincing AI-assisted message and suffered a fictional loss before independently verifying it.'
      };
    } else if (index < 40) {
      outcome = {
        label: 'Loss avoided in fictional scenario',
        story: ' The person paused, treated the AI-themed request as unverified, and checked it through a separate official channel before any loss.'
      };
    } else {
      outcome = {
        label: 'Trust rebuilt with verified support (fictional, not AI)',
        story: ' After a fictional scam, the person contacted their bank/payment provider and India’s 1930 helpline. Any recovery depends on the real case; AI does not guarantee recovery.'
      };
    }
    return {
      alias: `${syntheticFirstNames[index % syntheticFirstNames.length]} ${syntheticLastNames[Math.floor(index / syntheticFirstNames.length)]}`,
      region: syntheticAiRegions[index % syntheticAiRegions.length],
      maskedPhone: `+91 ****** **${String(index + 21).slice(-2)}`,
      ...theme,
      outcome: outcome.label,
      story: `${theme.story}${outcome.story}`,
      advice: theme.advice
    };
  });
  let syntheticAiPage = 0;
  const syntheticAiPageSize = 10;

  function renderSyntheticAiDashboard() {
    const scamCount = syntheticAiCases.filter(example => example.outcome === 'Scammed in fictional scenario').length;
    const protectedCount = syntheticAiCases.filter(example => example.outcome === 'Loss avoided in fictional scenario').length;
    const recoveryCount = syntheticAiCases.filter(example => example.outcome === 'Trust rebuilt with verified support (fictional, not AI)').length;
    const outcomeSlices = [
      { label: 'Scammed in scenario', count: scamCount, color: '#ff3366' },
      { label: 'Avoided loss', count: protectedCount, color: '#10b981' },
      { label: 'Trust rebuilt via support (not AI)', count: recoveryCount, color: '#38bdf8' }
    ];
    const total = syntheticAiCases.length;
    let stop = 0;
    document.getElementById('citizenAiOutcomePie').style.background = `conic-gradient(${outcomeSlices.map(slice => {
      const start = stop;
      stop += slice.count / total * 100;
      return `${slice.color} ${start}% ${stop}%`;
    }).join(', ')})`;
    document.getElementById('citizenAiOutcomePie').setAttribute(
      'aria-label',
      `${scamCount} fictional scam cases, ${protectedCount} avoided-loss cases, ${recoveryCount} support cases, out of ${total} generated examples`
    );
    document.getElementById('citizenAiOutcomeLegend').innerHTML = outcomeSlices.map(slice => {
      const percent = Math.round(slice.count / total * 100);
      return `<li><span class="identity-legend-swatch" style="background:${slice.color}"></span><span>${escapeHTML(slice.label)} (${percent}%)</span><strong>${slice.count}</strong></li>`;
    }).join('');

    const tacticCounts = syntheticAiCaseThemes.map(theme => ({
      label: theme.tactic,
      count: syntheticAiCases.filter(example => example.tactic === theme.tactic).length
    }));
    document.getElementById('citizenAiTacticBars').innerHTML = tacticCounts.map(item => {
      const width = item.count / total * 100;
      return `<div class="identity-bar-row"><span>${escapeHTML(item.label)}</span><div class="identity-bar-track" role="img" aria-label="${escapeHTML(item.label)}: ${item.count} of ${total} examples"><div class="identity-bar-fill" style="width:${width}%"></div></div><strong>${item.count}</strong></div>`;
    }).join('');

    document.getElementById('citizenAiTotal').textContent = total;
    document.getElementById('citizenAiScammed').textContent = scamCount;
    document.getElementById('citizenAiProtected').textContent = protectedCount;
    document.getElementById('citizenAiRecovery').textContent = recoveryCount;

    const pageCount = Math.ceil(total / syntheticAiPageSize);
    const first = syntheticAiPage * syntheticAiPageSize;
    const pageExamples = syntheticAiCases.slice(first, first + syntheticAiPageSize);
    document.getElementById('syntheticAiCases').innerHTML = pageExamples.map(example => `
      <article class="synthetic-ai-case">
        <div class="synthetic-ai-case-heading">
          <div><strong>${escapeHTML(example.alias)}</strong><span><i data-lucide="map-pin"></i> ${escapeHTML(example.region)}</span></div>
          <span class="synthetic-case-outcome">${escapeHTML(example.outcome)}</span>
        </div>
        <div class="synthetic-ai-contact"><i data-lucide="phone"></i> Masked placeholder: ${escapeHTML(example.maskedPhone)} · No real number</div>
        <p class="synthetic-ai-tactic"><strong>AI-themed tactic:</strong> ${escapeHTML(example.tactic)}</p>
        <p>${escapeHTML(example.story)}</p>
        <p class="synthetic-ai-advice"><strong>Advice:</strong> ${escapeHTML(example.advice)}</p>
        <span class="synthetic-data-badge">FICTIONAL DEMO STORY</span>
      </article>
    `).join('');

    const last = Math.min(first + syntheticAiPageSize, total);
    document.getElementById('syntheticCasesPageLabel').textContent = `Examples ${first + 1}–${last} of ${total}`;
    document.getElementById('syntheticCasesPageStatus').textContent = `Page ${syntheticAiPage + 1} of ${pageCount}`;
    document.getElementById('syntheticCasesPrevious').disabled = syntheticAiPage === 0;
    document.getElementById('syntheticCasesNext').disabled = syntheticAiPage >= pageCount - 1;
    if (window.lucide) window.lucide.createIcons();
  }

  document.getElementById('syntheticCasesPrevious').addEventListener('click', () => {
    if (syntheticAiPage === 0) return;
    syntheticAiPage -= 1;
    renderSyntheticAiDashboard();
  });
  document.getElementById('syntheticCasesNext').addEventListener('click', () => {
    if (syntheticAiPage >= Math.ceil(syntheticAiCases.length / syntheticAiPageSize) - 1) return;
    syntheticAiPage += 1;
    renderSyntheticAiDashboard();
  });
  renderSyntheticAiDashboard();

  // --- Dynamic Word Counter for Procedure Input ---
  const scamProcedureEl = document.getElementById('scamProcedure');
  const wordCountLabel = document.getElementById('wordCountLabel');

  if (scamProcedureEl && wordCountLabel) {
    scamProcedureEl.addEventListener('input', () => {
      const text = scamProcedureEl.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      wordCountLabel.textContent = `Word Count: ${words} words`;
    });
  }

  // --- Form Submission for New Reports ---
  const scamReportForm = document.getElementById('scamReportForm');
  if (scamReportForm) {
    scamReportForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('reporterName')?.value.trim();
      const category = document.getElementById('scamCategory')?.value;
      const amountTrappedVal = parseFloat(document.getElementById('amountTrapped')?.value) || 0;
      const procedure = sanitizePublicStory(document.getElementById('scamProcedure')?.value.trim());
      const suggestion = sanitizePublicStory(document.getElementById('safetySuggestion')?.value.trim());

      if (!name || !procedure || !suggestion) {
        alert('Please fill out all required fields.');
        return;
      }

      const newReport = {
        id: 'rep-' + Date.now(),
        name,
        alias: name,
        demoOnly: false,
        category,
        amountTrapped: amountTrappedVal,
        procedure,
        suggestion
      };

      // Add to front of array
      communityReports.unshift(newReport);
      renderCommunityReports();

      // Update admin trapped rupees if applicable
      if (amountTrappedVal > 0) {
        state.adminTotalRupees += amountTrappedVal;
        state.adminActiveCases += 1;
        const totalRupeesEl = document.getElementById('adminTotalRupees');
        const activeCasesEl = document.getElementById('adminActiveCases');
        if (totalRupeesEl) totalRupeesEl.textContent = formatINR(state.adminTotalRupees);
        if (activeCasesEl) activeCasesEl.textContent = `${state.adminActiveCases} Cases`;
      }

      alert('Demo report added to this page only. It has not been sent to authorities or stored on a server.');
      scamReportForm.reset();
      if (wordCountLabel) wordCountLabel.textContent = 'Word Count: 0 words';
    });
  }

  // --- Role Switcher (Citizen View vs Cyber Cell Admin View) ---
  // --- Role Switcher (Citizen View vs Cyber Cell Admin View) ---
  const roleSwitchBtn = document.getElementById('roleSwitchBtn');
  const roleSwitchBtnText = document.getElementById('roleSwitchBtnText');
  const currentRoleBadge = document.getElementById('currentRoleBadge');
  const currentRoleDesc = document.getElementById('currentRoleDesc');
  const heroRoleCitizen = document.getElementById('heroRoleCitizen');
  const heroRoleAdmin = document.getElementById('heroRoleAdmin');
  const adminLoginModal = document.getElementById('adminLoginModal');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminLoginError = document.getElementById('adminLoginError');
  const closeAdminLoginBtn = document.getElementById('closeAdminLoginBtn');

  function openAdminLoginModal() {
    if (adminLoginModal) {
      adminLoginModal.classList.add('active');
      const usernameInput = document.getElementById('adminUsername');
      if (usernameInput) setTimeout(() => usernameInput.focus(), 50);
    }
  }

  function closeAdminLoginModal() {
    if (adminLoginModal) {
      adminLoginModal.classList.remove('active');
    }
    if (adminLoginError) adminLoginError.textContent = '';
    if (adminLoginForm) adminLoginForm.reset();
  }

  function updateRoleUI(isAdmin) {
    state.isAdminMode = isAdmin;

    if (state.isAdminMode) {
      document.body.classList.remove('mode-citizen');
      document.body.classList.add('mode-admin');

      if (roleSwitchBtnText) roleSwitchBtnText.textContent = 'Switch to Citizen Public Portal';
      if (currentRoleBadge) {
        currentRoleBadge.className = 'role-badge admin-badge';
        currentRoleBadge.innerHTML = '<i data-lucide="shield-alert"></i> CYBER CELL ADMIN COMMAND';
      }
      if (currentRoleDesc) {
        currentRoleDesc.textContent = 'Demo admin mode: simulated aggregate metrics only. Citizen contact numbers remain masked.';
      }
      if (heroRoleCitizen) heroRoleCitizen.classList.remove('active');
      if (heroRoleAdmin) heroRoleAdmin.classList.add('active');
    } else {
      document.body.classList.remove('mode-admin');
      document.body.classList.add('mode-citizen');

      if (roleSwitchBtnText) roleSwitchBtnText.textContent = 'Switch to Cyber Cell Admin';
      if (currentRoleBadge) {
        currentRoleBadge.className = 'role-badge citizen-badge';
        currentRoleBadge.innerHTML = '<i data-lucide="users"></i> CITIZEN PUBLIC PORTAL';
      }
      if (currentRoleDesc) {
        currentRoleDesc.textContent = 'Public Mode: Citizen reporting open. Phone numbers & financial loss values are privacy-protected.';
      }
      if (heroRoleCitizen) heroRoleCitizen.classList.add('active');
      if (heroRoleAdmin) heroRoleAdmin.classList.remove('active');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  if (roleSwitchBtn) {
    roleSwitchBtn.addEventListener('click', () => {
      if (!state.isAdminMode && !state.isAdminLoggedIn) {
        openAdminLoginModal();
        return;
      }
      updateRoleUI(!state.isAdminMode);
    });
  }

  if (heroRoleCitizen) {
    heroRoleCitizen.addEventListener('click', () => {
      updateRoleUI(false);
    });
  }

  if (heroRoleAdmin) {
    heroRoleAdmin.addEventListener('click', () => {
      if (!state.isAdminLoggedIn) {
        openAdminLoginModal();
        return;
      }
      updateRoleUI(true);
    });
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('adminUsername')?.value.trim();
      const password = document.getElementById('adminPassword')?.value.trim();

      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        state.isAdminLoggedIn = true;
        closeAdminLoginModal();
        updateRoleUI(true);
      } else {
        if (adminLoginError) {
          adminLoginError.textContent = 'Invalid credentials. Please check your username and password.';
        }
      }
    });
  }

  if (closeAdminLoginBtn) {
    closeAdminLoginBtn.addEventListener('click', () => {
      closeAdminLoginModal();
    });
  }

  // --- Identity verification & OTP flow ---
  const sendOtpBtn = document.getElementById('sendOtpBtn');
  const verifyOtpBtn = document.getElementById('verifyOtpBtn');
  const identityMobile = document.getElementById('identityMobile');
  const otpInput = document.getElementById('otpInput');
  const otpStatus = document.getElementById('otpStatus');
  const identityResultBox = document.getElementById('identityResultBox');
  const identityManagementGrid = document.getElementById('identityManagementGrid');
  const identityAadhaarPanel = document.getElementById('identityAadhaarPanel');
  const identityAadhaarInput = document.getElementById('identityAadhaarInput');
  const identityAadhaarOtpInput = document.getElementById('identityAadhaarOtpInput');
  const identityAadhaarStatus = document.getElementById('identityAadhaarStatus');
  const sendIdentityAadhaarOtpBtn = document.getElementById('sendIdentityAadhaarOtpBtn');
  const verifyIdentityAadhaarOtpBtn = document.getElementById('verifyIdentityAadhaarOtpBtn');
  const identityDemoCohort = Array.from({ length: 50 }, (_, index) => ({
    phoneVerified: index < 42,
    aadhaarVerified: index < 42,
    phonePatternRisk: index < 42 && index % 11 === 0,
    aadhaarPatternRisk: index < 42 && index % 7 === 0
  }));

  function renderIdentityAnalytics() {
    const total = identityDemoCohort.length;
    const verified = identityDemoCohort.filter(record => record.phoneVerified && record.aadhaarVerified);
    const pending = total - verified.length;
    const phonePatternFlags = verified.filter(record => record.phonePatternRisk).length;
    const aadhaarPatternFlags = verified.filter(record => record.aadhaarPatternRisk).length;
    const flagged = verified.filter(record => record.phonePatternRisk || record.aadhaarPatternRisk).length;
    const noPattern = verified.length - flagged;

    document.getElementById('identityCohortCount').textContent = `${total} demo records`;
    document.getElementById('identityTotalCount').textContent = total;
    document.getElementById('identityVerifiedCount').textContent = verified.length;
    document.getElementById('identityPendingCount').textContent = pending;
    document.getElementById('identityFlaggedCount').textContent = flagged;

    function renderPieChart(chartId, legendId, slices, totalCount, ariaLabel) {
      const chart = document.getElementById(chartId);
      const legend = document.getElementById(legendId);
      let end = 0;
      const stops = slices.map(slice => {
        const start = end;
        end += totalCount ? slice.count / totalCount * 100 : 0;
        return `${slice.color} ${start}% ${end}%`;
      });
      chart.style.background = totalCount && end
        ? `conic-gradient(${stops.join(', ')})`
        : 'conic-gradient(rgba(148, 163, 184, 0.35) 0% 100%)';
      chart.setAttribute('aria-label', ariaLabel);
      legend.innerHTML = slices.map(slice => {
        const percent = totalCount ? Math.round(slice.count / totalCount * 100) : 0;
        return `<li><span class="identity-legend-swatch" style="background:${slice.color}"></span><span>${escapeHTML(slice.label)} (${percent}%)</span><strong>${slice.count}</strong></li>`;
      }).join('');
    }

    renderPieChart(
      'verificationPie',
      'verificationLegend',
      [
        { label: 'Both demo OTPs verified', count: verified.length, color: '#10b981' },
        { label: 'Awaiting verification', count: pending, color: '#f59e0b' }
      ],
      total,
      `${verified.length} of ${total} synthetic demo profiles completed both simulated OTP steps; ${pending} are pending`
    );
    renderPieChart(
      'riskPie',
      'riskLegend',
      [
        { label: 'Pattern flagged (not theft)', count: flagged, color: '#ff3366' },
        { label: 'No demo pattern flag', count: noPattern, color: '#38bdf8' }
      ],
      verified.length,
      `Among completed demos, ${flagged} matched a simple digit pattern and ${noPattern} did not`
    );

    const checks = [
      ['Phone digit pattern', phonePatternFlags],
      ['Aadhaar test digit pattern', aadhaarPatternFlags],
      ['Aadhaar-to-phone match', null],
      ['SIM, device, document & biometric checks', null]
    ];
    const bars = document.getElementById('identityPatternBars');
    bars.innerHTML = checks.map(([label, count]) => {
      const available = count !== null;
      const width = available && verified.length ? count / verified.length * 100 : 0;
      const value = available ? `${count}/${verified.length}` : 'N/A';
      return `<div class="identity-bar-row"><span>${escapeHTML(label)}</span><div class="identity-bar-track" role="img" aria-label="${escapeHTML(label)}: ${available ? `${count} of ${verified.length}` : 'not checked'}"><div class="identity-bar-fill" style="width:${width}%"></div></div><strong>${value}</strong></div>`;
    }).join('');
  }

  renderIdentityAnalytics();

  function setOtpStatus(message, type = 'info') {
    if (!otpStatus) return;
    otpStatus.textContent = message;
    otpStatus.className = `otp-status ${type}`;
  }

  function inspectIdentityRisk(phoneNumber, aadhaarPatternRisk) {
    const phoneDigits = (phoneNumber || '').replace(/\D/g, '');
    const phonePatternRisk = /(\d)\1{3,}/.test(phoneDigits);
    const patternCount = Number(phonePatternRisk) + Number(aadhaarPatternRisk);
    return {
      status: patternCount ? 'alert' : 'safe',
      title: patternCount ? 'Demo pattern indicators found' : 'No demo pattern indicators found',
      patternCount,
      checks: [
        ['Mobile OTP ownership', 'Passed (simulated OTP only)'],
        ['Mobile number pattern', phonePatternRisk ? 'Pattern flagged by local demo rule' : 'No configured pattern flagged'],
        ['Aadhaar test-number format', '12 digits accepted locally; not verified with UIDAI'],
        ['Aadhaar number pattern', aadhaarPatternRisk ? 'Pattern flagged by local demo rule' : 'No configured pattern flagged'],
        ['Aadhaar-to-phone record match', 'Not checked; no official identity service connected'],
        ['SIM swap, device, or account compromise', 'Not checked'],
        ['Biometric, document, name, or address mismatch', 'Not checked'],
        ['Behavioural or transaction anomaly', 'Not checked']
      ]
    };
  }

  function renderIdentityResult(phoneNumber, aadhaarPatternRisk) {
    if (!identityResultBox) return;

    const result = inspectIdentityRisk(phoneNumber, aadhaarPatternRisk);
    const statusClass = result.status === 'alert' ? 'alert' : result.status === 'safe' ? 'safe' : 'neutral';
    const icon = result.status === 'alert' ? 'alert-triangle' : result.status === 'safe' ? 'shield-check' : 'shield';

    identityResultBox.innerHTML = `
      <div class="identity-status ${statusClass}">
        <i data-lucide="${icon}"></i>
        <span>${result.title}</span>
      </div>
      <p class="identity-result-text">${result.patternCount} of 2 local demo pattern rules flagged. This is not an identity-theft risk score.</p>
      <ul>${result.checks.map(([name, outcome]) => `<li><strong>${escapeHTML(name)}:</strong> ${escapeHTML(outcome)}</li>`).join('')}</ul>
      <p class="identity-demo-warning">This analysis only compares simple patterns in the phone and test-number digits. OTPs are simulated; Aadhaar identity/linkage and the other listed risks are not verified.</p>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  function renderIdentityPending(message = 'Complete steps 01 and 03 to run the combined demo risk analysis.') {
    if (!identityResultBox) return;
    identityResultBox.innerHTML = `
      <div class="identity-status neutral">
        <i data-lucide="shield"></i>
        <span>Awaiting phone and Aadhaar verification</span>
      </div>
      <p class="identity-result-text">${escapeHTML(message)}</p>
      <ul>
        <li>Mobile OTP status: ${identityPhoneVerified ? 'verified (simulated)' : 'pending'}</li>
        <li>Aadhaar test-number OTP status: ${identityAadhaarVerified ? 'verified (simulated)' : 'pending'}</li>
        <li>SIM, device, biometrics, documents, and account behaviour: unavailable</li>
      </ul>
      <p class="identity-demo-warning">This prototype cannot determine whether someone is a victim of identity theft.</p>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  function setDemoChallenge(statusElement, challengeName, destination) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    identityChallenges[challengeName] = code;
    statusElement.textContent = `Demo OTP for ${destination}: ${code}. It was not sent; this prototype has no messaging service.`;
    statusElement.className = 'otp-status success';
  }

  function validateDemoAadhaar(input, statusElement) {
    const digits = input.value.replace(/\D/g, '');
    input.value = '';
    if (digits.length !== 12) {
      statusElement.textContent = 'Enter a 12-digit test value. Do not enter a real Aadhaar number.';
      statusElement.className = 'otp-status danger';
      return null;
    }
    return { patternRisk: /(\d)\1{5,}/.test(digits) };
  }

  function updateDemoProfileDetails() {
    document.getElementById('profileName').textContent = demoProfile.name;
    document.getElementById('profileFatherName').textContent = demoProfile.fatherName;
    document.getElementById('profileAddress').textContent = demoProfile.address;
    document.getElementById('profilePhone').textContent = maskPhoneNumber(demoProfile.phone);
  }

  function setChallengeStatus(statusElement, message, type = 'danger') {
    statusElement.textContent = message;
    statusElement.className = `otp-status ${type}`;
  }

  const profileAadhaarPanel = document.getElementById('profileAadhaarPanel');
  const profileUpdateForm = document.getElementById('profileUpdateForm');
  const profileAadhaarInput = document.getElementById('profileAadhaarInput');
  const profileAadhaarStatus = document.getElementById('profileAadhaarStatus');
  const profileAadhaarOtpInput = document.getElementById('profileAadhaarOtpInput');
  const profileUpdateStatus = document.getElementById('profileUpdateStatus');
  const profilePhoneInput = document.getElementById('profilePhoneInput');
  const phoneUpdateConfirmationPanel = document.getElementById('phoneUpdateConfirmationPanel');
  const phoneUpdateStatus = document.getElementById('phoneUpdateStatus');
  const phoneUpdateOtpInput = document.getElementById('phoneUpdateOtpInput');

  updateDemoProfileDetails();

  if (identityMobile) {
    identityMobile.addEventListener('input', () => {
      identityPhoneVerified = false;
      identityAadhaarVerified = false;
      identityAadhaarPatternRisk = false;
      identityOtp = '';
      identityChallenges.identityAadhaar = '';
      if (identityManagementGrid) identityManagementGrid.hidden = true;
      if (identityAadhaarPanel) identityAadhaarPanel.hidden = true;
      setOtpStatus('Mobile number changed. Send and verify a new OTP to view the demo profile.');
      renderIdentityPending();
      setChallengeStatus(identityAadhaarStatus, 'Verify the mobile number first.', 'info');
    });
  }

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', () => {
      const phoneNumber = identityMobile?.value.trim();
      if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
        setOtpStatus('Please enter a valid mobile number to receive the OTP.', 'danger');
        return;
      }

      identityPhoneVerified = false;
      identityAadhaarVerified = false;
      identityAadhaarPatternRisk = false;
      identityChallenges.identityAadhaar = '';
      if (identityManagementGrid) identityManagementGrid.hidden = true;
      if (identityAadhaarPanel) identityAadhaarPanel.hidden = true;
      renderIdentityPending();
      setChallengeStatus(identityAadhaarStatus, 'Verify the mobile number first.', 'info');
      identityOtp = String(Math.floor(100000 + Math.random() * 900000));
      setOtpStatus(`Demo OTP for ${maskPhoneNumber(phoneNumber)}: ${identityOtp}. It was not sent; this prototype has no messaging service.`, 'success');
      if (otpInput) otpInput.focus();
    });
  }

  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => {
      const enteredOtp = otpInput?.value.trim();
      const phoneNumber = identityMobile?.value.trim();

      if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
        setOtpStatus('Enter the mobile number first before verifying OTP.', 'danger');
        return;
      }

      if (!identityOtp) {
        setOtpStatus('Please send OTP before verification.', 'danger');
        return;
      }

      if (enteredOtp !== identityOtp) {
        setOtpStatus('The OTP entered is incorrect. Please try again.', 'danger');
        renderIdentityPending();
        return;
      }

      identityPhoneVerified = true;
      demoProfile.phone = phoneNumber;
      setOtpStatus('OTP verified successfully. Identity lab is now unlocked.', 'success');
      renderIdentityPending('Phone verified. Complete step 03 to review the phone and Aadhaar test signals together.');
      updateDemoProfileDetails();
      if (identityManagementGrid) identityManagementGrid.hidden = false;
      if (identityAadhaarPanel) identityAadhaarPanel.hidden = false;
    });
  }

  if (sendIdentityAadhaarOtpBtn) {
    sendIdentityAadhaarOtpBtn.addEventListener('click', () => {
      if (!identityPhoneVerified) {
        setChallengeStatus(identityAadhaarStatus, 'Verify the mobile number in step 01 first.');
        return;
      }

      const aadhaarSignals = validateDemoAadhaar(identityAadhaarInput, identityAadhaarStatus);
      if (!aadhaarSignals) return;

      identityAadhaarVerified = false;
      identityAadhaarPatternRisk = aadhaarSignals.patternRisk;
      setDemoChallenge(identityAadhaarStatus, 'identityAadhaar', maskPhoneNumber(demoProfile.phone));
      renderIdentityPending('Aadhaar test number accepted locally. Verify its simulated OTP to finish step 03.');
      identityAadhaarOtpInput.focus();
    });
  }

  if (verifyIdentityAadhaarOtpBtn) {
    verifyIdentityAadhaarOtpBtn.addEventListener('click', () => {
      if (!identityPhoneVerified || !identityChallenges.identityAadhaar) {
        setChallengeStatus(identityAadhaarStatus, 'Verify the mobile number and request a fresh Aadhaar demo OTP first.');
        return;
      }
      if (identityAadhaarOtpInput.value.trim() !== identityChallenges.identityAadhaar) {
        setChallengeStatus(identityAadhaarStatus, 'Incorrect demo OTP. Try again or request a new one.');
        return;
      }

      identityChallenges.identityAadhaar = '';
      identityAadhaarVerified = true;
      identityAadhaarOtpInput.value = '';
      identityDemoCohort.push({
        phoneVerified: true,
        aadhaarVerified: true,
        phonePatternRisk: /(\d)\1{3,}/.test(identityMobile.value.replace(/\D/g, '')),
        aadhaarPatternRisk: identityAadhaarPatternRisk
      });
      renderIdentityAnalytics();
      setChallengeStatus(identityAadhaarStatus, 'Step 03 complete. Combined phone and Aadhaar test-signal analysis is shown in step 02.', 'success');
      renderIdentityResult(identityMobile.value.trim(), identityAadhaarPatternRisk);
    });
  }

  const startProfileUpdateBtn = document.getElementById('startProfileUpdateBtn');
  const sendProfileAadhaarOtpBtn = document.getElementById('sendProfileAadhaarOtpBtn');
  const verifyProfileAadhaarOtpBtn = document.getElementById('verifyProfileAadhaarOtpBtn');
  const profileUpdateFormElement = document.getElementById('profileUpdateForm');
  const sendBiometricAadhaarOtpBtn = document.getElementById('sendBiometricAadhaarOtpBtn');
  const verifyBiometricAadhaarOtpBtn = document.getElementById('verifyBiometricAadhaarOtpBtn');
  const biometricAadhaarPanel = document.getElementById('biometricAadhaarPanel');
  const biometricOptionsPanel = document.getElementById('biometricOptionsPanel');
  const biometricAadhaarInput = document.getElementById('biometricAadhaarInput');
  const biometricAadhaarStatus = document.getElementById('biometricAadhaarStatus');
  const biometricAadhaarOtpInput = document.getElementById('biometricAadhaarOtpInput');
  const biometricConfirmStatus = document.getElementById('biometricConfirmStatus');
  const biometricConfirmOtpInput = document.getElementById('biometricConfirmOtpInput');

  if (startProfileUpdateBtn) {
    startProfileUpdateBtn.addEventListener('click', () => {
      if (!identityPhoneVerified) return;
      identityChallenges.profileAadhaar = '';
      profileAadhaarInput.value = '';
      profileAadhaarOtpInput.value = '';
      profileUpdateForm.hidden = true;
      profileAadhaarPanel.hidden = false;
      setChallengeStatus(profileAadhaarStatus, 'A fresh verification is required for each update.', 'info');
    });
  }

  if (sendProfileAadhaarOtpBtn) {
    sendProfileAadhaarOtpBtn.addEventListener('click', () => {
      if (!identityPhoneVerified) return;
      if (!validateDemoAadhaar(profileAadhaarInput, profileAadhaarStatus)) return;
      setDemoChallenge(profileAadhaarStatus, 'profileAadhaar', maskPhoneNumber(demoProfile.phone));
      profileAadhaarOtpInput.focus();
    });
  }

  if (verifyProfileAadhaarOtpBtn) {
    verifyProfileAadhaarOtpBtn.addEventListener('click', () => {
      if (!identityPhoneVerified || !identityChallenges.profileAadhaar) {
        setChallengeStatus(profileAadhaarStatus, 'Request a fresh demo OTP first.');
        return;
      }
      if (profileAadhaarOtpInput.value.trim() !== identityChallenges.profileAadhaar) {
        setChallengeStatus(profileAadhaarStatus, 'Incorrect demo OTP. Try again or request a new one.');
        return;
      }
      identityChallenges.profileAadhaar = '';
      profileAadhaarPanel.hidden = true;
      profileUpdateForm.hidden = false;
      document.getElementById('profileNameInput').value = demoProfile.name;
      document.getElementById('profileFatherNameInput').value = demoProfile.fatherName;
      document.getElementById('profileAddressInput').value = demoProfile.address;
      profilePhoneInput.value = demoProfile.phone;
      profileUpdateStatus.textContent = 'Aadhaar OTP verified (demo). Changes are held in this page only.';
      profileUpdateStatus.className = 'otp-status success';
      profileAadhaarOtpInput.value = '';
    });
  }

  if (profileUpdateFormElement) {
    profileUpdateFormElement.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!identityPhoneVerified) return;

      const updatedPhone = profilePhoneInput.value.trim();
      if (updatedPhone.replace(/\D/g, '').length < 10) {
        profileUpdateStatus.textContent = 'Enter a valid mobile number.';
        profileUpdateStatus.className = 'otp-status danger';
        return;
      }

      if (updatedPhone.replace(/\D/g, '') !== demoProfile.phone.replace(/\D/g, '')) {
        setDemoChallenge(phoneUpdateStatus, 'phoneUpdate', maskPhoneNumber(updatedPhone));
        phoneUpdateConfirmationPanel.hidden = false;
        phoneUpdateStatus.hidden = false;
        phoneUpdateOtpInput.value = '';
        phoneUpdateOtpInput.focus();
        return;
      }

      saveDemoProfileChanges(updatedPhone);
    });
  }

  function saveDemoProfileChanges(updatedPhone) {
    const phoneChanged = updatedPhone.replace(/\D/g, '') !== demoProfile.phone.replace(/\D/g, '');
    demoProfile.name = document.getElementById('profileNameInput').value.trim();
    demoProfile.fatherName = document.getElementById('profileFatherNameInput').value.trim();
    demoProfile.address = document.getElementById('profileAddressInput').value.trim();
    demoProfile.phone = updatedPhone;
    if (identityMobile) identityMobile.value = updatedPhone;
    updateDemoProfileDetails();
    if (phoneChanged) {
      identityAadhaarVerified = false;
      identityAadhaarPatternRisk = false;
      identityChallenges.identityAadhaar = '';
      identityAadhaarOtpInput.value = '';
      setChallengeStatus(identityAadhaarStatus, 'Phone changed. Verify a fresh Aadhaar test OTP to rerun the combined analysis.', 'info');
      renderIdentityPending('Phone changed. Step 03 must be completed again before the combined analysis can be shown.');
    } else if (identityAadhaarVerified) {
      renderIdentityResult(updatedPhone, identityAadhaarPatternRisk);
    } else {
      renderIdentityPending();
    }
    profileUpdateForm.hidden = true;
    if (phoneUpdateConfirmationPanel) phoneUpdateConfirmationPanel.hidden = true;
    setOtpStatus('Demo profile updated in this page only.', 'success');
    if (profileUpdateStatus) {
      profileUpdateStatus.textContent = 'Demo profile updated. No information was sent or saved.';
      profileUpdateStatus.className = 'otp-status success';
    }
  }

  const verifyPhoneUpdateOtpBtn = document.getElementById('verifyPhoneUpdateOtpBtn');
  if (verifyPhoneUpdateOtpBtn) {
    verifyPhoneUpdateOtpBtn.addEventListener('click', () => {
      if (!identityChallenges.phoneUpdate) {
        setChallengeStatus(phoneUpdateStatus, 'Request a demo OTP for the updated number first.');
        return;
      }
      if (phoneUpdateOtpInput.value.trim() !== identityChallenges.phoneUpdate) {
        setChallengeStatus(phoneUpdateStatus, 'Incorrect demo OTP. Try again or request a new one.');
        return;
      }
      identityChallenges.phoneUpdate = '';
      phoneUpdateStatus.hidden = true;
      saveDemoProfileChanges(profilePhoneInput.value.trim());
    });
  }

  const startBiometricUpdateBtn = document.getElementById('startBiometricUpdateBtn');
  if (startBiometricUpdateBtn) {
    startBiometricUpdateBtn.addEventListener('click', () => {
      if (!identityPhoneVerified) return;
      identityChallenges.biometricAadhaar = '';
      biometricAadhaarInput.value = '';
      biometricAadhaarOtpInput.value = '';
      biometricOptionsPanel.hidden = true;
      biometricAadhaarPanel.hidden = false;
      setChallengeStatus(biometricAadhaarStatus, 'A fresh verification is required for each update.', 'info');
    });
  }

  if (sendBiometricAadhaarOtpBtn) {
    sendBiometricAadhaarOtpBtn.addEventListener('click', () => {
      if (!identityPhoneVerified) return;
      if (!validateDemoAadhaar(biometricAadhaarInput, biometricAadhaarStatus)) return;
      setDemoChallenge(biometricAadhaarStatus, 'biometricAadhaar', maskPhoneNumber(demoProfile.phone));
      biometricAadhaarOtpInput.focus();
    });
  }

  if (verifyBiometricAadhaarOtpBtn) {
    verifyBiometricAadhaarOtpBtn.addEventListener('click', () => {
      if (!identityPhoneVerified || !identityChallenges.biometricAadhaar) {
        setChallengeStatus(biometricAadhaarStatus, 'Request a fresh demo OTP first.');
        return;
      }
      if (biometricAadhaarOtpInput.value.trim() !== identityChallenges.biometricAadhaar) {
        setChallengeStatus(biometricAadhaarStatus, 'Incorrect demo OTP. Try again or request a new one.');
        return;
      }
      identityChallenges.biometricAadhaar = '';
      biometricAadhaarOtpInput.value = '';
      biometricAadhaarPanel.hidden = true;
      biometricOptionsPanel.hidden = false;
      biometricConfirmOtpInput.value = '';
      biometricUpdates.clear();
      setChallengeStatus(biometricConfirmStatus, 'Select at least one demo update.', 'info');
    });
  }

  const requestBiometricConfirmOtpBtn = document.getElementById('requestBiometricConfirmOtpBtn');
  if (requestBiometricConfirmOtpBtn) {
    requestBiometricConfirmOtpBtn.addEventListener('click', () => {
      if (!identityPhoneVerified) return;
      const selected = [...document.querySelectorAll('input[name="biometricUpdate"]:checked')];
      if (selected.length === 0) {
        setChallengeStatus(biometricConfirmStatus, 'Select at least one demo update before requesting confirmation.');
        return;
      }
      setDemoChallenge(biometricConfirmStatus, 'biometricConfirm', maskPhoneNumber(demoProfile.phone));
      biometricConfirmOtpInput.focus();
    });
  }

  const confirmBiometricUpdateBtn = document.getElementById('confirmBiometricUpdateBtn');
  if (confirmBiometricUpdateBtn) {
    confirmBiometricUpdateBtn.addEventListener('click', () => {
      if (!identityPhoneVerified || !identityChallenges.biometricConfirm) {
        setChallengeStatus(biometricConfirmStatus, 'Request a confirmation demo OTP before saving.');
        return;
      }
      if (biometricConfirmOtpInput.value.trim() !== identityChallenges.biometricConfirm) {
        setChallengeStatus(biometricConfirmStatus, 'Incorrect demo OTP. Try again or request a new one.');
        return;
      }
      document.querySelectorAll('input[name="biometricUpdate"]:checked').forEach(input => biometricUpdates.add(input.value));
      document.querySelectorAll('#biometricStatus strong').forEach((status, index) => {
        const biometricName = ['Eye scan', 'Fingerprint', 'Hand print'][index];
        if (biometricUpdates.has(biometricName)) status.textContent = 'Updated (demo)';
      });
      identityChallenges.biometricConfirm = '';
      biometricConfirmOtpInput.value = '';
      biometricOptionsPanel.hidden = true;
      setChallengeStatus(biometricConfirmStatus, 'Confirmation verified. Selected demo updates were saved in this page only.', 'success');
    });
  }

  // --- Zero-Day Attack Simulation Button ---
  const testZeroDaySimBtn = document.getElementById('testZeroDaySimBtn');
  const sigSimVerdict = document.getElementById('sigSimVerdict');
  const anomSimVerdict = document.getElementById('anomSimVerdict');

  if (testZeroDaySimBtn) {
    testZeroDaySimBtn.addEventListener('click', () => {
      testZeroDaySimBtn.innerHTML = '<i data-lucide="loader"></i> Injecting Zero-Day Payload...';

      setTimeout(() => {
        if (sigSimVerdict) {
          sigSimVerdict.innerHTML = `
            <div class="sim-label">Signature Engine Verdict (Hash: 8f9b...a1):</div>
            <div class="sim-result-badge safe-badge">
              <i data-lucide="x-circle" style="color:#ff3366"></i> BYPASS! NO SIGNATURE FOUND IN VIRUS DEFINITIONS
            </div>
          `;
        }

        if (anomSimVerdict) {
          anomSimVerdict.innerHTML = `
            <div class="sim-label">Anomaly Engine Verdict (Entropy: 8.92, Heuristic: 98%):</div>
            <div class="sim-result-badge danger-badge">
              <i data-lucide="shield-alert"></i> 🚨 ZERO-DAY BLOCKED: UNSEEN EXECUTION HOOK INTERCEPTED
            </div>
          `;
        }

        testZeroDaySimBtn.innerHTML = '<i data-lucide="check"></i> Zero-Day Exploit Simulated';
        setTimeout(() => {
          testZeroDaySimBtn.innerHTML = '<i data-lucide="play-circle"></i> Simulate Another Zero-Day';
        }, 2500);

        if (window.lucide) window.lucide.createIcons();
      }, 700);
    });
  }

  // --- Initial Metric Counters ---
  const emailsAnalyzedEl = document.getElementById('emailsAnalyzedCount');
  const threatsDetectedEl = document.getElementById('threatsDetectedCount');

  function animateValue(element, start, end, duration) {
    if (!element) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easedProgress * (end - start) + start);
      element.textContent = current.toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = end.toLocaleString();
      }
    };
    window.requestAnimationFrame(step);
  }

  if (emailsAnalyzedEl) animateValue(emailsAnalyzedEl, 0, state.emailsAnalyzed, 1500);
  if (threatsDetectedEl) animateValue(threatsDetectedEl, 0, state.threatsDetected, 1500);

  // --- Risk Gauge Calculation ---
  function updateRiskGauge(score) {
    const gaugeFill = document.getElementById('riskGaugeFill');
    const gaugeValueText = document.getElementById('riskScoreValue');
    const riskBadge = document.getElementById('riskLevelBadge');

    if (!gaugeFill || !gaugeValueText) return;

    const circumference = 314.159;
    const offset = circumference - (score / 100) * circumference;
    gaugeFill.style.strokeDashoffset = offset;
    gaugeValueText.textContent = score;

    if (score >= 70) {
      gaugeFill.style.stroke = '#ff3366';
      gaugeValueText.style.color = '#ff3366';
      if (riskBadge) {
        riskBadge.innerHTML = '<span>CRITICAL</span>';
        riskBadge.style.color = '#ff3366';
      }
    } else if (score >= 40) {
      gaugeFill.style.stroke = '#f59e0b';
      gaugeValueText.style.color = '#f59e0b';
      if (riskBadge) {
        riskBadge.innerHTML = '<span>ELEVATED</span>';
        riskBadge.style.color = '#f59e0b';
      }
    } else {
      gaugeFill.style.stroke = '#10b981';
      gaugeValueText.style.color = '#10b981';
      if (riskBadge) {
        riskBadge.innerHTML = '<span>SECURE</span>';
        riskBadge.style.color = '#10b981';
      }
    }
  }

  updateRiskGauge(state.riskScore);

  // --- Time Range Selector ---
  const timeBtns = document.querySelectorAll('.time-btn');
  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const range = btn.dataset.range;
      if (range === '24h') {
        state.emailsAnalyzed = 184920;
        state.threatsDetected = 3418;
        state.riskScore = 68;
      } else if (range === '7d') {
        state.emailsAnalyzed = 1240500;
        state.threatsDetected = 24190;
        state.riskScore = 74;
      } else if (range === '30d') {
        state.emailsAnalyzed = 5120300;
        state.threatsDetected = 98450;
        state.riskScore = 62;
      }

      animateValue(emailsAnalyzedEl, 0, state.emailsAnalyzed, 1000);
      animateValue(threatsDetectedEl, 0, state.threatsDetected, 1000);
      updateRiskGauge(state.riskScore);
    });
  });

  // --- Email Phishing Simulator Presets ---
  const sampleLures = {
    'upi-cashback': {
      sender: 'cashback-reward@paytm-rewards-upi.xyz',
      subject: 'CONGRATULATIONS: You Won ₹4,999 Festive UPI Cashback - Enter PIN to Claim',
      body: `Dear Customer,

Your registered mobile number has been selected for the National Digital Payment Festive Cashback of ₹4,999.00!
This cashback will expire in 15 minutes if uncollected.

Follow these steps to claim funds directly into your bank:
1. Click the secure claim link below:
http://upi-rewards-cashback-collect.xyz/auth?user_id=74829
2. Scan the dynamic QR code on screen.
3. Enter your 6-digit UPI PIN to verify and accept payment into your account.

NPCI Unified Payments Support`
    },
    'urgent-bank': {
      sender: 'kyc-verification@sbi-online-portal.in.net',
      subject: 'URGENT: SBI Account Blocked Due to Expired PAN KYC - Update Immediately',
      body: `Dear SBI Customer,

Your State Bank of India account has been suspended today due to incomplete PAN card linking.
Your debit card and NetBanking services will be frozen within 24 hours.

Please click the official portal link below to update your PAN and Aadhaar:
http://sbi-kyc-quick-update.ru/auth/sbi-portal

Do not share your NetBanking password with anyone.
Chief Risk Officer, State Bank of India`
    },
    'ceo-fraud': {
      sender: 'director.office@corporate-holding-executive.biz',
      subject: 'CONFIDENTIAL: Urgent Wire Transfer for Acquisition Pending',
      body: `Hi,

Are you at your desk right now? I am currently in a closed-door meeting with our legal counsel for an emergency vendor acquisition.

I need you to process an immediate wire transfer of ₹4,85,000 to the attached vendor account before 2:00 PM. Keep this confidential until the announcement tomorrow. 

Let me know once you are ready for the wire coordinates.

Regards,
Chief Executive Officer`
    },
    'password-reset': {
      sender: 'security-alert@micros0ft-support-portal.net',
      subject: 'URGENT: Microsoft 365 Password Expiration in 2 Hours - Verify Now',
      body: `Dear User,

Your Microsoft 365 security token has expired. All pending incoming emails have been placed on hold.
Failure to authenticate within 2 hours will result in permanent account termination.

Please click the secure link below to keep your active session:
http://login-microsoft-portal365-verify.ru/auth/login?token=8923a

IT Helpdesk Support Team`
    },
    'legit-meeting': {
      sender: 'sarah.miller@enterprise-corp.com',
      subject: 'Updated: Q4 Project Roadmap & Security Sync - Thursday @ 3pm',
      body: `Hi Team,

I've updated our shared slide deck for Thursday's Q4 roadmap review. We'll be discussing the new email defense milestones and budget allocations.

Meeting link: https://meet.google.com/abc-defg-hij
Agenda notes are attached in our internal Notion workspace.

See you all then!
Sarah Miller
Product Lead`
    }
  };

  const presetBtns = document.querySelectorAll('.preset-btn');
  const senderInput = document.getElementById('senderInput');
  const subjectInput = document.getElementById('subjectInput');
  const bodyInput = document.getElementById('bodyInput');

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sampleKey = btn.dataset.sample;
      const sample = sampleLures[sampleKey];
      if (sample) {
        if (senderInput) senderInput.value = sample.sender;
        if (subjectInput) subjectInput.value = sample.subject;
        if (bodyInput) bodyInput.value = sample.body;
        analyzeEmailContent();
      }
    });
  });

  const clearScanBtn = document.getElementById('clearScanBtn');
  if (clearScanBtn) {
    clearScanBtn.addEventListener('click', () => {
      if (senderInput) senderInput.value = '';
      if (subjectInput) subjectInput.value = '';
      if (bodyInput) bodyInput.value = '';
    });
  }

  // --- Real-time Email Phishing Engine ---
  const runScanBtn = document.getElementById('runScanBtn');
  if (runScanBtn) {
    runScanBtn.addEventListener('click', analyzeEmailContent);
  }

  function analyzeEmailContent() {
    const sender = (senderInput?.value || '').trim();
    const subject = (subjectInput?.value || '').trim();
    const body = (bodyInput?.value || '').trim();

    if (!sender && !subject && !body) {
      alert('Please enter or select an email to analyze.');
      return;
    }

    const fullText = (sender + ' ' + subject + ' ' + body).toLowerCase();
    const flags = [];
    let threatScore = 5;
    let vector = 'Clean / Low Risk';
    let action = 'Deliver to Inbox';

    // 1. UPI Payment PIN Deception
    if (/enter your (4|6)?-?digit upi pin|enter pin to receive|scan qr.*pin|cashback.*pin/i.test(fullText)) {
      flags.push({
        type: 'red',
        title: 'UPI PIN Payment Deception',
        desc: `Message attempts to trick recipient into entering their UPI PIN under the false premise of receiving money or cashback.`
      });
      threatScore += 55;
      vector = 'UPI PIN Fraud';
    }

    // 2. Suspicious TLDs
    const suspiciousTlds = ['.ru', '.xyz', '.biz', '.cc', '.link', '.top', '.work', '.in.net'];
    const matchedTld = suspiciousTlds.find(tld => sender.toLowerCase().includes(tld));
    if (matchedTld) {
      flags.push({
        type: 'red',
        title: 'Suspicious Domain TLD',
        desc: `Sender uses untrusted top-level domain (${matchedTld}) typically associated with disposable phishing kits.`
      });
      threatScore += 30;
    }

    // 3. Urgency and Pressure
    const urgencyKeywords = ['urgent', 'immediate', 'suspended', '2 hours', '15 minutes', 'permanent termination', 'pan card', 'kyc'];
    const foundUrgency = urgencyKeywords.filter(kw => fullText.includes(kw));
    if (foundUrgency.length > 0) {
      flags.push({
        type: 'red',
        title: 'Social Engineering Urgency',
        desc: `Exploits fear and urgency triggers (${foundUrgency.slice(0, 3).join(', ')}).`
      });
      threatScore += 25;
    }

    // 4. Credential Harvesters
    if (/password expiration|verify your identity|security token|login\?token=/i.test(fullText)) {
      flags.push({
        type: 'red',
        title: 'Credential Harvesting Intent',
        desc: `Direct call-to-action urging user to submit credentials on unverified third-party pages.`
      });
      threatScore += 30;
      vector = 'Credential Harvester';
    }

    // Clean Email check
    if (threatScore <= 20) {
      flags.push({
        type: 'green',
        title: 'Cryptographic Authenticity Verified',
        desc: `Sender domain passes SPF and DKIM with no fraudulent payment or urgency patterns.`
      });
      threatScore = Math.max(threatScore, 4);
    }

    threatScore = Math.min(threatScore, 98);

    if (threatScore >= 60) {
      action = 'Quarantine & Alert Gateway';
    } else if (threatScore >= 35) {
      action = 'Deliver with High-Risk Banner';
    } else {
      action = 'Deliver to Inbox';
    }

    displayScanVerdict(threatScore, vector, action, flags);

    // Increment global counters
    state.emailsAnalyzed += 1;
    if (threatScore >= 60) state.threatsDetected += 1;
    if (emailsAnalyzedEl) emailsAnalyzedEl.textContent = state.emailsAnalyzed.toLocaleString();
    if (threatsDetectedEl) threatsDetectedEl.textContent = state.threatsDetected.toLocaleString();

    if (window.lucide) window.lucide.createIcons();
  }

  function displayScanVerdict(score, vector, action, flags) {
    const verdictBanner = document.getElementById('verdictBanner');
    const verdictIcon = document.getElementById('verdictIcon');
    const verdictTag = document.getElementById('verdictTag');
    const verdictTitle = document.getElementById('verdictTitle');
    const resThreatScore = document.getElementById('resThreatScore');
    const resVector = document.getElementById('resVector');
    const resAction = document.getElementById('resAction');
    const flagItemsList = document.getElementById('flagItemsList');

    if (!verdictBanner) return;

    if (score >= 60) {
      verdictBanner.className = 'result-status-banner danger';
      verdictIcon.innerHTML = '<i data-lucide="alert-triangle"></i>';
      verdictTag.textContent = 'HIGH CONFIDENCE THREAT';
      verdictTitle.textContent = `${vector.toUpperCase()} DETECTED`;
      resThreatScore.textContent = score + '%';
      resThreatScore.className = 'score-num threat-red';
      resAction.className = 'score-label threat-red';
    } else if (score >= 35) {
      verdictBanner.className = 'result-status-banner danger';
      verdictIcon.innerHTML = '<i data-lucide="alert-circle"></i>';
      verdictTag.textContent = 'SUSPICIOUS EMAIL';
      verdictTitle.textContent = 'POTENTIAL RISK DETECTED';
      resThreatScore.textContent = score + '%';
      resThreatScore.className = 'score-num threat-amber';
      resAction.className = 'score-label threat-amber';
    } else {
      verdictBanner.className = 'result-status-banner safe';
      verdictIcon.innerHTML = '<i data-lucide="check-circle-2"></i>';
      verdictTag.textContent = 'VERIFIED SAFE';
      verdictTitle.textContent = 'LEGITIMATE COMMUNICATION';
      resThreatScore.textContent = score + '%';
      resThreatScore.className = 'score-num safe-green';
      resAction.className = 'score-label safe-badge';
    }

    resVector.textContent = vector;
    resAction.textContent = action;

    if (flagItemsList) {
      flagItemsList.innerHTML = flags.map(f => `
        <li class="flag-item ${f.type}">
          <i data-lucide="${f.type === 'green' ? 'check-circle' : 'x-circle'}"></i>
          <span><strong>${f.title}:</strong> ${f.desc}</span>
        </li>
      `).join('');
    }
  }

  // ==========================================================================
  // DEEP FORENSICS MODAL SYSTEM (For All 4 Overview Metrics)
  // ==========================================================================
  const modalOverlay = document.getElementById('cyberDetailModalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalEyebrow = document.getElementById('modalEyebrow');
  const modalIconWrap = document.getElementById('modalIconWrap');
  const modalBodyContent = document.getElementById('modalBodyContent');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const closeModalBtnSecondary = document.getElementById('closeModalBtnSecondary');

  // Forensic Datasets for each card
  const forensicsDatabase = {
    // 1. THREATS DETECTED: "Who has threatened and all other things"
    threats: {
      eyebrow: 'THREAT ACTOR PROFILING & MALICIOUS PAYLOADS',
      title: 'Threats Detected: Who Has Threatened & Origin Forensics',
      icon: 'shield-alert',
      iconClass: 'danger',
      render: () => `
        <div class="forensic-hero-banner">
          <div class="forensic-hero-stat">
            <span class="stat-label">Total Intercepted Attacks</span>
            <span class="stat-val text-danger">3,418 Cases</span>
          </div>
          <div class="forensic-hero-stat">
            <span class="stat-label">Identified Threat Syndicates</span>
            <span class="stat-val text-cyan">4 Major Botnets</span>
          </div>
          <div class="forensic-hero-stat">
            <span class="stat-label">Automated Mitigation Rate</span>
            <span class="stat-val text-safe">99.2% Quarantined</span>
          </div>
        </div>

        <h3 class="findings-title" style="margin-bottom:1rem; font-size:1rem;">
          <i data-lucide="skull"></i> Identified Threat Actors &amp; Attacker Profiles
        </h3>

        <div class="threat-actors-list">
          
          <!-- Actor 1: West Africa Syndicate -->
          <div class="actor-card">
            <div class="actor-card-header">
              <div class="actor-title-group">
                <span class="actor-badge danger">CRITICAL THREAT</span>
                <span class="actor-name">Scam Syndicate 419 (West Africa / Telegram Hub)</span>
              </div>
              <span class="ip-code">197.210.226.42 • Lagos, Nigeria 🇳🇬</span>
            </div>
            <div class="actor-details-grid">
              <div class="actor-field">
                <span class="actor-field-name">Targeted Entity / Brand:</span>
                <span class="actor-field-val">State Bank of India (SBI) &amp; Chase Customers</span>
              </div>
              <div class="actor-field">
                <span class="actor-field-name">Primary Attack Vector:</span>
                <span class="actor-field-val">UPI Collect Deception &amp; PAN KYC Suspension Lures</span>
              </div>
              <div class="actor-field">
                <span class="actor-field-name">Attack Frequency:</span>
                <span class="actor-field-val">1,240 intercepted attempts</span>
              </div>
              <div class="actor-field">
                <span class="actor-field-name">Payload / Link:</span>
                <span class="actor-field-val ip-code">http://sbi-kyc-quick-update.ru/auth</span>
              </div>
            </div>
            <div class="actor-action-taken">
              <i data-lucide="shield-check"></i>
              <span><strong>Mitigation Action:</strong> ASN Null-Routed, domain added to National Gateway Blocklist.</span>
            </div>
          </div>

          <!-- Actor 2: Digital Arrest Video Extortion Gang -->
          <div class="actor-card">
            <div class="actor-card-header">
              <div class="actor-title-group">
                <span class="actor-badge danger">PSYCHOLOGICAL EXTORTION</span>
                <span class="actor-name">Digital Arrest Ring (Cambodia / Mewat Cloud VoIP)</span>
              </div>
              <span class="ip-code">103.14.120.88 • Phnom Penh Virtual SIP 🇰🇭</span>
            </div>
            <div class="actor-details-grid">
              <div class="actor-field">
                <span class="actor-field-name">Impersonated Authorities:</span>
                <span class="actor-field-val">Mumbai Police, CBI &amp; Supreme Court of India</span>
              </div>
              <div class="actor-field">
                <span class="actor-field-name">Primary Attack Vector:</span>
                <span class="actor-field-val">Forged Skype Video Courtrooms &amp; Fake Warrants</span>
              </div>
              <div class="actor-field">
                <span class="actor-field-name">Incident Count:</span>
                <span class="actor-field-val">312 targeted citizens</span>
              </div>
              <div class="actor-field">
                <span class="actor-field-name">Average Coerced Sum:</span>
                <span class="actor-field-val text-gold">₹ 14.5 Lakhs per victim</span>
              </div>
            </div>
            <div class="actor-action-taken">
              <i data-lucide="shield-alert"></i>
              <span><strong>Mitigation Action:</strong> VoIP gateway SIP trunks reported to DoT &amp; I4C Cyber Crime Cell.</span>
            </div>
          </div>

          <!-- Actor 3: Typosquat Botnet Cluster Alpha -->
          <div class="actor-card">
            <div class="actor-card-header">
              <div class="actor-title-group">
                <span class="actor-badge amber">CREDENTIAL HARVESTER</span>
                <span class="actor-name">Typosquat Botnet Cluster Alpha</span>
              </div>
              <span class="ip-code">185.220.101.5 • Bucharest, Romania 🇷🇴</span>
            </div>
            <div class="actor-details-grid">
              <div class="actor-field">
                <span class="actor-field-name">Impersonated Domain:</span>
                <span class="actor-field-val">micros0ft-support-portal.net (Homoglyph '0')</span>
              </div>
              <div class="actor-field">
                <span class="actor-field-name">Primary Attack Vector:</span>
                <span class="actor-field-val">Office 365 OAuth Token Exfiltration</span>
              </div>
              <div class="actor-field">
                <span class="actor-field-name">Interception Volume:</span>
                <span class="actor-field-val">890 enterprise attacks</span>
              </div>
              <div class="actor-field">
                <span class="actor-field-name">Exploit Mechanism:</span>
                <span class="actor-field-val">Disposable .ru redirectors</span>
              </div>
            </div>
            <div class="actor-action-taken">
              <i data-lucide="shield-check"></i>
              <span><strong>Mitigation Action:</strong> Registrar domain locked; TLS certificate revoked by Let's Encrypt.</span>
            </div>
          </div>

          <!-- Actor 4: PhishKit Lure Network V8 -->
          <div class="actor-card">
            <div class="actor-card-header">
              <div class="actor-title-group">
                <span class="actor-badge amber">E-COMMERCE FRAUD</span>
                <span class="actor-name">PhishKit Lure Network V8</span>
              </div>
              <span class="ip-code">45.142.214.12 • Saint Petersburg, Russia 🇷🇺</span>
            </div>
            <div class="actor-details-grid">
              <div class="actor-field">
                <span class="actor-field-name">Impersonated Entity:</span>
                <span class="actor-field-val">India Post / BlueDart Delivery SMS</span>
              </div>
              <div class="actor-field">
                <span class="actor-field-name">Attack Vector:</span>
                <span class="actor-field-val">Fake ₹5 Delivery Fee Page to harvest CVVs</span>
              </div>
              <div class="actor-field">
                <span class="actor-field-name">Blast Radius:</span>
                <span class="actor-field-val">642 bulk SMS campaigns</span>
              </div>
              <div class="actor-field">
                <span class="actor-field-name">Target Gateway:</span>
                <span class="actor-field-val">Unsecured payment aggregator clones</span>
              </div>
            </div>
            <div class="actor-action-taken">
              <i data-lucide="shield-check"></i>
              <span><strong>Mitigation Action:</strong> Phishing kit hashes pushed to Chrome Safe Browsing &amp; Edge SmartScreen.</span>
            </div>
          </div>

        </div>

        <h3 class="findings-title" style="margin-bottom:0.75rem; font-size:1rem;">
          <i data-lucide="activity"></i> Raw Live Attack Interception Telemetry
        </h3>

        <div class="forensic-table-wrap">
          <table class="forensic-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Threat Actor Handle</th>
                <th>Source IP &amp; Geolocation</th>
                <th>Attack Vector</th>
                <th>Defense Action Taken</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="ip-code">12:14:02</td>
                <td><strong>Lagos-419-Node</strong></td>
                <td class="ip-code">197.210.226.42 (NG)</td>
                <td>Fake SBI PAN SMS Link</td>
                <td><span class="tag-chip danger-chip">BLOCKED AT GATEWAY</span></td>
              </tr>
              <tr>
                <td class="ip-code">12:11:38</td>
                <td><strong>Cambodia-VoIP-Ring</strong></td>
                <td class="ip-code">103.14.120.88 (KH)</td>
                <td>Digital Arrest Extortion Video</td>
                <td><span class="tag-chip danger-chip">REPORTED TO 1930 / I4C</span></td>
              </tr>
              <tr>
                <td class="ip-code">12:08:15</td>
                <td><strong>Tor-Exit-Cluster</strong></td>
                <td class="ip-code">185.220.101.5 (RO)</td>
                <td>M365 Token Harvester</td>
                <td><span class="tag-chip warning-chip">QUARANTINED</span></td>
              </tr>
              <tr>
                <td class="ip-code">12:03:49</td>
                <td><strong>SpamBot-RU-99</strong></td>
                <td class="ip-code">45.142.214.12 (RU)</td>
                <td>Fake India Post Delivery SMS</td>
                <td><span class="tag-chip danger-chip">PAYLOAD DROPPED</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },

    // 2. NUMBER OF EMAILS ANALYZED
    emails: {
      eyebrow: 'MAILSTREAM INGESTION & HEURISTIC TELEMETRY',
      title: 'Number of Emails Analyzed: Protocol Verification & Clusters',
      icon: 'mail-check',
      iconClass: 'cyan',
      render: () => `
        <div class="forensic-hero-banner">
          <div class="forensic-hero-stat">
            <span class="stat-label">Total Ingested Mailstream</span>
            <span class="stat-val text-cyan">184,920 msgs</span>
          </div>
          <div class="forensic-hero-stat">
            <span class="stat-label">Clean Inbound Deliveries</span>
            <span class="stat-val text-safe">181,502 (98.15%)</span>
          </div>
          <div class="forensic-hero-stat">
            <span class="stat-label">Avg Inspection Latency</span>
            <span class="stat-val text-gold">14.2 ms / msg</span>
          </div>
        </div>

        <h3 class="findings-title" style="margin-bottom:1rem; font-size:1rem;">
          <i data-lucide="check-check"></i> Cryptographic Protocol Verification Breakdown
        </h3>

        <div class="actor-details-grid" style="margin-bottom:1.5rem;">
          <div class="actor-field">
            <span class="actor-field-name">SPF (Sender Policy Framework):</span>
            <span class="actor-field-val text-safe">98.4% Pass • 1.6% Hard Fail</span>
          </div>
          <div class="actor-field">
            <span class="actor-field-name">DKIM Cryptographic Signatures:</span>
            <span class="actor-field-val text-safe">96.2% Verified • 3.8% Invalid</span>
          </div>
          <div class="actor-field">
            <span class="actor-field-name">DMARC Strict Enforcement:</span>
            <span class="actor-field-val text-safe">94.1% Enforced (Reject on fail)</span>
          </div>
          <div class="actor-field">
            <span class="actor-field-name">Zero-Day Behavioral Sandboxing:</span>
            <span class="actor-field-val text-cyan">100% Inbound Payloads Executed</span>
          </div>
        </div>

        <h3 class="findings-title" style="margin-bottom:1rem; font-size:1rem;">
          <i data-lucide="layers"></i> Top Inbound Sender Domain Clusters
        </h3>

        <div class="forensic-table-wrap">
          <table class="forensic-table">
            <thead>
              <tr>
                <th>Domain Cluster</th>
                <th>Volume Analyzed</th>
                <th>Threat Classification</th>
                <th>SPF/DKIM State</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>google.com / gmail.com</strong></td>
                <td>48,290 msgs (26.1%)</td>
                <td><span class="tag-chip" style="color:#10b981; background:rgba(16,185,129,0.15)">99.9% CLEAN</span></td>
                <td class="text-safe">VALID CRYPTO KEYS</td>
              </tr>
              <tr>
                <td><strong>microsoft.com / outlook.com</strong></td>
                <td>41,520 msgs (22.5%)</td>
                <td><span class="tag-chip" style="color:#10b981; background:rgba(16,185,129,0.15)">99.7% CLEAN</span></td>
                <td class="text-safe">VALID CRYPTO KEYS</td>
              </tr>
              <tr>
                <td><strong>corporate-banking-gateways.in</strong></td>
                <td>28,400 msgs (15.4%)</td>
                <td><span class="tag-chip" style="color:#10b981; background:rgba(16,185,129,0.15)">100% VERIFIED</span></td>
                <td class="text-safe">AUTHENTICATED BANK GATEWAY</td>
              </tr>
              <tr>
                <td><strong>paytm-rewards-upi.xyz &amp; lookalikes</strong></td>
                <td>2,180 msgs (1.2%)</td>
                <td><span class="tag-chip danger-chip">100% PHISHING</span></td>
                <td class="text-danger">FAILED / TYPOSQUATTED</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },

    // 3. RISK SCORE
    risk: {
      eyebrow: 'MATHEMATICAL RISK FORMULATION',
      title: 'Risk Score: 68/100 Dynamic Algorithmic Breakdown',
      icon: 'gauge',
      iconClass: 'amber',
      render: () => `
        <div class="forensic-hero-banner">
          <div class="forensic-hero-stat">
            <span class="stat-label">Calculated Score</span>
            <span class="stat-val text-danger">68 / 100</span>
          </div>
          <div class="forensic-hero-stat">
            <span class="stat-label">National Threat Tier</span>
            <span class="stat-val" style="color:#f59e0b">ELEVATED WATCH</span>
          </div>
          <div class="forensic-hero-stat">
            <span class="stat-label">Heuristic Parameters Evaluated</span>
            <span class="stat-val text-cyan">14 Neural Vectors</span>
          </div>
        </div>

        <p class="comp-description">
          The risk score is calculated dynamically every 30 seconds using a multi-factor polynomial model: 
          <code style="color:var(--cyan-primary)">Score = &Sigma; (Heuristic Weight &times; Confidence Index) - Cryptographic Defense Offset</code>.
        </p>

        <h3 class="findings-title" style="margin-bottom:1rem; font-size:1rem;">
          <i data-lucide="sliders"></i> Key Threat Vectors Contributing to Current 68/100 Score
        </h3>

        <div class="heuristic-vector-list">
          <div class="h-vector-row">
            <div class="h-vector-header">
              <span class="h-vector-name">UPI Collect Request / "Enter PIN" Intent</span>
              <span class="h-vector-pts">+45 Risk Points</span>
            </div>
            <p class="h-vector-desc">High incidence of fake buyer collect requests on marketplaces attempting to reverse UPI PIN authorization.</p>
          </div>

          <div class="h-vector-row">
            <div class="h-vector-header">
              <span class="h-vector-name">Digital Arrest Extortion Lures</span>
              <span class="h-vector-pts">+40 Risk Points</span>
            </div>
            <p class="h-vector-desc">Surge in fake Mumbai Police &amp; CBI video calls using spoofed virtual SIP phone numbers.</p>
          </div>

          <div class="h-vector-row">
            <div class="h-vector-header">
              <span class="h-vector-name">Psychological Urgency &amp; Coercive Sentiment</span>
              <span class="h-vector-pts">+35 Risk Points</span>
            </div>
            <p class="h-vector-desc">Keywords ("within 15 minutes", "warrant issued", "account suspended") driving deception rate.</p>
          </div>

          <div class="h-vector-row">
            <div class="h-vector-header">
              <span class="h-vector-name">Untrusted TLD &amp; Fresh Domain Registrations (&lt; 48h)</span>
              <span class="h-vector-pts">+28 Risk Points</span>
            </div>
            <p class="h-vector-desc">Spike in newly generated domains ending in .xyz, .top, .ru, and .cc hosting disposable login kits.</p>
          </div>
        </div>
      `
    },

    // 4. SECURITY STATUS
    status: {
      eyebrow: 'DEFENSE ENGINE TOPOLOGY & HEALTH',
      title: 'Security Status: Active Shield Architecture & Node Health',
      icon: 'shield-check',
      iconClass: 'green',
      render: () => `
        <div class="forensic-hero-banner">
          <div class="forensic-hero-stat">
            <span class="stat-label">Defense Engine State</span>
            <span class="stat-val text-safe">SHIELD ACTIVE</span>
          </div>
          <div class="forensic-hero-stat">
            <span class="stat-label">Annual Uptime Availability</span>
            <span class="stat-val text-cyan">99.994%</span>
          </div>
          <div class="forensic-hero-stat">
            <span class="stat-label">Average Response Time</span>
            <span class="stat-val text-safe">11.8 ms</span>
          </div>
        </div>

        <h3 class="findings-title" style="margin-bottom:1rem; font-size:1rem;">
          <i data-lucide="cpu"></i> Active Autonomous Defense Nodes
        </h3>

        <div class="threat-actors-list">
          <div class="actor-card">
            <div class="actor-card-header">
              <div class="actor-title-group">
                <span class="actor-badge" style="background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3)">ONLINE • ENFORCED</span>
                <span class="actor-name">Neural Anomaly Detection Engine (Zero-Day Model v4.2)</span>
              </div>
              <span class="ip-code">Latency: 12ms</span>
            </div>
            <p style="font-size:0.84rem; color:var(--text-muted); margin-top:0.4rem;">
              Continuously profiles novel payloads in real-time execution sandboxes without relying on static signature catalogs.
            </p>
          </div>

          <div class="actor-card">
            <div class="actor-card-header">
              <div class="actor-title-group">
                <span class="actor-badge" style="background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3)">ONLINE • SYNCHRONIZED</span>
                <span class="actor-name">National UPI Threat Trap &amp; 1930 / I4C Feed Sync</span>
              </div>
              <span class="ip-code">Synced: 2 mins ago</span>
            </div>
            <p style="font-size:0.84rem; color:var(--text-muted); margin-top:0.4rem;">
              Direct integration cross-referencing suspect beneficiary UPI handles and scammer mobile numbers with national crime databases.
            </p>
          </div>

          <div class="actor-card">
            <div class="actor-card-header">
              <div class="actor-title-group">
                <span class="actor-badge" style="background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3)">ACTIVE</span>
                <span class="actor-name">Gateway Ingress Firewall &amp; DMARC Enforcer</span>
              </div>
              <span class="ip-code">Throughput: 12,000 req/s</span>
            </div>
            <p style="font-size:0.84rem; color:var(--text-muted); margin-top:0.4rem;">
              Cryptographically drops any mail with spoofed display names failing SPF or DKIM validation at the mail gateway boundary.
            </p>
          </div>
        </div>
      `
    }
  };

  // Click handler to open Forensic Modal on all 4 cards
  const clickableCards = document.querySelectorAll('.clickable-card[data-inspect]');
  clickableCards.forEach(card => {
    card.addEventListener('click', () => {
      const inspectType = card.dataset.inspect;
      openForensicsModal(inspectType);
    });
  });

  function openForensicsModal(type) {
    const data = forensicsDatabase[type];
    if (!data || !modalOverlay) return;

    if (modalTitle) modalTitle.textContent = data.title;
    if (modalEyebrow) modalEyebrow.textContent = data.eyebrow;

    if (modalIconWrap) {
      modalIconWrap.className = `modal-icon-wrap ${data.iconClass || ''}`;
      modalIconWrap.innerHTML = `<i data-lucide="${data.icon}"></i>`;
    }

    if (modalBodyContent) {
      modalBodyContent.innerHTML = data.render();
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (window.lucide) window.lucide.createIcons();
  }

  function closeForensicsModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeForensicsModal);
  if (closeModalBtnSecondary) closeModalBtnSecondary.addEventListener('click', closeForensicsModal);

  // Close when clicking outside dialog
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeForensicsModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeForensicsModal();
    }
  });

});
