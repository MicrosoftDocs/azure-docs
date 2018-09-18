---
title: Authentication in National Clouds 
description: App registration and Authentication endpoints for National Clouds
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.service: active-directory
ms.component: develop    
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/24/2018
ms.author: negoe
ms.reviewer: negoe,andret,Saeeda
ms.custom: aaddev
---

# National Clouds

National Clouds (aka Sovereign clouds) are physically isolated instances of Azure. These regions of Azure are designed to make sure that data residency, sovereignty, and compliance requirements are honored within geographical boundaries.

Including Global cloud​, Azure Active Directory is deployed in the following National clouds:  

- Azure US Government
- Azure Germany
- Azure China 21Vianet

# App registration endpoints

The following table lists the base URLs for the Azure Active Directory (Azure AD) endpoints used to register an application for each national cloud.

| National Cloud | Azure AD portal endpoint
| --- | --- |
| Azure AD for US Government | https://portal.azure.us
|Azure AD Germany | https://portal.azure.de
|Azure AD China operated by 21Vianet | https://portal.azure.cn
|Azure AD (global service)|https://portal.azure.com

# Azure AD authentication endpoints

The following table lists the base URLs for the Azure Active Directory (Azure AD) endpoints used to acquire tokens to call Microsoft Graph for each national cloud.

| National Cloud | Azure AD auth endpoint
| --- | --- |
| Azure AD for US Government |https://login.microsoftonline.us
|Azure AD Germany| https://login.microsoftonline.de
|Azure AD China operated by 21Vianet | https://login.chinacloudapi.cn
|Azure AD (global service)|https://login.microsoftonline.com

Requests to the Azure AD authorization or token endpoints can be formed using the appropriate region-specific base URL. For example, in case of Germany:

- Authorization common endpoint is https://login.microsoftonline.de/common/oauth2/authorize
- Token common endpoint is https://login.microsoftonline.de/common/oauth2/token. 

Replace 'common' in the above URLs to form a tenant-specific endpoint.
Use of these endpoints will depend upon the requirements of an app and the authentication flow to get the tokens.

[!NOTE]
> The [Azure AD v2.0 authorization](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-appmodel-v2-overview) and token endpoints are only available for the global service. It is not yet supported for national cloud deployments.

## Next steps

- Learn more about [Azure Government](https://docs.microsoft.com/en-us/azure/azure-government/)
- Learn more about [Azure China 21Vianet](https://docs.microsoft.com/en-us/azure/china/)
- Learn more about [Azure Germany](https://docs.microsoft.com/en-us/azure/germany/)
- Learn about the [Azure AD authentication basics](authentication-scenarios.md)
- Learn more about [Microsoft Graph deployment in national cloud](https://developer.microsoft.com/en-us/graph/docs/concepts/deployments)