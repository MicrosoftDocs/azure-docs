---
title: Add a drawing toolbar to Azure Maps| Microsoft Docs
description: How to add a drawing toolbar to a map using Azure Maps Web SDK
author: walsehgal
ms.author: v-musehg
ms.date: 08/22/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Add a drawing tools toolbar to a map

This article shows you how to use the Drawing Tools module and display the drawing toolbar on the map. The [DrawingToolbar](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.control.drawingtoolbar?view=azure-node-latest) adds the drawing toolbar on the map. You will learn how to create maps with only one and all drawing tools and how to customize the rendering of the drawing shapes in the drawing manager.


## Add a polygon drawing tool

The following code creates an instance of the drawing manager and displays the toolbar with just a polygon drawing tool on the map.

```Javascript
//Create an instance of the drawing manager and display the drawing toolbar with polygon drawing tool.
drawingManager = new atlas.drawing.DrawingManager(map, {
        toolbar: new atlas.control.DrawingToolbar({
            position: 'top-right',
            style: 'light',
            buttons: ["draw-polygon"]
        })
    });
```

Below is the complete running code sample of the functionality above:

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Add a polygon drawing  tool" src="//codepen.io/azuremaps/embed/OJLWWMy/?height=265&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/OJLWWMy/'>Add a polygon drawing  tool</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Add drawing tools

The following code creates an instance of the drawing manager and displays the toolbar with all of the drawing tools on the map.

```Javascript
//Create an instance of the drawing manager and display the drawing toolbar.
drawingManager = new atlas.drawing.DrawingManager(map, {
        toolbar: new atlas.control.DrawingToolbar({
            position: 'top-right',
            style: 'light'
        })
    });
```

Below is the complete running code sample of the functionality above:

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Add drawing toolbar" src="//codepen.io/azuremaps/embed/ZEzLeRg/?height=265&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/ZEzLeRg/'>Add drawing toolbar</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Change drawing rendering style

The following code gets the rendering layers from the drawing manager and modifies their options to rendering style for drawing.

```Javascript
var layers = drawingManager.getLayers();
    layers.pointLayer.setOptions({
        iconOptions: {
            image: 'marker-blue',
            size: 1
        }
    });
    layers.lineLayer.setOptions({
        strokeColor: 'red',
        strokeWidth: 4
    });
    layers.polygonLayer.setOptions({
        fillColor: 'green'
    });
    layers.polygonOutlineLayer.setOptions({
        strokeColor: 'orange'
    });
```

Below is the complete running code sample of the functionality above:

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Change drawing rendering style" src="//codepen.io/azuremaps/embed/OJLWpyj/?height=265&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/OJLWpyj/'>Change drawing rendering style</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

