---
title: Linter rule - no hardcoded locations
description: Linter rule - no hardcoded locations
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 02/10/2023
---

# Linter rule - no hardcoded locations

This rule finds uses of Azure location values that aren't parameterized.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-hardcoded-location`

## Solution

Template users may have limited access to regions where they can create resources. A hardcoded resource location might block users from creating a resource, thus preventing them from using the template. By providing a location parameter that defaults to the resource group location, users can use the default value when convenient but also specify a different location.

Rather than using a hardcoded string or variable value, use a parameter, the string 'global', or an expression (but not `resourceGroup().location` or `deployment().location`, see [no-loc-expr-outside-params](./linter-rule-no-loc-expr-outside-params.md)). Best practice suggests that to set your resources' locations, your template should have a string parameter named `location`. This parameter may default to the resource group or deployment location (`resourceGroup().location` or `deployment().location`).

The following example fails this test because the resource's `location` property uses a string literal:

```bicep
  resource stg 'Microsoft.Storage/storageAccounts@2021-02-01' = {
      location: 'westus'
  }
```

You can fix it by creating a new `location` string parameter (which may optionally have a default value - resourceGroup().location is frequently used as a default):

```bicep
  param location string = resourceGroup().location
  resource stg 'Microsoft.Storage/storageAccounts@2021-02-01' = {
      location: location
  }
```

Use **Quick Fix** to create a location parameter and replace the string literal with the parameter name. See the following screenshot:

:::image type="content" source="./media/linter-rule-no-hardcoded-location/linter-rule-no-hardcoded-location-quick-fix.png" alt-text="The screenshot of No hardcoded location linter rule warning with quickfix.":::

The following example fails this test because the resource's `location` property uses a variable with a string literal.

```bicep
  var location = 'westus'
  resource stg 'Microsoft.Storage/storageAccounts@2021-02-01' = {
      location: location
  }
```

You can fix it by turning the variable into a parameter:

```bicep
  param location string = 'westus'
  resource stg 'Microsoft.Storage/storageAccounts@2021-02-01' = {
      location: location
  }
```

The following example fails this test because a string literal is being passed in to a module parameter that is in turn used for a resource's `location` property:

```bicep
module m1 'module1.bicep' = {
  name: 'module1'
  params: {
    location: 'westus'
  }
}
```

where module1.bicep is:

```bicep
param location string

resource storageaccount 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: 'storageaccount'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Premium_LRS'
  }
}
```

You can fix the failure by creating a new parameter for the value:

```bicep
param location string // optionally with a default value
module m1 'module1.bicep' = {
  name: 'module1'
  params: {
    location: location
  }
}
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
