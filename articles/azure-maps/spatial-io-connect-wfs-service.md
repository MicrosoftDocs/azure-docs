

# Connect to a WFS service

A Web Feature Service (WFS) is a web service for querying spatial data that has a standardized API interface that has been defined by the Open Geospatial Consortium (OGC). 

The following outlines the features supported by the `WfsClient` class in the spatial IO module.

- Supported versions: 1.0.0, 1.1.0, 2.0.0
- Supported operations; `GetCapabilities`, `GetFeature`, `DescribeFeatureType`
- Supported filter operators: binary comparisons, logic, math, value, `bbox`.
- Requests are made only using HTTP GET.

## Using the WFS client

The `atlas.io.ogc.WfsClient` class in the spatial IO module makes it easy to query a WFS service and convert the responses into GeoJSON objects that can easily be used with the Azure Maps Web SDK. 

The following code shows how to query a WFS service and render the features it returns on the map.

//Codepen - Simple WFS example

## Supported filters

The specification for the WFS standard makes use of OGC filters. The following filters are supported by the WFS client, assuming the service being called also supports these filters.

*Logical operaters*

- `And`
- `Or`
- `Not`

*Value operators*

- `GmlObjectId`
- `ResourceId`

*Math operators*

- `Add`
- `Sub`
- `Mul`
- `Div`

*Comparison operators*

- `PropertyIsEqualTo`
- `PropertyIsNotEqualTo`
- `PropertyIsLessThan`
- `PropertyIsGreaterThan`
- `PropertyIsLessThanOrEqualTo`
- `PropertyIsGreaterThanOrEqualTo`
- `PropertyIsLike`
- `PropertyIsNull`
- `PropertyIsNil`
- `PropertyIsBetween`

Custom filter strings can also be passed into the `CustomFilter` class.

The following code provides examples of different filters being used with the WFS client.

//TODO: codepen - WFS filter examples

## WFS service explorer

The following code demonstrates how to use the WFS client with the map to explorer WFS serivces. Select layers within the service and see the legend associated with those layers.

//TODO: codepen - WFS service explorer (Don't worry about seperating this into HTMl/CSS/JavaScript. Just put all code in the HTML tab. Have the pen only show the Result tab, like our layer options examples)

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [WfsClient](https://docs.microsoft.com/en-us/javascript/api/azure-maps-spatial-io/atlas.io.ogc.wfsclient)

> [!div class="nextstepaction"]
> [WfsServiceOptions](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.wfsserviceoptions)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Leverage core operations](spatial-io-core-operations.md)

> [!div class="nextstepaction"]
> [Supported data format details](spatial-io-supported-data-format-details.md)
