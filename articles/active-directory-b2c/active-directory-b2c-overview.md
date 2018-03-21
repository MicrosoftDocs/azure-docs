---
title: Azure Active Directory B2C overview
description: Get started developing consumer-facing applications with Azure Active Directory B2C
services: active-directory-b2c
documentationcenter: ''
author: davidmu1
manager: mtillman
ms.author: saeeda

ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 2/27/2018
ms.reviewer: parakhj
ms.custom: mvc

---
# What is Azure Active Directory B2C?

Azure AD B2C is a cloud identity management solution for your web and mobile applications. It is a highly available global service that scales to hundreds of millions of identities. Built on an enterprise-grade secure platform, Azure AD B2C keeps your applications, your business, and your customers protected.

With minimal configuration, Azure AD B2C enables your application to authenticate:

* **Social Accounts** (such as Facebook, Google, LinkedIn, and more)
* **Enterprise Accounts** (using open standard protocols, OpenID Connect or SAML)
* **Local Accounts** (email address and password, or username and password)

## Get started

Try Azure Active Directory B2C functionality in a quickstart:

* [ASP.NET web app](active-directory-b2c-quickstarts-web-app.md)
* [Node.js single-page app](active-directory-b2c-quickstarts-spa.md)
* [.NET Windows Presentation Foundation desktop app](active-directory-b2c-quickstarts-desktop-app.md)

Try authenticating users with Azure AD B2C in a step-by-step tutorial:

* [ASP.NET web app](active-directory-b2c-tutorials-web-app.md)
* [Single page application](active-directory-b2c-tutorials-spa.md)
* [.NET Windows Presentation Foundation desktop app](active-directory-b2c-tutorials-desktop-app.md)

Try protecting a web API with Azure AD B2C in a step-by-step tutorial:

* [ASP.NET web API](active-directory-b2c-tutorials-web-api.md)
* [ASP.NET Core web API](active-directory-b2c-tutorials-spa-webapi.md)
* [Node.js web API](active-directory-b2c-tutorials-desktop-app-webapi.md)

Browse a code sample:

|  |  |  |  |
| --- | --- | --- | --- |
| <center>![Mobile & Desktop Apps](../active-directory/develop/media/active-directory-developers-guide/NativeApp_Icon.png)<br />Mobile & Desktop Apps</center> | [Overview](active-directory-b2c-reference-oauth-code.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br /><br />[iOS](https://github.com/Azure-Samples/active-directory-b2c-ios-swift-native-msal)<br /><br />[Android](https://github.com/Azure-Samples/active-directory-b2c-android-native-msal) | [.NET](https://github.com/Azure-Samples/active-directory-b2c-dotnet-desktop)<br /><br />[Xamarin](https://github.com/Azure-Samples/active-directory-b2c-xamarin-native) |  |
| <center>![Web Apps](../active-directory/develop/media/active-directory-developers-guide/Web_app.png)<br />Web Apps</center> | [Overview](active-directory-b2c-reference-oidc.md)<br /><br />[ASP.NET](active-directory-b2c-devquickstarts-web-dotnet-susi.md)<br /><br />[ASP.NET Core](https://github.com/Azure-Samples/active-directory-b2c-dotnetcore-webapp) | [Node.js](active-directory-b2c-devquickstarts-web-node.md) |  |
| <center>![Single Page Apps](../active-directory/develop/media/active-directory-developers-guide/SPA.png)<br />Single Page Apps</center> | [Overview](active-directory-b2c-reference-spa.md)<br /><br />[JavaScript](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp)<br /><br /> |  |  |
| <center>![Web APIs](../active-directory/develop/media/active-directory-developers-guide/Web_API.png)<br />Web APIs</center> | [ASP.NET](active-directory-b2c-devquickstarts-api-dotnet.md)<br /><br /> [ASP.NET Core](https://github.com/Azure-Samples/active-directory-b2c-dotnetcore-webapi)<br /><br /> [Node.js](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi) | [Call a .NET Web API](active-directory-b2c-devquickstarts-web-api-dotnet.md) |

## What's new

Check back here often to learn about future changes to the Azure Active Directory B2C. We also tweet about any updates by using @AzureAD.

* In addition to "Built-in Policies" (General Availability), the ["Custom Policies"](active-directory-b2c-overview-custom.md) feature is now available in public preview.  Custom policies are for identity pros that need control over the composition of their identity experience.
* The [Access Token](https://azure.microsoft.com/en-us/blog/azure-ad-b2c-access-tokens-now-in-public-preview) feature is now available in public preview.
* [General Availability of Europe-based Azure AD B2C](https://azure.microsoft.com/en-us/blog/azuread-b2c-ga-eu/) directories has been announced.
* Check out our growing library of [code samples on Github](https://github.com/Azure-Samples?q=b2c)!

## How-to articles

Learn how to use specific Azure Active Directory B2C features:

* Configure [Facebook](active-directory-b2c-setup-fb-app.md), [Google+](active-directory-b2c-setup-goog-app.md), [Microsoft account](active-directory-b2c-setup-msa-app.md), [Amazon](active-directory-b2c-setup-amzn-app.md), and [LinkedIn](active-directory-b2c-setup-li-app.md) accounts for use in your consumer-facing applications.
* [Use custom attributes to collect information about your consumers](active-directory-b2c-reference-custom-attr.md).
* [Enable Azure Multi-Factor Authentication in your consumer-facing applications](active-directory-b2c-reference-mfa.md).
* [Set up self-service password reset for your consumers](active-directory-b2c-reference-sspr.md).
* [Customize the look and feel of sign-up, sign in, and other consumer-facing pages](active-directory-b2c-reference-ui-customization.md) that are served by Azure Active Directory B2C.
* [Use the Azure Active Directory Graph API to programmatically create, read, update, and delete consumers](active-directory-b2c-devquickstarts-graph-dotnet.md) in your Azure Active Directory B2C tenant.

## Support and feedback

* [Azure Active Directory B2C FAQs](active-directory-b2c-faqs.md).
* Give us your thoughts by using [User Voice](https://feedback.azure.com/forums/169401-azure-active-directory/category/160596-b2c), we want to hear them!
* [File support requests for Azure Active Directory B2C](active-directory-b2c-support.md).
* Get help on Stack Overflow by using the [azure-ad-b2c](http://stackoverflow.com/questions/tagged/azure-ad-b2c) tag.

We encourage you to get notifications of when security incidents occur by visiting [this page](https://technet.microsoft.com/security/dd252948) and subscribing to Security Advisory Alerts.

## Next steps

Try Azure Active Directory B2C functionality with one of our quickstarts:

* [ASP.NET web app](active-directory-b2c-quickstarts-web-app.md)
* [Node.js single-page app](active-directory-b2c-quickstarts-spa.md)
* [.NET Windows Presentation Foundation desktop app](active-directory-b2c-quickstarts-desktop-app.md)
