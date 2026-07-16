---
title: "Simulate security admin rule impact with rule impact analyzer"
titleSuffix: "Azure Virtual Network Manager"
description: "Learn how to simulate security admin rule impact on existing network rules and traffic when applied with Azure Virtual Network Manager."
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 05/06/2026
ms.custom:
  - template-how-to
---

# Simulate security admin rule impact with rule impact analyzer

In this article, you learn how to use the rule impact analyzer feature to simulate your security admin rules on the traffic flows of your virtual networks in your Azure Virtual Network Manager instance’s security admin configuration’s rule collections blade. You can use the Azure portal to analyze what impact the security admin rules in your rule collection can have on your virtual networks before deploying them.

This feature helps you validate security admin rule behavior, identify potential impact to existing traffic flows, and ensure your connectivity requirements are met without disrupting live traffic. By understanding the impact of your security admin rules, you can confidently plan changes, maintain compliance, and reduce the risk of misconfiguration across your virtual networks.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn_52a140ac-560d-400f-de96-b5fd487708cd) before you begin.

- An existing network manager instance. If you don't have a network manager instance, see [Create a network manager instance](/azure/virtual-network-manager/create-virtual-network-manager-portal).

- A network group. If you don’t have a network group, see [Create a network group](/azure/virtual-network-manager/create-virtual-network-manager-portal#create-a-network-group).

- A security admin configuration with at least one rule collection containing at least one security admin rule. If you don’t have a security admin configuration, see [Create a security admin configuration](/azure/virtual-network-manager/how-to-block-network-traffic-portal#create-a-securityadmin-configuration). If you don’t have a rule collection or security admin rule, see [Add a rule collection and security rule](/azure/virtual-network-manager/how-to-block-network-traffic-portal#add-a-rule-collection-and-security-rule).

- Traffic analytics enabled for your virtual network flow logs. If you don’t have virtual network flow logs enabled on the network groups’ virtual networks you want to include in the analysis, see [Create a flow log](/azure/network-watcher/vnet-flow-logs-manage?tabs=portal#create-a-flow-log). If you don’t have traffic analytics enabled for your virtual network flow logs, see [Enable traffic analytics on virtual network flow logs](/azure/network-watcher/vnet-flow-logs-manage#enable-or-disable-traffic-analytics).

  - It can take time after configuring these tools before data becomes available for rule impact analyzer.

- Required role-based access control (RBAC) permissions. For more information, see [Traffic analytics RBAC Permissions](/azure/network-watcher/required-rbac-permissions#traffic-analytics).

## Simulate security admin rules in the Azure portal

Use rule impact analyzer in the Azure portal to analyze your security admin rules and simulate traffic flow patterns. In this step, you go to the rule impact analyzer feature.

1.  In the Azure portal, search for and select **Network managers**.

1.  Select your network manager instance.

1.  In the left menu, under **Settings**, select **Configurations**.

1.  Select your security admin configuration.

1.  In the left menu, under **Settings**, select **Rule collections**.

1.  Select **Analyze rules** for the rule collection you want.

:::image type="content" source="media/how-to-simulate-security-admin-rules/rule-impact-analyzer-interface.png" lightbox="media/how-to-simulate-security-admin-rules/rule-impact-analyzer-interface-expanded.png" alt-text="Screenshot of the Azure Network Manager interface showing the Rule Impact Analyzer tool.":::

> [!Important]
> Rule impact analysis works only on virtual networks with traffic analytics fully enabled. This requirement ensures the simulation is based on complete and accurate traffic data. The following virtual networks are automatically excluded because they can result in incomplete or inaccurate simulation results:
> - Virtual networks with subnet or NIC‑level flow logs.
> - Virtual networks with flow log filtering enabled.
> - AKS‑injected virtual networks.

## Review results

After running the simulation, you see a detailed report that lists all existing traffic paths that have the target network groups’ virtual networks as the source or destination. The report shows how your security admin rules can affect those traffic paths.

:::image type="content" source="media/how-to-simulate-security-admin-rules/rule-impact-analyzer-results.png" lightbox="media/how-to-simulate-security-admin-rules/rule-impact-analyzer-results-expanded.png" alt-text="Screenshot that shows the rule impact analyzer results with predicted traffic impact states (Affected, Not affected, Cannot be determined) for each traffic path.":::

The **Predicted traffic impact** column of the simulation results returns one of the following states:

- **Affected**: a path where at least one simulated rule changes the existing traffic behavior.

- **Not affected**: a path where none of the simulated rules change the existing traffic behavior.

- **Cannot be determined**: a path where the analysis can't compute a result. For example, this state occurs if a Log Analytics workspace doesn't exist for traffic analytics, if access to the workspace is denied, or if required data is missing.

Select **View details** for any of the listed traffic paths. This selection opens a pane with additional information on each of the simulated security admin rules, showing whether a rule affects the selected traffic path.

:::image type="content" source="media/how-to-simulate-security-admin-rules/rule-impact-details-pane.png" lightbox="media/how-to-simulate-security-admin-rules/rule-impact-details-pane-expanded.png" alt-text="Screenshot that shows the View details pane displaying whether a security admin rule is predicted to affect a traffic path between two virtual networks.":::

## Configure scope

You can configure the scope of rule impact analyzer to choose your desired rule collections and specific security admin rules to simulate traffic flow patterns for your desired set of network groups and specific virtual networks.

:::image type="content" source="media/how-to-simulate-security-admin-rules/rule-impact-analyzer-scope.png" lightbox="media/how-to-simulate-security-admin-rules/rule-impact-analyzer-scope.png" alt-text="Screenshot that shows the Configure scope options to select specific rule collections, rules, network groups, and virtual networks for analysis.":::

1.  In the rule impact analyzer results page, select **Configure scope**.

1.  Use each dropdown to select your desired rule collection, rules, network groups, and virtual networks.

1.  Select **Apply** to run rule impact analyzer on the new scope.

## Next steps

> [!div class="nextstepaction"]
> [Create a security admin rule using network groups](how-to-create-security-admin-rule-network-group.md)
