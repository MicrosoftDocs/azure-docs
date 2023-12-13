---
title: Define an OAuth1 technical profile in a custom policy
titleSuffix: Azure AD B2C
description: Define an OAuth 1.0 technical profile in a custom policy in Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 09/10/2018
ms.author: kengaderdus
ms.subservice: B2C
---

# Define an OAuth1 technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure Active Directory B2C (Azure AD B2C) provides support for the [OAuth 1.0 protocol](https://tools.ietf.org/html/rfc5849) identity provider. This article describes the specifics of a technical profile for interacting with a claims provider that supports this standardized protocol. With an OAuth1 technical profile, you can federate with an OAuth1 based identity provider, such as Twitter. Federating with the identity provider allows users to sign in with their existing social or enterprise identities.

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `OAuth1`. For example, the protocol for the **Twitter-OAUTH1** technical profile is `OAuth1`.

```xml
<TechnicalProfile Id="Twitter-OAUTH1">
  <DisplayName>Twitter</DisplayName>
  <Protocol Name="OAuth1" />
  ...
```

## Input claims

The **InputClaims** and **InputClaimsTransformations**  elements are empty or absent.

## Output claims

The **OutputClaims** element contains a list of claims returned by the OAuth1 identity provider. You may need to map the name of the claim defined in your policy to the name defined in the identity provider. You can also include claims that aren't returned by the identity provider as long as you set the **DefaultValue** attribute.

The **OutputClaimsTransformations** element may contain a collection of **OutputClaimsTransformation** elements that are used to modify the output claims or generate new ones.

The following example shows the claims returned by the Twitter identity provider:

- The **user_id** claim that is mapped to the **issuerUserId** claim.
- The **screen_name** claim that is mapped to the **displayName** claim.
- The **email** claim without name mapping.

The technical profile also returns claims that aren't returned by the identity provider:

- The **identityProvider** claim that contains the name of the identity provider.
- The **authenticationSource** claim with a default value of `socialIdpAuthentication`.

```xml
<OutputClaims>
  <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="user_id" />
  <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="screen_name" />
  <OutputClaim ClaimTypeReferenceId="email" />
  <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="twitter.com" />
  <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" />
</OutputClaims>
```

## Metadata

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| client_id | Yes | The application identifier of the identity provider. |
| ProviderName | No | The name of the identity provider. |
| request_token_endpoint | Yes | The URL of the request token endpoint as per RFC 5849. |
| authorization_endpoint | Yes | The URL of the authorization endpoint as per RFC 5849. |
| access_token_endpoint | Yes | The URL of the token endpoint as per RFC 5849. |
| ClaimsEndpoint | No | The URL of the user information endpoint. |
| ClaimsResponseFormat | No | The claims response format.|

## Cryptographic keys

The **CryptographicKeys** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| client_secret | Yes | The client secret of the identity provider application.   |

## Redirect URI

When you configure the redirect URI of your identity provider, enter `https://{tenant-name}.b2clogin.com/{tenant-name}.onmicrosoft.com/{policy-id}/oauth1/authresp`. Make sure to replace `{tenant-name}` with your tenant's name (for example, contosob2c) and `{policy-id}` with the identifier of your policy (for example, b2c_1a_policy). The redirect URI needs to be in all lowercase. Add a redirect URL for all policies that use the identity provider login.

Examples:

- [Add Twitter as an OAuth1 identity provider by using custom policies](identity-provider-twitter.md)
