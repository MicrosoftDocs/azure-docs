---
title: Configure scheduled patching on Azure VMs for business continuity
description: The article describes the new prerequisites to configure scheduled patching to ensure business continuity in Azure Update Manager.
ms.service: azure-update-manager
ms.custom: devx-track-azurepowershell
ms.date: 12/03/2024
ms.topic: how-to
author: snehasudhirG
ms.author: sudhirsneha
---

# Configure scheduled patching on Azure VMs for business continuity

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Azure VMs.

This article is an overview on how to configure scheduled patching and automatic guest virtual machine (VM) patching on Azure VMs by using the new prerequisite to ensure business continuity. The steps to configure both the patching options on Azure Arc VMs remain the same.

Currently, you can enable [automatic guest VM patching](/azure/virtual-machines/automatic-vm-guest-patching) (autopatch) by setting the patch mode to **Azure-orchestrated** in the Azure portal or **AutomaticByPlatform** in the REST API, where patches are automatically applied during off-peak hours.

For customizing control over your patch installation, you can use [scheduled patching](updates-maintenance-schedules.md#scheduled-patching) to define your maintenance window. You can [enable scheduled patching](scheduled-patching.md#schedule-recurring-updates-on-a-single-vm) by setting the patch mode to **Azure-orchestrated** in the Azure portal or **AutomaticByPlatform** in the REST API and attaching a scheduled to the Azure VM. So, the VM properties couldn't be differentiated between **scheduled patching** or **Automatic guest VM patching** because both had the patch mode set to **Azure-orchestrated**.

In some instances, when you remove the scheduled from a VM, there's a possibility that the VM might be autopatched and rebooted. To overcome the limitations, we've introduced a new prerequisite, `ByPassPlatformSafetyChecksOnUserSchedule`, which can now be set to `true` to identify a VM by using scheduled patching. It means that VMs with this property set to `true` are no longer autopatched when the VMs don't have an associated maintenance configuration.

> [!IMPORTANT]
> For a continued scheduled patching experience, you must ensure that the new VM property, `BypassPlatformSafetyChecksOnUserSchedule`, is enabled on all your Azure VMs (existing or new) that have schedules attached to them by **June 30, 2023**. This setting ensures that machines are patched by using your configured schedules and not autopatched. Failing to enable by June 30, 2023, gives an error that the prerequisites aren't met.

## Scheduled patching in an availability set

All VMs in a common [availability set](/azure/virtual-machines/availability-set-overview) aren't updated concurrently.

VMs in a common availability set are updated within Update Domain boundaries. VMs across multiple Update Domains aren't updated concurrently. 

In scenarios where machines from the same availability set are being patched at the same time in different schedules, it is likely that they might not get patched or could potentially fail if the maintenance window exceeds. To avoid this, we recommend that you either increase the maintenance window or split the machines belonging to the same availability set across multiple schedules at different times. 

## Find VMs with associated schedules

To identify the list of VMs with the associated schedules for which you have to enable a new VM property:

1. Go to **Azure Update Manager** home page and select the **Machines** tab.
1. In the **Patch orchestration** filter, select **Azure Managed - Safe Deployment**.
1. Use the **Select all** option to select the machines and then select **Export to CSV**.
1. Open the CSV file and in the column **Associated schedules**, select the rows that have an entry.

   In the corresponding **Name** column, you can view the list of VMs to which you need to enable the `ByPassPlatformSafetyChecksOnUserSchedule` flag.

## Enable scheduled patching on Azure VMs

To enable scheduled patching on Azure VMs, follow these steps.

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
# [PowerShell](#tab/new-prereq-powershell)

## Prerequisites

- Patch mode = `AutomaticByPlatform`
- `BypassPlatformSafetyChecksOnUserSchedule` = TRUE

### Enable on Windows VMs

```powershell-interactive
$VirtualMachine = Get-AzVM -ResourceGroupName "<resourceGroup>" -Name "<vmName>"
Set-AzVMOperatingSystem -VM $VirtualMachine -Windows -PatchMode "AutomaticByPlatform"
$AutomaticByPlatformSettings = $VirtualMachine.OSProfile.WindowsConfiguration.PatchSettings.AutomaticByPlatformSettings
 
if ($null -eq $AutomaticByPlatformSettings) {
   $VirtualMachine.OSProfile.WindowsConfiguration.PatchSettings.AutomaticByPlatformSettings = New-Object -TypeName Microsoft.Azure.Management.Compute.Models.WindowsVMGuestPatchAutomaticByPlatformSettings -Property @{BypassPlatformSafetyChecksOnUserSchedule = $true}
} else {
   $AutomaticByPlatformSettings.BypassPlatformSafetyChecksOnUserSchedule = $true
}
 
Update-AzVM -VM $VirtualMachine -ResourceGroupName "<resourceGroup>"
```
### Enable on Linux VMs

```powershell-interactive
$VirtualMachine = Get-AzVM -ResourceGroupName "<resourceGroup>" -Name "<vmName>"
Set-AzVMOperatingSystem -VM $VirtualMachine -Linux -PatchMode "AutomaticByPlatform"
$AutomaticByPlatformSettings = $VirtualMachine.OSProfile.LinuxConfiguration.PatchSettings.AutomaticByPlatformSettings
 
if ($null -eq $AutomaticByPlatformSettings) {
   $VirtualMachine.OSProfile.LinuxConfiguration.PatchSettings.AutomaticByPlatformSettings = New-Object -TypeName Microsoft.Azure.Management.Compute.Models.LinuxVMGuestPatchAutomaticByPlatformSettings -Property @{BypassPlatformSafetyChecksOnUserSchedule = $true}
} else {
   $AutomaticByPlatformSettings.BypassPlatformSafetyChecksOnUserSchedule = $true
}
 
Update-AzVM -VM $VirtualMachine -ResourceGroupName "<resourceGroup>"
```
---

> [!NOTE]
> You can now enable the new prerequisite for scheduled patching via the Azure portal, REST API, PowerShell and Azure CLI.

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
Scenario 1 | Yes | True | Yes | The scheduled patch runs as defined by user. |
Scenario 2 | Yes | True | No | Autopatch and scheduled patch don't run.|
Scenario 3 | Yes | False | Yes | Autopatch and scheduled patch don't run. You get an error that the prerequisites for scheduled patch aren't met.|
Scenario 4 | Yes |  False | No   | The VM is autopatched.|
Scenario 5 | No | True | Yes | Autopatch and schedule patch don't run. You get an error that the prerequisites for scheduled patch aren't met. |
Scenario 6 | No | True | No | Autopatch and scheduled patch don't run.|
Scenario 7 | No | False | Yes | Autopatch and scheduled patch don't run. You get an error that the prerequisites for scheduled patch aren't met.|
Scenario 8 | No | False | No | Autopatch and scheduled patch don't run.|

## Next steps

- Learn more about [Dynamic scope](dynamic-scope-overview.md), an advanced capability of scheduled patching.
- Follow the instructions on how to [manage various operations of Dynamic scope](manage-dynamic-scoping.md)
- Learn on how to [automatically installs the updates according to the created schedule both for a single VM and at scale](scheduled-patching.md).
- Learn about [pre and post events](pre-post-scripts-overview.md) to automatically perform tasks before and after a scheduled maintenance configuration.

