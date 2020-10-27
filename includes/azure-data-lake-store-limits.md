---
 title: include file
 description: include file
 services: storage
 author: twooley
 ms.service: storage
 ms.topic: include
 ms.date: 09/30/2020
 ms.author: twooley
 ms.custom: include file
---

**Azure Data Lake Storage Gen2** is not a dedicated service or storage account type. It is the latest release of capabilities that are dedicated to big data analytics.  These capabilities are available in a general-purpose v2 or BlockBlobStorage storage account, and you can obtain them by enabling the **Hierarchical namespace** feature of the account. For scale targets, see these articles. 

- [Scale targets for Blob storage](https://docs.microsoft.com/azure/storage/blobs/scalability-targets#scale-targets-for-blob-storage).
- [Scale targets for standard storage accounts](https://docs.microsoft.com/azure/storage/common/scalability-targets-standard-account?toc=/azure/storage/blobs/toc.json#scale-targets-for-standard-storage-accounts).

**Azure Data Lake Storage Gen1** is a dedicated service. It's an enterprise-wide hyper-scale repository for big data analytic workloads. You can use Data Lake Storage Gen1 to capture data of any size, type, and ingestion speed in one single place for operational and exploratory analytics. There's no limit to the amount of data you can store in a Data Lake Storage Gen1 account.

| **Resource** | **Limit** | **Comments** |
| --- | --- | --- |
| Maximum number of Data Lake Storage Gen1 accounts, per subscription, per region |10 | To request an increase for this limit, contact support. |
| Maximum number of access ACLs, per file or folder |32 | This is a hard limit. Use groups to manage access with fewer entries. |
| Maximum number of default ACLs, per file or folder |32 | This is a hard limit. Use groups to manage access with fewer entries. |
