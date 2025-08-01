---
title: Create an Microsoft.FileShares
description: This article covers how to use the Azure portal, PowerShell, and Azure CLI to deploy a Microsoft.FileShares, change it performance and delete.
author: khdownie
ms.service: azure-file-storage
ms.custom: linux-related-content
ms.topic: tutorial
ms.date: 08/01/2025
ms.author: kendownie
# Customer intent: "I want to use this doc to learn what is Microsoft.FileShares is and how do I get started on creating one."
---

# Create an Microsoft.FileShares

Before you create an Microsoft.FileShares, you need to answer two questions about how you want to use it:

- **Is Microsoft.FileShares the right fit for me?**  
  **Microsoft.FileShares is a public preview feature.** Microsoft.FileShares currently offers only SSD (premium). SSD file shares provide consistent high performance and low latency, within single-digit milliseconds for most IO operations. Microsoft.FileShares currently only support on provisioned v2 billing model. In provisioned v2 billing model you specify how much storage, IOPS, and throughput your file share needs. The amount of each quantity that you provision determines your total bill. By default, when you create a new file share using the provisioned v2 model, we provide a recommendation for how many IOPS and how much throughput you need based on the amount of provisioned storage you specify. Depending on your individual file share requirements, you might find that you require more or less IOPS or throughput than our recommendations, and can optionally override these recommendations with your own values as desired. To learn more about the provisioned v2 model, see [Understanding the provisioned v2 billing model](./understanding-billing.md#provisioned-v2-model). If you need all existing features that Azure File offers, or you need SMB protocol, HDD (standard) performance, please choose file share (Classic) instead.

- **What are the redundancy requirements for your Microsoft.FileShares?**  
   Microsoft.FileShares are only available for the Local and Zone redundancy types. See [Azure Files redundancy](./files-redundancy.md) for more information.

For more information on Azure file share options, see [Planning for an Azure Files deployment](storage-files-planning.md).

## Applies to

| Management model     | Billing model  | Media tier     | Redundancy     |                SMB                |                 NFS                 |
| -------------------- | -------------- | -------------- | -------------- | :-------------------------------: | :---------------------------------: |
| Microsoft.FileShares | Provisioned v2 | SSD (premium)  | Local (LRS)    | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.FileShares | Provisioned v2 | SSD (premium)  | Zone (ZRS)     | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage    | Provisioned v2 | SSD (premium)  | Local (LRS)    | ![No](../media/icons/no-icon.png) |  ![No](../media/icons/no-icon.png)  |
| Microsoft.Storage    | Provisioned v2 | SSD (premium)  | Zone (ZRS)     | ![No](../media/icons/no-icon.png) |  ![No](../media/icons/no-icon.png)  |
| Microsoft.Storage    | Provisioned v2 | HDD (standard) | Local (LRS)    | ![No](../media/icons/no-icon.png) |  ![No](../media/icons/no-icon.png)  |
| Microsoft.Storage    | Provisioned v2 | HDD (standard) | Zone (ZRS)     | ![No](../media/icons/no-icon.png) |  ![No](../media/icons/no-icon.png)  |
| Microsoft.Storage    | Provisioned v2 | HDD (standard) | Geo (GRS)      | ![No](../media/icons/no-icon.png) |  ![No](../media/icons/no-icon.png)  |
| Microsoft.Storage    | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![No](../media/icons/no-icon.png) |  ![No](../media/icons/no-icon.png)  |
| Microsoft.Storage    | Provisioned v1 | SSD (premium)  | Local (LRS)    | ![No](../media/icons/no-icon.png) |  ![No](../media/icons/no-icon.png)  |
| Microsoft.Storage    | Provisioned v1 | SSD (premium)  | Zone (ZRS)     | ![No](../media/icons/no-icon.png) |  ![No](../media/icons/no-icon.png)  |
| Microsoft.Storage    | Pay-as-you-go  | HDD (standard) | Local (LRS)    | ![No](../media/icons/no-icon.png) |  ![No](../media/icons/no-icon.png)  |
| Microsoft.Storage    | Pay-as-you-go  | HDD (standard) | Zone (ZRS)     | ![No](../media/icons/no-icon.png) |  ![No](../media/icons/no-icon.png)  |
| Microsoft.Storage    | Pay-as-you-go  | HDD (standard) | Geo (GRS)      | ![No](../media/icons/no-icon.png) |  ![No](../media/icons/no-icon.png)  |
| Microsoft.Storage    | Pay-as-you-go  | HDD (standard) | GeoZone (GZRS) | ![No](../media/icons/no-icon.png) |  ![No](../media/icons/no-icon.png)  |

## Region Availability

Currently, Microsoft.FileShares are available in the following regions:

- Australia East
- East Asia
- Japan West
- Korea Central
- Southeast Asia
- North Europe
- East US
- South Africa West
- Australia Central
- Australia Southeast
- Korea South
- South India
- Germany North
- UAE central

## Prerequisites

- This article assumes that you have an Azure subscription. If you don't have an Azure subscription, then create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- If you intend to use Azure PowerShell, [install the latest version](/powershell/azure/install-azure-powershell).
- If you intend to use Azure CLI, [install the latest version](/cli/azure/install-azure-cli).

---

## Create a Microsoft.FileShares

# [Portal](#tab/azure-portal)

Follow these instructions to create a new Microsoft.FileShares using the Azure portal.

1.

# [PowerShell](#tab/azure-powershell)

# [Azure CLI](#tab/azure-cli)

---

## Change the cost and performance characteristics of a file share

# [Portal](#tab/azure-portal)

Follow these instructions to create a new Microsoft.FileShares using the Azure portal.

1.

# [PowerShell](#tab/azure-powershell)

# [Azure CLI](#tab/azure-cli)

---

## Delete a Microsoft.FileShares

# [Portal](#tab/azure-portal)

Follow these instructions to create a new Microsoft.FileShares using the Azure portal.

1.

# [PowerShell](#tab/azure-powershell)

# [Azure CLI](#tab/azure-cli)

---
