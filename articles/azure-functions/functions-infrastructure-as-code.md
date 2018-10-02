---
title: Automate resource deployment for a function app in Azure Functions | Microsoft Docs
description: Learn how to build an Azure Resource Manager template that deploys your function app.
services: Functions
documtationcenter: na
author: ggailey777
manager: jeconnoc
keywords: azure functions, functions, serverless architecture, infrastructure as code, azure resource manager

ms.assetid: d20743e3-aab6-442c-a836-9bcea09bfd32
ms.server: functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 05/25/2017
ms.author: glenga

---

# Automate resource deployment for your function app in Azure Functions

You can use an Azure Resource Manager template to deploy a function app. This article outlines the required resources and parameters for doing so. You might need to deploy additional resources, depending on the [triggers and bindings](functions-triggers-bindings.md) in your function app.

For more information about creating templates, see [Authoring Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md).

For sample templates, see:
- [Function app on Consumption plan]
- [Function app on Azure App Service plan]

## Required resources

A function app requires these resources:

* An [Azure Storage](../storage/index.yml) account
* A hosting plan (Consumption plan or App Service plan)
* A function app 

### Storage account

An Azure storage account is required for a function app. You need a general purpose account that supports blobs, tables, queues, and files. For more information, see [Azure Functions storage account requirements](functions-create-function-app-portal.md#storage-account-requirements).

```json
{
    "type": "Microsoft.Storage/storageAccounts",
    "name": "[variables('storageAccountName')]",
    "apiVersion": "2015-06-15",
    "location": "[resourceGroup().location]",
    "properties": {
        "accountType": "[parameters('storageAccountType')]"
    }
}
```

In addition, the property `AzureWebJobsStorage` must be specified as an app setting in the site configuration. If the function app doesn't use Application Insights for monitoring, it should also specify `AzureWebJobsDashboard` as an app setting.

The Azure Functions runtime uses the `AzureWebJobsStorage` connection string to create internal queues.  When Application Insights is not enabled, the runtime uses the `AzureWebJobsDashboard` connection string to log to Azure Table storage and power the **Monitor** tab in the portal.

These properties are specified in the `appSettings` collection in the `siteConfig` object:

```json
"appSettings": [
    {
        "name": "AzureWebJobsStorage",
        "value": "[concat('DefaultEndpointsProtocol=https;AccountName=', variables('storageAccountName'), ';AccountKey=', listKeys(variables('storageAccountid'),'2015-05-01-preview').key1)]"
    },
    {
        "name": "AzureWebJobsDashboard",
        "value": "[concat('DefaultEndpointsProtocol=https;AccountName=', variables('storageAccountName'), ';AccountKey=', listKeys(variables('storageAccountid'),'2015-05-01-preview').key1)]"
    }
```    

### Hosting plan

The definition of the hosting plan varies, depending on whether you use a Consumption or App Service plan. See [Deploy a function app on the Consumption plan](#consumption) and [Deploy a function app on the App Service plan](#app-service-plan).

### Function app

The function app resource is defined by using a resource of type **Microsoft.Web/Site** and kind **functionapp**:

```json
{
    "apiVersion": "2015-08-01",
    "type": "Microsoft.Web/sites",
    "name": "[variables('functionAppName')]",
    "location": "[resourceGroup().location]",
    "kind": "functionapp",            
    "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
        "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]"
    ]
```

<a name="consumption"></a>

## Deploy a function app on the Consumption plan

You can run a function app in two different modes: the Consumption plan and the App Service plan. The Consumption plan automatically allocates compute power when your code is running, scales out as necessary to handle load, and then scales down when code is not running. So, you don't have to pay for idle VMs, and you don't have to reserve capacity in advance. To learn more about hosting plans, see [Azure Functions Consumption and App Service plans](functions-scale.md).

For a sample Azure Resource Manager template, see [Function app on Consumption plan].

### Create a Consumption plan

A Consumption plan is a special type of "serverfarm" resource. You specify it by using the `Dynamic` value for the `computeMode` and `sku` properties:

```json
{
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2015-04-01",
    "name": "[variables('hostingPlanName')]",
    "location": "[resourceGroup().location]",
    "properties": {
        "name": "[variables('hostingPlanName')]",
        "computeMode": "Dynamic",
        "sku": "Dynamic"
    }
}
```

### Create a function app

In addition, a Consumption plan requires two additional settings in the site configuration: `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` and `WEBSITE_CONTENTSHARE`. These properties configure the storage account and file path where the function app code and configuration are stored.

```json
{
    "apiVersion": "2015-08-01",
    "type": "Microsoft.Web/sites",
    "name": "[variables('functionAppName')]",
    "location": "[resourceGroup().location]",
    "kind": "functionapp",            
    "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
        "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]"
    ],
    "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
        "siteConfig": {
            "appSettings": [
                {
                    "name": "AzureWebJobsDashboard",
                    "value": "[concat('DefaultEndpointsProtocol=https;AccountName=', variables('storageAccountName'), ';AccountKey=', listKeys(variables('storageAccountid'),'2015-05-01-preview').key1)]"
                },
                {
                    "name": "AzureWebJobsStorage",
                    "value": "[concat('DefaultEndpointsProtocol=https;AccountName=', variables('storageAccountName'), ';AccountKey=', listKeys(variables('storageAccountid'),'2015-05-01-preview').key1)]"
                },
                {
                    "name": "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING",
                    "value": "[concat('DefaultEndpointsProtocol=https;AccountName=', variables('storageAccountName'), ';AccountKey=', listKeys(variables('storageAccountid'),'2015-05-01-preview').key1)]"
                },
                {
                    "name": "WEBSITE_CONTENTSHARE",
                    "value": "[toLower(variables('functionAppName'))]"
                },
                {
                    "name": "FUNCTIONS_EXTENSION_VERSION",
                    "value": "~1"
                }
            ]
        }
    }
}
```                    

<a name="app-service-plan"></a> 

## Deploy a function app on the App Service plan

In the App Service plan, your function app runs on dedicated VMs on Basic, Standard, and Premium SKUs, similar to web apps. For details about how the App Service plan works, see the [Azure App Service plans in-depth overview](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). 

For a sample Azure Resource Manager template, see [Function app on Azure App Service plan].

### Create an App Service plan

```json
{
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2015-04-01",
    "name": "[variables('hostingPlanName')]",
    "location": "[resourceGroup().location]",
    "properties": {
        "name": "[variables('hostingPlanName')]",
        "sku": "[parameters('sku')]",
        "workerSize": "[parameters('workerSize')]",
        "hostingEnvironment": "",
        "numberOfWorkers": 1
    }
}
```

### Create a function app 

After you've selected a scaling option, create a function app. The app is the container that holds all your functions.

A function app has many child resources that you can use in your deployment, including app settings and source control options. You also might choose to remove the **sourcecontrols** child resource, and use a different [deployment option](functions-continuous-deployment.md) instead.

> [!IMPORTANT]
> To successfully deploy your application by using Azure Resource Manager, it's important to understand how resources are deployed in Azure. In the following example, top-level configurations are applied by using **siteConfig**. It's important to set these configurations at a top level, because they convey information to the Functions runtime and deployment engine. Top-level information is required before the child **sourcecontrols/web** resource is applied. Although it's possible to configure these settings in the child-level **config/appSettings** resource, in some cases your function app must be deployed *before* **config/appSettings** is applied. For example, when you are using functions with [Logic Apps](../logic-apps/index.yml), your functions are a dependency of another resource.

```json
{
  "apiVersion": "2015-08-01",
  "name": "[parameters('appName')]",
  "type": "Microsoft.Web/sites",
  "kind": "functionapp",
  "location": "[parameters('location')]",
  "dependsOn": [
    "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]",
    "[resourceId('Microsoft.Web/serverfarms', parameters('appName'))]"
  ],
  "properties": {
     "serverFarmId": "[variables('appServicePlanName')]",
     "siteConfig": {
        "alwaysOn": true,
        "appSettings": [
            { "name": "FUNCTIONS_EXTENSION_VERSION", "value": "~1" },
            { "name": "Project", "value": "src" }
        ]
     }
  },
  "resources": [
     {
        "apiVersion": "2015-08-01",
        "name": "appsettings",
        "type": "config",
        "dependsOn": [
          "[resourceId('Microsoft.Web/Sites', parameters('appName'))]",
          "[resourceId('Microsoft.Web/Sites/sourcecontrols', parameters('appName'), 'web')]",
          "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]"
        ],
        "properties": {
          "AzureWebJobsStorage": "[concat('DefaultEndpointsProtocol=https;AccountName=', variables('storageAccountName'), ';AccountKey=', listKeys(variables('storageAccountid'),'2015-05-01-preview').key1)]",
          "AzureWebJobsDashboard": "[concat('DefaultEndpointsProtocol=https;AccountName=', variables('storageAccountName'), ';AccountKey=', listKeys(variables('storageAccountid'),'2015-05-01-preview').key1)]"
        }
     },
     {
          "apiVersion": "2015-08-01",
          "name": "web",
          "type": "sourcecontrols",
          "dependsOn": [
            "[resourceId('Microsoft.Web/sites/', parameters('appName'))]"
          ],
          "properties": {
            "RepoUrl": "[parameters('sourceCodeRepositoryURL')]",
            "branch": "[parameters('sourceCodeBranch')]",
            "IsManualIntegration": "[parameters('sourceCodeManualIntegration')]"
          }
     }
  ]
}
```
> [!TIP]
> This template uses the [Project](https://github.com/projectkudu/kudu/wiki/Customizing-deployments#using-app-settings-instead-of-a-deployment-file) app settings value, which sets the base directory in which the Functions deployment engine (Kudu) looks for deployable code. In our repository, our functions are in a subfolder of the **src** folder. So, in the preceding example, we set the app settings value to `src`. If your functions are in the root of your repository, or if you are not deploying from source control, you can remove this app settings value.

## Deploy your template

You can use any of the following ways to deploy your template:

* [PowerShell](../azure-resource-manager/resource-group-template-deploy.md)
* [Azure CLI](../azure-resource-manager/resource-group-template-deploy-cli.md)
* [Azure portal](../azure-resource-manager/resource-group-template-deploy-portal.md)
* [REST API](../azure-resource-manager/resource-group-template-deploy-rest.md)

### Deploy to Azure button

Replace ```<url-encoded-path-to-azuredeploy-json>``` with a [URL-encoded](https://www.bing.com/search?q=url+encode) version of the raw path of your `azuredeploy.json` file in GitHub.

Here is an example that uses markdown:

```markdown
[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/<url-encoded-path-to-azuredeploy-json>)
```

Here is an example that uses HTML:

```html
<a href="https://portal.azure.com/#create/Microsoft.Template/uri/<url-encoded-path-to-azuredeploy-json>" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"></a>
```

## Next steps

Learn more about how to develop and configure Azure Functions.

* [Azure Functions developer reference](functions-reference.md)
* [How to configure Azure function app settings](functions-how-to-use-azure-function-app-settings.md)
* [Create your first Azure function](functions-create-first-azure-function.md)

<!-- LINKS -->

[Function app on Consumption plan]: https://github.com/Azure/azure-quickstart-templates/blob/master/101-function-app-create-dynamic/azuredeploy.json
[Function app on Azure App Service plan]: https://github.com/Azure/azure-quickstart-templates/blob/master/101-function-app-create-dedicated/azuredeploy.json
