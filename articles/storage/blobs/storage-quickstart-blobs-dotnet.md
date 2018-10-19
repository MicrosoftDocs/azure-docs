---
title: "Quickstart: Use .NET to create a blob in object storage - Azure Storage"
description: In this quickstart, you learn how to use the Azure Storage client library for .NET to create a container and a blob in Blob (object) storage. Next, you learn how to download the blob to your local computer, and how to list all of the blobs in a container.
services: storage
author: tamram

ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 08/27/2018
ms.author: tamram
---

# Quickstart: Use .NET to create a blob in object storage

In this quickstart, you learn how to use the Azure Storage client library for .NET to create a container and a blob in Blob (object) storage. Next, you learn how to download the blob to your local computer, and how to list all of the blobs in a container.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

To complete this quickstart, first create an Azure storage account in the [Azure portal](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). For help creating the account, see [Create a storage account](../common/storage-quickstart-create-account.md).

Next, download and install .NET Core 2.0 for your operating system. If you are running Windows, you can install Visual Studio and use the .NET Framework if you prefer. You can also choose to install an editor to use with your operating system.

# [Windows](#tab/windows)

- Install [.NET Core for Windows](https://www.microsoft.com/net/download/windows) or the [.NET Framework](https://www.microsoft.com/net/download/windows) (included with Visual Studio for Windows)
- Install [Visual Studio for Windows](https://www.visualstudio.com/). If you are using .NET Core, installing Visual Studio is optional.  

For information about choosing between .NET Core and the .NET Framework, see [Choose between .NET Core and .NET Framework for server apps](https://docs.microsoft.com/dotnet/standard/choosing-core-framework-server).

# [Linux](#tab/linux)

- Install [.NET Core for Linux](https://www.microsoft.com/net/download/linux)
- Optionally install [Visual Studio Code](https://www.visualstudio.com/) and the [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp&dotnetid=963890049.1518206068)

# [macOS](#tab/macos)

- Install [.NET Core for macOS](https://www.microsoft.com/net/download/macos).
- Optionally install [Visual Studio for Mac](https://www.visualstudio.com/vs/visual-studio-mac/)

---

## Download the sample application

The sample application used in this quickstart is a basic console application. You can explore the sample application on [GitHub](https://github.com/Azure-Samples/storage-blobs-dotnet-quickstart).

Use [git](https://git-scm.com/) to download a copy of the application to your development environment. 

```bash
git clone https://github.com/Azure-Samples/storage-blobs-dotnet-quickstart.git
```

This command clones the repository to your local git folder. To open the Visual Studio solution, look for the *storage-blobs-dotnet-quickstart* folder, open it, and double-click on *storage-blobs-dotnet-quickstart.sln*. 

[!INCLUDE [storage-copy-connection-string-portal](../../../includes/storage-copy-connection-string-portal.md)]

## Configure your storage connection string

To run the application, you must provide the connection string for your storage account. The sample application reads the connection string from an environment variable and uses it to authorize requests to Azure Storage.

After you have copied your connection string, write it to a new environment variable on the local machine running the application. To set the environment variable, open a console window, and follow the instructions for your operating system. Replace `<yourconnectionstring>` with your actual connection string:

# [Windows](#tab/windows)

```cmd
setx storageconnectionstring "<yourconnectionstring>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you are using Visual Studio as your editor, restart Visual Studio before running the sample. 

# [Linux](#tab/linux)

```bash
export storageconnectionstring=<yourconnectionstring>
```

After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.

# [macOS](#tab/macos)

Edit your .bash_profile, and add the environment variable:

```bash
export STORAGE_CONNECTION_STRING=<yourconnectionstring>
```

After you add the environment variable, run `source .bash_profile` from your console window to make the changes effective.

---

## Run the sample

This sample creates a test file in your local **MyDocuments** folder and uploads it to Blob storage. The sample then lists the blobs in the container and downloads the file with a new name so that you can compare the old and new files. 

# [Windows](#tab/windows)

If you are using Visual Studio as your editor, you can press **F5** to run. 

Otherwise, navigate to your application directory and run the application with the `dotnet run` command.

```
dotnet run
```

# [Linux](#tab/linux)

Navigate to your application directory and run the application with the `dotnet run` command.

```
dotnet run
```

# [macOS](#tab/macos)

Navigate to your application directory and run the application with the `dotnet run` command.

```
dotnet run
```

---

The output of the sample application is similar to the following example:

```
Azure Blob storage - .NET Quickstart sample

Created container 'quickstartblobs33c90d2a-eabd-4236-958b-5cc5949e731f'

Temp file = C:\Users\myusername\Documents\QuickStart_c5e7f24f-a7f8-4926-a9da-9697c748f4db.txt
Uploading to Blob storage as blob 'QuickStart_c5e7f24f-a7f8-4926-a9da-9697c748f4db.txt'

Listing blobs in container.
https://storagesamples.blob.core.windows.net/quickstartblobs33c90d2a-eabd-4236-958b-5cc5949e731f/QuickStart_c5e7f24f-a7f8-4926-a9da-9697c748f4db.txt

Downloading blob to C:\Users\myusername\Documents\QuickStart_c5e7f24f-a7f8-4926-a9da-9697c748f4db_DOWNLOADED.txt

Press any key to delete the sample files and example container.
```

When you press the **Enter** key, the application deletes the storage container and the files. Before you delete them, check your **MyDocuments** folder for the two files. You can open them and observe that they are identical. Copy the blob's URL from the console window and paste it into a browser to view the contents of the blob.

After you've verified the files, hit any key to finish the demo and delete the test files. Now that you know what the sample does, open the Program.cs file to look at the code. 

## Understand the sample code

Next, explore the sample code so that you can understand how it works.

### Try parsing the connection string

The first thing that the sample does is to check that the environment variable contains a connection string that can be parsed to create a [CloudStorageAccount](/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount) object pointing to the storage account. To check that the connection string is valid, use the [TryParse](/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.tryparse) method. If **TryParse** is successful, it initializes the *storageAccount* variable and returns **true**.

```csharp
// Retrieve the connection string for use with the application. The storage connection string is stored
// in an environment variable on the machine running the application called storageconnectionstring.
// If the environment variable is created after the application is launched in a console or with Visual
// Studio, the shell or application needs to be closed and reloaded to take the environment variable into account.
string storageConnectionString = Environment.GetEnvironmentVariable("storageconnectionstring");

// Check whether the connection string can be parsed.
if (CloudStorageAccount.TryParse(storageConnectionString, out storageAccount))
{
    // If the connection string is valid, proceed with operations against Blob storage here.
    ...
}
else
{
    // Otherwise, let the user know that they need to define the environment variable.
    Console.WriteLine(
        "A connection string has not been defined in the system environment variables. " +
        "Add a environment variable named 'storageconnectionstring' with your storage " +
        "connection string as a value.");
    Console.WriteLine("Press any key to exit the sample application.");
    Console.ReadLine();
}
```

### Create the container and set permissions

Next, the sample creates a container and sets its permissions so that any blobs in the container are public. If a blob is public, it can be accessed anonymously by any client.

To create the container, first create an instance of the [CloudBlobClient](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobclient) object, which points to Blob storage in your storage account. Next, create an instance of the [CloudBlobContainer](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer) object, then create the container. 

In this case, the sample calls the [CreateAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.createasync) method to create the container. A GUID value is appended to the container name to ensure that it is unique. In a production environment, it's often preferable to use the [CreateIfNotExistsAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.createifnotexistsasync) method to create a container only if it does not already exist and avoid naming conflicts.

> [!IMPORTANT]
> Container names must be lowercase. For more information about naming containers and blobs, see [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).


```csharp
// Create the CloudBlobClient that represents the Blob storage endpoint for the storage account.
CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();

// Create a container called 'quickstartblobs' and append a GUID value to it to make the name unique. 
cloudBlobContainer = cloudBlobClient.GetContainerReference("quickstartblobs" + Guid.NewGuid().ToString());
await cloudBlobContainer.CreateAsync();

// Set the permissions so the blobs are public. 
BlobContainerPermissions permissions = new BlobContainerPermissions
{
    PublicAccess = BlobContainerPublicAccessType.Blob
};
await cloudBlobContainer.SetPermissionsAsync(permissions);
```

### Upload blobs to the container

Next, the sample uploads a local file to a block blob. The code example gets a reference to a **CloudBlockBlob** object by calling the [GetBlockBlobReference](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.getblockblobreference) method on the container created in the previous section. It then uploads the selected file to the blob by calling the [​Upload​From​FileAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblockblob.uploadfromfileasync) method. This method creates the blob if it doesn't already exist, and overwrites it if it does. 

```csharp
// Create a file in your local MyDocuments folder to upload to a blob.
string localPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
string localFileName = "QuickStart_" + Guid.NewGuid().ToString() + ".txt";
sourceFile = Path.Combine(localPath, localFileName);
// Write text to the file.
File.WriteAllText(sourceFile, "Hello, World!");

Console.WriteLine("Temp file = {0}", sourceFile);
Console.WriteLine("Uploading to Blob storage as blob '{0}'", localFileName);

// Get a reference to the blob address, then upload the file to the blob.
// Use the value of localFileName for the blob name.
CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(localFileName);
await cloudBlockBlob.UploadFromFileAsync(sourceFile);
```

### List the blobs in a container

The sample lists the blobs in the container using the [​List​BlobsSegmentedAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.listblobssegmentedasync) method. In the case of the sample, only one blob has been added to the container, so the listing operation returns just that one blob.

If there are too many blobs to return in one call (by default, more than 5000), then the **​List​BlobsSegmentedAsync** method returns a segment of the total result set and a continuation token. To retrieve the next segment of blobs, you provide in the continuation token returned by the previous call, and so on, until the continuation token is null. A null continuation token indicates that all of the blobs have been retrieved. The sample code shows how to use the continuation token for the sake of best practices.

```csharp
// List the blobs in the container.
Console.WriteLine("List blobs in container.");
BlobContinuationToken blobContinuationToken = null;
do
{
    var results = await cloudBlobContainer.ListBlobsSegmentedAsync(null, blobContinuationToken);
    // Get the value of the continuation token returned by the listing call.
    blobContinuationToken = results.ContinuationToken;
    foreach (IListBlobItem item in results.Results)
    {
        Console.WriteLine(item.Uri);
    }
} while (blobContinuationToken != null); // Loop while the continuation token is not null. 

```

### Download blobs

Next, the sample downloads the blob created previously to your local file system using the [​Download​To​FileAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblob.downloadtofileasync) method. The sample code adds a suffix of "_DOWNLOADED" to the blob name so that you can see both files in local file system.

```csharp
// Download the blob to a local file, using the reference created earlier. 
// Append the string "_DOWNLOADED" before the .txt extension so that you can see both files in MyDocuments.
destinationFile = sourceFile.Replace(".txt", "_DOWNLOADED.txt");
Console.WriteLine("Downloading blob to {0}", destinationFile);
await cloudBlockBlob.DownloadToFileAsync(destinationFile, FileMode.Create);  
```

### Clean up resources

The sample cleans up the resources that it created by deleting the entire container using [Cloud​Blob​Container.​DeleteAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.deleteasync). You can also delete the local files if you like.

```csharp
Console.WriteLine("Press the 'Enter' key to delete the sample files, example container, and exit the application.");
Console.ReadLine();
// Clean up resources. This includes the container and the two temp files.
Console.WriteLine("Deleting the container");
if (cloudBlobContainer != null)
{
    await cloudBlobContainer.DeleteIfExistsAsync();
}
Console.WriteLine("Deleting the source, and downloaded files");
File.Delete(sourceFile);
File.Delete(destinationFile);
```

## Resources for developing .NET applications with blobs

See these additional resources for .NET development with Blob storage:

### Binaries and source code

- Download the NuGet package for the latest version of the [.NET client library](https://www.nuget.org/packages/WindowsAzure.Storage/) for Azure Storage. 
- View the [.NET client library source code](https://github.com/Azure/azure-storage-net) on GitHub.

### Client library reference and samples

- See the [.NET API reference](https://docs.microsoft.com/dotnet/api/overview/azure/storage) for more information about the .NET client library.
- Explore [Blob storage samples](https://azure.microsoft.com/resources/samples/?sort=0&service=storage&platform=dotnet&term=blob) written using the .NET client library.

## Next steps

In this quickstart, you learned how to upload, download, and list blobs using .NET. 

To learn how to create a web app that uploads an image to Blob storage, continue to [Upload image data in the cloud with Azure Storage](storage-upload-process-images.md).

> [!div class="nextstepaction"]
> [Blob Storage Operations How-To](storage-dotnet-how-to-use-blobs.md)

- To learn more about .NET Core, see [Get started with .NET in 10 minutes](https://www.microsoft.com/net/learn/get-started/).
- To explore a sample application that you can deploy from Visual Studio for Windows, see the [.NET Photo Gallery Web Application Sample with Azure Blob Storage](https://azure.microsoft.com/resources/samples/storage-blobs-dotnet-webapp/).
 