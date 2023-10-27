---
title: Add a polygon extrusion layer to a map
titleSuffix: Microsoft Azure Maps
description: How to add a polygon extrusion layer to the Microsoft Azure Maps Web SDK.
author: sinnypan
ms.author: sipa
ms.date: 06/15/2023
ms.topic: how-to
ms.service: azure-maps
---

# Add a polygon extrusion layer to the map

This article shows you how to use the polygon extrusion layer to render areas of `Polygon` and `MultiPolygon` feature geometries as extruded shapes. The Azure Maps Web SDK supports rendering of Circle geometries as defined in the [extended GeoJSON schema]. These circles can be transformed into polygons when rendered on the map. All feature geometries may be updated easily when wrapped with the [atlas.Shape] class.

## Use a polygon extrusion layer

Connect the [polygon extrusion layer] to a data source. Then, loaded it on the map. The polygon extrusion layer renders the areas of a `Polygon` and `MultiPolygon` features as extruded shapes. The `height` and `base` properties of the polygon extrusion layer define the base distance from the ground and height of the extruded shape in **meters**. The following code shows how to create a polygon, add it to a data source, and render it using the Polygon extrusion layer class.

> [!NOTE]
> The `base` value defined in the polygon extrusion layer should be less than or equal to that of the `height`.

```javascript
var map, datasource, polygonLayer;

function InitMap()
{
  map = new atlas.Map('myMap', {
    center: [-73.985708, 40.75773],
    zoom: 12,
    //Pitch the map so that the extrusion of the polygons is visible.
    pitch: 45,
    view: 'Auto',

    //Add authentication details for connecting to Azure Maps.
    authOptions: {
      // Get an Azure Maps key at https://azuremaps.com/.
      authType: 'subscriptionKey',
      subscriptionKey: '{Your-Azure-Maps-Subscription-key}'
    },
    styleDefinitionsVersion: "2023-01-01"
  });

  //Wait until the map resources are ready.
  map.events.add('ready', function () {
    /*Create a data source and add it to the map*/
    datasource = new atlas.source.DataSource();
    map.sources.add(datasource);

    datasource.add(new atlas.data.Polygon([
      [
        [
        -73.95838379859924,
        40.80027995478159
        ],
        [
        -73.98154735565186,
        40.76845986171129
        ],
        [
        -73.98124694824219,
        40.767761062136955
        ],
        [
        -73.97361874580382,
        40.76461637311633
        ],
        [
        -73.97306084632874,
        40.76512830937617
        ],
        [
        -73.97259950637817,
        40.76490890860481
        ],
        [
        -73.9494466781616,
        40.79658450499243
        ],
        [
        -73.94966125488281,
        40.79708807289436
        ],
        [
        -73.95781517028809,
        40.80052360358227
        ],
        [
        -73.95838379859924,
        40.80027995478159
        ]
      ]
    ]));

    //Create and add a polygon extrusion layer to the map below the labels so that they are still readable.
    map.layers.add(new atlas.layer.PolygonExtrusionLayer(datasource, null, {
      fillColor: "#fc0303",
      fillOpacity: 0.7,
      height: 500
      }), "labels");
  });
}
```

:::image type="content" source="./media/map-extruded-polygon/polygon-extrusion-layer.png"alt-text="A screenshot of a map showing New York City with a polygon extrusion layer covering central park with what looks like a rectangular red box. The maps angle is set to 45 degrees giving it a 3d appearance.":::

<!------------------------------------------------------------
> [!VIDEO https://codepen.io/azuremaps/embed/wvvBpvE?height=265&theme-id=0&default-tab=js,result&editable=true]
------------------------------------------------------------>

## Add data driven polygons

A choropleth map can be rendered using the polygon extrusion layer. Set the `height` and `fillColor` properties of the extrusion layer to the measurement of the statistical variable in the `Polygon` and `MultiPolygon` feature geometries.

The [Create a Choropleth Map] sample shows an extruded choropleth map of the United States based on the measurement of the population density by state. For the source code for this sample, see [Create a Choropleth Map source code].

:::image type="content" source="./media/map-extruded-polygon/choropleth-map.png"alt-text="A screenshot of a map showing a choropleth map rendered using the polygon extrusion layer.":::

<!------------------------------------------------------------
> [!VIDEO https://codepen.io/azuremaps/embed/eYYYNox?height=265&theme-id=0&default-tab=result&editable=true]
------------------------------------------------------------>

## Add a circle to the map

Azure Maps uses an extended version of the GeoJSON schema that provides a [definition for circles]. An extruded circle can be rendered on the map by creating a `point` feature with a `subType` property of `Circle` and a numbered `Radius` property representing the radius in **meters**. For example:

```javascript
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-105.203135, 39.664087]
    },
    "properties": {
        "subType": "Circle",
        "radius": 1000
    }
} 
```

The Azure Maps Web SDK converts these `Point` features into `Polygon` features under the hood. These `Point` features can be rendered on the map using polygon extrusion layer as shown in the following code sample.

```javascript
var map, datasource;

function InitMap()
{
  map = new atlas.Map('myMap', {
    center: [-105.2, 39.7],
    zoom: 10.5,
    pitch: 60,
    view: 'Auto',

    //Add authentication details for connecting to Azure Maps.
    authOptions: {
      // Get an Azure Maps key at https://azuremaps.com/.
      authType: 'subscriptionKey',
      subscriptionKey: '{Your-Azure-Maps-Subscription-key}'
    },
  });    

  //Wait until the map resources are ready.
  map.events.add('ready', function () {
    /*Create a data source and add it to the map*/
    datasource = new atlas.source.DataSource();
    map.sources.add(datasource);

    datasource.add(new atlas.data.Feature(new atlas.data.Point([-105.2, 39.7]), {
      subType: "Circle",
      radius: 1000
    }));


    /*Create and add a polygon Extrusion layer to render the extruded polygon to the map*/
    map.layers.add(new atlas.layer.PolygonExtrusionLayer(datasource, null, {
      base: 5000,
      fillColor: "#02fae1",
      fillOpacity: 0.7,
      height: 5500
    }));
  });
}
```

:::image type="content" source="./media/map-extruded-polygon/add-circle-to-map.png"alt-text="A screenshot of a map showing a green circle.":::

<!------------------------------------------------------------
> [!VIDEO https://codepen.io/azuremaps/embed/zYYYrxo?height=265&theme-id=0&default-tab=js,result&editable=true]
------------------------------------------------------------>

## Customize a polygon extrusion layer

The Polygon Extrusion layer has several styling options. The [Polygon Extrusion Layer Options] sample is a tool to try them out. For the source code for this sample, see [Polygon Extrusion Layer Options source code].

:::image type="content" source="./media/map-extruded-polygon/polygon-extrusion-layer-options.png"alt-text="A screenshot of the Azure Maps code sample that shows how the different options of the polygon extrusion layer affect rendering.":::
<!------------------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/PoogBRJ/?height=700&theme-id=0&default-tab=result]
------------------------------------------------------------>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Polygon]

> [!div class="nextstepaction"]
> [polygon extrusion layer]

More resources:

> [!div class="nextstepaction"]
> [Azure Maps GeoJSON specification extension]

[atlas.Shape]: /javascript/api/azure-maps-control/atlas.shape
[Azure Maps GeoJSON specification extension]: extend-geojson.md#circle
[Create a Choropleth Map source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Demos/Create%20a%20Choropleth%20Map/Create%20a%20Choropleth%20Map.html
[Create a Choropleth Map]: https://samples.azuremaps.com/?sample=create-a-choropleth-map
[definition for circles]: extend-geojson.md#circle
[extended GeoJSON schema]: extend-geojson.md#circle
[Polygon Extrusion Layer Options source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Polygons/Polygon%20Extrusion%20Layer%20Options/Polygon%20Extrusion%20Layer%20Options.html
[Polygon Extrusion Layer Options]: https://samples.azuremaps.com/?sample=polygon-extrusion-layer-options
[polygon extrusion layer]: /javascript/api/azure-maps-control/atlas.layer.polygonextrusionlayer
[Polygon]: /javascript/api/azure-maps-control/atlas.data.polygon
