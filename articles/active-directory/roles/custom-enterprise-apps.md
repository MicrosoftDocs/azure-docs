---
title: Create custom roles to manage enterprise apps in Azure Active Directory
description: Create and assign custom Azure AD roles for enterprise apps access in Azure Active Directory
services: active-directory
author: rolyon
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: how-to
ms.date: 04/14/2021
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Create custom roles to manage enterprise apps in Azure Active Directory

This article explains how to create a custom role with permissions to manage enterprise app assignments for users and groups in Azure Active Directory (Azure AD). For the elements of roles assignments and the meaning of terms such as subtype, permission, and property set, see the [custom roles overview](custom-overview.md).

## Enterprise app role permissions

There are two enterprise app permissions discussed in this article. All examples use the update permission.

* To read the user and group assignments at scope, grant the `microsoft.directory/servicePrincipals/appRoleAssignedTo/read` permission
* To manage the user and group assignments at scope, grant the `microsoft.directory/servicePrincipals/appRoleAssignedTo/update` permission

Granting the update permission results in the assignee being able to manage assignments of users and groups to enterprise apps. The scope of user and/or group assignments can be granted for a single application or granted for all applications. If granted at an organization-wide level, the assignee can manage assignments for all applications. If made at an application level, the assignee can manage assignments for only the specified application.

Granting the update permission is done in two steps:

1. Create a custom role with permission `microsoft.directory/servicePrincipals/appRoleAssignedTo/update`
1. Grant users or groups permissions to manage user and group assignments to enterprise apps. This is when you can set the scope to the organization-wide level or to a single application.

## Use the Azure AD admin center

### Create a new custom role

>[!NOTE]
> Custom roles are created and managed at an organization-wide level and are available only from the organization's Overview page.

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with Privileged Role Administrator or Global Administrator permissions in your organization.
1. Select **Azure Active Directory**, select **Roles and administrators**, and then select **New custom role**.

    ![Add a new custom role from the roles list in Azure AD](./media/custom-enterprise-apps/new-custom-role.png)

1. On the **Basics** tab, provide "Manage user and group assignments" for the name of the role and "Grant permissions to manage user and group assignments" for the role description, and then select **Next**.

    ![Provide a name and description for the custom role](./media/custom-enterprise-apps/role-name-and-description.png)

1. On the **Permissions** tab, enter "microsoft.directory/servicePrincipals/appRoleAssignedTo/update" in the search box, and then select the checkboxes next to the desired permissions, and then select **Next**.

    ![Add the permissions to the custom role](./media/custom-enterprise-apps/role-custom-permissions.png)

1. On the **Review + create** tab, review the permissions and select **Create**.

    ![Now you can create the custom role](./media/custom-enterprise-apps/role-custom-create.png)

### Assign the role to a user using the Azure AD portal

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with Privileged Role administrator role permissions.
1. Select **Azure Active Directory** and then select **Roles and administrators**.
1. Select the **Grant permissions to manage user and group assignments** role.

    ![Open Roles and Administrators and search for the custom role](./media/custom-enterprise-apps/select-custom-role.png)

1. Select **Add assignment**, select the desired user, and then click **Select** to add role assignment to the user.

    ![Add a assignment for the custom role to the user](./media/custom-enterprise-apps/assign-user-to-role.png)

#### Assignment tips

* To grant permissions to assignees to manage users and group access for all enterprise apps organization-wide, start from the organization-wide **Roles and Administrators** list on the Azure AD **Overview** page for your organization.
* To grant permissions to assignees to manage users and group access for a specific enterprise app, go to that app in Azure AD and open in the **Roles and Administrators** list for that app. Select the new custom role and complete the user or group assignment. The assignees can manage users and group access only for the specific app.
* To test your custom role assignment, sign in as the assignee and open an application’s **Users and groups** page to verify that the **Add user** option is enabled.

    ![Verify the user permissions](./media/custom-enterprise-apps/verify-user-permissions.png)

## Use Azure AD PowerShell

For more detail, see [Create and assign a custom role](custom-create.md) and [Assign custom roles with resource scope using PowerShell](custom-assign-powershell.md).

First, install the Azure AD PowerShell module from [the PowerShell Gallery](https://www.powershellgallery.com/packages/AzureADPreview/2.0.0.17). Then import the Azure AD PowerShell preview module, using the following command:

```powershell
Import-Module -Name AzureADPreview
```

To verify that the module is ready to use, match the version returned by the following command to the one listed here:

```powershell
Get-Module -Name AzureADPreview
  ModuleType Version      Name                         ExportedCommands
  ---------- ---------    ----                         ----------------
  Binary     2.0.0.115    AzureADPreview               {Add-AzureADAdministrati...}
```

### Create a custom role

Create a new role using the following PowerShell script:

```PowerShell
# Basic role information
$description = "Manage user and group assignments"
$displayName = "Can manage user and group assignments for Applications"
$templateId = (New-Guid).Guid

# Set of permissions to grant
$allowedResourceAction = @("microsoft.directory/servicePrincipals/appRoleAssignedTo/update")
$resourceActions = @{'allowedResourceActions'= $allowedResourceAction}
$rolePermission = @{'resourceActions' = $resourceActions}
$rolePermissions = $rolePermission

# Create new custom admin role
$customRole = New-AzureADMSRoleDefinition -RolePermissions $rolePermissions -DisplayName $displayName -Description $description -TemplateId $templateId -IsEnabled $true
```

### Assign the custom role

Assign the role using this PowerShell script.

```powershell
# Get the user and role definition you want to link
$user = Get-AzureADUser -Filter "userPrincipalName eq 'chandra@example.com'"
$roleDefinition = Get-AzureADMSRoleDefinition -Filter "displayName eq 'Manage user and group assignments'"

# Get app registration and construct resource scope for assignment.
$appRegistration = Get-AzureADApplication -Filter "displayName eq 'My Filter Photos'"
$resourceScope = '/' + $appRegistration.objectId

# Create a scoped role assignment
$roleAssignment = New-AzureADMSRoleAssignment -ResourceScope $resourceScope -RoleDefinitionId $roleDefinition.Id -PrincipalId $user.objectId
```

## Use the Microsoft Graph API

Create a custom role using the provided example in the Microsoft Graph API. For more detail, see [Create and assign a custom role](custom-create.md) and [Assign custom admin roles using the Microsoft Graph API](custom-assign-graph.md).

HTTP request to create the custom role.

```HTTP
POST
https://graph.microsoft.com/beta/roleManagement/directory/roleDefinitionsIsEnabled $true
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

The role assignment combines a security principal ID (which can be a user or service principal), a role definition ID, and an Azure AD resource scope. For more information on the elements of a role assignment, see the [custom roles overview](custom-overview.md)

HTTP request to assign a custom role.

```HTTP
POST https://graph.microsoft.com/beta/roleManagement/directory/roleAssignments

{
    "principalId":"<PROVIDE OBJECTID OF USER TO ASSIGN HERE>",
    "roleDefinitionId":"<PROVIDE OBJECTID OF ROLE DEFINITION HERE>",
    "resourceScopes":["/"]
}
```

## Next steps

* [Explore the available custom role permissions for enterprise apps](custom-enterprise-app-permissions.md)
