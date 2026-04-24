---
title: Automate function app resource deployment to Azure
description: Learn how to build, validate, and use a Bicep file or an Azure Resource Manager template to deploy your function app and related Azure resources.
ms.assetid: d20743e3-aab6-442c-a836-9bcea09bfd32
ms.topic: how-to
ms.date: 04/21/2026
ms.custom: fasttrack-edit, devx-track-bicep, devx-track-arm-template, linux-related-content, ignite-2024
zone_pivot_groups: functions-hosting-plan
---

# Automate resource deployment for your function app in Azure Functions

To automate deploying your function app, use a Bicep file or an Azure Resource Manager template (ARM template). During deployment, you can use existing Azure resources or create new ones.  

By using deployment automation, both infrastructure as code (IaC) and continuous integration and deployment (CI/CD), you can bring these benefits to your production apps:

+ **Consistency**: Define your infrastructure in code to ensure consistent deployments across environments.
+ **Version Control**: Track changes to your infrastructure and application configurations in source control, along with your project code.
+ **Automation**: Automate deployment, which reduces manual errors and shortens the release process.
+ **Scalability**: Easily replicate infrastructure for multiple environments, such as development, testing, and production.
+ **Disaster Recovery**: Quickly recreate infrastructure after failures or during migrations.

This article shows you how to automate the creation of Azure resources and deployment configurations for Azure Functions. To learn more about continuous deployment of your project code, see [Continuous deployment for Azure Functions](functions-continuous-deployment.md). 

The template code to create the required Azure resources depends on the desired hosting options for your function app. This article supports the following hosting options:

| Hosting option | Deployment type | Sample templates |
| ----- | ----- | ----- |
| [Flex Consumption plan](./flex-consumption-plan.md) | Code-only | [Bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.web/function-app-flex-managed-identities/main.bicep)<br/>[ARM template](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.web/function-app-flex-managed-identities/azuredeploy.json)<br/>[Terraform](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/tree/main/IaC/terraformazurerm) |
| [Premium plan](./functions-premium-plan.md) | Code \| Container | [Bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-premium-plan/main.bicep)<br/>[ARM template](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-premium-plan/azuredeploy.json) |
| [Dedicated plan](./dedicated-plan.md) | Code \| Container | [Bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-dedicated-plan/main.bicep)<br/>[ARM template](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-dedicated-plan/azuredeploy.json) |
| [Azure Container Apps](../container-apps/functions-overview.md) | Container-only | [Bicep](https://github.com/Azure/azure-functions-on-container-apps/tree/main/samples/ACAKindfunctionapp)|
| [Consumption plan](consumption-plan.md)(legacy) | Code-only | [Bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-windows-consumption/main.bicep)<br/>[ARM template](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-windows-consumption/azuredeploy.json) |

For new serverless function apps, use the Flex Consumption plan. <br/>The Consumption plan is a legacy hosting plan. For existing apps, [migrate to the Flex Consumption plan](migration/migrate-plan-consumption-to-flex.md).

Make sure to select your hosting plan at the top of the article.
::: zone pivot="consumption-plan"  
[!INCLUDE [functions-linux-consumption-retirement](../../includes/functions-linux-consumption-retirement.md)]
::: zone-end  

When using this article, keep these considerations in mind:

+ There's no canonical way to structure an ARM template.
 
+ You can modularize a Bicep deployment into multiple Bicep files and [Azure Verified Modules (AVMs)](https://azure.github.io/Azure-Verified-Modules/overview/introduction/). 

+ This article assumes that you have a basic understanding of [creating Bicep files](../azure-resource-manager/bicep/file.md) or [authoring Azure Resource Manager templates](../azure-resource-manager/templates/syntax.md). 
::: zone pivot="premium-plan,dedicated-plan,consumption-plan"  
+ Examples are shown as individual sections for specific resources. For a broad set of complete Bicep file and ARM template examples, see [these function app deployment examples](/samples/browse/?expanded=azure&terms=%22azure%20functions%22&products=azure-resource-manager). 
::: zone-end  
::: zone pivot="flex-consumption-plan"  
+ Examples are shown as individual sections for specific resources. For Bicep, [Azure Verified Modules (AVM)](https://azure.github.io/Azure-Verified-Modules/) are shown, when available. For a broad set of complete Bicep file and ARM template examples, see [these Flex Consumption app deployment examples](/samples/browse/?expanded=azure&terms=%22azure%20functions%20flex%22&products=azure-resource-manager). 
::: zone-end  
::: zone pivot="container-apps"  
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
| A [managed environment](../container-apps/functions-overview.md#) | Required | [Microsoft.App/managedEnvironments](/azure/templates/microsoft.app/managedenvironments) |
| A [function app](#create-the-function-app) | Required | [Microsoft.Web/sites](/azure/templates/microsoft.web/sites)  |
::: zone-end  
<sup>*</sup>If you don't already have a Log Analytics Workspace that your Application Insights instance can use, you also need to create this resource.   

When you deploy multiple resources in a single Bicep file or ARM template, the order in which resources are created is important. This requirement results from dependencies between resources. For such dependencies, make sure to use the `dependsOn` element to define the dependency in the dependent resource. For more information, see either [Define the order for deploying resources in ARM templates](../azure-resource-manager/templates/resource-dependency.md) or [Resource dependencies in Bicep](../azure-resource-manager/bicep/resource-dependencies.md). 

## Prerequisites  

+ These examples work in the context of an existing resource group.
+ Both Application Insights and storage logs require an existing [Azure Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-overview). You can share workspaces between services. To improve performance, create a workspace in each geographic region. For an example of how to create a Log Analytics workspace, see [Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace?tabs=azure-resource-manager#create-a-workspace). You can find the fully qualified workspace resource ID on a workspace page in the [Azure portal](https://portal.azure.com) under **Settings** > **Properties** > **Resource ID**. 
::: zone pivot="container-apps" 
+ This article assumes that you already created a [managed environment](../container-apps/environment.md) in Azure Container Apps. You need both the name and the ID of the managed environment to create a function app hosted on Container Apps.  
::: zone-end  
<a name="storage"></a>
## Create storage account

All function apps require an Azure storage account. You need a general-purpose account that supports blobs, tables, queues, and files. For more information, see [Azure Functions storage account requirements](storage-considerations.md#storage-account-requirements).

[!INCLUDE [functions-storage-access-note](../../includes/functions-storage-access-note.md)]

This example section creates a Standard general-purpose v2 storage account: 

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
    minimumTlsVersion: 'TLS1_2'
  }
}
```
::: zone pivot="premium-plan,dedicated-plan,consumption-plan"
For more context, see the complete [main.bicep](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/main.bicep#L37) file in the templates repository.
::: zone-end  
::: zone pivot="flex-consumption-plan"
For more context, see the complete [storage-PrivateEndpoint.bicep](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd/blob/main/infra/app/storage-PrivateEndpoint.bicep) file in the sample repository.
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
      "allowBlobPublicAccess": false,
      "minimumTlsVersion": "TLS1_2"
    }
  }
]
```

For more context, see the complete [azuredeploy.json](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-linux-consumption/azuredeploy.json#L77) file in the templates repository.

---

The function app needs a connection to this storage account. Configure this connection by using the `AzureWebJobsStorage` setting. For more information, see [Application configuration](#application-configuration).
::: zone pivot="flex-consumption-plan"

> [!TIP]
> For better security, add `allowSharedKeyAccess: false` to your storage account properties and use managed identity-based connections instead of connection strings. The Flex Consumption plan examples in this article use this approach, including the `AzureWebJobsStorage__*` identity-based settings and a system-assigned managed identity. For more information, see [Connecting to host storage with an identity](./functions-reference.md#connecting-to-host-storage-with-an-identity).

::: zone-end
::: zone pivot="dedicated-plan"

> [!TIP]
> For better security, set `allowSharedKeyAccess` to `false` on your storage account and use managed identity-based connections instead of connection strings. For more information, see [Connecting to host storage with an identity](./functions-reference.md#connecting-to-host-storage-with-an-identity).

::: zone-end
::: zone pivot="premium-plan,consumption-plan"

> [!IMPORTANT]
> The Elastic Premium and Consumption plans use Azure Files for content sharing, and Azure Files doesn't currently support managed identity-based connections. This limitation means these plans require shared key access to the storage account, so don't set `allowSharedKeyAccess` to `false`. When you must use connection strings, store them in Azure Key Vault and use [Key Vault references](../app-service/app-service-key-vault-references.md) in your app settings instead of storing keys directly. If you want to remove the Azure Files dependency, see [Create an app without Azure Files](./storage-considerations.md#create-an-app-without-azure-files).

::: zone-end
::: zone pivot="flex-consumption-plan"  
### Deployment container

To deploy to an app running in the Flex Consumption plan, you need a container in Azure Blob Storage as the deployment source. You can use either the default storage account or specify a separate storage account. For more information, see [Configure deployment settings](flex-consumption-how-to.md#configure-deployment-settings). 

You must configure this deployment account when you create your app, including the specific container used for deployments. To learn more about configuring deployments, see [Deployment sources](#deployment-sources).

This example shows how to create a container in the storage account:

### [Bicep](#tab/bicep)

:::code language="bicep" source="~/function-flex-consumption/IaC/bicep/main.bicep" range="124-146" highlight="137'139" ::: 

This example shows how to use the [AVM for storage accounts](https://github.com/Azure/bicep-registry-modules/tree/main/avm/res/storage/storage-account) to create the blob storage container along with the storage account. For the snippet in context, see [this deployment example](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/bicep/main.bicep#L133).

### [ARM template](#tab/json)

:::code language="json" source="~/function-flex-consumption/IaC/armtemplate/azuredeploy.json" range="129-139" :::

For the snippet in context, see [this deployment example](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/armtemplate/azuredeploy.json#L121).

---

[Configure other deployment settings with the app itself](#deployment-sources). 

::: zone-end  
### Enable storage logs

Because the storage account is used for important function app data, monitor the account for modification of that content. To monitor your storage account, configure Azure Monitor resource logs for Azure Storage. In this example section, a Log Analytics workspace named `myLogAnalytics` is used as the destination for these logs. 

#### [Bicep](#tab/bicep)

```bicep
resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' existing = {
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

You can use the same workspace for the Application Insights resource defined later. For more information, including how to work with these logs, see [Monitoring Azure Storage](../storage/blobs/monitor-blob-storage.md).

## Create Application Insights

Use Application Insights for monitoring your function app executions. Application Insights now requires an Azure Log Analytics workspace, which can be shared. These examples assume you're using an existing workspace and have the fully qualified resource ID for the workspace. For more information, see [Azure Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-overview). 

In this example section, define the Application Insights resource with the type `Microsoft.Insights/components` and the kind `web`:

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

You must provide the connection to the function app by using the [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string) application setting. For more information, see [Application configuration](#application-configuration).

The examples in this article get the connection string value for the created instance. Older versions might instead use [`APPINSIGHTS_INSTRUMENTATIONKEY`](functions-app-settings.md#appinsights_instrumentationkey) to set the instrumentation key, which is no longer recommended. 

::: zone pivot="flex-consumption-plan,premium-plan,dedicated-plan"  
## Create the hosting plan

You must explicitly define the hosting plan for apps hosted in an Azure Functions [Flex Consumption plan](./flex-consumption-plan.md), [Premium plan](./functions-premium-plan.md), or [Dedicated (App Service) plan](./dedicated-plan.md). 
::: zone-end  
::: zone pivot="flex-consumption-plan"  
Flex Consumption is a Linux-based hosting plan that builds on the Consumption _pay for what you use_ serverless billing model. The plan features support for private networking, instance memory size selection, and improved managed identity support.

A Flex Consumption plan is a special type of `serverfarm` resource. You can specify it by using `FC1` for the `Name` property value in the `sku` property with a `tier` value of `FlexConsumption`. 

This example section creates a Flex Consumption plan:

### [Bicep](#tab/bicep)

:::code language="bicep" source="~/function-flex-consumption/IaC/bicep/main.bicep" range="149-163" ::: 

This example uses the [AVM for App Service plans](https://github.com/Azure/bicep-registry-modules/tree/main/avm/res/web/serverfarm). For the snippet in context, see [this deployment example](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/bicep/main.bicep#L156).

### [ARM template](#tab/json)

:::code language="json" source="~/function-flex-consumption/IaC/armtemplate/azuredeploy.json" range="140-154" :::

For more context, see the complete [azuredeploy.json](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/armtemplate/azuredeploy.json#L140) file in the templates repository.

---   

Because the Flex Consumption plan currently only supports Linux, you must also set the `reserved` property to `true`.
::: zone-end  
::: zone pivot="premium-plan" 
The Premium plan offers the same scaling as the Consumption plan but includes dedicated resources and extra capabilities. To learn more, see [Azure Functions Premium Plan](functions-premium-plan.md).

A Premium plan is a special type of `serverfarm` resource. You can specify it by using either `EP1`, `EP2`, or `EP3` for the `Name` property value in the `sku` property. The way that you define the Functions hosting plan depends on whether your function app runs on Windows or on Linux. This example section creates an `EP1` plan: 

### [Windows](#tab/windows/bicep)

```bicep
resource hostingPlan 'Microsoft.Web/serverfarms@2024-04-01' = {
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
    "apiVersion": "2024-04-01",
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

To run your app on Linux, set the `"reserved": true` property for the `serverfarms` resource:

```bicep
resource hostingPlan 'Microsoft.Web/serverfarms@2024-04-01' = {
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

To run your app on Linux, set the `"reserved": true` property for the `serverfarms` resource:

```json
"resources": [
  {
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2024-04-01",
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
In the Dedicated (App Service) plan, your function app runs on dedicated virtual machines on Basic, Standard, and Premium SKUs in App Service plans, similar to web apps. For more information, see [Dedicated plan](./dedicated-plan.md).

For a sample Bicep file/Azure Resource Manager template, see [Function app on Azure App Service plan].

In Functions, the Dedicated plan is just a regular App Service plan, which is defined by a `serverfarm` resource. You must provide at least the `name` value. For a list of supported plan names, see the `--sku` setting in [`az appservice plan create`](/cli/azure/appservice/plan#az-appservice-plan-create) for the current list of supported values for a Dedicated plan. 

The way that you define the hosting plan depends on whether your function app runs on Windows or on Linux: 

### [Windows](#tab/windows/bicep)

```bicep
resource hostingPlanName 'Microsoft.Web/serverfarms@2024-04-01' = {
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
    "apiVersion": "2024-04-01",
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
resource hostingPlan 'Microsoft.Web/serverfarms@2024-04-01' = {
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
    "apiVersion": "2024-04-01",
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

You don't need to explicitly define a Consumption hosting plan resource. When you skip this resource definition, the portal automatically creates or selects a plan on a per-region basis when you create the function app resource itself.

You can explicitly define a Consumption plan as a special type of `serverfarm` resource. Set the `computeMode` and `sku` properties to `Dynamic`. This example section shows you how to explicitly define a consumption plan. The way that you define a hosting plan depends on whether your function app runs on Windows or on Linux. 

### [Windows](#tab/windows/bicep)

```bicep
resource hostingPlan 'Microsoft.Web/serverfarms@2024-04-01' = {
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
    "apiVersion": "2024-04-01",
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

To run your app on Linux, set the property `"reserved": true` for the `serverfarms` resource:

```bicep
resource hostingPlan 'Microsoft.Web/serverfarms@2024-04-01' = {
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

To run your app on Linux, set the property `"reserved": true` for the `serverfarms` resource:

```json
"resources": [
  {
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2024-04-01",
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

## Create the function app

Define the function app resource as a resource of type `Microsoft.Web/sites` with a `kind` property that includes `functionapp`.
::: zone pivot="consumption-plan,premium-plan,dedicated-plan"
The way you define a function app resource depends on whether you're hosting on Linux or on Windows:
::: zone-end
::: zone pivot="consumption-plan,premium-plan"
### [Windows](#tab/windows)

For a list of application settings required when running on Windows, see [Application configuration](#application-configuration). For a sample Bicep file or Azure Resource Manager template, see the [function app hosted on Windows in a Consumption plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-windows-consumption) template. 

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

:::code language="bicep" source="~/function-flex-consumption/IaC/bicep/main.bicep" range="166-215" ::: 

This example uses the [AVM for function apps](https://github.com/Azure/bicep-registry-modules/tree/main/avm/res/web/serverfarm). For the snippet in context, see [this deployment example](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/bicep/main.bicep#L173).

### [ARM template](#tab/json)

:::code language="json" source="~/function-flex-consumption/IaC/armtemplate/azuredeploy.json" range="155-203" :::

For more context, see the complete [azuredeploy.json](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/armtemplate/azuredeploy.json#L155) file in the templates repository.

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
resource functionAppName_resource 'Microsoft.Web/sites@2024-04-01' = {
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
          value: '~20'
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
    "apiVersion": "2024-04-01",
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
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', parameters('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2023-05-01').keys[0].value)]"
          },
          {
            "name": "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', parameters('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2023-05-01').keys[0].value)]"
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
            "value": "~20"
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
resource functionApp 'Microsoft.Web/sites@2024-04-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp,linux'
  properties: {
    reserved: true
    serverFarmId: hostingPlan.id
    siteConfig: {
      linuxFxVersion: 'node|20'
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
    "apiVersion": "2024-04-01",
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
        "linuxFxVersion": "node|20",
        "appSettings": [
          {
            "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').ConnectionString]"
          },
          {
            "name": "AzureWebJobsStorage",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', parameters('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2023-05-01').keys[0].value)]"
          },
          {
            "name": "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', parameters('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2023-05-01').keys[0].value)]"
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
resource functionApp 'Microsoft.Web/sites@2024-04-01' = {
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
          value: '~20'
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
    "apiVersion": "2024-04-01",
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
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', parameters('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2023-05-01').keys[0].value)]"
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
            "value": "~20"
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
resource functionApp 'Microsoft.Web/sites@2024-04-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp,linux'
  properties: {
    reserved: true
    serverFarmId: hostingPlan.id
    siteConfig: {
      alwaysOn: true
      linuxFxVersion: 'node|20'
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
    "apiVersion": "2024-04-01",
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
        "linuxFxVersion": "node|20",
        "appSettings": [
          {
            "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
            "value": "[reference(resourceId('Microsoft.Insights/components', parameters('applicationInsightsName')), '2020-02-02').ConnectionString]"
          },
          {
            "name": "AzureWebJobsStorage",
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', parameters('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2023-05-01').keys[0].value)]"
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
::: zone pivot="container-apps"  
Use the [`linuxFxVersion`](./functions-app-settings.md#linuxfxversion) site setting to request a specific Linux container to deploy to your app when you create it. To access images in a private repository, you need more settings. For more information, see [Application configuration](#application-configuration).    

[!INCLUDE [functions-linux-custom-container-note](../../includes/functions-linux-custom-container-note.md)]
::: zone-end
::: zone pivot="dedicated-plan,premium-plan"  
Your Bicep file or ARM template can optionally also define a deployment for your function code. This deployment can include these methods:

+ [Zip deployment package](./deployment-zip-push.md)
+ [Linux container](./functions-how-to-custom-container.md) 
::: zone-end  
::: zone pivot="flex-consumption-plan"  
The Flex Consumption plan maintains your project code in a zip-compressed package file in a blob storage container known as the _deployment container_. You can configure both the storage account and container used for deployment. For more information, see [Deployment](flex-consumption-plan.md#deployment). 

You must use _[one deploy](functions-deployment-technologies.md#one-deploy)_ to publish your code package to the deployment container. During an ARM template or Bicep deployment, you can do this step by [defining a package source](#deployment-package) that uses the `/onedeploy` extension. If you choose to instead directly upload your package to the container, the package isn't automatically deployed.

### Deployment container

Set the specific storage account and container used for deployments, the authentication method, and credentials in the `functionAppConfig.deployment.storage` element of the `properties` for the site. The container and any application settings must exist when you create the app. For an example of how to create the storage container, see [Deployment container](#deployment-container).

This example uses a system assigned managed identity to access the specified blob storage container, which is created elsewhere in the deployment:

### [Bicep](#tab/bicep)

:::code language="bicep" source="~/function-flex-consumption/IaC/bicep/main.bicep" range="178-196" highlight="179-186"::: 

This example uses the [AVM for function apps](https://github.com/Azure/bicep-registry-modules/tree/main/avm/res/web/site). For the snippet in context, see [this deployment example](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/bicep/main.bicep#L185).

### [ARM template](#tab/json)

:::code language="json" source="~/function-flex-consumption/IaC/armtemplate/azuredeploy.json" range="166-174" :::

---

When you use managed identities, you must also enable the function app to access the storage account by using the identity, as shown in this example:

 ### [Bicep](#tab/bicep)

:::code language="bicep" source="~/function-flex-consumption/IaC/bicep/rbac.bicep" range="42-52" ::: 

This example uses the [AVM for resource-scoped role assignment](https://github.com/Azure/bicep-registry-modules/tree/main/avm/ptn/authorization/resource-role-assignment). For the snippet in context, see [this deployment example](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/bicep/rbac.bicep#L45).

### [ARM template](#tab/json)

:::code language="json" source="~/function-flex-consumption/IaC/armtemplate/azuredeploy.json" range="204-218" :::

For a complete reference example, see [this ARM template](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/IaC/armtemplate/azuredeploy.json).

---

This example requires you to know the GUID value for the role you're assigning. To get this ID value for any friendly role name, use the [az role definition list](/cli/azure/role/definition#az-role-definition-list) command, as shown in this example: 

```azure-cli
az role definition list --output tsv --query "[?roleName=='Storage Blob Data Owner'].{name:name}"
```

When you use a connection string instead of managed identities, set the `authentication.type` to `StorageAccountConnectionString` and set `authentication.storageAccountConnectionStringName` to the name of the application setting that contains the deployment storage account connection string.  

### Deployment package

The Flex Consumption plan uses _one deploy_ for deploying your code project. The code package itself is the same as the package you use for zip deployment in other Functions hosting plans. However, the name of the package file must be `released-package.zip`. 

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
Your Bicep file or ARM template can optionally also define a deployment for your function code by using a [zip deployment package](./deployment-zip-push.md).  
::: zone-end  
::: zone pivot="dedicated-plan,premium-plan,consumption-plan" 
To successfully deploy your application by using Azure Resource Manager, you need to understand how resources are deployed in Azure. In most examples, you apply top-level configurations by using `siteConfig`. Set these configurations at a top level, because they convey information to the Functions runtime and deployment engine. The deployment engine requires top-level information before it applies the child `sourcecontrols/web` resource. Although you can configure these settings in the child-level `config/appSettings` resource, in some cases your function app must be deployed _before_ `config/appSettings` is applied. 

## Zip deployment package

Zip deployment is the recommended way to deploy your function app code. By default, functions that use zip deployment run in the deployment package itself. For more information, including the requirements for a deployment package, see [Zip deployment for Azure Functions](deployment-zip-push.md). When using resource deployment automation, you can reference the .zip deployment package in your Bicep or ARM template. 

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

resource functionAppName_ZipDeploy 'Microsoft.Web/sites/extensions@2024-04-01' = {
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
      "apiVersion": "2024-04-01",
      "location": "[parameters('location')]",
      "properties": {
        "packageUri": "[parameters('packageUri')]"
      }
    }
  ]
}
```
---

Keep the following considerations in mind when including zip deployment resources in your template:
::: zone-end
::: zone pivot="consumption-plan"  
+ Consumption plans on Linux don't support `WEBSITE_RUN_FROM_PACKAGE = 1`. You must instead set the URI of the deployment package directly in the `WEBSITE_RUN_FROM_PACKAGE` setting. For more information, see [WEBSITE\_RUN\_FROM\_PACKAGE](functions-app-settings.md#website_run_from_package). For an example template, see [Function app hosted on Linux in a Consumption plan](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-linux-consumption).
::: zone-end  
::: zone pivot="dedicated-plan,premium-plan,consumption-plan"  
+ The `packageUri` must be a location that Functions can access. Consider using Azure Blob storage with a shared access signature (SAS). After the SAS expires, Functions can no longer access the share for deployments. When you regenerate your SAS, remember to update the `WEBSITE_RUN_FROM_PACKAGE` setting with the new URI value.

+ When setting `WEBSITE_RUN_FROM_PACKAGE` to a URI, you must [manually sync triggers](functions-deployment-technologies.md#trigger-syncing).

+ Always set all required application settings in the `appSettings` collection when adding or updating settings. The update removes existing settings that you don't explicitly set. For more information, see [Application configuration](#application-configuration). 

+ Functions doesn't support Web Deploy (`msdeploy`) for package deployments. You must instead use zip deployment in your deployment pipelines and automation. For more information, see [Zip deployment for Azure Functions](deployment-zip-push.md).

## Remote builds

The deployment process assumes that the .zip file you use or a zip deployment contains a ready-to-run app. This assumption means that by default no customizations are run. 

Some scenarios require you to rebuild your app remotely. One example is when you need to include Linux-specific packages in Python or Node.js apps that you developed on a Windows computer. In this case, you can configure Functions to perform a remote build on your code after the zip deployment. 

The way that you request a remote build depends on the operating system to which you're deploying:

### [Windows](#tab/windows)

When you deploy an app to Windows, the deployment process runs language-specific commands, like `dotnet restore` for C# apps or `npm install` for Node.js apps.

To enable the same build processes that you get with continuous integration, add `SCM_DO_BUILD_DURING_DEPLOYMENT=true` to your application settings in your deployment code and remove the `WEBSITE_RUN_FROM_PACKAGE` setting entirely.

### [Linux](#tab/linux)

To enable the same build processes that you get with continuous integration, add `SCM_DO_BUILD_DURING_DEPLOYMENT=true` to your application settings in your deployment code and remove the `WEBSITE_RUN_FROM_PACKAGE` setting entirely.

The `ENABLE_ORYX_BUILD` setting is set to `true` by default. If you have problems building a .NET or Java function app, set it to `false`. 

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
resource functionApp 'Microsoft.Web/sites@2024-04-01' = {
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
          value: '~20'
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
    "apiVersion": "2024-04-01",
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
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}', parameters('storageAccountName'), listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2023-05-01').keys[0].value)]"
          },
          {
            "name": "FUNCTIONS_WORKER_RUNTIME",
            "value": "node"
          },
          {
            "name": "WEBSITE_NODE_DEFAULT_VERSION",
            "value": "~20"
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
When deploying [containerized functions to Azure Container Apps](../container-apps/functions-overview.md), your template must:

+ Set the `kind` field to a value of `functionapp,linux,container,azurecontainerapps`. 
+ Set the `managedEnvironmentId` site property to the fully qualified URI of the Container Apps environment. 
+ Add a resource link in the site's `dependsOn` collection when creating a `Microsoft.App/managedEnvironments` resource at the same time as the site. 

The definition of a containerized function app deployed from a private container registry to an existing Container Apps environment might look like this example:

### [Bicep](#tab/bicep)

```bicep
resource functionApp 'Microsoft.Web/sites@2024-04-01' = {
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
    "apiVersion": "2024-04-01",
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
            "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}', parameters('storageAccountName'), listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2023-05-01').keys[0].value)]"
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

## Application configuration
::: zone pivot="flex-consumption-plan"   
In a Flex Consumption plan, you configure your function app in Azure with two types of properties: 

| Configuration | `Microsoft.Web/sites` property |  
| ---- | ---- |
| Application configuration | `functionAppConfig` |
| Application settings | `siteConfig.appSettings` collection |

You maintain these application configurations in `functionAppConfig`:

| Behavior | Setting in `functionAppConfig`| 
| --- | --- |
| [Always ready instances](flex-consumption-plan.md#always-ready-instances) |  `scaleAndConcurrency.alwaysReady`  |
| [Deployment source](#deployment-sources) | `deployment` |
| [Instance size](flex-consumption-plan.md#instance-sizes) | `scaleAndConcurrency.instanceMemoryMB` |
| [HTTP trigger concurrency](functions-concurrency.md#http-trigger-concurrency) | `scaleAndConcurrency.triggers.http.perInstanceConcurrency` |
| [Language runtime](functions-app-settings.md#functions_worker_runtime) | `runtime.name` |
| [Language version](supported-languages.md) | `runtime.version` |
| [Maximum instance count](event-driven-scaling.md#flex-consumption-plan) | `scaleAndConcurrency.maximumInstanceCount` |
| [Site update strategy](flex-consumption-site-updates.md) | `siteUpdateStrategy.type` |

The Flex Consumption plan also supports these application settings:

+ Connection string-based settings:
    + [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string)
    + [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage)
+ Managed identity-based settings:
    + [`APPLICATIONINSIGHTS_AUTHENTICATION_STRING`](functions-app-settings.md#applicationinsights_authentication_string)
    + [`AzureWebJobsStorage__accountName`](functions-app-settings.md#azurewebjobsstorage__accountname)

::: zone-end  
::: zone pivot="consumption-plan,premium-plan,dedicated-plan,container-apps"  
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
::: zone pivot="dedicated-plan,premium-plan,container-apps"  
These site settings are required only when using managed identities to get the image from an Azure Container Registry instance:

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
::: zone pivot="container-apps"  
These application settings are required for container deployments:
 
+ [`APPLICATIONINSIGHTS_CONNECTION_STRING`](functions-app-settings.md#applicationinsights_connection_string)
+ [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage)
+ [`FUNCTIONS_EXTENSION_VERSION`](functions-app-settings.md#functions_extension_version)
 
[!INCLUDE [functions-arm-linux-container](../../includes/functions-arm-linux-container.md)]
::: zone-end 

Keep these considerations in mind when working with site and application settings using Bicep files or ARM templates:
::: zone pivot="flex-consumption-plan"   
+ The optional `alwaysReady` setting contains an array of one or more `{name,instanceCount}` objects, with one for each [per-function scale group](flex-consumption-plan.md#per-function-scaling). These scale groups make always-ready scale decisions. This example sets always-ready counts for both the `http` group and a single function named `helloworld`, which is of a nongrouped trigger type:
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
+ Consider when to set `WEBSITE_CONTENTSHARE` in an automated deployment. For detailed guidance, see the [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare) reference. 
::: zone-end
::: zone pivot="container-apps,premium-plan,dedicated-plan"  
+ For container deployments, also set [`WEBSITES_ENABLE_APP_SERVICE_STORAGE`](../app-service/reference-app-settings.md#custom-containers) to `false`, since your app content is provided in the container itself. 
::: zone-end  
+ Always define your application settings as a `siteConfig/appSettings` collection of the `Microsoft.Web/sites` resource you're creating, as shown in the examples in this article. This definition guarantees the settings your function app needs to run are available on initial startup.

+ When adding or updating application settings by using templates, make sure that you include all existing settings with the update. You must do this because the underlying update REST API calls replace the entire `/config/appsettings` resource. If you remove the existing settings, your function app won't run. To programmatically update individual application settings, you can instead use the Azure CLI, Azure PowerShell, or the Azure portal to make these changes. For more information, see [Work with application settings](functions-how-to-use-azure-function-app-settings.md#settings).

+ When possible, use managed identity-based connections to other Azure services, including the `AzureWebJobsStorage` connection. For more information, see [Configure an identity-based connection](functions-reference.md#configure-an-identity-based-connection).
::: zone pivot="consumption-plan,premium-plan,dedicated-plan" 
## Slot deployments

Functions lets you deploy different versions of your code to unique endpoints in your function app. This option makes it easier to develop, validate, and deploy functions updates without impacting functions running in production. Deployment slots is a feature of Azure App Service. The number of slots available [depends on your hosting plan](./functions-scale.md#service-limits). For more information, see [Azure Functions deployment slots](functions-deployment-slots.md). 

You define a slot resource in the same way as a function app resource (`Microsoft.Web/sites`), but instead you use the `Microsoft.Web/sites/slots` resource identifier. For an example deployment (in both Bicep and ARM templates) that creates both a production and a staging slot in a Premium plan, see [Azure Function App with a Deployment Slot](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-deployment-slot). 

To learn about how to swap slots by using templates, see [Automate with Resource Manager templates](../app-service/deploy-staging-slots.md#automate-with-resource-manager-templates).

Keep the following considerations in mind when working with slot deployments:

+  Don't explicitly set the `WEBSITE_CONTENTSHARE` setting in the deployment slot definition. The app creation process in the deployment slot generates this setting for you. 

+ When you swap slots, some application settings are considered "sticky," in that they stay with the slot and not with the code being swapped. You can define such a _slot setting_ by including `"slotSetting":true` in the specific application setting definition in your template. For more information, see [Manage settings](functions-deployment-slots.md#manage-settings).
::: zone-end  
::: zone pivot="flex-consumption-plan,premium-plan,dedicated-plan" 
## Secured deployments

You can create your function app in a deployment where you secure one or more of the resources by integrating with virtual networks. A `Microsoft.Web/sites/networkConfig` resource defines virtual network integration for your function app. This integration depends on both the referenced function app and virtual network resources. Your function app might also depend on other private networking resources, such as private endpoints and routes. For more information, see [Azure Functions networking options](functions-networking-options.md). 
::: zone-end  
::: zone pivot="flex-consumption-plan" 
These projects provide Bicep-based examples of how to deploy your function apps in a virtual network, including with network access restrictions:

+ [High-scale HTTP triggered function connects to an event hub secured by a virtual network](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/README.md): An HTTP triggered function (.NET isolated worker mode) accepts calls from any source and then sends the body of those HTTP calls to a secure event hub running in a virtual network by using virtual network integration.
+ [Function is triggered by a Service Bus queue secured in a virtual network](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/blob/main/README.md): A Python function is triggered by a Service Bus queue secured in a virtual network. The queue is accessed in the virtual network using private endpoint. A virtual machine in the virtual network is used to send messages.  
::: zone-end   
::: zone pivot="premium-plan,dedicated-plan" 
When you create a deployment that uses a secured storage account, you must both explicitly set the `WEBSITE_CONTENTSHARE` setting and create the file share resource named in this setting. Make sure you create a `Microsoft.Storage/storageAccounts/fileServices/shares` resource by using the value of `WEBSITE_CONTENTSHARE`, as shown in this example ([ARM template](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-private-endpoints-storage-private-endpoints/azuredeploy.json#L467)|[Bicep file](https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-private-endpoints-storage-private-endpoints/main.bicep#L351)). You also need to set the site property `vnetContentShareEnabled` to true. 

> [!NOTE]
> When these settings aren't part of a deployment that uses a secured storage account, you see this error during deployment validation: `Could not access storage account using provided connection string`.

These projects provide both Bicep and ARM template examples of how to deploy your function apps in a virtual network, including with network access restrictions:

| Restricted scenario | Description |
| ---- | ---- |
| [Create a function app with virtual network integration](https://github.com/Azure-Samples/function-app-arm-templates/tree/main/function-app-vnet-integration) | You create your function app in a virtual network with full access to resources in that network. Inbound and outbound access to your function app isn't restricted. For more information, see [Virtual network integration](functions-networking-options.md#virtual-network-integration). |
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

When you restrict access to the storage account through the private endpoints, you can't access the storage account through the portal or any device outside the virtual network. You can give access to your secured IP address or virtual network in the storage account by [Managing the default network access rule](../storage/common/storage-network-security-set-default-access.md).
::: zone-end
## Function access keys

Define host-level [function access keys](function-keys-how-to.md) as Azure resources. This approach lets you create and manage host keys in your ARM templates and Bicep files. A host key is defined as a resource of type `Microsoft.Web/sites/host/functionKeys`. The following example creates a host-level access key named `my_custom_key` when the function app is created:

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

In this example, the `name` parameter is the name of the new function app. You must include a `dependsOn` setting to guarantee that the key is created with the new function app. Finally, the `properties` object of the host key can also include a `value` property that you can use to set a specific key. 

When you don't set the `value` property, Functions automatically generates a new key for you when the resource is created, which is recommended. To learn more about access keys, including security best practices for working with access keys, see [Work with access keys in Azure Functions](function-keys-how-to.md). 

## Create your template

Experts with Bicep or ARM templates can manually code their deployments by using a simple text editor. For the rest of us, several options make the development process easier:

+ **Visual Studio Code**: Extensions are available to help you work with both [Bicep files](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) and [ARM templates](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools). Use these tools to help make sure that your code is correct. They provide some [basic validation](functions-infrastructure-as-code.md?tabs=vs-code#validate-your-template).

+ **Azure portal**: When you [create your function app and related resources in the portal](./functions-create-function-app-portal.md), the final **Review + create** screen has a **Download a template for automation** link. 

    :::image type="content" source="media/functions-infrastructure-as-code/portal-download-template.png" alt-text="Download template link from the Azure Functions creation process in the Azure portal.":::
    
    This link shows you the ARM template generated based on the options you chose in portal. This template can seem a bit complex when you're creating a function app with many new resources. However, it can provide a good reference for how your ARM template might look.   
 
## Validate your template

When you manually create your deployment template file, it's important to validate your template before deployment. All deployment methods validate your template syntax and raise a `validation failed` error message as shown in the following JSON formatted example:

```json
{"error":{"code":"InvalidTemplate","message":"Deployment template validation failed: 'The resource 'Microsoft.Web/sites/func-xyz' is not defined in the template. Please see https://aka.ms/arm-template for usage details.'.","additionalInfo":[{"type":"TemplateViolation","info":{"lineNumber":0,"linePosition":0,"path":""}}]}}
```

Use the following methods to validate your template before deployment:

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

Use the [`az deployment group validate`](/cli/azure/deployment/group#az-deployment-group-validate) command to validate your template, as shown in the following example:

```azurecli-interactive
az deployment group validate --resource-group <resource-group-name> --template-file <template-file-location> --parameters functionAppName='<function-app-name>' packageUri='<zip-package-location>'
```

### [Visual Studio Code](#tab/vs-code)

In [Visual Studio Code](https://code.visualstudio.com/), install the latest [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) or [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools).

These extensions report syntactic errors in your code before deployment. For some examples of errors, see the [Fix validation error](../azure-resource-manager/troubleshooting/quickstart-troubleshoot-arm-deployment.md#fix-validation-error) section of the troubleshooting article.

---

You can also create a test resource group to find [preflight](../azure-resource-manager/troubleshooting/quickstart-troubleshoot-arm-deployment.md?tabs=azure-cli#fix-preflight-error) and [deployment](../azure-resource-manager/troubleshooting/quickstart-troubleshoot-arm-deployment.md?tabs=azure-cli#fix-deployment-error) errors.

## Deploy your template

Use any of the following methods to deploy your Bicep file and template:

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

### Deploy by using PowerShell

The following PowerShell commands create a resource group and deploy a Bicep file or ARM template that creates a function app with its required resources. To run the commands locally, you must have [Azure PowerShell](/powershell/azure/install-azure-powershell) installed. To sign in to Azure, first run [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount).

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

To test this deployment, use a [template like this one](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/function-app-create-dynamic) that creates a function app on Windows in a Consumption plan.

## Next steps

Learn more about how to develop and configure Azure Functions.

- [Azure Functions developer reference](functions-reference.md)
- [How to configure Azure function app settings](functions-how-to-use-azure-function-app-settings.md)
- [Create your first Azure function](functions-get-started.md)

<!-- LINKS -->

[Function app on Azure App Service plan]: https://azure.microsoft.com/resources/templates/function-app-create-dedicated/
