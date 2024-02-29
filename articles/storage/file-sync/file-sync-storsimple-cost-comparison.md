---
title: Comparing the costs of StorSimple to Azure File Sync
description: Learn how you can save money and modernize your storage infrastructure by migrating from StorSimple to Azure File Sync.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 01/12/2023
ms.author: kendownie
---

# Comparing the costs of StorSimple to Azure File Sync
StorSimple is a discontinued physical and virtual appliance product offered by Microsoft to help customers manage their on-premises storage footprint by tiering data to Azure. 

> [!NOTE]
> The StorSimple Service (including the StorSimple Device Manager for 8000 and 1200 series and StorSimple Data Manager) has reached the end of support. The end of support for StorSimple was published in 2019 on the [Microsoft LifeCycle Policy](/lifecycle/products/?terms=storsimple) and [Azure Communications](https://azure.microsoft.com/updates/storsimpleeol/) pages. Additional notifications were sent via email and posted on the Azure portal and in the [StorSimple overview](../../storsimple/storsimple-overview.md). Contact [Microsoft Support](https://azure.microsoft.com/support/create-ticket/) for additional details.

For most use cases of StorSimple, Azure File Sync is the recommended migration target for file shares being used with StorSimple. Azure File Sync supports similar capabilities to StorSimple, such as the ability to tier to the cloud. However, it provides additional features that StorSimple does not have, such as:

- Storing data in a native file format accessible to administrators and users (Azure file shares) instead of a proprietary format only accessible through the StorSimple device
- Multi-site sync
- Integration with Azure services such as Azure Backup and Microsoft Defender for Storage

To learn more about Azure File Sync, see [Introduction to Azure File Sync](file-sync-introduction.md). To learn how to seamlessly migrate to Azure File Sync from StorSimple, see [StorSimple 8100 and 8600 migration to Azure File Sync](../files/storage-files-migration-storsimple-8000.md) or [StorSimple 1200 migration to Azure File Sync](../files/storage-files-migration-storsimple-1200.md).

Although Azure File Sync supports additional functionality not supported by StorSimple, administrators familiar with StorSimple may be concerned about how much Azure File Sync will cost relative to their current solution. This document covers how to compare the costs of StorSimple to Azure File Sync to correctly determine the costs of each. Although the cost situation may vary by customer depending on the customer's usage and configuration of StorSimple, most customers will pay the same or less with Azure File Sync than they currently pay with StorSimple.

## Cost comparison principles
To ensure a fair comparison of StorSimple to Azure File Sync and other services, you must consider the following principles:

- **All costs of the solutions are accounted for.** Both StorSimple and Azure File Sync have multiple cost components. To do a fair comparison, all cost components must be considered.

- **Cost comparison doesn't include the cost of features StorSimple doesn't support.** Azure File Sync supports multiple features that StorSimple does not. Some of the features of Azure File Sync, like multi-site sync, might increase the total cost of ownership of an Azure File Sync solution. It is reasonable to take advantage of new features as part of a migration; however, this should be viewed as an upgrade benefit of moving to Azure File Sync. Therefore, you should compare the costs of StorSimple and Azure File Sync *before* considering adopting new capabilities of Azure File Sync that StorSimple doesn't have.

- **Cost comparison considers as-is configuration of StorSimple.** StorSimple supports multiple configurations that might increase or decrease the price of a StorSimple solution. To perform a fair cost comparison to Azure File Sync, you should consider only your current configuration of StorSimple. For example:
    - **Use the same redundancy settings when comparing StorSimple and Azure File Sync.** If your StorSimple solution uses locally redundant storage (LRS) for its storage usage in Azure Blob storage, you should compare it to the cost of locally redundant storage in Azure Files, even if you would like to switch to zonally redundant (ZRS) or geo-redundant (GRS) storage when you adopt Azure File Sync.

    - **Use the Azure Blob storage pricing you are currently using.** Azure Blob storage supports a v1 and a v2 pricing model. Most StorSimple customers would save money if they adopted the v2 pricing; however, most StorSimple customers are currently using the v1 pricing. Because StorSimple is going away, to perform a fair comparison, use the pricing for the pricing model you are currently using.

## StorSimple pricing components
StorSimple has the following pricing components that you should consider in the cost comparison analysis:

- **Capital and operational costs of servers fronting/running StorSimple.** Capital costs relate to the upfront cost of the physical, on-premises hardware, while operating costs relate to ongoing costs you must bear to run your solution, such as labor, maintenance, and power costs. Capital costs vary slightly depending on whether you have a StorSimple 8000 series appliance or a StorSimple 1200 series appliance:
    - **StorSimple 8000 series.** StorSimple 8000 series appliances are physical appliances that provide an iSCSI target that must be fronted by a file server. Although you may have purchased and configured this file server a long time ago, you should consider the capital and operational costs of running this server, in addition to the operating costs of running the StorSimple appliance. If your file server is hosted as a virtual machine (VM) on an on-premises hypervisor that hosts other workloads, to capture the opportunity cost of running the file server instead of other workloads, you should consider the file server VM as a fractional cost of the capital expenditure and operating costs for the host, in addition to the operating costs of the file server VM. Finally, you should include the cost of any StorSimple 8000 series virtual appliances and other VMs you might have deployed in Azure.

    - **StorSimple 1200 series.** StorSimple 1200 series appliances are virtual appliances that you can run on-premises in the hypervisor of your choice. StorSimple 1200 series appliances can be an iSCSI target for a file server or can directly be a file server without the need for an additional server. If you have the StorSimple 1200 series appliance configured as an iSCSI target, you should include both the cost of hosting the virtual appliance and the cost of the file server fronting it. Although your StorSimple 1200 series appliance may be hosted on a hypervisor that hosts other workloads, to capture the opportunity cost of running the StorSimple 1200 series appliance instead of other workloads, you should consider the virtual appliance as a fractional cost of the capital expenditure of the host, in addition to the operating costs of the virtual appliance.

- **StorSimple service costs.** The StorSimple management service in Azure is a major component of most customers' Azure bill for StorSimple. There are two billing models for the StorSimple management service. Which one you are using likely depends on how and when you purchased your StorSimple appliance (consult your bill for more detail):
    - **StorSimple management fee per GiB of storage.** The StorSimple management fee per GiB of storage is the older billing model, and the one that most customers are using. In this model, you are charged for every logical GiB stored in StorSimple. You can see the price of management fee per GiB of storage on [the StorSimple pricing page](https://azure.microsoft.com/pricing/details/storsimple/), beneath the first table in the text (described as the "old pricing model"). It is important to note that the pricing page commentary is incorrect - customers were not transitioned to the per device billing model in December 2021.

    - **StorSimple management fee per device.** The StorSimple management fee per device is the newer model, but fewer customers are using it. In this model, you are charged a daily fee for each day you have your device active. The fee expense depends on whether you have a physical or virtual appliance, and which specific appliance you have. You can see the price of management fee per device on [the StorSimple pricing page](https://azure.microsoft.com/pricing/details/storsimple/) (first table).

- **Azure Blob storage costs.** StorSimple stores all of the data in its proprietary format in Azure Blob storage. When considering your Azure Blob storage costs, you should consider the storage utilization, which may be less or equal to the logical size of your data due to deduplication and compression done as part of StorSimple's proprietary data format, and also the transaction on storage, which is done whenever files are changed or ranges are recalled to on-premises from the device. Depending on when you deployed your StorSimple appliance, you may be subject to one of two blob storage pricing models:
    - **Blob storage pricing v1, available in general purpose version 1 storage accounts.** Based on the age of most StorSimple deployments, most StorSimple customers are using the v1 Azure Blob storage pricing. This pricing has higher per GiB prices and lower transaction prices than the v2 model, and lacks the storage tiers that the Blob storage v2 pricing has. To see the Blob storage v1 prices, visit the [Azure Blob storage pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/) and select the *Other* tab.

    - **Blob storage pricing v2, available in general purpose version 2 storage accounts.** Blob storage v2 has lower GiB prices and higher transaction prices than the v1 model. Although some StorSimple customers could save money by switching to the v2 pricing, most StorSimple customers are currently using the v1 pricing. Since StorSimple is reaching end of life, you should stay with the pricing model that you are currently using, rather than pricing out the cost comparison with the v2 pricing. To see the Blob storage v2 prices, visit the [Azure Blob storage pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/) and select the **Recommended** tab (the default when you load the page).

## Azure File Sync pricing components
Azure File Sync has the following pricing components you should consider in the cost comparison analysis:

[!INCLUDE [storage-file-sync-cost-categories](../../../includes/storage-file-sync-cost-categories.md)]

### Translating quantities from StorSimple
If you are trying to estimate the costs of Azure File Sync based on the expenses you see in StorSimple, be careful with the following items:

- **Azure Files bills on logical size (standard file shares).** Unlike StorSimple, which encodes your data in the StorSimple proprietary format before storing it to Azure Blob storage, Azure Files stores the data from Azure File Sync in the same form as you see it on your Windows File Server. This means that if you are trying to figure out how much storage you will consume in Azure Files, you should look at the logical size of the data from StorSimple, rather than the amount stored in Azure Blob storage. Although this may look like it will cause you to pay more when using Azure File Sync, you need to do the complete analysis including all aspects of StorSimple costs to see the true comparison. Additionally, Azure Files offers reservations that enable you to buy storage at an up-to 36% discount over the list price. See [Reservations in Azure Files](../files/understanding-billing.md#reservations).

- **Don't assume a 1:1 ratio between transactions on StorSimple and transactions in Azure File Sync.** It might be tempting to look at the number of transactions done by StorSimple in Azure Blob storage and assume that number will be similar to the number of transactions that Azure File Sync will do on Azure Files. This number may overstate or understate the number of transactions Azure File Sync will do, so it's not a good way to estimate transaction costs. The best way to estimate transaction costs is to do a small proof-of-concept in Azure File Sync with a live file share similar to the file shares stored in StorSimple.

## See also
- [Azure Files pricing page](https://azure.microsoft.com/pricing/details/storage/files/)
- [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md)
- [Create a file share](../files/storage-how-to-create-file-share.md?toc=/azure/storage/file-sync/toc.json) and [Deploy Azure File Sync](../file-sync/file-sync-deployment-guide.md)
