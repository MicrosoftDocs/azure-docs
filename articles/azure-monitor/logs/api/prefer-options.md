---
title: Prefer Options
description: The API supports setting various request options using the Prefer header. This section describes how to set each preference and their values.
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# Prefer Options

The API supports setting various request options using the `Prefer` header. This section describes how to set each preference and their values.

## Visualization information

In the query language, it is possible to specify different [render options](https://docs.loganalytics.io/docs/Language-Reference/Tabular-operators/render-operator). By default, the API does not return information regarding the type of visualization to show. If your client requires this information, specify the preference

```
    Prefer: include-render=true
```

This will include a `render` property in the response that specifies the type of visualization selected by the query and any properties for that visualization.

For example, the following request specifies a visualization of barchart with title "Perf events in the last day"

```
    POST https://api.loganalytics.io/v1/workspaces/{workspace-id}/query
    Authorization: Bearer <access token>
    Prefer: include-render=true
    Content-Type: application/json
    
    {
        "query": "Perf | summarize count() by bin(TimeGenerated, 4h) | render barchart title='24H Perf events'",
        "timespan": "P1D"
    }
```

The response contains a `render` property which describes the metadata for the selected visualization.

```
    HTTP/1.1 200 OK
    Content-Type: application/json; charset=utf-8
    
    {
        "tables": [ ...query results... ],
        "render": {
            "visualization": "barchart",
            "title": "24H Perf events",
            "accumulate": false,
            "isQuerySorted": false,
            "kind": "default",
            "annotation": "",
            "by": null
        }
    }
```

## Query statistics

To get information about query statistics, specify the preference

```
    Prefer: include-statistics=true
```

This will include a `statistics` property in the response that describes various performance statistics such as query execution time and resource usage.
