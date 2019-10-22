---
title: "Quickstart: Azure Blob storage client library version 12 for Java"
description: In this quickstart, you learn how to use the Azure Blob storage client library version 12 for Java to create a container and a blob in Blob (object) storage. Next, you learn how to download the blob to your local computer, and how to list all of the blobs in a container.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 10/23/2019
ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
---

# Quickstart: Azure Blob storage client library version 12 for Java

Get started with the Azure Blob Storage client library v12 for Java. Azure Blob Storage is Microsoft's object storage solution for the cloud. Follow steps to install the package and try out example code for basic tasks. Blob storage is optimized for storing massive amounts of unstructured data.

Use the Azure Blob Storage client library v12 for Java to:

* Create a container
* Set permissions on a container
* Create a blob in Azure Storage
* Download the blob to your local computer
* List all of the blobs in a container
* Delete a container

[API reference documentation](/java/api/overview/azure/storage?view=azure-java-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-blob) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Blobs/12) | [Samples](/samples/browse/?products=azure&service=storage&languages=java&term=blob)

## Prerequisites

* [Java Development Kit (JDK)](/java/azure/jdk/?view=azure-java-stable) with version 8 or above
* [Apache Maven](https://maven.apache.org/download.cgi)
* Azure subscription - [create one for free](https://azure.microsoft.com/free/)
* Azure Storage account - [create a storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account)

## Setting up

This section walks you through preparing a project to work with the Azure Blob Storage client library v12 for Java.

### Create the project

Create a Java Core application named *blob-quickstart-v12*.

1. In a console window (such as cmd, PowerShell, or Bash), use Maven to create a new console app with the name *blob-quickstart-v12*. Type the following **mvn** command all on a single line to create a simple "Hello world!" Java project. The command is displayed here on multiple lines for readability.

   ```console
   mvn archetype:generate -DgroupId=blob-quickstart-v12
                          -DartifactId=blob-quickstart-v12
                          -DarchetypeArtifactId=maven-archetype-quickstart
                          -DarchetypeVersion=1.4
                          -DinteractiveMode=false
   ```

1. The output from generating the project should look something like this:

    ```console
    [INFO] Scanning for projects...
    [INFO]
    [INFO] ------------------< org.apache.maven:standalone-pom >-------------------
    [INFO] Building Maven Stub Project (No POM) 1
    [INFO] --------------------------------[ pom ]---------------------------------
    [INFO]
    [INFO] >>> maven-archetype-plugin:3.1.2:generate (default-cli) > generate-sources @ standalone-pom >>>
    [INFO]
    [INFO] <<< maven-archetype-plugin:3.1.2:generate (default-cli) < generate-sources @ standalone-pom <<<
    [INFO]
    [INFO]
    [INFO] --- maven-archetype-plugin:3.1.2:generate (default-cli) @ standalone-pom ---
    [INFO] Generating project in Batch mode
    [INFO] ----------------------------------------------------------------------------
    [INFO] Using following parameters for creating project from Archetype: maven-archetype-quickstart:1.4
    [INFO] ----------------------------------------------------------------------------
    [INFO] Parameter: groupId, Value: blob-quickstart-v12
    [INFO] Parameter: artifactId, Value: blob-quickstart-v12
    [INFO] Parameter: version, Value: 1.0-SNAPSHOT
    [INFO] Parameter: package, Value: blob-quickstart-v12
    [INFO] Parameter: packageInPathFormat, Value: blob-quickstart-v12
    [INFO] Parameter: version, Value: 1.0-SNAPSHOT
    [INFO] Parameter: package, Value: blob-quickstart-v12
    [INFO] Parameter: groupId, Value: blob-quickstart-v12
    [INFO] Parameter: artifactId, Value: blob-quickstart-v12
    [INFO] Project created from Archetype in dir: C:\QuickStarts\blob-quickstart-v12
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time:  3.482 s
    [INFO] Finished at: 2019-10-22T14:51:34-07:00
    [INFO] ------------------------------------------------------------------------
    ```

1. Switch to the newly created *blob-quickstart-v12* folder.

   ```console
   cd blob-quickstart-v12
   ```

### Install the package

Open the *pom.xml* file in your text editor. Add the following dependency element to the group of dependencies.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-storage-blob</artifactId>
    <version>12.0.0-preview.4</version>
</dependency>
```

### Set up the app framework

From the project directory:

1. Navigate to the */src/main/java/blob-quickstart-v12* directory
1. Open the *App.java* file in your editor
1. Remove the `System.out.println( "Hello World!" );` statement
1. Add `import` directives
1. Update the `Main` method declaration to support async code

Here's the code:

```java
```

### Copy your credentials from the Azure portal

When the sample application makes a request to Azure Storage, it must be authorized. To authorize a request, add your storage account credentials to the application as a connection string. View your storage account credentials by following these steps:

1. Navigate to the [Azure portal](https://portal.azure.com).
2. Locate your storage account.
3. In the **Settings** section of the storage account overview, select **Access keys**. Here, you can view your account access keys and the complete connection string for each key.
4. Find the **Connection string** value under **key1**, and select the **Copy** button to copy the connection string. You will add the connection string value to an environment variable in the next step.

    ![Screenshot showing how to copy a connection string from the Azure portal](../../../includes/media/storage-copy-connection-string-portal/portal-connection-string.png)

### Configure your storage connection string

After you have copied your connection string, write it to a new environment variable on the local machine running the application. To set the environment variable, open a console window, and follow the instructions for your operating system. Replace `<yourconnectionstring>` with your actual connection string.

#### Windows

```cmd
setx CONNECT_STR "<yourconnectionstring>"
```

After you add the environment variable in Windows, you must start a new instance of the command window.

#### Linux

```bash
export CONNECT_STR="<yourconnectionstring>"
```

#### MacOS

```bash
export CONNECT_STR="<yourconnectionstring>"
```

#### Restart programs

After you add the environment variable, restart any running programs that will need to read the environment variable. For example, restart your development environment or editor before continuing.

## Object model

Azure Blob storage is optimized for storing massive amounts of unstructured data. Unstructured data is data that does not adhere to a particular data model or definition, such as text or binary data. Blob storage offers three types of resources:

* The storage account
* A container in the storage account
* A blob in the container

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture](./media/storage-quickstart-blobs-dotnet-v12/blob1.png)

Use the following Java classes to interact with these resources:

* [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient): The `BlobServiceClient` class allows you to manipulate Azure Storage service resources and blob containers. The storage account provides the top-level namespace for the Blob service.
* [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient): The `BlobContainerClient` class allows you to manipulate Azure Storage containers and their blobs.
* [BlobClient](/dotnet/api/azure.storage.blobs.blobclient): The `BlobClient` class allows you to manipulate Azure Storage blobs.
* [BlobDownloadInfo](/dotnet/api/azure.storage.blobs.models.blobdownloadinfo): The `BlobDownloadInfo` class represents the properties and content returned from downloading a blob.

## Code examples

These example code snippets show you how to perform the following with the Azure Blob storage client library for Java:

   * [Get the connection string](#get-the-connection-string)
   * [Create a container](#create-a-container)
   * [Set permissions on a container](#set-permissions-on-a-container)
   * [Upload blobs to a container](#upload-blobs-to-a-container)
   * [List the blobs in a container](#list-the-blobs-in-a-container)
   * [Download blobs](#download-blobs)
   * [Delete a container](#delete-a-container)

### Get the connection string

The code below retrieves the connection string for the storage account from the environment variable created in the [Configure your storage connection string](#configure-your-storage-connection-string) section.

Add this code inside the `Main` method:

```csharp
Console.WriteLine("Azure Blob Storage v12 - Java quickstart sample\n");

// Retrieve the connection string for use with the application. The storage
// connection string is stored in an environment variable on the machine
// running the application called CONNECT_STR. If the
// environment variable is created after the application is launched in a
// console or with Visual Studio, the shell or application needs to be closed
// and reloaded to take the environment variable into account.
string connectionString = Environment.GetEnvironmentVariable("CONNECT_STR");
```

### Create a container

Decide on a name for the new container. The code below appends a GUID value to the container name to ensure that it is unique.

> [!IMPORTANT]
> Container names must be lowercase. For more information about naming containers and blobs, see [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

Next, create an instance of the [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) class, then call the [CreateAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.createasync) method to create actually the container in your storage account. In a production environment, it's often preferable to use the [CreateIfNotExistsAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.createifnotexistsasync) method to create the container only if it does not already exist.

Add this code to the end of the `Main` method:

```csharp
//Create a unique name for the container
string containerName = "quickstartblobs" + Guid.NewGuid().ToString();

// Create an object that represents the container
BlobContainerClient container = new BlobContainerClient(connectionString, containerName);

// Create the actual container
await container.CreateAsync();
```

### Set permissions on a container

Set permissions on the container so that any blobs in the container are public. If a blob is public, it can be accessed anonymously by any client.

```csharp
// Set permissions so blobs in the container are public
await container.SetAccessPolicyAsync(PublicAccessType.BlobContainer);
```

### Upload blobs to a container

The following code snippet:

1. Declares and initializes a member variable that contains the path to the local *Documents* directory.
1. Creates a text file in the local *Documents* directory.
1. Gets a reference to a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) object by calling the [GetBlobClient](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobclient) method on the container from the [Create a container](#create-a-container) section.
1. Uploads the local text file to the blob by calling the [​Upload​Async](/dotnet/api/azure.storage.blobs.blobclient.uploadasync) method. This method creates the blob if it doesn't already exist, and overwrites it if it does.

Add this code to the end of the `Main` method:

```csharp
// Path to the local documents folder
string myDocumentsPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);

// Create a file in your local myDocumentsPath folder to upload to a blob
string localFileName = "quickstart" + Guid.NewGuid().ToString() + ".txt";
string localFilePath = Path.Combine(myDocumentsPath, localFileName);

// Write text to the file
await File.WriteAllTextAsync(localFilePath, "Hello, World!");

// Get a reference to a blob
BlobClient blob = container.GetBlobClient(localFileName);

Console.WriteLine("Uploading to Blob storage as blob:\n\t {0}\n", blob.Uri);

// Open the file and upload its data
using FileStream uploadFileStream = File.OpenRead(localFilePath);
await blob.UploadAsync(uploadFileStream);
uploadFileStream.Close();
```

### List the blobs in a container

List the blobs in the container by calling the [GetBlobsAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.getblobsasync) method. In this case, only one blob has been added to the container, so the listing operation returns just that one blob.

Add this code to the end of the `Main` method:

```csharp
Console.WriteLine("Listing blobs...");

// List all blobs in the container
await foreach (BlobItem blobItem in container.GetBlobsAsync())
{
    Console.WriteLine("\t" + blobItem.Name);
}
```

### Download blobs

Download the blob created previously by calling the [​Download​Async](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadasync) method. The example code adds a suffix of "DOWNLOADED" to the file name so that you can see both files in local file system.

Add this code to the end of the `Main` method:

```csharp
// Download the blob to a local file, using the reference created earlier.
// Append the string "DOWNLOADED" before the .txt extension so that you can see both files in MyDocuments.
string downloadFilePath = localFilePath.Replace(".txt", "DOWNLOADED.txt");

Console.WriteLine("\nDownloading blob to\n\t {0}\n", downloadFilePath);

// Download the blob's contents and save it to a file
BlobDownloadInfo download = await blob.DownloadAsync();

using FileStream downloadFileStream = File.OpenWrite(downloadFilePath);
await download.Content.CopyToAsync(downloadFileStream);
downloadFileStream.Close();
```

### Delete a container

The following code cleans up the resources the app created by deleting the entire container using [​DeleteAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.deleteasync). You can also delete the local files if you like.

The app pauses for user input by calling `Console.ReadLine` before it deletes the blob, container, and local files. This is a good chance to verify that the resources were actually created correctly, before they are deleted.

Add this code to the end of the `Main` method:

```csharp
// Clean up
Console.Write("Press any key to begin clean up");
Console.ReadLine();

Console.WriteLine("Deleting blob container...");
await container.DeleteAsync();

Console.WriteLine("Deleting the local source and downloaded files...");
File.Delete(localFilePath);
File.Delete(downloadFilePath);

Console.WriteLine("Done");
```

## Run the code

This app creates a test file in your local *MyDocuments* folder and uploads it to Blob storage. The example then lists the blobs in the container and downloads the file with a new name so that you can compare the old and new files.

Navigate to your application directory, then build and run the application.

```console
dotnet build
```

```console
dotnet run
```

The output of the example application is similar to the following example:

```output
Azure Blob Storage v12 - Java quickstart sample

Uploading to Blob storage as blob:
        https://mystorageacct.blob.core.windows.net/quickstartblobs79c3043b-0b0b-4935-9dc3-308fcb89a616/quickstart230c0fd7-9fa8-4b11-8207-25625b6ec0af.txt

Listing blobs...
        quickstart230c0fd7-9fa8-4b11-8207-25625b6ec0af.txt

Downloading blob to:
        C:\Users\myusername\Documents\quickstart230c0fd7-9fa8-4b11-8207-25625b6ec0afDOWNLOADED.txt

Press any key to begin clean up
Deleting blob container...
Deleting the local source and downloaded files...
Done
```

When you press the **Enter** key, the application deletes the storage container and the files. Before you delete them, check your *MyDocuments* folder for the two files. You can open them and observe that they are identical. Copy the blob's URL from the console window and paste it into a browser to view the contents of the blob.

After you've verified the files, hit any key to finish the demo and delete the test files.

## Next steps

In this quickstart, you learned how to upload, download, and list blobs using Java.

To learn how to create a web app that uploads an image to Blob storage, continue to:

> [!div class="nextstepaction"]
> [Upload and process an image](storage-upload-process-images.md)

* To learn more about .NET Core, see [Get started with .NET in 10 minutes](https://www.microsoft.com/net/learn/get-started/).
* To explore a sample application that you can deploy from Visual Studio for Windows, see the [.NET Photo Gallery Web Application Sample with Azure Blob Storage](https://azure.microsoft.com/resources/samples/storage-blobs-dotnet-webapp/).
