```json
{
    "http": {
        "routePrefix": "api",
        "maxOutstandingRequests": 20,
        "maxConcurrentRequests": 10,
        "dynamicThrottlesEnabled": false
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|routePrefix|api|The route prefix that applies to all routes. Use an empty string to remove the default prefix. |
|maxOutstandingRequests|-1|The maximum number of outstanding requests that will be held at any given time (-1 means unbounded). The limit includes requests that are queued but have not started executing, as well as any in-progress executions. Any incoming requests over this limit are rejected with a 429 "Too Busy" response. Callers can use that response to employ time-based retry strategies. This setting controls only queuing that occurs within the job host execution path. Other queues, such as the ASP.NET request queue, are unaffected by this setting. |
|maxConcurrentRequests|-1|The maximum number of HTTP functions that will be executed in parallel (-1 means unbounded). For example, you could set a limit if your HTTP functions use too many system resources when concurrency is high. Or if your functions make outbound requests to a third-party service, those calls might need to be rate-limited.|
|dynamicThrottlesEnabled|false|Causes the request processing pipeline to periodically check system performance counters. Counters include connections, threads, processes, memory, and cpu. If any of the counters are over a built-in threshold (80%), requests are rejected with a 429 "Too Busy" response until the counter(s) return to normal levels.|
