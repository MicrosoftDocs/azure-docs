---
title: Add a reference layer to Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps Power BI visual
description: This article describes how to use the reference layer in Azure Maps Power BI visual.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 11/27/2024
ms.topic: how-to
ms.service: azure-maps
ms.subservice: power-bi-visual
---

# Add a reference layer

Reference layers enable the enhancement of spatial visualizations by overlaying a secondary spatial dataset on the map to provide more context. Power BI hosts this dataset in various formats, including:

- [GeoJSON files] with a `.json` or `.geojson` extension
- [WKT] (Well-Known Text) files with a `.wkt` extension
- [KML] (Keyhole Markup Language) files with a `.kml` extension
- [SHP] (Shapefile) files with a `.shp` extension
- [CSV] (Comma-separated values) files with a `.csv` extension. The Azure Maps Power BI visual parses the column containing WKT (Well-Known Text) strings from the sheet.

## Add a spatial dataset as a reference layer

You have two options to add a spatial dataset as a reference layer. You can either reference a hosted file by providing the URL, or select a file to upload.

# [Upload file](#tab/upload)

To upload a spatial dataset as a reference layer:

1. Navigate to the **Format** pane.
1. Expand the **Reference Layer** section.
1. Select **File Upload** from the **Type** drop-down list.
1. Select **Browse**. The file selection dialog opens, allowing you to choose a file with a `.json`, `.geojson`, `.wkt`, `.kml`, `.shp`, or `.csv` extension.

    :::image type="content" source="./media/power-bi-visual/reference-layer-upload.png" alt-text="Screenshot showing the reference layers section when uploading a file control.":::

Once the file is added to the reference layer, the file name appears in the **Browse** field. An '**X**' button is added that removes the data from the visual and deletes the associated file from Power BI when selected.

# [Reference hosted file](#tab/hosted)

To use a hosted spatial dataset as a reference layer:

1. Navigate to the **Format** pane.
1. Expand the **Reference Layer** section.
1. Select **URL** from the **Type** drop-down list.
1. Select **Enter a URL** and enter a valid URL pointing to your hosted file. Hosted files must be a valid spatial dataset with a `.json`, `.geojson`, `.wkt`, `.kml`, `.shp`, or `.csv` extension. After the link to the hosted file is added to the reference layer, the URL appears in the **Enter a URL** field. To remove the data from the visual delete the URL.

    :::image type="content" source="./media/power-bi-visual/reference-layer-hosted.png" alt-text="Screenshot showing the reference layers section when using the 'Enter a URL' input control.":::

1. Alternatively, you can create a dynamic URL using Data Analysis Expressions ([DAX]) based on fields, variables, or other programmatic elements. By utilizing DAX, the URL will dynamically change based on filters, selections, or other user interactions and configurations. For more information, see [Expression-based titles in Power BI Desktop].

    :::image type="content" source="./media/power-bi-visual/reference-layer-hosted-dax.png" alt-text="Screenshot showing the reference layers section when using DAX for the URL input.":::

---

The following map displays [2016 census tracts for Colorado]. The areas are colored, based on population, using the reference layer.

:::image type="content" source="./media/power-bi-visual/reference-layer-CO-census-tract.png" alt-text="A map displaying 2016 census tracts for Colorado, colored by population as a reference layer.":::

The following are all settings in the **Format** pane that are available in the **Reference layer** section.

| Setting              | Description   |
|----------------------|---------------|
| Reference layer data | The data file to upload to the visual as another layer within the map. Selecting **Browse** shows a list of files with a `.json`, `.geojson`, `.wkt`, `.kml`, `.shp`, or `.csv` file extension that can be opened. |

## Styling data in a reference layer

Properties can be added to each feature within the GeoJSON file to customize styling. This feature uses the simple data layer feature in the Azure Maps Web SDK. For more information, see this document on [supported style properties]. Custom icon images aren't supported within the Azure Maps Power BI visual as a security precaution.

The following are examples showing how to set a point features `color` property to `red`.

**GeoJSON**

```json
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-122.13284, 47.63699]
    },
    "properties": {
        "color": "red"
    }
}
```

**WKT**

```wkt
POINT(-122.13284 47.63699) 
```

**KML**

```XML
<?xml version="1.0" encoding="UTF-8"?> 
<kml xmlns="http://www.opengis.net/kml/2.2"> 
  <Placemark> 
    <Point> 
      <coordinates>-122.13284,47.63699</coordinates> 
    </Point> 
    <Style> 
      <IconStyle> 
        <color>ff0000ff</color> <!-- Red color in KML format (Alpha, Blue, Green, Red) --> 
      </IconStyle> 
    </Style> 
  </Placemark> 
</kml> 
```

## Custom style for reference layer via format pane

The _Custom style for reference layer via format pane_ feature in Azure Maps enables you to personalize the appearance of reference layers. You can define the color, border width, and transparency of points, lines, and polygons directly in the Azure Maps Power BI visual interface, to enhance the visual clarity and impact of your geospatial data.

:::image type="content" source="./media/power-bi-visual/custom-style-for-reference-layer-via-format-pane.png" alt-text="A map displaying the custom style for reference layer via format pane feature.":::

### Enabling custom styles

To use the custom styling options for reference layers, follow these steps:

1. **Upload Geospatial Files**: Start by uploading your supported geospatial files (GeoJSON, KML, WKT, CSV, or Shapefile) to Azure Maps as a reference layer.
2. **Access Format Settings**: Navigate to the Reference Layer blade within the Azure Maps Power BI visual settings.
3. **Customize Styles**: Use to adjust the appearance of your reference layer by setting the fill color, border color, border width, and transparency for points, lines, and polygons.

> [!NOTE]
> If your geospatial files (GeoJSON, KML) include predefined style properties, Power BI will utilize those styles rather than the settings configured in the format pane. Make sure your files are styled according to your requirements before uploading if you intend to use custom properties defined within them.

### Style configuration

| Setting name        | Description                                          | Setting values                                                       |
|---------------------|------------------------------------------------------|----------------------------------------------------------------------|
| Fill color          | Fill color of points and polygons.                   | Set colors for different data category or gradient for numeric data. |
| Border color        | The color of the points, lines, and polygons outline.| Color picker                                                         |
| Border width        | The width of the border in pixels. Default: 3 px     | Width 1-20 pixels                                                    |
| Border transparency | The transparency of the borders. Default: 0%         | Transparency 0-100%                                                  |

The **Points** section of the format visual pane:

:::image type="content" source="./media/power-bi-visual/points.png" alt-text="A screenshot displaying the points section of the format visual pane.":::

The **Lines** section of the format visual pane:

:::image type="content" source="./media/power-bi-visual/lines.png" alt-text="A screenshot displaying the lines section of the format visual pane.":::

The **Polygons** section of the format visual pane:

:::image type="content" source="./media/power-bi-visual/polygons.png" alt-text="A screenshot displaying the polygons section of the format visual pane.":::

## Data-bound reference layer

The data-bound reference layer enables the association of data with specific shapes in the reference layer based on common attributes.

To use the data-bound reference layer, drag the column containing unique identifiers (can be location data or not) to the Location field of the Azure Maps visual.

:::image type="content" source="media/power-bi-visual/data-bound-reference-layer/location-field.png" alt-text="A screenshot showing the location field in Power BI desktop.":::

Azure Maps matches these identifiers with the corresponding properties in the uploaded spatial file, automatically linking your data to the shapes on the map.

In scenarios with multiple properties, Azure Maps identifies a common property in each shape and compares its value with the selected data column in the Location field. It then uses the property that has the highest number of matches with the selected data column.

:::image type="content" source="media/power-bi-visual/data-bound-reference-layer/data-bound-reference-layer.png"  lightbox="media/power-bi-visual/data-bound-reference-layer/data-bound-reference-layer.png" alt-text="A screenshot showing the data-bound reference layer example in Power BI desktop.":::

If one or more shapes in the reference layer can't be automatically mapped to any data point, you can manage these unmapped objects by following these steps:

1. Select the **Format visual** tab in the **Visualizations** pane.
1. Select **Reference layer**.
1. Select **Unmapped Objects**.
1. Select the **Show** toggle switch to toggle On/Off. This highlights shapes that aren't mapped to any data points.

Optionally, select the **Use custom colors** toggle switch to toggle On/Off custom fill and border colors for unmapped objects to make them visually distinct on the map.

:::image type="content" source="media/power-bi-visual/data-bound-reference-layer/data-bound-reference-layer-unmapped-objects.png" lightbox="media/power-bi-visual/data-bound-reference-layer/data-bound-reference-layer-unmapped-objects.png" alt-text="A screenshot showing the data-bound reference layer example in Power BI desktop with unmapped objects showing in a different color.":::

<!----------------------------------------------------------------------------
### Key matching example

#### Semantic model

| Datapoint   | Country/region | City     | Office name |
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

## Conditional formatting

Conditional formatting can be applied to data to dynamically change the appearance of shapes on a map based on the provided data. For instance, gradient colors can visualize various data values such as population density, sales performance, or other metrics. This is a powerful tool for combining spatial and business data to create interactive and visually compelling reports.

:::image type="content" source="media/power-bi-visual/data-bound-reference-layer/conditional-formatting.png" alt-text="A screenshot showing the conditional formatting controls for points, lines, polygons, and unmanaged objects in the reference layer control in Power BI desktop.":::

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
> The data-bound reference layer will appear on the map as long as the data column contains unique identifiers that match properties in the spatial file, but to ensure correct results, your data column must include valid geographic information.

## Next steps

Add more context to the map:

> [!div class="nextstepaction"]
> [Add a tile layer]

> [!div class="nextstepaction"]
> [Show real-time traffic]

[GeoJSON files]: https://wikipedia.org/wiki/GeoJSON
[WKT]: https://wikipedia.org/wiki/Well-known_text_representation_of_geometry
[KML]: https://wikipedia.org/wiki/Keyhole_Markup_Language
[SHP]: https://en.wikipedia.org/wiki/Shapefile
[CSV]: https://en.wikipedia.org/wiki/Comma-separated_values
[2016 census tracts for Colorado]: https://github.com/Azure-Samples/AzureMapsCodeSamples/tree/master/Static/data/geojson
[supported style properties]: spatial-io-add-simple-data-layer.md#default-supported-style-properties
[Add a tile layer]: power-bi-visual-add-tile-layer.md
[Show real-time traffic]: power-bi-visual-show-real-time-traffic.md
[DAX]: /dax/
[Expression-based titles in Power BI Desktop]: /power-bi/create-reports/desktop-conditional-format-visual-titles
