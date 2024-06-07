---
title: 'Time Series Insights Gen1 migration to to Fabric Real-Time Intelligence | Microsoft Docs'
description: How to migrate Azure Time Series Insights Gen 1 environments to to Fabric Real-Time Intelligence.
ms.service: time-series-insights
author: tedvilutis
ms.author: tvilutis
ms.topic: conceptual
ms.date: 3/15/2022
ms.custom: tvilutis
---

# Migrating Time Series Insights Gen1 to to Fabric Real-Time Intelligence

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

## Overview

[Eventhouse](/fabric/real-time-intelligence/eventhouse) is the time series database in Fabric Real-Time Intelligence. It serves as the target for migrating data away from Time Series Insights.

### Prerequisites

To begin the migration process, ensure that you have created a new Eventhouse in Fabric Real-Time Intelligence. Follow the documentation on how to [create an Eventhouse](/fabric/real-time-intelligence/create-eventhouse).

### Ingest new data

To start ingesting new data into your Eventhouse, follow these steps:

1. Configure your [Azure Event Hub](/azure/event-hubs/event-hubs-about) with a new consumer group.

2. Consume data from the data source and ingest it into your Eventhouse. Refer to the documentation on how to [ingest data from your EventHub](/fabric/real-time-intelligence/get-data-event-hub).

### Migrate historical data from Time Series Insights

If you need to export telemetry data from your Time Series Insights environment, you can use the Time Series Insights Query API to download the events in batches and serialize them in the required format. Depending on where you stored the exported data, you can ingest the data from [Azure Storage](/real-time-intelligence/get-data-azure-storage), [local files](/fabric/real-time-intelligence/get-data-local-file), or [OneLake](/fabric/real-time-intelligence/get-data-onelake).

### Migrate reference data

For migrating reference data, you can follow these steps:

1. Use Time Series Insights Explorer or the Reference Data API to download the reference data set. This will allow you to retrieve the necessary data for migration.

2. Once you have the reference data set, you can upload it into your Eventhouse as another table. This can be done using the [Upload](/fabric/real-time-intelligence/get-data-local-file) feature in Fabric Real-Time Intelligence. By uploading the reference data set, you will be able to access and utilize it within your Eventhouse environment.

Please note that these steps assume you have already created a new Eventhouse in Fabric Real-Time Intelligence as a prerequisite for the migration process.

## Translate Time Series Insights Queries to KQL

For queries, the recommendation is to use KQL in Eventhouse.

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

