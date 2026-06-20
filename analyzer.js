/**
 * FounderLens AI Recommendation Heuristics Engine
 * Analyzes business data and generates dynamic, customized audits.
 */

const INDUSTRIES = {
  saas: {
    name: "SaaS / Software",
    targetAudience: "Tech-savvy professionals, enterprise buyers, or niche businesses seeking software-as-a-service solutions.",
    uvpBase: "Streamline operations and eliminate manual friction through automated, scalable cloud software.",
    strengths: [
      "High gross margins (typically 80%+) and predictable recurring revenue (MRR/ARR).",
      "Global scalability with near-zero marginal cost of distribution.",
      "Rich user-behavior data allowing rapid product iteration and feedback loops."
    ],
    weaknesses: [
      "High initial customer acquisition cost (CAC) and long payback periods.",
      "Churn risk and susceptibility to platform-dependency (e.g., API closures).",
      "High reliance on scarce and expensive technical/developer talent."
    ],
    opportunities: [
      "Implement a Product-Led Growth (PLG) self-serve funnel to lower CAC.",
      "Introduce usage-based or tiered add-on pricing to drive expansion revenue.",
      "Build integration partnerships with complementary tools to expand market reach."
    ],
    threats: [
      "Low barriers to entry for basic clones, leading to aggressive price competition.",
      "Rapidly changing technological standards rendering codebase obsolete.",
      "Security vulnerabilities or data breaches damaging customer trust."
    ],
    branding: 85, content: 80, leadGen: 75, socialMedia: 65,
    salesProcess: 70, followUp: 65, conversionOptimization: 60,
    automation: [
      { task: "User onboarding notifications", tool: "Customer.io / Intercom", impact: "High" },
      { task: "Subscription billing & failed payments recovery", tool: "Stripe Billing / Churnbuster", impact: "Critical" },
      { task: "Product usage tracking & alerts", tool: "Mixpanel / Segment", impact: "Medium" }
    ]
  },
  ecommerce: {
    name: "E-Commerce & Retail",
    targetAudience: "Digital-first consumers looking for convenience, premium quality, or specialized lifestyle/consumer products.",
    uvpBase: "Premium direct-to-consumer products delivered straight to your door with a seamless checkout experience.",
    strengths: [
      "Direct-to-consumer relationship enabling rich customer lifecycle ownership.",
      "High agility to test new product SKUs and promotional offers rapidly.",
      "Diverse marketing channels including influencer partnerships and social commerce."
    ],
    weaknesses: [
      "Physical inventory capital lockup and supply chain vulnerability.",
      "Thin operating margins squeezed by shipping, returns, and digital ad costs.",
      "Low customer switching barriers and high brand infidelity."
    ],
    opportunities: [
      "Deploy personalized SMS & Email post-purchase flows to increase repeat purchase rate.",
      "Transition to a subscription box or replenishment model for recurring revenue.",
      "Integrate social-commerce channels (Instagram Shopping, TikTok Shop) for friction-free sales."
    ],
    threats: [
      "Volatile advertising ad-network costs (rising CPMs on Meta/Google).",
      "Supply chain disruptions or shipping rate hikes eating margin.",
      "Aggressive marketplace aggregators (like Amazon) copying hot products."
    ],
    branding: 80, content: 70, leadGen: 65, socialMedia: 85,
    salesProcess: 60, followUp: 55, conversionOptimization: 70,
    automation: [
      { task: "Abandoned cart email and SMS recovery sequences", tool: "Klaviyo / Postscript", impact: "Critical" },
      { task: "Inventory replenishment alerts", tool: "Inventory Planner / Katana", impact: "High" },
      { task: "Customer support for common shipping FAQs", tool: "Gorgias / Zendesk chatbot", impact: "High" }
    ]
  },
  agency: {
    name: "Agency & Professional Services",
    targetAudience: "Businesses (B2B) seeking specialized talent, strategic advisory, or outsourced execution to scale operations.",
    uvpBase: "High-impact, white-glove professional services that solve complex business bottlenecks.",
    strengths: [
      "Low startup capital requirements; immediate revenue potential from client contracts.",
      "Deep, trust-based client relationships with high potential for long-term contract value.",
      "High strategic agility to pivot service offerings based on immediate market demand."
    ],
    weaknesses: [
      "Difficult to scale without linearly increasing payroll and headcount.",
      "Lumpy revenue cycles ('feast or famine') due to inconsistent sales pipelines.",
      "High vulnerability to founder burnout and client concentration risk (one client representing 30%+ of revenue)."
    ],
    opportunities: [
      "Productize services into fixed-price, scoped packages to simplify sales and delivery.",
      "Build a structured inbound authority engine (content, webinars, whitepapers).",
      "Introduce performance-based pricing or equity upsides for high-growth client projects."
    ],
    threats: [
      "Commoditization of services by AI tools and cheap freelance marketplaces.",
      "Talent attrition (key employees leaving to start competing agencies).",
      "Economic downturns leading to clients cutting external service budgets first."
    ],
    branding: 70, content: 75, leadGen: 60, socialMedia: 60,
    salesProcess: 75, followUp: 70, conversionOptimization: 55,
    automation: [
      { task: "Client proposal generation & digital signing", tool: "PandaDoc / Better Proposals", impact: "High" },
      { task: "Project intake and onboarding task creation", tool: "Zapier + ClickUp / Asana", impact: "High" },
      { task: "Time tracking and automated invoicing", tool: "Harvest / Toggl + QuickBooks", impact: "Medium" }
    ]
  },
  local: {
    name: "Local Business & Hospitality",
    targetAudience: "Residents, local travelers, and community members looking for reliable offline services or hospitality experiences.",
    uvpBase: "Trusted, high-quality local services that prioritize customer safety, convenience, and community pride.",
    strengths: [
      "Strong community presence and high referral rates from word-of-mouth.",
      "Lower vulnerability to global software competition due to physical service delivery.",
      "High local search intent and direct relationship with physical customers."
    ],
    weaknesses: [
      "Geographically limited market size.",
      "High overhead costs (physical lease, utilities, staff, equipment).",
      "Difficult to scale beyond the local region without substantial franchise capital."
    ],
    opportunities: [
      "Optimize Google Maps & Local SEO presence to dominate localized searches.",
      "Implement a loyalty program to incentivize repeat local visits.",
      "Partner with other local businesses to run cross-promotional campaigns."
    ],
    threats: [
      "Local economic downturns affecting immediate household spending.",
      "Sudden increases in physical rent prices or localized supply costs.",
      "Negative online reviews (Yelp, Google) disproportionately impacting brand reputation."
    ],
    branding: 65, content: 50, leadGen: 55, socialMedia: 70,
    salesProcess: 65, followUp: 45, conversionOptimization: 50,
    automation: [
      { task: "Online booking & appointment scheduling", tool: "Calendly / Acuity / Resy", impact: "Critical" },
      { task: "Automated review request follow-up after service", tool: "Podium / Birdeye", impact: "High" },
      { task: "Local staff scheduling and shift management", tool: "7shifts / Deputy", impact: "Medium" }
    ]
  },
  fintech: {
    name: "FinTech & Financial Services",
    targetAudience: "Retail consumers, investors, or corporate finance teams seeking modern, secure, and efficient financial tools.",
    uvpBase: "Secure, compliant, and lightning-fast financial tooling that simplifies transaction workflows and asset management.",
    strengths: [
      "High transaction volumes and monetization options (interchange, interest, SaaS fees).",
      "Stuck customer base due to high switching costs once bank accounts/processors are linked.",
      "Massive addressable market in legacy financial sectors ripe for disruption."
    ],
    weaknesses: [
      "Extremely complex regulatory compliance, licensing, and security requirements.",
      "High fraud/chargeback liabilities and security breach risks.",
      "Long partnership negotiations with traditional banking and credit rails."
    ],
    opportunities: [
      "Incorporate AI-powered financial advisory or automated budget categorization.",
      "Partner with developers via open APIs to build an embedded finance ecosystem.",
      "Launch specialized cross-border payment corridors for underserved global markets."
    ],
    threats: [
      "Sudden, restrictive regulatory shifts or compliance audit failures.",
      "Systemic financial market crises or rising interest rates impacting capital cost.",
      "Targeted cyberattacks undermining the security posture of the platform."
    ],
    branding: 80, content: 75, leadGen: 70, socialMedia: 55,
    salesProcess: 80, followUp: 75, conversionOptimization: 65,
    automation: [
      { task: "Know-Your-Customer (KYC) user onboarding verification", tool: "Persona / Sumsub", impact: "Critical" },
      { task: "Real-time ledger audit and compliance reports", tool: "Modern Treasury / Anzen", impact: "High" },
      { task: "Fraud and risk flag notifications", tool: "Sift / Unit21", impact: "Critical" }
    ]
  },
  healthcare: {
    name: "Healthcare & Biotech",
    targetAudience: "Patients, medical providers, health systems, or research institutions seeking clinical efficiency or wellness outcomes.",
    uvpBase: "Compliant, evidence-based health solutions that optimize patient outcomes and reduce clinical admin load.",
    strengths: [
      "Inelastic demand for health and wellness products/services.",
      "High product stickiness and defensibility backed by intellectual property/clinical proof.",
      "Substantial B2B contracts with hospital networks or insurance providers."
    ],
    weaknesses: [
      "Extremely long sales cycles and intense scientific validation timelines.",
      "Strict data privacy standards (HIPAA, GDPR) and liability exposures.",
      "High dependency on medical certifications and expert credentialing."
    ],
    opportunities: [
      "Deploy telehealth virtual consultations to expand patient intake.",
      "Utilize remote patient monitoring (RPM) and IoT wearable integrations.",
      "Optimize insurance billing and medical coding through automated claims processing."
    ],
    threats: [
      "Malpractice liabilities and medical regulatory setbacks (FDA approvals).",
      "Changes in government reimbursement rates or health insurance regulations.",
      "Data breaches exposing sensitive patient health information (PHI)."
    ],
    branding: 75, content: 70, leadGen: 60, socialMedia: 50,
    salesProcess: 70, followUp: 60, conversionOptimization: 55,
    automation: [
      { task: "Patient intake paperwork & HIPAA consent collection", tool: "Formstack / Jotform HIPAA", impact: "High" },
      { task: "Appointment reminders & telehealth link distribution", tool: "Twilio / Spruce Health", impact: "Critical" },
      { task: "Insurance eligibility verification", tool: "Eligibility API / Eligible", impact: "High" }
    ]
  },
  general: {
    name: "General / Other",
    targetAudience: "Modern buyers, corporate teams, or specific market segments seeking quality, reliability, and value.",
    uvpBase: "High-quality, reliable business solutions engineered to solve specific operational challenges.",
    strengths: [
      "Agile operating model with low structural overhead.",
      "Diverse customer base mitigating industry-specific market downturns.",
      "High adaptability to capture emerging niche market trends."
    ],
    weaknesses: [
      "Lack of deep domain specialization, making positioning difficult.",
      "Broad target market diluting marketing messaging efficacy.",
      "Squeezed margins if operating in a highly commoditized market space."
    ],
    opportunities: [
      "Carve out a specific high-value niche to command premium pricing.",
      "Leverage automation to build a highly optimized, lean operating team.",
      "Develop digital assets (educational guides, templates) to drive organic leads."
    ],
    threats: [
      "Increased ad costs across general bidding keywords.",
      "Loss of competitive edge to highly specialized vertical competitors.",
      "Macroeconomic contractions lowering overall corporate and consumer spend."
    ],
    branding: 70, content: 65, leadGen: 65, socialMedia: 65,
    salesProcess: 70, followUp: 65, conversionOptimization: 60,
    automation: [
      { task: "Inbound lead sorting and CRM database update", tool: "Zapier + HubSpot CRM", impact: "High" },
      { task: "Standard operations SOP distribution for new hires", tool: "Loom / Trainual", impact: "Medium" },
      { task: "Weekly metrics reports compiling", tool: "Fivetran / Looker Studio", impact: "Medium" }
    ]
  }
};

const STAGES = {
  startup: {
    label: "Startup / Early Stage",
    description: "Focus is on achieving product-market fit, securing initial clients, and establishing proof of concept.",
    marketingModifier: -10,
    salesModifier: -8,
    roadmap: {
      "30": "Launch a Minimum Viable Product (MVP) or beta program. Secure the first 5-10 pilot customers by conducting 20 direct outbound cold outreach sequences weekly.",
      "90": "Implement a basic analytic setup. Gather user feedback to optimize the product. Launch a content landing page targeting high-intent long-tail keywords.",
      "180": "Refine the Unique Value Proposition. Invest in a structured, repeatable lead-acquisition channel (e.g. content marketing or targeted cold-email outreach)."
    }
  },
  growing: {
    label: "Growing / Scaling Stage",
    description: "Consistent revenue generated. The focus is scaling lead generation, professionalizing sales processes, and expanding operations.",
    marketingModifier: 5,
    salesModifier: 5,
    roadmap: {
      "30": "Map and document the current sales funnel. Identify the primary drop-off point and implement standard lead follow-up automation rules (within 15 minutes of signup).",
      "90": "Build out a dedicated content calendar and scale paid search or paid social acquisition channels. Implement basic CRM automation templates for sales pipelines.",
      "180": "Hire specialized team members (e.g., SDR, content manager). Expand product lines or premium service tiers to maximize customer lifetime value (LTV)."
    }
  },
  established: {
    label: "Established / Mature Stage",
    description: "Stable operations and mature products. The focus is driving efficiency, system automation, and finding new organic growth channels.",
    marketingModifier: 15,
    salesModifier: 12,
    roadmap: {
      "30": "Conduct a comprehensive audit of recurring SaaS tools and operational costs. Eliminate redundancies and map manual data entries for automation integration.",
      "90": "Build and launch a customer referral/ambassador program. Optimize conversion rates (CRO) on high-traffic landing pages through structured A/B testing.",
      "180": "Explore strategic expansion (corporate acquisitions, partnerships, or vertical integrations). Automate standard employee onboarding and client handoffs entirely."
    }
  }
};

const CHALLENGES = {
  acquisition: {
    label: "Customer Acquisition",
    swotOpportunity: "Build a highly optimized inbound engine leveraging organic content authority, partnerships, or referral loops.",
    swotThreat: "Over-dependency on a single paid channel, exposing the business to advertising price surges.",
    marketingModifier: -15,
    salesModifier: 0,
    recommendations: {
      marketing: "Your biggest bottleneck is finding leads. You need to immediately diversify your channels. Don't rely solely on organic social media. Launch a highly targeted cold-outreach campaign or test search ads targeting competitors' brand terms.",
      sales: "Ensure your sales process is optimized to handle incoming leads. Set up automated calendar booking to reduce scheduling friction.",
      timeline: "Focus the next 30 days entirely on outbound pipeline growth and landing page clarity."
    }
  },
  scaling: {
    label: "Scaling Operations",
    swotOpportunity: "Leverage modern integration platforms (Zapier/Make) to link disconnected database systems and automate repetitive tasks.",
    swotThreat: "Key-person dependency; if the founder or a key manager exits, operations will face severe disruption.",
    marketingModifier: 0,
    salesModifier: -5,
    recommendations: {
      marketing: "Marketing is functional, but scaling requires clean messaging. Focus on building case studies and customer success stories that can sell passively.",
      sales: "Create standard operating procedures (SOPs) for the sales team. Automate proposal drafting, contract generation, and customer onboarding triggers.",
      timeline: "Standardize client onboarding and build out internal documentation systems in the next 30 days."
    }
  },
  conversion: {
    label: "Low Conversion Rate",
    swotOpportunity: "Run quantitative screen-recording audits (e.g. Hotjar) and simplify checkout form fields to unlock immediate revenue.",
    swotThreat: "Poor site performance or checkout friction driving customers to competitors with cleaner user experiences.",
    marketingModifier: 5,
    salesModifier: -15,
    recommendations: {
      marketing: "You are successfully driving traffic, but the messaging might be misaligned. Ensure your traffic sources match the expectations set on your landing page.",
      sales: "Your checkout or sales pipeline is leaking value. Implement exit-intent popups, add visual social proof (reviews, security badges), and launch automated 'cart abandonment' recovery campaigns.",
      timeline: "Conduct user testing on the checkout flow and deploy conversion tools within the first 30 days."
    }
  },
  cashflow: {
    label: "Cash Flow & Funding",
    swotOpportunity: "Negotiate payment terms with suppliers or shift to upfront annual pricing tiers to improve cash conversion cycles.",
    swotThreat: "Running out of runway due to high accounts receivable delays or excessive fixed overhead expenses.",
    marketingModifier: -5,
    salesModifier: -5,
    recommendations: {
      marketing: "Focus exclusively on short-term high-margin campaigns. Cut loose low-yield experimental marketing budgets immediately.",
      sales: "Shift payment collection up-front. Create incentives (discounts or bonuses) for clients who pay annually in advance rather than monthly.",
      timeline: "Renegotiate vendor contracts and introduce prepay options to secure capital reserves."
    }
  },
  pmf: {
    label: "Product-Market Fit",
    swotOpportunity: "Conduct customer interviews with high-activation users. Strip out low-value features and double-down on the core utility.",
    swotThreat: "High customer churn rates leading to a 'leaky bucket' syndrome where marketing costs cannot be recouped.",
    marketingModifier: -10,
    salesModifier: -10,
    recommendations: {
      marketing: "Pause broad-scale paid marketing campaigns. Scale back budget and focus on intimate, organic group building or direct customer research.",
      sales: "Treat sales as qualitative discovery calls. Probe deeply on what features clients utilize most, and why some decide to cancel. Use this data to iterate the product.",
      timeline: "Run an NPS (Net Promoter Score) survey and talk directly to your 10 most active users in the next 30 days."
    }
  }
};

/**
 * Generates the full business audit report.
 * @param {Object} input 
 * @returns {Object} Audit Report
 */
function generateAudit(input) {
  const { businessName, industry, website, stage, teamSize, challenge } = input;
  
  // Retrieve configuration templates or fallback
  const indConfig = INDUSTRIES[industry] || INDUSTRIES.general;
  const stageConfig = STAGES[stage] || STAGES.growing;
  const chalConfig = CHALLENGES[challenge] || CHALLENGES.acquisition;

  // Calculate scores with modifiers
  let brandingScore = indConfig.branding + stageConfig.marketingModifier + chalConfig.marketingModifier;
  let contentScore = indConfig.content + stageConfig.marketingModifier + chalConfig.marketingModifier;
  let leadGenScore = indConfig.leadGen + stageConfig.marketingModifier + chalConfig.marketingModifier;
  let socialMediaScore = indConfig.socialMedia + stageConfig.marketingModifier + chalConfig.marketingModifier;

  let salesProcessScore = indConfig.salesProcess + stageConfig.salesModifier + chalConfig.salesModifier;
  let followUpScore = indConfig.followUp + stageConfig.salesModifier + chalConfig.salesModifier;
  let convOptScore = indConfig.conversionOptimization + stageConfig.salesModifier + chalConfig.salesModifier;

  // Clamp scores between 25 and 98 to keep it realistic and professional
  const clamp = (val) => Math.min(98, Math.max(25, val));
  brandingScore = clamp(brandingScore);
  contentScore = clamp(contentScore);
  leadGenScore = clamp(leadGenScore);
  socialMediaScore = clamp(socialMediaScore);
  
  salesProcessScore = clamp(salesProcessScore);
  followUpScore = clamp(followUpScore);
  convOptScore = clamp(convOptScore);

  // Marketing and Sales Overall Scores
  const marketingOverall = Math.round((brandingScore + contentScore + leadGenScore + socialMediaScore) / 4);
  const salesOverall = Math.round((salesProcessScore + followUpScore + convOptScore) / 4);

  // Global Health Score
  const healthScore = Math.round((marketingOverall + salesOverall) / 2);

  // Dynamic UVP and Audience custom generation
  const targetAudience = indConfig.targetAudience;
  const cleanWebsite = website.replace(/^(https?:\/\/)?(www\.)?/, '').toLowerCase();
  
  const uvp = `${indConfig.uvpBase} Tailored specifically to solve key ${chalConfig.label.toLowerCase()} bottlenecks, providing a distinct competitive edge.`;
  
  const summary = `${businessName} is a ${stageConfig.label.toLowerCase()} venture operating in the ${indConfig.name} sector. Currently, the company runs with a team of ${teamSize} and is actively working to resolve its biggest operational barrier: ${chalConfig.label}. By addressing this challenge, ${businessName} has the potential to streamline operations and significantly scale customer value.`;

  // SWOT Analysis Construction
  const strengths = [...indConfig.strengths];
  const weaknesses = [...indConfig.weaknesses];
  
  // Add customized items based on challenge
  const opportunities = [
    ...indConfig.opportunities,
    chalConfig.swotOpportunity
  ];
  const threats = [
    ...indConfig.threats,
    chalConfig.swotThreat
  ];

  // Modify SWOT based on stage and team size
  if (parseInt(teamSize) <= 3) {
    weaknesses.push("Severe bandwidth constraint: operations are heavily founder-dependent.");
    opportunities.push("Outsource non-core execution to flexible freelancers or agencies.");
  } else {
    strengths.push(`Multidisciplinary team structure (${teamSize} members) allowing execution delegation.`);
    weaknesses.push("Coordination and communication overhead scaling with team size.");
  }

  if (stage === 'startup') {
    weaknesses.push("Lack of historical customer data and verified brand equity.");
  } else if (stage === 'established') {
    strengths.push("Established brand identity and stable customer acquisition history.");
    threats.push("Legacy process inertia limiting agility to adopt rapid modern tech shifts.");
  }

  // Growth Roadmap Construction
  const roadmap30 = `${chalConfig.recommendations.timeline} ${stageConfig.roadmap["30"]}`;
  const roadmap90 = `${chalConfig.recommendations.marketing} ${stageConfig.roadmap["90"]}`;
  const roadmap180 = `${chalConfig.recommendations.sales} ${stageConfig.roadmap["180"]}`;

  // Automation Opportunities (Merge industry list and add one based on challenge)
  const automations = [...indConfig.automation];
  if (challenge === 'acquisition') {
    automations.unshift({ task: "Automated cold outbound sequence triggers", tool: "Instantly.ai / Apollo", impact: "High" });
  } else if (challenge === 'conversion') {
    automations.unshift({ task: "Exit-intent lead magnet delivery", tool: "OptinMonster / Popups", impact: "High" });
  } else if (challenge === 'scaling') {
    automations.unshift({ task: "Automated standard team onboarding flow", tool: "Loom / Notion API", impact: "Medium" });
  }

  return {
    businessName,
    website: cleanWebsite,
    industryName: indConfig.name,
    stageLabel: stageConfig.label,
    challengeLabel: chalConfig.label,
    teamSize,
    healthScore,
    summary,
    targetAudience,
    uvp,
    swot: {
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      opportunities: opportunities.slice(0, 3),
      threats: threats.slice(0, 3)
    },
    marketing: {
      score: marketingOverall,
      branding: brandingScore,
      content: contentScore,
      leadGen: leadGenScore,
      socialMedia: socialMediaScore
    },
    sales: {
      score: salesOverall,
      salesProcess: salesProcessScore,
      followUp: followUpScore,
      conversionOptimization: convOptScore
    },
    automations,
    roadmap: {
      thirtyDays: roadmap30,
      ninetyDays: roadmap90,
      sixMonths: roadmap180
    }
  };
}
