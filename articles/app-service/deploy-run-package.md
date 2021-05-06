---
title: Run your app from a ZIP package 
description: Deploy your app's ZIP package with atomicity. Improve the predictability and reliability of your app's behavior during the ZIP deployment process.
ms.topic: article
ms.date: 01/14/2020

---

# Run your app in Azure App Service directly from a ZIP package

In [Azure App Service](overview.md), you can run your apps directly from a deployment ZIP package file. This article shows how to enable this functionality in your app.

All other deployment methods in App Service have something in common: your files are deployed to *D:\home\site\wwwroot* in your app (or */home/site/wwwroot* for Linux apps). Since the same directory is used by your app at runtime, it's possible for deployment to fail because of file lock conflicts, and for the app to behave unpredictably because some of the files are not yet updated.

In contrast, when you run directly from a package, the files in the package are not copied to the *wwwroot* directory. Instead, the ZIP package itself gets mounted directly as the read-only *wwwroot* directory. There are several benefits to running directly from a package:

- Eliminates file lock conflicts between deployment and runtime.
- Ensures only full-deployed apps are running at any time.
- Can be deployed to a production app (with restart).
- Improves the performance of Azure Resource Manager deployments.
- May reduce cold-start times, particularly for JavaScript functions with large npm package trees.

> [!NOTE]
> Currently, only ZIP package files are supported.

[!INCLUDE [Create a project ZIP file](../../includes/app-service-web-deploy-zip-prepare.md)]

## Enable running from package

The `WEBSITE_RUN_FROM_PACKAGE` app setting enables running from a package. To set it, run the following command with Azure CLI.

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings WEBSITE_RUN_FROM_PACKAGE="1"
```

`WEBSITE_RUN_FROM_PACKAGE="1"` lets you run your app from a package local to your app. You can also [run from a remote package](#run-from-external-url-instead).

## Run the package

The easiest way to run a package in your App Service is with the Azure CLI [az webapp deployment source config-zip](/cli/azure/webapp/deployment/source#az_webapp_deployment_source_config_zip) command. For example:

```azurecli-interactive
az webapp deployment source config-zip --resource-group <group-name> --name <app-name> --src <filename>.zip
```

Because the `WEBSITE_RUN_FROM_PACKAGE` app setting is set, this command doesn't extract the package content to the *D:\home\site\wwwroot* directory of your app. Instead, it uploads the ZIP file as-is to *D:\home\data\SitePackages*, and creates a *packagename.txt* in the same directory, that contains the name of the ZIP package to load at runtime. If you upload your ZIP package in a different way (such as [FTP](deploy-ftp.md)), you need to create the *D:\home\data\SitePackages* directory and the *packagename.txt* file manually.

The command also restarts the app. Because `WEBSITE_RUN_FROM_PACKAGE` is set, App Service mounts the uploaded package as the read-only *wwwroot* directory and runs the app directly from that mounted directory.

## Run from external URL instead

You can also run a package from an external URL, such as Azure Blob Storage. You can use the [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) to upload package files to your Blob storage account. You should use a private storage container with a [Shared Access Signature (SAS)](../vs-azure-tools-storage-manage-with-storage-explorer.md#generate-a-sas-in-storage-explorer) to enable the App Service runtime to access the package securely. 

Once you upload your file to Blob storage and have an SAS URL for the file, set the `WEBSITE_RUN_FROM_PACKAGE` app setting to the URL. The following example does it by using Azure CLI:

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings WEBSITE_RUN_FROM_PACKAGE="https://myblobstorage.blob.core.windows.net/content/SampleCoreMVCApp.zip?st=2018-02-13T09%3A48%3A00Z&se=2044-06-14T09%3A48%3A00Z&sp=rl&sv=2017-04-17&sr=b&sig=bNrVrEFzRHQB17GFJ7boEanetyJ9DGwBSV8OM3Mdh%2FM%3D"
```

If you publish an updated package with the same name to Blob storage, you need to restart your app so that the updated package is loaded into App Service.

## Troubleshooting

- Running directly from a package makes `wwwroot` read-only. Your app will receive an error if it tries to write files to this directory.
- TAR and GZIP formats are not supported.
- The ZIP file can be at most 1GB
- This feature is not compatible with [local cache](overview-local-cache.md).
- For improved cold-start performance, use the local Zip option (`WEBSITE_RUN_FROM_PACKAGE`=1).

## More resources

- [Continuous deployment for Azure App Service](deploy-continuous-deployment.md)
- [Deploy code with a ZIP or WAR file](deploy-zip.md)
