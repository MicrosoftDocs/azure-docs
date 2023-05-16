---
title: Upload image data in the cloud with Azure Storage 
description: This tutorial creates a web app that stores and displays images from Azure storage. It's a prerequisite for an Event Grid tutorial that's linked at the end of this article. 
ms.topic: tutorial
ms.date: 05/16/2023
---

# Step 1: Upload image data in the cloud with Azure Storage

This tutorial is part one of a series. In this tutorial, you'll learn how to deploy a web app. The web app uses the Azure Blob Storage client library to upload images to a storage account. When you're finished, you'll have a web app that stores and displays images from Azure storage.

:::image type="content" source="media/storage-upload-process-images/image-resizer-app.png" alt-text="Screenshot of the Image Resizer .NET app.":::

In part one of the series, you learn how to:

> [!div class="checklist"]

> - Create a storage account
> - Create a container and set permissions
> - Retrieve an access key
> - Deploy a web app to Azure
> - Configure app settings
> - Interact with the web app

## Prerequisites

To complete this tutorial, you need an Azure subscription. Create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create a resource group
Create a resource group with the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

> [!NOTE]
> Set appropriate values for `region` and `rgName` (resource group name). 

```powershell
$region="eastus"
$rgName="egridtutorialrg"
New-AzResourceGroup -Name $rgName -Location $region
```

## Create a storage account
The sample uploads images to a blob container in an Azure storage account. A storage account provides a unique namespace to store and access your Azure storage data objects.

> [!IMPORTANT]
> In part 2 of the tutorial, you use Azure Event Grid with Blob storage. Make sure to create your storage account in an Azure region that supports Event Grid. For a list of supported regions, see [Azure products by region](https://azure.microsoft.com/global-infrastructure/services/?products=event-grid&regions=all).

Create a storage account in the resource group you created by using the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) command. Note down the Azure Storage account name that's displayed in the output. 

```powershell
$blobStorageAccount="myblobstorage" + (Get-Random).ToString()
echo $blobStorageAccount
New-AzStorageAccount -ResourceGroupName $rgName -Name $blobStorageAccount -SkuName Standard_LRS -Location $region -Kind StorageV2 -AccessTier Hot -AllowBlobPublicAccess $true
```

## Create Blob storage containers
The app uses two containers in the Blob storage account. Containers are similar to folders and store blobs. The *images* container is where the app uploads full-resolution images. In a later part of the series, an Azure function app uploads resized image thumbnails to the *thumbnail* container.

The *images* container's public access is set to `off`. The *thumbnails* container's public access is set to `container`. The `container` public access setting permits users who visit the web page to view the thumbnails.

Get the storage account key by using the [Get-AzStorageAccountKey](/powershell/module/az.storage/get-azstorageaccountkey) command. Then, use this key to create two containers with the [New-AzStorageContainer](/powershell/module/az.storage/new-azstoragecontainer) command.

```powershell
$blobStorageAccountKey = ((Get-AzStorageAccountKey -ResourceGroupName $rgName -Name $blobStorageAccount)| Where-Object {$_.KeyName -eq "key1"}).Value
$blobStorageContext = New-AzStorageContext -StorageAccountName $blobStorageAccount -StorageAccountKey $blobStorageAccountKey

New-AzStorageContainer -Name images -Context $blobStorageContext
New-AzStorageContainer -Name thumbnails -Permission Container -Context $blobStorageContext
```

Make a note of your Blob storage account name and key. The sample app uses these settings to connect to the storage account to upload the images.

## Create an App Service plan
An [App Service plan](../app-service/overview-hosting-plans.md) specifies the location, size, and features of the web server farm that hosts your app. The following example creates an App Service plan named `myAppServicePlan` in the **Free** pricing tier by using the [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan) command.

```powershell
$planName="MyAppServicePlan"
New-AzAppServicePlan -ResourceGroupName myResourceGroup -Name $planName -Tier "Free" -Location $region
```

## Create a web app

The web app provides a hosting space for the sample app code that's deployed from the GitHub sample repository.


Create a [web app](../app-service/overview.md) in the `myAppServicePlan` App Service plan with the [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) command. Note down the web app name. If `<web_app>` isn't unique, you get the error message: *Website with given name `<web_app>` already exists.* The default URL of the web app is `https://<web_app>.azurewebsites.net`.

```powershell
$webapp="MyWebApp" + (Get-Random).ToString()
echo $webapp
New-AzWebApp -ResourceGroupName $rgName -Name $webapp -AppServicePlan $planName
```

## Deploy the sample app from the GitHub repository
App Service supports several ways to deploy content to a web app. In this tutorial, you deploy the web app from a [public GitHub sample repository](https://github.com/Azure-Samples/storage-blob-upload-from-webapp). Configure GitHub deployment to the web app with the [az webapp deployment source config](/cli/azure/webapp/deployment/source) command.

The sample project contains an [ASP.NET MVC](https://www.asp.net/mvc) app. The app accepts an image, saves it to a storage account, and displays images from a thumbnail container. The web app uses the [Azure.Storage](/dotnet/api/azure.storage), [Azure.Storage.Blobs](/dotnet/api/azure.storage.blobs), and [Azure.Storage.Blobs.Models](/dotnet/api/azure.storage.blobs.models) namespaces to interact with the Azure Storage service.

```powershell
az webapp deployment source config --name $webapp --resource-group $rgName `
  --branch master --manual-integration `
  --repo-url https://github.com/Azure-Samples/storage-blob-upload-from-webapp
```


## Configure web app settings
The sample web app uses the [Azure Storage APIs for .NET](/dotnet/api/overview/azure/storage) to upload images. Storage account credentials are set in the app settings for the web app. Add app settings to the deployed app with the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings) or [New-AzStaticWebAppSetting](/powershell/module/az.websites/new-azstaticwebappsetting) command.

```powershell
Set-AzWebApp -ResourceGroupName $rgName -Name $webapp -AppSettings `
  @{ `
    'AzureStorageConfig__AccountName' = $blobStorageAccount; `
    'AzureStorageConfig__ImageContainer' = 'images'; `
    'AzureStorageConfig__ThumbnailContainer' = 'thumbnails'; `
    'AzureStorageConfig__AccountKey' = $blobStorageAccountKey `
  }
```

After you deploy and configure the web app, you can test the image upload functionality in the app.

## Upload an image

To test the web app, browse to the URL of your published app. The default URL of the web app is `https://<web_app>.azurewebsites.net`.

Select the **Upload photos** region to specify and upload a file, or drag a file onto the region. The image disappears if successfully uploaded. The **Generated Thumbnails** section will remain empty until we test it later in this tutorial.

:::image type="content" source="media/storage-upload-process-images/upload-photos.png" alt-text="Screenshot of the page to upload photos in the Image Resizer .NET app.":::

In the sample code, the `UploadFileToStorage` task in the *Storagehelper.cs* file is used to upload the images to the *images* container within the storage account using the [UploadAsync](/dotnet/api/azure.storage.blobs.blobclient.uploadasync) method. The following code sample contains the `UploadFileToStorage` task.

```csharp
public static async Task<bool> UploadFileToStorage(Stream fileStream, string fileName,
                                                    AzureStorageConfig _storageConfig)
{
    // Create a URI to the blob
    Uri blobUri = new Uri("https://" +
                          _storageConfig.AccountName +
                          ".blob.core.windows.net/" +
                          _storageConfig.ImageContainer +
                          "/" + fileName);

    // Create StorageSharedKeyCredentials object by reading
    // the values from the configuration (appsettings.json)
    StorageSharedKeyCredential storageCredentials =
        new StorageSharedKeyCredential(_storageConfig.AccountName, _storageConfig.AccountKey);

    // Create the blob client.
    BlobClient blobClient = new BlobClient(blobUri, storageCredentials);

    // Upload the file
    await blobClient.UploadAsync(fileStream);

    return await Task.FromResult(true);
}
```

The following classes and methods are used in the preceding task:

| Class | Method |
|-------|--------|
| [Uri](/dotnet/api/system.uri) | [Uri constructor](/dotnet/api/system.uri.-ctor) |
| [StorageSharedKeyCredential](/dotnet/api/azure.storage.storagesharedkeycredential) | [StorageSharedKeyCredential(String, String) constructor](/dotnet/api/azure.storage.storagesharedkeycredential.-ctor) |
| [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) | [UploadAsync](/dotnet/api/azure.storage.blobs.blobclient.uploadasync) |


## Verify the image is shown in the storage account

Sign in to the [Azure portal](https://portal.azure.com). From the left menu, select **Storage accounts**, then select the name of your storage account. Select **Containers**, then select the **images** container.

Verify the image is shown in the container.

:::image type="content" source="media/storage-upload-process-images/images-in-container.png" alt-text="Screenshot of the Container page showing the list of uploaded images.":::

## Test thumbnail viewing

To test thumbnail viewing, you'll upload an image to the **thumbnails** container to check whether the app can read the **thumbnails** container.

Sign in to the [Azure portal](https://portal.azure.com). From the left menu, select **Storage accounts**, then select the name of your storage account. Select **Containers**, then select the **thumbnails** container. Select **Upload** to open the **Upload blob** pane.

Choose a file with the file picker and select **Upload**.

Navigate back to your app to verify that the image uploaded to the **thumbnails** container is visible.

![.NET image resizer app with new image displayed](media/storage-upload-process-images/image-resizer-app.png)

In part two of the series, you automate thumbnail image creation so you don't need this image. In the **thumbnails** container, select the image you uploaded, and select **Delete** to remove the image.

You can enable Content Delivery Network (CDN) to cache content from your Azure storage account. For more information, see [Integrate an Azure storage account with Azure CDN](../cdn/cdn-create-a-storage-account-with-cdn.md).

## Next steps

In part one of the series, you learned how to configure a web app to interact with storage.

Go on to part two of the series to learn about using Event Grid to trigger an Azure function to resize an image.

> [!div class="nextstepaction"]
> [Use Event Grid to trigger an Azure Function to resize an uploaded image](resize-images-on-storage-blob-upload-event.md)
