--- 
title: Overview assessment 
description: Learn about types of assessments in Azure Migrate. 
author: habibaum
ms.author: v-uhabiba
ms.service: azure-migrate 
ms.topic: concept-article 
ms.date: 04/09/2025 
ms.custom: engagement-fy24 
monikerRange: migrate
--- 

# Overview of assessment

This article provides an overview of Azure Migrate assessments. An Azure Migrate assessment evaluates your workloads hosted on your on-premises datacenter or other public clouds for migration to Azure. Each Azure Migrate assessment analyzes your source workloads for:

* **Migration strategy**: It is a strategy to migrate all the workloads that constitute an application. The strategy is aimed at efficiently migrating all the constituent workloads, which can be a combination of application servers, web apps, databases etc. to Azure.
* **Readiness**: Suitability of source workloads for all valid target Azure services.
* **Right-sized targets** : The recommended targets are right-sized based on compute and storage performance requirements to optimize for resiliency and cost.
* **Azure resource cost**: It is the total resource cost for hosting all the targets on Azure.
* **Migration tool**: It is the recommended tool for migrating the source to the recommended target.

## Assessment types

**Azure Migrate supports two types of assessments**:
* **Application assessments**: You can create an application assessment which can include the constituent workloads, which can be a combination of application servers, web apps, databases etc. to Azure.
* **Workload assessments**: You can create workload assessments for identifying right-sized targets and resource cost for specific workloads. Azure Migrate currently supports creating assessments for following workloads.

| **Workloads**  | **Details**  |
|----------|-------|
| Servers | Assess your servers hosted on-premises or public clouds to migrate to Azure virtual machines. |
| SQL servers and databases | Assess your SQL servers to migrate to Azure SQL Database, Azure SQL Managed Instance, or SQL server on Azure VM. |
| Webapps | Assess your web apps to migrate to Azure App Service, Azure Spring Apps, or Azure Kubernetes Service. |
 Azure VMware Solution (AVS) | Assess your on-premises servers hosted on VMware to Azure VMware Solution (AVS). Learn more. |


## Prerequisites for assessments

* Before you start an assessment, ensure you have appropriately discovered your workload and they're available in the inventory.
* If you're an EA customer, ensure that you have access to the required subscriptions.
* For better results, in the case of appliance-based discovery, ensure that the appliances are in a connected state and performance data is flowing.

## Discovery sources

The discovery source may vary for different assessments depending on the data required for creating the assessments. You can discover your on-premises workloads using either of the following methods:

* By deploying a light-weight Azure Migrate appliance to perform agentless discovery.
* By importing the workload information using import-based discovery. [Lear more](discovery-methods-modes.md).

The recommended discovery source is Azure Migrate appliance as it provides an in-depth view of your machines and ensures regular flow of configuration and performance data and account for changes in the source environment.

> [!NOTE]
> All assessments that you create with Azure Migrate are a point-in-time snapshot of data. The assessment results are subject to change based on aggregated server performance data collected or change in the source configuration.

After you populate the inventory, you can gather relevant workloads to assess into a group and run an assessment for the group with appropriate assessment type.

## Data collected by appliance collect

If you're using the Azure Migrate appliance for assessment, see metadata and performance data collected as an input for the assessment.

## Assessments are calculated

Every assessment calculates the following three attributes:

**Identifying Azure readiness**: Assess whether workloads are suitable for migration to Azure.
**Calculate right-sizing recommendations**: Estimate compute, storage, and network sizing and recommend customers right-sized Azure target services to migrate.
**Calculate monthly costs**: Calculate the estimated monthly resource cost for running the migrated workloads in Azure after migration.

Calculations are in the preceding order. A workload moves to a later stage only if it passes the previous one. For example, if a server fails the Azure readiness stage, it's marked as unsuitable for Azure. Sizing and cost calculations aren't done for that server.

Apart from configuration and performance data, Azure Migrate assessment also considers customers’ intent captured as assessment settings as an input to generate results. The assessment settings can be categorized in the following broad buckets.

| **Settings category**  | **Details**  |
|----------|-------|
| Target Configuration | Based on the assessment type, customers are asked to provide their input regarding the targets they want to assess their workloads against. Some important attributes in this category are target location, Environment type, target storage, and compute families etc. These settings differ slightly across different types of assessments. |
| Pricing Settings | Customers are asked about the pricing attributes they want to consider during assessment. Customers are asked to choose if they want to assess Pay-as-you Go pricing or if they have a negotiated EA agreement with Azure. If you're an EA customer, select EA subscription as the offer/licensing program and an appropriate subscription ID to fetch the negotiated prices. Customers can specify savings options to optimize on cost. Azure reservations (One year or three year reserved) are a good option for the most consistently running resources. Azure Savings Plan (one year or three year savings plan) provide additional flexibility and automated cost optimization. Ideally post migration, you could use Azure reservation and savings plan at the same time (reservation will be consumed first), but in the Azure Migrate assessments, you can only see cost estimates of one savings option at a time. When you select None, the Azure Compute cost is based on the Pay as you go rate or based on actual usage. When you select any savings option other than None, the Discount (%) and VM uptime properties aren't applicable. The monthly cost estimates are calculated by multiplying 744 hours in the VM uptime field with the hourly price of the recommended SKU. |
| Sizing criteria | These attributes are used for right-sizing the target recommendations. Use as-is sizing or performance-based sizing depending on your requirements. Learn more about performance-based assessments. |
| Performance history | Used with performance-based sizing. Performance history specifies the duration used when performance data is evaluated. |
| Percentile utilization | Used with performance-based sizing. Percentile utilization specifies the percentile value of the performance sample used for rightsizing. |
| Comfort factor | The buffer used during assessment. It's applied to the CPU, memory, disk, and network right-sizing. It accounts for issues like seasonal usage, short performance history, and likely increases in future usage. For example, a 10-core VM with 20% utilization normally results in a two-core VM. With a comfort factor of 2.0, the result is a four-core VM instead. |
| VM uptime | The duration in days per month and hours per day for Azure VMs that won't run continuously. Cost estimates are based on that duration. The default values are 31 days per month and 24 hours per day. |
| Azure Hybrid Benefit | Specifies whether you have software assurance and are eligible for Azure Hybrid Benefit to use your existing OS and SQL licenses. If the setting is enabled, Azure prices for selected operating systems aren't considered for VM costing and SQL license cost isn't considered in SQL target costing. |
| Security |Specifies whether you want to assess readiness and cost for security tooling on Azure. If the setting has the default value Yes, with Microsoft Defender for Cloud, it assesses security readiness and costs for your Azure VM with Microsoft Defender for Cloud.|

Review the best practices for creating an assessment with Azure Migrate.

## Next steps

Review best practices for creating assessments.
* Learn about running assessments for servers running in VMware and Hyper-V environment, and physical servers.
* Learn about assessing servers imported with a CSV file.
* Learn about setting up dependency visualization.
