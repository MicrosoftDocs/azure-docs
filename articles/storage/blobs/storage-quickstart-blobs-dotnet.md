---
title: "Quickstart: Azure Blob Storage library - .NET"
description: In this quickstart, you learn how to use the Azure Blob Storage client library for .NET to create a container and a blob in Blob (object) storage. Next, you learn how to download the blob to your local computer, and how to list all of the blobs in a container.
author: pauljewellmsft
ms.author: pauljewell
ms.date: 02/06/2024
ms.service: azure-blob-storage
ms.topic: quickstart
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-api, passwordless-dotnet, devx-track-dotnet, ai-video-demo, devx-track-extended-azdevcli
ai-usage: ai-assisted
zone_pivot_groups: azure-blob-storage-quickstart-options
---

# Quickstart: Azure Blob Storage client library for .NET

::: zone pivot="blob-storage-quickstart-scratch"

> [!NOTE]
> The **Build from scratch** option walks you step by step through the process of creating a new project, installing packages, writing the code, and running a basic console app. This approach is recommended if you want to understand all the details involved in creating an app that connects to Azure Blob Storage. If you prefer to automate deployment tasks and start with a completed project, choose [Start with a template](storage-quickstart-blobs-dotnet.md?pivots=blob-storage-quickstart-template).

::: zone-end

::: zone pivot="blob-storage-quickstart-template"

> [!NOTE]
> The **Start with a template** option uses the Azure Developer CLI to automate deployment tasks and starts you off with a completed project. This approach is recommended if you want to explore the code as quickly as possible without going through the setup tasks. If you prefer step by step instructions to build the app, choose [Build from scratch](storage-quickstart-blobs-dotnet.md?pivots=blob-storage-quickstart-scratch).

::: zone-end

Get started with the Azure Blob Storage client library for .NET. Azure Blob Storage is Microsoft's object storage solution for the cloud, and is optimized for storing massive amounts of unstructured data.

::: zone pivot="blob-storage-quickstart-scratch"

In this article, you follow steps to install the package and try out example code for basic tasks.

::: zone-end

::: zone pivot="blob-storage-quickstart-template"

In this article, you use the [Azure Developer CLI](/azure/developer/azure-developer-cli/overview) to deploy Azure resources and run a completed console app with just a few commands.

::: zone-end

[API reference documentation](/dotnet/api/azure.storage.blobs) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Blobs) | [Samples](../common/storage-samples-dotnet.md?toc=/azure/storage/blobs/toc.json#blob-samples)

::: zone pivot="blob-storage-quickstart-scratch"

This video shows you how to start using the Azure Blob Storage client library for .NET.
> [!VIDEO cdae65e7-1892-48fe-934a-70edfbe147be]

The steps in the video are also described in the following sections.

::: zone-end

## Prerequisites

::: zone pivot="blob-storage-quickstart-scratch"

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](../common/storage-account-create.md)
- Latest [.NET SDK](https://dotnet.microsoft.com/download/dotnet) for your operating system. Be sure to get the SDK and not the runtime.

::: zone-end

::: zone pivot="blob-storage-quickstart-template"

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Latest [.NET SDK](https://dotnet.microsoft.com/download/dotnet) for your operating system. This code sample uses .NET 8.0. Be sure to get the SDK and not the runtime.
- [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)

::: zone-end

## Setting up

::: zone pivot="blob-storage-quickstart-scratch"

This section walks you through preparing a project to work with the Azure Blob Storage client library for .NET.

### Create the project

Create a .NET console app using either the .NET CLI or Visual Studio 2022.

### [Visual Studio 2022](#tab/visual-studio)

1. At the top of Visual Studio, navigate to **File** > **New** > **Project..**.

1. In the dialog window, enter *console app* into the project template search box and select the first result. Choose **Next** at the bottom of the dialog.

    :::image type="content" source="media/storage-quickstart-blobs-dotnet/visual-studio-new-console-app.png" alt-text="A screenshot showing how to create a new project using Visual Studio.":::

1. For the **Project Name**, enter *BlobQuickstart*. Leave the default values for the rest of the fields and select **Next**.

1. For the **Framework**, ensure the latest installed version of .NET is selected. Then choose **Create**. The new project opens inside the Visual Studio environment.

### [.NET CLI](#tab/net-cli)

1. In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name *BlobQuickstart*. This command creates a simple "Hello World" C# project with a single source file: *Program.cs*.

   ```dotnetcli
   dotnet new console -n BlobQuickstart
   ```

1. Switch to the newly created *BlobQuickstart* directory.

   ```console
   cd BlobQuickstart
   ```

1. Open the project in your desired code editor. To open the project in:
    * Visual Studio, locate and double-click the `BlobQuickStart.csproj` file.
    * Visual Studio Code, run the following command:

    ```bash
    code .
    ```
---

### Install the package

To interact with Azure Blob Storage, install the Azure Blob Storage client library for .NET.

### [Visual Studio 2022](#tab/visual-studio)

1. In **Solution Explorer**, right-click the **Dependencies** node of your project. Select **Manage NuGet Packages**.

1. In the resulting window, search for *Azure.Storage.Blobs*. Select the appropriate result, and select **Install**.

    :::image type="content" source="media/storage-quickstart-blobs-dotnet/visual-studio-add-package.png" alt-text="A screenshot showing how to add a new package using Visual Studio.":::

### [.NET CLI](#tab/net-cli)

Use the following command to install the `Azure.Storage.Blobs` package:

```dotnetcli
dotnet add package Azure.Storage.Blobs
```

If this command to add the package fails, follow these steps:

- Make sure that `nuget.org` is added as a package source. You can list the package sources using the [`dotnet nuget list source`](/dotnet/core/tools/dotnet-nuget-list-source#examples) command:

    ```dotnetcli
    dotnet nuget list source
    ```

- If you don't see `nuget.org` in the list, you can add it using the [`dotnet nuget add source`](/dotnet/core/tools/dotnet-nuget-add-source#examples) command:

    ```dotnetcli
    dotnet nuget add source https://api.nuget.org/v3/index.json -n nuget.org
    ```

Now that the package source is updated, run the command to install the package.

---

### Set up the app code

Replace the starting code in the `Program.cs` file so that it matches the following example, which includes the necessary `using` statements for this exercise.

```csharp
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System;
using System.IO;

// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");
```

::: zone-end

::: zone pivot="blob-storage-quickstart-template"

With [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) installed, you can create a storage account and run the sample code with just a few commands. You can run the project in your local development environment, or in a [DevContainer](https://code.visualstudio.com/docs/devcontainers/containers).

### Initialize the Azure Developer CLI template and deploy resources

From an empty directory, follow these steps to initialize the `azd` template, provision Azure resources, and get started with the code:

- Clone the quickstart repository assets from GitHub and initialize the template locally:

    ```console
    azd init --template blob-storage-quickstart-dotnet
    ```

    You'll be prompted for the following information:

    - **Environment name**: This value is used as a prefix for all Azure resources created by Azure Developer CLI. The name must be unique across all Azure subscriptions and must be between 3 and 24 characters long. The name can contain numbers and lowercase letters only.

- Log in to Azure:

    ```console
    azd auth login
    ```
- Provision and deploy the resources to Azure:

    ```console
    azd up
    ```

    You'll be prompted for the following information:

    - **Subscription**: The Azure subscription that your resources are deployed to.
    - **Location**: The Azure region where your resources are deployed.
    
    The deployment might take a few minutes to complete. The output from the `azd up` command includes the name of the newly created storage account, which you'll need later to run the code.

## Run the sample code

At this point, the resources are deployed to Azure and the project is ready to run. Follow these steps to update the name of the storage account in the code and run the sample console app:

- **Update the storage account name**: Navigate to the `src` directory and edit `Program.cs`. Find the `<storage-account-name>` placeholder and replace it with the actual name of the storage account created by the `azd up` command. Save the changes.
- **Run the project**: If you're using Visual Studio, press F5 to build and run the code and interact with the console app. If you're using the .NET CLI, navigate to your application directory, build the project using `dotnet build`, and run the application using the `dotnet run`.
- **Observe the output**: This app creates a test file in your local *data* folder and uploads it to a container in the storage account. The example then lists the blobs in the container and downloads the file with a new name so that you can compare the old and new files. 

To learn more about how the sample code works, see [Code examples](#code-examples).

When you're finished testing the code, see the [Clean up resources](#clean-up-resources) section to delete the resources created by the `azd up` command.

::: zone-end

## Object model

Azure Blob Storage is optimized for storing massive amounts of unstructured data. Unstructured data doesn't adhere to a particular data model or definition, such as text or binary data. Blob storage offers three types of resources:

- The storage account
- A container in the storage account
- A blob in the container

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture.](media/storage-quickstart-blobs-dotnet/blob-1.png)

Use the following .NET classes to interact with these resources:

- [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient): The `BlobServiceClient` class allows you to manipulate Azure Storage resources and blob containers.
- [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient): The `BlobContainerClient` class allows you to manipulate Azure Storage containers and their blobs.
- [BlobClient](/dotnet/api/azure.storage.blobs.blobclient): The `BlobClient` class allows you to manipulate Azure Storage blobs.

## Code examples

The sample code snippets in the following sections demonstrate how to perform the following tasks with the Azure Blob Storage client library for .NET:

- [Authenticate to Azure and authorize access to blob data](#authenticate-to-azure-and-authorize-access-to-blob-data)
- [Create a container](#create-a-container)
- [Upload a blob to a container](#upload-a-blob-to-a-container)
- [List blobs in a container](#list-blobs-in-a-container)
- [Download a blob](#download-a-blob)
- [Delete a container](#delete-a-container)

::: zone pivot="blob-storage-quickstart-scratch"

> [!IMPORTANT]
> Make sure you've installed the correct NuGet packages and added the necessary using statements in order for the code samples to work, as described in the [setting up](#setting-up) section.

::: zone-end

::: zone pivot="blob-storage-quickstart-template"

> [!NOTE]
> The Azure Developer CLI template includes a project with sample code already in place. The following examples provide detail for each part of the sample code. The template implements the recommended passwordless authentication method, as described in the [Authenticate to Azure](#authenticate-to-azure-and-authorize-access-to-blob-data) section. The connection string method is shown as an alternative, but isn't used in the template and isn't recommended for production code.

::: zone-end

[!INCLUDE [storage-quickstart-credential-free-include](../../../includes/storage-quickstart-credential-free-include.md)]

### Create a container

Create a new container in your storage account by calling the [CreateBlobContainerAsync](/dotnet/api/azure.storage.blobs.blobserviceclient.createblobcontainerasync) method on the `blobServiceClient` object. In this example, the code appends a GUID value to the container name to ensure that it's unique.

::: zone pivot="blob-storage-quickstart-scratch"

Add the following code to the end of the `Program.cs` file:

::: zone-end

```csharp
// TODO: Replace <storage-account-name> with your actual storage account name
var blobServiceClient = new BlobServiceClient(
        new Uri("https://<storage-account-name>.blob.core.windows.net"),
        new DefaultAzureCredential());

//Create a unique name for the container
string containerName = "quickstartblobs" + Guid.NewGuid().ToString();

// Create the container and return a container client object
BlobContainerClient containerClient = await blobServiceClient.CreateBlobContainerAsync(containerName);
```

To learn more about creating a container, and to explore more code samples, see [Create a blob container with .NET](storage-blob-container-create.md).

> [!IMPORTANT]
> Container names must be lowercase. For more information about naming containers and blobs, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

### Upload a blob to a container

Upload a blob to a container using [UploadAsync](/dotnet/api/azure.storage.blobs.blobclient.uploadasync). The example code creates a text file in the local *data* directory to upload to the container.

::: zone pivot="blob-storage-quickstart-scratch"

Add the following code to the end of the `Program.cs` file:

::: zone-end

```csharp
// Create a local file in the ./data/ directory for uploading and downloading
string localPath = "data";
Directory.CreateDirectory(localPath);
string fileName = "quickstart" + Guid.NewGuid().ToString() + ".txt";
string localFilePath = Path.Combine(localPath, fileName);

// Write text to the file
await File.WriteAllTextAsync(localFilePath, "Hello, World!");

// Get a reference to a blob
BlobClient blobClient = containerClient.GetBlobClient(fileName);

Console.WriteLine("Uploading to Blob storage as blob:\n\t {0}\n", blobClient.Uri);

// Upload data from the local file, overwrite the blob if it already exists
await blobClient.UploadAsync(localFilePath, true);
```

To learn more about uploading blobs, and to explore more code samples, see [Upload a blob with .NET](storage-blob-upload.md).

### List blobs in a container

List the blobs in the container by calling the [GetBlobsAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobsasync) method.

::: zone pivot="blob-storage-quickstart-scratch"

Add the following code to the end of the `Program.cs` file:

::: zone-end

```csharp
Console.WriteLine("Listing blobs...");

// List all blobs in the container
await foreach (BlobItem blobItem in containerClient.GetBlobsAsync())
{
    Console.WriteLine("\t" + blobItem.Name);
}
```

To learn more about listing blobs, and to explore more code samples, see [List blobs with .NET](storage-blobs-list.md).

### Download a blob

Download the blob we created earlier by calling the [DownloadToAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadtoasync) method. The example code appends the string "DOWNLOADED" to the file name so that you can see both files in local file system.

::: zone pivot="blob-storage-quickstart-scratch"

Add the following code to the end of the `Program.cs` file:

::: zone-end

```csharp
// Download the blob to a local file
// Append the string "DOWNLOADED" before the .txt extension 
// so you can compare the files in the data directory
string downloadFilePath = localFilePath.Replace(".txt", "DOWNLOADED.txt");

Console.WriteLine("\nDownloading blob to\n\t{0}\n", downloadFilePath);

// Download the blob's contents and save it to a file
await blobClient.DownloadToAsync(downloadFilePath);
```

To learn more about downloading blobs, and to explore more code samples, see [Download a blob with .NET](storage-blob-download.md).

### Delete a container

The following code cleans up the resources the app created by deleting the container using [DeleteAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.deleteasync). The code example also deletes the local files created by the app.

The app pauses for user input by calling `Console.ReadLine` before it deletes the blob, container, and local files. This is a good chance to verify that the resources were created correctly, before they're deleted.

::: zone pivot="blob-storage-quickstart-scratch"

Add the following code to the end of the `Program.cs` file:

::: zone-end

```csharp
// Clean up
Console.Write("Press any key to begin clean up");
Console.ReadLine();

Console.WriteLine("Deleting blob container...");
await containerClient.DeleteAsync();

Console.WriteLine("Deleting the local source and downloaded files...");
File.Delete(localFilePath);
File.Delete(downloadFilePath);

Console.WriteLine("Done");
```

To learn more about deleting a container, and to explore more code samples, see [Delete and restore a blob container with .NET](storage-blob-container-delete.md).

::: zone pivot="blob-storage-quickstart-scratch"

## The completed code

After completing these steps, the code in your `Program.cs` file should now resemble the following:

## [Passwordless (Recommended)](#tab/managed-identity)

```csharp
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Identity;

// TODO: Replace <storage-account-name> with your actual storage account name
var blobServiceClient = new BlobServiceClient(
        new Uri("https://<storage-account-name>.blob.core.windows.net"),
        new DefaultAzureCredential());

//Create a unique name for the container
string containerName = "quickstartblobs" + Guid.NewGuid().ToString();

// Create the container and return a container client object
BlobContainerClient containerClient = await blobServiceClient.CreateBlobContainerAsync(containerName);

// Create a local file in the ./data/ directory for uploading and downloading
string localPath = "data";
Directory.CreateDirectory(localPath);
string fileName = "quickstart" + Guid.NewGuid().ToString() + ".txt";
string localFilePath = Path.Combine(localPath, fileName);

// Write text to the file
await File.WriteAllTextAsync(localFilePath, "Hello, World!");

// Get a reference to a blob
BlobClient blobClient = containerClient.GetBlobClient(fileName);

Console.WriteLine("Uploading to Blob storage as blob:\n\t {0}\n", blobClient.Uri);

// Upload data from the local file
await blobClient.UploadAsync(localFilePath, true);

Console.WriteLine("Listing blobs...");

// List all blobs in the container
await foreach (BlobItem blobItem in containerClient.GetBlobsAsync())
{
    Console.WriteLine("\t" + blobItem.Name);
}

// Download the blob to a local file
// Append the string "DOWNLOADED" before the .txt extension 
// so you can compare the files in the data directory
string downloadFilePath = localFilePath.Replace(".txt", "DOWNLOADED.txt");

Console.WriteLine("\nDownloading blob to\n\t{0}\n", downloadFilePath);

// Download the blob's contents and save it to a file
await blobClient.DownloadToAsync(downloadFilePath);

// Clean up
Console.Write("Press any key to begin clean up");
Console.ReadLine();

Console.WriteLine("Deleting blob container...");
await containerClient.DeleteAsync();

Console.WriteLine("Deleting the local source and downloaded files...");
File.Delete(localFilePath);
File.Delete(downloadFilePath);

Console.WriteLine("Done");
```

## [Connection String](#tab/connection-string)

```csharp
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

// TODO: Replace <storage-account-name> with your actual storage account name
var blobServiceClient = new BlobServiceClient("<storage-account-connection-string>");

//Create a unique name for the container
string containerName = "quickstartblobs" + Guid.NewGuid().ToString();

// Create the container and return a container client object
BlobContainerClient containerClient = await blobServiceClient.CreateBlobContainerAsync(containerName);

// Create a local file in the ./data/ directory for uploading and downloading
string localPath = "data";
Directory.CreateDirectory(localPath);
string fileName = "quickstart" + Guid.NewGuid().ToString() + ".txt";
string localFilePath = Path.Combine(localPath, fileName);

// Write text to the file
await File.WriteAllTextAsync(localFilePath, "Hello, World!");

// Get a reference to a blob
BlobClient blobClient = containerClient.GetBlobClient(fileName);

Console.WriteLine("Uploading to Blob storage as blob:\n\t {0}\n", blobClient.Uri);

// Upload data from the local file
await blobClient.UploadAsync(localFilePath, true);

Console.WriteLine("Listing blobs...");

// List all blobs in the container
await foreach (BlobItem blobItem in containerClient.GetBlobsAsync())
{
    Console.WriteLine("\t" + blobItem.Name);
}

// Download the blob to a local file
// Append the string "DOWNLOADED" before the .txt extension 
// so you can compare the files in the data directory
string downloadFilePath = localFilePath.Replace(".txt", "DOWNLOADED.txt");

Console.WriteLine("\nDownloading blob to\n\t{0}\n", downloadFilePath);

// Download the blob's contents and save it to a file
await blobClient.DownloadToAsync(downloadFilePath);

// Clean up
Console.Write("Press any key to begin clean up");
Console.ReadLine();

Console.WriteLine("Deleting blob container...");
await containerClient.DeleteAsync();

Console.WriteLine("Deleting the local source and downloaded files...");
File.Delete(localFilePath);
File.Delete(downloadFilePath);

Console.WriteLine("Done");
```

---

## Run the code

This app creates a test file in your local *data* folder and uploads it to Blob storage. The example then lists the blobs in the container and downloads the file with a new name so that you can compare the old and new files.

If you're using Visual Studio, press F5 to build and run the code and interact with the console app. If you're using the .NET CLI, navigate to your application directory, then build and run the application.

```console
dotnet build
```

```console
dotnet run
```

The output of the app is similar to the following example (GUID values omitted for readability):

```output
Azure Blob Storage - .NET quickstart sample

Uploading to Blob storage as blob:
         https://mystorageacct.blob.core.windows.net/quickstartblobsGUID/quickstartGUID.txt

Listing blobs...
        quickstartGUID.txt

Downloading blob to
        ./data/quickstartGUIDDOWNLOADED.txt

Press any key to begin clean up
Deleting blob container...
Deleting the local source and downloaded files...
Done
```

Before you begin the clean-up process, check your *data* folder for the two files. You can open them and observe that they're identical.

::: zone-end

## Clean up resources

::: zone pivot="blob-storage-quickstart-scratch"

After you verify the files and finish testing, press the **Enter** key to delete the test files along with the container you created in the storage account. You can also use [Azure CLI](storage-quickstart-blobs-cli.md#clean-up-resources) to delete resources.

::: zone-end

::: zone pivot="blob-storage-quickstart-template"

When you're done with the quickstart, you can clean up the resources you created by running the following command:

```console
azd down
```

You'll be prompted to confirm the deletion of the resources. Enter `y` to confirm.

::: zone-end

## Next steps

In this quickstart, you learned how to upload, download, and list blobs using .NET.

To see Blob storage sample apps, continue to:

> [!div class="nextstepaction"]
> [Azure Blob Storage library for .NET samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples)

- To learn more, see the [Azure Blob Storage client libraries for .NET](/dotnet/api/overview/azure/storage).
- For tutorials, samples, quick starts and other documentation, visit [Azure for .NET developers](/dotnet/azure/sdk/azure-sdk-for-dotnet).
- To learn more about .NET, see [Get started with .NET in 10 minutes](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/intro).
