---
title: Support requirements for Azure Site Recovery replication appliance
description: This article describes support and requirements when deploying the replication appliance for VMware disaster recovery to Azure with Azure Site Recovery - Modernized
ms.service: site-recovery
ms.topic: conceptual
ms.date: 08/09/2023
ms.author: ankitadutta
author: ankitaduttaMSFT
---

# Support matrix for deploy Azure Site Recovery replication appliance - Modernized

This article describes support and requirements when deploying the replication appliance for VMware disaster recovery to Azure with Azure Site Recovery - Modernized

>[!NOTE]
> The information in this article applies to Azure Site Recovery - Modernized. For information about configuration server requirements in Classic releases, [see this article](vmware-azure-configuration-server-requirements.md).

>[!NOTE]
> Ensure you create a new and exclusive Recovery Services vault for setting up the ASR replication appliance. Don't use an existing vault.

You deploy an on-premises replication appliance when you use [Azure Site Recovery](site-recovery-overview.md) for disaster recovery of VMware VMs or physical servers to Azure.

- The replication appliance coordinates communications between on-premises VMware and Azure. It also manages data replication.
- [Learn more](vmware-azure-architecture-modernized.md) about the Azure Site Recovery replication appliance components and processes.

## Pre-requisites

### Hardware requirements

**Component** | **Requirement**
--- | ---
CPU cores | 8
RAM | 32 GB
Number of disks | 2, including the OS disk - 80 GB and a data disk - 620 GB

### Software requirements

**Component** | **Requirement**
--- | ---
Operating system | Windows Server 2019
Operating system locale | English (en-*)
Windows Server roles | Don't enable these roles: <br> - Active Directory Domain Services <br>- Internet Information Services <br> - Hyper-V
Group policies | Don't enable these group policies: <br> - Prevent access to the command prompt. <br> - Prevent access to registry editing tools. <br> - Trust logic for file attachments. <br> - Turn on Script Execution. <br> [Learn more](/previous-versions/windows/it-pro/windows-7/gg176671(v=ws.10))
IIS | - No pre-existing default website <br> - No pre-existing website/application listening on port 443 <br>- Enable  [anonymous authentication](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc731244(v=ws.10)) <br> - Enable [FastCGI](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc753077(v=ws.10)) setting
FIPS (Federal Information Processing Standards) | Don't enable FIPS mode|

### Network requirements

|**Component** | **Requirement**|
|--- | ---|
|Fully qualified domain name (FQDN) | Static|
|Ports | 443 (Control channel orchestration)<br>9443 (Data transport)|
|NIC type | VMXNET3 (if the appliance is a VMware VM)|
|NAT | Supported |


#### Allow URLs

Ensure the following URLs are allowed and reachable from the Azure Site Recovery replication appliance for continuous connectivity:

  | **URL**                  | **Details**                             |
  | ------------------------- | -------------------------------------------|
  | portal.azure.com          | Navigate to the Azure portal.              |
  | `login.windows.net `<br>`graph.windows.net `<br>`*.msftauth.net`<br>`*.msauth.net`<br>`*.microsoft.com`<br>`*.live.com `<br>`*.office.com ` | To sign-in to your Azure subscription.  |
  |`*.microsoftonline.com `|Create Azure Active  Directory (AD) apps for the appliance to communicate with Azure Site Recovery. |
  |management.azure.com |Create Microsoft Entra apps for the appliance to communicate with the Azure Site Recovery service. |
  |`*.services.visualstudio.com `|Upload app logs used for internal monitoring. |
  |`*.vault.azure.net `|Manage secrets in the Azure Key Vault. Note: Ensure that the machines that need to be replicated have access to this URL. |
  |aka.ms |Allow access to "also known as" links. Used for Azure Site Recovery appliance updates. |
  |download.microsoft.com/download |Allow downloads from Microsoft download. |
  |`*.servicebus.windows.net `|Communication between the appliance and the Azure Site Recovery service. |
  |`*.discoverysrv.windowsazure.com `<br><br>`*.hypervrecoverymanager.windowsazure.com `<br><br> `*.backup.windowsazure.com ` |Connect to Azure Site Recovery micro-service URLs.
  |`*.blob.core.windows.net `|Upload data to Azure storage, which is used to create target disks. |
  | `*.prod.migration.windowsazure.com `| To discover your on-premises estate.  

#### Allow URLs for government clouds

Ensure the following URLs are allowed and reachable from the Azure Site Recovery replication appliance for continuous connectivity, when enabling replication to a government cloud:

  | **URL for Fairfax**                  | **URL for Mooncake**                             | **Details**                             |
  | ------------------------- | -------------------------------------------| -------------------------------------------|
  | `login.microsoftonline.us/*` <br> `graph.microsoftazure.us` | `login.chinacloudapi.cn/*` <br> `graph.chinacloudapi.cn` | To sign-in to your Azure subscription.  |
  | `portal.azure.us`          |    `portal.azure.cn`           |Navigate to the Azure portal. | 
  | `*.microsoftonline.us/*` <br> `management.usgovcloudapi.net` | `*.microsoftonline.cn/*` <br> `management.chinacloudapi.cn/*` | Create Microsoft Entra apps for the appliance to communicate with the Azure Site Recovery service. |
  | `*.hypervrecoverymanager.windowsazure.us` <br> `*.migration.windowsazure.us` <br> `*.backup.windowsazure.us` | `*.hypervrecoverymanager.windowsazure.cn` <br> `*.migration.windowsazure.cn` <br> `*.backup.windowsazure.cn` | Connect to Azure Site Recovery micro-service URLs. |
  |`*.vault.usgovcloudapi.net`| `*.vault.azure.cn` |Manage secrets in the Azure Key Vault. Note: Ensure that the machines, which need to be replicated have access to this URL. |


### Folder exclusions from Antivirus program

#### If Antivirus Software is active on appliance

Exclude following folders from Antivirus software for smooth replication and to avoid connectivity issues.

C:\ProgramData\Microsoft Azure <br>
C:\ProgramData\ASRLogs <br>
C:\Windows\Temp\MicrosoftAzure
C:\Program Files\Microsoft Azure Appliance Auto Update <br>
C:\Program Files\Microsoft Azure Appliance Configuration Manager <br>
C:\Program Files\Microsoft Azure Push Install Agent <br>
C:\Program Files\Microsoft Azure RCM Proxy Agent <br>
C:\Program Files\Microsoft Azure Recovery Services Agent <br>
C:\Program Files\Microsoft Azure Server Discovery Service <br>
C:\Program Files\Microsoft Azure Site Recovery Process Server <br>
C:\Program Files\Microsoft Azure Site Recovery Provider <br>
C:\Program Files\Microsoft Azure to on-premises Reprotect agent <br>
C:\Program Files\Microsoft Azure VMware Discovery Service <br>
C:\Program Files\Microsoft on-premises to Azure Replication agent <br>
E:\ <br>

#### If Antivirus software is active on source machine

If source machine has an Antivirus software active, installation folder should be excluded. So, exclude folder C:\ProgramData\ASR\agent for smooth replication.

## Sizing and capacity

An appliance that uses an in-built process server to protect the workload can handle up to 200 virtual machines, based on the following configurations:

  |CPU |    Memory |    Cache disk size |    Data change rate |    Protected machines |
  |---|-------|--------|------|-------|
  |16 vCPUs (2 sockets * 8 cores @ 2.5 GHz)    | 32 GB |    1 TB |    >1 TB to 2 TB    | Use to replicate 151 to 200 machines.|

- You can perform discovery of all the machines in a vCenter server, using any of the replication appliances in the vault.

- You can [switch a protected machine](switch-replication-appliance-modernized.md), between different appliances in the same vault, given the selected appliance is healthy.

For detailed information about how to use multiple appliances and failover a replication appliance, see [this article](switch-replication-appliance-modernized.md)

## Next steps

- [Learn](vmware-azure-set-up-replication-tutorial-modernized.md) how to set up disaster recovery of VMware VMs to Azure.
- [Learn](../site-recovery/deploy-vmware-azure-replication-appliance-modernized.md) how to deploy Azure Site Recovery replication appliance.
