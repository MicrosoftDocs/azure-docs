---
title: Manage authentication | Microsoft Azure Maps 
description: Use the Azure portal to manage authentication in Microsoft Azure Maps.
author: philmea
ms.author: philmea
ms.date: 05/14/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Manage authentication in Azure Maps

After you create an Azure Maps account, a client ID and keys are created to support Azure Active Directory (Azure AD) authentication and Shared Key authentication.

## View authentication details

After you create an Azure Maps account, the primary and secondary keys are generated. We recommend that you use a primary key as a subscription key when you [use Shared Key authentication to call Azure Maps](https://docs.microsoft.com/azure/azure-maps/azure-maps-authentication#shared-key-authentication). You can use a secondary key in scenarios such as rolling key changes. For more information, see [Authentication in Azure Maps](https://aka.ms/amauth).

You can view your authentication details in the Azure portal. There, in your account, on the **Settings** menu, select **Authentication**.

![Authentication details](./media/how-to-manage-authentication/how-to-view-auth.png)

## Discover application category and scenario

Depending on application needs there are specific pathways to securing the application. Azure AD defines categories to support a wide range of authentication flows. See [application categories](https://docs.microsoft.com/azure/active-directory/develop/authentication-flows-app-scenarios#application-categories) to understand which category the application fits.

> [!NOTE]
> Even when preferring Shared Key authentication with Azure Maps, understanding categories and scenarios will help secure the application.

## Determine Authentication and Authorization

The following table is intended to provide a guide to common scenarios to configure authentication and authorization to Azure Maps. The table is a relative comparison of protection each scenario generally provides.

[!IMPORTANT]
> Microsoft recommends implementing Azure AD Role based access control for production applications.

### Scenarios

| Scenario                                                                                             | Authentication | Authorization | Level of protection | Development effort | Operational effort |
| ---------------------------------------------------------------------------------------------------- | -------------- | ------------- | ------------------- | ------------------ | ------------------ |
| [Trusted daemon / non-interactive client application](./how-to-secure-daemon-app.md)                 | Shared Key     | N/A           | Low                 | Medium             | High               |
| [Trusted daemon / non-interactive client application](./how-to-secure-daemon-app.md)                 | Azure AD       | High          | Medium              | Low                | Medium             |
| [Web single page application with interactive single-sign-on](./how-to-secure-spa-users.md)          | Azure AD       | High          | Medium              | Medium             | Medium             |
| [Web single page application with non-interactive sign-in](./how-to-secret-how-to-secure-spa-app.md) | Azure AD       | High          | Medium              | Medium             | Medium             |
| [Web application with interactive single-sign-on](./tbd)                                             | Azure AD       | High          | Medium              | High               | Medium             |
| [Public / Native client with interactive single-sign-on](./tbd)                                      | Azure AD       | High          | Medium              | High               | Medium             |

Click on specific scenarios in the table to discover how to configure applications.

## View available Azure Maps RBAC roles

To view RBAC roles that are available for Azure Maps, go to **Access control (IAM)**. Select **Roles**, and then search for roles that begin with *Azure Maps*. These Azure Maps roles are the roles that you can grant access to.

![View available roles](./media/how-to-manage-authentication/how-to-view-avail-roles.png)

## View Azure Maps RBAC

To view users and apps that have been granted RBAC for Azure Maps, go to **Access Control (IAM)**. There, select **Role assignments**, and then filter by **Azure Maps**.

![View users and apps that have been granted RBAC](./media/how-to-manage-authentication/how-to-view-amrbac.png)

## Request tokens for Azure Maps

Request a token from the Azure AD token endpoint. In your Azure AD request, use the following details:

| Azure environment      | Azure AD token endpoint             | Azure resource ID              |
| ---------------------- | ----------------------------------- | ------------------------------ |
| Azure public cloud     | `https://login.microsoftonline.com` | `https://atlas.microsoft.com/` |
| Azure government cloud | `https://login.microsoftonline.us`  | `https://atlas.microsoft.com/` |

For more information about requesting access tokens from Azure AD for users and service principals, see [Authentication scenarios for Azure AD](https://docs.microsoft.com/azure/active-directory/develop/authentication-scenarios) and view specific scenarios in the table of [Scenarios](./how-to-manage-authentication.md#Scenarios).

## Next steps

For more information, see [Azure AD and Azure Maps Web SDK](https://docs.microsoft.com/azure/azure-maps/how-to-use-map-control).

Find the API usage metrics for your Azure Maps account:
> [!div class="nextstepaction"]
> [View usage metrics](how-to-view-api-usage.md)

Explore samples that show how to integrate Azure AD with Azure Maps:

> [!div class="nextstepaction"]
> [Azure AD authentication samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples)
