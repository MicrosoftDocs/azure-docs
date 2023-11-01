---
title: Data quality and quality monitoring
description: This article helps you understand how data quality and quality monitoring work in Azure Operator Insights.
author: bettylew
ms.author: bettylew
ms.service: operator-insights
ms.topic: concept-article
ms.date: 10/24/2023
---

# Data quality and quality monitoring

Every Data Product working on Azure Operator Insights platform has built-in support for data quality monitoring. Data quality is crucial because it ensures accurate, reliable, and trustworthy information for decision-making. It prevents costly mistakes, builds credibility with customers and regulators, and enables personalized experiences.

Azure Operator Insights platform monitors data quality when data is ingested into Data Product input storage (first AOI Data Product Storage block in following image) and after data is processed and made available to customers (AOI Data Product Compute in following image).

:::image type="content" source="media/concept-data-quality-monitoring/operator-insights-architecture.jpg" alt-text="Diagram of Azure Operator Insights Data Product architecture." lightbox="media/concept-data-quality-monitoring/operator-insights-architecture.jpg":::

## Quality dimensions

Data quality dimensions are the various aspects or characteristics that define the quality of data. Azure Operator Insights support the following dimensions:

- Accuracy - Refers to how well the data reflects reality, for example, correct names, addresses and up-to-date data. High data accuracy allows you to produce analytics that can be trusted and leads to correct reporting and confident decision-making.
- Completeness - Refers to whether all the data required for a particular use is present and available to be used. Completeness applies not only at the data item level but also at the record level. Completeness helps to understand if missing data will affect the reliability of insights from the data.
- Uniqueness - Refers to the absences of duplicates in a dataset.
- Consistency - Refers to whether the same data element does not conflict across different sources or over time. Consistency ensures that data is uniform and can be compared across different sources.
- Timeliness - Refers to whether the data is up-to-date and available when needed. Timeliness ensures that data is relevant and useful for decision-making.
- Validity - Refers to whether the data conforms to a defined set of rules or constraints.

## Metrics

All data quality dimensions are covered by quality metrics produced by Azure Operator Insights platform. There are two types of the quality metrics:

- Basic - Standard set of checks across all data products.
- Custom - Custom set of checks, allowing all data products to implement checks that are specific to their product.

The basic quality metrics produced by the platform are available in a table below.

| **Metric**                                                                       | **Dimension** | **Data Source** |
|----------------------------------------------------------------------------------|---------------|-----------------|
| Number of ingested rows                                                          | Timeliness    | Ingested        |
| Number of rows containing null for required columns                              | Completeness  | Ingested        |
| Number of rows failed validation against schema                                  | Validity      | Ingested        |
| Number of filtered out rows                                                      | Completeness  | Ingested        |
| Number of processed rows                                                         | Timeliness    | Processed       |
| Number of incomplete rows, which don't contain required data                     | Completeness  | Processed       |
| Number of duplicated rows                                                        | Uniqueness    | Processed       |
| Percentiles for overall lag between record generation and available for querying | Timeliness    | Processed       |
| Percentiles for lag between record generation and ingested into input storage    | Timeliness    | Processed       |
| Percentiles for lag between data ingested and processed                          | Timeliness    | Processed       |
| Percentiles for lag between data processed and available for querying            | Timeliness    | Processed       |
| Ages for materialized views                                                      | Timeliness    | Processed       |

The custom data quality metrics are implemented on per data product basis. These metrics cover the accuracy and consistency dimensions. Data product documentation contains description for the custom quality metrics available.

## Monitoring

All Azure Operator Insight Data Products are deployed with a dashboard showing quality metrics. You can use the dashboard to monitor quality of their data.

All data quality metrics are saved to the Data Product ADX tables. For exploration of the data quality metrics, you can use the standard Data Product KQL endpoint and then extend the dashboard if necessary.
