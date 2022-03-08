---
title: Linter rule - outputs should not contain secrets
description: Linter rule - outputs should not contain secrets
ms.topic: conceptual
ms.date: 12/17/2021
---

# Linter rule - outputs should not contain secrets

This rule finds possible exposure of secrets in a template's outputs.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`outputs-should-not-contain-secrets`

## Solution

Don't include any values in an output that could potentially expose secrets. For example, secure parameters of type secureString or secureObject, or [`list*`](./bicep-functions-resource.md#list) functions such as listKeys.

The output from a template is stored in the deployment history, so a malicious user could find that information.

The following example fails because it includes a secure parameter in an output value.

```bicep
@secure()
param secureParam string

output badResult string = 'this is the value ${secureParam}'
```

The following example fails because it uses a [`list*`](./bicep-functions-resource.md#list) function in an output.

```bicep
param storageName string
resource stg 'Microsoft.Storage/storageAccounts@2021-04-01' existing = {
  name: storageName
}

output badResult object = {
  value: stg.listKeys().keys[0].value
}
```

The following example fails because the output name contains 'password', indicating that it may contain a secret

```bicep
output accountPassword string = '...'
```

To fix it, you will need to remove the secret data from the output.

## Silencing false positives

Sometimes this rule will alert on template outputs that do not actually contain secrets. For instance, not all [`list*`](./bicep-functions-resource.md#list) functions actually return sensitive data. In these cases, you can disable the warning for this line by adding `#disable-next-line outputs-should-not-contain-secrets` before the line with the warning.

```bicep
#disable-next-line outputs-should-not-contain-secrets // Does not contain a password
output notAPassword string = '...'
```

It is good practice to add a comment explaining why the rule does not apply to this line.
