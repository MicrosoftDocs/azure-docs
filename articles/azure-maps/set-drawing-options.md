---
title: Drawing tools module | Microsoft Azure Maps
description: In this article, you'll learn how to set drawing options data using the Microsoft Azure Maps Web SDK
author: stevemunk
ms.author: v-munksteve
ms.date: 01/29/2020
ms.topic: conceptual
ms.service: azure-maps
ms.custom: devx-track-js
---

# Use the drawing tools module

The Azure Maps Web SDK provides a *drawing tools module*. This module makes it easy to draw and edit shapes on the map using an input device such as a mouse or touch screen. The core class of this module is the [drawing manager](/javascript/api/azure-maps-drawing-tools/atlas.drawing.drawingmanager#setoptions-drawingmanageroptions-). The drawing manager provides all the capabilities needed to draw and edit shapes on the map. It can be used directly, and it's integrated with a custom toolbar UI. You can also use the built-in [drawing toolbar](/javascript/api/azure-maps-drawing-tools/atlas.control.drawingtoolbar) class.

## Loading the drawing tools module in a webpage

1. Create a new HTML file and [implement the map as usual](./how-to-use-map-control.md).
2. Load the Azure Maps drawing tools module. You can load it in one of two ways:
    - Use the globally hosted, Azure Content Delivery Network version of the Azure Maps services module. Add reference to the JavaScript and CSS stylesheet in the `<head>` element of the file:

        ```html
        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/drawing/1/atlas-drawing.min.css" type="text/css" />
        <script src="https://atlas.microsoft.com/sdk/javascript/drawing/1/atlas-drawing.min.js"></script>
        ```

    - Or, you can load the drawing tools module for the Azure Maps Web SDK source code locally by using the [azure-maps-drawing-tools](https://www.npmjs.com/package/azure-maps-drawing-tools) npm package, and then host it with your app. This package also includes TypeScript definitions. Use this command:

      `npm install azure-maps-drawing-tools`

      Then, import the JavaScript and CSS stylesheet in a source file:

      ```js
      import * as drawing from "azure-maps-drawing-tools";
      import "azure-maps-drawing-tools/dist/atlas-drawing.min.css";
      ```

## Use the drawing manager directly

Once the drawing tools module is loaded in your application, you can enable drawing and editing capabilities using the [drawing manager](/javascript/api/azure-maps-drawing-tools/atlas.drawing.drawingmanager#setoptions-drawingmanageroptions-). You can specify options for the drawing manager while instantiating it or alternatively use the `drawingManager.setOptions()` function.

### Set the drawing mode

The following code creates an instance of the drawing manager and sets the drawing **mode** option. 

```javascript
//Create an instance of the drawing manager and set drawing mode.
drawingManager = new atlas.drawing.DrawingManager(map,{
    mode: "draw-polygon"
});
```

The code below is a complete running example of how to set a drawing mode of the drawing manager. Click the map to start drawing a polygon.

<br/>

<iframe height="500" scrolling="no" title="Draw a polygon" src="//codepen.io/azuremaps/embed/YzKVKRa/?height=265&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/YzKVKRa/'>Draw a polygon</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### Set the interaction type

The drawing manager supports three different ways of interacting with the map to draw shapes.

* `click` - Coordinates are added when the mouse or touch is clicked.
* `freehand ` - Coordinates are added when the mouse or touch is dragged on the map. 
* `hybrid` - Coordinates are added when the mouse or touch is clicked or dragged.

The following code enables the polygon drawing mode and sets the type of drawing interaction that the drawing manager should adhere to `freehand`. 

```javascript
//Create an instance of the drawing manager and set drawing mode.
drawingManager = new atlas.drawing.DrawingManager(map,{
    mode: "draw-polygon",
    interactionType: "freehand"
});
```

 This code sample implements the functionality of drawing a polygon on the map. Just hold down the left mouse button and dragging it around, freely.

<br/>

<iframe height="500" scrolling="no" title="Free-hand drawing" src="//codepen.io/azuremaps/embed/ZEzKoaj/?height=265&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/ZEzKoaj/'>Free-hand drawing</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### Customizing drawing options

The previous examples demonstrated how to customize drawing options while instantiating the Drawing Manager. You can also set the Drawing Manager options by using the `drawingManager.setOptions()` function. Below is a tool to test out customization of all options for the drawing manager using the setOptions function.

<br/>

<iframe height="685" title="Customize drawing manager" src="//codepen.io/azuremaps/embed/LYPyrxR/?height=600&theme-id=0&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">See the Pen <a href='https://codepen.io/azuremaps/pen/LYPyrxR/'>Get shape data</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### Put a shape into edit mode

Programmatically put an existing shape into edit mode by passing it into the drawing managers `edit` function. If the shape is a GeoJSON feature, wrap it with the `atls.Shape` class before passing it in.

To programmatically take a shape out of edit mode, set the drawing managers mode to `idle`.

```javascript
//If you are starting with a GeoJSON feature, wrap it with the atlas.Shape class.
var feature = { 
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [0,0]
        },
    "properties":  {}
};

var shape = new atlas.Shape(feature);

//Pass the shape into the edit function of the drawing manager.
drawingManager.edit(shape);

//Later, to programmatically take shape out of edit mode, set mode to idle. 
drawingManager.setOptions({ mode: 'idle' });
```

> [!NOTE]
> When a shape is passed into the `edit` function of the drawing manager, it is added to the data source maintained by the drawing manager. If the shape was previously in another data source, it will be removed from that data source.

To add shapes to the drawing manager so the end user can view and edit, but don't want to programmatically put them into edit mode, retrieve the data source from the drawing manager and add your shapes to it.

```javascript
//The shape(s) you want to add to the drawing manager so 
var shape = new atlas.Shape(feature);

//Retrieve the data source from the drawing manager.
var source = drawingManager.getSource();

//Add your shape.
source.add(shape);

//Alternatively, load in a GeoJSON feed using the sources importDataFromUrl function.
source.importDataFromUrl('yourFeatures.json');
```

The following table lists the type of editing supported by different types of shape features.

| Shape feature | Edit points | Rotate | Delete shape |
|---------------|:-----------:|:------:|:------------:|
| Point         | ✓           |        | ✓           |
| LineString    | ✓           | ✓      | ✓           |
| Polygon       | ✓           | ✓      | ✓           |
| MultiPoint    |             | ✓      | ✓           |
| MultiLineString |           | ✓      | ✓           |
| MultiPolygon  |             | ✓      | ✓           |
| Circle        | ✓           |        | ✓           |
| Rectangle     | ✓           | ✓      | ✓           |

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
> [Map](/javascript/api/azure-maps-control/atlas.map)

> [!div class="nextstepaction"]
> [Drawing manager](/javascript/api/azure-maps-drawing-tools/atlas.drawing.drawingmanager)

> [!div class="nextstepaction"]
> [Drawing toolbar](/javascript/api/azure-maps-drawing-tools/atlas.control.drawingtoolbar)
