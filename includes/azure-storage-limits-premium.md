---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: storage
 ms.topic: include
 ms.date: 01/22/2019
 ms.author: rogarana
 ms.custom: include file
---

Premium storage accounts have the following scalability targets:

| Total account capacity | Total bandwidth for a locally redundant storage account |
| --- | --- | 
| Disk capacity: 35 TB <br>Snapshot capacity: 10 TB | Up to 50 gigabits per second for inbound<sup>1</sup> + outbound<sup>2</sup> |

<sup>1</sup> All data (requests) that are sent to a storage account

<sup>2</sup> All data (responses) that are received from a storage account

If you are using premium storage accounts for unmanaged disks and your application exceeds the scalability targets of a single storage account, you might want to migrate to managed disks. If you don't want to migrate to managed disks, build your application to use multiple storage accounts. Then, partition your data across those storage accounts. For example, if you want to attach 51-TB disks across multiple VMs, spread them across two storage accounts. 35 TB is the limit for a single premium storage account. Make sure that a single premium storage account never has more than 35 TB of provisioned disks.