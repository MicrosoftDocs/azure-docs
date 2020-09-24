---
title: Understand scope for Azure RBAC
description: Learn about scope for Azure role-based access control (Azure RBAC) and how to determine the scope for a resource.
services: active-directory
author: rolyon
manager: mtillman
ms.service: role-based-access-control
ms.topic: how-to
ms.workload: identity
ms.date: 09/24/2020
ms.author: rolyon
---

# Understand scope for Azure RBAC

*Scope* is the set of resources that access applies to. When you assign a role, it's important to understand scope so that you can grant a security principal just the access that it really needs. By limiting the scope you limit what resources are at risk if the security principal is ever compromised.

## Overview

Azure provides four levels of scope for resource management. The following image shows an example of these levels.

![Scope for a role assignment](./media/shared/rbac-scope.png)

| Scope | Resource type |
| --- | --- |
| [Management group](../governance/management-groups/overview.md) | [Microsoft.Management/managementGroups](/rest/api/resources/managementgroups) |
| Subscription | [Microsoft.Resources/subscriptions](/rest/api/resources/subscriptions) |
| [Resource groups](../azure-resource-manager/management/overview.md#resource-groups) | [Microsoft.Resources/subscriptions/resourceGroups](/rest/api/resources/resourcegroups)
| Resource | &lt;varies&gt; |

You can assign roles at any of these levels of scope. The level you select determines how widely the role is applied. Lower levels inherit role permissions from higher levels. For example, when you assign a role at a subscription scope, the role is applied to all resource groups and resources in your subscription. When you assign a role at a resource group scope, the role is applied to the resource group and all its resources. However, another resource group doesn't have that role assignment.

## Scope format

If you create role assignments using the command line, you'll need to specify the scope. For command-line tools, scope is a potentially long string that identifies the exact scope of the role assignment.

The scope consists of a series of identifiers separated by the slash (/) character. You can think of this string as expressing the following hierarchy, where text without placeholders (`<>`) are fixed identifiers:

```
/subscriptions
    /<subscription_id>
        /resourcegroups
            /<resource_group_name>
                /providers
                    /<provider_ame>
                        /<resource_type>
                            /<resource_sub_type_1>
                                /<resource_sub_type_2>
                                    /<resource_name>
```

- `<subscription_id>` is the ID of the subscription to use (a GUID).
- `<resources_group_name>` is the name of the containing resource group.
- `<provider_name>` is the name of the resource provider that handles the resource, then `<resource_type>` and `<resource_sub_type_*>` identify further levels within that resource provider.
- `<resource_name>` is the last part of the string that identifies a specific resource.

Management groups are a level above subscriptions and have the broadest (least specific) scope. Role assignments at this level apply to a subscriptions within the management group. Each additional level of hierarchy makes the scope more specific. The scope for a management group has the following format:

```
/providers
    /<provider_name>
        /managementGroups
            /<managment_group_name>
```

## Scope examples

> [!div class="mx-tableFixed"]
> | Scope | Example |
> | --- | --- |
> | Management group | `/providers/Microsoft.Management/managementGroups/marketing-group` |
> | Subscription | `/subscriptions/00000000-0000-0000-0000-000000000000` |
> | Resource group | `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/Example-Storage-rg` |
> |  | `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/pharma-sales` |
> | Resource | `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/Example-Storage-rg/providers/Microsoft.Storage/storageAccounts/azurestorage12345/blobServices/default/containers/blob-container-01` |
> |  | `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyVirtualNetworkResourceGroup/providers/Microsoft.Network/virtualNetworks/MyVirtualNetwork12345` |

## How to determine the scope for a resource

It's fairly simple to determine the scope for a management group, subscription, or resource group. You just need to know the name and the subscription ID. However, determining the scope for a resource is a little more complicated. Here are a couple ways that you can determine the scope for a resource.

- Assign a role at the resource scope using the Azure portal and then use [Azure PowerShell](role-assignments-list-powershell.md) or [Azure CLI](role-assignments-list-cli.md) to list the role assignment. In the output, the scope will be listed as a property.

    ```azurepowershell
    RoleAssignmentId   : /subscriptions/<subscriptionId>/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/azurestorage12345/blobServices/default/containers/blob-container-01/pro
                         viders/Microsoft.Authorization/roleAssignments/<roleAssignmentId>
    Scope              : /subscriptions/<subscriptionId>/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/azurestorage12345/blobServices/default/containers/blob-container-01
    DisplayName        : User
    SignInName         : user@contoso.com
    RoleDefinitionName : Storage Blob Data Reader
    RoleDefinitionId   : 2a2b9908-6ea1-4ae2-8e65-a410df84e7d1
    ObjectId           : <principalId>
    ObjectType         : User
    CanDelegate        : False
    Description        :
    ConditionVersion   :
    Condition          :
    ```

    ```azurecli
    {
        "canDelegate": null,
        "condition": null,
        "conditionVersion": null,
        "description": null,
        "id": "/subscriptions/{subscriptionId}/resourceGroups/Example-Storage-rg/providers/Microsoft.Storage/storageAccounts/azurestorage12345/blobServices/default/containers/blob-container-01/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId}",
        "name": "{roleAssignmentId}",
        "principalId": "{principalId}",
        "principalName": "user@contoso.com",
        "principalType": "User",
        "resourceGroup": "test-rg",
        "roleDefinitionId": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
        "roleDefinitionName": "Storage Blob Data Reader",
        "scope": "/subscriptions/{subscriptionId}/resourceGroups/Example-Storage-rg/providers/Microsoft.Storage/storageAccounts/azurestorage12345/blobServices/default/containers/blob-container-01",
        "type": "Microsoft.Authorization/roleAssignments"
      }
    ```

- In the Azure portal, open the resource and then look at the properties. The resource might list the resource ID where you can determine the scope.

- View the [list of resource providers for services](../azure-resource-manager/management/azure-services-resource-providers.md) and [get information about the resource types](../azure-resource-manager/management/resource-providers-and-types.md). Based on this information, you can piece together some of the scope.

## Next steps

- [List Azure role assignments using the Azure portal](role-assignments-list-portal.md)
- [Add or remove Azure role assignments using the Azure portal](role-assignments-portal.md)
- [Organize your resources with Azure management groups](../governance/management-groups/overview.md)
