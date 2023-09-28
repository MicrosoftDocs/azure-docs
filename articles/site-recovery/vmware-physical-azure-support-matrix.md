---
title: Support matrix for VMware/physical disaster recovery in Azure Site Recovery.
description: Summarizes support for disaster recovery of VMware VMs and physical server to Azure using Azure Site Recovery.
ms.topic: conceptual
ms.service: site-recovery
ms.date: 09/28/2023
ms.author: ankitadutta
author: ankitaduttaMSFT
ms.custom: engagement-fy23 
---

# Support matrix for disaster recovery  of VMware VMs and physical servers to Azure

This article summarizes supported components and settings for disaster recovery of VMware VMs and physical servers to Azure using [Azure Site Recovery](site-recovery-overview.md).

>[!NOTE]
>You can now move your existing replicated items to modernized VMware disaster recovery experience. [Learn more](move-from-classic-to-modernized-vmware-disaster-recovery.md).

- [Learn more](vmware-azure-architecture.md) about VMware VM/physical server disaster recovery architecture.
- Follow our [tutorials](tutorial-prepare-azure.md) to try out disaster recovery.

> [!NOTE]
> Site Recovery doesn't move or store customer data out of the target region, in which disaster recovery has been set up for the source machines. Customers may select a Recovery Services Vault from a different region if they so choose. The Recovery Services Vault contains metadata but no actual customer data.

## Deployment scenarios

**Scenario** | **Details**
--- | ---
Disaster recovery of VMware VMs | Replication of on-premises VMware VMs to Azure. You can deploy this scenario in the Azure portal or by using [PowerShell](vmware-azure-disaster-recovery-powershell.md).
Disaster recovery of physical servers | Replication of on-premises Windows/Linux physical servers to Azure. You can deploy this scenario in the Azure portal.

## On-premises virtualization servers

**Server** | **Requirements** | **Details**
--- | --- | ---
vCenter Server | Version 8.0 & subsequent updates in this version, Version 7.0, 6.7 or 6.5 | We recommend that you use a vCenter server in your disaster recovery deployment.
vSphere hosts | Version 8.0 & subsequent updates in this version, Version 7.0, 6.7 or 6.5 | We recommend that vSphere hosts and vCenter servers are located in the same network as the process server. By default the process server runs on the configuration server. [Learn more](vmware-physical-azure-config-process-server-overview.md).

## Azure Site Recovery replication appliance

The replication appliance is an on-premises machine that runs Site Recovery components, including various Site Recovery services that help with discovery of on-premises environment, orchestration of disaster recovery and act as a bridge between on-premises and Azure.

- For VMware VMs, you can create the replication appliance by downloading an OVF template to create a VMware VM.
- For physical servers, you can set up the replication appliance manually by running our PowerShell script.

**Component** | **Requirements**
--- |---
CPU cores | 8
RAM | 16 GB
Number of disks | 2 disks<br/><br/> Disks include the OS disk and data disk.
Operating system  | Windows Server 2012 R2, Windows Server 2016 or Windows Server 2019 with Desktop experience 
Operating system locale | English (en-us)
Windows Server roles | Don't enable Active Directory Domain Services; Internet Information Services (IIS) or Hyper-V.
Group policies| Don't enable these group policies: <br/> - Prevent access to the command prompt. <br/> - Prevent access to registry editing tools. <br/> - Trust logic for file attachments. <br/> - Turn on Script Execution. <br/> - [Learn more](/previous-versions/windows/it-pro/windows-7/gg176671(v=ws.10))|
IIS | Make sure you:<br/><br/> - Don't have a pre-existing default website <br/> - Enable  [anonymous authentication](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc731244(v=ws.10)) <br/> - Enable [FastCGI](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc753077(v=ws.10)) setting  <br/> - Don't have preexisting website/app listening on port 443<br/>
NIC type | VMXNET3 (when deployed as a VMware VM)
Fully qualified domain name (FQDN) | Static
Ports | 443 used for control channel orchestration<br/>9443 for data transport
NAT | Supported

> [!NOTE]
> Operating system has to be installed with English locale. Conversion of locale post installation could result in potential issues.

## Replicated machines

Site Recovery supports replication of any workload running on a supported machine.

**Component** | **Details**
--- | ---
Machine settings | Machines that replicate to Azure must meet [Azure requirements](#azure-vm-requirements).
Machine workload | Site Recovery supports replication of any workload running on a supported machine. [Learn more](./site-recovery-workload.md).
Machine name | Ensure that the display name of machine doesn't fall into [Azure reserved resource names](../azure-resource-manager/templates/error-reserved-resource-name.md).<br/><br/> Logical volume names aren't case-sensitive. Ensure that no two volumes on a device have same name. For example, Volumes with names "voLUME1", "volume1" can't be protected through Azure Site Recovery.
Azure Virtual Machines as Physical | Failover of virtual machines with Marketplace image disks is currently not supported.

### For Windows

> [!NOTE]
> Ensure that 500MB free space is available on the installation folder in the on-premises and Azure machine.

**Operating system** | **Details**
--- | ---
Windows Server 2022 | Supported from [Update rollup 59](https://support.microsoft.com/topic/update-rollup-59-for-azure-site-recovery-kb5008707-66a65377-862b-4a4c-9882-fd74bdc7a81e) (version 9.46 of the Mobility service) onwards.
Windows Server 2019 | Supported from [Update rollup 34](https://support.microsoft.com/help/4490016) (version 9.22 of the Mobility service) onwards.
Windows Server 2016 64-bit | Supported for Server Core, Server with Desktop Experience.
Windows Server 2012 R2 / Windows Server 2012 | Supported.
Windows Server 2008 R2 with SP1 onwards. | Supported.<br/><br/> From version [9.30](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery) of the Mobility service agent, you need [servicing stack update (SSU)](https://support.microsoft.com/help/4490628) and [SHA-2 update](https://support.microsoft.com/help/4474419) installed on machines running Windows 2008 R2 with SP1 or later. SHA-1 isn't supported from September 2019, and if SHA-2 code signing isn't enabled the agent extension won't install/upgrade as expected. Learn more about [SHA-2 upgrade and requirements](https://support.microsoft.com/topic/sha-2-code-signing-support-update-for-windows-server-2008-r2-windows-7-and-windows-server-2008-september-23-2019-84a8aad5-d8d9-2d5c-6d78-34f9aa5f8339).
Windows Server 2008 with SP2 or later (64-bit/32-bit) |  Supported for migration only. [Learn more](migrate-tutorial-windows-server-2008.md).<br/><br/> From version [9.30](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery) of the Mobility service agent, you need [servicing stack update (SSU)](https://support.microsoft.com/help/4493730) and [SHA-2 update](https://support.microsoft.com/help/4474419) installed on Windows 2008 SP2 machines. SHA-1 isn't supported from September 2019, and if SHA-2 code signing isn't enabled the agent extension won't install/upgrade as expected. Learn more about [SHA-2 upgrade and requirements](https://support.microsoft.com/topic/sha-2-code-signing-support-update-for-windows-server-2008-r2-windows-7-and-windows-server-2008-september-23-2019-84a8aad5-d8d9-2d5c-6d78-34f9aa5f8339).
Windows 10, Windows 8.1, Windows 8 | Only 64-bit system is supported. 32-bit system isn't supported.
Windows 7 with SP1 64-bit | Supported from [Update rollup 36](https://support.microsoft.com/help/4503156) (version 9.22 of the Mobility service) onwards. </br></br> From [9.30](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery) of the Mobility service agent, you need [servicing stack update (SSU)](https://support.microsoft.com/help/4490628) and [SHA-2 update](https://support.microsoft.com/help/4474419) installed on Windows 7 SP1 machines.  SHA-1 isn't supported from September 2019, and if SHA-2 code signing isn't enabled the agent extension won't install/upgrade as expected. Learn more about [SHA-2 upgrade and requirements](https://support.microsoft.com/topic/sha-2-code-signing-support-update-for-windows-server-2008-r2-windows-7-and-windows-server-2008-september-23-2019-84a8aad5-d8d9-2d5c-6d78-34f9aa5f8339).

### For Linux

**Operating system** | **Details**
--- | ---
Linux | Only 64-bit system is supported. 32-bit system isn't supported.<br/><br/>Every Linux server should have [Linux Integration Services (LIS) components](https://www.microsoft.com/download/details.aspx?id=55106) installed. It is required to boot the server in Azure after test failover/failover. If in-built LIS components are missing, ensure to install the [components](https://www.microsoft.com/download/details.aspx?id=55106) before enabling replication for the machines to boot in Azure. <br/><br/> Site Recovery orchestrates failover to run Linux servers in Azure. However Linux vendors might limit support to only distribution versions that haven't reached end-of-life.<br/><br/> On Linux distributions, only the stock kernels that are part of the distribution minor version release/update are supported.<br/><br/> Upgrading protected machines across major Linux distribution versions isn't supported. To upgrade, disable replication, upgrade the operating system, and then enable replication again.<br/><br/> [Learn more](https://support.microsoft.com/help/2941892/support-for-linux-and-open-source-technology-in-azure) about support for Linux and open-source technology in Azure.<br/><br/> Chained IO isn't supported by Site Recovery.
Linux Red Hat Enterprise | 5.2 to 5.11</b><br/> 6.1 to 6.10</b> </br> 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, [7.7](https://support.microsoft.com/help/4528026/update-rollup-41-for-azure-site-recovery), [7.8](https://support.microsoft.com/help/4564347/), [7.9 Beta version](https://support.microsoft.com/help/4578241/), [7.9](https://support.microsoft.com/help/4590304/) </br> [8.0](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery), 8.1, [8.2](https://support.microsoft.com/help/4570609), [8.3](https://support.microsoft.com/help/4597409/), [8.4](https://support.microsoft.com/topic/883a93a7-57df-4b26-a1c4-847efb34a9e8) (4.18.0-305.30.1.el8_4.x86_64 or higher), [8.5](https://support.microsoft.com/topic/883a93a7-57df-4b26-a1c4-847efb34a9e8) (4.18.0-348.5.1.el8_5.x86_64 or higher), [8.6](https://support.microsoft.com/topic/update-rollup-62-for-azure-site-recovery-e7aff36f-b6ad-4705-901c-f662c00c402b), 8.7, 8.8, 9.0, 9.1. <br/> Few older kernels on servers running Red Hat Enterprise Linux 5.2-5.11 & 6.1-6.10 don't have [Linux Integration Services (LIS) components](https://www.microsoft.com/download/details.aspx?id=55106) pre-installed. If in-built LIS components are missing, ensure to install the [components](https://www.microsoft.com/download/details.aspx?id=55106) before enabling replication for the machines to boot in Azure.  <br> <br> **Note**: Support for Linux Red Hat Enterprise versions `9.0` and `9.1` is only available for Modernized experience and isn't available for Classic experience. 
Linux: CentOS | 5.2 to 5.11</b><br/> 6.1 to 6.10</b><br/> </br> 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, [7.7](https://support.microsoft.com/help/4528026/update-rollup-41-for-azure-site-recovery), [7.8](https://support.microsoft.com/help/4564347/), [7.9](https://support.microsoft.com/help/4578241/) </br> [8.0](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery), 8.1, [8.2](https://support.microsoft.com/help/4570609), [8.3](https://support.microsoft.com/help/4597409/),  [8.4](https://support.microsoft.com/topic/883a93a7-57df-4b26-a1c4-847efb34a9e8) (4.18.0-305.30.1.el8_4.x86_64 or later), [8.5](https://support.microsoft.com/topic/883a93a7-57df-4b26-a1c4-847efb34a9e8) (4.18.0-348.5.1.el8_5.x86_64 or later), 8.6, 8.7 <br/><br/> Few older kernels on servers running  CentOS 5.2-5.11 & 6.1-6.10 don't have  [Linux Integration Services (LIS) components](https://www.microsoft.com/download/details.aspx?id=55106) pre-installed. If in-built LIS components are missing, ensure to install the [components](https://www.microsoft.com/download/details.aspx?id=55106) before enabling replication for the machines to boot in Azure.   
Ubuntu | Ubuntu 14.04* LTS server [(review supported kernel versions)](#ubuntu-kernel-versions)<br/>Ubuntu 16.04* LTS server [(review supported kernel versions)](#ubuntu-kernel-versions) </br> Ubuntu 18.04* LTS server [(review supported kernel versions)](#ubuntu-kernel-versions) </br> Ubuntu 20.04* LTS server [(review supported kernel versions)](#ubuntu-kernel-versions) <br> Ubuntu 22.04* LTS server [(review supported kernel versions)](#ubuntu-kernel-versions) <br> **Note**: Support for Ubuntu 22.04 is available for Modernized experience only and not available for Classic experience yet. </br> (*includes support for all 14.04.*x*, 16.04.*x*, 18.04.*x*, 20.04.*x* versions)  
Debian | Debian 7/Debian 8 (includes support for all 7. *x*, 8. *x* versions). [Ensure to download latest mobility agent installer on the configuration server](vmware-physical-mobility-service-overview.md#download-latest-mobility-agent-installer-for-suse-11-sp3-suse-11-sp4-rhel-5-cent-os-5-debian-7-debian-8-debian-9-oracle-linux-6-and-ubuntu-1404-server). <br/> Debian 9 (includes support for 9.1 to 9.13. Debian 9.0 isn't supported.). [Ensure to download latest mobility agent installer on the configuration server](vmware-physical-mobility-service-overview.md#download-latest-mobility-agent-installer-for-suse-11-sp3-suse-11-sp4-rhel-5-cent-os-5-debian-7-debian-8-debian-9-oracle-linux-6-and-ubuntu-1404-server). <br/> Debian 10, Debian 11 [(Review supported kernel versions)](#debian-kernel-versions).
SUSE Linux | SUSE Linux Enterprise Server 12 SP1, SP2, SP3, SP4, [SP5](https://support.microsoft.com/help/4570609) [(review supported kernel versions)](#suse-linux-enterprise-server-12-supported-kernel-versions) <br/> SUSE Linux Enterprise Server 15, 15 SP1, SP2, SP3, SP4 [(review supported kernel versions)](#suse-linux-enterprise-server-15-supported-kernel-versions) <br/> SUSE Linux Enterprise Server 11 SP3. [Ensure to download latest mobility agent installer on the configuration server](vmware-physical-mobility-service-overview.md#download-latest-mobility-agent-installer-for-suse-11-sp3-suse-11-sp4-rhel-5-cent-os-5-debian-7-debian-8-debian-9-oracle-linux-6-and-ubuntu-1404-server). </br> SUSE Linux Enterprise Server 11 SP4 </br> **Note**: Upgrading replicated machines from SUSE Linux Enterprise Server 11 SP3 to SP4 isn't supported. To upgrade, disable replication and re-enable after the upgrade. <br/>|
Oracle Linux | 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, [7.7](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery), [7.8](https://support.microsoft.com/help/4573888/), [7.9](https://support.microsoft.com/help/4597409/), [8.0](https://support.microsoft.com/help/4573888/), [8.1](https://support.microsoft.com/help/4573888/), [8.2](https://support.microsoft.com/topic/b19c8190-5f88-43ea-85b1-d9e0cc5ca7e8), [8.3](https://support.microsoft.com/topic/b19c8190-5f88-43ea-85b1-d9e0cc5ca7e8), [8.4](https://support.microsoft.com/topic/update-rollup-59-for-azure-site-recovery-kb5008707-66a65377-862b-4a4c-9882-fd74bdc7a81e), 8.5, 8.6, 8.7  <br/><br/> **Note:** Support for Oracle Linux `9.0` and `9.1` is removed from support matrix, as issues were observed using Azure Site Recovery with Oracle Linux 9.0 and 9.1. <br><br> Running the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3, 4 & 5 (UEK3, UEK4, UEK5)<br/><br/>8.1<br/>Running on all UEK kernels and RedHat kernel <= 3.10.0-1062.* are supported in [9.35](https://support.microsoft.com/help/4573888/) Support for rest of the RedHat kernels is available in [9.36](https://support.microsoft.com/help/4578241/).  

> [!NOTE]
>- For each of the Windows versions, Azure Site Recovery only supports [Long-Term Servicing Channel (LTSC)](/windows-server/get-started/servicing-channels-comparison#long-term-servicing-channel-ltsc) builds.  [Semi-Annual Channel](/windows-server/get-started/servicing-channels-comparison#semi-annual-channel) releases are currently unsupported at this time.
>- Please ensure that for Linux versions, Azure Site Recovery doesn't support customized OS images. Only the stock kernels that are part of the distribution minor version release/update are supported.

### Ubuntu kernel versions

**Supported release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
14.04 LTS | [9.51](https://support.microsoft.com/en-us/topic/update-rollup-64-for-azure-site-recovery-kb5020102-23db9799-102c-4378-9754-2f19f6c7858a), [9.52](https://support.microsoft.com/topic/update-rollup-65-for-azure-site-recovery-kb5021964-15db362f-faac-417d-ad71-c22424df43e0), [9.53](https://support.microsoft.com/topic/update-rollup-66-for-azure-site-recovery-kb5023601-c306c467-c896-4c9d-b236-73b21ca27ca5), [9.54](https://support.microsoft.com/topic/update-rollup-67-for-azure-site-recovery-9fa97dbb-4539-4b6c-a0f8-c733875a119f), [9.55](https://support.microsoft.com/topic/update-rollup-68-for-azure-site-recovery-a81c2d22-792b-4cde-bae5-dc7df93a7810) | 3.13.0-24-generic to 3.13.0-170-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-148-generic,<br/>4.15.0-1023-azure to 4.15.0-1045-azure |
|||
16.04 LTS | [9.51](https://support.microsoft.com/topic/update-rollup-64-for-azure-site-recovery-kb5020102-23db9799-102c-4378-9754-2f19f6c7858a), [9.52](https://support.microsoft.com/topic/update-rollup-65-for-azure-site-recovery-kb5021964-15db362f-faac-417d-ad71-c22424df43e0), [9.53](https://support.microsoft.com/topic/update-rollup-66-for-azure-site-recovery-kb5023601-c306c467-c896-4c9d-b236-73b21ca27ca5), [9.54](https://support.microsoft.com/topic/update-rollup-67-for-azure-site-recovery-9fa97dbb-4539-4b6c-a0f8-c733875a119f), [9.55](https://support.microsoft.com/topic/update-rollup-68-for-azure-site-recovery-a81c2d22-792b-4cde-bae5-dc7df93a7810) | 4.4.0-21-generic to 4.4.0-210-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic, 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-142-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1113-azure </br> 4.15.0-101-generic to 4.15.0-107-generic |
|||
18.04 LTS |[9.55](https://support.microsoft.com/topic/update-rollup-68-for-azure-site-recovery-a81c2d22-792b-4cde-bae5-dc7df93a7810) | 4.15.0-1163-azure <br> 4.15.0-1164-azure <br> 4.15.0-1165-azure <br> 4.15.0-1166-azure <br> 4.15.0-1167-azure <br> 4.15.0-210-generic <br> 4.15.0-211-generic <br> 4.15.0-212-generic <br> 4.15.0-213-generic <br> 5.4.0-1107-azure <br> 5.4.0-1108-azure <br> 5.4.0-1109-azure <br> 5.4.0-147-generic <br> 5.4.0-148-generic <br> 5.4.0-149-generic <br> 5.4.0-150-generic | 
18.04 LTS|[9.54](https://support.microsoft.com/topic/update-rollup-67-for-azure-site-recovery-9fa97dbb-4539-4b6c-a0f8-c733875a119f)| 4.15.0-1161-azure <br> 4.15.0-1162-azure <br> 4.15.0-204-generic <br> 4.15.0-206-generic <br> 4.15.0-208-generic <br> 4.15.0-209-generic <br> 5.4.0-1101-azure <br> 5.4.0-1103-azure <br> 5.4.0-1104-azure <br> 5.4.0-1105-azure <br> 5.4.0-1106-azure <br> 5.4.0-139-generic <br> 5.4.0-144-generic <br> 5.4.0-146-generic |
18.04 LTS|[9.53](https://support.microsoft.com/topic/update-rollup-66-for-azure-site-recovery-kb5023601-c306c467-c896-4c9d-b236-73b21ca27ca5)| 4.15.0-1157-azure </br> 4.15.0-1158-azure </br> 4.15.0-1159-azure </br> 4.15.0-197-generic </br> 4.15.0-200-generic </br> 4.15.0-201-generic </br> 4.15.0-202-generic <br> 5.4.0-1095-azure <br> 5.4.0-1098-azure <br> 5.4.0-1100-azure <br> 5.4.0-132-generic <br> 5.4.0-135-generic <br> 5.4.0-136-generic <br> 5.4.0-137-generic |
18.04 LTS | [9.52](https://support.microsoft.com/en-us/topic/update-rollup-65-for-azure-site-recovery-kb5021964-15db362f-faac-417d-ad71-c22424df43e0) | 4.15.0-1153-azure </br> 4.15.0-194-generic </br> 4.15.0-196-generic </br>5.4.0-1094-azure </br> 5.4.0-128-generic </br> 5.4.0-131-generic|
18.04 LTS |[9.51](https://support.microsoft.com/en-us/topic/update-rollup-64-for-azure-site-recovery-kb5020102-23db9799-102c-4378-9754-2f19f6c7858a)|4.15.0-1149-azure </br> 4.15.0-1150-azure </br> 4.15.0-1151-azure </br>4.15.0-191-generic </br> 4.15.0-192-generic </br> 4.15.0-193-generic </br> 5.4.0-1089-azure </br> 5.4.0-1090-azure </br> 5.4.0-1091-azure </br> 5.4.0-124-generic </br> 5.4.0-125-generic </br> 5.4.0-126-generic|
|||
20.04 LTS|[9.55](https://support.microsoft.com/topic/update-rollup-68-for-azure-site-recovery-a81c2d22-792b-4cde-bae5-dc7df93a7810) | 5.15.0-1037-azure <br> 5.15.0-1038-azure <br> 5.15.0-1039-azure <br> 5.15.0-1040-azure <br> 5.15.0-1041-azure <br> 5.15.0-70-generic <br> 5.15.0-71-generic <br> 5.15.0-72-generic <br> 5.15.0-73-generic <br> 5.15.0-75-generic <br> 5.15.0-76-generic <br> 5.4.0-1107-azure <br> 5.4.0-1108-azure <br> 5.4.0-1109-azure <br> 5.4.0-1110-azure <br> 5.4.0-1111-azure <br> 5.4.0-148-generic <br> 5.4.0-149-generic <br> 5.4.0-150-generic <br> 5.4.0-152-generic <br> 5.4.0-153-generic  |
20.04 LTS|[9.54](https://support.microsoft.com/topic/update-rollup-67-for-azure-site-recovery-9fa97dbb-4539-4b6c-a0f8-c733875a119f)| 5.15.0-1033-azure <br> 5.15.0-1034-azure <br> 5.15.0-1035-azure <br> 5.15.0-1036-azure <br> 5.15.0-60-generic <br> 5.15.0-67-generic <br> 5.15.0-69-generic <br> 5.4.0-1101-azure <br> 5.4.0-1103-azure <br> 5.4.0-1104-azure <br> 5.4.0-1105-azure <br> 5.4.0-1106-azure <br> 5.4.0-139-generic <br> 5.4.0-144-generic <br> 5.4.0-146-generic <br> 5.4.0-147-generic |
20.04 LTS|[9.53](https://support.microsoft.com/topic/update-rollup-66-for-azure-site-recovery-kb5023601-c306c467-c896-4c9d-b236-73b21ca27ca5)| 5.15.0-1023-azure </br> 5.15.0-1029-azure </br> 5.15.0-1030-azure </br> 5.15.0-1031-azure </br> 5.15.0-53-generic </br> 5.15.0-56-generic </br> 5.15.0-57-generic <br> 5.15.0-58-generic <br> 5.4.0-1095-azure <br> 5.4.0-1098-azure <br> 5.4.0-1100-azure <br> 5.4.0-132-generic <br> 5.4.0-135-generic <br> 5.4.0-136-generic <br> 5.4.0-137-generic |
20.04 LTS|[9.52](https://support.microsoft.com/topic/update-rollup-65-for-azure-site-recovery-kb5021964-15db362f-faac-417d-ad71-c22424df43e0)|5.15.0-1021-azure </br> 5.15.0-1022-azure </br> 5.15.0-50-generic </br> 5.15.0-52-generic </br> 5.4.0-1094-azure </br> 5.4.0-128-generic </br> 5.4.0-131-generic |
20.04 LTS|[9.51](https://support.microsoft.com/topic/update-rollup-64-for-azure-site-recovery-kb5020102-23db9799-102c-4378-9754-2f19f6c7858a)|5.13.0-1009-azure </br> 5.13.0-1012-azure </br> 5.13.0-1013-azure </br> 5.13.0-1014-azure </br> 5.13.0-1017-azure </br> 5.13.0-1021-azure </br> 5.13.0-1022-azure </br> 5.13.0-1023-azure </br>5.13.0-1025-azure </br> 5.13.0-1028-azure </br> 5.13.0-1029-azure </br> 5.13.0-1031-azure </br> 5.13.0-21-generic </br> 5.13.0-23-generic </br> 5.13.0-25-generic </br> 5.13.0-27-generic </br> 5.13.0-28-generic </br> 5.13.0-30-generic </br> 5.13.0-35-generic </br> 5.13.0-37-generic </br> 5.13.0-39-generic </br> 5.13.0-41-generic </br> 5.13.0-44-generic </br> 5.13.0-48-generic </br> 5.13.0-51-generic </br> 5.13.0-52-generic </br> 5.15.0-1007-azure </br> 5.15.0-1008-azure </br> 5.15.0-1013-azure </br> 5.15.0-1014-azure </br> 5.15.0-1017-azure </br> 5.15.0-1019-azure </br> 5.15.0-1020-azure </br> 5.15.0-33-generic </br> 5.15.0-41-generic </br> 5.15.0-43-generic </br> 5.15.0-46-generic </br> 5.15.0-48-generic </br> 5.4.0-1089-azure </br> 5.4.0-1090-azure </br> 5.4.0-1091-azure </br> 5.4.0-124-generic </br> 5.4.0-125-generic </br> 5.4.0-126-generic |
|||
22.04 LTS <br> **Note**: Support for Ubuntu 22.04 is available for Modernized experience only and not available for Classic experience yet. |[9.55](https://support.microsoft.com/topic/update-rollup-68-for-azure-site-recovery-a81c2d22-792b-4cde-bae5-dc7df93a7810)| 5.15.0-1037-azure <br> 5.15.0-1038-azure <br> 5.15.0-1039-azure <br> 5.15.0-1040-azure <br> 5.15.0-1041-azure <br> 5.15.0-71-generic <br> 5.15.0-72-generic <br> 5.15.0-73-generic <br> 5.15.0-75-generic <br> 5.15.0-76-generic |
22.04 LTS <br> **Note**: Support for Ubuntu 22.04 is available for Modernized experience only and not available for Classic experience yet. |[9.54](https://support.microsoft.com/topic/update-rollup-67-for-azure-site-recovery-9fa97dbb-4539-4b6c-a0f8-c733875a119f)| 5.15.0-1033-azure <br> 5.15.0-1034-azure <br> 5.15.0-1035-azure <br> 5.15.0-1036-azure <br> 5.15.0-60-generic <br> 5.15.0-67-generic <br> 5.15.0-69-generic <br> 5.15.0-70-generic|
22.04 LTS <br> **Note**: Support for Ubuntu 22.04 is available for Modernized experience only and not available for Classic experience yet. |[9.53](https://support.microsoft.com/topic/update-rollup-66-for-azure-site-recovery-kb5023601-c306c467-c896-4c9d-b236-73b21ca27ca5)|5.15.0-1003-azure </br> 5.15.0-1005-azure </br> 5.15.0-1007-azure </br> 5.15.0-1008-azure </br> 5.15.0-1010-azure </br> 5.15.0-1012-azure </br> 5.15.0-1013-azure <br> 5.15.0-1014-azure <br> 5.15.0-1017-azure <br> 5.15.0-1019-azure <br> 5.15.0-1020-azure <br> 5.15.0-1021-azure <br> 5.15.0-1022-azure <br> 5.15.0-1023-azure <br> 5.15.0-1024-azure <br> 5.15.0-1029-azure <br> 5.15.0-1030-azure <br> 5.15.0-1031-azure <br> 5.15.0-25-generic <br> 5.15.0-27-generic <br> 5.15.0-30-generic <br> 5.15.0-33-generic <br> 5.15.0-35-generic <br> 5.15.0-37-generic <br> 5.15.0-39-generic <br> 5.15.0-40-generic <br> 5.15.0-41-generic <br> 5.15.0-43-generic <br> 5.15.0-46-generic <br> 5.15.0-47-generic <br> 5.15.0-48-generic <br> 5.15.0-50-generic <br> 5.15.0-52-generic <br> 5.15.0-53-generic <br> 5.15.0-56-generic <br> 5.15.0-57-generic <br> 5.15.0-58-generic |

### Debian kernel versions


**Supported release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
Debian 7 | [9.51](https://support.microsoft.com/topic/update-rollup-64-for-azure-site-recovery-kb5020102-23db9799-102c-4378-9754-2f19f6c7858a), <br> [9.52](https://support.microsoft.com/en-us/topic/update-rollup-65-for-azure-site-recovery-kb5021964-15db362f-faac-417d-ad71-c22424df43e0), [9.53](https://support.microsoft.com/topic/update-rollup-66-for-azure-site-recovery-kb5023601-c306c467-c896-4c9d-b236-73b21ca27ca5), [9.54](https://support.microsoft.com/topic/update-rollup-67-for-azure-site-recovery-9fa97dbb-4539-4b6c-a0f8-c733875a119f), [9.55](https://support.microsoft.com/topic/update-rollup-68-for-azure-site-recovery-a81c2d22-792b-4cde-bae5-dc7df93a7810) | 3.2.0-4-amd64 to 3.2.0-6-amd64, 3.16.0-0.bpo.4-amd64 |
|||
Debian 8 | [9.51](https://support.microsoft.com/en-us/topic/update-rollup-64-for-azure-site-recovery-kb5020102-23db9799-102c-4378-9754-2f19f6c7858a), <br> [9.52](https://support.microsoft.com/en-us/topic/update-rollup-65-for-azure-site-recovery-kb5021964-15db362f-faac-417d-ad71-c22424df43e0), [9.53](https://support.microsoft.com/topic/update-rollup-66-for-azure-site-recovery-kb5023601-c306c467-c896-4c9d-b236-73b21ca27ca5), [9.54](https://support.microsoft.com/topic/update-rollup-67-for-azure-site-recovery-9fa97dbb-4539-4b6c-a0f8-c733875a119f), [9.55](https://support.microsoft.com/topic/update-rollup-68-for-azure-site-recovery-a81c2d22-792b-4cde-bae5-dc7df93a7810) | 3.16.0-4-amd64 to 3.16.0-11-amd64, 4.9.0-0.bpo.4-amd64 to 4.9.0-0.bpo.12-amd64 |
|||
Debian 9.1 | [9.55](https://support.microsoft.com/topic/update-rollup-68-for-azure-site-recovery-a81c2d22-792b-4cde-bae5-dc7df93a7810) | No new Debian 9.1 kernels supported in this release|
Debian 9.1 | [9.54](https://support.microsoft.com/topic/update-rollup-67-for-azure-site-recovery-9fa97dbb-4539-4b6c-a0f8-c733875a119f)| No new Debian 9.1 kernels supported in this release
Debian 9.1 | [9.53](https://support.microsoft.com/topic/update-rollup-66-for-azure-site-recovery-kb5023601-c306c467-c896-4c9d-b236-73b21ca27ca5) | No new Debian 9.1 kernels supported in this release|
Debian 9.1 | [9.52](https://support.microsoft.com/en-us/topic/update-rollup-65-for-azure-site-recovery-kb5021964-15db362f-faac-417d-ad71-c22424df43e0) | No new Debian 9.1 kernels supported in this release|
Debian 9.1 | [9.51](https://support.microsoft.com/en-us/topic/update-rollup-64-for-azure-site-recovery-kb5020102-23db9799-102c-4378-9754-2f19f6c7858a),| No new Debian 9.1 kernels supported in this release|
|||
Debian 10 | [9.55](https://support.microsoft.com/topic/update-rollup-68-for-azure-site-recovery-a81c2d22-792b-4cde-bae5-dc7df93a7810) | 4.19.0-24-amd64 <br> 4.19.0-24-cloud-amd64 <br> 5.10.0-0.deb10.22-amd64 <br> 5.10.0-0.deb10.22-cloud-amd64 <br> 5.10.0-0.deb10.23-amd64 <br> 5.10.0-0.deb10.23-cloud-amd64 |
Debian 10 | [9.54](https://support.microsoft.com/topic/update-rollup-67-for-azure-site-recovery-9fa97dbb-4539-4b6c-a0f8-c733875a119f)| 5.10.0-0.bpo.3-amd64 <br> 5.10.0-0.bpo.3-cloud-amd64 <br> 5.10.0-0.bpo.4-amd64 <br> 5.10.0-0.bpo.4-cloud-amd64 <br> 5.10.0-0.bpo.5-amd64 <br> 5.10.0-0.bpo.5-cloud-amd64 <br> 5.10.0-0.deb10.21-amd64 <br> 5.10.0-0.deb10.21-cloud-amd64 |
Debian 10 | [9.53](https://support.microsoft.com/topic/update-rollup-66-for-azure-site-recovery-kb5023601-c306c467-c896-4c9d-b236-73b21ca27ca5) | 4.19.0-23-amd64 </br> 4.19.0-23-cloud-amd64 </br> 5.10.0-0.deb10.20-amd64 </br> 5.10.0-0.deb10.20-cloud-amd64 |
Debian 10 | [9.52](https://support.microsoft.com/topic/update-rollup-65-for-azure-site-recovery-kb5021964-15db362f-faac-417d-ad71-c22424df43e0) | 4.19.0-22-amd64 </br> 4.19.0-22-cloud-amd64 </br> 5.10.0-0.deb10.19-amd64 </br> 5.10.0-0.deb10.19-cloud-amd64 |
Debian 10 | [9.51](https://support.microsoft.com/topic/update-rollup-64-for-azure-site-recovery-kb5020102-23db9799-102c-4378-9754-2f19f6c7858a) | 5.10.0-0.deb10.16-amd64 </br> 5.10.0-0.deb10.16-cloud-amd64 </br> 5.10.0-0.deb10.17-amd64 </br> 5.10.0-0.deb10.17-cloud-amd64 |
|||
Debian 11 | [9.55](https://support.microsoft.com/topic/update-rollup-68-for-azure-site-recovery-a81c2d22-792b-4cde-bae5-dc7df93a7810)| 5.10.0-22-amd64 <br> 5.10.0-22-cloud-amd64 <br> 5.10.0-23-amd64 <br> 5.10.0-23-cloud-amd64 |
Debian 11 | [9.54](https://support.microsoft.com/topic/update-rollup-67-for-azure-site-recovery-9fa97dbb-4539-4b6c-a0f8-c733875a119f)| 5.10.0-21-amd64 <br> 5.10.0-21-cloud-amd64 |
Debian 11 | [9.53](https://support.microsoft.com/topic/update-rollup-66-for-azure-site-recovery-kb5023601-c306c467-c896-4c9d-b236-73b21ca27ca5) | 5.10.0-20-amd64 </br> 5.10.0-20-cloud-amd64 |
Debian 11 | [9.52](https://support.microsoft.com/topic/update-rollup-65-for-azure-site-recovery-kb5021964-15db362f-faac-417d-ad71-c22424df43e0) | 5.10.0-10-amd64 <br> 5.10.0-10-cloud-amd64 </br> 5.10.0-12-amd64 <br> 5.10.0-12-cloud-amd64 </br> 5.10.0-13-amd64 </br> 5.10.0-13-cloud-amd64 </br> 5.10.0-14-amd64 </br> 5.10.0-14-cloud-amd64 <br> 5.10.0-15-amd64 <br> 5.10.0-15-cloud-amd64 </br> 5.10.0-16-amd64 <br> 5.10.0-16-cloud-amd64 </br> 5.10.0-17-amd64 </br> 5.10.0-17-cloud-amd64 <br> 5.10.0-18-amd64 </br> 5.10.0-18-cloud-amd64 </br> 5.10.0-19-amd64 <br> 5.10.0-19-cloud-amd64


### SUSE Linux Enterprise Server 12 supported kernel versions

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
SUSE Linux Enterprise Server 15, SP1, SP2, SP3, SP4 | [9.55](https://support.microsoft.com/topic/update-rollup-68-for-azure-site-recovery-a81c2d22-792b-4cde-bae5-dc7df93a7810) | By default, all [stock SUSE 12 SP1, SP2, SP3, SP4, SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br> 4.12.14-16.130-azure:5 <br> 4.12.14-16.133-azure:5 <br> 4.12.14-16.136-azure:5  |
SUSE Linux Enterprise Server 15, SP1, SP2, SP3, SP4 | [9.54](https://support.microsoft.com/topic/update-rollup-67-for-azure-site-recovery-9fa97dbb-4539-4b6c-a0f8-c733875a119f) | By default, all [stock SUSE 12 SP1, SP2, SP3, SP4, SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br> 4.12.14-16.124-azure:5 <br> 4.12.14-16.127-azure:5 |
SUSE Linux Enterprise Server 15, SP1, SP2, SP3, SP4 | [9.53](https://support.microsoft.com/topic/update-rollup-66-for-azure-site-recovery-kb5023601-c306c467-c896-4c9d-b236-73b21ca27ca5) | By default, all [stock SUSE 12 SP1, SP2, SP3, SP4, SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br> 4.12.14-16.115-azure:5 <br> 4.12.14-16.120-azure:5 |
SUSE Linux Enterprise Server 12 (SP1, SP2, SP3, SP4, SP5) | [9.52](https://support.microsoft.com/en-us/topic/update-rollup-65-for-azure-site-recovery-kb5021964-15db362f-faac-417d-ad71-c22424df43e0) |  All [stock SUSE 12 SP1, SP2, SP3, SP4, SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br> 4.12.14-16.112-azure:5 |
SUSE Linux Enterprise Server 12 (SP1, SP2, SP3, SP4, SP5) | [9.51](https://support.microsoft.com/en-us/topic/update-rollup-64-for-azure-site-recovery-kb5020102-23db9799-102c-4378-9754-2f19f6c7858a) | All [stock SUSE 12 SP1, SP2, SP3, SP4, SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br> 4.12.14-16.106-azure:5 </br> 4.12.14-16.109-azure:5 |

### SUSE Linux Enterprise Server 15 supported kernel versions

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
SUSE Linux Enterprise Server 15, SP1, SP2, SP3, SP4 | [9.55](https://support.microsoft.com/topic/update-rollup-68-for-azure-site-recovery-a81c2d22-792b-4cde-bae5-dc7df93a7810) | By default, all [stock SUSE 15, SP1, SP2, SP3, SP4 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br> 5.14.21-150400.14.49-azure:4 <br> 5.14.21-150400.14.52-azure:4 |
SUSE Linux Enterprise Server 15, SP1, SP2, SP3, SP4 | [9.54](https://support.microsoft.com/topic/update-rollup-67-for-azure-site-recovery-9fa97dbb-4539-4b6c-a0f8-c733875a119f) | By default, all [stock SUSE 15, SP1, SP2, SP3, SP4 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br> 5.14.21-150400.14.31-azure:4 <br> 5.14.21-150400.14.34-azure:4 <br> 5.14.21-150400.14.37-azure:4 <br> 5.14.21-150400.14.43-azure:4 <br> 5.14.21-150400.14.46-azure:4 <br> 5.14.21-150400.14.40-azure:4 |
SUSE Linux Enterprise Server 15, SP1, SP2, SP3, SP4 | [9.53](https://support.microsoft.com/topic/update-rollup-66-for-azure-site-recovery-kb5023601-c306c467-c896-4c9d-b236-73b21ca27ca5) | By default, all [stock SUSE 15, SP1, SP2, SP3, SP4 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br> 5.14.21-150400.14.21-azure:4 <br> 5.14.21-150400.14.28-azure:4 <br> 5.3.18-150300.38.88-azure:3 |
SUSE Linux Enterprise Server 15, SP1, SP2, SP3, SP4 | [9.52](https://support.microsoft.com/en-us/topic/update-rollup-65-for-azure-site-recovery-kb5021964-15db362f-faac-417d-ad71-c22424df43e0) | By default, all [stock SUSE 15, SP1, SP2, SP3, SP4 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br> 5.14.21-150400.12-azure:4 <br> 5.14.21-150400.14.10-azure:4 <br> 5.14.21-150400.14.13-azure:4 <br> 5.14.21-150400.14.16-azure:4 <br> 5.14.21-150400.14.7-azure:4 <br> 5.3.18-150300.38.80-azure:3 <br> 5.3.18-150300.38.83-azure:3 |
SUSE Linux Enterprise Server 15, SP1, SP2, SP3 | [9.51](https://support.microsoft.com/en-us/topic/update-rollup-64-for-azure-site-recovery-kb5020102-23db9799-102c-4378-9754-2f19f6c7858a) | By default, all [stock SUSE 15, SP1, SP2, SP3 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br> 5.3.18-150300.38.75-azure:3 |

## Linux file systems/guest storage

**Component** | **Supported**
--- | ---
File systems | ext3, ext4, XFS, BTRFS (conditions applicable as per this table)
Logical volume management (LVM) provisioning| Thick provision - Yes <br></br> Thin provision - Yes, it is supported from [Update Rollup 61](https://support.microsoft.com/topic/update-rollup-61-for-azure-site-recovery-kb5012960-a1cc029b-03ad-446f-9365-a00b41025d39) onwards. It wasn't supported in earlier Mobility service versions.
Volume manager | - LVM is supported.<br/> - /boot on LVM is supported from [Update Rollup 31](https://support.microsoft.com/help/4478871/) (version 9.20 of the Mobility service) onwards. It wasn't supported in earlier Mobility service versions.<br/> - Multiple OS disks aren't supported.
Paravirtualized storage devices | Devices exported by paravirtualized drivers aren't supported.
Multi-queue block IO devices | Not supported.
Physical servers with the HP CCISS storage controller | Not supported.
Device/Mount point naming convention | Device name or mount point name should be unique.<br/> Ensure that no two devices/mount points have case-sensitive names. For example, naming devices for the same VM as *device1* and *Device1* isn't supported.
Directories | If you're running a version of the Mobility service earlier than version 9.20 (released in [Update Rollup 31](https://support.microsoft.com/help/4478871/)), then these restrictions apply:<br/><br/> - These directories (if set up as separate partitions/file-systems) must be on the same OS disk on the source server: /(root), /boot, /usr, /usr/local, /var, /etc.</br> - The /boot directory should be on a disk partition and not be an LVM volume.<br/><br/> From version 9.20 onwards, these restrictions don't apply.
Boot directory | - Boot disks with GPT partition format are supported. GPT disks are also supported as data disks.<br/><br/> Multiple boot disks on a VM aren't supported.<br/><br/> - /boot on an LVM volume across more than one disk isn't supported.<br/> - A machine without a boot disk can't be replicated.
Free space requirements| 2 GB on the /(root) partition <br/><br/> 250 MB on the installation folder
XFSv5 | XFSv5 features on XFS file systems, such as metadata checksum, are supported (Mobility service version 9.10 onwards).<br/> Use the xfs_info utility to check the XFS superblock for the partition. If `ftype` is set to 1, then XFSv5 features are in use.
BTRFS | BTRFS is supported from [Update Rollup 34](https://support.microsoft.com/help/4490016) (version 9.22 of the Mobility service) onwards. BTRFS isn't supported if:<br/><br/> - The BTRFS file system subvolume is changed after enabling protection.</br> - The BTRFS file system is spread over multiple disks.</br> - The BTRFS file system supports RAID.

## VM/Disk management

**Action** | **Details**
--- | ---
Resize disk on replicated VM | Resizing up on the source VM is supported. Resizing down on the source VM isn't supported. Resizing should be performed before failover, directly in the VM properties. No need to disable/re-enable replication.<br/><br/> If you change the source VM after failover, the changes aren't captures.<br/><br/> If you change the disk size on the Azure VM after failover, when you fail back, Site Recovery creates a new VM with the updates.
Add disk on replicated VM | Not supported.<br/> Disable replication for the VM, add the disk, and then re-enable replication.
Exclude disk before replicating VM | Supported for VMware machines. <br/><br/> Not supported for Physical machines, if using modernized experience. 

> [!NOTE]
>  - Any change to disk identity isn't supported. For example, if the disk partitioning has been changed from GPT to MBR or vice versa, then this will change the disk identity. In such a scenario, the replication will break and a fresh setup will be required.
> - For Linux machines, device name change isn't supported as it has an impact on the disk identity.
> - In Modernized, resizing the disk size to reduce it from its original size, isn't supported.

## Network

**Component** | **Supported**
--- | ---
Host network NIC Teaming | Supported for VMware VMs and physical machine replication.
Host network VLAN | Yes.
Host network IPv4 | Yes.
Host network IPv6 | No.
Guest/server network NIC Teaming | No.
Guest/server network IPv4 | Yes.
Guest/server network IPv6 | No.
Guest/server network static IP (Windows) | Yes.
Guest/server network static IP (Linux) | Yes. <br/><br/>VMs are configured to use DHCP on failback.
Guest/server network multiple NICs | Yes.
Private link access to Site Recovery service | Yes. [Learn more](hybrid-how-to-enable-replication-private-endpoints.md).


## Azure VM network (after failover)

**Component** | **Supported**
--- | ---
Azure ExpressRoute | Yes
ILB | Yes
ELB | Yes
Azure Traffic Manager | Yes
Multi-NIC | Yes
Reserved IP address | Yes
IPv4 | Yes
Retain source IP address | Yes
Azure virtual network service endpoints<br/> | Yes
Accelerated networking | No

## Storage
**Component** | **Supported**
--- | ---
Dynamic disk | OS disk must be a basic disk. <br/><br/>Data disks can be dynamic disks
Docker disk configuration | No
Host NFS | Yes for VMware<br/><br/> No for physical servers
Host SAN (iSCSI/FC) | Yes
Host vSAN | Yes for VMware<br/><br/> N/A for physical servers
Host multipath (MPIO) | Yes, tested with Microsoft DSM, EMC PowerPath 5.7 SP4, EMC PowerPath DSM for CLARiiON
Host Virtual Volumes (VVols) | Yes for VMware<br/><br/> N/A for physical servers
Guest/server VMDK | Yes
Guest/server shared cluster disk | No
Guest/server encrypted disk | No
FIPS encryption | No
Guest/server NFS | No
Guest/server iSCSI | For Migration - Yes<br/>For Disaster Recovery - No, iSCSI will failback as an attached disk to the VM
Guest/server SMB 3.0 | No
Guest/server RDM | Yes<br/><br/> N/A for physical servers
Guest/server disk > 1 GB | Yes, disk must be larger than 1024 MB<br/><br/>Up to 32,767 GB when replicating to managed disk (9.41 version onwards)<br></br> Up to 4,095 GB when replicating to storage accounts
Guest/server disk with 4K logical and 4k physical sector size | No
Guest/server disk with 4K logical and 512-bytes physical sector size | No
Guest/server volume with striped disk >4 TB | Yes
Logical volume management (LVM)| Thick provisioning - Yes <br></br> Thin provisioning - Yes, it is supported from [Update Rollup 61](https://support.microsoft.com/topic/update-rollup-61-for-azure-site-recovery-kb5012960-a1cc029b-03ad-446f-9365-a00b41025d39) onwards. It wasn't supported in earlier Mobility service versions.
Guest/server - Storage Spaces | No
Guest/server - NVMe interface | Yes
Guest/server hot add/remove disk | No
Guest/server - exclude disk | Yes
Guest/server multipath (MPIO) | No
ReFS | Resilient File System is supported with Mobility service version 9.23 or higher
Guest/server EFI/UEFI boot | - Supported for all [Azure Marketplace UEFI operating systems](../virtual-machines/generation-2.md#generation-2-vm-images-in-azure-marketplace). <br/> - UEFI boot is supported as long as the Secure Boot setting is disabled. [Learn more.](../virtual-machines/generation-2.md#on-premises-vs-azure-generation-2-vms) <br/> - Windows 2008 R2 SP1 & Windows 2008 SP2 servers with UEFI isn't supported. 
RAID disk| Hardware RAID disks aren't supported.<br/> Software RAID disks are supported. 

## Replication channels

|**Type of replication**   |**Supported**  |
|---------|---------|
|Offloaded Data Transfers  (ODX)    |       No  |
|Offline Seeding        |   No      |
| Azure Data Box | No

## Azure storage

**Component** | **Supported**
--- | ---
Locally redundant storage | Yes
Geo-redundant storage | Yes
Read-access geo-redundant storage | Yes
Cool storage | No
Hot storage| No
Block blobs | No
Encryption at host | No 
Encryption at rest (SSE)| Yes
Encryption at rest (CMK)| Yes (via PowerShell Az 3.3.0 module onwards)
Double Encryption at rest | Yes (via PowerShell Az 3.3.0 module onwards). Learn more on supported regions for [Windows](../virtual-machines/disk-encryption.md) and [Linux](../virtual-machines/disk-encryption.md).
Premium storage | Yes
Secure transfer option | Yes
Import/export service | No
Azure Storage firewalls for VNets | Yes.<br/> Configured on target storage/cache storage account (used to store replication data).
General-purpose v2 storage accounts (hot and cool tiers) | Yes (Transaction costs are substantially higher for V2 compared to V1)
Soft delete | Not supported.

## Azure compute

**Feature** | **Supported**
--- | ---
Availability sets | Yes 
Proximity Placement Groups | Yes
Availability zones | No
HUB | Yes
Managed disks | Yes

## Azure VM requirements

On-premises VMs replicated to Azure must meet the Azure VM requirements summarized in this table. When Site Recovery runs prerequisites check for replication, the check will fail if some of the requirements aren't met.

**Component** | **Requirements** | **Details**
--- | --- | ---
Guest operating system | Verify [supported operating systems](#replicated-machines) for replicated machines. | Check fails if unsupported.
Guest operating system architecture | 64-bit. | Check fails if unsupported.
Operating system disk size | Up to 2,048 GB for Generation 1 machines. <br> Up to 4,095 GB for Generation 2 machines. | Check fails if unsupported.
Operating system disk count | 1 </br> boot and system partition on different disks isn't supported | Check fails if unsupported.
Data disk count | 64 or less. | Check fails if unsupported.
Data disk size | Up to 32 TB when replicating to managed disk (9.41 version onwards)<br> Up to 4 TB when replicating to storage account </br> Each premium storage account can host up to 35 TB of data </br> Minimum disk size requirement - at least 1 GB  | Check fails if unsupported.
RAM | Site Recovery driver consumes 6% of RAM.
Network adapters | Multiple adapters are supported. |
Shared VHD | Not supported. | Check fails if unsupported.
FC disk | Not supported. | Check fails if unsupported.
BitLocker | Not supported. | BitLocker must be disabled before you enable replication for a machine and should stay disabled while the machine is replicating via Site Recovery. |
VM name | From 1 to 63 characters.<br/><br/> Restricted to letters, numbers, and hyphens.<br/><br/> The machine name must start and end with a letter or number. |  Update the value in the machine properties in Site Recovery.

## Resource group limits

To understand the number of virtual machines that can be protected under a single resource group, refer to the article on [subscription limits and quotas](../azure-resource-manager/management/azure-subscription-service-limits.md#resource-group-limits).

## Churn limits

The following table provides the Azure Site Recovery limits.
- These limits are based on our tests, but don't cover all possible app I/O combinations.
- Actual results can vary based on your application I/O mix.
- For best results, we strongly recommend that you run the [Deployment Planner tool](site-recovery-deployment-planner.md), and perform extensive application testing using test failovers to get the true performance picture for your app.

**Replication target** | **Average source disk I/O size** |**Average source disk data churn** | **Total source disk data churn per day**
---|---|---|---
Standard storage | 8 KB    | 2 MB/s | 168 GB per disk
Premium P10 or P15 disk | 8 KB    | 2 MB/s | 168 GB per disk
Premium P10 or P15 disk | 16 KB | 4 MB/s |    336 GB per disk
Premium P10 or P15 disk | 32 KB or greater | 8 MB/s | 672 GB per disk
Premium P20 or P30 or P40 or P50 disk | 8 KB    | 5 MB/s | 421 GB per disk
Premium P20 or P30 or P40 or P50 disk | 16 KB or greater |20 MB/s | 1684 GB per disk


**Source data churn** | **Maximum Limit**
---|---
Peak data churn across all disks on a VM | 54 MB/s
Maximum data churn per day supported by a Process Server | 2 TB

- These are average numbers assuming a 30 percent I/O overlap.
- Site Recovery is capable of handling higher throughput based on overlap ratio, larger write sizes, and actual workload I/O behavior.
- These numbers assume a typical backlog of approximately five minutes. That is, after data is uploaded, it is processed and a recovery point is created within five minutes.

## Storage account limits

As average churn on the disks increases, the number of disks that a storage account can support decreases. The below table may be used as a guide for making decisions on number of storage accounts that need to be provisioned.

**Storage account type**    |    **Churn = 4 MBps per disk**    |    **Churn = 8 MBps per disk**
---    |    ---    |    ---
V1 storage account    |    600 disks    |    300 disks
V2 storage account    |    1500 disks    |    750 disks

Please note that the above limits are applicable to VMware and Hyper-V scenarios only.

## Vault tasks

**Action** | **Supported**
--- | ---
Move vault across resource groups | No
Move vault within and across subscriptions | No
Move storage, network, Azure VMs across resource groups | No
Move storage, network, Azure VMs within and across subscriptions. | No


## Obtain latest components

**Name** | **Description** | **Details**
--- | --- | ---
Configuration server | Installed on-premises.<br/> Coordinates communications between on-premises VMware servers or physical machines, and Azure. | - [Learn about](vmware-physical-azure-config-process-server-overview.md) the configuration server.<br/> - [Learn about](vmware-azure-manage-configuration-server.md#upgrade-the-configuration-server) upgrading to the latest version.<br/> - [Learn about](vmware-azure-deploy-configuration-server.md) setting up the configuration server.
Process server | Installed by default on the configuration server.<br/> Receives replication data, optimizes it with caching, compression, and encryption, and sends it to Azure.<br/> As your deployment grows, you can add additional process servers to handle larger volumes of replication traffic. | - [Learn about](vmware-physical-azure-config-process-server-overview.md) the process server.<br/> - [Learn about](vmware-azure-manage-process-server.md#upgrade-a-process-server) upgrading to the latest version.<br/> - [Learn about](vmware-physical-large-deployment.md#set-up-a-process-server) setting up scale-out process servers.
Mobility Service | Installed on VMware VM or physical servers you want to replicate.<br/> Coordinates replication between on-premises VMware servers/physical servers and Azure.| - [Learn about](vmware-physical-mobility-service-overview.md) the Mobility service.<br/> - [Learn about](vmware-physical-manage-mobility-service.md#update-mobility-service-from-azure-portal) upgrading to the latest version.<br/>



## Next steps
[Learn how](tutorial-prepare-azure.md) to prepare Azure for disaster recovery of VMware VMs.

[9.32 UR]: https://support.microsoft.com/en-in/help/4538187/update-rollup-44-for-azure-site-recovery
[9.31 UR]: https://support.microsoft.com/en-in/help/4537047/update-rollup-43-for-azure-site-recovery
[9.30 UR]: https://support.microsoft.com/en-in/help/4531426/update-rollup-42-for-azure-site-recovery
[9.29 UR]: https://support.microsoft.com/en-in/help/4528026/update-rollup-41-for-azure-site-recovery
[9.28 UR]: https://support.microsoft.com/en-in/help/4521530/update-rollup-40-for-azure-site-recovery
[9.27 UR]: https://support.microsoft.com/en-in/help/4517283/update-rollup-39-for-azure-site-recovery
[9.26 UR]: https://support.microsoft.com/en-in/help/4513507/update-rollup-38-for-azure-site-recovery
[9.25 UR]: https://support.microsoft.com/en-in/help/4508614/update-rollup-37-for-azure-site-recovery
[9.24 UR]: https://support.microsoft.com/en-in/help/4503156
[9.23 UR]: https://support.microsoft.com/en-in/help/4494485/update-rollup-35-for-azure-site-recovery
[9.22 UR]: https://support.microsoft.com/help/4489582/update-rollup-33-for-azure-site-recovery
[9.21 UR]: https://support.microsoft.com/help/4485985/update-rollup-32-for-azure-site-recovery
[9.20 UR]: https://support.microsoft.com/help/4478871/update-rollup-31-for-azure-site-recovery
[9.19 UR]: https://support.microsoft.com/help/4468181/azure-site-recovery-update-rollup-30
[9.18 UR]: https://support.microsoft.com/help/4466466/update-rollup-29-for-azure-site-recovery
