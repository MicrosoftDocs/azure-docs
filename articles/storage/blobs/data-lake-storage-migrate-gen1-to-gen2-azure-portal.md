---
title: Migrate using Azure portal (Data Lake Storage Gen1 to Gen2)
description: Microsoft managed migration eases your migration from Azure Data Lake Storage Gen1 to Azure Data Lake Storage Gen2. 
author: normesta
ms.topic: how-to
ms.author: normesta
ms.date: 10/16/2020
ms.service: storage
ms.reviewer: rukmani-msft
ms.subservice: data-lake-storage-gen2
---

# Migrate Azure Data Lake Storage from Gen1 to Gen2 by using the Azure portal (preview)

You can migrate to Gen2 more easily by using *Microsoft managed migration*; a data migration tool and API compatibility layer. 

Managed migration reduces the number of steps required to complete a migration. You won't have to configure a separate tool to move your data. Also, your workloads and applications can continue working with minimal modifications. For one, you won't have to point your workloads to Gen2 because requests are redirected automatically. Also, your applications can continue using Gen1 APIs because they are compatible with Gen2. 

The managed migration tool moves data and metadata (such as timestamps and ACLs)

> [!IMPORTANT]
> Migrating from Gen1 to Gen2 by using the Azure portal is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

This article guides through the following tasks:

- Step 1: Enroll in the preview

- Step 2: Create a storage account that has Gen2 capabilities

- Step 3: Verify RBAC role assignments

- Step 4: Perform the migration

- Step 5. Test your applications

- Step 6: Complete the migration

Be sure to read the general guidance about how to migrate from Gen1 to Gen2. See [Migrate Azure Data Lake Storage from Gen1 to Gen2](data-lake-storage-migrate-gen1-to-gen2.md).

> [!NOTE]
> For easier reading, this article uses the term *Gen1* to refer to Azure Data Lake Storage Gen1, and the term *Gen2* to refer to Azure Data Lake Storage Gen2. 

## Enroll in the preview

To enroll in the preview, see [this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR4SeyCfCfrtBlHWFupvoz_BUMEFNQzBSQTE0OU1aM0hXMDlBNEwzVTYyRy4u&wdLOR=cBC075B83-9324-4399-B94E-05A919D007C9).  

After you've enrolled, create a storage account with Gen2 capabilities. Microsoft will contact you in approximately seven days to ensure that your new account is enabled for migration.

## Create a storage account with Gen2 capabilities

Azure Data Lake Storage Gen2 is not a dedicated storage account or service type. It's a set of capabilities that you can obtain by enabling the the **Hierarchical namespace** feature of an Azure storage account. 

To create an account that has Gen2 capabilities, see [Create a storage account to use with Azure Data Lake Storage Gen2](create-data-lake-storage-account.md). As you create the account, make sure to configure settings with the following values.

| Setting | Value |
|--|--|
| **Storage account name** | Any name that you want. This name doesn't have to match the name of your Gen1 account |
| **Location** | The same region used by the Data Lake Storage Gen1 account. |
| **Replication** | LRS or ZRS |
| **Minimum TLS version** | 1.0 |
| **NFS v3** | Disabled |
| **Hierarchical namespace** | Enabled |

> [!NOTE]
> The managed migration tool doesn't move account settings. Therefore, after you've created the account, you'll have to manually configure settings such as encryption, network firewalls, data protection. 

Something here about setting proper permissions on storage account (RBAC)

## Verify RBAC role assignments

Something here about ensuring the proper permissions on Gen1 and Gen2.

## Perform the migration

Decide whether you're ready to migrate your account or if you'd rather just copy the data for now, and then disable your Gen1 account later after you've verified that all of your applications and workloads work with your Gen2 account. 

### Option 1: Migrate from Gen1 to Gen2

When you perform a complete migration, data is copied from Gen1 to Gen2. Then, your Gen1 URI is redirected to your Gen2 URI. After the migration completes you won't have access to your Gen1 account and all Gen1 requests will be redirected to your Gen2 enabled account. This is the most convenient option. This option might make sense if there aren't any critical production workloads or applications that depend on your Gen1 account. 

> [!NOTE]
> Gen2 doesn't support Azure Data Lake Analytics applications. If you have any, make sure to move them to Azure Synapse Analytics or another supported workload before you migrate from Gen1 to Gen2.
 
1. Sign in to the [Azure portal](https://portal.azure.com/) to get started.

2. Locate your Data Lake Storage Gen1 account and display the account overview.

3. Select the **Migrate data** button.  

   > [!div class="mx-imgBorder"]
   > ![Image Hint2](./media/data-lake-storage-migrate-gen1-to-gen2-azure-portal/migration-tool.png)

4. Select **Complete migration to a new ADLS gen 2 account**.

5. Select the checkbox that provides Microsoft with your consent to perform the data migration, and then click the **Apply** button.

   - While your data is being migrated, your Gen1 account becomes read-only, and the Gen2-enabled account is disabled. 
   - After data is migrated, and while the Gen1 URI is being redirected, both accounts are disabled. 
   - After the migration completes, your Gen1 account is disabled, and you can read and write to your Gen2-enabled account.

   You can stop the migration at any time before the URI is redirected by selecting the **Stop migration** button.

### Option 2: Copy only data and retire Gen1 account later

With this option, a snapshot of your data is copied from Gen1 to Gen2. After the data is copied, both accounts remain active. Then, you modify applications and workloads to use your new Gen2-enabled account without interrupting production availability. Once you've verified that they work as expected, you can work our team to redirect your Gen1 URI to your Gen2 URI and then retire the Gen1 account.

1. Sign in to the [Azure portal](https://portal.azure.com/) to get started.

2. Locate your Data Lake Storage Gen1 account and display the account overview.

3. Select the **Migrate data** button.  

   > [!div class="mx-imgBorder"]
   > ![Image Hint2](./media/data-lake-storage-migrate-gen1-to-gen2-azure-portal/migration-tool.png)

4. Select **Copy data to a new ADLS Gen2 account**.

5. Select the checkbox that provides Microsoft with your consent to perform the data migration, and then click the **Apply** button.

   While your data is being migrated, your Gen1 account becomes read-only, and your Gen2-enabled account is disabled. After the migration completes, You can read and write to both accounts.

   You can stop the migration at any time by selecting the **Stop migration** button.

## Migrate workloads and applications

After you migrate, modify workloads, and applications to use your Gen2-enabled account. We recommend that you validate scenarios incrementally.

1. Configure [services in your workloads](./data-lake-storage-supported-azure-services.md) to point to your Gen2 endpoint. 
   
2. Update applications to use Gen2 APIs. See these guides:

| Environment | Article |
|--------|-----------|
|Azure Storage Explorer |[Use Azure Storage Explorer to manage directories and files in Azure Data Lake Storage Gen2](data-lake-storage-explorer.md)|
|.NET |[Use .NET to manage directories and files in Azure Data Lake Storage Gen2](data-lake-storage-directory-file-acl-dotnet.md)|
|Java|[Use Java to manage directories and files in Azure Data Lake Storage Gen2](data-lake-storage-directory-file-acl-java.md)|
|Python|[Use Python to manage directories and files in Azure Data Lake Storage Gen2](data-lake-storage-directory-file-acl-python.md)|
|JavaScript (Node.js)|[Use JavaScript SDK in Node.js to manage directories and files in Azure Data Lake Storage Gen2](data-lake-storage-directory-file-acl-javascript.md)|
|REST API |[Azure Data Lake Store REST API](/rest/api/storageservices/data-lake-storage-gen2)|
 
3. Update scripts to use Data Lake Storage Gen2 [PowerShell cmdlets](data-lake-storage-directory-file-acl-powershell.md), and [Azure CLI commands](data-lake-storage-directory-file-acl-cli.md).
   
4. Search for URI references that contain the string `adl://` in code files, or in Databricks notebooks, Apache Hive HQL files or any other file used as part of your workloads. Replace these references with the [Gen2 formatted URI](data-lake-storage-introduction-abfs-uri.md) of your new storage account. For example: the Gen1 URI: `adl://mydatalakestore.azuredatalakestore.net/mydirectory/myfile` might become `abfss://myfilesystem@mydatalakestore.dfs.core.windows.net/mydirectory/myfile`. 

## Enable Gen1 compatibility layer (optional)

Microsoft provides application compatibility with limited functionality so that your applications can continue using Gen1 APIs to interact with data in your Gen2-enabled account. The compatibility layer runs on the server so there's nothing to install. Microsoft does not recommend that you rely on this capability as a replacement for migrating your workloads and applications.  

To encounter the least number of issues with the compatibility layer, make sure that your Gen1 SDKs use the following versions (or higher).

   | Language | SDK version |
   |--|--|
   | **.NET** | [2.3.9](https://github.com/Azure/azure-data-lake-store-net/blob/master/CHANGELOG.md) |
   | **Java** | [1.1.21](https://github.com/Azure/azure-data-lake-store-java/blob/master/CHANGES.md) |
   | **Python** | [0.0 51](https://github.com/Azure/azure-data-lake-store-python/blob/master/HISTORY.rst) |

The following functionality isn't supported in Gen2, and therefore the compatibility layer.

- ListStatus API option to ListBefore an entry

- ListStatus API with over 4000 files without a continuation token 

- Chunk-encoding for append operations

- Any API calls that use https://management.azure.com/  as the Azure Active Directory (Azure AD) token audience.

- File or directory names with only spaces or tabs, ending with a `.`, containing a `:`, or with multiple consecutive forward slashes (`//`).

## Next steps

- Learn about migration in general. See [Migrate Azure Data Lake Storage from Gen1 to Gen2](data-lake-storage-migrate-gen1-to-gen2.md).
