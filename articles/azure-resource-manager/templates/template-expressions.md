---
title: Template syntax and expressions
description: Describes the declarative JSON syntax for Azure Resource Manager templates.
ms.topic: conceptual
ms.date: 02/13/2020
---

# Syntax and expressions in Azure Resource Manager templates

The basic syntax of the template is JSON. However, you can use expressions to extend the JSON values available within the template.  Expressions start and end with brackets: `[` and `]`, respectively. The value of the expression is evaluated when the template is deployed. An expression can return a string, integer, boolean, array, or object.

A template expression can't exceed 24,576 characters.

## Use functions

Azure Resource Manager provides [functions](template-functions.md) that you can use in a template. The following example shows an expression that uses a function in the default value of a parameter:

```json
"parameters": {
  "location": {
    "type": "string",
    "defaultValue": "[resourceGroup().location]"
  }
},
```

Within the expression, the syntax `resourceGroup()` calls one of the functions that Resource Manager provides for use within a template. In this case, it's the [resourceGroup](template-functions-resource.md#resourcegroup) function. Just like in JavaScript, function calls are formatted as `functionName(arg1,arg2,arg3)`. The syntax `.location` retrieves one property from the object returned by that function.

Template functions and their parameters are case-insensitive. For example, Resource Manager resolves **variables('var1')** and **VARIABLES('VAR1')** as the same. When evaluated, unless the function expressly modifies case (such as toUpper or toLower), the function preserves the case. Certain resource types may have case requirements that are separate from how functions are evaluated.

To pass a string value as a parameter to a function, use single quotes.

```json
"name": "[concat('storage', uniqueString(resourceGroup().id))]"
```

Most functions work the same whether deployed to a resource group, subscription, management group, or tenant. The following functions have restrictions based on the scope:

* [resourceGroup](template-functions-resource.md#resourcegroup) - can only be used in deployments to a resource group.
* [resourceId](template-functions-resource.md#resourceid) - can be used at any scope, but the valid parameters change depending on the scope.
* [subscription](template-functions-resource.md#subscription) - can only be used in deployments to a resource group or subscription.

## Escape characters

To have a literal string start with a left bracket `[` and end with a right bracket `]`, but not have it interpreted as an expression, add an extra bracket to start the string with `[[` and end the string with `]]`. For example, the variable:

```json
"demoVar1": "[[test value]]"
```

Resolves to `[test value]`.

However, if the literal string doesn't end with a bracket, don't escape the first bracket. For example, the variable:

```json
"demoVar2": "[test] value"
```

Resolves to `[test] value`.

To escape double quotes in an expression, such as adding a JSON object in the template, use the backslash.

```json
"tags": {
    "CostCenter": "{\"Dept\":\"Finance\",\"Environment\":\"Production\"}"
},
```

## Null values

To set a property to null, you can use **null** or **[json('null')]**. The [json function](template-functions-array.md#json) returns an empty object when you provide `null` as the parameter. In both cases, Resource Manager templates treat it as if the property is not present.

```json
"stringValue": null,
"objectValue": "[json('null')]"
```

## Next steps

* For the full list of template functions, see [Azure Resource Manager template functions](template-functions.md).
* For more information about template files, see [Understand the structure and syntax of Azure Resource Manager templates](template-syntax.md).
