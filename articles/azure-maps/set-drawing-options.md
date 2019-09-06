---
title: Set drawing options in Azure Maps| Microsoft Docs
description: How to set drawing options data using Azure Maps Web SDK
author: walsehgal
ms.author: v-musehg
ms.date: 09/04/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Set drawing options

This article shows you how different options of the [drawing manager](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.drawing.drawingmanager?view=azure-node-latest#setoptions-drawingmanageroptions-) change the user experience. You can specify options for the drawing manager while instantiating it or alternatively use the **drawingManager.setOptions()** function to set options.


## Set drawing mode

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


## Set interaction type

The following code sets the type of drawing interaction that the drawing manager should adhere to. 

```Javascript
//Create an instance of the drawing manager and set drawing mode.
drawingManager = new atlas.drawing.DrawingManager(map,{
    mode: "draw-polygon",
    interactionType: "freehand"
});
```

Below is the code sample implementing the functionality that lets you draw on the map freely, while holding down the left mouse button and dragging it around. 

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Free-hand drawing" src="//codepen.io/azuremaps/embed/ZEzKoaj/?height=265&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/ZEzKoaj/'>Free-hand drawing</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Customizing drawing options

The previous examples demonstrated how to customize drawing options while instantiating the Drawing Manager. You can also set the Drawing Manager options by using the **drawingManager.setOptions()** function. Below is a tool to test out customization of all options for the drawing manager using the setOptions function.

<br/>

<iframe height="685" title="Customize drawing manager" src="//codepen.io/azuremaps/embed/LYPyrxR/?height=600&theme-id=0&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/LYPyrxR/'>Get shape data</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [Drawing manager](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.drawing.drawingmanager?view=azure-node-latest)

> [!div class="nextstepaction"]
> [Drawing toolbar](https://docs.microsoft.com/javascript/api/azure-maps-drawing-tools/atlas.control.drawingtoolbar?view=azure-node-latest)
