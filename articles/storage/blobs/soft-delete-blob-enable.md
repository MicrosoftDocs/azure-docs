---
title: Enable soft delete for blobs
titleSuffix: Azure Storage 
description: Enable soft delete for blobs to protect blob data from accidental deletes or overwrites.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 05/24/2021
ms.author: tamram
ms.subservice: blobs  
ms.custom: devx-track-azurepowershell

---

# Enable soft delete for blobs

Blob soft delete protects an individual blob and its versions, snapshots, and metadata from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore the blob to its state at deletion. After the retention period has expired, the blob is permanently deleted. For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

Blob soft delete is part of a comprehensive data protection strategy for blob data. To learn more about Microsoft's recommendations for data protection, see [Data protection overview](data-protection-overview.md).

> [!NOTE]
> Blob soft delete can also protect blobs and directories in accounts that have the hierarchical namespace feature enabled. Blob soft delete for accounts that have the hierarchical namespace feature enabled is currently in public preview, and is available only in the East US 2 and West Europe region. 

## Enable blob soft delete

Blob soft delete is disabled by default for a new storage account. You can enable or disable soft delete for a storage account at any time by using the Azure portal, PowerShell, or Azure CLI.

### [Portal](#tab/azure-portal)

To enable blob soft delete for your storage account by using the Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), navigate to your storage account.
1. Locate the **Data Protection** option under **Blob service**.
1. In the **Recovery** section, select **Turn on soft delete for blobs**.
1. Specify a retention period between 1 and 365 days. Microsoft recommends a minimum retention period of seven days.
1. Save your changes.

:::image type="content" source="media/soft-delete-blob-enable/blob-soft-delete-configuration-portal.png" alt-text="Screenshot showing how to enable soft delete in the Azure portal":::

### [PowerShell](#tab/azure-powershell)

To enable blob soft delete with PowerShell, call the [Enable-AzStorageBlobDeleteRetentionPolicy](/powershell/module/az.storage/enable-azstorageblobdeleteretentionpolicy) command, specifying the retention period in days.

The following example enables blob soft delete and sets the retention period to seven days. Remember to replace the placeholder values in brackets with your own values:

```azurepowershell
Enable-AzStorageBlobDeleteRetentionPolicy -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account> `
    -RetentionDays 7
```

To check the current settings for blob soft delete, call the [Get-AzStorageBlobServiceProperty](/powershell/module/az.storage/get-azstorageblobserviceproperty) command:

```azurepowershell
$properties = Get-AzStorageBlobServiceProperty -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account>
$properties.DeleteRetentionPolicy.Enabled
$properties.DeleteRetentionPolicy.Days
```

### [Azure CLI](#tab/azure-CLI)

To enable blob soft delete with Azure CLI, call the [az storage account blob-service-properties update](/cli/azure/storage/account/blob-service-properties#az_storage_account_blob_service_properties_update) command, specifying the retention period in days.

The following example enables blob soft delete and sets the retention period to seven days. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage account blob-service-properties update --account-name <storage-account> \
    --resource-group <resource-group> \
    --enable-delete-retention true \
    --delete-retention-days 7
```

To check the current settings for blob soft delete, call the [az storage account blob-service-properties show](/cli/azure/storage/account/blob-service-properties#az_storage_account_blob_service_properties_show) command:

```azurecli-interactive
az storage account blob-service-properties show --account-name <storage-account> \
    --resource-group <resource-group>
```

---

## Enable blob soft delete (hierarchical namespace)

Blob soft delete can also protect blobs and directories in accounts that have the hierarchical namespace feature enabled on them. 

> [!IMPORTANT]
> This capability is in public preview, and is available only in the East US 2 and West Europe region.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> To enroll in the preview, see [this form](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fforms.office.com%2FPages%2FResponsePage.aspx%3Fid%3Dv4j5cvGGr0GRqy180BHbR4mEEwKhLjlBjU3ziDwLH-pUOUxPTkFSSjJDRlBZNlpZSjhGUktFVzFDRi4u&data=04%7C01%7CSachin.Sheth%40microsoft.com%7C6e6a6d56c2014cdf749308d90e915f1e%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637556839790913940%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&sdata=qnYxVDdI7whCqBW4johgutS3patACP6ubleUrMGFtf8%3D&reserved=0).

<a id="enable-blob-soft-delete-hierarchical-namespace"></a>

### Enable blob soft delete

>[!IMPORTANT]
> This section applies only to accounts that have a hierarchical namespace.

#### [Portal](#tab/azure-portal)

Not yet implemented.

#### [PowerShell](#tab/azure-powershell)

1. Install the latest **PowershellGet** module. Then, close and reopen the Powershell console.

    ```powershell
    install-Module PowerShellGet –Repository PSGallery –Force 
    ```

2.	Install **Az.Storage** preview module.

    ```powershell
    Install-Module Az.Storage -Repository PsGallery -RequiredVersion 3.7.1-preview -AllowClobber -AllowPrerelease -Force 
    ```

    For more information about how to install PowerShell modules, see [Install the Azure PowerShell module](/powershell/azure/install-az-ps)

3. Obtain storage account authorization by using either a storage account key, a connection string, or Azure Active Directory (Azure AD). See [Connect to the account](data-lake-storage-directory-file-acl-powershell.md#connect-to-the-account).

   The following example obtains authorization by using a storage account key.

   ```powershell
   $ctx = New-AzStorageContext -StorageAccountName '<storage-account-name>' -StorageAccountKey '<storage-account-key>'
   ```

4. To enable blob soft delete with PowerShell, use the [Enable-AzStorageDeleteRetentionPolicy](/powershell/module/az.storage/enable-azstoragedeleteretentionpolicy) command, and specify the retention period in days.

   The following example enables soft delete for a directory named `my-directory`, and sets the retention period to seven days. Remember to replace the placeholder values in brackets with your own values:

   ```powershell
   $filesystemName = "my-file-system"
   $dirName="my-directory"
   New-AzDatalakeGen2FileSystem -Name $filesystemName -Context $ctx
   New-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Directory -Path $dirName
   Get-AzDataLakeGen2ChildItem -Context $ctx -FileSystem $filesystemName -Recurse
   Enable-AzStorageDeleteRetentionPolicy -RetentionDays 4  -Context $ctx
   ```

#### [Azure CLI](#tab/azure-CLI)

1. Open the [Azure Cloud Shell](/azure/cloud-shell/overview), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. Install the `storage-preview` extension.

   ```azurecli
   az extension add -n storage-preview
   ```
3. Connect to your storage account. See [Connect to the account](data-lake-storage-directory-file-acl-cli.md#connect-to-the-account).

   > [!NOTE]
   > The example presented in this article show Azure Active Directory (Azure AD) authorization. To learn more about authorization methods, see [Authorize access to blob or queue data with Azure CLI](./authorize-data-operations-cli.md).
 
4. To enable soft delete with Azure CLI, call the `az storage fs service-properties update` command, specifying the retention period in days.

   The following example enables blob and directory soft delete and sets the retention period to seven days. 

   ```azurecli
   az storage fs service-properties update --delete-retention --delete-retention-period 5 --auth-mode login
   ```

5. To check the current settings for blob soft delete, call the `az storage fs service-properties update` command:

   ```azurecli
   az storage fs service-properties update --delete-retention false --connection-string $con
   ```

---

<a id="enable-blob-soft-delete-hierarchical-namespace-with-code"></a>

### Enable blob soft delete by using code

You can enable soft delete in accounts that have a hierarchical namespace by using .NET, Java, and Python.

>[!IMPORTANT]
> This section section applies only to accounts that have a hierarchical namespace.

#### Enable soft delete by using .NET

>[!IMPORTANT]
> This section section applies only to accounts that have a hierarchical namespace.

1. Open a command prompt and change directory (`cd`) into your project folder For example:

   ```console
   cd myProject
   ```

2. Install the `Azure.Storage.Files.DataLake -v 12.7.0` version of the [Azure.Storage.Files.DataLake](https://www.nuget.org/packages/Azure.Storage.Files.DataLake/) NuGet package by using the `dotnet add package` command. 

   ```console
   dotnet add package Azure.Storage.Files.DataLake -v -v 12.7.0 -s https://pkgs.dev.azure.com/azure-sdk/public/_packaging/azure-sdk-for-net/nuget/v3/index.json
   ```

3. Then, add these using statements to the top of your code file.

    ```csharp
    using Azure;
    using Azure.Storage;
    using Azure.Storage.Files.DataLake;
    using Azure.Storage.Files.DataLake.Models;
    using NUnit.Framework;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    ```

4. The following method enables soft delete. 
   
   This method assumes that you've created a [DataLakeServiceClient](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance. To learn how to create a [DataLakeServiceClient](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance, see [Connect to the account](data-lake-storage-directory-file-acl-dotnet.md#connect-to-the-account).

    ```csharp
    public void EnableSoftDelete(DataLakeServiceClient serviceClient)
    {
        DataLakeServiceProperties serviceProperties = await serviceClient.GetPropertiesAsync();
            serviceProperties.DeleteRetentionPolicy = new DataLakeRetentionPolicy
            {
                Enabled = true,
                Days = 3
            };

            await serviceClient.SetPropertiesAsync(serviceProperties);
    }

    ```  

#### Enable soft delete by using Java

>[!IMPORTANT]
> This section section applies only to accounts that have a hierarchical namespace.

1. To get started, open the *pom.xml* file in your text editor. Add the following dependency element to the group of dependencies.

   ```xml
   <dependency>
     <groupId>com.azure</groupId>
     <artifactId>azure-storage-file-datalake</artifactId>
     <version>Put version here</version>
   </dependency>
   ```

2. Then, add these imports statements to your code file.

   ```java
   Put imports here
   ```

3. Enable soft delete by using the `setDeleteRetentionPolicy` method. 

   This method assumes that you've created a **DataLakeServiceClient** instance. To learn how to create a **DataLakeServiceClient** instance, see [Connect to the account](data-lake-storage-directory-file-acl-java.md#connect-to-the-account).

   ```java

   public void enableSoftDelete(DataLakeServiceClient serviceClient){
   
       DataLakeRetentionPolicy deleteRetentionPolicy = 
           new DataLakeRetentionPolicy().setEnabled(true).setDays(1);
      
       DataLakeServiceProperties properties = new DataLakeServiceProperties()
          .setDeleteRetentionPolicy(deleteRetentionPolicy);

      serviceClient.setProperties(properties);
   }

   ```

#### Enable soft delete by using Python

>[!IMPORTANT]
> This section section applies only to accounts that have a hierarchical namespace.

1. Install the Azure Data Lake Storage client library for Python by using [pip](https://pypi.org/project/pip/).

   ```
   pip install azure-storage-file-datalake
   ```

2. Add these import statements to the top of your code file.

   ```python
   import os, uuid, sys
   from azure.storage.filedatalake import DataLakeServiceClient
   from azure.storage.filedatalake import FileSystemClient
   ```

3. The following code enable soft delete.

   The code example below contains an object named `service_client` of type **DataLakeServiceClient**. To see examples of how to create a **DataLakeServiceClient** instance, see [Connect to the account](data-lake-storage-directory-file-acl-python.md#connect-to-the-account).

   ```python
   def enableSoftDelete():
    # Need code for enabling soft delete
   ```


## Next steps

- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Manage and restore soft-deleted blobs](soft-delete-blob-manage.md)
