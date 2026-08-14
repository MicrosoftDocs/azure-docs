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

### Deploy Azure NetApp Files

[Azure NetApp Files][azdoc-anf-intro] is a native, first-party, high-performance file storage service that provides volumes as a service. Here we're using it to host our NFS SAP shares.

1. Check that the Azure NetApp Files service is available in your [Azure region of choice][azure-availability-matrix].
1. [Create the NetApp account][azdoc-anf-create-account] in the selected Azure region.
1. [Create a capacity pool for Azure NetApp Files][azdoc-anf-create-capacitypool].

   The SAP NetWeaver architecture presented in this article uses a single Azure NetApp Files capacity pool, Premium SKU. We recommend Azure NetApp Files Premium SKU for SAP NetWeaver application workloads on Azure.

1. [Delegate a subnet to Azure NetApp Files][azdoc-anf-delegate-subnet].
1. [Create an NFS volume for Azure NetApp Files][azdoc-anf-create-volume]. Deploy the volumes in the designated Azure NetApp Files [subnet](/rest/api/virtualnetwork/subnets). The IP addresses of the Azure NetApp volumes are assigned automatically.

   Keep in mind that the Azure NetApp Files resources and the Azure VMs must be in the same Azure virtual network or in peered Azure virtual networks. This example uses two Azure NetApp Files volumes: `sapnw1` and `trans`. The file paths that are mounted to the corresponding mount points are:

   - Volume `sapnw1` (`nfs://10.27.1.5/sapnw1/sapmntNW1`)
   - Volume `sapnw1` (`nfs://10.27.1.5/sapnw1/usrsapNW1`)
   - Volume `trans` (`nfs://10.27.1.5/trans`)

#### Important considerations for NFS on Azure NetApp Files

When you're considering Azure NetApp Files for the SAP NetWeaver high-availability architecture, be aware of the following important considerations:

- The minimum capacity pool is 4 tebibytes (TiB). You can increase the size of the capacity pool in 1-TiB increments.
- The minimum volume is 100 GiB.
- Azure NetApp Files, and all virtual machines where Azure NetApp Files volumes are mounted, must be in the same Azure virtual network. If they're not in the same virtual network, they must be in [peered virtual networks][azdoc-vnet-peering] in the same region. Azure NetApp Files access over virtual network peering in the same region is supported. Azure NetApp Files access over global peering isn't yet supported.
- The selected virtual network must have a delegated subnet to Azure NetApp Files.
- The throughput and performance characteristics of an Azure NetApp Files volume is a function of the volume quota and service level, as documented in [Service level for Azure NetApp Files][azdoc-anf-service-levels]. When you're sizing the Azure NetApp Files volumes for SAP, make sure that the resulting throughput meets the application's requirements.
- Azure NetApp Files offers an [export policy][azdoc-anf-export-policy]. You can control the allowed clients and the access type (for example, read/write or read-only).
- Azure NetApp Files isn't zone aware yet. Currently, Azure NetApp Files isn't deployed in all availability zones in an Azure region. Be aware of the potential latency implications in some Azure regions.
- Azure NetApp Files volumes can be deployed as NFSv3 or NFSv4.1 volumes. Both protocols are supported for the SAP application layer (ASCS/ERS, SAP application servers).

---

The SAP file systems that don't need to be mounted via NFS can also be deployed on [Azure disk storage](/azure/virtual-machines/disks-types#premium-ssds). In this example, you can deploy `/usr/sap/NW1/D02` and `/usr/sap/NW1/D03` on Azure disk storage.

[azure-availability-matrix]: https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table

[azdoc-afs-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=storage&regions=all
[azdoc-afs-intro]: ../../articles/storage/files/storage-files-introduction.md
[azdoc-afs-create-share]: ../../articles/storage/files/create-file-share.md
[azdoc-afs-scaling]: ../../articles/storage/files/storage-files-scale-targets.md
[azdoc-afs-encryption-in-transit]: ../../articles/sap/workloads/sap-azure-files-nfs-encryption-in-transit-guide.md
[azdoc-afs-billing]: ../../articles/storage/files/understanding-billing.md#provisioned-v1-model
[azdoc-afs-share-limits]: ../../articles/storage/files/storage-files-scale-targets.md
[azdoc-afs-perf-troubleshooting]: ../../articles/storage/files/files-troubleshoot-performance.md
[azdoc-afs-nfs-overview]: ../../articles/storage/files/files-nfs-protocol.md
[azdoc-afs-nfs-client-improvements]: ../../articles/storage/files/files-troubleshoot-linux-nfs.md#ls-hangs-for-large-directory-enumeration-on-some-kernels
[azdoc-afs-create-account]: ../../articles/storage/files/storage-how-to-create-file-share.md?tabs=azure-portal#create-a-storage-account
[azdoc-afs-private-endpoints]: ../../articles/storage/files/storage-files-networking-endpoints.md?tabs=azure-portal
[azdoc-afs-lrs]: ../../articles/storage/common/storage-redundancy.md#locally-redundant-storage
[azdoc-afs-zrs]: ../../articles/storage/common/storage-redundancy.md#zone-redundant-storage

[azdoc-anf-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=netapp
[azdoc-anf-intro]: ../../articles/azure-netapp-files/azure-netapp-files-introduction.md
[azdoc-anf-create-account]: ../../articles/azure-netapp-files/azure-netapp-files-create-netapp-account.md
[azdoc-anf-create-capacitypool]: ../../articles/azure-netapp-files/azure-netapp-files-set-up-capacity-pool.md
[azdoc-anf-delegate-subnet]: ../../articles/azure-netapp-files/azure-netapp-files-delegate-subnet.md
[azdoc-anf-create-volume]: ../../articles/azure-netapp-files/azure-netapp-files-create-volumes.md
[azdoc-anf-service-levels]: ../../articles/azure-netapp-files/azure-netapp-files-service-levels.md
[azdoc-anf-export-policy]: ../../articles/azure-netapp-files/azure-netapp-files-configure-export-policy.md

[azdoc-vnet-peering]: ../../articles/virtual-network/virtual-network-peering-overview.md

[sapnote-2360818-JobLog]: https://me.sap.com/notes/2360818