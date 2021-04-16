---
title: Convert templates between JSON and Bicep
description: Describes commands for converting Azure Resource Manager templates from Bicep to JSON and from JSON to Bicep.
ms.topic: conceptual
ms.date: 03/12/2021
---
# Converting ARM templates between JSON and Bicep

This article describes how you convert Azure Resource Manager templates (ARM templates) from JSON to Bicep and from Bicep to JSON.

You must have the [Bicep CLI installed](bicep-install.md) to run the conversion commands.

The conversion commands produce templates that are functionally equivalent. However, they might not be exactly the same in implementation. Converting a template from JSON to Bicep and then back to JSON probably results in a template with different syntax than the original template. When deployed, the converted templates produce the same results.

## Convert from JSON to Bicep

The Bicep CLI provides a command to decompile any existing JSON template to a Bicep file. To decompile a JSON file, use:

```azurecli
bicep decompile mainTemplate.json
```

This command provides a starting point for Bicep authoring. The command doesn't work for all templates. Currently, nested templates can be decompiled only if they use the 'inner' expression evaluation scope. Templates that use copy loops can't be decompiled.

## Convert from Bicep to JSON

The Bicep CLI also provides a command to convert Bicep to JSON. To build a JSON file, use:

```azurecli
bicep build mainTemplate.bicep
```

## Export template and convert

You can export the template for a resource group, and then pass it directly to the decompile command. The following example shows how to decompile an exported template.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group export --name "your_resource_group_name" > main.json
bicep decompile main.json
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Export-AzResourceGroup -ResourceGroupName "your_resource_group_name" -Path ./main.json
bicep decompile main.json
```

# [Portal](#tab/azure-portal)

[Export the template](export-template-portal.md) through the portal.

Use `bicep decompile <filename>` on the downloaded file.

---

## Side-by-side view

The [Bicep playground](https://aka.ms/bicepdemo) enables you to view equivalent JSON and Bicep files side by side. You can select a sample template to see both versions. Or, select `Decompile` to upload your own JSON template and view the equivalent Bicep file.

## Next steps

For information about the Bicep, see [Bicep tutorial](./bicep-tutorial-create-first-bicep.md).
