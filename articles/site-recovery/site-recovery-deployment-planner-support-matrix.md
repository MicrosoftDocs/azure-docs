---
title: Azure Site Recovery deployment planner support matrix| Microsoft Docs
description: This is the Azure Site Recovery deployment planner support matrix for all site recovery scenarios.
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
ms.date: 11/26/2017
ms.author: nisoneji

---
# Support matrix

| | **VMware to Azure** |**Hyper-V to Azure**|**Azure to Azure**|**Hyper-V to secondary site**|**VMware to secondary site**
--|--|--|--|--|--
Supported scenarios |Yes|Yes|No|Yes*|No
Supported Version | vCenter 6.5, 6.0 or 5.5| Windows Server 2016, Windows Server 2012 R2 | NA |Windows Server 2016, Windows Server 2012 R2|NA
Supported configuration|vCenter, ESXi| Hyper-V cluster, Hyper-V host|NA|Hyper-V cluster, Hyper-V host|NA|
Number of servers that can be profiled per running instance of the Site Recovery Deployment Planner |Single (VMs belonging to one vCenter Server or one ESXi server can be profiled at a time)|Multiple (VMs across multiple hosts or host clusters can be profile at a time)| NA |Multiple (VMs across multiple hosts or host clusters can be profile at a time)| NA

*The tool is primarily for the Hyper-V to Azure disaster recovery scenario. For Hyper-V to secondary site disaster recovery, it can be used only to understand source side recommendations like required network bandwidth, required free storage space on each of the source Hyper-V servers, and initial replication batching numbers and batch definitions.  Ignore the Azure recommendations and costs from the report. Also, the Get Throughput operation is not applicable for the Hyper-V to secondary site disaster recovery scenario.


## Next steps
* [Download](site-recovery-hyper-v-deployment-panner-download.md) Site Recovery deployment planner.