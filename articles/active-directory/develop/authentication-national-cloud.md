---
title: Azure AD authentication & national clouds
description: Learn about app registration and authentication endpoints for national clouds.
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 02/06/2023
ms.author: henrymbugua
ms.reviewer: negoe
ms.custom: aaddev,references_regions
---

# National clouds

National clouds are physically isolated instances of Azure. These regions of Azure are designed to make sure that data residency, sovereignty, and compliance requirements are honored within geographical boundaries.

Including the global Azure cloud, Azure Active Directory (Azure AD) is deployed in the following national clouds:

- Azure Government
- Microsoft Azure operated by 21Vianet
- Azure Germany ([Closed on October 29, 2021](https://www.microsoft.com/cloud-platform/germany-cloud-regions)). Learn more about [Azure Germany migration](#azure-germany-microsoft-cloud-deutschland).

The individual national clouds and the global Azure cloud are cloud _instances_. Each cloud instance is separate from the others and has its own environment and _endpoints_. Cloud-specific endpoints include OAuth 2.0 access token and OpenID Connect ID token request endpoints, and URLs for app management and deployment, like the Azure portal.

As you develop your apps, use the endpoints for the cloud instance where you'll deploy the application.

## App registration endpoints

There's a separate Azure portal for each one of the national clouds. To integrate applications with the Microsoft identity platform in a national cloud, you're required to register your application separately in each Azure portal that's specific to the environment.

The following table lists the base URLs for the Azure AD endpoints used to register an application for each national cloud.

| National cloud                          | Azure portal endpoint      |
| --------------------------------------- | -------------------------- |
| Azure portal for US Government          | `https://portal.azure.us`  |
| Azure portal China operated by 21Vianet | `https://portal.azure.cn`  |
| Azure portal (global service)           | `https://portal.azure.com` |

## Application endpoints

You can find the authentication endpoints for your application in the Azure portal.

1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
1. Select **Azure Active Directory**.
1. Under **Manage**, select **App registrations**, and then select **Endpoints** in the top menu.

   The **Endpoints** page is displayed showing the authentication endpoints for the application registered in your Azure AD tenant.

   Use the endpoint that matches the authentication protocol you're using in conjunction with the **Application (client) ID** to craft the authentication request specific to your application.

## Azure AD authentication endpoints

All the national clouds authenticate users separately in each environment and have separate authentication endpoints.

The following table lists the base URLs for the Azure AD endpoints used to acquire tokens for each national cloud.

| National cloud                      | Azure AD authentication endpoint           |
| ----------------------------------- | ------------------------------------------ |
| Azure AD for US Government          | `https://login.microsoftonline.us`         |
| Azure AD China operated by 21Vianet | `https://login.partner.microsoftonline.cn` |
| Azure AD (global service)           | `https://login.microsoftonline.com`        |

You can form requests to the Azure AD authorization or token endpoints by using the appropriate region-specific base URL. For example, for global Azure:

- Authorization common endpoint is `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`.
- Token common endpoint is `https://login.microsoftonline.com/common/oauth2/v2.0/token`.

For single-tenant applications, replace "common" in the previous URLs with your tenant ID or name. An example is `https://login.microsoftonline.com/contoso.com`.

## Azure Germany (Microsoft Cloud Deutschland)

If you haven't migrated your application from Azure Germany, follow [Azure Active Directory information for the migration from Azure Germany](/microsoft-365/enterprise/ms-cloud-germany-transition-azure-ad) to get started.

## Microsoft Graph API

To learn how to call the Microsoft Graph APIs in a national cloud environment, go to [Microsoft Graph in national cloud deployments](/graph/deployments).

Some services and features in the global Azure cloud might be unavailable in other cloud instances like the national clouds.

To find out which services and features are available in a given cloud instance, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia,china-non-regional,china-east,china-east-2,china-north,china-north-2,germany-non-regional,germany-central,germany-northeast).

To learn how to build an application by using the Microsoft identity platform, follow the [Single-page application (SPA) using auth code flow tutorial](tutorial-v2-angular-auth-code.md). Specifically, this app will sign in a user and get an access token to call the Microsoft Graph API.

## Next steps

Learn how to use the [Microsoft Authentication Library (MSAL) in a national cloud environment](msal-national-cloud.md).

National cloud documentation:

- [Azure Government](../../azure-government/index.yml)
- [Microsoft Azure operated by 21Vianet](/azure/china/)
- [Azure Germany (Closed on October 29, 2021)](../../germany/index.yml)
