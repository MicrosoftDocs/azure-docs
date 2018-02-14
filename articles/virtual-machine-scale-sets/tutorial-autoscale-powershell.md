---
title: Autoscale a virtual machine scale set with Azure PowerShell | Microsoft Docs
description: Learn how to automatically scale a virtual machine scale set with Azure PowerShell as CPU demands increases and decreases
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 02/14/2018
ms.author: iainfou
ms.custom: mvc

---
# Automatically scale a virtual machine scale set with Azure PowerShell
When you create a scale set, you define the number of VM instances that you wish to run. As your application demand changes, you can automatically increase or decrease the number of VM instances. The ability to autoscale lets you keep up with customer demand or respond to application performance changes throughout the lifecycle of your app. In this tutorial you learn how to:

> [!div class="checklist"]
> * Use autoscale with a scale set
> * Create and use autoscale rules
> * Stress-test VM instances and trigger autoscale rules
> * Autoscale back in as demand is reduced

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.1.1 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure.


## Create a scale set
To help create the autoscale rules, define some parameters for your subscription ID, resource group and scale set name, and location:

```azurepowershell-interactive
$mySubscriptionId = (Get-AzureRmSubscription).Id
$myResourceGroup = "myResourceGroup"
$myScaleSet = "myScaleSet"
$myLocation = "East US"
```

Create a resource group with [az group create](/cli/azure/group#create) as follows:

```azurepowershell-interactive
az group create --name $resourcegroup_name --location $location_name
```

Now create a virtual machine scale set with [az vmss create](/cli/azure/vmss#create). The following example creates a scale set with an instance count of *2*, and generates SSH keys if they do not exist:

```azurepowershell-interactive
az vmss create \
  --resource-group $resourcegroup_name \
  --name $scaleset_name \
  --image UbuntuLTS \
  --upgrade-policy-mode automatic \
  --instance-count 2 \
  --admin-username azureuser \
  --generate-ssh-keys
```

## Create a rule to autoscale out
If your application demand increases, the load on the VM instances in your scale set increases. If this increased load is consistent, rather than just a brief demand, you can configure autoscale rules to increase the number of VM instances in the scale set. When these VM instances are created and your applications are deployed, the scale set starts to distribute traffic to them through the load balancer. You control what metrics to monitor, such as CPU or disk, how long the application load must meet a given threshold, and how many VM instances to add to the scale set.

Let's create a rule with [New-AzureRmAutoscaleRule](/powershell/module/AzureRM.Insights/New-AzureRmAutoscaleRule) that increases the number of VM instances in a scale set when the average CPU load is greater than 70% over a 5-minute period. When the rule triggers, the number of VM instances is increased by 20%. In scale sets with a small number of VM instances, you could leave out `-ScaleActionScaleType` and only specify `-ScaleActionValue` to increase by *1* or *2* instances. In scale sets with a large number of VM instances, an increase of 10% or 20% VM instances may be more appropriate.

The following parameters are used for this rule:

| Parameter               | Explanation                                                                                                         | Value          |
|-------------------------|---------------------------------------------------------------------------------------------------------------------|----------------|
| *-MetricName*           | The performance metric to monitor and apply scale set actions on.                                                   | Percentage CPU |
| *-TimeGrain*            | How often the metrics are collected for analysis.                                                                   | 1 minute       |
| *-MetricStatistic*      | Defines how the collected metrics should be aggregated for analysis.                                                | Average        |
| *-TimeWindow*           | The amount of time monitored before the metric and threshold values are compared.                                   | 10 minutes     |
| *-Operator*             | Operator used to compare the metric data against the threshold.                                                     | Greater Than   |
| *-Threshold*            | The value that causes the autoscale rule to trigger an action.                                                      | 70%            |
| *-ScaleActionDirection* | Defines if the scale set should scale up or down when the rule applies.                                             | Increase       |
| *–ScaleActionScaleType* | Indicates that the number of VM instances should be changed by a percentage amount.                                 | Percent Change |
| *-ScaleActionValue*     | The percentage of VM instances should be changed when the rule triggers.                                            | 20             |
| *-ScaleActionCooldown*  | The amount of time to wait before the rule is applied again so that the autoscale actions have time to take effect. | 5 minutes      |

The following example creates an object named *myRuleScaleOut* that holds this scale up rule. The *-MetricResourceId* uses the variables previously defined for the subscription ID, resource group name, and scale set name:

```azurepowershell-interactive
$myRuleScaleOut = New-AzureRmAutoscaleRule `
  -MetricName "Percentage CPU" `
  -MetricResourceId /subscriptions/$mySubscriptionId/resourceGroups/$myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/$myScaleSet `
  -TimeGrain 00:01:00 `
  -MetricStatistic Average `
  -TimeWindow 00:10:00 `
  -Operator GreaterThan `
  -Threshold 70 `
  -ScaleActionDirection Increase `
  –ScaleActionScaleType PercentChangeCount `
  -ScaleActionValue 20 `
  -ScaleActionCooldown 00:05:00
```


## Create a rule to autoscale in
On an evening or weekend, your application demand may decrease. If this decreased load is consistent over a period of time, you can configure autoscale rules to decrease the number of VM instances in the scale set. This scale-in action reduces the cost to run your scale set as you only run the number of instances required to meet the current demand.

Create another rule with [New-AzureRmAutoscaleRule](/powershell/module/AzureRM.Insights/New-AzureRmAutoscaleRule) that decreases the number of VM instances in a scale set when the average CPU load then drops below 30% over a 10-minute period. When the rule triggers, the number of VM instances is decreased by 20%.The following example creates an object named *myRuleScaleDown* that holds this scale up rule. The *-MetricResourceId* uses the variables previously defined for the subscription ID, resource group name, and scale set name:

```azurepowershell-interactive
$myRuleScaleIn = New-AzureRmAutoscaleRule `
  -MetricName "Percentage CPU" `
  -MetricResourceId /subscriptions/$mySubscriptionId/resourceGroups/$myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/$myScaleSet `
  -Operator LessThan `
  -MetricStatistic Average `
  -Threshold 30 `
  -TimeGrain 00:01:00 `
  -TimeWindow 00:10:00 `
  -ScaleActionCooldown 00:05:00 `
  -ScaleActionDirection Decrease `
  –ScaleActionScaleType PercentChangeCount `
  -ScaleActionValue 20
```


## Define an autoscale profile
To associate your autoscale rules with a scale set, you create a profile. The autoscale profile defines the default, minimum, and maximum scale set capacity, and associates your autoscale rules. Create an autoscale profile with [New-AzureRmAutoscaleProfile](/powershell/module/AzureRM.Insights/New-AzureRmAutoscaleProfile). The following example sets the default, and minimum, capacity of *2* VM instances, and a maximum of *10*. The scale out and scale in rules created in the preceding steps are then attached:

```azurepowershell-interactive
$myScaleProfile = New-AzureRmAutoscaleProfile `
  -DefaultCapacity 2  `
  -MaximumCapacity 10 `
  -MinimumCapacity 2 `
  -Rules $myRuleScaleOut,$myRuleScaleIn `
  -Name "autoprofile"
```


## Apply autoscale rules to a scale set
The final step is to apply the autoscale profile to your scale set. Your scale is then able to automatically scale in or out based on the application demand. Apply the autoscale profile with [Add-AzureRmAutoscaleSetting](/powershell/module/AzureRM.Insights/Add-AzureRmAutoscaleSetting) as follows:

```azurepowershell-interactive
Add-AzureRmAutoscaleSetting `
  -Location $myLocation `
  -Name "autosetting" `
  -ResourceGroup $myResourceGroup `
  -TargetResourceId /subscriptions/$mySubscriptionId/resourceGroups/$myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/$myScaleSet `
  -AutoscaleProfiles $myScaleProfile
```


## Generate CPU load on scale set
To test the autoscale rules, lets generate some CPU load on the VM instances in the scale set. This simulated CPU causes the autoscales to scale out and increase the number of VM instances. As the simulated CPU load is then decreased, the autoscale rules scale in and reduce the number of VM instances.

To list the NAT ports to connect to VM instances in a scale set, first get the load balancer object with [Get-AzureRmLoadBalancer](/powershell/module/AzureRM.Network/Get-AzureRmLoadBalancer). Then, view the inbound NAT rules with [Get-AzureRmLoadBalancerInboundNatRuleConfig](/powershell/module/AzureRM.Network/Get-AzureRmLoadBalancerInboundNatRuleConfig):

```azurepowershell-interactive
# Get the load balancer object
$lb = Get-AzureRmLoadBalancer -ResourceGroupName "myResourceGroup" -Name "myLoadBalancer"

# View the list of inbound NAT rules
Get-AzureRmLoadBalancerInboundNatRuleConfig -LoadBalancer $lb | Select-Object Name,Protocol,FrontEndPort,BackEndPort
```

The following example output shows the instance name, public IP address of the load balancer, and port number that the NAT rules forward traffic to:

```powershell
Name        Protocol FrontendPort BackendPort
----        -------- ------------ -----------
myRDPRule.0 Tcp             50001        3389
myRDPRule.1 Tcp             50002        3389
```

The *Name* of the rule aligns with the name of the VM instance as shown in a previous [Get-AzureRmVmssVM](/powershell/module/azurerm.compute/get-azurermvmssvm) command. For example, to connect to VM instance *0*, you use *myRDPRule.0* and connect to port *50001*. To connect to VM instance *1*, use the value from *myRDPRule.1* and connect to port *50002*.

View the public IP address of the load balancer with [Get-AzureRmPublicIpAddress](/powershell/module/AzureRM.Network/Get-AzureRmPublicIpAddress):

```azurepowershell-interactive
Get-AzureRmPublicIpAddress -ResourceGroupName "myResourceGroup" -Name myPublicIP | Select IpAddress
```

Example output:

```powershell
IpAddress
---------
52.168.121.216
```

Create a remote connection to your first VM instance. Specify your own public IP address and port number of the required VM instance, as shown from the preceding commands. When prompted, enter the credentials used when you created the scale set (by default in the sample commands, *azureuser* and *P@ssw0rd!*). If you use the Azure Cloud Shell, perform this step from a local PowerShell prompt or Remote Desktop Client. The following example connects to VM instance *1*:

```powershell
mstsc /v 52.168.121.216:50001
```

Once logged in, install the **stress** utility. Start *10* **stress** workers that generate CPU load. These workers run from for *420* seconds, which is enough to cause the autoscale rules to implement the desired action.

```azurepowershell-interactive
sudo apt-get -y install stress
sudo stress --cpu 10 --timeout 420 &
```

When **stress** shows output similar to *stress: info: [2688] dispatching hogs: 10 cpu, 0 io, 0 vm, 0 hdd*, press the *Enter* key to return to the prompt.

To confirm that **stress** generates CPU load, examine the active system load with the **top** utility:

```azuecli-interactive
top
```

Exit **top**, then close your connection to the VM instance. **stress** continues to run on the VM instance.

```azurepowershell-interactive
Ctrl-c
exit
```

Connect to second VM instance with the port number listed from the previous [az vmss list-instance-connection-info](/cli/azure/vmss#az_vmss_list_instance_connection_info):

```azurepowershell-interactive
ssh azureuser@13.92.224.66 -p 50003
```

Install and run **stress**, then start ten workers on this second VM instance.

```azurepowershell-interactive
sudo apt-get -y install stress
sudo stress --cpu 10 --timeout 420 &
```

Again, when **stress** shows output similar to *stress: info: [2713] dispatching hogs: 10 cpu, 0 io, 0 vm, 0 hdd*, press the *Enter* key to return to the prompt.

Close your connection to the second VM instance. **stress** continues to run on the VM instance.

```azurepowershell-interactive
exit
```

## Monitor the active autoscale rules
To monitor the number of VM instances in your scale set, use **watch**. It takes 5 minutes for the autoscale scales to begin the scale out process in response to the CPU load generated by **stress* on each of the VM instances:

```azurepowershell-interactive
watch az vmss list-instances \
  --resource-group $resourcegroup_name \
  --name $scaleset_name \
  --output table
```

Once the CPU threshold has been met, the autoscale scales increase the number of VM instances in the scale set. The following output shows three VMs created as the scale set autoscales out:

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

Once **stress** stops on the initial VM instances, the average CPU load returns to normal. After another 5 minutes, the autoscale rules then scale in the number of VM instances. Scale in actions remove VM instances with the highest IDs first. The following example output shows one VM instance deleted as the scale set autoscales in:

```bash
           6  True                  eastus      myScaleSet_6  Deleting             MYRESOURCEGROUP  9e4133dd-2c57-490e-ae45-90513ce3b336
```

Exit *watch* with `Ctrl-c`. The scale set continues to scale in every 5 minutes and remove one VM instance until the minimum instance count of 2 is reached.


## Clean up resources
To remove your scale set and additional resources, delete the resource group and all its resources with [az group delete](/cli/azure/group#az_group_delete):

```azurepowershell-interactive
az group delete --name $resourcegroup_name --yes --no-wait
```


## Next steps
In this tutorial, you learned how to automatically scale in or out a scale set with Azure PowerShell:

> [!div class="checklist"]
> * Use autoscale with a scale set
> * Create and use autoscale rules
> * Stress-test VM instances and trigger autoscale rules
> * Autoscale back in as demand is reduced

Advance to the next tutorial to learn how to automatically the VM instances in a scale set.

> [!div class="nextstepaction"]
> [Automatically upgrade scale set VM instances]()