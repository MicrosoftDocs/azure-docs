---
title: What is a cross-tenant synchronization in Microsoft Entra ID?
description: Learn about cross-tenant synchronization in Microsoft Entra ID.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: multi-tenant-organizations
ms.topic: overview
ms.date: 08/28/2023
ms.author: rolyon
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# What is cross-tenant synchronization?

*Cross-tenant synchronization* automates creating, updating, and deleting [Microsoft Entra B2B collaboration](../external-identities/what-is-b2b.md) users across tenants in an organization. It enables users to access applications and collaborate across tenants, while still allowing the organization to evolve. 

Here are the primary goals of cross-tenant synchronization:

- Seamless collaboration for a multi-tenant organization
- Automate lifecycle management of B2B collaboration users in a multi-tenant organization
- Automatically remove B2B accounts when a user leaves the organization 

> [!VIDEO https://www.youtube.com/embed/7B-PQwNfGBc]

## Why use cross-tenant synchronization?

Cross-tenant synchronization automates creating, updating, and deleting B2B collaboration users. Users created with cross-tenant synchronization are able to access both Microsoft applications (such as Teams and SharePoint) and non-Microsoft applications (such as [ServiceNow](../saas-apps/servicenow-provisioning-tutorial.md), [Adobe](../saas-apps/adobe-identity-management-provisioning-tutorial.md), and many more), regardless of which tenant the apps are integrated with. These users continue to benefit from the security capabilities in Microsoft Entra ID, such as [Microsoft Entra Conditional Access](../conditional-access/overview.md) and [cross-tenant access settings](../external-identities/cross-tenant-access-overview.md), and can be governed through features such as [Microsoft Entra entitlement management](../governance/entitlement-management-overview.md).

The following diagram shows how you can use cross-tenant synchronization to enable users to access applications across tenants in your organization.

:::image type="content" source="./media/cross-tenant-synchronization-overview/cross-tenant-synchronization-diagram.png" alt-text="Diagram that shows synchronization of users for multiple tenants." lightbox="./media/cross-tenant-synchronization-overview/cross-tenant-synchronization-diagram.png":::

## Who should use?
- Organizations that own multiple Microsoft Entra tenants and want to streamline intra-organization cross-tenant application access.
- Cross-tenant synchronization is **not** currently suitable for use across organizational boundaries.

## Benefits

With cross-tenant synchronization, you can do the following:

- Automatically create B2B collaboration users within your organization and provide them access to the applications they need, without creating and maintaining custom scripts.
- Improve the user experience and ensure that users can access resources, without receiving an invitation email and having to accept a consent prompt in each tenant.
- Automatically update users and remove them when they leave the organization.

## Teams and Microsoft 365

Users created by cross-tenant synchronization will have the same experience when accessing Microsoft Teams and other Microsoft 365 services as B2B collaboration users created through a manual invitation. If your organization uses shared channels, please see the [known issues](../app-provisioning/known-issues.md) document for additional details. Over time, the `member` userType will be used by the various Microsoft 365 services to provide differentiated end user experiences for users in a multi-tenant organization.

## Properties

When you configure cross-tenant synchronization, you define a trust relationship between a source tenant and a target tenant. Cross-tenant synchronization has the following properties:

- Based on the Microsoft Entra provisioning engine.
- Is a push process from the source tenant, not a pull process from the target tenant.
- Supports pushing only internal members from the source tenant. It doesn't support syncing external users from the source tenant.
- Users in scope for synchronization are configured in the source tenant.
- Attribute mapping is configured in the source tenant.
- Extension attributes are supported.
- Target tenant administrators can stop a synchronization at any time.

The following table shows the parts of cross-tenant synchronization and which tenant they're configured.

| Tenant | Cross-tenant<br/>access settings | Automatic redemption | Sync settings<br/>configuration | Users in scope |
| :---: | :---: | :---: | :---: | :---: |
| ![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>Source tenant |  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| ![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>Target tenant | :heavy_check_mark: | :heavy_check_mark: |  |  |

## Cross-tenant synchronization setting

[!INCLUDE [cross-tenant-synchronization-include](../includes/cross-tenant-synchronization-include.md)]

To configure this setting using Microsoft Graph, see the [Update crossTenantIdentitySyncPolicyPartner](/graph/api/crosstenantidentitysyncpolicypartner-update?branch=main) API. For more information, see [Configure cross-tenant synchronization](cross-tenant-synchronization-configure.md).

## Automatic redemption setting

[!INCLUDE [automatic-redemption-include](../includes/automatic-redemption-include.md)]

To configure this setting using Microsoft Graph, see the [Update crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicyconfigurationpartner-update?branch=main) API. For more information, see [Configure cross-tenant synchronization](cross-tenant-synchronization-configure.md).

#### How do users know what tenants they belong to?

For cross-tenant synchronization, users don't receive an email or have to accept a consent prompt. If users want to see what tenants they belong to, they can open their [My Account](https://support.microsoft.com/account-billing/my-account-portal-for-work-or-school-accounts-eab41bfe-3b9e-441e-82be-1f6e568d65fd) page and select **Organizations**. In the Microsoft Entra admin center, users can open their [Portal settings](../../azure-portal/set-preferences.md), view their **Directories + subscriptions**, and switch directories.

For more information, including privacy information, see [Leave an organization as an external user](../external-identities/leave-the-organization.md).

## Get started

Here are the basic steps to get started using cross-tenant synchronization.

#### Step 1: Define how to structure the tenants in your organization

Cross-tenant synchronization provides a flexible solution to enable collaboration, but every organization is different. For example, you might have a central tenant, satellite tenants, or sort of a mesh of tenants. Cross-tenant synchronization supports any of these topologies. For more information, see [Topologies for cross-tenant synchronization](cross-tenant-synchronization-topology.md).

:::image type="content" source="./media/cross-tenant-synchronization-overview/topology-all.png" alt-text="Diagram that shows different tenant topologies.":::

#### Step 2: Enable cross-tenant synchronization in the target tenants

In the target tenant where users are created, navigate to the **Cross-tenant access settings** page. Here you enable cross-tenant synchronization and the B2B automatic redemption settings by selecting the respective check boxes. For more information, see [Configure cross-tenant synchronization](cross-tenant-synchronization-configure.md).

:::image type="content" source="./media/cross-tenant-synchronization-overview/configure-target.png" alt-text="Diagram that shows cross-tenant synchronization enabled in the target tenant.":::

#### Step 3: Enable cross-tenant synchronization in the source tenants

In any source tenant, navigate to the **Cross-tenant access settings** page and enable the B2B automatic redemption feature. Next, you use the **Cross-tenant synchronization** page to set up a cross-tenant synchronization job and specify:

- Which users you want to synchronize
- What attributes you want to include
- Any transformations

For anyone that has used Microsoft Entra ID to [provision identities into a SaaS application](../app-provisioning/user-provisioning.md), this experience will be familiar. Once you have synchronization configured, you can start testing with a few users and make sure they're created with all the attributes that you need. When testing is complete, you can quickly add additional users to synchronize and roll out across your organization. For more information, see [Configure cross-tenant synchronization](cross-tenant-synchronization-configure.md).

:::image type="content" source="./media/cross-tenant-synchronization-overview/configure-source.png" alt-text="Diagram that shows a cross-tenant synchronization job configured in the source tenant.":::

## License requirements

In the source tenant: Using this feature requires Microsoft Entra ID P1 licenses. Each user who is synchronized with cross-tenant synchronization must have a P1 license in their home/source tenant. To find the right license for your requirements, see [Compare generally available features of Microsoft Entra ID](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

In the target tenant: Cross-tenant sync relies on the Microsoft Entra External ID billing model. To understand the external identities licensing model, see [MAU billing model for Microsoft Entra External ID](../external-identities/external-identities-pricing.md). You will also need at least one Microsoft Entra ID P1 license in the target tenant to enable auto-redemption. 

## Frequently asked questions

#### Clouds

Which clouds can cross-tenant synchronization be used in?

- Cross-tenant synchronization is supported within the commercial cloud and Azure Government. 
- Cross-tenant synchronization isn't supported within the Microsoft Azure operated by 21Vianet cloud. 
- Synchronization is only supported between two tenants in the same cloud.
- Cross-cloud (such as public cloud to Azure Government) isn't currently supported.

#### Existing B2B users

Will cross-tenant synchronization manage existing B2B users?

- Yes. Cross-tenant synchronization uses an internal attribute called the alternativeSecurityIdentifier to uniquely match an internal user in the source tenant with an external / B2B user in the target tenant. Cross-tenant synchronization can update existing B2B users, ensuring that each user has only one account.
- Cross-tenant synchronization cannot match an internal user in the source tenant with an internal user in the target tenant (both type member and type guest).

#### Synchronization frequency

How often does cross-tenant synchronization run?

- The sync interval is currently fixed to start at 40-minute intervals. Sync duration varies based on the number of in-scope users. The initial sync cycle is likely to take significantly longer than the following incremental sync cycles.

#### Scope

How do I control what is synchronized into the target tenant?

- In the source tenant, you can control which users are provisioned with the configuration or attribute-based filters. You can also control what attributes on the user object are synchronized. For more information, see [Scoping users or groups to be provisioned with scoping filters](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md?toc=/azure/active-directory/multi-tenant-organizations/toc.json&pivots=cross-tenant-synchronization).

If a user is removed from the scope of sync in a source tenant, will cross-tenant synchronization soft delete them in the target?

- Yes. If a user is removed from the scope of sync in a source tenant, cross-tenant synchronization will soft delete them in the target tenant.

#### Object types

What object types can be synchronized?

- Microsoft Entra users can be synchronized between tenants. (Groups, devices, and contacts aren't currently supported.)

What user types can be synchronized?

- Internal members can be synchronized from source tenants. Internal guests can't be synchronized from source tenants.
- Users can be synchronized to target tenants as external members (default) or external guests.
- For more information about the UserType definitions, see [Properties of a Microsoft Entra B2B collaboration user](../external-identities/user-properties.md).

I have existing B2B collaboration users. What will happen to them?

- Cross-tenant synchronization will match the user and make any necessary updates to the user, such as update the display name. By default, the UserType won't be updated from guest to member, but you can configure this in the attribute mappings.

#### Attributes

What user attributes can be synchronized?

- Cross-tenant synchronization will sync commonly used attributes on the user object in Microsoft Entra ID, including (but not limited to) displayName, userPrincipalName, and directory extension attributes.

What attributes can't be synchronized?

- Attributes including (but not limited to) managers, photos, custom security attributes, and user attributes outside of the directory can't be synchronized by cross-tenant synchronization.

Can I control where user attributes are sourced/managed?

- Cross-tenant synchronization doesn't offer direct control over source of authority. The user and its attributes are deemed authoritative at the source tenant. There are parallel sources of authority workstreams that will evolve source of authority controls for users down to the attribute level and a user object at the source may ultimately reflect multiple underlying sources. For the tenant-to-tenant process, this is still treated as the source tenant's values being authoritative for the sync process (even if pieces actually originate elsewhere) into the target tenant. Currently, there's no support for reversing the sync process's source of authority.
- Cross-tenant synchronization only supports source of authority at the object level. That means all attributes of a user must come from the same source, including credentials. It isn't possible to reverse the source of authority or federation direction of a synchronized object.

What happens if attributes for a synced user are changed in the target tenant?

- Cross-tenant synchronization doesn't query for changes in the target. If no changes are made to the synced user in the source tenant, then user attribute changes made in the target tenant will persist. However, if changes are made to the user in the source tenant, then during the next synchronization cycle, the user in the target tenant will be updated to match the user in the source tenant.

Can the target tenant manually block sign-in for a specific home/source tenant user that is synced?

- If no changes are made to the synced user in the source tenant, then the block sign-in setting in the target tenant will persist. If a change is detected for the user in the source tenant, cross-tenant synchronization will re-enable that user blocked from sign-in in the target tenant.

#### Structure

Can I sync a mesh between multiple tenants?

- Cross-tenant synchronization is configured as a single-direction peer-to-peer sync, meaning sync is configured between one source and one target tenant. Multiple instances of cross-tenant synchronization can be configured to sync from a single source to multiple targets and from multiple sources into a single target. But only one sync instance can exist between a source and a target.
- Cross-tenant synchronization only synchronizes users that are internal to the home/source tenant, ensuring that you can't end up with a loop where a user is written back to the same tenant.
- Multiple topologies are supported. For more information, see [Topologies for cross-tenant synchronization](cross-tenant-synchronization-topology.md).

Can I use cross-tenant synchronization across organizations (outside my multi-tenant organization)?

-  For privacy reasons, cross-tenant synchronization is intended for use within an organization. We recommend using [entitlement management](../governance/entitlement-management-overview.md) for inviting B2B collaboration users across organizations.

Can cross-tenant synchronization be used to migrate users from one tenant to another tenant?

-  No. Cross-tenant synchronization isn't a migration tool because the source tenant is required for synchronized users to authenticate. In addition, tenant migrations would require migrating user data such as SharePoint and OneDrive.

#### B2B collaboration

Does cross-tenant synchronization resolve any present [B2B collaboration](../external-identities/what-is-b2b.md) limitations?

- Since cross-tenant synchronization is built on existing B2B collaboration technology, existing limitations apply. Examples include (but aren't limited to):

    [!INCLUDE [user-type-workload-limitations-include](../includes/user-type-workload-limitations-include.md)]

#### B2B direct connect

How does cross-tenant synchronization relate to [B2B direct connect](../external-identities/b2b-direct-connect-overview.md)?

- B2B direct connect is the underlying identity technology required for [Teams Connect shared channels](/microsoftteams/platform/concepts/build-and-test/shared-channels).
- We recommend B2B collaboration for all other cross-tenant application access scenarios, including both Microsoft and non-Microsoft applications.
- B2B direct connect and cross-tenant synchronization are designed to co-exist, and you can enable them both for broad coverage of cross-tenant scenarios.

We're trying to determine the extent to which we'll need to utilize cross-tenant synchronization in our multi-tenant organization. Do you plan to extend support for B2B direct connect beyond Teams Connect?

- There's no plan to extend support for B2B direct connect beyond Teams Connect shared channels.

#### Microsoft 365

Does cross-tenant synchronization enhance any cross-tenant Microsoft 365 app access user experiences?

- Cross-tenant synchronization utilizes a feature that improves the user experience by suppressing the first-time B2B consent prompt and redemption process in each tenant.
- Synchronized users will have the same cross-tenant Microsoft 365 experiences available to any other B2B collaboration user.

Can cross-tenant synchronization enable people search scenarios where synchronized users appear in the global address list of the target tenant?

- Yes, but you must set the value for the **showInAddressList** attribute of synchronized users to **True**, which is not set by default. If you want to create a unified address list, you'll need to set up a [mesh peer-to-peer topology](./cross-tenant-synchronization-topology.md#mesh-peer-to-peer). For more information, see [Step 9: Review attribute mappings](./cross-tenant-synchronization-configure.md#step-9-review-attribute-mappings).
- Cross-tenant synchronization creates B2B collaboration users and doesn't create contacts.

#### Teams

Does cross-tenant synchronization enhance any current Teams experiences?

- Synchronized users will have the same cross-tenant Microsoft 365 experiences available to any other B2B collaboration user.

#### Integration

What federation options are supported for users in the target tenant back to the source tenant?

- For each internal user in the source tenant, cross-tenant synchronization creates a federated external user (commonly used in B2B) in the target. It supports syncing internal users. This includes internal users federated to other identity systems using domain federation (such as [Active Directory Federation Services](/windows-server/identity/ad-fs/ad-fs-overview)). It doesn't support syncing external users.

Does cross-tenant synchronization use System for Cross-Domain Identity Management (SCIM)?

- No. Currently, Microsoft Entra ID supports a SCIM client, but not a SCIM server. For more information, see [SCIM synchronization with Microsoft Entra ID](../architecture/sync-scim.md).

#### Deprovisioning
Does cross-tenant synchronization support deprovisioning users?

- Yes, when the below actions occur in the source tenant, the user will be [soft deleted](../architecture/recover-from-deletions.md#soft-deletions) in the target tenant. 

  - Delete the user in the source tenant
  - Unassign the user from the cross-tenant synchronization configuration
  - Remove the user from a group that is assigned to the cross-tenant synchronization configuration
  - An attribute on the user changes such that they do not meet the scoping filter conditions defined on the cross-tenant synchronization configuration anymore 

- If the user is blocked from sign-in in the source tenant (accountEnabled = false) they will be blocked from sign-in in the target. This is not a deletion, but an updated to the accountEnabled property.

Does cross-tenant synchronization support restoring users? 

- If the user in the source tenant is restored, reassigned to the app, meets the scoping condition again within 30 days of soft deletion, it will be restored in the target tenant.
- IT admins can also manually [restore](/azure/active-directory/fundamentals/active-directory-users-restore) the user directly in the target tenant.

How can I deprovision all the users that are currently in scope of cross-tenant synchronization? 

- Unassign all users and / or groups from the cross-tenant synchronization configuration. This will trigger all the users that were unassigned, either directly or through group membership, to be deprovisioned in subsequent sync cycles. Please note that the target tenant will need to keep the inbound policy for sync enabled until deprovisioning is complete. If the scope is set to **Sync all users and groups**, you will also need to change it to **Sync only assigned users and groups**. The users will be automatically soft deleted by cross-tenant synchronization. The users will be automatically hard deleted after 30 days or you can choose to hard delete the users directly from the target tenant. You can choose to hard delete the users directly in the target tenant or wait 30 days for the users to be automatically hard deleted. 

If the sync relationship is severed, are external users previously managed by cross-tenant synchronization deleted in the target tenant?

- No. No changes are made to the external users previously managed by cross-tenant synchronization if the relationship is severed (for example, if the cross-tenant synchronization policy is deleted).


## Next steps

- [Topologies for cross-tenant synchronization](cross-tenant-synchronization-topology.md)
- [Configure cross-tenant synchronization](cross-tenant-synchronization-configure.md)
