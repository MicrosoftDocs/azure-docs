---
title: What is a multi-tenant organization in Azure Active Directory?
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

# What is a multi-tenant organization in Azure Active Directory?

This article provides an overview of multi-tenant organizations.

## What is a tenant?

A *tenant* is an instance of Azure Active Directory (Azure AD) in which information about a single organization resides including organizational objects such as users, groups, and devices and also application registrations, such as Microsoft 365 and third-party applications. A tenant also contains access and compliance policies for resources, such as applications registered in the directory. The primary functions served by a tenant include identity authentication as well as resource access management.

From an Azure AD perspective, a tenant forms an identity and access management scope. For example, a tenant administrator makes an application available to some or all the users in the tenant and enforces access policies on that application for users in that tenant. In addition, a tenant contains organizational branding data that drives end-user experiences, such as the organizations email domains and SharePoint URLs used by employees in that organization. From a Microsoft 365 perspective, a tenant forms the default collaboration and licensing boundary. For example, users in Microsoft Teams or Microsoft Outlook can easily find and collaborate with other users in their tenant, but don't have the ability to find or see users in other tenants.

Tenants contain privileged organizational data and are securely isolated from other tenants. In addition, tenants can be configured to have data persisted and processed in a specific region or cloud, which enables organizations to use tenants as a mechanism to meet data residency and handling compliance requirements.

## What is a multi-tenant organization?

A *multi-tenant organization* is an organization that has more than one instance of Azure AD. Here are the primary reasons why an organization might have multiple tenants:

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

## B2B collaboration

To enable users across tenants to collaborate, you can use [Azure AD B2B collaboration](../external-identities/what-is-b2b.md). B2B collaboration is a feature within External Identities that lets you invite guest users to collaborate with your organization. Once the external user has redeemed their invitation or completed sign-up, they're represented in your tenant as a user object. With B2B collaboration, you can securely share your company's applications and services with external users, while maintaining control over your own corporate data.

Here are the primary constraints with using B2B collaboration across multiple tenants:

- Administrators must invite users using the B2B invitation process or build an onboarding experience using the [B2B collaboration invitation manager](../external-identities/external-identities-overview.md#azure-ad-microsoft-graph-api-for-b2b-collaboration).
- Administrators might have to synchronize users using custom scripts.
- Depending on automatic redemption settings, users might need to accept a consent prompt and follow a redemption process in each tenant.
- By default, users are of type external guest, which has different permissions than external member and might not be the desired user experience.

:::image type="content" source="./media/overview/multi-tenant-b2b-collaboration.png" alt-text="Diagram that shows using B2B collaboration across tenants." lightbox="./media/overview/multi-tenant-b2b-collaboration.png":::

## B2B direct connect

To enable users across tenants to collaborate in [Teams Connect shared channels](/microsoftteams/platform/concepts/build-and-test/shared-channels), you can use [Azure AD B2B direct connect](../external-identities/b2b-direct-connect-overview.md). B2B direct connect is a feature of External Identities that lets you set up a mutual trust relationship with another Azure AD organization for seamless collaboration in Teams. When the trust is established, the B2B direct connect user has single sign-on access using credentials from their home tenant.

Here's the primary constraint with using B2B direct connect across multiple tenants:

- Currently, B2B direct connect works only with Teams Connect shared channels.

:::image type="content" source="./media/overview/multi-tenant-b2b-direct-connect.png" alt-text="Diagram that shows using B2B direct connect across tenants." lightbox="./media/overview/multi-tenant-b2b-direct-connect.png":::

## Cross-tenant synchronization

If you want users to have a more seamless collaboration experience across tenants, you can use [cross-tenant synchronization](./cross-tenant-synchronization-overview.md). Cross-tenant synchronization is a one-way synchronization service in Azure AD that automates creating, updating, and deleting B2B collaboration users across tenants in an organization. Cross-tenant synchronization builds on the B2B collaboration functionality and utilizes existing B2B cross-tenant access settings. Users are represented in the target tenant as a B2B collaboration user object.

Here are the primary benefits with using cross-tenant synchronization:

- Automatically create B2B collaboration users within your organization and provide them access to the applications they need, without creating and maintaining custom scripts.
- Improve the user experience and ensure that users can access resources, without receiving an invitation email and having to accept a consent prompt in each tenant.
- Automatically update users and remove them when they leave the organization.

Here are the primary constraints with using cross-tenant synchronization across multiple tenants:

- Doesn't enhance the current Teams or Microsoft 365 experiences. Synchronized users will have the same cross-tenant Teams and Microsoft 365 experiences available to any other B2B collaboration user.
- Doesn't synchronize groups, devices, or contacts.

:::image type="content" source="./media/overview/multi-tenant-cross-tenant-sync.png" alt-text="Diagram that shows using cross-tenant synchronization across tenants." lightbox="./media/overview/multi-tenant-cross-tenant-sync.png":::

## Compare multi-tenant capabilities

Depending on the needs of your organization, you can use any combination of cross-tenant synchronization, B2B collaboration, and B2B direct connect. The following table compares the capabilities of each feature. For more information about different external identity scenarios, see [Comparing External Identities feature sets](../external-identities/external-identities-overview.md#comparing-external-identities-feature-sets).

|  | Cross-tenant synchronization<br/>(internal) | B2B collaboration<br/>(Org-to-org external) | B2B direct connect<br/>(Org-to-org external) |
| --- | --- | --- | --- |
| **Purpose** | Users can seamlessly access apps/resources across the same organization, even if they're hosted in different tenants. | Users can access apps/resources hosted in external tenants, usually with limited guest privileges. Depending on automatic redemption settings, users might need to accept a consent prompt in each tenant. | Users can access Teams Connect shared channels hosted in external tenants. |
| **Value** | Enables collaboration across organizational tenants. Administrators don't have to manually invite and synchronize users between tenants to ensure continuous access to apps/resources within the organization. | Enables external collaboration. More control and monitoring for administrators by managing the B2B collaboration users. Administrators can limit the access that these external users have to their apps/resources. | Enables external collaboration within Teams Connect shared channels only. More convenient for administrators because they don't have to manage B2B users. |
| **Primary administrator workflow** | Configure the cross-tenant synchronization engine to synchronize users between multiple tenants as B2B collaboration users. | Add external users to resource tenant by using the B2B invitation process or build your own onboarding experience using the [B2B collaboration invitation manager](../external-identities/external-identities-overview.md#azure-ad-microsoft-graph-api-for-b2b-collaboration). | Configure cross-tenant access to provide external users inbound access to tenant the credentials for their home tenant. |
| **Trust level** | High trust. All tenants are part of the same organization, and users are typically granted member access to all apps/resources. | Low to mid trust. User objects can be tracked easily and managed with granular controls. | Mid trust. B2B direct connect users are less easy to track, mandating a certain level of trust with the external organization. |
| **Effect on users** | Within the same organization, users are synchronized from their home tenant to the resource tenant as B2B collaboration users. | External users are added to a tenant as B2B collaboration users. | Users access the resource tenant using the credentials for their home tenant. User objects aren't created in the resource tenant. |
| **User type** | B2B collaboration user<br/>- External member (default)<br/>- External guest | B2B collaboration user<br/>- External member<br/>- External guest (default) | B2B direct connect user<br/>- N/A |

The following diagram shows how cross-tenant synchronization, B2B collaboration, and B2B direct connect could be used together.

:::image type="content" source="./media/overview/multi-tenant-capabilities.png" alt-text="Diagram that shows different multi-tenant capabilities." lightbox="./media/overview/multi-tenant-capabilities.png":::

## Terminology

To better understand multi-tenant organizations, you can refer back to the following list of terms.

| Term | Definition |
| --- | --- |
| tenant | An instance of Azure Active Directory (Azure AD). |
| organization | The top level of a business hierarchy. |
| multi-tenant organization | An organization that has more than one instance of Azure AD. |
| cross-tenant synchronization | A one-way synchronization service in Azure AD that automates creating, updating, and deleting B2B collaboration users across tenants in an organization. |
| cross-tenant access settings | Settings to manage collaboration with external Azure AD organizations. |
| organizational settings | Cross-tenant access settings for specific Azure AD organizations. |
| configuration | An application and underlying service principal in Azure AD that includes the settings (such as target tenant, user scope, and attribute mappings) needed for cross-tenant synchronization. |
| provisioning | The process of automatically creating or synchronizing objects across a boundary. |
| automatic redemption | A B2B setting to automatically redeem invitations so newly created users don't receive an invitation email or have to accept a consent prompt when added to a target tenant. |

## Next steps

- [What is cross-tenant synchronization?](cross-tenant-synchronization-overview.md)
