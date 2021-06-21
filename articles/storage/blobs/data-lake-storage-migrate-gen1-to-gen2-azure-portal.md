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

> [!IMPORTANT]
> Migrating from Gen1 to Gen2 by using the Azure portal is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

This article guides through the following tasks:

- Step 1: Enroll in the preview

- Step 2: Create a storage account that has Gen2 capabilities

- Step 3: Configure security for both Gen1 and Gen2 accounts

- Step 3: Run the managed migration tool

- Step 4. Test your applications

- Step 5: Complete the migration

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
| **Replication** | LRS |
| **Minimum TLS version** | 1.0 |
| **NFS v3** | Disabled |
| **Hierarchical namespace** | Enabled |

> [!NOTE]
> The managed migration tool doesn't move account settings. Therefore, after you've created the account, you'll have to manually configure settings such as encryption, network firewalls, data protection. 

## Configure security for both Gen1 and Gen2 accounts

Something here about setting up Gen1 and Gen2 accounts with the appropriate security access.

## Run the managed migration tool

The managed migration tool moves data and metadata (such as timestamps and ACLs) from your Gen1 account to your Gen2-enabled account. 

1. Sign in to the [Azure portal](https://portal.azure.com/) to get started.

2. Locate your Data Lake Storage Gen1 account and display the account overview.

3. Select the **Migrate data** button.  

   > [!div class="mx-imgBorder"]
   > ![Image Hint2](./media/data-lake-storage-migrate-gen1-to-gen2-azure-portal/migration-tool.png)

4. If you want to copy only data, select **Copy data to a new ADLS Gen2 account**.

   A snapshot of your data is copied from Gen1 to Gen2 and post the data migration, both Gen1 and Gen2 accounts will be active. 

   If you want to perform a complete migration, select **Complete migration to a new ADLS gen 2 account**.
   
   Data will be copied from Gen1 to Gen2, and post the data copy, your Gen1 account URI will point to Gen2, you will not be able to access your Gen1 account post the migration. 

5. Select the checkbox that provides Microsoft with your consent to perform the data migration, and then click the **Apply** button.




## Test your applications
 
After the data migration is complete, you can test your applications against your new account to ensure that they work as expected.

1. Update your Gen1 SDKs to the following versions.

   | Language | SDK version |
   |--|--|
   | **.NET** | [2.3.9](https://github.com/Azure/azure-data-lake-store-net/blob/master/CHANGELOG.md) |
   | **Java** | [1.1.21](https://github.com/Azure/azure-data-lake-store-java/blob/master/CHANGES.md) |
   | **Python** | [0.0 51](https://github.com/Azure/azure-data-lake-store-python/blob/master/HISTORY.rst) |

   While these versions aren't technically required, they ensure that you will encounter the least number of issues with the *compatibility layer*. The compatibility layer is what enables your application to continue using Gen1 APIs. 

3. In your application code and related configuration files, find and replace Gen1 URLs with Gen2 URLs.

   For example, if your Gen1 account is named `mygen1account` and your Gen2 account is named `mygen2account`, you would replace any instances of the string `mygen1account.azuredatalakestore.net` with `mygen2account.dfs.core.windows.net`.

4. Review the list of known issues with the compatibility layer. see the [Known issues with the Gen1 compatibility layer](#known-issues) section of this article.

5. Test your applications. When you've completed your testing, you can complete the migration.

## Complete the migration

To complete the migration, run the managed migration tool again. Make sure to select the **Complete migration** option this time. When the migration is complete all Gen1 requests will be redirected to your Gen2 enabled account. As time permits, you can move applications and workloads over to Gen2. For guidance, see [Migrate data, workloads, and applications](data-lake-storage-migrate-gen1-to-gen2.md#step-3-migrate-data-workloads-and-applications).

<a id="known-issues"></a>

### Known issues with the Gen1 compatibility layer

The compatibility layer runs on the server so there's nothing to install. However, there are some issues that are worth reviewing before you begin testing your applications. This section describes those issues.

##### ListStatus API option to ListBefore an entry

With Gen1, you could use the query parameter `ListBefore` to reverse list entries starting from a specific entry.  The compatibility layer doesn't support this functionality because it isn't supported by Gen2. 

##### ListStatus API to be used with continuation token 

The `ListStatus` API returns a continuation token if there are more records. Clients need to use a continuation token for next page of a list result. `ListStatus` takes a `listSize` query parameter as a page size, which is set to 4K by default. But in Gen2, there's no guarantee that all all records requested by the client will be returned. Therefore, the client has to rely on the existence of the continuation token in the  response to figure out if there are more records. Some older versions of the Gen1 SDKs had a hard dependency on the number of records returned in place of continuation token. This is a breaking experience in the compatibility layer. Any client that has similar logic needs to be fixed to avoid getting incomplete results. 

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

Gen1 clients send the following two types of token audiences.  

- https://datalake.azure.net  
- https://management.azure.com/  

When using the compatibility layer, we recommend that clients use only the `https://datalake.azure.net` token audience. The `https://management.azure.com/` audience has security implications. Though based on priority, it's possible to allow the `https://management.azure.com/` audience  through DC settings of a stamp, but it's not recommended.  

##### User identification as SuperUser  

Users can be tagged as superusers based upon their Azure role, a SAS token, or account key. 

##### Ownership info displayed as $superuser  

The root directory "/" is created when a Data Lake Storage Gen2 container is created. If the container was created by a user that is authorized with Azure Active Directory (Azure AD), the owning group is set to the user who created the container. If the container is created by using Shared Key, an Account SAS, or a Service SAS, then the owner and owning group are set to $superuser.

For more information, see [Assigning the owning group for a new file or directory](data-lake-storage-access-control.md#assigning-the-owning-group-for-a-new-file-or-directory)  .

## Next steps

- Learn about migration in general. See [Migrate Azure Data Lake Storage from Gen1 to Gen2](data-lake-storage-migrate-gen1-to-gen2.md).
