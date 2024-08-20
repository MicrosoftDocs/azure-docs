---
title: Outputs in Bicep
description: Describes how to define output values in Bicep
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 08/20/2024
---

# Outputs in Bicep

This article describes how to define output values in a Bicep file. You use outputs when you need to return values from the deployed resources. You are limited to 64 outputs in a Bicep file. For more information, see [Template limits](../templates/best-practices.md#template-limits).

## Define output values

The syntax for defining an output value is:

```bicep
output <name> <data-type or type-expression> = <value>
```

An output can have the same name as a parameter, variable, module, or resource. Each output value must resolve to one of the [data types](data-types.md), or [user-defined data type expression](./user-defined-data-types.md).

The following example shows how to return a property from a deployed resource. In the example, `publicIP` is the symbolic name for a public IP address that is deployed in the Bicep file. The output value gets the fully qualified domain name for the public IP address.

```bicep
output hostname string = publicIP.properties.dnsSettings.fqdn
```

The next example shows how to return outputs of different types.

```bicep
output stringOutput string = deployment().name
output integerOutput int = length(environment().authentication.audiences)
output booleanOutput bool = contains(deployment().name, 'demo')
output arrayOutput array = environment().authentication.audiences
output objectOutput object = subscription()
```

If you need to output a property that has a hyphen in the name, use brackets around the name instead of dot notation. For example, use  `['property-name']` instead of `.property-name`.

```bicep
var user = {
  'user-name': 'Test Person'
}

output stringOutput string = user['user-name']
```

The following example shows how to use type expression:

```bicep
param foo 'a' | 'b' = 'a'

output out 'a' | 'b' = foo
```

For more information, see [User-defined data types](./user-defined-data-types.md).

## Use decorators

Decorators are written in the format `@expression` and are placed above ouput declarations. The following table shows the available decorators for outputs.

| Decorator | Apply to | Argument | Description |
| --------- | ---- | ----------- | ------- |
| [description](#description) | all | string | Text that explains how to use the output. |
| [discriminator](#discriminator) | object | string | Use this decorator to ensure the correct subclass is identified and managed. For more information, see [Custom-tagged union data type](./data-types.md#custom-tagged-union-data-type).|
| [maxLength](#length-constraints) | array, string | int | The maximum length for string and array outputs. The value is inclusive. |
| [maxValue](#integer-constraints) | int | int | The maximum value for the integer output. This value is inclusive. |
| [metadata](#metadata) | all | object | Custom properties to apply to the output. Can include a description property that is equivalent to the description decorator. |
| [minLength](#length-constraints) | array, string | int | The minimum length for string and array outputs. The value is inclusive. |
| [minValue](#integer-constraints) | int | int | The minimum value for the integer output. This value is inclusive. |
| [sealed](#sealed) | object | none | Elevate [BCP089](./diagnostics/bcp089.md) from a warning to an error when a property name of a use-define data type is likely a typo. For more information, see [Elevate error level](./user-defined-data-types.md#elevate-error-level). |

Decorators are in the [sys namespace](bicep-functions.md#namespaces-for-functions). If you need to differentiate a decorator from another item with the same name, preface the decorator with `sys`. For example, if your Bicep file includes a parameter named `description`, you must add the sys namespace when using the **description** decorator.

```bicep
@sys.description('The name of the instance.')
param name string
@sys.description('The description of the instance to display.')
param description string
```

### Description

To add explaination, add a description to output declarations. For example:

```bicep
@description('Conditionally output the endpoint.')
output endpoint string = deployStorage ? myStorageAccount.properties.primaryEndpoints.blob : ''
```

Markdown-formatted text can be used for the description text.

### Discriminator

See [Custom-tagged union data type](./data-types.md#custom-tagged-union-data-type).

### Integer constraints

You can set minimum and maximum values for integer outputs. You can set one or both constraints.

```bicep
var thisMonth = 3

@minValue(1)
@maxValue(12)
output month int = thisMonth
```

### Length constraints

You can specify minimum and maximum lengths for string and array outputs. You can set one or both constraints. For strings, the length indicates the number of characters. For arrays, the length indicates the number of items in the array.

The following example declares two outputs. One output is for a storage account name that must have 3-24 characters. The other output is an array that must have from 1-5 items.

```bicep
var accountName = uniqueString(resourceGroup().id)
var appNames = [
  'SyncSphere'
  'DataWhiz'
  'FlowMatrix'
]

@minLength(3)
@maxLength(24)
output storageAccountName string = accountName

@minLength(1)
@maxLength(5)
output applicationNames array = appNames
```

### Metadata

If you have custom properties that you want to apply to an output, add a metadata decorator. Within the metadata, define an object with the custom names and values. The object you define for the metadata can contain properties of any name and type.

You might use this decorator to track information about the output that doesn't make sense to add to the [description](#description).

```bicep
var obj = {}
@description('Configuration values that are applied when the application starts.')
@metadata({
  source: 'database'
  contact: 'Web team'
})
output settings object = obj
```

When you provide a `@metadata()` decorator with a property that conflicts with another decorator, that decorator always takes precedence over anything in the `@metadata()` decorator. So, the conflicting property within the `@metadata()` value is redundant and will be replaced. For more information, see [No conflicting metadata](./linter-rule-no-conflicting-metadata.md).

### Sealed

See [Elevate error level](./user-defined-data-types.md#elevate-error-level).

## Conditional output

When the value to return depends on a condition in the deployment, use the `?` operator.

```bicep
output <name> <data-type> = <condition> ? <true-value> : <false-value>
```

Typically, you use a conditional output when you've [conditionally deployed](conditional-resource-deployment.md) a resource. The following example shows how to conditionally return the resource ID for a public IP address based on whether a new one was deployed.

To specify a conditional output in Bicep, use the `?` operator. The following example either returns an endpoint URL or an empty string depending on a condition.

```bicep
param deployStorage bool = true
param storageName string
param location string = resourceGroup().location

resource myStorageAccount 'Microsoft.Storage/storageAccounts@2023-04-01' = if (deployStorage) {
  name: storageName
  location: location
  kind: 'StorageV2'
  sku:{
    name:'Standard_LRS'
    tier: 'Standard'
  }
  properties: {
    accessTier: 'Hot'
  }
}

output endpoint string = deployStorage ? myStorageAccount.properties.primaryEndpoints.blob : ''
```

## Dynamic number of outputs

In some scenarios, you don't know the number of instances of a value you need to return when creating the template. You can return a variable number of values by using the `for` expression.

```bicep
output <name> <data-type> = [for <item> in <collection>: {
  ...
}]
```

The following example iterates over an array.

```bicep
param nsgLocation string = resourceGroup().location
param orgNames array = [
  'Contoso'
  'Fabrikam'
  'Coho'
]

resource nsg 'Microsoft.Network/networkSecurityGroups@2023-11-01' = [for name in orgNames: {
  name: 'nsg-${name}'
  location: nsgLocation
}]

output deployedNSGs array = [for (name, i) in orgNames: {
  orgName: name
  nsgName: nsg[i].name
  resourceId: nsg[i].id
}]
```

For more information about loops, see [Iterative loops in Bicep](loops.md).

## Outputs from modules

To get an output value from a module, use the following syntax:

```bicep
<module-name>.outputs.<property-name>
```

The following example shows how to set the IP address on a load balancer by retrieving a value from a module.

```bicep
module publicIP 'modules/public-ip-address.bicep' = {
  name: 'public-ip-address-module'
}

resource loadBalancer 'Microsoft.Network/loadBalancers@2023-11-01' = {
  name: loadBalancerName
  location: location
  properties: {
    frontendIPConfigurations: [
      {
        name: 'name'
        properties: {
          publicIPAddress: {
            id: publicIP.outputs.resourceId
          }
        }
      }
    ]
    // ...
  }
}
```

## Get output values

When the deployment succeeds, the output values are automatically returned in the results of the deployment.

To get output values from the deployment history, you can use Azure CLI or Azure PowerShell script.

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
(Get-AzResourceGroupDeployment `
  -ResourceGroupName <resource-group-name> `
  -Name <deployment-name>).Outputs.resourceID.value
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az deployment group show \
  -g <resource-group-name> \
  -n <deployment-name> \
  --query properties.outputs.resourceID.value
```

---

## Object sorting in outputs

[!INCLUDE [JSON object ordering](../../../includes/resource-manager-object-ordering-bicep.md)]

## Next steps

* To learn about the available properties for outputs, see [Understand the structure and syntax of Bicep](./file.md).
