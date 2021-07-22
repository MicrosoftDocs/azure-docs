---
title: Manage authentication in Microsoft Azure Maps
titleSuffix: Azure Maps
description: Become familiar with Azure Maps authentication. See which approach works best in which scenario. Learn how to use the portal to view authentication settings.
author: anastasia-ms
ms.author: v-stharr
ms.date: 06/10/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager:  philmea
custom.ms: subject-rbac-steps
---

# Manage authentication in Azure Maps

When you create an Azure Maps account, keys and a client ID are generated. The keys and client ID are used to support Azure Active Directory (Azure AD) authentication and Shared Key authentication.

## View authentication details

 >[!IMPORTANT]
 >We recommend that you use the primary key as the subscription key when you [use Shared Key authentication to call Azure Maps](./azure-maps-authentication.md#shared-key-authentication). It's best to use the secondary key in scenarios like rolling key changes. For more information, see [Authentication in Azure Maps](./azure-maps-authentication.md).

To view your Azure Maps authentication details:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Navigate to the Azure portal menu. Select **All resources**, and then select your Azure Maps account.

      :::image type="content" border="true" source="./media/how-to-manage-authentication/select-all-resources.png" alt-text="Select Azure Maps account.":::

3. Under **Settings** in the left pane, select **Authentication**.

      :::image type="content" border="true" source="./media/how-to-manage-authentication/view-authentication-keys.png" alt-text="Authentication details.":::

## Choose an authentication category

Depending on your application needs, there are specific pathways to application security. Azure AD defines specific authentication categories to support a wide range of authentication flows. To choose the best category for your application, see [application categories](../active-directory/develop/authentication-flows-app-scenarios.md#application-categories).

> [!NOTE]
> Even if you use shared key authentication, understanding categories and scenarios helps you to secure the application.

## Choose an authentication and authorization scenario

This table outlines common authentication and authorization scenarios in Azure Maps. Use the links to learn detailed configuration information for each scenario.

> [!IMPORTANT]
> For production applications, we recommend implementing Azure AD with Azure role-based access control (Azure RBAC).

| Scenario                                                                                    | Authentication | Authorization | Development effort | Operational effort |
| ------------------------------------------------------------------------------------------- | -------------- | ------------- | ------------------ | ------------------ |
| [Trusted daemon / non-interactive client application](./how-to-secure-daemon-app.md)        | Shared Key     | N/A           | Medium             | High               |
| [Trusted daemon / non-interactive client application](./how-to-secure-daemon-app.md)        | Azure AD       | High          | Low                | Medium             |
| [Web single page application with interactive single-sign-on](./how-to-secure-spa-users.md) | Azure AD       | High          | Medium             | Medium             |
| [Web single page application with non-interactive sign-on](./how-to-secure-spa-app.md)      | Azure AD       | High          | Medium             | Medium             |
| [Web application with interactive single-sign-on](./how-to-secure-webapp-users.md)          | Azure AD       | High          | High               | Medium             |
| [IoT device / input constrained device](./how-to-secure-device-code.md)                     | Azure AD       | High          | Medium             | Medium             |

## View built-in Azure Maps role definitions

To view the built-in Azure Maps role definition:

1. In the left pane, select **Access control (IAM)**.

2. Select the **Roles** tab.

3. In the search box, enter **Azure Maps**.

The results display the available built-in role definitions for Azure Maps.

:::image type="content" border="true" source="./media/how-to-manage-authentication/view-role-definitions.png" alt-text="View built-in Azure Maps role definitions.":::

## View role assignments

To view users and apps that have been granted access for Azure Maps, go to **Access Control (IAM)**. There, select **Role assignments**, and then filter by **Azure Maps**.

1. In the left pane, select **Access control (IAM)**.

2. Select the **Role assignments** tab.

3. In the search box, enter **Azure Maps**.

The results display the current Azure Maps role assignments.

:::image type="content" border="true" source="./media/how-to-manage-authentication/view-amrbac.png" alt-text="View built-in View users and apps that have been granted access.":::

## Request tokens for Azure Maps

Request a token from the Azure AD token endpoint. In your Azure AD request, use the following details:

| Azure environment      | Azure AD token endpoint             | Azure resource ID              |
| ---------------------- | ----------------------------------- | ------------------------------ |
| Azure public cloud     | `https://login.microsoftonline.com` | `https://atlas.microsoft.com/` |
| Azure Government cloud | `https://login.microsoftonline.us`  | `https://atlas.microsoft.com/` |

For more information about requesting access tokens from Azure AD for users and service principals, see [Authentication scenarios for Azure AD](../active-directory/develop/authentication-vs-authorization.md).  To view specific scenarios, see [the table of scenarios](./how-to-manage-authentication.md#choose-an-authentication-and-authorization-scenario).

## Manage and rotate shared keys

Your Azure Maps subscription keys are similar to a root password for your Azure Maps account. Always be careful to protect your subscription keys. Use Azure Key Vault to securely manage and rotate your keys. Avoid distributing access keys to other users, hard-coding them, or saving them anywhere in plain text that's accessible to others. If you believe that your keys may have been compromised, rotate them.

> [!NOTE]
> If possible, we recommend using Azure AD instead of Shared Key to authorize requests. Azure AD has better security than Shared Key, and it's easier to use.

### Manually rotate subscription keys

To help keep your Azure Maps account secure, we recommend periodically rotating your subscription keys. If possible, use Azure Key Vault to manage your access keys. If you aren't using Key Vault, you'll need to manually rotate your keys.

Two subscription keys are assigned so that you can rotate your keys. Having two keys ensures that your application maintains access to Azure Maps throughout the process.

To rotate your Azure Maps subscription keys in the Azure portal:

1. Update your application code to reference the secondary key for the Azure Maps account and deploy.
2. In the [Azure portal](https://portal.azure.com/), navigate to your Azure Maps account.
3. Under **Settings**, select **Authentication**.
4. To regenerate the primary key for your Azure Maps account, select the **Regenerate** button next to the primary key.
5. Update your application code to reference the new primary key and deploy.
6. Regenerate the secondary key in the same manner.

> [!WARNING]
> We recommend using only one of the keys in all of your applications at the same time. If you use Key 1 in some places and Key 2 in others, you won't be able to rotate your keys without some applications losing access.

## Next steps

Find the API usage metrics for your Azure Maps account:
> [!div class="nextstepaction"]
> [View usage metrics](how-to-view-api-usage.md)

Explore samples that show how to integrate Azure AD with Azure Maps:

> [!div class="nextstepaction"]
> [Azure AD authentication samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples)
