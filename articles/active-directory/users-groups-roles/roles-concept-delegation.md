---
title: Understand admin role delegation - Azure Active Directory | Microsoft Docs
description: Delegation models, examples, and role security in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 01/31/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro
#As an Azure AD administrator, I want to know how to organize my approach to delegating roles
ms.collection: M365-identity-device-management
---

# Delegate administration in Azure Active Directory

With organizational growth comes complexity. One common response is to reduce some of the workload of access management with Azure Active Directory (AD) admin roles. You can assign the least possible privilege to users to access their apps and perform their tasks. Even if you don't assign the Global Administrator role to every application owner, you're placing application management responsibilities on the existing Global Administrators. There are many reasons for an organization move toward a more decentralized administration. This article can help you plan for delegation in your organization.

<!--What about reporting? Who has which role and how do I audit?-->

## Centralized versus delegated permissions

As an organization grows, it can be difficult to keep track of which users have specific admin roles. If an employee has administrator rights they shouldn’t, your organization can be more susceptible to security breaches. Generally, how many administrators you support and how granular their permissions are depends on the size and complexity of your deployment.

* In small or proof-of-concept deployments, one or a few administrators do everything; there's no delegation. In this case, create each administrator with the Global Administrator role.
* In larger deployments with more machines, applications, and desktops, more delegation is needed. Several administrators might have more specific functional responsibilities (roles). For example, some might be Privileged Identity Administrators, and others might be Application Administrators. Additionally, an administrator might manage only certain groups of objects such as devices.
* Even larger deployments might require even more granular permissions, plus possibly administrators with unconventional or hybrid roles.

In the Azure AD portal, you can [view all the members of any role](directory-manage-roles-portal.md), which can help you quickly check your deployment and delegate permissions.

If you’re interested in delegating access to Azure resources instead of administrative access in Azure AD, see [Assign a Role-based access control (RBAC) role](../../role-based-access-control/role-assignments-portal.md).

## Delegation planning

It's work to develop a delegation model that fits your needs. Developing a delegation model is an iterative design process, and we suggest you follow these steps:

* Define the roles you need
* Delegate app administration
* Grant the ability to register applications
* Delegate app ownership
* Develop a security plan
* Establish emergency accounts
* Secure your administrator roles
* Make privileged elevation temporary

## Define roles

Determine the Active Directory tasks that are carried out by administrators and how they map to roles. You can [view detailed role descriptions](directory-manage-roles-portal.md) in the Azure portal.

Each task should be evaluated for frequency, importance, and difficulty. These criteria are vital aspects of task definition because they govern whether a permission should be delegated:

* Tasks that you do routinely, have limited risk, and are trivial to complete are excellent candidates for delegation.
* Tasks that you do rarely but have great impact across the organization and require high skill levels should be considered very carefully before delegating. Instead, you can [temporarily elevate an account to the required role](../active-directory-privileged-identity-management-configure.md) or reassign the task.

## Delegate app administration

The proliferation of apps within your organization can strain your delegation model. If it places the burden for application access management on the Global Administrator, it's likely that model increases its overhead as time goes on. If you have granted people the Global Administrator role for things like configuring enterprise applications, you can now offload them to the following less-privileged roles. Doing so helps to improve your security posture and reduces the potential for unfortunate mistakes. The most-privileged application administrator roles are:

* The **Application Administrator** role, which grants the ability to manage all applications in the directory, including registrations, single sign-on settings, user and group assignments and licensing, Application Proxy settings, and consent. It doesn't grant the ability to manage Conditional Access.
* The **Cloud Application Administrator** role, which grants all the abilities of the Application Administrator, except it doesn't grant access to Application Proxy settings (because it has no on-premises permission).

## Delegate app registration

By default, all users can create application registrations. To selectively grant the ability to create application registrations:

* Set **Users can register applications** to No in **User settings**
* Assign the user to the Application Developer role

To selectively grant the ability to consent to allow an application to access data:

* Set **Users can consent to applications accessing company data on their behalf** To No in **User settings**
* Assign the user to the Application Developer role

When an Application Developer creates a new application registration, they are automatically added as the first owner.

## Delegate app ownership

For even finer-grained app access delegation, you can assign ownership to individual enterprise applications. This complements the existing support for assigning application registration owners. Ownership is assigned on a per-enterprise application basis in the Enterprise Applications blade. The benefit is owners can manage only the enterprise applications they own. For example, you can assign an owner for the Salesforce application, and that owner can manage access to and configuration for Salesforce, and no other applications. An enterprise application can have many owners, and a user can be the owner for many enterprise applications. There are two app owner roles:

* The **Enterprise Application Owner** role grants the ability to manage the ‘enterprise applications that the user owns, including single sign-on settings, user and group assignments, and adding additional owners. It doesn't grant the ability to manage Application Proxy settings or Conditional Access.
* The **Application Registration Owner** role grants the ability to manage application registrations for app that the user owns, including the application manifest and adding additional owners.

## Develop a security plan

Azure AD provides an extensive guide to planning and executing a security plan on your Azure AD admin roles, [Securing privileged access for hybrid and cloud deployments](directory-admin-roles-secure.md).

## Establish emergency accounts

To maintain access to your identity management store when issue arises, prepare emergency access accounts according to [Create emergency-access administrative accounts](directory-emergency-access.md).

## Secure your administrator roles

Attackers who get control of privileged accounts can do tremendous damage, so protect these accounts first, using the [baseline access policy](https://cloudblogs.microsoft.com/enterprisemobility/2018/06/22/baseline-security-policy-for-azure-ad-admin-accounts-in-public-preview/) that is available by default to all Azure AD tenants (in public preview). The policy enforces multi-factor authentication on privileged Azure AD accounts. The following Azure AD roles are covered by the Azure AD baseline policy:

* Global administrator
* SharePoint administrator
* Exchange administrator
* Conditional Access administrator
* Security administrator

## Elevate privilege temporarily

For most day-to-day activities, not all users need global administrator rights, and not all of them should be permanently assigned to the Global Administrator role. When users need the permissions of a Global Administrator, they should activate the role assignment in Azure AD [Privileged Identity Management](../active-directory-privileged-identity-management-configure.md) on either their own account or an alternate administrative account.

## Next steps

For a reference to the Azure AD role descriptions, see [Assign admin roles in Azure AD](directory-assign-admin-roles.md)
