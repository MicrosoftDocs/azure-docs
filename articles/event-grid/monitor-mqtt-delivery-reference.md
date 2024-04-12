---
title: Azure Event Grid’s MQTT broker feature - Monitor data reference
description: This article provides reference documentation for metrics and diagnostic logs for Azure Event Grid’s MQTT broker feature.
ms.topic: conceptual
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 11/15/2023
ms.subservice: mqtt
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
| ThrottleType | The type of throttle limit that got exceeded in the namespace. The available values include: <br>- InboundBandwidthPerNamespace <br>- InboundBandwidthPerConnection <br>- IncomingPublishPacketsPerNamespace <br>- IncomingPublishPacketsPerConnection <br>- OutboundPublishPacketsPerNamespace <br>- OutboundPublishPacketsPerConnection <br>- OutboundBandwidthPerNamespace <br>- OutboundBandwidthPerConnection <br>- SubscribeOperationsPerNamespace <br>- SubscribeOperationsPerConnection <br>- ConnectPacketsPerNamespace <br><br>[Learn more about the limits](quotas-limits.md#mqtt-limits-in-event-grid-namespace). |
| QoS | Quality of service level. The available values are: 0, 1. |
| Direction | The direction of the operation. The available values are: <br><br>- Inbound: inbound throughput to Event Grid. <br>- Outbound: outbound throughput from Event Grid. |
| DropReason | The reason a session was dropped. The available values include: <br><br>- SessionExpiry: a persistent session has expired. <br>- TransientSession: a non-persistent session has expired. <br>- SessionOverflow: a client didn't connect during the lifespan of the session to receive queued QOS1 messages until the queue reached its maximum limit. <br>- AuthorizationError: a session drop because of any authorization reasons.


## Resource logs

MQTT broker in Azure Event Grid captures diagnostic logs for the following categories:

- [Failed MQTT connections](#failed-mqtt-connections)
- [Successful MQTT connections](#successful-mqtt-connections)
- [MQTT disconnections](#mqtt-disconnections)
- [Failed MQTT published messages](#failed-mqtt-published-messages)
- [Failed MQTT subscription operations](#failed-mqtt-subscription-operations)

This section provides schema and examples for these logs. 

### Common properties
The following properties are common for all the resource logs from MQTT broker. 

| Property name | Type | Description |
| ----------- | ---- | ----------- |
| `time` | `DateTime` | Timestamp (UTC) when the log was generated. |
| `resourceId` | `String` | Resource ID of the Event Grid namespace. For example: `/SUBSCRIPTIONS/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/RESOURCEGROUPS/MYRG/PROVIDERS/MICROSOFT.EVENTGRID/NAMESPACE/MYNAMESPACE`. |
| `location` | `String` | Location of the namespace | 
| `operationName` |	`String` | Name of the operation. For example: `Microsoft.EventGrid/topicspaces/connect`, `Microsoft.EventGrid/topicspaces/disconnect`, `Microsoft.EventGrid/topicspaces/publish`, `Microsoft.EventGrid/topicspaces/subscribe`, `Microsoft.EventGrid/topicspaces/unsubscribe`. |
| `category` | `String` | Category or type of the operation. For example: `FailedMQTTConnections`, `SuccessfulMQTTConnections`, `MQTTDisconnections`, `FailedMQTTPublishedMessages`, `FailedMQTTSubscriptionOperations`. | 
| `resultType` | `String` | Result of the operation. For example: `Failed`, `Succeeded`. |
| `resultSignature` | `String` | Result of the failed operation. For example: `QuotaExceeded`, `ClientAuthenticationError`, `AuthorizationError`. This property isn't included for the successful events like `SuccessfulMQTTConnections`. |
| `resultDescription` | `String` | More description about the result of the failed operation. This property isn't included for the successful events like `SuccessfulMQTTConnections`. |
| `AuthenticationAuthority` | `String` | Type of authority used to authenticate your MQTT client. It's set to one of the following values: `Local` for clients registered in Event Grid's local registry, or `AAD` for clients using Microsoft Entra for authentication. |
| `authenticationType` | `String` | Type of authentication used by the client. It's set to one of the following values: `CertificateThumbprintMatch`, `AccessToken`, or `CACertificate`. |
| `clientIdentitySource` | `String` | Source of the client’s identity. It's `JWT` when you use Microsoft Entra ID authentication. |
| `authenticationAuthority` | `String` | Authority of the client's identity. It's set to one of the following values: `local` for the clients in Event Grid namespace's local registry, `AAD` for AAD clients. |
| `clientIdentity` | `String` | Value of the client’s identity. It's the name of the local registry or object ID for Microsoft Entra ID clients.|


### Failed MQTT connections
This log includes an entry for every failed `MQTT CONNECT` operation by the client. This log can be used to diagnose connectivity issues.

Here's a sample Failed MQTT connection log entry.

```json
[
  {
    "time": "2023-11-06T22:45:02.6829930Z",
    "resourceId": "/SUBSCRIPTIONS/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/RESOURCEGROUPS/MYRG/PROVIDERS/MICROSOFT.EVENTGRID/NAMESPACE/MYNS",
    "location": "eastus",
    "operationName": "Microsoft.EventGrid/topicspaces/connect",
    "category": "FailedMqttConnections",
    "resultType": "Failed",
    "resultSignature": "AuthenticationError",
    "resultDescription": "Client could not be found",
    "identity": {
      "authenticationType": "CertificateThumbprintMatch",
      "clientIdentitySource": "UserName",
      "authenticationAuthority": "Local",
      "clientIdentity": "testclient-1"
    },
    "properties": {
      "sessionName": "testclient1",
      "protocol": "MQTT5",
      "traceId": "pwu5p3uuvzbyzpe4vyygij3it4"
    }
  }
]
```
Here are the properties and their descriptions.

| Property | Type | Description |
| ----------- | ---- | ----------- | 
| `sessionName` | `String` | Name of the session provided by the client in the `MQTT CONNECT` packet’s clientId field. |
| `protocol` | `String` | Protocol used by the client to connect. Possible values are: MQTT3, MQTT3-WS, MQTT5, MQTT5-WS. |
| `traceId` | `Int` | Generated trace ID. |


### Successful MQTT connections
This log includes an entry for every successful `MQTT CONNECT` operation by the client. This log can be used for auditing purposes.

```json
[
  {
    "time": "2023-11-07T01:22:05.2804980Z",
    "resourceId": "/SUBSCRIPTIONS/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/RESOURCEGROUPS/MYRG/PROVIDERS/MICROSOFT.EVENTGRID/NAMESPACE/MYNS",
    "location": "eastus",
    "operationName": "Microsoft.EventGrid/topicspaces/connect",
    "category": "SuccessfulMqttConnections",
    "resultType": "Succeeded",
    "identity": {
      "authenticationType": "CertificateThumbprintMatch",
      "clientIdentitySource": "UserName",
      "authenticationAuthority": "Local",
      "clientIdentity": "client1"
    },
    "properties": { 
      "sessionName": "client1", 
      "protocol": "MQTT5" 
    }
  }
]
```

Here are the properties and their descriptions.

| Property | Type | Description |
| ----------- | ---- | ----------- | 
| `sessionName` | `String` | Name of the session provided by the client in the `MQTT CONNECT` packet’s clientId field. |
| `protocol` | `String` | Protocol used by the client to connect. Possible values are: MQTT3, MQTT3-WS, MQTT5, MQTT5-WS. |


### MQTT disconnections
This log includes an entry for every MQTT client disconnection from an Event Grid namespace. This log can be used to diagnose connectivity issues.

```json
[
  {
    "time": "2023-11-07T01:29:22.4591610Z",
    "resourceId": "/SUBSCRIPTIONS/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/RESOURCEGROUPS/MYRG/PROVIDERS/MICROSOFT.EVENTGRID/NAMESPACE/MYNS",
    "location": "eastus",
    "operationName": "Microsoft.EventGrid/topicspaces/disconnect",
    "category": "MqttDisconnections",
    "resultType": "Failed",
    "resultSignature": "ClientError",
    "resultDescription": "Timed out per negotiated Keep Alive",
    "identity": { 
      "clientIdentity": "client1" 
    },
    "properties": { 
      "sessionName": "client1", 
      "protocol": "MQTT5" 
    }
  }
]
```

Here are the properties and their descriptions.

| Property | Type | Description |
| ----------- | ---- | ----------- | 
| `sessionName` | `String` | Name of the session provided by the client in the `MQTT CONNECT` packet’s clientId field. |
| `protocol` | `String` | Protocol used by the client to connect. Possible values are: MQTT3, MQTT3-WS, MQTT5, MQTT5-WS. |


### Failed MQTT published messages
This log includes an entry for every MQTT message that failed to be published to or delivered by an Event Grid namespace. This log can be used to diagnose publishing issues and message loss.

```json
[
  {
    "time": "2023-11-07T01:22:48.2811790Z",
    "resourceId": "/SUBSCRIPTIONS/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/RESOURCEGROUPS/MYRG/PROVIDERS/MICROSOFT.EVENTGRID/NAMESPACE/MYNS",
    "location": "eastus",
    "operationName": "Microsoft.EventGrid/topicspaces/publish",
    "category": "FailedMqttPublishedMessages",
    "resultType": "Failed",
    "resultSignature": "AuthorizationError",
    "resultDescription": "Topic name 'testtopic/small4.0' does not match any topicspaces",
    "identity": { "clientIdentity": "client1" },
    "properties": {
      "sessionName": "client1",
      "protocol": "MQTT5",
      "traceId": "ako65yewjjhzbdp3lxny7557fu",
      "qos": 1,
      "topicName": "testtopic/small4.0",
      "operationCount": 1
    }
  }
]
```

Here are the columns of the `EventGridNamespaceFailedMqttPublishedMessages` Log Analytics table and their descriptions.

| Column name | Type | Description |
| ----------- | ---- | ----------- | 
| `sessionName` | `String` | Name of the session provided by the client in the MQTT CONNECT packet’s clientId field. |
| `protocol` | `String` | Protocol used by the client to publish. Possible values are: MQTT3, MQTT3-WS, MQTT5, MQTT5-WS. |
| `traceId` | `Int` | Generated trace ID. |
| `qos` | `Int` | Quality of service used by the client to publish. Possible values are: 0 or 1. |
| `topicName` | `String` | MQTT Topic Name used by the client to publish. |
| `operationCount` | `Int` | Count of MQTT message that failed to be published to or delivered by an Event Grid namespace with the same resultDescription. |

### Failed MQTT subscription operations
This log includes an entry for every MQTT subscribe operation by an MQTT client. A log entry is added for each topic filter within the same subscribe/unsubscribe packet that has the same error. This log can be used to diagnose subscription issues and message loss.

```json
[
  {
    "time": "2023-11-07T01:22:39.0339970Z",
    "resourceId": "/SUBSCRIPTIONS/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/RESOURCEGROUPS/MYRG/PROVIDERS/MICROSOFT.EVENTGRID/NAMESPACE/MYNS",
    "location": "eastus",
    "operationName": "Microsoft.EventGrid/topicspaces/subscribe",
    "category": "FailedMqttSubscriptionOperations",
    "resultType": "Failed",
    "resultSignature": "AuthorizationError",
    "resultDescription": "Topic filter 'testtopic/#' does not match any topicspaces",
    "identity": { "clientIdentity": "client1" },
    "properties": {
      "sessionName": "client1",
      "protocol": "MQTT5",
      "traceId": "gnz3cgqpozg4tbm5anvsvopafi",
      "topicFilters": ["testtopic/#"]
    }
  }
]
```

Here are the columns of the `EventGridNamespaceFailedMqttSubscriptions` Log Analytics table and their descriptions.

| Column name | Type | Description |
| ----------- | ---- | ----------- | 
| `sessionName` | `String` | Name of the session provided by the client in the MQTT CONNECT packet’s clientId field. |
| `protocol` | `String` | Protocol used by the client to publish. Possible values are: MQTT3, MQTT3-WS, MQTT5, MQTT5-WS. |
| `traceId` | `Int` | Generated trace ID. |
| `topicFilters` | Array of strings | List of topic names within the same packet that have the same error. | 


## Next steps
See the following articles:

- [Monitor pull delivery reference](monitor-pull-reference.md).
- [Monitor push delivery reference](monitor-push-reference.md).
