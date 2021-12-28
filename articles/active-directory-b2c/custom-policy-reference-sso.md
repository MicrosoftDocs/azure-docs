---
title: Single sign-on session management using custom policies
titleSuffix: Azure AD B2C
description: Learn how to manage SSO sessions using custom policies in Azure AD B2C.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 12/07/2020
ms.author: kengaderdus
ms.subservice: B2C
---

# Single sign-on session management in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

[Single sign-on (SSO) session](session-behavior.md) management uses the same semantics as any other technical profile in custom policies. When an orchestration step is executed, the technical profile associated with the step is queried for a `UseTechnicalProfileForSessionManagement` reference. If one exists, the referenced SSO session provider is then checked to see if the user is a session participant. If so, the SSO session provider is used to repopulate the session. Similarly, when the execution of an orchestration step is complete, the provider is used to store information in the session if an SSO session provider has been specified.

Azure AD B2C has defined a number of SSO session providers that can be used:

|Session provider  |Scope  |
|---------|---------|
|[NoopSSOSessionProvider](#noopssosessionprovider)     |  None       |
|[DefaultSSOSessionProvider](#defaultssosessionprovider)    | Azure AD B2C internal session manager.      |
|[ExternalLoginSSOSessionProvider](#externalloginssosessionprovider)     | Between Azure AD B2C and OAuth1, OAuth2, or OpenId Connect identity provider.        |
|[OAuthSSOSessionProvider](#oauthssosessionprovider)     | Between an OAuth2 or OpenId connect relying party application and Azure AD B2C.        |
|[SamlSSOSessionProvider](#samlssosessionprovider)     | Between Azure AD B2C and SAML identity provider. And between a SAML service provider (relying party application) and Azure AD B2C.  |

SSO management classes are specified using the `<UseTechnicalProfileForSessionManagement ReferenceId="{ID}" />` element of a technical profile.

## Input claims

The `InputClaims` element is empty or absent.

## Persisted claims

Claims that need to be returned to the application or used by preconditions in subsequent steps, should be stored in the session or augmented by a read from the user's profile in the directory. Using persisted claims ensures that your authentication journeys won't fail on missing claims. To add claims in the session, use the `<PersistedClaims>` element of the technical profile. When the provider is used to repopulate the session, the persisted claims are added to the claims bag.

## Output claims

The `<OutputClaims>` is used for retrieving claims from the session.

## Session providers

### NoopSSOSessionProvider

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile. Unlike the other SSO session providers, Noop does not allow for SSO so that the technical profile can be processed, even when the user has an active session. This provider can't persist claims and should be implemented using the code snippet below.

The use of the NoopSSOSessionProvider may not be obvious, so here are a few examples where a technical profile would benefit from using SM-Noop:

* Claims transformation provider
* Restful provider
* Self asserted attribute provider

A claims transformation provider can be used to create, or transform, claims to determine which orchestration steps to skip or to process, for example when triggering a [sub journey](subjourneys.md).

Restful providers can perform API queries that initates backend processes, for example for extended logging or for gathering claims used for authorization.

Self asserted providers can be configured to send and verify verification emails with one-time passcodes every time a [user journey](userjourneys.md) is triggered.

To use the NoopSSOSessionProvider it must be referenced like this in the technical profile: `<UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />`. If no session management technical profile is defined the DefaultSSOSessionProvider SSO behavior will apply. This is worth noting as technical profiles that are processed when the user is a session participant of the DefaultSSOSessionProvider will be subject to SSO.

The following `SM-Noop` technical profile is included in the [custom policy starter pack](tutorial-create-user-flows.md?pivots=b2c-custom-policy#custom-policy-starter-pack).

```xml
<TechnicalProfile Id="SM-Noop">
  <DisplayName>Noop Session Management Provider</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.NoopSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
</TechnicalProfile>
```

### DefaultSSOSessionProvider

This provider can be used for storing claims in a session. It is recommended to start with the claims provided in the [custom policy starter pack](tutorial-create-user-flows.md?pivots=b2c-custom-policy#custom-policy-starter-pack) and rather continue to remove or add claims as needed. Be aware that SSO will not function without the inclusion of the `objectId` claim. The `signInName` claim is also very useful. These claims must be added to the claims bag, so that the SSO session management provider will be able to repopulate them. The `objectId` claim allows applications to uniquely identity users and must be included in `id_token`. The `signInName`, often an email address, lets applications know how users identify themselves when signing in. This session provider is typically referenced in a technical profile used for managing local and federated accounts.

Technical profiles that inlucde `<UseTechnicalProfileForSessionManagement ReferenceId="SM-AAD" />` will execute as configured when the user is signing in. On subsequent executions, the user will be found to be a session participant and SSO will trigger. The SSO behavior will repopulate the claims bag and skip configured actions, as these are only executed when the user is not already signed in.

Claims persisted to the claims bag are stored in the session and can be used in subsequent [user journeys](userjourneys.md) for the lifetime of the session. Claims can be output to the session by adding `<OutputClaim ClaimTypeReferenceId="{Name}" DefaultValue="{Value}" />`, where `{Name}` must exist in the [ClaimsSchema](claimsschema.md) and `{Value}` is a static value. OutputClaim `objectIdFromSession` is often used to skip or execute orchestration steps, when the user is a session participant.

The following `SM-AAD` technical profile is included in the [custom policy starter pack](tutorial-create-user-flows.md?pivots=b2c-custom-policy#custom-policy-starter-pack).

```xml
<TechnicalProfile Id="SM-AAD">
  <DisplayName>Session Management Provider</DisplayName>
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

The following `SM-MFA` technical profile is included in the [custom policy starter pack](tutorial-create-user-flows.md?pivots=b2c-custom-policy#custom-policy-starter-pack) `SocialAndLocalAccountsWithMfa`. This technical profile manages the multi-factor authentication session. `SM-MFA` adds claims to the claims bag the same way `SM-AAD` does. By having seperate definitions for these session providers `SM-AAD` can be used in a  standard user authentication flow and `SM-MFA` when a user is required to step up. OutputClaim `isActiveMFASession` can be used as a [precondition](userjourneys.md#preconditions) for evaluating the execution of orchestration steps.

```xml
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

This provider is used to suppress the "choose identity provider" screen and sign-out from a federated identity provider. It is typically referenced in a technical profile configured for a federated identity provider, such as Facebook, or Azure Active Directory. [AlternativeSecurityId](social-transformations.md#createalternativesecurityid) is a claim generated when a user signs in with an external identity provider. The [AlternativeSecurityId](social-transformations.md#createalternativesecurityid) claim is built from the user's unique identifier with the external identity provider. One or more of these identifier claims can be added to a single account in Azure AD B2C. The following `SM-SocialLogin` technical profile is included in the [custom policy starter pack](tutorial-create-user-flows.md?pivots=b2c-custom-policy#custom-policy-starter-pack).

```xml
<TechnicalProfile Id="SM-SocialLogin">
  <DisplayName>Session Management Provider</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.ExternalLoginSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <PersistedClaims>
    <PersistedClaim ClaimTypeReferenceId="AlternativeSecurityId" />
  </PersistedClaims>
</TechnicalProfile>
```

#### Metadata

| Attribute | Required | Description|
| --- | --- | --- |
| AlwaysFetchClaimsFromProvider | No | Not currently used, can be ignored. |

### OAuthSSOSessionProvider

This provider is used for managing the Azure AD B2C sessions between a OAuth2 or OpenId Connect relying party and Azure AD B2C. Using this provider the relying party session will be closed when the user signs out from Azure AD B2C using [Single sign-out](session-behavior.md#single-sign-out). This provider does not interact with the claims bag.

```xml
<TechnicalProfile Id="SM-jwt-issuer">
  <DisplayName>Session Management Provider</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.OAuthSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
</TechnicalProfile>
```

### SamlSSOSessionProvider

This provider is used for managing the Azure AD B2C SAML sessions between a relying party application or a federated SAML identity provider. When using the SSO provider for storing a SAML identity provider session, the `RegisterServiceProviders` must be set to `false`. The following `SM-Saml-idp` technical profile is used by the [SAML identity provider](identity-provider-generic-saml.md).

```xml
<TechnicalProfile Id="SM-Saml-idp">
  <DisplayName>Session Management Provider</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.SamlSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="RegisterServiceProviders">false</Item>
  </Metadata>
</TechnicalProfile>
```

When using the provider for storing the B2C SAML session, the `RegisterServiceProviders` must set to `true`. SAML session logout requires the `SessionIndex` and `NameID` to complete.

The following `SM-Saml-issuer` technical profile is used by [SAML issuer technical profile](saml-service-provider.md)

```xml
<TechnicalProfile Id="SM-Saml-issuer">
  <DisplayName>Session Management Provider</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.SamlSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"/>
</TechnicalProfile>
```

#### Metadata

| Attribute | Required | Description|
| --- | --- | --- |
| IncludeSessionIndex | No | Not currently used, can be ignored.|
| RegisterServiceProviders | No | Indicates that the provider should register all SAML service providers that have been issued an assertion. Possible values: `true` (default), or `false`.|

## Next steps

Learn how to [configure session behavior](session-behavior.md).
