---
title: Support Matrix for Azure VM Disaster Recovery with Azure Site Recovery
description: Summarizes support for Azure VMs disaster recovery to a secondary region with Azure Site Recovery.
ms.topic: concept-article
ms.date: 01/01/2026
ms.service: azure-site-recovery
author: Jeronika-MS
ms.author: v-gajeronika
ms.custom: engagement-fy23, references_regions, linux-related-content
# Customer intent: As an IT manager, I want to understand the disaster recovery support for Azure VMs by using Azure Site Recovery so that I can effectively plan my organization's resilience against data loss and ensure compliance with our recovery objectives.
---

# Support matrix for Azure VM disaster recovery between Azure regions

This article summarizes support and prerequisites for disaster recovery (DR) of Azure virtual machines (VMs) from one Azure region to another by using [Azure Site Recovery](site-recovery-overview.md).

## Deployment method support

Deployment | Support
--- | ---
Azure portal | Supported.
Azure PowerShell | Supported. For more information, see how to [set up DR for Azure VMs by using Azure PowerShell](Azure-to-Azure-powershell.md).
REST API | Supported.
Azure CLI | Not currently supported.

## Resource move or migrate support

Resource action | Details
--- | ---
Move vaults across resource groups. | Not supported.
Move compute, storage, or network resources across resource groups. | Not supported.<br/><br/> For example, you move a VM or associated components, such as storage or a network, after the VM is replicating. Then you need to disable and re-enable replication for the VM.
Replicate Azure VMs from one subscription to another for DR. | Supported within the same Microsoft Entra tenant.
Migrate VMs across regions within supported geographical clusters (within and across subscriptions). | Supported within the same Microsoft Entra tenant.
Migrate VMs within the same region. | Not supported.
Azure Dedicated Host. | Not supported.
Azure Virtual Desktop infrastructure VMs. | Supported if all the Azure-to-Azure replication prerequisites are fulfilled. (Zone-to-zone replication for individual servers is also supported.)

## Region support

With Site Recovery, you can perform global DR. You can replicate and recover VMs between any two Azure regions in the world. If you have concerns around data sovereignty, you can limit replication within your specific geographic cluster.

For information on the various geographic clusters that are supported, see [Products available by region](https://Azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=site-recovery&regions=all).

Support for restricted regions is reserved for in-country/region DR:

- Switzerland West is reserved for Switzerland North customers.
- France South is reserved for France Central customers.
- Norway West is reserved for Norway East customers.
- JIO India Central is reserved for JIO India West customers.
- Brazil Southeast is reserved for Brazil South customers.
- South Africa West is reserved for South Africa North customers.
- Germany North is reserved for Germany West Central customers.
- UAE Central is reserved for UAE North customers.

To use restricted regions as your primary or recovery region, make a request at [Products available by region](/troubleshoot/Azure/general/region-access-request-process) for both source and target subscriptions to get on the allow list:

- For Brazil South, you can replicate and fail over to the following regions: Brazil Southeast, South Central US, West Central US, East US, East US 2, West US, West US 2, and North Central US.
- You can use only Brazil South as a source region from which VMs can replicate by using Site Recovery. It can't act as a target region. If you fail over from Brazil South as a source region to a target, failback to Brazil South from the target region is supported. You can use only Brazil Southeast as a target region.
- If the region in which you want to create a vault doesn't show, make sure that your subscription has access to create resources in that region.
- If you can't see a region within a geographic cluster when you enable replication, make sure that your subscription has permissions to create VMs in that region.

## Cache storage

This table summarizes support for the cache storage account used by Site Recovery during replication.

Setting | Support | Details
--- | --- | ---
General-purpose V2 (GPv2) storage accounts (hot and cool tiers) | Supported | We recommend using GPv2 because GPv1 doesn't support zone-redundant storage (ZRS).
Premium storage | Supported | Use Premium block blob storage accounts to get high-churn support. For more information, see [Azure VM disaster recovery: High-churn support](./concepts-Azure-to-Azure-high-churn-support.md).
Region | Same region as VM | Cache storage account should be in the same region as the VM being protected.
Subscription | Can be different from source VMs | Cache storage account must be in the same subscription as the source VMs. To use cache storage from the target subscription, use Azure PowerShell.
Azure Storage firewalls for virtual networks | Supported | If you use a firewall-enabled cache storage account or a target storage account, ensure that you [allow trusted Microsoft services](../storage/common/storage-network-security.md#exceptions).<br></br>Ensure that you allow access to at least one subnet of the source virtual network.<br></br>If you use user-assigned managed identity (UAMI) created on an Azure Recovery Services vault, don't restrict virtual network access to your storage accounts that are used for Site Recovery. Allow access from all networks if you use vault UAMI.
Soft delete | Not supported | Soft delete isn't supported because after soft delete is enabled on a cache storage account, it increases cost. Site Recovery performs frequent creates/deletes of log files. Replicating causes costs to increase.
Encryption at rest | Supported | You can configure storage account encryption with customer-managed keys (CMKs).
Managed identity | Not supported | The cached storage account must allow shared key access and shared access signatures signed by the shared key. Recent changes in Azure Policy disable key authentication because of security concerns. For Site Recovery, you need to enable it again.

The following table lists the limits in terms of number of disks that can replicate to a single storage account.

Storage account type | Churn = 4 MBps per disk | Churn = 8 MBps per disk
--- | --- | ---
V1 storage account | 300 disks | 150 disks
V2 storage account | 750 disks | 375 disks

As average churn on the disks increases, the number of disks that a storage account can support decreases. Use the preceding table as a guide for making decisions on the number of storage accounts that must be provisioned.

The cache limits are specific to Azure-to-Azure and zone-to-zone DR scenarios.

When you enable replication via the VM workflow for cross-subscriptions, the portal lists only the cache storage account from the source subscription. It doesn't list any storage account created in the target subscription. To set up this scenario, use [Azure PowerShell](Azure-to-Azure-powershell.md).

## Replicated machine operating systems

Site Recovery supports replication of Azure VMs running the operating systems listed in this section. For example, an already-replicating machine's operating system is later upgraded (or downgraded) to a different major version of the operating system, as in Red Hat Enterprise Linux (RHEL) 8 to RHEL 9. Then you must disable replication, uninstall the mobility agent, and re-enable replication after the upgrade.

>[!NOTE]
>Major Linux OS upgrade without disable is currently in Preview. [Learn more](#upgrade-linux-major-os-version-without-disabling-replication-preview).

### Windows

Operating system | Details
--- | ---
Windows Server 2025 | Supported.
Windows Server 2022 | Supported.
Windows Server 2019 | Supported for Server Core, Server with Desktop Experience.
Windows Server 2016 | Supported Server Core, Server with Desktop Experience.
Windows Server 2012 R2 | Supported.
Windows Server 2012 | Supported.
Windows Server 2008 R2 with SP1/SP2 | Supported.<br/><br/> From version [9.30](https://support.microsoft.com/help/4531426/update-rollup-42-for-Azure-site-recovery) of the Mobility service extension for Azure VMs, you need to install a Windows [servicing stack update (SSU)](https://support.microsoft.com/help/4490628) and [SHA-2 update](https://support.microsoft.com/help/4474419) on machines running Windows Server 2008 R2 SP1/SP2. SHA-1 isn't supported as of September 2019. If SHA-2 code signing isn't enabled, the agent extension won't install/upgrade as expected. For more information, see [SHA-2 code signing support requirement for Windows](https://aka.ms/SHA-2KB).
Windows 11 (x64) | Supported (from the mobility agent version 9.56 and later).
Windows 10 (x64) | Supported.
Windows 8.1 (x64) | Supported.
Windows 8 (x64) | Supported.
Windows 7 (x64) with SP1 and later | From version [9.30](https://support.microsoft.com/help/4531426/update-rollup-42-for-Azure-site-recovery) of the Mobility service extension for Azure VMs, you need to install a Windows [SSU](https://support.microsoft.com/help/4490628) and [SHA-2 update](https://support.microsoft.com/help/4474419) on machines running Windows 7 with SP1. SHA-1 isn't supported as of September 2019. If SHA-2 code signing isn't enabled, the agent extension won't install/upgrade as expected. For more information, see [SHA-2 code signing support requirement for Windows](https://aka.ms/SHA-2KB).

### Linux

Mobility service versions 9.58 and 9.59 aren't released for Azure to Azure Site Recovery.

Operating system | Details
--- | ---
Red Hat Enterprise Linux | 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, [7.7](https://support.microsoft.com/help/4528026/update-rollup-41-for-azure-site-recovery), [7.8](https://support.microsoft.com/help/4564347/), [7.9](https://support.microsoft.com/help/4578241/), [8.0](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery), 8.1, [8.2](https://support.microsoft.com/help/4570609/), [8.3](https://support.microsoft.com/help/4597409/), [8.4](https://support.microsoft.com/topic/883a93a7-57df-4b26-a1c4-847efb34a9e8) (4.18.0-305.30.1.el8_4.x86_64 or later), [8.5](https://support.microsoft.com/topic/883a93a7-57df-4b26-a1c4-847efb34a9e8) (4.18.0-348.5.1.el8_5.x86_64 or later), [8.6](https://support.microsoft.com/topic/update-rollup-62-for-azure-site-recovery-e7aff36f-b6ad-4705-901c-f662c00c402b) (4.18.0-348.5.1.el8_5.x86_64 or later), 8.7, 8.8, 8.9, 8.10, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 10.0, 10.1 <br> RHEL `9.x`, `10.x` is supported for the [following kernel versions](#supported-kernel-versions-for-red-hat-enterprise-linux-for-azure-vms).
Ubuntu 14.04 LTS Server | Includes support for all 14.04.*x* versions. [Supported kernel versions](#supported-ubuntu-kernel-versions-for-azure-vms).
Ubuntu 16.04 LTS Server | Includes support for all 16.04.*x* versions. [Supported kernel versions](#supported-ubuntu-kernel-versions-for-azure-vms).<br/><br/> Ubuntu servers using password-based authentication and sign-in, and the `cloud-init` package to configure cloud VMs, might have password-based sign-in disabled on failover (depending on the `cloud-init` configuration). To re-enable password-based sign-in on the VM, reset the password from the **Support** > **Troubleshooting** > **Settings** menu of the failed-over VM in the Azure portal.
Ubuntu 18.04 LTS Server | Includes support for all 18.04.*x* versions. [Supported kernel versions](#supported-ubuntu-kernel-versions-for-azure-vms).<br/><br/> Ubuntu servers using password-based authentication and sign-in, and the `cloud-init` package to configure cloud VMs, might have password-based sign-in disabled on failover (depending on the `cloud-init` configuration). To re-enable password-based sign-in on the VM, reset the password from the **Support** > **Troubleshooting** > **Settings** menu of the failed-over VM in the Azure portal.
Ubuntu 20.04 LTS server | Includes support for all 20.04.*x* versions. [Supported kernel versions](#supported-ubuntu-kernel-versions-for-azure-vms).
Ubuntu 22.04 LTS server | Includes support for all 22.04.*x* versions. [Supported kernel versions](#supported-ubuntu-kernel-versions-for-azure-vms).
Debian 7 | Includes support for all 7.*x* versions. [Supported kernel versions](#supported-debian-kernel-versions-for-azure-vms).
Debian 8 | Includes support for all 8.*x* versions. [Supported kernel versions](#supported-debian-kernel-versions-for-azure-vms).
Debian 9 | Includes support for 9.1 to 9.13. Debian 9.0 isn't supported. [Supported kernel versions](#supported-debian-kernel-versions-for-azure-vms).
Debian 10 | [Supported kernel versions](#supported-debian-kernel-versions-for-azure-vms).
Debian 11 | [Supported kernel versions](#supported-debian-kernel-versions-for-azure-vms).
Debian 12 | [Supported kernel versions](#supported-debian-kernel-versions-for-azure-vms).
SUSE Linux Enterprise Server 12 | SP1, SP2, SP3, SP4, SP5. [(Supported kernel versions.)](#supported-suse-linux-enterprise-server-12-kernel-versions-for-azure-vms)
SUSE Linux Enterprise Server 15 | 15, SP1, SP2, SP3, SP4, SP5, SP6, SP7. [(Supported kernel versions.)](#supported-suse-linux-enterprise-server-15-kernel-versions-for-azure-vms)
SUSE Linux Enterprise Server 11 | SP3.<br/><br/> Upgrade of replicating machines from SP3 to SP4 isn't supported. If a replicated machine was upgraded, disable replication and re-enable replication after the upgrade.
SUSE Linux Enterprise Server 11 | SP4.
Oracle Linux | 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, [7.7](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery), [7.8](https://support.microsoft.com/help/4573888/), [7.9](https://support.microsoft.com/help/4597409), [8.0](https://support.microsoft.com/help/4573888/), [8.1](https://support.microsoft.com/help/4573888/), [8.2](https://support.microsoft.com/topic/update-rollup-55-for-azure-site-recovery-kb5003408-b19c8190-5f88-43ea-85b1-d9e0cc5ca7e8), [8.3](https://support.microsoft.com/topic/update-rollup-55-for-azure-site-recovery-kb5003408-b19c8190-5f88-43ea-85b1-d9e0cc5ca7e8) (running the Red Hat-compatible kernel or Unbreakable Enterprise Kernel (UEK) Release 3, 4, 5, and 6 (UEK3, UEK4, UEK5, UEK6), [8.4](https://support.microsoft.com/topic/update-rollup-59-for-azure-site-recovery-kb5008707-66a65377-862b-4a4c-9882-fd74bdc7a81e), 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6). <br/><br/>Unbreakable Enterprise Kernel Release 7 (UEK7) is supported from 8.7.<br/><br/>8.1 (running on all UEK kernels and the Red Hat kernel <= 3.10.0-1062.* is supported in [9.35](https://support.microsoft.com/help/4573888/). Support for the rest of the Red Hat kernels is available in [9.36](https://support.microsoft.com/help/4578241/).) <br> Oracle Linux 9.x is supported for the [following kernel versions](#supported-red-hat-linux-kernel-versions-for-oracle-linux-on-azure-vms).
Rocky Linux | [See supported versions](#supported-rocky-linux-kernel-versions-for-azure-vms).
Alma Linux | [See supported versions](#supported-alma-linux-kernel-versions-for-azure-vms).

For Linux versions, Site Recovery doesn't support custom OS kernels. Only the stock kernels that are part of the distribution minor version release/update are supported.

Site Recovery doesn't support VMs created on ARM64 CPU architecture.

### Linux kernel support timelines

To support newly released Linux kernels, Site Recovery provides hotfix patches of the mobility agent on top of the latest mobility agent version. These hotfixes are released on a *best-effort basis within 30 days* of the kernel release and apply only to *Azure-to-Azure disaster recovery scenarios*.

>[!Note]
>This isn't a service-level agreement. The 30-day support window on a *best-effort basis* applies only to specific scenarios as outlined in the following table.

Only those scenarios mentioned in the *Scenarios covered by 30-day best-effort support* column are applicable for the best-effort basis of 30 days. Any other scenario, even if it isn't mentioned in the *Scenarios not covered by 30-day best-effort support* column, isn't applicable for this best-effort support.

#### Scope of 30-day kernel support on best effort

 Distribution | Scenarios covered by 30-day best-effort support | Scenarios not covered by 30-day best-effort support
 --- | --- | --- 
Ubuntu | New kernel within an already supported kernel series within a supported Ubuntu version. An example is 5.15.0-1081-Azure for Ubuntu 22.04 if 5.15.0-1079-Azure is already supported for Ubuntu 22.04 because both belong to the 5.15.0-* kernel series. Applies to both Azure (`-Azure`) and generic kernels (`-generic`) only. | New major OS version released. For example, assume Ubuntu releases Ubuntu 26.04, which Site Recovery doesn't support yet.<br/><br/>New kernel series not previously supported for the same Ubuntu version. An example is 6.5.0-18-Azure for Ubuntu 22.04 if no kernel from the 6.5.0-* series is supported.
Debian | New kernel within an already supported kernel series within a supported Debian version. An example is 4.19.0-27-cloud-amd64 for Debian 10 if 4.19.0-26-cloud-amd64 is already supported for Debian 10 because both belong to the 4.19.0-* kernel series. Applies to Azure kernels (`-cloud-amd64`) and stock kernels (`-amd64`) only. | New major OS version released. For example, assume Debian releases Debian 11, which Site Recovery doesn't support yet.<br/><br/> New kernel series not previously supported for the same Debian version. An example is 5.10.0-0.deb10.30-cloud-amd64 for Debian 10 if no kernel from the 5.10.0-* series is supported.
SUSE | New kernel within an already supported kernel series within a supported service pack (SP) version. An example is 6.4.0-150600.8.8 for SUSE 15 SP6 if 6.4.0-150600.8.5 is already supported for SUSE 15 SP6 because both belong to the 6.4.0-150600.8.* kernel series. Applies to Azure kernels (`-Azure:`[service pack number]). Stock kernels (`-default`) are supported by default. | New service pack releases. For example, assume SUSE releases SUSE 15 SP7, which Site Recovery doesn't support yet.<br/><br/> New kernel series isn't previously supported for the same SP version.
RHEL, Rocky, Alma, and Oracle Linux. (All distros are based on RHEL kernels.) | A new kernel for RHEL 8.x or 9.y would be supported if it meets two criteria. The minor OS version (RHEL 8.x or RHEL 9.y) is supported. The kernel series is already supported for that minor OS version. For RHEL 8.x, this support applies only if x ≥6. <br/><br/> For Oracle Linux UEK kernels, this support applies only if new kernels are within a supported UEK kernel series within a supported OS version. | New major version released. For example, assume RHEL 10.x, Rocky Linux 10.x, Alma Linux 10.x, or Oracle Linux 10.x is released, which Site Recovery doesn't support. <br/><br/> Minor OS version is released within a supported major OS version. For example, assume RHEL 9.5 is released, which Site Recovery doesn't support.<br/><br/> New kernels for RHEL 8.x where x <6 (for example, RHEL 8.4) aren't supported within 30 days.<br/><br/> Site Recovery doesn't support new kernel releases for a UEK kernel series.

## Upgrade Linux major OS version without disabling replication (preview) 

Azure Site Recovery now supports major version upgrades for Linux OS without disabling replication. This feature is currently available for Azure-to-Azure (A2A) disaster recovery scenario. 

When you upgrade Linux OS to a new major version, Azure Site Recovery detects the change and prompts to update the Mobility Agent as needed. This update ensures that replication continues seamlessly and disaster recovery setup remains protected. 

### Supported Linux distributions 

- Red Hat Enterprise Linux (RHEL) - Upgrade from RHEL 7 to RHEL 8, Upgrade from RHEL 8 to RHEL 9. 
- SUSE Linux Enterprise Server (SLES) - Upgrade from SLES 12 to SLES 15.

>[!NOTE]
>Support for this feature in preview is available only from Azure Site Recovery agent version 9.66.7567.1 and above. So, first update the Azure Site Recovery agent to version 9.66.7567.1 and later and then, you can do major OS upgrades.

If you configure auto update of Azure Site Recovery agent, Azure Site Recovery agent gets automatically updated in the next update cycle to be compatible with the upgraded OS version. 

To update Azure Site Recovery agent manually, follow these steps: 

1. Upgrade Linux OS and navigate to the **Replicated Items** page of the VM in the Azure portal. 
2. Select **Update Agent to support new OS version detected on VM**.
 
 :::image type="content" source="./media/Azure-to-Azure-support-matrix/replicated-items.png" alt-text="Screenshot of replicated items." lightbox="./media/Azure-to-Azure-support-matrix/replicated-items.png":::

3. Review the details in the context pane and proceed with the agent upgrade as prompted. 

>[!NOTE]
>If you upgrade your Linux OS without updating the Azure Site Recovery Mobility Agent to a compatible version, replication may fail. Ensure that the agent version supports your new OS version. After a major Linux OS upgrade, data resynchronization occurs when the agent is updated.

#### Supported kernel versions for Red Hat Enterprise Linux for Azure VMs

Enabling replication when you create a VM deployment workflow isn't supported for VMs with OS RHEL 9 and later.

Release | Mobility service version | Red Hat kernel version |
--- | --- | --- |
RHEL 10.0 <br> RHEL 10.1 | 9.66 | 6.12.0-55.9.1 and later <br> 6.12.0-124.8.1 and later |
RHEL 9.0 <br> RHEL 9.1 <br> RHEL 9.2 <br> RHEL 9.3 <br> RHEL 9.4 <br> RHEL 9.5 <br> RHEL 9.6 <br>  RHEL 9.7 | 9.66 | 5.14.0-611.5.1 and later |
RHEL 9.0 <br> RHEL 9.1 <br> RHEL 9.2 <br> RHEL 9.3 <br> RHEL 9.4 <br> RHEL 9.5 <br> RHEL 9.6 | 9.65 | 5.14.0-503.11.1 and later <br> 5.14.0-570.12.1 and later |
RHEL 9.0 <br> RHEL 9.1 <br> RHEL 9.2 <br> RHEL 9.3 <br> RHEL 9.4 <br> RHEL 9.5 | 9.64 | 5.14.0-503.11.1 and later |
RHEL 9.0 <br> RHEL 9.1 <br> RHEL 9.2 <br> RHEL 9.3 <br> RHEL 9.4 | 9.63 | 5.14.0-284.73.1.el9_2.x86_64 <br> 5.14.0-284.75.1.el9_2.x86_64 <br> 5.14.0-284.77.1.el9_2.x86_64 <br> 5.14.0-284.79.1.el9_2.x86_64 <br> 5.14.0-284.80.1.el9_2.x86_64 <br> 5.14.0-284.82.1.el9_2.x86_64 <br> 5.14.0-284.84.1.el9_2.x86_64 <br> 5.14.0-284.85.1.el9_2.x86_64 <br> 5.14.0-284.86.1.el9_2.x86_64 <br> 5.14.0-427.24.1.el9_4.x86_64 <br> 5.14.0-427.26.1.el9_4.x86_64 <br> 5.14.0-427.28.1.el9_4.x86_64 <br> 5.14.0-427.31.1.el9_4.x86_64 <br> 5.14.0-427.33.1.el9_4.x86_64 <br> 5.14.0-427.35.1.el9_4.x86_64 <br> 5.14.0-427.37.1.el9_4.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 and later |
RHEL 9.0 <br> RHEL 9.1 <br> RHEL 9.2 <br> RHEL 9.3 <br> RHEL 9.4 | 9.62 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 and later |


#### Supported Ubuntu kernel versions for Azure VMs

Release | Mobility service version | Kernel version |
--- | --- | --- |
14.04 LTS | 9.66| No new 14.04 LTS kernels supported in this release. |
14.04 LTS | 9.65| No new 14.04 LTS kernels supported in this release. |
14.04 LTS | 9.64| No new 14.04 LTS kernels supported in this release. |
14.04 LTS | 9.63| No new 14.04 LTS kernels supported in this release. |
14.04 LTS | 9.62| No new 14.04 LTS kernels supported in this release. |
|||
16.04 LTS | 9.66| No new 16.04 LTS kernels supported in this release. |
16.04 LTS | 9.65| No new 16.04 LTS kernels supported in this release. |
16.04 LTS | 9.64| No new 16.04 LTS kernels supported in this release. |
16.04 LTS | 9.63| No new 16.04 LTS kernels supported in this release. |
16.04 LTS | 9.62| No new 16.04 LTS kernels supported in this release. |
|||
18.04 LTS | 9.66| 4.15.0-1188-azure <br> 4.15.0-1189-azure <br> 4.15.0-1190-azure <br> 4.15.0-1191-azure <br> 4.15.0-1192-azure <br> 4.15.0-1193-azure <br> 4.15.0-1194-azure <br> 4.15.0-237-generic <br> 4.15.0-238-generic <br> 4.15.0-239-generic <br> 4.15.0-240-generic <br> 4.15.0-241-generic <br> 4.15.0-242-generic <br> 4.15.0-243-generic <br> 4.15.0-245-generic <br> 5.4.0-1150-azure <br> 5.4.0-1151-azure <br> 5.4.0-1152-azure <br> 5.4.0-1153-azure <br> <br> 5.4.0-1154-azure <br> 5.4.0-215-generic <br> 5.4.0-216-generic <br> 5.4.0-218-generic <br> 5.4.0-219-generic <br> 5.4.0-220-generic <br> 5.4.0-221-generic <br> 5.4.0-222-generic <br> 5.4.0-223-generic |
18.04 LTS | 9.65| 4.15.0-1186-azure <br> 4.15.0-1187-azure <br> 4.15.0-235-generic <br> 4.15.0-236-generic <br> 5.4.0-1147-azure <br> 5.4.0-1148-azure <br> 5.4.0-1149-azure <br> 5.4.0-211-generic <br> 5.4.0-212-generic <br> 5.4.0-214-generic|
18.04 LTS | 9.64| 4.15.0-1185-azure <br> 4.15.0-233-generic <br>4.15.0-234-generic <br> 5.4.0-1142-azure <br> 5.4.0-1143-azure <br> 5.4.0-1145-azure <br> 5.4.0-208-generic <br> 4.15.0-1181-azure <br> 4.15.0-1182-azure <br> 4.15.0-1183-azure <br> 4.15.0-1184-azure <br> 4.15.0-229-generic <br> 4.15.0-230-generic <br> 4.15.0-231-generic <br> 4.15.0-232-generic <br> 5.4.0-1137-azure <br> 5.4.0-1138-azure <br> 5.4.0-1139-azure <br> 5.4.0-1140-azure <br> 5.4.0-195-generic <br> 5.4.0-196-generic <br> 5.4.0-198-generic <br> 5.4.0-200-generic <br> 5.4.0-202-generic <br> 5.4.0-204-generic |
18.04 LTS | 9.63 | 5.4.0-1135-azure <br> 5.4.0-192-generic <br> 4.15.0-1180-azure <br> 4.15.0-228-generic <br> 5.4.0-1136-azure <br> 5.4.0-193-generic <br> 5.4.0-1137-azure <br> 5.4.0-1138-azure <br> 5.4.0-195-generic <br> 5.4.0-196-generic <br> 4.15.0-1181-azure <br> 4.15.0-229-generic <br> 4.15.0-1182-azure  <br> 4.15.0-230-generic <br> 5.4.0-1139-azure <br> 5.4.0-198-generic | 
18.04 LTS | 9.62| 4.15.0-226-generic <br>5.4.0-1131-azure <br>5.4.0-186-generic <br>5.4.0-187-generic <br> 4.15.0-1178-azure <br> 5.4.0-1132-azure <br> 5.4.0-1133-azure <br> 5.4.0-1134-azure <br> 5.4.0-190-generic <br> 5.4.0-189-generic  |
|||
20.04 LTS | 9.66| 5.15.0-1088-azure <br> 5.15.0-1089-azure <br> 5.15.0-1091-azure <br> 5.15.0-1094-azure <br> 5.15.0-1095-azure <br> 5.15.0-1096-azure <br> 5.15.0-1097-azure <br> 5.15.0-1098-azure <br> 5.15.0-139-generic <br> 5.15.0-142-generic <br> 5.15.0-143-generic <br> 5.15.0-144-generic <br> 5.15.0-145-generic <br> 5.15.0-151-generic <br> 5.15.0-152-generic <br> 5.15.0-153-generic <br> 5.15.0-156-generic <br> 5.15.0-157-generic <br> 5.15.0-160-generic <br> 5.15.0-161-generic <br> 5.4.0-1150-azure <br> 5.4.0-1151-azure <br> 5.4.0-1152-azure <br> 5.4.0-1153-azure <br> 5.4.0-1154-azure <br> 5.4.0-215-generic <br> 5.4.0-216-generic <br> 5.4.0-218-generic <br> 5.4.0-219-generic <br> 5.4.0-220-generic <br> 5.4.0-221-generic <br> 5.4.0-222-generic <br> 5.4.0-223-generic |
20.04 LTS | 9.65| 5.15.0-1082-azure <br> 5.15.0-1086-azure <br> 5.15.0-1087-azure <br> 5.15.0-136-generic <br> 5.15.0-138-generic <br> 5.4.0-1147-azure <br> 5.4.0-1148-azure <br> 5.4.0-1149-azure <br> 5.4.0-211-generic <br> 5.4.0-212-generic <br> 5.4.0-214-generic|
20.04 LTS | 9.64| 5.15.0-1079-azure <br> 5.15.0-1081-azure <br> 5.15.0-131-generic <br> 5.15.0-134-generic <br> 5.4.0-1143-azure <br> 5.4.0-1145-azure  <br> 5.4.0-205-generic <br> 5.4.0-208-generic<br> 5.15.0-1072-azure <br> 5.15.0-1073-azure <br> 5.15.0-1074-azure <br> 5.15.0-1075-azure <br> 5.15.0-1078-azure <br> 5.15.0-121-generic <br> 5.15.0-122-generic <br> 5.15.0-124-generic <br> 5.15.0-125-generic <br> 5.15.0-126-generic <br> 5.15.0-127-generic <br> 5.15.0-130-generic <br> 5.4.0-1137-azure <br> 5.4.0-1138-azure <br> 5.4.0-1139-azure <br> 5.4.0-1140-azure <br> 5.4.0-1142-azure <br> 5.4.0-195-generic <br> 5.4.0-196-generic <br> 5.4.0-198-generic <br> 5.4.0-200-generic <br> 5.4.0-202-generic <br> 5.4.0-204-generic |
20.04 LTS | 9.63| 5.15.0-1070-azure <br> 5.4.0-1135-azure <br> 5.4.0-192-generic <br> 5.15.0-1071-azure <br> 5.15.0-118-generic <br> 5.15.0-119-generic <br> 5.4.0-1136-azure <br> 5.4.0-193-generic <br> 5.15.0-1072-azure <br> 5.15.0-1073-azure <br> 5.15.0-121-generic <br> 5.15.0-122-generic <br> 5.4.0-1137-azure <br> 5.4.0-1138-azure <br> 5.4.0-195-generic <br> 5.4.0-196-generic |
20.04 LTS | 9.62| 5.15.0-1065-azure <br>5.15.0-1067-azure <br>5.15.0-113-generic <br>5.4.0-1131-azure <br>5.4.0-1132-azure <br>5.4.0-186-generic <br> 5.4.0-187-generic <br> 5.15.0-1068-azure <br> 5.15.0-116-generic <br> 5.15.0-117-generic <br> 5.4.0-1133-azure <br> 5.4.0-1134-azure <br> 5.4.0-189-generic <br> 5.4.0-190-generic <br> 5.15.0-1074-azure <br> 5.15.0-124-generic <br> 5.4.0-1139-azure <br> 5.4.0-198-generic |
|||
22.04 LTS | 9.66| 5.15.0-1088-azure <br> 5.15.0-1089-azure <br> 5.15.0-1090-azure <br> 5.15.0-1091-azure <br> 5.15.0-1092-azure <br> 5.15.0-1094-azure <br> 5.15.0-1095-azure <br> 5.15.0-1096-azure <br> 5.15.0-1097-azure <br> 5.15.0-1098-azure <br> 5.15.0-1099-azure <br> 5.15.0-1101-azure <br> 5.15.0-139-generic <br> 5.15.0-140-generic <br> 5.15.0-141-generic <br> 5.15.0-142-generic <br> 5.15.0-143-generic <br> 5.15.0-144-generic <br> 5.15.0-151-generic <br> 5.15.0-152-generic <br> 5.15.0-153-generic <br> 5.15.0-156-generic <br> 5.15.0-157-generic <br> 5.15.0-160-generic <br> 5.15.0-161-generic <br> 6.8.0-1028-azure <br> 6.8.0-1029-azure <br> 6.8.0-1030-azure <br> 6.8.0-1031-azure <br> 6.8.0-1034-azure <br> 6.8.0-1036-azure <br> 6.8.0-1040-azure <br> 6.8.0-1041-azure <br> 6.8.0-58-generic <br> 6.8.0-59-generic <br> 6.8.0-60-generic <br> 6.8.0-64-generic <br> 6.8.0-65-generic <br> 6.8.0-78-generic <br> 6.8.0-79-generic <br> 6.8.0-83-generic <br> 6.8.0-84-generic <br> 6.8.0-85-generic <br> 6.8.0-86-generic <br> 6.8.0-87-generic |
22.04 LTS | 9.65| 5.15.0-1082-azure <br> 5.15.0-1084-azure <br> 5.15.0-1086-azure <br> 5.15.0-1087-azure <br> 5.15.0-135-generic <br> 5.15.0-136-generic <br> 5.15.0-138-generic <br> 6.8.0-1025-azure <br> 6.8.0-1026-azure <br> 6.8.0-1027-azure <br> 6.8.0-57-generic|
22.04 LTS | 9.64| 5.15.0-1079-azure <br> 5.15.0-1081-azure <br> 5.15.0-131-generic <br> 5.15.0-133-generic <br> 5.15.0-134-generic <br> 6.8.0-1021-azure <br> 6.8.0-52-generic <br>5.15.0-1072-azure <br> 5.15.0-1073-azure <br> 5.15.0-1074-azure <br>5.15.0-1075-azure <br> 5.15.0-1078-azure <br> 5.15.0-121-generic <br> 5.15.0-122-generic <br> 5.15.0-124-generic <br> 5.15.0-125-generic <br> 5.15.0-126-generic <br> 5.15.0-127-generic <br> 5.15.0-130-generic <br> 6.8.0-1008-azure <br> 6.8.0-1009-azure <br> 6.8.0-1010-azure <br> 6.8.0-1012-azure <br> 6.8.0-1013-azure <br> 6.8.0-1014-azure <br> 6.8.0-1015-azure <br> 6.8.0-1017-azure <br> 6.8.0-1018-azure <br> 6.8.0-1020-azure <br> 6.8.0-38-generic <br> 6.8.0-39-generic <br> 6.8.0-40-generic <br> 6.8.0-45-generic <br> 6.8.0-47-generic <br> 6.8.0-48-generic <br> 6.8.0-49-generic <br> 6.8.0-50-generic <br> 6.8.0-51-generic |
22.04 LTS | 9.63| 5.15.0-1070-azure <br> 5.15.0-118-generic <br> 5.15.0-1071-azure <br> 5.15.0-119-generic <br> 5.15.0-1072-azure <br> 5.15.0-1073-azure <br> 5.15.0-121-generic <br> 5.15.0-122-generic <br> 5.15.0-1074-azure <br> 5.15.0-124-generic |
22.04 LTS | 9.62| 5.15.0-1066-azure <br> 5.15.0-1067-azure <br>5.15.0-112-generic <br>5.15.0-113-generic <br>6.5.0-1022-azure <br>6.5.0-1023-azure <br>6.5.0-41-generic <br> 5.15.0-1068-azure <br> 5.15.0-116-generic <br> 5.15.0-117-generic <br> 6.5.0-1024-azure <br> 6.5.0-1025-azure <br> 6.5.0-44-generic <br> 6.5.0-45-generic |
|||
24.04 LTS | 9.66| 6.14.0-1012-azure <br> 6.14.0-1013-azure <br> 6.14.0-1014-azure <br> 6.14.0-24-generic <br> 6.14.0-27-generic <br> 6.14.0-28-generic <br> 6.14.0-29-generic <br> 6.14.0-32-generic <br> 6.14.0-33-generic <br> 6.14.0-34-generic <br> 6.14.0-35-generic <br> 6.14.0-36-generic <br> 6.11.0-1008-azure <br> 6.11.0-1012-azure <br> 6.11.0-1013-azure <br> 6.11.0-1014-azure <br> 6.11.0-1015-azure <br> 6.11.0-1017-azure <br> 6.11.0-1018-azure <br> 6.11.0-17-generic <br> 6.11.0-19-generic <br> 6.11.0-21-generic <br> 6.11.0-24-generic <br> 6.11.0-25-generic <br> 6.11.0-26-generic <br> 6.11.0-28-generic <br> 6.11.0-29-generic <br> 6.8.0-1028-azure <br> 6.8.0-1029-azure <br> 6.8.0-1030-azure <br> 6.8.0-1031-azure <br> 6.8.0-1034-azure <br> 6.8.0-1038-azure <br> 6.8.0-1040-azure <br> 6.8.0-1041-azure <br> 6.8.0-1042-azure <br> 6.8.0-59-generic <br> 6.8.0-60-generic <br> 6.8.0-62-generic <br> 6.8.0-63-generic <br> 6.8.0-64-generic <br> 6.8.0-71-generic <br> 6.8.0-78-generic <br> 6.8.0-79-generic <br> 6.8.0-83-generic <br> 6.8.0-84-generic <br> 6.8.0-85-generic <br> 6.8.0-86-generic <br> 6.8.0-87-generic <br> 6.8.0-88-generic |
24.04 LTS | 9.65| 6.8.0-1025-azure <br> 6.8.0-1026-azure <br> 6.8.0-1027-azure <br> 6.8.0-56-generic <br> 6.8.0-57-generic <br> 6.8.0-58-generic|
24.04 LTS | 9.64| 6.8.0-1021-azure <br> 6.8.0-52-generic <br> 6.8.0-53-generic <br> 6.8.0-54-generic <br> 6.8.0-55-generic <br> 6.8.0-1007-azure <br> 6.8.0-1008-azure <br> 6.8.0-1009-azure <br> 6.8.0-1010-azure <br> 6.8.0-1012-azure <br> 6.8.0-1013-azure <br> 6.8.0-1014-azure <br> 6.8.0-1015-azure <br> 6.8.0-1016-azure <br> 6.8.0-1017-azure <br> 6.8.0-1018-azure <br> 6.8.0-1020-azure <br> 6.8.0-31-generic <br> 6.8.0-35-generic <br> 6.8.0-36-generic <br> 6.8.0-38-generic <br> 6.8.0-39-generic <br> 6.8.0-40-generic <br> 6.8.0-41-generic <br> 6.8.0-44-generic <br> 6.8.0-45-generic <br> 6.8.0-47-generic <br> 6.8.0-48-generic <br> 6.8.0-49-generic <br> 6.8.0-50-generic <br> 6.8.0-51-generic |

#### Supported Debian kernel versions for Azure VMs

Release | Mobility service version | Kernel version |
--- | --- | --- |
Debian 7 | 9.66 | No new Debian 7 kernels supported in this release. |
Debian 7 | 9.65 | No new Debian 7 kernels supported in this release. |
Debian 7 | 9.64 | No new Debian 7 kernels supported in this release. |
Debian 7 | 9.63| No new Debian 7 kernels supported in this release. |
Debian 7 | 9.62| No new Debian 7 kernels supported in this release. |
|||
Debian 8 | 9.66 | No new Debian 8 kernels supported in this release. |
Debian 8 | 9.65 | No new Debian 8 kernels supported in this release. |
Debian 8 | 9.64 | No new Debian 8 kernels supported in this release. |
Debian 8 | 9.63| No new Debian kernels supported in this release. |
Debian 8 | 9.62| No new Debian 8 kernels supported in this release. |
|||
Debian 9 | 9.66 | No new Debian 9 kernels supported in this release. |
Debian 9 | 9.65 | No new Debian 9 kernels supported in this release. |
Debian 9 | 9.64 | No new Debian 9 kernels supported in this release. |
Debian 9.1 | 9.63 | No new Debian kernels supported in this release. |
Debian 9.1 | 9.62 | No new Debian 9.1 kernels supported in this release.|
|||
Debian 10 | 9.66| No new Debian 10 kernels supported in this release. |
Debian 10 | 9.65| No new Debian 10 kernels supported in this release. |
Debian 10 | 9.64| No new Debian 10 kernels supported in this release. |
Debian 10 | 9.63| No new Debian 10 kernels supported in this release. |
Debian 10 | 9.62| 4.19.0-27-amd64 <br>4.19.0-27-cloud-amd64 <br>5.10.0-0.deb10.30-amd64 <br>5.10.0-0.deb10.30-cloud-amd64 |
|||
Debian 11 | 9.66 | 5.10.0-35-amd64 <br> 5.10.0-36-amd64 <br> 5.10.0-35-cloud-amd64 <br> 5.10.0-36-cloud-amd64 <br> 6.1.0-0.deb11.35-amd64 <br> 6.1.0-0.deb11.35-cloud-amd64 <br> 6.1.0-0.deb11.37-amd64 <br> 6.1.0-0.deb11.40-amd64 <br> 6.1.0-0.deb11.41-amd64 <br> 6.1.0-0.deb11.37-cloud-amd64 <br> 6.1.0-0.deb11.38-amd64 <br> 6.1.0-0.deb11.38-cloud-amd64 <br> 6.1.0-0.deb11.39-amd64 <br> 6.1.0-0.deb11.39-cloud-amd64 <br> 6.1.0-0.deb11.40-cloud-amd64 <br> 6.1.0-0.deb11.41-cloud-amd64 |
Debian 11 | 9.65 | 6.1.0-0.deb11.32-amd64 <br> 6.1.0-0.deb11.32-cloud-amd64 |
Debian 11 | 9.64 | 5.10.0-34-amd64 <br> 5.10.0-34-cloud-amd64 <br> 6.1.0-0.deb11.31-amd64 <br> 6.1.0-0.deb11.31-cloud-amd64 <br> 5.10.0-33-amd64 <br> 5.10.0-33-cloud-amd64 <br> 6.1.0-0.deb11.25-amd64 <br> 6.1.0-0.deb11.25-cloud-amd64 <br> 6.1.0-0.deb11.26-amd64 <br> 6.1.0-0.deb11.26-cloud-amd64 <br> 6.1.0-0.deb11.28-amd64 <br> 6.1.0-0.deb11.28-cloud-amd64 |
Debian 11 | 9.63 | 5.10.0-26-amd64 <br> 5.10.0-26-cloud-amd64 <br> 5.10.0-31-amd64 <br> 5.10.0-31-cloud-amd64 <br> 5.10.0-32-amd64 <br> 5.10.0-32-cloud-amd64 <br> 6.1.0-0.deb11.13-amd64 <br> 6.1.0-0.deb11.13-cloud-amd64 <br> 6.1.0-0.deb11.17-amd64 <br> 6.1.0-0.deb11.17-cloud-amd64 <br> 6.1.0-0.deb11.18-amd64 <br> 6.1.0-0.deb11.18-cloud-amd64 <br> 6.1.0-0.deb11.21-amd64 <br> 6.1.0-0.deb11.21-cloud-amd64 <br> 6.1.0-0.deb11.22-amd64 <br> 6.1.0-0.deb11.22-cloud-amd64 | 
Debian 11 | 9.62| 5.10.0-30-amd64 <br> 5.10.0-30-cloud-amd64 <br>6.1.0-0.deb11.21-amd64 <br>6.1.0-0.deb11.21-cloud-amd64 |
|||
Debian 12 | 9.66 | 6.1.0-34-amd64 <br> 6.1.0-34-cloud-amd64 <br> 6.1.0-35-amd64 <br> 6.1.0-35-cloud-amd64 <br> 6.1.0-37-amd64 <br> 6.1.0-40-amd64 <br> 6.1.0-41-amd64 <br> 6.1.0-37-cloud-amd64 <br> 6.1.0-38-amd64 <br> 6.1.0-38-cloud-amd64 <br> 6.1.0-39-amd64 <br> 6.1.0-39-cloud-amd64 <br> 6.1.0-40-cloud-amd64 <br> 6.1.0-41-cloud-amd64 |
Debian 12 | 9.65 | 6.1.0-32-amd64 <br> 6.1.0-32-cloud-amd64 <br> 6.1.0-33-amd64 <br> 6.1.0-33-cloud-amd64|
Debian 12 | 9.64 | 6.1.0-29-amd64 <br> 6.1.0-29-cloud-amd64 <br> 6.1.0-30-amd64 <br> 6.1.0-30-cloud-amd64 <br> 6.1.0-31-amd64 <br> 6.1.0-31-cloud-amd64 <br>6.1.0-15-cloud-amd64 <br> 6.1.0-26-amd64 <br> 6.1.0-26-cloud-amd64 <br> 6.1.0-27-amd64 <br> 6.1.0-27-cloud-amd64 <br> 6.1.0-28-amd64 <br> 6.1.0-28-cloud-amd64 |
Debian 12 | 9.63 | 6.1.0-25-amd64 <br>6.1.0-25-cloud-amd64 <br>6.1.0-26-amd64 <br> 6.1.0-26-cloud-amd64 |
Debian 12 | 9.62| 6.1.0-22-amd64 <br> 6.1.0-22-cloud-amd64 <br> 6.1.0-23-amd64 <br> 6.1.0-23-cloud-amd64 <br> 6.5.0-0.deb12.4-cloud-amd64 |

#### Supported SUSE Linux Enterprise Server 12 kernel versions for Azure VMs

Release | Mobility service version | Kernel version |
--- | --- | --- |
SUSE Linux Enterprise Server 12 (SP1, SP2, SP3, SP4, SP5) | 9.66 | New SUSE 12 kernels aren't supported in this release. |
SUSE Linux Enterprise Server 12 (SP1, SP2, SP3, SP4, SP5) | 9.65 | All [stock SUSE 12 SP1, SP2, SP3, SP4, SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 4.12.14-16.197-Azure: 5 <br> 4.12.14-16.200-Azure: 5 |
SUSE Linux Enterprise Server 12 (SP1, SP2, SP3, SP4, SP5) | 9.64 | All [stock SUSE 12 SP1, SP2, SP3, SP4, SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 4.12.14-16.197-Azure: 5 <br> 4.12.14-16.200-Azure: 5 |
SUSE Linux Enterprise Server 12 (SP1, SP2, SP3, SP4, SP5) | 9.63 | All [stock SUSE 12 SP1, SP2, SP3, SP4, SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 4.12.14-16.194-Azure: 5 <br> 4.12.14-16.197-Azure: 5 <br> 4.12.14-16.200-Azure: 5 |
SUSE Linux Enterprise Server 12 (SP1, SP2, SP3, SP4, SP5) | 9.62 | All [stock SUSE 12 SP1, SP2, SP3, SP4, SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 4.12.14-16.185-Azure: 5 <br> 4.12.14-16.188-Azure: 5 <br> 4.12.14-16.191-Azure: 5 |


#### Supported SUSE Linux Enterprise Server 15 kernel versions for Azure VMs

Release | Mobility service version | Kernel version |
--- | --- | --- |
SUSE Linux Enterprise Server 15 (SP1, SP2, SP3, SP4, SP5, SP6, SP7) | 9.66 | All [stock SUSE 15 SP1, SP2, SP3, SP4, SP5, SP6, SP7 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 6.4.0-150600.8.37-azure:6 <br> 6.4.0-150600.8.40-azure:6 <br> 6.4.0-150600.8.43-azure:6 <br> 6.4.0-150600.8.48-azure:6 <br> 6.4.0-150600.8.52-azure:6 <br> 6.4.0-150700.18-azure:7 <br> 6.4.0-150700.20.11-azure:7 <br> 6.4.0-150700.20.3-azure:7 <br> 6.4.0-150700.20.6-azure:7 <br> 6.4.0-150700.20.15-azure:7 <br> 6.4.0-150700.20.18-azure:7 |
SUSE Linux Enterprise Server 15 (SP1, SP2, SP3, SP4, SP5, SP6) | 9.65 | All [stock SUSE 15 SP1, SP2, SP3, SP4, SP5, SP6 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 6.4.0-150600.8.23-azure:6 <br> 6.4.0-150600.8.26-azure:6 <br> 6.4.0-150600.8.31-azure:6 <br> 6.4.0-150600.8.34-azure:6 |
SUSE Linux Enterprise Server 15 (SP1, SP2, SP3, SP4, SP5, SP6) | 9.64 | All [stock SUSE 15 SP1, SP2, SP3, SP4, SP5, SP6 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 5.14.21-150500.33.66-azure:5 <br> 5.14.21-150500.33.69-azure:5 <br> 5.14.21-150500.33.72-azure:5 <br> 5.14.21-150500.33.75-azure:5 <br> 6.4.0-150600.6-azure:6 <br> 6.4.0-150600.8.11-azure:6 <br> 6.4.0-150600.8.14-azure:6 <br> 6.4.0-150600.8.17-azure:6 <br> 6.4.0-150600.8.20-azure:6 <br> 6.4.0-150600.8.5-azure:6 <br> 6.4.0-150600.8.8-azure:6 |
SUSE Linux Enterprise Server 15 (SP1, SP2, SP3, SP4, SP5, SP6) | 9.63 | All [stock SUSE 15 SP1, SP2, SP3, SP4, SP5, SP6 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 5.14.21-150500.33.63-azure:5 <br> 5.14.21-150500.33.66-azure:5 <br> 6.4.0-150600.6-azure:6 <br>6.4.0-150600.8.11-azure:6 <br> 6.4.0-150600.8.5-azure:6 <br> 6.4.0-150600.8.8-azure:6 <br> 6.4.0-150600.8.14-azure:6 <br> 5.14.21-150500.33.69-azure:5 |
SUSE Linux Enterprise Server 15 (SP1, SP2, SP3, SP4, SP5) | 9.62 | All [stock SUSE 15 SP1, SP2, SP3, SP4, SP5 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported. </br></br> 5.14.21-150500.33.54-azure:5 <br> 5.14.21-150500.33.57-azure:5 <br> 5.14.21-150500.33.60-azure:5  |

#### Supported Red Hat Linux kernel versions for Oracle Linux on Azure VMs 

Release | Mobility service version | Red Hat kernel version |
--- | --- | --- |
Oracle Linux 9.0 <br> Oracle Linux 9.1 <br> Oracle Linux 9.2 <br> Oracle Linux 9.3 <br> Oracle Linux 9.4 <br> Oracle Linux 9.5 <br> Oracle Linux 9.6 | 9.66 | 5.14.0-503.11.1 and later |
Oracle Linux 9.0 <br> Oracle Linux 9.1 <br> Oracle Linux 9.2 <br> Oracle Linux 9.3 <br> Oracle Linux 9.4 <br> Oracle Linux 9.5 | 9.65 | 5.14.0-503.11.1 and later |
Oracle Linux 9.0 <br> Oracle Linux 9.1 <br> Oracle Linux 9.2 <br> Oracle Linux 9.3 <br> Oracle Linux 9.4 | 9.64 | 5.14.0-284.73.1.el9_2.x86_64 <br> 5.14.0-284.75.1.el9_2.x86_64 <br> 5.14.0-284.77.1.el9_2.x86_64 <br> 5.14.0-284.79.1.el9_2.x86_64 <br> 5.14.0-284.80.1.el9_2.x86_64 <br> 5.14.0-284.82.1.el9_2.x86_64 <br> 5.14.0-284.84.1.el9_2.x86_64 <br> 5.14.0-284.85.1.el9_2.x86_64 <br> 5.14.0-284.86.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64 <br> 5.14.0-427.24.1.el9_4.x86_64 <br> 5.14.0-427.26.1.el9_4.x86_64 <br> 5.14.0-427.28.1.el9_4.x86_64 <br> 5.14.0-427.31.1.el9_4.x86_64 <br> 5.14.0-427.33.1.el9_4.x86_64 <br> 5.14.0-427.35.1.el9_4.x86_64 <br> 5.14.0-427.37.1.el9_4.x86_64 |
Oracle Linux 9.0 <br> Oracle Linux 9.1 <br> Oracle Linux 9.2 <br> Oracle Linux 9.3 <br> Oracle Linux 9.4 | 9.63 | 5.14.0-284.73.1.el9_2.x86_64 <br> 5.14.0-284.75.1.el9_2.x86_64 <br> 5.14.0-284.77.1.el9_2.x86_64 <br> 5.14.0-284.79.1.el9_2.x86_64 <br> 5.14.0-284.80.1.el9_2.x86_64 <br> 5.14.0-284.82.1.el9_2.x86_64 <br> 5.14.0-284.84.1.el9_2.x86_64 <br> 5.14.0-284.85.1.el9_2.x86_64 <br> 5.14.0-284.86.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64 <br> 5.14.0-427.24.1.el9_4.x86_64 <br> 5.14.0-427.26.1.el9_4.x86_64 <br> 5.14.0-427.28.1.el9_4.x86_64 <br> 5.14.0-427.31.1.el9_4.x86_64 <br> 5.14.0-427.33.1.el9_4.x86_64 <br> 5.14.0-427.35.1.el9_4.x86_64 <br> 5.14.0-427.37.1.el9_4.x86_64 |
Oracle Linux 9.0 <br> Oracle Linux 9.1 <br> Oracle Linux 9.2 <br> Oracle Linux 9.3 | 9.62 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 |

#### Supported Rocky Linux kernel versions for Azure VMs

Release | Mobility service version | Red Hat kernel version |
--- | --- | --- |
Rocky Linux 10.0 <br> Rocky Linux 10.1 | 9.66 | 6.12.0-55.9.1 and later <br> 6.12.0-124.8.1 and later |
Rocky Linux 9.0 <br> Rocky Linux 9.1 <br> Rocky Linux 9.2 <br> Rocky Linux 9.3 <br> Rocky Linux 9.4 <br> Rocky Linux 9.5 <br>  Rocky linux 9.6 <br> Rocky linux 9.7 | 9.66 | 5.14.0-611.5.1 and later |
Rocky Linux 9.0 <br> Rocky Linux 9.1 <br> Rocky Linux 9.2 <br> Rocky Linux 9.3 <br> Rocky Linux 9.4 <br> Rocky Linux 9.5 |9.65 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64|
Rocky Linux 9.0 <br> Rocky Linux 9.1 |9.64 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64|
Rocky Linux 9.0 <br> Rocky Linux 9.1 |9.63 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64|
Rocky Linux 9.0 <br> Rocky Linux 9.1 |9.62 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64|

#### Supported Alma Linux kernel versions for Azure VMs

Release | Mobility service version | Red Hat kernel version |
--- | --- | --- |
Alma Linux 10.0 <br> Alma Linux 10.1 | 9.66 | 6.12.0-55.9.1 and later <br> 6.12.0-124.8.1 and later |
Alma Linux 9.6 <br> Alma Linux 9.7 | 9.66 | 5.14.0-611.5.1 and later |
Alma Linux 9.0 <br> Alma Linux 9.1 <br> Alma Linux 9.2 <br> Alma Linux 9.3 <br> Alma Linux 9.4 <br> Alma Linux 9.5 |9.65 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64|
Alma Linux 9.0 <br> Alma Linux 9.1 |9.64 | 5.14.0-70.97.1.el9_0.x86_64 <br> 5.14.0-70.101.1.el9_0.x86_64 <br> 5.14.0-284.62.1.el9_2.x86_64 <br> 5.14.0-284.64.1.el9_2.x86_64 <br> 5.14.0-284.66.1.el9_2.x86_64 <br> 5.14.0-284.67.1.el9_2.x86_64 <br> 5.14.0-284.69.1.el9_2.x86_64 <br> 5.14.0-284.71.1.el9_2.x86_64 <br> 5.14.0-427.13.1.el9_4.x86_64 <br> 5.14.0-427.16.1.el9_4.x86_64 <br> 5.14.0-427.18.1.el9_4.x86_64 <br> 5.14.0-427.20.1.el9_4.x86_64 <br> 5.14.0-427.22.1.el9_4.x86_64|

## <a name = "replicated-machines---linux-file-systemguest-storage"></a>Replicated machines: Linux file system/guest storage

* **File systems**: ext3, ext4, XFS, and BTRFS
* **Volume manager**: LVM2

Multipath software isn't supported.

## <a name = "replicated-machines---compute-settings"></a>Replicated machines: Compute settings

Setting | Support | Details
--- | --- | ---
Size | Any Azure VM size with at least two CPU cores and 1-GB RAM.| Verify [Azure VM sizes](/Azure/virtual-machines/sizes).
RAM | Site Recovery driver consumes 6% of RAM.
Availability sets | Supported. | If you enable replication for an Azure VM with the default options, an availability set is created automatically based on the source region settings. You can modify these settings.
Availability zones | Supported. |
Azure Dedicated Host | Not supported. |
Hybrid Use Benefit (HUB) | Supported. | If the source VM has a HUB license enabled, a test failover or failed-over VM also uses the HUB license.
Virtual Machine Scale Set Flex | Availability scenario: Supported. Scalability scenario: Not supported. |
Azure gallery images: Microsoft published | Supported. | Supported if the VM runs on a supported operating system.
Azure Gallery images: Non-Microsoft published | Supported. | Supported if the VM runs on a supported operating system.
Custom images: Non-Microsoft published | Supported. | The VM is supported if it runs on a supported operating system. During test failover and failover, Azure creates a VM with an Azure Marketplace image. Ensure that no custom Azure policy blocks this operation. 
VMs migrated by using Site Recovery | Supported. | If a VMware VM or physical machine was migrated to Azure by using Site Recovery, you need to uninstall the older version of the Mobility service running on the machine and restart the machine before you replicate it to another Azure region.
Azure role-based access control (RBAC) policies | Not supported. | Azure role-based access control policies on VMs aren't replicated to the failover VM in the target region.
Extensions | Not supported. | Extensions aren't replicated to the failover VM in the target region. It needs to be installed manually after failover.
Proximity placement groups (PPGs) | Supported. | VMs located inside PPGs by using Site Recovery.
Tags | Supported. | User-generated tags applied on source VMs are carried over to target VMs post-test failover or failover. Tags on the VMs replicate once every 24 hours for as long as the VMs are present in the target region.

## Replicated machines: Disk actions

Action | Details
--- | ---
Resize a disk on a replicated VM. | Resizing up on the source VM is supported. Resizing down on the source VM isn't supported. Perform resizing before failover. No need to disable/re-enable replication.<br/><br/> If you change the source VM after failover, the changes aren't captured.<br/><br/> If you change the disk size on the Azure VM after failover, Site Recovery doesn't capture the changes. Failback is to the original VM size.<br/><br/> If you resize to 4 TB or larger, see the Azure guidance on disk caching in [Azure Premium storage: Design for high performance](/Azure/virtual-machines/premium-storage-performance). 
Add a disk to a replicated VM. | Supported.
Offline changes to protected disks. | Disconnecting disks and making offline modifications to them require triggering a full resync.
Disk caching. | Disk caching isn't supported for disks 4 TB and larger. If multiple disks are attached to your VM, each disk that's smaller than 4 TB supports caching. Changing the cache setting of an Azure disk detaches and reattaches the target disk. If it's the operating system disk, the VM is restarted. Before you change the disk cache setting, stop all applications or services that this disruption might affect. Not following the recommendations could lead to data corruption.

## <a name = "replicated-machines---storage"></a>Replicated machines: Storage

> [!NOTE]
> Site Recovery supports storage accounts with page blobs for unmanaged disk replication.
>
> Unmanaged disks were deprecated on September 30, 2022, and are slated to fully retire by March 31, 2026. Managed disks now offer the full capabilities of unmanaged disks, along with other advancements.

The following table summarizes support for the Azure VM OS disk, data disk, and temporary disk:

- To avoid any performance issues, observe the VM disk limits and targets for [managed disks](/Azure/virtual-machines/disks-scalability-targets).
- If you deploy with the default settings, Site Recovery automatically creates disks and storage accounts based on the source settings.
- If you customize, ensure that you follow the guidelines.

Component | Support | Details
--- | --- | ---
Disk renaming | Supported. | 
OS disk maximum size | [4,095 GiB](/Azure/virtual-machines/managed-disks-overview#os-disk). | Learn more about [VM disks](/Azure/virtual-machines/managed-disks-overview).
Temporary disk | Not supported. | The temporary disk is always excluded from replication.<br/><br/> Don't store any persistent data on the temporary disk. Learn more about [temporary disks](/Azure/virtual-machines/managed-disks-overview).
Data disk maximum size | 32 TiB for managed disks.<br></br>4 TiB for unmanaged disks.|
Data disk minimum size | No restriction for unmanaged disks. 1 GiB for managed disks. |
Data disk maximum number | Up to 64, in accordance with support for a specific Azure VM size. | Learn more about [VM sizes](/Azure/virtual-machines/sizes).
Data disk maximum size per storage account (for unmanaged disks) | 35 TiB. | This size is the upper limit for cumulative size of page blobs created in a Premium storage account.
Data disks change rate | Maximum of 20 MBps per disk for Premium storage. Maximum of 2 MBps per disk for Standard storage. | If the average data change rate on the disk is continuously higher than the maximum, replication can't catch up.<br/><br/> If the maximum is exceeded sporadically, replication can catch up, but you might see slightly delayed recovery points.
Data disk: Standard storage account | Supported. |
Data disk: Premium storage account | Supported. | If a VM has disks spread across Premium and Standard storage accounts, you can select a different target storage account for each disk to ensure that you have the same storage configuration in the target region.
Managed disk: Standard | Supported in Azure regions in which Site Recovery is supported. |
Managed disk: Premium | Supported in Azure regions in which Site Recovery is supported. |
Disk subscription limits | Up to 3,000 protected disks per subscription. | Ensure that the source or target subscription doesn't have more than 3,000 Site Recovery-protected disks (both data and OS).
Standard SSD | Supported. |
Redundancy | Locally redundant storage (LRS), ZRS, and geo-redundant storage (GRS) are supported.
Cool and hot storage | Not supported. | VM disks aren't supported on cool or hot storage.
Storage Spaces | Supported. |
NVMe storage interface | Not supported.
Encryption at host | Not supported. | The VM is protected, but the failed-over VM doesn't have encryption at host enabled. For more information, see [Enable end-to-end encryption by using encryption at host](/Azure/virtual-machines/disks-enable-host-based-encryption-portal).
Encryption at rest (SSE) | Supported. | SSE is the default setting on storage accounts.
Encryption at rest (CMK) | Supported. | Both software and hardware security module (HSM) keys are supported for managed disks.
Double encryption at rest | Supported. | Learn more about supported regions for [Windows](/Azure/virtual-machines/disk-encryption) and [Linux](/Azure/virtual-machines/disk-encryption).
FIPS encryption | Not supported.
Azure Disk Encryption for Windows OS | Supported for VMs with managed disks. | VMs using unmanaged disks aren't supported. <br/><br/> HSM-protected keys aren't supported. <br/><br/> Encryption of individual volumes on a single disk isn't supported. |
Azure Disk Encryption for Linux OS | Supported for VMs with managed disks. | VMs using unmanaged disks aren't supported. <br/><br/> HSM-protected keys aren't supported. <br/><br/> Encryption of individual volumes on a single disk isn't supported. <br><br> Known issue with enabling replication. For more information, see [Enable protection failed because the installer is unable to find the root disk](Azure-to-Azure-troubleshoot-errors.md). |
Shared access signature key rotation | Supported. | If the shared access signature key for storage accounts is rotated, you must disable and re-enable replication. |
Host caching | Supported. | |
Hot add | Supported. | Enabling replication for a data disk that you add to a replicated Azure VM is supported for VMs that use managed disks. <br/><br/> Use hot add to add only one disk at a time to an Azure VM. Parallel addition of multiple disks isn't supported. |
Hot remove disk | Not supported. | If you remove a data disk on the VM, you need to disable replication and enable replication again for the VM.
Exclude disk | Supported. Use [Azure PowerShell](Azure-to-Azure-exclude-disks.md) or go to the **Advanced Setting** > **Storage Settings** > **Disk to Replicate** option from the portal. | Temporary disks are excluded by default.
Storage Spaces Direct | Supported for crash-consistent recovery points. Application-consistent recovery points aren't supported. |
Scale-Out File Server | Supported for crash-consistent recovery points. Application-consistent recovery points aren't supported. |
Distributed replicated block device (DRBD) | Disks that are part of a DRBD setup aren't supported. |
LRS | Supported. |
GRS | Supported. |
Read-access GRS | Supported. |
ZRS | Supported. | 
Cool and hot storage | Not supported. | VM disks aren't supported on cool or hot storage.
Azure Storage firewalls for virtual networks | Supported. | If you want to restrict virtual network access to storage accounts, enable [Allow trusted Microsoft services](../storage/common/storage-network-security.md#exceptions).
General-purpose V2 storage accounts (hot and cool tiers) | Supported. | Transaction costs increase substantially compared to general-purpose V1 storage accounts.
Generation 2 (UEFI boot) | Supported.
NVMe disks | Not supported.
Managed shared disk| Supported. |
Managed Premium SSD v2 disk| Supported. | Since block blob storage accounts aren't supported in China North and China East regions, Site Recovery for Premium SSD v2 disks can't be supported. 
Ultra disks | Supported. | Zonal Disaster Recovery isn't supported. Since block blob storage accounts aren't supported in China North and China East regions, Site Recovery for Ultra disks can't be supported.
Secure transfer option | Supported.
Write accelerator enabled disks | Not supported.
Tags | Supported. | User-generated tags replicate every 24 hours.
Soft delete | Not supported. | Soft delete isn't supported because after soft delete is enabled on a storage account, it increases cost. Site Recovery performs frequent creations and deletions of log files. Replicating causes costs to increase.
iSCSI disks | Not supported. | You can use Site Recovery to migrate or fail over iSCSI disks into Azure. However, iSCSI disks aren't supported for Azure-to-Azure replication and failover/failback.
Storage Replica | Not supported.

>[!IMPORTANT]
> To avoid performance issues, make sure that you follow VM disk scalability and performance targets for [managed disks](/Azure/virtual-machines/disks-scalability-targets). If you use default settings, Site Recovery creates the required disks and storage accounts based on the source configuration. If you customize and select your own settings, follow the disk scalability and performance targets for your source VMs.

## Limits and data change rates

The following table summarizes Site Recovery limits:

- These limits are based on our tests but don't cover all possible application I/O combinations.
- Actual results can vary based on your app I/O mix.
- There are two limits to consider: per-disk data churn and per-VM data churn.
- The current limit for per-VM data churn is 54 MBps regardless of size.

Replica disk type | Average source disk I/O | Average source disk data churn | Total source disk data churn per day
---|---|---|---
Standard storage | 8 KB | 2 MBps | 168 GB per disk
Premium SSD with disk size 128 GiB or more | 8 KB | 2 MBps | 168 GB per disk
Premium SSD with disk size 128 GiB or more | 16 KB | 4 MBps | 336 GB per disk
Premium SSD with disk size 128 GiB or more | 32 KB or greater | 8 MBps | 672 GB per disk
Premium SSD with disk size 512 GiB or more | 8 KB | 5 MBps | 421 GB per disk
Premium SSD with disk size 512 GiB or more | 16 KB or greater |20 MBps | 1,684 GB per disk

High-churn support is now available in Site Recovery where churn limit per VM increased up to 100 MBps. For more information, see [Azure VM disaster recovery: High-churn support](./concepts-Azure-to-Azure-high-churn-support.md).

## <a name = "replicated-machines---networking"></a>Replicated machines: Networking

Setting | Support | Details
--- | --- | ---
Network interface card (NIC) | Maximum number supported for a specific Azure VM size | NICs are created when the VM is created during failover.<br/><br/> The number of NICs on the failover VM depends on the number of NICs on the source VM when replication was enabled. If you add or remove a NIC after enabling replication, it doesn't affect the number of NICs on the replicated VM after failover. <br/><br/> The order of NICs after failover isn't guaranteed to be the same as the original order. <br><br> You can rename NICs in the target region based on your organization's naming conventions.
Internet load balancer | Not supported | You can set up public/internet load balancers in the primary region. Site Recovery doesn't support public/internet load balancers in the DR region.
Internal load balancer | Supported | Associate the preconfigured load balancer by using an Azure Automation script in a recovery plan.
Public IP address | Supported | Associate an existing public IP address with the NIC. You can also create a public IP address and associate it with the NIC by using an Azure Automation script in a recovery plan.
Network security group (NSG) on NIC | Supported | Associate the NSG with the NIC by using an Azure Automation script in a recovery plan.
NSG on subnet | Supported | Associate the NSG with the subnet by using an Azure Automation script in a recovery plan.
Application security group (ASG) | Unsupported | Site Recovery doesn't support ASGs.
Reserved (static) IP address | Supported | If the NIC on the source VM has a static IP address, and the target subnet has the same IP address available, the NIC is assigned to the failed-over VM.<br/><br/> If the target subnet doesn't have the same IP address available, one of the available IP addresses in the subnet is reserved for the VM.<br/><br/> You can also specify a fixed IP address and subnet in **Replicated items** > **Settings** > **Network** > **Network interfaces**.
Dynamic IP address | Supported | If the NIC on the source has dynamic IP addressing, the NIC on the failed-over VM is also dynamic by default.<br/><br/> You can modify to a fixed IP address if necessary.
Multiple IP addresses | Supported | When you fail over a VM that has a NIC with multiple IP addresses, only the primary IP address of the NIC in the source region is kept by default. To fail over secondary IP configurations, go to the **Network** pane and configure them.<br><br/> Supported only for region replication. Zone-to-zone replication isn't supported.
Azure Traffic Manager | Supported | You can preconfigure Traffic Manager so that traffic is regularly routed to the endpoint in the source region. You can also route traffic to the endpoint in the target region if there was failover.
Azure Domain Name System (DNS) | Supported |
Custom Domain Name System (DNS) | Supported |
Unauthenticated proxy | Supported | Learn more about [networking in Azure VM disaster recovery](./Azure-to-Azure-about-networking.md).
Authenticated proxy | Not supported | If the VM is using an authenticated proxy for outbound connectivity, it can't be replicated by using Site Recovery.
VPN site-to-site connection to on-premises (with or without Azure ExpressRoute)| Supported | Ensure that the user-defined routes and NSGs are configured in such a way that the Site Recovery traffic isn't routed to on-premises. Learn more about [networking in Azure VM disaster recovery](./Azure-to-Azure-about-networking.md).
Network-to-network connection | Supported | Learn more about [networking in Azure VM disaster recovery](./Azure-to-Azure-about-networking.md).
Virtual network service endpoints | Supported | If you restrict the virtual network access to storage accounts, ensure that the trusted Microsoft services are allowed access to the storage account.
Accelerated networking | Supported | You can enable accelerated networking on the recovery VM only if you enable it on the source VM also. Learn more about [accelerated networking with Azure VM disaster recovery](Azure-vm-disaster-recovery-with-accelerated-networking.md).
Palo Alto Network Appliance | Not supported | With non-Microsoft appliances, the provider inside the VM often imposes restrictions. Site Recovery needs agents, extensions, and outbound connectivity to be available. The appliance doesn't allow any outbound activity to be configured inside the VM.
IPv6 | Not supported | Mixed configurations that include both IPv4 and IPv6 are supported. Site Recovery uses any free IPv4 address that's available. If there are no free IPv4 addresses in the subnet, the configuration isn't supported.
Private link access to Site Recovery | Supported | Learn more about how to [replicate machines with private endpoints](Azure-to-Azure-how-to-enable-replication-private-endpoints.md).
Tags | Supported | User-generated tags on NICs replicate every 24 hours.

## Related content

- Read [networking guidance](./Azure-to-Azure-about-networking.md) for replicating Azure VMs.
- Deploy disaster recovery by [replicating Azure VMs](./Azure-to-Azure-quickstart.md).
