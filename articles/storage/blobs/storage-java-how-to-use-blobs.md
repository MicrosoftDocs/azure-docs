---
title: How to use Azure Blob storage from Java
description: Use the Azure Storage libraries for Java to interact with Azure Blob storage
services: storage
author: normesta
ms.service: storage
ms.date: 03/21/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# How to use Blob storage from Java

This guide shows you how to interact with blobs by using Java. It contains snippets that help you get started with common tasks such as uploading and downloading blobs. It also contains snippets that showcase common tasks with a hierarchical file system.

## Create a storage account

To create a storage account, see [Create a storage account](../common/storage-quickstart-create-account.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

Enable a hierarchical namespace if you want to use the code snippets in this article that perform operations on a hierarchical file system.

![Enabling a hierarchical namespace](media/storage-java-how-to-use-blobs/enable-hierarchical-namespace.png)

## Set up your development environment

Perform these tasks:

* Install the [JDK](https://docs.microsoft.com/en-us/java/azure/java-supported-jdk-runtime?view=azure-java-stable).

* Set the JAVA_HOME environment variable to the install location of the JDK.

* Install [Apache Maven](https://maven.apache.org/download.cgi).

* Create an Apache Maven project. 

  If you're using VS Code, see [Writing Java with Visual Studio Code](https://code.visualstudio.com/docs/java/java-tutorial) for specific guidance.

* Add a Blob service dependency to the `pom.xml` file of your Apache Maven project. 

  See [Azure Storage libraries for Java](https://docs.microsoft.com/java/api/overview/azure/storage?view=azure-java-stable) for specific guidance.

## Add library references to your code file

Add these import statements to your .java code file.

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.channels.AsynchronousFileChannel;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.security.InvalidKeyException;
import com.microsoft.azure.storage.blob.BlockBlobURL;
import com.microsoft.azure.storage.blob.ContainerURL;
import com.microsoft.azure.storage.blob.ListBlobsOptions;
import com.microsoft.azure.storage.blob.PipelineOptions;
import com.microsoft.azure.storage.blob.ServiceURL;
import com.microsoft.azure.storage.blob.SharedKeyCredentials;
import com.microsoft.azure.storage.blob.StorageURL;
import com.microsoft.azure.storage.blob.TransferManager;
import com.microsoft.azure.storage.blob.models.BlobItem;
import com.microsoft.azure.storage.blob.models.ContainerCreateResponse;
import com.microsoft.azure.storage.blob.models.ContainerListBlobFlatSegmentResponse;
import com.microsoft.rest.v2.RestException;
import io.reactivex.*;
```

[!INCLUDE [storage-copy-account-key-portal](../../../includes/storage-copy-account-key-portal.md)]

## Create a container and setup objects

To create a blob container, create an instance of a [ContainerURL](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._container_u_r_l?view=azure-java-preview) class by calling the [ServiceURL.createContainerURL](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._service_u_r_l.createcontainerurl?view=azure-java-preview) method.

Then, call the [ContainerURL.create](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._container_u_r_l.create?view=azure-java-preview) method.

```java
static ContainerURL createContainer(String containerName, String accountName,
String accountKey) throws IOException, InvalidKeyException {
  
        SharedKeyCredentials creds = new SharedKeyCredentials(accountName, accountKey);

        final ServiceURL serviceURL = new ServiceURL
            (new URL("https://" + accountName + ".blob.core.windows.net"), 
            StorageURL.createPipeline(creds, new PipelineOptions()));

        ContainerURL containerURL = serviceURL.createContainerURL(containerName);

        ContainerCreateResponse response = containerURL.create(null, null, null).blockingGet();

        System.out.println("Container Create Response was " + response.statusCode());

        return containerURL;
}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [ServiceURL.createContainerURL](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._service_u_r_l.createcontainerurl?view=azure-java-preview)
> * [ContainerURL.create](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._container_u_r_l.create?view=azure-java-preview)

## Upload blobs to the container

Create a blob by calling the [ContainerURL.createBlockBlobURL](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._container_u_r_l.createblockbloburl?view=azure-java-preview) method. Use the [TrasferManager.uploadFileToBlockBlob](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._transfer_manager.uploadfiletoblockblob?view=azure-java-preview) method to upload a file from your local computer.

```java
static BlockBlobURL uploadFile(ContainerURL containerURL, String sourceFilePath,
    String blobName) throws IOException {

    AsynchronousFileChannel fileChannel =
        AsynchronousFileChannel.open(Paths.get(sourceFilePath));

        // Create a BlockBlobURL to run operations on Blobs
    BlockBlobURL blobURL = containerURL.createBlockBlobURL("SampleBlob.txt");

    TransferManager.uploadFileToBlockBlob(fileChannel, blobURL, 8*1024*1024, null)
        .subscribe(response-> {
            System.out.println("Completed upload request.");
            System.out.println(response.response().statusCode());
        });

    return blobURL;
}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [ContainerURL.createBlockBlobURL](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._container_u_r_l.createblockbloburl?view=azure-java-preview)
> * [TrasferManager.uploadFileToBlockBlob](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._transfer_manager.uploadfiletoblockblob?view=azure-java-preview)

## List blobs in the container

Get a collection of blob items in the container by calling the [ContainerURL.listBlobsFlatSegment](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._container_u_r_l.listblobsflatsegment?view=azure-java-preview) method.

The [ContainerURL.listBlobsFlatSegment](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._container_u_r_l.listblobsflatsegment?view=azure-java-preview) method  returns a group of items called a *segment*. You can iterate through the items in the segment. This example gets a segment of 10 items and uses a static helper method to obtain other segments of 10 items until there are no more items to retrieve.

```java
static void listBlobs(ContainerURL containerURL) {

    ListBlobsOptions options = new ListBlobsOptions();
        options.withMaxResults(10);

        containerURL.listBlobsFlatSegment(null, options, null).
        flatMap(containerListBlobFlatSegmentResponse ->
            listAllBlobs(containerURL, containerListBlobFlatSegmentResponse))
            .subscribe(response-> {
                System.out.println("Completed list blobs request.");
                System.out.println(response.statusCode());
            });
}

private static Single <ContainerListBlobFlatSegmentResponse> listAllBlobs(
    ContainerURL url, ContainerListBlobFlatSegmentResponse response) {

    // Process the blobs returned in this result segment 
    // (if the segment is empty, blobs() will be null.

    if (response.body().segment() != null) {
        for (BlobItem b : response.body().segment().blobItems()) {
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
        IMPORTANT: ListBlobsFlatSegment returns the start of the next segment; 
        you MUST use this to get the next segment (after processing the 
        current result segment
        */

        String nextMarker = response.body().nextMarker();

         /*
        The presence of the marker indicates that there are more blobs to list, 
        so we make another call to listBlobsFlatSegment and pass the result through 
        this helper function.
        */

        return url.listBlobsFlatSegment(
            nextMarker, new ListBlobsOptions().withMaxResults(10), null)
                .flatMap(containersListBlobFlatSegmentResponse ->
                        listAllBlobs(url, containersListBlobFlatSegmentResponse));
    }
}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [ContainerURL.listBlobsFlatSegment](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._container_u_r_l.listblobsflatsegment?view=azure-java-preview)

## Download blobs from the container

Call the [TransferManager.downloadBlobToFile](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._transfer_manager.downloadblobtofile?view=azure-java-preview) method to download a file to your local computer.

```java
static void downloadBlob(BlockBlobURL blobURL, String destinationFilePath)
    throws IOException {

    AsynchronousFileChannel fileChannel =
        AsynchronousFileChannel.open(Paths.get(destinationFilePath),
            StandardOpenOption.CREATE, StandardOpenOption.WRITE);

    TransferManager.downloadBlobToFile(fileChannel, blobURL, null, null)
    .subscribe(response-> {
        System.out.println("Completed download request.");
        System.out.println("The blob was downloaded to " + destinationFilePath);
    });
}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [TransferManager.downloadBlobToFile](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._transfer_manager.downloadblobtofile?view=azure-java-preview)

## Delete blobs from the container

Delete the blob by calling the [BlobURL.Delete](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._blob_u_r_l.delete?view=azure-java-preview) method.

```java
static void deleteBlob(BlockBlobURL blobURL) {

    blobURL.delete(null, null, null)
    .subscribe(
        response -> System.out.println(">> Blob deleted: " + blobURL),
        error -> System.out.println(">> An error encountered during deleteBlob: " + 
        error.getMessage()));
}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [BlobURL.Delete](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._blob_u_r_l.delete?view=azure-java-preview)

## Delete the container

Delete the container by calling the [ContainerURL.delete](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._container_u_r_l.delete?view=azure-java-preview&viewFallbackFrom=azure-java-stable) method.

```java
static void deleteContainer(ContainerURL containerURL) {

    containerURL.delete(null, null).blockingGet();

}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [ContainerURL.delete](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._container_u_r_l.delete?view=azure-java-preview&viewFallbackFrom=azure-java-stable)

## Next steps

Explore more APIs in the [com.microsoft.azure.storage.blob](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob?view=azure-java-preview) namespace of the [Azure Storage libraries for Java](https://docs.microsoft.com/java/api/overview/azure/storage?view=azure-java-preview) docs.