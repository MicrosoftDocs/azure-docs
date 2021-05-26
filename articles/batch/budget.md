---
title: Get cost analysis and set budgets for Azure Batch
description: Learn how to get a cost analysis, set a budget, and reduce costs for the underlying compute resources and software licenses used to run your Batch workloads.
ms.topic: how-to
ms.date: 01/29/2021
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

## View cost analysis and create a budget for a pool

In the Azure portal, you can create budgets and spending alerts for your Batch pools or Batch accounts. Budgets and alerts are useful for notifying stakeholders of any risks of overspending, although it's possible for there to be a delay in spending alerts and to slightly exceed a budget.

> [!NOTE]
> The pool in this example uses **Virtual Machine Configuration**, which is recommended for most pools and has charges based on the Virtual Machines pricing structure. Pools that use **Cloud Services Configuration** are charged based on the Cloud Services pricing structure.

### View cost analysis for a Batch pool

1. In the Azure portal, type in or select **Cost Management + Billing** .
1. Select your subscription in the **Billing scopes** section.
1. Under **Cost Management**, select **Cost analysis**.
1. Select **Add Filter**. In the first drop-down, select **Resource**
1. In the second drop-down, select the Batch pool. When the pool is selected, you will see the cost analysis for the pool, similar to the example shown here.
    ![Screenshot showing cost analysis of a pool in the Azure portal.](./media/batch-budget/pool-cost-analysis.png)

The resulting cost analysis shows the cost of the pool as well as the resources that contribute to this cost. In this example, the VMs used in the pool are the most costly resource.

### Create a budget for a Batch pool

1. From the **Cost analysis** page, select **Budget: none**.
1. Select **Create new budget >**.
1. Use the resulting window to configure a budget specifically for your pool. For more information, see [Tutorial: Create and manage Azure budgets](../cost-management-billing/costs/tutorial-acm-create-budgets.md).

## Minimize costs associated with Azure Batch

Depending on your scenario, you may want to reduce costs as much as possible. Consider using one or more of these strategies to maximize the efficiency of your workloads and reduce potential costs.

### Use low-priority virtual machines

[Low-priority VMs](batch-low-pri-vms.md) reduce the cost of Batch workloads by taking advantage of surplus computing capacity in Azure. When you specify low-priority VMs in your pools, Batch uses this surplus to run your workload. There can be substantial cost savings when you use low-priority VMs instead of dedicated VMs.

### Select a standard virtual machine OS disk type

Azure offers multiple [VM OS disk types](../virtual-machines/disks-types.md). Most VM-series have sizes that support both premium and standard storage. When an 's' VM size is selected for a pool, Batch configures premium SSD OS disks. When the 'non-s' VM size is selected, then the cheaper, standard HDD disk type is used. For example, premium SSD OS disks are used for `Standard_D2s_v3` and standard HDD OS disks are used for `Standard_D2_v3`.

Premium SSD OS disks are more expensive, but have higher performance. VMs with premium disks can start slightly quicker than VMs with standard HDD OS disks. With Batch, the OS disk is often not used much, since the applications and task files are located on the VM's temporary SSD disk. Because of this, you can often select the 'non-s' VM size to avoid paying the increased cost for the premium SSD that is provisioned when an 's' VM size is specified.

### Purchase reservations for virtual machine instances

If you intend to use Batch for a long period of time, you can reduce the cost of VMs by using [Azure Reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) for your workloads. A reservation rate is considerably lower than a pay-as-you-go rate. Virtual machine instances used without a reservation are charged at the pay-as-you-go rate. When you purchase a reservation, the reservation discount is applied.

### Use automatic scaling

[Automatic scaling](batch-automatic-scaling.md) dynamically scales the number of VMs in your Batch pool based on demands of the current job. By scaling the pool based on the lifetime of a job, automatic scaling ensures that VMs are scaled up and used only when there is a job to perform. When the job is complete, or when there are no jobs, the VMs are automatically scaled down to save compute resources. Scaling allows you to lower the overall cost of your Batch solution by using only the resources you need.

## Next steps

- Learn more about [Azure Cost Management + Billing](../cost-management-billing/cost-management-billing-overview.md)
- Learn about [using low-priority VMs with Batch](batch-low-pri-vms.md).
