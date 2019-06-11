---
title: 'Time Series Model in Azure Time Series Insights Preview | Microsoft Docs'
description: Understanding Azure Time Series Insights Time Series Model.
author: ashannon7
ms.author: dpalled
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 06/11/2019
ms.custom: seodec18
---

# Time Series Model

This document describes Time Series Models, their capabilities, and how to start building and updating your own.

> [!TIP]
>  * Navigate to the [Contoso Wind Farm demo](https://insights.timeseries.azure.com/preview/samples) environment for a live Time Series Model example.
> * Read about the [Time Series Insights Preview explorer](time-series-insights-update-explorer.md) to learn how to navigate your Time Series Model UI.

## Summary

Traditionally, the data that's collected from IoT devices lack contextual information, which makes it difficult to find and analyze sensors quickly. The main motivation for Time Series Model is to simplify finding and analyzing IoT data. It achieves this objective by enabling the curation, maintenance, and enrichment of time series data to help prepare consumer-ready datasets.

**Consider the fictitious scenario of a new smart oven by Contoso.** Each smart oven has five temperature sensors. Until recently, each Contoso temperature sensor sent, stored, and visualized its data individually:

* When customers wanted to know how hot the overall oven would get when most of the top burners were on, Contoso had more difficulty analyzing and presenting a unified answer about the overall oven.
* When Contoso's engineers wanted to verify that the top burners being run simultaneously wouldn't result in inefficient power draw, there was difficulty cross-referencing which sensors were associated with each other. Furthermore, since the data was largely derived from the sensors (and not an aggregate parent entity like the smart oven itself), determining the overall impact on power was a non-starter.
* Without the ability to structure, organize, and define the overarching smart oven Time Series Model, each temperature sensor maintained dislocated, isolated, and less informative data points. Turning these data points into actionable insights was more difficult since each data set lived independently of the others.

Time Series Models play a vital role in queries and navigation because they contextualize device and non-device entities. Data that's persisted in Time Series Model powers time-series query computations by taking advantage of the formulas stored in them.

### Key capabilities

With the goal to make it simple and effortless to manage time series contextualization, Time Series Model enables the following capabilities in Time Series Insights Preview. It helps you:

* Author and manage computations or formulas, transform data leveraging scalar functions, aggregate operations, and so on.
* Define parent-child relationships to enable navigation and reference and provide context to time series telemetry.
* Define properties that are associated with the instances part of *instance fields* and use them to create hierarchies.

### Components

Time Series Models have three core components:

* <a href="#time-series-model-instances">Time Series Model instances</a>
* <a href="#time-series-model-hierarchies">Time Series Model hierarchies</a>
* <a href="#time-series-model-types">Time Series Model types</a>

These components are combined to specify a Time Series Model and to organize your Azure Time Series Insights data.

[![Time Series Model overview](media/v2-update-tsm/tsm.png)](media/v2-update-tsm/tsm.png#lightbox)

Time Series Models can be created and managed through the [Time Series Insights Preview](time-series-insights-update-how-to-tsm.md) interface.

## Time Series Model instances

Time Series Model *instances* are the time series themselves.

In most cases, instances are uniquely identified by the **deviceId** or **assetId**.

Instances have descriptive information associated with them called *instance properties*. At a minimum, instance properties include hierarchy information. They can also include useful, descriptive data like the manufacturer, operator, or the last service date.

The [Contoso Wind Farm demo](https://insights.timeseries.azure.com/preview/samples) provides several live instance examples.

[![Time Series Model instances](media/v2-update-tsm/instance.png)](media/v2-update-tsm/instance.png#lightbox)

### Instance properties

Instances are defined by **typeId**, **timeSeriesId**, **name**, **description**, **hierarchyIds**, and **instanceFields**. Each instance maps to only one *type*, and one or more *hierarchies*.

| Property | Description |
| --- | ---|
| typeId | The UUID of the Time Series Model type the instance is associated with|
| timeSeriesId | The UUID of the time series the instance is associated with |
| name | The *name* property is optional and case-sensitive. If *name* is not available, it will default to the *timeSeriesId*. If a *name* is provided, the *timeSeriesId* will still be available in the [Well](time-series-insights-update-explorer.md#preview-well). |
| description | A text description of the instance |
| hierarchyIds | Defines which hierarchies the instance belongs to|
| instanceFields | *instanceFields* are properties of an instance and any static data that defines an instance. They define values of hierarchy or non-hierarchy properties while also supporting indexing to perform search operations. |

> [!NOTE]
> Instances inherit all properties from hierarchies, and additional **instanceFields** can be added for further instance property definition.

Instances have the following JSON representation:

```json
{
  "instances": [
        {
            "typeId": "1be09af9-f089-4d6b-9f0b-48018b5f7393",
            "timeSeriesId": [
                "Id1One",
                "Id2One",
                "Id3One"
            ],
            "name" : "timeSeries1",
            "description": "floor 100",
            "hierarchyIds": [
                "1643004c-0a84-48a5-80e5-7688c5ae9295"
            ],
            "instanceFields": {
                "state": "California",
                "city": "Los Angeles"
            }
        }
    ],
    "continuationToken": "aXsic2tpcCI6MSwidGFrZSI6MX0="
}
```

> [!TIP]
> For Time Series Insights Instance API support, consult the [Data querying](time-series-insights-update-tsq.md#time-series-model-query-tsm-q-apis) article and the [Instance API REST documentation](https://docs.microsoft.com/rest/api/time-series-insights/preview-model#instances-api).

## Time Series Model hierarchies

Time Series Model *hierarchies* organize instances by specifying property names and their relationships.

You might have a single hierarchy or multiple hierarchies. They don't need to be a current part of your data, but each instance should map to a hierarchy. A Time Series Model instance can map to a single hierarchy or multiple hierarchies.

The [Contoso Wind Farm demo](https://insights.timeseries.azure.com/preview/samples) client interface displays a standard instance and type hierarchy.

[![Time Series Model hierarchies](media/v2-update-tsm/hierarchy.png)](media/v2-update-tsm/hierarchy.png#lightbox)

### Hierarchy definition

Hierarchies are defined by hierarchy **id**, **name**, and **source**.

| Property | Description |
| ---| ---|
| id | The unique identifier for the hierarchy - used, for example, when defining an instance |
| name | A string used to provide a name for the hierarchy |
| source | Specifies the organizational hierarchy or path, which is a top-down parent-child order of the hierarchy that users want to create. The parent-child properties map *instance fields*. |

JSON response objects will conform to the following example:

```json
{
  "hierarchies": [
    {
      "id": "6e292e54-9a26-4be1-9034-607d71492707",
      "name": "Location",
      "source": {
        "instanceFieldNames": [
          "state",
          "city"
        ]
      }
    },
    {
      "id": "a28fd14c-6b98-4ab5-9301-3840f142d30e",
      "name": "ManufactureDate",
      "source": {
        "instanceFieldNames": [
          "year",
          "month"
        ]
      }
    }
  ]
}
```

Above:

* `Location` defines a hierarchy with parent `states` and child `cities`. Each `location` can have multiple `states` which in turn can have multiple `cities`.
* `ManufactureDate` defines a hierarchy with parent `year` and child `month`. Each `ManufactureDate` can have multiple `years` which in turn can have multiple `months`.

> [!TIP]
> For Time Series Insights Instance API support, consult the [Data querying](time-series-insights-update-tsq.md#time-series-model-query-tsm-q-apis) article and the [Hierarchy API REST documentation](https://docs.microsoft.com/rest/api/time-series-insights/preview-model#hierarchies-api).

### Hierarchy example

Consider an example where hierarchy **H1** has *building*, *floor*, and *room* as part of its **instanceFieldNames** definition:

```json
{
  "id": "aaaaaa-bbbbb-ccccc-ddddd-111111",
  "name": "H1",
  "source": {
    "instanceFieldNames": [
      "building",
      "floor",
      "room"
    ]
  }
}
```

Given the **instance fields** used in the above definition and several time series, the hierarchy attributes and values will appear as shown in the following table:

| Time Series ID | Instance fields |
| --- | --- |
| ID1 | “building” = “1000”, “floor” = “10”, “room” = “55”  |
| ID2 | “building” = “1000”, “room” = “55” |
| ID3 | “floor” = “10” |
| ID4 | “building” = “1000”, “floor” = “10”  |
| ID5 | None of “building”, “floor” or “room” is set |

Time Series **ID1** and **ID4** will be displayed as part of hierarchy **H1** in the [Azure Time Series Insights explorer](time-series-insights-update-explorer.md) since they have fully defined and correctly ordered *building*, *floor*, and *room* parameters.

The others will be classified under *Unparented Instances* since they don't conform to the specified data hierarchy.

## Time Series Model types

Time Series Model *types* help you define variables or formulas for doing computations. Types are associated with a specific Time Series Insights instance.

A type can have one or more variables. For example, a Time Series Model instance might be of type *Temperature Sensor*, which consists of the variables *avg temperature*, *min temperature*, and *max temperature*.

The [Contoso Wind Farm demo](https://insights.timeseries.azure.com/preview/samples) visualizes several Time Series Model types associated with their respective instances.

[![Time Series Model types](media/v2-update-tsm/types.png)](media/v2-update-tsm/types.png#lightbox)

> [!TIP]
> For Time Series Insights Instance API support, consult the [Data querying](time-series-insights-update-tsq.md#time-series-model-query-tsm-q-apis) article and the [Type API REST documentation](https://docs.microsoft.com/rest/api/time-series-insights/preview-model#types-api).

### Type properties

Time Series Model types are defined by an **id**, **name**, **description**, and **variables**.

| Property | Description |
| ---| ---|
| id | The UUID for the type |
| name | A string used to provide a name for the type |
| description | A string description for the type |
| variables | Specify variables associated with the type (see below for further information) |

A JSON type response object will take the following form:

```json
{
  "types": [
    {
      "id": "1be09af9-f089-4d6b-9f0b-48018b5f7393",
      "name": "DefaultType",
      "description": "Default type",
      "variables": {
        "EventCount": {
          "kind": "aggregate",
          "value": null,
          "filter": null,
          "aggregation": {
            "tsx": "count()"
          }
        }
      }
    }
  ]
}
```

### Variables

Time Series Insights types have variables, which are named calculations over values from the events.

Time Series Insights variable definitions contain formula and computation rules. Variable definitions include *kind*, *value*, *filter*, *reduction*, and *boundaries*.

Variables are stored in the type definition in Time Series Model and can be provided inline via [Query APIs](time-series-insights-update-tsq.md) to override the stored definition.

| Definition | Description |
| --- | ---|
| Variable kind |  *Numeric* and *Aggregate* kinds are supported |
| Variable filter | Variable filters specify an optional filter clause to restrict the number of rows being considered for computation based on conditions. |
| Variable value | Variable values are and should be used in computation. The relevant field to refer to for the data point in question. |
| Variable aggregation | The aggregate function of the variable enables part of computation. Time Series Insights supports regular aggregates (namely, *min*, *max*, *avg*, *sum*, and *count*). |

## Next steps

- See [Azure Time Series Insights Preview storage and ingress](./time-series-insights-update-storage-ingress.md).

- Learn about common Time Series Model operations in [Data modeling in Azure Time Series Insights Preview](./time-series-insights-update-how-to-tsm.md)

- Read the new [Time Series Model](https://docs.microsoft.com/rest/api/time-series-insights/preview-model) reference documentation.
