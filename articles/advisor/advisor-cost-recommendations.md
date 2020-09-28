---
title: Reduce service costs using Azure Advisor
description: Use Azure Advisor to optimize the cost of your Azure deployments.
ms.topic: article
ms.date: 09/27/2020

---

# Reduce service costs by using Azure Advisor

Azure Advisor helps you optimize and reduce your overall Azure spend by identifying idle and underutilized resources. You can get cost recommendations from the **Cost** tab on the Advisor dashboard.

## Optimize virtual machine spend by resizing or shutting down underutilized instances 

Although certain application scenarios can result in low utilization by design, you can often save money by managing the size and number of your virtual machines. 

The recommended actions are shut down or resize, specific to the resource being evaluated.

The advanced evaluation model in Advisor considers shutting down virtual machines when all of these statements are true: 
- P95th of the maximum of maximum value of CPU utilization is less than 3%. 
- Network utilization is less than 2% over a seven-day period.
- Memory pressure is lower than the threshold values

Advisor considers resizing virtual machines when it's possible to fit the current load in a smaller SKU (within the same SKU family) or a smaller number of instances such that:
- The current load doesn’t go above 80% utilization for workloads that aren't user facing. 
- The load doesn't go above 40% for user-facing workloads. 

Here, Advisor determines the type of workload by analyzing the CPU utilization characteristics of the workload.

Advisor shows the estimated cost savings for either recommended action: resize or shut down. For resize, Advisor provides current and target SKU information.

If you want to be more aggressive about identifying underutilized virtual machines, you can adjust the CPU utilization rule on a per-subscription basis.

## Optimize spend for MariaDB, MySQL, and PostgreSQL servers by right-sizing 
Advisor analyses your usage and evaluates whether your MariaDB, MySQL, or PostgreSQL database server resources have been underutilized for an extended time over the past seven days. Low resource utilization results in unwanted expenditure that you can fix without significant performance impact. To reduce your costs and efficiently manage your resources, we recommend that you reduce the compute size (vCores) by half.

## Reduce costs by eliminating unprovisioned ExpressRoute circuits

Advisor identifies Azure ExpressRoute circuits that have been in the provider status of **Not provisioned** for more than one month. It recommends deleting the circuit if you aren't planning to provision the circuit with your connectivity provider.

## Reduce costs by deleting or reconfiguring idle virtual network gateways

Advisor identifies virtual network gateways that have been idle for more than 90 days. Because these gateways are billed hourly, you should consider reconfiguring or deleting them if you don't intend to use them anymore. 

## Buy reserved virtual machine instances to save money over pay-as-you-go costs

Advisor reviews your virtual machine usage over the past 30 days to determine if you could save money by purchasing an Azure reservation. Advisor shows you the regions and sizes where the potential for savings is highest and the estimated savings from purchasing reservations. With Azure reservations, you can pre-purchase the base costs for your virtual machines. Discounts automatically apply to new or existing VMs that have the same size and region as your reservations. [Learn more about Azure Reserved VM Instances.](https://azure.microsoft.com/pricing/reserved-vm-instances/)

Advisor also notifies you of your reserved instances that will expire in the next 30 days. It recommends that you purchase new reserved instances to avoid pay-as-you-go pricing.

## Buy reserved instances for several resource types to save over your pay-as-you-go costs

Advisor analyzes usage patterns for the past 30 days for the following resources and recommends reserved capacity purchases that optimize costs.

### Azure Cosmos DB reserved capacity
Advisor analyzes your Azure Cosmos DB usage patterns for the past 30 days and recommends reserved capacity purchases to optimize costs. By using reserved capacity, you can pre-purchase Azure Cosmos DB hourly usage and save over your pay-as-you-go costs. Reserved capacity is a billing benefit and automatically applies to new and existing deployments. Advisor calculates savings estimates for individual subscriptions by using 3-year reservation pricing and by extrapolating the usage patterns observed over the past 30 days. Shared scope recommendations are available for reserved capacity purchases and can increase savings.

### SQL Database and SQL Managed Instance reserved capacity
Advisor analyzes SQL Database and SQL Managed Instance usage patterns over the past 30 days. It then recommends reserved capacity purchases that optimize costs. By using reserved capacity, you can pre-purchase SQL DB hourly usage and save over your SQL compute costs. Your SQL license is charged separately and isn't discounted by the reservation. Reserved capacity is a billing benefit and automatically applies to new and existing deployments. Advisor calculates savings estimates for individual subscriptions by using 3-year reservation pricing and by extrapolating the usage patterns observed over the past 30 days. Shared scope recommendations are available for reserved capacity purchases and can increase savings. For details, see [Azure SQL Database & SQL Managed Instance reserved capacity](https://docs.microsoft.com/azure/azure-sql/database/reserved-capacity-overview).

### App Service Stamp Fee reserved capacity
Advisor analyzes the Stamp Fee usage pattern for your Azure App Service isolated environment over the past 30 days and recommends reserved capacity purchases that optimize costs. By using reserved capacity, you can pre-purchase hourly usage for the isolated environment Stamp Fee and save over your pay-as-you-go costs. Note that reserved capacity applies only to the Stamp Fee and not to App Service instances. Reserved capacity is a billing benefit and automatically applies to new and existing deployments. Advisor calculates saving estimates for individual subscriptions by using 3-year reservation pricing based on usage patterns over the past 30 days.

### Blob storage reserved capacity
Advisor analyzes your Azure Blob storage and Azure Data Lake storage usage over the past 30 days. It then calculates reserved capacity purchases that optimize costs. With reserved capacity, you can pre-purchase hourly usage and save over your current on-demand costs. Blob storage reserved capacity applies only to data stored on Azure Blob general-purpose v2 and Azure Data Lake Storage Gen2 accounts. Reserved capacity is a billing benefit and automatically applies to new and existing deployments. Advisor calculates savings estimates for individual subscriptions by using 3-year reservation pricing and the usage patterns observed over the past 30 days. Shared scope recommendations are available for reserved capacity purchases and can increase savings.

### MariaDB, MySQL, and PostgreSQL reserved capacity
Advisor analyzes your usage patterns for Azure Database for MariaDB, Azure Database for MySQL, and Azure Database for PostgreSQL over the past 30 days. It then recommends reserved capacity purchases that optimize costs. By using reserved capacity, you can pre-purchase MariaDB, MySQL, and PostgreSQL hourly usage and save over your current costs. Reserved capacity is a billing benefit and automatically applies to new and existing deployments. Advisor calculates savings estimates for individual subscriptions by using 3-year reservation pricing and the usage patterns observed over the past 30 days. Shared scope recommendations are available for reserved capacity purchases and can increase savings.

### Azure Synapse Analytics (formerly SQL Data Warehouse) reserved capacity
Advisor analyzes your Azure Synapse Analytics usage patterns over the past 30 days and recommends reserved capacity purchases that optimize costs. By using reserved capacity, you can pre-purchase Synapse Analytics hourly usage and save over your on-demand costs. Reserved capacity is a billing benefit and automatically applies to new and existing deployments. Advisor calculates savings estimates for individual subscriptions by using 3-year reservation pricing and the usage patterns observed over the past 30 days. Shared scope recommendations are available for reserved capacity purchases and can increase savings.

## Delete unassociated public IP addresses to save money

Advisor identifies public IP addresses that aren't associated with Azure resources like load balancers and VMs. A nominal charge is associated with these public IP addresses. If you don't plan to use them, you can save money by deleting them.

## Delete Azure Data Factory pipelines that are failing

Advisor detects Azure Data Factory pipelines that repeatedly fail. It recommends that you resolve the problems or delete the pipelines if you don't need them. You're billed for these pipelines even if though they're not serving you while they're failing.

## Use standard snapshots for managed disks
To save 60% of cost, we recommend storing your snapshots in standard storage, regardless of the storage type of the parent disk. This option is the default option for managed disk snapshots. Advisor identifies snapshots that are stored in premium storage and recommends migrating then from premium to standard storage. [Learn more about managed disk pricing.](https://aka.ms/aa_manageddisksnapshot_learnmore)

## Use lifecycle management
By using intelligence about your Azure Blob storage object count, total size, and transactions, Advisor detects whether you should enable lifecycle management to tier data on one or more of your storage accounts. It prompts you to create lifecycle management rules to automatically tier your data to cool or archive storage to optimize your storage costs while retaining your data in Azure Blob storage for application compatibility.

## Create an Ephemeral OS Disk recommendation
[Ephemeral OS Disk](../virtual-machines/ephemeral-os-disks.md) allows you to: 
- Save on storage costs for OS disks. 
- Get lower read/write latency to OS disks. 
- Get faster VM reimage operations by resetting the OS (and temporary disk) to its original state.

It's preferable to use Ephemeral OS Disk for short-lived IaaS VMs or VMs with stateless workloads. Advisor provides recommendations for resources that can benefit from Ephemeral OS Disk.

## Reduce Azure Data Explorer table cache-period (policy) for cluster cost optimization (Preview)
Advisor identifies resources where reducing the table cache policy will free up Azure Data Explorer cluster nodes having low CPU utilization, memory, and a high cache size configuration.

## How to access cost recommendations in Azure Advisor

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select [**Advisor**](https://aka.ms/azureadvisordashboard) from any page.

1. On the **Advisor** dashboard, select the **Cost** tab.

## Next steps

To learn more about Advisor recommendations, see:
* [Introduction to Advisor](advisor-overview.md)
* [Advisor score](azure-advisor-score.md)
* [Get started with Advisor](advisor-get-started.md)
* [Advisor performance recommendations](advisor-performance-recommendations.md)
* [Advisor high availability recommendations](advisor-high-availability-recommendations.md)
* [Advisor security recommendations](advisor-security-recommendations.md)
* [Advisor operational excellence recommendations](advisor-operational-excellence-recommendations.md)
