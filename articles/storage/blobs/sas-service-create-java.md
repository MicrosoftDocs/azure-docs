---
title: Create a service SAS for a blob with Java
titleSuffix: Azure Storage
description: Learn how to create a service shared access signature (SAS) for a blob using the Azure Blob Storage client library for Java.
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 06/23/2023
ms.author: pauljewell
ms.reviewer: nachakra
ms.devlang: java
ms.custom: devx-track-java, devguide-java, engagement-fy23, devx-track-java, devx-track-extended-java
---

# Create a service SAS for a blob with Java

[!INCLUDE [storage-dev-guide-selector-service-sas](../../../includes/storage-dev-guides/storage-dev-guide-selector-service-sas.md)]

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use the storage account key to create a service SAS for a blob with the Blob Storage client library for Java.

## About the service SAS

A service SAS is signed with the account access key. You can use the [StorageSharedKeyCredential](/java/api/com.azure.storage.common.storagesharedkeycredential) class to create the credential that is used to sign the service SAS.

You can also use a stored access policy to define the permissions and duration of the SAS. If the name of an existing stored access policy is provided, that policy is associated with the SAS. To learn more about stored access policies, see [Define a stored access policy](/rest/api/storageservices/define-stored-access-policy). If no stored access policy is provided, the code examples in this article show how to define permissions and duration for the SAS.

## Create a service SAS for a blob

You can create a service SAS to delegate limited access to a blob resource using the following method:

- [generateSas](/java/api/com.azure.storage.blob.specialized.blobclientbase#method-details)

SAS signature values, such as expiry time and signed permissions, are passed to the method as part of a [BlobServiceSasSignatureValues](/java/api/com.azure.storage.blob.sas.blobservicesassignaturevalues) instance. Permissions are specified as a [BlobSasPermission](/java/api/com.azure.storage.blob.sas.blobsaspermission) instance.

The following code example shows how to create a service SAS with read permissions for a blob resource:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobSAS.java" id="Snippet_CreateServiceSASBlob":::

## Use a service SAS to authorize a client object

The following code example shows how to use the service SAS created in the earlier example to authorize a [BlobClient](/java/api/com.azure.storage.blob.blobclient) object. This client object can be used to perform operations on the blob resource based on the permissions granted by the SAS.

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

Then, generate the service SAS as shown in the earlier example and use the SAS to authorize a [BlobClient](/java/api/com.azure.storage.blob.blobclient) object:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobSAS.java" id="Snippet_UseServiceSASBlob":::

## Resources

To learn more about using the Azure Blob Storage client library for Java, see the following resources.

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]

### See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md)
- [Create a service SAS](/rest/api/storageservices/create-service-sas)
