---
title: Downloand Azure Site Recovery deployment planner tool | Microsoft Docs
description: This is the Azure Site Recovery deployment planner download guide for VMware to Azure and Hyper-V to Azure scenarios.
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
# Download and extract the deployment planner tool

1.	Download the latest version of the [Site Recovery deployment planner](https://aka.ms/asr-deployment-planner).
The tool is packaged in a .zip folder. The same tool supports both VMware to Azure and Hyper-V to Azure disaster recovery scenarios. You can use this tool for Hyper-V-to secondary site disaster recovery scenario as well but ignore the Azure infrastructure recommendation from the report.

2.	Copy the .zip folder to the Windows Server on which you want to run the tool. You can run the tool on a Windows Server 2012 R2 or Windows Server 2016. The server must have network access to connect to the  Hyper-V cluster or Hyper-V host that holds the VMs to be profiled. We recommend that you have the same hardware configuration of the VM, where the tool is going to run, as that of the Hyper-V server, which you want to protect. Such a configuration ensures that the achieved throughput that the tool reports matches the actual throughput that Site Recovery can achieve during replication. The throughput calculation depends on available network bandwidth on the server and hardware configuration (CPU, storage, and so forth) of the server. The throughput is calculated from the server where the tool is running to Azure. If the hardware configuration of the server differs from the Hyper-V server, the achieved throughput that the tool reports will be inaccurate.
The recommended configuration of the VM: 8 vCPUs, 16 GB RAM, 300 GB HDD.

3.	Extract the .zip folder.
The folder contains multiple files and subfolders. The executable file is ASRDeploymentPlanner.exe in the parent folder.
Example:
Copy the .zip file to E:\ drive and extract it. E:\ASR Deployment Planner_v2.0.zip
E:\ASR Deployment Planner_v2.0\ ASR Deployment Planner_v2.0\ ASRDeploymentPlanner.exe
