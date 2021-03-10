---
title: Outputs in templates
description: Describes how to define output values in an Azure Resource Manager template (ARM template) and Bicep file.
ms.topic: conceptual
ms.date: 02/19/2021
---

# Outputs in ARM templates

This article describes how to define output values in your Azure Resource Manager template (ARM template) and Bicep file. You use outputs when you need to return values from the deployed resources.

The format of each output value must resolve to one of the [data types](data-types.md).

[!INCLUDE [Bicep preview](../../../includes/resource-manager-bicep-preview.md)]

## Define output values

The following example shows how to return a property from a deployed resource.

# [JSON](#tab/json)

For JSON, add the `outputs` section to the template. The output value gets the fully qualified domain name for a public IP address.

```json
"outputs": {
  "hostname": {
      "type": "string",
      "value": "[reference(resourceId('Microsoft.Network/publicIPAddresses', variables('publicIPAddressName'))).dnsSettings.fqdn]"
    },
}
```

# [Bicep](#tab/bicep)

For Bicep, use the `output` keyword.

In the following example, `publicIP` is the identifier of a public IP address deployed in the Bicep file. The output value gets the fully qualified domain name for the public IP address.

```bicep
output hostname string = publicIP.properties.dnsSettings.fqdn
```

---

If you need to output a property that has a hyphen in the name, use brackets around the name instead of dot notation. For example, use  `['property-name']` instead of `.property-name`.

# [JSON](#tab/json)

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "variables": {
        "user": {
            "user-name": "Test Person"
        }
    },
    "resources": [
    ],
    "outputs": {
        "nameResult": {
            "type": "string",
            "value": "[variables('user')['user-name']]"
        }
    }
}
```

# [Bicep](#tab/bicep)

```bicep
var user = {
  'user-name': 'Test Person'
}

output stringOutput string = user['user-name']
```

---

## Conditional output

You can conditionally return a value. Typically, you use a conditional output when you've [conditionally deployed](conditional-resource-deployment.md) a resource. The following example shows how to conditionally return the resource ID for a public IP address based on whether a new one was deployed:

# [JSON](#tab/json)

In JSON, add the `condition` element to define whether the output is returned.

```json
"outputs": {
  "resourceID": {
    "condition": "[equals(parameters('publicIpNewOrExisting'), 'new')]",
    "type": "string",
    "value": "[resourceId('Microsoft.Network/publicIPAddresses', parameters('publicIPAddresses_name'))]"
  }
}
```

# [Bicep](#tab/bicep)

To specify a conditional output in Bicep, use the `?` operator. The following example either returns an endpoint URL or an empty string depending on a condition.

```bicep
param deployStorage bool = true
param storageName string
param location string = resourceGroup().location

resource sa 'Microsoft.Storage/storageAccounts@2019-06-01' = if (deployStorage) {
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

output endpoint string = deployStorage ? sa.properties.primaryEndpoints.blob : ''
```

---

For a simple example of conditional output, see [conditional output template](https://github.com/bmoore-msft/AzureRM-Samples/blob/master/conditional-output/azuredeploy.json).

## Dynamic number of outputs

In some scenarios, you don't know the number of instances of a value you need to return when creating the template. You can return a variable number of values by using iterative output.

# [JSON](#tab/json)

In JSON, add the `copy` element to iterate an output.

```json
"outputs": {
  "storageEndpoints": {
    "type": "array",
    "copy": {
      "count": "[parameters('storageCount')]",
      "input": "[reference(concat(copyIndex(), variables('baseName'))).primaryEndpoints.blob]"
    }
  }
}
```

# [Bicep](#tab/bicep)

Iterative output isn't currently available for Bicep.

---

For more information, see [Output iteration in ARM templates](copy-outputs.md).

## Linked templates

In JSON templates, you can deploy related templates by using [linked templates](linked-templates.md). To retrieve the output value from a linked template, use the [reference](template-functions-resource.md#reference) function in the parent template. The syntax in the parent template is:

```json
"[reference('<deploymentName>').outputs.<propertyName>.value]"
```

The following example shows how to set the IP address on a load balancer by retrieving a value from a linked template.

```json
"publicIPAddress": {
  "id": "[reference('linkedTemplate').outputs.resourceID.value]"
}
```

If the property name has a hyphen, use brackets around the name instead of dot notation.

```json
"publicIPAddress": {
  "id": "[reference('linkedTemplate').outputs['resource-ID'].value]"
}
```

You can't use the `reference` function in the outputs section of a [nested template](linked-templates.md#nested-template). To return the values for a deployed resource in a nested template, convert your nested template to a linked template.

The [Public IP address template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/public-ip.json) creates a public IP address and outputs the resource ID. The [Load balancer template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/public-ip-parentloadbalancer.json) links to the preceding template. It uses the resource ID in the output when creating the load balancer.

## Modules

In Bicep files, you can deploy related templates by using modules. To retrieve an output value from a module, use the following syntax:

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

# [JSON](#tab/json)

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/outputs.json":::

# [Bicep](#tab/bicep)

Bicep doesn't currently support loops.

:::code language="bicep" source="~/resourcemanager-templates/azure-resource-manager/outputs.bicep":::

---

## Get output values

When the deployment succeeds, the output values are automatically returned in the results of the deployment.

To get output values from the deployment history, you can use script.

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

* To learn about the available properties for outputs, see [Understand the structure and syntax of ARM templates](template-syntax.md).
