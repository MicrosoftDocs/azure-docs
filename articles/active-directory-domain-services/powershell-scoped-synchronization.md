---
title: Scoped synchronization using PowerShell for Microsoft Entra Domain Services | Microsoft Docs
description: Learn how to use Azure AD PowerShell to configure scoped synchronization from Microsoft Entra ID to a Microsoft Entra Domain Services managed domain
services: active-directory-ds
author: justinha
manager: amycolannino

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 09/06/2023
ms.author: justinha 
ms.custom: has-azure-ad-ps-ref
---
# Configure scoped synchronization from Microsoft Entra ID to Microsoft Entra Domain Services using Azure AD PowerShell

To provide authentication services, Microsoft Entra Domain Services synchronizes users and groups from Microsoft Entra ID. In a hybrid environment, users and groups from an on-premises Active Directory Domain Services (AD DS) environment can be first synchronized to Microsoft Entra ID using Microsoft Entra Connect, and then synchronized to Domain Services.

By default, all users and groups from a Microsoft Entra directory are synchronized to a Domain Services managed domain. If you have specific needs, you can instead choose to synchronize only a defined set of users.

This article shows you how to create a managed domain that uses scoped synchronization and then change or disable the set of scoped users using Azure AD PowerShell. You can also [complete these steps using the Microsoft Entra admin center][scoped-sync].

## Before you begin

To complete this article, you need the following resources and privileges:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A Microsoft Entra tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create a Microsoft Entra tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* A Microsoft Entra Domain Services managed domain enabled and configured in your Microsoft Entra tenant.
    * If needed, complete the tutorial to [create and configure a Microsoft Entra Domain Services managed domain][tutorial-create-instance].
* You need [Application Administrator](/azure/active-directory/roles/permissions-reference#application-administrator) and [Groups Administrator](/azure/active-directory/roles/permissions-reference#groups-administrator) Microsoft Entra roles in your tenant to change the Domain Services synchronization scope.

## Scoped synchronization overview

By default, all users and groups from a Microsoft Entra directory are synchronized to a managed domain. If only a few users need to access the managed domain, you can synchronize only those user accounts. This scoped synchronization is group-based. When you configure group-based scoped synchronization, only the user accounts that belong to the groups you specify are synchronized to the managed domain. Nested groups aren't synchronized, only the specific groups you select.

You can change the synchronization scope before or after you create the managed domain. The scope of synchronization is defined by a service principal with the application identifier 2565bd9d-da50-47d4-8b85-4c97f669dc36. To prevent scope loss, don't delete or change the service principal. If it is accidentally deleted, the synchronization scope can't be recovered. 

Keep in mind the following caveats if you change the synchronization scope:

- A full synchronization occurs.
- Objects that are no longer required in the managed domain are deleted. New objects are created in the managed domain.

To learn more about the synchronization process, see [Understand synchronization in Microsoft Entra Domain Services][concepts-sync].

## PowerShell script for scoped synchronization

To configure scoped synchronization using PowerShell, first save the following script to a file named `Select-GroupsToSync.ps1`.

This script configures Domain Services to synchronize selected groups from Microsoft Entra ID. All user accounts that are part of the specified groups are synchronized to the managed domain.

This script is used in the additional steps in this article.

```powershell
param (
    [Parameter(Position = 0)]
    [String[]]$groupsToAdd
)

Connect-AzureAD
$sp = Get-AzureADServicePrincipal -Filter "AppId eq '2565bd9d-da50-47d4-8b85-4c97f669dc36'"
$role = $sp.AppRoles | where-object -FilterScript {$_.DisplayName -eq "User"}

Write-Output "`n****************************************************************************"

Write-Output "Total group-assignments need to be added: $($groupsToAdd.Count)"
$newGroupIds = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($groupName in $groupsToAdd)
{
    try
    {
        $group = Get-AzureADGroup -Filter "DisplayName eq '$groupName'"
        $newGroupIds.Add($group.ObjectId)

        Write-Output "Group-Name: $groupName, Id: $($group.ObjectId)"
    }
    catch
    {
        Write-Error "Failed to find group: $groupName. Exception: $($_.Exception)."
    }
}

Write-Output "****************************************************************************`n"
Write-Output "`n****************************************************************************"

$currentAssignments = Get-AzureADServiceAppRoleAssignment -ObjectId $sp.ObjectId -All $true
Write-Output "Total current group-assignments: $($currentAssignments.Count), SP-ObjectId: $($sp.ObjectId)"

$currAssignedObjectIds = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($assignment in $currentAssignments)
{
    Write-Output "Assignment-ObjectId: $($assignment.PrincipalId)"

    if ($newGroupIds.Contains($assignment.PrincipalId) -eq $false)
    {
        Write-Output "This assignment is not needed anymore. Removing it! Assignment-ObjectId: $($assignment.PrincipalId)"
        Remove-AzureADServiceAppRoleAssignment -ObjectId $sp.ObjectId -AppRoleAssignmentId $assignment.ObjectId
    }
    else
    {
        $currAssignedObjectIds.Add($assignment.PrincipalId)
    }
}

Write-Output "****************************************************************************`n"
Write-Output "`n****************************************************************************"

foreach ($id in $newGroupIds)
{
    try
    {
        if ($currAssignedObjectIds.Contains($id) -eq $false)
        {
            Write-Output "Adding new group-assignment. Role-Id: $($role.Id), Group-Object-Id: $id, ResourceId: $($sp.ObjectId)"
            New-AzureADGroupAppRoleAssignment -Id $role.Id -ObjectId $id -PrincipalId $id -ResourceId $sp.ObjectId
        }
        else
        {
            Write-Output "Group-ObjectId: $id is already assigned."
        }
    }
    catch
    {
        Write-Error "Exception occurred assigning Object-ID: $id. Exception: $($_.Exception)."
    }
}

Write-Output "****************************************************************************`n"
```

## Enable scoped synchronization

To enable group-based scoped synchronization for a managed domain, complete the following steps:

1. First set *"filteredSync" = "Enabled"* on the Domain Services resource, then update the managed domain.

    When prompted, specify the credentials for a *global admin* to sign in to your Microsoft Entra tenant using the [Connect-AzureAD][Connect-AzureAD] cmdlet:

    ```powershell
    # Connect to your Azure AD tenant
    Connect-AzureAD

    # Retrieve the Azure AD DS resource.
    $DomainServicesResource = Get-AzResource -ResourceType "Microsoft.AAD/DomainServices"

    # Enable group-based scoped synchronization.
    $enableScopedSync = @{"filteredSync" = "Enabled"}

    # Update the Azure AD DS resource
    Set-AzResource -Id $DomainServicesResource.ResourceId -Properties $enableScopedSync
    ```

1. Now specify the list of groups whose users should be synchronized to the managed domain.

    Run the `Select-GroupsToSync.ps1` script and specify the list of groups to sync. In the following example, the groups to synchronize are *GroupName1* and *GroupName2*.

    > [!WARNING]
    > You must include the *AAD DC Administrators* group in the list of groups for scoped synchronization. If you don't include this group, the managed domain is unusable.

    ```powershell
    .\Select-GroupsToSync.ps1 -groupsToAdd @("AAD DC Administrators", "GroupName1", "GroupName2")
    ```

Changing the scope of synchronization causes the managed domain to resynchronize all data. Objects that are no longer required in the managed domain are deleted, and resynchronization may take a long time to complete.

## Modify scoped synchronization

To modify the list of groups whose users should be synchronized to the managed domain, run `Select-GroupsToSync.ps1` script and specify the new list of groups to sync.

In the following example, the groups to synchronize no longer includes *GroupName2*, and now includes *GroupName3*.

> [!WARNING]
> You must include the *AAD DC Administrators* group in the list of groups for scoped synchronization. If you don't include this group, the managed domain is unusable.

When prompted, specify the credentials for a *global admin* to sign in to your Microsoft Entra tenant using the [Connect-AzureAD][Connect-AzureAD] cmdlet:

```powershell
.\Select-GroupsToSync.ps1 -groupsToAdd @("AAD DC Administrators", "GroupName1", "GroupName3")
```

Changing the scope of synchronization causes the managed domain to resynchronize all data. Objects that are no longer required in the managed domain are deleted, and resynchronization may take a long time to complete.

## Disable scoped synchronization

To disable group-based scoped synchronization for a managed domain, set *"filteredSync" = "Disabled"* on the Domain Services resource, then update the managed domain. When complete, all users and groups are set to synchronize from Microsoft Entra ID.

When prompted, specify the credentials for a *global admin* to sign in to your Microsoft Entra tenant using the [Connect-AzureAD][Connect-AzureAD] cmdlet:

```powershell
# Connect to your Azure AD tenant
Connect-AzureAD

# Retrieve the Azure AD DS resource.
$DomainServicesResource = Get-AzResource -ResourceType "Microsoft.AAD/DomainServices"

# Disable group-based scoped synchronization.
$disableScopedSync = @{"filteredSync" = "Disabled"}

# Update the Azure AD DS resource
Set-AzResource -Id $DomainServicesResource.ResourceId -Properties $disableScopedSync
```

Changing the scope of synchronization causes the managed domain to resynchronize all data. Objects that are no longer required in the managed domain are deleted, and resynchronization may take a long time to complete.

## Next steps

To learn more about the synchronization process, see [Understand synchronization in Microsoft Entra Domain Services](synchronization.md).

<!-- INTERNAL LINKS -->
[scoped-sync]: scoped-synchronization.md
[concepts-sync]: synchronization.md
[tutorial-create-instance]: tutorial-create-instance.md
[create-azure-ad-tenant]: /azure/active-directory/fundamentals/sign-up-organization
[associate-azure-ad-tenant]: /azure/active-directory/fundamentals/how-subscriptions-associated-directory

<!-- EXTERNAL LINKS -->
[Connect-AzureAD]: /powershell/module/azuread/connect-azuread
