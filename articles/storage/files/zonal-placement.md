---
title: Zonal Placement for Azure File Shares
description: Learn to use zonal placement for Azure storage accounts so you can choose the specific availability zone for your SSD file shares.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 11/06/2025
ms.author: kendownie
ms.custom:
  - references_regions
# Customer intent: "As an IT admin, I want to use zonal placement for my storage account so I can select the specific Azure availability zone in which my SSD file shares will reside, potentially reducing latency and improving performance."
---

# Use zonal placement for Azure file shares

Zonal placement allows you to select the specific availability zone in which your Azure Files storage account resides. If desired, you can place your virtual machines (VMs) in the same zone to reduce latency between compute and storage.

This feature is currently available only for premium storage accounts (SSD media tier) using [locally redundant storage (LRS)](files-redundancy.md#locally-redundant-storage) in [supported regions](#region-support).

> [!NOTE]
> This article applies to classic Azure file shares only (Microsoft.Storage). Zonal placement isn't currently possible for file shares created with the Microsoft.FileShares resource provider (preview).

## Prerequisites

This article assumes that you have an Azure subscription. If you don't have an Azure subscription, then create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Region support

Zonal placement is supported for premium storage accounts with LRS redundancy in the following Azure regions:

- Asia East
- Canada Central
- Central US
- Chile Central
- East US
- Germany West Central
- Indonesia Central
- Israel Central
- Italy North
- Japan West
- Malaysia West
- Mexico Central
- New Zealand North
- Qatar Central
- Poland Central
- South Africa North
- South Central US
- Spain Central
- West US 2
- West US 3

## How zonal placement works

When creating a new premium storage account, you can create either a **regional** or **zonal** storage account. A zonal storage account is placed in a specific availability zone within a supported Azure region, offering guaranteed data locality. Zonal placement can also potentially reduce latency and improve performance for your workload if you place your compute resources (VMs) in the same zone as your storage account.

You can only specify a specific zone when creating a new storage account. Existing storage accounts can only be pinned to a zone selected by Azure. Once a storage account is pinned to a zone, it can only be moved back to a regional configuration. For example, if your storage account is pinned to zone 1, you can't move it to zone 2 or zone 3.

## Create a new zonal storage account

You can create a new zonal storage account using the Azure portal or PowerShell.

# [Portal](#tab/azure-portal)

Follow these steps to create a new zonal storage account using the Azure portal.

1. Sign in to the Azure portal.

1. Navigate to **Storage accounts** and select **+ Create**.

1. On the **Basics** tab, select the Azure subscription and resource group, or optionally create a new resource group.

1. Enter a name for the storage account. The name must be unique across all existing storage account names in Azure. It must be 3 to 24 characters long, and can contain only lowercase letters and numbers.

1. Select a region. Make sure it's on the [supported list](#region-support) for zonal placement.

1. Under **Preferred storage type**, select **Azure Files**.

1. Under **Performance**, select **Premium**.

1. Under **File share billing**, select the desired option.

1. Under **Redundancy**, select **Locally redundant storage (LRS)**.

1. If the selected region supports zonal placement, a **Zone options** dropdown appears. It offers three choices:

   - **None:** Creates a regional storage account.
   - **Self-selected zone:** Enables a secondary dropdown to select a specific availability zone (1, 2, or 3).
   - **Azure-selected zone:** Azure automatically assigns zone 1, 2, or 3.

    :::image type="content" source="media/zonal-placement/zone-options.png" alt-text="Screenshot showing the three different zonal placement options in the Azure portal." border="true":::

   Choose the desired option and proceed with storage account configuration.

1. When configuration is complete, select **Review + Create**, and then select **Create**.

# [PowerShell](#tab/azure-powershell)

You can use Azure PowerShell to create zonal or regional storage accounts. Replace `<resource-group>`, `<storage-account-name>`, and `<region>` with your desired values. For `<SkuName>`, specify either `Premium_LRS` for file shares or `PremiumV2_LRS` to provision capacity, throughput, and IOPS individually (Provisioned v2).

### Create a storage account in an Azure-selected zone

To create a storage account and have Azure automatically assign a zone, set `ZonePlacementPolicy` to **Any** by running the following command:

```azurepowershell
New-AzStorageAccount -ResourceGroupName <resource-group> -Name <storage-account-name> -Location <region> -SkuName <SkuName> -Kind FileStorage -ZonePlacementPolicy Any​
```

### Create a storage account in a self-selected zone

To create a storage account and specify an availability zone, run the following command:

```azurepowershell
New-AzStorageAccount -ResourceGroupName <resource-group> -Name <storage-account-name> -Location <region> -SkuName <SkuName> -Kind FileStorage -Zone <zone-number>
```

### Create a regional storage account

To create a regional (non-zonal) storage account, set `ZonePlacementPolicy` to **None** by running the following command:

```azurepowershell
New-AzStorageAccount -ResourceGroupName <resource-group> -Name <storage-account-name> -Location <region> -SkuName <SkuName> -Kind FileStorage -ZonePlacementPolicy None​
```

---


## Pin an existing storage account to an Azure-selected zone

You can also pin an existing premium storage account to an Azure-selected availability zone by using the Azure portal or PowerShell. Once pinned, the storage account won't be moved.

> [!IMPORTANT]
> Existing storage accounts can only be pinned to availability zones that are automatically selected by Azure. You can't choose a specific zone number.

# [Portal](#tab/azure-portal)

Follow these steps to pin an existing storage account to an Azure-selected zone using the Azure portal.

1. Sign in to the Azure portal and navigate to the premium storage account that you want to pin.

1. On the **Overview** tab, select **Availability**.

1. The **Move storage account availability zone** pane opens. A dropdown next to the storage account name appears with two options:

   - Azure-selected zone
   - None (to use the regional storage account configuration)

    :::image type="content" source="media/zonal-placement/move-availability-zone.png" alt-text="Screenshot of the Azure portal showing how to pin an existing storage account to an Azure-selected zone." lightbox="media/zonal-placement/move-availability-zone.png" border="true":::

1. Choose **Azure-selected zone**, and then select **Move**.

The storage account will now be pinned to the selected zone, as reflected in the **Availability** section on the **Overview** tab. 

# [PowerShell](#tab/azure-powershell)

To pin an existing storage account to an Azure-selected zone using Azure PowerShell, run the following commands. Replace `<resource-group>`, `<storage-account-name>`, and `<region>` with your values. For `<SkuName>`, specify either `Premium_LRS` or `PremiumV2_LRS`.

```azurepowershell
New-AzStorageAccount -ResourceGroupName <resource-group> -Name <storage-account-name> -Location <region> -SkuName <SkuName> -Kind FileStorage -ZonePlacementPolicy None​
Set-AzStorageAccount -ResourceGroupName <resource-group> -Name <storage-account-name> -ZonePlacementPolicy Any​
```

---

## Unpin a storage account from a zone

You can also unpin a storage account from a zone and then convert the zonal storage account to a regional storage account. This is a prerequisite if you want to move the storage account from LRS to zone-redundant storage (ZRS), for example. 

You can unpin a storage account from a zone by using the Azure portal or PowerShell.
 
# [Portal](#tab/azure-portal)

Follow these steps to unpin a zonal storage account from a zone using the Azure portal.

1. Sign in to the Azure portal and navigate to the zonal storage account that you want to unpin.

1. On the **Overview** tab, select **Availability**.

1. The **Move storage account availability zone** pane opens. A dropdown next to the storage account name appears with two options: 

   - Azure-selected zone
   - None (to use the regional storage account configuration)

    :::image type="content" source="media/zonal-placement/unpin-availability-zone.png" alt-text="Screenshot of the Azure portal showing how to unpin a storage account from an availability zone." lightbox="media/zonal-placement/unpin-availability-zone.png" border="true":::

1. Choose **None**, and then select **Move**.

The storage account will now be unpinned from the zone, as reflected in the **Availability** section on the **Overview** tab. If desired, you can now change the redundancy setting for the storage account from LRS to ZRS.

# [PowerShell](#tab/azure-powershell)

To unpin a zonal storage account from a zone using Azure PowerShell, run the following commands. Replace `<resource-group>`, `<storage-account-name>`, and `<region>` with your values. For `<SkuName>`, specify either `Premium_LRS` or `PremiumV2_LRS`.

```azurepowershell
New-AzStorageAccount -ResourceGroupName <resource-group> -Name <storage-account-name> -Location <region> -SkuName <SkuName> -Kind FileStorage -ZonePlacementPolicy Any​
Set-AzStorageAccount -ResourceGroupName <resource-group> -Name <storage-account-name> -ZonePlacementPolicy None​
```

---
