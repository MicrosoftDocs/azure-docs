---
title: Declare resources in Bicep
description: Describes how to declare resources to deploy in Bicep.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 02/21/2023
---

# Resource declaration in Bicep

This article describes the syntax you use to add a resource to your Bicep file. You are limited to 800 resources in a Bicep file. For more information, see [Template limits](../templates/best-practices.md#template-limits).

## Declaration

Add a resource declaration by using the `resource` keyword. You set a symbolic name for the resource. The symbolic name isn't the same as the resource name. You use the symbolic name to reference the resource in other parts of your Bicep file.

```bicep
resource <symbolic-name> '<full-type-name>@<api-version>' = {
  <resource-properties>
}
```

So, a declaration for a storage account can start with:

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  ...
}
```

Symbolic names are case-sensitive. They may contain letters, numbers, and underscores (`_`). They can't start with a number. A resource can't have the same name as a parameter, variable, or module.

For the available resource types and version, see [Bicep resource reference](/azure/templates/). Bicep doesn't support `apiProfile`, which is available in [Azure Resource Manager templates (ARM templates) JSON](../templates/syntax.md). You can also define Bicep extensibility provider resources. For more information, see [Bicep extensibility Kubernetes provider](./bicep-extensibility-kubernetes-provider.md).

To conditionally deploy a resource, use the `if` syntax. For more information, see [Conditional deployment in Bicep](conditional-resource-deployment.md).

```bicep
resource <symbolic-name> '<full-type-name>@<api-version>' = if (condition) {
  <resource-properties>
}
```

To deploy more than one instance of a resource, use the `for` syntax. You can use the `batchSize` decorator to specify whether the instances are deployed serially or in parallel. For more information, see [Iterative loops in Bicep](loops.md).

```bicep
@batchSize(int) // optional decorator for serial deployment
resource <symbolic-name> '<full-type-name>@<api-version>' = [for <item> in <collection>: {
  <properties-to-repeat>
}]
```

You can also use the `for` syntax on the resource properties to create an array.

```bicep
resource <symbolic-name> '<full-type-name>@<api-version>' = {
  properties: {
    <array-property>: [for <item> in <collection>: <value-to-repeat>]
  }
}
```

## Resource name

Each resource has a name. When setting the resource name, pay attention to the [rules and restrictions for resource names](../management/resource-name-rules.md).

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  name: 'examplestorage'
  ...
}
```

Typically, you'd set the name to a parameter so you can pass in different values during deployment.

```bicep
@minLength(3)
@maxLength(24)
param storageAccountName string

resource stg 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  name: storageAccountName
  ...
}
```

## Location

Many resources require a location. You can determine if the resource needs a location either through intellisense or [template reference](/azure/templates/). The following example adds a location parameter that is used for the storage account.

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  name: 'examplestorage'
  location: 'eastus'
  ...
}
```

Typically, you'd set location to a parameter so you can deploy to different locations.

```bicep
param location string = resourceGroup().location

resource stg 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  name: 'examplestorage'
  location: location
  ...
}
```

Different resource types are supported in different locations. To get the supported locations for an Azure service, See [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).  To get the supported locations for a resource type, use Azure PowerShell or Azure CLI.

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
((Get-AzResourceProvider -ProviderNamespace Microsoft.Batch).ResourceTypes `
  | Where-Object ResourceTypeName -eq batchAccounts).Locations
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az provider show \
  --namespace Microsoft.Batch \
  --query "resourceTypes[?resourceType=='batchAccounts'].locations | [0]" \
  --out table
```

---

## Tags

You can apply tags to a resource during deployment. Tags help you logically organize your deployed resources. For examples of the different ways you can specify the tags, see [ARM template tags](../management/tag-resources-bicep.md).

## Managed identities for Azure resources

Some resources support [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). Those resources have an identity object at the root level of the resource declaration.

You can use either system-assigned or user-assigned identities.

The following example shows how to configure a system-assigned identity for an Azure Kubernetes Service cluster.

```bicep
resource aks 'Microsoft.ContainerService/managedClusters@2020-09-01' = {
  name: clusterName
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
```

The next example shows how to configure a user-assigned identity for a virtual machine.

```bicep
param userAssignedIdentity string

resource vm 'Microsoft.Compute/virtualMachines@2020-06-01' = {
  name: vmName
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentity}': {}
    }
  }
```

## Resource-specific properties

The preceding properties are generic to most resource types. After setting those values, you need to set the properties that are specific to the resource type you're deploying.

Use intellisense or [Bicep resource reference](/azure/templates/) to determine which properties are available and which ones are required. The following example sets the remaining properties for a storage account.

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  name: 'examplestorage'
  location: 'eastus'
  sku: {
    name: 'Standard_LRS'
    tier: 'Standard'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}
```

## Next steps

- To conditionally deploy a resource, see [Conditional deployment in Bicep](./conditional-resource-deployment.md).
- To reference an existing resource, see [Existing resources in Bicep](existing-resource.md).
- To learn about how deployment order is determined, see [Resource dependencies in Bicep](resource-dependencies.md).
