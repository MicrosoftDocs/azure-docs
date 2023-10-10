---
title: Automate function app resource deployment to Azure
description: Learn how to build a Bicep file or an Azure Resource Manager template that deploys your function app.
ms.assetid: d20743e3-aab6-442c-a836-9bcea09bfd32
ms.topic: conceptual
ms.date: 10/02/2023
ms.custom: fasttrack-edit, devx-track-bicep, devx-track-arm-template
zone_pivot_groups: functions-hosting-plan
---

# Automate resource deployment for your function app in Azure Functions

You can use a Bicep file or an Azure Resource Manager template to deploy a function app. This article outlines the required resources and parameters for doing so. You might need to deploy other resources, depending on the [triggers and bindings](functions-triggers-bindings.md) in your function app. For more information about creating Bicep files, see [Understand the structure and syntax of Bicep files](../azure-resource-manager/bicep/file.md). For more information about creating templates, see [Authoring Azure Resource Manager templates](../azure-resource-manager/templates/syntax.md).

For sample Bicep files and ARM templates, see:

- [ARM templates for function app deployment](https://github.com/Azure-Samples/function-app-arm-templates)
- [Function app on Consumption plan]
- [Function app on Elastic Premium plan](#premium)
- [Function app on Azure App Service plan]

>[!IMPORTANT]
>Deployment code depends on how your function app is hosted and whether you are deploying code or a containerized function app. This article supports the three Functions hosting plans (Consumption, Elastic Premium, and Dedicated), as well as deployments to both Azure Container Apps and Azure Arc. 
> 
> Choose your desired hosting at the top of the article.

An Azure Functions deployment typically consists of these resources:
:::zone pivot="premium-plan,dedicated-plan"  
| Resource  | Requirement | Syntax and properties reference |
|------|-------|----|
| A [storage account](#storage-account) | Required | [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| An [Application Insights](#application-insights) component | Optional<sup>1</sup> | [Microsoft.Insights/components](/azure/templates/microsoft.insights/components)|  
| A [hosting plan](#hosting-plan)| Required<sup>2</sup> | [Microsoft.Web/serverfarms](/azure/templates/microsoft.web/serverfarms) |
| A [function app](#function-app) | Required | [Microsoft.Web/sites](/azure/templates/microsoft.web/sites)  |
:::zone-end  
:::zone pivot="consumption-plan"  
| Resource  | Requirement | Syntax and properties reference |
|------|-------|----|
| A [storage account](#storage-account) | Required | [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| An [Application Insights](#application-insights) component | Optional<sup>1</sup> | [Microsoft.Insights/components](/azure/templates/microsoft.insights/components)|  
| A [function app](#function-app) | Required | [Microsoft.Web/sites](/azure/templates/microsoft.web/sites)  |
:::zone-end  
:::zone pivot="container-apps"  
| Resource  | Requirement | Syntax and properties reference |
|------|-------|----|
| A [storage account](#storage-account) | Required | [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| An [Application Insights](#application-insights) component | Optional<sup>1</sup> | [Microsoft.Insights/components](/azure/templates/microsoft.insights/components)|  
| A [managed environment](#managed-environment) | Required | [Microsoft.App/managedEnvironments](/azure/templates/microsoft.app/managedenvironments) |
| A [function app](#function-app) | Required | [Microsoft.Web/sites](/azure/templates/microsoft.web/sites)  |
:::zone-end  
:::zone pivot="azure-arc"  
| Resource  | Requirement | Syntax and properties reference |
|------|-------|----|
| A [storage account](#storage-account) | Required | [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| An [Application Insights](#application-insights) component | Optional<sup>1</sup> | [Microsoft.Insights/components](/azure/templates/microsoft.insights/components)|  
| An [App Service Kubernetes environment](#kubernetes-environment) | Required | [Microsoft.ExtendedLocation/customLocations](/azure/templates/microsoft.extendedlocation/customlocations)<br/> |
| A [function app](#function-app) | Required | [Microsoft.Web/sites](/azure/templates/microsoft.web/sites)  |
:::zone-end 

<sup>1</sup>While not required, you should configure Application Insights for your app.  
:::zone pivot="premium-plan,dedicated-plan" 
<sup>2</sup>An explicit hosting plan isn't required when you choose to host your function app in a [Consumption plan](./consumption-plan.md).
:::zone-end  
:::zone pivot="container-apps,azure-arc"  
## Prerequisites
:::zone-end  
:::zone pivot="container-apps" 
This article assumes that you have already created a managed environment in Azure Container Apps. You need both the name and the ID of the managed environment to create a function app hosted on Container Apps.  
:::zone-end  
:::zone pivot="azure-arc" 
This article assumes that you have already created an [App Service-enabled custom location](../app-service/overview-arc-integration.md) on an [Azure Arc-enabled Kubernetes cluster](../azure-arc/kubernetes/overview.md). managed environment in Azure Container Apps. You need both the custom location ID and the Kubernetes environment ID to create a function app hosted in an Azure Arc custom location.  
:::zone-end  
<a name="storage"></a>
## Create storage account

A storage account is required for a function app. You need a general purpose account that supports blobs, tables, queues, and files. For more information, see [Azure Functions storage account requirements](storage-considerations.md#storage-account-requirements).

[!INCLUDE [functions-storage-access-note](../../includes/functions-storage-access-note.md)]

### [Bicep](#tab/bicep)

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

For a complete example, see [main.bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/main.bicep#L37) in the templates repository.

### [JSON](#tab/json)

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

For a complete example, see [azuredeploy.json](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/azuredeploy.json#L77) in the templates repository.

---

You need to set the connection string of this storage account as the `AzureWebJobsStorage` app setting, which is required by Functions. The templates in this article construct this connection string value based on the created storage account. For more information, see [Application configuration](#application-configuration).  

### Enable storage logs

Because the storage account is used for important function app data, you may want to monitor for modification of that content. To do this, you need to configure Azure Monitor resource logs for Azure Storage. In the following example, a Log Analytics workspace named `myLogAnalytics` is used as the destination for these logs. This same workspace can be used for the Application Insights resource defined later.

#### [Bicep](#tab/bicep)

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

#### [JSON](#tab/json)

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

## Create Application Insights

Application Insights is recommended for monitoring your function app executions. The Application Insights resource is defined with the type `Microsoft.Insights/components` and the kind `web`:

### [Bicep](#tab/bicep)

:::code language="bicep" source="~/function-app-arm-templates/function-app-linux-consumption/main.bicep" range="60-70":::

For a complete example, see [main.bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/main.bicep#L60) in the templates repository.

### [JSON](#tab/json)

:::code language="json" source="~/function-app-arm-templates/function-app-linux-consumption/azuredeploy.json" range="102-114":::

For a complete example, see [azuredeploy.json](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/azuredeploy.json#L102) in the templates repository.

---

The connection  also needs to be provided to the function app using the `APPINSIGHTS_INSTRUMENTATIONKEY` application setting. This property is specified in the `appSettings` collection in the `siteConfig` object:

You need to set the connection string for this Application Insights instance as the `APPLICATIONINSIGHTS_CONNECTION_STRING` app setting. The templates in this article obtain the connection string value for the created instance. Older template versions might instead use `APPINSIGHTS_INSTRUMENTATIONKEY` to set the instrumentation key, which is no longer recommended. For more information, see [Application settings](#application-configuration).

:::zone pivot="premium-plan,dedicated-plan,consumption-plan"  
## Create the hosting plan

Apps hosted in an Azure Functions [Premium plan](./functions-premium-plan.md) or [Dedicated (App Service) plan](./dedicated-plan.md) must have the hosting plan explicitly defined. 

Explicitly defining a hosting plan isn't required for apps running in a [Consumption plan](./consumption-plan.md). 
::: zone-end
:::zone pivot="premium-plan" 
The Premium plan offers the same scaling as the Consumption plan but includes dedicated resources and extra capabilities. To learn more, see [Azure Functions Premium Plan](functions-premium-plan.md).

A Premium plan is a special type of `serverfarm` resource. You can specify it by using either `EP1`, `EP2`, or `EP3` for the `Name` property value in the `sku` property. The way that you define the Functions hosting plan depends on whether your function app runs on Windows or on Linux: 

### [Linux](#tab/linux/bicep)

To run your app on Linux, you must also set property `"reserved": true` for the `serverfarms` resource:

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

### [Linux](#tab/linux/json)

To run your app on Linux, you must also set property `"reserved": true` for the `serverfarms` resource:

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

### [Windows](#tab/windows/bicep)

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

### [Windows](#tab/windows/json)

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
::: zone-end
:::zone pivot="dedicated-plan" 
In the Dedicated (App Service) plan, your function app runs on dedicated VMs on Basic, Standard, and Premium SKUs in App Service plans, similar to web apps. For more information, see [Dedicated plan](./dedicated-plan.md).

For a sample Bicep file/Azure Resource Manager template, see [Function app on Azure App Service plan]

In Functions, the Dedicated plan is just a regular App Service plan, which is defined by a `serverfarm` resource. The way that you define the hosting plan depends on whether your function app runs on Windows or on Linux: 

### [Linux](#tab/linux/bicep)

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

### [Linux](#tab/linux/json)

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

### [Windows](#tab/windows/bicep)

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

### [Windows](#tab/windows/json)

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

::: zone-end
:::zone pivot="consumption-plan"
<a name="consumption"></a>
The Consumption plan automatically allocates compute power when your code is running, scales-out as necessary to handle load, and then scales-in when code isn't running. You don't have to pay for idle VMs, and you don't have to reserve capacity in advance. To learn more, see [Consumption plan](consumption-plan.md).

The Consumption plan is a special type of `serverfarm` resource. You can specify it by using the `Dynamic` value for the `computeMode` and `sku` properties. The way that you can explicitly define a hosting plan depends on whether your function app runs on Windows or on Linux.

>[!NOTE]  
>If you skip this section of the template, a plan is automatically either created or selected on a per-region basis when you create the function app resource itself.

### [Linux](#tab/linux/bicep)

To run your app on Linux, you must also set the property `"reserved": true` for the `serverfarms` resource:

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

### [Linux](#tab/linux/json)

To run your app on Linux, you must also set the property `"reserved": true` for the `serverfarms` resource:

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

### [Windows](#tab/windows/bicep)

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

### [Windows](#tab/windows/json)

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
 
::: zone-end
:::zone pivot="azure-arc" 
## Kubernetes environment
Azure Functions can be deployed to [Azure Arc-enabled Kubernetes](../app-service/overview-arc-integration.md). This process largely follows [deploying to an App Service plan](#deploy-on-app-service-plan), with a few differences to note.

To create the app and plan resources, you must have already [created an App Service Kubernetes environment](../app-service/manage-create-arc-environment.md) for an Azure Arc-enabled Kubernetes cluster. These examples assume you have the resource ID of the custom location and App Service Kubernetes environment that you're deploying to. For most Bicep files/ARM templates, you can supply these values as parameters.

### [Bicep](#tab/bicep)

```bicep
param kubeEnvironmentId string
param customLocationId string
```

### [JSON](#tab/json)

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

### [Bicep](#tab/bicep)

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

### [JSON](#tab/json)

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

### [Bicep](#tab/bicep)

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

### [JSON](#tab/json)

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

::: zone-end

## Function app

The function app resource is defined by a resource of type `Microsoft.Web/sites` and `kind` that includes `functionapp`.

The way that you define a function app resource depends on whether you're hosting on Linux or on Windows:

### [Linux](#tab/linux)

When running on Linux, you must set `"kind": "functionapp,linux"` and `"reserved": true` for the function app. Linux apps must also include a `linuxFxVersion` property under `siteConfig`. If you're just deploying code, the value for this property is determined by your desired runtime stack in the format of `<runtime>|<runtimeVersion>`. For more information, see the [linuxFxVersion site setting](functions-app-settings.md#linuxfxversion) reference.
 
For a list of application settings required when running on Linux in a Consumption plan,  see [Application configuration](#applicaton-configuration).
:::zone pivot="consumption-plan"
For a sample Bicep file or ARM template, see [Azure Function App Hosted on Linux Consumption Plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-linux-consumption).
::: zone-end
:::zone pivot="premium-plan"
For a sample Bicep file or ARM template, see [Azure Function App Hosted on Linux Consumption Plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-linux-consumption).
::: zone-end
:::zone pivot="dedicated-plan"
For a sample Bicep file or ARM template, see [Azure Function App Hosted on Linux Consumption Plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-linux-consumption).
::: zone-end

### [Windows](#tab/windows)

For a list of application settings required when running on Windows, see [Application configuration](#applicaton-configuration).
:::zone pivot="consumption-plan"
For a sample Bicep file/Azure Resource Manager template, see this [function app hosted on Windows in a Consumption plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-windows-consumption).
:::zone-end  
:::zone pivot="premium-plan"
For a sample Bicep file/Azure Resource Manager template, see this [function app hosted on Windows in a Premium plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-premium-plan).
:::zone-end  
:::zone pivot="dedicated-plan"
For a sample Bicep file/Azure Resource Manager template, see this [function app hosted on Windows in a Dedicated plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-dedicated-plan).
:::zone-end  

---

:::zone pivot="consumption-plan"
>[!NOTE]  
>If you choose to optionally define your Consumption plan, you must set the `serverFarmId` property on the app so that it points to the resource ID of the plan. Make sure that the function app has a `dependsOn` setting that also references the plan. If you didn't explicitly define a plan, one gets created for you. 
::: zone-end
:::zone pivot="premium-plan,dedicated-plan"
Set the `serverFarmId` property on the app so that it points to the resource ID of the plan. Make sure that the function app has a `dependsOn` setting that also references the plan. 
::: zone-end  
:::zone pivot="consumption-plan,premium-plan"  
### [Linux](#tab/linux/bicep)

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
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsights.properties.ConnectionString
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

### [Linux](#tab/linux/json)

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
            "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02).ConnectionString]"
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

### [Windows](#tab/windows/bicep)

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
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsights.properties.ConnectionString
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

### [Windows](#tab/windows/json)

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
            "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').ConnectionString]"
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
:::zone-end   
:::zone pivot="premium-plan"  
# [Linux](#tab/linux/bicep)

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
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsightsName.properties.ConnectionString
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

# [Linux](#tab/linux/json)

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
            "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').ConnectionString]"
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

### [Windows](#tab/windows/bicep)

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
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsightsName.properties.ConnectionString
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

### [Windows](#tab/windows/json)

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
            "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').ConnectionString]"
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

:::zone-end
:::zone pivot="dedicated-plan"
### [Linux](#tab/linux/bicep)

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
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsightsName.properties.ConnectionString
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

### [Linux](#tab/linux/json)

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
            "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').ConnectionString]"
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

### [Windows](#tab/windows/bicep)

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
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsightsName.properties.ConnectionString
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

### [Windows](#tab/windows/json)

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
            "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').ConnectionString]"
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

:::zone-end  
:::zone pivot="dedicated-plan,premium-plan,consumption-plan"  
## Deployment source

Your Bicep file or ARM template can also define a deployment option for your function code. These deployments could include a [zip deployment file](./deployment-zip-push.md), a [Linux container](./functions-how-to-custom-container.md), or a [continuous deployment source](./functions-continuous-deployment.md). 

To successfully deploy your application by using Azure Resource Manager, it's important to understand how resources are deployed in Azure. In most examples, top-level configurations are applied by using `siteConfig`. It's important to set these configurations at a top level, because they convey information to the Functions runtime and deployment engine. Top-level information is required before the child `sourcecontrols/web` resource is applied. Although it's possible to configure these settings in the child-level `config/appSettings` resource, in some cases your function app must be deployed *before* `config/appSettings` is applied. 

### Zip deployment 

Zip deployment is a recommended way to deploy your function app code. By default, functions that use zip deployment run in the deployment package itself. For more information, see [Zip deployment for Azure Functions](deployment-zip-push.md). When using resource deployment automation, you can reference the .zip deployment package in your Bicep or ARM template. 
:::zone-end 
:::zone pivot="consumption-plan"  
>[!IMPORTANT]  
>Consumption plans on Linux don't support `WEBSITE_RUN_FROM_PACKAGE = 1`. You must instead set the URI of the deployment package directly in the `WEBSITE_RUN_FROM_PACKAGE` setting. For more information, see [WEBSITE\_RUN\_FROM\_PACKAGE](functions-app-settings.md#website_run_from_package).  
:::zone-end  
:::zone pivot="dedicated-plan,premium-plan,consumption-plan" 
To use zip deployment in your template, set the `WEBSITE_RUN_FROM_PACKAGE` setting in the app to `1` and include the `/zipDeploy` resource definition. 

This example adds a zip deployment source to an existing app:  

#### [Bicep](#tab/bicep)

```bicep
@description('The name of the function app.')
param functionAppName string

@description('The location into which the resources should be deployed.')
param location string = resourceGroup().location

@description('The zip content url.')
param packageUri string

resource functionAppName_ZipDeploy 'Microsoft.Web/sites/extensions@2021-02-01' = {
  name: '${functionAppName}/ZipDeploy'
  location: location
  properties: {
    packageUri: packageUri
  }
}
```
#### [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "functionAppName": {
      "type": "string",
      "metadata": {
        "description": "The name of the Azure Function app."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "The location into which the resources should be deployed."
      }
    },
    "packageUri": {
      "type": "string",
      "metadata": {
        "description": "The zip content url."
      }
    }
  },
  "resources": [
    {
      "name": "[concat(parameters('functionAppName'), '/ZipDeploy')]",
      "type": "Microsoft.Web/sites/extensions",
      "apiVersion": "2021-02-01",
      "location": "[parameters('location')]",
      "properties": {
        "packageUri": "[parameters('packageUri')]"
      }
    }
  ]
}
```
---

The `packageUri` must be a location that can be accessed by Functions. Consider using Azure blob storage with a shared access signature (SAS).

>[!IMPORTANT]  
>Make sure to always set all required application settings in the `appSettings` collection when adding or updating settings. Existing settings not explicitly set are removed.

### Source control deployment 

Defining a child `sourcecontrols` resource instructs Functions to try and get code from the specified `repoUrl` and `branch`. For more information, see [Continuous deployment for Azure Functions](./functions-continuous-deployment.md).

This example uses the [`PROJECT](./functions-app-settings.md#project) application setting to set the base directory in the connected repository to look for deployable code. In this case, the code is maintained in a subfolder of the `src` folder in the repository. Therefore, you must set the application setting value to `src`. If your functions are in the root of your repository. 

### [Bicep](#tab/bicep)

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

### [JSON](#tab/json)

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

:::zone-end  
:::zone pivot="dedicated-plan,premium-plan"
### Container deployment

If you're deploying a [containerized function app](./functions-how-to-custom-container.md) to an Azure Functions Premium or Dedicated plan, you must set the [`linuxFxVersion`](functions-app-settings.md#linuxfxversion) site setting with the identifier of your container image. You also need to set [additional application settings](#application-configuration) (`DOCKER_REGISTRY_SERVER_*`)when obtaining the container from a private registry. 

#### [Bicep](#tab/bicep)

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

#### [JSON](#tab/json)

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

::: zone-end
:::zone pivot="container-apps"
When deploying [containerized functions to Azure Container Apps](./functions-container-apps-hosting.md), you must set the `kind` field to a value of `functionapp,linux,container,azurecontainerapps`. You must also set the `managedEnvironmentId` site property to the fully-qualified URI of the Container Apps environment. If you are creating a `Microsoft.App/managedEnvironments` resource at the same time as the site, make sure to include this resources in the `dependsOn` collection in the site definition. 

The definition of a containerized function app deployed from a private container registry to an existing Container Apps environment might look like this example:

#### [Bicep](#tab/bicep)

```bicep
resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: functionAppName
  kind: 'functionapp,linux,container,azurecontainerapps'
  location: location
  extendedLocation: {
    name: customLocationId
  }
  properties: {
    serverFarmId: hostingPlanName
    siteConfig: {
      linuxFxVersion: 'DOCKER|myacr.azurecr.io/myimage:mytag'
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
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsightsName.properties.ConnectionString
        }
      ]
    }
    managedEnvironmentId: managedEnvironmentId
  }
  dependsOn: [
    storageAccount
    hostingPlan
  ]
}
```

#### [JSON](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Web/sites",
    "apiVersion": "2022-03-01",
    "name": "[parameters('functionAppName')]",
    "kind": "functionapp,linux,container,azurecontainerapps",
    "location": "[parameters('location')]",
    "dependsOn": [
      "[resourceId('Microsoft.Insights/components', parameters('applicationInsightsName'))]",
      "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]",
      "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
    ],
    "properties": {
      "serverFarmId": "[parameters('hostingPlanName')]",
      "siteConfig": {
        "linuxFxVersion": "DOCKER|myacr.azurecr.io/myimage:mytag",
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
            "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').ConnectionString]"
          }
        ],
      },
      "managedEnvironmentId": "[parameters('managedEnvironmentId')]"
    }
  }
]
```

---

::: zone-end
:::zone pivot="azure-arc"
When deploying functions to Azure Arc, the value you set for the `kind` field of the function app resource depends on the type of deployment:

| Deployment type | `kind` field value |
|----|----|
| Code-only deployment | `functionapp,linux,kubernetes` |
| Container deployment | `functionapp,linux,kubernetes,container` |  

You must also set the `customLocationId` as you did for the [hosting plan resource](#hosting-plan).

The definition of a containerized function app, using a .NET 6 quickstart image, might look like this example:

#### [Bicep](#tab/bicep)

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
      linuxFxVersion: 'DOCKER|mcr.microsoft.com/azure-functions/4-dotnet-isolated6.0-appservice-quickstart'
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
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsightsName.properties.ConnectionString
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

#### [JSON](#tab/json)

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
        "linuxFxVersion": "DOCKER|mcr.microsoft.com/azure-functions/4-dotnet-isolated6.0-appservice-quickstart",
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
            "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').ConnectionString]"
          }
        ],
        "alwaysOn": true
      }
    }
  }
]
```

---

::: zone-end
## Application configuration

Functions provides the following options for configuring your function app in Azure: 

| Configuration | `Microsoft.Web/sites` property |  
| ---- | ---- |
| Site settings | `siteConfig` |
| Application settings | `siteConfig.appSettings` collection |

The following site settings might be required on the `siteConfig` property:

### [Linux](#tab/linux)

:::zone pivot="dedicated-plan"  
+ [`alwaysOn`](functions-app-settings.md#alwayson)
::: zone-end  
+ [`linuxFxVersion`](functions-app-settings.md#linuxfxversion)
 
+ [`netFrameworkVersion`](functions-app-settings.md#netframeworkversion)<sup>*</sup>

### [Windows](#tab/windows)

:::zone pivot="dedicated-plan"  
+ [`alwaysOn`](functions-app-settings.md#alwayson)
::: zone-end
+ [`netFrameworkVersion`](functions-app-settings.md#netframeworkversion)<sup>*</sup>

---

<sup>*</sup>Only required for .NET (C#) apps.

The following application settings are required for a specific operating system and hosting option:

### [Linux](#tab/linux)

+ [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string)

+ [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage)

+ [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version)
:::zone pivot="consumption-plan,premium-plan,dedicated-plan" 
+ [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functions_worker_runtime)
::: zone-end
:::zone pivot="consumption-plan,premium-plan"  
+ [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](functions-app-settings.md#website_contentazurefileconnectionstring)

+ [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare)<sup>1</sup>
::: zone-end  
:::zone pivot="dedicated-plan,premium-plan"  
+ [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package)
::: zone-end  
:::zone pivot="dedicated-plan,premium-plan,azure-arc,container-apps"  
These settings are only required when deploying from a private container registry:

+ [`DOCKER_REGISTRY_SERVER_URL`](../app-service/reference-app-settings.md#custom-containers) 

+ [`DOCKER_REGISTRY_SERVER_USERNAME`](../app-service/reference-app-settings.md#custom-containers) 

+ [`DOCKER_REGISTRY_SERVER_PASSWORD`](../app-service/reference-app-settings.md#custom-containers) 

For container deployments, also set [`WEBSITES_ENABLE_APP_SERVICE_STORAGE`](../app-service/reference-app-settings.md#custom-containers) to `false`, since your app content is provided in the container itself. 
::: zone-end 
:::zone pivot="consumption-plan,premium-plan"  
<sup>1</sup>There are important considerations for using `WEBSITE_CONTENTSHARE` in an automated deployment. For more information, see the [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare) reference.    
::: zone-end  

### [Windows](#tab/windows)

+ [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string)

+ [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage)

+ [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version)

+ [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functions_worker_runtime)
:::zone pivot="consumption-plan,premium-plan"  
+ [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](functions-app-settings.md#website_contentazurefileconnectionstring)

+ [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare)<sup>2</sup>
::: zone-end
:::zone pivot="consumption-plan,premium-plan,dedicated-plan"   
+ [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package)

+ [`WEBSITE_NODE_DEFAULT_VERSION`](functions-app-settings.md#website_node_default_version)<sup>1</sup>
::: zone-end    
<sup>1</sup>Supported only for Node.js deployments. 
:::zone pivot="consumption-plan,premium-plan"  
<sup>2</sup>There are important considerations for using `WEBSITE_CONTENTSHARE` in an automated deployment. For more information, see the [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare) reference.    
::: zone-end  

---

>[!IMPORTANT]  
>When adding or updating application settings using Bicep or ARM templates, make sure that you include all existing settings. You must do this because the underlying REST APIs calls replace the existing application settings when the update APIs are called. You can instead use the Azure CLI, Azure PowerShell, or the Azure portal to more easily modify application settings. For more information, see [Work with application settings](functions-how-to-use-azure-function-app-settings.md#work-with-application-settings). 

## Validate your template

When you manually create your deployment template file, it's important to validate your template before deployment. All deployment methods validate your template syntax and raise a `validation failed` error message as shown in the following JSON formatted example:

```json
{"error":{"code":"InvalidTemplate","message":"Deployment template validation failed: 'The resource 'Microsoft.Web/sites/func-xyz' is not defined in the template. Please see https://aka.ms/arm-template for usage details.'.","additionalInfo":[{"type":"TemplateViolation","info":{"lineNumber":0,"linePosition":0,"path":""}}]}}
```

The following methods can be used to validate your template before deployment:

### [Azure Pipelines](#tab/devops)

The following [Azure resource group deployment v2 task](/azure/devops/pipelines/tasks/deploy/azure-resource-group-deployment?view=azure-devops) with `deploymentMode: 'Validation'` instructs Azure Pipelines to validate the template. 

```yml
- task: AzureResourceManagerTemplateDeployment@3
  inputs:
    deploymentScope: 'Resource Group'
    subscriptionId: # Required subscription ID
    action: 'Create Or Update Resource Group'
    resourceGroupName: # Required resource group name
    location: # Required when action == Create Or Update Resource Group
    templateLocation: 'Linked artifact'
    csmFile: # Required when  TemplateLocation == Linked Artifact
    csmParametersFile: # Optional
    deploymentMode: 'Validation'
```

### [Azure CLI](#tab/azure-cli)

You can use the [`az deployment group validate`](/cli/azure/deployment/group#az-deployment-group-validate) command to validate your template, as shown in the following example:

```azurecli-interactive
az deployment group validate --resource-group <resource-group-name> --template-file <template-file-location> --parameters functionAppName='<function-app-name>' packageUri='<zip-package-location>'
```

### [Visual Studio Code](#tab/vs-code)

On [Visual Studio Code](https://code.visualstudio.com/), install the latest [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools).

This extension reports syntactic errors in your templates before you try to deploy them. For some examples of errors, see the [Fix validation error](../azure-resource-manager/troubleshooting/quickstart-troubleshoot-arm-deployment.md#fix-validation-error) section of the troubleshooting article.

---

You can also create a test resource group to find [preflight](../azure-resource-manager/troubleshooting/quickstart-troubleshoot-arm-deployment.md?tabs=azure-cli#fix-preflight-error) and [deployment](../azure-resource-manager/troubleshooting/quickstart-troubleshoot-arm-deployment.md?tabs=azure-cli#fix-deployment-error) errors.

## Deploy your template

You can use any of the following ways to deploy your Bicep file and template:

### [Bicep](#tab/bicep)

- [Azure CLI](../azure-resource-manager/bicep/deploy-cli.md)
- [PowerShell](../azure-resource-manager/bicep/deploy-powershell.md)

### [JSON](#tab/json)

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

#### [Bicep](#tab/bicep)

```powershell
# Register Resource Providers if they're not already registered
Register-AzResourceProvider -ProviderNamespace "microsoft.web"
Register-AzResourceProvider -ProviderNamespace "microsoft.storage"

# Create a resource group for the function app
New-AzResourceGroup -Name "MyResourceGroup" -Location 'West Europe'

# Deploy the template
New-AzResourceGroupDeployment -ResourceGroupName "MyResourceGroup" -TemplateFile main.bicep  -Verbose
```

#### [JSON](#tab/json)

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
- [Create your first Azure function](functions-get-started.md)

<!-- LINKS -->

[Function app on Consumption plan]: https://azure.microsoft.com/resources/templates/function-app-create-dynamic/
[Function app on Azure App Service plan]: https://azure.microsoft.com/resources/templates/function-app-create-dedicated/
