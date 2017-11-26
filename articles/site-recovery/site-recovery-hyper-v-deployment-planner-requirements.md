---
title: Azure Site Recovery deployment planner requirements for Hyper-V-to-Azure| Microsoft Docs
description: This article describes Azure Site Recovery deployment planner requirements for Hyper-V to Azure scenario.
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
# Site Recovery Deployment planner requirements for Hyper-V to Azure
The tool has three main phases for Hyper-V: get VM list, profiling, and report generation. There is also a fourth option to calculate throughput only. The requirements for the server on which the different phases need to be executed are presented in the following table:

| Server requirement | Description |
|---|---|
|Get VM list, profiling, and throughput measurement |<ul><li>Operating system: Microsoft Windows Server 2016 or 2Microsoft Windows Server 2012 R2 </li><li>Machine configuration: 8 vCPUs, 16 GB RAM, 300 GB HDD</li><li>[Microsoft .NET Framework 4.5](https://aka.ms/dotnet-framework-45)</li><li>[Microsoft Visual C++ Redistributable for Visual Studio 2012](https://aka.ms/vcplusplus-redistributable)</li><li>Internet access to Azure from this server</li><li>Azure storage account</li><li>Administrator access on the server</li><li>Minimum 100 GB of free disk space (assuming 1000 VMs with an average of three disks each, profiled for 30 days)</li><li>The VM from where you are running the Site Recovery deployment planner tool must be added to TrustedHosts list of all the Hyper-V servers.</li><li>All Hyper-V servers’ VMs to be profiled must be added to TrustedHosts list of the client VM from where the tool is being run. [Learn more](site-recovery-hyper-v-deployment-planner-requirements#steps-to-add-servers-into-trustedhosts-list). </li><li> The tool should be run from Administrative privileges from PowerShell or command-line console on the client</ul></ul>|
| Report generation | A Windows PC or Windows Server with Microsoft Excel 2013 or later |
| User permissions | Read-only permission for the user account that's used to access the VMware vCenter server/VMware vSphere ESXi host during profiling |


## Steps to add servers into TrustedHosts List
1.	The VM from where the tool is to be deployed should have all the hosts to be profiled in its TrustedHosts list. To add the client into Trustedhosts list run the following command from an elevated PowerShell on the VM. The VM can be a Windows Server 2012 R2 or Windows Server 2016. 

            set-item wsman:\localhost\Client\TrustedHosts -value <ComputerName>[,<ComputerName>]

2.	Each Hyper-V Host that needs to be profiled should have:
    a. The VM on which the tool is going to be run in its TrustedHosts list. Run the following command from an elevated PowerShell on the Hyper-V host.

            set-item wsman:\localhost\Client\TrustedHosts -value <ComputerName>[,<ComputerName>]

    b. PowerShell remoting enabled.

            Enable-PSRemoting -Force

## Nest steps
* [Learn more](site-recovery-hyper-v-deployment-panner-download.md) about download Site Recovery deployment planner.
* [Learn more](site-recovery-hyper-v-deployment-planner-capabilities.md) about the tool capabilities.
* [Learn more](site-recovery-hyper-v-deployment-planner-getvmlist.md) about how to get list of Hyper-V VMs.
* [Learn more](site-recovery-hyper-v-deployment-planner-profiling.md) about how to profile Hyper-V VMs.
