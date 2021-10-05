---
title: Upgrade Azure Blob Storage with Azure Data Lake Storage Gen2 capabilities  | Microsoft Docs
description: Shows you how to use Resource Manager templates to upgrade from Azure Blob storage to Data Lake Storage.
author: normesta
ms.service: storage
ms.topic: conceptual
ms.date: 10/04/2021
ms.author: normesta

---

#  Upgrade Azure Blob Storage with Azure Data Lake Storage Gen2 capabilities

This article helps you unlock capabilities such as file and directory-level security and faster operations. These capabilities are widely used by big data analytics workloads and are referred to collectively as Azure Data Lake Storage Gen2. 

To learn more about these capabilities and evaluate the impact of this upgrade on workloads, applications, costs, service integrations, tools, features, and documentation, see [Upgrading Azure Blob Storage with Azure Data Lake Storage Gen2 capabilities](upgrade-to-data-lake-storage-gen2.md).

> [!IMPORTANT]
> An upgrade is one-way. There's no way to revert your account once you've performed the upgrade. We recommend that you validate your upgrade in a nonproduction environment.

## Review feature support

You're account might be configured to use features that aren't yet supported in Data Lake Storage Gen2 enabled accounts. If your account is using a feature that isn't yet supported, the upgrade will not pass the validation step. 

Review the [Blob Storage feature support in Azure Storage accounts](storage-feature-support-in-storage-accounts.md) article to identify unsupported features. If you're using any of those unsupported features in your account, make sure to disable them before you begin the upgrade.

## Perform the upgrade

### [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/) to get started.

2. Locate your storage account and display the account overview.

3. Select **Data Lake Gen2 migration**.

   The **Upgrade to a Storage account with Azure Data Lake Gen2 capabilities** configuration page appears.

   > [!div class="mx-imgBorder"]
   > ![Configuration page](./media/upgrade-to-data-lake-storage-gen2-how-to/upgrade-to-an-azure-data-lake-gen2-account-page.png)

4. Expand the **Step 1: Review account changes before upgrading** section and click **Review and agree to changes**.

5. In the **Review account changes** page, select the checkbox and then click **Agree to changes**.

6. Expand the **Step 2: Validate account before upgrading** section and then click **Start validation**.

   If validation fails, select the **View errors** link

   > [!div class="mx-imgBorder"]
   > ![View errors link](./media/upgrade-to-data-lake-storage-gen2-how-to/validation-errors.png)

   Then, from the context menu of the **error.json** file, select **Download**.

   > [!div class="mx-imgBorder"]
   > ![Error json page](./media/upgrade-to-data-lake-storage-gen2-how-to/error-json.png)

   Open the downloaded file to determine why the account did not pass the validation step. 

   The following JSON indicates that an incompatible feature is enabled on the account. In this case, you would disable the feature and then start the validation process again.

   ```json
   {
    "startTime": "2021-08-04T18:40:31.8465320Z",
    "id": "45c84a6d-6746-4142-8130-5ae9cfe013a0",
    "incompatibleFeatures": [
        "Blob Delete Retention Enabled"
    ],
    "blobValidationErrors": [],
    "scannedBlobCount": 0,
    "invalidBlobCount": 0,
    "endTime": "2021-08-04T18:40:34.9371480Z"
   }
   ```

7. After your account has been successfully validated, expand the **Step 3: Upgrade account** section, and then click **Start upgrade**.

   > [!IMPORTANT]
   > Write operations are disabled while your account is being upgraded. Read operations aren't disabled, but we strongly recommend that you suspend read operations as they might destabilize the upgrade process.

   When the migration has completed successfully, a message similar to the following appears. 

   > [!div class="mx-imgBorder"]
   > ![Migration completed page](./media/upgrade-to-data-lake-storage-gen2-how-to/upgrade-to-an-azure-data-lake-gen2-account-completed.png)

### [PowerShell](#tab/azure-powershell)

1. Open a Windows PowerShell command window.

2. Make sure that you have the latest Azure PowerShell module. See [Install Azure PowerShell module](/powershell/azure/install-Az-ps).

3. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

4. If your identity is associated with more than one subscription, then set your active subscription.

   ```powershell
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

6. Validate your storage account by using the following command.

   ```powershell
   $result = Invoke-AzStorageAccountHierarchicalNamespaceUpgrade -ResourceGroupName "<resource-group-name>" -Name "<storage-account-name>" -RequestType Validation -AsJob
   ```

   - Replace the `<resource-group-name>` placeholder value with the name of your resource group.

   - Replace the `<storage-account-name>` placeholder value with the name of your storage account.

   Depending on the size of your account, this process can take some time. Use the `asJob` switch to run command asynchronously so that your client isn't blocked while validation runs. A Task object is returned.

7. If you run this command asynchronously by using the `AsJob` switch, a job object is returned. You can check the status of the validation by using the blah property of the object returned by $result object.

   ```powershell
   Command goes here.
   ```

   If validation fails, a file named **error.json** will appear in a container named **hnsonerror**. You can open that file to determine why the account did not pass the validation step. 

   The following JSON indicates that an incompatible feature is enabled on the account. In this case, you would disable the feature and then start the validation process again.

   ```json
   {
    "startTime": "2021-08-04T18:40:31.8465320Z",
    "id": "45c84a6d-6746-4142-8130-5ae9cfe013a0",
    "incompatibleFeatures": [
        "Blob Delete Retention Enabled"
    ],
    "blobValidationErrors": [],
    "scannedBlobCount": 0,
    "invalidBlobCount": 0,
    "endTime": "2021-08-04T18:40:34.9371480Z"
   }
   ```

8. After your account has been successfully validated, start the upgrade by running the following command.
   
   ```powershell
   Invoke-AzStorageAccountHierarchicalNamespaceUpgrade -ResourceGroupName "<resource-group-name>" -Name "<storage-account-name>" -RequestType Upgrade -AsJob
   ```

   > [!IMPORTANT]
   > Write operations are disabled while your account is being upgraded. Read operations aren't disabled, but we strongly recommend that you suspend read operations as they might destabilize the upgrade process.

   Something here about checking the task object when you are done to get the status.   

   When the migration has completed successfully, a message similar to the following appears. 

### [Azure CLI](#tab/azure-cli)

1. First, open the [Azure Cloud Shell](../../cloud-shell/overview.md), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. If your identity is associated with more than one subscription, then set your active subscription.

   ```azurecli
      az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

3. Validate your storage account by using the following command.

   ```azurecli
   az storage account hns-migration start --type validation -n <storage-account-name> -g <resource-group-name>
   ```

   - Replace the `<resource-group-name>` placeholder value with the name of your resource group.

   - Replace the `<storage-account-name>` placeholder value with the name of your storage account.

   If validation fails, a file named **error.json** will appear in a container named **hnsonerror**. You can open that file to determine why the account did not pass the validation step. 

   The following JSON indicates that an incompatible feature is enabled on the account. In this case, you would disable the feature and then start the validation process again.

   ```json
   {
    "startTime": "2021-08-04T18:40:31.8465320Z",
    "id": "45c84a6d-6746-4142-8130-5ae9cfe013a0",
    "incompatibleFeatures": [
        "Blob Delete Retention Enabled"
    ],
    "blobValidationErrors": [],
    "scannedBlobCount": 0,
    "invalidBlobCount": 0,
    "endTime": "2021-08-04T18:40:34.9371480Z"
   }
   ```

5. After your account has been successfully validated, start the upgrade by running the following command.
   
   ```azurecli
   az storage account hns-migration start --type upgrade -n storage-account-name -g <resource-group-name>
   ```

   > [!IMPORTANT]
   > Write operations are disabled while your account is being upgraded. Read operations aren't disabled, but we strongly recommend that you suspend read operations as they might destabilize the upgrade process.

   When the migration has completed successfully, a message similar to the following appears. 

---

## Stop the upgrade

You can stop the migration before it completes. Something here about what happens when you stop it.

### [Portal](#tab/azure-portal)

To stop the upgrade before it completes, select **Cancel upgrade** while the upgrade is in progress.

> [!div class="mx-imgBorder"]
> ![Cancel upgrade](./media/upgrade-to-data-lake-storage-gen2-how-to/cancel-upgrade.png)

### [PowerShell](#tab/azure-powershell)

To stop the upgrade before it completes, use the `Stop-AzStorageAccountHierarchicalNamespaceUpgrade` command.

```powershell
Stop-AzStorageAccountHierarchicalNamespaceUpgrade -ResourceGroupName <resource-group-name> -Name <storage-account-name>
```

### [Azure CLI](#tab/azure-cli)

To stop the upgrade before it completes, use the `az storage account hns-migration stop` command.

```azurecli
az storage account hns-migration stop -n <storage-account-name> -g <resource-group-name>
```

---


## Migrate data, workloads, and applications 

1. Configure [services in your workloads](data-lake-storage-integrate-with-azure-services.md) to point to either the **Blob service** endpoint or the **Data Lake storage** endpoint.

   > [!div class="mx-imgBorder"]
   > ![Account endpoints](./media/upgrade-to-data-lake-storage-gen2-how-to/storage-endpoints.png)
  
3. For Hadoop workloads that use Windows Azure Storage Blob driver or [WASB](https://hadoop.apache.org/docs/current/hadoop-azure/index.html) driver, make sure to modify them to use the [Azure Blob File System (ABFS)](https://hadoop.apache.org/docs/stable/hadoop-azure/abfs.html) driver. Unlike the WASB driver that makes requests to the **Blob service** endpoint, the ABFS driver will make requests to the **Data Lake Storage** endpoint of your account.

2. Test custom applications to ensure that they work as expected with your upgraded account. 

   [Multi-protocol access on Data Lake Storage](data-lake-storage-multi-protocol-access.md) enables most applications to continue using Blob APIs without modification. If you encounter issues or you want to use APIs to work with directory operations and ACLs, consider moving some of your code to use Data Lake Storage Gen2 APIs. See guides for [.NET](data-lake-storage-directory-file-acl-dotnet.md), [Java](data-lake-storage-directory-file-acl-java.md), [Python](data-lake-storage-directory-file-acl-python.md), [Node.js](data-lake-storage-acl-javascript.md), and [REST](/rest/api/storageservices/data-lake-storage-gen2). 

3. Test any custom scripts to ensure that they work as expected with your upgraded account. 

   As is the case with Blob APIs, many of your scripts will likely work without requiring you to modify them. However, if  needed, you can upgrade script files to use Data Lake Storage Gen2 [PowerShell cmdlets](data-lake-storage-directory-file-acl-powershell.md), and [Azure CLI commands](data-lake-storage-directory-file-acl-cli.md).
 

## See also

[Introduction to Azure Data Lake storage Gen2](data-lake-storage-introduction.md)