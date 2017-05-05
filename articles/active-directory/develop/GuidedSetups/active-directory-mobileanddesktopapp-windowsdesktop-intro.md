---
title: Implementing Sign-in with Microsoft on a Windows Desktop Application - Intro
description: How a Windows Desktop .NET (XAML) application can get an access token and call an API protected by Azure Active Directory v2 endpoint. | Microsoft Azure | Microsoft Azure
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
ms.date:
ms.author: andret

---
# Before you get started

This guide demonstrates how a Windows Desktop .NET (XAML) application can get an access token and call Microsoft Graph API or other APIs protected by Azure Active Directory v2.

At the end of this guide, your application will be able to call a protected API using personal accounts (including outlook.com, live.com, and others) as well as work and school accounts from any company or organization that has Azure Active Directory.  

> For this tutorial, we assume you’re using Visual Studio 2015 Update 3 or Visual Studio 2017.  Don’t have it? [Download Visual Studio 2017 for free](https://www.visualstudio.com/downloads/)

## How this sample works

![How this sample works](media/active-directory-mobileanddesktopapp-windowsdesktop-intro/windesktophowitworks.png)

The sample created by this guide is based on a scenario where a Windows Desktop Application is used to query a Web API that accepts tokens from Azure Active Directory v2 endpoint – in this case, Microsoft Graph API. For this scenario, a token is added to HTTP requests via the Authorization header. Token acquisition and renewal is handled by the Microsoft Authentication Library (MSAL).


## Handling token acquisition for accessing protected Web APIs

After the user completes sign-in, applications need to query Web APIs from backends secured by Microsoft Azure Active Directory v2.

APIs – like Microsoft Graph - require an access token to allow accessing specific resources – for example, to read a user’s profile, access user’s calendar or send an email. Your application can request an access token to access these resources by specifying the API scopes (one scope per resource) that your application require to access via MSAL. This access token is then added to the HTTP Authorization header for every call made against the protected resource. 

MSAL library handles caching and refreshing Access Tokens for you, so your application does not need to check if tokens are expiring and manually renewing them.



## NuGet Packages

This guide uses the following NuGet packages:

|Library|Description|
|---|---|
|[Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client)|Microsoft Authentication Library (MSAL)|

### What is Next

[Setup](active-directory-mobileanddesktopapp-windowsdesktop-setup.md)

