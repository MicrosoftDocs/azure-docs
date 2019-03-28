---
title: Handle mouse events with Azure Maps | Microsoft Docs
description: How to make an interactive Javascript map with map events
author: jingjing-z
ms.author: jinzh
ms.date: 11/29/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Interact with the map - mouse events

This article shows you how to use [map class](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) [events](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) property to highlight events on the map and on different layers of the map. It also shows you how to use the map class events property to highlight events when you interact with an HTML marker.

## Interact with the map

<iframe height='600' scrolling='no' title='Interacting with the map – mouse events' src='//codepen.io/azuremaps/embed/bLZEWd/?height=600&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/bLZEWd/'>Interact with the map – mouse events</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

Play with the map above, and see the corresponding mouse events highlighted on the right. You can click on the **JS tab** to view and edit the JavaScript code. You can also click on the **Edit on CodePen** button and edit the code on CodePen.

## Interact with map layers

<iframe height='600' scrolling='no' title='Interacting with the map – Layer Events' src='//codepen.io/azuremaps/embed/bQRRPE/?height=600&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/bQRRPE/'>Interacting with the map – Layer Events</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The code above highlights the name of the events that get fired up as you interact with the Symbol Layer. The Symbol, Bubble, Line, and Polygon layer all support the same set of events. The Tile Layer does not support any of these events.

## Interact with HTML Marker

<iframe height='500' scrolling='no' title='Interacting with the map - HTML Marker events' src='//codepen.io/azuremaps/embed/VVzKJY/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/VVzKJY/'>Interacting with the map - HTML Marker events</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The code above adds Javascript map events to an HTML marker. It also highlights the name of the events that get fired up as you interact with the HTML marker.

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

See the following articles for full code examples:

> [!div class="nextstepaction"]
> [Using the Azure Maps Services module](./how-to-use-services-module.md)

> [!div class="nextstepaction"]
> [Code sample page](https://aka.ms/AzureMapsSamples)
