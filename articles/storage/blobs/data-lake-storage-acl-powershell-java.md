---
title: Use Java with Azure Data Lake Storage Gen2
description: Use the Azure Storage libraries for Java to interact with Azure Blob storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.date: 06/28/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# Use Java with Azure Data Lake Storage Gen2

This guide shows you how to use Java to interact with objects, manage directories, and set directory-level access permissions (access-control lists) in storage accounts that have a hierarchical namespace. 

To use the snippets presented in this article, you'll need to create a storage account, and then enable the hierarchical namespace feature on that account. See [Create a storage account](data-lake-storage-quickstart-create-account.md).

> [!NOTE]
> The content featured in this article uses terms such as *blobs* and *containers* instead of *files* and *file systems*. That's because Azure Data Lake Storage Gen2 is built on blob storage, and in blob storage a *file* is persisted as a *blob*, and a *file system* is persisted as a *container*. 

## Set up your development environment

Perform these tasks:

* Install the [JDK](http://aka.ms/vscode-java-installer-win).

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

## Perform common blob tasks 

You can use the same set of APIs to interact with your data objects regardless of whether the account has a hierarchical namespace. To find snippets that help you perform common tasks such as creating a container (file system), uploading and downloading blobs (files), and deleting blobs and containers, see [Quickstart: Upload, download, and list blobs by using the Java Storage SDK V10](storage-quickstart-blobs-java-v10.md).

The rest of this article presents snippets that help you perform tasks related only to accounts that have a hierarchical namespace. 

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

## Perform common blob tasks 

You can use the same set of APIs to interact with your data objects regardless of whether the account has a hierarchical namespace. To find snippets that help you perform common tasks such as creating a container (file system), uploading and downloading blobs (files), and deleting blobs and containers, see [Quickstart: Upload, download, and list blobs by using the Java Storage SDK V10](storage-quickstart-blobs-java.md).

The rest of this article presents snippets that help you perform tasks related only to accounts that have a hierarchical namespace. 

## Add directory to a file system (container)

Intro text here

```cs
Snippet here
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.

## Rename or move a directory

Intro text here

```cs
Snippet here
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.

## Delete a directory from a file system (container

Intro text here

```cs
Snippet here
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.

## Get the access control list (ACL) for a directory

Intro text here

```cs
Snippet here
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.

## Set the ACL for a directory

Intro text here

```cs
Snippet here
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.

## Next steps

Explore more APIs in the [com.microsoft.azure.storage.blob](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob?view=azure-java-preview) namespace of the [Azure Storage libraries for Java](https://docs.microsoft.com/java/api/overview/azure/storage?view=azure-java-preview) docs.