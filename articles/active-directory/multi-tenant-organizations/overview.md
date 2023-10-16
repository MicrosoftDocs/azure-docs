---
title: Multi-tenant organization scenario and Microsoft Entra capabilities
description: Learn about the multi-tenant organization scenario and capabilities in Microsoft Entra ID.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: multi-tenant-organizations
ms.topic: overview
ms.date: 08/22/2023
ms.author: rolyon
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Multi-tenant organization scenario and Microsoft Entra capabilities

This article provides an overview of the multi-tenant organization scenario and the related capabilities in Microsoft Entra ID.

## What is a tenant?

A *tenant* is an instance of Microsoft Entra ID in which information about a single organization resides including organizational objects such as users, groups, and devices and also application registrations, such as Microsoft 365 and third-party applications. A tenant also contains access and compliance policies for resources, such as applications registered in the directory. The primary functions served by a tenant include identity authentication as well as resource access management.

From a Microsoft Entra perspective, a tenant forms an identity and access management scope. For example, a tenant administrator makes an application available to some or all the users in the tenant and enforces access policies on that application for users in that tenant. In addition, a tenant contains organizational branding data that drives end-user experiences, such as the organizations email domains and SharePoint URLs used by employees in that organization. From a Microsoft 365 perspective, a tenant forms the default collaboration and licensing boundary. For example, users in Microsoft Teams or Microsoft Outlook can easily find and collaborate with other users in their tenant, but don't have the ability to find or see users in other tenants.

Tenants contain privileged organizational data and are securely isolated from other tenants. In addition, tenants can be configured to have data persisted and processed in a specific region or cloud, which enables organizations to use tenants as a mechanism to meet data residency and handling compliance requirements.

## What is a multi-tenant organization?

A *multi-tenant organization* is an organization that has more than one instance of Microsoft Entra ID. Here are the primary reasons why an organization might have multiple tenants:

- **Conglomerates:** Organizations with multiple subsidiaries or business units that operate independently.
- **Mergers and acquisitions:** Organizations that merge or acquire companies.
- **Divestiture activity:** In a divestiture, one organization splits off part of its business to form a new organization or sell it to an existing organization.
- **Multiple clouds:** Organizations that have compliance or regulatory needs to exist in multiple cloud environments.
- **Multiple geographical boundaries:** Organizations that operate in multiple geographic locations with various residency regulations.
- **Test or staging tenants:** Organizations that need multiple tenants for testing or staging purposes before deploying more broadly to primary tenants.
- **Department or employee-created tenants:** Organizations where departments or employees have created tenants for development, testing, or separate control.

## Multi-tenant challenges

Your organization may have recently acquired a new company, merged with another company, or restructured based on newly formed business units. If you have disparate identity management systems, it might be challenging for users in different tenants to access resources and collaborate.

The following diagram shows how users in other tenants might not be able to access applications across tenants in your organization.

:::image type="content" source="./media/overview/multi-tenant-no-access.png" alt-text="Diagram that shows users unable to access applications across tenants." lightbox="./media/overview/multi-tenant-no-access.png":::

As your organization evolves, your IT team must adapt to meet the changing needs. This often includes integrating with an existing tenant or forming a new one. Regardless of how the identity infrastructure is managed, it's critical that users have a seamless experience accessing resources and collaborating. Today, you may be using custom scripts or on-premises solutions to bring the tenants together to provide a seamless experience across tenants.

## B2B direct connect

To enable users across tenants to collaborate in [Teams Connect shared channels](/microsoftteams/platform/concepts/build-and-test/shared-channels), you can use [Microsoft Entra B2B direct connect](../external-identities/b2b-direct-connect-overview.md). B2B direct connect is a feature of External Identities that lets you set up a mutual trust relationship with another Microsoft Entra organization for seamless collaboration in Teams. When the trust is established, the B2B direct connect user has single sign-on access using credentials from their home tenant.

Here's the primary constraint with using B2B direct connect across multiple tenants:

- Currently, B2B direct connect works only with Teams Connect shared channels.

:::image type="content" source="./media/overview/multi-tenant-b2b-direct-connect.png" alt-text="Diagram that shows using B2B direct connect across tenants." lightbox="./media/overview/multi-tenant-b2b-direct-connect.png":::

For more information, see [B2B direct connect overview](../external-identities/b2b-direct-connect-overview.md).

## B2B collaboration

To enable users across tenants to collaborate, you can use [Microsoft Entra B2B collaboration](../external-identities/what-is-b2b.md). B2B collaboration is a feature within External Identities that lets you invite guest users to collaborate with your organization. Once the external user has redeemed their invitation or completed sign-up, they're represented in your tenant as a user object. With B2B collaboration, you can securely share your company's applications and services with external users, while maintaining control over your own corporate data.

Here are the primary constraints with using B2B collaboration across multiple tenants:

- Administrators must invite users using the B2B invitation process or build an onboarding experience using the [B2B collaboration invitation manager](../external-identities/external-identities-overview.md#azure-ad-microsoft-graph-api-for-b2b-collaboration).
- Administrators might have to synchronize users using custom scripts.
- Depending on automatic redemption settings, users might need to accept a consent prompt and follow a redemption process in each tenant.
- By default, users are of type external guest, which has different permissions than external member and might not be the desired user experience.

:::image type="content" source="./media/overview/multi-tenant-b2b-collaboration.png" alt-text="Diagram that shows using B2B collaboration across tenants." lightbox="./media/overview/multi-tenant-b2b-collaboration.png":::

For more information, see [B2B collaboration overview](../external-identities/what-is-b2b.md).

## Cross-tenant synchronization

If you want users to have a more seamless collaboration experience across tenants, you can use [cross-tenant synchronization](./cross-tenant-synchronization-overview.md). Cross-tenant synchronization is a one-way synchronization service in Microsoft Entra ID that automates creating, updating, and deleting B2B collaboration users across tenants in an organization. Cross-tenant synchronization builds on the B2B collaboration functionality and utilizes existing B2B cross-tenant access settings. Users are represented in the target tenant as a B2B collaboration user object.

Here are the primary benefits with using cross-tenant synchronization:

- Automatically create B2B collaboration users within your organization and provide them access to the applications they need, without creating and maintaining custom scripts.
- Improve the user experience and ensure that users can access resources, without receiving an invitation email and having to accept a consent prompt in each tenant.
- Automatically update users and remove them when they leave the organization.

Here are the primary constraints with using cross-tenant synchronization across multiple tenants:

- Doesn't enhance the current Teams or Microsoft 365 experiences. Synchronized users will have the same cross-tenant Teams and Microsoft 365 experiences available to any other B2B collaboration user.
- Doesn't synchronize groups, devices, or contacts.

:::image type="content" source="./media/overview/multi-tenant-cross-tenant-sync.png" alt-text="Diagram that shows using cross-tenant synchronization across tenants." lightbox="./media/overview/multi-tenant-cross-tenant-sync.png":::

For more information, see [What is cross-tenant synchronization?](./cross-tenant-synchronization-overview.md).

## Multi-tenant organization (Preview)

> [!IMPORTANT]
> Multi-tenant organization is currently in PREVIEW.
> See the [Product Terms](https://aka.ms/EntraPreviewsTermsOfUse) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[Multi-tenant organization](./multi-tenant-organization-overview.md) is a feature in Microsoft Entra ID and Microsoft 365 that enables you to form a tenant group within your organization. Each pair of tenants in the group is governed by cross-tenant access settings that you can use to configure B2B or cross-tenant synchronization.

Here are the primary benefits of a multi-tenant organization:

- Differentiate in-organization and out-of-organization external users
- Improved collaborative experience in new Microsoft Teams
- Improved people search experience across tenants

:::image type="content" source="./media/common/multi-tenant-organization-topology.png" alt-text="Diagram that shows a multi-tenant organization topology and cross-tenant access settings." lightbox="./media/common/multi-tenant-organization-topology.png":::

For more information, see [What is a multi-tenant organization in Microsoft Entra ID?](./multi-tenant-organization-overview.md).

## Compare multi-tenant capabilities

Depending on the needs of your organization, you can use any combination of B2B direct connect, B2B collaboration, cross-tenant synchronization, and multi-tenant organization capabilities. B2B direct connect and B2B collaboration are independent capabilities, while cross-tenant synchronization and multi-tenant organization capabilities are independent of each other, though both rely on underlying B2B collaboration.

The following table compares the capabilities of each feature. For more information about different external identity scenarios, see [Comparing External Identities feature sets](../external-identities/external-identities-overview.md#comparing-external-identities-feature-sets).

|  | B2B direct connect<br/>(Org-to-org external or internal) | B2B collaboration<br/>(Org-to-org external or internal) | Cross-tenant synchronization<br/>(Org internal) | Multi-tenant organization<br/>(Org internal) |
| --- | --- | --- | --- | --- |
| **Purpose** | Users can access Teams Connect shared channels hosted in external tenants. | Users can access apps/resources hosted in external tenants, usually with limited guest privileges. Depending on automatic redemption settings, users might need to accept a consent prompt in each tenant. | Users can seamlessly access apps/resources across the same organization, even if they're hosted in different tenants. | Users can more seamlessly collaborate across a multi-tenant organization in new Teams and people search. |
| **Value** | Enables external collaboration within Teams Connect shared channels only. More convenient for administrators because they don't have to manage B2B users. | Enables external collaboration. More control and monitoring for administrators by managing the B2B collaboration users. Administrators can limit the access that these external users have to their apps/resources. | Enables collaboration across organizational tenants. Administrators don't have to manually invite and synchronize users between tenants to ensure continuous access to apps/resources within the organization. | Enables collaboration across organizational tenants. Administrators continue to have full configuration ability via cross-tenant access settings. Optional cross-tenant access templates allow pre-configuration of cross-tenant access settings. |
| **Primary administrator workflow** | Configure cross-tenant access to provide external users inbound access to tenant the credentials for their home tenant. | Add external users to resource tenant by using the B2B invitation process or build your own onboarding experience using the [B2B collaboration invitation manager](../external-identities/external-identities-overview.md#azure-ad-microsoft-graph-api-for-b2b-collaboration). | Configure the cross-tenant synchronization engine to synchronize users between multiple tenants as B2B collaboration users. | Create a multi-tenant organization, add (invite) tenants, join a multi-tenant organization. Leverage existing B2B collaboration users or use cross-tenant synchronization to provision B2B collaboration users. |
| **Trust level** | Mid trust. B2B direct connect users are less easy to track, mandating a certain level of trust with the external organization. | Low to mid trust. User objects can be tracked easily and managed with granular controls. | High trust. All tenants are part of the same organization, and users are typically granted member access to all apps/resources. | High trust. All tenants are part of the same organization, and users are typically granted member access to all apps/resources. |
| **Effect on users** | Users access the resource tenant using the credentials for their home tenant. User objects aren't created in the resource tenant. | External users are added to a tenant as B2B collaboration users. | Within the same organization, users are synchronized from their home tenant to the resource tenant as B2B collaboration users. | Within the same multi-tenant organization, B2B collaboration users, particularly member users, benefit from enhanced, seamless collaboration across Microsoft 365. |
| **User type** | B2B direct connect user<br/>- N/A | B2B collaboration user<br/>- External member<br/>- External guest (default) | B2B collaboration user<br/>- External member (default)<br/>- External guest | B2B collaboration user<br/>- External member (default)<br/>- External guest |

The following diagram shows how B2B direct connect, B2B collaboration, and cross-tenant synchronization capabilities could be used together.

:::image type="content" source="./media/overview/multi-tenant-capabilities.png" alt-text="Diagram that shows different multi-tenant capabilities." lightbox="./media/overview/multi-tenant-capabilities.png":::

## Terminology

To better understand multi-tenant organization scenario related Microsoft Entra capabilities, you can refer back to the following list of terms.

| Term | Definition |
| --- | --- |
| tenant | An instance of Microsoft Entra ID. |
| organization | The top level of a business hierarchy. |
| multi-tenant organization | An organization that has more than one instance of Microsoft Entra ID, as well as a capability to group those instances in Microsoft Entra ID. |
| creator tenant | The tenant that created the multi-tenant organization. |
| owner tenant | A tenant with the owner role. Initially, the creator tenant. |
| added tenant | A tenant that was added by an owner tenant. |
| joiner tenant | A tenant that is joining the multi-tenant organization. |
| join request | A joiner or added tenant submits a join request to join the multi-tenant organization. |
| pending tenant | A tenant that was added by an owner but that hasn't yet joined. |
| active tenant | A tenant that created or joined the multi-tenant organization. |
| member tenant | A tenant with the member role. Most joiner tenants start as members. |
| multi-tenant organization tenant | An active tenant of the multi-tenant organization, not pending. |
| cross-tenant synchronization | A one-way synchronization service in Microsoft Entra ID that automates creating, updating, and deleting B2B collaboration users across tenants in an organization. |
| cross-tenant access settings | Settings to manage collaboration for specific Microsoft Entra organizations. |
| cross-tenant access settings template | An optional template to preconfigure cross-tenant access settings that are applied to any partner tenant newly joining the multi-tenant organization. |
| organizational settings | Cross-tenant access settings for specific Microsoft Entra organizations. |
| configuration | An application and underlying service principal in Microsoft Entra ID that includes the settings (such as target tenant, user scope, and attribute mappings) needed for cross-tenant synchronization. |
| provisioning | The process of automatically creating or synchronizing objects across a boundary. |
| automatic redemption | A B2B setting to automatically redeem invitations so newly created users don't receive an invitation email or have to accept a consent prompt when added to a target tenant. |

## Next steps

- [What is a multi-tenant organization in Microsoft Entra ID?](multi-tenant-organization-overview.md)
- [What is cross-tenant synchronization?](cross-tenant-synchronization-overview.md)
