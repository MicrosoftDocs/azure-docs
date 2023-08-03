---
title: Manage properties and metadata for a blob with JavaScript
titleSuffix: Azure Storage
description: Learn how to set and retrieve system properties and store custom metadata on blobs in your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 11/30/2022
ms.service: azure-storage
ms.topic: how-to
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js
---

# Manage blob properties and metadata with JavaScript

In addition to the data they contain, blobs support system properties and user-defined metadata. This article shows how to manage system properties and user-defined metadata with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with blob properties or metadata. To learn more, see the authorization guidance for the following REST API operations:
    - [Set Blob Properties](/rest/api/storageservices/set-blob-properties#authorization)
    - [Get Blob Properties](/rest/api/storageservices/get-blob-properties#authorization)
    - [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata#authorization)
    - [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata#authorization)

## About properties and metadata

- **System properties**: System properties exist on each Blob storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers. The Azure Storage client library for JavaScript maintains these properties for you.

- **User-defined metadata**: User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and don't affect how the resource behaves.

    Metadata name/value pairs are valid HTTP headers and should adhere to all restrictions governing HTTP headers. For more information about metadata naming requirements, see [Metadata names](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#metadata-names).

> [!NOTE]
> Blob index tags also provide the ability to store arbitrary user-defined key/value attributes alongside an Azure Blob storage resource. While similar to metadata, only blob index tags are automatically indexed and made searchable by the native blob service. Metadata cannot be indexed and queried unless you utilize a separate service such as Azure Search.
>
> To learn more about this feature, see [Manage and find data on Azure Blob storage with blob index (preview)](storage-manage-find-blobs.md).

## Set blob http headers

The following code example sets blob HTTP  system properties on a blob.

To set the HTTP properties for a blob, create a [BlobClient](storage-blob-javascript-get-started.md#create-a-blobclient-object) then call [BlobClient.setHTTPHeaders](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-sethttpheaders). Review the [BlobHTTPHeaders properties](/javascript/api/@azure/storage-blob/blobhttpheaders) to know which HTTP properties you want to set. Any HTTP properties not explicitly set are cleared. 

```javascript
/*
properties= {
      blobContentType: 'text/plain',
      blobContentLanguage: 'en-us',
      blobContentEncoding: 'utf-8',
      // all other http properties are cleared
    }
*/
async function setHTTPHeaders(blobClient, headers) {

  await blobClient.setHTTPHeaders(headers);

  console.log(`headers set successfully`);
}
```

## Set metadata

You can specify metadata as one or more name-value pairs on a blob or container resource. To set metadata, create a [BlobClient](storage-blob-javascript-get-started.md#create-a-blobclient-object) then send a JSON object of name-value pairs with

- [BlobClient.setMetadata](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-setmetadata) returns a [BlobGetPropertiesResponse object](/javascript/api/@azure/storage-blob/blobgetpropertiesresponse).

The following code example sets metadata on a blob. 

```javascript
/*
metadata= {
    reviewedBy: 'Bob',
    releasedBy: 'Jill',
}
*/
async function setBlobMetadata(blobClient, metadata) {

  await blobClient.setMetadata(metadata);

  console.log(`metadata set successfully`);

}
```

To read the metadata, get the blob's properties (shown below), specifically referencing the `metadata` property. 

## Get blob properties

The following code example gets a blob's system properties, including HTTP headers and metadata, and displays those values. 

```javascript
async function getProperties(blobClient) {

  const properties = await blobClient.getProperties();
  console.log(blobClient.name + ' properties: ');

  for (const property in properties) {

    switch (property) {
      // nested properties are stringified and returned as strings
      case 'metadata':
      case 'objectReplicationRules':
        console.log(`    ${property}: ${JSON.stringify(properties[property])}`);
        break;
      default:
        console.log(`    ${property}: ${properties[property]}`);
        break;
    }
  }
}
```

The output for these console.log lines looks like:

```console
my-blob.txt properties:
    lastModified: Thu Apr 21 2022 13:02:53 GMT-0700 (Pacific Daylight Time)
    createdOn: Thu Apr 21 2022 13:02:53 GMT-0700 (Pacific Daylight Time)
    metadata: {"releasedby":"Jill","reviewedby":"Bob"}
    objectReplicationPolicyId: undefined
    objectReplicationRules: {}
    blobType: BlockBlob
    copyCompletedOn: undefined
    copyStatusDescription: undefined
    copyId: undefined
    copyProgress: undefined
    copySource: undefined
    copyStatus: undefined
    isIncrementalCopy: undefined
    destinationSnapshot: undefined
    leaseDuration: undefined
    leaseState: available
    leaseStatus: unlocked
    contentLength: 19
    contentType: text/plain
    etag: "0x8DA23D1EBA8E607"
    contentMD5: undefined
    contentEncoding: utf-8
    contentDisposition: undefined
    contentLanguage: en-us
    cacheControl: undefined
    blobSequenceNumber: undefined
    clientRequestId: 58da0441-7224-4837-9b4a-547f9a0c7143
    requestId: 26acb38a-001e-0046-27ba-55ef22000000
    version: 2021-04-10
    date: Thu Apr 21 2022 13:02:52 GMT-0700 (Pacific Daylight Time)
    acceptRanges: bytes
    blobCommittedBlockCount: undefined
    isServerEncrypted: true
    encryptionKeySha256: undefined
    encryptionScope: undefined
    accessTier: Hot
    accessTierInferred: true
    archiveStatus: undefined
    accessTierChangedOn: undefined
    versionId: undefined
    isCurrentVersion: undefined
    tagCount: undefined
    expiresOn: undefined
    isSealed: undefined
    rehydratePriority: undefined
    lastAccessed: undefined
    immutabilityPolicyExpiresOn: undefined
    immutabilityPolicyMode: undefined
    legalHold: undefined
    errorCode: undefined
    body: true
    _response: [object Object]
    objectReplicationDestinationPolicyId: undefined
    objectReplicationSourceProperties:
```

## Resources

To learn more about how to manage system properties and user-defined metadata using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for managing system properties and user-defined metadata use the following REST API operations:

- [Set Blob Properties](/rest/api/storageservices/set-blob-properties) (REST API)
- [Get Blob Properties](/rest/api/storageservices/get-blob-properties) (REST API)
- [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata) (REST API)
- [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/blob-set-properties-and-metadata.js)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]
