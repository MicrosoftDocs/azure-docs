---
title: What is the data product factory (preview) for Azure Operator Insights?
description: Learn about the data product factory (preview) for Azure Operator Insights, and how it can help you design and create new Data Products.
author: rcdun
ms.author: rdunstan
ms.reviewer: sergeyche
ms.service: operator-insights
ms.topic: overview

#CustomerIntent: As a partner developing a Data Product, I want to understand what the data product factory is so that I can use it.
---

# What is the Azure Operator Insights data product factory (preview)?

Azure Operator Insights Data Products process data from operator networks, enrich it, and make it available for analysis. They can include prebuilt dashboards, and allow operators to view their data in other analysis tools. For more information, see [What is Azure Operator Insights?](overview.md).

The Azure Operator Insights data product factory (preview) allows partners to easily design and create new Data Products for the Azure Operator Insights platform. Partners can develop pipelines to analyze network data and offer insights, while allowing the Azure Operator Insights platform to process operator-scale data.

:::image type="complex" source="media/data-product-factory/data-product-factory.png" alt-text="Diagram indicating the position of the data product factory between the Azure Operator Insights platform and the Azure Marketplace.":::
The data product factory is built on the Azure Operator Insights platform, which provides low-latency, transformation and analysis. You can publish Data Products from the data product factory to the Azure Marketplace for monetization.
:::image-end:::

## Features of the data product factory (preview)

The data product factory (preview) offers:

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

## Using the data product factory (preview)

The data product factory (preview) is a self-service environment for partners to design, create, and test new Data Products.

Each Data Product is defined by a data product definition: a set of files defining the transformation, aggregation, summarization, and visualization of the data.

The data product factory is delivered as a GitHub-based SDK containing:
- A development environment and sandbox for local design and testing. The environment and sandbox provide a tight feedback loop to accelerate the development cycle for ingestion, enrichment, and insights.
- Documentation including step-by-step tutorials for designing, testing, publishing, and monetizing Data Products.
- Sample data product definitions to kickstart design and creation.
- Tools to automatically generate and validate data product definitions.

## Next step

Apply for access to the data product factory SDK by filling in the [application form](https://forms.office.com/r/vMP9bjQr6n).
