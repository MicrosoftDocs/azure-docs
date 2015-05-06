<properties
   pageTitle="Azure Active Directory Developer's Guide"
   description="A comprehensive guide to developer-oriented resources for Azure Active Directory"
   services="active-directory"
   documentationCenter="dev-center-name"
   authors="msmbaldwin"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="05/04/2015"
   ms.author="mbaldwin"/>


# Azure Active Directory Developer's Guide

## Overview

_Read these overview topics to learn the basics of Azure Active Directory, or jump to [getting started](#getting-started)._

Azure Active Directory offers developers an effective way to integrate identity management in their applications. Industry standard protocols such as SAML 2.0, WS-Federation, and OpenID Connect makes sign-in possible on a variety of platforms such as .Net, Java, Node.js, and PHP. The REST-based Graph API enables developers to read and write to the directory from any platform. Through support for OAuth 2.0, developers can build mobile and web applications that integrate with Microsoft and third party web APIs, and build their own secure web APIs. Open source client libraries are available for .Net, Windows Store, iOS and Android with additional libraries under development.

These articles provide developers with high-level information about the use, implementation, and key features of Azure Active Directory. We suggest you read them in order.


1. **[How To Integrate with Azure AD](active-directory-how-to-integrate.md)**: Discover why integration with Azure Active Directory offers the best solution for secure sign in and authorization.

1. **[Using Azure AD for sign in](active-directory-authentication-scenarios.md)**: Take advantage of Azure Active Directory's simplified authentication to provide sign on to your application.

1. **[Querying the Directory](https://msdn.microsoft.com/library/azure/hh974476.aspx)**: Use the Azure Active Directory Graph API to programmatically access Azure AD through REST API endpoints.

1. **[Understanding the Application Model](https://msdn.microsoft.com/library/azure/dn151122.aspx)**: Learn about registering your application and the branding guidelines for multi-tenant applications.

1. **[Libraries](https://msdn.microsoft.com/library/azure/dn151135.aspx)**: Easily authenticate users to obtain access tokens with the Azure Authentication Libraries.


## Getting Started

These tutorials are tailored for multiple platforms, and allow you to quickly start developing with Azure Active Directory. As a prerequisite you must [get an Azure Active Directory tenant](active-directory-howto-tenant.md).

###Mobile or PC application quickstart guides

- [iOS](active-directory-devquickstarts-ios.md)
- [Android](active-directory-devquickstarts-android.md)
- [.NET](active-directory-devquickstarts-dotnet.md)
- [Windows Phone](active-directory-devquickstarts-windowsphone.md)
- [Windows Store](active-directory-devquickstarts-windowsstore.md)
- [Xamarin](active-directory-devquickstarts-xamarin.md)
- [Cordova](active-directory-devquickstarts-cordova.md)


###Web Application or Web API quickstart guides

- [.NET Web App](active-directory-devquickstarts-webapp-dotnet.md)
- [.NET Web API](active-directory-devquickstarts-webapi-dotnet.md)
- [Javascript](active-directory-devquickstarts-angular.md)
- [Node.js](active-directory-devquickstarts-webapi-nodejs.md)


## How Tos

These articles describe how to perform specific tasks using Azure Active Directory (AD).

- [How to get an Azure AD tenant](active-directory-howto-tenant.md)
- [How to list your application in the Azure AD application gallery](active-directory-app-gallery-listing.md)


## Reference

These articles provide foundation reference for REST and authentication library APIs, protocols, errors, code samples, and endpoints.  

###  Support
- **[Where to get support](http://stackoverflow.com/questions/tagged/azure-active-directory)**: Find Azure AD solutions on Stack Overflow by searching for the tags [azure-active-directory](http://stackoverflow.com/questions/tagged/azure-active-directory) and [adal](http://stackoverflow.com/questions/tagged/adal).

### Code

- **[Azure AD open source libraries](http://github.com/AzureAD)**: The easiest way to find a library’s source is using our [library list](https://msdn.microsoft.com/library/azure/dn151135.aspx).

- **[Azure AD samples](http://github.com/AzureADSamples)**: The easiest way to navigate the list of samples is using the [Code Samples Index](active-directory-code-samples.md).


### Graph API

- **[Graph API Reference](https://msdn.microsoft.com/library/azure/hh974476.aspx)**: REST reference for the Azure Active Directory Graph API. [View the new interactive Graph API reference experience](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/api-catalog).

- **[Graph API Permission Scopes](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/graph-api-permission-scopes)**: The OAuth 2.0 permission scopes that are used to control the access an app has to directory data in a tenant.


### Authentication Protocols

- **[SAML 2.0 Protocol Reference](https://msdn.microsoft.com/library/azure/dn195591.aspx)**: The SAML 2.0 protocol enables applications to provide a single sign-on experience to their users.


- **[OAuth 2.0 Protocol Reference](https://msdn.microsoft.com/library/azure/dn645545.aspx)**: The OAuth 2.0 protocol enables you to authorize access to web applications and web APIs in your Azure AD tenant.


- **[OpenID Connect 1.0 Protocol Reference](https://msdn.microsoft.com/library/azure/dn645541.aspx)**: The OpenID Connect 1.0 protocol extends OAuth 2.0 for use as an authentication protocol.


- **[WS-Federation 1.2 Protocol Reference](https://msdn.microsoft.com/library/azure/dn903702.aspx)**: The WS-Federation 1.2 protocol, as specified in the Web Services Federation Version 1.2 Specification.

- **[Supported Security Tokens and Claims](active-directory-token-and-claims.md)**: A guide of understanding and evaluating the claims in the SAML 2.0 and JSON Web Tokens (JWT) tokens.

## Videos

### Build 2015
- **[Azure Active Directory: Identity Management as a Service for Modern Applications](http://azure.microsoft.com/documentation/videos/build-2015-azure-active-directory-identity-management-as-a-service-for-modern-applications)**
- **[Develop Modern Web Applications with Azure Active Directory](http://azure.microsoft.com/documentation/videos/build-2015-develop-modern-web-applications-with-azure-active-directory)**
- **[Develop Modern Native Applications with Azure Active Directory](http://azure.microsoft.com/documentation/videos/build-2015-develop-modern-native-applications-with-azure-active-directory)**


### Azure Friday
- **[Azure Identity 101](http://azure.microsoft.com/documentation/videos/azure-identity-basics/)**
- **[Azure Identity 102](http://azure.microsoft.com/documentation/videos/azure-identity-creating-active-directory/)**
- **[Azure Identity 103](http://azure.microsoft.com/documentation/videos/azure-identity-application-to-authenticate/)**


## Social

- **[Active Directory Team Blog](http://blogs.technet.com/b/ad/)**: Keep abreast of the latest developments in the world of Azure AD.

- **[Cloud Identity](http://www.cloudidentity.net)**: Thoughts on Identity Management as a Service, from a Principle Azure Active Directory PM.  

- **[Azure AD on Twitter](https://twitter.com/azuread)**: Azure AD announcements in 140 characters or less.