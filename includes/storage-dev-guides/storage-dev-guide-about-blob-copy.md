---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: storage
ms.topic: include
ms.date: 03/24/2023
ms.author: pauljewell
ms.custom: include file
---

## About copying blobs

Copy operations can be used to move data within a storage account, between storage accounts, or into a storage account from a source outside of Azure. When using the Blob Storage client libraries to copy data resources, it's important to understand the REST API operations behind the client library methods. The following REST API operations can be used to copy data resources to a storage account:

- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url): This operation is preferred for scenarios where you want to move data into a storage account and have a URL for the source object. For large objects, you can use a combination of [Put Block From URL](/rest/api/storageservices/put-block-from-url) and [Put Block List](/rest/api/storageservices/put-block-list). These copy operations complete synchronously.
- [Copy Blob](/rest/api/storageservices/copy-blob): This operation is used when asynchronous scheduling is needed for a copy operation.

You can also copy resources using the AzCopy command-line utility. To learn more, see [Get started with AzCopy](../../articles/storage/common/storage-use-azcopy-v10.md)

## [Put Blob From URL API](#tab/put-blob-from-url)

The `Put Blob From URL` operation creates a new block blob where the contents of the blob are read from a given URL. The operation completes synchronously.

#### Source

The source can be any object retrievable via a standard HTTP GET request on the given URL. This includes block blobs, append blobs, page blobs, blob snapshots, blob versions, or any accessible object inside or outside Azure.

When the source object is a block blob, all committed blob content is copied. However, the block list isn't preserved, and uncommitted blocks aren't copied. The content of the destination blob is identical to the content of the source, but the committed block list isn't preserved.

The following table shows the maximum blob size for a single write operation via `Put Blob From URL`:

| Version | Maximum blob size for a single write operation via `Put Blob From URL` |
| --- | --- |
|Version 2020-04-08 and later | 5,000 MiB |
|Versions earlier than 2020-04-08 | 256 MiB |

#### Destination

The destination is always a block blob, either an existing block blob, or a new block blob created by the operation.

The source blob may be one of the following types: block blob, append blob, page blob, blob snapshot, or blob version. The operation `Put Blob From URL` operation always copies the entire source blob. Copying a range of bytes or set of blocks isn't supported.

If the destination blob already exists, it must be of the same blob type as the source blob, and the existing destination blob is overwritten. The destination blob can't be modified while a copy operation is in progress, and a destination blob can only have one outstanding copy operation.

#### Copying blob properties, tags, and metadata

When a blob is copied, its system properties are copied to the destination blob with the same values. Tags are only copied from the source blob if they're specified as part of the upload options. When the source blob and destination blob are the same, any existing metadata is overwritten with the new metadata.

#### Billing considerations

The destination account of a `Put Blob From URL` operation is charged for one transaction to initiate the write, and the source account incurs one transaction for each read request to the source.

In addition, if the source and destination accounts reside in different regions, bandwidth that's used to transfer the request is charged to the source storage account as egress. Egress between accounts within the same region is free.

Creating a new blob with a different name within the same storage account uses additional storage resources. This scenario results in a charge against the storage account's capacity usage for those additional resources.


## [Copy Blob API](#tab/copy-blob)

The `Copy Blob` operation can finish asynchronously, and is performed on a best-effort basis. The operation can complete synchronously if the copy occurs within the same storage account. A `Copy Blob` operation can perform any of the following actions:

- Copy a source blob to a destination blob with a different name. The destination blob can be an existing blob of the same blob type (block, append, or page), or it can be a new blob created by the copy operation.
- Copy a source blob to a destination blob with the same name, which replaces the destination blob. This type of copy operation removes any uncommitted blocks and overwrites the destination blob's metadata.
- Copy a source file in the Azure File service to a destination blob. The destination blob can be an existing block blob, or can be a new block blob created by the copy operation. Copying from files to page blobs or append blobs isn't supported.
- Copy a snapshot over its base blob. By promoting a snapshot to the position of the base blob, you can restore an earlier version of a blob.
- Copy a snapshot to a destination blob with a different name. The resulting destination blob is a writeable blob and not a snapshot.

The source blob for a copy operation may be one of the following types: block blob, append blob, page blob, blob snapshot, or blob version. The copy operation always copies the entire source blob or file. Copying a range of bytes or set of blocks isn't supported.

If the destination blob already exists, it must be of the same blob type as the source blob, and the existing destination blob is overwritten. The destination blob can't be modified while a copy operation is in progress, and a destination blob can only have one outstanding copy operation.

#### Copying blob properties, tags, and metadata

When a blob is copied, its system properties are copied to the destination blob with the same values. Tags are only copied from the source blob if they're specified as part of the copy options. When the source blob and destination blob are the same, any existing metadata is overwritten with the new metadata.

#### Copying a leased blob

A copy operation only reads from the source blob, so the source blob lease state doesn't affect the operation. However, the `Copy Blob` operation saves the `ETag` value of the source blob when the copy operation starts. If the `ETag` value is changed before the copy operation finishes, the operation fails. You can prevent changes to the source blob by leasing it for the duration of the copy operation.

#### Billing considerations

The destination account of a `Copy Blob` operation is charged for one transaction to start the copy. The destination account also incurs one transaction for each request to the copy operation.

When the source blob is in another account, the source account incurs transaction costs. In addition, if the source and destination accounts reside in different regions, bandwidth that you use to transfer the request is charged to the source storage account as egress. Egress between accounts within the same region is free.

When you copy a source blob to a destination blob that has a *different* name within the same account, you use extra storage resources for the new blob. The copy operation then results in a charge against the storage account's capacity usage for those additional resources. However, if the source and destination blobs have the *same* name and reside in the same account (for example, when you promote a snapshot to its base blob), no additional charge is incurred other than extra copy metadata stored in version 2012-02-12 and later.

---