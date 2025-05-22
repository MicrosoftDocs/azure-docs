---
title: Enable Azure Storage blob inventory reports
description: Obtain an overview of your containers, blobs, snapshots, and blob versions within a storage account.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.date: 05/02/2024
ms.topic: how-to
ms.author: normesta
ms.devlang: powershell
# ms.devlang: powershell, azurecli
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Enable Azure Storage blob inventory reports

The Azure Storage blob inventory feature provides an overview of your containers, blobs, snapshots, and blob versions within a storage account. Use the inventory report to understand various attributes of blobs and containers such as your total data size, age, encryption status, immutability policy, and legal hold and so on. The report provides an overview of your data for business and compliance requirements.

To learn more about blob inventory reports, see [Azure Storage blob inventory](blob-inventory.md).

Enable blob inventory reports by adding a policy with one or more rules to your storage account. Add, edit, or remove a policy by using the [Azure portal](https://portal.azure.com/).

## Enable inventory reports

### [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/) to get started.

2. Locate your storage account and display the account overview.

3. Under **Data management**, select **Blob inventory**.

4. Select **Add your first inventory rule**.

   The **Add a rule** page appears.

5. In the **Add a rule** page, name your new rule.

6. Choose the container that will store inventory reports.

7. Under **Object type to inventory**, choose whether to create a report for blobs or containers.

   If you select **Blob**, then under **Blob subtype**, choose the types of blobs that you want to include in your report, and whether to include blob versions and/or snapshots in your inventory report.

   > [!NOTE]
   > The option to include blob versions appears only for accounts that don't have the hierarchical namespace feature enabled. 
   > Versions and snapshots must be enabled on the account to save a new rule with the corresponding option enabled.

8. Select the fields that you would like to include in your report, and the format of your reports.

9. Choose how often you want to generate reports.

10. Optionally, add a prefix match to filter blobs in your inventory report.

11. Select **Save**.

    > [!div class="mx-imgBorder"]
    > ![Screenshot showing how to add a blob inventory rule by using the Azure portal.](./media/blob-inventory-how-to/portal-blob-inventory.png)

### [PowerShell](#tab/azure-powershell)

<a id="powershell"></a>

You can add, edit, or remove a policy by using the Azure PowerShell module.

1. Open a Windows PowerShell command window.

2. Make sure that you have the latest Azure PowerShell module. See [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

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

5. Get the storage account context that defines the storage account you want to use.

   ```powershell
   $storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -AccountName "<storage-account-name>"
   $ctx = $storageAccount.Context
   ```

   - Replace the `<resource-group-name>` placeholder value with the name of your resource group.

   - Replace the `<storage-account-name>` placeholder value with the name of your storage account.

6. Create inventory rules by using the [New-AzStorageBlobInventoryPolicyRule](/powershell/module/az.storage/new-azstorageblobinventorypolicyrule) command. Each rule lists report fields. For a complete list of report fields, see [Azure Storage blob inventory](blob-inventory.md).

   ```powershell
    $containerName = "my-container"

    $rule1 = New-AzStorageBlobInventoryPolicyRule -Name Test1 -Destination $containerName -Disabled -Format Csv -Schedule Daily -PrefixMatch con1,con2 `
                -ContainerSchemaField Name,Metadata,PublicAccess,Last-modified,LeaseStatus,LeaseState,LeaseDuration,HasImmutabilityPolicy,HasLegalHold

    $rule2 = New-AzStorageBlobInventoryPolicyRule -Name test2 -Destination $containerName -Format Parquet -Schedule Weekly  -BlobType blockBlob,appendBlob -PrefixMatch aaa,bbb `
                -BlobSchemaField name,Last-Modified,Metadata,LastAccessTime

    $rule3 = New-AzStorageBlobInventoryPolicyRule -Name Test3 -Destination $containerName -Format Parquet -Schedule Weekly -IncludeBlobVersion -IncludeSnapshot -BlobType blockBlob,appendBlob -PrefixMatch aaa,bbb `
                -BlobSchemaField name,Creation-Time,Last-Modified,Content-Length,Content-MD5,BlobType,AccessTier,AccessTierChangeTime,Expiry-Time,hdi_isfolder,Owner,Group,Permissions,Acl,Metadata,LastAccessTime

    $rule4 = New-AzStorageBlobInventoryPolicyRule -Name test4 -Destination $containerName -Format Csv -Schedule Weekly -BlobType blockBlob -BlobSchemaField Name,BlobType,Content-Length,Creation-Time

   ```

7. Use the [Set-AzStorageBlobInventoryPolicy](/powershell/module/az.storage/set-azstorageblobinventorypolicy) to create a blob inventory policy. Pass rules into this command by using the `-Rule` parameter.

   ```powershell
   $policy = Set-AzStorageBlobInventoryPolicy -StorageAccount $storageAccount -Rule $rule1,$rule2,$rule3,$rule4  
   ```

### [Azure CLI](#tab/azure-cli)

<a id="cli"></a>

You can add, edit, or remove a policy via the [Azure CLI](/cli/azure/).

1. First, open the [Azure Cloud Shell](../../cloud-shell/overview.md), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. If your identity is associated with more than one subscription, then set your active subscription.

   ```azurecli
      az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

3. Define the rules of your policy in a JSON document. The following shows the contents of an example JSON file named `policy.json`.

    ```json
    {
    "enabled": true,
    "type": "Inventory",
    "rules": [
      {
        "enabled": true,
        "name": "inventoryPolicyRule2",
        "destination": "mycontainer",
        "definition": {
          "filters": {
            "blobTypes": [
              "blockBlob"
            ],
            "prefixMatch": [
              "inventoryprefix1",
              "inventoryprefix2"
            ],
            "includeSnapshots": true,
            "includeBlobVersions": true
          },
          "format": "Csv",
          "schedule": "Daily",
          "objectType": "Blob",
          "schemaFields": [
            "Name",
            "Creation-Time",
            "Last-Modified",
            "Content-Length",
            "Content-MD5",
            "BlobType",
            "AccessTier",
            "AccessTierChangeTime",
            "Snapshot",
            "VersionId",
            "IsCurrentVersion",
            "Metadata"
          ]
        }
      }
     ]
   }

   ```

4. Create a blob inventory policy by using the [az storage account blob-inventory-policy](/cli/azure/storage/account/blob-inventory-policy#az-storage-account-blob-inventory-policy-create) create command. Provide the name of your JSON document by using the `--policy` parameter.

   ```azurecli
   az storage account blob-inventory-policy create -g myresourcegroup --account-name mystorageaccount --policy @policy.json
   ```

---

## Disable inventory reports

While you can disable individual reports, you can also prevent blob inventory from running at all.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Locate your storage account and display the account overview.

3. Under **Data management**, select **Blob inventory**.

4. Select **Blob inventory settings**, and in the **Blob inventory settings** pane, clear the **Enable blob inventory** checkbox, and then select **Save**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot showing the Enable blob inventory checkbox in the Azure portal.](./media/blob-inventory-how-to/portal-blob-inventory-disable.png)

   Clearing the **Enable blob inventory** checkbox suspends all blob inventory runs. You can select this checkbox later if you want to resume inventory runs.

## Subscribe to blob inventory policy completed event

You can suscribe to blob inventory completed event to receive information on the outcome of your inventory runs. This event gets triggered when the inventory run completes for a rule that is defined an inventory policy. This event also occurs if the inventory run fails with a user error before it starts to run. For example, an invalid policy, or an error that occurs when a destination container isn't present will trigger the event.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Locate your storage account and display the account overview.

3. In the left menu, select **Events**.
   
4. Select **+ Event Subscription**.

   The **Create Event Subscription** page appears.

5. In the **Create Event Subscription** page, name your event subscription and use default schema, Event Grid Schema.
   
6. Under **EVENT TYPES**, choose Blob Inventory Completed.

7. Under **ENDPOINT DETAILS**, choose Storage Queue as the Endpoint Type and select **Configure an endpoint**.
  
8. In the **Queues** page, choose the subscription, the storage account and create a new queue. Name your queue then click **Create**.

9. Optionally, select the **Filters** tab if you want to filter the subject of the event or its attributes.

10. Optionally, select the **Additional Features** tab if you want to enable dead-lettering, retry policies and set event subscription expiration time.

11. Optionally, select **Delivery Properties** tab to set the storage queue message time to live.

12. Select **Create**

**To view the delivered queue messages**

1. Locate your storage account and display the account overview.

2. Under **Data Storage**, select **Queues** and open the newly create queue used to configure the endpoint to access the messages.

3. Select the message for the desired inventory run time to access the message properties the review the message body for the event status.

For more methods on how to subscribe to blob storage events, see [Azure Blob Storage as Event Grid source - Azure Event Grid | Microsoft Learn](../../event-grid/event-schema-blob-storage.md)
 
## Optionally enable access time tracking

You can choose to enable blob access time tracking. When access time tracking is enabled, inventory reports will include the **LastAccessTime** field based on the time that the blob was last accessed with a read or write operation. To minimize the effect on read access latency, only the first read of the last 24 hours updates the last access time. Subsequent reads in the same 24-hour period don't update the last access time. If a blob is modified between reads, the last access time is the more recent of the two values.

### [Portal](#tab/azure-portal)

To enable last access time tracking with the Azure portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Locate your storage account and display the account overview.

3. Under **Data management**, select **Blob inventory**.

4. Select **Blob inventory settings**, and in the **Blob inventory settings** pane, select the **Enable last access tracking** checkbox.

   > [!div class="mx-imgBorder"]
   > ![Screenshot showing how to enable last access time tracking of the blob inventory settings by using the Azure portal.](./media/blob-inventory-how-to/portal-blob-inventory-last-access-time.png)

### [PowerShell](#tab/azure-powershell)

[!INCLUDE [azure-storage-set-last-access-time-powershell](../../../includes/azure-storage-set-last-access-time-powershell.md)]

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [azure-storage-set-last-access-time-azure-cli](../../../includes/azure-storage-set-last-access-time-azure-cli.md)]

---

## Next steps

- [Calculate the count and total size of blobs per container](calculate-blob-count-size.yml)
- [Tutorial: Analyze blob inventory reports](storage-blob-inventory-report-analytics.md)
- [Manage the Azure Blob Storage lifecycle](./lifecycle-management-overview.md)
