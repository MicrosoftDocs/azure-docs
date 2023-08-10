---
title: Data ingestion and normalization
description: This article helps you understand the data ingestion and normalization capability within the FinOps Framework and how to implement that in the Microsoft Cloud.
keywords:
author: bandersmsft
ms.author: banders
ms.date: 06/22/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: finops
ms.reviewer: micflan
---

# Data ingestion and normalization

This article helps you understand the data ingestion and normalization capability within the FinOps Framework and how to implement that in the Microsoft Cloud.

## Definition

**Data ingestion and normalization refers to the process of collecting, transforming, and organizing data from various sources into a single, easily accessible repository.**

Gather cost, utilization, performance, and other business data from cloud providers, vendors, and on-premises systems. Gathering the data can include:

- Internal IT data. For example, from a configuration management database (CMDB) or IT asset management (ITAM) systems.
- Business-specific data, like organizational hierarchies and metrics that map cloud costs to or quantify business value. For example, revenue, as defined by your organizational and divisional mission statements.

Consider how data gets reported and plan for data standardization requirements to support reporting on similar data from multiple sources, like cost data from multiple clouds or account types. Prefer open standards and interoperability with and across providers, vendors, and internal tools. It may also require restructuring data in a logical and meaningful way by categorizing or tagging data so it can be easily accessed, analyzed, and understood.

When armed with a comprehensive collection of cost and usage information tied to business value, organizations can empower stakeholders and accelerate the goals of other FinOps capabilities. Stakeholders are able to make more informed decisions, leading to more efficient use of resources and potentially significant cost savings.

## Before you begin

While data ingestion and normalization are critical to long-term efficiency and effectiveness of any FinOps practice, it isn't a blocking requirement for your initial set of FinOps investments. If it is your first iteration through the FinOps lifecycle, consider lighter-weight capabilities that can deliver quicker return on investment, like [Data analysis and showback](capabilities-analysis-showback.md). Data ingestion and normalization can require significant time and effort depending on account size and complexity. We recommend focusing on this process once you have the right level of understanding of the effort and commitment from key stakeholders to support that effort.

## Getting started

When you first start managing cost in the cloud, you use the native tools available in the portal or through Power BI. If you need more, you may download the data for local analysis, or possibly build a small report or merge it with another dataset. Eventually, you need to automate this process, which is where "data ingestion" comes in. As a starting point, we focus on ingesting cost data into a common data store.

- Before you ingest cost data, think about your reporting needs.
  - Talk to your stakeholders to ensure you have a firm understanding of what they need. Try to understand their motivations and goals to ensure the data or reporting helps them.
  - Identify the data you need, where you can get the data from, and who can give you access. Make note of any common datasets that may require normalization.
  - Determine the level of granularity required and how often the data needs to be refreshed. Daily cost data can be a challenge to manage for a large account. Consider monthly aggregates to reduce costs and increase query performance and reliability if that meets your reporting needs.
- Consider using a third-party FinOps platform.
  - Review the available [third-party solutions in the Azure Marketplace](https://portal.azure.com/#view/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/searchQuery/cost).
  - If you decide to build your own solution, consider starting with [FinOps hubs](https://aka.ms/finops/hubs), part of the open source FinOps toolkit provided by Microsoft.
    - FinOps hubs will accelerate your development and help you focus on building the features you need rather than infrastructure.
- Select the [cost details solution](../automate/usage-details-best-practices.md) that is right for you. We recommend scheduled exports, which push cost data to a storage account on a daily or monthly basis.
  - If you use daily exports, notice that data is pushed into a new file each day. Ensure that you only select the latest day when reporting on costs.
- Determine if you need a data integration or workflow technology to process data.
  - In an early phase, you may be able to keep data in the exported storage account without other processing. We recommend that you keep the data there for small accounts with lightweight requirements and minimal customization.
  - If you need to ingest data into a more advanced data store or perform data cleanup or normalization, you may need to implement a data pipeline. [Choose a data pipeline orchestration technology](/azure/architecture/data-guide/technology-choices/pipeline-orchestration-data-movement).
- Determine what your data storage requirements are.
  - In an early phase, we recommend using the exported storage account for simplicity and lower cost.
  - If you need an advanced query engine or expect to hit data size limitations within your reporting tools, you should consider ingesting data into an analytical data store. [Choose an analytical data store](/azure/architecture/data-guide/technology-choices/analytical-data-stores).

## Building on the basics

At this point, you have a data pipeline and are ingesting data into a central data repository. As you move beyond the basics, consider the following points:

- Normalize data to a standard schema to support aligning and blending data from multiple sources.
  - For cost data, we recommend using the [FinOps Open Cost & Usage Specification (FOCUS) schema](https://finops.org/focus).
  - [FinOps hubs](https://aka.ms/finops/hubs) includes a Power BI report that normalizes data to the FOCUS schema, which can be a good starting point.
  - For an example of the FOCUS schema with Azure data, see the [FOCUS sample report](https://github.com/flanakin/cost-management-powerbi#FOCUS).
- Complement cloud cost data with organizational hierarchies and budgets.
  - Consider labeling or tagging requirements to map cloud costs to organizational hierarchies.
- Enrich cloud resource and solution data with internal CMDB or ITAM data.
- Consider what internal business and revenue metrics are needed to map cloud costs to business value.
- Determine what other datasets are required based on your reporting needs:
  - Cost and pricing
    - [Azure retail prices](/rest/api/cost-management/retail-prices/azure-retail-prices) for pay-as-you-go rates without organizational discounts.
    - [Price sheets](/rest/api/cost-management/price-sheet/download) for organizational pricing for Microsoft Customer Agreement accounts.
    - [Price sheets](/rest/api/consumption/price-sheet/get) for organizational pricing for Enterprise Agreement accounts.
    - [Balance summary](/rest/api/consumption/balances/get-by-billing-account) for Enterprise Agreement monetary commitment balance.
  - Commitment-based discounts
    - [Reservation details](/rest/api/cost-management/generate-reservation-details-report) for recommendation details.
    - [Benefit utilization summaries](/rest/api/cost-management/generate-benefit-utilization-summaries-report) for savings plans.
  - Utilization and efficiency
    - [Resource Graph](/rest/api/azureresourcegraph/resourcegraph(2020-04-01-preview)/resources/resources) for Azure Advisor recommendations.
    - [Monitor metrics](/rest/api/monitor/metrics-data-plane/batch) for resource usage.
  - Resource details
    - [Resource Graph](/rest/api/azureresourcegraph/resourcegraph(2020-04-01-preview)/resources/resources) for resource details.
    - [Resource changes](/rest/api/resources/changes/list) to list resource changes from the past 14 days.
    - [Subscriptions](/rest/api/resources/subscriptions/list) to list subscriptions.
    - [Tags](/rest/api/resources/tags/list) for tags that have been applied to resources and resource groups.
  - [Azure service-specific APIs](/rest/api/azure/) for lower-level configuration and utilization details.

## Learn more at the FinOps Foundation

This capability is a part of the FinOps Framework by the FinOps Foundation, a non-profit organization dedicated to advancing cloud cost management and optimization. For more information about FinOps, including useful playbooks, training and certification programs, and more, see the [Data ingestion and normalization capability](https://www.finops.org/framework/capabilities/data-normalization/) article in the FinOps Framework documentation.

## Next steps

- Read about [Cost allocation](capabilities-allocation.md) to learn how to allocate costs to business units and applications.
- Read about [Data analysis and showback](capabilities-analysis-showback.md) to learn how to analyze and report on costs.
