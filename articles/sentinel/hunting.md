---
title: Hunting capabilities in Azure Sentinel| Microsoft Docs
description: Use Azure Sentinel's built-in hunting queries to guide you into asking the right questions to find issues in your data.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.assetid: 6aa9dd27-6506-49c5-8e97-cc1aebecee87
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/27/2021
ms.author: yelevin
---

# Hunt for threats with Azure Sentinel

> [!IMPORTANT]
>
> - Upgrades to the **hunting dashboard** are currently in **PREVIEW**. Items below relating to this upgrade will be marked as "(preview)". See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]


As security analysts and investigators, you want to be proactive about looking for security threats, but your various systems and security appliances generate mountains of data that can be difficult to parse and filter into meaningful events. Azure Sentinel has powerful hunting search and query tools to hunt for security threats across your organization's data sources. To help security analysts look proactively for new anomalies that weren't detected by your security apps or even by your scheduled analytics rules, Azure Sentinel's built-in hunting queries guide you into asking the right questions to find issues in the data you already have on your network. 

For example, one built-in query provides data about the most uncommon processes running on your infrastructure. You wouldn't want an alert about each time they are run - they could be entirely innocent - but you might want to take a look at the query on occasion to see if there's anything unusual. 

With Azure Sentinel hunting, you can take advantage of the following capabilities:

- **Built-in queries**: The main hunting page, accessible from the Azure Sentinel navigation menu, provides ready-made query examples designed to get you started and get you familiar with the tables and the query language. These built-in hunting queries are developed by Microsoft security researchers on a continuous basis, both adding new queries and fine-tuning existing queries to provide you with an entry point to look for new detections and figure out where to start hunting for the beginnings of new attacks. 

- **Powerful query language with IntelliSense**: Hunting queries are built in [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/), a query language that gives you the power and flexibility you need to take hunting to the next level. It's the same language used by the queries in your analytics rules and elsewhere in Azure Sentinel.

- **Hunting dashboard (preview)**: This upgrade of the main page lets you run all your queries, or a selected subset, in a single click. Identify where to start hunting by looking at result count, spikes, or the change in result count over a 24-hour period. You can also sort and filter by favorites, data source, MITRE ATT&CK tactic or technique, results, or results delta. View the queries that do not yet have the necessary data sources connected, and get recommendations on how to enable these queries.

- **Create your own bookmarks**: During the hunting process, you may come across query results that may look unusual or suspicious. You can "bookmark" these items - saving them and putting them aside so you can refer back to them in the future. You can use your bookmarked items to create or enrich an incident for investigation. For more information about bookmarks, see [Use bookmarks in hunting](bookmarks.md).

- **Use notebooks to power investigation**: Notebooks give you a kind of virtual sandbox environment, complete with its own kernel. You can use notebooks to enhance your hunting and investigations with machine learning, visualization, and data analysis. You can carry out a complete investigation in a notebook, encapsulating the raw data, the code you run on it, the results, and their visualizations, and save the whole thing so that it can be shared with and reused by others in your organization. 

- **Query the stored data**: The data is accessible in tables for you to query. For example, you can query process creation, DNS events, and many other event types.

- **Links to community**: Leverage the power of the greater community to find additional queries and data sources.
 
## Get started hunting

In the Azure Sentinel portal, click **Hunting**.

   :::image type="content" source="media/hunting/hunting-start.png" alt-text="Azure Sentinel starts hunting" lightbox="media/hunting/hunting-start.png":::

- When you open the **Hunting** page, all the hunting queries are displayed in a single table. The table lists all the queries written by Microsoft's team of security analysts as well as any additional query you created or modified. Each query provides a description of what it hunts for, and what kind of data it runs on. These templates are grouped by their various tactics - the icons on the right categorize the type of threat, such as initial access, persistence, and exfiltration.

- (Preview) To see how the queries apply to your environment, click the **Run all queries (Preview)** button, or select a subset of queries using the check boxes to the left of each row and select the **Run selected queries (Preview)** button. Executing the queries can take anywhere from a few seconds to many minutes, depending on how many queries are selected, the time range, and the amount of data that is being queried.

- (Preview) Once your queries are done running, you can see which queries returned results using the **Results** filter. You can then sort to see which queries had the most or fewest results. You can also see which queries are not active in your environment by selecting *N/A* in the **Results** filter. Hover over the info icon (i) next to the *N/A* to see which data sources are required to make this query active.

- (Preview) You can identify spikes in the data by sorting or filtering on **Results delta**. This compares the results of the last 24 hours against the results of the previous 24-48 hours to make it easy to see large differences in volume.

- (Preview) The **MITRE ATT&CK tactic bar**, at the top of the table, lists how many queries are mapped to each MITRE ATT&CK tactic. The tactic bar gets dynamically updated based on the current set of filters applied. This is an easy way to see which MITRE ATT&CK tactics show up when you filter by a given result count, a high result delta, *N/A* results, or any other set of filters.

- (Preview) Queries can also be mapped to MITRE ATT&CK techniques. You can filter or sort by MITRE ATT&CK techniques using the **Technique** filter. By opening a query, you will be able to click on the technique to see the MITRE ATT&CK description of the technique.

- You can save any query to your favorites. Queries saved to your favorites automatically run each time the **Hunting** page is accessed. You can create your own hunting query or clone and customize an existing hunting query template.
 
- By clicking **Run Query** in the hunting query details page, you can run any query without leaving the hunting page. The number of matches is displayed within the table, in the **Results** column. Review the list of hunting queries and their matches.

- You can perform a quick review of the underlying query in the query details pane. You can see the results by clicking the **View query results** link (below the query window) or the **View Results** button (at the bottom of the pane). The query will open in the **Logs** (Log Analytics) blade, and below the query, you can review the matches for the query.

- To preserve suspicious or interesting findings from a query in Log Analytics, mark the check boxes of the rows you wish to preserve and select **Add bookmark**. This creates for each marked row a record - a bookmark - that contains the row results, the query that created the results, and entity mappings to extract users, hosts, and IP addresses. You can add your own tags (see below) and notes to each bookmark.

- You can see all the bookmarked findings by clicking on the **Bookmarks** tab in the main **Hunting** page. You can add tags to bookmarks to classify them for filtering. For example, if you're investigating an attack campaign, you can create a tag for the campaign, apply the tag to any relevant bookmarks, and then filter all the bookmarks based on the campaign.

- You can investigate a single bookmarked finding by selecting the bookmark and then clicking **Investigate** in the details pane to open the investigation experience. You can also create an incident from one or more bookmarks, or add one or more bookmarks to an existing incident, by marking the check boxes to the left of the desired bookmarks and then selecting either **Create new incident** or **Add to existing incident** from the **Incident actions** drop-down menu near the top of the screen. You can then triage and investigate the incident like any other.

- Having discovered or created a hunting query that provides high value insights into possible attacks, you can create custom detection rules based on that query and surface those insights as alerts to your security incident responders. View the query's results in Log Analytics (see above), then click the **New alert rule** button at the top of the pane and select **Create Azure Sentinel alert**. The **Analytics rule wizard** will open. Complete the required steps as explained in [Tutorial: Create custom analytics rules to detect threats](tutorial-detect-threats-custom.md).

## Query language 

Hunting in Azure Sentinel is based on Kusto query language. For more information on the query language and supported operators, see [Query Language Reference](../azure-monitor/logs/get-started-queries.md).

## Public hunting query GitHub repository

Check out the [Hunting query repository](https://github.com/Azure/Azure-Sentinel/tree/master/Hunting%20Queries). Contribute and use example queries shared by our customers.

 ## Sample query

A typical query starts with a table name followed by a series of operators separated by \|.

In the example above, start with the table name SecurityEvent and add piped elements as needed.

1. Define a time filter to review only records from the previous seven days.

1. Add a filter in the query to only show event ID 4688.

1. Add a filter in the query on the CommandLine to contain only instances of cscript.exe.

1. Project only the columns you're interested in exploring and limit the results to 1000 and click **Run query**.

1. Click the green triangle and run the query. You can test the query and run it to look for anomalous behavior.

## Useful operators

The query language is powerful and has many available operators, some useful ones of which are listed here:

**where** - Filter a table to the subset of rows that satisfy a predicate.

**summarize** - Produce a table that aggregates the content of the input table.

**join** - Merge the rows of two tables to form a new table by matching values of the specified column(s) from each table.

**count** - Return the number of records in the input record set.

**top** - Return the first N records sorted by the specified columns.

**limit** - Return up to the specified number of rows.

**project** - Select the columns to include, rename or drop, and insert new computed columns.

**extend** - Create calculated columns and append them to the result set.

**makeset** - Return a dynamic (JSON) array of the set of distinct values that Expr takes in the group

**find** - Find rows that match a predicate across a set of tables.

## Save a query

You can create or modify a query and save it as your own query or share it with users who are in the same tenant.

:::image type="content" source="./media/hunting/save-query.png" alt-text="Save query" lightbox="./media/hunting/save-query.png":::

### Create a new hunting query

1. Click **New query**.

1. Fill in all the blank fields and select **Create**.

    :::image type="content" source="./media/hunting/new-query.png" alt-text="New query" lightbox="./media/hunting/new-query.png":::

### Clone and modify an existing hunting query

1. Select the hunting query in the table you want to modify.

1. Select the ellipsis (...) in the line of the query you want to modify, and select **Clone query**.

    :::image type="content" source="./media/hunting/clone-query.png" alt-text="Clone query" lightbox="./media/hunting/clone-query.png":::

1. Modify the query and select **Create**.

    :::image type="content" source="./media/hunting/custom-query.png" alt-text="Custom query" lightbox="./media/hunting/custom-query.png":::

## Next steps

In this article, you learned how to run a hunting investigation with Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- [Use notebooks to run automated hunting campaigns](notebooks.md)
- [Use bookmarks to save interesting information while hunting](bookmarks.md)
