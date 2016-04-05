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
   ms.date="04/05/2016"
   ms.author="tomfitz"/>

# Role assignments template schema

Assigns a user, group, or service principal to a role at a specified scope.

## Schema format

To create a role assignment, add the following schema to the resources section of your template.
    
    {
        "type": "Microsoft.Authorization/roleAssignments",
        "apiVersion": "2014-10-01-preview",
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

| Name | Value |
| ---- | ---- |
| type | Enum<br />Required<br />**Microsoft.Authorization/roleAssignments**<br /><br />The resource type to create. |
| apiVersion | Enum<br />Required<br />**2014-10-01-preview**<br /><br />The API version to use for creating the resource. |  
| name | String<br />Required<br />**Globally-unique identifier**<br /><br />An identifier for the new role assignment. |
| dependsOn | Array<br />Optional<br />A comma-separated list of a resource names or resource unique identifiers.<br /><br />The collection of resources this role assignment depends on. If assigning a role that scoped to a resource and that resource is deployed in the same template, include that resource name in this element to ensure the resource is deployed first. | 
| properties | Object<br />Required<br />[properties object](#properties)<br /><br />An object that identifies the role definition, princial, and scope. |  

<a id="properties" />
### properties object

| Name | Value |
| ------- | ---- |
| roleDefinitionId   | String<br />Required<br /> **/subscriptions/{subscription-id}/providers/Microsoft.Authorization/roleDefinitions/{role-definition-id}**<br /><br />The identifier of an existing role definition to be used in the role assignment. |
| principalId   | String<br />Required<br />**Globally-unique identifier**<br /><br />The identifier of an existing principal. This maps to the id inside the directory and can point to a user, service principal, or security group. |
| scope | String<br />Required<br />**/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}** (for resource groups) or<br />**/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{provider-namespace}/{resource-type}/{resource-name}** (for resources)<br /><br />The scope at which this role assignment applies to. |


## How to use the role assignment resource

You add a role assignment to your template when you need to add a user, group, or service principal to a role during deployment. Role assignments are inherited from higher levels of scope, so 
if you have already added a principal to a role at the subscription level, you do not need to re-assign it for the resource group or resource.

You can generate a new identifier for **name** with:

    PS C:\> $name = [System.Guid]::NewGuid().toString()

You can retrieve the globally-unique identifier for role definition with:

    PS C:\> $roledef = (Get-AzureRmRoleDefinition -Name Reader).id

You can retrieve the identifier for the principal with one of the following commands.

For a group named **Auditors**:

    PS C:\> $principal = (Get-AzureRmADGroup -SearchString Auditors).id

For a user named **exampleperson**:

    PS C:\> $principal = (Get-AzureRmADUser -SearchString exampleperson).id

For a service principal named **exampleapp**:

    PS C:\> $principal = (Get-AzureRmADServicePrincipal -SearchString exampleapp).id 
 

## Examples

The following example assigns a group to a role for the resource group.

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

## Quickstart templates

The following templates show how to use the role assignment resource:

- [Assign built-in role to resource group](https://azure.microsoft.com/documentation/templates/101-rbac-builtinrole-resourcegroup)
- [Assign built-in role to existing VM](https://azure.microsoft.com/documentation/templates/101-rbac-builtinrole-virtualmachine)
- [Assign built-in role to multiple existing VMs](https://azure.microsoft.com/documentation/templates/201-rbac-builtinrole-multipleVMs)

## Next steps

- For information about the template structure, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
- For more information about role-based access control, see [Azure Active Directory Role-based Access Control](active-directory/role-based-access-control-configure.md).
