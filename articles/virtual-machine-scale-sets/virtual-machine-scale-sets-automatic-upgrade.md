---
title: Automatic OS image upgrades with Azure virtual machine scale sets | Microsoft Docs
description: Learn how to automatically upgrade the OS image on VM instances in an scale set
services: virtual-machine-scale-sets
documentationcenter: ''
author: rajsqr
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2018
ms.author: rajraj

---
# Azure virtual machine scale set automatic OS image upgrades

Automatic OS image upgrade is a feature of Azure virtual machine scale sets that automatically upgrades all VMs to the latest OS image.

Automatic OS upgrade has the following characteristics:

- Once configured, the latest OS image published by image publishers is automatically applied to the scale set without user intervention.
- Upgrades batches of instances in a rolling manner each time a new platform image is published by the publisher.
- Integrates with application health probe.
- Works for all VM sizes, and for both Windows and Linux platform images.
- You can opt out of automatic upgrades at any time (OS Upgrades can be initiated manually as well).
- The OS Disk of a VM is replaced with the new OS Disk created with latest image version. Configured extensions and custom data scripts are run, while persisted data disks are retained.
- Azure disk encryption (in preview) is currently not supported.  

## How does automatic OS image upgrade work?

An upgrade works by replacing the OS disk of a VM with a new one created using the latest image version. Any configured extensions and custom data scripts are run, while persisted data disks are retained. To minimize the application downtime, upgrades take place in batches of machines, with no more than 20% of the scale set upgrading at any time. You also have the option to integrate an Azure Load Balancer application health probe. It is highly recommended to incorporate an application heartbeat and validate upgrade success for each batch in the upgrade process. The execution steps are: 

1. Before beginning the upgrade process, the orchestrator will ensure that no more than 20% of instances are unhealthy. 
2. Identify the batch of VM instances to upgrade, with a batch having maximum of 20% of the total instance count.
3. Upgrade the OS image of this batch of VM instances.
4. If the customer has configured Application health probes, the upgrade waits up to 5 minutes for probes to become healthy, before moving on to upgrade the next batch. 
5. If there are remaining instances to upgrade, goto step 1) for the next batch; otherwise the upgrade is complete.

The scale set OS upgrade orchestrator checks for the overall VM instance health before upgrading every batch. While upgrading a batch, there may be other concurrent Planned or Unplanned maintenance happening in Azure Datacenters that may impact availability of your VMs. Hence, it is possible that temporarily more than 20% instances may be down. In such cases, at the end of current batch, the scale set upgrade stops.

## Supported OS images
Only certain OS platform images are currently supported. You cannot currently use custom images that you have you created yourself. 

The following SKUs are currently supported (more will be added in the future):
	
| Publisher               | OS Offer      |  Sku               |
|-------------------------|---------------|--------------------|
| Canonical               | UbuntuServer  | 16.04-LTS          |
| Canonical               | UbuntuServer  | 18.04-LTS *        | 
| Rogue Wave (OpenLogic)  | CentOS        | 7.5 *              | 
| CoreOS                  | CoreOS        | Stable             | 
| Microsoft Corporation   | WindowsServer | 2012-R2-Datacenter | 
| Microsoft Corporation   | WindowsServer | 2016-Datacenter    | 
| Microsoft Corporation   | WindowsServer | 2016-Datacenter-Smalldisk |
| Microsoft Corporation   | WindowsServer | 2016-Datacenter-with-Containers |

* Support for these images is currently rolling out and will be available in all the Azure regions shortly. 

## Requirements for configuring automatic OS image upgrade

- The *version* property of the platform image must be set to *latest*.
- Use application health probes for non Service Fabric scale sets.
- Ensure that the resources that the scale set model is referring to is available and kept up-to-date. 
  Exa.SAS URI for bootstrapping payload in VM extension properties, payload in storage account, reference to secrets in the model. 

## Configure automatic OS image upgrade
To configure automatic OS image upgrade, ensure that the *automaticOSUpgradePolicy.enableAutomaticOSUpgrade* property is set to *true* in the scale set model definition. 

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

The following example uses the Azure CLI (2.0.47 or later) to configure automatic upgrades for the scale set named *myVMSS* in the resource group named *myResourceGroup*:

```azurecli
az vmss update --name myVMSS --resource-group myResourceGroup --set UpgradePolicy.AutomaticOSUpgradePolicy.EnableAutomaticOSUpgrade=true
```
Support for configuring this property via Azure PowerShell will be rolled out soon.

## Using Application Health Probes 

During an OS Upgrade, VM instances in a scale set are upgraded one batch at a time. The upgrade should continue only if the customer application is healthy on the upgraded VM instances. We recommend that the application provides health signals to the scale set OS Upgrade engine. By default, during OS Upgrades the platform considers VM power state and extension provisioning state to determine if a VM instance is healthy after an upgrade. During the OS Upgrade of a VM instance, the OS disk on a VM instance is replaced with a new disk based on latest image version. After the OS Upgrade has completed, the configured extensions are run on these VMs. Only when all the extensions on a VM are successfully provisioned, is the application considered healthy. 

A scale set can optionally be configured with Application Health Probes to provide the platform with accurate information on the ongoing state of the application. Application Health Probes are Custom Load Balancer Probes that are used as a health signal. The application running on a scale set VM instance can respond to external HTTP or TCP requests indicating whether it is healthy. For more information on how Custom Load Balancer Probes work, see to [Understand load balancer probes](../load-balancer/load-balancer-custom-probe-overview.md). An Application Health Probe is not required for automatic OS upgrades, but it is highly recommended.

If the scale set is configured to use multiple placement groups, probes using a [Standard Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-overview) need to be used.

### Configuring a Custom Load Balancer Probe as Application Health Probe on a scale set
As a best practice, create a load balancer probe explicitly for scale set health. The same endpoint for an existing HTTP probe or TCP probe may be used, but a health probe may require different behavior from a traditional load-balancer probe. For example, a traditional load balancer probe may return unhealthy if the load on the instance is too high, whereas that may not be appropriate for determining the instance health during an automatic OS upgrade. Configure the probe to have a high probing rate of less than two minutes.

The load-balancer probe can be referenced in the *networkProfile* of the scale set and can be associated with either an internal or public facing load-balancer as follows:

```json
"networkProfile": {
  "healthProbe" : {
    "id": "[concat(variables('lbId'), '/probes/', variables('sshProbeName'))]"
  },
  "networkInterfaceConfigurations":
  ...
```
> [!NOTE]
> When using Automatic OS Upgrades with Service Fabric, the new OS image is rolled out Update Domain by Update Domain to maintain high availability of the services running in Service Fabric. For more information on the durability characteristics of Service Fabric clusters, please see [this documentation](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity#the-durability-characteristics-of-the-cluster).

### Keep credentials up-to-date
If your scale set uses any credentials to access external resources, for example if a VM extension is configured which uses a SAS token for storage account, you will need to make sure the credentials are kept up-to-date. If any credentials, including certificates and tokens have expired, the upgrade will fail, and the first batch of VMs will be left in a failed state.

The recommended steps to recover VMs and re-enable automatic OS upgrade if there is a resource authentication failure are:

* Regenerate the token (or any other credentials) passed into your extension(s).
* Ensure that any credential used from inside the VM to talk to external entities is up-to-date.
* Update extension(s) in the scale set model with any new tokens.
* Deploy the updated scale set, which will update all VM instances including the failed ones. 

## Get the history of automatic OS image upgrades 
You can check the history of the most recent OS upgrade performed on your scale set with Azure PowerShell, Azure CLI 2.0, or the REST APIs. You can get history for the last five OS upgrade attempts within the past two months.

### Azure PowerShell
To following example uses Azure PowerShell to check the status for the scale set named *myVMSS* in the resource group named *myResourceGroup*:

```powershell
Get-AzureRmVmss -ResourceGroupName myResourceGroup -VMScaleSetName myVMSS -OSUpgradeHistory
```

### Azure CLI 2.0
The following example uses the Azure CLI (2.0.47 or later) to check the status for the scale set named *myVMSS* in the resource group named *myResourceGroup*:

```azurecli
az vmss get-os-upgrade-history --resource-group myResourceGroup --name myVMSS
```

### REST API
The following example uses the REST API to check the status for the scale set named *myVMSS* in the resource group named *myResourceGroup*:

```
GET on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/osUpgradeHistory?api-version=2018-10-01`
```
Please refer to the documentation for this API here: https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/getosupgradehistory.

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

## How to get the latest version of a platform OS image? 

You can get the image versions for automatic OS upgrade supported SKUs using the below examples: 

```
GET on `/subscriptions/subscription_id/providers/Microsoft.Compute/locations/{location}/publishers/{publisherName}/artifacttypes/vmimage/offers/{offer}/skus/{skus}/versions?api-version=2018-10-01`
```

```powershell
Get-AzureRmVmImage -Location "westus" -PublisherName "Canonical" -Offer "UbuntuServer" -Skus "16.04-LTS"
```

```azurecli
az vm image list --location "westus" --publisher "Canonical" --offer "UbuntuServer" --sku "16.04-LTS" --all
```

## Deploy with a template

You can use the following template to deploy a scale set that uses automatic upgrades <a href='https://github.com/Azure/vm-scale-sets/blob/master/preview/upgrade/autoupdate.json'>Automatic rolling upgrades - Ubuntu 16.04-LTS</a>

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fvm-scale-sets%2Fmaster%2Fpreview%2Fupgrade%2Fautoupdate.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
</a>

## Next steps
For more examples on how to use automatic OS upgrades with scale sets, see the [GitHub repo for preview features](https://github.com/Azure/vm-scale-sets/tree/master/preview/upgrade).
