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

The managed migration tool makes it easier to migrate from Azure Data Lake Storage Gen1 to Azure Data Lake Storage Gen2. This tool automatically moves your data and metadata such as timestamps and access control lists (ACLs). 

Your workloads and applications can continue to point to your Gen1 account. Any requests to the URL of your Gen1 account are redirected to the storage account that you created for Data Lake Storage Gen2. Most workloads and applications will continue to work without modification. Data Lake Storage Gen2 provides a server-side compatibility layer which translates each request made to the Data Lake Storage Gen1 account to a request that is formatted for the storage account that you create for Data Lake Storage Gen2.

Be sure to first read the general guidance and workflows described in this article: [Migrate Azure Data Lake Storage from Gen1 to Gen2](data-lake-storage-migrate-gen1-to-gen2.md).

> [!NOTE]
> For easier reading, this article uses the term *Gen1* to refer to Azure Data Lake Storage Gen1, and the term *Gen2* to refer to Azure Data Lake Storage Gen2. This article won't use the term *Gen2 account*. That's because it's not a dedicated storage account or service type, but rather a set of capabilities that can be obtained by enabling the the **Hierarchical namespace** feature of an Azure storage account. 

## Step 1: Create a storage account with Gen2 capabilities

Create either a [general-purpose V2 account](../common/storage-account-create.md) or a [BlockBlobStorage](storage-blob-create-account-block-blob.md) account. As you create the account, make sure to use the following values: 

| Setting | Value |
|--|--|
| **Location** (region) | The same region used by the Data Lake Storage Gen1 account. |
| **Replication** | LRS or ZRS |
| **Minimum TLS version** | 1.0 |
| **NFS v3** | Disabled |
| **Hierarchical namespace** | Enabled |

Once you've created the account, you'll have to manually configure account settings such as encryption, network firewalls, data protection. The managed migration tool doesn't move any account settings from Gen1 to Gen2.

## Step 2: Run the managed migration tool

1. Navigate to your Data Lake Storage Gen1 account in the Azure portal.

2. In the left menu for the account, scroll to the **ADLS Gen2 Migration** section, then select **Migration**.

   > [!div class="mx-imgBorder"]
   > ![Image Hint](./media/managed-migration-tool/migrate-button.png)

   The **Microsoft Managed Gen1 to Gen2 Migration** wizard appears.

3. In the **Choose a Gen2 account for migration** page, choose a storage account that has the **Hierarchical namespace** feature enabled on it.

   > [!div class="mx-imgBorder"]
   > ![Image Hint](./media/managed-migration-tool/managed-migration-wizard-page-1.png)

4.	In the **Consent to the migration** page, review the terms, choose whether to perform a test migration or a complete migration, and then click the **I consent to the migration** button.

   > [!div class="mx-imgBorder"]
   > ![Image Hint](./media/managed-migration-tool/managed-migration-wizard-page-2.png)

5. For the **Migration Mode** option, choose **Test Migration**. That way the tool migrates your data and metadata such as ACLs and timestamps, but doesn't yet redirect the URL of your Gen1 account. In test migration mode, the Gen1 account remains active while you test your applications against Gen2.

## Step 3: Test your applications
 
Test your applications against your new account to ensure that they work as expected. When you've completed your testing, you can complete the migration.

1. To ensure that you encounter the least number of issues, make sure to update your Gen1 SDKs to the following versions.

   | Language | SDK version |
   |--|--|
   | **.NET** | [2.3.9](https://github.com/Azure/azure-data-lake-store-net/blob/master/CHANGELOG.md) |
   | **Java** | [1.1.21](https://github.com/Azure/azure-data-lake-store-java/blob/master/CHANGES.md) |
   | **Python** | [0.0 51](https://github.com/Azure/azure-data-lake-store-python/blob/master/HISTORY.rst) |

2. Review the list of known issues that have been identified in the Gen1 compatibility layer.

3. Next steps for what is required to test the compatibility layer. 

## Step 4: Complete the migration

When you are ready to complete the migration, do this... need to find out what "this" is.

### Known issues with the Gen1 compatibility layer

##### Issue 1

Description

##### Issue 2

Description

##### Issue 1

Description

##### Issue 2

Description

##### Issue 1

Description

##### Issue 2

Description

## Next steps

- Learn about migration in general. See [Migrate Azure Data Lake Storage from Gen1 to Gen2](data-lake-storage-migrate-gen1-to-gen2.md).
