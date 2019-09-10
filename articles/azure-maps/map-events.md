---
title: Handle events with Azure Maps | Microsoft Docs
description: How to make an interactive Web SDK map with map events
author: jingjing-z
ms.author: jinzh
ms.date: 09/10/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Interact with the map

This article shows you how to use [map class events](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?#events) property to highlight events on the map and on different layers of the map. It also shows you how to use the map class events property to highlight events when you interact with an HTML marker.

## Interact with the map

Play with the map below, and see the corresponding mouse events highlighted on the right. You can click on the **JS tab** to view and edit the JavaScript code. You can also click on the **Edit on CodePen** button and edit the code on CodePen.

<br/>

<iframe height='600' scrolling='no' title='Interacting with the map – mouse events' src='//codepen.io/azuremaps/embed/bLZEWd/?height=600&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/bLZEWd/'>Interact with the map – mouse events</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Interact with map layers

The following code highlights the name of the events that get fired up as you interact with the Symbol Layer. The symbol, bubble, line, and polygon layer all support the same set of events. The heat map and tile layers do not support any of these events.

<br/>

<iframe height='600' scrolling='no' title='Interacting with the map – Layer Events' src='//codepen.io/azuremaps/embed/bQRRPE/?height=600&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/bQRRPE/'>Interacting with the map – Layer Events</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Interact with HTML Marker

The following code adds Javascript map events to an HTML marker. It also highlights the name of the events that get fired up as you interact with the HTML marker.

<br/>

<iframe height='500' scrolling='no' title='Interacting with the map - HTML Marker events' src='//codepen.io/azuremaps/embed/VVzKJY/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/VVzKJY/'>Interacting with the map - HTML Marker events</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The following table lists all of the supported map class events.

| Event             | Description |
|-------------------|-------------|
| boxzoomstart      | Fired when a "box zoom" interaction starts.|
| boxzoomend        | Fired when a "box zoom" interaction ends.|
| click             | Fired when a pointing device is pressed and released at the same point on the map.|
| close             | Fired when the popup is closed manually or programatically.|
| contextmenu       | Fired when the right button of the mouse is clicked or the context menu key is pressed within the map.|
| dataadded         | Fired when objects are added to the datasource.|
| dataremoved       | Fired when objects are removed from the datasource.|
| datasourceupdated | Fired when the datasource object is updated.|
| dblclick          | Fired when a pointing device is clicked twice at the same point on the map.|
| drag              | Fired repeatedly during a "drag to pan" interaction.|
| dragstart         | Fired when a "drag to pan" interaction starts.|
| dragend           | Fired when a "drag to pan" interaction ends.|
| error             | Fired when an error occurs.|
| keydown           | Fired when a key is pressed.|
| keypress          | Fired when a key that produces a typable character (an ANSI key) is pressed.|
| keyup             | Fired when a key is released.|
| layeradded        | Fired when a layer is added to the map.|
| load              | Fired immediately after all necessary resources have been downloaded and the first visually complete rendering of the map has occurred.|
| mousedown         | Fired when a pointing device is pressed within the map.|
| mousemove         | Fired when a pointing device is moved within the map.|
| mouseout          | Fired when a point device leaves the map's canvas.|
| mouseover         | Fired when a pointing device is moved within the map.|
| mouseup           | Fired when a pointing device is released within the map.|
| move              | Fired repeatedly during an animated transition from one view to another, as the result of either user interaction or methods.|
| moveend           | Fired just after the map completes a transition from one view to another, as the result of either user interaction or methods.|
| movestart         | Fired just before the map begins a transition from one view to another, as the result of either user interaction or methods.|
| open              | Fired when the popup is opened manually or programatically.|
| pitch             | Fired whenever the map's pitch (tilt) changes as. the result of either user interaction or methods.|
| pitchend          | Fired immediately after the map's pitch (tilt) finishes changing as the result of either user interaction or methods.|
| pitchstart        | Fired whenever the map's pitch (tilt) begins a change as the result of either user interaction or methods.|
| ready             | Fired when the map resoureces are loaded.|
| render            | <p> Fired whenever the map is drawn to the screen, as the result of <ul><li>a change to the map's position, zoom, pitch, or bearing</li><li>a change to the map's style</li><li>a change to a GeoJSON source</li><li>the loading of a vector tile, GeoJSON file, glyph, or sprite</li></ul></p>|
| resize            | Fired immediately after the map has been resized.|
| rotate            | Fired repeatedly during a "drag to rotate" interaction.|
| rotateend         | Fired when a "drag to rotate" interaction ends.|
| rotatestart       | Fired when a "drag to rotate" interaction starts.|
| shapechanged      | Fired when a shape object property is changed.|
| sourceadded       | Fired when a datasource object is added to the map.|
| sourceremoved     | Fired when a datasource object is removed from the map.|
| styledata         | Fired when the map's style loads or changes.|
| tokenacquired     | Fired when an AAD access token is obtained.|
| touchcancel       | Fired when a touchcancel event occurs within the map.|
| touchend          | Fired when a touchend event occurs within the map.|
| touchmove         | Fired when a touchmove event occurs within the map.|
| touchstart        | Fired when a touchstart event occurs within the map.|
| wheel             | Fired when a wheel event occurs within the map.|
| zoom              | Fired repeatedly during an animated transition from one zoom level to another, as the result of either user interaction or methods.|
| zoomend           | Fired just after the map completes a transition from one zoom level to another, as the result of either user interaction or methods.|
| zoomstart         | Fired just before the map begins a transition from one zoom level to another, as the result of either user interaction or methods.|


## Next steps

See the following articles for full code examples:

> [!div class="nextstepaction"]
> [Using the Azure Maps Services module](./how-to-use-services-module.md)

> [!div class="nextstepaction"]
> [Code samples](https://docs.microsoft.com/samples/browse/?products=azure-maps)
