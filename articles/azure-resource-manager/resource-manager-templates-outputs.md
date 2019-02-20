---
title: Azure Resource Manager template outputs | Microsoft Docs
description: Describes how to define outputs for an Azure Resource Manager templates using declarative JSON syntax.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/14/2019
ms.author: tomfitz

---
# Outputs section in Azure Resource Manager templates

In the Outputs section, you specify values that are returned from deployment. For example, you could return the URI to access a deployed resource. Use the optional `condition` property to specify whether the output value is returned.

## Define and use output values

The following example shows how to return the resource ID for a public IP address:

```json
"outputs": {
  "resourceID": {
    "type": "string",
    "value": "[resourceId('Microsoft.Network/publicIPAddresses', parameters('publicIPAddresses_name'))]"
  }
}
```

The next example shows how to conditionally return the resource ID for a public IP address based on whether a new one was deployed:

```json
"outputs": {
  "resourceID": {
    "condition": "[equals(parameters('publicIpNewOrExisting'), 'new')]",
    "type": "string",
    "value": "[resourceId('Microsoft.Network/publicIPAddresses', parameters('publicIPAddresses_name'))]"
  }
}
```

After the deployment, you can retrieve the value with script. For PowerShell, use:

```powershell
(Get-AzResourceGroupDeployment -ResourceGroupName <resource-group-name> -Name <deployment-name>).Outputs.resourceID.value
```

For Azure CLI, use:

```azurecli-interactive
az group deployment show -g <resource-group-name> -n <deployment-name> --query properties.outputs.resourceID.value
```

You can retrieve the output value from a linked template by using the [reference](resource-group-template-functions-resource.md#reference) function. To get an output value from a linked template, retrieve the property value with syntax like: `"[reference('deploymentName').outputs.propertyName.value]"`.

When getting an output property from a linked template, the property name can't include a dash.

For example, you can set the IP address on a load balancer by retrieving a value from a linked template.

```json
"publicIPAddress": {
    "id": "[reference('linkedTemplate').outputs.resourceID.value]"
}
```

You can't use the `reference` function in the outputs section of a [nested template](resource-group-linked-templates.md#link-or-nest-a-template). To return the values for a deployed resource in a nested template, convert your nested template to a linked template.

## Available properties

The following example shows the structure of an output definition:

```json
"outputs": {
    "<outputName>" : {
        "condition": "<boolean-value-whether-to-output-value>",
        "type" : "<type-of-output-value>",
        "value": "<output-value-expression>"
    }
}
```

| Element name | Required | Description |
|:--- |:--- |:--- |
| outputName |Yes |Name of the output value. Must be a valid JavaScript identifier. |
| condition |No | Boolean value that indicates whether this output value is returned. When `true`, the value is included in the output for the deployment. When `false`, the output value is skipped for this deployment. When not specified, the default value is `true`. |
| type |Yes |Type of the output value. Output values support the same types as template input parameters. |
| value |Yes |Template language expression that is evaluated and returned as output value. |

For information about adding comments, see [Comments in templates](resource-group-authoring-templates.md#comments).

## Example templates

|Template  |Description  |
|---------|---------|
|[Copy variables](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/copyvariables.json) | Creates complex variables and outputs those values. Doesn't deploy any resources. |
|[Public IP address](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/public-ip.json) | Creates a public IP address and outputs the resource ID. |
|[Load balancer](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/public-ip-parentloadbalancer.json) | Links to the preceding template. Uses the resource ID in the output when creating the load balancer. |


## Next steps
* To view complete templates for many different types of solutions, see the [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/).
* For details about the functions you can use from within a template, see [Azure Resource Manager Template Functions](resource-group-template-functions.md).
* For recommendations about creating templates, see [Azure Resource Manager template best practices](template-best-practices.md).
