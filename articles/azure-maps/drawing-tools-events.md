---
title: Drawing tools events | Microsoft Azure Maps
description: This article demonstrates how to add a drawing toolbar to a map using Microsoft Azure Maps Web SDK
author: sinnypan
ms.author: sipa
ms.date: 09/03/2024
ms.topic: how-to
ms.service: azure-maps
ms.subservice: web-sdk
---

# Drawing tools events

When using drawing tools on a map, it's useful to react to certain events as the user draws on the map. This table lists all events supported by the `DrawingManager` class.

| Event | Description |
|-------|-------------|
| `drawingchanged` | Fired when any coordinate in a shape is added or changed. |
| `drawingchanging` | Fired when any preview coordinate for a shape is being displayed. For example, this event fires multiple times as a coordinate is dragged. |
| `drawingcomplete` | Fired when a shape completes drawing or is taken out of edit mode. |
| `drawingerased` | Fired when a shape is erased from the drawing manager when in `erase-geometry` mode. |
| `drawingmodechanged` | Fired when the drawing mode changes. The new drawing mode is passed into the event handler. |
| `drawingstarted` | Fired when the user starts drawing a shape or puts a shape into edit mode.  |

For a complete working sample of how to display data from a vector tile source on the map, see [Drawing tools events] in the [Azure Maps Samples]. This sample enables you to draw shapes on the map and watch as the events fire. For the source code for this sample, see [Drawing tools events sample code].

The following image shows a screenshot of the complete working sample that demonstrates how the events in the Drawing Tools module work.

:::image type="content" source="./media/drawing-tools-events/drawing-tools-events.png" lightbox="./media/drawing-tools-events/drawing-tools-events.png" alt-text="Screenshot showing a map displaying data from a vector tile source.":::

## Examples

Let's see some common scenarios that use the drawing tools events.

### Select points in polygon area

This code demonstrates how to monitor an event of a user drawing shapes. For this example, the code monitors shapes of polygons, rectangles, and circles. Then, it determines which data points on the map are within the drawn area. The `drawingcomplete` event is used to trigger the select logic. In the select logic, the code loops through all the data points on the map. It checks if there's an intersection of the point and the area of the drawn shape. This example makes use of the open-source [Turf.js] library to perform a spatial intersection calculation.

For a complete working sample of how to use the drawing tools to draw polygon areas on the map with points within them that can be selected, see [Select data in drawn polygon area] in the [Azure Maps Samples]. For the source code for this sample, see [Select data in drawn polygon area sample code].

:::image type="content" source="./media/drawing-tools-events/select-data-in-drawn-polygon-area.png" lightbox="./media/drawing-tools-events/select-data-in-drawn-polygon-area.png" alt-text="Screenshot showing a map displaying points within polygon areas.":::

### Draw and search in polygon area

This code searches for points of interests inside the area of a shape after the user finished drawing the shape. The `drawingcomplete` event is used to trigger the search logic. If the user draws a rectangle or polygon, a search inside geometry is performed. If a circle is drawn, the radius and center position is used to perform a point of interest search. The `drawingmodechanged` event is used to determine when the user switches to the drawing mode, and this event clears the drawing canvas.

For a complete working sample of how to use the drawing tools to search for points of interests within drawn areas, see [Draw and search polygon area] in the [Azure Maps Samples]. For the source code for this sample, see [Draw and search polygon area sample code].

:::image type="content" source="./media/drawing-tools-events/draw-and-search-polygon-area.png" lightbox="./media/drawing-tools-events/draw-and-search-polygon-area.png" alt-text="Screenshot showing a map displaying the Draw and search in polygon area sample.":::

### Create a measuring tool

The following code shows how the drawing events can be used to create a measuring tool. The `drawingchanging` is used to monitor the shape, as it's being drawn. As the user moves the mouse, the dimensions of the shape are calculated. The `drawingcomplete` event is used to do a final calculation on the shape after drawing completes. The `drawingmodechanged` event is used to determine when the user is switching into a drawing mode. Also, the  `drawingmodechanged` event clears the drawing canvas and clears old measurement information.

For a complete working sample of how to use the drawing tools to measure distances and areas, see [Create a measuring tool] in the [Azure Maps Samples]. For the source code for this sample, see [Create a measuring tool sample code].

:::image type="content" source="./media/drawing-tools-events/create-a-measuring-tool.png" lightbox="./media/drawing-tools-events/create-a-measuring-tool.png" alt-text="Screenshot showing a map displaying the measuring tool sample.":::

## Next steps

Learn how to use other features of the drawing tools module:

> [!div class="nextstepaction"]
> [Get shape data]

> [!div class="nextstepaction"]
> [Interaction types and keyboard shortcuts]

Learn more about the services module:

> [!div class="nextstepaction"]
> [Services module]

Check out more code samples:

> [!div class="nextstepaction"]
> [Code sample page]

[Azure Maps Samples]:https://samples.azuremaps.com
[Code sample page]: https://samples.azuremaps.com/
[Create a measuring tool sample code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Drawing%20Tools%20Module/Create%20a%20measuring%20tool/Create%20a%20measuring%20tool.html
[Create a measuring tool]: https://samples.azuremaps.com/drawing-tools-module/create-a-measuring-tool
[Draw and search polygon area]: https://samples.azuremaps.com/drawing-tools-module/draw-and-search-polygon-area
[Drawing tools events sample code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Drawing%20Tools%20Module/Drawing%20tools%20events/Drawing%20tools%20events.html
[Drawing tools events]: https://samples.azuremaps.com/drawing-tools-module/drawing-tools-events
[Get shape data]: map-get-shape-data.md
[Interaction types and keyboard shortcuts]: drawing-tools-interactions-keyboard-shortcuts.md
[Select data in drawn polygon area sample code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Drawing%20Tools%20Module/Select%20data%20in%20drawn%20polygon%20area/Select%20data%20in%20drawn%20polygon%20area.html
[Select data in drawn polygon area]: https://samples.azuremaps.com/drawing-tools-module/select-data-in-drawn-polygon-area
[Services module]: how-to-use-services-module.md
[Turf.js]: https://turfjs.org
