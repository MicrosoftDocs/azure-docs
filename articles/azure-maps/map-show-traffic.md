---
title: Show traffic with Azure Maps | Microsoft Docs
description: How to display traffic data on a Javascript map
author: jingjing-z
ms.author: jinzh
ms.date: 11/10/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Show traffic on the map

This article shows you how to show traffic and incidents information on the map.

## Understand the code

<iframe height='456' scrolling='no' title='Show traffic on a map' src='//codepen.io/azuremaps/embed/WMLRPw/?height=456&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WMLRPw/'>Show traffic on a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a Map object. You can see [create a map](map-create.md) for instructions.

The second block of code uses [setTraffic](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) function within the map's [event listener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events) function to render the traffic flows and incidents on the map.

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

See the following articles for full code samples:

> [!div class="nextstepaction"]
> [Code sample page](https://aka.ms/AzureMapsSamples)

Enhance your user experiences:

> [!div class="nextstepaction"]
> [Map interaction with mouse events](./map-events.md)

> [!div class="nextstepaction"]
> [Building an accessible map](./map-accessibility.md)
