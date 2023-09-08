---

title: Microsoft Graph PowerShell examples for group licensing
description: Microsoft Graph PowerShell group based licensing examples
services: active-directory
keywords: Azure AD licensing
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: enterprise-users
ms.topic: how-to
ms.workload: identity
ms.date: 05/05/2023
ms.author: barclayn

---

# Microsoft Graph PowerShell group-based licensing examples

Group-based licensing in Azure Active Directory (Azure AD), part of Microsoft Entra, is available through the [Azure portal](https://portal.azure.com). There are useful tasks that can be performed using [Microsoft Graph PowerShell Cmdlets](/powershell/microsoftgraph/get-started). In this article, we go over some examples using Microsoft Graph PowerShell.

> [!NOTE]
> Before you begin running cmdlets, make sure you connect to your organization first, by running the `Connect-MgGraph` cmdlet.

> [!WARNING]
> These samples are provided for demonstration purposes only. We recommend testing them on a smaller scale or in a separate test environment before relying on them in your production environment. You may also need to modify the samples to meet your specific environment's requirements.

## Assign licenses to a group

[Group based licensing](../fundamentals/active-directory-licensing-whatis-azure-portal.md) provides a convenient way to manage license assignment. You can assign one or more product licenses to a group and those licenses are assigned to all members of the group.

```powershell
# Import the Microsoft.Graph.Groups module
Import-Module Microsoft.Graph.Groups
$groupId = "911f05cf-f635-440c-b888-e54c73e0ef1a"

# Create a hashtable to store the parameters for the Set-MgGroupLicense cmdlet
$params = @{
    AddLicenses = @(
        @{
            # Remove the DisabledPlans key as we don't need to disable any service plans
            # Specify the SkuId of the license you want to assign
            SkuId = "c42b9cae-ea4f-4ab7-9717-81576235ccac"
        }
    )
    # Keep the RemoveLicenses key empty as we don't need to remove any licenses
    RemoveLicenses = @(
    )
}

# Call the Set-MgGroupLicense cmdlet to update the licenses for the specified group
# Replace $groupId with the actual group ID
Set-MgGroupLicense -GroupId $groupId -BodyParameter $params

```

## View product licenses assigned to a group



```powershell
(Get-MgGroup -GroupId 99c4216a-56de-42c4-a4ac-1111cd8c7c41 -Property "AssignedLicenses" | Select-Object -ExpandProperty AssignedLicenses).SkuId

```


## Get all groups with licenses


```powershell
# Import the Microsoft.Graph.Groups module
Import-Module Microsoft.Graph.Groups
# Get all groups and licenses
$groups = Get-MgGroup -All
$groupsWithLicenses = @()
# Loop through each group and check if it has any licenses assigned
foreach ($group in $groups) {
    $licenses = Get-MgGroup -GroupId $group.Id -Property "AssignedLicenses, Id, DisplayName" | Select-Object AssignedLicenses, DisplayName, Id
    if ($licenses.AssignedLicenses) {
        $groupData = [PSCustomObject]@{
            ObjectId = $group.Id
            DisplayName = $group.DisplayName
            Licenses = $licenses.AssignedLicenses
        }
        $groupsWithLicenses += $groupData
    }
}

```

## Get statistics for groups with licenses


```powershell
# Import User Graph Module
Import-Module Microsoft.Graph.Users
# Authenticate to MS Graph
Connect-MgGraph -Scopes "User.Read.All", "Directory.Read.All", "Group.ReadWrite.All"
#get all groups with licenses
$groups = Get-MgGroup -All -Property LicenseProcessingState, DisplayName, Id, AssignedLicenses | Select-Object  displayname, Id, LicenseProcessingState, AssignedLicenses | Select-Object DisplayName, Id, AssignedLicenses -ExpandProperty LicenseProcessingState | Select-Object DisplayName, State, Id, AssignedLicenses | Where-Object {$_.State -eq "ProcessingComplete"}
$groupInfoArray = @()
# Filter the groups to only include those that have licenses assigned
$groups = $groups | Where-Object {$_.AssignedLicenses -ne $null}
# For each group, get the group name, license types, total user count, licensed user count, and license error count
foreach ($group in $groups) {
    $groupInfo = New-Object PSObject
    $groupInfo | Add-Member -MemberType NoteProperty -Name "Group Name" -Value $group.DisplayName
    $groupInfo | Add-Member -MemberType NoteProperty -Name "Group ID" -Value $group.Id
    $groupInfo | Add-Member -MemberType NoteProperty -Name "License Types" -Value ($group.AssignedLicenses | Select-Object -ExpandProperty SkuId)
    $groupInfo | Add-Member -MemberType NoteProperty -Name "Total User Count" -Value (Get-MgGroupMember -GroupId $group.Id -All | Measure-Object).Count
    $groupInfo | Add-Member -MemberType NoteProperty -Name "Licensed User Count" -Value (Get-MgGroupMember -GroupId $group.Id -All | Where-Object {$_.      LicenseProcessingState -eq "ProcessingComplete"} | Measure-Object).Count
    $groupInfo | Add-Member -MemberType NoteProperty -Name "License Error Count" -Value (Get-MgGroupMember -GroupId $group.Id -All | Where-Object {$_.LicenseProcessingState -eq "ProcessingFailed"} | Measure-Object).Count
    $groupInfoArray += $groupInfo
}

# Format the output and print it to the console
$groupInfoArray | Format-Table -AutoSize

```


## Get all groups with license errors


```powershell
# Import User Graph Module
Import-Module Microsoft.Graph.Users
# Authenticate to MS Graph
Connect-MgGraph -Scopes "Group.Read.All"
# Get all groups in the tenant with license assigned and with errors
$groups = Get-MgGroup -All -Property LicenseProcessingState, DisplayName, Id, AssignedLicenses | Select-Object  displayname, Id, LicenseProcessingState, AssignedLicenses | Select-Object DisplayName, Id, AssignedLicenses -ExpandProperty LicenseProcessingState | Select-Object DisplayName, State, Id, AssignedLicenses | Where-Object {$_.State -eq "ProcessingFailed" -and $_.AssignedLicenses -ne $null }
# Display the results and format output
$groups | Format-Table -AutoSize

```


## Get all users with license errors in a group

Given a group that contains some license-related errors, you can now list all users affected by those errors. A user can have errors from other groups, too. However, in this example we limit results only to errors relevant to the group in question by checking the **ReferencedObjectId** property of each **IndirectLicenseError** entry on the user.


```powershell
# Import User Graph Module
Import-Module Microsoft.Graph.Users
# Authenticate to MS Graph
Connect-MgGraph -Scopes "Group.Read.All", "User.Read.All"
# Get all groups in the tenant with license assigned
$groups = Get-MgGroup -All -Property LicenseProcessingState, DisplayName, Id, AssignedLicenses | Select-Object  displayname, Id, LicenseProcessingState, AssignedLicenses | Select-Object DisplayName, Id, AssignedLicenses | Where-Object {$_.AssignedLicenses -ne $null }
#output array
$groupInfoArray = @()
# Get All Members from the groups and check their license status
foreach($group in $groups) {
    $groupMembers = Get-MgGroupMember -GroupId $group.Id -All -Property LicenseProcessingState, DisplayName, Id, AssignedLicenses | Select-Object  displayname, Id, LicenseProcessingState, AssignedLicenses | Select-Object DisplayName, Id, AssignedLicenses -ExpandProperty LicenseProcessingState | Select-Object DisplayName, Id, AssignedLicenses | Where-Object {$_.AssignedLicenses -ne $null }
    foreach($member in $groupMembers) {
        Write-Host "Member $($member.DisplayName)"
        if($member.LicenseProcessingState -eq "ProcessingFailed") {
            $group | Add-Member -MemberType NoteProperty -Name "License Error" -Value $member.DisplayName
            $groupInfoArray += $group
        }
    }
}

# Format the output and print it to the console

if ($groupInfoArray.Length -gt 0) {
    $groupInfoArray | Format-Table -AutoSize
}
else {
    Write-Host "No License Errors"
}

```


## Get all users with license errors in the entire organization

The following script can be used to get all users who have license errors from one or more groups. The script prints one row per user, per license error, which allows you to clearly identify the source of each error.


```powershell
# Import User Graph Module
Import-Module Microsoft.Graph.Users
# Authenticate to MS Graph
Connect-MgGraph -Scopes "User.Read.All"
# Get All Users From the Tenant with licenses assigned
$users = Get-MgUser -All -Property AssignedLicenses, LicenseAssignmentStates, DisplayName | Select-Object DisplayName, AssignedLicenses -ExpandProperty LicenseAssignmentStates | Select-Object DisplayName, AssignedByGroup, State, Error, SkuId
#count the number of users found with errors
$count = 0
# Loop through each user and check the Error property for None value
foreach($user in $users) {
    if($user.Error -ne "None") {
        $count += 1
        Write-Host "User $($user.DisplayName) has a license error"
    }
}
if ($count -le 0) {
 write-host "No user found with license errors"
}
```




## Check if user license is assigned directly or inherited from a group

```powershell
# Connect to Microsoft Graph using Connect-MgGraph
Connect-MgGraph -Scopes "User.Read.All"

# Get all users using Get-MgUser with a filter
$users = Get-MgUser -All -Property AssignedLicenses, LicenseAssignmentStates, DisplayName | Select-Object DisplayName, AssignedLicenses -ExpandProperty LicenseAssignmentStates | Select-Object DisplayName, AssignedByGroup, State, Error, SkuId

$output = @()


# Loop through all users and get the AssignedByGroup Details which will list the groupId
foreach ($user in $users) {
    # Get the group ID if AssignedByGroup is not empty
    if ($user.AssignedByGroup -ne $null)
    {
        $groupId = $user.AssignedByGroup
        $groupName = Get-MgGroup -GroupId $groupId | Select-Object -ExpandProperty DisplayName  
        Write-Host "$($user.DisplayName) is assigned by group - $($groupName)" -ErrorAction SilentlyContinue -ForegroundColor Yellow
        $result = [pscustomobject]@{
            User=$user.DisplayName
            AssignedByGroup=$true
            GroupName=$groupName
            GroupId=$groupId
        }
        $output += $result
    }

    else {
    $result = [pscustomobject]@{
            User=$user.DisplayName
            AssignedByGroup=$false
            GroupName="NA"
            GroupId="NA"
        }
        $output += $result
        Write-Host "$($user.DisplayName) is Not assigned by group" -ErrorAction SilentlyContinue -ForegroundColor Cyan
    }
        
    
}

# Display the result
$output | ft
```


## Remove direct licenses for users with group licenses

The purpose of this script is to remove unnecessary direct licenses from users who already inherit the same license from a group; for example, as part of a [transition to group-based licensing](licensing-groups-migrate-users.md).

> [!NOTE]
>To ensure that users do not lose access to services and data, it is important to confirm that directly assigned licenses do not provide more service functionality than the inherited licenses. It is not currently possible to use PowerShell to determine which services are enabled through inherited licenses versus direct licenses. Therefore, the script uses a minimum level of services that are known to be inherited from groups to check and ensure that users do not experience unexpected service loss.


```powershell
Import-Module Microsoft.Graph

# Connect to the Microsoft Graph
Connect-MgGraph

# Get the group to be processed
$groupId = "48ca647b-7e4d-41e5-aa66-40cab1e19101"

# Get the license to be removed - Office 365 E3
$skuId = "contoso:ENTERPRISEPACK"

# Minimum set of service plans we know are inherited by this group
$expectedDisabledPlans = @("Exchange Online", "SharePoint Online", "Lync Online")

# Get the users in the group
$users = Get-MgUser -GroupObjectId $groupId

# For each user, get the license for the specified SKU
foreach ($user in $users) {
    $license = GetUserLicense $user $skuId

    # If the user has the license assigned directly, continue to the next user
    if (UserHasLicenseAssignedDirectly $user $skuId) {
        continue
    }

    # If the user is inheriting the license from the specified group, continue to the next user
    if (UserHasLicenseAssignedFromThisGroup $user $skuId $groupId) {
        continue
    }

    # Get the list of disabled service plans for the SKU
    $disabledPlans = GetDisabledPlansForSKU $skuId $expectedDisabledPlans

    # Get the list of unexpected enabled plans for the user
    $extraPlans = GetUnexpectedEnabledPlansForUser $user $skuId $expectedDisabledPlans

    # If there are any unexpected enabled plans, print them to the console
    if ($extraPlans.Count -gt 0) {
        Write-Warning "The user $user has the following unexpected enabled plans for the $skuId SKU: $extraPlans"
    }
}
```



## Next steps

To learn more about the feature set for license management through groups, see the following articles:

* [What is group-based licensing in Azure Active Directory?](../fundamentals/active-directory-licensing-whatis-azure-portal.md)
* [Assigning licenses to a group in Azure Active Directory](./licensing-groups-assign.md)
* [Identifying and resolving license problems for a group in Azure Active Directory](licensing-groups-resolve-problems.md)
