<properties
	pageTitle="Error handling in OAuth 2.0 | Microsoft Azure"
	description="Error Handling in OAuth 2.0"
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

# Error Handling in OAuth 2.0

In this article, we will learn some best practices for handling common classes of errors that you may encounter when authorizing your application with Azure AD.

## Authorization Endpoint errors

These are errors that originate at the Azure AD authorization endpoint. These are returned either as HTTP 200 errors on a web page, or using an HTTP 302 redirect code when a client application is available to handle the error.

Here is a sample HTTP 302 error response from the Azure AD authorization endpoint, when a request is missing the required `response_type` parameter.

```
GET  HTTP/1.1 302 Found
Location: http://localhost/myapp/?error=invalid_request&error_description=AADSTS90014%3a+The+request+body+must+contain+the+following+parameter%3a+%27response_type%27.%0d%0aTrace+ID%3a+57f5cb47-2278-4802-a018-d05d9145daad%0d%0aCorrelation+ID%3a+570a9ed3-bf1d-40d1-81ae-63465cc25488%0d%0aTimestamp%3a+2013-12-31+05%3a51%3a35Z&state=D79E5777-702E-4260-9A62-37F75FF22CCE
```

| Parameter | Description |
|-----------|-------------|
| error | An error code value defined in Section 5.2 of the [OAuth 2.0 Authorization Framework](http://tools.ietf.org/html/rfc6749). The next table describes the error codes that Azure AD returns. |
| error_description | A more detailed description of the error. This message is not intended to be end-user friendly. |
| state | The state value is a randomly generated non-reused value that is sent in the request and returned in the response to prevent cross-site request forgery (CSRF) attacks. |

### Error codes for Authorization Endpoint Errors

The following table describes the various error codes that can be returned in the `error` parameter of the error response.

| Error Code | Description | Client Action |
|------------|-------------|---------------|
| invalid_request | Protocol error, such as a missing required parameter. | Fix and resubmit the request. This is a development error is typically caught during initial testing.|
| unauthorized_client | The client application is not permitted to request an authorization code. | This usually occurs when the client application is not registered in Azure AD or is not added to the user's Azure AD tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD. |
| access_denied | Resource owner denied consent | The client application can notify the user that it cannot proceed unless the user consents. |
| unsupported_response_type | The authorization server does not support the response type in the request. | Fix and resubmit the request. This is a development error is typically caught during initial testing.|
|server_error | The server encountered an unexpected error. | Retry the request. These errors can result from temporary conditions. The client application might explain to the user that its response is delayed due a temporary error. |
| temporarily_unavailable | The server is temporarily too busy to handle the request. | Retry the request. The client application might explain to the user that its response is delayed due a temporary condition. |
| invalid_resource |The target resource is invalid because it does not exist, Azure AD cannot find it, or it is not correctly configured.| This indicates the resource, if it exists, has not been configured in the tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD. |

## Token Issuance Endpoint errors

These are HTTP error codes, because the client calls the token issuance endpoint directly. In addition to the HTTP status code, the Azure AD token issuance endpoint also returns a JSON document with objects that describe the error.

For example, an error if the `client_id` parameter in the request is invalid could look like:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{"error":"invalid_request","error_description":"AADSTS90011: Request is ambiguous, multiple application identifiers found. Application identifiers: '197451ec-ade4-40e4-b403-02105abd9049, 597451ec-ade4-40e4-b403-02105abd9049'.\r\nTrace ID: 4457d068-2a03-42b2-97f2-d55325289d86\r\nCorrelation ID: 6b3474d8-233e-463f-b0a3-86433d8ba889\r\nTimestamp: 2013-12-31 06:31:41Z","error_codes":[90011],"timestamp":"2013-12-31 06:31:41Z","trace_id":"4457d068-2a03-42b2-97f2-d55325289d86","correlation_id":"6b3474d8-233e-463f-b0a3-86433d8ba889"}
```
### HTTP Status codes

The following table lists the HTTP status codes that the token issuance endpoint returns. In some cases, the error code is sufficient to describe the response, but in case of errors, you will need to parse the accompanying JSON document and examine its error code.

| HTTP Code | Description |
|-----------|-------------|
| 400       | Default HTTP code. Used in most cases and is typically due to a malformed request. Fix and resubmit the request. |
| 401       | Authentication failed. For example, the request is missing the client_secret parameter.|
| 403       | Authorization failed. For example, the user does not have permission to access the resource. |
| 500       | An internal error has occurred at the service. Retry the request. |

### JSON Document Objects in the Error response

| JSON Object | Description |
|-------------|-------------|
| error | An error code value defined in Section 5.2 of the [OAuth 2.0 Authorization Framework](http://tools.ietf.org/html/rfc6749). The next table describes the error codes that Azure AD returns. |
| error_description | A more detailed description of the error. This message is not intended to be end-user friendly. |
| timestamp | The date and time that the error occurred in Universal Coordinated Time (UTC). |
| trace_id  | An ID that identifies the error trace. |
| correlation_id | 	A value generated by the client. This ID is included in the JSON error document when the request to the token issuance endpoint includes this value in the `client-request-id` header. This ID may be used by other calls in the same session. |
| error_codes | Contains a list of error codes that map to different conditions of the service. Do not use these codes in your application logic. However, you can use them to diagnose an issue and search for information online by error code. |

### JSON Document Error Code values

| Error Code | Description | Client Action |
|------------|-------------|---------------|
| invalid_request | Protocol error, such as a missing required parameter. | Fix and resubmit the request |
| invalid_grant | The authorization grant (or its parameters) or refresh token is invalid, expired, or revoked. | Fix and resubmit the request. |
| unauthorized_client | The authenticated client is not authorized to use this authorization grant type. | This usually occurs when the client application is not registered in Azure AD or is not added to the user's Azure AD tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD. |
| invalid_client | Client authentication failed. | The client credentials are not valid. To fix, the application administrator updates the credentials. |
| unsupported_grant_type | The authorization server does not support the authorization grant type. | Change the grant type in the request. This type of error should occur only during development and be detected during initial testing. |
| invalid_resource | The target resource is invalid because it does not exist, Azure AD cannot find it, or it is not correctly configured. | This indicates the resource, if it exists, has not been configured in the tenant. The application can prompt the user with instruction for installing the application and adding it to Azure AD. |
| interaction_required | The request requires user interaction. For example, an additional authentication step is required. | Retry the request with the same resource. |
| temporarily_unavailable | The server is temporarily too busy to handle the request. | Retry the request. The client application might explain to the user that its response is delayed due a temporary condition.|

## Errors from Secured resources

These are the errors that a secured resource, such as a Web API might return, if it implements the [RFC 6750](http://tools.ietf.org/html/rfc6750) specification of the OAuth 2.0 Authorization Framework.

Secured resources that implement RFC 6750 issue HTTP status codes. If the request does not include authentication credentials or is missing the token, the response includes an `WWW-Authenticate` header. When a request fails, the resource server responds with the an HTTP status code and an error code.

The following is an example of an unsuccessful response when the client request does not include the bearer token:

```
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer authorization_uri="https://login.window.net/contoso.com/oauth2/authorize",  error="invalid_token",  error_description="The access token is missing.",
```

## Error parameters

| Parameter | Description |
|-----------|-------------|
| authorization_uri | The URI (physical endpoint) of the authorization server. This value is also used as a lookup key to get more information about the server from a discovery endpoint. <p><p> The client must validate that the authorization server is trusted. When the resource is protected by Azure AD, it is sufficient to verify that the URL begins with https://login.windows.net or another hostname that Azure AD supports. A tenant-specific resource should always return a tenant-specific authorization URI. |
| error | An error code value defined in Section 5.2 of the [OAuth 2.0 Authorization Framework](http://tools.ietf.org/html/rfc6749).|
| error_description | A more detailed description of the error. This message is not intended to be end-user friendly.|
| resource_id | Returns the unique identifier of the resource. The client application can use this identifier as the value of the `resource` parameter when it requests a token for the resource. <p><p> It is very important for the client application to verify this value, otherwise a malicious service might be able to induce an **elevation-of-privileges** attack <p><p> The recommended strategy for preventing an attack is to verify that the `resource_id` matches the base of the web API URL that being accessed. For example, if https://service.contoso.com/data is being accessed, the `resource_id` can be htttps://service.contoso.com/. The client application must reject a `resource_id` that does not begin with the base URL unless there is a reliable alternate way to verify the id. |

## Bearer Scheme Error codes

The RFC 6750 specification defines the following errors for resources that use using the WWW-Authenticate header and Bearer scheme in the response.

| HTTP Status Code | Error Code | Description | Client Action |
|------------------|------------|-------------|---------------|
| 400 | invalid_request | The request is not well-formed. For example, it might be missing a parameter or using the same parameter twice. | Fix the error and retry the request. This type of error should occur only during development and be detected in initial testing. |
| 401 | invalid_token   | The access token is missing, invalid, or is revoked. The value of the error_description parameter provides additional detail. |  Request a new token from the authorization server. If the new token fails, an unexpected error has occurred. Send an error message to the user and retry after random delays. |
| 403 | insufficient_scope | The access token does not contain the impersonation permissions required to access the resource. | Send a new authorization request to the authorization endpoint. If the response contains the scope parameter, use the scope value in the request to the resource. |
| 403 | insufficient_access | The subject of the token does not have the permissions that are required to access the resource. | Prompt the user to use a different account or to request permissions to the specified resource. |
