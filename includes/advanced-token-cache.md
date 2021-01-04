---
title: include file
description: include file
services: active-directory
author: kalyankrishna1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: include
ms.date: 11/05/2020
ms.author: kkrishna
---

You can use MSAL's token cache implementation to allow background apps, APIs, and services to use the access token cache to continue to act on behalf of users in their absence. Doing so is especially useful if the background apps and services need to continue to work on behalf of the user after the user has exited the front-end web app.

Today, most background processes use [application permissions](/graph/auth/auth-concepts#microsoft-graph-permissions) when they need to work with a user's data without them being present to authenticate or reauthenticate. Because application permissions often require admin consent, which requires elevation of privilege, unnecessary friction is encountered as the developer didn't intend to obtain permission beyond that which the user originally consented to for their app.

This code sample on GitHub shows how to avoid this unneeded friction by accessing MSAL's token cache from background apps:

 [Accessing the logged-in user's token cache from background apps, APIs, and services](https://github.com/Azure-Samples/ms-identity-dotnet-advanced-token-cache)