---
title: Get started with Azure Blob storage and Visual Studio connected services (ASP.NET) | Microsoft Docs
description: How to get started using Azure Blob storage in an ASP.NET project in Visual Studio, after connecting to a storage account by using Visual Studio connected services
services: storage
author: ghogen
manager: douge
ms.assetid: b3497055-bef8-4c95-8567-181556b50d95
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.custom: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 12/07/2017
ms.author: ghogen
---
# Get started with Azure Blob storage and Visual Studio connected services (ASP.NET)

> [!div class="op_single_selector"]
> - [ASP.NET](./vs-storage-aspnet-getting-started-blobs.md)
> - [ASP.NET Core](./vs-storage-aspnet-core-getting-started-blobs.md)

Azure Blob storage is a service that stores unstructured data in the cloud as objects or blobs. Blob storage can store any type of text or binary data, such as a document, media file, or application installer. Blob storage is also referred to as object storage.

This tutorial shows how to write ASP.NET code for some common scenarios that use Blob storage. Scenarios 
include creating a blob container, and uploading, listing, downloading, and deleting blobs.

[!INCLUDE [storage-try-azure-tools-blobs](../../includes/storage-try-azure-tools-blobs.md)]

## Prerequisites

* [Microsoft Visual Studio](https://www.visualstudio.com/downloads/)

[!INCLUDE [storage-blob-concepts-include](../../includes/storage-blob-concepts-include.md)]


[!INCLUDE [storage-development-environment-include](../../includes/vs-storage-aspnet-getting-started-setup-dev-env.md)]

## Create an MVC controller 

1. In **Solution Explorer**, right-click **Controllers**.

2. From the context menu, select **Add** > **Controller**.

	![Screenshot of Solution Explorer, with Add and Controller highlighted](./media/vs-storage-aspnet-getting-started-blobs/add-controller-menu.png)

1. In the **Add Scaffold** dialog box, select **MVC 5 Controller - Empty**, and select **Add**.

	![Screenshot of Add Scaffold dialog box](./media/vs-storage-aspnet-getting-started-blobs/add-controller.png)

1. In the **Add Controller** dialog box, name the controller *BlobsController*, and select **Add**.

	![Screenshot of Add Controller dialog box](./media/vs-storage-aspnet-getting-started-blobs/add-controller-name.png)

1. Add the following `using` directives to the `BlobsController.cs` file:

    ```csharp
	using Microsoft.Azure;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Blob;
	```

## Connect to a storage account and get a container reference

A blob container is a nested hierarchy of blobs and folders. The rest of the steps in this document require a reference to a blob container, so that code should be placed in its own method for reusability.

The following steps create a method to connect to the storage account by using the connection string in **Web.config**. The steps also create a reference to a container.  The connection string setting in **Web.config** is named with the format `<storageaccountname>_AzureStorageConnectionString`. 

1. Open the `BlobsController.cs` file.

1. Add a method called **GetCloudBlobContainer** that returns a **CloudBlobContainer**.  Be sure to replace `<storageaccountname>_AzureStorageConnectionString` with the actual name of the key in **Web.config**.
    
    ```csharp
    private CloudBlobContainer GetCloudBlobContainer()
    {
        CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
                CloudConfigurationManager.GetSetting("<storageaccountname>_AzureStorageConnectionString"));
        CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
        CloudBlobContainer container = blobClient.GetContainerReference("test-blob-container");
        return container;
    }
    ```

> [!NOTE]
> Even though *test-blob-container* doesn't exist yet, this code creates a reference to it. This is so the container can be created with the `CreateIfNotExists` method shown in the next step.

## Create a blob container

The following steps illustrate how to create a blob container:

1. Add a method called `CreateBlobContainer` that returns an `ActionResult`.

    ```csharp
    public ActionResult CreateBlobContainer()
    {
		// The code in this section goes here.

        return View();
    }
    ```
 
1. Get a `CloudBlobContainer` object that represents a reference to the desired blob container name. 
   
    ```csharp
    CloudBlobContainer container = GetCloudBlobContainer();
    ```

1. Call the `CloudBlobContainer.CreateIfNotExists` method to create the container, if it does not yet exist. The `CloudBlobContainer.CreateIfNotExists` method returns **true** if the container does not exist, and is successfully created. Otherwise, the method returns **false**.    

    ```csharp
	ViewBag.Success = container.CreateIfNotExists();
    ```

1. Update `ViewBag` with the name of the blob container.

    ```csharp
	ViewBag.BlobContainerName = container.Name;
    ```
    
    The following shows the completed `CreateBlobContainer` method:

    ```csharp
    public ActionResult CreateBlobContainer()
    {
        CloudBlobContainer container = GetCloudBlobContainer();
        ViewBag.Success = container.CreateIfNotExists();
        ViewBag.BlobContainerName = container.Name;

        return View();
    }
    ```

1. In **Solution Explorer**, right-click the **Views** folder.

1. If there isn't a **Blobs** folder, create one. From the context menu, select **Add** > **New Folder**. Name the new folder *Blobs*. 
 
1. In **Solution Explorer**, expand the **Views** folder, and right-click **Blobs**.

1. From the context menu, select **Add** > **View**.

1. In the **Add View** dialog box, enter **CreateBlobContainer** for the view name, and select **Add**.

1. Open `CreateBlobContainer.cshtml`, and modify it so that it looks like the following code snippet:

    ```csharp
	@{
	    ViewBag.Title = "Create Blob Container";
	}
	
	<h2>Create Blob Container results</h2>

	Creation of @ViewBag.BlobContainerName @(ViewBag.Success == true ? "succeeded" : "failed")
    ```

1. In **Solution Explorer**, expand the **Views** > **Shared** folder, and open `_Layout.cshtml`.

1. After the last **Html.ActionLink**, add the following **Html.ActionLink**:

    ```html
	<li>@Html.ActionLink("Create blob container", "CreateBlobContainer", "Blobs")</li>
    ```

1. Run the application, and select **Create Blob Container** to see results similar to the following screenshot:
  
	![Screenshot of Create blob container](./media/vs-storage-aspnet-getting-started-blobs/create-blob-container-results.png)

	As mentioned previously, the `CloudBlobContainer.CreateIfNotExists` method returns **true** only when the container doesn't exist and is created. Therefore, if the app is run when the container exists, the method returns **false**.

## Upload a blob into a blob container

When the [blob container is created](#create-a-blob-container), upload files into that container. This section walks through uploading a local file to a blob container. The steps assume there is a blob container named *test-blob-container*. 

1. Open the `BlobsController.cs` file.

1. Add a method called `UploadBlob` that returns a string.

    ```csharp
    public string UploadBlob()
    {
		// The code in this section goes here.

        return "success!";
    }
    ```
 
1. Within the `UploadBlob` method, get a `CloudBlobContainer` object that represents a reference to the desired blob container name. 
   
    ```csharp
    CloudBlobContainer container = GetCloudBlobContainer();
    ```

1. Azure storage supports different blob types. This tutorial uses block blobs. To retrieve a reference to a block blob, call the `CloudBlobContainer.GetBlockBlobReference` method.

    ```csharp
    CloudBlockBlob blob = container.GetBlockBlobReference("myBlob");
    ```
    
    > [!NOTE]
    > The blob name is part of the URL used to retrieve a blob, and can be any string, including the name of the file.

1. After there is a blob reference, you can upload any data stream to it by calling the blob reference object's `UploadFromStream` method. The `UploadFromStream` method creates the blob if it doesn't exist, or overwrites it if it does exist. (Change *&lt;file-to-upload>* to a fully qualified path to a file to be uploaded.)

    ```csharp
    using (var fileStream = System.IO.File.OpenRead(@"<file-to-upload>"))
    {
        blob.UploadFromStream(fileStream);
    }
    ```
    
    The following shows the completed `UploadBlob` method (with a fully qualified path for the file to be uploaded):

    ```csharp
    public string UploadBlob()
    {
        CloudBlobContainer container = GetCloudBlobContainer();
        CloudBlockBlob blob = container.GetBlockBlobReference("myBlob");
        using (var fileStream = System.IO.File.OpenRead(@"c:\src\sample.txt"))
        {
            blob.UploadFromStream(fileStream);
        }
        return "success!";
    }
    ```

1. In **Solution Explorer**, expand the **Views** > **Shared** folder, and open `_Layout.cshtml`.

1. After the last **Html.ActionLink**, add the following **Html.ActionLink**:

    ```html
	<li>@Html.ActionLink("Upload blob", "UploadBlob", "Blobs")</li>
    ```

1. Run the application, and select **Upload blob**.  The word *success!* should appear.
    
    ![Screenshot of success verification](./media/vs-storage-aspnet-getting-started-blobs/upload-blob.png)
  
## List the blobs in a blob container

This section illustrates how to list the blobs in a blob container. The sample code references the *test-blob-container* created in the section, [Create a blob container](#create-a-blob-container).

1. Open the `BlobsController.cs` file.

1. Add a method called `ListBlobs` that returns an `ActionResult`.

    ```csharp
    public ActionResult ListBlobs()
    {
		// The code in this section goes here.

    }
    ```
 
1. Within the `ListBlobs` method, get a `CloudBlobContainer` object that represents a reference to the blob container. 
   
    ```csharp
    CloudBlobContainer container = GetCloudBlobContainer();
    ```
   
1. To list the blobs in a blob container, use the `CloudBlobContainer.ListBlobs` method. The `CloudBlobContainer.ListBlobs` method returns an `IListBlobItem` object that can be cast to a `CloudBlockBlob`, `CloudPageBlob`, or `CloudBlobDirectory` object. The following code snippet enumerates all the blobs in a blob container. Each blob is cast to the appropriate object, based on its type. Its name (or URI in the case of a **CloudBlobDirectory**) is added to a list.

    ```csharp
    List<string> blobs = new List<string>();

    foreach (IListBlobItem item in container.ListBlobs())
    {
        if (item.GetType() == typeof(CloudBlockBlob))
        {
            CloudBlockBlob blob = (CloudBlockBlob)item;
            blobs.Add(blob.Name);
        }
        else if (item.GetType() == typeof(CloudPageBlob))
        {
            CloudPageBlob blob = (CloudPageBlob)item;
            blobs.Add(blob.Name);
        }
        else if (item.GetType() == typeof(CloudBlobDirectory))
        {
            CloudBlobDirectory dir = (CloudBlobDirectory)item;
            blobs.Add(dir.Uri.ToString());
        }
    }

	return View(blobs);
    ```

	In addition to blobs, blob containers can contain directories. Suppose there is a blob container called *test-blob-container*, with the following hierarchy:

		foo.png
		dir1/bar.png
		dir2/baz.png

	Using the preceding code example, the **blobs** string list contains values similar to the following:

		foo.png
		<storage-account-url>/test-blob-container/dir1
		<storage-account-url>/test-blob-container/dir2

	As shown, the list includes only the top-level entities, not the nested ones (*bar.png* and *baz.png*). To list all the entities within a blob container, change the code so that the **CloudBlobContainer.ListBlobs** method is passed **true** for the **useFlatBlobListing** parameter.    

    ```csharp
    //...
	foreach (IListBlobItem item in container.ListBlobs(useFlatBlobListing:true))
	//...
    ```

	Setting the **useFlatBlobListing** parameter to **true** returns a flat listing of all entities in the blob container. This yields the following results:

		foo.png
		dir1/bar.png
		dir2/baz.png
    
    The following shows the completed **ListBlobs** method:

    ```csharp
    public ActionResult ListBlobs()
    {
        CloudBlobContainer container = GetCloudBlobContainer();
        List<string> blobs = new List<string>();
        foreach (IListBlobItem item in container.ListBlobs(useFlatBlobListing: true))
        {
            if (item.GetType() == typeof(CloudBlockBlob))
            {
                CloudBlockBlob blob = (CloudBlockBlob)item;
                blobs.Add(blob.Name);
            }
            else if (item.GetType() == typeof(CloudPageBlob))
            {
                CloudPageBlob blob = (CloudPageBlob)item;
                blobs.Add(blob.Name);
            }
            else if (item.GetType() == typeof(CloudBlobDirectory))
            {
                CloudBlobDirectory dir = (CloudBlobDirectory)item;
                blobs.Add(dir.Uri.ToString());
            }
        }

        return View(blobs);
    }
    ```

1. In **Solution Explorer**, expand the **Views** folder, and right-click **Blobs**.

2. From the context menu, select **Add** > **View**.

1. In the **Add View** dialog box, enter `ListBlobs` for the view name, and select **Add**.

1. Open `ListBlobs.cshtml`, and replace the contents with the following code:

    ```html
	@model List<string>
	@{
	    ViewBag.Title = "List blobs";
	}
	
	<h2>List blobs</h2>
	
	<ul>
	    @foreach (var item in Model)
	    {
	    <li>@item</li>
	    }
	</ul>
    ```

1. In **Solution Explorer**, expand the **Views** > **Shared** folder, and open `_Layout.cshtml`.

1. After the last **Html.ActionLink**, add the following **Html.ActionLink**:

    ```html
	<li>@Html.ActionLink("List blobs", "ListBlobs", "Blobs")</li>
    ```

1. Run the application, and select **List blobs** to see results similar to the following screenshot:
  
	![Screenshot of List blobs](./media/vs-storage-aspnet-getting-started-blobs/listblobs.png)

## Download blobs

This section illustrates how to download a blob. You can either persist it to local storage or read the contents into a string. The sample code references the *test-blob-container* created in the section, [Create a blob container](#create-a-blob-container).

1. Open the `BlobsController.cs` file.

1. Add a method called `DownloadBlob` that returns a string.

    ```csharp
    public string DownloadBlob()
    {
		// The code in this section goes here.

        return "success!";
    }
    ```
 
1. Within the `DownloadBlob` method, get a `CloudBlobContainer` object that represents a reference to the blob container.
   
    ```csharp
    CloudBlobContainer container = GetCloudBlobContainer();
    ```

1. Get a blob reference object by calling the `CloudBlobContainer.GetBlockBlobReference` method. 

    ```csharp
    CloudBlockBlob blob = container.GetBlockBlobReference("myBlob");
    ```

1. To download a blob, use the `CloudBlockBlob.DownloadToStream` method. The following code transfers a blob's contents to a stream object. That object is then persisted to a local file. (Change *&lt;local-file-name>* to the fully qualified file name representing where the blob is to be downloaded.) 

    ```csharp
    using (var fileStream = System.IO.File.OpenWrite(<local-file-name>))
    {
        blob.DownloadToStream(fileStream);
    }
    ```
    
    The following shows the completed `ListBlobs` method (with a fully qualified path for the local file being created):
    
    ```csharp
    public string DownloadBlob()
    {
        CloudBlobContainer container = GetCloudBlobContainer();
        CloudBlockBlob blob = container.GetBlockBlobReference("myBlob");
        using (var fileStream = System.IO.File.OpenWrite(@"c:\src\downloadedBlob.txt"))
        {
            blob.DownloadToStream(fileStream);
        }
        return "success!";
    }
    ```

1. In **Solution Explorer**, expand the **Views** > **Shared** folder, and open `_Layout.cshtml`.

1. After the last **Html.ActionLink**, add the following **Html.ActionLink**:

    ```html
	<li>@Html.ActionLink("Download blob", "DownloadBlob", "Blobs")</li>
    ```

1. Run the application, and select **Download blob** to download the blob. The blob specified in the `CloudBlobContainer.GetBlockBlobReference` method call downloads to the location specified in the `File.OpenWrite` method call.  The text *success!* should appear in the browser. 

## Delete blobs

The following steps illustrate how to delete a blob:

1. Open the `BlobsController.cs` file.

1. Add a method called `DeleteBlob` that returns a string.

    ```csharp
    public string DeleteBlob()
    {
		// The code in this section goes here.

        return "success!";
    }
    ```

1. Within the `DeleteBlob` method, get a `CloudBlobContainer` object that represents a reference to the blob container.
   
    ```csharp
    CloudBlobContainer container = GetCloudBlobContainer();
    ```

1. Get a blob reference object by calling the `CloudBlobContainer.GetBlockBlobReference` method. 

    ```csharp
    CloudBlockBlob blob = container.GetBlockBlobReference("myBlob");
    ```

1. To delete a blob, use the `Delete` method.

    ```csharp
    blob.Delete();
    ```
    
    The completed `DeleteBlob` method should appear as follows:
    
    ```csharp
    public string DeleteBlob()
    {
        CloudBlobContainer container = GetCloudBlobContainer();
        CloudBlockBlob blob = container.GetBlockBlobReference("myBlob");
        blob.Delete();
        return "success!";
    }
    ```

1. In **Solution Explorer**, expand the **Views** > **Shared** folder, and open `_Layout.cshtml`.

1. After the last **Html.ActionLink**, add the following **Html.ActionLink**:

    ```html
	<li>@Html.ActionLink("Delete blob", "DeleteBlob", "Blobs")</li>
    ```

1. Run the application, and select **Delete blob** to delete the blob specified in the `CloudBlobContainer.GetBlockBlobReference` method call. The text *success!* should appear in the browser. Select the browser's **Back** button, and then select **List blobs** to verify that the blob is no longer in the container.

## Next steps

In this tutorial, you learned how to store, list, and retrieve blobs in Azure Storage by using ASP.NET. View more feature guides to learn about additional options for storing data in Azure.

  * [Get started with Azure Table storage and Visual Studio connected services (ASP.NET)](vs-storage-aspnet-getting-started-tables.md)
  * [Get started with Azure Queue storage and Visual Studio connected services (ASP.NET)](vs-storage-aspnet-getting-started-queues.md)
