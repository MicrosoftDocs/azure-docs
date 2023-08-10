---
title: What's new in Azure Site Recovery
description: Provides a summary of new features and the latest updates in the Azure Site Recovery service.
ms.topic: conceptual
ms.author: ankitadutta
ms.service: site-recovery
author: ankitaduttaMSFT
ms.date: 08/01/2023
ms.custom: engagement-fy23, devx-track-linux
---

# What's new in Site Recovery

The [Azure Site Recovery](site-recovery-overview.md) service is updated and improved on an ongoing basis. To help you stay up-to-date, this article provides you with information about the latest releases, new features, and new content. This page is updated regularly.

You can follow and subscribe to Site Recovery update notifications in the [Azure updates](https://azure.microsoft.com/updates/?product=site-recovery) channel.

## Supported updates

For Site Recovery components, we support N-4 versions, where N is the latest released version. These are summarized in the following table.

**Update** |  **Unified Setup** | **Replication appliance / Configuration server** | **Mobility service agent** | **Site Recovery Provider** | **Recovery Services agent**
--- | --- | --- | --- | --- | ---
[Rollup 67](https://support.microsoft.com/topic/update-rollup-67-for-azure-site-recovery-9fa97dbb-4539-4b6c-a0f8-c733875a119f) | 9.54.6682.1 | 9.54.6682.1 / 5.1.8095.0  | 9.54.6682.1 | 5.23.0428.1 (VMware) & 5.1.8095.0 (Hyper-V) | 2.0.9261.0 (VMware) & 2.0.9260.0 (Hyper-V)
[Rollup 66](https://support.microsoft.com/en-us/topic/update-rollup-66-for-azure-site-recovery-kb5023601-c306c467-c896-4c9d-b236-73b21ca27ca5) | 9.53.6615.1 | 9.53.6615.1 / 5.1.8095.0  | 9.53.6615.1 | 5.1.8103.0 (Modernized VMware), 5.1.8095.0 (Hyper-V) & 5.23.0210.5 (Classic VMware) | 2.0.9260.0
[Rollup 65](https://support.microsoft.com/topic/update-rollup-65-for-azure-site-recovery-kb5021964-15db362f-faac-417d-ad71-c22424df43e0) | 9.52.6522.1 | 9.52.6522.1 / 5.1.7870.0 | 9.52.6522.1 | 5.1.7870.0 (VMware) & 5.1.7882.0 (Hyper-V) | 2.0.9259.0
[Rollup 64](https://support.microsoft.com/topic/update-rollup-64-for-azure-site-recovery-kb5020102-23db9799-102c-4378-9754-2f19f6c7858a) | 9.51.6477.1 | 9.51.6477.1 / 5.1.7802.0 | 9.51.6477.1 | 5.1.7802.0 | 2.0.9257.0
[Rollup 63](https://support.microsoft.com/topic/update-rollup-63-for-azure-site-recovery-992e63af-aa94-4ea6-8d1b-2dd89a9cc70b) | 9.50.6419.1 | 9.50.6419.1 / 5.1.7626.0 | 9.50.6419.1 | 5.1.7626.0 | 2.0.9249.0

[Learn more](service-updates-how-to.md) about update installation and support.

## Updates (May 2023)

### Update Rollup 67

[Update rollup 67](https://support.microsoft.com/topic/update-rollup-67-for-azure-site-recovery-9fa97dbb-4539-4b6c-a0f8-c733875a119f) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for Oracle Linux 8.7 with UEK7 kernel, RHEL 9 and Cent OS 9 Linux distros.
**VMware VM/physical disaster recovery to Azure** | Added support for Oracle Linux 8.7 with UEK7 kernel, RHEL 9, Cent OS 9 and Oracle Linux 9 Linux distros. <br> <br/> Added support for Windows Server 2019 as the ASR replication appliance. <br> <br/> Added support for Microsoft Edge to be the default browser in Appliance Configuration Manager. <br> <br/> Added support to select an Availability set or a Proximity Placement group, after enabling replication using modernized VMware/Physical machine replication scenario.


## Updates (February 2023)

### Update Rollup 66

[Update rollup 66](https://support.microsoft.com/en-us/topic/update-rollup-66-for-azure-site-recovery-kb5023601-c306c467-c896-4c9d-b236-73b21ca27ca5) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for Ubuntu 22.04, RHEL 8.7 and CentOS 8.7 Linux distro.
**VMware VM/physical disaster recovery to Azure** | Added support for Ubuntu 22.04, RHEL 8.7 and CentOS 8.7 Linux distro.

## Updates (November 2022)

### Update Rollup 65

[Update rollup 65](https://support.microsoft.com/topic/update-rollup-65-for-azure-site-recovery-kb5021964-15db362f-faac-417d-ad71-c22424df43e0) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for Debian 11 and SUSE Linux Enterprise Server 15 SP 4 Linux distro.
**VMware VM/physical disaster recovery to Azure** | Added support for Debian 11 and SUSE Linux Enterprise Server 15 SP 4 Linux distro.<br/><br/> Added Modernized VMware to Azure DR support for government clouds. [Learn more](deploy-vmware-azure-replication-appliance-modernized.md#allow-urls-for-government-clouds).


## Updates (October 2022)

### Update Rollup 64

[Update rollup 64](https://support.microsoft.com/topic/update-rollup-64-for-azure-site-recovery-kb5020102-23db9799-102c-4378-9754-2f19f6c7858a) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for Ubuntu 20.04 Linux distro.
**VMware VM/physical disaster recovery to Azure** | Added support for Ubuntu 20.04 Linux distro.<br/><br/> Modernized experience to enable disaster recovery of VMware virtual machines is now generally available.[Learn more](https://azure.microsoft.com/updates/vmware-dr-ga-with-asr).<br/><br/> Protecting physical machines modernized experience is now supported.<br/><br/> Protecting machines with private endpoint and managed identity enabled is now supported with modernized experience.

## Updates (August 2022)

### Update Rollup 63

[Update rollup 63](https://support.microsoft.com/topic/update-rollup-63-for-azure-site-recovery-992e63af-aa94-4ea6-8d1b-2dd89a9cc70b) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for Oracle Linux 8.6 Linux distro.
**VMware VM/physical disaster recovery to Azure** | Added support for Oracle Linux 8.6 Linux distro.<br/><br/> Introduced the migration capability to move existing replications from classic to modernized experience for disaster recovery of VMware virtual machines, enabled using Azure Site Recovery. [Learn more](move-from-classic-to-modernized-vmware-disaster-recovery.md).


## Updates (July 2022)

### Update Rollup 62

[Update rollup 62](https://support.microsoft.com/topic/update-rollup-62-for-azure-site-recovery-e7aff36f-b6ad-4705-901c-f662c00c402b) provides the following updates:

> [!Note]
> - The 9.49 version has not been released for VMware replications to Azure preview experience. 

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for RHEL 8.6 and CentOS 8.6 Linux distros.
**VMware VM/physical disaster recovery to Azure** | Added support for RHEL 8.6 and CentOS 8.6 Linux distros.<br/><br/> Added support for configuring proxy bypass rules for VMware and Hyper-V replications, using private endpoints.<br/><br/> Added fixes related to various security issues present in the classic experience.
**Hyper-V disaster recovery to Azure** | Added support for configuring proxy bypass rules for VMware and Hyper-V replications, using private endpoints.

## Updates (March 2022)

### Update Rollup 61

[Update rollup 61](https://support.microsoft.com/topic/update-rollup-61-for-azure-site-recovery-kb5012960-a1cc029b-03ad-446f-9365-a00b41025d39) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for more kernels for Debian 10 and Ubuntu 20.04 Linux distros. <br/><br/> Added public preview support for on-Demand Capacity Reservation integration.
**VMware VM/physical disaster recovery to Azure** | Added support for thin provisioned LVM volumes.<br/><br/> 

## Updates (January 2022)

### Update Rollup 60

[Update rollup 60](https://support.microsoft.com/topic/883a93a7-57df-4b26-a1c4-847efb34a9e8) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | A number of fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Support added for retention points to be available for up to 15 days.<br/><br/>Added support for replication to be enabled on Azure virtual machines via Azure Policy. <br/><br/> Added support for ZRS managed disks when replicating Azure virtual machines. <br/><br/> Support added for SUSE Linux Enterprise Server 15 SP3, Red Hat Enterprise Linux 8.4 and Red Hat Enterprise Linux 8.5 <br/><br/> 
**VMware VM/physical disaster recovery to Azure** | Support added for retention points to be available for up to 15 days.<br/><br/>Support added for SUSE Linux Enterprise Server 15 SP3, Red Hat Enterprise Linux 8.4 and Red Hat Enterprise Linux 8.5 <br/><br/> 


## Updates (November 2021)

### Update Rollup 59

[Update rollup 59](https://support.microsoft.com/topic/update-rollup-59-for-azure-site-recovery-kb5008707-66a65377-862b-4a4c-9882-fd74bdc7a81e) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | A number of fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Support added for Windows Server 2022.<br/><br/> Support added for Oracle Linux 8.4 with UEK kernel. 
**VMware VM/physical disaster recovery to Azure** | Support added for Windows Server 2022.<br/><br/> Support added for Oracle Linux 8.4 with UEK kernel.

## Updates (September 2021)

### Update Rollup 58

[Update rollup 58](https://support.microsoft.com/topic/update-rollup-58-for-azure-site-recovery-kb5007075-37ba21c3-47d9-4ea9-9130-a7d64f517d5d) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | A number of fixes and improvement as detailed in the rollup KB article.

## Updates (August 2021)

### Update Rollup 57

[Update rollup 57](https://support.microsoft.com/topic/update-rollup-57-for-azure-site-recovery-kb5006172-9fccc879-6e0c-4dc8-9fec-e0600cf94094) provides the following updates:

> [!NOTE]
> Update rollup only provides updates for the public preview of VMware to Azure protections. No other fixes or improvements have been covered in this release.
> To setup the preview experience, you will have to perform a fresh set up and use a new Recovery Services vault. Updating from existing architecture to new architecture is unsupported.

This public preview covers a complete overhaul of the current architecture for protecting VMware machines.
- [Learn](/azure/site-recovery/vmware-azure-architecture-preview) about the new architecture and the changes introduced.
- Check the pre-requisites and set up the Azure Site Recovery replication appliance by following [these steps](/azure/site-recovery/deploy-vmware-azure-replication-appliance-preview).
- [Enable replication](/azure/site-recovery/vmware-azure-set-up-replication-tutorial-preview) for your VMware machines.
- Check out the [automatic upgrade](/azure/site-recovery/upgrade-mobility-service-preview) and [switch](/azure/site-recovery/switch-replication-appliance-preview) capability for Azure Site Recovery replication appliance.


## Updates (July 2021)

### Update rollup 56

[Update rollup 56](https://support.microsoft.com/en-us/topic/update-rollup-56-for-azure-site-recovery-kb5005376-33f27950-1a07-43e5-bf40-4b380a270ef6) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | A number of fixes and improvement as detailed in the rollup KB article.

**Azure Site Recovery Service** | Made improvements so that enabling replication and reprotect operations are faster by 46%.
**Azure Site Recovery Portal** | Replication can now be enabled between any two Azure regions around the world. You are no longer limited to enabling replication within your continent.


## Updates (April 2021)

### Update rollup 55

[Update rollup 55](https://support.microsoft.com/topic/b19c8190-5f88-43ea-85b1-d9e0cc5ca7e8) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup.
**Issue fixes/improvements** | A number of fixes and improvements as detailed in the rollup.
**Azure VM disaster recovery** | Support added for cross-continental disaster recovery of Azure VMs.<br/><br/> REST API support for protection of Virtual Machine Scale Sets Flex.<br/><br/> Now supported for VMs running Oracle Linux 8.2 and 8.3.
**VMware VM/physical disaster recovery to Azure** | Added support for using Ubuntu-20.04 while setting up master target server.<br/><br/> Now supported for VMs running Oracle Linux 8.2 and 8.3.


## Updates (February 2021)

### Update rollup 54

[Update rollup 54](https://support.microsoft.com/topic/update-rollup-54-for-azure-site-recovery-50873c7c-272c-4a7a-b9bb-8cd59c230533) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup.
**Issue fixes/improvements** | A number of fixes and improvements as detailed in the rollup.
**Azure VM disaster recovery** | Zone to Zone Disaster Recovery using Azure Site Recovery is now GA in four more regions – North Europe, East US, Central US, and West US 2.<br/>
**VMware VM/physical disaster recovery to Azure** | The update includes portal support for selecting Proximity Placements Groups for VMware/Physical machines after enabling replication.<br/><br/> Protecting VMware machines with data disk size up to 32 TB is now supported.
**Hyper-V disaster recovery to Azure** | The update includes portal support for selecting Proximity Placements Groups for Hyper-V machines after enabling replication.


## Updates (January 2021)

### Update rollup 53

[Update rollup 53](https://support.microsoft.com/topic/update-rollup-53-for-azure-site-recovery-060268ef-5835-bb49-7cbc-e8c1e6c6e12a) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup.
**Issue fixes/improvements** | A number of fixes and improvements as detailed in the rollup.
**Azure VM disaster recovery** | Replication for tags is now supported. Any tags added to Azure VMs, disks, and NICs in the source region are replicated to machines in the target region.<br/><br/> Azure VMs running Debian 10 are now supported for replication.
**VMware VM/physical disaster recovery to Azure** | The update includes logging enhancements for VMware VM replication to Azure, and improved error messaging.<br/><br/> VMware VMs and physical machines running Debian 10 are now supported for replication.


## Updates (November 2020)

### Update rollup 52

[Update rollup 52](https://support.microsoft.com/help/4597409/update-rollup-52-for-azure-site-recovery) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup.
**Issue fixes/improvements** | A number of fixes and improvements as detailed in the rollup, including new Linux support for the Mobility service.
**Azure VM disaster recovery** | Now supported for VMs running RHEL 8.3 and Oracle Linux 7.9
**VMware VM/physical disaster recovery to Azure** | Now supported for VMs running RHEL 8.3, Oracle Linux 7.9.

## Updates (October 2020)

### Update rollup 51

[Update rollup 51](https://support.microsoft.com/help/4590304/update-rollup-51-for-azure-site-recovery) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup.
**Issue fixes/improvements** | A number of fixes and improvements as detailed in the rollup, including new Linux support for the Mobility service.

## Updates (September 2020)

### Update rollup 50

[Update rollup 50](https://support.microsoft.com/help/4582666/update-rollup-50-for-azure-site-recovery) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup.
**Issue fixes/improvements** | A number of fixes and improvements as detailed in the rollup.

## Updates (August 2020)

### Update rollup 49

[Update rollup 49](https://support.microsoft.com/help/4578241/update-rollup-49-for-azure-site-recovery) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup.
**Issue fixes/improvements** | A number of fixes and improvements as detailed in the rollup, including new Linux support for the Mobility service.

## Updates (July 2020)

### Update rollup 48

[Update rollup 48](https://support.microsoft.com/help/4573888/update-rollup-48-for-azure-site-recovery) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup.
**Issue fixes/improvements** | A number of fixes and improvements as detailed in the rollup.

> [!NOTE]
> Update rollup 48 has a known issue with enabling replication for Linux machines encrypted using ADE. [Learn more](./azure-to-azure-troubleshoot-errors.md#enable-protection-failed-as-the-installer-is-unable-to-find-the-root-disk-error-code-151137).

### Update rollup 47

[Update rollup 47](https://support.microsoft.com/help/4570609/update-rollup-47-for-azure-site-recovery) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup.
**Issue fixes/improvements** | A number of fixes and improvements as detailed in the rollup.

## Updates (June 2020)

### Update rollup 46

[Update rollup 46](https://support.microsoft.com/help/4564347/update-rollup-46-for-azure-site-recovery) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup.
**Issue fixes/improvements** | A number of fixes and improvements as detailed in the rollup.

## Updates (March 2020)

### Update rollup 45

[Update rollup 45](https://support.microsoft.com/help/4550047/update-rollup-45-for-azure-site-recovery) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup.
**Issue fixes/improvements** | A number of fixes and improvements as detailed in the rollup.

## Updates (January 2020)

### Update rollup 44

[Update rollup 44](https://support.microsoft.com/help/4538187/update-rollup-44-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | There were no updates for the Site Recovery providers and agents.
**Issue fixes/improvements** | A number of fixes and improvements as detailed in the rollup.

### Azure VMware disaster recovery

Azure virtual machines now support VMs enable for encryption-at-rest with customer-managed keys. [Learn more](azure-to-azure-how-to-enable-replication-cmk-disks.md).


### Update rollup 43

[Update rollup 43](https://support.microsoft.com/help/4537047/update-rollup-43-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers (as detailed in the rollup)
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup)


## Updates (November 2019)

### Update rollup 42

[Update rollup 42](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers (as detailed in the rollup)
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup)


### Azure VM disaster recovery

New features for Azure VM disaster recovery are summarized in the table.

**Feature** | **Details**
--- | ---
**UEFI** | Site Recovery now supports disaster recovery for Azure VMs with UEFI-based boot architecture.
**Linux** | Site Recovery now supports Azure VMs running Linux with Azure Disk Encryption (ADE).
**Generation 2** | All generation 2 Azure VMs are now supported for disaster recovery.
**Regions** | You can now enable disaster recovery for Azure VMs in the Norway geo.

### VMware to Azure disaster recovery

New features for VMware to Azure disaster recovery are summarized in the table.

**Feature** | **Details**
--- | ---
**UEFI** | Site Recovery now supports disaster recovery for VMware VMs with UEFI-based boot architecture.<br/><br/> Supported operating systems include Windows Server 2019, Windows Server 2016, Windows Server 2012 R2, Windows Server 2012, SLES 12 SP4, RHEL 8.

## Update to servicing stack update/SHA-2

For disaster recovery of Azure VMs to a secondary region, or on-premises VMware VMs or physical servers to Azure, note the following:

- From version 9.30.5407.1 of the Mobility service extension (for Azure VMs), and Mobility service agent (for VMware/physical machines), some machine operating systems must be running the servicing stack update and SHA-2. Details are shown in the table below.
- Install the update and SHA-2 in accordance with the linked KB. SHA-1 isn't supported from September 2019, and if SHA-2 code signing isn't enabled the agent extension won't install/upgrade as expected.
- Learn more about [SHA-2 upgrade and requirements](https://aka.ms/SHA-2KB).

**Operating system** | **Azure VM** | **VMware VM/physical machine**
--- | --- | ---
**Windows 2008 R2 SP1** | [Servicing stack update](https://support.microsoft.com/help/4490628)<br/> [SHA-2](https://support.microsoft.com/help/4474419)| [Servicing stack update](https://support.microsoft.com/help/4490628)<br/> [SHA-2](https://support.microsoft.com/help/4474419)
**Windows 2008 SP2** | [Servicing stack update](https://support.microsoft.com/help/4493730)<br/> [SHA-2](https://support.microsoft.com/help/4474419)| [Servicing stack update](https://support.microsoft.com/help/4493730)<br/> [SHA-2](https://support.microsoft.com/help/4474419)
**Windows 7 SP1** | [Servicing stack update](https://support.microsoft.com/help/4490628)<br/> [SHA-2](https://support.microsoft.com/help/4474419)| [Servicing stack update](https://support.microsoft.com/help/4490628)<br/> [SHA-2](https://support.microsoft.com/help/4474419).



## Updates (October 2019)

### Update rollup 41

[Update rollup 41](https://support.microsoft.com/help/4528026/update-rollup-41-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers (as detailed in the rollup)
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup)



### Azure VM disaster recovery

New features for Azure VM disaster recovery are summarized in the table.

**Feature** | **Details**
--- | ---
**Test failover settings** | When setting up a test failover, you can now configure settings for the test failover VM and network, including IP address, NSG, internal load balance, and the public IP address for each machine NIC. These settings are optional and don't change current behavior. If you don't configure these settings, you can choose an Azure VNet at the time of test failover. [Learn more](https://azure.microsoft.com/blog/customize-networking-for-dr-drills-azure-site-recovery/).
**Recovery plans** | Recovery plans are now limited to 100 VMs, to ensure failover reliability.

### VMware to Azure disaster recovery

New features for VMware to Azure disaster recovery are summarized in the table.

**Feature** | **Details**
--- | ---
**Recovery plans** | Recovery plans are now limited to 100 VMs, to ensure failover reliability.


## Updates (September 2019)

### Update rollup 40

[Update rollup 40](https://support.microsoft.com/help/4521530/update-rollup-40-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers (as detailed in the rollup)
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup)




### Azure VM disaster recovery

New features for Azure VM disaster recovery are summarized in the table.

**Feature** | **Details**
--- | ---
**Cleanup after failback** | After failing over to the secondary Azure, and then failing back to the primary region, Site Recovery automatically cleans up machines in the secondary region. There's no need to manually delete VMs and NICs.
**Test failover retains IP address** | You can now retain the IP address of the source VM during a disaster recovery drill, and pick a static IP address for a test failover.

### VMware/physical server disaster recovery

Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
New process server alerts | We've added new process server alerts. [Learn more](vmware-physical-azure-monitor-process-server.md).

### Hyper-V disaster recovery

Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
Storage account | Site Recovery now supports the use of storage accounts with firewall enabled for Hyper-V to Azure disaster recovery.  You can select firewall-enabled storage accounts as a target account, or for cache storage. If you use firewall-enabled account, make sure that you enable the option to allow trusted Microsoft services.<br/><br/> This is supported for Hyper-V VMs with or without System Center VMM.


## Updates (August 2019)

### Update rollup 39

[Update rollup 39](https://support.microsoft.com/help/4517283/update-rollup-39-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers (as detailed in the rollup)
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup)


### Azure VM disaster recovery

New features for Azure VM disaster recovery are summarized in the table.

**Feature** | **Details**
--- | ---
**Encryption without Azure AD** | Encryption without an Azure AD app is now supported for Azure VM replication to managed disks running Windows.
**Network resources for failover** | When failing over to another region, you can now attach network resource settings (NSGs, load balancing, public IP address) to a VM.

## Updates (July 2019)

### Update rollup 38

[Update rollup 38](https://support.microsoft.com/help/4513507/) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers (as detailed in the rollup)
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup)


### General

Site Recovery now supports the use of general purpose v2 storage accounts for cache storage or target storage. Previously only v1 was supported.

### VMware to Azure disaster recovery

You can now replicate disks up to 8 TB, when replicating to an Azure VM with managed disks.


## Updates (June 2019)

### Update rollup 37

[Update rollup 37](https://support.microsoft.com/help/4508614/) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers (as detailed in the rollup)
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup)


### VMware/physical server disaster recovery

Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
**GPT partitions** | From Update Rollup 37 onwards (Mobility service version 9.25.5241.1), up to five GPT partitions are supported in UEFI. Prior to this update, four were supported.



## Updates (May 2019)

### Update rollup 36

[Update rollup 36](https://support.microsoft.com/help/4503156) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup)
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup)

### Azure VM disaster recovery

Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
**Replicate added disks** | Enable replication for data disks added to an Azure VM that's already enabled for disaster recovery. [Learn more](azure-to-azure-enable-replication-added-disk.md).
**Automatic updates** | When configuring automatic updates for the Mobility service extension that runs on Azure VMs enabled for disaster recovery, you can now select an existing automation account to use, instead of using the default account created by Site Recovery. [Learn more](azure-to-azure-autoupdate.md).


### VMware/physical server disaster recovery

Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
**Process server monitoring** | For disaster recovery of on-premises VMware VMs and physical servers, monitor and troubleshoot process server issues with improved server health reporting and alerts. [Learn more](vmware-physical-azure-monitor-process-server.md).





## Updates (March 2019)

### Update rollup 35

[Update rollup 35](https://support.microsoft.com/en-us/help/4494485/update-rollup-35-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup)
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup)

### VMware/physical server disaster recovery

Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
**Managed disks** | Replication of on-premises VMware VMs and physical servers is now directly to managed disks in Azure. On-premises data is sent to a cache storage account in Azure, and recovery points are created in managed disks in the target location. This ensures you don't need to manage multiple target storage accounts.
**Configuration server** | Site Recovery now supports configuration servers with multiple NICs. Add additional adapters to the configuration server VM before you register the configuration server in the vault. If you add afterwards, you need to re-register the server in the vault.


## Updates (February 2019)

### Update rollup 34

[Update rollup 34](https://support.microsoft.com/help/4490016/update-rollup-34-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup).
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup).


### Update rollup 33

[Update rollup 33](https://support.microsoft.com/help/4489582/update-rollup-33-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup).
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup).


### Azure VM disaster recovery

Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
**Network mapping** | For Azure VM disaster recovery, you can now use any available target network when you enable replication.
**Standard SSD** | You can now set up disaster recovery for Azure VMs using [Standard SSD disks](../virtual-machines/disks-types.md#standard-ssds).
**Storage Spaces Direct** | You can set up disaster recovery for apps running on Azure VM apps by using [Storage Spaces Direct](/windows-server/storage/storage-spaces/storage-spaces-direct-overview) for high availability.  Using Storage Spaces Direct (S2D) together with Site Recovery provides comprehensive protection of Azure VM workloads. S2D lets you host a guest cluster in Azure. This is especially useful when a VM hosts a critical application, such as SAP ASCS layer, SQL Server, or scale-out file server.


### VMware/physical server disaster recovery

Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
**Linux BRTFS file system** | Site Recovery now supports replication of VMware VMs with the BRTFS file system. Replication isn't supported if:<br/><br/>- The BTRFS file system subvolume is changed after enabling replication.<br/><br/>- The file system is spread over multiple disks.<br/><br/>- The BTRFS file system supports RAID.
**Windows Server 2019** | Support added for machines running Windows Server 2019.


## Updates (January 2019)


### Accelerated networking (Azure VMs)

Accelerated networking enables single root I/O virtualization (SR-IOV) to a VM, improving networking performance. When you enable replication for an Azure VM, Site Recovery detects whether accelerated networking is enabled. If it is, after failover Site Recovery automatically configures accelerated networking on the target replica Azure VM, for both [Windows](../virtual-network/create-vm-accelerated-networking-powershell.md#enable-accelerated-networking-on-existing-vms) and [Linux](../virtual-network/create-vm-accelerated-networking-cli.md#enable-accelerated-networking-on-existing-vms).

[Learn more](azure-vm-disaster-recovery-with-accelerated-networking.md).

### Update rollup 32

[Update rollup 32](https://support.microsoft.com/help/4485985/update-rollup-32-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup).
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup).

### Azure VM disaster recovery

Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
**Linux support** | Support was added for RedHat Workstation 6/7, and new kernel versions for Ubuntu, Debian, and SUSE.
**Storage Spaces Direct** | Site Recovery supports Azure VMs using Storage Spaces Direct (S2D).

### VMware VMs/physical servers disaster recovery

Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
**Linux support** | Support was added for Redhat Enterprise Linux 7.6, RedHat Workstation 6/7, Oracle Linux 6.10 and Oracle Linux 7.6, and new kernel versions for Ubuntu, Debian, and SUSE.


### Update rollup 31

[Update rollup 31](https://support.microsoft.com/help/4478871/update-rollup-31-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup).
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup).

### VMware VMs/physical servers replication

Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
**Linux support** |  Support was added for Oracle Linux 6.8, Oracle Linux 6.9 and Oracle Linux 7.0 with the Red Hat Compatible Kernel, and for the Unbreakable Enterprise Kernel (UEK) Release 5.
**LVM** | Support added for LVM and LVM2 volumes.<br/><br/> The /boot directory on a disk partition and on LVM volumes is now supported.
**Directories** | Support was added for these directories set up as separate partitions, or file systems that aren't on the same system disk:<br/><br/> /(root), /boot, /usr, /usr/local, /var, /etc.
**Windows Server 2008** | Support added for dynamic disks.
**Failover** | Improved failover time for VMware VMs where storvsc and vsbus aren't boot drivers.
**UEFI support** | Azure VMs don't support boot type UEFI. You can now migrate on-premises physical servers with UEFI to Azure with Site Recovery. Site Recovery migrates the server by converting the boot type to BIOS before migration. Site Recovery previously supported this conversion for VMs only. Support is available for physical servers running Windows Server 2012 or later.

### Azure VM disaster recovery

Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
**Linux support** | Support was added for Oracle Linux 6.8, Oracle Linux 6.9 and Oracle Linux 7.0 with the Red Hat Compatible Kernel, and for the Unbreakable Enterprise Kernel (UEK) Release 5.
**Linux BRTFS file system** | Supported for Azure VMs.
**Azure VMs in availability zones** | You can enable replication to another region for Azure VMs deployed in availability zones. You can now enable replication for an Azure VM, and set the target for failover to a single VM instance, a VM in an availability set, or a VM in an availability zone. The setting doesn't affect replication. [Read](https://azure.microsoft.com/blog/disaster-recovery-of-zone-pinned-azure-virtual-machines-to-another-region/) the announcement.
**Firewall-enabled storage (portal/PowerShell)** | Support added for [firewall-enabled storage accounts](../storage/common/storage-network-security.md).<br/><br/> You can replicate Azure VMs with unmanaged disks on firewall-enabled storage accounts to another Azure region for disaster recovery.<br/><br/> You can use firewall-enabled storage accounts as target storage accounts for unmanaged disks.<br/><br/> Supported in portal and using PowerShell.

## Updates (December 2018)

### Automatic updates for the Mobility service (Azure VMs)

Site Recovery added an option for automatic updates to the Mobility service extension. The Mobility service extension is installed on each Azure VM replicated by Site Recovery. When you enable replication, you select whether to allow Site Recovery to manage updates to the extension.

Updates don't require a VM restart, and don't affect replication. [Learn more](azure-to-azure-autoupdate.md).

### Pricing calculator for Azure VM disaster recovery

Disaster Recovery of Azure VMs incurs VM licensing costs, and network and storage costs. Azure provides a [pricing calculator](https://aka.ms/a2a-cost-estimator) to help you figure out these costs. Site Recovery now provides an [example pricing estimate](https://aka.ms/a2a-cost-estimator) that prices a sample deployment based on a three-tier app using six VMs with 12 Standard HDD disks and 6 Premium SSD disks.

- The sample presumes a data change of 10 GB a day for standard, and 20 GB for premium.
- For your particular deployment, you can change the variables to estimate costs.
- You can specify the number of VMs, the number and type of managed disks, and the expected total data change rate expected across the VMs.
- Additionally, you can apply a compression factor to estimate bandwidth costs.

[Read](https://azure.microsoft.com/blog/know-exactly-how-much-it-will-cost-for-enabling-dr-to-your-azure-vm/) the announcement.


## Updates (October 2018)

### Update rollup 30

[Update rollup 30](https://support.microsoft.com/help/4468181/azure-site-recovery-update-rollup-30) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup).
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup).

### Azure VM disaster recovery
Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
**Region support** | Site Recovery support added for Australia Central 1 and Australia Central 2.
**Support for disk encryption** | Support added for disaster recovery of Azure VMs encrypted with Azure Disk Encryption (ADE) with the Azure AD app. [Learn more](azure-to-azure-how-to-enable-replication-ade-vms.md).
**Disk exclusion** | Uninitialized disks are now automatically excluded during Azure VM replication.
**Firewall-enabled storage (PowerShell)** | Support added for [firewall-enabled storage accounts](../storage/common/storage-network-security.md).<br/><br/> You can replicate Azure VMs with unmanaged disks on firewall-enabled storage accounts to another Azure region for disaster recovery.<br/><br/> You can use firewall-enabled storage accounts as target storage accounts for unmanaged disks.<br/><br/> Supported using PowerShell only.


### Update rollup 29

[Update rollup 29](https://support.microsoft.com/help/4466466/update-rollup-29-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup).
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup).


## Updates (August 2018)

### Update rollup 28

[Update rollup 28](https://support.microsoft.com/help/4460079/update-rollup-28-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup).
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup).

### Azure VM disaster recovery
Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
**Linux support** | Added supported for RedHat Enterprise Linux 6.10; CentOS 6.10.<br/><br/>
**Cloud support** | Supported disaster recovery for Azure VMs in the Germany cloud.
**Cross-subscription disaster recovery** | Support for replicating Azure VMs in one region to another region in a different subscription, within the same Azure Active Directory tenant. [Learn more](https://aka.ms/cross-sub-blog).

### VMware VM/physical server disaster recovery
Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
**Linux support** | Support added for RedHat Enterprise Linux 6.10, CentOS 6.10.<br/><br/> Linux-based VMs that use the GUID partition table (GPT) partition style in legacy BIOS compatibility mode are now supported. Review the [Azure VM FAQ](../virtual-machines/faq-for-disks.yml) for more information.
**Disaster recovery for VMs after migration** | Support for enabling disaster recovery to a secondary region for an on-premises VMware VM migrated to Azure, without needing to uninstall the Mobility service on the VM before enabling replication.
**Windows Server 2008** | Support for migrating machines running Windows Server 2008 R2/2008 64-bit and 32-bit.<br/><br/> Migration only (replication and failover). Failback isn't supported.

## Updates (July 2018)

### Update rollup 27 (July 2018)

[Update rollup 27](https://support.microsoft.com/help/4055712/update-rollup-27-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup).
**Issue fixes/improvements** | A number of fixes and improvements (as detailed in the rollup).

### Azure VM disaster recovery

Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
**Linux support** | Support added for Red Hat Enterprise Linux 7.5.

### VMware VM/physical server disaster recovery

Features added this month are summarized in the table.

**Feature** | **Details**
--- | ---
**Linux support** | Support added for Red Hat Enterprise Linux 7.5, SUSE Linux Enterprise Server 12.



## Next steps

Keep up-to-date with our updates on the [Azure Updates](https://azure.microsoft.com/updates/?product=site-recovery) page.
