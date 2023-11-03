---
title: Show traffic on a map
titleSuffix: Microsoft Azure Maps
description: Find out how to add traffic data to maps. Learn about flow data, and see how to use the Azure Maps Web SDK to add incident data and flow data to maps.
author: sinnypan
ms.author: sipa
ms.date: 10/26/2023
ms.topic: how-to
ms.service: azure-maps
---

# Show traffic on the map

There are two types of traffic data available in Azure Maps:

- Incident data - consists of point and line-based data for things such as construction, road closures, and accidents.
- Flow data - provides metrics on the flow of traffic on the roads. Often, traffic flow data is used to color the roads. The colors are based on how much traffic is slowing down the flow, relative to the speed limit, or another metric. There are four values that can be passed into the traffic `flow` option of the map.

    |Flow Value | Description|
    | :-- | :-- |
    | `none` | Doesn't display traffic data on the map |
    | `relative` | Shows traffic data that's relative to the free-flow speed of the road |
    | `relative-delay` | Displays areas that are slower than the average expected delay |
    | `absolute` | Shows the absolute speed of all vehicles on the road |

The following code shows how to display traffic data on the map.

```javascript
//Show traffic on the map using the traffic options.
map.setTraffic({
    incidents: true,
    flow: 'relative'
});
```

The [Traffic Overlay] sample demonstrates how to display the traffic overlay on a map. For the source code for this sample, see [Traffic Overlay source code].

:::image type="content" source="./media/map-show-traffic/traffic-overlay.png" lightbox="./media/map-show-traffic/traffic-overlay.png" alt-text="A screenshot of map with the traffic overlay, showing current traffic.":::

<!--------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/WMLRPw/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
-------------------------------------------------->

## Traffic overlay options

The [Traffic Overlay Options] tool lets you switch between the different traffic overlay settings to see how the rendering changes. For the source code for this sample, see [Traffic Overlay Options source code].

:::image type="content" source="./media/map-show-traffic/traffic-overlay-options.png" lightbox="./media/map-show-traffic/traffic-overlay-options.png" alt-text="A screenshot of map showing the traffic overlay options.":::

<!--------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/RwbPqRY/?height=700&theme-id=0&default-tab=result]
-------------------------------------------------->

## Add traffic controls

There are two different traffic controls that can be added to the map. The first control, `TrafficControl`, adds a toggle button that can be used to turn traffic on and off. Options for this control allow you to specify when traffic settings to use when show traffic. By default this control displays relative traffic flow and incident data, however, you could change this behavior and show absolute traffic flow and no incidents if desired. The second control, `TrafficLegendControl`, adds a traffic flow legend to the map that helps user understand what the color code road highlights mean. This control only appears on the map when traffic flow data is displayed on the map and is hidden at all other times.

The following code shows how to add the traffic controls to the map.

```JavaScript
//Att the traffic control toogle button to the top right corner of the map.
map.controls.add(new atlas.control.TrafficControl(), { position: 'top-right' });

//Att the traffic legend control to the bottom left corner of the map.
map.controls.add(new atlas.control.TrafficLegendControl(), { position: 'bottom-left' });
```

The [Traffic controls] sample is a fully functional map that shows how to display traffic data on a map. For the source code for this sample, see [Traffic controls source code].

:::image type="content" source="./media/map-show-traffic/add-traffic-controls.png" lightbox="./media/map-show-traffic/add-traffic-controls.png" alt-text="A screenshot of map with the traffic display button, showing current traffic.":::

<!--------------------------------------------------
> [!VIDEO https://codepen.io/azuremaps/embed/ZEWaeLJ?height500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
-------------------------------------------------->

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map]

> [!div class="nextstepaction"]
> [TrafficOptions]

Enhance your user experiences:

> [!div class="nextstepaction"]
> [Map interaction with mouse events]

> [!div class="nextstepaction"]
> [Building an accessible map]

> [!div class="nextstepaction"]
> [Code sample page]

[Building an accessible map]: map-accessibility.md
[Code sample page]: https://samples.azuremaps.com/
[Map interaction with mouse events]: map-events.md
[Map]: /javascript/api/azure-maps-control/atlas.map
[Traffic controls source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Traffic/Traffic%20controls/Traffic%20controls.html
[Traffic controls]: https://samples.azuremaps.com/traffic/traffic-controls
[Traffic Overlay Options source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Traffic/Traffic%20Overlay%20Options/Traffic%20Overlay%20Options.html
[Traffic Overlay Options]: https://samples.azuremaps.com/traffic/traffic-overlay-options
[Traffic Overlay source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Traffic/Traffic%20Overlay/Traffic%20Overlay.html
[Traffic Overlay]: https://samples.azuremaps.com/traffic/traffic-overlay
[TrafficOptions]: /javascript/api/azure-maps-control/atlas.trafficoptions
