---
title: "Tutorial: Use Univariate Anomaly Detector in Azure Data Explorer"
titleSuffix: Azure Cognitive Services
description: Learn how to use the Univariate Anomaly Detector with Azure Data Explorer.
services: cognitive-services
author: jr-MS
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: tutorial
ms.date: 12/19/2022
ms.author: mbullwin
---

# Tutorial: Use Univariate Anomaly Detector in Azure Data Explorer

## Introduction

The [Anomaly Detector API](https://docs.microsoft.com/en-us/azure/cognitive-services/anomaly-detector/overview-multivariate) enables you to check and detect abnormalities in your time series data without having to know machine learning. The Anomaly Detector API's algorithms adapt by automatically finding and applying the best-fitting models to your data, regardless of industry, scenario, or data volume. Using your time series data, the API decides boundaries for anomaly detection, expected values, and which data points are anomalies.

[Azure Data Explorer](https://docs.microsoft.com/en-us/azure/data-explorer/data-explorer-overview) is a fully managed, high-performance, big data analytics platform that makes it easy to analyze high volumes of data in near real time. The Azure Data Explorer toolbox gives you an end-to-end solution for data ingestion, query, visualization, and management.

## Anomaly Detection functions in Azure Data Explorer

### Function 1: series_uv_anomalies_fl()
The function **[series_uv_anomalies_fl()](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/functions-library/series-uv-anomalies-fl?tabs=adhoc)** detects anomalies in time series by calling the [Univariate Anomaly Detection API](https://docs.microsoft.com/en-us/azure/cognitive-services/anomaly-detector/overview), part of Azure Cognitive Services. The function accepts a limited set of time series as numerical dynamic arrays and the required anomaly detection sensitivity level. Each time series is converted into the required JSON (JavaScript Object Notation) format and posts it to the Anomaly Detector service endpoint. The service response has dynamic arrays of high/low/all anomalies, the modeled baseline time series, its normal high/low boundaries (a value above or below the high/low boundary is an anomaly) and the detected seasonality.

### Function 2: series_uv_change_points_fl()
The function **[series_uv_change_points_fl()](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/functions-library/series-uv-change-points-fl?tabs=adhoc)** finds change points in time series by calling the Univariate Anomaly Detection API, part of Azure Cognitive Services. The function accepts a limited set of time series as numerical dynamic arrays, the change point detection threshold, and the minimum size of the stable trend window. Each time series is converted into the required JSON format and posts it to the Anomaly Detector service endpoint. The service response has dynamic arrays of change points, their respective confidence, and the detected seasonality.

These two functions are user-defined [tabular functions](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/functions/user-defined-functions#tabular-function) applied using the [invoke operator](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/invokeoperator). You can either embed its code in your query (ad hoc) or you can define it as a stored function in your database (persistent).


## Where to use these new capabilities?
These two functions are available to use either in Azure Data Explorer website or in Kusto. Explorer application.  

![way to use](../media/tutorials/adx-tutorial/way-of-use.png)

## Create resources
1. [Create an ADX Cluster](https://ms.portal.azure.com/#create/Microsoft.AzureKusto) in Azure portal, after the resource is created successfully, go to the resource and create a database.
2. [Create an Anomaly Detector](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector) resource in Azure portal and check the keys and endpoints that you’ll need later.
3. Enable plugins in ADX 
    * These new functions have inline Python and require [enabling the python() plugin](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/pythonplugin#enable-the-plugin) on the cluster.
    * These new functions call the anomaly detection service endpoint and require:
        * Enable the [http_request plugin / http_request_post plugin](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/http-request-plugin) on the cluster. 
        * Modify the [callout policy](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/management/calloutpolicy) for type `webapi` to allow accessing the service endpoint.

## Code example 1: Detect anomalies in an entire way

In ADX, run the following query to make an anomaly detection chart with your onboarded data. You could also [create a function](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/functions-library/series-uv-change-points-fl?tabs=persistent) to add the code to a stored function for persistent usage. 

```kusto
let series_uv_anomalies_fl=(tbl:(*), y_series:string, sensitivity:int=85, tsid:string='_tsid') 
{ 
    let uri = '[Your-Endpoint]anomalydetector/v1.0/timeseries/entire/detect'; 
    let headers=dynamic({'Ocp-Apim-Subscription-Key': h'[Your-key]'}); 
    let kwargs = pack('y_series', y_series, 'sensitivity', sensitivity); 
    let code = ```if 1: 
        import json 
        y_series = kargs["y_series"] 
        sensitivity = kargs["sensitivity"] 
        json_str = [] 
        for i in range(len(df)): 
            row = df.iloc[i, :] 
            ts = [{'value':row[y_series][j]} for j in range(len(row[y_series]))] 
            json_data = {'series': ts, "sensitivity":sensitivity}     # auto-detect period, or we can force 'period': 84. We can also add 'maxAnomalyRatio':0.25 for maximum 25% anomalies 
            json_str = json_str + [json.dumps(json_data)] 
        result = df 
        result['json_str'] = json_str 
    ```; 
    tbl 
    | evaluate python(typeof(*, json_str:string), code, kwargs) 
    | extend _tsid = column_ifexists(tsid, 1) 
    | partition by _tsid ( 
       project json_str 
       | evaluate http_request_post(uri, headers, dynamic(null)) 
       | project period=ResponseBody.period, baseline_ama=ResponseBody.expectedValues, ad_ama=series_add(0, ResponseBody.isAnomaly), pos_ad_ama=series_add(0, ResponseBody.isPositiveAnomaly) 
       , neg_ad_ama=series_add(0, ResponseBody.isNegativeAnomaly), upper_ama=series_add(ResponseBody.expectedValues, ResponseBody.upperMargins), lower_ama=series_subtract(ResponseBody.expectedValues, ResponseBody.lowerMargins) 
       | extend _tsid=toscalar(_tsid) 
      ) 
} 
; 
let stime=datetime(2017-01-01); 
let etime=datetime(2017-03-02); 
let dt=1d; 
let ts = [Your-table] 
| make-series value=avg(value) on timestamp from stime to etime step dt 
| extend _tsid='TS1'; 
ts 
| invoke series_uv_anomalies_fl('value') 
| lookup ts on _tsid 
| render anomalychart with(xcolumn=timestamp, ycolumns=value, anomalycolumns=ad_ama) 
```
After you run the code, you'll render a chart like this:

![function1](../media/tutorials/adx-tutorial/function1.png)


## Code example 2: Detect change points when anomaly happens

In ADX, run the following query to make an anomaly detection chart with your onboarded data. You could also [create a function](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/functions-library/series-uv-change-points-fl?tabs=persistent) to add the code to a stored function for persistent usage.

```kusto
let series_uv_change_points_fl=(tbl:(*), y_series:string, score_threshold:real=0.9, trend_window:int=5, tsid:string='_tsid') 
{ 
    let uri = '[Your-Endpoint]anomalydetector/v1.0/timeseries/entire/detect'; 
    let headers=dynamic({'Ocp-Apim-Subscription-Key': h'[Your-Key]'}); 
    let kwargs = pack('y_series', y_series, 'score_threshold', score_threshold, 'trend_window', trend_window); 
    let code = ```if 1: 
        import json 
        y_series = kargs["y_series"] 
        score_threshold = kargs["score_threshold"] 
        trend_window = kargs["trend_window"] 
        json_str = [] 
        for i in range(len(df)): 
            row = df.iloc[i, :] 
            ts = [{'value':row[y_series][j]} for j in range(len(row[y_series]))] 
            json_data = {'series': ts, "threshold":score_threshold, "stableTrendWindow": trend_window}     # auto-detect period, or we can force 'period': 84 
            json_str = json_str + [json.dumps(json_data)] 
        result = df 
        result['json_str'] = json_str 
    ```; 
    tbl 
    | evaluate python(typeof(*, json_str:string), code, kwargs) 
    | extend _tsid = column_ifexists(tsid, 1) 
    | partition by _tsid ( 
       project json_str 
       | evaluate http_request_post(uri, headers, dynamic(null)) 
        | project period=ResponseBody.period, change_point=series_add(0, ResponseBody.isChangePoint), confidence=ResponseBody.confidenceScores 
        | extend _tsid=toscalar(_tsid) 
       ) 
} 
; 
let ts = range x from 1 to 300 step 1 
| extend y=iff(x between (100 .. 110) or x between (200 .. 220), 20, 5) 
| extend ts=datetime(2021-01-01)+x*1d 
| extend y=y+4*rand() 
| summarize ts=make_list(ts), y=make_list(y) 
| extend sid=1; 
ts 
| invoke series_uv_change_points_fl('y', 0.8, 10, 'sid') 
| join ts on $left._tsid == $right.sid 
| project-away _tsid 
| project-reorder y, *      //  just to visualize the anomalies on top of y series 
| render anomalychart with(xcolumn=ts, ycolumns=y, confidence, anomalycolumns=change_point) 
```

After you run the code, you'll render a chart like this:

![function2](../media/tutorials/adx-tutorial/function2.png)

## Next steps

* [Best practices of Univariate Anomaly Detection](../concepts/anomaly-detection-best-practices.md)