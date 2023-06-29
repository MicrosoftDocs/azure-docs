---
title: Automate function app resource deployment to Azure
description: Learn how to build a Bicep file or an Azure Resource Manager template that deploys your function app.

ms.assetid: d20743e3-aab6-442c-a836-9bcea09bfd32
ms.topic: conceptual
ms.date: 08/30/2022
ms.custom: fasttrack-edit, devx-track-bicep, devx-track-arm-template
---

# Automate resource deployment for your function app in Azure Functions

You can use a Bicep file or an Azure Resource Manager template to deploy a function app. This article outlines the required resources and parameters for doing so. You might need to deploy other resources, depending on the [triggers and bindings](functions-triggers-bindings.md) in your function app. For more information about creating Bicep files, see [Understand the structure and syntax of Bicep files](../azure-resource-manager/bicep/file.md). For more information about creating templates, see [Authoring Azure Resource Manager templates](../azure-resource-manager/templates/syntax.md).

For sample Bicep files and ARM templates, see:

- [ARM templates for function app deployment](https://github.com/Azure-Samples/function-app-arm-templates)
- [Function app on Consumption plan]
- [Function app on Azure App Service plan]

## Required resources

An Azure Functions deployment typically consists of these resources:

# [Bicep](#tab/bicep)

| Resource                                                                           | Requirement | Syntax and properties reference                                                         |
|------------------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------------------|
| A function app                                                                     | Required    | [Microsoft.Web/sites](/azure/templates/microsoft.web/sites?pivots=deployment-language-bicep)                             |
| A [storage account](../storage/index.yml)                                         | Required    | [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts?pivots=deployment-language-bicep) |
| An [Application Insights](../azure-monitor/app/app-insights-overview.md) component | Optional    | [Microsoft.Insights/components](/azure/templates/microsoft.insights/components?pivots=deployment-language-bicep)         |
| A [hosting plan](./functions-scale.md)                                             | Optional<sup>1</sup>    | [Microsoft.Web/serverfarms](/azure/templates/microsoft.web/serverfarms?pivots=deployment-language-bicep)

# [JSON](#tab/json)

| Resource                                                                           | Requirement | Syntax and properties reference                                                         |
|------------------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------------------|
| A function app                                                                     | Required    | [Microsoft.Web/sites](/azure/templates/microsoft.web/sites?pivots=deployment-language-arm-template)                             |
| A [storage account](../storage/index.yml)                                          | Required    | [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts?pivots=deployment-language-arm-template) |
| An [Application Insights](../azure-monitor/app/app-insights-overview.md) component | Optional    | [Microsoft.Insights/components](/azure/templates/microsoft.insights/components?pivots=deployment-language-arm-template)         |
| A [hosting plan](./functions-scale.md)                                             | Optional<sup>1</sup>    | [Microsoft.Web/serverfarms](/azure/templates/microsoft.web/serverfarms?pivots=deployment-language-arm-template)                 |

---

<sup>1</sup>A hosting plan is only required when you choose to run your function app on a [Premium plan](./functions-premium-plan.md) or on an [App Service plan](../app-service/overview-hosting-plans.md).

> [!TIP]
> While not required, it is strongly recommended that you configure Application Insights for your app.

<a name="storage"></a>
### Storage account

A storage account is required for a function app. You need a general purpose account that supports blobs, tables, queues, and files. For more information, see [Azure Functions storage account requirements](storage-considerations.md#storage-account-requirements).

[!INCLUDE [functions-storage-access-note](../../includes/functions-storage-access-note.md)]

# [Bicep](#tab/bicep)

```bicep
resource storageAccountName 'Microsoft.Storage/storageAccounts@2022-05-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: storageAccountType
  }
  properties: {
    supportsHttpsTrafficOnly: true
    defaultToOAuthAuthentication: true
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2022-05-01",
    "name": "[parameters('storageAccountName')]",
    "location": "[parameters('location')]",
    "kind": "StorageV2",
    "sku": {
      "name": "[parameters('storageAccountType')]"
    },
    "properties": {
      "supportsHttpsTrafficOnly": true,
      "defaultToOAuthAuthentication": true
    }
  }
]
```

---

You must also specify the `AzureWebJobsStorage` connection in the site configuration. This can be set in the `appSettings` collection in the `siteConfig` object:

# [Bicep](#tab/bicep)

```bicep
resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  ...
  properties: {
    ...
    siteConfig: {
      ...
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        ...
      ]
    }
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/sites",
    ...
    "properties": {
      ...
      "siteConfig": {
        ...
        "appSettings": [
          {
            "name": "AzureWebJobsStorage",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}', parameters('storageAccountName'), listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-09-01').keys[0].value)]"
          },
          ...
       ]
      }
    }
  }
]
```

---

In some hosting plan options, function apps should also have an Azure Files content share, and they will need additional app settings referencing this storage account. These are covered later in this article as a part of the hosting plan options to which this applies.

#### Storage logs

Because the storage account is used for important function app data, you may want to monitor for modification of that content. To do this, you need to configure Azure Monitor resource logs for Azure Storage. In the following example, a Log Analytics workspace named `myLogAnalytics` is used as the destination for these logs. This same workspace can be used for the Application Insights resource defined later.

# [Bicep](#tab/bicep)

```bicep
resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2021-09-01' existing = {
  name:'default'
  parent:storageAccountName
}

resource storageDataPlaneLogs 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: '${storageAccountName}-logs'
  scope: blobService
  properties: {
    workspaceId: myLogAnalytics.id
    logs: [
      {
        category: 'StorageWrite'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'Transaction'
        enabled: true
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Insights/diagnosticSettings",
    "apiVersion": "2021-05-01-preview",
    "scope": "[format('Microsoft.Storage/storageAccounts/{0}/blobServices/default', parameters('storageAccountName'))]",
    "name": "[parameters('storageDataPlaneLogsName')]",
    "properties": {
        "workspaceId": "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('myLogAnalytics'))]",
        "logs": [
          {
            "category": "StorageWrite",
            "enabled": true
          }
        ],
        "metrics": [
          {
            "category": "Transaction",
            "enabled": true
          }
        ]
    }
  }
]
```

---

See [Monitoring Azure Storage](../storage/blobs/monitor-blob-storage.md) for instructions on how to work with these logs.

### Application Insights

Application Insights is recommended for monitoring your function apps. The Application Insights resource is defined with the type `Microsoft.Insights/components` and the kind **web**:

# [Bicep](#tab/bicep)

```bicep
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: appInsightsLocation
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'IbizaWebAppExtensionCreate'
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Insights/components",
    "apiVersion": "2020-02-02",
    "name": "[parameters('applicationInsightsName')]",
    "location": "[parameters('appInsightsLocation')]",
    "kind": "web",
    "properties": {
      "Application_Type": "web",
      "Request_Source": "IbizaWebAppExtensionCreate"
    }
  }
]
```

---

In addition, the instrumentation key needs to be provided to the function app using the `APPINSIGHTS_INSTRUMENTATIONKEY` application setting. This property is specified in the `appSettings` collection in the `siteConfig` object:

# [Bicep](#tab/bicep)

```bicep
resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  ...
  properties: {
    ...
    siteConfig: {
      ...
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
        ...
      ]
    }
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/sites",
    ...
    "properties": {
      ...
      "siteConfig": {
        ...
        "appSettings": [
          {
            "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').InstrumentationKey]"
          },
          ...
        ]
      }
    }
  }
]
```

---

### Hosting plan

The definition of the hosting plan varies, and can be one of the following plans:

- [Consumption plan](#consumption) (default)
- [Premium plan](#premium)
- [App Service plan](#app-service-plan)

### Function app

The function app resource is defined by using a resource of type **Microsoft.Web/sites** and kind **functionapp**:

# [Bicep](#tab/bicep)

```bicep
resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  identity:{
    type:'SystemAssigned'
  }
  properties: {
    serverFarmId: hostingPlan.id
    clientAffinityEnabled: false
    siteConfig: {
      alwaysOn: true
    }
    httpsOnly: true
  }
  dependsOn: [
    storageAccount
  ]
}
```

# [JSON](#tab/json)

```json
"resources:": [
  {
    "type": "Microsoft.Web/sites",
    "apiVersion": "2022-03-01",
    "name": "[parameters('functionAppName')]",
    "location": "[parameters('location')]",
    "kind": "functionapp",
    "identity": {
      "type": "SystemAssigned"
    },
    "properties": {
      "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "clientAffinityEnabled": false,
      "siteConfig": {
        "alwaysOn": true
      },
      "httpsOnly": true
    },
    "dependsOn": [
      "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
      "[resourceId('Microsoft.Insights/components', parameters('applicationInsightsName'))]"
    ]
  }
]
```

---

> [!IMPORTANT]
> If you're explicitly defining a hosting plan, an additional item would be needed in the dependsOn array: `"[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]"`

A function app must include these application settings:

| Setting name                 | Description                                                                               | Example values                        |
|------------------------------|-------------------------------------------------------------------------------------------|---------------------------------------|
| AzureWebJobsStorage          | A connection string to a storage account that the Functions runtime uses for internal queueing | See [Storage account](#storage)       |
| FUNCTIONS_EXTENSION_VERSION  | The version of the Azure Functions runtime                                                | `~4`                                  |
| FUNCTIONS_WORKER_RUNTIME     | The language stack to be used for functions in this app                                   | `dotnet`, `node`, `java`, `python`, or `powershell` |
| WEBSITE_NODE_DEFAULT_VERSION | Only needed if using the `node` language stack on **Windows**, specifies the [version](./functions-reference-node.md#node-version) to use              | `~14`                             |

These properties are specified in the `appSettings` collection in the `siteConfig` property:

# [Bicep](#tab/bicep)

```bicep
resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  ...
  properties: {
    ...
    siteConfig: {
      ...
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${listKeys(storageAccountName, '2021-09-01').keys[0].value}'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~14'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        ...
      ]
    }
  }
}

```

# [JSON](#tab/json)

```json
"resources": [
  {
  "type": "Microsoft.Web/sites",
    ...
    "properties": {
      ...
      "siteConfig": {
        ...
        "appSettings": [
          {
            "name": "AzureWebJobsStorage",
                  "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}', parameters('storageAccountName'), listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-09-01').keys[0].value)]"
          },
          {
            "name": "FUNCTIONS_WORKER_RUNTIME",
            "value": "node"
          },
          {
            "name": "WEBSITE_NODE_DEFAULT_VERSION",
            "value": "~14"
          },
          {
            "name": "FUNCTIONS_EXTENSION_VERSION",
            "value": "~4"
          },
          ...
        ]
      }
    }
  }
]
```

---

<a name="consumption"></a>
## Deploy on Consumption plan

The Consumption plan automatically allocates compute power when your code is running, scales out as necessary to handle load, and then scales in when code isn't running. You don't have to pay for idle VMs, and you don't have to reserve capacity in advance. To learn more, see [Azure Functions scale and hosting](consumption-plan.md).

For a sample Bicep file/Azure Resource Manager template, see [Function app on Consumption plan].

### Create a Consumption plan

A Consumption plan doesn't need to be defined. When not defined, a plan is automatically be created or selected on a per-region basis when you create the function app resource itself.

The Consumption plan is a special type of `serverfarm` resource. You can specify it by using the `Dynamic` value for the `computeMode` and `sku` properties, as follows:

#### Windows

# [Bicep](#tab/bicep)

```bicep
resource hostingPlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: hostingPlanName
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
    size: 'Y1'
    family: 'Y'
    capacity: 0
  }
  properties: {
    computeMode: 'Dynamic'
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2022-03-01",
    "name": "[parameters('hostingPlanName')]",
    "location": "[parameters('location')]",
    "sku": {
      "name": "Y1",
      "tier": "Dynamic",
      "size": "Y1",
      "family": "Y",
      "capacity": 0
    },
    "properties": {
      "computeMode": "Dynamic"
    }
  }
]
```

---

#### Linux

To run your app on Linux, you must also set the property `"reserved": true` for the `serverfarms` resource:

# [Bicep](#tab/bicep)

```bicep
resource hostingPlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: hostingPlanName
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
    size: 'Y1'
    family: 'Y'
    capacity: 0
  }
  properties: {
    computeMode: 'Dynamic'
    reserved: true
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2022-03-01",
    "name": "[parameters('hostingPlanName')]",
    "location": "[parameters('location')]",
    "sku": {
      "name": "Y1",
      "tier": "Dynamic",
      "size": "Y1",
      "family": "Y",
      "capacity":0
    },
    "properties": {
      "computeMode": "Dynamic",
      "reserved": true
    }
  }
]
```

---

### Create a function app

When you explicitly define your Consumption plan, you must set the `serverFarmId` property on the app so that it points to the resource ID of the plan. Make sure that the function app has a `dependsOn` setting that also references the plan.

The settings required by a function app running in Consumption plan differ between Windows and Linux.

#### Windows

On Windows, a Consumption plan requires another two other settings in the site configuration: [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](functions-app-settings.md#website_contentazurefileconnectionstring) and [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare). This property configures the storage account where the function app code and configuration are stored.

For a sample Bicep file/Azure Resource Manager template, see [Azure Function App Hosted on Windows Consumption Plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-windows-consumption).

# [Bicep](#tab/bicep)

```bicep
resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: hostingPlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: applicationInsights.properties.InstrumentationKey
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: toLower(functionAppName)
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~14'
        }
      ]
    }
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/sites",
    "apiVersion": "2022-03-01",
    "name": "[parameters('functionAppName')]",
    "location": "[parameters('location')]",
    "kind": "functionapp",
    "dependsOn": [
      "[resourceId('Microsoft.Insights/components', parameters('applicationInsightsName'))]",
      "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
    ],
    "properties": {
      "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "siteConfig": {
        "appSettings": [
          {
            "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').InstrumentationKey]"
          },
          {
            "name": "AzureWebJobsStorage",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', parameters('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-09-01').keys[0].value)]"
          },
          {
            "name": "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', parameters('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-09-01').keys[0].value)]"
          },
          {
            "name": "WEBSITE_CONTENTSHARE",
            "value": "[toLower(parameters('functionAppName'))]"
          },
          {
            "name": "FUNCTIONS_EXTENSION_VERSION",
            "value": "~4"
          },
          {
            "name": "FUNCTIONS_WORKER_RUNTIME",
            "value": "node"
          },
          {
            "name": "WEBSITE_NODE_DEFAULT_VERSION",
            "value": "~14"
          }
        ]
      }
    }
  }
]
```

---

> [!IMPORTANT]
> Don't set the [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare) setting in a new deployment slot. This setting is generated for you when the app is created in the deployment slot.

#### Linux

The function app must have set `"kind": "functionapp,linux"`, and it must have set property `"reserved": true`. Linux apps should also include a `linuxFxVersion` property under siteConfig. If you're just deploying code, the value for this property is determined by your desired runtime stack in the format of runtime|runtimeVersion. For example: `python|3.7`, `node|14` and `dotnet|3.1`.

For Linux Consumption plan it is also required to add the two other settings in the site configuration: [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](functions-app-settings.md#website_contentazurefileconnectionstring) and [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare).

For a sample Bicep file/Azure Resource Manager template, see [Azure Function App Hosted on Linux Consumption Plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-linux-consumption).

# [Bicep](#tab/bicep)

```bicep
resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp,linux'
  properties: {
    reserved: true
    serverFarmId: hostingPlan.id
    siteConfig: {
      linuxFxVersion: 'node|14'
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: applicationInsights.properties.InstrumentationKey
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
      ]
    }
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/sites",
    "apiVersion": "2022-03-01",
    "name": "[parameters('functionAppName')]",
    "location": "[parameters('location')]",
    "kind": "functionapp,linux",
    "dependsOn": [
      "[resourceId('Microsoft.Insights/components', parameters('applicationInsightsName'))]",
      "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
    ],
    "properties": {
      "reserved": true,
      "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "siteConfig": {
        "linuxFxVersion": "node|14",
        "appSettings": [
          {
            "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02).InstrumentationKey]"
          },
          {
            "name": "AzureWebJobsStorage",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', parameters('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-09-01').keys[0].value)]"
          },
          {
            "name": "FUNCTIONS_EXTENSION_VERSION",
            "value": "~4"
          },
          {
            "name": "FUNCTIONS_WORKER_RUNTIME",
            "value": "node"
          }
        ]
      }
    }
  }
]
```

---

<a name="premium"></a>
## Deploy on Premium plan

The Premium plan offers the same scaling as the Consumption plan but includes dedicated resources and extra capabilities. To learn more, see [Azure Functions Premium Plan](./functions-premium-plan.md).

### Create a Premium plan

A Premium plan is a special type of `serverfarm` resource. You can specify it by using either `EP1`, `EP2`, or `EP3` for the `Name` property value in the `sku` as shown in the following samples:

#### Windows

# [Bicep](#tab/bicep)

```bicep
resource hostingPlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: hostingPlanName
  location: location
  sku: {
    name: 'EP1'
    tier: 'ElasticPremium'
    family: 'EP'
  }
  kind: 'elastic'
  properties: {
    maximumElasticWorkerCount: 20
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2022-03-01",
    "name": "[parameters('hostingPlanName')]",
    "location": "[parameters('location')]",
    "sku": {
      "name": "EP1",
      "tier": "ElasticPremium",
      "family": "EP"
    },
    "kind": "elastic",
    "properties": {
      "maximumElasticWorkerCount": 20
    }
  }
]
```

---

#### Linux

To run your app on Linux, you must also set property `"reserved": true` for the serverfarms resource:

# [Bicep](#tab/bicep)

```bicep
resource hostingPlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: hostingPlanName
  location: location
  sku: {
    name: 'EP1'
    tier: 'ElasticPremium'
    family: 'EP'
  }
  kind: 'elastic'
  properties: {
    maximumElasticWorkerCount: 20
    reserved: true
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2022-03-01",
    "name": "[parameters('hostingPlanName')]",
    "location": "[parameters('location')]",
    "sku": {
      "name": "EP1",
      "tier": "ElasticPremium",
      "family": "EP",
    },
    "kind": "elastic",
    "properties": {
      "maximumElasticWorkerCount": 20,
      "reserved": true
    }
  }
]
```

---
### Create a function app

For function app on a Premium plan, you'll need to set the `serverFarmId` property on the app so that it points to the resource ID of the plan. You should ensure that the function app has a `dependsOn` setting for the plan as well.

A Premium plan requires another settings in the site configuration: [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](functions-app-settings.md#website_contentazurefileconnectionstring) and [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare). This property configures the storage account where the function app code and configuration are stored, which are used for dynamic scale.

For a sample Bicep file/Azure Resource Manager template, see [Azure Function App Hosted on Premium Plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-premium-plan).

The settings required by a function app running in Premium plan differ between Windows and Linux.

#### Windows

# [Bicep](#tab/bicep)

```bicep
resource functionAppName_resource 'Microsoft.Web/sites@2022-03-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: hostingPlanName.id
    siteConfig: {
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: applicationInsightsName.properties.InstrumentationKey
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: toLower(functionAppName)
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~14'
        }
      ]
    }
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/sites",
    "apiVersion": "2022-03-01",
    "name": "[parameters('functionAppName')]",
    "location": "[parameters('location')]",
    "kind": "functionapp",
    "dependsOn": [
      "[resourceId('Microsoft.Insights/components', parameters('applicationInsightsName'))]",
      "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
    ],
    "properties": {
      "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "siteConfig": {
        "appSettings": [
          {
            "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').InstrumentationKey]"
          },
          {
            "name": "AzureWebJobsStorage",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', parameters('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-09-01').keys[0].value)]"
          },
          {
            "name": "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', parameters('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-09-01').keys[0].value)]"
          },
          {
            "name": "WEBSITE_CONTENTSHARE",
            "value": "[toLower(parameters('functionAppName'))]"
          },
          {
            "name": "FUNCTIONS_EXTENSION_VERSION",
            "value": "~4"
          },
          {
            "name": "FUNCTIONS_WORKER_RUNTIME",
            "value": "node"
          },
          {
            "name": "WEBSITE_NODE_DEFAULT_VERSION",
            "value": "~14"
          }
        ]
      }
    }
  }
]
```

---

> [!IMPORTANT]
> You don't need to set the [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare) setting because it's generated for you when the site is first created.

#### Linux

The function app must have set `"kind": "functionapp,linux"`, and it must have set property `"reserved": true`. Linux apps should also include a `linuxFxVersion` property under siteConfig. If you're just deploying code, the value for this property is determined by your desired runtime stack in the format of runtime|runtimeVersion. For example: `python|3.7`, `node|14` and `dotnet|3.1`.

# [Bicep](#tab/bicep)

```bicep
resource functionApp 'Microsoft.Web/sites@2021-02-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp,linux'
  properties: {
    reserved: true
    serverFarmId: hostingPlan.id
    siteConfig: {
      linuxFxVersion: 'node|14'
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: applicationInsightsName.properties.InstrumentationKey
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: toLower(functionAppName)
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
      ]
    }
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/sites",
    "apiVersion": "2021-02-01",
    "name": "[parameters('functionAppName')]",
    "location": "[parameters('location')]",
    "kind": "functionapp,linux",
    "dependsOn": [
      "[resourceId('Microsoft.Insights/components', parameters('applicationInsightsName'))]",
      "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
    ],
    "properties": {
      "reserved": true,
      "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "siteConfig": {
        "linuxFxVersion": "node|14",
        "appSettings": [
          {
            "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').InstrumentationKey]"
          },
          {
            "name": "AzureWebJobsStorage",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', parameters('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-09-01').keys[0].value)]"
          },
          {
            "name": "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', parameters('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-09-01').keys[0].value)]"
          },
          {
            "name": "WEBSITE_CONTENTSHARE",
            "value": "[toLower(parameters('functionAppName'))]"
          },
          {
            "name": "FUNCTIONS_EXTENSION_VERSION",
            "value": "~4"
          },
          {
            "name": "FUNCTIONS_WORKER_RUNTIME",
            "value": "node"
          }
        ]
      }
    }
  }
]
```

---

<a name="app-service-plan"></a>
## Deploy on App Service plan

In the App Service plan, your function app runs on dedicated VMs on Basic, Standard, and Premium SKUs, similar to web apps. For details about how the App Service plan works, see the [Azure App Service plans in-depth overview](../app-service/overview-hosting-plans.md).

For a sample Bicep file/Azure Resource Manager template, see [Function app on Azure App Service plan].

### Create a Dedicated plan

In Functions, the Dedicated plan is just a regular App Service plan, which is defined by a `serverfarm` resource. You can specify the SKU as follows:

#### Windows

# [Bicep](#tab/bicep)

```bicep
resource hostingPlanName 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: hostingPlanName
  location: location
  sku: {
    tier: 'Standard'
    name: 'S1'
    size: 'S1'
    family: 'S'
    capacity: 1
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2022-03-01",
    "name": "[parameters('hostingPlanName')]",
    "location": "[parameters('location')]",
    "sku": {
      "tier": "Standard",
      "name": "S1",
      "size": "S1",
      "family": "S",
      "capacity": 1
    }
  }
]
```

---

#### Linux

To run your app on Linux, you must also set property `"reserved": true` for the serverfarms resource:

# [Bicep](#tab/bicep)

```bicep
resource hostingPlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: hostingPlanName
  location: location
  sku: {
    tier: 'Standard'
    name: 'S1'
    size: 'S1'
    family: 'S'
    capacity: 1
  }
  properties: {
    reserved: true
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2022-03-01",
    "name": "[parameters('hostingPlanName')]",
    "location": "[parameters('location')]",
    "sku": {
      "tier": "Standard",
      "name": "S1",
      "size": "S1",
      "family": "S",
      "capacity": 1
    },
    "properties": {
      "reserved": true
    }
  }
]
```

---

### Create a function app

For function app on a Dedicated plan, you must set the `serverFarmId` property on the app so that it points to the resource ID of the plan. Make sure that the function app has a `dependsOn` setting that also references the plan.

On App Service plan, you should enable the `"alwaysOn": true` setting under site config so that your function app runs correctly. On an App Service plan, the functions runtime goes idle after a few minutes of inactivity, so only HTTP triggers will "wake up" your functions.

The [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](functions-app-settings.md#website_contentazurefileconnectionstring) and [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare) settings aren't supported on Dedicated plan.

For a sample Bicep file/Azure Resource Manager template, see [Azure Function App Hosted on Dedicated Plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-dedicated-plan).

The settings required by a function app running in Dedicated plan differ between Windows and Linux.

#### Windows

# [Bicep](#tab/bicep)

```bicep
resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: hostingPlan.id
    siteConfig: {
      alwaysOn: true
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: applicationInsightsName.properties.InstrumentationKey
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~14'
        }
      ]
    }
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/sites",
    "apiVersion": "2022-03-01",
    "name": "[parameters('functionAppName')]",
    "location": "[parameters('location')]",
    "kind": "functionapp",
    "dependsOn": [
      "[resourceId('Microsoft.Insights/components', parameters('applicationInsightsName'))]",
      "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
    ],
    "properties": {
      "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "siteConfig": {
        "alwaysOn": true,
        "appSettings": [
          {
            "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').InstrumentationKey]"
          },
          {
            "name": "AzureWebJobsStorage",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', parameters('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-09-01').keys[0].value)]"
          },
          {
            "name": "FUNCTIONS_EXTENSION_VERSION",
            "value": "~4"
          },
          {
            "name": "FUNCTIONS_WORKER_RUNTIME",
            "value": "node"
          },
          {
            "name": "WEBSITE_NODE_DEFAULT_VERSION",
            "value": "~14"
          }
        ]
      }
    }
  }
]
```

---

#### Linux

The function app must have set `"kind": "functionapp,linux"`, and it must have set property `"reserved": true`. Linux apps should also include a `linuxFxVersion` property under siteConfig. If you're just deploying code, the value for this property is determined by your desired runtime stack in the format of runtime|runtimeVersion. Examples of `linuxFxVersion` property include:  `python|3.7`, `node|14` and `dotnet|3.1`.

# [Bicep](#tab/bicep)

```bicep
resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp,linux'
  properties: {
    reserved: true
    serverFarmId: hostingPlan.id
    siteConfig: {
      alwaysOn: true
      linuxFxVersion: 'node|14'
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: applicationInsightsName.properties.InstrumentationKey
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
      ]
    }
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/sites",
    "apiVersion": "2022-03-01",
    "name": "[parameters('functionAppName')]",
    "location": "[parameters('location')]",
    "kind": "functionapp,linux",
    "dependsOn": [
      "[resourceId('Microsoft.Insights/components', parameters('applicationInsightsName'))]",
      "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
    ],
    "properties": {
      "reserved": true,
      "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "siteConfig": {
        "alwaysOn": true,
        "linuxFxVersion": "node|14",
        "appSettings": [
          {
            "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').InstrumentationKey]"
          },
          {
            "name": "AzureWebJobsStorage",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', parameters('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-09-01').keys[0].value)]"
          },
          {
            "name": "FUNCTIONS_EXTENSION_VERSION",
            "value": "~4"
          },
          {
            "name": "FUNCTIONS_WORKER_RUNTIME",
            "value": "node"
          }
        ]
      }
    }
  }
]
```

---

### Custom Container Image

If you're [deploying a custom container image](./functions-how-to-custom-container.md), you must specify it with `linuxFxVersion` and include configuration that allows your image to be pulled, as in [Web App for Containers](../app-service/index.yml). Also, set `WEBSITES_ENABLE_APP_SERVICE_STORAGE` to `false`, since your app content is provided in the container itself:

# [Bicep](#tab/bicep)

```bicep
resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: hostingPlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~14'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: dockerRegistryUrl
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: dockerRegistryUsername
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: dockerRegistryPassword
        }
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
      ]
      linuxFxVersion: 'DOCKER|myacr.azurecr.io/myimage:mytag'
    }
  }
  dependsOn: [
    storageAccount
  ]
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/sites",
    "apiVersion": "2022-03-01",
    "name": "[parameters('functionAppName')]",
    "location": "[parameters('location')]",
    "kind": "functionapp",
    "dependsOn": [
      "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
    ],
    "properties": {
      "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "siteConfig": {
        "appSettings": [
          {
            "name": "AzureWebJobsStorage",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}', parameters('storageAccountName'), listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-09-01').keys[0].value)]"
          },
          {
            "name": "FUNCTIONS_WORKER_RUNTIME",
            "value": "node"
          },
          {
            "name": "WEBSITE_NODE_DEFAULT_VERSION",
            "value": "~14"
          },
          {
            "name": "FUNCTIONS_EXTENSION_VERSION",
            "value": "~4"
          },
          {
            "name": "DOCKER_REGISTRY_SERVER_URL",
            "value": "[parameters('dockerRegistryUrl')]"
          },
          {
            "name": "DOCKER_REGISTRY_SERVER_USERNAME",
            "value": "[parameters('dockerRegistryUsername')]"
          },
          {
            "name": "DOCKER_REGISTRY_SERVER_PASSWORD",
            "value": "[parameters('dockerRegistryPassword')]"
          },
          {
            "name": "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
            "value": "false"
          }
        ],
        "linuxFxVersion": "DOCKER|myacr.azurecr.io/myimage:mytag"
      }
    }
  }
]
```

---

## Deploy to Azure Arc

Azure Functions can be deployed to [Azure Arc-enabled Kubernetes](../app-service/overview-arc-integration.md). This process largely follows [deploying to an App Service plan](#deploy-on-app-service-plan), with a few differences to note.

To create the app and plan resources, you must have already [created an App Service Kubernetes environment](../app-service/manage-create-arc-environment.md) for an Azure Arc-enabled Kubernetes cluster. These examples assume you have the resource ID of the custom location and App Service Kubernetes environment that you're deploying to. For most Bicep files/ARM templates, you can supply these values as parameters.

# [Bicep](#tab/bicep)

```bicep
param kubeEnvironmentId string
param customLocationId string
```

# [JSON](#tab/json)

```json
"parameters": {
  "kubeEnvironmentId" : {
    "type": "string"
  },
  "customLocationId" : {
    "type": "string"
  }
}
```

---

Both sites and plans must reference the custom location through an `extendedLocation` field. This block sits outside of `properties`, peer to `kind` and `location`:

# [Bicep](#tab/bicep)

```bicep
resource hostingPlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  ...
  {
    extendedLocation: {
      name: customLocationId
    }
  }
}
```

# [JSON](#tab/json)

```json
{
  "type": "Microsoft.Web/serverfarms",
  ...
  {
    "extendedLocation": {
      "name": "[parameters('customLocationId')]"
    },
  }
}
```

---

The plan resource should use the Kubernetes (K1) SKU, and its `kind` field should be `linux,kubernetes`. Within `properties`, `reserved` should be `true`, and `kubeEnvironmentProfile.id` should be set to the App Service Kubernetes environment resource ID. An example plan might look like:

# [Bicep](#tab/bicep)

```bicep
resource hostingPlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: hostingPlanName
  location: location
  kind: 'linux,kubernetes'
  sku: {
    name: 'K1'
    tier: 'Kubernetes'
  }
  extendedLocation: {
    name: customLocationId
  }
  properties: {
    kubeEnvironmentProfile: {
      id: kubeEnvironmentId
    }
    reserved: true
  }
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2022-03-01",
    "name": "[parameters('hostingPlanName')]",
    "location": "[parameters('location')]",
    "kind": "linux,kubernetes",
    "sku": {
      "name": "K1",
      "tier": "Kubernetes"
    },
    "extendedLocation": {
      "name": "[parameters('customLocationId')]"
    },
    "properties": {
      "kubeEnvironmentProfile": {
        "id": "[parameters('kubeEnvironmentId')]"
      },
      "reserved": true
    }
  }
]
```

---

The function app resource should have its `kind` field set to **functionapp,linux,kubernetes** or **functionapp,linux,kubernetes,container** depending on if you intend to deploy via code or container. An example .NET 6.0 function app might look like:

# [Bicep](#tab/bicep)

```bicep
resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: functionAppName
  kind: 'kubernetes,functionapp,linux,container'
  location: location
  extendedLocation: {
    name: customLocationId
  }
  properties: {
    serverFarmId: hostingPlanName
    siteConfig: {
      linuxFxVersion: 'DOCKER|mcr.microsoft.com/azure-functions/dotnet:3.0-appservice-quickstart'
      appSettings: [
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: applicationInsightsName.properties.InstrumentationKey
        }
      ]
      alwaysOn: true
    }
  }
  dependsOn: [
    storageAccount
    hostingPlan
  ]
}
```

# [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/sites",
    "apiVersion": "2022-03-01",
    "name": "[parameters('functionAppName')]",
    "kind": "kubernetes,functionapp,linux,container",
    "location": "[parameters('location')]",
    "extendedLocation": {
      "name": "[parameters('customLocationId')]"
    },
    "dependsOn": [
      "[resourceId('Microsoft.Insights/components', parameters('applicationInsightsName'))]",
      "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
    ],
    "properties": {
      "serverFarmId": "[parameters('hostingPlanName')]",
      "siteConfig": {
        "linuxFxVersion": "DOCKER|mcr.microsoft.com/azure-functions/dotnet:3.0-appservice-quickstart",
        "appSettings": [
          {
            "name": "FUNCTIONS_EXTENSION_VERSION",
            "value": "~4"
          },
          {
            "name": "AzureWebJobsStorage",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}', parameters('storageAccountName'), listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-09-01').keys[0].value)]"
          },
          {
            "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').InstrumentationKey]"
          }
        ],
        "alwaysOn": true
      }
    }
  }
]
```

---

## Customizing a deployment

A function app has many child resources that you can use in your deployment, including app settings and source control options. You also might choose to remove the **sourcecontrols** child resource, and use a different [deployment option](functions-continuous-deployment.md) instead.

Considerations for custom deployments:

+ To successfully deploy your application by using Azure Resource Manager, it's important to understand how resources are deployed in Azure. In the following example, top-level configurations are applied by using `siteConfig`. It's important to set these configurations at a top level, because they convey information to the Functions runtime and deployment engine. Top-level information is required before the child **sourcecontrols/web** resource is applied. Although it's possible to configure these settings in the child-level **config/appSettings** resource, in some cases your function app must be deployed *before* **config/appSettings** is applied. For example, when you're using functions with [Logic Apps](../logic-apps/index.yml), your functions are a dependency of another resource.

    # [Bicep](#tab/bicep)
    
    ```bicep
    resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
      name: functionAppName
      location: location
      kind: 'functionapp'
      properties: {
        serverFarmId: hostingPlan.id
        siteConfig: {
          alwaysOn: true
          appSettings: [
            {
              name: 'FUNCTIONS_EXTENSION_VERSION'
              value: '~4'
            }
            {
              name: 'Project'
              value: 'src'
            }
          ]
        }
      }
      dependsOn: [
        storageAccount
      ]
    }
    
    resource config 'Microsoft.Web/sites/config@2022-03-01' = {
      parent: functionApp
      name: 'appsettings'
      properties: {
        AzureWebJobsStorage: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageAccount.listKeys().keys[0].value}'
        AzureWebJobsDashboard: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${storageAccount.listKeys().keys[0].value}'
        FUNCTIONS_EXTENSION_VERSION: '~4'
        FUNCTIONS_WORKER_RUNTIME: 'dotnet'
        Project: 'src'
      }
      dependsOn: [
        sourcecontrol
        storageAccount
      ]
    }
    
    resource sourcecontrol 'Microsoft.Web/sites/sourcecontrols@2022-03-01' = {
      parent: functionApp
      name: 'web'
      properties: {
        repoUrl: repoUrl
        branch: branch
        isManualIntegration: true
      }
    }
    ```
    
    # [JSON](#tab/json)
    
    ```json
    "resources": [
      {
        "type": "Microsoft.Web/sites",
        "apiVersion": "2022-03-01",
        "name": "[variables('functionAppName')]",
        "location": "[parameters('location')]",
        "kind": "functionapp",
        "properties": {
          "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
          "siteConfig": {
            "alwaysOn": true,
            "appSettings": [
              {
                "name": "FUNCTIONS_EXTENSION_VERSION",
                "value": "~4"
              },
              {
                "name": "Project",
                "value": "src"
              }
            ]
          }
        },
        "dependsOn": [
          "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
          "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]"
        ]
      },
      {
        "type": "Microsoft.Web/sites/config",
        "apiVersion": "2022-03-01",
        "name": "[format('{0}/{1}', variables('functionAppName'), 'appsettings')]",
        "properties": {
          "AzureWebJobsStorage": "[format('DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}', variables('storageAccountName'), listKeys(variables('storageAccountName'), '2021-09-01').keys[0].value)]",
          "AzureWebJobsDashboard": "[format('DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}', variables('storageAccountName'), listKeys(variables('storageAccountName'), '2021-09-01').keys[0].value)]",
          "FUNCTIONS_EXTENSION_VERSION": "~4",
          "FUNCTIONS_WORKER_RUNTIME": "dotnet",
          "Project": "src"
        },
        "dependsOn": [
          "[resourceId('Microsoft.Web/sites', variables('functionAppName'))]",
          "[resourceId('Microsoft.Web/sites/sourcecontrols', variables('functionAppName'), 'web')]",
          "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]"
        ]
      },
      {
        "type": "Microsoft.Web/sites/sourcecontrols",
        "apiVersion": "2022-03-01",
        "name": "[format('{0}/{1}', variables('functionAppName'), 'web')]",
        "properties": {
          "repoUrl": "[parameters('repoURL')]",
          "branch": "[parameters('branch')]",
          "isManualIntegration": true
        },
        "dependsOn": [
          "[resourceId('Microsoft.Web/sites', variables('functionAppName'))]"
        ]
      }
    ]
    ```
    
    ---

+ The previous Bicep file and ARM template use the [Project](https://github.com/projectkudu/kudu/wiki/Customizing-deployments#using-app-settings-instead-of-a-deployment-file) application settings value, which sets the base directory in which the Functions deployment engine (Kudu) looks for deployable code. In our repository, our functions are in a subfolder of the **src** folder. So, in the preceding example, we set the app settings value to `src`. If your functions are in the root of your repository, or if you're not deploying from source control, you can remove this app settings value.

+ When updating application settings using Bicep or ARM, make sure that you include all existing settings. You must do this because the underlying REST APIs calls replace the existing application settings when the update APIs are called. 

## Deploy your template

You can use any of the following ways to deploy your Bicep file and template:

# [Bicep](#tab/bicep)

- [Azure CLI](../azure-resource-manager/bicep/deploy-cli.md)
- [PowerShell](../azure-resource-manager/bicep/deploy-powershell.md)

# [JSON](#tab/json)

- [Azure portal](../azure-resource-manager/templates/deploy-portal.md)
- [Azure CLI](../azure-resource-manager/templates/deploy-cli.md)
- [PowerShell](../azure-resource-manager/templates/deploy-powershell.md)

---

### Deploy to Azure button

> [!NOTE]
> This method doesn't support deploying Bicep files currently.

Replace ```<url-encoded-path-to-azuredeploy-json>``` with a [URL-encoded](https://www.bing.com/search?q=url+encode) version of the raw path of your `azuredeploy.json` file in GitHub.

Here's an example that uses markdown:

```markdown
[![Deploy to Azure](https://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/<url-encoded-path-to-azuredeploy-json>)
```

Here's an example that uses HTML:

```html
<a href="https://portal.azure.com/#create/Microsoft.Template/uri/<url-encoded-path-to-azuredeploy-json>" target="_blank"><img src="https://azuredeploy.net/deploybutton.png"></a>
```

### Deploy using PowerShell

The following PowerShell commands create a resource group and deploy a Bicep file/ARM template that creates a function app with its required resources. To run locally, you must have [Azure PowerShell](/powershell/azure/install-azure-powershell) installed. Run [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount) to sign in.

# [Bicep](#tab/bicep)

```powershell
# Register Resource Providers if they're not already registered
Register-AzResourceProvider -ProviderNamespace "microsoft.web"
Register-AzResourceProvider -ProviderNamespace "microsoft.storage"

# Create a resource group for the function app
New-AzResourceGroup -Name "MyResourceGroup" -Location 'West Europe'

# Deploy the template
New-AzResourceGroupDeployment -ResourceGroupName "MyResourceGroup" -TemplateFile main.bicep  -Verbose
```

# [JSON](#tab/json)

```powershell
# Register Resource Providers if they're not already registered
Register-AzResourceProvider -ProviderNamespace "microsoft.web"
Register-AzResourceProvider -ProviderNamespace "microsoft.storage"

# Create a resource group for the function app
New-AzResourceGroup -Name "MyResourceGroup" -Location 'West Europe'

# Deploy the template
New-AzResourceGroupDeployment -ResourceGroupName "MyResourceGroup" -TemplateFile azuredeploy.json  -Verbose
```

---

To test out this deployment, you can use a [template like this one](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/function-app-create-dynamic) that creates a function app on Windows in a Consumption plan.

## Next steps

Learn more about how to develop and configure Azure Functions.

- [Azure Functions developer reference](functions-reference.md)
- [How to configure Azure function app settings](functions-how-to-use-azure-function-app-settings.md)
- [Create your first Azure function](./functions-get-started.md)

<!-- LINKS -->

[Function app on Consumption plan]: https://azure.microsoft.com/resources/templates/function-app-create-dynamic/
[Function app on Azure App Service plan]: https://azure.microsoft.com/resources/templates/function-app-create-dedicated/
