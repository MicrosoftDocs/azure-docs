---
title: Declare resources in templates
description: Describes how to declare resources to deploy in an Azure Resource Manager template (ARM template).
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 03/20/2024
---

# Resource declaration in ARM templates

To deploy a resource through an Azure Resource Manager template (ARM template), you add a resource declaration. Use the `resources` array in a JSON template.

[languageVersion 2.0](./syntax.md#languageversion-20) makes a list of enhancements to ARM JSON templates, such as changing the resources declaration from an array to an object. Most the samples shown in this article still use `resources` array.  For languageVersion 2.0 specific information, see [Use symbolic name](#use-symbolic-name).





[!INCLUDE [VSCode ARM Tools extension doesn't support languageVersion 2.0](../../../includes/resource-manager-vscode-language-version-20.md)]

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [resource declaration](../bicep/resource-declaration.md).

You're limited to 800 resources in a template. For more information, see [Template limits](./best-practices.md#template-limits).

## Set resource type and version

When adding a resource to your template, start by setting the resource type and API version. These values determine the other properties that are available for the resource.

The following example shows how to set the resource type and API version for a storage account. The example doesn't show the full resource declaration.

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2019-06-01",
    ...
  }
]
```

## Set resource name

Each resource has a name. When setting the resource name, pay attention to the [rules and restrictions for resource names](../management/resource-name-rules.md).

```json
"parameters": {
  "storageAccountName": {
    "type": "string",
    "minLength": 3,
    "maxLength": 24
  }
},
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2019-06-01",
    "name": "[parameters('storageAccountName')]",
    ...
  }
]
```

## Set location

Many resources require a location. You can determine if the resource needs a location either through intellisense or [template reference](/azure/templates/). The following example adds a location parameter that is used for the storage account.

```json
"parameters": {
  "storageAccountName": {
    "type": "string",
    "minLength": 3,
    "maxLength": 24
  },
  "location": {
    "type": "string",
    "defaultValue": "[resourceGroup().location]"
  }
},
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2019-06-01",
    "name": "[parameters('storageAccountName')]",
    "location": "[parameters('location')]",
    ...
  }
]
```

For more information, see [Set resource location in ARM template](resource-location.md).

## Set tags

You can apply tags to a resource during deployment. Tags help you logically organize your deployed resources. For examples of the different ways you can specify the tags, see [ARM template tags](../management/tag-resources-templates.md).

## Set resource-specific properties

The preceding properties are generic to most resource types. After setting those values, you need to set the properties that are specific to the resource type you're deploying.

Use intellisense or [template reference](/azure/templates/) to determine which properties are available and which ones are required. The following example sets the remaining properties for a storage account.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string",
      "minLength": 3,
      "maxLength": 24
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "functions": [],
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2019-06-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS",
        "tier": "Standard"
      },
      "kind": "StorageV2",
      "properties": {
        "accessTier": "Hot"
      }
    }
  ]
}
```

## Use symbolic name

In [Bicep](../bicep/overview.md), each resource definition has a symbolic name. The symbolic name is used to reference the resource from the other parts of your Bicep file. To support symbolic name in ARM JSON templates, add `languageVersion` with the version `2.0`, and change the resource definition from an array to an object. When `languageVersion` is specified for a template, symbolic name must be specified for root level resources. For example:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.ContainerService/managedClusters",
      ...
    }
  ]
}
```

The preceding JSON can be written into the following JSON:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "languageVersion": "2.0",
  "contentVersion": "1.0.0.0",
  "resources": {
    "aks": {
      "type": "Microsoft.ContainerService/managedClusters",
      ...
    }
  }
}
```

Symbolic names are case-sensitive. The allowed characters for symbolic names are letters, numbers, and _. Symbolic names must be unique in a template, but can overlap with variable names, parameter names, and output names in a template.  In the following example, the symbolic name of the storage account resource has the same name as the output.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "languageVersion": "2.0",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string",
      "defaultValue": "[format('storage{0}', uniqueString(resourceGroup().id))]"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": {
    "myStorage": {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2022-09-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": {}
    }
  },
  "outputs": {
    "myStorage":{
      "type": "object",
      "value": "[reference('myStorage')]"
    }
  }
}
```

The [reference](./template-functions-resource.md#reference) function can use a resource's symbolic name, as shown in the preceding example. The reference function can no longer use a resource's name, for example, `reference(parameters('storageAccountName'))` isn't allowed.

If [Deployments resource](/azure/templates/microsoft.resources/deployments?tabs=json) is used in a symbolic-name deployment, use apiVersion `2020-09-01` or later.

### Declare existing resources

With [`languageVersion 2.0`](./syntax.md#languageversion-20) and using symbolic name for resource declaration, you can declare existing resources. A top-level resource property of `"existing": true` causes ARM to read rather than deploy a resource as shown in the following example:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "languageVersion": "2.0",

  "resources": {
    "storageAccount": {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2022-09-01",
      "name": "storageacct",
      "existing": true
    }
  },
  "outputs": {
    "saBlocksPlaintext": {
      "type": "bool",
      "value": "[ reference('storageAccount').supportsHttpsTrafficOnly]"
    }
  }
}
```

Existing resources don't need to define any properties other than `type`, `apiVersion`, and `name`.

## Next steps

* To conditionally deploy a resource, see [Conditional deployment in ARM templates](conditional-resource-deployment.md).
* To set resource dependencies, see [Define the order for deploying resources in ARM templates](./resource-dependency.md).
