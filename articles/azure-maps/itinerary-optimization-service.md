---
title: Create multi-itinerary optimization service 
titleSuffix: Microsoft Azure Maps
description: Learn how to use Azure Maps and NVIDIA cuOpt to build a multi-itinerary optimization service.
author: FarazGIS
ms.author: fsiddiqui
ms.date: 05/20/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Create multi-itinerary optimization service

This guide describes how to use [Azure Maps] and [NVIDIA cuOpt] to build an itinerary optimization service that automates the process of building itineraries for multiple agents and mixed fleets, and optimizes their route across multiple destinations.

This is a two-step process that requires a cost matrix for the travel time and a solver to optimize the problem and generate an outcome. A cost matrix represents the cost of traveling between every two sets of locations in the problem, which includes the travel time cost and other costs of travel.

:::image type="content" source="media/multi-itinerary-optimization-service/itinerary-optimization-workflow.png" alt-text="A screenshot showing the Itinerary optimization workflow.":::

This article describes how to:

- Get started with NVIDIA cuOpt on Azure Marketplace.
- Use Azure Maps Route Matrix API to get the travel cost.
- How to map the problem to cuOpt API calls.
- How to use the cuOpt response.
- Call Azure Maps Route Directions API for routing.

Refer to the [Multi Itinerary Optimization] code sample for a quick start.

## Prerequisites

- An [Azure Maps account]
- A [subscription key] or other form of [Authentication with Azure Maps]

## Service support

This service can support the following features and constraints.

| Route Optimization capabilities  | Supported?  |
|----------------------------------|-------------|
| Truck and automobiles            | Yes         |
| Multi-itinerary                  | Yes         |
| Multi driver                     | Yes         |
| Multi day                        | Yes         |
| Mixed fleet                      | Yes         |
| Vehicle time window              | Yes         |
| Time limits                      | Yes         |
| Priority                         | Yes         |
| Agent breaks                     | Yes         |
| Pickup deliveries                | Yes         |
| Cost per vehicle                 | Yes         |
| Min and max vehicles             | Yes         |

For the full list of supported capabilities, see [cuOpt Supported Features].

## Get started with Nvidia cuOpt on Azure Marketplace

Nvidia cuOpt uses GPU accelerated logistics solver and optimizations to calculate complex vehicle routing problems with a wide range of constraints. For more information, see the [List of cuOpt supported features].

cuOpt is included with Nvidia AI Enterprise. Visit [Azure Marketplace] to get started.

## Get the travel cost

Itinerary optimization requires a square matrix of some travel metric that is passed to the cuOpt solver. This could include travel time or distance cost. A cost matrix is a square matrix that represents the cost of traveling between each two pairs of locations in the problem.

The Azure Maps [Route Matrix] API calculates the time and distance cost of routing from origin to every destination. The set of origins and the set of destinations can be thought of as the column and row headers of a table and each cell in the table contains the costs of routing from the origin to the destination for that cell.

For example, a restaurant has two drivers that need to deliver food to four locations. To solve this case, you'll first call the Route Matrix API to get the travel times between all locations. This example assumes that the drivers’ start, and end location is the restaurant. If the start and end locations are different from the depot, they must be included in the cost matrices.

Number of origins = Number of destinations = 1 (restaurant also known as _depot_) + 4 (deliveries)

Matrix size = 5 origins x 5 destinations = 25

Note: Azure Maps Route Matrix can support up to 700 matrix cells which approximate to a square matrix of 26x26. You can use it to plan the itinerary for 26 locations including depots and deliveries.

The Route Matrix POST request:

```html
https://atlas.microsoft.com/route/matrix/json?api-version=1.0&routeType=shortest
```

```json
{
  "origins": { 
    "type": "MultiPoint", 
    "coordinates": [ 
      [4.85106, 52.36006], //restaurant or depot 
      [4.85056, 52.36187], //delivery location 1 
      [4.85003, 52.36241], //delivery location 2 
      [4.42937, 52.50931], //delivery location 3 
      [4.42940, 52.50843]  //delivery location 4 
    ] 
  }, 
  "destinations": { 
    "type": "MultiPoint", 
      [4.85106, 52.36006], //restaurant or depot 
      [4.85056, 52.36187], //delivery location 1 
      [4.85003, 52.36241], //delivery location 2 
      [4.42937, 52.50931], //delivery location 3 
      [4.42940, 52.50843]  //delivery location 4 
    ] 
  } 
} 
```

The Route Matrix response returns a 5x5 multi-dimensional array where each row represents the origins and columns represent the destinations. Use the field `travelTimeInSeconds` to get the time cost for each location pair. The time unit should be consistent across the solution. Once the preprocessing stage is complete, the order, depot, fleet info and the cost matrix, are sent over and imported to the cuOpt Server via API calls.

The following JSON sample shows what is returned in the body of the HTTP response of the cost matrix sample:

```json
cost_matrix_data = [
    [ 0, 10,  8,  6, 10], 
    [10,  0, 12,  8,  6], 
    [ 8, 16,  0,  8,  4], 
    [ 2,  8,  6,  0,  8], 
    [ 6,  6, 10, 12,  0], 
] 
```

> [!NOTE]
> The cost of going from a location to itself is typically 0, and the cost of going from location A to location B is not necessarily equal to going from location B to location A.

## Map the problem to cuOpt API calls

This section describes how to build request data for cuOpt calls. For more examples, see [cuOpt best practices].

1. [Set Cost Matrix](#set-cost-matrix)
1. [Set Fleet Data](#set-fleet-data)
1. [Set Task Data](#set-task-data)
1. [Set Solver Config (optional)](#set-solver-config-optional)

### Set Cost Matrix

Parse the Azure Maps Route Matrix API response to get the travel time between locations to construct the cost matrix. In the following example, “0” represents the key that represents a specific vehicle type.  

```json
"data": {" cost_matrix_data ": {
    "data": {
    "0": [
        [0, 5, 4, 3, 5],
        [5, 0, 6, 4, 3],
        [4, 8, 0, 4, 2],
        [1, 4, 3, 0, 4],
        [3, 3, 5, 6, 0]
    ]
    }}}
```

Multiple cost matrices can optionally be provided depending on the types of vehicles. Some vehicles can travel faster while others might incur additional costs when traveling through certain areas. This can be modeled using additional cost matrices one for each vehicle type. The next example has two matrices, “0” represents first vehicle, which could be a car and “1” represents second vehicle, which could be a truck. Note, if your fleet has vehicles with similar profiles you need to specify the cost matrix only once.

```json
"data": {" cost_matrix_data ": {
    "data": {
    "0": [
        [0, 5, 4, 3, 5],
        [5, 0, 6, 4, 3],
        [4, 8, 0, 4, 2],
        [1, 4, 3, 0, 4],
        [3, 3, 5, 6, 0]
    ],
    "1": [
        [0, 4, 2, 3, 3],
        [2, 0, 6, 5, 3],
        [3, 8, 0, 3, 2],
        [1, 5, 3, 0, 4],
        [3, 4, 5, 7, 0]
    ],
    }}}
```

### Set Fleet Data

Fleet data could describe the fleet description like the number of vehicles, their start and end location, vehicle capacity, etc. that is used by the solver to determine which vehicles are available to carry out the task within the constraints.

```json
{
     "fleet_data": {
        "vehicle_locations": [
            [0,1], [0,1]
        ],
        "capacities": [[2,3]],
"vehicle_time_windows": [
        [0, 80],
        [1, 40]
    ],
"vehicle_break_time_windows":[
        [
            [20, 25],
            [20, 25]
        ]
    ],
"vehicle_break_durations": [[1, 1, 1, 1, 1]]
        }
    }
```

- **Vehicle locations**: In the above example, fleet data indicates two vehicles, one array for each vehicle. Both vehicles start at location 0 and end trip at location 1. In the context of a cost matrix description of the environment, these vehicle locations correspond to row (or column) indices in the cost matrix.
- **Capacities**: The capacity array indicates the vehicle capacity; the first vehicle has a capacity of two and second vehicle has a capacity of three. Capacity could represent various things, for example package weight, service skills and their amounts transported by each vehicle. In the next section, you'll create a task json that will require a demand dimension for each task location and the count of demand dimension will correspond to the number of capacity dimensions in the fleet data.
For example, if there are two vehicles in the fleet with a capacity of two and three that indicates the number of people it can accommodate on a single trip and the demand is three for a delivery location, the solver would use the vehicle with a capacity of three to carry out the task.
- **Vehicle time windows**: Time windows specify the operating time of the vehicle to complete the tasks. This could be the agent’s shift start and end time. Raw data can include Universal Time Stamp (UTC) date/time format or string format that must be converted to floating value. (Example: 9:00 am - 6:00 pm converted to minutes in a 24-hour period starting at 12:00 am, would be [540, 1080]). All time/cost units provided to the cuOpt solver should be in the same unit.
- **Vehicle breaks**: Vehicle break windows and duration can also be specified. This could represent the agent’s lunch break, or other breaks as needed. The break window format would be same as the vehicle time window format. All time/cost units provided to the cuOpt solver should be in the same unit.

### Set task data

Tasks define the objective that must be fulfilled within the constraints. In the context of the last mile delivery this could include the delivery locations, demand quantity at each location, delivery window and dwell time for each location.

```json
"task_data": {
        "task_locations": [1, 2, 3, 4], 
        "demand": [[3, 4, 4, 3]], 
        "task_time_windows": [[8, 17], [8, 17], [8, 17], [17, 20]], 
        "service_times": [0, 0, 0, 0]
}
```

- **Task location**: In the above example, task_locations indicate the delivery location located at positions 1, 2, 3 and 4. These locations correspond to row (or column) indices in the cost matrix.
- **Demand**: The demand array indicates the demand quantity at each location; the first location has a demand of 3, second and third location has 4 and the last location has 3. The count of demand dimensions should correspond to the number of capacity dimensions for each vehicle.
- **Task time window**: Time windows constraints specifies when a task should be completed. Each task is assigned a start and end time window, and the task must be completed within that. Raw data can include Universal Time Stamp (UTC) date/time format or string format that must be converted to floating value. (Example: 9:00 am - 6:00 pm converted to minutes in a 24-hour period starting at 12:00 am, would be [540, 1080]). All time/cost units provided to the cuOpt solver should be in the same unit.
- **Service times**: This represents the duration required to complete the tasks. The service_times array specifies the time duration for each task location. All time/cost units provided to the cuOpt solver should be in the same unit.

### Set Solver config (optional)

You can optionally specify solver configuration to allot a maximum time to find a solution. This depends on the use case, and setting a higher time limit returns better results.

```json
        "solver_config": {
         "time_limit": 1
        }
```

> [!NOTE]
> You may have additional constraints depending on the problem, such as order priorities or vehicle cost, see cuOpt supported features. Other features would be preprocessed similarly to the features covered in the examples.

## How to use the cuOpt response

The cuOpt solver returns the optimized stop for each vehicle and the travel itinerary. Parse the response and convert each location to a coordinate point before calling the Azure Maps Route Directions API to get the routes. These optimized routes include the route path and driving directions for each agent.

Sample request data

```json
{
"requestBody": {
"data": {"cost_matrix_data": {"data": {"1": [[0, 5, 4, 3, 5], [5, 0, 6, 4, 3], [4, 8, 0, 4, 2], [1, 4, 3, 0, 4], [3, 3, 5, 6, 0]]}},
"fleet_data": {
        "vehicle_locations": [[0, 0], [0, 0]], 
        "vehicle_ids": ["Car-A", "Car-B"], 
        "vehicle_types": [1, 1], 
        "capacities": [[75, 75]], 
        "vehicle_time_windows": [[8, 17], [8, 17]], 
        "vehicle_break_time_windows": [[[12, 14], [12, 14]]], 
        "vehicle_break_durations": [[0, 0]]
}, 
"task_data": {
        "task_locations": [1, 2, 3, 4], 
        "demand": [[30, 40, 40, 30]], 
        "task_time_windows": [[8, 17], [8, 17], [8, 17], [17, 20]], 
        "service_times": [0, 0, 0, 0]
},
"solver_config": {
         "time_limit": 1
        }},
    "client_version": ""
    }
}
```

Sample response

```json
{
    "reqId": "5a96b531-bacf-44db-9170-87585eeffc3e",
    "status": "fulfilled",
    "percentComplete": 100,
    "response": {
        "response": {
            "solver_infeasible_response": {
                "status": 1,
                "num_vehicles": 2,
                "solution_cost": 19.0,
                "vehicle_data": {
                    "Car-A": {
                        "task_id": ["Depot", "0", "Break", "2", "Depot"],
                        "arrival_stamp": [8.0, 11.0, 12.0, 14.0, 16.0]
                        ],
                        "route": [0, 1, 1, 3, 0],
                        "type": ["Depot", "Delivery", "Break", "Delivery", "Depot”]
                    },
                    "Car-B": {
                        "task_id": [
                            "Depot",
                            "Break",
                            "1",
                            "3",
                            "Depot"
                        ],
                        "arrival_stamp": [8.0, 12.0, 12.0, 17.0, 18.0],
                        "route": [0, 2, 2, 4, 0],
                        "type": ["Depot", "Break", "Delivery", "Delivery", "Depot"]
                    }
                },
                "dropped_tasks": {
                    "task_id": [],
                    "task_index": []
                },
                "msg": ""
            }
        }
    }
}
```

## Call Azure Maps Route Directions API for routing

After the locations in the cuOpt response are mapped to the corresponding coordinates, the cuOpt service can be used with the Azure Maps [Route Directions] API and web SDK to create a web app that displays the assigned itineraries and optimized routes on the map. You can color code the route path for individual vehicles based on the assigned stops and display it on the Azure Maps base data.

:::image type="content" source="media/multi-itinerary-optimization-service/multi-itinerary-route.png" alt-text="A screenshot showing the multi-itinerary route on a map.":::

## Next steps

> [!div class="nextstepaction"]
> [Azure Maps code samples]

> [!div class="nextstepaction"]
> [Azure Maps Route Directions API]

> [!div class="nextstepaction"]
> [Azure Maps Route Matrix API]

[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps code samples]: https://samples.azuremaps.com/
[Azure Maps Route Directions API]: /rest/api/maps/route/post-directions
[Azure Maps Route Matrix API]: /rest/api/maps/route/post-route-matrix
[Azure Maps]: /azure/azure-maps/
[Azure Marketplace]: https://azuremarketplace.microsoft.com/en-us/marketplace/apps/nvidia.nvidia-ai-enterprise?tab=Overview
[cuOpt best practices]: https://docs.nvidia.com/cuopt/user-guide/best-practices.html
[cuOpt Supported Features]: https://docs.nvidia.com/cuopt/user-guide/supported-features.html
[List of cuOpt supported features]: https://docs.nvidia.com/cuopt/user-guide/supported-features.html
[Multi Itinerary Optimization]: https://samples.azuremaps.com/rest-services/mio
[NVIDIA cuOpt]: https://www.nvidia.com/en-us/ai-data-science/products/cuopt/
[Route Directions]: /rest/api/maps/route/post-directions
[Route Matrix]: /rest/api/maps/route/post-route-matrix
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
