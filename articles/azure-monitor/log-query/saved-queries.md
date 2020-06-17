---
title: Saved queries in Azure Monitor Log Analytics
description: Queries you can start from and modify for your needs 
ms.subservice: logs
ms.topic: article
author: rboucher
ms.author: robb
ms.date: 06/16/2020

---
# Saved queries in Azure Monitor Log Analytics

Log Analytics now offers sets of saved queries that you can run on their own or modify and save as needed.

Example queries are a great way to start your Log Analytics experience. They can provide instant insight into a resource and provide a nice way to start learning and using KQL, thus shortening the time it takes to start using Log Analytics. We have collected and curated over 250 example queries designed to provide you instant value and that number of example queries is continually growing.

## Example query dialog

The example query dialog appears as shown in the following screenshot: 

![Example queries screen](media/saved-queries/example-query-start.png)

Each example query is represented by a card. You can quickly scan through the queries to find what you need. You can run the query directly from the dialog or choose to load it to the query editor for additional fine tuning and tweaking.

## In-context queries

The new example query experience shows results in context. The system automatically shows only queries relevant to the scope you have selected. For example, the previous screenshot shows the logs screen for a Azure Key Vault instance. The example queries shown are filtered according to the resource type and so show only Key Vault related examples. This behavior is consistent for all Log Analytics scopes.

- For a **single resource** – queries are filtered according to the resource type.
- For a **resource group** - queries are filtered according to the resources in the specific resource group.
- For a **Workspace** – queries are filtered according to the solutions installed on the workspace.

## Filtering and group by

While the default query experience filers to show only queries with the right context, you can choose to remove the filter and see all the queries.

### Group by

Change the grouping of the queries by clicking the *group by* drop down list:

![Example queries screen groupby](media/saved-queries/example-query-groupby.png)

The dialog supports grouping by:

- **Resource type** – A resource as defined in Azure, such as a Virtual machine.
- **Category** – A type of information such as *Security* or *Audit*. Categories are identical to the categories defined in the Tables side pane
- **Solution** – An Azure Monitor solution associated with the queries
- **Topic** – The topic of the example query such as *Activity Logs* or *App logs*. The topic property is unique to example queries and may differ according to the specific resource type.

The grouping values also act as an active table of contents. Clicking one of the values on the left hand side of the screen scrolls the queries view right to the item clicked.

The concepts for organizing queries are very similar to the concepts of organizing tables in the tables side-pane (mentioned later in this article). The similarity is intended to provide a consistent, familiar set of tools in Log Analytics.

### Filter

You can also filter the queries according to the groupby values metioned earlier:

![Example queries screen filter](media/saved-queries/example-query-filter.png)

### Combining group by and filter

The filter and group by functionality are designed to work in tandem. They provide flexibility in how queries are arranged. For example, if you using a resource group with multiple resources, you may want to filter down to a specific resource type and arrange the resulting queries by topic.

## Favorites

You can favorite frequently-used queries to give you quicker access.

## Turning sample queries on and off

If you are a KQL pro and prefer to get directly to the query editor, you can toggle the new query dialog "off". With the toggle off, the sample dialog does not load when Log Analytics screen loads.

![Examples On-Off](media/saved-queries/examples-on-off.png)

You can always access the sample query popup experience from the *Example queries* button on the top bar of Log Analytics.

## Sidebar query experience

The new query experience is also available in a "sidebar" flavor.  All the functionality of the dialog may be accessed from the queries pane on the left-hand side of Log Analytics.

![Sidebar](media/saved-queries/sidebar-2.png)

You can hover over a query name to get the query description and additional functionality.

![Sidebar](media/saved-queries/sidebar-3.png)

## Query explorer

The query explorer experience for saving and sharing user generated queries remains unchanged for the time being.

## Next steps

[Get started with KQL Queries](get-started-queries.md)

