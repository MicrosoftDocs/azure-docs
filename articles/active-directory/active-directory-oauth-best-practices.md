<properties
	pageTitle="Best Practices for OAuth 2.0 in Azure AD | Microsoft Azure"
	description="This articles describes the best practices for developing applications that use OAuth 2.0 in Azure Active Directory."
	services="active-directory"
	documentationCenter=".net"
	authors="priyamohanram"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/21/2016"
	ms.author="priyamo"/>


# Best practices for OAuth 2.0 in Azure Active Directory

[AZURE.INCLUDE [active-directory-protocols](../../includes/active-directory-protocols.md)]

## Use the State parameter

The `state` parameter is a randomly generated, non-reusable value (typically a GUID) that the client sends in the request. It is an optional parameter but it is strongly recommended in requests for the authorization code. The response also includes the same `state` value, and the application must verify that the state values are identical before using the response.

The `state` parameter helps to detect cross-site request forgery (CSRF) attacks against the client. For more information about CSRF attacks, see [Cross-Site Request Forgery](https://tools.ietf.org/html/rfc6749#section-10.12) in the OAuth 2.0 Authorization Framework.

## Cache access tokens

To minimize network calls from the client application and their associated latency, the client application should cache access tokens for the token lifetime that is specified in the OAuth 2.0 response. To determine the token lifetime, use either the `expires_in` or `expires_on` parameter values.

If a web API resource returns an `invalid_token` error code, this might indicate that the resource has determined that the token is expired. If the client and resource clock times are different (known as a "time skew"), the resource might consider the token to be expired before the token is cleared from the client cache. If this occurs, clear the token from the cache, even if it is still within its calculated lifetime.

## Handling refresh tokens

Refresh tokens do not have specified lifetimes. Typically, the lifetimes of refresh tokens are relatively long. However, in some cases, refresh tokens expire, are revoked, or lack sufficient privileges for the desired action. The client application needs to expect and handle errors returned by the token issuance endpoint correctly.

When you receive a response with a refresh token error, discard the current refresh token and request a new authorization code or access token. In particular, when using a refresh token in the Authorization Code Grant flow, if you receive a response with the `interaction_required` or `invalid_grant` error codes, discard the refresh token and request a new authorization code.

## Verify Resource Id parameter

The client application must verify the value of the `resource_id` parameter in the response. Otherwise, a malicious service might be able to induce an elevation-of-privileges attack.

 The recommended strategy for preventing an attack is to verify that the resource_id matches the base of the web API URL that being accessed. For example, if https://service.contoso.com/data is being accessed, the `resource_id` can be https://service.contoso.com/. The client application must reject a `resource_id` that does not begin with the base URL unless there is a reliable alternate way to verify the id.

## Token issuance and retry guidelines

Azure AD supports several token issuance endpoints that clients can query. Use the following guidelines to implement retry logic for these endpoints to handle an unexpected network or server failure.

Failures that respond to retries typically return an HTTP 500-series error codes for a request to an Azure AD endpoint. In some scenarios, the client is an application or service that makes automated requests to Azure AD. In other scenarios, such as web-based federation that uses the WS-Federation protocol, the client is a web browser and the end-user must retry manually.

### Implement retry logic based on HTTP 500-series error responses

Retry logic is strongly recommended when Active Directory Access Control Service (ACS) returns HTTP 500-series errors. This includes:

- HTTP Error 500 - Internal Server error
- HTTP Error 502 - Bad Gateway
- HTTP Error 503 - Service unavailable
- HTTP Error 504 - Gateway Timeout

Although individual HTTP codes can be listed explicitly in the retry logic, it is sufficient to invoke retry logic if any HTTP 500-series error is returned.

Typically, retry logic is not recommended when HTTP 400-series error codes are returned. A 400-series HTTP error response code from ACS means the request is invalid and needs to be revised.

Retry logic should be triggered by HTTP error codes, such as HTTP 504 (External server timeout) or the HTTP 500 error code series, and not by ACS error codes, such as ACS90005. ACS error codes are informational and subject to change.

### Retries should use a back-off timer for optimal flow control

When a client receives an HTTP 500-series error, the client should wait before retrying the request. For best results, it is recommended that this period of time increase with each subsequent retry. This approach allows transient errors to be resolved quickly while optimizing the request rate for transient network or server issues that take longer to resolve.

For example, use an exponential back-off timer where the delay before retry increases exponentially with each instance, such as Retry 1: 1 second, Retry 2: 2 seconds, Retry 3: 4 seconds, and so on.

Adjust the number of retries and the time between each retry based on your user experience requirements. However, we recommend up to five retries over a period of five minutes. Failures caused by a timeout take longer to resolve.

## Next Steps

[Active Directory Authentication Libraries (ADAL)](active-directory-authentication-libraries.md)
