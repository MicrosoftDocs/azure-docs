---
title: 'Time Series Model in Azure Time Series Insights Preview | Microsoft Docs'
description: Understanding Azure Time Series Insights Time Series Model.
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 10/21/2019
ms.custom: seodec18
---

# Time Series Model

This document describes Time Series Model, their capabilities, and how to start building and updating your own in Time Series Insights environment.

> [!TIP]
>  * Navigate to the [Contoso Wind Farm demo](https://insights.timeseries.azure.com/preview/samples) environment for a live Time Series Model example.
> * Read about the [Time Series Insights Preview explorer](time-series-insights-update-explorer.md) to learn how to navigate your Time Series Model UI.

## Summary

Traditionally, the data that's collected from IoT devices lack contextual information, which makes it difficult to find and analyze sensors quickly. The main motivation for Time Series Model is to simplify finding and analyzing IoT/Time Series data. It achieves this objective by enabling the curation, maintenance, and enrichment of time series data to help prepare consumer-ready datasets for analytics.

## Scenario: Contoso's new smart oven

**Consider the fictitious scenario of a new Contoso smart oven.** In this scenario, suppose that each Contoso smart oven has five temperature sensors, one for each of four top burners and one for the oven itself. Until recently, each Contoso temperature sensor sent, stored, and visualized its data individually. For its kitchen appliance monitoring, Contoso relied on basic charts, one for each individual sensor.

While Contoso was satisfied with their initial data and visualization solution, several limitations became apparent:

* Customers wanted to know how hot the overall oven would get when most of the top burners were on, and Contoso had more difficulty analyzing and presenting a unified answer about the conditions of the overall oven.
* Contoso engineers wanted to verify that the top burners being run simultaneously wouldn't result in inefficient power draw, and there was difficulty cross-referencing which temperature and voltage sensors were associated with each other and how to locate them in the store.
* Contoso quality assurance team wanted to audit and compare the history between two sensor versions, and there was difficulty determining what data belonged to which sensor version.

Without the ability to structure, organize, and define the overarching smart oven Time Series Model, each temperature sensor maintained dislocated, isolated, and less informative data points. Turning these data points into actionable insights was more difficult since each data set lived independently of the others.

These limitations revealed the importance of smart data aggregation and visualization tools to accompany Contoso's new oven:

* Data visualization proves useful when you're able to associate and combine data into a convenient view. For example, showing voltage sensors along with temperature sensors.
* Managing multi-dimensional data for several entities along with comparison, zooming, and time range functionalities can be difficult to accomplish.

**Time Series Model provides a convenient solution** for many of the scenarios encountered in the fictitious example above:

[![Time Series Model charting](media/v2-update-tsm/tsi-charting.png)](media/v2-update-tsm/tsi-charting.png#lightbox)

* Time Series Model plays a vital role in queries and navigation because it contextualizes data by allowing comparisons to be drawn across time ranges and between sensor and device kinds.
* Data is further contextualized because data persisted in a Time Series Model preserves time series query computations as variables, and use these at query time.
* Time Series Model organize and aggregate data for improved visualization and management capabilities.

### Key capabilities

With the goal to make it simple and effortless to manage time series contextualization, Time Series Model enables the following capabilities in Time Series Insights Preview. It helps you:

* Author and manage computations or formulas leveraging scalar functions, aggregate operations, and so on.
* Define parent-child relationships to enable navigation, search, and reference.
* Define properties that are associated with the instances, defined as *instance fields* and use them to create hierarchies.

### Components

Time Series Model have three core components:

* [Time Series Model instances](#time-series-model-instances)
* [Time Series Model hierarchies](#time-series-model-hierarchies)
* [Time Series Model types](#time-series-model-types)

These components are combined to specify a Time Series Model and to organize your Azure Time Series Insights data.

[![Time Series Model overview](media/v2-update-tsm/tsm.png)](media/v2-update-tsm/tsm.png#lightbox)

Time Series Model can be created and managed through the [Time Series Insights Preview](time-series-insights-update-how-to-tsm.md) interface. Time Series Model settings can be managed through the [Model Settings API](https://docs.microsoft.com/rest/api/time-series-insights/preview-model#model-settings-api).

## Time Series Model instances

Time Series Model *instances* are virtual representations of the time series themselves.

In most cases, instances are uniquely identified by the **deviceId** or **assetId**, these are saved as time series IDs.

Instances have descriptive information associated with them called *instance properties* such as a time series ID, type, name, description, hierarchies, and instance fields. At a minimum, instance properties include hierarchy information.

Instance fields are a collection of descriptive information that can include values for hierarchy levels, as well as manufacturer, operator, etc.

Once a event source is configured for Time Series Insights environment, instances are automatically discovered and created in Time Series Model. The instances can be created or updated via Time Series Insights Explorer using Time Series Model - Queries.

The [Contoso Wind Farm demo](https://insights.timeseries.azure.com/preview/samples) provides several live instance examples.

[![Time Series Model instances](media/v2-update-tsm/instance.png)](media/v2-update-tsm/instance.png#lightbox)

### Instance properties

Instances are defined by **timeSeriesId**, **typeId**, **name**, **description**, **hierarchyIds**, and **instanceFields**. Each instance maps to only one *type*, and one or more *hierarchies*.

| Property | Description |
| --- | ---|
| timeSeriesId | The UUID of the time series the instance is associated with. |
| typeId | The UUID of the Time Series Model type the instance is associated with. By default all discovered new instances get associated to a default type|
| name | The *name* property is optional and case-sensitive. If *name* is not available, it will default to the *timeSeriesId*. If a *name* is provided, the *timeSeriesId* will still be available in the [Well](time-series-insights-update-explorer.md#preview-well). |
| description | A text description of the instance. |
| hierarchyIds | Defines which hierarchies the instance belongs to. |
| instanceFields | *instanceFields* are properties of an instance and any static data that defines an instance. They define values of hierarchy or non-hierarchy properties while also supporting indexing to perform search operations. |

> [!NOTE]
> Hierarchies are built using **instance fields**, and additional **instanceFields** can be added for further instance property definition.

Instances have the following JSON representation:

```JSON
{
    "timeSeriesId": ["PU2"],
    "typeId": "545314a5-7166-4b90-abb9-fd93966fa39b",
    "hierarchyIds": ["95f0a8d1-a3ef-4549-b4b3-f138856b3a12"],
    "description": "Pump #2",
    "instanceFields": {
        "Location": "Redmond",
        "Fleet": "Fleet 5",
        "Unit": "Pump Unit 3",
        "Manufacturer": "Contoso",
        "ScalePres": "0.54",
        "scaleTemp": "0.54"
    }
}
```

> [!TIP]
> For Time Series Insights Instance API and CRUD support, consult the [Data querying](time-series-insights-update-tsq.md#time-series-model-query-tsm-q-apis) article and the [Instance API REST documentation](https://docs.microsoft.com/rest/api/time-series-insights/preview-model#instances-api).

## Time Series Model hierarchies

Time Series Model *hierarchies* organize instances by specifying property names and their relationships.

You can configure multiple hierarchies in a given Time Series Insights environment. A Time Series Model instance can map to a single hierarchy or multiple hierarchies (many-to-many relationship).

The [Contoso Wind Farm demo](https://insights.timeseries.azure.com/preview/samples) client interface displays a standard instance and type hierarchy.

[![Time Series Model hierarchies](media/v2-update-tsm/hierarchy.png)](media/v2-update-tsm/hierarchy.png#lightbox)

### Hierarchy definition

Hierarchies are defined by hierarchy **id**, **name**, and **source**.

| Property | Description |
| ---| ---|
| id | The unique identifier for the hierarchy - used, for example, when defining an instance. |
| name | A string used to provide a name for the hierarchy. |
| source | Specifies the organizational hierarchy or path, which is a top-down parent-child order of the hierarchy that users want to create. The parent-child properties map *instance fields*. |

Hierarchies are represented in JSON as:

```JSON
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
> For Time Series Insights Instance API and CRUD support, consult the [Data querying](time-series-insights-update-tsq.md#time-series-model-query-tsm-q-apis) article and the [Hierarchy API REST documentation](https://docs.microsoft.com/rest/api/time-series-insights/preview-model#hierarchies-api).

### Hierarchy example

Consider an example where hierarchy **H1** has *building*, *floor*, and *room* as part of its **instanceFieldNames** definition:

```JSON
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
| ID5 | None of “building”, “floor”, or “room” is set |

Time Series **ID1** and **ID4** will be displayed as part of hierarchy **H1** in the [Azure Time Series Insights explorer](time-series-insights-update-explorer.md) since they have fully defined and correctly ordered *building*, *floor*, and *room* parameters.

The others will be classified under *Unparented Instances* since they don't conform to the specified data hierarchy.

## Time Series Model types

Time Series Model *types* help you define variables or formulas for doing computations. Types are associated with a specific Time Series Insights instance.

A type can have one or more variables. For example, a Time Series Model instance might be of type *Temperature Sensor*, which consists of the variables *avg temperature*, *min temperature*, and *max temperature*.

The [Contoso Wind Farm demo](https://insights.timeseries.azure.com/preview/samples) visualizes several Time Series Model types associated with their respective instances.

[![Time Series Model types](media/v2-update-tsm/types.png)](media/v2-update-tsm/types.png#lightbox)

> [!TIP]
> For Time Series Insights Instance API and CRUD support, consult the [Data querying](time-series-insights-update-tsq.md#time-series-model-query-tsm-q-apis) article and the [Type API REST documentation](https://docs.microsoft.com/rest/api/time-series-insights/preview-model#types-api).

### Type properties

Time Series Model types are defined by an **id**, **name**, **description**, and **variables**.

| Property | Description |
| ---| ---|
| id | The UUID for the type. |
| name | A string used to provide a name for the type. |
| description | A string description for the type. |
| variables | Specify variables associated with the type. |

Types will conform to the following JSON example:

```JSON
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
        },
        "Interpolated Speed": {
          "kind": "numeric",
          "value": {
              "tsx": "$event.[speed].Double"
          },
          "filter": null,
          "interpolation": {
              "kind": "step",
              "boundary": {
                  "span": "P1D"
              }
          },
          "aggregation": {
              "tsx": "left($value)"
          }
        }
      }
    }
  ]
}
```

### Variables

Time Series Insights types may have many variables that specify formula and computation rules on events.

Each variable can be one of three *kinds*: *numeric*, *categorical*, and *aggregate*.

* *Numeric* kinds work with continuous values. 
* *Categorical* kinds work with a defined set of discrete values.
* *Aggregate* values combine multiple variables of single kind (either all *numeric* or all *categorical*).

The table below displays which properties are relevant for each variable kind.

[![Time Series Model types](media/v2-update-tsm/variable-table.png)](media/v2-update-tsm/variable-table.png#lightbox)

#### Numeric Variables

| Variable Property | Description |
| --- | ---|
| Variable filter | Filters are optional conditional clauses to restrict the number of rows being considered for computation. |
| Variable value | Telemetry values used for computation coming from the device/sensors or transformed using Time Series Expressions. Numeric kind variables must be of type *Double*.|
| Variable interpolation | Interpolation specifies how to reconstruct a signal using existing data. *Step* and *Linear* interpolation options are available for Numeric variables. |
| Variable aggregation | Support computation through *Avg*, *Min*, *Max*, *Sum*, *Count*, *First*, *Last* and time-weighted (*Avg*, *Min*, *Max*, *Sum*, *Left*) operators. |

Variables conform to the following JSON example:

```JSON
"Interpolated Speed": {
  "kind": "numeric",
  "value": {
    "tsx": "$event.[speed].Double"
  },
  "filter": null,
  "interpolation": {
    "kind": "step",
    "boundary": {
      "span": "P1D"
    }
  },
  "aggregation": {
    "tsx": "left($value)"
  }
}
```

#### Categorical Variables

| Variable Property | Description |
| --- | ---|
| Variable filter | Filters are optional conditional clauses to restrict the number of rows being considered for computation. |
| Variable value | Telemetry values used for computation coming from the device/sensors. Categorical kind variables must be either *Long* or *String*. |
| Variable interpolation | Interpolation specifies how to reconstruct a signal using existing data. *Step* interpolation option is available for Categorical variables. |
| Variable categories | Categories create a mapping between the values coming from the device/sensors to a label. |
| Variable default category | The default category is for all values that are not being mapped in the "categories" property. |

Variables conform to the following JSON example:

```JSON
"Status": {
  "kind": "categorical",
  "value": "toLong($event.[Status].Double)",
  "interpolation": {
    "kind": "step",
    "boundary": {
      "span" : "PT1M"
    }
  },
  "categories": [
    {
      "values": [0, 1, 2, 3],
      "label": "Good"
    },
    {
      "values": [3],
      "label": "Bad"
    }
  ],
  "defaultCategory": {
    "label": "Not Applicable"
  }
}
```

#### Aggregate Variables

| Variable Property | Description |
| --- | ---|
| Variable filter | Filters are optional conditional clauses to restrict the number of rows being considered for computation. |
| Variable aggregation | Support computation through *Avg*, *Min*, *Max*, *Sum*, *Count*, *First*, *Last*. |

Variables conform to the following JSON example:

```JSON
"Aggregate Speed": {
  "kind": "aggregate",
  "filter": null,
  "aggregation": {
    "tsx": "avg($event.Speed.Double)"
  }
}
```

Variables are stored in the type definition of a Time Series Model and can be provided inline via [Query APIs](time-series-insights-update-tsq.md) to override the stored definition.

## Next steps

- See [Azure Time Series Insights Preview storage and ingress](./time-series-insights-update-storage-ingress.md).

- Learn about common Time Series Model operations in [Data modeling in Azure Time Series Insights Preview](./time-series-insights-update-how-to-tsm.md)

- Read the new [Time Series Model](https://docs.microsoft.com/rest/api/time-series-insights/preview-model) reference documentation.
