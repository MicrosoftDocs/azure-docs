---
title: Linter rule - no hardcoded outputs
description: Linter rule - no hardcoded outputs
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 07/23/2026
---

# Linter rule - no hardcoded outputs

This rule finds output declarations that use hard-coded literal values instead of exported variables.

> [!NOTE]
> This rule is off by default. Change the level in [bicepconfig.json](./bicep-config-linter.md) to enable it.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-hardcoded-outputs`

## Solution

When an output returns a hard-coded constant — rather than a computed or runtime value — that constant is better expressed as an exported variable. Exported variables can be imported directly by other Bicep files, making the intent clearer and avoiding unnecessary deployments just to retrieve a fixed value.

The following types of output values trigger this rule: string literals, integer literals, boolean literals, null, arrays and objects where every element is a literal value.

Outputs that reference parameters, use string interpolation with a parameter, or call functions don't trigger this rule.

The following example fails this test because the output returns a string literal:

```bicep
output apiVersion string = '2024-01-01'
```

You can fix it by replacing the output with an exported variable:

```bicep
@export()
var apiVersion = '2024-01-01'
```

The following example also fails this test because every element in the array and every property value in the object is a literal:

```bicep
param name string

output stringValue string = 'literal'
output intValue int = 42
output boolValue bool = true
output arrayValue array = [
  'one'
  2
]
output objectValue object = {
  first: 'one'
  nested: [
    false
  ]
}
```

You can fix these by converting each output to an exported variable:

```bicep
@export()
var stringValue = 'literal'

@export()
var intValue = 42

@export()
var boolValue = true

@export()
var arrayValue = [
  'one'
  2
]

@export()
var objectValue = {
  first: 'one'
  nested: [
    false
  ]
}
```

The following example passes this test because the outputs reference parameters or use expressions:

```bicep
param name string

output reference string = name
output interpolated string = 'literal-${name}'
output functionResult string = toLower('LITERAL')
output arrayWithExpression array = [
  'literal'
  name
]
output objectWithExpression object = {
  literal: 'literal'
  reference: name
}
```

Use **Quick Fix** to automatically create an exported variable with the same name and remove the hard-coded output. If the variable name conflicts with an existing declaration, the quick fix appends a number to the variable name.

## Import exported constants from other files

Once you convert a hard-coded output to an exported variable, other Bicep files can import it directly using the [`import`](./bicep-import.md) statement. This avoids deploying the module just to read a constant value.

The following example defines constants in a shared `constants.bicep` file:

```bicep
// constants.bicep
@export()
var apiVersion = '2024-01-01'

@export()
var maxRetries = 3
```

Another Bicep file can import those constants directly:

```bicep
import { apiVersion, maxRetries } from './constants.bicep'

resource storageAccount 'Microsoft.Storage/storageAccounts@2025-01-01' = {
  name: 'mystorageaccount'
  location: resourceGroup().location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    minimumTlsVersion: 'TLS1_2'
  }
  tags: {
    apiVersion: apiVersion
  }
}
```

For more information, see [Import user-defined data types, variables, and functions](./bicep-import.md).

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
