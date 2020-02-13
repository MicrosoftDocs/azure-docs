---
title: Map style functionalities | Microsoft Azure Maps
description: In this article, you'll learn about style related functionalities available in Microsoft Azure Maps web SDK.
author: walsehgal
ms.author: v-musehg
ms.date: 07/29/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Choose a map style in Azure Maps

Many of the [supported map styles in Azure Maps](./supported-map-styles.md) are available in the Web SDK. This article shows how to use the style-related functionalities. Learn to set a style upon loading a map, and learn to set a new map style using the style picker control.

## Set style on map load

In the following code, the `style` option of the map is set to `grayscale_dark` on initialization.

<br/>

<iframe height='500' scrolling='no' title='Setting the style on map load' src='//codepen.io/azuremaps/embed/WKOQRq/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WKOQRq/'>Setting the style on map load</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Update the style

In the following code, after a map instance is loaded, the map style is updated from `road` to `satellite` using the [setStyle](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) function.

<br/>

<iframe height='500' scrolling='no' title='Updating the style' src='//codepen.io/azuremaps/embed/yqXYzY/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/yqXYzY/'>Updating the style</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Add the style picker

The following code adds a [StyleControl](/javascript/api/azure-maps-control/atlas.control.stylecontrol) to the map, so the user can easily switch between the different map styles. Toggle the map style using the map style control near the top right corner.

<br/>

<iframe height='500' scrolling='no' title='Adding the style picker' src='//codepen.io/azuremaps/embed/OwgyvG/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/OwgyvG/'>Adding the style picker</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

> [!TIP]
> By default, when using the S0 pricing tier of Azure Maps, the style picker control lists all the available styles. If you want to reduce the number of styles in this list, pass an array of the styles you want to appear in the list into the `mapStyle` option of the style picker. If you are using S1 and want to show all the available styles, set the `mapStyles` option of the style picker to `"all"`.

## Next steps

To learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

Add controls to your maps:

> [!div class="nextstepaction"]
> [Add map controls](map-add-controls.md)

> [!div class="nextstepaction"]
> [Add a pin](map-add-pin.md)
