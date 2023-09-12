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

## getSecret

`getSecret(subscriptionId, resourceGroupName, keyVaultName, secretName, secretVersion)`

Returns a secret from an _Azure Key Vault_. Use this function to pass a secret to a secure string parameter of a Bicep module.

You can use the `getSecret()` function from within a `.bicepparam` file.

```bicep
param secureUserName = getSecret('<subscriptionId>', '<resourceGroupName>', '<keyVaultName>', '<secretName>', '<secretVersion>')
param securePassword = getSecret('<subscriptionId>', '<resourceGroupName>', '<keyVaultName>', '<secretName>')
```

You'll get an error if you use this function with string interpolation.

A [namespace qualifier](bicep-functions.md#namespaces-for-functions) (`az`) can be used, but it's optional, because the function is available from the _default_ Azure Namespace.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| subscriptionId | Yes | string | The id of the subscription that has the KeyVault resource. |
| resourceGroupName | Yes | string | The name of the resource group that has the KeyVault resource. |
| keyVaultName | Yes | string | The name of the key vault. |
| secretName | Yes | string | The name of the secret stored in the key vault. |
| secretVersion | No | string | The version of the secret stored in the key vault. |

### Return value

The value for the secret.

### Example

The following `.bicepparam` file has a `securePassword` parameter that will have the latest value of the _\<secretName\>_ secret.

```bicep
param securePassword = getSecret('<subscriptionId>', '<resourceGroupName>', '<keyVaultName>', '<secretName>')
```

The following `.bicepparam` file has a `securePassword` parameter that will have the value of the _\<secretName\>_ secret, but it's pinned to a specific _\<secretValue\>_.

```bicep
param securePassword = getSecret('<subscriptionId>', '<resourceGroupName>', '<keyVaultName>', '<secretName>', '<secretVersion>')
```

## Next steps

For more information about Bicep parameters file, see [Parameters file](./parameter-files.md).
