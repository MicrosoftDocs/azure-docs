---
title: Azure Site Recovery deployment planner capabilites for VMware to Azure and Hyper-V-to-Azure| Microsoft Docs
description: This article describes Azure Site Recovery deployment planner capabilities for Hyper-V to Azure scenario.
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
# Site Recovery Deployment planner capabilities

You can run the command-line tool (ASRDeploymentPlanner.exe) in any of the following four modes: 
1.	[Get VM list](site-recovery-hyper-v-deployment-planner-getvmlist.md) (only for Hyper-V environments)
2.	[Profiling](site-recovery-hyper-v-deployment-planner-profiling.md)
3.	[Report generation](site-recovery-hyper-v-deployment-planner-generate-report.md)
4.	[Get throughput](site-recovery-hyper-v-deployment-planner-get-throughput.md)

First, run the tool to get the list of VMs from a single or multiple Hyper-V hosts.  Then run the tool in profiling mode to gather VM data churn and IOPS. Next, run the tool to generate the report to find the network bandwidth and storage requirements.

# Next steps
[Get list of Hyper-V VMs](site-recovery-hyper-v-deployment-planner-getvmlist.md).
  