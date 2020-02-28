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

# Azure AD Applications - customer doc

Passwords, both an IT nightmare and a pain for employees across the world. This is why more and more companies are turning to Azure Active Directory, Microsoft's Identity and Access Management solution for the cloud and all your other resources. Jump from application to applicaiton without having to enter a password for each one. Jump from Outlook, to Workday, to ADP as fast as you can open them up, quickly and securely. Then collaborate with partners and even others outside your organization all without having to call IT. What's more, Azure AD helps manage risk by securing the apps you use with things like multi-factor authentication to verify who you are, using continuously adaptive machine learning and security intelligence to detect suspicious sign-ins giving you secure access to the apps you need, wherever you are. It's not only great for users but for IT as well. With just-in-time access reviews and a full scale governance suite, Azure AD helps you stay in compliance and enforce policies too. And get this, you can even automate provisioning user accounts, making access management a breeze. Checkout some of the common scenarios that customer use Azure Active Directory's application management capabilities for.

**Common scenarios**


> [!div class="checklist"]
> * SSO for all your applications
> * Provision users and groups into your applications
> * Secure your applications
> * Report on your applications
> * Govern access to your applications
> * Secure remote access to your applications


## Scenario 1: Enable SSO for your applications

No more managing password. Securely access all the resources you need with your corporate credentials. 

|Feature  | Description | When to use |
|---------|---------|---------|
|SSO|Standards based federated SSO using trusted industry standards.|Always use SAML / OIDC to enable SSO when your application supports it.|
|Access all your applications from one place.|? |

## Scenario 2: Automate provisioning and deprovisioning 


Most applications require a user to be provisioned into the application before accessing the resources that they need. Furthermore, customers need to ensure that accounts are removed when somone shouldn't have access to the account anymore. Leverage the tools provided by the Azure AD provisioning service to automate user provisioning and deprovisioning. 


|Feature  |Description|When to use |
|---------|---------|---------|
|SCIM Provisioning|Industry best practice for automating user provisioning. Adhering to the SCIM standard allows customers to provision users and groups int your application. Supporting the SCIM standard makes your applicaiton interoperable with any SCIM client, not just Azure AD||
|Microsoft Graph|Leverage the breath and depth of data that Azure AD has to enrich your application with the data that it needs.||


## Scenario 3: Secure your applications
Lore ipsum

|Feature  |Description|When to use |
|---------|---------|---------|
|Azure MFA|Azure Multi-Factor Authentication (MFA) is Microsoft's two-step verification solution. Using admin-approved authentication methods, Azure MFA helps safeguard access to your data and applications while meeting the demand for a simple sign-in process.|Check ou|
|Conditional Access|With Conditional Access, you can implement automated access control decisions for who can access your cloud apps, based on conditions.|Checkout the baseline protection guidance. |
|Identity Protection|Identity Protection uses the learnings Microsoft has acquired from their position in organizations with Azure AD, the consumer space with Microsoft Accounts, and in gaming with Xbox to protect your users. Microsoft analyses 6.5 trillion signals per day to identify and protect customers from threats.|Lore ipsum.|

## Scenario 4: Govern access to your applications
Lore ipsum

|Feature  |Description|When to use |
|---------|---------|---------|
|ELM|Azure AD entitlement management can help you more efficiently manage access to groups, applications, and SharePoint Online sites for internal users, and also for users outside your organization who need access to those resources.|Lore ipsum.|
|Access Reviews|Azure Active Directory (Azure AD) access reviews enable organizations to efficiently manage group memberships, access to enterprise applications, and role assignments. User's access can be reviewed on a regular basis to make sure only the right people have continued access.|Lore ipsum.|
|Log Analytics|Azure Active Directory (Azure AD) reports provide a comprehensive view of activity in your environment. These reports can be pushed into your SIEM tool to correlate data between data sources and over time.|Lore ipsum.|


## Scenario 5: Hybrid Secure Access
Lore ipsum

|Feature  |Description|When to use |
|---------|---------|---------|
|Application Proxy|Employees today want to be productive at any place, at any time, and from any device. They need to access SaaS apps in the cloud and corporate apps on-premises. Azure AD Application proxy enables this robust access without costly and complex virtual private networks (VPNs) or demilitarized zones (DMZs).|Lore ipsum.|
|F5, Akami, Zscaler|Using your existing networking and delivery controller, you can easily protect legacy applications that are still critical to your business processes but that you couldn't protect before with Azure AD. It's likely you already have everything you need to start protecting these applications.|Lore ipsum.|

## Related articles

- 


# Azure AD Applications - developer doc

Whether you're a line of business developer building critical applications to be used in your organization or you're an independent software vendor building the next big app, Azure Active Directory is the platform for you to take care of identity and get your customers running quickly and securely. 

**Common scenarios**


> [!div class="checklist"]
> * SSO for all your applications
> * Provision users and groups into your applications



## Scenario 1: Enable SSO for your applications

No more managing password. Securely access all the resources you need with your corporate credentials. 

|Feature  | Description | When to use |
|---------|---------|---------|
|SAML|Standards based federated SSO using trusted industry standards.|Always use SAML / OIDC to enable SSO when your application supports it.|
|OIDC|||
|MSAL|||

## Scenario 2: Enrich your application with the data that you need


Most applications require a user to be provisioned into the application before accessing the resources that they need. Furthermore, customers need to ensure that accounts are removed when somone shouldn't have access to the account anymore. Leverage the tools provided by the Azure AD provisioning service to automate user provisioning and deprovisioning. 


|Feature  |Description|When to use |
|---------|---------|---------|
|SCIM provisioning|||
|Microsoft Graph|||


# Using SCIM and Microsoft Graph to provision and enrich your application with the data it needs

This document describes how you can use SCIM to automate creating, updating, and deleting user accounts in your application while enriching your applications with data from Graph.

**Common scenarios**


> [!div class="checklist"]
> * Provision users and groups into an application
> * Provision users and groups in Azure Aactive Directory
> * Provision users and groups in Active Directory
> * Enrich your app ... 


## Scenario 1: Automatically create, update, and delete users and groups in your an application
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


## Scenario 4: Enrich your app with properties beyond basic user and group information from the directory.
#### Scenario description
Your application may be interested in imformation from 

#### Recommended best practices

## Related articles

- [Review the synchronization Microsoft Graph documentation](https://docs.microsoft.com/graph/api/resources/synchronization-overview?view=graph-rest-beta)
- [Integrating a custom SCIM app with Azure AD](use-scim-to-provision-users-and-groups.md)
