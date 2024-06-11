---
title: Hunt with bookmarks in Microsoft Sentinel
description: This article describes how to use the Microsoft Sentinel hunting bookmarks to keep track of data.
ms.author: austinmc
author: austinmccollum
ms.topic: how-to
ms.date: 04/23/2024
ms.collection: usx-security
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
---

# Keep track of data during hunting with Microsoft Sentinel

Hunting bookmarks in Microsoft Sentinel helps you preserve the queries and query results that you deem relevant. You can also record your contextual observations and reference your findings by adding notes and tags. Bookmarked data is visible to you and your teammates for easy collaboration. For more information, see [Bookmarks](hunting.md#bookmarks-to-keep-track-of-data).

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Add a bookmark

Create a bookmark to preserve the queries, results, your observations, and findings.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Threat management**  select **Hunting**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Threat management** > **Hunting**.
1. From the **Hunting** tab, select a hunt.
1. Select one of the hunting queries.
1. In the hunting query details, select **Run Query**.

1. Select **View query results**. For example:

    :::image type="content" source="media/bookmarks/new-processes-observed-example.png" alt-text="Screenshot of viewing query results from Microsoft Sentinel hunting.":::

    This action opens the query results in the **Logs** pane.

1. From the log query results list, use the checkboxes to select one or more rows that contain the information you find interesting.

1. Select **Add bookmark**:

    :::image type="content" source="media/bookmarks/add-hunting-bookmark.png" alt-text="Screenshot of adding hunting bookmark to query." lightbox="media/bookmarks/add-hunting-bookmark.png":::

1. On the right, in the **Add bookmark** pane, optionally, update the bookmark name, add tags, and notes to help you identify what was interesting about the item.

1. Bookmarks can be optionally mapped to MITRE ATT&CK techniques or sub-techniques. MITRE ATT&CK mappings are inherited from mapped values in hunting queries, but you can also create them manually. Select the MITRE ATT&CK tactic associated with the desired technique from the drop-down menu in the **Tactics & Techniques** section of the **Add bookmark** pane. The menu expands to show all the MITRE ATT&CK techniques, and you can select multiple techniques and sub-techniques in this menu.

    :::image type="content" source="media/bookmarks/mitre-attack-mapping.png" alt-text="Screenshot of how to map Mitre Attack tactics and techniques to bookmarks.":::

1. Now an expanded set of entities can be extracted from bookmarked query results for further investigation. In the **Entity mapping** section, use the drop-downs to select [entity types and identifiers](entities-reference.md). Then map the column in the query results containing the corresponding identifier. For example:

    :::image type="content" source="media/bookmarks/map-entity-types-bookmark.png" alt-text="Screenshot to map entity types for hunting bookmarks.":::

    To view the bookmark in the investigation graph, you must map at least one entity. Entity mappings to account, host, IP, and URL entity types you created are supported, preserving backwards compatibility.

1. Select **Save** to commit your changes and add the bookmark. All bookmarked data is shared with other analysts, and is a first step toward a collaborative investigation experience.

The log query results support bookmarks whenever this pane is opened from Microsoft Sentinel. For example, you select **General** > **Logs** from the navigation bar, select event links in the investigations graph, or select an alert ID from the full details of an incident. You can't create bookmarks when the **Logs** pane is opened from other locations, such as directly from Azure Monitor.

## View and update bookmarks

Find and update a bookmark from the bookmark tab.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Threat management**  select **Hunting**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Threat management** > **Hunting**.

2. Select the **Bookmarks** tab to view the list of bookmarks.

3. Search or filter to find a specific bookmark or bookmarks.

4. Select individual bookmarks to view the bookmark details in the right-hand pane.

5. Make your changes as needed. Your changes are automatically saved.

## Exploring bookmarks in the investigation graph

Visualize your bookmarked data by launching the investigation experience in which you can view, investigate, and visually communicate your findings by using an interactive entity-graph diagram and timeline.

1. From the **Bookmarks** tab, select the bookmark or bookmarks you want to investigate.

2. In the bookmark details, ensure that at least one entity is mapped.

3. Select **Investigate** to view the bookmark in the investigation graph.

For instructions to use the investigation graph, see [Use the investigation graph to deep dive](investigate-cases.md#use-the-investigation-graph-to-deep-dive).

## Add bookmarks to a new or existing incident

Add bookmarks to an incident from the bookmarks tab on the **Hunting** page. 

1. From the **Bookmarks** tab, select the bookmark or bookmarks you want to add to an incident.

1. Select **Incident actions** from the command bar:

    :::image type="content" source="media/bookmarks/incident-actions.png" alt-text="Screenshot of adding bookmarks to incident.":::

1. Select either **Create new incident** or **Add to existing incident**, as appropriate. Then:

    - For a new incident: Optionally update the details for the incident, and then select **Create**.
    - For adding a bookmark to an existing incident: Select one incident, and then select **Add**.

1. To view the bookmark within the incident, 
   1. Go to **Microsoft Sentinel** > **Threat management** > **Incidents**.
   1. Select the incident with your bookmark and **View full details**.
   1. On the incident page, in the left pane, select the **Bookmarks**.


## View bookmarked data in logs

View bookmarked queries, results, or their history.

1. From the **Hunting** > **Bookmarks** tab, select the bookmark. 
1. From the details pane, select the following links:

   - **View source query** to view the source query in the **Logs** pane.

   - **View bookmark logs** to see all bookmark metadata, which includes who made the update, the updated values, and the time the update occurred.

1. From the command bar on the **Hunting** > **Bookmarks** tab, select **Bookmark Logs** to view the raw bookmark data for all bookmarks.

   :::image type="content" source="media/bookmarks/bookmark-logs.png" alt-text="Screenshot of bookmark logs command.":::

This view shows all your bookmarks with associated metadata. You can use [Kusto Query Language](/azure/data-explorer/kql-quick-reference) (KQL) queries to filter down to the latest version of the specific bookmark you're looking for.

There can be a significant delay (measured in minutes) between the time you create a bookmark and when it's displayed in the **Bookmarks** tab.

## Delete a bookmark

Deleting the bookmark removes the bookmark from the list in the **Bookmark** tab. The **HuntingBookmark** table for your Log Analytics workspace continues to contain previous bookmark entries, but the latest entry changes the **SoftDelete** value to true, making it easy to filter out old bookmarks. Deleting a bookmark doesn't remove any entities from the investigation experience that are associated with other bookmarks or alerts.

To delete a bookmark, complete the following steps.

1. From the **Hunting** > **Bookmarks** tab, select the bookmark or bookmarks you want to delete.

2. Right-click, and select the option to delete the  bookmarks selected.

## Related content

In this article, you learned how to run a hunting investigation using bookmarks in Microsoft Sentinel. To learn more about Microsoft Sentinel, see the following articles:

- [Threat hunting with Microsoft Sentinel](hunting.md)
- [Use notebooks to run automated hunting campaigns](notebooks.md)
- [Threat hunting with Microsoft Sentinel (Training module)](/training/modules/hunt-threats-sentinel/)
