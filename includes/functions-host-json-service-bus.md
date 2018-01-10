```json
{
    "serviceBus": {
      "maxConcurrentCalls": 16,
      "prefetchCount": 100,
      "autoRenewTimeout": "00:05:00"
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|maxConcurrentCalls|16|The maximum number of concurrent calls to the callback that the message pump should initiate. By default, the Functions runtime processes multiple messages concurrently. To direct the runtime to process only a single queue or topic message at a time, set `maxConcurrentCalls` to 1. | 
|prefetchCount|n/a|The default PrefetchCount that will be used by the underlying MessageReceiver.| 
|autoRenewTimeout|00:05:00|The maximum duration within which the message lock will be renewed automatically.| 
