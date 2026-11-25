---
title: Azure Firewall Policy Analytics
description: Learn how Azure Firewall Policy Analytics provides insights and centralized visibility to help you optimize firewall rules and policies.
author: duongau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 11/04/2026
ms.author: duau
# Customer intent: "As an IT administrator managing network security, I want to utilize Policy Analytics for Azure Firewall, so that I can optimize and automate firewall rules and policies, reducing the risks of misconfiguration and enhancing the security posture of the organization."
---

# Azure Firewall Policy Analytics


Policy Analytics provides insights, centralized visibility, and control to Azure Firewall. IT teams today are challenged to keep Firewall rules up to date, manage existing rules, and remove unused rules. Any accidental rule updates can lead to a significant downtime for IT teams. 

For large, geographically dispersed organizations, manually managing Firewall rules and policies is a complex and sometimes error-prone process. Policy Analytics is the answer to this common challenge faced by IT teams.

You can refine and update Firewall rules and policies with confidence in just a few steps in the Azure portal. You have granular control to define your own custom rules for an enhanced security and compliance posture. You can automate rule and policy management to reduce the risks associated with a manual process.

> [!VIDEO https://learn-video.azurefd.net/vod/player?id=850e850c-7485-46a0-aa26-8588027a3e84]

## Pricing

For the latest pricing details, see the [Azure Firewall Manager pricing](https://azure.microsoft.com/pricing/details/firewall-manager/) page.

## Key Policy Analytics features

- **Policy insight panel**: Aggregates insights and highlights relevant policy information.
- **Rule analytics**: Analyzes existing DNAT, Network, and Application rules to identify rules with low utilization or rules with low usage in a specific time window.
- **Traffic flow analysis**: Maps traffic flow to rules by identifying top traffic flows and enabling an integrated experience.
- **Single Rule analysis**: Analyzes a single rule to learn what traffic hits that rule to refine the access it provides and improve the overall security posture.


> [!NOTE]
> For the **Rules with low utilization** metric, support currently exists for a time period of 30 days only.

### Policy Advisor

> [!IMPORTANT]
> Policy Advisor is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Policy Advisor (preview) adds AI-powered findings to Policy Analytics as part of the [Azure Firewall AI Security add-on](ai-security-concepts.md). It analyzes firewall policy configuration and traffic logs to help administrators find what needs attention.

Findings are grouped into anomaly detection, rule hygiene, and traffic analysis. Examples include newly observed allowed or denied flows, traffic surges, and unused, duplicate, shadowed, or overlapping rules. Each finding links to its supporting evidence, such as the affected resource, the related flows or rules, and timestamps.

Policy Advisor runs analysis daily and shows the results of the latest completed analysis. Each analysis compares the most recent 24 hours of activity with an earlier baseline period. Opening the findings doesn't start a new analysis.

Some findings apply to the whole policy, such as duplicate, shadowed, or overlapping rules. Others apply to an individual firewall, such as traffic surges.

Policy Advisor requires:

- Policy Analytics enabled, with a Log Analytics workspace that receives the firewall's logs. See [Enable Policy Analytics](#enable-policy-analytics).
- A managed identity attached to the firewall policy, with access to that Log Analytics workspace.
- The AI Security add-on enabled on every firewall associated with the policy. If any associated firewall doesn't have the add-on, Policy Advisor doesn't generate findings for that policy.

Policy Advisor doesn't change firewall policies. A finding isn't proof of an attack or proof that a change is safe. For example, an unused rule might still be required. Review the evidence before you change a policy.

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
- To learn more about Azure Firewall logs and metrics, see [Azure Firewall logs and metrics](monitor-firewall.md).
