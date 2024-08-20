---
title: Bicep modules
description: Describes how to define a module in a Bicep file, and how to use module scopes.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 08/20/2024
---

# Bicep modules

Bicep enables you to organize deployments into modules. A module is a Bicep file (or an Azure Resource Manager JSON template) that is deployed from another Bicep file. With modules, you improve the readability of your Bicep files by encapsulating complex details of your deployment. You can also easily reuse modules for different deployments.

To share modules with other people in your organization, create a [template spec](../bicep/template-specs.md), or [private registry](private-module-registry.md). Template specs and modules in the registry are only available to users with the correct permissions.

> [!TIP]
> The choice between module registry and template specs is mostly a matter of preference. There are a few things to consider when you choose between the two:
>
> - Module registry is only supported by Bicep. If you are not yet using Bicep, use template specs.
> - Content in the Bicep module registry can only be deployed from another Bicep file. Template specs can be deployed directly from the API, Azure PowerShell, Azure CLI, and the Azure portal. You can even use [`UiFormDefinition`](../templates/template-specs-create-portal-forms.md) to customize the portal deployment experience.
> - Bicep has some limited capabilities for embedding other project artifacts (including non-Bicep and non-ARM-template files. For example, PowerShell scripts, CLI scripts and other binaries) by using the [`loadTextContent`](./bicep-functions-files.md#loadtextcontent) and [`loadFileAsBase64`](./bicep-functions-files.md#loadfileasbase64) functions. Template specs can't package these artifacts.

Bicep modules are converted into a single Azure Resource Manager template with [nested templates](../templates/linked-templates.md#nested-template). For more information about how Bicep resolves configuration files and how Bicep merges user-defined configuration file with the default configuration file, see [Configuration file resolution process](./bicep-config.md#understand-the-file-resolution-process) and [Configuration file merge process](./bicep-config.md#understand-the-merge-process).

### Training resources

If you would rather learn about modules through step-by-step guidance, see [Create composable Bicep files by using modules](/training/modules/create-composable-bicep-files-using-modules/).

## Definition syntax

The basic syntax for defining a module is:

```bicep
module <symbolic-name> '<path-to-file>' = {
  name: '<linked-deployment-name>'
  params: {
    <parameter-names-and-values>
  }
}
```

So, a simple, real-world example would look like:

```bicep
module stgModule '../storageAccount.bicep' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: 'examplestg1'
  }
}
```

You can also use an ARM JSON template as a module:

```bicep
module stgModule '../storageAccount.json' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: 'examplestg1'
  }
}
```

Use the symbolic name to reference the module in another part of the Bicep file. For example, you can use the symbolic name to get the output from a module. The symbolic name might contain a-z, A-Z, 0-9, and underscore (`_`). The name can't start with a number. A module can't have the same name as a parameter, variable, or resource.

The path can be either a local file or a file in a registry. The local file can be either a Bicep file or an ARM JSON template. For more information, see [Path to module](#path-to-module).

The **name** property is required. It becomes the name of the nested deployment resource in the generated template.

If a module with a static name is deployed concurrently to the same scope, there's the potential for one deployment to interfere with the output from the other deployment. For example, if two Bicep files use the same module with the same static name (`examplemodule`) and targeted to the same resource group, one deployment might show the wrong output. If you're concerned about concurrent deployments to the same scope, give your module a unique name.

The following example concatenates the deployment name to the module name. If you provide a unique name for the deployment, the module name is also unique.

```bicep
module stgModule 'storageAccount.bicep' = {
  name: '${deployment().name}-storageDeploy'
  scope: resourceGroup('demoRG')
}
```

If you need to **specify a scope** that is different than the scope for the main file, add the scope property. For more information, see [Set module scope](#set-module-scope).

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

To **conditionally deploy a module**, add an `if` expression. The use is similar to [conditionally deploying a resource](conditional-resource-deployment.md).

```bicep
// conditional deployment
module <symbolic-name> '<path-to-file>' = if (<condition-to-deploy>) {
  name: '<linked-deployment-name>'
  params: {
    <parameter-names-and-values>
  }
}
```

To deploy **more than one instance** of a module, add the `for` expression. You can use the `batchSize` decorator to specify whether the instances are deployed serially or in parallel. For more information, see [Iterative loops in Bicep](loops.md).

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

Like resources, modules are deployed in parallel unless they depend on other modules or resources. Typically, you don't need to set dependencies as they're determined implicitly. If you need to set an explicit dependency, you can add `dependsOn` to the module definition. To learn more about dependencies, see [Resource dependencies](resource-dependencies.md).

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

## Path to module

The file for the module can be either a local file or an external file. The external file can be in template spec or a Bicep module registry. 

### Local file

If the module is a **local file**, provide a relative path to that file. All paths in Bicep must be specified using the forward slash (/) directory separator to ensure consistent compilation across platforms. The Windows backslash (\\) character is unsupported. Paths can contain spaces.

For example, to deploy a file that is up one level in the directory from your main file, use:

```bicep
module stgModule '../storageAccount.bicep' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: 'examplestg1'
  }
}
```

### File in registry

#### Public module registry

> [!NOTE]
> Non-AVM (Azure Verified Modules) modules are retired from the public module registry.

[Azure Verified Modules](https://azure.github.io/Azure-Verified-Modules/) are prebuilt, pretested, and preverified modules for deploying resources on Azure. Created and owned by Microsoft employees, these modules are designed to simplify and accelerate the deployment process for common Azure resources and configurations whilst also aligning to best practices; such as the Well-Architected Framework.

Browse to the [Azure Verified Modules Bicep Index](https://azure.github.io/Azure-Verified-Modules/indexes/bicep/)to see the list of modules available, select the highlighted numbers in the following screenshot to be taken directly to that filtered view.

:::image type="content" source="./media/modules/bicep-azure-verified-modules-avm.png" alt-text="The screenshot of Azure Verified Modules (AVM).":::

The module list shows the latest version. Select the version number to see a list of available versions:

:::image type="content" source="./media/modules/bicep-azure-verified-modules-avm-version.png" alt-text="The screenshot of Azure Verified Modules(AVM) versions.":::

To link to a public module, specify the module path with the following syntax:

```bicep
module <symbolic-name> 'br/public:<file-path>:<tag>' = {}
```

- **br/public** is the alias for public modules. You can customize this alias in the [Bicep configuration file](./bicep-config-modules.md).
- **file path** can contain segments that can be separated by the `/` character.
- **tag** is used for specifying a version for the module.

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
> **br/public** is the alias for public modules. It can also be written as:
>
> ```bicep
> module <symbolic-name> 'br:mcr.microsoft.com/bicep/<file-path>:<tag>' = {}
> ```
>

#### Private module registry

If you've [published a module to a registry](bicep-cli.md#publish), you can link to that module. Provide the name for the Azure container registry and a path to the module. Specify the module path with the following syntax:

```bicep
module <symbolic-name> 'br:<registry-name>.azurecr.io/<file-path>:<tag>' = {
```

- **br** is the scheme name for a Bicep registry.
- **file path** is called `repository` in Azure Container Registry. The **file path** can contain segments that are separated by the `/` character.
- **tag** is used for specifying a version for the module.

For example:

```bicep
module stgModule 'br:exampleregistry.azurecr.io/bicep/modules/storage:v1' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: 'examplestg1'
  }
}
```

When you reference a module in a registry, the Bicep extension in Visual Studio Code automatically calls [bicep restore](bicep-cli.md#restore) to copy the external module to the local cache. It takes a few moments to restore the external module. If intellisense for the module doesn't work immediately, wait for the restore to complete.

The full path for a module in a registry can be long. Instead of providing the full path each time you want to use the module, you can [configure aliases in the bicepconfig.json file](bicep-config-modules.md#aliases-for-modules). The aliases make it easier to reference the module. For example, with an alias, you can shorten the path to:

```bicep
module stgModule 'br/ContosoModules:storage:v1' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: 'examplestg1'
  }
}
```

An alias for the public module registry has been predefined:

```bicep
module storage 'br/public:avm/res/storage/storage-account:0.9.0' = {
  name: 'myStorage'
  params: {
    name: 'store${resourceGroup().name}'
  }
}
```

You can override the public alias in the bicepconfig.json file.

### File in template spec

After creating a [template spec](../bicep/template-specs.md), you can link to that template spec in a module. Specify the template spec in the following format:

```bicep
module <symbolic-name> 'ts:<sub-id>/<rg-name>/<template-spec-name>:<version>' = {
```

However, you can simplify your Bicep file by [creating an alias](bicep-config-modules.md) for the resource group that contains your template specs. When you use an alias, the syntax becomes:

```bicep
module <symbolic-name> 'ts/<alias>:<template-spec-name>:<version>' = {
```

The following module deploys a template spec to create a storage account. The subscription and resource group for the template spec is defined in the alias named **ContosoSpecs**.

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
| [description](#description) | string | Text that explains how to use the variable.|
| [batchSize](./bicep-import.md#export-variables-types-and-functions) | none | Set up instances to deploy sequentially. |

Decorators are in the [sys namespace](bicep-functions.md#namespaces-for-functions). If you need to differentiate a decorator from another item with the same name, preface the decorator with `sys`. For example, if your Bicep file includes a parameter named `description`, you must add the sys namespace when using the **description** decorator.

### Description

To add explaination, add a description to module declarations. For example:

```bicep
@description('Create storage accounts referencing an AVM.')
module storage 'br/public:avm/res/storage/storage-account:0.9.0' = {
  name: 'myStorage'
  params: {
    name: 'store${resourceGroup().name}'
  }
}
```

Markdown-formatted text can be used for the description text.

### BatchSize

You can only apply `@batchSize()` to a resource or module definition that uses a [`for` expression](./loops.md).

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

## Parameters

The parameters you provide in your module definition match the parameters in the Bicep file.

The following Bicep example has three parameters - storagePrefix, storageSKU, and location. The storageSKU parameter has a default value so you don't have to provide a value for that parameter during deployment.

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

When declaring a module, you can set a scope for the module that is different than the scope for the containing Bicep file. Use the `scope` property to set the scope for the module. When the scope property isn't provided, the module is deployed at the parent's target scope.

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

Set the scope property to a valid scope object. If your Bicep file deploys a resource group, subscription, or management group, you can set the scope for a module to the symbolic name for that resource. Or, you can use the scope functions to get a valid scope.

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

When used as module, you can get that output value.

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

## Next steps

- For a tutorial, see [Deploy Azure resources by using Bicep templates](/training/modules/deploy-azure-resources-by-using-bicep-templates/).
- To pass a sensitive value to a module, use the [getSecret](bicep-functions-resource.md#getsecret) function.
