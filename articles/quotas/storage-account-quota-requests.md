---
title: Increase Azure Storage account quotas
description: Learn how to request an increase in the quota limit for Azure Storage accounts within a subscription from 250 to 500 for a given region. Quota increases apply to both standard and premium account types.
ms.date: 05/02/2023
ms.topic: how-to
---

# Increase Azure Storage account quotas

This article shows how to request increases for storage account quotas from the [Azure portal](https://portal.azure.com) or from **My quotas**, a centralized location where you can view your quota usage and request quota increases.

To quickly request an increase, select **Quotas** on the Home page in the Azure portal.

:::image type="content" source="media/storage-account-quota-requests/quotas-icon.png" alt-text="Screenshot of the Quotas icon in the Azure portal.":::

If you don't see **Quotas** on in the Azure portal, type *quotas* in the search box, then select **Quotas**. The **Quotas** icon will then appear on your Home page the next time you visit.

You can also use the following tools or APIs to view your storage account quota usage and limits:

- [Azure PowerShell](/powershell/module/az.storage/get-azstorageusage)
- [Azure CLI](/cli/azure/storage/account#az-storage-account-show-usage)
- [REST API](/rest/api/storagerp/usages/list-by-location)

You can request an increase from 250 to up to 500 storage accounts per region for your subscription. This quota increase applies to storage accounts with standard endpoints.

## View current quotas for a region

To view your current storage account quotas for a subscription in a given region, follow these steps:

1. From the [Azure portal](https://portal.azure.com), select **Quotas** and then select **Storage**.

1. Select your subscription from the drop-down.

1. Use the **Region** filter to specify the regions you're interested in. You can then see your storage account quotas for each of those regions.

    :::image type="content" source="media/storage-account-quota-requests/view-quotas-region-portal.png" alt-text="Screenshow showing how to filter on regions to show quotas for specific regions" lightbox="media/storage-account-quota-requests/view-quotas-region-portal.png":::

## Request storage account quota increases

Follow these steps to request a storage account quota increase from Azure Home.

1. From the [Azure portal](https://portal.azure.com), select **Quotas** and then select **Storage**.

1. Select the subscription for which you want to increase your storage account quota.

1. Locate the region where you want to increase your storage account quota, then select the **Request increase** icon.

1. In the **Request quota increase** dialog, enter a number up to 500.

    :::image type="content" source="media/storage-account-quota-requests/request-quota-increase-portal.png" alt-text="Screenshot showing how to increase your storage account quota":::

1. Select **Submit**. It may take a few minutes to process your request.

## See also

- [Scalability and performance targets for standard storage accounts](../storage/common/scalability-targets-standard-account.md)
- [Scalability targets for premium block blob storage accounts](../storage/blobs/scalability-targets-premium-block-blobs.md)
- [Scalability and performance targets for premium page blob storage accounts](../storage/blobs/scalability-targets-premium-page-blobs.md)
- [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md)
