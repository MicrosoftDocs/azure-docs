---
title: Platform Card for Microsoft Discovery
description: Learn about Microsoft Discovery intended uses, capabilities, limitations, evaluations, safety components, and best practices for responsible deployment and use.
author: ffrachon
ms.author: fabricfr
ms.service: azure
ms.topic: concept-article
ms.date: 04/21/2026

#CustomerIntent: As a researcher or deployer, I want to understand Microsoft Discovery and its intended purpose, capabilities, and limitations so that I can make informed decisions about adoption and use.
---

# Platform card: Microsoft Discovery

This platform card describes Microsoft Discovery intended uses, capabilities, limitations, and best practices for responsible deployment and use.

## What is an application or platform card?

Application and platform cards help you understand how Microsoft AI technology works, the choices that influence application performance, and why it's important to consider the whole system, technology, people, and environment together. Application cards are created for AI applications. Platform cards are created for AI platform services. These resources can support the development or deployment of your own applications and be shared with users or stakeholders affected by them.

As part of its commitment to responsible AI, Microsoft adheres to six core principles: fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability. These principles are embedded in the Responsible AI Standard, which guides teams in designing, building, and testing AI applications.

Application and platform cards play a key role in operationalizing these principles by offering transparency around capabilities, intended uses, and limitations. For further insight, explore the Microsoft Responsible AI Transparency Report and the Code of Conduct, which outline how enterprise customers and individuals can engage with AI responsibly.

## Overview

Discovery is in public preview and is currently available to select customers. Use of Discovery is subject to customer eligibility requirements and acceptance of the Microsoft Product Terms and User Code of Conduct. Discovery requires a license and is offered in a limited number of countries. The goal is to ensure that the system remains safe, reliable, and beneficial for all users as we continue to evolve its capabilities.

### Introduction

Discovery is an enterprise *agentic AI* platform designed to support scientific research and development (R&D). It brings together domain knowledge, data, models, and computation in a single environment.

Organizations can use Discovery to reason through complex problems, generate and refine hypotheses, design experiments, and analyze results. By supporting the scientific method end‑to‑end, Discovery addresses the fragmentation and cognitive overhead that often slow modern R&D efforts.

The platform uses an agentic AI architecture that uses a graph‑based knowledge engine to drive R&D outcomes with enhanced speed, scale, and accuracy. Through a natural-language interface, users can describe objectives or questions. The system can then translate them into structured plans that draw on available tools, models, and workflows.

Discovery operationalizes the Discovery Engine, which incorporates outcomes and feedback into subsequent reasoning. This approach enables adaptive, explainable, and repeatable research execution while keeping the user in control.

### Intended users

Discovery is designed for R&D organizations with scientists, engineers, and developers in industries that span life sciences, materials, semiconductors, energy, manufacturing, and advanced engineering.

The Azure platform is extensible and secure. It allows organizations to integrate their own data, models, and tools into a unified AI‑driven environment. Rather than replacing human expertise, Discovery augments it. Discovery helps teams manage complexity and scale insight across the research process.

## Key terms

The following table provides a glossary of key terms related to Discovery.

| Term | Definition |
|---|---|
| Classifiers | Machine learning models that sort data into labeled classes or categories of information. |
| Discovery Engine | A feature within Discovery that acts and behaves like a colleague that you can converse with, delegate to, cooperatively plan with, and hand off tasks to when you work on ambitious long-duration work. The purpose of the work that you want to accomplish organizes and drives the Discovery Engine. It uses the rest of Discovery as resources to accomplish the work. |
| Grounding | Responses are anchored in relevant, reliable sources, such as customer‑provided data, internal knowledge bases, and external content where applicable. Sources provide citations or traceability when available. |
| Large language models (LLMs) | AI models trained on large amounts of text data to predict words in sequences. They can perform tasks such as text generation, summarization, translation, and classification. |
| Mitigation | Methods designed to reduce potential risks that might arise from using AI features. |
| Prompts | Inputs in the form of text, images, or audio that a user provides to interact with AI features. |
| Supercomputer | The supercomputer component of Discovery uses Azure high‑performance computing (HPC), and future quantum capabilities, to run compute‑intensive scientific workflows, simulations, and AI workloads. |
| System Message | The system message (sometimes referred to as a meta prompt) guides the system's behavior, aligning it with Microsoft AI principles and user expectations. For example, it might include instructions like, "Do not provide information or create content that could cause physical, emotional, or financial harm." |

## Key features and capabilities

The key features and capabilities outlined here describe what Discovery is designed to do and how it performs across supported tasks.

### Natural-language interface

Customers interact with Discovery through a conversational assistant that understands requests in natural language and translates them into a structured plan by using available tools and workflows. This capability helps scientists and engineers move from a research question to an actionable workflow without manually stitching together multiple systems.

When needed, this assistant can invoke integrated compute and tools (for example, simulations, database queries, or model runs). It supports iterative refinement through dialogue. This interaction model lowers the barrier to using advanced R&D tools by letting customers adjust and explore workflows step by step in the same interface.

### Multi-agent architecture

Discovery uses a multi-agent system, where customers can bring in specialized AI agents, each adept in a certain domain (such as chemistry, biology, physics, silicon design, and data analysis) or function (reasoning, simulation, and optimization).

The agents work together, coordinated by Copilot and a central knowledge graph. They can reason over a rich, connected knowledge base that integrates the enterprise's data sources and scientific knowledge. This architecture allows tackling complex, cross-disciplinary problems.

For example, one agent might parse scientific literature while another runs a simulation and another analyzes the results. This distributed intelligence is known as agentic AI. It's not one monolithic model but a team of models working together for the user.

### Discovery Engine

The Discovery Engine is a core capability within Discovery that enables sustained, goal‑oriented research and problem solving over extended periods of time. Instead of focusing on short, transactional interactions, the Discovery Engine supports long‑running work. It coordinates reasoning, planning, and execution across agents, tools, models, and knowledge sources.

The Discovery Engine is designed for complex research scenarios that require decomposition of high‑level objectives, iterative exploration, and integration of results across multiple activities.

The Discovery Engine operates through two complementary components: cognition and tasks. Cognition manages the ongoing reasoning and coordination required to make progress toward defined objectives. Tasks include selecting appropriate agents, tools, and data sources and adapting execution based on intermediate results and user feedback.

The tasks system captures user intent, structure, and progress. It provides a persistent representation of what needs to be accomplished, how success is measured, and how work evolves over time. Together, these components enable customers to delegate work, review progress periodically, and refine direction as needed. Users can maintain human oversight and control throughout the research process.

In support of long‑running and iterative research, the Discovery Engine maintains contextual continuity across interactions by preserving relevant state from prior work, including objectives, intermediate results, decisions, and user guidance. This persistent context enables the system to resume work across sessions without requiring customers to restate goals or reconstruct prior steps.

By carrying forward what was already explored or decided, the Discovery Engine supports incremental progress, adaptive planning, and more coherent execution over time. Users are kept in control through review, refinement, and oversight at each stage.

### Extensibility

Discovery is designed to be extensible. You can bring your own models, integrate proprietary or non-Microsoft data through platforms such as Microsoft Foundry or Azure Machine Learning, and build custom agents tailored to domain needs. Plug in your in-house models, your existing lab data, domain-specific databases, or even custom-developed AI agents.

Discovery incorporates those assets into the knowledge graph and workflows. It also supports partner and open-source tools. Because Discovery is built on Azure, it inherits Azure security, compliance, and governance capabilities.

### HPC integration

Because Discovery is built on Azure's cutting-edge infrastructure, it natively integrates Azure HPC and AI services. The platform can deploy workloads to large-scale CPU/GPU clusters, run cloud-based simulations (like computational fluid dynamics and molecular dynamics), and use advanced AI models, such as custom physics machine learning models or large language models (LLMs), as needed.

### Knowledge reasoning

Discovery delivers advanced knowledge reasoning by combining curated domain grounding with graph‑enhanced, AI‑driven retrieval and synthesis.

At the foundation, Discovery offers a bookshelf service that researchers use to organize and ground their work in curated collections of scientific literature, papers, and reference materials tailored to their domain. This foundation ensures that reasoning and analysis are anchored in trusted, relevant sources from the start.

Based on this foundation, Discovery natively integrates Azure AI Search through Foundry. It enables fast retrieval across internal repositories, external literature, and connected databases. Users can seamlessly search across diverse knowledge sources without manual stitching or context switching.

What differentiates Discovery is how it reasons over diverse knowledge sources. Discovery goes beyond traditional semantic search. It uncovers local insights, such as specific facts, entities, and findings, and global understanding, which includes themes, patterns, and implications across an entire corpus. It dynamically combines vector-based retrieval with graph-oriented reasoning at query time.

This approach avoids costly upfront summarization while scaling efficiently without sacrificing answer quality. Together, these capabilities allow Discovery to connect, contextualize, and synthesize knowledge across large and continuously evolving scientific datasets. The result is deeper reasoning, faster insight generation, and more informed scientific exploration.

#### Grounded citations

When responses are grounded in web or customer data, Discovery might provide hyperlinked citations. Customers can then access the referenced websites or internal documents or databases that were used for grounding. They can also use the links to learn more about the subject.

## Intended uses

You can use Discovery in multiple scenarios across various industries. The following table lists some examples of use cases.

| Industry/Domain | Scenario | User benefits |
|---|---|---|
| Chemicals and materials science | Companies developing new materials, chemicals, or formulations (for example, advanced alloys, polymers, semiconductor materials, battery chemistry, renewable energy, sustainable tech) that want to speed up research. | Users can rapidly generate and test hypotheses to refine formulations by using AI-coordinated workflows. Discovery allows researchers to simulate material properties, complex chemical reactions, and physical processes. Performance trade-offs are evaluated to identify optimal configurations. Discovery helps reduce the time and cost of experimentation by automating tool orchestration, surfacing relevant literature, and enabling iterative design cycles. Discovery maintains traceability and reproducibility. |
| Pharmaceuticals and life sciences | Pharma and biotech teams working on drug discovery, genomics, or biomedical research with complex pipelines and massive datasets. | Discovery can help researchers synthesize biomedical literature, identify promising drug candidates, and design experiments by using predictive models. Automation of early-stage screening and hypothesis generation allows customers to focus on decision-making and validation. Automation potentially accelerates discovery timelines and uncovers novel insights from cross-domain data. |
| Semiconductor and electronics design | Companies designing new semiconductor architectures or materials where optimizing across thousands of parameters and simulations is critical. | Discovery enables engineers to automate simulation workflows, explore design alternatives, and analyze results at scale. The platform supports faster iteration toward more efficient or powerful chip designs by coordinating physics-based simulations and AI-driven optimization. |
| Manufacturing and advanced engineering | Manufacturers in automotive, aerospace, or industrial sectors seeking to optimize product design and production processes. | Engineers can use Discovery to run large-scale virtual prototyping, testing thousands of design variations for performance, weight, and durability. In process engineering, the platform helps tune parameters to improve yield and quality. Discovery has the capability to coordinate simulations and analyze results in context, which supports faster innovation and more informed decision-making. |

## Models and training data

Discovery uses various AI models to power the experience that customers see. These models include LLMs accessed via the Azure OpenAI Service through Foundry. The specific models used include, but aren't limited to, OpenAI gpt-5, OpenAI gpt-5.2, and OpenAI Text Embedding 3 (small).

For information about the training data, evaluation, and responsible AI considerations for Azure OpenAI models, see the [Transparency note for Azure OpenAI](/azure/foundry/responsible-ai/openai/transparency-note).

## Performance

This section describes the conditions and environment under which Discovery is expected to perform reliably. It also describes the types of inputs the platform accepts, the outputs it produces, and the languages it supports.

### Modalities

| Intended inputs | Description | Expected outputs |
|---|---|---|
| Natural language | Text-based conversational prompts, research intents, and agent instructions submitted through the Discovery Copilot interface. | Research summaries, reasoning traces, literature syntheses, and conversational responses. |
| Knowledge base documents | Unstructured and structured files for knowledge indexing. Examples include PDF, CSV, TXT, Word (.docx), PowerPoint (.pptx), and Excel (.xlsx). | Domain-specific computational results, simulation reports, logs, and transformed datasets stored in designated Azure Storage containers. |
| Computational data | Domain-specific data assets, configuration files, and scripts used as inputs for containerized scientific tools (for example, molecular structures or circuit designs). | Generated scripts, code snippets, and structured data files. |

To ensure consistent and reliable execution, strictly UTF-8 encode all agent instructions and prompts. Use of noncompliant formatting, such as rich-text artifacts or characters that produce encoding errors (for example, Mojibake), might result in execution failures or unexpected behavior.

### Languages

Discovery is designed and evaluated for English. Although the underlying LLM models have inherent multilingual capabilities for natural language understanding and generation, the platform's system prompts, user interface, and core evaluations are optimized and validated in English for this release.

Use in other languages might work in practice but falls outside the scope of tested and supported behavior for the current release.

### Workload types

Discovery is optimized for complex, multifaceted, and long-duration research challenges (tasks spanning hours or days) that require autonomous AI agent orchestration. It isn't designed for simple, one-off queries. The platform's cognitive Discovery Engine adaptively switches between fast and slow reasoning modes to decompose and address these complex problems.

### Environment

Discovery operates within a secure, Azure-hosted cloud environment by using virtual network (VNet) isolation, managed identities, and role-based access control (RBAC). It relies on scalable HPC node pools (with both CPU and GPU options) to run compute-intensive workloads.

## Limitations

Understanding Discovery limitations is crucial to make sure that you use it within safe and effective boundaries. Use Discovery in your innovative solutions or applications, but keep in mind that Discovery isn't designed for every possible scenario.

Refer to the Discovery Code of Conduct, the Microsoft Enterprise AI Services Code of Conduct (for organizations), or the Code of Conduct section in the Microsoft Services Agreement (for individuals). Also consider the following considerations when you choose a use case:

- **Automation bias and loop drift:** Discovery supports semiautonomous, agentic workflows, which introduces a risk of automation bias. This bias refers to the tendency to over-trust AI-generated outputs without sufficient validation. In iterative workflows, small inaccuracies can also compound over time, a phenomenon known as loop drift.

   Human-in-the-loop oversight is essential to ensure that research stays on track and aligned with scientific intent. Use cases that can't accommodate meaningful human review at key decision points aren't well-suited for this platform in its current form.

- **Representation bias:** Discovery outputs might reflect imbalances present in the scientific literature or datasets used to train its underlying models. Discovery might overrepresent dominant research perspectives or underrepresent emerging and under-researched areas. Apply domain expertise and critically assess outputs, in particular when you work in novel or interdisciplinary fields where representation in training data might be limited.
- **Temporal relevance of data:** Scientific knowledge evolves rapidly. If Discovery relies on static or outdated datasets, it might surface obsolete findings or miss recent developments. (This risk is especially significant in fast-moving fields such as synthetic biology or AI-driven drug discovery.) Regularly assess the currency of your data sources and treat outputs accordingly, especially for time-sensitive research.
- **Performance variability and inaccurate output risk:** When users query customer‑provided knowledge bases, response quality and groundedness depend heavily on the structure, completeness, and relevance of the underlying data, and how agents are configured to retrieve and reason over that data. In scenarios where the knowledge base is sparse, poorly structured, or weakly scoped, the system might produce responses that are incomplete or insufficiently grounded.

    To help reduce this risk, Microsoft provides a reference sample agent in a GitHub repository that demonstrates recommended patterns for querying knowledge bases and enforcing grounding constraints. Use this sample as a starting point when you build custom agents and workflows, and to apply extra validation and human review for high‑impact use cases. For more information, see Section 10.

- **Toolchain compatibility:** Discovery integrates with various computational tools and models. Mismatches in tool assumptions (for example, input formats, parameter ranges, or versioning) can lead to execution failures or misleading results. Test and validate tool orchestration workflows carefully, especially when you integrate custom or non-Microsoft components.
- **Customer data:** You're responsible for managing data sensitivity and access controls when you use the service. Don't input regulated, classified, or highly sensitive data unless appropriate controls and agreements are in place.
- **Conversation saturation:** As conversations become long, answer quality can gradually decline. When the total conversation approaches what the model can reliably keep track of, earlier parts might be summarized to make room for new information. During this process, some details can be simplified, altered, or lost, which can cause answers to slowly drift in accuracy or intent.

   If you notice a decline in a long exchange, starting a new conversation can help restore clarity and answer quality.

- **Tooling signal dilution:** As the system gets access to a larger and larger pool of agents, its ability to choose the best tools for the task might degrade. Actively curate the list of agents that the system can use to your relevant scenarios.

### Prohibited uses

The following uses of Discovery are strictly prohibited:

- **Weapons development:** You can't use Discovery to support the design, development, testing, or deployment of chemical, biological, radiological, or nuclear weapons, or any other weapons intended to cause mass harm.
- **Harmful applications:** You can't use Discovery in ways that could cause physical, psychological, environmental, or financial harm to individuals, organizations, or society. This prohibition includes unsafe experimentation, misuse of outputs, or deployment in high-risk contexts without appropriate safeguards.
- **Violation of laws or regulations:** You can't use Discovery in any manner that violates applicable laws, regulations, or industry-specific compliance requirements. You're responsible for ensuring that your use of the platform aligns with all relevant legal and regulatory obligations.
- **Bypassing safety systems:** Attempts to circumvent, disable, or interfere with Discovery built-in safety mechanisms, classifiers, or content filters are strictly prohibited. These systems are in place to help ensure responsible and secure use of the platform.

## Evaluations

Microsoft evaluated Discovery by using manual, custom evaluations grounded in the Responsible AI evaluation framework from Foundry. The team ran evaluations by executing a curated suite of structured prompts against a target release. They used risk category to systematically review system behavior.

The evaluation was designed to answer two core questions. Does Discovery behave safely and consistently when customers attempt to push the system outside its intended boundaries? Does Discovery remain faithful to grounding sources?

### Evaluation methodology

Evaluations targeted two dimensions of system behavior: safety and groundedness. For safety, the evaluation assessed whether Discovery appropriately refused, deflected, or responded safely when prompts attempted to elicit disallowed or policy-sensitive content, or bypass system safeguards. It should operate while remaining helpful and policy-aligned for benign requests.

For reliability, the evaluation assessed whether Discovery stayed faithful to provided context and retrieved sources in scenarios where grounded responses were expected.

Ideal behavior is that Discovery responds consistently across prompt variants and risk categories. Discovery should handle adversarial inputs without policy violations. It should also produce responses that are fully supported by available grounding sources.

Suboptimal behavior includes regressions relative to prior runs or benchmarks and unsafe or policy-sensitive content generation. It also includes successful jailbreak outcomes or inconsistent handling of similar prompts. In grounded scenarios specifically, suboptimal behavior includes fabricated details, incorrect source attribution, or claims not supported by the provided context.

### Data curation

The team curated evaluation data to systematically test Discovery across key risk categories. The dataset consisted of structured test prompts designed to probe behavior under both realistic and adversarial scenarios. Prompts explicitly targeted four risk domains:

- Copyright and intellectual property exposure
- Generation of harmful or policy-sensitive content
- Direct and indirect jailbreak attempts
- Groundedness

Each category included benign and adversarial variants so that evaluation measured boundary behavior rather than only obvious failure modes.

To ensure that the dataset represented real Discovery usage (not synthetic-only stress testing), prompts reflected realistic Discovery workflows. Examples included scientific workflow assistance and knowledge synthesis scenarios aligned with product use cases.

### Validation

The team applied multiple quality and validity controls to ensure the reliability and integrity of the evaluation dataset. Prompts were deduplicated and normalized to remove ambiguity and unintended bias. Risk category labels were manually reviewed to confirm alignment with policy definitions.

A subset of prompts were replayed against Foundry-provided baseline models to confirm expected behavioral separation between safe and unsafe responses. Regression prompts from the previous release were also retained to support longitudinal comparison across releases.

### Metrics

For groundedness, the team measured whether the system's responses stayed faithful to the provided context and detected unsupported claims or fabricated content. Metrics captured include:

- Ungrounded attributes defect rates (text in English)
- Groundedness defect rates (text in English)

For safety, the custom evaluation suite measured the system's ability to detect and mitigate misuse attempts through safe completion, refusal, or deflection. Metrics captured include:

- Policy compliance score
- Risk detection and mitigation effectiveness
- Content safety classification accuracy
- Direct jailbreak resistance rate
- Indirect jailbreak resistance rate

### Benchmarking

The team interpreted the results through comparative benchmarking to detect regressions and validate stability over time. Each release was assessed against two reference points: Foundry-provided baseline model behavior on a shared subset of prompts and historical results from the prior release, enabled by the retained regression prompt set.

Together, these comparisons provided a longitudinal view of whether the safety and reliability posture for Discovery improved, was stable, or regressed across releases.

### Limitations of evaluation methodology

Although this evaluation provides structured insight into Discovery safety and groundedness, it has several limitations. The evaluation relies on a curated and finite prompt dataset. Despite efforts to reflect realistic and adversarial usage, this dataset can't fully capture the breadth of real-world user interactions or emerging misuse patterns.

Manual review and custom scoring introduce subjectivity and might lead to variability in interpretation across evaluators. Evaluations are also conducted in controlled settings with predefined prompts. However, they might not fully reflect dynamic, multi-turn, or tool-integrated scenarios observed in production environments.

Groundedness assessments are limited to available context and retrieval quality at evaluation time and might not generalize to all content sources or evolving datasets.

Another limitation is that GPT-5.2 and GPT-5.4 were used as the evaluation model. The evaluator model's own capabilities, reasoning behavior, sensitivity to risk, and potential biases might influence the assessment results.

As a result, interpret the findings as model-assisted evaluation outcomes rather than absolute judgments of safety or correctness across all evaluator models.

Finally, benchmarking against prior runs and baseline models can help detect regressions and relative improvements, but it doesn't guarantee absolute safety, groundedness, or correctness under all conditions.

## Safety components and mitigations

Discovery incorporates multiple layers of safety and security controls that help to protect users, customer data, and the integrity of research workflows.

This section describes the active safety components, mitigation measures, and cybersecurity practices that customers, integrators, and platform operators should be aware of when they use the platform.

### Active safety components

Discovery uses a combination of input classifiers, filters, and system‑level safeguards to prevent misuse and reduce the risk of harmful outputs. Foundry guardrails provide these safety controls, which are a Microsoft content safety and filtering capability.

The safety controls are applied by default to all models created within the platform. Content is scanned at defined intervention points to detect and block unsafe or inappropriate content before it reaches the model. The components are designed to align with the Microsoft Responsible AI principles and are continuously updated as Discovery evolves.

Customers can create custom guardrails and manage severity levels. They can configure guardrails to be less restrictive and define risks to detect. They can also assign guardrails to evaluate and monitor agent behavior, configure safety thresholds, and assess model performance across different use cases.

These capabilities support proactive risk management and safety. For more information on how to configure content filters, see [Configure content filters (classic)](/azure/foundry-classic/openai/how-to/content-filters).

To register for approval to use models directly sold by Microsoft with modified guardrails, you can submit the Limited Access Review: Modified Guardrails form.

To the extent that you're approved for and comply with all requirements to use the model with modified guardrails, you have full control. You can turn off guardrails entirely or use annotations only. The option to disable guardrails is available only to managed customers.

### Mitigation measures

Ongoing evaluation and risk review informs the Discovery safety and performance posture. To address risks such as AI-generated responses being inaccurate, automation bias, and loop drift, Discovery emphasizes human-in-the-loop oversight as a core mitigation strategy. Customers are encouraged to validate AI-generated outputs at key decision points, especially in high-stakes research scenarios.

The platform supports transparency by surfacing citations and grounding sources where applicable, which helps customers trace the origin of generated content and assess its reliability. For grounded workflows, customers are encouraged to ensure that their knowledge base documents are current, well-structured, and relevant to the intended research scope. Output reliability is directly tied to the quality of available grounding sources.

Discovery allows customers to integrate their own models, datasets, and agents. This extensibility helps reduce bias and improve relevance in specialized or emerging fields where general-purpose models might underperform. Users working in underrepresented or highly specialized domains are encouraged to use this capability to better align platform behavior with their specific research context.

### Cybersecurity measures

Discovery cybersecurity architecture is designed around a defense-in-depth model. The controls span identity, network, data, compute, and operational security. The following items describe the active measures in place for this release:

- **Identity and access management:** Discovery enforces least-privilege access by using Microsoft Entra ID and RBAC. All control-plane and data-plane access is authenticated through Microsoft Entra ID. User-assigned managed identities (UAMIs) are used for platform components to access Azure resources without embedded secrets. Platform-specific RBAC roles support separation of duties between operators, developers, and security administrators.
- **Network security:** Discovery uses a private-by-default network architecture. All Discovery resources are created with Azure Private Link enabled by default, which eliminates public IP exposure. Data-plane APIs have public network access disabled at the resource level. Traffic is restricted to customer VNets by using private endpoints, private DNS zones, and network security groups. This architecture supports zero-trust networking principles and reduces the platform's overall attack surface.
- **Data protection:** Customer data is protected through encryption and tenant isolation. Encryption at rest is provided by Azure-managed encryption for storage and platform services. Encryption in transit is enforced by using HTTPS and Transport Layer Security (TLS) for all service-to-service and client-to-service communication. Customer data, knowledge graphs, and models are tenant-isolated and aren't shared across customers. Customers retain full ownership and control of their data and can export or remove assets at any time.
- **Platform hardening:** Discovery compute infrastructure is hardened by using Azure security baselines. Supercomputer clusters and node pools are deployed on Azure-managed infrastructure following Azure security configuration standards. Platform reviews track compliance with Microsoft cloud security benchmark requirements, including TLS configuration, diagnostic logging, and private endpoint usage. Continuous security reviews identify configuration gaps and drive remediation through infrastructure updates and policy enforcement.
- **Logging, monitoring, and detection:** Discovery integrates with Azure monitoring and security tooling to support detection and response. You can enable diagnostic logs on platform resources and route to customer-managed logging solutions. Connectivity and availability are monitored by using proactive health checks and platform telemetry. Security findings and configuration drift are reviewed as part of ongoing platform security assessments.
- **Secure development and compliance:** Discovery follows the Microsoft Secure Development Lifecycle (SDL) and a continuous compliance model. Security bugs, vulnerabilities, and SDL requirements are tracked centrally and reviewed on an ongoing basis.

  Discovery participates in Azure's continuous SDL and vulnerability management programs, which support external compliance audits including SOC, ISO, and other Azure certifications. This approach ensures that security is continuously evaluated rather than assessed only at release time.

### Shared responsibility

Security in Discovery follows the Azure shared responsibility model. Discovery secures the underlying platform, managed services, and control plane. Customers are responsible for securing their subscriptions, VNets, role assignments, and data access policies. Understanding this division of responsibility is important for customers who want to design secure deployments aligned with their organizational and compliance requirements.

## Best practices for integrating and deploying Discovery

Responsible AI is a shared commitment between Microsoft and its customers. Microsoft builds AI applications with safety, fairness, and transparency at the core, but customers play a critical role in deploying and using these technologies responsibly within their own contexts. To support this partnership, we offer the following best practices for deployers and users to help customers implement responsible AI effectively.

### Best practices for deployers and users

- **Exercise caution and monitor outcomes when you use Discovery for consequential decisions or in sensitive domains:** Consequential decisions might have a legal or significant effect on a person's access to education, employment, financial platforms, government benefits, healthcare, housing, insurance, or legal platforms. They could also result in physical, psychological, or financial harm.

  Sensitive domains require particular care because of the potential for disproportionate impact on different groups of people. When you use AI for decisions in these areas, make sure that affected stakeholders can understand how decisions are made, appeal decisions, and update any relevant input data.
- **Evaluate legal and regulatory considerations:** You need to evaluate potential specific legal and regulatory obligations when you use any AI platforms and solutions, which might not be appropriate for use in every industry or scenario. AI platforms or solutions aren't designed for and can't be used in ways that are prohibited in applicable terms of service and relevant codes of conduct.

### Best practices for users

**Use clear, specific prompts:** Ensure that prompts are explicit about your goal, the scope of the task, and what evidence to use. A clear and effective prompt typically includes:

- Objective (what you're trying to learn or decide).
- Context (domain assumptions, constraints, and success criteria).
- Sources to use (which knowledge base, documents, or tools to reference).
- Output format (such as table, ranked list, and experiment plan).
- Grounding request (request citations or traceability when available).

#### Example prompt

Using your indexed knowledge-base documents on \<TOPIC>, propose three testable hypotheses for \<RESEARCH GOAL>. For each hypothesis: (a) summarize the supporting evidence, (b) cite the specific sources used, and (c) list two to three experiments to validate it. If evidence is missing or weak, say so explicitly and suggest what other data is needed.

 - **Monitor for performance drift:** Output quality and groundedness depend on the data available for grounding and how agents or tools are configured. Results might change as your knowledge base, tools, or workflows evolve. To detect drift:

   - Rerun a small set of benchmark prompts periodically and compare outputs for consistency, completeness, and grounding.
   - Watch for warning signs such as fewer or weak citations, increased uncertainty, contradictory conclusions, or missing key constraints.
   - If you update the knowledge base (add or remove documents), treat that as a *version change* and recheck critical workflows.
   - Use human review and a second method of validation for high-impact work (domain expert review, independent calculation or simulation, or controlled test runs).

- **Exercise human oversight when appropriate:** Human oversight is an important safeguard when you interact with AI applications. We continuously improve our AI applications, but AI might still make mistakes. The outputs generated might be inaccurate, incomplete, biased, misaligned, or irrelevant to your intended goals.

  This situation could happen because of various reasons, such as ambiguity in the inputs or limitations of the underlying models. You should review the responses generated by Discovery and verify that they match your expectations and requirements.
- **Understand the risk of overreliance:** Overreliance can occur when users accept incorrect or incomplete AI outputs, mainly because mistakes in AI outputs might be hard to detect. These inaccurate outputs are usually a result of when the underlying evidence is incomplete or not clearly grounded. With Discovery, this risk can increase in long, iterative workflows (where small errors can compound) and in scenarios where knowledge base coverage is limited. Treat outputs as decision support, not decision replacement, especially for consequential decisions.
- **Exercise caution when you design agentic AI in sensitive domains:** If you design or deploy autonomous or agentic workflows that can trigger irreversible or high-impact actions (for example, in regulated or safety-critical domains), you need to add safeguards. You might need to use approval gates, least-privilege access, audit logs, or constrained-action scopes. Ensure that affected stakeholders can understand how outcomes were reached and can challenge or appeal decisions where applicable.

  You should also take other precautions when you create autonomous agentic AI as described further in either the Microsoft Enterprise AI Services Code of Conduct (for organizations) or the Code of Conduct section in the Microsoft Services Agreement (for individuals).
- **Provide feedback to help improve Microsoft Discovery:** If you encounter issues or want to share feedback, in Discovery Studio, select **Give Feedback** in the lower-right corner. You can describe what happened and include relevant details on the feedback form. Submit the form to send feedback to the Discovery team.

### Best practices for deployers

- **Use the reference sample agent as a baseline for grounded agent design:** Discovery provides a reference sample agent in the GitHub repository. The agent demonstrates recommended patterns for querying customer knowledge bases, enforcing grounding constraints, and handling cases where evidence is missing or weak.

  The sample illustrates how to scope retrieval to relevant sources and require explicit citations or traceability. It also shows how to reduce the risk of ungrounded or speculative outputs when you work with customer‑provided data.
- **Adapt and extend the sample based on domain, data, and risk context:** Treat the reference sample agent as a starting point rather than a production‑ready solution. When you build custom agents and workflows, you're encouraged to tailor retrieval logic, grounding requirements, validation steps, and human‑in‑the‑loop review. Base your agents and workflows on your specific domain, data structure, and risk profile. This approach is important for high‑impact or long‑running agentic workflows.
- **Implement strong identity and access controls (least privilege):** Discovery uses Microsoft Entra ID authentication and RBAC. You should mirror that model by granting only the minimum roles that are needed for each user or workload. Avoid broad owner or subscription-wide permissions, except when necessary. Prefer scoped roles at the resource group or resource level. Use UAMIs for service-to-service access so that you don't rely on embedded secrets. Periodically review role assignments.
- **Harden network posture and keep resources private-by-default:** Discovery is designed with Private Link enabled by default. Public network access is disabled for data-plane APIs. You should maintain this posture. Restrict access to trusted VNets and use private endpoints, private Domain Name System zones, and network security groups.

  Where your organization requires extra ring-fencing, you can deploy a network security perimeter after the platform infrastructure is deployed. The perimeter further protects dependent platform-as-a-service (PaaS) services (for example, Azure Cosmos DB, Azure SQL, Azure Key Vault, and Storage accounts). Reducing public exposure lowers the attack surface and helps protect against stolen credentials being used from untrusted network locations.
- **Keep safety controls enabled and validate any safety-threshold changes:** Discovery applies Foundry guardrails/content filtering by default for models created within the platform, and attempts to bypass or disable built-in safety mechanisms are prohibited. You can create and manage guardrails in the Foundry portal, including configuring safety thresholds and monitoring agent behavior.

  If you change thresholds or customize filters, test those changes with representative prompts before they roll out broadly. For example, for this release, the content filter configuration includes input/output filtering thresholds (for example, violence/hate/sexual at Medium and self-harm at High) and enables models like jailbreak and protected-material detection. Changing these settings might affect both user experience and safety outcomes. For more information, see the [Azure AI Content Safety documentation](/azure/ai-services/content-safety).
- **Test for safety, grounding, and toolchain reliability before scaling access:** Discovery is evaluated by using a structured prompt suite across risk categories (copyright/IP, harmful content, jailbreak attempts, and groundedness). Benchmarking is used to detect regressions over time. You should adopt a similar practice for your most important workflows.

  Create a small set of *golden* end-to-end scenarios that reflect your intended use cases. Include your own tools, models, and knowledge base content. Rerun the scenarios whenever you change models, tools, agents, or datasets. Because mismatches in tool assumptions (formats, parameter ranges, and versioning) can cause failures or misleading results, validate orchestration workflows carefully.

  This practice is especially important when you onboard custom or non-Microsoft components. For higher-impact scenarios, require human review and an independent method of validation. For example, use domain expert review or controlled test runs.
- **Enable logging and continuously monitor for drift:** Discovery supports logging/monitoring by allowing diagnostic logs to be enabled and routed to customer-managed logging solutions. Discovery uses proactive health checks and telemetry to track connectivity and availability. You should enable these logs, set up alerts for repeated failures or abnormal error patterns, and periodically review security findings and configuration drift as part of ongoing platform security assessments.

  For performance and output-quality drift, treat changes to the knowledge base, tools, workflows, or agents as version changes. Rerun a small benchmark set to compare consistency, completeness, and grounding. Warning signs include fewer or weaker citations, increased uncertainty, contradictory conclusions, or missing key constraints. Use these signals to trigger deeper review and remediation.

## Learn more about Discovery

For more guidance on the responsible use of Discovery, we recommend that you review the Responsible Use Guide, which outlines key principles for deploying AI-powered features. You can learn more here:

- [Microsoft Discovery Data Privacy and Security](concept-network-security.md)
- [Microsoft Discovery FAQ](faq.yml)

Learn more about responsible AI:

- [Microsoft AI principles](https://www.microsoft.com/ai/responsible-ai)
- [Microsoft responsible AI resources](https://www.microsoft.com/ai/tools-practices)
- [Microsoft Azure Learning courses on responsible AI](/training/paths/responsible-ai-business-principles/)
