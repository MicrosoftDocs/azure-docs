---
title: How to use Blob storage from Java
description: Use the Azure Storage Client Library for Java to interact with Blob storage
services: storage
author: normesta
ms.service: storage
ms.date: 04/14/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# How to use Blob storage from Java

This guide shows you how to interact with blobs by using Java. It contains snippets that help you get started with common tasks such as uploading and downloading blobs. It also contains snippets that showcase common tasks with a hierarchical file system.

## Install what you need

Put guidance here.

## Add library references to your code file

Add these import statements to your code file.

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Writer;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.channels.AsynchronousFileChannel;
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

## Create a storage account

To create a storage account, see [Create a storage account](../common/storage-quickstart-create-account.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

Enable a hierarchical namespace if you want to use the code snippets in this article that perform operations on a hierarchical file system.

![Enabling a hierarchical namespace](media/storage-java-how-to-use-blobs/enable-hierarchical-namespace.png)

[!INCLUDE [storage-copy-account-key-portal](../../../includes/storage-copy-account-key-portal.md)]

## Create a container and setup objects

Some guidance goes here.

```java

// Create a ServiceURL to call the Blob service.
// We will also use this to construct the ContainerURL
SharedKeyCredentials creds = new SharedKeyCredentials(accountName, accountKey);

// We are using a default pipeline here, you can learn more about it at
// https://github.com/Azure/azure-storage-java/wiki/Azure-Storage-Java-V10-Overview
final ServiceURL serviceURL = new ServiceURL(
new URL("http://"+ accountName + ".blob.core.windows.net"), StorageURL.createPipeline(
creds, new PipelineOptions()));

// Let's create a container using a blocking call to Azure Storage
// If container exists, we'll catch and continue
ContainerURL containerURL = serviceURL.createContainerURL("quickstart");

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

// Create a BlockBlobURL to run operations on Blobs
final BlockBlobURL blobURL = containerURL.createBlockBlobURL("SampleBlob.txt");
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## Upload blobs to the container

Some guidance goes here.

```java
static void uploadFile(BlockBlobURL blob, File sourceFile) throws IOException {

    AsynchronousFileChannel fileChannel = AsynchronousFileChannel.open(
sourceFile.toPath());

    // Uploading a file to the blobURL using the high-level methods
    // available in TransferManager class. Alternatively call the
    // PutBlob/PutBlock low-level methods from BlockBlobURL type
    TransferManager.uploadFileToBlockBlob(fileChannel, blob, 8*1024*1024, null)
       .subscribe(response-> {
       System.out.println("Completed upload request.");
       System.out.println(response.response().statusCode());
    });
}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## List blobs in the container

Some guidance goes here.

```java
static void listBlobs(ContainerURL containerURL) {

    // Each ContainerURL.listBlobsFlatSegment call return up to maxResults
    // (maxResults=10 passed into ListBlobOptions below).
    // To list all Blobs, we are creating a helper static method called listAllBlobs,
    // and calling it after the initial listBlobsFlatSegment call
    ListBlobsOptions options = new ListBlobsOptions();
    options.withMaxResults(10);

    containerURL.listBlobsFlatSegment(null, options, null).flatMap(
        containerListBlobFlatSegmentResponse ->
        listAllBlobs(containerURL, containerListBlobFlatSegmentResponse))
            .subscribe(response-> {
                System.out.println("Completed list blobs request.");
                System.out.println(response.statusCode());
    });
}

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

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
        so we make another call to listBlobsFlatSegment and pass the result
        through this helper function.
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
> * [Type]()
> * [Method]()

## Download blobs from the container

Some guidance goes here.

```java
static void getBlob(BlockBlobURL blobURL, File sourceFile) throws IOException {

     AsynchronousFileChannel fileChannel = AsynchronousFileChannel.open(sourceFile.toPath(), 
         StandardOpenOption.CREATE, StandardOpenOption.WRITE);

     TransferManager.downloadBlobToFile(fileChannel, blobURL, null, null)
        .subscribe(response-> {
            System.out.println("Completed download request.");
            System.out.println("The blob was downloaded to " + sourceFile.getAbsolutePath());
     });
}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## Delete blobs from the container

Some guidance goes here.

```java
static void deleteBlob(BlockBlobURL blobURL) {
    // Delete the blob
    blobURL.delete(null, null, null)
        .subscribe(
            response -> System.out.println(">> Blob deleted: " + blobURL),
            error -> System.out.println(
                ">> An error encountered during deleteBlob: " + error.getMessage()));
}
```

## Add directories to the container

This is only for accounts that have a hierarchical namespace.

```java

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## Add files to directories in the container

This is only for accounts that have a hierarchical namespace.

```java

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## Set Access Control Lists (ACL) permission on a directory

This is only for accounts that have a hierarchical namespace.

```java

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## Set Access Control Lists (ACL) permission on a file in a directory

This is only for accounts that have a hierarchical namespace.

```java

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## Something here for append data and flush methods (scenario TBD)

This is only for accounts that have a hierarchical namespace.

```java

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]()
> * [Method]()

## Next steps

Now that you've learned the basics of blob storage, follow these links to learn more about Azure Storage.  

Put next steps here.