---
title: CreateUiDefinition artifact
description: Shows how to create the createUiDefinition artifact for an Azure Managed Application. The file is named createUiDefinition.json.
ms.topic: conceptual
ms.date: 07/11/2019
---

# Reference: User interface elements artifact

This article is a reference for a *createUiDefinition.json* artifact in Azure Managed Applications. For more information about authoring user interface elements, see [Create user interface elements](create-uidefinition-elements.md).

## User interface elements

The following JSON shows an example of *createUiDefinition.json* file for Azure Managed Applications:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {}
    ],
    "steps": [
      {
        "name": "applicationSettings",
        "label": "Application Settings",
        "subLabel": {
          "preValidation": "Configure your application settings",
          "postValidation": "Done"
        },
        "bladeTitle": "Application Settings",
        "elements": [
          {
            "name": "funcname",
            "type": "Microsoft.Common.TextBox",
            "label": "Name of the function to be created",
            "toolTip": "Name of the function to be created",
            "visible": true,
            "constraints": {
              "required": true
            }
          },
          {
            "name": "storagename",
            "type": "Microsoft.Common.TextBox",
            "label": "Name of the storage to be created",
            "toolTip": "Name of the storage to be created",
            "visible": true,
            "constraints": {
              "required": true
            }
          },
          {
            "name": "zipFileBlobUri",
            "type": "Microsoft.Common.TextBox",
            "defaultValue": "https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.customproviders/custom-rp-with-function/artifacts/functionzip/functionpackage.zip",
            "label": "The Uri to the uploaded function zip file",
            "toolTip": "The Uri to the uploaded function zip file",
            "visible": true
          }
        ]
      }
    ],
    "outputs": {
      "funcname": "[steps('applicationSettings').funcname]",
      "storageName": "[steps('applicationSettings').storagename]",
      "zipFileBlobUri": "[steps('applicationSettings').zipFileBlobUri]"
    }
  }
}
```

## Next steps

- [Tutorial: Create managed application with custom actions and resources](tutorial-create-managed-app-with-custom-provider.md)
- [Reference: Deployment template artifact](reference-main-template-artifact.md)
- [Reference: View definition artifact](reference-view-definition-artifact.md)
