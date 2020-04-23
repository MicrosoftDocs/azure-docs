---
title: Single sign-on session management using custom policies
titleSuffix: Azure AD B2C
description: Learn how to manage SSO sessions using custom policies in Azure AD B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 03/09/2020
ms.author: mimart
ms.subservice: B2C
---

# Single sign-on session management in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Single sign-on (SSO) session management in Azure Active Directory B2C (Azure AD B2C) enables an administrator to control interaction with a user after the user has already authenticated. For example, the administrator can control whether the selection of identity providers is displayed, or whether local account details need to be entered again. This article describes how to configure the SSO settings for Azure AD B2C.

SSO session management has two parts. The first deals with the user's interactions directly with Azure AD B2C and the other deals with the user's interactions with external parties such as Facebook. Azure AD B2C does not override or bypass SSO sessions that might be held by external parties. Rather the route through Azure AD B2C to get to the external party is "remembered", avoiding the need to reprompt the user to select their social or enterprise identity provider. The ultimate SSO decision remains with the external party.

SSO session management uses the same semantics as any other technical profile in custom policies. When an orchestration step is executed, the technical profile associated with the step is queried for a `UseTechnicalProfileForSessionManagement` reference. If one exists, the referenced SSO session provider is then checked to see if the user is a session participant. If so, the SSO session provider is used to repopulate the session. Similarly, when the execution of an orchestration step is complete, the provider is used to store information in the session if an SSO session provider has been specified.

Azure AD B2C has defined a number of SSO session providers that can be used:

* NoopSSOSessionProvider
* DefaultSSOSessionProvider
* ExternalLoginSSOSessionProvider
* SamlSSOSessionProvider

SSO management classes are specified using the `<UseTechnicalProfileForSessionManagement ReferenceId="{ID}" />` element of a technical profile.

## Input claims

The `InputClaims` element is empty or absent.

## Persisted claims

Claims that need to be returned to the application or used by preconditions in subsequent steps, should be stored in the session or augmented by a read from the user's profile in the directory. Using persisted claims ensures that your authentication journeys won't fail on missing claims. To add claims in the session, use the `<PersistedClaims>` element of the technical profile. When the provider is used to repopulate the session, the persisted claims are added to the claims bag.

## Output claims

The `<OutputClaims>` is used for retrieving claims from the session.

## Session providers

### NoopSSOSessionProvider

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile. The following `SM-Noop` technical profile is included in the [custom policy starter pack](custom-policy-get-started.md#custom-policy-starter-pack).

```XML
<TechnicalProfile Id="SM-Noop">
  <DisplayName>Noop Session Management Provider</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.NoopSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
</TechnicalProfile>
```

### DefaultSSOSessionProvider

This provider can be used for storing claims in a session. This provider is typically referenced in a technical profile used for managing local accounts. The following `SM-AAD` technical profile is included in the [custom policy starter pack](custom-policy-get-started.md#custom-policy-starter-pack).

```XML
<TechnicalProfile Id="SM-AAD">
  <DisplayName>Session Mananagement Provider</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.DefaultSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <PersistedClaims>
    <PersistedClaim ClaimTypeReferenceId="objectId" />
    <PersistedClaim ClaimTypeReferenceId="signInName" />
    <PersistedClaim ClaimTypeReferenceId="authenticationSource" />
    <PersistedClaim ClaimTypeReferenceId="identityProvider" />
    <PersistedClaim ClaimTypeReferenceId="newUser" />
    <PersistedClaim ClaimTypeReferenceId="executed-SelfAsserted-Input" />
  </PersistedClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="objectIdFromSession" DefaultValue="true"/>
  </OutputClaims>
</TechnicalProfile>
```

The following `SM-MFA` technical profile is included in the [custom policy starter pack](custom-policy-get-started.md#custom-policy-starter-pack) `SocialAndLocalAccountsWithMfa`. This technical profile manages the multi-factor authentication session.

```XML
<TechnicalProfile Id="SM-MFA">
  <DisplayName>Session Mananagement Provider</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.DefaultSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <PersistedClaims>
    <PersistedClaim ClaimTypeReferenceId="Verified.strongAuthenticationPhoneNumber" />
  </PersistedClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="isActiveMFASession" DefaultValue="true"/>
  </OutputClaims>
</TechnicalProfile>
```

### ExternalLoginSSOSessionProvider

This provider is used to suppress the "choose identity provider" screen. It is typically referenced in a technical profile configured for an external identity provider, such as Facebook. The following `SM-SocialLogin` technical profile is included in the [custom policy starter pack](custom-policy-get-started.md#custom-policy-starter-pack).

```XML
<TechnicalProfile Id="SM-SocialLogin">
  <DisplayName>Session Mananagement Provider</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.ExternalLoginSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="AlwaysFetchClaimsFromProvider">true</Item>
  </Metadata>
  <PersistedClaims>
    <PersistedClaim ClaimTypeReferenceId="AlternativeSecurityId" />
  </PersistedClaims>
</TechnicalProfile>
```

#### Metadata

| Attribute | Required | Description|
| --- | --- | --- |
| AlwaysFetchClaimsFromProvider | No | Not currently used, can be ignored. |

### SamlSSOSessionProvider

This provider is used for managing the Azure AD B2C SAML sessions between a relying party application or a federated SAML identity provider. When using the SSO provider for storing a SAML identity provider session, the `RegisterServiceProviders` must be set to `false`. The following `SM-Saml-idp` technical profile is used by the [SAML technical  profile](saml-technical-profile.md).

```XML
<TechnicalProfile Id="SM-Saml-idp">
  <DisplayName>Session Management Provider</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.SamlSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="RegisterServiceProviders">false</Item>
  </Metadata>
</TechnicalProfile>
```

When using the provider for storing the B2C SAML session, the `RegisterServiceProviders` must set to `true`. SAML session logout requires the `SessionIndex` and `NameID` to complete.

The following `SM-Saml-idp` technical profile is used by [SAML issuer technical profile](saml-issuer-technical-profile.md)

```XML
<TechnicalProfile Id="SM-Saml-sp">
  <DisplayName>Session Management Provider</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.SamlSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"/>
</TechnicalProfile>
```
#### Metadata

| Attribute | Required | Description|
| --- | --- | --- |
| IncludeSessionIndex | No | Not currently used, can be ignored.|
| RegisterServiceProviders | No | Indicates that the provider should register all SAML service providers that have been issued an assertion. Possible values: `true` (default), or `false`.|



