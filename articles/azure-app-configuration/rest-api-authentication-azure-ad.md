---
title: Azure Active Directory REST API - authentication
description: Use Azure Active Directory to authenticate to Azure App Configuration by using the REST API
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 08/17/2020
---

# Azure Active Directory authentication

You can authenticate HTTP requests by using the `Bearer` authentication scheme with a token acquired from Azure Active Directory (Azure AD). You must transmit these requests over Transport Layer Security (TLS).

## Prerequisites

You must assign the principal that's used to request an Azure AD token to one of the applicable [Azure App Configuration roles](./rest-api-authorization-azure-ad.md).

Provide each request with all HTTP headers required for authentication. Here's the minimum requirement:

|  Request header | Description  |
| --------------- | ------------ |
| `Authorization` | Authentication information required by the `Bearer` scheme. |

**Example:**

```http
Host: {myconfig}.azconfig.io
Authorization: Bearer {{AadToken}}
```

## Azure AD token acquisition

Before acquiring an Azure AD token, you must identify what user you want to authenticate as, what audience you're requesting the token for, and what Azure AD endpoint (authority) to use.

### Audience

Request the Azure AD token with a proper audience. For Azure App Configuration use the following audience. The audience can also be referred to as the *resource* that the token is being requested for.

`https://azconfig.io`

### Azure AD authority

The Azure AD authority is the endpoint you use for acquiring an Azure AD token. It's in the form of `https://login.microsoftonline.com/{tenantId}`. The `{tenantId}` segment refers to the Azure AD tenant ID to which the user or application who is trying to authenticate belongs.

### Authentication libraries

Microsoft Authentication Library (MSAL) helps to simplify the process of acquiring an Azure AD token. Azure builds these libraries for multiple languages. For more information, see the [documentation](../active-directory/develop/msal-overview.md).

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

**Reason:** The Azure AD token isn't valid.

**Solution:** Acquire an Azure AD token from the Azure AD authority, and ensure that you've used the proper audience.

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: HMAC-SHA256, Bearer error="invalid_token", error_description="The access token is from the wrong issuer. It must match the AD tenant associated with the subscription to which the configuration store belongs. If you just transferred your subscription and see this error message, please try back later."
```

**Reason:** The Azure AD token isn't valid.

**Solution:** Acquire an Azure AD token from the Azure AD authority. Ensure that the Azure AD tenant is the one associated with the subscription to which the configuration store belongs. This error can appear if the principal belongs to more than one Azure AD tenant.