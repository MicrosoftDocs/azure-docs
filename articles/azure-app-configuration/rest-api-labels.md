---
title: Azure App Configuration REST API - Labels
description: Reference pages for working with labels using the Azure App Configuration REST API
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 08/17/2020
---

# Labels

api-version: 1.0

The **Label** resource is defined as follows:

```json
{
      "name": [string]             // Name of the label
}
```

Supports the following operations:

- List

For all operations ``name`` is an optional filter parameter. If omitted it implies **any** label.

## Prerequisites

- All HTTP requests must be authenticated. See the [authentication](./rest-api-authentication-index.md) section.
- All HTTP requests must provide explicit `api-version`. See the [versioning](./rest-api-versioning.md) section.

## List Labels

```http
GET /labels?api-version={api-version} HTTP/1.1
```

**Responses:**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.labelset+json; charset=utf-8"
```

```json
{
    "items": [
        {
          "name": "{label-name}"
        },
        ...
    ],
    "@nextLink": "{relative uri}"
}
```

## Pagination

The result is paginated if the number of items returned exceeds the response limit. Follow the optional `Link` response headers and use `rel="next"` for navigation. 
Alternatively the content provides a next link in form of the `@nextLink` property. The next link contains `api-version` parameter.

```http
GET /labels?api-version={api-version} HTTP/1.1
```

**Response:**

```http
HTTP/1.1 OK
Content-Type: application/vnd.microsoft.appconfig.labelset+json; charset=utf-8
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

## Filtering

Filtering by `name` is supported.

```http
GET /labels?name={label-name}&api-version={api-version}
```

### Supported filters

|Key Filter|Effect|
|--|--|
|`name` is omitted or `name=*`|Matches **any** label|
|`name=abc`|Matches a label named  **abc**|
|`name=abc*`|Matches label names that start with **abc**|
|`name=abc,xyz`|Matches label names **abc** or **xyz** (limited to 5 CSV)|

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
  "title": "Invalid request parameter 'name'",
  "name": "name",
  "detail": "name(2): Invalid character",
  "status": 400
}
```

### Examples

- All

    ```http
    GET /labels?api-version={api-version}
    ```

- Label name starts with **abc**

    ```http
    GET  /labels?name=abc*&api-version={api-version}
    ```

- Label name is either **abc** or **xyz**

    ```http
    GET /labels?name=abc,xyz&api-version={api-version}
    ```

## Request specific fields

Use the optional `$select` query string parameter and provide comma-separated list of requested fields. If the `$select` parameter is omitted, the response contains the default set.

```http
GET /labels?$select=name&api-version={api-version} HTTP/1.1
```

## Time-Based Access

Obtain a representation of the result as it was at a past time. See section [2.1.1](https://tools.ietf.org/html/rfc7089#section-2.1)

```http
GET /labels&api-version={api-version} HTTP/1.1
Accept-Datetime: Sat, 12 May 2018 02:10:00 GMT
```

**Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.microsoft.appconfig.labelset+json"
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
