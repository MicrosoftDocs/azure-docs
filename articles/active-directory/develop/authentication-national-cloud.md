---
title: Azure AD authentication & national clouds | Azure
titleSuffix: Microsoft identity platform
description: Learn about app registration and authentication endpoints for national clouds.
services: active-directory
author: negoe
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/21/2021
ms.author: negoe
ms.reviewer: marsma, negoe,celested
ms.custom: aaddev,references_regions
---

# National clouds

National clouds are physically isolated instances of Azure. These regions of Azure are designed to make sure that data residency, sovereignty, and compliance requirements are honored within geographical boundaries.

Including the global Azure cloud, Azure Active Directory (Azure AD) is deployed in the following national clouds:

- Azure Government
- Azure China 21Vianet
- Azure Germany ([Closing on October 29, 2021](https://www.microsoft.com/cloud-platform/germany-cloud-regions)). Learn more about [Azure Germany migration](#azure-germany-microsoft-cloud-deutschland).

Each cloud _instance_, the individual national clouds and the global Azure cloud, is a separate environment with its own endpoints. Cloud-specific endpoints include OAuth 2.0 access token and OpenID Connect ID token request endpoints, and URLs for app management and deployment, like the Azure portal.

As you develop your apps, use the endpoints for the cloud instance where you'll deploy the application.

## App registration endpoints

There's a separate Azure portal for each one of the national clouds. To integrate applications with the Microsoft identity platform in a national cloud, you're required to register your application separately in each Azure portal that's specific to the environment.

The following table lists the base URLs for the Azure AD endpoints used to register an application for each national cloud.

| National cloud                          | Azure portal endpoint      |
| --------------------------------------- | -------------------------- |
| Azure portal for US Government          | `https://portal.azure.us`  |
| Azure portal China operated by 21Vianet | `https://portal.azure.cn`  |
| Azure portal (global service)           | `https://portal.azure.com` |

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

> [!WARNING]
> Azure Germany (Microsoft Cloud Deutschland) will be [closed on October 29, 2021](https://www.microsoft.com/cloud-platform/germany-cloud-regions). Services and applications you choose _not_ to migrate to a region in global Azure before that date will become inaccessible.

If you haven't migrated your application from Azure Germany, follow [Azure Active Directory information for the migration from Azure Germany](/microsoft-365/enterprise/ms-cloud-germany-transition-azure-ad) to get started.

## Microsoft Graph API

To learn how to call the Microsoft Graph APIs in a national cloud environment, go to [Microsoft Graph in national cloud deployments](/graph/deployments).

> [!IMPORTANT]
> Certain services and features that are in specific regions of the global service might not be available in all of the national clouds. To find out what services are available, go to [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia,china-non-regional,china-east,china-east-2,china-north,china-north-2,germany-non-regional,germany-central,germany-northeast).

To learn how to build an application by using the Microsoft identity platform, follow the [Single-page application (SPA) using auth code flow tutorial](tutorial-v2-angular-auth-code.md). Specifically, this app will sign in a user and get an access token to call the Microsoft Graph API.

## Next steps

Learn how to use the [Microsoft Authentication Library (MSAL) in a national cloud environment](msal-national-cloud.md).

National cloud documentation:

- [Azure Government](../../azure-government/index.yml)
- [Azure China 21Vianet](/azure/china/)
- [Azure Germany (Closing on October 29, 2021)](../../germany/index.yml)
