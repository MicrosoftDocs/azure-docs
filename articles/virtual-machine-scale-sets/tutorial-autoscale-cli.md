---
title: Tutorial - Autoscale a scale set with the Azure CLI
description: Learn how to use the Azure CLI to automatically scale a Virtual Machine Scale Set as CPU demands increases and decreases
author: ju-shim
ms.author: jushiman
ms.topic: tutorial
ms.service: virtual-machine-scale-sets
ms.subservice: autoscale
ms.date: 12/16/2022
ms.reviewer: mimckitt
ms.custom: avverma, devx-track-azurecli, devx-track-linux
---
# Tutorial: Automatically scale a Virtual Machine Scale Set with the Azure CLI
When you create a scale set, you define the number of VM instances that you wish to run. As your application demand changes, you can automatically increase or decrease the number of VM instances. The ability to autoscale lets you keep up with customer demand or respond to application performance changes throughout the lifecycle of your app. In this tutorial you learn how to:

> [!div class="checklist"]
> * Use autoscale with a scale set
> * Create and use autoscale rules
> * Stress-test VM instances and trigger autoscale rules
> * Autoscale back in as demand is reduced

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This tutorial requires version 2.0.32 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a scale set
Create a resource group with [az group create](/cli/azure/group).

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Now create a Virtual Machine Scale Set with [az vmss create](/cli/azure/vmss). The following example creates a scale set with an instance count of *2*, and generates SSH keys if they don't exist.

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --image <SKU image> \
  --orchestration-mode Flexible \
  --instance-count 2 \
  --admin-username azureuser \
  --generate-ssh-keys
```

## Define an autoscale profile
To enable autoscale on a scale set, you first define an autoscale profile. This profile defines the default, minimum, and maximum scale set capacity. These limits let you control cost by not continually creating VM instances, and balance acceptable performance with a minimum number of instances that remain in a scale-in event. Create an autoscale profile with [az monitor autoscale create](/cli/azure/monitor/autoscale#az-monitor-autoscale-create). The following example sets the default, and minimum, capacity of *2* VM instances, and a maximum of *10*:

```azurecli-interactive
az monitor autoscale create \
  --resource-group myResourceGroup \
  --resource myScaleSet \
  --resource-type Microsoft.Compute/virtualMachineScaleSets \
  --name autoscale \
  --min-count 2 \
  --max-count 10 \
  --count 2
```

## Create a rule to autoscale out
If your application demand increases, the load on the VM instances in your scale set increases. If this increased load is consistent, rather than just a brief demand, you can configure autoscale rules to increase the number of VM instances in the scale set. When these VM instances are created and your applications are deployed, the scale set starts to distribute traffic to them through the load balancer. You control what metrics to monitor, how long the application load must meet a given threshold, and how many VM instances to add to the scale set.

Create a rule with [az monitor autoscale rule create](/cli/azure/monitor/autoscale/rule#az-monitor-autoscale-rule-create) that increases the number of VM instances in a scale set when the average CPU load is greater than 70% over a 5-minute period. When the rule triggers, the number of VM instances is increased by three.

```azurecli-interactive
az monitor autoscale rule create \
  --resource-group myResourceGroup \
  --autoscale-name autoscale \
  --condition "Percentage CPU > 70 avg 5m" \
  --scale out 3
```

## Create a rule to autoscale in
On an evening or weekend, your application demand may decrease. If this decreased load is consistent over a period of time, you can configure autoscale rules to decrease the number of VM instances in the scale set. This scale-in action reduces the cost to run your scale set as you only run the number of instances required to meet the current demand.

Create another rule with [az monitor autoscale rule create](/cli/azure/monitor/autoscale/rule#az-monitor-autoscale-rule-create) that decreases the number of VM instances in a scale set when the average CPU load then drops below 30% over a 5-minute period. The following example defines the rule to scale in the number of VM instances by one.

```azurecli-interactive
az monitor autoscale rule create \
  --resource-group myResourceGroup \
  --autoscale-name autoscale \
  --condition "Percentage CPU < 30 avg 5m" \
  --scale in 1
```

## Generate CPU load on scale set
To test the autoscale rules, generate some CPU load on the VM instances in the scale set. This simulated CPU load causes the autoscales to scale out and increase the number of VM instances. As the simulated CPU load is then decreased, the autoscale rules scale in and reduce the number of VM instances.

To connect to an individual instance, see [Tutorial: Connect to Virtual Machine Scale Set instances](tutorial-connect-to-instances-cli.md)

Once logged in, install the **stress** or **stress-ng** utility. Start *10* **stress** workers that generate CPU load. These workers run for *420* seconds, which is enough to cause the autoscale rules to implement the desired action.

# [Ubuntu, Debian](#tab/Ubuntu) 

```bash
sudo apt-get update
sudo apt-get -y install stress
sudo stress --cpu 10 --timeout 420 &
```
# [RHEL, CentOS](#tab/redhat) 

```bash
sudo dnf install stress-ng
sudo  stress-ng --cpu 10 --timeout 420s --metrics-brief &
```
# [SLES](#tab/SLES)

```bash
sudo zypper install stress-ng
sudo stress-ng --cpu 10 --timeout 420s --metrics-brief &
```
---

When **stress** shows output similar to *stress: info: [2688] dispatching hogs: 10 cpu, 0 io, 0 vm, 0 hdd*, press the *Enter* key to return to the prompt.

To confirm that **stress** generates CPU load, examine the active system load with the **top** utility:

```bash
top
```

Exit **top**, then close your connection to the VM instance. **stress** continues to run on the VM instance.

```bash
Ctrl-c
exit
```

Connect to second VM instance with the port number listed from the previous [az vmss list-instance-connection-info](/cli/azure/vmss):

```bash
ssh azureuser@13.92.224.66 -p 50003
```

Install and run **stress** or **stress-ng**, then start ten workers on this second VM instance.

# [Ubuntu, Debian](#tab/Ubuntu) 

```bash
sudo apt-get -y install stress
sudo stress --cpu 10 --timeout 420 &
```

# [RHEL, CentOS](#tab/redhat) 

```bash
sudo dnf install stress-ng
sudo  stress-ng --cpu 10 --timeout 420s --metrics-brief &
```

# [SLES](#tab/SLES)

```bash
sudo zypper install stress-ng
sudo stress-ng --cpu 10 --timeout 420s --metrics-brief &
```
---

Again, when **stress** shows output similar to *stress: info: [2713] dispatching hogs: 10 cpu, 0 io, 0 vm, 0 hdd*, press the *Enter* key to return to the prompt.

Close your connection to the second VM instance. **stress** continues to run on the VM instance.

```bash
exit
```

## Monitor the active autoscale rules
To monitor the number of VM instances in your scale set, use **watch**. It takes 5 minutes for the autoscale rules to begin the scale-out process in response to the CPU load generated by **stress** on each of the VM instances:

```azurecli-interactive
watch az vmss list-instances \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --output table
```

Once the CPU threshold has been met, the autoscale rules increase the number of VM instances in the scale set. The following output shows three VMs created as the scale set autoscales out:

```output
Every 2.0s: az vmss list-instances --resource-group myResourceGroup --name myScaleSet --output table

  InstanceId  LatestModelApplied    Location    Name          ProvisioningState    ResourceGroup    VmId
------------  --------------------  ----------  ------------  -------------------  ---------------  ------------------------------------
           1  True                  eastus      myScaleSet_1  Succeeded            myResourceGroup  4f92f350-2b68-464f-8a01-e5e590557955
           2  True                  eastus      myScaleSet_2  Succeeded            myResourceGroup  d734cd3d-fb38-4302-817c-cfe35655d48e
           4  True                  eastus      myScaleSet_4  Creating             myResourceGroup  061b4c90-0d73-49fc-a066-19eab0b3d95c
           5  True                  eastus      myScaleSet_5  Creating             myResourceGroup  4beff8b9-4e65-40cb-9652-43899309da27
           6  True                  eastus      myScaleSet_6  Creating             myResourceGroup  9e4133dd-2c57-490e-ae45-90513ce3b336
```

Once **stress** stops on the initial VM instances, the average CPU load returns to normal. After another 5 minutes, the autoscale rules then scale in the number of VM instances. Scale in actions remove VM instances with the highest IDs first. When a scale set uses Availability Sets or Availability Zones, scale in actions are evenly distributed across those VM instances. The following example output shows one VM instance deleted as the scale set autoscales in:

```output
6  True                  eastus      myScaleSet_6  Deleting             myResourceGroup  9e4133dd-2c57-490e-ae45-90513ce3b336
```

Exit *watch* with `Ctrl-c`. The scale set continues to scale in every 5 minutes and remove one VM instance until the minimum instance count of two is reached.

## Clean up resources
To remove your scale set and additional resources, delete the resource group and all its resources with [az group delete](/cli/azure/group). The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without an additional prompt to do so.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

## Next steps
In this tutorial, you learned how to automatically scale in or out a scale set with the Azure CLI:

> [!div class="checklist"]
> * Use autoscale with a scale set
> * Create and use autoscale rules
> * Stress-test VM instances and trigger autoscale rules
> * Autoscale back in as demand is reduced
