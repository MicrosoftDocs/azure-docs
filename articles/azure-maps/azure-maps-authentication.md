---
title: Authentication with Azure Maps | Microsoft Docs
description: Authentication for using Azure Maps services.
author: walsehgal
ms.author: v-musehg
ms.date: 02/12/2019
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: mvc
---

# Authentication with Azure Maps

Azure Maps supports two ways to authenticate requests. Shared Key or Azure Active Directory (Azure AD) offer distinct methods to authorize each request sent to Azure Maps. The purpose of this article is to explain both authentication methods to help guide your authentication implementation.

## Shared Key Authentication

Shared Key authentication relies on passing Azure Maps account generated keys with each request to Azure Maps.  Two keys are generated when your Azure Maps account is created.  Each request to Azure Maps services requires the subscription key to be added as a parameter to the URL.

> [!Tip]
> We recommend regenerating your keys regularly. You are provided two keys so that you can maintain connections using one key while regenerating the other. When you regenerate your keys, you must update any applications that access this account to use the new keys.

To view your keys, see [Authentication Details](https://aka.ms/amauthdetails).

## Authentication with Azure Active Directory (Preview)

Azure Maps now offers [Azure Active Directory (Azure AD)](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis) integration for authentication of requests for Azure Maps services.  Azure AD provides identify-based authentication including [role-based access control (RBAC)](https://docs.microsoft.com/azure/role-based-access-control/overview) to grant user or application level access to Azure Maps resources. The purpose of this article is to help you understand the concepts and components of Azure Maps Azure AD integration.

## Authentication with OAuth access tokens

Azure Maps accepts **OAuth 2.0** access tokens for Azure AD tenants associated with Azure subscription that contains an Azure Maps account.  Azure Maps accepts tokens for:

* Azure AD Users 
* Third party applications using permissions delegated by users
* Managed identities for Azure resources

Azure Maps generates a `unique identifier (client ID)` for each Azure Maps account.  When client ID is combined with additional parameters, tokens can be requested from Azure AD by specifying the value below:

```
https://login.microsoftonline.com
```
For more information on how to configure Azure AD and request tokens for Azure Maps, see [How To Manage Authentication](https://review.docs.microsoft.com/azure/azure-maps/how-to-manage-authentication).

For general information on requesting tokens from Azure AD, see [Authentication Basics in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/authentication-scenarios).

## Requesting Azure Map resources with OAuth tokens

Once a token is acquired from Azure AD, a request can be sent to Azure Maps with the following two required request headers set:

| Request Header    |    Value    |
|:------------------|:------------|
| x-ms-client-id    | 30d7cc….9f55|
| Authorization     | Bearer eyJ0e….HNIVN |

> [!Note]
> `x-ms-client-id` is the Azure Maps account based GUID displayed on Azure Maps authentication page

Below is Azure Maps route request example using OAuth token:

```
GET /route/directions/json?api-version=1.0&query=52.50931,13.42936:52.50274,13.43872 
Host: atlas.microsoft.com 
x-ms-client-id: 30d7cc….9f55 
Authorization: Bearer eyJ0e….HNIVN 
```

To view your client ID, see [Authentication Details](https://aka.ms/amauthdetails).

## Control access with Role-Based Access Control (RBAC)

A key feature of Azure AD is controlling access to secured resources via RBAC. Once your Azure Maps account is created and you register Azure Maps Azure AD application within your Azure AD tenant, you are now able to configure RBAC for a user, application, or Azure resource within Azure Map account portal page. 

Azure Maps currently supports read access control for individual Azure AD users, applications, or Azure services via Managed identities for Azure Resources.

![concept](./media/azure-maps-authentication/concept.png)

To view your RBAC settings, see [How To configure RBAC for Azure Maps](https://aka.ms/amrbac).

## Managed identities for Azure Resources and Azure Maps

[Managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) provide Azure services (Azure App service, Azure Functions, Virtual Machines, etc.) with an automatically managed identity that can be authorized for access to Azure Maps services.  

## Next steps

* To learn more about authenticating an application with Azure AD and Azure Maps, see [How To Manage Authentication](https://review.docs.microsoft.com/azure/azure-maps/how-to-manage-authentication).

* To learn more about authenticating the Azure Maps, Map Control and Azure AD, see [Azure AD and Azure Maps Map Control](https://aka.ms/amaadmc).