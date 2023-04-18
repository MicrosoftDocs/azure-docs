---
title: Azure SignalR service data plane REST API reference - v1
description: Describes the REST APIs version v1 Azure SignalR service supports to manage the connections and send messages to them.
author: vicancy
ms.author: lianwei
ms.service: signalr
ms.topic: reference
ms.date: 06/09/2022
---

# Azure SignalR Service data plane REST API - v1

This article contains the v1 version REST APIs for Azure SignalR Service data plane. 

## Available APIs

| API | Path |
| ---- | ---------- | 
| [Broadcast a message to all clients connected to target hub.](#broadcast-a-message-to-all-clients-connected-to-target-hub) | `POST /api/v1/hubs/{hub}` |
| [Broadcast a message to all clients belong to the target user.](#broadcast-a-message-to-all-clients-belong-to-the-target-user) | `POST /api/v1/hubs/{hub}/users/{id}` |
| [Send message to the specific connection.](#send-message-to-the-specific-connection) | `POST /api/v1/hubs/{hub}/connections/{connectionId}` |
| [Check if the connection with the given connectionId exists](#check-if-the-connection-with-the-given-connectionid-exists) | `GET /api/v1/hubs/{hub}/connections/{connectionId}` |
| [Close the client connection](#close-the-client-connection) | `DELETE /api/v1/hubs/{hub}/connections/{connectionId}` |
| [Broadcast a message to all clients within the target group.](#broadcast-a-message-to-all-clients-within-the-target-group) | `POST /api/v1/hubs/{hub}/groups/{group}` |
| [Check if there are any client connections inside the given group](#check-if-there-are-any-client-connections-inside-the-given-group) | `GET /api/v1/hubs/{hub}/groups/{group}` |
| [Check if there are any client connections connected for the given user](#check-if-there-are-any-client-connections-connected-for-the-given-user) | `GET /api/v1/hubs/{hub}/users/{user}` |
| [Add a connection to the target group.](#add-a-connection-to-the-target-group) | `PUT /api/v1/hubs/{hub}/groups/{group}/connections/{connectionId}` |
| [Remove a connection from the target group.](#remove-a-connection-from-the-target-group) | `DELETE /api/v1/hubs/{hub}/groups/{group}/connections/{connectionId}` |
| [Check whether a user exists in the target group.](#check-whether-a-user-exists-in-the-target-group) | `GET /api/v1/hubs/{hub}/groups/{group}/users/{user}` |
| [Add a user to the target group.](#add-a-user-to-the-target-group) | `PUT /api/v1/hubs/{hub}/groups/{group}/users/{user}` |
| [Remove a user from the target group.](#remove-a-user-from-the-target-group) | `DELETE /api/v1/hubs/{hub}/groups/{group}/users/{user}` |
| [Remove a user from all groups.](#remove-a-user-from-all-groups) | `DELETE /api/v1/hubs/{hub}/users/{user}/groups` |

### Broadcast a message to all clients connected to target hub.

`POST /api/v1/hubs/{hub}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which must start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| excluded | query | Excluded connection Ids | No | [ string ] |

##### Responses

| Code | Description |
| ---- | ----------- |
| 202 | Success |
| 400 | Bad Request |

### Broadcast a message to all clients belong to the target user.

`POST /api/v1/hubs/{hub}/users/{id}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which must start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| id | path | The user Id. | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 202 | Success |
| 400 | Bad Request |

### Send message to the specific connection.

`POST /api/v1/hubs/{hub}/connections/{connectionId}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which must start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| connectionId | path | The connection Id. | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 202 | Success |
| 400 | Bad Request |

### Check if the connection with the given connectionId exists

`GET /api/v1/hubs/{hub}/connections/{connectionId}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path |  | Yes | string |
| connectionId | path |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |

### Close the client connection

`DELETE /api/v1/hubs/{hub}/connections/{connectionId}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path |  | Yes | string |
| connectionId | path |  | Yes | string |
| reason | query |  | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 202 | Success |
| 400 | Bad Request |

### Broadcast a message to all clients within the target group.

`POST /api/v1/hubs/{hub}/groups/{group}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which must start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, whose length must be greater than 0 and less than 1025. | Yes | string |
| excluded | query | Excluded connection Ids | No | [ string ] |

##### Responses

| Code | Description |
| ---- | ----------- |
| 202 | Success |
| 400 | Bad Request |

### Check if there are any client connections inside the given group

`GET /api/v1/hubs/{hub}/groups/{group}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path |  | Yes | string |
| group | path |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |

### Check if there are any client connections connected for the given user

`GET /api/v1/hubs/{hub}/users/{user}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path |  | Yes | string |
| user | path |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |

### Add a connection to the target group.

`PUT /api/v1/hubs/{hub}/groups/{group}/connections/{connectionId}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which must start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, whose length must be greater than 0 and less than 1025. | Yes | string |
| connectionId | path | Target connection Id | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |

### Remove a connection from the target group.

`DELETE /api/v1/hubs/{hub}/groups/{group}/connections/{connectionId}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which must start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, whose length must be greater than 0 and less than 1025. | Yes | string |
| connectionId | path | Target connection Id | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |

### Check whether a user exists in the target group.

`GET /api/v1/hubs/{hub}/groups/{group}/users/{user}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which must start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, whose length must be greater than 0 and less than 1025. | Yes | string |
| user | path | Target user Id | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |

### Add a user to the target group.

`PUT /api/v1/hubs/{hub}/groups/{group}/users/{user}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which must start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, whose length must be greater than 0 and less than 1025. | Yes | string |
| user | path | Target user Id | Yes | string |
| ttl | query | Specifies the seconds that the user exists in the group. If not set, the user lives in the group for at most 1 year. Note that when ttl is not set, the service preserves 100 user-group relationships per user and old user-group relationship are overwritten by newly added ones. | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 202 | Success |
| 400 | Bad Request |

### Remove a user from the target group.

`DELETE /api/v1/hubs/{hub}/groups/{group}/users/{user}`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which must start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, whose length must be greater than 0 and less than 1025. | Yes | string |
| user | path | Target user Id | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 202 | Success |
| 400 | Bad Request |

### Remove a user from all groups.

`DELETE /api/v1/hubs/{hub}/users/{user}/groups`
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which must start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| user | path | Target user Id | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | The user is deleted |
| 202 | The delete request is accepted and the service is handling the request in the background |
| 400 | Bad Request |

### Models


#### PayloadMessage

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| Target | string |  | No |
| Arguments | [ object ] |  | No |