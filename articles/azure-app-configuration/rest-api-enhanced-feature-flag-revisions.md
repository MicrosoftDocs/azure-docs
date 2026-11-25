---
title: Azure App Configuration REST API - enhanced feature flag revisions
description: Reference pages for working with enhanced feature flag revisions by using the Azure App Configuration REST API
author: linglingye
ms.author: linglingye
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 08/19/2026
zone_pivot_groups: appconfig-data-plane-api-version

---
:::zone target="docs" pivot="v1,v23-10,v23-11,v24-09,v26-04,v26-05-preview"

# Enhanced feature flag revisions

:::zone-end
:::zone target="docs" pivot="v1,v23-10,v23-11,v24-09,v26-04"

Enhanced feature flag revisions aren't available in this API version.

:::zone-end
:::zone target="docs" pivot="v26-05-preview"

An *enhanced feature flag revision* defines the historical representation of an enhanced feature flag resource. Revisions expire after 7 days for Free and Developer tier stores, or 30 days for Standard and Premium tier stores. Revisions support the `List` operation.

For all operations, `name` is an optional parameter. If omitted, it implies any feature flag name.

For all operations, `label` is an optional parameter. If omitted, it implies any label.

> [!IMPORTANT]
> Enhanced feature flag revision endpoints are available only in the `2026-05-01-preview` API version.

## Prerequisites

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-rest-api-prereqs.md)]

## List revisions

Optional: ``name`` (If not specified, it implies any feature flag name.)

Optional: ``label`` (If not specified, it implies any label.)

Optional: ``tags`` (If not specified, it implies any tags.)

Optional request header: ``Sync-Token`` (Used to guarantee real-time consistency between requests.)

```http
GET /ff-revisions?name={name}&label={label}&tags={tagFilter1}&tags={tagFilter2}&api-version={api-version} HTTP/1.1
```

**Responses:**

```http
HTTP/1.1 200 OK
Content-Type: application/json; profile="https://azconfig.io/mime-profiles/ffset"; charset=utf-8
ETag: "1PlB48ET4VAlB9068ft6fKMyA3m"
Sync-Token: zAJw6V16=NjotMSM3ODk3NjM=;sn=789763
```

```json
{
  "items": [
    {
      "etag": "0BGYCoQ6iNdp5NtQ7N8shrobo6s",
      "name": "{name}",
      "enabled": false,
      "label": "{label}",
      "tags": {
        "t1": "value1"
      },
      "last_modified": "2026-04-30T16:52:32Z"
    },
    ...
  ],
  "@nextLink": "{relative uri}"
}
```

## List revisions (conditionally)

To improve client caching, use `If-Match` or `If-None-Match` request headers. The `etag` argument is part of the list response body and header. If both headers are omitted, the operation is unconditional.

The following request gets revisions only if the current representation matches the specified `etag`:

```http
GET /ff-revisions?name={name}&label={label}&api-version={api-version} HTTP/1.1
If-Match: "{etag}"
```

**Responses:**

```http
HTTP/1.1 412 Precondition Failed
```

or

```http
HTTP/1.1 200 OK
```

The following request gets revisions only if the current representation doesn't match the specified `etag`:

```http
GET /ff-revisions?name={name}&label={label}&api-version={api-version} HTTP/1.1
If-None-Match: "{etag}"
```

**Responses:**

```http
HTTP/1.1 304 Not Modified
```

or

```http
HTTP/1.1 200 OK
```

## Pagination

The result is paginated if the number of items returned exceeds the response limit. Follow the URI in the `@nextLink` property to request the next page. The linked URI includes the `After` continuation token and the `api-version` argument. Don't decode or construct the `After` token.

```http
GET /ff-revisions?api-version={api-version} HTTP/1.1
```

**Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/json; profile="https://azconfig.io/mime-profiles/ffset"; charset=utf-8
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

A combination of `name`, `label`, and `tags` filtering is supported. Use the optional `name`, `label`, and `tags` query string parameters. Multiple tag filters can be provided as query string parameters in the `tagName=tagValue` format. Tag filters must be an exact match.

```http
GET /ff-revisions?name={name}&label={label}&tags={tagFilter1}&tags={tagFilter2}&api-version={api-version}
```

### Supported filters

|Name filter|Effect|
|--|--|
|`name` is omitted or `name=*`|Matches **any** feature flag name|
|`name=abc`|Matches a feature flag named **abc**|
|`name=abc*`|Matches feature flag names that start with **abc**|
|`name=*abc`|Matches feature flag names that end with **abc**|
|`name=*abc*`|Matches feature flag names that contain **abc**|
|`name=abc,xyz`|Matches feature flag names **abc** or **xyz** (limited to 5 CSV)|

|Label filter|Effect|
|--|--|
|`label` is omitted or `label=*`|Matches **any** label|
|`label=%00`|Matches feature flags with no label|
|`label=prod`|Matches the label **prod**|
|`label=prod*`|Matches labels that start with **prod**|
|`label=*prod`|Matches labels that end with **prod**|
|`label=*prod*`|Matches labels that contain **prod**|
|`label=prod,test`|Matches labels **prod** or **test** (limited to 5 CSV)|

|Tags filter|Effect|
|--|--|
|`tags` is omitted or `tags=`|Matches **any** tag|
|`tags=group=app1`|Matches feature flags that have a tag named `group` with value `app1`|
|`tags=group=app1&tags=env=prod`|Matches feature flags that have a tag named `group` with value `app1` and a tag named `env` with value `prod` (limited to 5 tag filters)|
|`tags=tag1=%00`|Matches feature flags that have a tag named `tag1` with value `null`|
|`tags=tag1=`|Matches feature flags that have a tag named `tag1` with an empty value|

### Reserved characters

The reserved characters are:

`*`, `\`, `,`

If a reserved character is part of the value, then it must be escaped by using `\{Reserved Character}`. Non-reserved characters can also be escaped.

### Filter validation

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

- All revisions

    ```http
    GET /ff-revisions?api-version={api-version}
    ```

- Revisions where the feature flag name starts with **abc**

    ```http
    GET /ff-revisions?name=abc*&api-version={api-version}
    ```

- Revisions where the feature flag name is either **abc** or **xyz**, and labels contain **prod**

    ```http
    GET /ff-revisions?name=abc,xyz&label=*prod*&api-version={api-version}
    ```

## Request specific fields

Use the optional `$select` query string parameter and provide a comma-separated list of requested fields. If the `$select` parameter is omitted, the response contains the default set. Supported fields are `name`, `enabled`, `label`, `description`, `conditions`, `variants`, `allocation`, `telemetry`, `tags`, `last_modified`, and `etag`.

```http
GET /ff-revisions?$select=enabled,label,last_modified&api-version={api-version} HTTP/1.1
```

For information about request and response headers shared by App Configuration data-plane operations, see [Common headers](./rest-api-headers.md).

:::zone-end