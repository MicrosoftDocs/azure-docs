---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-storage
 ms.topic: include
 ms.date: 12/26/2019
 ms.author: kendownie
 ms.custom: include file
---
Azure file shares are deployed into *storage accounts*, which are top-level objects that represent a shared pool of storage. This pool of storage can be used to deploy multiple file shares, as well as other storage resources such as blob containers, queues, or tables. All storage resources that are deployed into a storage account share the limits that apply to that storage account. For current storage account limits, see [Azure Files scalability and performance targets](../articles/storage/files/storage-files-scale-targets.md).

There are two main types of storage accounts you will use for Azure Files deployments: 
- **General purpose version 2 (GPv2) storage accounts**: GPv2 storage accounts allow you to deploy Azure file shares on standard/hard disk-based (HDD-based) hardware. In addition to storing Azure file shares, GPv2 storage accounts can store other storage resources such as blob containers, queues, or tables. 
- **FileStorage storage accounts**: FileStorage storage accounts allow you to deploy Azure file shares on premium/solid-state disk-based (SSD-based) hardware. FileStorage accounts can only be used to store Azure file shares; no other storage resources (blob containers, queues, tables, etc.) can be deployed in a FileStorage account. Only FileStorage accounts can deploy both SMB and NFS file shares.

There are several other storage account types you may come across in the Azure portal, PowerShell, or CLI. Two storage account types, BlockBlobStorage and BlobStorage storage accounts, cannot contain Azure file shares. The other two storage account types you may see are general purpose version 1 (GPv1) and classic storage accounts, both of which can contain Azure file shares. Although GPv1 and classic storage accounts may contain Azure file shares, most new features of Azure Files are available only in GPv2 and FileStorage storage accounts. We therefore recommend to only use GPv2 and FileStorage storage accounts for new deployments, and to upgrade GPv1 and classic storage accounts if they already exist in your environment.  