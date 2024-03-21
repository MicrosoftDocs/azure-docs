---
title: Managing shared cost
description: This article helps you understand the managing shared cost capability within the FinOps Framework and how to implement that in the Microsoft Cloud.
author: bandersmsft
ms.author: banders
ms.date: 03/21/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: finops
ms.reviewer: micflan
---

# Managing shared cost

This article helps you understand the managing shared cost capability within the FinOps Framework and how to implement that in the Microsoft Cloud.

## Definition

**Managing shared cost refers to the process of redistributing the cost of shared services to the teams and applications that utilized them.**

Identify shared costs and develop an allocation plan that defines the rules and methods for dividing the shared costs fairly and equitably. Track and report shared costs and their allocation to the relevant stakeholders. Regularly review and update allocation plan to ensure it remains accurate and fair.

Effectively managing shared costs reduces overhead, increases transparency and accountability, and better aligns cloud costs to business value while maximizing the efficiencies and cost savings from shared services.

## Before you begin

Before you start, it's important to have a clear understanding of your organization's goals and priorities when it comes to managing shared costs. Keep in mind that not all shared costs may need to be redistributed, and some are more effectively managed with other means. Carefully evaluate each shared cost to determine the most appropriate approach for your organization.

This guide doesn't cover commitment-based discounts, like reservations and savings plans. For details about how to handle showback and chargeback, refer to [Managing commitment-based discounts](capabilities-commitment-discounts.md).

## Getting started

When you first start managing cost in the cloud, you use the native allocation tools to manage shared costs. Start by identifying shared costs and how they should be handled.

- If your organization previously implemented the [Cost allocation capability](capabilities-allocation.md), refer back to any notes about unallocated or shared costs.
- Notify stakeholders that you're evaluating shared costs and request details about any known scenarios. Self-identification can save you significant time and effort.
- Review the services that have been purchased and are being used with the [Services view in Cost analysis](../costs/cost-analysis-built-in-views.md#break-down-product-and-service-costs).
- Familiarize yourself with each service to determine if they're designed for and/or could be used for shared resources. A few examples of commonly shared services are:
  - Application hosting services, like Azure Kubernetes Service, Azure App Service, and Azure Virtual Desktop.
  - Observability tools, like Azure Monitor and Log Analytics.
  - Management and security tools, like Microsoft Defender for Cloud and DevTest Labs.
  - Networking services, like ExpressRoute.
  - Database services, like Cosmos DB and SQL databases.
  - Collaboration and productivity tools, like Microsoft 365.
- Contact stakeholders who are responsible for the potentially shared services. Make sure they understand if the shared services are shared and how costs are allocated today. If not accounted for, how allocation could or should be done.
- Use [cost allocation rules in Microsoft Cost Management](../costs/allocate-costs.md) to redistribute shared costs based on static percentages or compute, network, or storage costs.
- Regularly review and update allocation rules to ensure they remain accurate and fair.

## Building on the basics

At this point, your simple cost allocation scenarios may be addressed. You're left with more complicated scenarios that require more effort to accurately quantify and redistribute. As you move beyond the basics, consider the following points:

- Establish and track common KPIs, like the percentage of unallocated shared costs.
- Use utilization data from [Azure Monitor metrics](../../azure-monitor/essentials/data-platform-metrics.md) where possible to understand service usage.
- Consider using application telemetry to quantify the distribution of shared costs. It's discussed more in [Measuring unit costs](capabilities-unit-costs.md).
- Automate the process of identifying the percentage breakdown of shared costs and consider using allocation rules in Cost Management to redistribute the costs.
- Automate cost allocation rules to update their respective percentages based on changing usage patterns.
- Consider sharing targeted reporting about the distribution of shared costs with relevant stakeholders.
- Build a reporting process to raise awareness of and drive accountability for unallocated shared costs.
- Share guidance with stakeholders on how they can optimize shared costs.

## Learn more at the FinOps Foundation

This capability is a part of the FinOps Framework by the FinOps Foundation, a non-profit organization dedicated to advancing cloud cost management and optimization. For more information about FinOps, including useful playbooks, training and certification programs, and more, see the [Managing shared cost](https://www.finops.org/framework/capabilities/manage-shared-cloud-cost/) article in the FinOps Framework documentation.

## Next steps

- [Data analysis and showback](capabilities-analysis-showback.md)
- [Chargeback and finance integration](capabilities-chargeback.md)
- [Measuring unit costs](capabilities-unit-costs.md)