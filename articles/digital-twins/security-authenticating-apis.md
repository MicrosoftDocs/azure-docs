---
title: Understanding Azure Digital Twins API authentication | Microsoft Docs
description: Using Azure Digital Twins to connect and authenticate to APIs
author: lyrana
manager: alinast
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/02/2018
ms.author: lyrana
---

# Connect and authenticate to APIs

Azure Digital Twins uses Azure Active Directory (Azure AD) to authenticate users and protect applications. Azure AD supports authentication for a variety of modern architectures, all of them based on industry-standard protocols OAuth 2.0 or OpenID Connect. In addition, Azure AD enables developers building both single-tenant, line-of-business (LOB) applications, as well as developers looking to develop multi-tenant applications.

For an overview of Azure AD visit the [fundamentals page](https://docs.microsoft.com/azure/active-directory/fundamentals/index) for step-by-step guides, concepts, and quick starts.

To integrate an application or service with Azure AD, a developer must first register the application with Azure AD. For detailed instructions and screen shots view the instructions [here](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-add-azure-ad-app)

These are the [five primary application scenarios](https://docs.microsoft.com/azure/active-directory/develop/v2-app-types) supported by Azure AD:

* Single-page application (SPA): A user needs to sign in to a single-page application that is secured by Azure AD.
* Web browser to web application: A user needs to sign in to a web application that is secured by Azure AD.
* Native application to web API: A native application that runs on a phone, tablet, or PC needs to authenticate a user to get resources from a web API that is secured by Azure AD.
* Web application to web API: A web application needs to get resources from a web API secured by Azure AD.
* Daemon or server application to web API: A daemon application or a server application with no web user interface needs to get resources from a web API secured by Azure AD.

The Windows Azure Authentication Library offers many ways to acquire Active Directory tokens. For a deep-dive into the library as well as code samples take a look [here](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki).

## Calling Digital Twins from a middle-tier web API

When architecting Digital Twins solutions developers commonly choose to create a middle-tier application or API that then calls the Digital Twins API downstream. Users would first authenticate to the mid-tier application, and then an on-behalf-of token flow would be used when calling downstream. For detailed instructions about how to orchestrate the on-behalf-of flow visit [this page](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow). You can also view code samples [here](https://azure.microsoft.com/resources/samples/active-directory-dotnet-webapi-onbehalfof/).


## Test with the Postman client

In order to get up and running with the Digital Twins APIs you can use a client such as Postman as an API environment. Postman helps you create complex HTTP requests quickly. The instructions below will focus on how to obtain an Azure AD token needed to call Digital Twins within the Postman UI.


1. Navigate to https://www.getpostman.com/ to download the app
1. Follow the steps [here](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad) to create an Azure Active Directory application (or you can choose to re-use an existing registration). 
1. Under Required permissions add “Azure Digital Twins,” and select Delegated Permissions. Don't forget to click Grant Permissions to finalize.
1. Configure a reply url to [https://www.getpostman.com/oauth2/callback](https://www.getpostman.com/oauth2/callback).
1. Select the **Authorization Tab**, click on **OAuth 2.0**, and select **Get New Access Token**.

    |**Field**  |**Value** |
    |---------|---------|
    | Grant Type | Implicit |
    | Callback URL | [https://www.getpostman.com/oauth2/callback](https://www.getpostman.com/oauth2/callback) |
    | Auth URL | [https://login.microsoftonline.com/microsoft.onmicrosoft.com/oauth2/authorize?resource=0b07f429-9f4b-4714-9392-cc5e8e80c8b0](https://login.microsoftonline.com/microsoft.onmicrosoft.com/oauth2/authorize?resource=0b07f429-9f4b-4714-9392-cc5e8e80c8b0)
    | Client Id | Use the Application Id for the Azure AD app that was created or repurposed from Step 1 |
    | Scope | leave blank |
    | State | leave blank |
    | Client Authentication | Send as Basic Auth header |

1. Click **Request Token**.

    >[!NOTE]
    >If you receive error message "OAuth 2 couldn’t be completed," try the following:
    > * Close Postman and reopen it and try again.
   
1. Scroll down and click **Use Token**.

## Next steps

To learn about Azure Digital Twins security, read [Create and manage role assignments](./security-create-manage-role-assignments.md).
