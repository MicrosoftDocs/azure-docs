---
title: Create a DDoS Protection custom policy in the Azure portal
description: Create and configure an Azure DDoS Protection custom policy in the Azure portal, then associate supported endpoints with Azure CLI or Azure PowerShell.
author: duongau
ms.author: duau
ms.service: azure-ddos-protection
ms.topic: how-to
ms.date: 10/26/2026
# Customer intent: As a network administrator, I want to create a DDoS Protection custom policy with protocol-specific detection thresholds, so that I can tune mitigation behavior to my application's traffic patterns.
---

# Create and manage an Azure DDoS Protection custom policy using the Azure portal

Azure DDoS Protection custom policy gives you more granular control over how Azure DDoS Protection detects and mitigates attacks against your protected workloads. By using a custom policy, you can set protocol-specific detection thresholds for TCP, UDP, and TCP SYN traffic instead of relying solely on adaptive auto-tuning. Custom policies are useful for latency-sensitive applications, high-throughput services, and workloads with predictable traffic spikes.

In this article, you learn how to create a custom policy and configure protocol detection thresholds in the Azure portal. To associate supported public IP addresses or resource-specific IP configurations, use the linked Azure CLI or Azure PowerShell guidance.

For supported resources and the resource-oriented association model, see the [custom policy overview](ddos-custom-policy-overview.md#supported-resources).

> [!NOTE]
> When you configure a custom threshold for a protocol, Azure disables autotuning triggers for that protocol and uses the configured static value instead. Use anticipated traffic baselines to guide threshold selection, start with conservative changes, and validate the behavior in a nonproduction environment before broad deployment.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A supported public IP configuration to protect. A custom policy is a standalone resource. You can create the policy first and associate supported public IP addresses or resource-specific IP configurations later.
- Sign in to the [Azure portal](https://portal.azure.com). Ensure that your account is assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that's assigned the appropriate actions listed in [Permissions](manage-permissions.md).

<a id="preview-scope-and-limitations"></a>

## Scope and limitations

Azure DDoS Protection custom policy supports inbound detection thresholds for TCP, UDP, and TCP SYN traffic.

| Protocol | Minimum threshold (packets per second) | Maximum threshold (packets per second) |
| --- | --- | --- |
| TCP | 50,000 | 2,000,000 |
| UDP | 20,000 | 200,000 |
| TCP SYN | 1,000 | 100,000 |

Detection thresholds apply to inbound traffic only. The underlying association depends on the resource and management interface. It's not limited to Standard Load Balancer frontend IP configurations.

## Create a custom policy

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search resources, services, and docs** box at the top of the portal, enter *DDoS custom policies*. When **DDoS custom policies** appears in the results, select it.
1. Select **Create**.

    :::image type="content" source="./media/manage-custom-policy-portal/ddos-custom-policies-list.png" alt-text="Screenshot of the DDoS custom policies list page with the Create button in the Azure portal." lightbox="./media/manage-custom-policy-portal/ddos-custom-policies-list.png":::

1. On the **Basics** tab, enter or select the following values.

    | Setting | Value |
    | --- | --- |
    | Subscription | Select your subscription. |
    | Resource group | Select an existing resource group or select **Create new**. |
    | Name | Enter a name for the custom policy. |
    | Region | Select a supported region. |

1. Don't add an initial resource association. Complete policy creation in the following steps. After deployment, associate a supported endpoint as described in [Associate supported resources](#associate-supported-resources).
1. Select **Next: Custom rules** to add detection threshold rules.

## Add detection threshold rules

Detection threshold rules let you override Azure DDoS Protection's default detection logic with a fixed, application-specific trigger threshold. A custom policy requires at least one detection threshold rule.

> [!NOTE]
> When you configure a custom threshold for a protocol, Azure disables automatic tuning for that protocol on the protected resource and uses the configured value instead. Protocols you don't add a rule for continue to use adaptive auto-tuning.

1. On the **Custom rules** tab, under **Detection threshold**, select **Add a rule**.

1. In **Add a detection threshold rule**, enter or select the following values, and then select **Save**.

    | Setting | Value |
    | --- | --- |
    | Name | Enter a name for the rule. |
    | Protocol | Select **TCP**, **UDP**, or **TCPSYN**. |
    | Threshold (packets per second) | Enter a value based on your application's anticipated traffic baseline: **50,000** to **2,000,000** for TCP, **20,000** to **200,000** for UDP, or **1,000** to **100,000** for TCP SYN. |
    | Direction | **Inbound** (the only supported direction). |

    :::image type="content" source="./media/manage-custom-policy-portal/add-detection-threshold-rule.png" alt-text="Screenshot of the Add a detection threshold rule pane with protocol, threshold, and direction values." lightbox="./media/manage-custom-policy-portal/add-detection-threshold-rule.png":::

1. Repeat the previous steps to add a rule for each protocol you want to tune.
1. Select **Review + create**.
1. After validation passes, select **Create** to deploy the policy.

## View and manage the custom policy

After deployment, you can view and manage the policy:

1. Go to your custom policy resource. To view the full resource definition, select **JSON View** on the **Overview** page.
1. To change the detection rules, under **Settings**, select **Policy settings**. Under **Custom rules**, select **Add** to add a detection threshold rule, or select an existing rule to edit it.

## Associate supported resources

After you create a custom policy, associate it with a supported Azure resource. The underlying association uses the supported public IP address or resource-specific IP configuration for that resource.

Azure CLI and Azure PowerShell provide different management experiences for the same custom-policy capability. They don't represent different product association models.

For the supported-resource list and association requirements, see the [custom policy overview](ddos-custom-policy-overview.md#supported-resources). Use the following guides to create, verify, or remove an association:

- [Azure CLI](manage-ddos-custom-policy-cli.md).
- [Azure PowerShell](manage-ddos-custom-policy-powershell.md).

## Monitor mitigation behavior

After you configure a custom policy, monitor mitigation telemetry to validate the effect of your threshold changes. Azure Monitor and existing Azure DDoS Protection telemetry continue to provide visibility into mitigation activity. For more information, see [Monitor Azure DDoS Protection](monitor-ddos-protection.md).

## Clean up resources

If you no longer need the custom policy, first detach its resource associations by using the Azure CLI or Azure PowerShell guidance. Detaching the policy returns those endpoints to adaptive auto-tuning. Then delete the policy.

> [!WARNING]
> This action is irreversible.

1. Go to your custom policy resource.
1. On the **Overview** page, select **Delete**, then confirm.

## Next steps

> [!div class="nextstepaction"]
> [Monitor Azure DDoS Protection](monitor-ddos-protection.md)
