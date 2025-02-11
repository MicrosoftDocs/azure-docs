---
title: Bicep functions for Bicep parameters files 
description: Learn about the functions that can be used in Bicep parameters files.
ms.topic: reference
ms.date: 01/10/2025
ms.custom: devx-track-bicep
---

# Bicep functions for Bicep parameters files

Bicep provides a function called `readEnvironmentVariable()` that allows you to retrieve values from environment variables. It also offers the flexibility to set a default value if the environment variable doesn't exist. This function can only be used in `.bicepparam` files.

## getSecret

`getSecret(subscriptionId, resourceGroupName, keyVaultName, secretName, secretVersion)`

This function returns a secret from an [Azure Key Vault](/azure/key-vault/secrets/about-secrets). Use this function to pass a secret to a Bicep file's secure string parameter.

> [!NOTE]
> You can also use the [keyVaultName.getSecret(secretName)](./bicep-functions-resource.md#getsecret) function from within a `.bicep` file.

```bicep
using './main.bicep'

param secureUserName = getSecret('exampleSubscription', 'exampleResourceGroup', 'exampleKeyVault', 'exampleSecretUserName')
param securePassword = getSecret('exampleSubscription', 'exampleResourceGroup', 'exampleKeyVault', 'exampleSecretPassword')
```

You get an error if you use this function with string interpolation.

A [namespace qualifier](bicep-functions.md#namespaces-for-functions) (`az`) can be used, but it's optional since the function is available from the _default_ Azure namespace.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| subscriptionId | Yes | string | The ID of the subscription that has the key vault resource |
| resourceGroupName | Yes | string | The name of the resource group that has the key vault resource |
| keyVaultName | Yes | string | The name of the key vault |
| secretName | Yes | string | The name of the secret stored in the key vault |
| secretVersion | No | string | The version of the secret stored in the key vault |

### Return value

The value for the secret.

### Example

The following `.bicepparam` file has a `securePassword` parameter that has the latest value of the _\<secretName\>_ secret:

```bicep
using './main.bicep'

param securePassword = getSecret('exampleSubscription', 'exampleResourceGroup', 'exampleKeyVault', 'exampleSecretPassword')
```

The following `.bicepparam` file has a `securePassword` parameter that has the value of the _\<secretName\>_ secret, but it's pinned to a specific _\<secretValue\>_:

```bicep
using './main.bicep'

param securePassword = getSecret('exampleSubscription', 'exampleResourceGroup', 'exampleKeyVault', 'exampleSecretPassword', 'exampleSecretVersion')
```

## readEnvironmentVariable

`readEnvironmentVariable(variableName, [defaultValue])`

This function returns the value of the environment variable or sets a default value if the environment variable doesn't exist. Variable loading occurs during compilation and not at runtime.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| variableName | Yes | string | The name of the variable. |
| defaultValue | No | string | A default string value to be used if the environment variable doesn't exist. |

### Return value

The return value is string value of the environment variable or a default value.

### Remarks

The following command sets the environment variable only for the PowerShell process in which it's executed. You get [BCP338](./diagnostics/bcp338.md) from Visual Studio Code:

```PowerShell
$env:testEnvironmentVariable = "Hello World!"
```

To set the environment variable at the user level, run the following command:

```powershell
[System.Environment]::SetEnvironmentVariable('testEnvironmentVariable','Hello World!', 'User')
```

To set the environment variable at the machine level, run the following command:

```powershell
[System.Environment]::SetEnvironmentVariable('testEnvironmentVariable','Hello World!', 'Machine')
```

For more information, see [Environment.SetEnvironmentVariable Method](/dotnet/api/system.environment.setenvironmentvariable).

### Examples

The following examples show how to retrieve the values of environment variables:

```bicep
use './main.bicep'

param adminPassword = readEnvironmentVariable('admin_password')
param boolfromEnvironmentVariables = bool(readEnvironmentVariable('boolVariableName','false'))
```

## Next steps

For more information about Bicep parameters files, see [Create parameters files for Bicep deployment](./parameter-files.md).
