---
title: Automate function app resource deployment to Azure
description: Learn how to build, validate, and use a Bicep file or an Azure Resource Manager template to deploy your function app and related Azure resources.
ms.assetid: d20743e3-aab6-442c-a836-9bcea09bfd32
ms.topic: conceptual
ms.date: 10/26/2023
ms.custom: fasttrack-edit, devx-track-bicep, devx-track-arm-template
zone_pivot_groups: functions-hosting-plan
---

# Automate resource deployment for your function app in Azure Functions

You can use a Bicep file or an Azure Resource Manager template to automate the process of deploying a function app to new or existing Azure resources. Such automation provides a great way to be able to integrate your resource deployments with your source code in DevOps, restore a function app and related resources from a backup, or deploy an app topology multiple times. 

This article shows you how to automate the creation of resources and deployment for Azure Functions. Depending on the [triggers and bindings](functions-triggers-bindings.md) used by your functions, you might need to deploy other resources, which is outside of the scope of this article. 

The specific template code depends on how your function app is hosted, whether you're deploying code or a containerized function app, and the operating system used by your app. This article supports the following hosting options:

| Hosting option | Deployment type | To learn more, see... |
| ----- | ----- | ----- |
| [Azure Functions Consumption plan](functions-infrastructure-as-code.md?pivots=consumption-plan) | Code-only | [Consumption plan](./consumption-plan.md) |
| [Azure Functions Elastic Premium plan](functions-infrastructure-as-code.md?pivots=premium-plan) | Code \| Container | [Premium plan](./functions-premium-plan.md)|
| [Azure Functions Dedicated (App Service) plan](functions-infrastructure-as-code.md?pivots=dedicated-plan) | Code \| Container | [Dedicated plan](./dedicated-plan.md)|
| [Azure Container Apps](functions-infrastructure-as-code.md?pivots=premium-plan) | Container-only | [Container Apps hosting of Azure Functions](functions-container-apps-hosting.md)|
| [Azure Arc](functions-infrastructure-as-code.md?pivots=premium-plan) | Code \| Container | [App Service, Functions, and Logic Apps on Azure Arc (Preview)](../app-service/overview-arc-integration.md)| 

## Required resources  
:::zone pivot="premium-plan,dedicated-plan" 
An Azure Functions-hosted deployment typically consists of these resources:

| Resource  | Requirement | Syntax and properties reference |
|------|-------|----|
| A [storage account](#create-storage-account) | Required | [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| An [Application Insights](#create-application-insights) component | Recommended | [Microsoft.Insights/components](/azure/templates/microsoft.insights/components)|  
| A [hosting plan](#create-the-hosting-plan)| Required<sup>1</sup> | [Microsoft.Web/serverfarms](/azure/templates/microsoft.web/serverfarms) |
| A [function app](#create-the-function-app) | Required | [Microsoft.Web/sites](/azure/templates/microsoft.web/sites)  |
:::zone-end    
:::zone pivot="consumption-plan"  
An Azure Functions deployment for a Consumption plan typically consists of these resources:
 
| Resource  | Requirement | Syntax and properties reference |
|------|-------|----|
| A [storage account](#create-storage-account) | Required | [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| An [Application Insights](#create-application-insights) component | Recommended | [Microsoft.Insights/components](/azure/templates/microsoft.insights/components)|  
| A [function app](#create-the-function-app) | Required | [Microsoft.Web/sites](/azure/templates/microsoft.web/sites)  |
:::zone-end  
:::zone pivot="container-apps"  
An Azure Container Apps-hosted deployment typically consists of these resources:

| Resource  | Requirement | Syntax and properties reference |
|------|-------|----|
| A [storage account](#create-storage-account) | Required | [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| An [Application Insights](#create-application-insights) component | Recommended | [Microsoft.Insights/components](/azure/templates/microsoft.insights/components)|  
| A [managed environment](./functions-container-apps-hosting.md#) | Required | [Microsoft.App/managedEnvironments](/azure/templates/microsoft.app/managedenvironments) |
| A [function app](#create-the-function-app) | Required | [Microsoft.Web/sites](/azure/templates/microsoft.web/sites)  |
:::zone-end  
:::zone pivot="azure-arc"  
An Azure Arc-hosted deployment typically consists of these resources:

| Resource  | Requirement | Syntax and properties reference |
|------|-------|----|
| A [storage account](#create-storage-account) | Required | [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| An [Application Insights](#create-application-insights) component | Recommended | [Microsoft.Insights/components](/azure/templates/microsoft.insights/components)|  
| An [App Service Kubernetes environment](../app-service/overview-arc-integration.md#app-service-kubernetes-environment) | Required | [Microsoft.ExtendedLocation/customLocations](/azure/templates/microsoft.extendedlocation/customlocations) |
| A [function app](#create-the-function-app) | Required | [Microsoft.Web/sites](/azure/templates/microsoft.web/sites)  |
:::zone-end  
:::zone pivot="premium-plan,dedicated-plan" 
<sup>1</sup>An explicit hosting plan isn't required when you choose to host your function app in a [Consumption plan](./consumption-plan.md).
:::zone-end  

When you deploy multiple resources in a single Bicep file or ARM template, the order in which resources are created is important. This requirement is a result of dependencies between resources. For such dependencies, make sure to use the `dependsOn` element to define the dependency in the dependent resource. For more information, see either [Define the order for deploying resources in ARM templates](../azure-resource-manager/templates/resource-dependency.md) or [Resource dependencies in Bicep](../azure-resource-manager/bicep/resource-dependencies.md). 

This article assumes that you have a basic understanding about [creating Bicep files](../azure-resource-manager/bicep/file.md) or [authoring Azure Resource Manager templates](../azure-resource-manager/templates/syntax.md), and examples are shown as individual sections for specific resources. For a broad set of complete Bicep file and ARM template examples, see [these function app deployment examples](/samples/browse/?expanded=azure&terms=%22azure%20functions%22&products=azure-resource-manager). 
:::zone pivot="container-apps,azure-arc"  
## Prerequisites  
:::zone-end  
:::zone pivot="container-apps" 
This article assumes that you have already created a [managed environment](../container-apps/environment.md) in Azure Container Apps. You need both the name and the ID of the managed environment to create a function app hosted on Container Apps.  
:::zone-end  
:::zone pivot="azure-arc" 
This article assumes that you have already created an [App Service-enabled custom location](../app-service/overview-arc-integration.md) on an [Azure Arc-enabled Kubernetes cluster](../azure-arc/kubernetes/overview.md). You need both the custom location ID and the Kubernetes environment ID to create a function app hosted in an Azure Arc custom location.  
:::zone-end  
<a name="storage"></a>
## Create storage account

All function apps require an Azure storage account. You need a general purpose account that supports blobs, tables, queues, and files. For more information, see [Azure Functions storage account requirements](storage-considerations.md#storage-account-requirements).

[!INCLUDE [functions-storage-access-note](../../includes/functions-storage-access-note.md)]

This example section creates a Standard general-purpose v2 storage account: 

### [ARM template](#tab/json)

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

For more context, see the complete [azuredeploy.json](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/azuredeploy.json#L77) file in the templates repository.

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

For more context, see the complete [main.bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/main.bicep#L37) file in the templates repository.

---

You need to set the connection string of this storage account as the `AzureWebJobsStorage` app setting, which Functions requires. The templates in this article construct this connection string value based on the created storage account, which is a best practice. For more information, see [Application configuration](#application-configuration).  

### Enable storage logs

Because the storage account is used for important function app data, you should monitor the account for modification of that content. To monitor your storage account, you need to configure Azure Monitor resource logs for Azure Storage. In this example section, a Log Analytics workspace named `myLogAnalytics` is used as the destination for these logs. 

#### [ARM template](#tab/json)

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

---

This same workspace can be used for the Application Insights resource defined later. For more information, including how to work with these logs, see [Monitoring Azure Storage](../storage/blobs/monitor-blob-storage.md).

## Create Application Insights

Application Insights is recommended for monitoring your function app executions. In this example section, the Application Insights resource is defined with the type `Microsoft.Insights/components` and the kind `web`:

### [ARM template](#tab/json)

:::code language="json" source="~/function-app-arm-templates/function-app-linux-consumption/azuredeploy.json" range="102-114":::

For more context, see the complete [azuredeploy.json](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/azuredeploy.json#L102) file in the templates repository.

### [Bicep](#tab/bicep)

:::code language="bicep" source="~/function-app-arm-templates/function-app-linux-consumption/main.bicep" range="60-70":::

For more context, see the complete [main.bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/main.bicep#L60) file in the templates repository.

---

The connection must be provided to the function app using the [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string) application setting. For more information, see [Application settings](#application-configuration).

The examples in this article obtain the connection string value for the created instance. Older versions might instead use [`APPINSIGHTS_INSTRUMENTATIONKEY`](functions-app-settings.md#appinsights_instrumentationkey) to set the instrumentation key, which is no longer recommended. 

:::zone pivot="premium-plan,dedicated-plan"  
## Create the hosting plan

Apps hosted in an Azure Functions [Premium plan](./functions-premium-plan.md) or [Dedicated (App Service) plan](./dedicated-plan.md) must have the hosting plan explicitly defined. 
::: zone-end
:::zone pivot="premium-plan" 
The Premium plan offers the same scaling as the Consumption plan but includes dedicated resources and extra capabilities. To learn more, see [Azure Functions Premium Plan](functions-premium-plan.md).

A Premium plan is a special type of `serverfarm` resource. You can specify it by using either `EP1`, `EP2`, or `EP3` for the `Name` property value in the `sku` property. The way that you define the Functions hosting plan depends on whether your function app runs on Windows or on Linux. This example section creates an `EP1` plan: 

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

For more context, see the complete [main.bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-premium-plan/main.bicep#L62) file in the templates repository.

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

For more context, see the complete [azuredeploy.json](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-premium-plan/azuredeploy.json#L113) file in the templates repository.

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

For more context, see the complete [main.bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-premium-plan/main.bicep#L62) file in the templates repository.

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

For more context, see the complete [azuredeploy.json](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-premium-plan/azuredeploy.json#L113) file in the templates repository.

---  

For more information about the `sku` object, see [`SkuDefinition`](/azure/templates/microsoft.web/serverfarms#skudescription) or review the example templates. 
::: zone-end
:::zone pivot="dedicated-plan" 
In the Dedicated (App Service) plan, your function app runs on dedicated VMs on Basic, Standard, and Premium SKUs in App Service plans, similar to web apps. For more information, see [Dedicated plan](./dedicated-plan.md).

For a sample Bicep file/Azure Resource Manager template, see [Function app on Azure App Service plan]

In Functions, the Dedicated plan is just a regular App Service plan, which is defined by a `serverfarm` resource. You must provide at least the `name` value. For a list of supported plan names, see the `--sku` setting in [`az appservice plan create`](/cli/azure/appservice/plan#az-appservice-plan-create) for the current list of supported values for a Dedicated plan. 

The way that you define the hosting plan depends on whether your function app runs on Windows or on Linux: 

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

For more context, see the complete [main.bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-dedicated-plan/main.bicep#L62) file in the templates repository.

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

For more context, see the complete [azuredeploy.json](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-dedicated-plan/azuredeploy.json#L112) file in the templates repository.

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

For more context, see the complete [main.bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-dedicated-plan/main.bicep#L62) file in the templates repository.

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

For more context, see the complete [azuredeploy.json](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-dedicated-plan/azuredeploy.json#L112) file in the templates repository.

---

::: zone-end
:::zone pivot="consumption-plan"
## Create the hosting plan

You don't need to explicitly define a Consumption hosting plan resource. When you skip this resource definition, a plan is automatically either created or selected on a per-region basis when you create the function app resource itself.

You can explicitly define a Consumption plan as a special type of `serverfarm` resource, which you specify using the value `Dynamic` for the `computeMode` and `sku` properties. This example section shows you how to explicitly define a consumption plan. The way that you define a hosting plan depends on whether your function app runs on Windows or on Linux. 

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

For more context, see the complete [main.bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-windows-consumption/main.bicep#L40) file in the templates repository.

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

For more context, see the complete [azuredeploy.json](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-windows-consumption/azuredeploy.json#L67) file in the templates repository.


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

For more context, see the complete [main.bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/main.bicep#L46) file in the templates repository.

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


For more context, see the complete [azuredeploy.json](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/azuredeploy.json#L115) file in the templates repository.

---
 
::: zone-end
:::zone pivot="azure-arc" 
## Kubernetes environment
Azure Functions can be deployed to [Azure Arc-enabled Kubernetes](../app-service/overview-arc-integration.md) either as a code project or a containerized function app. 

To create the app and plan resources, you must have already [created an App Service Kubernetes environment](../app-service/manage-create-arc-environment.md) for an Azure Arc-enabled Kubernetes cluster. The examples in this article assume you have the resource ID of the custom location (`customLocationId`) and App Service Kubernetes environment (`kubeEnvironmentId`) to which you're deploying, which are set in this example: 

### [ARM template](#tab/json)

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

### [Bicep](#tab/bicep)

```bicep
param kubeEnvironmentId string
param customLocationId string
```

---

Both sites and plans must reference the custom location through an `extendedLocation` field. As shown in this truncated example, `extendedLocation` sits outside of `properties`, as a peer to `kind` and `location`:

### [ARM template](#tab/json)

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

---

The plan resource should use the Kubernetes (`K1`) value for `SKU`, the `kind` field should be `linux,kubernetes`, and the `reserved` property should be `true`, since it's a Linux deployment. You must also set the `extendedLocation` and `kubeEnvironmentProfile.id` to the custom location ID and the Kubernetes environment ID, respectively, which might look like this example section:

### [ARM template](#tab/json)

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

---

::: zone-end

## Create the function app

The function app resource is defined by a resource of type `Microsoft.Web/sites` and `kind` that includes `functionapp`, at a minimum.
:::zone pivot="consumption-plan,premium-plan,dedicated-plan"
The way that you define a function app resource depends on whether you're hosting on Linux or on Windows:
::: zone-end
::: zone pivot="consumption-plan,premium-plan"
### [Windows](#tab/windows)

For a list of application settings required when running on Windows, see [Application configuration](#application-configuration). For a sample Bicep file/Azure Resource Manager template, see the [function app hosted on Windows in a Consumption plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-windows-consumption) template. 

### [Linux](#tab/linux)

[!INCLUDE [functions-arm-linux-intro](../../includes/functions-arm-linux-intro.md)]
 
For a sample Bicep file or ARM template, see the [function app hosted on Linux Consumption Plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-linux-consumption) template.

---
::: zone-end  
:::zone pivot="dedicated-plan"
### [Windows](#tab/windows)

For a list of application settings required when running on Windows, see [Application configuration](#application-configuration).  

### [Linux](#tab/linux)

[!INCLUDE [functions-arm-linux-intro](../../includes/functions-arm-linux-intro.md)]

---
::: zone-end  
:::zone pivot="consumption-plan"  
>[!NOTE]  
>If you choose to optionally define your Consumption plan, you must set the `serverFarmId` property on the app so that it points to the resource ID of the plan. Make sure that the function app has a `dependsOn` setting that also references the plan. If you didn't explicitly define a plan, one gets created for you. 
::: zone-end
:::zone pivot="premium-plan,dedicated-plan"
Set the `serverFarmId` property on the app so that it points to the resource ID of the plan. Make sure that the function app has a `dependsOn` setting that also references the plan. 
::: zone-end  
:::zone pivot="premium-plan,consumption-plan"  
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

For a complete end-to-end example, see this [main.bicep file](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-windows-consumption/main.bicep).

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

For a complete end-to-end example, see this [azuredeploy.json template](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-windows-consumption/azuredeploy.json).

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

For a complete end-to-end example, see this [main.bicep file](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/main.bicep).

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

For a complete end-to-end example, see this [azuredeploy.json template](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/azuredeploy.json).

---

:::zone-end
:::zone pivot="dedicated-plan"
### [Windows](#tab/windows/bicep)

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

For a complete end-to-end example, see this [main.bicep file](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-dedicated-plan/main.bicep).

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

For a complete end-to-end example, see this [azuredeploy.json template](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-dedicated-plan/azuredeploy.json).

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

For a complete end-to-end example, see this [main.bicep file](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-dedicated-plan/main.bicep).

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

For a complete end-to-end example, see this [azuredeploy.json template](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-dedicated-plan/azuredeploy.json).

---

:::zone-end  
:::zone pivot="dedicated-plan,premium-plan"  
## Deployment sources

Your Bicep file or ARM template can optionally also define a deployment for your function code, which could include these methods:

+ [Zip deployment package](./deployment-zip-push.md)
+ [Linux container](./functions-how-to-custom-container.md) 
:::zone-end  
:::zone pivot="consumption-plan"  
## Deployment sources

Your Bicep file or ARM template can optionally also define a deployment for your function code using a [zip deployment package](./deployment-zip-push.md).  
:::zone-end  
:::zone pivot="dedicated-plan,premium-plan,consumption-plan" 
To successfully deploy your application by using Azure Resource Manager, it's important to understand how resources are deployed in Azure. In most examples, top-level configurations are applied by using `siteConfig`. It's important to set these configurations at a top level, because they convey information to the Functions runtime and deployment engine. Top-level information is required before the child `sourcecontrols/web` resource is applied. Although it's possible to configure these settings in the child-level `config/appSettings` resource, in some cases your function app must be deployed *before* `config/appSettings` is applied. 

## Zip deployment package

Zip deployment is a recommended way to deploy your function app code. By default, functions that use zip deployment run in the deployment package itself. For more information, including the requirements for a deployment package, see [Zip deployment for Azure Functions](deployment-zip-push.md). When using resource deployment automation, you can reference the .zip deployment package in your Bicep or ARM template. 

To use zip deployment in your template, set the `WEBSITE_RUN_FROM_PACKAGE` setting in the app to `1` and include the `/zipDeploy` resource definition. 
:::zone-end  
:::zone pivot="consumption-plan"  
For a Consumption plan on Linux, instead set the URI of the deployment package directly in the `WEBSITE_RUN_FROM_PACKAGE` setting, as shown in [this example template](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-linux-consumption#L152). 
:::zone-end  
:::zone pivot="dedicated-plan,premium-plan,consumption-plan"  
This example adds a zip deployment source to an existing app:  

### [ARM template](#tab/json)

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
### [Bicep](#tab/bicep)

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
---

Keep the following things in mind when including zip deployment resources in your template:
::: zone-end
:::zone pivot="consumption-plan"  
+ Consumption plans on Linux don't support `WEBSITE_RUN_FROM_PACKAGE = 1`. You must instead set the URI of the deployment package directly in the `WEBSITE_RUN_FROM_PACKAGE` setting. For more information, see [WEBSITE\_RUN\_FROM\_PACKAGE](functions-app-settings.md#website_run_from_package). For an example template, see [Function app hosted on Linux in a Consumption plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-linux-consumption).
:::zone-end  
:::zone pivot="dedicated-plan,premium-plan,consumption-plan"  
+ The `packageUri` must be a location that can be accessed by Functions. Consider using Azure blob storage with a shared access signature (SAS). After the SAS expires, Functions can no longer access the share for deployments. When you regenerate your SAS, remember to update the `WEBSITE_RUN_FROM_PACKAGE` setting with the new URI value. 

+ Make sure to always set all required application settings in the `appSettings` collection when adding or updating settings. Existing settings not explicitly set are removed by the update. For more information, see [Application configuration](#application-configuration). 

+ Functions doesn't support Web Deploy (msdeploy) for package deployments. You must instead use zip deployment in your deployment pipelines and automation. For more information, see [Zip deployment for Azure Functions](deployment-zip-push.md).

## Remote builds

The deployment process assumes that the .zip file that you use or a zip deployment contains a ready-to-run app. This means that by default no customizations are run. 

However, there are scenarios that require you to rebuild your app remotely, such as when you need to pull Linux-specific packages in Python or Node.js apps that you developed on a Windows computer. In this case, you can configure Functions to perform a remote build on your code after the zip deployment. 

The way that you request a remote build depends on the operating system to which you are deploying:

### [Windows](#tab/windows)

When an app is deployed to Windows, language-specific commands (like `dotnet restore` for C# apps or `npm install` for Node.js apps) are run.

To enable the same build processes that you get with continuous integration, add `SCM_DO_BUILD_DURING_DEPLOYMENT=true` to your application settings in your deployment code and remove the `WEBSITE_RUN_FROM_PACKAGE` entirely.

### [Linux](#tab/linux)

To enable the same build processes that you get with continuous integration, add `SCM_DO_BUILD_DURING_DEPLOYMENT=true` to your application settings in your deployment code and remove the `WEBSITE_RUN_FROM_PACKAGE` entirely.

The `ENABLE_ORYX_BUILD` setting is set to `true` by default. If you have issues building a .NET or Java function app, instead set it to `false`. 

Function apps that are built remotely on Linux can run from a package.

---  

:::zone-end  
:::zone pivot="dedicated-plan,premium-plan"
## Linux containers

If you're deploying a [containerized function app](./functions-how-to-custom-container.md) to an Azure Functions Premium or Dedicated plan, you must:

+ Set the [`linuxFxVersion`](functions-app-settings.md#linuxfxversion) site setting with the identifier of your container image. 
+ Set any required [`DOCKER_REGISTRY_SERVER_*`](#application-configuration) settings when obtaining the container from a private registry. 
+ Set [`WEBSITES_ENABLE_APP_SERVICE_STORAGE`](../app-service/reference-app-settings.md#custom-containers) application setting to `false`. 

For more information, see [Application configuration](#application-configuration).

### [ARM template](#tab/json)

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

### [Bicep](#tab/bicep)

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

---

::: zone-end
:::zone pivot="container-apps"
When deploying [containerized functions to Azure Container Apps](./functions-container-apps-hosting.md), your template must:

+ Set the `kind` field to a value of `functionapp,linux,container,azurecontainerapps`. 
+ Set the `managedEnvironmentId` site property to the fully qualified URI of the Container Apps environment. 
+ Add a resource link in the site's `dependsOn` collection when creating a `Microsoft.App/managedEnvironments` resource at the same time as the site. 

The definition of a containerized function app deployed from a private container registry to an existing Container Apps environment might look like this example:

### [ARM template](#tab/json)

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

### [Bicep](#tab/bicep)

```bicep
resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: functionAppName
  kind: 'functionapp,linux,container,azurecontainerapps'
  location: location
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

---

::: zone-end
:::zone pivot="azure-arc"
When deploying functions to Azure Arc, the value you set for the `kind` field of the function app resource depends on the type of deployment:

| Deployment type | `kind` field value |
|----|----|
| Code-only deployment | `functionapp,linux,kubernetes` |
| Container deployment | `functionapp,linux,kubernetes,container` |  

You must also set the `customLocationId` as you did for the [hosting plan resource](#create-the-hosting-plan).

The definition of a containerized function app, using a .NET 6 quickstart image, might look like this example:

### [ARM template](#tab/json)

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

### [Bicep](#tab/bicep)

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

---

::: zone-end
## Application configuration

Functions provides the following options for configuring your function app in Azure: 

| Configuration | `Microsoft.Web/sites` property |  
| ---- | ---- |
| Site settings | `siteConfig` |
| Application settings | `siteConfig.appSettings` collection |

The following site settings are required on the `siteConfig` property:  
:::zone pivot="dedicated-plan"  
### [Windows](#tab/windows)

+ [`alwaysOn`](functions-app-settings.md#alwayson)
+ [`netFrameworkVersion`](functions-app-settings.md#netframeworkversion)

### [Linux](#tab/linux)

+ [`alwaysOn`](functions-app-settings.md#alwayson)
+ [`linuxFxVersion`](functions-app-settings.md#linuxfxversion)
+ [`netFrameworkVersion`](functions-app-settings.md#netframeworkversion)

---  

::: zone-end  
:::zone pivot="consumption-plan,premium-plan"  
### [Windows](#tab/windows)

+ [`netFrameworkVersion`](functions-app-settings.md#netframeworkversion)  

### [Linux](#tab/linux)

+ [`linuxFxVersion`](functions-app-settings.md#linuxfxversion)
+ [`netFrameworkVersion`](functions-app-settings.md#netframeworkversion) (C#/PowerShell-only)

---  

::: zone-end  
:::zone pivot="container-apps"  
+ [`linuxFxVersion`](functions-app-settings.md#linuxfxversion)
::: zone-end  
:::zone pivot="azure-arc"  
+ [`alwaysOn`](functions-app-settings.md#alwayson)
+ [`linuxFxVersion`](functions-app-settings.md#linuxfxversion)
::: zone-end  
:::zone pivot="consumption-plan,premium-plan,dedicated-plan" 
These application settings are required (or recommended) for a specific operating system and hosting option:
::: zone-end  
::: zone pivot="consumption-plan"  

### [Windows](#tab/windows)

+ [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string)
+ [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage)
+ [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version)
+ [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functions_worker_runtime)
+ [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](functions-app-settings.md#website_contentazurefileconnectionstring)
+ [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare)
+ [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package) (recommended)
+ [`WEBSITE_NODE_DEFAULT_VERSION`](functions-app-settings.md#website_node_default_version) (Node.js-only)

### [Linux](#tab/linux)

+ [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string)
+ [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage)
+ [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version)
+ [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functions_worker_runtime) 
+ [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](functions-app-settings.md#website_contentazurefileconnectionstring)
+ [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare)
 
::: zone-end  
:::zone pivot="premium-plan"  
### [Windows](#tab/windows)

+ [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string)
+ [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage)
+ [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version)
+ [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functions_worker_runtime)
+ [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](functions-app-settings.md#website_contentazurefileconnectionstring)
+ [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare)
+ [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package) (recommended)
+ [`WEBSITE_NODE_DEFAULT_VERSION`](functions-app-settings.md#website_node_default_version) (Node.js-only)

### [Linux](#tab/linux)

+ [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string)
+ [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage)
+ [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version)
+ [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functions_worker_runtime) 
+ [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](functions-app-settings.md#website_contentazurefileconnectionstring)
+ [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare)
+ [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package) (recommended)

[!INCLUDE [functions-arm-linux-container](../../includes/functions-arm-linux-container.md)]
::: zone-end 
:::zone pivot="dedicated-plan"  
### [Windows](#tab/windows)

+ [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string)
+ [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage)
+ [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version)
+ [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functions_worker_runtime)
+ [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package) (recommended)
+ [`WEBSITE_NODE_DEFAULT_VERSION`](functions-app-settings.md#website_node_default_version) (Node.js-only)

### [Linux](#tab/linux)

+ [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string)
+ [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage)
+ [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version)
+ [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functions_worker_runtime) 
+ [`WEBSITE_RUN_FROM_PACKAGE`](functions-app-settings.md#website_run_from_package) (recommended)
 
[!INCLUDE [functions-arm-linux-container](../../includes/functions-arm-linux-container.md)]

--- 

::: zone-end 
:::zone pivot="container-apps,azure-arc"  
These application settings are required for container deployments:
 
+ [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string)
+ [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage)
+ [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version)
 
[!INCLUDE [functions-arm-linux-container](../../includes/functions-arm-linux-container.md)]
::: zone-end 

Keep these considerations in mind when working with site and application settings using Bicep files or ARM templates:
 :::zone pivot="consumption-plan,premium-plan,dedicated-plan" 
+ There are important considerations for using [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare) in an automated deployment.  
::: zone-end
:::zone pivot="container-apps,azure-arc,premium-plan,dedicated-plan"  
+ For container deployments, also set [`WEBSITES_ENABLE_APP_SERVICE_STORAGE`](../app-service/reference-app-settings.md#custom-containers) to `false`, since your app content is provided in the container itself. 
::: zone-end  
+ You should always define your application settings as a `siteConfig/appSettings` collection of the `Microsoft.Web/sites` resource being created, as is done in the examples in this article. This makes sure that the settings that your function app needs to run are available on initial startup.

+ When adding or updating application settings using templates, make sure that you include all existing settings with the update. You must do this because the underlying update REST API calls replace the entire `/config/appsettings` resource. If you remove the existing settings, your function app won't run. To programmatically update individual application settings, you can instead use the Azure CLI, Azure PowerShell, or the Azure portal to make these changes. For more information, see [Work with application settings](functions-how-to-use-azure-function-app-settings.md#settings).
:::zone pivot="consumption-plan,premium-plan,dedicated-plan" 
## Slot deployments

Functions lets you deploy different versions of your code to unique endpoints in your function app. This makes it easier to develop, validate, and deploy functions updates without impacting functions running in production. Deployment slots is a feature of Azure App Service. The number of slots available [depends on your hosting plan](./functions-scale.md#service-limits). For more information, see [Azure Functions deployment slots](functions-deployment-slots.md) functions. 

A slot resource is defined in the same way as a function app resource (`Microsoft.Web/sites`), but instead you use the `Microsoft.Web/sites/slots` resource identifier. For an example deployment (in both Bicep and ARM templates) that creates both a production and a staging slot in a Premium plan, see [Azure Function App with a Deployment Slot](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-deployment-slot). 

To learn about how to perform the swap by using templates, see [Automate with Resource Manager templates](../app-service/deploy-staging-slots.md#automate-with-resource-manager-templates).

Keep the following considerations in mind when working with slot deployments:

+  Don't explicitly set the `WEBSITE_CONTENTSHARE` setting in the deployment slot definition. This setting is generated for you when the app is created in the deployment slot. 

+ When you swap slots, some application settings are considered "sticky," in that they stay with the slot and not with the code being swapped. For more information, see [Manage settings](functions-deployment-slots.md#manage-settings).
::: zone-end  
:::zone pivot="premium-plan,dedicated-plan" 
## Secured deployments

You can create your function app in a deployment where one or more of the resources have been secured by integrating with virtual networks. Virtual network integration for your function app is defined by a `Microsoft.Web/sites/networkConfig` resource. This integration depends on both the referenced function app and virtual network resources. You function app might also depend on other private networking resources, such as private endpoints and routes. For more information, see [Azure Functions networking options](functions-networking-options.md).

These projects provide both Bicep and ARM template examples of how to deploy your function apps in a virtual network, including with network access restrictions:

| Restricted scenario | Description |
| ---- | ---- |
| [Create a function app with virtual network integration](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-vnet-integration) | Your function app is created in a virtual network with full access to resources in that network. Inbound and outbound access to your function app isn't restricted. For more information, see [Virtual network integration](functions-networking-options.md#virtual-network-integration). |
| [Create a function app that accesses a secured storage account](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-storage-private-endpoints) | Your created function app uses a secured storage account, which Functions accesses by using private endpoints. For more information, see [Restrict your storage account to a virtual network](configure-networking-how-to.md#restrict-your-storage-account-to-a-virtual-network). |
| [Create a function app and storage account that both use private endpoints](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-private-endpoints-storage-private-endpoints) | Your created function app can only be accessed by using private endpoints, and it uses private endpoints to access storage resources. For more information, see [Private endpoints](functions-networking-options.md#private-endpoints). |

### Restricted network settings

You might also need to use these settings when your function app has network restrictions:

| Setting | Value |  Description |
| ---- |  ---- | ---- |
| [`WEBSITE_CONTENTOVERVNET`](functions-app-settings.md#website_contentovervnet) | `1` | Application setting that enables your function app to scale when the storage account is restricted to a virtual network. For more information, see [Restrict your storage account to a virtual network](functions-networking-options.md#restrict-your-storage-account-to-a-virtual-network).|
| [`vnetrouteallenabled`](functions-app-settings.md#vnetrouteallenabled) | `1` | Site setting that forces all traffic from the function app to use the virtual network. For more information, see [Regional virtual network integration](functions-networking-options.md#regional-virtual-network-integration). This site setting supersedes the application setting [`WEBSITE_VNET_ROUTE_ALL`](./functions-app-settings.md#website_vnet_route_all). |
 
### Considerations for network restrictions

When you're restricting access to the storage account through the private endpoints, you aren't able to access the storage account through the portal or any device outside the virtual network. You can give access to your secured IP address or virtual network in the storage account by [Managing the default network access rule](../storage/common/storage-network-security.md#change-the-default-network-access-rule).
::: zone-end
## Create your template

Experts with Bicep or ARM templates can manually code their deployments using a simple text editor. For the rest of us, there are several ways to make the development process easier:

+ **Visual Studio Code**: There are extensions available to help you work with both [Bicep files](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) and [ARM templates](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools). You can use these tools to help make sure that your code is correct, and they provide some [basic validation](functions-infrastructure-as-code.md?tabs=vs-code#validate-your-template).

+ **Azure portal**: When you [create your function app and related resources in the portal](./functions-create-function-app-portal.md), the final **Review + create** screen has a **Download a template for automation** link. 

    :::image type="content" source="media/functions-infrastructure-as-code/portal-download-template.png" alt-text="Download template link from the Azure Functions creation process in the Azure portal.":::
    
    This link shows you the ARM template generated based on the options you chose in portal. While this template can be a bit complex when you're creating a function app with many new resources, it can provide a good reference for how your ARM template might look.   
 
## Validate your template

When you manually create your deployment template file, it's important to validate your template before deployment. All deployment methods validate your template syntax and raise a `validation failed` error message as shown in the following JSON formatted example:

```json
{"error":{"code":"InvalidTemplate","message":"Deployment template validation failed: 'The resource 'Microsoft.Web/sites/func-xyz' is not defined in the template. Please see https://aka.ms/arm-template for usage details.'.","additionalInfo":[{"type":"TemplateViolation","info":{"lineNumber":0,"linePosition":0,"path":""}}]}}
```

The following methods can be used to validate your template before deployment:

### [Azure Pipelines](#tab/devops)

The following [Azure resource group deployment v2 task](/azure/devops/pipelines/tasks/deploy/azure-resource-group-deployment?view=azure-devops&preserve-view=true) with `deploymentMode: 'Validation'` instructs Azure Pipelines to validate the template. 

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

In [Visual Studio Code](https://code.visualstudio.com/), install the latest [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) or [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools).

These extensions report syntactic errors in your code before deployment. For some examples of errors, see the [Fix validation error](../azure-resource-manager/troubleshooting/quickstart-troubleshoot-arm-deployment.md#fix-validation-error) section of the troubleshooting article.

---

You can also create a test resource group to find [preflight](../azure-resource-manager/troubleshooting/quickstart-troubleshoot-arm-deployment.md?tabs=azure-cli#fix-preflight-error) and [deployment](../azure-resource-manager/troubleshooting/quickstart-troubleshoot-arm-deployment.md?tabs=azure-cli#fix-deployment-error) errors.

## Deploy your template

You can use any of the following ways to deploy your Bicep file and template:

### [ARM template](#tab/json)

- [Azure portal](../azure-resource-manager/templates/deploy-portal.md)
- [Azure CLI](../azure-resource-manager/templates/deploy-cli.md)
- [PowerShell](../azure-resource-manager/templates/deploy-powershell.md)

### [Bicep](#tab/bicep)

- [Azure CLI](../azure-resource-manager/bicep/deploy-cli.md)
- [PowerShell](../azure-resource-manager/bicep/deploy-powershell.md)

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

#### [ARM template](#tab/json)

```powershell
# Register Resource Providers if they're not already registered
Register-AzResourceProvider -ProviderNamespace "microsoft.web"
Register-AzResourceProvider -ProviderNamespace "microsoft.storage"

# Create a resource group for the function app
New-AzResourceGroup -Name "MyResourceGroup" -Location 'West Europe'

# Deploy the template
New-AzResourceGroupDeployment -ResourceGroupName "MyResourceGroup" -TemplateFile azuredeploy.json  -Verbose
```

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
