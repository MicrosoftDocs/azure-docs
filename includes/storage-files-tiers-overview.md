---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-file-storage
 ms.topic: include
 ms.date: 03/31/2024
 ms.author: kendownie
 ms.custom: include file
---
Azure Files offers two different media tiers of storage, SSD (solid-state disks) and HDD (hard disk drives), which allow you to tailor your shares to the performance and price requirements of your scenario:

- **SSD (premium)**: SSD file shares provide consistent high performance and low latency, within single-digit milliseconds for most IO operations, for IO-intensive workloads. SSD file shares are suitable for a wide variety of workloads like databases, web site hosting, and development environments. SSD file shares can be used with both Server Message Block (SMB) and Network File System (NFS) protocols. SSD file shares are available in the [provisioned v1](../articles/storage/files/understanding-billing.md#provisioned-v1-model) billing model. SSD file shares offer a [higher availability SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services) than HDD file shares (see "Azure Files Premium Tier").

- **HDD (standard)**: HDD file shares provide a cost-effective storage option for general purpose file shares. HDD file shares available with the [provisioned v2](../articles/storage/files/understanding-billing.md#provisioned-v2-model) and [pay-as-you-go](../articles/storage/files/understanding-billing.md#pay-as-you-go-model) billing models, although we recommend the provisioned v2 model for new file share deployments. For information about the SLA, see the [Azure service-level agreements page](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services) (see "Storage Accounts"). 

When selecting a media tier for your workload, consider your performance and usage requirements. If your workload requires single-digit latency, or you're using SSD storage media on-premises, SSD file shares tier are probably the best fit. If low latency isn't as much of a concern, for example with team shares mounted on-premises from Azure or cached on-premises using Azure File Sync, HDD file shares may be a better fit from a cost perspective.

Once you've created a file share in a storage account, you can't directly move it to a different media tier. For example, to move an HDD file share to the SSD media tier, you must create a new SSD file share and copy the data from your original share to a new file share in the FileStorage account. We recommend using AzCopy to copy data between Azure file shares, but you may also use tools like `robocopy` on Windows or `rsync` for macOS and Linux. 

See [Understanding Azure Files billing](../articles/storage/files/understanding-billing.md) for more information.