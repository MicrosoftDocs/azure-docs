---
title: Azure Site Recovery deployment planner initial replication batching for  Hyper-V-to-Azure| Microsoft Docs
description: This article describes initial replication batching  details of the generated report using Azure Site Recovery deployment planner for Hyper-V to Azure scenario.
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
# Initial replication batching 

## Why do I need initial replication (IR) batching?
If all the VMs are protected at the same time, the free storage requirement would be much higher and if enough storage is not available, the replication of the VMs will go into resynchronization mode. Also, the network bandwidth requirement would be much higher to complete initial replication of all VMs together successfully. 

## Initial replication batching for a selected RPO
This worksheet provides the detail view of each batch for initial replication (IR). For each RPO, a separate IR batching sheet is created. 

Once you have followed the on-premises storage requirement recommendation for each volume, the main information that you need to replicate is the list of VMs that can be protected in parallel. These VMs are group together in a batch. There can be multiple batches. You must protect the VMs in the given batch order. First protect Batch 1 VMs and once initial replication is completed, protect Batch 2 VMs, and so on. You can get the list of batches and corresponding VMs from this sheet. 

Each batch provides the following information:

Each batch provides the following information:  
**Hyper-V host**: The Hyper-V host of the VM to be protected.
Virtual machine: The VM to be protected. 

**Comments**: If any action is required for a specific volume of a VM, the comment is provided here.  For example, if sufficient free space is not available on a volume, it says Add additional storage to protect this VM in the comment.

**Volume (VHD path)**:  The volume name where the VM’s VHDs reside. 
Free space available on the volume (GB):  The free disk space available on the volume for the VM. While calculating available free space on the volumes, it considers the disk space used for delta replication by the VMs of the previous batches whose VHDs are on the same volume.  

For example, VM1, VM2 and VM3 reside on a volume say E:\VHDpath. Before replication, free space on the volume is 500 GB. VM1 is part Batch 1, VM2 is part of Batch 2, and VM3 is part of Batch3.  For VM1, the free space available is 500 GB. For VM2, the free space available would be 500 – disk space required for delta replication for VM1.  Say VM1 requires 300 GB space for delta replication then free space available for VM2 would be 500 GB – 300 GB = 200 GB.  Similarly, VM2 requires 300 GB for delta replication then the free space available for VM3 would be 200 GB - -300 GB = -100 GB

**Storage required on the volume for initial replication (GB)**: The free storage space required on the volume for the VM for initial replication.

**Storage required on the volume for delta replication (GB)**:  The free storage space required on the volume for the VM for delta replication.

**Additional storage required based on deficit to avoid replication failure (GB)**: The additional storage space required on the volume for the VM.  It is the max of initial replication and delta replication storage space requirement - free space available on the volume.

**Minimum bandwidth required for initial replication (Mbps)**: The minimum bandwidth required for initial replication for the VM.

**Minimum bandwidth required for delta replication (Mbps)**: The minimum bandwidth required for delta replication for the VM

Below each batch’s details, a summary of network utilization is provided in the Network Utilization Details for Batch table.

**Bandwidth available for Batch**: The bandwidth available for the batch after considering the previous batch’s delta replication bandwidth.
**Approximate bandwidth available for initial replication of batch**: The bandwidth available for initial replication of the VMs of the batch. 
**Approximate bandwidth consumed for delta replication of batch**: The bandwidth needed for delta replication of the VMs of the batch. 

**Estimated Initial Replication time for Batch (HH:MM)**: The estimated initial replication time in Hours:Minutes.

## IR batching for a given bandwidth
When you generate the report with -bandwidth parameter, an additional IR batching sheet for the specified bandwidth will be created. If the specified bandwidth is sufficient for successful initial replication and delta replication, the sheet provides IR batching guidelines based on the specified bandwidth.

If the specified bandwidth is not sufficient for initial replication and delta replication, the sheet calls out in red and suggests the minimum bandwidth required for the successful replication. The IR batching guideline would be based on the specified bandwidth.

## Next steps:
Learn more about [cost estimation](site-recovery-hyper-v-deployment-planner-cost-estimation.md) of the report.