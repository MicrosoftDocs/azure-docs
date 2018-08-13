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
ms.date: 08/12/2018
ms.author: glenga

---

# Zip deployment for Azure Functions

This article describes how to deploy your function app project files to Azure from a .zip (compressed) file. You learn how to do a push deployment, both by using Azure CLI and by using the REST APIs. [Azure Functions Core Tools](functions-run-local.md) also uses these deployment APIs when publishing a local project to Azure.

Azure Functions has the full range of continuous deployment and integration options that are provided by Azure App Service. For more information, see [Continuous deployment for Azure Functions](functions-continuous-deployment.md).

To speed development, you may find it easier to deploy your function app project files directly from a compressed .zip file. The .zip deployment API takes the contents of a compressed .zip file and expands the contents into the `wwwroot` folder of your function app. This .zip file deployment uses the same Kudu service that powers continuous integration-based deployments, including:

+ Deletion of files that were left over from earlier deployments.
+ Deployment customization, including running deployment scripts.
+ Deployment logs.
+ Syncing function triggers in a [Consumption plan](functions-scale.md) function app.

For more information, see the [.zip deployment reference](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file).

You can also [run your function app directly from the mounted .zip file](#run-from-zip).

## Deployment .zip file requirements

The .zip file that you use for push deployment must contain all of the files needed to run your function.

>[!IMPORTANT]
> When you use .zip deployment, any files from an existing deployment that aren't found in the .zip file are deleted from your function app.  

[!INCLUDE [functions-folder-structure](../../includes/functions-folder-structure.md)]

A function app includes all of the files and folders in the `wwwroot` directory. A .zip file deployment includes the contents of the `wwwroot` directory, but not the directory itself. When deploying a C# class library project, you must include the compiled library files and dependencies in a `bin` subfolder in your .zip package.

## Download your function app files

When you are developing on a local computer, it's easy to create a .zip file of the function app project folder on your development computer.

However, you might have created your functions by using the editor in the Azure portal. You can download an existing function app project in one of these ways:

+ **From the Azure portal:**

    1. Sign in to the [Azure portal](https://portal.azure.com), and then go to your function app.

    2. On the **Overview** tab, select **Download app content**. Select your download options, and then select **Download**.

        ![Download the function app project](./media/deployment-zip-push/download-project.png)

    The downloaded .zip file is in the correct format to be republished to your function app by using .zip push deployment. The portal download can also add the files needed to open your function app directly in Visual Studio.

+ **Using REST APIs:**

    Use the following deployment GET API to download the files from your `<function_app>` project: 

        https://<function_app>.scm.azurewebsites.net/api/zip/site/wwwroot/

    Including `/site/wwwroot/` makes sure your zip file includes only the function app project files and not the entire site. If you are not already signed in to Azure, you will be asked to do so.  

You can also download a .zip file from a GitHub repository. When you download a GitHub repository as a .zip file, GitHub adds an extra folder level for the branch. This extra folder level means that you can't deploy the .zip file directly as you downloaded it from GitHub. If you're using a GitHub repository to maintain your function app, you should use [continuous integration](functions-continuous-deployment.md) to deploy your app.  

## <a name="cli"></a>Deploy by using Azure CLI

You can use Azure CLI to trigger a push deployment. Push deploy a .zip file to your function app by using the [az functionapp deployment source config-zip](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip) command. To use this command, you must use Azure CLI version 2.0.21 or later. To see what Azure CLI version you are using, use the `az --version` command.

In the following command, replace the `<zip_file_path>` placeholder with the path to the location of your .zip file. Also, replace `<app_name>` with the unique name of your function app. 

```azurecli-interactive
az functionapp deployment source config-zip  -g myResourceGroup -n \
<app_name> --src <zip_file_path>
```

This command deploys project files from the downloaded .zip file to your function app in Azure. It then restarts the app. To view the list of deployments for this function app, you must use the REST APIs.

When you're using Azure CLI on your local computer, `<zip_file_path>` is the path to the .zip file on your computer. You can also run Azure CLI in [Azure Cloud Shell](../cloud-shell/overview.md). When you use Cloud Shell, you must first upload your deployment .zip file to the Azure Files account that's associated with your Cloud Shell. In that case, `<zip_file_path>` is the storage location that your Cloud Shell account uses. For more information, see [Persist files in Azure Cloud Shell](../cloud-shell/persisting-shell-storage.md).

[!INCLUDE [app-service-deploy-zip-push-rest](../../includes/app-service-deploy-zip-push-rest.md)]

## <a name="run-from-zip"></a>Run directly from the package

> [!NOTE]
> The functionality to run from a zip file is currently in preview and is not available for Functions running on Linux.

You can also choose to run your functions directly from the .zip deployment file. This method skips the deployment step of copying files from the package to the `wwwroot` directory of your function app. Instead, the .zip file is mounted by the Functions runtime, and the contents of the `wwwroot` directory become read-only.  

### Benefits of running from the zip file
  
There are several benefits to running from the zip file:

+ Reduces the risk of file copy locking issues.
+ Can be deployed to a production app (with restart).
+ You can be certain of the files that are running in your app.
+ Improves the performance of [Azure Resource Manager deployments](functions-infrastructure-as-code.md).
+ May reduce the cold-start time of JavaScript functions.

Because of these benefits, you should run from your zip file unless it is not feasible. For more information, see [this announcement](https://github.com/Azure/app-service-announcements/issues/84).

### Enabling the run from zip functionality

To enable your function app to run from a .zip file, you just add a `WEBSITE_RUN_FROM_ZIP` setting to your function app settings, which points to the URL of the .zip file package. The following example enables the function app to run from a file hosted in Azure Blob storage:

    WEBSITE_RUN_FROM_ZIP=https://<myblobstorage>.blob.core.windows.net/content/MyFunctionApp1.zip?<sas-token>

Protect the package from public access by using a [Shared Access Signature (SAS)](../vs-azure-tools-storage-manage-with-storage-explorer.md#attach-a-storage-account-by-using-a-shared-access-signature-sas). You can use the [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to upload .zip files to your Blob storage account.

You can also set `WEBSITE_RUN_FROM_ZIP` to `1` and copy your package to a `d:\home\data\SitePackages` folder in your function app. This copy operation can be done for you automatically when you deploy using the .zip deployment APIs.

### Integration with .zip deployment

The easiest way to deploy a .zip file to the `d:\home\data\SitePackages`folder is by setting the `WEBSITE_RUN_FROM_ZIP` app setting to `1`. With this setting, the .zip deployment APIs upload your package to the correct folder and the function app is run from the package contents after a restart.

You can set function app settings [in the portal](functions-how-to-use-azure-function-app-settings.md#manage-app-service-settings) and by [using the Azure CLI](https://docs.microsoft.com/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set).

[!INCLUDE [app-service-deploy-zip-push-custom](../../includes/app-service-deploy-zip-push-custom.md)]

## Next steps

> [!div class="nextstepaction"]
> [Continuous deployment for Azure Functions](functions-continuous-deployment.md)

[.zip push deployment reference topic]: https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file
