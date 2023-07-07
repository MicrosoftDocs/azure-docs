---
title: Deploy hybrid data infrastructure with Tiger Bridge and Azure Blob Storage
titleSuffix: Azure Storage
description: Deployment guide for hybrid infrastructure using Tiger Bridge and Azure Blob Storage. It shows how to implement the solution in single site, or multi-site configuration.
author: dukicn
ms.author: nikoduki
ms.date: 12/23/2021
ms.topic: conceptual
ms.service: azure-storage
ms.subservice: storage-partner-integration
---

# Deploy hybrid data infrastructure with Tiger Bridge and Azure Blob Storage

This article describes how to set up Tiger Bridge data management system with Azure Blob Storage. Tiger Bridge is fully integrated with NTFS, or ReFS file systems on windows platform. It can also manage volumes via SMB/NFS.
Tiger Bridge is a connector that creates a single name-space between different sources, and Azure Blob Storage. It allows replication, tiering, and collaboration of unstructured data with file-locking capabilities between different file systems. Data is stored in Azure Blob Storage in native format, which makes it open to Azure, and third-party services (like AI/ML). 
Tiger Bridge can be deployed on physical or virtual infrastructure, and can easily be integrated within existing environment. Main features of the solution are:

- Data replication
- Space reclamation
- Data archiving
- Data synchronization
- Lifecycle management and versioning 

Optional analytics component helps in assessing data sets, and recommends Azure Blob storage tiers. 

## Common use cases for Tiger Bridge
- Gain insights on your existing data sets, and access patterns to select the proper tier for Azure Blob (hot, cool, or archive). 
- Policy-based tiering for transparent access of less-frequently used data to Azure Blob storage, based on last access or last modification times. 
- Providing disaster recovery capabilities for cluster-based setups and existing infrastructure, including working with Microsoft DFS/DFS-R
- Intelligent, policy-based data archiving based on age, size, or available storage capacity. 
- Collaboration capabilities between several file systems, including file-locking, using Azure Blob storage
- Providing Continuous Data Protection with retention policies, integrating Azure Versions, Soft delete with MS explorer shell extension for transparent control.
- Migration between different file systems and Azure Blob. 


## Reference architecture
Tiger Bridge can be deployed in two configurations:
1. Standalone hybrid configuration
    :::image type="content" source="./media/tiger-bridge-deployment-guide/tiger-bridge-reference-architecture-1.png" alt-text="Diagram that shows reference architecture for Tiger Bridge in hybrid configuration":::

1. Multi-site configuration
    :::image type="content" source="./media/tiger-bridge-deployment-guide/tiger-bridge-reference-architecture-2.png" alt-text="Diagram that shows reference architecture for Tiger Bridge in multi-site file server extension configuration":::

    - **NTFS/ReFS** represent a local file system (local to the host as local drive, SAN disk, or similar). Tiger Bridge runs on the Microsoft Windows Server, and creates a single namespace with Azure Blob Storage.
    - **NAS source** represents any NAS (network attached storage) managed by external operating system that can export the storage via SMB, CIFS, or NFS. In this scenario, Tiger Bridge runs as a gateway providing the management of the data. 

## Before you begin

Upfront planning will help in seamless deploy for Tiger Bridge.

### Get started with Azure

Microsoft offers a framework to follow to get you started with Azure. The [Cloud Adoption Framework](/azure/architecture/cloud-adoption/) (CAF) is a detailed approach to enterprise digital transformation and comprehensive guide to planning a production grade cloud adoption. The CAF includes a step-by-step [Azure setup guide](/azure/cloud-adoption-framework/ready/azure-setup-guide/) to help you get up and running quickly and securely. You can find an interactive version in the [Azure portal](https://portal.azure.com/?feature.quickstart=true#blade/Microsoft_Azure_Resources/QuickstartCenterBlade). You'll find sample architectures, specific best practices for deploying applications, and free training resources to put you on the path to Azure expertise.

### Considerations for deployment in hybrid scenario

Several aspects are important when considering hybrid deployment with Tiger Bridge on-premises. 

Most important aspect is available network bandwidth. You will require enough network bandwidth to support initial replication, and any incremental change without impacting production applications. This section outlines the tools and techniques that are available to assess your network needs.

#### Determine unutilized internet bandwidth

It's important to know how much typically unutilized bandwidth (or *headroom*) you have available on a day-to-day basis. To help you assess whether you can meet your goals for:

- Initial time for replication when you're not using Azure Data Box for offline method
- Time required to do incremental resync

Use the following methods to identify the bandwidth headroom to Azure that is free to consume.

- If you're an existing Azure ExpressRoute customer, view your [circuit usage](../../../../expressroute/expressroute-monitoring-metrics-alerts.md#circuits-metrics) in the Azure portal.
- Contact your ISP and request reports to show your existing daily and monthly utilization.
- There are several tools that can measure utilization by monitoring your network traffic at the router/switch level:
  - [SolarWinds Bandwidth Analyzer Pack](https://www.solarwinds.com/network-bandwidth-analyzer-pack?CMP=ORG-BLG-DNS)
  - [Paessler PRTG](https://www.paessler.com/bandwidth_monitoring)
  - [Cisco Network Assistant](https://www.cisco.com/c/en/us/products/cloud-systems-management/network-assistant/index.html)
  
## Deployment guide

Before you begin the deployment, we recommend you plan your Tiger Bridge use case:
- Consider running Tiger Technology Storage Assessment. This step will provide insights on your existing data, including last access, and modification times (access patterns), file types, size, and so on.
- Understand the existing storage capacity to make proposer selection for retention policies. 
- Consider long-term planning for your future data workflows to allow proper selection for defining policies (reclamation, replication, archiving, and snapshot policies.)

### Prepare Azure Blob Storage
Before Tiger Bridge can be deployed, you need to create a **Storage Account**. Storage account will be used as a repository for data that is tiered, or replicated from Tiger Bridge solution. Tiger Bridge supports all Azure Storage services, including Archive Tier for Azure Storage Block blobs. That support allows to store less frequently data in cost-effective way but still access it through the well-known pane of glass. For additional information on Tiger Bridge, visit our comparison of [ISV solutions](./isv-file-services.md).

1. Create a storage account
    :::image type="content" source="./media/tiger-bridge-deployment-guide/azure-create-storage-account.png" alt-text="Screenshot that shows how to create a storage account for Azure Blob Storage service.":::

1. Choose data protection for the storage account
    :::image type="content" source="./media/tiger-bridge-deployment-guide/azure-storage-account-protection.png" alt-text="Screenshot that shows how to set up a protection for a storage account.":::

1. Create a container within storage account
    :::image type="content" source="./media/tiger-bridge-deployment-guide/azure-storage-account-create-container.png" alt-text="Screenshot that shows how to create a container in a storage account.":::

### Deploy Tiger Bridge
Before you can install Tiger Bridge, you need to have a Windows file server installed and fully configured. Windows server must have access to a storage account prepared in [previous step](#prepare-azure-blob-storage).

#### Deploy standalone hybrid configuration

1. Install Tiger Bridge on your windows server. Installation is done by running the Tiger Bridge installation file, and following the wizard. During installation, you can select two components:
    1. Tiger Bridge installs the product, GUI, and command-line interface.
    1. Shell Extension provides integration with Windows Explorer. Allows manual management of the data through the Windows Explorer context menu.
1. In Tiger Bridge Configuration, add a local volume source:
    1. Select **Tiger Bridge** in the left pane 
    1. Select **Add Source**
    1. Select root of a drive, or browse to a folder you want to use for storing data. Select a folder and press **OK**. In this example, we will use C:\AzureSource.
        :::image type="content" source="./media/tiger-bridge-deployment-guide/tiger-bridge-add-source.png" alt-text="Screenshot that shows how to add a local source to Tiger Bridge server.":::
1. Pair the local source with Microsoft Azure target:
    1. In the **Tiger Bridge target** dialog, select **Azure**, and press **OK**.
        :::image type="content" source="./media/tiger-bridge-deployment-guide/tiger-bridge-pair-account.png" alt-text="Screenshot that shows how to pair Tiger Bridge local source with Azure storage account.":::
        C:\AzureSource in the screenshot is a folder selected in the previous step.
    1. Enter a name for the target.
    1. Enter the account name and key and the Blob endpoint in the respective fields. Use the storage account name created in [prepare Azure Blob storage step](#prepare-azure-blob-storage).
    1. Choose whether to access the target using the secure transfer (SSL/TLS) by selecting, or clearing the check box. Secure transfer is recommended for production workloads. If disabled, make sure that you disabled **Secure transfer required** option in the storage account **Configuration** option.
      :::image type="content" source="./media/tiger-bridge-deployment-guide/azure-secure-transfer.png" alt-text="Screenshot that shows how to enable, or disable secure transfer for a storage account.":::
    1. In the **Default access tier**, select whether to use the Hot, Cool, or Archive tier of Azure Storage. This tier will be used for any data that doesn't have a tier set. Learn more on [Hot, Cool, and Archive access tiers for blob data](../../../blobs/access-tiers-overview.md)
    1. In Rehydration priority, select whether offline files should be rehydrated using the Standard, or the High option. Learn more on [Blob rehydration from the Archive tier](../../../blobs/access-tiers-overview.md)
    1. Select **List containers** to display the list of containers available for the account you have specified, and then select the container on the target, which will be paired with the selected source.
    1. In the next step, select what to do with data already in the container, and then press **OK**.
      :::image type="content" source="./media/tiger-bridge-deployment-guide/tiger-bridge-existing-data-policy.png" alt-text="Screenshot that shows policies for managing existing data in the storage account container.":::
  1. Create a policy by selecting **Add policy**. Select the policy based on the needs:
      - **Replicate** copies all data from local source to Azure Blob Storage. Automatic replication is performed based on user-defined criteria.
      - **Reclaim Space** copies all data from local source to Azure Blob Storage, and replaces the data with a stub file. Stub file looks exactly like the actual file, but doesn't contain any data (doesn't take any space).
      - **Archive** moves the data from Azure Storage Hot or Cool tier to Azure Storage Archive tier for long-term retention. It replaces the file with an offline file. Offline file is same as stub file with an offline flag.
      :::image type="content" source="./media/tiger-bridge-deployment-guide/tiger-bridge-set-policy.png" alt-text="Screenshot that shows how to set a policy on data.":::

#### Deploy multi-site configuration
To deploy Tiger Bridge in multi-site configuration, follow the steps from [deploying standalone hybrid configuration](#deploy-standalone-hybrid-configuration). These steps must be run on all Tiger Bridge servers you want to use in multi-site configuration. Servers must use the same storage accounts and same containers. Once done, do the following extra steps on all Tiger Bridge servers
1. Select **Add sync** on the defined local source, and define the synchronization policy:
    1. **Listen** defines the time interval at which the Tiger Bridge server will check for changes from other Tiger Bridge servers. 
    1. (_optional_) Select the **Automatically restore files on the synchronized source** if you want to retrieve the files immediately after changes have been synchronized.
    1. Press **Apply**.
      :::image type="content" source="./media/tiger-bridge-deployment-guide/tiger-bridge-sync-policy.png" alt-text="Screenshot that shows how to set a synchronization policy for multi-site configuration.":::

> [!TIP]
> Tiger Bridge Policies and Synchronization can be defined as global (applied to all Tiger Bridge servers), or can be defined per Tiger Bridge server.

## Support

### How to open a case with Azure

In the [Azure portal](https://portal.azure.com) search for support in the search bar at the top. Select **Help + support** -> **New Support Request**.

### Engaging Tiger Bridge support

Tiger Technology provides 365x24x7 support for Tiger Bridge. To contact support, [create a support ticket](https://www.tiger-technology.com/contact-support/).

## Next steps
- [Tiger Bridge website](https://www.tiger-technology.com/software/tiger-bridge/)
- [Tiger Bridge guides](https://www.tiger-technology.com/software/tiger-bridge/docs/)
- [Azure Storage partners for primary and secondary storage](./partner-overview.md)
- [Tiger Bridge Marketplace offering](https://azuremarketplace.microsoft.com/marketplace/apps/tiger-technology.tigerbridge_vm)
- [Running ISV file services in Azure](./isv-file-services.md)