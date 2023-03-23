---
title: Prerequisites for scheduled patching in update management center (preview).
description: The article describes the new prerequisites to configure scheduled patching in Update management center (preview).
ms.service: update-management-center
ms.date: 03/20/2023
ms.topic: conceptual
author: snehasudhirG
ms.author: sudhirsneha
---

# Prerequisite for Scheduled patching

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure VMs.

This article provides an overview of a new prerequisite for scheduled patching in update management center (preview). 

Currently, for all Azure VMs, to define the schedule patching, you must set the patch orchestration mode as **Azure-orchestrated** if you are configuring from Azure portal and **AutomaticByPlatform** if you are using the REST API. The limitation experienced here is that when you disassociate a VM from a schedule, at times, unexpectedly, the VM is rebooted as the existing prerequisite for schedule patching - patch orchestration mode is set to **Azure-orchestrated**. Therefore, when the patch mode is set and there is no schedule attached to the VM, it is auto-patched.

>![NOTE]
> For Azure-Arc enabled machines, there are no prerequisites needed to enable scheduled patching.

## New prerequisite

To ensure that you don't run the risk of an accidental autopatching and the group of VMs are correctly auto and scheduled patched. A new patch mode is introduced for the schedule patching to set the patch mode as **Azure orchestrated with user managed schedules(Preview)**. 
The patch mode enables the following two VM properties on your behalf after receiving the consent:
- Azure-orchestrated using Automatic guest patching
- BypassPlatformSafetyChecksOnUserSchedule

>[!NOTE]
> - This is applicable only for Azure machines and the changes can be implemented only from the Azure portal by updating the patch mode to *Azure orchestrated with user managed schedules(Preview)*. If you are using other programmatic methods such as  REST API/PowerShell/CLI, we recommend that you enable both the properties separately using the REST API calls/REST commands/cmdlets.

> [!IMPORTANT]
> - For a seamless scheduled patching experience, we recommend that for all Azure VMs, you update the patch mode to *Azure orchestrated with user managed schedules (preview)* before April 30, 2023. If you fail to update the patch mode before April 30, 2023, you can experience a disruption in business continuity because the schedules will fail to patch the VMs. [Learn more](#update-prerequisites-for-scheduled-patching).

## Enable the prerequisite to schedule patch for Azure VMs

# [From Azure portal](#tab/prereq-portal)
To update the patch mode,  follow these steps:

1. Go to **Update management center (Preview)** home page > **Update Settings**. 
1. In **Change update settings**, select **+Add machine**.
1. In **Select resources**, select your VMs and then select **Add**.
1. In **Change update settings**, under **Patch orchestration**, select *Azure orchestrated with user managed schedules (Preview)* and then select **Save**.

# [Using REST API](#tab/prereq-rest-api)

To specify the PUT request, you can use the following Azure REST API call with valid parameters and values. 

```rest
PUT on '/subscriptions/0f55bb56-6089-4c7e-9306-41fb78fc5844/resourceGroups/atscalepatching/providers/Microsoft.Compute/virtualMachines/win-atscalepatching-1/providers/Microsoft.Maintenance/configurationAssignments/TestAzureInGuestAdv?api-version=2021-09-01-preview

{
  "properties": {
    "maintenanceConfigurationId": "/subscriptions/0f55bb56-6089-4c7e-9306-41fb78fc5844/resourcegroups/atscalepatching/providers/Microsoft.Maintenance/maintenanceConfigurations/TestAzureInGuestIntermediate2"
  },
  "location": "eastus2euap"
}'
```
---

## User scenarios

**VMs** | **Azure orchestrated using Automatic guest patching patch mode** | **BypassPlatformSafteyChecksOnUserSchedule** | **Expected behavior in Azure** |
--- | --- | --- | --- |
VM1 | Yes |Yes | If the schedule is associated, then schedule patch runs as defined by user. </br> If the schedule isn't associated, then neither autopatch nor the schedule patch will run.|
VM2 | Yes | No | If schedule is associated, then neither autopatch nor schedule patch will run. You'll get an error that the prerequisites for schedule patch aren't met. </br> If the schedule isn't associated, the VM is autopatched.
VM3 | No | Yes | If the schedule is associated, then neither autopatch not schedule patch will run. You'll get an error that the prerequisites for schedule patch aren't met. </br> If the schedule isn't associated, then neither the autopatch nor the schedule patch will run.
VM4 | No | No | If the schedule is associated, then neither autopatch nor schedule patch will run. You'll get an error that the prerequisites for schedule patch aren't met. </br> If the schedule isn't associated, then neither the autopatch nor the schedule patch will run.

## Next steps

* To troubleshoot issues, see the [Troubleshoot](troubleshoot.md) update management center (preview).