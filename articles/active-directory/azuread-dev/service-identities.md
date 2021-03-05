---
title: The relationships between service accounts, service principals and managed identities  | Azure 
description: Learn about the relationship between service accounts, app registrations, service principals and managed identities
services: active-directory
documentationcenter: dev-center-name
author: CelesteDG
manager: mtillman
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/04/2021
ms.author: celested
ms.reviewer: lenalepa
ms.custom: aaddev
#Customer intent: As an application developer, I want to understand about the Microsoft identity platform so I can decide which endpoint and platform best meets my needs.
ms.collection: M365-identity-device-management
---

# The relationships between service accounts, service principals and managed identities

Cloud applications, services, and automation tools often need an account to gain access to Azure resources. In Azure, we call these accounts "service principals". Service principals are created in your Azure Active Directory tenant.

If your service runs on Azure, you can use a managed identity. A managed identity is service principal whose credentials are secured and managed automatically.

To create a service principal without automated credentials, create an App registration in Azure Active Directory. You might choose this option if your service does not run on Azure. 

## Managed identities
On Azure, managed identities eliminate the need for developers having to manage credentials by providing an identity for the Azure resource in Azure AD and using it to obtain Azure AD tokens. This also helps accessing Azure Key Vault where developers can store credentials in a secure manner. Managed identities for Azure resources solves this problem by providing Azure services with an automatically managed identity in Azure AD.

There are two types of managed identities:

* System-assigned Some Azure services allow you to enable a managed identity directly on a service instance. When you enable a system-assigned managed identity an identity is created in Azure AD that is tied to the lifecycle of that service instance. So when the resource is deleted, Azure automatically deletes the identity for you. By design, only that Azure resource can use this identity to request tokens from Azure AD.

* User-assigned You may also create a managed identity as a standalone Azure resource. You can create a user-assigned managed identity and assign it to one or more instances of an Azure service. In the case of user-assigned managed identities, the identity is managed separately from the resources that use it.

Learn more:

* [Services that support managed identities for Azure resources](active-directory-authentication-libraries.md) 
* Assign a managed identity access to another Azure resource
    * [Portal](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/howto-assign-access-portal) 
    * [CLI](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/howto-assign-access-cli) 
    * [PowerShell](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/howto-assign-access-powershell) 

## App registrations and service principals

To access Azure resources outside of Azure (from other cloud providers), an app registration with a corresponding service principal is required. 

Learn more:
* [Application and service principal objects in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals) 
* [Use the portal to create an Azure AD application and service principal that can access resources](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal) 
* [Create an Azure service principal with the Azure CLI](https://docs.microsoft.com/cli/azure/create-an-azure-service-principal-azure-cli)
