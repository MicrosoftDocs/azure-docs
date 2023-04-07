---
title: Azure Firewall Policy Analytics (preview)
description: Learn about Azure Firewall Policy Analytics (preview)
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 01/26/2023
ms.author: victorh
---

# Azure Firewall Policy Analytics (preview)


> [!IMPORTANT]
> This feature is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Policy Analytics provides insights, centralized visibility, and control to Azure Firewall. IT teams today are challenged to keep Firewall rules up to date, manage existing rules, and remove unused rules. Any accidental rule updates can lead to a significant downtime for IT teams. 

For large, geographically dispersed organizations, manually managing Firewall rules and policies is a complex and sometimes  error-prone process. The new Policy Analytics feature is the answer to this common challenge faced by IT teams.

You can now refine and update Firewall rules and policies with confidence in just a few steps in the Azure portal. You have granular control to define your own custom rules for an enhanced security and compliance posture. You can automate rule and policy management to reduce the risks associated with a manual process.<br><br>

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE57NCC]

## Pricing

Enabling Policy Analytics on a Firewall Policy associated with a single firewall is billed per policy as described on the [Azure Firewall Manager pricing](https://azure.microsoft.com/pricing/details/firewall-manager/) page. Enabling Policy Analytics on a Firewall Policy associated with more than one firewall is offered at no added cost.

## Key Policy Analytics features

- **Policy insight panel**: Aggregates insights and highlights relevant policy information.
- **Rule analytics**: Analyzes existing DNAT, Network, and Application rules to identify rules with low utilization or rules with low usage in a specific time window.
- **Traffic flow analysis**: Maps traffic flow to rules by identifying top traffic flows and enabling an integrated experience.
- **Single Rule analysis**: Analyzes a single rule to learn what traffic hits that rule to refine the access it provides and improve the overall security posture.

## Prerequisites

- An Azure Firewall Standard or Premium
- An Azure Firewall Standard or Premium policy attached to the Firewall
- The [Azure Firewall network rule name logging (preview)](firewall-network-rule-logging.md) must be enabled to view network rules analysis.
- The [Azure Structured Firewall Logs (preview)](firewall-structured-logs.md) must be enabled on Firewall Standard or Premium.


## Enable Policy Analytics

Policy analytics starts monitoring the flows in the DNAT, Network, and Application rule analysis only after you enable the feature. It can't analyze rules hit before the feature is enabled.  

### Firewall with no diagnostics settings configured


1.	Once all prerequisites are met, select **Policy analytics (preview)** in the table of contents. 
2. Next, select **Configure Workspaces**.
3. In the pane that opens, select the **Enable Policy Analytics** checkbox. 
4. Next, choose a log analytics workspace. The log analytics workspace should be the same as the Firewall attached to the policy.
5. Select **Save** after you choose the log analytics workspace.
6. Go to the Firewall attached to the policy and enter the **Diagnostic settings** page. You'll see the **FirewallPolicySetting** added there as part of the policy analytics feature.
7. Select **Edit Setting**, and ensure the **Resource specific** toggle is checked, and the highlighted tables are checked. In the previous example, all logs are written to the log analytics workspace.

### Firewall with Diagnostics settings already configured

1. Ensure that the Firewall attached to the policy is logging to **Resource Specific** tables, and that the following three tables are also selected:
   - AZFWApplicationRuleAggregation
   - AZFWNetworkRuleAggregation
   - AZFWNatRuleAggregation
2. Next, select **Policy Analytics (preview)** in the table of contents. Once inside the feature, select **Configure Workspaces**. 
3. Now, select **Enable Policy Analytics**.
4. Next, choose a log analytics workspace. The log analytics workspace should be the same as the Firewall attached to the policy. 
5. Select **Save** after you choose the log analytics workspace.

   During the save process, you might see the following error message: **Failed to update Diagnostic Settings**

   You can disregard this error message if the policy was successfully updated.

> [!TIP]
> Policy Analytics has a dependency on both Log Analytics and Azure Firewall resource specific logging. Verify the Firewall is configured appropriately or follow the previous instructions. Be aware that logs take 60 minutes to appear after enabling them for the first time. This is because logs are aggregated in the backend every hour. You can check logs are configured appropriately by running a log analytics query on the resource specific tables such as **AZFWNetworkRuleAggregation**, **AZFWApplicationRuleAggregation**, and **AZFWNatRuleAggregation**.

## Next steps


- To learn more about Azure Firewall logs and metrics, see [Azure Firewall logs and metrics](logs-and-metrics.md).