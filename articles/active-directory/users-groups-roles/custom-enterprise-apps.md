---
title: Custom roles for enterprise app management permissions - Azure Active Directory | Microsoft Docs
description: Create and assign custom Azure AD custom roles with enterprise apps in Azure Active Directory
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: how-to
ms.date: 08/19/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Custom roles for enterprise app management permissions

This article explains how to create a custom role with permissions to manage enterprise app assignments for users and groups in Azure Active Directory (Azure AD). Custom permissions to manage user and group assignments. For the elements of roles assignments and the meaning of terms such as subtype, permission, and property set, see the [custom roles overview](roles-custom-overview.md). 

## Enterprise App role permissions

There are two enterprise app permissions discussed in this article:

* To read the user and group assignments, grant the `microsoft.directory/servicePrincipals/appRoleAssignedTo/read` permission
* To manage the user and group assignments, grant the `microsoft.directory/servicePrincipals/appRoleAssignedTo/update` permission

Granting the update permission results in the assignee being able to manage assignments of users and/or groups. The scope of user and/or group assignments can be granted for a single application or granted for all applications. If granted at an organization-wide level, the assignee can manage assignments for all applications. If made at an application level, the assignee can manage assignments for only the specified application.

Granting the update permission is done in two steps:

1. Create a custom role with permission `microsoft.directory/servicePrincipals/appRoleAssignedTo/update`
1. Grant users or groups permissions to manage user and group assignments to enterprise apps. This is when you can set the scope to the organization-wide level or to a single application.

## In the Azure AD admin center

### Create a new custom role

>[!NOTE]
> Custom roles are created and managed at an organization level and are available only from the organization blade.

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with Privileged Role administrator or Global administrator permissions in the Azure AD organization.
1. Select **Azure Active Directory**, select **Roles and administrators**, and then select **New custom role**.
1. On the **Basics** tab, provide "Manage user and group assignments" for the name of the role and "Grant permissions to manage user and group assignments" for the role description, and then select **Next**.
1. On the **Permissions** tab, enter "microsoft.directory/servicePrincipals/appRoleAssignedTo/update" in the search box, and then select the checkboxes next to the desired permissions, and then select **Next**.
1. On the **Review + create** tab, review the permissions and select **Create**.

 
### Assign the role to a user using the Azure AD portal

1. Sign in to the Azure AD admin center with Privileged role administrator or Global administrator permissions in your Azure AD organization.
1. Select Azure Active Directory and then select Roles and administrators.
1. Select the Application Registration Creator role and select Add assignment.
1. Select the desired user and click **Select** to add the user to the role.

Grant user and groups permissions to manage user and group assignments

* Add users to this newly created custom role.
* Navigate directly to the Roles and Administrators blade to assign permissions that will enable the assignee to manage the user and group assignments organization-wide.


 

 



Login as the assignee and navigate to an application’s users and groups blade to verify the Add user option is enabled

 
Search and add users or group 
 
Complete assignment of the selected user.
 

### Single app scope 
To grant permissions to assignee to manage users and groups for a specific resource, navigate to that resource first before clicking on Roles and Administrators blade. Complete the user/group assignment. The assignee will now have permissions to manage users and groups only for the specific resource.

## In Azure AD PowerShell

For more detail, see [Create and assign a custom role](roles-create-custom.md) and [Assign custom roles with resource scope using PowerShell](roles-assign-powershell.md).

First, install the Azure AD PowerShell module from [the PowerShell Gallery](https://www.powershellgallery.com/packages/AzureADPreview/2.0.0.17). Then import the Azure AD PowerShell preview module, using the following command:

```powershell
PowerShell
import-module azureadpreview
```

To verify that the module is ready to use, match the version returned by the following command to the one listed here:

```powershell
PowerShell
get-module azureadpreview
  ModuleType Version      Name                         ExportedCommands
  ---------- ---------    ----                         ----------------
  Binary     2.0.0.115    azureadpreview               {Add-AzureADAdministrati...}
```

### Create a custom role

Create a new role using the following PowerShell script:

```PowerShell
# Basic role information
$description = "Manage user and group assignments"
$displayName = "Can manage user and group assignments for Applications"
$templateId = (New-Guid).Guid

# Set of permissions to grant
$allowedResourceAction =@( "microsoft.directory/servicePrincipals/appRoleAssignedTo/update")
$resourceActions = @{'allowedResourceActions'= $allowedResourceAction}
$rolePermission = @{'resourceActions' = $resourceActions}
$rolePermissions = $rolePermission

# Create new custom admin role
$customRole = New-AzureADMSRoleDefinition -RolePermissions $rolePermissions -DisplayName $displayName -Description $description -TemplateId $templateId -IsEnabled $true
```

### Assign the custom role

Assign the role using this PowerShell script.

```powershell
PowerShell
# Basic role information

$description = "Manage user and group assignments"
$displayName = "Can manage user and group assignments for Applications"
$templateId = (New-Guid).Guid

# Set of permissions to grant
$allowedResourceAction =
@(
    "microsoft.directory/servicePrincipals/appRoleAssignedTo/update"
)
$resourceActions = @{'allowedResourceActions'= $allowedResourceAction}
$rolePermission = @{'resourceActions' = $resourceActions}
$rolePermissions = $rolePermission

# Create new custom role
$customRole = New-AzureAdRoleDefinition -RolePermissions $rolePermissions -DisplayName $displayName -Description $description -TemplateId $templateId -IsEnabled $true
```

## In the Microsoft Graph API

Create a custom role using the provided example in the Microsoft Graph API. For more detail, see [Create and assign a custom role](roles-create-custom.md) and [Assign custom admin roles using the Microsoft Graph API](roles-assign-graph.md).

HTTP request to create the custom role.

POST

HTTP
```http
https://graph.microsoft.com/beta/roleManagement/directory/roleDefinitionsIsEnabled $true
```

Body
HTTP
```http
{
    "description":"Can manage user and group assignments for Applications.",
    "displayName":" Manage user and group assignments",
    "isEnabled":true,
    "rolePermissions":
    [
        {
            "resourceActions":
            {
                "allowedResourceActions":
                [
                    "microsoft.directory/servicePrincipals/appRoleAssignedTo/update"
                ]
            },
            "condition":null
        }
    ],
    "templateId":"<PROVIDE NEW GUID HERE>",
    "version":"1"
}
```

### Assign the custom role using Microsoft Graph API

The role assignment combines a security principal ID (which can be a user or service principal), a role definition ID, and an Azure AD resource scope. For more information on the elements of a role assignment, see the [custom roles overview](roles-custom-overview.md)

HTTP request to assign a custom role.

POST

HTTP
```http
https://graph.microsoft.com/beta/roleManagement/directory/roleAssignments
```

Body

HTTP
```http
{
    "principalId":"<PROVIDE OBJECTID OF USER TO ASSIGN HERE>",
    "roleDefinitionId":"<PROVIDE OBJECTID OF ROLE DEFINITION HERE>",
    "resourceScopes":["/"]
}
```

