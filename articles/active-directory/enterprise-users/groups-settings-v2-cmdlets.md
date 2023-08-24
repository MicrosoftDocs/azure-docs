---
title: PowerShell V2 examples for managing groups 
description: This page provides PowerShell examples to help you manage your groups in Azure Active Directory
keywords: Azure AD, Azure Active Directory, PowerShell, Groups, Group management
services: active-directory
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: enterprise-users
ms.topic: how-to
ms.date: 06/24/2022
ms.author: barclayn
ms.reviewer: krbain
ms.custom: it-pro
ms.collection: M365-identity-device-management
---
# Azure Active Directory version 2 cmdlets for group management

> [!div class="op_single_selector"]
> - [Azure portal](../fundamentals/active-directory-groups-create-azure-portal.md?context=azure/active-directory/users-groups-roles/context/ugr-context)
> - [PowerShell](../enterprise-users/groups-settings-v2-cmdlets.md)
>
>

This article contains examples of how to use PowerShell to manage your groups in Azure Active Directory (Azure AD), part of Microsoft Entra.  It also tells you how to get set up with the Microsoft Graph PowerShell module. First, you must [download the Microsoft Graph PowerShell module](/powershell/microsoftgraph/installation?view=graph-powershell-1.0&preserve-view=true).

## Install the Microsoft Graph PowerShell module

To install the MgGroup PowerShell module, use the following commands:

```powershell
    PS C:\Windows\system32> Install-module Microsoft.Graph
```

To verify that the module is ready to use, use the following command:

```powershell
PS C:\Windows\system32> Get-Module -Name "*graph*"

ModuleType Version    PreRelease Name                                ExportedCommands
---------- -------    ---------- ----                                ----------------
Script     1.27.0                Microsoft.Graph.Authentication      {Add-MgEnvironment, Connect-MgGraph, Disconnect-MgGraph, Get-MgContext…}
Script     1.27.0                Microsoft.Graph.Groups              {Add-MgGroupDriveListContentTypeCopy, Add-MgGroupDriveListContentTypeCopyF…
```

Now you can start using the cmdlets in the module. For a full description of the cmdlets in the Microsoft Graph module, refer to the online reference documentation for [Microsoft Graph PowerShell](/powershell/microsoftgraph/installation?view=graph-powershell-1.0&preserve-view=true).



## Connect to the directory

Before you can start managing groups using Microsoft Graph PowerShell cmdlets, you must connect your PowerShell session to the directory you want to manage. Use the following command:

```powershell
    PS C:\Windows\system32> Connect-MgGraph -Scopes "Group.ReadWrite.All"
```

The cmdlet prompts you for the credentials you want to use to access your directory. In this example, we're using karen@drumkit.onmicrosoft.com to access the demonstration directory. The cmdlet returns a confirmation to show the session was connected successfully to your directory:

```powershell
    Welcome To Microsoft Graph!
```

Now you can start using the MgGraph cmdlets to manage groups in your directory.

## Retrieve groups

To retrieve existing groups from your directory, use the Get-MgGroups cmdlet. 

To retrieve all groups in the directory, use the cmdlet without parameters:

```powershell
    PS C:\Windows\system32> Get-MgGroup -All
```

The cmdlet returns all groups in the connected directory.

You can use the -GroupId parameter to retrieve a specific group for which you specify the group’s objectID:

```powershell
    PS C:\Windows\system32> Get-MgGroup -GroupId 5e3eba05-6c2b-4555-9909-c08e997aab18 | fl
```

The cmdlet now returns the group whose objectID matches the value of the parameter you entered:

```powershell
AcceptedSenders               :
AllowExternalSenders          :
AppRoleAssignments            :
AssignedLabels                :
AssignedLicenses              :
AutoSubscribeNewMembers       :
Calendar                      : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCalendar
CalendarView                  :
Classification                :
Conversations                 :
CreatedDateTime               : 14-07-2023 14:25:49
CreatedOnBehalfOf             : Microsoft.Graph.PowerShell.Models.MicrosoftGraphDirectoryObject
DeletedDateTime               :
Description                   : Sales and Marketing
DisplayName                   : Sales and Marketing
Id                            : f76cbbb8-0581-4e01-a0d4-133d3ce9197f
IsArchived                    :
IsAssignableToRole            :
IsSubscribedByMail            :
LicenseProcessingState        : Microsoft.Graph.PowerShell.Models.MicrosoftGraphLicenseProcessingState
Mail                          : SalesAndMarketing@M365x64647001.onmicrosoft.com
MailEnabled                   : True
MailNickname                  : SalesAndMarketing
RejectedSenders               :
RenewedDateTime               : 14-07-2023 14:25:49
SecurityEnabled               : True
```

You can search for a specific group using the -filter parameter. This parameter takes an ODATA filter clause and returns all groups that match the filter, as in the following example:

```powershell
    PS C:\Windows\system32> Get-MgGroup -Filter "DisplayName eq 'Intune Administrators'"


    DeletionTimeStamp            :
    ObjectId                     : 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df
    ObjectType                   : Group
    Description                  : Intune Administrators
    DirSyncEnabled               :
    DisplayName                  : Intune Administrators
    LastDirSyncTime              :
    Mail                         :
    MailEnabled                  : False
    MailNickName                 : 4dd067a0-6515-4f23-968a-cc2ffc2eff5c
    OnPremisesSecurityIdentifier :
    ProvisioningErrors           : {}
    ProxyAddresses               : {}
    SecurityEnabled              : True
```

> [!NOTE]
> The MgGroup PowerShell cmdlets implement the OData query standard. For more information, see **$filter** in [OData system query options using the OData endpoint](/previous-versions/dynamicscrm-2015/developers-guide/gg309461(v=crm.7)#BKMK_filter).

## Create groups

To create a new group in your directory, use the New-MgGroup cmdlet. This cmdlet creates a new security group called “Marketing":

```powershell
$param = @{
 description="My Demo Group"
 displayName="DemoGroup"
 mailEnabled=$false
 securityEnabled=$true
 mailNickname="Demo"
}

New-MgGroup -BodyParameter $param
```

## Update groups

To update an existing group, use the Update-MgGroup cmdlet. In this example, we’re changing the DisplayName property of the group “Intune Administrators.” First, we’re finding the group using the Get-MgGroup cmdlet and filter using the DisplayName attribute:

```powershell
    PS C:\Windows\system32> Get-MgGroup -Filter "DisplayName eq 'Intune Administrators'"


    DeletionTimeStamp            :
    ObjectId                     : 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df
    ObjectType                   : Group
    Description                  : Intune Administrators
    DirSyncEnabled               :
    DisplayName                  : Intune Administrators
    LastDirSyncTime              :
    Mail                         :
    MailEnabled                  : False
    MailNickName                 : 4dd067a0-6515-4f23-968a-cc2ffc2eff5c
    OnPremisesSecurityIdentifier :
    ProvisioningErrors           : {}
    ProxyAddresses               : {}
    SecurityEnabled              : True
```

Next, we’re changing the Description property to the new value “Intune Device Administrators”:

```powershell
    PS C:\Windows\system32> Update-MgGroup -GroupId 958d212c-14b0-43d0-a052-d0c2bb555b8b -Description "Demo Group Updated"
```

Now, if we find the group again, we see the Description property is updated to reflect the new value:

```powershell
    PS C:\Windows\system32> Get-MgGroup -GroupId 958d212c-14b0-43d0-a052-d0c2bb555b8b | select displayname, description

    DisplayName Description
    ----------- -----------
    DemoGroup   Demo Group Updated
```

## Delete groups

To delete groups from your directory, use the Remove-MgGroup cmdlet as follows:

```powershell
    PS C:\Windows\system32> Remove-MgGroup -GroupId 958d212c-14b0-43d0-a052-d0c2bb555b8b
```

## Manage group membership

### Add members

To add new members to a group, use the Add-MgGroupMember cmdlet. This command adds a member to the Intune Administrators group we used in the previous example:

```powershell
    PS C:\Windows\system32> New-MgGroupMember -GroupId f76cbbb8-0581-4e01-a0d4-133d3ce9197f -DirectoryObjectId a88762b7-ce17-40e9-b417-0add1848eb68
```

The -GroupId parameter is the ObjectID of the group to which we want to add a member, and the -DirectoryObjectId is the ObjectID of the user we want to add as a member to the group.

### Get members

To get the existing members of a group, use the Get-MgGroupMember cmdlet, as in this example:

```powershell
    PS C:\Windows\system32> Get-MgGroupMember -GroupId 2c52c779-8587-48c5-9d4a-c474f2a66cf4

Id                                   DeletedDateTime
--                                   ---------------
71b3857d-2a23-416d-bd22-a471854ddada
fd2d57c7-22ad-42cd-961a-7340fb2eb6b4
```

### Remove members

To remove the member we previously added to the group, use the Remove-MgGroupMember cmdlet, as is shown here:

```powershell
    PS C:\Windows\system32> Remove-MgGroupMemberByRef -DirectoryObjectId 053a6a7e-4a75-48bc-8324-d70f50ec0d91 -GroupId 2c52c779-8587-48c5-9d4a-c474f2a66cf4
```

### Verify members

To verify the group memberships of a user, use the Select-MgGroupIdsUserIsMemberOf cmdlet. This cmdlet takes as its parameters the ObjectId of the user for which to check the group memberships, and a list of groups for which to check the memberships. The list of groups must be provided in the form of a complex variable of type “Microsoft.Open.AzureAD.Model.GroupIdsForMembershipCheck”, so we first must create a variable with that type:

```powershell
Get-MgUserMemberOf -UserId 053a6a7e-4a75-48bc-8324-d70f50ec0d91

Id                                   DisplayName Description GroupTypes AccessType
--                                   ----------- ----------- ---------- ----------
5dc16449-3420-4ad5-9634-49cd04eceba0 demogroup   demogroup    {Unified}
```

The value returned is a list of groups of which this user is a member. You can also apply this method to check Contacts, Groups or Service Principals membership for a given list of groups, using Select-MgGroupIdsContactIsMemberOf, Select-MgGroupIdsGroupIsMemberOf or Select-MgGroupIdsServicePrincipalIsMemberOf

## Disable group creation by your users

You can prevent non-admin users from creating security groups. The default behavior in Microsoft Online Directory Services (MSODS) is to allow non-admin users to create groups, whether or not self-service group management (SSGM) is also enabled. The SSGM setting  controls behavior only in the My Apps access panel.

To disable group creation for non-admin users:

1. Verify that non-admin users are allowed to create groups:
   
   ```powershell
   PS C:\> Get-MgBetaDirectorySetting | select -ExpandProperty values

    Name                            Value
    ----                            -----
    NewUnifiedGroupWritebackDefault true
    EnableMIPLabels                 false
    CustomBlockedWordsList
    EnableMSStandardBlockedWords    false
    ClassificationDescriptions
    DefaultClassification
    PrefixSuffixNamingRequirement
    AllowGuestsToBeGroupOwner       false
    AllowGuestsToAccessGroups       true
    GuestUsageGuidelinesUrl
    GroupCreationAllowedGroupId
    AllowToAddGuests                true
    UsageGuidelinesUrl
    ClassificationList
    EnableGroupCreation             true
   ```
  
2. If it returns `EnableGroupCreation : True`, then non-admin users can create groups. To disable this feature:
  
   ```powershell
    Install-Module Microsoft.Graph.Beta.Identity.DirectoryManagement
    Import-Module Microsoft.Graph.Beta.Identity.DirectoryManagement
    $params = @{
	TemplateId = "62375ab9-6b52-47ed-826b-58e47e0e304b"
	Values = @(		
		@{
			Name = "EnableGroupCreation"
			Value = "false"
		}		
	)
    }
    Connect-MgGraph -Scopes "Directory.ReadWrite.All"
    New-MgBetaDirectorySetting -BodyParameter $params
    
   ```
  
## Manage owners of groups

To add owners to a group, use the New-MgGroupOwner cmdlet:

```powershell
    PS C:\Windows\system32> New-MgGroupOwner -GroupId 0e48dc96-3bff-4fe1-8939-4cd680163497 -DirectoryObjectId 92a0dad0-7c9e-472f-b2a3-0fe2c9a02867
```

The -GroupId parameter is the ObjectID of the group to which we want to add an owner, and the -DirectoryObjectId is the ObjectID of the user or service principal we want to add as an owner.

To retrieve the owners of a group, use the Get-MgGroupOwner cmdlet:

```powershell
    PS C:\Windows\system32> Get-MgGroupOwner -GroupId 0e48dc96-3bff-4fe1-8939-4cd680163497
```

The cmdlet returns the list of owners (users and service principals) for the specified group:

```powershell
    Id                                       DeletedDateTime
    --                                       ---------------
    8ee754e0-743e-4231-ace4-c28d20cf2841
    85b1df54-e5c0-4cfd-a20b-8bc1a2ca7865
    4451b332-2294-4dcf-a214-6cc805016c50
```

If you want to remove an owner from a group, use the Remove-MgGroupOwnerByRef  cmdlet:

```powershell
    PS C:\Windows\system32> Remove-MgGroupOwnerByRef -GroupId 0e48dc96-3bff-4fe1-8939-4cd680163497 -DirectoryObjectId 92a0dad0-7c9e-472f-b2a3-0fe2c9a02867
```

## Reserved aliases

When a group is created, certain endpoints allow the end user to specify a mailNickname or alias to be used as part of the email address of the group. Groups with the following highly privileged email aliases can only be created by an Azure AD global administrator. 
  
* abuse
* admin
* administrator
* hostmaster
* majordomo
* postmaster
* root
* secure
* security
* ssl-admin
* webmaster

## Group writeback to on-premises (preview)

Today, many groups are still managed in on-premises Active Directory. To answer requests to sync cloud groups back to on-premises, Microsoft 365 groups writeback feature for Azure AD is now available for preview.

Microsoft 365 groups are created and managed in the cloud. The writeback capability allows you to write back Microsoft 365 groups as distribution groups to an Active Directory forest with Exchange installed. Users with on-premises Exchange mailboxes can then send and receive emails from these groups. The group writeback feature doesn't support Azure AD security groups or distribution groups.

For more details, please refer to documentation for the [Azure AD Connect sync service](../hybrid/how-to-connect-syncservice-features.md).

Microsoft 365 group writeback is a public preview feature of Azure Active Directory (Azure AD) and is available with any paid Azure AD license plan. For some legal information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Next steps

You can find more Azure Active Directory PowerShell documentation at [Azure Active Directory Cmdlets](/powershell/azure/active-directory/install-adv2).

* [Managing access to resources with Azure Active Directory groups](../fundamentals/active-directory-manage-groups.md?context=azure/active-directory/users-groups-roles/context/ugr-context)
* [Integrating your on-premises identities with Azure Active Directory](../hybrid/whatis-hybrid-identity.md?context=azure/active-directory/users-groups-roles/context/ugr-context)
