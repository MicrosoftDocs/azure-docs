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
This topic describes how to deploy your function app project files to Azure from a .zip (compressed) file. You learn how to do a push deployment using both the Azure CLI and the REST APIs. Azure Functions has the full range of continuous deployment and integration options provided by Azure App Service, for more information, see [Continuous deployment for Azure Functions](functions-continuous-deployment.md). However, for faster iteration during development, it is often easier to deploy your function app project files directly from a compressed .zip file.

This .zip file deployment uses the same Kudu service that powers continuous integration-based deployments, which includes the following functionality:

+ Deletion of files leftover from a previous deployment.
+ [Deployment customization](https://github.com/projectkudu/kudu/wiki/Configurable-settings#repository-and-deployment-related-settings), including running deployment scripts. 
+ Deployment logs.
+ Synchronizing function triggers in a [Consumption plan](functions-scale.md) function app.

 For more information, see the [.zip push deployment reference topic]. 

## Requirements of the deployment .zip file 
The .zip file you use for push deployment must contains all of the project files in your function app, including your function code. 

>[!IMPORTANT]
> When you use .zip push deployment, any files from an existing deployment not found in the .zip file are deleted from your function app.  

### Function app folder structure

[!INCLUDE [functions-folder-structure](../../includes/functions-folder-structure.md)]

### Downloading your function app project

When you are doing local development, it is easy to create a .zip file of the function app project folder on your development computer. However,you may have also created your functions using the in-portal editor. To download your function app project from the portal: 

1. Sign into the [Azure portal](https://portal.azure.com) and navigate to your function app.

2. In the **Overview** tab, select **Download app content**, choose your download options, and click **Download**.     

    ![Download the function app project](./media/deployment-zip-push/download-project.png)

The downloaded .zip file is in the correct format to be republished to your function app using .zip push deployment.

GitHub also lets you download a .zip file from a repository. Keep in mind that when you download a GitHub repository as a .zip file, GitHub adds an extra folder level for the branch, which means that you can't deploy the .zip file downloaded from GitHub as is. If you are using a GitHub repository to maintain your function app, you should use [continuous integration](functions-continuous-deployment.md) to deploy your app.  

## <a name="cli"></a>Deploy using the Azure CLI

You can use the Azure CLI to trigger a push deployment. Push deploy a  .zip file to your function app by using the [az functionapp deployment source config-zip](/cli/azure/functionapp/deployment/source#az_functionapp_deployment_source_config_zip) command. You must use Azure CLI version 2.0.21 or later. Use the `az --version` command to see what version you are using.

In the following command, replace the `<zip_file_path>` placeholder with the path to the location of your .zip file. Also, replace `<app_name>` with the unique name of your function app. 

```azurecli-interactive
az functionapp deployment source config-zip  -g myResourceGroup -n \
<app_name> --src <zip_file_path>
```
This command deploys project files from the downloaded .zip file to your function app in Azure and restarts the app. To view the list of deployments for this function app, you must use the REST APIs.

When you are using the Azure CLI on your local computer, `<zip_file_path>` is the path to the .zip file on your computer. You can also run Azure CLI in the [Azure Cloud Shell](../cloud-shell/overview.md). When using Cloud Shell, you must first upload your deployment .zip file to the Azure File account associated with your Cloud Shell. In that case, `<zip_file_path>` is the storage location used by your Cloud Shell account. For more information, see [Persist files in Azure Cloud Shell](../cloud-shell/persisting-shell-storage.md).


[!INCLUDE [app-service-deploy-zip-push-rest](../../includes/app-service-deploy-zip-push-rest.md)]


> [!div class="nextstepaction"]
> [Continuous deployment for Azure Functions](functions-continuous-deployment.md)

[.zip push deployment reference topic]: https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file
