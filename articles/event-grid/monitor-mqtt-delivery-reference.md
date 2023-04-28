---
title: Azure Event Grid - Monitor data reference (MQTT)
description: This article provides reference documentation for metrics and diagnostic logs for Azure Event Grid's MQTT  of events. 
ms.topic: conceptual
ms.date: 04/28/2023
---

# Monitor data reference for Azure Event Grid's push and pull event delivery
This article provides a reference of log and metric data collected to analyze the performance and availability of Azure Event Grid's MQTT delivery. 

## Metrics

| Category | Metric | Display name | Unit | Aggregation | Description | Dimensions | 
| -------- | ------ | ------------ | ---- | ----------- | ----------- | ---------- | 
| Service health | MQTT.RequestCount | MQTT: RequestCount | Count | Total | The total number of requests. | <ul><li>**OperationType**: Publish, Deliver, Subscribe, Unsubscribe, Connect</li><li>**Protocol**: MQTTv3.1.1, MQTTv3.1.1OverWebSockets, MQTTv5, MQTTv5OverWebSockets</li><li>**Result**: Success, ClientError, ServiceError (Timeout?)</li><li>**Error**: <ul><li>QuotaExceeded: publish reqs/s, or connect reqs/s, etc</li><li>AuthenticationError</li><li>AuthorizationError</li><li>ClientError: max msg size, long topic, msg segment limit, etc</li><li> ServiceError</li></ul></li></ul> |
| Broker operations | Mqtt. SuccessfulPublishedMessages | MQTT: Successful Published Messages | Count | Total | The number of successful MQTT messages published into the namespace. | <ul><li>**ProtocolVersion**: MQTT3.1.1, WS MQTT 3.1.1, MQTT5, WS MQTT5</li><li>**QoS**: 0/1</li> 
| | Mqtt. SuccessfulDeliveredMessages | MQTT: Successful Delivered Messages | Count | Total | The number of messages delivered by the namespace. | <ul><li>**ProtocolVersion**: MQTT3.1.1, WS MQTT 3.1.1, MQTT5, WS MQTT5</li><li>**QoS**: 0/1</li></ul> |
| Sessions | Mqtt.Connections | MQTT: Active Connections | Count | Total | The number of active connections to the namespace. limit is 100,000 connections. | **Protocol**: MQTT3.1.1, WS MQTT 3.1.1, MQTT5, WS MQTT5 |
| Subscriptions | Mqtt. SuccessfulSubscriptionOperations | MQTT: Successful Subscription Operations | Count | Total | The number of subscriptions operations in the namespace. | <ul><li>**OperationType**: Subscribe/Unsubscribe</li><li> **Protocol**: MQTTv3.1.1, MQTTv3.1.1OverWebSockets, MQTTv5, MQTTv5OverWebSockets </li></ul>
| | Mqtt. FailedSubscriptionOperations | MQTT: Failed Subscription Operations | Count | Total | The number of subscriptions operations in the namespace. | <ul><li>**OperationType**: Subscribe/Unsubscribe</li><li>**Protocol**: MQTTv3.1.1, MQTTv3.1.1OverWebSockets, MQTTv5, MQTTv5OverWebSockets</li><li>**Error**:<ul><li>Quota_Exceeded: subscriptions/s, subscriptions/connection</li><li>Bad_Request: exceeded limit of subscriptions per packet</li><li>Client_Auth_Error</li><li>Service_Error</li></ul></li></ul> |
| Clients | Mqtt.throughput | MQTT: Throughput | Count | Total | Total bytes per second published to or delivered by the namespace. | **Direction**: Inbound/Outbound |



## Resource logs
