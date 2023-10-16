---
title: 'Microsoft Entra Connect: Group writeback'
description: This article describes group writeback in Microsoft Entra Connect. 
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---

# Plan for Microsoft Entra Connect group writeback
 
Group writeback allows you to write cloud groups back to your on-premises Active Directory instance by using Microsoft Entra Connect Sync. You can use this feature to manage groups in the cloud, while controlling access to on-premises applications and resources.  

> [!NOTE]
> The group writeback functionality is currently in Public Preview as we are collecting customer feedback and telemetry. Please refer to [the limitations](#understand-limitations-of-public-preview) before you enable this functionality. You should not deploy the functionality to write back security groups in your production environment. We are planning to replace the AADConnect security group writeback functionality with the new cloud sync group writeback feature, and when this releases we will remove the AADConnect Group Writeback functionality. This does not impact M365 group writeback functionality, which will remain unchanged.


There are two versions of group writeback. The original version is in general availability and is limited to writing back Microsoft 365 groups to your on-premises Active Directory instance as distribution groups. The new, expanded version of group writeback is in public preview and enables the following capabilities:  

- You can write back Microsoft 365 groups as distribution groups, security groups, or mail-enabled security groups.  
- You can write back Microsoft Entra security groups as security groups.  
- All groups are written back with a group scope of **Universal**.  
- You can write back groups that have assigned and dynamic memberships. 
- You can configure directory settings to control whether newly created Microsoft 365 groups are written back by default.  
- Group nesting in Microsoft Entra ID will be written back if both groups exist in Active Directory. 
- Written-back groups nested as members of on-premises Active Directory synced groups will be synced up to Microsoft Entra ID as nested. 
- Devices that are members of writeback-enabled groups in Microsoft Entra ID will be written back as members of Active Directory. Microsoft Entra registered and Microsoft Entra joined devices require device writeback to be enabled for group membership to be written back.
- You can configure the common name in an Active Directory group's distinguished name to include the group's display name when it's written back.  
- You can use the [Microsoft Entra admin center](https://entra.microsoft.com), Graph Explorer, and PowerShell to configure which Microsoft Entra groups are written back. 

The new version is enabled on the tenant and not per Microsoft Entra Connect client instance. Make sure that all Microsoft Entra Connect client instances are updated to a minimal build of [Microsoft Entra Connect version 2.0 or later](https://www.microsoft.com/download/details.aspx?id=47594) if group writeback is currently enabled on the client instance. 

This article walks you through activities that you should complete before you enable group writeback for your tenant. These activities include discovering your current configuration, verifying the prerequisites, and choosing the deployment approach. 

## Discover if group writeback is enabled in your environment

To discover if Microsoft Entra Connect group writeback is already enabled in your environment, use the `Get-ADSyncAADCompanyFeature` PowerShell cmdlet. The cmdlet is part of the [ADSync PowerShell](reference-connect-adsync.md) module that's installed with Microsoft Entra Connect. 

[![Screenshot of Get-ADSyncAADCompanyFeature cmdlet.](media/how-to-connect-group-writeback/powershell-1.png)](media/how-to-connect-group-writeback/powershell-1.png#lightbox)

`UnifiedGroupWriteback` refers to the original version. `GroupWritebackV2` refers to the new version. 

A value of `False` indicates that the feature is not enabled. 

## Discover the current writeback settings for existing Microsoft 365 groups 

To view the existing writeback settings on Microsoft 365 groups in the portal, go to each group and select its properties.

[![Screenshot of Microsoft 365 group properties.](media/how-to-connect-group-writeback/group-2.png)](media/how-to-connect-group-writeback/group-2.png#lightbox)

You can also view the writeback state via Microsoft Graph. For more information, see [Get group](/graph/api/group-get?tabs=http&view=graph-rest-beta&preserve-view=true).  

> Example: `GET https://graph.microsoft.com/beta/groups?$filter=groupTypes/any(c:c eq 'Unified')&$select=id,displayName,writebackConfiguration`  

> If `isEnabled` is `null` or `true`, the group will be written back.

> If `isEnabled` is `false`, the group won't be written back.  

Finally, you can view the writeback state via PowerShell by using the  [Microsoft Identity Tools PowerShell module](https://www.powershellgallery.com/packages/MSIdentityTools/2.0.16). 

> Example: `Get-mggroup -filter "groupTypes/any(c:c eq 'Unified')" | Get-MsIdGroupWritebackConfiguration` 

## Discover the default writeback setting for newly created Microsoft 365 groups 

For groups that haven't been created yet, you can view whether or not they'll be written back automatically.

To see the default behavior in your environment for newly created groups, use the [directorySetting](/graph/api/resources/directorysetting?view=graph-rest-beta&preserve-view=true) resource type in Microsoft Graph. 

> Example: `GET https://graph.microsoft.com/beta/Settings` 

> If a `directorySetting` value of `Group.Unified` doesn't exist, the default directory setting is applied and newly created Microsoft 365 groups *will automatically* be written back. 

> If a `directorySetting` value of `Group.Unified` exists with a `NewUnifiedGroupWritebackDefault` value of `false`, Microsoft 365 groups *won't automatically* be enabled for writeback when they're created. If the value is not specified or is set to `true`, newly created Microsoft 365 groups *will automatically* be written back.  

You can also use the PowerShell cmdlet [AzureADDirectorySetting](../../enterprise-users/groups-settings-cmdlets.md). 

> Example: `Get-AzureADDirectorySetting | ? { $_.DisplayName -eq "Group.Unified"} | Select-Object -ExpandProperty Values` 

> If nothing is returned, you're using the default directory settings. Newly created Microsoft 365 groups *will automatically* be written back. 

> If `directorySetting` is returned with a `NewUnifiedGroupWritebackDefault` value of `false`, Microsoft 365 groups *won't automatically* be enabled for writeback when they're created. If the value is not specified or is set to `true`, newly created Microsoft 365 groups *will automatically* be written back. 

## Discover if Active Directory has been prepared for Exchange 
To verify if Active Directory has been prepared for Exchange, see [Prepare Active Directory and domains for Exchange Server](/Exchange/plan-and-deploy/prepare-ad-and-domains?view=exchserver-2019&preserve-view=true#how-do-you-know-this-worked).

## Meet prerequisites for public preview 
The following are prerequisites for group writeback:

- A Microsoft Entra ID P1 or P2 license 
- Microsoft Entra Connect version 2.0.89.0 or later

An optional prerequisite is Exchange Server 2016 CU15 or later. You need it only for configuring cloud groups with an Exchange hybrid. For more information, see [Configure Microsoft 365 Groups with on-premises Exchange hybrid](/exchange/hybrid-deployment/set-up-microsoft-365-groups#prerequisites). If you haven't [prepared Active Directory for Exchange](/Exchange/plan-and-deploy/prepare-ad-and-domains?view=exchserver-2019&preserve-view=true), mail-related attributes of groups won't be written back. 

## Choose the right approach 
The right deployment approach for your organization depends on the current state of group writeback in your environment and the desired writeback behavior. 

When you're enabling group writeback, you'll experience the following default behavior: 

- All existing Microsoft 365 groups will automatically be written back to Active Directory, including all Microsoft 365 groups created in the future. Microsoft Entra security groups are not automatically written back. They must each be enabled for writeback. 
- Groups that have been written back won't be deleted in Active Directory if they're disabled for writeback or soft deleted. They'll remain in Active Directory until they're hard deleted in Microsoft Entra ID. 

  Changes made to these groups in Microsoft Entra ID won't be written back until the groups are re-enabled for writeback or restored from a soft-delete state. This requirement helps protect the Active Directory groups from accidental deletion, if they're unintentionally disabled for writeback or soft deleted in Microsoft Entra ID. 
- Microsoft 365 groups with more than 50,000 members and Microsoft Entra security groups with more than 250,000 members can't be written back to on-premises. 

To keep the default behavior, continue to the [Enable Microsoft Entra Connect group writeback](how-to-connect-group-writeback-enable.md) article.  

You can modify the default behavior as follows: 

- Only groups that are configured for writeback will be written back, including newly created Microsoft 365 groups. 
- Groups that are written to on-premises will be deleted in Active Directory when they're disabled for group writeback, soft deleted, or hard deleted in Microsoft Entra ID. 
- Microsoft 365 groups with up to 250,000 members can be written back to on-premises. 

If you plan to make changes to the default behavior, we recommend that you do so before you enable group writeback. However, you can still modify the default behavior if group writeback is already enabled. For more information, see [Modify Microsoft Entra Connect group writeback default behavior](how-to-connect-modify-group-writeback.md). 

> [!NOTE]
> You need to make these changes before enabling group writeback; otherwise, all existing Microsoft 365 groups will be automatically written back to Active Directory. Also, the new and original versions of the feature need to be enabled in the order documented. If the original feature is enabled first, all existing Microsoft 365 groups will be written back to Active Directory.

## Understand limitations of public preview  

Although this release has undergone extensive testing, you might still encounter issues. One of the goals of this public preview release is to find and fix any issues before the feature moves to general availability. Please also note that any public preview functionality can still receive breaking changes which may require you to make changes to you configuration to continue using this feature. We may also decide to change or remove certain functionality without prior notice.
Microsoft provides support for this public preview release, but we might not be able to immediately fix issues that you encounter. For these reasons, we recommend that you do not deploy this release in your production environment. 

These limitations and known issues are specific to group writeback: 

- Cloud [distribution list groups](/exchange/recipients-in-exchange-online/manage-distribution-groups/manage-distribution-groups) created in Exchange Online cannot be written back to AD, only Microsoft 365 and Microsoft Entra security groups are supported. 
- To be backwards compatible with the current version of group writeback, when you enable group writeback, all existing Microsoft 365 groups are written back and created as distribution groups, by default. 
- When you disable writeback for a group, the group won't automatically be removed from your on-premises Active Directory, until hard deleted in Microsoft Entra ID. This behavior can be modified by following the steps detailed in [Modifying group writeback](how-to-connect-modify-group-writeback.md) 
- Group Writeback does not support writeback of nested group members that have a scope of ‘Domain local’ in AD, since Microsoft Entra security groups are written back with scope ‘Universal’. If you have a nested group like this, you'll see an export error in Microsoft Entra Connect with the message “A universal group cannot have a local group as a member.”  The resolution is to remove the member with scope ‘Domain local’ from the Microsoft Entra group or update the nested group member scope in AD to ‘Global’ or ‘Universal’ group. 
- Nested cloud groups that are members of writeback enabled groups must also be enabled for writeback to remain nested in AD. 
- Group Writeback setting to manage new security group writeback at scale is not yet available. You will need to configure writeback for each group.  
- Group Writeback only supports writing back groups to a single Organization Unit (OU).

## Next steps 

- [Modify Microsoft Entra Connect group writeback default behavior](how-to-connect-modify-group-writeback.md) 
- [Enable Microsoft Entra Connect group writeback](how-to-connect-group-writeback-enable.md)
- [Disable Microsoft Entra Connect group writeback](how-to-connect-group-writeback-disable.md)
