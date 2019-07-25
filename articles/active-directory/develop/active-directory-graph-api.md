---
title: Azure Active Directory Graph API | Microsoft Docs
description: An overview and quickstart guide for Azure AD Graph API, which allows programmatic access to Azure AD through REST API endpoints.
services: active-directory
documentationcenter: ''
author: rwike77
manager: CelesteDG

ms.assetid: 5471ad74-20b3-44df-a2b5-43cde2c0a045
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/01/2019
ms.author: ryanwi
ms.reviewer: dkershaw, sureshja
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# Azure Active Directory Graph API

> [!IMPORTANT]
>
> As of February 2019, we started the process to deprecate some earlier versions of Azure Active Directory Graph API in favor of the Microsoft Graph API. 
>
> For details, updates, and time frames, see [Microsoft Graph or the Azure AD Graph](https://dev.office.com/blogs/microsoft-graph-or-azure-ad-graph) in the Office Dev Center.
>
> Moving forward, applications should use the Microsoft Graph API. 



This article applies to Azure AD Graph API. For similar info related to Microsoft Graph API, see [Use the Microsoft Graph API](https://docs.microsoft.com/graph/use-the-api). 

The Azure Active Directory Graph API provides programmatic access to Azure AD through REST API endpoints. Applications can use Azure AD Graph API to perform create, read, update, and delete (CRUD) operations on directory data and objects. For example, Azure AD Graph API supports the following common operations for a user object:

* Create a new user in a directory
* Get a user’s detailed properties, such as their groups
* Update a user’s properties, such as their location and phone number, or change their password
* Check a user’s group membership for role-based access
* Disable a user’s account or delete it entirely

Additionally, you can perform similar operations on other objects such as groups and applications. To call Azure AD Graph API on a directory, your application must be registered with Azure AD. Your application must also be granted access to Azure AD Graph API. This access is normally achieved through a user or admin consent flow.

To begin using the Azure Active Directory Graph API, see the [Azure AD Graph API quickstart guide](active-directory-graph-api-quickstart.md), or view the [interactive Azure AD Graph API reference documentation](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/api-catalog).

## Features

Azure AD Graph API provides the following features:

* **REST API Endpoints**: Azure AD Graph API is a RESTful service comprised of endpoints that are accessed using standard HTTP requests. Azure AD Graph API supports XML or Javascript Object Notation (JSON) content types for requests and responses. For more information, see [Azure AD Graph REST API reference](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/api-catalog).
* **Authentication with Azure AD**: Every request to Azure AD Graph API must be authenticated by appending a JSON Web Token (JWT) in the Authorization header of the request. This token is acquired by making a request to Azure AD’s token endpoint and providing valid credentials. You can use the OAuth 2.0 client credentials flow or the authorization code grant flow to acquire a token to call the Graph. For more information, [OAuth 2.0 in Azure AD](https://msdn.microsoft.com/library/azure/dn645545.aspx).
* **Role-Based Authorization (RBAC)**: Security groups are used to perform RBAC in Azure AD Graph API. For example, if you want to determine whether a user has access to a specific resource, the application can call the [Check group membership (transitive)](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/functions-and-actions#checkMemberGroups) operation, which returns true or false.
* **Differential Query**: Differential query allows you to track changes in a directory between two time periods without having to make frequent queries to Azure AD Graph API. This type of request will return only the changes made between the previous differential query request and the current request. For more information, see [Azure AD Graph API differential query](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-differential-query).
* **Directory Extensions**: You can add custom properties to directory objects without requiring an external data store. For example, if your application requires a Skype ID property for each user, you can register the new property in the directory and it will be available for use on every user object. For more information, see [Azure AD Graph API directory schema extensions](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-directory-schema-extensions).
* **Secured by permission scopes**: Azure AD Graph API exposes permission scopes that enable secure access to Azure AD data using OAuth 2.0. It supports a variety of client app types, including:
  
  * user interfaces that are given delegated access to data via authorization from the signed-in user (delegated)
  * service/daemon applications that operate in the background without a signed-in user being present and use application-defined role-based access control
    
    Both delegated and application permissions represent a privilege exposed by the Azure AD Graph API and can be requested by client applications through application registration permissions features in the [Azure portal](https://portal.azure.com). [Azure AD Graph API permission scopes](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-permission-scopes) provides information on what's available for use by your client application.

## Scenarios

Azure AD Graph API enables many application scenarios. The following scenarios are the most common:

* **Line of Business (Single Tenant) Application**: In this scenario, an enterprise developer works for an organization that has an Office 365 subscription. The developer is building a web application that interacts with Azure AD to perform tasks such as assigning a license to a user. This task requires access to the Azure AD Graph API, so the developer registers the single tenant application in Azure AD and configures read and write permissions for Azure AD Graph API. Then the application is configured to use either its own credentials or those of the currently sign-in user to acquire a token to call the Azure AD Graph API.
* **Software as a Service Application (Multi-Tenant)**: In this scenario, an independent software vendor (ISV) is developing a hosted multi-tenant web application that provides user management features for other organizations that use Azure AD. These features require access to directory objects, so the application needs to call the Azure AD Graph API. The developer registers the application in Azure AD, configures it to require read and write permissions for Azure AD Graph API, and then enables external access so that other organizations can consent to use the application in their directory. When a user in another organization authenticates to the application for the first time, they are shown a consent dialog with the permissions the application is requesting. Granting consent will then give the application those requested permissions to Azure AD Graph API in the user’s directory. For more information on the consent framework, see [Overview of the consent framework](consent-framework.md).

## Next steps

To begin using the Azure Active Directory Graph API, see the following topics:

* [Azure AD Graph API quickstart guide](active-directory-graph-api-quickstart.md)
* [Azure AD Graph REST documentation](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/api-catalog)
