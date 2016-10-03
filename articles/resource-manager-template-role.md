<properties
   pageTitle="Resource Manager template for role assignments | Microsoft Azure"
   description="Shows the Resource Manager schema for deploying a role assignment through a template."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="timlt"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/03/2016"
   ms.author="tomfitz"/>

# Role assignments template schema

Assigns a user, group, or service principal to a role at a specified scope.

## Resource format

To create a role assignment, add the following schema to the resources section of your template.
    
    {
        "type": string,
        "apiVersion": "2015-07-01",
        "name": string,
        "dependsOn": [ array values ],
        "properties":
        {
            "roleDefinitionId": string,
            "principalId": string,
            "scope": string
        }
    }

## Values

The following tables describe the values you need to set in the schema.

| Name | Required | Description |
| ---- | -------- | ----------- |
| type | Yes    | The resource type to create.<br /><br /> For resource group:<br />**Microsoft.Authorization/roleAssignments**<br /><br />For resource:<br />**{provider-namespace}/{resource-type}/providers/roleAssignments** |
| apiVersion |Yes | The API version to use for creating the resource.<br /><br /> Use **2015-07-01**. | 
| name | Yes | A globally-unique identifier for the new role assignment. |
| dependsOn | No | A comma-separated array of a resource names or resource unique identifiers.<br /><br />The collection of resources this role assignment depends on. If assigning a role that scoped to a resource and that resource is deployed in the same template, include that resource name in this element to ensure the resource is deployed first. |
| properties | Yes | The properties object that identifies the role definition, principal, and scope. |

### properties object

| Name | Required | Description |
| ---- | -------- | ----------- |
| roleDefinitionId | Yes |  The identifier of an existing role definition to be used in the role assignment.<br /><br /> Use the following format:<br /> **/subscriptions/{subscription-id}/providers/Microsoft.Authorization/roleDefinitions/{role-definition-id}** |
| principalId | Yes | The globally unique identifier for an existing principal. This value maps to the id inside the directory and can point to a user, service principal, or security group. |
| scope | No | The scope at which this role assignment applies to.<br /><br />For resource groups, use:<br />**/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}**  <br /><br />For resources, use:<br />**/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{provider-namespace}/{resource-type}/{resource-name}** |  |


## How to use the role assignment resource

You add a role assignment to your template when you need to add a user, group, or service principal to a role during deployment. Role assignments are inherited from higher levels of scope, so if you have already added a principal to a role at the subscription level, you do not need to reassign it for the resource group or resource.

There are many identifier values you need to provide when working with role assignments. You can retrieve the values through PowerShell or Azure CLI.

### PowerShell

The name of role assignment requires a globally unique identifier. You can generate a new identifier for **name** with:

    $name = [System.Guid]::NewGuid().toString()

You can retrieve the identifier for role definition with:

    $roledef = (Get-AzureRmRoleDefinition -Name Reader).id

You can retrieve the identifier for the principal with one of the following commands.

For a group named **Auditors**:

    $principal = (Get-AzureRmADGroup -SearchString Auditors).id

For a user named **exampleperson**:

    $principal = (Get-AzureRmADUser -SearchString exampleperson).id

For a service principal named **exampleapp**:

    $principal = (Get-AzureRmADServicePrincipal -SearchString exampleapp).id 

### Azure CLI

You can retrieve the identifier for role definition with:

    azure role show Reader --json | jq .[].Id -r

You can retrieve the identifier for the principal with one of the following commands.

For a group named **Auditors**:

    azure ad group show --search Auditors --json | jq .[].objectId -r

For a user named **exampleperson**:

    azure ad user show --search exampleperson --json | jq .[].objectId -r

For a service principal named **exampleapp**:

    azure ad sp show --search exampleapp --json | jq .[].objectId -r

## Examples

The following template receives an identifier for a role and an identifier for a user, group, or service principal. It assigns the role at the resource group level.

    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "roleDefinitionId": {
                "type": "string"
            },
            "roleAssignmentId": {
                "type": "string"
            },
            "principalId": {
                "type": "string"
            }
        },
        "resources": [
            {
              "type": "Microsoft.Authorization/roleAssignments",
              "apiVersion": "2015-07-01",
              "name": "[parameters('roleAssignmentId')]",
              "properties":
              {
                "roleDefinitionId": "[concat(subscription().id, '/providers/Microsoft.Authorization/roleDefinitions/', parameters('roleDefinitionId'))]",
                "principalId": "[parameters('principalId')]",
                "scope": "[concat(subscription().id, '/resourceGroups/', resourceGroup().name)]"
              }
            }
        ],
        "outputs": {}
    }



The next template creates a storage account and assigns the reader role to the storage account. The identifiers for two groups and the reader role have been included in the template to simplify deployment. Those values could be retrieved at deployment time through in script and passed in as parameters.

    {
      "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "roleName": {
          "type": "string"
        },
        "groupToAssign": {
          "type": "string",
          "allowedValues": [
            "Auditors",
            "Limited"
          ]
        }
      },
      "variables": {
        "readerRole": "[concat('/subscriptions/',subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7')]",
        "storageName": "[concat('storage', uniqueString(resourceGroup().id))]",
        "scope": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Storage/storageAccounts/', variables('storageName'))]",
        "Auditors": "1c272299-9729-462a-8d52-7efe5ece0c5c",
        "Limited": "7c7250f0-7952-441c-99ce-40de5e3e30b5",
        "fullRoleName": "[concat(variables('storageName'), '/Microsoft.Authorization/', parameters('roleName'))]"
      },
      "resources": [
        {
          "apiVersion": "2016-01-01",
          "type": "Microsoft.Storage/storageAccounts",
          "name": "[variables('storageName')]",
          "location": "[resourceGroup().location]",
          "sku": {
            "name": "Standard_LRS"
          },
          "kind": "Storage",
          "tags": {
            "displayName": "MyStorageAccount"
          },
          "properties": {}
        },
        {
          "type": "Microsoft.Storage/storageAccounts/providers/roleAssignments",
          "apiVersion": "2015-07-01",
          "name": "[variables('fullRoleName')]",
          "dependsOn": [
            "[variables('storageName')]"
          ],
          "properties": {
            "roleDefinitionId": "[variables('readerRole')]",
            "principalId": "[variables(parameters('groupToAssign'))]"
          }
        }
      ]
    }

## Quickstart templates

The following templates show how to use the role assignment resource:

- [Assign built-in role to resource group](https://azure.microsoft.com/documentation/templates/101-rbac-builtinrole-resourcegroup)
- [Assign built-in role to existing VM](https://azure.microsoft.com/documentation/templates/101-rbac-builtinrole-virtualmachine)
- [Assign built-in role to multiple existing VMs](https://azure.microsoft.com/documentation/templates/201-rbac-builtinrole-multipleVMs)

## Next steps

- For information about the template structure, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
- For more information about role-based access control, see [Azure Active Directory Role-based Access Control](./active-directory/role-based-access-control-configure.md).
