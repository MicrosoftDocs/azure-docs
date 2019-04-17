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

# Public Client and Confidential Client applications
Contrary to Azure AD Authentication Library (ADAL) (which proposes the notion of AuthenticationContext, which is a connection to Azure AD), MSAL.NET, proposes a clean separation between public client applications, and confidential client applications:

- **Confidential client applications** are applications which run on servers (Web Apps, Web API, or even service/daemon applications). They are considered difficult to access, and therefore capable of keeping an application secret. Confidential clients are able to hold configuration time secrets. Each instance of the client has a distinct configuration (including clientId and secret). These values are difficult for end users to extract. A web app is the most common confidential client. The clientId is exposed through the web browser, but the secret is passed only in the back channel and never directly exposed.

    Confidential client apps:
    ![Web app](media/msal-client-applications/WebApp.png) ![Web API](media/msal-client-applications/WebAPI.png) ![Daemon/service](media/msal-client-applications/DaemonService.png)

- **Public client applications** are applications which run on devices (phones for instance) or desktop machines. They are not trusted to safely keep application secrets, and therefore access Web APIs in the name of the user only (they only support public client flows). Public clients are unable to hold configuration time secrets, and as a result have no client secret.

    Public client applications:
    ![Desktop app](media/msal-client-applications/DesktopApp.png) ![Browserless API](media/msal-client-applications/BrowserlessApp.png) ![Mobile app](media/msal-client-applications/MobileApp.png)

## High level commonalities and differences
It's immediately obvious that:

- Both kinds of applications maintain a UserTokenCache and can acquire a token silently (in cases where the token is already in the token cache). Confidential client applications also have an AppTokenCache for tokens which are for the app itself (used exclusively by the AcquireTokenForClient method)
- Both manage user accounts (get the accounts from the user token cache (GetAccountsAsync), get an account from its identifier (GetAccountAsync), or remove an account (RemoveAccountAsync))
- Public client applications have four ways of acquiring a token (four flows), whereas confidential client applications have three (+ one method to compute the URL of the identity provider authorize endpoint). For more details see Scenarios and Acquiring tokens

If you used ADAL in the past, you might notice that, contrary to ADAL.NET's Authentication context, in MSAL.NET the clientID (also named applicationID or appId) is passed once at the construction of the Application, and no longer needs to be repeated when acquiring a token. This is the case both for a public and a confidential client applications. Constructors of confidential client applications are also passed client credentials: the secret they share with the identity provider.