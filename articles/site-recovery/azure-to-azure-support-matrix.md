---
title: Support matrix for Azure VM disaster recovery with Azure Site Recovery
description: Summarizes support for Azure VMs disaster recovery to a secondary region with Azure Site Recovery.
ms.topic: concept-article
ms.date: 05/22/2025
ms.service: azure-site-recovery
author: jyothisuri
ms.author: jsuri
ms.custom: engagement-fy23, references_regions, linux-related-content
---

# Support matrix for Azure VM disaster recovery between Azure regions

This article summarizes support and prerequisites for disaster recovery of Azure VMs from one Azure region to another, using the [Azure Site Recovery](site-recovery-overview.md) service.

## Deployment method support

**Deployment** |  **Support**
--- | ---
**Azure portal** | Supported.
**PowerShell** | Supported. [Learn more](azure-to-azure-powershell.md)
**REST API** | Supported.
**CLI** | Not currently supported.


## Resource move/migrate support

**Resource action** | **Details**
--- | ---
**Move vaults across resource groups** | Not supported.
**Move compute/storage/network resources across resource groups** | Not supported.<br/><br/> If you move a VM or associated components such as storage/network after the VM is replicating, you need to disable and then re-enable replication for the VM.
**Replicate Azure VMs from one subscription to another for disaster recovery** | Supported within the same Microsoft Entra tenant.
**Migrate VMs across regions within supported geographical clusters (within and across subscriptions)** | Supported within the same Microsoft Entra tenant.
**Migrate VMs within the same region** | Not supported.
**Azure Dedicated Hosts** | Not supported.
**AVD infrastructure VMs** | Supported, provided all the Azure to Azure replication prerequisites are fulfilled.

## Region support

Azure Site Recovery allows you to perform global disaster recovery. You can replicate and recover VMs between any two Azure regions in the world. If you have concerns around data sovereignty, you may choose to limit replication within your specific geographic cluster. 


[See here](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=site-recovery&regions=all) to find details on the various geographic clusters supported.

> [!NOTE]
> - **Support for restricted Regions reserved for in-country/region disaster recovery:** Switzerland West reserved for Switzerland North, France South reserved for France Central, Norway West for Norway East customers, JIO India Central for JIO India West customers, Brazil Southeast for Brazil South customers, South Africa West for South Africa North customers, Germany North for Germany West Central customers, UAE Central for UAE North customers.<br/><br/> To use restricted regions as your primary or recovery region, get yourselves allowlisted by raising a request [here](/troubleshoot/azure/general/region-access-request-process) for both source and target subscriptions.
> <br>
> - For **Brazil South**, you can replicate and fail over to these regions: Brazil Southeast, South Central US, West Central US, East US, East US 2, West US, West US 2, and North Central US. 
> - Brazil South can only be used as a source region from which VMs can replicate using Site Recovery. It can't act as a target region. Note that if you fail over from Brazil South as a source region to a target, failback to Brazil South from the target region is supported. Brazil Southeast can only be used as a target region. 
>
> - If the region in which you want to create a vault doesn't show, make sure your subscription has access to create resources in that region. 
>
> - If you can't see a region within a geographic cluster when you enable replication, make sure your subscription has permissions to create VMs in that region. 
>
> - New Zealand is only supported as a source or target region for Site Recovery Azure to Azure. However, creating recovery services vault isn't supported in New Zealand.


## Cache storage

This table summarizes support for the cache storage account used by Site Recovery during replication.

**Setting** | **Support** | **Details**
--- | --- | ---
General purpose V2 storage accounts (Hot and Cool tier) | Supported | Usage of GPv2 is recommended because GPv1 doesn't support ZRS (Zonal Redundant Storage). 
Premium storage | Supported | Use Premium Block Blob storage accounts to get High Churn support. For more information, see [Azure VM Disaster Recovery - High Churn Support](./concepts-azure-to-azure-high-churn-support.md).
Region |  Same region as virtual machine  | Cache storage account should be in the same region as the virtual machine being protected.
Subscription  | Can be different from source virtual machines | Cache storage account must be in the same subscription as the source virtual machine(s). <br> To use cache storage from the target subscription, use PowerShell.
Azure Storage firewalls for virtual networks  | Supported | If you're using firewall enabled cache storage account or target storage account, ensure you ['Allow trusted Microsoft services'](../storage/common/storage-network-security.md#exceptions).<br></br>Also, ensure that you allow access to at least one subnet of source Vnet.<br></br>Note: Don't restrict virtual network access to your storage accounts used for Site Recovery. You should allow access from 'All networks'.
Soft delete | Not supported | Soft delete isn't supported because once it's enabled on cache storage account, it increases cost. Azure Site Recovery performs frequent creates/deletes of log files while replicating causing costs to increase.
Encryption at rest (CMK) | Supported | Storage account encryption can be configured with customer managed keys (CMK)
Managed identity | Not supported | The cached storage account must allow shared key access and Shared Access Signatures (SAS) signed by the shared key. Recent changes in Azure Policy disable key authentication due to security concerns. However, for Site Recovery, you need to enable it again.

The following table lists the limits in terms of number of disks that can replicate to a single storage account.

**Storage account type**    |    **Churn = 4 MBps per disk**    |    **Churn = 8 MBps per disk**
---    |    ---    |    ---
V1 storage account    |    300 disks    |    150 disks
V2 storage account    |    750 disks    |    375 disks

As average churn on the disks increases, the number of disks that a storage account can support decreases. The above table may be used as a guide for making decisions on number of storage accounts that need to be provisioned.

> [!NOTE]
> The cache limits are specific to Azure-to-Azure and Zone-to-Zone DR scenarios.
>
> When you enable replication via the virtual machine workflow for cross subscription, the portal only lists the cache storage account from the source subscription, but doesn't list any storage account created in the target subscription. To set up this scenario, use [PowerShell](azure-to-azure-powershell.md).

## Replicated machine operating systems

Site Recovery supports replication of Azure VMs running the operating systems listed in this section. Note that if an already-replicating machine's operating system is later upgraded (or downgraded) to a different major version of the operating system (for example RHEL 8 to RHEL 9), you must disable replication, uninstall Mobility Agent and re-enable replication after the upgrade.

### Windows

**Operating system** | **Details**
--- | ---
Windows Server 2025 | Supported.
Windows Server 2022 | Supported.
Windows Server 2019 | Supported for Server Core, Server with Desktop Experience.
Windows Server 2016  | Supported Server Core, Server with Desktop Experience.
Windows Server 2012 R2 | Supported.
Windows Server 2012 | Supported.
Windows Server 2008 R2 with SP1/SP2 | Supported.<br/><br/> From version [9.30](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery) of the Mobility service extension for Azure VMs, you need to install a Windows [servicing stack update (SSU)](https://support.microsoft.com/help/4490628) and [SHA-2 update](https://support.microsoft.com/help/4474419) on machines running Windows Server 2008 R2 SP1/SP2.  SHA-1 isn't supported from September 2019, and if SHA-2 code signing isn't enabled the agent extension won't install/upgrade as expected. Learn more about [SHA-2 upgrade and requirements](https://aka.ms/SHA-2KB).
Windows 11 (x64) | Supported (From Mobility Agent version 9.56 onwards).
Windows 10 (x64) | Supported.
Windows 8.1 (x64) | Supported.
Windows 8 (x64) | Supported.
Windows 7 (x64) with SP1 onwards | From version [9.30](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery) of the Mobility service extension for Azure VMs, you need to install a Windows [servicing stack update (SSU)](https://support.microsoft.com/help/4490628) and [SHA-2 update](https://support.microsoft.com/help/4474419) on machines running Windows 7 with SP1.  SHA-1 isn't supported from September 2019, and if SHA-2 code signing isn't enabled the agent extension won't install/upgrade as expected. Learn more about [SHA-2 upgrade and requirements](https://aka.ms/SHA-2KB).

#### Linux

> [!NOTE]
> Mobility service versions `9.58` and `9.59` aren't released for Azure to Azure Site Recovery. 

**Operating system** | **Details**
--- | ---
Red Hat Enterprise Linux | 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6,[7.7](https://support.microsoft.com/help/4528026/update-rollup-41-for-azure-site-recovery), [7.8](https://support.microsoft.com/help/4564347/), [7.9](https://support.microsoft.com/help/4578241/), [8.0](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery), 8.1, [8.2](https://support.microsoft.com/help/4570609/), [8.3](https://support.microsoft.com/help/4597409/), [8.4](https://support.microsoft.com/topic/883a93a7-57df-4b26-a1c4-847efb34a9e8) (4.18.0-305.30.1.el8_4.x86_64 or higher), [8.5](https://support.microsoft.com/topic/883a93a7-57df-4b26-a1c4-847efb34a9e8) (4.18.0-348.5.1.el8_5.x86_64 or higher), [8.6](https://support.microsoft.com/topic/update-rollup-62-for-azure-site-recovery-e7aff36f-b6ad-4705-901c-f662c00c402b) (4.18.0-348.5.1.el8_5.x86_64 or higher), 8.7, 8.8, 8.9, 8.10, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5 <br> RHEL `9.x` is supported for the [following kernel versions](#supported-kernel-versions-for-red-hat-enterprise-linux-for-azure-virtual-machines).
Ubuntu 14.04 LTS Server | Includes support for all 14.04.*x* versions; [Supported kernel versions](#supported-ubuntu-kernel-versions-for-azure-virtual-machines);
Ubuntu 16.04 LTS Server | Includes support for all 16.04.*x* versions; [Supported kernel version](#supported-ubuntu-kernel-versions-for-azure-virtual-machines)<br/><br/> Ubuntu servers using password-based authentication and sign-in, and the cloud-init package to configure cloud VMs, might have password-based sign-in disabled on failover (depending on the cloudinit configuration). Password-based sign in can be re-enabled on the virtual machine by resetting the password from the Support > Troubleshooting > Settings menu of the failed over VM in the Azure portal.
Ubuntu 18.04 LTS Server | Includes support for all 18.04.*x* versions; [Supported kernel version](#supported-ubuntu-kernel-versions-for-azure-virtual-machines)<br/><br/> Ubuntu servers using password-based authentication and sign-in, and the cloud-init package to configure cloud VMs, might have password-based sign-in disabled on failover (depending on the cloudinit configuration). Password-based sign in can be re-enabled on the virtual machine by resetting the password from the Support > Troubleshooting > Settings menu of the failed over VM in the Azure portal.
Ubuntu 20.04 LTS server | Includes support for all 20.04.*x* versions; [Supported kernel version](#supported-ubuntu-kernel-versions-for-azure-virtual-machines)
Ubuntu 22.04 LTS server | Includes support for all 22.04.*x* versions; [Supported kernel version](#supported-ubuntu-kernel-versions-for-azure-virtual-machines)
Debian 7 | Includes support for all 7. *x* versions [Supported kernel versions](#supported-debian-kernel-versions-for-azure-virtual-machines)
Debian 8 | Includes support for all 8. *x* versions [Supported kernel versions](#supported-debian-kernel-versions-for-azure-virtual-machines)
Debian 9 | Includes support for 9.1 to 9.13. Debian 9.0 isn't supported. [Supported kernel versions](#supported-debian-kernel-versions-for-azure-virtual-machines)
Debian 10 | [Supported kernel versions](#supported-debian-kernel-versions-for-azure-virtual-machines)
Debian 11 | [Supported kernel versions](#supported-debian-kernel-versions-for-azure-virtual-machines)
Debian 12 | [Supported kernel versions](#supported-debian-kernel-versions-for-azure-virtual-machines)
SUSE Linux Enterprise Server 12 | SP1, SP2, SP3, SP4, SP5, SP6  [(Supported kernel versions)](#supported-suse-linux-enterprise-server-12-kernel-versions-for-azure-virtual-machines)
SUSE Linux Enterprise Server 15 | 15, SP1, SP2, SP3, SP4, SP5, SP6 [(Supported kernel versions)](#supported-suse-linux-enterprise-server-15-kernel-versions-for-azure-virtual-machines)
SUSE Linux Enterprise Server 11 | SP3<br/><br/> Upgrade of replicating machines from SP3 to SP4 isn't supported. If a replicated machine has been upgraded, you need to disable replication and re-enable replication after the upgrade.
SUSE Linux Enterprise Server 11 | SP4
Oracle Linux | 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, [7.7](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery), [7.8](https://support.microsoft.com/help/4573888/), [7.9](https://support.microsoft.com/help/4597409), [8.0](https://support.microsoft.com/help/4573888/), [8.1](https://support.microsoft.com/help/4573888/), [8.2](https://support.microsoft.com/topic/update-rollup-55-for-azure-site-recovery-kb5003408-b19c8190-5f88-43ea-85b1-d9e0cc5ca7e8), [8.3](https://support.microsoft.com/topic/update-rollup-55-for-azure-site-recovery-kb5003408-b19c8190-5f88-43ea-85b1-d9e0cc5ca7e8) (running the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3, 4, 5, and 6 (UEK3, UEK4, UEK5, UEK6), [8.4](https://support.microsoft.com/topic/update-rollup-59-for-azure-site-recovery-kb5008707-66a65377-862b-4a4c-9882-fd74bdc7a81e), 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5).  <br/><br/>8.1 (running on all UEK kernels and RedHat kernel <= 3.10.0-1062.* are supported in [9.35](https://support.microsoft.com/help/4573888/) Support for rest of the RedHat kernels is available in [9.36](https://support.microsoft.com/help/4578241/)). <br> Oracle Linux 9.x is supported for the [following kernel versions](#supported-red-hat-linux-kernel-versions-for-oracle-linux-on-azure-virtual-machines).
Rocky Linux | [See supported versions](#supported-rocky-linux-kernel-versions-for-azure-virtual-machines).
Alma Linux | [See supported versions](#supported-alma-linux-kernel-versions-for-azure-virtual-machines). 

> [!NOTE]
> For Linux versions, Azure Site Recovery doesn't support custom OS kernels. Only the stock kernels that are part of the distribution minor version release/update are supported.

##### Linux Kernel support timelines

To support newly released Linux kernels, Azure Site Recovery (ASR) provides hotfix patches of mobility agent on top of the latest mobility agent version. These hotfixes are released on a **best-effort basis within 30 days** of the kernel release and apply only to **Azure-to-Azure disaster recovery scenarios**.

>[!Note]
>This is not a service-level agreement (SLA). The 30-days support window on **a best effort basis** applies only to specific scenarios as outlined in the following table.

Only those scenarios mentioned in the *Scenarios covered by 30-Days best effort support* are applicable for the best effort basis of 30 days. Any other scenario, even if it is not mentioned in the *Scenarios **not** covered by 30-Days best effort support* column, is not applicable for this best effort support.

###### Scope of 30-Day Kernel support on best effort

 **Distribution** | **Scenarios covered by 30-Days best effort support** | **Scenarios not covered by 30-Days best effort support** 
 --- | --- | --- 
Ubuntu | - New kernel within an already supported kernel series within a supported Ubuntu version.<br/>e.g., 5.15.0-1081-azure for Ubuntu 22.04 if 5.15.0-1079-azure is already supported for Ubuntu 22.04 since both belong to the 5.15.0-* kernel series. This applies to both Azure (-azure) and generic kernels (-generic) only. | - New Major OS version released.<br/>e.g., Assume Ubuntu releases Ubuntu 26.04 which is not supported by ASR yet.<br/><br/>- New kernel series not previously supported for the same Ubuntu version.<br/>e.g., 6.5.0-18-azure for Ubuntu 22.04 if no kernel from the 6.5.0-* series is supported. 
Debian | - New kernel within an already supported kernel series within a supported Debian version.<br/>e.g., 4.19.0-27-cloud-amd64 for Debian 10 if 4.19.0-26-cloud-amd64 is already supported for Debian 10 since both belong to the 4.19.0-* kernel series. This applies to Azure kernels (-cloud-amd64) and Stock kernels (-amd64) only. | - New Major OS version released.<br/>e.g., Assume Debian releases Debian 11 which is not supported by ASR yet.<br/><br/>- New kernel series not previously supported for the same Debian version.<br/>e.g., 5.10.0-0.deb10.30-cloud-amd64 for Debian 10 if no kernel from the 5.10.0-* series is supported. 
SUSE | - New kernel within an already supported kernel series within supported Service Pack (SP) version <br/>e.g., 6.4.0-150600.8.8 for SUSE 15 SP6 if 6.4.0-150600.8.5 is already supported for SUSE 15 SP6 since both belong to the 6.4.0-150600.8.* kernel series. This applies to Azure kernels (-azure:[Service Pack Number]). Stock kernels (-default) are supported by default. | - New Service Pack releases.<br/>e.g., Assume SUSE releases SUSE 15 SP7 which ASR does not support yet.<br/><br/>- New kernel series not previously supported for the same SP version. 
RHEL, Rocky, Alma, Oracle Linux (All distros are based on RHEL kernels) | - A new kernel for RHEL 8.x or 9.y would be supported if the minor OS version (RHEL 8.x or RHEL 9.y) is supported and the kernel series is already supported for that minor OS version. For RHEL 8.x, this only applies if x ≥ 6. <br/><br/>For Oracle Linux UEK kernels, new kernels within a supported uek kernel series within a supported OS version. | -New Major version released.<br/>e.g., Assume RHEL 10.x, Rocky Linux 10.x, Alma Linux 10.x, or Oracle Linux 10.x is released which ASR does not support. <br/><br/>- Minor OS version released within a supported Major OS version.<br/>e.g., Assume RHEL 9.5 is released which ASR does not support.<br/><br/>- New kernels for RHEL 8.x where x < 6 (e.g., RHEL 8.4) are not supported within 30 days.<br/><br/>-New kernel releases for a UEK kernel series not yet supported by ASR. 
 
#### Supported kernel versions for Red Hat Enterprise Linux for Azure virtual machines 

> [!NOTE]
> Enable replication through create virtual machine deployment workflow isn't supported for virtual machines with OS RHEL 9* and above. 

**Release** | **Mobility service version** | **Red Hat kernel version** |
--- | --- | --- |
RHEL 9.0 <br> RHEL 9.1 <br> RHEL 9.2 <br> RHEL 9.3 <br> RHEL 9.4 <br> RHEL 9.5 | 9.65 | 5.14.0-503.11.1 and higher. |
RHEL 9.0 <br> RHEL 9.1 <br> RHEL 9.2 <br> RHEL 9.3 <br> RHEL 9.4 <br> RHEL 9.5 | 9.64 | 5.14.0-503.11.1 and higher. |
RHEL 9.0 <br> RHEL 9.1 <br> RHEL 9.2 <br> RHEL 9.3 <br> RHEL 9.4 | 9.63 | 5.14.0-284.73.1.el9_2.x86_64 <br> 5.14.0-284.75.1.el9_2.x86_64 <br> 5.14.0-284.77.1.el9_2.x86_64 <br> 5.14.0-284.79.1.el9_2.x86_64 <br> 5.14.0-284.80.1.el9_2.x86_64 <br> 5.14.0-284.82.1.el9_2.x86_64 <br> 5.14.0-284.84.1.el9_2.x86_64 <br> 5.14.0-284.85.1.el9_2.x86_64 <br> 5.14.0-284.86.1.el9_2.x86_64 <br> 5.14.0-427.24.1.el9_4.x86_64 <br> 5.14.0-427.26.1.el9_4.x86_64 <br> 5.14.0-427.28.1.el9_4.x86_64 <br> 5.14.0-427.31.1.el9_4.x86_64 <br> 5.14.0-427.33.1.el9_4.x86_64 <br> 5.14.0-427.35.1.el9_4.x86_64 <br> 5.14.0-427.37.1.el9_4.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 and higher. |
RHEL 9.0 <br> RHEL 9.1 <br> RHEL 9.2 <br> RHEL 9.3 <br> RHEL 9.4 | 9.62 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 and higher. |
RHEL 9.0 <br> RHEL 9.1 <br> RHEL 9.2 <br> RHEL 9.3  | 9.61 | 5.14.0-70.93.2.el9_0.x86_64 <br> 5.14.0-284.54.1.el9_2.x86_64 <br>5.14.0-284.57.1.el9_2.x86_64 <br>5.14.0-284.59.1.el9_2.x86_64 <br>5.14.0-362.24.1.el9_3.x86_64 |
RHEL 9.0 <br> RHEL 9.1 <br> RHEL 9.2 <br> RHEL 9.3  | 9.60 | 5.14.0-70.13.1.el9_0.x86_64 <br> 5.14.0-70.17.1.el9_0.x86_64 <br> 5.14.0-70.22.1.el9_0.x86_64 <br> 5.14.0-70.26.1.el9_0.x86_64 <br> 5.14.0-70.30.1.el9_0.x86_64 <br> 5.14.0-70.36.1.el9_0.x86_64 <br> 5.14.0-70.43.1.el9_0.x86_64 <br> 5.14.0-70.49.1.el9_0.x86_64 <br> 5.14.0-70.50.2.el9_0.x86_64 <br> 5.14.0-70.53.1.el9_0.x86_64 <br> 5.14.0-70.58.1.el9_0.x86_64 <br> 5.14.0-70.64.1.el9_0.x86_64 <br> 5.14.0-70.70.1.el9_0.x86_64 <br> 5.14.0-70.75.1.el9_0.x86_64 <br> 5.14.0-70.80.1.el9_0.x86_64 <br> 5.14.0-70.85.1.el9_0.x86_64 <br> 5.14.0-162.6.1.el9_1.x86_64  <br> 5.14.0-162.12.1.el9_1.x86_64 <br> 5.14.0-162.18.1.el9_1.x86_64 <br> 5.14.0-162.22.2.el9_1.x86_64 <br> 5.14.0-162.23.1.el9_1.x86_64 <br> 5.14.0-284.11.1.el9_2.x86_64 <br> 5.14.0-284.13.1.el9_2.x86_64 <br> 5.14.0-284.16.1.el9_2.x86_64 <br> 5.14.0-284.18.1.el9_2.x86_64 <br> 5.14.0-284.23.1.el9_2.x86_64 <br> 5.14.0-284.25.1.el9_2.x86_64 <br> 5.14.0-284.28.1.el9_2.x86_64 <br> 5.14.0-284.30.1.el9_2.x86_64  <br> 5.14.0-284.32.1.el9_2.x86_64 <br> 5.14.0-284.34.1.el9_2.x86_64 <br> 5.14.0-284.36.1.el9_2.x86_64 <br> 5.14.0-284.40.1.el9_2.x86_64 <br> 5.14.0-284.41.1.el9_2.x86_64 <br>5.14.0-284.43.1.el9_2.x86_64 <br>5.14.0-284.44.1.el9_2.x86_64 <br> 5.14.0-284.45.1.el9_2.x86_64 <br>5.14.0-284.48.1.el9_2.x86_64 <br>5.14.0-284.50.1.el9_2.x86_64 <br> 5.14.0-284.52.1.el9_2.x86_64 <br>5.14.0-362.8.1.el9_3.x86_64 <br>5.14.0-362.13.1.el9_3.x86_64 <br> 5.14.0-362.18.1.el9_3.x86_64 |

#### Supported Ubuntu kernel versions for Azure virtual machines

> [!NOTE]
> Mobility service versions `9.58` and `9.59` aren't released for Azure to Azure Site Recovery. 


**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
14.04 LTS | 9.65| No new 14.04 LTS kernels supported in this release. |
14.04 LTS | 9.64| No new 14.04 LTS kernels supported in this release. |
14.04 LTS | 9.63| No new 14.04 LTS kernels supported in this release. |
14.04 LTS | 9.62| No new 14.04 LTS kernels supported in this release. |
14.04 LTS | [9.61](https://support.microsoft.com/topic/update-rollup-73-for-azure-site-recovery-d3845f1e-2454-4ae8-b058-c1fec6206698)| No new 14.04 LTS kernels supported in this release. |
14.04 LTS | 9.60| No new 14.04 LTS kernels supported in this release. |
|||
16.04 LTS | 9.65| No new 16.04 LTS kernels supported in this release. |
16.04 LTS | 9.64| No new 16.04 LTS kernels supported in this release. |
16.04 LTS | 9.63| No new 16.04 LTS kernels supported in this release. |
16.04 LTS | 9.62| No new 16.04 LTS kernels supported in this release. |
16.04 LTS | [9.61](https://support.microsoft.com/topic/update-rollup-73-for-azure-site-recovery-d3845f1e-2454-4ae8-b058-c1fec6206698)| No new 16.04 LTS kernels supported in this release. |
16.04 LTS | 9.60| No new 16.04 LTS kernels supported in this release. |
|||
18.04 LTS | 9.65| 4.15.0-1186-azure <br> 4.15.0-1187-azure <br> 4.15.0-235-generic <br> 4.15.0-236-generic <br> 5.4.0-1147-azure <br> 5.4.0-1148-azure <br> 5.4.0-1149-azure <br> 5.4.0-211-generic <br> 5.4.0-212-generic <br> 5.4.0-214-generic|
18.04 LTS | 9.64| 4.15.0-1185-azure <br> 4.15.0-233-generic <br>4.15.0-234-generic <br> 5.4.0-1142-azure <br> 5.4.0-1143-azure <br> 5.4.0-1145-azure <br> 5.4.0-208-generic <br> 4.15.0-1181-azure <br> 4.15.0-1182-azure <br> 4.15.0-1183-azure <br> 4.15.0-1184-azure <br> 4.15.0-229-generic <br> 4.15.0-230-generic <br> 4.15.0-231-generic <br> 4.15.0-232-generic <br> 5.4.0-1137-azure <br> 5.4.0-1138-azure <br> 5.4.0-1139-azure <br> 5.4.0-1140-azure <br> 5.4.0-195-generic <br> 5.4.0-196-generic <br> 5.4.0-198-generic <br> 5.4.0-200-generic <br> 5.4.0-202-generic <br> 5.4.0-204-generic |
18.04 LTS | 9.63 | 5.4.0-1135-azure <br> 5.4.0-192-generic <br> 4.15.0-1180-azure <br> 4.15.0-228-generic <br> 5.4.0-1136-azure <br> 5.4.0-193-generic <br> 5.4.0-1137-azure <br> 5.4.0-1138-azure <br> 5.4.0-195-generic <br> 5.4.0-196-generic <br> 4.15.0-1181-azure <br> 4.15.0-229-generic <br> 4.15.0-1182-azure  <br> 4.15.0-230-generic <br> 5.4.0-1139-azure <br> 5.4.0-198-generic | 
18.04 LTS | 9.62| 4.15.0-226-generic <br>5.4.0-1131-azure <br>5.4.0-186-generic <br>5.4.0-187-generic <br> 4.15.0-1178-azure <br> 5.4.0-1132-azure <br> 5.4.0-1133-azure <br> 5.4.0-1134-azure <br> 5.4.0-190-generic <br> 5.4.0-189-generic  |
18.04 LTS | [9.61](https://support.microsoft.com/topic/update-rollup-73-for-azure-site-recovery-d3845f1e-2454-4ae8-b058-c1fec6206698)| 5.4.0-173-generic <br> 4.15.0-1175-azure <br> 4.15.0-223-generic <br> 5.4.0-1126-azure <br> 5.4.0-174-generic <br> 4.15.0-1176-azure <br> 4.15.0-224-generic <br> 5.4.0-1127-azure <br> 5.4.0-1128-azure  <br> 5.4.0-175-generic <br> 5.4.0-177-generic <br> 4.15.0-1177-azure <br> 4.15.0-225-generic <br> 5.4.0-1129-azure <br> 5.4.0-1130-azure <br> 5.4.0-181-generic <br> 5.4.0-182-generic |
18.04 LTS | 9.60 | 4.15.0-1168-azure <br> 4.15.0-1169-azure <br> 4.15.0-1170-azure <br> 4.15.0-1171-azure <br> 4.15.0-1172-azure <br> 4.15.0-1173-azure <br> 4.15.0-214-generic <br> 4.15.0-216-generic <br> 4.15.0-218-generic <br> 4.15.0-219-generic <br> 4.15.0-220-generic <br> 4.15.0-221-generic <br> 5.4.0-1110-azure <br> 5.4.0-1111-azure <br> 5.4.0-1112-azure <br> 5.4.0-1113-azure <br> 5.4.0-1115-azure <br> 5.4.0-1116-azure <br> 5.4.0-1117-azure <br> 5.4.0-1118-azure <br> 5.4.0-1119-azure <br> 5.4.0-1120-azure <br> 5.4.0-1121-azure <br> 5.4.0-1122-azure <br> 5.4.0-152-generic <br> 5.4.0-153-generic <br> 5.4.0-155-generic <br> 5.4.0-156-generic <br> 5.4.0-159-generic <br> 5.4.0-162-generic <br> 5.4.0-163-generic <br> 5.4.0-164-generic <br> 5.4.0-165-generic <br> 5.4.0-166-generic <br> 5.4.0-167-generic <br> 5.4.0-169-generic <br> 5.4.0-170-generic <br> 5.4.0-1123-azure <br> 5.4.0-171-generic <br> 4.15.0-1174-azure <br> 4.15.0-222-generic <br> 5.4.0-1124-azure <br> 5.4.0-172-generic |
|||
20.04 LTS | 9.65| 5.15.0-1082-azure <br> 5.15.0-1086-azure <br> 5.15.0-1087-azure <br> 5.15.0-136-generic <br> 5.15.0-138-generic <br> 5.4.0-1147-azure <br> 5.4.0-1148-azure <br> 5.4.0-1149-azure <br> 5.4.0-211-generic <br> 5.4.0-212-generic <br> 5.4.0-214-generic|
20.04 LTS | 9.64| 5.15.0-1079-azure <br> 5.15.0-1081-azure <br> 5.15.0-131-generic <br> 5.15.0-134-generic <br> 5.4.0-1143-azure <br> 5.4.0-1145-azure  <br> 5.4.0-205-generic <br> 5.4.0-208-generic<br> 5.15.0-1072-azure <br> 5.15.0-1073-azure <br> 5.15.0-1074-azure <br> 5.15.0-1075-azure <br> 5.15.0-1078-azure <br> 5.15.0-121-generic <br> 5.15.0-122-generic <br> 5.15.0-124-generic <br> 5.15.0-125-generic <br> 5.15.0-126-generic <br> 5.15.0-127-generic <br> 5.15.0-130-generic <br> 5.4.0-1137-azure <br> 5.4.0-1138-azure <br> 5.4.0-1139-azure <br> 5.4.0-1140-azure <br> 5.4.0-1142-azure <br> 5.4.0-195-generic <br> 5.4.0-196-generic <br> 5.4.0-198-generic <br> 5.4.0-200-generic <br> 5.4.0-202-generic <br> 5.4.0-204-generic |
20.04 LTS | 9.63| 5.15.0-1070-azure <br> 5.4.0-1135-azure <br> 5.4.0-192-generic <br> 5.15.0-1071-azure <br> 5.15.0-118-generic <br> 5.15.0-119-generic <br> 5.4.0-1136-azure <br> 5.4.0-193-generic <br> 5.15.0-1072-azure <br> 5.15.0-1073-azure <br> 5.15.0-121-generic <br> 5.15.0-122-generic <br> 5.4.0-1137-azure <br> 5.4.0-1138-azure <br> 5.4.0-195-generic <br> 5.4.0-196-generic |
20.04 LTS | 9.62| 5.15.0-1065-azure <br>5.15.0-1067-azure <br>5.15.0-113-generic <br>5.4.0-1131-azure <br>5.4.0-1132-azure <br>5.4.0-186-generic <br> 5.4.0-187-generic <br> 5.15.0-1068-azure <br> 5.15.0-116-generic <br> 5.15.0-117-generic <br> 5.4.0-1133-azure <br> 5.4.0-1134-azure <br> 5.4.0-189-generic <br> 5.4.0-190-generic <br> 5.15.0-1074-azure <br> 5.15.0-124-generic <br> 5.4.0-1139-azure <br> 5.4.0-198-generic |
20.04 LTS | [9.61](https://support.microsoft.com/topic/update-rollup-73-for-azure-site-recovery-d3845f1e-2454-4ae8-b058-c1fec6206698) | 5.15.0-100-generic <br> 5.15.0-1058-azure <br> 5.4.0-173-generic <br> 5.4.0-1126-azure <br> 5.4.0-174-generic <br> 5.15.0-101-generic <br> 5.15.0-1059-azure <br> 5.15.0-102-generic <br> 5.15.0-105-generic <br> 5.15.0-1061-azure <br> 5.4.0-1127-azure <br> 5.4.0-1128-azure <br> 5.4.0-176-generic <br> 5.4.0-177-generic <br> 5.15.0-106-generic <br> 5.15.0-1063-azure <br> 5.15.0-1064-azure <br> 5.15.0-107-generic <br> 5.4.0-1129-azure <br> 5.4.0-1130-azure <br> 5.4.0-181-generic <br> 5.4.0-182-generic|
20.04 LTS | 9.60 | 5.15.0-1054-azure <br> 5.15.0-92-generic <br> 5.4.0-1122-azure <br> 5.4.0-170-generic <br> 5.15.0-94-generic <br> 5.4.0-1123-azure <br> 5.4.0-171-generic <br> 5.15.0-1056-azure <br>5.15.0-1057-azure <br>5.15.0-97-generic <br>5.4.0-1124-azure <br> 5.4.0-172-generic |
|||
22.04 LTS | 9.65| 5.15.0-1082-azure <br> 5.15.0-1084-azure <br> 5.15.0-1086-azure <br> 5.15.0-1087-azure <br> 5.15.0-135-generic <br> 5.15.0-136-generic <br> 5.15.0-138-generic <br> 6.8.0-1025-azure <br> 6.8.0-1026-azure <br> 6.8.0-1027-azure <br> 6.8.0-57-generic|
22.04 LTS | 9.64| 5.15.0-1079-azure <br> 5.15.0-1081-azure <br> 5.15.0-131-generic <br> 5.15.0-133-generic <br> 5.15.0-134-generic <br> 6.8.0-1021-azure <br> 6.8.0-52-generic <br>5.15.0-1072-azure <br> 5.15.0-1073-azure <br> 5.15.0-1074-azure <br>5.15.0-1075-azure <br> 5.15.0-1078-azure <br> 5.15.0-121-generic <br> 5.15.0-122-generic <br> 5.15.0-124-generic <br> 5.15.0-125-generic <br> 5.15.0-126-generic <br> 5.15.0-127-generic <br> 5.15.0-130-generic <br> 6.8.0-1008-azure <br> 6.8.0-1009-azure <br> 6.8.0-1010-azure <br> 6.8.0-1012-azure <br> 6.8.0-1013-azure <br> 6.8.0-1014-azure <br> 6.8.0-1015-azure <br> 6.8.0-1017-azure <br> 6.8.0-1018-azure <br> 6.8.0-1020-azure <br> 6.8.0-38-generic <br> 6.8.0-39-generic <br> 6.8.0-40-generic <br> 6.8.0-45-generic <br> 6.8.0-47-generic <br> 6.8.0-48-generic <br> 6.8.0-49-generic <br> 6.8.0-50-generic <br> 6.8.0-51-generic |
22.04 LTS | 9.63| 5.15.0-1070-azure <br> 5.15.0-118-generic <br> 5.15.0-1071-azure <br> 5.15.0-119-generic <br> 5.15.0-1072-azure <br> 5.15.0-1073-azure <br> 5.15.0-121-generic <br> 5.15.0-122-generic <br> 5.15.0-1074-azure <br> 5.15.0-124-generic |
22.04 LTS | 9.62| 5.15.0-1066-azure <br> 5.15.0-1067-azure <br>5.15.0-112-generic <br>5.15.0-113-generic <br>6.5.0-1022-azure <br>6.5.0-1023-azure <br>6.5.0-41-generic <br> 5.15.0-1068-azure <br> 5.15.0-116-generic <br> 5.15.0-117-generic <br> 6.5.0-1024-azure <br> 6.5.0-1025-azure <br> 6.5.0-44-generic <br> 6.5.0-45-generic |
22.04 LTS | [9.61](https://support.microsoft.com/topic/update-rollup-73-for-azure-site-recovery-d3845f1e-2454-4ae8-b058-c1fec6206698)| 5.15.0-100-generic <br> 5.15.0-1058-azure <br> 6.5.0-1016-azure <br> 6.5.0-25-generic <br> 5.15.0-101-generic <br> 5.15.0-1059-azure <br> 6.5.0-1017-azure <br> 6.5.0-26-generic <br> 5.15.0-102-generic <br> 5.15.0-105-generic <br> 5.15.0-1060-azure <br> 5.15.0-1061-azure <br> 6.5.0-1018-azure <br> 6.5.0-1019-azure <br> 6.5.0-27-generic <br> 6.5.0-28-generic <br> 5.15.0-106-generic <br> 5.15.0-1063-azure <br> 5.15.0-1064-azure<br> 5.15.0-107-generic<br> 6.5.0-1021-azure<br> 6.5.0-35-generic|
22.04 LTS |9.60| 5.19.0-1025-azure <br> 5.19.0-1026-azure <br> 5.19.0-1027-azure <br> 5.19.0-41-generic <br> 5.19.0-42-generic <br> 5.19.0-43-generic <br> 5.19.0-45-generic <br> 5.19.0-46-generic <br> 5.19.0-50-generic <br> 6.2.0-1005-azure <br> 6.2.0-1006-azure <br> 6.2.0-1007-azure <br> 6.2.0-1008-azure <br> 6.2.0-1011-azure <br> 6.2.0-1012-azure <br> 6.2.0-1014-azure <br> 6.2.0-1015-azure <br> 6.2.0-1016-azure <br> 6.2.0-1017-azure <br> 6.2.0-1018-azure <br> 6.2.0-25-generic <br> 6.2.0-26-generic <br> 6.2.0-31-generic <br> 6.2.0-32-generic <br> 6.2.0-33-generic <br> 6.2.0-34-generic <br> 6.2.0-35-generic <br> 6.2.0-36-generic <br> 6.2.0-37-generic <br> 6.2.0-39-generic <br> 6.5.0-1007-azure <br> 6.5.0-1009-azure <br> 6.5.0-1010-azure <br> 6.5.0-14-generic <br> 5.15.0-1054-azure <br> 5.15.0-92-generic <br>6.2.0-1019-azure <br>6.5.0-1011-azure <br>6.5.0-15-generic <br> 5.15.0-94-generic <br>6.5.0-17-generic <br> 5.15.0-1056-azure <br> 5.15.0-1057-azure <br> 5.15.0-97-generic <br>6.5.0-1015-azure <br>6.5.0-18-generic <br>6.5.0-21-generic |
|||
24.04 LTS | 9.65| 6.8.0-1025-azure <br> 6.8.0-1026-azure <br> 6.8.0-1027-azure <br> 6.8.0-56-generic <br> 6.8.0-57-generic <br> 6.8.0-58-generic|
24.04 LTS | 9.64| 6.8.0-1021-azure <br> 6.8.0-52-generic <br> 6.8.0-53-generic <br> 6.8.0-54-generic <br> 6.8.0-55-generic <br> 6.8.0-1007-azure <br> 6.8.0-1008-azure <br> 6.8.0-1009-azure <br> 6.8.0-1010-azure <br> 6.8.0-1012-azure <br> 6.8.0-1013-azure <br> 6.8.0-1014-azure <br> 6.8.0-1015-azure <br> 6.8.0-1016-azure <br> 6.8.0-1017-azure <br> 6.8.0-1018-azure <br> 6.8.0-1020-azure <br> 6.8.0-31-generic <br> 6.8.0-35-generic <br> 6.8.0-36-generic <br> 6.8.0-38-generic <br> 6.8.0-39-generic <br> 6.8.0-40-generic <br> 6.8.0-41-generic <br> 6.8.0-44-generic <br> 6.8.0-45-generic <br> 6.8.0-47-generic <br> 6.8.0-48-generic <br> 6.8.0-49-generic <br> 6.8.0-50-generic <br> 6.8.0-51-generic |

#### Supported Debian kernel versions for Azure virtual machines

> [!NOTE]
> Mobility service versions `9.58` and `9.59` aren't released for Azure to Azure Site Recovery. 
 

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
Debian 7 | 9.65 | No new Debian 7 kernels supported in this release. |
Debian 7 | 9.64 | No new Debian 7 kernels supported in this release. |
Debian 7 | 9.63| No new Debian 7 kernels supported in this release. |
Debian 7 | 9.62| No new Debian 7 kernels supported in this release. |
Debian 7 | [9.61](https://support.microsoft.com/topic/update-rollup-73-for-azure-site-recovery-d3845f1e-2454-4ae8-b058-c1fec6206698) | No new Debian 7 kernels supported in this release. |
Debian 7 | 9.60| No new Debian 7 kernels supported in this release. |
|||
Debian 8 | 9.65 | No new Debian 8 kernels supported in this release. |
Debian 8 | 9.64 | No new Debian 8 kernels supported in this release. |
Debian 8 | 9.63| No new Debian kernels supported in this release. |
Debian 8 | 9.62| No new Debian 8 kernels supported in this release. |
Debian 8 | [9.61](https://support.microsoft.com/topic/update-rollup-73-for-azure-site-recovery-d3845f1e-2454-4ae8-b058-c1fec6206698) | No new Debian 8 kernels supported in this release. |
Debian 8 | 9.60| No new Debian 8 kernels supported in this release. |
|||
Debian 9 | 9.65 | No new Debian 9 kernels supported in this release. |
Debian 9 | 9.64 | No new Debian 9 kernels supported in this release. |
Debian 9.1 | 9.62| No new Debian kernels supported in this release. |
Debian 9.1 | 9.62| No new Debian 9.1 kernels supported in this release. |
Debian 9.1 | [9.61](https://support.microsoft.com/topic/update-rollup-73-for-azure-site-recovery-d3845f1e-2454-4ae8-b058-c1fec6206698) | No new Debian 9.1 kernels supported in this release. |
Debian 9.1 | 9.60| No new Debian 9.1 kernels supported in this release. |
|||
Debian 10 | 9.65| No new Debian 10 kernels supported in this release. |
Debian 10 | 9.64| No new Debian 10 kernels supported in this release. |
Debian 10 | 9.63| No new Debian 10 kernels supported in this release. |
Debian 10 | 9.62| 4.19.0-27-amd64 <br>4.19.0-27-cloud-amd64 <br>5.10.0-0.deb10.30-amd64 <br>5.10.0-0.deb10.30-cloud-amd64 |
Debian 10 | [9.61](https://support.microsoft.com/topic/update-rollup-73-for-azure-site-recovery-d3845f1e-2454-4ae8-b058-c1fec6206698) | 5.10.0-0.deb10.29-amd64 <br> 5.10.0-0.deb10.29-cloud-amd64 |
Debian 10 | 9.60| 4.19.0-26-amd64 <br> 4.19.0-26-cloud-amd64 <br> 5.10.0-0.deb10.27-amd64 <br> 5.10.0-0.deb10.27-cloud-amd64 <br> 5.10.0-0.deb10.28-amd64 <br> 5.10.0-0.deb10.28-cloud-amd64  |
|||
Debian 11 | 9.65 | 6.1.0-0.deb11.32-amd64 <br> 6.1.0-0.deb11.32-cloud-amd64 |
Debian 11 | 9.64 | 5.10.0-34-amd64 <br> 5.10.0-34-cloud-amd64 <br> 6.1.0-0.deb11.31-amd64 <br> 6.1.0-0.deb11.31-cloud-amd64 <br> 5.10.0-33-amd64 <br> 5.10.0-33-cloud-amd64 <br> 6.1.0-0.deb11.25-amd64 <br> 6.1.0-0.deb11.25-cloud-amd64 <br> 6.1.0-0.deb11.26-amd64 <br> 6.1.0-0.deb11.26-cloud-amd64 <br> 6.1.0-0.deb11.28-amd64 <br> 6.1.0-0.deb11.28-cloud-amd64 |
Debian 11 | 9.63 | 5.10.0-26-amd64 <br> 5.10.0-26-cloud-amd64 <br> 5.10.0-31-amd64 <br> 5.10.0-31-cloud-amd64 <br> 5.10.0-32-amd64 <br> 5.10.0-32-cloud-amd64 <br> 6.1.0-0.deb11.13-amd64 <br> 6.1.0-0.deb11.13-cloud-amd64 <br> 6.1.0-0.deb11.17-amd64 <br> 6.1.0-0.deb11.17-cloud-amd64 <br> 6.1.0-0.deb11.18-amd64 <br> 6.1.0-0.deb11.18-cloud-amd64 <br> 6.1.0-0.deb11.21-amd64 <br> 6.1.0-0.deb11.21-cloud-amd64 <br> 6.1.0-0.deb11.22-amd64 <br> 6.1.0-0.deb11.22-cloud-amd64 | 
Debian 11 | 9.62| 5.10.0-30-amd64 <br> 5.10.0-30-cloud-amd64 <br>6.1.0-0.deb11.21-amd64 <br>6.1.0-0.deb11.21-cloud-amd64 |
Debian 11 | [9.61](https://support.microsoft.com/topic/update-rollup-73-for-azure-site-recovery-d3845f1e-2454-4ae8-b058-c1fec6206698) | 6.1.0-0.deb11.13-amd64 <br> 6.1.0-0.deb11.13-cloud-amd64 <br> 6.1.0-0.deb11.17-amd64 <br> 6.1.0-0.deb11.17-cloud-amd64 <br> 6.1.0-0.deb11.18-amd64 <br> 6.1.0-0.deb11.18-cloud-amd64  <br> 5.10.0-29-amd64 <br> 5.10.0-29-cloud-amd64  |
Debian 11 | 9.60| 5.10.0-27-amd64 <br> 5.10.0-27-cloud-amd64 <br> 5.10.0-28-amd64 <br> 5.10.0-28-cloud-amd64 |
|||
Debian 12 | 9.65 | 6.1.0-32-amd64 <br> 6.1.0-32-cloud-amd64 <br> 6.1.0-33-amd64 <br> 6.1.0-33-cloud-amd64|
Debian 12 | 9.64 | 6.1.0-29-amd64 <br> 6.1.0-29-cloud-amd64 <br> 6.1.0-30-amd64 <br> 6.1.0-30-cloud-amd64 <br> 6.1.0-31-amd64 <br> 6.1.0-31-cloud-amd64 <br>6.1.0-15-cloud-amd64 <br> 6.1.0-26-amd64 <br> 6.1.0-26-cloud-amd64 <br> 6.1.0-27-amd64 <br> 6.1.0-27-cloud-amd64 <br> 6.1.0-28-amd64 <br> 6.1.0-28-cloud-amd64 |
Debian 12 | 9.63 | 6.1.0-25-amd64 <br>6.1.0-25-cloud-amd64 <br>6.1.0-26-amd64 <br> 6.1.0-26-cloud-amd64 |
Debian 12 | 9.62| 6.1.0-22-amd64 <br> 6.1.0-22-cloud-amd64 <br> 6.1.0-23-amd64 <br> 6.1.0-23-cloud-amd64 <br> 6.5.0-0.deb12.4-cloud-amd64  |
Debian 12 | [9.61](https://support.microsoft.com/topic/update-rollup-73-for-azure-site-recovery-d3845f1e-2454-4ae8-b058-c1fec6206698) | 5.17.0-1-amd64 <br> 5.17.0-1-cloud-amd64 <br> 6.1.-11-amd64 <br> 6.1.0-11-cloud-amd64 <br> 6.1.0-12-amd64 <br> 6.1.0-12-cloud-amd64 <br> 6.1.0-13-amd64 <br> 6.1.0-15-amd64 <br> 6.1.0-15-cloud-amd64 <br> 6.1.0-16-amd64 <br> 6.1.0-16-cloud-amd64 <br> 6.1.0-17-amd64 <br> 6.1.0-17-cloud-amd64 <br> 6.1.0-18-amd64 <br> 6.1.0-18-cloud-amd64 <br> 6.1.0-7-amd64 <br> 6.1.0-7-cloud-amd64 <br> 6.5.0-0.deb12.4-amd64 <br> 6.5.0-0.deb12.4-cloud-amd64 <br> 6.1.0-20-amd64 <br> 6.1.0-20-cloud-amd64 <br> 6.1.0-21-amd64 <br> 6.1.0-21-cloud-amd64 |

#### Supported SUSE Linux Enterprise Server 12 kernel versions for Azure virtual machines

> [!NOTE]
> Mobility service versions `9.58` and `9.59` aren't released for Azure to Azure Site Recovery. 


**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
SUSE Linux Enterprise Server 12 (SP1, SP2, SP3, SP4, SP5) | 9.65 | All [stock SUSE 12 SP1,SP2,SP3,SP4,SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 4.12.14-16.197-azure:5 <br> 4.12.14-16.200-azure:5 |
SUSE Linux Enterprise Server 12 (SP1, SP2, SP3, SP4, SP5) | 9.64 | All [stock SUSE 12 SP1,SP2,SP3,SP4,SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 4.12.14-16.197-azure:5 <br> 4.12.14-16.200-azure:5 |
SUSE Linux Enterprise Server 12 (SP1, SP2, SP3, SP4, SP5) | 9.63 | All [stock SUSE 12 SP1,SP2,SP3,SP4,SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 4.12.14-16.194-azure:5 <br> 4.12.14-16.197-azure:5 <br> 4.12.14-16.200-azure:5 |
SUSE Linux Enterprise Server 12 (SP1, SP2, SP3, SP4, SP5) | 9.62 | All [stock SUSE 12 SP1,SP2,SP3,SP4,SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 4.12.14-16.185-azure:5 <br> 4.12.14-16.188-azure:5 <br> 4.12.14-16.191-azure:5 |
SUSE Linux Enterprise Server 12 (SP1, SP2, SP3, SP4, SP5) | [9.61](https://support.microsoft.com/topic/update-rollup-73-for-azure-site-recovery-d3845f1e-2454-4ae8-b058-c1fec6206698) | All [stock SUSE 12 SP1,SP2,SP3,SP4,SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 4.12.14-16.173-azure <br> 4.12.14-16.182-azure:5  |
SUSE Linux Enterprise Server 12 (SP1, SP2, SP3, SP4, SP5) | 9.60 | All [stock SUSE 12 SP1,SP2,SP3,SP4,SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 4.12.14-16.163-azure:5  |


#### Supported SUSE Linux Enterprise Server 15 kernel versions for Azure virtual machines

> [!NOTE]
> Mobility service versions `9.58` and `9.59` aren't released for Azure to Azure Site Recovery. 
 

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
SUSE Linux Enterprise Server 15 (SP1, SP2, SP3, SP4, SP5, SP6) | 9.65 | All [stock SUSE 15 SP1,SP2,SP3,SP4,SP5, SP6 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 6.4.0-150600.8.23-azure:6 <br> 6.4.0-150600.8.26-azure:6 <br> 6.4.0-150600.8.31-azure:6 <br> 6.4.0-150600.8.34-azure:6 |
SUSE Linux Enterprise Server 15 (SP1, SP2, SP3, SP4, SP5, SP6) | 9.64 | All [stock SUSE 15 SP1,SP2,SP3,SP4,SP5, SP6 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 5.14.21-150500.33.66-azure:5 <br> 5.14.21-150500.33.69-azure:5 <br> 5.14.21-150500.33.72-azure:5 <br> 5.14.21-150500.33.75-azure:5 <br> 6.4.0-150600.6-azure:6 <br> 6.4.0-150600.8.11-azure:6 <br> 6.4.0-150600.8.14-azure:6 <br> 6.4.0-150600.8.17-azure:6 <br> 6.4.0-150600.8.20-azure:6 <br> 6.4.0-150600.8.5-azure:6 <br> 6.4.0-150600.8.8-azure:6 |
SUSE Linux Enterprise Server 15 (SP1, SP2, SP3, SP4, SP5, SP6) | 9.63 | All [stock SUSE 15 SP1,SP2,SP3,SP4,SP5, SP6 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 5.14.21-150500.33.63-azure:5 <br> 5.14.21-150500.33.66-azure:5 <br> 6.4.0-150600.6-azure:6 <br>6.4.0-150600.8.11-azure:6 <br> 6.4.0-150600.8.5-azure:6 <br> 6.4.0-150600.8.8-azure:6 <br> 6.4.0-150600.8.14-azure:6 <br> 5.14.21-150500.33.69-azure:5 |
SUSE Linux Enterprise Server 15 (SP1, SP2, SP3, SP4, SP5) | 9.62 | All [stock SUSE 15 SP1,SP2,SP3,SP4,SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 5.14.21-150500.33.54-azure:5 <br> 5.14.21-150500.33.57-azure:5 <br> 5.14.21-150500.33.60-azure:5  |
SUSE Linux Enterprise Server 15 (SP1, SP2, SP3, SP4, SP5) | [9.61](https://support.microsoft.com/topic/update-rollup-73-for-azure-site-recovery-d3845f1e-2454-4ae8-b058-c1fec6206698) | All [stock SUSE 15 SP1,SP2,SP3,SP4,SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 5.14.21-150500.33.37-azure <br> 5.14.21-150500.33.42-azure <br> 5.14.21-150500.33.48-azure:5 <br> 5.14.21-150500.33.51-azure:5 |
SUSE Linux Enterprise Server 15 (SP1, SP2, SP3, SP4, SP5) | 9.60 | By default, all [stock SUSE 15, SP1, SP2, SP3, SP4, SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 5.14.21-150500.33.29-azure <br> 5.14.21-150500.33.34-azure  |


#### Supported Red Hat Linux kernel versions for Oracle Linux on Azure virtual machines 

**Release** | **Mobility service version** | **Red Hat kernel version** |
--- | --- | --- |
Oracle Linux 9.0  <br> Oracle Linux 9.1  <br> Oracle Linux 9.2  <br> Oracle Linux 9.3 <br> Oracle Linux 9.4 <br> Oracle Linux 9.5 | 9.65 | 5.14.0-503.11.1 and higher. |
Oracle Linux 9.0  <br> Oracle Linux 9.1  <br> Oracle Linux 9.2  <br> Oracle Linux 9.3 <br> Oracle Linux 9.4 | 9.64 | 5.14.0-284.73.1.el9_2.x86_64 <br> 5.14.0-284.75.1.el9_2.x86_64 <br> 5.14.0-284.77.1.el9_2.x86_64 <br> 5.14.0-284.79.1.el9_2.x86_64 <br> 5.14.0-284.80.1.el9_2.x86_64 <br> 5.14.0-284.82.1.el9_2.x86_64 <br> 5.14.0-284.84.1.el9_2.x86_64 <br> 5.14.0-284.85.1.el9_2.x86_64 <br> 5.14.0-284.86.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64 <br> 5.14.0-427.24.1.el9_4.x86_64 <br> 5.14.0-427.26.1.el9_4.x86_64 <br> 5.14.0-427.28.1.el9_4.x86_64 <br> 5.14.0-427.31.1.el9_4.x86_64 <br> 5.14.0-427.33.1.el9_4.x86_64 <br> 5.14.0-427.35.1.el9_4.x86_64 <br> 5.14.0-427.37.1.el9_4.x86_64 |
Oracle Linux 9.0  <br> Oracle Linux 9.1  <br> Oracle Linux 9.2  <br> Oracle Linux 9.3 <br> Oracle Linux 9.4 | 9.63 | 5.14.0-284.73.1.el9_2.x86_64 <br> 5.14.0-284.75.1.el9_2.x86_64 <br> 5.14.0-284.77.1.el9_2.x86_64 <br> 5.14.0-284.79.1.el9_2.x86_64 <br> 5.14.0-284.80.1.el9_2.x86_64 <br> 5.14.0-284.82.1.el9_2.x86_64 <br> 5.14.0-284.84.1.el9_2.x86_64 <br> 5.14.0-284.85.1.el9_2.x86_64 <br> 5.14.0-284.86.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64 <br> 5.14.0-427.24.1.el9_4.x86_64 <br> 5.14.0-427.26.1.el9_4.x86_64 <br> 5.14.0-427.28.1.el9_4.x86_64 <br> 5.14.0-427.31.1.el9_4.x86_64 <br> 5.14.0-427.33.1.el9_4.x86_64 <br> 5.14.0-427.35.1.el9_4.x86_64 <br> 5.14.0-427.37.1.el9_4.x86_64 |
Oracle Linux 9.0  <br> Oracle Linux 9.1  <br> Oracle Linux 9.2  <br> Oracle Linux 9.3 | 9.62 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 |
Oracle Linux 9.0  <br> Oracle Linux 9.1  <br> Oracle Linux 9.2  <br> Oracle Linux 9.3 | 9.61 |  5.14.0-70.93.2.el9_0.x86_64 <br> 5.14.0-284.54.1.el9_2.x86_64 <br> 5.14.0-284.57.1.el9_2.x86_64 <br> 5.14.0-284.59.1.el9_2.x86_64 <br> 5.14.0-362.24.1.el9_3.x86_64 |
Oracle Linux 9.0  <br> Oracle Linux 9.1  <br> Oracle Linux 9.2  <br> Oracle Linux 9.3 | 9.60 |  5.14.0-70.13.1.el9_0.x86_64 <br> 5.14.0-70.17.1.el9_0.x86_64 <br> 5.14.0-70.22.1.el9_0.x86_64 <br> 5.14.0-70.26.1.el9_0.x86_64 <br> 5.14.0-70.30.1.el9_0.x86_64 <br> 5.14.0-70.36.1.el9_0.x86_64 <br> 5.14.0-70.43.1.el9_0.x86_64 <br> 5.14.0-70.49.1.el9_0.x86_64 <br> 5.14.0-70.50.2.el9_0.x86_64 <br> 5.14.0-70.53.1.el9_0.x86_64 <br> 5.14.0-70.58.1.el9_0.x86_64 <br> 5.14.0-70.64.1.el9_0.x86_64 <br> 5.14.0-70.70.1.el9_0.x86_64 <br> 5.14.0-70.75.1.el9_0.x86_64 <br> 5.14.0-70.80.1.el9_0.x86_64 <br> 5.14.0-70.85.1.el9_0.x86_64 <br> 5.14.0-162.6.1.el9_1.x86_64  <br> 5.14.0-162.12.1.el9_1.x86_64 <br> 5.14.0-162.18.1.el9_1.x86_64 <br> 5.14.0-162.22.2.el9_1.x86_64 <br> 5.14.0-162.23.1.el9_1.x86_64 <br> 5.14.0-284.11.1.el9_2.x86_64 <br> 5.14.0-284.13.1.el9_2.x86_64 <br> 5.14.0-284.16.1.el9_2.x86_64 <br> 5.14.0-284.18.1.el9_2.x86_64 <br> 5.14.0-284.23.1.el9_2.x86_64 <br> 5.14.0-284.25.1.el9_2.x86_64 <br> 5.14.0-284.28.1.el9_2.x86_64 <br> 5.14.0-284.30.1.el9_2.x86_64  <br> 5.14.0-284.32.1.el9_2.x86_64 <br> 5.14.0-284.34.1.el9_2.x86_64 <br> 5.14.0-284.36.1.el9_2.x86_64 <br> 5.14.0-284.40.1.el9_2.x86_64 <br> 5.14.0-284.41.1.el9_2.x86_64 <br>5.14.0-284.43.1.el9_2.x86_64 <br>5.14.0-284.44.1.el9_2.x86_64 <br> 5.14.0-284.45.1.el9_2.x86_64 <br>5.14.0-284.48.1.el9_2.x86_64 <br>5.14.0-284.50.1.el9_2.x86_64 <br> 5.14.0-284.52.1.el9_2.x86_64 <br>5.14.0-362.8.1.el9_3.x86_64 <br>5.14.0-362.13.1.el9_3.x86_64 <br> 5.14.0-362.18.1.el9_3.x86_64 |

#### Supported Rocky Linux kernel versions for Azure virtual machines

> [!NOTE]
> Mobility service versions `9.58` and `9.59` aren't released for Azure to Azure Site Recovery. 
 

**Release** | **Mobility service version** | **Red Hat kernel version** |
--- | --- | --- |
Rocky Linux 9.0 <br> Rocky Linux 9.1 <br> Rocky Linux 9.2 <br> Rocky Linux 9.3 <br> Rocky Linux 9.4 <br> Rocky Linux 9.5 |9.65 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64|
Rocky Linux 9.0 <br> Rocky Linux 9.1 |9.64 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64|
Rocky Linux 9.0 <br> Rocky Linux 9.1 |9.63 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64|
Rocky Linux 9.0 <br> Rocky Linux 9.1 |9.62 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64|
Rocky Linux 9.0 <br> Rocky Linux 9.1  | 9.61 |  5.14.0-70.93.2.el9_0.x86_64 |
Rocky Linux 9.0 <br> Rocky Linux 9.1  | 9.60 |  5.14.0-70.13.1.el9_0.x86_64 <br> 5.14.0-70.17.1.el9_0.x86_64 <br> 5.14.0-70.22.1.el9_0.x86_64 <br> 5.14.0-70.26.1.el9_0.x86_64 <br> 5.14.0-70.30.1.el9_0.x86_64 <br> 5.14.0-70.36.1.el9_0.x86_64 <br> 5.14.0-70.43.1.el9_0.x86_64 <br> 5.14.0-70.49.1.el9_0.x86_64 <br> 5.14.0-70.50.2.el9_0.x86_64 <br> 5.14.0-70.53.1.el9_0.x86_64 <br> 5.14.0-70.58.1.el9_0.x86_64 <br> 5.14.0-70.64.1.el9_0.x86_64 <br> 5.14.0-70.70.1.el9_0.x86_64 <br> 5.14.0-70.75.1.el9_0.x86_64 <br> 5.14.0-70.80.1.el9_0.x86_64 <br> 5.14.0-70.85.1.el9_0.x86_64 <br> 5.14.0-162.6.1.el9_1.x86_64  <br> 5.14.0-162.12.1.el9_1.x86_64 <br> 5.14.0-162.18.1.el9_1.x86_64 <br> 5.14.0-162.22.2.el9_1.x86_64 <br> 5.14.0-162.23.1.el9_1.x86_64  |

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
Rocky Linux  | [9.57](https://support.microsoft.com/topic/e94901f6-7624-4bb4-8d43-12483d2e1d50) | Rocky Linux 8.8 <br> Rocky Linux 8.9 |
Rocky Linux  | [9.56](https://support.microsoft.com/topic/update-rollup-69-for-azure-site-recovery-kb5033791-a41c2400-0079-4f93-b4a4-366660d0a30d) | Rocky Linux 8.7 <br> Rocky Linux 9.0 |

#### Supported Alma Linux kernel versions for Azure virtual machines

> [!NOTE]
> Mobility service versions `9.58` and `9.59` aren't released for Azure to Azure Site Recovery. 

**Release** | **Mobility service version** | **Red Hat kernel version** |
--- | --- | --- |
Alma Linux 9.0 <br> Alma Linux 9.1 <br> Alma Linux 9.2 <br> Alma Linux 9.3 <br> Alma Linux 9.4 <br> Alma Linux 9.5 |9.65 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64|
Alma Linux 9.0 <br> Alma Linux 9.1 |9.64 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64|

## Replicated machines - Linux file system/guest storage

* File systems: ext3, ext4, XFS, BTRFS
* Volume manager: LVM2

> [!NOTE]
> Multipath software isn't supported.


## Replicated machines - compute settings

**Setting** | **Support** | **Details**
--- | --- | ---
Size | Any Azure VM size with at least two CPU cores and 1-GB RAM | Verify [Azure virtual machine sizes](/azure/virtual-machines/sizes).
RAM | Azure Site Recovery driver consumes 6% of RAM.
Availability sets | Supported | If you enable replication for an Azure VM with the default options, an availability set is created automatically, based on the source region settings. You can modify these settings.
Availability zones | Supported |
Dedicated Hosts | Not supported |
Hybrid Use Benefit (HUB) | Supported | If the source VM has a HUB license enabled, a test failover or failed over VM also uses the HUB license.
Virtual Machine Scale Set Flex | Availability scenario - supported. Scalability scenario - not supported. |
Azure gallery images - Microsoft published | Supported | Supported if the VM runs on a supported operating system.
Azure Gallery images - Third party published | Supported | Supported if the VM runs on a supported operating system.
Custom images - Third party published | Supported | The VM is supported if it runs on a supported operating system. During test failover and failover, Azure creates a VM with an Azure Marketplace image. Ensure that no custom Azure Policy blocks this operation. 
VMs migrated using Site Recovery | Supported | If a VMware VM or physical machine was migrated to Azure using Site Recovery, you need to uninstall the older version of Mobility service running on the machine, and restart the machine before replicating it to another Azure region.
Azure RBAC policies | Not supported | Azure role-based access control (Azure RBAC) policies on VMs aren't replicated to the failover VM in target region.
Extensions | Not supported | Extensions aren't replicated to the failover VM in target region. It needs to be installed manually after failover.
Proximity Placement Groups | Supported | Virtual machines located inside a Proximity Placement Group can be protected using Site Recovery.
Tags  | Supported | User-generated tags applied on source virtual machines are carried over to target virtual machines post-test failover or failover. Tags on the VM(s) are replicated once every 24 hours for as long as the VM(s) is/are present in the target region.


## Replicated machines - disk actions

**Action** | **Details**
-- | ---
Resize disk on replicated VM | Resizing up on the source VM is supported. Resizing down on the source VM isn't supported. Resizing should be performed before failover. No need to disable/re-enable replication.<br/><br/> If you change the source VM after failover, the changes aren't captured.<br/><br/> If you change the disk size on the Azure VM after failover, changes aren't captured by Site Recovery, and failback is to the original VM size.<br/><br/> If resizing to >=4 TB, note Azure guidance on disk caching [here](/azure/virtual-machines/premium-storage-performance). 
Add a disk to a replicated VM | Supported
Offline changes to protected disks | Disconnecting disks and making offline modifications to them require triggering a full resync.
Disk caching | Disk Caching isn't supported for disks 4 TB and larger. If multiple disks are attached to your VM, each disk that is smaller than 4 TB supports caching. Changing the cache setting of an Azure disk detaches and re-attaches the target disk. If it's the operating system disk, the VM is restarted. Stop all applications/services that might be affected by this disruption before changing the disk cache setting. Not following those recommendations could lead to data corruption.


## Replicated machines - storage

> [!NOTE]
> Azure Site Recovery supports storage accounts with page blob for unmanaged disk replication.
>
> Unmanaged disks were deprecated on September 30, 2022, and are slated to retire by September 30, 2025. Managed disks now offers the full capabilities of unmanaged disks, along with additional advancements.

This table summarized support for the Azure VM OS disk, data disk, and temporary disk.

- It's important to observe the VM disk limits and targets for [managed disks](/azure/virtual-machines/disks-scalability-targets) to avoid any performance issues.
- If you deploy with the default settings, Site Recovery automatically creates disks and storage accounts based on the source settings.
- If you customize, ensure you follow the guidelines.

**Component** | **Support** | **Details**
--- | --- | ---
Disk renaming | Supported | 
OS disk maximum size | [4095 GiB](/azure/virtual-machines/managed-disks-overview#os-disk) | [Learn more](/azure/virtual-machines/managed-disks-overview) about VM disks.
Temporary disk | Not supported | The temporary disk is always excluded from replication.<br/><br/> Don't store any persistent data on the temporary disk. [Learn more](/azure/virtual-machines/managed-disks-overview).
Data disk maximum size | 32 TiB for managed disks<br></br>4     TiB for unmanaged disks|
Data disk minimum size | No restriction for unmanaged disks. 1 GiB for managed disks |
Data disk maximum number | Up to 64, in accordance with support for a specific Azure VM size | [Learn more](/azure/virtual-machines/sizes) about VM sizes.
Data disk maximum size per storage account (for unmanaged disks) | 35 TiB | This is an upper limit for cumulative size of page blobs created in a premium Storage Account
Data disk change rate | Maximum of 20 MBps per disk for premium storage. Maximum of 2 MBps per disk for Standard storage. | If the average data change rate on the disk is continuously higher than the maximum, replication won't catch up.<br/><br/>  However, if the maximum is exceeded sporadically, replication can catch up, but you might see slightly delayed recovery points.
Data disk - standard storage account | Supported |
Data disk - premium storage account | Supported | If a VM has disks spread across premium and standard storage accounts, you can select a different target storage account for each disk, to ensure you have the same storage configuration in the target region.
Managed disk - standard | Supported in Azure regions in which Azure Site Recovery is supported. |
Managed disk - premium | Supported in Azure regions in which Azure Site Recovery is supported. |
Disk subscription limits | Up to 3000 protected disks per Subscription | Ensure that the Source or Target subscription doesn't have more than 3000 Azure Site Recovery-protected Disks (Both Data and OS).
Standard SSD | Supported |
Redundancy | LRS, ZRS, and GRS are supported.
Cool and hot storage | Not supported | VM disks aren't supported on cool and hot storage
Storage Spaces | Supported |
NVMe storage interface | Not supported
Encryption at host | Not Supported | The VM is protected, but the failed over VM won't have Encryption at host enabled. [See detailed information](/azure/virtual-machines/disks-enable-host-based-encryption-portal) to create a VM with end-to-end encryption using Encryption at host.
Encryption at rest (SSE) | Supported | SSE is the default setting on storage accounts.
Encryption at rest (CMK) | Supported | Both Software and HSM keys are supported for managed disks
Double Encryption at rest | Supported | Learn more on supported regions for [Windows](/azure/virtual-machines/disk-encryption) and [Linux](/azure/virtual-machines/disk-encryption)
FIPS encryption | Not supported
Azure Disk Encryption (ADE) for Windows OS | Supported for VMs with managed disks. | VMs using unmanaged disks aren't supported. <br/><br/> HSM-protected keys aren't supported. <br/><br/> Encryption of individual volumes on a single disk isn't supported. |
Azure Disk Encryption (ADE) for Linux OS | Supported for VMs with managed disks. | VMs using unmanaged disks aren't supported. <br/><br/> HSM-protected keys aren't supported. <br/><br/> Encryption of individual volumes on a single disk isn't supported. <br><br> Known issue with enabling replication. [Learn more.](./azure-to-azure-troubleshoot-errors.md#enable-protection-failed-as-the-installer-is-unable-to-find-the-root-disk-error-code-151137) |
SAS key rotation | Supported | If the SAS key for storage accounts is rotated, you must disable and re-enable replication.  |
Host Caching | Supported | |
Hot add    | Supported | Enabling replication for a data disk that you add to a replicated Azure VM is supported for VMs that use managed disks. <br/><br/> Only one disk can be hot added to an Azure VM at a time. Parallel addition of multiple disks isn't supported. |
Hot remove disk    | Not supported | If you  remove data disk on the VM, you need to disable replication and enable replication again for the VM.
Exclude disk | Supported. You can use [PowerShell](azure-to-azure-exclude-disks.md) or navigate to **Advanced Setting** > **Storage Settings** > **Disk to Replicate** option from the portal. | Temporary disks are excluded by default.
Storage Spaces Direct  | Supported for crash consistent recovery points. Application consistent recovery points aren't supported. |
Scale-out File Server  | Supported for crash consistent recovery points. Application consistent recovery points aren't supported. |
DRBD | Disks that are part of a DRBD setup aren't supported. |
LRS | Supported |
GRS | Supported |
RA-GRS | Supported |
ZRS | Supported | 
Cool and Hot Storage | Not supported | Virtual machine disks aren't supported on cool and hot storage
Azure Storage firewalls for virtual networks  | Supported | If you want to restrict virtual network access to storage accounts, enable [Allow trusted Microsoft services](../storage/common/storage-network-security.md#exceptions).
General purpose V2 storage accounts (Both Hot and Cool tier) | Supported | Transaction costs increase substantially compared to General purpose V1 storage accounts
Generation 2 (UEFI boot) | Supported
NVMe disks | Not supported
Managed Shared Disk| Supported 
Managed Premium SSD v2 Disk| Supported | Public Preview with PowerShell support in all public regions except Australia East and West Central US. Portal is not supported.
Ultra Disks | Not supported
Secure transfer option | Supported
Write accelerator enabled disks | Not supported
Tags  | Supported | User-generated tags are replicated every 24 hours.
Soft delete | Not supported | Soft delete isn't supported because once it's enabled on a storage account, it increases cost. Azure Site Recovery performs very frequent creates/deletes of log files while replicating causing costs to increase.
iSCSI disks | Not supported | Azure Site Recovery may be used to migrate or failover iSCSI disks into Azure. However, iSCSI disks aren't supported for Azure to Azure replication and failover/failback.

>[!IMPORTANT]
> To avoid performance issues, make sure that you follow VM disk scalability and performance targets for [managed disks](/azure/virtual-machines/disks-scalability-targets). If you use default settings, Site Recovery creates the required disks and storage accounts, based on the source configuration. If you customize and select your own settings, follow the disk scalability and performance targets for your source VMs.

## Limits and data change rates

The following table summarizes Site Recovery limits.

- These limits are based on our tests, but obviously don't cover all possible application I/O combinations.
- Actual results can vary based on your app I/O mix.
- There are two limits to consider, per disk data churn and per virtual machine data churn.
- The current limit for per virtual machine data churn is 54 MB/s, regardless of size.


**Replica Disk type ** | **Average source disk I/O** | **Average source disk data churn** | **Total source disk data churn per day**
---|---|---|---
Standard storage | 8 KB    | 2 MB/s | 168 GB per disk
Premium SSD with disk size 128 GiB or more  | 8 KB    | 2 MB/s | 168 GB per disk
Premium SSD with disk size 128 GiB or more  | 16 KB | 4 MB/s |    336 GB per disk
Premium SSD with disk size 128 GiB or more  | 32 KB or greater | 8 MB/s | 672 GB per disk
Premium SSD with disk size 512 GiB or more  | 8 KB    | 5 MB/s | 421 GB per disk
Premium SSD with disk size 512 GiB or more  | 16 KB or greater |20 MB/s | 1684 GB per disk


>[!Note]
>High churn support is now available in Azure Site Recovery where churn limit per virtual machine has increased up to 100 MB/s. For more information, see [Azure VM Disaster Recovery - High Churn Support](./concepts-azure-to-azure-high-churn-support.md).

## Replicated machines - networking

**Setting** | **Support** | **Details**
--- | --- | ---
NIC | Maximum number supported for a specific Azure VM size | NICs are created when the VM is created during failover.<br/><br/> The number of NICs on the failover VM depends on the number of NICs on the source VM when replication was enabled. If you add or remove a NIC after enabling replication, it doesn't impact the number of NICs on the replicated VM after failover. <br/><br/> The order of NICs after failover isn't guaranteed to be the same as the original order. <br><br> You can rename NICs in the target region based on your organization's naming conventions.
Internet Load Balancer | Not supported | You can set up public/internet load balancers in the primary region. However, public/internet load balancers aren't supported by Azure Site Recovery in the DR region.
Internal Load balancer | Supported | Associate the preconfigured load balancer using an Azure Automation script in a recovery plan.
Public IP address | Supported | Associate an existing public IP address with the NIC. Or, create a public IP address and associate it with the NIC using an Azure Automation script in a recovery plan.
NSG on NIC | Supported | Associate the NSG with the NIC using an Azure Automation script in a recovery plan.
NSG on subnet | Supported | Associate the NSG with the subnet using an Azure Automation script in a recovery plan.
Reserved (static) IP address | Supported | If the NIC on the source VM has a static IP address, and the target subnet has the same IP address available, it's assigned to the failed over VM.<br/><br/> If the target subnet doesn't have the same IP address available, one of the available IP addresses in the subnet is reserved for the VM.<br/><br/> You can also specify a fixed IP address and subnet in **Replicated items** > **Settings** > **Network** > **Network interfaces**.
Dynamic IP address | Supported | If the NIC on the source has dynamic IP addressing, the NIC on the failed over VM is also dynamic by default.<br/><br/> You can modify this to a fixed IP address if required.
Multiple IP addresses | Supported | When you fail over a VM that has a NIC with multiple IP addresses, only the primary IP address of the NIC in the source region is kept by default. To failover Secondary IP Configurations, go to the **Network** blade and configure them. <br> This is supported only for region replication, zone to zone replication isn't supported.
Traffic Manager     | Supported | You can preconfigure Traffic Manager so that traffic is routed to the endpoint in the source region on a regular basis, and to the endpoint in the target region in case of failover.
Azure DNS | Supported |
Custom DNS    | Supported |
Unauthenticated proxy | Supported | [Learn more](./azure-to-azure-about-networking.md)
Authenticated Proxy | Not supported | If the VM is using an authenticated proxy for outbound connectivity, it can't be replicated using Azure Site Recovery.
VPN site-to-site connection to on-premises<br/><br/>(with or without ExpressRoute)| Supported | Ensure that the UDRs and NSGs are configured in such a way that the Site Recovery traffic isn't routed to on-premises. [Learn more](./azure-to-azure-about-networking.md)
VNET to VNET connection    | Supported | [Learn more](./azure-to-azure-about-networking.md)
Virtual Network Service Endpoints | Supported | If you're restricting the virtual network access to storage accounts, ensure that the trusted Microsoft services are allowed access to the storage account.
Accelerated networking | Supported | Accelerated networking can be enabled on the recovery VM only if it's enabled on the source VM also. [Learn more](azure-vm-disaster-recovery-with-accelerated-networking.md).
Palo Alto Network Appliance | Not supported | With third-party appliances, there are often restrictions imposed by the provider inside the Virtual Machine. Azure Site Recovery needs agent, extensions, and outbound connectivity to be available. But the appliance doesn't let any outbound activity to be configured inside the Virtual Machine.
IPv6  | Not supported | Mixed configurations that include both IPv4 and IPv6 are supported. However, Azure Site Recovery uses any free IPv4 address available, if there are no free IPv4 addresses in the subnet, then the configuration isn't supported.
Private link access to Site Recovery service | Supported | [Learn more](azure-to-azure-how-to-enable-replication-private-endpoints.md)
Tags  | Supported | User-generated tags on NICs are replicated every 24 hours.



## Next steps

- Read [networking guidance](./azure-to-azure-about-networking.md)  for replicating Azure VMs.
- Deploy disaster recovery by [replicating Azure VMs](./azure-to-azure-quickstart.md).
