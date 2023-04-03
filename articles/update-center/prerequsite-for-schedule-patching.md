---
title: Prerequisites for scheduled patching in update management center (preview).
description: The article describes the new prerequisites to configure scheduled patching in Update management center (preview).
ms.service: update-management-center
ms.date: 03/30/2023
ms.topic: conceptual
author: snehasudhirG
ms.author: sudhirsneha
---

# Change in requirements for Schedule patching

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure VMs.

This article provides an overview of a new prerequisite for schedule patching in update management center (preview). 

Currently, for Azure VMs, to define the schedule patching, you must set the patch orchestration mode as **Azure-orchestrated** if you're configuring from Azure portal, and **AutomaticByPlatform** if you're using the REST API. In Portal and REST API, you should have a schedule associated with the VM for the schedule patching to run. If the schedule isn't associated, then the machine may get autopatched. [Learn more](../virtual-machines/automatic-vm-guest-patching.md).

To avoid accidental or unintentional patching when a VM is disassociated from a schedule, a new property is introduced as a prerequisite to enable schedule patching on Azure VMs.  

## New prerequisite

The new VM property - *BypassPlatformSafetyChecksOnUserSchedule* is introduced, allowing a complete control over your patching requirements. It implies that you can have a more reliable way to select the VMs that must be autopatched and schedule patched, removing the risk of accidental autopatching.

Here, when the patch mode is set to **Azure-orchestrated**, **BypassPlatformSafetyChecksOnUserSchedule = True**, and no schedule is associated, your VM won't get autopatched.

To enable schedule patching on your VMs now, follow these steps:
  

# [Azure portal](#tab/new-prereq-portal)

**Patch orchestration = Azure-orchestrated with user managed schedules (Preview)**.

The new patch orchestration option enables the following VM properties on your behalf after receiving your consent:

- Patch mode = Azure-orchestrated
- BypassPlatformSafetyChecksOnUserSchedule = TRUE


# [REST API](#tab/new-prereq-rest-api)

- Patch mode = AutomaticByPlatform
- BypassPlatformSafetyChecksOnUserSchedule = TRUE 

--- 

The above settings will do the following:

- **Patch Orchestration** set to **Azure-orchestrated** enables Auto patching on the VM. [Learn more](../virtual-machines/automatic-vm-guest-patching.md).
- Setting the **BypassPlatformSafetyChecksOnUserSchedule** to **True** ensures that even if the schedule is removed from the VM, your VM won't be autopatched.

> [!NOTE]
> - This prerequisite is applicable only for Azure VMs. 
> - For Azure Arc-enabled VMs, there are no prerequisites to enable scheduled patching. The process to configure the schedules on Azure Arc-enabled servers continues to remain the same.
> - For other programmatic methods such as REST API/PowerShell/CLI, we recommend that you enable both the properties using the REST API calls/REST commands/cmdlets.

> [!IMPORTANT]
> For a seamless scheduled patching experience, we recommend that for all Azure VMs, you update the patch orchestration option to *Azure orchestrated with user managed schedules (preview)* before April 30, 2023. If you fail to update the patch orchestration option before April 30, 2023, you can experience a disruption in business continuity because the schedules will fail to patch the VMs.

## Enable the prerequisite to schedule patch for Azure VMs

Currently, you can enable the prerequisite to schedule patch from Azure portal and by using REST API.

# [Azure portal](#tab/prereq-portal)

To update the patch mode,  follow these steps:

1. Go to **Update management center (Preview)**, select **Update Settings**. 
1. In **Change update settings**, select **+Add machine**.
1. In **Select resources**, select your VMs and then select **Add**.
1. In **Change update settings**, under **Patch orchestration**, select *Azure orchestrated with user managed schedules (Preview)* and then select **Save**.


# [REST API](#tab/prereq-rest-api)

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

> [!NOTE]
> Currently, you can only enable the new prerequisite for schedule patching via Azure portal and REST API. It cannot be enabled via Azure CLI and PowerShell.

## User scenarios

**Scenarios** | **Azure-orchestrated** | **BypassPlatformSafetyChecksOnUserSchedule** | **Schedule Associated** |**Expected behavior in Azure** |
--- | --- | --- | --- | ---|
Scenario 1 | Yes | True | Yes | The schedule patch runs as defined by user. |
Scenario 2 | Yes | True | No | Neither autopatch nor the schedule patch will run.|
Scenario 3 | Yes | False | Yes | Neither autopatch nor schedule patch will run. You'll get an error that the prerequisites for schedule patch aren't met.| 
Scenario 4 | Yes |  False | No   | The VM is autopatched.|
Scenario 5 | No | True | Yes | Neither autopatch nor schedule patch will run. You'll get an error that the prerequisites for schedule patch aren't met. |
Scenario 6 | No | True | No | Neither the autopatch nor the schedule patch will run.|
Scenario 7 | No | False | Yes | Neither autopatch nor schedule patch will run. You'll get an error that the prerequisites for schedule patch aren't met.| 
Scenario 8 | No | False | No | Neither the autopatch nor the schedule patch will run.|

## Next steps

* To troubleshoot issues, see the [Troubleshoot](troubleshoot.md) update management center (preview).