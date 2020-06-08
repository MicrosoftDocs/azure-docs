---
title: include file
description: include file
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: include
ms.date: 06/10/2018
ms.author: raynew
ms.custom: include file

---

**Configuration and process server requirements**


## Hardware requirements

**Component** | **Requirement** 
--- | ---
CPU cores | 8 
RAM | 16 GB
Number of disks | 3, including the OS disk, process server cache disk, and retention drive for failback 
Free disk space (process server cache) | 600 GB
Free disk space (retention disk) | 600 GB
 | 

## Software requirements

**Component** | **Requirement** 
--- | ---
Operating system | Windows Server 2012 R2 <br> Windows Server 2016
Operating system locale | English (en-*)
Windows Server roles | Don't enable these roles: <br> - Active Directory Domain Services <br>- Internet Information Services <br> - Hyper-V 
Group policies | Don't enable these group policies: <br> - Prevent access to the command prompt. <br> - Prevent access to registry editing tools. <br> - Trust logic for file attachments. <br> - Turn on Script Execution. <br> [Learn more](https://technet.microsoft.com/library/gg176671(v=ws.10).aspx)
IIS | - No pre-existing default website <br> - No pre-existing website/application listening on port 443 <br>- Enable  [anonymous authentication](https://technet.microsoft.com/library/cc731244(v=ws.10).aspx) <br> - Enable [FastCGI](https://technet.microsoft.com/library/cc753077(v=ws.10).aspx) setting 
FIPS (Federal Information Processing Standards) | Do not enable FIPS mode
|

## Network requirements

**Component** | **Requirement** 
--- | --- 
IP address type | Static 
Ports | 443 (Control channel orchestration)<br>9443 (Data transport) 
NIC type | VMXNET3 (if the configuration server is a VMware VM)
 |
**Internet access**  (the server needs access to the following URLs, directly or via proxy):|
\*.backup.windowsazure.com | Used for replicated data transfer and coordination
\*.store.core.windows.net | Used for replicated data transfer and coordination
\*.blob.core.windows.net | Used to access storage account that stores replicated data
\*.hypervrecoverymanager.windowsazure.com | Used for replication management operations and coordination
https:\//management.azure.com | Used for replication management operations and coordination 
*.services.visualstudio.com | Used for telemetry purposes (optional)
time.nist.gov | Used to check time synchronization between system and global time
time.windows.com | Used to check time synchronization between system and global time
| <ul> <li> https:\//login.microsoftonline.com </li><li> https:\//secure.aadcdn.microsoftonline-p.com </li><li> https:\//login.live.com </li><li> https:\//graph.windows.net </li><li> https:\//login.windows.net </li><li> https:\//www.live.com </li><li> https:\//www.microsoft.com </li></ul> | OVF setup needs access to these URLs. They're used for access control and identity management by Azure Active Directory.
https:\//dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-community-5.7.20.0.msi  | To complete MySQL download. </br> In a few regions, the download might be redirected to the CDN URL. Ensure that the CDN URL is also whitelisted, if necessary.
|

## Required software

**Component** | **Requirement** 
--- | ---
VMware vSphere PowerCLI | [PowerCLI version 6.0](https://my.vmware.com/web/vmware/details?productId=491&downloadGroup=PCLI600R1) should be installed if the Configuration Server is running on a VMware VM.
MYSQL | MySQL should be installed. You can install manually, or Site Recovery can install it. (Refer to [configure settings](../articles/site-recovery/vmware-azure-deploy-configuration-server.md#configure-settings) for more information)
|

## Sizing and capacity requirements

The following table summarizes capacity requirements for the configuration server. If you're replicating multiple VMware VMs, review the [capacity planning considerations](../articles/site-recovery/site-recovery-plan-capacity-vmware.md) and run the [Azure Site Recovery Deployment Planner tool](../articles/site-recovery/site-recovery-deployment-planner.md).


**CPU** | **Memory** | **Cache disk** | **Data change rate** | **Replicated machines**
--- | --- | --- | --- | ---
8 vCPUs<br/><br/> 2 sockets * 4 cores \@ 2.5 GHz | 16 GB | 300 GB | 500 GB or less | < 100 machines
12 vCPUs<br/><br/> 2 socks  * 6 cores \@ 2.5 GHz | 18 GB | 600 GB | 500 GB-1 TB | 100 to 150 machines
16 vCPUs<br/><br/> 2 socks  * 8 cores \@ 2.5 GHz | 32 GB | 1 TB | 1-2 TB | 150 -200 machines
|

