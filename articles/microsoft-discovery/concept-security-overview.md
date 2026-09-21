---
title: Security and compliance overview for Microsoft Discovery
description: Understand the security and compliance posture of Microsoft Discovery, including the shared responsibility model, and how the platform maps to standardized security questionnaire domains.
author: yousefi-msft
ms.author: yousefi
ms.service: azure
ms.topic: concept-article
ms.date: 09/05/2026
ms.custom: security, compliance
#CustomerIntent: As a security reviewer or deployer, I want to understand the security and compliance posture of Microsoft Discovery so that I can complete a security assessment and deploy the platform safely.
---

# Security and compliance overview for Microsoft Discovery

Microsoft Discovery is an enterprise agentic AI platform for scientific research that's built on Azure's enterprise cloud infrastructure. Because it runs on Azure, Microsoft Discovery is designed to operate within the security, compliance, transparency, and governance frameworks that organizations use to manage sensitive research and development (R&D) environments.

This article gives security reviewers, architects, and deployers a single starting point for evaluating Microsoft Discovery. It summarizes the platform's security controls, explains the shared responsibility model, and maps the platform's capabilities to the risk domains of the Shared Assessments **Standardized Information Gathering (SIG)** questionnaire, a commonly used questionnaire for third-party risk assessments. Use it to guide a security review, then follow the linked articles for authoritative, control-level detail. For question-level answers organized by SIG domain, see the [SIG-based security and compliance FAQ](faq-security-compliance-sig.yml).

> [!IMPORTANT]
> This article is provided **for informational purposes only**. It doesn't constitute a certification, attestation, audit, or guarantee of compliance, and it doesn't imply that Microsoft Discovery is certified or independently audited against any framework referenced here. For the current, authoritative list of Microsoft certifications, audit reports, and control implementation details, use the [Microsoft Trust Center](https://www.microsoft.com/trust-center) and the [Service Trust Portal](https://servicetrust.microsoft.com/).

## Deployment and trust boundary

Microsoft Discovery deploys resources into your own Azure subscription and Microsoft Entra tenant, not a Microsoft-managed subscription. When you provision a workspace, supercomputer, or bookshelf, the service creates a [managed resource group](/azure/azure-resource-manager/managed-applications/overview) (MRG) in your subscription that holds the backend resources it operates on your behalf.

This deployment model has direct security implications:

- Customer data and the resources that store it stay within your subscription and tenant boundary.
- You own identity, network, and access-control configuration for the surrounding environment.
- You pay for and govern the underlying Azure resources, and you can apply your own Azure Policy, logging, and monitoring.

For the resource model and data flow, see [Service architecture overview](overview-service-architecture.md).

## Shared responsibility model

Security in Microsoft Discovery follows the [Azure shared responsibility model](/azure/security/fundamentals/shared-responsibility). The following table shows how that model applies to a Discovery deployment specifically, given that resources land in your subscription.

| Responsibility | Microsoft | Customer |
| --- | --- | --- |
| Physical and platform security of Azure datacenters | Responsible | Not responsible |
| Control plane and managed service operation | Responsible | Not responsible |
| Encryption of data at rest (default keys) and in transit on the Azure backbone | Responsible | Not responsible |
| Built-in AI safety controls (content filtering, system safeguards) | Responsible | Not responsible |
| Subscription, virtual network, and firewall configuration | Not responsible | Responsible |
| Identity governance and least-privilege role assignments | Not responsible | Responsible |
| Customer-managed keys (if chosen), Key Vault, and key lifecycle | Not responsible | Responsible |
| Data classification and protecting data before ingestion | Not responsible | Responsible |
| Enabling audit logging, retention, and monitoring in your subscription | Not responsible | Responsible |
| Business continuity and replication of stateful resources | Not responsible | Responsible |

For AI-specific responsibilities, see [Responsible AI in Microsoft Discovery](concept-responsible-ai.md#shared-responsibility).

## SIG questionnaire domain map

The Shared Assessments Standardized Information Gathering (SIG) questionnaire organizes third-party risk questions into risk domains. The following table maps each SIG risk domain to how Microsoft Discovery addresses it and where to find authoritative detail, so you can complete a SIG Lite or SIG Core assessment efficiently. Domains satisfied by inherited Azure platform controls point to the central sources of truth.

| SIG risk domain | How Microsoft Discovery addresses it | Reference |
| --- | --- | --- |
| Enterprise Risk Management | Operated under Microsoft enterprise governance with centralized management, audit trails, and human-oversight checkpoints. | [Microsoft Trust Center](https://www.microsoft.com/trust-center) |
| Cloud Services | Delivered as an Azure service; resources deploy into your own subscription and tenant under the Azure shared responsibility model. | [Service architecture](overview-service-architecture.md), [Shared responsibility](#shared-responsibility-model) |
| Compliance Management | Built on Azure; inherits Azure platform compliance. Certifications and audit reports are published centrally. | [Trust Center](https://www.microsoft.com/trust-center), [Service Trust Portal](https://servicetrust.microsoft.com/) |
| Access Control | Microsoft Entra ID authentication, Azure RBAC, built-in and project-level roles, and least-privilege managed identities. | [Role assignments](concept-role-assignments.md), [Project-level access control](concept-project-rbac.md) |
| Application Security / Application Management | Developed under Microsoft's Security Development Lifecycle; you secure the custom agents and tools you build. | [Responsible AI best practices](concept-responsible-ai.md#best-practices-for-deployers) |
| Artificial Intelligence | Foundry Guardrails content filtering, prohibited-use policy, grounding and citations, and RAI evaluations. | [Responsible AI](concept-responsible-ai.md), [Code of conduct](concept-code-of-conduct.md) |
| Asset and Information Management | Data stored in your subscription through storage containers and assets; you own data classification. | [Data handling](how-to-data-handling-with-tools-agents.md), [Storage assets](concept-storage-containers-assets.md) |
| Information Assurance | Encryption at rest by default (Microsoft-managed keys) with optional customer-managed keys; key isolation from operators. | [Data encryption at rest](concept-data-encryption-at-rest.md) |
| Server Security | Backend runs on Azure managed services; platform hardening and patching handled as part of Azure operations. | [Service Trust Portal](https://servicetrust.microsoft.com/) |
| Endpoint Security | No customer endpoints in the managed data plane; access is through Entra ID-secured interfaces and APIs. | [Network security](concept-network-security.md) |
| Network Security | Network Security Perimeters, private endpoints, virtual network injection, and private-by-default data-plane access. | [Network security](concept-network-security.md) |
| IT Operations Management | Application, activity, and customer-configurable audit logs through Azure Monitor, with correlation-ID tracing. | [Observability](concept-observability.md), [Enable audit logging](how-to-enable-audit-logging.md) |
| Incident Management | End-to-end correlation IDs for tracing; platform incident response and breach notification handled centrally. | [Correlation IDs](concept-observability.md#correlation-ids), [Trust Center](https://www.microsoft.com/trust-center) |
| Cybersecurity / Threat Management | Runs on Azure managed services that inherit Azure threat detection and security operations. | [Azure security fundamentals](/azure/security/fundamentals/overview) |
| Operational Resilience | Multiregion service architecture; customers replicate their own stateful resources for disaster recovery. | [Business continuity and disaster recovery](concept-discovery-business-continuity-disaster-recovery.md) |
| Physical and Environmental Security | Provided by Azure datacenters and independently audited as part of the Azure platform. | [Service Trust Portal](https://servicetrust.microsoft.com/) |
| Human Resources Security | Microsoft personnel screening, training, and access governance operated and documented centrally. | [Service Trust Portal](https://servicetrust.microsoft.com/) |
| Supply Chain Risk Management / Nth-Party Management | Built on named Azure services; subprocessor list and supply-chain assurance published centrally. | [Trust Center](https://www.microsoft.com/trust-center/privacy) |
| Privacy Management | Resources deploy in your subscription; control-plane regions and cross-region data-plane deployment support residency. | [Data residency](#data-residency), [Trust Center privacy](https://www.microsoft.com/trust-center/privacy) |

> [!NOTE]
> The SIG questionnaire also includes an Environmental, Social, and Governance (ESG) domain. Microsoft addresses ESG at the corporate level; see the [Microsoft Trust Center](https://www.microsoft.com/trust-center) and Microsoft sustainability and corporate responsibility resources rather than the Microsoft Discovery product documentation.

## Control framework mappings

If your organization standardizes on a framework other than SIG, don't rebuild a crosswalk from this documentation. Microsoft publishes framework mappings, certification scopes, and audit evidence centrally. See [Compliance guidance for Microsoft Discovery](concept-compliance-framework-mappings.md) for information about which controls you assess in Discovery, which controls you inherit from Azure, and which authoritative source answers each question.

## Identity and access management

Microsoft Discovery authenticates users through Microsoft Entra ID and authorizes actions through [Azure RBAC](/azure/role-based-access-control/overview). What's specific to Discovery is the role model: built-in platform roles (such as Platform Administrator, Platform Contributor, and Platform Reader), project-level roles that isolate investigations, and resource-specific roles for least-privilege access.

Service-to-service access uses [user-assigned managed identities](/entra/identity/managed-identities-azure-resources/overview) that you create and control in your own subscription, rather than secrets or connection strings. Discovery defines distinct identity slots, so you can assign separate identities with scoped roles and keep agent tool execution limited to the permissions it needs.

Learn more:

- [Role assignments in Microsoft Discovery](concept-role-assignments.md)
- [Managed identities in Microsoft Discovery](concept-managed-identities.md)
- [Project-level access control](concept-project-rbac.md)

## Data protection and encryption

Microsoft Discovery uses [Azure data encryption at rest](/azure/security/fundamentals/encryption-atrest), enabled automatically and transparently. The Discovery-specific decision is the key model:

- **Microsoft-managed keys (default):** no customer action required.
- **Customer-managed keys (CMK):** available for workspace, supercomputer, and bookshelf resources. You must choose CMK at resource creation time; the model can't be changed afterward.

Service operators, engineers, and support personnel can't access encryption keys. For more information, see [Data encryption at rest](concept-data-encryption-at-rest.md).

## Network security

Microsoft Discovery layers three Azure networking controls, and enables network hardening by default for workspaces and bookshelves managed with the `2026-02-01-preview` API version and later:

- [Network security perimeters](/azure/private-link/network-security-perimeter-concepts) restrict managed resources so that only authorized Discovery components can reach them.
- [Private endpoints](/azure/private-link/private-link-overview) route workspace and bookshelf data-plane API traffic over the Microsoft backbone.
- **Virtual network injection** runs workspace platform services and agents inside your virtual network, in subnets you provision and delegate.

> [!IMPORTANT]
> Network security perimeters aren't yet available in all regions and for all Azure resource types. Ensure that your deployment is in a region that supports [network security perimeters](/azure/private-link/network-security-perimeter-concepts).

For deployment-specific network requirements and configuration guidance, see [Network security](concept-network-security.md), [Virtual networks and subnets](concept-virtual-networks.md), and [End-to-end network-hardened deployment](how-to-deploy-network-hardened-stack.md).

## Logging, monitoring, and auditing

Microsoft Discovery integrates with [Azure Monitor](/azure/azure-monitor/overview) and surfaces three categories of logs:

- **Application logs** are collected automatically in a dedicated Log Analytics workspace inside each resource's MRG.
- **[Activity logs](/azure/azure-monitor/essentials/activity-log)** record control-plane operations on Discovery resources.
- **Audit logs** are opt-in through [diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings) and export to a storage account or Log Analytics workspace that you own, for long-term retention.

Correlation IDs let you trace an operation end to end across platform components. For more information, see [Observability](concept-observability.md) and [Enable audit logging](how-to-enable-audit-logging.md).

## AI safety and responsible AI

Microsoft Discovery follows the [Microsoft Responsible AI Standard](https://aka.ms/RAI). Safety controls include Foundry Guardrails content filtering applied by default to models created in Discovery, grounding with citations, and system-level safeguards. The platform enforces a prohibited-use policy (for example, no weapons development and no bypassing safety systems) and is evaluated for safety and groundedness before each release.

For more information, see [Responsible AI in Microsoft Discovery](concept-responsible-ai.md), [Platform card](concept-platform-card.md), and [Code of conduct](concept-code-of-conduct.md).

## Business continuity and disaster recovery

Microsoft Discovery uses a highly available, multiregion architecture designed to avoid single points of failure in its service components. The service doesn't automatically replicate customer state between regional deployments, so you replicate your own stateful resources to meet your recovery objectives. For more information, see [Business continuity and disaster recovery](concept-discovery-business-continuity-disaster-recovery.md).

## Data residency

The Microsoft Discovery control plane is available in East US, Sweden Central, and UK South. Managed resource group (data-plane) resources can be deployed in other regions through cross-region deployment, which can help you meet data-residency or capacity requirements. You select the Azure regions for these data-plane resources in your subscription. For the current, authoritative statement of Microsoft data-residency and data-handling commitments, see the [Microsoft Trust Center](https://www.microsoft.com/trust-center/privacy) and your applicable Microsoft product terms.

## Compliance and certifications

Microsoft Discovery is built on Azure and inherits the security operations and compliance posture of the Azure platform and the managed services it uses (such as Azure Storage, Azure Kubernetes Service, Azure AI Search, and Azure Key Vault). Microsoft publishes its certifications, audit reports (for example, SOC and ISO), and control mappings centrally rather than per service.

To evaluate compliance for your scenario:

- Review the [Microsoft Trust Center](https://www.microsoft.com/trust-center) for compliance offerings and how they apply to Azure services.
- Download audit reports and control documentation from the [Service Trust Portal](https://servicetrust.microsoft.com/).
- Use [Compliance guidance](concept-compliance-framework-mappings.md) to separate the controls you assess in Discovery from the controls you inherit from Azure.

## Related content

- [Compliance guidance](concept-compliance-framework-mappings.md)
- [Network security](concept-network-security.md)
- [Virtual networks and subnets](concept-virtual-networks.md)
- [Data encryption at rest](concept-data-encryption-at-rest.md)
- [Managed identities](concept-managed-identities.md)
- [Role assignments](concept-role-assignments.md)
- [Observability](concept-observability.md)
- [Responsible AI in Microsoft Discovery](concept-responsible-ai.md)
- [Business continuity and disaster recovery](concept-discovery-business-continuity-disaster-recovery.md)
- [SIG-based security and compliance FAQ](faq-security-compliance-sig.yml)
