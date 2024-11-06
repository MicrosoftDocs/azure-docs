---
title: Bicep modules
description: This article describes how to define a module in a Bicep file and how to use module scopes.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 08/20/2024
---

# Bicep modules

With Bicep, you can organize deployments into modules. A module is a Bicep file that another Bicep file deploys. A module can also be an Azure Resource Manager template (ARM template) for JSON. With modules, you improve the readability of your Bicep files by encapsulating complex details of your deployment. You can also easily reuse modules for different deployments.

To share modules with other people in your organization, create a [template spec](../bicep/template-specs.md) or [private registry](private-module-registry.md). Template specs and modules in the registry are available only to users with the correct permissions.

> [!TIP]
> The choice between module registry and template specs is mostly a matter of preference. There are a few things to consider when you choose between the two:
>
> - Module registry is supported only by Bicep. If you aren't using Bicep, use template specs.
> - You can deploy content in the Bicep module registry only from another Bicep file. You can deploy template specs directly from the API, Azure PowerShell, the Azure CLI, and the Azure portal. You can even use [`UiFormDefinition`](../templates/template-specs-create-portal-forms.md) to customize the portal deployment experience.
> - Bicep has some limited capabilities for embedding other project artifacts (including non-Bicep and non-ARM-template files like PowerShell scripts, CLI scripts, and other binaries) by using the [`loadTextContent`](./bicep-functions-files.md#loadtextcontent) and [`loadFileAsBase64`](./bicep-functions-files.md#loadfileasbase64) functions. Template specs can't package these artifacts.

Bicep modules are converted into a single ARM template with [nested templates](../templates/linked-templates.md#nested-template). For more information about how Bicep resolves configuration files and how Bicep merges a user-defined configuration file with the default configuration file, see [Configuration file resolution process](./bicep-config.md#understand-the-file-resolution-process) and [Configuration file merge process](./bicep-config.md#understand-the-merge-process).

### Training resources

If you want to learn about modules through step-by-step guidance, see [Create composable Bicep files by using modules](/training/modules/create-composable-bicep-files-using-modules/).

## Define modules

The basic syntax for defining a module is:

```bicep
@<decorator>(<argument>)
module <symbolic-name> '<path-to-file>' = {
  name: '<linked-deployment-name>'
  params: {
    <parameter-names-and-values>
  }
}
```

A simple, real-world example looks like:

```bicep
module stgModule '../storageAccount.bicep' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: 'examplestg1'
  }
}
```

You can also use an ARM template for JSON as a module:

```bicep
module stgModule '../storageAccount.json' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: 'examplestg1'
  }
}
```

Use the symbolic name to reference the module in another part of the Bicep file. For example, you can use the symbolic name to get the output from a module. The symbolic name might contain a-z, A-Z, 0-9, and underscore (`_`). The name can't start with a number. A module can't have the same name as a parameter, variable, or resource.

The path can be either a local file or a file in a registry. The local file can be either a Bicep file or an ARM template for JSON. For more information, see [Path to a module](#path-to-a-module).

The `name` property is required. It becomes the name of the nested deployment resource in the generated template.

If a module with a static name is deployed concurrently to the same scope, there's the potential for one deployment to interfere with the output from the other deployment. For example, if two Bicep files use the same module with the same static name (`examplemodule`) and are targeted to the same resource group, one deployment might show the wrong output. If you're concerned about concurrent deployments to the same scope, give your module a unique name.

The following example concatenates the deployment name to the module name. If you provide a unique name for the deployment, the module name is also unique.

```bicep
module stgModule 'storageAccount.bicep' = {
  name: '${deployment().name}-storageDeploy'
  scope: resourceGroup('demoRG')
}
```

If you need to *specify a scope* that's different than the scope for the main file, add the scope property. For more information, see [Set module scope](#set-module-scope).

```bicep
// deploy to different scope
module <symbolic-name> '<path-to-file>' = {
  name: '<linked-deployment-name>'
  scope: <scope-object>
  params: {
    <parameter-names-and-values>
  }
}
```

To *conditionally deploy a module*, add an `if` expression. The use is similar to [conditionally deploying a resource](conditional-resource-deployment.md).

```bicep
// conditional deployment
module <symbolic-name> '<path-to-file>' = if (<condition-to-deploy>) {
  name: '<linked-deployment-name>'
  params: {
    <parameter-names-and-values>
  }
}
```

To deploy *more than one instance* of a module, add the `for` expression. Use the `batchSize` decorator to specify whether the instances are deployed serially or in parallel. For more information, see [Iterative loops in Bicep](loops.md).

```bicep
// iterative deployment
@batchSize(int) // optional decorator for serial deployment
module <symbolic-name> '<path-to-file>' = [for <item> in <collection>: {
  name: '<linked-deployment-name>'
  params: {
    <parameter-names-and-values>
  }
}]
```

Like resources, modules are deployed in parallel unless they depend on other modules or resources. Typically, you don't need to set dependencies because they're determined implicitly. If you need to set an explicit dependency, add `dependsOn` to the module definition. To learn more about dependencies, see [Resource dependencies](resource-dependencies.md).

```bicep
module <symbolic-name> '<path-to-file>' = {
  name: '<linked-deployment-name>'
  params: {
    <parameter-names-and-values>
  }
  dependsOn: [
    <symbolic-names-to-deploy-before-this-item>
  ]
}
```

## Path to a module

The file for the module can be either a local file or an external file. The external file can be in a template spec or a Bicep module registry.

### Local file

If the module is a *local file*, provide a relative path to that file. All paths in Bicep must be specified by using the forward slash (/) directory separator to ensure consistent compilation across platforms. The Windows backslash (\\) character is unsupported. Paths can contain spaces.

For example, to deploy a file that's up one level in the directory from your main file, use:

```bicep
module stgModule '../storageAccount.bicep' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: 'examplestg1'
  }
}
```

### File in registry

There are public and private module registries.

#### Public module registry

> [!NOTE]
> Non-Azure Verified Modules are retired from the public module registry.

[Azure Verified Modules](https://azure.github.io/Azure-Verified-Modules/) are prebuilt, pretested, and preverified modules that you can use to deploy resources on Azure. Microsoft employees created and own these modules. They were designed to simplify and accelerate the deployment process for common Azure resources and configurations. The modules also align to best practices like Azure Well-Architected Framework.

Browse to the [Azure Verified Modules Bicep Index](https://azure.github.io/Azure-Verified-Modules/indexes/bicep/) to see the list of modules that are available. Select the highlighted numbers in the following screenshot to go directly to that filtered view.

:::image type="content" source="./media/modules/bicep-azure-verified-modules-avm.png" alt-text="Screenshot that shows Azure Verified Modules.":::

The module list shows the latest version. Select the version number to see a list of available versions.

:::image type="content" source="./media/modules/bicep-azure-verified-modules-avm-version.png" alt-text="Screenshot that shows Azure Verified Modules versions.":::

To link to a public module, specify the module path with the following syntax:

```bicep
module <symbolic-name> 'br/public:<file-path>:<tag>' = {}
```

- **br/public**: Is the alias for public modules. You can customize this alias in the [Bicep configuration file](./bicep-config-modules.md).
- **file path**: Can contain segments that you can separate by the `/` character.
- **tag**: Is used for specifying a version for the module.

For example:

```bicep
module storage 'br/public:avm/res/storage/storage-account:0.9.0' = {
  name: 'myStorage'
  params: {
    name: 'store${resourceGroup().name}'
  }
}
```

> [!NOTE]
> The alias for public modules is `br/public`. You can also write it as:
>
> ```bicep
> module <symbolic-name> 'br:mcr.microsoft.com/bicep/<file-path>:<tag>' = {}
> ```
>

#### Private module registry

If you [published a module to a registry](bicep-cli.md#publish), you can link to that module. Provide the name for the Azure container registry and a path to the module. Specify the module path with the following syntax:

```bicep
module <symbolic-name> 'br:<registry-name>.azurecr.io/<file-path>:<tag>' = {
```

- **br**: Is a scheme name for a Bicep registry.
- **file path**: Is called `repository` in Azure Container Registry. The file path can contain segments that are separated by the `/` character.
- **tag**: Is used to specify a version for the module.

For example:

```bicep
module stgModule 'br:exampleregistry.azurecr.io/bicep/modules/storage:v1' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: 'examplestg1'
  }
}
```

When you reference a module in a registry, the Bicep extension in Visual Studio Code automatically calls [bicep restore](bicep-cli.md#restore) to copy the external module to the local cache. It takes a few moments to restore the external module. If IntelliSense for the module doesn't work immediately, wait for the restore to complete.

The full path for a module in a registry can be long. Instead of providing the full path each time you want to use the module, [configure aliases in the bicepconfig.json file](bicep-config-modules.md#aliases-for-modules). The aliases make it easier to reference the module. For example, with an alias, you can shorten the path to:

```bicep
module stgModule 'br/ContosoModules:storage:v1' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: 'examplestg1'
  }
}
```

The public module registry has a predefined alias:

```bicep
module storage 'br/public:avm/res/storage/storage-account:0.9.0' = {
  name: 'myStorage'
  params: {
    name: 'store${resourceGroup().name}'
  }
}
```

You can override the public alias in the _bicepconfig.json_ file.

### File in template spec

After you create a [template spec](../bicep/template-specs.md), link to that template spec in a module. Specify the template spec in the following format:

```bicep
module <symbolic-name> 'ts:<sub-id>/<rg-name>/<template-spec-name>:<version>' = {
```

To simplify your Bicep file, [create an alias](bicep-config-modules.md) for the resource group that contains your template specs. When you use an alias, the syntax becomes:

```bicep
module <symbolic-name> 'ts/<alias>:<template-spec-name>:<version>' = {
```

The following module deploys a template spec to create a storage account. The subscription and resource group for the template spec is defined in the alias named `ContosoSpecs`.

```bicep
module stgModule 'ts/ContosoSpecs:storageSpec:2.0' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: 'examplestg1'
  }
}
```

## Use decorators

Decorators are written in the format `@expression` and are placed above module declarations. The following table shows the available decorators for modules.

| Decorator | Argument | Description |
| --------- | ----------- | ------- |
| [batchSize](./bicep-import.md#export-variables-types-and-functions) | none | Set up instances to deploy sequentially. |
| [description](#description) | string |Provide descriptions for the module.|

Decorators are in the [sys namespace](bicep-functions.md#namespaces-for-functions). If you need to differentiate a decorator from another item with the same name, preface the decorator with `sys`. For example, if your Bicep file includes a parameter named `description`, you must add the `sys` namespace when you use the `description` decorator.

### BatchSize

You can apply `@batchSize()` only to a resource or module definition that uses a [`for` expression](./loops.md).

By default, modules are deployed in parallel. When you add the `@batchSize(int)` decorator, you deploy instances serially.

```bicep
@batchSize(3)
module storage 'br/public:avm/res/storage/storage-account:0.11.1' = [for storageName in storageAccounts: {
  name: 'myStorage'
  params: {
    name: 'store${resourceGroup().name}'
  }
}]
```

For more information, see [Deploy in batches](loops.md#deploy-in-batches).

### Description

To add explanation, add a description to module declarations. For example:

```bicep
@description('Create storage accounts referencing an AVM.')
module storage 'br/public:avm/res/storage/storage-account:0.9.0' = {
  name: 'myStorage'
  params: {
    name: 'store${resourceGroup().name}'
  }
}
```

You can use Markdown-formatted text for the description text.

## Parameters

The parameters you provide in your module definition match the parameters in the Bicep file.

The following Bicep example has three parameters: `storagePrefix`, `storageSKU`, and `location`. The `storageSKU` parameter has a default value, so you don't have to provide a value for that parameter during deployment.

```bicep
@minLength(3)
@maxLength(11)
param storagePrefix string

@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_RAGRS'
  'Standard_ZRS'
  'Premium_LRS'
  'Premium_ZRS'
  'Standard_GZRS'
  'Standard_RAGZRS'
])
param storageSKU string = 'Standard_LRS'

param location string

var uniqueStorageName = '${storagePrefix}${uniqueString(resourceGroup().id)}'

resource stg 'Microsoft.Storage/storageAccounts@2023-04-01' = {
  name: uniqueStorageName
  location: location
  sku: {
    name: storageSKU
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
  }
}

output storageEndpoint object = stg.properties.primaryEndpoints
```

To use the preceding example as a module, provide values for those parameters.

```bicep
targetScope = 'subscription'

@minLength(3)
@maxLength(11)
param namePrefix string

resource demoRG 'Microsoft.Resources/resourceGroups@2024-03-01' existing = {
  name: 'demogroup1'
}

module stgModule '../create-storage-account/main.bicep' = {
  name: 'storageDeploy'
  scope: demoRG
  params: {
    storagePrefix: namePrefix
    location: demoRG.location
  }
}

output storageEndpoint object = stgModule.outputs.storageEndpoint
```

## Set module scope

When you declare a module, set a scope for the module that's different than the scope for the Bicep file that contains it. Use the `scope` property to set the scope for the module. When the `scope` property isn't provided, the module is deployed at the parent's target scope.

The following Bicep file creates a resource group and a storage account in that resource group. The file is deployed to a subscription, but the module is scoped to the new resource group.

```bicep
// set the target scope for this file
targetScope = 'subscription'

@minLength(3)
@maxLength(11)
param namePrefix string

param location string = deployment().location

var resourceGroupName = '${namePrefix}rg'

resource newRG 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
}

module stgModule '../create-storage-account/main.bicep' = {
  name: 'storageDeploy'
  scope: newRG
  params: {
    storagePrefix: namePrefix
    location: location
  }
}

output storageEndpoint object = stgModule.outputs.storageEndpoint
```

The next example deploys storage accounts to two different resource groups. Both of these resource groups must already exist.

```bicep
targetScope = 'subscription'

resource firstRG 'Microsoft.Resources/resourceGroups@2024-03-01' existing = {
  name: 'demogroup1'
}

resource secondRG 'Microsoft.Resources/resourceGroups@2024-03-01' existing = {
  name: 'demogroup2'
}

module storage1 '../create-storage-account/main.bicep' = {
  name: 'westusdeploy'
  scope: firstRG
  params: {
    storagePrefix: 'stg1'
    location: 'westus'
  }
}

module storage2 '../create-storage-account/main.bicep' = {
  name: 'eastusdeploy'
  scope: secondRG
  params: {
    storagePrefix: 'stg2'
    location: 'eastus'
  }
}
```

Set the `scope` property to a valid scope object. If your Bicep file deploys a resource group, subscription, or management group, you can set the scope for a module to the symbolic name for that resource. Or you can use the scope functions to get a valid scope.

Those functions are:

- [resourceGroup](bicep-functions-scope.md#resourcegroup)
- [subscription](bicep-functions-scope.md#subscription)
- [managementGroup](bicep-functions-scope.md#managementgroup)
- [tenant](bicep-functions-scope.md#tenant)

The following example uses the `managementGroup` function to set the scope.

```bicep
param managementGroupName string

module mgDeploy 'main.bicep' = {
  name: 'deployToMG'
  scope: managementGroup(managementGroupName)
}
```

## Output

You can get values from a module and use them in the main Bicep file. To get an output value from a module, use the `outputs` property on the module object.

The first example creates a storage account and returns the primary endpoints.

```bicep
@minLength(3)
@maxLength(11)
param storagePrefix string

@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_RAGRS'
  'Standard_ZRS'
  'Premium_LRS'
  'Premium_ZRS'
  'Standard_GZRS'
  'Standard_RAGZRS'
])
param storageSKU string = 'Standard_LRS'

param location string

var uniqueStorageName = '${storagePrefix}${uniqueString(resourceGroup().id)}'

resource stg 'Microsoft.Storage/storageAccounts@2023-04-01' = {
  name: uniqueStorageName
  location: location
  sku: {
    name: storageSKU
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
  }
}

output storageEndpoint object = stg.properties.primaryEndpoints
```

When the property is used as a module, you can get that output value.

```bicep
targetScope = 'subscription'

@minLength(3)
@maxLength(11)
param namePrefix string

resource demoRG 'Microsoft.Resources/resourceGroups@2024-03-01' existing = {
  name: 'demogroup1'
}

module stgModule '../create-storage-account/main.bicep' = {
  name: 'storageDeploy'
  scope: demoRG
  params: {
    storagePrefix: namePrefix
    location: demoRG.location
  }
}

output storageEndpoint object = stgModule.outputs.storageEndpoint
```

## Related content

- For a tutorial, see [Deploy Azure resources by using Bicep templates](/training/modules/deploy-azure-resources-by-using-bicep-templates/).
- To pass a sensitive value to a module, use the [getSecret](bicep-functions-resource.md#getsecret) function.
