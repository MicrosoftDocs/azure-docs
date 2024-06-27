---
title: What's new in Azure Update Manager
description: Learn about what's new and recent updates in the Azure Update Manager service.
ms.service: azure-update-manager
ms.topic: overview
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 05/13/2024
---

# What's new in Azure Update Manager

[Azure Update Manager](overview.md) helps you manage and govern updates for all your machines. You can monitor Windows and Linux update compliance across your deployments in Azure, on-premises, and on the other cloud platforms from a single dashboard. This article summarizes new releases and features in Azure Update Manager.

## May 2024

### Migration portal experience and scripts: Generally Available

Azure Update Manager offers migration portal experience and automated migration scripts to move machines and schedules from Automation Update Management to Azure Update Manager. [Learn more](https://aka.ms/aum-migration-scripts-docs)

### Updates blade in Azure Update Manager: Generally Available 

The purpose of this new blade is to present information from Updates pivot instead of machines. It would be useful for Central IT admins, Security admins who care about vulnerabilities in the system and want to act on them by applying updates. [Learn more](deploy-manage-updates-using-updates-view.md).


## April 2024

### Added support for new VM images

Support for ubuntu pro 22.04 gen1 and gen2, redhat 8.8, centos-hpc 7.1 and 7.3, oracle8 has been added. For more information, see [support matrix](support-matrix.md) for the latest list of supported VM images.
 
### New region support

Azure Update Manager (preview) is now supported in US Government and Microsoft Azure operated by 21Vianet. [Learn more](support-matrix.md#supported-regions)


## February 2024

### Billing enabled for Arc-enabled severs 

Billing has been enabled for Arc-enabled servers, starting from February. Azure Update Manager is charged $5/server/month (assuming 31 days of connected usage). It's charged at a daily prorated value. Refer to FAQs for pricing [here](update-manager-faq.md#pricing).

### Migration scripts to move machines and schedules from Automation Update Management to Azure Update Manager (preview)

Migration scripts allow you to move all machines and schedules in an automation account from Automation Update Management to Azure Update Management in an automated fashion. [Learn more](guidance-migration-automation-update-management-azure-update-manager.md).


### Updates blade in Azure Update Manager (preview)

The purpose of this new blade is to present information from Updates pivot instead of machines. It would be useful for Central IT admins, Security admins who care about vulnerabilities in the system and want to act on them by applying updates. [Learn more](deploy-manage-updates-using-updates-view.md).

## December 2023

### Pre and Post Events (preview)

Azure Update Manager allows you to create and manage pre and post events on scheduled maintenance configurations. [Learn more](pre-post-scripts-overview.md).

## November 2023

### Alerting (preview)
Azure Update Manager allows you to enable alerts to address events as captured in updates data. [Learn more](manage-alerts.md).

### Azure Stack HCI patching

Azure Update Manager allows you to patch Azure Stack HCI cluster. [Learn more](/azure-stack/hci/update/azure-update-manager-23h2?toc=/azure/update-manager/toc.json&bc=/azure/update-manager/breadcrumb/toc.json)

## October 2023

### Azure Migrate, Azure Backup, Azure Site Recovery VMs support

Azure Update Manager now supports [specialized](../virtual-machines/linux/imaging.md#specialized-images) VMs including the VMs created by Azure Migrate, Azure Backup, and Azure Site Recovery. [Learn more](manage-updates-customized-images.md).

## September 2023

**Azure Update Manager is now Generally Available**.  

For more information, see [the announcement](https://techcommunity.microsoft.com/t5/azure-governance-and-management/generally-available-azure-update-manager/ba-p/3928878).

## August 2023

### Service rebranding

Update management center is now rebranded as Azure Update Manager.

### New region support

Azure Update Manager is now available in Canada East and Sweden Central regions for Arc-enabled servers. [Learn more](support-matrix.md#supported-regions).

### SQL Server patching

SQL Server patching allows you to patch SQL Servers. You can now manage and govern updates for all your SQL Servers using the patching capabilities provided by Azure Update Manager. [Learn more](guidance-patching-sql-server-azure-vm.md).

## July 2023

### Dynamic scope

Dynamic scope is an advanced capability of schedule patching. You can now create a group of [machines based on a schedule and apply patches](dynamic-scope-overview.md) on those machines at scale. [Learn more](tutorial-dynamic-grouping-for-scheduled-patching.md).
 

## May 2023

### Customized image support

Update Manager now supports [generalized](../virtual-machines/linux/imaging.md#generalized-images) custom images, and a combination of offer, publisher, and SKU for Marketplace/PIR images. See the [list of supported operating systems](support-matrix.md#supported-operating-systems). 

### Multi-subscription support

The limit on the number of subscriptions that you can manage to use the Update Manager portal has now been removed. You can now manage all your subscriptions using the Update Manager portal.

## April 2023

### New prerequisite for scheduled patching

A new patch orchestration - **Customer Managed Schedules (Preview)** is introduced as a prerequisite to enable scheduled patching on Azure VMs. The new patch enables the *Azure-orchestrated* and *BypassPlatformSafteyChecksOnUserSchedule* VM properties on your behalf after receiving the consent. [Learn more](prerequsite-for-schedule-patching.md).

> [!IMPORTANT]
> For a seamless scheduled patching experience, we recommend that for all Azure VMs, you update the patch orchestration to **Customer Managed Schedules (Preview)** by **30th June 2023**. If you fail to update the patch orchestration by **30th June 2023**, you can experience a disruption in business continuity because the schedules will fail to patch the VMs.


## November 2022

### New region support

Update Manager now supports new five regions for Azure Arc-enabled servers. [Learn more](support-matrix.md#supported-regions).

## October 2022

### Improved on-boarding experience

You can now enable periodic assessment for your machines at scale using [Policy](periodic-assessment-at-scale.md) or from the [portal](manage-update-settings.md#configure-settings-on-a-single-vm).


## Next steps

- [Learn more](support-matrix.md) about supported regions.
