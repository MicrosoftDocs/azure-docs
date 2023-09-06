---
title: Automatic OS image upgrades with Azure Virtual Machine Scale Sets
description: Learn how to automatically upgrade the OS image on VM instances in a scale set
author: ju-shim
ms.author: jushiman
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.subservice: automatic-os-upgrade
ms.custom: devx-track-linux
ms.date: 07/25/2023
ms.reviewer: mimckitt
---
# Azure Virtual Machine Scale Set automatic OS image upgrades

> [!NOTE]
> Many of the steps listed in this document apply to Virtual Machine Scale Sets using Uniform Orchestration mode. We recommend using Flexible Orchestration for new workloads. For more information, see [Orchesration modes for Virtual Machine Scale Sets in Azure](virtual-machine-scale-sets-orchestration-modes.md).

Enabling automatic OS image upgrades on your scale set helps ease update management by safely and automatically upgrading the OS disk for all instances in the scale set.

Automatic OS upgrade has the following characteristics:

- Once configured, the latest OS image published by image publishers is automatically applied to the scale set without user intervention.
- Upgrades batches of instances in a rolling manner each time a new image is published by the publisher.
- Integrates with application health probes and [Application Health extension](virtual-machine-scale-sets-health-extension.md).
- Works for all VM sizes, and for both Windows and Linux images including custom images through [Azure Compute Gallery](../virtual-machines/shared-image-galleries.md).
- You can opt out of automatic upgrades at any time (OS Upgrades can be initiated manually as well).
- The OS Disk of a VM is replaced with the new OS Disk created with latest image version. Configured extensions and custom data scripts are run, while persisted data disks are retained.
- [Extension sequencing](virtual-machine-scale-sets-extension-sequencing.md) is supported.
- Can be enabled on a scale set of any size.

> [!NOTE]
>Before enabling automatic OS image upgrades, check [requirements section](#requirements-for-configuring-automatic-os-image-upgrade) of this documentation.

## How does automatic OS image upgrade work?

An upgrade works by replacing the OS disk of a VM with a new disk created using the latest image version. Any configured extensions and custom data scripts are run on the OS disk, while data disks are retained. To minimize the application downtime, upgrades take place in batches, with no more than 20% of the scale set upgrading at any time.

You can integrate an Azure Load Balancer application health probe or [Application Health extension](virtual-machine-scale-sets-health-extension.md) to track the health of the application after an upgrade. We recommended incorporating an application heartbeat to validate upgrade success.

### Availability-first Updates
The availability-first model for platform orchestrated updates described below ensures that availability configurations in Azure are respected across multiple availability levels.

**Across regions:**
- An update will move across Azure globally in a phased manner to prevent Azure-wide deployment failures.
- A 'phase' can have one or more regions, and an update moves across phases only if eligible VMs in the previous phase update successfully.
- Geo-paired regions will not be updated concurrently and cannot be in the same regional phase.
- The success of an update is measured by tracking the health of a VM post update.

**Within a region:**
- VMs in different Availability Zones are not updated concurrently with the same update.

**Within a 'set':**
- All VMs in a common scale set are not updated concurrently.  
- VMs in a common Virtual Machine Scale Set are grouped in batches and updated within Update Domain boundaries as described below.

The platform orchestrated updates process is followed for rolling out supported OS platform image upgrades every month. For custom images through Azure Compute Gallery, an image upgrade is only kicked off for a particular Azure region when the new image is published and [replicated](../virtual-machines/azure-compute-gallery.md#replication) to the region of that scale set.

### Upgrading VMs in a scale set

The region of a scale set becomes eligible to get image upgrades either through the availability-first process for platform images or replicating new custom image versions for Share Image Gallery. The image upgrade is then applied to an individual scale set in a batched manner as follows:
1. Before you begin the upgrade process, the orchestrator will ensure that no more than 20% of instances in the entire scale set are unhealthy (for any reason).
2. The upgrade orchestrator identifies the batch of VM instances to upgrade, with any one batch having a maximum of 20% of the total instance count, subject to a minimum batch size of one virtual machine. There is no minimum scale set size requirement and scale sets with 5 or fewer instances will have 1 VM  per upgrade batch (minimum batch size).
3. The OS disk of every VM in the selected upgrade batch is replaced with a new OS disk created from the latest image. All specified extensions and configurations in the scale set model are applied to the upgraded instance.
4. For scale sets with configured application health probes or Application Health extension, the upgrade waits up to 5 minutes for the instance to become healthy, before moving on to upgrade the next batch. If an instance does not recover its health in 5 minutes after an upgrade, then by default the previous OS disk for the instance is restored.
5. The upgrade orchestrator also tracks the percentage of instances that become unhealthy post an upgrade. The upgrade will stop if more than 20% of upgraded instances become unhealthy during the upgrade process.
6. The above process continues until all instances in the scale set have been upgraded.

The scale set OS upgrade orchestrator checks for the overall scale set health before upgrading every batch. While you're upgrading a batch, there could be other concurrent planned or unplanned maintenance activities that could impact the health of your scale set instances. In such cases if more than 20% of the scale set's instances become unhealthy, then the scale set upgrade stops at the end of current batch.

To modify the default settings associated with Rolling Upgrades, review Azure's [Rolling Upgrade Policy](/rest/api/compute/virtual-machine-scale-sets/create-or-update?tabs=HTTP#rollingupgradepolicy).

> [!NOTE]
>Automatic OS upgrade does not upgrade the reference image Sku on the scale set. To change the Sku (such as Ubuntu 18.04-LTS to 20.04-LTS), you must update the [scale set model](virtual-machine-scale-sets-upgrade-scale-set.md#the-scale-set-model) directly with the desired image Sku. Image publisher and offer can't be changed for an existing scale set.  

## Supported OS images
Only certain OS platform images are currently supported. Custom images [are supported](virtual-machine-scale-sets-automatic-upgrade.md#automatic-os-image-upgrade-for-custom-images) if the scale set uses custom images through [Azure Compute Gallery](../virtual-machines/shared-image-galleries.md).

The following platform SKUs are currently supported (and more are added periodically):

| Publisher               | OS Offer      |  Sku               |
|-------------------------|---------------|--------------------|
| Canonical               | UbuntuServer  | 18.04-LTS          |  
| Canonical               | UbuntuServer  | 18_04-LTS-Gen2          |  
| Canonical               | 0001-com-ubuntu-server-focal  | 20_04-LTS          |                   
| Canonical               | 0001-com-ubuntu-server-focal  | 20_04-LTS-Gen2     | 
| Canonical               | 0001-com-ubuntu-server-jammy  | 22_04-LTS    | 
| MicrosoftCblMariner     | Cbl-Mariner   | cbl-mariner-1      |                 
| MicrosoftCblMariner     | Cbl-Mariner   | 1-Gen2             |                   
| MicrosoftCblMariner     | Cbl-Mariner   | cbl-mariner-2                        
| MicrosoftCblMariner     | Cbl-Mariner   | cbl-mariner-2-Gen2 |    
| MicrosoftSqlServer      | Sql2017-ws2019| enterprise |   
| MicrosoftWindowsServer  | WindowsServer | 2012-R2-Datacenter |
| MicrosoftWindowsServer  | WindowsServer | 2016-Datacenter    |
| MicrosoftWindowsServer  | WindowsServer | 2016-Datacenter-gensecond    |
| MicrosoftWindowsServer  | WindowsServer | 2016-Datacenter-gs        |
| MicrosoftWindowsServer  | WindowsServer | 2016-Datacenter-smalldisk |
| MicrosoftWindowsServer  | WindowsServer | 2016-Datacenter-with-Containers |
| MicrosoftWindowsServer  | WindowsServer | 2016-Datacenter-with-containers-gs |
| MicrosoftWindowsServer  | WindowsServer | 2019-Datacenter |
| MicrosoftWindowsServer  | WindowsServer | 2019-Datacenter-Core |
| MicrosoftWindowsServer  | WindowsServer | 2019-Datacenter-Core-with-Containers |
| MicrosoftWindowsServer  | WindowsServer | 2019-Datacenter-gensecond |
| MicrosoftWindowsServer  | WindowsServer | 2019-Datacenter-gs |
| MicrosoftWindowsServer  | WindowsServer | 2019-Datacenter-smalldisk |
| MicrosoftWindowsServer  | WindowsServer | 2019-Datacenter-with-Containers |                 
| MicrosoftWindowsServer  | WindowsServer | 2019-Datacenter-with-Containers-gs |
| MicrosoftWindowsServer  | WindowsServer | 2022-Datacenter |
| MicrosoftWindowsServer  | WindowsServer | 2022-Datacenter-smalldisk |
| MicrosoftWindowsServer  | WindowsServer | 2022-Datacenter-smalldisk-g2 |
| MicrosoftWindowsServer  | WindowsServer | 2022-Datacenter-core |
| MicrosoftWindowsServer  | WindowsServer | 2022-Datacenter-core-smalldisk |
| MicrosoftWindowsServer  | WindowsServer | 2022-Datacenter-g2 |
| MicrosoftWindowsServer  | WindowsServer | Datacenter-core-20h2-with-containers-smalldisk-gs |
| MicrosoftWindowsServer  | WindowsServer | 2022-Datacenter-azure-edition |
| MicrosoftWindowsServer  | WindowsServer | 2022-Datacenter-azure-edition-smalldisk |
| MicrosoftWindowsServer  | WindowsServer | 2022-Datacenter-azure-edition-core |
| MicrosoftWindowsServer  | WindowsServer | 2022-Datacenter-azure-edition-core-smalldisk |

## Requirements for configuring automatic OS image upgrade

- The *version* property of the image must be set to *latest*.
- Must use application health probes or [Application Health extension](virtual-machine-scale-sets-health-extension.md) for non-Service Fabric scale sets. For Service Fabric requirements, see [Service Fabric requirement](#service-fabric-requirements).
- Use Compute API version 2018-10-01 or higher.
- Ensure that external resources specified in the scale set model are available and updated. Examples include SAS URI for bootstrapping payload in VM extension properties, payload in storage account, reference to secrets in the model, and more.
- For scale sets using Windows virtual machines, starting with Compute API version 2019-03-01, the property *virtualMachineProfile.osProfile.windowsConfiguration.enableAutomaticUpdates* property must set to *false* in the scale set model definition. The *enableAutomaticUpdates* property enables in-VM patching where "Windows Update" applies operating system patches without replacing the OS disk. With automatic OS image upgrades enabled on your scale set, an extra patching process through Windows Update is not required.

> [!NOTE]
> After an OS disk is replaced through reimage or upgrade, the attached data disks may have their drive letters reassigned. To retain the same drive letters for attached disks, it is suggested to use a custom boot script. 


### Service Fabric requirements

If you are using Service Fabric, ensure the following conditions are met:
-	Service Fabric [durability level](../service-fabric/service-fabric-cluster-capacity.md#durability-characteristics-of-the-cluster) is Silver or Gold. If Service Fabric durability is Bronze, only Stateless-only node types support automatic OS image upgrades).
-	The Service Fabric extension on the scale set model definition must have TypeHandlerVersion 1.1 or above.
-	Durability level should be the same at the Service Fabric cluster and Service Fabric extension on the scale set model definition.
- An additional health probe or use of application health extension is not required for Silver or Gold durability. Bronze durability with Stateless-only node types requires an additional health probe.
- The property *virtualMachineProfile.osProfile.windowsConfiguration.enableAutomaticUpdates* property must set to *false* in the scale set model definition. The *enableAutomaticUpdates* property enables in-VM patching using "Windows Update" and is not supported on Service Fabric scale sets.

Ensure that durability settings are not mismatched on the Service Fabric cluster and Service Fabric extension, as a mismatch will result in upgrade errors. Durability levels can be modified per the guidelines outlined on [this page](../service-fabric/service-fabric-cluster-capacity.md#changing-durability-levels).


## Automatic OS image upgrade for custom images

Automatic OS image upgrade is supported for custom images deployed through [Azure Compute Gallery](../virtual-machines/shared-image-galleries.md). Other custom images are not supported for automatic OS image upgrades.

### Additional requirements for custom images
- The setup and configuration process for automatic OS image upgrade is the same for all scale sets as detailed in the [configuration section](virtual-machine-scale-sets-automatic-upgrade.md#configure-automatic-os-image-upgrade) of this page.
- Scale sets instances configured for automatic OS image upgrades will be upgraded to the latest version of the Azure Compute Gallery image when a new version of the image is published and [replicated](../virtual-machines/azure-compute-gallery.md#replication) to the region of that scale set. If the new image is not replicated to the region where the scale is deployed, the scale set instances will not be upgraded to the latest version. Regional image replication allows you to control the rollout of the new image for your scale sets.
- The new image version should not be excluded from the latest version for that gallery image. Image versions excluded from the gallery image's latest version are not rolled out to the scale set through automatic OS image upgrade.

> [!NOTE]
> It can take up to 3 hours for a scale set to trigger the first image upgrade rollout after the scale set is first configured for automatic OS upgrades due to certain factors such as Maintenance Windows or other restrictions. Customers on the latest image may not get an upgrade until a new image is available. 


## Configure automatic OS image upgrade
To configure automatic OS image upgrade, ensure that the *automaticOSUpgradePolicy.enableAutomaticOSUpgrade* property is set to *true* in the scale set model definition.

> [!NOTE]
> **Upgrade Policy mode** and **Automatic OS Upgrade Policy** are separate settings and control different aspects of the scale set. When there are changes in the scale set template, the Upgrade Policy `mode` will determine what happens to existing instances in the scale set. However, Automatic OS Upgrade Policy `enableAutomaticOSUpgrade` is specific to the OS image and tracks changes the image publisher has made and determines what happens when there is an update to the image.

### REST API
The following example describes how to set automatic OS upgrades on a scale set model:

```
PUT or PATCH on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet?api-version=2021-03-01`
```

```json
{
  "properties": {
    "upgradePolicy": {
      "automaticOSUpgradePolicy": {
        "enableAutomaticOSUpgrade":  true
      }
    }
  }
}
```

### Azure PowerShell
Use the [Update-AzVmss](/powershell/module/az.compute/update-azvmss) cmdlet to configure automatic OS image upgrades for your scale set. The following example configures automatic upgrades for the scale set named *myScaleSet* in the resource group named *myResourceGroup*:

```azurepowershell-interactive
Update-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -AutomaticOSUpgrade $true
```

### Azure CLI 2.0
Use [az vmss update](/cli/azure/vmss#az-vmss-update) to configure automatic OS image upgrades for your scale set. Use Azure CLI 2.0.47 or above. The following example configures automatic upgrades for the scale set named *myScaleSet* in the resource group named *myResourceGroup*:

```azurecli-interactive
az vmss update --name myScaleSet --resource-group myResourceGroup --set UpgradePolicy.AutomaticOSUpgradePolicy.EnableAutomaticOSUpgrade=true
```

> [!NOTE]
>After configuring automatic OS image upgrades for your scale set, you must also bring the scale set VMs to the latest scale set model if your scale set uses the 'Manual' [upgrade policy](virtual-machine-scale-sets-upgrade-policy.md).

### ARM templates
The following example describes how to set automatic OS upgrades on a scale set model via Azure Resource Manager templates (ARM templates):

```json
"properties": { 
   "upgradePolicy": { 
     "mode": "Automatic", 
     "RollingUpgradePolicy": {
         "BatchInstancePercent": 20,
         "MaxUnhealthyInstancePercent": 25,
         "MaxUnhealthyUpgradedInstancePercent": 25,
         "PauseTimeBetweenBatches": "PT0S"
     },
    "automaticOSUpgradePolicy": { 
      "enableAutomaticOSUpgrade": true,
        "useRollingUpgradePolicy": true,
        "disableAutomaticRollback": false 
    } 
  },
  },
"imagePublisher": {
   "type": "string",
   "defaultValue": "MicrosoftWindowsServer"
 },
 "imageOffer": {
   "type": "string",
   "defaultValue": "WindowsServer"
 },
 "imageSku": {
   "type": "string",
   "defaultValue": "2022-datacenter"
 },
 "imageOSVersion": {
   "type": "string",
   "defaultValue": "latest"
 }

```

### Bicep
The following example describes how to set automatic OS upgrades on a scale set model via Bicep:

```json
properties: { 
    overprovision: overProvision 
    upgradePolicy: { 
      mode: 'Automatic' 
      automaticOSUpgradePolicy: { 
        enableAutomaticOSUpgrade: true 
      } 
    } 
}
```

## Using Application Health Probes

During an OS Upgrade, VM instances in a scale set are upgraded one batch at a time. The upgrade should continue only if the customer application is healthy on the upgraded VM instances. We recommend that the application provides health signals to the scale set OS Upgrade engine. By default, during OS Upgrades the platform considers VM power state and extension provisioning state to determine if a VM instance is healthy after an upgrade. During the OS Upgrade of a VM instance, the OS disk on a VM instance is replaced with a new disk based on latest image version. After the OS Upgrade has completed, the configured extensions are run on these VMs. The application is considered healthy only when all the extensions on the instance are successfully provisioned.

A scale set can optionally be configured with Application Health Probes to provide the platform with accurate information on the ongoing state of the application. Application Health Probes are Custom Load Balancer Probes that are used as a health signal. The application running on a scale set VM instance can respond to external HTTP or TCP requests indicating whether it's healthy. For more information on how Custom Load Balancer Probes work, see to [Understand load balancer probes](../load-balancer/load-balancer-custom-probe-overview.md). Application Health Probes are not supported for Service Fabric scale sets. Non-Service Fabric scale sets require either Load Balancer application health probes or [Application Health extension](virtual-machine-scale-sets-health-extension.md).

If the scale set is configured to use multiple placement groups, probes using a [Standard Load Balancer](../load-balancer/load-balancer-overview.md) need to be used.

### Configuring a Custom Load Balancer Probe as Application Health Probe on a scale set
As a best practice, create a load balancer probe explicitly for scale set health. The same endpoint for an existing HTTP probe or TCP probe can be used, but a health probe could require different behavior from a traditional load-balancer probe. For example, a traditional load balancer probe could return unhealthy if the load on the instance is too high, but that would not be appropriate for determining the instance health during an automatic OS upgrade. Configure the probe to have a high probing rate of less than two minutes.

The load-balancer probe can be referenced in the *networkProfile* of the scale set and can be associated with either an internal or public facing load-balancer as follows:

```json
"networkProfile": {
  "healthProbe" : {
    "id": "[concat(variables('lbId'), '/probes/', variables('sshProbeName'))]"
  },
  "networkInterfaceConfigurations":
  ...
}
```

> [!NOTE]
> When using Automatic OS Upgrades with Service Fabric, the new OS image is rolled out Update Domain by Update Domain to maintain high availability of the services running in Service Fabric. To utilize Automatic OS Upgrades in Service Fabric your cluster node type must be configured to use the Silver Durability Tier or higher. For Bronze Durability tier, automatic OS image upgrade is only supported for Stateless node types. For more information on the durability characteristics of Service Fabric clusters, please see [this documentation](../service-fabric/service-fabric-cluster-capacity.md#durability-characteristics-of-the-cluster).

### Keep credentials up to date
If your scale set uses any credentials to access external resources, such as a VM extension configured to use a SAS token for storage account, then ensure that the credentials are updated. If any credentials, including certificates and tokens, have expired, the upgrade will fail and the first batch of VMs will be left in a failed state.

The recommended steps to recover VMs and re-enable automatic OS upgrade if there's a resource authentication failure are:

* Regenerate the token (or any other credentials) passed into your extension(s).
* Ensure that any credential used from inside the VM to talk to external entities is up to date.
* Update extension(s) in the scale set model with any new tokens.
* Deploy the updated scale set, which will update all VM instances including the failed ones.

## Using Application Health extension
The Application Health extension is deployed inside a Virtual Machine Scale Set instance and reports on VM health from inside the scale set instance. You can configure the extension to probe on an application endpoint and update the status of the application on that instance. This instance status is checked by Azure to determine whether an instance is eligible for upgrade operations.

As the extension reports health from within a VM, the extension can be used in situations where external probes such as Application Health Probes (that utilize custom Azure Load Balancer [probes](../load-balancer/load-balancer-custom-probe-overview.md)) can’t be used.

There are multiple ways of deploying the Application Health extension to your scale sets as detailed in the examples in [this article](virtual-machine-scale-sets-health-extension.md#deploy-the-application-health-extension).

## Get the history of automatic OS image upgrades
You can check the history of the most recent OS upgrade performed on your scale set with Azure PowerShell, Azure CLI 2.0, or the REST APIs. You can get history for the last five OS upgrade attempts within the past two months.

### REST API
The following example uses [REST API](/rest/api/compute/virtualmachinescalesets/getosupgradehistory) to check the status for the scale set named *myScaleSet* in the resource group named *myResourceGroup*:

```
GET on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/osUpgradeHistory?api-version=2021-03-01`
```

The GET call returns properties similar to the following example output:

```json
{
	"value": [
		{
			"properties": {
        "runningStatus": {
          "code": "RollingForward",
          "startTime": "2018-07-24T17:46:06.1248429+00:00",
          "completedTime": "2018-04-21T12:29:25.0511245+00:00"
        },
        "progress": {
          "successfulInstanceCount": 16,
          "failedInstanceCount": 0,
          "inProgressInstanceCount": 4,
          "pendingInstanceCount": 0
        },
        "startedBy": "Platform",
        "targetImageReference": {
          "publisher": "MicrosoftWindowsServer",
          "offer": "WindowsServer",
          "sku": "2016-Datacenter",
          "version": "2016.127.20180613"
        },
        "rollbackInfo": {
          "successfullyRolledbackInstanceCount": 0,
          "failedRolledbackInstanceCount": 0
        }
      },
      "type": "Microsoft.Compute/virtualMachineScaleSets/rollingUpgrades",
      "location": "westeurope"
    }
  ]
}
```

### Azure PowerShell
Use the [Get-AzVmss](/powershell/module/az.compute/get-azvmss) cmdlet to check OS upgrade history for your scale set. The following example details how you review the OS upgrade status for a scale set named *myScaleSet* in the resource group named *myResourceGroup*:

```azurepowershell-interactive
Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -OSUpgradeHistory
```

### Azure CLI 2.0
Use [az vmss get-os-upgrade-history](/cli/azure/vmss#az-vmss-get-os-upgrade-history) to check the OS upgrade history for your scale set. Use Azure CLI 2.0.47 or above. The following example details how you review the OS upgrade status for a scale set named *myScaleSet* in the resource group named *myResourceGroup*:

```azurecli-interactive
az vmss get-os-upgrade-history --resource-group myResourceGroup --name myScaleSet
```

## How to get the latest version of a platform OS image?

You can get the available image versions for automatic OS upgrade supported SKUs using the below examples:

### REST API
```
GET on `/subscriptions/subscription_id/providers/Microsoft.Compute/locations/{location}/publishers/{publisherName}/artifacttypes/vmimage/offers/{offer}/skus/{skus}/versions?api-version=2021-03-01`
```

### Azure PowerShell
```azurepowershell-interactive
Get-AzVmImage -Location "westus" -PublisherName "Canonical" -offer "0001-com-ubuntu-server-jammy" -sku "22_04-lts"
```

### Azure CLI 2.0
```azurecli-interactive
az vm image list --location "westus" --publisher "Canonical" --offer "0001-com-ubuntu-server-jammy" --sku "22_04-lts" --all
```

## Manually trigger OS image upgrades
With automatic OS image upgrade enabled on your scale set, you do not need to manually trigger image updates on your scale set. The OS upgrade orchestrator will automatically apply the latest available image version to your scale set instances without any manual intervention.

For specific cases where you do not want to wait for the orchestrator to apply the latest image, you can trigger an OS image upgrade manually using the below examples.

> [!NOTE]
> Manual trigger of OS image upgrades does not provide automatic rollback capabilities. If an instance does not recover its health after an upgrade operation, its previous OS disk can't be restored.

### REST API
Use the [Start OS Upgrade](/rest/api/compute/virtualmachinescalesetrollingupgrades/startosupgrade) API call to start a rolling upgrade to move all Virtual Machine Scale Set instances to the latest available image OS version. Instances that are already running the latest available OS version are not affected. The following example details how you can start a rolling OS upgrade on a scale set named *myScaleSet* in the resource group named *myResourceGroup*:

```
POST on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/osRollingUpgrade?api-version=2021-03-01`
```

### Azure PowerShell
Use the [Start-AzVmssRollingOSUpgrade](/powershell/module/az.compute/Start-AzVmssRollingOSUpgrade) cmdlet to check OS upgrade history for your scale set. The following example details how you can start a rolling OS upgrade on a scale set named *myScaleSet* in the resource group named *myResourceGroup*:

```azurepowershell-interactive
Start-AzVmssRollingOSUpgrade -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"
```

### Azure CLI 2.0
Use [az vmss rolling-upgrade start](/cli/azure/vmss/rolling-upgrade#az-vmss-rolling-upgrade-start) to check the OS upgrade history for your scale set. Use Azure CLI 2.0.47 or above. The following example details how you can start a rolling OS upgrade on a scale set named *myScaleSet* in the resource group named *myResourceGroup*:

```azurecli-interactive
az vmss rolling-upgrade start --resource-group "myResourceGroup" --name "myScaleSet" --subscription "subscriptionId"
```

## Next steps
> [!div class="nextstepaction"]
> [Learn about the Application Health Extension](../virtual-machine-scale-sets/virtual-machine-scale-sets-health-extension.md)
