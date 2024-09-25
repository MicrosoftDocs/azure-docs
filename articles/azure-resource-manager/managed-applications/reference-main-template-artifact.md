---
title: Template artifact reference
description: Provides an example of the deployment template artifact for Azure Managed Applications.
ms.topic: reference
ms.date: 09/22/2024
---

# Reference: Deployment template artifact

This article is a reference for a _mainTemplate.json_ artifact in Azure Managed Applications. For more information about authoring deployment template, see [Azure Resource Manager templates](../templates/syntax.md).

## Deployment template

The following JSON shows an example of _mainTemplate.json_ file for Azure Managed Applications:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "appServicePlanName": {
      "type": "string",
      "maxLength": 40,
      "metadata": {
        "description": "App Service plan name."
      }
    },
    "appServiceNamePrefix": {
      "type": "string",
      "maxLength": 47,
      "metadata": {
        "description": "App Service name prefix."
      }
    }
  },
  "variables": {
    "appServicePlanSku": "B1",
    "appServicePlanCapacity": 1,
    "appServiceName": "[format('{0}{1}', parameters('appServiceNamePrefix'), uniqueString(resourceGroup().id))]",
    "linuxFxVersion": "DOTNETCORE|8.0"
  },
  "resources": [
    {
      "type": "Microsoft.Web/serverfarms",
      "apiVersion": "2023-01-01",
      "name": "[parameters('appServicePlanName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[variables('appServicePlanSku')]",
        "capacity": "[variables('appServicePlanCapacity')]"
      },
      "kind": "linux",
      "properties": {
        "zoneRedundant": false,
        "reserved": true
      }
    },
    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2023-01-01",
      "name": "[variables('appServiceName')]",
      "location": "[parameters('location')]",
      "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('appServicePlanName'))]",
        "httpsOnly": true,
        "redundancyMode": "None",
        "siteConfig": {
          "linuxFxVersion": "[variables('linuxFxVersion')]",
          "minTlsVersion": "1.2",
          "ftpsState": "Disabled"
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', parameters('appServicePlanName'))]"
      ]
    }
  ],
  "outputs": {
    "appServicePlan": {
      "type": "string",
      "value": "[parameters('appServicePlanName')]"
    },
    "appServiceApp": {
      "type": "string",
      "value": "[reference(resourceId('Microsoft.Web/sites', variables('appServiceName')), '2023-01-01').defaultHostName]"
    }
  }
}
```

## Next steps

- [Reference: User interface elements artifact](reference-createuidefinition-artifact.md)
- [Reference: View definition artifact](reference-view-definition-artifact.md)
