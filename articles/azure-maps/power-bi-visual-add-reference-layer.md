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

Reference layers enable the enhancement of spatial visualizations by overlaying a secondary spatial dataset on the map to provide additional context. Power BI hosts this dataset in various formats, including:

- [GeoJSON files] with a `.json` or `.geojson` extension
- [WKT] (Well-Known Text) files with a `.wkt` extension
- [KML] (Keyhole Markup Language) files with a `.kml` extension

## Add a spatial dataset as a reference layer

To add a spatial dataset as a reference layer:

1. Navigate to the **Format** pane.
1. Expand the **Reference Layer** section.
1. Select **Browse**. The file selection dialog will open, allowing you to choose a file with a `.json`, `.geojson`, `.wkt` or `.kml` extension.

    :::image type="content" source="./media/power-bi-visual/reference-layer.png" alt-text="Screenshot showing the reference layers upload a file control.":::

Once the file is added to the reference layer, its name will replace the **+ Add Local File** button. It will be accompanied by an '**X**' button, which when selected, will remove the data from the visual and delete the associated file from Power BI.

The following map displays [2016 census tracts for Colorado]. The areas are colored, based on population, using the reference layer.

:::image type="content" source="./media/power-bi-visual/reference-layer-CO-census-tract.png" alt-text="A map displaying 2016 census tracts for Colorado, colored by population as a reference layer.":::

The following are all settings in the **Format** pane that are available in the **Reference layer** section.

| Setting              | Description   |
|----------------------|---------------|
| Reference layer data | The data file to upload to the visual as another layer within the map. The **+ Add local file** button opens a file dialog the user can use to select a file that has a `.json`, `.geojson`, `.wkt` or `.kml` file extension. |

## Styling data in a reference layer

Properties can be added to each feature within the GeoJSON file to customize how it's styled on the map. This feature uses the simple data layer feature in the Azure Maps Web SDK. For more information, see this document on [supported style properties]. Custom icon images aren't supported within the Azure Maps Power BI visual as a security precaution.

The following are examples showing how to set a point features color to red.

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
[2016 census tracts for Colorado]: https://github.com/Azure-Samples/AzureMapsCodeSamples/tree/master/Static/data/geojson
[supported style properties]: spatial-io-add-simple-data-layer.md#default-supported-style-properties
[Add a tile layer]: power-bi-visual-add-tile-layer.md
[Show real-time traffic]: power-bi-visual-show-real-time-traffic.md
