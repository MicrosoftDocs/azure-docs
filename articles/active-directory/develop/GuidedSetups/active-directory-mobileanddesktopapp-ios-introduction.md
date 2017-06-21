---
title: Azure AD v2 iOS Getting Started - Intro | Microsoft Docs
description: How iOS (Swift) applications can call an API that require access tokens by Azure Active Directory v2 endpoint
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: mbaldwin
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/09/2017
ms.author: andret

---
# Call the Microsoft Graph API from an iOS app

This guide demonstrates how a native iOS application (Swift) can get an access token and call the Microsoft Graph API or other APIs that require access tokens from Azure Active Directory v2 endpoint.

At the end of this guide, your application will be able to call a protected API using personal accounts (including outlook.com, live.com, and others) as well as work and school accounts from any company or organization that has Azure Active Directory.

> ### Pre-Requisites
> - XCode 8.x is required for this guide. You can download XCode [from here](https://geo.itunes.apple.com/us/app/xcode/id497799835?mt=12 "XCode Download URL").
> - [Carthage](https://github.com/Carthage/Carthage) for package management

### How this guide works

![How this guide works](media/active-directory-mobileanddesktopapp-ios-introduction/iosintro.png)

The sample application created by this guide enables an iOS application to query the Microsoft Graph API or a Web API that accepts tokens from Azure Active Directory v2 endpoint. For this scenario, a token is added to HTTP requests via the Authorization header. Token acquisition and renewal is handled by the Microsoft Authentication Library (MSAL).


### Handling token acquisition for accessing protected Web APIs

After the user authenticates, the sample application receives a token that can be used to query the Microsoft Graph API or a Web API secured by Microsoft Azure Active Directory v2.

APIs such as Microsoft Graph require an access token to allow accessing specific resources – for example, to read a user’s profile, access user’s calendar or send an email. Your application can request an access token using MSAL by specifying API scopes. This access token is then added to the HTTP Authorization header for every call made against the protected resource.

MSAL manages caching and refreshing access tokens for you, so your application doesn't need to.


### NuGet Packages

This guide uses the following NuGet packages:

|Library|Description|
|---|---|
|[MSAL.framework](https://github.com/AzureAD/microsoft-authentication-library-for-objc)|Microsoft Authentication Library Preview for iOS|

