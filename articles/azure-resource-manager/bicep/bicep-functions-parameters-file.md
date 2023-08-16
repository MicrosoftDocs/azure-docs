---
title: Bicep functions - parameters file
description: Describes the functions used in the Bicep parameters files.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/05/2023
---

# Parameters file function for Bicep

Bicep provides a function called `readEnvironmentVariable()` that allows you to retrieve values from environment variables. It also offers the flexibility to set a default value if the environment variable does not exist. This function can only be used in the `.bicepparam` files. For more information, see [Bicep parameters file](./parameter-files.md).

## readEnvironmentVariable()

`readEnvironmentVariable(variableName, [defaultValue])`

Returns the value of the environment variable, or set a default value if the environment variable doesn't exist. Variable loading occurs during compilation, not at runtime.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| variableName | Yes | string | The name of the variable. |
| defaultValue | No | string | A default string value to be used if the environment variable does not exist. |

### Return value

The string value of the environment variable or a default value.

### Examples

The following examples show how to retrieve the values of environment variables.

```bicep
use './main.bicep'

param adminPassword = readEnvironmentVariable('admin_password')
param boolfromEnvironmentVariables = bool(readEnvironmentVariable('boolVariableName','false'))
```

## Next steps

For more information about Bicep parameters file, see [Parameters file](./parameter-files.md).
