---
title: Azure App Configuration REST API - snapshot
description: Reference pages for working with snapshots by using the Azure App Configuration REST API
author: jimmyca15
ms.author: jimmyca
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 03/21/2023
---

# Azure App Configuration REST API: snapshots

A snapshot is a resource identified uniquely by its name. See details for each operation.

This article applies to API version 2022-11-01-preview.

## Operations

- Get
- List multiple
- Create
- Archive/Recover
- List key-values

## Prerequisites

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-rest-api-prereqs.md)]

## Syntax

`Snapshot`

```json
{
    "etag": [string],
    "name": [string],
    "status": [string, enum("provisioning", "ready", "archived", "failed")],
    "filters": [array<SnapshotFilter>],
    "composition_type": [string, enum("key", "key_label")],
    "created": [datetime ISO 8601],
    "size": [number, bytes],
    "items_count": [number],
    "tags": [object with string properties],
    "retention_period": [number, timespan in seconds],
    "expires": [datetime ISO 8601]
}
```

`SnapshotFilter`

```json
{
  "key": [string],
  "label": [string]
}
```

## Get snapshot

Required: ``{name}``, ``{api-version}``  

```http
GET /snapshots/{name}?api-version={api-version}
```

**Responses:**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.snapshot+json; charset=utf-8
Last-Modified: Mon, 03 Mar 2023 9:00:03 GMT
ETag: "4f6dd610dd5e4deebc7fbaef685fb903"
Link: </kv?snapshot=prod-2023-03-20&api-version={api-version}>; rel="items"
```

```json
{
  "etag": "4f6dd610dd5e4deebc7fbaef685fb903",
  "name": "prod-2023-03-20",
  "status": "ready",
  "filters": [
      {
          "key": "*",
          "label": null
      }
  ],
  "composition_type": "key",
  "created": "2023-03-20T21:00:03+00:00",
  "size": 2000,
  "items_count": 4,
  "tags": {
    "t1": "value1",
    "t2": "value2"
  },
  "retention_period": 7776000
}
```

If a snapshot with the provided name doesn't exist, the following response is returned:

```http
HTTP/1.1 404 Not Found
```

## Get (conditionally)

To improve client caching, use `If-Match` or `If-None-Match` request headers. The `etag` argument is part of the snapshot representation. For more information, see [sections 14.24 and 14.26](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html).

The following request retrieves the snapshot only if the current representation doesn't match the specified `etag`:

```http
GET /snapshot/{name}?api-version={api-version} HTTP/1.1
Accept: application/vnd.microsoft.appconfig.snapshot+json;
If-None-Match: "{etag}"
```

**Responses:**

```http
HTTP/1.1 304 NotModified
```

or

```http
HTTP/1.1 200 OK
```

## List snapshots

Optional: ``name`` (If not specified, it implies any name.)
Optional: ``status`` (If not specified, it implies any status.)

```http
GET /snapshots?name=prod-*&api-version={api-version} HTTP/1.1
```

**Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.snapshotset+json; charset=utf-8
```

For additional options, see the "Filtering" section later in this article.

## Pagination

The result is paginated if the number of items returned exceeds the response limit. Follow the optional `Link` response headers, and use `rel="next"` for navigation.
Alternatively, the content provides a next link in form of the `@nextLink` property. The linked URI includes the `api-version` argument.

```http
GET /snapshots?api-version={api-version} HTTP/1.1
```

**Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.snapshotset+json; charset=utf-8
Link: <{relative uri}>; rel="next"
```

```json
{
    "items": [
        ...
    ],
    "@nextLink": "{relative uri}"
}
```

## Filtering

A combination of `name` and `status` filtering is supported.
Use the optional `name` and `status` query string parameters.

```http
GET /snapshots?name={name}&status={status}&api-version={api-version}
```

### Supported filters

|Name filter|Effect|
|--|--|
|`name` is omitted or `name=*`|Matches snapshots with **any** name|
|`name=abc`|Matches a snapshot named **abc**|
|`name=abc*`|Matches snapshots with names that start with **abc**|
|`name=abc,xyz`|Matches snapshots with names **abc** or **xyz** (limited to 5 CSV)|

|Status filter|Effect|
|--|--|
|`status` is omitted or `status=*`|Matches snapshots with **any** status|
|`status=ready`|Matches snapshots with a **ready** status|
|`status=ready,archived`|Matches snapshots with **ready** or **archived** status (limited to 5 CSV)|

***Reserved characters***

`*`, `\`, `,`

If a reserved character is part of the value, then it must be escaped by using `\{Reserved Character}`. Non-reserved characters can also be escaped.

***Filter validation***

In the case of a filter validation error, the response is HTTP `400` with error details:

```http
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json; charset=utf-8
```

```json
{
  "type": "https://azconfig.io/errors/invalid-argument",
  "title": "Invalid request parameter '{filter}'",
  "name": "{filter}",
  "detail": "{filter}(2): Invalid character",
  "status": 400
}
```

**Examples**

- All

    ```http
    GET /snapshots?api-version={api-version}
    ```

- Snapshot name starts with **abc**

    ```http
    GET /snapshot?name=abc*&api-version={api-version}
    ```

- Snapshot name starts with **abc** and status equals **ready** or **archived**

    ```http
    GET /snapshot?name=abc*&status=ready,archived&api-version={api-version}
    ```

## Request specific fields

Use the optional `$select` query string parameter and provide a comma-separated list of requested fields. If the `$select` parameter is omitted, the response contains the default set.

```http
GET /snapshot?$select=name,status&api-version={api-version} HTTP/1.1
```

## Create snapshot

**parameters**

| Property Name | Required | Default value | Validation |
|-|-|-|-|
| name | yes | n/a | Length <br/> &nbsp;&nbsp;&nbsp;&nbsp; maximum: 256 | 
| filters | yes | n/a | Count <br/> &nbsp;&nbsp;&nbsp;&nbsp; minimum: 1<br/> &nbsp;&nbsp;&nbsp;&nbsp; maximum: 3 |
| filters[\<index\>].key | yes | n/a | |
| tags | no | {} | |
| filters[\<index\>].label | no | null | Multi-match label filters (E.g.: "*", "comma,separated") aren't supported with 'key' composition type. |
| composition_type | no | key | |
| retention_period | no | Standard tier <br/>&nbsp;&nbsp;&nbsp;&nbsp; 2592000 (30 days) <br/> Free tier <br/> &nbsp;&nbsp;&nbsp;&nbsp; 604800 (7 days) | Standard tier <br/> &nbsp;&nbsp;&nbsp;&nbsp; minimum: 3600 (1 hour) <br/> &nbsp;&nbsp;&nbsp;&nbsp; maximum: 7776000 (90 days) <br/> Free tier <br/> &nbsp;&nbsp;&nbsp;&nbsp; minimum: 3600 (1 hour) <br/> &nbsp;&nbsp;&nbsp;&nbsp; maximum: 604800 (7 days) |

```http
PUT /snapshot/{name}?api-version={api-version} HTTP/1.1
Content-Type: application/vnd.microsoft.appconfig.snapshot+json
```

```json
{
  "filters": [                        // required
    {
      "key": "app1/*",                // required
      "label": "prod"                 // optional
    }
  ],
  "tags": {                           // optional
    "tag1": "value1",
    "tag2": "value2",
  },
  "composition_type": "key",          // optional
  "retention_period": 2592000         // optional
}
```

**Responses:**

```http
HTTP/1.1 201 Created
Content-Type: application/vnd.microsoft.appconfig.snapshot+json; charset=utf-8
Last-Modified: Tue, 05 Dec 2017 02:41:26 GMT
ETag: "4f6dd610dd5e4deebc7fbaef685fb903"
Operation-Location: {appConfigurationEndpoint}/operations?snapshot={name}&api-version={api-version}
```

```json
{
  "etag": "4f6dd610dd5e4deebc7fbaef685fb903",
  "name": "{name}",
  "status": "provisioning",
  "filters": [
      {
          "key": "app1/*",
          "label": "prod"
      }
  ],
  "composition_type": "key",
  "created": "2023-03-20T21:00:03+00:00",
  "size": 2000,
  "items_count": 4,
  "tags": {
    "t1": "value1",
    "t2": "value2"
  },
  "retention_period": 2592000
}
```

The status of the newly created snapshot will be "provisioning".
Once the snapshot is fully provisioned, the status will update to "ready".
Clients can poll the snapshot to wait for the snapshot to be ready before listing its associated key-values.
To query additional information about the operation, reference the [polling snapshot creation](#polling-snapshot-creation) section.

If the snapshot already exists, you'll receive the following response:

```http
HTTP/1.1 409 Conflict
Content-Type: application/problem+json; charset=utf-8
```

```json
{
    "type": "https://azconfig.io/errors/already-exists",
    "title": "The resource already exists.",
    "status": 409,
    "detail": ""
}
```

### Polling snapshot creation

The response of a snapshot creation request returns an `Operation-Location` header.

**Responses:**

```http
HTTP/1.1 201 Created
...
Operation-Location: {appConfigurationEndpoint}/operations?snapshot={name}&api-version={api-version}
```

The status of the snapshot provisioning operation can be found at the URI contained in `Operation-Location`.
Clients can poll this status object to ensure a snapshot is provisioned before listing its associated key-values.

```http
GET {appConfigurationEndpoint}/operations?snapshot={name}&api-version={api-version}
```

**Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
    "id": "{id}",
    "status": "Succeeded",
    "error": null
}
```

If any error occurs during the provisioning of the snapshot, the `error` property will contain details describing the error.

```json
{
    "id": "{name}",
    "status": "Failed",
    "error": {
      "code": "QuotaExceeded",
      "message": "The allotted quota for snapshot creation has been surpassed."
    }
}
```

## Archive (Patch)

A snapshot in the `ready` state can be archived.
An archived snapshot will be assigned an expiration date, based off the retention period established at the time of its creation.
After the expiration date passes, the snapshot will be permanently deleted.
At any time before the expiration date, the snapshot's items can still be listed.

Archiving a snapshot that is already `archived` doesn't affect the snapshot.

- Required: `{name}`, `{status}`, `{api-version}`

```http
PATCH /snapshots/{name}?api-version={api-version} HTTP/1.1
Content-Type: application/vnd.microsoft.appconfig.snapshot+json
```

```json
{
  "status": "archived"
}
```

**Response:**
Return the archived snapshot

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.snapshot+json; charset=utf-8
...
```

```json
{
  "etag": "33a0c9cdb43a4c2cb5fc4c1feede1c68",
  "name": "{name}",
  "status": "archived",
  ...
  "expires": "2023-08-11T21:00:03+00:00"
}
```

Archiving a snapshot that is currently in the `provisioning` or `failed` state is an invalid operation.

**Response:**

```http
HTTP/1.1 409 Conflict
Content-Type: application/problem+json; charset="utf-8"
```

```json
{
    "type": "https://azconfig.io/errors/invalid-state",
    "title": "Target resource state invalid.",
    "detail": "The target resource is not in a valid state to perform the requested operation.",
    "status": 409
}
```

## Recover (Patch)

A snapshot in the `archived` state can be recovered.
Once the snapshot is recovered the snapshot's expiration date is removed.

Recovering a snapshot that is already `ready` doesn't affect the snapshot.

- Required: `{name}`, `{status}`, `{api-version}`

```http
PATCH /snapshots/{name}?api-version={api-version} HTTP/1.1
Content-Type: application/vnd.microsoft.appconfig.snapshot+json
```

```json
{
  "status": "ready"
}
```

**Response:**
Return the recovered snapshot

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.snapshot+json; charset=utf-8
...
```

```json
{
  "etag": "90dd86e2885440f3af9398ca392095b9",
  "name": "{name}",
  "status": "ready",
  ...
}
```

Recovering a snapshot that is currently in the `provisioning` or `failed` state is an invalid operation.

**Response:**

```http
HTTP/1.1 409 Conflict
Content-Type: application/problem+json; charset="utf-8"
```

```json
{
    "type": "https://azconfig.io/errors/invalid-state",
    "title": "Target resource state invalid.",
    "detail": "The target resource is not in a valid state to perform the requested operation.",
    "status": 409
}
```

## Archive/recover snapshot (conditionally)

To prevent race conditions, use `If-Match` or `If-None-Match` request headers. The `etag` argument is part of the snapshot representation.
If `If-Match` or `If-None-Match` are omitted, the operation is unconditional.

The following response updates the resource only if the current representation matches the specified `etag`:

```http
PATCH /snapshots/{name}?api-version={api-version} HTTP/1.1
Content-Type: application/vnd.microsoft.appconfig.snapshot+json
If-Match: "4f6dd610dd5e4deebc7fbaef685fb903"
```

The following response updates the resource only if the current representation doesn't match the specified `etag`:

```http
PATCH /snapshots/{name}?api-version={api-version} HTTP/1.1
Content-Type: application/vnd.microsoft.appconfig.snapshot+json;
If-None-Match: "4f6dd610dd5e4deebc7fbaef685fb903"
```

**Responses**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.snapshot+json; charset=utf-8
...
```

or

```http
HTTP/1.1 412 PreconditionFailed
```

## List snapshot key-values

Required: ``{name}``, ``{api-version}``

```http
GET /kv?snapshot={name}&api-version={api-version}
```

>[!Note]
>Attempting to list the items of a snapshot that isn't in the `ready` or `archived` state will result in an empty list response.

### Request specific fields

Use the optional `$select` query string parameter and provide a comma-separated list of requested fields. If the `$select` parameter is omitted, the response contains the default set.

```http
GET /kv?snapshot={name}&$select=key,value&api-version={api-version} HTTP/1.1
```