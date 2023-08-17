---
title: Known issues for multi-tenant organizations (Preview)
description: Learn about known issues when you work with multi-tenant organizations in Azure Active Directory.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: multi-tenant-organizations
ms.topic: troubleshooting
ms.date: 05/05/2023
ms.author: rolyon
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Known issues for multi-tenant organizations (Preview)

> [!IMPORTANT]
> Multi-tenant organization is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article discusses known issues to be aware of when you work with multi-tenant organization functionality across Azure AD and Microsoft 365. To provide feedback about the multi-tenant organization functionality on UserVoice, see [Azure Active Directory (Azure AD) UserVoice](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789?category_id=360892). We watch UserVoice closely so that we can improve the service.

## In scope

- Azure AD admin experiences and issues related to multi-tenant organizations for the purpose of seamless collaboration experiences in new Teams, with reciprocally provisioned B2B members.

## Related scope

- Microsoft Admin Center experiences and issues related to multi-tenant organizations
- Microsoft 365 Multi-tenant organization People Search experiences and issues
- Cross-tenant synchronization issues related to Microsoft 365

## Beyond scope

- Cross-tenant synchronization unrelated to Microsoft 365
- End user experiences in new Teams
- End user experiences in Power BI
- Tenant migration or consolidation

## Unsupported Scenarios

- Seamless collaboration experience across multi-tenant organizations in classic Teams
- Self-service for multi-tenant organizations larger than 5 tenants or 100,000 internal users per tenant
- Using provisioning or synchronization engines other than Azure AD cross-tenant synchronization
- Multi-tenant organizations in government clouds or sovereign clouds
- Cross-cloud multi-tenant organizations

## Multi-tenant organization related issues or disclosures

- Allow for at least 2 hours between the creation of a multi-tenant organization and any tenant joining the multi-tenant organization.

- Allow for up to 4 hours between submission of a multi-tenant organization join request and the same join request to succeed and finish.

- Self-service of multi-tenant organization functionality is limited to a maximum of 5 tenants and 100,000 internal users per tenant. To request a raise in these limits, submit an Azure AD or Microsoft Admin Center support request.

- In MS Graph APIs, the default limits of 5 tenants and 100,000 internal users per tenant are only enforced at the time of joining. In Microsoft Admin Center the default limits are enforced at multi-tenant organization creation time as well as at time of joining. 

- There are multiple reasons why a join request might fail. If Microsoft Admin Center does not indicate why a join request is not succeeding, try examining the join request response in MS Graph APIs, via Graph Explorer.

- There is a very small fraction of organizations, likely those that participated in early private previews of cross-tenant access policies, whose join request might fail. If you followed the correct sequence of creating a multi-tenant organization, adding a tenant to the multi-tenant organization, and the added tenant's join request keeps failing, please submit a support request to Azure AD or Microsoft Admin Center.

- As part of a multi-tenant organization, redeemed B2B users are expected to receive an additional user property, the [home tenant identifier](/graph/api/user-list?view=graph-rest-beta&branch=pr-en-us-19722&tabs=http#example-14-list-information-about-synchronized-users) of the B2B user. On already redeemed B2B users, Microsoft Admin Center share users functionality or Azure AD cross-tenant synchronization are currently the only accepted methods to get this additional user property populated. In time, Microsoft Admin Center share users functionality or Azure AD cross-tenant synchronization shall not be required, if you prefer your own alternative provisioning engine.

- As part of a multi-tenant organization, redeemed B2B users are expected to receive an additional user property, the [home tenant identifier](/graph/api/user-list?view=graph-rest-beta&branch=pr-en-us-19722&tabs=http#example-14-list-information-about-synchronized-users) of the B2B user. Newly invited B2B users receive this additional user property today.

- As part of a multi-tenant organization, [reset redemption status for a B2B user](../external-identities/reset-redemption-status.md) is unavailable and disabled at this time. Making the home tenant identifier a mutable user property will take coordination across Microsoft services.

## B2B user or B2B member related issues or disclosures

- When to use [Azure AD B2B member Invite](../external-identities/add-users-administrator.md) functionality: For testing purposes and one-off invitations, B2B members redeemed after formation of a multi-tenant organization can now be used to test the new seamless collaboration experience in new Microsoft Teams.

- The creation of B2B users may collide with [contacts in Exchange Online](/exchange/recipients-in-exchange-online/recipients-in-exchange-online). The handling or conversion of contact objects is currently not supported.

- The [conversion of internal users to B2B members](../external-identities/invite-internal-users.md) and the recognition of such converted B2B members for seamless multi-tenant organization collaboration in new Microsoft Teams has yet to be tested.

- The promotion of B2B guests to B2B members represents a strategic decision by multi-tenant organizations to consider B2B members as trusted users of the organization. Review the [default permissions](../fundamentals/users-default-permissions.md) for B2B members.

- The promotion of B2B guests to B2B members may be achieved in the source tenant via cross-tenant synchronization or in the B2B guest hosting tenant by changing a user's non-synchronized userType property.

- In [SharePoint OneDrive](/sharepoint/), the promotion of B2B guests to B2B members may not happen automatically. If faced with a user type mismatch between Azure AD and SharePoint OneDrive, try [Set-SPUser [-SyncFromAD]](/powershell/module/sharepoint-server/set-spuser?view=sharepoint-server-ps).

- In [SharePoint OneDrive](/sharepoint/) user interfaces, when sharing a file with *People in Fabrikam*, the current user interfaces may be counterintuitive, because B2B members in Fabrikam from Contoso count towards *People in Fabrikam*.

- In [Microsoft Forms](/office365/servicedescriptions/microsoft-forms-service-description), B2B member users may not be able to access forms. This represents a regression in functionality compared to B2B guests, and the functionality gap is to be closed over time.

- In [Microsoft Power BI](/power-bi/enterprise/service-admin-azure-ad-b2b#who-can-you-invite), B2B member  users may require license assignment in addition to having an untested experience. Power BI preview for B2B members as part of a multi-tenant organization is expected.

- In [Microsoft Power Apps](/power-platform/), [Microsoft Dynamics 365](/dynamics365/), and other workloads, B2B member users may require license assignment. Experiences for B2B members are untested.


## User synchronization issues or disclosures

- When to use Microsoft Admin Center to share users: If you have not previously used Azure AD cross-tenant synchronization, and you intend to establish a [collaborating user set](multi-tenant-organization-microsoft-365.md#collaborating-user-set) topology where the same set of users is shared to all multi-tenant organization tenants, you may want to use the Microsoft Admin Center share users functionality.

- When to use Azure AD cross-tenant synchronization: If you are already using Azure AD cross-tenant synchronization, for various [multi-hub multi-spoke topologies](cross-tenant-synchronization-topology.md), you do not need to use the Microsoft Admin Center share users functionality. Instead, you may want to continue using your existing Azure AD cross-tenant synchronization jobs.

- When to use your own alternative provisioning engine: If you already are using an alternative provisioning engine, in the future, you will be able to continue using such provisioning engine. As already described, however, at this time of the public preview, seamless collaboration in new Microsoft Teams still relies on usage of the Microsoft Admin Center share users functionality or Azure AD cross-tenant synchronization. In the future, you will be able to continue using your existing alternative provisioning engine.

- Contact objects: The at-scale provisioning or synchronization of B2B users may collide with contact objects. The handling or conversion of contact objects is currently not supported.

- Admin Center / Azure AD: Regardless of whether you use the Microsoft Admin Center share users functionality or Azure AD cross-tenant synchronization

    - in the identity platform, they are both represented as Azure AD cross-tenant synchronization jobs.
    - you may adjust the attribute mappings to match your organizations' needs
    - by default, new B2B users are provisioned as B2B members, while existing B2B guests remain B2B guests
    - you can opt to convert B2B guests into B2B members by setting [**Apply this mapping** to **Always**](cross-tenant-synchronization-configure.md#step-9-review-attribute-mappings)

- Admin Center / Azure AD: If you are using Azure AD cross-tenant synchronization to provision your users, rather than the Microsoft Admin Center share users functionality, Microsoft Admin Center will indicate an **Outbound sync status** of  **Not configured**. This is expected preview behavior. At this time, Microsoft Admin Center only shows the status of Azure AD cross-tenant synchronization jobs created and managed by Microsoft Admin Center and does not display Azure AD cross-tenant synchronizations created and managed in Azure AD.

- Admin Center / Azure AD: If you visit Azure AD cross-tenant synchronization in Azure Portal, after adding tenants to or after joining a multi-tenant organization in Microsoft Admin Center, you will see a cross-tenant synchronization configuration with the name MTO_Sync_<TenantID>. Refrain from editing or changing the name if you want Microsoft Admin Center to recognize the configuration as created and managed by Microsoft Admin Center.

- Admin Center / Azure AD: There is no established or supported pattern for Microsoft Admin Center to take control of pre-existing Azure AD cross-tenant synchronization configurations and jobs.

- Advantage of using cross-tenant access settings template for identity synchronization: Azure AD cross-tenant synchronization does not support establishing a cross-tenant synchronization configuration before the tenant in question allows inbound synchronization in their cross-tenant access settings for identity synchronization. Hence the usage of the cross-tenant access settings template for identity synchronization is encouraged, with userSyncInbound set to true, as facilitated by Microsoft Admin Center.

- B2B users in scope of multiple sync engines: The use of [Azure AD Connect](../hybrid/connect/whatis-azure-ad-connect.md) or [Azure AD Cloud sync](../hybrid/cloud-sync/concept-how-it-works.md), followed by the conversion of [hybrid identities](../hybrid/whatis-hybrid-identity.md) into [B2B members](../external-identities/invite-internal-users.md), subsequent synchronization of such B2B members with [Azure AD cross-tenant synchronization](cross-tenant-synchronization-overview.md), and the recognition of such hybrid converted B2B members for seamless multi-tenant organization collaboration in new Microsoft Teams has yet to be tested.

- Synching B2B guests versus B2B members: As your organization rolls out the multi-tenant organization functionality including provisioning of B2B users across multi-tenant organization tenants, some users may be desired to be provisioned as B2B guests, while others may be desired to be provisioned as B2B members. To achieve this, you may want to establish two Azure AD cross-tenant synchronization configurations in the source tenant, one with userType attribute mappings configured to B2B guest, and another with userType attribute mappings configured to B2B member, each with [**Apply this mapping** set to **Always**](cross-tenant-synchronization-configure.md#step-9-review-attribute-mappings). By moving a user from one configuration's scope to the other, you can easily control who will be a B2B guest or a B2B member in the target tenant.

- Cross-tenant synchronization deprovisioning: By default, when provisioning scope is reduced while a synchronization job is running, users fall out of scope and are soft deleted, unless Target Object Actions for Delete is disabled. For more information, see [Deprovisioning](cross-tenant-synchronization-overview.md#deprovisioning) and [Define who is in scope for provisioning](cross-tenant-synchronization-configure.md#step-8-optional-define-who-is-in-scope-for-provisioning-with-scoping-filters).

- Cross-tenant synchronization deprovisioning: At this time, [SkipOutOfScopeDeletions](../app-provisioning/skip-out-of-scope-deletions.md?toc=%2Fazure%2Factive-directory%2Fmulti-tenant-organizations%2Ftoc.json&pivots=cross-tenant-synchronization) works for application provisioning jobs, but not for Azure AD cross-tenant synchronization. To avoid soft deletion of users taken out of scope of cross-tenant synchronization, set [Target Object Actions for Delete](cross-tenant-synchronization-configure.md#step-8-optional-define-who-is-in-scope-for-provisioning-with-scoping-filters) to disabled.


## Next steps

- [Known issues for provisioning in Azure Active Directory](../app-provisioning/known-issues.md?toc=/azure/active-directory/multi-tenant-organizations/toc.json&pivots=cross-tenant-synchronization)
