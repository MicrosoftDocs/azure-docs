---
title: How to select a strategy for relocating cloud workloads
description: Learn how to select the right strategy for relocating cloud workloads and applications.
author: SomilGanguly
ms.author: ssumner
ms.date: 12/18/2023
ms.reviewer: ssumner
ms.topic: conceptual
ms.custom: internal
keywords: cloud adoption, cloud framework, cloud adoption framework
---
# Select a relocation strategy for cloud workloads

Before you start migrating the workload to another region, you need to plan your relocation strategy. The strategy includes the relocation method, service-relocation automation, and data-relocation automation. This article lays out the options for each strategy component and guides you toward a decision. Ultimately, the selections you make depend on the services and the criticality of the workload.

:::image type="content" source="./media/relocate/relocate-select.svg" alt-text="Diagram showing the relocation process and highlights the Select step in the Move phase. In the relocation process, there are two phases and five steps. The first phase is the Initiate phase, and it has one step called Initiate. The second phase is the Move phase, and it has four steps that you repeat for each workload. The steps are Evaluate, Select, Migrate, and Cutover." lightbox="./media/relocate/relocate-select.svg" border="false":::

## Select a relocation method

There are three main methods for relocating workloads. The relocation method you choose depends on the services in the workload and how critical the workload is to essential business functions. You could consider different relocation methods for production and nonproduction environments. Cold relocation is for nonessential workloads. Hot and warm relocation is for mission-critical. The method you choose relocation affects service and data relocation tools you use to relocate the workload. Use the following relocation decision tree to get a general idea of the right relocation method and validate your decision by reading the overview of the three relocation methods.

:::image type="content" source="./media/relocate/relocation-methods-decision-tree.png" alt-text="Diagram showing a decision tree for selecting the right relocation method. There are two decision points. 1. Is downtime okay? If yes, then cold relocation is the correct relocation method. 2. Does the service support synchronous data replication? If yes, then hot relocation is the correct relocation method. If no, then warm relocation is the correct relocation method." lightbox="./media/relocate/relocation-methods-decision-tree.png" border="false":::

### Cold relocation

Cold relocation is for workloads that can withstand downtime. It's the most cost-effective approach to relocation because you don't duplicate any environments during relocation. Here's an overview of the cold relocation process.

1. Back up workload data to the new target region.
1. Take the source region offline and shut down services.
1. Deploy the cloud services to the new target region.
1. Restore workload data.

Cold relocation can take a few minutes or a few days depending on the number of services and volume of data.

### Hot relocation

The hot relocation method is for workloads that need minimal (seconds, minutes) to zero downtime. For critical workloads, you should see if the service supports hot relocation before trying a warm approach. Hot relocation helps minimize the data delta after cutover. Hot relocation is only possible if the service supports synchronous data replication. Some services don't have this feature, and you need to use a warm relocation approach instead. Here's the hot relocation process.

1. Perform service replication in the new target region.
1. Keep the workload running in the source region.
1. Start synchronous data replication.
1. Activate and validate the endpoints after the data synchronize.
1. Stop the data synchronization.
1. Shut down the service in source region.

### Warm relocation

Warm relocation is for critical workloads that don't support hot relocation. Warm relocation uses asynchronous data replication and environment replication. Here's the warm relocation process.

1. Perform service replication in the new target region.
1. Keep the workload running in the source region.
1. Create a backup of the source data. It's a best practice to create the backup during off-peak hours. You should also enable data-in replication to synchronize the data and minimize the data delta.
1. Restore the data in the new target region.
1. Switch and validate endpoints.
1. Shut down the workload in the source region.

Warm relocation can take a few minutes or an hour depending on the number of services and volume of data.

## Select service-relocation automation

There are two primary service-relocation automation methods: infrastructure as code (IaC) and Azure Resource Mover. Each Azure service supports one or both automation approaches. Use the [Azure services relocation guidance](/azure/operational-excellence/overview-relocation) to see which automation method each Azure service supports and detailed steps for relocation. Here's an overview of the automation that the service relocation guidance uses:

- *Infrastructure as code (IaC):* IaC can relocate every Azure service. Export the Azure Resource Manager (ARM) template (JSON) of an existing Azure service. Modify the template as needed and redeploy the template to a new region. You can convert ARM templates to Bicep templates by [pasting the JSON](/azure/azure-resource-manager/bicep/visual-studio-code#paste-as-bicep) into Visual Studio Code. When you use IaC to deploy a new instance of an Azure service, you can deploy multiple copies of the resource in parallel. With multiple copies, you can use one of the cutover techniques to redirect connections to the workloads in the new target region. Infrastructure as code (IaC) doesn't relocate data. Data relocation requires extra steps to move data to the newly deployed resource in the target region. Use the [data-relocation automation](#select-data-relocation-automation) guidance for more details.

- *Azure Resource Mover:* Azure Resource Mover allows you to move a limited number of [supported Azure resources](/azure/resource-mover/overview#what-resources-can-i-move-across-regions) with its dependencies between regions, subscriptions, and resource groups.

## Select data-relocation automation

If you used IaC to relocate stateful Azure services, you need to use a data-relocation automation method to relocate your data. For data relocation, you need to have the Azure service running in the target region before moving the data. Review the [relocation methods](#select-a-relocation-method) to get a sense of the relocation sequence and where data relocation fits. Here's a list of automation tools you can use to relocate data:

- *Synchronous data replication:* Synchronous data replication replicates data in near real-time across regions. It's the preferred data relocation approach for hot relocation because it limits downtime and data delta migrations after cutover. This capability is built into some Azure services such as [Data Sync in Azure SQL Database](/azure/azure-sql/database/sql-data-sync-data-sql-server-sql-database). You need to check each service in your workload to see if it supports synchronous data replication.

- *Geo-replication:* Geo-replication can be a useful data relocation tool for the Azure services that support it. The way a geo-replication feature handles data and the underlying service instance varies across supported Azure services. Before using geo-replication for data relocation, you need to understand the geo-replication feature of the particular service you're relocating. For examples, see [Azure SQL](/azure/azure-sql/database/active-geo-replication-overview) and [Cosmos DB](/azure/cosmos-db/how-to-manage-database-account#addremove-regions-from-your-database-account).

- *Azure Site Recovery:* Azure Site Recovery can relocate services and data. It supports warm and cold relocation. For more information, see [Azure Site Recovery overview](/azure/site-recovery/site-recovery-overview).

- *AzCopy:* AzCopy is a command-line utility that automates data movements in and out of Azure Storage. You need to download the tool and then use Microsoft Entra ID or shared access signature (SAS) tokens to authorize the move. For more information, see [AzCopy overview](/azure/storage/common/storage-ref-azcopy) and [Use AzCopy](/azure/storage/common/storage-use-azcopy-v10)

- *Pipelines and activities in Azure Data Factory or Synapse Analytics:* Azure Data Factory is a fully managed cloud-based data integration service that orchestrates and automates the movement and transformation of data. Azure Data Factory pipelines can move data lakes and warehouses. Synapse Analytics copy activity can also move data. For more information, see [Supported targets and sources](/azure/data-factory/copy-activity-overview#supported-data-stores-and-formats) and [Copy data tool](/azure/data-factory/copy-data-tool).

- *Azure Storage Explorer:* Azure Storage Explorer is a standalone app that allows you to relocate Azure Storage data. For more information, see [How to use Storage Explorer](/azure/vs-azure-tools-storage-manage-with-storage-explorer).

- *Azure Backup:* With Azure Backup, you can back up and restore data in another region. You should try Azure Backup first for nonessential cold and warm relocations. Azure Backup provides application-consistent, file-system consistent, and crash-consistent backups for virtual machines. It also supports managed disks, files shares, and blobs. You can't transfer existing backup restore points to the new target region. Consider keeping the vault in your source region until the backups are no longer required. For more information, see [Azure Backup overview](/azure/backup/backup-overview).

- *Manual backup and restore:* Backup and restore here refers to a process, not a specific tool. Many services in Azure provide redundancy options that let you back up data to a separate region and restore it manually. You need to perform a manual backup and restore for specific services like Azure Key Vault. For more information, see [Move Key Vault to another region](/azure/key-vault/general/move-region).

|Tool | Relocation method|
| --- | --- |
|[Synchronous data replication](/azure/azure-sql/database/sql-data-sync-data-sql-server-sql-database)|Hot, Warm|
|[Geo-replication](/azure/azure-sql/database/active-geo-replication-overview) | Hot, Warm |
|[Azure Site Recovery](/azure/site-recovery/site-recovery-overview)|Warm, Cold|
|[AzCopy](/azure/storage/common/storage-use-azcopy-v10)|Warm, Cold|
|[Pipelines and activities in Azure Data Factory or Synapse Workspace](/azure/data-factory/concepts-pipelines-activities)| Warm, Cold |
|[Azure Storage Explorer](/azure/vs-azure-tools-storage-manage-with-storage-explorer)| Warm, Cold|
|[Azure Backup](/azure/backup/backup-overview)| Cold|
|[Manual backup and restore](/azure/key-vault/general/move-region)| Cold|

## Select cutover approach

Cutover is when you transition from the old workload to the new one. You direct traffic to the workload in the target region and no longer to the source region. The domain name system (DNS) is central to this redirection. As a reminder, DNS tells browsers and API clients where to get a response. It resolves domain names to IP addresses. Every domain needs a domain host to manage it. Azure DNS is the Azure domain host service. There are different approaches to workload cutover, and the approach you take depends on the services in your workload. Here are a few examples.

- *Azure DNS:* For domains hosted in Azure DNS, you can perform a manual cutover by switching the CNAME. This approach is a business continuity failover process that works for cutover. For more information, see [Manual cutover using Azure DNS](/azure/networking/disaster-recovery-dns-traffic-manager?toc=%2Fazure%2Fdns%2Ftoc.json#manual-failover-using-azure-dns).

- *Traffic Manager:* It's also possible to use a routing service like Traffic Manager for cutover and route workload traffic to different endpoints. Traffic Manager is a DNS-based routing service. For more information, see [Configure DNS names with Traffic Manager](/azure/app-service/configure-domain-traffic-manager).

- *App Service:* Application-layer services, such as Azure App Service, have features that allow you to update the domain name. For more information, see [Migrate an active DNS name to Azure App Service](/azure/app-service/app-service-web-tutorial-custom-domain?tabs=a%2Cazurecli).

- *Gateway routing:* If the workload uses the [Gateway Routing pattern](/azure/architecture/patterns/gateway-routing) with a service, such as Azure Front Door, Application Gateway, or Azure API Management, you can often make a region migration cutover. You use their backend targets and routing-rules features.

## Next step

You selected a relocation method and the tools to relocate your workload. Move on to the Migrate step to execute the relocation using these tools.

> [!div class="nextstepaction"]
> [Migrate](./relocate-migrate.md)