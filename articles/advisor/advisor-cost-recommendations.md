---
title: Reduce service costs using Azure Advisor
description: Use Azure Advisor to optimize the cost of your Azure deployments.
ms.topic: article
ms.date: 10/29/2021

---

# Reduce service costs by using Azure Advisor

Azure Advisor helps you optimize and reduce your overall Azure spend by identifying idle and underutilized resources. You can get cost recommendations from the **Cost** tab on the Advisor dashboard.

## How to access cost recommendations in Azure Advisor

1. Sign in to the [**Azure portal**](https://portal.azure.com).

1. Search for and select [**Advisor**](https://aka.ms/azureadvisordashboard) from any page.

1. On the **Advisor** dashboard, select the **Cost** tab.

## Optimize virtual machine spend by resizing or shutting down underutilized instances 

Although certain application scenarios can result in low utilization by design, you can often save money by managing the size and number of your virtual machines. 

Advisor uses machine-learning algorithms to identify low utilization and to identify the ideal recommendation to ensure optimal usage of virtual machines. The recommended actions are shut down or resize, specific to the resource being evaluated.

### Shutdown recommendations

Advisor identifies resources that have not been used at all over the last 7 days and makes a recommendation to shut them down. 

-	Metrics considered are CPU and Outbound Network utilization (memory is not considered for shutdown recommendations since we’ve found that relying on CPU and Network provide enough signals for this recommendation)
- The last 7 days of utilization data are considered
- Metrics are sampled every 30 seconds, aggregated to 1 min and then further aggregated to 30 mins (we take the average of max values while aggregating to 30 mins)
- A shutdown recommendation is created if: 
  - P95th of the maximum value of CPU utilization summed across all cores is less than 3%.
  - P100 of average CPU in last 3 days (sum over all cores) <= 2%   
  - Outbound Network utilization is less than 2% over a seven-day period.

### Resize SKU recommendations

Advisor considers resizing virtual machines when it's possible to fit the current load on a more appropriate SKU, which costs less than the current one (we currently consider retail rates only during recommendation generation). 

-	Metrics considered are CPU, Memory and Outbound Network utilization 
- The last 7 days of utilization data are considered
- Metrics are sampled every 30 seconds, aggregated to 1 min and then further aggregated to 30 mins (we take the average of max values while aggregating to 30 mins)
- An appropriate SKU is determined based on the following criteria:
  - Performance of the workloads on the new SKU should not be impacted. This is achieved by: 
    - For user-facing workloads: P95 of the CPU and Outbound Network utilization, and P100 of Memory utilization don’t go above 80% on the new SKU 
    - For non user-facing workloads: 
      - P95 of CPU and Outbound Network utilization don’t go above 40% on the recommended SKU 
      - P100 of Memory utilization doesn’t go above 60% on the recommended SKU
  - The new SKU has the same Accelerated Networking and Premium Storage capabilities 
  - The new SKU is supported in the current region of the Virtual Machine with the recommendation
  - The new SKU is less expensive 
- Advisor determines the type of workload (user-facing/non user-facing) by analyzing the CPU utilization characteristics of the workload. This is based on some fascinating findings by Microsoft Research. You can find more details here: [Prediction-Based Power Oversubscription in Cloud Platforms - Microsoft Research](https://www.microsoft.com/research/publication/prediction-based-power-oversubscription-in-cloud-platforms/).
- Advisor recommends not just smaller SKUs in the same family (for example D3v2 to D2v2) but also SKUs in a newer version (for example D3v2 to D2v3) or even a completely different family (for example D3v2 to E3v2) based on the best fit and the cheapest costs with no performance impacts. 

### Burstable recommendations

This is a special type of resize recommendation, where Advisor analyzes workloads to determine eligibility to run on specialized SKUs called Burstable SKUs that allow for variable workload performance requirements and are generally cheaper than general purpose SKUs. Learn more about burstable SKUs here: [B-series burstable - Azure Virtual Machines](../virtual-machines/sizes-b-series-burstable.md).

- A burstable SKU recommendation is made if:
- The average CPU utilization is less than a burstable SKUs' baseline performance
  - If the P95 of CPU is less than two times the burstable SKUs' baseline performance
  - If the current SKU does not have accelerated networking enabled (burstable SKUs don’t support accelerated networking yet)
  - If we determine that the Burstable SKU credits are sufficient to support the average CPU utilization over 7 days
- The result is a recommendation suggesting that the user resize their current VM to a burstable SKU (with the same number of cores) to take advantage of the low costs and the fact that the workload has low average utilization but high spikes in cases, which is perfect for the B-series SKU. 
 
Advisor shows the estimated cost savings for either recommended action: resize or shut down. For resize, Advisor provides current and target SKU information.
To be more selective about the actioning on underutilized virtual machines, you can adjust the CPU utilization rule on a per-subscription basis.

There are cases where the recommendations cannot be adopted or might not be applicable, such as some of these common scenarios (there may be other cases):
- Virtual machine has been provisioned to accommodate upcoming traffic
- Virtual machine uses other resources not considered by the resize algo, i.e. metrics other than CPU, Memory and Network
- Specific testing being done on the current SKU, even if not utilized efficiently
- Need to keep VM SKUs homogeneous 
- VM being utilized for disaster recovery purposes

In such cases simply use the Dismiss/Postpone options associated with the recommendation. 

We are constantly working on improving these recommendations. Feel free to share feedback on [Advisor Forum](https://aka.ms/advisorfeedback).

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
Advisor analyzes SQL Database and SQL Managed Instance usage patterns over the past 30 days. It then recommends reserved capacity purchases that optimize costs. By using reserved capacity, you can pre-purchase SQL DB hourly usage and save over your SQL compute costs. Your SQL license is charged separately and isn't discounted by the reservation. Reserved capacity is a billing benefit and automatically applies to new and existing deployments. Advisor calculates savings estimates for individual subscriptions by using 3-year reservation pricing and by extrapolating the usage patterns observed over the past 30 days. Shared scope recommendations are available for reserved capacity purchases and can increase savings. For details, see [Azure SQL Database & SQL Managed Instance reserved capacity](../azure-sql/database/reserved-capacity-overview.md).

### App Service Stamp Fee reserved capacity
Advisor analyzes the Stamp Fee usage pattern for your Azure App Service isolated environment over the past 30 days and recommends reserved capacity purchases that optimize costs. By using reserved capacity, you can pre-purchase hourly usage for the isolated environment Stamp Fee and save over your pay-as-you-go costs. Note that reserved capacity applies only to the Stamp Fee and not to App Service instances. Reserved capacity is a billing benefit and automatically applies to new and existing deployments. Advisor calculates saving estimates for individual subscriptions by using 3-year reservation pricing based on usage patterns over the past 30 days.

### Blob storage reserved capacity
Advisor analyzes your Azure Blob storage and Azure Data Lake storage usage over the past 30 days. It then calculates reserved capacity purchases that optimize costs. With reserved capacity, you can pre-purchase hourly usage and save over your current on-demand costs. Blob storage reserved capacity applies only to data stored on Azure Blob general-purpose v2 and Azure Data Lake Storage Gen2 accounts. Reserved capacity is a billing benefit and automatically applies to new and existing deployments. Advisor calculates savings estimates for individual subscriptions by using 3-year reservation pricing and the usage patterns observed over the past 30 days. Shared scope recommendations are available for reserved capacity purchases and can increase savings.

### MariaDB, MySQL, and PostgreSQL reserved capacity
Advisor analyzes your usage patterns for Azure Database for MariaDB, Azure Database for MySQL, and Azure Database for PostgreSQL over the past 30 days. It then recommends reserved capacity purchases that optimize costs. By using reserved capacity, you can pre-purchase MariaDB, MySQL, and PostgreSQL hourly usage and save over your current costs. Reserved capacity is a billing benefit and automatically applies to new and existing deployments. Advisor calculates savings estimates for individual subscriptions by using 3-year reservation pricing and the usage patterns observed over the past 30 days. Shared scope recommendations are available for reserved capacity purchases and can increase savings.

### Azure Synapse Analytics reserved capacity
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

## Configure manual throughput instead of autoscale on your Azure Cosmos DB database or container
Based on your usage in the past 7 days, you can save by using manual throughput instead of autoscale. Manual throughput is more cost-effective when average utilization of your max throughput (RU/s) is greater than 66% or less than or equal to 10%. Cost savings amount represents potential savings from using the recommended manual throughput, based on usage in the past 7 days. Your actual savings may vary depending on the manual throughput you set and whether your average utilization of throughput continues to be similar to the time period analyzed. The estimated savings do not account for any discount that may apply to your account.

## Enable autoscale on your Azure Cosmos DB database or container
Based on your usage in the past 7 days, you can save by enabling autoscale. For each hour, we compared the RU/s provisioned to the actual utilization of the RU/s (what autoscale would have scaled to) and calculated the cost savings across the time period. Autoscale helps optimize your cost by scaling down RU/s when not in use.

## Next steps

To learn more about Advisor recommendations, see:
* [Introduction to Advisor](advisor-overview.md)
* [Advisor score](azure-advisor-score.md)
* [Get started with Advisor](advisor-get-started.md)
* [Advisor performance recommendations](advisor-performance-recommendations.md)
* [Advisor reliability recommendations](advisor-high-availability-recommendations.md)
* [Advisor security recommendations](advisor-security-recommendations.md)
* [Advisor operational excellence recommendations](advisor-operational-excellence-recommendations.md)
