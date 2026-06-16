---
ms.service: azure
ms.author: reburkea
author: reburkea
title: Microsoft Discovery & the Microsoft Discovery app
description: Conceptual overview comparing Microsoft Discovery and the Microsoft Discovery app
ms.topic: concept-article
ms.date: 05/28/2026
---

# Microsoft Discovery & the Microsoft Discovery app

Microsoft Discovery is available in two complementary experiences: the enterprise cloud service (called Microsoft Discovery) and a standalone desktop application (called the Microsoft Discovery app). Both serve the same core purpose of accelerating scientific discovery but differ in deployment, scale, and features.

The Microsoft Discovery platform is a cloud-based, production-grade platform deployed in Azure. It provides enterprise-scale capabilities, robust governance, and multi-user collaboration for mission-critical R&D projects. The Microsoft Discovery app is free to download and provides a local experience, enabling individuals to start using Discovery's core features with just a GitHub Copilot account.

### Single platform strategy
Microsoft Discovery and the Discovery app share core concepts and features such as an agentic framework, the ability to invoke models and tools, a Bookshelf for indexing and reasoning over knowledge, and a Discovery Engine for orchestration. As a lightweight on-ramp to agentic R&D, the Discovery app enables rapid, bottom-up experimentation and exploration, while the Discovery platform enables enterprise-grade scale.

## Positioning at a glance

| Dimension | Microsoft Discovery app | Microsoft Discovery |
|-----------|---------------------|-------------------------|
| **Primary Purpose** | Individuals and scientific community | Production-grade, governed R&D |
| **Deployment Model** | Local | Cloud-based, enterprise deployment |
| **Scale & Performance** | Local compute | Scalable, enterprise-grade compute |
| **Governance & Compliance** | Fixed safeguards, no certifications | Full governance, compliance, and auditability |
| **Support Model** | Community and best effort | Enterprise support with SLAs |

## Why Discovery app?

* **Frictionless on-ramp:** The Microsoft Discovery app is a free, local edition of the Microsoft Discovery platform that lets individual researchers begin AI-driven discovery in minutes—no Azure deployment, no IT provisioning, just a GitHub Copilot account to get started. It removes cloud setup friction so you can focus immediately on experimenting with agents and knowledge.

* **Complementary experiences:** The Discovery app is a complement to the enterprise service. It's designed to serve the scientific and academic community and to support the bottom-up adoption moment—when a scientist, small team, or domain champion needs to prove value quickly before committing to a full enterprise deployment.

* **Seamless graduation path:** Agents and projects created in the app are portable to the cloud. When needs grow—such as requiring private data, larger compute, team collaboration, or enterprise compliance—users can follow a clear path into the governed enterprise environment. The app's design ensures you don't need to discard your work; you can graduate to the enterprise platform smoothly.

* **Enabling core subset of features**: The Discovery app includes the core agentic workflows (like literature reasoning, hypothesis generation, and experimental design) that Discovery is known for. It implements safe-by-default AI controls to avoid unintended access to sensitive data. It also fosters community-first sharing, allowing users to share their projects or findings informally to drive learning and innovation in the broader ecosystem.

The Discovery app exists to remove infrastructure, procurement, and IT barriers so that early adopters can realize value from agentic discovery quickly. Meanwhile, Discovery remains optimized for scale, governance, and compliance rather than first-touch experimentation. This approach protects the enterprise-grade guarantees of the cloud platform while growing an ecosystem of Discovery users and use cases that benefit everyone.

## Detailed comparison

The following table provides a side-by-side comparison of the two experiences:

| Category | Feature | Discovery | Discovery app |
|---|---|---|---|
| **Differences** | Availability | Generally available | In preview |
| | Support & SLA | Fully supported for production use under Microsoft's enterprise support agreements | Community-based support via GitHub |
| | Deployment & setup | Requires an Azure subscription and enterprise cloud resources for setup | Downloadable app for Windows; only requires a GitHub Copilot account for setup (any tier) |
| | IT/Admin experience | Manage cloud resources in Azure Portal. Manage project resources in [Discovery Studio](/azure/microsoft-discovery/concept-studio) | N/A |
| | Architecture | Runs as a cloud service in Azure | Runs locally on your machine |
| | Compute & scale | Scalable Azure compute infrastructure including high performance CPUs, GPUs, and specialized hardware across clusters for large-scale or parallel investigations | Uses your device's compute |
| | Collaboration & users | Built for multi-user collaboration. Share projects, agents, and data within a workspace and work together via the web portal | Single-user—runs on one machine for one user sign-in at a time |
| | Data integration & knowledge sources | Leverages both private and enterprise cloud-based data sources | Leverages local files and public resources; no direct connectivity to enterprise data or network drives |
| | Security & compliance | Meets enterprise security and compliance standards | Runs under your local OS security with fixed safeguards around responsible AI usage limits and data sensitivity |
| | Cost model | Azure consumption costs | Free to download; consumes GitHub Copilot credits |
| | Target use cases | Production-grade R&D with large-scale compute, advanced governance, and formal support | Individual or small-scale exploration focused on personal use and quick starts |
| **Similarities** | User experience | VSCode-based UI for investigations | VSCode-based UI for investigations |
| | Core features | Agentic framework, ability to invoke models and tools, a Bookshelf for indexing and reasoning over knowledge, and a Discovery Engine for orchestration. Key algorithms and APIs are shared. | Agentic framework, ability to invoke models and tools, a Bookshelf for indexing and reasoning over knowledge, and a Discovery Engine for orchestration. Key algorithms and APIs are shared. |

## Graduation path

Microsoft's intent is that the Discovery app and Discovery service form one continuum—a single platform supporting your journey from initial idea to full-scale deployment.

Use the Discovery app for quick-start, individual, and exploratory scenarios:

* **Personal learning and ideation:** If you're new to Microsoft Discovery or want to experiment with agentic AI in R&D, the local app is the fastest way to try it. With just a download and a GitHub account, you can spin up your first agent and see how the platform works.

* **Academic and community research:** As a student or academic researcher, you might not have immediate access to an enterprise Azure environment. The app lets you run Discovery on your personal device for coursework or exploratory research, using publicly available data and compute you already have.

* **Proof-of-concept development:** If you're a scientist or developer aiming to prototype a use-case (to get buy-in or test feasibility), the Discovery app allows quick iteration and testing. You can later transition to the enterprise platform once you've proved value and need to scale up or integrate with company resources.

### When to graduate

You should consider moving to the enterprise platform when you hit limitations in the app, for example:

* **Collaboration:** You have multiple team members who need to work together on investigations, or you require robust access control, team sharing, and alignment with organizational IT policies.

* **Compute:** You have investigations that require heavy computation, such as extensive simulations, analyzing millions of data points, or reasoning over large amounts of knowledge. You require Azure's HPC and GPU resources for computations that your local machine can't handle.

* **Compliance:** You need to use sensitive or proprietary data in your Discovery workflow. You need to ensure data stays within your Azure tenancy and compliance boundaries or you operate in a regulated environment (healthcare, finance, etc.) and need security features and auditing.

### Key points about moving from the app to the enterprise cloud

* **Common platform architecture and APIs:** The Discovery app and cloud service are built on a common foundation and concepts. Under the hood, they use the same Discovery Engine and core APIs. This common foundation ensures that an agent or workflow defined in the app is fundamentally compatible with the enterprise environment.

* **Portable agents and knowledge:** Agents and skills created in the app are portable to Discovery on Azure. While there isn't an automated migration tool yet, you can reuse agent definitions, prompts, and even local knowledge base content by importing them into the enterprise environment. This means anything you start building in the app can be carried forward; you won't need to redo work from scratch.

* **Minimal learning curve:** The two experiences share the same UX and core concepts. This familiarity ensures a confident step up without a steep learning curve.

In many cases, an individual or team will start with the Discovery app and then graduate to the enterprise service as their needs expand. This gradual path allows innovation to begin immediately and then scale without switching to a different tool or rewriting solutions.

## Key takeaways

* **Discovery app accelerates innovation velocity without increasing enterprise risk.** It allows rapid experimentation and broader adoption of Discovery by making it accessible locally, but it's intentionally scoped to protect enterprise interests.

* **Discovery app expands Microsoft Discovery's access and ecosystem.** By reaching individual researchers and the community, it grows the base of users and ideas, ultimately enriching the platform's value for all.

* **This dual-model strategy aligns speed of innovation with enterprise trust.** The local app and cloud service work in tandem: one maximizes agility and speed, the other ensures trust, scale, and governance. Together, they meet users where they are and guide them from idea to impact.

## Next steps

* **Get started with the Microsoft Discovery platform:** Contact your Microsoft account representative. 

* **Get started with the Microsoft Discovery app:** Download the app and review documentation on [GitHub](https://github.com/microsoft/discovery). Ensure you have a GitHub Copilot account (or a compatible license) before launching the app.

You can begin your journey with whichever experience fits your current needs, knowing that both are part of the same Microsoft Discovery family. As your projects advance, you can seamlessly move from local exploration to enterprise-grade deployments, applying the strengths of each to accelerate your R&D.
