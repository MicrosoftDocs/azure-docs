---
title: How to use Role-Based Access Control in Azure API Management | Microsoft Docs
description: Learn how to use the built-in roles and create custom roles in Azure API Management
services: api-management
documentationcenter: ''
author: vladvino
manager: erikre
editor: ''

ms.assetid: 364cd53e-88fb-4301-a093-f132fa1f88f5
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 06/20/2018
ms.author: apimpm

---
# How to use Role-Based Access Control in Azure API Management

Azure API Management relies on Azure Role-Based Access Control (RBAC) to enable fine-grained access management for API Management services and entities (for example, APIs and policies). This article gives you an overview of the built-in and custom roles in API Management. For more information on access management in the Azure portal, see [Get started with access management in the Azure portal](https://azure.microsoft.com/documentation/articles/role-based-access-control-what-is/).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Built-in roles

API Management currently provides three built-in roles and will add two more roles in the near future. These roles can be assigned at different scopes, including subscription, resource group, and individual API Management instance. For instance, if you assign the "API Management Service Reader" role to a user at the resource-group level, then the user has read access to all API Management instances inside the resource group. 

The following table provides brief descriptions of the built-in roles. You can assign these roles by using the Azure portal or other tools, including Azure [PowerShell](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-powershell), [Azure CLI](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-cli), and [REST API](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-rest). For details about how to assign built-in roles, see [Use role assignments to manage access to your Azure subscription resources](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal).

| Role          | Read access<sup>[1]</sup> | Write access<sup>[2]</sup> | Service creation, deletion, scaling, VPN, and custom domain configuration | Access to the legacy publisher portal | Description
| ------------- | ---- | ---- | ---- | ---- | ---- 
| API Management Service Contributor | ✓ | ✓ | ✓ | ✓ | Super user. Has full CRUD access to API Management services and entities (for example, APIs and policies). Has access to the legacy publisher portal. |
| API Management Service Reader | ✓ | | || Has read-only access to API Management services and entities. |
| API Management Service Operator | ✓ | | ✓ | | Can manage API Management services, but not entities.|
| API Management Service Editor<sup>*</sup> | ✓ | ✓ | |  | Can manage API Management entities, but not services.|
| API Management Content Manager<sup>*</sup> | ✓ | | | ✓ | Can manage the developer portal. Read-only access to services and entities.|

<sup>[1] Read access to API Management services and entities (for example, APIs and policies).</sup>

<sup>[2] Write access to API Management services and entities except the following operations: instance creation, deletion, and scaling; VPN configuration; and custom domain setup.</sup>

<sup>\* The Service Editor role will be available after we migrate all the admin UI from the existing publisher portal to the Azure portal. The Content Manager role will be available after the publisher portal is refactored to only contain functionality related to managing the developer portal.</sup>  

## Custom roles

If none of the built-in roles meet your specific needs, custom roles can be created to provide more granular access management for API Management entities. For example, you can create a custom role that has read-only access to an API Management service, but only has write access to one specific API. To learn more about custom roles, see [Custom roles in Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/custom-roles). 

> [!NOTE]
> To be able to see an API Management instance in the Azure portal, a custom role must include the ```Microsoft.ApiManagement/service/read``` action.

When you create a custom role, it's easier to start with one of the built-in roles. Edit the attributes to add **Actions**, **NotActions**, or **AssignableScopes**, and then save the changes as a new role. The following example begins with the "API Management Service Reader" role and creates a custom role called "Calculator API Editor." You can assign the custom role to a specific API. Consequently, this role only has access to that API. 

```powershell
$role = Get-AzRoleDefinition "API Management Service Reader Role"
$role.Id = $null
$role.Name = 'Calculator API Contributor'
$role.Description = 'Has read access to Contoso APIM instance and write access to the Calculator API.'
$role.Actions.Add('Microsoft.ApiManagement/service/apis/write')
$role.Actions.Add('Microsoft.ApiManagement/service/apis/*/write')
$role.AssignableScopes.Clear()
$role.AssignableScopes.Add('/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.ApiManagement/service/<service name>/apis/<api ID>')
New-AzRoleDefinition -Role $role
New-AzRoleAssignment -ObjectId <object ID of the user account> -RoleDefinitionName 'Calculator API Contributor' -Scope '/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.ApiManagement/service/<service name>/apis/<api ID>'
```

The [Azure Resource Manager resource provider operations](../role-based-access-control/resource-provider-operations.md#microsoftapimanagement) article contains the list of permissions that can be granted on the API Management level.

## Video


> [!VIDEO https://channel9.msdn.com/Blogs/AzureApiMgmt/Role-Based-Access-Control-in-API-Management/player]
>
>

## Next steps

To learn more about Role-Based Access Control in Azure, see the following articles:
  * [Get started with access management in the Azure portal](../role-based-access-control/overview.md)
  * [Use role assignments to manage access to your Azure subscription resources](../role-based-access-control/role-assignments-portal.md)
  * [Custom roles in Azure RBAC](../role-based-access-control/custom-roles.md)
  * [Azure Resource Manager resource provider operations](../role-based-access-control/resource-provider-operations.md#microsoftapimanagement)
