---
title: Deploy resources to tenant
description: Describes how to deploy resources at the tenant scope in an Azure Resource Manager template.
ms.topic: conceptual
ms.date: 10/22/2020
---

# Tenant deployments with ARM templates

As your organization matures, you may need to define and assign [policies](../../governance/policy/overview.md) or [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) across your Azure AD tenant. With tenant level templates, you can declaratively apply policies and assign roles at a global level.

## Supported resources

Not all resource types can be deployed to the tenant level. This section lists which resource types are supported.

For Azure Policies, use:

* [policyAssignments](/azure/templates/microsoft.authorization/policyassignments)
* [policyDefinitions](/azure/templates/microsoft.authorization/policydefinitions)
* [policySetDefinitions](/azure/templates/microsoft.authorization/policysetdefinitions)

For Azure role-based access control (Azure RBAC), use:

* [roleAssignments](/azure/templates/microsoft.authorization/roleassignments)

For nested templates that deploy to management groups, subscriptions, or resource groups, use:

* [deployments](/azure/templates/microsoft.resources/deployments)

For creating management groups, use:

* [managementGroups](/azure/templates/microsoft.management/managementgroups)

For managing costs, use:

* [billingProfiles](/azure/templates/microsoft.billing/billingaccounts/billingprofiles)
* [instructions](/azure/templates/microsoft.billing/billingaccounts/billingprofiles/instructions)
* [invoiceSections](/azure/templates/microsoft.billing/billingaccounts/billingprofiles/invoicesections)

## Schema

The schema you use for tenant deployments is different than the schema for resource group deployments.

For templates, use:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-08-01/tenantDeploymentTemplate.json#",
    ...
}
```

The schema for a parameter file is the same for all deployment scopes. For parameter files, use:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    ...
}
```

## Required access

The principal deploying the template must have permissions to create resources at the tenant scope. The principal must have permission to execute the deployment actions (`Microsoft.Resources/deployments/*`) and to create the resources defined in the template. For example, to create a management group, the principal must have Contributor permission at the tenant scope. To create role assignments, the principal must have Owner permission.

The Global Administrator for the Azure Active Directory doesn't automatically have permission to assign roles. To enable template deployments at the tenant scope, the Global Administrator must do the following steps:

1. Elevate account access so the Global Administrator can assign roles. For more information, see [Elevate access to manage all Azure subscriptions and management groups](../../role-based-access-control/elevate-access-global-admin.md).

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

# [Azure CLI](#tab/azure-cli)

For Azure CLI, use [az deployment tenant create](/cli/azure/deployment/tenant#az-deployment-tenant-create):

```azurecli-interactive
az deployment tenant create \
  --name demoTenantDeployment \
  --location WestUS \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/tenant-deployments/new-mg/azuredeploy.json"
```

# [PowerShell](#tab/azure-powershell)

For Azure PowerShell, use [New-AzTenantDeployment](/powershell/module/az.resources/new-aztenantdeployment).

```azurepowershell-interactive
New-AzTenantDeployment `
  -Name demoTenantDeployment `
  -Location "West US" `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/tenant-deployments/new-mg/azuredeploy.json"
```

---

For more detailed information about deployment commands and options for deploying ARM templates, see:

* [Deploy resources with ARM templates and Azure portal](deploy-portal.md)
* [Deploy resources with ARM templates and Azure CLI](deploy-cli.md)
* [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md)
* [Deploy resources with ARM templates and Azure Resource Manager REST API](deploy-rest.md)
* [Use a deployment button to deploy templates from GitHub repository](deploy-to-azure-button.md)
* [Deploy ARM templates from Cloud Shell](deploy-cloud-shell.md)

## Deployment scopes

When deploying to a management group, you can deploy resources to:

* the tenant
* management groups within the tenant
* subscriptions
* resource groups (through two nested deployments)
* [extension resources](scope-extension-resources.md) can be applied to resources

The user deploying the template must have access to the specified scope.

This section shows how to specify different scopes. You can combine these different scopes in a single template.

### Scope to tenant

Resources defined within the resources section of the template are applied to the tenant.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/default-tenant.json" highlight="5":::

### Scope to management group

To target a management group within the tenant, add a nested deployment and specify the `scope` property.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/tenant-to-mg.json" highlight="10,17,22":::

### Scope to subscription

You can also target subscriptions within the tenant. The user deploying the template must have access to the specified scope.

To target a subscription within the tenant, use a nested deployment and the `subscriptionId` property.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/tenant-to-subscription.json" highlight="10,18":::

## Deployment location and name

For tenant level deployments, you must provide a location for the deployment. The location of the deployment is separate from the location of the resources you deploy. The deployment location specifies where to store deployment data.

You can provide a name for the deployment, or use the default deployment name. The default name is the name of the template file. For example, deploying a template named **azuredeploy.json** creates a default deployment name of **azuredeploy**.

For each deployment name, the location is immutable. You can't create a deployment in one location when there's an existing deployment with the same name in a different location. If you get the error code `InvalidDeploymentLocation`, either use a different name or the same location as the previous deployment for that name.

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

* To learn about assigning roles, see [Add Azure role assignments using Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md).
* You can also deploy templates at [subscription level](deploy-to-subscription.md) or [management group level](deploy-to-management-group.md).
