---
title: What's new in Azure Update Manager
description: Learn about what's new and recent updates in the Azure Update Manager service.
ms.service: azure-update-manager
ms.topic: overview
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 09/18/2023
---

# What's new in Azure Update Manager

[Azure Update Manager](overview.md) helps you manage and govern updates for all your machines. You can monitor Windows and Linux update compliance across your deployments in Azure, on-premises, and on the other cloud platforms from a single dashboard. This article summarizes new releases and features in Azure Update Manager.

## October 2023

### Azure Migrate, Azure Backup, Azure Site Recovery VMs support (preview)

Azure Update Manager now supports scheduled patching and periodic assessment for [specialized](../virtual-machines/linux/imaging.md#specialized-images) VMs including the VMs created by Azure Migrate, Azure Backup, and Azure Site Recovery in preview.

## September 2023

**Azure Update Manager is now Generally Available**.  

For more information, see [the announcement](https://techcommunity.microsoft.com/t5/azure-governance-and-management/generally-available-azure-update-manager/ba-p/3928878).

## August 2023

### Service rebranding

Update management center is now rebranded as Azure Update Manager.

### New region support

Azure Update Manager is now available in Canada East and Sweden Central regions for Arc-enabled servers. [Learn more](support-matrix.md#supported-regions).

### SQL Server patching (preview)

SQL Server patching (preview) allows you to patch SQL Servers. You can now manage and govern updates for all your SQL Servers using the patching capabilities provided by Azure Update Manager. [Learn more](guidance-patching-sql-server-azure-vm.md).

## July 2023

### Dynamic scope

Dynamic scope is an advanced capability of schedule patching. You can now create a group of [machines based on a schedule and apply patches](dynamic-scope-overview.md) on those machines at scale. [Learn more](tutorial-dynamic-grouping-for-scheduled-patching.md).
 

## May 2023

### Customized image support

Update Manager now supports [generalized](../virtual-machines/linux/imaging.md#generalized-images) custom images, and a combination of offer, publisher, and SKU for Marketplace/PIR images.See the [list of supported operating systems](support-matrix.md#supported-operating-systems). 

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