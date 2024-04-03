---
title: What's new in Azure Site Recovery
description: Provides a summary of new features and the latest updates in the Azure Site Recovery service.
ms.topic: conceptual
ms.author: ankitadutta
ms.service: site-recovery
author: ankitaduttaMSFT
ms.date: 03/07/2024
ms.custom:
  - engagement-fy23
  - linux-related-content
  - ignite-2023
---

# What's new in Site Recovery

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

The [Azure Site Recovery](site-recovery-overview.md) service is updated and improved on an ongoing basis. To help you stay up-to-date, this article provides you with information about the latest releases, new features, and new content. This page is updated regularly.

You can follow and subscribe to Site Recovery update notifications in the [Azure updates](https://azure.microsoft.com/updates/?product=site-recovery) channel.

## Supported updates

For Site Recovery components, we support N-4 versions, where N is the latest released version. These are summarized in the following table.

**Update** |  **Unified Setup** | **Replication appliance / Configuration server** | **Mobility service agent** | **Site Recovery Provider** | **Recovery Services agent**
--- | --- | --- | --- | --- | ---
[Rollup 72](https://support.microsoft.com/topic/update-rollup-72-for-azure-site-recovery-kb5036010-aba602a9-8590-4afe-ac8a-599141ec99a5) | 9.60.6956.1 | NA | 9.60.6956.1 | 5.24.0117.5 | 2.0.9917.0 
[Rollup 71](https://support.microsoft.com/topic/update-rollup-71-for-azure-site-recovery-kb5035688-4df258c7-7143-43e7-9aa5-afeef9c26e1a) | 9.59.6930.1 | NA | 9.59.6930.1 | NA | NA
[Rollup 70](https://support.microsoft.com/topic/e94901f6-7624-4bb4-8d43-12483d2e1d50) | 9.57.6920.1 | 9.57.6911.1 / NA  | 9.57.6911.1 | 5.23.1204.5 (VMware) | 2.0.9263.0 (VMware)
[Rollup 69](https://support.microsoft.com/topic/update-rollup-69-for-azure-site-recovery-kb5033791-a41c2400-0079-4f93-b4a4-366660d0a30d) | NA | 9.56.6879.1 / NA  | 9.56.6879.1 | 5.23.1101.10 (VMware) | 2.0.9263.0 (VMware)
[Rollup 68](https://support.microsoft.com/topic/a81c2d22-792b-4cde-bae5-dc7df93a7810) | 9.55.6765.1 | 9.55.6765.1 / 5.1.8095.0  | 9.55.6765.1 | 5.23.0720.4 (VMware) & 5.1.8095.0 (Hyper-V) | 2.0.9261.0 (VMware) & 2.0.9260.0 (Hyper-V)


[Learn more](service-updates-how-to.md) about update installation and support.

## Updates (February 2024)

### Update Rollup 72

[Update rollup 72](https://support.microsoft.com/topic/update-rollup-72-for-azure-site-recovery-kb5036010-aba602a9-8590-4afe-ac8a-599141ec99a5) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for Oracle Linux 9.2, Oracle Linux 9.3, RHEL 9.2, Rocky Linux 9.0 and Rocky Linux 9.1 Linux distros.
**VMware VM/physical disaster recovery to Azure** |   Added support for Oracle Linux 9.2, Oracle Linux 9.3, RHEL 9.2, Rocky Linux 9.0 and Rocky Linux 9.1 Linux distros. <br><br/> Added support for Windows 11 server. <br><br/> Enabled the proxy bypass capability in the ASR replication appliance. With this, customers can now bypass proxy settings from the Appliance configuration manager. 

### Update Rollup 71

> [!Note]
> - The version 9.59 has been released only for Classic VMware/Physical to Azure scenario.
> - 9.58 and 9.59 versions have not been released for Azure to Azure and Modernized VMware to Azure replication scenarios.

[Update rollup 71](https://support.microsoft.com/topic/update-rollup-71-for-azure-site-recovery-kb5035688-4df258c7-7143-43e7-9aa5-afeef9c26e1a) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | No fixes added. 
**Azure VM disaster recovery** | No improvements added. 
**VMware VM/physical disaster recovery to Azure** |  No improvements added. 


## Updates (December 2023)

### Update Rollup 70

> [!Note]
> - The 9.58 version for mobility agent and configuration server was made live for Classic VMware/Physical to Azure scenario, during the 9.57 deployment. This version has not been released for any other scenario. The download links have been rolled back to 9.57 version for Classic VMware/Physical to Azure scenario. If you have already upgraded to 9.58 version then it is not recommended to setup replication on machines which are running on RHEL 9.1, Oracle Linux 9.1, Rocky Linux 9.1, RHEL 9.2, Oracle Linux 9.2 and Ubuntu-22.04 kernel 6.2.
> - No OVF will be released for Classic VMware/Physical to Azure scenario from this release. Only Unified Setup will be made available.

[Update rollup 70](https://support.microsoft.com/topic/e94901f6-7624-4bb4-8d43-12483d2e1d50) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for RHEL 8.9, Oracle Linux 8.9, Rocky Linux 8.8 and Rocky Linux 8.9 Linux distros. <br><br/> Added a diagnostics collection tool support, to help debug issues associated with Site Recovery services. 
**VMware VM/physical disaster recovery to Azure** | Added support for RHEL 8.9, Oracle Linux 8.9, Rocky Linux 8.8 and Rocky Linux 8.9 Linux distros. <br><br/> Added a diagnostics collection tool support, to help debug issues associated with Site Recovery services or the replication appliance. 


### Update Rollup 69

> [!Note]
> - The 9.56 version only has updates for Azure-to-Azure and Modernized VMware-to-Azure protection scenarios.

[Update rollup 69](https://support.microsoft.com/topic/update-rollup-69-for-azure-site-recovery-kb5033791-a41c2400-0079-4f93-b4a4-366660d0a30d) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for Rocky Linux 8.7, Rocky Linux 9.0, Rocky Linux 9.1 and SUSE Linux Enterprise Server 15 SP5 Linux distros. <br><br/> Added support for Windows 11 servers.
**VMware VM/physical disaster recovery to Azure** | Added support for Rocky Linux 8.7, Rocky Linux 9.0, Rocky Linux 9.1 and SUSE Linux Enterprise Server 15 SP5 Linux distros.


## Updates (November 2023)

### Use Azure Business Continuity center (preview)

You can now also manage Azure Site Recovery protections using Azure Business Continuity (ABC) center. ABC enables you to manage your protection estate across solutions and environments. It provides a unified experience with consistent views, seamless navigation, and supporting information to provide a holistic view of your business continuity estate for better discoverability with the ability to do core activities. [Lear more about the supported scenarios](../business-continuity-center/business-continuity-center-support-matrix.md).


## Updates (August 2023)

### Update Rollup 68

[Update rollup 68](https://support.microsoft.com/topic/a81c2d22-792b-4cde-bae5-dc7df93a7810) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for RHEL 8.8 Linux distros.
**VMware VM/physical disaster recovery to Azure** | Added support for RHEL 8.8 Linux distros.

## Updates (May 2023)

### Update Rollup 67

[Update rollup 67](https://support.microsoft.com/topic/update-rollup-67-for-azure-site-recovery-9fa97dbb-4539-4b6c-a0f8-c733875a119f) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for Oracle Linux 8.7 with UEK7 kernel, RHEL 9 and Cent OS 9 Linux distros.
**VMware VM/physical disaster recovery to Azure** | Added support for Oracle Linux 8.7 with UEK7 kernel, RHEL 9, Cent OS 9 and Oracle Linux 9 Linux distros. <br> <br/> Added support for Windows Server 2019 as the Azure Site Recovery replication appliance. <br> <br/> Added support for Microsoft Edge to be the default browser in Appliance Configuration Manager. <br> <br/> Added support to select an Availability set or a Proximity Placement group, after enabling replication using modernized VMware/Physical machine replication scenario.


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
**VMware VM/physical disaster recovery to Azure** | Added support for Debian 11 and SUSE Linux Enterprise Server 15 SP 4 Linux distro.<br/><br/> Added Modernized VMware to Azure DR support for government clouds. [Learn more](./replication-appliance-support-matrix.md#allow-urls-for-government-clouds).


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


## Next steps

Keep up-to-date with our updates on the [Azure Updates](https://azure.microsoft.com/updates/?product=site-recovery) page.
