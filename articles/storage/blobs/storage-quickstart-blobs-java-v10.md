---
title: 'Azure quickstart: Create a blob in object storage by using Java Storage SDK V10 | Microsoft Docs'
description: In this quickstart, you create a container in object (Azure Blob) storage, upload a file, list objects, and download by using the Java Storage SDK. 
services: storage
author: roygara


ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 07/02/2018
ms.author: rogarana
---

# Quickstart: Upload, download, and list blobs by using the Java Storage SDK V10 (preview)

In this quickstart, you learn how to use the new Java Storage SDK to upload, download, and list block blobs in a container in Azure Blob storage. The new Java SDK uses the reactive programming model with RxJava, which provides asynchronous operations. Learn more about RxJava [reactive extensions for the Java VM](https://github.com/ReactiveX/RxJava). 

## Prerequisites

Install and configure these applications:

* [Maven](http://maven.apache.org/download.cgi) to work from the command line, or any Java integrated development environment that you prefer
* [JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [storage-create-account-portal-include](../../../includes/storage-create-account-portal-include.md)]

## Download the sample application

The [sample application](https://github.com/Azure-Samples/storage-blobs-java-v10-quickstart) used in this quickstart is a basic console application. 

Use [git](https://git-scm.com/) to download a copy of the application to your development environment.

```bash
git clone https://github.com/Azure-Samples/storage-blobs-java-v10-quickstart.git
```

This command clones the repository to your local git folder.

After the project finishes importing, open **Quickstart.java**, located in **src/main/java/quickstart**.

[!INCLUDE [storage-copy-account-key-portal](../../../includes/storage-copy-account-key-portal.md)]

## Configure your storage connection string
This solution requires that you securely store the name and key of your storage account. Store them in environment variables local to the machine that runs the sample. Follow either the Linux or the Windows example, depending on your operating system, to create the environment variables.

### Linux example

```
export AZURE_STORAGE_ACCOUNT="<youraccountname>"
export AZURE_STORAGE_ACCESS_KEY="<youraccountkey>"
```

### Windows example

```
setx AZURE_STORAGE_ACCOUNT "<youraccountname>"
setx AZURE_STORAGE_ACCESS_KEY "<youraccountkey>"
```

## Run the sample

This sample creates a test file in your default directory, **AppData\Local\Temp**, for Windows users. Then it prompts you to take the following steps:

1. Enter commands to upload the test file to Azure Blob storage.
2. List the blobs in the container.
3. Download the uploaded file with a new name so you can compare the old and new files. 

If you want to run the sample using Maven at the command line, open a shell and browse to **storage-blobs-java-v10-quickstart** inside your cloned directory. Then enter `mvn compile exec:java`.

This example shows your output if you run the application on Windows.

```
Created quickstart container
Enter a command
(P)utBlob | (L)istBlobs | (G)etBlob | (D)eleteBlobs | (E)xitSample
# Enter a command :
P
Uploading the sample file into the container: https://<storageaccount>.blob.core.windows.net/quickstart
# Enter a command :
L
Listing blobs in the container: https://<storageaccount>.blob.core.windows.net/quickstart
Blob name: SampleBlob.txt
# Enter a command :
G
Get the blob: https://<storageaccount>.blob.core.windows.net/quickstart/SampleBlob.txt
The blob was downloaded to C:\Users\<useraccount>\AppData\Local\Temp\downloadedFile13097087873115855761.txt
# Enter a command :
D
Delete the blob: https://<storageaccount>.blob.core.windows.net/quickstart/SampleBlob.txt

# Enter a command :
>> Blob deleted: https://<storageaccount>.blob.core.windows.net/quickstart/SampleBlob.txt
E
Cleaning up the sample and exiting!
```

You control the sample, so enter commands to have it run the code. Inputs are case sensitive.

You can also use a tool like the [Azure Storage Explorer](http://storageexplorer.com/?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that gives you access to your storage account information. 

Verify the files. Then select **E** and select **Enter** to finish the demo and delete the test files. Now that you know what the sample does, open the **Quickstart.java** file to look at the code. 

## Understand the sample code

The following sections walk through the sample code so you can understand how it works.

### Get references to the storage objects

First, you create the references to the objects that are used to access and manage Blob storage. These objects build on each other. Each is used by the next one in the list.

1. Create an instance of the **StorageURL** object that points to the storage account.

    * The [StorageURL](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._storage_u_r_l?view=azure-java-preview) object is a representation of your storage account. You use it to generate a new pipeline. 
    * A pipeline is a set of policies that is used to manipulate requests and responses with authorization, logging, and retry mechanisms. For more information, see [HTTP Pipeline](https://github.com/Azure/azure-storage-java/wiki/Azure-Storage-Java-V10-Overview#url-types--http-pipeline).  
    * By using the pipeline, create an instance of the [ServiceURL](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._service_u_r_l?view=azure-java-preview) object.
    * By using the **ServiceURL** object, create an instance of the [ContainerURL](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._container_u_r_l?view=azure-java-preview).
    * The **ContainerURL** is necessary to run operations on blob containers.

2. Create an instance of the **ContainerURL** object that represents the container you're accessing. Containers organize your blobs in the same way that folders on your computer organize your files.

    * The **ContainerURL** provides a point of access to the container service. 
    * You can create an instance of the [BlobURL](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._blob_u_r_l?view=azure-java-preview) object by using the [ContainerURL](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._container_u_r_l?view=azure-java-preview).
    * The **BlobURL** is necessary to create blobs.

3. Create an instance of the **BlobURL** object that points to the specific blob you're interested in. 

> [!IMPORTANT]
> Container names must be lowercase. For more information about container and blob names, see [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

### Create a container 

In this section, you create an instance of the **ContainerURL**. You create a new container along with it. The container in the sample is called **quickstart**. 

This example uses [ContainerURL.create](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._container_u_r_l.create?view=azure-java-preview), so you can create a new container each time the sample runs. Or you can create the container ahead of time, so you don't need to create it in the code.

```java
// Create a ServiceURL to call the Blob service. We will also use this to construct the ContainerURL
SharedKeyCredentials creds = new SharedKeyCredentials(accountName, accountKey);
// We are using a default pipeline here, you can learn more about it at https://github.com/Azure/azure-storage-java/wiki/Azure-Storage-Java-V10-Overview
final ServiceURL serviceURL = new ServiceURL(new URL("http://" + accountName + ".blob.core.windows.net"), StorageURL.createPipeline(creds, new PipelineOptions()));

// Let's create a container using a blocking call to Azure Storage
// If container exists, we'll catch and continue
containerURL = serviceURL.createContainerURL("quickstart");

try {
    ContainersCreateResponse response = containerURL.create(null, null).blockingGet();
    System.out.println("Container Create Response was " + response.statusCode());
} catch (RestException e){
    if (e instanceof RestException && ((RestException)e).response().statusCode() != 409) {
        throw e;
    } else {
        System.out.println("quickstart container already exists, resuming...");
    }
}
```

### Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are the most commonly used. They're used in this quickstart. 

1. To upload a file to a blob, get a reference to the blob in the target container. 
2. After you get the blob reference, you can upload a file to it by using either of the following APIs:

    * Low-level APIs. Examples are [BlockBlobURL.upload](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._block_blob_u_r_l.upload?view=azure-java-preview), also called PutBlob, and [BlockBlobURL.stageBlock](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._block_blob_u_r_l.stageblock?view=azure-java-preview#com_microsoft_azure_storage_blob__block_blob_u_r_l_stageBlock_String_Flowable_ByteBuffer__long_LeaseAccessConditions_), also called PutBLock, in the instance of **BlockBlobURL**. 

    * High-level APIs provided in the [TransferManager class](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._transfer_manager?view=azure-java-preview). An example is the [TransferManager.uploadFileToBlockBlob](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._transfer_manager.uploadfiletoblockblob?view=azure-java-preview) method. 

    This operation creates the blob if it doesn't already exist. It overwrites the blob if it already exists.

The sample code creates a local file to be used for the upload and download. It stores the file to be uploaded as **sourceFile** and stores the URL of the blob in **blob**. The following example uploads the file to your container called **quickstart**.

```java
static void uploadFile(BlockBlobURL blob, File sourceFile) throws IOException {
   	
    FileChannel fileChannel = FileChannel.open(sourceFile.toPath());
            
    // Uploading a file to the blobURL using the high-level methods available in TransferManager class
    // Alternatively call the Upload/StageBlock low-level methods from BlockBlobURL type
    TransferManager.uploadFileToBlockBlob(fileChannel, blob, 8*1024*1024, null)
        .subscribe(response-> {
            System.out.println("Completed upload request.");
            System.out.println(response.response().statusCode());
        });
}
```

Block blobs can be any type of text or binary file. Page blobs are primarily used for the VHD files used to back IaaS VMs. Append blobs are used to append data to the end, and they're often used for logging. Most objects stored in Blob storage are block blobs.

### List the blobs in a container

You can get a list of objects in a container by using [ContainerURL.​listBlobsFlatSegment](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._container_u_r_l.listblobsflatsegment?view=azure-java-preview). This method returns up to 5,000 objects at once along with a continuation, or next, marker if there are more to list in the container. Create a helper function that calls itself repeatedly when there's a next marker in the previous **listBlobsFlatSegment** response.

```java
static void listBlobs(ContainerURL containerURL) {
    // Each ContainerURL.listBlobsFlatSegment call return up to maxResults (maxResults=10 passed into ListBlobOptions below).
    // To list all Blobs, we are creating a helper static method called listAllBlobs, 
  	// and calling it after the initial listBlobsFlatSegment call
    ListBlobsOptions options = new ListBlobsOptions(null, null, 10);

    containerURL.listBlobsFlatSegment(null, options)
        .flatMap(containersListBlobFlatSegmentResponse -> 
            listAllBlobs(containerURL, containersListBlobFlatSegmentResponse))    
                .subscribe(response-> {
                    System.out.println("Completed list blobs request.");
                    System.out.println(response.statusCode());
                });
}

private static Single <ContainersListBlobFlatSegmentResponse> listAllBlobs(ContainerURL url, ContainersListBlobFlatSegmentResponse response) {                
    // Process the blobs returned in this result segment (if the segment is empty, blobs() will be null.
    if (response.body().blobs() != null) {
        for (Blob b : response.body().blobs().blob()) {
            String output = "Blob name: " + b.name();
            if (b.snapshot() != null) {
                output += ", Snapshot: " + b.snapshot();
            }
            System.out.println(output);
        }
    }
    else {
        System.out.println("There are no more blobs to list off.");
    }
    
    // If there is not another segment, return this response as the final response.
    if (response.body().nextMarker() == null) {
        return Single.just(response);
    } else {
        /*
        IMPORTANT: ListBlobsFlatSegment returns the start of the next segment; you MUST use this to get the next
        segment (after processing the current result segment
        */
            
        String nextMarker = response.body().nextMarker();

        /*
        The presence of the marker indicates that there are more blobs to list, so we make another call to
        listBlobsFlatSegment and pass the result through this helper function.
        */
            
    return url.listBlobsFlatSegment(nextMarker, new ListBlobsOptions(null, null,1))
        .flatMap(containersListBlobFlatSegmentResponse ->
            listAllBlobs(url, containersListBlobFlatSegmentResponse));
    }
}
```

### Download blobs

Download blobs to your local disk by using [BlobURL.download](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._blob_u_r_l.download?view=azure-java-preview).

The following code downloads the blob uploaded in a previous section. It adds a suffix of **_DOWNLOADED** to the blob name, so you can see both files on local disk. 

```java
static void getBlob(BlockBlobURL blobURL, File sourceFile) {
    try {
        // Get the blob using the low-level download method in BlockBlobURL type
        // com.microsoft.rest.v2.util.FlowableUtil is a static class that contains helpers to work with Flowable
        blobURL.download(new BlobRange(0, Long.MAX_VALUE), null, false)
            .flatMapCompletable(response -> {
                AsynchronousFileChannel channel = AsynchronousFileChannel.open(Paths
                    .get(sourceFile.getPath()), StandardOpenOption.CREATE,  StandardOpenOption.WRITE);
                        return FlowableUtil.writeFile(response.body(), channel);
            }).doOnComplete(()-> System.out.println("The blob was downloaded to " + sourceFile.getAbsolutePath()))
            // To call it synchronously add .blockingAwait()
            .subscribe();
    } catch (Exception ex){
        System.out.println(ex.toString());
    }
}
```

### Clean up resources

If you don't need the blobs uploaded in this quickstart, you can delete the entire container by using [ContainerURL.delete](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._container_u_r_l.delete?view=azure-java-preview). This method also deletes the files in the container.

```java
containerURL.delete(null).blockingGet();
```

## Next steps

In this quickstart, you learned how to transfer files between a local disk and Azure Blob storage by using Java. 

> [!div class="nextstepaction"]
> [Storage SDK V10 for Java source code](https://github.com/Azure/azure-storage-java/tree/New-Storage-SDK-V10-Preview)
> [API Reference](https://docs.microsoft.com/en-us/java/api/overview/azure/storage/client?view=azure-java-preview)
> [Learn more about RxJava](https://github.com/ReactiveX/RxJava)
