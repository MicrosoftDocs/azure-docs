---
title: Add an Image layer to Azure Maps | Microsoft Docs
description: How to add an Image Layer to the Javascript map
author: rbrundritt
ms.author: richbrun
ms.date: 12/3/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add an image layer to a map

This article shows you how you can overlay an image to fixed set of coordinates on the map. There are many scenarios in which overlaying an image on the map is done. Here are few examples of the type of images often overlaid on maps;

* Images captured from drones.
* Building floorplans.
* Historical or other specialized map images.
* Blueprints of job sites.
* Weather radar images.

> [!TIP]
> An [ImageLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.imagelayer?view=azure-iot-typescript-latest) is a quick an easy way to overlay an image on a map. However, if the image is large, the browser may struggle to load it. In this case, consider breaking your image up into tiles and loading them into the map as a [TileLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.tilelayer?view=azure-iot-typescript-latest).

## Add an image layer

This sample shows how to overlay an image of a [map of Newark New Jersey from 1922](https://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg) on the map.

<br/>

<iframe height='500' scrolling='no' title='Simple Image Layer' src='//codepen.io/azuremaps/embed/eQodRo/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/eQodRo/'>Simple Image Layer</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a Map object. You can see [create a map](./map-create.md) for instructions.

In the second block of code, an [ImageLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.imagelayer?view=azure-iot-typescript-latest) is created by passing a URL to an image and coordinates for the four corners in the format `[Top Left Corner, Top Right Corner, Bottom Right Corner, Bottom Left Corner]`.

## Import a KML ground overlay

This sample shows how to overlay KML Ground Overlay information as an image layer on the map. KML ground overlays provide north, south, east, and west coordinates and a counter-clockwise rotation, where as the image layer expects coordinates for each corner of the image. The KML ground overlay in this sample is of the Chartres cathedral and sourced from [Wikimedia](https://commons.wikimedia.org/wiki/File:Chartres.svg/overlay.kml).

<br/>

<iframe height='500' scrolling='no' title='KML Ground Overlay as Image Layer' src='//codepen.io/azuremaps/embed/EOJgpj/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/EOJgpj/'>KML Ground Overlay as Image Layer</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The above code uses the static `getCoordinatesFromEdges` function of the [ImageLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.imagelayer?view=azure-iot-typescript-latest) class to calculate the four corners of the image from the north, south, east, west and rotation information from the KML ground overlay.


## Customize an image layer

The Image layer has many styling options. Here is a tool to try them out.

<br/>

<iframe height='700' scrolling='no' title='Image Layer Options' src='//codepen.io/azuremaps/embed/RqOGzx/?height=700&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/RqOGzx/'>Image Layer Options</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [ImageLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.imagelayer?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [ImageLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.imagelayeroptions?view=azure-iot-typescript-latest)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Add a tile layer](./map-add-tile-layer.md)