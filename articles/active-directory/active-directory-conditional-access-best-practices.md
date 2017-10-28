---
title: Best practices for conditional access in Azure Active Directory  | Microsoft Docs
description: Learn about things you should know and what it is you should avoid doing when configuring conditional access policies.
services: active-directory
keywords: conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 8c1d978f-e80b-420e-853a-8bbddc4bcdad
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/22/2017
ms.author: markvi

---
# Best practices for conditional access in Azure Active Directory

This topic provides you with information about things you should know and what it is you should avoid doing when configuring conditional access policies. Before reading this topic, you should familiarize yourself with the concepts and the terminology outlined in [Conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal.md)

## What you should know

### Do I need to assign a user to my policy?

When configuring a conditional access policy, you should at least assign one group to it. A conditional access policy that has no users and groups assigned, is never triggered.

When you intend to assign several users and groups to a policy, you should start small by assigning only one user or group, and then test your configuration. If your policy works as expected, you can then add additional assignments to it.  


### How are assignments evaluated?

All assignments are logically **ANDed**. If you have more than one assignment configured, to trigger a policy, all assignments must be satisfied.  

If you need to configure a location condition that applies to all connections made from outside your organization's network, you can accomplish this by:

- Including **All locations**
- Excluding **All trusted IPs**

### What happens if you have policies in the Azure classic portal and Azure portal configured?  
Both policies are enforced by Azure Active Directory and the user gets access only when all requirements are met.

### What happens if you have policies in the Intune Silverlight portal and the Azure Portal?
Both policies are enforced by Azure Active Directory and the user gets access only when all requirements are met.

### What happens if I have multiple policies for the same user configured?  
For every sign-in, Azure Active Directory evaluates all policies and ensures that all requirements are met before granted access to the user.


### Does conditional access work with Exchange ActiveSync?

Yes, you can use Exchange ActiveSync in a conditional access policy.


## What you should avoid doing

The conditional access framework provides you with a great configuration flexibility. However, great flexibility  also means that you should carefully review each configuration policy prior to releasing it to avoid undesirable results. In this context, you should pay special attention to assignments affecting complete sets such as **all users / groups / cloud apps**.

In your environment, you should avoid the following configurations:


**For all users, all cloud apps:**

- **Block access** - This configuration blocks your entire organization, which is definitely not a good idea.

- **Require compliant device** - For users that don't have enrolled their devices yet, this policy blocks all access including access to the Intune portal. If you are an administrator without an enrolled device, this policy blocks you from getting back into the Azure portal to change the policy.

- **Require domain join** - This policy block access has also the potential to block access for all users in your organization if you don't have a domain-joined device yet.


**For all users, all cloud apps, all device platforms:**

- **Block access** - This configuration blocks your entire organization, which is definitely not a good idea.


## Common scenarios

### Requiring multi-factor authentication for apps

Many environments have apps requiring a higher level of protection than the others.
This is, for example, the case for apps that have access to sensitive data.
If you want to add another layer of protection to these apps, you can configure a conditional access policy that requires multi-factor authentication when users are accessing these apps.


### Requiring multi-factor authentication for access from networks that are not trusted

This scenario is similar to the previous scenario because it adds a requirement for multi-factor authentication.
However, the main difference is the condition for this requirement.  
While the focus of the previous scenario was on apps with access to sensitve data, the focus of this scenario is on trusted locations.  
In other words, you might have a requirement for multi-factor authentication if an app is accessed by a user from a network you don't trust.


### Only trusted devices can access Office 365 services

If you are using Intune in your environment, you can immediately start using the conditional access policy interface in the Azure console.

Many Intune customers are using conditional access to ensure that only trusted devices can access Office 365 services. This means that mobile devices are enrolled with Intune and meet compliance policy requirements, and that Windows PCs are joined to an on-premises domain. A key improvement is that you do not have to set the same policy for each of the Office 365 services.  When you create a new policy, configure the Cloud apps to include each of the O365 apps that you wish to protect with  with Conditional Access.

## Next steps

If you want to know how to configure a conditional access policy, see [Get started with conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal-get-started.md).
