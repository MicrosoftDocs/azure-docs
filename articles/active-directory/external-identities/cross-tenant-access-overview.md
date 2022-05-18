---
title: Cross-tenant access overview - Azure AD
description: Get an overview of cross-tenant access in Azure AD External Identities. Learn how to manage your B2B collaboration with other Azure AD organizations through this overview of cross-tenant access settings.
services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 03/21/2022

ms.author: mimart
author: msmimart
manager: celestedg
ms.custom: "it-pro"
ms.collection: M365-identity-device-management
---

# Overview: Cross-tenant access with Azure AD External Identities (Preview)

> [!NOTE]
> Cross-tenant access settings are preview features of Azure Active Directory. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure AD organizations can use External Identities cross-tenant access settings to manage how they collaborate with other Azure AD organizations through [B2B collaboration](cross-tenant-access-settings-b2b-collaboration.md) and [B2B direct connect](cross-tenant-access-settings-b2b-direct-connect.md). Cross-tenant access settings give you granular control over how external Azure AD organizations collaborate with you (inbound access) and how your users collaborate with external Azure AD organizations (outbound access). These settings also let you trust multi-factor authentication (MFA) and device claims ([compliant claims and hybrid Azure AD joined claims](../conditional-access/howto-conditional-access-policy-compliant-device.md)) from other Azure AD organizations.

This article describes cross-tenant access settings, which are used to manage B2B collaboration and B2B direct connect with external Azure AD organizations. Additional settings are available for B2B collaboration with non-Azure AD identities (for example, social identities or non-IT managed external accounts). These [external collaboration settings](external-collaboration-settings-configure.md) include options for restricting guest user access, specifying who can invite guests, and allowing or blocking domains.

![Overview diagram of cross-tenant access settings](media/cross-tenant-access-overview/cross-tenant-access-settings-overview.png)
 
## Manage external access with inbound and outbound settings

By default, B2B collaboration with other Azure AD organizations is enabled, and B2B direct connect is blocked. But the following comprehensive admin settings let you manage both of these features.

- **Outbound access settings** control whether your users can access resources in an external organization. You can apply these settings to everyone, or specify individual users, groups, and applications.

- **Inbound access settings** control whether users from external Azure AD organizations can access resources in your organization. You can apply these settings to everyone, or specify individual users, groups, and applications.

- **Trust settings** (inbound) determine whether your Conditional Access policies will trust the multi-factor authentication (MFA), compliant device, and [hybrid Azure AD joined device](../devices/concept-azure-ad-join-hybrid.md) claims from an external organization if their users have already satisfied these requirements in their home tenants. For example, when you configure your trust settings to trust MFA, your MFA policies are still applied to external users, but users who have already completed MFA in their home tenants won't have to complete MFA again in your tenant.

## Default settings

The default cross-tenant access settings apply to all Azure AD organizations external to your tenant, except those for which you've configured organizational settings. You can change your default settings, but the initial default settings for B2B collaboration and B2B direct connect are as follows:

- **B2B collaboration**: All your internal users are enabled for B2B collaboration by default. This means your users can invite external guests to access your resources and they can be invited to external organizations as guests. MFA and device claims from other Azure AD organizations aren't trusted.

- **B2B direct connect**: No B2B direct connect trust relationships are established by default. Azure AD blocks all inbound and outbound B2B direct connect capabilities for all external Azure AD tenants.

- **Organizational settings**: No organizations are added to your Organizational settings by default. This means all external Azure AD organizations are enabled for B2B collaboration with your organization.

## Organizational settings

You can configure organization-specific settings by adding an organization and modifying the inbound and outbound settings for that organization. Organizational settings take precedence over default settings.

- For B2B collaboration with other Azure AD organizations, use cross-tenant access settings to manage inbound and outbound B2B collaboration and scope access to specific users, groups, and applications. You can set a default configuration that applies to all external organizations, and then create individual, organization-specific settings as needed. Using cross-tenant access settings, you can also trust multi-factor (MFA) and device claims (compliant claims and hybrid Azure AD joined claims) from other Azure AD organizations.

- For B2B direct connect, use organizational settings to set up a mutual trust relationship with another Azure AD organization. Both your organization and the external organization need to mutually enable B2B direct connect by configuring inbound and outbound cross-tenant access settings.

- You can use external collaboration settings to limit who can invite external users, allow or block B2B specific domains, and set restrictions on guest user access to your directory.

## Important considerations

> [!IMPORTANT]
> Changing the default inbound or outbound settings to block access could block existing business-critical access to apps in your organization or partner organizations. Be sure to use the tools described in this article and consult with your business stakeholders to identify the required access.

- To configure cross-tenant access settings in the Azure portal, you'll need an account with a Global administrator or Security administrator role.

- To configure trust settings or apply access settings to specific users, groups, or applications, you'll need an Azure AD Premium P1 license.

- Cross-tenant access settings are used to manage B2B collaboration and B2B direct connect with other Azure AD organizations. For B2B collaboration with non-Azure AD identities (for example, social identities or non-IT managed external accounts), use [external collaboration settings](external-collaboration-settings-configure.md). External collaboration settings include B2B collaboration options for restricting guest user access, specifying who can invite guests, and allowing or blocking domains.

- If you want to apply access settings to specific users, groups, or applications in an external organization, you'll need to contact the organization for information before configuring your settings. Obtain their user object IDs, group object IDs, or application IDs (*client app IDs* or *resource app IDs*) so you can target your settings correctly.

  > [!TIP]
  > You might be able to find the application IDs for apps in external organizations by checking your sign-in logs. See the [Identify inbound and outbound sign-ins](#identify-inbound-and-outbound-sign-ins) section.

- The access settings you configure for users and groups must match the access settings for applications. Conflicting settings aren't allowed, and you’ll see warning messages if you try to configure them.

  - **Example 1**: If you block inbound access for all external users and groups, access to all your applications must also be blocked.

  - **Example 2**: If you allow outbound access for all your users (or specific users or groups), you’ll be prevented from blocking all access to external applications; access to at least one application must be allowed.

- If you want to allow B2B direct connect with an external organization and your Conditional Access policies require MFA, you must configure your trust settings so that your Conditional Access policies will accept MFA claims from the external organization.

- If you block access to all apps by default, users will be unable to read emails encrypted with Microsoft Rights Management Service (also known as Office 365 Message Encryption or OME). To avoid this issue, we recommend configuring your outbound settings to allow your users to access this app ID: 00000012-0000-0000-c000-000000000000. If this is the only application you allow, access to all other apps will be blocked by default.

## Identify inbound and outbound sign-ins

Several tools are available to help you identify the access your users and partners need before you set inbound and outbound access settings. To ensure you don’t remove access that your users and partners need, you should examine current sign-in behavior. Taking this preliminary step will help prevent loss of desired access for your end users and partner users. However, in some cases these logs are only retained for 30 days, so we strongly recommend you speak with your business stakeholders to ensure required access isn't lost.

### Cross-tenant sign-in activity PowerShell script

To review user sign-in activity associated with external tenants, use the [cross-tenant user sign-in activity](https://aka.ms/cross-tenant-signins-ps) PowerShell script. For example, to view all available sign-in events for inbound activity (external users accessing resources in the local tenant) and outbound activity (local users accessing resources in an external tenant), run the following command:

```powershell
Get-MSIDCrossTenantAccessActivity -SummaryStats -ResolveTenantId
```

The output is a summary of all available sign-in events for inbound and outbound activity, listed by external tenant ID and external tenant name.

### Sign-in logs PowerShell script

To determine your users' access to external Azure AD organizations, use the [Get-MgAuditLogSignIn](/powershell/module/microsoft.graph.reports/get-mgauditlogsignin) cmdlet in the Microsoft Graph PowerShell SDK to view data from your sign-in logs for the last 30 days. For example, run the following command:

```powershell
#Initial connection
Connect-MgGraph -Scopes "AuditLog.Read.All"
Select-MgProfile -Name "beta"

#Get external access
$TenantId = "<replace-with-your-tenant-ID>"

Get-MgAuditLogSignIn -Filter "ResourceTenantId ne '$TenantID'" -All:$True |
Group-Object ResourceTenantId,AppDisplayName,UserPrincipalName |
Select-Object count,@{n='Ext TenantID/App User Pair';e={$_.name}}
```

The output is a list of outbound sign-ins initiated by your users to apps in external tenants.

### Azure Monitor

If your organization subscribes to the Azure Monitor service, use the [Cross-tenant access activity workbook](../reports-monitoring/workbook-cross-tenant-access-activity.md) (available in the Monitoring workbooks gallery in the Azure portal) to visually explore inbound and outbound sign-ins for longer time periods.

### Security Information and Event Management (SIEM) Systems

If your organization exports sign-in logs to a Security Information and Event Management (SIEM) system, you can retrieve the required information from your SIEM system.

## Identify changes to cross-tenant access settings

The Azure AD audit logs capture all activity around cross-tenant access setting changes and activity. To audit changes to your cross-tenant access settings, use the **category** of ***CrossTenantAccessSettings*** to filter all activity to show changes to cross-tenant access settings.

![Audit logs for cross-tenant access settings](media/cross-tenant-access-overview/cross-tenant-access-settings-audit-logs.png)

## Next steps

[Configure cross-tenant access settings for B2B collaboration](cross-tenant-access-settings-b2b-collaboration.md)
[Configure cross-tenant access settings for B2B direct connect](cross-tenant-access-settings-b2b-direct-connect.md)

