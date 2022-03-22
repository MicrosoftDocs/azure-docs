---
title: Pipeline disaster recovery
titleSuffix: Azure Data Factory & Azure Synapse
description: Lean about disaster recovery in Azure Data Factory and Azure Synapse pipelines.
author: ssabat
ms.author: susabat
ms.reviewer: susabat
ms.service: data-factory
ms.subservice: concepts
ms.custom: synapse
ms.topic: conceptual
ms.date: 03/21/2022
---

# Pipeline disaster recovery in Azure Data Factory and Azure Synapse

## Introduction

Potential disasters have a geographical impact that can be local, regional, country wide, continental, or global. Both the nature of the disaster and the geographical impact are important when considering your disaster recovery strategy. For example, you can mitigate a local flooding issue causing a data center outage by employing a Multi-AZ strategy, since it would not affect more than one Availability Zone. However, an attack on production data would require you to invoke a disaster recovery strategy that fails over to backup data in another Azure  Region. 

## Azure Cloud

Azure is responsible for resiliency of the infrastructure that runs all of the services offered in the Azure Cloud. The Azure Global Cloud Infrastructure is designed to enable customers to build highly resilient workload architectures. Each Azure  Region is fully isolated and consists of multiple Availability Zones, which are physically isolated partitions of infrastructure.  

Availability Zones isolate faults that could impact workload resilience, preventing them from impacting other zones in the Region. But at the same time, all zones in an Azure Region are interconnected with high-bandwidth, low-latency networking, over fully redundant, dedicated metro fiber providing high-throughput, low-latency networking between zones. All traffic between zones is encrypted. The network performance is sufficient to accomplish synchronous replication between zones. Availability Zones simplify the process of partitioning applications for high availability. 

## Customer responsibility

Your responsibility will be determined by the Azure  Cloud services that you select. This determines the amount of configuration work you must perform as part of your resilience responsibilities. For example, a service such as Azure VM   requires the customer to perform all of the necessary resiliency configuration and management tasks. Customers that deploy Azure VM instances are responsible for deploying VM instances across multiple locations (such as Availability Zones), implementing self-healing using services like  Auto Scaling , as well as using resilient workload architecture best practices for applications installed on the instances. For managed services, such as Azure Synapse/ADF, Azure operates the infrastructure layer, the operating system, and platforms, and customers access the endpoints to store and retrieve data. You are responsible for managing resiliency of your data including backup, versioning, and replication strategies. 

Customers are responsible for the availability of their applications in the cloud. It is important to define what a disaster is and to have a disaster recovery plan that reflects this definition and the impact that it may have on business outcomes.   You can create Recovery Time Objective (RTO) and Recovery Point Objective (RPO) based on impact analysis and risk assessments and then choose the appropriate architecture to mitigate against disasters. Ensure that detection of disasters is possible and timely — it is vital to know when objectives are at risk. Ensure you have a plan and validate the plan with testing. Disaster recovery plans that have not been validated risk not being implemented due to a lack of confidence or failure to meet disaster recovery objectives.  

## Disaster recovery

# [Azure Data Factory](#tab/data-factory)

1. Azure docs on general Azure Business Continuity and Disaster Recovery (BCDR) used across the entire platform is available at  [Backup and Disaster Recovery | Microsoft Azure](https://azure.microsoft.com/solutions/backup-and-disaster-recovery/).
1. Azure internally manages the entire disaster recovery mechanism.
1. Data factory only stores data that includes metadata (pipeline, datasets, linked services, integration runtime, and triggers) and monitoring data (pipeline, trigger, and activity runs).
    1. When regions have an outage, we will follow the existing Azure approach for disaster recovery.
    1. In Azure regions where there is a paired region, the data factory backend will fail over to the paired region (With the exception of Southeast Asia and Brazil, where data residency requirements require data to stay in the region). Refer to the [Azure Trust Center](https://www.microsoft.com/trust-center/?rtc=1). 
    1. Refer to this [list of cross-region pairings for replication in Azure](/azure/availability-zones/cross-region-replication-azure#azure-cross-region-replication-pairings-for-all-geographies).
    1. Azure conducts regular BCDR drills.  Data factory participates in these drills.
    1. Refer to the article [Azure Data Factory data redundancy](concepts-data-redundancy.md).

:::image type="content" source="media/business-continuity-disaster-recovery-whitepaper/integration-runtime-setup.png" alt-text="Shows a screenshot of the Integration Runtime Setup region selection page.":::
**The above image shows the integration runtime (IR) region selection page in the IR setup.**

By default, we will recover your production pipelines also. Optionally, some customers have backed up the ARM templates of their production pipelines in secret storage if they need to verify the recovered pipelines later. Backing up ARM template production pipelines in a secret storage is ideal if you need to verify recovered pipelines. 

In the context of the integration runtimes (compute infrastructure) used in data factory and Synapse pipelines, the Azure IR will not fail over automatically. Customers can create a secondary data factory in one of the paired regions. They can restore the contents of their data factory from a Git repository as part of CI/CD.
With the managed IR, we will switch over to managed integration runtime automatically as described above.  Note that managed failover does not apply to self-hosted integration runtime (SHIR) since this infrastructure is customer-managed. Setting up multiple nodes for SHIR for higher availability is available in the article [Create a self-hosted integration runtime](create-self-hosted-integration-runtime.md?tabs=data-factory).

 Linked services will not be fully enabled because of pending private end points in the brand new network of the failover region.  The team is considering alternative options for easing private end point approvals in a recovered region.  But currently you must individually re-approve each private end point in the new region.   


# [Synapse Analytics](#tab/synapse-analytics)

### Synapse Sqlpool and pipeline disaster recovery

Azure Synapse Analytics is a limitless analytics service that brings together data integration, enterprise data warehousing, and big data analytics. Within Synapse Analytics, SQL pools are used to store relational data. It can also used with external tables to query data on Azure Data Lake Storage. See next paragraphs for disaster recovery planning.

#### Regional Disaster

- For reading, a custom solution can be created to restore backups every day in a different region, pause the SQL pool and only run the SQL pool in the different region once the primary region is down.
- In case only external tables are used on a data lake storage, it is also possible to create a SQL pool in a different region and point the SQL pool to the secondary endpoint of the Azure Data Lake storage account in the different region.
- Automatic failover is not supported in Synapse SQL pools. For writing, a custom solution shall be creating in which an application writes data to a storage account/queue in a different region. It can also be decided to pause data ingestion pipelines until the primary region is up again, see next paragraph.
 
#### Customer error

The following measurements can be taken:

- Snapshots go back to 7 days and can be restored once data get corrupted. To prevent data loss, data pipelines shall be run again, see next bullet.
- Synapse SQL pools are often used in data lake context, in which Azure Data Factory or Synapse pipelines are used to ingest data. Data is either ingested directly to SQL pools or to the Azure Data Lake storage account belonging to the Azure Synapse workspace and uses as external table in Synapse SQL pools. It can also be decided to rerun pipelines once primary region is up again. Condition is the source systems keep the data for some period and pipelines can run idempotent.

After SQLpools are recovered, you should focus on Synapse pipelines which are artifacts of workspace. Please review the JSON description of Synapse pipeline. To recover pipelines, please follow next section.  The JSON code below shows how pipelines are associated with a Synapse workspace:

```json
{
"Microsoft.Synapse/workspaces/pipelines": {
    "properties": {
        "activities": {
            {
                "typeProperties": {
                    "waitTimeInSeconds": "-::int",
                    "headers": "*::object"
                }
            }
        }
    }
}
```

---

## User-managed recovery with CI/CD

For regions where availability zones exist, all pipeline services will be zone resilient by default.  The service is zone resilient as long as its region supports availability zones.  For artifacts, you can use Git and CI/CD to recover the service manually to meet your RTO/RPO objectives. This is the recommended approach as Depicted in diagram below.  

:::image type="content" source="media/business-continuity-disaster-recovery-whitepaper/recover-service-manually.png" alt-text="Shows a diagram of how to recover the service manually using CI/CD.":::

If you're using data factory, follow the guidelines for CI/CD in the article [Continuous integration and delivery in Azure Data Factory](continuous-integration-delivery.md).  For Synapse, refer to the [Synapse Pipeline CI/CD](../synapse-analytics/cicd/continuous-integration-delivery.md#azure-synapse-analytics) article to achieve the same. Remember to initialize the Synapse workspace at first following the [Synapse Workspace Source Control](../synapse-analytics/cicd/source-control.md) article. 

### Summary

As described in this document, it is possible to achieve BCDR objectives for data factory and Synapse pipelines. While you can rely on Azure disaster recovery for automated BCDR, you can follow CI/CD based user defined disaster recovery procedures to achieve your RTO/RPO objectives.

### Notes on user-managed recovery

1. Disable triggers in original primary, once it comes back online.
    This can be done by manually, or you can implement automation to periodically check the availability of original primary; disable all triggers on original primary factory immediately after the factory recovers.
1.	Handle duplicate writes
    1.	Sinks support transparent failover: Most ETL pipelines are designed to handle duplicate writes, as backfill/restatement also requires it. Duplicate writes can be handled with records merge or delete/insert all records in the specific time range.
    1.	Sinks that change endpoints after failover: in this case both primary and secondary storage might have duplicated or partial data, manual merge is required.
1.	Check witness and control the pipeline flow ( optional )
    1.	Add global parameter in your data factories to indicate the region, for example region=’EastUS’ in primary, region=’CentralUS’ in secondary factory.
    1.	Create a witness in third region, it can be a REST call or any type of storage. 
        1. The witness returns current primary region, for example EastUS by default
        1. When disaster happens, manually update the witness to return new primary region (CentralUS)
    1. In your pipeline, add a activity to lookup the witness and compare the current primary value to the global parameter.
        1. If matches, this is pipeline runs on primary, do real work
        1. If mismatch, this is secondary, just return
               
If designed well, this approach can avoid conflicts with active-active configuration of multiple data factories. But the downside is that it introduces a dependency of the witness lookup in all your pipelines. Failing to read witness will halt all your pipeline runs.


