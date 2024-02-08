---
title: Use Bicep to deploy resources to subscription
description: Describes how to create a Bicep file that deploys resources to the Azure subscription scope.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 09/26/2023
---

# Subscription deployments with Bicep files

To simplify the management of resources, you can deploy resources at the level of your Azure subscription. For example, you can deploy [policies](../../governance/policy/overview.md) and [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) to your subscription, which applies them across your subscription.

This article describes how to set the deployment scope to a subscription in a Bicep file.

> [!NOTE]
> You can deploy to 800 different resource groups in a subscription level deployment.

### Training resources

If you would rather learn about deployment scopes through step-by-step guidance, see [Deploy resources to subscriptions, management groups, and tenants by using Bicep](/training/modules/deploy-resources-scopes-bicep/).

## Supported resources

Not all resource types can be deployed to the subscription level. This section lists which resource types are supported.

For Azure Blueprints, use:

* [artifacts](/azure/templates/microsoft.blueprint/blueprints/artifacts)
* [blueprints](/azure/templates/microsoft.blueprint/blueprints)
* [blueprintAssignments](/azure/templates/microsoft.blueprint/blueprintassignments)
* [versions (Blueprints)](/azure/templates/microsoft.blueprint/blueprints/versions)

For Azure Policies, use:

* [policyAssignments](/azure/templates/microsoft.authorization/policyassignments)
* [policyDefinitions](/azure/templates/microsoft.authorization/policydefinitions)
* [policySetDefinitions](/azure/templates/microsoft.authorization/policysetdefinitions)
* [remediations](/azure/templates/microsoft.policyinsights/remediations)

For access control, use:

* [accessReviewScheduleDefinitions](/azure/templates/microsoft.authorization/accessreviewscheduledefinitions)
* [accessReviewScheduleSettings](/azure/templates/microsoft.authorization/accessreviewschedulesettings)
* [roleAssignments](/azure/templates/microsoft.authorization/roleassignments)
* [roleAssignmentScheduleRequests](/azure/templates/microsoft.authorization/roleassignmentschedulerequests)
* [roleDefinitions](/azure/templates/microsoft.authorization/roledefinitions)
* [roleEligibilityScheduleRequests](/azure/templates/microsoft.authorization/roleeligibilityschedulerequests)
* [roleManagementPolicyAssignments](/azure/templates/microsoft.authorization/rolemanagementpolicyassignments)

For nested templates that deploy to resource groups, use:

* [deployments](/azure/templates/microsoft.resources/deployments)

For creating new resource groups, use:

* [resourceGroups](/azure/templates/microsoft.resources/resourcegroups)

For managing your subscription, use:

* [budgets](/azure/templates/microsoft.consumption/budgets)
* [configurations - Advisor](/azure/templates/microsoft.advisor/configurations)
* [lineOfCredit](/azure/templates/microsoft.billing/billingaccounts/lineofcredit)
* [locks](/azure/templates/microsoft.authorization/locks)
* [profile - Change Analysis](/azure/templates/microsoft.changeanalysis/profile)
* [supportPlanTypes](/azure/templates/microsoft.addons/supportproviders/supportplantypes)
* [tags](/azure/templates/microsoft.resources/tags)

For monitoring, use:

* [diagnosticSettings](/azure/templates/microsoft.insights/diagnosticsettings)
* [logprofiles](/azure/templates/microsoft.insights/logprofiles)

For security, use:

* [advancedThreatProtectionSettings](/azure/templates/microsoft.security/advancedthreatprotectionsettings)
* [alertsSuppressionRules](/azure/templates/microsoft.security/alertssuppressionrules)
* [assessmentMetadata](/azure/templates/microsoft.security/assessmentmetadata)
* [assessments](/azure/templates/microsoft.security/assessments)
* [autoProvisioningSettings](/azure/templates/microsoft.security/autoprovisioningsettings)
* [connectors](/azure/templates/microsoft.security/connectors)
* [deviceSecurityGroups](/azure/templates/microsoft.security/devicesecuritygroups)
* [ingestionSettings](/azure/templates/microsoft.security/ingestionsettings)
* [pricings](/azure/templates/microsoft.security/pricings)
* [securityContacts](/azure/templates/microsoft.security/securitycontacts)
* [settings](/azure/templates/microsoft.security/settings)
* [workspaceSettings](/azure/templates/microsoft.security/workspacesettings)

Other supported types include:

* [scopeAssignments](/azure/templates/microsoft.managednetwork/scopeassignments)
* [eventSubscriptions](/azure/templates/microsoft.eventgrid/eventsubscriptions)
* [peerAsns](/azure/templates/microsoft.peering/2019-09-01-preview/peerasns)

## Set scope

To set the scope to subscription, use:

```bicep
targetScope = 'subscription'
```

## Deployment commands

To deploy to a subscription, use the subscription-level deployment commands.

# [Azure CLI](#tab/azure-cli)

For Azure CLI, use [az deployment sub create](/cli/azure/deployment/sub#az-deployment-sub-create). The following example deploys a template to create a resource group:

```azurecli-interactive
az deployment sub create \
  --name demoSubDeployment \
  --location centralus \
  --template-file main.bicep \
  --parameters rgName=demoResourceGroup rgLocation=centralus
```

# [PowerShell](#tab/azure-powershell)

For the PowerShell deployment command, use [New-AzDeployment](/powershell/module/az.resources/new-azdeployment) or its alias `New-AzSubscriptionDeployment`. The following example deploys a template to create a resource group:

```azurepowershell-interactive
New-AzSubscriptionDeployment `
  -Name demoSubDeployment `
  -Location centralus `
  -TemplateFile main.bicep `
  -rgName demoResourceGroup `
  -rgLocation centralus
```

---

For more detailed information about deployment commands and options for deploying ARM templates, see:

* [Deploy resources with ARM templates and Azure CLI](deploy-cli.md)
* [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md)
* [Deploy ARM templates from Cloud Shell](deploy-cloud-shell.md)

## Deployment location and name

For subscription level deployments, you must provide a location for the deployment. The location of the deployment is separate from the location of the resources you deploy. The deployment location specifies where to store deployment data. [Management group](deploy-to-management-group.md) and [tenant](deploy-to-tenant.md) deployments also require a location. For [resource group](deploy-to-resource-group.md) deployments, the location of the resource group is used to store the deployment data.

You can provide a name for the deployment, or use the default deployment name. The default name is the name of the template file. For example, deploying a template named _main.json_ creates a default deployment name of **main**.

For each deployment name, the location is immutable. You can't create a deployment in one location when there's an existing deployment with the same name in a different location. For example, if you create a subscription deployment with the name **deployment1** in **centralus**, you can't later create another deployment with the name **deployment1** but a location of **westus**. If you get the error code `InvalidDeploymentLocation`, either use a different name or the same location as the previous deployment for that name.

## Deployment scopes

When deploying to a subscription, you can deploy resources to:

* the target subscription from the operation
* any subscription in the tenant
* resource groups within the subscription or other subscriptions
* the tenant for the subscription

An [extension resource](scope-extension-resources.md) can be scoped to a target that is different than the deployment target.

The user deploying the template must have access to the specified scope.

### Scope to subscription

To deploy resources to the target subscription, add those resources with the `resource` keyword.

```bicep
targetScope = 'subscription'

// resource group created in target subscription
resource exampleResource 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  ...
}
```

For examples of deploying to the subscription, see [Create resource groups with Bicep](create-resource-group.md) and [Assign policy definition](#assign-policy-definition).

To deploy resources to a subscription that is different than the subscription from the operation, add a [module](modules.md). Use the [subscription function](bicep-functions-scope.md#subscription) to set the `scope` property. Provide the `subscriptionId` property to the ID of the subscription you want to deploy to.

```bicep
targetScope = 'subscription'

param otherSubscriptionID string

// module deployed at subscription level but in a different subscription
module exampleModule 'module.bicep' = {
  name: 'deployToDifferentSub'
  scope: subscription(otherSubscriptionID)
}
```

### Scope to resource group

To deploy resources to a resource group within the subscription, add a module and set its `scope` property. If the resource group already exists, use the [resourceGroup function](bicep-functions-scope.md#resourcegroup) to set the scope value. Provide the resource group name.

```bicep
targetScope = 'subscription'

param resourceGroupName string

module exampleModule 'module.bicep' = {
  name: 'exampleModule'
  scope: resourceGroup(resourceGroupName)
}
```

If the resource group is created in the same Bicep file, use the symbolic name of the resource group to set the scope value. For an example of setting the scope to the symbolic name, see [Create resource group with Bicep](create-resource-group.md).

### Scope to tenant

To create resources at the tenant, add a module. Use the [tenant function](bicep-functions-scope.md#tenant) to set its `scope` property.

The user deploying the template must have the [required access to deploy at the tenant](deploy-to-tenant.md#required-access).

The following example includes a module that is deployed to the tenant.

```bicep
targetScope = 'subscription'

// module deployed at tenant level
module exampleModule 'module.bicep' = {
  name: 'deployToTenant'
  scope: tenant()
}
```

Instead of using a module, you can set the scope to `tenant()` for some resource types. The following example deploys a management group at the tenant.

```bicep
targetScope = 'subscription'

param mgName string = 'mg-${uniqueString(newGuid())}'

// management group created at tenant
resource managementGroup 'Microsoft.Management/managementGroups@2021-04-01' = {
  scope: tenant()
  name: mgName
  properties: {}
}

output output string = mgName
```

For more information, see [Management group](deploy-to-management-group.md#management-group).

## Resource groups

For information about creating resource groups, see [Create resource group with Bicep](create-resource-group.md).

## Azure Policy

### Assign policy definition

The following example assigns an existing policy definition to the subscription. If the policy definition takes parameters, provide them as an object. If the policy definition doesn't take parameters, use the default empty object.

```bicep
targetScope = 'subscription'

param policyDefinitionID string
param policyName string
param policyParameters object = {}

resource policyAssign 'Microsoft.Authorization/policyAssignments@2022-06-01' = {
  name: policyName
  properties: {
    policyDefinitionId: policyDefinitionID
    parameters: policyParameters
  }
}
```

### Create and assign policy definitions

You can [define](../../governance/policy/concepts/definition-structure.md) and assign a policy definition in the same Bicep file.

```bicep
targetScope = 'subscription'

resource locationPolicy 'Microsoft.Authorization/policyDefinitions@2021-06-01' = {
  name: 'locationpolicy'
  properties: {
    policyType: 'Custom'
    parameters: {}
    policyRule: {
      if: {
        field: 'location'
        equals: 'northeurope'
      }
      then: {
        effect: 'deny'
      }
    }
  }
}

resource locationRestrict 'Microsoft.Authorization/policyAssignments@2022-06-01' = {
  name: 'allowedLocation'
  properties: {
    policyDefinitionId: locationPolicy.id
  }
}
```

## Access control

To learn about assigning roles, see [Add Azure role assignments using Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md).

The following example creates a resource group, applies a lock to it, and assigns a role to a principal.

```bicep
targetScope = 'subscription'

@description('Name of the resourceGroup to create')
param resourceGroupName string

@description('Location for the resourceGroup')
param resourceGroupLocation string

@description('principalId of the user that will be given contributor access to the resourceGroup')
param principalId string

@description('roleDefinition to apply to the resourceGroup - default is contributor')
param roleDefinitionId string = 'b24988ac-6180-42a0-ab88-20f7382dd24c'

@description('Unique name for the roleAssignment in the format of a guid')
param roleAssignmentName string = guid(principalId, roleDefinitionId, resourceGroupName)

var roleID = '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/${roleDefinitionId}'

resource newResourceGroup 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: resourceGroupName
  location: resourceGroupLocation
  properties: {}
}

module applyLock 'lock.bicep' = {
  name: 'applyLock'
  scope: newResourceGroup
}

module assignRole 'role.bicep' = {
  name: 'assignRBACRole'
  scope: newResourceGroup
  params: {
    principalId: principalId
    roleNameGuid: roleAssignmentName
    roleDefinitionId: roleID
  }
}
```

The following example shows the module to apply the lock:

```bicep
resource createRgLock 'Microsoft.Authorization/locks@2020-05-01' = {
  name: 'rgLock'
  properties: {
    level: 'CanNotDelete'
    notes: 'Resource group should not be deleted.'
  }
}
```

The next example shows the module to assign the role:

```bicep
@description('The principal to assign the role to')
param principalId string

@description('A GUID used to identify the role assignment')
param roleNameGuid string = newGuid()

param roleDefinitionId string

resource roleNameGuid_resource 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: roleNameGuid
  properties: {
    roleDefinitionId: roleDefinitionId
    principalId: principalId
  }
}
```

## Next steps

To learn about other scopes, see:

* [Resource group deployments](deploy-to-resource-group.md)
* [Management group deployments](deploy-to-management-group.md)
* [Tenant deployments](deploy-to-tenant.md)
