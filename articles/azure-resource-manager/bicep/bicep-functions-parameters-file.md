---
title: Bicep functions - parameters file
description: Describes the functions used in the Bicep parameters files.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/01/2023
---

# Parameters file function for Bicep

Bicep supports a function called `readEnvironmentVariable()` to load environment variable values. This function can only be using in the `.bicepparam` files. For more information see [Bicep parameters file](./parameter-files.md).



readEnvironmentVariable(variableName: string): string
Reads the specified Environment variable as bicep string. Variable loading occurs during compilation, not at runtime.


## readEnvironmentVariable()

`readEnvironmentVariable(variableName)`

Returns the value of the environment variable.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| variableName | Yes | string | The name of the variable. |

### Return value

The string value of the environment variable.

### Examples

The following example shows how to retrieve the value of an environment variable.

```bicep
use './main.bicep'

param adminPassword = readEnvironmentVariable('admin_password')
```

## Next steps

For more information about Bicep parameters file, see [Parameters file](./parameter-files.md).
