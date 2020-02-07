---
title: Acquire token & call Microsoft Graph (.NET Core Console) (v1.0) | Azure
description: Build a .NET daemon application that integrates with Azure AD & calls Azure AD protected APIs using OAuth 2.0
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 07/17/2019
ms.author: jmprieur
ms.reviewer: ryanwi
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how to sign in users and call the Microsoft Graph API from a .NET Desktop (WPF) app.
---

# Quickstart: Acquire token and call Microsoft Graph using console app's identity (v1.0)

[Microsoft identity platform](v2-overview.md) is an evolution of the Azure Active Directory (Azure AD) developer platform. It allows developers to build applications that sign in all Microsoft identities and get tokens to call Microsoft APIs such as Microsoft Graph or APIs that developers have built.

[Microsoft Authentication Library (MSAL)](msal-overview.md) enables developers to acquire tokens from the Microsoft identity platform endpoint in order to access secured Web APIs. Active Directory Authentication Library (ADAL) integrates with the Azure AD for developers (v1.0) endpoint, where MSAL integrates with the Microsoft identity platform (v2.0) endpoint.

## Next steps

For new .NET daemon applications, we recommend you use Microsoft identity platform (v2.0) and MSAL to acquire tokens and access secured web APIs: [Quickstart: Acquire a token and call Microsoft Graph API from a console app using an app's identity](quickstart-v2-netcore-daemon.md).
