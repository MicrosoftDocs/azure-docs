---
title: Bicep modules
description: Describes how to define a module in a Bicep file, and how to use module scopes.
ms.topic: conceptual
ms.date: 10/12/2021
---

# Bicep modules

Bicep enables you to divide deployments into modules. A module is just a Bicep file that is deployed from another Bicep file. By using modules, you can encapsulate complex details of your deployment and reuse files in different deployments. If you create a module registry, you can share modules with other people in your organization.

Bicep modules are converted into a single Azure Resource Manager template with [nested templates](../templates/linked-templates.md#nested-template) for deployment.

## Definition syntax

The basic syntax for defining a module is:

```bicep
module <module-symbolic-name> '<path-to-file>' = {
  name: '<linked-deployment-name>'
  params: {
    <parameter-names-and-values>
  }
}
```

So, a simple, real-world example would look like:

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/modules/local-file-definition.bicep" :::

Use the symbolic name to reference the module in another part of the Bicep file. For example, you can use the symbolic name to get the output from a module. The symbolic name may contain a-z, A-Z, 0-9, and '_'. The name can't start with a number. A module can't have the same name as a parameter, variable, or resource.

The path can be either a local file or a file in a registry. For more information, see [Path to module](#path-to-module).

The **name** property is required. It becomes the name of the nested deployment resource in the generated template.

If you need to **specify a scope** that is different than the scope for the main file, add the scope property. For more information, see [Set module scope](#set-module-scope).

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/modules/scope-definition.bicep" highlight="4" :::

To **conditionally deploy a module**, add an `if` expression. The use is similar to [conditionally deploying a resource](conditional-resource-deployment.md).

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/modules/conditional-definition.bicep" highlight="2" :::

To deploy **more than one instance** a module, add the `for` expression:

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/modules/iterative-definition.bicep" highlight="2" :::

For more information, see [Module iteration in Bicep](loop-modules.md).

## Path to module

The file for the module can be either a local file or an external file in a Bicep module registry. The syntax for both options are shown below.

### Local file

If the module is a **local file**, provide a relative path to that file. All paths in Bicep must be specified using the forward slash (/) directory separator to ensure consistent compilation across platforms. The Windows backslash (\\) character is unsupported. Paths can contain spaces.

For example, to deploy a file that is up one level in the directory from your main file, use:

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/modules/local-file-definition.bicep" highlight="1" :::

### File in registry

If you have [published a module to a registry](bicep-cli.md#publish), you can link to that module. Provide the name for the Azure container registry and a path to the module. Specify the module path with the following syntax:

```bicep
module <module-symbolic-name> 'br/<registry-name>.azurecr.io/<module-path>:<tag>'
```

- **br** is the schema name for a Bicep registry.
- **module path** is called `repository` in Azure Container Registry. The **module path** can contain segments that are separated by the `/` character.
- **tag** is used for specifying a version for the module.

For example:

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/modules/registry-definition.bicep" highlight="1" :::

Instead of providing the full path each time to a module in a registry, you can configure aliases in the [bicepconfig.json file](bicep-config.md). The aliases make it easier to reference the module.

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

resource stg 'Microsoft.Storage/storageAccounts@2019-04-01' = {
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
@minLength(3)
@maxLength(11)
param namePrefix string
param location string

module stgModule 'storageAccount.bicep' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: namePrefix
    location: location
  }
}

output storageEndpoint object = stgModule.outputs.storageEndpoint
```

## Output

Output is used to pass values to the parent Bicep files.

Like resources, modules are deployed in parallel unless they depend on other modules or resource deployments. To learn more about dependencies, see [Set resource dependencies](resource-declaration.md#set-resource-dependencies).

To get an output value from a module, retrieve the property value with syntax like: `stgModule.outputs.storageEndpoint` where `stgModule` is the identifier of the module.

## Set module scope

When declaring a module, you can set a scope for the module that is different than the scope for the containing Bicep file. Use the `scope` property to set the scope for the module. When the scope property isn't provided, the module is deployed at the parent's target scope.

The following Bicep file creates a resource group and a storage account in that resource group. The file is deployed to a subscription, but the module is scoped to the resource group.

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/modules/rg-and-storage.bicep" highlight="2,12,19" :::

The next example deploys storage accounts to two different resource groups. Both of these resource groups must already exist.

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/modules/scope-two-resource-groups.bicep" highlight="1,13,22" :::

Set the scope property to a valid scope object. If your Bicep file deploys a resource group, subscription, or management group, you can set the scope for a module to the symbolic name for that resource. Or, you can use the scope functions to get a valid scope.

Those functions are:

- [resourceGroup](bicep-functions-scope.md#resourcegroup)
- [subscription](bicep-functions-scope.md#subscription)
- [managementGroup](bicep-functions-scope.md#managementgroup)
- [tenant](bicep-functions-scope.md#tenant)

The following example uses the `managementGroup` function to set the scope.

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/modules/function-scope.bicep" highlight="5" :::

## Next steps

- For a tutorial, see [Deploy Azure resources by using Bicep templates](/learn/modules/deploy-azure-resources-by-using-bicep-templates/).
- To pass a sensitive value to a module, use the [getSecret](bicep-functions-resource.md#getsecret) function.
