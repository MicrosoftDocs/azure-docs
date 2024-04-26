---
title: Linter rule - prefer unquoted property names
description: Linter rule - prefer unquoted property names
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Linter rule - prefer unquoted property names

This rule finds unnecessary single quotes where an object property name is declared and where an object property is dereferenced with array access.

In Bicep, quotes are optionally allowed when the object property keys contain numbers or special characters. For example, space, '-', or '.'. For more information, see [Objects](./data-types.md#objects).

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`prefer-unquoted-property-names`

## Solution

Quotes are not required in following code:

```bicep
var obj = {
  newProp: {} // Property name is fine.
  'my-prop' : {} // Quotes are required.
  '1' : {} //  Quotes are required.
  'myProp': {} // Quotes are NOT required.
 }

var x0 = obj.newProp // Code is fine.
var x1 = obj['my-prop'] // Quotes and square brackets are required.
var x2 = obj['1'] // Quotes and square brackets are required.
var x3 = obj['myProp'] // Use obj.myProp instead.
```

You can fix it by removing the unnecessary quotes:

```bicep
var obj = {
  newProp: {}
  'my-prop' : {}
  '1' : {}
  myProp: {}
 }


var x0 = obj.newProp
var x1 = obj['my-prop']
var x2 = obj['1']
var x3 = obj.myProp
```

Optionally, you can use **Quick Fix** to fix the issues:

linter-rule-prefer-unquoted-property-names-quick-fix

:::image type="content" source="./media/linter-rule-prefer-unquoted-property-names/linter-rule-prefer-unquoted-property-names-quick-fix.png" alt-text="The screenshot of Prefer unquoted property names quick fix.":::

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
