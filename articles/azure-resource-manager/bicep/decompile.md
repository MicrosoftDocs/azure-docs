---
title: Decompile ARM template JSON to Bicep
description: Describes commands for decompiling Azure Resource Manager templates to Bicep files.
ms.topic: conceptual
ms.date: 03/03/2023
ms.custom: devx-track-bicep, devx-track-arm-template
---

# Decompiling ARM template JSON to Bicep

This article describes how to decompile Azure Resource Manager templates (ARM templates) to Bicep files. You must have the [Bicep CLI installed](./install.md) to run the conversion commands.

> [!NOTE]
> From Visual Studio Code, you can directly create resource declarations by importing from existing resources. For more information, see [Bicep commands](./visual-studio-code.md#bicep-commands).
>
> Visual Studio Code enables you to paste JSON as Bicep. It automatically runs the decompile command. For more information, see [Paste JSON as Bicep](./visual-studio-code.md#paste-as-bicep).

Decompiling an ARM template helps you get started with Bicep development. If you have a library of ARM templates and want to use Bicep for future development, you can decompile them to Bicep. However, the Bicep file might need revisions to implement best practices for Bicep.

This article shows how to run the `decompile` command in Azure CLI. If you're not using Azure CLI, run the command without `az` at the start of the command. For example, `az bicep decompile` becomes ``bicep decompile``.

## Decompile from JSON to Bicep

To decompile ARM template JSON to Bicep, use:

```azurecli
az bicep decompile --file main.json
```

The command creates a file named _main.bicep_ in the same directory as _main.json_. If _main.bicep_ exists in the same directory, use the **--force** switch to overwrite the existing Bicep file.

You can also decompile ARM template JSON to Bicep from Visual Studio Code by using the **Decompile into Bicep** command. For more information, see [Visual Studio Code](./visual-studio-code.md#decompile-into-bicep).

> [!CAUTION]
> Decompilation attempts to convert the file, but there is no guaranteed mapping from ARM template JSON to Bicep. You may need to fix warnings and errors in the generated Bicep file. Or, decompilation can fail if an accurate conversion isn't possible. To report any issues or inaccurate conversions, [create an issue](https://github.com/Azure/bicep/issues).

The decompile and [build](bicep-cli.md#build) commands produce templates that are functionally equivalent. However, they might not be exactly the same in implementation. Converting a template from JSON to Bicep and then back to JSON probably results in a template with different syntax than the original template. When deployed, the converted templates produce the same results.

## Fix conversion issues

Suppose you have the following ARM template:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountType": {
      "type": "string",
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_ZRS",
        "Premium_LRS"
      ],
      "metadata": {
        "description": "Storage Account type"
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources."
      }
    }
  },
  "variables": {
    "storageAccountName": "[concat('store', uniquestring(resourceGroup().id))]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2019-06-01",
      "name": "[variables('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[parameters('storageAccountType')]"
      },
      "kind": "StorageV2",
      "properties": {}
    }
  ],
  "outputs": {
    "storageAccountName": {
      "type": "string",
      "value": "[variables('storageAccountName')]"
    }
  }
}
```

When you decompile it, you get:

```bicep
@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_ZRS'
  'Premium_LRS'
])
@description('Storage Account type')
param storageAccountType string = 'Standard_LRS'

@description('Location for all resources.')
param location string = resourceGroup().location

var storageAccountName_var = 'store${uniqueString(resourceGroup().id)}'

resource storageAccountName 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  name: storageAccountName_var
  location: location
  sku: {
    name: storageAccountType
  }
  kind: 'StorageV2'
  properties: {}
}

output storageAccountName string = storageAccountName_var
```

The decompiled file works, but it has some names that you might want to change. The variable `var storageAccountName_var` has an unusual naming convention. Let's change it to:

```bicep
var uniqueStorageName = 'store${uniqueString(resourceGroup().id)}'
```

To rename across the file, right-click the name, and then select **Rename symbol**. You can also use the **F2** hotkey.

The resource has a symbolic name that you might want to change. Instead of `storageAccountName` for the symbolic name, use `exampleStorage`.

```bicep
resource exampleStorage 'Microsoft.Storage/storageAccounts@2019-06-01' = {
```

The complete file is:

```bicep
@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_ZRS'
  'Premium_LRS'
])
@description('Storage Account type')
param storageAccountType string = 'Standard_LRS'

@description('Location for all resources.')
param location string = resourceGroup().location

var uniqueStorageName = 'store${uniqueString(resourceGroup().id)}'

resource exampleStorage 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  name: uniqueStorageName
  location: location
  sku: {
    name: storageAccountType
  }
  kind: 'StorageV2'
  properties: {}
}

output storageAccountName string = uniqueStorageName
```

## Export template and convert

You can export the template for a resource group, and then pass it directly to the `decompile` command. The following example shows how to decompile an exported template.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group export --name "your_resource_group_name" > main.json
az bicep decompile --file main.json
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Export-AzResourceGroup -ResourceGroupName "your_resource_group_name" -Path ./main.json
bicep decompile main.json
```

# [Portal](#tab/azure-portal)

[Export the template](../templates/export-template-portal.md) through the portal.

Use `bicep decompile <filename>` on the downloaded file.

---

## Side-by-side view

The [Bicep Playground](https://aka.ms/bicepdemo) enables you to view equivalent ARM template and Bicep files side by side. You can select **Sample Template** to see both versions. Or, select **Decompile** to upload your own ARM template and view the equivalent Bicep file.

## Next steps

To learn about all of the Bicep CLI commands, see [Bicep CLI commands](bicep-cli.md).
