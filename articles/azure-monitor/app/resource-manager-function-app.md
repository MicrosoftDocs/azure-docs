---
title: Resource Manager template samples for Azure Function App + Application Insights Resources
description: Sample Azure Resource Manager templates to deploy an Azure Function App with an Application Insights resource.
ms.topic: sample
ms.date: 04/27/2022
---

# Resource Manager template sample for creating Azure Function apps with Application Insights monitoring

This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to deploy and configure [classic Application Insights resources](../app/create-new-resource.md) in conjunction with an Azure Function app. The sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

## Azure Function App

The following sample creates a .NET Core 3.1 Azure Function app running on a Windows App Service plan and a [classic Application Insights resource](../app/create-new-resource.md) with monitoring enabled.

### Template file

# [Bicep](#tab/bicep)

```bicep
param subscriptionId string
param name string
param location string
param hostingPlanName string
param serverFarmResourceGroup string
param alwaysOn bool
param storageAccountName string

resource site 'Microsoft.Web/sites@2021-03-01' = {
  name: name
  kind: 'functionapp'
  location: location
  properties: {
    siteConfig: {
      appSettings: [
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~3'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: reference('microsoft.insights/components/function-app-01', '2015-05-01').InstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: reference('microsoft.insights/components/function-app-01', '2015-05-01').ConnectionString
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
        }
      ]
      alwaysOn: alwaysOn
    }
    serverFarmId: '/subscriptions/${subscriptionId}/resourcegroups/${serverFarmResourceGroup}/providers/Microsoft.Web/serverfarms/${hostingPlanName}'
    clientAffinityEnabled: true
  }
  dependsOn: [
    functionApp
  ]
}

resource functionApp 'microsoft.insights/components@2015-05-01' = {
  name: 'function-app-01'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
  }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-08-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  properties: {
    supportsHttpsTrafficOnly: true
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "subscriptionId": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "hostingPlanName": {
      "type": "string"
    },
    "serverFarmResourceGroup": {
      "type": "string"
    },
    "alwaysOn": {
      "type": "bool"
    },
    "storageAccountName": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2021-03-01",
      "name": "[parameters('name')]",
      "kind": "functionapp",
      "location": "[parameters('location')]",
      "properties": {
        "siteConfig": {
          "appSettings": [
            {
              "name": "FUNCTIONS_EXTENSION_VERSION",
              "value": "~3"
            },
            {
              "name": "FUNCTIONS_WORKER_RUNTIME",
              "value": "dotnet"
            },
            {
              "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
              "value": "[reference('microsoft.insights/components/function-app-01', '2015-05-01').InstrumentationKey]"
            },
            {
              "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
              "value": "[reference('microsoft.insights/components/function-app-01', '2015-05-01').ConnectionString]"
            },
            {
              "name": "AzureWebJobsStorage",
              "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1};EndpointSuffix=core.windows.net', parameters('storageAccountName'), listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-08-01').keys[0])]"
            }
          ],
          "alwaysOn": "[parameters('alwaysOn')]"
        },
        "serverFarmId": "[format('/subscriptions/{0}/resourcegroups/{1}/providers/Microsoft.Web/serverfarms/{2}', parameters('subscriptionId'), parameters('serverFarmResourceGroup'), parameters('hostingPlanName'))]",
        "clientAffinityEnabled": true
      },
      "dependsOn": [
        "[resourceId('Microsoft.Insights/components', 'function-app-01')]",
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
      ]
    },
    {
      "type": "Microsoft.Insights/components",
      "apiVersion": "2015-05-01",
      "name": "function-app-01",
      "location": "[parameters('location')]",
      "kind": "web",
      "properties": {
        "Application_Type": "web",
        "Request_Source": "rest"
      }
    },
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-08-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": {
        "supportsHttpsTrafficOnly": true
      }
    }
  ]
}
```

---

### Parameters file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "subscriptionId": {
      "value": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    },
    "name": {
      "value": "function-app-01"
    },
    "location": {
      "value": "Central US"
    },
    "hostingPlanName": {
      "value": "WebApplication2720191003010920Plan"
    },
    "serverFarmResourceGroup": {
      "value": "Testwebapp01"
    },
    "alwaysOn": {
      "value": true
    },
    "storageAccountName": {
      "value": "storageaccountest93"
    }
  }
}
```

## Next steps

* [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
* [Learn more about classic Application Insights resources](../app/create-new-resource.md).
