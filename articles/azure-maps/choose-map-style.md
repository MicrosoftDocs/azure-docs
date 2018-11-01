---
title: Map style functionalities in Azure Maps| Microsoft Docs
description: Learn about Azure Maps style related functionalities.
author: walsehgal
ms.author: v-musehg
ms.date: 10/08/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Choose a map style in Azure Maps

Azure Maps has four different maps styles to choose from. For more about map styles, see [supported map styles in Azure Maps](./supported-map-styles.md). This article shows how to use the style-related functionalities to set a style on map load, set a new style and use the style picker control.

## Set style on map load

<iframe height='500' scrolling='no' title='Setting the style on map load' src='//codepen.io/azuremaps/embed/WKOQRq/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WKOQRq/'>Setting the style on map load</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The code block above sets the subscription key and creates a Map object, with the style set to grayscale_dark. See [create a map](./map-create.md) for instructions on how to create a map.

## Update the style

<iframe height='500' scrolling='no' title='Updating the style' src='//codepen.io/azuremaps/embed/yqXYzY/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/yqXYzY/'>Updating the style</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The code block above sets the subscription key and creates a Map object without pre-setting the style. See [create a map](./map-create.md) for instructions on how to create a map.

The second code block uses the map's [setStyle](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#setstyle) method to set the map style to satellite.

## Add the style picker

<iframe height='500' scrolling='no' title='Adding the style picker' src='//codepen.io/azuremaps/embed/OwgyvG/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/OwgyvG/'>Adding the style picker</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first code block in the above code sets the subscription key and creates a Map object, the map style is pre-set to grayscale_dark. See [create a map](./map-create.md) for instructions on how to create a map.

The second code block constructs a style selector using the atlas [StyleControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.control.stylecontrol?view=azure-iot-typescript-latest#stylecontrol) constructor.

A style picker enables style selection for the map. The third code block adds the style picker to the map using the map's [controls.add](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addcontrol) method. The style selector is within the map **event listener** to ensure that it loads after the map loads fully.

## Next steps

To learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

Add control to your maps:

> [!div class="nextstepaction"]
> [Add map controls](./map-add-controls.md)

Add a map pin:

> [!div class="nextstepaction"]
> [Add a pin](./map-add-pin.md)
