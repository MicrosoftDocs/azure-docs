```json
{
    "http": {
        "routePrefix": "api",
        "maxOutstandingRequests": 200,
        "maxConcurrentRequests": 100,
        "dynamicThrottlesEnabled": true
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|routePrefix|api|The route prefix that applies to all routes. Use an empty string to remove the default prefix. |
|maxOutstandingRequests|200*|The maximum number of outstanding requests that are held at any given time. This limit includes requests that are queued but have not started executing, as well as any in progress executions. Any incoming requests over this limit are rejected with a 429 "Too Busy" response. That allows callers to employ time-based retry strategies, and also helps you to control maximum request latencies. This only controls queuing that occurs within the script host execution path. Other queues such as the ASP.NET request queue will still be in effect and unaffected by this setting. *The default for version 1.x is unbounded. The default for version 2.x in a consumption plan is 200. The default for version 2.x in a dedicated plan is unbounded.|
|maxConcurrentRequests|100*|The maximum number of http functions that will be executed in parallel. This allows you to control concurrency, which can help manage resource utilization. For example, you might have an http function that uses a lot of system resources (memory/cpu/sockets) such that it causes issues when concurrency is too high. Or you might have a function that makes outbound requests to a third party service, and those calls need to be rate limited. In these cases, applying a throttle here can help. *The default for version 1.x is unbounded. The default for version 2.x in a consumption plan is 100. The default for version 2.x in a dedicated plan is unbounded.|
|dynamicThrottlesEnabled|true*|When enabled, this setting causes the request processing pipeline to periodically check system performance counters like connections/threads/processes/memory/cpu/etc. and if any of those counters are over a built-in high threshold (80%), requests will be rejected with a 429 "Too Busy" response until the counter(s) return to normal levels. *The default for version 1.x is false. The default for version 2.x in a consumption plan is true. The default for version 2.x in a dedicated plan is false.|
