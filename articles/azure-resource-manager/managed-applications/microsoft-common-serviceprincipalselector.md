---
title: ServicePrincipalSelector UI element
description: Describes the Microsoft.Common.ServicePrincipalSelector UI element for Azure portal. Provides a control to choose an application and a textbox to input a password or certificate thumbprint.
ms.topic: conceptual
ms.date: 11/17/2020
---

# Microsoft.Common.ServicePrincipalSelector UI element

A control that lets users select an existing [service principal](../../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) or register a new application. When you select **Create New**, you follow the steps to register a new application. When you select an existing application, the control provides a textbox to input a password or certificate thumbprint.

## UI samples

You can use a default application, create a new application, or use an existing application.

### Use default application or create new

The default view is determined by the values in the `defaultValue` property and the **Service Principal Type** is set to **Create New**. If the `principalId` property contains a valid globally unique identifier (GUID), the control searches for the application's `objectId`. The default value applies if the user doesn't make a selection from the control.

If you want to register a new application, select **Change selection** and the **Register an application** dialog box is displayed. Enter **Name**, **Supported account type**, and select the **Register** button.

:::image type="content" source="./media/managed-application-elements/microsoft-common-serviceprincipal-default.png" alt-text="Screenshot of Microsoft.Common.ServicePrincipalSelector initial view with default application or create new option.":::

After you register a new application, use the **Authentication Type** to enter a password or certificate thumbprint.

:::image type="content" source="./media/managed-application-elements/microsoft-common-serviceprincipal-authenticate.png" alt-text="Screenshot of Microsoft.Common.ServicePrincipalSelector authentication options after registering a new application.":::

### Use existing application

To use an existing application, choose **Select Existing** and then select **Make selection**. Use the **Select an application** dialog box to search for the application's name. From the results, select the the application and then the **Select** button. After you select an application, the control displays the **Authentication Type** to enter a password or certificate thumbprint.

:::image type="content" source="./media/managed-application-elements/microsoft-common-serviceprincipal-existing.png" alt-text="Screenshot of Microsoft.Common.ServicePrincipalSelector with select existing application option and authentication type displayed.":::

## Schema

```json
{
  "name": "ServicePrincipal",
  "type": "Microsoft.Common.ServicePrincipalSelector",
  "label": {
    "password": "Password",
    "certificateThumbprint": "Certificate thumbprint",
    "authenticationType": "Authentication Type",
    "sectionHeader": "Service Principal"
  },
  "toolTip": {
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

- The required properties are as follows:
  - `name`
  - `type`
  - `label`
  - `defaultValue`: Specifies the default `principalId` and `name`.

- The optional properties are as follows:
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
              "password": "Password",
              "certificateThumbprint": "Certificate thumbprint",
              "authenticationType": "Authentication Type",
              "sectionHeader": "Service Principal"
            },
            "toolTip": {
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

The `appId` is the Id of the application registration that you selected or created. The `objectId` is an array of object Ids for the service principals configured for the selected application registration.

When no selection is made from the control, the `newOrExisting` property value is **new**:

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

When **Create new** or an existing application is selected from the control the `newOrExisting` property value is **existing**:

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
