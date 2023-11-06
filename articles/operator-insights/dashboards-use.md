---
title: Use Azure Operator Insights Data Product dashboards
description: This article outlines how to access and use dashboards in the Azure Operator Insights Data Product.
author: bettylew
ms.author: bettylew
ms.service: operator-insights
ms.topic: how-to
ms.date: 10/24/2023

#CustomerIntent: As a Data Product user, I want to access dashboards so that I can view my data.
---

# Use Data Product dashboards to visualize data

This article covers accessing and using the dashboards in the Azure Operator Insights Data Product.

## Prerequisites

A deployed Data Product, see [Create an Azure Operator Insights Data Product](data-product-create.md).

## Get access to the dashboards

Access to the dashboards is controlled by role-based access control (RBAC).

1. In the Azure portal, select the Data Product resource and open the Permissions pane. You must have the `Reader` role. If you do not, contact an owner of the resource to grant you `Reader` permissions.
1. In the Overview pane of the Data Product, open the link to the dashboards.
1. Select any dashboard to open it and view the visualizations.

## Filter data

Each dashboard is split into pages with a set of filters at the top of the page.

- View different pages in the dashboard by selecting the tabs on the left.
- Filter data by using the drop-down or free text fields at the top of the page.
    You can enter multiple values in the free text fields by separating the inputs with a comma and no spaces, for example: `London,Paris`.

Some tiles report `UNDETECTED` for any filters with an empty entry. You can't filter these undetected entries.

## Exploring the queries

Each tile in a dashboard runs a query against the data. To edit these queries and run them manually, you can open these queries in the query editor.

1. Select the ellipsis in the top right corner of the tile, and select **Explore Query**.
1. Your query opens in a new tab in the query editor. If the query is all on one line, right-click the query block and select **Format Document**.
1. Select **Run** or press *Shift + Enter* to run the query.

## Editing the dashboards

Users with Edit permissions on dashboards can make changes.

1. In the dashboard, change the state from **Viewing** to **Editing** in the top left of the screen.
1. Select **Add** to add new tiles, or select the pencil to edit existing tiles.

## Related content

- For more information on dashboards and how to create your own, see [Visualize data with Azure Data Explorer dashboards](/azure/data-explorer/azure-data-explorer-dashboards)
- For general information on data querying in the Data Product, see [Query data in the Data Product](data-query.md)
