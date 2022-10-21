---
title: 'Time Series Insights Gen1 migration to Azure Data Explorer | Microsoft Docs'
description: How to migrate Azure Time Series Insights Gen 1 environments to Azure Data Explorer.
ms.service: time-series-insights
services: time-series-insights
author: tedvilutis
ms.author: tvilutis
manager: 
ms.workload: big-data
ms.topic: conceptual
ms.date: 3/15/2022
ms.custom: tvilutis
---

# Migrating Time Series Insights Gen1 to Azure Data Explorer

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

## Overview

The recommendation is to set up Azure Data Explorer cluster with a new consumer group from the Event Hub or IoT Hub and wait for retention period to pass and fill Azure Data Explorer with the same data as Time Series Insights environment.
If telemetry data is required to be exported from Time Series Insights environment, the suggestion is to use Time Series Insights Query API to download the events in batches and serialize in required format. 
For reference data, Time Series Insights Explorer or Reference Data API can be used to download reference data set and upload it into Azure Data Explorer as another table. Then, materialized views in Azure Data Explorer can be used to join reference data with telemetry data. Use materialized view with arg_max() aggregation function which will get the latest record per entity, as demonstrated in the following example. For more information about materialized views, read the following documentation: [Materialized views use cases](/azure/data-explorer/kusto/management/materialized-views/materialized-view-overview#materialized-views-use-cases).

```
.create materialized-view MVName on table T
{
    T
    | summarize arg_max(Column1,*) by Column2
}
```
## Translate Time Series Insights Queries to KQL

For queries, the recommendation is to use KQL in Azure Data Explorer.

#### Events
```TSQ
{
  "searchSpan": {
    "from": "2021-11-29T22:09:32.551Z",
    "to": "2021-12-06T22:09:32.551Z"
  },
  "predicate": {
    "predicateString": "([device_id] = 'device_0') AND ([has_error] != null OR [error_code] != null)"
  },
  "top": {
    "sort": [
      {
        "input": {
          "builtInProperty": "$ts"
        },
        "order": "Desc"
      }
    ],
    "count": 100
  }
}
```
```KQL
	events
| where _timestamp >= datetime("2021-11-29T22:09:32.551Z") and _timestamp < datetime("2021-12-06T22:09:32.551Z") and deviceid == "device_0" and (not(isnull(haserror)) or not(isempty(errorcode)))
| top 100 by _timestamp desc

```

#### Aggregates

```TSQ
{
    "searchSpan": {
      "from": "2021-12-04T22:30:00Z",
      "to": "2021-12-06T22:30:00Z"
    },
    "predicate": {
      "eq": {
        "left": {
          "property": "DeviceId",
          "type": "string"
        },
        "right": "device_0"
      }
    },
    "aggregates": [
      {
        "dimension": {
          "uniqueValues": {
            "input": {
              "property": "DeviceId",
              "type": "String"
            },
            "take": 1
          }
        },
        "aggregate": {
          "dimension": {
            "dateHistogram": {
              "input": {
                "builtInProperty": "$ts"
              },
              "breaks": {
                "size": "2d"
              }
            }
          },
          "measures": [
            {
              "count": {}
            },
            {
              "sum": {
                "input": {
                  "property": "DataValue",
                  "type": "Double"
                }
              }
            },
            {
              "min": {
                "input": {
                  "property": "DataValue",
                  "type": "Double"
                }
              }
            },
            {
              "max": {
                "input": {
                  "property": "DataValue",
                  "type": "Double"
                }
              }
            }
          ]
        }
      }
    ]
  }

```
```KQL
	let _q = events | where _timestamp >= datetime("2021-12-04T22:30:00Z") and _timestamp < datetime("2021-12-06T22:30:00Z") and deviceid == "device_0";
let _dimValues0 = _q | project deviceId | sample-distinct 1 of deviceId;
_q
| where deviceid in (_dimValues0) or isnull(deviceid)
| summarize
    _meas0 = count(),
    _meas1 = iff(isnotnull(any(datavalue)), sum(datavalue), any(datavalue)),
    _meas2 = min(datavalue),
    _meas3 = max(datavalue),
    by _dim0 = deviceid, _dim1 = bin(_timestamp, 2d)
| project
    _dim0,
    _dim1,
    _meas0,
    _meas1,
    _meas2,
    _meas3,
| sort by _dim0 nulls last, _dim1 nulls last
```

