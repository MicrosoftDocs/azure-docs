---
title: Configure session behavior using custom policies - Azure Active Directory B2C | Microsoft Docs
description: Configure session behavior using custom policies in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 05/07/2020
ms.author: mimart
ms.subservice: B2C
---

# Configure session behavior using custom policies in Azure Active Directory B2C

[Single sign-on (SSO) session](session-overview.md) management in Azure Active Directory B2C (Azure AD B2C) enables an administrator to control interaction with a user after the user has already authenticated. For example, the administrator can control whether the selection of identity providers is displayed, or whether account details need to be entered again. This article describes how to configure the SSO settings for Azure AD B2C.

## Session behavior properties

You can use the following properties to manage web application sessions:

- **Web app session lifetime (minutes)** - The lifetime of Azure AD B2C's session cookie stored on the user's browser upon successful authentication.
    - Default =  86400 seconds (1440 minutes).
    - Minimum (inclusive) = 900  seconds (15 minutes).
    - Maximum (inclusive) = 86400 seconds (1440 minutes).
- **Web app session timeout** - The [session expiry type](session-overview.md#session-expiry-type), *Rolling*, or *Absolute*. 
- **Single sign-on configuration** - The [session scope](session-overview.md#session-scope) of the single sign-on (SSO) behavior across multiple apps and user flows in your Azure AD B2C tenant. 

## Configure the properties

To change your session behavior and SSO configurations, you add a **UserJourneyBehaviors** element inside of the [RelyingParty](relyingparty.md) element.  The **UserJourneyBehaviors** element must immediately follow the **DefaultUserJourney**. Your **UserJourneyBehavors** element should look like this example:

```xml
<UserJourneyBehaviors>
   <SingleSignOn Scope="Application" />
   <SessionExpiryType>Absolute</SessionExpiryType>
   <SessionExpiryInSeconds>86400</SessionExpiryInSeconds>
</UserJourneyBehaviors>
```

## Single sign-out

### Configure the applications

When you redirect the user to the Azure AD B2C sign-out endpoint (for both OAuth2 and SAML protocols), Azure AD B2C clears the user's session from the browser.  To allow [Single sign-out](session-overview.md#single-sign-out), set the `LogoutUrl` of the application from the Azure portal:

1. Navigate to the [Azure portal](https://portal.azure.com).
1. Choose your Azure AD B2C directory by clicking your account in the top right corner of the page.
1. In the left menu, choose **Azure AD B2C**, select **App registrations**, and then select your application.
1. Select **Settings**, select **Properties**, and then find the **Logout URL** text box. 

### Configure the token issuer 

To support single sign-out, the token issuer technical profiles for both JWT and SAML must specify:

- The protocol name, such as `<Protocol Name="OpenIdConnect" />`
- The reference  to the session technical profile, such as `UseTechnicalProfileForSessionManagement ReferenceId="SM-OAuth-issuer" />`.

The following example illustrates the JWT and SAML token issuers with single sign-out:

```xml
<ClaimsProvider>
  <DisplayName>Local Account SignIn</DisplayName>
  <TechnicalProfiles>
    <!-- JWT Token Issuer -->
    <TechnicalProfile Id="JwtIssuer">
      <DisplayName>JWT token Issuer</DisplayName>
      <Protocol Name="OpenIdConnect" />
      <OutputTokenFormat>JWT</OutputTokenFormat>
      ...    
      <UseTechnicalProfileForSessionManagement ReferenceId="SM-OAuth-issuer" />
    </TechnicalProfile>

    <!-- Session management technical profile for OIDC based tokens -->
    <TechnicalProfile Id="SM-OAuth-issuer">
      <DisplayName>Session Management Provider</DisplayName>
      <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.OAuthSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
    </TechnicalProfile>

    <!--SAML token issuer-->
    <TechnicalProfile Id="Saml2AssertionIssuer">
      <DisplayName>SAML token issuer</DisplayName>
      <Protocol Name="SAML2" />
      <OutputTokenFormat>SAML2</OutputTokenFormat>
      ...
      <UseTechnicalProfileForSessionManagement ReferenceId="SM-Saml-issuer" />
    </TechnicalProfile>

    <!-- Session management technical profile for SAML based tokens -->
    <TechnicalProfile Id="SM-Saml-issuer">
      <DisplayName>Session Management Provider</DisplayName>
      <Protocol Name="Proprietary" Handler="Web.TPEngine.SSO.SamlSSOSessionProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

## Next steps

- Learn more about [Azure AD B2C session](session-overview.md).
