---
title: Bicep file structure and syntax
description: Describes the structure and properties of a Bicep file using declarative syntax.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 09/11/2023
---

# Understand the structure and syntax of Bicep files

This article describes the structure and syntax of a Bicep file. It presents the different sections of the file and the properties that are available in those sections.

For a step-by-step tutorial that guides you through the process of creating a Bicep file, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).

## Bicep format

Bicep is a declarative language, which means the elements can appear in any order. Unlike imperative languages, the order of elements doesn't affect how deployment is processed.

A Bicep file has the following elements.

```bicep
metadata <metadata-name> = ANY

targetScope = '<scope>'

type <user-defined-data-type-name> = <type-expression>

func <user-defined-function-name> (<argument-name> <data-type>, <argument-name> <data-type>, ...) <function-data-type> => <expression>

@<decorator>(<argument>)
param <parameter-name> <parameter-data-type> = <default-value>

var <variable-name> = <variable-value>

resource <resource-symbolic-name> '<resource-type>@<api-version>' = {
  <resource-properties>
}

module <module-symbolic-name> '<path-to-file>' = {
  name: '<linked-deployment-name>'
  params: {
    <parameter-names-and-values>
  }
}

output <output-name> <output-data-type> = <output-value>
```

The following example shows an implementation of these elements.

```bicep
metadata description = 'Creates a storage account and a web app'

@description('The prefix to use for the storage account name.')
@minLength(3)
@maxLength(11)
param storagePrefix string

param storageSKU string = 'Standard_LRS'
param location string = resourceGroup().location

var uniqueStorageName = '${storagePrefix}${uniqueString(resourceGroup().id)}'

resource stg 'Microsoft.Storage/storageAccounts@2022-09-01' = {
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

module webModule './webApp.bicep' = {
  name: 'webDeploy'
  params: {
    skuName: 'S1'
    location: location
  }
}
```

## Metadata

Metadata in Bicep is an untyped value that can be included in Bicep files. It allows you to provide supplementary information about your Bicep files, including details like its name, description, author, creation date, and more.

## Target scope

By default, the target scope is set to `resourceGroup`. If you're deploying at the resource group level, you don't need to set the target scope in your Bicep file.

The allowed values are:

* **resourceGroup** - default value, used for [resource group deployments](deploy-to-resource-group.md).
* **subscription** - used for [subscription deployments](deploy-to-subscription.md).
* **managementGroup** - used for [management group deployments](deploy-to-management-group.md).
* **tenant** - used for [tenant deployments](deploy-to-tenant.md).

In a module, you can specify a scope that is different than the scope for the rest of the Bicep file. For more information, see [Configure module scope](modules.md#set-module-scope)

## Types

You can use the `type` statement to define user-defined data types.

```bicep
param location string = resourceGroup().location

type storageAccountSkuType = 'Standard_LRS' | 'Standard_GRS'

type storageAccountConfigType = {
  name: string
  sku: storageAccountSkuType
}

param storageAccountConfig storageAccountConfigType = {
  name: 'storage${uniqueString(resourceGroup().id)}'
  sku: 'Standard_LRS'
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountConfig.name
  location: location
  sku: {
    name: storageAccountConfig.sku
  }
  kind: 'StorageV2'
}
```

For more information, see [User-defined data types](./user-defined-data-types.md).

## Functions (Preview)

> [!NOTE]
> To enable the preview feature, see [Enable experimental features](./bicep-config.md#enable-experimental-features).

In your Bicep file, you can create your own functions in addition to using the [standard Bicep functions](./bicep-functions.md) that are automatically available within your Bicep files. Create your own functions when you have complicated expressions that are used repeatedly in your Bicep files.

```bicep
func buildUrl(https bool, hostname string, path string) string => '${https ? 'https' : 'http'}://${hostname}${empty(path) ? '' : '/${path}'}'

output azureUrl string = buildUrl(true, 'microsoft.com', 'azure')
```

For more information, see [User-defined functions](./user-defined-functions.md).

## Parameters

Use parameters for values that need to vary for different deployments. You can define a default value for the parameter that is used if no value is provided during deployment.

For example, you can add a SKU parameter to specify different sizes for a resource. You might pass in different values depending on whether you're deploying to test or production.

```bicep
param storageSKU string = 'Standard_LRS'
```

The parameter is available for use in your Bicep file.

```bicep
sku: {
  name: storageSKU
}
```

For more information, see [Parameters in Bicep](./parameters.md).

## Parameter decorators

You can add one or more decorators for each parameter. These decorators describe the parameter and define constraints for the values that are passed in. The following example shows one decorator but many others are available.

```bicep
@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_ZRS'
  'Premium_LRS'
])
param storageSKU string = 'Standard_LRS'
```

For more information, including descriptions of all available decorators, see [Decorators](parameters.md#decorators).

## Variables

You can make your Bicep file more readable by encapsulating complex expressions in a variable. For example, you might add a variable for a resource name that is constructed by concatenating several values together.

```bicep
var uniqueStorageName = '${storagePrefix}${uniqueString(resourceGroup().id)}'
```

Apply this variable wherever you need the complex expression.

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2019-04-01' = {
  name: uniqueStorageName
```

For more information, see [Variables in Bicep](./variables.md).

## Resources

Use the `resource` keyword to define a resource to deploy. Your resource declaration includes a symbolic name for the resource. You use this symbolic name in other parts of the Bicep file to get a value from the resource.

The resource declaration includes the resource type and API version. Within the body of the resource declaration, include properties that are specific to the resource type.

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2019-06-01' = {
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
```

For more information, see [Resource declaration in Bicep](resource-declaration.md).

Some resources have a parent/child relationship. You can define a child resource either inside the parent resource or outside of it.

The following example shows how to define a child resource within a parent resource. It contains a storage account with a child resource (file service) that is defined within the storage account. The file service also has a child resource (share) that is defined within it.

:::code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/child-resource-name-type/insidedeclaration.bicep" highlight="9,12":::

The next example shows how to define a child resource outside of the parent resource. You use the parent property to identify a parent/child relationship. The same three resources are defined.

:::code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/child-resource-name-type/outsidedeclaration.bicep" highlight="10,12,15,17":::

For more information, see [Set name and type for child resources in Bicep](child-resource-name-type.md).

## Modules

Modules enable you to reuse code from a Bicep file in other Bicep files. In the module declaration, you link to the file to reuse. When you deploy the Bicep file, the resources in the module are also deployed.

```bicep
module webModule './webApp.bicep' = {
  name: 'webDeploy'
  params: {
    skuName: 'S1'
    location: location
  }
}
```

The symbolic name enables you to reference the module from somewhere else in the file. For example, you can get an output value from a module by using the symbolic name and the name of the output value.

For more information, see [Use Bicep modules](./modules.md).

## Resource and module decorators

You can add a decorator to a resource or module definition. The only supported decorator is `batchSize(int)`. You can only apply it to a resource or module definition that uses a `for` expression.

By default, resources are deployed in parallel. When you add the `batchSize` decorator, you deploy instances serially.

```bicep
@batchSize(3)
resource storageAccountResources 'Microsoft.Storage/storageAccounts@2019-06-01' = [for storageName in storageAccounts: {
  ...
}]
```

For more information, see [Deploy in batches](loops.md#deploy-in-batches).

## Outputs

Use outputs to return values from the deployment. Typically, you return a value from a deployed resource when you need to reuse that value for another operation.

```bicep
output storageEndpoint object = stg.properties.primaryEndpoints
```

For more information, see [Outputs in Bicep](./outputs.md).

## Loops

You can add iterative loops to your Bicep file to define multiple copies of a:

* resource
* module
* variable
* property
* output

Use the `for` expression to define a loop.

```bicep
param moduleCount int = 2

module stgModule './example.bicep' = [for i in range(0, moduleCount): {
  name: '${i}deployModule'
  params: {
  }
}]
```

You can iterate over an array, object, or integer index.

For more information, see [Iterative loops in Bicep](loops.md).

## Conditional deployment

You can add a resource or module to your Bicep file that is conditionally deployed. During deployment, the condition is evaluated and the result determines whether the resource or module is deployed. Use the `if` expression to define a conditional deployment.

```bicep
param deployZone bool

resource dnsZone 'Microsoft.Network/dnszones@2018-05-01' = if (deployZone) {
  name: 'myZone'
  location: 'global'
}
```

For more information, see [Conditional deployment in Bicep](conditional-resource-deployment.md).

## Whitespace

Spaces and tabs are ignored when authoring Bicep files.

Bicep is newline sensitive. For example:

```bicep
resource sa 'Microsoft.Storage/storageAccounts@2019-06-01' = if (newOrExisting == 'new') {
  ...
}
```

Can't be written as:

```bicep
resource sa 'Microsoft.Storage/storageAccounts@2019-06-01' =
    if (newOrExisting == 'new') {
      ...
    }
```

Define [objects](./data-types.md#objects) and [arrays](./data-types.md#arrays) in multiple lines.

## Comments

Use `//` for single-line comments or `/* ... */` for multi-line comments

The following example shows a single-line comment.

```bicep
// This is your primary NIC.
resource nic1 'Microsoft.Network/networkInterfaces@2020-06-01' = {
   ...
}
```

The following example shows a multi-line comment.

```bicep
/*
  This Bicep file assumes the key vault already exists and
  is in same subscription and resource group as the deployment.
*/
param existingKeyVaultName string
```

## Multi-line strings

You can break a string into multiple lines. Use three single quote characters `'''` to start and end the multi-line string.

Characters within the multi-line string are handled as-is. Escape characters are unnecessary. You can't include `'''` in the multi-line string. String interpolation isn't currently supported.

You can either start your string right after the opening `'''` or include a new line. In either case, the resulting string doesn't include a new line. Depending on the line endings in your Bicep file, new lines are interpreted as `\r\n` or `\n`.

The following example shows a multi-line string.

```bicep
var stringVar = '''
this is multi-line
  string with formatting
  preserved.
'''
```

The preceding example is equivalent to the following JSON.

```json
"variables": {
  "stringVar": "this is multi-line\r\n  string with formatting\r\n  preserved.\r\n"
}
```

## Multiple-line declarations

You can now use multiple lines in function, array and object declarations. This feature requires **Bicep version 0.7.4 or later**.

In the following example, the `resourceGroup()` definition is broken into multiple lines.

```bicep
var foo = resourceGroup(
  mySubscription,
  myRgName)
```

See [Arrays](./data-types.md#arrays) and [Objects](./data-types.md#objects) for multiple-line declaration samples.

## Known limitations

* No support for the concept of apiProfile, which is used to map a single apiProfile to a set apiVersion for each resource type.
* No support for user-defined functions.
* Some Bicep features require a corresponding change to the intermediate language (Azure Resource Manager JSON templates). We announce these features as available when all of the required updates have been deployed to global Azure. If you're using a different environment, such as Azure Stack, there may be a delay in the availability of the feature. The Bicep feature is only available when the intermediate language has also been updated in that environment.

## Next steps

For an introduction to Bicep, see [What is Bicep?](./overview.md). For Bicep data types, see [Data types](./data-types.md).
