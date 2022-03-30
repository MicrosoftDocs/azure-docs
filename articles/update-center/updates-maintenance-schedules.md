---
title: Updates and maintenance in Update management center (preview).
description: The article describes the updates and maintenance options available in Update management center (preview).
ms.service: update-management-center
ms.date: 10/28/2021
ms.topic: conceptual
author: SGSneha
ms.author: v-ssudhir
ms.custom: references_regions
---

# Updates and maintenance schedule overview

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article provides an overview of the various update options supported by Update Management center for your Windows Server and Linux machines in Azure on-premises environments, and in other cloud environments connected using Azure Arc-enabled servers. The various options are:

- **Scheduled patching** — schedules the update deployment on all configured machines and servers.
- **Patch orchestration** — Azure platform orchestrates updates for a group of virtual machines across regions, within a region and within a availability set.
- **Hot patching** — a latest feature that allows you install updates without the need to reboot after installation.
- **Periodic assessment** — integrates with Azure Monitor logs to store update assessments and deployments for all machines.

## Scheduled patching
You can create a schedule on a daily, weekly or hourly cadence as per your requirement, specify the machines that must be updated as part of the schedule, and the updates to be installed. The schedule will then automatically install the updates as per the specification in the schedule.

Update management center (preview) uses Maintenance control schedule instead of using creating its own schedules. Maintenance control enables customers to manage platform updates. For more info, refer to [Maintenance control documentation](/azure/virtual-machines/maintenance-control).

### Supported geographies

Update management center (preview) **scheduled patching** feature is currently supported in the below regions and it implies that your VM must be in one of the following regions:

**Geography** | **Supported regions**
--- | ---
United States | South Central US </br> West Central US
Europe | North Europe
Australia | Australia East
United Kingdom | UK South
Asia | Southeast Asia

### Prerequisites

In addition to the [Prerequisites for Update management center (preview)](./overview.md#prerequisites), scheduled patching as a feature has the below extra prerequisites:
- Patch orchestration of the Azure machines should be set to **Azure Orchestrated (Automatic By Platform)**. For Arc machines, it isn't a requirement.

> [!Note]
> If you set the Patch Orchestration mode to Azure Orchestrated (Automatic By Platform) but haven't attached a maintenance configuration to an Azure machine, it will be treated as [Automatic Guest patching](/azure/virtual-machines/automatic-vm-guest-patching) enabled machine and Azure platform will automatically install updates as per its own schedule.

- The maintenance configuration's subscription and the subscriptions of all VMs assigned to the maintenance configuration must be allowlisted with feature flag **Microsoft.Compute/InGuestScheduledPatchVMPreview**
- For Azure machine, customer must keep it **running for at least 40 minutes** after enabling **Azure Orchestrated (Automatic By Platform)** patch orchestration mode. For Arc-enabled servers, machine must have been in running state at least for last 40 minutes.

### Check your scheduled patching run
You can check the deployment status and history of your maintenance configuration runs from the Update management center portal. Follow [Update deployment history by maintenance run ID](./manage-multiple-machines.md#update-deployment-history-by-maintenance-run-id).

:::image type="content" source="media/updates-maintenance/scheduled-patching-inline.png" alt-text="Screenshot showing the schedule updates option." lightbox="media/updates-maintenance/scheduled-patching-expanded.png":::

### Limitations and known issues

The following are some of the known issues and limitations of scheduled patching:

- For concurrent/conflicting schedule, only one schedule will be triggered. Even if triggered schedule finishes before the end of the maintenance window, the other schedule won't be triggered. Customer must choose start time for the second schedule to be a time later than the end time of the maintenance window of first schedule.
-  If customer removes the patch mode AutomaticByPlatform after the configure assignment, then machine will be skipped and deployment will be marked as failed with no error message.
- If no install patches API call was successful, then deployment will be marked as failure with no error message.
	Some possible reasons for install patches API call failure -
	- Some patch operation was already going on, on the machine (assess/install patches)
	- Patch orchestration mode was changed to an option other than Azure Orchestrated/AutomaticByPlatform
	- Concurrent schedule but in this case the later triggered schedule will be marked as Succeeded.
	- Machine skipped because of availability set guarantees for Azure VMs
	- Invalid input configuration
	- Machine isn't in running state.
	- Customer must keep at least 40 minutes the Azure and Arc machine in running state if machine is newly created. If machine isn't newly created, then it must have been in running state in the past for at least 40 minutes.
- For Azure machine, customer must keep it **running for at least 40 minutes** after enabling **Azure Orchestrated (Automatic By Platform)** patch orchestration mode. For Arc-enabled servers, machine must have been in running state at least for last 40 minutes.

### Types of workloads

**Workloads** | **Supported regions**
--- | ---
Azure Arc-enabled servers | 
VM | 


## Patch orchestration

Patches are classified as **Critical** or **Security**. They are automatically downloaded and applied on to virtual machine. The patch orchestration is managed by Azure and patches are applied by following the [availability-first principles](/azure/virtual-machines/automatic-vm-guest-patching#availability-first-updates)

:::image type="content" source="media/updates-maintenance/patch-orchestration-inline.png" alt-text="Screenshot showing the patch orchestration option." lightbox="media/updates-maintenance/patch-orchestration-expanded.png":::

## Hot patching

Hot patching allows you to install updates on supported Windows Server Azure Edition virtual machines without requiring a reboot after installation. It drastically increases the uptime of your mission critical application workloads running on Windows Server. For more information, see [Hotpatch for new virtual machines](/azure/automanage/automanage-hotpatch?)

In your **Update management center (preview)**, select the machine and go to **Update settings** to configure Hot patching.

:::image type="content" source="media/updates-maintenance/hot-patch-inline.png" alt-text="Screenshot showing the hot patch option." lightbox="media/updates-maintenance/hot-patch-expanded.png":::

## Periodic assessment

 The machines assigned to Update management center (preview) report how up to date they are based on what source they are configured to synchronize with. Windows machines need to be configured to report to either [Windows Server Update Services](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus) or [Microsoft Update](https://www.update.microsoft.com), and Linux machines need to be configured to report to a local or public repository. 

:::image type="content" source="media/updates-maintenance/periodic-assessment-inline.png" alt-text="Screenshot showing periodic assessment option." lightbox="media/updates-maintenance/periodic-assessment-expanded.png":::

## Next steps

* To view update assessment and deployment logs generated by update management center (preview), see [query logs](query-logs.md).
* To troubleshoot issues, see the [Troubleshoot](troubleshoot.md) update management center (preview).
