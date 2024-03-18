---
title: Azure Private Link availability
description: In this article, learn about which Azure services support Private Link.
author: abell
ms.author: abell
ms.service: private-link
ms.topic: conceptual
ms.date: 03/18/2024
ms.custom: template-concept, references_regions
---

# Azure Private Link availability

Azure Private Link enables you to access Azure PaaS Services (for example, Azure Storage and SQL Database) and Azure hosted customer-owned/partner services over a [private endpoint](private-endpoint-overview.md) in your virtual network.

> [!IMPORTANT]
> Azure Private Link is now generally available. Both Private Endpoint and Private Link service (service behind standard load balancer) are generally available. For known limitations, see [Private Endpoint](private-endpoint-overview.md#limitations) and [Private Link Service](private-link-service-overview.md#limitations).

## Service availability

The following tables list the Private Link services and the regions where they're available.

### AI + Machine Learning

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|Azure Machine Learning | All public regions    |  | GA   <br/> [Learn how to create a private endpoint for Azure Machine Learning.](../machine-learning/how-to-configure-private-link.md)   |
|Azure Bot Service | All public regions | Supported only on Direct Line App Service extension | GA </br> [Learn how to create a private endpoint for Azure Bot Service](/azure/bot-service/dl-network-isolation-concept) |
| Azure AI services | All public regions<br/>All Government regions      |   | GA   <br/> [Use private endpoints.](../ai-services/cognitive-services-virtual-networks.md#use-private-endpoints)  |
| Azure AI Search | All public regions | | GA </br> [Learn how to create a private endpoint for Azure AI Search](../search/service-create-private-endpoint.md) |

### Analytics

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|Azure Synapse Analytics| All public regions <br/> All Government regions |  Supported for Proxy [connection policy](/azure/azure-sql/database/connectivity-architecture#connection-policy) |GA <br/> [Learn how to create a private endpoint for Azure Synapse Analytics.](/azure/azure-sql/database/private-endpoint-overview)|
|Azure Event Hubs | All public regions<br/>All Government regions      |   | GA   <br/> [Learn how to create a private endpoint for Azure Event Hubs.](../event-hubs/private-link-service.md)  |
| Azure Monitor <br/>(Log Analytics & Application Insights) | All public regions      |  | GA   <br/> [Learn how to create a private endpoint for Azure Monitor.](../azure-monitor/logs/private-link-security.md)   |
|Azure Data Factory | All public regions<br/> All Government regions<br/>All China regions    | Credentials need to be stored in an Azure key vault| GA   <br/> [Learn how to create a private endpoint for Azure Data Factory.](../data-factory/data-factory-private-link.md)   |
|Azure HDInsight | All public regions<br/>All Government regions      |   | GA   <br/> [Learn how to create a private endpoint for Azure HDInsight.](../hdinsight/hdinsight-private-link.md)  |
| Azure Data Explorer | All public regions | | GA </br> [Learn how to create a private endpoint for Azure Data Explorer.](/azure/data-explorer/security-network-private-endpoint) |
| Azure Stream Analytics | All public regions | | GA </br> [Learn how to create a private endpoint for Azure Stream Analytics.](../stream-analytics/private-endpoints.md) |

### Compute

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|Azure-managed Disks | All public regions<br/> All Government regions<br/>All China regions    | [Select for known limitations](../virtual-machines/disks-enable-private-links-for-import-export-portal.md#limitations) | GA   <br/> [Learn how to create a private endpoint for Azure Managed Disks.](../virtual-machines/disks-enable-private-links-for-import-export-portal.md)   |
| Azure Batch (batchAccount) | All public regions<br/> All Government regions<br/>All China regions  | | GA <br/> [Learn how to create a private endpoint for Azure Batch.](../batch/private-connectivity.md) |
| Azure Batch (nodeManagement) | [Selected regions](../batch/simplified-compute-node-communication.md#supported-regions) | Supported for [simplified compute node communication](../batch/simplified-compute-node-communication.md) | GA <br/> [Learn how to create a private endpoint for Azure Batch.](../batch/private-connectivity.md) |
| Azure Functions | All public regions | | GA </br> [Learn how to create a private endpoint for Azure Functions.](../azure-functions/functions-create-vnet.md) |

### Containers

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|Azure Container Registry | All public regions<br/> All Government regions    | Supported with premium tier of container registry. [Select for tiers](../container-registry/container-registry-skus.md)| GA   <br/> [Learn how to create a private endpoint for Azure Container Registry.](../container-registry/container-registry-private-link.md)   |
|Azure Kubernetes Service - Kubernetes API | All public regions <br/> All Government regions  |  | GA   <br/> [Learn how to create a private endpoint for Azure Kubernetes Service.](../aks/private-clusters.md)   |

### Databases

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|  Azure SQL Database         | All public regions <br/> All Government regions<br/>All China regions      |  Supported for Proxy [connection policy](/azure/azure-sql/database/connectivity-architecture#connection-policy) | GA <br/> [Learn how to create a private endpoint for Azure SQL](./tutorial-private-endpoint-sql-portal.md)      |
|Azure Cosmos DB|  All public regions<br/> All Government regions</br> All China regions | |GA <br/> [Learn how to create a private endpoint for Azure Cosmos DB.](./tutorial-private-endpoint-cosmosdb-portal.md)|
|  Azure Database for PostgreSQL - Single server         | All public regions <br/> All Government regions<br/>All China regions     | Supported for General Purpose and Memory Optimized pricing tiers | GA <br/> [Learn how to create a private endpoint for Azure Database for PostgreSQL.](../postgresql/concepts-data-access-and-security-private-link.md)      |
|  Azure Database for MySQL         | All public regions<br/> All Government regions<br/>All China regions      |  | GA <br/> [Learn how to create a private endpoint for Azure Database for MySQL.](../mysql/concepts-data-access-security-private-link.md)     |
|  Azure Database for MariaDB         | All public regions<br/> All Government regions<br/>All China regions     |  | GA <br/> [Learn how to create a private endpoint for Azure Database for MariaDB.](../mariadb/concepts-data-access-security-private-link.md)      |
| Azure Cache for Redis | All public regions<br/> All Government regions<br/>All China regions |  | GA <br/> [Learn how to create a private endpoint for Azure Cache for Redis.](../azure-cache-for-redis/cache-private-link.md) |

### Integration

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|Azure Event Grid| All public regions<br/> All Government regions       |  | GA   <br/> [Learn how to create a private endpoint for Azure Event Grid.](../event-grid/network-security.md) |
|Azure Service Bus | All public region<br/>All Government regions  | Supported with premium tier of Azure Service Bus. [Select for tiers](../service-bus-messaging/service-bus-premium-messaging.md) | GA   <br/> [Learn how to create a private endpoint for Azure Service Bus.](../service-bus-messaging/private-link-service.md)  |
| Azure API Management | All public regions  |  | GA   <br/> [Connect privately to API Management using a private endpoint.](../api-management/private-endpoint.md) |
| Azure Logic Apps | All public regions  |  | GA   <br/> [Learn how to create a private endpoint for Azure Logic Apps.](../logic-apps/secure-single-tenant-workflow-virtual-network-private-endpoint.md) |

### Internet of Things (IoT)

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
| Azure IoT Hub | All public regions    |  | GA   <br/> [Learn how to create a private endpoint for Azure IoT Hub.](../iot-hub/virtual-network-support.md) |
| Azure IoT Device Provisioning Service | All public regions |  |  GA   <br/> [Learn how to create a private endpoint for Azure IoT Device Provisioning Service.](../iot-dps/virtual-network-support.md) | 
|  Azure Digital Twins         | All public regions supported by Azure Digital Twins     |  | Preview <br/> [Learn how to create a private endpoint for Azure Digital Twins.](../api-management/private-endpoint.md)  |

### Management and Governance

| Supported services | Available regions | Other considerations | Status  |
| ------------ | ----------------| ------------| ----------------|
| Azure Automation  | All public regions<br/> All Government regions |  | GA </br> [Learn how to create a private endpoint for Azure Automation.](../automation/how-to/private-link-security.md)|
|Azure Backup | All public regions<br/> All Government regions   |  | GA <br/> [Learn how to create a private endpoint for Azure Backup.](../backup/private-endpoints.md)   |
| Microsoft Purview | Southeast Asia, Australia East, Brazil South, North Europe, West Europe, Canada Central, East US, East US 2, EAST US 2 EUAP, South Central US, West Central US, West US 2, Central India, UK South   | [Select for known limitations](../purview/catalog-private-link-troubleshoot.md#known-limitations) | GA <br/> [Learn how to create a private endpoint for Microsoft Purview.](../purview/catalog-private-link.md)   |
| Azure Migrate | All public regions<br/> All Government regions |  | GA </br> [Discover and assess servers for migration using Private Link.](../migrate/discover-and-assess-using-private-endpoints.md) |

### Security

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|  Azure Key Vault         | All public regions<br/> All Government regions      |  | GA   <br/> [Learn how to create a private endpoint for Azure Key Vault.](../key-vault/general/private-link-service.md)   |
|Azure App Configuration | All public regions      |  | GA  </br> [Learn how to create a private endpoint for Azure App Configuration](../azure-app-configuration/concept-private-endpoint.md) |
|Azure Application Gateway | All public regions      |  | GA  </br> [Azure Application Gateway Private Link](../application-gateway/private-link.md) |


### Storage
|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
| Azure Blob storage (including Data Lake Storage Gen2)       |  All public regions<br/> All Government regions       |  Supported only on Account Kind General Purpose V2 | GA <br/> [Learn how to create a private endpoint for blob storage.](tutorial-private-endpoint-storage-portal.md)  |
| Azure Files | All public regions<br/> All Government regions      | |   GA <br/> [Learn how to create Azure Files network endpoints.](../storage/files/storage-files-networking-endpoints.md)   |
| Azure File Sync | All public regions      | |   GA <br/> [Learn how to create Azure Files network endpoints.](../storage/file-sync/file-sync-networking-endpoints.md)   |
| Azure Queue storage       |  All public regions<br/> All Government regions       |  Supported only on Account Kind General Purpose V2 | GA <br/> [Learn how to create a private endpoint for queue storage.](tutorial-private-endpoint-storage-portal.md) |
| Azure Table storage       |  All public regions<br/> All Government regions       |  Supported only on Account Kind General Purpose V2 | GA <br/> [Learn how to create a private endpoint for table storage.](tutorial-private-endpoint-storage-portal.md)  |

### Web
|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
| Azure SignalR | All Public Regions<br/> All China regions<br/> All Government Regions      | Supported on Standard Tier or above | GA   <br/> [Learn how to create a private endpoint for Azure SignalR.](../azure-signalr/howto-private-endpoints.md)   |
|Azure App Service | All public regions<br/> China North 2 & East 2    | Supported with Basic, Standard, Premium v2, Premium v3, Isolated v2 App Service Plans and Function Apps Premium plan  | GA   <br/> [Learn how to create a private endpoint for Azure App Service.](../app-service/networking/private-endpoint.md)   |
|Azure Search | All public regions <br/> All Government regions | Supported with service in Private Mode | GA   <br/> [Learn how to create a private endpoint for Azure Search.](../search/service-create-private-endpoint.md)    |
|Azure Relay | All public regions      |  | GA   <br/> [Learn how to create a private endpoint for Azure Relay.](../azure-relay/private-link-service.md)  |
|Azure Static Web Apps | All public regions      |  | Preview <br/> [Configure private endpoint in Azure Static Web Apps](../static-web-apps/private-endpoint.md)  |

### Private Link service with a standard load balancer

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|Private Link services behind standard Azure Load Balancer | All public regions<br/> All Government regions<br/>All China regions  | Supported on Standard Load Balancer | GA <br/> [Learn how to create a private link service.](create-private-link-service-portal.md) |

## Next steps

Learn more about Azure Private Link service:
- [What is Azure Private Link?](private-link-overview.md)
- [Create a Private Endpoint using the Azure portal](create-private-endpoint-portal.md)
