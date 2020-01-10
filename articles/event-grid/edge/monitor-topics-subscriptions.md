# Monitor topics and event subscriptions

Event Grid on Edge exposes a number of metrics for topics and event subscriptions in the [Prometheus exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/). This article describes the availble metrics and how to enable them.

## Enable metrics

You need to configure the module to emit metrics by setting the `metrics:reporterType` environment variable to `prometheus` in the container create options:

 ```json
        {
          "Env": [
            "metrics:reporterType=prometheus"
          ],
          "HostConfig": {
            "PortBindings": {
              "4438/tcp": [
                {
                    "HostPort": "4438"
                }
              ]
            }
          }
        }
 ```    

Metrics will be available at `5888/metrics` of the module for http and `4438/metrics` for https. For example `http://<modulename>:5888/metrics?api-version=2019-01-01-preview` for http. At this point a metrics module can poll the endpoint to collect metrics as in this [example architecture](https://github.com/veyalla/ehm).

## Available metrics

Both topics and event subscriptions emit metrics to give you insights into event delivery and module performance.

### Topic metrics

| Metric | Description |
| ------ | ----------- |
| EventsReceived | Number of events published to the topic
| UnmatchedEvents | Number of events published to the topic that do not match an Event Subscription and are dropped
| SuccessRequests | Number of inbound publish requests recieved by the topic
| SystemErrorRequests | Number of inbound publish requests failed due to an internal system error
| UserErrorRequests | Number on inbound publish requests failed due to user error such as malformed JSON
| SuccessRequestLatencyMs | Publish request response latency in milliseconds


### Event subscription metrics

| Metric | Description |
| ------ | ----------- |
| deliverySuccessCounts | Number of events sucessfully delivered to the configured endpoint
| deliveryFailureCounts | Number of event delivery attempts failed to the configured endpoint
| deliverySuccessLatencyMs | Latency of events successfully delivered in milliseconds
| deliveryFailureLatencyMs | Latency of events not sucessfully delivered in milliseconds
| systemDelayForFirstAttemptMs | System delay of events before first delivery attempt in miliseconds
| deliveryAttemptsCount | Number of event delivery attempts - success and failure
| expiredCounts | Number of events unable to be delivered 