---
title: Run your Azure Functions from a package 
description: Have the Azure Functions runtime run your functions by mounting a deployment package file that contains your function app project files.
ms.topic: conceptual
ms.date: 07/15/2019

---

# Run your Azure Functions from a package file

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
|**`<URL>`**  | Location of a specific package file you want to run. When you specify a URL, you must also [sync triggers](functions-deployment-technologies.md#trigger-syncing) after you publish an updated package. <br/>When using Blob storage, you typically should not use a public blob. Instead, use a private container with a [Shared Access Signature (SAS)](../vs-azure-tools-storage-manage-with-storage-explorer.md#generate-a-sas-in-storage-explorer) or [use a managed identity](#fetch-a-package-from-azure-blob-storage-using-a-managed-identity) to enable the Functions runtime to access the package. You can use the [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) to upload package files to your Blob storage account. |

> [!CAUTION]
> When running a function app on Windows, the external URL option yields worse cold-start performance. When deploying your function app to Windows, you should set `WEBSITE_RUN_FROM_PACKAGE` to `1` and publish with zip deployment.

The following shows a function app configured to run from a .zip file hosted in Azure Blob storage:

![WEBSITE_RUN_FROM_ZIP app setting](./media/run-functions-from-deployment-package/run-from-zip-app-setting-portal.png)

> [!NOTE]
> Currently, only .zip package files are supported.

### Fetch a package from Azure Blob Storage using a managed identity

[!INCLUDE [Run from package via Identity](../../includes/app-service-run-from-package-via-identity.md)]

## Integration with zip deployment

[Zip deployment][Zip deployment for Azure Functions] is a feature of Azure App Service that lets you deploy your function app project to the `wwwroot` directory. The project is packaged as a .zip deployment file. The same APIs can be used to deploy your package to the `d:\home\data\SitePackages` folder. With the `WEBSITE_RUN_FROM_PACKAGE` app setting value of `1`, the zip deployment APIs copy your package to the `d:\home\data\SitePackages` folder instead of extracting the files to `d:\home\site\wwwroot`. It also creates the `packagename.txt` file. After a restart, the package is mounted to `wwwroot` as a read-only filesystem. For more information about zip deployment, see [Zip deployment for Azure Functions](deployment-zip-push.md).

> [!NOTE]
> When a deployment occurs, a restart of the function app is triggered. Before a restart, all existing function executions are allowed to complete or time out. To learn more, see [Deployment behaviors](functions-deployment-technologies.md#deployment-behaviors).

## Adding the WEBSITE_RUN_FROM_PACKAGE setting

[!INCLUDE [Function app settings](../../includes/functions-app-settings.md)]


## Example workflow for manually uploading a package hosted in Azure Storage

To deploy a zipped package when using the URL option, you must create a .zip compressed deployment package and upload it to the destination. This example uses a Blob Storage container. 

1. Create a .zip package for your project using the utility of your choice.

1. In the [Azure portal](https://portal.azure.com), search for your storage account name or browse for it in storage accounts.
 
1. In the storage account, select **Containers** under **Data storage**.

1. Select **+ Container** to create a new Blob Storage container in your account.

1. In the **New container** page, provide a **Name** (for example, "deployments"), make sure the **Public access level** is **Private**, and select **Create**.

1. Select the container you created, select **Upload**, browse to the location of the .zip file you created with your project, and select **Upload**.

1. After the upload completes, choose your uploaded blob file, and copy the URL. You may need to generate a SAS URL if you are not [using an identity](#fetch-a-package-from-azure-blob-storage-using-a-managed-identity)

1. Search for your function app or browse for it in the **Function App** page. 

1. In your function app, select **Configurations** under **Settings**.

1. In the **Application Settings** tab, select **New application setting**

1. Enter the value `WEBSITE_RUN_FROM_PACKAGE` for the **Name**, and paste the URL of your package in Blob Storage as the **Value**.

1. Select **OK**. Then select  **Save** > **Continue** to save the setting and restart the app.

Now you can run your function in Azure to verify that deployment has succeeded using the deployment package .zip file.

## Troubleshooting

- Run From Package makes `wwwroot` read-only, so you will receive an error when writing files to this directory.
- Tar and gzip formats are not supported.
- The ZIP file can be at most 1GB.
- This feature does not compose with local cache.
- For improved cold-start performance, use the local Zip option (`WEBSITE_RUN_FROM_PACKAGE`=1).
- Run From Package is incompatible with deployment customization option (`SCM_DO_BUILD_DURING_DEPLOYMENT=true`), the build step will be ignored during deployment.

## Next steps

> [!div class="nextstepaction"]
> [Continuous deployment for Azure Functions](functions-continuous-deployment.md)

[Zip deployment for Azure Functions]: deployment-zip-push.md
