---
title: Configuration server requirements for VMware disaster recovery to Azure with Azure Site Recovery | Microsoft Docs
description: This article describes support and requirements when deploying the configuration server for VMware disaster recovery to Azure with Azure Site Recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
services: site-recovery
ms.topic: article
ms.date: 05/30/2019
ms.author: raynew
---

# Configuration server requirements for VMware disaster recovery to Azure

You deploy an on-premises configuration server when you use [Azure Site Recovery](site-recovery-overview.md) for disaster recovery of VMware VMs and physical servers to Azure.

- The configuration server coordinates communications between on-premises VMware and Azure. It also manages data replication.
- [Learn more](vmware-azure-architecture.md) about the configuration server components and processes.

## Configuration server deployment

For disaster recovery of VMware VMs to Azure, you deploy the configuration server as a VMware VM.

- Site Recovery provides an OVA template that you download from the Azure portal, and import into vCenter Server to set up the configuration server VM.
- When you deploy the configuration server using the OVA template, the VM automatically complies with the requirements listed in this article.
- We strongly recommend that you set up the configuration server using the OVA template. However, if you're setting up disaster recovery for VMware VMs and can't use the OVA template, you can deploy the configuration server using [these instructions provided](physical-azure-set-up-source.md).
- If you're deploying the configuration server for disaster recovery of on-premises physical machines to Azure, follow the instructions in [this article](physical-azure-set-up-source.md). 


## Hardware requirements

**Component** | **Requirement** 
--- | ---
CPU cores | 8 
RAM | 16 GB
Number of disks | 3, including the OS disk, process server cache disk, and retention drive for failback 
Free disk space (process server cache) | 600 GB
Free disk space (retention disk) | 600 GB

## Software requirements

**Component** | **Requirement** 
--- | ---
Operating system | Windows Server 2012 R2 <br> Windows Server 2016
Operating system locale | English (en-us)
Windows Server roles | Don't enable these roles: <br> - Active Directory Domain Services <br>- Internet Information Services <br> - Hyper-V 
Group policies | Don't enable these group policies: <br> - Prevent access to the command prompt. <br> - Prevent access to registry editing tools. <br> - Trust logic for file attachments. <br> - Turn on Script Execution. <br> [Learn more](https://technet.microsoft.com/library/gg176671(v=ws.10).aspx)
IIS | - No preexisting default website <br> - No preexisting website/application listening on port 443 <br>- Enable  [anonymous authentication](https://technet.microsoft.com/library/cc731244(v=ws.10).aspx) <br> - Enable [FastCGI](https://technet.microsoft.com/library/cc753077(v=ws.10).aspx) setting 

## Network requirements

**Component** | **Requirement** 
--- | --- 
IP address type | Static 
Internet access | The server needs access to these URLs (directly or via proxy): <br> - \*.accesscontrol.windows.net<br> - \*.backup.windowsazure.com <br>- \*.store.core.windows.net<br> - \*.blob.core.windows.net<br> - \*.hypervrecoverymanager.windowsazure.com  <br> - https:\//management.azure.com <br> - *.services.visualstudio.com <br> - time.nist.gov <br> - time.windows.com <br> OVF also needs access to the following URLs: <br> - https:\//login.microsoftonline.com <br> - https:\//secure.aadcdn.microsoftonline-p.com <br> - https:\//login.live.com  <br> - https:\//auth.gfx.ms <br> - https:\//graph.windows.net <br> - https:\//login.windows.net <br> - https:\//www.live.com <br> - https:\//www.microsoft.com <br> - https:\//dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-community-5.7.20.0.msi 
Ports | 443 (Control channel orchestration)<br>9443 (Data transport) 
NIC type | VMXNET3 (if the Configuration Server is a VMware VM)

## Required software

**Component** | **Requirement** 
--- | ---
VMware vSphere PowerCLI | [PowerCLI version 6.0](https://my.vmware.com/web/vmware/details?productId=491&downloadGroup=PCLI600R1) should be installed if the Configuration Server is running on a VMware VM.
MYSQL | MySQL should be installed. You can install manually, or Site Recovery can install it.

## Sizing and capacity requirements

The following table summarizes capacity requirements for the configuration server. If you're replicating multiple VMware VMs, you should review the [capacity planning considerations](site-recovery-plan-capacity-vmware.md), and run the [Azure Site Recovery Deployment Planner](site-recovery-deployment-planner.md) tool for VMWare replication.read 

**Component** | **Requirement** 
--- | ---

| **CPU** | **Memory** | **Cache disk** | **Data change rate** | **Replicated machines** |
| --- | --- | --- | --- | --- |
| 8 vCPUs<br/><br/> 2 sockets * 4 cores \@ 2.5 GHz | 16 GB | 300 GB | 500 GB or less | Les than 100 machines |
| 12 vCPUs<br/><br/> 2 socks  * 6 cores \@ 2.5 GHz | 18 GB | 600 GB | 500 GB-1 TB | 100 to 150 machines |
| 16 vCPUs<br/><br/> 2 socks  * 8 cores \@ 2.5 GHz | 32 GB | 1 TB | 1-2 TB | 150-200 machines | 



## Next steps
Set up disaster recovery of [VMware VMs](vmware-azure-tutorial.md) to Azure.
