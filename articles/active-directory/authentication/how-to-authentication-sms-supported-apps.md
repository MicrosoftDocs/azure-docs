---
title: App support for SMS-based authentication in Microsoft Entra ID
description: Learn which apps are supported for users to sign in to Microsoft Entra ID using SMS

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 03/16/2023
ms.author: justinha
author: aanjusingh
manager: amycolannino
ms.reviewer: anjusingh

ms.collection: M365-identity-device-management
---

# App support for SMS-based authentication

SMS-based authentication is available to Microsoft apps integrated with the Microsoft identity platform (Microsoft Entra ID). The table lists some of the web and mobile apps that support SMS-based authentication. If you would like to add or validate any app, [contact us](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789). 

| App | Web/browser app | Native mobile app |
| --- |:---:|:---:|
| Office 365- Microsoft Online Services* | ● |   |
| Microsoft One Note | ● |   |
| Microsoft Teams | ● | ● |
| Company portal | ● | ● |
| My Apps portal | ● |Not available|
| Microsoft Forms | ● |Not available|
| Microsoft Edge | ● |   |
| Microsoft Power BI | ● |   |
| Microsoft Stream | ● |   |
| Microsoft Power Apps | ● |   |
| Microsoft Azure | ● | ● |
| Azure Virtual Desktop | ● |  | 

*_SMS sign-in isn't available for office applications, such as Word, Excel, etc., when accessed directly on the web, but is available when accessed through the [Office 365 web app](https://www.office.com)_

The above mentioned Microsoft apps support SMS sign-in is because they use the Microsoft Identity login (`https://login.microsoftonline.com/`), which allows users to enter phone number and SMS code.

## Unsupported Microsoft apps

Microsoft 365 desktop (Windows or Mac) apps and Microsoft 365 web apps (except MS One Note) that are accessed directly on the web don't support SMS sign-in. These apps use the Microsoft Office login (`https://office.live.com/start/*`) that requires a password to sign in.
For the same reason, Microsoft Office mobile apps (except Microsoft Teams, Company portal, and Microsoft Azure) don't support SMS sign-in.

| Unsupported Microsoft apps| Examples |
| --- | --- |
| Native desktop Microsoft apps | Microsoft Teams, O365 apps, Word, Excel, etc.|
| Native mobile Microsoft apps (except Microsoft Teams, Company portal, and Microsoft Azure) | Outlook, Edge, Power BI, Stream, SharePoint, Power Apps, Word, etc.|
| Microsoft 365 web apps (accessed directly on web) | [Outlook](https://outlook.live.com/owa/), [Word](https://office.live.com/start/Word.aspx), [Excel](https://office.live.com/start/Excel.aspx), [PowerPoint](https://office.live.com/start/PowerPoint.aspx)|  

## Support for Non-Microsoft apps 

To make Non-Micorosoft apps compatible with the SMS sign-in feature: 
- Integrate Non-Microsoft web apps with Microsoft Entra ID and use Microsoft Entra authentication. Use Security Assertion Markup Language [SAML](../manage-apps/add-application-portal-setup-sso.md) or OpenID Connect [OIDC](../manage-apps/add-application-portal-setup-oidc-sso.md) to integrate with Microsoft Entra SSO. 
- Integrate Non-Microsoft on-prem apps with Microsoft Entra ID using [Microsoft Entra application proxy](../app-proxy/application-proxy-add-on-premises-application.md)
- Integrate Non-Microsoft client apps with [Microsoft identity platform](../develop/v2-overview.md) for authentication 
    - [Sample app iOS](../develop/tutorial-v2-ios.md)
    - [Sample app Android](../develop/tutorial-v2-android.md)

## Next steps

- [How to enable SMS-based sign-in for users](howto-authentication-sms-signin.md)
- See the following links to enable SMS sign-in for native mobile apps using MSAL Libraries: 
  - [iOS](https://github.com/AzureAD/microsoft-authentication-library-for-objc)
  - [Android](https://github.com/AzureAD/microsoft-authentication-library-for-android)
- [Integrate SAAS application with Microsoft Entra ID](../saas-apps/tutorial-list.md)

## Recommended content

- [Add an application to your Microsoft Entra ID](../manage-apps/add-application-portal.md)
- [Overview of MSAL libraries to acquire token from Microsoft identity platform to authenticate users](../develop/msal-overview.md)
- [Configure Microsoft Managed Home Screen with Microsoft Entra ID](/mem/intune/apps/app-configuration-managed-home-screen-app)
