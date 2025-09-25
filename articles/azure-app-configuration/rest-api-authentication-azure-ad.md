---
title: Microsoft Entra REST API - authentication
description: Use Microsoft Entra ID to authenticate to Azure App Configuration by using the REST API
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 08/17/2020
---

# Microsoft Entra authentication

You can authenticate HTTP requests by using the `Bearer` authentication scheme with a token acquired from Microsoft Entra ID. You must transmit these requests over Transport Layer Security (TLS).

## Prerequisites

You must assign the principal that's used to request a Microsoft Entra token to one of the applicable [Azure App Configuration roles](./rest-api-authorization-azure-ad.md).

Provide each request with all HTTP headers required for authentication. Here's the minimum requirement:

|  Request header | Description  |
| --------------- | ------------ |
| `Authorization` | Authentication information required by the `Bearer` scheme. |

**Example:**

```http
Host: {myconfig}.azconfig.io
Authorization: Bearer {{AadToken}}
```

<a name='azure-ad-token-acquisition'></a>

## Microsoft Entra token acquisition

Before acquiring a Microsoft Entra token, you must identify what user you want to authenticate as, what audience you're requesting the token for, and what Microsoft Entra endpoint (authority) to use.

### Audience

Request the Microsoft Entra token with a proper audience. The audience can also be referred to as the *resource* that the token is being requested for.

For Azure App Configuration in the global Azure cloud, use the following audience: 

`https://appconfig.azure.com`

For Azure App Configuration in the national clouds, use the applicable audience specified in the table below:

| **National cloud**                   | **Audience**                 |
| ------------------------------------ | ---------------------------- |
| Azure Government                     | `https://appconfig.azure.us` |
| Microsoft Azure operated by 21Vianet | `https://appconfig.azure.cn` |

<a name='azure-ad-authority'></a>

### Microsoft Entra authority

The Microsoft Entra authority is the endpoint you use for acquiring a Microsoft Entra token. For the global Azure cloud, it's in the form of `https://login.microsoftonline.com/{tenantId}`. The `{tenantId}` segment refers to the Microsoft Entra tenant ID to which the user or application who is trying to authenticate belongs.

Azure national clouds have different Microsoft Entra authentication endpoints. See [Microsoft Entra authentication endpoints](/entra/identity-platform/authentication-national-cloud#microsoft-entra-authentication-endpoints) for which endpoints to use in the national clouds. 

### Authentication libraries

Microsoft Authentication Library (MSAL) helps to simplify the process of acquiring a Microsoft Entra token. Azure builds these libraries for multiple languages. For more information, see the [documentation](../active-directory/develop/msal-overview.md).

## Errors

You might encounter the following errors.

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: HMAC-SHA256, Bearer
```

**Reason:** You haven't provided the authorization request header with the `Bearer` scheme.

**Solution:** Provide a valid `Authorization` HTTP request header.

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: HMAC-SHA256, Bearer error="invalid_token", error_description="Authorization token failed validation"
```

**Reason:** The Microsoft Entra token isn't valid.

**Solution:** Acquire a Microsoft Entra token from the Microsoft Entra authority, and ensure that you've used the proper audience.

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: HMAC-SHA256, Bearer error="invalid_token", error_description="The access token is from the wrong issuer. It must match the AD tenant associated with the subscription to which the configuration store belongs. If you just transferred your subscription and see this error message, please try back later."
```

**Reason:** The Microsoft Entra token isn't valid.

**Solution:** Acquire a Microsoft Entra token from the Microsoft Entra authority. Ensure that the Microsoft Entra tenant is the one associated with the subscription to which the configuration store belongs. This error can appear if the principal belongs to more than one Microsoft Entra tenant.
