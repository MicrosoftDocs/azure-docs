---
title: Drawing tools interaction types and keyboard shortcuts on map | Microsoft Azure Maps
description: How to draw and edit shapes using a mouse, touch screen, or keyboard in the Microsoft Azure Maps Web SDK
author: rbrundritt
ms.author: richbrun
ms.date: 12/05/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: cpendle
---

# Interaction types and keyboard shortcuts in the drawing tools module

This article outlines all the different ways to draw and edit shapes on a map using a mouse, a touch screen, or keyboard shortcuts.

The drawing manager supports three different ways of interacting with the map to draw shapes.

* `click` - Coordinates are added when the mouse or touch is clicked.
* `freehand ` - Coordinates are added when the mouse or touch is dragged on the map. 
* `hybrid` - Coordinates are added when the mouse or touch is clicked or dragged.

## How to draw shapes

The following outlines all the different ways that shapes can be drawn on the map. Before any shape can be drawn, the `drawingMode` option of the drawing manager needs to be set to a supported drawing setting. This can be done programmatically, or by pressing a one of the drawing buttons on the toolbar. The drawing mode stays enabled, even after a shape has been drawn, making it easy to draw additional shapes of the same type. The drawing mode can be put into an idle state programmatically, or by clicking the current drawing modes button on the toolbar. 

### How to draw a point

When the drawing manager is in `draw-point` drawing mode, the following actions can be done to draw points on the map. These methods work with all interaction modes.

**Start drawing**
 - Click the left mouse button or touch the map to add a point to the map. 
 - If the mouse is over the map, press the `F` key, and a point will be added using the coordinate of where the mouse pointer is. This will provide a higher accuracy method of adding a point to the map as there will be less movement on the mouse due to the pressing motion of the left mouse button.
 - Keep clicking, touching, or pressing `F` to add more points to the map.
 
**Finish drawing**
 - Click on any button in the drawing toolbar. 
 - Programmatically set the drawing mode. 
 - Press the `C` key.

**Cancel drawing**
 - Press the `Escape` key.

### How to draw a line

When the drawing manager is in `draw-line` mode, the following actions can be done to draw points on the map depending on what the interaction mode is set to.

**Start drawing**
 - Click mode
   * Click the left mouse button or touch the map to add each point of a line on the map. A coordinate is added to the line for each click/touch. 
   * If the mouse is over the map, press the `F` key, and a point will be added using the coordinate of where the mouse pointer is. This will provide a higher accuracy method of adding a point to the map as there will be less movement on the mouse due to the pressing motion of the left mouse button.
   * Keep clicking until all the desired points have been added to the line.
 - Freehand mode
   * Press down the left mouse button or touch-down on the map and drag the mouse or touch point around. Coordinates are added to the line as the mouse or touch point moves around the map. As soon as the mouse or touch-up event is triggered, the drawing is completed. The frequency at which coordinates are added is defined by the drawing managers `freehandInterval` option.
 - Hybrid mode
   * Alternate between click and freehand methods as desired while drawing a single line. For example, click a few points, then hold and drag the mouse to add a bunch of points, then click a few more. 

**Finish drawing**
 - Hybrid/Click mode
   * Double-click the map at the last point. 
   * Click on any button in the drawing toolbar. 
   * Programmatically set the drawing mode. 
 - Freehand mode
   * Release the mouse button or touch point.
 - Press the `C` key.

**Cancel drawing**
 - Press the `Escape` key.

### How to draw a polygon

When the drawing manager is in `draw-polygon` mode, the following actions can be done to draw points on the map depending on what the interaction mode is set to.

**Start drawing**
 - Click mode
   * Click the left mouse button or touch the map to add each point of a polygon on the map. A coordinate is added to the polygon for each click/touch. 
   * If the mouse is over the map, press the `F` key, and a point will be added using the coordinate of where the mouse pointer is. This will provide a higher accuracy method of adding a point to the map as there will be less movement on the mouse due to the pressing motion of the left mouse button.
   * Keep clicking until all the desired points have been added to the polygon.
 - Freehand mode
   * Press down the left mouse button or touch-down on the map and drag the mouse or touch point around. Coordinates are added to the polygon as the mouse or touch point moves around the map. As soon as the mouse or touch-up event is triggered, the drawing is completed. Note that the frequency at which coordinates are added is defined by the drawing managers `freehandInterval` option.
 - Hybrid mode
   * Alternate between click and freehand methods as desired while drawing a single polygon. For example, click a few points, then hold and drag the mouse to add a bunch of points, then click a few more. 

**Finish drawing**
 - Hybrid/Click mode
   * Double-click the map at the last point. 
   * Click on the first point in the polygon.
   * Click on any button in the drawing toolbar. 
   * Programmatically set the drawing mode. 
 - Freehand mode
   * Release the mouse button or touch point.
 - Press the `C` key.

**Cancel drawing**
 - Press the `Escape` key.

### How to draw a rectangle

When the drawing manager is in `draw-rectangle` mode, the following actions can be done to draw points on the map depending on what the interaction mode is set to. The generated shape will follow the [extended GeoJSON specification for rectangles](extend-geojson.md#rectangle).

**Start drawing**
 - Press down the left mouse button or touch-down on the map to add the first corner of the rectangle and drag to create the rectangle. 

**Finish drawing**
 - Release the mouse button or touch point.
 - Programmatically set the drawing mode. 
 - Press the `C` key.

**Cancel drawing**
 - Press the `Escape` key.

### How to draw a circle

When the drawing manager is in `draw-circle` mode, the following actions can be done to draw points on the map depending on what the interaction mode is set to. The generated shape will follow the [extended GeoJSON specification for circles](extend-geojson.md#circle).

**Start drawing**
 - Press down the left mouse button or touch-down on the map to add the center of the circle and drag give the circles a radius. 

**Finish drawing**
 - Release the mouse button or touch point.
 - Programmatically set the drawing mode. 
 - Press the `C` key.

**Cancel drawing**
 - Press the `Escape` key.

## Keyboard shortcuts

The drawing tools support keyboard shortcuts that make it easier to draw and edit shapes on the map. These keyboard shortcuts are functional when the map has focus.

| Key      | Action                            |
|----------|-----------------------------------|
| `C` | Completes any drawing that is in progress and sets the drawing mode to idle. Focus will move to top-level map element.  |
| `Escape` | Cancels any drawing that is in progress and sets the drawing mode to idle. Focus will move to top-level map element.  |
| `F` | Adds a coordinate to a point, line, or polygon if the mouse is over the map. Equivalent action of clicking the map when in click or hybrid mode. This shortcut allows for more precise and faster drawings as you can use one hand to position the mouse and other to press the button without the mouse moving from the press gesture. |

## Next steps

Learn more about the classes in the drawing tools module:

> [!div class="nextstepaction"]
> [Drawing manager](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.drawing.drawingmanager?view=azure-node-latest)

> [!div class="nextstepaction"]
> [Drawing toolbar](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.control.drawingtoolbar?view=azure-node-latest)