export const portfolio = {
  name: "Aadarsh Singh",
  role: "Software Developer",
  location: "Delhi, India",
  email: "aadarsh.singh2108@gmail.com",
  phone: "+919650595492",
  summary:
    "Software Developer at Blessing Softtech, focused on application security for an AI voice agent platform. Previously 16 months at 0xCommit as a Python & Blockchain intern, building backend modules and auditing Solidity smart contracts. B.Tech IT (2025), with a focus on Python, AI agents and Web3 security.",
  availability: "Python · AI agents · Web3 security",
  socials: [
    { label: "GitHub", url: "https://github.com/crafteraadarsh" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/aadarsh01" },
    { label: "Email", url: "mailto:aadarsh.singh2108@gmail.com" },
    { label: "Phone", url: "tel:+919650595492" }
  ],
  skillGroups: [
    { label: "Languages", items: ["Python", "Solidity", "JavaScript", "SQL", "HTML/CSS"] },
    { label: "Frameworks", items: ["Django", "Flask", "React", "Node.js"] },
    {
      label: "Blockchain & Security",
      items: ["Foundry", "Hardhat", "Remix IDE", "IPFS", "Smart Contract Auditing", "Secure Code Review"]
    },
    { label: "Developer Tools", items: ["Git", "GitHub", "Docker", "Linux", "Linear", "VS Code", "IntelliJ", "Zed"] },
    { label: "AI", items: ["Anthropic Claude SDK", "OpenAI Codex", "GitHub Copilot", "AI Agents", "RAG", "n8n"] },
    { label: "Soft Skills", items: ["Analytical Thinking", "Problem Solving", "Planning", "Collaboration"] },
    { label: "Currently Learning", items: ["LangChain", "LangGraph", "Agentic AI"] }
  ],
  projects: [
    {
      title: "Zoro",
      category: "Personal AI agent",
      stack: ["Python", "Anthropic Claude SDK", "SQLite", "Playwright"],
      links: [],
      points: [
        "Built a framework-free personal AI agent in Python that plans and executes multi-step tasks via chat.",
        "Designed a layered architecture (reasoning, memory, tools, scheduling) on the Claude SDK with SQLite memory.",
        "Sandboxed shell, file and Playwright tools behind user approval, with a real-time chat dashboard."
      ]
    },
    {
      title: "BlockShare",
      category: "Decentralised file sharing",
      stack: ["Blockchain", "IPFS", "Solidity", "React", "Node.js"],
      links: [{ label: "Code", url: "https://github.com/crafteraadarsh/BlockShare" }],
      points: [
        "Built a decentralised file-sharing application on IPFS, removing reliance on a central server.",
        "Developed and deployed Solidity smart contracts for access control and on-chain file integrity checks."
      ]
    },
    {
      title: "VeloRent",
      category: "Bike rental platform",
      stack: ["Python", "Django", "JS", "Docker"],
      links: [{ label: "Code", url: "https://github.com/crafteraadarsh/VeloRent" }],
      points: [
        "Developed a Django bike-rental platform with user authentication, bike listings and rental tracking.",
        "Integrated the Stripe API for secure online payments.",
        "Built an admin dashboard to manage bike availability, rentals and payments."
      ]
    }
  ],
  experience: [
    {
      role: "Software Developer",
      company: "Blessing Softtech",
      location: "Delhi, India (Remote)",
      period: "Oct 2026 – Present",
      points: [
        "Perform security reviews of Fonazo, an AI voice agent platform, identifying vulnerabilities across its codebase.",
        "Document each vulnerability with a severity rating, a reproducible test case and a recommended fix.",
        "Remediate security issues through GitHub pull requests, validated in Dockerised local environments.",
        "Write technical documentation for each security fix and keep docstrings current with every code change."
      ]
    },
    {
      role: "Python & Blockchain Developer Intern",
      company: "0xCommit",
      location: "Dubai, UAE (Remote)",
      period: "Dec 2023 – April 2025",
      points: [
        "Developed object-oriented Python backend modules for an AI platform that audits and tests smart contracts.",
        "Integrated third-party REST APIs and wrote SQL queries for data access; debugged and tested Python services.",
        "Audited Solidity smart contracts for 13+ client companies, identifying logic and security vulnerabilities.",
        "Tested contracts using Foundry and prepared audit reports for each engagement.",
        "Implemented IPFS-based decentralised storage for a file-sharing prototype."
      ]
    }
  ],
  certifications: [
    {
      title: "0xCommit Bootcamp",
      issuer: "0xCommit",
      year: "2023",
      detail: "Certification Number: 02"
    },
    {
      title: "JavaScript Course",
      issuer: "Udemy",
      year: "2023",
      detail: "Certification Number: UC-1e89766b-8604-4365-9ff0-00568a6f54b0",
      url: "https://ude.my/UC-1e89766b-8604-4365-9ff0-00568a6f54b0"
    },
    {
      title: "Research Paper",
      issuer: "IRJMETS",
      year: "2024",
      detail: "DOI: 10.56726/IRJMETS63720",
      url: "https://www.doi.org/10.56726/IRJMETS63720",
      linkLabel: "Read paper"
    }
  ],
  education: [
    {
      degree: "Bachelor of Technology in Information Technology",
      institution: "Guru Gobind Singh Indraprastha University",
      location: "Delhi, India",
      period: "2021 – 2025",
      details: "CGPA: 8.36"
    },
    {
      degree: "Class XII",
      institution: "Apex Public School",
      location: "Delhi, India",
      period: "2021",
      details: "79.33%"
    },
    {
      degree: "Class X",
      institution: "Apex Public School",
      location: "Delhi, India",
      period: "2019",
      details: "74.5%"
    }
  ]
};
