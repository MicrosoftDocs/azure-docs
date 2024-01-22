---
title: Azure App Configuration REST API - key-value
description: Reference pages for working with key-values by using the Azure App Configuration REST API
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 08/17/2020
---

# Key-values

A key-value is a resource identified by unique combination of `key` + `label`. `label` is optional. To explicitly reference a key-value without a label, use "\0" (URL encoded as ``%00``). See details for each operation.

This article applies to API version 1.0.

## Operations

- Get
- List multiple
- Set
- Delete

## Prerequisites

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-rest-api-prereqs.md)]

## Syntax

```json
{
  "etag": [string],
  "key": [string],
  "label": [string, optional],
  "content_type": [string, optional],
  "value": [string],
  "last_modified": [datetime ISO 8601],
  "locked": [boolean],
  "tags": [object with string properties, optional]
}
```

## Get key-value

Required: ``{key}``, ``{api-version}``  
Optional: ``label`` (If omitted, it implies a key-value without a label.)

```http
GET /kv/{key}?label={label}&api-version={api-version}
```

**Responses:**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.kv+json; charset=utf-8;
Last-Modified: Tue, 05 Dec 2017 02:41:26 GMT
ETag: "4f6dd610dd5e4deebc7fbaef685fb903"
```

```json
{
  "etag": "4f6dd610dd5e4deebc7fbaef685fb903",
  "key": "{key}",
  "label": "{label}",
  "content_type": null,
  "value": "example value",
  "last_modified": "2017-12-05T02:41:26+00:00",
  "locked": "false",
  "tags": {
    "t1": "value1",
    "t2": "value2"
  }
}
```

If the key doesn't exist, the following response is returned:

```http
HTTP/1.1 404 Not Found
```

## Get (conditionally)

To improve client caching, use `If-Match` or `If-None-Match` request headers. The `etag` argument is part of the key representation. For more information, see [sections 14.24 and 14.26](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html).

The following request retrieves the key-value only if the current representation doesn't match the specified `etag`:

```http
GET /kv/{key}?api-version={api-version} HTTP/1.1
Accept: application/vnd.microsoft.appconfig.kv+json;
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

## List key-values

Optional: ``key`` (If not specified, it implies any key.)
Optional: ``label`` (If not specified, it implies any label.)

```http
GET /kv?label=*&api-version={api-version} HTTP/1.1
```

**Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.kvset+json; charset=utf-8
```

For additional options, see the "Filtering" section later in this article.

## Pagination

The result is paginated if the number of items returned exceeds the response limit. Follow the optional `Link` response headers, and use `rel="next"` for navigation.
Alternatively, the content provides a next link in form of the `@nextLink` property. The linked URI includes the `api-version` argument.

```http
GET /kv?api-version={api-version} HTTP/1.1
```

**Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.kvs+json; charset=utf-8
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

A combination of `key` and `label` filtering is supported.
Use the optional `key` and `label` query string parameters.

```http
GET /kv?key={key}&label={label}&api-version={api-version}
```

### Supported filters

|Key filter|Effect|
|--|--|
|`key` is omitted or `key=*`|Matches **any** key|
|`key=abc`|Matches a key named **abc**|
|`key=abc*`|Matches keys names that start with **abc**|
|`key=abc,xyz`|Matches keys names **abc** or **xyz** (limited to 5 CSV)|

|Label filter|Effect|
|--|--|
|`label` is omitted or `label=*`|Matches **any** label|
|`label=%00`|Matches KV without label|
|`label=prod`|Matches the label **prod**|
|`label=prod*`|Matches labels that start with **prod**|
|`label=prod,test`|Matches labels **prod** or **test** (limited to 5 CSV)|

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
    GET /kv?api-version={api-version}
    ```

- Key name starts with **abc** and includes all labels

    ```http
    GET /kv?key=abc*&label=*&api-version={api-version}
    ```

- Key name starts with **abc** and label equals **v1** or **v2**

    ```http
    GET /kv?key=abc*&label=v1,v2&api-version={api-version}
    ```

## Request specific fields

Use the optional `$select` query string parameter and provide a comma-separated list of requested fields. If the `$select` parameter is omitted, the response contains the default set.

```http
GET /kv?$select=key,value&api-version={api-version} HTTP/1.1
```

## Time-based access

Obtain a representation of the result as it was at a past time. For more information, see section [2.1.1](https://tools.ietf.org/html/rfc7089#section-2.1). Pagination is still supported as defined earlier in this article.

```http
GET /kv?api-version={api-version} HTTP/1.1
Accept-Datetime: Sat, 12 May 2018 02:10:00 GMT
```

**Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.kvset+json"
Memento-Datetime: Sat, 12 May 2018 02:10:00 GMT
Link: <{relative uri}>; rel="original"
```

```json
{
    "items": [
        ....
    ]
}
```

## Set key

- Required: ``{key}``
- Optional: ``label`` (If not specified, or label=%00, it implies key-value without a label.)

```http
PUT /kv/{key}?label={label}&api-version={api-version} HTTP/1.1
Content-Type: application/vnd.microsoft.appconfig.kv+json
```

```json
{
  "value": "example value",         // optional
  "content_type": "user defined",   // optional
  "tags": {                         // optional
    "tag1": "value1",
    "tag2": "value2",
  }
}
```

**Responses:**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.kv+json; charset=utf-8
Last-Modified: Tue, 05 Dec 2017 02:41:26 GMT
ETag: "4f6dd610dd5e4deebc7fbaef685fb903"
```

```json
{
  "etag": "4f6dd610dd5e4deebc7fbaef685fb903",
  "key": "{key}",
  "label": "{label}",
  "content_type": "user defined",
  "value": "example value",
  "last_modified": "2017-12-05T02:41:26.4874615+00:00",
  "tags": {
    "tag1": "value1",
    "tag2": "value2",
  }
}
```

If the item is locked, you'll receive the following response:

```http
HTTP/1.1 409 Conflict
Content-Type: application/problem+json; charset="utf-8"
```

```json
{
    "type": "https://azconfig.io/errors/key-locked",
    "title": "Modifing key '{key}' is not allowed",
    "name": "{key}",
    "detail": "The key is read-only. To allow modification unlock it first.",
    "status": 409
}
```

## Set key (conditionally)

To prevent race conditions, use `If-Match` or `If-None-Match` request headers. The `etag` argument is part of the key representation.
If `If-Match` or `If-None-Match` are omitted, the operation is unconditional.

The following response updates the value only if the current representation matches the specified `etag`:

```http
PUT /kv/{key}?label={label}&api-version={api-version} HTTP/1.1
Content-Type: application/vnd.microsoft.appconfig.kv+json
If-Match: "4f6dd610dd5e4deebc7fbaef685fb903"
```

The following response updates the value only if the current representation doesn't match the specified `etag`:

```http
PUT /kv/{key}?label={label}&api-version={api-version} HTTP/1.1
Content-Type: application/vnd.microsoft.appconfig.kv+json;
If-None-Match: "4f6dd610dd5e4deebc7fbaef685fb903"
```

The following request adds the value only if a representation already exists:

```http
PUT /kv/{key}?label={label}&api-version={api-version} HTTP/1.1
Content-Type: application/vnd.microsoft.appconfig.kv+json;
If-Match: "*"
```

The following request adds the value only if a representation doesn't already exist:

```http
PUT /kv/{key}?label={label}&api-version={api-version} HTTP/1.1
Content-Type: application/vnd.microsoft.appconfig.kv+json
If-None-Match: "*"
```

**Responses**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.kv+json; charset=utf-8
...
```

or

```http
HTTP/1.1 412 PreconditionFailed
```

## Delete

- Required: `{key}`, `{api-version}`
- Optional: `{label}` (If not specified, or label=%00, it implies key-value without a label.)

```http
DELETE /kv/{key}?label={label}&api-version={api-version} HTTP/1.1
```

**Response:**
Return the deleted key-value, or none if the key-value didn't exist.

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.kv+json; charset=utf-8
...
```

or

```http
HTTP/1.1 204 No Content
```

## Delete key (conditionally)

This is similar to the "Set key (conditionally)" section earlier in this article.
