---
title: Common solutions for multi-tenant user management in Azure Active Directory
description: Learn about common solutions used to configure user access across Azure Active Directory tenants with guest accounts 
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
# Common solutions for multi-tenant user management

This article is the fourth in a series of articles that provide guidance for configuring and providing user lifecycle management in Azure Active Directory (Azure AD) multi-tenant environments. The following articles in the series provide more information as described.

- [Multi-tenant user management introduction](multi-tenant-user-management-introduction.md) is the first in the series.
- [Multi-tenant user management scenarios](multi-tenant-user-management-scenarios.md) describes three scenarios for which you can use multi-tenant user management features: end user-initiated, scripted, and automated.
- [Common considerations for multi-tenant user management](multi-tenant-common-considerations.md) provides guidance for these considerations: cross-tenant synchronization, directory object, Azure AD Conditional Access, additional access control, and Office 365. 

The guidance helps to you achieve a consistent state of user lifecycle management. Lifecycle management includes provisioning, managing, and deprovisioning users across tenants using the available Azure tools that include [Azure AD B2B collaboration](../external-identities/what-is-b2b.md) (B2B) and [cross-tenant synchronization](../multi-tenant-organizations/cross-tenant-synchronization-overview.md).

Microsoft recommends a single tenant wherever possible. If single tenancy doesn't work for your scenario, reference the following solutions that Microsoft customers have successfully implemented for these challenges:

- Automatic user lifecycle management and resource allocation across tenants
- Sharing on-premises apps across tenants

## Automatic user lifecycle management and resource allocation across tenants

A customer acquires a competitor with whom they previously had close business relationships. The organizations want to maintain their corporate identities.

### Current state

Currently, the organizations are synchronizing each other's users as mail contact objects so that they show in each other's directories. Each resource tenant has enabled mail contact objects for all users in the other tenant. Across tenants, no access to applications is possible.

### Goals

The customer has the following goals.

- Every user appears in each organization's GAL.
    - User account lifecycle changes in the home tenant automatically reflected in the resource tenant GAL.
    - Attribute changes in home tenants (such as department, name, SMTP address) automatically reflected in resource tenant GAL and the home GAL.
- Users can access applications and resources in the resource tenant.
- Users can self-serve access requests to resources.

### Solution architecture

The organizations use a point-to-point architecture with a synchronization engine such as Microsoft Identity Manager (MIM). The following diagram illustrates an example of point-to-point architecture for this solution.

:::image type="complex" source="media/multi-tenant-common-solutions/diagram-point-to-point-sync-inline.png" alt-text="Diagram illustrates the point-to-point architecture solution." lightbox="media/multi-tenant-common-solutions/diagram-point-to-point-sync-expanded.png":::
    Diagram title: Point-to-point architecture solution. On the left, a box labeled Company A contains internal users and external users. On the right, a box labeled Company B contains internal users and external users. Between Company A and Company B, sync engine interactions go from Company A to Company B and from Company B to Company A.
:::image-end:::

Each tenant admin performs the following steps to create the user objects.

1. Ensure that their user database is up to date.
1. [Deploy and configure MIM](/microsoft-identity-manager/microsoft-identity-manager-deploy).
    1. Address existing contact objects.
    1. Create external member user objects for the other tenant's internal member users.
    1. Synchronize user object attributes.
1. Deploy and configure [Entitlement Management](../governance/entitlement-management-overview.md) access packages.
    1. Resources to be shared.
    1. Expiration and access review policies.

## Sharing on-premises apps across tenants

A customer with multiple peer organizations needs to share on-premises applications from one of the tenants.

### Current state

Peer organizations are synchronizing external users in a mesh topology, enabling resource allocation to cloud applications across tenants. The customer offers following functionality.

- Share applications in Azure AD.
- Automated user lifecycle management in resource tenant on home tenant (reflecting add, modify, and delete).

The following diagram illustrates this scenario, where only internal users in Company A access Company A's on-premises apps.

:::image type="complex" source="media/multi-tenant-user-management-scenarios/diagram-mesh-topology-inline.png" alt-text="Diagram illustrates mesh topology." lightbox="media/multi-tenant-user-management-scenarios/diagram-mesh-topology-expanded.png":::
    Diagram title: Mesh topology. On the top left, a box labeled Company A contains internal users and external users. On the top right, a box labeled Company B contains internal users and external users. On the bottom left, a box labeled Company C contains internal users and external users. On the bottom right, a box labeled Company D contains internal users and external users. Between Company A and Company B and between Company C and Company D, sync engine interactions go between the companies on the left and the companies on the right.
:::image-end:::

### Goals

Along with the current functionality, they want to offer the following.

- Provide access to Company A's on-premises resources for the external users.
- Apps with SAML authentication.
- Apps with Integrated Windows Authentication and Kerberos.

### Solution architecture

Company A provides SSO to on-premises apps for its own internal users using Azure Application Proxy as illustrated in the following diagram.

:::image type="complex" source="media/multi-tenant-common-solutions/app-access-scenario.png" alt-text="Diagram illustrates example of application access.":::
   Diagram title: Azure Application Proxy architecture solution. On the top left, a box labeled https: //sales.constoso.com contains a globe icon to represent a website. Below it, a group of icons represent the User and are connected by an arrow from the User to the website. On the top right, a cloud shape labeled Azure Active Directory contains an icon labeled Application Proxy Service. An arrow connects the website to the cloud shape. On the bottom right, a box labeled DMZ has the subtitle On-premises. An arrow connects the cloud shape to the DMZ box, splitting in two to point to icons labeled Connector. Below the Connector icon on the left, an arrow points down and splits in two to point to icons labeled App 1 and App 2. Below the Connector icon on the right, an arrow points down to an icon labeled App 3.
:::image-end:::

Admins in tenant A perform the following steps to enable their external users to access the same on-premises applications.

1. [Configure access to SAML apps](../external-identities/hybrid-cloud-to-on-premises.md#access-to-saml-apps).
1. [Configure access to other applications](../external-identities/hybrid-cloud-to-on-premises.md#access-to-iwa-and-kcd-apps).
1. Create on-premises users through [MIM](../external-identities/hybrid-cloud-to-on-premises.md#create-b2b-guest-user-objects-through-mim) or [PowerShell](https://www.microsoft.com/download/details.aspx?id=51495).

The following articles provide additional information about B2B collaboration.

- [Grant B2B users in Azure AD access to your on-premises resources](../external-identities/hybrid-cloud-to-on-premises.md) describes how you can provide B2B users access to on-premises apps.
- [Azure Active Directory B2B collaboration for hybrid organizations](../external-identities/hybrid-organizations.md) describes how you can give your external partners access to apps and resources in your organization.

## Next steps

- [Multi-tenant user management introduction](multi-tenant-user-management-introduction.md) is the first in the series of articles that provide guidance for configuring and providing user lifecycle management in Azure Active Directory (Azure AD) multi-tenant environments.
- [Multi-tenant user management scenarios](multi-tenant-user-management-scenarios.md) describes three scenarios for which you can use multi-tenant user management features: end user-initiated, scripted, and automated.
- [Common considerations for multi-tenant user management](multi-tenant-common-considerations.md) provides guidance for these considerations: cross-tenant synchronization, directory object, Azure AD Conditional Access, additional access control, and Office 365. 
