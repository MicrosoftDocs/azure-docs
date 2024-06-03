---
title: Add drawing tools toolbar to map | Microsoft Azure Maps
description: How to add a drawing toolbar to a map using Azure Maps Web SDK
author: sinnypan
ms.author: sipa
ms.date: 06/05/2023
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
---

# Add a drawing tools toolbar to a map

This article shows you how to use the Drawing Tools module and display the drawing toolbar on the map. The [Drawing toolbar] control adds the drawing toolbar on the map. You learn how to create maps with only one and all drawing tools and how to customize the rendering of the drawing shapes in the drawing manager.

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

For a complete working sample that demonstrates how to add a drawing toolbar to your map, see [Add drawing toolbar to map] in the [Azure Maps Samples]. For the source code for this sample, see [Add drawing toolbar to map source code].

:::image type="content" source="./media/map-add-drawing-toolbar/add-drawing-toolbar.png" alt-text="Screenshot showing the drawing toolbar on a map.":::

<!------------------------------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/ZEzLeRg/?height=265&theme-id=0&default-tab=js,result&editable=true]
------------------------------------------------------------------------>

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

The following screenshot shows a sample of an instance of the drawing manager that displays the toolbar with just a single drawing tool on the map:

:::image type="content" source="./media/map-add-drawing-toolbar/limit-displayed-toolbar-options.png" alt-text="Screenshot that demonstrates an instance of the drawing manager that displays the toolbar with just a polygon drawing tool on the map.":::

<!------------------------------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/OJLWWMy/?height=265&theme-id=0&default-tab=js,result&editable=true]
------------------------------------------------------------------------>

## Change drawing rendering style

The style of the shapes that are drawn can be customized by retrieving the underlying layers of the drawing manager by using the `drawingManager.getLayers()` and `drawingManager.getPreviewLayers()` functions and then setting options on the individual layers. The drag handles that appear for coordinates when editing a shape are HTML markers. The style of the drag handles can be customized by passing HTML marker options into the `dragHandleStyle` and `secondaryDragHandleStyle` options of the drawing manager.  

The following code gets the rendering layers from the drawing manager and modifies their options to change rendering style for drawing. In this case, points are rendered with a blue marker icon. Lines are red and four pixels wide. Polygons have a green fill color and an orange outline. It then changes the styles of the drag handles to be square icons.

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


//Get preview rendering layers from the drawing manager and modify line styles to be dashed.
var previewLayers = drawingManager.getPreviewLayers();
previewLayers.lineLayer.setOptions({ strokeColor: 'red', strokeWidth: 4, strokeDashArray: [3,3] });
previewLayers.polygonOutlineLayer.setOptions({ strokeColor: 'orange', strokeDashArray: [3, 3] });

//Update the style of the drag handles that appear when editing.
drawingManager.setOptions({
    //Primary drag handle that represents coordinates in the shape.
    dragHandleStyle: {
        anchor: 'center',
        htmlContent: '<svg width="15" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer"><rect x="0" y="0" width="15" height="15" style="stroke:black;fill:white;stroke-width:4px;"/></svg>',
        draggable: true
    },

    //Secondary drag handle that represents mid-point coordinates that users can grab to add new coordinates in the middle of segments.
    secondaryDragHandleStyle: {
        anchor: 'center',
        htmlContent: '<svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer"><rect x="0" y="0" width="10" height="10" style="stroke:white;fill:black;stroke-width:4px;"/></svg>',
        draggable: true
    }
});  
```

For a complete working sample that demonstrates how to customize the rendering of the drawing shapes in the drawing manager by accessing the rendering layers, see [Change drawing rendering style] in the [Azure Maps Samples]. For the source code for this sample, see [Change drawing rendering style source code].

:::image type="content" source="./media/map-add-drawing-toolbar/change-drawing-rendering-style.png" alt-text="Screenshot showing different drawing shaped rendered on a map.":::

<!------------------------------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/OJLWpyj/?height=265&theme-id=0&default-tab=js,result&editable=true]
------------------------------------------------------------------------>

> [!NOTE]
> When in edit mode, shapes can be rotated. Rotation is supported from MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon, and Rectangle geometries. Point and Circle geometries can not be rotated.

## Next steps

Learn how to use more features of the drawing tools module:

> [!div class="nextstepaction"]
> [Get shape data]

> [!div class="nextstepaction"]
> [React to drawing events]

> [!div class="nextstepaction"]
> [Interaction types and keyboard shortcuts]

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map]

> [!div class="nextstepaction"]
> [Drawing toolbar]

> [!div class="nextstepaction"]
> [Drawing manager]

[Azure Maps Samples]: https://samples.azuremaps.com
[Add drawing toolbar to map]: https://samples.azuremaps.com/drawing-tools-module/add-drawing-toolbar-to-map
[Change drawing rendering style]: https://samples.azuremaps.com/drawing-tools-module/change-drawing-rendering-style

[Add drawing toolbar to map source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Drawing%20Tools%20Module/Add%20drawing%20toolbar%20to%20map/Add%20drawing%20toolbar%20to%20map.html
[Change drawing rendering style source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Drawing%20Tools%20Module/Change%20drawing%20rendering%20style/Change%20drawing%20rendering%20style.html
[Drawing toolbar]: /javascript/api/azure-maps-drawing-tools/atlas.control.drawingtoolbar
[Get shape data]: map-get-shape-data.md
[React to drawing events]: drawing-tools-events.md
[Interaction types and keyboard shortcuts]: drawing-tools-interactions-keyboard-shortcuts.md
[Map]: /javascript/api/azure-maps-control/atlas.map
[Drawing manager]: /javascript/api/azure-maps-drawing-tools/atlas.drawing.drawingmanager
