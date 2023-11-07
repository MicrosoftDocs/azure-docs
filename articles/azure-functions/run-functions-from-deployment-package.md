---
title: Run your functions from a package file in Azure 
description: Have the Azure Functions runtime run your functions by mounting a deployment package file that contains your function app project files.
ms.topic: conceptual
ms.date: 02/05/2022

---

# Run your functions from a package file in Azure

In Azure, you can run your functions directly from a deployment package file in your function app. The other option is to deploy your files in the `d:\home\site\wwwroot` (Windows) or `/home/site/wwwroot` (Linux) directory of your function app.

This article describes the benefits of running your functions from a package. It also shows how to enable this functionality in your function app.

## Benefits of running from a package file
  
There are several benefits to running from a package file:

+ Reduces the risk of file copy locking issues.
+ Can be deployed to a production app (with restart).
+ You can be certain of the files that are running in your app.
+ Improves the performance of [Azure Resource Manager deployments](functions-infrastructure-as-code.md).
+ May reduce cold-start times, particularly for JavaScript functions with large npm package trees.

For more information, see [this announcement](https://github.com/Azure/app-service-announcements/issues/84).

## Enable functions to run from a package

To enable your function app to run from a package, add a `WEBSITE_RUN_FROM_PACKAGE` setting to your function app settings. The `WEBSITE_RUN_FROM_PACKAGE` setting can have one of the following values:

| Value  | Description  |
|---------|---------|
| **`1`**  | Indicates that the function app runs from a local package file deployed in the `d:\home\data\SitePackages` (Windows) or `/home/data/SitePackages` (Linux) folder of your function app.  |
|**`<URL>`**  | Sets a URL that is the remote location of the specific package file you want to run. Required for functions apps running on Linux in a Consumption plan.  |

The following table indicates the recommended `WEBSITE_RUN_FROM_PACKAGE` options for deployment to a specific operating system and hosting plan:

| Hosting plan | Windows | Linux |
| --- | --- | --- |
| [Consumption](consumption-plan.md) | `1` is highly recommended. | Only `<URL>` is supported. |
| [Premium](functions-premium-plan.md) | `1` is recommended. | `1` is recommended. |
| [Dedicated](dedicated-plan.md) | `1` is recommended. | `1` is recommended. |

## General considerations

+ The package file must be .zip formatted. Tar and gzip formats aren't currently supported.
+ [Zip deployment](#integration-with-zip-deployment) is recommended.
+ When deploying your function app to Windows, you should set `WEBSITE_RUN_FROM_PACKAGE` to `1` and publish with zip deployment.
+ When you run from a package, the `wwwroot` folder becomes read-only and you'll receive an error when writing files to this directory. Files are also read-only in the Azure portal.
+ The maximum size for a deployment package file is currently 1 GB.
+ You can't use local cache when running from a deployment package.
+ If your project needs to use remote build, don't use the `WEBSITE_RUN_FROM_PACKAGE` app setting. Instead add the `SCM_DO_BUILD_DURING_DEPLOYMENT=true` deployment customization app setting. For Linux, also add the `ENABLE_ORYX_BUILD=true` setting. To learn more, see [Remote build](functions-deployment-technologies.md#remote-build).

> [!NOTE]
> WEBSITE_RUN_FROM_PACKAGE does not work with MSDeploy as described [here](https://github.com/projectkudu/kudu/wiki/MSDeploy-VS.-ZipDeploy). You will receive an error during deployment like `ARM-MSDeploy Deploy Failed`.  Change /MSDeploy to /ZipDeploy and this error will be resolved.

### Adding the WEBSITE_RUN_FROM_PACKAGE setting

[!INCLUDE [Function app settings](../../includes/functions-app-settings.md)]

## Using WEBSITE_RUN_FROM_PACKAGE = 1

This section provides information about how to run your function app from a local package file.

### Considerations for deploying from an on-site package

+ Using an on-site package is the recommended option for running from the deployment package, except on Linux hosted in a Consumption plan.
+ [Zip deployment](#integration-with-zip-deployment) is the recommended way to upload a deployment package to your site.
+ When not using zip deployment, make sure the `d:\home\data\SitePackages` (Windows) or `/home/data/SitePackages` (Linux) folder has a file named `packagename.txt`. This file contains only the name, without any whitespace, of the package file in this folder that's currently running.

### Integration with zip deployment

[Zip deployment][Zip deployment for Azure Functions] is a feature of Azure App Service that lets you deploy your function app project to the `wwwroot` directory. The project is packaged as a .zip deployment file. The same APIs can be used to deploy your package to the `d:\home\data\SitePackages` (Windows) or `/home/data/SitePackages` (Linux) folder.

With the `WEBSITE_RUN_FROM_PACKAGE` app setting value of `1`, the zip deployment APIs copy your package to the `d:\home\data\SitePackages` (Windows) or `/home/data/SitePackages` (Linux) folder instead of extracting the files to `d:\home\site\wwwroot` (Windows) or `/home/site/wwwroot` (Linux). It also creates the `packagename.txt` file. After a restart, the package is mounted to `wwwroot` as a read-only filesystem. For more information about zip deployment, see [Zip deployment for Azure Functions](deployment-zip-push.md).

> [!NOTE]
> When a deployment occurs, a restart of the function app is triggered. Function executions currently running during the deploy are terminated. Please review [Improve the performance and reliability of Azure Functions](performance-reliability.md#write-functions-to-be-stateless) to learn how to write stateless and defensive functions.

## Using WEBSITE_RUN_FROM_PACKAGE = URL

This section provides information about how to run your function app from a package deployed to a URL endpoint. This option is the only one supported for running from a package on Linux hosted in a Consumption plan.

### Considerations for deploying from a URL

<a name="troubleshooting"></a>

+ When running a function app on Windows, the app setting `WEBSITE_RUN_FROM_PACKAGE = <URL>` gives worse cold-start performance and isn't recommended.
+ When you specify a URL, you must also [manually sync triggers](functions-deployment-technologies.md#trigger-syncing) after you publish an updated package.
+ The Functions runtime must have permissions to access the package URL.
+ You shouldn't deploy your package to Azure Blob Storage as a public blob. Instead, use a private container with a [Shared Access Signature (SAS)](../storage/common/storage-sas-overview.md) or [use a managed identity](#fetch-a-package-from-azure-blob-storage-using-a-managed-identity) to enable the Functions runtime to access the package.
+ You must maintain any SAS URLs used for deployment. When an SAS expires, the package can no longer be deployed. In this case, you must generate a new SAS and update the setting in your function app. You can eliminate this management burden by [using a managed identity](#fetch-a-package-from-azure-blob-storage-using-a-managed-identity).
+ When running on a Premium plan, make sure to [eliminate cold starts](functions-premium-plan.md#eliminate-cold-starts).
+ When running on a Dedicated plan, make sure you've enabled [Always On](dedicated-plan.md#always-on).
+ You can use the [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) to upload package files to blob containers in your storage account.

### Manually uploading a package to Blob Storage

To deploy a zipped package when using the URL option, you must create a .zip compressed deployment package and upload it to the destination. This example deploys to a container in Blob Storage.

1. Create a .zip package for your project using the utility of your choice.

1. In the [Azure portal](https://portal.azure.com), search for your storage account name or browse for it in storage accounts.

1. In the storage account, select **Containers** under **Data storage**.

1. Select **+ Container** to create a new Blob Storage container in your account.

1. In the **New container** page, provide a **Name** (for example, "deployments"), make sure the **Public access level** is **Private**, and select **Create**.

1. Select the container you created, select **Upload**, browse to the location of the .zip file you created with your project, and select **Upload**.

1. After the upload completes, choose your uploaded blob file, and copy the URL. You may need to generate a SAS URL if you aren't [using an identity](#fetch-a-package-from-azure-blob-storage-using-a-managed-identity)

1. Search for your function app or browse for it in the **Function App** page.

1. In your function app, select **Configurations** under **Settings**.

1. In the **Application Settings** tab, select **New application setting**

1. Enter the value `WEBSITE_RUN_FROM_PACKAGE` for the **Name**, and paste the URL of your package in Blob Storage as the **Value**.

1. Select **OK**. Then select  **Save** > **Continue** to save the setting and restart the app.

Now you can run your function in Azure to verify that deployment has succeeded using the deployment package .zip file.

The following shows a function app configured to run from a .zip file hosted in Azure Blob storage:

![WEBSITE_RUN_FROM_ZIP app setting](./media/run-functions-from-deployment-package/run-from-zip-app-setting-portal.png)

### Fetch a package from Azure Blob Storage using a managed identity

[!INCLUDE [Run from package via Identity](../../includes/app-service-run-from-package-via-identity.md)]

## Next steps

> [!div class="nextstepaction"]
> [Continuous deployment for Azure Functions](functions-continuous-deployment.md)

[Zip deployment for Azure Functions]: deployment-zip-push.md
