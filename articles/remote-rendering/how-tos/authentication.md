---
title: Authentication
description: Explains how authentication works
author: florianborn71
ms.author: flborn
ms.date: 06/15/2020
ms.topic: how-to
---

# Configure authentication

Azure Remote Rendering uses the same authentication mechanism as [Azure Spatial Anchors (ASA)](https://docs.microsoft.com/azure/spatial-anchors/concepts/authentication?tabs=csharp). Clients need to set *one* of the following to call the REST APIs successfully:

* **AccountKey**: can be obtained in the "Keys" tab for the Remote Rendering account on the Azure portal. Account Keys are only recommend for development/prototyping.
    ![Account ID](./media/azure-account-primary-key.png)

* **AuthenticationToken**: is an Azure AD token, which can be obtained by using the [MSAL library](https://docs.microsoft.com/azure/active-directory/develop/msal-overview). There are multiple different flows available to accept user credentials and use those credentials to obtain an access token.

* **MRAccessToken**: is an MR token, which can be obtained from Azure Mixed Reality Security Token Service (STS). Retrieved from the `https://sts.mixedreality.azure.com` endpoint using a REST call similar to the below call:

    ```rest
    GET https://sts.mixedreality.azure.com/Accounts/35d830cb-f062-4062-9792-d6316039df56/token HTTP/1.1
    Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1Ni<truncated>FL8Hq5aaOqZQnJr1koaQ
    Host: sts.mixedreality.azure.com
    Connection: Keep-Alive

    HTTP/1.1 200 OK
    Date: Tue, 24 Mar 2020 09:09:00 GMT
    Content-Type: application/json; charset=utf-8
    Content-Length: 1153
    Accept: application/json
    MS-CV: 05JLqWeKFkWpbdY944yl7A.0
    {"AccessToken":"eyJhbGciOiJSUzI1<truncated>uLkO2FvA"}
    ```

    Where the Authorization header is formatted as follows: `Bearer <Azure_AD_token>` or `Bearer <accoundId>:<accountKey>`. The former is preferable for security. The token returned from this REST call is the MR access token.

## Authentication for deployed applications

Account keys are recommended for quick prototyping, during development only. It's recommended not to ship your application to production using an embedded account key in it. The recommended approach is to use a user-based or service-based Azure AD authentication approach.

 Azure AD authentication is described in the [Azure AD user authentication](https://docs.microsoft.com/azure/spatial-anchors/concepts/authentication?tabs=csharp#azure-ad-user-authentication) section of the [Azure Spatial Anchors (ASA)](https://docs.microsoft.com/azure/spatial-anchors/) service.

 For more information, see the [Tutorial: Securing Azure Remote Rendering and model storage - Azure Active Directory authentication](../tutorials/unity/security/security.md#azure-active-directory-azure-ad-authentication)

## Role-based access control

To help control the level of access granted your service, use the following roles when granting role-based access:

* **Remote Rendering Administrator**: Provides user with conversion, manage session, rendering, and diagnostics capabilities for Azure Remote Rendering.
* **Remote Rendering Client**: Provides user with manage session, rendering, and diagnostics capabilities for Azure Remote Rendering.

## Next steps

* [Create an account](create-an-account.md)
* [Using the Azure Frontend APIs for authentication](frontend-apis.md)
* [Example PowerShell scripts](../samples/powershell-example-scripts.md)
