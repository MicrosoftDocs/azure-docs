---
title: Authentication
description: Explains how authentication works
author: florianborn71
ms.author: flborn
ms.date: 02/12/2019
ms.topic: how-to
ms.custom: has-adal-ref
---

# Configure authentication

Azure Remote Rendering uses the same authentication mechanism as [Azure Spatial Anchors (ASA)](https://docs.microsoft.com/azure/spatial-anchors/concepts/authentication?tabs=csharp). Clients need to set *AccountKey*, *AuthenticationToken*, or *AccessToken* to call the REST APIs successfully. *AccountKey* can be obtained in the "Keys" tab for the Remote Rendering account on the Azure portal. *AuthenticationToken* is an Azure AD token, which can be obtained by using the [ADAL library](https://docs.microsoft.com/azure/active-directory/develop/active-directory-authentication-libraries). *AccessToken* is an MR token, which can be obtained from Azure Mixed Reality Security Token Service (STS).

## Authentication for deployed applications

 Use of account keys is recommended for quick on-boarding, but during development/prototyping only. It is strongly recommended not to ship your application to production using an embedded account key in it, and to instead use the user-based or service-based Azure AD authentication approaches.

 Azure AD authentication is described in the [Azure AD user authentication](https://docs.microsoft.com/azure/spatial-anchors/concepts/authentication?tabs=csharp#azure-ad-user-authentication) section of the [Azure Spatial Anchors (ASA)](https://docs.microsoft.com/azure/spatial-anchors/) service.

## Role-based access control

To help control the level of access granted to applications, services or Azure AD users of your service, the following roles have been created for you to assign as needed against your Azure Remote Rendering accounts:

* **Remote Rendering Administrator**: Provides user with conversion, manage session, rendering, and diagnostics capabilities for Azure Remote Rendering.
* **Remote Rendering Client**: Provides user with manage session, rendering, and diagnostics capabilities for Azure Remote Rendering.

## Next steps

* [Create an account](create-an-account.md)
* [Using the Azure Frontend APIs for authentication](frontend-apis.md)
* [Example PowerShell scripts](../samples/powershell-example-scripts.md)
