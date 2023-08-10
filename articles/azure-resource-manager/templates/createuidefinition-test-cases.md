---
title: createUiDefinition.json test cases for Azure Resource Manager test toolkit
description: Describes the createUiDefinition.json tests that are run by the Azure Resource Manager template test toolkit.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 06/22/2023
---

# Test cases for createUiDefinition.json

This article describes the tests that are run with the [template test toolkit](test-toolkit.md) for [createUiDefinition.json](../managed-applications/create-uidefinition-overview.md) files. The examples include the test names and code samples that **pass** or **fail** the tests.

The toolkit includes [test cases](template-test-cases.md) for Azure Resource Manager templates (ARM templates) and the main template files named _azuredeploy.json_ or _maintemplate.json_. When the directory contains a _createUiDefinition.json_ file, specific tests are run for UI controls. For more information about how to run tests or how to run a specific test, see [Test parameters](test-toolkit.md#test-parameters).

The _createUiDefinition.json_ file creates custom user-interface (UI) controls using [elements](../managed-applications/create-uidefinition-elements.md) and [functions](../managed-applications/create-uidefinition-functions.md).

## Verify template parameter allows values

Test name: **Allowed Values Should Actually Be Allowed**

This test checks that values for each control in _createUiDefinition.json_ are allowed in the main template's parameters. The parameters are mapped by name between the main template and the _createUiDefinition.json_ file.

The main template's parameter must accept the values from the control's `allowedValues`. The test also checks that the control is referenced in the _createUiDefinition.json_ `outputs` section.

This test checks the main template and _createUiDefinition.json_ file. An example of the _createUiDefinition.json_ file is shown after the main template examples.

The following example **fails** because the main template's parameter name `combo` doesn't match the control's parameter name `comboBox`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "combo": {
      "type": "string",
      "defaultValue": "two"
    }
  },
  "resources": [],
  "outputs": {
    "comboBoxOutput": {
      "type": "string",
      "value": "[parameters('combo')]"
    }
  }
}
```

The following example **fails** because the main template's parameter type `int` doesn't accept the control's `string` value. And if a main template's parameter defines a `defaultValue` it must be a valid `value` in the control's `allowedValues`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "comboBox": {
      "type": "int",
      "defaultValue": 4
    }
  },
  "resources": [],
  "outputs": {
    "comboBoxOutput": {
      "type": "string",
      "value": "[parameters('combo')]"
    }
  }
}
```

The following example **passes** because the main template's parameter name matches the control's parameter name. And the template's parameter type is a `string` with a `defaultValue` that's specified in the control's `allowedValues`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "comboBox": {
      "type": "string",
      "defaultValue": "two"
    }
  },
  "resources": [],
  "outputs": {
    "comboBoxOutput": {
      "type": "string",
      "value": "[parameters('comboBox')]"
    }
  }
}
```

The _createUiDefinition.json_ file for this example:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [],
    "steps": [
      {
        "name": "demoComboBox",
        "label": "demoComboBoxLabel",
        "elements": [
          {
            "name": "comboBox",
            "type": "Microsoft.Common.DropDown",
            "label": "Example drop down",
            "defaultValue": "Value two",
            "toolTip": "This is a tool tip",
            "constraints": {
              "allowedValues": [
                {
                  "label": "Value one",
                  "description": "The value to select for option 1.",
                  "value": "one"
                },
                {
                  "label": "Value two",
                  "description": "The value to select for option 2.",
                  "value": "two"
                }
              ],
              "required": true
            },
            "visible": true
          }
        ]
      }
    ],
    "outputs": {
      "comboBox": "[steps('demoComboBox').comboBox]"
    }
  }
}
```

## Output controls must exist

Test name: **Controls In Outputs Must Exist**

Controls that are used in the `outputs` section must exist in an element elsewhere in _createUiDefinition.json_. The name referenced in `outputs` must match a name used in `basics[]` or `steps[]`.

The following example **fails**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "nameDoesNotMatchOutput",
        "type": "Microsoft.Common.DropDown",
        "label": "Example drop down",
        "toolTip": "This is a tool tip"
      }
    ],
    "steps": [],
    "outputs": {
      "comboBox": "[basics('comboBox')]"
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
      "comboBox": "[basics('comboBox')]"
    }
  }
}
```

## Properties must include values

Test name: **CreateUIDefinition Must Not Have Blanks**

Properties must include values. Required properties must use valid values. Optional properties that are blank should be removed. The test allows blank `"basics": []`, `"steps": []`, or `defaultValue`.

The following example **fails** because `label`, `placeholder`, and `toolTip` are blank.

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
        "label": "",
        "placeholder": "",
        "defaultValue": "",
        "toolTip": ""
      }
    ],
    "steps": [],
    "outputs": {
      "comboBox": "[basics('comboBox')]"
    }
  }
}
```

The following example **passes** because `label` and `toolTip` have values, and `placeholder` was removed.

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
        "defaultValue": "",
        "toolTip": "This is a tool tip"
      }
    ],
    "steps": [],
    "outputs": {
      "comboBox": "[basics('comboBox')]"
    }
  }
}
```

## Use valid schema and version

Test name: **CreateUIDefinition Should Have Schema**

The _createUiDefinition.json_ file must include a `$schema` property and use a valid `$schema` and `version`. The version numbers in `$schema` and `version` must match.

The following example **fails**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.9.9-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.9.9-preview"
}
```

The following example **passes** because it uses the latest `$schema` and `version`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview"
}
```

## Don't hide credential confirmation

Test name: **Credential Confirmation Should Not Be Hidden**

This test checks that credentials are confirmed for [Microsoft.Common.PasswordBox](../managed-applications/microsoft-common-passwordbox.md) or [Microsoft.Compute.CredentialsCombo](../managed-applications/microsoft-compute-credentialscombo.md). The `hideConfirmation` property should be set to `false` so that the confirmation is visible.

The following example **fails** because `hideConfirmation` is `true`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "credentials",
        "type": "Microsoft.Compute.CredentialsCombo",
        "label": {
          "password": "Password",
          "confirmPassword": "Confirm password"
        },
        "toolTip": {
          "password": "Type your credentials"
        },
        "constraints": {
          "required": true,
          "customPasswordRegex": "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{12,}$",
          "customValidationMessage": "The password must be alphanumeric, contain at least 12 characters, and have at least 1 letter and 1 number."
        },
        "options": {
          "hideConfirmation": true
        },
        "osPlatform": "Windows",
        "visible": true
      }
    ],
    "steps": [],
    "outputs": {
      "location": "[location()]",
      "credentials": "[basics('credentials')]"
    }
  }
}
```

The following example **passes** because `hideConfirmation` is `false`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "credentials",
        "type": "Microsoft.Compute.CredentialsCombo",
        "label": {
          "password": "Password",
          "confirmPassword": "Confirm password"
        },
        "toolTip": {
          "password": "Type your credentials"
        },
        "constraints": {
          "required": true,
          "customPasswordRegex": "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{12,}$",
          "customValidationMessage": "The password must be alphanumeric, contain at least 12 characters, and have at least 1 letter and 1 number."
        },
        "options": {
          "hideConfirmation": false
        },
        "osPlatform": "Windows",
        "visible": true
      }
    ],
    "steps": [],
    "outputs": {
      "location": "[location()]",
      "credentials": "[basics('credentials')]"
    }
  }
}
```

## Use correct handler

Test name: **Handler Must Be Correct**

Use `Microsoft.Azure.CreateUIDef` or `Microsoft.Compute.MultiVm` in the _createUiDefinition.json_ file.

The following example **fails**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.",
  "version": "0.1.2-preview"
}
```

The following example **passes**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview"
}
```

## Don't hide existing resources

Test name: **HideExisting Must Be Correctly Handled**

If `hideExisting` is set to `false` or omitted, `outputs` must contain `resourceGroup` and `newOrExisting`. The default for `hideExisting` is `false`.

Examples of control types that include `hideExisting` are [Microsoft.Storage.StorageAccountSelector](../managed-applications/microsoft-storage-storageaccountselector.md), [Microsoft.Network.PublicIpAddressCombo](../managed-applications/microsoft-network-publicipaddresscombo.md), or [Microsoft.Network.VirtualNetworkCombo](../managed-applications/microsoft-network-virtualnetworkcombo.md).

The following example **fails**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "storage",
        "type": "Microsoft.Storage.StorageAccountSelector",
        "label": "Storage account",
        "toolTip": "This is a demo storage account",
        "defaultValue": {
          "name": "storageaccount01",
          "type": "Premium_LRS"
        },
        "options": {
          "hideExisting": false
        },
        "visible": true
      }
    ],
    "steps": [],
    "outputs": {
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
        "name": "storage",
        "type": "Microsoft.Storage.StorageAccountSelector",
        "label": "Storage account",
        "toolTip": "This is a demo storage account",
        "defaultValue": {
          "name": "storageaccount01",
          "type": "Premium_LRS"
        },
        "options": {
          "hideExisting": false
        },
        "visible": false
      }
    ],
    "steps": [],
    "outputs": {
      "location": "[location()]",
      "resourceGroup": "[basics('storage').resourceGroup]",
      "newOrExisting": "[basics('storage').newOrExisting]"
    }
  }
}
```

## Use location in outputs

Test name: **Location Should Be In Outputs**

The `outputs` section should contain a location using the [location](../managed-applications/create-ui-definition-referencing-functions.md#location) function.

The following example **fails** because `outputs` doesn't include a location.

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
      "comboBox": "[basics('comboBox')]"
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

## Include control outputs in template parameters

Test name: **Outputs Must Be Present In Template Parameters**

The test checks that _createUiDefinition.json_ includes an `outputs` section. The test also checks that those `outputs` are defined in the main template's `parameters` section. The names must match because parameters are mapped by name between the _createUiDefinition.json_ and the main template.

This test checks the main template and _createUiDefinition.json_ file. An example of the _createUiDefinition.json_ file is shown after the main template examples.

The following example **fails** because the main template doesn't include the `comboBox` parameter from the  _createUiDefinition.json_ file's `outputs` section.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": [],
  "outputs": {
    "location": {
      "type": "string",
      "value": "[parameters('location')]"
    }
  }
}
```

The following example **passes** because the main template includes the `comboBox` parameter.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "comboBox": {
      "type": "string",
      "defaultValue": "two"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
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

The _createUiDefinition.json_ file for this example:

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

## Parameters without default must exist in outputs

Test name: **Parameters Without Default Must Exist In CreateUIDefinition**

Parameters in the main template without a default value must exist in the _createUiDefinition.json_ file's `outputs` section.

This test checks the main template and _createUiDefinition.json_ file. An example of the _azuredeploy.json_ file is shown after the control's examples.

The following example **fails** because the _createUiDefinition.json_ file's `outputs` doesn't include the main template's parameter `comboBox`.

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
      "location": "[location()]"
    }
  }
}
```

The following example **passes** because _createUiDefinition.json_ includes the `comboBox` in `outputs`.

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

The _azuredeploy.json_ file for this example. The `comboBox` parameter doesn't have a default value.

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

## Use secure parameter with password box

Test name: **Password Textboxes Must Be Used For Password Parameters**

This test checks that a [Microsoft.Common.PasswordBox](../managed-applications/microsoft-common-passwordbox.md) element is defined in the main template's `parameters` and the _createUiDefinition.json_ `outputs`. The main template's parameter type for a password box must be `secureString` or `secureObject`.

This test checks the main template and _createUiDefinition.json_ file. An example of the _createUiDefinition.json_ file is shown after the main template examples.

The following example **fails** because the main template's `passwordBox` parameter is a `string`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "passwordBox": {
      "type": "string"
    },
    "location": {
      "type": "string"
    }
  },
  "resources": [],
  "outputs": {
    "location": {
      "type": "string",
      "value": "[parameters('location')]"
    }
  }
}
```

The following example **passes** because the main template's `passwordBox` parameter is a `secureString`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "passwordBox": {
      "type": "secureString"
    },
    "location": {
      "type": "string"
    }
  },
  "resources": [],
  "outputs": {
    "location": {
      "type": "string",
      "value": "[parameters('location')]"
    }
  }
}
```

The _createUiDefinition.json_ file for this example:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "passwordBox",
        "type": "Microsoft.Common.PasswordBox",
        "label": {
          "password": "Password",
          "confirmPassword": "Confirm password"
        },
        "toolTip": "Type a password"
      }
    ],
    "steps": [],
    "outputs": {
      "location": "[location()]",
      "passwordBox": "[basics('passwordBox')]"
    }
  }
}
```

## Password box requires minimum length

Test name: **PasswordBoxes Must Have Min Length**

The test checks that the [Microsoft.Common.PasswordBox](../managed-applications/microsoft-common-passwordbox.md) element uses `constraints` with a `regex` that requires at least 12 characters.

The following example **fails** because there are no `constraints`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "passwordBox",
        "type": "Microsoft.Common.PasswordBox",
        "label": {
          "password": "Password",
          "confirmPassword": "Confirm password"
        },
        "toolTip": "Type a password"
      }
    ],
    "steps": [],
    "outputs": {
      "location": "[location()]",
      "passwordBox": "[basics('passwordBox')]"
    }
  }
}
```

The following example **passes** because the `regex` requires at least 12 characters.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "passwordBox",
        "type": "Microsoft.Common.PasswordBox",
        "label": {
          "password": "Password",
          "confirmPassword": "Confirm password"
        },
        "toolTip": "Type a password",
        "constraints": {
          "required": true,
          "regex": "^[a-zA-Z0-9]{12,}$",
          "validationMessage": "Password must be at least 12 characters long, contain only numbers and letters"
        }
      }
    ],
    "steps": [],
    "outputs": {
      "location": "[location()]",
      "passwordBox": "[basics('passwordBox')]"
    }
  }
}
```

## Text box must use validation

Test name: **Textboxes Are Well Formed**

Use validation with text boxes to check for `constraints` that contain a `regex` and `message`.

The following example **fails**.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "textBox",
        "type": "Microsoft.Common.TextBox",
        "label": "Text box",
        "toolTip": "Type 1-30 alphanumeric characters",
        "placeholder": "Type your text here",
        "visible": true
      }
    ],
    "steps": [],
    "outputs": {
      "location": "[location()]",
      "textBox": "[basics('textBox')]"
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
        "name": "textBox",
        "type": "Microsoft.Common.TextBox",
        "label": "Text box",
        "toolTip": "Type 1-30 alphanumeric characters",
        "placeholder": "Type your text here",
        "constraints": {
          "required": true,
          "validations": [
            {
              "regex": "^[a-z0-9A-Z]{1,30}$",
              "message": "Only 1-30 characters alphanumeric characters are allowed."
            }
          ]
        },
        "visible": true
      }
    ],
    "steps": [],
    "outputs": {
      "location": "[location()]",
      "textBox": "[basics('textBox')]"
    }
  }
}
```

## toolTip must exist with a value

Test name: **Tooltips Should Be Present**

This test checks that the `toolTip` property exists and contains a value.

The following example **fails**.

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
        "toolTip": ""
      }
    ],
    "steps": [],
    "outputs": {
      "location": "[location()]",
      "comboBox": "[basics('comboBox')]"
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
      "location": "[location()]",
      "comboBox": "[basics('comboBox')]"
    }
  }
}
```

## Don't set a default user name

Test name: **Usernames Should Not Have A Default**

The test checks if there's a `defaultValue` set for [Microsoft.Compute.UserNameTextBox](../managed-applications/microsoft-compute-usernametextbox.md).

The following example **fails** because a `defaultValue` is provided.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "userNameBox",
        "type": "Microsoft.Compute.UserNameTextBox",
        "label": "User name",
        "defaultValue": "admin",
        "toolTip": "Enter your user name",
        "osPlatform": "Windows"
      }
    ],
    "steps": [],
    "outputs": {
      "location": "[location()]",
      "userNameBox": "[basics('userNameBox')]"
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
        "name": "userNameBox",
        "type": "Microsoft.Compute.UserNameTextBox",
        "label": "User name",
        "toolTip": "Enter your user name",
        "osPlatform": "Windows"
      }
    ],
    "steps": [],
    "outputs": {
      "location": "[location()]",
      "userNameBox": "[basics('userNameBox')]"
    }
  }
}
```

## Use message with validations

Test name: **Validations Must Have Message**

This test checks that any `validations` in _createUiDefinition.json_ include a `message`.

The following example **fails** because the `regex` validation doesn't have a `message`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "textBox",
        "type": "Microsoft.Common.TextBox",
        "label": "Text box",
        "toolTip": "Type 1-30 alphanumeric characters",
        "placeholder": "Type your text here",
        "constraints": {
          "required": true,
          "validations": [
            {
              "regex": "^[a-z0-9A-Z]{1,30}$"
            }
          ]
        },
        "visible": true
      }
    ],
    "steps": [],
    "outputs": {
      "location": "[location()]",
      "textBox": "[basics('textBox')]"
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
        "name": "textBox",
        "type": "Microsoft.Common.TextBox",
        "label": "Text box",
        "toolTip": "Type 1-30 alphanumeric characters",
        "placeholder": "Type your text here",
        "constraints": {
          "required": true,
          "validations": [
            {
              "regex": "^[a-z0-9A-Z]{1,30}$",
              "message": "Only 1-30 characters alphanumeric characters are allowed."
            }
          ]
        },
        "visible": true
      }
    ],
    "steps": [],
    "outputs": {
      "location": "[location()]",
      "textBox": "[basics('textBox')]"
    }
  }
}
```

## Virtual machine sizes must match

Test name: **VM Sizes Must Match Template**

This test checks that the [Microsoft.Compute.SizeSelector](../managed-applications/microsoft-compute-sizeselector.md) is in the _createUiDefinition.json_ `outputs` and the main template's `parameters` section. Main template parameters that specify a `defaultValue` must match a value in the control's `allowedSizes`.

This test checks the main template and _createUiDefinition.json_ file. An example of the _createUiDefinition.json_ file is shown after the main template examples.

The following example **fails** because the main template's `defaultValue` doesn't match a value in `allowedSizes`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string"
    },
    "vmSize": {
      "type": "string",
      "defaultValue": "Standard_D9"
    }
  },
  "resources": [],
  "outputs": {
    "location": {
      "type": "string",
      "value": "[parameters('location')]"
    },
    "vmSize": {
      "type": "string",
      "value": "[parameters('vmSize')]"
    }
  }
}
```

The following example **passes** because the main template's `defaultValue` matches a value in `allowedSizes`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string"
    },
    "vmSize": {
      "type": "string",
      "defaultValue": "Standard_D3"
    }
  },
  "resources": [],
  "outputs": {
    "location": {
      "type": "string",
      "value": "[parameters('location')]"
    },
    "vmSize": {
      "type": "string",
      "value": "[parameters('vmSize')]"
    }
  }
}
```

The _createUiDefinition.json_ file for this example:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {
        "name": "vmSize",
        "type": "Microsoft.Compute.SizeSelector",
        "label": "VM Size",
        "toolTip": "Select a virtual machine size",
        "recommendedSizes": [
          "Standard_D1"
        ],
        "constraints": {
          "allowedSizes": [
            "Standard_D1",
            "Standard_D2",
            "Standard_D3"
          ]
        },
        "osPlatform": "Windows",
        "visible": true
      }
    ],
    "steps": [],
    "outputs": {
      "location": "[location()]",
      "vmSize": "[basics('vmSize')]"
    }
  }
}
```

## Next steps

- To create an Azure portal user interface, see [CreateUiDefinition.json for Azure managed application's create experience](../managed-applications/create-uidefinition-overview.md).
- To use the Create UI Definition Sandbox, see [Test your portal interface for Azure Managed Applications](../managed-applications/test-createuidefinition.md).
- For more information about UI controls, see [CreateUiDefinition elements](../managed-applications/create-uidefinition-elements.md) and [CreateUiDefinition functions](../managed-applications/create-uidefinition-functions.md).
- To learn more about ARM template tests, see [Test cases for ARM templates](template-test-cases.md).
