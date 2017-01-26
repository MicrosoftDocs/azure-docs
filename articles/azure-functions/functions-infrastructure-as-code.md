---
title: Automate resource deployment for an Azure Functions app | Microsoft Docs
description: Learn how to build an Azure Resource Manager template that deploys your Azure Functions app.
services: Functions
documtationcenter: na
author: mattchenderson
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, serverless architecture, infrastructure as code, azure resource manager

ms.assetid:
ms.server: functions
ms.devlang: multiple
ms.topic:
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 01/23/2017
ms.author: cfowler;glenga

---

# Automate resource deployment for your Azure Functions app

In this topic, learn how to build an Azure Resource Manager template that deploys an Azure Functions app. Learn how to define the resource baseline that's required for an Azure Functions app, and the parameters that are specified during deployment. Depending on the [triggers and bindings](functions-triggers-bindings.md) in your Functions app, you might need to deploy additional resources to define your entire application as infrastructure as code.

For more information about creating templates, read about [authoring Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md).

For examples of complete templates, see [Create a Consumption-based Azure Functions app](https://github.com/Azure/azure-quickstart-templates/blob/052db5feeba11f85d57f170d8202123511f72044/101-function-app-create-dynamic/azuredeploy.json) and [Create an App Service Plan-based Azure Functions app](https://github.com/Azure/azure-quickstart-templates/blob/master/101-function-app-create-dedicated/azuredeploy.json).

## Required resources

Use the following examples to create a baseline Azure Functions app. The resources required for a Functions app are:

* [Azure Storage](../storage/index.md) account
* Hosting plan (Consumption Plan or App Service Plan)
* Functions app (Microsoft.Web/Site of kind **functionapp**)

## Parameters

You can use Azure Resource Manager to define parameters for values that you want to specify when your template is deployed. A template has a **Parameters** section, which has all the parameter values. You should define parameters for values that will vary based on the project you are deploying, or based on the environment you are deploying to.

[Variables](../azure-resource-manager/resource-group-authoring-templates.md#variables) are useful for values that don't change based on an individual deployment, and for parameters that require transformation before being used in a template (for example, to pass validation rules).

When you define parameters, use the **allowedValues** field to specify which values a user can provide during deployment. Use the **defaultValue** field to assign a value to the parameter, if no value is provided during deployment.

An Azure Resource Manager template uses the parameters described in the next few sections.

### appName

The name of the Azure Functions app that you want to create.

```json
"appName": {
    "type": "string"
}
```

### location

Where to deploy the Functions app.

> [!NOTE]
> Use the **defaultValue** parameter to inherit the location of the Resource Group, or if a parameter value isn't specified during a PowerShell or Azure CLI deployment. If you are deploy your app from the Azure portal, select a value from the **allowedValues** parameter drop-down list.

> [!TIP]
> For an up-to-date list of regions where you can use Azure Functions, see [Products available by region](https://azure.microsoft.com/regions/services/).

```json
"location": {
    "type": "string",
    "allowedValues": [
        "Brazil South",
        "East US",
        "East US 2",
        "Central US",
        "North Central US",
        "South Central US",
        "West US",
        "West US 2"
    ],
    "defaultValue": "[resourceGroup().location]"
}
```

### sourceCodeRepositoryURL (optional)

```json
"sourceCodeRepositoryURL": {
    "type": "string",
    "defaultValue": "",
    "metadata": {
    "description": "Source code repository URL"
}
/*```

### sourceCodeBranch (optional)

```json*/
    "sourceCodeBranch": {
      "type": "string",
      "defaultValue": "master",
      "metadata": {
        "description": "Sourcecode Repo branch"
      }
    }
```

### sourceCodeManualIntegration (optional)

```json
"sourceCodeManualIntegration": {
    "type": "bool",
    "defaultValue": false,
    "metadata": {
        "description": "Use 'true' if you are deploying from the base repo. Use 'false' if you are deploying from your own fork. If you use 'false', make sure that you have Administrator permissions to the repo. If you get an error, add GitHub integration to another web app manually, so that you get a GitHub access token associated with your Azure subscription."
    }
}
```

## Variables

In addition to parameters, Azure Resource Manager templates use variables, which can incorporate parameters to build out more specific settings in your template.

In the next example, variables apply [Azure Resource Manager template Functions](../azure-resource-manager/resource-group-template-functions.md) to convert the entered  **appName** value to lowercase to meet Azure Storage account [naming requirements](../storage/storage-create-storage-account.md#create-a-storage-account).

```json
"variables": {
    "lowerSiteName": "[toLower(parameters('appName'))]",
    "storageAccountName": "[concat(variables('lowerSiteName'))]"
}
```

## Resources to deploy

### Storage Account

An Azure Storage account is required for an Azure Functions app.

```json
{
    "type": "Microsoft.Storage/storageAccounts",
    "name": "[variables('storageAccountName')]",
    "apiVersion": "2015-05-01-preview",
    "location": "[variables('storageLocation')]",
    "properties": {
        "accountType": "[variables('storageAccountType')]"
    }
}
```

### Hosting plan: Consumption vs. App Service Plan

In some scenarios, you might want your Functions to be fully managed scaling. This means scaled on-demand by the platform (by using a Consumption hosting plan). Alternatively, you could choose user-managed scaling. In user-managed scaling, your Functions app runs 24/7 on dedicated hardware (by using an App Service Plan), on which the number of instances can be manually or automatically configured. Your hosting plan choice could be based upon available features in the plan, or based on architecting by cost. To learn more about hosting plans, see [Scaling Azure Functions](functions-scale.md).

#### Consumption plan

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

#### App Service Plan

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

### Functions app (site)

After you've selected a scaling option, create a Functions app, which is the container that holds all your Functions.

A Functions app has many child resources that you can use in your deployment, including **App Settings** and **Source Control Options**. You also might choose to remove the **sourcecontrols** child resource and use a different [deployment option](functions-continuous-deployment.md) instead.

> [!IMPORTANT]
> To create a successful infrastructure as code configuration for your application by using Azure Resource Manager, it's important to understand how resources are deployed in Azure. In the following example, note that top-level configurations are applied using **siteConfig**. It's important to set these at a top level because they convey information to the Azure Functions runtime and deployment engine. The information is  required before the child **sourcecontrols/web** resource is applied. Although you could configure these settings in the child-level **config/appSettings** resource, in some scenarios, your Functions app and Functions need to be deployed *before* **config/appsettings** is applied. In those cases, for example, in a [Logic App](../logic-apps/index.md), your Functions are a dependency of another resource.

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
> This template uses the [Project](https://github.com/projectkudu/kudu/wiki/Customizing-deployments#using-app-settings-instead-of-a-deployment-file) App Setting, which sets the base directory in which the Functions Deployment Engine (Kudu) looks for deployable code. In our repository, our Functions are in a subfolder of the **src** folder. So, in the preceding example, we set the App Setting value to **src**. If your functions are in the root of your repository, or if you are not deploying from source control, you can remove this App Setting.

## Deploy your template

* [Powershell](../azure-resource-manager/resource-group-template-deploy.md)
* [CLI](../azure-resource-manager/resource-group-template-deploy-cli.md)
* [Azure portal](../azure-resource-manager/resource-group-template-deploy-portal.md)
* [REST API](../azure-resource-manager/resource-group-template-deploy-rest.md)

### Deploy to Azure button

Replace ```<url-encoded-path-to-azuredeploy-json>``` with a [URL- encoded](https://www.bing.com/search?q=url+encode) version of the raw path of your `azuredeploy.json` file in GitHub.

#### Markdown

```markdown
[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/<url-encoded-path-to-azuredeploy-json>)
```

#### HTML

```html
<a href="https://portal.azure.com/#create/Microsoft.Template/uri/<url-encoded-path-to-azuredeploy-json>" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"></a>
```

## Next steps

Learn more about how to develop and configure Azure Functions:

* [Azure Functions developer reference](functions-reference.md)
* [How to configure Azure Functions app settings](functions-how-to-use-azure-function-app-settings.md)
* [Create your first Azure Function](functions-create-first-azure-function.md)
