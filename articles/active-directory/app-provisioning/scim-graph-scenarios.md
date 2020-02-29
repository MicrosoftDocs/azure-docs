---
title: Using SCIM and Microsoft Graph together to provision users and enrich your application with the data it needs | Microsoft Docs
description: Need to set up provisioning for multiple instances of an application? Learn how to save time by using the Microsoft Graph APIs to automate the configuration of automatic provisioning.
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 11/15/2019
ms.author: mimart
ms.reviewer: arvinh

ms.collection: M365-identity-device-management
---


# Using SCIM and Microsoft Graph together to provision users and enrich your application with the data it needs

Developers can use this reference to understand the various tools that Microsoft provides to automate provisioning. 

**Common scenarios**


> [!div class="checklist"]
> * Provision users and groups into an application
> * Provision users and groups in Azure Active Directory
> * Provision users and groups in Active Directory


## Scenario 1: Automatically create, update, and delete users and groups in your an application
Automatically create, update, and delete user accounts in your application when users join, move, and leave the company. Microsoft recommends adhering to the SCIM standard when developing a /User and /Group endpoint. This will allow your customers to integrate with the Azure AD provisioning service to automate user provisioning. In addition, Microsoft recommends using the Microsoft Graph to further enrich the data your application needs. 

|Option  |Pros  |Cons |
|---------|---------|---------|
|Develop and integrate a [SCIM](https://aka.ms/SCIMOverview) compliance / User endpoint **(recommended for basic user provisioning)**|[Industry best practice](http://www.simplecloud.info/) that is interoperable with various IDPs. <br> No need to build and maintain a sync engine. <br> Out of the box logging for customers. <Br> Customers can manage provisioning to all their apps from one place. <br>|SCIM provisioning gives you access to directory data but not other Microsoft data|For basic user and group provisioning, SCIM is the recommended path forward|
|Develop a graph based sync engine **(recommended for enriching your app with additional data form Teams, Sharepoint, etc.)**|You have access to all the data available in Microsoft <br> Control the end to end user experience|Heavy cost of maintaining and building a sync engine <br> The permissions you require might not be acceptable by IT <br> B2C <br> ||

## Scenario 2: Automatically create, update, and delete users and groups in Azure AD

User information is often managed in on prem Active Directory or HR applications such as Workday and Successfactors. When bringing data into Azure AD, Microsoft recommends using Azure AD Connect and Azure AD Connecto Cloud provisioning. You can see a detailed comparison here. When bringing data into Azure AD, you can either reach out to our team to build a provisioning connector from your application into Azure AD or build your own Graph based implementation. 

|Option  |Pros  |Cons |
|---------|---------|---------|
|[Azure AD provisioning service](https://docs.microsoft.com/azure/active-directory/app-provisioning/plan-cloud-hr-provision)|You do not have to maintain a sync engine. Customers get the reporting, logging, and unified management experience that they get for all applications.|It takes time for the Azure AD team to manage requests so time to market may be an issue.||
|Integrate your application with the Microsoft Graph [/ User](https://docs.microsoft.com/graph/api/resources/users?view=graph-rest-1.0) endpoint|Time to market. No need to wait for Microsoft to develop a provisioning connector. <br> You own the provisioning integration and have full control over the experience.|Requires that you build and maintain a sync engine.||


## Scenario 3: Automatically create, update, and delete users and groups in Active Directory
User information is often managed in on prem Active Directory or HR applications such as Workday and Successfactors. When bringing data into Azure AD, Microsoft recommends using Azure AD Connect and Azure AD Connecto Cloud provisioning. You can see a detailed comparison here. When bringing data into Azure AD, you can either reach out to our team to build a provisioning connector from your application into Azure AD or build your own Graph based implementation. 

|Option  |Pros  |Cons |
|---------|---------|---------| 
|[Azure AD provisioning service](https://docs.microsoft.com/azure/active-directory/app-provisioning/plan-cloud-hr-provision)|You do not have to maintain a sync engine. Customers get the reporting, logging, and unified management experience that they get for all applications.|It takes time for the Azure AD team to manage requests so time to market may be an issue.|
|[Microsoft Identity Manager (MIM)](https://docs.microsoft.com/microsoft-identity-manager/microsoft-identity-manager-2016)|You can develop and publish a MIM connector that enables your customers to push data from your app to AD.|Requires customers deploy on prem infrastructure in addition to Azure AD.|

## Related articles

- [Review the synchronization Microsoft Graph documentation](https://docs.microsoft.com/graph/api/resources/synchronization-overview?view=graph-rest-beta)
- [Integrating a custom SCIM app with Azure AD](use-scim-to-provision-users-and-groups.md)
