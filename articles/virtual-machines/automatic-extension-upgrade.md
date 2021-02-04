---
title: Automatic Extension Upgrade for VMs and Scale Sets in Azure
description: Learn how to automatically patch Windows virtual machines in Azure
author: mayanknayar
ms.service: virtual-machines
ms.workload: infrastructure
ms.topic: how-to
ms.date: 02/12/2020
ms.author: manayar

---

# Preview: Automatic Extension Upgrade for VMs and Scale Sets in Azure

Automatic Extension Upgrade is available in preview for Azure VMs and Azure VM scale sets. When Automatic Extension Upgrade is enabled on a VM or scale set, the extension is upgraded automatically whenever the extension publisher releases a new version for that extension. 

 Automatic Extension Upgrade has the following features:
- Supported for Azure VMs and Azure VMSS. Service Fabric VMSS is currently not supported. 
- Upgrades are applied in an availability-first deployment model (detailed below). 
- When applied to a VMSS, no more than 20% of the VMSS virtual machines will be upgraded in a single batch (subject to a minimum of 1 virtual machine per batch). 
- Works for all VM sizes, and for both Windows and Linux extensions. 
- You can opt out of automatic upgrades at any time. 
- Automatic extension upgrade can be enabled on a VMSS of any size. 
- Each supported extension is enrolled individually, and you can choose which extensions to upgrade automatically. 
- Supported in all public cloud regions. 


> [!IMPORTANT]
> Automatic Extension Upgrade is currently in Public Preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## How does Automatic Extension Upgrade work? 
The extension upgrade process works by replacing the existing extension version on a VM with the new extension version published by the extension publisher. The health of the VM is monitored after the new extension is installed. If the VM is not in a healthy state within 5 minutes of the upgrade completion, the new extension version is rolled back to the previous version. 

A failed extension update is automatically retried. A retry is attempted every few days automatically without user intervention.


## Upgrade process for Virtual Machine Scale Sets 
1. Before beginning the upgrade process, the orchestrator will ensure that no more than 20% of VMs in the entire scale set are unhealthy (for any reason). 

2. The upgrade orchestrator identifies the batch of VM instances to upgrade, with any one batch having a maximum of 20% of the total VM count, subject to a minimum batch size of one virtual machine. 

3. For scale sets with configured application health probes or Application Health extension, the upgrade waits up to 5 minutes (or the defined health probe configuration) for the VM to become healthy, before moving on to upgrade the next batch. If a VM does not recover its health after an upgrade, then by default the previous extension version for the VM is re-installed. 

4. The upgrade orchestrator also tracks the percentage of VMs that become unhealthy after an upgrade. The upgrade will stop if more than 20% of upgraded instances become unhealthy during the upgrade process. 

The above process continues until all instances in the scale set have been upgraded. 

The scale set upgrade orchestrator checks for the overall scale set health before upgrading every batch. While upgrading a batch, there could be other concurrent planned or unplanned maintenance activities that could impact the health of your scale set virtual machines. In such cases, if more than 20% of the scale set's instances become unhealthy, then the scale set upgrade stops at the end of current batch.


### Availability-first Updates 
The availability-first model for platform orchestrated updates will ensure that availability configurations in Azure are respected across multiple availability levels. 

For a group of virtual machines undergoing an update, the Azure platform will orchestrate updates: 

**Across regions:** 
- An update will move across Azure globally in a phased manner to prevent Azure-wide deployment failures. 
- A 'phase' can constitute one or more regions, and an update moves across phases only if eligible VMs in a phase are updated successfully. 
- Geo-paired regions will not be updated concurrently and cannot be in the same regional phase. 
- The success of an update is measured by tracking the health of a VM post update. VM health is tracked through platform health indicators for the VM. In the case of VM scale sets, the VM health is tracked through application health probes or the Application Health extension, if applied to the scale set. 

**Within a region:** 
- VMs in different Availability Zones are not updated concurrently. 
- Single VMs not part of an availability set are batched on a best effort basis to avoid concurrent updates for all VMs in a subscription.  

**Within a 'set':**
- All VMs in a common availability set or scale set are not updated concurrently.  
- VMs in a common availability set are updated within Update Domain boundaries and VMs across multiple Update Domains are not updated concurrently.  
- VMs in a common virtual machine scale set are grouped in batches and updated within Update Domain boundaries. 


## Supported extensions 
The preview of Automatic Extension Upgrade supports the following extensions (and more are added periodically):
- Dependency Agent – [Windows](../extensions/agent-dependency-windows.md) and [Linux](../extensions/agent-dependency-linux.md) 
- [Application Health Extension](../windows/automatic-vm-guest-patching.md) – Windows and Linux 


## Enabling preview access 
Enabling the preview functionality requires a one-time opt-in for the feature **AutomaticExtensionUpgradePreview** per subscription, as detailed below. 

### REST API 
The following example describes how to enable the preview for your subscription: 

```
POST on `/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Compute/features/AutomaticExtensionUpgradePreview/register?api-version=2015-12-01` 
```

Feature registration can take up to 15 minutes. To check the registration status: 

```
GET on `/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Compute/features/AutomaticExtensionUpgradePreview?api-version=2015-12-01` 
```

Once the feature has been registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider. 

```
POST on `/subscriptions/{subscriptionId}/providers/Microsoft.Compute/register?api-version=2020-06-01` 
```

### Azure PowerShell 
Use the [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) cmdlet to enable the preview for your subscription. 

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName AutomaticExtensionUpgradePreview -ProviderNamespace Microsoft.Compute 
```

Feature registration can take up to 15 minutes. To check the registration status: 

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName AutomaticExtensionUpgradePreview -ProviderNamespace Microsoft.Compute 
```

Once the feature has been registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider. 

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.Compute 
```

### Azure CLI 2.0 
Use [az feature register](/cli/azure/feature#az-feature-register) to enable the preview for your subscription. 

```azurecli-interactive
az feature register --namespace Microsoft.Compute --name AutomaticExtensionUpgradePreview 
```

Feature registration can take up to 15 minutes. To check the registration status: 

```azurecli-interactive
az feature show --namespace Microsoft.Compute --name AutomaticExtensionUpgradePreview 
```

Once the feature has been registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider. 

```azurecli-interactive
az provider register --namespace Microsoft.Compute 
```


## Enabling Automatic Extension Upgrade 
To enable Automatic Extension Upgrade for an extension, you must ensure the property *enableAutomaticUpgrade* is set to *true* and added to every extension definition individually.

 
### REST API for Virtual Machines 
To enable automatic extension upgrade for an extension (in this example the Dependency Agent extension) on an Azure VM, use the following: 

```
PUT on `/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/virtualMachines/<vmName>/extensions/<extensionName>?api-version=2019-12-01`
```

```json
{     
    "name": "extensionName", 
    "type": "Microsoft.Compute/virtualMachines/extensions", 
    "location": "<location>", 
    "properties": { 
        "autoUpgradeMinorVersion": true, 
        "enableAutomaticUpgrade": true,  
        "publisher": "Microsoft.Azure.Monitoring.DependencyAgent", 
        "type": "DependencyAgentWindows", 
        "typeHandlerVersion": "9.5" 
        } 
} 
```

### REST API for Virtual Machine Scale Sets 
To enable automatic extension upgrade for an extension (in this example the Dependency Agent extension) on an Azure VM Scale Set, use the following:

```
PUT on `/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/virtualMachineScaleSets/<vmssName>?api-version=2019-12-01`
```

```json
{ 
   "location": "<location>", 
   "properties": { 
   	    "virtualMachineProfile": { 
            "extensionProfile": { 
       	        "extensions": [ 
            	{ 
                "name": "<extensionName>", 
            	"properties": { 
             		"autoUpgradeMinorVersion": true, 
             		"enableAutomaticUpgrade": true, 
              	    "publisher": "Microsoft.Azure.Monitoring.DependencyAgent", 
              	    "type": "DependencyAgentWindows", 
              	    "typeHandlerVersion": "9.5” 
            		} 
          	    } 
        	    ] 
    	    } 
    	} 
    } 
}
```


## Extension upgrades with multiple extensions 

A VM or VM Scale Set can have multiple extensions with automatic extension upgrade enabled, in addition to other extensions without automatic extension upgrades.  

If multiple extension upgrades are available for a virtual machine, the upgrades may be batched together. However, each extension upgrade is applied individually on a virtual machine. A failure on one extension does not impact the other extension(s) that may be upgrading. For example, if two extensions are scheduled for an upgrade, and the first extension upgrade fails, the second upgrade will still be upgraded. 

Automatic Extension Upgrades can also be applied when a VM or VM Scale Set has multiple extensions configured with extension sequencing. Extension sequencing is applicable for the first-time deployment of the VM, and any subsequent extension upgrades on an extension are applied independently. 


## Next steps
> [!div class="nextstepaction"]
> [Learn about the Application Health Extension](../windows/automatic-vm-guest-patching.md)