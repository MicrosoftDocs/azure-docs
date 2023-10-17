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

Group-based licensing in Microsoft Entra ID, part of Microsoft Entra, is available through the [Azure portal](https://portal.azure.com). There are useful tasks that can be performed using [Microsoft Graph PowerShell Cmdlets](/powershell/microsoftgraph/get-started). In this article, we go over some examples using Microsoft Graph PowerShell.

> [!NOTE]
> Before you begin running cmdlets, make sure you connect to your organization first, by running the `Connect-MgGraph` cmdlet.

> [!WARNING]
> These samples are provided for demonstration purposes only. We recommend testing them on a smaller scale or in a separate test environment before relying on them in your production environment. You may also need to modify the samples to meet your specific environment's requirements.

## Assign licenses to a group

[Group based licensing](../fundamentals/licensing-whatis-azure-portal.md) provides a convenient way to manage license assignment. You can assign one or more product licenses to a group and those licenses are assigned to all members of the group.

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
# Import the Microsoft.Graph.Users and Microsoft.Graph.Groups modules
Import-Module Microsoft.Graph.Users -Force
Import-Module Microsoft.Graph.Authentication -Force
Import-Module Microsoft.Graph.Users.Actions -Force
Import-Module Microsoft.Graph.Groups -Force

Clear-Host

if ($null -eq (Get-MgContext)) {
    Connect-MgGraph -Scopes "Directory.Read.All, User.Read.All, Group.Read.All, Organization.Read.All" -NoWelcome
}

# Get all groups with licenses assigned
$groupsWithLicenses = Get-MgGroup -All -Property AssignedLicenses, DisplayName, Id | Where-Object { $_.assignedlicenses } | Select-Object DisplayName, Id -ExpandProperty AssignedLicenses | Select-Object DisplayName, Id, SkuId

$output = @()

# Check if there is any group that has licenses assigned or not
if ($null -ne $groupsWithLicenses) {
    # Loop through each group
    foreach ($group in $groupsWithLicenses) {
        # Get the group's licenses
        $groupLicenses = $group.SkuId
    
        # Get the group's members
        $groupMembers = Get-MgGroupMember -GroupId $group.Id -All

        # Check if the group member list is empty or not
        if ($groupMembers) {
            # Loop through each member
            foreach ($member in $groupMembers) {
                # Check if the member is a user
                if ($member.AdditionalProperties.'@odata.type' -eq '#microsoft.graph.user') {
                    # Get the user's direct licenses
                    Write-Host "Fetching license details for $($member.AdditionalProperties.displayName)" -ForegroundColor Yellow
                    
                    # Get User With Directly Assigned Licenses Only
                    $user = Get-MgUser -UserId $member.Id -Property AssignedLicenses, LicenseAssignmentStates, DisplayName | Select-Object DisplayName, AssignedLicenses -ExpandProperty LicenseAssignmentStates | Select-Object DisplayName, AssignedByGroup, State, Error, SkuId | Where-Object { $_.AssignedByGroup -eq $null }

                    $licensesToRemove = @()
                    if($user)
                    {
                        if ($user.count -ge 2) {
                            foreach ($u in $user) {
                                $userLicenses = $u.SkuId
                                $licensesToRemove += $userLicenses | Where-Object { $_ -in $groupLicenses }
                            }
                        }
                        else {
                            $userLicenses = $user.SkuId
                            $licensesToRemove = $userLicenses | Where-Object { $_ -in $groupLicenses }
                        }  
                    } else {
                        Write-Host "No conflicting licenses found for the user $($member.AdditionalProperties.displayName)" -ForegroundColor Green
                    }
                    
                                       
        
                    # Remove the licenses from the user
                    if ($licensesToRemove) {
                        Write-Host "Removing the license $($licensesToRemove) from user $($member.AdditionalProperties.displayName) as inherited from group $($group.DisplayName)" -ForegroundColor Green
                        $result = Set-MgUserLicense -UserId $member.Id -AddLicenses @() -RemoveLicenses $licensesToRemove
                        $obj = [PSCustomObject]@{
                            User                      = $result.DisplayName
                            Id                        = $result.Id
                            LicensesRemoved           = $licensesToRemove
                            LicenseInheritedFromGroup = $group.DisplayName
                            GroupId                   = $group.Id
                        }

                        $output += $obj

                    } 
                    else {
                        Write-Host "No action required for $($member.AdditionalProperties.displayName)" -ForegroundColor Green
                        }
        
                }
            }
        }
        else {
            Write-Host "The licensed group $($group.DisplayName) has no members, exiting now!!" -ForegroundColor Yellow
        }   
        
    }
    
    $output | Format-Table -AutoSize
}
else {
    Write-Host "No groups found with licenses assigned." -ForegroundColor Cyan
}
```



## Next steps

To learn more about the feature set for license management through groups, see the following articles:

* [What is group-based licensing in Microsoft Entra ID?](../fundamentals/licensing-whatis-azure-portal.md)
* [Assigning licenses to a group in Microsoft Entra ID](./licensing-groups-assign.md)
* [Identifying and resolving license problems for a group in Microsoft Entra ID](licensing-groups-resolve-problems.md)
