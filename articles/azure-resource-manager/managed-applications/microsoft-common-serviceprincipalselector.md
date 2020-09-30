---
title: ServicePrincipalSelector UI element
description: Describes the Microsoft.Common.ServicePrincipalSelector UI element for Azure portal. Provides a dropdown to choose an application identifier and a textbox to input a password or certificate thumbprint.
author: tfitzmac
ms.topic: conceptual
ms.date: 09/29/2020
ms.author: tomfitz
---

# Microsoft.Common.ServicePrincipalSelector UI element

A control that lets users select an existing service principal or register a new one. When you select **Create New**, you go through the steps to register a new application. When you select an existing application, the control provides a textbox to input a password or certificate thumbprint.

## UI sample

The default view is determined by the values in the `defaultValue` property. If the `principalId` property contains a valid globally unique identifier (GUID), the control searches for the application's object ID. The default value applies if the user doesn't make a selection from the dropdown.

:::image type="content" source="./media/managed-application-elements/microsoft-common-serviceprincipal-initial.png" alt-text="Microsoft.Common.ServicePrincipalSelector initial view":::

When you select **Create new** or an existing application identifier from the dropdown the **Authentication Type** is displayed to enter a password or certificate thumbprint in the text box.

:::image type="content" source="./media/managed-application-elements/microsoft-common-serviceprincipal-selection.png" alt-text="Microsoft.Common.ServicePrincipalSelector dropdown selection":::

## Schema

```json
{
  "name": "ServicePrincipal",
  "type": "Microsoft.Common.ServicePrincipalSelector",
  "label": {
    "principalId": "App Id",
    "password": "Password",
    "certificateThumbprint": "Certificate thumbprint",
    "authenticationType": "Authentication Type",
    "sectionHeader": "Service Principal"
  },
  "toolTip": {
    "principalId": "App Id",
    "password": "Password",
    "certificateThumbprint": "Certificate thumbprint",
    "authenticationType": "Authentication Type"
  },
  "defaultValue": {
    "principalId": "<default guid>",
    "name": "(New) default App Id"
  },
  "constraints": {
    "required": true,
    "regex": "^[a-zA-Z0-9]{8,}$",
    "validationMessage": "Password must be at least 8 characters long, contain only numbers and letters"
  },
  "options": {
    "hideCertificate": false
  },
  "visible": true
}
```

## Remarks

- The required properties are:
  - `name`
  - `type`
  - `label`
  - `defaultValue`: Specifies the default `principalId` and `name`.

- The optional properties are:
  - `toolTip`: Attaches a tooltip `infoBalloon` to each label.
  - `visible`: Hide or display the control.
  - `options`: Specifies whether or not the certificate thumbprint option should be made available.
  - `constraints`: Regex constraints for password validation.

## Example

The following is an example of the `Microsoft.Common.ServicePrincipalSelector` control. The `defaultValue` property sets `principalId` to `<default guid>` as a placeholder for a default application identifier GUID.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [],
    "steps": [
      {
        "name": "SPNcontrol",
        "label": "SPNcontrol",
        "elements": [
          {
            "name": "ServicePrincipal",
            "type": "Microsoft.Common.ServicePrincipalSelector",
            "label": {
              "principalId": "App Id",
              "password": "Password",
              "certificateThumbprint": "Certificate thumbprint",
              "authenticationType": "Authentication Type",
              "sectionHeader": "Service Principal"
            },
            "toolTip": {
              "principalId": "App Id",
              "password": "Password",
              "certificateThumbprint": "Certificate thumbprint",
              "authenticationType": "Authentication Type"
            },
            "defaultValue": {
              "principalId": "<default guid>",
              "name": "(New) default App Id"
            },
            "constraints": {
              "required": true,
              "regex": "^[a-zA-Z0-9]{8,}$",
              "validationMessage": "Password must be at least 8 characters long, contain only numbers and letters"
            },
            "options": {
              "hideCertificate": false
            },
            "visible": true
          }
        ]
      }
    ],
    "outputs": {
      "appId": "[steps('SPNcontrol').ServicePrincipal.appId]",
      "objectId": "[steps('SPNcontrol').ServicePrincipal.objectId]",
      "password": "[steps('SPNcontrol').ServicePrincipal.password]",
      "certificateThumbprint": "[steps('SPNcontrol').ServicePrincipal.certificateThumbprint]",
      "newOrExisting": "[steps('SPNcontrol').ServicePrincipal.newOrExisting]",
      "authenticationType": "[steps('SPNcontrol').ServicePrincipal.authenticationType]"
    }
  }
}
```

## Example output

The `appId` is the Id of the application registration that you selected or created. The `objectId` is an array of objectIds for the Service Principals configured for the selected application registration.

When no selection is made from the dropdown, the `newOrExisting` property value is **new**:

```json
{
  "appId": {
    "value": "<default guid>"
  },
  "objectId": {
    "value": ["<default guid>"]
  },
  "password": {
    "value": "<password>"
  },
  "certificateThumbprint": {
    "value": ""
  },
  "newOrExisting": {
    "value": "new"
  },
  "authenticationType": {
    "value": "password"
  }
}
```

When **Create new** or an existing application identifier is selected from the dropdown the `newOrExisting` property value is **existing**:

```json
{
  "appId": {
    "value": "<guid>"
  },
  "objectId": {
    "value": ["<guid>"]
  },
  "password": {
    "value": "<password>"
  },
  "certificateThumbprint": {
    "value": ""
  },
  "newOrExisting": {
    "value": "existing"
  },
  "authenticationType": {
    "value": "password"
  }
}
```

## Next steps

- For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
- For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
