---
title: Automating azure functions resource deployment | Microsoft Docs
description: 
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
ms.date: 08/29/2016
ms.author: cfowler;glenga
---
# Automating azure functions resource deployment

In this topic, you will learn how to build an Azure Resource Manager template, that deploys a function app. You will learn how to define the baseline of resources required for an Azure Function and the parameters that are specified when the deployment is executed. Depending on the [triggers and bindings](functions-triggers-bindings.md) that are used in your function, you may require deploying additional resources to encompass your entire application as infrastructure as code.

For more information about creating templates, see [Authoring Azure Resource Manager Templates](https://azure.microsoft.com/en-us/documentation/articles/resource-group-authoring-templates/)

For examples of a complete template, [Create consumption-based Azure Function](https://github.com/Azure/azure-quickstart-templates/blob/052db5feeba11f85d57f170d8202123511f72044/101-function-app-create-dynamic/azuredeploy.json) and/or [Create an App Service Plan based Azure Function](https://github.com/Azure/azure-quickstart-templates/blob/master/101-function-app-create-dedicated/azuredeploy.json)

## What is deployed

With the examples below, you will create a baseline Azure Function App. The resources required for a Function App are as follows:

* [Azure Storage](../storage/index.md) Account
* Hosting Plan (Consumption Plan or App Service Plan)
* Function App (Microsoft.Web/Site of kind **functionapp**)

## Parameters

With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called Parameters that contains all the parameter values. You should define parameters for those values that will vary based on the project you are deploying or based on the environment you are deploying to.

[Variables](../azure-resource-manager/resource-group-authoring-templates.md#variables) are useful for values which don't change based on an individual deployment, or parameters which require transformation before used in a template (e.g. to pass validation rules).

When defining parameters, use the **allowedValues** field to specify which values a user can provide during deployment. Use the **defaultValue** field to assign a value to the parameter, if no value is provided during deployment.

Let's describe the parameters for our template.

### appName

The name of the function you wish to create.

```json
"appName": {
    "type": "string"
}
```

### location

The location in which to deploy the Function App.

> [!NOTE]
> The **defaultValue** parameter is used to inherit the location of the Resource Group, or if a parameter value isn't specified during a Powershell or CLI deployment. If deploying from the Portal, a dropdown box is provided to select from the **allowedValues**.

> [!TIP]
> For an up-to-date list of regions Azure Functions is available in visit the [Products available by region](https://azure.microsoft.com/en-us/regions/services/) page.

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
```

### sourceCodeBranch (optional)

```json
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
        "description": "Use 'true' if you are deploying from the base repo, 'false' if you are deploying from your own fork. If you're using 'false', make sure you have admin permissions to the repo. If you get an error, you should add GitHub integration to another web app manually, so that you get a GitHub access token associated with your Azure Subscription."
    }
}
```

## Variables

In addition to parameters, Azure Resource Manager templates also have a concept of variables which can incorporate parameters to build out more specific settings to be used by your template.

In this example below, you can see that we are leveraging variables to apply [Azure Resource Manager template functions](../azure-resource-manager/resource-group-template-functions.md) to take the provided appName and convert it to lowercase to ensure that the [naming requirements](/storage/storage-create-storage-account#create-a-storage-account) for Azure Storage accounts are met.

```json
"variables": {
    "lowerSiteName": "[toLower(parameters('appName'))]",
    "storageAccountName": "[concat(variables('lowerSiteName'))]"
}
```

## Resources to deploy

### Storage Account

An Azure Storage account is a required resource in Azure Functions.

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

### Hosting plan: consumption vs app service plan

There are scenarios when building functions in which you may want your functions to be fully managed scaling meaning scaled on-demand by the platform (Consumption). Alternatively, you could choose user managed scaling in which your Functions run 24/7 on dedicated hardware (App Service Plan) in which the number of instances can be manually or automatically configured. The decision to use one plan over another could be based upon available features in the plan, or a decision which is driven by architecting by cost. To learn more about the different hosting plans, read the article [Scaling Azure Functions](functions-scale.md).

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

#### App service plan

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

### Function app (site)

Once the scaling option has been selected, it's time to create the container, which will hold all your functions, this is known as the Function App.

A Function App has many child resources in which you can take advantage of including **App Settings** and **Source Control Options**. You may opt to remove the **sourcecontrols** child resource in favor of another [deployment option](functions-continuous-deployment.md).

> [!IMPORTANT]
> It is important to understand how resources are deployed in Azure to ensure that you create a successful infrastructure as code configuration for your Application when using Azure Resource Manager. In this example, you will notice that there are top-level configurations being applied using **siteConfig**, these are important to set at a top level as they convey meaning to Azure Functions runtime and deployment engine which are required before the child resource **sourcecontrols/web** is applied. While these settings could be configured in the child level resource **config/appSettings**, there are scenarios in which your Function App and Functions will need to be deployed *before* the **config/appsettings** are applied as your Functions are a dependency of another resource, for example a [Logic App](../logic-apps/index.md).

> [!TIP]
> In this template we are using the [Project](https://github.com/projectkudu/kudu/wiki/Customizing-deployments#using-app-settings-instead-of-a-deployment-file) App Setting, which is setting the base directory in which the Functions Deployment Engine (Kudu) is going to look for deployable code. In this example, we have set this value to `src` as our GitHub repository contains a `src` folder in which our functions are a child of. If you have a repository in which your functions are directly in the root of the repository, or you are not deploying from Source Control, this App Setting can be removed.

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

## Deploying your template

* [Powershell](https://azure.microsoft.com/en-us/documentation/articles/resource-group-template-deploy/)
* [CLI](https://azure.microsoft.com/en-us/documentation/articles/resource-group-template-deploy-cli/)
* [Portal](https://azure.microsoft.com/en-us/documentation/articles/resource-group-template-deploy-portal/)
* [REST API](https://azure.microsoft.com/en-us/documentation/articles/resource-group-template-deploy-rest/)

### Deploy to azure button

Replace ```<url-encoded-path-to-azuredeploy-json>``` with a [URL encoded](https://www.bing.com/search?q=url+encode) of the raw path of your `azuredeploy.json` file in GitHub.

#### Markdown

```markdown
[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/<url-encoded-path-to-azuredeploy-json>)
```

#### HTML

```html
<a href="https://portal.azure.com/#create/Microsoft.Template/uri/<url-encoded-path-to-azuredeploy-json>" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"></a>
```

## Next Steps

Now that you have the ability to deploy a function app from code, take the opportunity to learn more about how to develop and configure Azure Functions:

* [Azure Functions developer reference](functions-reference.md)
* [How to configure Azure Functions app settings](functions-how-to-use-azure-function-app-settings.md)
* [Create your first Azure Function](functions-create-first-azure-function.md)