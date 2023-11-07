---
author: ericd-mst-github
ms.service: virtual-machines
ms.topic: include
ms.date: 08/14/2023
ms.author: erd
---
**For VM Applications**

When working with VM applications in Azure, you may encounter an error message that says "Operation could not be completed as it results in exceeding approved UnmanagedStorageAccountCount quota." This error occurs when you have reached the limit for the number of unmanaged storage accounts that you can use.

When you publish a VM application, Azure needs to replicate it across multiple regions. To do this, Azure creates an unmanaged storage account for each region. The number of unmanaged storage accounts that an application uses is determined by the number of replicas across all applications.

As a general rule, each storage account can accommodate up to 200 simultaneous connections. Below are options for resolving the "UnmanagedStorageAccountCount" error:

- Use page blobs for your source application blobs. Unmanaged accounts are only used for block blob replication. Page blobs have no such limits.
- Reduce the number of replicas for your VM Application versions or delete applications you no longer need.
- File a support request to obtain a quota increase.



