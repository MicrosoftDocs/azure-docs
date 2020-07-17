---
title: Show traffic on a map | Microsoft Azure Maps
description: In this article you will learn, how to display traffic data on a map using the Microsoft Azure Maps Web SDK.
author: Philmea
ms.author: philmea
ms.date: 07/29/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Show traffic on the map

There are two types of traffic data available in Azure Maps:

- Incident data - consists of point and line-based data for things such as construction, road closures, and accidents.
- Flow data - provides metrics on the flow of traffic on the roads. Often, traffic flow data is used to color the roads. The colors are based on how much traffic is slowing down the flow, relative to the speed limit, or another metric. The traffic flow data in Azure Maps has three different metrics of measurement:
    - `relative` - is relative to the free-flow speed of the road.
    - `absolute` - is the absolute speed of all vehicles on the road.
    - `relative-delay` - displays areas that are slower than the average expected delay.

The following code shows how to display traffic data on the map.

```javascript
//Show traffic on the map using the traffic options.
map.setTraffic({
    incidents: true,
    flow: 'relative'
});
```

Below is the complete running code sample of the above functionality.

<br/>

<iframe height='500' scrolling='no' title='Show traffic on a map' src='//codepen.io/azuremaps/embed/WMLRPw/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WMLRPw/'>Show traffic on a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Traffic overlay options

The following tool lets you switch between the different traffic overlay settings to see how the rendering changes. 

<br/>

<iframe height="700" style="width: 100%;" scrolling="no" title="Traffic overlay options" src="//codepen.io/azuremaps/embed/RwbPqRY/?height=700&theme-id=0&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/RwbPqRY/'>Traffic overlay options</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map)

> [!div class="nextstepaction"]
> [TrafficOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.trafficoptions)

Enhance your user experiences:

> [!div class="nextstepaction"]
> [Map interaction with mouse events](map-events.md)

> [!div class="nextstepaction"]
> [Building an accessible map](map-accessibility.md)

> [!div class="nextstepaction"]
> [Code sample page](https://aka.ms/AzureMapsSamples)
