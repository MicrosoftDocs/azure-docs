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

A copy operation can perform any of the following actions:

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

The destination account of a `Copy Blob` or `Copy Blob From URL` operation is charged for one transaction to start the copy. The destination account also incurs one transaction for each request to the copy operation.

When the source blob is in another account, the source account incurs transaction costs. In addition, if the source and destination accounts reside in different regions, bandwidth that you use to transfer the request is charged to the source storage account as egress. Egress between accounts within the same region is free.

When you copy a source blob to a destination blob that has a *different* name within the same account, you use extra storage resources for the new blob. The copy operation then results in a charge against the storage account's capacity usage for those additional resources. However, if the source and destination blobs have the *same* name and reside in the same account (for example, when you promote a snapshot to its base blob), no additional charge is incurred other than extra copy metadata stored in version 2012-02-12 and later. 