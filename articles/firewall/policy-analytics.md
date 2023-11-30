---
title: Azure Firewall Policy Analytics
description: Learn about Azure Firewall Policy Analytics
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 05/09/2023
ms.author: victorh
---

# Azure Firewall Policy Analytics


Policy Analytics provides insights, centralized visibility, and control to Azure Firewall. IT teams today are challenged to keep Firewall rules up to date, manage existing rules, and remove unused rules. Any accidental rule updates can lead to a significant downtime for IT teams. 

For large, geographically dispersed organizations, manually managing Firewall rules and policies is a complex and sometimes  error-prone process. The new Policy Analytics feature is the answer to this common challenge faced by IT teams.

You can now refine and update Firewall rules and policies with confidence in just a few steps in the Azure portal. You have granular control to define your own custom rules for an enhanced security and compliance posture. You can automate rule and policy management to reduce the risks associated with a manual process.<br><br>

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE57NCC]

## Pricing

New pricing for policy analytics is now in effect. See the [Azure Firewall Manager pricing](https://azure.microsoft.com/pricing/details/firewall-manager/) page for the latest pricing details.

## Key Policy Analytics features

- **Policy insight panel**: Aggregates insights and highlights relevant policy information.
- **Rule analytics**: Analyzes existing DNAT, Network, and Application rules to identify rules with low utilization or rules with low usage in a specific time window.
- **Traffic flow analysis**: Maps traffic flow to rules by identifying top traffic flows and enabling an integrated experience.
- **Single Rule analysis**: Analyzes a single rule to learn what traffic hits that rule to refine the access it provides and improve the overall security posture.


## Enable Policy Analytics

Policy analytics starts monitoring the flows in the DNAT, Network, and Application rule analysis only after you enable the feature. It can't analyze rules hit before the feature is enabled.  


1.	Select **Policy analytics** in the table of contents. 
2. Next, select **Configure Workspaces**.
3. In the pane that opens, select the **Enable Policy Analytics** checkbox. 
4. Next, choose a log analytics workspace. The log analytics workspace should be the same workspace configured in the firewall Diagnostic settings.
5. Select **Save** after you choose the log analytics workspace.

> [!TIP]
> Policy Analytics has a dependency on both Log Analytics and Azure Firewall resource specific logging. Verify the Firewall is configured appropriately or follow the previous instructions. Be aware that logs take 60 minutes to appear after enabling them for the first time. This is because logs are aggregated in the backend every hour. You can check logs are configured appropriately by running a log analytics query on the resource specific tables such as **AZFWNetworkRuleAggregation**, **AZFWApplicationRuleAggregation**, and **AZFWNatRuleAggregation**.

## Next steps


- To learn more about Policy Analytics, see [Optimize performance and strengthen security with Policy Analytics for Azure Firewall](https://azure.microsoft.com/blog/optimize-performance-and-strengthen-security-with-policy-analytics-for-azure-firewall/).
- To learn more about Azure Firewall logs and metrics, see [Azure Firewall logs and metrics](logs-and-metrics.md).
- To learn more about Azure Firewall structured logs, see [Azure Firewall structured logs](firewall-structured-logs.md).