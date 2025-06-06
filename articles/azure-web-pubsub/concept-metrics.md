---
title: Metrics in Azure Web PubSub service
description: Metrics in Azure Web PubSub service.
author: zackliu
ms.service: azure-web-pubsub
ms.topic: conceptual
ms.date: 04/08/2022
ms.author: chenyl
ms.custom:
  - build-2025
---
# Metrics in Azure Web PubSub Service

Azure Web PubSub service has some built-in metrics and you and sets up [alerts](/azure/azure-monitor/alerts/alerts-overview) base on metrics.

## Understand metrics

Metrics provide the running info of the service. The available metrics are:

|Metric|Unit|Recommended Aggregation Type|Description|Dimensions|
|---|---|---|---|---|
|Connection Close Count|Count|Sum|The count of connections closed by various reasons.|ConnectionCloseCategory|
|Connection Count|Count|Max / Avg|The number of connections to the service.|No Dimensions|
|Connection Open Count|Count|Sum|The count of new connections opened.|No Dimensions|
|Connection Quota Utilization|Percent|Max / Avg|The percentage of connections relative to connection quota.|No Dimensions|
|Inbound Traffic|Bytes|Sum|The inbound traffic to the service.|No Dimensions|
|Outbound Traffic|Bytes|Sum|The outbound traffic from the service.|No Dimensions|
|Server Load|Percent|Max / Avg|The percentage of server load.|No Dimensions|
|Rest API Response Time|Count|Sum|The response time of REST API request categorized by endpoint.|ResponseTime, RestApiCategory|
|Client Request Status Code|Count|Sum|The status code of client connection requests.|ClientType, Status|

### Understand Dimensions

Dimensions of a metric are name/value pairs that carry extra data to describe the metric value.

The dimension available in some metrics:

* ConnectionCloseCategory: Describe the categories of why connection getting closed. Including dimension values: 
    - Normal: Normal closure.
    - Throttled: With traffic or connection throttling, check Connection Count and Outbound Traffic usage and your resource limits.
    - SendEventFailed: Event handler invokes failed.
    - EventHandlerNotFound: Event handler not found.
    - SlowClient: Too many messages queued up at service side, which needed to be sent.
    - ServiceTransientError: Internal server error.
    - BadRequest: Caused by an invalid hub name, wrong payload, etc.
    - ServiceReload: Triggered when a connection is dropped due to an internal service component reload. This event doesn't indicate a malfunction and is part of normal service operation.
    - Unauthorized: The connection is unauthorized.

* ResponseTime: Describe the response time of REST API request. Including dimension values:
    - LessThan100ms: number of requests that have a latency less than 100 milliseconds
    - LessThan500ms: number of requests that have a latency greater than 100 milliseconds and less than 500 milliseconds
    - LessThan1s: number of requests that have a latency greater than 500 milliseconds and less than 1 second
    - LessThan5s: number of requests that have a latency greater than 1 second and less than 5 seconds
    - GreaterThan5s: number of requests that have a latency greater than 5 seconds

* RestApiCategory: Describe the REST API endpoint category. Including dimension values:
    - CheckConnectionExists
    - CloseAllConnections
    - CloseClientConnection
    - CloseConnection
    - CloseGroupConnections
    - CloseUserConnections
    - ListConnectionsInGroup
    - RemoveConnectionFromGroup
    - AddUserToGroup
    - CheckGroupExists
    - CheckUserExists
    - CheckUserExistsInGroup
    - RemoveUserFromAllGroups
    - RemoveUserFromGroup
    - AddConnectionToGroup
    - AddConnectionsToGroups
    - RemoveConnectionFromAllGroups
    - RemoveConnectionsFromGroups
    - SendToAll
    - SendToConnection
    - SendToGroup
    - SendToUser
    - CheckPermission
    - GrantPermission
    - RevokePermission
    - GenerateClientToken
    - GetAccessKey
    - Execute
    - HealthCheck
    - Invoke
    - Uncategorized

* ClientType: Describe the type of client. Including dimension values:
    - WebPubSub
    - MQTT
    - SocketIO

* Status: Describe the status code of client connection requests. Possible dimension values are HTTP status codes.

Learn more about [multi-dimensional metrics](/azure/azure-monitor/essentials/data-platform-metrics#multi-dimensional-metrics)

## Related resources

- [Aggregation types in Azure Monitor](/azure/azure-monitor/essentials/metrics-supported#microsoftsignalrservicewebpubsub)
