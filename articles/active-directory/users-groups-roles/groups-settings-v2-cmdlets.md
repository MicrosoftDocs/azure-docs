---
title: PowerShell V2 examples for managing groups - Azure AD  | Microsoft Docs
description: This page provides PowerShell examples to help you manage your groups in Azure Active Directory
keywords: Azure AD, Azure Active Directory, PowerShell, Groups, Group management
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: how-to
ms.date: 11/08/2019
ms.author: curtand
ms.reviewer: krbain
ms.custom: it-pro
ms.collection: M365-identity-device-management
---
# Azure Active Directory version 2 cmdlets for group management

> [!div class="op_single_selector"]
> - [Azure portal](../fundamentals/active-directory-groups-create-azure-portal.md?context=azure/active-directory/users-groups-roles/context/ugr-context)
> - [PowerShell](groups-settings-v2-cmdlets.md)
>
>

This article contains examples of how to use PowerShell to manage your groups in Azure Active Directory (Azure AD).  It also tells you how to get set up with the Azure AD PowerShell module. First, you must [download the Azure AD PowerShell module](https://www.powershellgallery.com/packages/AzureAD/).

## Install the Azure AD PowerShell module

To install the Azure AD PowerShell module, use the following commands:

```powershell
    PS C:\Windows\system32> install-module azuread
    PS C:\Windows\system32> import-module azuread
```

To verify that the module is ready to use, use the following command:

```powershell
    PS C:\Windows\system32> get-module azuread

    ModuleType Version      Name                                ExportedCommands
    ---------- ---------    ----                                ----------------
    Binary     2.0.0.115    azuread                      {Add-AzureADAdministrati...}
```

Now you can start using the cmdlets in the module. For a full description of the cmdlets in the Azure AD module, please refer to the online reference documentation for [Azure Active Directory PowerShell Version 2](/powershell/azure/install-adv2?view=azureadps-2.0).

> [!NOTE]
> The Azure AD PowerShell cmdlets does not work with the new Powershell 7 as it is based on .net Core. We are aware and this is in the process of getting updated. As of now we suggest to use the Windows Powershell 5.x Module to be used for Azure AD powershell operations. 


## Connect to the directory

Before you can start managing groups using Azure AD PowerShell cmdlets, you must connect your PowerShell session to the directory you want to manage. Use the following command:

```powershell
    PS C:\Windows\system32> Connect-AzureAD
```

The cmdlet prompts you for the credentials you want to use to access your directory. In this example, we are using karen@drumkit.onmicrosoft.com to access the demonstration directory. The cmdlet returns a confirmation to show the session was connected successfully to your directory:

```powershell
    Account                       Environment Tenant ID
    -------                       ----------- ---------
    Karen@drumkit.onmicrosoft.com AzureCloud  85b5ff1e-0402-400c-9e3c-0f…
```

Now you can start using the AzureAD cmdlets to manage groups in your directory.

## Retrieve groups

To retrieve existing groups from your directory, use the Get-AzureADGroups cmdlet. 

To retrieve all groups in the directory, use the cmdlet without parameters:

```powershell
    PS C:\Windows\system32> get-azureadgroup
```

The cmdlet returns all groups in the connected directory.

You can use the -objectID parameter to retrieve a specific group for which you specify the group’s objectID:

```powershell
    PS C:\Windows\system32> get-azureadgroup -ObjectId e29bae11-4ac0-450c-bc37-6dae8f3da61b
```

The cmdlet now returns the group whose objectID matches the value of the parameter you entered:

```powershell
    DeletionTimeStamp            :
    ObjectId                     : e29bae11-4ac0-450c-bc37-6dae8f3da61b
    ObjectType                   : Group
    Description                  :
    DirSyncEnabled               :
    DisplayName                  : Pacific NW Support
    LastDirSyncTime              :
    Mail                         :
    MailEnabled                  : False
    MailNickName                 : 9bb4139b-60a1-434a-8c0d-7c1f8eee2df9
    OnPremisesSecurityIdentifier :
    ProvisioningErrors           : {}
    ProxyAddresses               : {}
    SecurityEnabled              : True
```

You can search for a specific group using the -filter parameter. This parameter takes an ODATA filter clause and returns all groups that match the filter, as in the following example:

```powershell
    PS C:\Windows\system32> Get-AzureADGroup -Filter "DisplayName eq 'Intune Administrators'"


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
> The Azure AD PowerShell cmdlets implement the OData query standard. For more information, see **$filter** in [OData system query options using the OData endpoint](https://msdn.microsoft.com/library/gg309461.aspx#BKMK_filter).

## Create groups

To create a new group in your directory, use the New-AzureADGroup cmdlet. This cmdlet creates a new security group called “Marketing":

```powershell
    PS C:\Windows\system32> New-AzureADGroup -Description "Marketing" -DisplayName "Marketing" -MailEnabled $false -SecurityEnabled $true -MailNickName "Marketing"
```

## Update groups

To update an existing group, use the Set-AzureADGroup cmdlet. In this example, we’re changing the DisplayName property of the group “Intune Administrators.” First, we’re finding the group using the Get-AzureADGroup cmdlet and filter using the DisplayName attribute:

```powershell
    PS C:\Windows\system32> Get-AzureADGroup -Filter "DisplayName eq 'Intune Administrators'"


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
    PS C:\Windows\system32> Set-AzureADGroup -ObjectId 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df -Description "Intune Device Administrators"
```

Now, if we find the group again, we see the Description property is updated to reflect the new value:

```powershell
    PS C:\Windows\system32> Get-AzureADGroup -Filter "DisplayName eq 'Intune Administrators'"

    DeletionTimeStamp            :
    ObjectId                     : 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df
    ObjectType                   : Group
    Description                  : Intune Device Administrators
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

## Delete groups

To delete groups from your directory, use the Remove-AzureADGroup cmdlet as follows:

```powershell
    PS C:\Windows\system32> Remove-AzureADGroup -ObjectId b11ca53e-07cc-455d-9a89-1fe3ab24566b
```

## Manage group membership

### Add members

To add new members to a group, use the Add-AzureADGroupMember cmdlet. This command adds a member to the Intune Administrators group we used in the previous example:

```powershell
    PS C:\Windows\system32> Add-AzureADGroupMember -ObjectId 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df -RefObjectId 72cd4bbd-2594-40a2-935c-016f3cfeeeea
```

The -ObjectId parameter is the ObjectID of the group to which we want to add a member, and the -RefObjectId is the ObjectID of the user we want to add as a member to the group.

### Get members

To get the existing members of a group, use the Get-AzureADGroupMember cmdlet, as in this example:

```powershell
    PS C:\Windows\system32> Get-AzureADGroupMember -ObjectId 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df

    DeletionTimeStamp ObjectId                             ObjectType
    ----------------- --------                             ----------
                          72cd4bbd-2594-40a2-935c-016f3cfeeeea User
                          8120cc36-64b4-4080-a9e8-23aa98e8b34f User
```

### Remove members

To remove the member we previously added to the group, use the Remove-AzureADGroupMember cmdlet, as is shown here:

```powershell
    PS C:\Windows\system32> Remove-AzureADGroupMember -ObjectId 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df -MemberId 72cd4bbd-2594-40a2-935c-016f3cfeeeea
```

### Verify members

To verify the group memberships of a user, use the Select-AzureADGroupIdsUserIsMemberOf cmdlet. This cmdlet takes as its parameters the ObjectId of the user for which to check the group memberships, and a list of groups for which to check the memberships. The list of groups must be provided in the form of a complex variable of type “Microsoft.Open.AzureAD.Model.GroupIdsForMembershipCheck”, so we first must create a variable with that type:

```powershell
    PS C:\Windows\system32> $g = new-object Microsoft.Open.AzureAD.Model.GroupIdsForMembershipCheck
```

Next, we provide values for the groupIds to check in the attribute “GroupIds” of this complex variable:

```powershell
    PS C:\Windows\system32> $g.GroupIds = "b11ca53e-07cc-455d-9a89-1fe3ab24566b", "31f1ff6c-d48c-4f8a-b2e1-abca7fd399df"
```

Now, if we want to check the group memberships of a user with ObjectID 72cd4bbd-2594-40a2-935c-016f3cfeeeea against the groups in $g, we should use:

```powershell
    PS C:\Windows\system32> Select-AzureADGroupIdsUserIsMemberOf -ObjectId 72cd4bbd-2594-40a2-935c-016f3cfeeeea -GroupIdsForMembershipCheck $g

    OdataMetadata                                                                                                 Value
    -------------                                                                                                  -----
    https://graph.windows.net/85b5ff1e-0402-400c-9e3c-0f9e965325d1/$metadata#Collection(Edm.String)             {31f1ff6c-d48c-4f8a-b2e1-abca7fd399df}
```

The value returned is a list of groups of which this user is a member. You can also apply this method to check Contacts, Groups or Service Principals membership for a given list of groups, using Select-AzureADGroupIdsContactIsMemberOf, Select-AzureADGroupIdsGroupIsMemberOf or Select-AzureADGroupIdsServicePrincipalIsMemberOf

## Disable group creation by your users

You can prevent non-admin users from creating security groups. The default behavior in Microsoft Online Directory Services (MSODS) is to allow non-admin users to create groups, whether or not self-service group management (SSGM) is also enabled. The SSGM setting  controls behavior only in the My Apps access panel.

To disable group creation for non-admin users:

1. Verify that non-admin users are allowed to create groups:
   
   ```powershell
   PS C:\> Get-MsolCompanyInformation | fl UsersPermissionToCreateGroupsEnabled
   ```
  
2. If it returns `UsersPermissionToCreateGroupsEnabled : True`, then non-admin users can create groups. To disable this feature:
  
   ```powershell 
   Set-MsolCompanySettings -UsersPermissionToCreateGroupsEnabled $False
   ```
  
## Manage owners of groups

To add owners to a group, use the Add-AzureADGroupOwner cmdlet:

```powershell
    PS C:\Windows\system32> Add-AzureADGroupOwner -ObjectId 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df -RefObjectId 72cd4bbd-2594-40a2-935c-016f3cfeeeea
```

The -ObjectId parameter is the ObjectID of the group to which we want to add an owner, and the -RefObjectId is the ObjectID of the user or service principal we want to add as an owner of the group.

To retrieve the owners of a group, use the Get-AzureADGroupOwner cmdlet:

```powershell
    PS C:\Windows\system32> Get-AzureADGroupOwner -ObjectId 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df
```

The cmdlet returns the list of owners (users and service principals) for the specified group:

```powershell
    DeletionTimeStamp ObjectId                             ObjectType
    ----------------- --------                             ----------
                          e831b3fd-77c9-49c7-9fca-de43e109ef67 User
```

If you want to remove an owner from a group, use the Remove-AzureADGroupOwner cmdlet:

```powershell
    PS C:\Windows\system32> remove-AzureADGroupOwner -ObjectId 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df -OwnerId e831b3fd-77c9-49c7-9fca-de43e109ef67
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

Today, many groups are still managed in on-premises Active Directory. To answer requests to sync cloud groups back to on-premises, Office 365 groups writeback feature for Azure AD is now available for preview.

Office 365 groups are created and managed in the cloud. The writeback capability allows you to write back Office 365 groups as distribution groups to an Active Directory forest with Exchange installed. Users with on-premises Exchange mailboxes can then send and receive emails from these groups. The group writeback feature doesn't support Azure AD security groups or distribution groups.

For more details, please refer to documentation for the [Azure AD Connect sync service](../hybrid/how-to-connect-syncservice-features.md).

Office 365 group writeback is a public preview feature of Azure Active Directory (Azure AD) and is available with any paid Azure AD license plan. For some legal information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Next steps

You can find more Azure Active Directory PowerShell documentation at [Azure Active Directory Cmdlets](/powershell/azure/install-adv2?view=azureadps-2.0).

* [Managing access to resources with Azure Active Directory groups](../fundamentals/active-directory-manage-groups.md?context=azure/active-directory/users-groups-roles/context/ugr-context)
* [Integrating your on-premises identities with Azure Active Directory](../hybrid/whatis-hybrid-identity.md?context=azure/active-directory/users-groups-roles/context/ugr-context)
