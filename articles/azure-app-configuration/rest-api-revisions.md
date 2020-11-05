---
title: Azure App Configuration REST API - Key-Value Revisions
description: Reference pages for working with key-value revisions using the Azure App Configuration REST API
author: lisaguthrie
ms.author: lcozzens
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 08/17/2020
---

# Key-value revisions

api-version: 1.0

A **key-value revision** defines the historical representation of a key-value resource. Revisions expire after 7 days for Free tier stores, or 30 days for Standard tier stores. Revisions support the following operations:

- List

For all operations, ``key`` is an optional parameter. If omitted, it implies **any** key.
For all operations, ``label`` is an optional parameter. If omitted, it implies **any** label.

## Prerequisites

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-rest-api-prereqs.md)]

## List Revisions

```http
GET /revisions?label=*&api-version={api-version} HTTP/1.1
```

**Responses:**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.kvset+json; charset=utf-8"
Accept-Ranges: items
```

```json
{
    "items": [
        {
          "etag": "4f6dd610dd5e4deebc7fbaef685fb903",
          "key": "{key}",
          "label": "{label}",
          "content_type": null,
          "value": "example value",
          "last_modified": "2017-12-05T02:41:26.4874615+00:00",
          "tags": []
        },
        ...
    ],
    "@nextLink": "{relative uri}"
}
```

## Pagination

The result is paginated if the number of items returned exceeds the response limit. Follow the optional ``Link`` response header and use ``rel="next"`` for navigation.  Alternatively, the content provides a next link in form of the ``@nextLink`` property.

```http
GET /revisions?api-version={api-version} HTTP/1.1
```

**Response:**

```http
HTTP/1.1 OK
Content-Type: application/vnd.microsoft.appconfig.kvs+json; charset=utf-8
Accept-Ranges: items
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

## List subset of revisions

Use the `Range` request header. The response will contain a `Content-Range` header. If the server can't satisfy the requested range, it will respond with HTTP `416` (RangeNotSatisfiable)

```http
GET /revisions?api-version={api-version} HTTP/1.1
Range: items=0-2
```

**Response**

```http
HTTP/1.1 206 Partial Content
Content-Type: application/vnd.microsoft.appconfig.revs+json; charset=utf-8
Content-Range: items 0-2/80
```

## Filtering

A combination of `key` and `label` filtering is supported.
Use the optional `key` and `label` query string parameters.

```http
GET /revisions?key={key}&label={label}&api-version={api-version}
```

### Supported filters

|Key Filter|Effect|
|--|--|
|`key` is omitted or `key=*`|Matches **any** key|
|`key=abc`|Matches a key named  **abc**|
|`key=abc*`|Matches keys names that start with **abc**|
|`key=*abc`|Matches keys names that end with **abc**|
|`key=*abc*`|Matches keys names that contain **abc**|
|`key=abc,xyz`|Matches keys names **abc** or **xyz** (limited to 5 CSV)|

|Label Filter|Effect|
|--|--|
|`label` is omitted or `label=`|Matches entry without label|
|`label=*`|Matches **any** label|
|`label=prod`|Matches the label **prod**|
|`label=prod*`|Matches labels that start with **prod**|
|`label=*prod`|Matches labels that end with **prod**|
|`label=*prod*`|Matches labels that contain **prod**|
|`label=prod,test`|Matches labels **prod** or **test** (limited to 5 CSV)|

### Reserved characters

`*`, `\`, `,`

If a reserved character is part of the value, then it must be escaped using `\{Reserved Character}`. Non-reserved characters can also be escaped.

### Filter Validation

If a filter validation error occurs, the response is HTTP `400` with error details:

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

### Examples

- All

    ```http
    GET /revisions
    ```

- Items where key name starts with **abc**

    ```http
    GET /revisions?key=abc*&api-version={api-version}
    ```

- Items where key name is either **abc** or **xyz** and labels contain **prod**

    ```http
    GET /revisions?key=abc,xyz&label=*prod*&api-version={api-version}
    ```

## Request specific fields

Use the optional `$select` query string parameter and provide comma-separated list of requested fields. If the `$select` parameter is omitted, the response contains the default set.

```http
GET /revisions?$select=value,label,last_modified&api-version={api-version} HTTP/1.1
```

## Time-Based Access

Obtain a representation of the result as it was at a past time. See section [2.1.1](https://tools.ietf.org/html/rfc7089#section-2.1)

```http
GET /revisions?api-version={api-version} HTTP/1.1
Accept-Datetime: Sat, 12 May 2018 02:10:00 GMT
```

**Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.revs+json"
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
