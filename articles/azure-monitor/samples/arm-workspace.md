---
title: Resource Manager template samples for Azure Monitor workspaces
description: Sample Azure Resource Manager templates to deploy Azure Monitor workspaces and configure data sources.
ms.subservice: logs
ms.topic: sample
author: bwren
ms.author: bwren
ms.date: 04/22/2020

---

# Resource Manager template samples for Azure Monitor workspaces
This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/template-syntax.md) to create and configure Log Analytics workspaces in Azure Monitor. Each sample includes a template file and a parameters file with sample values to provide to the template.



## Create a workbook
Workbooks can be complex, so a typical strategy is to create the workbook in the Azure portal and then generate a resource manager template. See details of this method in [Azure Resource Manager template for deploying workbooks](../platform/workbooks-automate.md#azure-resource-manager-template-for-deploying-workbooks)

The following sample creates a simple workbook.


### Template file

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "workbookDisplayName":  {             
            "type":"string",
            "defaultValue": "My Workbook",
            "metadata": {
                "description": "The friendly name for the workbook that is used in the Gallery or Saved List. Needs to be unique in the scope of the resource group and source" 
            }
        },
        "workbookType":  {             
            "type":"string",
            "defaultValue": "tsg",
            "metadata": {
                "description": "The gallery that the workbook will been shown under. Supported values include workbook, `tsg`, Azure Monitor, etc." 
            }
        },
        "workbookSourceId":  {             
            "type":"string",
            "defaultValue": "<insert-your-resource-id-here>",
            "metadata": {
                "description": "The id of resource instance to which the workbook will be associated" 
            }
        },
        "workbookId": {
            "type":"string",
            "defaultValue": "[newGuid()]",
            "metadata": {
                "description": "The unique guid for this workbook instance" 
            }
        }
    },    
    "resources": [
        {
            "name": "[parameters('workbookId')]",
            "type": "Microsoft.Insights/workbooks",
            "location": "[resourceGroup().location]",
            "kind": "shared",
            "apiVersion": "2018-06-17-preview",
            "dependsOn": [],
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
            "value": "[resourceId( 'Microsoft.Insights/workbooks', parameters('workbookId'))]"
        }
    }
}
```

### Parameter file

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
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

* [Deploy Windows agent to Azure VMs using Resource Manager template](../../virtual-machines/extensions/oms-windows.md).
* [Deploy Linux agent to Azure VMs using Resource Manager template](../../virtual-machines/extensions/oms-linux.md).
