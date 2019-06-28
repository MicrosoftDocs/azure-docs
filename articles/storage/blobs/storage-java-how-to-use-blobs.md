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
> The snippets featured in this article use terms such as *blobs* and *containers* instead of *files* and *file systems*. That's because Azure Data Lake Storage Gen2 is built on blob storage, and in blob storage a *file* is persisted as a *blob*, and a *file system* is persisted as a *container*. This article refers to other articles that contain snippets for common tasks. Because those articles apply to all blob storage accounts regardless of whether hierarchical namespaces have been enabled, they'll use the terms *container* and *blob*. To avoid confusion, this article does the same.

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

## Add directory to a container

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

## Delete a directory from a container

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

## Get the ACL for a directory

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