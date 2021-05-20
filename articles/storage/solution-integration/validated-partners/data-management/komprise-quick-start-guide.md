---
title: Migrate your file data to Azure with Komprise Intelligent Data Manager
titleSuffix: Azure Storage
description: Provides getting started guide to implement Komprise Intelligent Data Manager to analyze your file infrastructure, and migrate your data to Azure Files, Azure NetApp Files, Azure Blob Storage or any available ISV NAS solution 
author: dukicn
ms.author: nikoduki
ms.date: 05/25/2021
ms.topic: conceptual
ms.service: storage
ms.subservice: partner
---

# Analyze and migrate data to Azure with Komprise Intelligent Data Manager

This article helps you integrate the Komprise Intelligent Data Manager infrastructure with Azure storage services. It includes prerequisites, considerations, implementation, and operational guidance on how to analyze and migrate your data.

File migrations are risky, time-consuming, and labor intensive. With Komprise, customers can quickly identify and move the right data to their Azure Storage services.

Komprise Intelligent Data Manager provides valuable data analytics and insights into NFS and SMB storage systems along with the multiple ways to actively migrate data in to multiple Azure storage products like Azure Files, Azure NetApp Files, Azure Blob Storage or ISV NAS solution. Learn more on [verified partner solutions for primary and secondary storage](/azure/storage/solution-integration/validated-partners/primary-secondary-storage/partner-overview).

Within 15 minutes of deploying Komprise Intelligent Data Manager, customers can: 

- Understand data growth and usage across all their storage solutions,
- Find the right data across multi-vendor NAS solutions to migrate to Azure,
- Set policies and processes to migrate data as needed.

Unlike custom data migration solutions that are costly, complex, invasive, and hard to scale, Komprise is simple to deploy, operate and scale.

## Potential use cases

Komprise Intelligent Data Manager will help in many different use cases, like:

- Analysis of on-premises unstructured data to gain insights for data management, movement, positioning, archiving, protection and confinement.
- Migration of on-premises unstructured data to Azure Files, Azure NetApp Files or ISV NAS solution,
- Copy, or archive, on-premises unstructured data to Azure Blob Storage with native access
- Migration of object storage solutions to Azure Blob Storage

## Reference architecture

The following diagram provides a reference architecture for on-premises to Azure and in-Azure deployments.

:::image type="content" source="./media/komprise-quick-start-guide/komprise-architecture.png" alt-text="Reference architecture describes basic setup for Komprise Intelligent Data Manager":::

Komprise Intelligent Data Manager is an all-software solution that is easily deployed in a virtual environment, or Azure Virtual Machines, and can be installed within 15 to 30 minutes. The solutions consist of the following:
- **Director** - The administration console for the Komprise Grid. It is used to configure the environment, monitor activities, view reports and graphs, and set policies.
- **Observers** - Manage and analyze shares, summarize reports, communicates with the Director and handle NFS data traffic.
- **Proxies** - Simplify and accelerate SMB/CIFS data flow, easily scale to meet performance requirements of a growing environment.

### Data Flow

Running a migration with the Komprise system is simple and it is easy to setup multiple migrations for different shares simultaneously:

1.	Analyze data to determine what to migrate or archive,
1.	Define policies to migrate, move and/or copy unstructured data to Azure Storage,
1.	Activate policies to migrate, move or copy data to Azure File, Azure NetApp Files or Azure Blob Storage

## Before you begin

A little upfront planning will help you use Azure as an offsite backup target and recovery site.

### Get started with Azure

Microsoft offers a framework to follow to get you started with Azure. The [Cloud Adoption Framework](/azure/architecture/cloud-adoption/) (CAF) is a detailed approach to enterprise digital transformation and comprehensive guide to planning a production grade cloud adoption. The CAF includes a step-by-step [Azure setup guide](/azure/cloud-adoption-framework/ready/azure-setup-guide/) to help you get up and running quickly and securely. You can find an interactive version in the [Azure portal](https://portal.azure.com/?feature.quickstart=true#blade/Microsoft_Azure_Resources/QuickstartCenterBlade). You'll find sample architectures, specific best practices for deploying applications, and free training resources to put you on the path to Azure expertise.

### Considerations for migrations

Several aspects are important when considering migrations of file data to Azure. Before proceeding learn more:

- [Storage migration overview](/azure/storage/common/storage-migration-overview)
- latest supported features by Komprise Intelligent Data Management in [migration tools comparison matrix](/azure/storage/solution-integration/validated-partners/data-management/migration-tools-comparison).

Remember, you'll require enough network capacity to support migrations without impacting production applications. This section outlines the tools and techniques that are available to assess your network needs.

#### Determine unutilized internet bandwidth

It's important to know how much typically unutilized bandwidth (or *headroom*) you have available on a day-to-day basis. To help you assess whether you can meet your goals for:

- initial time for migrations when you're not using Azure Data Box for offline method
- time required to do incremental resync before final switch-over to the target file service

Use the following methods to identify the bandwidth headroom to Azure that is free to consume.

- If you're an existing Azure ExpressRoute customer, view your [circuit usage](../../../../expressroute/expressroute-monitoring-metrics-alerts.md#circuits-metrics) in the Azure portal.
- Contact your ISP and request reports to show your existing daily and monthly utilization.
- There are several tools that can measure utilization by monitoring your network traffic at the router/switch level:
  - [SolarWinds Bandwidth Analyzer Pack](https://www.solarwinds.com/network-bandwidth-analyzer-pack?CMP=ORG-BLG-DNS)
  - [Paessler PRTG](https://www.paessler.com/bandwidth_monitoring)
  - [Cisco Network Assistant](https://www.cisco.com/c/en/us/products/cloud-systems-management/network-assistant/index.html)
  - [WhatsUp Gold](https://www.whatsupgold.com/network-traffic-monitoring)

## Deployment guide

Before deploying Komprise Intelligent Data Manager, target service has to be deployed. This example is using Azure NetApp Files, but any supported Azure Storage service or ISV NAS solution can be used. You can learn more here:

- How to create [Azure File Share](/azure/storage/files/storage-how-to-create-file-share)
- How to create an [SMB volume](/azure/azure-netapp-files/azure-netapp-files-create-volumes-smb) or [NFS export](/azure/azure-netapp-files/azure-netapp-files-create-volumes) in Azure NetApp Files

The Komprise Grid is deployed in a virtual environment (Hyper-V, VMWare, KVM) for speed, scalability and resilience. If setting up the environment in Azure, deployment using [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management) is recommended.

Setting up Komprise solution is simple:

1.	The **Director** is provided as a cloud service, setup and managed by Komprise. Information needed to access Director is sent with the welcome email once you purchase the solution.
1.	**Download** the Komprise Observer virtual appliance from the Director, deploy it to your hypervisor and configure it with the network and domain.

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-setup-1.png" alt-text="Download appropriate image for Komprise Observer from Director":::

1. To determine the shares to analyze and migrate, two options are possible:
   1. **Discover** all the shares by entering:
       - Platform for the source NAS
       - Hostname or IP address
       - (_Optional_) Display name

        :::image type="content" source="./media/komprise-quick-start-guide/komprise-setup-2.png" alt-text="Specify NAS system to discover":::

    1. **Specify** the file share by adding:
       - Protocol
       - Path
       - Display Name
       - Username / Password for the user with access to the shares
  
        :::image type="content" source="./media/komprise-quick-start-guide/komprise-setup-3.png" alt-text="Specify shares to discover":::

1. Select shares to migrate and **Proceed with selected**

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-setup-4.png" alt-text="Specify shares to analyze":::

1. Analyze shares and determine data migration plan. Here is an example of analysis.

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-analyze-shares.png" alt-text="Specify shares to analyze":::

    Information of the analysis is very useful and can help with the migration significantly. For example:
    - information on top users / groups / shares can determine the order of the migration as well as the most impacted group within the organization to assess business impact migration will have
    - number of files / capacity per file type can determine type of stored files and if there are any possibilities to clean up the content, reduce the migration effort and reduce the cost of the target storage
    - number of files / capacity per file size can determine the duration of migration. Big number of small files will take longer to migrate then small number of big files even though it will consume the same capacity

## Migration guide

Komprise Intelligent Data Manager provides live migration, where end users and applications are not disrupted and can continue to access data during the migration. The migration process automates migrating directories, files, and links from a source to a destination. At each step data integrity is checked, all attributes, permissions, and access controls from the source are applied.
To configure and run a migration, follow these steps:

1. Log into your Komprise Intelligent Data Manager console. Information needed to access is sent with the welcome email once you purchase the solution.
1. Navigate to **Migrate** and click on **Add Migration**.

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-new-migrate.png" alt-text="Add new migration job":::

1. Add migration task by selecting desired source and destination share. Provide a migration name. Once configured, click on **Start Migration**. You have the option to define if you want to preserve access time and SMB ACLs on the destination (this option depends on the selected source and destination file service and protocol).
   
   :::image type="content" source="./media/komprise-quick-start-guide/komprise-add-migration.png" alt-text="Specify details for the migration job":::

1. Once the migration started, you can use **Migrations** to monitor the progress.

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-monitor-migrations.png" alt-text="Monitor all migration jobs":::

1. Once all changes have been migrated, perform one final migration by clicking on **Actions** and selecting **Start final iteration**. Before final migration, we recommend either stopping access to source file shares or moving them to read-only mode to make sure no changes happen that will not get migrated.

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-final-migration.png" alt-text="Perform one last migration before switching over":::

    Once the final migration job finishes, transition all users and applications to the destination share. This usually requires changing the configuration of DNS servers, DFS servers or changing the mount points to the new destination. 

1. As a last step, mark the migration completed.

## Pricing

Komprise Intelligent Data Manager is suited for various customers data and implements its hybrid Software as a Service (SaaS) system. SaaS is a method of software delivery and licensing in which software is accessed online via a subscription.
Visit Komprise listing on [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview).

## Next steps

Various resources are available to learn more:

- [Storage migration overview](/azure/storage/common/storage-migration-overview)
- Features supported by Komprise Intelligent Data Management in [migration tools comparison matrix](/azure/storage/solution-integration/validated-partners/data-management/migration-tools-comparison)
- [Komprise compatibility matrix](https://www.komprise.com/partners/microsoft-azure/)


