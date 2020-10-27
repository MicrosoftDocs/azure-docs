---
title: Automatic VM Guest Patching for Windows VMs in Azure
description: Learn how to automatically patch Windows virtual machines in Azure
author: mayanknayar
ms.service: virtual-machines-windows
ms.workload: infrastructure
ms.topic: how-to
ms.date: 09/09/2020
ms.author: manayar

---
# Preview: Automatic VM guest patching for Windows VMs in Azure

Enabling automatic VM guest patching for your Windows VMs helps ease update management by safely and automatically patching virtual machines to maintain security compliance.

Automatic VM guest patching has the following characteristics:
- Patches classified as *Critical* or *Security* are automatically downloaded and applied on the VM.
- Patches are applied during off-peak hours in the VM's time zone.
- Patch orchestration is managed by Azure and patches are applied following availability-first principles.
- Virtual machine health, as determined through platform health signals, is monitored to detect patching failures.
- Works for all VM sizes.

> [!IMPORTANT]
> Automatic VM guest patching is currently in Public Preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How does automatic VM guest patching work?

If automatic VM guest patching is enabled on a VM, then the available *Critical* and *Security* patches are downloaded and applied automatically on the VM. This process kicks off automatically every month when new patches are released through Windows Update. Patch assessment and installation are automatic, and the process includes rebooting the VM as required.

The VM is assessed periodically to determine the applicable patches for that VM. The patches can be installed any day on the VM during off-peak hours for the VM. This automatic assessment ensures that any missing patches are discovered at the earliest possible opportunity.

Patches are installed within 30 days of the monthly Windows Update release, following availability-first orchestration described below. Patches are installed only during off-peak hours for the VM, depending on the time zone of the VM. The VM must be running during the off-peak hours for patches to be automatically installed. If a VM is powered off during a periodic assessment, the VM will be automatically assessed and applicable patches will be installed automatically during the next periodic assessment when the VM is powered on.

To install patches with other patch classifications or schedule patch installation within your own custom maintenance window, you can use [Update Management](tutorial-config-management.md#manage-windows-updates).

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

## Supported OS images
Only VMs created from certain OS platform images are currently supported in the preview. Custom images are currently not supported in the preview.

The following platform SKUs are currently supported (and more are added periodically):

| Publisher               | OS Offer      |  Sku               |
|-------------------------|---------------|--------------------|
| Microsoft Corporation   | WindowsServer | 2012-R2-Datacenter |
| Microsoft Corporation   | WindowsServer | 2016-Datacenter    |
| Microsoft Corporation   | WindowsServer | 2016-Datacenter-Server-Core |
| Microsoft Corporation   | WindowsServer | 2019-Datacenter |
| Microsoft Corporation   | WindowsServer | 2019-Datacenter-Server-Core |

## Patch orchestration modes
Windows VMs on Azure now support the following patch orchestration modes:

**AutomaticByPlatform:**
- This mode enables automatic VM guest patching for the Windows virtual machine and subsequent patch installation is orchestrated by Azure.
- Setting this mode also disables the native Automatic Updates on the Windows virtual machine to avoid duplication.
- This mode is only supported for VMs that are created using the supported OS platform images above.
- To use this mode, set the property `osProfile.windowsConfiguration.enableAutomaticUpdates=true`, and set the property  `osProfile.windowsConfiguration.patchSettings.patchMode=AutomaticByPlatfom` in the VM template.

**AutomaticByOS:**
- This mode enables Automatic Updates on the Windows virtual machine, and patches are installed on the VM through Automatic Updates.
- This mode is set by default if no other patch mode is specified.
- To use this mode set the property `osProfile.windowsConfiguration.enableAutomaticUpdates=true`, and set the property  `osProfile.windowsConfiguration.patchSettings.patchMode=AutomaticByOS` in the VM template.

**Manual:**
- This mode disables Automatic Updates on the Windows virtual machine.
- This mode should be set when using custom patching solutions.
- To use this mode set the property `osProfile.windowsConfiguration.enableAutomaticUpdates=false`, and set the property  `osProfile.windowsConfiguration.patchSettings.patchMode=Manual` in the VM template.

> [!NOTE]
>The property `osProfile.windowsConfiguration.enableAutomaticUpdates` can currently only be set when the VM is first created. Switching from Manual to an Automatic mode or from either Automatic modes to Manual mode is currently not supported. Switching from AutomaticByOS mode to AutomaticByPlatfom mode is supported

## Requirements for enabling automatic VM guest patching

- The virtual machine must have the [Azure VM Agent](../extensions/agent-windows.md) installed.
- The Windows Update service must be running on the virtual machine.
- The virtual machine must be able to access Windows Update endpoints. If your virtual machine is configured to use Windows Server Update Services (WSUS), the relevant WSUS server endpoints must be accessible.
- Use Compute API version 2020-06-01 or higher.

Enabling the preview functionality requires a one-time opt-in for the feature *InGuestAutoPatchVMPreview* per subscription, as detailed below.

### REST API
The following example describes how to enable the preview for your subscription:

```
POST on `/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestAutoPatchVMPreview/register?api-version=2015-12-01`
```

Feature registration can take up to 15 minutes. To check the registration status:

```
GET on `/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestAutoPatchVMPreview?api-version=2015-12-01`
```

Once the feature is registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider.

```
POST on `/subscriptions/{subscriptionId}/providers/Microsoft.Compute/register?api-version=2020-06-01`
```

### Azure PowerShell
Use the [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) cmdlet to enable the preview for your subscription.

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName InGuestAutoPatchVMPreview -ProviderNamespace Microsoft.Compute
```

Feature registration can take up to 15 minutes. To check the registration status:

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName InGuestAutoPatchVMPreview -ProviderNamespace Microsoft.Compute
```

Once the feature is registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider.

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.Compute
```

### Azure CLI 2.0
Use [az feature register](/cli/azure/feature#az-feature-register) to enable the preview for your subscription.

```azurecli-interactive
az feature register --namespace Microsoft.Compute --name InGuestAutoPatchVMPreview
```

Feature registration can take up to 15 minutes. To check the registration status:

```azurecli-interactive
az feature show --namespace Microsoft.Compute --name InGuestAutoPatchVMPreview
```

Once the feature is registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider.

```azurecli-interactive
az provider register --namespace Microsoft.Compute
```
## Enable automatic VM guest patching
To enable automatic VM guest patching, ensure that the property *osProfile.windowsConfiguration.enableAutomaticUpdates* is set to *true* in the VM template definition. This property can only be set when creating the VM.

### REST API
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

### Azure PowerShell
Use the [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem) cmdlet to enable automatic VM guest patching when creating or updating a VM.

```azurepowershell-interactive
Set-AzVMOperatingSystem -VM $VirtualMachine -Windows -ComputerName $ComputerName -Credential $Credential -ProvisionVMAgent -EnableAutoUpdate -PatchMode "AutomaticByPlatform"
```

### Azure CLI 2.0
Use [az vm create](/cli/azure/vm#az-vm-create) to enable automatic VM guest patching when creating a new VM. The following example configures automatic VM guest patching for a VM named *myVM* in the resource group named *myResourceGroup*:

```azurecli-interactive
az vm create --resource-group myResourceGroup --name myVM --image Win2019Datacenter --enable-agent --enable-auto-update --patch-mode AutomaticByPlatform
```

To modify an existing VM, use [az vm update](/cli/azure/vm#az-vm-update)

```azurecli-interactive
az vm update --resource-group myResourceGroup --name myVM --set osProfile.windowsConfiguration.enableAutomaticUpdates=true osProfile.windowsConfiguration.patchSettings.patchMode=AutomaticByPlatform
```

## Enablement and assessment

> [!NOTE]
>It can take more than three hours to enable automatic VM guest updates on a VM, as the enablement is completed during the VM's off-peak hours. As assessment and patch installation occur only during off-peak hours, your VM must be also be running during off-peak hours to apply patches.

When automatic VM guest patching is enabled for a VM, a VM extension of type `Microsoft.CPlat.Core.WindowsPatchExtension` is installed on the VM. This extension does not need to be manually installed or updated, as this extension is managed by the Azure platform as part of the automatic VM guest patching process.

It can take more than three hours to enable automatic VM guest updates on a VM, as the enablement is completed during the VM's off-peak hours. The extension is also installed and updated during off-peak hours for the VM. If the VM's off-peak hours end before enablement can be completed, the enablement process will resume during the next available off-peak time. If the VM previously had Automatic Windows Update turned on through the AutomaticByOS patch mode, then Automatic Windows Update is turned off for the VM when the extension is installed.

To verify whether automatic VM guest patching has completed and the patching extension is installed on the VM, you can review the VM's instance view. If the enablement process is complete, the extension will be installed and the assessment results for the VM will be available under `patchStatus`. The VM's instance view can be accessed through multiple ways as described below.

### REST API

```
GET on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVirtualMachine/instanceView?api-version=2020-06-01`
```
### Azure PowerShell
Use the [Get-AzVM](/powershell/module/az.compute/get-azvm) cmdlet with the `-Status` parameter to access the instance view for your VM.

```azurepowershell-interactive
Get-AzVM -ResourceGroupName "myResourceGroup" -Name "myVM" -Status
```

PowerShell currently only provides information on the patch extension. Information about `patchStatus` will also be available soon through PowerShell.

### Azure CLI 2.0
Use [az vm get-instance-view](/cli/azure/vm#az-vm-get-instance-view) to access the instance view for your VM.

```azurecli-interactive
az vm get-instance-view --resource-group myResourceGroup --name myVM
```

### Understanding the patch status for your VM

The `patchStatus` section of the instance view response provides details on the latest assessment and the last patch installation for your VM.

The assessment results for your VM can be reviewed under the `availablePatchSummary` section. An assessment is periodically conducted for a VM that has automatic VM guest patching enabled. The count of available patches after an assessment is provided under `criticalAndSecurityPatchCount` and `otherPatchCount` results. Automatic VM guest patching will install all patches assessed under the *Critical* and *Security* patch classifications. Any other assessed patch is skipped.

The patch installation results for your VM can be reviewed under the `lastPatchInstallationSummary` section. This section provides details on the last patch installation attempt on the VM, including the number of patches that were installed, pending, failed or skipped. Patches are installed only during the off-peak hours maintenance window for the VM. Pending and failed patches are automatically retried during the next off-peak hours maintenance window.

## On-demand patch assessment
If automatic VM guest patching is already enabled for your VM, a periodic patch assessment is performed on the VM during the VM's off-peak hours. This process is automatic and the results of the latest assessment can be reviewed through the VM's instance view as described earlier in this document. You can also trigger an on-demand patch assessment for your VM at any time. Patch assessment can take a few minutes to complete and the status of the latest assessment is updated on the VM's instance view.

Enabling the preview functionality requires a one-time opt-in for the feature *InGuestPatchVMPreview* per subscription. The feature preview for on-demand patch assessment can be enabled following the [preview enablement process](automatic-vm-guest-patching.md#requirements-for-enabling-automatic-vm-guest-patching) described earlier for automatic VM guest patching.

> [!NOTE]
>On-demand patch assessment does not automatically trigger patch installation. Assessed and applicable patches for the VM will only be installed during the VM's off-peak hours, following the availability-first patching process described earlier in this document.

### REST API
```
POST on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVirtualMachine/assessPatches?api-version=2020-06-01`
```

### Azure PowerShell
Use the [Invoke-AzVmPatchAssessment](/powershell/module/az.compute/invoke-azvmpatchassessment) cmdlet to assess available patches for your virtual machine.

```azurepowershell-interactive
Invoke-AzVmPatchAssessment -ResourceGroupName "myResourceGroup" -VMName "myVM"
```

### Azure CLI 2.0
Use [az vm assess-patches](/cli/azure/vm#az-vm-assess-patches) to assess available patches for your virtual machine.

```azurecli-interactive
az vm assess-patches --resource-group myResourceGroup --name myVM
```

## Next steps
> [!div class="nextstepaction"]
> [Learn more about creating and managing Windows virtual machines](tutorial-manage-vm.md)
