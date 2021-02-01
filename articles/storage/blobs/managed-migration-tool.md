---
title: Managed migration tool (Azure Data Lake Storage Gen1)
description: Use an automation tool to migrate Azure Data Lake Storage from Gen1 to Gen2.
author: normesta
ms.topic: how-to
ms.author: normesta
ms.date: 10/16/2020
ms.service: storage
ms.reviewer: rukmani-msft
ms.subservice: data-lake-storage-gen2
---

# Migrate Azure Data Lake Storage from Gen1 to Gen2 by using the managed migration tool

The managed migration tool moves data and metadata from Data Lake Storage Gen1 to Data Lake Storage Gen2. There's no immediate need to update your workloads and applications. Your workloads can continue to point to your Gen1 account because requests will be redirected to your Gen2 enabled account. Your applications can continue using Gen1 APIs because of a server side compatibility layer which translates requests from Gen1 to Gen2. As time permits, you can update workloads and applications to use Gen2 endpoints. This tool along with the compatibility layer is designed to make migration easier and reduce downtime while you calibrate your ecosystem to Gen2.

To migrate to Gen2 by using the managed migration tool, we recommend the following 

Before you run this tool, read the general guidance and workflows described in this article: [Migrate Azure Data Lake Storage from Gen1 to Gen2](data-lake-storage-migrate-gen1-to-gen2.md).

> [!NOTE]
> For easier reading, this article uses the term *Gen1* to refer to Azure Data Lake Storage Gen1, and the term *Gen2* to refer to Azure Data Lake Storage Gen2. 

## Create a storage account with Gen2 capabilities

The first step is to create a storage account to use with Gen2. Gen2 is not a dedicated storage account or service type. It's a set of capabilities that you can obtain by enabling the the **Hierarchical namespace** feature of an Azure storage account. Gen2 capabilities are supported in the following types of storage accounts:

- General-purpose v2
- BlockBlobStorage

For information about how to choose between them, see [storage account overview](../common/storage-account-overview.md).

Create either a [general-purpose V2 account](../common/storage-account-create.md) or a [BlockBlobStorage](storage-blob-create-account-block-blob.md) account. As you create the account, make sure to use the following values. All of these settings except for the hierarchical namespace setting are required by the managed migration tool.

| Setting | Value |
|--|--|
| **Location** (region) | The same region used by the Data Lake Storage Gen1 account. |
| **Replication** | LRS or ZRS |
| **Minimum TLS version** | 1.0 |
| **NFS v3** | Disabled |
| **Hierarchical namespace** | Enabled |

The managed migration tool doesn't move account settings. Therefore, after you've created the account, you'll have to manually configure settings such as encryption, network firewalls, data protection. 

## Run the managed migration tool

1. Navigate to your Data Lake Storage Gen1 account in the Azure portal.

2. In the left menu for the account, scroll to the **ADLS Gen2 Migration** section, then select **Migration**.

   > [!div class="mx-imgBorder"]
   > ![Image Hint1](./media/managed-migration-tool/migrate-button.png)

   The **Microsoft Managed Gen1 to Gen2 Migration** wizard appears.

3. In the **Choose a Gen2 account for migration** page, choose a storage account that has the **Hierarchical namespace** feature enabled on it.

   > [!div class="mx-imgBorder"]
   > ![Image Hint2](./media/managed-migration-tool/managed-migration-wizard-page-1.png)

4. For the **Migration Mode** option, choose **Test Migration**. That way the tool migrates your data and metadata such as ACLs and timestamps, but doesn't yet redirect the URL of your Gen1 account. That way your Gen1 account remains active while you test your applications against Gen2.

## Test your applications
 
Test your applications against your new account to ensure that they work as expected.

1. To ensure that you encounter the least number of issues, make sure to update your Gen1 SDKs to the following versions.

   | Language | SDK version |
   |--|--|
   | **.NET** | [2.3.9](https://github.com/Azure/azure-data-lake-store-net/blob/master/CHANGELOG.md) |
   | **Java** | [1.1.21](https://github.com/Azure/azure-data-lake-store-java/blob/master/CHANGES.md) |
   | **Python** | [0.0 51](https://github.com/Azure/azure-data-lake-store-python/blob/master/HISTORY.rst) |

2. Review known issues with the Gen1 compatibility layer.

3. In your application code and related configuration files, find and replace Gen1 URLs with Gen2 URLs.

   For example, if your Gen1 account is named `mygen1account` and your Gen2 account is named `mygen2account`, you would replace any instances of the string `mygen1account.azuredatalakestore.net` with `mygen2account.dfs.core.windows.net`.

4. Test your applications. When you've completed your testing, you can complete the migration.

## Complete the migration

To complete the migration, run the managed migration tool again. Make sure to choose **Complete Migration** this time. When the migration is complete all Gen1 requests will be redirected to your Gen2 enabled account. as time permits, you can move applications and workloads over to Gen2. For guidance, see [Migrate data, workloads, and applications](data-lake-storage-migrate-gen1-to-gen2.md#step-3-migrate-data-workloads-and-applications).

### Known issues with the Gen1 compatibility layer

##### ListStatus API option to ListBefore an entry

With Gen1, you could use the query parameter `ListBefore` to reverse list entries starting from a specific entry.  The compatibility layer doesn't support this functionality because it isn't supported by Gen2. 

##### ListStatus API to be used with continuation token 

The `ListStatus` API returns a continuation token if there are more records. Clients need to use a continuation token for next page of a list result. `ListStatus` takes a `listSize` query parameter as a page size, which is set to 4K by default. But in Gen2, there's no guarantee that all all records requested by the client will be returned. Therefore, the client has to rely on the existence of the continuation token in the response to figure out if there are more records. Some older versions of the Gen1 SDKs had a hard dependency on the number of records returned in place of continuation token. This is a breaking experience in the compatibility layer. Any client that has similar logic needs to be fixed to avoid getting incomplete results. 

##### Unsupported characters in file and directory names

The compatibility layer doesn't support the following file and directory names:  

- Names with only spaces or tabs

- Names ending with a `.`   

- Names containing a `:`  

##### Requests paths with multiple forward slashes

The compatibility layer doesn't support request paths that have multiple consecutive forward slashes. In Gen1, Internet Information Services (IIS) used to convert these slashes into a single slash. 

##### Container name restrictions

Containers didn't exist in Gen1. However in Gen2, all files must be placed into a container. To use the compatibility layer, you must create a container named `gen1` in your Gen2 account. 

##### Maximum file size

The maximum file size of any file that you create by using the compatibility layer is 5 TiB.   

##### Discontinue chunk-encoding support

Gen1 supports chunk-encoding for append operations, but the compatibility layer does not. Clients that send chunk-encoding requests will receive a `BadRequest` error.  

##### GetContentSummary server API is not supported  

In Gen1, the server-side implementation of `GetContentSummary` had performance issues with large directories due to timeouts. To solve that, a client-side implementation of the API was introduced that uses `ListStatus`. All of the latest SDK versions implement that new version on the client-side.

##### Token audience for authentication  

Gen1 clients send two types of token audiences.  

https://datalake.azure.net  

https://management.azure.com/  

When using the compatibility layer, we recommend that clients use only the `https://datalake.azure.net` token audience. The `https://management.azure.com/` audience has security implications. Though based on priority, it's possible to allow the `https://management.azure.com/` audience  through DC settings of a stamp, but it's not recommended.  

##### User identification as SuperUser  

Users can be tagged as superusers based on their Azure role. – Mentioned in “RBAC User Role Significance row of “ACL  related Deviations” table below. Other than that, when account is accessed using SAS token or account key too, the user will be identified as superuser.

##### Ownership info displayed as $superuser  

https://docs.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-access-control#assigning-the-owning-group-for-a-new-file-or-directory  

The root directory "/" is created when a Data Lake Storage Gen2 file system is created. In this case, the owning group is set to the user who created the file system if it was done using OAuth. If the filesystem is created using Shared Key, an Account SAS, or a Service SAS, then the owner and owning group are set to $superuser.”  

Note: Refer Appendix 3 for ACL related deviations across ADLS Gen1, Gen1Compatibility layer & Gen2 

## Next steps

- Learn about migration in general. See [Migrate Azure Data Lake Storage from Gen1 to Gen2](data-lake-storage-migrate-gen1-to-gen2.md).
