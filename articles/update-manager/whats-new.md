---
title: What's New in Azure Update Manager
description: Learn about what's new and recent updates in the Azure Update Manager service.
ms.service: azure-update-manager
ms.topic: whats-new
author: habibaum
ms.author: v-uhabiba
ms.date: 08/21/2025
# Customer intent: "As a system administrator, I want to understand the latest features of Azure Update Manager, so that I can effectively manage and govern updates across my environments and ensure compliance with security policies."
---

# What's new in Azure Update Manager

[Azure Update Manager](overview.md) helps you manage and govern updates for all your machines. You can monitor Windows and Linux update compliance across your deployments in Azure, on-premises, and on the other cloud platforms from a single dashboard. This article summarizes new releases and features in Update Manager.

## August 2025

General availability: Update Manager now provides enhanced reports with separate views for overall compliance, recommendations, pending updates, update history, schedules, and operation history.

Preview: You can now create quick alerts by using Update Manager. [Learn more](manage-alerts.md).

## November 2024

### Hotpatching (preview) on Azure Arc-enabled machines

Preview: Update Manager now supports hotpatching on Azure Arc-enabled servers. [Learn more](manage-hot-patching-arc-machines.md).

## August 2024

### Support for 35 CIS images added along with 59 other images

Update Manager now supports CIS images along with 59 other popular images. For more information, see the [latest list of supported images](support-matrix-updates.md#custom-images).

### Pre-maintenance and post-maintenance events

General availability: Update Manager now supports creating and managing pre-maintenance and post-maintenance events on scheduled maintenance configurations. [Learn more](pre-post-scripts-overview.md).

## July 2024

### Support for Windows IoT Enterprise on Azure Arc-enabled servers

Preview: Update Manager now supports Windows IoT Enterprise on Azure Arc-enabled servers. For more information, see the [supported Windows IoT Enterprise releases](/azure/update-manager/support-matrix-updates?tabs=mpir-winos%2Cci-win&pivots=win-iot-arc-servers).

## June 2024

### New region support

General availability: Update Manager is now supported in Azure Government and Azure operated by 21Vianet. [Learn more](supported-regions.md).

## May 2024

### Migration portal experience and scripts: Generally available

Update Manager offers a migration portal experience and automated migration scripts to move machines and schedules from Automation Update Management to Update Manager. [Learn more](https://aka.ms/aum-migration-scripts-docs).

### Updates pane in Update Manager: Generally available

The purpose of the new **Updates** pane is to present information from the updates pivot instead of machines. It's useful for central IT admins and security admins who care about vulnerabilities in the system and want to act on them by applying updates. [Learn more](deploy-manage-updates-using-updates-view.md).

## April 2024

### Added support for new VM images

Support for Ubuntu Pro 22.04 Gen1 and Gen2, Red Hat Enterprise Linux 8.8, CentOS-HPC 7.1 and 7.3, and Oracle8 is added. For the latest list of supported virtual machine (VM) images, see the [support matrix](support-matrix.md).

### New region support

Update Manager Preview is now supported in Azure Government and Azure operated by 21Vianet. [Learn more](supported-regions.md).

## February 2024

### Billing enabled for Azure Arc-enabled severs

Billing is enabled for Azure Arc-enabled servers. Update Manager is charged per server on a monthly basis (assuming 31 days of connected usage). It's charged at a daily prorated value. Refer to the [FAQs for pricing](update-manager-faq.md#pricing).

### Migration scripts to move machines and schedules from Automation Update Management to Update Manager Preview

You can use migration scripts to move all machines and schedules in an automation account from Automation Update Management to Update Manager in an automated fashion. [Learn more](guidance-migration-automation-update-management-azure-update-manager.md).

### Updates pane in Update Manager Preview

The purpose of the new **Updates** pane is to present information from the updates pivot instead of machines. It's useful for central IT admins and security admins who care about vulnerabilities in the system and want to act on them by applying updates. [Learn more](deploy-manage-updates-using-updates-view.md).

## December 2023

### Pre-maintenance and post-maintenance events (preview)

You can use Update Manager to create and manage pre-maintenance and post-maintenance events on scheduled maintenance configurations. [Learn more](pre-post-scripts-overview.md).

## November 2023

### Alerting (preview)

You can use Update Manager to enable alerts to address events as captured in update data. [Learn more](manage-alerts.md).

### Azure Local patching

You can use Update Manager to patch an Azure Local instance. [Learn more](/azure-stack/hci/update/azure-update-manager-23h2?toc=/azure/update-manager/toc.json&bc=/azure/update-manager/breadcrumb/toc.json).

## October 2023

### Support for Azure Migrate, Azure Backup, and Azure Site Recovery VMs

Update Manager now supports [specialized](/azure/virtual-machines/linux/imaging#specialized-images) VMs, including the VMs created in Azure Migrate, Azure Backup, and Azure Site Recovery. [Learn more](manage-updates-customized-images.md).

## September 2023

Update Manager is now generally available.

For more information, see [the announcement](https://techcommunity.microsoft.com/t5/azure-governance-and-management/generally-available-azure-update-manager/ba-p/3928878).

## August 2023

### Service rebranding

Update Management Center is now rebranded as Update Manager.

### New region support

Update Manager is now available in the Canada East and Sweden Central regions for Azure Arc-enabled servers. [Learn more](supported-regions.md).

### SQL Server patching

You can now manage and govern updates for all your SQL Server instances by using the patching capabilities in Update Manager. [Learn more](guidance-patching-sql-server-azure-vm.md).

## July 2023

### Dynamic scope

Dynamic scope is an advanced capability of scheduled patching. You can now create a group of [machines based on a schedule and apply patches](dynamic-scope-overview.md) on those machines at scale. [Learn more](tutorial-dynamic-grouping-for-scheduled-patching.md).

## May 2023

### Customized image support

Update Manager now supports [generalized](/azure/virtual-machines/linux/imaging#generalized-images) custom images. It also supports a combination of offer, publisher, and SKU for Platform Image Repository (PIR) images in Azure Marketplace. See the [list of supported operating systems](support-matrix-updates.md#azure-marketplacepir-images).

### Support for multiple subscriptions

The limit on the number of subscriptions that you can manage in the Update Manager portal is now removed. You can now manage all your subscriptions by using the Update Manager portal.

## April 2023

### New prerequisite for scheduled patching

A new patch orchestration, **Customer Managed Schedules (Preview)**, is introduced as a prerequisite to enable scheduled patching on Azure VMs. The new patch enables the **Azure-orchestrated** and **BypassPlatformSafetyChecksOnUserSchedule** VM properties on your behalf after receiving the consent.

> [!IMPORTANT]
> For a seamless experience with scheduled patching, we recommend that for all Azure VMs, you update the patch orchestration to **Customer Managed Schedules (Preview)** by June 30, 2023. If you fail to update the patch orchestration by June 30, 2023, you can experience a disruption in business continuity because the schedules will fail to patch the VMs.

## November 2022

### New region support

Update Manager supports five new regions for Azure Arc-enabled servers. [Learn more](supported-regions.md).

## October 2022

### Improved onboarding experience

You can now enable periodic assessment for your machines at scale by using [Azure Policy](periodic-assessment-at-scale.md) or the [Azure portal](manage-update-settings.md#configure-settings-on-a-single-vm).

## Related content

- [Learn more](support-matrix.md) about supported regions.
