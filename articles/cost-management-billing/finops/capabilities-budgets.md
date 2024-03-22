---
title: Budget management
description: This article helps you understand the budget management capability within the FinOps Framework and how to implement that in the Microsoft Cloud.
author: bandersmsft
ms.author: banders
ms.date: 03/21/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: finops
ms.reviewer: micflan
---

# Budget management

This article helps you understand the budget management capability within the FinOps Framework and how to implement that in the Microsoft Cloud.

## Definition

**Budget management refers to the process of overseeing and tracking financial plans and limits over a given period to effectively manage and control spending.**

Analyze historical usage and cost trends and adjust for future plans to estimate monthly, quarterly, and yearly costs that are realistic and achievable. Repeat for each level in the organization for a complete picture of organizational budgets.

Configure alerting and automated actions to notify stakeholders and protect against budget overages. Investigate unexpected variance to budget and take appropriate actions. Review and adjust budgets regularly to ensure they remain accurate and reflect any changes in the organization's financial situation.

Effective budget management helps ensure organizations operate within their means and are able to achieve financial goals. Unexpected costs can impact external business decisions and initiatives that could have widespread impact.

## Getting started

When you first start managing cost in the cloud, you may not have your financial budgets mapped to every subscription and resource group. You may not even have the budget mapped to your billing account yet. It's okay. Start by configuring cost alerts. The exact amount you use isn't as important as having _something_ to let you know when costs are escalating.

- Start by [creating a monthly budget in Cost Management](../costs/tutorial-acm-create-budgets.md) at the primary scope you manage, whether that's a billing account, management group, subscription, or resource group.
  - If you're not sure where to start, set your budget amount based on the cost of the previous months. You can also set it to be explicitly higher than what you intend, to catch an exceedingly high jump in costs, if you're not concerned with smaller moves. No matter what you set, you can always change it later.
  - If you do want to provide a more realistic alert threshold, see [Estimate the initial cost of your cloud project](/azure/well-architected/cost/design-initial-estimate).
  - Configure one or more alerts on actual or forecast cost to be sent to stakeholders.
  - If you need to proactively stop billing before costs exceed a certain threshold on a subscription or resource group, [execute an automated action when alerts are triggered](../manage/cost-management-budget-scenario.md).
- If you have concerns about rollover costs from one month to the next as they accumulate for the quarter or year, create quarterly and yearly budgets.
- If you're not concerned about "overage," but would still like to stay informed about costs, [save a view in Cost analysis](../costs/save-share-views.md) and [subscribe to scheduled alerts](../costs/save-share-views.md#subscribe-to-scheduled-alerts). Then share a chart of the cost trends to stakeholders. It can help you drive accountability and awareness as costs change over time before you go over budget.
- Consider [subscribing to anomaly alerts](../understand/analyze-unexpected-charges.md#create-an-anomaly-alert) for each subscription to ensure everyone is aware of anomalies as they're identified.
- Repeat these steps to configure alerts for the stakeholders of each scope and application you want to be monitored for maximum visibility and accountability.
- Consider reviewing costs against your budget periodically to ensure costs remain on track with your expectations.

## Building on the basics

So far, you've defined granular and targeted cost alerts for each scope and application and ideally review your cost as a KPI with all stakeholders at regular meetings. Consider the following points to further refine your budget management process:

- Refine the budget granularity to enable more targeted oversight.
- Encourage all teams to take ownership of their budget allocations and expenses.
  - Educate them about the impact of their actions on the overall budget and empower them to make informed decisions.
- Streamline the process for making budget adjustments, ensuring teams easily understand and follow it.
- [Automate budget creation](../automate/automate-budget-creation.md) with new subscriptions and resource groups.
- If not done earlier, use automation tools like Azure Logic Apps or Alerts to [execute automated actions when budget alerts are triggered](../manage/cost-management-budget-scenario.md). Tools can be especially helpful on test subscriptions.

## Learn more at the FinOps Foundation

This capability is a part of the FinOps Framework by the FinOps Foundation, a non-profit organization dedicated to advancing cloud cost management and optimization. For more information about FinOps, including useful playbooks, training and certification programs, and more, see to the [Budget management](https://www.finops.org/framework/capabilities/budget-management) article in the FinOps Framework documentation.

## Next steps

- [Forecasting](capabilities-forecasting.md)
- [Onboarding workloads](capabilities-workloads.md)
- [Chargeback and finance integration](capabilities-chargeback.md)