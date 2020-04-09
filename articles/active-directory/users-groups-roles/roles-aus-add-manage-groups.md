---
title: Add, remove, and list groups in an administrative unit (preview) - Azure Active Directory | Microsoft Docs
description: Manage groups and their role permissions in an administrative unit in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.topic: article
ms.subservice: users-groups-roles
ms.workload: identity
ms.date: 04/09/2020
ms.author: curtand
ms.reviewer: anandy
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---

# Add and manage groups in administrative units in Azure Active Directory

In Azure Active Directory (Azure AD), you can add groups to an administrative unit (AU) for more granular administrative scope of control.

For steps to prepare to use PowerShell and Microsoft Graph for administrative unit management, see [Getting started](roles-aus-manage-admin-units.md#getting-started).

## Add groups to an AU

### Azure portal

In the preview, you can assign groups only individually to an administrative unit. There is no option of bulk assignment of groups to an administrative unit. You can assign a group to an administrative unit in one of the two ways in portal:

1. From the **Azure AD > Groups** page

    Open the Groups overview page in Azure AD and select the group that needs to be assigned to the administrative unit. On the left side, select **Administrative units** to list out the administrative units the group is assigned to. On the top you will find the option Assign to administrative unit and clicking on it will give a panel on right side to choose the administrative unit.

    ![assign a group individually to an administrative unit](./media/roles-administrative-units-scope/assign-to-group-1.png)

1. From the **Azure AD > Administrative units > All Groups** page

    Open the All Groups blade in Azure AD > Administrative Units. If there are groups already assigned to the administrative unit, they will be displayed on the right side. Select **Add** on the top and a right panel will slide in listing the groups available in your Azure AD organization. Select one or more groups to be assigned to the administrative units.

    ![select an administrative unit and then select Add member](./media/roles-administrative-units-scope/assign-to-admin-unit.png)

### PowerShell

    $administrative unitObj = Get-AzureADAdministrativeUnit -Filter "displayname eq 'Test administrative unit 2'"
    $GroupObj = Get-AzureADGroup -Filter "displayname eq 'TestGroup'"
    Add-AzureADAdministrativeUnitMember -ObjectId $administrative unitObj.ObjectId -RefObjectId $GroupObj.ObjectId

In this example, the cmdlet Add-AzureADAdministrativeUnitMember is used to add the group to the administrative unit. The object ID of the Administrative Unit to which user is to be added and the object ID of the group which needs to be added are taken as argument. The highlighted section may be changed as required for the specific environment.

### Graph API

    Http request
    POST /administrativeUnits/{Admin Unit id}/members/$ref

    Request body
    {
      "@odata.id":"https://graph.microsoft.com/beta/groups/{id}"
    }

Example:

    {
      "@odata.id":"https://graph.microsoft.com/beta/users/ 871d21ab-6b4e-4d56-b257-ba27827628f3"
    }

## List groups in an AU

### Azure portal

Go to **Azure AD > Administrative units** in the portal. Select the administrative unit for which you want to list the users. By default, **All users** is selected already on the left panel. Select **All groups** and on the right you will find the list of groups which are member of the selected administrative unit.

![Select an administrative unit to delete](./media/roles-administrative-units-scope/list-groups-in-admin-units.png)

### PowerShell

    $administrative unitObj = Get-AzureADAdministrativeUnit -Filter "displayname eq 'Test administrative unit 2'"
    Get-AzureADAdministrativeUnitMember -ObjectId $administrative unitObj.ObjectId

This will help you get all the members of the administrative unit. If you want to display all the groups which are members of the administrative unit, you can use the below code snippet:

    foreach ($member in (Get-AzureADAdministrativeUnitMember -ObjectId $administrative unitObj.ObjectId)) 
    {
    if($member.ObjectType -eq "Group")
    {
    Get-AzureADGroup -ObjectId $member.ObjectId
    }
    }

### Graph API

    HTTP request
    GET /administrativeUnits/{Admin id}/members/$/microsoft.graph.group
    Request body
    {}

## List AUs for a group

### Azure portal

In the Azure portal you can open a group's details by going to Azure AD > Groups. Click on the group to open the group's details. On the left panel, select Administrative units to list all the administrative units to which the group is assigned.
 
(list_group_au.png)

### PowerShell

### Graph

## Remove a group from an AU

### Azure portal
There are two ways you can remove a group from an administrative unit. In the Azure portal you can open a group's details by going to Azure AD > Groups. Open the group that is to be removed from administrative unit. Click on Administrative units in the left panel to list all the administrative units the group is assigned to. Select the administrative unit you want the group to be removed from and click on Remove from administrative unit.
 
(group_au_remove.png)
Alternatively, you can go to Azure AD > Administrative units and select the administrative unit from which the group is to be removed. Click on Groups in the left panel to list the member groups. Select the group to be removed from the administrative unit and then click on Remove groups.

 
(au_remove_group.png)

### PowerShell

### Graph 

## Next steps

- [Assign a role to an administrative unit](roles-aus-assign-role.md)
- [Manage users in an administrative unit](roles-aus-add-manage-users.md)
