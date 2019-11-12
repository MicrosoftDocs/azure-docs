---
title: Custom token cache serialization in MSAL for Python
titleSuffix: Microsoft identity platform
description: Learn how to serializing the token cache for MSAL for Python
services: active-directory
documentationcenter: dev-center-name
author: rayluo
manager: henrikm
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/11/2019
ms.author: rayluo
ms.reviewer: navyasri.canumalla
ms.custom: aaddev
#Customer intent: As an application developer using the Microsoft Authentication Library (MSAL) for Python, I want to learn how to persist the token cache so that it is available to a new instance of my application.
ms.collection: M365-identity-device-management
---

# Custom token cache serialization in MSAL for Python

In MSAL Python, an in-memory token cache is provided by default, as
[documented in API Reference doc](https://msal-python.readthedocs.io/en/latest/#msal.ClientApplication).

### Serialization is customizable

The in-memory token cache lasts for the duration of the application.
To understand why serialization is not provided out of the box, remember MSAL Python applications can be console or Windows applications (which would have access to the file system), **but also** Web applications or Web API, which might use some specific cache mechanisms like databases, distributed caches, redis caches etc. ...
To have a persistent token cache application in MSAL Python, you will need to customize the serialization.

## Custom token cache serialization in MSAL Python

The strategies are different depending on if you are writing a token cache serialization for a public client application (Desktop), or a confidential client application (Web App / Web API, Daemon app).

### Token cache for a public client application

By [definition](https://tools.ietf.org/html/rfc6749#section-2.1),
public client applications are apps running on end user's devices,
typically containing only dozens of tokens for the only user.
So it is feasible to serialized and persisted the entire cache into, for example, a single file,
and then read it back when next time your app runs.
If your app is the only app which would access such token cache file, without concurrency, you need no locking.
There is [a recipe in MSAL Python's API Reference doc on how to do naive token cache serialization and persistence](https://msal-python.readthedocs.io/en/latest/#msal.SerializableTokenCache).

### Token cache for a Web app (confidential client application)

In the case of Web Apps or Web APIs, the cache can be very different, leveraging the session, or a Redis cache, or a database.

A very important thing to remember is that for Web Apps and Web APIs, there should be one token cache per user (per account). You need to serialize the token cache for each account.

Examples of how to use token caches for Web apps and Web APIs are available in the
[Integrating Microsoft Identity Platform with a Python web application sample](https://github.com/Azure-Samples/ms-identity-python-webapp)
in the [_load_cache() and _save_cache()](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/master/app.py#L64-L72).

## Some of the samples illustrating token cache serialization

Sample | Platform | Description
------ | -------- | -----------
[ms-identity-python-webapp](https://github.com/Azure-Samples/ms-identity-python-webapp) | Windows/Linux | Web application calling the Microsoft Graph API. ![](https://raw.githubusercontent.com/Azure-Samples/ms-identity-python-webapp/master/ReadmeFiles/topology.png)
