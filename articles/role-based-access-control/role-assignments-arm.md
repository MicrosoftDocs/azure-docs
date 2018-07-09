---
title: Manage access using RBAC and Azure Resource Manager templates | Microsoft Docs
description: Learn how to manage access for users, groups, and applications using role-based access control (RBAC) and Azure Resource Manager templates.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: 3483ee01-8177-49e7-b337-4d5cb14f5e32
ms.service: role-based-access-control
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 07/06/2018
ms.author: rolyon
ms.reviewer: bagovind
---
# Manage access using RBAC and Azure Resource Manager templates

[Role-based access control (RBAC)](overview.md) is the way that you manage access to resources in Azure. This article describes how you manage access for users, groups, and applications using RBAC and Azure Resource Manager templates.

## Prerequisites

To manage access, you one of the following need:

* [Bash in Azure Cloud Shell](/azure/cloud-shell/overview)
* [Azure CLI](/cli/azure)

## Grant access

In RBAC, to grant access, you create a role assignment.

### Create a role assignment at a resource group scope

To create a role assignment at a resource group scope, use [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create):

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "principalId": {
      "type": "string",
      "metadata": {
        "description": "The principal to assign the role to"
      }
    },
    "builtInRoleType": {
      "type": "string",
      "allowedValues": [
        "Owner",
        "Contributor",
        "Reader"
      ],
      "metadata": {
        "description": "Built-in role to assign"
      }
    },
    "roleNameGuid": {
      "type": "string",
      "metadata": {
        "description": "A new GUID used to identify the role assignment"
      }
    }
  },
  "variables": {
    "Owner": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', '8e3af657-a8ff-443c-a75c-2fe8c4bcb635')]",
    "Contributor": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', 'b24988ac-6180-42a0-ab88-20f7382dd24c')]",
    "Reader": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', 'acdd72a7-3385-48ef-bd42-f606fba81ae7')]",
    "scope": "[resourceGroup().id]"
  },
  "resources": [
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2017-05-01",
      "name": "[parameters('roleNameGuid')]",
      "properties": {
        "roleDefinitionId": "[variables(parameters('builtInRoleType'))]",
        "principalId": "[parameters('principalId')]",
        "scope": "[variables('scope')]"
      }
    }
  ]
}
```

## Next steps

- [Tutorial: Create a custom role using Azure CLI](tutorial-custom-role-cli.md)
- [Use the Azure CLI to manage Azure resources and resource groups](../azure-resource-manager/xplat-cli-azure-resource-manager.md)