---
title: Understanding Azure Digital Twins API authentication | Microsoft Docs
description: Using Azure Digital Twins to connect and authenticate to APIs
author: lyrana
manager: alinast
ms.service: azure-digital-twins
services: azure-digital-twins
ms.topic: conceptual
ms.date: 09/28/2018
ms.author: lyrana
---

# Connect and authenticate to APIs

Azure Digital Twins uses Azure Active Directory (Azure AD) to authenticate users and protect applications.

If you're unfamiliar with Azure AD, more information is available in the [developer guide](https://docs.microsoft.com/azure/active-directory/develop/azure-ad-developers-guide). The Windows Azure Authentication Library offers many ways to acquire Active Directory tokens. For a deep-dive into the library, take a look [here](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki).

This article gives an overview of two scenarios: a production scenario with a middle-tier API, and authentication in the client application Postman for quick start-up and testing.

## Authentication in production

Solutions developers have two ways to connect to Digital Twins.  Solutions developers can connect to Azure Digital Twins in the following ways:

* They can create a client application or a middle-tier API. Client apps require users to authenticate and then use the [OAuth 2.0 On-Behalf-Of](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow) security flow to call a downstream API.
* Create or make use of an existing Azure AD Application. View the documentation [here](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad).
    1. Specify the **Sign-on and Redirect URIs** (if needed).
    1. In the application manifest set `oauth2AllowImplicitFlow` to true.
    1. In **Required Permissions**, add Digital Twins by searching “Azure Digital Twins.” Select **Delegated Permissions Read/Write Access** and click the **Grant Permissions** button.

For detailed instructions about how to orchestrate the on-behalf-of flow visit [this page](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow). You can also view code samples [here](https://azure.microsoft.com/resources/samples/active-directory-dotnet-webapi-onbehalfof/).

## Test with the Postman client

1. Follow the initial steps above to create (or modify) an Azure Active Directory application. Then, set `oauth2AllowImplicitFlow` to true in the app manifest and grant permissions to “Azure Digital Twins.”
1. Set a reply url to [https://www.getpostman.com/oauth2/callback](https://www.getpostman.com/oauth2/callback).
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
    >If you receive error message "OAuth 2 couldn’t be completed," try one of the following:
    > * Close Postman and reopen it and try again.
    > * Delete the secret key in your app, recreate a new one and renter the value in the above form.

1. Scroll down and click **Use Token**.

## Next steps

Read more about Azure Digital Twins security:

> [!div class="nextstepaction"]
> [Best practices for securing your instance] (./security-best-practices.md)
