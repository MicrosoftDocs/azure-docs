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
| EventsReceived | 
| UnmatchedEvents
| SuccessRequests
| SystemErrorRequests
| UserErrorRequests
| SuccessRequestLatencyMs


### Event subscription metrics

| Metric | Description |
| ------ | ----------- |
| deliverySuccessCounts
| deliveryFailureCounts
| deliverySuccessLatencyMs
| deliveryFailureLatencyMs
| systemDelayForFirstAttemptMs
| deliveryAttemptsCount
| expiredCounts