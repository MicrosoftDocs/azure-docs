---
title: How to use an Azure VM Managed Service Identity to acquire an access token using HTTP
description: Instructions for using an Azure VM MSI to acquire an OAuth access token using HTTP.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/01/2017
ms.author: daveba
---

# How to use an Azure VM Managed Service Identity (MSI) to acquire an access token using HTTP

This article provides an example for token acquisition using HTTP.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

> [!IMPORTANT]
> - All sample code/script in this article assumes the client is running on an MSI-enabled Virtual Machine. Use the VM "Connect" feature in the Azure portal, to remotely connect to your VM. For details on enabling MSI on a VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](qs-configure-portal-windows-vm.md), or one of the variant articles (using PowerShell, CLI, a template, or an Azure SDK). 

## Overview

A client application can request an MSI [app-only access token](../develop/active-directory-dev-glossary.md#access-token) for accessing a given resource. The token is [based on the MSI service principal](overview.md#how-does-it-work). As such, there is no need for the client to register itself to obtain an access token under its own service principal. The token is suitable for use as a bearer token in
[service-to-service calls requiring client credentials](../develop/active-directory-protocols-oauth-service-to-service.md).

## Get a token using HTTP 

The fundamental interface for acquiring an access token is based on REST, making it accessible to any client application running on the VM that can make HTTP REST calls. This is similar to the Azure AD programming model, except the client uses a localhost endpoint on the virtual machine (vs an Azure AD endpoint).

Sample request:

```
GET http://localhost:50342/oauth2/token?resource=https%3A%2F%2Fmanagement.azure.com%2F HTTP/1.1
Metadata: true
```

| Element | Description |
| ------- | ----------- |
| `GET` | The HTTP verb, indicating you want to retrieve data from the endpoint. In this case, an OAuth access token. | 
| `http://localhost:50342/oauth2/token` | The MSI endpoint, where 50342 is the default port and is configurable. |
| `resource` | A query string parameter, indicating the App ID URI of the target resource. It also appears in the `aud` (audience) claim of the issued token. This example requests a token to access Azure Resource Manager, which has an App ID URI of https://management.azure.com/. |
| `Metadata` | An HTTP request header field, required by MSI as a mitigation against Server Side Request Forgery (SSRF) attack. This value must be set to "true", in all lower case.

Sample response:

```
HTTP/1.1 200 OK
Content-Type: application/json
{
  "access_token": "eyJ0eXAi...",
  "refresh_token": "",
  "expires_in": "3599",
  "expires_on": "1506484173",
  "not_before": "1506480273",
  "resource": "https://management.azure.com/",
  "token_type": "Bearer"
}
```

| Element | Description |
| ------- | ----------- |
| `access_token` | The requested access token. When calling a secured REST API, the token is embedded in the `Authorization` request header field as a "bearer" token, allowing the API to authenticate the caller. | 
| `refresh_token` | Not used by MSI. |
| `expires_in` | The number of seconds the access token continues to be valid, before expiring, from time of issuance. Time of issuance can be found in the token's `iat` claim. |
| `expires_on` | The timespan when the access token expires. The date is represented as the number of seconds from "1970-01-01T0:0:0Z UTC"  (corresponds to the token's `exp` claim). |
| `not_before` | The timespan when the access token takes effect, and can be accepted. The date is represented as the number of seconds from "1970-01-01T0:0:0Z UTC" (corresponds to the token's `nbf` claim). |
| `resource` | The resource the access token was requested for, which matches the `resource` query string parameter of the request. |
| `token_type` | The type of token, which is a "Bearer" access token, which means the resource can give access to the bearer of this token. |

## Handling token expiration

The local MSI subsystem caches tokens. Therefore, you can call it as often as you like, and an on-the-wire call to Azure AD results only if:
- a cache miss occurs due to no token in the cache
- the token is expired

If you cache the token in your code, you should be prepared to handle scenarios where the resource indicates that the token is expired.

## Error handling 

The MSI endpoint signals errors via the status code field of the HTTP response message header, as either 4xx or 5xx errors:

| Status Code | Error Reason | How To Handle |
| ----------- | ------------ | ------------- |
| 4xx Error in request. | One or more of the request parameters was incorrect. | Do not retry.  Examine the error details for more information.  4xx errors are design-time errors.|
| 5xx Transient error from service. | The MSI sub-system or Azure Active Directory returned a transient error. | It is safe to retry after waiting for at least 1 second.  If you retry too quickly or too often, Azure AD may return a rate limit error (429).|

If an error occurs, the corresponding HTTP response body contains JSON with the error details:

| Element | Description |
| ------- | ----------- |
| error   | Error identifier. |
| error_description | Verbose description of error. **Error descriptions can change at any time. Do not write code that branches based on values in the error description.**|

### HTTP response reference

This section documents the possible error responses. A "200 OK" status is a successful response, and the access token is contained in the response body JSON, in the access_token element.

| Status code | Error | Error Description | Solution |
| ----------- | ----- | ----------------- | -------- |
| 400 Bad Request | invalid_resource | AADSTS50001: The application named *\<URI\>* was not found in the tenant named *\<TENANT-ID\>*. This can happen if the application has not been installed by the administrator of the tenant or consented to by any user in the tenant. You might have sent your authentication request to the wrong tenant.\ | (Linux only) |
| 400 Bad Request | bad_request_102 | Required metadata header not specified | Either the `Metadata` request header field is missing from your request, or is formatted incorrectly. The value must be specified as `true`, in all lower case. See the "Sample request" in the [preceding REST section](#rest) for an example.|
| 401 Unauthorized | unknown_source | Unknown Source *\<URI\>* | Verify that your HTTP GET request URI is formatted correctly. The `scheme:host/resource-path` portion must be specified as `http://localhost:50342/oauth2/token`. See the "Sample request" in the [preceding REST section](#rest) for an example.|
|           | invalid_request | The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed. |  |
|           | unauthorized_client | The client is not authorized to request an access token using this method. | Caused by a request that didn’t use local loopback to call the extension, or on a VM that doesn’t have an MSI configured correctly. See [Configure a VM Managed Service Identity (MSI) using the Azure portal](qs-configure-portal-windows-vm.md) if you need assistance with VM configuration. |
|           | access_denied | The resource owner or authorization server denied the request. |  |
|           | unsupported_response_type | The authorization server does not support obtaining an access token using this method. |  |
|           | invalid_scope | The requested scope is invalid, unknown, or malformed. |  |
| 500 Internal server error | unknown | Failed to retrieve token from the Active directory. For details see logs in *\<file path\>* | Verify that MSI has been enabled on the VM. See [Configure a VM Managed Service Identity (MSI) using the Azure portal](qs-configure-portal-windows-vm.md) if you need assistance with VM configuration.<br><br>Also verify that your HTTP GET request URI is formatted correctly, particularly the resource URI specified in the query string. See the "Sample request" in the [preceding REST section](#rest) for an example, or [Azure services that support Azure AD authentication](overview.md#azure-services-that-support-azure-ad-authentication) for a list of services and their respective resource IDs.

## Related content

- To enable MSI on an Azure VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](qs-configure-portal-windows-vm.md).
