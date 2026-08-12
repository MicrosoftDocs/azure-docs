---
title: REST API for Teams Phone extensibility
titleSuffix: An Azure Communication Services article
description: This article describes the REST API structure for Teams Phone Extensibility.
author: sofiar
manager: miguelher
services: azure-communication-services
ms.author: sofiar
ms.date: 09/01/2025
ms.topic: reference
ms.service: azure-communication-services
ms.subservice: identity
---

# REST API for Teams Phone Extensibility

This article describes REST API for Teams Phone extensibility.

For an end-to-end walkthrough with concrete request and response examples, see [Access a user's Teams Phone separate from their Teams client](./teams-phone-extensibility-access-teams-phone.md).

## Create assignment

Create an assignment to give a Teams user or Teams resource account access to the Communication Services resource.

```http
PUT {endpoint}/access/teamsExtension/tenants/{tenantId}/assignments/{objectId}?api-version=2025-06-30
```

### URI parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `objectId` | path | true | string | Object ID of the principal, that is, the user ID or resource account ID. |
| `tenantId` | path | true | string | Tenant ID of the tenant that the principal belongs to. |
| `api-version` | query | true | string | Version of API to invoke. |

### Request body

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `request` | body | true | [TeamsExtensionAssignmentCreateOrUpdateRequest](#teamsextensionassignmentcreateorupdaterequest) | Request for teams account assignment. |

### Responses

| Name | Type | Description |
| --- | --- | --- |
| 200 OK | [TeamsExtensionAssignmentResponse](#teamsextensionassignmentresponse) | Created - Returns the updated assignment. |
| 201 Created | [TeamsExtensionAssignmentResponse](#teamsextensionassignmentresponse) | Created - Returns the created assignment. |
| Other Status Codes | [CommunicationErrorResponse](#communicationerrorresponse) | Error. |

### Example

```http
PUT {endpoint}/access/teamsExtension/tenants/aaaabbbb-0000-cccc-1111-dddd2222eeee/assignments/aaaaaaaa-bbbb-cccc-1111-222222222222?api-version=2025-06-30
```

```json
{
  "principalType": "user",
  "clientIds": ["00001111-aaaa-2222-bbbb-3333cccc4444"]
}
```

A successful request returns `201 Created` (or `200 OK` when it updates an existing assignment):

```json
{
  "objectId": "aaaaaaaa-bbbb-cccc-1111-222222222222",
  "tenantId": "aaaabbbb-0000-cccc-1111-dddd2222eeee",
  "principalType": "user",
  "clientIds": ["00001111-aaaa-2222-bbbb-3333cccc4444"]
}
```

## Get assignment

Get the assignment for a resource access from a Teams user or Teams resource account.

```http
GET {endpoint}/access/teamsExtension/tenants/{tenantId}/assignments/{objectId}?api-version=2025-06-30
```

### URI parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `objectId` | path | true | string | Object ID of the principal, that is, the user ID or resource account ID. |
| `tenantId` | path | true | string | Tenant ID of the tenant that the principal belongs to. |
| `api-version` | query | true | string | Version of API to invoke. |

### Responses

| Name | Type | Description |
| --- | --- | --- |
| 200 OK | [TeamsExtensionAssignmentResponse](#teamsextensionassignmentresponse) | Returns the assignment. |
| Other Status Codes | [CommunicationErrorResponse](#communicationerrorresponse) | Error. |

### Example

```http
GET {endpoint}/access/teamsExtension/tenants/aaaabbbb-0000-cccc-1111-dddd2222eeee/assignments/aaaaaaaa-bbbb-cccc-1111-222222222222?api-version=2025-06-30
```

A successful request returns `200 OK`:

```json
{
  "objectId": "aaaaaaaa-bbbb-cccc-1111-222222222222",
  "tenantId": "aaaabbbb-0000-cccc-1111-dddd2222eeee",
  "principalType": "user",
  "clientIds": ["00001111-aaaa-2222-bbbb-3333cccc4444"]
}
```

## Delete assignment

Delete the assignment to remove resource access from a Teams user or Teams resource account.

```http
DELETE {endpoint}/access/teamsExtension/tenants/{tenantId}/assignments/{objectId}?api-version=2025-06-30
```

### URI parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `objectId` | path | true | string | Object ID of the principal, that is, the user ID or resource account ID. |
| `tenantId` | path | true | string | Tenant ID of the tenant that the principal belongs to. |
| `api-version` | query | true | string | Version of API to invoke. |

### Responses

| Name | Type | Description |
| --- | --- | --- |
| 204 NoContent | Empty | Successful status code. |
| Other Status Codes | [CommunicationErrorResponse](#communicationerrorresponse) | Error. |

### Example

```http
DELETE {endpoint}/access/teamsExtension/tenants/aaaabbbb-0000-cccc-1111-dddd2222eeee/assignments/aaaaaaaa-bbbb-cccc-1111-222222222222?api-version=2025-06-30
```

A successful request returns `204 No Content` with an empty body:

```http
HTTP/1.1 204 NoContent
```

## Definitions

| Name | Description |
| --- | --- |
| [`CommunicationError`](#communicationerror) | The Communication Services error. |
| [`CommunicationErrorResponse`](#communicationerrorresponse) | The Communication Services error. |
| [`TeamsExtensionAssignmentCreateOrUpdateRequest`](#teamsextensionassignmentcreateorupdaterequest) | Request for creating or replacing an assignment. |
| `principalType` | Type of the principal accessing the resource, either `"user"` or `"teamsResourceAccount"`. |
| [`TeamsExtensionAssignmentResponse`](#teamsextensionassignmentresponse) | A Teams Phone assignment. |

### CommunicationError

| Name | Type | Description |
| --- | --- | --- |
| `code` | string | The error code. |
| `details` | [`CommunicationError`](#communicationerror)[] | Further details about specific errors that led to this error. |
| `innererror` | [`CommunicationError`](#communicationerror) | The inner error if any. |
| `message` | string | The error message. |
| `target` | string | The error target. |

### CommunicationErrorResponse

| Name | Type | Description |
| --- | --- | --- |
| `error` | [`CommunicationError`](#communicationerror) | The Communication Services error. |

### TeamsExtensionAssignmentCreateOrUpdateRequest

| Name | Type | Description |
| --- | --- | --- |
| `principalType` | string | Type of the principal accessing the resource, either `"user"` or `"teamsResourceAccount"`. |
| `clientIds` | string[] | List of IDs for the applications through which a `"user"` principal can access the resource. |

### TeamsExtensionAssignmentResponse

| Name | Type | Description |
| --- | --- | --- |
| `objectId` | string | Object ID of the assignment's principal. |
| `tenantId` | string | Tenant ID. |
| `principalType` | string | Type of the principal accessing the resource, either `"user"` or `"teamsResourceAccount"`. |
| `clientIds` | string[] | List of IDs for the applications through which a `"user"` principal can access the resource. |

## Related articles

- [Teams Phone extensibility overview](../../concepts/interop/tpe/teams-phone-extensibility-overview.md)
- [Teams Phone System extensibility quick start](./teams-phone-extensibility-quickstart.md)