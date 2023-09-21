---
title: Configuring multi-tenant user management in Microsoft Entra ID
description: Learn about the different patterns used to configure user access across Microsoft Entra tenants with guest accounts 
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 04/19/2023
ms.author: jricketts
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---
# Multi-tenant user management introduction

This article is the first in a series of articles that provide guidance for configuring and providing user lifecycle management in Microsoft Entra multi-tenant environments. The following articles in the series provide more information as described.

- [Multi-tenant user management scenarios](multi-tenant-user-management-scenarios.md) describes three scenarios for which you can use multi-tenant user management features: end user-initiated, scripted, and automated.
- [Common considerations for multi-tenant user management](multi-tenant-common-considerations.md) provides guidance for these considerations: cross-tenant synchronization, directory object, Microsoft Entra Conditional Access, additional access control, and Office 365. 
- [Common solutions for multi-tenant user management](multi-tenant-common-solutions.md) when single tenancy doesn't work for your scenario, this article provides guidance for these challenges:  automatic user lifecycle management and resource allocation across tenants, sharing on-premises apps across tenants.

The guidance helps to you achieve a consistent state of user lifecycle management. Lifecycle management includes provisioning, managing, and deprovisioning users across tenants using the available Azure tools that include [Microsoft Entra B2B collaboration](../external-identities/what-is-b2b.md) (B2B) and [cross-tenant synchronization](../multi-tenant-organizations/cross-tenant-synchronization-overview.md).

Provisioning users into a single Microsoft Entra tenant provides a unified view of resources and a single set of policies and controls. This approach enables consistent user lifecycle management.

Microsoft recommends a single tenant when possible. Having multiple tenants can result in unique cross-tenant collaboration and management requirements. When consolidation to a single Microsoft Entra tenant isn't possible, multi-tenant organizations may span two or more Microsoft Entra tenants for reasons that include the following.

- Mergers
- Acquisitions
- Divestitures
- Collaboration across public, sovereign, and regional clouds
- Political or organizational structures that prohibit consolidation to a single Microsoft Entra tenant

<a name='azure-ad-b2b-collaboration'></a>

## Microsoft Entra B2B collaboration

Microsoft Entra B2B collaboration (B2B) enables you to securely share your company's applications and services with external users. When users can come from any organization, B2B helps you maintain control over access to your IT environment and data.

You can use B2B collaboration to provide external access for your organization's users to access multiple tenants that you manage. Traditionally, B2B external user access can authorize access to users that your own organization doesn't manage. However, external user access can manage access across multiple tenants that your organization manages.

An area of confusion with Microsoft Entra B2B collaboration surrounds the [properties of a B2B guest user](../external-identities/user-properties.md). The difference between internal versus external user accounts and member versus guest user types contributes to confusion. Initially, all internal users are member users with **UserType** attribute set to *Member* (member users). An internal user has an account in your Microsoft Entra ID that is authoritative and authenticates to the tenant where the user resides. A member user is a licensed user with default [member-level permissions](../fundamentals/users-default-permissions.md) in the tenant. Treat member users as employees of your organization.

You can invite an internal user of one tenant into another tenant as an external user. An external user signs in with an external Microsoft Entra account, social identity, or other external identity provider. External users authenticate outside the tenant to which you invite the external user. At the B2B first release, all external users were of **UserType** *Guest* (guest users). Guest users have [restricted permissions](../fundamentals/users-default-permissions.md) in the tenant. For example, guest users can't enumerate the list of all users nor groups in the tenant directory.

For the **UserType** property on users, B2B supports flipping the bit from internal to external, and vice versa, which contributes to the confusion.

You can change an internal user from member user to guest user. For example, you can have an unlicensed internal guest user with guest-level permissions in the tenant, which is useful when you provide a user account and credentials to a person that isn't an employee of your organization.

You can change an external user from guest user to member user, giving member-level permissions to the external user. Making this change is useful when you manage multiple tenants for your organization and need to give member-level permissions to a user across all tenants. This need may occur regardless of whether the user is internal or external in any given tenant. Member users may require more [licenses](../external-identities/external-identities-pricing.md).

Most documentation for B2B refers to an external user as a guest user. It conflates the **UserType** property in a way that assumes all guest users are external. When documentation calls out a guest user, it assumes that it's an external guest user. This article specifically and intentionally refers to external versus internal and member user versus guest user.

## Cross-tenant synchronization

[Cross-tenant synchronization](../multi-tenant-organizations/cross-tenant-synchronization-overview.md) enables multi-tenant organizations to provide seamless access and collaboration experiences to end users, leveraging existing B2B external collaboration capabilities. The feature doesn't allow cross-tenant synchronization across Microsoft sovereign clouds (such as Microsoft 365 US Government GCC High, DOD or Office 365 in China). See [Common considerations for multi-tenant user management](multi-tenant-common-considerations.md#cross-tenant-synchronization) for help with automated and custom cross-tenant synchronization scenarios.

Watch Arvind Harinder talk about the cross-tenant sync capability in Microsoft Entra ID (embedded below).

> [!VIDEO https://www.youtube.com/embed/7B-PQwNfGBc]

The following conceptual and how-to articles provide information about Microsoft Entra B2B collaboration and cross-tenant synchronization.

### Conceptual articles

- [B2B best practices](../external-identities/b2b-fundamentals.md) features recommendations for providing the smoothest experience for users and administrators.
- [B2B and Office 365 external sharing](../external-identities/what-is-b2b.md) explains the similarities and differences among sharing resources through B2B, Office 365, and SharePoint/OneDrive.
- [Properties on a Microsoft Entra B2B collaboration user](../external-identities/user-properties.md) describes the properties and states of the external user object in Microsoft Entra ID. The description provides details before and after invitation redemption.
- [B2B user tokens](../external-identities/user-token.md) provides examples of the bearer tokens for B2B for an external user.
- [Conditional Access for B2B](../external-identities/authentication-conditional-access.md) describes how Conditional Access and MFA work for external users.
- [Cross-tenant access settings](../external-identities/cross-tenant-access-overview.md) provides granular control over how external Microsoft Entra organizations collaborate with you (inbound access) and how your users collaborate with external Microsoft Entra organizations (outbound access).
- [Cross-tenant synchronization overview](../multi-tenant-organizations/cross-tenant-synchronization-overview.md) explains how to automate creating, updating, and deleting Microsoft Entra B2B collaboration users across tenants in an organization.

### How-to articles

- [Use PowerShell to bulk invite Microsoft Entra B2B collaboration users](../external-identities/bulk-invite-powershell.md) describes how to use PowerShell to send bulk invitations to external users.
- [Enforce multifactor authentication for B2B guest users](../external-identities/b2b-tutorial-require-mfa.md) explains how you can use Conditional Access and MFA policies to enforce tenant, app, or individual external user authentication levels.
- [Email one-time passcode authentication](../external-identities/one-time-passcode.md) describes how the Email one-time passcode feature authenticates external users when they can't authenticate through other means like Microsoft Entra ID, a Microsoft account (MSA), or Google Federation.

## Terminology

The following terms in Microsoft content refer to multi-tenant collaboration in Microsoft Entra ID.

- **Resource tenant:** The Microsoft Entra tenant containing the resources that users want to share with others.
- **Home tenant:** The Microsoft Entra tenant containing users that require access to the resources in the resource tenant.
- **Internal user:** An internal user has an account that is authoritative and authenticates to the tenant where the user resides.
- **External user:** An external user has an external Microsoft Entra account, social identity, or other external identity provider to sign in. The external user authenticates somewhere outside the tenant to which you have invited the external user.
- **Member user:** An internal or external member user is a licensed user with default member-level permissions in the tenant. Treat member users as employees of your organization.
- **Guest user:** An internal or external guest user has restricted permissions in the tenant. Guest users aren't employees of your organization (such as users for partners). Most B2B documentation refers to B2B Guests, which primarily refers to external guest user accounts.
- **User lifecycle management:** The process of provisioning, managing, and deprovisioning user access to resources.
- **Unified GAL:** Each user in each tenant can see users from each organization in their Global Address List (GAL).

## Deciding how to meet your requirements

Your organization's unique requirements influence your strategy for managing users across tenants. To create an effective strategy, consider the following requirements.

- Number of tenants
- Type of organization
- Current topologies
- Specific user synchronization needs

### Common requirements

Organizations initially focus on requirements that they want in place for immediate collaboration. Sometimes called *Day One* requirements, they focus on enabling end users to smoothly merge without interrupting their ability to generate value. As you define Day One and administrative requirements, consider including the following requirements and needs.

### Communications requirements

- **Unified global address list:** Each user can see all other users in the GAL in their home tenant.
- **Free/busy information:** Enable users to discover each other's availability. You can do so with [Organization relationships in Exchange Online](/exchange/sharing/organization-relationships/create-an-organization-relationship).
- **Chat and presence:** Enable users to determine others' presence and initiate instant messaging. Configure through [external access in Microsoft Teams](/microsoftteams/trusted-organizations-external-meetings-chat).
- **Book resources such as meeting rooms:** Enable users to book conference rooms or other resources across the organization. Cross-tenant conference room booking isn't currently available.
- **Single email domain:** Enable all users to send and receive mail from a single email domain (for example, `users@contoso.com`). Sending requires an email address rewrite solution.

### Access requirements

- **Document access:** Enable users to share documents from SharePoint, OneDrive, and Teams.
- **Administration:** Allow administrators to manage configuration of subscriptions and services deployed across multiple tenants.
- **Application access:** Allow end users to access applications across the organization.
- **Single Sign On:** Enable users to access resources across the organization without the need to enter more credentials.
### Patterns for account creation 

Microsoft mechanisms for creating and managing the lifecycle of your external user accounts follow three common patterns. You can use these patterns to help define and implement your requirements. Choose the pattern that best aligns with your scenario and then focus on the pattern details.  

| Mechanism |  Description | Best when |
| - | - | - |
| [End user-initiated](multi-tenant-user-management-scenarios.md#end-user-initiated-scenario) | Resource tenant admins delegate the ability to invite external users to the tenant, an app, or a resource to users within the resource tenant. You can invite users from the home tenant or they can individually sign up. |  Unified Global Address List on Day One not required. |
|[Scripted](multi-tenant-user-management-scenarios.md#scripted-scenario) | Resource tenant administrators deploy a scripted *pull* process to automate discovery and provisioning of external users to support sharing scenarios. |  Small number of tenants (such as two). |
|[Automated](multi-tenant-user-management-scenarios.md#automated-scenario)| Resource tenant admins use an identity provisioning system to automate the provisioning and deprovisioning processes. |  You need Unified Global Address List across tenants. |
  
## Next steps

- [Multi-tenant user management scenarios](multi-tenant-user-management-scenarios.md) describes three scenarios for which you can use multi-tenant user management features: end user-initiated, scripted, and automated.
- [Common considerations for multi-tenant user management](multi-tenant-common-considerations.md) provides guidance for these considerations: cross-tenant synchronization, directory object, Microsoft Entra Conditional Access, additional access control, and Office 365. 
- [Common solutions for multi-tenant user management](multi-tenant-common-solutions.md) when single tenancy doesn't work for your scenario, this article provides guidance for these challenges:  automatic user lifecycle management and resource allocation across tenants, sharing on-premises apps across tenants.
- [Multi-tenant synchronization from Active Directory](../hybrid/connect/plan-connect-topologies.md) describes various on-premises and Microsoft Entra topologies that use Microsoft Entra Connect Sync as the key integration solution.
