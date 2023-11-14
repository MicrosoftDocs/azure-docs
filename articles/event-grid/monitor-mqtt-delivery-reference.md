---
title: Azure Event Grid’s MQTT broker feature - Monitor data reference
description: This article provides reference documentation for metrics and diagnostic logs for Azure Event Grid’s MQTT broker feature.
ms.topic: conceptual
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 05/23/2023
---

# Monitor data reference for Azure Event Grid’s MQTT broker feature (Preview)
This article provides a reference of log and metric data collected to analyze the performance and availability of MQTT broker.



## Metrics

| Metric | Display name | Unit | Aggregation | Description | Dimensions | 
| ------ | ------------ | ---- | ----------- | ----------- | ---------- | 
| MQTT.RequestCount | MQTT: RequestCount | Count | Total | The number of MQTT requests. | OperationType, Protocol, Result, Error |
| MQTT.Throughput | MQTT: Throughput | Count | Total | The total bytes published to or delivered by the namespace. This metric includes all the MQTT packets that your MQTT clients send to the MQTT broker, regardless of their success.  | Direction |
| MQTT.ThrottlingEnforcements | MQTT: Throttling Enforcements | Count | Total | The number of times that any request got throttled in the namespace.  | ThrottleType |
| MQTT.SuccessfulPublishedMessages | MQTT: Successful Published Messages | Count | Total | The number of MQTT messages that were published successfully into the namespace. | Protocol, QoS | 
| MQTT.FailedPublishedMessages | MQTT: Failed Published Messages | Count | Total | The number of MQTT messages that failed to be published into the namespace. | Protocol, QoS, Error | 
| MQTT.SuccessfulDeliveredMessages | MQTT: Successful Delivered Messages | Count | Total | The number of messages delivered by the namespace, regardless of the acknowledgments from MQTT clients. There are no failures for this operation. | Protocol, QoS |
| MQTT.SuccessfulSubscriptionOperations | MQTT: Successful Subscription Operations | Count | Total | The number of successful subscription operations (Subscribe, Unsubscribe). This metric is incremented for every topic filter within your subscription request that gets accepted by MQTT broker.  | OperationType, Protocol |
| MQTT.FailedSubscriptionOperations | MQTT: Failed Subscription Operations | Count | Total | The number of failed subscription operations (Subscribe, Unsubscribe). This metric is incremented for every topic filter within your subscription request that gets rejected by MQTT broker. | OperationType, Protocol, Error |
| Mqtt.SuccessfulRoutedMessages | MQTT: Successful Routed Messages | Count | Total | The number of MQTT messages that were routed successfully from the namespace. |  |
| Mqtt.FailedRoutedMessages | MQTT: Failed Routed Messages | Count | Total | The number of MQTT messages that failed to be routed from the namespace. | Error |
| MQTT.Connections | MQTT: Active Connections | Count | Total | The number of active connections in the namespace. The value for this metric is a point-in-time value. Connections that were active immediately after that point-in-time might not be reflected in the metric. | Protocol |
| Mqtt.DroppedSessions | MQTT: Dropped Sessions | Count | Total | The number of dropped sessions in the namespace.  The value for this metric is a point-in-time value. Sessions that were dropped immediately after that point-in-time might not be reflected in the metric. | DropReason |



> [!NOTE]
> Each subscription request increments the MQTT.RequestCount metric, while each topic filter within the subscription request increments the subscription operation metrics. For example, consider a subscription request that is sent with five different topic filters. Three of these topic filters were succeessfully processed while two of the topic filters failed to be processed. The following list represent the resulting increments to the metrics:
> - MQTT.RequestCount:1
> - MQTT.SuccessfulSubscriptionOperations:3
> - MQTT.FailedSubscriptionOperations:2

### Metric dimensions

| Dimension | Values | 
| --------- | ------ | 
| OperationType |  The type of the operation. The available values include: <br><br>- Publish: PUBLISH requests sent from MQTT clients to Event Grid. <br>- Deliver: PUBLISH requests sent from Event Grid to MQTT clients. <br>- Subscribe: SUBSCRIBE requests by MQTT clients. <br>- Unsubscribe: UNSUBSCRIBE requests by MQTT clients. <br>- Connect: CONNECT requests by MQTT clients. |
| Protocol | The protocol used in the operation. The available values include: <br><br>- MQTT3: MQTT v3.1.1 <br>- MQTT5: MQTT v5 <br>- MQTT3-WS: MQTT v3.1.1 over WebSocket <br>- MQTT5-WS: MQTT v5 over WebSocket
| Result | Result of the operation. The available values include: <br><br>- Success <br>- ClientError <br>- ServiceError |
| Error | Error occurred during the operation.<br> The available values for MQTT: RequestCount, MQTT: Failed Published Messages, MQTT: Failed Subscription Operations metrics include: <br><br>-QuotaExceeded: the client exceeded one or more of the throttling limits that resulted in a failure <br>- AuthenticationError: a failure because of any authentication reasons.  <br>- AuthorizationError: a failure because of any authorization reasons.<br>- ClientError: the client sent a bad request or used one of the unsupported features that resulted in a failure. <br>- ServiceError: a failure because of an unexpected server error or for a server's operational reason. <br><br> [Learn more about how the supported MQTT features.](mqtt-support.md) <br><br>The available values for MQTT: Failed Routed Messages metric include: <br><br>-AuthenticationError: the EventGrid Data Sender role for the custom topic configured as the destination for MQTT routed messages was deleted. <br>-TopicNotFoundError: The custom topic that is configured to receive all the MQTT routed messages was deleted. <br>-TooManyRequests: the number of MQTT routed messages per second exceeds the limit of the destination (namespace topic or custom topic) for MQTT routed messages.  <br>- ServiceError: a failure because of an unexpected server error or for a server's operational reason. <br><br> [Learn more about how the MQTT broker handles each of these routing errors.](mqtt-routing.md#mqtt-message-routing-behavior)|
| ThrottleType | The type of throttle limit that got exceeded in the namespace. The available values include: <br>- InboundBandwidthPerNamespace <br>- InboundBandwidthPerConnection <br>- IncomingPublishPacketsPerNamespace <br>- IncomingPublishPacketsPerConnection <br>- OutboundPublishPacketsPerNamespace <br>- OutboundPublishPacketsPerConnection <br>- OutboundBandwidthPerNamespace <br>- OutboundBandwidthPerConnection <br>- SubscribeOperationsPerNamespace <br>- SubscribeOperationsPerConnection <br>- ConnectPacketsPerNamespace <br><br>[Learn more about the limits](quotas-limits.md#mqtt-limits-in-namespace). |
| QoS | Quality of service level. The available values are: 0, 1. |
| Direction | The direction of the operation. The available values are: <br><br>- Inbound: inbound throughput to Event Grid. <br>- Outbound: outbound throughput from Event Grid. |
| DropReason | The reason a session was dropped. The available values include: <br><br>- SessionExpiry: a persistent session has expired. <br>- TransientSession: a non-persistent session has expired. <br>- SessionOverflow: a client didn't connect during the lifespan of the session to receive queued QOS1 messages until the queue reached its maximum limit. <br>- AuthorizationError: a session drop because of any authorization reasons.


## Next steps
See the following articles:

- [Monitor pull delivery reference](monitor-pull-reference.md).
- [Monitor push delivery reference](monitor-push-reference.md).
