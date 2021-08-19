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
Virtual machine scale sets are created with five fault domains by default in Azure regions with no zones. For the regions that support zonal deployment of virtual machine scale sets and this option is selected, the default value of the fault domain count is 1 for each of the zones. FD=1 in this case implies that the VM instances belonging to the scale set will be spread across many racks on a best effort basis.

You can also consider aligning the number of scale set fault domains with the number of Managed Disks fault domains. This alignment can help prevent loss of quorum if an entire Managed Disks fault domain goes down. The FD count can be set to less than or equal to the number of Managed Disks fault domains available in each of the regions. Refer to this [document](../virtual-machines/availability.md) to learn about the number of Managed Disks fault domains by region.

## REST API
You can set the property `properties.platformFaultDomainCount` to 1, 2, or 3 (default of 3 if not specified). Refer to the documentation for REST API [here](/rest/api/compute/virtualmachinescalesets/createorupdate).

## Azure CLI
You can set the parameter `--platform-fault-domain-count` to 1, 2, or 3 (default of 3 if not specified). Refer to the documentation for Azure CLI [here](/cli/azure/vmss#az_vmss_create).

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
