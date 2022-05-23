---
title: Manage fault domains in Azure virtual machine scale sets
description: Learn how to choose the right number of FDs while creating a virtual machine scale set.
author: mimckitt
ms.author: mimckitt
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.subservice: availability
ms.date: 12/18/2018
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli

---
# Choosing the right number of fault domains for virtual machine scale set

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Uniform scale sets :heavy_check_mark: Flexible scale sets

The spreading options available on the scale set depend on the orchestration mode and whether you are deploying a scale set using availability zones. The details of the options are described below. Dependent on the orchestration mode, you can consider using max spreading (platformFaultDomainCount = 1), which implies that the VM instances belonging to the scale set will be spread across as many fault domains as possible on a best effort basis. For a zonal scale set, max spreading implies the scale set spreads your VMs across as many fault domains as possible within each zone, on a best effort bases. This spreading could be across greater or fewer than five fault domains per zone. 

With static fixed spreading, the scale set spreads your VMs across exactly five fault domains per zone / region. If the scale set cannot find five distinct fault domains per zone / region to satisfy the allocation request, the request fails.

You can also consider aligning the number of scale set fault domains with the number of Managed Disks fault domains. This alignment can help prevent loss of quorum if an entire Managed Disks fault domain goes down. The FD count can be set to less than or equal to the number of Managed Disks fault domains available in each of the regions.

**We recommend deploying with max spreading for most workloads**, as this approach provides the best spreading in most cases. If you need replicas to be spread across distinct hardware isolation units, we recommend spreading across Availability Zones and utilize max spreading within each zone.

> [!NOTE]
> With max spreading, you do not see any fault domains in the scale set VM instance view and in the instance metadata regardless of how many fault domains the VMs are spread across. The spreading within each zone is implicit.

## Uniform orchestration mode
When you deploy a regional (non-zonal) scale set as of API version *2017-12-01*, you have the following availability options:

- Max spreading (platformFaultDomainCount = 1)
- Static fixed spreading (platformFaultDomainCount = 5)*
- Spreading aligned with storage disk fault domains (platformFaultDomainCount = 2 or 3)

When you deploy a zonal scale set, you have the following availability options:

- Max spreading (platformFaultDomainCount = 1)*
- Static fixed spreading (platformFaultDomainCount = 5)

*default if not specified when using the Azure CLI `az vmss create`.

## Flexible orchestration mode
When you deploy a regional (non-zonal) scale set as of API version *2020-12-01*, you have the following availability options:

- Max spreading (platformFaultDomainCount = 1)*
- Spreading aligned with storage disk fault domains (platformFaultDomainCount = 2 or 3)

When you deploy a zonal scale set, you have the following availability options:

- Max spreading (platformFaultDomainCount = 1)*

*default if not specified when using the Azure CLI `az vmss create`

 
## REST API
You can set the property `properties.platformFaultDomainCount` to 1, 2, 3 or 5 as explained above. Refer to the documentation for REST API [here](/rest/api/compute/virtualmachinescalesets/createorupdate).

## Azure CLI
You can set the parameter `--platform-fault-domain-count` to 1, 2, 3 or 5 as explained above. Refer to the documentation for Azure CLI [here](/cli/azure/vmss#az-vmss-create).

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --image UbuntuLTS \
  --upgrade-policy-mode automatic \
  --admin-username azureuser \
  --platform-fault-domain-count 3\
  --generate-ssh-keys
```

It takes a few minutes to create and configure all the scale set resources and VMs.

## Next steps
- Learn more about [availability and redundancy features](../virtual-machines/availability.md) for Azure environments.
