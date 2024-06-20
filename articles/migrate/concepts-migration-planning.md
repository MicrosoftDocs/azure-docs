---
title: Build a migration plan with Azure Migrate
description: Provides guidance on building a migration plan with Azure Migrate.
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/10/2023
ms.custom: engagement-fy23

#Customer intent: I want to learn how to build my migration plan to Azure with Azure Migrate.
---

# Build a migration plan with Azure Migrate

In this article, you learn how to build your migration plan to Azure with [Azure Migrate](migrate-services-overview.md).

## Define cloud migration goals

Identifying your [motivation](/azure/cloud-adoption-framework/strategy/motivations) helps you pin down your strategic migration goals. There are a number of triggers and outcomes when migrating, including the following:

|**Business event** | **Migration outcome**|
|--- | ---|
|Datacenter exit | Cost|
|Merger, acquisition, or divestiture | Reduction in vendor/technical complexity|
|Reduction in capital expenses | Optimization of internal operations|
|End of support for mission-critical technologies | Increase in business agility|
|Response to regulatory compliance changes | Preparation for new technical capabilities|
|New data sovereignty requirements | Scaling to meet market demands|
|Reduction in disruptions, and IT stability improvements | Scaling to meet geographic demands|

For more information, see [Cloud Adoption Framework](/azure/cloud-adoption-framework).

After defining your cloud migration goals, you need to identify and plan a migration path that's tailored for your workloads. The [Azure Migrate: Discovery and Assessment](migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool) tool helps assess on-premises workloads, and provides guidance and tools to help you migrate.

## Understand your digital estate

Start by identifying your on-premises infrastructure, applications, and dependencies. This helps you identify workloads for migration to Azure, and to gather optimized cost projections. The Discovery and assessment tool helps you identify the workloads you have in use, dependencies between workloads, and workload optimization.

### Workloads in use

Azure Migrate uses a lightweight Azure Migrate appliance to perform agentless discovery of on-premises VMware virtual machines, Hyper-V virtual machines, other virtualized servers, and physical servers. Continuous discovery collects server configuration information, and performance metadata, and application data. The appliance collects the following from on-premises servers:

- Server, disk, and NIC metadata.

- Installed applications, roles, and features.

- Performance data, including CPU and memory utilization, disk IOPS, and throughput.

After collecting data, you can export the application inventory list to find apps, and SQL Server instances running on your servers. You can use Azure Migrate's Database Assessment tool to understand SQL Server readiness.

 :::image type="content" source="./media/concepts-migration-planning/application-inventory-portal.png" alt-text="Screenshot of the Application inventory in the Azure portal." lightbox="./media/concepts-migration-planning/application-inventory-portal.png":::

 :::image type="content" source="./media/concepts-migration-planning/application-inventory-export.png" alt-text="Screenshot of an excel spreadsheet showing the application inventory export." lightbox="./media/concepts-migration-planning/application-inventory-export.png":::

Along with data discovered with the Discovery and assessment tool, you can use your Configuration Management Database (CMDB) data to build a view of your server and database estate, and to understand how your servers are distributed across business units, application owners, geographies, etc. This helps decide which workloads to prioritize for migration.

### Dependencies between workloads

After server discovery, you can analyze dependencies to visualize and identify cross-server dependencies, and optimization strategies for moving interdependent servers to Azure. The visualization helps to understand whether certain servers are in use, or if they can be decommissioned instead of being migrated. Analyzing dependencies helps ensure that nothing is left behind, and to avoid surprise outages during migration. With your application inventory and dependency analysis done, you can create high-confidence groups of servers, and start assessing them.

For more information, see [Dependency analysis](concepts-dependency-visualization.md).

 :::image type="content" source="./media/concepts-migration-planning/expand-client-group.png" alt-text="Screenshot of a dependency mapping." lightbox="./media/concepts-migration-planning/expand-client-group.png":::

### Optimization and sizing

Azure provides flexibility when it comes to resizing your cloud capacity over time. Migration provides an opportunity for you to optimize the CPU and memory resources allocated to your servers. Creating an assessment on servers you've identified helps you understand your workload performance history. This is crucial for right sizing Azure virtual machine SKUs, and disk recommendations in Azure.

## Assess migration readiness

### Readiness analysis

You can export the assessment report, and filter the following categories to understand Azure readiness:

- **Ready for Azure**: servers can be migrated as-is to Azure, without any changes.
- **Conditionally ready for Azure**: servers can be migrated to Azure, but need minor changes in accordance with the remediation guidance provided in the assessment.
- **Not ready for Azure**: servers can't be migrated to Azure as-is. Issues must be fixed in accordance with remediation guidance before migration.
- **Readiness unknown**: Azure Migrate can't determine server readiness because of insufficient metadata.

Using database assessments, you can assess the readiness of your SQL Server data estate for migration to Azure SQL Database, or Azure SQL Managed Instances. The assessment shows migration readiness status percentage for each of your SQL server instances. In addition, for each instance you can see the recommended target in Azure, potential migration blockers, a count of breaking changes, readiness for Azure SQL DB or Azure SQL virtual machines, and a compatibility level. You can dig deeper to understand the impact of migration blockers, and recommendations for fixing them.

:::image type="content" source="./media/concepts-migration-planning/database-assessment-portal.png" alt-text="Screenshot of the assessed databases window showing the migration readiness status." lightbox="./media/concepts-migration-planning/database-assessment-portal.png":::

### Sizing Recommendations

After a server is marked as ready for Azure, the discovery and assessment tool makes sizing recommendations that identify the Azure virtual machine SKU and disk type for your servers. You can get sizing recommendations based on performance history to optimize resources as you migrate, or based on on-premises server settings, without performance history. In a database assessment, you can see recommendations for the database SKU, pricing tier, and compute level.

### Get compute costs

Performance-based sizing option in Azure Migrate assessments helps you to right-size virtual machines, and should be used as a best practice for optimizing workloads in Azure. In addition to right-sizing, there are a few other options to help save Azure costs:

- **Reserved Instances**: with [reserved instances(RI)](https://azure.microsoft.com/pricing/reserved-vm-instances/), you can significantly reduce costs compared to [pay-as-you-go pricing](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/).
- **Azure Hybrid Benefit**: with [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/), you can bring on-premises Windows Server licenses with active Software Assurance, or Linux subscriptions, to Azure and combine with reserved instances options.
- **Enterprise Agreement**: Azure [Enterprise Agreements (EA)](../cost-management-billing/manage/ea-portal-agreements.md) can offer savings for Azure subscriptions and services.
- **Offers**: There are multiple [Azure Offers](https://azure.microsoft.com/support/legal/offer-details/). For example, [Pay-As-You-Go Dev/Test](https://azure.microsoft.com/pricing/dev-test/), or [Enterprise Dev/Test offer](https://azure.microsoft.com/offers/ms-azr-0148p/), to provide lower rates for dev/test VMs
- **Virtual machine uptime**: You can review days per month and hours per day in which Azure virtual machines run. Shutting off servers when they're not in use can reduce your costs (not applicable for RIs).
- **Target region**: You can create assessments in different regions, to figure out whether migrating to a specific region might be more cost effective.

### Visualize data

The discovery and assessment tool's reports display Azure readiness information, and monthly cost distribution in the portal. You can also export assessment, and enrich your migration plan with additional visualizations. You can create multiple assessments, with different combinations of properties, and choose the set of properties that work best for your business.

:::image type="content" source="./media/concepts-migration-planning/assessment-summary.png" alt-text="Screenshot of an assessment report showing visualizations for Azure readiness and monthly cost distribution." lightbox="./media/concepts-migration-planning/assessment-summary.png":::

### Evaluate constraints

As you figure out the apps and workloads you want to migrate, you can identify downtime constraints and look for any operational dependencies between your apps and the underlying infrastructure. This analysis helps you plan migrations that meet your Recovery Time Objective (RTO), and ensure minimal to zero data loss. Before you migrate, we recommend that you review and mitigate any compatibility issues, or unsupported features that may block server or SQL database migration. The Azure Migrate Discovery and assessment report and Azure Migrate Database Assessment can help with this.

### Prioritize workloads

After you collect information about your inventory, you can identify which apps and workloads to migrate first. Develop an “apply and learn” approach to migrate apps in a systematic and controllable way, so that you can fix any issues before starting a full-scale migration.

To prioritize migration order, you can use strategic factors such as complexity, time-to-migrate, business urgency, production or non-production considerations, compliance, security requirements, application knowledge, etc.

#### Recommendations

- **Prioritize quick wins**: use the assessment reports to identify migration-ready states, including servers and databases that are fully ready, and require minimal effort to migrate to Azure. The following table provides examples of migration-ready states and the action required to achieve migration.

    |**State** | **Action**|
    |--- | ---|
    |**Azure ready virtual machines** | Export the assessment report, and filter all servers with state *Ready for Azure*. This might be the first group of servers that you lift and shift to Azure, using the [Migration and modernization](migrate-services-overview.md#migration-and-modernization-tool) tool.|
    |**End-of-support operating systems** | Export the assessment report, and filter all servers running Windows Server 2008 R2/Windows Server 2008. These operating systems are at the end of support, and only Azure provides a free three years of security updates when you migrate them to Azure. If you combine Azure Hybrid Benefit, and use RIs, the savings can be higher.|
    |**SQL Server migration** | Use the database assessment recommendations to migrate databases that are ready for Azure SQL Database, using the Azure Migrate: Database Migration tool. Migrate the databases ready for Azure SQL virtual machine using the migration and modernization tool.|
    |**End-of-support software** | Export your application inventory, and filter for any software or extensions that might be reaching end-of-support. Prioritize these applications for migration.|
    |**Under-provisioned servers** | Export the assessment report, and filter for servers with low CPU utilization (%) and memory utilization (%).  Migrate to a right-sized Azure virtual machine, and save on costs for underutilized resources.|
    |**Over-provisioned servers** | Export the assessment report and filter for servers with high CPU utilization (%) and memory utilization (%).  Solve capacity constraints, prevent overstrained servers from breaking, and increase performance by migrating these servers to Azure. In Azure, use autoscaling capabilities to meet demand.<br/><br/> Analyze assessment reports to investigate storage constraints. Analyze disk IOPS and throughput, and the recommended disk type.|

- **Start small, then go big**: start by moving apps and workloads that  present minimal risk and complexity, to build confidence in your migration strategy. Analyze Azure Migrate assessment recommendations together with your CMDB repository, to find and migrate dev/test workloads that might be candidates for pilot migrations. Feedback and learnings from pilot migrations can be helpful as you begin migrating production workloads.
- **Comply**: Azure maintains the largest compliance portfolio in the industry. Use compliance requirements to prioritize migrations, so that apps and workloads comply with your national or regional and industry-specific standards and laws. This is especially true for organizations that deal with business-critical process, hold sensitive information, or are in heavily regulated industries. In these types of organizations, standards and regulations abound, and might change often, making it difficult to keep up with.

## Finalize the migration plan

Before finalizing your migration plan, make sure you consider and mitigate other potential blockers, such as:

- **Network requirements**: evaluate network bandwidth and latency constraints, which might cause unforeseen delays and disruptions to migration replication speed.
- **Testing/post-migration tweaks**: allow a time buffer to conduct performance and user acceptance testing for migrated apps, or to configure apps post-migration, such as updating database connection strings, configuring web servers, performing cut-overs and cleanup.
- **Permissions**: review recommended Azure permissions, and server or database access roles and permissions needed for migration.
- **Training**: prepare your organization for the digital transformation. A solid training foundation is important for successful organizational change. Check out free [Microsoft Learn training](/training/azure/?ocid=CM_Discovery_Checklist_PDF), including courses on Azure fundamentals, solution architectures, and security. Encourage your team to explore [Azure certifications](/certifications).
- **Implementation support**: get support for your implementation if needed. Many organizations outsource the effort of cloud migration. To move to Azure quickly and confidently with personalized assistance, consider an [Azure Expert Managed Service Provider](https://www.microsoft.com/solution-providers/search?cacheId=9c2fed4f-f9e2-42fb-8966-4c565f08f11e&ocid=CM_Discovery_Checklist_PDF), or [FastTrack for Azure](https://azure.microsoft.com/programs/azure-fasttrack/?ocid=CM_Discovery_Checklist_PDF).
- Create an effective cloud migration plan that includes detailed information about the apps you want to migrate, app and database availability, downtime constraints, and migration milestones. The plan considers how long the data copy takes, and include a realistic buffer for post-migration testing, and cut-over activities. A post-migration testing plan should include functional, integration, security, and performance testing and use cases to ensure that migrated apps work as expected, and that all database objects and data relationships are transferred successfully to the cloud.
- Build a migration roadmap and declare a maintenance window to migrate your apps and databases with minimal to zero downtime, and limit the potential operational and business impact during migration.

## Migrate

When you're ready for migration, use the Migration and modernization tool, and the Azure Data Migration Service (DMS) for a seamless and integrated migration experience with end-to-end tracking.

With the Migration and modernization tool, you can migrate on-premises virtual machines and servers, or virtual machines located in other private or public cloud, including AWS, GCP, with around zero downtime.

Azure DMS provides a fully managed service that's designed to enable seamless migrations from multiple database sources to Azure Data platforms, with minimal downtime.

> [!TIP]
> We recommend that you run a test migration in Azure Migrate, before starting a full-scale migration. A test migration helps you estimate the time involved, and allow you to make changes to your migration plan if needed. It provides an opportunity to discover any potential issues, and fix them before the full migration.

### Upgrade Windows OS

Azure Migrate provides customers an option to upgrade their Windows Server OS seamlessly during the migration process. Azure Migrate OS upgrade allows you to move from an older operating system to a newer one while keeping your settings, server roles, and data intact. For more information, see [Azure Migrate Windows Server upgrade](how-to-upgrade-windows.md).

Azure Migrate OS upgrade uses an Azure virtual machine [Custom script extension](../virtual-machines/extensions/custom-script-windows.md) to perform the following activities for an in-place upgrade experience:

- A data disk containing Windows Server setup files is created and attached to the virtual machine.
- A Custom Script Extension called `InPlaceOsUpgrade` is enabled on the virtual machine, which downloads a script from the storage account and initiates the upgrade in a quiet mode.

## Related content

- [Get started: Accelerate migration](/azure/architecture/cloud-adoption/getting-started/migrate).
- [About Azure Migrate](migrate-services-overview.md).
- [Assessment overview (migrate to Azure virtual machines)](concepts-assessment-calculation.md).
