---
title: Pacemaker Cluster SBD Shared Disk Overview
description: Include File for Pacemaker Cluster SBD Shared Disk Overview
services: 
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 08/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---
## Using SBD with Azure Shared Disk
By using [Azure Shared Disks][azdoc-vm-shared-disks], you can mount the same disk across all virtual machines that are part of the cluster. You can host your SBD device on that shared disk without extra infrastructure requirements.

:::image type="content" source="../../articles/sap/workloads/media/includes/high-availability-pacemaker-sbd-shared-disk-diagram.png" alt-text="Diagram of an Azure Shared Disk as an SBD device in a Pacemaker Cluster.":::

### Benefits
- Provides a native Azure shared block device option for SBD without requiring additional resources.
- Virtual machines attach the managed disk directly, reducing dependency on additional network considerations.

### Important considerations
- You can use an Azure shared disk with the `Premium SSD` SKU as an SBD device.
- Review the [List of Supported Operating Systems][azdoc-vm-shared-disks-supported-os].
- SBD devices that use an Azure premium shared disk support [locally redundant storage (LRS)][azdoc-vm-disk-lrs] and [zone-redundant storage (ZRS)][azdoc-vm-disk-zrs].
- Depending on the [type of your deployment][azdoc-sap-deployment-type], choose the appropriate redundant storage for an Azure shared disk as your SBD device.
   - An SBD device that uses LRS for Azure premium shared disk (skuName - Premium_LRS) supports only deployments in an availability set.
   - An SBD device that uses ZRS for an Azure premium shared disk (skuName - Premium_ZRS) is recommended for deployments in availability zones.
- The Azure shared disk that you use for SBD devices doesn't need to be large. The [maxShares][azdoc-vm-disk-share-max] value determines how many cluster nodes can use the shared disk. For example, you can use P1 or P2 disk sizes for your SBD device on a two-node cluster such as SAP ASCS/ERS or SAP HANA scale-up.
   - For clusters with more than two nodes, refer to the documented [maxShares][azdoc-vm-disk-share-max] for your selected disk.
- Don't attach an Azure shared disk SBD device across different Pacemaker clusters.
- If you use multiple Azure shared disk SBD devices, check on the limit for a maximum number of data disks that can be attached to a VM.
- For more information about limitations for Azure shared disks, carefully review the "Limitations" section of [Azure shared disk documentation][azdoc-vm-shared-disks-limitations].

[azdoc-vm-shared-disks-limitations]: /azure/virtual-machines/disks-shared#limitations
[azdoc-vm-shared-disks]: /azure/virtual-machines/disks-shared
[azdoc-vm-shared-disks-supported-os]: /azure/virtual-machines/disks-shared#linux
[azdoc-vm-disk-lrs]: /azure/virtual-machines/disks-redundancy#locally-redundant-storage-for-managed-disks
[azdoc-vm-disk-zrs]: /azure/virtual-machines/disks-redundancy#zone-redundant-storage-for-managed-disks
[azdoc-sap-deployment-type]: /azure/sap/workloads/sap-high-availability-architecture-scenarios#comparison-of-different-deployment-types-for-sap-workload
[azdoc-vm-disk-share-max]: /azure/virtual-machines/disks-shared-enable#disk-sizes
[azdoc-sap-hana-scale-out]: /azure/sap/workloads/sap-hana-high-availability-scale-out-hsr-suse