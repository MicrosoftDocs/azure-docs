---
title: Comparison of Azure Data Lake Storage Gen1 with Blob storage
description: Learn about the differences between Azure Data Lake Storage Gen1 and Azure Blob Storage regarding some key aspects of big data processing.

author: normesta
ms.service: data-lake-store
ms.topic: conceptual
ms.date: 03/26/2018
ms.author: normesta

---
# Comparing Azure Data Lake Storage Gen1 and Azure Blob Storage

[!INCLUDE [data-lake-storage-gen1-rename-note.md](../../includes/data-lake-storage-gen1-rename-note.md)] 

The table in this article summarizes the differences between Azure Data Lake Storage Gen1 and Azure Blob Storage along some key aspects of big data processing. Azure Blob Storage is a general purpose, scalable object store that is designed for a wide variety of storage scenarios. Azure Data Lake Storage Gen1 is a hyper-scale repository that is optimized for big data analytics workloads.

| Category | Azure Data Lake Storage Gen1 | Azure Blob Storage |
| -------- | ---------------------------- | ------------------ |
| Purpose |Optimized storage for big data analytics workloads |General purpose object store for a wide variety of storage scenarios, including big data analytics |
| Use Cases |Batch, interactive, streaming analytics and machine learning data such as log files, IoT data, click streams, large datasets |Any type of text or binary data, such as application back end, backup data, media storage for streaming and general purpose data. Additionally, full support for analytics workloads; batch, interactive, streaming analytics and machine learning data such as log files, IoT data, click streams, large datasets |
| Key Concepts |Data Lake Storage Gen1 account contains folders, which in turn contains data stored as files |Storage account has containers, which in turn has data in the form of blobs |
| Structure |Hierarchical file system |Object store with flat namespace |
| API |REST API over HTTPS |REST API over HTTP/HTTPS |
| Server-side API |[WebHDFS-compatible REST API](/rest/api/datalakestore/) |[Azure Blob Storage REST API](/rest/api/storageservices/Blob-Service-REST-API) |
| Hadoop File System Client |Yes |Yes |
| Data Operations - Authentication |Based on [Azure Active Directory Identities](../active-directory/develop/authentication-vs-authorization.md) |Based on shared secrets - [Account Access Keys](../storage/common/storage-account-keys-manage.md) and [Shared Access Signature Keys](../storage/common/storage-sas-overview.md). |
| Data Operations - Authentication Protocol |[OpenID Connect](https://openid.net/connect/). Calls must contain a valid JWT (JSON web token) issued by Azure Active Directory.|Hash-based Message Authentication Code (HMAC). Calls must contain a Base64-encoded SHA-256 hash over a part of the HTTP request. |
| Data Operations - Authorization |POSIX Access Control Lists (ACLs).  ACLs based on Azure Active Directory Identities can be set at the file and folder level. |For account-level authorization – Use [Account Access Keys](../storage/common/storage-account-keys-manage.md)<br>For account, container, or blob authorization -  Use [Shared Access Signature Keys](../storage/common/storage-sas-overview.md) |
| Data Operations - Auditing |Available. See [here](data-lake-store-diagnostic-logs.md) for information. |Available |
| Encryption data at rest |<ul><li>Transparent, Server side</li> <ul><li>With service-managed keys</li><li>With customer-managed keys in Azure KeyVault</li></ul></ul> |<ul><li>Transparent, Server side</li> <ul><li>With service-managed keys</li><li>With customer-managed keys in Azure KeyVault (preview)</li></ul><li>Client-side encryption</li></ul> |
| Management operations (for example, Account Create) |[Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) for account management |[Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) for account management |
| Developer SDKs |.NET, Java, Python, Node.js |.NET, Java, Python, Node.js, C++, Ruby, PHP, Go, Android, iOS |
| Analytics Workload Performance |Optimized performance for parallel analytics workloads. High Throughput and IOPS. |Optimized performance for parallel analytics workloads. |
| Size limits |No limits on account sizes, file sizes, or number of files |For specific limits, see [Scalability targets for standard storage accounts](../storage/common/scalability-targets-standard-account.md) and [Scalability and performance targets for Blob storage](../storage/blobs/scalability-targets.md). Larger account limits available by contacting [Azure Support](https://azure.microsoft.com/support/faq/) |
| Geo-redundancy |Locally redundant (multiple copies of data in one Azure region) |Locally redundant (LRS), zone redundant (ZRS), globally redundant (GRS), read-access globally redundant (RA-GRS). See [here](../storage/common/storage-redundancy.md) for more information |
| Service state |Generally available |Generally available |
| Regional availability |See [here](https://azure.microsoft.com/regions/#services) |Available in all Azure regions |
| Price |See [Pricing](https://azure.microsoft.com/pricing/details/data-lake-store/) |See [Pricing](https://azure.microsoft.com/pricing/details/storage/) |