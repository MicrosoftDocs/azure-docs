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

# Doc 1 - High level overview of apps for customers

Passwords, both an IT nightmare and a pain for employees across the world. This is why more and more companies are turning to Azure Active Directory, Microsoft's Identity and Access Management solution for the cloud and all your other resources. Jump from application to applicaiton without having to enter a password for each one. Jump from Outlook, to Workday, to ADP as fast as you can open them up, quickly and securely. Then collaborate with partners and even others outside your organization all without having to call IT. What's more, Azure AD helps manage risk by securing the apps you use with things like multi-factor authentication to verify who you are, using continuously adaptive machine learning and security intelligence to detect suspicious sign-ins giving you secure access to the apps you need, wherever you are. It's not only great for users but for IT as well. With just-in-time access reviews and a full scale governance suite, Azure AD helps you stay in compliance and enforce policies too. And get this, you can even automate provisioning user accounts, making access management a breeze. Checkout some of the common scenarios that customer use Azure Active Directory's application management capabilities for.

**Common scenarios**


> [!div class="checklist"]
> * SSO for all your applications
> * Provision users and groups into your applications
> * Secure your applications
> * Report on your applications
> * Govern access to your applications
> * Remote access to your applications


## Scenario 1: Setup SSO for all your applications

No more managing password. Securely access all the resources you need with your corporate credentials. 

|Feature  | Description | When to use |
|---------|---------|---------|
|SSO|Standards based federated SSO using trusted industry standards.|Always use SAML / OIDC to enable SSO when your application supports it.|
|Access all your applications from one place.|? |

## Scenario 2: Automate provisioning and deprovisioning 


Most applications require a user to be provisioned into the application before accessing the resources that they need. Furthermore, customers need to ensure that accounts are removed when somone shouldn't have access anymore. Leverage the tools below to automate provisioning and deprovisioning. **Add a link here to the deep dive into the differences between the two**


|Feature  |Description|When to use |
|---------|---------|---------|
|SCIM Provisioning|Industry best practice for automating user provisioning. Adhering to the SCIM standard allows customers to provision users and groups int your application. Supporting the SCIM standard makes your applicaiton interoperable with any SCIM client, not just Azure AD||
|Microsoft Graph|Leverage the breath and depth of data that Azure AD has to enrich your application with the data that it needs.||


## Scenario 3: Secure your applications
Lore ipsum

|Feature  |Description|When to use |
|---------|---------|---------|
|Azure MFA|Azure Multi-Factor Authentication (MFA) is Microsoft's two-step verification solution. Using admin-approved authentication methods, Azure MFA helps safeguard access to your data and applications while meeting the demand for a simple sign-in process.|Check out|
|Conditional Access|With Conditional Access, you can implement automated access control decisions for who can access your cloud apps, based on conditions.|Checkout the baseline protection guidance. |
|Identity Protection|Identity Protection uses the learnings Microsoft has acquired from their position in organizations with Azure AD, the consumer space with Microsoft Accounts, and in gaming with Xbox to protect your users. Microsoft analyses 6.5 trillion signals per day to identify and protect customers from threats.|Lore ipsum.|

## Scenario 4: Govern access to your applications
Lore ipsum

|Feature  |Description|When to use |
|---------|---------|---------|
|ELM|Azure AD entitlement management can help users both inside and outside your organization more efficiently manage access to their appplications.|Lore ipsum.|
|Access Reviews|User's access to apps can be reviewed on a regular basis to make sure only the right people have continued access.|Lore ipsum.|
|Log Analytics|Generate reports about who is accessing which applications and store them in your SIEM tool of choice to correlate data between data sources and over time.|Lore ipsum.|


## Scenario 5: Hybrid Secure Access
Lore ipsum

|Feature  |Description|When to use |
|---------|---------|---------|
|Application Proxy|Employees today want to be productive at any place, at any time, and from any device. They need to access SaaS apps in the cloud and corporate apps on-premises. Azure AD Application proxy enables this robust access without costly and complex virtual private networks (VPNs) or demilitarized zones (DMZs).|Lore ipsum.|
|F5, Akami, Zscaler|Using your existing networking and delivery controller, you can easily protect legacy applications that are still critical to your business processes but that you couldn't protect before with Azure AD. It's likely you already have everything you need to start protecting these applications.|Lore ipsum.|

## Related articles

- 
