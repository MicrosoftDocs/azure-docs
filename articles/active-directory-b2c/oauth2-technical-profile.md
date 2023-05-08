---
title: Define an OAuth2 technical profile in a custom policy
titleSuffix: Azure AD B2C
description: Define an OAuth2 technical profile in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 11/30/2021
ms.author: kengaderdus
ms.subservice: B2C
---

# Define an OAuth2 technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure Active Directory B2C (Azure AD B2C) provides support for the OAuth2 protocol identity provider. OAuth2 is the primary protocol for authorization and delegated authentication. For more information, see the [RFC 6749 The OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749). With an OAuth2 technical profile, you can federate with an OAuth2 based identity provider, such as Facebook. Federating with an identity provider allows users to sign in with their existing social or enterprise identities.

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `OAuth2`. For example, the protocol for the **Facebook-OAUTH** technical profile is `OAuth2`:

```xml
<TechnicalProfile Id="Facebook-OAUTH">
  <DisplayName>Facebook</DisplayName>
  <Protocol Name="OAuth2" />
  ...
```

## Input claims

The **InputClaims** and **InputClaimsTransformations** elements are not required. But you may want to send more parameters to your identity provider. The following example adds the **domain_hint** query string parameter with the value of `contoso.com` to the authorization request.

```xml
<InputClaims>
  <InputClaim ClaimTypeReferenceId="domain_hint" DefaultValue="contoso.com" />
</InputClaims>
```

## Output claims

The **OutputClaims** element contains a list of claims returned by the OAuth2 identity provider. You may need to map the name of the claim defined in your policy to the name defined in the identity provider. You can also include claims that aren't returned by the identity provider as long as you set the `DefaultValue` attribute.

The **OutputClaimsTransformations** element may contain a collection of **OutputClaimsTransformation** elements that are used to modify the output claims or generate new ones.

The following example shows the claims returned by the Facebook identity provider:

- The **first_name** claim is mapped to the **givenName** claim.
- The **last_name** claim is mapped to the **surname** claim.
- The **displayName** claim without name-mapping.
- The **email** claim without name mapping.

The technical profile also returns claims that aren't returned by the identity provider:

- The **identityProvider** claim that contains the name of the identity provider.
- The **authenticationSource** claim with a default value of **socialIdpAuthentication**.

```xml
<OutputClaims>
  <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="id" />
  <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="first_name" />
  <OutputClaim ClaimTypeReferenceId="surname" PartnerClaimType="last_name" />
  <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
  <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />
  <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="facebook.com" />
  <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" />
</OutputClaims>
```



## Authorization endpoint metadata

The authorization flow begins when Azure AD B2C directs the user to the OAuth2 identity providers `/authorize` endpoint. The call to the authorization endpoint is the interactive part of the flow, where the user takes action. At this point, the user is asked to complete the sign-in at the OAuth2 identity provider. For example, by entering their username and password.

Azure AD B2C creates an authorization request by providing the client ID, scopes, redirect URI and other parameters that it needs to acquire an access token from the identity provider. This section describes the authorization endpoint metadata, which allows configuring the request to the `/authorize` endpoint of the identity provider.

The request to the authorization endpoint is always HTTP GET. The following sample demonstrates a call to the authorization endpoint.

```http
GET https://login.contoso.com/oauth/v2/authorization?
client_id=12345
&response_type=code
&response_mode=query
&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob
&scope=profile%20offline_access
&redirect_uri=https%3a%2f%2fabrikam.b2clogin.com%2fabrikam.onmicrosoft.com%2foauth2%2fauthresp
&state=...
```

The following table lists the authorization endpoint metadata.

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `authorization_endpoint` | Yes | The URL of the authorization endpoint as per RFC 6749. |
| `client_id` | Yes | The application identifier of the identity provider. |
| `AdditionalRequestQueryParameters` | No | Extra request query parameters. For example, you may want to send extra parameters to your identity provider. You can include multiple parameters using comma delimiter. |
| `response_mode` | No | The method that the identity provider uses to send the result back to Azure AD B2C. Possible values: `query`, `form_post` (default), or `fragment`. |
| `scope` | No | The scope of the request that is defined according to the OAuth2 identity provider specification. Such as `openid`, `profile`, and `email`. |
| `UsePolicyInRedirectUri` | No | Indicates whether to use a policy when constructing the redirect URI. When you configure your application in the identity provider, you need to specify the redirect URI. The redirect URI points to Azure AD B2C, `https://{your-tenant-name}.b2clogin.com/{your-tenant-name}.onmicrosoft.com/oauth2/authresp`. If you specify `true`, you need to add a redirect URI for each policy you use. For example: `https://{your-tenant-name}.b2clogin.com/{your-tenant-name}.onmicrosoft.com/{policy-name}/oauth2/authresp`. |

## Token endpoint metadata

After the user completes their authentication at the authorization endpoint of the identity provider, a response containing the authorization `code` is returned to Azure AD B2C. Azure AD B2C redeems the authorization code for an access token by sending a POST request to the `/token` endpoint of the identity provider. This section describes the token endpoint metadata, which allows configuring the request to the `/token` endpoint of the identity provider.

The following HTTP request shows an Azure AD B2C call to the identity provider's token endpoint.

```http
POST https://contoso/oauth2/token 
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&client_id=12345&scope=profile offline_access&code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq... 
```

The following table lists the token endpoint metadata.

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `AccessTokenEndpoint` | Yes | The URL of the token endpoint. For example, `https://www.linkedin.com/oauth/v2/accessToken`. |
| `HttpBinding` | No | The expected HTTP binding to the token endpoint. Possible values: `GET` or `POST`.  |
| `AccessTokenResponseFormat` | No | The format of the access token endpoint call. For example, Facebook requires an HTTP GET method, but the access token response is in JSON format. Possible values: `Default`, `Json`, and `JsonP`. |
| `ExtraParamsInAccessTokenEndpointResponse` | No | Contains the extra parameters that can be returned in the response from **AccessTokenEndpoint** by some identity providers. For example, the response from **AccessTokenEndpoint** contains an extra parameter such as `openid`, which is a mandatory parameter besides the access_token in a **ClaimsEndpoint** request query string. Multiple parameter names should be escaped and separated by the comma ',' delimiter. |
|`token_endpoint_auth_method`| No| Specifies how Azure AD B2C sends the authentication header to the token endpoint. Possible values: `client_secret_post` (default), and `client_secret_basic`, `private_key_jwt`. For more information, see [OpenID Connect client authentication section](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication). |
|`token_signing_algorithm`| No | Specifies the signing algorithm to use when `token_endpoint_auth_method` is set to `private_key_jwt`. Possible values: `RS256` (default) or `RS512`.|

### Configure HTTP binding method

By default the request to the token endpoint uses HTTP POST.

```xml
<Item Key="AccessTokenEndpoint">https://contoso.com/oauth2/token</Item>
<Item Key="HttpBinding">POST</Item>
```

The following HTTP call demonstrates a call to the token endpoint using HTTP POST request:

```http
POST /oauth2/token

client_id=abcd&client_secret=1234&redirect_uri=https%3a%2f%2fcontoso.b2clogin.com%2fcontoso.onmicrosoft.com%2foauth2%2fauthresp&code=12345&grant_type=authorization_code
```

For identity providers that require the use of HTTP GET method at the `/token` endpoint, set the `HttpBinding` metadata to `GET`. Note, in the following example, the `AccessTokenResponseFormat` is set to `json`, since the token endpoint returns the response in JSON format.

```xml
<Item Key="AccessTokenEndpoint">https://contoso.com/oauth2/token</Item>
<Item Key="HttpBinding">GET</Item>
<Item Key="AccessTokenResponseFormat">json</Item>
```

```http
GET /oauth2/token?client_id=abcd&client_secret=1234&redirect_uri=https%3a%2f%2fcontoso.b2clogin.com%2fcontoso.onmicrosoft.com%2foauth2%2fauthresp&code=12345&grant_type=authorization_code
```

### Configure the access token response format

For identity providers that support HTTP POST method, the `AccessTokenResponseFormat` is set by default to `json`. If the identity provider supports HTTP GET request, you have to set the access token response format to `json` explicitly.

```xml
<Item Key="AccessTokenEndpoint">https://contoso.com/oauth2/token</Item>
<Item Key="HttpBinding">GET</Item>
<Item Key="AccessTokenResponseFormat">json</Item>
```

The following example demonstrates a token endpoint response in JSON format:

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlBFcG5...",
    "token_type": "Bearer",
    "not_before": 1637924390,
    "expires_in": 960000,
}
```

### Configure the authentication method

Requests to the token endpoint always require authentication. By default Azure AD B2C provides the identity provider with client credentials. By default the authentication method is `client_secret_post`, including the client credentials (`client_id` and `client_secret`) in the request body.

The following HTTP request to the token endpoint contains the `client_id` and the `client_secret` in the POST data. For GET requests `client_id` and the `client_secret` are included in the query string parameters.

```http
POST /oauth2/token

client_id=abcd&client_secret=1234&redirect_uri=https%3a%2f%2fcontoso.b2clogin.com%2fcontoso.onmicrosoft.com%2foauth2%2fauthresp&code=12345&grant_type=authorization_code
```

For identity providers that require the use of HTTP basic authentication at their `/token` endpoint, configure the `token_endpoint_auth_method` metadata to `client_secret_basic`. With this type of authentication method, the client credentials are passed to the identity provider using the HTTP Basic authentication scheme. 

```xml
<Item Key="AccessTokenEndpoint">https://contoso.com/oauth2/token</Item>
<Item Key="token_endpoint_auth_method">client_secret_basic</Item>
```

The following HTTP request demonstrates a call to the token endpoint with HTTP basic authentication. The authorization header contains the client ID and client secret, in the format `client_ID:client_secret`, base64 encoded.

```http
POST /oauth2/token

Authorization: Basic YWJjZDoxMjM0

redirect_uri=https%3a%2f%2fcontoso.b2clogin.com%2fontoso.onmicrosoft.com%2foauth2%2fauthresp&code=12345&grant_type=authorization_code
```

For identity providers that support private key JWT authentication, configure the `token_endpoint_auth_method` metadata to `private_key_jwt`. With this type of authentication method, the certificate provided to Azure AD B2C is used to generate a signed assertion, which is passed to the identity provider through the `client_assertion` parameter. The `client_assertion_type` set to `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`. The `token_signing_algorithm` metadata specifies the signing algorithm of the JWT token. 

```xml
<Item Key="AccessTokenEndpoint">https://contoso.com/oauth2/token</Item>
<Item Key="token_endpoint_auth_method">private_key_jwt</Item>
<Item Key="token_signing_algorithm">RS256</Item>
```

The following HTTP request demonstrates a call to the token endpoint using private key JWT authentication.

```http
POST /oauth2/token

client_assertion=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjJFRFg0dWRYeDIxbXNoaXdJVzczMUY3OUZSbFJiUDZXVXJyZmktR1RFeVkifQ.eyJpc3MiOiJhYmNkIiwiZXhwIjoxNjM3OTI5ODY0LCJuYmYiOjE2Mzc5Mjk1NjQsImF1ZCI6Imh0dHBzOi8vNWRlNC0xMDktNjQtMTI0LTUzLm5ncm9rLmlvL2FjY2Vzc190b2tlbiIsImp0aSI6IjVxQWlGV2lEODNDbU1KWWNrejBRdGc9PSIsInN1YiI6ImFiY2QiLCJpYXQiOjE2Mzc5Mjk1NjR9.C4OtRnrLaQatpT5LP45O5Nb418S4v8yZi_C42ld440w&client_id=abcd&client_assertion_type=urn%3aietf%3aparams%3aoauth%3aclient-assertion-type%3ajwt-bearer&redirect_uri=https%3a%2f%2fcontoso.b2clogin.com%2fcontoso.onmicrosoft.com%2foauth2%2fauthresp&code=12345&grant_type=authorization_code
```

## User info endpoint metadata

After Azure AD B2C gets the access token from the OAuth2 identity provider, it makes a call to the user info endpoint. The user info endpoint, also known as claims endpoint is designed to retrieve claims about the authenticated user. Azure AD B2C uses [bearer token authentication](https://datatracker.ietf.org/doc/html/rfc6750) to authenticate to the identity providers user info endpoint. The bearer token is the access token that Azure AD B2C obtains from the identity providers `/token` endpoint.

The request to the user info endpoint is always HTTP GET. The access token is sent in a query string parameter named `access_token`. The following HTTP request shows a call to the user info endpoint with the access token in the query string parameter.

```http
GET /oauth2/claims?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlBFcG5... 
```

The following table lists the user info endpoint metadata.

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `ClaimsEndpoint` | Yes | The URL of the user information endpoint. For example, `https://api.linkedin.com/v2/me`. |
| `ClaimsEndpointAccessTokenName` | No | The name of the access token query string parameter. Default value: `access_token`. |
| `ClaimsEndpointFormatName` | No | The name of the format query string parameter. For example, you can set the name as `format` in this LinkedIn claims endpoint `https://api.linkedin.com/v1/people/~?format=json`. |
| `ClaimsEndpointFormat` | No | The value of the format query string parameter. For example, you can set the value as `json` in this LinkedIn claims endpoint `https://api.linkedin.com/v1/people/~?format=json`. |
| `BearerTokenTransmissionMethod` | No | Specifies how the token is sent. The default method is a query string. To send the token as a request header, set to `AuthorizationHeader`. |
| `ExtraParamsInClaimsEndpointRequest` | No | Contains the extra parameters that can be returned in the **ClaimsEndpoint** request by some identity providers. Multiple parameter names should be escaped and separated by the comma ',' delimiter. |

### Configure the access token query string parameter

The user info endpoint may require the access token to be sent in a particular query string parameter. To change the name of the query string parameter, which contains the access token, use the `ClaimsEndpointAccessTokenName` metadata. In the following example, the access token query string parameter is set to `token`.

```xml
<Item Key="ClaimsEndpoint">https://contoso.com/oauth2/claims</Item>
<Item Key="ClaimsEndpointAccessTokenName">token</Item>
```

The following HTTP call demonstrates a call to the user info endpoint with `ClaimsEndpointAccessTokenName` set to `token`:

```http
GET /oauth2/claims?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlBFcG5...
```

### Configure the claims format

The `ClaimsEndpointFormatName` and `ClaimsEndpointFormat` allow you to send a key-value pair query string parameter to the user info endpoint. The following example configures a query string parameter named `format`, with the value of `json`. 

```xml
<Item Key="ClaimsEndpoint">https://contoso.com/oauth2/claims</Item>
<Item Key="ClaimsEndpointFormatName">format</Item>
<Item Key="ClaimsEndpointFormat">json</Item>
```

The following HTTP request demonstrates a call to the user info endpoint with `ClaimsEndpointFormatName` and `ClaimsEndpointFormat` configured.

```http
GET /oauth2/claims?format=json&access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlBFcG5...
```

### Configure bearer token transmission method

By default the access token is sent to the identity providers user info endpoint through a query string parameter. To send the token within the HTTP `Authorization` header, set `BearerTokenTransmissionMethod` metadata to `AuthorizationHeader`.

```xml
<Item Key="ClaimsEndpoint">https://contoso.com/oauth2/claims</Item>
<Item Key="BearerTokenTransmissionMethod">AuthorizationHeader</Item>
```

The following HTTP request demonstrates how the access token is passed when `BearerTokenTransmissionMethod` is set to `AuthorizationHeader`.

```http
GET /oauth2/claims

Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlBFcG5...
```

### Pass parameters returned by the token endpoint

Some identity providers require to pass extra parameters that are returned from the token endpoint to the user info endpoint. For example, the response from token endpoint contains a parameter named `resource`, which is a mandatory parameter of the user info endpoint (besides the access token). Use the `ExtraParamsInClaimsEndpointRequest` metadata to specify any extra parameters to pass. Multiple parameter names should be escaped and separated by the comma ',' delimiter.

The following JSON demonstrates a JSON payload return by the token endpoint with a parameter named `resource`.

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlBFcG5...",
    "token_type": "Bearer",
    "not_before": 1549647431,
    "expires_in": 960000,
    "resource": "f2a76e08-93f2-4350-833c-965c02483b11"
}
```

To pass the `resource` parameter to the user info endpoint, add the following metadata:

```xml
<Item Key="ExtraParamsInClaimsEndpointRequest">resource</Item>
```

The following HTTP request demonstrates how the `resource` parameter is passed to the user info endpoint.

```http
GET /oauth2/claims?resource=f2a76e08-93f2-4350-833c-965c02483b11&access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlBFcG5...
```

## End session endpoint

To sign the user out of the application, redirect the user to the [Azure AD B2C sign-out endpoint](openid-connect.md#send-a-sign-out-request) (for both OAuth2 and OpenID Connect) or send a `LogoutRequest` (for SAML). Azure AD B2C will clear the user's session from the browser. Upon a sign-out request, Azure AD B2C attempts to sign out from any federated identity providers the user may have signed in through. The OAuth2 identity provider's sign-out URI is configured in the `end_session_endpoint` metadata. When the user logs out of your application via Azure AD B2C, a hidden iframe will be created which will call the `end_session_endpoint` at their Azure AD B2C sign-out page.

The following table lists the user info endpoint metadata.

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `end_session_endpoint` | Yes | The URL of the end session endpoint as per RFC 6749. |
| `SingleLogoutEnabled` | No | Indicates whether during sign-in the technical profile attempts to sign out from federated identity providers. For more information, see [Azure AD B2C session sign-out](session-behavior.md#sign-out). Possible values: `true` (default), or `false`.|

## OAuth2 generic metadata

The following table lists the OAuth2 identity provider generic metadata. The metadata describes how the OAuth2 technical profile handles token validation, get the claims, and react to error messages.  

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `IdTokenAudience` | No | The audience of the id_token. If specified, Azure AD B2C checks whether the token is in a claim returned by the identity provider and is equal to the one specified. |
| `ProviderName` | No | The name of the identity provider. |
| `ResponseErrorCodeParamName` | No | The name of the parameter that contains the error message returned over HTTP 200 (Ok). |
| `IncludeClaimResolvingInClaimsHandling`  | No | For input and output claims, specifies whether [claims resolution](claim-resolver-overview.md) is included in the technical profile. Possible values: `true`, or `false` (default). If you want to use a claims resolver in the technical profile, set this to `true`. |
| `ResolveJsonPathsInJsonTokens`  | No | Indicates whether the technical profile resolves JSON paths. Possible values: `true`, or `false` (default). Use this metadata to read data from a nested JSON element. In an [OutputClaim](technicalprofiles.md#output-claims), set the `PartnerClaimType` to the JSON path element you want to output. For example: `firstName.localized`, or `data[0].to[0].email`.|

## Cryptographic keys

The **CryptographicKeys** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `client_secret` | Yes | The client secret of the identity provider application. The cryptographic key is required only if the **response_types** metadata is set to `code`. In this case, Azure AD B2C makes another call to exchange the authorization code for an access token. If the metadata is set to `id_token`, you can omit the cryptographic key. |
| `assertion_signing_key` | No | When the `token_endpoint_auth_method` metadata is set to `private_key_jwt`, provide a X509 certificate to use to sign the JWT key. This key should be provided to you by the OAuth2 identity provider. |

## Redirect URI

When you configure the redirect URI of your identity provider, enter `https://{tenant-name}.b2clogin.com/{tenant-name}.onmicrosoft.com/oauth2/authresp`. Make sure to replace `{tenant-name}` with your tenant's name (for example, contosob2c). The redirect URI needs to be in all lowercase.

## Next steps

- Learn how to [add an identity provider to your Azure Active Directory B2C tenant](add-identity-provider.md)
