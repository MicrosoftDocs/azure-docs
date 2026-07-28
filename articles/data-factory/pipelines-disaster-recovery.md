---
title: BCDR for Azure Data Factory and Azure Synapse Analytics Pipelines
description: Learn about automated and user-managed business continuity and disaster recovery (BCDR) methods for Azure Data Factory and Azure Synapse Analytics pipelines.
author: ssabat
ms.date: 06/26/2025
ms.subservice: orchestration
ms.topic: troubleshooting
ms.author: susabat
ms.reviewer: susabat
---

# Business continuity and disaster recovery for Azure Data Factory and Azure Synapse Analytics pipelines

Disasters can be hardware failures, natural disasters, or software failures. The process of preparing for and recovering from a disaster is called disaster recovery (DR). This article describes recommended practices to achieve business continuity and disaster recovery (BCDR) for Azure Data Factory and Azure Synapse Analytics pipelines.

BCDR strategies include availability zone redundancy, automated recovery that Azure DR provides, and user-managed recovery by using continuous integration and continuous delivery (CI/CD).

## Architecture

:::image type="complex" border="false" source="media/pipelines-disaster-recovery/pipelines-disaster-recovery.svg" alt-text="Diagram that shows availability zones and regions for Azure Synapse Analytics and Azure Data Factory pipelines BCDR." lightbox="media/pipelines-disaster-recovery/pipelines-disaster-recovery.svg":::
   The image shows two regions. The first region is labeled Git repo with CI/CD. It has three availability zones. Azure Data Factory, Azure Synapse Analytics pipelines, Azure Repos, and GitHub span the three zones. The second region is an exact duplicate of the first region. An arrow labeled To meet business continuity and recovery goals points from the first region to the second region.
:::image-end:::

*Download a [Visio file](https://arch-center.azureedge.net/azure-synapse-data-factory.vsdx) of this architecture.*

### Workflow

- Azure Data Factory and Azure Synapse Analytics pipelines achieve resiliency by using Azure regions and Azure availability zones.

  - Each Azure region has a set of datacenters that are deployed within a latency-defined perimeter.

  - Azure availability zones are physically separate locations within each Azure region. The zones can tolerate local failures.

  - All Azure regions and availability zones are connected through a dedicated, regional low-latency network and a high-performance network.

  - All availability zone-enabled regions have at least three separate availability zones to ensure resiliency.

- When a datacenter, part of a datacenter, or an availability zone in a region fails, zone-resilient Azure Data Factory and Azure Synapse Analytics pipelines fail over with zero downtime.

### Components

- [Azure Data Factory](/azure/data-factory/introduction) is a cloud-based data integration service designed to help you manage and automate data workflows at scale. In this architecture, it orchestrates data movement and transformation workflows and supports resiliency and recovery through region-paired automated failover and CI/CD-based user-managed recovery.

- [Azure Synapse Analytics](/azure/synapse-analytics/overview-what-is) is a unified platform for big data and data warehousing that's designed to help you analyze vast amounts of data quickly and efficiently.

  - [Azure Synapse Analytics pipelines](/azure/synapse-analytics/get-started-pipelines) is a data integration and orchestration feature within Azure Synapse Analytics that you can use to build, manage, and automate workflows for moving and transforming data. In this architecture, Azure Synapse Analytics pipelines manage data workflows and support BCDR by enabling zone-redundancy, integration with Git repositories, and automated or user-managed recovery approaches.

- [GitHub](https://docs.github.com/get-started/start-your-journey/about-github-and-git) is a cloud-based platform that helps developers collaborate, manage code, and track changes in software projects by using Git. In this architecture, GitHub stores pipeline artifacts and enables automated deployment to secondary regions as part of the user-managed recovery strategy.

- [Azure Repos](/azure/devops/repos/get-started/what-is-repos) is a set of version control tools that you can use to manage your code. In this architecture, it functions similarly to GitHub by providing source control and CI/CD integration for Azure Data Factory and Azure Synapse Analytics pipelines to support manual DR and failover readiness.

## Scenario details

Azure Data Factory and Azure Synapse Analytics pipelines store artifacts that include the following types of data:

- Metadata such as pipelines, datasets, linked services, integration runtimes (IRs), and triggers

- Monitoring data such as pipeline runs, trigger runs, and activity runs

Disasters can occur in various forms, such as hardware failures, natural events, or software failures caused by human error or cyberattacks. Depending on the type of failure, the geographic impact might be regional or global. When you plan a DR strategy, consider both the nature of the disaster and its potential geographic scope.

BCDR in Azure operates under a shared responsibility model. Azure provides the foundational infrastructure and platform services, but many Azure offerings require you to actively configure your DR strategies.

You can use the following recommended practices to achieve BCDR for Azure Data Factory and Azure Synapse Analytics pipelines under various failure scenarios. For implementation, see [Deploy this scenario](#deploy-this-scenario).

### Automated recovery with Azure DR

When you [configure automated recovery](#deploy-this-scenario) with backup and DR, a complete outage in an Azure region that has a paired region triggers Azure Data Factory or Azure Synapse Analytics pipelines to automatically fail over to the paired region. Exceptions include Southeast Asia and Brazil regions, where data residency requirements require data to stay in those regions.

In DR failover, Azure Data Factory recovers the production pipelines. If you need to validate your recovered pipelines, you can back up the Azure Resource Manager templates for your production pipelines in secret storage and compare the recovered pipelines to the backups.

The Azure Global team conducts regular BCDR drills, and Azure Data Factory and Azure Synapse Analytics participate in these drills. The BCDR drill simulates a region failure and fails over Azure services to a paired region without any customer involvement. For more information about the BCDR drills, see [Testing of services](/azure/reliability/business-continuity-management-program#testing-and-drills).

### User-managed redundancy with CI/CD

To achieve BCDR if a complete regional failure occurs, you must have an Azure Data Factory or Azure Synapse workspace provisioned in a secondary region. In cases of accidental deletion, service outages, or internal maintenance events affecting Azure Data Factory or Azure Synapse Analytics pipelines, you can recover the pipelines manually by using Git integration and CI/CD workflows.

Optionally, you can use an active/passive implementation. The primary region handles normal operations and remains active. Promoting the secondary DR region to the primary region requires preplanned steps that vary according to the specific implementation. These steps ensure a smooth transition and minimal disruption if a regional failure occurs. In this case, all the necessary configurations for infrastructure are available in the secondary region, but they aren't provisioned.

### Potential use cases

User-managed redundancy is useful in the following scenarios:

- Accidental deletion of pipeline artifacts because of human error
- Extended outages or maintenance events that don't trigger BCDR because there's no disaster reported

You can quickly move your production workloads to other regions and not be affected.

## Considerations

These considerations implement the pillars of the Azure Well-Architected Framework, which is a set of guiding tenets that you can use to improve the quality of a workload. For more information, see [Well-Architected Framework](/azure/well-architected/).

### Reliability

Reliability helps ensure that your application can meet the commitments that you make to your customers. For more information, see [Design review checklist for Reliability](/azure/well-architected/reliability/checklist).

Azure Data Factory and Azure Synapse Analytics pipelines are mainstream Azure services that support availability zones. They're designed to provide the right level of resiliency and flexibility along with ultra-low latency.

The user-managed recovery approach allows you to continue operations if there are any maintenance events, outages, or human errors in the primary region. By using CI/CD, Azure Data Factory and Azure Synapse Analytics pipelines can integrate to a Git repository and deploy to a secondary region for immediate recovery.

### Cost Optimization

Cost Optimization focuses on ways to reduce unnecessary expenses and improve operational efficiencies. For more information, see [Design review checklist for Cost Optimization](/azure/well-architected/cost-optimization/checklist).

User-managed recovery integrates Azure Data Factory with Git by using CI/CD. It optionally uses a secondary DR region that has all the necessary infrastructure configurations as a backup. This scenario might incur added costs. To estimate costs, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator).

For examples of Azure Data Factory and Azure Synapse Analytics pricing, see the following articles:

- [Understand Azure Data Factory pricing through examples](/azure/data-factory/pricing-concepts)
- [Azure Synapse Analytics pricing](https://azure.microsoft.com/pricing/details/synapse-analytics)

### Operational Excellence

Operational Excellence covers the operations processes that deploy an application and keep it running in production. For more information, see [Design review checklist for Operational Excellence](/azure/well-architected/operational-excellence/checklist).

By using the user-managed CI/CD recovery approach, you can integrate to Azure Repos or GitHub. For more information, see [Best practices for CI/CD](/azure/data-factory/continuous-integration-delivery#best-practices-for-cicd).

## Deploy this scenario

Take the following actions to set up automated or user-managed DR for Azure Data Factory and Azure Synapse Analytics pipelines.

### Set up automated recovery

In Azure Data Factory, you can set the Azure IR region for your activity run or dispatch in the **IR setup**. To enable automatic failover if a complete regional outage occurs, set the **Region** to **Auto Resolve**.

:::image type="complex" border="false" source="media/pipelines-disaster-recovery/integration-runtime.svg" alt-text="Screenshot that shows how to select Auto Resolve to enable automatic failover in the IR setup." lightbox="media/pipelines-disaster-recovery/integration-runtime.svg":::
   The image shows a screenshot of Auto Resolve in Azure Data Factory. The top of the page shows IR setup. There are three tabs: Settings, Virtual Network, and Data flow runtime. The page is toggled to Settings. A short description reads: The Azure Data Factory manages the IR in Azure to connect to required data source/destination or external compute in public network. The compute resource is elastically allocated based on performance requirement of activities. Beneath this short description are four fields: Name, Description, Type, and Region. The Name field is populated with integrationRuntime1. The Description field is empty. The Type field is populated with Azure. The Region field is populated with Auto Resolve and shows a drop-down menu that filters out regions.
:::image-end:::

When you select **Auto Resolve** as the IR region, the IR fails over automatically to the paired region. For other specific location regions, you can create a secondary data factory in another region and use CI/CD to provision your data factory from the Git repository.

- For managed virtual networks, you must manually switch to the secondary region.

- Azure managed automatic failover doesn't apply to a self-hosted integration runtime (SHIR) because the infrastructure is customer-managed. For guidance about how to set up multiple nodes for higher availability by using a SHIR, see [Create and configure a SHIR](/azure/data-factory/create-self-hosted-integration-runtime#high-availability-and-scalability).

- To configure BCDR for Azure SQL Server Integration Services (Azure-SSIS) IR, see [Configure Azure-SSIS IR for BCDR](/azure/data-factory/configure-bcdr-azure-ssis-integration-runtime).

Linked services aren't fully enabled after failover because of pending private endpoints in the newer network of the region. You need to configure private endpoints in the recovered region. You can automate private endpoint creation by using the [approval API](/powershell/module/az.network/approve-azprivateendpointconnection).

### Set up user-managed recovery through CI/CD

You can use Git and CI/CD to recover pipelines manually if an Azure Data Factory or Azure Synapse pipeline deletion or outage occurs.

- To use Azure Data Factory pipeline CI/CD, see [CI/CD in Azure Data Factory](/azure/data-factory/continuous-integration-delivery) and [Source control in Azure Data Factory](/azure/data-factory/source-control).

- To use Azure Synapse Analytics pipeline CI/CD, see [CI/CD for an Azure Synapse Analytics workspace](/azure/synapse-analytics/cicd/continuous-integration-delivery). Make sure to initialize the workspace first. For more information, see [Source control in Synapse Studio](/azure/synapse-analytics/cicd/source-control).

When you deploy user-managed redundancy by using CI/CD, take the following actions.

#### Disable triggers

Disable triggers in the original primary data factory after it comes back online. You can disable the triggers manually or implement automation to periodically check the availability of the original primary data factory. Disable all triggers on the original primary data factory immediately after the factory recovers.

To use Azure PowerShell to turn Azure Data Factory triggers off or on, see [Sample pre-deployment and post-deployment script](/azure/data-factory/continuous-integration-delivery-sample-script) and [CI/CD improvements related to pipeline triggers deployment](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/ci-cd-improvements-related-to-pipeline-triggers-deployment/ba-p/3605064).

#### Handle duplicate writes

Most extract, transform, and load pipelines are designed to handle duplicate writes because backfill and restatement processes require them. Data sinks that support transparent failover can handle duplicate writes by merging records or by deleting and inserting all records in the specific time range.

For data sinks that change endpoints after failover, primary and secondary storage might have duplicate or partial data. You need to merge the data manually.

#### Check the witness and control the pipeline flow (optional)

In general, you need to design your pipelines to include activities, like fail and lookup activities, for restarting failed pipelines from the point of interest.

1. Add a global parameter in your data factory to indicate the region, such as `region='EastUS'` in the primary data factory and `region='CentralUS'` in the secondary data factory.

1. Create a witness in a third region. The witness can be a REST call or any type of storage. The witness returns the current primary region, such as `'EastUS'`, by default.

1. When a disaster occurs, manually update the witness to return the new primary region, such as `'CentralUS'`.

1. Add an activity in your pipeline to look up the witness and compare the current primary value to the global parameter.

   - If the parameters match, this pipeline runs on the primary region. Proceed with the main processing tasks.

   - If the parameters don't match, this pipeline runs on the secondary region. Only return the result.

> [!NOTE]
> This approach introduces a dependency on the witness lookup into your pipeline. Failure to read the witness halts all pipeline runs.

## Related resources

- [What are business continuity, high availability, and DR?](/azure/reliability/concept-business-continuity-high-availability-disaster-recovery)
- [Reliability in Azure](/azure/reliability/overview)
- [What are Azure regions?](/azure/reliability/regions-overview)
- [What are Azure availability zones?](/azure/reliability/availability-zones-overview)
- [Azure regions decision guide](/azure/cloud-adoption-framework/migrate/azure-best-practices/multiple-regions)
- [Azure services that support availability zones](/azure/reliability/regions-list)
- [Shared responsibility for reliability](/azure/reliability/concept-shared-responsibility)
- [Azure Data Factory data redundancy](/azure/reliability/reliability-data-factory)
- [IR in Azure Data Factory](/azure/data-factory/concepts-integration-runtime)
- [Pipelines and activities in Azure Data Factory and Azure Synapse Analytics](/azure/data-factory/concepts-pipelines-activities)
- [Data integration in Azure Synapse Analytics versus Azure Data Factory](/azure/synapse-analytics/data-integration/concepts-data-factory-differences)
