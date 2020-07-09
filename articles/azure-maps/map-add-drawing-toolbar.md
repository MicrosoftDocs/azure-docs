---
title: Add a drawing toolbar to a map | Microsoft Azure Maps
description: How to add a drawing toolbar to a map using Azure Maps Web SDK
author: philmea
ms.author: philmea
ms.date: 09/04/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Add a drawing tools toolbar to a map

This article shows you how to use the Drawing Tools module and display the drawing toolbar on the map. The [DrawingToolbar](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.control.drawingtoolbar?view=azure-node-latest) control adds the drawing toolbar on the map. You will learn how to create maps with only one and all drawing tools and how to customize the rendering of the drawing shapes in the drawing manager.

## Add drawing toolbar

The following code creates an instance of the drawing manager and displays the toolbar on the map.

```javascript
//Create an instance of the drawing manager and display the drawing toolbar.
drawingManager = new atlas.drawing.DrawingManager(map, {
        toolbar: new atlas.control.DrawingToolbar({
            position: 'top-right',
            style: 'dark'
        })
    });
```

Below is the complete running code sample of the functionality above:

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Add drawing toolbar" src="//codepen.io/azuremaps/embed/ZEzLeRg/?height=265&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/ZEzLeRg/'>Add drawing toolbar</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Limit displayed toolbar options

The following code creates an instance of the drawing manager and displays the toolbar with just a polygon drawing tool on the map. 

```javascript
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


## Change drawing rendering style

The style of the shapes that are drawn can be customized by retrieving the underlying layers of the drawing manager by using the `drawingManager.getLayers()` function and then setting options on the individual layers. The drag handles that appear for coordinates when editing a shape are HTML markers. The style of the drag handles can be customized by passing HTML marker options into the `dragHandleStyle` and `secondaryDragHandleStyle` options of the drawing manager.  

The following code gets the rendering layers from the drawing manager and modifies their options to change rendering style for drawing. In this case, points will be rendered with a blue marker icon. Lines will be red and four pixels wide. Polygons will have a green fill color and an orange outline. It then changes the styles of the drag handles to be square icons. 

```javascript
//Get rendering layers of drawing manager.
var layers = drawingManager.getLayers();

//Change the icon rendered for points.
layers.pointLayer.setOptions({
    iconOptions: {
        image: 'marker-blue'
    }
});

//Change the color and width of lines.
layers.lineLayer.setOptions({
    strokeColor: 'red',
    strokeWidth: 4
});

//Change fill color of polygons.
layers.polygonLayer.setOptions({
    fillColor: 'green'
});

//Change the color of polygon outlines.
layers.polygonOutlineLayer.setOptions({
    strokeColor: 'orange'
});

//Update the style of the drag handles that appear when editting.
drawingManager.setOptions({
    //Primary drag handle that represents coordinates in the shape.
    dragHandleStyle: {
        anchor: 'center',
        htmlContent: '<svg width="15" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer"><rect x="0" y="0" width="15" height="15" style="stroke:black;fill:white;stroke-width:4px;"/></svg>',
        draggable: true
    },

    //Secondary drag hanle that represents mid-point coordinates that users can grab to add new cooridnates in the middle of segments.
    secondaryDragHandleStyle: {
        anchor: 'center',
        htmlContent: '<svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer"><rect x="0" y="0" width="10" height="10" style="stroke:white;fill:black;stroke-width:4px;"/></svg>',
        draggable: true
    }
});  
```

Below is the complete running code sample of the functionality above:

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Change drawing rendering style" src="//codepen.io/azuremaps/embed/OJLWpyj/?height=265&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/OJLWpyj/'>Change drawing rendering style</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Next steps

Learn how to use additional features of the drawing tools module:

> [!div class="nextstepaction"]
> [Get shape data](map-get-shape-data.md)

> [!div class="nextstepaction"]
> [React to drawing events](drawing-tools-events.md)

> [!div class="nextstepaction"]
> [Interaction types and keyboard shortcuts](drawing-tools-interactions-keyboard-shortcuts.md)

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [Drawing toolbar](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.control.drawingtoolbar?view=azure-node-latest)

> [!div class="nextstepaction"]
> [Drawing manager](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.drawing.drawingmanager?view=azure-node-latest)
