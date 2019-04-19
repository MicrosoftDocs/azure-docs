---
title: Managing tokens (MSAL) | Azure
description: Learn about acquiring and caching tokens using the Microsoft Authentication Library (MSAL).
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: celested
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/10/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
---

# Acquiring and caching tokens using MSAL
There are many ways to acquiring a token using Microsoft Authentication Library (MSAL). Some ways require user interactions through a web browser. Some don't require any user interactions. In general, the way to acquire a token depends on if the application is a public client application (desktop or mobile app) or a confidential client application (Web App, Web API, or daemon application like a Windows service).

MSAL supports acquiring tokens either on behalf of a user or on behalf of the application itself (only for confidential client applications). In that case the confidential client application shares a secret with Azure AD.

MSAL maintains a token cache (or two caches in the case of confidential client applications).  MSAL caches a token after it has been acquired.  Application code should try to get a token silently (from the cache), first, before acquiring a token by other means. , except in the case of Client Credentials, which does look at the application cache by itself.

Clearing the cache is achieved by removing the accounts from the cache. This does not remove the session cookie which is in the browser, though.



