---
title: Implementing Sign-in with Microsoft on an Android application - Intro
description: How to  implement demonstrates how to implement Sign-In with Microsoft on a native Android application using the OpenID Connect standard | Microsoft Azure
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

This guide demonstrates how a native Android application can call an API protected by Azure Active Directory v2 endpoint.

At the end of this guide, your application will be able to call a protected API using personal accounts (including outlook.com, live.com, and others) as well as work and school accounts from any company or organization that has Azure Active Directory.  

### How this sample works
![How this sample works](../../media/active-directory-mobileanddesktopapp-android-intro/android-intro.png)

The sample created by this guide is based on a scenario where an Android application is used to query a Web API that accepts tokens from Azure Active Directory v2 endpoint – in this case, Microsoft Graph API. For this scenario, a token is added to HTTP requests via the Authorization header. Token acquisition and renewal is handled by the Microsoft Authentication Library (MSAL).

## Pre-Requisites:
* This guided setup is focused on Android Studio, but any other Android application development environment is also acceptable. 
* Android SDK 21 or newer is required.
* Google Chrome or a web browser using Chrome Tabs is required for this release of Microsoft Authentication Library (MSAL) for Android.


# Handling token acquisition for accessing protected Web APIs
After the user completes sign-in, applications need to query Web APIs from a backend that is secured by Microsoft Azure Active Directory v2 endpoint. 

APIs – like Microsoft Graph - require an access token to access specific resources – for example, to read a user’s profile, access a user’s calendar or send an email. Your application can request an access token to access these resources by specifying the API scopes that your application requires to access via MSAL. This access token is then added to the HTTP Authorization header for every call made against the protected resource. 

MSAL library handles caching and refreshing Access Tokens for you, so your application does not need to check if tokens are expiring and manually renew them.


## Libraries

This guide uses the following libraries:

|Library|Description|
|---|---|
|com.microsoft.identity.client|Microsoft Authentication Library (MSAL)|

### What is Next

[Setup](active-directory-mobileanddesktopapp-android-setup.md)
