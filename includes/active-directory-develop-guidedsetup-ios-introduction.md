---
title: include file
description: include file
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: mtillman
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: include
ms.tgt_pltfrm: ios
ms.workload: identity
ms.date: 09/19/2018
ms.author: andret
ms.custom: include file 

---

# Call the Microsoft Graph API from an iOS application

This guide shows how a native iOS application (Swift) can call APIs that require access tokens from the Microsoft Azure Active Directory (Azure AD) v2.0 endpoint. The guide explains how to obtain access tokens and use them in calls to the Microsoft Graph API and other APIs.

After you complete the exercises in this guide, your application can call a protected API from any company or organization that has Azure AD. Your application can make protected API calls by using personal accounts like outlook.com, live.com, and others, as well as work or school accounts.

## Prerequisites
- XCode version 10.x is required for the sample that is created in this guide. You can download XCode from the [iTunes website](https://geo.itunes.apple.com/us/app/xcode/id497799835?mt=12 "XCode Download URL").
- The [Carthage](https://github.com/Carthage/Carthage) dependency manager is required for package management.

## How this guide works

![How this guide works](media/active-directory-develop-guidedsetup-ios-introduction/iosintro.png)

In this guide, the sample application enables an iOS application to query the Microsoft Graph API or a web API that accepts tokens from the Azure AD v2.0 endpoint. For this scenario, a token is added to HTTP requests by using the **Authorization** header. Token acquisition and renewal are handled by the Microsoft Authentication Library (MSAL).


### Handle token acquisition for access to protected web APIs

After the user authenticates, the sample application receives a token. The token is used to query the Microsoft Graph API or a web API that is secured by the Azure AD v2.0 endpoint.

APIs, such as Microsoft Graph, require an access token to allow access to specific resources. Tokens are required to read a user’s profile, access a user’s calendar, send an email, and so on. Your application can request an access token by using MSAL and specifying API scopes. The access token is added to the HTTP **Authorization** header for every call that is made against the protected resource.

MSAL manages caching and refreshing access tokens for you, so your application doesn't need to.


## Libraries

This guide uses the following library:

|Library|Description|
|---|---|
|[MSAL.framework](https://github.com/AzureAD/microsoft-authentication-library-for-objc)|Microsoft Authentication Library Preview for iOS|

