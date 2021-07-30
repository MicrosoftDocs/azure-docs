---
title: Declare resources in Bicep
description: Describes how to declare resources to deploy in Bicep.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 06/01/2021
---

# Resource declaration in Bicep

To deploy a resource through a Bicep file, you add a resource declaration by using the `resource` keyword.

## Set resource type and version

When adding a resource to your Bicep file, start by setting the resource type and API version. These values determine the other properties that are available for the resource.

The following example shows how to set the resource type and API version for a storage account. The example doesn't show the full resource declaration.

```bicep
resource myStorageAccount 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  ...
}
```

You set a symbolic name for the resource. In the preceding example, the symbolic name is `myStorageAccount`. You can use any value for the symbolic name but it can't be the same as another resource, parameter, or variable in the Bicep file. The symbolic name isn't the same as the resource name. You use the symbolic name to easily reference the resource in other parts of your Bicep file.

Bicep doesn't support `apiProfile`, which is available in [Azure Resource Manager templates (ARM templates) JSON](../templates/syntax.md).

## Set resource name

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

## Set location

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

## Set tags

You can apply tags to a resource during deployment. Tags help you logically organize your deployed resources. For examples of the different ways you can specify the tags, see [ARM template tags](../management/tag-resources.md#arm-templates).

## Set resource-specific properties

The preceding properties are generic to most resource types. After setting those values, you need to set the properties that are specific to the resource type you're deploying.

Use intellisense or [template reference](/azure/templates/) to determine which properties are available and which ones are required. The following example sets the remaining properties for a storage account.

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

## Set resource dependencies

When deploying resources, you may need to make sure some resources exist before other resources. For example, you need a logical SQL server before deploying a database. You establish this relationship by marking one .resource as dependent on the other resource. Order of resource deployment can be influenced in two ways: [implicit dependency](#implicit-dependency) and [explicit dependency](#explicit-dependency)

Azure Resource Manager evaluates the dependencies between resources, and deploys them in their dependent order. When resources aren't dependent on each other, Resource Manager deploys them in parallel. You only need to define dependencies for resources that are deployed in the same Bicep file.

### Implicit dependency

An implicit dependency is created when one resource declaration references the identifier of another resource declaration in an expression. For example, *dnsZone* is referenced by the second resource definition in the following example:

```bicep
resource dnsZone 'Microsoft.Network/dnszones@2018-05-01' = {
  name: 'myZone'
  location: 'global'
}

resource otherResource 'Microsoft.Example/examples@2020-06-01' = {
  name: 'exampleResource'
  properties: {
    // get read-only DNS zone property
    nameServers: dnsZone.properties.nameServers
  }
}
```

A nested resource also has an implicit dependency on its containing resource.

```bicep
resource myParent 'My.Rp/parentType@2020-01-01' = {
  name: 'myParent'
  location: 'West US'

  // depends on 'myParent' implicitly
  resource myChild 'childType' = {
    name: 'myChild'
  }
}
```

For more information, see [Set name and type for child resources in Bicep](./child-resource-name-type.md).

### Explicit dependency

An explicit dependency is declared via the `dependsOn` property within the resource declaration. The property accept an array of resource identifiers. Here is an example of one DNS zone depending on another explicitly:

```bicep
resource dnsZone 'Microsoft.Network/dnszones@2018-05-01' = {
  name: 'myZone'
  location: 'global'
}

resource otherZone 'Microsoft.Network/dnszones@2018-05-01' = {
  name: 'myZone'
  location: 'global'
  dependsOn: [
    dnsZone
  ]
}
```

While you may be inclined to use `dependsOn` to map relationships between your resources, it's important to understand why you're doing it. For example, to document how resources are interconnected, `dependsOn` isn't the right approach. You can't query which resources were defined in the `dependsOn` element after deployment. Setting unnecessary dependencies slows deployment time because Resource Manager can't deploy those resources in parallel.

Even though explicit dependencies are sometimes required, the need for them is rare. In most cases you have a symbolic reference available to imply the dependency between resources. If you find yourself using dependsOn you should consider if there is a way to get rid of it.

### Visualize dependencies

Visual Studio Code provides a tool for visualizing the dependencies. Open a Bicep file in Visual Studio Code, and then select the visualizer button on the upper left corner.  The following screenshot shows the dependencies of a visual machine resource that are defined in the Bicep file.

:::image type="content" source="./media/resource-declaration/bicep-resource-visualizer.png" alt-text="Screenshot of Visual Studio Code Bicep resource visualizer":::

## Reference existing resources

You can add references and access runtime properties from resources outside of the current file by using the `existing` keyword in a resource declaration. This is equivalent to using the ARM Template [reference() function](../templates/template-functions-resource.md#reference).

When using the `existing` keyword, you must provide the `name` of the resource, and may optionally also set the `scope` property to access a resource in a different scope. See [Resource Scopes](./deploy-to-resource-group.md) for more information on using the scope property.

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2019-06-01' existing = {
  name: 'exampleStorage'
}

output blobEndpoint string = stg.properties.primaryEndpoints.blob
```

The preceding example doesn't deploy the storage account, but the declaration provides access to properties on the existing resource. Using the 'stg' symbolic name, you can access properties on the storage account.

The following example shows how to specify the `scope` property:

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2019-06-01' existing = {
  name: 'exampleStorage'
  scope: resourceGroup(mySub, myRg)
}
```

## Next steps

- To conditionally deploy a resource, see [Conditional deployment in Bicep](./conditional-resource-deployment.md).
