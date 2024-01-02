---
title: Add snap grid to the map | Microsoft Azure Maps
description: How to add a snap grid to a map using Azure Maps Web SDK
author: sinnypan
ms.author: sipa
ms.date: 06/08/2023
ms.topic: how-to
ms.service: azure-maps
---

# Add a snap grid to the map

A snap grid makes it easier to draw shapes with shared edges and nodes, and straighter lines. Snapping shapes to a grid is useful when drawing building outlines or network paths on the map.

The resolution of the snapping grid is in pixels. The grid is square and relative to the nearest integer zoom level. The grid scales by a factor of two relative to physical real-world area with each zoom level.

## Use a snap grid

Create a snap grid using the `atlas.drawing.SnapGridManager` class and pass in a reference to the map you want to connect the manager to. Set the `showGrid` option to `true` if you want to make the grid visible. To snap a shape to the grid, pass it into the snap grid managers `snapShape` function. If you want to snap an array of positions, pass it into the `snapPositions` function.

The [Use a snapping grid] sample snaps an HTML marker to a grid when it's dragged. Drawing tools are used to snap drawn shapes to the grid when the `drawingcomplete` event fires. For the source code for this sample, see [Use a snapping grid source code].

:::image type="content" source="./media/map-add-snap-grid/use-snapping-grid.png"alt-text="A screenshot that shows the snap grid on map.":::

<!--------------------------------------------------
> [!VIDEO https://codepen.io/azuremaps/embed/rNmzvXO?default-tab=js%2Cresult]
--------------------------------------------------->

## Snap grid options

The [Snap grid options] sample shows the different customization options available for the snap grid manager. The grid line styles can be customized by retrieving the underlying line layer using the snap grid managers `getGridLayer` function. For the source code for this sample, see [Snap grid options source code].

:::image type="content" source="./media/map-add-snap-grid/snap-grid-options.png"alt-text="A screenshot of map with snap grid enabled and an options panel on the left where you can set various options and see the results in the map.":::

<!--------------------------------------------------
> [!VIDEO https://codepen.io/azuremaps/embed/RwVZJry?default-tab=result]
--------------------------------------------------->

## Next steps

Learn how to use other features of the drawing tools module:

> [!div class="nextstepaction"]
> [Get shape data](map-get-shape-data.md)

> [!div class="nextstepaction"]
> [React to drawing events](drawing-tools-events.md)

> [!div class="nextstepaction"]
> [Interaction types and keyboard shortcuts](drawing-tools-interactions-keyboard-shortcuts.md)

[Use a snapping grid]: https://samples.azuremaps.com/drawing-tools-module/use-a-snapping-grid
[Snap grid options]: https://samples.azuremaps.com/drawing-tools-module/snap-grid-options
[Use a snapping grid source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Drawing%20Tools%20Module/Use%20a%20snapping%20grid/Use%20a%20snapping%20grid.html
[Snap grid options source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Drawing%20Tools%20Module/Snap%20grid%20options/Snap%20grid%20options.html
