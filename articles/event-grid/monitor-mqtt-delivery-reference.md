---
title: Azure Event Grid - Monitor data reference (MQTT)
description: This article provides reference documentation for metrics and diagnostic logs for Azure Event Grid's MQTT  of events. 
ms.topic: conceptual
ms.date: 04/28/2023
---

# Monitor data reference for Azure Event Grid's Message Queueing Telemetry Transport (MQTT) delivery
This article provides a reference of log and metric data collected to analyze the performance and availability of Azure Event Grid's MQTT delivery. 

## Metrics

| Category | Metric | Display name | Unit | Aggregation | Description | Dimensions | 
| -------- | ------ | ------------ | ---- | ----------- | ----------- | ---------- | 
| Service health | MQTT.RequestCount | MQTT: RequestCount | Count | Total | The total number of requests. | OperationType, Protocol, Result, Error |
| Broker operations | MQTT. SuccessfulPublishedMessages | MQTT: Successful Published Messages | Count | Total | The number of successful MQTT messages published into the namespace. | Protocol, QoS | 
| | MQTT. SuccessfulDeliveredMessages | MQTT: Successful Delivered Messages | Count | Total | The number of messages delivered by the namespace. | Protocol, QoS |
|  | MQTT.Connections | MQTT: Active Connections | Count | Total | The number of active connections to the namespace. limit is 100,000 connections. | Protocol |
| Subscriptions | MQTT. SuccessfulSubscriptionOperations | MQTT: Successful Subscription Operations | Count | Total | The number of subscriptions operations in the namespace. | OperationType, Protocol |
| | MQTT. FailedSubscriptionOperations | MQTT: Failed Subscription Operations | Count | Total | The number of subscriptions operations in the namespace. | OperationType, Protocol, **Error**:<br>- Quota_Exceeded: subscriptions/s, subscriptions/connection<br>- Bad_Request: exceeded limit of subscriptions per packet<br>- Client_Auth_Error<br>- Service_Error |
|  | MQTT.throughput | MQTT: Throughput | Count | Total | Total bytes per second published to or delivered by the namespace. | Direction |

## Metric dimensions

| Dimension | Values | 
| --------- | ------ | 
| OperationType |  The type of the operation. The available values include: <br><br>- Publish<br>- Deliver, <br>- Subscribe, <br>- Unsubscribe, <br>- Connect |
| Protocol | The protocol used. The available values include: <br><br>- MQTTv3.1.1, <br>- MQTTv3.1.1OverWebSockets, <br>- MQTTv5, <br>- MQTTv5OverWebSockets
| Result | Result of the operation. The available values include: <br><br>- Success <br>- ClientError <br>- ServiceError |
| Error | Error occurred during the operation. The available values include: <br><br>-QuotaExceeded: publish requests/sec, or connect requests/sec, etc.<br>- AuthenticationError<br>- AuthorizationError<br>- ClientError: maximum message size, long topic, message segment limit, etc.<br>- ServiceError |
| QoS | Quality of service level. The available values are: 0, 1. |
| Direction | The available values are: Inbound, Outbound |

## Next steps
See [Monitor push and pull delivery reference](monitor-pull-push-reference.md).