---
title: Time Series Model | Microsoft Docs
description: Understanding Time Series Model
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 12/04/2018
---

# Time Series Model

This document details the **Time Series Model** (TSM) part of the Azure Time Series Insights (TSI) update. It describes the model itself, its capabilities, and how to get started building and updating your own model.

Traditionally, the data collected from IoT devices lacks contextual information making it difficult to find and analyze sensors quickly. The main motivation for TSM is to simplify finding and analyzing IoT data by enabling curation, maintenance, and enrichment of time series data to help prepare consumer-ready data sets. TSMs play a vital role in queries and navigation since they contextualize device and non-device entities. Data persisted in TSM powers time series queries computations by leveraging the formulas stored in them.

![tsm][1]

## Key capabilities

With the goal to make it simple and effortless to manage time series contextualization, TSM enables the following capabilities in The Azure TSI (Preview):

* The ability to author and manage computations or formulas, to transform data leveraging scalar functions, aggregate operations, etc.
* Defining parent child relationships to enable navigation and reference to provide context to time series telemetry.
* Define properties associated with the instances part of instance fields and use these to create hierarchies.

## Times Series Model key components

There are three major components of TSM:

* **Time Series Model** *types*
* **Time Series Model** *hierarchies*
* **Time Series Model** *instances*

## Time Series Model types

**Time Series Model** *types* enable defining variables or formulas for doing computations and are associated with a given TSI instance. A type can have one or more variables. For example, a TSI instance might be of type **Temperature Sensor**, which consists of the variables: *avg temperature*, *min temperature*, and *max temperature*. We create a default type when the data starts flowing into TSI. It can be retrieved and updated from model settings. Default types will have a variable that counts the number of events.

## Time Series Model type JSON example

Given a POST HTTP request:

```plaintext
https://YOUR_ENVIROMENT.env.timeseries.azure.com/timeseries/types/$batch?api-version=API_VERSION
```

| Name | Description | Example |
| --- | --- | --- |
| YOUR_ENVIRONMENT  |  The name of your environment  | `environment123` |
| API_VERSION  |  The API specification | `2018-11-01-preview` |

With the following JSON body and variable attributes:

| Attribute | Required or Optional |
| --- | --- |
| **kind**  |  Required  |
| **filter**  |  Optional |
| **value**  | Null or not specified  |
| **aggregation**  |  Required |

```JSON
{
    "get": null,
    "put": [
        {
            "name": "SampleType",
            "description": "This is type 2",
            "variables": {
                "Avg Temperature": {
                    "kind": "numeric",
                    "filter": null,
                    "value": { "tsx": "$event.temperature.Double" },
                    "aggregation": {"tsx": "avg($value)"}
                },
                "Count Temperature": {
                    "kind": "aggregate",
                    "filter": null,
                    "value": null,
                    "aggregation": {"tsx": "count()"}
                },
                "Min Temperature": {
                    "kind": "aggregate",
                    "filter": null,
                    "value": null,
                    "aggregation": {"tsx": "min($event.temperature)"}
                },
            }
        }
    ]
}
```

Response:

```JSON
{
    "get": null,
    "put": [
        {
            "timeSeriesType": {
                "id": "fc4f526c-da6e-4b85-87f7-16f6cf9b69be",
                "name": "type2",
                "description": "This is type 2",
                "variables": {
                    "Avg Temperature": {
                        "kind": "numeric",
                        "filter": null,
                        "value": { "tsx": "$event.temperature.Double" },
                        "aggregation": {"tsx": "avg($value)"}
                    },
                    "Count Temperature": {
                        "kind": "aggregate",
                        "filter": null,
                        "value": null,
                        "aggregation": {"tsx": "count()"}
                    },
                    "Min Temperature": {
                        "kind": "aggregate",
                        "filter": null,
                        "value": null,
                        "aggregation": {"tsx": "min($event.temperature)"}
                    }
                }
            },
            "error": null
        }
    ]
}
``````

A **default** *type* JSON response:

```JSON
{
    "modelSettings": {
        "name": "DefaultModel",
        "timeSeriesIdProperties": [
            {
                "name": "someType1",
                "type": "String"
            }
        ],
        "defaultTypeId": "1be09af9-f089-4d6b-9f0b-48018b5f7393"
    }
}
```

## Variables

Azure TSI types have variables, which are named calculations over values from the events. TSI variable definitions contain formula and computation rules. Variable definitions include kind, value, filter, reduction, and boundaries. Variables are stored in type definition in TSM and can be provided inline via Query APIs to override the stored definition.

The matrix below works as a legend for variable definitions:

![table][2]

### Variable kind

The following variable kinds are supported:

* Numeric
* Aggregate

### Variable filter

Variable filters specify an optional filter clause to restrict the number of rows being considered for computation based on conditions.

### Variable value

Variable values are and should be used in computation. This is the column in the events that we should refer to.

### Variable aggregation

The aggregate function the variable enables part of computation. TSI will support regular aggregates (namely, **min**, **max**, **avg**, **sum**, and **count**).

## Time Series Model hierarchies

Hierarchies organize instances by specifying property names and their relationships. You might have a single hierarchy or multiple hierarchies. Additionally, these need not be a current part of your data, but each instance should map to a hierarchy. A TSM instance can map to a single hierarchy or multiple hierarchies.

Hierarchies are defined by **Hierarchy ID**, **name**, and **source**. Hierarchies have paths, a path is top-down parent-child order of the hierarchy the user wants to create. The parent/children properties map instance fields.

### Time Series Model hierarchy JSON example

Given a POST HTTP request:

```plaintext
https://YOUR_ENVIROMENT.env.timeseries.azure.com/timeseries/hierarchies/$batch?api-version=API_VERSION
```

| Name | Description | Example |
| --- | --- | --- |
| YOUR_ENVIRONMENT  |  The name of your environment  | `environment123` |
| API_VERSION  |  The API specification | `2018-11-01-preview` |

With JSON body:

```JSON
{
    "get": null,
    "put": [
        {
            "id": "4c6f1231-f632-4d6f-9b63-e366d04175e3",
            "name": "Location",
            "source": {
                "instanceFieldNames": [
                    "state",
                    "city"
                ]
            }
        }
    ]
}
```

Response:

```JSON
{
    "get": null,
    "put": [
        {
            "hierarchy": {
                "id": "4c6f1231-f632-4d6f-9b63-e366d04175e3",
                "name": "Location",
                "source": {
                    "instanceFieldNames": [
                        "state",
                        "city"
                    ]
                }
            },
            "error": null
        }
    ]
}
```

### Hierarchy definition behavior

Consider the following example where hierarchy H1 has “building”, “floor” and “room” as part of its definition:

```plaintext
 H1 = [“building”, “floor”, “room”]
```

Depending on the instance fields, the hierarchy attributes and values will appear will show: 

| Time Series ID | Instance Fields |
| --- | --- |
| ID1 | “building” = “1000”, “floor” = “10”, “room” = “55”  |
| ID2 | “building” = “1000”, “room” = “55” |
| ID3 |  “floor” = “10” |
| ID4 | “building” = “1000”, “floor” = “10”  |
| ID5 | |

In above example, ID1 shows as part of hierarchy H1 in the UI/UX, while the rest are classified under `Unparented Instances` since they do not conform to the specified data hierarchy.

## Time Series Model instances

Instances are the time series themselves. In most cases, the *deviceId* or *assetId* will be the unique identifier of the asset in the environment. Instances have descriptive information associated with them called instance properties. At a minimum, instance properties include hierarchy information. They can also include useful, descriptive data like the manufacturer, operator, or the last service date.

Instances are defined by *timeSeriesId*, *typeId*, *hierarchyId*, and *instanceFields*. Each instance maps to only one *type*, and one or more hierarchies. Instances inherit all properties from hierarchies, while additional *instanceFields* can be added for further instance property definition.

*instanceFields* are properties of an instance and any static data that defines an instance. They define values of hierarchy or non-hierarchy properties while also supporting indexing to perform search operations.

## Time Series Model instance JSON example

Given a POST HTTP request:

```plaintext
https://YOUR_ENVIROMENT.env.timeseries.azure.com/timeseries/instances/$batch?api-version=API_VERSION
```

| Name | Description | Example |
| --- | --- | --- |
| YOUR_ENVIRONMENT  |  The name of your environment  | `environment123` |
| API_VERSION  |  The API specification | `2018-11-01-preview` |

With JSON body:

```JSON
{
    "get": null,
    "put": [
        {
            "name": "SampleName",
            "typeId": "1be09af9-f089-4d6b-9f0b-48018b5f7393",
            "timeSeriesId": [
                "samplePartitionKeyValueOne"
            ],
            "description": "floor 100",
            "hierarchyIds": [
                "e37a4666-9650-42e6-a6d2-788f12d11158"
            ],
            "instanceFields": {
                "state": "California",
                "city": "Los Angeles"
            }
        }
    ]
}
```

Response:

```JSON
{
    "get": null,
    "put": [
        {
            "instance": null,
            "error": null
        },
        {
            "instance": null,
            "error": null
        }
    ]
}
```

## Time Series Model settings example

Given a POST HTTP request:

```plaintext
https://YOUR_ENVIROMENT.env.timeseries.azure.com/timeseries/modelSettings?api-version=API_VERSION
```

| Name | Description | Example |
| --- | --- | --- |
| YOUR_ENVIRONMENT  |  The name of your environment  | `environment123` |
| API_VERSION  |  The API specification | `2018-11-01-preview` |

Response:

```JSON
{
    "modelSettings": {
        "name": "DefaultModel",
        "timeSeriesIdProperties": [
            {
                "name": "someType1",
                "type": "String"
            }
        ],
        "defaultTypeId": "1be09af9-f089-4d6b-9f0b-48018b5f7393"
    }
}
```

## Next steps

Read the [Azure TSI (Preview) storage and ingress](./time-series-insights-update-storage-ingress.md).

Read the about the new [Time series model](https://docs.microsoft.com/rest/api/time-series-insights/preview-model).

<!-- Images -->
[1]: media/v2-update-tsm/tsm.png
[2]: media/v2-update-tsm/table.png
