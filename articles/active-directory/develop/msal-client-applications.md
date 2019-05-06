---
title: Client applications (Microsoft Authentication Library) | Azure
description: Learn about public client and confidential client applications in the Microsoft Authentication Library (MSAL).
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
ms.date: 04/25/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about the types of client application so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Public client and confidential client applications
Microsoft Authentication Library (MSAL) defines two types of clients: public clients and confidential clients. The two client types are distinguished by their ability to authenticate securely with the authorization server and maintain the confidentiality of their client credentials.  In contrast, Azure AD Authentication Library (ADAL) has the concept of authentication context (which is a connection to Azure AD).

- **Confidential client applications** are applications, which run on servers (Web Apps, Web API, or even service/daemon applications). They are considered difficult to access, and therefore capable of keeping an application secret. Confidential clients are able to hold configuration time secrets. Each instance of the client has a distinct configuration (including clientId and secret). These values are difficult for end users to extract. A web app is the most common confidential client. The client ID is exposed through the web browser, but the secret is passed only in the back channel and never directly exposed.

    Confidential client apps: <BR>
    ![Web app](media/msal-client-applications/web-app.png) ![Web API](media/msal-client-applications/web-api.png) ![Daemon/service](media/msal-client-applications/daemon-service.png)

- **Public client applications** are applications, which run on devices or desktop machines or in a web browser. They are not trusted to safely keep application secrets, and therefore only access Web APIs on behalf of the user (they only support public client flows). Public clients are unable to hold configuration time secrets, and as a result have no client secret.

    Public client applications: <BR>
    ![Desktop app](media/msal-client-applications/desktop-app.png) ![Browserless API](media/msal-client-applications/browserless-app.png) ![Mobile app](media/msal-client-applications/mobile-app.png)

> [!NOTE]
> In MSAL.js, there is no separation of public and confidential client apps.  MSAL.js represents client apps as user-agent-based apps, a public client in which the client code is executed in a user-agent such as a web browser.  These clients do not store secrets, since the browser context is openly accessible.

## Comparing the client types
There are some commonalities and differences between public client and confidential client applications:

- Both kinds of applications maintain a user token cache and can acquire a token silently (in cases where the token is already in the token cache). Confidential client applications also have an app token cache for tokens, which are for the app itself.
- Both manage user accounts and can get the accounts from the user token cache, get an account from its identifier, or remove an account.
- Public client applications have four ways of acquiring a token (four authentication flows), whereas confidential client applications have three (and one method to compute the URL of the identity provider authorize endpoint). For more information, see Scenarios and Acquiring tokens.

If you used ADAL in the past, you might notice that, contrary to ADAL's authentication context, in MSAL the client ID (also named application ID or app ID) is passed once at the construction of the application, and no longer needs to be repeated when acquiring a token. This is the case both for public and confidential client applications. Constructors of confidential client applications are also passed client credentials: the secret they share with the identity provider.

## Next steps
Learn about:
- [Client application configuration options](msal-client-application-configuration.md)
- [Instantiating client applications using MSAL.NET](msal-net-initializing-client-applications.md).
- [Instantiating client applications using MSAL.js](msal-js-initializing-client-applications.md).
