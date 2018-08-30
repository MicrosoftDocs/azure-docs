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
|batchSize|16|The number of queue messages that the Functions runtime retrieves simultaneously and processes in parallel. When the number being processed gets down to the `newBatchThreshold`, the runtime gets another batch and starts processing those messages. So the maximum number of concurrent messages being processed per function is `batchSize` plus `newBatchThreshold`. This limit applies separately to each queue-triggered function. <br><br>If you want to avoid parallel execution for messages received on one queue, you can set `batchSize` to 1. However, this setting eliminates concurrency only so long as your function app runs on a single virtual machine (VM). If the function app scales out to multiple VMs, each VM could run one instance of each queue-triggered function.<br><br>The maximum `batchSize` is 32. | 
|maxDequeueCount|5|The number of times to try processing a message before moving it to the poison queue.| 
|newBatchThreshold|batchSize/2|Whenever the number of messages being processed concurrently gets down to this number, the runtime retrieves another batch.| 



