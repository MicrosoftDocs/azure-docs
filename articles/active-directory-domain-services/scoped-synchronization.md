---
title: 'Azure Active Directory Domain Services: Scoped synchronization | Microsoft Docs'
description: Configure scoped synchronization from Azure AD to your managed domains
services: active-directory-ds
documentationcenter: ''
author: iainfoulds
manager: daveba
editor: curtand

ms.assetid: 9389cf0f-0036-4b17-95da-80838edd2225
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/20/2019
ms.author: iainfou

---
# Configure scoped synchronization from Azure AD to your managed domain
This article shows you how to configure only specific user accounts to be synchronized from your Azure AD directory to your Azure AD Domain Services managed domain.


## Group-based scoped synchronization
By default, all users and groups within your Azure AD directory are synchronized to your managed domain. If only a few users use the managed domain, you may synchronize only those user accounts. Group-based scoped synchronization enables you to do so. When configured, only user accounts belonging to the groups you've specified are synchronized to the managed domain.

The following table helps you determine how to use scoped synchronization:

| **Current state** | **Desired state** | **Required configuration** |
| --- | --- | --- |
| Your existing managed domain is configured to synchronize all user accounts and groups. | You want to synchronize only user accounts belonging to specific groups to your managed domain. | [Delete the existing managed domain](delete-aadds.md). Then, follow instructions in this article to re-create it with scoped synchronization configured. |
| You don't have an existing managed domain. | You want to create a new managed domain and synchronize only user accounts belonging to specific groups. | Follow instructions in this article to create a new managed domain with scoped synchronization configured. |
| Your existing managed domain is configured to synchronize only accounts belonging to specific groups. | You want to modify the list of groups whose users should be synchronized to the manage domain. | Follow the instructions in this article to modify scoped synchronization. |

> [!WARNING]
> **Changing the scope of synchronization causes your managed domain to go through resynchronization.**
> 
>  * When you change the synchronization scope for a managed domain, a full resynchronization occurs.
>  * Objects which are no longer required in the managed domain are deleted. New objects are created in the managed domain.
>  * Resynchronization may take a long time to complete, depending on the number of objects (users, groups, and group memberships) in your managed domain and your Azure AD directory. For large directories with many hundreds of thousands of objects, resynchronization may take a few days.


## Create a new managed domain and enable group-based scoped synchronization using Azure portal

1. Follow the [Getting Started guide](create-instance.md) to create a managed domain.
2. Choose **scoped** during the synchronization style selection in the Azure AD Domain Services creation wizard.

## Create a new managed domain and enable group-based scoped synchronization using PowerShell
Use PowerShell to complete this set of steps. Refer to the instructions to [enable Azure Active Directory Domain Services using PowerShell](powershell-create-instance.md). A couple of steps in this article are modified slightly to configure scoped synchronization.

Complete the following steps to configure group-based scoped synchronization to your managed domain:

1. Complete the following tasks:
   * [Task 1: Install the required PowerShell modules](powershell-create-instance.md#task-1-install-the-required-powershell-modules).
   * [Task 2: Create the required service principal in your Azure AD directory](powershell-create-instance.md#task-2-create-the-required-service-principal-in-your-azure-ad-directory).
   * [Task 3: Create and configure the 'AAD DC Administrators' group]powershell-create-instance.md#task-3-create-and-configure-the-aad-dc-administrators-group).
   * [Task 4: Register the Azure AD Domain Services resource provider](powershell-create-instance.md#task-4-register-the-azure-ad-domain-services-resource-provider).
   * [Task 5: Create a resource group](powershell-create-instance.md#task-5-create-a-resource-group).
   * [Task 6: Create and configure the virtual network](powershell-create-instance.md#task-6-create-and-configure-the-virtual-network).

2. Select the groups you want to sync and provide the display name of the groups you want synchronized to your managed domain.

3. Save the [script in the following section](scoped-synchronization.md#script-to-select-groups-to-synchronize-to-the-managed-domain-select-groupstosyncps1) to a file called ```Select-GroupsToSync.ps1```. Execute the script like below:

   ```powershell
   .\Select-GroupsToSync.ps1 -groupsToAdd @("AAD DC Administrators", "GroupName1", "GroupName2")
   ```

   > [!WARNING]
   > **Do not forget to include the 'AAD DC Administrators' group.**
   >
   > You must include the 'AAD DC Administrators' group in the list of groups configured for scoped synchronization. If you do not include this group, the managed domain will be unusable.
   >

4. Now, create the managed domain and enable group-based scoped synchronization for the managed domain. Include the property ```"filteredSync" = "Enabled"``` in the ```Properties``` parameter. For instance, see the following script fragment, copied from [Task 7: Provision the Azure AD Domain Services managed domain](powershell-create-instance.md#task-7-provision-the-azure-ad-domain-services-managed-domain).

   ```powershell
   $AzureSubscriptionId = "YOUR_AZURE_SUBSCRIPTION_ID"
   $ManagedDomainName = "contoso100.com"
   $ResourceGroupName = "ContosoAaddsRg"
   $VnetName = "DomainServicesVNet_WUS"
   $AzureLocation = "westus"

   # Enable Azure AD Domain Services for the directory.
   New-AzResource -ResourceId "/subscriptions/$AzureSubscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.AAD/DomainServices/$ManagedDomainName" `
   -Location $AzureLocation `
   -Properties @{"DomainName"=$ManagedDomainName; "filteredSync" = "Enabled"; `
    "SubnetId"="/subscriptions/$AzureSubscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.Network/virtualNetworks/$VnetName/subnets/DomainServices"} `
   -ApiVersion 2017-06-01 -Force -Verbose
   ```

   > [!TIP]
   > Do not forget to include ```"filteredSync" = "Enabled"``` in the ```-Properties``` parameter, so scoped synchronization is enabled for the managed domain.


## Script to select groups to synchronize to the managed domain (Select-GroupsToSync.ps1)
Save the following script to a file (```Select-GroupsToSync.ps1```). This script configures Azure AD Domain Services to synchronize selected groups to the managed domain. All user accounts belonging to the specified groups will be synchronized to the managed domain.

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

$currentAssignments = Get-AzureADServiceAppRoleAssignment -ObjectId $sp.ObjectId
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


## Modify group-based scoped synchronization
To modify the list of groups whose users should be synchronized to your managed domain, re-run the [PowerShell script](scoped-synchronization.md#script-to-select-groups-to-synchronize-to-the-managed-domain-select-groupstosyncps1) and specify the new list of groups. Remember to always specify the 'AAD DC Administrators' group in this list.

> [!WARNING]
> **Do not forget to include the 'AAD DC Administrators' group.**
>
> You must include the 'AAD DC Administrators' group in the list of groups configured for scoped synchronization. If you do not include this group, the managed domain will be unusable.
>


## Disable group-based scoped synchronization
Use the following PowerShell script to disable group-based scoped synchronization for your managed domain:

```powershell
// Login to your Azure AD tenant
Login-AzAccount

// Retrieve the Azure AD Domain Services resource.
$DomainServicesResource = Get-AzResource -ResourceType "Microsoft.AAD/DomainServices"

// Disable group-based scoped synchronization.
$disableScopedSync = @{"filteredSync" = "Disabled"}

Set-AzResource -Id $DomainServicesResource.ResourceId -Properties $disableScopedSync
```

## Next steps
* [Understand synchronization in Azure AD Domain Services](synchronization.md)
* [Enable Azure Active Directory Domain Services using PowerShell](powershell-create-instance.md)
