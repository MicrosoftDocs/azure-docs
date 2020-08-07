---
title: "Quickstart: Azure Blob storage library v12 - Xamarin"
description: In this quickstart, you learn how to use the Azure Blob storage client library version 12 with Xamarin to create a container and a blob in Blob (object) storage. Next, you learn how to download the blob to your mobile device, and how to list all of the blobs in a container.
author: codemillmatt

ms.author: masoucou
ms.date: 05/08/2020
ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
---

# Quickstart: Azure Blob storage client library v12 with Xamarin

Get started with the Azure Blob storage client library v12 with Xamarin. Azure Blob storage is Microsoft's object storage solution for the cloud. Follow steps to install the package and try out example code for basic tasks. Blob storage is optimized for storing massive amounts of unstructured data.

Use the Azure Blob storage client library v12 with Xamarin to:

* Create a container
* Upload a blob to Azure Storage
* List all of the blobs in a container
* Download the blob to your device
* Delete a container

[API reference documentation](/dotnet/api/azure.storage.blobs) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Blobs) | [Sample](https://github.com/Azure-Samples/storage-blobs-xamarin-quickstart)

[!INCLUDE [storage-multi-protocol-access-preview](../../../includes/storage-multi-protocol-access-preview.md)]

## Prerequisites

* Azure subscription - [create one for free](https://azure.microsoft.com/free/)
* Azure storage account - [create a storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account)
* Visual Studio with [Mobile Development for .NET workload](https://docs.microsoft.com/xamarin/get-started/installation/?pivots=windows) installed or [Visual Studio for Mac](https://docs.microsoft.com/visualstudio/mac/installation?view=vsmac-2019)

## Setting up
    
This section walks you through preparing a project to work with the Azure Blob storage client library v12 with Xamarin.
    
### Create the project

1. Open Visual Studio and create a Blank Forms App.
1. Name it: BlobQuickstartV12

### Install the package

1. Right-click your solution in the Solution Explorer pane and select **Manage NuGet Packages for Solution**.
1. Search for **Azure.Storage.Blobs** and install the latest stable version into all projects in your solution.

### Set up the app framework

From the **BlobQuickstartV12** directory:

1. Open up the *MainPage.xaml* file in your editor
1. Remove everything between the `<ContentPage></ContentPage>` elements and replace with the below:

```xaml
<StackLayout HorizontalOptions="Center" VerticalOptions="Center">

    <Button x:Name="uploadButton" Text="Upload Blob" Clicked="Upload_Clicked"  IsEnabled="False"/>
    <Button x:Name="listButton" Text="List Blobs" Clicked="List_Clicked"  IsEnabled="False" />
    <Button x:Name="downloadButton" Text="Download Blob" Clicked="Download_Clicked"  IsEnabled="False" />
    <Button x:Name="deleteButton" Text="Delete Container" Clicked="Delete_Clicked" IsEnabled="False" />

    <Label Text="" x:Name="resultsLabel" HorizontalTextAlignment="Center" Margin="0,20,0,0" TextColor="Red" />
        
</StackLayout>
```

[!INCLUDE [storage-quickstart-credentials-xamarin-include](../../../includes/storage-quickstart-credentials-xamarin-include.md)]

## Object model

Azure Blob storage is optimized for storing massive amounts of unstructured data. Unstructured data is data that does not adhere to a particular data model or definition, such as text or binary data. Blob storage offers three types of resources:

* The storage account
* A container in the storage account
* A blob in the container

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

Use the following .NET classes to interact with these resources:

* [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient): The `BlobServiceClient` class allows you to manipulate Azure Storage resources and blob containers.
* [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient): The `BlobContainerClient` class allows you to manipulate Azure Storage containers and their blobs.
* [BlobClient](/dotnet/api/azure.storage.blobs.blobclient): The `BlobClient` class allows you to manipulate Azure Storage blobs.
* [BlobDownloadInfo](/dotnet/api/azure.storage.blobs.models.blobdownloadinfo): The `BlobDownloadInfo` class represents the properties and content returned from downloading a blob.

## Code examples

These example code snippets show you how to perform the following tasks with the Azure Blob storage client library for .NET in a Xamarin.Forms app:

* [Create class level variables](#create-class-level-variables)
* [Create a container](#create-a-container)
* [Upload blobs to a container](#upload-blobs-to-a-container)
* [List the blobs in a container](#list-the-blobs-in-a-container)
* [Download blobs](#download-blobs)
* [Delete a container](#delete-a-container)

### Create class level variables

The code below declares several class level variables. They needed to communicate to Azure Blob storage throughout the rest of this sample.

These are in addition to the connection string for the storage account set in the [Configure your storage connection string](#configure-your-storage-connection-string) section.

Add this code as class level variables inside the *MainPage.xaml.cs* file:

```csharp
string storageConnectionString = "{set in the Configure your storage connection string section}";
string fileName = $"{Guid.NewGuid()}-temp.txt";

BlobServiceClient client;
BlobContainerClient containerClient;
BlobClient blobClient;
```

### Create a container

Decide on a name for the new container. The code below appends a GUID value to the container name to ensure that it is unique.

> [!IMPORTANT]
> Container names must be lowercase. For more information about naming containers and blobs, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

Create an instance of the [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) class. Then, call the [CreateBlobContainerAsync](/dotnet/api/azure.storage.blobs.blobserviceclient.createblobcontainerasync) method to create the container in your storage account.

Add this code to *MainPage.xaml.cs* file:

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

1. Creates a `MemoryStream` of text.
1. Uploads the text to a Blob by calling the [UploadAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.uploadblobasync?view=azure-dotnet#Azure_Storage_Blobs_BlobContainerClient_UploadBlobAsync_System_String_System_IO_Stream_System_Threading_CancellationToken_) function of the [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) class, passing it in both the filename and the `MemoryStream` of text. This method creates the blob if it doesn't already exist, and overwrites it if it does.

Add this code to the *MainPage.xaml.cs* file:

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

List the blobs in the container by calling the [GetBlobsAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobsasync) method. In this case, only one blob has been added to the container, so the listing operation returns just that one blob.

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

Download the previously created blob by calling the [​Download​Async](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadasync) method. The example code copies the `Stream` representation of the blob first into a `MemoryStream` and then into a `StreamReader` so the text can be displayed.

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

The following code cleans up the resources the app created by deleting the entire container by using [​DeleteAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.deleteasync).

The app first prompts to confirm before it deletes the blob and container. This is a good chance to verify that the resources were created correctly, before they are deleted.

Add this code to the *MainPage.xaml.cs* file:

```csharp
async void Delete_Clicked(object sender, EventArgs e)
{            
    var deleteContainer = await Application.Current.MainPage.DisplayAlert("Delete Container",
        "You are about to delete the container proceeed?", "OK", "Cancel");

    if (deleteContainer == false)
        return;

    await containerClient.DeleteAsync();

    resultsLabel.Text += "Container Deleted";

    deleteButton.IsEnabled = false;
}
```

## Run the code

When the app starts, it will first create the container as it appears. Then you will need to click the buttons in order to upload, list, download the blobs, and delete the container.

To run the app on Windows press F5. To run the app on Mac press Cmd+Enter.

The app writes to the screen after every operation. The output of the app is similar to the example below:

```output
Container Created
Blob Uploaded
98d9a472-8e98-4978-ba4f-081d69d2e6f8-temp.txt
Blob Contents:
Hello World!
Container Deleted
```

Before you begin the clean-up process, verify the output of the blob's contents on screen match the value that was uploaded.

After you've verified the values, confirm the prompt to delete the container and finish the demo.

## Next steps

In this quickstart, you learned how to upload, download, and list blobs using Azure Blob storage client library v12 with Xamarin.

To see Blob storage sample apps, continue to:

> [!div class="nextstepaction"]
> [Azure Blob storage SDK v12 Xamarin sample](https://github.com/Azure-Samples/storage-blobs-xamarin-quickstart)

* For tutorials, samples, quick starts and other documentation, visit [Azure for mobile developers](/azure/mobile-apps).
* To learn more about Xamarin, see [Getting started with Xamarin](/xamarin/get-started/).
