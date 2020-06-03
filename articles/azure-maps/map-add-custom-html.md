---
title: Add an HTML Marker to map | Microsoft Azure Maps
description: In this article, you will learn about how to add an HTML Marker to a map using the Microsoft Azure Maps Web SDK.
author: Philmea
ms.author: philmea
ms.date: 07/29/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add HTML markers to the map

This article shows you how to add a custom HTML such as an image file to the map as an HTML Marker.

> [!NOTE]
> HTML Markers do not connect to data sources. Instead position information is added directly to the marker and the marker is added to the maps `markers` property which is a [HtmlMarkerManager](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.htmlmarkermanager?view=azure-iot-typescript-latest).

> [!IMPORTANT]
> Unlike most layers in the Azure Maps Web control which use WebGL for rendering, HTML Markers use traditional DOM elements for rendering. As such, the more HTML markers added to a page, the more DOM elements there are. Performance can degrade after adding a few hundred HTML markers. For larger data sets consider either clustering your data or using a Symbol or Bubble layer.

## Add an HTML marker

The [HtmlMarker](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.htmlmarker?view=azure-iot-typescript-latest) class has a default style. You can customize the marker by setting the color and text options of the marker. The default style of the HTML marker class is an SVG template that has a `{color}` and `{text}` placeholder. Set the color and text properties in the HTML marker options for a quick customization. 

The following code creates an HTML marker, and sets the color property to "DodgerBlue" and the text property to "10". A popup is attached to the marker and `click` event is used to toggle the visibility of the popup.

```javascript
//Create an HTML marker and add it to the map.
var marker = new atlas.HtmlMarker({
    color: 'DodgerBlue',
    text: '10',
    position: [0, 0],
    popup: new atlas.Popup({
        content: '<div style="padding:10px">Hello World</div>',
        pixelOffset: [0, -30]
    })
});

map.markers.add(marker);

//Add a click event to toggle the popup.
map.events.add('click',marker, () => {
    marker.togglePopup();
});
```

Below is the complete running code sample of the above functionality.

<br/>

<iframe height='500' scrolling='no' title='Add an HTML Marker to a map' src='//codepen.io/azuremaps/embed/MVoeVw/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/MVoeVw/'>Add an HTML Marker to a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Create SVG templated HTML marker

The default `htmlContent` of an Html marker is an SVG template with place folders `{color}` and `{text}` in it. You can create custom SVG strings and add these same placeholders into your SVG such that setting the `color` and `text` options of the marker update these placeholders in your SVG.

<br/>

<iframe height='500' scrolling='no' title='HTML Marker with Custom SVG Template' src='//codepen.io/azuremaps/embed/LXqMWx/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/LXqMWx/'>HTML Marker with Custom SVG Template</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

> [!TIP]
> The Azure Maps web SDK provides several SVG image templates that can be used with HTML markers. For more information, see the [How to use image templates](how-to-use-image-templates-web-sdk.md) document.

## Add a CSS styled HTML marker

One of the benefits of HTML markers is that there are many great customizations that can be achieved using CSS. In this sample, the content of the HtmlMarker consists of HTML and CSS that create an animated pin that drops into place and pulses.

<br/>

<iframe height='500' scrolling='no' title='HTML DataSource' src='//codepen.io/azuremaps/embed/qJVgMx/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/qJVgMx/'>HTML DataSource</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Draggable HTML markers

This sample shows how to make an HTML marker draggable. HTML markers support `drag`, `dragstart`, and `dragend` events.

<br/>

<iframe height='500' scrolling='no' title='Draggable HTML Marker' src='//codepen.io/azuremaps/embed/wQZoEV/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/wQZoEV/'>Draggable HTML Marker</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Add mouse events to HTML markers

These samples show how to add mouse and drag events to an HTML marker.

<br/>

<iframe height='500' scrolling='no' title='Adding Mouse Events to HTML Markers' src='//codepen.io/azuremaps/embed/RqOKRz/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/RqOKRz/'>Adding Mouse Events to HTML Markers</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [HtmlMarker](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.htmlmarker?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [HtmlMarkerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.htmlmarkeroptions?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [HtmlMarkerManager](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.htmlmarkermanager?view=azure-iot-typescript-latest)

For more code examples to add to your maps, see the following articles:

> [!div class="nextstepaction"]
> [How to use image templates](how-to-use-image-templates-web-sdk.md)

> [!div class="nextstepaction"]
> [Add a symbol layer](./map-add-pin.md)

> [!div class="nextstepaction"]
> [Add a bubble layer](./map-add-bubble-layer.md)
