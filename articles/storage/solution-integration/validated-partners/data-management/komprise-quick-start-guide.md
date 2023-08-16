---
title: Analyze and migrate your file data to Azure with Komprise Intelligent Data Manager
titleSuffix: Azure Storage
description: Getting started guide to implement Komprise Intelligent Data Manager. Guide shows how to analyze your file infrastructure, and migrate your data to Azure Files, Azure NetApp Files, Azure Blob Storage, or any available ISV NAS solution 
author: dukicn
ms.author: nikoduki
ms.date: 05/20/2021
ms.topic: conceptual
ms.service: azure-storage
ms.subservice: storage-partner-integration
---

# Analyze and migrate to Azure with Komprise

This article helps you integrate the Komprise Intelligent Data Management infrastructure with Azure storage services. It includes considerations and implementation guidance on how to analyze, and migrate your data.

Komprise provides analytics and insights into file, and object data stored in network attached storage systems (NAS), and object stores, both on-premises and in the cloud.  It enables migration of data to Azure storage services like Azure Files, Azure NetApp Files, Azure Blob Storage, or other ISV NAS solution. Learn more on [verified partner solutions for primary and secondary storage](../primary-secondary-storage/partner-overview.md).

Common use cases for Komprise include:

- Analysis of unstructured file and object data to gain insights for data management, movement, positioning, archiving, protection, and confinement,
- Migration of file data to Azure Files, Azure NetApp Files, or ISV NAS solution,
- Policy based tiering and archiving of file data to Azure Blob Storage while retaining transparent access from the original NAS solution and allowing native object access in Azure,
- Copy file data to Azure Blob Storage on configurable schedules while retaining native object access in Azure
- Migration of object data to Azure Blob Storage,
- Tiering and data lifecycle management of objects across Hot, Cool, and Archive tiers of Azure Blob Storage based on last access time

## Reference architecture

The following diagram provides a reference architecture for on-premises to Azure and in-Azure deployments.

:::image type="content" source="./media/komprise-quick-start-guide/komprise-architecture.png" alt-text="Reference architecture describes basic setup for Komprise Intelligent Data Manager":::

The following diagram provides a reference architecture for migrating cloud and on-premises object workloads to Azure Blob Storage.

:::image type="content" source="./media/komprise-quick-start-guide/komprise-architecture-blob.png" alt-text="Reference architecture describes setup for migrating cloud and on-premises object workloads to Azure Blob Storage":::

Komprise is a software solution that is easily deployed in a virtual environment. The solutions consist of:
- **Director** - The administration console for the Komprise Grid. It is used to configure the environment, monitor activities, view reports and graphs, and set policies.
- **Observers** - Manage and analyze shares, summarize reports, communicate with the Director, and handle object and NFS data traffic.
- **Proxies** - Simplify and accelerate SMB/CIFS data flow, easily scale to meet performance requirements of a growing environment.

## Before you begin

Upfront planning will help in migrating the data with less risk.

### Get started with Azure

Microsoft offers a framework to follow to get you started with Azure. The [Cloud Adoption Framework](/azure/architecture/cloud-adoption/) (CAF) is a detailed approach to enterprise digital transformation and comprehensive guide to planning a production grade cloud adoption. The CAF includes a step-by-step [Azure setup guide](/azure/cloud-adoption-framework/ready/azure-setup-guide/) to help you get up and running quickly and securely. You can find an interactive version in the [Azure portal](https://portal.azure.com/?feature.quickstart=true#blade/Microsoft_Azure_Resources/QuickstartCenterBlade). You'll find sample architectures, specific best practices for deploying applications, and free training resources to put you on the path to Azure expertise.

### Considerations for migrations

Several aspects are important when considering migrations of file data to Azure. Before proceeding learn more:

- [Storage migration overview](../../../common/storage-migration-overview.md)
- latest supported features by Komprise Intelligent Data Management in [migration tools comparison matrix](./migration-tools-comparison.md).

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

## Migration planning guide

Komprise is simple to set up and enables running multiple migrations simultaneously in three steps:

1.	Analyze your data to identify files and objects to migrate or archive,
1.	Define policies to migrate, move, or copy unstructured data to Azure Storage,
1.	Activate policies that automatically move your data.

The first step is critical in finding and prioritizing the right data to migrate. Komprise analysis provides:

- Information on access time to identify:
  - Less frequently accessed files that you can cache on-premises or store on fast file service
  - Cold data you can archive to blob storage
- Information on top users, groups, or shares to determine the order of the migration and the most impacted group within the organization to assess business impact
- Number of files, or capacity per file type to determine type of stored files and if there are any possibilities to clean up the content. Cleaning up will reduce the migration effort, and reduce the cost of the target storage. Similar analytics is available for object data.
- Number of files, or capacity per file size to determine the duration of migration. Large number of small files will take longer to migrate than small number of large files. Similar analytics is available for object data.
- Cost of objects by storage tier to determine if cold data is incorrectly placed in expensive tiers, or hot data is incorrectly placed in cheaper tiers with high access costs. Right placing data based on access patterns enables optimizing overall cloud storage costs.

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-analyze-1.png" alt-text="Analysis by file type and access time":::

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-analyze-shares.png" alt-text="Example of share analysis":::

- Custom query capability filter to filter exact set of files and objects for your specific needs

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-analyze-custom.png" alt-text="Analysis for custom query":::

## Deployment guide

Before deploying Komprise, the target service must be deployed. You can learn more here:

- How to create [Azure File Share](../../../files/storage-how-to-create-file-share.md)
- How to create an [SMB volume](../../../../azure-netapp-files/azure-netapp-files-create-volumes-smb.md) or [NFS export](../../../../azure-netapp-files/azure-netapp-files-create-volumes.md) in Azure NetApp Files

The Komprise Grid is deployed in a virtual environment (Hyper-V, VMware, KVM) for speed, scalability, and resilience. Alternatively, you may set up the environment in your Azure subscription using [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management).

1. Open the Azure portal, and search for  **storage accounts**. 

    :::image type="content" source="./media/komprise-quick-start-guide/azure-locate-storage-account.png" alt-text="Shows where you've typed storage in the search box of the Azure portal.":::

    You can also click on the default  **Storage accounts**  icon.

    :::image type="content" source="./media/komprise-quick-start-guide/azure-portal.png" alt-text="Shows adding a storage account in the Azure portal.":::

2. Select  **Create**  to add an account:
   1. Select existing resource group or **Create new**
   2. Provide a unique name for your storage account
   3. Choose the region
   4. Select  **Standard**  or **Premium** performance, depending on your needs. If you select **Premium**, select **File shares** under **Premium account type**.
   5. Choose the **[Redundancy](../../../common/storage-redundancy.md)** that meets your data protection requirements
   
   :::image type="content" source="./media/komprise-quick-start-guide/azure-account-create-1.png" alt-text="Shows storage account settings in the portal.":::

3. Next, we recommend the default settings from the **Advanced** screen. If you are migrating to Azure Files, we recommend enabling **Large file shares** if available.

   :::image type="content" source="./media/komprise-quick-start-guide/azure-account-create-2.png" alt-text="Shows Advanced settings tab in the portal.":::

4. Keep the default networking options for now and move on to  **Data protection**. You can choose to enable soft delete, which allows you to recover an accidentally deleted data within the defined retention period. Soft delete offers protection against accidental or malicious deletion.

   :::image type="content" source="./media/komprise-quick-start-guide/azure-account-create-3.png" alt-text="Shows the Data Protection settings in the portal.":::

5. Add tags for organization if you use tagging and **Create** your account.
 
6. Two quick steps are all that are now required before you can add the account to your Komprise environment. Navigate to the account you created in the Azure portal and select File shares under the File service menu. Add a File share and choose a meaningful name. Then, navigate to the Access keys item under Settings and copy the Storage account name and one of the two access keys. If the keys are not showing, click on the **Show keys**.

   :::image type="content" source="./media/komprise-quick-start-guide/azure-access-key.png" alt-text="Shows access key settings in the portal.":::

7. Navigate to the **Properties** of the Azure File share. Write down the URL address, it will be required to add the Azure connection into the Komprise target file share:

   :::image type="content" source="./media/komprise-quick-start-guide/azure-files-endpoint.png" alt-text="Find Azure files endpoint.":::

8. (_Optional_) You can add extra layers of security to your deployment.
 
   1. Configure role-based access to limit who can make changes to your storage account. For more information, see [Built-in roles for management operations](../../../common/authorization-resource-provider.md#built-in-roles-for-management-operations).
 
   2.  Restrict access to the account to specific network segments with [storage firewall settings](../../../common/storage-network-security.md). Configure firewall settings to prevent access from outside of your corporate network.

       :::image type="content" source="./media/komprise-quick-start-guide/azure-storage-firewall.png" alt-text="Shows storage firewall settings in the portal.":::

   3.  Set a [delete lock](../../../../azure-resource-manager/management/lock-resources.md) on the account to prevent accidental deletion of the storage account.

       :::image type="content" source="./media/komprise-quick-start-guide/azure-resource-lock.png" alt-text="Shows setting a delete lock in the portal.":::

   4.  Configure extra [security best practices](../../../blobs/security-recommendations.md).

### Deployment instructions for managing file data

1.	**Download** the Komprise Observer virtual appliance from the Director, deploy it to your hypervisor and configure it with the network and domain. Director is provided as a cloud service managed by Komprise. Information needed to access Director is sent with the welcome email once you purchase the solution.

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-setup-1.png" alt-text="Download appropriate image for Komprise Observer from Director":::

1. To add the shares to analyze and migrate, you have two options:
   1. **Discover** all the shares in your storage environment by entering:
       - Platform for the source NAS
       - Hostname or IP address
       - Display name
       - Credentials (for SMB shares)

        :::image type="content" source="./media/komprise-quick-start-guide/komprise-setup-2.png" alt-text="Specify NAS system to discover":::

    1. **Specify** a file share by entering:
       - Storage information
       - Protocol
       - Path
       - Display Name
       - Credentials (for SMB shares)
  
        :::image type="content" source="./media/komprise-quick-start-guide/komprise-setup-3.png" alt-text="Specify NAS solutions to discover":::

    This step must be repeated to add other source and destination shares. To add Azure Files as a destination, you need to provide the Azure storage account and file share details:

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-azure-files-1.png" alt-text="Select Azure Files as a target service":::

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-azure-files-2.png" alt-text="Enter details for Azure Files":::

### Deployment instructions for managing object data

Managing object provides different experience. The Director and Observer are provided as a cloud services, managed by Komprise. If you only need to analyze and archive data in Azure Blob Storage, no further deployment is required. If you need to perform migrations into Azure Blob Storage, get the Komprise Observer virtual appliance sent with the welcome email, and deploy it in a Linux virtual machine in your Azure cloud infrastructure. After deploying, follow the steps on the Komprise Director.

1. Navigate to **Data Stores** and **Add New Object Store**. Select **Microsoft Azure** as the provider.

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-add-object-store.png" alt-text="Screenshot that shows adding new object store":::

1. Add shares to analyze and migrate. These steps must be repeated for every source, and target share, or container. There are two options to perform the same action:
    1. **Discover** all the containers by entering:
        - Storage account name
        - Primary access key
        - Display name
    
        :::image type="content" source="./media/komprise-quick-start-guide/komprise-discover-storage-account.png" alt-text="Screenshot that shows how to discover containers in storage account":::

        Required information can be found in **[Azure Portal](https://portal.azure.com/)** by navigating to the **Access keys** item under **Settings** for the storage account. If the keys are not showing, click on the **Show keys**.

    1. **Specify** a container by entering:
        - Container name
        - Storage account name
        - Primary access key
        - Display name

        :::image type="content" source="./media/komprise-quick-start-guide/komprise-add-container.png" alt-text="Screenshot that shows how to add containers in storage account":::

        Container name represents the target container for the migration and needs to be created before migration. Other required information can be found in **[Azure Portal](https://portal.azure.com/)** by navigating to the **Access keys** item under **Settings** for the storage account. If the keys are not showing, click on the **Show keys**.

## Migration guide

Komprise provides live migration, where end users and applications are not disrupted and can continue to access data during the migration. The migration process automates migrating directories, files, and links from a source to a destination. At each step data integrity is checked. All attributes, permissions, and access controls from the source are applied. In an object migration, objects, prefixes, and metadata of each object are migrated.

To configure and run a migration, follow these steps:

1. Log into your Komprise console. Information needed to access the console is sent with the welcome email once you purchase the solution.
1. Navigate to **Migrate** and click on **Add Migration**.

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-new-migrate.png" alt-text="Add new migration job":::

1. Add migration task by selecting proper source and destination share. Provide a migration name. Once configured, click on **Start Migration**. This step is slightly different for file and object data migrations.
   
    1. File migration

       :::image type="content" source="./media/komprise-quick-start-guide/komprise-add-migration.png" alt-text="Specify details for the migration job":::

       File migration provides options to preserve access time and SMB ACLs on the destination. This option depends on the selected source and destination file service and protocol.

    1. Object migration

        :::image type="content" source="./media/komprise-quick-start-guide/komprise-add-object-migration.png" alt-text="Screenshot that shows adding object migration":::

        Object migration provides options to choose the destination Azure storage tier (Hot, Cool, Archive). You may also choose to verify each data transfer using MD5 checksum. Egress costs can occur with MD5 checksums as cloud objects must be retrieved to calculate the MD5 checksum.

2. Once the migration started, you can go to **Migrate** to monitor the progress.

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-monitor-migrations.png" alt-text="Monitor all migration jobs":::

3. Once all changes have been migrated, run one final migration by clicking on **Actions** and selecting **Start final iteration**. Before final migration, we recommend stopping access to source file shares or moving them to read-only mode (for users and applications). This step will make sure no changes happen on the source.

    :::image type="content" source="./media/komprise-quick-start-guide/komprise-final-migration.png" alt-text="Do one last migration before switching over":::

    Once the final migration finishes, transition all users and applications to the destination share. Switch over to the new file service usually requires changing the configuration of DNS servers, DFS servers, or changing the mount points to the new destination. 

4. As a last step, mark the migration completed.

## Support

To open a case with Komprise, sign in to the [Komprise support site](https://komprise.freshdesk.com/)

## Marketplace

Get Komprise listing on [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview).

## Next steps

Various resources are available to learn more:

- [Storage migration overview](../../../common/storage-migration-overview.md)
- Features supported by Komprise Intelligent Data Management in [migration tools comparison matrix](./migration-tools-comparison.md)
- [Komprise compatibility matrix](https://www.komprise.com/partners/microsoft-azure/)
