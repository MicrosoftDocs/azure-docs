---
title: Azure Event Grid - Monitor data reference (MQTT)
description: This article provides reference documentation for metrics and diagnostic logs for Azure Event Grid's MQTT  of events. 
ms.topic: conceptual
ms.date: 05/23/2023
---

# Monitor data reference for Azure Event Grid's MQTT delivery
This article provides a reference of log and metric data collected to analyze the performance and availability of Azure Event Grid's MQTT delivery. 

## Metrics

| Category | Metric | Display name | Unit | Aggregation | Description | Dimensions | 
| -------- | ------ | ------------ | ---- | ----------- | ----------- | ---------- | 
| MQTT.RequestCount | MQTT: RequestCount | Count | Total | The number of MQTT requests. | OperationType, Protocol, Result, Error |
| MQTT.SuccessfulPublishedMessages | MQTT: Successful Published Messages | Count | Total | The number of MQTT messages that were published successfully into the namespace. | Protocol, QoS | 
| MQTT.FailedPublishedMessages | MQTT: Failed Published Messages | Count | Total | The number of MQTT messages that failed to be published into the namespace. | Protocol, QoS, Error | 
| MQTT.SuccessfulDeliveredMessages | MQTT: Successful Delivered Messages | Count | Total | The number of messages delivered by the namespace. There are no failures for this operation. | Protocol, QoS |
| MQTT.SuccessfulSubscriptionOperations | MQTT: Successful Subscription Operations | Count | Total | The number of successful subscription operations (Subscribe, Unsubscribe). This metric is incremented for every topic filter within your subscription request.  | OperationType, Protocol |
| MQTT.FailedSubscriptionOperations | MQTT: Failed Subscription Operations | Count | Total | The number of failed subscription operations (Subscribe, Unsubscribe). This metric is incremented for every topic filter within your subscription request. | OperationType, Protocol, Error |
| MQTT.Connections | MQTT: Active Connections | Count | Total | The number of active connections in the namespace. | Protocol |
| MQTT.Throughput | MQTT: Throughput | Count | Total | The total bytes per second published to or delivered by the namespace. | Direction |

> [!NOTE]
> Each subscription request increments the MQTT.RequestCount metric, while each topic filter within the subscription request increments the subscription operation metrics. For example, consider a subscription request that is sent with five different topic filters. Three of these topic filters were succeessfully processed while two of the topic filters failed to be processed. The following list represent the resulting increments to the metrics:
> - MQTT.RequestCount:1
> - MQTT.SuccessfulSubscriptionOperations:3
> - MQTT.FailedSubscriptionOperations:2

## Metric dimensions

| Dimension | Values | 
| --------- | ------ | 
| OperationType |  The type of the operation. The available values include: <br><br>- Publish<br>- Deliver, <br>- Subscribe, <br>- Unsubscribe, <br>- Connect |
| Protocol | The protocol used in the operation. The available values include: <br><br>- MQTT3, <br>- MQTT5, <br>- MQTT3-WS, <br>- MQTT5-WS,
| Result | Result of the operation. The available values include: <br><br>- Success <br>- ClientError <br>- ServiceError |
| Error | Error occurred during the operation. The available values include: <br><br>-QuotaExceeded: the client exceeded one or more of the throttling limits that resulted in a failure <br>- AuthenticationError: a failure because of any authentication reasons. <br>- AuthorizationError: a failure because of any authorization reasons.<br>- ClientError: the client sent a bad request or used one of the unsupported features that resulted in a failure. <br>- ServiceError: a failure because of an unexpected server error or for a server's operational reason.|
| QoS | Quality of service level. The available values are: 0, 1. |
| Direction | The direction of the operation. The available values are: Inbound, Outbound |

## Next steps
See [Monitor push and pull delivery reference](monitor-pull-push-reference.md).