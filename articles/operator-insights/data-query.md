---
title: Query data in the Azure Operator Insights Data Product
description: This article outlines how to access and query the data in the Azure Operator Insights Data Product.
author: rcdun
ms.author: rdunstan
ms.service: operator-insights
ms.topic: how-to
ms.date: 10/22/2023

#CustomerIntent: As a consumer of the Data Product, I want to query data that has been collected so that I can visualise the data and gain customised insights.
---

# Query data in the Data Product

This article outlines how to access and query your data.

The Azure Operator Insights Data Product stores enriched and processed data, which is available for querying with the Consumption URL.

## Prerequisites

A deployed Data Product, see [Create an Azure Operator Insights Data Product](data-product-create.md).

## Get access to the ADX cluster

Access to the data is controlled by role-based access control (RBAC).

1. In the Azure portal, select the Data Product resource and open the Permissions pane. You must have the `Reader` role. If you do not, contact an owner of the resource to grant you `Reader` permissions.
1. In the Overview pane, copy the Consumption URL.
1. Open the [Azure Data Explorer web UI](https://dataexplorer.azure.com/) and select **Add** > **Connection**.
1. Paste your Consumption URL in the connection box and select **Add**.

For more information, see [Add a cluster connection in the Azure Data Explorer web UI](/azure/data-explorer/add-cluster-connection).

## Perform a query

Now that you have access to your data, confirm you can run a query.

1. In the [Azure Data Explorer web UI](https://dataexplorer.azure.com/), expand the drop-down for the Data Product Consumption URL for which you added a connection.
1. Double-click on the database you want to run your queries against. This database is set as the context in the banner above the query editor.
1. In the query editor, run one of the following simple queries to check access to the data.

```kql
// Lists all available tables in the database.
.show tables

// Returns the schema of the named table. Replace $TableName with the name of table in the database.
$TableName
| getschema

// Take the first entry of the table. Replace $TableName with the name of table in the database.
$TableName
| take 1
```

With access to the data, you can run queries to gain insights or you can visualize and analyze your data. These queries are written in [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/).

Aggregated data in the Data Product is stored in [materialized views](/azure/data-explorer/kusto/management/materialized-views/materialized-view-overview). These views can be queried like tables, or by using the [materialized_view() function](/azure/data-explorer/kusto/query/materialized-view-function). Queries against materialized views are highly performant when using the `materialized_view()` function.

## Related content

- For information on using the query editor, see [Writing Queries for Data Explorer](/azure/data-explorer/web-ui-kql)
- For information on KQL, see [Kusto Query Language Reference](/azure/data-explorer/kusto/query/)
- For information on accessing the dashboards in your Data Product, see [Use Data Product dashboards](dashboards-use.md)
