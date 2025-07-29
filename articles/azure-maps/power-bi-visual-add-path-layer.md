---
title: The path layer in Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps Power BI visual
description: This article describes the path layer in an Azure Maps Power BI visual.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 11/27/2024
ms.topic: how-to
ms.service: azure-maps
ms.subservice: power-bi-visual
---

# The path layer in Azure Maps Power BI visual 

The path layer feature in the Azure Maps Power BI Visual enables the visualization of connections between multiple geographic points.

The path layer feature can be used in multiple scenarios, such as:

- **Route Visualization**: Showing vehicle, ship, or flight paths between locations.
- **Network Analysis**: Examines connections between nodes in a network, like supply chain routes or communication networks.
- **Movement Tracking**: Monitoring assets or individuals over time and space.

This guide explains how to use this feature effectively.

## Add a path layer

This section describes how to add data and configure the path layer. Before starting, you need to open your Azure Maps Visual in Power BI. For more information on adding an Azure Maps Visual to your Power BI report, see [Use the Azure Maps Power BI visual].

| Setting           | Description                                |
|-------------------|--------------------------------------------|
| Apply Settings to | Path you want the settings to apply to     |
| Color             | The color of the line                      |
| Transparency      | The transparency of the line               |
| Width             | The width of the line                      |
| Maximum Zoom      | Maximum zoom level the layer is visible at |
| Minimum Zoom      | Minimum zoom level the layer is visible at |

### Add data to the path layer

To draw paths, provide data for "Path ID" and "Point Order":

1. Add the column that best identifies each path to the **Path ID** field. The Path ID is used to identify which line each geospatial data point belongs to. If there are multiple paths, each path requires a unique Path ID.
1. Add the column that specifies the order of points along the path to the **Point Order** field. The Point Order dictates the sequence of points to form a path.

    :::image type="content" source="media/power-bi-visual/path-layer.png" alt-text="A screenshot showing the path layer properties.":::

### Configure a path layer

After adding your data, you can adjust the path layer's color, line width, and opacity. Apply settings by legend or path ID, coloring paths, and locations with the same legend identically.

After adding your data, you can configure the path layer according to your requirements. The style of the paths can be customized by adjusting the line color, width, and opacity. These settings can be applied based on legend or path ID. If a legend is provided, paths and locations associated with the same legend share the same color.

:::image type="content" source="media/power-bi-visual/path-layer-configuration.png" alt-text="A screenshot showing the path layer configuration properties, including line color, transparency, and width as well as minimum and maximum zoom.":::

### Interact with a path layer

The path layer feature offers several interactive options:

- **Hover and Select**: Hover over a path to select points; clicking on a path selects the nearest point. The selected point also selects other reports by legend, path ID, location, and point order.
- **Tooltips**: Tooltips show information for the nearest point when hovering over a line.

    :::image type="content" source="media/power-bi-visual/path-layer-map.png" alt-text="A screenshot showing a map using the path layer.":::

### Explore and customize a path layer

Examine the connections and insights revealed by the path layer visualization. Further customize the settings to suit your specific requirements and derive more profound insights from your geospatial data.

#### Legends in a path layer

Adding a field to the legend field well creates a higher level of grouping. So, paths and locations associated with the same legend are colored identically. Here's the process:

- **Grouping by Legend**: When a legend is provided, the paths and locations are grouped based on the legend. For instance, if visualizing flight paths with the airline as the legend, all paths and locations associated with the same airline share the same color. Moreover, if there are two rows, one with legend "Contoso" and path ID "A123" and another with legend "MSAirline" and path ID "A123" the path layer interprets these as two distinct paths: "Contoso-A123" and "MSAirline-A123".
- **Styling by Legend**: Configure the style (color, line width, opacity) using the legend to visually differentiate path groups.
- **Interaction by Legend**: When interacting with the path layer, selecting a path or point also selects other reports based on legend, path ID, location, and point order. This ensures all related data points are highlighted together.

#### Handle origin-destination data

To use origin-destination data in the path layer, you must first transform it, as Azure Maps Visual doesn't directly support such data. Use the [Unpivot function in Power Query] to do this. Here’s how:

1. **Import Data**: Import your origin-destination data into Power BI.
1. **Apply Unpivot Function**: Use the following Power Query to transform the data: 

    ```C#
    let 
        // Importing the source. 
        Source = … 
        // Create "path_id" to set in the "Path ID" field well later in the visual. 
        // Since each row represents a line here, we can simply use the row index as path ID 
        #"Added Index" = Table.AddIndexColumn(Source, "path_id", 0, 1, Int64.Type), 
        // This is the key point of the transformation. 
        // We transform the original rows into two: one for the origin and one for the destination.  
        #"Unpivoted Other Columns" = Table.UnpivotOtherColumns(#"Added Index", {"path_id"}, "point_order", "city"), 
        // We only support timestamp and number for the point order. So, convert the "origin" as 0 and "destination" as 1 
        #"Replaced Values" = Table.ReplaceValue(Table.ReplaceValue(#"Unpivoted Other Columns", "origin", "0", Replacer.ReplaceText, {"point_order"}), "destination", "1", Replacer.ReplaceText, {"point_order"}) 
    in 
        #"Replaced Values" 
    ```

**Before transformation**

| origin    | destination   |
|-----------|---------------|
| New York  | Los Angeles   |
| Chicago   | Houston       |
| Miami     | Atlanta       |
| Seattle   | Denver        |
| Boston    | San Francisco |

**After transformation**

| path_id  | point_order  | city          |
|----------|--------------|---------------|
| 0        | 0            | New York      |
| 0        | 1            | Los Angeles   |
| 1        | 0            | Chicago       |
| 1        | 1            | Houston       |
| 2        | 0            | Miami         |
| 2        | 1            | Atlanta       |
| 3        | 0            | Seattle       |
| 3        | 1            | Denver        |
| 4        | 0            | Boston        |
| 4        | 1            | San Francisco |

## Current limitations

- The path layer is only compatible with specific map data layers, including the Bubble, Reference, Traffic, and Tile layers.
- The data-bound reference layer isn't available when the path layer is enabled.
- Location hierarchy (drill down) is disabled when a Path ID is provided.

## Conclusion

The path layer feature in Azure Maps Visual is a tool for visualizing and analyzing spatial connections. This new capability can be utilized to enhance reports.

[Use the Azure Maps Power BI visual]: power-bi-visual-get-started.md#use-the-azure-maps-power-bi-visual
[Unpivot function in Power Query]: /power-query/unpivot-column