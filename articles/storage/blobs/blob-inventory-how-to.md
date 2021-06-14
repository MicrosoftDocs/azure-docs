---
title: Enable Azure Storage blob inventory reports (preview)
description: Obtain an overview of your containers, blobs, snapshots, and blob versions within a storage account.
services: storage
author: normesta

ms.service: storage
ms.date: 06/02/2021
ms.topic: how-to
ms.author: normesta
ms.reviewer: klaasl
ms.subservice: blobs
---

# Enable Azure Storage blob inventory reports (preview)

The Azure Storage blob inventory feature provides an overview of your containers, blobs, snapshots, and blob versions within a storage account. Use the inventory report to understand various attributes of blobs and containers such as your total data size, age, encryption status, immutability policy, and legal hold and so on. The report provides an overview of your data for business and compliance requirements. 

To learn more about blob inventory reports, see [Azure Storage blob inventory (preview)](blob-inventory.md).

Enable blob inventory reports by adding a policy with one or more rules to your storage account. Add, edit, or remove a policy by using the [Azure portal](https://portal.azure.com/).

## Enable inventory reports

### [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/) to get started.

2. Locate your storage account and display the account overview.

3. Under **Data management**, select **Blob inventory (preview)**.

4. Select **Add your first inventory rule**.

   The **Add a rule** page appears.

5. In the **Add a rule** page, name your new rule.

6. Choose a container.

7. Under **Object type to inventory**, choose whether to create a report for blobs or containers.

   If you select **Blob**, then under **Blob subtype**, choose the types of blobs that you want to include in your report, and whether to include blob versions and/or snapshots in your inventory report. 

   > [!NOTE]
   > Versions and snapshots must be enabled on the account to save a new rule with the corresponding option enabled.

8. Select the fields that you would like to include in your report, and the format of your reports.

9. Choose how often you want to generate reports.

9. Optionally, add a prefix match to filter blobs in your inventory report.

10. Select **Save**.

    :::image type="content" source="./media/blob-inventory-how-to/portal-blob-inventory.png" alt-text="Screenshot showing how to add a blob inventory rule by using the Azure portal":::

### [PowerShell](#tab/azure-powershell)

<a id="powershell"></a>

You can enable static website hosting by using the Azure PowerShell module.

1. Open a Windows PowerShell command window.

2. Verify that you have Azure PowerShell module Az version 0.7 or later.

   ```powershell
   Get-InstalledModule -Name Az -AllVersions | select Name,Version
   ```

   If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps).

3. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

4. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that will host your static website.

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

   * Replace the `<resource-group-name>` placeholder value with the name of your resource group.

   * Replace the `<storage-account-name>` placeholder value with the name of your storage account.

### [Azure CLI](#tab/azure-cli)

<a id="cli"></a>

You can enable static website hosting by using the [Azure Command-Line Interface (CLI)](/cli/azure/).

1. First, open the [Azure Cloud Shell](../../cloud-shell/overview.md), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that will host your static website.

   ```azurecli-interactive
   az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

---

## Next steps

- [Azure Storage blob inventory (preview)](blob-inventory.md)
- [Calculate the count and total size of blobs per container](calculate-blob-count-size.md)
- [Manage the Azure Blob Storage lifecycle](storage-lifecycle-management-concepts.md)
