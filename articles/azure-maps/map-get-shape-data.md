---
title: Get data from shapes on a map | Microsoft Azure Maps
description: In this article learn, how to get shape data drawn on a map using the Microsoft Azure Maps Web SDK.
author: philmea
ms.author: philmea
ms.date: 09/04/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Get shape data

This article shows you how to get data of shapes that are drawn on the map. We use the **drawingManager.getSource()** function inside [drawing manager](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.drawing.drawingmanager?view=azure-node-latest#getsource--). There are various scenarios when you want to extract geojson data of a drawn shape and use it elsewhere.  


## Get data from drawn shape

The following function gets the drawn shape's source data and outputs it to the screen. 

```Javascript
function getDrawnShapes() {
    var source = drawingManager.getSource();

    document.getElementById('CodeOutput').value = JSON.stringify(source.toJson(), null, '    ');
}
```

Below is the complete running code sample, where you can draw a shape to test the functionality:

<br/>

<iframe height="686" title="Get shape data" src="//codepen.io/azuremaps/embed/xxKgBVz/?height=265&theme-id=0&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/xxKgBVz/'>Get shape data</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Next steps

Learn how to use additional features of the drawing tools module:

> [!div class="nextstepaction"]
> [React to drawing events](drawing-tools-events.md)

> [!div class="nextstepaction"]
> [Interaction types and keyboard shortcuts](drawing-tools-interactions-keyboard-shortcuts.md)

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [Drawing manager](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.drawing.drawingmanager?view=azure-node-latest)

> [!div class="nextstepaction"]
> [Drawing toolbar](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.control.drawingtoolbar?view=azure-node-latest)
