---
title: Azure SignalR service data plane REST API reference - v1-preview
description: Describes REST APIs version v1-preview Azure SignalR service supports to manage the connections and send messages to them.
author: vicancy
ms.author: lianwei
ms.service: signalr
ms.topic: reference
ms.date: 06/09/2022
---

# Azure SignalR Service data plane REST API - v1-preview

This article contains the obsoleted v1-preview version REST APIs for Azure SignalR Service data plane. Please use the [latest version](./signalr-data-plane-rest-v1.md) instead.

## Available APIs

| API | Path |
| ---- | ---------- | 
| [post /api/v1-preview/hub/{hub}/user/{id}](#post-apiv1-previewhubhubuserid) | `POST /api/v1-preview/hub/{hub}/user/{id}` |
| [post /api/v1-preview/hub/{hub}/users/{userList}](#post-apiv1-previewhubhubusersuserlist) | `POST /api/v1-preview/hub/{hub}/users/{userList}` |
| [post /api/v1-preview/hub/{hub}](#post-apiv1-previewhubhub) | `POST /api/v1-preview/hub/{hub}` |
| [post /api/v1-preview/hub/{hub}/group/{group}](#post-apiv1-previewhubhubgroupgroup) | `POST /api/v1-preview/hub/{hub}/group/{group}` |
| [post /api/v1-preview/hub/{hub}/groups/{groupList}](#post-apiv1-previewhubhubgroupsgrouplist) | `POST /api/v1-preview/hub/{hub}/groups/{groupList}` |

### post /api/v1-preview/hub/{hub}/user/{id}

`POST /api/v1-preview/hub/{hub}/user/{id}`
##### Description:

Send a message to a single user.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| id | path | Target user Id. | Yes | string |
| message | body |  | Yes | [Message](#message) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 202 | Accepted |

### post /api/v1-preview/hub/{hub}/users/{userList}

`POST /api/v1-preview/hub/{hub}/users/{userList}`
##### Description:

Send a message to multiple users.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| userList | path | Comma-separated list of user Ids. | Yes | string |
| message | body |  | Yes | [Message](#message) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 202 | Accepted |

### post /api/v1-preview/hub/{hub}

`POST /api/v1-preview/hub/{hub}`
##### Description:

Broadcast a message to all clients connected to target hub.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which should start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| message | body |  | Yes | [Message](#message) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 202 | Accepted |

### post /api/v1-preview/hub/{hub}/group/{group}

`POST /api/v1-preview/hub/{hub}/group/{group}`
##### Description:

Broadcast a message to all clients within the target group.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which must start with alphabetic characters and contain only alpha-numeric characters or underscore. | Yes | string |
| group | path | Target group name, which must start with alphabetic characters and contain only alpha-numeric characters or underscore. | Yes | string |
| message | body |  | Yes | [Message](#message) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 202 | Accepted |

### post /api/v1-preview/hub/{hub}/groups/{groupList}

`POST /api/v1-preview/hub/{hub}/groups/{groupList}`
##### Description:

Broadcast a message to all clients within the target groups.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| hub | path | Target hub name, which must start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| groupList | path | Comma-separated list of group names. Each group name must start with alphabetic characters and only contain alpha-numeric characters or underscore. | Yes | string |
| message | body |  | Yes | [Message](#message) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 202 | Accepted |

### Models


#### Message

Method invocation message.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| target | string | Target method name. | No |
| arguments | [ object ] | Target method arguments. | No |