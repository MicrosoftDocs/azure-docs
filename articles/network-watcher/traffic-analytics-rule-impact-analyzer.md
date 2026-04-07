---
title: Analyze Security Rules in Traffic Analytics (Preview)
titleSuffix: Azure Network Watcher
description: Use Rule Impact Analyzer to simulate and assess security admin rule effects in Azure Virtual Network Manager. Ensure compliance and prevent misconfigurations.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.date: 04/07/2026
ms.topic: how-to
---

# Analyze security rules using Rule Impact Analyzer in Traffic Analytics (preview)

In this article, you learn how to use the rule impact analyzer feature with network groups in Azure Virtual Network Manager. You can use the Azure portal to create a security admin configuration, add a security admin rule, and simulate the impact of your rule changes before deploying them.

The rules impact analyzer enables you to preview the impact of security admin rules before applying them to your environment. This feature helps you validate rule behavior, identify potential conflicts, and ensure that connectivity requirements are met without disrupting live traffic. By understanding the impact of your proposed rules changes, you can confidently plan changes, maintain compliance, and reduce the risk of misconfiguration across your virtual networks.

> [!IMPORTANT]
> Rule Impact Analyzer is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Traffic analytics enabled for your virtual network flow logs or network security group flow logs. For more information, see [Enable traffic analytics on virtual network flow logs](vnet-flow-logs-manage.md#enable-or-disable-traffic-analytics) or [Enable traffic analytics on network security group flow logs](nsg-flow-logs-manage.md#enable-or-disable-traffic-analytics).
 
- Required role-based access control (RBAC) permissions. For more information, see [Traffic analytics RBAC Permissions](required-rbac-permissions.md#traffic-analytics).

- A network group. For more information, see [Create a network group](../virtual-network-manager/create-virtual-network-manager-portal.md#create-a-network-group).

## Analyze security rules in the Azure portal 

Use rule impact analyzer in the Azure portal to analyze your security rules and simulate traffic flow patterns.

### Configure simulation scope

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** from the search results.

1. Under **Monitoring**, select **Traffic Analytics**.

1. Select **Open Rule Impact Analyzer**.

1. Select **Configure Simulation Scope** to choose the security rules to simulate traffic flow patterns.

1. In **Rule Configuration**, select or enter the following information:

    | Setting | Value |
    | --- | --- |
    | Subscription | Select your Azure subscription. |
    | Type | Select **Network Manager** or **Network Security Group**. |
    | Network Manager | Select a network manager. This option is available if you select *Network Manager* in **Type**.|
    | Security Admin Configuration | Select the security admin configuration containing the rule collection that has the rules that you want to analyze. This option is available if you select *Network Manager* in **Type**. |
    | Rule Collection | Select the rule collection containing the rules that you want to analyze. This option is available if you select *Network Manager* in **Type**. |
    | Rules | Select one or more rules to analyze their impact on traffic flows. This option is available if you select *Network Manager* in **Type**. |
    | Security Admin Configuration | Select the security admin configuration containing the rule collection to analyze. This option is available if you select *Network Manager* in **Type**. |
    | Network Security Group | Select the Network Security Group (NSG) containing the rules to analyze. This option is available if you select *Network Security Group* in **Type**. |
    | NSG Rules | Select one or more rules to analyze their impact on traffic flows. This option is available if you select *Network Security Group* in **Type**. |

1.  Select **Next**.

    :::image type="content" source="media/traffic-analytics-rule-impact-analyzer/rule-configuration.png" alt-text="Screenshot that shows the Rule Configuration page of the Rule Impact Analyzer in the Azure portal.":::

### Select virtual networks

After selecting the rules to analyze, define the scope of the evaluation by choosing the target virtual networks whose traffic data will be used. Only eligible virtual networks are included to ensure the analysis provides an accurate view of end-to-end traffic behavior:

1. On the virtual networks selection page of **Rule Configuration**, select one or more virtual networks (up to 500) that show Traffic Analytics **Enabled**. Use the search box or filters to narrow down the list.

1. Select **Apply**.

1. Select **Run Simulation**

    :::image type="content" source="media/traffic-analytics-rule-impact-analyzer/run-simulation.png" alt-text="Screenshot that shows the simulation scope of the Rule Impact Analyzer in the Azure portal.":::

> [!IMPORTANT]
> Rule impact analysis is performed only on Virtual Networks with Traffic Analytics fully enabled. This ensures the simulation is based on complete and accurate traffic data. The following Virtual Networks are automatically excluded because they can result in incomplete or inaccurate simulation results:
> - Virtual networks with subnet or NIC‑level flow logs.
> - Virtual networks with flow log filtering enabled.
> - AKS‑injected virtual networks.

### Review results

After running the simulation, you'll see a detailed report that lists all traffic paths and how your rules impact them.

:::image type="content" source="media/traffic-analytics-rule-impact-analyzer/simulation-results.png" alt-text="Screenshot that shows the simulation results of the Rule Impact Analyzer in the Azure portal." lightbox="media/traffic-analytics-rule-impact-analyzer/simulation-results.png":::

In the **Impact** column of the simulation results, you can find one of these states:

- **Impacted:** Paths where at least one simulated rule changes traffic behavior.

- **Not Impacted:** Paths unaffected by the simulated rules.

- **Indeterminate:** Paths where the simulation couldn't compute a result (for example, log analytics workspace doesn't exist for traffic analytics, access to the workspace is denied, or required data or configuration is missing).

You can use **Resource Impact** tab to list all impacted virtual networks (when you have multiple virtual networks selected for the simulation).

For impacted virtual networks, the report identifies the **impacting rule**, its **priority**, and the **number of flows breaking**, to help you assess the severity of the change. Use **View Query** to inspect the underlying query and validate the result before deploying the rules.

## Related content

- [Traffic Analytics overview](traffic-analytics.md)

- [Create a security admin rule using network groups](../virtual-network-manager/how-to-create-security-admin-rule-network-group.md)

- [View configurations applied by Azure Virtual Network Manager](../virtual-network-manager/how-to-view-applied-configurations.md)
