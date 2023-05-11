---
title: How to use Role-Based Access Control in Azure API Management | Microsoft Docs
description: Learn how to use the built-in roles and create custom roles in Azure API Management
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 02/15/2023
ms.author: danlep 
ms.custom: devx-track-azurepowershell

---
# How to use role-based access control in Azure API Management

Azure API Management relies on Azure role-based access control (Azure RBAC) to enable fine-grained access management for API Management services and entities (for example, APIs and policies). This article gives you an overview of the built-in and custom roles in API Management. For more information on access management in the Azure portal, see [Get started with access management in the Azure portal](../role-based-access-control/overview.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Built-in service roles

API Management currently provides three built-in roles and will add two more roles in the near future. These roles can be assigned at different scopes, including subscription, resource group, and individual API Management instance. For instance, if you assign the "API Management Service Reader" role to a user at the resource-group level, then the user has read access to all API Management instances inside the resource group. 

The following table provides brief descriptions of the built-in roles. You can assign these roles by using the Azure portal or other tools, including Azure [PowerShell](../role-based-access-control/role-assignments-powershell.md), [Azure CLI](../role-based-access-control/role-assignments-cli.md), and [REST API](../role-based-access-control/role-assignments-rest.md). For details about how to assign built-in roles, see [Assign Azure roles to manage access to your Azure subscription resources](../role-based-access-control/role-assignments-portal.md).

| Role          | Read access<sup>[1]</sup> | Write access<sup>[2]</sup> | Service creation, deletion, scaling, VPN, and custom domain configuration | Access to the legacy publisher portal | Description
| ------------- | ---- | ---- | ---- | ---- | ---- 
| API Management Service Contributor | ✓ | ✓ | ✓ | ✓ | Super user. Has full CRUD access to API Management services and entities (for example, APIs and policies). Has access to the legacy publisher portal. |
| API Management Service Reader | ✓ | | || Has read-only access to API Management services and entities. |
| API Management Service Operator | ✓ | | ✓ | | Can manage API Management services, but not entities.|

<sup>[1] Read access to API Management services and entities (for example, APIs and policies).</sup>

<sup>[2] Write access to API Management services and entities except the following operations: instance creation, deletion, and scaling; VPN configuration; and custom domain setup.</sup>


## Built-in workspace roles

API Management provides the following built-in roles for collaborators in [workspaces](workspaces-overview.md) in an API Management instance. 

A workspace collaborator must be assigned both a workspace-scoped role and a service-scoped role.


|Role  |Scope  |Description  |
|---------|---------|---------|
|API Management Workspace Contributor     |  workspace       | Can manage the workspace and view, but not modify its members. This role should be assigned on the workspace scope.        |
|API Management Workspace Reader     | workspace        | Has read-only access to entities in the workspace. This role should be assigned on the workspace scope.         |
|API Management Workspace API Developer      |   workspace      |   Has read access to entities in the workspace and read and write access to entities for editing APIs. This role should be assigned on the workspace scope.  |
|API Management Workspace API Product Manager     |  workspace       |   Has read access to entities in the workspace and read and write access to entities for publishing APIs. This role should be assigned on the workspace scope.  |
| API Management Service Workspace API Developer    | service    |   Has read access to tags and products and write access to allow: <br/><br/> ▪️ Assigning  APIs to products<br/> ▪️ Assigning tags to products and APIs<br/><br/> This role should be assigned on the service scope. |
|  API Management Service Workspace API Product Manager  | service    | Has the same access as API Management Service Workspace API Developer as well as read access to users and write access to allow assigning users to groups. This role should be assigned on the service scope.      |

 
## Custom roles

If none of the built-in roles meet your specific needs, custom roles can be created to provide more granular access management for API Management entities. For example, you can create a custom role that has read-only access to an API Management service, but only has write access to one specific API. To learn more about custom roles, see [Custom roles in Azure RBAC](../role-based-access-control/custom-roles.md). 

> [!NOTE]
> To be able to see an API Management instance in the Azure portal, a custom role must include the ```Microsoft.ApiManagement/service/read``` action.

When you create a custom role, it's easier to start with one of the built-in roles. Edit the attributes to add **Actions**, **NotActions**, or **AssignableScopes**, and then save the changes as a new role. The following example begins with the "API Management Service Reader" role and creates a custom role called "Calculator API Editor." You can assign the custom role at the scope of a specific API. Consequently, this role only has access to that API. 

```powershell
$role = Get-AzRoleDefinition "API Management Service Reader Role"
$role.Id = $null
$role.Name = 'Calculator API Contributor'
$role.Description = 'Has read access to Contoso APIM instance and write access to the Calculator API.'
$role.Actions.Add('Microsoft.ApiManagement/service/apis/write')
$role.Actions.Add('Microsoft.ApiManagement/service/apis/*/write')
$role.AssignableScopes.Clear()
$role.AssignableScopes.Add('/subscriptions/<Azure subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.ApiManagement/service/<APIM service instance name>/apis/<API name>')
New-AzRoleDefinition -Role $role
New-AzRoleAssignment -ObjectId <object ID of the user account> -RoleDefinitionName 'Calculator API Contributor' -Scope '/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.ApiManagement/service/<APIM service instance name>/apis/<API name>'
```

The [Azure Resource Manager resource provider operations](../role-based-access-control/resource-provider-operations.md#microsoftapimanagement) article contains the list of permissions that can be granted on the API Management level.

## Next steps

To learn more about role-based access control in Azure, see the following articles:
  * [Get started with access management in the Azure portal](../role-based-access-control/overview.md)
  * [Assign Azure roles to manage access to your Azure subscription resources](../role-based-access-control/role-assignments-portal.md)
  * [Custom roles in Azure RBAC](../role-based-access-control/custom-roles.md)
  * [Azure Resource Manager resource provider operations](../role-based-access-control/resource-provider-operations.md#microsoftapimanagement)
