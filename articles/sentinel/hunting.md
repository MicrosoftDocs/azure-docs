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
ms.date: 07/14/2021
ms.author: yelevin
---

# Hunt for threats with Azure Sentinel

> [!IMPORTANT]
>
> The cross-resource query experience and upgrades to the **hunting dashboard** (see marked items below) are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

As security analysts and investigators, you want to be proactive about looking for security threats, but your various systems and security appliances generate mountains of data that can be difficult to parse and filter into meaningful events. Azure Sentinel has powerful hunting search and query tools to hunt for security threats across your organization's data sources. To help security analysts look proactively for new anomalies that weren't detected by your security apps or even by your scheduled analytics rules, Azure Sentinel's built-in hunting queries guide you into asking the right questions to find issues in the data you already have on your network. 

For example, one built-in query provides data about the most uncommon processes running on your infrastructure. You wouldn't want an alert about each time they are run - they could be entirely innocent - but you might want to take a look at the query on occasion to see if there's anything unusual.

## Use built-in queries

The [hunting dashboard](#use-the-hunting-dashboard-public-preview) provides ready-made query examples designed to get you started and get you familiar with the tables and the query language. Queries run on data stored in log tables, such as for process creation, DNS events, or other event types.

Built-in hunting queries are developed by Microsoft security researchers on a continuous basis, both adding new queries and fine-tuning existing queries to provide you with an entry point to look for new detections and figure out where to start hunting for the beginnings of new attacks.

Use queries before, during, and after a compromise to take the following actions:

- **Before an incident occurs**: Waiting on detections is not enough. Take proactive action by running any threat-hunting queries related to the data you're ingesting into your workspace at least once a week.

    Results from your proactive hunting provide early insight into events that may confirm that a compromise is in process, or will at least show weaker areas in your environment that are at risk and need attention.

- **During a compromise**:  Use [livestream](livestream.md) to run a specific query constantly, presenting results as they come in. Use livestream when you need to actively monitor user events, such as if you need to verify whether a specific compromise is still taking place, to help determine a threat actor's next action, and towards the end of an investigation to confirm that the compromise is indeed over.

- **After a compromise**:  After a compromise or an incident has occurred, make sure to improve your coverage and insight to prevent similar incidents in the future.

    - Modify your existing queries or create new ones to assist with early detection, based on insights you've gained from your compromise or incident.

    - If you've discovered or created a hunting query that provides high value insights into possible attacks, create custom detection rules based on that query and surface those insights as alerts to your security incident responders.

        View the query's results, and select **New alert rule** > **Create Azure Sentinel alert**. Use the **Analytics rule wizard** to create a new rule based on your query. For more information, see [Create custom analytics rules to detect threats](detect-threats-custom.md).


> [!TIP]
> - Now in public preview, you can also create hunting and livestream queries over data stored in Azure Data Explorer. For more information, see details of [constructing cross-resource queries](../azure-monitor/logs/azure-monitor-data-explorer-proxy.md) in the Azure Monitor documentation.
>
> - Use community resources, such as the [Azure Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Hunting%20Queries) to find additional queries and data sources.
>

## Use the hunting dashboard (Public preview)

The hunting dashboard enables you to run all your queries, or a selected subset, in a single selection. In the Azure Sentinel portal, select **Hunting**.

The table shown lists all the queries written by Microsoft's team of security analysts and any extra query you created or modified. Each query provides a description of what it hunts for, and what kind of data it runs on. These templates are grouped by their various tactics - the icons on the right categorize the type of threat, such as initial access, persistence, and exfiltration.

:::image type="content" source="media/hunting/hunting-start.png" alt-text="Azure Sentinel starts hunting" lightbox="media/hunting/hunting-start.png":::

Use the hunting dashboard to identify where to start hunting, by looking at result count, spikes, or the change in result count over a 24-hour period. Sort and filter by favorites, data source, MITRE ATT&CK tactic or technique, results, or results delta. View queries that still need data sources connected**, and get recommendations on how to enable these queries.

The following table describes detailed actions available from the hunting dashboard:

|Action  |Description  |
|---------|---------|
|**See how queries apply to your environment**     |   Select the **Run all queries (Preview)** button, or select a subset of queries using the check boxes to the left of each row and select the **Run selected queries (Preview)** button. <br><br>Running your queries can take anywhere from a few seconds to many minutes, depending on how many queries are selected, the time range, and the amount of data that is being queried.      |
|**View the queries that returned results**    |      After your queries are done running, view the queries that returned results using the **Results** filter: <br>- Sort to see which queries had the most or fewest results. <br>- View the queries that are not at all active in your environment by selecting *N/A* in the **Results** filter. <br>- Hover over the info icon (**i**) next to the *N/A* to see which data sources are required to make this query active.  |
|**Identify spikes in your data**     |   Identify spikes in the data by sorting or filtering on **Results delta**. <br><br>This compares the results of the last 24 hours against the results of the previous 24-48 hours, highlighting any large differences in volume.     |
|**View queries mapped to the MITRE Att&CK tactic**     | The **MITRE ATT&CK tactic bar**, at the top of the table, lists how many queries are mapped to each MITRE ATT&CK tactic. The tactic bar gets dynamically updated based on the current set of filters applied. <br><br>This enables you to see which MITRE ATT&CK tactics show up when you filter by a given result count, a high result delta, *N/A* results, or any other set of filters.        |
|**View queries mapped to MITRE ATT&CK techniques**     | Queries can also be mapped to MITRE ATT&CK techniques. You can filter or sort by MITRE ATT&CK techniques using the **Technique** filter. By opening a query, you will be able to select the technique to see the MITRE ATT&CK description of the technique.        |
|**Save a query to your favorites**     |   Queries saved to your favorites automatically run each time the **Hunting** page is accessed. You can create your own hunting query or clone and customize an existing hunting query template.      |
|**Run queries**     |   Select **Run Query** in the hunting query details page to run the query directly from the hunting page. The number of matches is displayed within the table, in the **Results** column. Review the list of hunting queries and their matches.     |
|**Review an underlying query**     | Perform a quick review of the underlying query in the query details pane. You can see the results by clicking the **View query results** link (below the query window) or the **View Results** button (at the bottom of the pane). The query will open in the **Logs** (Log Analytics) blade, and below the query, you can review the matches for the query.         |
|     |         |


## Create your own bookmarks

During the hunting and investigation process, you may come across query results that may look unusual or suspicious. Bookmark these items refer back to them in the future, such as when creating or enriching an incident for investigation.

- In your results, mark the checkboxes for any rows you want to preserve, and select **Add bookmark**. This creates for a record for each marked row - a bookmark - that contains the row results, the query that created the results, and entity mappings to extract users, hosts, and IP addresses. You can add your own tags and notes to each bookmark.

- View all the bookmarked findings by clicking on the **Bookmarks** tab in the main **Hunting** page. Add tags to bookmarks to classify them for filtering. For example, if you're investigating an attack campaign, you can create a tag for the campaign, apply the tag to any relevant bookmarks, and then filter all the bookmarks based on the campaign.

- Investigate a single bookmarked finding by selecting the bookmark and then clicking **Investigate** in the details pane to open the investigation experience.

    You can also create an incident from one or more bookmarks or add one or more bookmarks to an existing incident. Select a checkbox to the left of any bookmarks you want to use, and then select **Incident actions** > **Create new incident** or **Add to existing incident**. Triage and investigate the incident like any other.


> [!TIP]
> Bookmarks stand to represent key events that are noteworthy and should be escalated to incidents if they are severe enough to warrant an investigation. Events such as potential root causes, indicators of compromise, or other notable events should be raised as a bookmark.
>

For more information, see [Use bookmarks in hunting](bookmarks.md).

## Use notebooks to power investigations

Notebooks give you a kind of virtual sandbox environment, complete with its own kernel. You can use notebooks to enhance your hunting and investigations with machine learning, visualization, and data analysis. You can carry out a complete investigation in a notebook, encapsulating the raw data, the code you run on it, the results, and their visualizations, and save the whole thing so that it can be shared with and reused by others in your organization.

For more information, see [Use Jupyter Notebook to hunt for security threats](notebooks.md).


## Useful operators and functions

Hunting queries are built in [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/), a powerful query language with IntelliSense language that gives you the power and flexibility you need to take hunting to the next level.

It's the same language used by the queries in your analytics rules and elsewhere in Azure Sentinel. For more information, see [Query Language Reference](../azure-monitor/logs/get-started-queries.md).

The following operators are especially helpful in Azure Sentinel hunting queries:

- **where** - Filter a table to the subset of rows that satisfy a predicate.

- **summarize** - Produce a table that aggregates the content of the input table.

- **join** - Merge the rows of two tables to form a new table by matching values of the specified column(s) from each table.

- **count** - Return the number of records in the input record set.

- **top** - Return the first N records sorted by the specified columns.

- **limit** - Return up to the specified number of rows.

- **project** - Select the columns to include, rename or drop, and insert new computed columns.

- **extend** - Create calculated columns and append them to the result set.

- **makeset** - Return a dynamic (JSON) array of the set of distinct values that Expr takes in the group

- **find** - Find rows that match a predicate across a set of tables.

- **adx() (preview)** - This function performs cross-resource queries of Azure Data Explorer data sources from the Azure Sentinel hunting experience and Log Analytics. For more information, see [Cross-resource query Azure Data Explorer by using Azure Monitor](../azure-monitor/logs/azure-monitor-data-explorer-proxy.md).

## Save a query

Create or modify a query and save it as your own query or share it with users who are in the same tenant.

:::image type="content" source="./media/hunting/save-query.png" alt-text="Save query" lightbox="./media/hunting/save-query.png":::

**To create a new query**:

1. Select **New query**.

1. Fill in all the blank fields and select **Create**.

    :::image type="content" source="./media/hunting/new-query.png" alt-text="New query" lightbox="./media/hunting/new-query.png":::

**To clone and modify an existing query**:

1. Select the hunting query in the table you want to modify.

1. Select the ellipsis (...) in the line of the query you want to modify, and select **Clone query**.

    :::image type="content" source="./media/hunting/clone-query.png" alt-text="Clone query" lightbox="./media/hunting/clone-query.png":::

1. Modify the query and select **Create**.

    :::image type="content" source="./media/hunting/custom-query.png" alt-text="Custom query" lightbox="./media/hunting/custom-query.png":::



## Sample query

A typical query starts with a table name followed by a series of operators separated by \|.

In the example above, start with the table name SecurityEvent and add piped elements as needed.

1. Define a time filter to review only records from the previous seven days.

1. Add a filter in the query to only show event ID 4688.

1. Add a filter in the query on the CommandLine to contain only instances of cscript.exe.

1. Project only the columns you're interested in exploring and limit the results to 1000 and select **Run query**.

1. Select the green triangle and run the query. You can test the query and run it to look for anomalous behavior.

## Next steps

In this article, you learned how to run a hunting investigation with Azure Sentinel. 

For more information, see:

- [Use notebooks to run automated hunting campaigns](notebooks.md)
- [Use bookmarks to save interesting information while hunting](bookmarks.md)

Learn from an example of using custom analytics rules when [monitoring Zoom](https://techcommunity.microsoft.com/t5/azure-sentinel/monitoring-zoom-with-azure-sentinel/ba-p/1341516) with a [custom connector](create-custom-connector.md).

