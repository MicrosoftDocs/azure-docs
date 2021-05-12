---
title: Bicep file structure and syntax
description: Describes the structure and properties of a Bicep file using declarative syntax.
ms.topic: conceptual
ms.date: 03/31/2021
---

# Understand the structure and syntax of Bicep files

This article describes the structure of a Bicep file. It presents the different sections of the file and the properties that are available in those sections.

This article is intended for users who have some familiarity with Bicep files. It provides detailed information about the structure of the template. For a step-by-step tutorial that guides you through the process of creating a Bicep file, see [Tutorial: Create and deploy first Azure Resource Manager Bicep file](bicep-tutorial-create-first-bicep.md).

## Template format

A Bicep file has the following elements. The elements can appear in any order.

```bicep
targetScope = '<scope>'

@<decorator>(<argument>)
param <parameter-name> <parameter-data-type> = <default-value>

var <variable-name> = <variable-value>

resource <resource-symbolic-name> '<resource-type>@<api-version>' = {
  <resource-properties>
}

// conditional deployment
resource <resource-symbolic-name> '<resource-type>@<api-version>' = if (<condition-to-deploy>) {
  <resource-properties>
}

// iterative deployment
@<decorator>(<argument>)
resource <resource-symbolic-name> '<resource-type>@<api-version>' = [for <item> in <collection>: {
  <resource-properties>
}]

module <module-symbolic-name> '<path-to-file>' = {
  name: '<linked-deployment-name>'
  params: {
    <parameter-names-and-values>
  }
}

// conditional deployment
module <module-symbolic-name> '<path-to-file>' = if (<condition-to-deploy>) {
  name: '<linked-deployment-name>'
  params: {
    <parameter-names-and-values>
  }
}

// iterative deployment
module <module-symbolic-name> '<path-to-file>' = [for <item> in <collection>: {
  name: '<linked-deployment-name>'
  params: {
    <parameter-names-and-values>
  }
}]

output <output-name> <output-data-type> = <output-value>
```

The following example shows an implementation of these elements.

```bicep
@minLength(3)
@maxLength(11)
param storagePrefix string

param storageSKU string = 'Standard_LRS'
param location string = resourceGroup().location

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

module webModule './webApp.bicep' = {
  name: 'webDeploy'
  params: {
    skuName: 'S1'
    location: location
  }
}

output storageEndpoint object = stg.properties.primaryEndpoints
```

## Target scope

By default, the target scope is set to `resourceGroup`. If you're deploying at the resource group level, you don't need to set the target scope in your Bicep file.

The allowed values are:

* **resourceGroup** - default value, used for [resource group deployments](deploy-to-resource-group.md).
* **subscription** - used for [subscription deployments](deploy-to-subscription.md).
* **managementGroup** - used for [management group deployments](deploy-to-management-group.md).
* **tenant** - used for [tenant deployments](deploy-to-tenant.md).

## Parameters

Use parameters for values that need to vary for different deployments. You can define a default value for the parameter that is used if no value is provided during deployment.

For example, you might add a SKU parameter to specify different sizes for a resource. You can use template functions for creating the default value, such as getting the resource group location.

```bicep
param storageSKU string = 'Standard_LRS'
param location string = resourceGroup().location
```

For the available data types, see [Data types in templates](data-types.md).

For more information, see [Parameters in templates](template-parameters.md).

## Parameter decorators

You can add one or more decorators for each parameter. These decorators define the values that are allowed for the parameter. The following example specifies the SKUs that can be deployed through the Bicep file.

```bicep
@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_ZRS'
  'Premium_LRS'
])
param storageSKU string = 'Standard_LRS'
```

The following table describes the available decorators and how to use them.

| Decorator | Apply to | Argument | Description |
| --------- | ---- | ----------- | ------- |
| allowed | all | array | Allowed values for the parameter. Use this decorator to make sure the user provides correct values. |
| description | all | string | Text that explains how to use the parameter. The description is displayed to users through the portal. |
| maxLength | array, string | int | The maximum length for string and array parameters. The value is inclusive. |
| maxValue | int | int | The maximum value for the integer parameter. This value is inclusive. |
| metadata | all | object | Custom properties to apply to the parameter. Can include a description property that is equivalent to the description decorator. |
| minLength | array, string | int | The minimum length for string and array parameters. The value is inclusive. |
| minValue | int | int | The minimum value for the integer parameter. This value is inclusive. |
| secure | string, object | none | Marks the parameter as secure. The value for a secure parameter isn't saved to the deployment history and isn't logged. For more information, see [Secure strings and objects](data-types.md#secure-strings-and-objects). |

## Variables

Use variables for complex expressions that are repeated in a Bicep file. For example, you might add a variable for a resource name that is constructed by concatenating several values together.

```bicep
var uniqueStorageName = '${storagePrefix}${uniqueString(resourceGroup().id)}'
```

You don't specify a [data type](data-types.md) for a variable. Instead, the data type is inferred from the value.

For more information, see [Variables in templates](template-variables.md).

## Resource

Use the `resource` keyword to define a resource to deploy. Your resource declaration includes a symbolic name for the resource. You'll use this symbolic name in other parts of the Bicep file if you need to get a value from the resource.

The resource declaration also includes the resource type and API version.

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

In your resource declaration, you include properties for the resource type. These properties are unique to each resource type.

For more information, see [Resource declaration in templates](resource-declaration.md).

To [conditionally deploy a resource](conditional-resource-deployment.md), add an `if` expression.

```bicep
resource sa 'Microsoft.Storage/storageAccounts@2019-06-01' = if (newOrExisting == 'new') {
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

To [deploy more than one instance](https://github.com/Azure/bicep/blob/main/docs/spec/loops.md) of a resource type, add a `for` expression. The expression can iterate over members of an array.

```bicep
resource sa 'Microsoft.Storage/storageAccounts@2019-06-01' = [for storageName in storageAccounts: {
  name: storageName
  location: location
  sku: {
    name: storageSKU
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
  }
}]
```

## Modules

Use modules to link to other Bicep files that contain code you want to reuse. The module contains one or more resources to deploy. Those resources are deployed along with any other resources in your Bicep file.

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

Like resources, you can conditionally or iteratively deploy a module. The syntax is the same for modules as resources.

For more information, see [Use Bicep modules](bicep-modules.md).

## Resource and module decorators

You can add a decorator to a resource or module definition. The only supported decorator is `batchSize(int)`. You can only apply it to a resource or module definition that uses a `for` expression.

By default, resources are deployed in parallel. You don't know the order in which they finish. When you add the `batchSize` decorator, you deploy instances serially. Use the integer argument to specify the number of instances to deploy in parallel.

```bicep
@batchSize(3)
resource storageAccountResources 'Microsoft.Storage/storageAccounts@2019-06-01' = [for storageName in storageAccounts: {
  ...
}]
```

For more information, see [Serial or Parallel](copy-resources.md#serial-or-parallel).

## Outputs

Use outputs to return value from the deployment. Typically, you return a value from a deployed resource when you need to reuse that value for another operation.

```bicep
output storageEndpoint object = stg.properties.primaryEndpoints
```

Specify a [data type](data-types.md) for the output value.

For more information, see [Outputs in templates](template-outputs.md).

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
  This template assumes the key vault already exists and
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

## Next steps

For an introduction to Bicep, see [What is Bicep?](bicep-overview.md).
