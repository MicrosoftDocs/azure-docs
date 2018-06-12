```json
{
    "queues": {
      "maxPollingInterval": 2000,
      "visibilityTimeout" : "00:00:30",
      "batchSize": 16,
      "maxDequeueCount": 5,
      "newBatchThreshold": 8
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|maxPollingInterval|60000|The maximum interval in milliseconds between queue polls.| 
|visibilityTimeout|0|The time interval between retries when processing of a message fails.| 
|batchSize|16|The number of queue messages to retrieve and process in parallel. The maximum is 32.| 
|maxDequeueCount|5|The number of times to try processing a message before moving it to the poison queue.| 
|newBatchThreshold|batchSize/2|The threshold at which a new batch of messages are fetched.| 
