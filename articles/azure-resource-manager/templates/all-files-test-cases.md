---
title: All files test cases for Azure Resource Manager test toolkit
description: Describes the tests that are run for all files by the Azure Resource Manager template test toolkit.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 06/22/2023
---

# Test cases for all files

This article describes the tests that are run with the [template test toolkit](test-toolkit.md) for all JavaScript Object Notation (JSON) files. The examples include the test names and code samples that **pass** or **fail** the tests. For more information about how to run tests or how to run a specific test, see [Test parameters](test-toolkit.md#test-parameters).

## Use valid JSON syntax

Test name: JSONFiles Should Be Valid

This test checks that all JSON files contain valid syntax. For example, _azuredeploy.json_, _azuredeploy.parameters.json_, or _createUiDefinition.json_ files. If the test **fails**, you'll see failures or warnings for other tests, or JSON parsing.

### Template file example

The following example fails because in _azuredeploy.json_ the leading curly brace (`{`) is missing from `parameters`, `comboBox`, and `location`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters":
    "comboBox":
      "type": "string"
    },
    "location":
      "type": "string"
    }
  },
  "resources": [],
  "outputs": {
    "comboBox": {
      "type": "string",
      "value": "[parameters('comboBox')]"
    },
    "location": {
      "type": "string",
      "value": "[parameters('location')]"
    }
  }
}
```

The following example **passes**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "comboBox": {
      "type": "string"
    },
    "location": {
      "type": "string"
    }
  },
  "resources": [],
  "outputs": {
    "comboBox": {
      "type": "string",
      "value": "[parameters('comboBox')]"
    },
    "location": {
      "type": "string",
      "value": "[parameters('location')]"
    }
  }
}
```

### Parameter file example

The following example **fails** because _azuredeploy.parameters.json_ uses a parameter without a `value`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "value":
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
    "location": {
      "value": "westus"
    }
  }
}
```

### CreateUiDefintion example

The following example **fails** because in _createUiDefinition.json_ the leading curly brace (`{`) is missing from the `outputs` section.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "comboBox",
        "type": "Microsoft.Common.DropDown",
        "label": "Example drop down",
        "toolTip": "This is a tool tip"
      }
    ],
    "steps": [],
    "outputs":
      "comboBox": "[basics('comboBox')]",
      "location": "[location()]"
    }
  }
}
```

The following example **passes**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "comboBox",
        "type": "Microsoft.Common.DropDown",
        "label": "Example drop down",
        "toolTip": "This is a tool tip"
      }
    ],
    "steps": [],
    "outputs": {
      "comboBox": "[basics('comboBox')]",
      "location": "[location()]"
    }
  }
}
```

## Next steps

- To learn about the test toolkit, see [Use ARM template test toolkit](test-toolkit.md).
- For ARM template tests, see [Test cases for ARM templates](template-test-cases.md)
- To test parameter files, see [Test cases for parameter files](parameters.md).
- For createUiDefinition tests, see [Test cases for createUiDefinition.json](createUiDefinition-test-cases.md)
