---
title: Automate function app resource deployment to Azure
description: Learn how to build, validate, and use a Bicep file or an Azure Resource Manager template to deploy your function app and related Azure resources.
ms.assetid: d20743e3-aab6-442c-a836-9bcea09bfd32
ms.topic: conceptual
ms.date: 10/21/2024
ms.custom: fasttrack-edit, devx-track-bicep, devx-track-arm-template, linux-related-content, ignite-2024
zone_pivot_groups: functions-hosting-plan
---

# Automate resource deployment for your function app in Azure Functions

You can use a Bicep file or an Azure Resource Manager (ARM) template to automate the process of deploying your function app. During the deployment, you can use existing Azure resources or create new ones. Automation helps you with these scenarios:

+ Integrating your resource deployments with your source code in Azure Pipelines and GitHub Actions-based deployments.
+ Restoring a function app and related resources from a backup.
+ Deploying an app topology multiple times. 

This article shows you how to automate the creation of resources and deployment for Azure Functions. Depending on the [triggers and bindings](functions-triggers-bindings.md) used by your functions, you might need to deploy other resources, which is outside of the scope of this article. 

The template code required depends on the desired hosting options for your function app. This article supports the following hosting options:

| Hosting option | Deployment type | To learn more, see... |
| ----- | ----- | ----- |
| [Azure Functions Consumption plan](functions-infrastructure-as-code.md?pivots=consumption-plan) | Code-only | [Consumption plan](./consumption-plan.md) |
| [Azure Functions Flex Consumption plan](functions-infrastructure-as-code.md?pivots=consumption-plan) | Code-only | [Flex Consumption plan](./flex-consumption-plan.md) |
| [Azure Functions Elastic Premium plan](functions-infrastructure-as-code.md?pivots=premium-plan) | Code \| Container | [Premium plan](./functions-premium-plan.md)|
| [Azure Functions Dedicated (App Service) plan](functions-infrastructure-as-code.md?pivots=dedicated-plan) | Code \| Container | [Dedicated plan](./dedicated-plan.md)|
| [Azure Container Apps](functions-infrastructure-as-code.md?pivots=premium-plan) | Container-only | [Container Apps hosting of Azure Functions](functions-container-apps-hosting.md)|
| [Azure Arc](functions-infrastructure-as-code.md?pivots=premium-plan) | Code \| Container | [App Service, Functions, and Logic Apps on Azure Arc (Preview)](../app-service/overview-arc-integration.md)| 

When using this article, keep these considerations in mind:

+ There's no canonical way to structure an ARM template.
 
+ A Bicep deployment can be modularized into multiple Bicep files. 

+ This article assumes that you have a basic understanding of [creating Bicep files](../azure-resource-manager/bicep/file.md) or [authoring Azure Resource Manager templates](../azure-resource-manager/templates/syntax.md). 
::: zone pivot="premium-plan,dedicated-plan,consumption-plan"  
+ Examples are shown as individual sections for specific resources. For a broad set of complete Bicep file and ARM template examples, see [these function app deployment examples](/samples/browse/?expanded=azure&terms=%22azure%20functions%22&products=azure-resource-manager). 
::: zone-end  
::: zone pivot="flex-consumption-plan"  
+ Examples are shown as individual sections for specific resources. For a broad set of complete Bicep file and ARM template examples, see [these Flex Consumption app deployment examples](/samples/browse/?expanded=azure&terms=%22azure%20functions%20flex%22&products=azure-resource-manager). 
::: zone-end  
::: zone pivot="container-apps,azure-arc"  
+ Examples are shown as individual sections for specific resources.  
::: zone-end  
## Required resources  
::: zone pivot="premium-plan,dedicated-plan,flex-consumption-plan" 
You must create or configure these resources for an Azure Functions-hosted deployment:

| Resource  | Requirement | Syntax and properties reference |
|------|-------|----|
| A [storage account](#create-storage-account) | Required | [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| An [Application Insights](#create-application-insights) component | Recommended | [Microsoft.Insights/components](/azure/templates/microsoft.insights/components)<sup>*</sup>|  
| A [hosting plan](#create-the-hosting-plan)| Required | [Microsoft.Web/serverfarms](/azure/templates/microsoft.web/serverfarms) |
| A [function app](#create-the-function-app) | Required | [Microsoft.Web/sites](/azure/templates/microsoft.web/sites)  |
::: zone-end    
::: zone pivot="consumption-plan"  
You must create or configure these resources for an Azure Functions-hosted deployment:
 
| Resource  | Requirement | Syntax and properties reference |
|------|-------|----|
| A [storage account](#create-storage-account) | Required | [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| An [Application Insights](#create-application-insights) component | Recommended | [Microsoft.Insights/components](/azure/templates/microsoft.insights/components)<sup>*</sup>|  
| A [function app](#create-the-function-app) | Required | [Microsoft.Web/sites](/azure/templates/microsoft.web/sites)  |
::: zone-end  
::: zone pivot="container-apps"  
An Azure Container Apps-hosted deployment typically consists of these resources:

| Resource  | Requirement | Syntax and properties reference |
|------|-------|----|
| A [storage account](#create-storage-account) | Required | [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| An [Application Insights](#create-application-insights) component | Recommended | [Microsoft.Insights/components](/azure/templates/microsoft.insights/components)<sup>*</sup>|  
| A [managed environment](./functions-container-apps-hosting.md#) | Required | [Microsoft.App/managedEnvironments](/azure/templates/microsoft.app/managedenvironments) |
| A [function app](#create-the-function-app) | Required | [Microsoft.Web/sites](/azure/templates/microsoft.web/sites)  |
::: zone-end  
::: zone pivot="azure-arc"  
An Azure Arc-hosted deployment typically consists of these resources:

| Resource  | Requirement | Syntax and properties reference |
|------|-------|----|
| A [storage account](#create-storage-account) | Required | [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts) |
| An [Application Insights](#create-application-insights) component | Recommended | [Microsoft.Insights/components](/azure/templates/microsoft.insights/components)<sup>1</sup>|  
| An [App Service Kubernetes environment](../app-service/overview-arc-integration.md#app-service-kubernetes-environment) | Required | [Microsoft.ExtendedLocation/customLocations](/azure/templates/microsoft.extendedlocation/customlocations) |
| A [function app](#create-the-function-app) | Required | [Microsoft.Web/sites](/azure/templates/microsoft.web/sites)  |
::: zone-end  
<sup>*</sup>If you don't already have a Log Analytics Workspace that can be used by your Application Insights instance, you also need to create this resource.   

When you deploy multiple resources in a single Bicep file or ARM template, the order in which resources are created is important. This requirement is a result of dependencies between resources. For such dependencies, make sure to use the `dependsOn` element to define the dependency in the dependent resource. For more information, see either [Define the order for deploying resources in ARM templates](../azure-resource-manager/templates/resource-dependency.md) or [Resource dependencies in Bicep](../azure-resource-manager/bicep/resource-dependencies.md). 

## Prerequisites  

+ The examples are designed to execute in the context of an existing resource group.
+ Both Application Insights and storage logs require you to have an existing [Azure Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-overview). Workspaces can be shared between services, and as a rule of thumb you should create a workspace in each geographic region to improve performance. For an example of how to create a Log Analytics workspace, see [Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace?tabs=azure-resource-manager#create-a-workspace). You can find the fully qualified workspace resource ID in a workspace page in the [Azure portal](https://portal.azure.com) under **Settings** > **Properties** > **Resource ID**. 
::: zone pivot="container-apps" 
+ This article assumes that you have already created a [managed environment](../container-apps/environment.md) in Azure Container Apps. You need both the name and the ID of the managed environment to create a function app hosted on Container Apps.  
::: zone-end  
::: zone pivot="azure-arc" 
+ This article assumes that you have already created an [App Service-enabled custom location](../app-service/overview-arc-integration.md) on an [Azure Arc-enabled Kubernetes cluster](/azure/azure-arc/kubernetes/overview). You need both the custom location ID and the Kubernetes environment ID to create a function app hosted in an Azure Arc custom location.  
::: zone-end  
<a name="storage"></a>
## Create storage account

All function apps require an Azure storage account. You need a general purpose account that supports blobs, tables, queues, and files. For more information, see [Azure Functions storage account requirements](storage-considerations.md#storage-account-requirements).

[!INCLUDE [functions-storage-access-note](../../includes/functions-storage-access-note.md)]

This example section creates a Standard general purpose v2 storage account: 

### [Bicep](#tab/bicep)

```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    supportsHttpsTrafficOnly: true
    defaultToOAuthAuthentication: true
    allowBlobPublicAccess: false
  }
}
```
::: zone pivot="premium-plan,dedicated-plan,consumption-plan"
For more context, see the complete [main.bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/main.bicep#L37) file in the templates repository.
::: zone-end  
::: zone pivot="flex-consumption-plan"
For more context, see the complete [storage-account.bicep](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd/blob/main/infra/core/storage/storage-account.bicep) file in the sample repository.
::: zone-end  

### [ARM template](#tab/json)

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2023-05-01",
    "name": "[parameters('storageAccountName')]",
    "location": "[parameters('location')]",
    "kind": "StorageV2",
    "sku": {
      "name": "Standard_LRS"
    },
    "properties": {
      "supportsHttpsTrafficOnly": true,
      "defaultToOAuthAuthentication": true,
      "allowBlobPublicAccess": false
    }
  }
]
```

For more context, see the complete [azuredeploy.json](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/azuredeploy.json#L77) file in the templates repository.

---

You need to set the connection string of this storage account as the `AzureWebJobsStorage` app setting, which Functions requires. The templates in this article construct this connection string value based on the created storage account, which is a best practice. For more information, see [Application configuration](#application-configuration). 

<!---{{todo: MI/KeyVault info/links here}} -->

::: zone pivot="flex-consumption-plan"  
### Deployment container

Deployments to an app running in the Flex Consumption plan require a container in Azure Blob Storage as the deployment source. You can use either the default storage account or you can specify a separate storage account. For more information, see [Configure deployment settings](flex-consumption-how-to.md#configure-deployment-settings). 

This deployment account must already be configured when you create your app, including the specific container used for deployments. To learn more about configuring deployments, see [Deployment sources](#deployment-sources).

This example shows how to create a container in the storage account:

### [Bicep](#tab/bicep)

:::code language="bicep" source="~/function-flex-consumption/IaC/bicep/core/storage/storage-account.bicep" range="46-57" :::

For the snippet in context, see [this deployment example](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/bicep/core/storage/storage-account.bicep#L46).

### [ARM template](#tab/json)

:::code language="json" source="~/function-flex-consumption/IaC/armtemplate/azuredeploy.json" range="117-135" :::

For the snippet in context, see [this deployment example](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/armtemplate/azuredeploy.json#L117).

---

Other deployment settings are [configured with the app itself](#deployment-sources). 

::: zone-end  
### Enable storage logs

Because the storage account is used for important function app data, you should monitor the account for modification of that content. To monitor your storage account, you need to configure Azure Monitor resource logs for Azure Storage. In this example section, a Log Analytics workspace named `myLogAnalytics` is used as the destination for these logs. 

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

---

This same workspace can be used for the Application Insights resource defined later. For more information, including how to work with these logs, see [Monitoring Azure Storage](../storage/blobs/monitor-blob-storage.md).

## Create Application Insights

You should be using Application Insights for monitoring your function app executions. Application Insights now requires an Azure Log Analytics workspace, which can be shared. These examples assume you're using an existing workspace and have the fully qualified resource ID for the workspace. For more information, see [Azure Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-overview). 

In this example section, the Application Insights resource is defined with the type `Microsoft.Insights/components` and the kind `web`:

### [Bicep](#tab/bicep)

```bicep
resource applicationInsight 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: appInsightsLocation
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: '<FULLY_QUALIFIED_RESOURCE_ID>'
  }
}
```

For more context, see the complete [main.bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/main.bicep#L60) file in the templates repository.


### [ARM template](#tab/json)

```json
{
  "type": "Microsoft.Insights/components",
  "apiVersion": "2020-02-02",
  "name": "[parameters('applicationInsightsName')]",
  "location": "[parameters('location')]",
  "kind": "web",
  "properties": {
    "Application_Type": "web",
    "WorkspaceResourceId": "<FULLY_QUALIFIED_RESOURCE_ID>"
  }
}
```


For more context, see the complete [azuredeploy.json](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/azuredeploy.json#L102) file in the templates repository.

---

The connection must be provided to the function app using the [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string) application setting. For more information, see [Application configuration](#application-configuration).

The examples in this article obtain the connection string value for the created instance. Older versions might instead use [`APPINSIGHTS_INSTRUMENTATIONKEY`](functions-app-settings.md#appinsights_instrumentationkey) to set the instrumentation key, which is no longer recommended. 

::: zone pivot="flex-consumption-plan,premium-plan,dedicated-plan"  
## Create the hosting plan

Apps hosted in an Azure Functions [Flex Consumption plan](./flex-consumption-plan.md), [Premium plan](./functions-premium-plan.md), or [Dedicated (App Service) plan](./dedicated-plan.md) must have the hosting plan explicitly defined. 
::: zone-end  
::: zone pivot="flex-consumption-plan"  
Flex Consumption is a Linux-based hosting plan that builds on the Consumption _pay for what you use_ serverless billing model. The plan features support for private networking, instance memory size selection, and improved managed identity support.

A Flex Consumption plan is a special type of `serverfarm` resource. You can specify it by using `FC1` for the `Name` property value in the `sku` property with a `tier` value of `FlexConsumption`. 

This example section creates Flex Consumption plan:

### [Bicep](#tab/bicep)

:::code language="bicep" source="~/function-flex-consumption/IaC/bicep/core/host/function.bicep" range="21-33" :::

For more context, see the complete [function.bicep](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/bicep/core/host/function.bicep#L21) file in the Flex Consumption plan sample repository.

### [ARM template](#tab/json)

:::code language="json" source="~/function-flex-consumption/IaC/armtemplate/azuredeploy.json" range="136-149" :::

For more context, see the complete [azuredeploy.json](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/armtemplate/azuredeploy.json#L136) file in the templates repository.

---   

Because the Flex Consumption plan currently only supports Linux, you must also set the `reserved` property to `true`.
::: zone-end  
::: zone pivot="premium-plan" 
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
::: zone pivot="dedicated-plan" 
In the Dedicated (App Service) plan, your function app runs on dedicated VMs on Basic, Standard, and Premium SKUs in App Service plans, similar to web apps. For more information, see [Dedicated plan](./dedicated-plan.md).

For a sample Bicep file/Azure Resource Manager template, see [Function app on Azure App Service plan].

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
::: zone pivot="consumption-plan"
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
::: zone pivot="azure-arc" 
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
::: zone pivot="consumption-plan,premium-plan,dedicated-plan"
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
::: zone pivot="dedicated-plan"
### [Windows](#tab/windows)

For a list of application settings required when running on Windows, see [Application configuration](#application-configuration).  

### [Linux](#tab/linux)

[!INCLUDE [functions-arm-linux-intro](../../includes/functions-arm-linux-intro.md)]

---
::: zone-end  
::: zone pivot="flex-consumption-plan"  
Flex Consumption replaces many of the standard application settings and site configuration properties used in Bicep and ARM template deployments. For more information, see [Application configuration](#application-configuration).
 
### [Bicep](#tab/bicep)

:::code language="bicep" source="~/function-flex-consumption/IaC/bicep/core/host/function.bicep" range="35-77" :::

For more context, see the complete [function.bicep](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/bicep/core/host/function.bicep#L35) file in the Flex Consumption plan sample repository.

### [ARM template](#tab/json)

:::code language="json" source="~/function-flex-consumption/IaC/armtemplate/azuredeploy.json" range="143-191" :::

For more context, see the complete [azuredeploy.json](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/armtemplate/azuredeploy.json#L144) file in the templates repository.

---
::: zone-end  
::: zone pivot="consumption-plan"  
>[!NOTE]  
>If you choose to optionally define your Consumption plan, you must set the `serverFarmId` property on the app so that it points to the resource ID of the plan. Make sure that the function app has a `dependsOn` setting that also references the plan. If you didn't explicitly define a plan, one gets created for you. 
::: zone-end
::: zone pivot="premium-plan,dedicated-plan"
Set the `serverFarmId` property on the app so that it points to the resource ID of the plan. Make sure that the function app has a `dependsOn` setting that also references the plan. 
::: zone-end  
::: zone pivot="premium-plan,consumption-plan"  
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

::: zone-end
::: zone pivot="dedicated-plan"
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

::: zone-end  
## Deployment sources
::: zone pivot="container-apps,azure-arc"  
You can use the [`linuxFxVersion`](./functions-app-settings.md#linuxfxversion) site setting to request that a specific Linux container be deployed to your app when it's created. More settings are required to access images in a private repository. For more information, see [Application configuration](#application-configuration).    

[!INCLUDE [functions-linux-custom-container-note](../../includes/functions-linux-custom-container-note.md)]
::: zone-end
::: zone pivot="dedicated-plan,premium-plan"  
Your Bicep file or ARM template can optionally also define a deployment for your function code, which could include these methods:

+ [Zip deployment package](./deployment-zip-push.md)
+ [Linux container](./functions-how-to-custom-container.md) 
::: zone-end  
::: zone pivot="flex-consumption-plan"  
The Flex Consumption plan maintains your project code in zip-compressed package file in a blob storage container known as the _deployment container_. You can configure both the storage account and container used for deployment. For more information, see [Deployment](flex-consumption-plan.md#deployment). 

You must use _[one deploy](functions-deployment-technologies.md#one-deploy)_ to publish your code package to the deployment container. During an ARM or Bicep deployment, you can do this by [defining a package source](#deployment-package) that uses the `/onedeploy` extension. If you choose to instead directly upload your package to the container, the package doesn't get automatically deployed.

### Deployment container

The specific storage account and container used for deployments, the authentication method, and credentials are set in the `functionAppConfig.deployment.storage` element of the `properties` for the site. The container and any application settings must exist when the app is created. For an example of how to create the storage container, see [Deployment container](#deployment-container).

This example uses a system assigned managed identity to access the specified blob storage container, which is created elsewhere in the deployment:

### [Bicep](#tab/bicep)

:::code language="bicep" source="~/function-flex-consumption/IaC/bicep/core/host/function.bicep" range="58-66" :::

### [ARM template](#tab/json)

:::code language="json" source="~/function-flex-consumption/IaC/armtemplate/azuredeploy.json" range="162-170" :::

---

When using managed identities, you must also enable the function app to access the storage account using the identity, as shown in this example:

 ### [Bicep](#tab/bicep)

:::code language="bicep" source="~/function-flex-consumption/IaC/bicep/core/host/function.bicep" range="81-90" :::

For a complete reference example, see [this Bicep file](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/bicep/core/host/function.bicep).

### [ARM template](#tab/json)

:::code language="json" source="~/function-flex-consumption/IaC/armtemplate/azuredeploy.json" range="199-212" :::

For a complete reference example, see [this ARM template](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/armtemplate/azuredeploy.json).

---

This example requires you to know the GUID value for the role being assigned. You can get this ID value for any friendly role name by using the [az role definition list](/cli/azure/role/definition#az-role-definition-list) command, as in this example: 

```azure-cli
az role definition list --output tsv --query "[?roleName=='Storage Blob Data Owner'].{name:name}"
```

When using a connection string instead of managed identities, you need to instead set the `authentication.type` to `StorageAccountConnectionString` and set `authentication.storageAccountConnectionStringName` to the name of the application setting that contains the deployment storage account connection string.  

### Deployment package

The Flex Consumption plan uses _one deploy_ for deploying your code project. The code package itself is the same as you would use for zip deployment in other Functions hosting plans. However, the name of the package file itself must be `released-package.zip`. 

To include a one deploy package in your template, use the `/onedeploy` resource definition for the remote URL that contains the deployment package. The Functions host must be able to access both this remote package source and the deployment container.  

This example adds a one deploy source to an existing app:  

### [Bicep](#tab/bicep)

```bicep
@description('The name of the function app.')
param functionAppName string

@description('The location into which the resources should be deployed.')
param location string = resourceGroup().location

@description('The zip content URL for released-package.zip.')
param packageUri string

resource functionAppName_OneDeploy 'Microsoft.Web/sites/extensions@2022-09-01' = {
  name: '${functionAppName}/onedeploy'
  location: location
  properties: {
    packageUri: packageUri
    remoteBuild: false 
  }
}
```
### [ARM template](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "functionAppName": {
      "type": "string",
      "metadata": {
        "description": "The name of the Azure Functions app."
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
        "description": "The zip content URL for released-package.zip."
      }
    }
  },
  "resources": [
    {
      "name": "[concat(parameters('functionAppName'), '/onedeploy')]",
      "type": "Microsoft.Web/sites/extensions",
      "apiVersion": "2022-09-01",
      "location": "[parameters('location')]",
      "properties": {
        "packageUri": "[parameters('packageUri')]"
      }
    }
  ]
}
```
---

::: zone-end  
::: zone pivot="consumption-plan"  
Your Bicep file or ARM template can optionally also define a deployment for your function code using a [zip deployment package](./deployment-zip-push.md).  
::: zone-end  
::: zone pivot="dedicated-plan,premium-plan,consumption-plan" 
To successfully deploy your application by using Azure Resource Manager, it's important to understand how resources are deployed in Azure. In most examples, top-level configurations are applied by using `siteConfig`. It's important to set these configurations at a top level, because they convey information to the Functions runtime and deployment engine. Top-level information is required before the child `sourcecontrols/web` resource is applied. Although it's possible to configure these settings in the child-level `config/appSettings` resource, in some cases your function app must be deployed _before_ `config/appSettings` is applied. 

## Zip deployment package

Zip deployment is a recommended way to deploy your function app code. By default, functions that use zip deployment run in the deployment package itself. For more information, including the requirements for a deployment package, see [Zip deployment for Azure Functions](deployment-zip-push.md). When using resource deployment automation, you can reference the .zip deployment package in your Bicep or ARM template. 

To use zip deployment in your template, set the `WEBSITE_RUN_FROM_PACKAGE` setting in the app to `1` and include the `/zipDeploy` resource definition. 
::: zone-end  
::: zone pivot="consumption-plan"  
For a Consumption plan on Linux, instead set the URI of the deployment package directly in the `WEBSITE_RUN_FROM_PACKAGE` setting, as shown in [this example template](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-linux-consumption#L152). 
::: zone-end  
::: zone pivot="dedicated-plan,premium-plan,consumption-plan"  
This example adds a zip deployment source to an existing app:  

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
### [ARM template](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "functionAppName": {
      "type": "string",
      "metadata": {
        "description": "The name of the Azure Functions app."
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

Keep the following things in mind when including zip deployment resources in your template:
::: zone-end
::: zone pivot="consumption-plan"  
+ Consumption plans on Linux don't support `WEBSITE_RUN_FROM_PACKAGE = 1`. You must instead set the URI of the deployment package directly in the `WEBSITE_RUN_FROM_PACKAGE` setting. For more information, see [WEBSITE\_RUN\_FROM\_PACKAGE](functions-app-settings.md#website_run_from_package). For an example template, see [Function app hosted on Linux in a Consumption plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-linux-consumption).
::: zone-end  
::: zone pivot="dedicated-plan,premium-plan,consumption-plan"  
+ The `packageUri` must be a location that can be accessed by Functions. Consider using Azure blob storage with a shared access signature (SAS). After the SAS expires, Functions can no longer access the share for deployments. When you regenerate your SAS, remember to update the `WEBSITE_RUN_FROM_PACKAGE` setting with the new URI value.

+ When setting `WEBSITE_RUN_FROM_PACKAGE` to a URI, you must [manually sync triggers](functions-deployment-technologies.md#trigger-syncing).

+ Make sure to always set all required application settings in the `appSettings` collection when adding or updating settings. Existing settings not explicitly set are removed by the update. For more information, see [Application configuration](#application-configuration). 

+ Functions doesn't support Web Deploy (msdeploy) for package deployments. You must instead use zip deployment in your deployment pipelines and automation. For more information, see [Zip deployment for Azure Functions](deployment-zip-push.md).

## Remote builds

The deployment process assumes that the .zip file that you use or a zip deployment contains a ready-to-run app. This means that by default no customizations are run. 

There are scenarios that require you to rebuild your app remotely. One such example is when you need to include Linux-specific packages in Python or Node.js apps that you developed on a Windows computer. In this case, you can configure Functions to perform a remote build on your code after the zip deployment. 

The way that you request a remote build depends on the operating system to which you're deploying:

### [Windows](#tab/windows)

When an app is deployed to Windows, language-specific commands (like `dotnet restore` for C# apps or `npm install` for Node.js apps) are run.

To enable the same build processes that you get with continuous integration, add `SCM_DO_BUILD_DURING_DEPLOYMENT=true` to your application settings in your deployment code and remove the `WEBSITE_RUN_FROM_PACKAGE` entirely.

### [Linux](#tab/linux)

To enable the same build processes that you get with continuous integration, add `SCM_DO_BUILD_DURING_DEPLOYMENT=true` to your application settings in your deployment code and remove the `WEBSITE_RUN_FROM_PACKAGE` entirely.

The `ENABLE_ORYX_BUILD` setting is set to `true` by default. If you have issues building a .NET or Java function app, instead set it to `false`. 

Function apps that are built remotely on Linux can run from a package.

---  

::: zone-end  
::: zone pivot="dedicated-plan,premium-plan"
## Linux containers

If you're deploying a [containerized function app](./functions-how-to-custom-container.md) to an Azure Functions Premium or Dedicated plan, you must:

+ Set the [`linuxFxVersion`](functions-app-settings.md#linuxfxversion) site setting with the identifier of your container image. 
+ Set any required [`DOCKER_REGISTRY_SERVER_*`](functions-infrastructure-as-code.md?tabs=linux#application-configuration) settings when obtaining the container from a private registry. 
+ Set [`WEBSITES_ENABLE_APP_SERVICE_STORAGE`](../app-service/reference-app-settings.md#custom-containers) application setting to `false`. 

If some settings are missing, the application provisioning might fail with this HTTP/500 error: 

>`Function app provisioning failed.`

For more information, see [Application configuration](#application-configuration).

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

---

::: zone-end
::: zone pivot="container-apps"
When deploying [containerized functions to Azure Container Apps](./functions-container-apps-hosting.md), your template must:

+ Set the `kind` field to a value of `functionapp,linux,container,azurecontainerapps`. 
+ Set the `managedEnvironmentId` site property to the fully qualified URI of the Container Apps environment. 
+ Add a resource link in the site's `dependsOn` collection when creating a `Microsoft.App/managedEnvironments` resource at the same time as the site. 

The definition of a containerized function app deployed from a private container registry to an existing Container Apps environment might look like this example:

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

---

::: zone-end
::: zone pivot="azure-arc"
When deploying functions to Azure Arc, the value you set for the `kind` field of the function app resource depends on the type of deployment:

| Deployment type | `kind` field value |
|----|----|
| Code-only deployment | `functionapp,linux,kubernetes` |
| Container deployment | `functionapp,linux,kubernetes,container` |  

You must also set the `customLocationId` as you did for the [hosting plan resource](#create-the-hosting-plan).

The definition of a containerized function app, using a .NET 6 quickstart image, might look like this example:

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

---

::: zone-end  

## Application configuration
::: zone pivot="flex-consumption-plan"   
In a Flex Consumption plan, you configure your function app in Azure with two types of properties: 

| Configuration | `Microsoft.Web/sites` property |  
| ---- | ---- |
| Application configuration | `functionAppConfig` |
| Application settings | `siteConfig.appSettings` collection |

These application configurations are maintained in `functionAppConfig`:

| Behavior | Setting in `functionAppConfig`| 
| --- | --- |
| [Always ready instances](flex-consumption-plan.md#always-ready-instances) |  `scaleAndConcurrency.alwaysReady`  |
| [Deployment source](#deployment-sources) | `deployment` |
| [Instance memory size](flex-consumption-plan.md#instance-memory) | `scaleAndConcurrency.instanceMemoryMB` |
| [HTTP trigger concurrency](functions-concurrency.md#http-trigger-concurrency) | `scaleAndConcurrency.triggers.http.perInstanceConcurrency` |
| [Language runtime](functions-app-settings.md#functions_worker_runtime) | `runtime.name` |
| [Language version](supported-languages.md) | `runtime.version` |
| [Maximum instance count](event-driven-scaling.md#flex-consumption-plan) | `scaleAndConcurrency.maximumInstanceCount` |

The Flex Consumption plan also supports these application settings:

+ Connection string-based settings:
    + [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string)
    + [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage)
+ Managed identity-based settings:
    + [`APPLICATIONINSIGHTS_AUTHENTICATION_STRING`](functions-app-settings.md#applicationinsights_authentication_string)
    + [`AzureWebJobsStorage__accountName`](functions-app-settings.md#azurewebjobsstorage__accountname)

::: zone-end  
::: zone pivot="consumption-plan,premium-plan,dedicated-plan,container-apps,azure-arc"  
Functions provides the following options for configuring your function app in Azure: 

| Configuration | `Microsoft.Web/sites` property |  
| ---- | ---- |
| Site settings | `siteConfig` |
| Application settings | `siteConfig.appSettings` collection |

These site settings are required on the `siteConfig` property: 
::: zone-end 
::: zone pivot="dedicated-plan"  
### [Windows](#tab/windows)

+ [`alwaysOn`](functions-app-settings.md#alwayson)
+ [`netFrameworkVersion`](functions-app-settings.md#netframeworkversion)

### [Linux](#tab/linux)

+ [`alwaysOn`](functions-app-settings.md#alwayson)
+ [`linuxFxVersion`](functions-app-settings.md#linuxfxversion)
+ [`netFrameworkVersion`](functions-app-settings.md#netframeworkversion)

---  

::: zone-end  
::: zone pivot="consumption-plan,premium-plan"  
### [Windows](#tab/windows)

+ [`netFrameworkVersion`](functions-app-settings.md#netframeworkversion)  

### [Linux](#tab/linux)

+ [`linuxFxVersion`](functions-app-settings.md#linuxfxversion)
+ [`netFrameworkVersion`](functions-app-settings.md#netframeworkversion) (C#/PowerShell-only)

---  

::: zone-end  
::: zone pivot="container-apps"  
+ [`linuxFxVersion`](functions-app-settings.md#linuxfxversion)
::: zone-end  
::: zone pivot="azure-arc"  
+ [`alwaysOn`](functions-app-settings.md#alwayson)
+ [`linuxFxVersion`](functions-app-settings.md#linuxfxversion)
::: zone-end  
::: zone pivot="dedicated-plan,premium-plan,azure-arc,container-apps"  
These site settings are required only when using managed identities to obtain the image from an Azure Container Registry instance:

+ [`AcrUseManagedIdentityCreds`](functions-app-settings.md#acrusemanagedidentitycreds)
+ [`AcrUserManagedIdentityID`](functions-app-settings.md#acrusermanagedidentityid)
::: zone-end
::: zone pivot="consumption-plan,premium-plan,dedicated-plan" 
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
::: zone pivot="premium-plan"  
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
::: zone pivot="dedicated-plan"  
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
::: zone pivot="container-apps,azure-arc"  
These application settings are required for container deployments:
 
+ [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string)
+ [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage)
+ [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version)
 
[!INCLUDE [functions-arm-linux-container](../../includes/functions-arm-linux-container.md)]
::: zone-end 

Keep these considerations in mind when working with site and application settings using Bicep files or ARM templates:
::: zone pivot="flex-consumption-plan"   
+ The optional `alwaysReady` setting contains an array of one or more `{name,instanceCount}` objects, with one for each [per-function scale group](flex-consumption-plan.md#per-function-scaling). These are the scale groups being used to make always-ready scale decisions. This example sets always-ready counts for both the `http` group and a single function named `helloworld`, which is of a nongrouped trigger type:
	### [Bicep](#tab/bicep)
	```bicep
	alwaysReady: [
	  {
	    name: 'http'
	    instanceCount: 2
	  }
	  {
	    name: 'function:helloworld'
	    instanceCount: 1
	  }
	]
 	```
	### [ARM template](#tab/json)
	```json
	  "alwaysReady": [
	    {
	      "name": "http",
	      "instanceCount": 2
	    },
	    {
	      "name": "function:helloworld",
	      "instanceCount": 1
	    }
	  ]
 	```
::: zone-end
::: zone pivot="consumption-plan,premium-plan,dedicated-plan" 
+ There are important considerations for when you should set `WEBSITE_CONTENTSHARE` in an automated deployment. For detailed guidance, see the [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare) reference. 
::: zone-end
::: zone pivot="container-apps,azure-arc,premium-plan,dedicated-plan"  
+ For container deployments, also set [`WEBSITES_ENABLE_APP_SERVICE_STORAGE`](../app-service/reference-app-settings.md#custom-containers) to `false`, since your app content is provided in the container itself. 
::: zone-end  
+ You should always define your application settings as a `siteConfig/appSettings` collection of the `Microsoft.Web/sites` resource being created, as is done in the examples in this article. This definition guarantees the settings your function app needs to run are available on initial startup.

+ When adding or updating application settings using templates, make sure that you include all existing settings with the update. You must do this because the underlying update REST API calls replace the entire `/config/appsettings` resource. If you remove the existing settings, your function app won't run. To programmatically update individual application settings, you can instead use the Azure CLI, Azure PowerShell, or the Azure portal to make these changes. For more information, see [Work with application settings](functions-how-to-use-azure-function-app-settings.md#settings).

+ When possible, you should use managed identity-based connections to other Azure services, including the `AzureWebJobsStorage` connection. For more information, see [Configure an identity-based connection](functions-reference.md#configure-an-identity-based-connection).
::: zone pivot="consumption-plan,premium-plan,dedicated-plan" 
## Slot deployments

Functions lets you deploy different versions of your code to unique endpoints in your function app. This option makes it easier to develop, validate, and deploy functions updates without impacting functions running in production. Deployment slots is a feature of Azure App Service. The number of slots available [depends on your hosting plan](./functions-scale.md#service-limits). For more information, see [Azure Functions deployment slots](functions-deployment-slots.md) functions. 

A slot resource is defined in the same way as a function app resource (`Microsoft.Web/sites`), but instead you use the `Microsoft.Web/sites/slots` resource identifier. For an example deployment (in both Bicep and ARM templates) that creates both a production and a staging slot in a Premium plan, see [Azure Function App with a Deployment Slot](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-deployment-slot). 

To learn about how to swap slots by using templates, see [Automate with Resource Manager templates](../app-service/deploy-staging-slots.md#automate-with-resource-manager-templates).

Keep the following considerations in mind when working with slot deployments:

+  Don't explicitly set the `WEBSITE_CONTENTSHARE` setting in the deployment slot definition. This setting is generated for you when the app is created in the deployment slot. 

+ When you swap slots, some application settings are considered "sticky," in that they stay with the slot and not with the code being swapped. You can define such a _slot setting_ by including `"slotSetting":true` in the specific application setting definition in your template. For more information, see [Manage settings](functions-deployment-slots.md#manage-settings).
::: zone-end  
::: zone pivot="flex-consumption-plan,premium-plan,dedicated-plan" 
## Secured deployments

You can create your function app in a deployment where one or more of the resources have been secured by integrating with virtual networks. Virtual network integration for your function app is defined by a `Microsoft.Web/sites/networkConfig` resource. This integration depends on both the referenced function app and virtual network resources. Your function app might also depend on other private networking resources, such as private endpoints and routes. For more information, see [Azure Functions networking options](functions-networking-options.md). 
::: zone-end  
::: zone pivot="flex-consumption-plan" 
These projects provide Bicep-based examples of how to deploy your function apps in a virtual network, including with network access restrictions:

+ [High-scale HTTP triggered function connects to an event hub secured by a virtual network](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/README.md): An HTTP triggered function (.NET isolated worker mode) accepts calls from any source and then sends the body of those HTTP calls to a secure event hub running in a virtual network by using virtual network integration.
+ [Function is triggered by a Service Bus queue secured in a virtual network](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/README.md): A Python function is triggered by a Service Bus queue secured in a virtual network. The queue is accessed in the virtual network using private endpoint. A virtual machine in the virtual network is used to send messages.  
::: zone-end   
::: zone pivot="premium-plan,dedicated-plan" 
When creating a deployment that uses a secured storage account, you must both explicitly set the `WEBSITE_CONTENTSHARE` setting and create the file share resource named in this setting. Make sure you create a `Microsoft.Storage/storageAccounts/fileServices/shares` resource using the value of `WEBSITE_CONTENTSHARE`, as shown in this example ([ARM template](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-private-endpoints-storage-private-endpoints/azuredeploy.json#L467)|[Bicep file](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-private-endpoints-storage-private-endpoints/main.bicep#L351)). You'll also need to set the site property `vnetContentShareEnabled` to true. 

> [!NOTE]
> When these settings aren't part of a deployment that uses a secured storage account, you see this error during deployment validation: `Could not access storage account using provided connection string`.

These projects provide both Bicep and ARM template examples of how to deploy your function apps in a virtual network, including with network access restrictions:

| Restricted scenario | Description |
| ---- | ---- |
| [Create a function app with virtual network integration](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-vnet-integration) | Your function app is created in a virtual network with full access to resources in that network. Inbound and outbound access to your function app isn't restricted. For more information, see [Virtual network integration](functions-networking-options.md#virtual-network-integration). |
| [Create a function app that accesses a secured storage account](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-storage-private-endpoints) | Your created function app uses a secured storage account, which Functions accesses by using private endpoints. For more information, see [Restrict your storage account to a virtual network](configure-networking-how-to.md#restrict-your-storage-account-to-a-virtual-network). |
| [Create a function app and storage account that both use private endpoints](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-private-endpoints-storage-private-endpoints) | Your created function app can only be accessed by using private endpoints, and it uses private endpoints to access storage resources. For more information, see [Private endpoints](functions-networking-options.md#private-endpoints). |

::: zone-end  
::: zone pivot="premium-plan,dedicated-plan" 
### Restricted network settings

You might also need to use these settings when your function app has network restrictions:

| Setting | Value |  Description |
| ---- |  ---- | ---- |
| [`WEBSITE_CONTENTOVERVNET`](functions-app-settings.md#website_contentovervnet) | `1` | Application setting that enables your function app to scale when the storage account is restricted to a virtual network. For more information, see [Restrict your storage account to a virtual network](functions-networking-options.md#restrict-your-storage-account-to-a-virtual-network).|
| [`vnetrouteallenabled`](functions-app-settings.md#vnetrouteallenabled) | `1` | Site setting that forces all traffic from the function app to use the virtual network. For more information, see [Regional virtual network integration](functions-networking-options.md#regional-virtual-network-integration). This site setting supersedes the application setting [`WEBSITE_VNET_ROUTE_ALL`](./functions-app-settings.md#website_vnet_route_all). |

::: zone-end   
::: zone pivot="flex-consumption-plan,premium-plan,dedicated-plan" 
### Considerations for network restrictions

When you're restricting access to the storage account through the private endpoints, you aren't able to access the storage account through the portal or any device outside the virtual network. You can give access to your secured IP address or virtual network in the storage account by [Managing the default network access rule](../storage/common/storage-network-security.md#change-the-default-network-access-rule).
::: zone-end
## Function access keys

Host-level [function access keys](function-keys-how-to.md) are defined as Azure resources. This means that you can create and manage host keys in your ARM templates and Bicep files. A host key is defined as a resource of type `Microsoft.Web/sites/host/functionKeys`. This example creates a host-level access key named `my_custom_key` when the function app is created:

### [Bicep](#tab/bicep)

```bicep
resource functionKey 'Microsoft.Web/sites/host/functionKeys@2022-09-01' = {
  name: '${parameters('name')}/default/my_custom_key'
  properties: {
    name: 'my_custom_key'
  }
  dependsOn: [
    resourceId('Microsoft.Web/Sites', parameters('name'))
  ]
}
```

### [ARM template](#tab/json)

```json
{  
	"type": "Microsoft.Web/sites/host/functionKeys",
	"apiVersion": "2022-09-01",
	"name": "[concat(parameters('name'), '/default/my_custom_key')]",
	"properties": {
		"name": "my_custom_key"
	},
	"dependsOn": [
		"[resourceId('Microsoft.Web/Sites', parameters('name'))]"
	]
}
```

---

In this example, the `name` parameter is the name of the new function app. You must include a `dependsOn` setting to guarantee that the key is created with the new function app. Finally, the `properties` object of the host key can also include a `value` property that can be used to set a specific key. 

When you don't set the `value` property, Functions automatically generates a new key for you when the resource is created, which is recommended. To learn more about access keys, including security best practices for working with access keys, see [Work with access keys in Azure Functions](function-keys-how-to.md). 

## Create your template

Experts with Bicep or ARM templates can manually code their deployments using a simple text editor. For the rest of us, there are several ways to make the development process easier:

+ **Visual Studio Code**: There are extensions available to help you work with both [Bicep files](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) and [ARM templates](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools). You can use these tools to help make sure that your code is correct, and they provide some [basic validation](functions-infrastructure-as-code.md?tabs=vs-code#validate-your-template).

+ **Azure portal**: When you [create your function app and related resources in the portal](./functions-create-function-app-portal.md), the final **Review + create** screen has a **Download a template for automation** link. 

    :::image type="content" source="media/functions-infrastructure-as-code/portal-download-template.png" alt-text="Download template link from the Azure Functions creation process in the Azure portal.":::
    
    This link shows you the ARM template generated based on the options you chose in portal. This template can seem a bit complex when you're creating a function app with many new resources. However, it can provide a good reference for how your ARM template might look.   
 
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

### [Bicep](#tab/bicep)

- [Azure CLI](../azure-resource-manager/bicep/deploy-cli.md)
- [PowerShell](../azure-resource-manager/bicep/deploy-powershell.md)

### [ARM template](#tab/json)

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

The following PowerShell commands create a resource group and deploy a Bicep file or ARM template that creates a function app with its required resources. To run locally, you must have [Azure PowerShell](/powershell/azure/install-azure-powershell) installed. To sign in to Azure, you must first run [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount).

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

---

To test out this deployment, you can use a [template like this one](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/function-app-create-dynamic) that creates a function app on Windows in a Consumption plan.

## Next steps

Learn more about how to develop and configure Azure Functions.

- [Azure Functions developer reference](functions-reference.md)
- [How to configure Azure function app settings](functions-how-to-use-azure-function-app-settings.md)
- [Create your first Azure function](functions-get-started.md)

<!-- LINKS -->

[Function app on Azure App Service plan]: https://azure.microsoft.com/resources/templates/function-app-create-dedicated/
