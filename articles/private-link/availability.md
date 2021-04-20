---
title: Azure Private Link availability
description: In this article, learn about which Azure services support Private Link.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 3/15/2021
ms.custom: template-concept,references_regions
---

# Azure Private Link availability

Azure Private Link enables you to access Azure PaaS Services (for example, Azure Storage and SQL Database) and Azure hosted customer-owned/partner services over a [private endpoint](private-endpoint-overview.md) in your virtual network. 

> [!IMPORTANT]
> Azure Private Link is now generally available. Both Private Endpoint and Private Link service (service behind standard load balancer) are generally available. Different Azure PaaS will onboard to Azure Private Link at different schedules. For known limitations, see [Private Endpoint](private-endpoint-overview.md#limitations) and [Private Link Service](private-link-service-overview.md#limitations). 

## Service availability

The following tables list the Private Link services and the regions where they're available. 

### AI + Machine Learning

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|Azure Machine Learning | All public regions    |  | GA   <br/> [Learn how to create a private endpoint for Azure Machine Learning.](../machine-learning/how-to-configure-private-link.md)   |

### Analytics

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|Azure Synapse Analytics| All public regions <br/> All Government regions |  Supported for Proxy [connection policy](../azure-sql/database/connectivity-architecture.md#connection-policy) |GA <br/> [Learn how to create a private endpoint for Azure Synapse Analytics.](../azure-sql/database/private-endpoint-overview.md)|
|Azure Event Hub | All public regions<br/>All Government regions      |   | GA   <br/> [Learn how to create a private endpoint for Azure Event Hub.](../event-hubs/private-link-service.md)  |
| Azure Monitor <br/>(Log Analytics & Application Insights) | All public regions      |  | GA   <br/> [Learn how to create a private endpoint for Azure Monitor.](../azure-monitor/logs/private-link-security.md)   |
|Azure Data Factory | All public regions<br/> All Government regions<br/>All China regions    | Credentials need to be stored in an Azure key vault| GA   <br/> [Learn how to create a private endpoint for Azure Data Factory.](../data-factory/data-factory-private-link.md)   |

### Compute

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|Azure App Configuration | All public regions      |  | Preview  </br> [Learn how to create a private endpoint for Azure App Configuration](../azure-app-configuration/concept-private-endpoint.md) |
|Azure-managed Disks | All public regions<br/> All Government regions<br/>All China regions    | [Select for known limitations](../virtual-machines/disks-enable-private-links-for-import-export-portal.md#limitations) | GA   <br/> [Learn how to create a private endpoint for Azure Managed Disks.](../virtual-machines/disks-enable-private-links-for-import-export-portal.md)   |

### Containers

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|Azure Container Registry | All public regions<br/> All Government regions    | Supported with premium tier of container registry. [Select for tiers](../container-registry/container-registry-skus.md)| GA   <br/> [Learn how to create a private endpoint for Azure Container Registry.](../container-registry/container-registry-private-link.md)   |
|Azure Kubernetes Service - Kubernetes API | All public regions      |  | GA   <br/> [Learn how to create a private endpoint for Azure Kubernetes Service.](../aks/private-clusters.md)   |

### Databases

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|  Azure SQL Database         | All public regions <br/> All Government regions<br/>All China regions      |  Supported for Proxy [connection policy](../azure-sql/database/connectivity-architecture.md#connection-policy) | GA <br/> [Learn how to create a private endpoint for Azure SQL](create-private-endpoint-portal.md)      |
|Azure Cosmos DB|  All public regions<br/> All Government regions</br> All China regions | |GA <br/> [Learn how to create a private endpoint for Cosmos DB.](./tutorial-private-endpoint-cosmosdb-portal.md)|
|  Azure Database for PostgreSQL - Single server         | All public regions <br/> All Government regions<br/>All China regions     | Supported for General Purpose and Memory Optimized pricing tiers | GA <br/> [Learn how to create a private endpoint for Azure Database for PostgreSQL.](../postgresql/concepts-data-access-and-security-private-link.md)      |
|  Azure Database for MySQL         | All public regions<br/> All Government regions<br/>All China regions      |  | GA <br/> [Learn how to create a private endpoint for Azure Database for MySQL.](../mysql/concepts-data-access-security-private-link.md)     |
|  Azure Database for MariaDB         | All public regions<br/> All Government regions<br/>All China regions     |  | GA <br/> [Learn how to create a private endpoint for Azure Database for MariaDB.](../mariadb/concepts-data-access-security-private-link.md)      |

### Integration

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|Azure Event Grid| All public regions<br/> All Government regions       |  | GA   <br/> [Learn how to create a private endpoint for Azure Event Grid.](../event-grid/network-security.md) |
|Azure Service Bus | All public region<br/>All Government regions  | Supported with premium tier of Azure Service Bus. [Select for tiers](../service-bus-messaging/service-bus-premium-messaging.md) | GA   <br/> [Learn how to create a private endpoint for Azure Service Bus.](../service-bus-messaging/private-link-service.md)    |

### Internet of Things (IoT)

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
| Azure IoT Hub | All public regions    |  | GA   <br/> [Learn how to create a private endpoint for Azure IoT Hub.](../iot-hub/virtual-network-support.md) |
|  Azure Digital Twins         | All public regions supported by Azure Digital Twins     |  | Preview <br/> [Learn how to create a private endpoint for Azure Digital Twins.](../digital-twins/how-to-enable-private-link-portal.md)      |

### Management and Governance

| Supported services | Available regions | Other considerations | Status  |
| ------------ | ----------------| ------------| ----------------|
| Azure Automation  | All public regions<br/> All Government regions |  | Preview </br> [Learn how to create a private endpoint for Azure Automation.](../automation/how-to/private-link-security.md)|
|Azure Backup | All public regions<br/> All Government regions   |  | GA <br/> [Learn how to create a private endpoint for Azure Backup.](../backup/private-endpoints.md)   |

### Security

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|  Azure Key Vault         | All public regions<br/> All Government regions      |  | GA   <br/> [Learn how to create a private endpoint for Azure Key Vault.](../key-vault/general/private-link-service.md)   |

### Storage
|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
| Azure Blob storage (including Data Lake Storage Gen2)       |  All public regions<br/> All Government regions       |  Supported on Account Kind General Purpose V2 | GA <br/> [Learn how to create a private endpoint for blob storage.](tutorial-private-endpoint-storage-portal.md)  |
| Azure Files | All public regions<br/> All Government regions      | |   GA <br/> [Learn how to create Azure Files network endpoints.](../storage/files/storage-files-networking-endpoints.md)   |
| Azure File Sync | All public regions      | |   GA <br/> [Learn how to create Azure Files network endpoints.](../storage/file-sync/file-sync-networking-endpoints.md)   |
| Azure Queue storage       |  All public regions<br/> All Government regions       |  Supported on Account Kind General Purpose V2 | GA <br/> [Learn how to create a private endpoint for queue storage.](tutorial-private-endpoint-storage-portal.md) |
| Azure Table storage       |  All public regions<br/> All Government regions       |  Supported on Account Kind General Purpose V2 | GA <br/> [Learn how to create a private endpoint for table storage.](tutorial-private-endpoint-storage-portal.md)  |
| Azure Batch | All public regions except: Germany CENTRAL, Germany NORTHEAST <br/> All Government regions  | | GA <br/> [Learn how to create a private endpoint for Azure Batch.](../batch/private-connectivity.md) |

### Web
|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
| Azure SignalR | EAST US, SOUTH CENTRAL US,<br/>WEST US 2, All China regions      |  | Preview   <br/> [Learn how to create a private endpoint for Azure SignalR.](../azure-signalr/howto-private-endpoints.md)   |
|Azure Web Apps | All public regions<br/> China North 2 & East 2    | Supported with PremiumV2, PremiumV3, or Function Premium plan  | GA   <br/> [Learn how to create a private endpoint for Azure Web Apps.](./tutorial-private-endpoint-webapp-portal.md)   |
|Azure Search | All public regions <br/> All Government regions | Supported with service in Private Mode | GA   <br/> [Learn how to create a private endpoint for Azure Search.](../search/service-create-private-endpoint.md)    |
|Azure Relay | All public regions      |  | Preview <br/> [Learn how to create a private endpoint for Azure Relay.](../azure-relay/private-link-service.md)  |

### Private Link service with a standard load balancer

|Supported services  |Available regions | Other considerations | Status  |
|:-------------------|:-----------------|:----------------|:--------|
|Private Link services behind standard Azure Load Balancer | All public regions<br/> All Government regions<br/>All China regions  | Supported on Standard Load Balancer | GA <br/> [Learn how to create a private link service.](create-private-link-service-portal.md) |

## Next steps

Learn more about Azure Private Link service:
- [What is Azure Private Link?](private-link-overview.md)
- [Create a Private Endpoint using the Azure portal](create-private-endpoint-portal.md)
