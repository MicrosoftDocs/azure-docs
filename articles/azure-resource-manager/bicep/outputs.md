---
title: Outputs in Bicep
description: Describes how to define output values in Bicep
ms.topic: conceptual
ms.date: 06/01/2021
---

# Outputs in Bicep

This article describes how to define output values in a Bicep file. You use outputs when you need to return values from the deployed resources.

The format of each output value must resolve to one of the [data types](data-types.md).

## Define output values

The following example shows how to use the `output` keyword to return a property from a deployed resource.

In the following example, `publicIP` is the identifier (symbolic name) of a public IP address deployed in the Bicep file. The output value gets the fully qualified domain name for the public IP address.

```bicep
output hostname string = publicIP.properties.dnsSettings.fqdn
```

If you need to output a property that has a hyphen in the name, use brackets around the name instead of dot notation. For example, use  `['property-name']` instead of `.property-name`.

```bicep
var user = {
  'user-name': 'Test Person'
}

output stringOutput string = user['user-name']
```

## Conditional output

You can conditionally return a value. Typically, you use a conditional output when you've [conditionally deployed](conditional-resource-deployment.md) a resource. The following example shows how to conditionally return the resource ID for a public IP address based on whether a new one was deployed:

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

In some scenarios, you don't know the number of instances of a value you need to return when creating the template. You can return a variable number of values by using iterative output.

In Bicep, add a `for` expression that defines the conditions for the dynamic output. The following example iterates over an array.

```bicep
param nsgLocation string = resourceGroup().location
param nsgNames array = [
  'nsg1'
  'nsg2'
  'nsg3'
]

resource nsg 'Microsoft.Network/networkSecurityGroups@2020-06-01' = [for name in nsgNames: {
  name: name
  location: nsgLocation
}]

output nsgs array = [for (name, i) in nsgNames: {
  name: nsg[i].name
  resourceId: nsg[i].id
}]
```

You can also iterate over a range of integers. For more information, see [Output iteration in Bicep](loop-outputs.md).

## Modules

You can deploy related templates by using modules. To retrieve an output value from a module, use the following syntax:

```bicep
<module-name>.outputs.<property-name>
```

The following example shows how to set the IP address on a load balancer by retrieving a value from a module. The name of the module is `publicIP`.

```bicep
publicIPAddress: {
  id: publicIP.outputs.resourceID
}
```

## Example template

The following template doesn't deploy any resources. It shows some ways of returning outputs of different types.

Bicep doesn't currently support loops.

:::code language="bicep" source="~/resourcemanager-templates/azure-resource-manager/outputs.bicep":::

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

## Next steps

* To learn about the available properties for outputs, see [Understand the structure and syntax of Bicep](./file.md).
