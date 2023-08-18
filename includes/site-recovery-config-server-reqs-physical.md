---
title: include file
description: include file
services: site-recovery
author: ankitaduttaMSFT
manager: carmonm
ms.service: site-recovery
ms.topic: include
ms.date: 09/03/2018
ms.author: ankitaduttaMSFT
ms.custom: include file

---

**Configuration/Process server requirements for physical server replication**

**Component** | **Requirement** 
--- | ---
**HARDWARE SETTINGS** | 
CPU cores | 8 
RAM | 16 GB
Number of disks | 3, including the OS disk, process server cache disk, and retention drive for failback 
Free disk space (process server cache) | 600 GB
Free disk space (retention disk) | 600 GB
 | 
**SOFTWARE SETTINGS** | 
Operating system | Windows Server 2012 R2 <br> Windows Server 2016
Operating system locale | English (en-us)
Windows Server roles | Don't enable these roles: <br> - Active Directory Domain Services <br>- Internet Information Services <br> - Hyper-V 
Group policies | Don't enable these group policies: <br> - Prevent access to the command prompt. <br> - Prevent access to registry editing tools. <br> - Trust logic for file attachments. <br> - Turn on Script Execution. <br> [Learn more](/previous-versions/windows/it-pro/windows-7/gg176671(v=ws.10))
IIS | - No preexisting default website <br> - No preexisting website/application listening on port 443 <br>- Enable  [anonymous authentication](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc731244(v=ws.10)) <br> - Enable [FastCGI](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc753077(v=ws.10)) setting.
IP address type | Static 
| 
**ACCESS SETTINGS** | 
MYSQL | MySQL should be installed on the configuration server. You can install manually, or Site Recovery can install it during deployment. For Site Recovery to install, check that the machine can reach http://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi.
URLs | The configuration server needs access to these URLs (directly or via proxy):<br/><br/> Azure AD: `login.microsoftonline.com`; `login.microsoftonline.us`; `*.accesscontrol.windows.net`<br/><br/> Replication data transfer: `*.backup.windowsazure.com`; `*.backup.windowsazure.us`<br/><br/> Replication management: `*.hypervrecoverymanager.windowsazure.com`; `*.hypervrecoverymanager.windowsazure.us`; `https://management.azure.com`; `*.services.visualstudio.com`<br/><br/> Storage access: `*.blob.core.windows.net`; `*.blob.core.usgovcloudapi.net`<br/><br/> Time synchronization: `time.nist.gov`; `time.windows.com`<br/><br/> Telemetry (optional): `dc.services.visualstudio.com`
Firewall | IP address-based firewall rules should allow communication to Azure URLs. To simplify and limit the IP ranges, we recommend using URL filtering.<br/><br/>**For commercial IPs:**<br/><br/>- Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and the HTTPS (443) port.<br/><br/> - Allow IP address ranges for the West US (used for Access Control and Identity Management).<br/><br/> - Allow IP address ranges for the Azure region of your subscription, to support the URLs needed for Azure Active Directory, backup, replication, and storage.<br/><br/> **For government IPs:**<br/><br/> - Allow the Azure Government Datacenter IP Ranges, and the HTTPS (443) port.<br/><br/> - Allow IP address ranges for all US Gov Regions (Virginia, Texas, Arizona, and Iowa), to support the URLs needed for Azure Active Directory, backup, replication, and storage.
Ports | Allow 443 (Control channel orchestration)<br/><br/> Allow 9443 (Data transport) 


**Configuration/Process server sizing requirements**

**CPU** | **Memory** | **Cache disk** | **Data change rate** | **Replicated machines**
--- | --- | --- | --- | ---
8 vCPUs<br/><br/> 2 sockets * 4 cores \@ 2.5 GHz | 16GB | 300 GB | 500 GB or less | < 100 machines
12 vCPUs<br/><br/> 2 socks  * 6 cores \@ 2.5 GHz | 18 GB | 600 GB | 500 GB-1 TB | 100 to 150 machines
16 vCPUs<br/><br/> 2 socks  * 8 cores \@ 2.5 GHz | 32 GB | 1 TB | 1-2 TB | 150 -200 machines