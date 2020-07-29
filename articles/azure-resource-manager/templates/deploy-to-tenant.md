---
title: Deploy resources to tenant
description: Describes how to deploy resources at the tenant scope in an Azure Resource Manager template.
ms.topic: conceptual
ms.date: 03/16/2020
---

# Create resources at the tenant level

As your organization matures, you may need to define and assign [policies](../../governance/policy/overview.md) or [role-based access controls](../../role-based-access-control/overview.md) across your Azure AD tenant. With tenant level templates, you can declaratively apply policies and assign roles at a global level.

## Supported resources

You can deploy the following resource types at the tenant level:

* [deployments](/azure/templates/microsoft.resources/deployments) - for nested templates that deploy to management groups or subscriptions.
* [managementGroups](/azure/templates/microsoft.management/managementgroups)
* [policyAssignments](/azure/templates/microsoft.authorization/policyassignments)
* [policyDefinitions](/azure/templates/microsoft.authorization/policydefinitions)
* [policySetDefinitions](/azure/templates/microsoft.authorization/policysetdefinitions)
* [roleAssignments](/azure/templates/microsoft.authorization/roleassignments)
* [roleDefinitions](/azure/templates/microsoft.authorization/roledefinitions)

### Schema

The schema you use for tenant deployments is different than the schema for resource group deployments.

For templates, use:

```json
https://schema.management.azure.com/schemas/2019-08-01/tenantDeploymentTemplate.json#
```

The schema for a parameter file is the same for all deployment scopes. For parameter files, use:

```json
https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#
```

## Required access

The principal deploying the template must have permissions to create resources at the tenant scope. The principal must have permission to execute the deployment actions (`Microsoft.Resources/deployments/*`) and to create the resources defined in the template. For example, to create a management group, the principal must have Contributor permission at the tenant scope. To create role assignments, the principal must have Owner permission.

The Global Administrator for the Azure Active Directory doesn't automatically have permission to assign roles. To enable template deployments at the tenant scope, the Global Administrator must do the following steps:

1. Elevate account access so the Global Administrator can assign roles. For more information, see [Elevate access to manage all Azure subscriptions and management Groups](../../role-based-access-control/elevate-access-global-admin.md).

1. Assign Owner or Contributor to the principal that needs to deploy the templates.

   ```azurepowershell-interactive
   New-AzRoleAssignment -SignInName "[userId]" -Scope "/" -RoleDefinitionName "Owner"
   ```

   ```azurecli-interactive
   az role assignment create --assignee "[userId]" --scope "/" --role "Owner"
   ```

The principal now has the required permissions to deploy the template.

## Deployment commands

The commands for tenant deployments are different than the commands for resource group deployments.

For Azure CLI, use [az deployment tenant create](/cli/azure/deployment/tenant?view=azure-cli-latest#az-deployment-tenant-create):

```azurecli-interactive
az deployment tenant create \
  --name demoTenantDeployment \
  --location WestUS \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/tenant-deployments/new-mg/azuredeploy.json"
```

For Azure PowerShell, use [New-AzTenantDeployment](/powershell/module/az.resources/new-aztenantdeployment).

```azurepowershell-interactive
New-AzTenantDeployment `
  -Name demoTenantDeployment `
  -Location "West US" `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/tenant-deployments/new-mg/azuredeploy.json"
```

For REST API, use [Deployments - Create Or Update At Tenant Scope](/rest/api/resources/deployments/createorupdateattenantscope).

## Deployment location and name

For tenant level deployments, you must provide a location for the deployment. The location of the deployment is separate from the location of the resources you deploy. The deployment location specifies where to store deployment data.

You can provide a name for the deployment, or use the default deployment name. The default name is the name of the template file. For example, deploying a template named **azuredeploy.json** creates a default deployment name of **azuredeploy**.

For each deployment name, the location is immutable. You can't create a deployment in one location when there's an existing deployment with the same name in a different location. If you get the error code `InvalidDeploymentLocation`, either use a different name or the same location as the previous deployment for that name.

## Use template functions

For tenant deployments, there are some important considerations when using template functions:

* The [resourceGroup()](template-functions-resource.md#resourcegroup) function is **not** supported.
* The [subscription()](template-functions-resource.md#subscription) function is **not** supported.
* The [reference()](template-functions-resource.md#reference) and [list()](template-functions-resource.md#list) functions are supported.
* Use the [tenantResourceId()](template-functions-resource.md#tenantresourceid) function to get the resource ID for resources that are deployed at tenant level.

  For example, to get the resource ID for a policy definition, use:

  ```json
  tenantResourceId('Microsoft.Authorization/policyDefinitions/', parameters('policyDefinition'))
  ```

  The returned resource ID has the following format:

  ```json
  /providers/{resourceProviderNamespace}/{resourceType}/{resourceName}
  ```

## Create management group

The [following template](https://github.com/Azure/azure-quickstart-templates/tree/master/tenant-deployments/new-mg) creates a management group.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/tenantDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "mgName": {
      "type": "string",
      "defaultValue": "[concat('mg-', uniqueString(newGuid()))]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Management/managementGroups",
      "apiVersion": "2019-11-01",
      "name": "[parameters('mgName')]",
      "properties": {
      }
    }
  ]
}
```

## Assign role

The [following template](https://github.com/Azure/azure-quickstart-templates/tree/master/tenant-deployments/tenant-role-assignment) assigns a role at the tenant scope.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/tenantDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "principalId": {
      "type": "string",
      "metadata": {
        "description": "principalId if the user that will be given contributor access to the resourceGroup"
      }
    },
    "roleDefinitionId": {
      "type": "string",
      "defaultValue": "8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
      "metadata": {
        "description": "roleDefinition for the assignment - default is owner"
      }
    }
  },
  "variables": {
    // This creates an idempotent guid for the role assignment
    "roleAssignmentName": "[guid('/', parameters('principalId'), parameters('roleDefinitionId'))]"
  },
  "resources": [
    {
      "name": "[variables('roleAssignmentName')]",
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2019-04-01-preview",
      "properties": {
        "roleDefinitionId": "[tenantResourceId('Microsoft.Authorization/roleDefinitions', parameters('roleDefinitionId'))]",
        "principalId": "[parameters('principalId')]",
        "scope": "/"
      }
    }
  ]
}
```

## Next steps

* To learn about assigning roles, see [Manage access to Azure resources using RBAC and Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md).
* You can also deploy templates at [subscription level](deploy-to-subscription.md) or [management group level](deploy-to-management-group.md).
