---
title: Manage the scope of roles with administrative units (preview) - Azure AD | Microsoft Docs
description: Using administrative units for more granular delegation of permissions in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.topic: article
ms.subservice: users-groups-roles
ms.workload: identity
ms.date: 03/05/2020
ms.author: curtand
ms.reviewer: elkuzmen
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---
# Manage the scope of roles with administrative units in Azure Active Directory (preview)

Administrative units can be useful in organizations with independent divisions. Consider the example of a large university that is made up of many autonomous schools (School of Business, School of Engineering, and so on) that each has their own IT administrators who control access, manage users, and set policies for their school. A central administrator could create an administrative unit for the School of Business and populate it with only the business school students and staff. Then the central administrator can add the Business school IT staff to a scoped role that grants administrative permissions over only Azure AD users in the business school administrative unit.

Before administrative units (AUs), all Azure AD admin roles had to be assigned organization-wide. Someone in the Helpdesk Administrator role, for example, could reset passwords for any (non-admin) user in the Azure AD organization.

Administrative units allow you to grant admin permissions that are restricted to a department, region, or other segment of your organization that you define. For example, delegating to regional support specialists the [Helpdesk Administrator](directory-assign-admin-roles.md#helpdesk-administrator) role restricted to managing just the users in the region they support.


Creating and managing administrative units themselves is available at no additional charge. Using administrative units to scope directory role assignments requires Azure Active Directory Premium 1 licenses for administrators and Azure Active Directory Basic licenses for administrative unit members.

## Scope of document

This document is intended to be a quick reference to the functionality available in Administrative Units private preview. The document does not cover the detailed steps of how generic tasks like resetting a password, assigning a license etc. are done. Refer to the official Azure AD documentation for detailed information on general tasks.
Outside this document, please refer to the following:

- Working with Admin Units: How to work with administrative units using PowerShell
- Administrative Unit Graph support: Detail documentation on Graph APIs available for administrative units. 

## Roles available

Role  |  Description
----- |  -----------
Authentication Administrator  |  Has access to view, set, and reset authentication method information for any non-admin user in the assigned administrative unit only.
Groups Administrator  |  Can manage all aspects of groups and groups settings like naming and expiration policies in the assigned administrative unit only.
Helpdesk Administrator  |  Can reset passwords for non-administrators and Helpdesk administrators in the assigned administrative unit only.
License Administrator  |  Can assign, remove and update license assignments within the administrative unit only.
Password Administrator  |  Can reset passwords for non-administrators and Password Administrators within the assigned administrative unit only.
User Administrator  |  Can manage all aspects of users and groups, including resetting passwords for limited admins within the assigned administrative unit only.

- Authentication Administrator
- Groups Administrator
- Helpdesk Administrator
- License Administrator
- Password Administrator
- User Administrator

## Currently supported functions

Global administrators or Privileged Role Administrators can use the Azure AD portal to create administrative units, add users as members of administrative units, and then assign IT staff to administrative unit-scoped administrator roles. The administrative unit-scoped admins can then use the Office 365 portal for basic management of users in their administrative units.

Additionally, groups can be added as members of administrative unit, administrative unit scoped groups administrator can manage them using PowerShell, the Microsoft Graph, and the Azure AD portal.

The below table describes current support for administrative unit scenarios.
     MS Graph API/PowerShell 
Azure AD Portal     M365 Admin Center

### Administrative unit management

    Creating and deleting administrative units     Supported     Supported     No plan to support 
    Adding and removing administrative unit members individually     Supported     Supported     No plan to support 
    Bulk adding and removing administrative unit members using .csv file     Not supported     Supported     No plan to support 
    Assigning administrative unit-scoped administrators     Supported     Supported     No plan to support 
    Adding and removing administrative unit members dynamically based on attributes     Future improvement     Future improvement     No plan to support 

### User management

    administrative unit-scoped management of user properties, passwords, licenses     Supported     Supported    Supported 
    administrative unit-scoped blocking and unblocking of user sign-ins     Supported     Supported     Supported 
    administrative unit-scoped management of user MFA credentials     Supported    Supported    Future improvement 
    administrative unit-scoped viewing of user sign-in reports     Future improvement    Future improvement    Future improvement 
    administrative unit-scoped creating and deleting users     Future improvement     Future improvement     Future improvement 

### Group management

    administrative unit-scoped management of group properties and members     Supported     Supported    Future improvement 
    administrative unit-scoped management of group licensing     Supported    Supported    Future improvement 
    administrative unit-scoped creating and deleting groups     Future improvement     Future improvement     Future improvement 

### Additional areas

    administrative unit-scoped device management     Future improvement     Future improvement     Future improvement 
    administrative unit-scoped application management     Future improvement     Future improvement     Future improvement 

administrative units are only for scoping management permissions. They do not prevent members or administrators from browsing other users, groups, or resources outside of the Administrative Unit. In the Office 365 portal, users outside of an administrative unit-scoped admin's administrative units are filtered out for convenience. They are still able to browse other users in the Azure AD portal, PowerShell, and other Microsoft services. These permissions are part of the [default user permissions](../fundamentals/users-default-permissions.md).

## Getting started

### Planning your Administrative Units

Administrative Units can be used to logically group resources that belong together. For example, for an organization whose IT department is scattered globally, it might make sense to create administrative units that define those geographical boundaries. In another scenario where a multi-national organization has different "sub-organizations", that are semi-autonomous in operations, each sub-organization may be represented by an administrative unit.

The criteria on which administrative units are created will be guided by the unique requirements of an organization. Key point to consider is that the criteria should make sense across M365 services. You can get maximum value out of administrative units when you can associate related groups across M365 under an administrative unit.

You can expect the creation of administrative units in the organization to go through the following stages:

1. Initial Adoption: Your organization will start creating administrative units based on initial criteria and #of administrative units will increase as the criteria is refined.
    Pruning: Once the criteria is well defined, certain administrative units that are no longer required will be deleted.
1. Stabilization: In this stage you can expect that your organizational structure is well defined and the #of administrative units is not going to increase / decrease significantly in short amount of time.

## How-to references

Note:

1. Portal refers to (https://ms.portal.azure.com/?microsoft_aad_iam_adminunitprivatepreview=true&microsoft_aad_iam_rbacv2=true#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/AdminUnit) 
1. To run queries given below via Graph Explorer, please ensure the following:

    1. Go to Azure AD in the portal, and then in the applications select Graph Explorer and provide admin consent to Graph Explorer.
    1. In the Graph Explorer (https://aka.ms/ge), ensure that you have selected the beta version.

1.    Please use the preview version of Azure AD PowerShell. Detailed instructions are here.

### Create an Administrative Unit

#### Azure portal

1. Go to Active Directory in the portal and select Administrative Units in the left panel

1. Select Add and a right pane will slide where you can provide the name of the administrative unit and optionally can write the description for the administrative unit
1. Select Add to finalize the create step.

#### PowerShell

Please install Azure AD PowerShell (preview version) before trying to perform the actions below:

    Connect-AzureAD
    New-AzureADAdministrativeUnit -Description "West Coast region" -DisplayName "West Coast"

The values highlighted above can be modified as required as required.

The Microsoft Graph

    Http Request
    POST /administrativeUnits
    Request body
    {
        "displayName": "North America Operations",
        "description": "North America Operations administration"
    }

### Adding users to administrative units

#### Azure portal

You can assign users to administrative units in two ways.

1. Individual assignment

    1. You can go to the Azure AD in the portal and select Users and select the user to be assigned to an administrative unit. You can then select Administrative units in the left panel. The user can be assigned to one or more administrative units by clicking on Assign to administrative unit and selecting the administrative units to which the user needs to be assigned.
    1. You can go to Azure AD in the portal and select Administrative units in the left pane and then select the administrative unit in which the users need to be assigned. Select All users on the left pane and then select Add member. You can then go ahead and select one or more users to be assigned to the administrative unit from the right pane.

1. Bulk assignment
    Go to Azure AD in the portal and select Administrative units. Select the administrative unit in which users need to be added. Proceed by clicking on All users -> Add members from .csv file. You can then download the CSV template and edit the file. The format is simple and needs a single UPN to be added in each line. Once the file is ready, save it at an appropriate location and then upload it in step 3 as highlighted in the snapshot.

#### PowerShell

    $administrative unitObj = Get-AzureADAdministrativeUnit -Filter "displayname eq 'Test administrative unit 2'"
    $UserObj = Get-AzureADUser -Filter "UserPrincipalName eq 'billjohn@fabidentity.onmicrosoft.com'"
    Add-AzureADAdministrativeUnitMember -ObjectId $administrative unitObj.ObjectId -RefObjectId $UserObj.ObjectId

In the above example, the cmdlet Add-AzureADAdministrativeUnitMember is used to add the user to the administrative unit. The object ID of the Administrative Unit to which user is to be added and the object ID of the user which needs to be added are taken as argument. The highlighted section may be changed as required for the specific environment.

#### Graph API

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

### Adding groups to administrative units

#### Azure portal

In the preview, you can assign groups only individually to an administrative unit. There is no option of bulk assignment of groups to an administrative unit. You can assign a group to an administrative unit in one of the two ways in portal:

1. From the **Azure AD > Groups** page

    Open the Groups overview page in Azure AD and select the group that needs to be assigned to the administrative unit. On the left side, select **Administrative units** to list out the administrative units the group is assigned to. On the top you will find the option Assign to administrative unit and clicking on it will give a panel on right side to choose the administrative unit.
  
1. From the **Azure AD > Administrative units > All Groups** page
    Open the All Groups blade in Azure AD > Administrative Units. If there are groups already assigned to the administrative unit, they will be displayed on the right side. Select **Add** on the top and a right panel will slide in listing the groups available in your Azure AD organization. Select one or more groups to be assigned to the administrative units.

#### PowerShell

    $administrative unitObj = Get-AzureADAdministrativeUnit -Filter "displayname eq 'Test administrative unit 2'"
    $GroupObj = Get-AzureADGroup -Filter "displayname eq 'TestGroup'"
    Add-AzureADAdministrativeUnitMember -ObjectId $administrative unitObj.ObjectId -RefObjectId $GroupObj.ObjectId

In this example, the cmdlet Add-AzureADAdministrativeUnitMember is used to add the group to the administrative unit. The object ID of the Administrative Unit to which user is to be added and the object ID of the group which needs to be added are taken as argument. The highlighted section may be changed as required for the specific environment.

#### Graph API

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

### Scoping administrators on Administrative Units

#### Azure portal

Go to **Azure AD > Administrative** units in the portal. Select the administrative unit over which you want to assign the role to a user. On the left pane, select Roles and administrators to list all the available roles.

Select the role to be assigned and then select **Add assignments**. This will slide open a panel on the right where you can select one or more users to be assigned to the role.

#### PowerShell

    $administrative unitObj = Get-AzureADAdministrativeUnit -Filter "displayname eq 'Test administrative unit 2'"
    $AdminUser = Get-AzureADUser -ObjectId 'janedoe@fabidentity.onmicrosoft.com'
    $uaRoleMemberInfo = New-Object -TypeName Microsoft.Open.AzureAD.Model.RoleMemberInfo -Property @{ObjectId = $AdminUser.ObjectId}
    Add-AzureADScopedRoleMembership -RoleObjectId $UserAdminRole.ObjectId -ObjectId $administrative unitObj.ObjectId -RoleMemberInfo  $uaRoleMemberInfo

The highlighted section may be changed as required for the specific environment.

#### Graph API

<add info>

### Deleting an administrative unit

#### Azure portal

Go to **Azure AD > Administrative units** in the portal. Select the administrative unit to be deleted and then select **Delete**. After confirming **Yes**, the administrative unit will be deleted.

#### PowerShell

    $delau = Get-AzureADAdministrativeUnit -Filter "displayname eq 'DeleteMe Admin Unit'"
    Remove-AzureADAdministrativeUnit -ObjectId $delau.ObjectId

The highlighted section may be changed as required for the specific environment.

#### Graph API

    HTTP request
    DELETE /administrativeUnits/{Admin id}
    Request body
    {}

### Listing users in an administrative unit

#### Azure portal

In the portal, there are two ways to list the users in an administrative unit:

1. Users blade in Azure AD
    Go to **Azure AD > Users** blade. On the right side, you would find a (makeshift) option to select an administrative unit. Select **Choose an administrative unit** and a panel will slide on right. You can now select an administrative unit and the user list will be filtered down to the members of the selected administrative unit.

1. Administrative units blade in Azure AD
    Go to **Azure AD > Administrative units** in the portal. Select the administrative unit for which you want to list the users. By default, **All users** is selected already on the left panel and on the right you will find the list of users who are member of the selected administrative unit.

#### PowerShell

    $administrative unitObj = Get-AzureADAdministrativeUnit -Filter "displayname eq 'Test administrative unit 2'"
    Get-AzureADAdministrativeUnitMember -ObjectId $administrative unitObj.ObjectId

This will help you get all the members of the administrative unit. If you want to display all the users in the administrative unit scope, you can use the below code snippet:

    foreach ($member in (Get-AzureADAdministrativeUnitMember -ObjectId $administrative unitObj.ObjectId)) 
    {
    if($member.ObjectType -eq "User")
    {
    Get-AzureADUser -ObjectId $member.ObjectId
    }
    }

#### Graph API

    HTTP request
    GET /administrativeUnits/{Admin id}/members/$/microsoft.graph.user
    Request body
    {}

### Listing groups in an administrative unit

#### Azure portal

Go to **Azure AD > Administrative units** in the portal. Select the administrative unit for which you want to list the users. By default, **All users** is selected already on the left panel. Select **All groups** and on the right you will find the list of groups which are member of the selected administrative unit.

#### PowerShell

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

#### Graph API

    HTTP request
    GET /administrativeUnits/{Admin id}/members/$/microsoft.graph.group
    Request body
    {}

### Listing the scoped administrators in an administrative unit

#### Azure portal

All the role assignments done on an administrative unit level can be viewed in the Administrative units section in Azure AD. Go to **Azure AD > Administrative units** in the portal. Select the administrative unit for which you want to list the role assignments. Select the **Roles and administrators**

#### PowerShell

    $administrative unitObj = Get-AzureADAdministrativeUnit -Filter "displayname eq 'Test administrative unit 2'"
    Get-AzureADScopedRoleMembership -ObjectId $administrative unitObj.ObjectId | fl *

The highlighted section may be changed as required for the specific environment.

#### Graph API

    Http request
    GET /administrativeUnits/{id}/scopedRoleMembers
    Request body
    {}

## Next steps

[Azure Active Directory license plans](../fundamentals/active-directory-whatis.md)
