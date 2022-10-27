---
title: Prefer options
description: The API supports setting some request options using the Prefer header. This section describes how to set each preference and their values.
author: AbbyMSFT
ms.author: abbyweisberg
ms.date: 11/29/2021
ms.topic: article
---
# Prefer options

The API supports setting some request options using the `Prefer` header. This section describes how to set each preference and their values.

## Visualization information

In the query language, you can specify different render options. By default, the API does not return information about the type of visualization. To include a specific visualization, include this header:

```
    Prefer: include-render=true
```

The header includes a `render` property in the response that specifies the type of visualization selected by the query and any properties for that visualization.

For example, the following request specifies a visualization of a bar chart with title "Perf events in the last day":

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

The response contains a `render` property, which describes the metadata for the selected visualization.

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

To get information about query statistics, include this header:

```
    Prefer: include-statistics=true
```

The header includes a `statistics` property in the response that describes various performance statistics such as query execution time and resource usage.
