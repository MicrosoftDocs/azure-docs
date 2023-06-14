---
title: Use hunting bookmarks for data investigations in Microsoft Sentinel
description: This article describes how to use the Microsoft Sentinel hunting bookmarks to keep track of data.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.custom: mvc, ignite-fall-2021
ms.date: 11/09/2021
---

# Keep track of data during hunting with Microsoft Sentinel

Threat hunting typically requires reviewing mountains of log data looking for evidence of malicious behavior. During this process, investigators find events that they want to remember, revisit, and analyze as part of validating potential hypotheses and understanding the full story of a compromise.

Hunting bookmarks in Microsoft Sentinel help you do this, by preserving the queries you ran in **Microsoft Sentinel - Logs**, along with the query results that you deem relevant. You can also record your contextual observations and reference your findings by adding notes and tags. Bookmarked data is visible to you and your teammates for easy collaboration.

Now you can identify and address gaps in MITRE ATT&CK technique coverage, across all hunting queries, by mapping your custom hunting queries to MITRE ATT&CK techniques.

You can also investigate more types of entities while hunting with bookmarks, by mapping the full set of entity types and identifiers supported by Microsoft Sentinel Analytics in your custom queries. This enables you to use bookmarks to explore the entities returned in hunting query results using [entity pages](entities.md#entity-pages), [incidents](investigate-cases.md) and the [investigation graph](investigate-cases.md#use-the-investigation-graph-to-deep-dive). If a bookmark captures results from a hunting query, it automatically inherits the query's MITRE ATT&CK technique and entity mappings.

If you find something that urgently needs to be addressed while hunting in your logs, you can easily create a bookmark and either promote it to an incident or add it to an existing incident. For more information about incidents, see [Investigate incidents with Microsoft Sentinel](investigate-cases.md).

If you found something worth bookmarking, but that isn't immediately urgent, you can create a bookmark and then revisit your bookmarked data at any time on the **Bookmarks** tab of the **Hunting** pane. You can use filtering and search options to quickly find specific data for your current investigation.

You can visualize your bookmarked data by selecting **Investigate** from the bookmark details. This launches the investigation experience in which you can view, investigate, and visually communicate your findings using an interactive entity-graph diagram and timeline.

Alternatively, you can view your bookmarked data directly in the **HuntingBookmark** table in your Log Analytics workspace. For example:

:::image type="content" source="media/bookmarks/bookmark-table.png" alt-text="Screenshot of viewing hunting bookmarks table." lightbox="media/bookmarks/bookmark-table.png":::

Viewing bookmarks from the table enables you to filter, summarize, and join bookmarked data with other data sources, making it easy to look for corroborating evidence.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)] 

## Add a bookmark

1. In the Azure portal, navigate to **Microsoft Sentinel** > **Threat management** > **Hunting** to run queries for suspicious and anomalous behavior.

1. Select one of the hunting queries and on the right, in the hunting query details, select **Run Query**.

1. Select **View query results**. For example:

    :::image type="content" source="media/bookmarks/new-processes-observed-example.png" alt-text="Screenshot of viewing query results from Microsoft Sentinel hunting.":::

    This action opens the query results in the **Logs** pane.

1. From the log query results list, use the checkboxes to select one or more rows that contain the information you find interesting.

1. Select **Add bookmark**:

    :::image type="content" source="media/bookmarks/add-hunting-bookmark.png" alt-text="Screenshot of adding hunting bookmark to query." lightbox="media/bookmarks/add-hunting-bookmark.png":::

1. On the right, in the **Add bookmark** pane, optionally, update the bookmark name, add tags, and notes to help you identify what was interesting about the item.

1. Bookmarks can be optionally mapped to MITRE ATT&CK techniques or sub-techniques. MITRE ATT&CK mappings are inherited from mapped values in hunting queries, but you can also create them manually. Select the MITRE ATT&CK tactic associated with the desired technique from the drop-down menu in the **Tactics & Techniques** section of the **Add bookmark** pane. The menu will expand to show all the MITRE ATT&CK techniques, and you can select multiple techniques and sub-techniques in this menu.

    :::image type="content" source="media/bookmarks/mitre-attack-mapping.png" alt-text="Screenshot of how to map Mitre Attack tactics and techniques to bookmarks.":::

1. Now an expanded set of entities can be extracted from bookmarked query results for further investigation. In the **Entity mapping** section, use the drop-downs to select [entity types and identifiers](entities-reference.md). Then map the column in the query results containing the corresponding identifier. For example:

    :::image type="content" source="media/bookmarks/map-entity-types-bookmark.png" alt-text="Screenshot to map entity types for hunting bookmarks.":::

    To view the bookmark in the investigation graph, you must map at least one entity. Entity mappings to account, host, IP, and URL entity types you've previously created are supported, preserving backwards compatibility.

1. Click **Save** to commit your changes and add the bookmark. All bookmarked data is shared with other analysts, and is a first step toward a collaborative investigation experience.

> [!NOTE]
> The log query results support bookmarks whenever this pane is opened from Microsoft Sentinel. For example, you select **General** > **Logs** from the navigation bar, select event links in the investigations graph, or select an alert ID from the full details of an incident. You can't create bookmarks when the **Logs** pane is opened from other locations, such as directly from Azure Monitor.

## View and update bookmarks

1. In the Azure portal, navigate to **Microsoft Sentinel** > **Threat management** > **Hunting**.

2. Select the **Bookmarks** tab to view the list of bookmarks.

3. To help you find a specific bookmark, use the search box or filter options.

4. Select individual bookmarks and view the bookmark details in the right-hand details pane.

5. Make your changes as needed, which are automatically saved.

## Exploring bookmarks in the investigation graph

1. In the Azure portal, navigate to **Microsoft Sentinel** > **Threat management** > **Hunting** > **Bookmarks** tab, and select the bookmark or bookmarks you want to investigate.

2. In the bookmark details, ensure that at least one entity is mapped.

3. Select **Investigate** to view the bookmark in the investigation graph.

For instructions to use the investigation graph, see [Use the investigation graph to deep dive](investigate-cases.md#use-the-investigation-graph-to-deep-dive).

## Add bookmarks to a new or existing incident

1. In the Azure portal, navigate to **Microsoft Sentinel** > **Threat management** > **Hunting** > **Bookmarks** tab, and select the bookmark or bookmarks you want to add to an incident.

2. Select **Incident actions** from the command bar:

    :::image type="content" source="media/bookmarks/incident-actions.png" alt-text="Screenshot of adding bookmarks to incident.":::

3. Select either **Create new incident** or **Add to existing incident**, as appropriate. Then:

    - For a new incident: Optionally update the details for the incident, and then select **Create**.
    - For adding a bookmark to an existing incident: Select one incident, and then select **Add**.

To view the bookmark within the incident: Navigate to **Microsoft Sentinel** > **Threat management** > **Incidents** and select the incident with your bookmark. Select **View full details**, and then select the **Bookmarks** tab.

> [!TIP]
> As an alternative to the **Incident actions** option on the command bar, you can use the context menu (**...**) for one or more bookmarks to select options to **Create new incident**, **Add to existing incident**, and **Remove from incident**.

## View bookmarked data in logs

To view bookmarked queries, results, or their history, select the bookmark from the **Hunting** > **Bookmarks** tab, and use the links provided in the details pane:

- **View source query** to view the source query in the **Logs** pane.

- **View bookmark logs** to see all bookmark metadata, which includes who made the update, the updated values, and the time the update occurred.

You can also view the raw bookmark data for all bookmarks by selecting **Bookmark Logs** from the command bar on the **Hunting** > **Bookmarks** tab:

:::image type="content" source="media/bookmarks/bookmark-logs.png" alt-text="Screenshot of bookmark logs command.":::

This view shows all your bookmarks with associated metadata. You can use [Kusto Query Language](/azure/data-explorer/kql-quick-reference) (KQL) queries to filter down to the latest version of the specific bookmark you are looking for.

> [!NOTE]
> There can be a significant delay (measured in minutes) between the time you create a bookmark and when it is displayed in the **Bookmarks** tab.

## Delete a bookmark

1. In the Azure portal, navigate to **Microsoft Sentinel** > **Threat management** > **Hunting** > **Bookmarks** tab, and select the bookmark or bookmarks you want to delete.

2. Right-click your selections, and select the option to delete the number of bookmarks you have selected.

Deleting the bookmark removes the bookmark from the list in the **Bookmark** tab. The **HuntingBookmark** table for your Log Analytics workspace will continue to contain previous bookmark entries, but the latest entry will change the **SoftDelete** value to true, making it easy to filter out old bookmarks. Deleting a bookmark does not remove any entities from the investigation experience that are associated with other bookmarks or alerts.

## Next steps

In this article, you learned how to run a hunting investigation using bookmarks in Microsoft Sentinel. To learn more about Microsoft Sentinel, see the following articles:

- [Proactively hunt for threats](hunting.md)
- [Use notebooks to run automated hunting campaigns](notebooks.md)
- [Threat hunting with Microsoft Sentinel (Learn module)](/training/modules/hunt-threats-sentinel/)
