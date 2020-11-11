---
title: Show traffic on a map | Microsoft Azure Maps
description: Find out how to add traffic data to maps. Learn about flow data, and see how to use the Azure Maps Web SDK to add incident data and flow data to maps.
author: anastasia-ms
ms.author: v-stharr
ms.date: 07/29/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen, devx-track-js
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

<iframe height='500' scrolling='no' title='Show traffic on a map' src='//codepen.io/azuremaps/embed/WMLRPw/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' loading="lazy" allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WMLRPw/'>Show traffic on a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Traffic overlay options

The following tool lets you switch between the different traffic overlay settings to see how the rendering changes. 

<br/>

<iframe height="700" style="width: 100%;" scrolling="no" title="Traffic overlay options" src="//codepen.io/azuremaps/embed/RwbPqRY/?height=700&theme-id=0&default-tab=result" frameborder='no' loading="lazy" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/RwbPqRY/'>Traffic overlay options</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Add traffic controls

There are two different traffic controls that can be added to the map. The first control, `TrafficControl`, adds a toggle button that can be used to turn traffic on and off. Options for this control allow you to specify when traffic settings to use when show traffic. By default this control will display relative traffic flow and incident data, however, you could change this to show absolute traffic flow and no incidents if desired. The second control, `TrafficLegendControl`, adds a traffic flow legend to the map that helps user understand what the color code road highlights mean. This control will only appear on the map when traffic flow data is displayed on the map and will be hidden at all other times.

The following code shows how to add the traffic controls to the map.

```JavaScript
//Att the traffic control toogle button to the top right corner of the map.
map.controls.add(new atlas.control.TrafficControl(), { position: 'top-right' });

//Att the traffic legend control to the bottom left corner of the map.
map.controls.add(new atlas.control.TrafficLegendControl(), { position: 'bottom-left' });
```

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Traffic controls" src="https://codepen.io/azuremaps/embed/ZEWaeLJ?height500&theme-id=0&default-tab=js,result&embed-version=2&editable=true" frameborder='no' loading="lazy" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/ZEWaeLJ'>Traffic controls</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](/javascript/api/azure-maps-control/atlas.map)

> [!div class="nextstepaction"]
> [TrafficOptions](/javascript/api/azure-maps-control/atlas.trafficoptions)

Enhance your user experiences:

> [!div class="nextstepaction"]
> [Map interaction with mouse events](map-events.md)

> [!div class="nextstepaction"]
> [Building an accessible map](map-accessibility.md)

> [!div class="nextstepaction"]
> [Code sample page](https://aka.ms/AzureMapsSamples)