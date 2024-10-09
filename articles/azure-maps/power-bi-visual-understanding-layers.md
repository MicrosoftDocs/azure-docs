---
title: Layers in an Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps Power BI visual
description: This article describes the different layers available in an Azure Maps Power BI visual.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 07/19/2023
ms.topic: how-to
ms.service: azure-maps
ms.subservice: power-bi-visual
---

# Layers in Azure Maps Power BI visual

There are two types of layers available in an Azure Maps Power BI visual. The first type focuses on rendering data that is passed into the **Fields** pane of the visual and consist of the following layers, let's call these data rendering layers.

:::row:::
    :::column span="":::
        **Bubble layer**

        Renders points as scaled circles on the map.

        ![Bubble layer on map](media/power-bi-visual/bubble-layer-thumb.png)
    :::column-end:::
    :::column span="":::
        **3D column layer**

        Renders points as 3D columns on the map.

        ![3D column layer on map](media/power-bi-visual/3d-column-layer-thumb.png)
    :::column-end:::
:::row-end:::

:::row:::
    :::column span="":::
        **Filled map layer**

        Provides a visual display to shows differences in values across a geography or region.

        ![Filled Map layer on map](media/power-bi-visual/filled-map.png)
    :::column-end:::
    :::column span="":::
        **Heat map layer**

        Shows data "hot spots" on a map.
        
        ![Heat map layer on map](media/power-bi-visual/heat-map-sm.png)
    :::column-end:::
:::row-end:::

The second type of layer connects addition external sources of data to map to provide more context and consists of the following layers.

:::row:::
    :::column span="":::
        **Reference layer**

        Overlay an uploaded GeoJSON file on top of the map.

        ![Reference layer on map](media/power-bi-visual/reference-layer-thumb.png)
    :::column-end:::
    :::column span="":::
        **Tile layer**

        Overlay a custom tile layer on top of the map.
        
        ![Tile layer on map](media/power-bi-visual/tile-layer-thumb.png)
    :::column-end:::
    :::column span="":::
        **Traffic layer**

        Overlay real-time traffic information on the map.
        
        ![Traffic layer on map](media/power-bi-visual/traffic-layer-thumb.png)
    :::column-end:::
:::row-end:::

All the data rendering layers and the **Tile layer**, have options for min and max zoom levels that are used to specify a zoom level range these layers should be displayed at. These options allow one type of rendering layer to be used at one zoom level and a transition to another rendering layer at another zoom level.

These layers can also be positioned relative to other layers in the map. When multiple data rendering layers are used, the order in which they're added to the map determines their relative layering order when they have the same **Layer position** value.

## General layer settings

The general layer section of the **Format** pane are common settings that apply to the layers that are connected to the Power BI dataset in the **Fields** pane (Bubble layer, 3D column layer).

| Setting        | Description                            |
|----------------|----------------------------------------|
| Unselected transparency | The transparency of shapes that aren't selected, when one or more shapes are selected.  |
| Show zeros     | (Deprecated) Specifies if points that have a size value of zero should be shown on the map using the minimum radius. |
| Show negatives | (Deprecated) Specifies if absolute value of negative size values should be plotted.   |
| Min data value | The minimum value of the input data to scale against. Good for clipping outliers.  |
| Max data value | The maximum value of the input data to scale against. Good for clipping outliers.  |

> [!NOTE]
>
> **General layer settings retirement**
>
> The **Show zeros** and **Show negatives** Power BI Visual General layer settings were deprecated starting in the September 2023 release of Power BI. You can no longer create new reports using these settings, but existing reports will continue to work. It is recommended that you upgrade existing reports. To upgrade to the new **range scaling** property, select the desired option in the **Range scaling** drop-down list:
>
> :::image type="content" source="./media/power-bi-visual/range-scaling-drop-down.png" alt-text="A screenshot of the range scaling drop-down":::
>
> For more information on the range scaling option, see **Range scaling** in the properties table of the [Add a bubble layer] article.

## Data-Bound Reference Layer

The Data-Bound Reference Layer enables the association of data with specific shapes in the reference layer based on common attributes.

To use the Data-Bound Reference layer, drag the column containing unique identifiers (can be location data or not) to the Location field of the Azure Maps Visual.

:::image type="content" source="media/power-bi-visual/data-bound-reference-layer/location-field.png" alt-text="A screenshot showing the location field in Power BI desktop.":::

Azure Maps matches these identifiers with the corresponding properties in the uploaded spatial file, automatically linking your data to the shapes on the map.

In scenarios with multiple properties, Azure Maps identifies a common property in each shape and compares its value with the selected data column in the Location field. It then uses the property that has the highest number of matches with the selected data column.

:::image type="content" source="media/power-bi-visual/data-bound-reference-layer/data-bound-reference-layer.png"  lightbox="media/power-bi-visual/data-bound-reference-layer/data-bound-reference-layer.png" alt-text="A screenshot showing the Data-Bound Reference Layer example in Power BI desktop.":::

If one or more shapes in the reference layer can't be automatically mapped to any data point, you can manage these unmapped objects by following these steps:

1. Select the **Format visual** tab in the **Visualizations** pane.
1. Select **Reference layer**.
1. Select **Unmapped Objects**.
1. Select the **Show** toggle switch to toggle On/Off. This highlights shapes that aren't mapped to any data points.

Optionally, select the **Use custom colors** toggle switch to toggle On/Off custom fill and border colors for unmapped objects to make them visually distinct on the map.

:::image type="content" source="media/power-bi-visual/data-bound-reference-layer/data-bound-reference-layer-unmapped-objects.png" lightbox="media/power-bi-visual/data-bound-reference-layer/data-bound-reference-layer-unmapped-objects.png" alt-text="A screenshot showing the Data-Bound Reference Layer example in Power BI desktop with unmapped objects showing in a different color.":::

<!----------------------------------------------------------------------------
### Key matching example

#### Semantic model

| Datapoint   | Country | City     | Office name |
|-------------|---------|----------|-------------|
| Datapoint_1 | US      | New York | Office C    |
| Datapoint_1 | US      | Seattle  | Office A    |
| Datapoint_1 | US      | LA       | Office B    |

#### Reference layer data (take GeoJSON as an example)

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Office A",
        "shape": "Shape_1",
        "id": "Office A"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          ...
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Office B",
        "shape": "Shape_2",
        "id": "Office B"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          ...
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Office C",
        "shape": "Shape_3"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          ...
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Office D",
        "shape": "Shape_4"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          ...
        ]
      }
    }
  ]
}
```

#### the mapping results

|                 | Location bucket|Mapping result                                                                  |
|-----------------|----------------|--------------------------------------------------------------------------------|
| Case 1          | Office name    | Shape_1 ↔ Datapoint_2                                                          |
|                 |                | Shape_2 ↔ Datapoint_3                                                          |
|                 |                | Shape_3 ↔ Datapoint_1                                                          |
|                 |                | Shape_4 ↔ x (Since there’s no datapoint with Office name “Office D”)           |
| Case 2          | City           | Nothing is mapped, since there’s no property that contains matched City names. |

Note that there is a property “id” also has “Office x” values that is not being used, but instead the property “name” is used for data mapping since it has 3 datapoints matched and “id” only has 2 datapoints matched.

---------------------------------------------------------------------------------------------------------------------------->

## Conditional Formatting

Conditional formatting can be applied to data to dynamically change the appearance of shapes on a map based on the provided data. For instance, gradient colors can visualize various data values such as population density, sales performance, or other metrics. This is a powerful tool for combining spatial and business data to create interactive and visually compelling reports.

:::image type="content" source="media/power-bi-visual/data-bound-reference-layer/conditional-formatting.png" alt-text="A screenshot showing the Conditional Formatting controls for points, lines, polygons, and unmanaged objects in the reference layer control in Power BI desktop.":::

There are several ways to set colors to the shapes. The following table shows the priorities used:

| Priority | Source                        | Description                                                     |
|----------|-------------------------------|-----------------------------------------------------------------|
| 1        | Preset style in spatial files | Color and style as defined in the spatial file                  |
| 2        | Unmapped object colors        | Custom colors used when the geometry isn’t data-bound           |
| 3        | Legend colors                 | Colors provided by Legend/Series                                |
| 4        | Conditional formatting colors | Colors provided by conditional formatting                       |
| 5        | Custom formatting colors      | User defined custom styles in the Reference Layer options in the formatting pane |
| 6        | Default colors                | Default colors defined in the Azure Maps visual                 |

> [!TIP]
>
> The Azure Maps Power BI Visual can only perform geocoding on valid location data such as geographical coordinates, addresses, or place names. If no valid location data is uploaded, data layers that depend on geocoded locations, such as heat maps or bubble layers, won’t display on the map.
>
> The Data-Bound Reference Layer will appear on the map as long as the data column contains unique identifiers that match properties in the spatial file, but to ensure correct results, your data column must include valid geographic information.

## Next steps

Change how your data is displayed on the map:

> [!div class="nextstepaction"]
> [Add a bubble layer](power-bi-visual-add-bubble-layer.md)

> [!div class="nextstepaction"]
> [Add a 3D column layer](power-bi-visual-add-3d-column-layer.md)

Add more context to the map:

> [!div class="nextstepaction"]
> [Add a reference layer](power-bi-visual-add-reference-layer.md)

> [!div class="nextstepaction"]
> [Add a tile layer](power-bi-visual-add-tile-layer.md)

> [!div class="nextstepaction"]
> [Show real-time traffic](power-bi-visual-show-real-time-traffic.md)

 [Add a bubble layer]: power-bi-visual-add-bubble-layer.md
