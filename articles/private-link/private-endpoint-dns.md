---
title: Azure Private Endpoint private DNS zone values
description: Learn about the private DNS zone values for Azure services that support private endpoints.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: concept-article
ms.date: 11/15/2023

#CustomerIntent: As a network administrator, I want to configure the private DNS zone values for Azure services that support private endpoints.
---

# Azure Private Endpoint private DNS zone values

It's important to correctly configure your DNS settings to resolve the private endpoint IP address to the fully qualified domain name (FQDN) of the connection string.

Existing Microsoft Azure services might already have a DNS configuration for a public endpoint. This configuration must be overridden to connect using your private endpoint.

The network interface associated with the private endpoint contains the information to configure your DNS. The network interface information includes FQDN and private IP addresses for your private link resource.

You can use the following options to configure your DNS settings for private endpoints:

- **Use the host file (only recommended for testing)**. You can use the host file on a virtual machine to override the DNS.

- **Use a private DNS zone**. You can use [private DNS zones](../dns/private-dns-privatednszone.md) to override the DNS resolution for a private endpoint. A private DNS zone can be linked to your virtual network to resolve specific domains.

- **Use Azure Private Resolver (optional)**. You can use Azure Private Resolver to override the DNS resolution for a private link resource. For more information about Azure Private Resolver, see [What is Azure Private Resolver?](../dns/dns-private-resolver-overview.md).

> [!CAUTION]
> - It's not recommended to override a zone that's actively in use to resolve public endpoints. Connections to resources won't be able to resolve correctly without DNS forwarding to the public DNS. To avoid issues, create a different domain name or follow the suggested name for each service listed later in this article.
> 
> - Existing Private DNS Zones linked to a single Azure service should not be associated with two different Azure service Private Endpoints. This will cause a deletion of the initial A-record and result in resolution issue when attempting to access that service from each respective Private Endpoint. Create a DNS zone for each Private Endpoint of like services. Don't place records for multiple services in the same DNS zone.

## Azure services DNS zone configuration

Azure creates a canonical name DNS record (CNAME) on the public DNS. The CNAME record redirects the resolution to the private domain name. You can override the resolution with the private IP address of your private endpoints.

Connection URLs for your existing applications don't change. Client DNS requests to a public DNS server resolve to your private endpoints. The process doesn't affect your existing applications.

> [!IMPORTANT]
> Azure File Shares must be remounted if connected to the public endpoint.

> [!CAUTION]
> * Private networks already using the private DNS zone for a given type, can only connect to public resources if they don't have any private endpoint connections, otherwise a corresponding DNS configuration is required on the private DNS zone in order to complete the DNS resolution sequence. The corresponding DNS configuration is a manually entered A-record that points to the public IP address of the resource. This procedure isn't recommended as the IP address of the A record won't be automatically updated if the corresponding public IP address changes.
>
> * Private endpoint private DNS zone configurations will only automatically generate if you use the recommended naming scheme in the following tables.

For Azure services, use the recommended zone names as described in the following tables:

## Commercial

### AI + Machine Learning

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Machine Learning (Microsoft.MachineLearningServices/workspaces) | amlworkspace | privatelink.api.azureml.ms<br/>privatelink.notebooks.azure.net | api.azureml.ms<br/>notebooks.azure.net<br/>instances.azureml.ms<br/>aznbcontent.net<br/>inference.ml.azure.com |
>| Azure AI services (Microsoft.CognitiveServices/accounts) | account | privatelink.cognitiveservices.azure.com <br/> privatelink.openai.azure.com | cognitiveservices.azure.com <br/> openai.azure.com |
>| Azure Bot Service (Microsoft.BotService/botServices) | Bot | privatelink.directline.botframework.com | directline.botframework.com |
>| Azure Bot Service (Microsoft.BotService/botServices) | Token | privatelink.token.botframework.com | token.botframework.com |

### Analytics

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Synapse Analytics (Microsoft.Synapse/workspaces) | Sql | privatelink.sql.azuresynapse.net | sql.azuresynapse.net |
>| Azure Synapse Analytics (Microsoft.Synapse/workspaces) | SqlOnDemand | privatelink.sql.azuresynapse.net | sql.azuresynapse.net |
>| Azure Synapse Analytics (Microsoft.Synapse/workspaces) | Dev | privatelink.dev.azuresynapse.net | dev.azuresynapse.net |
>| Azure Synapse Studio (Microsoft.Synapse/privateLinkHubs) | Web | privatelink.azuresynapse.net | azuresynapse.net |
>| Azure Event Hubs (Microsoft.EventHub/namespaces) | namespace | privatelink.servicebus.windows.net | servicebus.windows.net |
>| Azure Service Bus (Microsoft.ServiceBus/namespaces) | namespace | privatelink.servicebus.windows.net | servicebus.windows.net |
>| Azure Data Factory (Microsoft.DataFactory/factories) | dataFactory | privatelink.datafactory.azure.net | datafactory.azure.net |
>| Azure Data Factory (Microsoft.DataFactory/factories) | portal | privatelink.adf.azure.com | adf.azure.com |
>| Azure HDInsight (Microsoft.HDInsight/clusters) | N/A | privatelink.azurehdinsight.net | azurehdinsight.net |
>| Azure Data Explorer (Microsoft.Kusto/Clusters) | cluster | privatelink.{regionName}.kusto.windows.net </br> privatelink.blob.core.windows.net </br> privatelink.queue.core.windows.net </br> privatelink.table.core.windows.net | {regionName}.kusto.windows.net </br> blob.core.windows.net </br> queue.core.windows.net </br> table.core.windows.net |
>| Microsoft Power BI (Microsoft.PowerBI/privateLinkServicesForPowerBI) | tenant | privatelink.analysis.windows.net </br> privatelink.pbidedicated.windows.net </br> privatelink.tip1.powerquery.microsoft.com | analysis.windows.net </br> pbidedicated.windows.net </br> tip1.powerquery.microsoft.com |
>| Azure Databricks (Microsoft.Databricks/workspaces) | databricks_ui_api </br> browser_authentication | privatelink.azuredatabricks.net | azuredatabricks.net |

### Compute

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Batch (Microsoft.Batch/batchAccounts) | batchAccount | {regionName}.privatelink.batch.azure.com | {regionName}.batch.azure.com |
>| Azure Batch (Microsoft.Batch/batchAccounts) | nodeManagement | {regionName}.service.privatelink.batch.azure.com | {regionName}.service.batch.azure.com |
>| Azure Virtual Desktop (Microsoft.DesktopVirtualization/workspaces) | global | privatelink-global.wvd.microsoft.com | wvd.microsoft.com |
>| Azure Virtual Desktop (Microsoft.DesktopVirtualization/workspaces) | feed | privatelink.wvd.microsoft.com | wvd.microsoft.com |
>| Azure Virtual Desktop (Microsoft.DesktopVirtualization/hostpools) | connection | privatelink.wvd.microsoft.com | wvd.microsoft.com |

### Containers

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Kubernetes Service - Kubernetes API (Microsoft.ContainerService/managedClusters) | management | privatelink.{regionName}.azmk8s.io </br> {subzone}.privatelink.{regionName}.azmk8s.io | {regionName}.azmk8s.io |
>| Azure Container Registry (Microsoft.ContainerRegistry/registries) | registry | privatelink.azurecr.io </br> {regionName}.data.privatelink.azurecr.io | azurecr.io </br> {regionName}.data.azurecr.io |

### Databases

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure SQL Database (Microsoft.Sql/servers) | sqlServer | privatelink.database.windows.net | database.windows.net |
>| Azure SQL Managed Instance (Microsoft.Sql/managedInstances) | managedInstance | privatelink.{dnsPrefix}.database.windows.net | {instanceName}.{dnsPrefix}.database.windows.net |
>| Azure Cosmos DB (Microsoft.DocumentDB/databaseAccounts) | Sql | privatelink.documents.azure.com | documents.azure.com |
>| Azure Cosmos DB (Microsoft.DocumentDB/databaseAccounts) | MongoDB | privatelink.mongo.cosmos.azure.com | mongo.cosmos.azure.com |
>| Azure Cosmos DB (Microsoft.DocumentDB/databaseAccounts) | Cassandra | privatelink.cassandra.cosmos.azure.com | cassandra.cosmos.azure.com |
>| Azure Cosmos DB (Microsoft.DocumentDB/databaseAccounts) | Gremlin | privatelink.gremlin.cosmos.azure.com | gremlin.cosmos.azure.com |
>| Azure Cosmos DB (Microsoft.DocumentDB/databaseAccounts) | Table | privatelink.table.cosmos.azure.com | table.cosmos.azure.com |
>| Azure Cosmos DB (Microsoft.DBforPostgreSQL/serverGroupsv2) | coordinator | privatelink.postgres.cosmos.azure.com | postgres.cosmos.azure.com |
>| Azure Database for PostgreSQL - Single server (Microsoft.DBforPostgreSQL/servers) | postgresqlServer | privatelink.postgres.database.azure.com | postgres.database.azure.com |
>| Azure Database for MySQL - Single Server (Microsoft.DBforMySQL/servers) | mysqlServer | privatelink.mysql.database.azure.com | mysql.database.azure.com |
>| Azure Database for MySQL - Flexible Server (Microsoft.DBforMySQL/flexibleServers) | mysqlServer | privatelink.mysql.database.azure.com | mysql.database.azure.com |
>| Azure Database for MariaDB (Microsoft.DBforMariaDB/servers) | mariadbServer | privatelink.mariadb.database.azure.com | mariadb.database.azure.com |
>| Azure Cache for Redis (Microsoft.Cache/Redis) | redisCache | privatelink.redis.cache.windows.net | redis.cache.windows.net |
>| Azure Cache for Redis Enterprise (Microsoft.Cache/RedisEnterprise) | redisEnterprise | privatelink.redisenterprise.cache.azure.net | redisenterprise.cache.azure.net |

### Hybrid + multicloud

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Arc (Microsoft.HybridCompute/privateLinkScopes) | hybridcompute | privatelink.his.arc.azure.com <br/> privatelink.guestconfiguration.azure.com </br> privatelink.dp.kubernetesconfiguration.azure.com | his.arc.azure.com <br/> guestconfiguration.azure.com </br> dp.kubernetesconfiguration.azure.com |

### Integration

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Service Bus (Microsoft.ServiceBus/namespaces) | namespace | privatelink.servicebus.windows.net | servicebus.windows.net |
>| Azure Event Grid (Microsoft.EventGrid/topics) | topic | privatelink.eventgrid.azure.net | eventgrid.azure.net |
>| Azure Event Grid (Microsoft.EventGrid/domains) | domain | privatelink.eventgrid.azure.net | eventgrid.azure.net |
>| Azure API Management (Microsoft.ApiManagement/service) | gateway | privatelink.azure-api.net | azure-api.net |
>| Azure Health Data Services (Microsoft.HealthcareApis/workspaces) | healthcareworkspace | privatelink.workspace.azurehealthcareapis.com </br> privatelink.fhir.azurehealthcareapis.com </br> privatelink.dicom.azurehealthcareapis.com | workspace.azurehealthcareapis.com </br> fhir.azurehealthcareapis.com </br> dicom.azurehealthcareapis.com |

### Internet of Things (IoT)

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure IoT Hub (Microsoft.Devices/IotHubs) | iotHub | privatelink.azure-devices.net<br/>privatelink.servicebus.windows.net<sup>1</sup> | azure-devices.net<br/>servicebus.windows.net |
>| Azure IoT Hub Device Provisioning Service (Microsoft.Devices/ProvisioningServices) | iotDps | privatelink.azure-devices-provisioning.net | azure-devices-provisioning.net |
>| Azure Digital Twins (Microsoft.DigitalTwins/digitalTwinsInstances) | API | privatelink.digitaltwins.azure.net | digitaltwins.azure.net |

### Media

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Media Services (Microsoft.Media/mediaservices) | keydelivery </br> liveevent </br> streamingendpoint | privatelink.media.azure.net | media.azure.net |

### Management and Governance

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Automation (Microsoft.Automation/automationAccounts) | Webhook <br> DSCAndHybridWorker | privatelink.azure-automation.net | {regionCode}.azure-automation.net |
>| Azure Backup (Microsoft.RecoveryServices/vaults) | AzureBackup | privatelink.{regionCode}.backup.windowsazure.com | {regionCode}.backup.windowsazure.com |
>| Azure Site Recovery (Microsoft.RecoveryServices/vaults) | AzureSiteRecovery | privatelink.siterecovery.windowsazure.com | {regionCode}.siterecovery.windowsazure.com |
>| Azure Monitor (Microsoft.Insights/privateLinkScopes) | azuremonitor | privatelink.monitor.azure.com<br/> privatelink.oms.opinsights.azure.com <br/> privatelink.ods.opinsights.azure.com <br/> privatelink.agentsvc.azure-automation.net <br/> privatelink.blob.core.windows.net | monitor.azure.com<br/> oms.opinsights.azure.com<br/> ods.opinsights.azure.com<br/> agentsvc.azure-automation.net <br/> blob.core.windows.net |
>| Microsoft Purview (Microsoft.Purview/accounts) | account | privatelink.purview.azure.com | purview.azure.com |
>| Microsoft Purview (Microsoft.Purview/accounts) | portal | privatelink.purviewstudio.azure.com | purviewstudio.azure.com |
>| Azure Migrate (Microsoft.Migrate/migrateProjects) | Default | privatelink.prod.migration.windowsazure.com | prod.migration.windowsazure.com |
>| Azure Migrate (Microsoft.Migrate/assessmentProjects) | Default | privatelink.prod.migration.windowsazure.com | prod.migration.windowsazure.com |
>| Azure Resource Manager (Microsoft.Authorization/resourceManagementPrivateLinks) | ResourceManagement | privatelink.azure.com | azure.com |

### Security

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Key Vault (Microsoft.KeyVault/vaults) | vault | privatelink.vaultcore.azure.net | vault.azure.net <br> vaultcore.azure.net |
>| Azure Key Vault (Microsoft.KeyVault/managedHSMs) | managedhsm | privatelink.managedhsm.azure.net | managedhsm.azure.net 
>| Azure App Configuration (Microsoft.AppConfiguration/configurationStores) | configurationStores | privatelink.azconfig.io | azconfig.io |

### Storage

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Storage account (Microsoft.Storage/storageAccounts) | blob </br> blob_secondary | privatelink.blob.core.windows.net | blob.core.windows.net |
>| Storage account (Microsoft.Storage/storageAccounts) | table </br> table_secondary | privatelink.table.core.windows.net | table.core.windows.net |
>| Storage account (Microsoft.Storage/storageAccounts) | queue </br> queue_secondary | privatelink.queue.core.windows.net | queue.core.windows.net |
>| Storage account (Microsoft.Storage/storageAccounts) | file | privatelink.file.core.windows.net | file.core.windows.net |
>| Storage account (Microsoft.Storage/storageAccounts) | web </br> web_secondary | privatelink.web.core.windows.net | web.core.windows.net |
>| Azure Data Lake File System Gen2 (Microsoft.Storage/storageAccounts) | dfs </br> dfs_secondary | privatelink.dfs.core.windows.net | dfs.core.windows.net |
>| Azure File Sync (Microsoft.StorageSync/storageSyncServices) | afs | privatelink.afs.azure.net | afs.azure.net |
>| Azure Managed Disks (Microsoft.Compute/diskAccesses) | disks | privatelink.blob.core.windows.net | privatelink.blob.core.windows.net |

### Web

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Search (Microsoft.Search/searchServices) | searchService | privatelink.search.windows.net | search.windows.net |
>| Azure Relay (Microsoft.Relay/namespaces) | namespace | privatelink.servicebus.windows.net | servicebus.windows.net |
>| Azure Web Apps - Azure Function Apps (Microsoft.Web/sites) | sites | privatelink.azurewebsites.net </br> scm.privatelink.azurewebsites.net | azurewebsites.net </br> scm.azurewebsites.net |
>| SignalR (Microsoft.SignalRService/SignalR) | signalR | privatelink.service.signalr.net | service.signalr.net |
>| Azure Static Web Apps (Microsoft.Web/staticSites) | staticSites | privatelink.azurestaticapps.net </br> privatelink.{partitionId}.azurestaticapps.net | azurestaticapps.net </br> {partitionId}.azurestaticapps.net |
>| Azure Event Hubs (Microsoft.EventHub/namespaces) | namespace | privatelink.servicebus.windows.net | servicebus.windows.net |

<sup>1</sup>To use with IoT Hub's built-in Event Hub compatible endpoint. To learn more, see [private link support for IoT Hub's built-in endpoint](../iot-hub/virtual-network-support.md#built-in-event-hubs-compatible-endpoint)

>[!Note]
>In the above text, **`{regionCode}`** refers to the region code (for example, **eus** for East US and **ne** for North Europe). Refer to the following lists for regions codes:
>
> - [All public clouds](https://download.microsoft.com/download/1/2/6/126a410b-0e06-45ed-b2df-84f353034fa1/AzureRegionCodesList.docx)
> - [Geo Code list in XML](/azure/backup/scripts/geo-code-list)
>
> **`{regionName}`** refers to the full region name (for example, **eastus** for East US and **northeurope** for North Europe). To retrieve a current list of Azure regions and their names and display names, use **`az account list-locations -o table`**.

## Government

### AI + Machine Learning

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure AI services (Microsoft.CognitiveServices/accounts) | account | privatelink.cognitiveservices.azure.us | cognitiveservices.azure.us |
>| Azure Machine Learning (Microsoft.MachineLearningServices/workspaces) | amlworkspace | privatelink.api.ml.azure.us<br/>privatelink.notebooks.usgovcloudapi.net | api.ml.azure.us<br/>notebooks.usgovcloudapi.net <br/> instances.azureml.us<br/>aznbcontent.net <br/> inference.ml.azure.us |

### Analytics

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Event Hubs (Microsoft.EventHub/namespaces) | namespace | privatelink.servicebus.usgovcloudapi.net | servicebus.usgovcloudapi.net |
>| Azure Synapse Analytics (Microsoft.Synapse/workspaces) | Sql | privatelink.sql.azuresynapse.usgovcloudapi.net | sql.azuresynapse.usgovcloudapi.net |
>| Azure Synapse Analytics (Microsoft.Synapse/workspaces) | SqlOnDemand | privatelink.sql.azuresynapse.usgovcloudapi.net | {workspaceName}-ondemand.sql.azuresynapse.usgovcloudapi.net |
>| Azure Synapse Analytics (Microsoft.Synapse/workspaces) | Dev | privatelink.dev.azuresynapse.usgovcloudapi.net | dev.azuresynapse.usgovcloudapi.net |
>| Azure Synapse Studio (Microsoft.Synapse/privateLinkHubs) | Web | privatelink.azuresynapse.usgovcloudapi.net | azuresynapse.usgovcloudapi.net |
>| Azure Data Factory (Microsoft.DataFactory/factories) | dataFactory | privatelink.datafactory.azure.us | datafactory.azure.us |
>| Azure Data Factory (Microsoft.DataFactory/factories) | portal | privatelink.adf.azure.us | adf.azure.us |
>| Azure HDInsight (Microsoft.HDInsight) | N/A | privatelink.azurehdinsight.us | azurehdinsight.us |
>| Azure Databricks (Microsoft.Databricks/workspaces) | databricks_ui_api </br> browser_authentication | privatelink.databricks.azure.us | databricks.azure.us |

### Compute

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Batch (Microsoft.Batch/batchAccounts) | batchAccount | privatelink.batch.usgovcloudapi.net | {regionName}.batch.usgovcloudapi.net |
>| Azure Batch (Microsoft.Batch/batchAccounts) | nodeManagement | privatelink.batch.usgovcloudapi.net | {regionName}.service.batch.usgovcloudapi.net |
>| Azure Virtual Desktop (Microsoft.DesktopVirtualization/workspaces) | global | privatelink-global.wvd.azure.us | wvd.azure.us |
>| Azure Virtual Desktop (Microsoft.DesktopVirtualization/workspaces </br> Microsoft.DesktopVirtualization/hostpools) | feed <br> connection | privatelink.wvd.azure.us | wvd.azure.us |

### Containers

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Container Registry (Microsoft.ContainerRegistry/registries) | registry | privatelink.azurecr.us </br> {regionName}.privatelink.azurecr.us | azurecr.us </br> {regionName}.azurecr.us |

### Databases

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure SQL Database (Microsoft.Sql/servers) | sqlServer | privatelink.database.usgovcloudapi.net | database.usgovcloudapi.net |
>| Azure SQL Managed Instance (Microsoft.Sql/managedInstances) | managedInstance | privatelink.{dnsPrefix}.database.usgovcloudapi.net | {instanceName}.{dnsPrefix}.database.usgovcloudapi.net |
>| Azure Cosmos DB (Microsoft.DocumentDB/databaseAccounts) | Sql | privatelink.documents.azure.us | documents.azure.us |
>| Azure Cosmos DB (Microsoft.DocumentDB/databaseAccounts) | MongoDB | privatelink.mongo.cosmos.azure.us | mongo.cosmos.azure.us |
>| Azure Database for PostgreSQL - Single server (Microsoft.DBforPostgreSQL/servers) | postgresqlServer | privatelink.postgres.database.usgovcloudapi.net | postgres.database.usgovcloudapi.net |
>| Azure Database for MySQL - Single Server (Microsoft.DBforMySQL/servers) | mysqlServer | privatelink.mysql.database.usgovcloudapi.net | mysql.database.usgovcloudapi.net |
>| Azure Database for MySQL - Flexible Server (Microsoft.DBforMySQL/flexibleServers) | mysqlServer | privatelink.mysql.database.usgovcloudapi.net | mysql.database.usgovcloudapi.net |
>| Azure Database for MariaDB (Microsoft.DBforMariaDB/servers) | mariadbServer | privatelink.mariadb.database.usgovcloudapi.net| mariadb.database.usgovcloudapi.net |
>| Azure Cache for Redis (Microsoft.Cache/Redis) | redisCache | privatelink.redis.cache.usgovcloudapi.net | redis.cache.usgovcloudapi.net |

### Hybrid + multicloud

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|

### Integration

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Service Bus (Microsoft.ServiceBus/namespaces) | namespace | privatelink.servicebus.usgovcloudapi.net | servicebus.usgovcloudapi.net |
>| Azure Event Grid (Microsoft.EventGrid/topics) | topic | privatelink.eventgrid.azure.us | eventgrid.azure.us |
>| Azure Event Grid (Microsoft.EventGrid/domains) | domain | privatelink.eventgrid.azure.us | eventgrid.azure.us |
>| Azure Health Data Services (Microsoft.HealthcareApis/workspaces) | healthcareworkspace | privatelink.workspace.azurehealthcareapis.us </br> privatelink.fhir.azurehealthcareapis.us </br> privatelink.dicom.azurehealthcareapis.us | workspace.azurehealthcareapis.us </br> fhir.azurehealthcareapis.us </br> dicom.azurehealthcareapis.us |

### Internet of Things (IoT)

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure IoT Hub (Microsoft.Devices/IotHubs) | iotHub | privatelink.azure-devices.us<br/>privatelink.servicebus.windows.us<sup>1</sup> | azure-devices.us<br/>servicebus.usgovcloudapi.net |
>| Azure IoT Hub Device Provisioning Service (Microsoft.Devices/ProvisioningServices) | iotDps | privatelink.azure-devices-provisioning.us | azure-devices-provisioning.us |

### Media

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|

### Management and Governance

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Automation / (Microsoft.Automation/automationAccounts) | Webhook </br> DSCAndHybridWorker | privatelink.azure-automation.us | azure-automation.us |
>| Azure Backup (Microsoft.RecoveryServices/vaults) | AzureBackup | privatelink.{regionCode}.backup.windowsazure.us | {regionCode}.backup.windowsazure.us |
>| Azure Site Recovery (Microsoft.RecoveryServices/vaults) | AzureSiteRecovery | privatelink.siterecovery.windowsazure.us | {regionCode}.siterecovery.windowsazure.us |
>| Azure Monitor (Microsoft.Insights/privateLinkScopes) | azuremonitor | privatelink.monitor.azure.us <br/> privatelink.adx.monitor.azure.us <br/> privatelink.oms.opinsights.azure.us <br/> privatelink.ods.opinsights.azure.us <br/> privatelink.agentsvc.azure-automation.us <br/> privatelink.blob.core.usgovcloudapi.net | monitor.azure.us <br/> adx.monitor.azure.us <br/> oms.opinsights.azure.us<br/> ods.opinsights.azure.us<br/> agentsvc.azure-automation.us <br/> blob.core.usgovcloudapi.net |
>| Microsoft Purview (Microsoft.Purview) | account | privatelink.purview.azure.us | purview.azure.us |
>| Microsoft Purview (Microsoft.Purview) | portal | privatelink.purviewstudio.azure.us | purview.azure.com </br> purviewstudio.azure.us |

### Security

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Key Vault (Microsoft.KeyVault/vaults) | vault | privatelink.vaultcore.usgovcloudapi.net | vault.usgovcloudapi.net <br> vaultcore.usgovcloudapi.net |
>| Azure App Configuration (Microsoft.AppConfiguration/configurationStores) | configurationStores | privatelink.azconfig.azure.us | azconfig.azure.us |

### Storage

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Storage account (Microsoft.Storage/storageAccounts) | blob </br> blob_secondary | privatelink.blob.core.usgovcloudapi.net | blob.core.usgovcloudapi.net |
>| Storage account (Microsoft.Storage/storageAccounts) | table </br> table_secondary | privatelink.table.core.usgovcloudapi.net | table.core.usgovcloudapi.net |
>| Storage account (Microsoft.Storage/storageAccounts) | queue </br> queue_secondary | privatelink.queue.core.usgovcloudapi.net | queue.core.usgovcloudapi.net |
>| Storage account (Microsoft.Storage/storageAccounts) | file </br> file_secondary | privatelink.file.core.usgovcloudapi.net | file.core.usgovcloudapi.net |
>| Storage account (Microsoft.Storage/storageAccounts) | web </br> web_secondary | privatelink.web.core.usgovcloudapi.net | web.core.usgovcloudapi.net |
>| Azure Data Lake File System Gen2 (Microsoft.Storage/storageAccounts) | dfs </br> dfs_secondary | privatelink.dfs.core.usgovcloudapi.net | dfs.core.usgovcloudapi.net |

### Web

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Search (Microsoft.Search/searchServices) | searchService | privatelink.search.windows.us | search.windows.us |
>| Azure Relay (Microsoft.Relay/namespaces) | namespace | privatelink.servicebus.usgovcloudapi.net | servicebus.usgovcloudapi.net |
>| Azure Web Apps (Microsoft.Web/sites) | sites | privatelink.azurewebsites.us </br> scm.privatelink.azurewebsites.us | azurewebsites.us </br> scm.azurewebsites.us |
>| Azure Event Hubs (Microsoft.EventHub/namespaces) | namespace | privatelink.servicebus.usgovcloudapi.net | servicebus.usgovcloudapi.net | 

>[!Note]
>In the above text, `{regionCode}` refers to the region code (for example, **eus** for East US and **ne** for North Europe). Refer to the following lists for regions codes:
>- [US Gov](../azure-government/documentation-government-developer-guide.md)
>- [Geo Code list in XML](/azure/backup/scripts/geo-code-list)
>
> **`{regionName}`** refers to the full region name (for example, **eastus** for East US and **northeurope** for North Europe). To retrieve a current list of Azure regions and their names and display names, use **`az account list-locations -o table`**.

## China

### AI + Machine Learning

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Machine Learning (Microsoft.MachineLearningServices/workspaces) | amlworkspace | privatelink.api.ml.azure.cn<br/>privatelink.notebooks.chinacloudapi.cn | api.ml.azure.cn<br/>notebooks.chinacloudapi.cn <br/> instances.azureml.cn <br/> aznbcontent.net <br/> inference.ml.azure.cn |

### Analytics

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Data Factory (Microsoft.DataFactory/factories) | dataFactory | privatelink.datafactory.azure.cn | datafactory.azure.cn |
>| Azure Data Factory (Microsoft.DataFactory/factories) | portal | privatelink.adf.azure.cn | adf.azure.cn |
>| Azure HDInsight (Microsoft.HDInsight) | N/A | privatelink.azurehdinsight.cn | azurehdinsight.cn |
>| Azure Data Explorer (Microsoft.Kusto/Clusters) | cluster | privatelink.{regionName}.kusto.windows.cn | {regionName}.kusto.windows.cn |

### Compute

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Batch (Microsoft.Batch/batchAccounts) | batchAccount | privatelink.batch.chinacloudapi.cn | {region}.batch.chinacloudapi.cn |
>| Azure Batch (Microsoft.Batch/batchAccounts) | nodeManagement | privatelink.batch.chinacloudapi.cn | {region}.service.batch.chinacloudapi.cn |
>| Azure Virtual Desktop (Microsoft.DesktopVirtualization/workspaces) | global | privatelink-global.wvd.azure.cn | wvd.azure.cn |
>| Azure Virtual Desktop (Microsoft.DesktopVirtualization/workspaces and Microsoft.DesktopVirtualization/hostpools) | feed </br> connection | privatelink.wvd.azure.cn | wvd.azure.cn |

### Containers

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|

### Databases

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure SQL Database (Microsoft.Sql/servers) | sqlServer | privatelink.database.chinacloudapi.cn | database.chinacloudapi.cn |
>| Azure Cosmos DB (Microsoft.DocumentDB/databaseAccounts) | Sql | privatelink.documents.azure.cn | documents.azure.cn |
>| Azure Cosmos DB (Microsoft.DocumentDB/databaseAccounts) | MongoDB | privatelink.mongo.cosmos.azure.cn | mongo.cosmos.azure.cn |
>| Azure Cosmos DB (Microsoft.DocumentDB/databaseAccounts) | Cassandra | privatelink.cassandra.cosmos.azure.cn | cassandra.cosmos.azure.cn |
>| Azure Cosmos DB (Microsoft.DocumentDB/databaseAccounts) | Gremlin | privatelink.gremlin.cosmos.azure.cn | gremlin.cosmos.azure.cn |
>| Azure Cosmos DB (Microsoft.DocumentDB/databaseAccounts) | Table | privatelink.table.cosmos.azure.cn | table.cosmos.azure.cn |
>| Azure Database for PostgreSQL - Single server (Microsoft.DBforPostgreSQL/servers) | postgresqlServer | privatelink.postgres.database.chinacloudapi.cn | postgres.database.chinacloudapi.cn |
>| Azure Database for MySQL - Single Server (Microsoft.DBforMySQL/servers) | mysqlServer | privatelink.mysql.database.chinacloudapi.cn | mysql.database.chinacloudapi.cn |
>| Azure Database for MySQL - Flexible Server (Microsoft.DBforMySQL/flexibleServers) | mysqlServer | privatelink.mysql.database.chinacloudapi.cn | mysql.database.chinacloudapi.cn |
>| Azure Database for MariaDB (Microsoft.DBforMariaDB/servers) | mariadbServer | privatelink.mariadb.database.chinacloudapi.cn | mariadb.database.chinacloudapi.cn |
>| Azure Cache for Redis (Microsoft.Cache/Redis) | redisCache | privatelink.redis.cache.chinacloudapi.cn | redis.cache.chinacloudapi.cn |

### Hybrid + multicloud

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|

### Integration

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Service Bus (Microsoft.ServiceBus/namespaces) | namespace | privatelink.servicebus.chinacloudapi.cn | servicebus.chinacloudapi.cn |

### Internet of Things (IoT)

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure IoT Hub (Microsoft.Devices/IotHubs) | iotHub | privatelink.azure-devices.cn <br/> privatelink.servicebus.chinacloudapi.cn <sup>1</sup> | azure-devices.cn<br/>servicebus.chinacloudapi.cn |
>| Azure IoT Hub Device Provisioning Service (Microsoft.Devices/ProvisioningServices) | iotDps | privatelink.azure-devices-provisioning.cn | azure-devices-provisioning.cn |

### Media

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|

### Management and Governance

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Automation / (Microsoft.Automation/automationAccounts) | Webhook </br> DSCAndHybridWorker | privatelink.azure-automation.cn | azure-automation.cn |

### Security

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Key Vault (Microsoft.KeyVault/vaults) | vault | privatelink.vaultcore.azure.cn | vaultcore.azure.cn |

### Storage

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Storage account (Microsoft.Storage/storageAccounts) | blob </br> blob_secondary | privatelink.blob.core.chinacloudapi.cn | blob.core.chinacloudapi.cn |
>| Storage account (Microsoft.Storage/storageAccounts) | table </br> table_secondary | privatelink.table.core.chinacloudapi.cn | table.core.chinacloudapi.cn |
>| Storage account (Microsoft.Storage/storageAccounts) | queue </br> queue_secondary | privatelink.queue.core.chinacloudapi.cn | queue.core.chinacloudapi.cn |
>| Storage account (Microsoft.Storage/storageAccounts) | file </br> file_secondary | privatelink.file.core.chinacloudapi.cn | file.core.chinacloudapi.cn |
>| Storage account (Microsoft.Storage/storageAccounts) | web </br> web_secondary | privatelink.web.core.chinacloudapi.cn | web.core.chinacloudapi.cn |
>| Azure Data Lake File System Gen2 (Microsoft.Storage/storageAccounts) | dfs </br> dfs_secondary | privatelink.dfs.core.chinacloudapi.cn | dfs.core.chinacloudapi.cn |
>| Azure File Sync (Microsoft.StorageSync/storageSyncServices) | afs | privatelink.afs.azure.cn | afs.azure.cn 

### Web

>[!div class="mx-tdBreakAll"]
>| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
>|---|---|---|---|
>| Azure Event Hubs (Microsoft.EventHub/namespaces) | namespace | privatelink.servicebus.chinacloudapi.cn | servicebus.chinacloudapi.cn |
>| Azure Relay (Microsoft.Relay/namespaces) | namespace | privatelink.servicebus.chinacloudapi.cn | servicebus.chinacloudapi.cn |
>| Azure Web Apps (Microsoft.Web/sites) | sites | privatelink.chinacloudsites.cn | chinacloudsites.cn |
>| SignalR (Microsoft.SignalRService/SignalR) | signalR | privatelink.signalr.azure.cn | service.signalr.azure.cn |

<sup>1</sup>To use with IoT Hub's built-in Event Hub compatible endpoint. To learn more, see [private link support for IoT Hub's built-in endpoint](../iot-hub/virtual-network-support.md#built-in-event-hubs-compatible-endpoint)

## Next step

To learn more about DNS integration and scenarios for Azure Private Link, continue to the following article:

> [!div class="nextstepaction"]
> [Azure Private Endpoint DNS ](private-endpoint-dns-integration.md)
