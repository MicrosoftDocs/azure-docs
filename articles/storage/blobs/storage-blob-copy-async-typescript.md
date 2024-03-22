---
title: Copy a blob with asynchronous scheduling using TypeScript
titleSuffix: Azure Storage
description: Learn how to copy a blob with asynchronous scheduling in Azure Storage by using the client library for JavaScript and TypeScript.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 05/08/2023
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: typescript
ms.custom: devx-track-ts, devguide-ts, devx-track-js
---

# Copy a blob with asynchronous scheduling using TypeScript

[!INCLUDE [storage-dev-guide-selector-copy-async](../../../includes/storage-dev-guides/storage-dev-guide-selector-copy-async.md)]

This article shows how to copy a blob with asynchronous scheduling using the [Azure Storage client library for JavaScript](/javascript/api/overview/azure/storage-blob-readme). You can copy a blob from a source within the same storage account, from a source in a different storage account, or from any accessible object retrieved via HTTP GET request on a given URL. You can also abort a pending copy operation.

The client library methods covered in this article use the [Copy Blob](/rest/api/storageservices/copy-blob) REST API operation, and can be used when you want to perform a copy with asynchronous scheduling. For most copy scenarios where you want to move data into a storage account and have a URL for the source object, see [Copy a blob from a source object URL with TypeScript](storage-blob-copy-url-typescript.md).

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and TypeScript](storage-blob-typescript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to perform a copy operation, or to abort a pending copy. To learn more, see the authorization guidance for the following REST API operation:
    - [Copy Blob](/rest/api/storageservices/copy-blob#authorization)
    - [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob#authorization)

[!INCLUDE [storage-dev-guide-blob-copy-async](../../../includes/storage-dev-guides/storage-dev-guide-about-blob-copy-async.md)]

## Copy a blob with asynchronous scheduling

This section gives an overview of methods provided by the Azure Storage client library for JavaScript and TypeScript to perform a copy operation with asynchronous scheduling.

The following methods wrap the [Copy Blob](/rest/api/storageservices/copy-blob) REST API operation, and begin an asynchronous copy of data from the source blob:

- [BlobClient.beginCopyFromURL](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-begincopyfromurl)

The `beginCopyFromURL` method returns a long running operation poller that allows you to wait indefinitely until the copy is completed.

## Copy a blob from a source within Azure

If you're copying a blob within the same storage account, the operation can complete synchronously. Access to the source blob can be authorized via Microsoft Entra ID, a shared access signature (SAS), or an account key. For an alterative synchronous copy operation, see [Copy a blob from a source object URL with TypeScript](storage-blob-copy-url-typescript.md).

If the copy source is a blob in a different storage account, the operation can complete asynchronously. The source blob must either be public or authorized via SAS token. The SAS token needs to include the **Read ('r')** permission. To learn more about SAS tokens, see [Delegate access with shared access signatures](../common/storage-sas-overview.md).

The following example shows a scenario for copying a source blob from a different storage account with asynchronous scheduling. In this example, we create a source blob URL with an appended user delegation SAS token. The example shows how to generate the SAS token using the client library, but you can also provide your own. The example also shows how to lease the source blob during the copy operation to prevent changes to the blob from a different client. The `Copy Blob` operation saves the `ETag` value of the source blob when the copy operation starts. If the `ETag` value is changed before the copy operation finishes, the operation fails.

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/copy-blob.ts" id="Snippet_copy_from_azure_async":::

> [!NOTE]
> User delegation SAS tokens offer greater security, as they're signed with Microsoft Entra credentials instead of an account key. To create a user delegation SAS token, the Microsoft Entra security principal needs appropriate permissions. For authorization requirements, see [Get User Delegation Key](/rest/api/storageservices/get-user-delegation-key#authorization).

## Copy a blob from a source outside of Azure

You can perform a copy operation on any source object that can be retrieved via HTTP GET request on a given URL, including accessible objects outside of Azure. The following example shows a scenario for copying a blob from an accessible source object URL.

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/copy-blob.ts" id="Snippet_copy_blob_external_source_async":::

## Check the status of a copy operation

To check the status of an asynchronous `Copy Blob` operation, you can poll the [getProperties](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-getproperties) method and check the copy status.

The following code example shows how to check the status of a pending copy operation:

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/copy-blob.ts" id="Snippet_check_copy_status_async":::

## Abort a copy operation

Aborting a pending `Copy Blob` operation results in a destination blob of zero length. However, the metadata for the destination blob has the new values copied from the source blob or set explicitly during the copy operation. To keep the original metadata from before the copy, make a snapshot of the destination blob before calling one of the copy methods.

To abort a pending copy operation, call the following operation:

- [BlobClient.abortCopyFromURL](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-abortcopyfromurl)

This method wraps the [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob) REST API operation, which cancels a pending `Copy Blob` operation. The following code example shows how to abort a pending `Copy Blob` operation:

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/copy-blob.ts" id="Snippet_abort_copy_async":::

## Resources

To learn more about copying blobs with asynchronous scheduling using the Azure Blob Storage client library for JavaScript and TypeScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript and TypeScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar language paradigms. The client library methods covered in this article use the following REST API operations:

- [Copy Blob](/rest/api/storageservices/copy-blob) (REST API)
- [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/copy-blob.ts)

[!INCLUDE [storage-dev-guide-resources-typescript](../../../includes/storage-dev-guides/storage-dev-guide-resources-typescript.md)]
