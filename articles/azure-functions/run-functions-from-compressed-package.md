---
title: Run your Azure Functions from a .zip deployment package | Microsoft Docs
description: Have the Azure Functions runtime run your functions by mounting a .zip compressed file deployment file that contains your function app project files.
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc
editor: ''
tags: ''

ms.service: functions
ms.devlang: multiple
ms.topic: conceptual
ms.workload: na 
ms.date: 08/13/2018
ms.author: glenga

---

# Run your functions from a compressed deployment package

> [!NOTE]
> The functionality described in this article is currently in preview; it is not available for Functions on Linux.

By default, your function app files in Azure are deployed to the `d:\home\site\wwwroot` directory of your function app. These files are used when your functions run. 

You can also choose to run your functions directly from a compressed deployment (.zip) file. This article describes the benefits of running your functions from a .zip file, and how to enable it in your function app.

## Benefits of running from the zip file
  
There are several benefits to running from a .zip file:

+ Reduces the risk of file copy locking issues.
+ Can be deployed to a production app (with restart).
+ You can be certain of the files that are running in your app.
+ Improves the performance of [Azure Resource Manager deployments](functions-infrastructure-as-code.md).
+ May reduce the cold-start time of JavaScript functions.

For more information, see [this announcement](https://github.com/Azure/app-service-announcements/issues/84).

## Enabling the run from zip functionality

To enable your function app to run from a .zip file, you just add a `WEBSITE_RUN_FROM_ZIP` setting to your function app settings. The `WEBSITE_RUN_FROM_ZIP` setting can have one of the following values:


| Value  | Description  |
|---------|---------|
|**`<url>`**  | Location of a specific .zip file package you want to run. When using Blob storage, you should use a private container with a [Shared Access Signature (SAS)](../vs-azure-tools-storage-manage-with-storage-explorer.md#attach-a-storage-account-by-using-a-shared-access-signature-sas) to enable the Functions runtime to access to the package. You can use the [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to upload .zip files to your Blob storage account.         |
| **`1`**  | Run from a .zip file in the `d:\home\data\SitePackages` folder of your function app. You can use the zip deployment APIs to automatically create and copy a deployment package to this folder. |

The following shows a function app configured to run from a .zip file hosted in Azure Blob storage:

![WEBSITE_RUN_FROM_ZIP app setting](./media/run-functions-from-compressed-package/website-run-from-zip-app-setting.png)

## Integration with .zip deployment

[Zip deployment][Zip deployment for Azure Functions] is a feature of Azure App Service that lets you deploy a .zip file containing your function app project to the `wwwroot` directory. The same APIs can be used to deploy your package to the `d:\home\data\SitePackages` folder. When you have the app setting `WEBSITE_RUN_FROM_ZIP` set to a value of `1`, the zip deployment APIs copy the .zip package to the `d:\home\data\SitePackages` folder instead of extracting the files to `d:\home\site\wwwroot`. The function app is then run from the package after a restart and `wwwroot` becomes read-only. For more information about zip deployment, see [Zip deployment for Azure Functions](deployment-zip-push.md).

## Adding the WEBSITE_RUN_FROM_ZIP setting

There are several ways that you can add the `WEBSITE_RUN_FROM_ZIP` function app setting to enable this functionality:

+ [In the Azure portal.](functions-how-to-use-azure-function-app-settings.md#manage-app-service-settings)
+ [With the Azure CLI.](https://docs.microsoft.com/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set)

## Next steps

> [!div class="nextstepaction"]
> [Continuous deployment for Azure Functions](functions-continuous-deployment.md)

[Zip deployment for Azure Functions]: deployment-zip-push.md