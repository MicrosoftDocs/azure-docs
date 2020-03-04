---
title:  Read and write spatial data | Microsoft Azure Maps
description: Learn how to read and write data using the Spatial IO module, provided by Azure Maps Web SDK.
author: farah-alyasari
ms.author: v-faalya
ms.date: 03/01/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
#Customer intent: As an Azure Maps web sdk user, I want to read and write spatial data so that I can use data for map rendering.
---

# Read and write spatial data

This article outlines all the different tools available in the Spatial IO module for reading and writing spatial data.

The following table is a list of spatial file formats that are supported for reading and writing using the Spatial IO module.

| Data Format       | Read | Write |
|-------------------|------|-------|
| GeoJSON           | ✓  |  ✓  |
| GeoRSS            | ✓  |  ✓  |
| GML               | ✓  |  ✓  |
| GPX               | ✓  |  ✓  |
| KML               | ✓  |  ✓  |
| KMZ               | ✓  |  ✓  |
| Spatial CSV       | ✓  |  ✓  |
| Well Known Text   | ✓  |  ✓  |

## Read spatial data 

The `atlas.io.read` function is used to read common spatial data formats such as KML, GPX, GeoRSS, GeoJSON, and CSV files with spatial data. This function can also as read compressed versions of these formats, as a zip file or a KMZ file. The KMZ file format is a compressed version of KML that can also include assets such as images. Alternatively, the read function can take in a URL that points to a file in any of these formats. URLs should be hosted on a CORs enabled endpoint, or a proxy service should be provided in the read options. The read function returns a promise to add the image icons to the map, and processes in asynchronously to minimize impact to the UI thread.

When reading a compressed file, either as a zip or a KMZ, it will be unzipped and scanned for the first valid file. For example, doc.kml, or a file with other valid extension, such as: .kml, .xml, geojson, .json, .csv, .tsv, or .txt. Then, images referenced in KML and GeoRSS files are preloaded to ensure they're accessible. Inaccessible image data may load an alternative fallback image or will be removed from the styles. Images extracted from KMZ files will be converted to data URIs.

The result from the read function is a `SpatialDataSet` object. This object extends the GeoJSON FeatureCollection class. It can easily be passed into a `DataSource` as-is to render its features on a map. The `SpatialDataSet` not only contains feature information, but it may also include KML ground overlays, processing metrics, and other details as outlined in the following table.

| Property name | Type | Description | 
|---------------|------|-------------|
| `bbox` | `BoundingBox` | Bounding box of all the data in the data set. |
| `features` | `Feature[]` | GeoJSON features within the data set. |
| `groundOverlays` | `(atlas.layer.ImageLayer | atlas.layers.OgcMapLayer)[]` | An array of KML GroundOverlays. |
| `icons` | Record&lt;string, string&gt; | A set of icon URLs. Key = icon name, Value = URL. |
| properties | any | Property information provided at the document level of a spatial data set. |
| `stats` | `SpatialDataSetStats` | Statistics about the content and processing time of a spatial data set. |
| `type` | `'FeatureCollection'` | Read only GeoJSON type value. |

## Examples of reading spatial data

The following code shows how to read a simple spatial data set, and render it on the map using the `SimpleDataLayer` class. The code uses a GPX file pointed it to by a URL.

<br/>

<iframe height='500' scrolling='no' title='Load Spatial Data Simple' src='//codepen.io/azuremaps/embed/yLNXrZx/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/yLNXrZx/'>Load Spatial Data Simple</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The next code demo shows how to read and load KML, or KMZ, to the map. KML can contain ground overlays, which will be in the form of an `ImageLyaer` or `OgcMapLayer`. These overlays must be added on the map separately from the features. Additionally, if the data set has custom icons, those icons need to be loaded in to the maps resources before the features are loaded.

<br/>

<iframe height='500' scrolling='no' title='Load KML Onto Map' src='//codepen.io/azuremaps/embed/XWbgwxX/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/XWbgwxX/'>Load KML Onto Map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

You may optionally provide a proxy service for accessing cross domain assets that may not have CORs enabled. This snippet of code shows you could add the proxy service setting for the above code demo:

```javascript

//Set the location of your proxyServiceUrl file 
var proxyServiceUrl = window.location.origin + '/CorsEnabledProxyService.ashx?url=';

//Read a KML file from a URL or pass in a raw KML string.
atlas.io.read('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1717245/2007SanDiegoCountyFires.kml', {
    //Optionally provide a proxy service for accessing cross domain assets that may not have CORs enabled.
    proxyService: proxyServiceUrl
}).then(async r => {
    if (r) {
        // Some code goes here . . .
    }
});

```

The last code demo in this section shows how to read a delimited file and render it on the map. In this case, the code uses a CSV file that has spatial data columns.

<br/>

<iframe height='500' scrolling='no' title='Add a Delimited File' src='//codepen.io/azuremaps/embed/ExjXBEb/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ExjXBEb/'>Add a Delimited File</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Write spatial data

There are two main write functions in the spatial IO module. The `atlas.io.write` function generates a string, while the `atlas.io.writeCompressed` function generates a compressed zip file, which contains a text-based file with the spatial data in it. Both of these functions return a promise to add the feature to the file. Also, they both can write any of the following data: `SpatialDataSet`, `DataSource`, `ImageLayer`, `OgcMapLayer`, feature collection, feature, geometry, or an array of any combination of these data types. When writing using either functions, you can specify the desired file format. If the file format isn't specified, then the data will be written as KML.

The following tool demonstrates the majority of the write options that can be used with the `atlas.io.write` function.

<br/>

<iframe height='700' scrolling='no' title='Spatial data write options' src='//codepen.io/azuremaps/embed/YzXxXPG/?height=700&theme-id=0&default-tab=result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/YzXxXPG/'>Spatial data write options</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Example of writing spatial data

The following sample allows you to drag and drop and then load spatial files onto the map. You can export GeoJSON data from the map and write it in one of the supported spatial data formats as a string or as a compressed file.

<br/>

<iframe height='700' scrolling='no' title='Drag and drop spatial files onto map' src='//codepen.io/azuremaps/embed/zYGdGoO/?height=700&theme-id=0&default-tab=result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/zYGdGoO/'>Drag and drop spatial files onto map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

You may optionally provide a proxy service for accessing cross domain assets that may not have CORs enabled. This snippet of code shows you could incorporate a proxy service for the above code demo:

```javascript

//Set the location of your proxyServiceUrl file 
var proxyServiceUrl = window.location.origin + '/CorsEnabledProxyService.ashx?url=';

function readData(data, fileName) {
    loadingIcon.style.display = '';
    fileCount++;
    //Attempt to parse the file and add the shapes to the map.
    atlas.io.read(data, {
        proxyService: proxyServiceUrl
    }).then(
        //Success
        function(r) {
            //some code goes here ...
        }
    );
}
```

## Read and write Well Known Text (WKT)

[Well Known Text](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry), often referred to as WKT for short, is an Open Geospatial Consortium (OGC) standard for representing spatial geometries as text. Many geospatial systems support WKT such as Azure SQL and Azure PostgreSQL with the PostGIS plugin. Like most OGC standards, coordinates are formatted as "longitude latitude" to align with the "x y" convention. As an example, a point at longitude -110 and latitude 45 can be written as `POINT(-110 45)` using WKT format. The following table provides details on the geometry types supported for reading and writing WKT. 

Well-known text can be read using the `atlas.io.ogc.WKT.read` function, and written using the `atlas.io.ogc.WKT.write` function.

## Examples of reading and writing Well Known Text (WKT)

The following code shows how to read the well-known text string `POINT(-122.34009 47.60995)` and render it on the map using a bubble layer.

<br/>

<iframe height='500' scrolling='no' title='Read Well Known Text' src='//codepen.io/azuremaps/embed/XWbabLd/?height=500&theme-id=0&default-tab=result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/XWbabLd/'>Read Well Known Text</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The following code demonstrates reading and writing well-known text back and forth.

<br/>

<iframe height='700' scrolling='no' title='Read and write Well Known Text' src='//codepen.io/azuremaps/embed/JjdyYav/?height=700&theme-id=0&default-tab=result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/JjdyYav/'>Read and write Well Known Text</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Read and write GML

GML is a spatial XML file specification that's often used as an extension to other XML specifications. GeoJSON data can be written as XML with GML tags using the `atlas.io.core.GmlWriter.write` function. The XML that contains GML can be read using the `atlas.io.core.GmlReader.read` function. The read function has two options:

- `isAxisOrderLonLat` - The axis order of coordinates "latitude, longitude" or "longitude, latitude" can vary between data sets and isn't always well defined. By default the GML reader reads the coordinate data as "latitude, longitude", but setting this option to true will read it as "longitude, latitude".
- `propertyTypes` - This option is a key value lookup table where the key is the name of a property in the data set and the value is the object type to cast the value to when parsing. The supported type values are: `string`, `number`, `boolean`, and  `date`. If a property isn't in the look up table or the type not defined, it will be parsed as a string.

The `atlas.io.read` function will attempt to fallback to the `atlas.io.core.GmlReader.read` function when it detects that the input data is XML, but the data isn't one of the other support spatial XML formats.

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [atlas.io static functions](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.io)

> [!div class="nextstepaction"]
> [SpatialDataSet](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.spatialdataset)

> [!div class="nextstepaction"]
> [SpatialDataSetStats](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.spatialdatasetstats)

> [!div class="nextstepaction"]
> [GmlReader](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.io.core.gmlreader?view=azure-maps-typescript-latest)

> [!div class="nextstepaction"]
> [GmlWriter](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.io.core.gmlwriter?view=azure-maps-typescript-latest)

> [!div class="nextstepaction"]
> [atlas.io.ogc.WKT functions](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.io.ogc.wkt)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Add an OGC map layer](spatial-io-add-ogc-map-layer.md)

> [!div class="nextstepaction"]
> [Connect to a WFS service](spatial-io-connect-wfs-service.md)

> [!div class="nextstepaction"]
> [Leverage core operations](spatial-io-core-operations.md)

> [!div class="nextstepaction"]
> [Supported data format details](spatial-io-supported-data-format-details.md)
