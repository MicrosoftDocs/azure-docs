---
title: Azure Active Directory Application and Service Principal Objects | Microsoft Docs
description: A discussion of the relationship between application and service principal objects in Azure Active Directory
documentationcenter: dev-center-name
author: bryanla
manager: mbaldwin
services: active-directory
editor: ''

ms.assetid: adfc0569-dc91-48fe-92c3-b5b4833703de
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/28/2016
ms.author: bryanla;mbaldwin

---
# Application and service principal objects in Azure Active Directory (Azure AD)
Sometimes the meaning of the term "application" can be misunderstood when used in the context of Azure AD. The goal of this article is to make it clearer, by clarifying conceptual and concrete aspects of Azure AD application integration, with an illustration of registration and consent for a [multi-tenant application](active-directory-dev-glossary.md#multi-tenant-application).

## Overview
An application that has been integrated with Azure AD has implications that go beyond the software aspect. "Application" is frequently used as a conceptual term, referring to not only the the application software, but also its Azure AD registration and role in authentication/authorization "conversations" at runtime. By definition, an application can function in a [client](active-directory-dev-glossary.md#client-application) role (consuming a resource), a [resource server](active-directory-dev-glossary.md#resource-server) role (exposing APIs to clients), or even both. The conversation protocol is defined by an [OAuth 2.0 Authorization Grant flow](active-directory-dev-glossary.md#authorization-grant), allowing the client/resource to access/protect a resource's data respectively. Now let's go a level deeper, and see how the Azure AD application model represents an application at design-time and run-time. 

## Application registration
When you register an Azure AD application in the [Azure portal][AZURE-Portal], two objects are created in your Azure AD tenant: an application object, and a service principal object.

#### Application object
An Azure AD application is defined by its one and only application object, which resides in the Azure AD tenant where the application was registered, known as the application's "home" tenant. The Azure AD Graph [Application entity][AAD-Graph-App-Entity] defines the schema for an application object's properties. 

#### Service principal object
The service principal object defines the policy and permissions for an application's use in a specific tenant, providing the basis for a security principal to represent the application at run-time. The Azure AD Graph [ServicePrincipal entity][AAD-Graph-Sp-Entity] defines the schema for a service principal object's properties. 

#### Application and service principal relationship
Consider the application object as the *global* representation of your application for use across all tenants, and the service principal as the *local* representation for use in a specific tenant. The application object serves as the template from which common and default properties are *derived* for use in creating corresponding service principal objects. An application object therefore has a 1:1 relationship with the software application, and a 1:many relationship with its corresponding service principal object(s).

A service principal must be created in each tenant where the application will be used, enabling it to establish an identity for sign-in and/or access to resources being secured by the tenant. A single-tenant application will have only one service principal (in its home tenant), usually created and consented for use during application registration. A multi-tenant Web application/API will also have a service principal created in each tenant where a user from that tenant has consented to its use.  

> [!NOTE]
> Any changes you make to your application object, are also reflected in its service principal object in the application's home tenant only (the tenant where it was registered). For multi-tenant applications, changes to the application object are not reflected in any consumer tenants' service principal objects, until the access is removed via the [Application Access Panel](https://myapps.microsoft.com) and granted again.
><br>  
> Also note that native applications are registered as multi-tenant by default.
> 
> 

## Example
The following diagram illustrates the relationship between an application's application object and corresponding service principal objects, in the context of a sample multi-tenant application called **HR app**. There are three Azure AD tenants in this scenario: 

* **Adatum** - the tenant used by the company that developed the **HR app**
* **Contoso** - the tenant used by the Contoso organization, which is a consumer of the **HR app**
* **Fabrikam** - the tenant used by the Fabrikam organization, which also consumes the **HR app**

![Relationship between an application object and a service principal object](./media/active-directory-application-objects/application-objects-relationship.png)

In the previous diagram, Step 1 is the process of creating the application and service principal objects in the application's home tenant.

In Step 2, when Contoso and Fabrikam administrators complete consent, a service principal object is created in their company's Azure AD tenant and assigned the permissions that the administrator granted. Also note that the HR app could be configured/designed to allow consent by users for individual use.

In Step 3, the consumer tenants of the HR application (Contoso and Fabrikam) each have their own service principal object. Each represents their use of an instance of the application at runtime, governed by the permissions consented by the respective administrator.

## Next steps
An application's application object can be accessed via the Azure AD Graph API, the [Azure portal's][AZURE-Portal] application manifest editor, or [Azure AD PowerShell cmdlets](https://docs.microsoft.com/powershell/azure/overview?view=azureadps-2.0), as represented by its OData [Application entity][AAD-Graph-App-Entity].

An application's service principal object can be accessed via the Azure AD Graph API or [Azure AD PowerShell cmdlets](https://docs.microsoft.com/powershell/azure/overview?view=azureadps-2.0), as represented by its OData [ServicePrincipal entity][AAD-Graph-Sp-Entity].

The [Azure AD Graph Explorer](https://graphexplorer.azurewebsites.net/) is useful for querying both the application and service principal objects.

<!--Image references-->

<!--Reference style links -->
[AAD-Graph-App-Entity]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#application-entity
[AAD-Graph-Sp-Entity]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#serviceprincipal-entity
[AZURE-Portal]: https://portal.azure.com
