---
title: Bicep file structure and syntax
description: This article describes the structure and properties of a Bicep file by using declarative syntax.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 08/20/2024
---

# Understand the structure and syntax of Bicep files

This article describes the structure and syntax of a Bicep file. It presents the different sections of the file and the properties that are available in those sections.

For a step-by-step tutorial that guides you through the process of creating a Bicep file, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).

## Bicep format

Bicep is a declarative language, which means the elements can appear in any order. Unlike imperative languages, the order of elements doesn't affect how deployment is processed.

A Bicep file has the following elements:

```bicep
@<decorator>(<argument>)
metadata <metadata-name> = ANY

targetScope = '<scope>'

@<decorator>(<argument>)
type <user-defined-data-type-name> = <type-expression>

@<decorator>(<argument>)
func <user-defined-function-name> (<argument-name> <data-type>, <argument-name> <data-type>, ...) <function-data-type> => <expression>

@<decorator>(<argument>)
param <parameter-name> <parameter-data-type> = <default-value>

@<decorator>(<argument>)
var <variable-name> = <variable-value>

@<decorator>(<argument>)
resource <resource-symbolic-name> '<resource-type>@<api-version>' = {
  <resource-properties>
}

@<decorator>(<argument>)
module <module-symbolic-name> '<path-to-file>' = {
  name: '<linked-deployment-name>'
  params: {
    <parameter-names-and-values>
  }
}

@<decorator>(<argument>)
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

module webModule './webApp.bicep' = {
  name: 'webDeploy'
  params: {
    skuName: 'S1'
    location: location
  }
}
```

## Metadata

Metadata in Bicep is an untyped value that you can include in your Bicep files. Metadata provides supplementary information about your Bicep files, like name, description, author, and creation date.

## Target scope

By default, the target scope is set to `resourceGroup`. If you deploy at the resource-group level, you don't need to set the target scope in your Bicep file.

The allowed values are:

* `resourceGroup`: Default value, used for [resource group deployments](deploy-to-resource-group.md).
* `subscription`: Used for [subscription deployments](deploy-to-subscription.md).
* `managementGroup`: Used for [management group deployments](deploy-to-management-group.md).
* `tenant`: Used for [tenant deployments](deploy-to-tenant.md).

In a module, you can specify a scope that's different than the scope for the rest of the Bicep file. For more information, see [Configure module scope](modules.md#set-module-scope).

## Decorators

You can add one or more decorators for each of the following elements:

* [param](#parameters)
* [var](#variables)
* [resource](#resources)
* [module](#modules)
* [output](#outputs)
* [func](#functions)
* [type](#types)

The following table lists the decorators.

| Decorator | Apply to element | Apply to data type | Argument | Description |
| --------- | ---- | ----------- | ------- |
| allowed | [param](./parameters.md#allowed-values) | all | array | Use this decorator to make sure the user provides correct values. This decorator is permitted only on `param` statements. To declare that a property must be one of a set of predefined values in a [`type`](./user-defined-data-types.md) or [`output`](./outputs.md) statement, use [union type syntax](./data-types.md#union-types). You can also use union type syntax in `param` statements.|
| batchSize |[module](./modules.md#batchsize), [resource](./resource-declaration.md#batchsize) | N/A | integer | Set up instances to deploy sequentially. |
| description | [func](./user-defined-functions.md#description), [param](./parameters.md#description), [module](./modules.md#description), [output](./outputs.md#description), [resource](./resource-declaration.md#description), [type](./user-defined-data-types.md#description), [var](./variables.md#description) | all | string | Provide descriptions for the elements. Use Markdown-formatted text for the description text. |
| discriminator | [param](./parameters.md#discriminator), [type](./user-defined-data-types.md#discriminator), [output](./outputs.md#discriminator) | object | string | Use this decorator to ensure that the correct subclass is identified and managed. For more information, see [Custom-tagged union data type](./data-types.md#custom-tagged-union-data-type).|
| export | [func](./user-defined-functions.md#export), [type](./user-defined-data-types.md#export), [var](./variables.md#export) | all | none| Indicates that another Bicep file can import the element. |
| maxLength | [param](./parameters.md#length-constraints), [output](./outputs.md#length-constraints), [type](./user-defined-data-types.md#length-constraints) | array, string | int | The maximum length for string and array elements. The value is inclusive. |
| maxValue | [param](./parameters.md#integer-constraints), [output](./outputs.md#integer-constraints), [type](./user-defined-data-types.md#integer-constraints) | int | int | The maximum value for the integer elements. This value is inclusive. |
| metadata | [func](./user-defined-functions.md#metadata), [output](./outputs.md#metadata), [param](./parameters.md#metadata), [type](./user-defined-data-types.md#metadata) | all | object | Custom properties to apply to the elements. Can include a description property that's equivalent to the description decorator. |
| minLength | [param](./parameters.md#length-constraints), [output](./outputs.md#length-constraints), [type](./user-defined-data-types.md#length-constraints) | array, string | int | The minimum length for string and array elements. The value is inclusive. |
| minValue | [param](./parameters.md#integer-constraints), [output](./outputs.md#integer-constraints), [type](./user-defined-data-types.md#integer-constraints) | int | int | The minimum value for the integer elements. This value is inclusive. |
| sealed | [param](./parameters.md#sealed), [type](./user-defined-data-types.md#sealed), [output](./outputs.md#sealed) | object | none | Elevate [BCP089](./diagnostics/bcp089.md) from a warning to an error when a property name of a user-defined data type is likely a typo. For more information, see [Elevate error level](./user-defined-data-types.md#elevate-error-level). |
| secure | [param](./parameters.md#secure-parameters), [type](./user-defined-data-types.md#secure-types) | string, object | none | Marks the parameter as secure. The value for a secure parameter isn't saved to the deployment history and isn't logged. For more information, see [Secure strings and objects](data-types.md#secure-strings-and-objects). |

## Parameters

Use parameters for values that need to vary for different deployments. You can define a default value for the parameter that's used if no value is provided during deployment.

For example, you can add an `SKU` parameter to specify different sizes for a resource. You might pass in different values depending on whether you're deploying to test or production.

```bicep
param storageSKU string = 'Standard_LRS'
```

The parameter is available for use in your Bicep file.

```bicep
sku: {
  name: storageSKU
}
```

You can add one or more decorators for each parameter. For more information, see [Use decorators](./parameters.md#use-decorators).

For more information, see [Parameters in Bicep](./parameters.md).

## Variables

To make your Bicep file more readable, encapsulate complex expressions in a variable. For example, you might add a variable for a resource name that's constructed by concatenating several values together.

```bicep
var uniqueStorageName = '${storagePrefix}${uniqueString(resourceGroup().id)}'
```

Apply this variable wherever you need the complex expression.

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2023-04-01' = {
  name: uniqueStorageName
```

You can add one or more decorators for each variable. For more information, see [Use decorators](./variables.md#use-decorators).

For more information, see [Variables in Bicep](./variables.md).

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

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-04-01' = {
  name: storageAccountConfig.name
  location: location
  sku: {
    name: storageAccountConfig.sku
  }
  kind: 'StorageV2'
}
```

You can add one or more decorators for each user-defined data type. For more information, see [Use decorators](./user-defined-data-types.md#use-decorators).

For more information, see [User-defined data types](./user-defined-data-types.md).

## Functions

In your Bicep file, you can create your own functions and also use the [standard Bicep functions](./bicep-functions.md) that are automatically available within your Bicep files. Create your own functions when you have complicated expressions that are used repeatedly in your Bicep files.

```bicep
func buildUrl(https bool, hostname string, path string) string => '${https ? 'https' : 'http'}://${hostname}${empty(path) ? '' : '/${path}'}'

output azureUrl string = buildUrl(true, 'microsoft.com', 'azure')
```

For more information, see [User-defined functions](./user-defined-functions.md).

## Resources

Use the `resource` keyword to define a resource to deploy. Your resource declaration includes a symbolic name for the resource. You use this symbolic name in other parts of the Bicep file to get a value from the resource.

The resource declaration includes the resource type and API version. Within the body of the resource declaration, include properties that are specific to the resource type.

```bicep
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
```

You can add one or more decorators for each resource. For more information, see [Use decorators](./resource-declaration.md#use-decorators).

For more information, see [Resource declaration in Bicep](resource-declaration.md).

Some resources have a parent/child relationship. You can define a child resource either inside the parent resource or outside of it.

The following example shows how to define a child resource within a parent resource. It contains a storage account with a child resource (file service) that's defined within the storage account. The file service also has a child resource (share) that's defined within it.

```bicep
resource storage 'Microsoft.Storage/storageAccounts@2023-04-01' = {
  name: 'examplestorage'
  location: resourceGroup().location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }

  resource service 'fileServices' = {
    name: 'default'

    resource share 'shares' = {
      name: 'exampleshare'
    }
  }
}
```

The next example shows how to define a child resource outside of the parent resource. You use the parent property to identify a parent/child relationship. The same three resources are defined.

```bicep
resource storage 'Microsoft.Storage/storageAccounts@2023-04-01' = {
  name: 'examplestorage'
  location: resourceGroup().location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource service 'Microsoft.Storage/storageAccounts/fileServices@2023-04-01' = {
  name: 'default'
  parent: storage
}

resource share 'Microsoft.Storage/storageAccounts/fileServices/shares@2023-04-01' = {
  name: 'exampleshare'
  parent: service
}
```

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

You can add one or more decorators for each module. For more information, see [Use decorators](./modules.md#use-decorators).

For more information, see [Use Bicep modules](./modules.md).

## Outputs

Use outputs to return values from the deployment. Typically, you return a value from a deployed resource when you need to reuse that value for another operation.

```bicep
output storageEndpoint object = stg.properties.primaryEndpoints
```

You can add one or more decorators for each output. For more information, see [Use decorators](./outputs.md#use-decorators).

For more information, see [Outputs in Bicep](./outputs.md).

## Loops

Add iterative loops to your Bicep file to define multiple copies of:

* A resource
* A module
* A variable
* A property
* An output

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

You can add a resource or module to your Bicep file that's conditionally deployed. During deployment, the condition is evaluated and the result determines whether the resource or module is deployed. Use the `if` expression to define a conditional deployment.

```bicep
param deployZone bool

resource dnsZone 'Microsoft.Network/dnsZones@2023-07-01-preview' = if (deployZone) {
  name: 'myZone'
  location: 'global'
}
```

For more information, see [Conditional deployment in Bicep](conditional-resource-deployment.md).

## Whitespace

Spaces and tabs are ignored when you author Bicep files.

Bicep is newline sensitive. For example:

```bicep
resource sa 'Microsoft.Storage/storageAccounts@2023-04-01' = if (newOrExisting == 'new') {
  ...
}
```

Can't be written as:

```bicep
resource sa 'Microsoft.Storage/storageAccounts@2023-04-01' =
    if (newOrExisting == 'new') {
      ...
    }
```

Define [objects](./data-types.md#objects) and [arrays](./data-types.md#arrays) in multiple lines.

## Comments

Use `//` for single-line comments or `/* ... */` for multiline comments.

The following example shows a single-line comment.

```bicep
// This is your primary NIC.
resource nic1 'Microsoft.Network/networkInterfaces@2023-11-01' = {
  ...
}
```

The following example shows a multiline comment.

```bicep
/*
  This Bicep file assumes the key vault already exists and
  is in same subscription and resource group as the deployment.
*/
param existingKeyVaultName string
```

## Multi-line strings

You can break a string into multiple lines. Use three single quotation marks `'''` to start and end the multi-line string.

Characters within the multi-line string are handled as is. Escape characters are unnecessary. You can't include `'''` in the multi-line string. String interpolation isn't currently supported.

You can start your string right after the opening `'''` or include a new line. In either case, the resulting string doesn't include a new line. Depending on the line endings in your Bicep file, new lines are interpreted as `\r\n` or `\n`.

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

You can now use multiple lines in function, array, and object declarations. This feature requires [Bicep CLI version 0.7.X or higher](./install.md).

In the following example, the `resourceGroup()` definition is broken into multiple lines.

```bicep
var foo = resourceGroup(
  mySubscription,
  myRgName)
```

For multiple-line declaration samples, see [arrays](./data-types.md#arrays) and [objects](./data-types.md#objects).

## Known limitations

* No support is available for the concept of `apiProfile`, which is used to map a single `apiProfile` to a set `apiVersion` for each resource type.
* User-defined functions aren't supported at the moment. An experimental feature is currently accessible. For more information, see [User-defined functions in Bicep](./user-defined-functions.md).
* Some Bicep features require a corresponding change to the intermediate language (Azure Resource Manager JSON templates). We announce these features as available after all the required updates are deployed to global Azure. If you use a different environment, such as Azure Stack, there might be a delay in the availability of the feature. The Bicep feature is available only after the intermediate language is also updated in that environment.

## Related content

* For an introduction to Bicep, see [What is Bicep?](./overview.md).
* For Bicep data types, see [Data types](./data-types.md).
