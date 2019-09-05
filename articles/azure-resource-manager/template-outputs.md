---
title: Outputs in Azure Resource Manager template
description: Describes how to define output values in an Azure Resource Manager template. 
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 09/05/2019
ms.author: tomfitz
---
# Outputs in Azure Resource Manager template

This article describes how to define output values in your Azure Resource Manager template. You use outputs when you need to return values from the deployed resources.

## Define output values

The following example shows how to return the resource ID for a public IP address:

```json
"outputs": {
  "resourceID": {
    "type": "string",
    "value": "[resourceId('Microsoft.Network/publicIPAddresses', parameters('publicIPAddresses_name'))]"
  }
}
```

## Conditional output

In the outputs section, you can conditionally return a value. Typically, you use condition in the outputs when you've [conditionally deployed](conditional-resource-deployment.md) a resource. The following example shows how to conditionally return the resource ID for a public IP address based on whether a new one was deployed:

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

## Linked templates

To retrieve the output value from a linked template, use the [reference](resource-group-template-functions-resource.md#reference) function in the parent template. The syntax in the parent template is:

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

You can't use the `reference` function in the outputs section of a [nested template](resource-group-linked-templates.md#link-or-nest-a-template). To return the values for a deployed resource in a nested template, convert your nested template to a linked template.

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
az group deployment show \
  -g <resource-group-name> \
  -n <deployment-name> \
  --query properties.outputs.resourceID.value
```

---

## Example templates

The following examples demonstrate scenarios for using outputs.

|Template  |Description  |
|---------|---------|
|[Copy variables](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/copyvariables.json) | Creates complex variables and outputs those values. Doesn't deploy any resources. |
|[Public IP address](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/public-ip.json) | Creates a public IP address and outputs the resource ID. |
|[Load balancer](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/public-ip-parentloadbalancer.json) | Links to the preceding template. Uses the resource ID in the output when creating the load balancer. |

## Next steps

* To learn about the available properties for outputs, see [Understand the structure and syntax of Azure Resource Manager templates](resource-group-authoring-templates.md).
* For recommendations about creating outputs, see [Best practices - outputs](template-best-practices.md#outputs).
