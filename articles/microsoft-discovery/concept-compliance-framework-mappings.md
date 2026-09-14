---
title: Compliance guidance for Microsoft Discovery
description: Learn which controls you assess in your own Microsoft Discovery deployment, which controls you inherit from Azure, and where Microsoft publishes authoritative control framework mappings.
author: yousefi-msft
ms.author: yousefi
ms.service: azure
ms.topic: concept-article
ms.date: 09/05/2026
ms.custom: security, compliance
#CustomerIntent: As a security reviewer, I want to know which Microsoft Discovery controls I must assess myself and which authoritative Microsoft sources cover the rest so that I can complete a compliance review without duplicating platform-level analysis.
---

# Compliance guidance for Microsoft Discovery

A compliance review of Microsoft Discovery has two parts: the controls that Discovery implements as a product, and the controls that Discovery inherits from Azure. This article covers the first part and points you to Microsoft's authoritative sources for the second.

Microsoft already publishes framework crosswalks, audit reports, and certification scopes centrally, and those sources are updated as certifications change. This article doesn't restate them.

> [!IMPORTANT]
> This article is provided **for informational purposes only**. It doesn't constitute a certification, attestation, audit, or guarantee of compliance, and it doesn't imply that Microsoft Discovery is certified or independently audited against any framework referenced here. For the current, authoritative list of Microsoft certifications, audit reports, and control implementation details, use the [Microsoft Trust Center](https://www.microsoft.com/trust-center) and the [Service Trust Portal](https://servicetrust.microsoft.com/).

## Where to find authoritative mappings

Don't rebuild framework crosswalks from Discovery documentation. Use the source that owns each question.

| What you need | Authoritative source |
| --- | --- |
| Certifications and audit reports (ISO/IEC 27001, SOC 1/2/3, FedRAMP, PCI DSS, and others) and their scope | [Service Trust Portal](https://servicetrust.microsoft.com/) |
| How Azure services map to a specific standard or regulation | [Microsoft compliance offerings](/compliance/regulatory/offering-home), [Azure compliance documentation](/azure/compliance/) |
| Prescriptive Azure security controls, and their mappings to CIS Controls, NIST SP 800-53, and PCI DSS | [Microsoft Cloud Security Benchmark](/security/benchmark/azure/introduction), [MCSB control domains](/security/benchmark/azure/overview-mcsb-v1), [MCSB mapping to CIS Controls](/security/benchmark/azure/mcsb-v2-cis-controls-mapping) |
| Continuous measurement of your own deployed Azure resources against a framework | [Regulatory compliance in Microsoft Defender for Cloud](/azure/defender-for-cloud/regulatory-compliance-dashboard), [Microsoft Purview Compliance Manager](/purview/compliance-manager) |
| Division of security duties between Microsoft and you | [Azure shared responsibility model](/azure/security/fundamentals/shared-responsibility) |
| Secure architecture and governance design guidance | [Well-Architected Framework security pillar](/azure/well-architected/security/), [Cloud Adoption Framework](/azure/cloud-adoption-framework/overview) |
| Privacy commitments, subprocessors, and data-protection terms | [Microsoft Trust Center privacy](https://www.microsoft.com/trust-center/privacy) |

## What you assess in Discovery versus what you inherit

Microsoft Discovery deploys resources into **your** Azure subscription and Microsoft Entra tenant. That deployment model determines which side of the review each control falls on.

| Control area | Where to assess it |
| --- | --- |
| Datacenter physical and environmental security, platform hardening and patching, Microsoft personnel screening, platform incident response, subprocessors | Inherited from Azure. Use the [Service Trust Portal](https://servicetrust.microsoft.com/). |
| Encryption algorithms and platform key management, Azure identity platform, Azure networking primitives | Inherited from Azure. Use [Azure security fundamentals](/azure/security/fundamentals/overview) and MCSB. |
| Discovery role model, project isolation, managed identity design, network hardening defaults, log categories, AI safety controls | Assess in Discovery. See [Discovery-specific control evidence](#discovery-specific-control-evidence). |
| Subscription and tenant configuration, role assignments, key lifecycle, network topology, log retention, data classification, replication | Your responsibility. See [Security and compliance overview](concept-security-overview.md). |
| Agents, tools, container images, and prompts that you author | Your responsibility. See [Data handling with tools and agents](how-to-data-handling-with-tools-agents.md). |

## Discovery-specific control evidence

These are the control decisions that are specific to Microsoft Discovery and that a reviewer can't answer from Azure platform documentation. Capture them as evidence in whichever framework or questionnaire your organization uses.

| Control area | Discovery-specific evidence to capture | Reference |
| --- | --- | --- |
| Deployment and trust boundary | Resources deploy to your subscription and tenant; a managed resource group holds backend resources; the control plane runs in East US, Sweden Central, and UK South, with cross-region data-plane deployment available. | [Security and compliance overview](concept-security-overview.md), [Service architecture](overview-service-architecture.md) |
| Identity and access | Discovery built-in platform roles, project-level roles that isolate investigations, and the identity slots that require user-assigned managed identities rather than secrets. | [Role assignments](concept-role-assignments.md), [Project-level access control](concept-project-rbac.md), [Managed identities](concept-managed-identities.md) |
| Encryption at rest | Microsoft-managed keys by default; customer-managed keys available for workspace, supercomputer, and bookshelf resources, and selectable only at resource creation time. | [Data encryption at rest](concept-data-encryption-at-rest.md) |
| Network security | Network hardening on by default from API version `2026-02-01-preview`; private endpoints for workspace and bookshelf data-plane APIs; virtual network injection through delegated subnets; the scope of the NSP Perimeter Joiner custom role. | [Network security](concept-network-security.md), [Virtual networks](concept-virtual-networks.md) |
| Logging and audit | Application logs collected automatically in the managed resource group; activity logs for control-plane operations; audit logs that you enable through diagnostic settings and route to storage you own; correlation IDs for end-to-end tracing. | [Observability](concept-observability.md), [Enable audit logging](how-to-enable-audit-logging.md) |
| AI safety | Foundry Guardrails applied by default to models created in Discovery, grounding with citations, the prohibited-use policy, human-oversight checkpoints, and pre-release safety and groundedness evaluations. | [Responsible AI](concept-responsible-ai.md), [Platform card](concept-platform-card.md), [Code of conduct](concept-code-of-conduct.md) |
| Custom agents and tools | Which container images you publish, what data your tools read and write, and what permissions their identities hold. | [Data handling with tools and agents](how-to-data-handling-with-tools-agents.md), [Tools and model integration](concept-tools-model-integration.md) |
| Operational resilience | Discovery's multiregion service architecture, and the fact that customer state isn't replicated between regional deployments automatically. | [Business continuity and disaster recovery](concept-discovery-business-continuity-disaster-recovery.md) |

For question-level answers organized by the Shared Assessments Standardized Information Gathering (SIG) risk domains, see the [SIG-based security and compliance FAQ](faq-security-compliance-sig.yml).

## AI governance frameworks

Reviews of agentic AI platforms increasingly reference AI management frameworks such as ISO/IEC 42001 and the NIST AI Risk Management Framework alongside general security controls. For those reviews, the Discovery-specific evidence is the platform's AI safety design: guardrails enabled by default, the prohibited-use policy, grounding and citation behavior, documented model limitations, and pre-release evaluations. See [Responsible AI in Microsoft Discovery](concept-responsible-ai.md) and the [Platform card](concept-platform-card.md).

For the underlying Microsoft platform guidance and program-level commitments, see [Responsible use of AI overview for Microsoft Foundry](/azure/foundry/responsible-use-of-ai-overview) and the [Microsoft Trust Center](https://www.microsoft.com/trust-center).

## Regulated data considerations

- **Cardholder data.** Discovery isn't a payment-processing system, so PCI DSS is typically out of scope for a Discovery deployment. If your scenario introduces cardholder data, treat it under your own PCI DSS program and use the Azure attestations in the [Service Trust Portal](https://servicetrust.microsoft.com/).
- **Personal data.** Microsoft's commitments as a processor are defined in the Microsoft Products and Services Data Protection Addendum. The Discovery-specific factor is placement: you choose the regions for your resources, and data stays in your subscription and tenant. See [Microsoft Trust Center privacy](https://www.microsoft.com/trust-center/privacy) and the [SIG-based security and compliance FAQ](faq-security-compliance-sig.yml).

## Related content

- [Security and compliance overview](concept-security-overview.md)
- [SIG-based security and compliance FAQ](faq-security-compliance-sig.yml)
- [Microsoft Cloud Security Benchmark](/security/benchmark/azure/introduction)
- [Microsoft compliance offerings](/compliance/regulatory/offering-home)
- [Microsoft Trust Center](https://www.microsoft.com/trust-center)
- [Service Trust Portal](https://servicetrust.microsoft.com/)
