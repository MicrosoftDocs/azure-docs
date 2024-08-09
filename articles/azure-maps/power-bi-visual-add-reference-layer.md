---
title: Add a reference layer to Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps Power BI visual
description: This article describes how to use the reference layer in Azure Maps Power BI visual.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 07/10/2024
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

### Enabling Custom Styles

To use the custom styling options for reference layers, follow these steps:

1. **Upload Geospatial Files**: Start by uploading your supported geospatial files (GeoJSON, KML, WKT, CSV, or Shapefile) to Azure Maps as a reference layer.
2. **Access Format Settings**: Navigate to the Reference Layer blade within the Azure Maps Power BI visual settings.
3. **Customize Styles**: Use to adjust the appearance of your reference layer by setting the fill color, border color, border width, and transparency for points, lines, and polygons.

> [!NOTE]
> If your geospatial files (GeoJSON, KML) include predefined style properties, Power BI will utilize those styles rather than the settings configured in the format pane. Make sure your files are styled according to your requirements before uploading if you intend to use custom properties defined within them.

### Style Configuration

| Setting name        | Description                                          | Setting values                                                       |
|---------------------|------------------------------------------------------|----------------------------------------------------------------------|
| Fill Colors         | Fill color of points and polygons.                   | Set colors for different data category or gradient for numeric data. |
| Border Color        | The color of the points, lines, and polygons outline.| Color picker                                                         |
| Border width        | The width of the border in pixels. Default: 3 px     | Width 1-10 pixels                                                    |
| Border transparency |  The transparency of the borders. Default: 0%        | Transparency 0-100%                                                  |

The **Points** section of the format visual pane:

:::image type="content" source="./media/power-bi-visual/points.png" alt-text="A screenshot displaying the points section of the format visual pane.":::

The **Lines** section of the format visual pane:

:::image type="content" source="./media/power-bi-visual/lines.png" alt-text="A screenshot displaying the lines section of the format visual pane.":::

The **polygons** section of the format visual pane:

:::image type="content" source="./media/power-bi-visual/polygons.png" alt-text="A screenshot displaying the polygons section of the format visual pane.":::

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
