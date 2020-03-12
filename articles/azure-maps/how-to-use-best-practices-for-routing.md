---
title: Route efficiently by using Azure Maps Route Service  | Microsoft Azure Maps 
description: Learn how to apply the best practices when using the Route Service from Microsoft Azure Maps.
author: farah-alyasari
ms.author: v-faalya
ms.date: 03/11/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Best practices for Azure Maps Route Service

The routing directions service and the route matrix service in Azure Maps [Route Service](https://docs.microsoft.com/rest/api/maps/route) allow users to navigate the shortest, fastest routes that are available. The user can navigate to multiple destinations at a time, in sequence. Results can be optimized based on the time or the distance. The Route service provides specialized routes and details for walkers, bicyclists, and commercial vehicles like trucks. The service considers multiple factors, such as the current traffic. And, the typical road speeds on the requested time of day and day of the week. Real-time traffic information and historic traffic data are used to calculate the estimated arrival times (ETAs) for each returned route, that's used by many "Mobility as a Service" (MaaS) applications.

In this article, we'll share the best practices to call Azure Maps [Route Service](https://docs.microsoft.com/rest/api/maps/route), and you'll learn how-to:

* Choose between the route direction service and the matrix routing service
* Request historic and real-time data, based on predicted routes and travel time
* Request route details, like time and distance, for the entire route and each leg of the route
* Request route for a commercial vehicle, like a truck
* Request traffic information, like jams and toll information, along a route
* Request a route that consists of one or more stops (Waypoints) 
* Optimize a route of one or more stops to obtain the best order to visit each stop (Waypoint)
* Optimize alternative routes using supporting points. For example, offer alternative routes that pass an electric vehicle charging station.
* Use the Route Service with the Azure Maps Web SDK

## Prerequisites

To make calls to the Azure Maps service APIs, you need an Azure Maps account and a key. For more information, see [Create an account](quick-demo-map-app.md#create-an-account-with-azure-maps) and [Get a primary key](quick-demo-map-app.md#get-the-primary-key-for-your-account). The primary key is also known as the primary subscription key, or subscription key.

For information about authentication in Azure Maps, see [Manage authentication in Azure Maps](./how-to-manage-authentication.md). And for more information about the coverage of the Route Service, see the [Routing Coverage](routing-coverage.md).

This article uses the [Postman app](https://www.postman.com/downloads/) to build REST calls, but you can choose any API development environment.

## Choose between Route directions and Matrix routing

The Route directions service returns instructions including the travel time and the coordinates for a route path. On the other hand, the Route Matrix service lets you calculate the travel time and distances for a set of routes that are defined by origin and destination locations. For every given origin, the Matrix service calculates the cost of routing from that origin to every given destination. The cost of routing is the travel time and the distance, from the origin to the given destination. Both of these services allow you to choose departure time, arrival time, and vehicle type. For example, you can specify a truck vehicle type, and specify the type of engine for the truck. Both services use real-time or predictive traffic data accordingly. Predictive traffic data is produced from historical data.

Consider calling Route Directions APIs, if your scenario is to:

* Request the shortest or fastest driving route between two or more known locations to get precise arrival times for your delivery vehicles.
* Request detailed route guidance, including route geometry, to visualize routes on the map
* Given a list of customer locations and calculate the shortest possible route to visit each customer then return to the origins. This scenario is the commonly known as the traveling salesman problem. This service lets you specify up to 150 Waypoints.
* Calculate a batch of up to 700 routing requests in parallel and retrieve the results as a response

Consider calling Matrix Routing API if your scenario is to:

* Calculate the travel time or distance between a set of origins and destinations. For example, you have 12 drivers and you need to find the closest available driver to pick up the food delivery from the restaurant.
* Sort potential routes by their actual travel distance or time. The Matrix API returns only travel times and distances for each origin and destination combination.
* Clustering data based on travel time or distances. For example, your company has 50 employees, find all employees that live within 20 minutes' drive time from your office.

Also, the Route Service supports batch mode, which allows you to send multiple routes queries using only a single API call. Here is comparison to show some of the Route Directions and Matrix Service capabilities:

| Azure Maps API | Max number of queries in the request | Avoid Areas | Truck and Electric Vehicle Routing | Waypoints and Traveling Salesman | Supporting Points |
| :--------------: |  :--------------: |  :--------------: | :--------------: | :--------------: | :--------------: |
| Get Route Directions | 1 | | X | X | |
| Post Route Directions | 1 | X | X | X | X |
| Post Route Directions Batch | 700 | | X | X | |
| Post Route Matrix | 700 | | X | | |

To learn more about Electric vehicle Routing capabilities, see our Tutorial on how to [Route electric vehicles using Azure Notebooks with Python](tutorial-ev-routing.md).

## Request historic and real-time data

By default, the Route service assumes that traveling mode is a car and that the depart time is now. It returns route based on real-time traffic conditions unless a route calculation request specifies otherwise. Fixed time-dependent traffic restrictions, like left turns aren't allowed between 4:00 PM to 6:00 PM. Otherwise, the restrictions are captured and will be considered by the routing engine. Temporary road closures, like roadworks, will be considered unless you specifically request a route that ignores the current live traffic. To ignore the current traffic, set `traffic` to `false` in your API request.

The route calculation **travelTimeInSeconds** value includes the delay due to traffic. It's generated by leveraging the current and historic travel time data, when depart time is set to now. If your departure time is set in the future, the routing service returns predicted travel times based on historical data.

If you include the **computeTravelTimeFor=all** parameter in your request, then the summary element in the response will have the following additional fields including historical traffic conditions:

| Element | Description|
| :--- | :--- |
| noTrafficTravelTimeInSeconds | Estimated travel time calculated as if there are no delays on the route due to traffic conditions, for example, due to congestion |
| historicTrafficTravelTimeInSeconds | Estimated travel time calculated using time-dependent historic traffic data |
| liveTrafficIncidentsTravelTimeInSeconds | Estimated travel time calculated using real-time speed data |

The next sections demonstrate how to make calls to the Route Service APIs using the discussed parameters.

### Sample Query

In the first example below the depart time is set to the future, at the time of writing.

```http
https://atlas.microsoft.com/route/directions/json?subscription-key=<Your-Azure-Maps-Primary-Subscription-Key>&api-version=1.0&query=51.368752,-0.118332:51.385426,-0.128929&travelMode=car&traffic=true&departAt=2025-03-29T08:00:20&computeTravelTimeFor=all
```

The response contains a summary element, like the one below. Because the depart time is set to the future, the **trafficDelayInSeconds** value is zero. The **travelTimeInSeconds** value is calculated using time-dependent historic traffic data. So, in this case, the **travelTimeInSeconds** value is equal to the **historicTrafficTravelTimeInSeconds** value.

```json
"summary": {
    "lengthInMeters": 2131,
    "travelTimeInSeconds": 248,
    "trafficDelayInSeconds": 0,
    "departureTime": "2025-03-29T08:00:20Z",
    "arrivalTime": "2025-03-29T08:04:28Z",
    "noTrafficTravelTimeInSeconds": 225,
    "historicTrafficTravelTimeInSeconds": 248,
    "liveTrafficIncidentsTravelTimeInSeconds": 248
},
```

### Sample Query

In the second example below, we have a real-time routing request, where departure time is now. It's not explicitly specified in the URL request because it's the default value.

```http
https://atlas.microsoft.com/route/directions/json?subscription-key=<Your-Azure-Maps-Primary-Subscription-Key>&api-version=1.0&query=47.6422356,-122.1389797:47.6641142,-122.3011268&travelMode=car&traffic=true&computeTravelTimeFor=all
```

The response contains a summary as shown below. Because of congestions, the **trafficDelaysInSeconds** value is greater than zero. It's also greater than **historicTrafficTravelTimeInSeconds**.

```json
"summary": {
    "lengthInMeters": 16637, 
    "travelTimeInSeconds": 2905, 
    "trafficDelayInSeconds": 1604, 
    "departureTime": "2020-02-28T01:00:20+00:00",
    "arrivalTime": "2020-02-28T01:48:45+00:00", 
    "noTrafficTravelTimeInSeconds": 872, 
    "historicTrafficTravelTimeInSeconds": 1976, 
    "liveTrafficIncidentsTravelTimeInSeconds": 2905 
},
```

## Request route and leg details

By default, the Route Service will return an array of coordinates. The response will contain the coordinates that make up the path in a list named `points`.  Route response also includes the distance from the start of the route and the estimated elapsed time. These values can be used to calculate the average speed for the entire route. 

The following image shows the `points` list. 

<center>

![point list](media/how-to-use-best-practices-for-routing/points-list-hidden.png)

</center>

Expand the `point` element to see the list of coordinates for the path:

<center>

![point list](media/how-to-use-best-practices-for-routing/points-list.png)

</center>

The Route Directions service supports different formats of instructions that can be used by specifying the **instructionsType** parameter. To format instructions for easy computer processing, use **instructionsType=coded**. Use **instructionsType=tagged** to display instructions as text for the user. Also, instructions can be formatted as text where some elements of the instructions are marked, and the instruction is presented with special formatting. See the [list of supported instruction types](https://nam06.safelinks.protection.outlook.com/GetUrlReputation) for more details.

When instructions are requested, the response returns a new element named `guidance`. The `guidance` element holds two pieces of information: turn-by-turn directions and summarized instructions.

<center>

![Instructions type](media/how-to-use-best-practices-for-routing/instructions-type.png)

</center>

The `instructions` element holds turn-by-turn directions for the trip, and the `instructionGroups` has summarized instructions. Each instruction summary covers a segment of the trip that could cover multiple roads. Details for sections of a route can be returned. such as, the coordinate range of a traffic jam or the current speed of traffic.

<center>

![Turn by turn instructions](media/how-to-use-best-practices-for-routing/instructions-turn-by-turn.png)

</center>

<center>

![Summarized Instructions](media/how-to-use-best-practices-for-routing/instructions-summary.png)

</center>

## Request a route for a commercial vehicle

Azure Maps Routing APIs support commercial vehicle routing, covering commercial trucks routing. The Routing Service considers specified limits. such as, the height and weight of the vehicle, and if the vehicle is carrying hazardous cargo. For example, if a vehicle is carrying flammable, the routing service avoids certain tunnels, such as tunnels near residential areas.

### Sample Query

The sample request below queries a route for a commercial truck. The truck is carrying class 1 hazardous waste material.

```http
https://atlas.microsoft.com/route/directions/json?subscription-key=<Your-Azure-Maps-Primary-Subscription-Key>&api-version=1.0&vehicleWidth=2&vehicleHeight=2&vehicleCommercial=true&vehicleLoadType=USHazmatClass1&travelMode=truck&instructionsType=text&query=51.368752,-0.118332:41.385426,-0.128929
```

The Route API returns directions that accommodate the dimensions of the truck and the hazardous waste. You can read the route instructions by expanding the `guidance` element.

<center>

![Truck with class 1 hazwaste](media/how-to-use-best-practices-for-routing/truck-with-hazwaste.png)

</center>

### Sample Query

Changing the US Hazmat Class, from the above query, will result in a different response to accommodate this change.

```http
https://atlas.microsoft.com/route/directions/json?subscription-key=<Your-Azure-Maps-Primary-Subscription-Key>&api-version=1.0&vehicleWidth=2&vehicleHeight=2&vehicleCommercial=true&vehicleLoadType=USHazmatClass9&travelMode=truck&instructionsType=text&query=51.368752,-0.118332:41.385426,-0.128929
```

The response below is for a truck a class 9 hazardous material, which is less dangerous than class 1. When you expand the `guidance` element to read the directions, you'll notice that the directions aren't the same. There are more route instructions for the truck carrying class 1 hazardous material.

<center>

![Truck with class 9 hazwaste](media/how-to-use-best-practices-for-routing/truck-with-hazwaste9.png)

</center>

## Request traffic information along a route

Through Azure Maps Route Direction APIs, developers can request details for each section type by including the `sectionType` parameter in the request. For example, you can request the speed information for each traffic jam segment. Refer to the [list of all values for the sectionType key](https://docs.microsoft.com/rest/api/maps/route/getroutedirections#sectiontype) to learn about the various details you can request.

### Sample Query

The following query sets the `sectionType` to `traffic`. It requests the sections that contain traffic information from Seattle to San Diego.

```http
https://atlas.microsoft.com/route/directions/json?subscription-key=<Your-Azure-Maps-Primary-Subscription-Key>&api-version=1.0&sectionType=traffic&query=47.6062,-122.3321:32.7157,-117.1611
```

The response returned the sections that are suitable for traffic along given the coordinates.

<center>

![traffic sections](media/how-to-use-best-practices-for-routing/traffic-section-type.png)

</center>

This option can be used to color the sections when rendering the map, as in the image below: 

<center>

![traffic sections](media/how-to-use-best-practices-for-routing/show-traffic-sections.png)

</center>

## Calculate and optimize a multi-stop route

Azure Maps currently provides two forms or route optimizations:

* Optimizations based on the mode of travel, without changing the order of Waypoints, this returns the fastest, shortest path

* Traveling salesmen optimization, which changes the order of the Waypoints to obtain the best order to visit each stop

Up to 150 Waypoints may be specified in a single route request. The starting and ending coordinate locations can be the same, as would be the case with a round trip. But, you need to provide at least one additional Waypoint to make the route calculation.  Waypoints can be added to the query in-between the origin and destination coordinates.

If you want to optimize the best order to visit the given Waypoints, then you need to specify **computeBestOrder=true**.

### Sample Query

The following query requests the path for six Waypoints, with the `computeBestOrder` parameter set to `false`. It's also the default value for the `computeBestOrder` parameter.

```http
https://atlas.microsoft.com/route/directions/json?api-version=1.0&subscription-key=<Your-Azure-Maps-Primary-Subscription-Key>&computeBestOrder=false&query=47.606544,-122.336502:47.759892,-122.204821:47.670682,-122.120415:47.480133,-122.213369:47.615556,-122.193689:47.676508,-122.206054:47.495472,-122.360861
```

The response describes the path length to be 140,851 meters, and that it would take 9991 seconds to travel that path.

<center>

![Non-optimized response](media/how-to-use-best-practices-for-routing/non-optimized-response.png)

</center>

The image below illustrates the path resulting from this query. This path is one possible route, but it's not the optimal path. 

<center>

![Non-optimized image](media/how-to-use-best-practices-for-routing/non-optimized-image.png)

</center>

This route Waypoint order is: 0, 1, 2, 3, 4, 5, and 6. It's the same order of the waypoints in the request.

### Sample Query

The following query requests the path for the same six Waypoints, as in the above sample. This time, the `computeBestOrder` parameter set to `true`.

```http
https://atlas.microsoft.com/route/directions/json?api-version=1.0&subscription-key=<Your-Azure-Maps-Primary-Subscription-Key>&computeBestOrder=true&query=47.606544,-122.336502:47.759892,-122.204821:47.670682,-122.120415:47.480133,-122.213369:47.615556,-122.193689:47.676508,-122.206054:47.495472,-122.360861
```

The response describes the path length to be 91,814 meters, and that it would take 7797 seconds to travel that path. The travel distance and the travel time are both lower here, because the API returned the optimized route.

<center>

![Non-optimized response](media/how-to-use-best-practices-for-routing/optimized-response.png)

</center>

The image below illustrates the path resulting from this query

<center>

![Non-optimized image](media/how-to-use-best-practices-for-routing/optimized-image.png)

</center>

The optimal route has the following Waypoint order: 0, 5, 1, 2, 4, 3, and 6.

>[!TIP]
> The optimized Waypoint order information from the routing service provides a set of indices. These exclude the origin and the destination indices. You need to increment these values by 1 to account for the origin. Then, add your destination to the end to get the complete ordered Waypoint list.

## Calculate and bias alternative routes using supporting points

You might have situations where you want to reconstruct a route to calculate zero or more alternative routes of your reference route. For example, you may want to show customers alternative routes that pass your retail store. In this case, you need to bias a location using supporting points. Here are the steps to bias a location:

1. Calculate a route as-is and get the path from the route response
2. Use the route path to find the desired locations along or near the route path. For example, you can use Azure Maps [Point of Interest API](https://docs.microsoft.com/rest/api/maps/search/getsearchpoi) or query your own data in your database.  
3. Order the locations based on the distance from the start of the route
4. Add these locations as supporting points in a new route request to the [Post Route Directions API](https://docs.microsoft.com/rest/api/maps/route/postroutedirections). To learn more about the supporting points, see the [Post Route Directions API documentation](https://docs.microsoft.com/rest/api/maps/route/postroutedirections#supportingpoints). 

When calling the [Post Route Directions API](https://docs.microsoft.com/rest/api/maps/route/postroutedirections), you can set the minimum deviation time or the distance constraints, along with the supporting points. Use these parameters if you want to offer alternative routes, but you also want to limit the travel time. When these constraints are used, the alternative routes will follow the reference route from the origin point for the given time or distance. In other words, the other routes diverge from the reference route per the given constraints.

The image below is an example of rendering alternative routes with specified deviations for the time and the distance.

<center>

![Alternative routes](media/how-to-use-best-practices-for-routing/alternative-routes.png)

</center>

## Use the Routing service in a web app

The Azure Maps Web SDK provides a [Service module](https://docs.microsoft.com/javascript/api/azure-maps-rest/?view=azure-maps-typescript-latest). This module is a helper library that makes it easy to use the Azure Maps REST services in web or Node.js applications, using JavaScript or TypeScript. The Service module can be used to render the returned routes on the map. The module automatically determines which API to use with the GET and POST requests.

## Next steps

To learn more, please see:

> [!div class="nextstepaction"]
> [How to use the Service module documentation](https://docs.microsoft.com/azure/azure-maps/how-to-use-services-module)

> [!div class="nextstepaction"]
> [Show route on the map](https://docs.microsoft.com/azure/azure-maps/map-route)

> [!div class="nextstepaction"]
> [Azure Maps NPM Package](https://www.npmjs.com/package/azure-maps-rest  )
