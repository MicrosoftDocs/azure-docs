---
title: Tutorial - Autoscale a scale set with Azure templates
description: Learn how to use Azure Resource Manager templates to automatically scale a virtual machine scale set as CPU demands increases and decreases
author: cynthn
tags: azure-resource-manager
ms.service: virtual-machine-scale-sets
ms.topic: tutorial
ms.date: 03/27/2018
ms.author: cynthn
ms.custom: mvc

---
# Tutorial: Automatically scale a virtual machine scale set with an Azure template
When you create a scale set, you define the number of VM instances that you wish to run. As your application demand changes, you can automatically increase or decrease the number of VM instances. The ability to autoscale lets you keep up with customer demand or respond to application performance changes throughout the lifecycle of your app. In this tutorial you learn how to:

> [!div class="checklist"]
> * Use autoscale with a scale set
> * Create and use autoscale rules
> * Stress-test VM instances and trigger autoscale rules
> * Autoscale back in as demand is reduced

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.29 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli). 


## Define an autoscale profile
You define an autoscale profile in an Azure template with the *Microsoft.insights/autoscalesettings* resource provider. A *profile* details the capacity of the scale set, and any associated rules. The following example defines a profile named *Autoscale by percentage based on CPU usage* and sets the default, and minimum, capacity of *2* VM instances, and a maximum of *10*:

```json
{
"type": "Microsoft.insights/autoscalesettings",
"name": "Autoscale",
"apiVersion": "2015-04-01",
"location": "[variables('location')]",
"scale": null,
"properties": {
  "profiles": [
    {
      "name": "Autoscale by percentage based on CPU usage",
      "capacity": {
        "minimum": "2",
        "maximum": "10",
        "default": "2"
      }
    }
  ]
}
```


## Define a rule to autoscale out
If your application demand increases, the load on the VM instances in your scale set increases. If this increased load is consistent, rather than just a brief demand, you can configure autoscale rules to increase the number of VM instances in the scale set. When these VM instances are created and your applications are deployed, the scale set starts to distribute traffic to them through the load balancer. You control what metrics to monitor, such as CPU or disk, how long the application load must meet a given threshold, and how many VM instances to add to the scale set.

In the following example, a rule is defined that increases the number of VM instances in a scale set when the average CPU load is greater than 70% over a 5-minute period. When the rule triggers, the number of VM instances is increased by three.

The following parameters are used for this rule:

| Parameter         | Explanation                                                                                                         | Value           |
|-------------------|---------------------------------------------------------------------------------------------------------------------|-----------------|
| *metricName*      | The performance metric to monitor and apply scale set actions on.                                                   | Percentage CPU  |
| *timeGrain*       | How often the metrics are collected for analysis.                                                                   | 1 minute        |
| *timeAggregation* | Defines how the collected metrics should be aggregated for analysis.                                                | Average         |
| *timeWindow*      | The amount of time monitored before the metric and threshold values are compared.                                   | 5 minutes       |
| *operator*        | Operator used to compare the metric data against the threshold.                                                     | Greater Than    |
| *threshold*       | The value that causes the autoscale rule to trigger an action.                                                      | 70%             |
| *direction*       | Defines if the scale set should scale in or out when the rule applies.                                              | Increase        |
| *type*            | Indicates that the number of VM instances should be changed by a specific value.                                    | Change Count    |
| *value*           | How many VM instances should be scaled in or out when the rule applies.                                             | 3               |
| *cooldown*        | The amount of time to wait before the rule is applied again so that the autoscale actions have time to take effect. | 5 minutes       |

The following rule would be added into the profile section of the *Microsoft.insights/autoscalesettings* resource provider from the previous section:

```json
"rules": [
  {
    "metricTrigger": {
      "metricName": "Percentage CPU",
      "metricNamespace": "",
      "metricResourceUri": "[concat('/subscriptions/',subscription().subscriptionId, '/resourceGroups/',  resourceGroup().name, '/providers/Microsoft.Compute/virtualMachineScaleSets/', variables('vmssName'))]",
      "metricResourceLocation": "[variables('location')]",
      "timeGrain": "PT1M",
      "statistic": "Average",
      "timeWindow": "PT5M",
      "timeAggregation": "Average",
      "operator": "GreaterThan",
      "threshold": 70
    },
    "scaleAction": {
      "direction": "Increase",
      "type": "ChangeCount",
      "value": "3",
      "cooldown": "PT5M"
    }
  }
]
```


## Define a rule to autoscale in
On an evening or weekend, your application demand may decrease. If this decreased load is consistent over a period of time, you can configure autoscale rules to decrease the number of VM instances in the scale set. This scale-in action reduces the cost to run your scale set as you only run the number of instances required to meet the current demand.

The following example defines a rule to scale in the number of VM instances by one when the average CPU load then drops below 30% over a 5-minute period. This rule would be added to the autoscale profile after the previous rule to scale out:

```json
{
  "metricTrigger": {
    "metricName": "Percentage CPU",
    "metricNamespace": "",
    "metricResourceUri": "[concat('/subscriptions/',subscription().subscriptionId, '/resourceGroups/',  resourceGroup().name, '/providers/Microsoft.Compute/virtualMachineScaleSets/', variables('vmssName'))]",
    "metricResourceLocation": "[variables('location')]",
    "timeGrain": "PT1M",
    "statistic": "Average",
    "timeWindow": "PT5M",
    "timeAggregation": "Average",
    "operator": "LessThan",
    "threshold": 30
  },
  "scaleAction": {
    "direction": "Decrease",
    "type": "ChangeCount",
    "value": "1",
    "cooldown": "PT5M"
  }
}
```


## Create an autoscaling scale set
Let's use a sample template to create a scale set and apply autoscale rules. You can [review the complete template](https://raw.githubusercontent.com/Azure-Samples/compute-automation-configurations/master/scale_sets/autoscale.json), or [see the *Microsoft.insights/autoscalesettings* resource provider section](https://github.com/Azure-Samples/compute-automation-configurations/blob/master/scale_sets/autoscale.json#L220) of the template.

First, create a resource group with [az group create](/cli/azure/group). The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Now create a virtual machine scale set with [az group deployment create](/cli/azure/group/deployment). When prompted, provide your own username, such as *azureuser*, and password that is used as the credentials for each VM instance:

```azurecli-interactive
az group deployment create \
  --resource-group myResourceGroup \
  --template-uri https://raw.githubusercontent.com/Azure-Samples/compute-automation-configurations/master/scale_sets/autoscale.json
```

It takes a few minutes to create and configure all the scale set resources and VMs.


## Generate CPU load on scale set
To test the autoscale rules, generate some CPU load on the VM instances in the scale set. This simulated CPU load causes the autoscale rules to scale out and increase the number of VM instances. As the simulated CPU load is then decreased, the autoscale rules scale in and reduce the number of VM instances.

First, list the address and ports to connect to VM instances in a scale set with [az vmss list-instance-connection-info](/cli/azure/vmss):

```azurecli-interactive
az vmss list-instance-connection-info \
  --resource-group myResourceGroup \
  --name myScaleSet
```

The following example output shows the instance name, public IP address of the load balancer, and port number that the Network Address Translation (NAT) rules forward traffic to:

```json
{
  "instance 1": "13.92.224.66:50001",
  "instance 3": "13.92.224.66:50003"
}
```

SSH to your first VM instance. Specify your own public IP address and port number with the `-p` parameter, as shown from the preceding command:

```azurecli-interactive
ssh azureuser@13.92.224.66 -p 50001
```

Once logged in, install the **stress** utility. Start *10* **stress** workers that generate CPU load. These workers run for *420* seconds, which is enough to cause the autoscale rules to implement the desired action.

```azurecli-interactive
sudo apt-get -y install stress
sudo stress --cpu 10 --timeout 420 &
```

When **stress** shows output similar to *stress: info: [2688] dispatching hogs: 10 cpu, 0 io, 0 vm, 0 hdd*, press the *Enter* key to return to the prompt.

To confirm that **stress** generates CPU load, examine the active system load with the **top** utility:

```azurecli-interactive
top
```

Exit **top**, then close your connection to the VM instance. **stress** continues to run on the VM instance.

```azurecli-interactive
Ctrl-c
exit
```

Connect to second VM instance with the port number listed from the previous [az vmss list-instance-connection-info](/cli/azure/vmss):

```azurecli-interactive
ssh azureuser@13.92.224.66 -p 50003
```

Install and run **stress**, then start ten workers on this second VM instance.

```azurecli-interactive
sudo apt-get -y install stress
sudo stress --cpu 10 --timeout 420 &
```

Again, when **stress** shows output similar to *stress: info: [2713] dispatching hogs: 10 cpu, 0 io, 0 vm, 0 hdd*, press the *Enter* key to return to the prompt.

Close your connection to the second VM instance. **stress** continues to run on the VM instance.

```azurecli-interactive
exit
```

## Monitor the active autoscale rules
To monitor the number of VM instances in your scale set, use **watch**. It takes 5 minutes for the autoscale rules to begin the scale out process in response to the CPU load generated by **stress** on each of the VM instances:

```azurecli-interactive
watch az vmss list-instances \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --output table
```

Once the CPU threshold has been met, the autoscale rules increase the number of VM instances in the scale set. The following output shows three VMs created as the scale set autoscales out:

```bash
Every 2.0s: az vmss list-instances --resource-group myResourceGroup --name myScaleSet --output table

  InstanceId  LatestModelApplied    Location    Name          ProvisioningState    ResourceGroup    VmId
------------  --------------------  ----------  ------------  -------------------  ---------------  ------------------------------------
           1  True                  eastus      myScaleSet_1  Succeeded            MYRESOURCEGROUP  4f92f350-2b68-464f-8a01-e5e590557955
           2  True                  eastus      myScaleSet_2  Succeeded            MYRESOURCEGROUP  d734cd3d-fb38-4302-817c-cfe35655d48e
           4  True                  eastus      myScaleSet_4  Creating             MYRESOURCEGROUP  061b4c90-0d73-49fc-a066-19eab0b3d95c
           5  True                  eastus      myScaleSet_5  Creating             MYRESOURCEGROUP  4beff8b9-4e65-40cb-9652-43899309da27
           6  True                  eastus      myScaleSet_6  Creating             MYRESOURCEGROUP  9e4133dd-2c57-490e-ae45-90513ce3b336
```

Once **stress** stops on the initial VM instances, the average CPU load returns to normal. After another 5 minutes, the autoscale rules then scale in the number of VM instances. Scale in actions remove VM instances with the highest IDs first. When a scale set uses Availability Sets or Availability Zones, scale in actions are evenly distributed across those VM instances. The following example output shows one VM instance deleted as the scale set autoscales in:

```bash
           6  True                  eastus      myScaleSet_6  Deleting             MYRESOURCEGROUP  9e4133dd-2c57-490e-ae45-90513ce3b336
```

Exit *watch* with `Ctrl-c`. The scale set continues to scale in every 5 minutes and remove one VM instance until the minimum instance count of two is reached.


## Clean up resources
To remove your scale set and additional resources, delete the resource group and all its resources with [az group delete](/cli/azure/group):

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

For more examples of virtual machine scale sets in action, see the following sample Azure CLI sample scripts:

> [!div class="nextstepaction"]
> [Scale set script samples for Azure CLI](cli-samples.md)
