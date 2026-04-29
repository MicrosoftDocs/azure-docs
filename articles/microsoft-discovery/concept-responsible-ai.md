---
title: Responsible AI in Microsoft Discovery
description: Learn about responsible AI principles, safety components, limitations, and best practices for using Microsoft Discovery in scientific research.
author: leijgao
ms.author: leijiagao
ms.service: azure
ms.topic: concept-article
ms.date: 04/17/2026

#CustomerIntent: As a researcher or deployer, I want to understand responsible AI practices in Microsoft Discovery so that I can use the platform safely and effectively.
---

# Responsible AI in Microsoft Discovery

Microsoft Discovery is an enterprise agentic AI platform for scientific research and development. It uses large language models (LLMs), multi-agent orchestration, and high-performance computing (HPC) to help researchers reason through complex problems, generate hypotheses, and analyze results.

Like all AI systems, Discovery has limitations and potential risks. This article describes the responsible AI principles, safety components, known limitations, and best practices that help you use the platform effectively and responsibly.

Microsoft's approach to responsible AI follows the [Microsoft Responsible AI Standard](https://aka.ms/RAI). This standard organizes risk management into three stages: **Discover** potential risks, **Protect** against them, and **Govern** the system in production.

## Intended uses

Microsoft Discovery is designed for R&D organizations in life sciences, materials science, semiconductors, energy, manufacturing, and advanced engineering. The platform supports scenarios such as:

- **Hypothesis generation and testing**—Researchers can generate, refine, and evaluate scientific hypotheses using AI-coordinated workflows.
- **Literature synthesis**—Agents summarize and compare findings across large volumes of scientific papers.
- **Experiment design**—The platform helps design experiments with appropriate controls, parameters, and validation steps.
- **Simulation orchestration**—Discovery coordinates compute-intensive simulations across HPC clusters.
- **Data analysis**—Agents perform statistical analysis, identify patterns, and produce structured results from research data.

Discovery isn't only designed for simple, one-off queries. It's optimized for complex, multi-step research challenges that require autonomous agent orchestration over extended periods.

## Safety components

Discovery incorporates multiple layers of safety controls to protect users and research integrity.

### Content filtering

Discovery uses [Foundry Guardrails](/azure/foundry/responsible-use-of-ai-overview), Microsoft's content safety and filtering capability. These guardrails scan content at defined intervention points to detect and block unsafe or inappropriate content before it reaches the model. The platform applies guardrails by default to all models created within Discovery.

You can customize guardrails in the Foundry portal. Configuration options include:

- Defining risk categories to detect
- Adjusting severity thresholds for content filters
- Assigning guardrails to evaluate and monitor agent behavior
- Assessing model performance across different use cases

### Grounding and citations

Discovery surfaces citations and grounding sources where applicable. When responses are grounded in knowledge base documents or web sources, the platform provides hyperlinked citations. These citations help you trace the origin of generated content and assess its reliability.

Output quality depends on the structure, completeness, and relevance of your underlying knowledge base data. Sparse or poorly structured knowledge bases can lead to incomplete or insufficiently grounded responses.

### System-level safeguards

Discovery uses input classifiers, output filters, and system-level instructions aligned with [Microsoft AI principles](https://www.microsoft.com/ai/responsible-ai). System messages guide agent behavior, enforcing boundaries such as refusing to generate content that could cause physical, emotional, or financial harm.

## Known limitations

Understanding Discovery's limitations helps you use the platform within safe and effective boundaries.

### Automation bias and loop drift

Discovery supports semi-autonomous agentic workflows. This creates a risk of automation bias, where users over-trust AI-generated outputs without sufficient validation. In iterative workflows, small inaccuracies can compound over time (loop drift). Human-in-the-loop oversight is essential to keep research aligned with scientific intent.

### Representation bias

Discovery's outputs can reflect imbalances in the scientific literature or training data. The platform might overrepresent dominant research perspectives or underrepresent emerging areas. Apply domain expertise when working in novel or interdisciplinary fields where training data representation is limited.

### Temporal relevance

Scientific knowledge evolves rapidly. If Discovery relies on static or outdated datasets, it can surface obsolete findings or miss recent developments. Regularly assess the currency of your data sources, especially in fast-moving fields like synthetic biology or AI-driven drug discovery.

### Inaccurate or ungrounded outputs

When querying knowledge bases, response quality depends on how agents are configured and the quality of the underlying data. In scenarios where the knowledge base is sparse or weakly scoped, the system can produce responses that are incomplete or insufficiently grounded. Always validate AI-generated claims against trusted sources.

### Conversation saturation

As conversations become very long, answer quality can gradually decline. When the conversation approaches model context limits, earlier parts might be summarized. During this process, some details can be simplified or lost, causing answers to drift in accuracy. Starting a new conversation can restore clarity when you notice degradation.

### Tooling signal dilution

As the system gets access to a larger pool of agents and tools, its ability to choose the best ones for a given task can degrade. Actively curate the list of agents available to your project to keep them relevant to your scenarios.

### Toolchain compatibility

Discovery integrates with computational tools and models. Mismatches in tool assumptions (input formats, parameter ranges, or versioning) can lead to execution failures or misleading results. Test and validate tool orchestration workflows carefully, especially when integrating custom or third-party components.

## Prohibited uses

The following uses of Discovery are strictly prohibited:

- **Weapons development**—Discovery can't be used to support the design, development, or deployment of chemical, biological, radiological, nuclear, or other weapons intended to cause mass harm.
- **Harmful applications**—Discovery can't be used in ways that could cause physical, psychological, environmental, or financial harm to individuals, organizations, or society.
- **Violation of laws or regulations**—Discovery can't be used in any manner that violates applicable laws, regulations, or industry-specific compliance requirements.
- **Bypassing safety systems**—Attempts to circumvent, disable, or interfere with Discovery's built-in safety mechanisms, classifiers, or content filters are strictly prohibited.

## Evaluations

Microsoft evaluates Discovery using manual, custom evaluations grounded in the Responsible AI (RAI) evaluation framework from Microsoft AI Foundry. Evaluations target two dimensions: safety and groundedness.

### Safety evaluation

Safety evaluation assesses whether Discovery appropriately refuses, deflects, or responds safely when prompts attempt to elicit disallowed content or bypass system safeguards. Metrics include:

- Policy compliance score
- Risk detection and mitigation effectiveness
- Content safety classification accuracy
- Direct and indirect jailbreak resistance rate

### Groundedness evaluation

Groundedness evaluation assesses whether Discovery stays faithful to provided context and retrieved sources. Metrics include:

- Ungrounded attributes defect rates
- Groundedness defect rates

Each release is benchmarked against Foundry-provided baseline model behavior and historical results from prior releases. This comparative approach detects regressions and validates stability over time.

## Best practices for end users

Follow these best practices to get reliable, well-grounded results from Discovery.

### Write clear, specific prompts

Effective prompts include:

- **Objective**—What you're trying to learn or decide
- **Context**—Domain assumptions, constraints, and success criteria
- **Sources**—Which knowledge base, documents, or tools to reference
- **Output format**—Table, ranked list, experiment plan, or other structure
- **Grounding request**—Ask for citations and traceability when available

For detailed guidance, see [Write effective prompts for agents](how-to-prompt-engineering.md).

### Monitor for performance drift

Output quality can change as your knowledge base, tools, or workflows evolve. To detect drift:

- Rerun a small set of benchmark prompts periodically and compare outputs for consistency and grounding.
- Watch for warning signs: fewer or weaker citations, increased uncertainty, contradictory conclusions, or missing constraints.
- Treat knowledge base updates (adding or removing documents) as version changes and recheck critical workflows.

### Exercise human oversight

AI outputs can be inaccurate, incomplete, or misaligned with your goals. Review Discovery's responses and verify they match your expectations. Don't accept outputs without validation, especially for consequential decisions.

### Avoid overreliance

Overreliance occurs when users accept incorrect AI outputs because mistakes are hard to detect. This risk increases in long iterative workflows and in scenarios with limited knowledge base coverage. Treat outputs as decision support, not decision replacement.

## Best practices for deployers

Deployers have extra responsibilities for safe and effective Discovery use.

### Use the reference sample agent

Discovery provides a reference sample agent in its GitHub repository. This sample demonstrates recommended patterns for querying knowledge bases, enforcing grounding constraints, and handling cases where evidence is missing. Use it as a starting point when you build custom agents and workflows.

### Implement least-privilege access

Discovery uses Microsoft Entra ID authentication and role-based access control (RBAC). Grant only the minimum roles needed for each user or workload. Avoid broad "Owner" or subscription-wide permissions. Use user-assigned managed identities for service-to-service access and periodically review role assignments.

### Maintain private-by-default network posture

Discovery enables Azure Private Link by default and disables public network access for data-plane APIs. Maintain this posture by restricting access to trusted virtual networks (VNets). Use private endpoints, private DNS zones, and network security groups (NSGs) to reduce your attack surface.

### Keep safety controls enabled

Discovery applies Foundry Guardrails by default. If you change thresholds or customize filters, test those changes with representative prompts before scaling access. Disabling safety mechanisms is prohibited except for managed customers who have received explicit approval.

### Test before scaling access

Create a small set of end-to-end test scenarios that reflect your intended use cases, including your own tools, models, and knowledge base content. Rerun these tests whenever you change models, tools, agents, or datasets.

### Enable logging and monitoring

Enable diagnostic logs and route them to your logging solutions. Set up alerts for repeated failures or abnormal error patterns. Periodically review security findings and configuration drift as part of ongoing platform security assessments. For more information, see [Configure network security](how-to-configure-network-security.md).

## Shared responsibility

Security in Discovery follows the Azure shared responsibility model. Microsoft secures the underlying platform, managed services, and control plane. You're responsible for securing your subscriptions, VNets, role assignments, and data access policies.

## Related content

- [What is Microsoft Discovery?](overview-what-is-microsoft-discovery.md)
- [Responsible use of AI overview for Microsoft Foundry](/azure/foundry/responsible-use-of-ai-overview)
- [Microsoft AI principles](https://www.microsoft.com/ai/responsible-ai)
- [Microsoft responsible AI resources](https://www.microsoft.com/ai/tools-practices)
