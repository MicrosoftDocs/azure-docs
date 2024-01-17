---
title: Azure App Configuration REST API - versioning
description: Reference pages for versioning by using the Azure App Configuration REST API
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 08/17/2020
---

# Versioning

Each client request must provide an explicit API version as a query string parameter. For example: `https://{myconfig}.azconfig.io/kv?api-version=1.0`.

`api-version` is expressed in SemVer (major.minor) format. Range or version negotiation isn't supported.

This article applies to API version 1.0.

The following outlines a summary of the possible error responses returned by the server when the requested API version can't be matched.

## API version unspecified

This error occurs when a client makes a request without providing an API version.

```http
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json; charset=utf-8
{
  "type": "https://azconfig.io/errors/invalid-argument",
  "title": "API version is not specified",
  "name": "api-version",
  "detail": "An API version is required, but was not specified.",
  "status": 400
}
```

## Unsupported API version

This error occurs when a client requested API version doesn't match any of the supported API versions by the server.

```http
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json; charset=utf-8
{
  "type": "https://azconfig.io/errors/invalid-argument",
  "title": "Unsupported API version",
  "name": "api-version",
  "detail": "The HTTP resource that matches the request URI '{request uri}' does not support the API version '{api-version}'.",
  "status": 400
}
```

## Invalid API version

This error occurs when a client makes a request with an API version, but the value is malformed or can't be parsed by the server.

```http
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json; charset=utf-8  
{
  "type": "https://azconfig.io/errors/invalid-argument",
  "title": "Invalid API version",
  "name": "api-version",
  "detail": "The HTTP resource that matches the request URI '{request uri}' does not support the API version '{api-version}'.",
  "status": 400
}
```

## Ambiguous API version

This error occurs when a client requests an API version that is ambiguous to the server (for example, multiple different values).

```http
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json; charset=utf-8
{
  "type": "https://azconfig.io/errors/invalid-argument",
  "title": "Ambiguous API version",
  "name": "api-version",
  "detail": "The following API versions were requested: {comma separated api versions}. At most, only a single API version may be specified. Please update the intended API version and retry the request.",
  "status": 400
}
```
