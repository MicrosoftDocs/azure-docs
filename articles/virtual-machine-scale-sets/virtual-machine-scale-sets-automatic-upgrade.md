---
title: Automatic OS image upgrades with Azure virtual machine scale sets
description: Learn how to automatically upgrade the OS image on VM instances in a scale set
author: shandilvarun
tags: azure-resource-manager
ms.service: virtual-machine-scale-sets
ms.topic: conceptual
ms.date: 07/16/2019
ms.author: vashan

---
# Azure virtual machine scale set automatic OS image upgrades

Enabling automatic OS image upgrades on your scale set helps ease update management by safely and automatically upgrading the OS disk for all instances in the scale set.

Automatic OS upgrade has the following characteristics:

- Once configured, the latest OS image published by image publishers is automatically applied to the scale set without user intervention.
- Upgrades batches of instances in a rolling manner each time a new platform image is published by the publisher.
- Integrates with application health probes and [Application Health extension](virtual-machine-scale-sets-health-extension.md).
- Works for all VM sizes, and for both Windows and Linux platform images.
- You can opt out of automatic upgrades at any time (OS Upgrades can be initiated manually as well).
- The OS Disk of a VM is replaced with the new OS Disk created with latest image version. Configured extensions and custom data scripts are run, while persisted data disks are retained.
- [Extension sequencing](virtual-machine-scale-sets-extension-sequencing.md) is supported.
- Automatic OS image upgrade can be enabled on a scale set of any size.

## How does automatic OS image upgrade work?

An upgrade works by replacing the OS disk of a VM with a new disk created using the latest image version. Any configured extensions and custom data scripts are run on the OS disk, while persisted data disks are retained. To minimize the application downtime, upgrades take place in batches, with no more than 20% of the scale set upgrading at any time. You can also integrate an Azure Load Balancer application health probe or [Application Health extension](virtual-machine-scale-sets-health-extension.md). We recommended incorporating an application heartbeat and validate upgrade success for each batch in the upgrade process.

The upgrade process works as follows:
1. Before beginning the upgrade process, the orchestrator will ensure that no more than 20% of instances in the entire scale set are unhealthy (for any reason).
2. The upgrade orchestrator identifies the batch of VM instances to upgrade, with any one batch having a maximum of 20% of the total instance count. For smaller scale sets with 5 or fewer instances, the batch size for an upgrade is one virtual machine instance.
3. The OS disk of the selected batch of VM instances is replaced with a new OS disk created from the latest image. All specified extensions and configurations in the scale set model are applied to the upgraded instance.
4. For scale sets with configured application health probes or Application Health extension, the upgrade waits up to 5 minutes for the instance to become healthy, before moving on to upgrade the next batch. If an instance does not recover its health in 5 minutes after an upgrade, then by default the previous OS disk for the instance is restored.
5. The upgrade orchestrator also tracks the percentage of instances that become unhealthy post an upgrade. The upgrade will stop if more than 20% of upgraded instances become unhealthy during the upgrade process.
6. The above process continues until all instances in the scale set have been upgraded.

The scale set OS upgrade orchestrator checks for the overall scale set health before upgrading every batch. While upgrading a batch, there could be other concurrent planned or unplanned maintenance activities that could impact the health of your scale set instances. In such cases if more than 20% of the scale set's instances become unhealthy, then the scale set upgrade stops at the end of current batch.

## Supported OS images
Only certain OS platform images are currently supported. Custom images aren't currently supported.

The following SKUs are currently supported (and more are added periodically):

| Publisher               | OS Offer      |  Sku               |
|-------------------------|---------------|--------------------|
| Canonical               | UbuntuServer  | 16.04-LTS          |
| Canonical               | UbuntuServer  | 18.04-LTS          |
| Rogue Wave (OpenLogic)  | CentOS        | 7.5                |
| CoreOS                  | CoreOS        | Stable             |
| Microsoft Corporation   | WindowsServer | 2012-R2-Datacenter |
| Microsoft Corporation   | WindowsServer | 2016-Datacenter    |
| Microsoft Corporation   | WindowsServer | 2016-Datacenter-Smalldisk |
| Microsoft Corporation   | WindowsServer | 2016-Datacenter-with-Containers |
| Microsoft Corporation   | WindowsServer | 2019-Datacenter |
| Microsoft Corporation   | WindowsServer | 2019-Datacenter-Smalldisk |
| Microsoft Corporation   | WindowsServer | 2019-Datacenter-with-Containers |
| Microsoft Corporation   | WindowsServer | Datacenter-Core-1903-with-Containers-smalldisk |


## Requirements for configuring automatic OS image upgrade

- The *version* property of the platform image must be set to *latest*.
- Use application health probes or [Application Health extension](virtual-machine-scale-sets-health-extension.md) for non-Service Fabric scale sets.
- Use Compute API version 2018-10-01 or higher.
- Ensure that external resources specified in the scale set model are available and updated. Examples include SAS URI for bootstrapping payload in VM extension properties, payload in storage account, reference to secrets in the model, and more.
- For scale sets using Windows virtual machines, starting with Compute API version 2019-03-01, the property *virtualMachineProfile.osProfile.windowsConfiguration.enableAutomaticUpdates* property must set to *false* in the scale set model definition. The above property enables in-VM upgrades where "Windows Update" applies operating system patches without replacing the OS disk. With automatic OS image upgrades enabled on your scale set, an additional update through "Windows Update" is not required.

### Service Fabric requirements

If you are using Service Fabric, ensure the following conditions are met:
-	Service Fabric [durability level](../service-fabric/service-fabric-cluster-capacity.md#the-durability-characteristics-of-the-cluster) is Silver or Gold, and not Bronze.
-	The Service Fabric extension on the scale set model definition must have TypeHandlerVersion 1.1 or above.
-	Durability level should be the same at the Service Fabric cluster and Service Fabric extension on the scale set model definition.

Ensure that durability settings are not mismatched on the Service Fabric cluster and Service Fabric extension, as a mismatch will result in upgrade errors. Durability levels can be modified per the guidelines outlined on [this page](../service-fabric/service-fabric-cluster-capacity.md#changing-durability-levels).

## Configure automatic OS image upgrade
To configure automatic OS image upgrade, ensure that the *automaticOSUpgradePolicy.enableAutomaticOSUpgrade* property is set to *true* in the scale set model definition.

### REST API
The following example describes how to set automatic OS upgrades on a scale set model:

```
PUT or PATCH on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet?api-version=2018-10-01`
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

## Using Application Health Probes

During an OS Upgrade, VM instances in a scale set are upgraded one batch at a time. The upgrade should continue only if the customer application is healthy on the upgraded VM instances. We recommend that the application provides health signals to the scale set OS Upgrade engine. By default, during OS Upgrades the platform considers VM power state and extension provisioning state to determine if a VM instance is healthy after an upgrade. During the OS Upgrade of a VM instance, the OS disk on a VM instance is replaced with a new disk based on latest image version. After the OS Upgrade has completed, the configured extensions are run on these VMs. The application is considered healthy only when all the extensions on the instance are successfully provisioned.

A scale set can optionally be configured with Application Health Probes to provide the platform with accurate information on the ongoing state of the application. Application Health Probes are Custom Load Balancer Probes that are used as a health signal. The application running on a scale set VM instance can respond to external HTTP or TCP requests indicating whether it's healthy. For more information on how Custom Load Balancer Probes work, see to [Understand load balancer probes](../load-balancer/load-balancer-custom-probe-overview.md). Application Health Probes are not supported for Service Fabric scale sets. Non-Service Fabric scale sets require either Load Balancer application health probes or [Application Health extension](virtual-machine-scale-sets-health-extension.md).

If the scale set is configured to use multiple placement groups, probes using a [Standard Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-overview) need to be used.

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
> When using Automatic OS Upgrades with Service Fabric, the new OS image is rolled out Update Domain by Update Domain to maintain high availability of the services running in Service Fabric. To utilize Automatic OS Upgrades in Service Fabric your cluster must be configured to use the Silver Durability Tier or higher. For more information on the durability characteristics of Service Fabric clusters, please see [this documentation](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity#the-durability-characteristics-of-the-cluster).

### Keep credentials up-to-date
If your scale set uses any credentials to access external resources, such as a VM extension configured to use a SAS token for storage account, then ensure that the credentials are updated. If any credentials, including certificates and tokens, have expired, the upgrade will fail and the first batch of VMs will be left in a failed state.

The recommended steps to recover VMs and re-enable automatic OS upgrade if there's a resource authentication failure are:

* Regenerate the token (or any other credentials) passed into your extension(s).
* Ensure that any credential used from inside the VM to talk to external entities is up-to-date.
* Update extension(s) in the scale set model with any new tokens.
* Deploy the updated scale set, which will update all VM instances including the failed ones.

## Using Application Health extension
The Application Health extension is deployed inside a virtual machine scale set instance and reports on VM health from inside the scale set instance. You can configure the extension to probe on an application endpoint and update the status of the application on that instance. This instance status is checked by Azure to determine whether an instance is eligible for upgrade operations.

As the extension reports health from within a VM, the extension can be used in situations where external probes such as Application Health Probes (that utilize custom Azure Load Balancer [probes](../load-balancer/load-balancer-custom-probe-overview.md)) can’t be used.

There are multiple ways of deploying the Application Health extension to your scale sets as detailed in the examples in [this article](virtual-machine-scale-sets-health-extension.md#deploy-the-application-health-extension).

## Get the history of automatic OS image upgrades
You can check the history of the most recent OS upgrade performed on your scale set with Azure PowerShell, Azure CLI 2.0, or the REST APIs. You can get history for the last five OS upgrade attempts within the past two months.

### REST API
The following example uses [REST API](/rest/api/compute/virtualmachinescalesets/getosupgradehistory) to check the status for the scale set named *myScaleSet* in the resource group named *myResourceGroup*:

```
GET on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/osUpgradeHistory?api-version=2018-10-01`
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
GET on `/subscriptions/subscription_id/providers/Microsoft.Compute/locations/{location}/publishers/{publisherName}/artifacttypes/vmimage/offers/{offer}/skus/{skus}/versions?api-version=2018-10-01`
```

### Azure PowerShell
```azurepowershell-interactive
Get-AzVmImage -Location "westus" -PublisherName "Canonical" -Offer "UbuntuServer" -Skus "16.04-LTS"
```

### Azure CLI 2.0
```azurecli-interactive
az vm image list --location "westus" --publisher "Canonical" --offer "UbuntuServer" --sku "16.04-LTS" --all
```

## Manually trigger OS image upgrades
With automatic OS image upgrade enabled on your scale set, you do not need to manually trigger image updates on your scale set. The OS upgrade orchestrator will automatically apply the latest available image version to your scale set instances without any manual intervention.

For specific cases where you do not want to wait for the orchestrator to apply the latest image, you can trigger an OS image upgrade manually using the below examples.

> [!NOTE]
> Manual trigger of OS image upgrades does not provide automatic rollback capabilities. If an instance does not recover its health after an upgrade operation, its previous OS disk can't be restored.

### REST API
Use the [Start OS Upgrade](/rest/api/compute/virtualmachinescalesetrollingupgrades/startosupgrade) API call to start a rolling upgrade to move all virtual machine scale set instances to the latest available platform image OS version. Instances that are already running the latest available OS version are not affected. The following example details how you can start a rolling OS upgrade on a scale set named *myScaleSet* in the resource group named *myResourceGroup*:

```
POST on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/osRollingUpgrade?api-version=2018-10-01`
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

## Deploy with a template

You can use templates to deploy a scale set with automatic OS upgrades for supported images such as [Ubuntu 16.04-LTS](https://github.com/Azure/vm-scale-sets/blob/master/preview/upgrade/autoupdate.json).

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fvm-scale-sets%2Fmaster%2Fpreview%2Fupgrade%2Fautoupdate.json" target="_blank"><img src="https://azuredeploy.net/deploybutton.png"/></a>

## Next steps
For more examples on how to use automatic OS upgrades with scale sets, review the [GitHub repo](https://github.com/Azure/vm-scale-sets/tree/master/preview/upgrade).
