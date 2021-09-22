---
title: Migrate using Azure portal (Data Lake Storage Gen1 to Gen2)
description: You can simplify the task of migrating between Azure Data Lake Storage Gen1 and Azure Data Lake Storage Gen2 by using the Azure portal.  
author: normesta
ms.topic: how-to
ms.author: normesta
ms.date: 07/13/2021
ms.service: storage
ms.reviewer: rukmani-msft
ms.subservice: data-lake-storage-gen2
---

# Migrate Azure Data Lake Storage from Gen1 to Gen2 by using the Azure portal (preview)

You can reduce the number of steps required to complete a migration by using the Azure portal. Data and metadata (such as timestamps and ACLs) automatically move to your Gen2-enabled account. If you perform a complete migration, you won't have to point your workloads to Gen2 because requests are redirected automatically. 

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

To enroll in the preview, see [this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR4SeyCfCfrtBlHWFupvoz_BUMEFNQzBSQTE0OU1aM0hXMDlBNEwzVTYyRy4u&wdLOR=cBC075B83-9324-4399-B94E-05A919D007C9). After you've enrolled, create a storage account with Gen2 capabilities (see next section). 

Microsoft will contact you in approximately seven days to ensure that your new account is enabled for migration.

## Create a storage account with Gen2 capabilities

Azure Data Lake Storage Gen2 is not a dedicated storage account or service type. It's a set of capabilities that you can obtain by enabling the **Hierarchical namespace** feature of an Azure storage account. To create an account that has Gen2 capabilities, see [Create a storage account to use with Azure Data Lake Storage Gen2](create-data-lake-storage-account.md). 

As you create the account, make sure to configure settings with the following values.

| Setting | Value |
|--|--|
| **Storage account name** | Any name that you want. This name doesn't have to match the name of your Gen1 account and can be in any subscription of your choice. |
| **Location** | The same region used by the Data Lake Storage Gen1 account |
| **Replication** | LRS or ZRS |
| **Minimum TLS version** | 1.0 |
| **NFS v3** | Disabled |
| **Hierarchical namespace** | Enabled |

> [!NOTE]
> The migration tool in the Azure portal doesn't move account settings. Therefore, after you've created the account, you'll have to manually configure settings such as encryption, network firewalls, data protection. 

## Verify RBAC role assignments

For Gen2, ensure that the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role has been assigned to your Azure Active Directory (Azure AD) user identity in the scope of the storage account, parent resource group, or subscription. 

For Gen1, ensure that the [Owner](../../role-based-access-control/built-in-roles.md#owner) role has been assigned to your Azure AD identity in the scope of the Gen1 account, parent resource group, or subscription.

## Perform the migration

Before you begin, decide whether to copy only data or perform a complete migration. 

If you copy only the data, both accounts remain active after the migration is completed. During the migration, your Gen1 account will become read-only. You can then update your compute workloads to use your new Gen2 enabled storage account. Once you've verified that your applications and workloads work as expected, you can retire the Gen1 account. Microsoft recommends this option.

If you perform a complete migration, data is copied from Gen1 to Gen2. Then, your Gen1 URI is redirected to your Gen2 URI. After the migration completes, you won't have access to your Gen1 account and all Gen1 requests will be redirected to your Gen2 enabled account. Your Gen1 account will no longer be available for data operations, and you will no longer be billed for the data in your Gen1 account. You can delete your Gen1 account once your pipelines are running on your Gen2 enabled account.

> [!NOTE]
> Gen2 doesn't support Azure Data Lake Analytics applications. If you have any, make sure to move them to Azure Synapse Analytics or another supported workload before you migrate from Gen1 to Gen2.

### Option 1: Copy data from Gen1 to Gen2

1. Sign in to the [Azure portal](https://portal.azure.com/) to get started.

2. Locate your Data Lake Storage Gen1 account and display the account overview.

3. Select the **Migrate data** button.  

   > [!div class="mx-imgBorder"]
   > ![Button to migrate](./media/data-lake-storage-migrate-gen1-to-gen2-azure-portal/migration-tool.png)

4. Select **Copy data to a new Gen2 account**.

   > [!div class="mx-imgBorder"]
   > ![Copy data option](./media/data-lake-storage-migrate-gen1-to-gen2-azure-portal/migration-data-option.png)

5. Give Microsoft consent to perform the data migration by selecting the checkbox. Then, click the **Apply** button.

   > [!div class="mx-imgBorder"]
   > ![Checkbox to provide consent](./media/data-lake-storage-migrate-gen1-to-gen2-azure-portal/migration-consent.png)

   While your data is being migrated, your Gen1 account becomes read-only, and your Gen2-enabled account is disabled. After the migration completes, you can read and write to both accounts.

   You can stop the migration at any time by selecting the **Stop migration** button.

   > [!div class="mx-imgBorder"]
   > ![Stop migration option](./media/data-lake-storage-migrate-gen1-to-gen2-azure-portal/migration-stop.png)

### Option 2: Perform a complete migration

1. Sign in to the [Azure portal](https://portal.azure.com/) to get started.

2. Locate your Data Lake Storage Gen1 account and display the account overview.

3. Select the **Migrate data** button.  

   > [!div class="mx-imgBorder"]
   > ![Migrate button](./media/data-lake-storage-migrate-gen1-to-gen2-azure-portal/migration-tool.png)

4. Select **Complete migration to a new gen 2 account**.

   > [!div class="mx-imgBorder"]
   > ![Complete migration option](./media/data-lake-storage-migrate-gen1-to-gen2-azure-portal/migration-complete-option.png)

5. Give Microsoft consent to perform the data migration by selecting the checkbox. Then, click the **Apply** button.

   > [!div class="mx-imgBorder"]
   > ![Consent checkbox](./media/data-lake-storage-migrate-gen1-to-gen2-azure-portal/migration-consent.png)

   - While your data is being migrated, your Gen1 account becomes read-only, and the Gen2-enabled account is disabled. 
   - While the Gen1 URI is being redirected, both accounts are disabled. 
   - After the migration completes, your Gen1 account is disabled, and you can read and write to your Gen2-enabled account.

   You can stop the migration at any time before the URI is redirected by selecting the **Stop migration** button.

   > [!div class="mx-imgBorder"]
   > ![Migration stop button](./media/data-lake-storage-migrate-gen1-to-gen2-azure-portal/migration-stop.png)

## Migrate workloads and applications

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

## Leverage the Gen1 compatibility layer (optional)

Microsoft provides application compatibility with limited functionality so that your applications can continue using Gen1 APIs to interact with data in your Gen2-enabled account. The compatibility layer runs on the server so there's nothing to install. 

> [!IMPORTANT]
> Microsoft does not recommend this capability as a replacement for migrating your workloads and applications. Support for the Gen1 compatibility layer will end when Gen1 is retired in Feb 29, 2024.

To encounter the least number of issues with the compatibility layer, make sure that your Gen1 SDKs use the following versions (or higher).

   | Language | SDK version |
   |--|--|
   | **.NET** | [2.3.9](https://github.com/Azure/azure-data-lake-store-net/blob/master/CHANGELOG.md) |
   | **Java** | [1.1.21](https://github.com/Azure/azure-data-lake-store-java/blob/master/CHANGES.md) |
   | **Python** | [0.0 51](https://github.com/Azure/azure-data-lake-store-python/blob/master/HISTORY.rst) |

The following functionality isn't supported in Gen2, and therefore the compatibility layer.

- ListStatus API option to ListBefore an entry.

- ListStatus API with over 4000 files without a continuation token.

- Chunk-encoding for append operations.

- Any API calls that use https://management.azure.com/  as the Azure Active Directory (Azure AD) token audience.

- File or directory names with only spaces or tabs, ending with a `.`, containing a `:`, or with multiple consecutive forward slashes (`//`).

## Frequently asked questions

#### How much does the data migration cost?

During the data migration, you will be billed for the data storage and transactions of the Gen1 account. If you choose the option that copies only data, then you will be billed for the data storage and transactions for both accounts after the migration is completed. To avoid being billed for the Gen1 account, you'll have to delete the Gen1 account. Delete the Gen1 account after you have completed updating your applications. If you choose to perform a complete migration, you will be billed only for the data storage and transactions of the Gen2 enabled account after the migration. 

#### After the migration completes, can I choose to go back to using the Gen1 account?

This is not supported, after the migration completes, the data in your Gen1 account will not be accessible. You can continue to view the Gen1 account in the Azure portal, and when you are ready, you can delete the account. 

#### I would like to enable Geo-redundant storage (GRS) on the Gen2 account, how do I do that?

Once the migration is complete, both in "Copy data" and "Complete migration" options, you can go ahead and change the redundancy option to GRS as long as you don't plan to use the application compatibility layer. The application compatibility will not work on accounts that use GRS redundancy.  

#### Gen1 doesn't have containers and Gen2 has them – what should I expect?

When we copy the data over to your Gen2-enabled account, we automatically create a container named `Gen1`. If you choose to copy only data, then you can rename that container after the data copy is complete. If you perform a complete migration, and you plan to use the application compatibility layer, then you should avoid changing the container name. When you no longer want to use the compatibility layer, you can change the name of the container. 

## Next steps

- Learn about migration in general. See [Migrate Azure Data Lake Storage from Gen1 to Gen2](data-lake-storage-migrate-gen1-to-gen2.md).
