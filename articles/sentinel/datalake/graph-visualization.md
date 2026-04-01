---
title: Visualize custom graphs in Microsoft Sentinel graph (preview)
description: Learn how to use Microsoft Sentinel graph to query, visualize, and interact with custom security graphs to gain new security insights.
author: EdB-MSFT
ms.author: edbaynash
ms.date: 03/26/2026
ms.topic: how-to
ms.service: microsoft-sentinel
ms.subservice: sentinel-graph

#Customer intent: As a security analyst, I want to use Microsoft Sentinel graph to query and visualize custom security graphs so that I can gain new insights into entity relationships and threats in my environment.
---

# Visualize graphs in Microsoft Sentinel (preview)

The graphs experience in the Microsoft Defender portal enables you to perform interactive graph-based investigations on your custom graphs, such as using a graph built for phishing analysis to help you quickly evaluate the impact of a recent incident, profile the attacker, and trace its paths across Microsoft telemetry and third-party data. This experience allows you to run graph queries to visualize the insights that matter most to your organization and supports ad hoc traversal of the graph so you can quickly investigate entities of interest. You can study the graph schema to understand the relationships defined on your graph and use any of the displayed metadata to narrow down your results. You can quickly validate your results with the table view and export them for easy integration into any preexisting workflows. Use Jupyter Notebooks in Microsoft Visual Studio Code to create and materialize your custom graphs, then use the graph experience in Microsoft Sentinel to query and visualize your custom graphs.

This article explains how to use Sentinel graph to query, visualize, and interact with graphs to obtain new insights.

## Prerequisites

+ A custom graph exists in your tenant. 
+ To access the graph experience in Microsoft Sentinel and query it to produce visualizations, you must have the appropriate permissions. For more information, see [Get started with custom graphs in Microsoft Sentinel](./create-custom-graphs.md#permissions).


## Access graphs

To access the graph experience in Microsoft Sentinel, login to the Microsoft Defender portal, select **Microsoft Sentinel** > **Graphs** from the navigation pane.

The Sentinel Graph management page lists any custom graphs that you created using the Visual Studio Code Sentinel extension. If you haven't created a custom graph, [Create a custom graph](./create-custom-graphs.md) to get started.

If you already created custom graphs, the Sentinel graph management page displays all available custom graphs. View an overview of each custom graph by selecting the **...** menu on any graph tile.

:::image type="content" source="media/graph-visualization/graphs-landing-page.png" alt-text="Screenshot showing how to access Sentinel graph from the Microsoft Sentinel navigation pane." lightbox="media/graph-visualization/graphs-landing-page.png":::


## Query a custom graph

Select **Query graph** on the graph tile to view the graph query page.

You can view the schema to understand the graph ontology – nodes, edges, and their properties available to query.

:::image type="content" source="media/graph-visualization/graph-creation-schema.png" alt-text="Screenshot showing the Sentinel graph creation page with the schema panel and query input." lightbox="media/graph-visualization/graph-creation-schema.png":::

1. Select the **Getting started** tab 

1. A list of suggested queries is displayed. Select **Edit query** for the **Visualize any graph** query to copy the query to the query editor box. 

    This query matches any one‑hop connection in the graph, finding a source node, a directed relationship, and a target node. It returns the full nodes and relationship for up to 100 such matches, making it useful for quickly exploring raw graph structure.


    ```gql
    MATCH (x)-[y]->(z)
    RETURN *
    LIMIT 100
    ```
    For more information on using GQL, see [Graph Query Language (GQL) reference](./gql-reference-for-sentinel-custom-graph.md).

1. Select **Run GQL query** to view your results. Once complete, the graph visualization appears.

1. Select any node to view the node details, including the properties associated with that node. Use this information to inform subsequent queries and visualizations.

    :::image type="content" source="./media/graph-visualization/graph-basic-query.png" lightbox="./media/graph-visualization/graph-basic-query.png"  alt-text="Screenshot showing the Sentinel graph visualization results after running a GQL query.":::

1. Select the **Table** tab to view a tabular representation of your results. Select a row to see the underlying JSON data for each cell. 

    :::image type="content" source="media/graph-visualization/basic-query-table.png" alt-text="Screenshot showing the table visualization results after running a GQL query." lightbox="media/graph-visualization/basic-query-table.png":::

## Interact with graphs

Use the following capabilities to traverse and explore your graphs:

**Node colors**  
Nodes are color-coded by type, making it easy to visualize the different entity types in your graph.

**Graph legend**  
The graph legend shows all node types in your graph with their corresponding colors and counts. It also lists all edge types, so you can understand how nodes connect to each other.

**Node labels**   
As you zoom in on the graph, more node labels appear. The first labels to appear are the most heavily connected nodes that are represented by larger circles. As you continue to zoom, more node labels appear in descending order of connectivity.  

**View node details**  
Select a node to open a details pane on the right side. Use the metadata shown here to refine future queries—for example, by filtering on geographic region, department, or last updated date.

**Explore connected assets**  
From the node details pane or by right-clicking the node, you can select **Explore connected assets** to traverse the graph and view the next hop from this node.

:::image type="content" source="media/graph-visualization/graph-legend.png" lightbox="media/graph-visualization/graph-legend.png" alt-text="Screenshot showing the graph legend with node and edge types.":::

**Hover over nodes**  
Hover over a node to highlight its connections. This hides unrelated nodes and edges for a clearer view of the node's connectivity and displays key node information, including connected node labels.


**Filtering a graph**   

You can use the filters at the top-right of the graph canvas to narrow down the visualized results by node type or edge relationship.

:::image type="content" source="media/graph-visualization/filters.png" lightbox="media/graph-visualization/filters.png" alt-text="Screenshot showing the graph filters for node and edge types.":::

**Canvas control - rearrange and zoom**  
- Drag nodes to reposition them on the canvas
- Use the recenter button in the bottom right to reset the view
- Zoom in or out using your cursor or the zoom controls in the bottom right

### Table view

You can view a tabular representation of your data by selecting the **Table** tab. From the table, you can:

- Validate that your GQL query produced the desired results.
- Search and sort the table to quickly find entities of interest.
- View the underlying JSON for an individual cell, providing key context you can use in future queries.
- Export to CSV format for use in other preexisting workflows.

:::image type="content" source="media/graph-visualization/graph-table-export.png" alt-text="Screenshot showing the table view with search, sort, and export capabilities." lightbox="media/graph-visualization/graph-table-export.png":::

You can also customize the table format by using the `RETURN` operator to define the column structure, or order results to your preference. For more information, see the [GQL documentation](./gql-reference-for-sentinel-custom-graph.md).

## Related content

- [Microsoft Sentinel graph overview](sentinel-graph-overview.md)
- [Custom graphs in Microsoft Sentinel](custom-graphs-overview.md)
- [Create custom graphs in Microsoft Sentinel](create-custom-graphs.md)
- [GQL reference for Microsoft Sentinel graph](gql-reference-for-sentinel-custom-graph.md)