---
title: Linter rule - no location expressions outside of parameter default values
description: Linter rule - no location expressions outside of parameter default values
ms.topic: conceptual
ms.date: 1/6/2022
---

# Linter rule - no location expressions outside of parameter default values

This rule finds `resourceGroup().location` or `deployment().location` used outside of a parameter default value.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-loc-expr-outside-params`

## Solution

`resourceGroup().location` and `deployment().location` should only be used as the default value of a parameter.

Template users may have limited access to regions where they can create resources. The expressions `resourceGroup().location` or `deployment().location` could block users if the resource group or deployment was created in a region the user can't access, thus preventing them from using the template.

Best practice suggests that to set your resources' locations, your template should have a string parameter named `location`. If you default the `location` parameter to `resourceGroup().location` or `deployment().location` instead of using these functions elsewhere in the template, users of the template can use the default value when convenient but also specify a different location when needed.

```bicep
resource storageaccount 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  location: resourceGroup().location
}
```

You can fix the failure by creating a `location` property that defaults to `resourceGroup().location` and use this new parameter instead:

```bicep
param location string = resourceGroup().location

resource storageaccount 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  location: location
}
```

The following example fails this test because `location` is using `resourceGroup().location` but isn't a parameter:

```bicep
  var location = resourceGroup().location
```

You can fix the failure by turning the variable into a parameter:

```bicep
  param location string  = resourceGroup().location
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
