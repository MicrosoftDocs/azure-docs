---
title: What is the Data Product Factory for Azure Operator Insights?
description: Learn about the Data Product Factory for Azure Operator Insights, and how it can help you design and create new Data Products.
author: rcdun
ms.author: rdunstan
ms.reviewer: sergeyche
ms.service: operator-insights
ms.topic: overview

#CustomerIntent: As a partner developing a Data Product, I want to understand what the Data Product Factory is so that I can use it.
---

# What is the Data Product Factory for Azure Operator Insights?

The Azure Operator Insights Data Product Factory allows partners to easily design and create new Data Products for the Azure Operator Insights platform. Partners can develop pipelines to analyze network data and offer insights and proactive troubleshooting with generative AI, while allowing the Azure Operator Insights platform to process operator-scale data.

:::image type="content" source="media/data-product-factory/data-product-factory.png" alt-text="The Data Product Factory is based on Azure Operator Insights Platform. You can publish to the Azure Marketplace.":::

## Data Products and data meshes

Data Products process data from operator networks, enrich it, and make it available for analysis.

All Data Products can include prebuilt dashboards to allow operators to start analyzing their networks quickly. Operators can also query their data directly or build their own dashboards in Azure Data Explorer. Operators can also connect data products to other analysis tools, such as Power BI. For more information, see [Data visualization in Data Products](concept-data-visualization.md).

Data Products share a standardized and composable architecture and use the Azure Operator Insights platform to process data. The common features allow partners to develop individual data products or combine them together in a data mesh. Combining data products together allows end-to-end insights for operator multi-site multi-vendor networks.

## Features of the Data Product Factory

The Data Product Factory offers:

- Integration with Azure Marketplace for discoverability and monetization.
- Acceleration of time to business value with "no code" / "low code" techniques that allow rapid onboarding of new data sources from operator networks, more quickly than IT-optimized toolkits.
- Standardization of key areas, including:
  - Design of data pipelines for ingesting data, transforming it and generating insights.
  - Configuration of Microsoft Purview catalogs for data governance.
  - Data quality metrics.
- Simpler migration of on-premises analytics pipelines to Azure.
- Easy integration with partners' own value-add solutions through open and consistent interfaces, such as:
  - Integration into workflow and ticketing systems empowering automation based on AI-generated insights.
  - Integration into network-wide management solutions such as OSS/NMS platforms.

## Using the Data Product Factory

The Data Product Factory is a self-service environment for partners to design, create, and test new Data Products.

Each Data Product is defined by a Data Product Definition: a set of files defining the transformation, aggregation, summarization, and visualization of the data.

The Data Product Factory is delivered as a GitHub-based SDK containing:
- A development environment and sandbox for local design and testing. The environment and sandbox provide a tight feedback loop to accelerate the development cycle for ingestion, enrichment, and insights.
- Documentation including step-by-step tutorials for designing, testing, publishing, and monetizing Data Products.
- Sample Data Product Definitions to kickstart design and creation.
- Tools to automatically generate and validate Data Product Definitions.

## Next step

Apply for access to the Data Product Factory SDK by contacting your Microsoft representative.
