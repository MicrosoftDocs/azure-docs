---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: storage
 ms.topic: include
 ms.date: 12/27/2019
 ms.author: rogarana
 ms.custom: include file
---
Azure Files offers two different tiers of storage, premium and standard, to allow you to tailor your shares to the performance and price requirements of your scenario:

- **Premium file shares**: Premium file shares are backed by solid-state drives (SSDs) and are deployed in the **FileStorage storage account** type. Premium file shares provide consistent high performance and low latency, within single-digit milliseconds for most IO operations, for IO-intensive workloads. This makes them suitable for a wide variety of workloads like databases, web site hosting, and development environments. Premium file shares are only available in a provisioned billing model. For more information on the provisioned billing model for premium file shares, see [Understanding provisioning for premium file shares](../articles/storage/files/storage-files-planning.md#understanding-provisioning-for-premium-file-shares).
- **Standard file shares**: Standard file shares are backed by hard disk drives (HDDs) and are deployed in the **general purpose version 2 (GPv2) storage account** type. Standard file shares provide reliable performance for IO workloads that are less sensitive to performance variability such as general-purpose file shares and dev/test environments. Standard file shares are only available in a pay-as-you-go billing model.