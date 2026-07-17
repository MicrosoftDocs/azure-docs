---
title: HA Cluster Deploy Azure NFS Solution
description: Include File for HA Cluster Deploy Azure NFS Solution
services: azure-files,azure-netapp-files
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 06/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---

### Deploy NFS on Azure Files

NFS on Azure Files runs on top of [Azure Files premium storage][azdoc-afs-intro]. Before you set up NFS on Azure Files, see [How to create an NFS share][azdoc-afs-create-share].

There are two options for redundancy within an Azure region:

- [Locally redundant storage (LRS)][azdoc-afs-lrs] offers local, in-zone synchronous data replication.
- [Zone-redundant storage (ZRS)][azdoc-afs-zrs] replicates your data synchronously across three [availability zones](/azure/reliability/availability-zones-overview) in the region.

Check if your selected Azure region offers Premium Azure Files with your required redundancy. Review the [availability of Azure Files by Azure region][azure-availability-matrix] for **Premium Files Storage**. If your scenario benefits from ZRS, [verify that premium file shares with ZRS are supported in your Azure region][azdoc-afs-zrs].

We recommend that you access your Azure storage account through an [Azure private endpoint][azdoc-afs-private-endpoints]. Be sure to deploy the Azure Files storage account endpoint, and the VMs where you need to mount the NFS shares, in the same Azure virtual network or in a peered Azure virtual network.

1. Deploy an Azure Files storage account named **sapnfsafs**. This example uses ZRS. If you're not familiar with the process, see [Create a storage account][azdoc-afs-create-account] for the Azure portal.
1. On the **Basics** tab, use these settings:
   1. For **Storage account name**, enter **sapnfsafs**.
   1. For **Performance**, select **Premium**.
   1. For **Premium account type**, select **FileStorage**.
   1. For **Replication**, select **Zone redundancy (ZRS)**.
1. Select **Next**.
1. On the **Advanced** tab, clear **Require secure transfer for REST API**. If you don't clear this option, you can't mount the NFS share to your VM (the mount operation times out).
1. Select **Next**.
1. In the **Networking** section, configure these settings:
   1. Under **Networking connectivity**, for **Connectivity method**, select **Private endpoint**.
   1. Under **Private endpoint**, select **Add private endpoint**.
1. On the **Create private endpoint** pane, select your subscription, resource group, and location. Then make the following selections:
   1. For **Name**, enter **sapnfsafs_pe**.
   1. For **Storage sub-resource**, select **file**.
   1. Under **Networking**, for **Virtual network**, select the virtual network and subnet to use. Again, you can use either the virtual network where your SAP VMs are or a peered virtual network.
   1. Under **Private DNS integration**, accept the default option of **Yes** for **Integrate with private DNS zone**. Be sure to select your private DNS zone.
   1. Select **OK**.
1. On the **Networking** tab again, select **Next**.
1. On the **Data protection** tab, keep all the default settings.
1. Select **Review + create** to validate your configuration.
1. Wait for the validation to finish. Fix any issues before continuing.
1. On the **Review + create** tab, select **Create**.

Next, deploy the NFS shares in the storage account that you created. In this example, there are two NFS shares, `sapnw1` and `saptrans`.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select or search for **Storage accounts**.
1. On the **Storage accounts** page, select **sapnfsafs**.
1. On the resource menu for **sapnfsafs**, select **File shares** under **Data storage**.
1. On the **File shares** page, select **File share**, and then:
   1. For **Name**, enter `**sapnw1**`, `**saptrans**`.
   1. Select an appropriate share size. Consider the size of the data stored on the share, I/O per second (IOPS), and throughput requirements. For more information, see [Azure file share targets][azdoc-afs-scaling].
   1. Select **NFS** as the protocol.
   1. Select **No root Squash**. Otherwise, when you mount the shares on your VMs, you can't see the file owner or group.

> [!Note]
> Azure Files NFS supports Encryption in Transit (EiT). If you would like to use EiT, read [Azure Files NFS Encryption in Transit for SAP on Azure Systems][azdoc-afs-encryption-in-transit] to learn how to configure and deploy.

#### Important considerations for NFS on Azure Files shares

When you plan your deployment with NFS on Azure Files, consider the following important points:

- The minimum share size is 100 GiB. You pay for only the [capacity of the provisioned shares][azdoc-afs-billing].
- Size your NFS shares not only based on capacity requirements, but also on IOPS and throughput requirements. For details, see [Azure file share targets][azdoc-afs-share-limits].
- Test the workload to validate your sizing and ensure that it meets your performance targets. To learn how to troubleshoot performance issues with NFS on Azure Files, consult [Troubleshoot Azure file share performance][azdoc-afs-perf-troubleshooting].
- For SAP J2EE systems, placing `/usr/sap/<SID>/J<nr>` on NFS on Azure Files isn't supported.
- If your SAP system has a heavy load of batch jobs, you might have millions of job logs. If the SAP batch job logs are stored in the file system, pay special attention to the sizing of the `sapmnt` share. As of SAP_BASIS 7.52, the default behavior for the batch job logs is to be stored in the database. For details, see [Job sign in the database][sapnote-2360818-JobLog].
- Deploy a separate `sapmnt` share for each SAP system.
- Don't use the `sapmnt` share for any other activity, such as interfaces.
- Don't use the `saptrans` share for any other activity, such as interfaces.
- Avoid consolidating the shares for too many SAP systems in a single storage account. There are also [scalability and performance targets for storage accounts][azdoc-afs-share-limits]. Be careful to not exceed the limits for the storage account, too.
- In general, don't consolidate the shares for more than _five_ SAP systems in a single storage account. This guideline helps you avoid exceeding the storage account limits and simplifies performance analysis.
- In general, avoid mixing shares like `sapmnt` for nonproduction and production SAP systems in the same storage account.
- Ensure your Linux Kernel is above v5.12.5 to avoid the bug mentioned in [NFS client improvements][azdoc-afs-nfs-client-improvements].
- Use a private endpoint. In the unlikely event of a zonal failure, your NFS sessions automatically redirect to a healthy zone. You don't have to remount the NFS shares on your VMs.
- If you're deploying your VMs across availability zones, use a [storage account with ZRS][azdoc-afs-zrs] in the Azure regions that supports ZRS.
- Azure Files doesn't currently support automatic cross-region replication for disaster recovery scenarios.

The SAP file systems that don't need to be mounted via NFS can also be deployed on [Azure disk storage](/azure/virtual-machines/disks-types#premium-ssds). In this example, you can deploy `/usr/sap/NW1/D02` and `/usr/sap/NW1/D03` on Azure disk storage.

[azure-availability-matrix]: https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table

[azdoc-afs-intro]: ../../articles/storage/files/storage-files-introduction.md
[azdoc-afs-create-share]: ../../articles/storage/files/create-file-share.md
[azdoc-afs-scaling]: ../../articles/storage/files/storage-files-scale-targets.md
[azdoc-afs-encryption-in-transit]: ../../articles/sap/workloads/sap-azure-files-nfs-encryption-in-transit-guide.md
[azdoc-afs-billing]: ../../articles/storage/files/understanding-billing.md#provisioned-v1-model
[azdoc-afs-share-limits]: ../../articles/storage/files/storage-files-scale-targets.md
[azdoc-afs-perf-troubleshooting]: ../../articles/storage/files/files-troubleshoot-performance.md
[azdoc-afs-nfs-client-improvements]: ../../articles/storage/files/files-troubleshoot-linux-nfs.md#ls-hangs-for-large-directory-enumeration-on-some-kernels
[azdoc-afs-create-account]: ../../articles/storage/files/storage-how-to-create-file-share.md?tabs=azure-portal#create-a-storage-account
[azdoc-afs-private-endpoints]: ../../articles/storage/files/storage-files-networking-endpoints.md?tabs=azure-portal
[azdoc-afs-lrs]: ../../articles/storage/common/storage-redundancy.md#locally-redundant-storage
[azdoc-afs-zrs]: ../../articles/storage/common/storage-redundancy.md#zone-redundant-storage



[sapnote-2360818-JobLog]: https://me.sap.com/notes/2360818