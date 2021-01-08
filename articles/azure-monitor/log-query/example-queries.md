---
title: Log Analytics in Azure Monitor offers sets of example queries that you can run on their own or use as a starting point for your own queries. 
description: Queries you can start from and modify for your needs 
ms.subservice: logs
ms.topic: article
author: bwren
ms.author: bwren
ms.date: 01/07/2020
---

# Saved queries in Azure Monitor Log Analytics
Saved queries are queries in Log Analytics that you can select to run or modify instead of creating your own from scratch. This article describes queries that are available and how to save your own log queries for later use.

## Types of saved queries
The queries that are available in a workspace include the following:

### Example queries
If you aren't familiar with Log Analytics or the KQL query language, example queries are a great way to start. They can provide instant insight into a resource and provide a nice way to start learning and using KQL, thus shortening the time it takes to start using Log Analytics. We have collected and curated over 250 example queries designed to provide you instant value and that number of example queries is continually growing.

### Query packs
A query pack holds a collection of log queries that can be used in Log Analytics. They provide the ability to export a collection of queries and import into another workspace. The set of log queries available in a workspace is the total set of queries in the query packs currently installed in the workspace.

### Solutions 
Queries from Azure solutions that are installed in the workspace.
## In-context queries

Log Analytics will only display queries relevant to the [current scope](scope.md) you have selected.

- For a **single resource** – queries for the resource type.
- For a **resource group** - queries for the resource types in the specific resource group.
- For a **workspace** – All example queries, query packs in the subscription. 

This behavior is consistent for all Log Analytics scopes. If you are not seeing an example query for the resource type you want, it may be because of filters  due to being in-context. A later section describes how to remove in-context scoping so you can view all possible queries.

> [!TIP]
> The more resources you have in your scope, the longer the time for the portal to filter and show the sample query dialog.

## Query properties
Each query has multiple properties that help you group and locate them. When you save a query, you can define several of these properties. The types of properties are:

- **Resource type** – A resource as defined in Azure, such as a Virtual machine. See the [Azure Monitor Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype) for a full mapping of Azure Monitor Logs/Log Analytics tables to resource type.  
- **Category** – A type of information such as *Security* or *Audit*. Categories are identical to the categories defined in the Tables side pane. See the [Azure Monitor Table Reference](/azure/azure-monitor/reference/tables/tables-category) for a full list of categories.  
- **Solution** – An Azure Monitor solution associated with the queries
- **Topic** – The topic of the example query such as *Activity Logs* or *App logs*. The topic property is unique to example queries and may differ according to the specific resource type.
- **Tags** - Custom tags that you can define and assign to queries.
## Queries interface

You can get to saved queries from two different locations in Log Analytics.

### Queries dialog

When you open Log Analytics, the *Queries* dialog automatically displayed. If you don't want this dialog to be automatically displayed, turn off the **Always show Queries** switch.

![Queries screen](media/saved-queries/query-start.png)


Each query is represented by a card. You can quickly scan through the queries to find what you need. You can run the query directly from the dialog or choose to load it to the query editor for modification.

It can also be accessed by clicking in the upper right of the screen on **Queries**.

[![Queries button](media/saved-queries/queries-button.png)](media/saved-queries/queries-button.png#lightbox)

### Query sidebar

The same functionality of the dialog experience can be accessed from the queries pane on the left-hand sidebar of Log Analytics. You can hover over a query name to get the query description and additional functionality.

[![Query sidebar](media/saved-queries/query-sidebar.png)](media/saved-queries/query-sidebar.png#lightbox)

## Finding and filtering queries

The options in this section are available in both the dialog and sidebar query experience, but with a slightly different user interface.  



### Filtering and group by

While the query dialog experience filers to show only queries with the right context, you can choose to remove the filter and see all the queries.

### Group by

Change the grouping of the queries by clicking the *group by* drop-down list:

[![Example queries screen groupby](media/saved-queries/example-query-groupby.png)](media/saved-queries/example-query-groupby.png#lightbox)



The grouping values also act as an active table of contents. Clicking one of the values on the left-hand side of the screen scrolls the queries view right to the item clicked.

### Filter

You can also filter the queries according to the **group by** values mentioned earlier. In the example query dialog, the filters are found at the top.

[![Example queries screen filter](media/saved-queries/example-query-filter.png)](media/saved-queries/example-query-filter.png#lightbox)

### Combining group by and filter

The filter and group by functionality are designed to work in tandem. They provide flexibility in how queries are arranged. For example, if you using a resource group with multiple resources, you may want to filter down to a specific resource type and arrange the resulting queries by topic.


## Favorites
You can favorite frequently used queries to give you quicker access. Click the star next to the query to add it to **Favorites**. If later you find the query isn't useful to you, you can un-favorite it.  
## Saving queries
You can save your own queries to a query pack to make them available with the other saved queries. To save a query, select **Save as Log Analytics Query** from the **Save** option in Log Analytics.

[![Save query menu](media/saved-queries/save-query.png)](media/saved-queries/save-query.png#lightbox)

When you save a query, the following dialog box is displayed where you can provide values fo the query properties. If you check the option to **Save to the default query pack**, the query will be saved to a query pack called **DefaultQueryPack** in the same subscription and resource group as the workspace. Uncheck this box if you want to specify another query pack. 

[![Save query dialog](media/saved-queries/save-query-dialog.png)](media/saved-queries/save-query-dialog.png#lightbox)

## Query explorer

The query explorer experience for saving and sharing user-generated queries is still available but will be deprecated in the future.

## Next steps

[Get started with KQL Queries](get-started-queries.md)

