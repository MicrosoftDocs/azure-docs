---
title: How to Use Role-Based Access Control in Azure API Management | Microsoft Docs
description: Learn how to use the built-in roles and create custom roles in Azure API Management
services: api-management
documentationcenter: ''
author: miaojiang
manager: erikre
editor: ''

ms.assetid: 364cd53e-88fb-4301-a093-f132fa1f88f5
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/30/2017
ms.author: apimpm

---

# How to Use Role-Based Access Control in Azure API Management
Azure API Management relies on Azure Role-Based Access Control (RBAC) to enable fine-grained access management for API Management services and entities (e.g., APIs, policies). This article gives you an overview of the built-in and custom roles in API Management. If you want more details on access management in the Azure portal, see [Get started with access management in the Azure portal](https://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-what-is/)

## Built-in Roles
API Management currently provides 3 built-in roles and will add 2 more roles in the near future. These roles can be assigned at differnt scopes including subscription, resource group, and individual API Management instance. For instance, if the "Azure API Management Service Reader" role is assigned to an user at the resource group level, then the user will have read access to all API Management instances inside the resource group. 

The following table provides brief descriptions of the built-in roles. You can assign these roles using the Azure Portal or other tools including Azure [PowerShell](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-manage-access-powershell), Azure [Command-line interface](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-manage-access-azure-cli), and [REST API](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-manage-access-rest). For details about how to assign built-in roles, see [Use role assignments to manage access to your Azure subscription resources](https://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-what-is/).

| Role          | Read access<sup>[1]</sup> | Write access<sup>[2]</sup> | Service creation, deletion, scaling, VPN and custom domain configuration | Access to legacy Publsiher Portal | Description
| ------------- | ---- | ---- | ---- | ---- | ---- | ---- |
| Azure API Management Service Contributor | ✓ | ✓ | ✓ | ✓ | Super user. Has full CRUD access to API Management services and entities (e.g., APIs, Policies). Has access to the legacy publisher portal. |
| Azure API Management Service Reader | ✓ | | || Has read-only access to API Management services and entities. |
| Azure API Management Service Operator | ✓ | | ✓ | | Can manage API Management services but not entities.|
| Azure API Management Service Editor<sup>*</sup> | ✓ | ✓ | |  | Can manage API Management entities but not services.|
| Azure API Management Content Manager<sup>*</sup> | ✓ | | | ✓ | Can manage developer portal. Read-only access to services and entities.|

<sup>[1] Read access to API Management services and entities (e.g., APIs, policies)</sup>

<sup>[2] Write access to API Management services and entities except following opeartions: 1) Instance creation, deletion, and scaling 2) VPN configuration  3) Custom domain name setup</sup>

<sup>\* The Service Editor role will be available after we migrate all admin UI from the existing publisher portal to the Azure portal. The Content Manager role will be available after the publisher portal is refactored to only contain functionalities related to managing the developer portal.</sup>  


## Custom Roles
If none of the built-in roles meet your specific needs, custom roles can be created to provide more granular access management for API Management entities. For example, you can create a custom role which has read-only access to an API Management service but only has write access to one specific API. To learn more details about custom roles, see [Custom Roles in Azure RBAC](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-custom-roles). 

When you create a custom role, it is easier to start with one of the built-in roles. Edit the attributes to add the Actions, NotActions, or AssignableScopes, then save the changes as a new role. The following example begins with the "Azure API Managment Service Reader" role and creates a custom role called "Calculator API Editor". The custom role can be assigned only to a specific API therefore will only has access to that API. 

```
$role = Get-AzureRmRoleDefinition "API Management Service Reader Role"
$role.Id = $null
$role.Name = 'Calculator API Contributor'
$role.Description = 'Has read access to Contoso APIM instance and write access to the Calculator API.'
$role.Actions.Add('Microsoft.ApiManagement/service/apis/write')
$role.AssignableScopes.Clear()
$role.AssignableScopes.Add('/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.ApiManagement/service/<service name>/apis/<api ID>')
New-AzureRmRoleDefinition -Role $role
New-AzureRmRoleAssignment -ObjectId <object ID of the user account> -RoleDefinitionName 'Calculator API Contributor' -Scope '/subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.ApiManagement/service/<service name>/apis/<api ID>'
```

## Watch a Video Overview

> [!VIDEO https://channel9.msdn.com/Blogs/AzureApiMgmt/Role-Based-Access-Control-in-API-Management/player]
> 
> 

## Next Steps

* Learn more about Role-Based Access Control in Azure
  * [Get started with access management in the Azure portal](https://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-what-is/)
  * [Use role assignments to manage access to your Azure subscription resources](https://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-what-is/)
  * [Custom Roles in Azure RBAC](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-custom-roles)
