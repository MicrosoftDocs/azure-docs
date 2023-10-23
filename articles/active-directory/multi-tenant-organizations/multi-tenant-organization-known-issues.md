---
title: Known issues for multi-tenant organizations (Preview)
description: Learn about known issues when you work with multi-tenant organizations in Microsoft Entra ID.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: multi-tenant-organizations
ms.topic: troubleshooting
ms.date: 08/22/2023
ms.author: rolyon
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Known issues for multi-tenant organizations (Preview)

> [!IMPORTANT]
> Multi-tenant organization is currently in PREVIEW.
> See the [Product Terms](https://aka.ms/EntraPreviewsTermsOfUse) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article discusses known issues to be aware of when you work with multi-tenant organization functionality across Microsoft Entra ID and Microsoft 365. To provide feedback about the multi-tenant organization functionality on UserVoice, see [Microsoft Entra UserVoice](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789?category_id=360892). We watch UserVoice closely so that we can improve the service.

## Scope

The experiences and issues described in this article have the following scope.

| Scope | Description |
| --- | --- |
| In scope | - Microsoft Entra administrator experiences and issues related to multi-tenant organizations to support seamless collaboration experiences in new Teams, with reciprocally provisioned B2B members |
| Related scope | - Microsoft 365 admin center experiences and issues related to multi-tenant organizations<br/>- Microsoft 365 multi-tenant organization people search experiences and issues<br/>- Cross-tenant synchronization issues related to Microsoft 365 |
| Out of scope | - Cross-tenant synchronization unrelated to Microsoft 365<br/>- End user experiences in new Teams<br/>- End user experiences in Power BI<br/>- Tenant migration or consolidation |
| Unsupported scenarios | - Seamless collaboration experience across multi-tenant organizations in classic Teams<br/>- Self-service for multi-tenant organizations larger than 5 tenants or 100,000 internal users per tenant<br/>- Using provisioning or synchronization engines other than Microsoft Entra cross-tenant synchronization<br/>- Multi-tenant organizations in Azure Government or Microsoft Azure operated by 21Vianet<br/>- Cross-cloud multi-tenant organizations |

## Multi-tenant organization related issues

- Allow for at least 2 hours between the creation of a multi-tenant organization and any tenant joining the multi-tenant organization.

- Allow for up to 4 hours between submission of a multi-tenant organization join request and the same join request to succeed and finish.

- Self-service of multi-tenant organization functionality is limited to a maximum of 5 tenants and 100,000 internal users per tenant. To request a raise in these limits, submit a Microsoft Entra ID or Microsoft 365 admin center support request.

- In the Microsoft Graph APIs, the default limits of 5 tenants and 100,000 internal users per tenant are only enforced at the time of joining. In Microsoft 365 admin center, the default limits are enforced at multi-tenant organization creation time and at time of joining. 

- There are multiple reasons why a join request might fail. If Microsoft 365 admin center doesn't indicate why a join request isn't succeeding, try examining the join request response by using the Microsoft Graph APIs or Microsoft Graph Explorer.

- If you followed the correct sequence of creating a multi-tenant organization, adding a tenant to the multi-tenant organization, and the added tenant's join request keeps failing, submit a support request to Microsoft Entra ID or Microsoft 365 admin center.

- As part of a multi-tenant organization, newly invited B2B users receive an additional user property that includes the home tenant identifier of the B2B user. Already redeemed B2B users don't have this additional user property. Currently, Microsoft 365 admin center share users functionality or Microsoft Entra cross-tenant synchronization are currently the only accepted methods to get this additional user property populated.

- As part of a multi-tenant organization, [reset redemption status for a B2B user](../external-identities/reset-redemption-status.md) is currently unavailable and disabled.

## B2B user or B2B member related issues

- The promotion of B2B guests to B2B members represents a strategic decision by multi-tenant organizations to consider B2B members as trusted users of the organization. Review the [default permissions](../fundamentals/users-default-permissions.md) for B2B members.

- To promote B2B guests to B2B members, a source tenant administrator can amend the [attribute mappings](cross-tenant-synchronization-configure.md#step-9-review-attribute-mappings), or a target tenant administrator can [change the userType](../fundamentals/how-to-manage-user-profile-info.md#add-or-change-profile-information) if the property is not recurringly synchronized.


- In [SharePoint OneDrive](/sharepoint/), the promotion of B2B guests to B2B members may not happen automatically. If faced with a user type mismatch between Microsoft Entra ID and SharePoint OneDrive, try [Set-SPUser [-SyncFromAD]](/powershell/module/sharepoint-server/set-spuser).

- In [SharePoint OneDrive](/sharepoint/) user interfaces, when sharing a file with *People in Fabrikam*, the current user interfaces might be counterintuitive, because B2B members in Fabrikam from Contoso count towards *People in Fabrikam*.

- In [Microsoft Forms](/office365/servicedescriptions/microsoft-forms-service-description), B2B member users may not be able to access forms.

- In [Microsoft Power BI](/power-bi/enterprise/service-admin-azure-ad-b2b#who-can-you-invite), B2B member users may require license assignment in addition to having an untested experience. Power BI preview for B2B members as part of a multi-tenant organization is expected.

- In [Microsoft Power Apps](/power-platform/), [Microsoft Dynamics 365](/dynamics365/), and other workloads, B2B member users may require license assignment. Experiences for B2B members are untested.

## User synchronization issues

- When to use Microsoft 365 admin center to share users: If you haven't previously used Microsoft Entra cross-tenant synchronization, and you intend to establish a [collaborating user set](multi-tenant-organization-microsoft-365.md#collaborating-user-set) topology where the same set of users is shared to all multi-tenant organization tenants, you may want to use the Microsoft 365 admin center share users functionality.

- When to use Microsoft Entra cross-tenant synchronization: If you're already using Microsoft Entra cross-tenant synchronization, for various [multi-hub multi-spoke topologies](cross-tenant-synchronization-topology.md), you don't need to use the Microsoft 365 admin center share users functionality. Instead, you may want to continue using your existing Microsoft Entra cross-tenant synchronization jobs.

- Contact objects: The at-scale provisioning of B2B users may collide with contact objects. The handling or conversion of contact objects is currently not supported.

- Microsoft 365 admin center / Microsoft Entra ID: Whether you use the Microsoft 365 admin center share users functionality or Microsoft Entra cross-tenant synchronization, the following items apply:

    - In the identity platform, both methods are represented as Microsoft Entra cross-tenant synchronization jobs.
    - You may adjust the attribute mappings to match your organizations' needs.
    - By default, new B2B users are provisioned as B2B members, while existing B2B guests remain B2B guests.
    - You can opt to convert B2B guests into B2B members by setting [**Apply this mapping** to **Always**](cross-tenant-synchronization-configure.md#step-9-review-attribute-mappings).

- Microsoft 365 admin center / Microsoft Entra ID: If you're using Microsoft Entra cross-tenant synchronization to provision your users, rather than the Microsoft 365 admin center share users functionality, Microsoft 365 admin center indicates an **Outbound sync status** of **Not configured**. This is expected preview behavior. Currently, Microsoft 365 admin center only shows the status of Microsoft Entra cross-tenant synchronization jobs created and managed by Microsoft 365 admin center and doesn't display Microsoft Entra cross-tenant synchronizations created and managed in Microsoft Entra ID.

- Microsoft 365 admin center / Microsoft Entra ID: If you view Microsoft Entra cross-tenant synchronization in Microsoft Entra admin center, after adding tenants to or after joining a multi-tenant organization in Microsoft 365 admin center, you'll see a cross-tenant synchronization configuration with the name MTO_Sync_&lt;TenantID&gt;. Refrain from editing or changing the name if you want Microsoft 365 admin center to recognize the configuration as created and managed by Microsoft 365 admin center.

- Microsoft 365 admin center / Microsoft Entra ID: There's no established or supported pattern for Microsoft 365 admin center to take control of pre-existing Microsoft Entra cross-tenant synchronization configurations and jobs.

- Advantage of using cross-tenant access settings template for identity synchronization: Microsoft Entra cross-tenant synchronization doesn't support establishing a cross-tenant synchronization configuration before the tenant in question allows inbound synchronization in their cross-tenant access settings for identity synchronization. Hence the usage of the cross-tenant access settings template for identity synchronization is encouraged, with `userSyncInbound` set to true, as facilitated by Microsoft 365 admin center.

- Source of Authority Conflict: Using Microsoft Entra cross-tenant synchronization to target hybrid identities that have been converted to B2B users has not been tested and is not supported.

- Syncing B2B guests versus B2B members: As your organization rolls out the multi-tenant organization functionality including provisioning of B2B users across multi-tenant organization tenants, you might want to provision some users as B2B guests, while provision others users as B2B members. To achieve this, you may want to establish two Microsoft Entra cross-tenant synchronization configurations in the source tenant, one with userType attribute mappings configured to B2B guest, and another with userType attribute mappings configured to B2B member, each with [**Apply this mapping** set to **Always**](cross-tenant-synchronization-configure.md#step-9-review-attribute-mappings). By moving a user from one configuration's scope to the other, you can easily control who will be a B2B guest or a B2B member in the target tenant.

- Cross-tenant synchronization deprovisioning: By default, when provisioning scope is reduced while a synchronization job is running, users fall out of scope and are soft deleted, unless Target Object Actions for Delete is disabled. For more information, see [Deprovisioning](cross-tenant-synchronization-overview.md#deprovisioning) and [Define who is in scope for provisioning](cross-tenant-synchronization-configure.md#step-8-optional-define-who-is-in-scope-for-provisioning-with-scoping-filters).

- Cross-tenant synchronization deprovisioning: Currently, [SkipOutOfScopeDeletions](../app-provisioning/skip-out-of-scope-deletions.md?toc=/azure/active-directory/multi-tenant-organizations/toc.json&pivots=cross-tenant-synchronization) works for application provisioning jobs, but not for Microsoft Entra cross-tenant synchronization. To avoid soft deletion of users taken out of scope of cross-tenant synchronization, set [Target Object Actions for Delete](cross-tenant-synchronization-configure.md#step-8-optional-define-who-is-in-scope-for-provisioning-with-scoping-filters) to disabled.

## Next steps

- [Known issues for provisioning in Microsoft Entra ID](../app-provisioning/known-issues.md?toc=/azure/active-directory/multi-tenant-organizations/toc.json&pivots=cross-tenant-synchronization)
