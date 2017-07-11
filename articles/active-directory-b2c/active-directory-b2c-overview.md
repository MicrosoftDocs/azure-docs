---
title: 'Azure Active Directory B2C: Overview | Microsoft Docs'
description: Developing consumer-facing applications with Azure Active Directory B2C
services: active-directory-b2c
documentationcenter: ''
author: saeeda
manager: krassk
editor: parja

ms.assetid: c465dbde-f800-4f2e-8814-0ff5f5dae610
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 12/06/2016
ms.author: saeeda

---
# Azure AD B2C: Focus on your app, let us worry about sign-up and sign-in

Azure AD B2C is a cloud identity management solution for your web and mobile applications. It is a highly available global service that scales to hundreds of millions of identities. Built on an enterprise-grade secure platform, Azure AD B2C keeps your applications, your business, and your customers protected.

With minimal configuration, Azure AD B2C enables your application to authenticate:

* **Social Accounts** (such as Facebook, Google, LinkedIn, and more)
* **Enterprise Accounts** (using open standard protocols, OpenID Connect or SAML)
* **Local Accounts** (email address and password, or username and password)

## Get started

First, get your own tenant by using the steps outlined in [Create an Azure AD B2C tenant](active-directory-b2c-get-started.md).

Then choose your application development scenario:

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

## Next steps

These links are useful for exploring the service in depth:

* See the [Azure Active Directory B2C pricing information](https://azure.microsoft.com/pricing/details/active-directory-b2c/).
* Review our [code samples](https://azure.microsoft.com/en-us/resources/samples/?service=active-directory&term=b2c) for Azure Active Directory B2C. 
* Get help on Stack Overflow by using the [azure-ad-b2c](http://stackoverflow.com/questions/tagged/azure-ad-b2c) tag.
* Give us your thoughts by using [User Voice](https://feedback.azure.com/forums/169401-azure-active-directory/category/160596-b2c), we want to hear them!
* Review the [Azure AD B2C Protocol Reference](active-directory-b2c-reference-protocols.md).
* Review the [Azure AD B2C Token Reference](active-directory-b2c-reference-tokens.md).
* Read the [Azure Active Directory B2C FAQs](active-directory-b2c-faqs.md).
* [File support requests for Azure Active Directory B2C](active-directory-b2c-support.md).

## Get security updates for our products

We encourage you to get notifications of when security incidents occur by visiting [this page](https://technet.microsoft.com/security/dd252948) and subscribing to Security Advisory Alerts.

