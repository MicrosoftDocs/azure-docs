---
title: Data visualization in Azure Operator Insights Data Products
description: This article outlines how data is stored and visualized in Azure Operator Insights Data Products.
author: bettylew
ms.author: bettylew
ms.service: operator-insights
ms.topic: concept-article
ms.date: 10/23/2023

#CustomerIntent: As a Data Product user, I want understand data visualization in the Data Product so that I can access my data.
---

# Data visualization in Data Products overview

The Azure Operator Insights Data Product is an Azure service that handles processing and enrichment of data. A set of dashboards is deployed with the Data Product, but users can also query and visualize the data.

## Data Explorer

Enriched and processed data is stored in the Data Product and is made available for querying with the Consumption URL, which you can connect to in the [Azure Data Explorer web UI](https://dataexplorer.azure.com/). Permissions are governed by role-based access control.

The Data Product exposes a database, which contains a set of tables and materialized views. You can query this data in the Data Explorer GUI using [Kusto Query Language](/azure/data-explorer/kusto/query/).

## Enrichment and aggregation

The Data Product enriches the raw data by combining data from different tables together. This enriched data is then aggregated in materialized views that summarize the data over various dimensions.

The data is enriched and aggregated after it has been ingested into the raw tables. As a result, there is a slight delay between the arrival of the raw data and the arrival of the enriched data.

The Data Product has metrics that monitor the quality of the raw and enriched data. For more information, see [Data quality and data monitoring](concept-data-quality-monitoring.md).

## Visualizations

Dashboards are deployed with the Data Product. These dashboards include a set of visualizations organized according to different KPIs in the data, which can be filtered on a range of dimensions. For example, visualizations provided in the Mobile Content Cloud (MCC) Data Product include upload/download speeds and data volumes.

For information on accessing and using the built-in dashboards, see [Use Data Product dashboards](dashboards-use.md).

You can also create your own visualizations, either by using the KQL [render](/azure/data-explorer/kusto/query/renderoperator?pivots=azuredataexplorer) operator in the [Azure Data Explorer web UI](https://dataexplorer.azure.com/) or by creating dashboards following the guidance in [Visualize data with Azure Data Explorer dashboards](/azure/data-explorer/azure-data-explorer-dashboards).

## Querying

On top of the dashboards provided as part of the Data Product, the data can be directly queried in the Azure Data Explorer web UI. See [Query data in the Data Product](data-query.md) for information on accessing and querying the data.

## Related content

- To get started with creating a Data Product, see [Create an Azure Operator Insights Data Product](data-product-create.md)
- For information on querying the data in your Data Product, see [Query data in the Data Product](data-query.md)
- For information on accessing the dashboards in your Data Product, see [Use Data Product dashboards](dashboards-use.md)
