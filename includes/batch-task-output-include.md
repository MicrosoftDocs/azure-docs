---
 title: include file
 description: include file
 services: batch
 author: prkannap
 ms.service: batch
 ms.topic: include
 ms.date: 04/20/2022
 ms.author: prkannap
 ms.custom: include file
---

A task running in Azure Batch may produce output data when it runs. Task output data often needs to be stored for retrieval by other tasks in the job, the client application that executed the job, or both. Tasks write output data to the file system of a Batch compute node, but all data on the node is lost when it is reimaged or when the node leaves the pool. Tasks may also have a file retention period, after which files created by the task are deleted. For these reasons, it's important to persist task output that you'll need later to a data store such as [Azure Storage](../articles/storage/index.yml).

For storage account options in Batch, see [Batch accounts and Azure Storage accounts](../articles/batch/accounts.md#azure-storage-accounts).