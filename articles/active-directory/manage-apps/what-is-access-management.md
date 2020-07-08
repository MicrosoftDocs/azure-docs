---
title: Managing access to apps using Azure AD | Microsoft Docs
description: Describes how Azure Active Directory enables organizations to specify the apps to which each user has access.
services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 05/16/2017
ms.author: kenwith
ms.collection: M365-identity-device-management
---

# Managing access to apps

Ongoing access management, usage evaluation, and reporting continue to be a challenge after an app is integrated into your organization's identity system. In many cases, IT Administrators or helpdesk have to take an ongoing active role in managing access to your apps. Sometimes, assignment is performed by a general or divisional IT team. Often, the assignment decision is intended to be delegated to the business decision maker, requiring their approval before IT makes the assignment.  Other organizations invest in integration with an existing automated identity and access management system, like Role-Based Access Control (RBAC) or Attribute-Based Access Control (ABAC). Both the integration and rule development tend to be specialized and expensive. Monitoring or reporting on either management approach is its own separate, costly, and complex investment.

## How does Azure Active Directory help?

Azure AD supports extensive access management for configured applications, enabling organizations to easily achieve the right access policies ranging from automatic, attribute-based assignment (ABAC or RBAC scenarios) through delegation and including administrator management. With Azure AD, you can easily achieve complex policies, combining multiple management models for a single application and can even reuse management rules across applications with the same audiences.

With Azure AD, usage and assignment reporting is fully integrated, enabling administrators to easily report on assignment state, assignment errors, and even usage.

### Assigning users and groups to an app

Azure AD's application assignment focuses on two primary assignment modes:

* **Individual assignment** An IT admin with directory Global Administrator permissions can select individual user accounts and grant them access to the application.

* **Group-based assignment (requires Azure AD Premium P1 or P2)** An IT admin with directory Global Administrator permissions can assign a group to the application. Specific users' access is determined by whether they are members of the group at the time they try to access the application. In other words, an administrator can effectively create an assignment rule stating "any current member of the assigned group has access to the application". Using this assignment option, administrators can benefit from any of Azure AD group management options, including [attribute-based dynamic groups](../fundamentals/active-directory-groups-create-azure-portal.md), external system groups (for example, on-premises Active Directory or Workday), or Administrator-managed or self-service-managed groups. A single group can be easily assigned to multiple apps, making sure that applications with assignment affinity can share assignment rules, reducing the overall management complexity. Note that nested group memberships aren't supported for group-based assignment to applications at this time.

Using these two assignment modes, administrators can achieve any desirable assignment management approach.

### Requiring user assignment for an app

With certain types of applications, you have the option of [requiring users to be assigned to the application](assign-user-or-group-access-portal.md#configure-an-application-to-require-user-assignment). By doing so, you prevent everyone from signing in except those users you explicitly assign to the application. The following types of applications support this option:

* Applications configured for federated single sign-on (SSO) with SAML-based authentication
* Application Proxy applications that use Azure Active Directory Pre-Authentication
* Applications built on the Azure AD application platform that use OAuth 2.0 / OpenID Connect Authentication after a user or admin has consented to that application.Certain enterprise applications offer additional control over who is allowed to sign in.

When user assignment is *not required*, unassigned users don't see the app on their My Apps access panel, but they can still sign in to the application itself (also known as SP-initiated sign-on) or they can use the **User Access URL** in the application’s **Properties** page (also known as IDP-initiated sign on).

For some applications, the option to require user assignment isn't available in the application's properties. In these cases, you can use PowerShell to set the appRoleAssignmentRequired property on the service principal.

### Determining the user experience for accessing apps

Azure AD provides [several customizable ways to deploy applications](end-user-experiences.md) to end users in your organization:

* Azure AD My Apps access panel
* Office 365 application launcher
* Direct sign-on to federated apps (service-pr)
* Deep links to federated, password-based, or existing apps

You can determine whether users assigned to an enterprise app can see it in the access panel and Office 365 application launcher.

## Example: Complex application assignment with Azure AD
Consider an application like Salesforce. In many organizations, Salesforce is primarily used by the marketing and sales teams. Often, members of the marketing team have highly privileged access to Salesforce, while members of the sales team have limited access. In many cases, a broad population of information workers has restricted access to the application. Exceptions to these rules complicate matters. It's often the prerogative of the marketing or sales leadership teams to grant a user access or change their roles independently of these generic rules.

With Azure AD, applications like Salesforce can be pre-configured for single sign-on (SSO) and automated provisioning. Once the application is configured, an Administrator can take the one-time action to create and assign the appropriate groups. In this example, an administrator could execute the following assignments:

* [Dynamic groups](../fundamentals/active-directory-groups-create-azure-portal.md) can be defined to automatically represent all members of the marketing and sales teams using attributes like department or role:
  
  * All members of marketing groups would be assigned to the "marketing" role in Salesforce
  * All members of sales team groups would be assigned to the "sales" role in Salesforce. A further refinement could use multiple groups that represent regional sales teams assigned to different Salesforce roles.

* To enable the exception mechanism, a self-service group could be created for each role. For example, the "Salesforce marketing exception" group can be created as a self-service group. The group can be assigned to the Salesforce marketing role and the marketing leadership team can be made owner. Members of the marketing leadership team could add or remove users, set a join policy, or even approve or deny individual users' requests to join. This mechanism is supported through an information worker appropriate experience that does not require specialized training for owners or members.

In this case, all assigned users would be automatically provisioned to Salesforce, as they are added to different groups their role assignment would be updated in Salesforce. Users would be able to discover and access Salesforce through the Microsoft application access panel, Office web clients, or even by navigating to their organizational Salesforce login page. Administrators would be able to easily view usage and assignment status using Azure AD reporting.

Administrators can employ [Azure AD Conditional Access](../conditional-access/concept-conditional-access-users-groups.md) to set access policies for specific roles. These policies can include whether access is permitted outside the corporate environment and even Multi-Factor Authentication or device requirements to achieve access in various cases.

## Access to Microsoft applications

Microsoft Applications (like Office 365 Exchange, SharePoint, Yammer, etc.) are assigned and managed a bit differently than 3rd party SaaS applications or other applications you integrate with Azure AD for single sign on.

There are three main ways that a user can get access to a Microsoft-published application.

- For applications in the Office 365 or other paid suites, users are granted access through **license assignment** either directly to their user account, or through a group using our group-based license assignment capability.
- For applications that Microsoft or a 3rd party publishes freely for anyone to use, users may be granted access through [user consent](configure-user-consent.md). This means that they sign in to the application with their Azure AD Work or School account and allow it to have access to some limited set of data on their account.
- For applications that Microsoft or a 3rd party publishes freely for anyone to use, users may also be granted access through [administrator consent](manage-consent-requests.md). This means that an administrator has determined the application may be used by everyone in the organization, so they sign in to the application with a Global Administrator account and grant access to everyone in the organization.

Some applications combine these methods. For example, certain Microsoft applications are part of an Office 365 subscription, but still require consent.

Users can access Office 365 applications through their Office 365 portals. You can also show or hide Office 365 applications in the My Apps access panel with the [Office 365 visibility toggle](hide-application-from-user-portal.md) in your directory's **User settings**. 

As with enterprise apps, you can [assign users](assign-user-or-group-access-portal.md) to certain Microsoft applications via the Azure portal or, if the portal option isn't available, by using PowerShell.

## Next steps
* [Protecting apps with Conditional Access](../conditional-access/concept-conditional-access-cloud-apps.md)
* [Self-service group management/SSAA](../users-groups-roles/groups-self-service-management.md)
