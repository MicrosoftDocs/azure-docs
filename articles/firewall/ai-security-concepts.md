---
title: Azure Firewall AI Security concepts (preview)
description: Learn how the Azure Firewall AI Security add-on relates to Firewall Premium, security profiles, application rules, and policy analysis.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: concept-article
ms.custom: references_regions
ms.date: 11/04/2026
# Customer intent: As a network security administrator, I want to understand the Azure Firewall AI Security configuration model so that I can choose the right protection and identify the setup it requires.
---

# Azure Firewall AI Security concepts (preview)

Azure Firewall AI Security is an optional add-on for Azure Firewall Premium, currently in public preview. It adds capabilities for inspecting AI traffic, analyzing files and application requests, protecting sensitive data, and generating policy insights.

The add-on doesn't replace the Basic, Standard, or Premium SKU. It extends a Premium deployment with protection settings and policy analysis that you configure for your workloads.

> [!IMPORTANT]
> Azure Firewall AI Security is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Relationship to Azure Firewall Premium

Azure Firewall Premium provides capabilities such as TLS inspection and signature-based intrusion detection and prevention. AI Security adds protection capabilities through a separately enabled add-on.

Enabling the add-on and selecting traffic for inspection are different parts of the configuration. Enabling the add-on alone doesn't establish that a flow was inspected. Traffic must also match the applicable rules and protection configuration.

For the underlying Premium capabilities, see [Azure Firewall Premium features](premium-features.md).

## Capabilities

Each capability addresses a different protection or operations task.

| Capability | Purpose | Guidance |
| --- | --- | --- |
| Prompt Threat Protection | Detect direct and indirect prompt injection attempts in supported AI traffic, with an option to block detections. | [Configure Prompt Threat Protection](configure-prompt-threat-protection.md) |
| Advanced Malware Threat Protection | Analyze supported files transferred through scoped application traffic and apply alert or deny thresholds. | [Configure malware protection](configure-malware-protection.md) |
| Advanced Application Threat Protection | Analyze eligible application requests for exploit attempts and apply alert or deny thresholds. | [Configure application threat protection](configure-application-threat-protection.md) |
| Network data loss prevention (DLP) | Use Microsoft Purview classification and policy decisions to protect sensitive data in inspected traffic. | [Configure network DLP](configure-network-dlp.md) |
| Policy Advisor | Analyze policy configuration and traffic logs to surface findings, with supporting evidence, for administrator review. | [Policy Advisor in Policy Analytics](policy-analytics.md#policy-advisor) |

Traffic protection and policy analysis serve different purposes. A profile that inspects a request or file acts on selected traffic. Policy Advisor helps an administrator review policy findings; it doesn't automatically change firewall policies.

## Security profiles, groups, and application rules

A security profile contains configuration for a protection capability. A security profile group combines protection configuration so that you can associate it with application rules in Azure Firewall Policy. A group can contain at most one profile of each type.

The application rule selects the traffic. The group's protection configuration determines how that traffic is inspected and which action applies. Follow the capability-specific guide for its configuration controls and modes rather than treating mode labels as interchangeable across capabilities.

Rule processing still matters. Azure Firewall processes network rules before application rules. A matching network rule can prevent traffic from reaching the application rule associated with a security profile group. For background, see [Azure Firewall rule processing](rule-processing.md).

## Shared dependencies and deployment planning

You enable the AI Security add-on on each Azure Firewall Premium firewall. You configure security profiles and security profile groups in the firewall policy. When a policy is associated with more than one firewall, enable the add-on on every associated firewall before configuring the protections described in the capability guides.

Enabling the add-on on an existing firewall requires downtime. Plan the change as a maintenance activity before starting feature configuration.

For HTTPS inspection, the firewall must decrypt the traffic successfully, and clients must trust the inspection certificate authority. Certificate trust and rule-level TLS inspection are part of the inspection path, not optional substitutes for one another. See [Azure Firewall Premium certificates](premium-certificates.md).

Individual capabilities have additional dependencies. Prompt Threat Protection uses an Azure AI Content Safety resource that the firewall policy accesses through a managed identity. DLP requires Microsoft Purview policy configuration and a user context for policy evaluation. Policy Advisor requires Policy Analytics and has a different reader task from traffic inspection.

## Inspection examples

The following examples illustrate the distinction between enabling the add-on and applying protection. They aren't deployment procedures.

### AI application traffic

An application sends supported AI requests over HTTPS through Azure Firewall. The add-on is enabled, but inspection also depends on routing, the matching application rule, the selected protection configuration, and successful TLS inspection. An allowed request by itself isn't evidence that Prompt Threat Protection evaluated it.

### Sensitive file transfers

A workload transfers a file through a DLP-scoped application rule. The firewall configuration selects the traffic, while Microsoft Purview supplies classification and policy evaluation. The user context and Purview policy scope affect the evaluation. A completed transfer alone doesn't distinguish an allowed policy decision from traffic that wasn't evaluated.

## Availability, limits, and entitlement

AI Security is in public preview. During the preview, you configure the add-on and its protections in the Azure portal. Azure PowerShell, Azure CLI, Terraform, and the REST API aren't supported for this configuration yet.

The preview is available in the following regions:

- East Asia
- UK South
- West Central US

Inspection coverage depends on the capability, protocol, supported content, and applied configuration. Don't assume that selecting one protection enables every other protection or covers every traffic direction.

AI Security is licensed as an add-on to Azure Firewall Premium. For pricing information, see [Azure Firewall pricing](https://azure.microsoft.com/pricing/details/azure-firewall/). Review the relevant capability guide for its prerequisites and limitations.

## Related content

- [Azure Firewall Premium features](premium-features.md)
- [Azure Firewall Premium certificates](premium-certificates.md)
- [Azure Firewall rule processing](rule-processing.md)
