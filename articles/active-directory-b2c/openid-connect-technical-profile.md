---
title: Define an OpenID Connect technical profile in a custom policy
titleSuffix: Azure AD B2C
description: Define an OpenID Connect technical profile in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 08/22/2023
ms.author: kengaderdus
ms.subservice: B2C
---

# Define an OpenID Connect technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure Active Directory B2C (Azure AD B2C) provides support for the [OpenID Connect](https://openid.net/certification/) protocol identity provider. OpenID Connect 1.0 defines an identity layer on top of OAuth 2.0 and represents the state of the art in modern authentication protocols. With an OpenID Connect technical profile, you can federate with an OpenID Connect based identity provider, such as Microsoft Entra ID. Federating with an identity provider allows users to sign in with their existing social or enterprise identities.

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `OpenIdConnect`. For example, the protocol for the **MSA-OIDC** technical profile is `OpenIdConnect`:

```xml
<TechnicalProfile Id="MSA-OIDC">
  <DisplayName>Microsoft Account</DisplayName>
  <Protocol Name="OpenIdConnect" />
  ...
```

## Input claims

The **InputClaims** and **InputClaimsTransformations** elements are not required. But you may want to send additional parameters to your identity provider. The following example adds the **domain_hint** query string parameter with the value of `contoso.com` to the authorization request.

```xml
<InputClaims>
  <InputClaim ClaimTypeReferenceId="domain_hint" DefaultValue="contoso.com" />
</InputClaims>
```

## Output claims

The **OutputClaims** element contains a list of claims returned by the OpenID Connect identity provider. You may need to map the name of the claim defined in your policy to the name defined in the identity provider. You can also include claims that aren't returned by the identity provider, as long as you set the `DefaultValue` attribute.

The **OutputClaimsTransformations** element may contain a collection of **OutputClaimsTransformation** elements that are used to modify the output claims or generate new ones.

The following example shows the claims returned by the Microsoft Account identity provider:

- The **sub** claim that is mapped to the **issuerUserId** claim.
- The **name** claim that is mapped to the **displayName** claim.
- The **email** without name mapping.

The technical profile also returns claims that aren't returned by the identity provider:

- The **identityProvider** claim that contains the name of the identity provider.
- The **authenticationSource** claim with a default value of **socialIdpAuthentication**.

```xml
<OutputClaims>
  <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="live.com" />
  <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" />
  <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub" />
  <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
  <OutputClaim ClaimTypeReferenceId="email" />
</OutputClaims>
```

## Metadata

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| client_id | Yes | The application identifier of the identity provider. |
| IdTokenAudience | No | The audience of the id_token. If specified, Azure AD B2C checks whether the `aud` claim in a token returned by the identity provider is equal to the one specified in the IdTokenAudience metadata.  |
| METADATA | Yes | A URL that points to an OpenID Connect identity provider configuration document, which is also known as OpenID well-known configuration endpoint. The URL can contain the `{tenant}` expression, which is replaced with the tenant name.  |
| authorization_endpoint | No | A URL that points to an OpenID Connect identity provider configuration authorization endpoint. The value of authorization_endpoint metadata takes precedence over the `authorization_endpoint` specified in the OpenID well-known configuration endpoint. The URL can contain the `{tenant}` expression, which is replaced with the tenant name. |
| end_session_endpoint | No | The URL of the end session endpoint. The value of `end_session_endpoint` metadata takes precedence over the `end_session_endpoint` specified in the OpenID well-known configuration endpoint. |
| issuer | No | The unique identifier of an OpenID Connect identity provider. The value of issuer metadata takes precedence over the `issuer` specified in the OpenID well-known configuration endpoint.  If specified, Azure AD B2C checks whether the `iss` claim in a token returned by the identity provider is equal to the one specified in the issuer metadata. |
| ProviderName | No | The name of the identity provider.  |
| response_types | No | The response type according to the OpenID Connect Core 1.0 specification. Possible values: `id_token`, `code`, or `token`. |
| response_mode | No | The method that the identity provider uses to send the result back to Azure AD B2C. Possible values: `query`, `form_post` (default), or `fragment`. |
| scope | No | The scope of the request that is defined according to the OpenID Connect Core 1.0 specification. Such as `openid`, `profile`, and `email`. |
| HttpBinding | No | The expected HTTP binding to the access token and claims token endpoints. Possible values: `GET` or `POST`.  |
| ValidTokenIssuerPrefixes | No | A key that can be used to sign in to each of the tenants when using a multi-tenant identity provider such as Microsoft Entra ID. |
| UsePolicyInRedirectUri | No | Indicates whether to use a policy when constructing the redirect URI. When you configure your application in the identity provider, you need to specify the redirect URI. The redirect URI points to Azure AD B2C, `https://{your-tenant-name}.b2clogin.com/{your-tenant-name}.onmicrosoft.com/oauth2/authresp`.  If you specify `true`, you need to add a redirect URI for each policy you use. For example: `https://{your-tenant-name}.b2clogin.com/{your-tenant-name}.onmicrosoft.com/{policy-name}/oauth2/authresp`. |
| MarkAsFailureOnStatusCode5xx | No | Indicates whether a request to an external service should be marked as a failure if the Http status code is in the 5xx range. The default is `false`. |
| DiscoverMetadataByTokenIssuer | No | Indicates whether the OIDC metadata should be discovered by using the issuer in the JWT token.If you need to build the metadata endpoint URL based on Issuer, set this to `true`.|
| IncludeClaimResolvingInClaimsHandling  | No | For input and output claims, specifies whether [claims resolution](claim-resolver-overview.md) is included in the technical profile. Possible values: `true`, or `false` (default). If you want to use a claims resolver in the technical profile, set this to `true`. |
|token_endpoint_auth_method| No | Specifies how Azure AD B2C sends the authentication header to the token endpoint. Possible values: `client_secret_post` (default), and `client_secret_basic` (public preview), `private_key_jwt`. For more information, see [OpenID Connect client authentication section](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication). |
|token_signing_algorithm| No | Specifies the signing algorithm to use when `token_endpoint_auth_method` is set to `private_key_jwt`. Possible values: `RS256` (default) or `RS512`.|
| SingleLogoutEnabled | No | Indicates whether during sign-in the technical profile attempts to sign out from federated identity providers. For more information, see [Azure AD B2C session sign-out](./session-behavior.md#sign-out).  Possible values: `true` (default), or `false`. |
|ReadBodyClaimsOnIdpRedirect| No| Set to `true` to read claims from response body on identity provider redirect. This metadata is used with [Apple ID](identity-provider-apple-id.md), where claims return in the response payload.|

```xml
<Metadata>
  <Item Key="ProviderName">https://login.live.com</Item>
  <Item Key="METADATA">https://login.live.com/.well-known/openid-configuration</Item>
  <Item Key="response_types">code</Item>
  <Item Key="response_mode">form_post</Item>
  <Item Key="scope">openid profile email</Item>
  <Item Key="HttpBinding">POST</Item>
  <Item Key="UsePolicyInRedirectUri">false</Item>
  <Item Key="client_id">Your Microsoft application client ID</Item>
</Metadata>
```

### UI elements
 
The following settings can be used to configure the error message displayed upon failure. The metadata should be configured in the OpenID Connect technical profile. The error messages can be [localized](localization-string-ids.md#sign-up-or-sign-in-error-messages).

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| UserMessageIfClaimsPrincipalDoesNotExist | No | The message to display to the user if an account with the provided username not found in the directory. |
| UserMessageIfInvalidPassword | No | The message to display to the user if the password is incorrect. |
| UserMessageIfOldPasswordUsed| No |  The message to display to the user if an old password used.|

## Cryptographic keys

The **CryptographicKeys** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| client_secret | Yes | The client secret of the identity provider application. This cryptographic key is required only if the **response_types** metadata is set to `code` and **token_endpoint_auth_method** is set to `client_secret_post` or `client_secret_basic`. In this case, Azure AD B2C makes another call to exchange the authorization code for an access token. If the metadata is set to `id_token` you can omit the cryptographic key.  |
| assertion_signing_key | Yes | The RSA private key which will be used to sign the client assertion. This cryptographic key is required only if the **token_endpoint_auth_method** metadata is set to `private_key_jwt`. |

## Redirect URI

When you configure the redirect URI of your identity provider, enter `https://{your-tenant-name}.b2clogin.com/{your-tenant-name}.onmicrosoft.com/oauth2/authresp`. Make sure to replace `{your-tenant-name}` with your tenant's name. The redirect URI needs to be in all lowercase.

Examples:

- [Add Microsoft Account (MSA) as an identity provider using custom policies](identity-provider-microsoft-account.md)
- [Sign in by using Microsoft Entra accounts](identity-provider-azure-ad-single-tenant.md)
- [Allow users to sign in to a multi-tenant Microsoft Entra identity provider using custom policies](identity-provider-azure-ad-multi-tenant.md)
