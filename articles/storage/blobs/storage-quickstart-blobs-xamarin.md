---
title: "Quickstart: Use Xamarin to manage blobs with Azure Blob Storage library v12"
description: Learn to use Xamarin with the Azure Blob Storage client library v12 to create a container, upload or download a blob, list blobs, and delete a container.
author: codemillmatt
ms.author: masoucou
ms.date: 05/09/2022
ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-api, kr2b-contr-experiment
---

# Quickstart: Use Azure Blob Storage client library v12 with Xamarin

This quickstart gets you started using Xamarin with the Azure Blob Storage client library v12. The Xamarin mobile development framework creates C# apps for iOS, Android, and UWP from one .NET codebase.

Blob Storage is optimized for storing massive amounts of unstructured data, like text or binary data, that doesn't fit a particular data model or definition. Blob Storage has three types of resources: a storage account, containers in the storage account, and blobs in the containers.

The following diagram shows the relationship between these types of resources:

![Diagram of Blob Storage architecture.](./media/storage-blobs-introduction/blob1.png)

You can use the following .NET classes to interact with Blob Storage resources:

- [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) manipulates Storage resources and blob containers.
- [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) manipulates Storage containers and their blobs.
- [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) manipulates Storage blobs.
- [BlobDownloadInfo](/dotnet/api/azure.storage.blobs.models.blobdownloadinfo) represents the properties and content returned from downloading a blob.

In this quickstart, you use Xamarin with the Azure Blob Storage client library v12 to:

- [Create a container](#create-a-container)
- [Upload blobs to a container](#upload-blobs-to-a-container)
- [List the blobs in a container](#list-the-blobs-in-a-container)
- [Download blobs](#download-blobs)
- [Delete a container](#delete-a-container)

## Prerequisites

- Azure subscription. [Create one for free](https://azure.microsoft.com/free).
- Azure Storage account. [Create a storage account](../common/storage-account-create.md).
- Visual Studio with the [Mobile Development for .NET](/xamarin/get-started/installation/?pivots=windows) workload installed, or [Visual Studio for Mac](/visualstudio/mac/installation?view=vsmac-2019&preserve-view=true)

## Visual Studio setup

This section walks through preparing a Visual Studio Xamarin project to work with the Azure Blob Storage client library v12.

1. In Visual Studio, create a Blank Forms App named *BlobQuickstartV12*.
1. In Visual Studio **Solution Explorer**, right-click the solution and select **Manage NuGet Packages for Solution**.
1. Search for **Azure.Storage.Blobs**, and install the latest stable version into all projects in your solution.
1. In **Solution Explorer**, from the **BlobQuickstartV12** directory, open the *MainPage.xaml* file for editing.
1. In the code editor, replace everything between the `<ContentPage></ContentPage>` elements with the following code:
   
   ```xaml
   <StackLayout HorizontalOptions="Center" VerticalOptions="Center">
   
       <Button x:Name="uploadButton" Text="Upload Blob" Clicked="Upload_Clicked"  IsEnabled="False"/>
       <Button x:Name="listButton" Text="List Blobs" Clicked="List_Clicked"  IsEnabled="False" />
       <Button x:Name="downloadButton" Text="Download Blob" Clicked="Download_Clicked"  IsEnabled="False" />
       <Button x:Name="deleteButton" Text="Delete Container" Clicked="Delete_Clicked" IsEnabled="False" />
   
       <Label Text="" x:Name="resultsLabel" HorizontalTextAlignment="Center" Margin="0,20,0,0" TextColor="Red" />
   
   </StackLayout>
   ```

## Azure Storage connection

To authorize requests to Azure Storage, you need to add your storage account credentials to your application as a connection string.

[!INCLUDE [storage-quickstart-credentials-xamarin-include](../../../includes/storage-quickstart-credentials-xamarin-include.md)]

## Code examples

The following example code snippets show you how to use the Blob Storage client library for .NET in a Xamarin.Forms app.

### Create class level variables

The following code declares several class-level variables that the samples use to communicate with Blob Storage. Add these lines to *MainPage.xaml.cs*, immediately after the storage account connection string you just added.

```csharp
string fileName = $"{Guid.NewGuid()}-temp.txt";

BlobServiceClient client;
BlobContainerClient containerClient;
BlobClient blobClient;
```

### Create a container

The code creates an instance of the [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) class, then calls the [CreateBlobContainerAsync](/dotnet/api/azure.storage.blobs.blobserviceclient.createblobcontainerasync) method to create the container in your storage account.

The code appends a GUID value to the container name to ensure that it's unique. For more information about naming containers and blobs, see [Name and reference containers, blobs, and metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

Add the following code to the *MainPage.xaml.cs* file:

```csharp
protected async override void OnAppearing()
{            
    string containerName = $"quickstartblobs{Guid.NewGuid()}";

    client = new BlobServiceClient(storageConnectionString);
    containerClient = await client.CreateBlobContainerAsync(containerName);

    resultsLabel.Text = "Container Created\n";

    blobClient = containerClient.GetBlobClient(fileName);

    uploadButton.IsEnabled = true;
}
```

### Upload blobs to a container

The following code snippet:

1. Creates a `MemoryStream` of the text.
1. Uploads the text to a blob by calling the [UploadAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.uploadblobasync#Azure_Storage_Blobs_BlobContainerClient_UploadBlobAsync_System_String_System_IO_Stream_System_Threading_CancellationToken_) function of the [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) class. The code passes in both the filename and the `MemoryStream` of text. This method creates the blob if it doesn't already exist, and overwrites it if it does.

Add the following code to the *MainPage.xaml.cs* file:

```csharp
async void Upload_Clicked(object sender, EventArgs e)
{                                    
    using MemoryStream memoryStream = new MemoryStream(Encoding.UTF8.GetBytes("Hello World!"));

    await containerClient.UploadBlobAsync(fileName, memoryStream);

    resultsLabel.Text += "Blob Uploaded\n";

    uploadButton.IsEnabled = false;
    listButton.IsEnabled = true;
}
```

### List the blobs in a container

This code lists the blobs in the container by calling the [GetBlobsAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobsasync) method. You added only one blob to the container, so the listing operation returns just one blob.

Add this code to the *MainPage.xaml.cs* file:

```csharp
async void List_Clicked(object sender, EventArgs e)
{            
    await foreach (BlobItem blobItem in containerClient.GetBlobsAsync())
    {
        resultsLabel.Text += blobItem.Name + "\n";                
    }

    listButton.IsEnabled = false;
    downloadButton.IsEnabled = true;
}
```

### Download blobs

Download the blob you previously created by calling the [DownloadToAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadtoasync) method. The example code copies the `Stream` representation of the blob into a `MemoryStream` and then into a `StreamReader` to display the text.

Add this code to the *MainPage.xaml.cs* file:

```csharp
async void Download_Clicked(object sender, EventArgs e)
{
    BlobDownloadInfo downloadInfo = await blobClient.DownloadAsync();

    using MemoryStream memoryStream = new MemoryStream();

    await downloadInfo.Content.CopyToAsync(memoryStream);
    memoryStream.Position = 0;

    using StreamReader streamReader = new StreamReader(memoryStream);

    resultsLabel.Text += "Blob Contents: \n";
    resultsLabel.Text += await streamReader.ReadToEndAsync();
    resultsLabel.Text += "\n";

    downloadButton.IsEnabled = false;
    deleteButton.IsEnabled = true;
}
```

### Delete a container

The following code deletes the container and its blobs, by using [DeleteAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.deleteasync).

The app first prompts you to confirm the blob and container deletion. You can then verify that the resources were created correctly, before you delete them.

Add this code to the *MainPage.xaml.cs* file:

```csharp
async void Delete_Clicked(object sender, EventArgs e)
{            
    var deleteContainer = await Application.Current.MainPage.DisplayAlert("Delete Container",
        "You're about to delete the container. Proceed?", "OK", "Cancel");

    if (deleteContainer == false)
        return;

    await containerClient.DeleteAsync();

    resultsLabel.Text += "Container Deleted";

    deleteButton.IsEnabled = false;
}
```

## Run the code

After you add all the code, to run the app on Windows press F5. To run the app on Mac, press Cmd+Enter. When the app starts, it first creates the container. You can then select the buttons to upload, list, and download the blobs, and delete the container.

The app writes to the screen after every operation, with output similar to the following example:

```output
Container Created
Blob Uploaded
98d9a472-8e98-4978-ba4f-081d69d2e6f8-temp.txt
Blob Contents:
Hello World!
Container Deleted
```

Before you begin the clean-up process, verify that the output of the blob's contents match the blob that you uploaded. After you verify the values, confirm the container deletion to finish the quickstart.

## Next steps

In this quickstart, you learned how to use Xamarin to create and delete containers, and upload, download, and list blobs, with the Azure Blob Storage client library v12.

To see Blob storage sample apps, continue to:

> [!div class="nextstepaction"]
> [Azure Blob Storage SDK v12 Xamarin sample](https://github.com/Azure-Samples/storage-blobs-xamarin-quickstart)

- For tutorials, samples, quick starts and other documentation, visit [Azure for mobile developers](/azure/mobile-apps).
- To learn more about Xamarin, see [Get started with Xamarin](/xamarin/get-started/).

Azure.Storage.Blobs reference links:

- [API reference documentation](/dotnet/api/azure.storage.blobs)
- [Client library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs)
- [NuGet package](https://www.nuget.org/packages/Azure.Storage.Blobs)

