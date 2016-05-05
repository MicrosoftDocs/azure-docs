<properties
   pageTitle="Azure Active Directory developer's guide | Microsoft Azure"
   description="This article provides a comprehensive guide to developer-oriented resources for Azure Active Directory."
   services="active-directory"
   documentationCenter="dev-center-name"
   authors="msmbaldwin"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="hero-article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="04/02/2016"
   ms.author="mbaldwin"/>


# Azure Active Directory developer's guide

## Overview
As an identity management as a service (IDMaaS) platform, Azure Active Directory provides developers an effective way to integrate identity management into their applications. The following articles provide overviews on implementation and key features of Azure Active Directory. We suggest that you read them in order, or jump to [Getting started](#getting-started) if you're ready to dig in.


1. [The benefits of Azure Active Directory integration](active-directory-how-to-integrate.md): Discover why integration with Azure Active Directory offers the best solution for secure sign-in and authorization.

1. [Active Directory authentication scenarios](active-directory-authentication-scenarios.md): Take advantage of simplified authentication in Azure Active Directory to provide sign-on to your application.

1. [Integrating applications with Azure Active Directory](active-directory-integrating-applications.md): Learn how to add, update, and remove applications from Azure Active Directory, and about the branding guidelines for integrated apps.

1. [Azure Active Directory Graph API](active-directory-graph-api.md): Use the Azure Active Directory Graph API to programmatically access Azure Active Directory through REST API endpoints. Note that Azure AD Graph API is also accessible through [Microsoft Graph](https://graph.microsoft.io/), a unified API that  enables access to multiple Microsoft cloud service APIs through a single REST API endpoint, and with a single access token.

1. [Azure Active Directory authentication libraries](active-directory-authentication-libraries.md): Easily authenticate users to obtain access tokens by using Azure AD authentication libraries for .NET, JavaScript, Objective-C, Android, and more.


## Getting started

These tutorials are tailored for multiple platforms and can help you quickly start developing with Azure Active Directory. As a prerequisite, you must [get an Azure Active Directory tenant](active-directory-howto-tenant.md).

### Mobile and PC application quick-start guides

|[![iOS](./media/active-directory-developers-guide/ios.png)](active-directory-devquickstarts-ios.md)|[![Android](./media/active-directory-developers-guide/android.png)](active-directory-devquickstarts-android.md)|[![.NET](./media/active-directory-developers-guide/net.png)](active-directory-devquickstarts-dotnet.md)| [![Windows Phone](./media/active-directory-developers-guide/windows.png)](active-directory-devquickstarts-windowsphone.md)|[![Windows Store](./media/active-directory-developers-guide/windows.png)](active-directory-devquickstarts-windowsstore.md)|[![Xamarin](./media/active-directory-developers-guide/xamarin.png)](active-directory-devquickstarts-xamarin.md)|[![Cordova](./media/active-directory-developers-guide/cordova.png)](active-directory-devquickstarts-cordova.md)
|:--:|:--:|:--:|:--:|:--:|:--:|:--:
|[iOS](active-directory-devquickstarts-ios.md)|[Android](active-directory-devquickstarts-android.md)|[.NET](active-directory-devquickstarts-dotnet.md)|[Windows Phone](active-directory-devquickstarts-windowsphone.md)|[Windows Store](active-directory-devquickstarts-windowsstore.md)|[Xamarin](active-directory-devquickstarts-xamarin.md)|[Cordova](active-directory-devquickstarts-cordova.md)

### Web application quick-start guides

|[![.NET](./media/active-directory-developers-guide/net.png)](active-directory-devquickstarts-webapp-dotnet.md)|[![Java](./media/active-directory-developers-guide/java.png)](active-directory-devquickstarts-webapp-java.md)|[![Javascript](./media/active-directory-developers-guide/javascript.png)](active-directory-devquickstarts-angular.md)|[![Node.js](./media/active-directory-developers-guide/nodejs.png)](active-directory-devquickstarts-openidconnect-nodejs.md)
|:--:|:--:|:--:|:--:|
|[.NET](active-directory-devquickstarts-webapp-dotnet.md)|[Java](active-directory-devquickstarts-webapp-java.md)|[Javascript](active-directory-devquickstarts-angular.md)|[Node.js](active-directory-devquickstarts-openidconnect-nodejs.md)

### Web API quick-start guides

|[![.NET](./media/active-directory-developers-guide/net.png)](active-directory-devquickstarts-webapi-dotnet.md)|[![Node.js](./media/active-directory-developers-guide/nodejs.png)](active-directory-devquickstarts-webapi-nodejs.md)
|:--:|:--:|
|[.NET](active-directory-devquickstarts-webapi-dotnet.md)|[Node.js](active-directory-devquickstarts-webapi-nodejs.md)

### Querying the directory quickstart guide

| [![.NET](./media/active-directory-developers-guide/graph.png)](active-directory-graph-api-quickstart.md)|
|:--:|
|[Graph API](active-directory-graph-api-quickstart.md)|

## How-tos

These articles describe how to perform specific tasks by using Azure Active Directory:

- [Get an Azure Active Directory tenant](active-directory-howto-tenant.md)
- [List your application in the Azure Active Directory application gallery](active-directory-app-gallery-listing.md)
- [Understand the Azure Active Directory application manifest](active-directory-application-manifest.md)
- [Create an app with Office 365 APIs](https://msdn.microsoft.com/office/office365/howto/getting-started-Office-365-APIs)
- [Submit web apps for Office 365 to the Seller Dashboard](https://msdn.microsoft.com/office/office365/howto/submit-web-apps-seller-dashboard)
- Learn how to enable cross-app SSO using ADAL, on [Android](active-directory-sso-android.md) and on [iOS](active-directory-sso-ios.md) devices
- [Preview: How to build apps that sign users in with both personal & work or school accounts](active-directory-appmodel-v2-overview.md)
- [Preview: How to build apps that sign up & sign in consumers](../active-directory-b2c/active-directory-b2c-overview.md)


## Reference

These articles provide a foundation reference for REST and authentication library APIs, protocols, errors, code samples, and endpoints.  

###  Support
- [Tagged questions](http://stackoverflow.com/questions/tagged/azure-active-directory): Find Azure Active Directory solutions on Stack Overflow by searching for the tags [azure-active-directory](http://stackoverflow.com/questions/tagged/azure-active-directory) and [adal](http://stackoverflow.com/questions/tagged/adal).

### Code

- [Azure Active Directory open-source libraries](http://github.com/AzureAD): The easiest way to find a library’s source is by using our [library list](active-directory-authentication-libraries.md).

- [Azure Active Directory samples](https://github.com/azure-samples?query=active-directory): The easiest way to navigate the list of samples is by using the [index of code samples](active-directory-code-samples.md).

- [ADAL for .NET](https://msdn.microsoft.com/library/azure/mt417579.aspx): Documentation for the .NET authentication library.

### Graph API

- [Graph API reference](https://msdn.microsoft.com/library/azure/hh974476.aspx): REST reference for the Azure Active Directory Graph API. [View the interactive Graph API reference experience](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/api-catalog).

- [Graph API permission scopes](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-permission-scopes): OAuth 2.0 permission scopes that are used to control the access that an app has to directory data in a tenant.

### Authentication protocols

- [SAML 2.0 protocol reference](https://msdn.microsoft.com/library/azure/dn195591.aspx): The SAML 2.0 protocol enables applications to provide a single sign-on experience to their users.


- [OAuth 2.0 protocol reference](https://msdn.microsoft.com/library/azure/dn645545.aspx): You can use the OAuth 2.0 protocol to authorize access to web applications and web APIs in your Azure Active Directory tenant.


- [OpenID Connect 1.0 protocol reference](https://msdn.microsoft.com/library/azure/dn645541.aspx): The OpenID Connect 1.0 protocol extends OAuth 2.0 for use as an authentication protocol.


- [WS-Federation 1.2 protocol reference](https://msdn.microsoft.com/library/azure/dn903702.aspx): The WS-Federation 1.2 protocol is specified in the Web Services Federation Version 1.2 Specification.

- [Supported token and claim types](active-directory-token-and-claims.md): You can use this guide to understand and evaluate the claims in the SAML 2.0 and JSON Web Tokens (JWT) tokens.

## Videos

### Build

These overview presentations on developing apps by using Azure Active Directory feature speakers who work directly in the engineering team. The presentations cover fundamental topics, including IDMaaS, authentication, identity federation, and single sign-on.

- [Microsoft Identity: State of the Union and Future Direction](https://azure.microsoft.com/documentation/videos/build-2016-microsoft-identity-state-of-the-union-and-future-direction/)
- [Azure Active Directory: Identity management as a service for modern applications](https://azure.microsoft.com/documentation/videos/build-2015-azure-active-directory-identity-management-as-a-service-for-modern-applications/)
- [Develop modern web applications with Azure Active Directory](https://azure.microsoft.com/documentation/videos/build-2015-develop-modern-web-applications-with-azure-active-directory/)
- [Develop modern native applications with Azure Active Directory](https://azure.microsoft.com/documentation/videos/build-2015-develop-modern-native-applications-with-azure-active-directory/)

### Azure Friday
[Azure Friday](https://azure.microsoft.com/documentation/videos/azure-friday/) is a recurring Friday 1:1 video series that's dedicated to bringing you short (10–15 minutes) interviews with experts on a variety of Azure topics.  Use the Services Filter feature on the page to see all Azure Active Directory videos.

- [Azure Identity 101](https://azure.microsoft.com/documentation/videos/azure-identity-basics/)
- [Azure Identity 102](https://azure.microsoft.com/documentation/videos/azure-identity-creating-active-directory/)
- [Azure Identity 103](https://azure.microsoft.com/documentation/videos/azure-identity-application-to-authenticate/)

## Social

- [Active Directory Team blog](http://blogs.technet.com/b/ad/): The latest developments in the world of Azure Active Directory.

- [Azure Active Directory Graph Team blog](http://blogs.msdn.com/b/aadgraphteam): Azure Active Directory information that's specific to the Graph API.

- [Cloud Identity](http://www.cloudidentity.net): Thoughts on identity management as a service, from a principal Azure Active Directory PM.  

- [Azure Active Directory on Twitter](https://twitter.com/azuread): Azure Active Directory announcements in 140 characters or fewer.
