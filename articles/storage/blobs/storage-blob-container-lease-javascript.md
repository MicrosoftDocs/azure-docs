---
title: Create and manage blob or container leases with JavaScript - Azure Storage 
description: Learn how to manage a lock on a blob or container in your Azure Storage account using the JavaScript client library.
services: storage
author: normesta

ms.service: storage
ms.topic: how-to
ms.date: 03/28/2022
ms.author: normesta
ms.subservice: blobs
ms.devlang: javascript
ms.custom: devx-track-js
---

# Create and manage blob or container leases with JavaScript

A lease establishes and manages a lock on a container or the blobs in a container. You can use the JavaScript client library to acquire, renew, release and break leases. To learn more about leasing blobs or containers, see [Lease Container](/rest/api/storageservices/lease-container) or [Lease Blobs](/rest/api/storageservices/lease-blob).

## Acquire a lease

When you acquire a lease, you'll obtain a lease ID that your code can use to operate on the blob or container. To acquire a lease, create an instance of the [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) class, and then use either of the methods:

- [acquireLease](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-acquirelease)

The following example acquires a 30 second lease for a container.

```javascript
```

## Renew a lease

If your lease expires, you can renew it. To renew a lease, use either of the following methods of the [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) class:

- [renew](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-renewlease)

Specify the lease ID by setting the [ifMatch](/javascript/api/@azure/storage-blob/modifiedaccessconditions#@azure-storage-blob-modifiedaccessconditions-ifmatch) property of a [conditions](/javascript/api/@azure/storage-blob/leaseoperationoptions#@azure-storage-blob-leaseoperationoptions-conditions) property.

The following example renews a lease for a blob.

```javascript

```

## Release a lease

You can either wait for a lease to expire or explicitly release it. When you release a lease, other clients can obtain a lease. You can release a lease by using either of this method of the [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) class.

- [releaseLease](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-releaselease)


The following example releases the lease on a container.

```javascript
```

## Break a lease

When you break a lease, the lease ends, but other clients can't acquire a lease until the lease period expires. You can break a lease by using this method:

- [breakLease](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-breaklease)

The following example breaks the lease on a blob.

```javascript

```

## See also

- [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md)
- [Managing Concurrency in Blob storage](concurrency-manage.md)
