---
title: Azure Active Directory REST API - Authentication
description: Use Azure Active Directory to authenticate to Azure App Configuration using the REST API
author: lisaguthrie
ms.author: lcozzens
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 08/17/2020
---

# Azure Active Directory Authentication

HTTP requests may be authenticated using the **Bearer** authentication scheme with a token acquired from Azure Active Directory (AAD). These requests must be transmitted over TLS.

## Prerequisites

The principal that will be used to request an AAD token must be assigned to one of the applicable [App Configuration roles](./rest-api-authorization-aad.md)

Provide each request with all HTTP headers required for Authentication. The minimum required are:

|  Request Header | Description  |
| --------------- | ------------ |
| **Authorization** | Authentication information required by **Bearer** scheme. Format and details are explained below. |

**Example:**

```http
Host: {myconfig}.azconfig.io
Authorization: Bearer {{AadToken}}
```

## Azure Active Directory Token Acquisition

Before acquiring an AAD token one must identify what user they want to authenticate as, what audience they are requesting the token for, and what AAD endpoint (authority) they should use.

### Audience

The AAD token must be requested with a proper audience. For Azure App Configuration one of the following audiences should be specified when requesting a token. The audience may also be referred to as the "resource" that the token is being requested for.

- {configurationStoreName}.azconfig.io
- *.azconfig.io

> [!IMPORTANT]
> When the audience requested is {configurationStoreName}.azconfig.io, it must exactly match the "Host" request header (case sensitive) used to send the request.

### AAD Authority

The AAD authority is the endpoint that is used for acquiring an AAD token. It is in the form of `https://login.microsoftonline.com/{tenantId}`. The `{tenantId}` segement refers to the Azure Active Directory tenant id to which the user/application who is trying to authenticate belongs.

### Authentication Libraries

Azure provides a set of libraries called Azure Active Directory Authentication Libraries (ADAL) to simplify the process of acquiring an AAD token. These libraries are built for multiple languages. Documentation can be found [here](https://docs.microsoft.com/azure/active-directory/develop/active-directory-authentication-libraries).

## **Errors**

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: HMAC-SHA256, Bearer
```

**Reason:** Authorization request header with Bearer scheme is not provided.
**Solution:** Provide valid ```Authorization``` HTTP request header

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: HMAC-SHA256, Bearer error="invalid_token", error_description="Authorization token failed validation"
```

**Reason:** The AAD token is not valid.
**Solution:** Acquire an AAD token from the AAD Authority and ensure the proper audience is used.

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: HMAC-SHA256, Bearer error="invalid_token", error_description="The access token is from the wrong issuer. It must match the AD tenant associated with the subscription, to which the configuration store belongs. If you just transferred your subscription and see this error message, please try back later."
```

**Reason:** The AAD token is not valid.
**Solution:** Acquire an AAD token from the AAD Authority and ensure the AAD Tenant is the one associated with the subscription, to which the configuration store belongs. This error may appear if the principal belongs to more than one AAD tenant.
