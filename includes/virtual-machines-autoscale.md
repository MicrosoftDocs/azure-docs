[Automatic scaling](../articles/monitoring-and-diagnostics/insights-autoscale-best-practices.md) of [virtual machines (VMs)](../articles/virtual-machines/windows/overview.md) is accomplished using a combination of [virtual machine scale sets](../articles/virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) and the [autoscaling feature of Azure Monitor](../articles/monitoring-and-diagnostics/monitoring-overview-autoscale.md). Your VMs need to be members of a scale set to be automatically scaled. This article provides information that enables you to better understand how to configure the automatic scaling of VMs in a scale set.

## Horizontal or vertical scaling

The autoscale feature of Azure Monitor only scales horizontally, which is an increase ("out") or decrease ("in") of the number of VMs. Horizontal scaling is more flexible in a cloud situation as it allows you to run potentially thousands of VMs to handle load. You scale horizontally by either automatically or manually changing the capacity (or instance count) of the the scale set. 

Vertical scaling keeps the same number of VMs, but makes the VMs more ("up") or less ("down") powerful. Power is measured in attributes such as memory, CPU speed, or disk space. Vertical scaling is dependent on the availability of larger hardware, which quickly hits an upper limit and can vary by region. Vertical scaling also usually requires a VM to stop and restart. You scale vertically by setting a new size in the configuration of the VMs in the scale set.

Using Azure Automation Vertical Scale runbooks, you can easily scale [Linux VMs](../articles/virtual-machines/linux/vertical-scaling-automation.md) or [Windows VMs](../articles/virtual-machines/windows/vertical-scaling-automation.md) up or down.

## Create a virtual machine scale set

Scale sets make it easy for you to deploy and manage identical VMs as a set. You can create Linux or Windows scale sets using the [Azure portal](../articles/virtual-machine-scale-sets/virtual-machine-scale-sets-portal-create.md), [Azure PowerShell](../articles/virtual-machines/windows/tutorial-create-vmss.md), or the [Azure CLI](../articles/virtual-machines/linux/tutorial-create-vmss.md). Automatic scaling of VMs in a scale set is accomplished with the use of metrics and rules.

If your application needs to scale based on more advanced performance counters, the VMs in the scale set need to have either the [Linux diagnostic extension](../articles/virtual-machines/linux/diagnostic-extension.md) or [Windows diagnostics extension](../articles/virtual-machines/windows/ps-extensions-diagnostics.md) installed. If you create a scale set using the Azure portal, you need to also use Azure PowerShell or the Azure CLI to install the extension with the diagnostics configuration that you need.

## Configure autoscale for a scale set

Automatic scaling provides the right amount of VMs to handle the load on your application. It enables you to add VMs to handle increases in load and save money by removing VMs that are sitting idle. You specify a minimum and maximum number of VMs to run based on a set of rules. Having a minimum makes sure your application is always running even under no load. Having a maximum value limits your total possible hourly cost.

You can enable autoscale when you create the scale set using [Azure PowerShell](../articles/monitoring-and-diagnostics/insights-powershell-samples.md#create-and-manage-autoscale-settings) or [Azure CLI](https://docs.microsoft.com/cli/azure/monitor/autoscale-settings). You can also enable it after the scale set is created. You can create a scale set, install the extension, and configure autoscale using an [Azure Resource Manager template](../articles/virtual-machine-scale-sets/virtual-machine-scale-sets-windows-autoscale.md). In the Azure portal, enable autoscale from Azure Monitor, or enable autoscale from the scale set settings.

![Enable autoscale](./media/virtual-machines-autoscale/virtual-machines-autoscale-enable.png)
 
### Metrics

The autoscale feature of Azure Monitor enables you to scale the number of running instances up or down based on [metrics](../articles/monitoring-and-diagnostics/insights-autoscale-common-metrics.md). By default, VMs provide basic host-level metrics for disk, network, and CPU usage. When you configure the collection of diagnostics data using the Azure diagnostic extension, additional disk, CPU, and memory guest OS metrics become available. The guest OS metrics are based on typical performance counters for the operating system.

![Metric criteria](./media/virtual-machines-autoscale/virtual-machines-autoscale-criteria.png)
 
### Rules

[Rules](../articles/monitoring-and-diagnostics/monitoring-autoscale-scale-by-custom-metric.md) combine a metric with an action to be performed. When rule conditions are met, one or more autoscale actions are triggered. For example, you might have a rule defined that increases the number of VMs by 1 if the average CPU usage goes above 85 percent.

![Autoscale actions](./media/virtual-machines-autoscale/virtual-machines-autoscale-actions.png)
 
### Notifications

You can [set up triggers](../articles/monitoring-and-diagnostics/insights-autoscale-to-webhook-email.md) so that specific web URLs are called or emails are sent based on the autoscale rules that you create. Webhooks allow you to route the Azure alert notifications to other systems for post-processing or custom notifications.

## Manually scale the VMs in a scale set

You can add or remove virtual machines by changing the capacity of the set. In the Azure portal, you can change the capacity of the scale set by sliding the bar on the Scaling screen left or right to decrease or increase the number of VMs in the scale set.

Using Azure PowerShell, you get the scale set object using [Get-AzureRmVmss](https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermvmss?view=azurermps-4.2.0), set the **sku.capacity** property to the number of VMs that you want, and then update the scale set with [Update-AzureRmVmss](https://docs.microsoft.com/powershell/module/azurerm.compute/update-azurermvmss?view=azurermps-4.2.0). Using Azure CLI, you change the capacity with the **--new-capacity** parameter for the [az vmss scale](https://docs.microsoft.com/cli/azure/vmss#scale) command.


## Next steps

- Learn more about scale sets in [Design Considerations for Scale Sets](../articles/virtual-machine-scale-sets/virtual-machine-scale-sets-design-overview.md).

