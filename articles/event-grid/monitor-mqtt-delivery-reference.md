---
title: Azure Event Grid - Monitor data reference (MQTT)
description: This article provides reference documentation for metrics and diagnostic logs for Azure Event Grid's MQTT  of events. 
ms.topic: conceptual
ms.date: 04/28/2023
---

# Monitor data reference for Azure Event Grid's MQTT (Message Queueing Telementry Transport) delivery
This article provides a reference of log and metric data collected to analyze the performance and availability of Azure Event Grid's MQTT delivery. 

## Metrics

| Category | Metric | Display name | Unit | Aggregation | Description | Dimensions | 
| -------- | ------ | ------------ | ---- | ----------- | ----------- | ---------- | 
| Service health | MQTT.RequestCount | MQTT: RequestCount | Count | Total | The total number of requests. | <br>- **OperationType**: Publish, Deliver, Subscribe, Unsubscribe, Connect<br>- **Protocol**: MQTTv3.1.1, MQTTv3.1.1OverWebSockets, MQTTv5, MQTTv5OverWebSockets<br>- **Result**: Success, ClientError, ServiceError (Timeout?)<br>- **Error**: <br>-QuotaExceeded: publish reqs/s, or connect reqs/s, etc.<br>- AuthenticationError<br>- AuthorizationError<br>- ClientError: max msg size, long topic, msg segment limit, etc.<br>- ServiceError |
| Broker operations | MQTT. SuccessfulPublishedMessages | MQTT: Successful Published Messages | Count | Total | The number of successful MQTT messages published into the namespace. | <br>- **ProtocolVersion**: MQTT3.1.1, WS MQTT 3.1.1, MQTT5, WS MQTT5<br>- **QoS**: 0/1 | 
| | MQTT. SuccessfulDeliveredMessages | MQTT: Successful Delivered Messages | Count | Total | The number of messages delivered by the namespace. | <br>- **ProtocolVersion**: MQTT3.1.1, WS MQTT 3.1.1, MQTT5, WS MQTT5<br>- **QoS**: 0/1 |
|  | MQTT.Connections | MQTT: Active Connections | Count | Total | The number of active connections to the namespace. limit is 100,000 connections. | **Protocol**: MQTT3.1.1, WS MQTT 3.1.1, MQTT5, WS MQTT5 |
| Subscriptions | MQTT. SuccessfulSubscriptionOperations | MQTT: Successful Subscription Operations | Count | Total | The number of subscriptions operations in the namespace. | <br>- **OperationType**: Subscribe/Unsubscribe<br>- **Protocol**: MQTTv3.1.1, MQTTv3.1.1OverWebSockets, MQTTv5, MQTTv5OverWebSockets |
| | MQTT. FailedSubscriptionOperations | MQTT: Failed Subscription Operations | Count | Total | The number of subscriptions operations in the namespace. | <br>- **OperationType**: Subscribe/Unsubscribe<br>- **Protocol**: MQTTv3.1.1, MQTTv3.1.1OverWebSockets, MQTTv5, MQTTv5OverWebSockets<br>- **Error**:<br>- Quota_Exceeded: subscriptions/s, subscriptions/connection<br>- Bad_Request: exceeded limit of subscriptions per packet<br>- Client_Auth_Error<br>- Service_Error |
|  | MQTT.throughput | MQTT: Throughput | Count | Total | Total bytes per second published to or delivered by the namespace. | **Direction**: Inbound/Outbound |

## Next steps
See [Monitor push and pull delivery reference](monitor-pull-push-reference.md).