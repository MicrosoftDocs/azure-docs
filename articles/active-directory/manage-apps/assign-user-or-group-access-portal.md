---
title: Assign users and groups
description: Learn how to assign and unassign users, and groups, for an app using Azure Active Directory for identity management.
services: active-directory
author: eringreenlee
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 09/06/2022
ms.author: ergreenl
ms.custom: contperf-fy22q2, contperf-fy22q3

#customer intent: As an admin, I want to manage user assignment for an app in Azure Active Directory using PowerShell
---

# Assign users and groups to an application

This article shows you how to assign users and groups to an enterprise application in Azure Active Directory (Azure AD) using PowerShell. When you assign a user to an application, the application appears in the user's [My Apps](https://myapps.microsoft.com/) portal for easy access. If the application exposes app roles, you can also assign a specific app role to the user.

When you assign a group to an application, only users in the group will have access. The assignment does not cascade to nested groups.

Group-based assignment requires Azure Active Directory Premium P1 or P2 edition. Group-based assignment is supported for Security groups only. Nested group memberships and Microsoft 365 groups are not currently supported. For more licensing requirements for the features discussed in this article, see the [Azure Active Directory pricing page](https://azure.microsoft.com/pricing/details/active-directory). 

For greater control, certain types of enterprise applications can be configured to require user assignment. See [Manage access to an application](what-is-access-management.md#requiring-user-assignment-for-an-app) for more information on requiring user assignment for an app.

## Prerequisites

To assign users to an app using PowerShell, you need:

- An Azure account with an active subscription. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
- If you have not yet installed the AzureAD module (use the command `Install-Module -Name AzureAD`). If you're prompted to install a NuGet module or the new Azure Active Directory V2 PowerShell module, type Y and press ENTER.
- Azure Active Directory Premium P1 or P2 for group-based assignment. For more licensing requirements for the features discussed in this article, see the [Azure Active Directory pricing page](https://azure.microsoft.com/pricing/details/active-directory).

## Assign users, and groups, to an app using PowerShell

1. Open an elevated Windows PowerShell command prompt.
1. Run `Connect-AzureAD` and sign in with a Global Admin user account.
1. Use the following script to assign a user and role to an application:

    ```powershell
    # Assign the values to the variables
    $username = "<Your user's UPN>"
    $app_name = "<Your App's display name>"
    $app_role_name = "<App role display name>"

    # Get the user to assign, and the service principal for the app to assign to
    $user = Get-AzureADUser -ObjectId "$username"
    $sp = Get-AzureADServicePrincipal -Filter "displayName eq '$app_name'"
    $appRole = $sp.AppRoles | Where-Object { $_.DisplayName -eq $app_role_name }

    # Assign the user to the app role
    New-AzureADUserAppRoleAssignment -ObjectId $user.ObjectId -PrincipalId $user.ObjectId -ResourceId $sp.ObjectId -Id $appRole.Id
    ```

To assign a group to an enterprise app, you must replace `Get-AzureADUser` with `Get-AzureADGroup` and replace `New-AzureADUserAppRoleAssignment` with `New-AzureADGroupAppRoleAssignment`.

For more information about how to assign a group to an application role, see the documentation for [New-AzureADGroupAppRoleAssignment](/powershell/module/azuread/new-azureadgroupapproleassignment).

### Example

This example assigns the user Britta Simon to the Microsoft Workplace Analytics application using PowerShell.

1. In PowerShell, assign the corresponding values to the variables $username, $app_name and $app_role_name.

    ```powershell
    # Assign the values to the variables
    $username = "britta.simon@contoso.com"
    $app_name = "Workplace Analytics"
    ```

1. In this example, we don't know what is the exact name of the application role we want to assign to Britta Simon. Run the following commands to get the user ($user) and the service principal ($sp) using the user UPN and the service principal display names.

    ```powershell
    # Get the user to assign, and the service principal for the app to assign to
    $user = Get-AzureADUser -ObjectId "$username"
    $sp = Get-AzureADServicePrincipal -Filter "displayName eq '$app_name'"
    ```

1. Run the command `$sp.AppRoles` to display the roles available for the Workplace Analytics application. In this example, we want to assign Britta Simon the Analyst (Limited access) Role.
   ![Shows the roles available to a user using Workplace Analytics Role](./media/assign-user-or-group-access-portal/workplace-analytics-role.png)
1. Assign the role name to the `$app_role_name` variable.

    ```powershell
    # Assign the values to the variables
    $app_role_name = "Analyst (Limited access)"
    $appRole = $sp.AppRoles | Where-Object { $_.DisplayName -eq $app_role_name }
    ```

1. Run the following command to assign the user to the app role:

    ```powershell
    # Assign the user to the app role
    New-AzureADUserAppRoleAssignment -ObjectId $user.ObjectId -PrincipalId $user.ObjectId -ResourceId $sp.ObjectId -Id $appRole.Id
    ```

## Unassign users, and groups, from an app using PowerShell

1. Open an elevated Windows PowerShell command prompt.
1. Run `Connect-AzureAD` and sign in with a Global Admin user account. Use the following script to remove a user and role from an application:

    ```powershell
    # Store the proper parameters
    $user = get-azureaduser -ObjectId <objectId>
    $spo = Get-AzureADServicePrincipal -ObjectId <objectId>

    #Get the ID of role assignment 
    $assignments = Get-AzureADServiceAppRoleAssignment -ObjectId $spo.ObjectId | Where {$_.PrincipalDisplayName -eq $user.DisplayName}

    #if you run the following, it will show you what is assigned what
    $assignments | Select *

    #To remove the App role assignment run the following command.
    Remove-AzureADServiceAppRoleAssignment -ObjectId $spo.ObjectId -AppRoleAssignmentId $assignments[assignment #].ObjectId
    ```

## Remove all users who are assigned to the application

```powershell
#Retrieve the service principal object ID.
$app_name = "<Your App's display name>"
$sp = Get-AzureADServicePrincipal -Filter "displayName eq '$app_name'"
$sp.ObjectId

# Get Service Principal using objectId
$sp = Get-AzureADServicePrincipal -ObjectId "<ServicePrincipal objectID>"

# Get Azure AD App role assignments using objectId of the Service Principal
$assignments = Get-AzureADServiceAppRoleAssignment -ObjectId $sp.ObjectId -All $true

# Remove all users and groups assigned to the application
$assignments | ForEach-Object {
    if ($_.PrincipalType -eq "User") {
        Remove-AzureADUserAppRoleAssignment -ObjectId $_.PrincipalId -AppRoleAssignmentId $_.ObjectId
    } elseif ($_.PrincipalType -eq "Group") {
        Remove-AzureADGroupAppRoleAssignment -ObjectId $_.PrincipalId -AppRoleAssignmentId $_.ObjectId
    }
}
```

## Next steps

- [Create and assign a user account from the Azure portal](add-application-portal-assign-users.md)
- [Manage access to apps](what-is-access-management.md).
