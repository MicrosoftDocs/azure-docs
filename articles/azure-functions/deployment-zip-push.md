---
title: Zip push deployment for Azure Functions | Microsoft Docs
description: Use the .zip file deployment facilities of the Kudu deployment service to publish your Azure Functions.
services: functions
documentationcenter: na
author: ggailey777
manager: cfowler
editor: ''
tags: ''

ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 11/16/2017
ms.author: glenga

---
# Zip push deployment for Azure Functions 
This topic shows you how to deploy your function app project files to Azure from a .zip (compressed) file. You learn how to do a push deployment using both the Azure CLI and the REST APIs. Azure Functions has the full range of continuous deployment and integration options provided by Azure App Service, for more information, see [Continuous deployment for Azure Functions](functions-continuous-deployment.md). However, for faster iteration during development, it is often easier to deploy your function app project files directly from a compressed .zip file.

This .zip file deployment uses the same Kudu service that powers all App Service deployments. Not only does .zip file deployment cleanup old files from previous deployments, but you can also run your custom deployment scripts. For more information, see the [.zip push deployment reference topic].

>[!IMPORTANT]
> When you use .zip push deployment, any files from an existing deployment not found in the .zip file are deleted from your function app.    

## Prerequisites
To complete this topic, you need:

* A Microsoft Azure account. If you don't have an account, you can 
  [sign up for a free trial](https://azure.microsoft.com/pricing/free-trial) or 
  [activate your Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details).

> [!NOTE]
> If you want to get started with Azure Functions before signing up for an Azure account, go to [Try Azure Functions](https://functions.azure.com/try), where you can immediately create a starter function in a short-lived function app. No credit cards required; no commitments.  

## Create a project .zip file to deploy
First you need a .zip file that contains the function app project files, including your function code. The contents of this file is what gets deployed to your function app in Azure. The easiest way to create a .zip compressed function app is to use the project files from the Functions quickstart repository. 

1. Browse to the [Functions quickstart repository]( https://github.com/Azure-Samples/functions-quickstart) and clone the repository to your local computer or download the repository as a .zip file. 

2. If you downloaded the files in a .zip file, extract the files. 

    >[!NOTE]
    >When you create a .zip file to deploy your function app, the host.json file and individual function folders must be in the root of the .zip file. For more information about the folder structure requirements for Functions, see the guidance in the [Azure Functions developers guide](functions-reference.md#folder-structure). The .zip file you download from GitHub adds an extra folder level for the branch, which means that you can't deploy the .zip file downloaded from GitHub as is. 

3. Using a .zip compression utility, create a .zip file that matches the structure of the quickstart repository. 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires the Azure CLI version 2.0.21 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Create the function app in Azure

Before you can deploy your function app project using the .zip file, you must create a function app in your Azure subscription. In the following Azure CLI script, replace the `<storage_name>` placeholder with a globally unique storage account name. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. Also, replace the `<app_name>` placeholder with a name that is unique across all apps in Azure. 

```azurecli-interactive
# Replace with globally unique names.
mystorageaccount=<storage_name>
myfunctionapp=<app_name>

# Create resource group
az group create --name myResourceGroup --location westeurope

# Create an azure storage account
az storage account create --name $mystorageaccount --location westeurope \
  --resource-group myResourceGroup --sku Standard_LRS

# Create Function App
az functionapp create --name $myfunctionapp --storage-account $mystorageaccount \
  --consumption-plan-location westeurope --resource-group myResourceGroup
```

You can now deploy the function app from the downloaded .zip file using either the [Azure CLI](#cli) or the [deployment REST APIs](#rest).

## <a name="cli"></a>Deploy using the Azure CLI

You can use the Azure CLI to trigger a push deployment. Push deploy the downloaded .zip file to your function app by using the [az functionapp deployment source config-zip](/cli/azure/functionapp/deployment/source#az_functionapp_deployment_source_config_zip) command.

In the following command, replace the `<zip_file_path>` placeholder with the path to the location where you downloaded your project .zip file. Also, replace `<app_name>` with the unique name of your function app. 

```azurecli-interactive
az functionapp deployment source config-zip  -g myResourceGroup -n \
<app_name> --src <zip_file_path>
```

This command deploys project files from the downloaded .zip file to your function app in Azure and restarts the app. To view the list of deployments for this function app, you must use the REST APIs.

After you deploy the Functions quickstart project files, you can [test your code in Azure](#test). 

[!INCLUDE [app-service-deploy-zip-push-rest](../../includes/app-service-deploy-zip-push-rest.md)]

After you deploy the Functions quickstart project files, you can [test your code in Azure](#test). 

[!INCLUDE [functions-test-function-code](../../includes/functions-test-function-code.md)]

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

> [!div class="nextstepaction"]
> [Best Practices for Azure Functions](functions-best-practices.md)

[.zip push deployment reference topic]: https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file
