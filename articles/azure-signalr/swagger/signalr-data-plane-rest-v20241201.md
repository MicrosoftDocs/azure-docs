---
title: Azure SignalR service data plane REST API reference - v20241201
description: Describes REST APIs version v20241201 Azure SignalR service supports to manage the connections and send messages to them.
author: Y-Sindo
ms.author: zityang
ms.service: azure-signalr-service
ms.topic: reference
ms.date: 06/03/2026
---


# Azure SignalR Service data plane REST API - 2024-12-01
## Version: 2024-12-01

### Available APIs

| API | Path |
| ---- | ---------- |
| [get /api/auth/accessKey](#get-get-api-auth-accesskey) | `GET /api/auth/accessKey` |
| [Get service health status.](#head-get-service-health-status) | `HEAD /api/health` |
| [Close all of the connections in the hub.](#post-close-all-of-the-connections-in-the-hub) | `POST /api/hubs/{hub}/:closeConnections` |
| [Execute commands in transaction for all of connections.](#post-execute-commands-in-transaction-for-all-of-connections) | `POST /api/hubs/{hub}/:execute` |
| [Generate token for the client to connect Azure SignalR service.](#post-generate-token-for-the-client-to-connect-azure-signalr-service) | `POST /api/hubs/{hub}/:generateToken` |
| [Broadcast a message to all clients connected to target hub.](#post-broadcast-a-message-to-all-clients-connected-to-target-hub) | `POST /api/hubs/{hub}/:send` |
| [Close the client connection](#delete-close-the-client-connection) | `DELETE /api/hubs/{hub}/connections/{connectionId}` |
| [Check if the connection with the given connectionId exists](#head-check-if-the-connection-with-the-given-connectionid-exists) | `HEAD /api/hubs/{hub}/connections/{connectionId}` |
| [Invoke a method on a connection.](#post-invoke-a-method-on-a-connection) | `POST /api/hubs/{hub}/connections/{connectionId}/:invoke` |
| [Send message to the specific connection.](#post-send-message-to-the-specific-connection) | `POST /api/hubs/{hub}/connections/{connectionId}/:send` |
| [Remove a connection from all groups](#delete-remove-a-connection-from-all-groups) | `DELETE /api/hubs/{hub}/connections/{connectionId}/groups` |
| [Complete a streaming for the specific connection.](#post-complete-a-streaming-for-the-specific-connection) | `POST /api/hubs/{hub}/connections/{connectionId}/streams/{streamId}/:complete` |
| [Send stream message to the specific stream for the connection.](#post-send-stream-message-to-the-specific-stream-for-the-connection) | `POST /api/hubs/{hub}/connections/{connectionId}/streams/{streamId}/:send` |
| [Check if there are any client connections inside the given group](#head-check-if-there-are-any-client-connections-inside-the-given-group) | `HEAD /api/hubs/{hub}/groups/{group}` |
| [Close connections in the specific group.](#post-close-connections-in-the-specific-group) | `POST /api/hubs/{hub}/groups/{group}/:closeConnections` |
| [Broadcast a message to all clients within the target group.](#post-broadcast-a-message-to-all-clients-within-the-target-group) | `POST /api/hubs/{hub}/groups/{group}/:send` |
| [List connections in a group.](#get-list-connections-in-a-group) | `GET /api/hubs/{hub}/groups/{group}/connections` |
| [Remove a connection from the target group.](#delete-remove-a-connection-from-the-target-group) | `DELETE /api/hubs/{hub}/groups/{group}/connections/{connectionId}` |
| [Add a connection to the target group.](#put-add-a-connection-to-the-target-group) | `PUT /api/hubs/{hub}/groups/{group}/connections/{connectionId}` |
| [Check if there are any client connections connected for the given user](#head-check-if-there-are-any-client-connections-connected-for-the-given-user) | `HEAD /api/hubs/{hub}/users/{user}` |
| [Close connections for the specific user.](#post-close-connections-for-the-specific-user) | `POST /api/hubs/{hub}/users/{user}/:closeConnections` |
| [Broadcast a message to all clients belong to the target user.](#post-broadcast-a-message-to-all-clients-belong-to-the-target-user) | `POST /api/hubs/{hub}/users/{user}/:send` |
| [Remove a user from all groups.](#delete-remove-a-user-from-all-groups) | `DELETE /api/hubs/{hub}/users/{user}/groups` |
| [Remove a user from the target group.](#delete-remove-a-user-from-the-target-group) | `DELETE /api/hubs/{hub}/users/{user}/groups/{group}` |
| [Check whether a user exists in the target group.](#head-check-whether-a-user-exists-in-the-target-group) | `HEAD /api/hubs/{hub}/users/{user}/groups/{group}` |
| [Add a user to the target group.](#put-add-a-user-to-the-target-group) | `PUT /api/hubs/{hub}/users/{user}/groups/{group}` |
### /api/auth/accessKey

#### GET
<a name="get-get-api-auth-accesskey"></a>
### get /api/auth/accessKey

`GET /api/auth/accessKey`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK | [AccessKeyResponse](#accesskeyresponse) |
| default | Error response |  |

### /api/health

#### HEAD
##### Summary

Get service health status.

<a name="head-get-service-health-status"></a>
### Get service health status

`HEAD /api/health`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | The service is healthy |
| default | Error response |

### /api/hubs/{hub}/:closeConnections

#### POST
##### Summary

Close all of the connections in the hub.

<a name="post-close-all-of-the-connections-in-the-hub"></a>
### Close all of the connections in the hub

`POST /api/hubs/{hub}/:closeConnections`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| excluded | query | Exclude these connectionIds when closing the connections in the hub. | No | [ string ] |
| reason | query | The reason closing the client connections. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 204 | No Content |  |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/:execute

#### POST
##### Summary

Execute commands in transaction for all of connections.

<a name="post-execute-commands-in-transaction-for-all-of-connections"></a>
### Execute commands in transaction for all of connections

`POST /api/hubs/{hub}/:execute`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| filter | query | Following OData filter syntax to filter out the subscribers. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |
| commands | body | Commands to execute in transaction. | Yes | [ [SignalRCommand](#signalrcommand) ] |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 202 | Accepted |  |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/:generateToken

#### POST
##### Summary

Generate token for the client to connect Azure SignalR service.

<a name="post-generate-token-for-the-client-to-connect-azure-signalr-service"></a>
### Generate token for the client to connect Azure SignalR service

`POST /api/hubs/{hub}/:generateToken`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| userId | query | User Id. | No | string |
| minutesToExpire | query | The expire time of the generated token. | No | integer |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK | [ClientTokenResponse](#clienttokenresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/:send

#### POST
##### Summary

Broadcast a message to all clients connected to target hub.

<a name="post-broadcast-a-message-to-all-clients-connected-to-target-hub"></a>
### Broadcast a message to all clients connected to target hub

`POST /api/hubs/{hub}/:send`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| excluded | query | Excluded connection Ids | No | [ string ] |
| api-version | query | The version of the REST APIs. | Yes | string |
| payload | body | The payload message. | Yes | [PayloadMessage](#payloadmessage) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 202 | Accepted | [ServiceResponse](#serviceresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/connections/{connectionId}

#### DELETE
##### Summary

Close the client connection

<a name="delete-close-the-client-connection"></a>
### Close the client connection

`DELETE /api/hubs/{hub}/connections/{connectionId}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| connectionId | path | The connection Id. | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| reason | query | The reason of the connection close. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK | [ServiceResponse](#serviceresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

#### HEAD
##### Summary

Check if the connection with the given connectionId exists

<a name="head-check-if-the-connection-with-the-given-connectionid-exists"></a>
### Check if the connection with the given connectionId exists

`HEAD /api/hubs/{hub}/connections/{connectionId}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| connectionId | path | The connection Id. | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| default | Error response |

### /api/hubs/{hub}/connections/{connectionId}/:invoke

#### POST
##### Summary

Invoke a method on a connection.

<a name="post-invoke-a-method-on-a-connection"></a>
### Invoke a method on a connection

`POST /api/hubs/{hub}/connections/{connectionId}/:invoke`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| connectionId | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |
| payload | body | The payload message. | Yes | [PayloadMessage](#payloadmessage) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK | [ClientInvocationResponse](#clientinvocationresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/connections/{connectionId}/:send

#### POST
##### Summary

Send message to the specific connection.

<a name="post-send-message-to-the-specific-connection"></a>
### Send message to the specific connection

`POST /api/hubs/{hub}/connections/{connectionId}/:send`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| connectionId | path | The connection Id. | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |
| payload | body | The payload message. | Yes | [PayloadMessage](#payloadmessage) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 202 | Accepted | [ServiceResponse](#serviceresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/connections/{connectionId}/groups

#### DELETE
##### Summary

Remove a connection from all groups

<a name="delete-remove-a-connection-from-all-groups"></a>
### Remove a connection from all groups

`DELETE /api/hubs/{hub}/connections/{connectionId}/groups`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| connectionId | path | Target connection Id | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK | [ServiceResponse](#serviceresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/connections/{connectionId}/streams/{streamId}/:complete

#### POST
##### Summary

Complete a streaming for the specific connection.

<a name="post-complete-a-streaming-for-the-specific-connection"></a>
### Complete a streaming for the specific connection

`POST /api/hubs/{hub}/connections/{connectionId}/streams/{streamId}/:complete`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| connectionId | path | The connection Id. | Yes | string |
| streamId | path | The stream Id. | Yes | string |
| reason | query | An error for completion. | No | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 202 | Accepted | [ServiceResponse](#serviceresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/connections/{connectionId}/streams/{streamId}/:send

#### POST
##### Summary

Send stream message to the specific stream for the connection.

<a name="post-send-stream-message-to-the-specific-stream-for-the-connection"></a>
### Send stream message to the specific stream for the connection

`POST /api/hubs/{hub}/connections/{connectionId}/streams/{streamId}/:send`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| connectionId | path | The connection Id. | Yes | string |
| streamId | path | The stream Id. | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| completed | query | Indicated current item is the last item of the stream. | No | boolean |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 202 | Accepted | [ServiceResponse](#serviceresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/groups/{group}

#### HEAD
##### Summary

Check if there are any client connections inside the given group

<a name="head-check-if-there-are-any-client-connections-inside-the-given-group"></a>
### Check if there are any client connections inside the given group

`HEAD /api/hubs/{hub}/groups/{group}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, which length should be greater than 0 and less than 1025. | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |
| default | Error response |

### /api/hubs/{hub}/groups/{group}/:closeConnections

#### POST
##### Summary

Close connections in the specific group.

<a name="post-close-connections-in-the-specific-group"></a>
### Close connections in the specific group

`POST /api/hubs/{hub}/groups/{group}/:closeConnections`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, which length should be greater than 0 and less than 1025. | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| excluded | query | Exclude these connectionIds when closing the connections in the hub. | No | [ string ] |
| reason | query | The reason closing the client connections. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 204 | No Content |  |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/groups/{group}/:send

#### POST
##### Summary

Broadcast a message to all clients within the target group.

<a name="post-broadcast-a-message-to-all-clients-within-the-target-group"></a>
### Broadcast a message to all clients within the target group

`POST /api/hubs/{hub}/groups/{group}/:send`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, which length should be greater than 0 and less than 1025. | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| excluded | query | Excluded connection Ids | No | [ string ] |
| api-version | query | The version of the REST APIs. | Yes | string |
| payload | body | The payload message. | Yes | [PayloadMessage](#payloadmessage) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 202 | Accepted | [ServiceResponse](#serviceresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/groups/{group}/connections

#### GET
##### Summary

List connections in a group.

<a name="get-list-connections-in-a-group"></a>
### List connections in a group

`GET /api/hubs/{hub}/groups/{group}/connections`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, whose length should be greater than 0 and less than 1025. | Yes | string |
| maxpagesize | query | The maximum number of connections to include in a single response. It should be between 1 and 200. | No | integer |
| top | query | The maximum number of connections to return. If the value is not set, then all the connections in a group are returned. | No | integer |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| continuationToken | query | A token that allows the client to retrieve the next page of results. This parameter is provided by the service in the response of a previous request when there are additional results to be fetched. Clients should include the continuationToken in the next request to receive the subsequent page of data. If this parameter is omitted, the server will return the first page of results. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK | [GroupMemberPagedValues](#groupmemberpagedvalues) |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/groups/{group}/connections/{connectionId}

#### DELETE
##### Summary

Remove a connection from the target group.

<a name="delete-remove-a-connection-from-the-target-group"></a>
### Remove a connection from the target group

`DELETE /api/hubs/{hub}/groups/{group}/connections/{connectionId}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, which length should be greater than 0 and less than 1025. | Yes | string |
| connectionId | path | Target connection Id | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK | [ServiceResponse](#serviceresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

#### PUT
##### Summary

Add a connection to the target group.

<a name="put-add-a-connection-to-the-target-group"></a>
### Add a connection to the target group

`PUT /api/hubs/{hub}/groups/{group}/connections/{connectionId}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, which length should be greater than 0 and less than 1025. | Yes | string |
| connectionId | path | Target connection Id | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK | [ServiceResponse](#serviceresponse) |
| 404 | Not Found |  |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/users/{user}

#### HEAD
##### Summary

Check if there are any client connections connected for the given user

<a name="head-check-if-there-are-any-client-connections-connected-for-the-given-user"></a>
### Check if there are any client connections connected for the given user

`HEAD /api/hubs/{hub}/users/{user}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| user | path | The user Id. | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |
| default | Error response |

### /api/hubs/{hub}/users/{user}/:closeConnections

#### POST
##### Summary

Close connections for the specific user.

<a name="post-close-connections-for-the-specific-user"></a>
### Close connections for the specific user

`POST /api/hubs/{hub}/users/{user}/:closeConnections`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| user | path | The user Id. | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| excluded | query | Exclude these connectionIds when closing the connections in the hub. | No | [ string ] |
| reason | query | The reason closing the client connections. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 204 | No Content |  |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/users/{user}/:send

#### POST
##### Summary

Broadcast a message to all clients belong to the target user.

<a name="post-broadcast-a-message-to-all-clients-belong-to-the-target-user"></a>
### Broadcast a message to all clients belong to the target user

`POST /api/hubs/{hub}/users/{user}/:send`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| user | path | The user Id. | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |
| payload | body | The payload message. | Yes | [PayloadMessage](#payloadmessage) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 202 | Accepted | [ServiceResponse](#serviceresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/users/{user}/groups

#### DELETE
##### Summary

Remove a user from all groups.

<a name="delete-remove-a-user-from-all-groups"></a>
### Remove a user from all groups

`DELETE /api/hubs/{hub}/users/{user}/groups`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| user | path | Target user Id | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 204 | No Content |  |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/users/{user}/groups/{group}

#### DELETE
##### Summary

Remove a user from the target group.

<a name="delete-remove-a-user-from-the-target-group"></a>
### Remove a user from the target group

`DELETE /api/hubs/{hub}/users/{user}/groups/{group}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, which length should be greater than 0 and less than 1025. | Yes | string |
| user | path | Target user Id | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 204 | No Content |  |
| default | Error response | [ErrorDetail](#errordetail) |

#### HEAD
##### Summary

Check whether a user exists in the target group.

<a name="head-check-whether-a-user-exists-in-the-target-group"></a>
### Check whether a user exists in the target group

`HEAD /api/hubs/{hub}/users/{user}/groups/{group}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, which length should be greater than 0 and less than 1025. | Yes | string |
| user | path | Target user Id | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |
| default | Error response |

#### PUT
##### Summary

Add a user to the target group.

<a name="put-add-a-user-to-the-target-group"></a>
### Add a user to the target group

`PUT /api/hubs/{hub}/users/{user}/groups/{group}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, which length should be greater than 0 and less than 1025. | Yes | string |
| user | path | Target user Id | Yes | string |
| application | query | Target application name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | No | string |
| ttl | query | Specifies the seconds that the user exists in the group. If not set, the user lives in the group for 1 year at most. If a user is added to some groups without ttl limitation, only the latest updated 100 groups will be reserved among all groups the user joined without TTL. If ttl = 0, only the current connected connections of the target user will be added to the target group. | No | integer |
| api-version | query | The version of the REST APIs. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK | [ServiceResponse](#serviceresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

### Models

#### AccessKeyResponse

The response object containing the dynamic access key for signing client tokens.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| AccessKey | string | The string value of the access key for SignalR app server to sign client tokens. | No |
| KeyId | string | The ID of the access key. | No |

#### ByteReadOnlyMemoryIAsyncEnumerable

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| ByteReadOnlyMemoryIAsyncEnumerable | object |  |  |

#### ClientInvocationResponse

The response object for client invocation rest API

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| result |  | The result of the invocation returned from the client (optional) | No |
| protocol | string | The protocol used by the client (optional, available if not json or mspack) | No |

#### ClientTokenResponse

The response object containing the token for the client

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| token | string | The token value for the WebSocket client to connect to the service | No |

#### CloseConnection

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| CloseConnection |  |  |  |

#### ErrorDetail

The error object.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string | One of a server-defined set of error codes. | No |
| message | string | A human-readable representation of the error. | No |
| target | string | The target of the error. | No |
| details | [ [ErrorDetail](#errordetail) ] | An array of details about specific errors that led to this reported error. | No |
| inner | [InnerError](#innererror) |  | No |

#### GroupMember

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| connectionId | string | A unique identifier of a connection.<br>_Example:_ `"connection1"` | Yes |
| userId | string | The user ID of the connection. A user can have multiple connections.<br>_Example:_ `"user1"` | No |

#### GroupMemberPagedValues

Represents a page of elements as a LIST REST API result.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| value | [ [GroupMember](#groupmember) ] |  | Yes |
| nextLink | string (uri) | An absolute URL that the client can GET in order to retrieve the next page of the collection. | No |

#### InnerError

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string | A more specific error code than was provided by the containing error. | No |
| inner | [InnerError](#innererror) |  | No |

#### JoinGroup

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| JoinGroup |  |  |  |

#### LeaveGroup

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| LeaveGroup |  |  |  |

#### PayloadMessage

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| target | string |  | Yes |
| arguments | [  ] |  | No |

#### SendMessage

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| SendMessage |  |  |  |

#### ServiceResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| statusCode | integer | _Enum:_ `100`, `101`, `102`, `103`, `200`, `201`, `202`, `203`, `204`, `205`, `206`, `207`, `208`, `226`, `300`, `301`, `302`, `303`, `304`, `305`, `306`, `307`, `308`, `400`, `401`, `402`, `403`, `404`, `405`, `406`, `407`, `408`, `409`, `410`, `411`, `412`, `413`, `414`, `415`, `416`, `417`, `421`, `422`, `423`, `424`, `426`, `428`, `429`, `431`, `451`, `500`, `501`, `502`, `503`, `504`, `505`, `506`, `507`, `508`, `510`, `511` | No |
| code | string |  | No |
| level | string | _Enum:_ `"Info"`, `"Warning"`, `"Error"` | No |
| scope | string | _Enum:_ `"Unknown"`, `"Request"`, `"Connection"`, `"User"`, `"Group"` | No |
| errorKind | string | _Enum:_ `"Unknown"`, `"NotExisted"`, `"NotInGroup"`, `"Invalid"` | No |
| message | string |  | No |
| jsonObject |  |  | No |
| isSuccess | boolean |  | No |
| stream | [ByteReadOnlyMemoryIAsyncEnumerable](#bytereadonlymemoryiasyncenumerable) |  | No |

#### SignalRCommand

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| type | string | _Enum:_ `"SendMessage"`, `"JoinGroup"`, `"LeaveGroup"`, `"CloseConnection"` | Yes |
