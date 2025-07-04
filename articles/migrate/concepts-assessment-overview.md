--- 
title: Overview of Azure Migrate assessment types 
description: Learn about types of assessments in Azure Migrate and its prerequisites. 
author: habibaum
ms.author: v-uhabiba
ms.service: azure-migrate 
ms.topic: concept-article 
ms.date: 04/24/2024 
ms.custom: engagement-fy24 
monikerRange: migrate
# Customer intent: "As an IT administrator, I want to evaluate different assessment types in Azure Migrate, so that I can determine the best migration strategy for our on-premises and cloud workloads to ensure a smooth transition to Azure."
--- 
 
# Assessment overview 
 
This article provides an overview of Azure Migrate assessments. An assessment evaluates workloads hosted on on-premises or other public cloud for migration to Azure Migrate offers performance-based and as-is recommendations for a smooth transition to Azure.   
 
## Assessment types 
 
There are four types of assessments that you can create in Azure Migrate. 
 
**Assessment Type** | **Details** 
--- | --- 
**Azure VM** | Assess your servers hosted on-premises or public clouds to migrate to Azure virtual machines.  
**Azure SQL** | Assess your SQL servers to migrate to Azure SQL Database, Azure SQL Managed Instance, or SQL server on Azure VM. 
**Azure App Service** | Assess your web apps to migrate to [Azure App Service](tutorial-assess-webapps.md), [Azure Spring Apps](tutorial-assess-spring-boot.md), or [Azure Kubernetes Service](tutorial-assess-webapps.md). 
**Azure VMware Solution (AVS)**| Assess your on-premises servers hosted on VMware to [Azure VMware Solution (AVS)](../azure-vmware/introduction.md). [Learn more](concepts-azure-vmware-solution-assessment-calculation.md). 
  
 
## Prerequisites for assessments 
 
- Before you start an assessment, ensure you have appropriately discovered your workload and they're available in the inventory. 
- If you're an EA customer, ensure that you have access to the required subscriptions. 
- For better results, in the case of appliance-based discovery, ensure that the appliances are in a connected state and performance data is flowing. 
 
## Discovery Sources 
 
The discovery source may vary for different assessments depending on the data required for creating the assessments. You can discover your on-premises workloads using either of the following methods: 
 
- By deploying a light-weight Azure Migrate appliance to perform agentless discovery. 
- By importing the workload information using predefined templates. 
 
The recommended discovery source is Azure Migrate appliance as it provides an in-depth view of your machines and ensures regular flow of configuration and performance data and account for changes in the source environment.  
 
> [!NOTE] 
> All assessments that you create with Azure Migrate are a point-in-time snapshot of data. The assessment results are subject to change based on aggregated server performance data collected or change in the source configuration. 
 
 
After you populate the inventory, you can gather relevant workloads to assess into a group and run an assessment for the group with appropriate assessment type. 
 
## What data does the appliance collect? 
 
If you're using the Azure Migrate appliance for assessment, see [metadata and performance](discovered-metadata.md) data collected as an input for the assessment. 
 
## How does the appliance aggregate performance data? 
 
If you're using the appliance for discovery, it collects performance data using following steps: 
 
1. The appliance collects a real-time sample point. 
 
   - VMware VMs - A sample point is collected every 20 seconds. 
   - Hyper-V VMs - A sample point is collected every 30 seconds. 
   - Physical servers -A sample point is collected every 5 minutes. 
 
1. The appliance combines the sample points to create a single data point every 10 minutes for VMware and Hyper-V servers, and every 5 minutes for physical servers. To create the data point, the appliance selects the peak values from all samples and sends the data point to Azure. 
 
1. The assessment stores all the 10-minute data points for the last month. 
 
1. The created assessment identifies the appropriate data point to use for rightsizing. Identification is based on the percentile value for *performance history* and *percentile utilization*. 
    - For example,  if you selected performance history as one week and percentile utilization as 95th percentile while creating the assessments, all the data points are sorted in ascending order and the 95th percentile value is picked for right-sizing. 
    - The 95th percentile value makes sure you ignore any outliers, which might be included if you picked the 99th percentile.  
    - If you want to consider all the outliers while calculating the assessments, select 99th percentile as percentile utilization. 
 
1. The appliance collects and processes following performance attributes from hypervisor or physical server according to the scenario:  
    - CPU utilization  (%) 
    - Memory utilization (%)  
    - Disk Read IO/s and Write IO/s (Data and Log files)  
    - Disk Read MB/s and Write MB/s (Throughput)  
    - Latency of IO operation  
    - Network throughput (in and out) 
 
## How are assessments calculated? 
 
Every assessment calculates the following three attributes:  
 
**Identifying Azure readiness**: Assess whether workloads are suitable for migration to Azure.  
 
**Calculate right-sizing recommendations**: Estimate compute, storage, and network sizing and recommend customers right-sized Azure target services to migrate.   
 
**Calculate monthly costs**: Calculate the estimated monthly resource cost for running the migrated workloads in Azure after migration.  
 
Calculations are in the preceding order. A workload moves to a later stage only if it passes the previous one. For example, if a server fails the Azure readiness stage, it's marked as unsuitable for Azure. Sizing and cost calculations aren't done for that server.  
 
Apart from configuration and performance data, Azure Migrate assessment also considers customers’ intent captured as assessment settings as an input to generate results. The assessment settings can be categorized in the following broad buckets.   
 
**Settings category** | **Details** |   
--- | --- |  
**Target Configuration** | Based on the assessment type, customers are asked to provide their input regarding the targets they want to assess their workloads against. Some important attributes in this category are target location, Environment type, target storage, and compute families etc. These settings differ slightly across different types of assessments. | 
**Pricing Settings** | Customers are asked about the pricing attributes they want to consider during assessment. Customers are asked to choose if they want to assess Pay-as-you Go pricing or if they have a negotiated EA agreement with Azure. If you're an EA customer, select EA subscription as the offer/licensing program and an appropriate subscription ID to fetch the negotiated prices. </br> Customers can specify savings options to optimize on cost. [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) (One year or three year reserved) are a good option for the most consistently running resources. </br>[Azure Savings Plan](../cost-management-billing/savings-plan/savings-plan-compute-overview.md) (one year or three year savings plan) provide additional flexibility and automated cost optimization. Ideally post migration, you could use Azure reservation and savings plan at the same time (reservation will be consumed first), but in the Azure Migrate assessments, you can only see cost estimates of one savings option at a time. </br> When you select *None*, the Azure Compute cost is based on the Pay as you go rate or based on actual usage. When you select any savings option other than *None*, the *Discount (%)* and *VM uptime* properties aren't applicable. The monthly cost estimates are calculated by multiplying 744 hours in the VM uptime field with the hourly price of the recommended SKU.| 
**Sizing criteria** | These attributes are used for right-sizing the target recommendations. </br> Use as-is sizing or performance-based sizing depending on your requirements. Learn more about performance-based assessments.| 
**Performance history** | Used with performance-based sizing. Performance history specifies the duration used when performance data is evaluated.  
**Percentile utilization** | Used with performance-based sizing. Percentile utilization specifies the percentile value of the performance sample used for rightsizing. | 
**Comfort factor** | The buffer used during assessment. It's applied to the CPU, memory, disk, and network right-sizing. It accounts for issues like seasonal usage, short performance history, and likely increases in future usage. </br> For example, a 10-core VM with 20% utilization normally results in a two-core VM. With a comfort factor of 2.0, the result is a four-core VM instead.  
**VM uptime** | The duration in days per month and hours per day for Azure VMs that won't run continuously. Cost estimates are based on that duration. </br> The default values are 31 days per month and 24 hours per day.  
**Azure Hybrid Benefit** | Specifies whether you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/) to use your existing OS and SQL licenses. If the setting is enabled, Azure prices for selected operating systems aren't considered for VM costing and SQL license cost isn't considered in SQL target costing.| 
**Security** | Specifies whether you want to assess readiness and cost for security tooling on Azure. If the setting has the default value **Yes, with Microsoft Defender for Cloud**, it assesses security readiness and costs for your Azure VM with Microsoft Defender for Cloud. | 
 
[Review the best practices](best-practices-assessment.md) for creating an assessment with Azure Migrate. 
 
 
 
## Next steps 
 
[Review](best-practices-assessment.md) best practices for creating assessments.  
 
- Learn about running assessments for servers running in [VMware](./tutorial-discover-vmware.md) and [Hyper-V ](./tutorial-discover-hyper-v.md) environment, and [physical servers](./tutorial-discover-physical.md). 
- Learn about assessing servers [imported with a CSV file](./tutorial-discover-import.md). 
- Learn about setting up [dependency visualization](concepts-dependency-visualization.md). 