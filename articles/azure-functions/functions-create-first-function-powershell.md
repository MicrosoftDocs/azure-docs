---
title: Create your first PowerShell function in Azure
description: Learn how to create your first PowerShell function in Azure using the Azure Functions Core Tools and Azure PowerShell (or the Azure CLI).
services: functions
keywords:
author: joeyaiello
ms.author: jaiello
ms.date: 02/04/2019
ms.topic: quickstart
ms.service: functions
ms.devlang: powershell
---

# Create your first PowerShell function in Azure (preview)

This quickstart article walks you through how to use the Azure CLI to create your first
[serverless](https://azure.com/serverless) PowerShell function app running on Windows or Linux.
The function code is created locally and then deployed to Azure by using the
[Azure Functions Core Tools](functions-run-local.md).
To learn more about preview considerations for running your function apps on Linux,
see [this Functions on Linux article](https://aka.ms/funclinux).

The following steps are supported on a Mac, Windows, or Linux computer.

## Prerequisites

To run and debug functions locally, you will need to:

* Install [PowerShell Core](https://docs.microsoft.com/powershell/scripting/install/installing-powershell#powershell-core)
* Install the [.NET Core SDK 2.1+](https://www.microsoft.com/net/download)
* Install [Azure Functions Core Tools](functions-run-local.md#v2) version 2.4.299 or later
  (update as often as possible)

To publish and run in Azure:

* Install [Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps)
  OR install the [Azure CLI](cli/azure/install-azure-cli) version 2.x or later.
* You need an active Azure subscription.
  [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a local Functions project

You can now create a local Functions project.
This directory is the equivalent of a Function App in Azure.
It can contain multiple functions that share the same local and hosting configuration.

In the terminal window or from a command prompt, run the following commands:

```powershell
mkdir MyFunctionProj
cd MyFunctionProj
func init --worker-runtime powershell
```

You should see something like this:

```output
PS > func init --worker-runtime powershell
Writing .gitignore
Writing host.json
Writing local.settings.json
```

A new folder named _MyFunctionProj_ is created and initialized with some files.

## Creating a function

Now that we have a Functions project, we need to create a function inside of it.
A function will contain the actual script of yours that will get executed.

To create a function, run the following command:

```powershell
func new -l powershell -t HttpTrigger -n MyHttpTrigger
```

> [!NOTE]
> * The `-l` stands for the _language_ you would like to use
> * The `-t` stands for the _template_ you would like to generate
> * The `-n` stands for the _name_ of the function you are creating

You should see something like:

```output
PS > func new -l powershell -t HttpTrigger -n MyHttpTrigger
Select a template: HttpTrigger
Function name: [HttpTrigger] Writing .../MyFunctionProj/MyHttpTrigger/run.ps1
Writing .../MyFunctionProj/MyHttpTrigger/sample.dat
Writing .../MyFunctionProj/MyHttpTrigger/function.json
The function "MyHttpTrigger" was created successfully from the "HttpTrigger" template.
PS >
```

Here we are using the "HttpTrigger" template.
It's a simple template that allows you to trigger your function using an HTTP request.

Our directory structure should look like this:

```output
PS > dir -Recurse

    Directory: /home/foo/MyFunctionsProj


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d-----           11/1/18  5:41 PM                .vscode
d-----           11/1/18  5:41 PM                MyHttpTrigger
------           11/1/18  5:41 PM            431 .gitignore
------           11/1/18  5:41 PM             25 host.json
------           11/1/18  5:41 PM            142 local.settings.json
------           11/1/18  5:41 PM           1182 profile.ps1

    Directory: /home/foo/MyFunctionsProj/MyHttpTrigger

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
------           11/1/18  5:41 PM            328 function.json
------           11/1/18  5:41 PM            751 run.ps1
------           11/1/18  5:41 PM             27 sample.dat
```

Let's run through what each of these files do:

* _.vscode_ - A folder that recommends VS Code extensions to the user
* _MyHttpTrigger_ - The folder that contains the function
* _.gitignore_ - A file used by Git to ignore certain local build/test artifacts from source control
* _host.json_ - Contains global configuration options that affect all functions for a function app
* _local.settings.json_ - Contains the configuration settings for your function app that can be published to "Application Settings" in your Azure function app environment
* _profile.ps1_ - A PowerShell script that will be executed on every cold start of your language worker
* _function.json_ - Contains the configuration metadata for the Function and the definition of input and output bindings
* _run.ps1_ - This is the script that will be executed when a Function is triggered
* _sample.dat_ - Contains the sample data that will be displayed in the Azure Portal for testing purposes

> [!NOTE]
> For more information on input and output bindings, checkout the [Binding usage guide here]().

We now have a function inside of a function app and are ready to run and test it out!

## Run the function locally

Run the following command from the root of your function app (you may need to run `cd ..`) to run the Functions host locally:

```powershell
func start
```

When the Functions host starts, it outputs the URL of your HTTP-triggered function.
(Note that the entire output has been truncated for readability.)

```output

                  %%%%%%
                 %%%%%%
            @   %%%%%%    @
          @@   %%%%%%      @@
       @@@    %%%%%%%%%%%    @@@
     @@      %%%%%%%%%%        @@
       @@         %%%%       @@
         @@      %%%       @@
           @@    %%      @@
                %%
                %
...
Now listening on: http://0.0.0.0:7071
Application started. Press Ctrl+C to shut down.
...

Http Functions:

        HttpTrigger: http://localhost:7071/api/HttpTrigger
```

If you access `http://localhost:7071/api/MyHttpTrigger` using `Invoke-RestMethod`, you should get:

```output
PS > Invoke-RestMethod http://localhost:7071/api/MyHttpTrigger
irm : Please pass a name on the query string or in the request body.
At line:1 char:1
+ irm http://localhost:7071/api/MyHttpTrigger
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
+ CategoryInfo          : InvalidOperation: (Method: GET, Re...rShell/6.2.0
}:HttpRequestMessage) [Invoke-RestMethod], HttpResponseException
+ FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeRestMethodCommand
```

This error is expected to be thrown if you look at the `run.ps1`.
To get back a proper 200 response, we need to supply a query parameter called "Name":

```
PS > Invoke-RestMethod http://localhost:7071/api/MyHttpTrigger?Name=PowerShell
Hello PowerShell
```

You can also copy the URL of your function from the output and paste it into your browser's address bar.
Append the query string `?name=<yourname>` to this URL and execute the request:

```none
http://localhost:7071/api/HttpTrigger?name=<yourname>
```

We have successfully executed our function locally!
Now let's publish it to Azure.

## Create a function app in Azure

There are two ways to create a new Function App in Azure:

* [Azure Portal](#azure-portal)
* [ARM Template](#arm-template)

## Azure Portal

### Creating the Function App

1. Navigate to the Azure Portal using [this special link containing a feature flag](https://ms.portal.azure.com/?feature.customPortal=false&feature.canmodifystamps=true&WebsitesExtension=canary&websitesextension_powershell=true&feature.fastmanifest=false&nocdn=force&websitesextension_functionsnext=true&WebsitesExtension_useReactFrameBlade=true#create/Microsoft.FunctionApp).
2. Click on "+ Create a resource":

![create a resource](https://user-images.githubusercontent.com/2644648/47879512-0455a500-ddde-11e8-89dc-09ac187d2a24.png)

3. Enter "Function App" in the search box and hit Enter, or select "Serverless Function App" if it's in the Popular section:

![search for "Function App"](https://user-images.githubusercontent.com/2644648/47879643-60b8c480-ddde-11e8-8e46-c8662148b0f1.png)

4. Select "Function App" in the search results:

![select "Function App" in the search results](https://user-images.githubusercontent.com/2644648/47879805-c5741f00-ddde-11e8-9c3c-eb9cd52690fd.png)

5. Click "Create" at the bottom:

![Click "Create"](https://user-images.githubusercontent.com/2644648/47879839-e0469380-ddde-11e8-8135-6a6c60d784f0.png)

6. Fill in the following for the form and then click "Create":

- _App name_: Any you'd like
- _Subscription_: Any you'd like
- _Resource Group_: Any you'd like
- _OS_: Windows
- _Publish_: Code
- _Runtime Stack_: PowerShell
- _App Service Plan/Location_: Any you'd like
- _Storage_: Any you'd like
- _Application Insights_: Any you'd like
- _Application Insights Location_: Any you'd like

> [!NOTE]
> Currently Linux is also supported, but is limited to the dedicated plan as opposed to the consumption plan.
For more information on the different plans, see the [official hosting documentation](https://docs.microsoft.com/en-us/azure/azure-functions/functions-scale).

![form](https://user-images.githubusercontent.com/2644648/47880194-d40f0600-dddf-11e8-96fa-0e598e2bf4f4.png)

As soon as it's deployed, you now have a function app configured to run PowerShell!
Now you need to [publish a local PowerShell function app](#Deploy-the-function-app-project-to-Azure) to this deployed function app.

## ARM Template

You can also deploy the following ARM template with
[Azure PowerShell](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-template-deploy)
or [Azure CLI](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-template-deploy-cli).
This ARM template will:

- Create an Azure App Service Plan if it does not exist
- Create an Azure Storage Account if it does not exist
- Create an Azure Function App with the correct Application and Container settings

### Windows Consumption `template.json`

First, save the following file as something like `template.json`:

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "functionAppName": {
            "type": "string",
            "metadata": {
                "description": "Specify the name of the function application"
              }
        },
        "ApplicationInsightsLocation": {
            "type": "string",
            "defaultValue": "West Europe",
            "allowedValues": [
              "East US",
              "South Central US",
              "North Europe",
              "West Europe",
              "Southeast Asia",
              "West US 2",
              "Central India",
              "Canada Central",
              "UK South"
            ],
            "metadata": {
              "description": "Specify the region for Application Insights data"
            }
          },
        "runtimeStack": {
            "type": "string",
            "defaultValue": "powershell",
            "allowedValues": [
                "powershell",
                "dotnet",
                "node",
                "java"
            ],
            "metadata": {
                "description": "Pick the language runtime that you want enabled"
              }
        }
    },
    "variables": {
        "hostingPlanName": "[parameters('functionAppName')]",
        "location": "[resourceGroup().location]",
        "storageAccountName": "[concat('storage', uniquestring(resourceGroup().id))]",
        "resourceGroupScopeTemplate": "https://raw.githubusercontent.com/eamonoreilly/AzureFunctions/master/PowerShell/ManagedIdentityAssignment/assignMSIResourceGroupScope.json",
        "contributorId": "b24988ac-6180-42a0-ab88-20f7382dd24c"
    },
    "resources": [
        {
            "name": "[parameters('functionAppName')]",
            "type": "Microsoft.Web/sites",            
            "dependsOn": [
                "[concat('Microsoft.Web/serverfarms/', variables('hostingPlanName'))]",
                "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]",
                "[resourceId('microsoft.insights/components/', parameters('functionAppName'))]"
            ],
            "identity": {
                "type": "SystemAssigned"
            },
            "properties": {
                "siteConfig": {
                    "appSettings": [
                        {
                            "name": "FUNCTIONS_WORKER_RUNTIME",
                            "value": "[parameters('runtimeStack')]"
                        },
                        {
                            "name": "AzureWebJobsStorage",
                            "value": "[concat('DefaultEndpointsProtocol=https;AccountName=',variables('storageAccountName'),';AccountKey=',listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName')), '2015-05-01-preview').key1)]"
                        },
                        {
                            "name": "FUNCTIONS_EXTENSION_VERSION",
                            "value": "~2"
                        },
                        {
                            "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
                            "value": "[reference(resourceId('microsoft.insights/components/', parameters('functionAppName')), '2015-05-01').InstrumentationKey]"
                        }
                    ]
                },
                "name": "[parameters('functionAppName')]",
                "clientAffinityEnabled": false,
                "serverFarmId": "[concat('/subscriptions/', subscription().subscriptionId,'/resourcegroups/', resourceGroup().name, '/providers/Microsoft.Web/serverfarms/', variables('hostingPlanName'))]"
            },
            "apiVersion": "2018-02-01",
            "location": "[variables('location')]",
            "kind": "functionapp"
        },
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
        },
        {
            "apiVersion": "2015-05-01-preview",
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[variables('storageAccountName')]",
            "location": "[variables('location')]",
            "properties": {
                "accountType": "Standard_LRS"
            }
        },
        {
            "apiVersion": "2015-05-01",
            "name": "[parameters('functionAppName')]",
            "type": "Microsoft.Insights/components",
            "location": "[parameters('ApplicationInsightsLocation')]",
            "tags": {
                "[concat('hidden-link:', resourceGroup().id, '/providers/Microsoft.Web/sites/', parameters('functionAppName'))]": "Resource"
            },
            "properties": {
                "ApplicationId": "[parameters('functionAppName')]"
            }
        }
    ],
    "outputs": {
        "principalId": {
          "type": "string",
          "value": "[reference(concat(resourceId('Microsoft.Web/sites/', parameters('functionAppName')), '/providers/Microsoft.ManagedIdentity/Identities/default'), '2015-08-31-PREVIEW').principalId]"
        }
    }
}
```

Then deploy it with Azure PowerShell (replacing "ContosoGroup" and "contosofunctionapp" with your own resource group and function app names):

```powershell
# Register Resource Providers if they're not already registered
Register-AzResourceProvider -ProviderNamespace "microsoft.web"
Register-AzResourceProvider -ProviderNamespace "microsoft.storage"

# Create a resource group for the function app
New-AzResourceGroup -Name "ContosoGroup" -Location 'West Europe'

# Create the parameters for the file – the only required one is the function app name.
$TemplateParams = @{"functionAppName" = "contosofunctionapp"}

# Deploy the template
New-AzResourceGroupDeployment -ResourceGroupName “ContosoGroup” -TemplateFile template.json -TemplateParameterObject $TemplateParams -Verbose
```

### Linux Dedicated `template.json`

_template.json_
```json
{
    "parameters": {
        "functionAppName": {
            "type": "string"
        },
        "storageName": {
            "type": "string"
        },
        "hostingPlanName": {
            "type": "string"
        },
        "serverFarmResourceGroup": {
            "type": "string"
        },
        
        "subscriptionId": {
            "type": "string"
        },
        "location": {
            "type": "string"
        },
        "hostingEnvironment": {
            "type": "string"
        },
        "sku": {
            "type": "string"
        },
        "skuCode": {
            "type": "string"
        },
        "workerSize": {
            "type": "string"
        }
    },
    "resources": [
        {
            "name": "[parameters('functionAppName')]",
            "type": "Microsoft.Web/sites",
            "dependsOn": [
                "[concat('Microsoft.Web/serverfarms/', parameters('hostingPlanName'))]",
                "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageName'))]",
                "[resourceId('microsoft.insights/components/', parameters('functionAppName'))]"
            ],
            "properties": {
                "siteConfig": {
                    "appSettings": [
                        {
                            "name": "FUNCTIONS_WORKER_RUNTIME",
                            "value": "powershell"
                        },
                        {
                            "name": "AzureWebJobsStorage",
                            "value": "[concat('DefaultEndpointsProtocol=https;AccountName=',parameters('storageName'),';AccountKey=',listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageName')), '2015-05-01-preview').key1)]"
                        },
                        {
                            "name": "FUNCTIONS_EXTENSION_VERSION",
                            "value": "~2"
                        },
                        {
                            "name": "WEBSITE_NODE_DEFAULT_VERSION",
                            "value": "8.11.1"
                        },
                        {
                            "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
                            "value": "[reference(resourceId('microsoft.insights/components/', parameters('functionAppName')), '2015-05-01').InstrumentationKey]"
                        }
                    ],
                    "alwaysOn": true,
                    "linuxFxVersion": "DOCKER|mcr.microsoft.com/azure-functions/powershell:2.0"
                },
                "name": "[parameters('functionAppName')]",
                "clientAffinityEnabled": false,
                "serverFarmId": "[concat('/subscriptions/', parameters('subscriptionId'),'/resourcegroups/', parameters('serverFarmResourceGroup'), '/providers/Microsoft.Web/serverfarms/', parameters('hostingPlanName'))]",
                "hostingEnvironment": "[parameters('hostingEnvironment')]"
            },
            "apiVersion": "2016-03-01",
            "location": "[parameters('location')]",
            "kind": "functionapp"
        },
        {
            "apiVersion": "2016-09-01",
            "name": "[parameters('hostingPlanName')]",
            "type": "Microsoft.Web/serverfarms",
            "location": "[parameters('location')]",
            "properties": {
                "name": "[parameters('hostingPlanName')]",
                "workerSizeId": "[parameters('workerSize')]",
                "reserved": true,
                "numberOfWorkers": "1",
                "hostingEnvironment": "[parameters('hostingEnvironment')]"
            },
            "sku": {
                "Tier": "[parameters('sku')]",
                "Name": "[parameters('skuCode')]"
            },
            "kind": "linux"
        },
        {
            "apiVersion": "2015-05-01-preview",
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[parameters('storageName')]",
            "location": "[parameters('location')]",
            "properties": {
                "accountType": "Standard_LRS"
            }
        },
        {
            "apiVersion": "2015-05-01",
            "name": "[parameters('functionAppName')]",
            "type": "Microsoft.Insights/components",
            "location": "[parameters('location')]",
            "tags": {
                "[concat('hidden-link:', resourceGroup().id, '/providers/Microsoft.Web/sites/', parameters('functionAppName'))]": "Resource"
            },
            "properties": {
                "ApplicationId": "[parameters('functionAppName')]",
                "Request_Source": "IbizaWebAppExtensionCreate"
            }
        }
    ],
    "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0"
}
```

_parameters.json_
```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "functionAppName": {
            "value": "AwesomeFuncApp"
        },
        "storageName": {
            "value": "awesomefuncappstorage"
        },
        "hostingPlanName": {
            "value": "AwesomeFuncApp-plan"
        },
        "serverFarmResourceGroup": {
            "value": "AwesomeFuncApp"
        },
        "subscriptionId": {
            "value": ""
        },
        "location": {
            "value": "West US 2"
        },
        "hostingEnvironment": {
            "value": ""
        },
        "sku": {
            "value": "Basic"
        },
        "skuCode": {
            "value": "B1"
        },
        "workerSize": {
            "value": "0"
        }
    }
}

```

You should change the values of the `parameters.json` to fill your needs.

You can deploy these by using
[Azure PowerShell](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-template-deploy)
or [Azure CLI](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-template-deploy-cli).

## Deploy the function app project to Azure

Now that you've created a function app in Azure,
you can deploy your local function app to the cloud.

### Login to Azure in your local shell

#### Azure PowerShell

> [!NOTE]
> If you have the AzureRM module, that works fine too. However, the Az module is recommended.

Before deploying, login to Azure PowerShell by running the following command and following the prompt:

```powershell
Login-AzAccount
```

Once you login, you're ready to publish!

#### Azure CLI

You can also login using the Azure CLI instead of Azure PowerShell:

```powershell
az login
```

Once you login, you're ready to publish!

### Deploy the function app to Azure

To publish our function app, all you need to do is run:

```
func azure functionapp publish <name of function app in Azure>
```

> [!NOTE]
> You might be asked to supply the `--nozip` parameter. That's okay!

You should see:

```output
PS > func azure functionapp publish AwesomePSFunc
Getting site publishing info...
Creating archive for current directory...
Uploading archive...
Upload completed successfully.
Functions in AwesomePSFunc:
    MyHttpTrigger - [httpTrigger]
        Invoke url: http://awesomepsfunc.azurewebsites.net/api/myhttptrigger?code=8fLQn8PM8wDRXDxhr0/ZWbulJgHPLZTPoH8KagmLbA9jaMheybRwtw==
```

Your function app is now deployed to Azure and can be invoked using the URL above:

```
PS > Invoke-RestMethod 'http://awesomepsfunc.azurewebsites.net/api/myhttptrigger?code=8fLQn8PM8wDRXDxhr0/ZWbulJgHPLZTPoH8KagmLbA9jaMheybRwtw==&Name=PowerShell'
Hello PowerShell
PS >
```

> [!NOTE]
> The `code` query parameter that you see there is a result of the function's HTTP trigger binding having `"authLevel":"function"` which can be found in the function's `function.json`.
For more information, take a look at the [official HTTP binding documentation](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook#trigger---configuration).

## Next steps

Learn more about developing Azure Functions using PowerShell

> [!div class="nextstepaction"]
> [Azure Functions PowerShell developer guide](functions-reference-powershell.md)
> [Azure Functions triggers and bindings](functions-triggers-bindings.md)
