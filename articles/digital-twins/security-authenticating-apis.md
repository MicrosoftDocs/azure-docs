---
title: Understanding Azure Digital Twins API authentication | Microsoft Docs
description: Using Azure Digital Twins to connect and authenticate to APIs
author: adamgerard
manager: alinast
ms.service: azure-digital-twins
services: azure-digital-twins
ms.topic: conceptual
ms.date: 09/20/2018
ms.author: adgera
---

# Connect and Authenticate to APIs Using Azure Digital Twins

Digital Twins uses Azure Active Directory to authenticate users and protect applications.

If you're unfamiliar with Azure Active Directory, [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/azure-ad-developers-guide). The Windows Azure Authentication Library offers many ways to acquire Active Directory tokens. For a deep-dive into ADAL view the documentation [here](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki). This article gives an overview of two scenarios: A production scenario involving a middle-tier API, and authentication in the client application Postman for quick start-up and testing.

Digital Twins solutions developers may choose to create a client application or middle-tier API that will send requests to Digital Twins. Users would first authenticate to the client app, and then an on-behalf-of token flow would be used when calling the downstream API.

1. Create or make use of an existing AAD Application. View the documentation [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad).
1. Specify the Sign-on and Redirect Uris if needed.
1. In the application manifest set oauth2AllowImplicitFlow to true.
1. In Required Permissions add Digital Twins by searching “Azure Smart Spaces Service.” Select Delegated Permissions Read/Write Access and click the Grant Permissions button.

For detailed instructions on how to orchestrate the on-behalf-of flow visit [this page](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow) and you can view code samples [here](https://azure.microsoft.com/en-us/resources/samples/active-directory-dotnet-webapi-onbehalfof/).

## Test with the Postman Client

1. Follow the initial steps above to create (or re-purpose an existing) AAD Application, set oauth2AllowImplicitFlow to true in the app manifest, and grant permissions to “Azure Smart Spaces Service.”
1. Set a reply url to [https://www.getpostman.com/oauth2/callback](https://www.getpostman.com/oauth2/callback).
1. In postman select the Authorization Tab, click on OAuth 2.0 and select Get New Access Token.

    |**Field**  |**Value** |
    |---------|---------|
    | Grant Type | Implicit |
    | Callback URL | [https://www.getpostman.com/oauth2/callback](https://www.getpostman.com/oauth2/callback) |
    | Auth URL | [https://login.microsoftonline.com/microsoft.onmicrosoft.com/oauth2/authorize?resource=0b07f429-9f4b-4714-9392-cc5e8e80c8b0](https://login.microsoftonline.com/microsoft.onmicrosoft.com/oauth2/authorize?resource=0b07f429-9f4b-4714-9392-cc5e8e80c8b0)
    | Client Id | Use the Application Id for the AAD App that was created or re-purposed from Step 1 |
    | Scope | leave blank |
    | State | leave blank |
    | Client Authentication | Send as Basic Auth header |

1. Press Request Token. Note: If you receive error message OAuth 2 couldn’t be completed Try one of the following:
    1. Close Postman and reopen it and try again.
    1. Delete the secret key in your App, recreate a new one and renter the value in the above form.
1. Scroll down and click Use token
