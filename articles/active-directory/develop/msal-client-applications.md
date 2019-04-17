---
title: Client applications (MSAL) | Azure
description: Microsoft Authentication Library (MSAL) enables application developers to acquire tokens in order to call secured Web APIs. These Web APIs can be the Microsoft Graph, other Microsoft APIS, third-party Web APIs, or your own Web API. MSAL supports multiple application architectures and platforms.
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: celested
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/12/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about the types of client application so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Public client and confidential client applications
Microsoft Authentication Library (MSAL) defines two types of clients: public clients and confidential clients. The two client types are distinguished by their ability to authenticate securely with the authorization server and maintain the confidentiality of their client credentials.  In contrast, Azure AD Authentication Library (ADAL) has the concept of [AuthenticationContext](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/AuthenticationContext-the-connection-to-Azure-AD) (which is a connection to Azure AD).

- **Confidential client applications** are applications which run on servers (Web Apps, Web API, or even service/daemon applications). They are considered difficult to access, and therefore capable of keeping an application secret. Confidential clients are able to hold configuration time secrets. Each instance of the client has a distinct configuration (including clientId and secret). These values are difficult for end users to extract. A web app is the most common confidential client. The client ID is exposed through the web browser, but the secret is passed only in the back channel and never directly exposed.

    Confidential client apps:
    ![Web app](media/msal-client-applications/WebApp.png) ![Web API](media/msal-client-applications/WebAPI.png) ![Daemon/service](media/msal-client-applications/DaemonService.png)

- **Public client applications** are applications which run on devices (phones, for example) or desktop machines. They are not trusted to safely keep application secrets, and therefore only access Web APIs on behalf of the user (they only support public client flows). Public clients are unable to hold configuration time secrets, and as a result have no client secret.

    Public client applications:
    ![Desktop app](media/msal-client-applications/DesktopApp.png) ![Browserless API](media/msal-client-applications/BrowserlessApp.png) ![Mobile app](media/msal-client-applications/MobileApp.png)

## Comparing the client types
There are some commonalities and differences public client and confidential client applications:

- Both kinds of applications maintain a user token cache and can acquire a token silently (in cases where the token is already in the token cache). Confidential client applications also have an app token cache for tokens which are for the app itself.
- Both manage user accounts and can get the accounts from the user token cache, get an account from its identifier, or remove an account.
- Public client applications have four ways of acquiring a token (four flows), whereas confidential client applications have three (+ one method to compute the URL of the identity provider authorize endpoint). For more details see Scenarios and Acquiring tokens

If you used ADAL in the past, you might notice that, contrary to ADAL.NET's Authentication context, in MSAL.NET the clientID (also named applicationID or appId) is passed once at the construction of the Application, and no longer needs to be repeated when acquiring a token. This is the case both for a public and a confidential client applications. Constructors of confidential client applications are also passed client credentials: the secret they share with the identity provider.