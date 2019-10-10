---
title: Manage access to Azure resources using RBAC and Azure Resource Manager templates | Microsoft Docs
description: Learn how to manage access to Azure resources for users, groups, and applications using role-based access control (RBAC) and Azure Resource Manager templates.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.service: role-based-access-control
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/20/2019
ms.author: rolyon
ms.reviewer: bagovind
---
# Manage access to Azure resources using RBAC and Azure Resource Manager templates

[Role-based access control (RBAC)](overview.md) is the way that you manage access to Azure resources. In addition to using Azure PowerShell or the Azure CLI, you can manage access to Azure resources using [Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md). Templates can be helpful if you need to deploy resources consistently and repeatedly. This article describes how you can manage access using RBAC and templates.

## Create a role assignment at a resource group scope (without parameters)

In RBAC, to grant access, you create a role assignment. The following template shows a basic way to create a role assignment. Some values are specified within the template. The following template demonstrates:

-  How to assign the [Reader](built-in-roles.md#reader) role to a user, group, or application at a resource group scope

To use the template, you must do the following:

- Create a new JSON file and copy the template
- Replace `<your-principal-id>` with the unique identifier of a user, group, or application to assign the role to. The identifier has the format: `11111111-1111-1111-1111-111111111111`

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.Authorization/roleAssignments",
            "apiVersion": "2018-09-01-preview",
            "name": "[guid(resourceGroup().id)]",
            "properties": {
                "roleDefinitionId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', 'acdd72a7-3385-48ef-bd42-f606fba81ae7')]",
                "principalId": "<your-principal-id>"
            }
        }
    ]
}
```

Here are example [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) and [az group deployment create](/cli/azure/group/deployment#az-group-deployment-create) commands for how to start the deployment in a resource group named ExampleGroup.

```azurepowershell
New-AzResourceGroupDeployment -ResourceGroupName ExampleGroup -TemplateFile rbac-test.json
```

```azurecli
az group deployment create --resource-group ExampleGroup --template-file rbac-test.json
```

The following shows an example of the Reader role assignment to a user for a resource group after deploying the template.

![Role assignment at resource group scope](./media/role-assignments-template/role-assignment-template.png)

## Create a role assignment at a resource group or subscription scope

The previous template isn't very flexible. The following template uses parameters and can be used at different scopes. The following template demonstrates:

- How to assign a role to a user, group, or application at either a resource group or subscription scope
- How to specify the Owner, Contributor, and Reader roles as a parameter

To use the template, you must specify the following inputs:

- The unique identifier of a user, group, or application to assign the role to
- The role to assign
- A unique identifier that will be used for the role assignment, or you can use the default identifier

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
            "defaultValue": "[newGuid()]",
            "metadata": {
                "description": "A new GUID used to identify the role assignment"
            }
        }
    },
    "variables": {
        "Owner": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', '8e3af657-a8ff-443c-a75c-2fe8c4bcb635')]",
        "Contributor": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', 'b24988ac-6180-42a0-ab88-20f7382dd24c')]",
        "Reader": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', 'acdd72a7-3385-48ef-bd42-f606fba81ae7')]"
    },
    "resources": [
        {
            "type": "Microsoft.Authorization/roleAssignments",
            "apiVersion": "2018-09-01-preview",
            "name": "[parameters('roleNameGuid')]",
            "properties": {
                "roleDefinitionId": "[variables(parameters('builtInRoleType'))]",
                "principalId": "[parameters('principalId')]"
            }
        }
    ]
}
```

To get the unique identifier of a user to assign the role to, you can use the [Get-AzADUser](/powershell/module/az.resources/get-azaduser) or [az ad user show](/cli/azure/ad/user#az-ad-user-show) commands.

```azurepowershell
$userid = (Get-AzADUser -DisplayName "{name}").id
```

```azurecli
userid=$(az ad user show --upn-or-object-id "{email}" --query objectId --output tsv)
```

The scope of the role assignment is determined from the level of the deployment. Here are example [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) and [az group deployment create](/cli/azure/group/deployment#az-group-deployment-create) commands for how to start the deployment at a resource group scope.

```azurepowershell
New-AzResourceGroupDeployment -ResourceGroupName ExampleGroup -TemplateFile rbac-test.json -principalId $userid -builtInRoleType Reader
```

```azurecli
az group deployment create --resource-group ExampleGroup --template-file rbac-test.json --parameters principalId=$userid builtInRoleType=Reader
```

Here are example [New-AzDeployment](/powershell/module/az.resources/new-azdeployment) and [az deployment create](/cli/azure/deployment#az-deployment-create) commands for how to start the deployment at a subscription scope and specify the location.

```azurepowershell
New-AzDeployment -Location centralus -TemplateFile rbac-test.json -principalId $userid -builtInRoleType Reader
```

```azurecli
az deployment create --location centralus --template-file rbac-test.json --parameters principalId=$userid builtInRoleType=Reader
```

> [!NOTE]
> This template is not idempotent unless the same `roleNameGuid` value is provided as a parameter for each deployment of the template. If no `roleNameGuid` is provided, by default a new GUID is generated on each deployment and subsequent deployments will fail with a `Conflict: RoleAssignmentExists` error.

## Create a role assignment at a resource scope

If you need to create a role assignment at the level of a resource, the format of the role assignment is different. You provide the resource provider namespace and resource type of the resource to assign the role to. You also include the name of the resource in the name of the role assignment.

For the type and name of the role assignment, use the following format:

```json
"type": "{resource-provider-namespace}/{resource-type}/providers/roleAssignments",
"name": "{resource-name}/Microsoft.Authorization/{role-assign-GUID}"
```

The following template demonstrates:

- How to create a new storage account
- How to assign a role to a user, group, or application at the storage account scope
- How to specify the Owner, Contributor, and Reader roles as a parameter

To use the template, you must specify the following inputs:

- The unique identifier of a user, group, or application to assign the role to
- The role to assign

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
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]"
        }
    },
    "variables": {
        "Owner": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', '8e3af657-a8ff-443c-a75c-2fe8c4bcb635')]",
        "Contributor": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', 'b24988ac-6180-42a0-ab88-20f7382dd24c')]",
        "Reader": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', 'acdd72a7-3385-48ef-bd42-f606fba81ae7')]",
        "storageName": "[concat('storage', uniqueString(resourceGroup().id))]"
    },
    "resources": [
        {
            "apiVersion": "2019-04-01",
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[variables('storageName')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "Standard_LRS"
            },
            "kind": "Storage",
            "properties": {}
        },
        {
            "type": "Microsoft.Storage/storageAccounts/providers/roleAssignments",
            "apiVersion": "2018-09-01-preview",
            "name": "[concat(variables('storageName'), '/Microsoft.Authorization/', guid(uniqueString(parameters('storageName'))))]",
            "dependsOn": [
                "[variables('storageName')]"
            ],
            "properties": {
                "roleDefinitionId": "[variables(parameters('builtInRoleType'))]",
                "principalId": "[parameters('principalId')]"
            }
        }
    ]
}
```

To deploy the previous template, you use the resource group commands. Here are example [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) and [az group deployment create](/cli/azure/group/deployment#az-group-deployment-create) commands for how to start the deployment at a resource scope.

```azurepowershell
New-AzResourceGroupDeployment -ResourceGroupName ExampleGroup -TemplateFile rbac-test.json -principalId $userid -builtInRoleType Contributor
```

```azurecli
az group deployment create --resource-group ExampleGroup --template-file rbac-test.json --parameters principalId=$userid builtInRoleType=Contributor
```

The following shows an example of the Contributor role assignment to a user for a storage account after deploying the template.

![Role assignment at resource scope](./media/role-assignments-template/role-assignment-template-resource.png)

## Create a role assignment for a new service principal

If you create a new service principal and immediately try to assign a role to that service principal, that role assignment can fail in some cases. For example, if you create a new managed identity and then try to assign a role to that service principal in the same Azure Resource Manager template, the role assignment might fail. The reason for this failure is likely a replication delay. The service principal is created in one region; however, the role assignment might occur in a different region that hasn't replicated the service principal yet. To address this scenario, you should set the `principalType` property to `ServicePrincipal` when creating the role assignment.

The following template demonstrates:

- How to create a new managed identity service principal
- How to specify the `principalType`
- How to assign the Contributor role to that service principal at a resource group scope

To use the template, you must specify the following inputs:

- The base name of the managed identity, or you can use the default string

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "baseName": {
            "type": "string",
            "defaultValue": "msi-test"
        }
    },
    "variables": {
        "identityName": "[concat(parameters('baseName'), '-bootstrap')]",
        "bootstrapRoleAssignmentId": "[guid(concat(resourceGroup().id, 'contributor'))]",
        "contributorRoleDefinitionId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', 'b24988ac-6180-42a0-ab88-20f7382dd24c')]"
    },
    "resources": [
        {
            "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
            "name": "[variables('identityName')]",
            "apiVersion": "2018-11-30",
            "location": "[resourceGroup().location]"
        },
        {
            "type": "Microsoft.Authorization/roleAssignments",
            "apiVersion": "2018-09-01-preview",
            "name": "[variables('bootstrapRoleAssignmentId')]",
            "dependsOn": [
                "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', variables('identityName'))]"
            ],
            "properties": {
                "roleDefinitionId": "[variables('contributorRoleDefinitionId')]",
                "principalId": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', variables('identityName')), '2018-11-30').principalId]",
                "scope": "[resourceGroup().id]",
                "principalType": "ServicePrincipal"
            }
        }
    ]
}
```

Here are example [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) and [az group deployment create](/cli/azure/group/deployment#az-group-deployment-create) commands for how to start the deployment at a resource group scope.

```azurepowershell
New-AzResourceGroupDeployment -ResourceGroupName ExampleGroup2 -TemplateFile rbac-test.json
```

```azurecli
az group deployment create --resource-group ExampleGroup2 --template-file rbac-test.json
```

The following shows an example of the Contributor role assignment to a new managed identity service principal after deploying the template.

![Role assignment for a new managed identity service principal](./media/role-assignments-template/role-assignment-template-msi.png)

## Next steps

- [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](../azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal.md)
- [Understand the structure and syntax of Azure Resource Manager Templates](../azure-resource-manager/resource-group-authoring-templates.md)
- [Create resource groups and resources at the subscription level](../azure-resource-manager/deploy-to-subscription.md)
- [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?term=rbac)
