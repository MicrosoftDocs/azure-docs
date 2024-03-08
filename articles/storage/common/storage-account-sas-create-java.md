---
title: Create an account SAS with Java
titleSuffix: Azure Storage
description: Learn how to create an account shared access signature (SAS) using the Java client library.
services: storage
author: pauljewellmsft

ms.service: azure-storage
ms.topic: how-to
ms.date: 09/21/2023
ms.author: pauljewell
ms.reviewer: dineshm
ms.subservice: storage-common-concepts
ms.devlang: java
ms.custom: devx-track-java, devguide-java, devx-track-extended-java
---

# Create an account SAS with Java

[!INCLUDE [storage-dev-guide-selector-account-sas](../../../includes/storage-dev-guides/storage-dev-guide-selector-account-sas.md)]

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use the storage account key to create an account SAS with the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme).

## About the account SAS

An account SAS is created at the level of the storage account, and is signed with the account access key. By creating an account SAS, you can:

- Delegate access to service-level operations that aren't currently available with a service-specific SAS, such as [Get Blob Service Properties](/rest/api/storageservices/get-blob-service-properties), [Set Blob Service Properties](/rest/api/storageservices/set-blob-service-properties) and [Get Blob Service Stats](/rest/api/storageservices/get-blob-service-stats).
- Delegate access to more than one service in a storage account at a time. For example, you can delegate access to resources in both Azure Blob Storage and Azure Files by using an account SAS.

Stored access policies aren't supported for an account SAS.

## Set up your project

To work with the code examples in this article, add the following import directives:

```java
import com.azure.storage.blob.*;
import com.azure.storage.blob.models.*;
import com.azure.storage.blob.sas.*;
import com.azure.storage.common.sas.AccountSasPermission;
import com.azure.storage.common.sas.AccountSasResourceType;
import com.azure.storage.common.sas.AccountSasService;
import com.azure.storage.common.sas.AccountSasSignatureValues;
```

## Create an account SAS

You can create an account SAS to delegate limited access to storage account resources using the following method:

- [generateAccountSas](/java/api/com.azure.storage.blob.blobserviceclient#method-summary)

To configure the signature values for the account SAS, use the following helper classes:

- [AccountSasPermission](/java/api/com.azure.storage.common.sas.accountsaspermission): Represents the permissions allowed by the SAS. In our example, we set the read permission to `true`.
- [AccountSasService](/java/api/com.azure.storage.common.sas.accountsasservice): Represents the services accessible by the SAS. In our example, we allow access to the Blob service.
- [AccountSasResourceType](/java/api/com.azure.storage.common.sas.accountsasresourcetype): Represents the resource types accessible by the SAS. In our example, we allow access to service-level APIs.

Once the helper classes are configured, you can initialize parameters for the SAS with an [AccountSasSignatureValues](/java/api/com.azure.storage.common.sas.accountsassignaturevalues) instance.

The following code example shows how to configure SAS parameters and call the [generateAccountSas](/java/api/com.azure.storage.blob.blobserviceclient#method-summary) method to get the account SAS: 

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobSAS.java" id="Snippet_CreateAccountSAS":::

## Use an account SAS from a client

The following code example shows how to use the account SAS created in the earlier example to authorize a [BlobServiceClient](/java/api/com.azure.storage.blob.blobclient) object. This client object can then be used to access service-level APIs based on the permissions granted by the SAS.

First, create a [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) object signed with the account access key:

```java
String accountName = "<account-name>";
String accountKey = "<account-key>";
StorageSharedKeyCredential credential = new StorageSharedKeyCredential(accountName, accountKey);
        
BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
        .endpoint(String.format("https://%s.blob.core.windows.net/", accountName))
        .credential(credential)
        .buildClient();
```

Then, generate the account SAS as shown in the earlier example and use the SAS to authorize a [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) object:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobSAS.java" id="Snippet_UseAccountSAS":::

You can also use an account SAS to authorize and work with a [BlobContainerClient](/java/api/com.azure.storage.blob.blobcontainerclient) object or [BlobClient](/java/api/com.azure.storage.blob.blobclient) object, if those resource types are granted access as part of the signature values.

## Resources

To learn more about creating an account SAS using the Azure Blob Storage client library for Java, see the following resources.

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobSAS.java)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]

### See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
- [Create an account SAS](/rest/api/storageservices/create-account-sas)
