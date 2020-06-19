---
title: Add, remove, and list users in an administrative unit (preview) - Azure Active Directory | Microsoft Docs
description: Manage users and their role permissions in an administrative unit in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.topic: how-to
ms.subservice: users-groups-roles
ms.workload: identity
ms.date: 04/16/2020
ms.author: curtand
ms.reviewer: anandy
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---

# Add and manage users in an administrative unit in Azure Active Directory

In Azure Active Directory (Azure AD), you can add users to an administrative unit (AU) for more granular administrative scope of control.

For steps to prepare to use PowerShell and Microsoft Graph for administrative unit management, see [Get started](roles-admin-units-manage.md#get-started).

## Add users to an AU

### Azure portal

You can assign users to administrative units in two ways.

1. Individual assignment

    1. You can go to the Azure AD in the portal and select Users and select the user to be assigned to an administrative unit. You can then select Administrative units in the left panel. The user can be assigned to one or more administrative units by clicking on Assign to administrative unit and selecting the administrative units where the user is to be assigned.

       ![select Add and then enter a name for the administrative unit](./media/roles-admin-units-add-manage-users/assign-users-individually.png)

    1. You can go to Azure AD in the portal and select Administrative units in the left pane and then select the administrative unit where the users is to be assigned. Select All users on the left pane and then select Add member. You can then go ahead and select one or more users to be assigned to the administrative unit from the right pane.

        ![select an administrative unit and then select Add member](./media/roles-admin-units-add-manage-users/assign-to-admin-unit.png)

1. Bulk assignment

    Go to Azure AD in the portal and select Administrative units. Select the administrative unit where users are to be added. Proceed by clicking on All users -> Add members from .csv file. You can then download the CSV template and edit the file. The format is simple and needs a single UPN to be added in each line. Once the file is ready, save it at an appropriate location and then upload it in step 3 as highlighted in the snapshot.

    ![bulk assign users to an administrative unit](./media/roles-admin-units-add-manage-users/bulk-assign-to-admin-unit.png)

### PowerShell

    $administrativeunitObj = Get-AzureADAdministrativeUnit -Filter "displayname eq 'Test administrative unit 2'"
    $UserObj = Get-AzureADUser -Filter "UserPrincipalName eq 'billjohn@fabidentity.onmicrosoft.com'"
    Add-AzureADAdministrativeUnitMember -ObjectId $administrativeunitObj.ObjectId -RefObjectId $UserObj.ObjectId

In the above example, the cmdlet Add-AzureADAdministrativeUnitMember is used to add the user to the administrative unit. The object ID of the administrative unit where user is to be added and the object ID of the user who is to be added are taken as argument. The highlighted section may be changed as required for the specific environment.

### Microsoft Graph

    Http request
    POST /administrativeUnits/{Admin Unit id}/members/$ref
    Request body
    {
      "@odata.id":"https://graph.microsoft.com/beta/users/{id}"
    }

Example:

    {
      "@odata.id":"https://graph.microsoft.com/beta/users/johndoe@fabidentity.com"
    }

## List administrative units for a user

### Azure portal

In the Azure portal you can open a user's profile by going to Azure AD > Users. Click on the user to open the user's profile.

![Open a user's profile in Azure Active Directory](./media/roles-admin-units-add-manage-users/user-profile-admin-units.png)

Select **Administrative units** on the left panel to see the list of administrative units where the user has been assigned.

![List the administrative units for a user](./media/roles-admin-units-add-manage-users/list-user-admin-units.png)

### PowerShell

    Get-AzureADAdministrativeUnit | where { Get-AzureADAdministrativeUnitMember -ObjectId $_.ObjectId | where {$_.ObjectId -eq $userObjId} }

### Microsoft Graph

    https://graph.microsoft.com/beta/users//memberOf/$/Microsoft.Graph.AdministrativeUnit

## Remove a single user from an AU

### Azure portal

There are two ways you can remove a user from an administrative unit. In the Azure portal you can open a user's profile by going to **Azure AD** > **Users**. Select the user to open the user's profile. Select the administrative unit you want the user to be removed from and select **Remove from administrative unit**.

![Remove a user from an administrative unit from the user profile](./media/roles-admin-units-add-manage-users/user-remove-admin-units.png)

You can also remove a user in **Azure AD** > **Administrative units** by selecting the administrative unit you want to remove users from. Select the user and select **Remove member**.
  
![Remove a user at the administrative unit level](./media/roles-admin-units-add-manage-users/admin-units-remove-user.png)

### PowerShell

    Remove-AzureADAdministrativeUnitMember -ObjectId $auId -MemberId $memberUserObjId

### Microsoft Graph

   https://graph.microsoft.com/beta/administrativeUnits/<adminunit-id>/members/<user-id>/$ref

## Bulk remove more than one user

You can go to Azure AD > Administrative units and select the administrative unit you want to remove users from. Click on Bulk remove member. Download the CSV template for providing the list of users to be removed.

Edit the downloaded CSV template with the relevant user entries. Do not remove the first two rows of the template. Add one user UPN in each row.

![Edit the CSV file for bulk user removal from administrative units](./media/roles-admin-units-add-manage-users/bulk-user-entries.png)

Once you have saved the entries in the file, upload the file, select **Submit**.

![Submit the bulk upload file](./media/roles-admin-units-add-manage-users/bulk-user-remove.png)

## Next steps

- [Assign a role to an administrative unit](roles-admin-units-assign-roles.md)
- [Add groups to an administrative unit](roles-admin-units-add-manage-groups.md)
