---
title: VMware disaster recovery- replication appliance requirements in Azure Site Recovery - Classic
description: This article describes support and requirements when deploying the replication appliance for VMware disaster recovery to Azure with Azure Site Recovery - Classic
ms.service: site-recovery
ms.topic: article
ms.date: 06/23/2021
---

# Replication appliance requirements for VMware disaster recovery to Azure - Preview

>[!NOTE]
> The information in this article applies to Azure Site Recovery - preview. For information about configuration server requirements in Classic releases ,[see this article](vmware-azure-configuration-server-requirements.md).

You deploy an on-premises re;ication appliance when you use [Azure Site Recovery](site-recovery-overview.md) for disaster recovery of VMware VMs and physical servers to Azure.

- The replication appliance coordinates communications between on-premises VMware and Azure. It also manages data replication.
- [Learn more](vmware-azure-architecture-preview.md) about the replication appliance components and processes.

## Deploy replication appliance

To set up a new appliance, you can follow either of the following methods:

### Create appliance using pre-configured virtual machine image

1. Download the OVF template to set up an appliance on your on-premises environment.

  We recommend this approach as all prerequisite configurations are handled by the template.  

2. The OVF template spins up a machine with the required specifications.
3. After the deployment is complete, power on the VM to accept Microsoft Evaluation license and click **Next**.
4. In the next screen, provide the password for the administrator user.
5. Select **Finalize**.

The system restarts and you can login with the administrator user account.

### Set up appliance on a virtual machine or physical server through PowerShell
 In case of any organizational restrictions, you can manually set up the ASR replication appliance through PowerShell.  

1. Ensure a machine with the required [hardware[](#hardware-requirements) and [software](#software-requirements) configuration is created.
2. 	[Download](https://aka.ms/V2ARcmApplianceCreationPowershellZip) the zip that contains the required installers and place this folder on the ASR replication appliance.
3.	After successfully copying the zip folder, unzip and extract the components of the folder.
4. Go to the path where the folder is extracted to and execute the following PowerShell script as an administrator:
```powershell
   DRInstaller.ps1
```

## Hardware requirements

**Component** | **Requirement**
--- | ---
CPU cores | 8
RAM | 32 GB
Number of disks | 3, including the OS disk - 80 GB, data disk 1 - 620 GB, data disk 2 - 620 GB
 |

## Software requirements

<this section needs detailed review>

**Component** | **Requirement**
--- | ---
Operating system | Windows Server 2016
Operating system locale | English (en-*)
Windows Server roles | Don't enable these roles: <br> - Active Directory Domain Services <br>- Internet Information Services <br> - Hyper-V
Group policies | Don't enable these group policies: <br> - Prevent access to the command prompt. <br> - Prevent access to registry editing tools. <br> - Trust logic for file attachments. <br> - Turn on Script Execution. <br> [Learn more](/previous-versions/windows/it-pro/windows-7/gg176671(v=ws.10))
IIS | - No pre-existing default website <br> - No pre-existing website/application listening on port 443 <br>- Enable  [anonymous authentication](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc731244(v=ws.10)) <br> - Enable [FastCGI](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc753077(v=ws.10)) setting
FIPS (Federal Information Processing Standards) | Do not enable FIPS mode
|

## Network requirements
<needs detailed review>

**Component** | **Requirement**
--- | ---
IP address type | Static
Ports | 443 (Control channel orchestration)<br>9443 (Data transport)
NIC type | VMXNET3 (if the configuration server is a VMware VM)
 |
**Internet access**  (the server needs access to the following URLs, directly or via proxy):|
\*.backup.windowsazure.com | Used for replicated data transfer and coordination
\*.blob.core.windows.net | Used to access storage account that stores replicated data. You can provide the specific URL of your cache storage account.
\*.hypervrecoverymanager.windowsazure.com | Used for replication management operations and coordination
https:\//login.microsoftonline.com | Used for replication management operations and coordination
time.nist.gov | Used to check time synchronization between system and global time
time.windows.com | Used to check time synchronization between system and global time
| <ul> <li> https:\//management.azure.com </li><li> https:\//secure.aadcdn.microsoftonline-p.com </li><li> https:\//login.live.com </li><li> https:\//graph.windows.net </li><li> https:\//login.windows.net </li><li> *.services.visualstudio.com (Optional) </li><li> https:\//www.live.com </li><li> https:\//www.microsoft.com </li></ul> | OVF setup needs access to these additional URLs. They're used for access control and identity management by Azure Active Directory.
https:\//dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-community-5.7.20.0.msi  | To complete MySQL download. </br> In a few regions, the download might be redirected to the CDN URL. Ensure that the CDN URL is also approved, if necessary.
|

> [!NOTE]
> If you have [private links connectivity](../articles/site-recovery/hybrid-how-to-enable-replication-private-endpoints.md) to Site Recovery vault, you do not need any additional internet access for the Configuration Server. An exception to this is while setting up the CS machine using OVA template, you will need access to following URLs over and above private link access - https://management.azure.com, https://www.live.com and https://www.microsoft.com. If you do not wish to allow access to these URLs, please set up the CS using Unified Installer.

## Required software
<needs detailed review>

**Component** | **Requirement**
--- | ---
VMware vSphere PowerCLI | Not required for versions 9.14 and higher
MYSQL | MySQL should be installed. You can install manually, or Site Recovery can install it. (Refer to [configure settings](../articles/site-recovery/vmware-azure-deploy-configuration-server.md#configure-settings) for more information)
|

## Sizing and capacity
You can create and use multiple replication appliances based on your requirement.

## Next steps
Set up disaster recovery of [VMware VMs](vmware-azure-tutorial.md) to Azure.
