---
title: Reliability in Microsoft Fabric 
description: Find out about reliability in Microsoft Fabric
author: paulinbar 
ms.author: painbar 
ms.topic: reliability-article
ms.reviewer: anaharris
ms.service: fabric
ms.custom:
  - subject-reliability
  - references_regions
  - build-2023
  - ignite-2023
ms.date: 12/13/2023 
---

# Reliability in Microsoft Fabric

This article describes reliability support in Microsoft Fabric, and both regional resiliency with availability zones and [cross-region recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Fabric makes commercially reasonable efforts to support zone-redundant availability zones, where resources automatically replicate across zones, without any need for you to set up or configure.


### Prerequisites

- Fabric currently provides partial availability-zone support in a [limited number of regions](#supported-regions). This partial availability-zone support covers experiences (and/or certain functionalities within an experience).
- Experiences such as Data Factory (pipelines), Data Engineering, Data Science, and Event Streams don't support availability zones. 
- Zone availability may or may not be available for Fabric experiences or features/functionalities that are in preview. 
- On-premises gateways and large semantic models in Power BI don't support availability zones.  


### Supported regions

Fabric makes commercially reasonable efforts to provide availability zone support in various regions as follows:

| **Americas**         | **Power BI**                                                          | **Datamarts**                                                         | **Data Warehouses**                                                   | **Real-Time Analytics**                                               |
|:---------------------|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|
| Brazil South         | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       | :::image type="icon" source="media/yes-icon.svg" border="false"::: | :::image type="icon" source="media/yes-icon.svg" border="false"::: |
| Canada Central       | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       |                                                                       | :::image type="icon" source="media/yes-icon.svg" border="false"::: |
| Central US           | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       |                                                                       |                                                                       |
| East US              | :::image type="icon" source="media/yes-icon.svg" border="false"::: | :::image type="icon" source="media/yes-icon.svg" border="false"::: | :::image type="icon" source="media/yes-icon.svg" border="false"::: | :::image type="icon" source="media/yes-icon.svg" border="false"::: |
| East US 2            | :::image type="icon" source="media/yes-icon.svg" border="false"::: | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       | :::image type="icon" source="media/yes-icon.svg" border="false"::: |
| South Central US     | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       |                                                                       |                                                                       |
| West US 2            | :::image type="icon" source="media/yes-icon.svg" border="false"::: | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       |                                                                       |
| West US 3            | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       |                                                                       | :::image type="icon" source="media/yes-icon.svg" border="false"::: |
| **Europe**           | **Power BI**                                                          | **Datamarts**                                                         | **Data Warehouses**                                                   | **Real-Time Analytics**                                               |
| France Central       | :::image type="icon" source="media/yes-icon.svg" border="false"::: | :::image type="icon" source="media/yes-icon.svg" border="false"::: | :::image type="icon" source="media/yes-icon.svg" border="false"::: | :::image type="icon" source="media/yes-icon.svg" border="false"::: |
| Germany West Central | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       |                                                                       |                                                                       |
| North Europe         | :::image type="icon" source="media/yes-icon.svg" border="false"::: | :::image type="icon" source="media/yes-icon.svg" border="false"::: | :::image type="icon" source="media/yes-icon.svg" border="false"::: | :::image type="icon" source="media/yes-icon.svg" border="false"::: |
| UK South             | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       | :::image type="icon" source="media/yes-icon.svg" border="false"::: | :::image type="icon" source="media/yes-icon.svg" border="false"::: |
| West Europe          | :::image type="icon" source="media/yes-icon.svg" border="false"::: | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       |                                                                       |
| Norway East          | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       |                                                                       | :::image type="icon" source="media/yes-icon.svg" border="false"::: |
| **Middle East**      | **Power BI**                                                          | **Datamarts**                                                         | **Data Warehouses**                                                   | **Real-Time Analytics**                                               |
| Qatar Central        | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       |                                                                       |                                                                       |
| **Africa**           | **Power BI**                                                          | **Datamarts**                                                         | **Data Warehouses**                                                   | **Real-Time Analytics**                                               |
| South Africa North   | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       |                                                                       | :::image type="icon" source="media/yes-icon.svg" border="false"::: |
| **Asia Pacific**     | **Power BI**                                                          | **Datamarts**                                                         | **Data Warehouses**                                                   | **Real-Time Analytics**                                               |
| Australia East       | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       |
| Japan East           | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       |                                                                       |                                                                       |
| Southeast Asia       | :::image type="icon" source="media/yes-icon.svg" border="false"::: |                                                                       |                                                                       |                                                                       |

### Zone down experience
During a zone-wide outage, no action is required during zone recovery. Fabric capabilities in regions listed in [supported regions](#supported-regions) self-heal and rebalance automatically to take advantage of the healthy zone.


>[!IMPORTANT]
> While Microsoft strives to provide uniform and consistent availability zone support, in some cases of availability-zone failure, Fabric capacities located in Azure regions with higher customer demand fluctuations might experience higher than normal latency.

## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

This section describes a disaster recovery plan for Fabric that's designed to help your organization keep its data safe and accessible when an unplanned regional disaster occurs. The plan covers the following topics:

* **Cross-region replication**: Fabric offers cross-region replication for data stored in OneLake. You can opt in or out of this feature based on your requirements.

* **Data access after disaster**:  In a regional disaster scenario, Fabric guarantees data access, with certain limitations. While the creation or modification of new items is restricted after failover, the primary focus remains on ensuring that existing data remains accessible and intact.

* **Guidance for recovery**: Fabric provides a structured set of instructions to guide you through the recovery process. The structured guidance makes it easier for you to transition back to regular operations.

Power BI, now a part of the Fabric, has a solid disaster recovery system in place and offers the following features:

* **BCDR as default**: Power BI automatically includes disaster recovery capabilities in its default offering. You don't need to opt in or activate this feature separately. 

* **Cross-region replication**: Power BI uses [Azure storage geo-redundant replication](/azure/storage/common/storage-redundancy-grs/) and [Azure SQL geo-redundant replication](/azure/sql-database/sql-database-active-geo-replication/) to guarantee that backup instances exist in other regions and can be used. This means that data is duplicated across different regions, enhancing its availability, and reducing the risks associated with regional outages.

* **Continued services and access after disaster**: Even during disruptive events, Power BI items remain accessible in read-only mode. Items include semantic models, reports, and dashboards, ensuring that businesses can continue their analysis and decision-making processes without significant hindrance.

For more information, see the [Power BI high availability, failover, and disaster recovery FAQ](/power-bi/enterprise/service-admin-failover/)


>[!IMPORTANT]
> For customers whose home regions don't have an Azure pair region and are affected by a disaster, the ability to utilize Fabric capacities may be compromised—even if the data within those capacities is replicated. This limitation is tied to the home region’s infrastructure, essential for the capacities' operation. 

### Home region and capacity functionality

For effective disaster recovery planning, it's critical that you understand the relationship between your home region and capacity locations. Understanding home region and capacity locations helps you make strategic selections of capacity regions, as well as the corresponding replication and recovery processes.

The **home region** for your organization's tenancy and data storage is set to the billing address location of the first user that signs up. For further details on tenancy setup, go to [Power BI implementation planning: Tenant setup](/power-bi/guidance/powerbi-implementation-planning-tenant-setup#home-region).  When you create new capacities, your data storage is set to the home region by default. If you wish to change your data storage region to another region, you'll need to [enable Multi-Geo, a Fabric Premium feature](/fabric/admin/service-admin-premium-multi-geo#enable-and-configure).

  >[!IMPORTANT]
  > Choosing a different region for your capacity doesn't entirely relocate all of your data to that region. Some data elements still remain stored in the home region.  To see which data remains in the home region and which data is stored in the Multi-Geo enabled region, see [Configure Multi-Geo support for Fabric Premium](/fabric/admin/service-admin-premium-multi-geo). 
  >
  >In the case of a home region that doesn't have a paired region, capacities in any Multi-Geo enabled region may face operational issues if the home region encounters a disaster, as the core service functionality is tethered to the home region.
  >
  >If you select a Multi-Geo enabled region within the EU, it's guaranteed that your data is stored within the EU data boundary. 


To learn how to identify your home region, see [Find your Fabric home region](/fabric/admin/find-fabric-home-region). 

### Disaster recovery capacity setting

Fabric provides a disaster recovery switch on the capacity settings page. It's available where Azure [regional pairings](./cross-region-replication-azure.md#azure-paired-regions) align with Fabric's service presence. Here are the specifics of this switch:

* **Role access**: Only users with the [capacity admin](/power-bi/enterprise/service-admin-premium-manage#setting-up-a-new-capacity-power-bi-premium/) role or higher can use this switch.

* **Granularity**: The granularity of the switch is the capacity level. It's available for both Premium and Fabric capacities.

* **Data scope**: The disaster recovery toggle specifically addresses OneLake data, which includes Lakehouse and Warehouse data. **The switch does not influence your data stored outside OneLake.**

* **BCDR continuity for Power BI**: While disaster recovery for OneLake data can be toggled on and off, BCDR for Power BI is always supported, regardless of whether the switch is on or off.

* **Frequency**: Once you change the disaster recovery capacity setting, you must wait 30 days before being able to alter it again. The wait period is set in place to maintain stability and prevent constant toggling, 

:::image type="content" source="/fabric/security/media/disaster-recovery-guide/disaster-recovery-capacity-setting.png" alt-text="Screenshot of the disaster recovery tenant setting.":::

> [!NOTE]
> After turning on the disaster recovery capacity setting, it can take up to 72 hours for the data to start replicating.

### Data replication

When you turn on the disaster recovery capacity setting, cross-region replication is enabled as a disaster recovery capability for OneLake data. The Fabric platform aligns with Azure regions to provision the geo-redundancy pairs. However, some regions don't have an Azure pair region, or the pair region doesn't support Fabric. For these regions, data replication isn't available. For more information, see [Regions with availability zones and no region pair](/azure/reliability/cross-region-replication-azure#regions-with-availability-zones-and-no-region-pair/) and [Fabric region availability](/fabric/admin/region-availability).

> [!NOTE]
> While Fabric offers a data replication solution in OneLake to support disaster recovery, there are notable limitations. For instance, the data of KQL databases and query sets is stored externally to OneLake, which means that a separate disaster recovery approach is needed. Refer to the rest of this document for details of the disaster recovery approach for each Fabric item. 

### Billing

The disaster recovery feature in Fabric enables geo-replication of your data for enhanced security and reliability. This feature consumes more storage and transactions, which are billed as BCDR Storage and BCDR Operations respectively. You can monitor and manage these costs in the [Microsoft Fabric Capacity Metrics app](/fabric/enterprise/metrics-app), where they appear as separate line items.

For an exhaustive breakdown of all associated disaster recovery costs to help you plan and budget accordingly, see [OneLake compute and storage consumption](/fabric/onelake/onelake-consumption). 

## Set up disaster recovery 

While Fabric provides disaster recovery features to support data resiliency, you **must** follow certain manual steps to restore service during disruptions. This section details the actions you should take to prepare for potential disruptions.

#### Phase 1: Prepare

* **Activate the disaster recovery capacity settings**: Regularly review and set the [disaster recovery capacity settings](#disaster-recovery-capacity-setting) to make sure they meet your protection and performance needs.

* **Create data backups**: Copy critical data stored outside of OneLake to another region in a way that aligns to your disaster recovery plan.

### Phase 2: Disaster failover

When a major disaster renders the primary region unrecoverable, Microsoft Fabric initiates a regional failover. Access to the Fabric portal is unavailable until the failover is complete and a notification is posted on the [Microsoft Fabric support page](https://support.fabric.microsoft.com/support/).

The time it takes for failover to complete can vary, although it typically takes less than one hour. Once failover is complete, here's what you can expect:

* **Fabric portal**: You can access the portal, and read operations such as browsing existing workspaces and items continue to work. All write operations, such as creating or modifying a workspace, are paused.

* **Power BI**: You can perform read operations, such as displaying dashboards and reports. Refreshes, report publish operations, dashboard and report modifications, and other operations that require changes to metadata aren't supported.

* **Lakehouse/Warehouse**: You can't open these items, but files can be accessed via OneLake APIs or tools.

* **Spark Job Definition**: You can't open Spark job definitions, but code files can be accessed via OneLake APIs or tools. Any metadata or configuration will be saved after failover.
  
* **Notebook**: You can't open notebooks, and code content won't be saved after the disaster.

* **ML Model/Experiment**: You can't open ML models or experiments. Code content and metadata such as run metrics and configurations won't be saved after the disaster.

* **Dataflow Gen2/Pipeline/Eventstream**: You can't open these items, but you can use supported disaster recovery destinations (lakehouses or warehouses) to protect data.

* **KQL Database/Queryset**: You won't be able to access KQL databases and query sets after failover. More prerequisite steps are required to protect the data in KQL databases and query sets.

In a disaster scenario, the Fabric portal and Power BI are in read-only mode, and other Fabric items are unavailable, you can access their data stored in OneLake using APIs or third-party tools. Both portal and Power BI retain the ability to perform read-write operations on that data. This ability ensures that critical data remains accessible and modifiable, and mitigates potential disruption of your business operations.

OneLake data remains accessible through multiple channels:

* OneLake ADLS Gen2 API: See [Connecting to Microsoft OneLake](/fabric/onelake/onelake-access-api)

* Examples of tools that can connect to OneLake data:
    
    * Azure Storage Explorer: See [Integrate OneLake with Azure Storage Explorer](/fabric/onelake/onelake-azure-storage-explorer)

    * OneLake File Explorer: See [Use OneLake file explorer to access Fabric data](/fabric/onelake/onelake-file-explorer)

#### Phase 3: Recovery plan

While Fabric ensures that data remains accessible after a disaster, you can also act to fully restore their services to the state before the incident. This section provides a step-by-step guide to help you through the recovery process.

### Recovery steps

1. Create a new Fabric capacity in any region after a disaster. Given the high demand during such events, we recommend selecting a region outside your primary geo to increase likelihood of compute service availability. For information about creating a capacity, see [Buy a Microsoft Fabric subscription](/fabric/enterprise/buy-subscription).

1. Create workspaces in the newly created capacity. If necessary, use the same names as the old workspaces.

1. Create items with the same names as the ones you want to recover. This step is important if you use the custom script to recover lakehouses and warehouses.

1. Restore the items. For each item, follow the relevant section in the [Experience-specific disaster recovery guidance](/fabric/security/experience-specific-guidance) to restore the item.


## Next steps

- [Experience-specific disaster recovery guidance](/fabric/security/experience-specific-guidance)
- [Reliability in Azure](./overview.md)
