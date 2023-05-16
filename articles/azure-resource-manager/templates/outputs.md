---
title: Outputs in templates
description: Describes how to define output values in an Azure Resource Manager template (ARM template).
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 09/28/2022
---

# Outputs in ARM templates

This article describes how to define output values in your Azure Resource Manager template (ARM template). You use outputs when you need to return values from the deployed resources.

The format of each output value must resolve to one of the [data types](data-types.md).

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [outputs](../bicep/outputs.md).

You are limited to 64 outputs in a template. For more information, see [Template limits](./best-practices.md#template-limits).

## Define output values

The following example shows how to return a property from a deployed resource.

Add the `outputs` section to the template. The output value gets the fully qualified domain name for a public IP address.

```json
"outputs": {
  "hostname": {
    "type": "string",
    "value": "[reference(resourceId('Microsoft.Network/publicIPAddresses', variables('publicIPAddressName'))).dnsSettings.fqdn]"
  },
}
```

If you need to output a property that has a hyphen in the name, use brackets around the name instead of dot notation. For example, use  `['property-name']` instead of `.property-name`.

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

## Conditional output

You can use the `condition` element to conditionally return a value. Typically, you use a conditional output when you've [conditionally deployed](conditional-resource-deployment.md) a resource. The following example shows how to conditionally return the resource ID for a public IP address based on whether a new one was deployed:

```json
"outputs": {
  "resourceID": {
    "condition": "[equals(parameters('publicIpNewOrExisting'), 'new')]",
    "type": "string",
    "value": "[resourceId('Microsoft.Network/publicIPAddresses', parameters('publicIPAddresses_name'))]"
  }
}
```

For a simple example of conditional output, see [conditional output template](https://github.com/bmoore-msft/AzureRM-Samples/blob/master/conditional-output/azuredeploy.json).

## Dynamic number of outputs

In some scenarios, you don't know the number of instances of a value you need to return when creating the template. You can return a variable number of values by using iterative output. Add the `copy` element to iterate an output.

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

For more information, see [Output iteration in ARM templates](copy-outputs.md).

## Linked templates

You can deploy related templates by using [linked templates](linked-templates.md). To retrieve the output value from a linked template, use the [reference](template-functions-resource.md#reference) function in the parent template. The syntax in the parent template is:

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

## Example template

The following template doesn't deploy any resources. It shows some ways of returning outputs of different types.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/outputs.json":::

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

## Object sorting in outputs

[!INCLUDE [JSON object ordering](../../../includes/resource-manager-object-ordering-arm-template.md)]

## Next steps

* To learn about the available properties for outputs, see [Understand the structure and syntax of ARM templates](./syntax.md).
