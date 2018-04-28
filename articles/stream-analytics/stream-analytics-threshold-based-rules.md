---
title:  Process configurable threshold based rules in Azure Stream Analytics
description: This article describes how to use reference data to achieve an alerting solution that has configurable threshold based rules in Azure Stream Analytics.
services: stream-analytics
author: su-jie
ms.author: sujie
manager: kfile
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 04/27/2018
--- 
# Process configurable threshold based rules in Azure Stream Analytics
This article describes how to use reference data to achieve an alerting solution that uses configurable threshold based rules in Azure Stream Analytics.

## Scenario: Alerting based on adjustable rule thresholds
You may need to produce an alert as output when an incoming streamed events have reached a certain value, or when an aggregated value based on the incoming streamed events exceeds a certain threshold. While it simple to set up a Stream Analytics query that compared value to a static threshold that is fixed and predetermined, since the threshold can be hard coded into the streaming query syntax using static greater than, less than, and equality comparisons.

In some cases, the threshold values need to be easily configurable without editing the query syntax each time that a threshold value changes. In other cases you may need numerous devices or users processed by the same query with each of them having a different threshold values on each kind of device. 

This pattern can be used to dynamically configure thresholds, selectively choose which kind of device the threshold applies by filtering the input data, and selectively choose which fields to include in the output.

## Recommended design pattern
Use a reference data input to you Stream Analytics job as a lookup of the alert thresholds:
- Store the threshold values in the reference data, one value per key.
- Join the streaming data input events to the reference data on the key column.
- Use the keyed value from the reference data as the threshold value.

## Example data and query
In the example, alerts are generated when the aggregate of data streaming in from devices in a minute-long window matches the stipulated values in the rule supplied as reference data.

In the query, for each deviceId, and each metricName under the deviceId, you can configure from 0 to 5 dimensions to GROUP BY. Only the events having the corresponding filter values are grouped. Once grouped, windowed aggregates of Min, Max, Avg, are calculated over a 60 second tumbling window. Filters on the aggregated values are then calculated as per the configured threshold in the reference, to generate the alert output event.

As an example, assume there is a Stream Analytics job that has a reference data input named **rules**, and streaming data input named **metrics**. 

## Reference data
This example reference data shows how a threshold based rule could be represented. A JSON file holds the reference data and is saved into Azure blob storage, and that blob storage container is used as a reference data input named **rules**. You could overwrite this JSON file and replace the rule configuration as time goes on, without stopping or starting the streaming job.

- The example rule is used to represent an adjustable alert when CPU exceeds (average is greater than or equal to) the value `90` percent. 
- Notice the rule has an **operator** value which is dynamically interpreted in the query syntax later on `AVGGREATEROREQUAL`.  
- Not all columns are included in the output alert event. In this case `includedDim` number 2 is turned on `TRUE` to represent that that field numer 2 of data in the stream will be included in the output event. 
- The alert rule filters the input streaming data on a certain dimension ordinal `2` with value `C1`.

```json
{
    "ruleId": 1234, 
    "deviceId" : "978648", 
    "metricName": "CPU", 
    "alertName": "hot node AVG CPU over 90",
    "operator" : "AVGGREATEROREQUAL",
    "value": 90, 
    "includeDim": {
        "0": "FALSE", 
        "1": "FALSE", 
        "2": "TRUE", 
        "3": "FALSE", 
        "4": "FALSE"
    },
    "filter": {
        "0": "", 
        "1": "",
        "2": "C1", 
        "3": "", 
        "4": ""
    }    
}
```

## Example streaming query
This example Stream Analytics query joins the **rules** reference data from the example above, to an input stream of data named **metrics**.

```sql
WITH transformedInput AS
(
    SELECT
        dim0 = CASE rules.includeDim.[0] WHEN 'TRUE' THEN metrics.custom.dimensions.[0].value ELSE NULL END,
        dim1 = CASE rules.includeDim.[1] WHEN 'TRUE' THEN metrics.custom.dimensions.[1].value ELSE NULL END,
        dim2 = CASE rules.includeDim.[2] WHEN 'TRUE' THEN metrics.custom.dimensions.[2].value ELSE NULL END,
        dim3 = CASE rules.includeDim.[3] WHEN 'TRUE' THEN metrics.custom.dimensions.[3].value ELSE NULL END,
        dim4 = CASE rules.includeDim.[4] WHEN 'TRUE' THEN metrics.custom.dimensions.[4].value ELSE NULL END,
        metric = metrics.metric.value,
        metricName = metrics.metric.name,
        deviceId = rules.deviceId, 
        ruleId = rules.ruleId, 
        alertName = rules.alertName,
        ruleOperator = rules.operator, 
        ruleValue = rules.value
    FROM 
        metrics
        timestamp by eventTime
    JOIN 
        rules
        ON metrics.deviceId = rules.deviceId AND metrics.metric.name = rules.metricName
    WHERE
        (rules.filter.[0] = '' OR metrics.custom.filters.[0].value = rules.filter.[0]) AND 
        (rules.filter.[1] = '' OR metrics.custom.filters.[1].value = rules.filter.[1]) AND
        (rules.filter.[2] = '' OR metrics.custom.filters.[2].value = rules.filter.[2]) AND
        (rules.filter.[3] = '' OR metrics.custom.filters.[3].value = rules.filter.[3]) AND
        (rules.filter.[4] = '' OR metrics.custom.filters.[4].value = rules.filter.[4])
)

SELECT
    System.Timestamp as time, 
    transformedInput.deviceId as deviceId,
    transformedInput.ruleId as ruleId,
    transformedInput.metricName as metric,
    transformedInput.alertName as alert,
    AVG(metric) as avg,
    MIN(metric) as min, 
    MAX(metric) as max, 
    dim0, dim1, dim2, dim3, dim4
FROM
    transformedInput
GROUP BY
    transformedInput.deviceId,
    transformedInput.ruleId,
    transformedInput.metricName,
    transformedInput.alertName,
    dim0, dim1, dim2, dim3, dim4,
    ruleOperator, 
    ruleValue, 
    TumblingWindow(second, 60)
HAVING
    (
        (ruleOperator = 'AVGGREATEROREQUAL' AND avg(metric) >= ruleValue) OR
        (ruleOperator = 'AVGEQUALORLESS' AND avg(metric) <= ruleValue) 
    )
```

## Example streaming input event data
This example JSON data represents the **metrics** input data that is used in the above streaming query. Three example events are listed within the same 1 minute timespan `T14:50`. 

- There are 3 events represented in this example. All for `deviceId` value `978648`.
- The CPU metric value are `98`, `95`, `80` in each event respectively. Only the first two event exceed the CPU alert rule established.
- The includeDim field in the alert rule was number 2. The corresponding data in these event is the field named `NodeName`. The following three example events have values `N024`, `N024`, and `N014` respectively. In the output, you see only the node `N024` hits the alert criteria for high CPU. `N014` does not meet the high CPU threshold.
- The alert rule is configured to filter data on ordinal 2, which is `cluster` field. The following three example events all have value `C1` and match the filter critera.

```json
{
    "eventTime": "2017-03-08T14:50:23.1324132Z",
    "deviceId": "978648",
    "custom": {
        "dimensions": {
            "0": {
                "name": "NodeType",
                "value": "N1"
            },
            "1": {
                "name": "Cluster",
                "value": "C1"
            },
            "2": {
                "name": "NodeName",
                "value": "N024"
            }
        },
        "filters": {
            "0": {
                "name": "application",
                "value": "A1"
            },
            "1": {
                "name": "deviceType",
                "value": "T1"
            },
            "2": {
                "name": "cluster",
                "value": "C1"
            },
            "3": {
                "name": "nodeType",
                "value": "N1"
            }
        }
    },
    "metric": {
        "name": "CPU",
        "value": 98,
        "count": 1.0,
        "min": 98,
        "max": 98,
        "stdDev": 0.0
    }
}
{
    "eventTime": "2015-03-08T14:50:24.1324138Z",
    "deviceId": "978648",
    "custom": {
        "dimensions": {
            "0": {
                "name": "NodeType",
                "value": "N2"
            },
            "1": {
                "name": "Cluster",
                "value": "C1"
            },
            "2": {
                "name": "NodeName",
                "value": "N024"
            }
        },
        "filters": {
            "0": {
                "name": "application",
                "value": "A1"
            },
            "1": {
                "name": "deviceType",
                "value": "T1"
            },
            "2": {
                "name": "cluster",
                "value": "C1"
            },
            "3": {
                "name": "nodeType",
                "value": "N2"
            }
        }
    },
    "metric": {
        "name": "CPU",
        "value": 95,
        "count": 1,
        "min": 95,
        "max": 95,
        "stdDev": 0
    }
}
{
    "eventTime": "2015-03-08T14:50:37.1324130Z",
    "deviceId": "978648",
    "custom": {
        "dimensions": {
            "0": {
                "name": "NodeType",
                "value": "N3"
            },
            "1": {
                "name": "Cluster",
                "value": "C1 "
            },
            "2": {
                "name": "NodeName",
                "value": "N014"
            }
        },
        "filters": {
            "0": {
                "name": "application",
                "value": "A1"
            },
            "1": {
                "name": "deviceType",
                "value": "T1"
            },
            "2": {
                "name": "cluster",
                "value": "C1"
            },
            "3": {
                "name": "nodeType",
                "value": "N3"
            }
        }
    },
    "metric": {
        "name": "CPU",
        "value": 80,
        "count": 1,
        "min": 80,
        "max": 80,
        "stdDev": 0
    }
}
```

## Example output
This example output JSON data shows a single alert event was produced based on the CPU threshold rule defined in the reference data. The output event contains the name of the alert as well as the aggregated (average, min, max) of the fields considered. The output event data includes dimension number 2 `NodeName` value `N024` due to the rule configuration.

```JSON
{"time":"2017-01-15T02:03:00.0000000Z","deviceid":"978648","ruleid":1234,"metric":"CPU","alert":"hot node AVG CPU over 90","avg":98.0,"min":98.0,"max":98.0,"dim0":null,"dim1":null,"dim2":"N024","dim3":null,"dim4":null}
```