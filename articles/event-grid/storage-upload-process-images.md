---
title: Upload image data in the cloud with Azure Storage 
description: This tutorial creates a web app that stores and displays images from Azure storage. It's a prerequisite for an Event Grid tutorial that's linked at the end of this article. 
ms.topic: tutorial
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 05/16/2023
---

# Step 1: Upload image data in the cloud with Azure Storage

This tutorial is part one of a series. In this tutorial, you learn how to deploy a web app. The web app uses the Azure Blob Storage client library to upload images to a storage account. 

In part one of the series, you do the following tasks:

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

> [!IMPORTANT]
> In step 2 of the tutorial, you use Azure Event Grid with the blob storage you create in this step. Create your storage account in an Azure region that supports Event Grid. For a list of supported regions, see [Azure products by region](https://azure.microsoft.com/global-infrastructure/services/?products=event-grid&regions=all).


# [Azure CLI](#tab/azure-cli)

1. In the Azure Cloud Shell, select **Bash** in the top-left corner if it's not already selected. 

    :::image type="content" source="./media/storage-upload-process-images/cloud-bash.png" alt-text="Screenshot showing the Azure Cloud Shell with the Bash option selected.":::
1. Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

    > [!NOTE]
    > Set appropriate values for `region` and `rgName` (resource group name). 
    

    ```azurecli
    region="eastus"
    rgName="egridtutorialrg"
    az group create --name $rgName --location $region
    
    ```
# [PowerShell](#tab/azure-powershell)

1. In the Azure Cloud Shell, select **PowerShell** in the top-left corner if it's not already selected. 

    :::image type="content" source="./media/storage-upload-process-images/cloud-powershell.png" alt-text="Screenshot showing the Azure Cloud Shell with the PowerShell option selected.":::
2. Create a resource group with the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

    > [!NOTE]
    > Set appropriate values for `region` and `rgName` (resource group name). 
    
    ```powershell
    $region="eastus"
    $rgName="egridtutorialrg"
    New-AzResourceGroup -Name $rgName -Location $region
    
    ```
        
---

## Create a storage account
The sample uploads images to a blob container in an Azure storage account. 

# [Azure CLI](#tab/azure-cli)

Create a storage account in the resource group you created by using the [az storage account create](/cli/azure/storage/account) command.

```azurecli
blobStorageAccount="myblobstorage$RANDOM"

az storage account create --name $blobStorageAccount --location $region \
  --resource-group $rgName --sku Standard_LRS --kind StorageV2 --access-tier hot --allow-blob-public-access true
```

# [PowerShell](#tab/azure-powershell)
Create a storage account in the resource group you created by using the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) command. Note down the Azure Storage account name that's displayed in the output. 

```powershell
$blobStorageAccount="myblobstorage" + (Get-Random).ToString()
echo $blobStorageAccount
New-AzStorageAccount -ResourceGroupName $rgName -Name $blobStorageAccount -SkuName Standard_LRS -Location $region -Kind StorageV2 -AccessTier Hot -AllowBlobPublicAccess $true

```

---

## Create Blob storage containers
The app uses two containers in the Blob storage account. The **images** container is where the app uploads full-resolution images. In the second step of the series, an Azure function app uploads resized image thumbnails to the **thumbnails** container.

The **images** container's public access is set to `off`. The **thumbnails** container's public access is set to `container`. The `container` public access setting permits users who visit the web page to view the thumbnails.

# [Azure CLI](#tab/azure-cli)

Get the storage account key by using the [az storage account keys list](/cli/azure/storage/account/keys) command. Then, use this key to create two containers with the [az storage container create](/cli/azure/storage/container) command.

```azurecli
blobStorageAccountKey=$(az storage account keys list -g $rgName \
  -n $blobStorageAccount --query "[0].value" --output tsv)

az storage container create --name images \
  --account-name $blobStorageAccount \
  --account-key $blobStorageAccountKey

az storage container create --name thumbnails \
  --account-name $blobStorageAccount \
  --account-key $blobStorageAccountKey --public-access container

```

# [PowerShell](#tab/azure-powershell)
Get the storage account key by using the [Get-AzStorageAccountKey](/powershell/module/az.storage/get-azstorageaccountkey) command. Then, use this key to create two containers with the [New-AzStorageContainer](/powershell/module/az.storage/new-azstoragecontainer) command.

```powershell
$blobStorageAccountKey = ((Get-AzStorageAccountKey -ResourceGroupName $rgName -Name $blobStorageAccount)| Where-Object {$_.KeyName -eq "key1"}).Value
$blobStorageContext = New-AzStorageContext -StorageAccountName $blobStorageAccount -StorageAccountKey $blobStorageAccountKey

New-AzStorageContainer -Name images -Context $blobStorageContext
New-AzStorageContainer -Name thumbnails -Permission Container -Context $blobStorageContext

```

---

The sample app connects to the storage account using its name and access key.

## Create an App Service plan
An [App Service plan](../app-service/overview-hosting-plans.md) specifies the location, size, and features of the web server farm that hosts your app. The following example creates an App Service plan named `myAppServicePlan` in the **Free** pricing tier:


# [Azure CLI](#tab/azure-cli)

Create an App Service plan with the [az appservice plan create](/cli/azure/appservice/plan) command.

```azurecli
planName="MyAppServicePlan"
az appservice plan create --name $planName --resource-group $rgName --sku Free

```

# [PowerShell](#tab/azure-powershell)

Create an App Service plan with the [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan) command.

```powershell
$planName="MyAppServicePlan"
New-AzAppServicePlan -ResourceGroupName $rgName -Name $planName -Tier "Free" -Location $region

```

---

## Create a web app

The web app provides a hosting space for the sample app code that's deployed from the GitHub sample repository. 

# [Azure CLI](#tab/azure-cli)

Create a [web app](../app-service/overview.md) in the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp) command.

```azurecli
webapp="mywebapp$RANDOM"

az webapp create --name $webapp --resource-group $rgName --plan $planName
```

# [PowerShell](#tab/azure-powershell)
Create a [web app](../app-service/overview.md) in the app service plan using the [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) command. Note down the web app name. The default URL of the web app is `https://<web_app>.azurewebsites.net`.

```powershell
$webapp="MyWebApp" + (Get-Random).ToString()
echo $webapp
New-AzWebApp -ResourceGroupName $rgName -Name $webapp -AppServicePlan $planName

```

---

## Deploy the sample app from the GitHub repository
App Service supports several ways to deploy content to a web app. In this tutorial, you deploy the web app from a [public GitHub sample repository](https://github.com/Azure-Samples/storage-blob-upload-from-webapp). Configure GitHub deployment to the web app with the [az webapp deployment source config](/cli/azure/webapp/deployment/source) command.

The sample project contains an [ASP.NET MVC](https://www.asp.net/mvc) app. The app accepts an image, saves it to a storage account, and displays images from a thumbnail container. The web app uses the [Azure.Storage](/dotnet/api/azure.storage), [Azure.Storage.Blobs](/dotnet/api/azure.storage.blobs), and [Azure.Storage.Blobs.Models](/dotnet/api/azure.storage.blobs.models) namespaces to interact with the Azure Storage service.

# [Azure CLI](#tab/azure-cli)
```azurecli
az webapp deployment source config --name $webapp --resource-group $rgName \
  --branch master --manual-integration \
  --repo-url https://github.com/Azure-Samples/storage-blob-upload-from-webapp

```

# [PowerShell](#tab/azure-powershell)
```powershell
az webapp deployment source config --name $webapp --resource-group $rgName `
  --branch master --manual-integration `
  --repo-url https://github.com/Azure-Samples/storage-blob-upload-from-webapp

```

---

## Configure web app settings
The sample web app uses the [Azure Storage APIs for .NET](/dotnet/api/overview/azure/storage) to upload images. Storage account credentials are set in the app settings for the web app. Add app settings to the deployed app with the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings) or [New-AzStaticWebAppSetting](/powershell/module/az.websites/new-azstaticwebappsetting) command.

# [Azure CLI](#tab/azure-cli)    

```azurecli
az webapp config appsettings set --name $webapp --resource-group $rgName \
  --settings AzureStorageConfig__AccountName=$blobStorageAccount \
    AzureStorageConfig__ImageContainer=images \
    AzureStorageConfig__ThumbnailContainer=thumbnails \
    AzureStorageConfig__AccountKey=$blobStorageAccountKey

```

# [PowerShell](#tab/azure-powershell)
```powershell
Set-AzWebApp -ResourceGroupName $rgName -Name $webapp -AppSettings `
  @{ `
    'AzureStorageConfig__AccountName' = $blobStorageAccount; `
    'AzureStorageConfig__ImageContainer' = 'images'; `
    'AzureStorageConfig__ThumbnailContainer' = 'thumbnails'; `
    'AzureStorageConfig__AccountKey' = $blobStorageAccountKey `
  }

```

---

After you deploy and configure the web app, you can test the image upload functionality in the app.

## Upload an image

To test the web app, browse to the URL of your published app. The default URL of the web app is `https://<web_app>.azurewebsites.net`. Then, select the **Upload photos** region to specify and upload a file, or drag a file onto the region. The image disappears if successfully uploaded. The **Generated Thumbnails** section remains empty until we test it later in this tutorial.

> [!NOTE]
> Run the following command to get the name of the web app: `echo $webapp`

:::image type="content" source="media/storage-upload-process-images/upload-photos.png" alt-text="Screenshot of the page to upload photos in the Image Resizer .NET app.":::

In the sample code, the `UploadFileToStorage` task in the **Storagehelper.cs** file is used to upload the images to the **images** container within the storage account using the [UploadAsync](/dotnet/api/azure.storage.blobs.blobclient.uploadasync) method. The following code sample contains the `UploadFileToStorage` task.

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

1. Sign in to the [Azure portal](https://portal.azure.com). From the left menu, select **Storage accounts**, then select the name of your storage account.

    > [!NOTE]
    > Run the following to get the name of the storage account: `echo $blobStorageAccount`.
1. On the left menu, in the **Data storage** section, select **Containers**.
1. Select the **images** blob container.
1. Verify the image is shown in the container.

    :::image type="content" source="media/storage-upload-process-images/images-in-container.png" alt-text="Screenshot of the Container page showing the list of uploaded images.":::

## Test thumbnail viewing

To test thumbnail viewing, you upload an image to the **thumbnails** container to check whether the app can read the **thumbnails** container.

1. Sign in to the [Azure portal](https://portal.azure.com). From the left menu, select **Storage accounts**, then select the name of your storage account. Select **Containers**, then select the **thumbnails** container. Select **Upload** to open the **Upload blob** pane.
2. Choose a file with the file picker and select **Upload**.
3. Navigate back to your app to verify that the image uploaded to the **thumbnails** container is visible.

    :::image type="content" source="media/storage-upload-process-images/image-resizer-app.png" alt-text="Screenshot of the web app showing the thumbnail image.":::

4. In part two of the series, you automate thumbnail image creation so you don't need this image. In the **thumbnails** container, select the image you uploaded, and select **Delete** to remove the image.

## Next steps

> [!div class="nextstepaction"]
> [Use Event Grid to trigger an Azure Function to resize an uploaded image](resize-images-on-storage-blob-upload-event.md)
