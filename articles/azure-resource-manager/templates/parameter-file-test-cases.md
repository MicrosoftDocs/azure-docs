---
title: Parameter file test cases for Azure Resource Manager test toolkit
description: Describes the parameter file tests that are run by the Azure Resource Manager template test toolkit.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 06/23/2023
---

# Test cases for parameter files

This article describes the tests that are run with the [template test toolkit](test-toolkit.md) for [parameter files](parameter-files.md). For example, a file named _azuredeploy.parameters.json_. The examples include the test names and code samples that **pass** or **fail** the tests. For more information about how to run tests or how to run a specific test, see [Test parameters](test-toolkit.md#test-parameters).

The toolkit includes [test cases](template-test-cases.md) for Azure Resource Manager templates (ARM templates) and the main template files named _azuredeploy.json_ or _maintemplate.json_.

## Use valid contentVersion

Test name: DeploymentParameters Should Have ContentVersion

The `contentVersion` must contain a string in the format `1.0.0.0` and only use numbers.

The following example **fails** because the `contentVersion` is missing.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "parameters": {
    "stgAcctName": {
      "value": "demostorage01"
    }
  }
}
```

The following example **fails** because `contentVersion` isn't a string.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": {},
  "parameters": {
    "stgAcctName": {
      "value": "demostorage01"
    }
  }
}
```

The following example **passes**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "stgAcctName": {
      "value": "demostorage01"
    }
  }
}
```

## File must include parameters

Test name: DeploymentParameters Should Have Parameters

A parameter file must include the `parameters` section.

The following example **fails**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
}
```

The following example **passes**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "stgAcctName": {
      "value": "demostorage01"
    }
  }
}
```

## Use valid schema version

Test name: DeploymentParameters Should Have Schema

The parameter file must include a valid schema version.

There are two valid schema versions for parameter files:

- `https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#`
- `https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#`

The following example **fails**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2021-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "stgAcctName": {
      "value": "demostorage01"
    }
  }
}
```

The following example **passes**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "stgAcctName": {
      "value": "demostorage01"
    }
  }
}
```

## Parameters must contain values

Test name: DeploymentParameters Should Have Value

A parameter must contain a `value` or a `reference`. For secrets such as a password, a key vault uses a `reference` in the parameter file. For more information, see [Use Azure Key Vault to pass secure parameter value during deployment](key-vault-parameter.md).

The following example **fails** because `stgAcctName` doesn't have a `value`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "stgAcctName": {}
  }
}
```

The following example **passes**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "stgAcctName": {
      "value": "demostorage01"
    }
  }
}
```

## Next steps

- To learn about the test toolkit, see [Use ARM template test toolkit](test-toolkit.md).
- For ARM template tests, see [Test cases for ARM templates](template-test-cases.md).
- For createUiDefinition tests, see [Test cases for createUiDefinition.json](createUiDefinition-test-cases.md).
- To learn about tests for all files, see [Test cases for all files](all-files-test-cases.md).
