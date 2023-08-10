---
title: Configure schedule patching on Azure VMs to ensure business continuity in update management center (preview).
description: The article describes the new prerequisites to configure scheduled patching to ensure business continuity in Update management center (preview).
ms.service: update-management-center
ms.date: 05/09/2023
ms.topic: conceptual
author: snehasudhirG
ms.author: sudhirsneha
---

# Configure schedule patching on Azure VMs to ensure business continuity

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Azure VMs.

This article is an overview on how to configure Schedule patching and Automatic guest VM patching on Azure VMs using the new prerequisite to ensure business continuity. The steps to configure both the patching options on Arc VMs remain the same.

Currently, you can enable [Automatic guest VM patching](../virtual-machines/automatic-vm-guest-patching.md) (Autopatch) by setting the patch mode to **Azure-orchestrated**/**AutomaticByPlatform** on Azure portal/REST API respectively, where patches are automatically applied during off-peak hours.

For customizing control over your patch installation, you can use [schedule patching](updates-maintenance-schedules.md#scheduled-patching) to define your maintenance window. You can [enable schedule patching](scheduled-patching.md#schedule-recurring-updates-on-single-vm) by setting the patch mode to **Azure orchestrated**/**AutomaticByPlatform** and attaching a schedule to the Azure VM. So, the VM properties couldn't be differentiated between **schedule patching** or **Automatic guest VM patching** as both had the patch mode set to *Azure-Orchestrated*. 

Additionally, in some instances, when you remove the schedule from a VM, there is a possibility that the VM may be auto patched and rebooted. To overcome the limitations, we have introduced a new prerequisite - **ByPassPlatformSafetyChecksOnUserSchedule**, which can now be set to *true* to identify a VM using schedule patching. It means that VMs with this property set to *true* will no longer be auto patched when the VMs don't have an associated maintenance configuration.

> [!IMPORTANT]
> For a continued scheduled patching experience, you must ensure that the new VM property, *BypassPlatformSafetyChecksOnUserSchedule*, is enabled on all your Azure VMs (existing or new) that have schedules attached to them by **30th June 2023**. This setting will ensure machines are patched using your configured schedules and not auto patched. Failing to enable by **30th June 2023** will give an error that the prerequisites aren't met.

## Schedule patching in an availability set

1. All VMs in a common [availability set](../virtual-machines/availability-set-overview.md) aren't updated concurrently.
1. VMs in a common availability set are updated within Update Domain boundaries and, VMs across multiple Update Domains aren't updated concurrently.

## Find VMs with associated schedules

To identify the list of VMs with the associated schedules for which you have to enable new VM property, follow these steps:

1. Go to **Update management center (Preview)** home page and select **Machines** tab.
1. In **Patch orchestration** filter, select **Azure Managed - Safe Deployment**.
1. Use the **Select all** option to select the machines and then select **Export to CSV**.
1. Open the CSV file and in the column **Associated schedules**,  select the rows that have an entry. 
   
    In the corresponding **Name** column, you can view the list the VMs to which you would need to enable the **ByPassPlatformSafetyChecksOnUserSchedule** flag.


## Enable schedule patching on Azure VMs

# [Azure portal](#tab/new-prereq-portal)

**Prerequisite**

Patch orchestration = Customer Managed Schedules.

Select the patch orchestration option as **Customer Managed Schedules**.
The new patch orchestration option enables the following VM properties on your behalf after receiving your consent:

  - Patch mode = Azure-orchestrated
  - BypassPlatformSafetyChecksOnUserSchedule = TRUE

**Enable for new VMs**

You can select the patch orchestration option for new VMs that would be associated with the schedules:

To update the patch mode, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to **Virtual machine**, and select **+Create** to open *Create a virtual machine* page.
1. In **Basics** tab, complete all the mandatory fields.
1. In **Management** tab, under **Guest OS updates**, for **Patch orchestration options**, select *Azure-orchestrated*.
1. After you complete the entries in **Monitoring**, **Advanced** and **Tags** tabs.
1. Select **Review + Create** and select **Create** to create a new VM with the appropriate patch orchestration option.

To schedule patch the newly created VMs, follow the procedure from step 2 in **Enable for existing VMs**.


**Enable for existing VMs**

You can update the patch orchestration option for existing VMs that either already have schedules associated or are to be newly associated with a schedule:  

> [!NOTE]
> If the **Patch orchestration** is set as *Azure-orchestrated or *Azure Managed - Safe Deployment* (AutomaticByPlatform)*, the **BypassPlatformSafetyChecksOnUserSchedule** is set to *False* and there is no schedule associated, the VM(s) will be autopatched.

To update the patch mode, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to **Update management center (Preview)**, select **Update Settings**.    
1. In **Change update settings**, select **+Add machine**.
1. In **Select resources**, select your VMs and then select **Add**.
1. In **Change update settings**, under **Patch orchestration**, select *Customer Managed Schedules* and then select **Save**.

Attach a schedule after you complete the above steps.

To check if the **BypassPlatformSafetyChecksOnUserSchedule** is enabled, go to **Virtual machine** home page > **Overview** tab > **JSON View**.

# [REST API](#tab/new-prereq-rest-api)

**Prerequisite**

- Patch mode = AutomaticByPlatform
- BypassPlatformSafetyChecksOnUserSchedule = TRUE 

**Enable on Windows VMs**

```
PATCH on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVirtualMachine?api-version=2023-03-01` 
```

```json
{ 
  "location":"<location>", 
  "properties": { 
    "osProfile": { 
      "windowsConfiguration": { 
        "provisionVMAgent": true, 
        "enableAutomaticUpdates": true, 
        "patchSettings": { 
          "patchMode": "AutomaticByPlatform", 
          "automaticByPlatformSettings":{ 
            "bypassPlatformSafetyChecksOnUserSchedule":true 
          } 
        } 
      } 
    } 
  } 
} 

```
**Enable on Linux VMs**

```
PATCH on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVirtualMachine?api-version=2023-03-01` 
```

```json
{ 

  "location":"<location>", 
  "properties": { 
    "osProfile": { 
      "linuxConfiguration": { 
        "provisionVMAgent": true, 
         "patchSettings": { 
           "patchMode": "AutomaticByPlatform", 
           "automaticByPlatformSettings":{ 
             "bypassPlatformSafetyChecksOnUserSchedule":true 
            } 
         } 
      } 
    } 
  } 
} 
```
---

> [!NOTE]
> Currently, you can only enable the new prerequisite for schedule patching via Azure portal and REST API. It cannot be enabled via Azure CLI and PowerShell.


## Enable automatic guest VM patching on Azure VMs

To enable automatic guest VM patching on your Azure VMs now, follow these steps:

# [Azure portal](#tab/auto-portal)

**Prerequisite**

Patch mode = Azure-orchestrated

**Enable for new VMs**

You can select the patch orchestration option for new VMs that would be associated with the schedules:

To update the patch mode, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to **Virtual machine**, and select **+Create** to open *Create a virtual machine* page.
1. In **Basics** tab, complete all the mandatory fields.
1. In **Management** tab, under **Guest OS updates**, for **Patch orchestration options**, select *Azure-orchestrated*.
1. After you complete the entries in **Monitoring**, **Advanced** and **Tags** tabs.
1. Select **Review + Create** and select **Create** to create a new VM with the appropriate patch orchestration option.


**Enable for existing VMs**

To update the patch mode, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to **Update management center (Preview)**, select **Update Settings**. 
1. In **Change update settings**, select **+Add machine**.
1. In **Select resources**, select your VMs and then select **Add**.
1. In **Change update settings**, under **Patch orchestration**, select ***Azure Managed - Safe Deployment*** and then select **Save**.


# [REST API](#tab/auto-rest-api)

**Prerequisites**

- Patch mode = AutomaticByPlatform
- BypassPlatformSafetyChecksOnUserSchedule = FALSE

**Enable on Windows VMs**

```
PATCH on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVirtualMachine?api-version=2023-03-01` 
```

```json
{ 

  "location":"<location>", 
  "properties": { 
    "osProfile": { 
      "windowsConfiguration": { 
        "provisionVMAgent": true, 
        "enableAutomaticUpdates": true, 
        "patchSettings": { 
          "patchMode": "AutomaticByPlatform", 
          "automaticByPlatformSettings":{ 
            "bypassPlatformSafetyChecksOnUserSchedule":false 
          } 
        } 
      } 
    } 
  } 
} 
```

**Enable on Linux VMs**

```
PATCH on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVirtualMachine?api-version=2023-03-01` 
```

```json
{ 
  "location":"<location>", 
  "properties": { 
    "osProfile": { 
      "linuxConfiguration": { 
        "provisionVMAgent": true,  
        "patchSettings": { 
          "patchMode": "AutomaticByPlatform", 
          "automaticByPlatformSettings":{ 
            "bypassPlatformSafetyChecksOnUserSchedule":false 
          } 
        } 
      } 
    } 
  } 
} 
```
---


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