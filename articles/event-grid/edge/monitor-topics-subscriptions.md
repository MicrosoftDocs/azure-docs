---
title: Monitor topics and event subscriptions - Azure Event Grid IoT Edge | Microsoft Docs 
description: Monitor topics and event subscriptions 
author: femila
ms.author: femila
ms.reviewer: spelluru
ms.date: 01/09/2020
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Monitor topics and event subscriptions

Event Grid on Edge exposes a number of metrics for topics and event subscriptions in the [Prometheus exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/). This article describes the available metrics and how to enable them.

## Enable metrics

Configure the module to emit metrics by setting the `metrics__reporterType` environment variable to `prometheus` in the container create options:

 ```json
        {
          "Env": [
            "metrics__reporterType=prometheus"
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

Metrics will be available at `5888/metrics` of the module for http and `4438/metrics` for https. For example, `http://<modulename>:5888/metrics?api-version=2019-01-01-preview` for http. At this point, a metrics module can poll the endpoint to collect metrics as in this [example architecture](https://github.com/veyalla/ehm).

## Available metrics

Both topics and event subscriptions emit metrics to give you insights into event delivery and module performance.

### Topic metrics

| Metric | Description |
| ------ | ----------- |
| EventsReceived | Number of events published to the topic
| UnmatchedEvents | Number of events published to the topic that do not match an Event Subscription and are dropped
| SuccessRequests | Number of inbound publish requests received by the topic
| SystemErrorRequests | Number of inbound publish requests failed due to an internal system error
| UserErrorRequests | Number on inbound publish requests failed due to user error such as malformed JSON
| SuccessRequestLatencyMs | Publish request response latency in milliseconds


### Event subscription metrics

| Metric | Description |
| ------ | ----------- |
| DeliverySuccessCounts | Number of events successfully delivered to the configured endpoint
| DeliveryFailureCounts | Number of events that failed to be delivered to the configured endpoint
| DeliverySuccessLatencyMs | Latency of events successfully delivered in milliseconds
| DeliveryFailureLatencyMs | Latency of events delivery failures in milliseconds
| SystemDelayForFirstAttemptMs | System delay of events before first delivery attempt in milliseconds
| DeliveryAttemptsCount | Number of event delivery attempts - success and failure
| ExpiredCounts | Number of events that expired and were not delivered to the configured endpoint