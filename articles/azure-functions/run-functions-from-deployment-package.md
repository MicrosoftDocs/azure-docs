---
title: Run your Azure Functions from a package | Microsoft Docs
description: Have the Azure Functions runtime run your functions by mounting a deployment package file that contains your function app project files.
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc

ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 02/26/2019
ms.author: glenga

---

# Run your Azure Functions from a package file

> [!NOTE]
> The functionality described in this article is not available for function apps running on Linux in an [App Service plan](functions-scale.md#app-service-plan).

In Azure, you can run your functions directly from a deployment package file in your function app. The other option is to deploy your files in the `d:\home\site\wwwroot` directory of your function app.

This article describes the benefits of running your functions from a package. It also shows how to enable this functionality in your function app.

## Benefits of running from a package file
  
There are several benefits to running from a package file:

+ Reduces the risk of file copy locking issues.
+ Can be deployed to a production app (with restart).
+ You can be certain of the files that are running in your app.
+ Improves the performance of [Azure Resource Manager deployments](functions-infrastructure-as-code.md).
+ May reduce cold-start times, particularly for JavaScript functions with large npm package trees.

For more information, see [this announcement](https://github.com/Azure/app-service-announcements/issues/84).

## Enabling functions to run from a package

To enable your function app to run from a package, you just add a `WEBSITE_RUN_FROM_PACKAGE` setting to your function app settings. The `WEBSITE_RUN_FROM_PACKAGE` setting can have one of the following values:

| Value  | Description  |
|---------|---------|
| **`1`**  | Recommended for function apps running on Windows. Run from a package file in the `d:\home\data\SitePackages` folder of your function app. If not [deploying with zip deploy](#integration-with-zip-deployment), this option requires the folder to also have a file named `packagename.txt`. This file contains only the name of the package file in folder, without any whitespace. |
|**`<url>`**  | Location of a specific package file you want to run. When using Blob storage, you should use a private container with a [Shared Access Signature (SAS)](../vs-azure-tools-storage-manage-with-storage-explorer.md#generate-a-sas-in-storage-explorer) to enable the Functions runtime to access to the package. You can use the [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) to upload package files to your Blob storage account.         |

> [!CAUTION]
> When running a function app on Windows, the external URL option yields worse cold-start performance. When deploying your function app to Windows, you should set `WEBSITE_RUN_FROM_PACKAGE` to `1` and publish with zip deployment.

The following shows a function app configured to run from a .zip file hosted in Azure Blob storage:

![WEBSITE_RUN_FROM_ZIP app setting](./media/run-functions-from-deployment-package/run-from-zip-app-setting-portal.png)

> [!NOTE]
> Currently, only .zip package files are supported.

## Integration with zip deployment

[Zip deployment][Zip deployment for Azure Functions] is a feature of Azure App Service that lets you deploy your function app project to the `wwwroot` directory. The project is packaged as a .zip deployment file. The same APIs can be used to deploy your package to the `d:\home\data\SitePackages` folder. With the `WEBSITE_RUN_FROM_PACKAGE` app setting value of `1`, the zip deployment APIs copy your package to the `d:\home\data\SitePackages` folder instead of extracting the files to `d:\home\site\wwwroot`. It also creates the `packagename.txt` file. The function app is then run from the package after a restart, and `wwwroot` becomes read-only. For more information about zip deployment, see [Zip deployment for Azure Functions](deployment-zip-push.md).

## Adding the WEBSITE_RUN_FROM_PACKAGE setting

[!INCLUDE [Function app settings](../../includes/functions-app-settings.md)]

## Troubleshooting

- Run From Package makes `wwwroot` read-only, so you will receive an error when writing files to this directory.
- Tar and gzip formats are not supported.
- This feature does not compose with local cache.
- For improved cold-start performance, use the local Zip option (`WEBSITE_RUN_FROM_PACKAGE`=1).

## Next steps

> [!div class="nextstepaction"]
> [Continuous deployment for Azure Functions](functions-continuous-deployment.md)

[Zip deployment for Azure Functions]: deployment-zip-push.md
