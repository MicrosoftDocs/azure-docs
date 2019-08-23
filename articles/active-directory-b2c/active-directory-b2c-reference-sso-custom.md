---
title: Single sign-on session management using custom policies in Azure Active Directory B2C | Microsoft Docs
description: Learn how to manage SSO sessions using custom policies in Azure AD B2C.
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

# Single sign-on session management in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Single sign-on (SSO) session management in Azure Active Directory (Azure AD) B2C enables an administrator to control interaction with a user after the user has already authenticated. For example, the administrator can control whether the selection of identity providers is displayed, or whether local account details need to be entered again. This article describes how to configure the SSO settings for Azure AD B2C.

SSO session management has two parts. The first deals with the user's interactions directly with Azure AD B2C and the other deals with the user's interactions with external parties such as Facebook. Azure AD B2C does not override or bypass SSO sessions that might be held by external parties. Rather the route through Azure AD B2C to get to the external party is “remembered”, avoiding the need to reprompt the user to select their social or enterprise identity provider. The ultimate SSO decision remains with the external party.

SSO session management uses the same semantics as any other technical profile in custom policies. When an orchestration step is executed, the technical profile associated with the step is queried for a `UseTechnicalProfileForSessionManagement` reference. If one exists, the referenced SSO session provider is then checked to see if the user is a session participant. If so, the SSO session provider is used to repopulate the session. Similarly, when the execution of an orchestration step is complete, the provider is used to store information in the session if an SSO session provider has been specified.

Azure AD B2C has defined a number of SSO session providers that can be used:

* NoopSSOSessionProvider
* DefaultSSOSessionProvider
* ExternalLoginSSOSessionProvider
* SamlSSOSessionProvider

SSO management classes are specified using the `<UseTechnicalProfileForSessionManagement ReferenceId=“{ID}" />` element of a technical profile.

## NoopSSOSessionProvider

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

## DefaultSSOSessionProvider

This provider can be used for storing claims in a session. This provider is typically referenced in a technical profile used for managing local accounts. When using the DefaultSSOSessionProvider to store claims in a session, you need to ensure that any claims that need to be returned to the application or used by pre-conditions in subsequent steps, are stored in the session or augmented by a read from the users profile in directory. This will ensure that your authentication journey’s will not fail on missing claims.

```XML
<TechnicalProfile Id="SM-AAD">
    <DisplayName>Session Mananagement Provider</DisplayName>
    <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.DefaultSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
    <PersistedClaims>
        <PersistedClaim ClaimTypeReferenceId="objectId" />
        <PersistedClaim ClaimTypeReferenceId="newUser" />
        <PersistedClaim ClaimTypeReferenceId="executed-SelfAsserted-Input" />
    </PersistedClaims>
    <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="objectIdFromSession" DefaultValue="true" />
    </OutputClaims>
</TechnicalProfile>
```

To add claims in the session, use the `<PersistedClaims>` element of the technical profile. When the provider is used to repopulate the session, the persisted claims are added to the claims bag. `<OutputClaims>` is used for retrieving claims from the session.

## ExternalLoginSSOSessionProvider

This provider is used to suppress the “choose identity provider” screen. It is typically referenced in a technical profile configured for an external identity provider, such as Facebook. 

```XML
<TechnicalProfile Id="SM-SocialLogin">
    <DisplayName>Session Mananagement Provider</DisplayName>
    <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.ExternalLoginSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
</TechnicalProfile>
```

## SamlSSOSessionProvider

This provider is used for managing the Azure AD B2C SAML sessions between apps as well as external SAML identity providers.

```XML
<TechnicalProfile Id="SM-Reflector-SAML">
	<DisplayName>Session Management Provider</DisplayName>
	<Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.SamlSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
	<Metadata>
		<Item Key="IncludeSessionIndex">false</Item>
		<Item Key="RegisterServiceProviders">false</Item>
	</Metadata>
</TechnicalProfile>
```

There are two metadata items in the technical profile:

| Item | Default Value | Possible Values | Description
| --- | --- | --- | --- |
| IncludeSessionIndex | true | true/false | Indicates to the provider that the session index should be stored. |
| RegisterServiceProviders | true | true/false | Indicates that the provider should register all SAML service providers that have been issued an assertion. |

When using the provider for storing a SAML identity provider session, the items above should both be false. When using the provider for storing the B2C SAML session, the items above should be true or omitted as the defaults are true. SAML session logout requires the `SessionIndex` and `NameID` to complete.

