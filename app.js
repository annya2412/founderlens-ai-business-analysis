// Application State
let appState = {
  theme: 'dark',
  currentAudit: null,
  charts: {
    marketing: null,
    sales: null
  }
};

// Default Demo Data Payload
const demoInputs = {
  businessName: "AlphaTech Systems",
  industry: "saas",
  website: "https://alphatech.io",
  stage: "growing",
  teamSize: "10",
  challenge: "scaling"
};

// DOM Elements
const views = {
  home: document.getElementById('home-view'),
  dashboard: document.getElementById('dashboard-view')
};

const globalHeader = document.getElementById('global-header');
const auditForm = document.getElementById('audit-form');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text');
const formSpinner = document.getElementById('form-spinner');

// Theme Configurations for Chart.js
const chartThemes = {
  dark: {
    text: '#94a3b8',
    grid: '#1e1b4b',
    border: '#1e1b4b'
  },
  light: {
    text: '#4b5563',
    grid: '#e5e7eb',
    border: '#e5e7eb'
  }
};

// ==========================================================================
// VIEW SWITCHER & ROUTING
// ==========================================================================
function switchView(targetView) {
  Object.keys(views).forEach(key => {
    if (key === targetView) {
      views[key].classList.add('active');
    } else {
      views[key].classList.remove('active');
    }
  });

  // Manage Global Header visibility
  if (targetView === 'dashboard') {
    globalHeader.style.display = 'none';
  } else {
    globalHeader.style.display = 'block';
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Sidebar Nav click handlers (Smooth Scroll layout)
const sidebarLinks = document.querySelectorAll('.sidebar-nav-link');
sidebarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Update active state manually on click
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

// Setup Scroll Spy to highlight active sidebar section
function setupScrollSpy() {
  const sections = Array.from(sidebarLinks).map(link => document.getElementById(link.getAttribute('data-target')));
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        sidebarLinks.forEach(link => {
          if (link.getAttribute('data-target') === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    if (section) observer.observe(section);
  });
}

// ==========================================================================
// THEME CONTROLLER
// ==========================================================================
function applyTheme(theme) {
  appState.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('founderlens-theme', theme);
  updateChartColors();
}

function updateChartColors() {
  const currentColors = chartThemes[appState.theme];
  
  ['marketing', 'sales'].forEach(chartType => {
    const chartInstance = appState.charts[chartType];
    if (chartInstance) {
      chartInstance.options.scales.r.grid.color = currentColors.grid;
      chartInstance.options.scales.r.angleLines.color = currentColors.grid;
      chartInstance.options.scales.r.pointLabels.color = currentColors.text;
      chartInstance.options.scales.r.ticks.color = currentColors.text;
      chartInstance.options.scales.r.ticks.backdropColor = 'transparent';
      chartInstance.update();
    }
  });
}

function toggleTheme() {
  const nextTheme = appState.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
}

// Initialize Theme
const savedTheme = localStorage.getItem('founderlens-theme') || 'dark';
applyTheme(savedTheme);

// ==========================================================================
// PREVIEW PANEL RENDERING (HOMEPAGE)
// ==========================================================================
function updatePreviewPanel(data) {
  document.getElementById('prev-biz-name').textContent = data.businessName;
  document.getElementById('prev-biz-website').textContent = data.website;
  document.getElementById('prev-biz-industry').textContent = data.industryName;
  document.getElementById('prev-biz-stage').textContent = data.stageLabel;
  document.getElementById('prev-health-score').textContent = data.healthScore;

  // Progress Bars
  document.getElementById('prev-mkt-val').textContent = `${data.marketing.score}%`;
  document.getElementById('prev-mkt-bar').style.width = `${data.marketing.score}%`;
  document.getElementById('prev-sales-val').textContent = `${data.sales.score}%`;
  document.getElementById('prev-sales-bar').style.width = `${data.sales.score}%`;

  // SWOT
  document.getElementById('prev-swot-strength').textContent = data.swot.strengths[0] || 'No strength identified';
  document.getElementById('prev-swot-opportunity').textContent = data.swot.opportunities[0] || 'No opportunity identified';

  // Roadmap 30 day summary
  document.getElementById('prev-roadmap-text').textContent = data.roadmap.thirtyDays;
}

// ==========================================================================
// FORM SUBMISSION & TIMELINE LOADER
// ==========================================================================
function triggerAuditGeneration(e) {
  if (e) e.preventDefault();
  
  // Show Loading Animation
  formSpinner.style.display = 'inline-block';
  loadingOverlay.classList.add('active');
  
  const loadingPhases = [
    { text: "Ingesting business parameters...", duration: 600 },
    { text: "Computing custom heuristic modifiers...", duration: 600 },
    { text: "Compiling strategic SWOT quadrants...", duration: 600 },
    { text: "Formatting interactive analysis dashboard...", duration: 600 }
  ];

  let elapsed = 0;
  loadingPhases.forEach((phase, idx) => {
    setTimeout(() => {
      loadingText.textContent = phase.text;
    }, elapsed);
    elapsed += phase.duration;
  });

  setTimeout(() => {
    // Collect Input Data
    const inputData = {
      businessName: document.getElementById('biz-name').value || demoInputs.businessName,
      industry: document.getElementById('biz-industry').value || demoInputs.industry,
      website: document.getElementById('biz-website').value || demoInputs.website,
      stage: document.getElementById('biz-stage').value || demoInputs.stage,
      teamSize: document.getElementById('biz-teamsize').value || demoInputs.teamSize,
      challenge: document.getElementById('biz-challenge').value || demoInputs.challenge
    };

    // Run Heuristics Engine
    const auditResult = generateAudit(inputData);
    appState.currentAudit = auditResult;

    // Update both preview and full dashboard
    updatePreviewPanel(auditResult);
    renderDashboard(auditResult);

    // Transition View
    loadingOverlay.classList.remove('active');
    formSpinner.style.display = 'none';
    switchView('dashboard');
    setupScrollSpy();
  }, elapsed);
}

// ==========================================================================
// RENDER AUDIT RESULTS TO FULL DASHBOARD
// ==========================================================================
function renderDashboard(data) {
  // Meta Details
  document.getElementById('dash-title-name').textContent = `Heuristic Analysis: ${data.businessName}`;
  document.getElementById('dash-meta-website').innerHTML = `<i class="fa-solid fa-globe"></i> ${data.website}`;
  document.getElementById('dash-meta-industry').innerHTML = `<i class="fa-solid fa-industry"></i> ${data.industryName}`;
  document.getElementById('dash-meta-stage').innerHTML = `<i class="fa-solid fa-tag"></i> ${data.stageLabel}`;

  // Section A: Business Overview
  document.getElementById('dash-summary-text').textContent = data.summary;
  document.getElementById('dash-audience-text').textContent = data.targetAudience;
  document.getElementById('dash-uvp-text').textContent = data.uvp;

  // Global Health Score Radial Gauge Animation
  const scoreVal = data.healthScore;
  const scoreElem = document.getElementById('health-score-value');
  const circleElem = document.getElementById('health-gauge-circle');
  const statusTextElem = document.getElementById('health-status-text');
  const statusDescElem = document.getElementById('health-status-desc');

  // Gauge Count Up
  let currVal = 0;
  const countInterval = setInterval(() => {
    if (currVal >= scoreVal) {
      clearInterval(countInterval);
      scoreElem.textContent = scoreVal;
    } else {
      currVal++;
      scoreElem.textContent = currVal;
    }
  }, 12);

  // SVG Gauge Arc
  const offset = 440 - (440 * scoreVal) / 100;
  circleElem.style.strokeDashoffset = offset;

  // Score Status Labels
  if (scoreVal >= 75) {
    statusTextElem.textContent = "High Efficacy Sector";
    statusTextElem.style.color = "var(--success)";
    circleElem.style.stroke = "var(--success)";
    statusDescElem.textContent = "Business demonstrates strong operations. Scalable pathways open.";
  } else if (scoreVal >= 55) {
    statusTextElem.textContent = "Steady Benchmark Efficacy";
    statusTextElem.style.color = "var(--warning)";
    circleElem.style.stroke = "var(--warning)";
    statusDescElem.textContent = "Operational processes are functional. Growth is limited by workflow challenges.";
  } else {
    statusTextElem.textContent = "Bottleneck Alert Level";
    statusTextElem.style.color = "var(--danger)";
    circleElem.style.stroke = "var(--danger)";
    statusDescElem.textContent = "Core operational pipeline leaks detected. High priority workflow corrections needed.";
  }

  // Section B: SWOT
  populateList('swot-strengths-list', data.swot.strengths);
  populateList('swot-weaknesses-list', data.swot.weaknesses);
  populateList('swot-opportunities-list', data.swot.opportunities);
  populateList('swot-threats-list', data.swot.threats);

  // Section C: Marketing Audit Progress Bars
  animateProgressBar('mkt-brand-bar', 'mkt-brand-val', data.marketing.branding);
  animateProgressBar('mkt-content-bar', 'mkt-content-val', data.marketing.content);
  animateProgressBar('mkt-lead-bar', 'mkt-lead-val', data.marketing.leadGen);
  animateProgressBar('mkt-social-bar', 'mkt-social-val', data.marketing.socialMedia);
  document.getElementById('mkt-score-circle').textContent = data.marketing.score;
  
  let mktAdvice = `Under the heuristic profile, branding is calculated at ${data.marketing.branding}/100 and lead generation at ${data.marketing.leadGen}/100. `;
  if (data.marketing.leadGen < 60) {
    mktAdvice += "Prioritize targeted outbound channels and search campaigns to secure fast pipeline validation before focusing on high-overhead branding materials.";
  } else {
    mktAdvice += "Traffic sources are validated. Shift development efforts to SEO authority content loops to lower cost per lead.";
  }
  document.getElementById('mkt-insights-text').textContent = mktAdvice;

  // Section D: Sales Audit Progress Bars
  animateProgressBar('sales-process-bar', 'sales-process-val', data.sales.salesProcess);
  animateProgressBar('sales-followup-bar', 'sales-followup-val', data.sales.followUp);
  animateProgressBar('sales-cro-bar', 'sales-cro-val', data.sales.conversionOptimization);
  document.getElementById('sales-score-circle').textContent = data.sales.score;

  let salesAdvice = `Sales efficiency indicators show conversion optimization at ${data.sales.conversionOptimization}/100. `;
  if (data.sales.followUp < 60) {
    salesAdvice += "Inbound inquiries are dropping off due to long follow-up intervals. Implement automated CRM pipelines and instant triggers for incoming leads.";
  } else {
    salesAdvice += "Sales process is structured. Optimize form structures and streamline checkout fields to maximize lead-to-deal closing ratios.";
  }
  document.getElementById('sales-insights-text').textContent = salesAdvice;

  // Section E: Automation Opportunities Table
  const autoTableBody = document.getElementById('automation-table-body');
  autoTableBody.innerHTML = '';
  data.automations.forEach(item => {
    const row = document.createElement('tr');
    const impactClass = item.impact.toLowerCase();
    
    row.innerHTML = `
      <td><strong>${item.task}</strong></td>
      <td><code>${item.tool}</code></td>
      <td><span class="impact-badge ${impactClass}">${item.impact}</span></td>
    `;
    autoTableBody.appendChild(row);
  });

  // Section F: Growth Roadmap
  document.getElementById('roadmap-30-text').textContent = data.roadmap.thirtyDays;
  document.getElementById('roadmap-90-text').textContent = data.roadmap.ninetyDays;
  document.getElementById('roadmap-180-text').textContent = data.roadmap.sixMonths;

  // Init Charts
  initRadarCharts(data);
}

// Helper methods
function populateList(elementId, items) {
  const list = document.getElementById(elementId);
  list.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
}

function animateProgressBar(barId, valId, targetVal) {
  const bar = document.getElementById(barId);
  const val = document.getElementById(valId);
  
  bar.style.width = '0%';
  val.textContent = `0/100`;
  
  setTimeout(() => {
    bar.style.width = `${targetVal}%`;
    val.textContent = `${targetVal}/100`;
  }, 100);
}

// ==========================================================================
// CHART.JS RADAR INITIALIZATION (Purple & Blue theme matching portfolio)
// ==========================================================================
function initRadarCharts(data) {
  const chartColors = chartThemes[appState.theme];

  // Destroy if exist
  if (appState.charts.marketing) appState.charts.marketing.destroy();
  if (appState.charts.sales) appState.charts.sales.destroy();

  // 1. Marketing Chart config (using Purple themes)
  const ctxMkt = document.getElementById('marketingChart').getContext('2d');
  appState.charts.marketing = new Chart(ctxMkt, {
    type: 'radar',
    data: {
      labels: ['Branding', 'Content', 'Lead Gen', 'Social'],
      datasets: [{
        label: 'Efficacy Rating',
        data: [data.marketing.branding, data.marketing.content, data.marketing.leadGen, data.marketing.socialMedia],
        backgroundColor: 'rgba(139, 92, 246, 0.2)', // Purple light
        borderColor: 'rgba(139, 92, 246, 0.95)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointBorderColor: '#fff',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            color: chartColors.text,
            backdropColor: 'transparent'
          },
          grid: { color: chartColors.grid },
          angleLines: { color: chartColors.grid },
          pointLabels: {
            color: chartColors.text,
            font: { family: 'Inter', size: 9, weight: 'bold' }
          }
        }
      }
    }
  });

  // 2. Sales Chart config (using Blue themes)
  const ctxSales = document.getElementById('salesChart').getContext('2d');
  appState.charts.sales = new Chart(ctxSales, {
    type: 'radar',
    data: {
      labels: ['Process', 'Follow-up', 'CRO'],
      datasets: [{
        label: 'Efficacy Rating',
        data: [data.sales.salesProcess, data.sales.followUp, data.sales.conversionOptimization],
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // Blue light
        borderColor: 'rgba(59, 130, 246, 0.95)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            color: chartColors.text,
            backdropColor: 'transparent'
          },
          grid: { color: chartColors.grid },
          angleLines: { color: chartColors.grid },
          pointLabels: {
            color: chartColors.text,
            font: { family: 'Inter', size: 9, weight: 'bold' }
          }
        }
      }
    }
  });
}

// ==========================================================================
// STARTUP DEMO LOADER & EVENTS
// ==========================================================================

// Run evaluation on demo parameters on startup to populate preview
const demoAudit = generateAudit(demoInputs);
appState.currentAudit = demoAudit;
updatePreviewPanel(demoAudit);

// Handle Theme buttons
document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
document.getElementById('dash-theme-toggle').addEventListener('click', toggleTheme);

// Handle Logo link to reset view
document.getElementById('logo-link').addEventListener('click', () => switchView('home'));

// Handle Form submits
auditForm.addEventListener('submit', triggerAuditGeneration);

// Handle "Load Demo Data" auto-fill trigger
document.getElementById('demo-btn').addEventListener('click', () => {
  document.getElementById('biz-name').value = demoInputs.businessName;
  document.getElementById('biz-industry').value = demoInputs.industry;
  document.getElementById('biz-website').value = demoInputs.website;
  document.getElementById('biz-stage').value = demoInputs.stage;
  document.getElementById('biz-teamsize').value = demoInputs.teamSize;
  document.getElementById('biz-challenge').value = demoInputs.challenge;

  // Flash Form feedback
  const formCard = document.querySelector('.showcase-form-card');
  formCard.style.boxShadow = '0 0 25px rgba(139, 92, 246, 0.4)';
  setTimeout(() => {
    formCard.style.boxShadow = 'var(--shadow-glass)';
  }, 400);

  // Trigger preview update
  updatePreviewPanel(demoAudit);
});

// "Open Full Interactive Dashboard" click handler
document.getElementById('prev-view-btn').addEventListener('click', () => {
  renderDashboard(appState.currentAudit);
  switchView('dashboard');
  setupScrollSpy();
});

// Back to Home
document.getElementById('new-audit-btn').addEventListener('click', () => {
  switchView('home');
});

// PDF Print Export
document.getElementById('dash-print-btn').addEventListener('click', () => {
  window.print();
});
