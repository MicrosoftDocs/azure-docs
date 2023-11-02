---
title: Auto-shutdown a VM
description: Learn how to set up auto-shutdown for VMs in Azure.
author: ericd-mst-github
ms.author: erd
ms.service: virtual-machines
ms.topic: tutorial
ms.custom: mvc, devx-track-azurecli
ms.date: 09/27/2023
---

# Auto-shutdown a virtual machine

In this tutorial, you learn how to automatically shut down virtual machines (VMs) in Azure. The auto-shutdown feature for Azure VMs can help reduce costs by shutting down the VMs during off hours when they aren't needed and automatically restarting them when they're needed again.

## Configure auto-shutdown for a virtual machine

### [Portal](#tab/portal)

Sign in to the [Azure portal](https://portal.azure.com/).
1. In the Azure portal, navigate to the virtual machine you want to configure auto-shutdown for.
2. In the virtual machine's detail page, select "Auto-shutdown" under the **Operations** section.
3. In the "Auto-shutdown" configuration screen, toggle the switch to "On."
4. Set the time you want the virtual machine to shut down.
5. Select "Save" to save the auto-shutdown configuration.

### [Azure CLI](#tab/azure-cli)

To configure auto-shutdown for a single virtual machine using the Azure CLI, you can use the following script:

```azurecli-interactive
# Set the resource group name, VM name, and shutdown time
RESOURCE_GROUP_NAME="myResourceGroup"
VM_NAME="myVM"  # Add your VM's name here
SHUTDOWN_TIME="18:00"

# Prompt the user to choose whether to auto-restart or leave the machines off
echo "Do you want to auto-restart the machine? (y/n)"
read RESTART_OPTION

# Set the auto-shutdown and auto-start properties based on the user's choice
if [ "$RESTART_OPTION" == "y" ]; then
  AUTO_SHUTDOWN="true"
  AUTO_START="true"
else
  AUTO_SHUTDOWN="true"
  AUTO_START="false"
fi

# Set the auto-shutdown and auto-start properties for the VM
az vm auto-shutdown -g $RESOURCE_GROUP_NAME -n $VM_NAME --time $SHUTDOWN_TIME

if [ "$AUTO_START" == "true" ]; then
  az vm restart -g $RESOURCE_GROUP_NAME -n $VM_NAME --no-wait
fi
```

To configure auto-shutdown for multiple virtual machines using the Azure CLI, you can use the following script:

```azurecli-interactive
# Set the resource group name and shutdown time
RESOURCE_GROUP_NAME="myResourceGroup"
SHUTDOWN_TIME="18:00"

# Prompt the user to choose whether to auto-restart or leave the machines off
echo "Do you want to auto-restart the machines? (y/n)"
read RESTART_OPTION

# Set the auto-shutdown and auto-start properties based on the user's choice
if [ "$RESTART_OPTION" == "y" ]; then
  AUTO_SHUTDOWN="true"
  AUTO_START="true"
else
  AUTO_SHUTDOWN="true"
  AUTO_START="false"
fi

# Loop through all VMs in the resource group and set the auto-shutdown and auto-start properties
for VM_ID in $(az vm list -g $RESOURCE_GROUP_NAME --query "[].id" -o tsv); do
  az vm auto-shutdown --ids $VM_ID --time $SHUTDOWN_TIME
  az vm restart --ids $VM_ID --no-wait
done
```

The above scripts use the `az vm auto-shutdown` and `az vm restart` commands to set the `auto-shutdown` and `restart` properties of all the VMs in the specified resource group. The `--ids` option is used to specify the VMs by their IDs, and the `--time` and `--auto-start-`enabled options are used to set the auto-shutdown and autostart properties, respectively.

Both scripts also prompt to choose whether to auto restart the machines or leave them off until they're manually restarted. The choice is used to set the -`-auto-shutdown-enabled` property of the VMs.

---

## Clean up resources

If you no longer need the virtual machine, delete it with the following steps:

1. Navigate to the virtual machine's **Overview** page on the left
1. Select on "Delete" from the top middle option.
1. Follow the prompts to delete the virtual machine.

For more information on how to delete a virtual machine, see [delete a VM](./delete.md).

## Next steps

Learn about sizes and how to resize a VM:
- Types of virtual machine [sizes.](./sizes.md)
- Change the [size of a virtual machine](./resize-vm.md).
