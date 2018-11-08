---
title: Managing access to apps using Azure AD | Microsoft Docs
description: Describes how Azure Active Directory enables organizations to specify the apps to which each user has access.
services: active-directory
documentationcenter: ''
author: barbkess
manager: mtillman
editor: ''

ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/16/2017
ms.author: barbkess

---
# Managing access to apps
Ongoing access management, usage evaluation, and reporting continue to be a challenge after an app is integrated into your organization's identity system. In many cases, IT Administrators or helpdesk have to take an ongoing active role in managing access to your apps. Sometimes, assignment is performed by a general or divisional IT team. Often, the assignment decision is intended to be delegated to the business decision maker, requiring their approval before IT makes the assignment.  Other organizations invest in integration with an existing automated identity and access management system, like Role-Based Access Control (RBAC) or Attribute-Based Access Control (ABAC). Both the integration and rule development tend to be specialized and expensive. Monitoring or reporting on either management approach is its own separate, costly, and complex investment.

## How does Azure Active Directory help?
 Azure AD supports extensive access management for configured applications, enabling organizations to easily achieve the right access policies ranging from automatic, attribute-based assignment (ABAC or RBAC scenarios) through delegation and including administrator management. With Azure AD, you can easily achieve complex policies, combining multiple management models for a single application and can even reuse management rules across applications with the same audiences.

* [Adding new or existing applications](configure-single-sign-on-portal.md)

 Azure AD's application assignment focuses on two primary assignment modes:

* **Individual assignment** An IT admin with directory Global Administrator permissions can select individual user accounts and grant them access to the application.
* **Group-based assignment (paid Azure AD only)** An IT admin with directory Global Administrator permissions can assign a group to the application. Specific users' access is determined by whether they are members of the group at the time they try to access the application. In other words, an administrator can effectively create an assignment rule stating "any current member of the assigned group has access to the application". Using this assignment option, administrators can benefit from any of Azure AD group management options, including [attribute-based dynamic groups](../fundamentals/active-directory-groups-create-azure-portal.md), external system groups (for example, on-premises Active Directory or Workday), or Administrator-managed or self-service-managed groups. A single group can be easily assigned to multiple apps, making sure that applications with assignment affinity can share assignment rules, reducing the overall management complexity. Note that nested group memberships aren't supported for group-based assignment to applications at this time.

Using these two assignment modes, administrators can achieve any desirable assignment management approach.

With Azure AD, usage and assignment reporting is fully integrated, enabling administrators to easily report on assignment state, assignment errors, and even usage.

## Complex application assignment with Azure AD
Consider an application like Salesforce. In many organizations, Salesforce is primarily used by the marketing and sales organizations. Often, members of the marketing team have highly privileged access to Salesforce, while members of the sales team have limited access. In many cases, a broad population of information workers has restricted access to the application. Exceptions to these rules complicate matters. It's often the prerogative of the marketing or sales leadership teams to grant a user access or change their roles independently of these generic rules.

With Azure AD, applications like Salesforce can be pre-configured for single sign-on (SSO) and automated provisioning. Once the application is configured, an Administrator can take the one-time action to create and assign the appropriate groups. In this example, an administrator could execute the following assignments:

* [Dynamic groups](../fundamentals/active-directory-groups-create-azure-portal.md) can be defined to automatically represent all members of the marketing and sales teams using attributes like department or role:
  
  * All members of marketing groups would be assigned to the "marketing" role in Salesforce
  * All members of sales team groups would be assigned to the "sales" role in Salesforce. A further refinement could use multiple groups that represent regional sales teams assigned to different Salesforce roles.
* To enable the exception mechanism, a self-service group could be created for each role. For example, the "Salesforce marketing exception" group can be created as a self-service group. The group can be assigned to the Salesforce marketing role and the marketing leadership team can be made owners. Members of the marketing leadership team could add or remove users, set a join policy, or even approve or deny individual users' requests to join. This mechanism is supported through an information worker appropriate experience that does not require specialized training for owners or members.

In this case, all assigned users would be automatically provisioned to Salesforce, as they are added to different groups their role assignment would be updated in Salesforce. Users would be able to discover and access Salesforce through the Microsoft application access panel, Office web clients, or even by navigating to their organizational Salesforce login page. Administrators would be able to easily view usage and assignment status using Azure AD reporting.

Administrators can employ [Azure AD conditional access](../active-directory-conditional-access-azure-portal.md) to set access policies for specific roles. These policies can include whether access is permitted outside the corporate environment and even Multi-Factor Authentication or device requirements to achieve access in various cases.

## Next steps
* [Protecting apps with conditional access](../active-directory-conditional-access-azure-portal.md)
* [Self-service group management/SSAA](../users-groups-roles/groups-self-service-management.md)
