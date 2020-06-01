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
ms.date: 08/28/2019
ms.author: negoe
ms.reviewer: negoe,celested
ms.custom: aaddev,references_regions
---

# National clouds

National clouds are physically isolated instances of Azure. These regions of Azure are designed to make sure that data residency, sovereignty, and compliance requirements are honored within geographical boundaries.

Including the global cloud​, Azure Active Directory (Azure AD) is deployed in the following national clouds:  

- Azure Government
- Azure Germany
- Azure China 21Vianet

National clouds are unique and a separate environment from Azure global. It's important to be aware of key differences while developing your application for these environments. Differences include registering applications, acquiring tokens, and configuring endpoints.

## App registration endpoints

There's a separate Azure portal for each one of the national clouds. To integrate applications with the Microsoft identity platform in a national cloud, you're required to register your application separately in each Azure portal that's specific to the environment.

The following table lists the base URLs for the Azure AD endpoints used to register an application for each national cloud.

| National cloud | Azure AD portal endpoint |
|----------------|--------------------------|
| Azure AD for US Government | `https://portal.azure.us` |
| Azure AD Germany | `https://portal.microsoftazure.de` |
| Azure AD China operated by 21Vianet | `https://portal.azure.cn` |
| Azure AD (global service) |`https://portal.azure.com` |

## Azure AD authentication endpoints

All the national clouds authenticate users separately in each environment and have separate authentication endpoints.

The following table lists the base URLs for the Azure AD endpoints used to acquire tokens for each national cloud.

| National cloud | Azure AD authentication endpoint |
|----------------|-------------------------|
| Azure AD for US Government | `https://login.microsoftonline.us` |
| Azure AD Germany| `https://login.microsoftonline.de` |
| Azure AD China operated by 21Vianet | `https://login.chinacloudapi.cn` |
| Azure AD (global service)| `https://login.microsoftonline.com` |

You can form requests to the Azure AD authorization or token endpoints by using the appropriate region-specific base URL. For example, for Azure Germany:

  - Authorization common endpoint is `https://login.microsoftonline.de/common/oauth2/v2.0/authorize`.
  - Token common endpoint is `https://login.microsoftonline.de/common/oauth2/v2.0/token`.

For single-tenant applications, replace "common" in the previous URLs with your tenant ID or name. An example is `https://login.microsoftonline.de/contoso.com`.

## Microsoft Graph API

To learn how to call the Microsoft Graph APIs in a national cloud environment, go to [Microsoft Graph in national cloud deployments](https://developer.microsoft.com/graph/docs/concepts/deployments).

> [!IMPORTANT]
> Certain services and features that are in specific regions of the global service might not be available in all of the national clouds. To find out what services are available, go to [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia,china-non-regional,china-east,china-east-2,china-north,china-north-2,germany-non-regional,germany-central,germany-northeast).

To learn how to build an application by using the Microsoft identity platform, follow the [Microsoft Authentication Library (MSAL) tutorial](msal-national-cloud.md). Specifically, this app will sign in a user and get an access token to call the Microsoft Graph API.

## Next steps

Learn more about:

- [Azure Government](https://docs.microsoft.com/azure/azure-government/)
- [Azure China 21Vianet](https://docs.microsoft.com/azure/china/)
- [Azure Germany](https://docs.microsoft.com/azure/germany/)
- [Azure AD authentication basics](authentication-scenarios.md)
