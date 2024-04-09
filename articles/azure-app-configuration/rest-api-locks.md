---
title: Azure App Configuration REST API - locks
description: Reference pages for working with key-value locks by using the Azure App Configuration REST API
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 08/17/2020
---

# Locks

This API (version 1.0) provides lock and unlock semantics for the key-value resource. It supports the following operations:

- Place lock
- Remove lock

If present, `label` must be an explicit label value (not a wildcard). For all operations, it's an optional parameter. If omitted, it implies no label.

## Prerequisites

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-rest-api-prereqs.md)]

## Lock key-value

- Required: ``{key}``, ``{api-version}``  
- Optional: ``label``

```http
PUT /locks/{key}?label={label}&api-version={api-version} HTTP/1.1
```

**Responses:**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.kv+json; charset=utf-8"
```

```json
{
  "etag": "4f6dd610dd5e4deebc7fbaef685fb903",
  "key": "{key}",
  "label": "{label}",
  "content_type": null,
  "value": "example value",
  "created": "2017-12-05T02:41:26.4874615+00:00",
  "locked": true,
  "tags": []
}
```

If the key-value doesn't exist, the following response is returned:

```http
HTTP/1.1 404 Not Found
```

## Unlock key-value

- Required: ``{key}``, ``{api-version}``  
- Optional: ``label``

```http
DELETE /locks/{key}?label={label}?api-version={api-version} HTTP/1.1
```

**Responses:**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.kv+json; charset=utf-8"
```

```json
{
  "etag": "4f6dd610dd5e4deebc7fbaef685fb903",
  "key": "{key}",
  "label": "{label}",
  "content_type": null,
  "value": "example value",
  "created": "2017-12-05T02:41:26.4874615+00:00",
  "locked": true,
  "tags": []
}
```

If the key-value doesn't exist, the following response is returned:

```http
HTTP/1.1 404 Not Found
```

## Conditional lock and unlock

To prevent race conditions, use `If-Match` or `If-None-Match` request headers. The `etag` argument is part of the key representation. If `If-Match` or `If-None-Match` are omitted, the operation is unconditional.

The following request applies the operation only if the current key-value representation matches the specified `etag`:

```http
PUT|DELETE /locks/{key}?label={label}&api-version={api-version} HTTP/1.1
If-Match: "4f6dd610dd5e4deebc7fbaef685fb903"
```

The following request applies the operation only if the current key-value representation exists, but doesn't match the specified `etag`:

```http
PUT|DELETE /kv/{key}?label={label}&api-version={api-version} HTTP/1.1
If-None-Match: "4f6dd610dd5e4deebc7fbaef685fb903"
```
