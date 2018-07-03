---
title: Azure Quickstart - Create a blob in object storage using the Java Storage SDK V10 | Microsoft Docs
description: In this quickstart, you create a container in object (Blob) storage, upload a file, list objects and download using the Java Storage SDK. 
services: storage
author: roygara
manager: jeconnoc

ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 07/02/2018
ms.author: rogarana
---

# Quickstart: Upload, download, and list blobs using the Java SDK V10 (Preview)

In this quickstart, you learn how to use the new Java Storage SDK to upload, download, and list block blobs in a container in Azure Blob storage. The new Java SDK uses the Reactive programming model with RxJava providing you asynchronous operations. Learn more about RxJava [here](https://github.com/ReactiveX/RxJava). 

## Prerequisites

To complete this quickstart:

* Install and configure [Maven](http://maven.apache.org/download.cgi) to work from the command line, or any Java IDE of your preference
* Install and configure a [JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [storage-quickstart-tutorial-create-account-portal](../../../includes/storage-quickstart-tutorial-create-account-portal.md)]

## Download the sample application

The [sample application](https://github.com/Azure-Samples/storage-blobs-java-v10-quickstart) used in this quickstart is a basic console application. 

Use [git](https://git-scm.com/) to download a copy of the application to your development environment.

```bash
git clone https://github.com/Azure-Samples/storage-blobs-java-v10-quickstart.git
```

This command clones the repository to your local git folder.

Once the project finishes importing, open **Quickstart.java** (located in **src/main/java/quickstart**).

[!INCLUDE [storage-copy-account-key-portal](../../../includes/storage-copy-account-key-portal.md)]

## Configure your storage connection string
This solution requires your storage account name and key to be securely stored in environment variables local to the machine running the sample. Follow one of the examples below depending on your operating System to create the environment variables.

### For Linux

```
export AZURE_STORAGE_ACCOUNT="<youraccountname>"
export AZURE_STORAGE_ACCESS_KEY="<youraccountkey>"
```

### For Windows

```
setx AZURE_STORAGE_ACCOUNT "<youraccountname>"
setx AZURE_STORAGE_ACCESS_KEY "<youraccountkey>"
```

## Run the sample

This sample creates a test file in your default directory (AppData\Local\Temp, for windows users), then prompts you to enter commands to upload the test file to Blob storage, list the blobs in the container, and download the uploaded file with a new name so you can compare the old and new files. 

If you wish to run the sample using Maven at the commandline, open a shell and navigate to **storage-blobs-java-v10-quickstart** inside of your cloned directory. Then enter `mvn compile exec:java`.

The following is an example of output if you were to run the application on Windows.

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

You have control of the sample, so enter commands to have it execute the code. Be aware that inputs are case-sensitive.

You can also use a tool such as the [Azure Storage Explorer](http://storageexplorer.com/?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information. 

After you've verified the files, **E** and press enter to finish the demo and delete the test files. Now that you know what the sample does, open the **Quickstart.java** file to look at the code. 

## Understand the sample code

Next, lets walk-through the sample code so that you can understand how it works.

### Get references to the storage objects

The first thing to do is create the references to the objects used to access and manage Blob storage. These objects build on each other -- each is used by the next one in the list.

* Create an instance of the StorageURL object pointing to the storage account.

    The [**StorageURL**](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._storage_u_r_l?view=azure-java-preview) object is a representation of your storage account and it allows you to generate a new pipeline. A pipeline ([HTTP Pipeline](https://github.com/Azure/azure-storage-java/wiki/Azure-Storage-Java-V10-Overview#url-types--http-pipeline)) is a set of policies that are used to manipulate requests and responses with authorization, logging and retry mechanisms. With the pipeline you can create an instance of the [**ServiceURL**](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._service_u_r_l?view=azure-java-preview) object, which allows you to create an instance of the [**ContainerURL**](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._container_u_r_l?view=azure-java-preview), which is necessary to run operations on Blob containers.

* Create an instance of the ContainerURL object, representing the container you are accessing. Containers are used to organize your blobs like you use folders on your computer to organize your files.

    The **ContainerURL** provides you a point of access to the container service. Using the **ContainerURL** you can create an instance of the [**BlobURL**](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._container_u_r_l?view=azure-java-preview) object, which is necessary to create blobs.

* Create an instance of the [BlobURL](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._blob_u_r_l?view=azure-java-preview) object, which points to the specific blob in which you are interested.

> [!IMPORTANT]
> Container names must be lowercase. See [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata) for more information about container and blob names.

### Create a container 

In this section, you create an instance of the ContainerURL, and create a new container with it. The container in the sample is called **quickstart**. 

This example uses [containerURL.create](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._container_u_r_l.create?view=azure-java-preview) because we want to create a new container each time the sample is run. Alternatively, you can create the container ahead of time so you don't need to create it in the code.

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

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are the most commonly used, and that's what is used in this quickstart. 

To upload a file to a blob, get a reference to the blob in the target container. Once you have the blob reference, you can upload a file to it by using either the low-level APIs such as [Upload](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._block_blob_u_r_l.upload?view=azure-java-preview) -a.k.a PutBlob, [StageBlock](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._block_blob_u_r_l.stageblock?view=azure-java-preview#com_microsoft_azure_storage_blob__block_blob_u_r_l_stageBlock_String_Flowable_ByteBuffer__long_LeaseAccessConditions_) -a.k.a PutBLock- in the instance of BlockBlobURL, or the high-level APIs provided in the [TransferManager](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._transfer_manager?view=azure-java-preview) class, such as the [TransferManager.uploadFileToBlockBlob](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._transfer_manager.uploadfiletoblockblob?view=azure-java-preview) method. This operation creates the blob if it doesn't already exist, or overwrites it if it does already exist.

The sample code creates a local file to be used for the upload and download. storing the file to be uploaded as **sourceFile** and the url of the blob in **blob**. The following example uploads the file to your container called **quickstart**.

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

Block blobs can be any type of text or binary file. Page blobs are primarily used for the VHD files used to back IaaS VMs. Append blobs are for appending data to the end, and often used for logging. Most objects stored in Blob storage are block blobs.

### List the blobs in a container

You can get a list of objects in a container using [containerURL.​listBlobsFlatSegment](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._container_u_r_l.listblobsflatsegment?view=azure-java-preview). This method returns up to 5000 objects at once along with a continuation marker (next marker) if there is more to list in the container. In order to this, we create a helper function that calls itself repeatedly as long as there is next marker in the previous listBlobsFlatSegment response.

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

Download blobs to your local disk using [blobURL.download](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._blob_u_r_l.download?view=azure-java-preview).

The following code downloads the blob uploaded in a previous section, adding a suffix of "_DOWNLOADED" to the blob name so you can see both files on local disk. 

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

If you no longer need the blobs uploaded in this quickstart, you can delete the entire container using [containerURL.delete](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.storage.blob._container_u_r_l.delete?view=azure-java-preview). This method also deletes the files in the container.

```java
containerURL.delete(null).blockingGet();
```

## Next steps

In this quickstart, you learned how to transfer files between a local disk and Azure Blob storage using Java. 

> [!div class="nextstepaction"]
> [Storage SDK V10 for Java source code](https://github.com/Azure/azure-storage-java/tree/New-Storage-SDK-V10-Preview)
> [API Reference](https://docs.microsoft.com/en-us/java/api/storage/client?view=azure-java-preview)
> [Learn more about RxJava](https://github.com/ReactiveX/RxJava)