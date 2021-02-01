---
title: Manage authentication
titleSuffix: Azure Maps
description: Become familiar with Azure Maps authentication. See which approach works best in which scenario. Learn how to use the portal to view authentication settings.
author: anastasia-ms
ms.author: v-stharr
ms.date: 06/12/2020
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Manage authentication in Azure Maps

After you create an Azure Maps account, a client ID and keys are created to support Azure Active Directory (Azure AD) authentication and Shared Key authentication.

## View authentication details

After you create an Azure Maps account, the primary and secondary keys are generated. We recommend that you use a primary key as a subscription key when you [use Shared Key authentication to call Azure Maps](./azure-maps-authentication.md#shared-key-authentication). You can use a secondary key in scenarios such as rolling key changes. For more information, see [Authentication in Azure Maps](./azure-maps-authentication.md).

You can view your authentication details in the Azure portal. There, in your account, on the **Settings** menu, select **Authentication**.

> [!div class="mx-imgBorder"]
> ![Authentication details](./media/how-to-manage-authentication/how-to-view-auth.png)

## Discover category and scenario

Depending on application needs there are specific pathways to securing the application. Azure AD defines categories to support a wide range of authentication flows. See [application categories](../active-directory/develop/authentication-flows-app-scenarios.md#application-categories) to understand which category the application fits.

> [!NOTE]
> Even if you use shared key authentication, understanding categories and scenarios helps you to secure the application.

## Determine authentication and authorization

The following table outlines common authentication and authorization scenarios in Azure Maps. The table provides a comparison of the types of protection each scenario offers.

> [!IMPORTANT]
> Microsoft recommends implementing Azure Active Directory (Azure AD) with Azure role-based access control (Azure RBAC) for production applications.

| Scenario                                                                                    | Authentication | Authorization | Development effort | Operational effort |
| ------------------------------------------------------------------------------------------- | -------------- | ------------- | ------------------ | ------------------ |
| [Trusted daemon / non-interactive client application](./how-to-secure-daemon-app.md)        | Shared Key     | N/A           | Medium             | High               |
| [Trusted daemon / non-interactive client application](./how-to-secure-daemon-app.md)        | Azure AD       | High          | Low                | Medium             |
| [Web single page application with interactive single-sign-on](./how-to-secure-spa-users.md) | Azure AD       | High          | Medium             | Medium             |
| [Web single page application with non-interactive sign-on](./how-to-secure-spa-app.md)      | Azure AD       | High          | Medium             | Medium             |
| [Web application with interactive single-sign-on](./how-to-secure-webapp-users.md)          | Azure AD       | High          | High               | Medium             |
| [IoT device / input constrained device](./how-to-secure-device-code.md)                     | Azure AD       | High          | Medium             | Medium             |

The links in the table take you to detailed configuration information for each scenario.

## View role definitions

To view Azure roles that are available for Azure Maps, go to **Access control (IAM)**. Select **Roles**, and then search for roles that begin with *Azure Maps*. These Azure Maps roles are the roles that you can grant access to.

> [!div class="mx-imgBorder"]
> ![View available roles](./media/how-to-manage-authentication/how-to-view-avail-roles.png)

## View role assignments

To view users and apps that have been granted access for Azure Maps, go to **Access Control (IAM)**. There, select **Role assignments**, and then filter by **Azure Maps**.

> [!div class="mx-imgBorder"]
> ![View users and apps that have been granted access](./media/how-to-manage-authentication/how-to-view-amrbac.png)

## Request tokens for Azure Maps

Request a token from the Azure AD token endpoint. In your Azure AD request, use the following details:

| Azure environment      | Azure AD token endpoint             | Azure resource ID              |
| ---------------------- | ----------------------------------- | ------------------------------ |
| Azure public cloud     | `https://login.microsoftonline.com` | `https://atlas.microsoft.com/` |
| Azure Government cloud | `https://login.microsoftonline.us`  | `https://atlas.microsoft.com/` |

For more information about requesting access tokens from Azure AD for users and service principals, see [Authentication scenarios for Azure AD](../active-directory/develop/authentication-vs-authorization.md) and view specific scenarios in the table of [Scenarios](./how-to-manage-authentication.md#determine-authentication-and-authorization).

## Next steps

For more information, see [Azure AD and Azure Maps Web SDK](./how-to-use-map-control.md).

Find the API usage metrics for your Azure Maps account:
> [!div class="nextstepaction"]
> [View usage metrics](how-to-view-api-usage.md)

Explore samples that show how to integrate Azure AD with Azure Maps:

> [!div class="nextstepaction"]
> [Azure AD authentication samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples)