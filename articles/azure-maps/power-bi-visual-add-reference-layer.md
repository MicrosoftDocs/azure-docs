---
title: Add a reference layer to Azure Maps Power BI visual
titleSuffix: Microsoft Azure Maps Power BI visual
description: This article describes how to use the reference layer in Azure Maps Power BI visual.
author: deniseatmicrosoft
ms.author: limingchen
ms.date: 12/04/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Add a reference layer

Reference layers enable the enhancement of spatial visualizations by overlaying a secondary spatial dataset on the map to provide more context. Power BI hosts this dataset in various formats, including:

- [GeoJSON files] with a `.json` or `.geojson` extension
- [WKT] (Well-Known Text) files with a `.wkt` extension
- [KML] (Keyhole Markup Language) files with a `.kml` extension
- [SHP] (Shapefile) files with a `.shp` extension

## Add a spatial dataset as a reference layer

You have two options to add a spatial dataset as a reference layer. You can either reference a hosted file by providing the URL, or select a file to upload.

# [Upload file](#tab/upload)

To upload a spatial dataset as a reference layer:

1. Navigate to the **Format** pane.
1. Expand the **Reference Layer** section.
1. Select **File Upload** from the **Type** drop-down list.
1. Select **Browse**. The file selection dialog opens, allowing you to choose a file with a `.json`, `.geojson`, `.wkt`, `.kml` or `.shp` extension.

    :::image type="content" source="./media/power-bi-visual/reference-layer-upload.png" alt-text="Screenshot showing the reference layers section when uploading a file control.":::

Once the file is added to the reference layer, the file name appears in the **Browse** field. An '**X**' button is added that removes the data from the visual and deletes the associated file from Power BI when selected.

# [Reference hosted file](#tab/hosted)

To use a hosted spatial dataset as a reference layer:

1. Navigate to the **Format** pane.
1. Expand the **Reference Layer** section.
1. Select **URL** from the **Type** drop-down list.
1. Select **Enter a URL** and enter a valid URL pointing to your hosted file. Hosted files must be a valid spatial dataset with a `.json`, `.geojson`, `.wkt`, `.kml` or `.shp` extension.

    :::image type="content" source="./media/power-bi-visual/reference-layer-hosted.png" alt-text="Screenshot showing the reference layers section when hosting a file control.":::

Once the link to the hosted file is added to the reference layer, the URL appears in the **Enter a URL** field. To remove the data from the visual simply delete the URL.

---

The following map displays [2016 census tracts for Colorado]. The areas are colored, based on population, using the reference layer.

:::image type="content" source="./media/power-bi-visual/reference-layer-CO-census-tract.png" alt-text="A map displaying 2016 census tracts for Colorado, colored by population as a reference layer.":::

The following are all settings in the **Format** pane that are available in the **Reference layer** section.

| Setting              | Description   |
|----------------------|---------------|
| Reference layer data | The data file to upload to the visual as another layer within the map. Selecting **Browse** shows a list of files with a `.json`, `.geojson`, `.wkt`, `.kml` or `.shp` file extension that can be opened. |

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
[2016 census tracts for Colorado]: https://github.com/Azure-Samples/AzureMapsCodeSamples/tree/master/Static/data/geojson
[supported style properties]: spatial-io-add-simple-data-layer.md#default-supported-style-properties
[Add a tile layer]: power-bi-visual-add-tile-layer.md
[Show real-time traffic]: power-bi-visual-show-real-time-traffic.md
