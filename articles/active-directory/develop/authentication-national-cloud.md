---
title:  Authentication using Azure AD in national clouds 
description: Learn about app registration and authentication endpoints for national clouds.
services: active-directory
documentationcenter: ''
author: negoe
manager: mtillman
editor: ''

ms.service: active-directory
ms.subservice: develop    
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/20/2018
ms.author: negoe
ms.reviewer: negoe,andret,saeeda,CelesteDG
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# National Clouds

National clouds (aka Sovereign clouds) are physically isolated instances of Azure. These regions of Azure are designed to make sure that data residency, sovereignty, and compliance requirements are honored within geographical boundaries.

Including global cloud​, Azure Active Directory is deployed in the following National clouds:  

- Azure US Government
- Azure Germany
- Azure China 21Vianet

National clouds are unique and different environment than Azure global. Therefore, it is important to be aware of some key differences while developing your application for these environments such as registering applications, acquiring tokens, and configuring endpoints.

## App registration endpoints

There is a separate Azure portal for each one of the national clouds. To integrate applications with the Microsoft Identity Platform in a national cloud, you are required to register your application separately in each of the Azure portal specific to the environment.

The following table lists the base URLs for the Azure Active Directory (Azure AD) endpoints used to register an application for each national cloud.

| National cloud | Azure AD portal endpoint
| --- | --- |
| Azure AD for US Government |`https://portal.azure.us`
|Azure AD Germany |`https://portal.microsoftazure.de`
|Azure AD China operated by 21Vianet |`https://portal.azure.cn`
|Azure AD (global service)|`https://portal.azure.com` 

## Azure AD authentication endpoints

All the national clouds authenticate users separately in each environment and have separate authentication endpoints.

The following table lists the base URLs for the Azure Active Directory (Azure AD) endpoints used to acquire tokens for each national cloud.

| National cloud | Azure AD auth endpoint
| --- | --- |
| Azure AD for US Government |`https://login.microsoftonline.us`
|Azure AD Germany| `https://login.microsoftonline.de`
|Azure AD China operated by 21Vianet | `https://login.chinacloudapi.cn`
|Azure AD (global service)|`https://login.microsoftonline.com`

- Requests to the Azure AD authorization or token endpoints can be formed using the appropriate region-specific base URL. For example, for Azure Germany:

  - Authorization common endpoint is `https://login.microsoftonline.de/common/oauth2/authorize`.
  - Token common endpoint is `https://login.microsoftonline.de/common/oauth2/token`.

- For single-tenant applications, replace common in the previous URLs with your tenant ID or name, for example, `https://login.microsoftonline.de/contoso.com`.

>[!NOTE]
> The [Azure AD v2.0 authorization]( https://docs.microsoft.com/azure/active-directory/develop/active-directory-appmodel-v2-overview) and token endpoints are only available for the global service. It is not yet supported for national cloud deployments.

## Microsoft Graph API

To learn how to call the Microsoft Graph APIs in National Cloud environment go to [Microsoft Graph in national cloud](https://developer.microsoft.com/graph/docs/concepts/deployments).

> [!IMPORTANT]
> Certain services and features that are in specific regions of the global service might not be available in all of the National clouds. To find out what services are available go to [products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia,china-non-regional,china-east,china-east-2,china-north,china-north-2,germany-non-regional,germany-central,germany-northeast).

Follow this Microsoft Authentication Library (MSAL) [tutorial](msal-national-cloud.md) to learn how to build an application using Microsoft identity platform. Specifically, this app will sign in a user, get an access token to call the Microsoft Graph API.

## Next steps

### Learn more about 
- [Azure Government](https://docs.microsoft.com/azure/azure-government/).
- [Azure China 21Vianet](https://docs.microsoft.com/azure/china/).
- [Azure Germany](https://docs.microsoft.com/azure/germany/).
- [Azure AD authentication basics](authentication-scenarios.md).
