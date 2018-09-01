---
title: Map style functionalities in Azure Maps| Microsoft Docs
description: Learn about Azure Maps style related functionalities.
author: walsehgal
ms.author: v-musehg
ms.date: 08/31/2018
ms.topic: how-to-guides
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: mvc
---

# Choose a map style in Azure Maps
Azure Maps has four different maps styles to choose from. For more about map styles, see [supported map styles in Azure Maps](./supported-map-styles.md). This article shows how to use the style-related functionalities to set a style on map load, set a new style and use the style picker control.

## Setting style on map load

<iframe height='500' scrolling='no' title='Setting the style on map load' src='//codepen.io/azuremaps/embed/WKOQRq/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WKOQRq/'>Setting the style on map load</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The code above creates a map object with the style set to Grayscale. See [create a map](./map-create.md) for instructions on how to create a map.

## Updating the style

<iframe height='500' scrolling='no' title='Updating the style' src='//codepen.io/azuremaps/embed/yqXYzY/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/yqXYzY/'>Updating the style</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first block of code in the above code creates a map object without pre-setting the style. See [create a map](./map-create.md) for instructions on how to create a map.

The second code clock uses the map's [setStyle](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#setstyle) method to set the map style to satellite.

## Adding the style picker

<iframe height='500' scrolling='no' title='Adding the style picker' src='//codepen.io/azuremaps/embed/OwgyvG/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/OwgyvG/'>Adding the style picker</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first code block in the above code creates a map object without pre-setting the style. See [create a map](./map-create.md) for instructions on how to create a map.

The second code block constructs a style selector using the atlas [StyleControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.control.stylecontrol?view=azure-iot-typescript-latest#stylecontrol) constructor.

A style picker enables style selection for the map. The third code block adds the style picker to the map using the map's [addControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addcontrol) method.

## Next steps

Learn more about the classes and methods used in this article: 
* [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)
    * [setStyle](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#setstyle)
    * [addControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addcontrol)

* [Atlas](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas?view=azure-iot-typescript-latest)
    * [StyleControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.control.stylecontrol?view=azure-iot-typescript-latest#stylecontrol)
    
For more code examples to add to your maps, see the following articles:
* [Add map controls](./map-add-controls.md)
* [Add a pin](./map-add-pin.md)
