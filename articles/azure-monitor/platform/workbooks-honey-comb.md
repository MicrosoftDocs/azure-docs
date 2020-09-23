---
title: Azure Monitor workbook honey comb visualizations
description: Learn about Azure Monitor workbook honey comb visualizations.
services: azure-monitor
author: lgayhardt

ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 09/18/2020
ms.author: lagayhar
---

# Honey comb visualizations

Honey combs allow high density views of metrics or categories that can optionally be grouped as clusters. They are useful in visually identifying hotspots and drilling in further.

The image below shows the CPU utilization of  virtual machines across two subscriptions. Each cell represents a virtual machine and the color/label represents its average CPU utilization (reds are hot machines). The virtual machines are clustered by subscription.

[![Screenshot shows the CPU utilization of virtual machines across two subscriptions](.\media\workbooks-honey-comb\cpu-example.png)](.\media\workbooks-honey-comb\cpu-example.png#lightbox)

## Adding a honey comb

1. Switch the workbook to edit mode by clicking on the Edit toolbar item.
2. Use **Add**  at the bottom then *Add query* to add a log query control to the workbook.
3. Select the "Logs" as the *Data source*, "Log Analytics" as the *Resource type*, and for *Resource* point to a workspace that has virtual machine performance log.
4. Use the query editor to enter the KQL for your analysis.

```kusto
    Perf
| where CounterName == 'Available MBytes'
| summarize CounterValue = avg(CounterValue) by Computer, _ResourceId
| extend ResourceGroup = extract(@'/subscriptions/.+/resourcegroups/(.+)/providers/microsoft.compute/virtualmachines/.+', 1, _ResourceId)
| extend ResourceGroup = iff(ResourceGroup == '', 'On-premise computers', ResourceGroup), Id = strcat(_ResourceId, '::', Computer)
```

5. Run query.
6. Set the *visualization* to "Graph".
7. Select **Graph Settings**.
    1. In *Layout Fields* at the bottom, set:
        1. Graph type: **Hive Clusters**.
        2. Node Id:`Id`.
        3. Group by: `None`.
        4. Node Size: 100.
        5. Margin between hexagons: `5`.
        6. Coloring type: **Heatmap**.
        7. Node Color Field: `CouterValue`.
        8. Color palette: `Red to Green`.
        9. Minimum value: `100`.
        10. Maximum value: `2000`.
    2. In *Node Format Settings* at the top, set:
        1. Top Content:
            1. Use Column: `Computer`.
            2. Column Renderer" `Text`.
        9. Center Content:
            1. Use Column: `CounterValue`.
            2. Column Renderer: `Big Number`.
            3. Color Palette: `None`.
            4. Check the *Custom number formatting* box.
            5. Units: `Megabytes`.
            6. Maximum fractional digits: `1`.
8. Select **Save and Close** button at the bottom of the pane.

[![Screenshot of query control, graph settings, and honey comb with the above query and settings](.\media\workbooks-honey-comb\available-memory.png)](.\media\workbooks-honey-comb\available-memory.png#lightbox)

## Honey comb layout settings

| Setting | Explanation |
|:------------- |:-------------|
| `Node Id` | Selects a column that provides the unique ID of nodes. Value of the column can be string or a number. |
| `Group By Field` | Select the column to cluster the nodes on. |
| `Node Size` | Sets the size of the hexagonal cells. Use with the `Margin between hexagons` property to customize the look of the honey comb chart. |
| `Margin between hexagons` | Sets the gap between the hexagonal cells. Use with the `Node size` property to customize the look of the honey comb chart. |
| `Coloring type` | Selects the scheme to use to color the node. |
| `Node Color Field` | Selects a column that provides the metric on which the node areas will be based on. |

## Node coloring types

| Coloring Type | Explanation |
|:------------- |:-------------|
| `None` | All nodes have the same color. |
| `Categorical` | Nodes are assigned colors based on the value or category from a column in the result set. In the example above, the coloring is based on the column _Kind_ of the result set. Supported palettes are `Default`, `Pastel`, and `Cool tone`.  |
| `Heatmap` | In this type, the cells are colored based on a metric column and a color palette. This provides a simple way to highlight metrics spreads across cells. |
| `Thresholds` | In this type, cell colors are set by threshold rules (for example, _CPU > 90%  => Red, 60% > CPU > 90% => Yellow, CPU < 60% => Green_) |
| `Field Based` | In this type, a column provides specific RGB values to use for the node. Provides the most flexibility but usually requires more work to enable.  |
      
## Node format settings

Honey comb authors can specify what content goes to the different parts of a node: top, left, center, right, and bottom. Authors are free to use any of the renderers workbooks supports (text, big number, spark lines, icon, etc.).

## Next steps

- Learn how to create a [Composite bar renderer in workbooks](workbooks-composite-bar.md).
- Learn how to [import Azure Monitor log data into Power BI](powerbi.md).
