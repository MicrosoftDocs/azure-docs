---
title: Define an OpenId Connect technical profile in a custom policy in Azure Active Directory B2C | Microsoft Docs
description: Define an OpenId Connect technical profile in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 09/10/2018
ms.author: marsma
ms.subservice: B2C
---

# Define an OpenId Connect technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure Active Directory (Azure AD) B2C provides support for the [OpenId Connect](https://openid.net/2015/04/17/openid-connect-certification-program/) protocol identity provider. OpenID Connect 1.0 defines an identity layer on top of OAuth 2.0 and represents the state of the art in modern authentication protocols. With an OpenId Connect technical profile, you can federate with an OpenId Connect based identity provider, such as Azure AD. Federating with an identity provider allows users to sign in with their existing social or enterprise identities.

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `OpenIdConnect`. For example, the protocol for the **MSA-OIDC** technical profile is `OpenIdConnect`:

```XML
<TechnicalProfile Id="MSA-OIDC">
  <DisplayName>Microsoft Account</DisplayName>
  <Protocol Name="OpenIdConnect" />
  ...    
```

## Input claims

The **InputClaims** and **InputClaimsTransformations** elements are not required. But you may want to send additional parameters to your identity provider. The following example adds the **domain_hint** query string parameter with the value of `contoso.com` to the authorization request.

```XML
<InputClaims>
  <InputClaim ClaimTypeReferenceId="domain_hint" DefaultValue="contoso.com" />
</InputClaims>
```

## Output claims

The **OutputClaims** element contains a list of claims returned by the OpenId Connect identity provider. You may need to map the name of the claim defined in your policy to the name defined in the identity provider. You can also include claims that aren't returned by the identity provider, as long as you set the `DefaultValue` attribute.

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
| IdTokenAudience | No | The audience of the id_token. If specified, Azure AD B2C checks whether the token is in a claim returned by the identity provider and is equal to the one specified. |
| METADATA | Yes | A URL that points to a JSON configuration document formatted according to the OpenID Connect Discovery specification, which is also known as a well-known openid configuration endpoint. |
| ProviderName | No | The name of the identity provider. |
| response_types | No | The response type according to the OpenID Connect Core 1.0 specification. Possible values: `id_token`, `code`, or `token`. |
| response_mode | No | The method that the identity provider uses to send the result back to Azure AD B2C. Possible values: `query`, `form_post` (default), or `fragment`. |
| scope | No | The scope of the request that is defined according to the OpenID Connect Core 1.0 specification. Such as `openid`, `profile`, and `email`. |
| HttpBinding | No | The expected HTTP binding to the access token and claims token endpoints. Possible values: `GET` or `POST`.  |
| ValidTokenIssuerPrefixes | No | A key that can be used to sign in to each of the tenants when using a multi-tenant identity provider such as Azure Active Directory. |
| UsePolicyInRedirectUri | No | Indicates whether to use a policy when constructing the redirect URI. When you configure your application in the identity provider, you need to specify the redirect URI. The redirect URI points to Azure AD B2C, `https://login.microsoftonline.com/te/{tenant}/oauth2/authresp` (login.microsoftonline.com may change with your-tenant-name.b2clogin.com).  If you specify `false`, you need to add a redirect URI for each policy you use. For example: `https://login.microsoftonline.com/te/{tenant}/{policy}/oauth2/authresp`. |
| MarkAsFailureOnStatusCode5xx | No | Indicates whether a request to an external service should be marked as a failure if the Http status code is in the 5xx range. The default is `false`. |
| DiscoverMetadataByTokenIssuer | No | Indicates whether the OIDC metadata should be discovered by using the issuer in the JWT token. |

## Cryptographic keys

The **CryptographicKeys** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| client_secret | Yes | The client secret of the identity provider application. The cryptographic key is required only if the **response_types** metadata is set to `code`. In this case, Azure AD B2C makes another call to exchange the authorization code for an access token. If the metadata is set to `id_token` you can omit the cryptographic key.  |  

## Redirect Uri
 
When you configure the redirect URI of your identity provider, enter `https://login.microsoftonline.com/te/tenant/oauth2/authresp`. Make sure to replace **tenant** with your tenant's name (for example, contosob2c.onmicrosoft.com) or the tenant's ID. The redirect URI needs to be in all lowercase.

If you are using the **b2clogin.com** domain instead of **login.microsoftonline.com** Make sure to use b2clogin.com instead of login.microsoftonline.com.

Examples:

- [Add Microsoft Account (MSA) as an identity provider using custom policies](active-directory-b2c-custom-setup-msa-idp.md)
- [Sign in by using Azure AD accounts](active-directory-b2c-setup-aad-custom.md)
- [Allow users to sign in to a multi-tenant Azure AD identity provider using custom policies](active-directory-b2c-setup-commonaad-custom.md)

 














