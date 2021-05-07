---
title: Automatic VM Guest Patching for Azure VMs
description: Learn how to automatically patch virtual machines in Azure.
author: mayanknayar
ms.service: virtual-machines
ms.subservice: automatic-guest-patching
ms.collection: windows
ms.workload: infrastructure
ms.topic: how-to
ms.date: 02/17/2021
ms.author: manayar

---
# Preview: Automatic VM guest patching for Azure VMs

Enabling automatic VM guest patching for your Azure VMs helps ease update management by safely and automatically patching virtual machines to maintain security compliance.

Automatic VM guest patching has the following characteristics:
- Patches classified as *Critical* or *Security* are automatically downloaded and applied on the VM.
- Patches are applied during off-peak hours in the VM's time zone.
- Patch orchestration is managed by Azure and patches are applied following [availability-first principles](#availability-first-patching).
- Virtual machine health, as determined through platform health signals, is monitored to detect patching failures.
- Works for all VM sizes.

> [!IMPORTANT]
> Automatic VM guest patching is currently in Public Preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How does automatic VM guest patching work?

If automatic VM guest patching is enabled on a VM, then the available *Critical* and *Security* patches are downloaded and applied automatically on the VM. This process kicks off automatically every month when new patches are released. Patch assessment and installation are automatic, and the process includes rebooting the VM as required.

The VM is assessed periodically every few days and multiple times within any 30-day period to determine the applicable patches for that VM. The patches can be installed any day on the VM during off-peak hours for the VM. This automatic assessment ensures that any missing patches are discovered at the earliest possible opportunity.

Patches are installed within 30 days of the monthly patch releases, following availability-first orchestration described below. Patches are installed only during off-peak hours for the VM, depending on the time zone of the VM. The VM must be running during the off-peak hours for patches to be automatically installed. If a VM is powered off during a periodic assessment, the VM will be automatically assessed and applicable patches will be installed automatically during the next periodic assessment (usually within a few days) when the VM is powered on.

Definition updates and other patches not classified as *Critical* or *Security* will not be installed through automatic VM guest patching. To install patches with other patch classifications or schedule patch installation within your own custom maintenance window, you can use [Update Management](./windows/tutorial-config-management.md#manage-windows-updates).

### Availability-first patching

The patch installation process is orchestrated globally by Azure for all VMs that have automatic VM guest patching enabled. This orchestration follows availability-first principles across different levels of availability provided by Azure.

For a group of virtual machines undergoing an update, the Azure platform will orchestrate updates:

**Across regions:**
- A monthly update is orchestrated across Azure globally in a phased manner to prevent global deployment failures.
- A phase can have one or more regions, and an update moves to the next phases only if eligible VMs in a phase update successfully.
- Geo-paired regions are not updated concurrently and can't be in the same regional phase.
- The success of an update is measured by tracking the VM’s health post update. VM Health is tracked through platform health indicators for the VM.

**Within a region:**
- VMs in different Availability Zones are not updated concurrently.
- VMs not part of an availability set are batched on a best effort basis to avoid concurrent updates for all VMs in a subscription.

**Within an availability set:**
- All VMs in a common availability set are not updated concurrently.
-	VMs in a common availability set are updated within Update Domain boundaries and VMs across multiple Update Domains are not updated concurrently.

The patch installation date for a given VM may vary month-to-month, as a specific VM may be picked up in a different batch between monthly patching cycles.

### Which patches are installed?
The patches installed depend on the rollout stage for the VM. Every month, a new global rollout is started where all security and critical patches assessed for an individual VM are installed for that VM. The rollout is orchestrated across all Azure regions in batches (described in the availability-first patching section above).

The exact set of patches to be installed vary based on the VM configuration, including OS type, and assessment timing. It is possible for two identical VMs in different regions to get different patches installed if there are more or less patches available when the patch orchestration reaches different regions at different times. Similarly, but less frequently, VMs within the same region but assessed at different times (due to different Availability Zone or Availability Set batches) might get different patches.

As the Automatic VM Guest Patching does not configure the patch source, two similar VMs configured to different patch sources, such as public repository vs private repository, may also see a difference in the exact set of patches installed.

For OS types that release patches on a fixed cadence, VMs configured to the public repository for the OS can expect to receive the same set of patches across the different rollout phases in a month. For example, Windows VMs configured to the public Windows Update repository.

As a new rollout is triggered every month, a VM will receive at least one patch rollout every month if the VM is powered on during off-peak hours. This ensures that the VM is patched with the latest available security and critical patches on a monthly basis. To ensure consistency in the set of patches installed, you can configure your VMs to assess and download patches from your own private repositories.

## Supported OS images
Only VMs created from certain OS platform images are currently supported in the preview. Custom images are currently not supported in the preview.

The following platform SKUs are currently supported (and more are added periodically):

| Publisher               | OS Offer      |  Sku               |
|-------------------------|---------------|--------------------|
| Canonical  | UbuntuServer | 18.04-LTS |
| Redhat  | RHEL | 7.x |
| MicrosoftWindowsServer  | WindowsServer | 2012-R2-Datacenter |
| MicrosoftWindowsServer  | WindowsServer | 2016-Datacenter    |
| MicrosoftWindowsServer  | WindowsServer | 2016-Datacenter-Server-Core |
| MicrosoftWindowsServer  | WindowsServer | 2019-Datacenter |
| MicrosoftWindowsServer  | WindowsServer | 2019-Datacenter-Core |

## Patch orchestration modes
VMs on Azure now support the following patch orchestration modes:

**AutomaticByPlatform:**
- This mode is supported for both Linux and Windows VMs.
- This mode enables automatic VM guest patching for the virtual machine and subsequent patch installation is orchestrated by Azure.
- This mode is required for availability-first patching.
- This mode is only supported for VMs that are created using the supported OS platform images above.
- For Windows VMs, setting this mode also disables the native Automatic Updates on the Windows virtual machine to avoid duplication.
- To use this mode on Linux VMs, set the property `osProfile.linuxConfiguration.patchSettings.patchMode=AutomaticByPlatform` in the VM template.
- To use this mode on Windows VMs, set the property `osProfile.windowsConfiguration.enableAutomaticUpdates=true`, and set the property  `osProfile.windowsConfiguration.patchSettings.patchMode=AutomaticByPlatform` in the VM template.

**AutomaticByOS:**
- This mode is supported only for Windows VMs.
- This mode enables Automatic Updates on the Windows virtual machine, and patches are installed on the VM through Automatic Updates.
- This mode does not support availability-first patching.
- This mode is set by default if no other patch mode is specified for a Windows VM.
- To use this mode on Windows VMs, set the property `osProfile.windowsConfiguration.enableAutomaticUpdates=true`, and set the property  `osProfile.windowsConfiguration.patchSettings.patchMode=AutomaticByOS` in the VM template.

**Manual:**
- This mode is supported only for Windows VMs.
- This mode disables Automatic Updates on the Windows virtual machine.
- This mode does not support availability-first patching.
- This mode should be set when using custom patching solutions.
- To use this mode on Windows VMs, set the property `osProfile.windowsConfiguration.enableAutomaticUpdates=false`, and set the property  `osProfile.windowsConfiguration.patchSettings.patchMode=Manual` in the VM template.

**ImageDefault:**
- This mode is supported only for Linux VMs.
- This mode does not support availability-first patching.
- This mode honors the default patching configuration in the image used to create the VM.
- This mode is set by default if no other patch mode is specified for a Linux VM.
- To use this mode on Linux VMs, set the property `osProfile.linuxConfiguration.patchSettings.patchMode=ImageDefault` in the VM template.

> [!NOTE]
>For Windows VMs, the property `osProfile.windowsConfiguration.enableAutomaticUpdates` can currently only be set when the VM is first created. Switching from Manual to an Automatic mode or from either Automatic modes to Manual mode is currently not supported. Switching from AutomaticByOS mode to AutomaticByPlatfom mode is supported.

## Requirements for enabling automatic VM guest patching

- The virtual machine must have the Azure VM Agent for [Windows](./extensions/agent-windows.md) or [Linux](./extensions/agent-linux.md) installed.
- For Linux VMs, the Azure Linux agent must be version 2.2.53.1 or higher. [Update the Linux agent](./extensions/update-linux-agent.md) if the current version is lower than the required version.
- For Windows VMs, the Windows Update service must be running on the virtual machine.
- The virtual machine must be able to access the configured update endpoints. If your virtual machine is configured to use private repositories for Linux or Windows Server Update Services (WSUS) for Windows VMs, the relevant update endpoints must be accessible.
- Use Compute API version 2020-12-01 or higher. Compute API version 2020-06-01 can be used for Windows VMs with limited functionality.

Enabling the preview functionality requires a one-time opt-in for the features **InGuestAutoPatchVMPreview** and **InGuestPatchVMPreview** per subscription, as detailed in the following section.

### REST API
The following example describes how to enable the preview for your subscription:

```
POST on `/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestAutoPatchVMPreview/register?api-version=2015-12-01`
```
```
POST on `/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestPatchVMPreview/register?api-version=2015-12-01`
```

Feature registration can take up to 15 minutes. To check the registration status:

```
GET on `/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestAutoPatchVMPreview?api-version=2015-12-01`
```
```
GET on `/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestPatchVMPreview?api-version=2015-12-01`
```
Once the feature is registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider.

```
POST on `/subscriptions/{subscriptionId}/providers/Microsoft.Compute/register?api-version=2020-06-01`
```

### Azure PowerShell
Use the [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) cmdlet to enable the preview for your subscription.

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName InGuestAutoPatchVMPreview -ProviderNamespace Microsoft.Compute
Register-AzProviderFeature -FeatureName InGuestPatchVMPreview -ProviderNamespace Microsoft.Compute
```

Feature registration can take up to 15 minutes. To check the registration status:

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName InGuestAutoPatchVMPreview -ProviderNamespace Microsoft.Compute
Get-AzProviderFeature -FeatureName InGuestPatchVMPreview -ProviderNamespace Microsoft.Compute
```

Once the feature is registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider.

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.Compute
```

### Azure CLI 2.0
Use [az feature register](/cli/azure/feature#az_feature_register) to enable the preview for your subscription.

```azurecli-interactive
az feature register --namespace Microsoft.Compute --name InGuestAutoPatchVMPreview `
az feature register --namespace Microsoft.Compute --name InGuestPatchVMPreview
```

Feature registration can take up to 15 minutes. To check the registration status:

```azurecli-interactive
az feature show --namespace Microsoft.Compute --name InGuestAutoPatchVMPreview `
az feature show --namespace Microsoft.Compute --name InGuestPatchVMPreview
```

Once the feature is registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider.

```azurecli-interactive
az provider register --namespace Microsoft.Compute
```

## Enable automatic VM guest patching
To enable automatic VM guest patching on a Windows VM, ensure that the property *osProfile.windowsConfiguration.enableAutomaticUpdates* is set to *true* in the VM template definition. This property can only be set when creating the VM. This additional property is not applicable for Linux VMs.

### REST API for Linux VMs
The following example describes how to enable automatic VM guest patching:

```
PUT on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVirtualMachine?api-version=2020-12-01`
```

```json
{
  "properties": {
    "osProfile": {
      "linuxConfiguration": {
        "provisionVMAgent": true,
        "patchSettings": {
          "patchMode": "AutomaticByPlatform"
        }
      }
    }
  }
}
```

### REST API for Windows VMs
The following example describes how to enable automatic VM guest patching:

```
PUT on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVirtualMachine?api-version=2020-06-01`
```

```json
{
  "properties": {
    "osProfile": {
      "windowsConfiguration": {
        "provisionVMAgent": true,
        "enableAutomaticUpdates": true,
        "patchSettings": {
          "patchMode": "AutomaticByPlatform"
        }
      }
    }
  }
}
```

### Azure PowerShell for Windows VMs
Use the [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem) cmdlet to enable automatic VM guest patching when creating or updating a VM.

```azurepowershell-interactive
Set-AzVMOperatingSystem -VM $VirtualMachine -Windows -ComputerName $ComputerName -Credential $Credential -ProvisionVMAgent -EnableAutoUpdate -PatchMode "AutomaticByPlatform"
```

### Azure CLI for Windows VMs
Use [az vm create](/cli/azure/vm#az_vm_create) to enable automatic VM guest patching when creating a new VM. The following example configures automatic VM guest patching for a VM named *myVM* in the resource group named *myResourceGroup*:

```azurecli-interactive
az vm create --resource-group myResourceGroup --name myVM --image Win2019Datacenter --enable-agent --enable-auto-update --patch-mode AutomaticByPlatform
```

To modify an existing VM, use [az vm update](/cli/azure/vm#az_vm_update)

```azurecli-interactive
az vm update --resource-group myResourceGroup --name myVM --set osProfile.windowsConfiguration.enableAutomaticUpdates=true osProfile.windowsConfiguration.patchSettings.patchMode=AutomaticByPlatform
```

## Enablement and assessment

> [!NOTE]
>It can take more than three hours to enable automatic VM guest updates on a VM, as the enablement is completed during the VM's off-peak hours. As assessment and patch installation occur only during off-peak hours, your VM must be also be running during off-peak hours to apply patches.

When automatic VM guest patching is enabled for a VM, a VM extension of type `Microsoft.CPlat.Core.LinuxPatchExtension` is installed on a Linux VM or a VM extension of type `Microsoft.CPlat.Core.WindowsPatchExtension` is installed on a Windows VM. This extension does not need to be manually installed or updated, as this extension is managed by the Azure platform as part of the automatic VM guest patching process.

It can take more than three hours to enable automatic VM guest updates on a VM, as the enablement is completed during the VM's off-peak hours. The extension is also installed and updated during off-peak hours for the VM. If the VM's off-peak hours end before enablement can be completed, the enablement process will resume during the next available off-peak time.

Automatic updates are disabled in most scenarios, and patch installation is done through the extension going forward. The following conditions apply.
- If a Windows VM previously had Automatic Windows Update turned on through the AutomaticByOS patch mode, then Automatic Windows Update is turned off for the VM when the extension is installed.
- For Ubuntu VMs, the default automatic updates are disabled automatically when Automatic VM Guest Patching completes enablement.
- For RHEL, automatic updates need to be manually disabled (this is a preview limitation). Execute:

```
systemctl stop packagekit
```

```
systemctl mask packagekit
```

To verify whether automatic VM guest patching has completed and the patching extension is installed on the VM, you can review the VM's instance view. If the enablement process is complete, the extension will be installed and the assessment results for the VM will be available under `patchStatus`. The VM's instance view can be accessed through multiple ways as described below.

### REST API

```
GET on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVirtualMachine/instanceView?api-version=2020-12-01`
```
### Azure PowerShell
Use the [Get-AzVM](/powershell/module/az.compute/get-azvm) cmdlet with the `-Status` parameter to access the instance view for your VM.

```azurepowershell-interactive
Get-AzVM -ResourceGroupName "myResourceGroup" -Name "myVM" -Status
```

PowerShell currently only provides information on the patch extension. Information about `patchStatus` will also be available soon through PowerShell.

### Azure CLI
Use [az vm get-instance-view](/cli/azure/vm#az_vm_get_instance_view) to access the instance view for your VM.

```azurecli-interactive
az vm get-instance-view --resource-group myResourceGroup --name myVM
```

### Understanding the patch status for your VM

The `patchStatus` section of the instance view response provides details on the latest assessment and the last patch installation for your VM.

The assessment results for your VM can be reviewed under the `availablePatchSummary` section. An assessment is periodically conducted for a VM that has automatic VM guest patching enabled. The count of available patches after an assessment is provided under `criticalAndSecurityPatchCount` and `otherPatchCount` results. Automatic VM guest patching will install all patches assessed under the *Critical* and *Security* patch classifications. Any other assessed patch is skipped.

The patch installation results for your VM can be reviewed under the `lastPatchInstallationSummary` section. This section provides details on the last patch installation attempt on the VM, including the number of patches that were installed, pending, failed or skipped. Patches are installed only during the off-peak hours maintenance window for the VM. Pending and failed patches are automatically retried during the next off-peak hours maintenance window.

## On-demand patch assessment
If automatic VM guest patching is already enabled for your VM, a periodic patch assessment is performed on the VM during the VM's off-peak hours. This process is automatic and the results of the latest assessment can be reviewed through the VM's instance view as described earlier in this document. You can also trigger an on-demand patch assessment for your VM at any time. Patch assessment can take a few minutes to complete and the status of the latest assessment is updated on the VM's instance view.

Enabling the preview functionality requires a one-time opt-in for the feature **InGuestPatchVMPreview** per subscription. This feature preview is different from the automatic VM guest patching feature enrollment done earlier for **InGuestAutoPatchVMPreview**. Enabling the additional feature preview is a separate and additional requirement. The feature preview for on-demand patch assessment can be enabled following the [preview enablement process](automatic-vm-guest-patching.md#requirements-for-enabling-automatic-vm-guest-patching) described earlier for automatic VM guest patching.

> [!NOTE]
>On-demand patch assessment does not automatically trigger patch installation. If you have enabled automatic VM guest patching then the assessed and applicable patches for the VM will be installed during the VM's off-peak hours, following the availability-first patching process described earlier in this document.

### REST API
```
POST on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVirtualMachine/assessPatches?api-version=2020-12-01`
```

### Azure PowerShell
Use the [Invoke-AzVmPatchAssessment](/powershell/module/az.compute/invoke-azvmpatchassessment) cmdlet to assess available patches for your virtual machine.

```azurepowershell-interactive
Invoke-AzVmPatchAssessment -ResourceGroupName "myResourceGroup" -VMName "myVM"
```

### Azure CLI
Use [az vm assess-patches](/cli/azure/vm#az_vm_assess_patches) to assess available patches for your virtual machine.

```azurecli-interactive
az vm assess-patches --resource-group myResourceGroup --name myVM
```

## Next steps
> [!div class="nextstepaction"]
> [Learn more about creating and managing Windows virtual machines](./windows/tutorial-manage-vm.md)
