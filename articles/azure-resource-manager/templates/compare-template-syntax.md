---
title: Convert Azure Resource Manager templates from JSON to Bicep
description: Compares Azure Resource Manager templates developed with JSON and Bicep.
ms.topic: conceptual
ms.date: 02/18/2021
---
# Comparing JSON and Bicep for templates

This article compares Bicep syntax with JSON syntax for Azure Resource Manager templates (ARM templates). One goal of Bicep is to provide syntax that is less verbose than the equivalent in JSON.

## Syntax equivalents

If you're familiar with using JSON to develop ARM templates, use the following table to learn about the equivalent syntax for Bicep.

| Scenario | ARM Template | Bicep |
| -------- | ------------ | ----- |
| Author an expression | `[func()]` | `func()` |
| Concatenate strings | `concat('John', ' ', parameters('lastName'))` | `'John ${lastName}'` |
| Return the logical AND | `and(parameter('isMonday'), parameter('isNovember'))` | `isMonday && isNovember` |
| Resource ID of resource in the template | `resourceId('microsoft.network/virtualNetworks')` | `res.id` |
| Property from resource in the template | `reference(parameters('resourceName')).properties.resourceProperty` | `res.properties.resourceProperty` |
| Conditionally declare a property value | `if(parameters('isMonday'), 'valueIfTrue', 'valueIfFalse')` | `isMonday ? 'valueIfTrue' : 'valueIfFalse'` |
| Separate a solution into multiple files | Use linked templates | Use modules |
| Set the target scope of the deployment | `"$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#"` | `targetScope = 'subscription'` |
| Set dependency | `"dependsOn": ["[resourceId('Microsoft.Storage/storageAccounts', 'parameters('storageAccountName'))]"]` | Either rely on automatic detection of dependencies or manually set dependency with `dependsOn: [ stg ]` |

## Recommendations

* When possible, avoid using the [reference](template-functions-resource.md#reference) and [resourceId](template-functions-resource.md#resourceid) functions in your Bicep file. When you reference a resource in the same Bicep deployment, use the resource identifier instead. For example, if you've deployed a resource in your Bicep file with `stg` as the resource identifier, use syntax like `stg.id` or `stg.properties.primaryEndpoints.blob` to get property values. By using the resource identifier, you create an implicit dependency between resources. You don't need to explicitly set the dependency with the dependsOn property.
* Use consistent casing for identifiers. If you're unsure what type of casing to use, try camel casing. For example, `param myCamelCasedParameter string`.
* Add a description to a parameter only when the description provides essential information to users. You can use `//` comments for some information.

## Decompile JSON to Bicep

The Bicep CLI provides a command to decompile any existing ARM template to a Bicep file. To decompile a JSON file, use: `bicep decompile "path/to/file.json"`

This command provides a starting point for Bicep authoring, but the command doesn't work for all templates. The command may fail or you may have to fix issues after the decompilation. Currently, the command has the following limitations:

* Templates using copy loops can't be decompiled.
* Nested templates can be decompiled only if they use the 'inner' expression evaluation scope.

You can export the template for a resource group, and then pass it directly to the bicep decompile command. The following example shows how to decompile an exported template.

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

[Export the template](export-template-portal.md) through the portal. Use `bicep decompile <filename>` on the downloaded file.

---

## Next steps

For information about the Bicep project, see [Project Bicep - an ARM DSL](https://github.com/Azure/bicep).
