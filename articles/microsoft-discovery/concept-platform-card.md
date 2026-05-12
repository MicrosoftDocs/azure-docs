---
title: Platform card for Microsoft Discovery
description: Learn about Microsoft Discovery's intended uses, capabilities, limitations, evaluations, safety components, and best practices for responsible deployment and use.
author: ffrachon
ms.author: fabricfr
ms.service: azure
ms.topic: concept-article
ms.date: 04/21/2026

#CustomerIntent: As a researcher or deployer, I want to understand Microsoft Discovery's intended purpose, capabilities, and limitations so that I can make informed decisions about adoption and use.
---

# Platform card: Microsoft Discovery

This platform card describes Microsoft Discovery's intended uses, capabilities, limitations, and best practices for responsible deployment and use.

## What is an application or platform card?

Microsoft's Application and Platform cards are intended to help you understand how our AI technology works, the choices application owners can make that influence application performance and behavior, and the importance of considering the whole application, including the technology, the people, and the environment. Application cards are created for AI applications and platform cards are created for AI platform services. These resources can support the development or deployment of your own applications and can be shared with users or stakeholders impacted by them.

As part of its commitment to responsible AI, Microsoft adheres to six core principles: fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability. These principles are embedded in the Responsible AI Standard, which guides teams in designing, building, and testing AI applications. Application and Platform Cards play a key role in operationalizing these principles by offering transparency around capabilities, intended uses, and limitations. For further insight, readers are encouraged to explore Microsoft's Responsible AI Transparency Report and Code of Conduct, which outline how enterprise customers and individuals can engage with AI responsibly.

## Overview

Microsoft Discovery is in Public Preview and is currently available to select customers. Use of Microsoft Discovery is subject to customer eligibility requirements and acceptance of our Product Terms and User Code of Conduct. It requires a license and is only offered in a limited number of countries. Our goal is to ensure the system remains safe, reliable, and beneficial for all users as we continue to evolve its capabilities.

### Introduction

Microsoft Discovery is an enterprise "agentic AI" platform designed to support scientific research and development. It helps organizations bring together domain knowledge, data, models, and computation to reason through complex problems, generate and refine hypotheses, design experiments, and analyze results. By supporting the scientific method end‑to‑end in a single environment, Microsoft Discovery addresses the fragmentation and cognitive overhead that often slow modern R&D efforts.

The platform uses an agentic AI architecture leveraging a graph‑based knowledge engine to drive R&D outcomes with enhanced speed, scale, and accuracy. Through a natural-language interface, users can describe objectives or questions, and the system can translate them into structured plans that draw on available tools, models, and workflows. Microsoft Discovery operationalizes the Discovery Engine which incorporates outcomes and feedback into subsequent reasoning, enabling adaptive, explainable, and repeatable research execution while keeping the user in control.

### Intended users

Microsoft Discovery is intended for R&D organizations including scientists, engineers, and developers in industries spanning life sciences, materials, semiconductors, energy, manufacturing, and advanced engineering. Built on Azure, the platform is designed to be extensible and secure, allowing organizations to integrate their own data, models, and tools into a unified AI‑driven environment. Rather than replacing human expertise, Microsoft Discovery augments it, helping teams manage complexity and scale insight across the research process.

## Key terms

The following table provides a glossary of key terms related to Microsoft Discovery.

| Term | Definition |
|---|---|
| Classifiers | Machine learning models that sort data into labeled classes or categories of information. |
| Discovery Engine | Microsoft Discovery Engine is a feature within Discovery that acts and behaves like a colleague you can converse with, delegate to, cooperatively plan with, and hand off tasks when working on ambitious long-duration work. The Discovery Engine is organized and driven by the purpose of the work you want to accomplish, using the rest of Discovery as resources to accomplish it. |
| Grounding | Responses that are anchored in relevant, reliable sources, including customer‑provided data, internal knowledge bases, and external content where applicable, and that provide citations or traceability when available. |
| Large Language Models (LLMs) | LLMs are AI models trained on large amounts of text data to predict words in sequences. They can perform tasks such as text generation, summarization, translation, and classification. |
| Mitigation | Methods designed to reduce potential risks that may arise from using AI features. |
| Prompts | Inputs in the form of text, images, and/or audio that a user provides to interact with AI features. |
| Supercomputer | The Supercomputer component of Microsoft Discovery uses Azure high‑performance computing (HPC), and future quantum capabilities, to execute compute‑intensive scientific workflows, simulations, and AI workloads. |
| System Message | The system message (sometimes referred to as a "meta prompt") guides the system's behavior, aligning it with Microsoft AI Principles and user expectations. For example, it may include instructions like "do not provide information or create content that could cause physical, emotional, or financial harm." |

## Key features and capabilities

The key features and capabilities outlined here describe what Microsoft Discovery is designed to do and how it performs across supported tasks.

### Natural-language interface

Users interact with Microsoft Discovery through a conversational assistant that understands requests in natural language and translates them into a structured plan using available tools and workflows. This helps scientists and engineers move from a research question to an actionable workflow without manually stitching together multiple systems. When needed, this Copilot can invoke integrated compute and tools (for example, simulations, database queries, or model runs) and supports iterative refinement through dialogue. This lowers the barrier to using advanced R&D tools by letting users adjust and explore workflows step‑by‑step in the same interface.

### Multi-agent architecture

Discovery uses a multi-agent system, where end-users can bring in specialized AI agents, each adept in a certain domain (chemistry, biology, physics, silicon design, data analysis, and so on) or function (reasoning, simulation, optimization). These agents work together, coordinated by Copilot and a central knowledge graph. They can reason over a rich, connected knowledge base that integrates all the enterprise's data sources and scientific knowledge. This architecture allows tackling very complex, cross-disciplinary problems. For example, one agent might parse scientific literature while another runs a simulation and another analyses the results – all orchestrated in concert. (This distributed intelligence is what we mean by "agentic AI" – it's not one monolithic model, but a team of models working together for the user.)

### Discovery Engine

The Discovery Engine is a core capability within Microsoft Discovery that enables sustained, goal‑oriented research and problem solving over extended periods of time. Rather than focusing on short, transactional interactions, the Discovery Engine supports long‑running work by coordinating reasoning, planning, and execution across agents, tools, models, and knowledge sources. It is designed for complex research scenarios that require decomposition of high‑level objectives, iterative exploration, and integration of results across multiple activities.

The Discovery Engine operates through two complementary components: cognition and tasks. Cognition manages the ongoing reasoning and coordination required to make progress toward defined objectives, selecting appropriate agents, tools, and data sources and adapting execution based on intermediate results and user feedback. The tasks system captures user intent, structure, and progress, providing a persistent representation of what needs to be accomplished, how success is measured, and how work evolves over time. Together, these components enable users to delegate work, review progress periodically, and refine direction as needed, while maintaining human oversight and control throughout the research process.

In support of long‑running and iterative research, the Discovery Engine maintains contextual continuity across interactions by preserving relevant state from prior work, including objectives, intermediate results, decisions, and user guidance. This persistent context enables the system to resume work across sessions without requiring users to restate goals or reconstruct prior steps. By carrying forward what has already been explored or decided, the Discovery Engine supports incremental progress, adaptive planning, and more coherent execution over time, while keeping users in control through review, refinement, and oversight at each stage.

### Extensibility

Discovery is designed to be extensible, enabling customers to bring their own models (BYOM), integrate proprietary or third‑party data via platforms such as AI Foundry or Azure Machine Learning (AML), and build custom agents tailored to domain needs. Plug in your in-house models, your existing lab data, domain-specific databases, or even custom-developed AI agents. Discovery will incorporate those assets into the knowledge graph and workflows. Moreover, Discovery supports partner and open-source tools as well, and it's built on Azure so it inherits Azure's security, compliance, and governance capabilities.

### HPC integration

Discovery is built on Azure's cutting-edge infrastructure, meaning it natively integrates Azure High-Performance Computing (HPC) and AI services. The platform can deploy workloads to large-scale CPU/GPU clusters, run cloud-based simulations (CFD, molecular dynamics, and so on), and use advanced AI models (including custom physics ML models or large language models) as needed.

### Knowledge reasoning

Microsoft Discovery delivers advanced knowledge reasoning by combining curated domain grounding with graph‑enhanced, AI‑driven retrieval and synthesis. At the foundation, Discovery offers a bookshelf service that allows researchers to organize and ground their work in curated collections of scientific literature, papers, and reference materials tailored to their domain. This ensures that reasoning and analysis are anchored in trusted, relevant sources from the start.

Building on this, Discovery natively integrates Azure AI Search through the Foundry service, enabling fast retrieval across internal repositories, external literature, and connected databases. Users can seamlessly search across diverse knowledge sources without manual stitching or context switching.

What differentiates Microsoft Discovery is how it reasons over diverse knowledge sources. Discovery goes beyond traditional semantic search by uncovering both local insights, such as specific facts, entities, and findings, and global understanding, including themes, patterns, and implications across an entire corpus. It dynamically combines vector-based retrieval with graph-oriented reasoning at query time, avoiding costly upfront summarization while scaling efficiently without sacrificing answer quality. Together, these capabilities allow Discovery to connect, contextualize, and synthesize knowledge across large and continuously evolving scientific datasets, enabling deeper reasoning, faster insight generation, and more informed scientific exploration.

**Grounded Citations**

When responses are grounded in web or customer data, Microsoft Discovery might provide hyperlinked citations so users can access the referenced websites or internal documents/databases used for grounding and learn more about the topic.

## Intended uses

Microsoft Discovery can be used in multiple scenarios across a variety of industries. Some examples of use cases include:

| Industry/Domain | Scenario | User Benefits |
|---|---|---|
| Chemicals & Materials Science | Companies developing new materials, chemicals, or formulations (for example, advanced alloys, polymers, semiconductor materials, battery chemistry, renewable energy, sustainable tech) that want to speed up research. | Users can rapidly generate and test hypotheses to refine formulations using AI-coordinated workflows. Discovery allows researchers to simulate material properties, complex chemical reactions, and physical processes, evaluating performance trade-offs to identify optimal configurations. Discovery helps reduce the time and cost of experimentation by automating tool orchestration, surfacing relevant literature, and enabling iterative design cycles. All while maintaining traceability and reproducibility. |
| Pharmaceuticals & Life Sciences | Pharma and biotech teams working on drug discovery, genomics, or biomedical research with complex pipelines and massive datasets. | Discovery can help researchers synthesize biomedical literature, identify promising drug candidates, and design experiments using predictive models. By automating early-stage screening and hypothesis generation, users can focus on decision-making and validation, potentially accelerating discovery timelines and uncovering novel insights from cross-domain data. |
| Semiconductor & Electronics Design | Companies designing new semiconductor architectures or materials where optimizing across thousands of parameters and simulations is critical. | Discovery enables engineers to automate simulation workflows, explore design alternatives, and analyze results at scale. The platform supports faster iteration toward more efficient or powerful chip designs by coordinating physics-based simulations and AI-driven optimization. |
| Manufacturing & Advanced Engineering | Manufacturers in automotive, aerospace, or industrial sectors seeking to optimize product design and production processes. | Engineers can use Discovery to run large-scale virtual prototyping, testing thousands of design variations for performance, weight, and durability. In process engineering, the platform helps tune parameters to improve yield and quality. Discovery's ability to coordinate simulations and analyze results in context supports faster innovation and more informed decision-making. |

## Models and training data

Microsoft Discovery uses a variety of AI models to power the experience that users see. These include large language models accessed via the Azure OpenAI Service through Azure AI Foundry. Specific models used include, but are not limited to, OpenAI gpt-5, OpenAI gpt-5.2 and OpenAI Text Embedding 3 (small).

For information about the training data, evaluation, and responsible AI considerations for Azure OpenAI models, see the Transparency Note for Azure OpenAI - Azure AI platforms.

## Performance

This section describes the conditions and environment under which Microsoft Discovery is expected to perform reliably, the types of inputs the platform accepts and outputs it produces, and the languages it supports.

### Modalities

| Intended Inputs | Description | Expected Outputs |
|---|---|---|
| Natural Language | Text-based conversational prompts, research intents, and agent instructions submitted via the Discovery Copilot interface | Research summaries, reasoning traces, literature syntheses, and conversational responses |
| Knowledge Base Documents | Unstructured and structured files for knowledge indexing. (for example, PDF, CSV, TXT, Word (.docx), PowerPoint (.pptx), and Excel (.xlsx)) | Domain-specific computational results, simulation reports, logs, and transformed datasets stored in designated Azure Storage containers |
| Computational Data | Domain-specific data assets, configuration files, and scripts used as inputs for containerized scientific tools (for example, molecular structures, circuit designs) | Generated scripts, code snippets, and structured data files |

To ensure consistent and reliable execution, all agent instructions and prompts must be strictly UTF-8 encoded. Use of non-compliant formatting, such as rich-text artifacts or characters that produce encoding errors (for example, Mojibake), might result in execution failures or unexpected behavior.

### Languages

Discovery is designed and evaluated for English. While the underlying LLM models have inherent multilingual capabilities for natural language understanding and generation, the platform's system prompts, user interface, and core evaluations are optimized and validated in English for this release. Use in other languages might work in practice but falls outside the scope of tested and supported behavior for the current release.

### Workload types

Discovery is specifically optimized for complex, multi-faceted, and long-duration research challenges (tasks spanning hours or days) that require autonomous AI agent orchestration. It is not designed for simple, one-off queries. The platform's cognitive Discovery Engine adaptively switches between fast and slow reasoning modes to decompose and address these complex problems.

### Environment

Discovery operates within a secure, Azure-hosted cloud environment using Virtual Network (VNet) isolation, Managed Identities, and Role-Based Access Control (RBAC). It relies on scalable High-Performance Computing (HPC) node pools (with both CPU and GPU options) to execute compute-intensive workloads.

## Limitations

Understanding Microsoft Discovery's limitations is crucial to determine it is used within safe and effective boundaries. While we encourage customers to use Discovery in their innovative solutions or applications, it's important to note that Discovery was not designed for every possible scenario. We encourage users to refer to Discovery's Code of Conduct, Microsoft Enterprise AI Services Code of Conduct (for organizations), or the Code Conduct section in the Microsoft Services Agreement (for individuals), as well as the following considerations when choosing a use case.

**Automation Bias and Loop Drift**: Discovery supports semi-autonomous, agentic workflows, which introduces a risk of automation bias. This refers to the tendency to over-trust AI-generated outputs without sufficient validation. In iterative workflows, small inaccuracies can also compound over time, a phenomenon known as loop drift. Human-in-the-loop oversight is essential to ensure research stays on track and aligned with scientific intent. Use cases that cannot accommodate meaningful human review at key decision points are not well-suited for this platform in its current form.

**Representation Bias**: Discovery's outputs might reflect imbalances present in the scientific literature or datasets used to train its underlying models. Discovery might overrepresent dominant research perspectives or underrepresent emerging and under-researched areas. Users should apply domain expertise and critically assess outputs, particularly when working in novel or interdisciplinary fields where representation in training data may be limited.

**Temporal Relevance of Data**: Scientific knowledge evolves rapidly. If Discovery relies on static or outdated datasets, it might surface obsolete findings or miss recent developments (a risk that is especially significant in fast-moving fields such as synthetic biology or AI-driven drug discovery). Users should regularly assess the currency of their data sources and treat outputs accordingly, particularly for time-sensitive research.

**Performance variability and inaccurate output risk**: When querying customer‑provided knowledge bases, response quality and groundedness depend heavily on the structure, completeness, and relevance of the underlying data, as well as how agents are configured to retrieve and reason over that data. In scenarios where the knowledge base is sparse, poorly structured, or weakly scoped, the system might produce responses that are incomplete or insufficiently grounded.

To help customers reduce this risk, we provide a reference sample agent in a GitHub repository that demonstrates recommended patterns for querying knowledge bases and enforcing grounding constraints. Customers are encouraged to use this sample as a starting point when building custom agents and workflows, and to apply additional validation and human review for high‑impact use cases. For more details, see Section 10.

**Toolchain Compatibility** Discovery integrates with a variety of computational tools and models. Mismatches in tool assumptions (for example, input formats, parameter ranges, or versioning) can lead to execution failures or misleading results. Users should test and validate tool orchestration workflows carefully, especially when integrating custom or third-party components.

**Customer Data**: Users are responsible for managing data sensitivity and access controls when using the service, and should not input regulated, classified, or highly sensitive data unless appropriate controls and agreements are in place.

**Conversation Saturation**: As conversations become very long, answer quality can gradually decline. When the total conversation approaches what the model can reliably keep in mind, earlier parts might be summarized to make room for new information. During this process, some details can be simplified, altered, or lost, which can cause answers to slowly drift in accuracy or intent. If you notice this happening in a long exchange, starting a new conversation can help restore clarity and answer quality.

**Tooling Signal Dilution**: In a similar way to large conversation history degrading quality of answers, as the system gets access to a larger and larger pool of agents, its ability to choose the best tools for the task may degrade. We encourage you to actively curate the list of agents that the system can use to your relevant scenarios.

### Prohibited uses

The following uses of Discovery are strictly prohibited:

**Weapons Development**: Discovery may not be used to support the design, development, testing, or deployment of chemical, biological, radiological, or nuclear weapons, or any other weapons intended to cause mass harm.

**Harmful Applications**: Discovery must not be used in ways that could cause physical, psychological, environmental, or financial harm to individuals, organizations, or society. This includes unsafe experimentation, misuse of outputs, or deployment in high-risk contexts without appropriate safeguards.

**Violation of Laws or Regulations**: Discovery may not be used in any manner that violates applicable laws, regulations, or industry-specific compliance requirements. Customers are responsible for ensuring their use of the platform aligns with all relevant legal and regulatory obligations.

**Bypassing Safety Systems**:  Attempts to circumvent, disable, or interfere with Discovery's built-in safety mechanisms, classifiers, or content filters are strictly prohibited. These systems are in place to help ensure responsible and secure use of the platform.

## Evaluations

Microsoft Discovery was evaluated using manual, custom evaluations grounded in the Responsible AI (RAI) evaluation framework from Microsoft AI Foundry. Evaluations were run by executing a curated suite of structured prompts against a target release and systematically reviewing system behavior by risk category. The evaluation was designed to answer two core questions: (1) does Discovery behave safely and consistently when users attempt to push the system outside its intended boundaries, and (2) does it remain faithful to grounding sources?

### Evaluation methodology

Evaluations targeted two dimensions of system behavior: safety and groundedness. For safety, the evaluation assessed whether Discovery appropriately refused, deflected, or responded safely when prompts attempted to elicit disallowed or policy-sensitive content, or bypass system safeguards. It should operate as such while remaining helpful and policy-aligned for benign requests. For reliability, the evaluation assessed whether Discovery stayed faithful to provided context and retrieved sources in scenarios where grounded responses were expected.

Ideal behavior is that Discovery responds consistently across prompt variants and risk categories, handles adversarial inputs without policy violations, and produces responses that are fully supported by available grounding sources.

Suboptimal behavior includes regressions relative to prior runs or benchmarks, unsafe or policy-sensitive content generation, successful jailbreak outcomes, or inconsistent handling of similar prompts. In grounded scenarios specifically, suboptimal behavior includes fabricated details, incorrect source attribution, or claims not supported by the provided context.

### Data curation

We curated evaluation data to systematically test Microsoft Discovery across key risk categories. The dataset consisted of structured test prompts designed to probe behavior under both realistic and adversarial scenarios. Prompts were created to explicitly target four risk domains:

- Copyright and intellectual property exposure
- Generation of harmful or policy-sensitive content
- Direct and indirect jailbreak attempts
- Groundedness

Each category included both benign and adversarial variants so that evaluation measured boundary behavior rather than only obvious failure modes. To ensure the dataset was representative of real Discovery usage (not synthetic-only stress testing), prompts were designed to reflect realistic Discovery workflows, including scientific workflow assistance and knowledge synthesis scenarios aligned with product use cases.

### Validation

Multiple quality and validity controls were applied to ensure the reliability and integrity of the evaluation dataset. Prompts were deduplicated and normalized to remove ambiguity and unintended bias. Risk category labels were manually reviewed to confirm alignment with policy definitions. A subset of prompts were replayed against Foundry-provided baseline models to confirm expected behavioral separation between safe and unsafe responses. Regression prompts from the previous release were also retained to support longitudinal comparison across releases.

### Metrics

For groundedness, we measured whether the system's responses remain faithful to provided context, detecting unsupported claims or fabricated content. Metrics captured include:

- Ungrounded Attributes Defect Rates (Text - English)
- Groundedness Defect Rates (Text - English)

For safety, the custom evaluation suite measured the system's ability to detect and mitigate misuse attempts through safe completion, refusal, or deflection. Metrics captured include:

- Policy Compliance Score
- Risk Detection and Mitigation Effectiveness
- Content Safety Classification Accuracy
- Direct Jailbreak Resistance Rate
- Indirect Jailbreak Resistance Rate

### Benchmarking

Results were interpreted through comparative benchmarking to detect regressions and validate stability over time. Each release was assessed against two reference points: Foundry-provided baseline model behavior on a shared subset of prompts, and historical results from the prior release, enabled by the retained regression prompt set. Together, these comparisons provided a longitudinal view of whether Discovery's safety and reliability posture was improving, stable, or regressing across releases.

## Safety components and mitigations

Microsoft Discovery incorporates multiple layers of safety and security controls designed to protect users, customer data, and the integrity of research workflows. This section describes the active safety components, mitigation measures, and cybersecurity practices users, integrators, and platform operators should be aware of when leveraging the platform.

### Active safety components

Discovery uses a combination of input classifiers, filters, and system‑level safeguards to prevent misuse and reduce the risk of harmful outputs. These safety controls are provided through Foundry Guardrails, Microsoft's content safety and filtering capability, and are applied by default to all models created within the platform scanning content at defined intervention points to detect and block unsafe or inappropriate content before it reaches the model. These components are designed to align with Microsoft's Responsible AI principles and are continuously updated as Discovery evolves.

Customers can create custom Guardrails and manage severity levels, including configuring Guardrails to be less restrictive, defining risks to detect, assigning Guardrails to evaluate and monitor agent behavior, configuring safety thresholds, and assessing model performance across different use cases. These capabilities support proactive risk management and safety. For more information on configuring content filters, see Configure content filters (classic) - Microsoft Foundry (classic) portal | Microsoft Learn.

To register for approval to use models directly sold by Microsoft with Modified Guardrails, you can submit the Limited Access Review: Modified Guardrails form. To the extent that you are approved for and comply with all requirements to use the model with modified Guardrails, you will have full control, including turning Guardrails off entirely or using annotations only. Note, the option to disable Guardrails is only available to managed customers.

### Mitigation measures

Discovery's safety and performance posture is informed by ongoing evaluation and risk review. To address risks such as AI-generated responses being inaccurate, automation bias, and loop drift, Discovery emphasizes human-in-the-loop oversight as a core mitigation strategy. Users are strongly encouraged to validate AI-generated outputs at key decision points, particularly in high-stakes research scenarios.

The platform supports transparency by surfacing citations and grounding sources where applicable, helping users trace the origin of generated content and assess its reliability. For grounded workflows, users are encouraged to ensure their knowledge base documents are current, well-structured, and relevant to the intended research scope, as output reliability is directly tied to the quality of available grounding sources.

Discovery allows customers to integrate their own models, datasets, and agents. This extensibility helps reduce bias and improve relevance in specialized or emerging fields where general-purpose models may underperform. Users working in underrepresented or highly specialized domains are encouraged to use this capability to better align platform behavior with their specific research context.

### Cybersecurity measures

Discovery's cybersecurity architecture is designed around a defense-in-depth model, with controls spanning identity, network, data, compute, and operational security. The following describes the active measures in place for this release.

Identity and Access Management:  Discovery enforces least-privilege access using Microsoft Entra ID and role-based access control (RBAC). All control-plane and data-plane access is authenticated through Microsoft Entra ID, and user-assigned managed identities (UAMI) are used for platform components to access Azure resources without embedded secrets. Platform-specific RBAC roles support separation of duties between operators, developers, and security administrators.

**Network Security**: Discovery uses a private-by-default network architecture. All Discovery resources are created with Azure Private Link enabled by default, eliminating public IP exposure. Data-plane APIs have public network access disabled at the resource level, and traffic is restricted to customer virtual networks (VNets) using private endpoints, private DNS zones, and network security groups (NSGs). This architecture supports zero-trust networking principles and reduces the platform's overall attack surface.

**Data Protection**: Customer data is protected through encryption and tenant isolation. Encryption at rest is provided by Azure-managed encryption for storage and platform services, and encryption in transit is enforced using HTTPS and TLS for all service-to-service and client-to-service communication. Customer data, knowledge graphs, and models are tenant-isolated and are not shared across customers. Customers retain full ownership and control of their data and can export or remove assets at any time.

Platform Hardening:  Discovery compute infrastructure is hardened using Azure security baselines. Supercomputer clusters and node pools are deployed on Azure-managed infrastructure following Azure security configuration standards. Platform reviews track compliance with Microsoft Cloud Security Benchmark (MCSB) requirements, including TLS configuration, diagnostic logging, and private endpoint usage. Continuous security reviews identify configuration gaps and drive remediation through infrastructure updates and policy enforcement.

Logging, Monitoring, and Detection:  Discovery integrates with Azure monitoring and security tooling to support detection and response. Diagnostic logs can be enabled on platform resources and routed to customer-managed logging solutions. Connectivity and availability are monitored using proactive health checks and platform telemetry, and security findings and configuration drift are reviewed as part of ongoing platform security assessments.

Secure Development and Compliance:  Discovery follows Microsoft's Secure Development Lifecycle (SDL) and a continuous compliance model. Security bugs, vulnerabilities, and SDL requirements are tracked centrally and reviewed on an ongoing basis. Discovery participates in Azure's continuous SDL and vulnerability management programs, which support external compliance audits including SOC, ISO, and other Azure certifications. This approach ensures security is continuously evaluated rather than assessed only at release time.

### Shared responsibility

Security in Discovery follows the Azure shared responsibility model. Discovery secures the underlying platform, managed services, and control plane. Customers are responsible for securing their subscriptions, VNets, role assignments, and data access policies. Understanding this division of responsibility is important for customers designing secure deployments aligned with their organizational and compliance requirements.

## Best practices for integrating and deploying Microsoft Discovery

Responsible AI is a shared commitment between Microsoft and its customers. While Microsoft builds AI applications with safety, fairness, and transparency at the core, customers play a critical role in deploying and using these technologies responsibly within their own contexts. To support this partnership, we offer the following best practices for deployers and end users to help customers implement responsible AI effectively.

### Deployers and end-users should

Exercise caution and monitor outcomes when using Discovery for consequential decisions or in sensitive domains:  Consequential decisions are those that may have a legal or significant impact on a person's access to education, employment, financial platforms, government benefits, healthcare, housing, insurance, legal platforms, or that could result in physical, psychological, or financial harm. Sensitive domains that require particular care due to the potential for disproportionate impact on different groups of people. When using AI for decisions in these areas, make sure that impacted stakeholders can understand how decisions are made, appeal decisions, and update any relevant input data.

Evaluate legal and regulatory considerations:  Customers need to evaluate potential specific legal and regulatory obligations when using any AI platforms and solutions, which might not be appropriate for use in every industry or scenario. Additionally, AI platforms or solutions are not designed for and may not be used in ways prohibited in applicable terms of service and relevant codes of conduct.

### End-users should

Use clear, specific prompts:  Ensure prompts are explicit about your goal, the scope of the task, and what evidence to use. A clear and effective prompt typically includes:

- Objective (what you're trying to learn/decide)
- Context (domain assumptions, constraints, success criteria)
- Sources to use (which knowledge base/documents/tools to reference)
- Output format (table, ranked list, experiment plan, and so on)
- Grounding request (ask for citations/traceability when available)

#### Example prompt

Using my indexed knowledge base documents on \<TOPIC>, propose 3 testable hypotheses for \<RESEARCH GOAL>. For each hypothesis: (a) summarize the supporting evidence, (b) cite the specific source(s) used, and (c) list 2–3 experiments to validate it. If evidence is missing or weak, say so explicitly and suggest what additional data would be needed.

Monitor for performance drift:  Because output quality and groundedness depend on the data available for grounding and how agents/tools are configured, results might change as your knowledge base, tools, or workflows evolve. To detect drift:

- Re-run a small set of benchmark prompts periodically and compare outputs for consistency, completeness, and grounding.
- Watch for warning signs such as fewer/weak citations, increased uncertainty, contradictory conclusions, or missing key constraints.
- If you update the knowledge base (add/remove documents), treat that as a "version change" and re-check critical workflows.
- For high-impact work, use human review and a second method of validation (domain expert review, independent calculation/simulation, or controlled test runs).

Exercise human oversight when appropriate:  Human oversight is an important safeguard when interacting with AI applications. While we continuously improve our AI applications, AI might still make mistakes. The outputs generated may be inaccurate, incomplete, biased, misaligned, or irrelevant to your intended goals. This could happen due to various reasons, such as ambiguity in the inputs or limitations of the underlying models. As such, users should review the responses generated by Discovery and verify that they match their expectations and requirements.

Be aware of the risk of overreliance:  Overreliance can occur when users accept incorrect or incomplete AI outputs, mainly because mistakes in AI outputs may be hard to detect. These types of outputs are usually a result of when the underlying evidence is incomplete or not clearly grounded. With Discovery, this risk can increase in long, iterative workflows (where small errors can compound) and in scenarios where knowledge base coverage is limited. Treat outputs as decision support, not decision replacement, especially for consequential decisions.

Exercise caution when designing agentic AI in sensitive domains:  If you design or deploy autonomous/agentic workflows that can trigger irreversible or high-impact actions (for example, in regulated or safety-critical domains), add safeguards such as approval gates, least-privilege access, audit logs, and constrained action scopes. Ensure impacted stakeholders can understand how outcomes were reached and can challenge or appeal decisions where applicable. Additional precautions should also be taken when creating autonomous agentic AI as described further in either the Microsoft Enterprise AI Services Code of Conduct (for organizations) or the Code Conduct section in the Microsoft Services Agreement (for individuals).

Provide feedback to help improve Microsoft Discovery:  If you encounter issues or want to share feedback, in the Studio select "Give Feedback" in the bottom-right corner. This opens a feedback form where you can describe what happened and include relevant details. Submit the form to send feedback to the Microsoft Discovery team.

### Deployers should

Use the reference sample agent as a baseline for grounded agent design:  Discovery provides a reference sample agent in the GitHub repository that demonstrates recommended patterns for querying customer knowledge bases, enforcing grounding constraints, and handling cases where evidence is missing or weak. The sample illustrates how to scope retrieval to relevant sources, require explicit citations or traceability, and reduce the risk of ungrounded or speculative outputs when working with customer‑provided data.

Adapt and extend the sample based on domain, data, and risk context:  Customers should treat the reference sample agent as a starting point rather than a production‑ready solution. When building custom agents and workflows, customers are encouraged to tailor retrieval logic, grounding requirements, validation steps, and human‑in‑the‑loop review based on their specific domain, data structure, and risk profile, particularly for high‑impact or long‑running agentic workflows.

Implement strong identity and access controls (least privilege):  Discovery uses Microsoft Entra ID authentication and role-based access control (RBAC), and deployers should mirror that model by granting only the minimum roles needed for each user or workload. Avoid broad "Owner" or subscription-wide permissions except when absolutely necessary and prefer scoped roles at the resource group or resource level. Use user-assigned managed identities (UAMI) for service-to-service access so you don't rely on embedded secrets, and periodically review role assignments.

Harden network posture and keep resources private-by-default:  Discovery is designed with Azure Private Link enabled by default and public network access disabled for data-plane APIs; deployers should maintain this posture by restricting access to trusted virtual networks (VNets) and using private endpoints, private DNS zones, and network security groups (NSGs). Where your organization requires additional "ring-fencing," you can deploy a Network Security Perimeter (NSP) after the platform infrastructure is deployed to further protect dependent PaaS services (for example, Cosmos DB, Azure SQL Server, Key Vault, Storage Accounts). Reducing public exposure lowers the attack surface and helps protect against stolen credentials being used from untrusted network locations.

Keep safety controls enabled and validate any safety-threshold changes:  Discovery applies Foundry Guardrails / content filtering by default for models created within the platform and attempts to bypass or disable built-in safety mechanisms are prohibited. Deployers can create and manage guardrails in the Foundry portal, including configuring safety thresholds and monitoring agent behavior; if you change thresholds or customize filters, test those changes with representative prompts before rolling out broadly. For example, for this release the content filter configuration includes input/output filtering thresholds (for example, Violence/Hate/Sexual at "Medium," Self-harm at "High") and enables models like Jailbreak and Protected Material detection. Changing these settings may affect both user experience and safety outcomes. For more information, visit Azure AI Content Safety documentation - Quickstarts, Tutorials, API Reference - Foundry Tools | Microsoft Learn.

Test for safety, grounding, and toolchain reliability before scaling access:  Discovery is evaluated using a structured prompt suite across risk categories (copyright/IP, harmful content, jailbreak attempts, and groundedness) and uses benchmarking to detect regressions over time. Deployers should adopt a similar practice for their most important workflows. Create a small set of "golden" end-to-end scenarios that reflect your intended use cases (including your own tools, models, and knowledge base content), and rerun them whenever you change models, tools, agents, or datasets. Because mismatches in tool assumptions (formats, parameter ranges, versioning) can cause failures or misleading results, validate orchestration workflows carefully, especially when onboarding custom or third-party components. For higher-impact scenarios, require human review and an independent method of validation (for example, domain expert review or controlled test runs).

Enable logging and continuously monitor for drift:  Discovery supports logging/monitoring by allowing diagnostic logs to be enabled and routed to customer-managed logging solutions, and it uses proactive health checks and telemetry to track connectivity and availability. Deployers should enable these logs, set up alerts for repeated failures or abnormal error patterns, and periodically review security findings and configuration drift as part of ongoing platform security assessments. For performance and output-quality drift, treat changes to the knowledge base, tools, workflows, or agents as "version changes" and rerun a small benchmark set to compare consistency, completeness, and grounding. Warning signs include fewer/weaker citations, increased uncertainty, contradictory conclusions, or missing key constraints (use these signals to trigger deeper review and remediation).

## Learn more about Microsoft Discovery

For additional guidance on the responsible use of Microsoft Discovery we recommend reviewing the Responsible Use Guide, which outlines key principles for deploying AI-powered features. You can learn more here:

- [Microsoft Discovery Data Privacy & Security](concept-network-security.md)
- [Microsoft Discovery FAQs](faq.yml).

Learn more about responsible AI

- [Microsoft AI principles](https://www.microsoft.com/ai/responsible-ai)
- [Microsoft responsible AI resources](https://www.microsoft.com/ai/tools-practices)
- [Microsoft Azure Learning courses on responsible AI](/training/paths/responsible-ai-business-principles/)
