---
title: Updates and maintenance in update management center (preview).
description: The article describes the updates and maintenance options available in Update management center (preview).
ms.service: update-management-center
ms.date: 10/28/2021
ms.topic: conceptual
author: snehasudhirG
ms.author: sudhirsneha
ms.custom: references_regions
---

# Update options in update management center (preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article provides an overview of the various update and maintenance options available by update management center (preview). 

Update management center (preview) provides you the flexibility to take an immediate action or schedule an update within a defined maintenance window. It also supports new patching methods such as automatic VM guest patching, hotpatching and so on.


## Update Now/One-time update

Update management center (preview) allows you to secure your machines immediately by installing updates on demand. To perform the on-demand updates, see [Check and install one time updates](deploy-updates.md#install-updates-on-single-vm).

## Scheduled patching
You can create a schedule on a daily, weekly or hourly cadence as per your requirement, specify the machines that must be updated as part of the schedule, and the updates to be installed. The schedule will then automatically install the updates as per the specifications.

Update management center (preview) uses maintenance control schedule instead of creating its own schedules. Maintenance control enables customers to manage platform updates. For more information, see [Maintenance control documentation](/azure/virtual-machines/maintenance-control). 
Start using [scheduled patching](scheduled-patching.md) to create and save recurring deployment schedules.


## Automatic VM Guest patching in Azure

This mode of patching lets the Azure platform automatically download and install all the security and critical updates on your machines every month and apply them on your machines keeping in mind the availability-first principles. For more information, see [automatic VM guest patching](/azure/virtual-machines/automatic-vm-guest-patching).

This VM property can be enabled by setting the value of Patch orchestration update setting to **Azure Orchestrated/Automatic by Platform** value. 


## Windows automatic updates
<<<<<<< HEAD
This mode of patching allows operating system to automatically install updates as soon as they are available. It is using the VM property that is enabled by setting the patch orchestration to OS orchestrated/Automatic by OS). 
=======
This mode of patching allows operating system to automatically install updates as soon as they are available. It is using the VM property that is enabled by setting the patch orchestration to OS orchestrated/Automatic by OS. 
>>>>>>> 23f9c378022423316bdaad42fc148a34b1826763

## Hotpatching

Hotpatching allows you to install updates on supported Windows Server Azure Edition virtual machines without requiring a reboot after installation. It reduces the number of reboots required on your mission critical application workloads running on Windows Server. 

In your **Update management center (preview)**, hotpatching property is available as an option that you can select from **Machines** > **Update Settings** 

:::image type="content" source="media/updates-maintenance/hot-patch-inline.png" alt-text="Screenshot that shows the hotpatch option." lightbox="media/updates-maintenance/hot-patch-expanded.png":::

For more information, see [configure update settings on your machines](manage-update-settings.md#configure-updates-at-scale).


## Assessment options in update management center (preview)

### Periodic assessment
 
 Periodic assessment is an update setting on machine that allows you to enable automatic periodic checking of updates by update management center (preview). We recommend that you enable this property on your machines as it allows update management center (preview) to fetch latest updates for your machines every 24 hours and enables you to view the latest compliance status of your machines. You can enable this setting using update settings flow as detailed here or enable it at scale by using Policy as documented here.

:::image type="content" source="media/updates-maintenance/periodic-assessment-inline.png" alt-text="Screenshot showing periodic assessment option." lightbox="media/updates-maintenance/periodic-assessment-expanded.png":::

### Check for updates now/On-demand assessment

Update management center (preview) allows you to check for latest updates on your machines at any time, on-demand. You can view the latest update status and act accordingly. Go to **Updates** blade on any VM and Check for updates or select multiple machines from update management center (preview) and check for updates for all machines at once. For more information, see [check and install on-demand updates](quickstart-on-demand.md).


## Next steps

* To view update assessment and deployment logs generated by update management center (preview), see [query logs](query-logs.md).
* To troubleshoot issues, see the [Troubleshoot](troubleshoot.md) update management center (preview).