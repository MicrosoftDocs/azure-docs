---
title: Get data from shapes on a map
titleSuffix: Microsoft Azure Maps
description: In this article learn, how to get shape data drawn on a map using the Microsoft Azure Maps Web SDK.
author: sinnypan
ms.author: sipa
ms.date: 07/13/2023
ms.topic: how-to
ms.service: azure-maps
---

# Get shape data

This article shows you how to get data of shapes that are drawn on the map. We use the **drawingManager.getSource()** function inside [drawing manager](/javascript/api/azure-maps-drawing-tools/atlas.drawing.drawingmanager#getsource--). There are various scenarios when you want to extract geojson data of a drawn shape and use it elsewhere.  

## Get data from drawn shape

The following function gets the drawn shape's source data and outputs it to the screen.

```javascript
function getDrawnShapes() {
    var source = drawingManager.getSource();

    document.getElementById('CodeOutput').value = JSON.stringify(source.toJson(), null, '    ');
}
```

The [Get drawn shapes from drawing manager] code sample allows you to draw a shape on a map and then get the code used to create those drawings by using the drawing managers `drawingManager.getSource()` function. For the source code for this sample, see [Get drawn shapes from drawing manager sample code].

:::image type="content" source="./media/map-get-shape-data/get-data-from-drawn-shape.png" alt-text="A screenshot of a map with a circle drawn around Seattle. Next to the map is the code used to create the circle.":::

<!-----------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/xxKgBVz/?height=265&theme-id=0&default-tab=result]
------------------------------------------->

## Next steps

Learn how to use additional features of the drawing tools module:

> [!div class="nextstepaction"]
> [React to drawing events](drawing-tools-events.md)

> [!div class="nextstepaction"]
> [Interaction types and keyboard shortcuts](drawing-tools-interactions-keyboard-shortcuts.md)

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](/javascript/api/azure-maps-control/atlas.map)

> [!div class="nextstepaction"]
> [Drawing manager](/javascript/api/azure-maps-drawing-tools/atlas.drawing.drawingmanager)

> [!div class="nextstepaction"]
> [Drawing toolbar](/javascript/api/azure-maps-drawing-tools/atlas.control.drawingtoolbar)

[Get drawn shapes from drawing manager]: https://samples.azuremaps.com/drawing-tools-module/get-drawn-shapes-from-drawing-manager
[Get drawn shapes from drawing manager sample code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Drawing%20Tools%20Module/Get%20drawn%20shapes%20from%20drawing%20manager/Get%20drawn%20shapes%20from%20drawing%20manager.html