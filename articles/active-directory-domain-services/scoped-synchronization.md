---
title: Scoped synchronization for Azure AD Domain Services | Microsoft Docs
description: Learn how to configure scoped synchronization from Azure AD to an Azure Active Directory Domain Services managed domain
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: 9389cf0f-0036-4b17-95da-80838edd2225
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 03/31/2020
ms.author: iainfou

---
# Configure scoped synchronization from Azure AD to Azure Active Directory Domain Services

To provide authentication services, Azure Active Directory Domain Services (Azure AD DS) synchronizes users and groups from Azure AD. In a hybrid environment, users and groups from an on-premises Active Directory Domain Services (AD DS) environment can be first synchronized to Azure AD using Azure AD Connect, and then synchronized to Azure AD DS.

By default, all users and groups from an Azure AD directory are synchronized to an Azure AD DS managed domain. If you have specific needs, you can instead choose to synchronize only a defined set of users.

This article shows you how to create a managed domain that uses scoped synchronization and then change or disable the set of scoped users.

## Scoped synchronization overview

By default, all users and groups from an Azure AD directory are synchronized to a managed domain. If only a few users need to access the managed domain, you can synchronize only those user accounts. This scoped synchronization is group-based. When you configure group-based scoped synchronization, only the user accounts that belong to the groups you specify are synchronized to the managed domain.

The following table outlines how to use scoped synchronization:

| Current state | Desired state | Required configuration |
| --- | --- | --- |
| An existing managed domain is configured to synchronize all user accounts and groups. | You want to synchronize only user accounts that belong to specific groups. | You can't change from synchronizing all users to using scoped synchronization. [Delete the existing managed domain](delete-aadds.md), then follow the steps in this article to re-create a managed domain with scoped synchronization configured. |
| No existing managed domain. | You want to create a new managed domain and synchronize only user accounts belonging to specific groups. | Follow the steps in this article to create a managed domain with scoped synchronization configured. |
| An existing managed domain is configured to synchronize only accounts that belong to specific groups. | You want to modify the list of groups whose users should be synchronized to the managed domain. | Follow the steps in this article to modify scoped synchronization. |

You use the Azure portal or PowerShell to configure the scoped synchronization settings:

| Action | | |
|--|--|--|
| Create a managed domain and configure scoped synchronization | [Azure portal](#enable-scoped-synchronization-using-the-azure-portal) | [PowerShell](#enable-scoped-synchronization-using-powershell) |
| Modify scoped synchronization | [Azure portal](#modify-scoped-synchronization-using-the-azure-portal) | [PowerShell](#modify-scoped-synchronization-using-powershell) |
| Disable scoped synchronization | [Azure portal](#disable-scoped-synchronization-using-the-azure-portal) | [PowerShell](#disable-scoped-synchronization-using-powershell) |

> [!WARNING]
> Changing the scope of synchronization causes the managed domain to resynchronize all data. The following considerations apply:
> 
>  * When you change the synchronization scope for a managed domain, a full resynchronization occurs.
>  * Objects that are no longer required in the managed domain are deleted. New objects are created in the managed domain.
>  * Resynchronization may take a long time to complete. The synchronization time depends on the number of objects such as users, groups, and group memberships in the managed domain and Azure AD directory. For large directories with many hundreds of thousands of objects, resynchronization may take a few days.

## Enable scoped synchronization using the Azure portal

To enable scoped synchronization in the Azure portal, complete the the following steps:

1. Follow the [tutorial to create and configure a managed domain](tutorial-create-instance-advanced.md). Complete all prerequisites and deployment steps other than for synchronization scope.
1. Choose **Scoped** at the synchronization step, then select the Azure AD groups to synchronize to the managed domain.

The managed domain can take up to an hour to complete the deployment. In the Azure portal, the **Overview** page for your managed domain shows the current status throughout this deployment stage.

When the Azure portal shows that the managed domain has finished provisioning, the following tasks need to be completed:

* Update DNS settings for the virtual network so virtual machines can find the managed domain for domain join or authentication.
    * To configure DNS, select your managed domain in the portal. On the **Overview** window, you are prompted to automatically configure these DNS settings.
* [Enable password synchronization to Azure AD Domain Services](tutorial-create-instance-advanced.md#enable-user-accounts-for-azure-ad-ds) so end users can sign in to the managed domain using their corporate credentials.

## Modify scoped synchronization using the Azure portal

To modify the list of groups whose users should be synchronized to the managed domain, complete the following steps:

1. In the Azure portal, search for and select **Azure AD Domain Services**. Choose your managed domain, such as *aaddscontoso.com*.
1. Select **Synchronization** from the menu on the left-hand side.
1. To add a group, choose **+ Select groups** at the top, then choose the groups to add.
1. To remove a group from the synchronization scope, select it from the list of currently synchronized groups and choose **Remove groups**.
1. When all changes are made, select **Save synchronization scope**.

Changing the scope of synchronization causes the managed domain to resynchronize all data. Objects that are no longer required in the managed domain are deleted, and resynchronization may take a long time to complete.

## Disable scoped synchronization using the Azure portal

To disable group-based scoped synchronization for a managed domain, complete the following steps:

1. In the Azure portal, search for and select **Azure AD Domain Services**. Choose your managed domain, such as *aaddscontoso.com*.
1. Select **Synchronization** from the menu on the left-hand side.
1. Set the synchronization scope from **Scoped** to **All**, then select **Save synchronization scope**.

Changing the scope of synchronization causes the managed domain to resynchronize all data. Objects that are no longer required in the managed domain are deleted, and resynchronization may take a long time to complete.

## PowerShell script for scoped synchronization

To configure scoped synchronization using PowerShell, first save the following script to a file named `Select-GroupsToSync.ps1`. This script configures Azure AD DS to synchronize selected groups from Azure AD. All user accounts that are part of the specified groups are synchronized to the managed domain.

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

## Enable scoped synchronization using PowerShell

Use PowerShell to complete the following set of steps. Refer to the instructions to [enable Azure Active Directory Domain Services using PowerShell](powershell-create-instance.md). A couple of steps in this article are modified slightly to configure scoped synchronization.

1. Complete the following tasks from the article to enable Azure AD DS using PowerShell. Stop at the step to actually create the managed domain. You configure the scoped synchronization you create the managed domain.

   * [Install the required PowerShell modules](powershell-create-instance.md#prerequisites).
   * [Create the required service principal and Azure AD group for administrative access](powershell-create-instance.md#create-required-azure-ad-resources).
   * [Create supporting Azure resources like a virtual network and subnets](powershell-create-instance.md#create-supporting-azure-resources).

1. Determine the groups and users they contain that you want to synchronize from Azure AD. Make a list of the display names of the groups to synchronize to Azure AD DS.

1. Run the [script from the previous section](#powershell-script-for-scoped-synchronization) and use the *-groupsToAdd* parameter to pass the list of groups to synchronize.

   > [!WARNING]
   > You must include the *AAD DC Administrators* group in the list of groups for scoped synchronization. If you don't include this group, the managed domain is unusable.

   ```powershell
   .\Select-GroupsToSync.ps1 -groupsToAdd @("AAD DC Administrators", "GroupName1", "GroupName2")
   ```

1. Now create the managed domain and enable group-based scoped synchronization. Include *"filteredSync" = "Enabled"* in the *-Properties* parameter.

    Set your Azure subscription ID, and then provide a name for the managed domain, such as *aaddscontoso.com*. You can get your subscription ID using the [Get-AzSubscription][Get-AzSubscription] cmdlet. Set the resource group name, virtual network name, and region to the values used in the previous steps to create the supporting Azure resources:

   ```powershell
   $AzureSubscriptionId = "YOUR_AZURE_SUBSCRIPTION_ID"
   $ManagedDomainName = "aaddscontoso.com"
   $ResourceGroupName = "myResourceGroup"
   $VnetName = "myVnet"
   $AzureLocation = "westus"

   # Enable Azure AD Domain Services for the directory.
   New-AzResource -ResourceId "/subscriptions/$AzureSubscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.AAD/DomainServices/$ManagedDomainName" `
   -Location $AzureLocation `
   -Properties @{"DomainName"=$ManagedDomainName; "filteredSync" = "Enabled"; `
    "SubnetId"="/subscriptions/$AzureSubscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.Network/virtualNetworks/$VnetName/subnets/DomainServices"} `
   -Force -Verbose
   ```

It takes a few minutes to create the resource and return control to the PowerShell prompt. The managed domain continues to be provisioned in the background, and can take up to an hour to complete the deployment. In the Azure portal, the **Overview** page for your managed domain shows the current status throughout this deployment stage.

When the Azure portal shows that the managed domain has finished provisioning, the following tasks need to be completed:

* Update DNS settings for the virtual network so virtual machines can find the managed domain for domain join or authentication.
    * To configure DNS, select your managed domain in the portal. On the **Overview** window, you are prompted to automatically configure these DNS settings.
* If you created a managed domain in a region that supports Availability Zones, create a network security group to restrict traffic in the virtual network for the managed domain. An Azure standard load balancer is created that requires these rules to be place. This network security group secures Azure AD DS and is required for the managed domain to work correctly.
    * To create the network security group and required rules, select your managed domain in the portal. On the **Overview** window, you are prompted to automatically create and configure the network security group.
* [Enable password synchronization to Azure AD Domain Services](tutorial-create-instance-advanced.md#enable-user-accounts-for-azure-ad-ds) so end users can sign in to the managed domain using their corporate credentials.

## Modify scoped synchronization using PowerShell

To modify the list of groups whose users should be synchronized to the managed domain, re-run the [PowerShell script](#powershell-script-for-scoped-synchronization) and specify the new list of groups. In the following example, the groups to synchronize no longer includes *GroupName2*, and now includes *GroupName3*.

> [!WARNING]
> You must include the *AAD DC Administrators* group in the list of groups for scoped synchronization. If you don't include this group, the managed domain is unusable.

```powershell
.\Select-GroupsToSync.ps1 -groupsToAdd @("AAD DC Administrators", "GroupName1", "GroupName3")
```

Changing the scope of synchronization causes the managed domain to resynchronize all data. Objects that are no longer required in the managed domain are deleted, and resynchronization may take a long time to complete.

## Disable scoped synchronization using PowerShell

To disable group-based scoped synchronization for a managed domain, set *"filteredSync" = "Disabled"* on the Azure AD DS resource, then update the managed domain. When complete, all users and groups are set to synchronize from Azure AD.

```powershell
// Retrieve the Azure AD DS resource.
$DomainServicesResource = Get-AzResource -ResourceType "Microsoft.AAD/DomainServices"

// Disable group-based scoped synchronization.
$disableScopedSync = @{"filteredSync" = "Disabled"}

// Update the Azure AD DS resource
Set-AzResource -Id $DomainServicesResource.ResourceId -Properties $disableScopedSync
```

Changing the scope of synchronization causes the managed domain to resynchronize all data. Objects that are no longer required in the managed domain are deleted, and resynchronization may take a long time to complete.

## Next steps

To learn more about the synchronization process, see [Understand synchronization in Azure AD Domain Services](synchronization.md).

<!-- EXTERNAL LINKS -->
[Get-AzSubscription]: /powershell/module/Az.Accounts/Get-AzSubscription
