---
title: Web apps in Azure Active Directory
description: Describes what web apps are and the basics on protocol flow, registration, and token expiration for this app type. 
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: celested
ms.reviewer: saeeda, jmprieur, andret
ms.custom: aaddev
---

# Web apps

Web apps are applications that authenticate a user in a web browser to a web application. In this scenario, the web application directs the user’s browser to sign them in to Azure AD. Azure AD returns a sign-in response through the user’s browser, which contains claims about the user in a security token. This scenario supports sign-on using the OpenID Connect, SAML 2.0, and WS-Federation protocols.

## Diagram

![Authentication flow for browser to web application](./media/authentication-scenarios/web_browser_to_web_api.png)

## Protocol flow

1. When a user visits the application and needs to sign in, they are redirected via a sign-in request to the authentication endpoint in Azure AD.
1. The user signs in on the sign-in page.
1. If authentication is successful, Azure AD creates an authentication token and returns a sign-in response to the application’s Reply URL that was configured in the Azure portal. For a production application, this Reply URL should be HTTPS. The returned token includes claims about the user and Azure AD that are required by the application to validate the token.
1. The application validates the token by using a public signing key and issuer information available at the federation metadata document for Azure AD. After the application validates the token, it starts a new session with the user. This session allows the user to access the application until it expires.

## Code samples

See the code samples for web browser to web application scenarios. And, check back frequently as new samples are added frequently.

## App registration

To register a web app, see [Register an app with the Azure AD v1.0 endpoint](quickstart-v1-add-azure-ad-app.md).

* Single tenant - If you are building an application just for your organization, it must be registered in your company’s directory by using the Azure portal.
* Multi-tenan - If you are building an application that can be used by users outside your organization, it must be registered in your company’s directory, but also must be registered in each organization’s directory that will be using the application. To make your application available in their directory, you can include a sign-up process for your customers that enables them to consent to your application. When they sign up for your application, they will be presented with a dialog that shows the permissions the application requires, and then the option to consent. Depending on the required permissions, an administrator in the other organization may be required to give consent. When the user or administrator consents, the application is registered in their directory.

## Token expiration

The user’s session expires when the lifetime of the token issued by Azure AD expires. Your application can shorten this time period if desired, such as signing out users based on a period of inactivity. When the session expires, the user will be prompted to sign in again.

## Next steps

* Learn more about other [Application types and scenarios](app-types.md)
* Learn about the Azure AD [authentication basics](authentication-scenarios.md)