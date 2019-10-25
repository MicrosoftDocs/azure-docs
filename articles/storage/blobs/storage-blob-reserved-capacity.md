---
title: Optimize costs for Blob storage with reserved capacity in Azure Storage 
description: Learn how to list blob containers in your Azure Storage account using the .NET client library.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 11/01/2019
ms.author: tamram
ms.subservice: blobs
---

# Optimize costs for block blobs and Azure Data Lake Storage Gen2 with reserved capacity

You can save money on storage costs for blob data with Azure Storage reserved capacity. Azure Storage reserved capacity offers you a discount on capacity for block blobs and for Azure Data Lake Storage Gen2 data in standard storage accounts when you commit to a reservation for either one year or three years. A reservation provides a fixed amount of storage capacity for the term of the reservation.

Azure Storage reserved capacity can significantly reduce your capacity costs for block blobs and Azure Data Lake Storage Gen2 data. Depending on the duration of your reservation, the total capacity you choose to reserve, and the access tier that you've chosen for your storage account, you can save up to 38% on capacity costs over pay-as-you-go rates (???do we want to provide a number here???). Reserved capacity provides a billing discount and doesn't affect the state of your Azure Storage resources.

## Reservation terms for Azure Storage

You can purchase Azure Storage reserved capacity in units of 100 TiB and 1 PiB per month for a one-year or three-year term. Azure Storage reserved capacity is available for a single subscription or for a shared resource group. When you purchase Azure Storage reserved capacity, you can use your reservation for both block blob and Azure Data Lake Storage Gen2 data.

An Azure Storage reservation covers only the amount of data that is stored in a subscription or shared resource group. It doesn't cover bandwidth or request rate charges. As soon as you buy a reservation, the capacity charges that match the reservation attributes are charged at the discount rates instead of at the pay-as-you go rates. For more information on Azure reservations, see [What are Azure Reservations?](/azure/billing/billing-save-compute-costs-reservations).

Azure Storage reserved capacity is available for standard storage accounts, including general-purpose v2 (GPv2), general-purpose v1 (GPv1), and Blob storage accounts. All access tiers (hot, cool, and archive) and redundancy options are supported. For information about which regions support Azure Storage reserved capacity, see [Azure Products by region](/global-infrastructure/services/). (???we only support a limited number of regions, correct? can we point here for the list???)

When a reservation expires, Azure Storage capacity is billed at the pay-as-you go rate. Reservations don't renew automatically.

Reserved capacity is not available for premium storage accounts, page blobs, Azure Queue storage, Azure Table storage, Azure Files, managed disks, or unmanaged disks.  

## Determine required capacity before purchase

When you purchase an Azure Storage reservation, you must choose the region, access tier, and redundancy option for the reservation. Your reservation is valid only for data stored in that region, access tier, and redundancy level. For example, suppose you purchase a reservation for data in US West for the hot tier using zone-redundant storage (ZRS). You cannot use the same reservation for data in US East, data in the archive tier, or data in geo-redundant storage (GRS). However, you can purchase another reservation for your additional needs.  

Reservations are available today for 100 TiB or 1 PiB blocks, with higher discounts for 1 PiB blocks. When you purchase a reservation in the Azure portal, Microsoft may provide you with recommendations based on your previous usage to help determine which reservation you should purchase.

## Buy Azure Storage reserved capacity

You can purchase Azure Storage reserved capacity through the [Azure portal](https://portal.azure.com). Pay for the reservation up front or with monthly payments. For more information about purchasing with monthly payments, see [Purchase Azure reservations with up front or monthly payments](/azure/billing/billing-monthly-payments-reservations).

To purchase reserved capacity (???are these requirements true for storage???):

- You must be in the **Owner** role for at least one Enterprise or individual subscription with pay-as-you-go rates.
- For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the EA portal. Or, if that setting is disabled, you must be an EA Admin on the subscription.
- For the Cloud Solution Provider (CSP) program, only admin agents or sales agents can buy Azure Cosmos DB reserved capacity.

Follow these steps to purchase reserved capacity:

1. Sign in to the [Azure portal](https://portal.azure.com).  
1. Select **All services** > **Reservations** > **Add**. 
1. From the **Purchase reservations** pane, choose **Azure Blob Storage** to buy a new reservation.  
1. Fill in the required fields as described in the following table:

   |Field  |Description  |
   |---------|---------|
   |**Scope**   |  Indicates how many subscriptions can use the billing benefit associated with the reservation. It also controls how the reservation is applied to specific subscriptions. <br/><br/> If you select **Shared**, the reservation discount is applied to Azure Storage capacity in any subscription within your billing context. The billing context is based on how you signed up for Azure. For enterprise customers, the shared scope is the enrollment and includes all subscriptions within the enrollment. For pay-as-you-go customers, the shared scope includes all individual subscriptions with pay-as-you-go rates created by the account administrator.  <br/><br/>  If you select **Single subscription**, the reservation discount is applied to Azure Storage capacity in the selected subscription. <br/><br/> If you select **Single resource group**, the reservation discount is applied to Azure Storage capacity in the selected subscription and the selected resource group within that subscription. <br/><br/> You can change the reservation scope after you purchase the reservation.  |
   |**Subscription**  | The subscription that's used to pay for the Azure Storage reservation. The payment method on the selected subscription is used in charging the costs. The subscription must be one of the following types: <br/><br/>  Enterprise Agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P): For an Enterprise subscription, the charges are deducted from the enrollment's monetary commitment balance or charged as overage. <br/><br/> Individual subscription with pay-as-you-go rates (offer numbers: MS-AZR-0003P or MS-AZR-0023P): For an individual subscription with pay-as-you-go rates, the charges are billed to the credit card or invoice payment method on the subscription.    |
   | **Region** | The region where the reservation is in effect. |
   | **Access tier** | The access tier where the for which the reservation is in effect. Options include *Hot*, *Cool*, or *Archive*. For more information about access tiers, see [Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md). |
   | **Redundancy** | The redundancy option for the reservation. Options include *LRS*, *ZRS*, *GRS*, and *RA-GZRS*. For more information about redundancy options, see [Azure Storage redundancy](../common/storage-redundancy.md). |
   | **Billing frequency** | Indicates how often the account is billed for the reservation. Options include *Monthly* or *Upfront*. |
   | **Size** | The region where the reservation is in effect. |
   |**Term**  |   One year or three years.   |
