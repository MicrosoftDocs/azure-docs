--- 
title: Overview Assessment 
description: Learn about types of assessments in Azure Migrate. 
author: habibaum
ms.author: v-uhabiba
ms.service: azure-migrate 
ms.topic: concept-article 
ms.date: 04/09/2025 
ms.custom: engagement-fy24 
monikerRange:
# Customer intent: As a cloud architect, I want to evaluate and conduct Azure Migrate assessments for my workloads so that I can determine the best migration strategy, estimate costs, and ensure the readiness of my applications for a successful transition to Azure.
--- 

# Overview of assessment

This article provides an overview of Azure Migrate assessments. An Azure Migrate assessment evaluates your workloads hosted on your on-premises datacenter or other public clouds for migration to Azure. Each Azure Migrate assessment analyzes your source workloads for:

* **Migration strategy**: A strategy to migrate all the workloads that constitute an application. The strategy is aimed at efficiently migrating all the constituent workloads, which can be a combination of application servers, web apps, and databases to Azure.
* **Readiness**: The suitability of source workloads for all valid target Azure services.
* **Rightsized targets**: The recommended targets are rightsized based on compute and storage performance requirements to optimize for resiliency and cost.
* **Azure resource cost**: The total resource cost for hosting all the targets on Azure.
* **Migration tool**: The recommended tool for migrating the source to the recommended target.

The following video provides an overview of Azure Migrate assessments and how they help evaluate workloads for migration to Azure.

> [!VIDEO https://learn-video.azurefd.net/vod/player?id=a729f5ec-5c54-45e9-947e-2a2a807bb11e]

## Assessment types

Azure Migrate supports two types of assessments:

* **Application assessments**: You can create an application assessment that includes the constituent workloads, which can be a combination of application servers, web apps, and databases to Azure.
* **Workload assessments**: You can create workload assessments to identify rightsized targets and resource cost for specific workloads. Azure Migrate currently supports creating assessments for the following workloads.

| Workloads  | Details  |
|----------|-------|
| Servers | Assess your servers hosted on-premises or in public clouds to migrate to Azure virtual machines (VMs). |
| Azure VMware Solution | Assess your on-premises servers hosted on VMware to Azure VMware Solution. [Learn more](/azure/azure-vmware/introduction). |
| SQL servers and databases | Assess your SQL servers to migrate to Azure SQL Database, Azure SQL Managed Instance, or SQL Server on Azure VMs. |
| Web apps | Assess your web apps to migrate to Azure App Service, Azure Spring Apps, or Azure Kubernetes Service. |

## Prerequisites for assessments

* Before you start an assessment, ensure that you discovered your appropriate workload and that it's available in the inventory.
* If you're an Enterprise Agreement customer, ensure that you have access to the required subscriptions.
* For better results for appliance-based discovery, ensure that the appliances are in a connected state and performance data is flowing.

## Discovery sources

The discovery source might vary for different assessments depending on the data that's required to create the assessments. You can discover your on-premises workloads by using one of the following methods:

* Deploy a lightweight Azure Migrate appliance to perform agentless discovery.
* Import the workload information by using import-based discovery. For more information on available discovery methods, see [Discovery methods](discovery-methods-modes.md).

We recommend that you use the Azure Migrate appliance as the discovery source because it provides an in-depth view of your machines. It also ensures the regular flow of configuration and performance data and accounts for changes in the source environment.

> [!NOTE]
> All assessments that you create with Azure Migrate are a point-in-time snapshot of data. The assessment results are subject to change based on aggregated server performance data collected or changed in the source configuration.

After you populate the inventory, you can gather relevant workloads to assess into a group. Then you can run an assessment for the group with the appropriate assessment type.

## Data collected by appliance

If you use the Azure Migrate appliance for assessment, see the [metadata and performance data](discovered-metadata.md) that's collected as an input for the assessment.

## Assessments are calculated

Every assessment calculates three attributes in the following order:

1. **Identifies Azure readiness**: Assesses whether workloads are suitable for migration to Azure.
1. **Calculates rightsizing recommendations**: Estimates compute, storage, and network sizing and recommends that you rightsize Azure target services to migrate.
1. **Calculates monthly costs**: Calculates the estimated monthly resource cost for running the migrated workloads in Azure after migration.

A workload moves to a later stage only if it passes the previous one. For example, if a server fails the Azure readiness stage, it's marked as unsuitable for Azure. Sizing and cost calculations aren't done for that server.

Apart from configuration and performance data, Azure Migrate assessment also considers your intent captured as assessment settings as an input to generate results. The assessment settings are categorized in the following broad categories.

| Settings category  | Details  |
|----------|-------|
| Target configuration | Based on the assessment type, the input that you provide regarding the targets that you want to assess your workloads against. Some important attributes in this category are target location, environment type, target storage, and compute families. These settings differ slightly across different types of assessments. |
| Pricing settings | The pricing attributes to consider during assessment. You're asked to choose if you want to assess pay-as-you-go pricing or if you have a negotiated Enterprise Agreement with Azure. If you're an Enterprise Agreement customer, select the Enterprise Agreement subscription as the offer or licensing program and an appropriate subscription ID to fetch the negotiated prices.<br/><br/> You can specify savings options to optimize on cost. Azure reservations (one-year or three-year reservations) are a good option for the most consistently running resources. Azure savings plans (one-year or three-year savings plans) provide more flexibility and automated cost optimization. Ideally, post migration, you could use an Azure reservation and savings plan at the same time. (The reservation is consumed first.) <br/><br/>In Azure Migrate assessments, you can see cost estimates of only one savings option at a time. When you select **None**, the Azure compute cost is based on the pay-as-you-go rate or based on actual usage. When you select any savings option other than **None**, the **Discount (%)** and **VM uptime** properties don't apply. The monthly cost estimates are calculated by multiplying 744 hours in the **VM uptime** field with the hourly price of the recommended product. |
| Sizing criteria | The attributes used for rightsizing the target recommendations. Use as-is sizing or performance-based sizing depending on your requirements. Learn more about [performance-based assessments](./best-practices-assessment.md). |
| Performance history | The performance history used with performance-based sizing. Specifies the duration used when performance data is evaluated. |
| Percentile utilization |  The percentile utilization used with performance-based sizing. Specifies the percentile value of the performance sample used for rightsizing. |
| Comfort factor | The buffer used during assessment. It's applied to the CPU, memory, disk, and network rightsizing. It accounts for issues like seasonal usage, short performance history, and likely increases in future usage. For example, a 10-core VM with 20% utilization normally results in a two-core VM. With a comfort factor of 2.0, the result is a four-core VM instead. |
| VM uptime | The duration in days per month and hours per day for Azure VMs that don't run continuously. Cost estimates are based on that duration. The default values are 31 days per month and 24 hours per day. |
| Azure Hybrid Benefit | The setting specifies whether you have Software Assurance and are eligible for Azure Hybrid Benefit to use your existing operating system and SQL licenses. If the setting is enabled, Azure prices for selected operating systems aren't considered for VM costing. SQL license cost isn't considered in SQL target costing. |
| Security |The setting specifies whether you want to assess readiness and cost for security tooling on Azure. If the setting has the default value **Yes**, with Microsoft Defender for Cloud, it assesses security readiness and costs for your Azure VM with Defender for Cloud.|

## Related content

- Review the [best practices for creating an assessment](./best-practices-assessment.md) with Azure Migrate.
- Learn about how to run assessments for servers that run in [VMware](./tutorial-discover-vmware.md) and [Hyper-V ](./tutorial-discover-hyper-v.md) environment, and [physical servers](./tutorial-discover-physical.md).
- Learn about how to assess servers [imported with a comma-separated value file](./tutorial-discover-import.md).
- Learn about how to set up [dependency visualization](concepts-dependency-visualization.md).