---
title: Outputs in templates
description: Describes how to define output values in an Azure Resource Manager template (ARM template) and Bicep file.
ms.topic: conceptual
ms.date: 02/16/2021
---

# Outputs in ARM templates

This article describes how to define output values in your Azure Resource Manager template (ARM template) and Bicep file. You use outputs when you need to return values from the deployed resources.

The format of each output value must resolve to one of the [data types](template-syntax.md#data-types).

[!INCLUDE [Bicep preview](../../../includes/resource-manager-bicep-preview.md)]

## Define output values

The following example shows how to return the fully qualified domain name for a public IP address:

# [JSON](#tab/json)

```json
"outputs": {
  "hostname": {
      "type": "string",
      "value": "[reference(resourceId('Microsoft.Network/publicIPAddresses', variables('publicIPAddressName'))).dnsSettings.fqdn]"
    },
}
```

# [Bicep](#tab/bicep)

In the following example, `publicIP` is the symbolic name of a public IP address deployed in the Bicep file.

```bicep
output hostname string = publicIP.properties.dnsSettings.fqdn
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

Conditional output isn't currently available for Bicep.

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

To retrieve the output value from a linked template, use the [reference](template-functions-resource.md#reference) function in the parent template. The syntax in the parent template is:

```json
"[reference('<deploymentName>').outputs.<propertyName>.value]"
```

When getting an output property from a linked template, the property name can't include a dash.

The following example shows how to set the IP address on a load balancer by retrieving a value from a linked template.

```json
"publicIPAddress": {
  "id": "[reference('linkedTemplate').outputs.resourceID.value]"
}
```

You can't use the `reference` function in the outputs section of a [nested template](linked-templates.md#nested-template). To return the values for a deployed resource in a nested template, convert your nested template to a linked template.

The [Public IP address template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/public-ip.json) creates a public IP address and outputs the resource ID. The [Load balancer template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/public-ip-parentloadbalancer.json) links to the preceding template. It uses the resource ID in the output when creating the load balancer.

## Example template

The following examples demonstrate scenarios for using outputs.

|Template  |Description  |
|---------|---------|
|[Copy variables](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/copyvariables.json) | Creates complex variables and outputs those values. Doesn't deploy any resources. |

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
