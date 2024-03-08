---
title: Add a Bubble layer to a map | Microsoft Azure Maps
description: Learn how to render points on maps as circles with fixed sizes. See how to use the Azure Maps Web SDK to add and customize bubble layers for this purpose.
author: sinnypan
ms.author: sipa
ms.date: 05/15/2023
ms.topic: conceptual
ms.service: azure-maps
ms.custom:
---

# Add a bubble layer to a map

This article shows you how to render point data from a data source as a bubble layer on a map. Bubble layers render points as circles on the map with a fixed pixel radius.

> [!TIP]
> Bubble layers by default will render the coordinates of all geometries in a data source. To limit the layer such that it only renders point geometry features set the `filter` property of the layer to `['==', ['geometry-type'], 'Point']` or `['any', ['==', ['geometry-type'], 'Point'], ['==', ['geometry-type'], 'MultiPoint']]` if you want to include MultiPoint features as well.

## Add a bubble layer

The following code loads an array of points into a data source. Then, it connects the data points are to a [bubble layer]. The bubble layer renders each bubble with a radius of six pixels and a stroke width of three pixels.

```javascript
/*Ensure that the map is fully loaded*/
map.events.add("load", function () {

  /*Add point locations*/
  var points = [
    new atlas.data.Point([-73.985708, 40.75773]),
    new atlas.data.Point([-73.985600, 40.76542]),
    new atlas.data.Point([-73.985550, 40.77900]),
    new atlas.data.Point([-73.975550, 40.74859]),
    new atlas.data.Point([-73.968900, 40.78859])]

  /*Create a data source and add it to the map*/
  var dataSource = new atlas.source.DataSource();
  map.sources.add(dataSource);
  /*Add the points to the data source*/ 
  dataSource.add(points);

  //Create a bubble layer to render the filled in area of the circle, and add it to the map.*/
  map.layers.add(new atlas.layer.BubbleLayer(dataSource, null, {
    radius: 6,
    strokeColor: "LightSteelBlue",
    strokeWidth: 3, 
    color: "DodgerBlue",
    blur: 0.5
  }));
});
```

:::image type="content" source="./media/map-add-bubble-layer/add-a-bubble-layer.png" alt-text="Screenshot showing a map displaying five blue circles, or points in the specified locations.":::

<!---------------------------------------------------------------------
<br/>
> [!VIDEO //codepen.io/azuremaps/embed/mzqaKB/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
--------------------------------------------------------------------->

## Show labels with a bubble layer

This code shows you how to use a bubble layer to render a point on the map and a symbol layer to render a label. To hide the icon of the symbol layer, set the `image` property of the icon options to `none`.

```javascript
//Create an instance of the map control and set some options.
 function InitMap()
 
    var map = new atlas.Map('myMap', {
    center: [-122.336641, 47.627631],
    zoom: 16,
    view: "Auto",
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: '{Your-Azure-Maps-Subscription-key}'
        }
    });

    /*Ensure that the map is fully loaded*/
    map.events.add("load", function () {

        /*Create point object*/
        var point =  new atlas.data.Point([-122.336641,47.627631]);

        /*Create a data source and add it to the map*/
        var dataSource = new atlas.source.DataSource();
        map.sources.add(dataSource);
        dataSource.add(point);

        map.layers.add(new atlas.layer.BubbleLayer(dataSource, null, {
            radius: 5,
            strokeColor: "#4288f7",
            strokeWidth: 6, 
            color: "white" 
        }));

        //Add a layer for rendering point data.
        map.layers.add(new atlas.layer.SymbolLayer(dataSource, null, {
            iconOptions: {
                //Hide the icon image.
                image: "none"
            },

            textOptions: {
                textField: "Museum of History & Industry (MOHAI)",
                color: "#005995",
                offset: [0, -2.2]
            },
        }));
    });
}
```

:::image type="content" source="./media/map-add-bubble-layer/show-labels-with-a-bubble-layer.png" alt-text="Screenshot showing a map displaying a point on the map with a label.":::

<!---------------------------------------------------------------------
<br/>
> [!VIDEO //codepen.io/azuremaps/embed/rqbQXy/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
--------------------------------------------------------------------->

## Customize a bubble layer

The Bubble layer only has a few styling options. Use the [Bubble Layer Options] sample to try them out. For the source code for this sample, see [Bubble Layer Options source code].

:::image type="content" source="./media/map-add-bubble-layer/bubble-layer-options.png" alt-text="Screenshot showing the Bubble Layer Options sample that shows a map with bubbles and selectable bubble layer options to the left of the map.":::

<!-------------------------------------------------------------------
<br/>

> [!VIDEO //codepen.io/azuremaps/embed/eQxbGm/?height=700&theme-id=0&default-tab=result]
--------------------------------------------------------------------->

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [BubbleLayer]

> [!div class="nextstepaction"]
> [BubbleLayerOptions]

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Create a data source]

> [!div class="nextstepaction"]
> [Add a symbol layer]

> [!div class="nextstepaction"]
> [Use data-driven style expressions]

> [!div class="nextstepaction"]
> [Code samples]

[Bubble Layer Options]: https://samples.azuremaps.com/bubble-layer/bubble-layer-options
[Bubble Layer Options source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Bubble%20Layer/Bubble%20Layer%20Options/Bubble%20Layer%20Options.html
[bubble layer]: /javascript/api/azure-maps-control/atlas.layer.bubblelayer

[BubbleLayer]: /javascript/api/azure-maps-control/atlas.layer.bubblelayer
[BubbleLayerOptions]: /javascript/api/azure-maps-control/atlas.bubblelayeroptions
[Create a data source]: create-data-source-web-sdk.md
[Add a symbol layer]: map-add-pin.md
[Use data-driven style expressions]: data-driven-style-expressions-web-sdk.md
[Code samples]: /samples/browse/?products=azure-maps