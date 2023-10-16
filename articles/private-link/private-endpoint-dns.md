---
title: Azure Private Endpoint DNS configuration
description: Learn about Azure Private Endpoint DNS configuration.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: conceptual
ms.date: 10/11/2023
ms.author: allensu
ms.custom: fasttrack-edit
---

# Azure Private Endpoint DNS configuration

It's important to correctly configure your DNS settings to resolve the private endpoint IP address to the fully qualified domain name (FQDN) of the connection string.

Existing Microsoft Azure services might already have a DNS configuration for a public endpoint. This configuration must be overridden to connect using your private endpoint.

The network interface associated with the private endpoint contains the information to configure your DNS. The network interface information includes FQDN and private IP addresses for your private link resource.

You can use the following options to configure your DNS settings for private endpoints:
- **Use the host file (only recommended for testing)**. You can use the host file on a virtual machine to override the DNS.
- **Use a private DNS zone**. You can use [private DNS zones](../dns/private-dns-privatednszone.md) to override the DNS resolution for a private endpoint. A private DNS zone can be linked to your virtual network to resolve specific domains.
- **Use your DNS forwarder (optional)**. You can use your DNS forwarder to override the DNS resolution for a private link resource. Create a DNS forwarding rule to use a private DNS zone on your [DNS server](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) hosted in a virtual network.

> [!IMPORTANT]
> It is not recommended to override a zone that's actively in use to resolve public endpoints. Connections to resources won't be able to resolve correctly without DNS forwarding to the public DNS. To avoid issues, create a different domain name or follow the suggested name for each service below.

> [!IMPORTANT]
> Existing Private DNS Zones linked to a single service should not be associated with two different Private Endpoints. This will cause a deletion of the initial A-record and result in resolution issue when attempting to access that service from each respective Private Endpoint. However, linking a Private DNS Zones with private endpoints associated with different services would not face this resolution constraint.

## Azure services DNS zone configuration

Azure creates a canonical name DNS record (CNAME) on the public DNS. The CNAME record redirects the resolution to the private domain name. You can override the resolution with the private IP address of your private endpoints.

Your applications don't need to change the connection URL. When resolving to a public DNS service, the DNS server will resolve to your private endpoints. The process doesn't affect your existing applications. However, the share will need to be remounted if it's currently mounted using the public endpoint.

> [!IMPORTANT]
> * Private networks already using the private DNS zone for a given type, can only connect to public resources if they don't have any private endpoint connections, otherwise a corresponding DNS configuration is required on the private DNS zone in order to complete the DNS resolution sequence.
> * Private endpoint private DNS zone configurations will only automatically generate if you use the recommended naming scheme in the following table.

For Azure services, use the recommended zone names as described in the following table:

| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
|---|---|---|---|
| Azure Automation (Microsoft.Automation/automationAccounts) | Webhook <br> DSCAndHybridWorker | privatelink.azure-automation.net | {regionCode}.azure-automation.net |
| Azure SQL Database (Microsoft.Sql/servers) | sqlServer | privatelink.database.windows.net | database.windows.net |
| Azure SQL Managed Instance (Microsoft.Sql/managedInstances) | managedInstance | privatelink.{dnsPrefix}.database.windows.net | {instanceName}.{dnsPrefix}.database.windows.net |
| Azure Synapse Analytics (Microsoft.Synapse/workspaces) | Sql  | privatelink.sql.azuresynapse.net | sql.azuresynapse.net |
| Azure Synapse Analytics (Microsoft.Synapse/workspaces) | SqlOnDemand  | privatelink.sql.azuresynapse.net | {workspaceName}-ondemand.sql.azuresynapse.net |
| Azure Synapse Analytics (Microsoft.Synapse/workspaces) | Dev  | privatelink.dev.azuresynapse.net | dev.azuresynapse.net |
| Azure Synapse Studio (Microsoft.Synapse/privateLinkHubs) | Web | privatelink.azuresynapse.net | azuresynapse.net |
| Storage account (Microsoft.Storage/storageAccounts) | blob </br> blob_secondary | privatelink.blob.core.windows.net | blob.core.windows.net |
| Storage account (Microsoft.Storage/storageAccounts) | table </br> table_secondary | privatelink.table.core.windows.net | table.core.windows.net |
| Storage account (Microsoft.Storage/storageAccounts) | queue </br> queue_secondary | privatelink.queue.core.windows.net | queue.core.windows.net |
| Storage account (Microsoft.Storage/storageAccounts) | file | privatelink.file.core.windows.net | file.core.windows.net |
| Storage account (Microsoft.Storage/storageAccounts) | web </br> web_secondary | privatelink.web.core.windows.net | web.core.windows.net |
| Azure Data Lake File System Gen2 (Microsoft.Storage/storageAccounts) | dfs </br> dfs_secondary | privatelink.dfs.core.windows.net | dfs.core.windows.net |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) | Sql | privatelink.documents.azure.com | documents.azure.com |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) | MongoDB | privatelink.mongo.cosmos.azure.com | mongo.cosmos.azure.com |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) | Cassandra | privatelink.cassandra.cosmos.azure.com | cassandra.cosmos.azure.com |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) | Gremlin | privatelink.gremlin.cosmos.azure.com | gremlin.cosmos.azure.com |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) | Table | privatelink.table.cosmos.azure.com | table.cosmos.azure.com |
| Azure Cosmos DB (Microsoft.DBforPostgreSQL/serverGroupsv2) | coordinator | privatelink.postgres.cosmos.azure.com | postgres.cosmos.azure.com |
| Azure Batch (Microsoft.Batch/batchAccounts) | batchAccount | {regionName}.privatelink.batch.azure.com | {regionName}.batch.azure.com |
| Azure Batch (Microsoft.Batch/batchAccounts) | nodeManagement | {regionName}.service.privatelink.batch.azure.com | {regionName}.service.batch.azure.com |
| Azure Database for PostgreSQL - Single server (Microsoft.DBforPostgreSQL/servers) | postgresqlServer | privatelink.postgres.database.azure.com | postgres.database.azure.com |
| Azure Database for MySQL (Microsoft.DBforMySQL/servers) | mysqlServer | privatelink.mysql.database.azure.com | mysql.database.azure.com |
| Azure Database for MariaDB (Microsoft.DBforMariaDB/servers) | mariadbServer | privatelink.mariadb.database.azure.com | mariadb.database.azure.com |
| Azure Key Vault (Microsoft.KeyVault/vaults) | vault | privatelink.vaultcore.azure.net | vault.azure.net <br> vaultcore.azure.net |
| Azure Key Vault (Microsoft.KeyVault/managedHSMs) | managedhsm | privatelink.managedhsm.azure.net | managedhsm.azure.net |
| Azure Kubernetes Service - Kubernetes API (Microsoft.ContainerService/managedClusters) | management | privatelink.{regionName}.azmk8s.io </br> {subzone}.privatelink.{regionName}.azmk8s.io | {regionName}.azmk8s.io |
| Azure Search (Microsoft.Search/searchServices) | searchService | privatelink.search.windows.net | search.windows.net |
| Azure Container Registry (Microsoft.ContainerRegistry/registries) | registry | privatelink.azurecr.io </br> {regionName}.privatelink.azurecr.io | azurecr.io </br> {regionName}.azurecr.io |
| Azure App Configuration (Microsoft.AppConfiguration/configurationStores) | configurationStores | privatelink.azconfig.io | azconfig.io |
| Azure Backup (Microsoft.RecoveryServices/vaults) | AzureBackup | privatelink.{regionCode}.backup.windowsazure.com | {regionCode}.backup.windowsazure.com |
| Azure Site Recovery (Microsoft.RecoveryServices/vaults) | AzureSiteRecovery | privatelink.siterecovery.windowsazure.com | {regionCode}.siterecovery.windowsazure.com |
| Azure Event Hubs (Microsoft.EventHub/namespaces) | namespace | privatelink.servicebus.windows.net | servicebus.windows.net |
| Azure Service Bus (Microsoft.ServiceBus/namespaces) | namespace | privatelink.servicebus.windows.net | servicebus.windows.net |
| Azure IoT Hub (Microsoft.Devices/IotHubs) | iotHub | privatelink.azure-devices.net<br/>privatelink.servicebus.windows.net<sup>1</sup> | azure-devices.net<br/>servicebus.windows.net |
| Azure IoT Hub Device Provisioning Service (Microsoft.Devices/ProvisioningServices) | iotDps | privatelink.azure-devices-provisioning.net | azure-devices-provisioning.net |
| Azure Relay (Microsoft.Relay/namespaces) | namespace | privatelink.servicebus.windows.net | servicebus.windows.net |
| Azure Event Grid (Microsoft.EventGrid/topics) | topic | privatelink.eventgrid.azure.net | eventgrid.azure.net |
| Azure Event Grid (Microsoft.EventGrid/domains) | domain | privatelink.eventgrid.azure.net | eventgrid.azure.net |
| Azure Web Apps - Azure Function Apps (Microsoft.Web/sites) | sites | privatelink.azurewebsites.net </br> scm.privatelink.azurewebsites.net | azurewebsites.net </br> scm.azurewebsites.net  |
| Azure Machine Learning (Microsoft.MachineLearningServices/workspaces) | amlworkspace | privatelink.api.azureml.ms<br/>privatelink.notebooks.azure.net | api.azureml.ms<br/>notebooks.azure.net<br/>instances.azureml.ms<br/>aznbcontent.net<br/>inference.ml.azure.com |
| SignalR (Microsoft.SignalRService/SignalR) | signalR | privatelink.service.signalr.net | service.signalr.net |
| Azure Monitor (Microsoft.Insights/privateLinkScopes) | azuremonitor | privatelink.monitor.azure.com<br/> privatelink.oms.opinsights.azure.com <br/> privatelink.ods.opinsights.azure.com <br/> privatelink.agentsvc.azure-automation.net <br/> privatelink.blob.core.windows.net | monitor.azure.com<br/> oms.opinsights.azure.com<br/> ods.opinsights.azure.com<br/> agentsvc.azure-automation.net <br/> blob.core.windows.net |
| Azure AI services (Microsoft.CognitiveServices/accounts) | account | privatelink.cognitiveservices.azure.com <br/> privatelink.openai.azure.com   | cognitiveservices.azure.com <br/> openai.azure.com  |
| Azure File Sync (Microsoft.StorageSync/storageSyncServices) | afs | {regionName}.privatelink.afs.azure.net  |  {regionName}.afs.azure.net  |
| Azure Data Factory (Microsoft.DataFactory/factories) | dataFactory |  privatelink.datafactory.azure.net  |  datafactory.azure.net  |
| Azure Data Factory (Microsoft.DataFactory/factories) | portal |  privatelink.adf.azure.com  |  adf.azure.com  |
| Azure Cache for Redis (Microsoft.Cache/Redis) | redisCache | privatelink.redis.cache.windows.net | redis.cache.windows.net |
| Azure Cache for Redis Enterprise (Microsoft.Cache/RedisEnterprise) | redisEnterprise | privatelink.redisenterprise.cache.azure.net | redisenterprise.cache.azure.net |
| Microsoft Purview (Microsoft.Purview) | account | privatelink.purview.azure.com | purview.azure.com |
| Microsoft Purview (Microsoft.Purview) | portal | privatelink.purviewstudio.azure.com | purview.azure.com </br> purviewstudio.azure.com |
| Azure Digital Twins (Microsoft.DigitalTwins) | digitalTwinsInstances | privatelink.digitaltwins.azure.net | digitaltwins.azure.net |
| Azure HDInsight (Microsoft.HDInsight/clusters) | N/A | privatelink.azurehdinsight.net | azurehdinsight.net |
| Azure Arc (Microsoft.HybridCompute) | hybridcompute | privatelink.his.arc.azure.com <br/> privatelink.guestconfiguration.azure.com </br> privatelink.dp.kubernetesconfiguration.azure.com | his.arc.azure.com <br/> guestconfiguration.azure.com </br> dp.kubernetesconfiguration.azure.com |
| Azure Media Services (Microsoft.Media) | keydelivery </br> liveevent </br> streamingendpoint | privatelink.media.azure.net | media.azure.net |
| Azure Data Explorer (Microsoft.Kusto/Clusters) | cluster | privatelink.{regionName}.kusto.windows.net | {regionName}.kusto.windows.net |
| Azure Static Web Apps (Microsoft.Web/staticSites) | staticSites | privatelink.azurestaticapps.net </br> privatelink.{partitionId}.azurestaticapps.net | azurestaticapps.net </br> {partitionId}.azurestaticapps.net |
| Azure Migrate (Microsoft.Migrate/migrateProjects) | Default | privatelink.prod.migration.windowsazure.com | prod.migration.windowsazure.com |
| Azure Migrate (Microsoft.Migrate/assessmentProjects) | Default | privatelink.prod.migration.windowsazure.com | prod.migration.windowsazure.com |
| Azure API Management (Microsoft.ApiManagement/service) | gateway | privatelink.azure-api.net  | azure-api.net  |
| Microsoft PowerBI (Microsoft.PowerBI/privateLinkServicesForPowerBI) | tenant | privatelink.analysis.windows.net </br> privatelink.pbidedicated.windows.net </br> privatelink.tip1.powerquery.microsoft.com | analysis.windows.net </br> pbidedicated.windows.net </br> tip1.powerquery.microsoft.com |
| Azure Bot Service (Microsoft.BotService/botServices) | Bot | privatelink.directline.botframework.com | directline.botframework.com </br> europe.directline.botframework.com |
| Azure Bot Service (Microsoft.BotService/botServices) | Token | privatelink.token.botframework.com | token.botframework.com </br> europe.token.botframework.com |
| Azure Health Data Services (Microsoft.HealthcareApis/workspaces) | healthcareworkspace | privatelink.workspace.azurehealthcareapis.com </br> privatelink.fhir.azurehealthcareapis.com </br> privatelink.dicom.azurehealthcareapis.com | workspace.azurehealthcareapis.com </br> fhir.azurehealthcareapis.com </br> dicom.azurehealthcareapis.com |
| Azure Databricks (Microsoft.Databricks/workspaces) | databricks_ui_api </br> browser_authentication | privatelink.azuredatabricks.net | azuredatabricks.net |
| Azure Virtual Desktop (Microsoft.DesktopVirtualization/workspaces) | global | privatelink-global.wvd.microsoft.com  | wvd.microsoft.com |
| Azure Virtual Desktop (Microsoft.DesktopVirtualization/workspaces </br> Microsoft.DesktopVirtualization/hostpools) | feed <br> connection | privatelink.wvd.microsoft.com  | wvd.microsoft.com |

<sup>1</sup>To use with IoT Hub's built-in Event Hub compatible endpoint. To learn more, see [private link support for IoT Hub's built-in endpoint](../iot-hub/virtual-network-support.md#built-in-event-hubs-compatible-endpoint)

>[!Note]
>In the above text, **`{regionCode}`** refers to the region code (for example, **eus** for East US and **ne** for North Europe). Refer to the following lists for regions codes:
>
> - [All public clouds](https://download.microsoft.com/download/1/2/6/126a410b-0e06-45ed-b2df-84f353034fa1/AzureRegionCodesList.docx)
>
> **`{regionName}`** refers to the full region name (for example, **eastus** for East US and **northeurope** for North Europe). To retrieve a current list of Azure regions and their names and display names, use **`az account list-locations -o table`**.

### Government

| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
|---|---|---|---|
| Azure Automation / (Microsoft.Automation/automationAccounts) | Webhook </br> DSCAndHybridWorker | privatelink.azure-automation.us | azure-automation.us |
| Azure SQL Database (Microsoft.Sql/servers) | sqlServer | privatelink.database.usgovcloudapi.net | database.usgovcloudapi.net |
| Azure SQL Managed Instance (Microsoft.Sql/managedInstances) | managedInstance | privatelink.{dnsPrefix}.database.usgovcloudapi.net | {instanceName}.{dnsPrefix}.database.usgovcloudapi.net |
| Storage account (Microsoft.Storage/storageAccounts) | blob </br> blob_secondary | privatelink.blob.core.usgovcloudapi.net | blob.core.usgovcloudapi.net |
| Storage account (Microsoft.Storage/storageAccounts) | table </br> table_secondary | privatelink.table.core.usgovcloudapi.net | table.core.usgovcloudapi.net |
| Storage account (Microsoft.Storage/storageAccounts) | queue </br> queue_secondary | privatelink.queue.core.usgovcloudapi.net | queue.core.usgovcloudapi.net |
| Storage account (Microsoft.Storage/storageAccounts) | file </br> file_secondary | privatelink.file.core.usgovcloudapi.net | file.core.usgovcloudapi.net |
| Storage account (Microsoft.Storage/storageAccounts) | web </br> web_secondary | privatelink.web.core.usgovcloudapi.net | web.core.usgovcloudapi.net |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) | Sql | privatelink.documents.azure.us | documents.azure.us |
| Azure Batch (Microsoft.Batch/batchAccounts) | batchAccount | privatelink.batch.usgovcloudapi.net | {regionName}.batch.usgovcloudapi.net |
| Azure Batch (Microsoft.Batch/batchAccounts) | nodeManagement | privatelink.batch.usgovcloudapi.net | {regionName}.service.batch.usgovcloudapi.net |
| Azure Database for PostgreSQL - Single server (Microsoft.DBforPostgreSQL/servers) | postgresqlServer | privatelink.postgres.database.usgovcloudapi.net | postgres.database.usgovcloudapi.net |
| Azure Database for MySQL (Microsoft.DBforMySQL/servers) | mysqlServer | privatelink.mysql.database.usgovcloudapi.net | mysql.database.usgovcloudapi.net|
| Azure Database for MariaDB (Microsoft.DBforMariaDB/servers) | mariadbServer | privatelink.mariadb.database.usgovcloudapi.net| mariadb.database.usgovcloudapi.net |
| Azure Key Vault (Microsoft.KeyVault/vaults) | vault | privatelink.vaultcore.usgovcloudapi.net | vault.usgovcloudapi.net <br> vaultcore.usgovcloudapi.net |
| Azure Search (Microsoft.Search/searchServices) | searchService | privatelink.search.windows.us | search.windows.us |
| Azure App Configuration (Microsoft.AppConfiguration/configurationStores) | configurationStores | privatelink.azconfig.azure.us | azconfig.azure.us |
| Azure Backup (Microsoft.RecoveryServices/vaults) | AzureBackup | privatelink.{regionCode}.backup.windowsazure.us | {regionCode}.backup.windowsazure.us |
| Azure Site Recovery (Microsoft.RecoveryServices/vaults) | AzureSiteRecovery | privatelink.siterecovery.windowsazure.us | {regionCode}.siterecovery.windowsazure.us |
| Azure Event Hubs (Microsoft.EventHub/namespaces) | namespace | privatelink.servicebus.usgovcloudapi.net | servicebus.usgovcloudapi.net|
| Azure Service Bus (Microsoft.ServiceBus/namespaces) | namespace | privatelink.servicebus.usgovcloudapi.net| servicebus.usgovcloudapi.net |
| Azure IoT Hub (Microsoft.Devices/IotHubs) | iotHub | privatelink.azure-devices.us<br/>privatelink.servicebus.windows.us<sup>1</sup> | azure-devices.us<br/>servicebus.usgovcloudapi.net |
| Azure IoT Hub Device Provisioning Service (Microsoft.Devices/ProvisioningServices) | iotDps | privatelink.azure-devices-provisioning.us | azure-devices-provisioning.us |
| Azure Relay (Microsoft.Relay/namespaces) | namespace | privatelink.servicebus.usgovcloudapi.net  | servicebus.usgovcloudapi.net  |
| Azure Web Apps (Microsoft.Web/sites) | sites | privatelink.azurewebsites.us </br> scm.privatelink.azurewebsites.us | azurewebsites.us </br> scm.azurewebsites.us
| Azure Monitor (Microsoft.Insights/privateLinkScopes) | azuremonitor | privatelink.monitor.azure.us <br/> privatelink.adx.monitor.azure.us <br/> privatelink.	oms.opinsights.azure.us <br/> privatelink.ods.opinsights.azure.us <br/> privatelink.agentsvc.azure-automation.us <br/> privatelink.blob.core.usgovcloudapi.net | monitor.azure.us <br/> adx.monitor.azure.us <br/> oms.opinsights.azure.us<br/> ods.opinsights.azure.us<br/> agentsvc.azure-automation.us <br/> blob.core.usgovcloudapi.net |
| Azure AI services (Microsoft.CognitiveServices/accounts) | account | privatelink.cognitiveservices.azure.us  | cognitiveservices.azure.us  |
| Azure Cache for Redis (Microsoft.Cache/Redis) | redisCache | privatelink.redis.cache.usgovcloudapi.net | redis.cache.usgovcloudapi.net |
| Azure HDInsight (Microsoft.HDInsight) | N/A | privatelink.azurehdinsight.us | azurehdinsight.us |
| Azure Machine Learning (Microsoft.MachineLearningServices/workspaces) | amlworkspace | privatelink.api.ml.azure.us<br/>privatelink.notebooks.usgovcloudapi.net | api.ml.azure.us<br/>notebooks.usgovcloudapi.net <br/> instances.azureml.us<br/>aznbcontent.net <br/> inference.ml.azure.us |
| Azure Virtual Desktop (Microsoft.DesktopVirtualization/workspaces) | global  | privatelink-global.wvd.azure.us | wvd.azure.us  |
| Azure Virtual Desktop (Microsoft.DesktopVirtualization/workspaces </br> Microsoft.DesktopVirtualization/hostpools) | feed <br> connection  | privatelink.wvd.azure.us | wvd.azure.us  |

>[!Note]
>In the above text, `{region}` refers to the region code (for example, **eus** for East US and **ne** for North Europe). Refer to the following lists for regions codes:
>- [US Gov](../azure-government/documentation-government-developer-guide.md)
>
> **`{regionName}`** refers to the full region name (for example, **eastus** for East US and **northeurope** for North Europe). To retrieve a current list of Azure regions and their names and display names, use **`az account list-locations -o table`**.

### China

| Private link resource type | Subresource | Private DNS zone name | Public DNS zone forwarders |
|---|---|---|--|
| Azure Automation / (Microsoft.Automation/automationAccounts) | Webhook </br> DSCAndHybridWorker | privatelink.azure-automation.cn | azure-automation.cn |
| Azure SQL Database (Microsoft.Sql/servers) | sqlServer | privatelink.database.chinacloudapi.cn | database.chinacloudapi.cn |
| Storage account (Microsoft.Storage/storageAccounts) | blob </br> blob_secondary | privatelink.blob.core.chinacloudapi.cn | blob.core.chinacloudapi.cn |
| Storage account (Microsoft.Storage/storageAccounts) | table </br> table_secondary | privatelink.table.core.chinacloudapi.cn | table.core.chinacloudapi.cn |
| Storage account (Microsoft.Storage/storageAccounts) | queue </br> queue_secondary | privatelink.queue.core.chinacloudapi.cn | queue.core.chinacloudapi.cn |
| Storage account (Microsoft.Storage/storageAccounts) | file </br> file_secondary | privatelink.file.core.chinacloudapi.cn | file.core.chinacloudapi.cn |
| Storage account (Microsoft.Storage/storageAccounts) | web </br> web_secondary | privatelink.web.core.chinacloudapi.cn | web.core.chinacloudapi.cn |
| Azure Data Lake File System Gen2 (Microsoft.Storage/storageAccounts) | dfs </br> dfs_secondary | privatelink.dfs.core.chinacloudapi.cn | dfs.core.chinacloudapi.cn |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) | Sql | privatelink.documents.azure.cn | documents.azure.cn |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) | MongoDB | privatelink.mongo.cosmos.azure.cn | mongo.cosmos.azure.cn |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) | Cassandra | privatelink.cassandra.cosmos.azure.cn | cassandra.cosmos.azure.cn |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) | Gremlin | privatelink.gremlin.cosmos.azure.cn | gremlin.cosmos.azure.cn |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) | Table | privatelink.table.cosmos.azure.cn | table.cosmos.azure.cn |
| Azure Batch (Microsoft.Batch/batchAccounts) | batchAccount | privatelink.batch.chinacloudapi.cn | {region}.batch.chinacloudapi.cn |
| Azure Batch (Microsoft.Batch/batchAccounts) | nodeManagement | privatelink.batch.chinacloudapi.cn | {region}.service.batch.chinacloudapi.cn |
| Azure Database for PostgreSQL - Single server (Microsoft.DBforPostgreSQL/servers) | postgresqlServer | privatelink.postgres.database.chinacloudapi.cn | postgres.database.chinacloudapi.cn |
| Azure Database for MySQL (Microsoft.DBforMySQL/servers) | mysqlServer | privatelink.mysql.database.chinacloudapi.cn  | mysql.database.chinacloudapi.cn  |
| Azure Database for MariaDB (Microsoft.DBforMariaDB/servers) | mariadbServer | privatelink.mariadb.database.chinacloudapi.cn | mariadb.database.chinacloudapi.cn |
| Azure Key Vault (Microsoft.KeyVault/vaults) | vault | privatelink.vaultcore.azure.cn | vaultcore.azure.cn |
| Azure Event Hubs (Microsoft.EventHub/namespaces) | namespace | privatelink.servicebus.chinacloudapi.cn | servicebus.chinacloudapi.cn |
| Azure Service Bus (Microsoft.ServiceBus/namespaces) | namespace | privatelink.servicebus.chinacloudapi.cn | servicebus.chinacloudapi.cn |
| Azure IoT Hub (Microsoft.Devices/IotHubs) | iotHub | privatelink.azure-devices.cn <br/> privatelink.servicebus.chinacloudapi.cn <sup>1</sup> | azure-devices.cn<br/>servicebus.chinacloudapi.cn |
| Azure IoT Hub Device Provisioning Service (Microsoft.Devices/ProvisioningServices) | iotDps | privatelink.azure-devices-provisioning.cn | azure-devices-provisioning.cn |
| Azure Relay (Microsoft.Relay/namespaces) | namespace | privatelink.servicebus.chinacloudapi.cn | servicebus.chinacloudapi.cn |
| Azure Event Grid (Microsoft.EventGrid/topics) | topic | privatelink.eventgrid.azure.cn | eventgrid.azure.cn |
| Azure Event Grid (Microsoft.EventGrid/domains) | domain | privatelink.eventgrid.azure.cn | eventgrid.azure.cn |
| Azure Web Apps (Microsoft.Web/sites) | sites | privatelink.chinacloudsites.cn | chinacloudsites.cn |
| Azure Machine Learning (Microsoft.MachineLearningServices/workspaces) | amlworkspace | privatelink.api.ml.azure.cn<br/>privatelink.notebooks.chinacloudapi.cn | api.ml.azure.cn<br/>notebooks.chinacloudapi.cn <br/> instances.azureml.cn <br/> aznbcontent.net <br/> inference.ml.azure.cn |
| SignalR (Microsoft.SignalRService/SignalR) | signalR | privatelink.signalr.azure.cn | service.signalr.azure.cn |
| Azure File Sync (Microsoft.StorageSync/storageSyncServices) | afs |  privatelink.afs.azure.cn  |  afs.azure.cn  |
| Azure Data Factory (Microsoft.DataFactory/factories) | dataFactory |  privatelink.datafactory.azure.cn  |  datafactory.azure.cn  |
| Azure Data Factory (Microsoft.DataFactory/factories) | portal |  privatelink.adf.azure.cn  |  adf.azure.cn  |
| Azure Cache for Redis (Microsoft.Cache/Redis) | redisCache | privatelink.redis.cache.chinacloudapi.cn | redis.cache.chinacloudapi.cn |
| Azure HDInsight (Microsoft.HDInsight) | N/A | privatelink.azurehdinsight.cn | azurehdinsight.cn |
| Azure Data Explorer (Microsoft.Kusto/Clusters) | cluster | privatelink.{regionName}.kusto.windows.cn | {regionName}.kusto.windows.cn |
| Azure Virtual Desktop (Microsoft.DesktopVirtualization/workspaces) | global  | privatelink-global.wvd.azure.cn  | wvd.azure.cn  |
| Azure Virtual Desktop (Microsoft.DesktopVirtualization/workspaces and Microsoft.DesktopVirtualization/hostpools) | feed </br> connection  | privatelink.wvd.azure.cn | wvd.azure.cn |

<sup>1</sup>To use with IoT Hub's built-in Event Hub compatible endpoint. To learn more, see [private link support for IoT Hub's built-in endpoint](../iot-hub/virtual-network-support.md#built-in-event-hubs-compatible-endpoint)

## DNS configuration scenarios

The FQDN of the services resolves automatically to a public IP address. To resolve to the private IP address of the private endpoint, change your DNS configuration.

DNS is a critical component to make the application work correctly by successfully resolving the private endpoint IP address.

Based on your preferences, the following scenarios are available with DNS resolution integrated:

- [Azure Private Endpoint DNS configuration](#azure-private-endpoint-dns-configuration)
  - [Azure services DNS zone configuration](#azure-services-dns-zone-configuration)
    - [Government](#government)
    - [China](#china)
  - [DNS configuration scenarios](#dns-configuration-scenarios)
  - [Virtual network workloads without custom DNS server](#virtual-network-workloads-without-custom-dns-server)
  - [On-premises workloads using a DNS forwarder](#on-premises-workloads-using-a-dns-forwarder)
  - [Virtual network and on-premises workloads using a DNS forwarder](#virtual-network-and-on-premises-workloads-using-a-dns-forwarder)
  - [Private DNS zone group](#private-dns-zone-group)
  - [Next steps](#next-steps)

> [!NOTE]
> [Azure Firewall DNS proxy](../firewall/dns-settings.md#dns-proxy) can be used as DNS forwarder for [On-premises workloads](#on-premises-workloads-using-a-dns-forwarder) and [Virtual network workloads using a DNS forwarder](#virtual-network-and-on-premises-workloads-using-a-dns-forwarder).

## Virtual network workloads without custom DNS server

This configuration is appropriate for virtual network workloads without a custom DNS server. In this scenario, the client queries for the private endpoint IP address to the Azure-provided DNS service [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md). Azure DNS is responsible for DNS resolution of the private DNS zones.

> [!NOTE]
> This scenario uses the Azure SQL Database-recommended private DNS zone. For other services, you can adjust the model using the following reference: [Azure services DNS zone configuration](#azure-services-dns-zone-configuration).

To configure properly, you need the following resources:

- Client virtual network

- Private DNS zone [privatelink.database.windows.net](../dns/private-dns-privatednszone.md)  with [type A record](../dns/dns-zones-records.md#record-types)

- Private endpoint information (FQDN record name and private IP address)

The following screenshot illustrates the DNS resolution sequence from virtual network workloads using the private DNS zone:

:::image type="content" source="media/private-endpoint-dns/single-vnet-azure-dns.png" alt-text="Single virtual network and Azure-provided DNS":::

You can extend this model to peered virtual networks associated to the same private endpoint. [Add new virtual network links](../dns/private-dns-virtual-network-links.md) to the private DNS zone for all peered virtual networks.

> [!IMPORTANT]
> A single private DNS zone is required for this configuration. Creating multiple zones with the same name for different virtual networks would need manual operations to merge the DNS records.

> [!IMPORTANT]
> If you're using a private endpoint in a hub-and-spoke model from a different subscription or even within the same subscription, link the same private DNS zones to all spokes and hub virtual networks that contain clients that need DNS resolution from the zones.

In this scenario, there's a [hub and spoke](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) networking topology. The spoke networks share a private endpoint. The spoke virtual networks are linked to the same private DNS zone.

:::image type="content" source="media/private-endpoint-dns/hub-and-spoke-azure-dns.png" alt-text="Hub and spoke with Azure-provided DNS":::

## On-premises workloads using a DNS forwarder

For on-premises workloads to resolve the FQDN of a private endpoint, use a DNS forwarder to resolve the Azure service [public DNS zone](#azure-services-dns-zone-configuration) in Azure. A [DNS forwarder](/windows-server/identity/ad-ds/plan/reviewing-dns-concepts#resolving-names-by-using-forwarding) is a Virtual Machine running on the Virtual Network linked to the Private DNS Zone that can proxy DNS queries coming from other Virtual Networks or from on-premises. This is required as the query must be originated from the Virtual Network to Azure DNS. A few options for DNS proxies are: Windows running DNS services, Linux running DNS services, [Azure Firewall](../firewall/dns-settings.md).

The following scenario is for an on-premises network that has a DNS forwarder in Azure. This forwarder resolves DNS queries via a server-level forwarder to the Azure provided DNS [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md).

> [!NOTE]
> This scenario uses the Azure SQL Database-recommended private DNS zone. For other services, you can adjust the model using the following reference: [Azure services DNS zone configuration](#azure-services-dns-zone-configuration).

To configure properly, you need the following resources:

- On-premises network
- Virtual network [connected to on-premises](/azure/architecture/reference-architectures/hybrid-networking/)
- DNS forwarder deployed in Azure 
- Private DNS zones [privatelink.database.windows.net](../dns/private-dns-privatednszone.md) with [type A record](../dns/dns-zones-records.md#record-types)
- Private endpoint information (FQDN record name and private IP address)

The following diagram illustrates the DNS resolution sequence from an on-premises network. The configuration uses a DNS forwarder deployed in Azure. The resolution is made by a private DNS zone [linked to a virtual network](../dns/private-dns-virtual-network-links.md):

:::image type="content" source="media/private-endpoint-dns/on-premises-using-azure-dns.png" alt-text="On-premises using Azure DNS":::

This configuration can be extended for an on-premises network that already has a DNS solution in place. 
The on-premises DNS solution is configured to forward DNS traffic to Azure DNS via a [conditional forwarder](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server). The conditional forwarder references the DNS forwarder deployed in Azure.

> [!NOTE]
> This scenario uses the Azure SQL Database-recommended private DNS zone. For other services, you can adjust the model using the following reference: [Azure services DNS zone configuration](#azure-services-dns-zone-configuration)

To configure properly, you need the following resources:

- On-premises network with a custom DNS solution in place 
- Virtual network [connected to on-premises](/azure/architecture/reference-architectures/hybrid-networking/)
- DNS forwarder deployed in Azure
- Private DNS zones [privatelink.database.windows.net](../dns/private-dns-privatednszone.md)  with [type A record](../dns/dns-zones-records.md#record-types)
- Private endpoint information (FQDN record name and private IP address)

The following diagram illustrates the DNS resolution from an on-premises network. DNS resolution is conditionally forwarded to Azure. The resolution is made by a private DNS zone [linked to a virtual network](../dns/private-dns-virtual-network-links.md).

> [!IMPORTANT]
> The conditional forwarding must be made to the recommended [public DNS zone forwarder](#azure-services-dns-zone-configuration). For example: `database.windows.net` instead of **privatelink**.database.windows.net.

:::image type="content" source="media/private-endpoint-dns/on-premises-forwarding-to-azure.png" alt-text="On-premises forwarding to Azure DNS":::

## Virtual network and on-premises workloads using a DNS forwarder

For workloads accessing a private endpoint from virtual and on-premises networks, use a DNS forwarder to resolve the Azure service [public DNS zone](#azure-services-dns-zone-configuration) deployed in Azure.

The following scenario is for an on-premises network with virtual networks in Azure. Both networks access the private endpoint located in a shared hub network.

This DNS forwarder is responsible for resolving all the DNS queries via a server-level forwarder to the Azure-provided DNS service [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md).

> [!IMPORTANT]
> A single private DNS zone is required for this configuration. All client connections made from on-premises and [peered virtual networks](../virtual-network/virtual-network-peering-overview.md) must  also use the same private DNS zone.

> [!NOTE]
> This scenario uses the Azure SQL Database-recommended private DNS zone. For other services, you can adjust the model using the following reference: [Azure services DNS zone configuration](#azure-services-dns-zone-configuration).

To configure properly, you need the following resources:

- On-premises network
- Virtual network [connected to on-premises](/azure/architecture/reference-architectures/hybrid-networking/)
- [Peered virtual network](../virtual-network/virtual-network-peering-overview.md) 
- DNS forwarder deployed in Azure
- Private DNS zones [privatelink.database.windows.net](../dns/private-dns-privatednszone.md)  with [type A record](../dns/dns-zones-records.md#record-types)
- Private endpoint information (FQDN record name and private IP address)

The following diagram shows the DNS resolution for both networks, on-premises and virtual networks. The resolution is using a DNS forwarder. The resolution is made by a private DNS zone [linked to a virtual network](../dns/private-dns-virtual-network-links.md):

:::image type="content" source="media/private-endpoint-dns/hybrid-scenario.png" alt-text="Hybrid scenario":::

## Private DNS zone group

If you choose to integrate your private endpoint with a private DNS zone, a private DNS zone group is also created. The DNS zone group has a strong association between the private DNS zone and the private endpoint. It helps with managing the private DNS zone records when there's an update on the private endpoint. For example, when you add or remove regions, the private DNS zone is automatically updated with the correct number of records.

Previously, the DNS records for the private endpoint were created via scripting (retrieving certain information about the private endpoint and then adding it on the DNS zone). With the DNS zone group, there is no need to write any additional CLI/PowerShell lines for every DNS zone. Also, when you delete the private endpoint, all the DNS records within the DNS zone group will be deleted as well.

A common scenario for DNS zone group is in a hub-and-spoke topology, where it allows the private DNS zones to be created only once in the hub and allows the spokes to register to it, rather than creating different zones in each spoke.

> [!NOTE]
> Each DNS zone group can support up to 5 DNS zones.

> [!NOTE]
> Adding multiple DNS zone groups to a single Private Endpoint is not supported.

> [!NOTE]
> Delete and update operations for DNS records can be seen performed by "Azure Traffic Manager and DNS." This is a normal platform operation necessary for managing your DNS Records.

## Next steps
- [Learn about private endpoints](private-endpoint-overview.md)
