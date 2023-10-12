---
title: Authentication
description: Explains how authentication works
author: florianborn71
ms.author: flborn
ms.date: 06/15/2020
ms.topic: how-to
---

# Configure authentication

Azure Remote Rendering uses the same authentication mechanism as [Azure Spatial Anchors (ASA)](../../spatial-anchors/concepts/authentication.md?tabs=csharp). To access a given Azure Remote Rendering account, clients need to obtain an access token from Azure Mixed Reality Security Token Service (STS). Tokens obtained from STS have a lifetime of 24 hours. Clients need to set *one* of the following to call the REST APIs successfully:

* **AccountKey**: can be obtained in the "Keys" tab for the Remote Rendering account on the Azure portal. Account Keys are only recommended for development/prototyping.
    ![Account ID](./media/azure-account-primary-key.png)

* **AccountDomain**: can be obtained in the "Overview" tab for the Remote Rendering account on the Azure portal.
    ![Account Domain](./media/azure-account-domain.png)

* **AuthenticationToken**: is a Microsoft Entra token, which can be obtained by using the [MSAL library](../../active-directory/develop/msal-overview.md). There are multiple different flows available to accept user credentials and use those credentials to obtain an access token.

* **MRAccessToken**: is an MR token, which can be obtained from Azure Mixed Reality Security Token Service (STS). Retrieved from the `https://sts.<accountDomain>` endpoint using a REST call similar to the below:

    ```rest
    GET https://sts.southcentralus.mixedreality.azure.com/Accounts/35d830cb-f062-4062-9792-d6316039df56/token HTTP/1.1
    Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1Ni<truncated>FL8Hq5aaOqZQnJr1koaQ
    Host: sts.southcentralus.mixedreality.azure.com
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

Account keys are recommended for quick prototyping, during development only. It's recommended not to ship your application to production using an embedded account key in it. The recommended approach is to use a user-based or service-based Microsoft Entra authentication approach.

<a name='azure-ad-user-authentication'></a>

### Microsoft Entra user authentication

Microsoft Entra authentication is described in the [Azure Spatial Anchors documentation](../../spatial-anchors/concepts/authentication.md?tabs=csharp#azure-ad-user-authentication).

Follow the steps to configure Microsoft Entra user authentication in the Azure portal.

1. Register your application in Microsoft Entra ID. As part of registering, you will need to determine whether your application should be multitenant. You will also need to provide the redirect URLs allowed for your application in the Authentication blade.
:::image type="content" source="./media/azure-active-directory-app-setup.png" alt-text="Authentication setup":::

1. In the API permissions tab, request **Delegated Permissions** for **mixedreality.signin** scope under **mixedreality**.
:::image type="content" source="./media/azure-active-directory-app-api-permissions.png" alt-text="Api permissions":::

1. Grant admin consent in the Security -> Permissions tab.
:::image type="content" source="./media/azure-active-directory-grant-admin-consent.png" alt-text="Admin consent":::

1. Then, navigate to your Azure Remote Rendering Resource. In the Access Control panel grant desired [roles](#azure-role-based-access-control) for your applications and user, on behalf of which you want to use delegated access permissions to your Azure Remote Rendering resource.
:::image type="content" source="./media/azure-remote-rendering-add-role-assignment.png" alt-text="Add permissions":::
:::image type="content" source="./media/azure-remote-rendering-role-assignments.png" alt-text="Role assignments":::

For information on using Microsoft Entra user authentication in your application code, see the [Tutorial: Securing Azure Remote Rendering and model storage - Microsoft Entra authentication](../tutorials/unity/security/security.md#azure-active-directory-azure-ad-authentication)

## Azure role-based access control

To help control the level of access granted your service, use the following roles when granting role-based access:

* **Remote Rendering Administrator**: Provides user with conversion, manage session, rendering, and diagnostics capabilities for Azure Remote Rendering.
* **Remote Rendering Client**: Provides user with manage session, rendering, and diagnostics capabilities for Azure Remote Rendering.

## Next steps

* [Create an account](create-an-account.md)
* [Using the Azure Frontend APIs for authentication](frontend-apis.md)
* [Example PowerShell scripts](../samples/powershell-example-scripts.md)
