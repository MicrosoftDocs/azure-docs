---
title:  Read and write spatial data
titleSuffix:  Microsoft Azure Maps
description: Learn how to read and write data using the Spatial IO module, provided by Azure Maps Web SDK.
author: sinnypan
ms.author: sipa
ms.date: 06/21/2023
ms.topic: how-to
ms.service: azure-maps
---

# Read and write spatial data

The following table lists the spatial file formats that are supported for reading and writing operations with the Spatial IO module.

| Data Format       | Read | Write |
|-------------------|------|-------|
| GeoJSON           | ✓  |  ✓  |
| GeoRSS            | ✓  |  ✓  |
| GML               | ✓  |  ✓  |
| GPX               | ✓  |  ✓  |
| KML               | ✓  |  ✓  |
| KMZ               | ✓  |  ✓  |
| Spatial CSV       | ✓  |  ✓  |
| Well-Known Text   | ✓  |  ✓  |

These next sections outline all the different tools for reading and writing spatial data using the Spatial IO module.

## Read spatial data

The `atlas.io.read` function is the main function used to read common spatial data formats such as KML, GPX, GeoRSS, GeoJSON, and CSV files with spatial data. This function can also read compressed versions of these formats, as a zip file or a KMZ file. The KMZ file format is a compressed version of KML that can also include assets such as images. Alternatively, the read function can take in a URL that points to a file in any of these formats. URLs should be hosted on a CORS enabled endpoint, or a proxy service should be provided in the read options. The proxy service is used to load resources on domains that aren't CORS enabled. The read function returns a promise to add the image icons to the map, and processes data asynchronously to minimize impact to the UI thread.

When reading a compressed file, either as a zip or a KMZ, once unzipped it looks for the first valid file. For example, doc.kml, or a file with other valid extension, such as: .kml, .xml, geojson, .json, .csv, .tsv, or .txt. Then, images referenced in KML and GeoRSS files are preloaded to ensure they're accessible. Inaccessible image data can load an alternative fallback image or removed from the styles. Images extracted from KMZ files are converted to data URIs.

The result from the read function is a `SpatialDataSet` object. This object extends the GeoJSON FeatureCollection class. It can easily be passed into a `DataSource` as-is to render its features on a map. The `SpatialDataSet` not only contains feature information, but it can also include KML ground overlays, processing metrics, and other details as outlined in the following table.

| Property name | Type | Description |
|---------------|------|-------------|
| `bbox` | `BoundingBox` | Bounding box of all the data in the data set. |
| `features` | `Feature[]` | GeoJSON features within the data set. |
| `groundOverlays` | `(atlas.layer.ImageLayer | atlas.layers.OgcMapLayer)[]` | An array of KML GroundOverlays. |
| `icons` | Record&lt;string, string&gt; | A set of icon URLs. Key = icon name, Value = URL. |
| properties | any | Property information provided at the document level of a spatial data set. |
| `stats` | `SpatialDataSetStats` | Statistics about the content and processing time of a spatial data set. |
| `type` | `'FeatureCollection'` | Read-only GeoJSON type value. |

## Examples of reading spatial data

The [Load spatial data] sample shows how to read a spatial data set, and renders it on the map using the `SimpleDataLayer` class. The code uses a GPX file pointed to by a URL. For the source code of this sample, see [Load spatial data source code].

:::image type="content" source="./media/spatial-io-read-write-spatial-data/load-spatial-data.png" lightbox="./media/spatial-io-read-write-spatial-data/load-spatial-data.png" alt-text="A screenshot that shows the snap grid on map.":::
:::image type="content" source="./media/spatial-io-read-write-spatial-data/load-spatial-data-description.png" lightbox="./media/spatial-io-read-write-spatial-data/load-spatial-data-description.png" alt-text="A screenshot that shows a detailed description of the snap grid on map sample.":::

<!--------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/yLNXrZx/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
--------------------------------------------------->

The next code demo shows how to read and load KML, or KMZ, to the map. KML can contain ground overlays, which is in the form of an `ImageLyaer` or `OgcMapLayer`. These overlays must be added on the map separately from the features. Additionally, if the data set has custom icons, those icons need to be loaded to the maps resources before the features are loaded.

The [Load KML onto map] sample shows how to load KML or KMZ files onto the map. For the source code of this sample, see [Load KML onto map source code].

:::image type="content" source="./media/spatial-io-read-write-spatial-data/load-kml-onto-map.png" lightbox="./media/spatial-io-read-write-spatial-data/load-kml-onto-map.png" alt-text="A screenshot that shows a map with a KML ground overlay.":::

<!--------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/XWbgwxX/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
--------------------------------------------------->

You can optionally provide a proxy service for accessing cross domain assets that don't have CORS enabled. The read function tries to access files on another domain using CORS first. The first time it fails to access any resource on another domain using CORS it only requests more files if a proxy service is provided. The read function appends the file URL to the end of the proxy URL provided. This snippet of code shows how to pass a proxy service into the read function:

```javascript
//Read a file from a URL or pass in a raw data as a string.
atlas.io.read('https://nonCorsDomain.example.com/mySuperCoolData.xml', {
    //Provide a proxy service
    proxyService: window.location.origin + '/YourCorsEnabledProxyService.ashx?url='
}).then(async r => {
    if (r) {
        // Some code goes here . . .
    }
});

```

The following code snippet shows how to read a delimited file and render it on the map. In this case, the code uses a CSV file that has spatial data columns. You must add a reference to the Azure Maps Spatial IO module.

```javascript

<!-- Add reference to the Azure Maps Spatial IO module. -->
<script src="https://atlas.microsoft.com/sdk/javascript/spatial/0/atlas-spatial.min.js"></script>

<script type="text/javascript">
var map, datasource, layer;

//a URL pointing to the CSV file
var delimitedFileUrl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1717245/earthquakes_gt7_alltime.csv";

function InitMap()
{
  map = new atlas.Map('myMap', {
    center: [-73.985708, 40.75773],
    zoom: 12,
    view: "Auto",

    //Add authentication details for connecting to Azure Maps.
    authOptions: {
      // Get an Azure Maps key at https://azuremaps.com/.
      authType: 'subscriptionKey',
      subscriptionKey: '{Your-Azure-Maps-Subscription-key}'
    },
  });    

  //Wait until the map resources are ready.
  map.events.add('ready', function () {
    //Create a data source and add it to the map.
    datasource = new atlas.source.DataSource();
    map.sources.add(datasource);

    //Add a simple data layer for rendering the data.
    layer = new atlas.layer.SimpleDataLayer(datasource);
    map.layers.add(layer);

    //Read a CSV file from a URL or pass in a raw string.
    atlas.io.read(delimitedFileUrl).then(r => {
      if (r) {
      //Add the feature data to the data source.
      datasource.add(r);

      //If bounding box information is known for data, set the map view to it.
      if (r.bbox) {
        map.setCamera({
        bounds: r.bbox,
        padding: 50
        });
      }
      }
    });
  });
}
</script>
```

:::image type="content" source="./media/spatial-io-read-write-spatial-data/read-delimited-file.png" lightbox="./media/spatial-io-read-write-spatial-data/read-delimited-file.png" alt-text="A screenshot that shows a map created from a CSV file.":::

<!--------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/ExjXBEb/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
--------------------------------------------------->

## Write spatial data

There are two main write functions in the spatial IO module. The `atlas.io.write` function generates a string, while the `atlas.io.writeCompressed` function generates a compressed zip file. The compressed zip file would contain a text-based file with the spatial data in it. Both of these functions return a promise to add the data to the file. And, they both can write any of the following data: `SpatialDataSet`, `DataSource`, `ImageLayer`, `OgcMapLayer`, feature collection, feature, geometry, or an array of any combination of these data types. When writing using either functions, you can specify the wanted file format. If the file format isn't specified, then the data is written as KML.

The [Spatial data write options] sample is a tool that demonstrates most the write options that can be used with the `atlas.io.write` function. For the source code of this sample, see [Spatial data write options source code].

:::image type="content" source="./media/spatial-io-read-write-spatial-data/spatial-data-write-options.png" lightbox="./media/spatial-io-read-write-spatial-data/spatial-data-write-options.png" alt-text="A screenshot that shows The Spatial data write options sample that demonstrates most of the write options used with the atlas.io.write function.":::

<!--------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/YzXxXPG/?height=700&theme-id=0&default-tab=result&embed-version=2&editable=true]
--------------------------------------------------->

## Example of writing spatial data

The [Drag and drop spatial files onto map] sample allows you to drag and drop one or more KML, KMZ, GeoRSS, GPX, GML, GeoJSON or CSV files onto the map. For the source code of this sample, see [Drag and drop spatial files onto map source code].

:::image type="content" source="./media/spatial-io-read-write-spatial-data/drag-and-drop-spatial-files-onto-map.png" lightbox="./media/spatial-io-read-write-spatial-data/drag-and-drop-spatial-files-onto-map.png" alt-text="A screenshot that shows a map with a panel to the left of the map that enables you to drag and drop one or more KML, KMZ, GeoRSS, GPX, GML, GeoJSON or CSV files onto the map.":::

<!--------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/zYGdGoO/?height=700&theme-id=0&default-tab=result&embed-version=2&editable=true]
--------------------------------------------------->

You can optionally provide a proxy service for accessing cross domain assets that don't have CORS enabled. This snippet of code shows you could incorporate a proxy service:

```javascript
atlas.io.read(data, {
    //Provide a proxy service
    proxyService: window.location.origin + '/YourCorsEnabledProxyService.ashx?url='
}).then(
    //Success
    function(r) {
        //some code goes here ...
    }
);
```

## Read and write Well-Known Text (WKT)

[Well-Known Text] (WKT) is an Open Geospatial Consortium (OGC) standard for representing spatial geometries as text. Many geospatial systems support WKT, such as Azure SQL and Azure PostgreSQL using the PostGIS plugin. Like most OGC standards, coordinates are formatted as "longitude latitude" to align with the "x y" convention. As an example, a point at longitude -110 and latitude 45 can be written as `POINT(-110 45)` using the WKT format.

Well-known text can be read using the `atlas.io.ogc.WKT.read` function, and written using the `atlas.io.ogc.WKT.write` function.

## Examples of reading and writing Well-Known Text (WKT)

The [Read Well Known Text] sample shows how to read the well-known text string `POINT(-122.34009 47.60995)` and render it on the map using a bubble layer. For the source code of this sample, see [Read Well Known Text source code].

:::image type="content" source="./media/spatial-io-read-write-spatial-data/read-well-known-text.png" lightbox="./media/spatial-io-read-write-spatial-data/read-well-known-text.png" alt-text="A screenshot that shows how to read Well Known Text (WKT) as GeoJSON and render it on a map using a bubble layer.":::

<!--------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/XWbabLd/?height=500&theme-id=0&default-tab=result&embed-version=2&editable=true]
-------------------------------------------------->

The [Read and write Well Known Text] sample demonstrates how to read and write Well Known Text (WKT) strings as GeoJSON. For the source code of this sample, see [Read and write Well Known Text source code].

:::image type="content" source="./media/spatial-io-read-write-spatial-data/read-and-write-well-known-text.png" lightbox="./media/spatial-io-read-write-spatial-data/read-and-write-well-known-text.png" alt-text="A screenshot showing the sample that demonstrates how to read and write Well Known Text (WKT) strings as GeoJSON.":::

<!--------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/JjdyYav/?height=700&theme-id=0&default-tab=result&embed-version=2&editable=true]
-------------------------------------------------->

## Read and write GML

GML is a spatial XML file specification often used as an extension to other XML specifications. GeoJSON data can be written as XML with GML tags using the `atlas.io.core.GmlWriter.write` function. The XML that contains GML can be read using the `atlas.io.core.GmlReader.read` function. The read function has two options:

- The `isAxisOrderLonLat` option - The axis order of coordinates "latitude, longitude" or "longitude, latitude" can vary between data sets, and it isn't always well defined. By default the GML reader reads the coordinate data as "latitude, longitude", but setting this option to `true` reads it as "longitude, latitude".
- The `propertyTypes` option - This option is a key value lookup table where the key is the name of a property in the data set. The value is the object type to cast the value to when parsing. The supported type values are: `string`, `number`, `boolean`, and  `date`. If a property isn't in the lookup table or the type isn't defined, the property is parsed as a string.

The `atlas.io.read` function defaults to the `atlas.io.core.GmlReader.read` function when it detects that the input data is XML, but the data isn't one of the other support spatial XML formats.

The `GmlReader` parses coordinates that have one of the following SRIDs:

- EPSG:4326 (Preferred)
- EPSG:4269, EPSG:4283, EPSG:4258, EPSG:4308, EPSG:4230, EPSG:4272, EPSG:4271, EPSG:4267, EPSG:4608, EPSG:4674 possibly with a small margin of error.
- EPSG:3857, EPSG:102100, EPSG:3785, EPSG:900913, EPSG:102113, EPSG:41001, EPSG:54004

## More resources

Learn more about the classes and methods used in this article:

[atlas.io static functions](/javascript/api/azure-maps-spatial-io/atlas.io)

[SpatialDataSet](/javascript/api/azure-maps-spatial-io/atlas.spatialdataset)

[SpatialDataSetStats](/javascript/api/azure-maps-spatial-io/atlas.spatialdatasetstats)

[GmlReader](/javascript/api/azure-maps-spatial-io/atlas.io.core.gmlreader)

[GmlWriter](/javascript/api/azure-maps-spatial-io/atlas.io.core.gmlwriter)

[atlas.io.ogc.WKT functions](/javascript/api/azure-maps-spatial-io/atlas.io.ogc.wkt)

[Connect to a WFS service](spatial-io-connect-wfs-service.md)

[Leverage core operations](spatial-io-core-operations.md)

[Supported data format details](spatial-io-supported-data-format-details.md)

## Next steps

See the following articles for more code samples to add to your maps:

[Add an OGC map layer](spatial-io-add-ogc-map-layer.md)

[Drag and drop spatial files onto map source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Spatial%20IO%20Module/Drag%20and%20drop%20spatial%20files%20onto%20map/Drag%20and%20drop%20spatial%20files%20onto%20map.html
[Drag and drop spatial files onto map]: https://samples.azuremaps.com/spatial-io-module/drag-and-drop-spatial-files-onto-map
[Load KML onto map source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Spatial%20IO%20Module/Load%20KML%20onto%20map/Load%20KML%20onto%20map.html
[Load KML onto map]: https://samples.azuremaps.com/spatial-io-module/load-kml-onto-map
[Load spatial data source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Spatial%20IO%20Module/Load%20spatial%20data%20(simple)/Load%20spatial%20data%20(simple).html
[Load spatial data]: https://samples.azuremaps.com/spatial-io-module/load-spatial-data-(simple)
[Read and write Well Known Text source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Spatial%20IO%20Module/Read%20and%20write%20Well%20Known%20Text/Read%20and%20write%20Well%20Known%20Text.html
[Read and write Well Known Text]: https://samples.azuremaps.com/spatial-io-module/read-and-write-well-known-text
[Read Well Known Text source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Spatial%20IO%20Module/Read%20Well%20Known%20Text/Read%20Well%20Known%20Text.html
[Read Well Known Text]: https://samples.azuremaps.com/spatial-io-module/read-well-known-text
[Spatial data write options source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Spatial%20IO%20Module/Spatial%20data%20write%20options/Spatial%20data%20write%20options.html
[Spatial data write options]: https://samples.azuremaps.com/spatial-io-module/spatial-data-write-options
[Well-Known Text]: https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry
