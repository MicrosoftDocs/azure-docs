---
title: Configuring multi-tenant user management in Azure Active Directory
description: Learn about the different patterns used to configure user access across Azure Active Directory tenants with guest accounts 
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 09/25/2021
ms.author: jricketts
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Multi-tenant user management 

Provisioning users into a single Azure Active Directory (Azure AD) tenant provides a unified view of resources and a single set of policies and controls. This approach enables consistent user lifecycle management. 

**Microsoft recommends a single tenant when possible**. However, immediate consolidation to a single Azure AD tenant isn't always possible. Multi-tenant organizations may span two or more Azure AD tenants. This can result in unique cross-tenant collaboration and management requirements.

Organizations may have identity and access management (IAM) requirements that are complicated by:

* mergers, acquisitions, and divestitures.

* collaboration across public, sovereign, and or regional clouds.

* political or organizational structures prohibiting consolidation to a single Azure AD tenant.

The guidance also provides guidance to help you achieve a consistent state of user lifecycle management. That is, provisioning, managing, and deprovisioning users across tenants using the tools available with Azure. Specifically, by using [Azure AD B2B collaboration](../external-identities/what-is-b2b.md).

## Azure AD B2B collaboration

Azure AD collaboration enables you to securely share your company's applications and services with external guest users. The users can come from any organization. Using Azure AD B2B collaboration helps you maintain control over access to your IT environment and data. 
Azure AD B2B collaboration can also be used to provide guest access to internal users. Traditionally, B2B guest user access is used to authorize access to external users that aren't managed by your own organization. However, guest user access can also be used to manage access across multiple tenants managed by your organization. While not truly a B2B solution, Azure AD B2B collaboration can be used to manage internal users across your multi-tenant scenario.

The following links provide additional information you can visit to find out more about Azure AD B2B collaboration:

| Article| Description |
| - |-|
| **Conceptual articles**|  |
| [B2B best practices](../external-identities/b2b-fundamentals.md)| Recommendations for the smoothest experience for your users and administrators.|  
| [B2B and Office 365 external sharing](../external-identities/o365-external-user.md)| Explains the similarities and differences among sharing resources through B2B, office 365, and SharePoint/OneDrive.|  
| [Properties on an Azure AD B2B collaboration user](../external-identities/user-properties.md)| Describes the properties and states of the B2B guest user object in Azure Active Directory (Azure AD). The description provides details before and after invitation redemption.|  
| [B2B user tokens](../external-identities/user-token.md)| Provides examples of the bearer tokens for B2B a B2B guest user.|  
| [Conditional access for B2B](../external-identities/authentication-conditional-access.md)| Describes how conditional access and MFA work for guest users.|  
| **How-to articles**|  |
| [Use PowerShell to bulk invite Azure AD B2B collaboration users](../external-identities/bulk-invite-powershell.md)| Learn how to use PowerShell to send bulk invitations to external users.|
| [Enforce multifactor authentication for B2B guest users](../external-identities/b2b-tutorial-require-mfa.md)|Use conditional access and MFA policies to enforce tenant, app, or individual guest user authentication levels. |
| [Email one-time passcode authentication](../external-identities/one-time-passcode.md)| The Email one-time passcode feature authenticates B2B guest users when they can't be authenticated through other means like Azure AD, a Microsoft account (MSA), or Google federation.|

## Terminology

These terms are used throughout this content:

* **Resource tenant**: The Azure AD tenant containing the resources that users want to share with others.

* **Home tenant**: The Azure AD tenant containing users requiring access to the resources in the resource tenant.

* **User lifecycle management**: the process of provisioning, managing, and deprovisioning user access to resources.

* **Unified GAL**: Each user in each tenant can see users from each organization in their Global Address List (GAL).

## Deciding how to meet your requirements

Your organization’s unique requirements will determine your strategy for managing your users across tenants. To create an effective strategy, you must consider:

* Number of tenants

* Type of organization

* Current topologies

* Specific user synchronization needs 

### Common Requirements

Many organizations initially focus on requirements they want in place for immediate collaboration. Sometimes known as Day One requirements, these requirements focus on enabling end users to merge smoothly without interrupting their ability to generate value for the company. As you define your Day One and administrative requirements, consider including these goals: 

| Requirement categories| Common needs|
| ------------ | - |
| **Communications Requirements**|  |
| Unified global address list| Each user can see all other users in the GAL in their home tenant. |
| Free/Busy information| Enable users to discover each other’s availability. You can do this with [Organization relationships in Exchange Online](/exchange/sharing/organization-relationships/create-an-organization-relationship).|
| Chat and presence| Enable users to determine others’ presence and initiate instant messaging. This can be configured through [external access in Microsoft Teams](/microsoftteams/manage-external-access).|
| Book resources such as meeting rooms| Enable users to book conference rooms or other resources across the organization. Cross-tenant conference room booking isn't possible today.|
‎Single email domain| Enable all users to send and receive mail from a single email domain, for example *users@contoso.com*. Sending requires a third party address rewrite solution today.|
| **Access requirements**|  |
| Document access| Enable users to share documents from SharePoint, OneDrive, and Teams |
| Administration| Allow administrators to manage configuration of subscriptions and services deployed across multiple tenants |
| Application access| Allow end users to access applications across the organization |
| Single Sign-on| Enable users to access resources across the organization without the need to enter more credentials.|

### Patterns for account creation 

There are several mechanisms available for creating and managing the lifecycle of your guest user accounts. Microsoft has distilled three common patterns. You can use the patterns to help define and implement your requirements. Choose which best aligns with your scenario and then focus on the details for that pattern.

| Mechanism |  Description | Best when |
| - | - | - |
| [End-user-initiated](multi-tenant-user-management-scenarios.md#end-user-initiated-scenario) | Resource tenant admins delegate the ability to invite guest users to the tenant, an app, or a resource to users within the resource tenant. Users from the home tenant are invited or sign up individually. |  <li>Users need improvised access to resources. <li>No automatic synchronization of user attributes is necessary.<li>Unified GAL is not needed. |
|[Scripted](multi-tenant-user-management-scenarios.md#scripted-scenario) | Resource tenant administrators deploy a scripted “pull” process to automate discovery and provisioning of guest users to support sharing scenarios. |  <li>No more than two tenants.<li>No automatic synchronization of user attributes is necessary.<li>Users need pre-configured (not improvised) access to resources.|
|[Automated](multi-tenant-user-management-scenarios.md#automated-scenario)|Resource tenant admins use an identity provisioning system to automate the provisioning and deprovisioning processes. |  <li>Full identity lifecycle management with provisioning and deprovisioning must be automated.<li>Attribute syncing is required to populate the GAL details and support dynamic entitlement scenarios.<li>Users need pre-configured (not ad hoc) access to resources on “Day One”.|

  
## Next steps

[Multi-tenant user management scenarios](multi-tenant-user-management-scenarios.md)

[Multi-tenant common considerations](multi-tenant-common-considerations.md)

[Multi-tenant common solutions](multi-tenant-common-solutions.md)
  
[Multi-tenant synchronization from Active Directory](../hybrid/plan-connect-topologies.md#multiple-azure-ad-tenants)
