---
title: Data analysis and showback
description: This article helps you understand the data analysis and showback capability within the FinOps Framework and how to implement that in the Microsoft Cloud.
author: bandersmsft
ms.author: banders
ms.date: 03/21/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: finops
ms.reviewer: micflan
---

# Data analysis and showback

This article helps you understand the data analysis and showback capability within the FinOps Framework and how to implement that in the Microsoft Cloud.

## Definition

**Data analysis refers to the practice of analyzing and interpreting data related to cloud usage and costs. Showback refers to enabling cost visibility throughout an organization.**

Provides transparency and visibility into cloud usage and costs across different departments, teams, and projects. Organizational alignment requires cost allocation metadata and hierarchies, and enabling visibility requires structured access control against these hierarchies.

Data analysis and showback require a deep understanding of organizational needs to provide an appropriate level of detail to each stakeholder. Consider the following points:

- Level of knowledge and experience each stakeholder has
- Different types of reporting and analytics you can provide
- Assistance they need to answer their questions

With the right tools, data analysis and showback enable stakeholders to understand how resources are used, track cost trends, and make informed decisions regarding resource allocation, optimization, and budget planning.

## When to prioritize

Data analysis and showback are a common part of your iterative process. Some examples of when you want to prioritize data analysis and showback include:

- New datasets become available, which need to be prepared for stakeholders.
- New requirements are raised to add or update reports.
- Implementing more cost visibility measures to drive awareness.

If you're new to FinOps, we recommend starting with data analysis and showback using native cloud tools as you learn more about the data and the specific needs of your stakeholders. You revisit this capability again as you adopt new tools and datasets, which could be ingested into a custom data store or used by a third-party solution from the Marketplace.

## Before you begin

Before you can effectively analyze usage and costs, you need to familiarize yourself with [how you're charged for the services you use](https://azure.microsoft.com/pricing#product-pricing). Understanding the factors that contribute to costs such as compute, storage, networking, data transfer, or executions helps you understand what you ultimately get billed. Understanding how your service usage aligns with the various pricing models also helps you understand what you get billed. These patterns vary between services, which can result in unexpected charges if you don't fully understand how you're charged and how you can stop billing.

>[!NOTE]
> For example, many people understand "VMs are not billed when they're not running." However, this is only partially true. There's a slight nuance for VMs where a "stopped" VM _will_ continue to charge you, because the cloud provider is still reserving that capacity for you. To stop billing, you must "deallocate" the VM. But you also need to remember that compute time isn't the only charge for a VM – you're also charged for network bandwidth, disk storage, and other connected resources. In the simplest example, a deallocated VM will always charge you for disk storage, even if the VM is not running. Depending on what other services you have connected, there could be other charges as well. This is why it's important to understand how the services and features you use will charge you.

We also recommend learning about [how cost data is tracked, stored, and refreshed in Microsoft Cost Management](../costs/understand-cost-mgt-data.md). Some examples include:

- Which subscription types (or offers) are supported. For instance, data for classic CSP and sponsorship subscriptions isn't available in Cost Management and must be obtained from other data sources.
- Which charges are included. For instance, taxes aren't included.
- How tags are used and tracked. For instance, some resources don't support tags and [tag inheritance](../costs/enable-tag-inheritance.md) must be enabled manually to inherit tags from subscriptions and resource groups.
- When to use "actual" and "amortized" cost.
  - "Actual" cost shows charges as they were or as they'll get shown on the invoice. Use actual costs for invoice reconciliation.
  - "Amortized" cost shows the effective cost of resources that used a commitment-based discount (reservation or savings plan). Use amortized costs for cost allocation, to "smooth out" large purchases that may look like usage spikes, and numerous commitment-based discount scenarios.
- How credits are applied. For instance, credits are applied when the invoice is generated and not when usage is tracked.

Understanding your cost data is critical to enable accurate and meaningful showback to all stakeholders.

## Getting started

When you first start managing cost in the cloud, you use the native tools:

- [Cost analysis](../costs/quick-acm-cost-analysis.md) helps you explore and get quick answers about your costs.
- [Power BI](/power-bi/connect-data/desktop-connect-azure-cost-management) helps you build advanced reports merged with other cloud or business data.
- [Billing](../manage/index.yml) helps you review invoices and manage credits.
- [Azure Monitor](../../azure-monitor/overview.md) helps you analyze resource usage metrics, logs, and traces.
- [Azure Resource Graph](../../governance/resource-graph/overview.md) helps you explore resource configuration, changes, and relationships.

As a starting point, we focus on tools available in the Azure portal and Microsoft 365 admin center.

- Familiarize yourself with the [built-in views in Cost analysis](../costs/cost-analysis-built-in-views.md), concentrate on your top cost contributors, and drill in to understand what factors are contributing to that cost.
  - Use the Services view to understand the larger services (not individual cloud resources) that have been purchased or are being used within your environment. This view is helpful for some stakeholders to get a high-level understanding of what's being used when they may not know the technical details of how each resource is contributing to business goals.
  - Use the Subscriptions and Resource groups views to identify which departments, teams, or projects are incurring the highest cost, based on how you've organized your resources.
  - Use the Resources view to identify which deployed resources are incurring the highest cost.
  - Use the Reservations view to review utilization for a billing account or billing profile or to break down usage to the individual resources that received the reservation discount.
  - Always use the view designed to answer your question. Avoid using the most detailed view to answer all questions, as it's slower and requires more work to find the answer you need.
  - Use drilldown, filtering, and grouping to narrow down to the data you need, including the cost meters of an individual resource.
- [Save and share customized views](../costs/save-share-views.md) to revisit them later, collaborate with stakeholders, and drive awareness of current costs.
  - Use private views for yourself and shared views for others to see and manage.
  - Pin views to the Azure portal dashboard to create a heads-up display when you sign into the portal.
  - Download an image of the chart and copy a link to the view to provide quick access from external emails, documents, etc. Note recipients are required to sign in and have access to the cost data.
  - Download summarized data to share with others who don't have direct access.
  - Subscribe to scheduled alerts to send emails with a chart and/or data to stakeholders on a daily, weekly, or monthly basis.
- As you review costs, make note of questions that you can't answer with the raw cloud usage and cost data. Feed this back into your cost allocation strategy to ensure more metadata is added via tags and labels.
- Use the different tools optimized to provide the details you need to understand the holistic picture of your resource cost and usage.
  - [Analyze resource usage metrics in Azure Monitor](../../azure-monitor/essentials/tutorial-metrics.md).
  - [Review resource configuration changes in Azure Resource Graph](../../governance/resource-graph/how-to/get-resource-changes.md).
- If you need to build more advanced reports or merge cost data with other cloud or business data, [connect to Cost Management data in Power BI](/power-bi/connect-data/desktop-connect-azure-cost-management).
  - If getting started with cost reporting in Power BI, consider using these [Power BI sample reports](https://github.com/flanakin/cost-management-powerbi).

## Building on the basics

At this point, you're likely productively utilizing the native reporting and analysis solutions in the portal and have possibly started building advanced reports in Power BI. As you move beyond the basics, consider the following to help you scale your reporting and analysis capabilities:

- Talk to your stakeholders to ensure you have a firm understanding of their end goals.
  - Differentiate between "tasks" and "goals." Tasks are performed to accomplish goals and will change as technology and our use of it evolves, while goals are more consistent over time.
  - Think about what they'll do after you give them the data. Can you help them achieve that through automation or providing links to other tools or reports? How can they rationalize cost data against other business metrics (the benefits their resources are providing)?
  - Do you have all the data you need to facilitate their goals? If not, consider ingesting other datasets to streamline their workflow. Adding other datasets is a common reason for moving from in-portal reporting into a custom or third-party solution to support other datasets.
- Consider reporting needs of each capability. Some examples include:
  - Cost breakdowns aligned to cost allocation metadata and hierarchies.
  - Optimization reports tuned to specific services and pricing models.
  - Commitment-based discount utilization, coverage, savings, and chargeback.
  - Reports to track and drill into KPIs across each capability.
- How can you make your reporting and KPIs an inherent part of day-to-day business and operations?
  - Promote dashboards and KPIs at recurring meetings and reviews.
  - Consider both bottom-up and top-down approaches to drive FinOps through data.
  - Use alerting systems and collaboration tools to raise awareness of costs on a recurring basis.
- Regularly evaluate the quality of the data and reports.
  - Consider introducing a feedback mechanism to learn how stakeholders are using reports and when they can't or aren't meeting their needs. Use it as a KPI for your reports.
  - Focus heavily on data quality and consistency. Many issues surfaced within the reporting tools are result from the underlying data ingestion, normalization, and cost allocation processes. Channel the feedback to the right stakeholders and raise awareness of and resolve issues that are impacting end-to-end cost visibility, accountability, and optimization.

## Learn more at the FinOps Foundation

This capability is a part of the FinOps Framework by the FinOps Foundation, a non-profit organization dedicated to advancing cloud cost management and optimization. For more information about FinOps, including useful playbooks, training and certification programs, and more, see the [Data analysis and showback capability](https://www.finops.org/framework/capabilities/analysis-showback/) article in the FinOps Framework documentation.

## Next steps

- [Forecasting](capabilities-forecasting.md)
- [Managing anomalies](capabilities-anomalies.md)
- [Budget management](capabilities-budgets.md)
