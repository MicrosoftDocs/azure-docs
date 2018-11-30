---
title:  Time Series Query | Microsoft Docs
description: Axure Time Series Insights (preview) Time Series Query
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 11/27/2018
---

# Time Series Query

**Time Series Query** (TSQ), makes it easier to compute and retrieve Time Series data stored in Time Series Insights (TSI) at scale. TSQ leverages computational definitions to transform and retrieve data from storage. It does so from **Time Series Models** (TSM) or via inline variable definitions.

TSQ retrieves data in two different ways. TSQ can retrieve data as it is recorded from source provider, or can reduce data, or can reconstruct the signals leveraging the specified method to enable customers perform operations to transform, combine, and perform computations on time series data.

Time Series Insights Data can be accessed via the native TSI update Explorer or the Public Surface API. TSQ also offers an expression language so that you can author you own more advanced TSI queries. Below are our goals with TSQ:

![goal][1]

## Core APIs

Below are the core APIs we support.

![tsq][2]

### getModelSettings API

The getModelSettings API is used to return the automatically created model for the environments partition key.

The getModelSettings API takes the following parameters:

* *name*: The name of the model you wish to retrieve.
* *timeSeriesIdProperties*

  * *name*
  * *type*

* *defaultTypeID*

#### getModelSettings JSON request and response example

Given a GET HTTP request:

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

### getTypes API

The getTypes API returns all the Time Series types and their associated variables for the model.

The getTypes API takes the following parameters:

* *typeId*: The immutable unique identifier for the type.
* *timeSeriesId*: The **Time Series ID** is the unique key for the data within the event stream and model. This key is what TSI uses to partition the data.
* *description*: the description for the type.
* *hierarchyIds*: an array of associated hierarchyIds for the type.
* *instanceFields*:
  * *state*
  * *city*

#### getTypes JSON request and response example

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
| **interpolation**  |  Optional |
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
                    "interpolation": "None",
                    "aggregation": {"tsx": "avg($value)"}
                },
                "Count Temperature": {
                    "kind": "aggregate",
                    "filter": null,
                    "value": null,
                    "interpolation": "None",
                    "aggregation": {"tsx": "count()"}
                },
                "Min Temperature": {
                    "kind": "aggregate",
                    "filter": null,
                    "value": null,
                    "interpolation": "None",
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
                        "interpolation": "None",
                        "aggregation": {"tsx": "avg($value)"}
                    },
                    "Count Temperature": {
                        "kind": "aggregate",
                        "filter": null,
                        "value": null,
                        "interpolation": "None",
                        "aggregation": {"tsx": "count()"}
                    },
                    "Min Temperature": {
                        "kind": "aggregate",
                        "filter": null,
                        "value": null,
                        "interpolation": "None",
                        "aggregation": {"tsx": "min($event.temperature)"}
                    }
                }
            },
            "error": null
        }
    ]
}
```

### getHierarchies API

The getHierarchies API returns all of the Time Series hierarchies and all of their associated field paths.

The getHierarchies API takes the following parameters:

* *id*: the uniquely identifying key for the hierarchy.
* *name*: the name of the hierarchy
* *source*
* *instanceFields*
  * *year*
  * *month*

#### getHierarchies JSON request and response example

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

### getInstances API

The getInstances API is used to return all the Time Series Instances and all their associated instance fields.

The getInstances API takes the following parameters:

* *name*: the name associated with the instance, used for querying as well as substituting in UX.
* *typeId*: the uniquely identifying key for the type.
* *timeSeriesId*: The **Time Series ID** is the unique key for the data within the event stream and model. This key is what TSI uses to partition the data.
* *description*: the description of the instance.
* *hierarchyIds*: an array of one or more of hierarchyIds that uniquely define each hierarchy.
* *instanceFields*:
  * *state*
  * *city*

#### getInstances JSON request and response example

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

### aggregateSeries API

The aggregateSeries API enables query and retrieval of TSI data from captured events by sampling and aggregating recorded data using the aggregate or sample functions.

The aggregateSeries API takes the following parameters:

* *timeSeriesId*: The **Time Series ID** is the unique key for the data within the event stream and model. This key is what TSI uses to partition the data.
* *searchSpan*: The timespan and bucket size for this aggregate expression.
* *Filter*: Optional predicate clause.
* *Interval*: Interval at which data should be computed.
* *ProjectedVariables*: Variables that are in scope to be computed.
* *InlineVariables(optional)*: Variables definitions that we want to either override from that coming via TSM or provided inline for computation.

The getSeries API returns a TSV for each variable for each interval, based on the provided **Time Series ID** and the set of provided variables. The getSeries API achieves reduction by leveraging variables stored in TSM or provided inline to aggregate or sample data.

> [!NOTE]
> Variable interpolation is not currently supported.

Supported aggregate types:

* `Min`
* `Max`
* `Sum`
* `Count`
* `Average`

#### aggregateSeries JSON request and response example

Given a POST HTTP request:

```plaintext
https://YOUR_ENVIROMENT.env.timeseries.azure.com/timeseries/query?api-version=API_VERSION
```

| Name | Description | Example |
| --- | --- | --- |
| YOUR_ENVIRONMENT  |  The name of your environment  | `environment123` |
| API_VERSION  |  The API specification | `2018-11-01-preview` |

With JSON body:

```JSON
{
    "aggregateSeries": {
        "timeSeriesId": ["da2754af-cc51-46b3-b18f-6231f8781a12","PU.98"],
        "searchSpan": {
            "from": {"dateTime": "2016-08-01T00:00:00Z"},
            "to": {"dateTime": "2016-08-01T00:10:00Z"}
        },
        //Optional
        //If provided, Reduction should be specified in Variable Definition
        "interval": "PT1M",
        "filter": null, //Optional
        "projectedVariables": [
            "Count",
            "Average Temperature",
            "Min Temperature"
        ],
        "inlineVariables": {
            "Average Temperature": {
                "kind": "numeric",
                "filter": null,
                "value": { "tsx": "$event.temperature.Double" },
                "interpolation": "None",
                "aggregation": {"tsx": "avg($value)"}
            },
            //Default Type Count Experience
            "Count": {
                "kind": "aggregate",
                "filter": null,
                "value": null,
                "interpolation": "None",
                "aggregation": {"tsx": "count()"}
            },
            "Min Temperature": {
                "kind": "aggregate",
                "filter": null,
                "value": null,
                "interpolation": "None",
                "aggregation": {"tsx": "min($event.temperature)"}
            },
        }
    }
}
```

Response:

```JSON
{
    "timestamps": [ "2016-08-01T00:00:00Z","2016-08-01T00:01:00Z","2016-08-01T00:02:00Z","2016-08-01T00:03:00Z","2016-08-01T00:04:00Z",
        "2016-08-01T00:05:00Z","2016-08-01T00:06:00Z","2016-08-01T00:07:00Z","2016-08-01T00:08:00Z","2016-08-01T00:09:00Z" ],
    "properties": [
        {
            "name": "Average Temperature",
            "type": "Double",
            "values": [ 68.699982037970059,68.889287593526234,69.089287593526919,69.28928759352759,69.489287593528246,69.689287593528917,69.8892875935296,70.089287593530273,70.289287593530929,70.4892875935316]
        },
        {
            "name": "Count Temperature",
            "type": "Double",
            "values": [ 60.0,60.0,60.0,60.0,60.0,60.0,60.0,60.0,60.0,60.0 ]
        },
        {
            "name": "Min Temperature",
            "type": "Double",
            "values": [ 68.645954260192127,68.790954260192578,68.990954260193249,69.190954260193919,69.39095426019459,69.590954260195261,69.790954260195932,69.9909542601966,70.190954260197273,70.390954260197944 ]
        }
    ]
}
```

### getSeries API

The getSeries API enables query and retrieval of TSI data from captured events by leveraging data recorded on the wire using the variables define in model or provided inline.

> [!Note]
> If interpolation and aggregation clause is provided in variable, or interval is specified, it will be ignored.

The getSeries API takes the following parameters:

* *timeSeriesId*: The **Time Series ID** is the unique key for the data within the event stream and model. This key is what TSI uses to partition the data.
* *searchSpan*: The timespan and bucket size for this aggregate expression.
* *Filter*: Optional predicate clause.
* *ProjectedVariables*: Variables that are in scope to be computed.
* *InlineVariables(optional)*: Variables definitions that we want to either override from that coming via TSM or provided inline for computation.

The getSeries API returns a TSV for each variable, based on the provided **Time Series ID** and the set of provided variables. The getSeries API achieves does not support intervals or variable reduction/interpolation.  

#### getSeries JSON request and response example

Given a POST HTTP request:

```plaintext
https://YOUR_ENVIROMENT.env.timeseries.azure.com/timeseries/query?api-version=API_VERSION
```

| Name | Description | Example |
| --- | --- | --- |
| YOUR_ENVIRONMENT  |  The name of your environment  | `environment123` |
| API_VERSION  |  The API specification | `2018-11-01-preview` |

With JSON body:

```JSON
{
    "getSeries": {
        "timeSeriesId": ["da2754af-cc51-46b3-b18f-6231f8781a12","PU.98"],
        "searchSpan": {
            "from": {"dateTime": "2016-08-01T00:00:00Z"},
            "to": {"dateTime": "2016-08-01T00:10:00Z"}
        },
        "interval": null, //Null or not specified
        "filter": null, //Optional
        "projectedVariables": [
            "Temperature",
            "Pressure",
        ],
        "inlineVariables": {
            "Temperature": {
                "kind": "numeric",
                "filter": null,
                "value": { "tsx": "$event.temperature.Double" },
                "interpolation": "None", // null, not specified or ignored if specified
                "aggregation": {"tsx": "avg($value)"} //null, not specified or ignored if specified
            },
            "Pressure": {
                "kind": "numeric",
                "filter": null,
                "value": { "tsx": "$event.pressure.Double" },
                "interpolation": "None", // null, not specified or ignored if specified
                "aggregation": {"tsx": "avg($value)"} //null, not specified or ignored if specified
            }
        }
    }
}
```

Response:

```JSON
{
    "timestamps": [ "2016-08-01T00:00:00Z","2016-08-01T00:01:00Z","2016-08-01T00:02:00Z","2016-08-01T00:03:00Z","2016-08-01T00:04:00Z",
        "2016-08-01T00:05:00Z","2016-08-01T00:06:00Z","2016-08-01T00:07:00Z","2016-08-01T00:08:00Z","2016-08-01T00:09:00Z" ],
    "properties": [
        {
            "name": "Temperature",
            "type": "Double",
            "values": [ 68.699982037970059,68.889287593526234,69.089287593526919,69.28928759352759,69.489287593528246,69.689287593528917,69.8892875935296,70.089287593530273,70.289287593530929,70.4892875935316 ]
        },
        {
            "name": "Pressure",
            "type": "Double",
            "values": [ 68.645954260192127,68.790954260192578,68.990954260193249,69.190954260193919,69.39095426019459,69.590954260195261,69.790954260195932,69.9909542601966,70.190954260197273,70.390954260197944 ]
        }
    ]
}
```

### getEvents API

The getEvents API enables query and retrieval of TSI data from events as they are recorded in Time Series Insights from the source provider.

The getEvents API takes the following parameters:

* *timeSeriesId*: The **Time Series ID** is the unique key for the data within the event stream and model. This key is what TSI uses to partition the data.
* *searchSpan*: the timespan and bucket size for this aggregate expression.
* *filter*: Allows you to specify predicate values to filter your queries however you desire.
* *projectedProperties (optional)*: Allows column/properties filtering.

The getEvents API returns raw values from captured events as stored in TSI for a given **Time Series ID** and time range. It does not require variable definitions (neither TSM nor variable definitions are used).

### getEvents JSON request and response example

Given a POST HTTP request:

```plaintext
https://YOUR_ENVIROMENT.env.timeseries.azure.com/timeseries/query?api-version=API_VERSION
```

| Name | Description | Example |
| --- | --- | --- |
| YOUR_ENVIRONMENT  |  The name of your environment  | `environment123` |
| API_VERSION  |  The API specification | `2018-11-01-preview` |

With JSON body:

```JSON
{
    "getEvents": {
        // Required and Supports 3 Key as tsId
        "timeSeriesId": [
            "PU.123","W00158","ABN.9890"
        ],
        // Required.
        "searchSpan": {
            "from": "2018-08-01T17:01:00Z",
            "to": "2018-08-20T17:01:00Z",
        },
        // Optional.
        "filter": {
            "tsx": "($event.Value != null) OR ($event.Status.String == 'Good')"
        },
        // Optional – array of simple TSXs that refer exactly one property
        // If not specified, we will return all the properties.
        "projectedProperties": [ 
            {"propertyName" : "Volts", "type": "double" } 
        ]
    }
}
```

Response:

```JSON
{
    "timestamps": [ "2016-08-01T00:00:00Z","2016-08-01T00:01:03Z","2016-08-01T00:02:05Z","2016-08-01T00:03:00Z",
        "2016-08-01T00:04:00Z","2016-08-01T00:05:05Z","2016-08-01T00:06:00Z","2016-08-01T00:07:08Z",
        "2016-08-01T00:08:00Z","2016-08-01T00:09:00Z" ],
    "properties": [
        {
            "name": "Volts",
            "type": "Double",
            "values": [ 68.699982037970059,68.889287593526234,69.089287593526919,69.28928759352759,69.489287593528246,69.689287593528917,69.8892875935296,70.089287593530273,70.289287593530929,70.4892875935316 ]
        }
    ]
}
```

### Supported query operators

Filtering:

* `HAS`
* `IN`
* `AND`
* `AND NOT`
* `OR`
* `>`
* `<`
* `<=`
* `>=`
* `!=`
* `<>`
* `/`
* `*`

Temporal:

* `From`
* `To`
* `First/Last` (API only)

Aggregation/Transformation:

* `MEASURE`
* `SUM` (of a measure)
* `COUNT` (events)
* `AVG` (of a measure)
* `MIN` (of a measure)
* `MAX` (of a measure)`
* `GROUP BY` (categorical column)
* `ORDER BY ASC, DSC` (relative to timestamp)
* `DateHistogram` (bucket size)

## TSQ API limits

> [!NOTE]
> The table below specifies the limits as of **11/20/18**.

| Parameter	| Limits |
| --- | --- |
| TSQ Request Size | 32 KB |
| TSQ Response Limit | 16 MB |
| TSQ Parallel Query Limit | 20 per environment |
| Get Events | 16 MB size or 30s time |
| Token validity | 1 hour |
| Get Series | 500,000 intervals or timestamps, or 16 MB size |
| Min | Interval limit 1 ms |
| Max | 50 projected variables |
| Aggregate Series | 500,000 intervals or timestamps, or 16 MB size |
| Min | Interval limit 1 ms |
| Max | 50 projected variables |

## Time Series Query tutorial

A full TSQ tutorial will be provided in the future.

[!INCLUDE [tsi-update-docs](../../includes/time-series-insights-update-documents.md)]

## Next steps

Read the [Azure TSI (preview) Storage and Ingress](./time-series-insights-update-storage-ingress.md).

Read about the new [Time Series Model](./time-series-insights-update-tsm.md).

<!-- Images -->
[1]: media/v2-update-tsq/goal.png
[2]: media/v2-update-tsq/tsq.png
