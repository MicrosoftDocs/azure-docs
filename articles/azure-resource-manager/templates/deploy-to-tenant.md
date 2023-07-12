---
title: Deploy resources to tenant
description: Describes how to deploy resources at the tenant scope in an Azure Resource Manager template.
ms.topic: conceptual
ms.date: 05/22/2023
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-arm-template
---

# Tenant deployments with ARM templates

As your organization matures, you may need to define and assign [policies](../../governance/policy/overview.md) or [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) across your Azure AD tenant. With tenant level templates, you can declaratively apply policies and assign roles at a global level.

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [tenant deployments](../bicep/deploy-to-tenant.md).

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

Built-in policy definitions are tenant-level resources, but you can't deploy custom policy definitions at the tenant. For an example of assigning a built-in policy definition to a resource, see [tenantResourceId example](./template-functions-resource.md#tenantresourceid-example).

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

## Deployment location and name

For tenant level deployments, you must provide a location for the deployment. The location of the deployment is separate from the location of the resources you deploy. The deployment location specifies where to store deployment data. [Subscription](deploy-to-subscription.md) and [management group](deploy-to-management-group.md) deployments also require a location. For [resource group](deploy-to-resource-group.md) deployments, the location of the resource group is used to store the deployment data.

You can provide a name for the deployment, or use the default deployment name. The default name is the name of the template file. For example, deploying a template named _azuredeploy.json_ creates a default deployment name of **azuredeploy**.

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

Resources defined within the resources section of the template are applied to the tenant.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/default-tenant.json" highlight="5":::

### Scope to management group

To target a management group within the tenant, add a nested deployment and specify the `scope` property.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/tenant-to-mg.json" highlight="10,17,18,22":::

### Scope to subscription

You can also target subscriptions within the tenant. The user deploying the template must have access to the specified scope.

To target a subscription within the tenant, use a nested deployment and the `subscriptionId` property.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/tenant-to-subscription.json" highlight="9,10,18":::

### Scope to resource group

You can also target resource groups within the tenant. The user deploying the template must have access to the specified scope.

To target a resource group within the tenant, use a nested deployment. Set the `subscriptionId` and `resourceGroup` properties. Don't set a location for the nested deployment because it's deployed in the location of the resource group.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/tenant-to-rg.json" highlight="9,10,18":::

## Create management group

The following template creates a management group.

:::code language="json" source="~/quickstart-templates/tenant-deployments/new-mg/azuredeploy.json":::

If your account doesn't have permission to deploy to the tenant, you can still create management groups by deploying to another scope. For more information, see [Management group](deploy-to-management-group.md#management-group).

## Assign role

The following template assigns a role at the tenant scope.

:::code language="json" source="~/quickstart-templates/tenant-deployments/tenant-role-assignment/azuredeploy.json":::

## Next steps

* To learn about assigning roles, see [Assign Azure roles using Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md).
* You can also deploy templates at [subscription level](deploy-to-subscription.md) or [management group level](deploy-to-management-group.md).
