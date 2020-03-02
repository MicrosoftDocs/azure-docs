---
title: Use Microsoft Graph APIs to configure provisioning - Azure Active Directory | Microsoft Docs
description: Centralize application management with Azure AD
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
ms.date: 03/02/2019
ms.author: mimart
ms.reviewer: arvinh

ms.collection: M365-identity-device-management
---

# Centralize application management with Azure AD

Passwords, both an IT nightmare and a pain for employees across the world. This is why more and more companies are turning to Azure Active Directory, Microsoft's Identity and Access Management solution for the cloud and all your other resources. Jump from application to application without having to enter a password for each one. Jump from Outlook, to Workday, to ADP as fast as you can open them up, quickly and securely. Then collaborate with partners and even others outside your organization all without having to call IT. What's more, Azure AD helps manage risk by securing the apps you use with things like multi-factor authentication to verify who you are, using continuously adaptive machine learning and security intelligence to detect suspicious sign-ins giving you secure access to the apps you need, wherever you are. It's not only great for users but for IT as well. With just-in-time access reviews and a full scale governance suite, Azure AD helps you stay in compliance and enforce policies too. And get this, you can even automate provisioning user accounts, making access management a breeze. check out some of the common scenarios that customer use Azure Active Directory's application management capabilities for.

**Common scenarios**


> [!div class="checklist"]
> * SSO for all your applications
> * Provision users and groups into your applications
> * Secure your applications
> * Report on your applications
> * Govern access to your applications
> * Secure remote access to your applications


## Scenario 1: Set up SSO for all your applications

No more managing password. Securely access all the resources you need with your corporate credentials. 

|Feature  | Description |
|---------|---------|
|SSO|Standards-based federated SSO using trusted industry standards.|Always use SAML / OIDC to enable SSO when your application supports it.|
|Access panel|Offer your users a simple hub to discover and access all their applications. Enable them to be more productive with self-service capabilities, like requesting access to apps and groups, or managing access to resources on behalf of others.|

## Scenario 2: Automate provisioning and deprovisioning 


Most applications require a user to be provisioned into the application before accessing the resources that they need. Using CSV files or complex scripts can be costly and hard to manage. Furthermore, customers need to ensure that accounts are removed when someone shouldn't have access anymore. Leverage the tools below to automate provisioning and deprovisioning. 


|Feature  |Description|
|---------|---------|
|SCIM Provisioning|[SCIM](https://aka.ms/SICMOverview) is an industry best practice for automating user provisioning. Any SCIM-compliant application can be integrated with Azure AD. Automatically create, update, and delete user accounts without having to maintain CSV files, custom scripts, or on-prem solutions. 
|Microsoft Graph|Leverage the breath and depth of data that Azure AD has to enrich your application with the data that it needs.|


## Scenario 3: Secure your applications
Identity is the linchpin for security. If an identity gets compromised, it's incredibly difficult to stop the domino effect before it's too late. On average over 100 days pass before organizations discover that there was a compromise. Use the tools provided by Azure AD to improve the security posture of your applications. 

|Feature  |Description|
|---------|---------|
|Azure MFA|Azure Multi-Factor Authentication (MFA) is Microsoft's two-step verification solution. Using admin-approved authentication methods, Azure MFA helps safeguard access to your data and applications while meeting the demand for a simple sign-in process.|
|Conditional Access|With Conditional Access, you can implement automated access control decisions for who can access your cloud apps, based on conditions.|
|Identity Protection|Identity Protection uses the learnings Microsoft has acquired from their position in organizations with Azure AD, the consumer space with Microsoft Accounts, and in gaming with Xbox to protect your users. Microsoft analyses 6.5 trillion signals per day to identify and protect customers from threats.|

## Scenario 4: Govern access to your applications
Identity Governance helps organizations achieve a balance between productivity - How quickly can a person have access to the applications they need, such as when they join my organization? And security - How should their access change over time, such as due to changes to that person's employment status? 

|Feature  |Description|
|---------|---------|
|ELM|Azure AD entitlement management can help users both inside and outside your organization more efficiently manage access to their applications.|
|Access Reviews|User's access to apps can be reviewed on a regular basis to make sure only the right people have continued access.|
|Log Analytics|Generate reports about who is accessing which applications and store them in your SIEM tool of choice to correlate data between data sources and over time.|


## Scenario 5: Hybrid Secure Access
Identity can only be your control plane if it can connect everything across cloud and on-premises applications. Leverage the tools provided by Azure AD and its partners to secure access to legacy-auth based applications.

|Feature  |Description|
|---------|---------|
|Application Proxy|Employees today want to be productive at any place, at any time, and from any device. They need to access SaaS apps in the cloud and corporate apps on-premises. Azure AD Application proxy enables this robust access without costly and complex virtual private networks (VPNs) or demilitarized zones (DMZs).|Lore ipsum.|
|F5, Akami, Zscaler|Using your existing networking and delivery controller, you can easily protect legacy applications that are still critical to your business processes but that you couldn't protect before with Azure AD. It's likely you already have everything you need to start protecting these applications.|Lore ipsum.|

## Related articles

- [Application management](https://docs.microsoft.com/azure/active-directory/manage-apps/index)
- [Application provisioning](https://docs.microsoft.com/azure/active-directory/app-provisioning/user-provisioning)
- [Hybrid secure access]()
- [Identity governance](https://docs.microsoft.com/azure/active-directory/governance/identity-governance-overview)
- [Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/v2-overview)
- [Identity security](https://docs.microsoft.com/azure/active-directory/conditional-access/index)
