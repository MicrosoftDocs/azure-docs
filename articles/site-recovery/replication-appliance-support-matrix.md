---
title: Support Requirements for Azure Site Recovery Replication Appliance
description: This article describes support and requirements when you deploy the replication appliance for VMware disaster recovery to Azure with Azure Site Recovery with modernized architecture.
ms.service: azure-site-recovery
ms.topic: faq
ms.date: 04/29/2025
ms.author: v-gajeronika
author: Jeronika-MS
# Customer intent: "As a VMware administrator, I want to deploy the Azure Site Recovery replication appliance so that I can ensure effective disaster recovery of my virtual machines to Azure."
---

# Support matrix for deploying the replication appliance with Azure Site Recovery - modernized

This article describes support and requirements when you deploy the replication appliance for VMware disaster recovery to Azure with Azure Site Recovery with modernized architecture.

>[!NOTE]
> The information in this article applies to Azure Site Recovery with modernized architecture. For information about configuration server requirements in classic releases, see [Deprecation of classic experience to protect VMware and physical machines using Site Recovery](vmware-azure-configuration-server-requirements.md).

Create a new and exclusive Recovery Services vault for setting up the Site Recovery replication appliance. Don't use an existing vault.

You deploy an on-premises replication appliance when you use [Site Recovery](site-recovery-overview.md) for disaster recovery of VMware virtual machines (VMs) or physical servers to Azure:

- The replication appliance coordinates communications between on-premises VMware and Azure. It also manages data replication.
- To learn more about the Site Recovery replication appliance components and processes, see [VMware to Azure disaster recovery architecture - modernized](vmware-azure-architecture-modernized.md).

## Prerequisites

### Hardware requirements

Component | Requirement
--- | ---
CPU cores | 8
RAM | 16 GB
Number of disks | 2, including the OS disk (80 GB) and a data disk (620 GB)

### Software requirements

Component | Requirement
--- | ---
Operating system | Windows Server 2022. <br><br> - Windows Server 2019 appliances continue to receive software updates. <br> - Upgrading OS on existing Windows Server 2019 appliances to Windows Server 2022 isn't supported.
Operating system locale | English (en-*).
Windows Server roles | Don't enable these roles: <br> - Active Directory Domain Services. <br>- Internet Information Services (IIS). <br> - Hyper-V.
Group policies | Don't enable these group policies: <br> - Prevent access to the command prompt. <br> - Prevent access to registry editing tools. <br> - Trust logic for file attachments. <br> - Turn on Script Execution. <br> [Learn more](/previous-versions/windows/it-pro/windows-7/gg176671(v=ws.10))
IIS | - No preexisting default website. <br> - No preexisting website/application listening on port 443. <br>- Enable [anonymous authentication](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc731244(v=ws.10)). <br> - Enable [FastCGI](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc753077(v=ws.10)) setting.
Federal Information Processing Standards (FIPS) | Don't enable FIPS mode.|

### Network requirements

|Component | Requirement|
|--- | ---|
|Fully qualified domain name (FQDN) | Static. |
|Ports | 443 (Control channel orchestration).<br>9443 (Data transport).|
|Network interface card type | VMXNET3 (if the appliance is a VMware VM).|
|Network address translation | Supported. |

>[!NOTE]
> To support communication between source machines and the replication appliance using multiple subnets, select the FQDN as the mode of connectivity during the appliance setup. This step allows source machines to use FQDN, along with a list of IP addresses, to communicate with the replication appliance.

#### Allow URLs

Ensure that the following URLs are allowed and reachable from the Site Recovery replication appliance for continuous connectivity:

  | URL                  | Details                             |
  | ------------------------- | -------------------------------------------|
  | `portal.azure.com`          | Go to the Azure portal.              |
  | `login.windows.net`<br>`graph.windows.net `<br>`*.msftauth.net`<br>`*.msauth.net`<br>`*.microsoft.com`<br>`*.live.com `<br>`*.office.com ` | Sign in to your Azure subscription.  |
  |`*.microsoftonline.com`|Create Microsoft Entra apps for the appliance to communicate with Site Recovery. |
  |`management.azure.com` |Create Microsoft Entra apps for the appliance to communicate with Site Recovery. |
  |`*.services.visualstudio.com`|Upload app logs used for internal monitoring. |
  |`*.vault.azure.net`|Manage secrets in Azure Key Vault. Ensure that the machines that need to be replicated have access to this URL. |
  |`aka.ms` |Allow access to *also known as* links. Used for Site Recovery appliance updates. |
  |`download.microsoft.com/download` |Allow downloads from Microsoft download. |
  |`*.servicebus.windows.net`|Enable communication between the appliance and Site Recovery. |
  |`*.discoverysrv.windowsazure.com`<br><br>`*.hypervrecoverymanager.windowsazure.com `<br><br> `*.backup.windowsazure.com ` |Connect to Site Recovery microservice URLs.
  |`*.blob.core.windows.net`|Upload data to Azure Storage, which is used to create target disks. |
  |`*.backup.windowsazure.com`|Use the protection service URL. Site Recovery uses this microservice to process and create replicated disks in Azure. |
  | `*.prod.migration.windowsazure.com`| Discover your on-premises estate.

#### Allow URLs for government clouds

Ensure that the following URLs are allowed and reachable from the Site Recovery replication appliance for continuous connectivity when you enable replication to a government cloud.

  | URL for Fairfax                  | URL for China North 3                             | Details                             |
  | ------------------------- | -------------------------------------------| -------------------------------------------|
  | `login.microsoftonline.us/*` <br> `graph.microsoftazure.us` | `login.chinacloudapi.cn/*` <br> `graph.chinacloudapi.cn` | Sign in to your Azure subscription.  |
  | `portal.azure.us`          |    `portal.azure.cn`           |Go to the Azure portal. | 
  | `*.microsoftonline.us/*` <br> `management.usgovcloudapi.net` | `*.microsoftonline.cn/*` <br> `management.chinacloudapi.cn/*` | Create Microsoft Entra apps for the appliance to communicate with Site Recovery. |
  | `*.hypervrecoverymanager.windowsazure.us` <br> `*.migration.windowsazure.us` <br> `*.backup.windowsazure.us` | `*.hypervrecoverymanager.windowsazure.cn` <br> `*.migration.windowsazure.cn` <br> `*.backup.windowsazure.cn` | Connect to Site Recovery microservice URLs. |
  |`*.vault.usgovcloudapi.net`| `*.vault.azure.cn` |Manage secrets in Key Vault. Ensure that the machines that need to be replicated have access to this URL. |

### Folder exclusions from antivirus programs

#### If antivirus software is active on the appliance

Exclude the following folders from antivirus software for smooth replication and to avoid connectivity issues:

* C:\ProgramData\Microsoft Azure <br>
* C:\ProgramData\ASRLogs <br>
* C:\Windows\Temp\MicrosoftAzure
* C:\Program Files\Microsoft Azure Appliance Auto Update <br>
* C:\Program Files\Microsoft Azure Appliance Configuration Manager <br>
* C:\Program Files\Microsoft Azure Push Install Agent <br>
* C:\Program Files\Microsoft Azure RCM Proxy Agent <br>
* C:\Program Files\Microsoft Azure Recovery Services Agent <br>
* C:\Program Files\Microsoft Azure Server Discovery Service <br>
* C:\Program Files\Microsoft Azure Site Recovery Process Server <br>
* C:\Program Files\Microsoft Azure Site Recovery Provider <br>
* C:\Program Files\Microsoft Azure to on-premises Reprotect agent <br>
* C:\Program Files\Microsoft Azure VMware Discovery Service <br>
* C:\Program Files\Microsoft on-premises to Azure Replication agent <br>
* E:\ <br>

#### If antivirus software is active on the source machine

If the source machine has active antivirus software, the installation folder should be excluded. Exclude the C:\Program Files (x86)\Microsoft Azure Site Recovery\ folder for smooth replication.

## Sizing and capacity

An appliance that uses an in-built process server to protect the workload can handle up to 200 VMs based on the following configurations.

  |CPU |    Memory |    Cache disk size |    Data change rate |    Protected machines |
  |---|-------|--------|------|-------|
  |16 vCPUs (2 sockets * 8 cores @ 2.5 GHz)    | 32 GB |    1 TB |    >1 TB to 2 TB    | Use to replicate 151 to 200 machines.|

- You can perform discovery of all the machines in a vCenter server by using any of the replication appliances in the vault.
- You can [switch a protected machine](switch-replication-appliance-modernized.md), between different appliances in the same vault, if the selected appliance is healthy.

For information about how to use multiple appliances and failover a replication appliance, see [Switch Azure Site Recovery replication appliance](switch-replication-appliance-modernized.md).

## Related content

- [Learn](vmware-azure-set-up-replication-tutorial-modernized.md) how to set up disaster recovery of VMware VMs to Azure.
- [Learn](../site-recovery/deploy-vmware-azure-replication-appliance-modernized.md) how to deploy a Site Recovery replication appliance.
