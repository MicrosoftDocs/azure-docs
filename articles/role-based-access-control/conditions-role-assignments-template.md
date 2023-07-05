---
title: Add Azure role assignment conditions using Azure Resource Manager templates - Azure ABAC
description: Learn how to add attribute-based access control (ABAC) conditions in Azure role assignments using Azure Resource Manager templates and Azure role-based access control (Azure RBAC).
services: active-directory
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: how-to
ms.workload: identity
ms.custom: devx-track-arm-template
ms.date: 10/24/2022
ms.author: rolyon
---

# Add Azure role assignment conditions using Azure Resource Manager templates

An [Azure role assignment condition](conditions-overview.md) is an additional check that you can optionally add to your role assignment to provide more fine-grained access control. For example, you can add a condition that requires an object to have a specific tag to read the object. This article describes how to add conditions for your role assignments using Azure Resource Manager templates.

## Prerequisites

You must use the following versions:

- `2020-03-01-preview` or later
- `2020-04-01-preview` or later if you want to utilize the `description` property for role assignments
- `2022-04-01` is the first stable version

For more information about the prerequisites to add role assignment conditions, see [Conditions prerequisites](conditions-prerequisites.md).

## Add a condition

The following template shows how to assign the [Storage Blob Data Reader](built-in-roles.md#storage-blob-data-reader) role with a condition. The condition checks whether the container name equals 'blobs-example-container'.

To use the template, you must specify the following input:

- The ID of a user, group, managed identity, or application to assign the role to.
- The type of principal, such as `User`, `Group`, or `ServicePrincipal`. For more information, see [New service principal](role-assignments-template.md#new-service-principal).

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "principalId": {
            "type": "string",
            "metadata": {
                "description": "Principal ID to assign the role to"
            }
        },
        "principalType": {
            "type": "string",
            "metadata": {
                "description": "Type of principal"
            }
        },
        "roleAssignmentGuid": {
            "type": "string",
            "defaultValue": "[newGuid()]",
            "metadata": {
                "description": "New GUID used to identify the role assignment"
            }
        }
    },
    "variables": {
        "StorageBlobDataReader": "[concat(subscription().Id, '/providers/Microsoft.Authorization/roleDefinitions/2a2b9908-6ea1-4ae2-8e65-a410df84e7d1')]" // ID for Storage Blob Data Reader role, but can be any valid role ID
    },
    "resources": [
        {
            "name": "[parameters('roleAssignmentGuid')]",
            "type": "Microsoft.Authorization/roleAssignments",
            "apiVersion": "2022-04-01", // API version to call the role assignment PUT.
            "properties": {
                "roleDefinitionId": "[variables('StorageBlobDataReader')]",
                "principalId": "[parameters('principalId')]",
                "principalType": "[parameters('principalType')]",
                "description": "Role assignment condition created with an ARM template",
                "condition": "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'blobs-example-container'))", // Role assignment condition
                "conditionVersion": "2.0"
            }
        }
    ]
}
```

The scope of the role assignment is determined from the level of the deployment. Here are example [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) and [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create) commands for how to start the deployment at a resource group scope.

```azurepowershell
New-AzResourceGroupDeployment -ResourceGroupName example-group -TemplateFile rbac-test.json -principalId $principalId -principalType "User"
```

```azurecli
az deployment group create --resource-group example-group --template-file rbac-test.json --parameters principalId=$principalId principalType="User"
```

## Next steps

- [Example Azure role assignment conditions for Blob Storage](../storage/blobs/storage-auth-abac-examples.md)
- [Troubleshoot Azure role assignment conditions](conditions-troubleshoot.md)
- [Assign Azure roles using Azure Resource Manager templates](role-assignments-template.md)
