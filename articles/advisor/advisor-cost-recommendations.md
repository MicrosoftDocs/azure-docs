---
title: Reduce service costs using Azure Advisor
description: Use Azure Advisor to optimize the cost of your Azure deployments.
ms.topic: article
ms.date: 01/29/2019

---

# Reduce service costs using Azure Advisor

Advisor helps you optimize and reduce your overall Azure spend by identifying idle and underutilized resources. You can get cost recommendations from the **Cost** tab on the Advisor dashboard.

## Optimize virtual machine spend by resizing or shutting down underutilized instances 

Although certain application scenarios can result in low utilization by design, you can often save money by managing the size and number of your virtual machines. Advisor advanced evaluation models considers virtual machines for shut-down when P95th of the max of max value of CPU utilization is less than 3% and network utilization is less than 2% over a 7 day period. Virtual machines are considered for right size when it is possible to fit the current load in a smaller SKU (within the same SKU family) or a smaller number # of instance such that the current load doesn’t go over 80% utilization when non-user facing workloads and not above 40% when user-facing workload. Here, the type of workload is determined by analyzing the CPU utilization characteristics of the workload.

The recommended actions are shut-down or resize, specific to resource being recommended for. Advisor shows you the estimated cost savings for either recommended actions - resize or shut-down. Also, for resize recommended action, Advisor provides current and target SKU information. 

If you want to be more aggressive at identifying underutilized virtual machines, you can adjust the CPU utilization rule on a per subscription basis.

## Optimize spend for MariaDB, MySQL and PostgreSQL servers by right sizing 
Advisor analyses your usage and recommends if your MariaDB/MySQL/PostgreSQL database server resources have been underutilized for an extended period of time over the last 7 days. Low resource utilization results in unwanted expenditure which can be fixed without significant performance impact. To reduce your costs and efficiently manage your resources, we recommend reducing the compute size (vCores) by half.

## Reduce costs by eliminating unprovisioned ExpressRoute circuits

Advisor identifies ExpressRoute circuits that have been in the provider status of *Not Provisioned* for more than one month, and recommends deleting the circuit if you aren't planning to provision the circuit with your connectivity provider.

## Reduce costs by deleting or reconfiguring idle virtual network gateways

Advisor identifies virtual network gateways that have been idle for over 90 days. Since these gateways are billed hourly, you should consider reconfiguring or deleting them if you don't intend to use them anymore. 

## Buy reserved virtual machine instances to save money over pay-as-you-go costs

Advisor will review your virtual machine usage over the last 30 days and determine if you could save money by purchasing an Azure reservation. Advisor will show you the regions and sizes where you potentially have the most savings and will show you the estimated savings from purchasing reservations. With Azure reservations, you can pre-purchase the base costs for your virtual machines. Discounts will automatically apply to new or existing VMs that have the same size and region as your reservations. [Learn more about Azure Reserved VM Instances.](https://azure.microsoft.com/pricing/reserved-vm-instances/)

Advisor will also notify you of reserved instances that you have that will expire in the next 30 days. It will recommend that you purchase new reserved instances to avoid paying pay-as-you-go pricing.

## Buy reserved instances for several resource types to save over your pay-as-you-go costs

We analyze usage pattern for below list of resources, over last 30 days and recommend reserved capacity purchase that maximizes your savings. 
### Cosmos DB reserved capacity
We analyzed your Cosmos DB usage pattern over last 30 days and recommend reserved capacity purchase to optimize costs. With reserved capacity you can pre-purchase Cosmos DB hourly usage and save over your pay-as-you-go costs. Reserved capacity is a billing benefit and will automatically apply to new or existing deployments. Saving estimates are calculated for individual subscriptions using 3-year reservation pricing and by extrapolating the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings even more.

### SQL PaaS reserved capacity
We analyze SQL PaaS elastic pools and managed instance usage pattern over last 30 days and recommend reserved capacity purchase that maximizes your savings. With reserved capacity you can pre-purchase SQL DB hourly usage and save over your SQL compute costs. SQL license is charged separately and is not discounted by the reservation. Reserved capacity is a billing benefit and will automatically apply to new or existing deployments. Saving estimates are calculated for individual subscriptions using 3-year reservation pricing and by extrapolating the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

### App service stamp fee reserved capacity
We analyze your App Service isolated environment stamp fees usage pattern over last 30 days and recommend reserved capacity purchase that maximizes your savings. With reserved capacity you can pre-purchase hourly usage for the isolated environment stamp fee and save over your Pay-as-you-go costs. Note that reserved capacity only applies to the stamp fee and not to the App Service instances. Reserved capacity is a billing benefit and will automatically apply to new or existing deployments. Saving estimates are calculated for individual subscriptions using 3-year reservation pricing based on usage pattern over last 30 days.

### Blob storage reserved capacity
We analyzed you Azure Blob and Datalake storage usage over last 30 days and calculated reserved capacity purchase that would maximize your savings. With reserved capacity you can pre-purchase hourly usage and save over your current on-demand costs. Blob storage reserved capacity applies only to data stored on Azure Blob (GPv2) and Azure Data Lake Storage (Gen 2). Reserved capacity is a billing benefit and will automatically apply to new or existing deployments. Saving estimates are calculated for individual subscriptions using 3-year reservation pricing and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

### MariaDB, MySQL and PostgreSQL reserved capacity
We analyze your Azure Database for MariaDB, MySQL and PostgreSQL usage pattern over last 30 days and recommend reserved capacity purchase that maximizes your savings. With reserved capacity you can pre-purchase MariaDB, MySQL and PostgreSQL hourly usage and save over your costs. Reserved capacity is a billing benefit and will automatically apply to new or existing deployments. Saving estimates are calculated for individual subscriptions using 3-year reservation pricing and the usage pattern over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

### Synapse analytics (formerly SQL DW) reserved capacity
We analyze your Azure Synapse Analytics usage pattern over last 30 days and recommend reserved capacity purchase that maximizes your savings. With reserved capacity you can pre-purchase Synapse Analytics hourly usage and save over your on-demand costs. Reserved capacity is a billing benefit and will automatically apply to new or existing deployments. Saving estimates are calculated for individual subscriptions using 3-year reservation pricing and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

## Delete unassociated public IP addresses to save money

Advisor identifies public IP addresses that are not currently associated to Azure resources such as Load Balancers or VMs. These public IP addresses come with a nominal charge. If you do not plan to use them, deleting them can result in cost savings.

## Delete Azure Data Factory pipelines that are failing

Azure Advisor will detect Azure Data Factory pipelines that repeatedly fail and recommend that you resolve the issues or delete the failing pipelines if they are no longer needed. You will be billed for these pipelines even if though they are not serving you while they are failing. 

## Use Standard Snapshots for Managed Disks
To save 60% of cost, we recommend storing your snapshots in Standard Storage, regardless of the storage type of the parent disk. This option is the default option for Managed Disks snapshots. Azure Advisor will identify snapshots that are stored Premium Storage and recommend migrating your snapshot from Premium to Standard Storage. [Learn more about Managed Disk pricing](https://aka.ms/aa_manageddisksnapshot_learnmore)

## Utilize Lifecycle Management
Azure Advisor will utilize intelligence regarding your Azure blob storage object count, total size, and transactions to detect if one or more of your storage accounts would be best suited to enable lifecycle management to tier data. It will prompt you to create Lifecycle Management rules to automatically tier your data to Cool or Archive to optimize your storage costs while retaining your data in Azure blob storage for application compatibility.

## Create an Ephemeral OS Disk recommendation
With [Ephemeral OS Disk](https://docs.microsoft.com/azure/virtual-machines/windows/ephemeral-os-disks), Customers get these benefits: Save on storage cost for OS disk. Get lower read/write latency to OS disk. Faster VM Reimage operation by resetting OS (and Temporary disk) to its original state. It is more preferable to use Ephemeral OS Disk for short-lived IaaS VMs or VMs with stateless workloads. Advisor has recommendation for resources which can take benefits with Ephemeral OS Disk. 


## How to access Cost recommendations in Azure Advisor

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select [**Advisor**](https://aka.ms/azureadvisordashboard) from any page.

1. On the **Advisor** dashboard, select the **Cost** tab.

## Next steps

To learn more about Advisor recommendations, see:
* [Introduction to Advisor](advisor-overview.md)
* [Get started with Advisor](advisor-get-started.md)
* [Advisor performance recommendations](advisor-performance-recommendations.md)
* [Advisor high availability recommendations](advisor-high-availability-recommendations.md)
* [Advisor security recommendations](advisor-security-recommendations.md)
* [Advisor operational excellence recommendations](advisor-operational-excellence-recommendations.md)

