---
title: 'SSO session management using custom policies - Azure AD B2C | Microsoft Docs'
description: Learn how to manage SSO sessions using custom policies in Azure AD B2C.
services: active-directory-b2c
documentationcenter: ''
author: parakhj
manager: krassk
editor: parakhj

ms.assetid: 809f6000-2e52-43e4-995d-089d85747e1f
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/20/2017
ms.author: parja

---
# Azure AD B2C: Single sign-on (SSO) session management

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure AD B2C allows an administrator to control how Azure AD B2C interacts with a user after the user has already authenticated. This is done through SSO session management. For example, the administrator can control whether the selection of identity providers is displayed, or whether local account details need to be entered again. This article describes how to configure the SSO settings for Azure AD B2C.

## Overview

SSO session management has two parts. The first deals with the user's interactions directly with Azure AD B2C and the other deals with the user's interactions with external parties such as Facebook. Azure AD B2C does not override or bypass SSO sessions that might be held by external parties. Rather the route through Azure AD B2C to get to the external party is “remembered”, avoiding the need to reprompt the user to select their social or enterprise identity provider. The ultimate SSO decision remains with the external party.

## How does it work?

SSO session management uses the same semantics as any other technical profile in custom policies. When an orchestration step is executed, the technical profile associated with the step is queried for a `UseTechnicalProfileForSessionManagement` reference. If one exists, the referenced SSO session provider is then checked to see if the user is a session participant. If so the SSO session provider is used to repopulate the session. Similarly, when the execution of an orchestration step is complete, the provider is used to store information in the session if an SSO session provider has been specified.

Azure AD B2C has defined a number of SSO session providers that can be used:

* NoopSSOSessionProvider
* DefaultSSOSessionProvider
* ExternalLoginSSOSessionProvider
* SamlSSOSessionProvider

SSO management classes are specified using the `<UseTechnicalProfileForSessionManagement ReferenceId=“{ID}" />` element of a technical profile.

### NoopSSOSessionProvider

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

### DefaultSSOSessionProvider

This provider can be used for storing claims in a session. This provider is typically referenced in a technical profile used for managing local accounts. 

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

### ExternalLoginSSOSessionProvider

This provider is used to suppress the “choose identity provider” screen. It is typically referenced in a technical profile configured for an external identity provider, such as Facebook. 

```XML
<TechnicalProfile Id="SM-SocialLogin">
    <DisplayName>Session Mananagement Provider</DisplayName>
    <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.ExternalLoginSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
</TechnicalProfile>
```

### SamlSSOSessionProvider

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

When using the provider for storing a SAML identity provider session, the items above should both be false. When using the provider for storing the B2C SAML session, the items above should be true or omitted as the defaults are true.

>[!NOTE]
> SAML session logout requires the `SessionIndex` and `NameID` to complete.

## Next steps

We love feedback and suggestions! If you have any difficulties with this topic, post on Stack Overflow using the tag ['azure-ad-b2c'](https://stackoverflow.com/questions/tagged/azure-ad-b2c). For feature requests, vote for them in our [feedback forum](https://feedback.azure.com/forums/169401-azure-active-directory/category/160596-b2c).

