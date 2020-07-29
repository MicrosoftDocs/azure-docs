---
title: Assign a user or group to an enterprise app in Azure AD
description: How to select an enterprise app to assign a user or group to it in Azure Active Directory
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 02/21/2020
ms.author: kenwith
ms.reviewer: luleon
ms.collection: M365-identity-device-management
---

# Assign a user or group to an enterprise app in Azure Active Directory

This article shows you how to assign users or groups to enterprise applications in Azure Active Directory (Azure AD), either from within the Azure portal or by using PowerShell. When you assign a user to an application, the application appears in the user's [My Apps access panel](https://myapps.microsoft.com/) for easy access. If the application exposes roles, you can also assign a specific role to the user.

For greater control, certain types of enterprise applications can be configured to [require user assignment](#configure-an-application-to-require-user-assignment). 

To [assign a user or group to an enterprise app](#assign-users-or-groups-to-an-app-via-the-azure-portal), you'll need to sign in as a global administrator, application administrator, cloud application administrator, or the assigned owner of the enterprise app.

> [!NOTE]
> Group-based assignment requires Azure Active Directory Premium P1 or P2 edition. Group-based assignment is supported for Security groups only. Nested group memberships and Office 365 groups are not currently supported. For more licensing requirements for the features discussed in this article, see the [Azure Active Directory pricing page](https://azure.microsoft.com/pricing/details/active-directory). 

## Configure an application to require user assignment

With the following types of applications, you have the option of requiring users to be assigned to the application before they can access it:

- Applications configured for federated single sign-on (SSO) with SAML-based authentication
- Application Proxy applications that use Azure Active Directory Pre-Authentication
- Applications built on the Azure AD application platform that use OAuth 2.0 / OpenID Connect Authentication after a user or admin has consented to that application.

When user assignment is required, only those users you explicitly assign to the application (either through direct user assignment or based on group membership) will be able to sign in. They can access the app on their My Apps page or by using a direct link. 

When assignment is *not required*, either because you've set this option to **No** or because the application uses another SSO mode, any user will be able to access the application if they have a direct link to the application or the **User Access URL** in the application’s **Properties** page. 

This setting doesn't affect whether or not an application appears on the My Apps access panel. Applications appear on users' My Apps access panels once you've assigned a user or group to the application. For background, see [Managing access to apps](what-is-access-management.md).


To require user assignment for an application:

1. Sign in to the [Azure portal](https://portal.azure.com) with an administrator account or as an owner of the application.

2. Select **Azure Active Directory**. In the left navigation menu, select **Enterprise applications**.

3. Select the application from the list. If you don't see the application, start typing its name in the search box. Or use the filter controls to select the application type, status, or visibility, and then select **Apply**.

4. In the left navigation menu, select **Properties**.

5. Make sure the **User assignment required?** toggle is set to **Yes**.

   > [!NOTE]
   > If the **User assignment required?** toggle isn't available, you can use PowerShell to set the appRoleAssignmentRequired property on the service principal.

6. Select the **Save** button at the top of the screen.

## Assign users or groups to an app via the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) with a global administrator, application administrator, or cloud application administrator account, or as the assigned owner of the enterprise app.
2. Select **Azure Active Directory**. In the left navigation menu, select **Enterprise applications**.
3. Select the application from the list. If you don't see the application, start typing its name in the search box. Or use the filter controls to select the application type, status, or visibility, and then select **Apply**.
4. In the left navigation menu, select **Users and groups**.
   > [!NOTE]
   > If you want to assign users to Microsoft Applications such as Office 365 apps, some of the these apps use PowerShell. 
5. Select the **Add user** button.
6. On the **Add Assignment** pane, select **Users and groups**.
7. Select the user or group you want to assign to the application, or start typing the name of the user or group in the search box. You can choose multiple users and groups, and your selections will appear under **Selected items**.
8. When finished, click **Select**.

   ![Assign a user or group to the app](./media/assign-user-or-group-access-portal/assign-users.png)

9. On the **Users and groups** pane, select one or more users or groups from the list and then choose the **Select** button at the bottom of the pane.
10. If the application supports it, you can assign a role to the user or group. On the **Add Assignment** pane, choose **Select Role**. Then, on the **Select Role** pane, choose a role to apply to the selected users or groups, then select **OK** at the bottom of the pane. 

    > [!NOTE]
    > If the application doesn't support role selection, the default access role is assigned. In this case, the application manages the level of access users have.

2. On the **Add Assignment** pane, select the **Assign** button at the bottom of the pane.

## Assign users or groups to an app via PowerShell

1. Open an elevated Windows PowerShell command prompt.

   > [!NOTE]
   > You need to install the AzureAD module (use the command `Install-Module -Name AzureAD`). If prompted to install a NuGet module or the new Azure Active Directory V2 PowerShell module, type Y and press ENTER.

1. Run `Connect-AzureAD` and sign in with a Global Admin user account.
1. Use the following script to assign a user and role to an application:

    ```powershell
    # Assign the values to the variables
    $username = "<You user's UPN>"
    $app_name = "<Your App's display name>"
    $app_role_name = "<App role display name>"

    # Get the user to assign, and the service principal for the app to assign to
    $user = Get-AzureADUser -ObjectId "$username"
    $sp = Get-AzureADServicePrincipal -Filter "displayName eq '$app_name'"
    $appRole = $sp.AppRoles | Where-Object { $_.DisplayName -eq $app_role_name }

    # Assign the user to the app role
    New-AzureADUserAppRoleAssignment -ObjectId $user.ObjectId -PrincipalId $user.ObjectId -ResourceId $sp.ObjectId -Id $appRole.Id
    ```

For more information about how to assign a user to an application role, see the documentation for [New-AzureADUserAppRoleAssignment](https://docs.microsoft.com/powershell/module/azuread/new-azureaduserapproleassignment?view=azureadps-2.0).

To assign a group to an enterprise app, you must replace `Get-AzureADUser` with `Get-AzureADGroup` and replace `New-AzureADUserAppRoleAssignment` with `New-AzureADGroupAppRoleAssignment`.

For more information about how to assign a group to an application role, see the documentation for [New-AzureADGroupAppRoleAssignment](https://docs.microsoft.com/powershell/module/azuread/new-azureadgroupapproleassignment?view=azureadps-2.0).

### Example

This example assigns the user Britta Simon to the [Microsoft Workplace Analytics](https://products.office.com/business/workplace-analytics) application using PowerShell.

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

## Related articles

- [Learn more about end-user access to applications](end-user-experiences.md)
- [Plan an Azure AD access panel deployment](access-panel-deployment-plan.md)
- [Managing access to apps](what-is-access-management.md)
 
## Next steps

- [See all of my groups](../fundamentals/active-directory-groups-view-azure-portal.md)
- [Remove a user or group assignment from an enterprise app](remove-user-or-group-access-portal.md)
- [Disable user sign-ins for an enterprise app](disable-user-sign-in-portal.md)
- [Change the name or logo of an enterprise app](change-name-or-logo-portal.md)
