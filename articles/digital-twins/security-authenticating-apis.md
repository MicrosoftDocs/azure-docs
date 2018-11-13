---
title: Understand Azure Digital Twins API authentication | Microsoft Docs
description: Use Azure Digital Twins to connect and authenticate to APIs
author: lyrana
manager: alinast
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/02/2018
ms.author: lyrana
---

# Connect and authenticate to APIs

Azure Digital Twins uses Azure Active Directory (Azure AD) to authenticate users and protect applications. Azure AD supports authentication for a variety of modern architectures. All of them are based on the industry-standard protocols OAuth 2.0 or OpenID Connect. In addition, developers can use Azure AD to build  single-tenant and line-of-business (LOB) applications. Developers also can use Azure AD to develop multitenant applications.

For an overview of Azure AD, visit the [fundamentals page](https://docs.microsoft.com/azure/active-directory/fundamentals/index) for step-by-step guides, concepts, and quickstarts.

To integrate an application or service with Azure AD, a developer must first register the application with Azure AD. For detailed instructions and screenshots, see [this quickstart](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-add-azure-ad-app).

[Five primary application scenarios](https://docs.microsoft.com/azure/active-directory/develop/v2-app-types) are supported by Azure AD:

* Single-page application (SPA): A user needs to sign in to a single-page application that's secured by Azure AD.
* Web browser to web application: A user needs to sign in to a web application that's secured by Azure AD.
* Native application to web API: A native application that runs on a phone, tablet, or PC needs to authenticate a user to get resources from a web API that's secured by Azure AD.
* Web application to web API: A web application needs to get resources from a web API secured by Azure AD.
* Daemon or server application to web API: A daemon application or a server application with no web UI needs to get resources from a web API secured by Azure AD.

The Windows Azure Authentication Library offers many ways to acquire Active Directory tokens. For details on the library and code samples, see [this article](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki).

## Call Digital Twins from a middle-tier web API

When developers architect Digital Twins solutions, they typically create a middle-tier application or API. The app or API then calls the Digital Twins API downstream. Users first authenticate to the mid-tier application, and then an on-behalf-of token flow is used to call downstream. For instructions about how to orchestrate the on-behalf-of flow, see [this page](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow). You also can view code samples on [this page](https://azure.microsoft.com/resources/samples/active-directory-dotnet-webapi-onbehalfof/).


## Test with the Postman client

To get up and running with the Digital Twins APIs, you can use a client such as Postman as an API environment. Postman helps you create complex HTTP requests quickly. The following steps show how to get an Azure AD token that's needed to call Digital Twins within the Postman UI.


1. Go to https://www.getpostman.com/ to download the app.
1. Follow the steps in [this quickstart](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad) to create an Azure AD application. Or you can reuse an existing registration. 
1. Under **Required permissions**, enter “Azure Digital Twins” and select **Delegated Permissions**. Then select **Grant Permissions**.
1. Open the application manifest, and set **oauth2AllowImplicitFlow** to true.
1. Configure a reply URL to [https://www.getpostman.com/oauth2/callback](https://www.getpostman.com/oauth2/callback).
1. Select the **Authorization** tab, select **OAuth 2.0**, and then select **Get New Access Token**.

    |**Field**  |**Value** |
    |---------|---------|
    | Grant type | Implicit |
    | Callback URL | [https://www.getpostman.com/oauth2/callback](https://www.getpostman.com/oauth2/callback) |
    | Auth URL | https://login.microsoftonline.com/<Your Azure AD Tenant e.g. Contoso>.onmicrosoft.com/oauth2/authorize?resource=0b07f429-9f4b-4714-9392-cc5e8e80c8b0 |
    | Client ID | Use the application ID for the Azure AD app that was created or repurposed from Step 2. |
    | Scope | Leave blank. |
    | State | Leave blank. |
    | Client authentication | Send as a Basic Auth header. |

1. Select **Request Token**.

    >[!NOTE]
    >If you receive the error message "OAuth 2 couldn’t be completed," try the following:
    > * Close Postman, and reopen it and try again.
   
1. Scroll down, and select **Use Token**.

## Next steps

To learn about Azure Digital Twins security, read [Create and manage role assignments](./security-create-manage-role-assignments.md).
