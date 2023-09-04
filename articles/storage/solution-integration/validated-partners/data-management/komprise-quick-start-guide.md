---
title: Analyze and migrate your file data to Azure with Komprise Intelligent Data Manager
titleSuffix: Azure Storage
description: Getting started guide to implement Komprise Intelligent Data Manager. This guide shows how to analyze your file infrastructure, and migrates your data to Azure Files, Azure NetApp Files, Azure Blob Storage, or any available ISV NAS solution 
author: timkresler
ms.author: timkresler
ms.date: 06/01/2023
ms.service: azure-storage
ms.topic: quickstart
---

# Quickstart analyze and migrate to Azure with Komprise

This article describes using Komprise Intelligent Data Management to identify and place the right data in the right Azure Storage Service.

Moving data can be intimidating.  There are often numerous challenges, beginning with identifying what to move, matching data value to proper storage class, then moving it promptly all while minimizing end-user impacts.

Komprise makes it easy to move your data to Azure storage services like Azure Files, Azure NetApp Files, Azure Blob Storage or other ISV NAS solutions. 

Learn more about other ISV NAS in the [verified partner solutions article](/azure/storage/solution-integration/validated-partners/primary-secondary-storage/partner-overview)

This article reviews where to get started, considerations and recommendations when moving data to Azure. Use the following links to connect to what is important.
- [Know first, move smarter analyze, tier, move what matters](#know-first-move-smarter-analyze-tier-move-what-matters)
- [Assessing network and storage performance](#assessing-network-and-storage-performance)
- [Intelligent data management architecture](#intelligent-data-management-architecture)
- [Getting started with Komprise](#getting-started-with-komprise) 
- [Getting started with Azure](#getting-started-with-azure)
- [Migration guide](#migration-guide)
- [Deployment instructions for migrating object data](#deployment-instructions-for-migrating-object-data)
- [Migration API](#migration-api)
- [Next steps](#next-steps)

## Where to start

Visit [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.azure_data_migration_program?tab=PlansAndPrice) to learn more about Komprise and Azure together. Learn how you can get an introduction, reach out to ask questions, arrange to meet your local Komprise field team or sign up for a trial.

[Visit Komprise directly](https://www.komprise.com/azure-migration) for more information about our solution, including white papers and reference architectures!

## Know first, move smarter (analyze, tier, move what matters)

Komprise provides quick insights into your unstructured data across all storage platforms with Plan Analysis and Deep Analytics capabilities. Plan Analysis immediately gives summary results with usage graphs and the Analysis Activities page surfaces important file system issues discovered. Deep Analytics allows customers to dig deeper in to understanding their data with custom querying capabilities and graphs to find select data sets, orphaned files and more. 

Understanding your data is the first step in selecting the appropriate Azure storage service. It's important to know the type of data, amount, file count, owners, and other information to help determine if the data should be in Azure Files or Azure NetApp Files.  This information can also help you understand if the data should be migrated or tiered to Azure Blob for long-term storage and significant cost savings.

With a quick install of a local Komprise data Observer, in 30 minutes or less you can see:

- Immediate results on capacity, file count and temperature with Komprise heat map. The data can be filtered to show results for all shares, groups or individual shares.
- Komprise includes a cost comparison tool with the ability to edit cost models of current on-premises storage and Azure Storage Solutions costs to determine the best savings and return on investment
- Usage graphs provide quick summary/comparisons of file types, file sizes, file counts, top owners, groups, shares and directories. Use this information to determine the order of the migration and assess the business impact of migrating data.

    :::image type="content" source="./media/komprise-quick-start-guide-v2/sample-analysis-charts.png" alt-text="Analysis by file type and storage consumed" lightbox="./media/komprise-quick-start-guide-v2/sample-analysis-charts.png":::

- Look for opportunities to clean up expired data, which reduces the migration effort and the cost of the destination storage.
- Identify cold data, not accessed in six months or more, that could be cost-effectively tiered or moved to Azure Blob storage.
- Analysis Activity page helps identify potential issues upfront, before moving data. The issues you don’t want to encounter after starting to move data include:
    - Files and/or Directories, with restricted access or resolution issues
    - Date set too large for destination storage service in file count or capacity
    - Data sets with an exceedingly large number of tiny files or with a large number of empty directories
    - Slow-performing shares
    - Lack of destination support for sparce files or symbolic links

Komprise knows it can be challenging to find just the right data across billions of files. Komprise Deep Analytics builds a Global File Index of all your file’s metadata, giving a unified way to search, tag and create select data sets across storage silos. You can identify orphan data, data by name, location, owner, date, application type or extension. Administrators can use these queries and tagged data sets to move, copy, confine, or feed your data pipelines. They can also set data workflow policies.  This allows business to use other Azure cloud data services like personal data identification, running cloud data analytics, and culling and feeding edge data to cloud data lakes.  

Learn more  at [Komprise Deep Analytics](https://www.komprise.com/use-cases/deep-analytics/)

:::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-data-analysis.png" alt-text="Screenshot of Data Analysis Graphs" lightbox="./media/komprise-quick-start-guide-v2/screenshot-data-analysis.png":::

Use all this information when selecting the appropriate Azure storage service. Komprise helps identify key factors like shares, protocol, logical size, file count, data type and performance type. 

- Azure Files
    - [Azure Files Documentation Site](/azure/storage/files/)
    - [Planning for an Azure Files deployment](/azure/storage/files/storage-files-planning)
- Azure Block Blob
    - [Azure Blob Documentation Site](/azure/storage/blobs/)
    - [Access Tiers for Azure Blob](/azure/storage/blobs/access-tiers-overview?source=recommendations)
- Azure Storage Accounts
    - [Azure Storage Account Overview](/azure/storage/common/storage-account-overview?toc=/azure/storage/blobs/toc.json)
    - [Create a Storage Account](/azure/storage/common/storage-account-create)
- Azure NetApp Files
    - [Azure NetApp Files Documentation Site](/azure/azure-netapp-files/)
    - [Service Levels for Azure NetApp Files](/azure/azure-netapp-files/azure-netapp-files-service-levels)

## Assessing network and storage performance

Migrations move only as fast as the infrastructure allows. It’s vital to know the combined performance abilities of the network and storage systems together. Measuring networks and storage performance individually may not reveal hidden limitations in port configurations, routing, file system overloading and more.  

Komprise assesses the network and storage performance, combined, to identify any connectivity issues between your datacenter and Azure storage.
   
The Komprise Assessment of Customer Environment (ACE) is easy to deploy and run. The tool simulates a series of data movement scenarios between on-premises source NAS shares and destination Azure NAS storage services like Azure Files and Azure NetApp Files. It performs a set of reading, writing and checksum operations collecting overall performance numbers. The results can highlight potential performance losses to investigate. This list details some tools and services to isolate issues.

- [SolarWinds Bandwidth Analyzer Pack](https://www.solarwinds.com/network-bandwidth-analyzer-pack?CMP=ORG-BLG-DNS)
- [Paessler PRTG](https://www.paessler.com/bandwidth_monitoring)
- [Cisco Network Assistant](https://www.cisco.com/c/en/us/products/cloud-systems-management/network-assistant/index.html)
- [WhatsUp Gold](https://www.whatsupgold.com/network-traffic-monitoring)

If you're using a public network connection, consider changing to a private VPN or contracting with an Azure Express Route service provider. Making this change can improve security, performance, and providing greater opportunity to identify and resolve any connectivity issues.

To learn more about Express Routes:
- [What is Azure ExpressRoute?](/azure/expressroute/expressroute-introduction)
- [ExpressRoute connectivity models](/azure/expressroute/expressroute-connectivity-models)
- [Extend an on-premises network using ExpressRoute](/azure/architecture/reference-architectures/hybrid-networking/expressroute)

Other performance items to investigate with secure networks: 
- Existing Azure ExpressRoute customers, review [circuit usage](/azure/expressroute/expressroute-monitoring-metrics-alerts#circuits-metrics) in the Azure portal
- Work with your ISP and request reports showing existing daily and monthly utilization

## Intelligent data management architecture

Komprise provides a highly scalable infrastructure to meet every need. Begin assessing your environment with one data Observer then rapidly scale up and out to move terabytes to petabytes of data with more data movers.
Example Komprise architecture overview

:::image type="content" source="./media/komprise-quick-start-guide-v2/architecture-diagram.png" alt-text="Sample architecture diagram" lightbox="./media/komprise-quick-start-guide-v2/architecture-diagram.png":::

Komprise software is easy to set up in virtual environments for complete resource flexibility. For optimum performance, flexibility and cost control, Komprise data managers (Observers) and data movers (Proxies) can be deployed on-premises or in the cloud to fit your unique requirements.
- Director - The administration console for the Komprise Grid. It's used to configure the environment, monitor activities, view reports and graphs and set policies.
- Observers –Komprise data managers analyze storage systems, summarize reports, communicate with the Director, manage migrations and handles data movement.
- Proxies –These scalable data movers simplify and accelerate SMB/CIFS data flow. Proxy data movers can easily scale to meet the performance requirements of a growing environment or tight timeline.


## Getting started with Komprise
1. Contact Komprise, and meet the local team who will set up your own Komprise Director console and assist with a preinstallation call and installation. With preparation, installation should be ~30 minutes from power up to see the first analysis results. 
    Sign up at [https://www.komprise.com/azure-migration](https://www.komprise.com/azure-migration)
2. After logging in with the Director, the wizard Install page will provide links to Download the Komprise Observer virtual appliance. Power up the Observer VM and configure it with static IP, general network and domain information. The last step in the setup script is to sign-in to the director to establish communication. 

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-komprise-download-page.png" alt-text="Screenshot of the Komprise download page" lightbox="./media/komprise-quick-start-guide-v2/screenshot-komprise-download-page.png":::

3.  Add shares for analysis on the Specify Shares page. Use Discover shares to identify a NAS system and automatically import all share information.
    - Enter File System Information:
        - A platform for the source NAS
        - Hostname or IP address
        - Display Name
        - Credentials (for SMB shares)

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-enter-credentials.png" alt-text="Screenshot of the dialog box to enter credentials" lightbox="./media/komprise-quick-start-guide-v2/screenshot-enter-credentials.png":::

    - Repeat these steps to add other source and destination systems. From Menu choose Shares > Sources > Add File Server
    - Once a File Server is added, drill down to the share level and Enable share to start an analysis. See the Plan page for analysis results

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-plan-page.png" alt-text="Screenshot of the Komprise Plan page" lightbox="./media/komprise-quick-start-guide-v2/screenshot-plan-page.png":::

    - Pause to Analyze the newly added shares reviewing the Plan page, Usage graphs and Analysis Activities results to uncover any issues to address, size and select appropriate Azure Storage Services. See next section, Getting Started with Azure, to create the destination Azure storage services.
    - Use the Komprise ACE tool to identify and resolve any infrastructure network and storage performance issues before engaging Komprise migration engines. Once everything looks good continue to the next step with adding Azure Storage Services as destination sources for Komprise Migration.
    - Add Azure Files as a migration destination and configure it on the Sources Tab, not the Targets tab. Target systems are for Komprise Plan operations like seamless tiering with Komprise Transparent Movement Technology™ (TMT) and Deep Analytics Actions. 

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-add-server-analysis.png" alt-text="Screenshot of the Add Server to Sources page" lightbox="./media/komprise-quick-start-guide-v2/screenshot-add-server-analysis.png":::

    Example of adding Azure Files as a migration destination on the Sources tab:

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-add-server-destination.png" alt-text="Screenshot of the Add Destination to Sources page" lightbox="./media/komprise-quick-start-guide-v2/screenshot-add-server-destination.png":::

## Getting started with Azure
Microsoft offers a framework to get you started with Azure. The [Cloud Adoption Framework](/azure/architecture/cloud-adoption/) (CAF) is a detailed approach to enterprise digital transformation and a comprehensive guide to planning a production-grade cloud adoption. The CAF includes a step-by-step [Azure setup guide](/azure/cloud-adoption-framework/ready/azure-setup-guide/) to help you get up and run quickly and securely. You can find an interactive version in the [Azure portal](https://portal.azure.com/?feature.quickstart=true#blade/Microsoft_Azure_Resources/QuickstartCenterBlade). You'll find sample architectures, specific best practices for deploying applications and free training resources to put you on the path to Azure expertise.

Before starting your project, the target service must be deployed. You can learn more here:
- How to create [Azure File Share](/azure/storage/files/storage-how-to-create-file-share)
- How to create an [SMB volume](/azure/azure-netapp-files/azure-netapp-files-create-volumes-smb) or [NFS export](/azure/azure-netapp-files/azure-netapp-files-create-volumes) in Azure NetApp Files

The Komprise Grid is deployed in a virtual environment (Hyper-V, VMware, KVM) for speed, scalability, and resilience. Alternatively, you may set up the environment in your Azure subscription using [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management).

1. Open the Azure portal and search for storage accounts

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-portal-search.png" alt-text="Screenshot of the Azure Portal Search Dialog" lightbox="./media/komprise-quick-start-guide-v2/screenshot-portal-search.png":::

    You can also click on the default Storage accounts icon

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-storage-accounts.png" alt-text="Screenshot of the Azure Storage Account Dialog" lightbox="./media/komprise-quick-start-guide-v2/screenshot-storage-accounts.png":::

2.	Select Create to add an account:
    a. Select an existing resource group or Create New.
    b. Provide a unique name for your storage account.
    c. Choose the region.
    d. Select Standard or Premium performance, depending on your needs. If you select Premium, select File shares under Premium account type.
    e. Choose the [Redundancy](/azure/storage/common/storage-redundancy) that meets your data protection requirements

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-create-storage-account.png" alt-text="Screenshot of the Azure Create Storage Account Dialog" lightbox="./media/komprise-quick-start-guide-v2/screenshot-create-storage-account.png":::

3. Next, consider keeping the recommended default settings from the Advanced screen. If you're migrating to Azure Files, it's recommended to enable large file shares if available

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-create-storage-account-advanced.png" alt-text="Screenshot of the Azure Create Storage Account Advanced Dialog" lightbox="./media/komprise-quick-start-guide-v2/screenshot-create-storage-account-advanced.png":::

4. Keep the default networking options for now and move on to data protection. You can choose to enable soft delete, which allows you to recover accidentally deleted data within the defined retention period. Soft delete offers protection against accidental or malicious deletion.

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-create-storage-account-data-protection.png" alt-text="Screenshot of the Azure Create Storage Account Data Protection Dialog" lightbox="./media/komprise-quick-start-guide-v2/screenshot-create-storage-account-data-protection.png":::

5.	Add tags for an organization if you use tagging and create your account

6.	Two quick steps are all that is now required before you can add the account to your Komprise environment. Navigate to the account you created in the Azure portal and select File shares under the File Service menu. Add a File share providing a meaningful name. Then, navigate to the Access keys item under Settings and copy the Storage account name and one of the two access keys. If the keys aren't showing, select Show keys

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-manage-access-keys.png" alt-text="Screenshot of the Manage Access Keys dialog" lightbox="./media/komprise-quick-start-guide-v2/screenshot-manage-access-keys.png":::

7. Navigate to the Properties of the Azure File share. Write down the URL address, which is required to add the Azure connection into the Komprise target file share

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-azure-file-share-properties.png" alt-text="Screenshot of Azure File Share Properties dialog" lightbox="./media/komprise-quick-start-guide-v2/screenshot-azure-file-share-properties.png":::

8.	(Optional) You can add extra layers of security to your deployment
    
    a. Configure role-based access to limit who can make changes to your storage account. For more information, see [Built-in roles for management operations](/azure/storage/common/authorization-resource-provider#built-in-roles-for-management-operations)
    
    b. Restrict access to the account to specific network segments with [storage firewall settings](/azure/storage/common/storage-network-security). Configure firewall settings to prevent access from outside of your corporate network

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-network-security.png" alt-text="Screenshot of Azure Network Security dialog" lightbox="./media/komprise-quick-start-guide-v2/screenshot-network-security.png":::

    c. Set a [delete lock](/azure/azure-resource-manager/management/lock-resources) on the account to prevent accidental deletion of the storage account.
    
    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-delete-lock.png" alt-text="Screenshot of Azure Delete Lock dialog" lightbox="./media/komprise-quick-start-guide-v2/screenshot-delete-lock.png":::

    d. Review this document for other [security best practices](/azure/storage/blobs/security-recommendations)


## Migration guide
### Organizing the migration
Simplify migration planning tasks by organizing them into a few operational classes. Review the number of files, capacity per file size, file ages and the time required to complete the initial analysis to identify where to begin. Starting with the easy and building to the complex helps with building experience and confidence and confirm the cutover processes before tackling the harder migrations. These steps can be summarized as:
- Tiering type: data that can move at any time, since the data is typically cold data no one is accessing it could be sent to Azure Blog Archive for long-term storage. Data included could be an entire share, or part of a share. With Transparent Tiering, Komprise leaves a symbolic link so end users never lose access to their files and data.
- Easy type: fairly static shares with few users that move in one or two iterations. Minimal migration time and short cutover time required.
- Moderate type: little to moderately active individual shares of average file size (~1 MB). Should need minimal migration time; may require scheduling specific cutover window.
- Active type: shares with active data change daily, which can have a significant effect on data verification, operations, costs, Observers and Proxy systems placement (on-premises or in the cloud), and final cutover time. It may require multiple migration iterations and scheduling longer final cutover times
- Complex type: represents moving shares with various dependencies from multiple shares migrating in unison, to shares with many small files, or shares with many empty directories. Complex shares may require advance coordination, possibly several iterations and longer cutover windows depending on the situation. 

### Migration administration
Komprise provides live migration, where end users and applications have continuous data access while the data is moving. With Komprise elastic migrations, multiple migration activities automatically use the full architecture for maximum parallelization.  The Director console simplifies the administration of all the migration tasks with one interface.  
Komprise’s migration process automates moving directories, files, and links from a source to a destination. At each step, data integrity is checked. All attributes, permissions and access controls from the source are applied. In an object migration, objects, prefixes, and metadata of each object are migrated too.
To configure and run a migration, follow these steps:
1. Once you have completed your Analysis and confirmed that the Storage and Network performance are optimally configured you're ready to start with the Archive and Easy migration types. 
2. Navigate to Migrate and select Add Migration

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-add-migration-dialog.png" alt-text="Screenshot of Komprise Add Migration Task" lightbox="./media/komprise-quick-start-guide-v2/screenshot-add-migration-dialog.png":::

3. Add migration task by selecting proper source and destination shares. Provide a migration name. Once configured, select Start Migration. This step is slightly different for file and object data migrations as you're selecting data stores instead of shares. Review the following steps. 
You may also choose to verify each data transfer using MD5 checksum. Depending in the position of Komprise data movement components, egress costs may occur  when cloud objects are retrieved to calculate the MD5 values.

    File Migration

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-file-migration-dialog.png" alt-text="Screenshot of Komprise Add File Migration Dialog" lightbox="./media/komprise-quick-start-guide-v2/screenshot-file-migration-dialog.png":::

    File migration provides options to preserve access time and SMB ACLs on the destination. This option depends on the selected source and destination file service and protocol.

    Object Migration

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-object-migration-dialog.png" alt-text="Screenshot of Komprise Add Object Migration Dialog" lightbox="./media/komprise-quick-start-guide-v2/screenshot-object-migration-dialog.png":::

    Object migration provides options to choose the destination Azure storage tier (Hot, Cool, Archive). 

4. Once the migration started, you can go to Migrate to monitor the progress.

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-migration-management-dialog.png" alt-text="Screenshot of Komprise Migration Management Dialog" lightbox="./media/komprise-quick-start-guide-v2/screenshot-migration-management-dialog.png":::

5. Once all changes have been migrated, run one final migration by clicking on Actions and selecting Start final iteration. Before final migration, we recommend stopping access to source file shares or moving them to read-only mode (for users and applications). This step makes sure no changes happen on the source.

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-migration-overview.png" alt-text="Screenshot of Komprise Migration Management Overview" lightbox="./media/komprise-quick-start-guide-v2/screenshot-migration-overview.png":::

    Once the final migration finishes, transition all users and applications to the destination share. Switching over to the new file service usually requires changing the configuration of DNS servers and DFS servers or changing the mount points to the new destination.

6.	As the last step, mark the migration completed.

7.	There is a full migration audit folder containing all the information about files moved and deleted, attributes and errors encountered for every iteration. The data is written to the ".komprise-audit" folder on the destination, or in a specified system, log folder configured in System | Settings of the console.



## Deployment instructions for migrating object data
Migrating Object storage systems to Azure Blob is an easy process as well. The Director and Observer are provisioned by Komprise as cloud services. Similar to on-premises deployment, you can analyze and understand the data on the sources system, identify any issues and then efficiently move data to Azure Blob Storage. 
The flexibility of the Komprise architecture allows deploying the Observers where they provide the highest performance while keeping data movement costs/charges low.
To get started, sign-in to the director and do the following:
1. Navigate to Data Stores and Add Object Store. Here you can choose the add systems by Add Account or by Add Bucket.

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-add-object-store.png" alt-text="Screenshot of Komprise Add Object Store Dialog" lightbox="./media/komprise-quick-start-guide-v2/screenshot-add-object-store.png":::

2. Continue adding Source data stores
3. Enable buckets for Analysis. Reviewing the data stores to build a migration plan.
4. Add Azure Blob Destination data stores, either by Account or Bucket.

    :::image type="content" source="./media/komprise-quick-start-guide-v2/screenshot-add-object-destination.png" alt-text="Screenshot of Komprise Add Object Destination Dialog" lightbox="./media/komprise-quick-start-guide-v2/screenshot-add-object-destination.png":::

    With Add Account, discover all the containers by entering:
    - Storage account name
    - Primary access key
    - Display Name

    Required information can be found in [Azure portal](https://portal.azure.com/) by navigating to the Access keys item under Settings for the storage account. If the keys aren't showing, select on the Show keys.

    Or, specify a container by entering:
    - Container Name
    - Storage Account Name
    - Primary Access Key
    - Display Name

The container name represents the destination container for the migration and needs to be created before migration. Other required information can be found in [Azure portal](https://portal.azure.com/) by navigating to the Access keys item under Settings for the storage account. If the keys aren't showing, select on the Show keys.

5. Migrating Object Data Stores uses the same iterative process to move data as the NAS migration steps described previously. 


## Migration API
Komprise has full migration API support so everything described in the document can be controlled via scripts. Komprise has an example script our customers use to move large numbers of shares effectively. Review with your Komprise team if you require the API.

### Maximize your data value with Azure and Komprise
Komprise helps you plan and execute your file and object data migrations to Azure.  Once your migrations are complete, you can use the full Komprise Intelligent Data Management service to manage data lifecycle, seamlessly tier data from on-premises to Azure and to search, find and execute new data workflows.  


## Next steps

### Marketplace

Get Komprise Data Migration listing on [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview).
Get Komprise full suite listing on [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/komprise_inc.intelligent_data_management?tab=Overview). 

### Education

Various resources are available to learn more:
- [Storage migration overview](/azure/storage/common/storage-migration-overview)
- Features supported by Komprise Intelligent Data Management in [migration tools comparison matrix](/azure/storage/solution-integration/validated-partners/data-management/migration-tools-comparison)
- [Komprise compatibility matrix](https://www.komprise.com/partners/microsoft-azure/)

