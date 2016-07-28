<properties
   pageTitle="Azure Data Lake Store comparison with Azure Storage Blob | Microsoft Azure"
   description="Azure Data Lake Store comparison with Azure Storage Blob"
   services="data-lake-store"
   documentationCenter=""
   authors="nitinme"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="07/31/2016"
   ms.author="nitinme"/>

# Comparing Azure Data Lake Store and Azure Blob Storage

The table in this article summarizes the differences between Azure Data Lake Store and Azure Storage Blob along some key aspects of big data processing. Azure Blob Storage is a general purpose, scalable object store that is designed for a wide variety of storage scenarios. Azure Data Lake Store is a hyper-scale repository that is optimized for big data analytics workloads.

|    | ![Data Lake Store icon](./media/data-lake-store-comparison-with-blob-storage/azure-data-lake-store.png "Data Lake Store icon")<br>Azure Data Lake Store  | ![Blob storage icon](./media/data-lake-store-comparison-with-blob-storage/storage-blob.png "Blob storage icon")<br>Azure Blob Storage  |
|----|-----------------------|--------------------|
| Purpose  | Optimized storage for big data analytics workloads                                                                          | General purpose object store for a wide variety of storage scenarios                                                                                |
| Use Cases                                   | Batch, interactive, streaming analytics and machine learning data such as log files, IoT data, click streams, large datasets | Any type of text or binary data, such as application back end, backup data, media storage for streaming and general purpose data |
| Key Concepts                                | Data Lake Store account contains folders, which in turn contains data stored as files | Storage account has containers, which in turn has data in the form of blobs |
| Structure | Hierarchical file system                                                                                                    | Object store with flat namespace  |
| API   | REST API over HTTPS | REST API over HTTP/HTTPS                                                                                                                            |
| Server-side API                             | [WebHDFS-compatible REST API](https://msdn.microsoft.com/library/azure/mt693424.aspx)                                                                                                 | [Azure Blob Storage REST API](https://msdn.microsoft.com/library/azure/dd135733.aspx)                                                                                                                         |
| Hadoop File System Client                   | Yes                                                                                                                         | Yes                                                                                                                                                 |
| Data Operations - Authentication            | Based on [Azure Active Directory Identities](../active-directory/active-directory-authentication-scenarios.md) | Based on shared secrets - [Account Access Keys](../storage/storage-create-storage-account.md#manage-your-storage-account) and [Shared Access Signature Keys](../storage/storage-dotnet-shared-access-signature-part-1.md).                                                                       |
| Data Operations - Authentication Protocol     | OAuth 2.0. Calls must contain a valid JWT (JSON Web Token) issued by Azure Active Directory                     | Hash-based Message Authentication Code (HMAC) . Calls must contain a Base64-encoded SHA-256 hash over a part of the HTTP request. |
| Data Operations - Authorization               | POSIX Access Control Lists (ACLs).  ACLs based on Azure Active Directory Identities can be set at the account level. File and folder ACLs is coming soon. | For account-level authorization – Use [Account Access Keys](../storage/storage-create-storage-account.md#manage-your-storage-account)<br>For account, container, or blob authorization -  Use [Shared Access Signature Keys](../storage/storage-dotnet-shared-access-signature-part-1.md) |
| Data Operations - Auditing                    | Available. See [here](data-lake-store-diagnostic-logs.md) for information.                                                                                                                   | Available.                                                                                                                                           |
| Encryption data at rest                     | Transparent, Server side (coming soon)<ul><li>With service-managed keys</li><li>With customer-managed keys in Azure KeyVault</li></ul>| <ul><li>Transparent, Server side</li> <ul><li>With service-managed keys</li><li>With customer-managed keys in Azure KeyVault (coming soon)</li></ul><li>Client-side encryption</li></ul> |
| Management operations (e.g. Account Create) | [Role-based access control](../active-directory/role-based-access-control-what-is.md) (RBAC) provided by Azure for account management                                                                       | [Role-based access control](../active-directory/role-based-access-control-what-is.md) (RBAC) provided by Azure for account management                                                                                               |
| Developer SDKs                              | .NET, Java, Node.js                                                                                                         | .Net, Java, Python, Node.js, C++, Ruby                                                                                                              |
| Analytics Workload Performance              | Optimized performance for parallel analytics workloads. High Throughput and IOPS.                                           | Not optimized for analytics workloads                                                                                                               |
| Size limits                                 | No limits on account sizes, file sizes or number of files                                                                   | Specific limits documented [here](../azure-subscription-service-limits.md#storage-limits)                                                                                                                     |
| Geo-redundancy                              | Locally-redundant (multiple copies of data in one Azure region)                                                             | Locally redundant (LRS), globally redundant (GRS), read-access globally redundant (RA-GRS). See [here](../storage/storage-redundancy.md) for more information |
| Service state                               | Public Preview                                                                                                              | Generally Available                                                                                                                                 |
| Regional availability  | See [here](https://azure.microsoft.com/regions/#services)| See [here](https://azure.microsoft.com/regions/#services) |
| Price                                       |     See [Pricing](https://azure.microsoft.com/pricing/details/data-lake-store/)| See [Pricing](https://azure.microsoft.com/pricing/details/storage/) |

## Next steps

- [Overview of Azure Data Lake Store](data-lake-store-overview.md)
- [Get Started with Data Lake Store](data-lake-store-get-started-portal.md)



