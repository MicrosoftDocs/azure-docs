---
title: Get cost analysis and set budgets for Azure Batch
description: Learn how to get a cost analysis, set a budget, and reduce costs for the underlying compute resources and software licenses used to run your Batch workloads.
ms.topic: how-to
ms.date: 12/13/2021
---

# Get cost analysis and set budgets for Azure Batch

This topic will help you understand costs that may be associated with Azure Batch, how to set a budget for a Batch pool or account, and ways to reduce the costs for Batch workloads.

## Understand costs associated with Batch resources

There are no costs for using Azure Batch itself, although there can be charges for the underlying compute resources and software licenses used to run Batch workloads. Costs may be incurred from virtual machines (VMs) in a pool, data transfer from the VM, or any input or output data stored in the cloud.

### Virtual machines

Virtual machines are the most significant resource used for Batch processing. The cost of using VMs for Batch is calculated based on the type, quantity, and the duration of use. VM billing options include [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/) or [reservation](../cost-management-billing/reservations/save-compute-costs-reservations.md) (pay in advance). Both payment options have different benefits depending on your compute workload and will affect your bill differently.

Each VM in a pool created with [Virtual Machine Configuration](nodes-and-pools.md#virtual-machine-configuration) has an associated OS disk that uses Azure-managed disks. Azure-managed disks have an additional cost, and other disk performance tiers have different costs as well.

### Storage

When applications are deployed to Batch nodes (VMs) using [application packages](batch-application-packages.md), you are billed for the Azure Storage resources that your application packages consume. You're also billed for the storage of any input or output files, such as resource files and other log data.

In general, the cost of storage data associated with Batch is much lower than the cost of compute resources.

### Networking resources

Batch pools use networking resources, some of which have associated costs. In particular, for Virtual Machine Configuration pools, standard load balancers are used, which require static IP addresses. The load balancers used by Batch are visible for [accounts](accounts.md#batch-accounts) configured in user subscription mode, but not those in Batch service mode.

Standard load balancers incur charges for all data passed to and from Batch pool VMs. Select Batch APIs that retrieve data from pool nodes (such as Get Task/Node File), task application packages, resource/output files, and container images will also incur charges.

### Additional services

Depending on which services you use with your Batch solution, you may incur additional fees. Refer to the [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) to determine the cost of each additional service. Services commonly used with Batch that may have associated costs include:

- Application Insights
- Data Factory
- Azure Monitor
- Virtual Network
- VMs with graphics applications

## View cost analysis and create budgets

[Azure Cost Management](../cost-management-billing/cost-management-billing-overview.md) lets you plan, analyze and reduce your spending to maximize your cloud investment. The usage costs for all Azure services are available, including Azure Batch. You can view and filter Batch costs to be viewed and filtered, forecast future costs, and set spending limits with alerts when those limits are reached.

In the Azure portal, you can create budgets and spending alerts for your Batch pools or Batch accounts. Budgets and alerts are useful for notifying stakeholders of any risks of overspending, although it's possible for there to be a delay in spending alerts and to slightly exceed a budget.

The following screenshot shows an example of the **Cost analysis** view for a subscription, filtered to only display the accumulated costs associated with all Batch accounts. The lower charts show how the total cost for the period selected can be categorized by consumed service, location, and meter. While this is an example and is not meant to be reflective of costs you may see for your subscriptions, it is typical in that the largest cost is for the virtual machines that are allocated for Batch pool nodes.

:::image type="content" source="media/batch-budget/subscription-cost-analysis.png" alt-text="Screenshot showing cost analysis in the Azure portal for all Batch accounts in a subscription.":::

A further level of cost analysis detail can be obtained by specifying a **Resource** filter. For Batch accounts, these values are the Batch account name plus pool name. This allows you to view costs for a specific pool, multiple pools, or one or more accounts.

### View cost analysis for a Batch pool

#### Batch service pool allocation mode

For Batch accounts created with the Batch service pool allocation mode:

1. In the Azure portal, type in or select **Cost Management + Billing** .
1. Select your subscription in the **Billing scopes** section.
1. Under **Cost Management**, select **Cost analysis**.
1. Select **Add Filter**. In the first drop-down, select **Resource**.
1. In the second drop-down, select the Batch pool. When the pool is selected, you will see the cost analysis for your pool. The screenshot below shows example data.
   :::image type="content" source="media/batch-budget/pool-cost-analysis.png" alt-text="Screenshot showing cost analysis of a Batch pool in the Azure portal.":::

The resulting cost analysis shows the cost of the pool as well as the resources that contribute to this cost. In this example, the VMs used in the pool are the most costly resource.

> [!NOTE]
> The pool in this example uses **Virtual Machine Configuration**, which is [recommended for most pools](batch-pool-cloud-service-to-virtual-machine-configuration.md) and are charged based on the Virtual Machines pricing structure. Pools that use **Cloud Services Configuration** are charged based on the Cloud Services pricing structure.

[Tags](../azure-resource-manager/management/tag-resources.md) can be associated with Batch accounts, allowing tags to be used for further cost filtering. For example, tags can be used to associate project, user, or group information with a Batch account. Tags cannot currently be associated with Batch pools.

#### User subscription pool allocation mode

For Batch accounts created with the user subscription pool allocation mode:

1. In the Azure portal, type in or select **Cost Management + Billing** .
1. Select your subscription in the **Billing scopes** section.
1. Under **Cost Management**, select **Cost analysis**.
1. Select **Add Filter**. In the first drop-down, select **Tag**.
1. In the second drop-down, select **poolname**.
1. In the third drop-down, select the Batch pool. When the pool is selected, you will see the cost analysis for your pool. The screenshot below shows example data.
   :::image type="content" source="media/batch-budget/user-subscription-pool.png" alt-text="Screenshot showing cost analysis of a user subscription Batch pool in the Azure portal.":::

Note that if you're interested in viewing cost data for all pools in a user subscription Batch account, you can select **batchaccountname** in the second drop-down and the name of your Batch account in the third drop-down. 

> [!NOTE]
> Pools created by user subscription Batch accounts will not show up under the **Resource** filter, though their usage will still show up when filtering for "virtual machines" under service name.

### Create a budget for a Batch pool

Budgets can be created and cost alerts issued when various percentages of a budget are reached, such as 60%, 80%, and 100%. The budgets can specify one or more filters, so you can monitor and alert on Batch account costs at various granularities.

1. From the **Cost analysis** page, select **Budget: none**.
1. Select **Create new budget >**.
1. Use the resulting window to configure a budget specifically for your pool. For more information, see [Tutorial: Create and manage Azure budgets](../cost-management-billing/costs/tutorial-acm-create-budgets.md).

## Minimize costs associated with Azure Batch

Depending on your scenario, you may want to reduce costs as much as possible. Consider using one or more of these strategies to maximize the efficiency of your workloads and reduce potential costs.

### Reduce pool node use

The largest costs associated with using Batch are typically from the virtual machines allocated for pool nodes. For Virtual Machine configuration pools, the associated managed disks used for the VM OS disks can also contribute significantly to costs.

Evaluate your Batch application to determine if pool nodes are being well utilized by job tasks, or if pool nodes are idle for more than the expected time. It may be possible to reduce the number of pool nodes that are allocated, reduce the rate of pool node scale-up, or increase the rate of scale-down to increase utilization.

In addition to custom monitoring, [Batch metrics](batch-diagnostics.md#view-batch-metrics) can help to identify nodes that are allocated but in an idle state. You can select a metric for most pool node states to view by using Batch monitoring metrics in the Azure portal. The 'Idle Node Count' and 'Running Node Count' could be viewed to give an indication of how well the pool nodes are utilized, for example.

### Ensure pool nodes are able to run tasks

Allocated nodes that are listed for a pool normally incur costs, but it is possible for pool nodes to be in a state where can't run tasks, such as 'unusable' or 'starttaskfailed'. Batch APIs or metrics can be used to monitor for and detect this category of VM. The reason for these states can then be determined and corrective action taken to reduce or eliminate these unhealthy nodes.

### Use the right pool node VM size

Ensure the appropriate VM size is being used, so that VMs are utilized well when running tasks while providing the performance necessary to complete your job tasks in the required time. Pool node VMs can be underutilized in some situations, such as low CPU usage. Costs can be saved by choosing a VM size with a lower price.

To determine VM utilization, you can log in to a node when running tasks to view performance data or use [monitoring capabilities](monitoring-overview.md), such as Application Insights, to obtain performance data from pool nodes.

### Use pool slots to reduce node requirements

Multiple task slots can be specified for a pool, so that the corresponding number of tasks can be run in parallel on each node. Pool task slots can be used to reduce the number of nodes used in a pool by choosing larger VM sizes and running multiple tasks in parallel on the node to ensure the node is well utilized. If nodes are underutilized, slots can be used to increase utilization. For example, for a single-threaded task application, one slot per core could be configured. It is also possible to have more slots than cores. This would be applicable if the application blocks significantly waiting for calls to external services to be returned, for one example.

Setting [`taskSchedulingPolicy`](/rest/api/batchservice/pool/add#taskschedulingpolicy) to `pack` will help ensure VMs are utilized as much as possible, with scaling more easily able to remove nodes not running any tasks.

### Use Azure Spot virtual machines

[Azure Spot VMs](batch-spot-vms.md) reduce the cost of Batch workloads by taking advantage of surplus computing capacity in Azure. When you specify Spot VMs in your pools, Batch uses this surplus to run your workload. There can be substantial cost savings when you use Spot VMs instead of dedicated VMs. Keep in mind that Spot VMs are not suitable for all workloads, since there may not be available capacity to allocate, or they may get preempted.

### Use ephemeral OS disks

By default, pool nodes use managed disks, which incur costs. Virtual Machine Configuration pools in some VM sizes can use [ephemeral OS disks](create-pool-ephemeral-os-disk.md), which create the OS disk on the VM cache or temporary SSD, to avoid extra costs associated with managed disks.

### Purchase reservations for virtual machine instances

If you intend to use Batch for a long period of time, you can reduce the cost of VMs by using [Azure Reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) for your workloads. A reservation rate is considerably lower than a pay-as-you-go rate. Virtual machine instances used without a reservation are charged at the pay-as-you-go rate. When you purchase a reservation, the reservation discount is applied. By committing to one-year or three-year plans for [VM instances](../virtual-machines/prepay-reserved-vm-instances.md), significant discounts are applied to VM usage, including [VMs consumed via Batch pools](../virtual-machines/prepay-reserved-vm-instances.md#determine-the-right-vm-size-before-you-buy).

It is important to note that reservation discount is "use-it-or-lose-it."  If there no matching resources are used for an hour, you'll lose the reservation quantity for that hour. Unused reserved hours can't be carried forward, and are therefore lost if not used. Batch workloads often scale the number of allocated VMs according to load and have varying load, including periods where there is no load. Care therefore needs to be taken determining the reservation amount, given that reserved hours will be lost if Batch VMs are scaled down below the reservation quantity.

### Use automatic scaling

[Automatic scaling](batch-automatic-scaling.md) dynamically scales the number of VMs in your Batch pool based on demands of the current job. By scaling the pool based on the lifetime of a job, automatic scaling ensures that VMs are scaled up and used only when there is a job to perform. When the job is complete, or when there are no jobs, the VMs are automatically scaled down to save compute resources. Scaling allows you to lower the overall cost of your Batch solution by using only the resources you need.

## Next steps

- Learn more about [Azure Cost Management + Billing](../cost-management-billing/cost-management-billing-overview.md).
- Learn about using [Azure Spot VMs with Batch](batch-spot-vms.md).