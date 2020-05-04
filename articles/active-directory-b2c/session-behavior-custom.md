---
title: Configure session behavior using custom policies - Azure Active Directory B2C | Microsoft Docs
description: Configure session behavior using custom policies in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 05/04/2020
ms.author: mimart
ms.subservice: B2C
---

# Configure session behavior using custom policies in Azure Active Directory B2C

[Single sign-on (SSO) session](session-overview.md) management in Azure Active Directory B2C (Azure AD B2C) enables an administrator to control interaction with a user after the user has already authenticated. For example, the administrator can control whether the selection of identity providers is displayed, or whether account details need to be entered again. This article describes how to configure the SSO settings for Azure AD B2C.

## Session behavior properties

You can use the following properties to manage web application sessions:

- **Web app session lifetime (minutes)** - The lifetime of Azure AD B2C's session cookie stored on the user's browser upon successful authentication.
    - Default = 1440 minutes.
    - Minimum (inclusive) = 15 minutes.
    - Maximum (inclusive) = 1440 minutes.
- **Web app session timeout** - The [session expiry type](session-overview.md#session-expiry-type), *Rolling*, or *Absolute*. 
- **Single sign-on configuration** - The [session scope](session-overview.md#session-scope) of the single sign-on (SSO) behavior across multiple apps and user flows in your Azure AD B2C tenant. 


## Configure the properties

To change your session behavior and SSO configurations, you add a **UserJourneyBehaviors** element inside of the [RelyingParty](relyingparty.md) element.  The **UserJourneyBehaviors** element must immediately follow the **DefaultUserJourney**. The inside of your **UserJourneyBehavors** element should look like this example:

```XML
<UserJourneyBehaviors>
   <SingleSignOn Scope="Application" />
   <SessionExpiryType>Absolute</SessionExpiryType>
   <SessionExpiryInSeconds>86400</SessionExpiryInSeconds>
</UserJourneyBehaviors>
```

The following values are configured in the previous example:

- **Single sign on (SSO)** - Single sign-on is configured with the [SingleSignOn](relyingparty.md#singlesignon). The applicable values are `Tenant`, `Application`, `Policy`, and `Suppressed`. For more information, see [session scope](session-overview.md#session-scope).
- **Web app session time-out** - The web app session timeout is set with the **SessionExpiryType** element. The applicable values are `Absolute` and `Rolling`. For more information, see [session expiry type](session-overview.md#session-expiry-type).
- **Web app session lifetime** - The web app session lifetime is set with the **SessionExpiryInSeconds** element. The default value is 86400 seconds (1440 minutes).

## Configure the single sign-out

When you redirect the user to the Azure AD B2C sign-out endpoint (for both OAuth2 and SAML protocols), Azure AD B2C clears the user's session from the browser.  To allow [Single sign-out](session-overview.d#single-sign-out), set the `LogoutUrl` of the application from the Azure portal:

1. Navigate to the [Azure portal](https://portal.azure.com).
1. Choose your Active B2C directory by clicking your account in the top right corner of the page.
1. From the left hand navigation panel, choose **Azure AD B2C**, select **App registrations**, and then select your application.
1. Select **Settings**, select **Properties**, and then find the **Logout URL** text box. 

## Next steps

- Learn more about [Azure AD B2C session](session-overview.md).