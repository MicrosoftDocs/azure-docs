---
title: Resource Manager template samples for Azure App Service + Application Insights Resources
description: Sample Azure Resource Manager templates to deploy an Azure App Service with an Application Insights resource.
ms.topic: sample
ms.custom: devx-track-dotnet
ms.date: 07/11/2022
ms.reviewer: vitalyg
---

# Resource Manager template samples for creating Azure App Services web apps with Application Insights monitoring

This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to deploy and configure [classic Application Insights resources](../app/create-new-resource.md) in conjunction with an Azure App Services web app. Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

## .NET Core runtime

The following sample creates a basic Azure App Service web app with the .NET Core runtime and a [classic Application Insights resource](../app/create-new-resource.md) with monitoring enabled.

### Template file

# [Bicep](#tab/bicep)

```bicep
param subscriptionId string
param name string
param location string
param hostingPlanName string
param serverFarmResourceGroup string
param alwaysOn bool
param phpVersion string
param errorLink string

resource site 'Microsoft.Web/sites@2021-03-01' = {
  name: name
  location: location
  properties: {
    siteConfig: {
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: reference('microsoft.insights/components/web-app-name-01', '2015-05-01').InstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: reference('microsoft.insights/components/web-app-name-01', '2015-05-01').ConnectionString
        }
        {
          name: 'ApplicationInsightsAgent_EXTENSION_VERSION'
          value: '~2'
        }
        {
          name: 'XDT_MicrosoftApplicationInsights_Mode'
          value: 'default'
        }
        {
          name: 'ANCM_ADDITIONAL_ERROR_PAGE_LINK'
          value: errorLink
        }
      ]
      phpVersion: phpVersion
      alwaysOn: alwaysOn
    }
    serverFarmId: '/subscriptions/${subscriptionId}/resourcegroups/${serverFarmResourceGroup}/providers/Microsoft.Web/serverfarms/${hostingPlanName}'
    clientAffinityEnabled: true
  }
  dependsOn: [
    webApp
  ]
}

resource webApp 'Microsoft.Insights/components@2020-02-02' = {
  name: 'web-app-name-01'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
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
    "phpVersion": {
      "type": "string"
    },
    "errorLink": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2021-03-01",
      "name": "[parameters('name')]",
      "location": "[parameters('location')]",
      "properties": {
        "siteConfig": {
          "appSettings": [
            {
              "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
              "value": "[reference('microsoft.insights/components/web-app-name-01', '2015-05-01').InstrumentationKey]"
            },
            {
              "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
              "value": "[reference('microsoft.insights/components/web-app-name-01', '2015-05-01').ConnectionString]"
            },
            {
              "name": "ApplicationInsightsAgent_EXTENSION_VERSION",
              "value": "~2"
            },
            {
              "name": "XDT_MicrosoftApplicationInsights_Mode",
              "value": "default"
            },
            {
              "name": "ANCM_ADDITIONAL_ERROR_PAGE_LINK",
              "value": "[parameters('errorLink')]"
            }
          ],
          "phpVersion": "[parameters('phpVersion')]",
          "alwaysOn": "[parameters('alwaysOn')]"
        },
        "serverFarmId": "[format('/subscriptions/{0}/resourcegroups/{1}/providers/Microsoft.Web/serverfarms/{2}', parameters('subscriptionId'), parameters('serverFarmResourceGroup'), parameters('hostingPlanName'))]",
        "clientAffinityEnabled": true
      },
      "dependsOn": [
        "[resourceId('Microsoft.Insights/components', 'web-app-name-01')]"
      ]
    },
    {
      "type": "Microsoft.Insights/components",
      "apiVersion": "2020-02-02",
      "name": "web-app-name-01",
      "location": "[parameters('location')]",
      "kind": "web",
      "properties": {
        "Application_Type": "web",
        "Request_Source": "rest"
      }
    }
  ]
}
```

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "subscriptionId": {
      "value": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    },
    "name": {
      "value": "web-app-name-01"
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
    "phpVersion": {
      "value": "OFF"
    },
    "errorLink": {
      "value": "https://web-app-name-01.scm.azurewebsites.net/detectors?type=tools&name=eventviewer"
    }
  }
}

```

## ASP.NET runtime

The following sample creates a basic Azure App Service web app with the ASP.NET runtime and a [classic Application Insights resource](../app/create-new-resource.md) with monitoring enabled.

### Template file

# [Bicep](#tab/bicep)

```bicep
param subscriptionId string
param name string
param location string
param hostingPlanName string
param serverFarmResourceGroup string
param alwaysOn bool
param phpVersion string
param netFrameworkVersion string

resource sites 'Microsoft.Web/sites@2021-03-01' = {
  name: name
  location: location
  properties: {
    siteConfig: {
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: reference('microsoft.insights/components/web-app-name-01', '2015-05-01').InstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: reference('microsoft.insights/components/web-app-name-01', '2015-05-01').ConnectionString
        }
        {
          name: 'ApplicationInsightsAgent_EXTENSION_VERSION'
          value: '~2'
        }
        {
          name: 'XDT_MicrosoftApplicationInsights_Mode'
          value: 'default'
        }
      ]
      phpVersion: phpVersion
      netFrameworkVersion: netFrameworkVersion
      alwaysOn: alwaysOn
    }
    serverFarmId: '/subscriptions/${subscriptionId}/resourcegroups/${serverFarmResourceGroup}/providers/Microsoft.Web/serverfarms/${hostingPlanName}'
    clientAffinityEnabled: true
  }
  dependsOn: [
    webApp
  ]
}

resource webApp 'Microsoft.Insights/components@2020-02-02' = {
  name: 'web-app-name-01'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
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
    "phpVersion": {
      "type": "string"
    },
    "netFrameworkVersion": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2021-03-01",
      "name": "[parameters('name')]",
      "location": "[parameters('location')]",
      "properties": {
        "siteConfig": {
          "appSettings": [
            {
              "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
              "value": "[reference('microsoft.insights/components/web-app-name-01', '2015-05-01').InstrumentationKey]"
            },
            {
              "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
              "value": "[reference('microsoft.insights/components/web-app-name-01', '2015-05-01').ConnectionString]"
            },
            {
              "name": "ApplicationInsightsAgent_EXTENSION_VERSION",
              "value": "~2"
            },
            {
              "name": "XDT_MicrosoftApplicationInsights_Mode",
              "value": "default"
            }
          ],
          "phpVersion": "[parameters('phpVersion')]",
          "netFrameworkVersion": "[parameters('netFrameworkVersion')]",
          "alwaysOn": "[parameters('alwaysOn')]"
        },
        "serverFarmId": "[format('/subscriptions/{0}/resourcegroups/{1}/providers/Microsoft.Web/serverfarms/{2}', parameters('subscriptionId'), parameters('serverFarmResourceGroup'), parameters('hostingPlanName'))]",
        "clientAffinityEnabled": true
      },
      "dependsOn": [
        "[resourceId('Microsoft.Insights/components', 'web-app-name-01')]"
      ]
    },
    {
      "type": "Microsoft.Insights/components",
      "apiVersion": "2020-02-02",
      "name": "web-app-name-01",
      "location": "[parameters('location')]",
      "kind": "web",
      "properties": {
        "Application_Type": "web",
        "Request_Source": "rest"
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
      "value": "web-app-name-01"
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
    "phpVersion": {
      "value": "OFF"
    },
    "netFrameworkVersion": {
      "value": "v4.0"
    }
  }
}
```

## Node.js runtime (Linux)

The following sample creates a basic Azure App Service Linux web app with the Node.js runtime and a [classic Application Insights resource](../app/create-new-resource.md) with monitoring enabled.

### Template file

# [Bicep](#tab/bicep)

```bicep
param subscriptionId string
param name string
param location string
param hostingPlanName string
param serverFarmResourceGroup string
param alwaysOn bool
param linuxFxVersion string

resource site 'Microsoft.Web/sites@2021-03-01' = {
  name: name
  location: location
  properties: {
    siteConfig: {
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: reference('microsoft.insights/components/web-app-name-01', '2015-05-01').InstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: reference('microsoft.insights/components/web-app-name-01', '2015-05-01').ConnectionString
        }
        {
          name: 'ApplicationInsightsAgent_EXTENSION_VERSION'
          value: '~2'
        }
        {
          name: 'XDT_MicrosoftApplicationInsights_Mode'
          value: 'default'
        }
      ]
      linuxFxVersion: linuxFxVersion
      alwaysOn: alwaysOn
    }
    serverFarmId: '/subscriptions/${subscriptionId}/resourcegroups/${serverFarmResourceGroup}/providers/Microsoft.Web/serverfarms/${hostingPlanName}'
    clientAffinityEnabled: false
  }
  dependsOn: [
    webApp
  ]
}

resource webApp 'Microsoft.Insights/components@2020-02-02' = {
  name: 'web-app-name-01'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
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
    "linuxFxVersion": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2021-03-01",
      "name": "[parameters('name')]",
      "location": "[parameters('location')]",
      "properties": {
        "siteConfig": {
          "appSettings": [
            {
              "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
              "value": "[reference('microsoft.insights/components/web-app-name-01', '2015-05-01').InstrumentationKey]"
            },
            {
              "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
              "value": "[reference('microsoft.insights/components/web-app-name-01', '2015-05-01').ConnectionString]"
            },
            {
              "name": "ApplicationInsightsAgent_EXTENSION_VERSION",
              "value": "~2"
            },
            {
              "name": "XDT_MicrosoftApplicationInsights_Mode",
              "value": "default"
            }
          ],
          "linuxFxVersion": "[parameters('linuxFxVersion')]",
          "alwaysOn": "[parameters('alwaysOn')]"
        },
        "serverFarmId": "[format('/subscriptions/{0}/resourcegroups/{1}/providers/Microsoft.Web/serverfarms/{2}', parameters('subscriptionId'), parameters('serverFarmResourceGroup'), parameters('hostingPlanName'))]",
        "clientAffinityEnabled": false
      },
      "dependsOn": [
        "[resourceId('Microsoft.Insights/components', 'web-app-name-01')]"
      ]
    },
    {
      "type": "Microsoft.Insights/components",
      "apiVersion": "2020-02-02",
      "name": "web-app-name-01",
      "location": "[parameters('location')]",
      "kind": "web",
      "properties": {
        "Application_Type": "web",
        "Request_Source": "rest"
      }
    }
  ]
}
```

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "subscriptionId": {
      "value": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    },
    "name": {
      "value": "web-app-name-01"
    },
    "location": {
      "value": "Central US"
    },
    "hostingPlanName": {
      "value": "App-planTest01-916e"
    },
    "serverFarmResourceGroup": {
      "value": "app_resource_group_custom"
    },
    "alwaysOn": {
      "value": true
    },
    "linuxFxVersion": {
      "value": "NODE|12-lts"
    }
  }
}
```

## Next steps

* [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
* [Learn more about classic Application Insights resources](../app/create-new-resource.md).
