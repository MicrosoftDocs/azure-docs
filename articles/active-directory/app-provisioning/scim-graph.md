---
title: Use Microsoft Graph APIs to configure provisioning - Azure Active Directory | Microsoft Docs
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

# Using SCIM and Microsoft Graph to provision and enrich your application with the data it needs

This document describes how you can use SCIM to automate creating, updating, and deleting user accounts in your application while enriching your applications with data from Graph.

**Common scenarios**


> [!div class="checklist"]
> * Provision users and groups into an application
> * Provision users and groups in Azure Aactive Directory
> * Provision users and groups in Active Directory
> * Enrich your app ... 


## Scenario 1: Provision users and groups into an application
#### Scenario description
Automatically create, update, and delete user accounts in your application when users join, move, and leave the company. 

#### Recommended best practices
|Option  |Pros  |Cons |Comments |
|---------|---------|---------|---------|
|Develop and integrate a [SCIM](https://aka.ms/SCIMOverview) endpoint with Azure AD|Follows an [industry standard](http://www.simplecloud.info/). <br> Interoperable with various IDPs. <br> You do not have to build and maintain a sync engine, only a /User endpoint.|SCIM provisioning gives you access to directory data but not other Microsoft data|For basic user and group provisioning, SCIM is the recommended path forward|
|Develop a graph based sync engine|You have access to all the data available in Microsoft <br> Control the end to end user experience|Heavy cost of maintaining and building a sync engine <br> The permissions you require might not be acceptable by IT||

## Scenario 2: Provision users and groups in Azure AD

#### Scenario description
User information is often managed  in applications such as an HR system. Microsoft provides a number of tools to bring that user information into Azure AD.

#### Recommended best practices
|Option  |Pros  |Cons |Comments |
|---------|---------|---------|---------|
|Integrate your application with the Microsoft Graph / User endpoint||||
|Integrate your application with the Microsoft Graph /SCIM/User endpoint|The same sync engine that you build can be integrated with any SCIM compliant IDP.  <br> You control the time to market. |||
|Request that an Azure AD provisioning connector be built|You do not have to maintain a sync engine. Customers get the reporting, logging, and unified management experience that they get for all applications.|It takes time for the Azure AD team to manage requests so time to market may be an issue.||
|Azure SQL integration||||

## Scenario 3: Provision users and groups in Active Directory

#### Scenario description


#### Recommended best practices


## Scenario 4: Enrich your app ...
#### Scenario description


#### Recommended best practices

## Related articles

- [Review the synchronization Microsoft Graph documentation](https://docs.microsoft.com/graph/api/resources/synchronization-overview?view=graph-rest-beta)
- [Integrating a custom SCIM app with Azure AD](use-scim-to-provision-users-and-groups.md)
