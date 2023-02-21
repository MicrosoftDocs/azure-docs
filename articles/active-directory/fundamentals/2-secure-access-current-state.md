---
title: Discover the current state of external collaboration with Azure Active Directory 
description: Learn methods to discover the current state of your collaboration
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 02/21/2023
ms.author: gasinh
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Discover the current state of external collaboration in your organization

Before you learn about the current state of your external collaboration, determine a security posture. Consider centralized vs. delegated control, also governance, regulatory, and compliance targets.

Learn more: [Determine your security posture for external users](1-secure-access-posture.md)

Users in your organization likely collaborate with users from other organizations. Collaboration can occur with productivity applications like Microsoft 365, by email, or sharing resources with external users. The foundation of your governance plan can include:

* Users initiating external collaboration
* Collaboration with external users and organizations
* Access granted to external users

## Users initiating external collaboration

Users seeking external collaboration know the applications needed for their work, and when access ends. Therefore, determine users with delegated permission to invite external users, create access packages, and complete access reviews.

To find collaborating users:

* [Microsoft 365, audit log activities](/microsoft-365/compliance/audit-log-activities?view=o365-worldwide&preserve-view=true)
* [Auditing and reporting a B2B collaboration user](../external-identities/auditing-and-reporting.md)

## Collaboration with external users and organizations

External users might be Azure AD B2B users with partner-managed credentials, or external users with locally provisioned credentials. Typically, these users are a UserType of Guest. See, [B2B collaboration overview](../external-identities/what-is-b2b.md).

You can enumerate guest users with:

* [Microsoft Graph API](/graph/api/user-list?tabs=http)
* [PowerShell](/graph/api/user-list?tabs=http)
* [Azure portal](../enterprise-users/users-bulk-download.md)

There are tools to identify Azure AD B2B collaboration, external Azure AD tenants and users accessing applications:

* [PowerShell module](https://github.com/AzureAD/MSIdentityTools/wiki/Get-MSIDCrossTenantAccessActivity)
* [Azure Monitor workbook](../reports-monitoring/workbook-cross-tenant-access-activity.md)

### Email domains and companyName property

Determine external organizations with the domain names of external user email addresses. This discovery might not be possible with consumer identity providers such as Google. We recommend you write the companyName attribute to identify external organizations.

### Allowlist, blocklist, and entitlement management

For your organization to collaborate with, or block, specific organizations, at the tenant level, there is allowlist or blocklist. Use this feature to control B2B invitations and redemptions regardless of source (such as Microsoft Teams, SharePoint, or the Azure portal). See, [Allow or block invitations to B2B users from specific organizations](../external-identities/allow-deny-list.md).

If you use entitlement management, you can confine access packages to a subset of partners with the **Specific connected organizations** option, under New access packages, in Identity Governance.

   ![Screenshot of the Specific connected organizations option, under New access packages.](media/secure-external-access/2-new-access-package.png)

## External user access

After you have an inventory of external users and organizations, determine the access to grant to these users. You can use the Microsoft Graph API to determine Azure AD group membership or application assignment.

* [Working with groups in Microsoft Graph](/graph/api/resources/groups-overview?context=graph%2Fcontext&view=graph-rest-1.0&preserve-view=true)
* [Applications API overview](/graph/applications-concept-overview?view=graph-rest-1.0&preserve-view=true)

### Enumerate application permissions

Investigate access to your sensitive apps for awareness about external access. See, [Grant or revoke API permissions programmatically](/graph/permissions-grant-via-msgraph?view=graph-rest-1.0&tabs=http&pivots=grant-application-permissions&preserve-view=true).

### Detect informal sharing

If your email and network plans are enabled, you can investigate content sharing through email or unauthorized software as a service (SaaS) apps. 

* Identify, prevent, and monitor accidental sharing
  * [Learn about data loss prevention](/microsoft-365/compliance/dlp-learn-about-dlp?view=o365-worldwide&preserve-view=true )
* Identify unauthorized apps
  * [Microsoft Defender for Cloud Apps overview](/defender-cloud-apps/what-is-defender-for-cloud-apps)

## Next steps

* [Determine your security posture for external access](1-secure-access-posture.md)
* [Create a security plan for external access](3-secure-access-plan.md)
* [Securing external access with groups](4-secure-access-groups.md)
* [Transition to governed collaboration with Azure Active Directory B2B collaboration](5-secure-access-b2b.md)
* [Manage external access with entitlement management](6-secure-access-entitlement-managment.md)
* [Manage external access with Conditional Access policies](7-secure-access-conditional-access.md)
* [Control access with sensitivity labels](8-secure-access-sensitivity-labels.md)
* [Secure external access to Microsoft Teams, SharePoint, and OneDrive for Business](9-secure-access-teams-sharepoint.md)
