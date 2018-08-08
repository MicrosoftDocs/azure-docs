---
title: Delegate administrator roles in Azure Active Directory | Microsoft Docs
description: Delegation models, examples, and role security in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.workload: identity
ms.component: users-groups-roles
ms.topic: article
ms.date: 08/09/2018
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro
#As an Azure AD administrator, I want to know how to organize my approach to delegating roles
---

# Delegate administration in Azure Active Directory

With organizational growth comes further complexity, and one common response is to reduce some of the overhead of access management with Azure Active Directory (AD) admin roles. You can assign the least possible privilege to users to access their apps and perform their tasks. You might not want to assign the Global Administrator role to every application owner, but the tradeoff can be that you force application management responsibilities onto the existing Global Administrators. There are many reasons for an organization move toward a more decentralized administration. This article can help you plan for delegation in your organization.

<!--What about reporting? Who has which role and how do I audit?-->


## Centralized versus delegated permissions

As an organization grows, it can be difficult to keep track of which users have specific admin roles. An organization can be susceptible to security breaches if an employee has administrator rights they shouldn’t. Generally, the number of administrators and the granularity of their permissions depends on the size and complexity of the deployment.

* In small or proof-of-concept deployments, one or a few administrators do everything; there is no delegation. In this case, create each administrator with the Global Administrator role.
* In larger deployments with more machines, applications, and desktops, more delegation is needed. Several administrators might have more specific functional responsibilities (roles). For example, some might be Privileged Identity Administrators, and others might be Application Administrators. Additionally, an administrator might manage only certain groups of objects such as devices.
* Even larger deployments might require even more granular permissions, plus possibly administrators with unconventional or hybrid roles.

In the Azure AD portal, you can [view all the members of any role](directory-manage-roles-portal.md), which can help you quickly check your deployment and delegate permissions.

If you’re interested in delegating access to Azure resources and not administrative access in Azure AD, see [Assign a Role-based access control (RBAC) role](../../role-based-access-control/role-assignments-portal.md).

## Delegation planning

While the hurdle is to develop a delegation model that fits the unique needs of your organization, the truth is that there are very simple models that can be applied with little modification. Developing a delegation model is an iterative design process, and we suggest you follow these steps:

* Define the roles you need
* Delegate app administration
* Grant the ability to register applications
* Delegate app ownership
* Develop a security plan
* Establish emergency accounts
* Secure your administrator roles
* Make privileged elevation temporary

## Define roles

Determine which Active Directory tasks are carried out by administrators and how those tasks are mapped to roles. For example, Active Directory site creation is a service administration task, while modification of security group membership generally falls under data administration. You can [view detailed role descriptions](directory-manage-roles-portal.md) in the Azure portal.

Each task should be evaluated for frequency, importance, and difficulty. These are vital aspects of task definition because they govern whether a permission should be delegated. Tasks that are performed routinely, have limited risk, and are trivial to complete are excellent candidates for delegation. On the other hand, tasks that are performed rarely but have great impact across the organization and require high skill levels should be considered very carefully before delegating. Instead, you can [temporarily elevate an account to the required role](../active-directory-privileged-identity-management-configure.md) or reassign the task.

## Delegate app administration

The proliferation of apps within your organization can strain your delegation model. If it places the burden for application access management on the Global Administrator, it's likely that model increases its overhead as time goes on. If you have granted people the Global Administrator role for things like configuring enterprise applications, you can now offload them to the following less-privileged roles. Doing so helps to improve your security posture and reduces the potential for unfortunate mistakes. The most-privileged application administrator roles are:

* The **Application Administrator** role, which grants the ability to manage all applications in the directory, including registrations, single sign-on settings, user and group assignments and licensing, Application Proxy settings, and consent. It does not grant the ability to manage Conditional Access.
* The **Cloud Application Administrator** role, which grants all the abilities of the Application Administrator, except it does not grant access to Application Proxy settings (because it has no on-premises permission).### Delegate app owner permissions per-app

## Delegate app registration

By default, all users can create application registrations. If you want to selectively grant the ability to create application registrations, you’ll have to set **Users can register applications** to No in User settings, and then assign the Application Developer role. This role grants the ability to create application registrations only when the **Users can register applications** is turned off. Application Developers can also consent for themselves when the **Users can consent to applications accessing company data on their behalf** is set to No. When an Application Developer creates a new application registration, they are automatically added as the first owner.

## Delegate app ownership

For even finer-grained app access delegation, you can assign ownership to individual enterprise applications. This complements the existing support for assigning application registration owners. Ownership is assigned on a per-enterprise application basis in the enterprise apps blade. The benefit is owners can manage only the enterprise applications they own. For example, you can assign an owner for the Salesforce application, and that owner can manage access to and configuration for Salesforce, and no other applications. An enterprise application can have many owners, and a user can be the owner for many enterprise applications. There are two app owner roles:

* The **Enterprise Application Owner** role grants the ability to manage the ‘enterprise applications that the user owns, including single sign-on settings, user and group assignments, and adding additional owners. It does not grant the ability to manage Application Proxy settings or conditional access.
* The **Application Registration Owner** role grants the ability to manage application registrations for app that the user owns, including the application manifest and adding additional owners.

## Develop a security plan

Azure AD provides an extensive guide to planning and executing a security plan on your Azure AD admin roles, [Securing privileged access for hybrid and cloud deployments](directory-admin-roles-secure.md). 

## Establish emergency accounts

To maintain access to your identity management store when issue arise, prepare emergency access accounts according to [Create emergency-access administrative accounts](directory-emergency-access.md).

## Secure your administrator roles

Attackers who get control of privileged accounts can do tremendous damage, so protect these accounts first, using the [baseline access policy](https://cloudblogs.microsoft.com/enterprisemobility/2018/06/22/baseline-security-policy-for-azure-ad-admin-accounts-in-public-preview/) that is available by default to all Azure AD tenants (in public preview). The policy enforces multi-factor authentication on privileged Azure AD accounts. The following Azure AD roles are covered by the Azure AD baseline policy:

* Global administrator
* SharePoint administrator
* Exchange administrator
* Conditional access administrator
* Security administrator

## Elevate privilege temporarily

For most day-to-day activities, not all users need global administrator rights. And not all users should be permanently assigned to the Global Administrator role. When users need to act as a Global Administrator, they should activate the role assignment in Azure AD [Privileged Identity Management](../active-directory-privileged-identity-management-configure.md) on either their own account or an alternate administrative account.

## Next steps

For a reference to the Azure AD role descriptions, see [Assign admin roles in Azure AD](directory-assign-admin-roles.md)