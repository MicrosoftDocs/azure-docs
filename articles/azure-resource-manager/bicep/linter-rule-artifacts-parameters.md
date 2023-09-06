---
title: Linter rule - artifacts parameters
description: Linter rule - artifacts parameters
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 08/05/2022
---

# Linter rule - artifacts parameters

This rule verifies whether the artifacts parameters are defined correctly. The following conditions must be met to pass the test:

- If you provide one parameter (either `_artifactsLocation` or `_artifactsLocationSasToken`), you must provide the other.
- `_artifactsLocation` must be a string.
- If `_artifactsLocation` has a default value, it must be either `deployment().properties.templateLink.uri` or a raw URL for its default value.
- `_artifactsLocationSasToken` must be a secure string.
- If `_artifactsLocationSasToken` has a default value, it must be an empty string.
- If a referenced module has an `_artifactsLocation` or `_artifactsLocationSasToken` parameter, a value must be passed in for those parameters, even if they have default values in the module.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`artifacts-parameters`

## Solution

The following example fails this test because `_artifactsLocationSasToken` is missing:

```bicep
@description('The base URI where artifacts required by this template are located including a trailing \'/\'')
param _artifactsLocation string = deployment().properties.templateLink.uri

...
```

The next example fails this test because `_artifactsLocation` must be either `deployment().properties.templateLink.uri` or a raw URL when the default value is provided, and the default value of `_artifactsLocationSasToken` is not an empty string.

```bicep
@description('The base URI where artifacts required by this template are located including a trailing \'/\'')
param _artifactsLocation string = 'something'

@description('SAS Token for accessing script path')
@secure()
param _artifactsLocationSasToken string = 'something'

...
````

This example passes this test.

```bicep
@description('The base URI where artifacts required by this template are located including a trailing \'/\'')
param _artifactsLocation string = deployment().properties.templateLink.uri

@description('SAS Token for accessing script path')
@secure()
param _artifactsLocationSasToken string = ''

...
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
