---
title: Custom token cache serialization (MSAL Python) | Azure
titleSuffix: Microsoft identity platform
description: Learn how to serializing the token cache for MSAL for Python
services: active-directory
author: rayluo
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 11/13/2019
ms.author: rayluo
ms.reviewer: nacanuma
ms.custom: aaddev, tracking-python
#Customer intent: As an application developer using the Microsoft Authentication Library (MSAL) for Python, I want to learn how to persist the token cache so that it is available to a new instance of my application.
---

# Custom token cache serialization in MSAL for Python

In MSAL Python, an in-memory token cache that persists for the duration of the app session, is provided by default when you create an instance of [ClientApplication](https://msal-python.readthedocs.io/en/latest/#confidentialclientapplication).

Serialization of the token cache, so that different sessions of your app can access it, is not provided "out of the box." That's because MSAL Python can be used in app types that don't have access to the file system--such as Web apps. To have a persistent token cache in a MSAL Python app, you must provide custom token cache serialization.

The strategies for serializing the token cache differ depending on whether you are writing a public client application (Desktop), or a confidential client application (web app, web API, or daemon app).

## Token cache for a public client application

Public client applications run on a user's device and manage tokens for a single user. In this case, you could serialize the entire cache into a file. Remember to provide file locking if your app, or another app, can access the cache concurrently. For a simple example of how to serialize a token cache to a file without locking, see the example in the [SerializableTokenCache](https://msal-python.readthedocs.io/en/latest/#msal.SerializableTokenCache) class reference documentation.

## Token cache for a Web app (confidential client application)

For web apps or web APIs, you might use the session, or a Redis cache, or a database to store the token cache. There should be one token cache per user (per account) so ensure that you serialize the token cache per account.

## Next steps

See [ms-identity-python-webapp](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/master/app.py#L64-L72) for an example of how to use the token cache for a Windows or Linux Web app or web API. The example is for a web app that calls the Microsoft Graph API.
