---
title: Get maintenance notifications using the CLI
description: View maintenance notifications for virtual machines running in Azure, and start self-service maintenance, using the Azure CLI.
author: shants123
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 11/19/2019
ms.author: shants
#pmcontact: shants
---

# Handling planned maintenance notifications using the Azure CLI

**This article applies to virtual machines running both Linux and Windows.**

You can use the CLI to see when VMs are scheduled for [maintenance](maintenance-notifications.md). Planned maintenance information is available from [az vm get-instance-view](https://docs.microsoft.com/cli/azure/vm?view=azure-cli-latest#az-vm-get-instance-view).
 
Maintenance information is returned only if there is maintenance planned. 

```azurecli-interactive
az vm get-instance-view -n myVM -g myResourceGroup --query instanceView.maintenanceRedeployStatus
```

## Start maintenance

The following call will start maintenance on a VM if `IsCustomerInitiatedMaintenanceAllowed` is set to true.

```azurecli-interactive
az vm perform-maintenance -g myResourceGroup -n myVM 
```

## Classic deployments

[!INCLUDE [classic-vm-deprecation](../../includes/classic-vm-deprecation.md)]

If you still have legacy VMs that were deployed using the classic deployment model, you can use the Azure classic CLI to query for VMs and initiate maintenance.

Make sure you are in the correct mode to work with classic VM by typing:

```
azure config mode asm
```

To get the maintenance status of a VM named *myVM*, type:

```
azure vm show myVM 
``` 

To start maintenance on your classic VM named *myVM* in the *myService* service and *myDeployment* deployment, type:

```
azure compute virtual-machine initiate-maintenance --service-name myService --name myDeployment --virtual-machine-name myVM
```

## Next steps

You can also handle planned maintenance using the [Azure PowerShell](maintenance-notifications-powershell.md) or [portal](maintenance-notifications-portal.md).
