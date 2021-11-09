---
title: Caching
description: To improve performance, responses can be served from a cache. By default, responses are stored for 2 minutes.
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# Caching

To improve performance, responses can be served from a cache. By default, responses are stored for 2 minutes.

## Cache headers

### Request

Cache options can be set with the `Cache-Control` header in the HTTP request, see [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control). The API supports the standard `max-age`, `no-cache`, and `no-store` directives. `max-age` specifies, in seconds, the maximum amount of time a cached response is valid for. `no-cache` and `no-store` will bypass the response cache and always query the downstream services.

### Response

If a response is returned from the cache, the `Age` header will specify the staleness of the response in seconds.

For example, the following request allows a maximum cache age of 30 seconds

```
    POST https://api.loganalytics.io/v1/workspaces/{workspace-id}/query
    Authorization: Bearer <access token>
    Cache-Control: max-age=30
    
    {
        "query" : "Heartbeat | count"
    }
```

The below response is 13 seconds stale.

```
    HTTP/1.1 200 OK
    Age: 13
    Content-Type: application/json; charset=utf-8
    
    {
        "tables": [
            {
                "name": "PrimaryResult",
                "columns": [
                    {
                        "name": "count_",
                        "type": "long"
                    }
                ],
                "rows": [
                    [
                        1939908516
                    ]
                ]
            }
        ]
    }
```
