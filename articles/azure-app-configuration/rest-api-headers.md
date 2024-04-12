---
title: Azure App Configuration REST API - Headers
description: Reference pages for headers used with the Azure App Configuration REST API
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 08/17/2020
---

# Headers

This article provides links to reference pages for headers used with the Azure App Configuration REST API.

## Request Headers

The following table describes common request headers used in Azure App Configuration.

| Header | Description | Example |
|--|--|--|
| **Authorization** | Used to [authenticate](./rest-api-authentication-index.md) a request to the service. See [section 14.8](https://tools.ietf.org/html/rfc2616#section-14.8) | `Authorization: HMAC-SHA256 Credential=<Credential>&SignedHeaders=Host;x-ms-date;x-ms-content-sha256&Signature=<Signature>` |
| **Accept** | Informs the server what media type the client will accept in an HTTP response. See [section 14.1](https://tools.ietf.org/html/rfc2616#section-14.1) | `Accept: application/vnd.microsoft.appconfig.kv+json;` |
| **Accept-Datetime** | Requests the server to return its content as a representation of its prior state. The value of this header is the requested datetime of that state. See [RFC 7089](https://tools.ietf.org/html/rfc7089#section-2.1.1) | `Accept-Datetime: Sat, 12 May 2018 02:10:00 GMT` |
| **Content-Type** | Contains the media-type of the content within the HTTP request body. See [section 14.17](https://tools.ietf.org/html/rfc2616#section-14.17) | `Content-Type: application/vnd.microsoft.appconfig.kv+json; charset=utf-8;` |
| **Date** | The datetime that the HTTP request was issued. This header is used in [HMAC authentication](./rest-api-authentication-hmac.md). See [section 14.18](https://tools.ietf.org/html/rfc2616#section-14.18) | `Date: Fri, 11 May 2018 18:48:36 GMT` |
| **Host** | Specifies the tenant for which the request has been issued. This header is used in [HMAC authentication](./rest-api-authentication-hmac.md). See [section 14.23](https://tools.ietf.org/html/rfc2616#section-14.23) | `Host: contoso.azconfig.io` |
| **If-Match** | Used to make an HTTP request conditional. This request should only succeed if the targeted resource's ETag matches the value of this header. The '*' value matches any ETag. See [section 14.24](https://tools.ietf.org/html/rfc2616#section-14.24) | `If-Match: "4f6dd610dd5e4deebc7fbaef685fb903"` |
| **If-None-Match** | Used to make an HTTP request conditional. This request should only succeed if the targeted resource's ETag does not match the value of this header. The '*' value matches any ETag. See [section 14.26](https://tools.ietf.org/html/rfc2616#section-14.26) | `If-None-Match: "4f6dd610dd5e4deebc7fbaef685fb903"` |
| **Sync-Token** | Used to enable real-time consistency during a sequence of requests. | `Sync-Token: jtqGc1I4=MDoyOA==;sn=28` |
| **x-ms-client-request-id** | A unique ID provided by the client used to track a request's round-trip. | `x-ms-client-request-id: 00000000-0000-0000-0000-000000000000` |
| **x-ms-content-sha256** | A sha256 digest of the HTTP request body. This header is used in [HMAC authentication](./rest-api-authentication-hmac.md). | `x-ms-content-sha256: 47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=` |
| **x-ms-date** | This header may be set and used in place of the `Date` header if the date header is unable to be accessed. This header is used in [HMAC authentication](./rest-api-authentication-hmac.md). | `x-ms-date: Fri, 11 May 2018 18:48:36 GMT` |
| **x-ms-return-client-request-id** | Used in conjunction with the `x-ms-client-request-id` header. If the value of this header is 'true', then the server will be instructed to return the value of the `x-ms-client-request-id` request header. | `x-ms-return-client-request-id: true` |

## Response Headers

The server may include the following HTTP headers in its responses.

| Header | Description | Example |
|--|--|--|
| **Content-Type** | Contains the media-type of the content within the HTTP response body. See [section 14.17](https://tools.ietf.org/html/rfc2616#section-14.17) | `Content-Type: application/vnd.microsoft.appconfig.kv+json; charset=utf-8;` |
| **ETag** | An opaque token representing the state of a given resource. Can be used in conditional operations. See [section 14.19](https://tools.ietf.org/html/rfc2616#section-14.19) | `ETag: "4f6dd610dd5e4deebc7fbaef685fb903"` |
| **Last-Modified** | Describes when the requested resource was last modified. Formatted as an [HTTP-Date](https://tools.ietf.org/html/rfc2616#section-3.3.1). See [section 14.29](https://tools.ietf.org/html/rfc2616#section-14.29) | `Last-Modified: Tue, 05 Dec 2017 02:41:26 GMT` |
| **Link** | Provides links to resources that are related to the response. This header is used for paging by using the _next_ link. See [RFC 5988](https://tools.ietf.org/html/rfc5988) | `Link: </kv?after={token}>; rel="next"` |
| **Memento-Datetime** | Indicates that the content contained in a response represents a prior state. The value of this header is the datetime of that state. See [RFC 7089](https://tools.ietf.org/html/rfc7089#section-2.1.1) | `Memento-Datetime: Sat, 12 May 2018 02:10:00 GMT` |
| **retry-after-ms** | Provides a suggested period (in milliseconds) for the client to wait before retrying a failed request. | `retry-after-ms: 10` |
| **x-ms-request-id** | A unique ID generated by the server that is used to track the request within the service. | `x-ms-request-id: 00000000-0000-0000-0000-000000000000` |
| **WWW-Authenticate** | Used to challenge clients for authentication and provide a reason as to why an authentication attempt has failed. See [section 14.47](https://tools.ietf.org/html/rfc2616#section-14.47) | `WWW-Authenticate: HMAC-SHA256 error="invalid_token" error_description="Invalid Signature"` |
