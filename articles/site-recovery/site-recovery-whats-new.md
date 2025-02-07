---
title: What's new in Azure Site Recovery
description: Provides a summary of the latest updates in the Azure Site Recovery service.
ms.topic: overview
ms.author: ankitadutta
ms.service: azure-site-recovery
author: ankitaduttaMSFT
ms.date: 01/28/2025
ms.custom:
  - engagement-fy23
  - linux-related-content
  - ignite-2023
---

# What's new in Site Recovery

The [Azure Site Recovery](site-recovery-overview.md) service is updated and improved on an ongoing basis. To help you stay up-to-date, this article provides you with information about the latest releases, new features, and new content. This page is updated regularly.

You can follow and subscribe to Site Recovery update notifications in the [Azure updates](https://azure.microsoft.com/updates/?product=site-recovery) channel.

## Supported updates

For Site Recovery components, we support N-4 versions, where N is the latest released version. These are summarized in the following table.

**Update** |  **Unified Setup** | **Replication appliance / Configuration server** | **Mobility service agent** | **Site Recovery Provider** | **Recovery Services agent**
--- | --- | --- | --- | --- | ---
[Rollup 76](https://support.microsoft.com/en-us/topic/update-rollup-76-for-azure-site-recovery-6ca6833a-5b0f-4bdf-9946-41cd0aa8d6e4) | NA | NA | 9.63.7187.1 | 5.24.0902.11 | 2.0.9938.0
[Rollup 75](https://support.microsoft.com/topic/update-rollup-75-for-azure-site-recovery-4884b937-8976-454a-9b80-57e0200eb2ec) | NA | NA | 9.62.7172.1 | 5.24.0814.2 | 2.0.9932.0
[Rollup 74](https://support.microsoft.com/topic/update-rollup-74-for-azure-site-recovery-584e3586-4c55-4cc2-8b1c-63038b6b4464) | NA | NA | 9.62.7096.1 | 5.24.0614.1 | 2.0.9919.0
[Rollup 73](https://support.microsoft.com/topic/update-rollup-73-for-azure-site-recovery-d3845f1e-2454-4ae8-b058-c1fec6206698) | 9.61.7016.1 | 9.61.7016.1 | 9.61.7016.1 | 5.24.0317.5 | 2.0.9917.0 
[Rollup 72](https://support.microsoft.com/topic/update-rollup-72-for-azure-site-recovery-kb5036010-aba602a9-8590-4afe-ac8a-599141ec99a5) | 9.60.6956.1 | NA | 9.60.6956.1 | 5.24.0117.5 | 2.0.9917.0 
[Rollup 71](https://support.microsoft.com/topic/update-rollup-71-for-azure-site-recovery-kb5035688-4df258c7-7143-43e7-9aa5-afeef9c26e1a) | 9.59.6930.1 | NA | 9.59.6930.1 | NA | NA


[Learn more](service-updates-how-to.md) about update installation and support.

## Updates (October 2024)

### Update Rollup 76

Update [rollup 76](https://support.microsoft.com/topic/update-rollup-76-for-azure-site-recovery-6ca6833a-5b0f-4bdf-9946-41cd0aa8d6e4) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for Debian 11, SLES 12, SLES 15, Ubuntu 22.04 to 18.04 distros, Oracle Linux 9.4, and RHEL 9 Linux distros. 
**VMware VM/physical disaster recovery to Azure** | Added support for Debian 11, SLES 12, SLES 15, Ubuntu 22.04 to 18.04 distros, Oracle Linux 9.4, and RHEL 9 Linux distros.


## Updates (August 2024)

### Update Rollup 75

Update [rollup 75](https://support.microsoft.com/topic/update-rollup-75-for-azure-site-recovery-4884b937-8976-454a-9b80-57e0200eb2ec) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Certificate renewal for VMware to Azure in Modernized Appliances.
**Azure VM disaster recovery** | No improvements added. 
**VMware VM/physical disaster recovery to Azure** | No improvements added. 


## Updates (July 2024)

### Update Rollup 74

[Update rollup 74](https://support.microsoft.com/topic/update-rollup-74-for-azure-site-recovery-584e3586-4c55-4cc2-8b1c-63038b6b4464) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for Debian 11, SLES 12, SLES 15, and RHEL 9 Linux distros. <br><br/> Added capacity reservation support for  Virtual Machine Scale Sets Flex machines protected using Site Recovery.
**VMware VM/physical disaster recovery to Azure** | Added support for Debian 11, SLES 12, SLES 15, and RHEL 9 Linux distros. <br><br/> Added capacity reservation support for  Virtual Machine Scale Sets Flex machines protected using Site Recovery. <br><br/> Added support to enable replication for newly added data disks that are added to a VMware virtual machine, which already has disaster recovery enabled. [Learn more](./vmware-azure-enable-replication-added-disk.md)


## Updates (April 2024)

### Update Rollup 73

[Update rollup 73](https://support.microsoft.com/topic/update-rollup-73-for-azure-site-recovery-d3845f1e-2454-4ae8-b058-c1fec6206698) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for Debian 12 and Ubuntu 18.04 Pro Linux distros. <br><br/> Added capacity reservation support for  Virtual Machine Scale Sets Flex machines protected using Site Recovery.
**VMware VM/physical disaster recovery to Azure** | Added support for Debian 12 and Ubuntu 18.04 Pro Linux distros. <br><br/> Added support to enable replication for newly added data disks that are added to a VMware virtual machine, which already has disaster recovery enabled. [Learn more](./vmware-azure-enable-replication-added-disk.md)

## Updates (February 2024)

### Update Rollup 72

[Update rollup 72](https://support.microsoft.com/topic/update-rollup-72-for-azure-site-recovery-kb5036010-aba602a9-8590-4afe-ac8a-599141ec99a5) provides the following updates:

**Update** | **Details**
--- | ---
**Providers and agents** | Updates to Site Recovery agents and providers as detailed in the rollup KB article.
**Issue fixes/improvements** | Many fixes and improvement as detailed in the rollup KB article.
**Azure VM disaster recovery** | Added support for Oracle Linux 9.2, Oracle Linux 9.3, RHEL 9.2, Rocky Linux 9.0 and Rocky Linux 9.1 Linux distros.
**VMware VM/physical disaster recovery to Azure** |   Added support for Oracle Linux 9.2, Oracle Linux 9.3, RHEL 9.2, Rocky Linux 9.0 and Rocky Linux 9.1 Linux distros. <br><br/> Added support for Windows 11 server. <br><br/> Enabled the proxy bypass capability in the Azure Site Recovery replication appliance. With this, customers can now bypass proxy settings from the Appliance configuration manager. 

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


## Next steps

Keep up-to-date with our updates on the [Azure Updates](https://azure.microsoft.com/updates/?product=site-recovery) page.
