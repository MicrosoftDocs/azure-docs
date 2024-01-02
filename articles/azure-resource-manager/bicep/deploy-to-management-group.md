---
title: Use Bicep to deploy resources to management group
description: Describes how to create a Bicep file that deploys resources at the management group scope.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/23/2023
---

# Management group deployments with Bicep files

This article describes how to set scope with Bicep when deploying to a management group.

As your organization matures, you can deploy a Bicep file to create resources at the management group level. For example, you may need to define and assign [policies](../../governance/policy/overview.md) or [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) for a management group. With management group level templates, you can declaratively apply policies and assign roles at the management group level.

### Training resources

If you would rather learn about deployment scopes through step-by-step guidance, see [Deploy resources to subscriptions, management groups, and tenants by using Bicep](/training/modules/deploy-resources-scopes-bicep/).

## Supported resources

Not all resource types can be deployed to the management group level. This section lists which resource types are supported.

For Azure Blueprints, use:

* [artifacts](/azure/templates/microsoft.blueprint/blueprints/artifacts)
* [blueprints](/azure/templates/microsoft.blueprint/blueprints)
* [blueprintAssignments](/azure/templates/microsoft.blueprint/blueprintassignments)
* [versions](/azure/templates/microsoft.blueprint/blueprints/versions)

For Azure Policy, use:

* [policyAssignments](/azure/templates/microsoft.authorization/policyassignments)
* [policyDefinitions](/azure/templates/microsoft.authorization/policydefinitions)
* [policySetDefinitions](/azure/templates/microsoft.authorization/policysetdefinitions)
* [remediations](/azure/templates/microsoft.policyinsights/remediations)

For access control, use:

* [privateLinkAssociations](/azure/templates/microsoft.authorization/privatelinkassociations)
* [roleAssignments](/azure/templates/microsoft.authorization/roleassignments)
* [roleAssignmentScheduleRequests](/azure/templates/microsoft.authorization/roleassignmentschedulerequests)
* [roleDefinitions](/azure/templates/microsoft.authorization/roledefinitions)
* [roleEligibilityScheduleRequests](/azure/templates/microsoft.authorization/roleeligibilityschedulerequests)
* [roleManagementPolicyAssignments](/azure/templates/microsoft.authorization/rolemanagementpolicyassignments)

For nested templates that deploy to subscriptions or resource groups, use:

* [deployments](/azure/templates/microsoft.resources/deployments)

For managing your resources, use:

* [diagnosticSettings](/azure/templates/microsoft.insights/diagnosticsettings)
* [tags](/azure/templates/microsoft.resources/tags)

Management groups are tenant-level resources. However, you can create management groups in a management group deployment by setting the scope of the new management group to the tenant. See [Management group](#management-group).

## Set scope

To set the scope to management group, use:

```bicep
targetScope = 'managementGroup'
```

## Deployment commands

To deploy to a management group, use the management group deployment commands.

# [Azure CLI](#tab/azure-cli)

For Azure CLI, use [az deployment mg create](/cli/azure/deployment/mg#az-deployment-mg-create):

```azurecli-interactive
az deployment mg create \
  --name demoMGDeployment \
  --location WestUS \
  --management-group-id myMG \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/management-level-deployment/azuredeploy.json"
```

# [PowerShell](#tab/azure-powershell)

For Azure PowerShell, use [New-AzManagementGroupDeployment](/powershell/module/az.resources/new-azmanagementgroupdeployment).

```azurepowershell-interactive
New-AzManagementGroupDeployment `
  -Name demoMGDeployment `
  -Location "West US" `
  -ManagementGroupId "myMG" `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/management-level-deployment/azuredeploy.json"
```

---

For more detailed information about deployment commands and options for deploying ARM templates, see:

* [Deploy resources with ARM templates and Azure CLI](deploy-cli.md)
* [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md)
* [Deploy ARM templates from Cloud Shell](deploy-cloud-shell.md)

## Deployment location and name

For management group level deployments, you must provide a location for the deployment. The location of the deployment is separate from the location of the resources you deploy. The deployment location specifies where to store deployment data. [Subscription](deploy-to-subscription.md) and [tenant](deploy-to-tenant.md) deployments also require a location. For [resource group](deploy-to-resource-group.md) deployments, the location of the resource group is used to store the deployment data.

You can provide a name for the deployment, or use the default deployment name. The default name is the name of the template file. For example, deploying a template named _main.bicep_ creates a default deployment name of **main**.

For each deployment name, the location is immutable. You can't create a deployment in one location when there's an existing deployment with the same name in a different location. For example, if you create a management group deployment with the name **deployment1** in **centralus**, you can't later create another deployment with the name **deployment1** but a location of **westus**. If you get the error code `InvalidDeploymentLocation`, either use a different name or the same location as the previous deployment for that name.

## Deployment scopes

When deploying to a management group, you can deploy resources to:

* the target management group from the operation
* another management group in the tenant
* subscriptions in the management group
* resource groups in the management group
* the tenant for the resource group

An [extension resource](scope-extension-resources.md) can be scoped to a target that is different than the deployment target.

The user deploying the template must have access to the specified scope.

### Scope to management group

To deploy resources to the target management group, add those resources with the `resource` keyword.

```bicep
targetScope = 'managementGroup'

// policy definition created in the management group
resource policyDefinition 'Microsoft.Authorization/policyDefinitions@2021-06-01' = {
  ...
}
```

To target another management group, add a [module](modules.md). Use the [managementGroup function](bicep-functions-scope.md#managementgroup) to set the `scope` property. Provide the management group name.

```bicep
targetScope = 'managementGroup'

param otherManagementGroupName string

// module deployed at management group level but in a different management group
module exampleModule 'module.bicep' = {
  name: 'deployToDifferentMG'
  scope: managementGroup(otherManagementGroupName)
}
```

### Scope to subscription

You can also target subscriptions within a management group. The user deploying the template must have access to the specified scope.

To target a subscription within the management group, add a module. Use the [subscription function](bicep-functions-scope.md#subscription) to set the `scope` property. Provide the subscription ID.

```bicep
targetScope = 'managementGroup'

param subscriptionID string

// module deployed to subscription in the management group
module exampleModule 'module.bicep' = {
  name: 'deployToSub'
  scope: subscription(subscriptionID)
}
```

### Scope to resource group

You can also target resource groups within the management group. The user deploying the template must have access to the specified scope.

To target a resource group within the management group, add a module. Use the [resourceGroup function](bicep-functions-scope.md#resourcegroup) to set the `scope` property.  Provide the subscription ID and resource group name.

```bicep
targetScope = 'managementGroup'

param subscriptionID string
param resourceGroupName string

// module deployed to resource group in the management group
module exampleModule 'module.bicep' = {
  name: 'deployToRG'
  scope: resourceGroup(subscriptionID, resourceGroupName)
}
```

### Scope to tenant

To create resources at the tenant, add a module. Use the [tenant function](bicep-functions-scope.md#tenant) to set its `scope` property. The user deploying the template must have the [required access to deploy at the tenant](deploy-to-tenant.md#required-access).

```bicep
targetScope = 'managementGroup'

// module deployed at tenant level
module exampleModule 'module.bicep' = {
  name: 'deployToTenant'
  scope: tenant()
}
```

Or, you can set the scope to `/` for some resource types, like management groups. Creating a new management group is described in the next section.

## Management group

To create a management group in a management group deployment, you must set the scope to the tenant.

The following example creates a new management group in the root management group.

```bicep
targetScope = 'managementGroup'

param mgName string = 'mg-${uniqueString(newGuid())}'

resource newMG 'Microsoft.Management/managementGroups@2021-04-01' = {
  scope: tenant()
  name: mgName
  properties: {}
}

output newManagementGroup string = mgName
```

The next example creates a new management group in the management group targeted for the deployment. It uses the [management group function](bicep-functions-scope.md#managementgroup).

```bicep
targetScope = 'managementGroup'

param mgName string = 'mg-${uniqueString(newGuid())}'

resource newMG 'Microsoft.Management/managementGroups@2021-04-01' = {
  scope: tenant()
  name: mgName
  properties: {
    details: {
      parent: {
        id: managementGroup().id
      }
    }
  }
}

output newManagementGroup string = mgName
```

## Subscriptions

To use an ARM template to create a new Azure subscription in a management group, see:

* [Programmatically create Azure Enterprise Agreement subscriptions](../../cost-management-billing/manage/programmatically-create-subscription-enterprise-agreement.md)
* [Programmatically create Azure subscriptions for a Microsoft Customer Agreement](../../cost-management-billing/manage/programmatically-create-subscription-microsoft-customer-agreement.md)
* [Programmatically create Azure subscriptions for a Microsoft Partner Agreement](../../cost-management-billing/manage/programmatically-create-subscription-microsoft-partner-agreement.md)

To deploy a template that moves an existing Azure subscription to a new management group, see [Move subscriptions in ARM template](../../governance/management-groups/manage.md#move-subscriptions-in-arm-template)

## Azure Policy

Custom policy definitions that are deployed to the management group are extensions of the management group. To get the ID of a custom policy definition, use the [extensionResourceId()](./bicep-functions-resource.md#extensionresourceid) function. Built-in policy definitions are tenant level resources. To get the ID of a built-in policy definition, use the [tenantResourceId()](./bicep-functions-resource.md#tenantresourceid) function.

The following example shows how to [define](../../governance/policy/concepts/definition-structure.md) a policy at the management group level, and assign it.

```bicep
targetScope = 'managementGroup'

@description('An array of the allowed locations, all other locations will be denied by the created policy.')
param allowedLocations array = [
  'australiaeast'
  'australiasoutheast'
  'australiacentral'
]

resource policyDefinition 'Microsoft.Authorization/policyDefinitions@2021-06-01' = {
  name: 'locationRestriction'
  properties: {
    policyType: 'Custom'
    mode: 'All'
    parameters: {}
    policyRule: {
      if: {
        not: {
          field: 'location'
          in: allowedLocations
        }
      }
      then: {
        effect: 'deny'
      }
    }
  }
}

resource policyAssignment 'Microsoft.Authorization/policyAssignments@2022-06-01' = {
  name: 'locationAssignment'
  properties: {
    policyDefinitionId: policyDefinition.id
  }
}
```

## Next steps

To learn about other scopes, see:

* [Resource group deployments](deploy-to-resource-group.md)
* [Subscription deployments](deploy-to-subscription.md)
* [Tenant deployments](deploy-to-tenant.md)
