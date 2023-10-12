---
title: Configure schedule patching on Azure VMs for business continuity
description: The article describes the new prerequisites to configure scheduled patching to ensure business continuity in Azure Update Manager.
ms.service: azure-update-manager
ms.date: 09/18/2023
ms.topic: conceptual
author: snehasudhirG
ms.author: sudhirsneha
---

# Configure schedule patching on Azure VMs for business continuity

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Azure VMs.

This article is an overview on how to configure schedule patching and automatic guest virtual machine (VM) patching on Azure VMs by using the new prerequisite to ensure business continuity. The steps to configure both the patching options on Azure Arc VMs remain the same.

Currently, you can enable [automatic guest VM patching](../virtual-machines/automatic-vm-guest-patching.md) (autopatch) by setting the patch mode to **Azure-orchestrated** in the Azure portal or **AutomaticByPlatform** in the REST API, where patches are automatically applied during off-peak hours.

For customizing control over your patch installation, you can use [schedule patching](updates-maintenance-schedules.md#scheduled-patching) to define your maintenance window. You can [enable schedule patching](scheduled-patching.md#schedule-recurring-updates-on-a-single-vm) by setting the patch mode to **Azure-orchestrated** in the Azure portal or **AutomaticByPlatform** in the REST API and attaching a schedule to the Azure VM. So, the VM properties couldn't be differentiated between **schedule patching** or **Automatic guest VM patching** because both had the patch mode set to **Azure-orchestrated**.

In some instances, when you remove the schedule from a VM, there's a possibility that the VM might be autopatched and rebooted. To overcome the limitations, we've introduced a new prerequisite, `ByPassPlatformSafetyChecksOnUserSchedule`, which can now be set to `true` to identify a VM by using schedule patching. It means that VMs with this property set to `true` are no longer autopatched when the VMs don't have an associated maintenance configuration.

> [!IMPORTANT]
> For a continued scheduled patching experience, you must ensure that the new VM property, `BypassPlatformSafetyChecksOnUserSchedule`, is enabled on all your Azure VMs (existing or new) that have schedules attached to them by **June 30, 2023**. This setting ensures that machines are patched by using your configured schedules and not autopatched. Failing to enable by June 30, 2023, gives an error that the prerequisites aren't met.

## Schedule patching in an availability set

All VMs in a common [availability set](../virtual-machines/availability-set-overview.md) aren't updated concurrently.

VMs in a common availability set are updated within Update Domain boundaries. VMs across multiple Update Domains aren't updated concurrently.

## Find VMs with associated schedules

To identify the list of VMs with the associated schedules for which you have to enable a new VM property:

1. Go to **Azure Update Manager** home page and select the **Machines** tab.
1. In the **Patch orchestration** filter, select **Azure Managed - Safe Deployment**.
1. Use the **Select all** option to select the machines and then select **Export to CSV**.
1. Open the CSV file and in the column **Associated schedules**, select the rows that have an entry.

   In the corresponding **Name** column, you can view the list of VMs to which you need to enable the `ByPassPlatformSafetyChecksOnUserSchedule` flag.

## Enable schedule patching on Azure VMs

To enable schedule patching on Azure VMs, follow these steps.

# [Azure portal](#tab/new-prereq-portal)

## Prerequisites

Patch orchestration = Customer Managed Schedules

Select the patch orchestration option as **Customer Managed Schedules**. The new patch orchestration option enables the following VM properties on your behalf after receiving your consent:

  - Patch mode = `Azure-orchestrated`
  - `BypassPlatformSafetyChecksOnUserSchedule` = TRUE

### Enable for new VMs

You can select the patch orchestration option for new VMs that would be associated with the schedules.

To update the patch mode:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to **Virtual machine** and select **Create** to open the **Create a virtual machine** page.
1. On the **Basics** tab, fill in all the mandatory fields.
1. On the **Management** tab, under **Guest OS updates**, for **Patch orchestration options**, select **Azure-orchestrated**.
1. Fill in the entries on the **Monitoring**, **Advanced**, and **Tags** tabs.
1. Select **Review + Create**. Select **Create** to create a new VM with the appropriate patch orchestration option.

To schedule patch the newly created VMs, follow the procedure from step 2 in the next section, "Enable for existing VMs."

### Enable for existing VMs

You can update the patch orchestration option for existing VMs that either already have schedules associated or will be newly associated with a schedule.

If **Patch orchestration** is set as **Azure-orchestrated** or **Azure Managed - Safe Deployment (AutomaticByPlatform)**, `BypassPlatformSafetyChecksOnUserSchedule` is set to `false`, and there's no schedule associated, the VMs will be autopatched.

To update the patch mode:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to **Azure Update Manager** and select **Update Settings**.
1. In **Change update settings**, select **Add machine**.
1. In **Select resources**, select your VMs and then select **Add**.
1. On the **Change update settings** pane, under **Patch orchestration**, select **Customer Managed Schedules** and then select **Save**.

Attach a schedule after you finish the preceding steps.

To check if `BypassPlatformSafetyChecksOnUserSchedule` is enabled, go to the **Virtual machine** home page and select **Overview** > **JSON View**.

# [REST API](#tab/new-prereq-rest-api)

## Prerequisites

- Patch mode = `AutomaticByPlatform`
- `BypassPlatformSafetyChecksOnUserSchedule` = TRUE

### Enable on Windows VMs

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

### Enable on Linux VMs

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
> Currently, you can only enable the new prerequisite for schedule patching via the Azure portal and the REST API. It can't be enabled via the Azure CLI or PowerShell.

## Enable automatic guest VM patching on Azure VMs

To enable automatic guest VM patching on your Azure VMs now, follow these steps.

# [Azure portal](#tab/auto-portal)

## Prerequisite

Patch mode = `Azure-orchestrated`

### Enable for new VMs

You can select the patch orchestration option for new VMs that would be associated with the schedules.

To update the patch mode:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to **Virtual machine** and select **Create** to open the **Create a virtual machine** page.
1. On the **Basics** tab, fill in all the mandatory fields.
1. On the **Management** tab, under **Guest OS updates**, for **Patch orchestration options**, select **Azure-orchestrated**.
1. Fill in the entries on the **Monitoring**, **Advanced**, and **Tags** tabs.
1. Select **Review + Create**. Select **Create** to create a new VM with the appropriate patch orchestration option.

### Enable for existing VMs

To update the patch mode:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to **Update Manager** and select **Update settings**.
1. On the **Change update settings** pane, select **Add machine**.
1. On the **Select resources** pane, select your VMs and then select **Add**.
1. On the **Change update settings** pane, under **Patch orchestration**, select **Azure Managed - Safe Deployment** and then select **Save**.

# [REST API](#tab/auto-rest-api)

## Prerequisites

- Patch mode = `AutomaticByPlatform`
- `BypassPlatformSafetyChecksOnUserSchedule` = FALSE

### Enable on Windows VMs

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

### Enable on Linux VMs

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

Scenarios | Azure-orchestrated | BypassPlatformSafetyChecksOnUserSchedule | Schedule associated |Expected behavior in Azure |
--- | --- | --- | --- | ---|
Scenario 1 | Yes | True | Yes | The schedule patch runs as defined by user. |
Scenario 2 | Yes | True | No | Autopatch and schedule patch don't run.|
Scenario 3 | Yes | False | Yes | Autopatch and schedule patch don't run. You get an error that the prerequisites for schedule patch aren't met.|
Scenario 4 | Yes |  False | No   | The VM is autopatched.|
Scenario 5 | No | True | Yes | Autopatch and schedule patch don't run. You get an error that the prerequisites for schedule patch aren't met. |
Scenario 6 | No | True | No | Autopatch and schedule patch don't run.|
Scenario 7 | No | False | Yes | Autopatch and schedule patch don't run. You get an error that the prerequisites for schedule patch aren't met.|
Scenario 8 | No | False | No | Autopatch and schedule patch don't run.|

## Next steps

To troubleshoot issues, see [Troubleshoot Update Manager](troubleshoot.md).
