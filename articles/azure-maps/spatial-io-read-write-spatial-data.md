


# Read and write spatial data

This article outlines all the different tools available in the spatial IO module for reading and writing spatial data.

The following is a list of spatial file formats that are supported for reading and writing with the spatial io module.

| Data Format       | Read | Write |
|-------------------|------|-------|
| GeoJSON           |  x   |   x   |
| GeoRSS            |  x   |   x   |
| GML               |  x   |   x   |
| GPX               |  x   |   x   |
| KML               |  x   |   x   |
| KMZ               |  x   |   x   |
| Spatial CSV       |  x   |   x   | 
| Well Known Text   |  x   |   x   |

## Read spatial data 

The `atlas.io.read` function is used to read common spatial data formats such as KML, GPX, GeoRSS, GeoJSON, spatial CSV as well as compressed versions of these formats, zipped or KMZ. KMZ is a compressed version of KML that can also include assets such as images. The read function can alternatively take in a URL that points to a file in any of these formats. URLs should be hosted on a CORs enabled endpoint, or a proxy service should be provided in the read options. The read function returns a promise and processes in asynchornously to minimize impact to the UI thread.

When reading compressed files (zip or KMZ files), they will be unzipped and scanned for the first valid file (doc.kml) or file extension (.kml, .xml, .geojson, .json, .csv, .tsv, .txt).

Images referenced in KML and GeoRSS files are preloaded to ensure they are accessible. Inaccessible image data may load an alternative fallback image or will be removed from the styles. Images extracted from KMZ files will be converted to data URIs. 

The result from the read function is a `SpatialDataSet` object. This object extends the GeoJSON FeatureCollection class and can easily be passed into a `DataSource` as-is to render its features on a map. The `SpatialDataSet` not only contains feature information but may also include KML ground overlays, processing metrics and other details as outlined in the following table.

| Property name | Type | Description | 
|---------------|------|-------------|
| `bbox` | `BoundingBox` | Bounding box of all the data in the data set. |
| `features` | `Feature[]` | GeoJSON features within the data set. |
| `groundOverlays` | `(atlas.layer.ImageLayer | atlas.layers.OgcMapLayer)[]` | An array of KML GroundOverlays. |
| `icons` | Record&lt;string, string&gt; | A set of icon URL's. Key = icon name, Value = URL. |
| properties | any | Property information provided at the document level of a spatial data set. |
| `stats` | `SpatialDataSetStats` | Statistics about the content and processing time of a spatial data set. |
| `type` | `'FeatureCollection'` | Read only GeoJSON type value. |

The following code shows how to read a simple spatial data set, in this case a GPX file using a URL, and render it on the map using the `SimpleDataLayer` class.

//TODO: codepen - Load spatial data (simple)

The following code shows how to read and load KML (or KMZ) onto the map. KML can contain ground overlays which will be in the form of an `ImageLyaer` or `OgcMapLayer` these have to be added to the map seperately from the features. Additionally, if the data set has custom icons, those need to be loaded into the maps resources before the features are.

//TODO: codepen - Load KML onto map

The following code shows how to read a delimited file (CSV) that has spatial data columns and renders it on the map.

//TODO: codepen - Add a delimited file (CSV) to the map

## Write spatial data

There are two write main write functions in the spatial IO module. The `atlas.io.write` function generates a string, while the `atlas.io.writeCompressed` function generates a compressed zip file that contains a text-based file with the spatial data in it. Both of these functions returna promise and can take in any of the following data to write; `SpatialDataSet`, `DataSource`, `ImageLayer`, `OgcMapLayer`, feature collection, feature, geometry, or an array of any combination of these. When writing you can specify the desired file format. If this is not specified, the data will be written as KML.

The following tool demonstrates majority of the write options that can be used with the `atlas.io.write` function.

//TODO: codepen - Spatial data write options (Only show the result tab like the layer options examples)

The following sample allows you to drag and drop spatial files onto the map to load them, and export GeoJSON data from the map and write it in one of the supported spatial data formats as a string or compressed file.

//TODO: codepen - Drag and drop spatial files onto map (Only show the result tab like the layer options examples)

## Read and write Well Known Text (WKT)

[Well Known Text](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry), often refered to as WKT for short, is an Open Geospatial Consortium (OGC) standard for representing spatial geometries as text. Many geospatial systems support WKT such as SQL Azure and Azure Postgres (with the PostGIS plugin). Like most OGC standards, coordinates are formatted as "longitude latitude" to align with the "x y" convention. As an example, a point at longitude -110 and latitude 45 can be written as `POINT(-110 45)` using WKT format. The following table provides details on the geomtry types supported for reading and writing WKT. 

Well-known text can be read using the `atlas.io.ogc.WKT.read` function, and written using the `atlas.io.ogc.WKT.write` function. 

The following code shows how to read the well-known text string `POINT(-122.34009 47.60995)` and render it on the map using a bubble layer.

//TODO: codepen - Read Well Known Text

The following code demonstrates reading and writing well-known text back and forth. 

//TODO: codepen - Read and write Well Known Text

## Read and write GML

GML is a spatial XML file specification that is often used as an extension to other XML specifications. The XML that contains GML can be read using the `atlas.io.core.GmlReader.read` function and GeoJSON data can be written as XML with GML tags using the `atlas.io.core.GmlWriter.write` functions. The read function has two options:

- `isAxisOrderLonLat` - The axis order of coordinates "latitude, longitude" or "longitude, latitude" can vary between data sets and is not always well defined. By default the GML reader reads the coordinate data as "latitude, longitude", but setting this option to true will read it as "longitude, latitude".
- `propertyTypes` - This option is a key value lookup table where the key is the name of a property in the data set and the value is the object type to cast the value to when parsing. The supported type values are 'string`, 'number', 'boolean', 'date'. If a property is not in the look up table or the type not defined, it will be parsed as a string.

Note: The `atlas.io.read` function will attempt to fallback to the `atlas.io.core.GmlReader.read` function when it detects that the input data is XML but isn't one of the other support spatial XML formats.

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
