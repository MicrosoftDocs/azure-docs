---
title: Add a drawing toolbar to a map | Microsoft Azure Maps
description: In this article you'll learn, how to add a drawing toolbar to a map using Microsoft Azure Maps Web SDK
author: rbrundritt
ms.author: richbrun
ms.date: 12/05/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: cpendle
---

# Drawing tool events

When using drawing tools on a map, it's useful to react to certain events as the user draws on the map. This table lists all of the events supported by the `DrawingManager` class.

| Event | Description |
|-------|-------------|
| `drawingchanged` | Fired when any coordinate in a shape has been added or changed. | 
| `drawingchanging` | Fired when any preview coordinate for a shape is being displayed. For example, this event will fire multiple times as a coordinate is dragged. | 
| `drawingcomplete` | Fired when a shape has finished being drawn or taken out of edit mode. |
| `drawingmodechanged` | Fired when the drawing mode has changed. The new drawing mode is passed into the event handler. |
| `drawingstarted` | Fired when the user starts drawing a shape or puts a shape into edit mode.  |

The following code shows how the events in the Drawing Tools module work. Draw shapes on the map and watch as the events fire.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Drawing tools events" src="https://codepen.io/azuremaps/embed/dyPMRWo?height=500&theme-id=default&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/dyPMRWo'>Drawing tools events</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

<br/>

## Examples

Let's see some common scenarios that use the drawing tools events.

### Select points in polygon area

This code demonstrates how to monitor an event of a user drawing shapes. For this example, the code monitors shapes of polygons, rectangles, and circles. Then, it determines which data points on the map are within the drawn area. The `drawingcomplete` event is used to trigger the select logic. In the select logic, the code loops through all the data points on the map. It checks if there's an intersection of the point and the area of the drawn shape. This example makes use of the open-source [Turf.js](https://turfjs.org/) library to perform a spatial intersection calculation.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Select data in drawn polygon area" src="https://codepen.io/azuremaps/embed/XWJdeja?height=500&theme-id=default&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/XWJdeja'>Select data in drawn polygon area</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

<br/>

### Draw and search in polygon area

This code searches for points of interests inside the area of a shape after the user finished drawing the shape. You can modify and execute the code by clicking 'Edit on Code pen' on the top-right corner of the frame. The `drawingcomplete` event is used to trigger the search logic. If the user draws a rectangle or polygon, a search inside geometry is performed. If a circle is drawn, the radius and center position is used to perform a point of interest search. The `drawingmodechanged` event is used to determine when the user switches to the drawing mode, and this event clears the drawing canvas.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Draw and search in polygon area" src="https://codepen.io/azuremaps/embed/eYmZGNv?height=500&theme-id=default&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/eYmZGNv'>Draw and search in polygon area</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

<br/>

### Create a measuring tool

The code below shows how the drawing events can be used to create a measuring tool. The `drawingchanging` is used to monitor the shape, as it's being drawn. As the user moves the mouse, the dimensions of the shape are calculated. The `drawingcomplete` event is used to do a final calculation on the shape after it has been drawn. The `drawingmodechanged` event is used to determine when the user is switching into a drawing mode. Also, the  `drawingmodechanged` event clears the drawing canvas and clears old measurement information.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Measuring tool" src="https://codepen.io/azuremaps/embed/RwNaZXe?height=500&theme-id=default&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/RwNaZXe'>Measuring tool</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

<br/>

## Next steps

Learn how to use additional features of the drawing tools module:

> [!div class="nextstepaction"]
> [Get shape data](map-get-shape-data.md)

> [!div class="nextstepaction"]
> [Interaction types and keyboard shortcuts](drawing-tools-interactions-keyboard-shortcuts.md)

Learn more about the Services module:

> [!div class="nextstepaction"]
> [Services module](how-to-use-services-module.md)

Check out more code samples:

> [!div class="nextstepaction"]
> [Code sample page](https://aka.ms/AzureMapsSamples)
