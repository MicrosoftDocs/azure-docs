---
title: Azure App Configuration REST API - enhanced feature flags
description: Reference pages for working with enhanced feature flags by using the Azure App Configuration REST API
author: linglingye
ms.author: linglingye
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 08/13/2026
zone_pivot_groups: appconfig-data-plane-api-version

---
:::zone target="docs" pivot="v1,v23-10,v23-11,v24-09,v26-04,v26-05-preview"

# Enhanced feature flags

:::zone-end
:::zone target="docs" pivot="v1,v23-10,v23-11,v24-09,v26-04"

Enhanced feature flags aren't available in this API version.

:::zone-end
:::zone target="docs" pivot="v26-05-preview"

An enhanced feature flag is a resource identified by the unique combination of `name` + `label`. `label` is optional. To explicitly reference a feature flag without a label, use `\0` (URL encoded as `%00`). For list operations, omitting `label` matches feature flags with any label. See details for each operation.

> [!IMPORTANT]
> Enhanced feature flag endpoints are available only in the `2026-05-01-preview` API version.

For historical representations, see [Enhanced feature flag revisions](./rest-api-enhanced-feature-flag-revisions.md). To list labels associated with enhanced feature flags, see [Labels](./rest-api-labels.md).

## Operations

- Get
- List multiple
- Set
- Delete

## Prerequisites

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-rest-api-prereqs.md)]

## Syntax

### Feature flag

```json
{
  "etag": [string, optional, read-only],
  "name": [string, read-only],
  "enabled": [boolean],
  "label": [string, optional, read-only],
  "description": [string, optional],
  "conditions": [Conditions, optional],
  "variants": [array<Variant>, optional],
  "allocation": [Allocation, optional],
  "telemetry": [Telemetry, optional],
  "tags": [object<string, string>, optional],
  "last_modified": [datetime ISO 8601, optional, read-only]
}
```

### Conditions

```json
{
  "requirement_type": [string, enum("Any", "All"), optional],
  "filters": [array<FeatureFilter>, optional]
}
```

`FeatureFilter`

```json
{
  "name": [string],
  "parameters": [object<string, string>, optional]
}
```

### Variant

```json
{
  "name": [string],
  "value": [string, optional],
  "content_type": [string, optional],
  "status_override": [string, enum("None", "Enabled", "Disabled"), optional]
}
```

### Allocation

```json
{
  "default_when_disabled": [string, optional],
  "default_when_enabled": [string, optional],
  "percentile": [array<PercentileAllocation>, optional],
  "user": [array<UserAllocation>, optional],
  "group": [array<GroupAllocation>, optional],
  "seed": [string, optional]
}
```

`PercentileAllocation`

```json
{
  "variant": [string],
  "from": [number, range(0, 100)],
  "to": [number, range(0, 100)]
}
```

`UserAllocation`

```json
{
  "variant": [string],
  "users": [array<string>]
}
```

`GroupAllocation`

```json
{
  "variant": [string],
  "groups": [array<string>]
}
```

### Telemetry

```json
{
  "enabled": [boolean],
  "metadata": [object<string, string>, optional]
}
```

## Get feature flag

Required: ``{name}``, ``{api-version}``

Optional: ``label`` (If omitted, it implies a feature flag without a label.)

Optional: ``tags`` (If not specified, it implies any tags.)

The `name` and `label` must match exactly before `tags` are applied for additional filtering. For more options, see the "Filtering" section later in this article.

```http
GET /ff/{name}?label={label}&tags={tagFilter1}&tags={tagFilter2}&api-version={api-version}
```

**Responses:**

```http
HTTP/1.1 200 OK
Content-Type: application/json; profile="https://azconfig.io/mime-profiles/ff"; charset=utf-8
Last-Modified: Fri, 01 May 2026 16:52:32 GMT
ETag: "7XpB48ET4VAlB9068ft6fKMyA3m"
Sync-Token: zAJw6V16=NjotMSM3ODk3NjM=;sn=789763
```

```json
{
  "etag": "7XpB48ET4VAlB9068ft6fKMyA3m",
  "name": "{name}",
  "enabled": true,
  "label": "{label}",
  "description": "{description}",
  "tags": {
    "t1": "value1"
  },
  "last_modified": "2026-05-01T16:52:32Z"
}
```

If the feature flag doesn't exist, the following response is returned:

```http
HTTP/1.1 404 Not Found
```

## Get (conditionally)

To improve client caching, use `If-Match` or `If-None-Match` request headers. The `etag` argument is part of the feature flag representation. If both headers are omitted, the operation is unconditional.

The following request retrieves the feature flag only if the current representation doesn't match the specified `etag`:

```http
GET /ff/{name}?label={label}&api-version={api-version} HTTP/1.1
Accept: application/json; profile="https://azconfig.io/mime-profiles/ff"
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

## List feature flags

Optional: ``name`` (If not specified, it implies any feature flag name.)

Optional: ``label`` (If not specified, it implies any label.)

Optional: ``tags`` (If not specified, it implies any tags.)

```http
GET /ff?name=Test*&label=*&tags=tag1=value1&tags=tag2=value2&api-version={api-version} HTTP/1.1
```

**Response:**

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
      "etag": "7XpB48ET4VAlB9068ft6fKMyA3m",
      "name": "{name}",
      "enabled": true,
      "label": "{label}",
      "tags": {
        "t1": "value1"
      },
      "last_modified": "2026-05-01T16:52:32Z"
    }
  ],
  "etag": "1PlB48ET4VAlB9068ft6fKMyA3m",
  "@nextLink": "{relative uri}"
}
```

For more options, see the "Filtering" section later in this article.

## List feature flags (conditionally)

To improve client caching, use `If-Match` or `If-None-Match` request headers. The `etag` argument is part of the list response body and header. If both headers are omitted, the operation is unconditional.

The following request retrieves feature flags only if the current representation matches the specified `etag`:

```http
GET /ff?name={name}&label={label}&api-version={api-version} HTTP/1.1
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

The following request gets the feature flags only if the current representation doesn't match the specified `etag`:

```http
GET /ff?name={name}&label={label}&api-version={api-version} HTTP/1.1
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

The result is paginated if the number of items returned exceeds the response limit. Follow the optional `Link` response header, and use `rel="next"` for navigation. Alternatively, the content provides a next link in the form of the `@nextLink` property. The linked URI includes the `api-version` argument.

```http
GET /ff?api-version={api-version} HTTP/1.1
```

**Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/json; profile="https://azconfig.io/mime-profiles/ffset"; charset=utf-8
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

A combination of `name`, `label`, and `tags` filtering is supported. Use the optional `name`, `label`, and `tags` query string parameters. Multiple tag filters can be provided as query string parameters in the `tagName=tagValue` format. Tag filters must be an exact match.

```http
GET /ff?name={name}&label={label}&tags={tagFilter1}&tags={tagFilter2}&api-version={api-version}
```

### Supported filters

|Name filter|Effect|
|--|--|
|`name` is omitted or `name=*`|Matches **any** feature flag name|
|`name=abc`|Matches a feature flag named **abc**|
|`name=abc*`|Matches feature flag names that start with **abc**|
|`name=abc,xyz`|Matches feature flag names **abc** or **xyz** (limited to 5 CSV)|

|Label filter|Effect|
|--|--|
|`label` is omitted or `label=*`|Matches **any** label|
|`label=%00`|Matches feature flags with no label|
|`label=prod`|Matches the label **prod**|
|`label=prod*`|Matches labels that start with **prod**|
|`label=prod,test`|Matches labels **prod** or **test** (limited to 5 CSV)|

|Tags filter|Effect|
|--|--|
|`tags` is omitted or `tags=`|Matches **any** tag|
|`tags=group=app1`|Matches feature flags that have a tag named `group` with value `app1`|
|`tags=group=app1&tags=env=prod`|Matches feature flags that have a tag named `group` with value `app1` and a tag named `env` with value `prod` (limited to 5 tag filters)|
|`tags=tag1=%00`|Matches feature flags that have a tag named `tag1` with value `null`|
|`tags=tag1=`|Matches feature flags that have a tag named `tag1` with an empty value|

***Reserved characters***

`*`, `\`, `,`

If a reserved character is part of the value, then it must be escaped by using `\{Reserved Character}`. Non-reserved characters can also be escaped.

***Filter validation***

If filter validation fails, the response is HTTP `400` with error details:

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
  GET /ff?api-version={api-version}
  ```

- Feature flag name starts with **abc** and includes all labels

  ```http
  GET /ff?name=abc*&label=*&api-version={api-version}
  ```

- Feature flag name starts with **abc** and label equals **v1** or **v2**

  ```http
  GET /ff?name=abc*&label=v1,v2&api-version={api-version}
  ```

## Request specific fields

Use the optional `$select` query string parameter and provide a comma-separated list of requested fields. If the `$select` parameter is omitted, the response contains the default set. Supported fields are `name`, `enabled`, `label`, `description`, `conditions`, `variants`, `allocation`, `telemetry`, `tags`, `last_modified`, and `etag`.

```http
GET /ff?$select=name,enabled,label&api-version={api-version} HTTP/1.1
```

The `$select` parameter is supported by `GET` requests for a single feature flag and feature flag collections.

## Time-based access

Obtain a representation of the result as it was at a past time. For more information, see section [2.1.1](https://tools.ietf.org/html/rfc7089#section-2.1). Pagination is still supported as defined earlier in this article.

```http
GET /ff/{name}?label={label}&api-version={api-version} HTTP/1.1
Accept-Datetime: Sat, 01 Aug 2026 02:10:00 GMT
```

```http
GET /ff?api-version={api-version} HTTP/1.1
Accept-Datetime: Sat, 01 Aug 2026 02:10:00 GMT
```

## Set feature flag

- Required: ``{name}``, ``{api-version}``
- Optional: ``label`` (If not specified, or `label=%00`, it implies a feature flag without a label.)

The `enabled` property is required in the request body. The `description`, `conditions`, `variants`, `allocation`, `telemetry`, and `tags` properties are optional. Don't include `name`, `label`, `etag`, or `last_modified` in the request body.

```http
PUT /ff/{name}?label={label}&api-version={api-version} HTTP/1.1
Content-Type: application/json; profile="https://azconfig.io/mime-profiles/ff"
```

```json
{
  "enabled": true,
  "description": "{description}",
  "conditions": {
    "requirement_type": "All",
    "filters": [
      {
        "name": "Microsoft.Targeting",
        "parameters": {
          "Audience": "{\"Users\":[\"User1\",\"User2\"],\"Groups\":[{\"Name\":\"Ring0\",\"RolloutPercentage\":100}],\"DefaultRolloutPercentage\":20,\"Exclusion\":{\"Users\":[\"ExcludedUser\"],\"Groups\":[\"Ring1\"]}}"
        }
      }
    ]
  },
  "variants": [
    {
      "name": "On",
      "value": "true",
      "content_type": "application/json",
      "status_override": "None"
    },
    {
      "name": "Off",
      "value": "false",
      "content_type": "application/json",
      "status_override": "Disabled"
    }
  ],
  "allocation": {
    "default_when_disabled": "Off",
    "default_when_enabled": "On",
    "percentile": [
      {
        "variant": "On",
        "from": 0,
        "to": 80
      },
      {
        "variant": "Off",
        "from": 80,
        "to": 100
      }
    ],
    "seed": "{name}"
  },
  "telemetry": {
    "enabled": true,
    "metadata": {
      "Tags.Environment": "production"
    }
  },
  "tags": {
    "t1": "value1"
  }
}
```

**Responses:**

```http
HTTP/1.1 200 OK
Content-Type: application/json; profile="https://azconfig.io/mime-profiles/ff"; charset=utf-8
Last-Modified: Fri, 01 May 2026 16:52:32 GMT
ETag: "7XpB48ET4VAlB9068ft6fKMyA3m"
Sync-Token: zAJw6V16=NjotMSM3ODk3NjM=;sn=789763
```

```json
{
  "etag": "7XpB48ET4VAlB9068ft6fKMyA3m",
  "name": "{name}",
  "enabled": true,
  "label": "{label}",
  "description": "{description}",
  "conditions": {
    "requirement_type": "All",
    "filters": [
      {
        "name": "Microsoft.Targeting",
        "parameters": {
          "Audience": "{\"Users\":[\"User1\",\"User2\"],\"Groups\":[{\"Name\":\"Ring0\",\"RolloutPercentage\":100}],\"DefaultRolloutPercentage\":20,\"Exclusion\":{\"Users\":[\"ExcludedUser\"],\"Groups\":[\"Ring1\"]}}"
        }
      }
    ]
  },
  "variants": [
    {
      "name": "On",
      "value": "true",
      "content_type": "application/json",
      "status_override": "None"
    },
    {
      "name": "Off",
      "value": "false",
      "content_type": "application/json",
      "status_override": "Disabled"
    }
  ],
  "allocation": {
    "default_when_disabled": "Off",
    "default_when_enabled": "On",
    "percentile": [
      {
        "variant": "On",
        "from": 0,
        "to": 80
      },
      {
        "variant": "Off",
        "from": 80,
        "to": 100
      }
    ],
    "seed": "{name}"
  },
  "telemetry": {
    "enabled": true,
    "metadata": {
      "Tags.Environment": "production"
    }
  },
  "tags": {
    "t1": "value1"
  },
  "last_modified": "2026-05-01T16:52:32Z"
}
```

## Set feature flag (conditionally)

To prevent race conditions, use `If-Match` or `If-None-Match` request headers. The `etag` argument is part of the feature flag representation. If both headers are omitted, the operation is unconditional.

The following request sets the feature flag only if the current representation matches the specified `etag`:

```http
PUT /ff/{name}?label={label}&api-version={api-version} HTTP/1.1
Content-Type: application/json; profile="https://azconfig.io/mime-profiles/ff"
If-Match: "{etag}"
```

The following request sets the feature flag only if the current representation doesn't match the specified `etag`:

```http
PUT /ff/{name}?label={label}&api-version={api-version} HTTP/1.1
Content-Type: application/json; profile="https://azconfig.io/mime-profiles/ff"
If-None-Match: "{etag}"
```

The following request sets the feature flag only if a representation already exists:

```http
PUT /ff/{name}?label={label}&api-version={api-version} HTTP/1.1
Content-Type: application/json; profile="https://azconfig.io/mime-profiles/ff"
If-Match: "*"
```

The following request sets the feature flag only if a representation doesn't already exist:

```http
PUT /ff/{name}?label={label}&api-version={api-version} HTTP/1.1
Content-Type: application/json; profile="https://azconfig.io/mime-profiles/ff"
If-None-Match: "*"
```

**Responses**

```http
HTTP/1.1 200 OK
Content-Type: application/json; profile="https://azconfig.io/mime-profiles/ff"; charset=utf-8
Last-Modified: Fri, 01 May 2026 16:52:32 GMT
ETag: "7XpB48ET4VAlB9068ft6fKMyA3m"
Sync-Token: zAJw6V16=NjotMSM3ODk3NjM=;sn=789763
...
```

or

```http
HTTP/1.1 412 Precondition Failed
```

## Delete

- Required: `{name}`, `{api-version}`
- Optional: `label` (If not specified, or `label=%00`, it implies a feature flag without a label.)

```http
DELETE /ff/{name}?label={label}&api-version={api-version} HTTP/1.1
```

**Response:**
Return the deleted feature flag, or none if the feature flag didn't exist.

```http
HTTP/1.1 200 OK
Content-Type: application/json; profile="https://azconfig.io/mime-profiles/ff"; charset=utf-8
Last-Modified: Fri, 01 May 2026 16:52:32 GMT
ETag: "7XpB48ET4VAlB9068ft6fKMyA3m"
Sync-Token: zAJw6V16=NjotMSM3ODk3NjM=;sn=789763
...
```

or

```http
HTTP/1.1 204 No Content
```

## Delete feature flag (conditionally)

This is similar to the "Set feature flag (conditionally)" section earlier in this article. The delete operation supports the `If-Match` request header.

For information about request and response headers shared by App Configuration data-plane operations, see [Common headers](./rest-api-headers.md).

:::zone-end
