---
title: Add snap grid to the map | Microsoft Azure Maps
description: How to add a snap grid to a map using Azure Maps Web SDK
author: rbrundritt
ms.author: richbrun
ms.date: 07/20/2021
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: cpendle
---

# Add a snap grid to the map

A snap grid makes it easier to draw shapes with shared edges and nodes, and straighter lines. Snapping shapes to a grid is useful when drawing building outlines or network paths on the map.

The resolution of the snapping grid is in pixels. The grid is square and relative to the nearest integer zoom level. The grid scales by a factor of two relative to physical real-world area with each zoom level.

## Use a snap grid

Create a snap grid using the `atlas.drawing.SnapGridManager` class and pass in a reference to the map you want to connect the manager to. Set the `showGrid` option to `true` if you want to make the grid visible. To snap a shape to the grid, pass it into the snap grid managers `snapShape` function. If you want to snap an array of positions, pass it into the `snapPositions` function.

The following example snaps an HTML marker to a grid when it is dragged. Drawing tools are used to snap drawn shapes to the grid when the `drawingcomplete` event fires.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Use a snapping grid" src="https://codepen.io/azuremaps/embed/rNmzvXO?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azuremaps/pen/rNmzvXO">
  Use a snapping grid</a> by Azure Maps (<a href="https://codepen.io/azuremaps">@azuremaps</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


## Snap grid options

The following example shows the different customization options available for the snap grid manager. The grid line styles can be customized by retrieving the underlying line layer using the snap grid managers `getGridLayer` function.

<br/>

<iframe height="700" style="width: 100%;" scrolling="no" title="Snap grid options" src="https://codepen.io/azuremaps/embed/RwVZJry?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azuremaps/pen/RwVZJry">
  Snap grid options</a> by Azure Maps (<a href="https://codepen.io/azuremaps">@azuremaps</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


## Next steps

Learn how to use other features of the drawing tools module:

> [!div class="nextstepaction"]
> [Get shape data](map-get-shape-data.md)

> [!div class="nextstepaction"]
> [React to drawing events](drawing-tools-events.md)

> [!div class="nextstepaction"]
> [Interaction types and keyboard shortcuts](drawing-tools-interactions-keyboard-shortcuts.md)