---
 title: Include file
 description: Include file
 services: storage
 author: khdownie
 ms.service: azure-file-storage
 ms.topic: include
 ms.date: 07/11/2025
 ms.author: kendownie
 ms.custom: include file
---
Azure Files offers two media tiers of storage: solid-state disk (SSD) and hard disk drive (HDD). These tiers allow you to tailor your shares to the performance and price requirements of your scenario:

- **SSD (premium)**: SSD file shares provide consistent high performance and low latency, within single-digit milliseconds for most I/O operations, for I/O-intensive workloads. SSD file shares are suitable for a wide variety of workloads, like databases, website hosting, and development environments.

  You can use SSD file shares with both the SMB and NFS protocols. SSD file shares are available in the [provisioned v2](../articles/storage/files/understanding-billing.md#provisioned-v2-model) and [provisioned v1](../articles/storage/files/understanding-billing.md#provisioned-v1-model) billing models. SSD file shares offer a [higher availability SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services) than HDD file shares.

- **HDD (standard)**: HDD file shares provide a cost-effective storage option for general-purpose file shares. HDD file shares are available with the [provisioned v2](../articles/storage/files/understanding-billing.md#provisioned-v2-model) and [pay-as-you-go](../articles/storage/files/understanding-billing.md#pay-as-you-go-model) billing models, although we recommend the provisioned v2 model for new deployments of file shares. For information about the SLA, see the [Azure SLA page for online services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

When you're selecting a media tier for your workload, consider your performance and usage requirements. If your workload requires single-digit latency, or you're using SSD storage media on-premises, SSD file shares are probably the best fit. If low latency isn't as much of a concern, HDD file shares might be a better fit from a cost perspective. For example, low-latency might be less of a concern with team shares mounted on-premises from Azure or cached on-premises through Azure File Sync.

After you create a file share in a storage account, you can't directly move it to a different media tier. For example, to move an HDD file share to the SSD media tier, you must create a new SSD file share and [copy the data from your original share to the new file share](../articles/storage/files/migrate-files-between-shares.md).

You can find more information about the SSD and HDD media tiers in [Understand Azure Files billing models](../articles/storage/files/understanding-billing.md) and [Understand and optimize Azure file share performance](../articles/storage/files/understand-performance.md).
