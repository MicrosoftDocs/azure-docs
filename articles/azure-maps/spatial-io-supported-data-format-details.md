
# Supported data format details

This article provides details on the read and write support for all XML tags and Well Known Text geometry types , as well as details on how delimited spatial data is parsed in the spatial IO module.

## Supported XML namespaces

The spatial IO module supports XML tags from the following namespaces.

| Namespace Prefix | Namespace URI   | Notes                                                                    |
|------------------|-----------------|--------------------------------------------------------------------------|
| `atom`           | `http://www.w3.org/2005/Atom`   |                                                          |
| `geo`            | `http://www.w3.org/2003/01/geo/wgs84_pos#`  | Read only support in GeoRSS files.           |
| `georss`         | `http://www.georss.org/georss`  |                                                          |
| `geourl`         | `http://geourl.org/rss/module/` | Read only support in GeoRSS files.                       |
| `gml`            | `http://www.opengis.net/gml`    |                                                          |
| `gpx`            | `http://www.topografix.com/GPX/1/1` |                                                      |
| `gpxx`           | `http://www.garmin.com/xmlschemas/GpxExtensions/v3` | Read only support in GPX files. Parses and uses DisplayColor. All other properties added to shape metadata. |
| `gpx_style`      | `http://www.topografix.com/GPX/gpx_style/0/2`      | Supported in GPX files. Uses line color. |
| `gx`             | `http://www.google.com/kml/ext/2.2` |                                                      |
| `kml`            | `http://www.opengis.net/kml/2.2`    |                                                      |
| `rss`            |                                 | Read only. GeoRSS writes using Atom format.              |

## Supported XML elements

The spatial IO module supports the following XML elements. Any XML tags that are not supported will be converted into a JSON object and added to the `properties` property of the parent shape or layer.

### KML elements

The spatial IO module supports the following KML elements.

| Element Name         | Read    | Write   | Notes                                                                                                                      |
|----------------------|---------|---------|----------------------------------------------------------------------------------------------------------------------------|
| `address`            | partial | yes     | Object is parsed but is not used for positioning shape.                                                                    |
| `AddressDetails`     | partial | no      | Object is parsed but is not used for positioning shape.                                                                    |
| `atom:author`        | yes     | yes     |                                                                                                                            |
| `atom:link`          | yes     | yes     |                                                                                                                            |
| `atom:name`          | yes     | yes     |                                                                                                                            |
| `BalloonStyle`       | partial | partial | `displayMode` note supported. Converted to a `PopupTemplate`. To write, add a `popupTemplate` property as a property of the feature you want to write it for. |
| `begin`              | yes     | yes     |                                                                                                                            |
| `color`              | yes     | yes     | Includes \#AABBGGRR and \#BBGGRR. Parsed into a CSS color string                                                           |
| `colorMode`          | yes     | no      |                                                                                                                            |
| `coordinates`        | yes     | yes     |                                                                                                                            |
| `Data`               | yes     | yes     |                                                                                                                            |
| `description`        | yes     | yes     |                                                                                                                            |
| `displayName`        | yes     | yes     |                                                                                                                            |
| `Document`           | yes     | yes     |                                                                                                                            |
| `drawOrder`          | partial | no      | Read for ground overlays and used to sort them. 
| `east`               | yes     | yes     |                                                                                                                            |
| `end`                | yes     | yes     |                                                                                                                            |
| `ExtendedData`       | yes     | yes     | Supports untyped `Data`, `SimpleData` or `Schema`, and entity replacements of the form `$[dataName]`.                      |
| `extrude`            | partial | partial | Only supported for polygons. MultiGeometry that have polygons of different heights, will be broken out into individual features. Line styles not supported. Polygons with an altitude of 0 will be rendered as a flat polygon using. When reading, the altitude of the first coordinate in the exterior ring will added as a height property of the polygon and used to render it accordingly on the map. |
| `fill`               | yes     | yes     |                                                                                                                            |
| `Folder`             | yes     | yes     |                                                                                                                            |
| `GroundOverlay`      | yes     | yes     | `color` not supported                                                                                                      |
| `heading`            | partial | no      | Parsed but not rendered by `SimpleDataLayer`. Only writes if data stored in property of shape.                             |
| `hotSpot`            | yes     | partial | Only writes if data stored in property of shape. Units are outputted as "pixels" only.                                     |
| `href`               | yes     | yes     |                                                                                                                            |
| `Icon`               | partial | partial | Parsed but not rendered by `SimpleDataLayer`. Only writes icon property of shape if it contains data a URI. Only `href` supported. |
| `IconStyle`          | partial | partial | `icon`, `heading`, `colorMode`, and `hotspots` values are parsed but not rendered by `SimpleDataLayer`                     |
| `innerBoundaryIs`    | yes     | yes     |                                                                                                                            |
| `kml`                | yes     | yes     |                                                                                                                            |
| `LabelStyle`         | no      | no      |                                                                                                                            |
| `LatLonBox`          | yes     | yes     |                                                                                                                            |
| `gx:LatLonQuad`      | yes     | yes     |                                                                                                                            |
| `LinearRing`         | yes     | yes     |                                                                                                                            |
| `LineString`         | yes     | yes     |                                                                                                                            |
| `LineStyle`          | yes     | yes     | `colorMode` not supported.                                                                                                 |
| `Link`               | yes     | no      | Only the `href` property is supported for network links.                                                                   |
| `MultiGeometry`      | partial | partial | May be broken out intoo individual features when read.                                                                     |
| `name`               | yes     | yes     |                                                                                                                            |
| `NetworkLink`        | yes     | no      | Links need to be on same domain as the document.                                                                           |
| `NetworkLinkControl` | no      | no      |                                                                                                                            |
| `north`              | yes     | yes     |                                                                                                                            |
| `open`               | yes     | yes     |                                                                                                                            |
| `outerBoundaryIs`    | yes     | yes     |                                                                                                                            |
| `outline`            | yes     | yes     |                                                                                                                            |
| `overlayXY`          | no      | no      |                                                                                                                            |
| `Pair`               | partial | no      | Only the `normal` style in a `StyleMap` is supported, not `highlight`.                                                     |
| `phoneNumber`        | yes     | yes     |                                                                                                                            |
| `PhotoOverlay`       | no      | no      |                                                                                                                            |
| `Placemark`          | yes     | yes     |                                                                                                                            |
| `Point`              | yes     | yes     |                                                                                                                            |
| `Polygon`            | yes     | yes     |                                                                                                                            |
| `PolyStyle`          | yes     | yes     |                                                                                                                            |
| `Region`             | partial | partial | `LatLongBox` supported at document level.                                                                      |
| `rotation`           | no      | no      |                                                                                                                            |
| `rotationXY`         | no      | no      |                                                                                                                            |
| `scale`              | no      | no      |                                                                                                                            |
| `Schema`             | yes     | yes     |                                                                                                                            |
| `SchemaData`         | yes     | yes     |                                                                                                                            |
| `schemaUrl`          | partial | yes     | Does not support loading styles from external documents that are not included inside of a KMZ.                             |
| `ScreenOverlay`      | no      | no      |                                                                                                                            |
| `screenXY`           | no      | no      |                                                                                                                            |
| `SimpleData`         | yes     | yes     |                                                                                                                            |
| `SimpleField`        | yes     | yes     |                                                                                                                            |
| `size`               | no      | no      |                                                                                                                            |
| `Snippet`            | partial | partial | `maxLines` attribute ignored.                                                                                              |
| `south`              | yes     | yes     |                                                                                                                            |
| `Style`              | yes     | yes     |                                                                                                                            |
| `StyleMap`           | partial | no      | Only the normal style in a `StyleMap` is supported.                                                                        |
| `styleUrl`           | partial | yes     | External style URLs not supported.                                                                                         |
| `text`               | yes     | yes     | Replacement of `$[geDirections]` is not supported                                                                          |
| `textColor`          | yes     | yes     |                                                                                                                            |
| `TimeSpan`           | yes     | yes     |                                                                                                                            |
| `TimeStamp`          | yes     | yes     |                                                                                                                            |
| `value`              | yes     | yes     |                                                                                                                            |
| `viewRefreshMode`    | partial | no      | Only `onStop` supported for ground overlays if pointing to a WMS service. Will append BBOX=[bboxWest],[bboxSouth],[bboxEast],[bboxNorth] to URL and update as the map moves.  |
| `visibility`         | yes     | yes     |                                                                                                                            |
| `west`               | yes     | yes     |                                                                                                                            |
| `when`               | yes     | yes     |                                                                                                                            |
| `width`              | yes     | yes     |                                                                                                                            |

### GeoRSS elements

The spatial IO module supports the following GeoRSS elements.

| Element Name             | Read    | Write | Notes                                                                                          |
|--------------------------|---------|-------|------------------------------------------------------------------------------------------------|
| `atom:author`            | yes     | yes   |                                                                                                |
| `atom:category`          | yes     | yes   |                                                                                                |
| `atom:content`           | yes     | yes   |                                                                                                |
| `atom:contributor`       | yes     | yes   |                                                                                                |
| `atom:email`             | yes     | yes   |                                                                                                |
| `atom:entry`             | yes     | yes   |                                                                                                |
| `atom:feed`              | yes     | yes   |                                                                                                |
| `atom:icon`              | yes     | yes   |                                                                                                |
| `atom:id`                | yes     | yes   |                                                                                                |
| `atom:link`              | yes     | yes   |                                                                                                |
| `atom:logo`              | yes     | yes   |                                                                                                |
| `atom:name`              | yes     | yes   |                                                                                                |
| `atom:published`         | yes     | yes   |                                                                                                |
| `atom:rights`            | yes     | yes   |                                                                                                |
| `atom:source`            | yes     | yes   |                                                                                                |
| `atom:subtitle`          | yes     | yes   |                                                                                                |
| `atom:summary`           | yes     | yes   |                                                                                                |
| `atom:title`             | yes     | yes   |                                                                                                |
| `atom:updated`           | yes     | yes   |                                                                                                |
| `atom:uri`               | yes     | yes   |                                                                                                |
| `geo:lat`                | yes     | no    | Written as a `georss:point`.                                                                   |
| `geo:lon`                | yes     | no    | Written as a `georss:point`.                                                                   |
| `geo:long`               | yes     | no    | Written as a `georss:point`.                                                                   |
| `georss:box`             | yes     | no    | Read as a polygon and given a `subType` property of "Rectangle"                                |
| `georss:circle`          | yes     | yes   |                                                                                                |
| `georss:elev`            | yes     | yes   |                                                                                                |
| `georss:featurename`     | yes     | yes   |                                                                                                |
| `georss:featuretypetag`  | yes     | yes   |                                                                                                |
| `georss:floor`           | yes     | yes   |                                                                                                |
| `georss:line`            | yes     | yes   |                                                                                                |
| `georss:point`           | yes     | yes   |                                                                                                |
| `georss:polygon`         | yes     | yes   |                                                                                                |
| `georss:radius`          | yes     | yes   |                                                                                                |
| `georss:relationshiptag` | yes     | yes   |                                                                                                |
| `georss:where`           | yes     | yes   |                                                                                                |
| `geourl:latitude`        | yes     | no    | Written as a `georss:point`.                                                                   |
| `geourl:longitude`       | yes     | no    | Written as a `georss:point`.                                                                   |
| `position`               | yes     | no    | Some XML feeds will wrap GML with a position tag instead of with a georss:where tag. Will read this, but will write using a georss:where tag. |
| `rss`                    | yes     | no    | GeoRSS written in ATOM format.                                                                 |
| `rss:author`             | yes     | partial | Written as an `atom:author`.                                                                 |
| `rss:category`           | yes     | partial | Written as an `atom:category`.                                                               |
| `rss:channel`            | yes     | no    |                                                                                                |
| `rss:cloud`              | yes     | no    |                                                                                                |
| `rss:comments`           | yes     | no    |                                                                                                |
| `rss:copyright`          | yes     | partial | Written as an `atom:rights` if shape doesn't have an `rights` `properties` property already.       |
| `rss:description`        | yes     | partial | Written as an `atom:content` if shape doesn't have a `content` `properties` property already.      |
| `rss:docs`               | yes     | no    |                                                                                                |
| `rss:enclosure`          | yes     | no    |                                                                                                |
| `rss:generator`          | yes     | no    |                                                                                                |
| `rss:guid`               | yes     | partial | Written as an `atom:id` if shape doesn't have an `id` `properties` property already.         |
| `rss:image`              | yes     | partial | Written as an `atom:logo` if shape doesn't have a `logo` `properties` property already.      |
| `rss:item`               | yes     | partial | Written as an `atom:entry`.                                                                  |
| `rss:language`           | yes     | no    |                                                                                                |
| `rss:lastBuildDate`      | yes     | partial | Written as an `atom:updated` if shape doesn't have an `updated` `properties` property already.     |
| `rss:link`               | yes     | partial | Written as an `atom:link`.                                                                   |
| `rss:managingEditor`     | yes     | partial | Written as an `atom:contributor`.                                                            |
| `rss:pubDate`            | yes     | partial | Written as an `atom:published` if shape doesn't have a `published` `properties` property already.  |
| `rss:rating`             | yes     | no    |                                                                                                |
| `rss:skipDays`           | yes     | no    |                                                                                                |
| `rss:skipHours`          | yes     | no    |                                                                                                |
| `rss:source`             | yes     | partial | Written as an `atom:source` containing an `atom:link`.                                       |
| `rss:textInput`          | yes     | no    |                                                                                                |
| `rss:title`              | yes     | partial | Written as an `atom:title`.                                                                  |
| `rss:ttl`                | yes     | no    |                                                                                                |
| `rss:webMaster`          | yes     | no    |                                                                                                |

### GML elements

The spatial IO module supports the following GML elements. 

| Element Name            | Read | Write | Notes                                                                                  |
|-------------------------|------|-------|----------------------------------------------------------------------------------------|
| `gml:coordinates`       | yes  | no    | Written as `gml:posList`.                                                              |
| `gml:curveMember`       | yes  | no    |                                                                                        |
| `gml:curveMembers`      | yes  | no    |                                                                                        |
| `gml:Box`               | yes  | no    | Written as `gml:Envelope`.                                                             |
| `gml:description`       | yes  | yes   |                                                                                        |
| `gml:Envelope`          | yes  | yes   |                                                                                        |
| `gml:exterior`          | yes  | yes   |                                                                                        |
| `gml:Feature`           | yes  | no    | Written as a shape.                                                                    |
| `gml:FeatureCollection` | yes  | no    | Written as a geometry collection.                                                      |
| `gml:featureMember`     | yes  | no    | Written as a geometry collection.                                                      |
| `gml:geometry`          | yes  | no    | Written as a shape.                                                                    |
| `gml:geometryMember`    | yes  | yes   |                                                                                        |
| `gml:geometryMembers`   | yes  | yes   |                                                                                        |
| `gml:identifier`        | yes  | yes   |                                                                                        |
| `gml:innerBoundaryIs`   | yes  | no    | Written using `gml.interior`.                                                          |
| `gml:interior`          | yes  | yes   |                                                                                        |
| `gml:LinearRing`        | yes  | yes   |                                                                                        |
| `gml:LineString`        | yes  | yes   |                                                                                        |
| `gml:lineStringMember`  | yes  | yes   |                                                                                        |
| `gml:lineStringMembers` | yes  | no    |                                                                                        |
| `gml:MultiCurve`        | yes  | no    | Only reads `gml:LineString` members. Written as `gml.MultiLineString`                  |
| `gml:MultiGeometry`     | partial  | partial   | Only read as a FeatureCollection.                                              |
| `gml:MultiLineString`   | yes  | yes   |                                                                                        |
| `gml:MultiPoint`        | yes  | yes   |                                                                                        |
| `gml:MultiPolygon`      | yes  | yes   |                                                                                        |
| `gml:MultiSurface`      | yes  | no    | Only reads `gml:Polygon` members. Written as `gml.MultiPolygon`                        |
| `gml:name`              | yes  | yes   |                                                                                        |
| `gml:outerBoundaryIs`   | yes  | no    | Written using `gml.exterior`.                                                          |
| `gml:Point`             | yes  | yes   |                                                                                        |
| `gml:pointMember`       | yes  | yes   |                                                                                        |
| `gml:pointMembers`      | yes  | no    |                                                                                        |
| `gml:Polygon`           | yes  | yes   |                                                                                        |
| `gml:polygonMember`     | yes  | yes   |                                                                                        |
| `gml:polygonMembers`    | yes  | no    |                                                                                        |
| `gml:pos`               | yes  | yes   |                                                                                        |
| `gml:posList`           | yes  | yes   |                                                                                        |
| `gml:surfaceMember`     | yes  | yes   |                                                                                        |

**Additional notes**

 - Member elements will be searched for a geometry that may be buried within child elements as many XML formats that extend from GML may not place place a geometry as direct child of a member element.
 - `srsName` is partially supported for WGS84 ([EPSG:4326](https://epsg.io/4326)), web mercator ([EPSG:3857](https://epsg.io/3857) or one of its alternative codes) coordinates. Any other coordinate system will be parsed as WGS84 as-is.
  - Unless specified when reading, the axis order will try and be determined based on hints in the XML feed with a preference for "latitude, longitude".
  - Additional property information will not be added to GML when writing unless a custom GML namspace is specified for the properties.

### GPX elements

The spatial IO module supports the following GPX elements.

| Element Name             | Read    | Write   | Notes                                                                                       |
|--------------------------|---------|---------|---------------------------------------------------------------------------------------------|
| `gpx:ageofdgpsdata`      | yes     | yes     |                                                                                             |
| `gpx:author`             | yes     | yes     |                                                                                             |
| `gpx:bounds`             | yes     | yes     | Converted into a LocationRect when read.                                                    |
| `gpx:cmt`                | yes     | yes     |                                                                                             |
| `gpx:copyright`          | yes     | yes     |                                                                                             |
| `gpx:desc`               | yes     | yes     | Copied into a description property when read to align with other XML formats.               |
| `gpx:dgpsid`             | yes     | yes     |                                                                                             |
| `gpx:ele`                | yes     | yes     |                                                                                             |
| `gpx:extensions`         | partial | partial | When read, style information extracted. All other extensions flattened into a simple JSON object. Only shape style information is written. |
| `gpx:geoidheight`        | yes     | yes     |                                                                                             |
| `gpx:gpx`                | yes     | yes     |                                                                                             |
| `gpx:hdop`               | yes     | yes     |                                                                                             |
| `gpx:link`               | yes     | yes     |                                                                                             |
| `gpx:magvar`             | yes     | yes     |                                                                                             |
| `gpx:metadata`           | yes     | yes     |                                                                                             |
| `gpx:name`               | yes     | yes     |                                                                                             |
| `gpx:pdop`               | yes     | yes     |                                                                                             |
| `gpx:rte`                | yes     | yes     |                                                                                             |
| `gpx:rtept`              | yes     | yes     |                                                                                             |
| `gpx:sat`                | yes     | yes     |                                                                                             |
| `gpx:src`                | yes     | yes     |                                                                                             |
| `gpx:sym`                | yes     | yes     | Value is captured, but is not used to alter the pushpin icon.                               |
| `gpx:text`               | yes     | yes     |                                                                                             |
| `gpx:time`               | yes     | yes     |                                                                                             |
| `gpx:trk`                | yes     | yes     |                                                                                             |
| `gpx:trkpt`              | yes     | yes     |                                                                                             |
| `gpx:trkseg`             | yes     | yes     |                                                                                             |
| `gpx:type`               | yes     | yes     |                                                                                             |
| `gpx:vdop`               | yes     | yes     |                                                                                             |
| `gpx:wpt`                | yes     | yes     |                                                                                             |
| `gpx_style:color`        | yes     | yes     |                                                                                             |
| `gpx_style:line`         | partial | partial | `color`, `opacity`, `width`, `lineCap` supported.                                           |
| `gpx_style:opacity`      | yes     | yes     |                                                                                             |
| `gpx_style:width`        | yes     | yes     |                                                                                             |
| `gpxx:DisplayColor`      | yes     | no      | Used to specify the color of a shape. When writing, `gpx_style:line` color will be used instead.  |
| `gpxx:RouteExtension`    | partial | no      | All properties are read into `properties`. Only `DisplayColor` is used.                     |
| `gpxx:TrackExtension`    | partial | no      | All properties are read into `properties`. Only `DisplayColor` is used.                     |
| `gpxx:WaypointExtension` | partial | no      | All properties are read into `properties`. Only `DisplayColor` is used.                     |
| `gpx:keywords`           | yes     | yes     |                                                                                             |
| `gpx:fix`                | yes     | yes     |                                                                                             |

**Additional notes**

When writing;

 - MultiPoints will be broken up into individual waypoints.
 - Polygons and MultiPolygons will be written as tracks. 
  
## Supported Well Known Text geometry types

| Geomtry type | Read | Write |
|--------------|:----:|:-----:|
| POINT | x | x |
| POINT Z | x | x | 
| POINT M | x | x<sup>[2]</sup> |
| POINT ZM | x<sup>[1]</sup><sup>[2]</sup> | | 
| LINESTRING | x | x |
| LINESTRING Z | x | x | 
| LINESTRING M | x | x<sup>[2]</sup> |
| LINESTRING ZM | x<sup>[1]</sup><sup>[2]</sup> | | 
| POLYGON | x | x |
| POLYGON Z | x | x |
| POLYGON M | x | x<sup>[2]</sup> |
| POLYGON ZM | x<sup>[1]</sup><sup>[2]</sup> | | 
| MULTIPOINT | x | x |
| MULTIPOINT Z | x | x | 
| MULTIPOINT M | x | x<sup>[2]</sup> |
| POMULTIPOINTINT ZM | x<sup>[1]</sup><sup>[2]</sup> | | 
| MULTILINESTRING | x | x |
| MULTILINESTRING Z | x | x | 
| MULTILINESTRING M | x | x<sup>[2]</sup> |
| MULTILINESTRING ZM | x<sup>[1]</sup><sup>[2]</sup> | | 
| MULTIPOLYGON | x | x |
| MULTIPOLYGON Z | x | x | 
| MULTIPOLYGON M | x | x<sup>[2]</sup> |
| MULTIPOLYGON ZM | x<sup>[1]</sup><sup>[2]</sup> | | 
| GEOMETRYCOLLECTION | x | x |
| GEOMETRYCOLLECTION Z | x | x | 
| GEOMETRYCOLLECTION M | x | x<sup>[2]</sup> | 
| GEOMETRYCOLLECTION ZM | x<sup>[1]</sup><sup>[2]</sup> | x | 

\[1\] Only Z parameter is captured and added as a third value in the Position value. 
\[2\] M parameter is not captured.

## Delimited spatial data support

Delimited spatial data, such as comma seperated value files (CSV), can often have columns that contain spatial data. There could be columns that contain latitude and longitude information, or a column that contains spatial geometry data in well known text format. 

### Spatial data column detection

When reading a delimited file that contains spatial data the header will be analyized to determine which columns contain location fields. If the header contains type information, it will be used to cast the cell values to the appropriate type. If no header is specified, the first row will be analized and used to generate a header. When analizing, looking for a column that matches one of the following names in a case-insensitive way. The order of the names is the priority should two or more names exist in a file.

**Latitude**

	- `latitude`
	- `lat`
	- `latdd`
	- `lat_dd`
	- `latitude83`
	- `latdecdeg`
	- `y`
	- `ycenter`
	- `point-y`

**Longitude**

	- `longitude`
	- `lon`
	- `lng`
	- `long`
	- `longdd`
	- `long_dd`
	- `longitude83`
	- `longdecdeg`
	- `x`
	- `xcenter`
	- `point-x`

**Elevation**

	- `elevation`
	- `elv`
	- `altitude`
	- `alt`
	- `z`

**Geography**

The first row of data will be scanned for strings that are in Well Known Text format. 

### Delimited data column types

When scanning the header row, any type information that is in the column name will be extracted and used to cast the cells in that column. 
Here is an example of a column name that has a type value "ColumnName (typeName)". The following case-insensitive type names are supported:

Numbers:

	- edm.int64
	- int
	- long
	- edm.double
	- float
	- double
	- number

Booleans:

	- edm.boolean
	- bool
	- boolean

Dates:

	- edm.datetime
	- date
	- datetime

Geography:

	- edm.geography
	- geography

Strings:

	- edm.string
	- varchar
	- text
	- case 'string

If no type information can be extracted from header, and the dynamic typing option is enabled when reading, each cell will be individually analyized to determine what data type it is best suited to be casted as.

## Next steps

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Read and write spatial data](spatial-io-read-write-spatial-data.md)
