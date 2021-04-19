---
title: Support matrix for Azure VM disaster recovery with Azure Site Recovery
description: Summarizes support for Azure VMs disaster recovery to a secondary region with Azure Site Recovery.
ms.topic: article
ms.date: 11/29/2020

---

# Support matrix for Azure VM disaster recovery between Azure regions

This article summarizes support and prerequisites for disaster recovery of Azure VMs from one Azure region to another, using the [Azure Site Recovery](site-recovery-overview.md) service.


## Deployment method support

**Deployment** |  **Support**
--- | ---
**Azure portal** | Supported.
**PowerShell** | Supported. [Learn more](azure-to-azure-powershell.md)
**REST API** | Supported.
**CLI** | Not currently supported


## Resource support

**Resource action** | **Details**
--- | ---
**Move vaults across resource groups** | Not supported
**Move compute/storage/network resources across resource groups** | Not supported.<br/><br/> If you move a VM or associated components such as storage/network after the VM is replicating, you need to disable and then re-enable replication for the VM.
**Replicate Azure VMs from one subscription to another for disaster recovery** | Supported within the same Azure Active Directory tenant.
**Migrate VMs across regions within supported geographical clusters (within and across subscriptions)** | Supported within the same Azure Active Directory tenant.
**Migrate VMs within the same region** | Not supported.
**Azure Dedicated Hosts** | Not supported.

## Region support

You can replicate and recover VMs between any two regions within the same geographic cluster. Geographic clusters are defined keeping data latency and sovereignty in mind.


**Geographic cluster** | **Azure regions**
-- | --
America | Canada East, Canada Central, South Central US, West Central US, East US, East US 2, West US, West US 2, Central US, North Central US
Europe | UK West, UK South, North Europe, West Europe, South Africa West, South Africa North, Norway East, France Central, Switzerland North, Germany West Central
Asia | South India, Central India, West India, Southeast Asia, East Asia, Japan East, Japan West, Korea Central, Korea South
JIO | JIO India West
Australia    | Australia East, Australia Southeast, Australia Central, Australia Central 2
Azure Government    | US GOV Virginia, US GOV Iowa, US GOV Arizona, US GOV Texas, US DOD East, US DOD Central
Germany    | Germany Central, Germany Northeast
China | China East, China North, China North2, China East2
Brazil | Brazil South
Restricted Regions reserved for in-country disaster recovery |Switzerland West reserved for Switzerland North, France South reserved for France Central, UAE Central restricted for UAE North customers, Norway West for Norway East customers, JIO India Central for JIO India West customers, Brazil Southeast for Brazil South

>[!NOTE]
>
> - For **Brazil South**, you can replicate and fail over to these regions: Brazil Southeast, South Central US, West Central US, East US, East US 2, West US, West US 2, and North Central US.
> - Brazil South can only be used as a source region from which VMs can replicate using Site Recovery. It can't act as a target region. This is because of latency issues due to geographical distances. Note that if you fail over from Brazil South as a source region to a target, failback to Brazil South from the target region is supported. Brazil Southeast can only be used as a target region.
> - You can work within regions for which you have appropriate access.
> - If the region in which you want to create a vault doesn't show, make sure your subscription has access to create resources in that region.
> - If you can't see a region within a geographic cluster when you enable replication, make sure your subscription has permissions to create VMs in that region.

## Cache storage

This table summarizes support for the cache storage account used by Site Recovery during replication.

**Setting** | **Support** | **Details**
--- | --- | ---
General purpose V2 storage accounts (Hot and Cool tier) | Supported | Usage of GPv2 is not recommended because transaction costs for V2 are substantially higher than V1 storage accounts.
Premium storage | Not supported | Standard storage accounts are used for cache storage, to help optimize costs.
Azure Storage firewalls for virtual networks  | Supported | If you are using firewall enabled cache storage account or target storage account, ensure you ['Allow trusted Microsoft services'](../storage/common/storage-network-security.md#exceptions).<br></br>Also, ensure that you allow access to at least one subnet of source Vnet.

The table below lists the limits in terms of number of disks that can replicate to a single storage account.

**Storage account type**    |    **Churn = 4 MBps per disk**    |    **Churn = 8 MBps per disk**
---    |    ---    |    ---
V1 storage account    |    300 disks    |    150 disks
V2 storage account    |    750 disks    |    375 disks

As average churn on the disks increases, the number of disks that a storage account can support decreases. The above table may be used as a guide for making decisions on number of storage accounts that need to be provisioned.

Please note that the above limits are specific to Azure to Azure and zone to zone DR scenarios. 

## Replicated machine operating systems

Site Recovery supports replication of Azure VMs running the operating systems listed in this section. Note that if an already replicating machine is subsequently upgraded (or downgraded) to a different major kernel, you need to disable replication and re-enable replication after the upgrade.

### Windows


**Operating system** | **Details**
--- | ---
Windows Server 2019 | Supported for Server Core, Server with Desktop Experience.
Windows Server 2016  | Supported Server Core, Server with Desktop Experience.
Windows Server 2012 R2 | Supported.
Windows Server 2012 | Supported.
Windows Server 2008 R2 with SP1/SP2 | Supported.<br/><br/> From version [9.30](https://support.microsoft.com/en-us/help/4531426/update-rollup-42-for-azure-site-recovery) of the Mobility service extension for Azure VMs, you need to install a Windows [servicing stack update (SSU)](https://support.microsoft.com/help/4490628) and [SHA-2 update](https://support.microsoft.com/help/4474419) on machines running Windows Server 2008 R2 SP1/SP2.  SHA-1 isn't supported from September 2019, and if SHA-2 code signing isn't enabled the agent extension won't install/upgrade as expected. Learn more about [SHA-2 upgrade and requirements](https://aka.ms/SHA-2KB).
Windows 10 (x64) | Supported.
Windows 8.1 (x64) | Supported.
Windows 8 (x64) | Supported.
Windows 7 (x64) with SP1 onwards | From version [9.30](https://support.microsoft.com/en-us/help/4531426/update-rollup-42-for-azure-site-recovery) of the Mobility service extension for Azure VMs, you need to install a Windows [servicing stack update (SSU)](https://support.microsoft.com/help/4490628) and [SHA-2 update](https://support.microsoft.com/help/4474419) on machines running Windows 7 with SP1.  SHA-1 isn't supported from September 2019, and if SHA-2 code signing isn't enabled the agent extension won't install/upgrade as expected.. Learn more about [SHA-2 upgrade and requirements](https://aka.ms/SHA-2KB).



#### Linux

**Operating system** | **Details**
--- | ---
Red Hat Enterprise Linux | 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6,[7.7](https://support.microsoft.com/help/4528026/update-rollup-41-for-azure-site-recovery), [7.8](https://support.microsoft.com/help/4564347/), [7.9](https://support.microsoft.com/help/4578241/), [8.0](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery), 8.1, [8.2](https://support.microsoft.com/help/4570609/), [8.3](https://support.microsoft.com/help/4597409/)
CentOS | 6.5, 6.6, 6.7, 6.8, 6.9, 6.10 </br> 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, [7.8](https://support.microsoft.com/help/4564347/), [7.9 pre-GA version](https://support.microsoft.com/help/4578241/), 7.9 GA version is supported from 9.37 hot fix patch** </br> 8.0, 8.1, [8.2](https://support.microsoft.com/en-us/help/4570609), [8.3](https://support.microsoft.com/help/4597409/)
Ubuntu 14.04 LTS Server | Includes support for all 14.04.*x* versions; [Supported kernel versions](#supported-ubuntu-kernel-versions-for-azure-virtual-machines); 
Ubuntu 16.04 LTS Server | Includes support for all 16.04.*x* versions; [Supported kernel version](#supported-ubuntu-kernel-versions-for-azure-virtual-machines)<br/><br/> Ubuntu servers using password-based authentication and sign in, and the cloud-init package to configure cloud VMs, might have password-based sign in disabled on failover (depending on the cloudinit configuration). Password-based sign in can be re-enabled on the virtual machine by resetting the password from the Support > Troubleshooting > Settings menu (of the failed over VM in the Azure portal.
Ubuntu 18.04 LTS Server | Includes support for all 18.04.*x* versions; [Supported kernel version](#supported-ubuntu-kernel-versions-for-azure-virtual-machines)<br/><br/> Ubuntu servers using password-based authentication and sign in, and the cloud-init package to configure cloud VMs, might have password-based sign in disabled on failover (depending on the cloudinit configuration). Password-based sign in can be re-enabled on the virtual machine by resetting the password from the Support > Troubleshooting > Settings menu (of the failed over VM in the Azure portal.
Ubuntu 20.04 LTS server | Includes support for all 20.04.*x* versions; [Supported kernel version](#supported-ubuntu-kernel-versions-for-azure-virtual-machines)
Debian 7 | Includes support for all 7. *x* versions [Supported kernel versions](#supported-debian-kernel-versions-for-azure-virtual-machines)
Debian 8 | Includes support for all 8. *x* versions [Supported kernel versions](#supported-debian-kernel-versions-for-azure-virtual-machines)
Debian 9 | Includes support for 9.1 to 9.13. Debian 9.0 is not supported. [Supported kernel versions](#supported-debian-kernel-versions-for-azure-virtual-machines)
Debian 10 | [Supported kernel versions](#supported-debian-kernel-versions-for-azure-virtual-machines)
SUSE Linux Enterprise Server 12 | SP1, SP2, SP3, SP4, SP5  [(Supported kernel versions)](#supported-suse-linux-enterprise-server-12-kernel-versions-for-azure-virtual-machines)
SUSE Linux Enterprise Server 15 | 15, SP1, SP2[(Supported kernel versions)](#supported-suse-linux-enterprise-server-15-kernel-versions-for-azure-virtual-machines)
SUSE Linux Enterprise Server 11 | SP3<br/><br/> Upgrade of replicating machines from SP3 to SP4 isn't supported. If a replicated machine has been upgraded, you need to disable replication and re-enable replication after the upgrade.
SUSE Linux Enterprise Server 11 | SP4
Oracle Linux | 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, [7.7](https://support.microsoft.com/en-us/help/4531426/update-rollup-42-for-azure-site-recovery), [7.8](https://support.microsoft.com/help/4573888/), [7.9](https://support.microsoft.com/help/4597409), [8.0](https://support.microsoft.com/help/4573888/), [8.1](https://support.microsoft.com/help/4573888/) (running the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3, 4 & 5 (UEK3, UEK4, UEK5)<br/><br/>8.1 (running on all UEK kernels and RedHat kernel <= 3.10.0-1062.* are supported in [9.35](https://support.microsoft.com/help/4573888/). Support for rest of the RedHat kernels is available in [9.36](https://support.microsoft.com/help/4578241/))

> [!NOTE]
> For Linux versions, Azure Site Recovery does not support customized OS images. Only the stock kernels that are part of the distribution minor version release/update are supported.

**Note: To support latest Linux kernels within 15 days of release, Azure Site Recovery rolls out hot fix patch on top of latest mobility agent version. This fix is rolled out in between two major version releases. To update to latest version of mobility agent (including hot fix patch) follow steps mentioned in [this article](service-updates-how-to.md#azure-vm-disaster-recovery-to-azure). This patch is currently rolled out for mobility agents used in Azure to Azure DR scenario.

#### Supported Ubuntu kernel versions for Azure virtual machines

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
14.04 LTS | [9.37](https://support.microsoft.com/help/4582666/), [9.38](https://support.microsoft.com/help/4590304/), [9.39](https://support.microsoft.com/help/4597409/), [9.40](https://support.microsoft.com/en-us/topic/update-rollup-53-for-azure-site-recovery-060268ef-5835-bb49-7cbc-e8c1e6c6e12a), [9.41](https://support.microsoft.com/en-us/topic/update-rollup-54-for-azure-site-recovery-50873c7c-272c-4a7a-b9bb-8cd59c230533)| 3.13.0-24-generic to 3.13.0-170-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-148-generic,<br/>4.15.0-1023-azure to 4.15.0-1045-azure |
|||
16.04 LTS | [9.41](https://support.microsoft.com/en-us/topic/update-rollup-54-for-azure-site-recovery-50873c7c-272c-4a7a-b9bb-8cd59c230533) | 4.4.0-21-generic to 4.4.0-201-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-133-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1106-azure <br/> 4.4.0-203-generic, 4.4.0-204-generic, 4.4.0-206-generic, 4.15.0-136-generic, 4.15.0-137-generic, 4.15.0-139-generic, 4.15.0-140-generic, 4.15.0-1108-azure, 4.15.0-1109-azure, 4.15.0-1110-azure, 4.15.0-1111-azure through 9.41 hot fix patch**|
16.04 LTS | [9.40](https://support.microsoft.com/en-us/topic/update-rollup-53-for-azure-site-recovery-060268ef-5835-bb49-7cbc-e8c1e6c6e12a) | 4.4.0-21-generic to 4.4.0-197-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-128-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1102-azure </br> 4.15.0-132-generic, 4.4.0-200-generic, 4.15.0-1106-azure, 4.15.0-133-generic, 4.4.0-201-generic through 9.40 hot fix patch**|
16.04 LTS | [9.39](https://support.microsoft.com/help/4597409/) | 4.4.0-21-generic to 4.4.0-194-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-123-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1098-azure </br> 4.4.0-197-generic, 4.15.0-126-generic, 4.15.0-128-generic, 4.15.0-1100-azure, 4.15.0-1102-azure through 9.39 hot fix patch**|
16.04 LTS | [9.38](https://support.microsoft.com/help/4590304/) | 4.4.0-21-generic to 4.4.0-190-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-118-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1096-azure </br> 4.4.0-193-generic, 4.15.0-120-generic, 4.15.0-122-generic, 4.15.0-1098-azure through 9.38 hot fix patch**|
16.04 LTS | [9.37](https://support.microsoft.com/help/4582666/) | 4.4.0-21-generic to 4.4.0-189-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-115-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1093-azure </br> 4.4.0-190-generic, 4.15.0-117-generic, 4.15.0-118-generic, 4.15.0-1095-azure, 4.15.0-1096-azure through 9.37 hot fix patch**|
|||
18.04 LTS | [9.41](https://support.microsoft.com/en-us/topic/update-rollup-54-for-azure-site-recovery-50873c7c-272c-4a7a-b9bb-8cd59c230533) | 4.15.0-20-generic to 4.15.0-135-generic </br> 4.18.0-13-generic to 4.18.0-25-generic </br> 5.0.0-15-generic to 5.0.0-65-generic </br> 5.3.0-19-generic to 5.3.0-70-generic </br> 5.4.0-37-generic to 5.4.0-59-generic</br> 5.4.0-60-generic to 5.4.0-65-generic </br> 4.15.0-1009-azure to 4.15.0-1106-azure </br> 4.18.0-1006-azure to 4.18.0-1025-azure </br> 5.0.0-1012-azure to 5.0.0-1036-azure </br> 5.3.0-1007-azure to 5.3.0-1035-azure </br> 5.4.0-1020-azure to 5.4.0-1039-azure </br> 4.15.0-136-generic, 4.15.0-137-generic, 4.15.0-139-generic, 4.15.0-140-generic, 5.3.0-72-generic, 5.4.0-66-generic, 5.4.0-67-generic, 5.4.0-70-generic, 4.15.0-1108-azure, 4.15.0-1111-azure, 5.4.0-1040-azure, 5.4.0-1041-azure, 5.4.0-1043-azure, 4.15.0-1109-azure, 4.15.0-1110-azure through 9.41 hot fix patch**|
18.04 LTS | [9.40](https://support.microsoft.com/en-us/topic/update-rollup-53-for-azure-site-recovery-060268ef-5835-bb49-7cbc-e8c1e6c6e12a) | 4.15.0-20-generic to 4.15.0-129-generic </br> 4.18.0-13-generic to 4.18.0-25-generic </br> 5.0.0-15-generic to 5.0.0-63-generic </br> 5.3.0-19-generic to 5.3.0-69-generic </br> 5.4.0-37-generic to 5.4.0-59-generic</br> 4.15.0-1009-azure to 4.15.0-1103-azure </br> 4.18.0-1006-azure to 4.18.0-1025-azure </br> 5.0.0-1012-azure to 5.0.0-1036-azure </br> 5.3.0-1007-azure to 5.3.0-1035-azure </br> 5.4.0-1020-azure to 5.4.0-1035-azure </br> 4.15.0-1104-azure, 4.15.0-130-generic, 4.15.0-132-generic, 5.4.0-1036-azure, 5.4.0-60-generic, 5.4.0-62-generic, 4.15.0-1106-azure, 4.15.0-134-generic, 4.15.0-135-generic, 5.4.0-1039-azure, 5.4.0-64-generic, 5.4.0-65-generic through 9.40 hot fix patch**|
18.04 LTS | [9.39](https://support.microsoft.com/help/4597409/) | 4.15.0-20-generic to 4.15.0-123-generic </br> 4.18.0-13-generic to 4.18.0-25-generic </br> 5.0.0-15-generic to 5.0.0-63-generic </br> 5.3.0-19-generic to 5.3.0-69-generic </br> 5.4.0-37-generic to 5.4.0-53-generic</br> 4.15.0-1009-azure to 4.15.0-1099-azure </br> 4.18.0-1006-azure to 4.18.0-1025-azure </br> 5.0.0-1012-azure to 5.0.0-1036-azure </br> 5.3.0-1007-azure to 5.3.0-1035-azure </br> 5.4.0-1020-azure to 5.4.0-1031-azure </br> 4.15.0-124-generic, 5.4.0-54-generic, 5.4.0-1032-azure, 5.4.0-56-generic, 4.15.0-1100-azure, 4.15.0-126-generic, 4.15.0-128-generic, 5.4.0-58-generic, 4.15.0-1102-azure, 5.4.0-1034-azure through 9.39 hot fix patch**|
18.04 LTS | [9.38](https://support.microsoft.com/help/4590304/) | 4.15.0-20-generic to 4.15.0-118-generic </br> 4.18.0-13-generic to 4.18.0-25-generic </br> 5.0.0-15-generic to 5.0.0-61-generic </br> 5.3.0-19-generic to 5.3.0-67-generic </br> 5.4.0-37-generic to 5.4.0-48-generic</br> 4.15.0-1009-azure to 4.15.0-1096-azure </br> 4.18.0-1006-azure to 4.18.0-1025-azure </br> 5.0.0-1012-azure to 5.0.0-1036-azure </br> 5.3.0-1007-azure to 5.3.0-1035-azure </br> 5.4.0-1020-azure to 5.4.0-1026-azure </br> 4.15.0-121-generic, 4.15.0-122-generic, 5.0.0-62-generic, 5.3.0-68-generic, 5.4.0-51-generic, 5.4.0-52-generic, 4.15.0-1099-azure,  5.4.0-1031-azure through 9.38 hot fix patch**|
18.04 LTS | [9.37](https://support.microsoft.com/help/4582666/) | 4.15.0-20-generic to 4.15.0-115-generic </br> 4.18.0-13-generic to 4.18.0-25-generic </br> 5.0.0-15-generic to 5.0.0-60-generic </br> 5.3.0-19-generic to 5.3.0-66-generic </br> 5.4.0-37-generic to 5.4.0-45-generic</br> 4.15.0-1009-azure to 4.15.0-1093-azure </br> 4.18.0-1006-azure to 4.18.0-1025-azure </br> 5.0.0-1012-azure to 5.0.0-1036-azure </br> 5.3.0-1007-azure to 5.3.0-1035-azure </br> 5.4.0-1020-azure to 5.4.0-1023-azure</br> 4.15.0-117-generic, 4.15.0-118-generic, 5.0.0-61-generic, 5.3.0-67-generic, 5.4.0-47-generic, 5.4.0-48-generic, 4.15.0-1095-azure, 4.15.0-1096-azure, 5.4.0-1025-azure, 5.4.0-1026-azure through 9.37 hot fix patch**|
|||
20.04 LTS |[9.41](https://support.microsoft.com/en-us/topic/update-rollup-54-for-azure-site-recovery-50873c7c-272c-4a7a-b9bb-8cd59c230533)| 5.4.0-26-generic to 5.4.0-65 </br> -generic 5.4.0-1010-azure to 5.4.0-1039-azure </br> 5.8.0-29-generic to 5.8.0-43-generic </br> 5.4.0-66-generic, 5.4.0-67-generic, 5.4.0-70-generic, 5.8.0-44-generic, 5.8.0-45-generic, 5.8.0-48-generic, 5.4.0-1040-azure, 5.4.0-1041-azure, 5.4.0-1043-azure through 9.41 hot fix patch**|
20.04 LTS |[9.40](https://support.microsoft.com/en-us/topic/update-rollup-53-for-azure-site-recovery-060268ef-5835-bb49-7cbc-e8c1e6c6e12a)| 5.4.0-26-generic to 5.4.0-59 </br> -generic 5.4.0-1010-azure to 5.4.0-1035-azure </br> 5.8.0-29-generic to 5.8.0-34-generic </br> 5.4.0-1036-azure, 5.4.0-60-generic, 5.4.0-62-generic, 5.8.0-36-generic, 5.8.0-38-generic, 5.4.0-1039-azure, 5.4.0-64-generic, 5.4.0-65-generic, 5.8.0-40-generic, 5.8.0-41-generic through 9.40 hot fix patch**|
20.04 LTS |[9.39](https://support.microsoft.com/help/4597409/) | 5.4.0-26-generic to 5.4.0-53 </br> -generic 5.4.0-1010-azure to 5.4.0-1031-azure </br> 5.4.0-54-generic, 5.8.0-29-generic, 5.4.0-1032-azure, 5.4.0-56-generic, 5.8.0-31-generic, 5.8.0-33-generic, 5.4.0-58-generic, 5.4.0-1034-azure through 9.39 hot fix patch**
20.04 LTS |[9.39](https://support.microsoft.com/help/4597409/) | 5.4.0-26-generic to 5.4.0-53 </br> -generic 5.4.0-1010-azure to 5.4.0-1031-azure </br> 5.4.0-54-generic, 5.8.0-29-generic, 5.4.0-1032-azure, 5.4.0-56-generic, 5.8.0-31-generic, 5.8.0-33-generic, 5.4.0-58-generic, 5.4.0-1034-azure through 9.39 hot fix patch**
20.04 LTS |[9.38](https://support.microsoft.com/help/4590304/) | 5.4.0-26-generic to 5.4.0-48 </br> -generic 5.4.0-1010-azure to 5.4.0-1026-azure </br> 5.4.0-51-generic, 5.4.0-52-generic, 5.8.0-23-generic, 5.8.0-25-generic, 5.4.0-1031-azure through 9.38 hot fix patch**
20.04 LTS |[9.37](https://support.microsoft.com/help/4582666/) | 5.4.0-26-generic to 5.4.0-45 </br> -generic 5.4.0-1010-azure to 5.4.0-1023-azure </br> 5.4.0-47-generic, 5.4.0-48-generic, 5.4.0-1025-azure, 5.4.0-1026-azure through 9.37 hot fix patch**

**Note: To support latest Linux kernels within 15 days of release, Azure Site Recovery rolls out hot fix patch on top of latest mobility agent version. This fix is rolled out in between two major version releases. To update to latest version of mobility agent (including hot fix patch) follow steps mentioned in [this article](service-updates-how-to.md#azure-vm-disaster-recovery-to-azure). This patch is currently rolled out for mobility agents used in Azure to Azure DR scenario.

#### Supported Debian kernel versions for Azure virtual machines

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
Debian 7 | [9.37](https://support.microsoft.com/help/4582666/), [9.38](https://support.microsoft.com/help/4590304/), [9.39](https://support.microsoft.com/help/4597409/), [9.40](https://support.microsoft.com/en-us/topic/update-rollup-53-for-azure-site-recovery-060268ef-5835-bb49-7cbc-e8c1e6c6e12a) , [9.41](https://support.microsoft.com/en-us/topic/update-rollup-54-for-azure-site-recovery-50873c7c-272c-4a7a-b9bb-8cd59c230533)| 3.2.0-4-amd64 to 3.2.0-6-amd64, 3.16.0-0.bpo.4-amd64 |
|||
Debian 8 | [9.37](https://support.microsoft.com/help/4582666/), [9.38](https://support.microsoft.com/help/4590304/), [9.39](https://support.microsoft.com/help/4597409/), [9.40](https://support.microsoft.com/en-us/topic/update-rollup-53-for-azure-site-recovery-060268ef-5835-bb49-7cbc-e8c1e6c6e12a), [9.41](https://support.microsoft.com/en-us/topic/update-rollup-54-for-azure-site-recovery-50873c7c-272c-4a7a-b9bb-8cd59c230533) | 3.16.0-4-amd64 to 3.16.0-11-amd64, 4.9.0-0.bpo.4-amd64 to 4.9.0-0.bpo.11-amd64 |
|||
Debian 9.1 | [9.41](https://support.microsoft.com/en-us/topic/update-rollup-54-for-azure-site-recovery-50873c7c-272c-4a7a-b9bb-8cd59c230533) | 4.9.0-1-amd64 to 4.9.0-14-amd64 </br> 4.19.0-0.bpo.1-amd64 to 4.19.0-0.bpo.14-amd64 </br> 4.19.0-0.bpo.1-cloud-amd64 to 4.19.0-0.bpo.14-cloud-amd64 </br> 4.9.0-15-amd64, 4.19.0-0.bpo.16-amd64, 4.19.0-0.bpo.16-cloud-amd64 through 9.41 hot fix patch**
Debian 9.1 | [9.40](https://support.microsoft.com/en-us/topic/update-rollup-53-for-azure-site-recovery-060268ef-5835-bb49-7cbc-e8c1e6c6e12a) | 4.9.0-1-amd64 to 4.9.0-14-amd64 </br> 4.19.0-0.bpo.1-amd64 to 4.19.0-0.bpo.13-amd64 </br> 4.19.0-0.bpo.1-cloud-amd64 to 4.19.0-0.bpo.13-cloud-amd64 
Debian 9.1 | [9.39](https://support.microsoft.com/help/4597409/) | 4.9.0-1-amd64 to 4.9.0-14-amd64 </br> 4.19.0-0.bpo.1-amd64 to 4.19.0-0.bpo.12-amd64 </br> 4.19.0-0.bpo.1-cloud-amd64 to 4.19.0-0.bpo.12-cloud-amd64 </br> 4.19.0-0.bpo.13-amd64, 4.19.0-0.bpo.13-cloud-amd64 through 9.39 hot fix patch**</br> 
Debian 9.1 | [9.38](https://support.microsoft.com/help/4590304/) | 4.9.0-1-amd64 to 4.9.0-13-amd64 </br> 4.19.0-0.bpo.1-amd64 to 4.19.0-0.bpo.11-amd64 </br> 4.19.0-0.bpo.1-cloud-amd64 to 4.19.0-0.bpo.11-cloud-amd64 </br> 4.9.0-14-amd64, 4.19.0-0.bpo.12-amd64, 4.19.0-0.bpo.12-cloud-amd64 through 9.38 hot fix patch**
Debian 9.1 | [9.37](https://support.microsoft.com/help/4582666/) | 4.9.0-3-amd64 to 4.9.0-13-amd64, 4.19.0-0.bpo.6-amd64 to 4.19.0-0.bpo.10-amd64, 4.19.0-0.bpo.6-cloud-amd64 to 4.19.0-0.bpo.10-cloud-amd64
|||
Debian 10 | [9.41](https://support.microsoft.com/en-us/topic/update-rollup-54-for-azure-site-recovery-50873c7c-272c-4a7a-b9bb-8cd59c230533) | 4.19.0-5-amd64 to 4.19.0-14-amd64 </br> 4.19.0-6-cloud-amd64 to 4.19.0-14-cloud-amd64 </br> 5.8.0-0.bpo.2-amd64 </br> 5.8.0-0.bpo.2-cloud-amd64 </br> 4.19.0-10-cloud-amd64, 4.19.0-16-amd64, 4.19.0-16-cloud-amd64 through 9.41 hot fix patch**
Debian 10 | [9.40](https://support.microsoft.com/en-us/topic/update-rollup-53-for-azure-site-recovery-060268ef-5835-bb49-7cbc-e8c1e6c6e12a) | 4.19.0-5-amd64 to 4.19.0-13-amd64 </br> 4.19.0-6-cloud-amd64 to 4.19.0-13-cloud-amd64 </br> 5.8.0-0.bpo.2-amd64 </br> 5.8.0-0.bpo.2-cloud-amd64

**Note: To support latest Linux kernels within 15 days of release, Azure Site Recovery rolls out hot fix patch on top of latest mobility agent version. This fix is rolled out in between two major version releases. To update to latest version of mobility agent (including hot fix patch) follow steps mentioned in [this article](service-updates-how-to.md#azure-vm-disaster-recovery-to-azure). This patch is currently rolled out for mobility agents used in Azure to Azure DR scenario.

#### Supported SUSE Linux Enterprise Server 12 kernel versions for Azure virtual machines

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3,SP4, SP5) | [9.41](https://support.microsoft.com/en-us/topic/update-rollup-54-for-azure-site-recovery-50873c7c-272c-4a7a-b9bb-8cd59c230533) | All [stock SUSE 12 SP1,SP2,SP3,SP4,SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br></br> 4.4.138-4.7-azure to 4.4.180-4.31-azure,</br>4.12.14-6.3-azure to 4.12.14-6.43-azure </br> 4.12.14-16.7-azure to 4.12.14-16.44-azure </br> 4.12.14-16.47-azure through 9.41 hot fix patch**|
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3,SP4, SP5) | [9.40](https://support.microsoft.com/en-us/topic/update-rollup-53-for-azure-site-recovery-060268ef-5835-bb49-7cbc-e8c1e6c6e12a) | All [stock SUSE 12 SP1,SP2,SP3,SP4,SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br></br> 4.4.138-4.7-azure to 4.4.180-4.31-azure,</br>4.12.14-6.3-azure to 4.12.14-6.43-azure </br> 4.12.14-16.7-azure to 4.12.14-16.38-azure </br> 4.12.14-16.41-azure through 9.40 hot fix patch**|
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3,SP4, SP5) | [9.39](https://support.microsoft.com/help/4597409/) | All [stock SUSE 12 SP1,SP2,SP3,SP4,SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br></br> 4.4.138-4.7-azure to 4.4.180-4.31-azure,</br>4.12.14-6.3-azure to 4.12.14-6.43-azure </br> 4.12.14-16.7-azure to 4.12.14-16.34-azure </br> 4.12.14-16.38-azure through 9.39 hot fix patch**|
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3,SP4, SP5) | [9.38](https://support.microsoft.com/help/4590304/) | All [stock SUSE 12 SP1,SP2,SP3,SP4,SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br></br> 4.4.138-4.7-azure to 4.4.180-4.31-azure,</br>4.12.14-6.3-azure to 4.12.14-6.43-azure </br> 4.12.14-16.7-azure to 4.12.14-16.28-azure |
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3,SP4, SP5) | [9.37](https://support.microsoft.com/help/4582666/) | All [stock SUSE 12 SP1,SP2,SP3,SP4,SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br></br> 4.4.138-4.7-azure to 4.4.180-4.31-azure,</br>4.12.14-6.3-azure to 4.12.14-6.43-azure </br> 4.12.14-16.7-azure to 4.12.14-16.22-azure </br> 4.12.14-16.25-azure, 4.12.14-16.28-azure through 9.37 hot fix patch**|

#### Supported SUSE Linux Enterprise Server 15 kernel versions for Azure virtual machines

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
SUSE Linux Enterprise Server 15, SP1, SP2 | [9.41](https://support.microsoft.com/en-us/topic/update-rollup-54-for-azure-site-recovery-50873c7c-272c-4a7a-b9bb-8cd59c230533)  | By default, all [stock SUSE 15, SP1, SP2 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br></br> 4.12.14-5.5-azure to 4.12.14-5.47-azure </br></br> 4.12.14-8.5-azure to 4.12.14-8.55-azure </br> 5.3.18-16-azure </br> 5.3.18-18.5-azure to 5.3.18-18.35-azure </br> 5.3.18-18.38-azure through 9.41 hot fix patch**
SUSE Linux Enterprise Server 15, SP1, SP2 | [9.40](https://support.microsoft.com/en-us/topic/update-rollup-53-for-azure-site-recovery-060268ef-5835-bb49-7cbc-e8c1e6c6e12a)  | By default, all [stock SUSE 15, SP1, SP2 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br></br> 4.12.14-5.5-azure to 4.12.14-5.47-azure </br></br> 4.12.14-8.5-azure to 4.12.14-8.58-azure </br> 5.3.18-16-azure </br> 5.3.18-18.5-azure to 5.3.18-18.29-azure </br> 5.3.18-18.32-azure, 4.12.14-8.58-azure through 9.40 hot fix patch**
SUSE Linux Enterprise Server 15, SP1, SP2 | [9.39](https://support.microsoft.com/help/4597409/)  | By default, all [stock SUSE 15, SP1, SP2 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br></br> 4.12.14-5.5-azure to 4.12.14-5.47-azure </br></br> 4.12.14-8.5-azure to 4.12.14-8.47-azure </br> 5.3.18-16-azure </br> 5.3.18-18.5-azure to 5.3.18-18.21-azure </br> 4.12.14-8.52-azure, 5.3.18-18.24-azure, 4.12.14-8.55-azure, 5.3.18-18.29-azure through 9.39 hot fix patch**
SUSE Linux Enterprise Server 15, SP1, SP2 | [9.38](https://support.microsoft.com/help/4590304/)  | By default, all [stock SUSE 15, SP1, SP2 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br></br> 4.12.14-5.5-azure to 4.12.14-5.47-azure </br></br> 4.12.14-8.5-azure to 4.12.14-8.44-azure </br> 5.3.18-16-azure </br> 5.3.18-18.5-azure to 5.3.18-18.18-azure </br> 4.12.14-8.47-azure, 5.3.18-18.21-azure through 9.38 hot fix patch**
SUSE Linux Enterprise Server 15 and 15 SP1 | [9.37](https://support.microsoft.com/help/4582666/)  | By default, all [stock SUSE 15, SP1, SP2 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br></br> 4.12.14-5.5-azure to 4.12.14-5.47-azure </br></br> 4.12.14-8.5-azure to 4.12.14-8.38-azure </br> 4.12.14-8.41-azure, 4.12.14-8.44-azure through 9.37 hot fix patch**

**Note: To support latest Linux kernels within 15 days of release, Azure Site Recovery rolls out hot fix patch on top of latest mobility agent version. This fix is rolled out in between two major version releases. To update to latest version of mobility agent (including hot fix patch) follow steps mentioned in [this article](service-updates-how-to.md#azure-vm-disaster-recovery-to-azure). This patch is currently rolled out for mobility agents used in Azure to Azure DR scenario.

## Replicated machines - Linux file system/guest storage

* File systems: ext3, ext4, XFS, BTRFS
* Volume manager: LVM2

> [!NOTE]
> Multipath software is not supported.


## Replicated machines - compute settings

**Setting** | **Support** | **Details**
--- | --- | ---
Size | Any Azure VM size with at least 2 CPU cores and 1-GB RAM | Verify [Azure virtual machine sizes](../virtual-machines/sizes.md).
Availability sets | Supported | If you enable replication for an Azure VM with the default options, an availability set is created automatically, based on the source region settings. You can modify these settings.
Availability zones | Supported |
Hybrid Use Benefit (HUB) | Supported | If the source VM has a HUB license enabled, a test failover or failed over VM also uses the HUB license.
Virtual machine scale sets | Not supported |
Azure gallery images - Microsoft published | Supported | Supported if the VM runs on a supported operating system.
Azure Gallery images - Third party published | Supported | Supported if the VM runs on a supported operating system.
Custom images - Third party published | Supported | Supported if the VM runs on a supported operating system.
VMs migrated using Site Recovery | Supported | If a VMware VM or physical machine was migrated to Azure using Site Recovery, you need to uninstall the older version of Mobility service running on the machine, and restart the machine before replicating it to another Azure region.
Azure RBAC policies | Not supported | Azure role-based access control (Azure RBAC) policies on VMs are not replicated to the failover VM in target region.
Extensions | Not supported | Extensions are not replicated to the failover VM in target region. It needs to be installed manually after failover.
Proximity Placement Groups | Supported | Virtual machines located inside a Proximity Placement Group can be protected using Site Recovery.
Tags  | Supported | User generated tags applied on source virtual machines are carried over to target virtual machines post test failover or failover. Tags on the VM(s) are replicated once every 24 hours for as long as the VM(s) is/are present in the target region.


## Replicated machines - disk actions

**Action** | **Details**
-- | ---
Resize disk on replicated VM | Supported on the source VM before failover. No need to disable/re-enable replication.<br/><br/> If you change the source VM after failover, the changes aren't captured.<br/><br/> If you change the disk size on the Azure VM after failover, changes aren't captured by Site Recovery, and failback will be to the original VM size.
Add a disk to a replicated VM | Supported
Offline changes to protected disks | Disconnecting disks and making offline modifications to them require triggering a full resync.

## Replicated machines - storage

This table summarized support for the Azure VM OS disk, data disk, and temporary disk.

- It's important to observe the VM disk limits and targets for [managed disks](../virtual-machines/disks-scalability-targets.md) to avoid any performance issues.
- If you deploy with the default settings, Site Recovery automatically creates disks and storage accounts based on the source settings.
- If you customize, ensure you follow the guidelines.

**Component** | **Support** | **Details**
--- | --- | ---
OS disk maximum size | 2048 GB | [Learn more](../virtual-machines/managed-disks-overview.md) about VM disks.
Temporary disk | Not supported | The temporary disk is always excluded from replication.<br/><br/> Don't store any persistent data on the temporary disk. [Learn more](../virtual-machines/managed-disks-overview.md).
Data disk maximum size | 32 TB for managed disks<br></br>4     TB for unmanaged disks|
Data disk minimum size | No restriction for unmanaged disks. 2 GB for managed disks |
Data disk maximum number | Up to 64, in accordance with support for a specific Azure VM size | [Learn more](../virtual-machines/sizes.md) about VM sizes.
Data disk change rate | Maximum of 20 MBps per disk for premium storage. Maximum of 2 MBps per disk for Standard storage. | If the average data change rate on the disk is continuously higher than the maximum, replication won't catch up.<br/><br/>  However, if the maximum is exceeded sporadically, replication can catch up, but you might see slightly delayed recovery points.
Data disk - standard storage account | Supported |
Data disk - premium storage account | Supported | If a VM has disks spread across premium and standard storage accounts, you can select a different target storage account for each disk, to ensure you have the same storage configuration in the target region.
Managed disk - standard | Supported in Azure regions in which Azure Site Recovery is supported. |
Managed disk - premium | Supported in Azure regions in which Azure Site Recovery is supported. |
Standard SSD | Supported |
Redundancy | LRS and GRS are supported.<br/><br/> ZRS isn't supported.
Cool and hot storage | Not supported | VM disks aren't supported on cool and hot storage
Storage Spaces | Supported |
NVMe storage interface | Not supported
Encryption at rest (SSE) | Supported | SSE is the default setting on storage accounts.
Encryption at rest (CMK) | Supported | Both Software and HSM keys are supported for managed disks
Double Encryption at rest | Supported | Learn more on supported regions for [Windows](../virtual-machines/disk-encryption.md) and [Linux](../virtual-machines/disk-encryption.md)
Azure Disk Encryption (ADE) for Windows OS | Supported for VMs with managed disks. | VMs using unmanaged disks are not supported. <br/><br/> HSM-protected keys are not supported. <br/><br/> Encryption of individual volumes on a single disk is not supported. |
Azure Disk Encryption (ADE) for Linux OS | Supported for VMs with managed disks. | VMs using unmanaged disks are not supported. <br/><br/> HSM-protected keys are not supported. <br/><br/> Encryption of individual volumes on a single disk is not supported. <br><br> Known issue with enabling replication. [Learn more.](./azure-to-azure-troubleshoot-errors.md#enable-protection-failed-as-the-installer-is-unable-to-find-the-root-disk-error-code-151137) |
SAS key rotation | Not Supported | If the SAS key for storage accounts is rotated, customer needs to disable and re-enable replication. |
Host Caching | Supported
Hot add    | Supported | Enabling replication for a data disk that you add to a replicated Azure VM is supported for VMs that use managed disks. <br/><br/> Only one disk can be hot added to an Azure VM at a time. Parallel addition of multiple disks is not supported. |
Hot remove disk    | Not supported | If you  remove data disk on the VM, you need to disable replication and enable replication again for the VM.
Exclude disk | Support. You must use [PowerShell](azure-to-azure-exclude-disks.md) to configure. |    Temporary disks are excluded by default.
Storage Spaces Direct  | Supported for crash consistent recovery points. Application consistent recovery points are not supported. |
Scale-out File Server  | Supported for crash consistent recovery points. Application consistent recovery points are not supported. |
DRBD | Disks that are part of a DRBD setup are not supported. |
LRS | Supported |
GRS | Supported |
RA-GRS | Supported |
ZRS | Not supported |
Cool and Hot Storage | Not supported | Virtual machine disks are not supported on cool and hot storage
Azure Storage firewalls for virtual networks  | Supported | If restrict virtual network access to storage accounts, enable [Allow trusted Microsoft services](../storage/common/storage-network-security.md#exceptions).
General purpose V2 storage accounts (Both Hot and Cool tier) | Supported | Transaction costs increase substantially compared to General purpose V1 storage accounts
Generation 2 (UEFI boot) | Supported
NVMe disks | Not supported
Azure shared disks | Not supported
Secure transfer option | Supported
Write accelerator enabled disks | Not supported
Tags  | Supported | User generated tags are replicated every 24 hours.

>[!IMPORTANT]
> To avoid performance issues, make sure that you follow VM disk scalability and performance targets for [managed disks](../virtual-machines/disks-scalability-targets.md). If you use default settings, Site Recovery creates the required disks and storage accounts, based on the source configuration. If you customize and select your own settings,follow the disk scalability and performance targets for your source VMs.

## Limits and data change rates

The following table summarizes Site Recovery limits.

- These limits are based on our tests, but obviously don't cover all possible application I/O combinations.
- Actual results can vary based on you app I/O mix.
- There are two limits to consider, per disk data churn and per virtual machine data churn.
- The current limit for per virtual machine data churn is 54 MB/s, regardless of size.

**Storage target** | **Average source disk I/O** |**Average source disk data churn** | **Total source disk data churn per day**
---|---|---|---
Standard storage | 8 KB    | 2 MB/s | 168 GB per disk
Premium P10 or P15 disk | 8 KB    | 2 MB/s | 168 GB per disk
Premium P10 or P15 disk | 16 KB | 4 MB/s |    336 GB per disk
Premium P10 or P15 disk | 32 KB or greater | 8 MB/s | 672 GB per disk
Premium P20 or P30 or P40 or P50 disk | 8 KB    | 5 MB/s | 421 GB per disk
Premium P20 or P30 or P40 or P50 disk | 16 KB or greater |20 MB/s | 1684 GB per disk

## Replicated machines - networking
**Setting** | **Support** | **Details**
--- | --- | ---
NIC | Maximum number supported for a specific Azure VM size | NICs are created when the VM is created during failover.<br/><br/> The number of NICs on the failover VM depends on the number of NICs on the source VM when replication was enabled. If you add or remove a NIC after enabling replication, it doesn't impact the number of NICs on the replicated VM after failover. <br/><br/> The order of NICs after failover is not guaranteed to be the same as the original order. <br/><br/> You can rename NICs in the target region based on your organization's naming conventions. NIC renaming is supported using PowerShell.
Internet Load Balancer | Not supported | You can set up public/internet load balancers in the primary region. However, public/internet load balancers are not supported by Azure Site Recovery in the DR region.
Internal Load balancer | Supported | Associate the preconfigured load balancer using an Azure Automation script in a recovery plan.
Public IP address | Supported | Associate an existing public IP address with the NIC. Or, create a public IP address and associate it with the NIC using an Azure Automation script in a recovery plan.
NSG on NIC | Supported | Associate the NSG with the NIC using an Azure Automation script in a recovery plan.
NSG on subnet | Supported | Associate the NSG with the subnet using an Azure Automation script in a recovery plan.
Reserved (static) IP address | Supported | If the NIC on the source VM has a static IP address, and the target subnet has the same IP address available, it's assigned to the failed over VM.<br/><br/> If the target subnet doesn't have the same IP address available, one of the available IP addresses in the subnet is reserved for the VM.<br/><br/> You can also specify a fixed IP address and subnet in **Replicated items** > **Settings** > **Compute and Network** > **Network interfaces**.
Dynamic IP address | Supported | If the NIC on the source has dynamic IP addressing, the NIC on the failed over VM is also dynamic by default.<br/><br/> You can modify this to a fixed IP address if required.
Multiple IP addresses | Not supported | When you fail over a VM that has a NIC with multiple IP addresses, only the primary IP address of the NIC in the source region is kept. To assign multiple IP addresses, you can add VMs to a [recovery plan](recovery-plan-overview.md) and attach a script to assign additional IP addresses to the plan, or you can make the change manually or with a script after failover.
Traffic Manager     | Supported | You can preconfigure Traffic Manager so that traffic is routed to the endpoint in the source region on a regular basis, and to the endpoint in the target region in case of failover.
Azure DNS | Supported |
Custom DNS    | Supported |
Unauthenticated proxy | Supported | [Learn more](./azure-to-azure-about-networking.md)
Authenticated Proxy | Not supported | If the VM is using an authenticated proxy for outbound connectivity, it cannot be replicated using Azure Site Recovery.
VPN site-to-site connection to on-premises<br/><br/>(with or without ExpressRoute)| Supported | Ensure that the UDRs and NSGs are configured in such a way that the Site Recovery traffic is not routed to on-premises. [Learn more](./azure-to-azure-about-networking.md)
VNET to VNET connection    | Supported | [Learn more](./azure-to-azure-about-networking.md)
Virtual Network Service Endpoints | Supported | If you are restricting the virtual network access to storage accounts, ensure that the trusted Microsoft services are allowed access to the storage account.
Accelerated networking | Supported | Accelerated networking must be enabled on source VM. [Learn more](azure-vm-disaster-recovery-with-accelerated-networking.md).
Palo Alto Network Appliance | Not supported | With third party appliances, there are often restrictions imposed by the provider inside the Virtual Machine. Azure Site Recovery needs agent, extensions and outbound connectivity to be available. But the appliance does not let any outbound activity to be configured inside the Virtual Machine.
IPv6  | Not supported | Mixed configurations that include both IPv4 and IPv6 are also not supported. Please free up the subnet of the IPv6 range before any Site Recovery operation.
Private link access to Site Recovery service | Supported | [Learn more](azure-to-azure-how-to-enable-replication-private-endpoints.md)
Tags  | Supported | User generated tags on NICs are replicated every 24 hours.



## Next steps

- Read [networking guidance](./azure-to-azure-about-networking.md)  for replicating Azure VMs.
- Deploy disaster recovery by [replicating Azure VMs](./azure-to-azure-quickstart.md).
