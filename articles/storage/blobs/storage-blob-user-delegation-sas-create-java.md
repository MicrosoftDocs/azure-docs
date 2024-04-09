---
title: Create a user delegation SAS for a blob with Java
titleSuffix: Azure Storage
description: Learn how to create a user delegation SAS for a blob with Microsoft Entra credentials by using the Azure Storage client library for Java.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 06/12/2023
ms.reviewer: dineshm
ms.devlang: java
ms.custom: devx-track-java, devguide-java, devx-track-extended-java
---

# Create a user delegation SAS for a blob with Java

[!INCLUDE [storage-dev-guide-selector-user-delegation-sas](../../../includes/storage-dev-guides/storage-dev-guide-selector-user-delegation-sas.md)]

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use Microsoft Entra credentials to create a user delegation SAS for a blob using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme).

[!INCLUDE [storage-auth-user-delegation-include](../../../includes/storage-auth-user-delegation-include.md)]

## Assign Azure roles for access to data

When a Microsoft Entra security principal attempts to access blob data, that security principal must have permissions to the resource. Whether the security principal is a managed identity in Azure or a Microsoft Entra user account running code in the development environment, the security principal must be assigned an Azure role that grants access to blob data. For information about assigning permissions via Azure RBAC, see [Assign an Azure role for access to blob data](assign-azure-role-data-access.md).

[!INCLUDE [storage-dev-guide-user-delegation-sas-java](../../../includes/storage-dev-guides/storage-dev-guide-user-delegation-sas-java.md)]

## Create a user delegation SAS for a blob

Once you've obtained the user delegation key, you can create a user delegation SAS. You can create a user delegation SAS to delegate limited access to a blob resource using the following method from a [BlobClient](/java/api/com.azure.storage.blob.blobclient) instance:

- [generateUserDelegationSas](/java/api/com.azure.storage.blob.specialized.blobclientbase#method-details)

The user delegation key to sign the SAS is passed to this method along with specified values for [BlobServiceSasSignatureValues](/java/api/com.azure.storage.blob.sas.blobservicesassignaturevalues). Permissions are specified as a [BlobSasPermission](/java/api/com.azure.storage.blob.sas.blobsaspermission) instance.

The following code example shows how to create a user delegation SAS for a blob:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobSAS.java" id="Snippet_CreateUserDelegationSASBlob":::

## Use a user delegation SAS to authorize a client object

The following code example shows how to use the user delegation SAS created in the earlier example to authorize a [BlobClient](/java/api/com.azure.storage.blob.blobclient) object. This client object can be used to perform operations on the blob resource based on the permissions granted by the SAS.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobSAS.java" id="Snippet_UseUserDelegationSASBlob":::

## Resources

To learn more about creating a user delegation SAS using the Azure Blob Storage client library for Java, see the following resources.

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library method for getting a user delegation key uses the following REST API operation:

- [Get User Delegation Key](/rest/api/storageservices/get-user-delegation-key) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobSAS.java)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]

### See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md)
- [Create a user delegation SAS](/rest/api/storageservices/create-user-delegation-sas)
