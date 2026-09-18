---
title: What is Azure DDoS Protection custom policy? (preview)
description: Learn how Azure DDoS Protection custom policy lets you set protocol-specific detection thresholds to tune mitigation behavior for your workloads.
services: ddos-protection
author: duongau
ms.service: azure-ddos-protection
ms.topic: concept-article
ms.date: 06/25/2026
ms.author: duau
ms.custom: references_regions
# Customer intent: As a network security administrator, I want to understand Azure DDoS Protection custom policy, so that I can decide when to set protocol-specific detection thresholds instead of relying on adaptive auto-tuning.
---

# What is Azure DDoS Protection custom policy? (preview)

Azure DDoS Protection custom policy gives you more granular control over how Azure DDoS Protection detects and mitigates attacks against your protected workloads. By default, Azure DDoS Protection uses adaptive, machine learning-based auto-tuning to set detection thresholds for each protected resource. By using a custom policy, you can override that automatic behavior with fixed, application-specific detection thresholds for individual protocols.

> [!IMPORTANT]
> Azure DDoS Protection custom policy is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## When to use a custom policy

Adaptive auto-tuning works well for most workloads. Consider a custom policy when your application has predictable or unusual traffic characteristics that benefit from a fixed detection threshold, such as:

- Latency-sensitive applications that need tighter or looser mitigation triggers.
- High-throughput services with sustained high packet rates.
- Gaming platforms or workloads with known, planned traffic spikes (for example, around a launch or event).
- Environments that require consistent, protocol-specific tuning across deployments.

## How a custom policy works

A custom policy contains one or more *detection threshold rules*. Each rule specifies:

- A **protocol** to tune: TCP, UDP, or TCP SYN.
- A **threshold** in packets per second that triggers DDoS mitigation for that protocol.
- A **direction**, which is inbound during preview.

You associate the policy with one or more Standard Load Balancer frontend IP addresses. The thresholds you define then apply to inbound traffic for those frontend IPs. Associating a frontend IP address is optional when you create the policy—you can add or change associations later from the policy's **Policy settings** page.

> [!NOTE]
> When you configure a custom threshold for a protocol, Azure disables automatic tuning for that protocol on the protected resource and uses your configured value instead. Protocols that you don't define a rule for continue to use adaptive auto-tuning.

Because a custom threshold replaces adaptive tuning for that protocol, base your values on your application's anticipated traffic baseline. Start with conservative changes, validate the behavior in a nonproduction environment, and monitor mitigation telemetry after you apply a policy. For more information about telemetry, see [Monitor Azure DDoS Protection](monitor-ddos-protection.md).

## Preview scope and limitations

During public preview, Azure DDoS Protection custom policy supports:

- Standard Load Balancer frontend IP configurations.
- Inbound detection thresholds for TCP, UDP, and TCP SYN traffic, set in packets per second (50,000 to 2,000,000).
- Management through the Azure portal, Azure CLI, Azure Resource Manager (ARM) templates, and the REST API.

Current limitations:

- Support is limited to Standard Load Balancer frontend IP configurations.
- Detection thresholds apply to inbound traffic only.
- Not all regions are enabled for this feature yet. If you try to create a custom policy in one of the following regions, the request fails with a `RegionNotEnabledForFeature` error:

  - Sweden South
  - Southeast US
  - Indonesia Central
  - Chile Central
  - Austria East
  - Southeast US 3
  - Malaysia West
  - Belgium Central
  - Israel Northwest

As with all preview features, functionality and supported scenarios might change before general availability.

## Custom policy and adaptive tuning

Custom policy doesn't replace Azure DDoS Protection's adaptive tuning. Instead, it complements it. For any protocol that you don't define a detection threshold rule for, Azure continues to apply adaptive mitigation policies that use machine learning. This approach lets you tune only the protocols that need it and keep automatic protection everywhere else. For more information about adaptive tuning, see [Azure DDoS Protection features](ddos-protection-features.md).

## Next steps

> [!div class="nextstepaction"]
> [Create and manage a custom policy in the Azure portal](manage-ddos-custom-policy-portal.md)
