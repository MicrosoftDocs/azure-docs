---
title: Azure SignalR service data plane REST API reference - v20220601
description: Describes REST APIs version v20220601 Azure SignalR service supports to manage the connections and send messages to them.
author: vwxyzh
ms.author: zhyan
ms.service: signalr
ms.topic: reference
ms.date: 02/22/2023
---

# Azure SignalR Service REST API
## Version: 2022-06-01

### Available APIs

| API | Path |
| ---- | ---------- |
| [Get service health status.](#head-get-service-health-status) | `HEAD /api/health` |
| [Close all of the connections in the hub.](#post-close-all-of-the-connections-in-the-hub) | `POST /api/hubs/{hub}/:closeConnections` |
| [Broadcast a message to all clients connected to target hub.](#post-broadcast-a-message-to-all-clients-connected-to-target-hub) | `POST /api/hubs/{hub}/:send` |
| [Check if the connection with the given connectionId exists](#head-check-if-the-connection-with-the-given-connectionid-exists) | `HEAD /api/hubs/{hub}/connections/{connectionId}` |
| [Close the client connection](#delete-close-the-client-connection) | `DELETE /api/hubs/{hub}/connections/{connectionId}` |
| [Send message to the specific connection.](#post-send-message-to-the-specific-connection) | `POST /api/hubs/{hub}/connections/{connectionId}/:send` |
| [Check if there are any client connections inside the given group](#head-check-if-there-are-any-client-connections-inside-the-given-group) | `HEAD /api/hubs/{hub}/groups/{group}` |
| [Close connections in the specific group.](#post-close-connections-in-the-specific-group) | `POST /api/hubs/{hub}/groups/{group}/:closeConnections` |
| [Broadcast a message to all clients within the target group.](#post-broadcast-a-message-to-all-clients-within-the-target-group) | `POST /api/hubs/{hub}/groups/{group}/:send` |
| [Add a connection to the target group.](#put-add-a-connection-to-the-target-group) | `PUT /api/hubs/{hub}/groups/{group}/connections/{connectionId}` |
| [Remove a connection from the target group.](#delete-remove-a-connection-from-the-target-group) | `DELETE /api/hubs/{hub}/groups/{group}/connections/{connectionId}` |
| [Remove a connection from all groups](#delete-remove-a-connection-from-all-groups) | `DELETE /api/hubs/{hub}/connections/{connectionId}/groups` |
| [Check if there are any client connections connected for the given user](#head-check-if-there-are-any-client-connections-connected-for-the-given-user) | `HEAD /api/hubs/{hub}/users/{user}` |
| [Close connections for the specific user.](#post-close-connections-for-the-specific-user) | `POST /api/hubs/{hub}/users/{user}/:closeConnections` |
| [Broadcast a message to all clients belong to the target user.](#post-broadcast-a-message-to-all-clients-belong-to-the-target-user) | `POST /api/hubs/{hub}/users/{user}/:send` |
| [Check whether a user exists in the target group.](#head-check-whether-a-user-exists-in-the-target-group) | `HEAD /api/hubs/{hub}/users/{user}/groups/{group}` |
| [Add a user to the target group.](#put-add-a-user-to-the-target-group) | `PUT /api/hubs/{hub}/users/{user}/groups/{group}` |
| [Remove a user from the target group.](#delete-remove-a-user-from-the-target-group) | `DELETE /api/hubs/{hub}/users/{user}/groups/{group}` |
| [Remove a user from all groups.](#delete-remove-a-user-from-all-groups) | `DELETE /api/hubs/{hub}/users/{user}/groups` |
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
| 204 | Success |  |
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
| message | body | The payload message. | Yes | [PayloadMessage](#payloadmessage) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 202 | Success | [ServiceResponse](#serviceresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/connections/{connectionId}

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

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [ServiceResponse](#serviceresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

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
| 200 | Success | [ServiceResponse](#serviceresponse) |
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
| message | body | The payload message. | Yes | [PayloadMessage](#payloadmessage) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 202 | Success | [ServiceResponse](#serviceresponse) |
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

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [ServiceResponse](#serviceresponse) |
| 404 | Not Found |  |
| default | Error response | [ErrorDetail](#errordetail) |

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
| 204 | Success |  |
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
| message | body | The payload message. | Yes | [PayloadMessage](#payloadmessage) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 202 | Success | [ServiceResponse](#serviceresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/groups/{group}/connections/{connectionId}

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
| 200 | Success | [ServiceResponse](#serviceresponse) |
| 404 | Not Found |  |
| default | Error response | [ErrorDetail](#errordetail) |

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
| 200 | Success | [ServiceResponse](#serviceresponse) |
| 404 | Not Found |  |
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
| 200 | Success | [ServiceResponse](#serviceresponse) |
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

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [ServiceResponse](#serviceresponse) |
| 404 | Not Found |  |
| default | Error response | [ErrorDetail](#errordetail) |

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
| 204 | Success |  |
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
| message | body | The payload message. | Yes | [PayloadMessage](#payloadmessage) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 202 | Success | [ServiceResponse](#serviceresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

### /api/hubs/{hub}/users/{user}/groups/{group}

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

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [ServiceResponse](#serviceresponse) |
| 404 | Not Found |  |
| default | Error response | [ErrorDetail](#errordetail) |

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
| 200 | Success | [ServiceResponse](#serviceresponse) |
| default | Error response | [ErrorDetail](#errordetail) |

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
| 204 | Success |  |
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
| 204 | Success |  |
| default | Error response | [ErrorDetail](#errordetail) |

### Models

#### ErrorDetail

The error object.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string | One of a server-defined set of error codes. | No |
| message | string | A human-readable representation of the error. | No |
| target | string | The target of the error. | No |
| details | [ [ErrorDetail](#errordetail) ] | An array of details about specific errors that led to this reported error. | No |
| inner | [InnerError](#innererror) |  | No |

#### InnerError

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string | A more specific error code than was provided by the containing error. | No |
| inner | [InnerError](#innererror) |  | No |

#### PayloadMessage

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| target | string |  | Yes |
| arguments | [  ] |  | No |

#### ServiceResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string |  | No |
| level | string | _Enum:_ `"Info"`, `"Warning"`, `"Error"` | No |
| scope | string | _Enum:_ `"Unknown"`, `"Request"`, `"Connection"`, `"User"`, `"Group"` | No |
| errorKind | string | _Enum:_ `"Unknown"`, `"NotExisted"`, `"NotInGroup"`, `"Invalid"` | No |
| message | string |  | No |
| jsonObject |  |  | No |
| isSuccess | boolean |  | No |
