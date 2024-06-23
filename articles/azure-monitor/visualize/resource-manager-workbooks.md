---
title: Resource Manager template samples for workbooks
description: Sample Azure Resource Manager templates to deploy Azure Monitor workbooks.
ms.topic: sample
ms.custom: devx-track-arm-template
author: bwren
ms.author: bwren
ms.date: 06/13/2022
---

# Resource Manager template samples for workbooks in Azure Monitor

This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to create workbooks in Azure Monitor. Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

Workbooks can be complex, so a typical strategy is to create the workbook in the Azure portal and then generate a Resource Manager template. See details of this method in [Azure Resource Manager template for deploying workbooks](../visualize/workbooks-automate.md).

## Create a workbook

The following sample creates a simple workbook.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('The unique guid for this workbook instance.')
param workbookId string = newGuid()

@description('The location of the resource.')
param location string = resourceGroup().location

@description('The friendly name for the workbook that is used in the Gallery or Saved List. Needs to be unique in the scope of the resource group and source.')
param workbookDisplayName string = 'My Workbook'

@description('The gallery that the workbook will been shown under. Supported values include workbook, `tsg`, Azure Monitor, etc.')
param workbookType string = 'tsg'

@description('The id of resource instance to which the workbook will be associated.')
param workbookSourceId string = '<insert-your-resource-id-here>'


resource workbook 'Microsoft.Insights/workbooks@2018-06-17-preview' = {
  name: workbookId
  location: location
  kind: 'shared'
  properties: {
    displayName: workbookDisplayName
    serializedData: '{"version":"Notebook/1.0","items":[{"type":1,"content":"{\\"json\\":\\"Hello World!\\"}","conditionalVisibility":null}],"isLocked":false}'
    version: '1.0'
    sourceId: workbookSourceId
    category: workbookType
  }
}

output workbookId string = workbook.id
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workbookId": {
      "type": "string",
      "defaultValue": "[newGuid()]",
      "metadata": {
        "description": "The unique guid for this workbook instance."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "The location of the resource."
      }
    },
    "workbookDisplayName": {
      "type": "string",
      "defaultValue": "My Workbook",
      "metadata": {
        "description": "The friendly name for the workbook that is used in the Gallery or Saved List. Needs to be unique in the scope of the resource group and source."
      }
    },
    "workbookType": {
      "type": "string",
      "defaultValue": "tsg",
      "metadata": {
        "description": "The gallery that the workbook will been shown under. Supported values include workbook, `tsg`, Azure Monitor, etc."
      }
    },
    "workbookSourceId": {
      "type": "string",
      "defaultValue": "<insert-your-resource-id-here>",
      "metadata": {
        "description": "The id of resource instance to which the workbook will be associated."
      }
    }
  },
  "resources": [
    {
      "type": "microsoft.insights/workbooks",
      "apiVersion": "2018-06-17-preview",
      "name": "[parameters('workbookId')]",
      "location": "[parameters('location')]",
      "kind": "shared",
      "properties": {
        "displayName": "[parameters('workbookDisplayName')]",
        "serializedData": "{\"version\":\"Notebook/1.0\",\"items\":[{\"type\":1,\"content\":\"{\\\"json\\\":\\\"Hello World!\\\"}\",\"conditionalVisibility\":null}],\"isLocked\":false}",
        "version": "1.0",
        "sourceId": "[parameters('workbookSourceId')]",
        "category": "[parameters('workbookType')]"
      }
    }
  ],
  "outputs": {
    "workbookId": {
      "type": "string",
      "value": "[resourceId('microsoft.insights/workbooks', parameters('workbookId'))]"
    }
  }
}
```

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workbookDisplayName": {
      "value": "Sample Hello World workbook"
    },
    "workbookType": {
      "value": "workbook"
    },
    "workbookSourceId": {
      "value": "Azure Monitor"
    }
  }
}
```

## Next steps

* [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
* [Learn more about action groups](../visualize/workbooks-overview.md).
