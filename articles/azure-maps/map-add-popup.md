---
title: Add a popup with Azure Maps | Microsoft Docs
description: How to add a popup to Javascript map
author: jingjing-z
ms.author: jinzh
ms.date: 07/29/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add a popup to the map

This article shows you how to add a popup to a point on a map.

## Understand the code

<a id="addAPopup"></a>

The following code adds a point feature, that has `name` and `description` properties, to the map using a symbol layer. An instance of the [Popup class](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest) is created but not displayed. Mouse events are added to the symbol layer to trigger opening and closing the popup when the mouse hovers over and off of the symbol marker. When the marker symbol is hovered, the popup's `position` property is updated with position of the marker and the `content` option is updated with some HTML that wraps the  `name` and `description` properties of the point feature being hovered. The popup is then displayed on the map using its `open` function.

<br/>

<iframe height='500' scrolling='no' title='Add a pop up using Azure Maps' src='//codepen.io/azuremaps/embed/MPRPvz/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/MPRPvz/'>Add a pop up using Azure Maps</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Reusing a popup with multiple points

When you have a large number of points and only want to show one popup at a time, the best approach is to create one popup and reuse it rather than creating a popup for each point feature. By reusing the popup, the number of DOM elements created by the application is greatly reduced which can provide better performance. The following sample creates 3 point features. If you click on any of them, a popup will be displayed with the content for that point feature.

<br/>

<iframe height='500' scrolling='no' title='Reusing Popup with Multiple Pins' src='//codepen.io/azuremaps/embed/rQbjvK/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/rQbjvK/'>Reusing Popup with Multiple Pins</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Customizing a popup

By default the popup has a white background, a pointer arrow on the bottom, and a close button in the top-right corner. The following sample changes the background color to black using the `fillColor` option of the popup. The close button is removed by setting the `shoCloseButton` option to false. The HTML content of the popup use padded 10 pixels from the edges of the popup and the text is made white so it shows up nicely on the black background.  

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Customized Popup" src="//codepen.io/azuremaps/embed/ymKgdg/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/ymKgdg/'>Customized Popup</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Popup events

Popups can be opened, closed, and dragged. The popup class provides events for the help developers react to these actions. The following sample highlights which events are firing when you open, close, or drag the popup. 

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Popup events" src="//codepen.io/azuremaps/embed/BXrpvB/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/BXrpvB/'>Popup events</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Popup](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [PopupOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popupoptions?view=azure-iot-typescript-latest)

See the following great articles for full code samples:

> [!div class="nextstepaction"]
> [Add a symbol layer](./map-add-pin.md)

> [!div class="nextstepaction"]
> [Add an HTML marker](./map-add-custom-html.md)

> [!div class="nextstepaction"]
> [Add a shape](./map-add-shape.md)