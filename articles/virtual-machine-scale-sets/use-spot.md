---
title: Create a scale set that uses Azure Spot Virtual Machines 
description: Learn how to create Azure virtual machine scale sets that use Azure Spot Virtual Machines to save on costs.
author: JagVeerappan
ms.author: jagaveer
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: spot
ms.date: 02/26/2021
ms.reviewer: cynthn
ms.custom: devx-track-azurecli, devx-track-azurepowershell

---

# Azure Spot Virtual Machines for virtual machine scale sets 

Using Azure Spot Virtual Machines on scale sets allows you to take advantage of our unused capacity at a significant cost savings. At any point in time when Azure needs the capacity back, the Azure infrastructure will evict Azure Spot Virtual Machine instances. Therefore, Azure Spot Virtual Machine instances are great for workloads that can handle interruptions like batch processing jobs, dev/test environments, large compute workloads, and more.

The amount of available capacity can vary based on size, region, time of day, and more. When deploying Azure Spot Virtual Machine instances on scale sets, Azure will allocate the instance only if there is capacity available, but there is no SLA for these instances. An Azure Spot Virtual machine scale set is deployed in a single fault domain and offers no high availability guarantees.


## Pricing

Pricing for Azure Spot Virtual Machine instances is variable, based on region and SKU. For more information, see pricing for [Linux](https://azure.microsoft.com/pricing/details/virtual-machine-scale-sets/linux/) and [Windows](https://azure.microsoft.com/pricing/details/virtual-machine-scale-sets/windows/). 


With variable pricing, you have option to set a max price, in US dollars (USD), using up to five decimal places. For example, the value `0.98765`would be a max price of $0.98765 USD per hour. If you set the max price to be `-1`, the instance won't be evicted based on price. The price for the instance will be the current price for Azure Spot Virtual Machine or the price for a standard instance, which ever is less, as long as there is capacity and quota available.


## Limitations

The following sizes are not supported for Azure Spot Virtual Machines:
 - B-series
 - Promo versions of any size (like Dv2, NV, NC, H promo sizes)

Azure Spot Virtual Machine can be deployed to any region, except Microsoft Azure China 21Vianet.

<a name="channel"></a>

The following [offer types](https://azure.microsoft.com/support/legal/offer-details/) are currently supported:

-	Enterprise Agreement
-	Pay-as-you-go offer code (003P)
-	Sponsored (0036P and 0136P)
- For Cloud Service Provider (CSP), see the [Partner Center](/partner-center/azure-plan-get-started) or contact your partner directly.

## Eviction policy

When creating a scale set using Azure Spot Virtual Machines, you can set the eviction policy to *Deallocate* (default) or *Delete*. 

The *Deallocate* policy moves your evicted instances to the stopped-deallocated state allowing you to redeploy evicted instances. However, there is no guarantee that the allocation will succeed. The deallocated VMs will count against your scale set instance quota and you will be charged for your underlying disks. 

If you would like your instances to be deleted when they are evicted, you can set the eviction policy to *delete*. With the eviction policy set to delete, you can create new VMs by increasing the scale set instance count property. The evicted VMs are deleted together with their underlying disks, and therefore you will not be charged for the storage. You can also use the auto-scaling feature of scale sets to automatically try and compensate for evicted VMs, however, there is no guarantee that the allocation will succeed. It is recommended you only use the autoscale feature on Azure Spot Virtual machine scale sets when you set the eviction policy to delete to avoid the cost of your disks and hitting quota limits. 

Users can opt in to receive in-VM notifications through [Azure Scheduled Events](../virtual-machines/linux/scheduled-events.md). This will notify you if your VMs are being evicted and you will have 30 seconds to finish any jobs and perform shutdown tasks prior to the eviction. 

<a name="bkmk_try"></a>
## Try & restore (preview)

This new platform-level feature will use AI to automatically try to restore evicted Azure Spot Virtual Machine instances inside a scale set to maintain the target instance count. 

> [!IMPORTANT]
> Try & restore is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Try & restore benefits:
- Attempts to restore Azure Spot Virtual Machines evicted due to capacity.
- Restored Azure Spot Virtual Machines are expected to run for a longer duration with a lower probability of a capacity triggered eviction.
- Improves the lifespan of an Azure Spot Virtual Machine, so workloads run for a longer duration.
- Helps Virtual Machine Scale Sets to maintain the target count for Azure Spot Virtual Machines, similar to maintain target count feature that already exist for Pay-As-You-Go VMs.

Try & restore is disabled in scale sets that use [Autoscale](virtual-machine-scale-sets-autoscale-overview.md). The number of VMs in the scale set is driven by the autoscale rules.

### Register for try & restore

Before you can use the try & restore feature, you must register your subscription for the preview. The registration may take several minutes to complete. You can use the Azure CLI or PowerShell to complete the feature registration.


**Use CLI**

Use [az feature register](/cli/azure/feature#az_feature_register) to enable the preview for your subscription. 

```azurecli-interactive
az feature register --namespace Microsoft.Compute --name SpotTryRestore 
```

Feature registration can take up to 15 minutes. To check the registration status: 

```azurecli-interactive
az feature show --namespace Microsoft.Compute --name SpotTryRestore 
```

Once the feature has been registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider. 

```azurecli-interactive
az provider register --namespace Microsoft.Compute 
```
**Use PowerShell** 

Use the [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) cmdlet to enable the preview for your subscription. 

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName SpotTryRestore -ProviderNamespace Microsoft.Compute 
```

Feature registration can take up to 15 minutes. To check the registration status: 

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName SpotTryRestore -ProviderNamespace Microsoft.Compute 
```

Once the feature has been registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider. 

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.Compute 
```

## Placement Groups

Placement group is a construct similar to an Azure availability set, with its own fault domains and upgrade domains. By default, a scale set consists of a single placement group with a maximum size of 100 VMs. If the scale set property called `singlePlacementGroup` is set to *false*, the scale set can be composed of multiple placement groups and has a range of 0-1,000 VMs. 

> [!IMPORTANT]
> Unless you are using Infiniband with HPC, it is strongly recommended to set the scale set property `singlePlacementGroup` to *false* to enable multiple placement groups for better scaling across the region or zone. 

## Deploying Azure Spot Virtual Machines in scale sets

To deploy Azure Spot Virtual Machines on scale sets, you can set the new *Priority* flag to *Spot*. All VMs in your scale set will be set to Spot. To create a scale set with Azure Spot Virtual Machines, use one of the following methods:
- [Azure portal](#portal)
- [Azure CLI](#azure-cli)
- [Azure PowerShell](#powershell)
- [Azure Resource Manager templates](#resource-manager-templates)

## Portal

The process to create a scale set that uses Azure Spot Virtual Machines is the same as detailed in the [getting started article](quick-create-portal.md). When you are deploying a scale set, you can choose to set the Spot flag, and the eviction policy:
![Create a scale set with Azure Spot Virtual Machines](media/virtual-machine-scale-sets-use-spot/vmss-spot-portal-max-price.png)


## Azure CLI

The process to create a scale set with Azure Spot Virtual Machines is the same as detailed in the [getting started article](quick-create-cli.md). Just add the '--Priority Spot', and add `--max-price`. In this example, we use `-1` for `--max-price` so the instance won't be evicted based on price.

```azurecli
az vmss create \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --image UbuntuLTS \
    --upgrade-policy-mode automatic \
    --single-placement-group false \
    --admin-username azureuser \
    --generate-ssh-keys \
    --priority Spot \
    --max-price -1 
```

## PowerShell

The process to create a scale set with Azure Spot Virtual Machines is the same as detailed in the [getting started article](quick-create-powershell.md).
Just add '-Priority Spot', and supply a `-max-price` to the [New-AzVmssConfig](/powershell/module/az.compute/new-azvmssconfig).

```powershell
$vmssConfig = New-AzVmssConfig `
    -Location "East US 2" `
    -SkuCapacity 2 `
    -SkuName "Standard_DS2" `
    -UpgradePolicyMode Automatic `
    -Priority "Spot" `
    -max-price -1
```

## Resource Manager templates

The process to create a scale set that uses Azure Spot Virtual Machines is the same as detailed in the getting started article for [Linux](quick-create-template-linux.md) or [Windows](quick-create-template-windows.md). 

For Azure Spot Virtual Machine template deployments, use`"apiVersion": "2019-03-01"` or later. 

Add the `priority`, `evictionPolicy` and `billingProfile` properties to the `"virtualMachineProfile":`section and the `"singlePlacementGroup": false,` property to the `"Microsoft.Compute/virtualMachineScaleSets"` section in your template:

```json

{
  "type": "Microsoft.Compute/virtualMachineScaleSets",
  },
  "properties": {
    "singlePlacementGroup": false,
    }

        "virtualMachineProfile": {
              "priority": "Spot",
                "evictionPolicy": "Deallocate",
                "billingProfile": {
                    "maxPrice": -1
                }
            },
```

To delete the instance after it has been evicted, change the `evictionPolicy` parameter to `Delete`.


## Simulate an eviction

You can [simulate an eviction](/rest/api/compute/virtualmachines/simulateeviction) of an Azure Spot Virtual Machine to test how well your application will respond to a sudden eviction. 

Replace the following with your information: 

- `subscriptionId`
- `resourceGroupName`
- `vmName`


```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}/simulateEviction?api-version=2020-06-01
```

`Response Code: 204` means the simulated eviction was successful. 

## FAQ

**Q:** Once created, is an Azure Spot Virtual Machine instance the same as standard instance?

**A:** Yes, except there is no SLA for Azure Spot Virtual Machines and they can be evicted at any time.


**Q:** What to do when you get evicted, but still need capacity?

**A:** We recommend you use standard VMs instead of Azure Spot Virtual Machines if you need capacity right away.


**Q:** How is quota managed for Azure Spot Virtual Machine?

**A:** Azure Spot Virtual Machine instances and standard instances will have separate quota pools. Azure Spot Virtual Machine quota will be shared between VMs and scale-set instances. For more information, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).


**Q:** Can I request for additional quota for Azure Spot Virtual Machine?

**A:** Yes, you will be able to submit the request to increase your quota for Azure Spot Virtual Machines through the [standard quota request process](../azure-portal/supportability/per-vm-quota-requests.md).


**Q:** Can I convert existing scale sets to Azure Spot Virtual machine scale sets?

**A:** No, setting the `Spot` flag is only supported at creation time.


**Q:** If I was using `low` for low-priority scale sets, do I need to start using `Spot` instead?

**A:** For now, both `low` and `Spot` will work, but you should start transitioning to using `Spot`.


**Q:** Can I create a scale set with both regular VMs and Azure Spot Virtual Machines?

**A:** No, a scale set cannot support more than one priority type.


**Q:**  Can I use autoscale with Azure Spot Virtual machine scale sets?

**A:** Yes, you can set autoscaling rules on your Azure Spot Virtual machine scale set. If your VMs are evicted, autoscale can try to create new Azure Spot Virtual Machines. Remember, you are not guaranteed this capacity though. 


**Q:**  Does autoscale work with both eviction policies (deallocate and delete)?

**A:** Yes, however it is recommended that you set your eviction policy to delete when using autoscale. This is because deallocated instances are counted against your capacity count on the scale set. When using autoscale, you will likely hit your target instance count quickly due to the deallocated, evicted instances. Also, your scaling operations could be impacted by spot evictions. For example, virtual machine scale set instances could fall below the set min count due to multiple spot evictions during scaling operations. 


**Q:** Where can I post questions?

**A:** You can post and tag your question with `azure-spot` at [Q&A](/answers/topics/azure-spot.html). 

## Next steps

Check out the [virtual machine scale set pricing page](https://azure.microsoft.com/pricing/details/virtual-machine-scale-sets/linux/) for pricing details.
