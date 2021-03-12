---
title: Compare syntax for Azure Resource Manager templates in JSON and Bicep
description: Compares Azure Resource Manager templates developed with JSON and Bicep, and shows how to convert between the languages.
ms.topic: conceptual
ms.date: 03/12/2021
---
# Comparing JSON and Bicep for templates

This article compares Bicep syntax with JSON syntax for Azure Resource Manager templates (ARM templates). In most cases, Bicep provides syntax that is less verbose than the equivalent in JSON.

## Syntax equivalents

If you're familiar with using JSON to develop ARM templates, use the following table to learn about the equivalent syntax for Bicep.

| Scenario | Bicep | JSON |
| -------- | ------------ | ----- |
| Author an expression | `func()` | `"[func()]"` |
| Get parameter value | `exampleParameter` | `[parameters('exampleParameter'))]` |
| Get variable value | `exampleVar` | `[variables('exampleVar'))]` |
| Concatenate strings | `'${namePrefix}-vm'` | `[concat(parameters('namePrefix'), '-vm')]` |
| Set resource property | `sku: '2016-Datacenter'` | `"sku": "2016-Datacenter",` |
| Return the logical AND | `isMonday && isNovember` | `[and(parameter('isMonday'), parameter('isNovember'))]` |
| Get resource ID of resource in the template | `nic1.id` | `[resourceId('Microsoft.Network/networkInterfaces', variables('nic1Name'))]` |
| Get property from resource in the template | `diagsAccount.properties.primaryEndpoints.blob` | `[reference(resourceId('Microsoft.Storage/storageAccounts', variables('diagStorageAccountName'))).primaryEndpoints.blob]` |
| Conditionally set a value | `isMonday ? 'valueIfTrue' : 'valueIfFalse'` | `[if(parameters('isMonday'), 'valueIfTrue', 'valueIfFalse')]` |
| Separate a solution into multiple files | Use modules | Use linked templates |
| Set the target scope of the deployment | `targetScope = 'subscription'` | `"$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#"` |
| Set dependency | Either rely on automatic detection of dependencies or manually set dependency with `dependsOn: [ stg ]` | `"dependsOn": ["[resourceId('Microsoft.Storage/storageAccounts', 'parameters('storageAccountName'))]"]` |
| Resource declaration | `resource vm 'Microsoft.Compute/virtualMachines@2020-06-01' = {...}` | `"resources": [ { "type": "Microsoft.Compute/virtualMachines", "apiVersion": "2020-06-01", ... } ]` |

## Recommendations

* When possible, avoid using the [reference](template-functions-resource.md#reference) and [resourceId](template-functions-resource.md#resourceid) functions in your Bicep file. When you reference a resource in the same Bicep deployment, use the resource identifier instead. For example, if you've deployed a resource in your Bicep file with `stg` as the resource identifier, use syntax like `stg.id` or `stg.properties.primaryEndpoints.blob` to get property values. By using the resource identifier, you create an implicit dependency between resources. You don't need to explicitly set the dependency with the dependsOn property.
* Use consistent casing for identifiers. If you're unsure what type of casing to use, try camel casing. For example, `param myCamelCasedParameter string`.
* Add a description to a parameter only when the description provides essential information to users. You can use `//` comments for some information.

## Next steps

* For information about the Bicep, see [Bicep tutorial](./bicep-tutorial-create-first-bicep.md).
* To learn about converting templates between the languages, see [Converting ARM templates between JSON and Bicep](bicep-decompile.md).
