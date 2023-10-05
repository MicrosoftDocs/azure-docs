---
title: Outputs in Bicep
description: Describes how to define output values in Bicep
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 09/28/2022
---

# Outputs in Bicep

This article describes how to define output values in a Bicep file. You use outputs when you need to return values from the deployed resources. You are limited to 64 outputs in a Bicep file. For more information, see [Template limits](../templates/best-practices.md#template-limits).

## Define output values

The syntax for defining an output value is:

```bicep
output <name> <data-type> = <value>
```

An output can have the same name as a parameter, variable, module, or resource. Each output value must resolve to one of the [data types](data-types.md).

The following example shows how to return a property from a deployed resource. In the example, `publicIP` is the symbolic name for a public IP address that is deployed in the Bicep file. The output value gets the fully qualified domain name for the public IP address.

```bicep
output hostname string = publicIP.properties.dnsSettings.fqdn
```

The next example shows how to return outputs of different types.

:::code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/outputs/output.bicep":::

If you need to output a property that has a hyphen in the name, use brackets around the name instead of dot notation. For example, use  `['property-name']` instead of `.property-name`.

```bicep
var user = {
  'user-name': 'Test Person'
}

output stringOutput string = user['user-name']
```

## Conditional output

When the value to return depends on a condition in the deployment, use the the `?` operator.

```bicep
output <name> <data-type> = <condition> ? <true-value> : <false-value>
```

Typically, you use a conditional output when you've [conditionally deployed](conditional-resource-deployment.md) a resource. The following example shows how to conditionally return the resource ID for a public IP address based on whether a new one was deployed.

To specify a conditional output in Bicep, use the `?` operator. The following example either returns an endpoint URL or an empty string depending on a condition.

```bicep
param deployStorage bool = true
param storageName string
param location string = resourceGroup().location

resource myStorageAccount 'Microsoft.Storage/storageAccounts@2019-06-01' = if (deployStorage) {
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

resource nsg 'Microsoft.Network/networkSecurityGroups@2020-06-01' = [for name in orgNames: {
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

::: code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/outputs/module-output.bicep" highlight="14" :::

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
