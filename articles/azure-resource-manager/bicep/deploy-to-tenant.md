---
title: Use Bicep to deploy resources to tenant
description: Describes how to deploy resources at the tenant scope in a Bicep file.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/23/2023
---

# Tenant deployments with Bicep file

As your organization matures, you may need to define and assign [policies](../../governance/policy/overview.md) or [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) across your Azure AD tenant. With tenant level templates, you can declaratively apply policies and assign roles at a global level.

### Training resources

If you would rather learn about deployment scopes through step-by-step guidance, see [Deploy resources to subscriptions, management groups, and tenants by using Bicep](/training/modules/deploy-resources-scopes-bicep/).

## Supported resources

Not all resource types can be deployed to the tenant level. This section lists which resource types are supported.

For Azure role-based access control (Azure RBAC), use:

* [roleAssignments](/azure/templates/microsoft.authorization/roleassignments)

For nested templates that deploy to management groups, subscriptions, or resource groups, use:

* [deployments](/azure/templates/microsoft.resources/deployments)

For creating management groups, use:

* [managementGroups](/azure/templates/microsoft.management/managementgroups)

For creating subscriptions, use:

* [aliases](/azure/templates/microsoft.subscription/aliases)

For managing costs, use:

* [billingProfiles](/azure/templates/microsoft.billing/billingaccounts/billingprofiles)
* [billingRoleAssignments](/azure/templates/microsoft.billing/billingaccounts/billingroleassignments)
* [instructions](/azure/templates/microsoft.billing/billingaccounts/billingprofiles/instructions)
* [invoiceSections](/azure/templates/microsoft.billing/billingaccounts/billingprofiles/invoicesections)
* [policies](/azure/templates/microsoft.billing/billingaccounts/billingprofiles/policies)

For configuring the portal, use:

* [tenantConfigurations](/azure/templates/microsoft.portal/tenantconfigurations)

Built-in policy definitions are tenant-level resources, but you can't deploy custom policy definitions at the tenant. For an example of assigning a built-in policy definition to a resource, see [tenantResourceId example](./bicep-functions-resource.md#tenantresourceid).

## Set scope

To set the scope to tenant, use:

```bicep
targetScope = 'tenant'
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
  --template-file main.bicep
```

# [PowerShell](#tab/azure-powershell)

For Azure PowerShell, use [New-AzTenantDeployment](/powershell/module/az.resources/new-aztenantdeployment).

```azurepowershell-interactive
New-AzTenantDeployment `
  -Name demoTenantDeployment `
  -Location "West US" `
  -TemplateFile main.bicep
```

---

For more detailed information about deployment commands and options for deploying ARM templates, see:

* [Deploy resources with ARM templates and Azure CLI](deploy-cli.md)
* [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md)
* [Deploy ARM templates from Cloud Shell](deploy-cloud-shell.md)

## Deployment location and name

For tenant level deployments, you must provide a location for the deployment. The location of the deployment is separate from the location of the resources you deploy. The deployment location specifies where to store deployment data. [Subscription](deploy-to-subscription.md) and [management group](deploy-to-management-group.md) deployments also require a location. For [resource group](deploy-to-resource-group.md) deployments, the location of the resource group is used to store the deployment data.

You can provide a name for the deployment, or use the default deployment name. The default name is the name of the template file. For example, deploying a file named _main.bicep_ creates a default deployment name of **main**.

For each deployment name, the location is immutable. You can't create a deployment in one location when there's an existing deployment with the same name in a different location. For example, if you create a tenant deployment with the name **deployment1** in **centralus**, you can't later create another deployment with the name **deployment1** but a location of **westus**. If you get the error code `InvalidDeploymentLocation`, either use a different name or the same location as the previous deployment for that name.

## Deployment scopes

When deploying to a tenant, you can deploy resources to:

* the tenant
* management groups within the tenant
* subscriptions
* resource groups

An [extension resource](scope-extension-resources.md) can be scoped to a target that is different than the deployment target.

The user deploying the template must have access to the specified scope.

This section shows how to specify different scopes. You can combine these different scopes in a single template.

### Scope to tenant

Resources defined within the Bicep file are applied to the tenant.

```bicep
targetScope = 'tenant'

// create resource at tenant
resource mgName_resource 'Microsoft.Management/managementGroups@2021-04-01' = {
  ...
}
```

### Scope to management group

To target a management group within the tenant, add a [module](modules.md). Use the [managementGroup function](bicep-functions-scope.md#managementgroup) to set its `scope` property. Provide the management group name.

```bicep
targetScope = 'tenant'

param managementGroupName string

// create resources at management group level
module  'module.bicep' = {
  name: 'deployToMG'
  scope: managementGroup(managementGroupName)
}
```

### Scope to subscription

To target a subscription within the tenant, add a module. Use the [subscription function](bicep-functions-scope.md#subscription) to set its `scope` property. Provide the subscription ID.

```bicep
targetScope = 'tenant'

param subscriptionID string

// create resources at subscription level
module  'module.bicep' = {
  name: 'deployToSub'
  scope: subscription(subscriptionID)
}
```

### Scope to resource group

To target a resource group within the tenant, add a module. Use the [resourceGroup function](bicep-functions-scope.md#resourcegroup) to set its `scope` property. Provide the subscription ID and resource group name.

```bicep
targetScope = 'tenant'

param resourceGroupName string
param subscriptionID string

// create resources at resource group level
module  'module.bicep' = {
  name: 'deployToRG'
  scope: resourceGroup(subscriptionID, resourceGroupName)
}
```

## Create management group

The following template creates a management group.

```bicep
targetScope = 'tenant'
param mgName string = 'mg-${uniqueString(newGuid())}'

resource mgName_resource 'Microsoft.Management/managementGroups@2021-04-01' = {
  name: mgName
  properties: {}
}
```

If your account doesn't have permission to deploy to the tenant, you can still create management groups by deploying to another scope. For more information, see [Management group](deploy-to-management-group.md#management-group).

## Assign role

The following template assigns a role at the tenant scope.

```bicep
targetScope = 'tenant'

@description('principalId of the user that will be given contributor access to the resourceGroup')
param principalId string

@description('roleDefinition for the assignment - default is owner')
param roleDefinitionId string = '8e3af657-a8ff-443c-a75c-2fe8c4bcb635'

var roleAssignmentName = guid(principalId, roleDefinitionId)

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: roleAssignmentName
  properties: {
    roleDefinitionId: tenantResourceId('Microsoft.Authorization/roleDefinitions', roleDefinitionId)
    principalId: principalId
  }
}
```

## Next steps

To learn about other scopes, see:

* [Resource group deployments](deploy-to-resource-group.md)
* [Subscription deployments](deploy-to-subscription.md)
* [Management group deployments](deploy-to-management-group.md)
