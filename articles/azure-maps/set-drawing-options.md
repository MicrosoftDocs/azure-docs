---
title: Drawing tools module | Microsoft Azure Maps
description: In this article, you'll learn how to set drawing options data using the Microsoft Azure Maps Web SDK
author: philmea
ms.author: philmea
ms.date: 01/29/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Use the drawing tools module

The Azure Maps Web SDK provides a *drawing tools module*. This module makes it easy to draw and edit shapes on the map using an input device such as a mouse or touch screen. The core class of this module is the [drawing manager](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.drawing.drawingmanager?view=azure-node-latest#setoptions-drawingmanageroptions-). The drawing manager provides all the capabilities needed to draw and edit shapes on the map. It can be used directly, and it's integrated with a custom toolbar UI. You can also use the built-in [drawing toolbar](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.control.drawingtoolbar?view=azure-node-latest) class. 

## Loading the drawing tools module in a webpage

1. Create a new HTML file and [implement the map as usual](https://docs.microsoft.com/azure/azure-maps/how-to-use-map-control).
2. Load the Azure Maps drawing tools module. You can load it in one of two ways:
    - Use the globally hosted, Azure Content Delivery Network version of the Azure Maps services module. Add reference to the JavaScript and CSS stylesheet in the `<head>` element of the file:

        ```html
        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/drawing/0/atlas-drawing.min.css" type="text/css" />
        <script src="https://atlas.microsoft.com/sdk/javascript/drawing/0/atlas-drawing.min.js"></script>
        ```

    - Or, you can load the drawing tools module for the Azure Maps Web SDK source code locally by using the [azure-maps-drawing-tools](https://www.npmjs.com/package/azure-maps-drawing-tools) npm package, and then host it with your app. This package also includes TypeScript definitions. Use this command:
    
        > **npm install azure-maps-drawing-tools**
    
        Then, add a reference to the JavaScript and CSS stylesheet in the `<head>` element of the file:

         ```html
        <link rel="stylesheet" href="node_modules/azure-maps-drawing-tools/dist/atlas-drawing.min.css" type="text/css" />
        <script src="node_modules/azure-maps-drawing-tools/dist/atlas-drawing.min.js"></script>
         ```

## Use the drawing manager directly

Once the drawing tools module is loaded in your application, you can enable drawing and editing capabilities using the [drawing manager](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.drawing.drawingmanager?view=azure-node-latest#setoptions-drawingmanageroptions-). You can specify options for the drawing manager while instantiating it or alternatively use the `drawingManager.setOptions()` function.

### Set the drawing mode

The following code creates an instance of the drawing manager and sets the drawing **mode** option. 

```Javascript
//Create an instance of the drawing manager and set drawing mode.
drawingManager = new atlas.drawing.DrawingManager(map,{
    mode: "draw-polygon"
});
```

The code below is a complete running example of how to set a drawing mode of the drawing manager. Click the map to start drawing a polygon.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Draw a polygon" src="//codepen.io/azuremaps/embed/YzKVKRa/?height=265&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/YzKVKRa/'>Draw a polygon</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### Set the interaction type

The drawing manager supports three different ways of interacting with the map to draw shapes.

* `click` - Coordinates are added when the mouse or touch is clicked.
* `freehand ` - Coordinates are added when the mouse or touch is dragged on the map. 
* `hybrid` - Coordinates are added when the mouse or touch is clicked or dragged.

The following code enables the polygon drawing mode and sets the type of drawing interaction that the drawing manager should adhere to `freehand`. 

```Javascript
//Create an instance of the drawing manager and set drawing mode.
drawingManager = new atlas.drawing.DrawingManager(map,{
    mode: "draw-polygon",
    interactionType: "freehand"
});
```

 This code sample implements the functionality of drawing a polygon on the map. Just hold down the left mouse button and dragging it around, freely.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Free-hand drawing" src="//codepen.io/azuremaps/embed/ZEzKoaj/?height=265&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/ZEzKoaj/'>Free-hand drawing</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### Customizing drawing options

The previous examples demonstrated how to customize drawing options while instantiating the Drawing Manager. You can also set the Drawing Manager options by using the `drawingManager.setOptions()` function. Below is a tool to test out customization of all options for the drawing manager using the setOptions function.

<br/>

<iframe height="685" title="Customize drawing manager" src="//codepen.io/azuremaps/embed/LYPyrxR/?height=600&theme-id=0&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/LYPyrxR/'>Get shape data</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Next steps

Learn how to use additional features of the drawing tools module:

> [!div class="nextstepaction"]
> [Add a drawing toolbar](map-add-drawing-toolbar.md)

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
> [Drawing manager](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.drawing.drawingmanager?view=azure-node-latest)

> [!div class="nextstepaction"]
> [Drawing toolbar](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.control.drawingtoolbar?view=azure-node-latest)
