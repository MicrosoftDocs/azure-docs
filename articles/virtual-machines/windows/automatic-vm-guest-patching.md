---
title: Automatic VM Guest Patching for Windows VMs in Azure
description: Learn how to automatically patch Windows virtual machines in Azure
author: mayanknayar
ms.service: virtual-machines-windows
ms.workload: infrastructure
ms.topic: how-to
ms.date: 08/31/2020
ms.author: manayar

---
# Preview: Automatic VM guest patching for Windows VMs in Azure

Enabling automatic VM guest patching for your Windows VMs helps ease update management by safely and automatically patching virtual machines to maintain security compliance.

Automatic VM guest patching has the following characteristics:
- Patches classified as 'Critical' or 'Security' are automatically downloaded and applied on the VM.
- Patches are applied during off-peak hours in the VM's time zone.
- Patch orchestration is managed by Azure and patches are applied following availability-first principles.
- Virtual machine health, as determined through platform health signals, is monitored to detect patching failures.
- Works for all VM sizes.

> [!IMPORTANT]
> Automatic VM guest patching is currently in Public Preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How does automatic VM guest patching work?

If automatic VM guest patching has been enabled on a VM, then the available 'Critical' and 'Security' patches are downloaded and applied automatically on the VM. This process kicks off automatically every month when new patches are released through Windows Update. Patch assessment and installation are automatic, and the process includes rebooting the VM as required.

If automatic VM guest patching has been enabled on a VM, the VM is assessed periodically to determine the applicable patches for that VM. The patches can be installed any day on the VM during off-peak hours for the VM. This automatic assessment ensures that any missing patches are discovered at the earliest possible opportunity.

### Availability-first patching

The patch installation process is orchestrated globally by Azure for all VMs that have automatic VM guest patching enabled. This orchestration follows availability-first principles across different levels of availability provided by Azure.

For a group of virtual machines undergoing an update, the Azure platform will orchestrate updates:

**Across regions:**
- A monthly update is orchestrated across Azure globally in a phased manner to prevent global deployment failures.
- A phase can have one or more regions, and an update moves to the next phases only if eligible VMs in a phase are updated successfully.
- Geo-paired regions will not be updated concurrently and cannot be in the same regional phase.
- The success of an update is measured by tracking the VM’s health post update. VM Health is tracked through platform health indicators for the VM.

**Within a region:**
- VMs in different Availability Zones are not updated concurrently
- VMs that are not part of an availability set or virtual machine scale set, are batched on a best effort basis to avoid concurrent updates for all VMs in a subscription.

**Within an availability set:**
- All VMs in a common availability set or scale set are not updated concurrently.
-	VMs in a common availability set are updated within Update Domain boundaries such that VMs across multiple update domains are not updated concurrently.

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
- This mode enables automatic VM guest patching for the Windows virtual machine and subsequent patch installation will be orchestrated by Azure as detailed above.
- Setting this mode also disables the native Automatic Updates on the Windows virtual machine to avoid duplication.
- This mode is only supported for VMs that are created using the supported OS platform images above.
- To use this mode, set the property `osProfile.windowsConfiguration.enableAutomaticUpdates=true`, and set the property  `osProfile.windowsConfiguration.patchSettings.patchMode=AutomaticByPlatfom` in the VM template.

**AutomaticByOS:**
- This mode enables Automatic Updates on the Windows virtual machine, and patches will be installed on the VM through Automatic Updates.
- This mode is the default if no other patch mode has been specified.
- To use this mode set the property `osProfile.windowsConfiguration.enableAutomaticUpdates=true`, and set the property  `osProfile.windowsConfiguration.patchSettings.patchMode=AutomaticByOS` in the VM template.

**Manual:**
- This mode disables Automatic Updates on the Windows virtual machine.
- This mode should be set when using custom patching solutions.
- To use this mode set the property `osProfile.windowsConfiguration.enableAutomaticUpdates=false`, and set the property  `osProfile.windowsConfiguration.patchSettings.patchMode=Manual` in the VM template.

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

Once the feature has been registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider.

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

Once the feature has been registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider.

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

Once the feature has been registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider.

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
Set-AzVMOperatingSystem -VM $$VirtualMachine -Windows -ComputerName $ComputerName -Credential $Credential -ProvisionVMAgent -EnableAutoUpdate -PatchMode "AutomaticByPlatform"
```

### Azure CLI 2.0
Use [az vm create](/cli/azure/vm#az-vm-create) to enable automatic VM guest patching when creating a new VM. The following example configures automatic VM guest patching for a VM named *myVM* in the resource group named *myResourceGroup*:

```azurecli-interactive
az vm create --resource-group myResourceGroup --name myVM --image Win2019Datacenter --enable-agent --enable-auto-update --patch-mode AutomaticByPlatform
```

To modify an existing VM, use [az vm update](/cli/azure/vm#az-vm-update)`

```azurecli-interactive
az vm update --resource-group myResourceGroup --name myVM --set osProfile.windowsConfiguration.enableAutomaticUpdates=true osProfile.windowsConfiguration.patchSettings.patchMode=AutomaticByPlatform
```

> [!NOTE]
>It can take up to three hours to enable automatic VM guest updates on a VM. As assessment and patch installation occur only during off-peak hours, your VM must be also be running during off-peak hours to apply patches.

## Next steps
> [!div class="nextstepaction"]
> [Learn more about creating and managing Windows virtual machines](tutorial-manage-vm.md)
