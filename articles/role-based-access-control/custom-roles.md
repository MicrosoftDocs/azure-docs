---
title: Create custom roles for Azure RBAC | Microsoft Docs
description: Learn how to define custom roles with Azure Role-Based Access Control for more precise identity management in your Azure subscription.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: e4206ea9-52c3-47ee-af29-f6eef7566fa5
ms.service: role-based-access-control
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/12/2018
ms.author: rolyon
ms.reviewer: rqureshi
ms.custom: H1Hack27Feb2017
---

# Custom roles in Azure

If the [built-in roles](built-in-roles.md) don't meet the specific needs of your organization, you can create your own custom roles. Just like built-in roles, you can assign custom roles to users, groups, and service principals at subscription, resource group, and resource scopes. Custom roles are stored in an Azure Active Directory (Azure AD) tenant and can be shared across subscriptions. Each tenant can have up to 2000 custom roles. Custom roles can be created using Azure PowerShell, Azure CLI, or the REST API.

## Steps to create a custom role

1. Determine the required permissions

    When you create a custom role, you need to know the resource provider operations that are available. To view the list of operations, you can use the [Get-AzureRMProviderOperation](/powershell/module/azurerm.resources/get-azurermprovideroperation) or [az provider operation list](/cli/azure/provider/operation#az-provider-operation-list) commands.
    To create the permissions you want, you'll add the operations to the `actions` or `notActions` sections of the [role definition](role-definitions.md). If you have data operations, you add those to the `dataActions` or `notDataActions` sections.

2. Create the custom role

    Depending on the language that you use, there are different ways to create a custom role. Typically, you start with a built-in role and then modify it for your needs. When you use PowerShell, you can also create a custom role from scratch.

3. Test the custom role

    Once you created the custom role, you need to test the custom role works as you expect. If adjustments need to be made, you can update the custom role.

## How are custom roles different than built-in roles?

Custom roles are essentially the same as built-in roles, but there are a couple of differences. Just like built-in roles, the `assignableScopes` section specifies the scopes that the role is available for assignment. However, You can't use the root scope (`"/"`) in your own custom roles. If you try, you will get an authorization error. The `assignableScopes` section for a custom role also controls who can create, delete, modify, or view the custom role.

<!-- Do custom roles support management groups? -->

| Task | Operation | Description |
| --- | --- | --- |
| Create/delete a custom role | `Microsoft.Authorization/ roleDefinition/write` | Users that are granted this operation on all the `assignableScopes` of the custom role can create (or delete) custom roles for use in those scopes. For example, [Owners](built-in-roles.md#owner) and [User Access Administrators](built-in-roles.md#user-access-administrator) of subscriptions, resource groups, and resources. |
| Modify a custom role | `Microsoft.Authorization/ roleDefinition/write` | Users that are granted this operation on all the `assignableScopes` of the custom role can modify custom roles in those scopes. For example, [Owners](built-in-roles.md#owner) and [User Access Administrators](built-in-roles.md#user-access-administrator) of subscriptions, resource groups, and resources. |
| View a custom role | `Microsoft.Authorization/ roleDefinition/read` | Users that are granted this operation at a scope can view the custom roles that are available for assignment at that scope. All built-in roles allow custom roles to be available for assignment. |

## Next steps
- [Understand role definitions](role-definitions.md)
- [Tutorial: Create a custom role using Azure PowerShell](tutorial-custom-role-powershell.md)
- [Tutorial: Create a custom role using Azure CLI](tutorial-custom-role-cli.md)
