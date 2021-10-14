---
title: Linter rule - prefer interpolation
description: Linter rule - prefer interpolation
ms.topic: conceptual
ms.date: 10/14/2021
---

# Linter rule - prefer interpolation

This rule finds uses of the concat function that can be replaced by string interpolation.

## Returned code

`prefer-interpolation`

## Solution

Use string interpolation instead of the concat function.

The following example fails this test because the concat function is used.

```bicep
param suffix string = '001'
var vnetName = concat('vnet-', suffix)
```

You can fix it by replacing concat with string interpolation. The following example passes this test.

```bicep
param suffix string = '001'
var vnetName = 'vnet-${suffix}'
```

## Next steps

* For more information about the linter, see [Use Bicep linter](./linter.md).
* The current linter rules are:

  * [no-hardcoded-env-urls](./linter-rule-no-hardcoded-environment-urls.md)
  * [no-unused-params](./linter-rule-no-unused-parameters.md)
  * [no-unused-vars](./linter-rule-no-unused-variables.md)
  * [prefer-interpolation](./linter-rule-prefer-interpolation.md)
  * [secure-parameter-default](./linter-rule-secure-parameter-default.md)
  * [simplify-interpolation](./linter-rule-simplify-interpolation.md)
