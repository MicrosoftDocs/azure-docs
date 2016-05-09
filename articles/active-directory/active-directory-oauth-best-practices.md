<properties
	pageTitle="Best Practices for OAuth 2.0 in Azure AD | Microsoft Azure"
	description="Best Practices for OAuth 2.0 in Azure AD"
	services="active-directory"
	documentationCenter=".net"
	authors="priyamohanram"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="01/21/2016"
	ms.author="priyamo"/>


# Best Practices for OAuth 2.0 in Azure AD

## Use the State Parameter

The `state` parameter is optional but recommended in requests for the authorization code. Typically, the `state` parameter is a GUID, that the client sends in the request. The response also includes the same `state` value, and the application must verify that the state values are identical before using the response.

The `state` parameter helps to detect cross-site request forgery (CSRF) attacks against the client. For more information about CSRF attacks, see [Cross-Site Request Forgery](https://tools.ietf.org/html/rfc6749#section-10.12) in the OAuth 2.0 Authorization Framework.

## Cache Access tokens

To minimize network calls from the client application and their associated latency, the client application should cache access tokens for the token lifetime that is specified in the OAuth 2.0 response. To determine the token lifetime, use either the `expires_in` or `expires_on` parameter values.

If a web API resource returns an `invalid_token` error code, this might indicate that the resource has determined that the token is expired. If the client and resource clock times are different (known as a "time skew"), the resource might consider the token to be expired before the token is cleared from the client cache. If this occurs, clear the token from the cache, even if it is still within its calculated lifetime.

## Handling Refresh tokens

Refresh tokens do not have specified lifetimes. Typically, the lifetimes of refresh tokens are relatively long. However, in some cases, refresh tokens expire, are revoked, or lack sufficient privileges for the desired action. The client application needs to expect and handle errors returned by the token issuance endpoint correctly.

When you receive a response with a refresh token error, discard the current refresh token and request a new authorization code or access token. In particular, when using a refresh token in the Authorization Code Grant flow, if you receive a response with the `interaction_required` or `invalid_grant` error codes, discard the refresh token and request a new authorization code.

## Verify Resource Id Parameter

The client application must verify the value of the `resource_id` parameter in the response. Otherwise, a malicious service might be able to induce an elevation-of-privileges attack.

 The recommended strategy for preventing an attack is to verify that the resource_id matches the base of the web API URL that being accessed. For example, if https://service.contoso.com/data is being accessed, the `resource_id` can be https://service.contoso.com/. The client application must reject a `resource_id` that does not begin with the base URL unless there is a reliable alternate way to verify the id.
