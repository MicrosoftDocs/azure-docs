---
title: Cost recommendations
description: Full list of available cost recommendations in Advisor.
ms.topic: article
ms.custom: ignite-2022
author: mabrahms
ms.author: v-mabrahms
ms.date: 10/15/2023
---

# Cost recommendations

Azure Advisor helps you optimize and reduce your overall Azure spend by identifying idle and underutilized resources. You can get cost recommendations from the **Cost** tab on the Advisor dashboard.

1. Sign in to the [**Azure portal**](https://portal.azure.com).

1. Search for and select [**Advisor**](https://aka.ms/azureadvisordashboard) from any page.

1. On the **Advisor** dashboard, select the **Cost** tab.




## AI Services

### Potential Cost Savings on this Form Recognizer Resource

We observed that your Form Recognizer resource has had enough usage in the past 30 days for you to consider using a Commitment tier.

Learn more about [Cognitive Service - AzureAdvisorFRCommitment (Potential Cost Savings on this Form Recognzier Resource)](https://azure.microsoft.com/pricing/details/form-recognizer/).

### Potential Cost Savings on this Computer Vision Resource

We observed that your Computer Vision resource has had enough READ usage in the past 30 days for you to consider using a Commitment tier.

Learn more about [Cognitive Service - AzureAdvisorCVReadCommitment (Potential Cost Savings on this Computer Vision Resource)](https://azure.microsoft.com/pricing/details/cognitive-services/computer-vision/).

### Potential Cost Savings on this Speech Service Resource

We observed that your Speech Service resource has had enough usage in the past 30 days for you to consider using a Commitment tier.

Learn more about [Cognitive Service - AzureAdvisorSpeechCommitment (Potential Cost Savings on this Speech Service Resource)](https://azure.microsoft.com/pricing/details/form-recognizer/).

### Potential Cost Savings on this Translator Resource

We observed that your Translator resource has had enough usage in the past 30 days for you to consider using a Commitment tier.

Learn more about [Cognitive Service - AzureAdvisorTranslatorCommitment (Potential Cost Savings on this Translator Resource)](https://azure.microsoft.com/pricing/details/cognitive-services/translator/).

### Potential Cost Savings on this LUIS Resource

We observed that your LUIS resource has had enough usage in the past 30 days for you to consider using a Commitment tier.

Learn more about [Cognitive Service - AzureAdvisorLUISCommitment (Potential Cost Savings on this LUIS Resource)](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/).

### Potential Cost Savings on this Language Service Resource

We observed that your Language Service resource has had enough usage in the past 30 days for you to consider using a Commitment tier.

Learn more about [Cognitive Service - AzureAdvisorTextAnalyticsCommitment (Potential Cost Savings on this Language Service Resource)](https://azure.microsoft.com/pricing/details/cognitive-services/language-service/).

### Enable Autoscaling for Azure Databricks Clusters

Autoscaling makes it easier to achieve high cluster utilization, because you don’t need to provision the cluster to match a workload. When you're using autoscaling, workloads can run faster and overall costs can be reduced compared to a static cluster.

Learn more about [Databricks Workspace - DatabricksEnableAutoscaling (Enable Autoscaling for Azure Databricks Clusters)](/azure/databricks/archive/compute/configure).



## Analytics

### Unused, stopped, Data Explorer resources

This recommendation surfaces all stopped Data Explorer resources that have been stopped for at least 60 days. Consider deleting the resources.

Learn more about [Data explorer resource - ADX stopped resource (Unused stopped Data Explorer resources)](https://aka.ms/adxunusedstoppedcluster).

### Unused/Empty Data Explorer resources

This recommendation surfaces all Data Explorer resources provisioned more than 10 days from the last update, and found either empty or with no activity. Consider deleting the resources.

Learn more about [Data explorer resource - ADX Unused resource (Unused/Empty Data Explorer resources)](https://aka.ms/adxemptycluster).

### Right-size Data Explorer resources for optimal cost

One or more of these issues were detected: Low data capacity, CPU utilization, or memory utilization. Scale down and/or scale in the resource to the recommended configuration shown.

Learn more about [Data explorer resource - Right-size for cost (Right-size Data Explorer resources for optimal cost)](https://aka.ms/adxskusize).

### Reduce Data Explorer table cache policy to optimize costs

Reducing the table cache policy frees up Data Explorer cluster nodes with low CPU utilization, memory, and a high cache size configuration.

Learn more about [Data explorer resource - ReduceCacheForAzureDataExplorerTables (Reduce Data Explorer table cache policy to optimize costs)](https://aka.ms/adxcachepolicy).

### Unused running Data Explorer resources

This recommendation surfaces all running Data Explorer resources with no user activity. Consider stopping the resources.

Learn more about [Data explorer resource - StopUnusedClusters (Unused running Data Explorer resources)](/azure/data-explorer/azure-advisor#azure-data-explorer-unused-cluster).

### Cleanup unused storage in Data Explorer resources

Over time, internal extents merge operations can accumulate redundant and unused storage artifacts that remain beyond the data retention period. While this unreferenced data doesn’t negatively impact the performance, it can lead to more storage use and larger costs than necessary. This recommendation surfaces Data Explorer resources that have unused storage artifacts. We recommended that you run the cleanup command to detect and delete unused storage artifacts and reduce cost. Recoverability will be reset to the cleanup time and not available on data that was created before running the cleanup.

Learn more about [Data explorer resource - RunCleanupCommandForAzureDataExplorer (Cleanup unused storage in Data Explorer resources)](https://aka.ms/adxcleanextentcontainers).

### Enable optimized autoscale for Data Explorer resources

Looks like your resource could have automatically scaled to reduce costs (based on the usage patterns, cache utilization, ingestion utilization, and CPU). To optimize costs and performance, we recommend enabling optimized autoscale. To make sure you don't exceed your planned budget, add a maximum instance count when you enable optimized autoscale.

Learn more about [Data explorer resource - EnableOptimizedAutoscaleAzureDataExplorer (Enable optimized autoscale for Data Explorer resources)](https://aka.ms/adxoptimizedautoscale).

### Change Data Explorer clusters to a more cost effective and better performing SKU

You have resources operating under a nonoptimal SKU. We recommend migrating to a more cost effective and better performing SKU. This SKU should reduce your costs and improve overall performance. We have calculated the required instance count that meets both the CPU and cache of your cluster.

Learn more about [Data explorer resource - SkuChangeForAzureDataExplorer (Change Data Explorer clusters to a more cost effective and better performing SKU)](https://aka.ms/clusterChooseSku).

### Consider Changing Pricing Tier

Based on your current usage volume, investigate changing your pricing (Commitment) tier to receive a discount and reduce costs.

Learn more about [Log Analytics workspace - considerChangingPricingTier (Consider Changing Pricing Tier)](/azure/azure-monitor/logs/change-pricing-tier).

### Consider configuring the low-cost Basic logs plan on selected tables

We have identified ingestion of more than 1 GB per month to tables that are eligible for the low cost Basic log data plan. The Basic log plan gives you search capabilities for debugging and troubleshooting at a lower cost.

Learn more about [Log Analytics workspace - EnableBasicLogs (Consider configuring the low-cost Basic logs plan on selected tables)](https://aka.ms/basiclogs).

### Consider removing unused restored tables

You have one or more tables with restored data active in your workspace. If you're no longer using a restored data, delete the table to avoid unnecessary charges.

Learn more about [Log Analytics workspace - DeleteRestoredTables (Consider removing unused restored tables)](https://aka.ms/LogAnalyticsRestore).

### Consider enabling autopause on Spark compute

Auto-pause releases and shuts down unused Compute resources after a set idle period of inactivity.

Learn more about [Synapse workspace - EnableSynapseSparkComputeAutoPauseGuidance (Consider enabling autopause feature on spark compute.)](https://aka.ms/EnableSynapseSparkComputeAutoPauseGuidance).

### Consider enabling autoscale on Spark compute

Autoscale  automatically scales the number of nodes in a cluster instance up and down. During the creation of a new Spark pool, you can set a minimum and maximum number of nodes when autoscale is selected. Autoscale then monitors the resource requirements of the load and scales the number of nodes up or down. There's no extra charge for this feature.

Learn more about [Synapse workspace - EnableSynapseSparkComputeAutoScaleGuidance (Consider enabling autoscale feature on spark compute.)](https://aka.ms/EnableSynapseSparkComputeAutoScaleGuidance).



## Compute

### Standard SSD disks billing caps.

Customers running high IO workloads in Standard HDDs can upgrade to Standard SSDs and benefit from better performance and SLA and now experience a limit on the maximum number of billed transactions.

Learn more about [Disk - UpgradeHDDtoSDD (Standard SSD disks billing caps.)]().

### Underutilized Disks Identified

You have disks that are utilized less than 10%, right-size to save cost.

Learn more about [Disk - wiprounderutilizeddisks (Underutilized Disks Identified)]().

### You have disks that have not been attached to a VM for more than 30 days. Evaluate if you still need the disk.

We've observed that you have disks that haven't been attached to a VM for more than 30 days. Evaluate if you still need the disk. If you decide to delete the disk, recovery isn't possible. We recommend that you create a snapshot before deletion or ensure the data in the disk is no longer required.

Learn more about [Disk - DeleteOrDowngradeUnattachedDisks (You have disks that haven't been attached to a VM for more than 30 days. Evaluate if you still need the disk.)](https://aka.ms/unattacheddisks).

### Right-size or shutdown underutilized virtual machine scale sets

We've analyzed the usage patterns of your virtual machine scale sets over the past seven days and identified virtual machine scale sets with low usage. While certain scenarios can result in low utilization by design, you can often save money by managing the size and number of virtual machine scale sets.

Learn more about [Virtual machine scale set - LowUsageVmss (Right-size or shutdown underutilized virtual machine scale sets)](https://aka.ms/aa_lowusagerec_vmss_learnmore).




## Databases

### Right-size underutilized MariaDB servers

Our internal telemetry shows that your MariaDB database server resources have been underutilized for an extended period of time over the last seven days. Low resource utilization results in unwanted expenditure that can be fixed without significant performance impact. To reduce your costs and efficiently manage your resources, we recommend reducing the compute size (vCores) by half.

Learn more about [MariaDB server - OrcasMariaDbCpuRightSize (Right-size underutilized MariaDB servers)](https://aka.ms/mariadbpricing).

### Right-size underutilized MySQL servers

Our internal telemetry shows that your MySQL database server resources have been underutilized for an extended period of time over the last seven days. Low resource utilization results in unwanted expenditure that can be fixed without significant performance impact. To reduce your costs and efficiently manage your resources, we recommend reducing the compute size (vCores) by half.

Learn more about [MySQL server - OrcasMySQLCpuRightSize (Right-size underutilized MySQL servers)](https://aka.ms/mysqlpricing).

### Right-size underutilized PostgreSQL servers

Our internal telemetry shows that your PostgreSQL database server resources have been underutilized for an extended period of time over the last seven days. Low resource utilization results in unwanted expenditure that can be fixed without significant performance impact. To reduce your costs and efficiently manage your resources, we recommend reducing the compute size (vCores) by half.

Learn more about [PostgreSQL server - OrcasPostgreSqlCpuRightSize (Right-size underutilized PostgreSQL servers)](https://aka.ms/postgresqlpricing).

### Review the configuration of your Azure Cosmos DB free tier account

Your Azure Cosmos DB free tier account currently contains resources with a total provisioned throughput exceeding 1000 Request Units per second (RU/s). Because the free tier only covers the first 1000 RU/s of throughput provisioned across your account, any throughput beyond 1000 RU/s is billed at the regular pricing. As a result, we anticipate that you're charged for the throughput currently provisioned on your Azure Cosmos DB account.

Learn more about [Azure Cosmos DB account - CosmosDBFreeTierOverage (Review the configuration of your Azure Cosmos DB free tier account)](../cosmos-db/understand-your-bill.md#azure-free-tier).

### Consider taking action on your idle Azure Cosmos DB containers

We haven't detected any activity over the past 30 days on one or more of your Azure Cosmos DB containers. Consider lowering their throughput, or deleting them if you don't plan on using them.

Learn more about [Azure Cosmos DB account - CosmosDBIdleContainers (Consider taking action on your idle Azure Cosmos DB containers)](/azure/cosmos-db/how-to-provision-container-throughput).

### Enable autoscale on your Azure Cosmos DB database or container

Based on your usage in the past seven days, you can save by enabling autoscale. For each hour, we compared the RU/s provisioned to the actual utilization of the RU/s (what autoscale would have scaled to) and calculated the cost savings across the time period. Autoscale helps optimize your cost by scaling down RU/s when not in use.

Learn more about [Azure Cosmos DB account - CosmosDBAutoscaleRecommendations (Enable autoscale on your Azure Cosmos DB database or container)](../cosmos-db/provision-throughput-autoscale.md).

### Configure manual throughput instead of autoscale on your Azure Cosmos DB database or container

Based on your usage in the past seven days, you can save by using manual throughput instead of autoscale. Manual throughput is more cost-effective when average utilization of your max throughput (RU/s) is greater than 66% or less than or equal to 10%.

Learn more about [Azure Cosmos DB account - CosmosDBMigrateToManualThroughputFromAutoscale (Configure manual throughput instead of autoscale on your Azure Cosmos DB database or container)](../cosmos-db/how-to-choose-offer.md).




## Management and Governance

### Configure automatic renewal for your expiring reservation

The reserved instances listed are expiring soon or recently expired. Your resources will continue to operate normally, however, you'll be billed at the on-demand rates going forward. To optimize your costs, configure automatic renewal for these reservations or purchase a replacement manually.

Learn more about [Reservation - ReservedInstancePurchaseNew (Configure automatic renewal for your expiring reservation)](https://aka.ms/reservedinstances).

### Buy virtual machine reserved instance to save money over pay-as-you-go costs

Reserved instance can provide a significant discount over pay-as-you-go prices. With reserved instance, you can prepurchase the base costs for your virtual machines. Discounts automatically apply to new or existing VMs that have the same size and region as your reserved instance. We analyzed your usage over the last 30 days and recommend money-saving reserved instances.

Learn more about [Virtual machine - ReservedInstance (Buy virtual machine reserved instances to save money over pay-as-you-go costs)](https://aka.ms/reservedinstances).

### Consider App Service reserved instance to save over your on-demand costs

We analyzed your App Service usage pattern over the selected term, look-back period, and recommend reserved instance purchase that maximizes your savings. With reserved instance, you can prepurchase hourly usage for the App Service plan and save over your Pay-as-you-go costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions based on usage pattern over selected Term, look-back period.

Learn more about [Subscription - AppServiceReservedCapacity (Consider App Service reserved instance to save over your on-demand costs)](https://aka.ms/rirecommendations).

### Consider Azure Cosmos DB reserved instance to save over your pay-as-you-go costs

We analyzed your Azure Cosmos DB usage pattern over last 30 days and calculate reserved instance purchase that maximizes your savings. With reserved instance, you can prepurchase Azure Cosmos DB hourly usage and save over your pay-as-you-go costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and usage pattern over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings even more.

Learn more about [Subscription - CosmosDBReservedCapacity (Consider Azure Cosmos DB reserved instance to save over your pay-as-you-go costs)](https://aka.ms/rirecommendations).

### Consider virtual machine reserved instance to save over your on-demand costs

Reserved instance can provide a significant discount over on-demand prices. With reserved instance, you can prepurchase the base costs for your virtual machines. Discounts automatically apply to new or existing VMs that have the same size and region as your reserved instance. We analyzed your usage over the selected Term, look-back period, and recommend money-saving reserved instances.

Learn more about [Subscription - ReservedInstance (Consider virtual machine reserved instance to save over your on-demand costs)](https://aka.ms/rirecommendations).

### Consider Cosmos DB reserved instance to save over your pay-as-you-go costs

We analyzed your Cosmos DB usage pattern over selected Term, look-back period and calculate reserved instance purchase that maximizes your savings. With reserved instance, you can prepurchase Cosmos DB hourly usage and save over your pay-as-you-go costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and usage pattern over the selected Term, look-back period. Shared scope recommendations are available in reservation purchase experience and can increase savings even more.

Learn more about [Subscription - CosmosDBReservedCapacity (Consider Cosmos DB reserved instance to save over your pay-as-you-go costs)](https://aka.ms/rirecommendations).

### Consider SQL PaaS DB reserved instance to save over your pay-as-you-go costs

We analyzed your SQL PaaS usage pattern over last 30 days and recommend reserved instance purchase that maximizes your savings. With reserved instance, you can prepurchase hourly usage for your SQL PaaS deployments and save over your SQL PaaS compute costs. SQL license is charged separately and is not discounted by the reservation. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - SQLReservedCapacity (Consider SQL PaaS DB reserved instance to save over your pay-as-you-go costs)](https://aka.ms/rirecommendations).

### Consider App Service stamp fee reserved instance to save over your on-demand costs

We analyzed your App Service isolated environment stamp fees usage pattern over last 30 days and recommend reserved instance purchase to maximize your savings. With reserved instance, you can prepurchase hourly usage for the isolated environment stamp fee and save over your pay-as-you-go costs. Reserved instance only applies to the stamp fee and not to the App Service instances. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions based on usage pattern over last 30 days.

Learn more about [Subscription - AppServiceReservedCapacity (Consider App Service stamp fee reserved instance to save over your on-demand costs)](https://aka.ms/rirecommendations).

### Consider Database for MariaDB reserved instance to save over your pay-as-you-go costs

We analyzed your Azure Database for MariaDB usage pattern over last 30 days and recommend reserved instance purchase that maximizes your savings. With reserved instance, you can prepurchase MariaDB hourly usage and save over your compute costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - MariaDBSQLReservedCapacity (Consider Database for MariaDB reserved instance to save over your pay-as-you-go costs)](https://aka.ms/rirecommendations).

### Consider Database for MySQL reserved instance to save over your pay-as-you-go costs

We analyzed your MySQL Database usage pattern over last 30 days and recommend reserved instance purchase that maximizes your savings. With reserved instance, you can prepurchase MySQL hourly usage and save over your compute costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - MySQLReservedCapacity (Consider Database for MySQL reserved instance to save over your pay-as-you-go costs)](https://aka.ms/rirecommendations).

### Consider Database for PostgreSQL reserved instance to save over your pay-as-you-go costs

We analyzed your Database for PostgreSQL usage pattern over last 30 days and recommend reserved instance purchase that maximizes your savings. With reserved instance, you can prepurchase PostgreSQL Database hourly usage and save over your on-demand costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - PostgreSQLReservedCapacity (Consider Database for PostgreSQL reserved instance to save over your pay-as-you-go costs)](https://aka.ms/rirecommendations).

### Consider Cache for Redis reserved instance to save over your pay-as-you-go costs

We analyzed your Cache for Redis usage pattern over last 30 days and calculated reserved instance purchase that maximizes your savings. With reserved instance, you can prepurchase Cache for Redis hourly usage and save over your current on-demand costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - RedisCacheReservedCapacity (Consider Cache for Redis reserved instance to save over your pay-as-you-go costs)](https://aka.ms/rirecommendations).

### Consider Azure Synapse Analytics (formerly SQL DW) reserved instance to save over your pay-as-you-go costs

We analyze your Azure Synapse Analytics usage pattern over last 30 days and recommend reserved instance purchase that maximizes your savings. With reserved instance, you can prepurchase Synapse Analytics hourly usage and save over your on-demand costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - SQLDWReservedCapacity (Consider Azure Synapse Analytics (formerly SQL DW) reserved instance to save over your pay-as-you-go costs)](https://aka.ms/rirecommendations).

### (Preview) Consider Blob storage reserved instance to save on Blob v2 and Data Lake storage Gen2 costs

We analyzed your Azure Blob and Data Lake storage usage over last 30 days and calculated reserved instance purchase that would maximize your savings. With reserved instance, you can prepurchase hourly usage and save over your current on-demand costs. Blob storage reserved instance applies only to data stored on Azure Blob (GPv2) and Azure Data Lake Storage (Gen 2). Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - BlobReservedCapacity ((Preview) Consider Blob storage reserved instance to save on Blob v2 and and Data Lake storage Gen2 costs)](https://aka.ms/rirecommendations).

### Consider Azure Dedicated Host reserved instance to save over your on-demand costs

We analyzed your Azure Dedicated Host usage over last 30 days and calculated reserved instance purchase that would maximize your savings. With reserved instance, you can prepurchase hourly usage and save over your current on-demand costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - AzureDedicatedHostReservedCapacity (Consider Azure Dedicated Host reserved instance to save over your on-demand costs)](../cost-management-billing/reservations/reserved-instance-purchase-recommendations.md).

### Consider Data Factory reserved instance to save over your on-demand costs

We analyzed your Data Factory usage over last 30 days and calculated reserved instance purchase that would maximize your savings. With reserved instance, you can prepurchase hourly usage and save over your current on-demand costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - DataFactorybReservedCapacity (Consider Data Factory reserved instance to save over your on-demand costs)](../cost-management-billing/reservations/reserved-instance-purchase-recommendations.md).

### Consider Azure Data Explorer reserved instance to save over your on-demand costs

We analyzed your Azure Data Explorer usage over last 30 days and calculated reserved instance purchase that would maximize your savings. With reserved instance, you can prepurchase hourly usage and save over your current on-demand costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - AzureDataExplorerReservedCapacity (Consider Azure Data Explorer reserved instance to save over your on-demand costs)](../cost-management-billing/reservations/reserved-instance-purchase-recommendations.md).

### Consider Azure Files reserved instance to save over your on-demand costs

We analyzed your Azure Files usage over last 30 days and calculated reserved instance purchase that would maximize your savings. With reserved instance, you can prepurchase hourly usage and save over your current on-demand costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - AzureFilesReservedCapacity (Consider Azure Files reserved instance to save over your on-demand costs)](../cost-management-billing/reservations/reserved-instance-purchase-recommendations.md).

### Consider Azure VMware Solution reserved instance to save over your on-demand costs

We analyzed your Azure VMware Solution usage over last 30 days and calculated reserved instance purchase that would maximize your savings. With reserved instance, you can prepurchase hourly usage and save over your current on-demand costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - AzureVMwareSolutionReservedCapacity (Consider Azure VMware Solution reserved instance to save over your on-demand costs)](../cost-management-billing/reservations/reserved-instance-purchase-recommendations.md).

### Consider NetApp Storage reserved instance to save over your on-demand costs

We analyzed your NetApp Storage usage over last 30 days and calculated reserved instance purchase that would maximize your savings. With reserved instance, you can prepurchase hourly usage and save over your current on-demand costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - NetAppStorageReservedCapacity (Consider NetApp Storage reserved instance to save over your on-demand costs)](../cost-management-billing/reservations/reserved-instance-purchase-recommendations.md).

### Consider Azure Managed Disk reserved instance to save over your on-demand costs

We analyzed your Azure Managed Disk usage over last 30 days and calculated reserved instance purchase that would maximize your savings. With reserved instance, you can prepurchase hourly usage and save over your current on-demand costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - AzureManagedDiskReservedCapacity (Consider Azure Managed Disk reserved instance to save over your on-demand costs)](../cost-management-billing/reservations/reserved-instance-purchase-recommendations.md).

### Consider Red Hat reserved instance to save over your on-demand costs

We analyzed your Red Hat usage over last 30 days and calculated reserved instance purchase that would maximize your savings. With reserved instance, you can prepurchase hourly usage and save over your current on-demand costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - RedHatReservedCapacity (Consider Red Hat reserved instance to save over your on-demand costs)](../cost-management-billing/reservations/reserved-instance-purchase-recommendations.md).

### Consider RedHat OSA reserved instance to save over your on-demand costs

We analyzed your RedHat Open Source Assurance (OSA) usage over last 30 days and calculated reserved instance purchase that would maximize your savings. With reserved instance, you can prepurchase hourly usage and save over your current on-demand costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - RedHatOsaReservedCapacity (Consider RedHat OSA reserved instance to save over your on-demand costs)](../cost-management-billing/reservations/reserved-instance-purchase-recommendations.md).

### Consider SapHana reserved instance to save over your on-demand costs

We analyzed your SapHana usage over last 30 days and calculated reserved instance purchase that would maximize your savings. With reserved instance, you can prepurchase hourly usage and save over your current on-demand costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - SapHanaReservedCapacity (Consider SapHana reserved instance to save over your on-demand costs)](../cost-management-billing/reservations/reserved-instance-purchase-recommendations.md).

### Consider SuseLinux reserved instance to save over your on-demand costs

We analyzed your SuseLinux usage over last 30 days and calculated reserved instance purchase that would maximize your savings. With reserved instance, you can prepurchase hourly usage and save over your current on-demand costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - SuseLinuxReservedCapacity (Consider SuseLinux reserved instance to save over your on-demand costs)](../cost-management-billing/reservations/reserved-instance-purchase-recommendations.md).

### Consider VMware Cloud Simple reserved instance

We analyzed your VMware Cloud Simple usage over last 30 days and calculated reserved instance purchase that would maximize your savings. With reserved instance, you can prepurchase hourly usage and save over your current on-demand costs. Reserved instance is a billing benefit and automatically applies to new or existing deployments. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope recommendations are available in reservation purchase experience and can increase savings further.

Learn more about [Subscription - VMwareCloudSimpleReservedCapacity (Consider VMware Cloud Simple reserved instance )](../cost-management-billing/reservations/reserved-instance-purchase-recommendations.md).

### Purchasing a savings plan for compute could unlock lower prices

We analyzed your compute usage over the last 30 days and recommend adding a savings plan to increase your savings. The savings plan unlocks lower prices on select compute services when you commit to spend a fixed hourly amount for 1 or 3 years. As you use select compute services globally, your usage is covered by the plan at reduced prices. During the times when your usage is above your hourly commitment, you’ll simply be billed at your regular pay-as-you-go prices. With savings automatically applying across compute usage globally, you’ll continue saving even as your usage needs change over time. Savings plan are more suited for dynamic workloads while accommodating for planned or unplanned changes while reservations are more suited for stable, predictable workloads with no planned changes. Saving estimates are calculated for individual subscriptions and the usage pattern observed over last 30 days. Shared scope savings plans are available in purchase experience and can further increase savings.

Learn more about [Subscription - SavingsPlan (Purchasing a savings plan for compute could unlock lower prices)](https://aka.ms/savingsplan-compute).





## Networking

### Delete ExpressRoute circuits in the provider status of Not Provisioned

We noticed that your ExpressRoute circuit is in the provider status of Not Provisioned for more than one month. This circuit is currently billed hourly to your subscription. Delete the circuit if you aren't planning to provision the circuit with your connectivity provider.

Learn more about [ExpressRoute circuit - ExpressRouteCircuit (Delete ExpressRoute circuits in the provider status of Not Provisioned)](https://aka.ms/expressroute).

### Repurpose or delete idle virtual network gateways

We noticed that your virtual network gateway has been idle for over 90 days. This gateway is being billed hourly. Reconfigure this gateway, or delete it if you do not intend to use it anymore.

Learn more about [Virtual network gateway - IdleVNetGateway (Repurpose or delete idle virtual network gateways)](https://aka.ms/aa_idlevpngateway_learnmore).





## Storage

### Use Standard Storage to store Managed Disks snapshots

To save 60% of cost, store your snapshots in Standard Storage, regardless of the storage type of the parent disk. It is the default option for Managed Disks snapshots. Migrate your snapshot from Premium to Standard Storage. Refer to Managed Disks pricing details.

Learn more about [Managed Disk Snapshot - ManagedDiskSnapshot (Use Standard Storage to store Managed Disks snapshots)](https://aka.ms/aa_manageddisksnapshot_learnmore).

### Revisit retention policy for classic log data in storage accounts

Large classic log data is detected on your storage accounts. You're billed on capacity of data stored in storage accounts including classic logs. Check the retention policy of classic logs and update with necessary period to retain less log data. This would reduce unnecessary classic log data and save your billing cost from less capacity.

Learn more about [Storage Account - XstoreLargeClassicLog (Revisit retention policy for classic log data in storage accounts)](/azure/storage/common/manage-storage-analytics-logs#modify-retention-policy).

### Based on your high transactions/TB  ratio, premium storage might be more cost effective

Your transactions/TB ratio might be high. Exact number would depend on transaction mix and region but anywhere over 30 or 35 TPB/TB are good candidates to evaluate a move to Premium storage.

Learn more about [Storage Account - MoveToPremiumStorage (Based on your high transactions/TB  ratio, there is a possibility that premium storage might be more cost effective in addition to being performant for your scenario. More details on pricing for premium and standard accounts can be found here)](https://aka.ms/azureblobstoragepricing).

### Use differential or incremental backup for database workloads

For SQL/HANA DBs in Azure VMs being backed up to Azure, using daily differential with weekly full backup is often more cost-effective than daily fully backups. For HANA, Azure Backup also supports incremental backup that is even more cost effective.

Learn more about [Recovery Services vault - Optimize costs of database backup (Use differential or incremental backup for database workloads)](https://aka.ms/DBBackupCostOptimization).

### Use Virtual Machines with Ephemeral OS Disk enabled to save cost and get better performance

With Ephemeral OS Disk, You get these benefits: Save on storage cost for OS disk. Get lower read/write latency to OS disk. Faster VM Reimage operation by resetting OS (and Temporary disk) to its original state. It is preferable to use Ephemeral OS Disk for short-lived IaaS VMs or VMs with stateless workloads.

Learn more about [Subscription - EphemeralOsDisk (Use Virtual Machines with Ephemeral OS Disk enabled to save cost and get better performance)](/azure/virtual-machines/windows/ephemeral-os-disks).






## Web

### Right-size underutilized App Service plans

We've analyzed the usage patterns of your App Service plan over the past seven days and identified low CPU usage. While certain scenarios can result in low utilization by design, you can save money by choosing a less expensive SKU while retaining the same features.

> [!NOTE]
> - Currently, this recommendation only works for App Service plans running on Windows on a SKU that allows you to downscale to less expensive tiers without losing any features, like from P3v2 to P2v2 or from P2v2 to P1v2. 
> - CPU bursts that last only a few minutes might not be correctly detected. Perform a careful analysis in your App Service plan metrics blade before downscaling your SKU.

Learn more about [App Service plans](../app-service/overview-hosting-plans.md).

### Unused/Empty App Service plans

Your App Service plan has no apps running for at least 3 days. Consider deleting the resource to save costs or add new apps under it.

> [!NOTE]
> It might take up to 48 hours for this recommendation to refresh after you take an action.
 
Learn more about [App Service plans](../app-service/overview-hosting-plans.md).

## Azure Monitor

For Azure Monitor cost optimization suggestions, see [Optimize costs in Azure Monitor](../azure-monitor/best-practices-cost.md).

## Next steps

Learn more about [Cost Optimization - Microsoft Azure Well Architected Framework](/azure/architecture/framework/cost/overview)
