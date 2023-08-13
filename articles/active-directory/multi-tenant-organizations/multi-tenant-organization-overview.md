---
title: What is a multi-tenant organization in Azure Active Directory? (Preview)
description: Learn about multi-tenant organizations in Azure Active Directory.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: multi-tenant-organizations
ms.topic: overview
ms.date: 05/05/2023
ms.author: rolyon
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# What is a multi-tenant organization in Azure Active Directory? (Preview)

> [!IMPORTANT]
> Multi-tenant organization is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Multi-tenant organization is a new feature (currently available in public preview) for Microsoft Entra and Microsoft 365 customers. The multi-tenant organization capability allows you to form a tenant group within your organization. Each pair of tenants in the group is governed by cross-tenant access settings that you can use to configure B2B or cross-tenant synchronization.

## Why use multi-tenant organization?

Here are the primary goals of multi-tenant organization:

- Define a group of tenants belonging to your organization
- Collaborate across your tenants in new Teams
- Connect with colleagues across your tenants in Viva Engage
- Enable search and discovery of user profiles across your tenants through M365 People Search

## Who should use it?

Organizations that own multiple Azure AD tenants and want to streamline intra-organization cross-tenant collaboration in M365.

The multi-tenant organization capability is built on the assumption of reciprocal provisioning of B2B member users across multi-tenant organization tenants.

As such, the multi-tenant organization capability assumes the simultaneous use of Azure AD cross-tenant synchronization or an alternative bulk provisioning engine for external identities.

## Benefits

- In Microsoft Entra or Azure AD, external users originating from within a multi-tenant organization can be differentiated from external users originating from outside the multi-tenant organization, thereby facilitating the application of different policies for in-org and out-of-org external users.
- In new Microsoft Teams, multi-tenant organization users can expect a smooth and improved collaborative experience across tenants with chat, calling, and meeting start notifications from all connected tenants across the multi-tenant organization. Tenant switching will be seamless and significantly faster than ever before. Learn more.
- Across Microsoft 365 services, the multi-tenant organization People Search experience is a collaboration feature that enables search and discovery of people across multiple tenants. Once enabled, users will be able to search and discover synced user profiles in a tenant's global address list and view their corresponding people cards. Learn more.

## How does a multi-tenant organization work?

The multi-tenant organization capability allows you to form a tenant group within your organization.

- Defining a Multi-tenant Organization: One tenant admin will define a multi-tenant organization as a grouping of tenants. The grouping of tenants is not reciprocal until each listed tenant takes action to join the multi-tenant organization. The objective is a reciprocal agreement between all listed tenants.
- Joining a Multi-tenant Organization: Tenant admins of listed tenants take action to join the multi-tenant organization. After joining, the multi-tenant organization relationship is reciprocal between each and every tenant that joined the multi-tenant organization.
- Leaving a Multi-tenant Organization: Tenant admins of listed tenants can leave a multi-tenant organization at any time. While a tenant admin who defined the multi-tenant organization can add and remove listed tenants, he or she does not control the other tenants.

A multi-tenant organization is established as a collaboration of equals. Each tenant admin stays in control of their tenant and their membership in the multi-tenant organization.

## Cross-tenant access settings

Admins staying in control of their resources is a guiding principle for multi-tenant organization collaboration. Cross-tenant access settings are required for each tenant-to-tenant relationship. Tenant admins will explicitly configure, as needed, the following policies:

- Cross-tenant access partner configurations -> Learn more in Entra.  Learn more in MS Graph.
- Cross-tenant access identity synchronization -> Learn more in Entra. Learn more in MS Graph.

## Multi-tenant organization example

Example: Three tenants A, B, and C form a multi-tenant organization.

:::image type="content" source="./media/common/multi-tenant-organization-topology.png" alt-text="Diagram that shows a multi-tenant organization topology and cross-tenant access settings." lightbox="./media/common/multi-tenant-organization-topology.png":::

Tenant A: Admins will see a multi-tenant organization consisting of A, B, C. They will also see cross-tenant access settings for B and C.

Tenant B: Admins will see a multi-tenant organization consisting of A, B, C. They will also see cross-tenant access settings for A and C. 

Tenant C: Admins will see a multi-tenant organization consisting of A, B, C. They will also see cross-tenant access settings for A and B.

## Templates for cross-tenant access settings

To ease the setup of homogenous cross-tenant access settings applied to partner tenants in the multi-tenant organization, the administrator of each multi-tenant organization tenant can configure optional cross-tenant access settings templates dedicated to the multi-tenant organization, which can be used to pre-configure cross-tenant access settings that will be applied to any partner tenant newly joining the multi-tenant organization.

## Tenant role and state

To facilitate the management of a multi-tenant organization, any given multi-tenant organization tenant has an associated role and state:

- Owner role: One tenant creates the multi-tenant organization. The multi-tenant org creating tenant receives the role of owner. The privilege of the owner tenant is to add tenants into a pending states as well as to remove tenants from the multi-tenant org. Also, an owner tenant can change the role of other multi-tenant org tenants.
- Member role: Following the addition of pending tenants to the multi-tenant organization, pending tenants need to join the multi-tenant org to turn their state from pending to active. Joined tenants typically start in the member role. Any member tenant has the privilege to leave the MTO.
- Pending state: A pending tenant has yet to join a multi-tenant organization. While listed in an administrator’s view of the multi-tenant organization, a pending tenant is not yet part of the multi-tenant organization, and as such is hidden from an end user’s view of a multi-tenant organization.
- Active state: Following the addition of pending tenants to the multi-tenant organization, pending tenants need to join the multi-tenant org to turn their state from pending to active. Joined tenants typically start in the member role. Any member tenant has the privilege to leave the MTO.

## Design constraints

The multi-tenant organization capability has been designed to the following constraints:

- Any given tenant can only create or join a single multi-tenant organization.
- Any multi-tenant organization must have at least one active owner tenant.
- Each active tenant must have cross-tenant access settings for all active tenants.
- Any active tenant may leave a multi-tenant organization by removing themselves from it.
- A multi-tenant organization is deleted when the only remaining active (owner) tenant leaves.

## External user segmentation

By defining a multi-tenant organization, as well as pivoting on the Azure AD user property of userType, external identities will be segmented as follows:

- External members originating from within a multi-tenant organization
- External guests originating from within a multi-tenant organization
- External members originating from outside of your organization
- External guests originating from outside of your organization

This segmentation of external users, due to the definition of a multi-tenant organization, will allow admins to better manage differentiate in-org from out-of-org external users.

External members originating from within a multi-tenant organization are called multi-tenant organization members.

Multi-tenant collaboration capabilities in M365 aim to provide a seamless collaboration experience across tenant boundaries when collaborating with multi-tenant organization member users.

## Get Started

Plan your deployment. Learn more about multi-tenant collaboration.

Create your multi-tenant organization via Set up in M365 admin center or via Graph API:

- Step 1: First tenant, soon-to-be owner tenant, creates a multi-tenant organization.
- Step 2: Owner tenant adds one or more joiner tenants.
- Step 3: Current asynchronous processing time is up to 2 hours. Wait for at least 2 hours. 

The order of steps 2 and 3 may be interchanged.

Join a multi-tenant organization via Join in M365 admin center or Graph API:

- Step 4: Joiner tenants submit a join request to join the multi-tenant org of owner tenant.
- Step 5: Current asynchronous processing time is up to 4 hours. Wait for up to 4 hours.

Your multi-tenant organization will have been formed.

Depending on your use case, you may want to synchronize users using

- Synchronize users in M365 admin center,
- Cross-tenant synchronization in Entra,
- Cross-tenant synchronization using Graph API, or
- your alternative bulk provisioning engine.

## Size limitation

Multi-tenant organizations are currently limited in size to the following:

- A maximum of five active tenants per multi-tenant organization
- A maximum of 100,000 internal users per active tenant at the time of joining

If you want to add more than five tenants or 100,000 internal users per tenant, contact Microsoft support.

## License requirements

To participate in public preview of multi-tenant organization capabilities, you will need Azure AD Premium P1 licenses in all multi-tenant organization tenants. To find the right license for your requirements, see Compare generally available features of Azure AD.

## Next steps

- [What is cross-tenant synchronization?](cross-tenant-synchronization-overview.md)
