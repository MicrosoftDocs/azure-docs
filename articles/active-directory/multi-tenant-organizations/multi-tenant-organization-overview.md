---
title: What is a multi-tenant organization in Microsoft Entra ID? (Preview)
description: Learn about multi-tenant organizations in Microsoft Entra ID and Microsoft 365.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: multi-tenant-organizations
ms.topic: overview
ms.date: 09/14/2023
ms.author: rolyon
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# What is a multi-tenant organization in Microsoft Entra ID? (Preview)

> [!IMPORTANT]
> Multi-tenant organization is currently in PREVIEW.
> See the [Product Terms](https://aka.ms/EntraPreviewsTermsOfUse) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Multi-tenant organization is a feature in Microsoft Entra ID and Microsoft 365 that enables you to form a tenant group within your organization. Each pair of tenants in the group is governed by cross-tenant access settings that you can use to configure B2B or cross-tenant synchronization.

## Why use multi-tenant organization?

Here are the primary goals of multi-tenant organization:

- Define a group of tenants belonging to your organization
- Collaborate across your tenants in new Microsoft Teams
- Enable search and discovery of user profiles across your tenants through Microsoft 365 people search

## Who should use it?

Organizations that own multiple Microsoft Entra tenants and want to streamline intra-organization cross-tenant collaboration in Microsoft 365.

The multi-tenant organization capability is built on the assumption of reciprocal provisioning of B2B member users across multi-tenant organization tenants.

As such, the multi-tenant organization capability assumes the simultaneous use of Microsoft Entra cross-tenant synchronization or an alternative bulk provisioning engine for [external identities](../external-identities/user-properties.md).

## Benefits

Here are the primary benefits of a multi-tenant organization:

- Differentiate in-organization and out-of-organization external users

    In Microsoft Entra ID, external users originating from within a multi-tenant organization can be differentiated from external users originating from outside the multi-tenant organization. This differentiation facilitates the application of different policies for in-organization and out-of-organization external users.
- Improved collaborative experience in Microsoft Teams

    In new Microsoft Teams, multi-tenant organization users can expect an improved collaborative experience across tenants with chat, calling, and meeting start notifications from all connected tenants across the multi-tenant organization. Tenant switching is more seamless and faster. For more information, see [Announcing more seamless collaboration in Microsoft Teams for multi-tenant organizations](https://techcommunity.microsoft.com/t5/microsoft-teams-blog/announcing-more-seamless-collaboration-in-microsoft-teams-for/ba-p/3901092) and [Microsoft Teams: Advantages of the new architecture](https://techcommunity.microsoft.com/t5/microsoft-teams-blog/microsoft-teams-advantages-of-the-new-architecture/ba-p/3775704).

- Improved people search experience across tenants

    Across Microsoft 365 services, the multi-tenant organization people search experience is a collaboration feature that enables search and discovery of people across multiple tenants. Once enabled, users are able to search and discover synced user profiles in a tenant's global address list and view their corresponding people cards. For more information, see [Microsoft 365 multi-tenant organization people search (public preview)](/microsoft-365/enterprise/multi-tenant-people-search).

## How does a multi-tenant organization work?

The multi-tenant organization capability enables you to form a tenant group within your organization. The following list describes the basic lifecycle of a multi-tenant organization.

- Define a multi-tenant organization

    One tenant administrator defines a multi-tenant organization as a grouping of tenants. The grouping of tenants isn't reciprocal until each listed tenant takes action to join the multi-tenant organization. The objective is a reciprocal agreement between all listed tenants.

- Join a multi-tenant organization

    Tenant administrators of listed tenants take action to join the multi-tenant organization. After joining, the multi-tenant organization relationship is reciprocal between each and every tenant that joined the multi-tenant organization.

- Leave a multi-tenant organization

    Tenant administrators of listed tenants can leave a multi-tenant organization at any time. While a tenant administrator who defined the multi-tenant organization can add and remove listed tenants they don't control the other tenants.

A multi-tenant organization is established as a collaboration of equals. Each tenant administrator stays in control of their tenant and their membership in the multi-tenant organization.

## Cross-tenant access settings

Administrators staying in control of their resources is a guiding principle for multi-tenant organization collaboration. Cross-tenant access settings are required for each tenant-to-tenant relationship. Tenant administrators explicitly configure, as needed, the following policies:

- Cross-tenant access partner configurations

    For more information, see [Configure cross-tenant access settings for B2B collaboration](../external-identities/cross-tenant-access-settings-b2b-collaboration.md) and [crossTenantAccessPolicyConfigurationPartner resource type](/graph/api/resources/crosstenantaccesspolicyconfigurationpartner?view=graph-rest-beta&preserve-view=true).

- Cross-tenant access identity synchronization

    For more information, see [Configure cross-tenant synchronization](cross-tenant-synchronization-configure.md) and [crossTenantIdentitySyncPolicyPartner resource type](/graph/api/resources/crosstenantidentitysyncpolicypartner).

## Multi-tenant organization example

The following diagram shows three tenants A, B, and C that form a multi-tenant organization.

:::image type="content" source="./media/common/multi-tenant-organization-topology.png" alt-text="Diagram that shows a multi-tenant organization topology and cross-tenant access settings." lightbox="./media/common/multi-tenant-organization-topology.png":::

| Tenant | Description |
| :---: | --- |
| A | Administrators see a multi-tenant organization consisting of A, B, C.<br/>They also see cross-tenant access settings for B and C. |
| B | Administrators see a multi-tenant organization consisting of A, B, C.<br/>They also see cross-tenant access settings for A and C. |
| C | Administrators see a multi-tenant organization consisting of A, B, C.<br/>They also see cross-tenant access settings for A and B. |

## Templates for cross-tenant access settings

To ease the setup of homogenous cross-tenant access settings applied to partner tenants in the multi-tenant organization, the administrator of each multi-tenant organization tenant can configure optional cross-tenant access settings templates dedicated to the multi-tenant organization. These templates can be used to preconfigure cross-tenant access settings that are applied to any partner tenant newly joining the multi-tenant organization.

## Tenant role and state

To facilitate the management of a multi-tenant organization, any given multi-tenant organization tenant has an associated role and state.

| Tenant role | Description |
| --- | --- |
| Owner | One tenant creates the multi-tenant organization. The multi-tenant organization creating tenant receives the role of owner. The privilege of the owner tenant is to add tenants into a pending state as well as to remove tenants from the multi-tenant organization. Also, an owner tenant can change the role of other multi-tenant organization tenants. |
| Member | Following the addition of pending tenants to the multi-tenant organization, pending tenants need to join the multi-tenant organization to turn their state from pending to active. Joined tenants typically start in the member role. Any member tenant has the privilege to leave the multi-tenant organization. |

| Tenant state | Description |
| --- | --- |
| Pending | A pending tenant has yet to join a multi-tenant organization. While listed in an administrator’s view of the multi-tenant organization, a pending tenant isn't yet part of the multi-tenant organization, and as such is hidden from an end user’s view of a multi-tenant organization. |
| Active | Following the addition of pending tenants to the multi-tenant organization, pending tenants need to join the multi-tenant organization to turn their state from pending to active. Joined tenants typically start in the member role. Any member tenant has the privilege to leave the multi-tenant organization. |

## Constraints

The multi-tenant organization capability has been designed with the following constraints:

- Any given tenant can only create or join a single multi-tenant organization.
- Any multi-tenant organization must have at least one active owner tenant.
- Each active tenant must have cross-tenant access settings for all active tenants.
- Any active tenant may leave a multi-tenant organization by removing themselves from it.
- A multi-tenant organization is deleted when the only remaining active (owner) tenant leaves.

## External user segmentation

By defining a multi-tenant organization, as well as pivoting on the Microsoft Entra user property of userType, [external identities](../external-identities/user-properties.md) are segmented as follows:

- External members originating from within a multi-tenant organization
- External guests originating from within a multi-tenant organization
- External members originating from outside of your organization
- External guests originating from outside of your organization

This segmentation of external users, due to the definition of a multi-tenant organization, enables administrators to better differentiate in-organization from out-of-organization external users.

External members originating from within a multi-tenant organization are called multi-tenant organization members.

Multi-tenant collaboration capabilities in Microsoft 365 aim to provide a seamless collaboration experience across tenant boundaries when collaborating with multi-tenant organization member users.

## Get started

Here are the basic steps to get started using multi-tenant organization.

### Step 1: Plan your deployment

For more information, see [Plan for multi-tenant organizations in Microsoft 365 (Preview)](/microsoft-365/enterprise/plan-multi-tenant-org-overview).

### Step 2: Create your multi-tenant organization

Create your multi-tenant organization using [Microsoft 365 admin center](/microsoft-365/enterprise/set-up-multi-tenant-org) or [Microsoft Graph API](multi-tenant-organization-configure-graph.md):

- First tenant, soon-to-be owner tenant, creates a multi-tenant organization.
- Owner tenant adds one or more joiner tenants.
- To allow for asynchronous processing, wait a **minimum of 2 hours**.

### Step 3: Join a multi-tenant organization

Join a multi-tenant organization using [Microsoft 365 admin center](/microsoft-365/enterprise/join-leave-multi-tenant-org) or [Microsoft Graph API](multi-tenant-organization-configure-graph.md):

- Joiner tenants submit a join request to join the multi-tenant organization of owner tenant.
- To allow for asynchronous processing, wait **up to 4 hours**.

Your multi-tenant organization is formed.

### Step 4: Synchronize users

Depending on your use case, you may want to synchronize users using one of the following methods:

- [Synchronize users in multi-tenant organizations in Microsoft 365 (Preview)](/microsoft-365/enterprise/sync-users-multi-tenant-orgs)
- [Configure cross-tenant synchronization](cross-tenant-synchronization-configure.md)
- [Configure cross-tenant synchronization using PowerShell or Microsoft Graph API](cross-tenant-synchronization-configure-graph.md)
- Your alternative bulk provisioning engine

## Limits

Multi-tenant organizations have the following limits:

- A maximum of five active tenants per multi-tenant organization
- A maximum of 100,000 internal users per active tenant at the time of joining

If you want to add more than five tenants or 100,000 internal users per tenant, contact Microsoft support.

## License requirements

The multi-tenant organization capability is in preview, and you can start using it if you have Microsoft Entra ID P1 licenses or above in all multi-tenant organization tenants. Licensing terms will be released at general availability. To find the right license for your requirements, see [Compare generally available features of Microsoft Entra ID](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

## Next steps

- [Plan for multi-tenant organizations in Microsoft 365 (Preview)](/microsoft-365/enterprise/plan-multi-tenant-org-overview)
- [What is cross-tenant synchronization?](cross-tenant-synchronization-overview.md)
