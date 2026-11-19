---
title: What is Azure DDoS Protection custom policy?
description: Learn how Azure DDoS Protection custom policy lets you set protocol-specific detection thresholds to tune mitigation behavior for your workloads.
services: ddos-protection
author: duongau
ms.service: azure-ddos-protection
ms.topic: concept-article
ms.date: 10/26/2026
ms.author: duau
# Customer intent: As a network security administrator, I want to understand Azure DDoS Protection custom policy, so that I can decide when to set protocol-specific detection thresholds instead of relying on adaptive auto-tuning.
---

# What is Azure DDoS Protection custom policy?

Azure DDoS Protection custom policy gives you more granular control over how Azure DDoS Protection detects and mitigates attacks against your protected workloads. By default, Azure DDoS Protection uses adaptive, machine learning-based auto-tuning to set detection thresholds for each protected resource. By using a custom policy, you can override that automatic behavior with fixed, application-specific detection thresholds for individual protocols.

Custom policy provides a resource-oriented experience for supported Azure resources with public IP endpoints. The underlying association uses a supported public IP address or a resource-specific IP configuration, depending on the resource and management interface.

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
- A **direction**, which is inbound.

You associate the policy with supported public IP addresses or resource-specific IP configurations. The thresholds you define apply to inbound traffic for those endpoints. You can create the policy first and add associations later.

Azure CLI and Azure PowerShell provide different management experiences for the same custom-policy capability. They don't represent different product association models. Use the resource-specific examples in the [Azure CLI](manage-ddos-custom-policy-cli.md) and [Azure PowerShell](manage-ddos-custom-policy-powershell.md) guides to create, verify, or remove an association.

> [!NOTE]
> When you configure a custom threshold for a protocol, Azure disables automatic tuning for that protocol on the protected resource and uses your configured value instead. Protocols that you don't define a rule for continue to use adaptive auto-tuning.

Because a custom threshold replaces adaptive tuning for that protocol, base your values on your application's anticipated traffic baseline. Start with conservative changes, validate the behavior in a nonproduction environment, and monitor mitigation telemetry after you apply a policy. For more information about telemetry, see [Monitor Azure DDoS Protection](monitor-ddos-protection.md).

## Supported resources

The following table describes the customer-facing resource scope and underlying association.

| Azure resource | Customer-facing scope | Underlying association |
| --- | --- | --- |
| Azure Virtual Machines | VM public endpoint | Instance-level public IP address |
| Azure Virtual Machine Scale Sets | Scale set public endpoint, subject to public IP ownership and lifecycle | Individual public IP address |
| Azure Kubernetes Service (AKS) | AKS public endpoint | Public IP address or Standard Load Balancer frontend |
| Standard Load Balancer | Load balancer public frontend | Public IP address or frontend IP configuration, depending on the management interface |
| Azure Firewall | Firewall public endpoint | Associated public IP configuration |
| Azure Bastion | Bastion public endpoint | Associated public IP configuration |
| Application Gateway | Application Gateway public endpoint | Public IP address associated with Application Gateway |

Support applies to the resource's eligible public IP configurations, not to every configuration of each resource type. Review the resource's SKU and networking requirements before you associate a policy.

> [!IMPORTANT]
> NAT Gateway StandardV2 public IP addresses aren't supported in the initial generally available release of custom policy. This exclusion applies to all management interfaces. The separate DDoS Protection preview for [NAT Gateway StandardV2](../nat-gateway/nat-sku.md) doesn't add custom-policy support.

<a id="preview-scope-and-limitations"></a>

## Scope and limitations

Custom policy supports inbound detection thresholds for TCP, UDP, and TCP SYN traffic. Set the threshold in packets per second within the range for the selected protocol.

| Protocol | Minimum threshold (packets per second) | Maximum threshold (packets per second) |
| --- | --- | --- |
| TCP | 50,000 | 2,000,000 |
| UDP | 20,000 | 200,000 |
| TCP SYN | 1,000 | 100,000 |

- Detection thresholds apply to inbound traffic only.
- A public IP prefix doesn't expose the same custom-policy association as an individual public IP address. Don't configure a custom policy on the prefix resource.
- Azure portal, Azure CLI, Azure PowerShell, Azure Resource Manager (ARM) templates, and REST expose management paths for custom policies. Association details depend on the resource and management interface.

Government-cloud portal availability follows a separate rollout. Don't assume that availability in the public-cloud portal establishes Government-cloud portal support.

## Custom policy and adaptive tuning

Custom policy doesn't replace Azure DDoS Protection's adaptive tuning. Instead, it complements it. For any protocol that you don't define a detection threshold rule for, Azure continues to apply adaptive mitigation policies that use machine learning. This approach lets you tune only the protocols that need it and keep automatic protection everywhere else. For more information about adaptive tuning, see [Azure DDoS Protection features](ddos-protection-features.md).

## DDoS protection considerations for public IP address changes

For workloads that require customized protection rules, use a custom policy and verify its associations when public IP addresses change.

### Public IP address changes and policy associations

DDoS custom policies are associated with specific supported resources. If you delete or replace a public IP address, its existing policy association doesn't automatically transfer to the replacement public IP address.

Consider the following scenarios:

- **Public IP replacement:** Associate the custom policy with the new eligible public IP address by using the supported association method for its resource.
- **Active/standby configurations:** If your application switches between different public IP addresses, associate the appropriate custom policy with each eligible public IP address that requires customized protection.
- **Policy removal:** If you disassociate a public IP address from a custom policy, the custom rules no longer apply to that address. The policy and its configured rules remain available unless you delete the policy.

### Verify associations before you change endpoints

Before you replace public IP addresses or switch traffic between endpoints, verify that the intended custom policy is associated with the destination public IP address. If you remove an association, reassociate the policy to restore the intended custom protection settings.

For resource-specific steps to verify or restore an association, see the [Azure CLI](manage-ddos-custom-policy-cli.md) or [Azure PowerShell](manage-ddos-custom-policy-powershell.md) guide.

## Next steps

> [!div class="nextstepaction"]
> [Create and manage a custom policy in the Azure portal](manage-ddos-custom-policy-portal.md)
