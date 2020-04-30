---
title: Understand API authentication - Azure Digital Twins | Microsoft Docs
description: Learn how to connect to and authenticate with APIs using Azure Digital Twins.
ms.author: alinast
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 01/21/2020
---

# Connect to and authenticate with APIs

Azure Digital Twins uses Azure Active Directory (Azure AD) to authenticate users and protect applications. Azure AD supports authentication for a variety of modern architectures. All of them are based on the industry-standard protocols OAuth 2.0 or OpenID Connect. In addition, developers can use Azure AD to build  single-tenant and line-of-business (LOB) applications. Developers also can use Azure AD to develop [multitenant applications](how-to-multitenant-applications.md).

For an overview of Azure AD, visit the [fundamentals page](https://docs.microsoft.com/azure/active-directory/fundamentals/) for step-by-step guides, concepts, and quickstarts.

> [!TIP]
> Follow the [Tutorial](tutorial-facilities-setup.md) to set up and run an Azure Digital Twins sample app.

To integrate an application or service with Azure AD, a developer must first register the application with Azure AD. For detailed instructions and screenshots, read [this quickstart](../active-directory/develop/quickstart-register-app.md).

[Five primary application scenarios](../active-directory/develop/v2-app-types.md) are supported by Azure AD:

* Single-page application (SPA): A user needs to sign in to a single-page application that's secured by Azure AD.
* Web browser to web application: A user needs to sign in to a web application that's secured by Azure AD.
* Native application to web API: A native application that runs on a phone, tablet, or PC needs to authenticate a user to get resources from a web API that's secured by Azure AD.
* Web application to web API: A web application needs to get resources from a web API secured by Azure AD.
* Daemon or server application to web API: A daemon application or a server application with no web UI needs to get resources from a web API secured by Azure AD.

> [!IMPORTANT]
> Azure Digital Twins supports both of the following authentication libraries:
> * The more recent [Microsoft Authentication Library (MSAL)](https://docs.microsoft.com/azure/active-directory/develop/msal-overview)
> * The [Azure Active Directory Authentication Library (ADAL)](https://docs.microsoft.com/azure/active-directory/develop/active-directory-authentication-libraries)

## Call Digital Twins from a middle-tier web API

When developers architect Digital Twins solutions, they typically create a middle-tier application or API. The app or API then calls the Digital Twins API downstream. To support this standard web solution architecture, make sure that users first:

1. Authenticate with the middle-tier application

1. An OAuth 2.0 On-Behalf-Of token is acquired during authentication

1. The acquired token is then used to authenticate with or call APIs that are further downstream using the On-Behalf-Of flow

For instructions about how to orchestrate the on-behalf-of flow, read [OAuth 2.0 On-Behalf-Of flow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow). You also can view code samples in [Calling a downstream web API](https://github.com/Azure-Samples/active-directory-dotnet-webapi-onbehalfof).

## Next steps

To configure and test Azure Digital Twins using the OAuth 2.0 implicit grant flow, read [Configure Postman](./how-to-configure-postman.md).

To learn about Azure Digital Twins security, read [Create and manage role assignments](./security-create-manage-role-assignments.md).
