---
title: Microsoft identity platform authentication libraries
description: List of client libraries and middleware compatible with the Microsoft identity platform. Use these libraries to add support for user sign-in (authentication) and protected web API access (authorization) to your applications.
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: reference
ms.workload: identity
ms.date: 10/28/2022
ms.author: cwerner
ms.reviewer: jmprieur, saeeda
ms.custom: aaddev, engagement-fy23
# Customer intent: As a developer, I want to know whether there's a Microsoft Authentication Library (MSAL) available for the language/framework I'm using to build my application, and whether the library is GA or in preview.
---

# Microsoft identity platform authentication libraries

The following tables show Microsoft Authentication Library support for several application types. They include links to library source code, where to get the package for your app's project, and whether the library supports user sign-in (authentication), access to protected web APIs (authorization), or both.

The Microsoft identity platform has been certified by the OpenID Foundation as a [certified OpenID provider](https://openid.net/certification/). If you prefer to use a library other than the Microsoft Authentication Library (MSAL) or another Microsoft-supported library, choose one with a [certified OpenID Connect implementation](https://openid.net/developers/certified/).

If you choose to hand-code your own protocol-level implementation of [OAuth 2.0 or OpenID Connect 1.0](./v2-protocols.md), pay close attention to the security considerations in each standard's specification and follow secure software design and development practices like those in the [Microsoft SDL][Microsoft-SDL].

## Single-page application (SPA)

A single-page application runs entirely in the browser and fetches page data (HTML, CSS, and JavaScript) dynamically or at application load time. It can call web APIs to interact with back-end data sources.

Because a SPA's code runs entirely in the browser, it's considered a *public client* that's unable to store secrets securely.

[!INCLUDE [active-directory-develop-libraries-spa](./includes/libraries/libraries-spa.md)]

## Web application

A web application runs code on a server that generates and sends HTML, CSS, and JavaScript to a user's web browser to be rendered. The user's identity is maintained as a session between the user's browser (the front end) and the web server (the back end).

Because a web application's code runs on the web server, it's considered a *confidential client* that can store secrets securely.

[!INCLUDE [develop-libraries-webapp](./includes/libraries/libraries-webapp.md)]

## Desktop application

A desktop application is typically binary (compiled) code that displays a user interface and is intended to run on a user's desktop.

Because a desktop application runs on the user's desktop, it's considered a *public client* that's unable to store secrets securely.

[!INCLUDE [develop-libraries-desktop](./includes/libraries/libraries-desktop.md)]

## Mobile application

A mobile application is typically binary (compiled) code that displays a user interface and is intended to run on a user's mobile device.

Because a mobile application runs on the user's mobile device, it's considered a *public client* that's unable to store secrets securely.

[!INCLUDE [develop-libraries-mobile](./includes/libraries/libraries-mobile.md)]

## Service / daemon

Services and daemons are commonly used for server-to-server and other unattended (sometimes called *headless*) communication. Because there's no user at the keyboard to enter credentials or consent to resource access, these applications authenticate as themselves, not a user, when requesting authorized access to a web API's resources.

A service or daemon that runs on a server is considered a *confidential client* that can store its secrets securely.

[!INCLUDE [develop-libraries-daemon](./includes/libraries/libraries-daemon.md)]

## Next steps

For more information about the Microsoft Authentication Library, see the [Overview of the Microsoft Authentication Library (MSAL)](msal-overview.md).

<!--Image references-->
[y]: ./media/common/yes.png
[n]: ./media/common/no.png

<!--Reference-style links -->
[AAD-App-Model-V2-Overview]: v2-overview.md
[Microsoft-SDL]: https://www.microsoft.com/securityengineering/sdl/
[preview-tos]: https://www.microsoft.com/licensing/terms/product/ForOnlineServices/all
