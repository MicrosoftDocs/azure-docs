---
title: Azure Site Recovery deployment planner on-premises storage requirement for  Hyper-V-to-Azure| Microsoft Docs
description: This article describes on-premises storage requirement details in the generated report using Azure Site Recovery deployment planner for Hyper-V to Azure scenario.
services: site-recovery
documentationcenter: ''
author: nsoneji
manager: garavd
editor:

ms.assetid:
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 11/27/2017
ms.author: nisoneji

---
#On-premises storage requirement

The worksheet provides the total free storage space requirement for each volume of the Hyper-V servers (where VHDs reside) for successful initial replication and delta replication. Before enabling replication, add required storage space on the volumes to ensure that the replication will not cause any undesirable downtime of your production applications. 

Site Recovery deployment planner identifies the optimal storage space requirement based on the VHDs size and the network bandwidth used for replication.

## Why do I need free space on the Hyper-V server for the replication?
* When you enable replication of a VM, Azure Site Recovery takes a snapshot of each VHD of the VM for initial replication (IR). While initial replication is going on, new changes are written to the disks by the application. Azure Site Recovery tracks these delta changes in the log files which require additional storage space.  Till initial replication gets completed, the log files are stored locally. If sufficient space is not available for the log files and snapshot (AVHDX), replication will go into resynchronization mode and replication will never get completed. In the worst case, you need 100% additional free space of the VHD size for initial replication.
* Once initial replication is over, delta replication starts. Azure Site Recovery tracks these delta changes in the log files which are stored on the volume where the VHDs of the VM reside. These logs files get replicated to Azure at a configured copy frequency. Based on the available network bandwidth, the log files take some time to get replicated to Azure. If sufficient free space is not available to store the log files, replication will be paused, and the replication status of the VM will go into resynchronization required.
* If network bandwidth is not enough to push the logs files into Azure, then logs files get piled up on the volume. In a worst-case scenario, when log files size increased to 50% of the VHD size, the replication of the VM will go into resynchronization required. In the worst case, you need 50% additional free space of the VHD size for delta replication.

**Hyper-V host**: The list of profiled Hyper-V servers. If a server is part of a Hyper-V cluster, all the cluster nodes are grouped together.

**Volume (VHD path)**: Each volume of a Hyper-V host where VHDs/VHDXs are present. 

**Free space available (GB)**: The free space available on the volume.

**Total storage space required on the volume (GB**: The total free storage space required on the volume for successful initial replication and delta replication. 

**Total additional storage to be provisioned on the volume for successful replication**: It recommends the total additional space that must be provisioned on the volume for successful initial replication and delta replication.

## Next steps
Learn more about [initial replication batching](site-recovery-hyper-v-deployment-planner-ir-batching.md).
