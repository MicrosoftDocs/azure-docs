---
title: Azure Private Endpoint DNS configuration
description: Learn Azure Private Endpoint DNS configuration
services: private-link
author: asudbring
ms.service: private-link
ms.topic: conceptual
ms.date: 01/14/2021
ms.author: allensu
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
> Is not recommended to override a zone that's actively in use to resolve public endpoints. Connections to resources won't be able to resolve correctly without DNS forwarding to the public DNS. To avoid issues, create a different domain name or follow the suggested name for each service below. 

## Azure services DNS zone configuration
Azure creates a canonical name DNS record (CNAME) on the public DNS. The CNAME record redirects the resolution to the private domain name. You can override the resolution with the private IP address of your private endpoints. 
 
Your applications don't need to change the connection URL. When resolving to a public DNS service, the DNS server will resolve to your private endpoints. The process doesn't affect your existing applications. 

> [!IMPORTANT]
> Private networks already using the private DNS zone for a given type, can only connect to public resources if they don't have any private endpoint connections, otherwise a corresponding DNS configuration is required on the private DNS zone in order to complete the DNS resolution sequence. 

For Azure services, use the recommended zone names as described in the following table:

| Private link resource type / Subresource |Private DNS zone name | Public DNS zone forwarders |
|---|---|---|
| Azure Automation / (Microsoft.Automation/automationAccounts) / Webhook, DSCAndHybridWorker | privatelink.azure-automation.net | azure-automation.net |
| Azure SQL Database (Microsoft.Sql/servers) / sqlServer | privatelink.database.windows.net | database.windows.net |
| Azure Synapse Analytics (Microsoft.Sql/servers) / sqlServer  | privatelink.database.windows.net | database.windows.net |
| Storage account (Microsoft.Storage/storageAccounts) / Blob (blob, blob_secondary) | privatelink.blob.core.windows.net | blob.core.windows.net |
| Storage account (Microsoft.Storage/storageAccounts) / Table (table, table_secondary) | privatelink.table.core.windows.net | table.core.windows.net |
| Storage account (Microsoft.Storage/storageAccounts) / Queue (queue, queue_secondary) | privatelink.queue.core.windows.net | queue.core.windows.net |
| Storage account (Microsoft.Storage/storageAccounts) / File (file, file_secondary) | privatelink.file.core.windows.net | file.core.windows.net |
| Storage account (Microsoft.Storage/storageAccounts) / Web (web, web_secondary) | privatelink.web.core.windows.net | web.core.windows.net |
| Azure Data Lake File System Gen2 (Microsoft.Storage/storageAccounts) / Data Lake File System Gen2 (dfs, dfs_secondary) | privatelink.dfs.core.windows.net | dfs.core.windows.net |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) / SQL | privatelink.documents.azure.com | documents.azure.com |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) / MongoDB | privatelink.mongo.cosmos.azure.com | mongo.cosmos.azure.com |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) / Cassandra | privatelink.cassandra.cosmos.azure.com | cassandra.cosmos.azure.com |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) / Gremlin | privatelink.gremlin.cosmos.azure.com | gremlin.cosmos.azure.com |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) / Table | privatelink.table.cosmos.azure.com | table.cosmos.azure.com |
| Azure Database for PostgreSQL - Single server (Microsoft.DBforPostgreSQL/servers) / postgresqlServer | privatelink.postgres.database.azure.com | postgres.database.azure.com |
| Azure Database for MySQL (Microsoft.DBforMySQL/servers) / mysqlServer | privatelink.mysql.database.azure.com | mysql.database.azure.com |
| Azure Database for MariaDB (Microsoft.DBforMariaDB/servers) / mariadbServer | privatelink.mariadb.database.azure.com | mariadb.database.azure.com |
| Azure Key Vault (Microsoft.KeyVault/vaults) / vault | privatelink.vaultcore.azure.net | vault.azure.net <br> vaultcore.azure.net |
| Azure Kubernetes Service - Kubernetes API (Microsoft.ContainerService/managedClusters) / management | privatelink.{region}.azmk8s.io | {region}.azmk8s.io |
| Azure Search (Microsoft.Search/searchServices) / searchService | privatelink.search.windows.net | search.windows.net |
| Azure Container Registry (Microsoft.ContainerRegistry/registries) / registry | privatelink.azurecr.io | azurecr.io |
| Azure App Configuration (Microsoft.AppConfiguration/configurationStores) / configurationStore | privatelink.azconfig.io | azconfig.io |
| Azure Backup (Microsoft.RecoveryServices/vaults) / vault | privatelink.{region}.backup.windowsazure.com | {region}.backup.windowsazure.com |
| Azure Site Recovery (Microsoft.RecoveryServices/vaults) / vault | {region}.privatelink.siterecovery.windowsazure.com | {region}.hypervrecoverymanager.windowsazure.com |
| Azure Event Hubs (Microsoft.EventHub/namespaces) / namespace | privatelink.servicebus.windows.net | servicebus.windows.net |
| Azure Service Bus (Microsoft.ServiceBus/namespaces) / namespace | privatelink.servicebus.windows.net | servicebus.windows.net |
| Azure IoT Hub (Microsoft.Devices/IotHubs) / iotHub | privatelink.azure-devices.net<br/>privatelink.servicebus.windows.net<sup>1</sup> | azure-devices.net<br/>servicebus.windows.net |
| Azure Relay (Microsoft.Relay/namespaces) / namespace | privatelink.servicebus.windows.net | servicebus.windows.net |
| Azure Event Grid (Microsoft.EventGrid/topics) / topic | privatelink.eventgrid.azure.net | eventgrid.azure.net |
| Azure Event Grid (Microsoft.EventGrid/domains) / domain | privatelink.eventgrid.azure.net | eventgrid.azure.net |
| Azure Web Apps (Microsoft.Web/sites) / sites | privatelink.azurewebsites.net | azurewebsites.net |
| Azure Machine Learning (Microsoft.MachineLearningServices/workspaces) / amlworkspace | privatelink.api.azureml.ms<br/>privatelink.notebooks.azure.net | api.azureml.ms<br/>notebooks.azure.net<br/>instances.azureml.ms<br/>aznbcontent.net |
| SignalR (Microsoft.SignalRService/SignalR) / signalR | privatelink.service.signalr.net | service.signalr.net |
| Azure Monitor (Microsoft.Insights/privateLinkScopes) / azuremonitor | privatelink.monitor.azure.com<br/> privatelink.oms.opinsights.azure.com <br/> privatelink.ods.opinsights.azure.com <br/> privatelink.agentsvc.azure-automation.net | monitor.azure.com<br/> oms.opinsights.azure.com<br/> ods.opinsights.azure.com<br/> agentsvc.azure-automation.net |
| Cognitive Services (Microsoft.CognitiveServices/accounts) / account | privatelink.cognitiveservices.azure.com  | cognitiveservices.azure.com  |
| Azure File Sync (Microsoft.StorageSync/storageSyncServices) / afs |  privatelink.afs.azure.net  |  afs.azure.net  |
| Azure Data Factory (Microsoft.DataFactory/factories) / dataFactory |  privatelink.datafactory.azure.net  |  datafactory.azure.net  |
| Azure Data Factory (Microsoft.DataFactory/factories) / portal |  privatelink.adf.azure.com  |  adf.azure.com  |
| Azure Cache for Redis (Microsoft.Cache/Redis) / redisCache | privatelink.redis.cache.windows.net | redis.cache.windows.net |

<sup>1</sup>To use with IoT Hub's built-in Event Hub compatible endpoint. To learn more, see [private link support for IoT Hub's built-in endpoint](../iot-hub/virtual-network-support.md#built-in-event-hub-compatible-endpoint)

### China

| Private link resource type / Subresource |Private DNS zone name | Public DNS zone forwarders |
|---|---|---|
| Azure SQL Database (Microsoft.Sql/servers) / SQL Server | privatelink.database.chinacloudapi.cn | database.chinacloudapi.cn |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) / SQL | privatelink.documents.azure.cn | documents.azure.cn |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) / MongoDB | privatelink.mongo.cosmos.azure.cn | mongo.cosmos.azure.cn |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) / Cassandra | privatelink.cassandra.cosmos.azure.cn | cassandra.cosmos.azure.cn |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) / Gremlin | privatelink.gremlin.cosmos.azure.cn | gremlin.cosmos.azure.cn |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) / Table | privatelink.table.cosmos.azure.cn | table.cosmos.azure.cn |
| Azure Database for PostgreSQL - Single server (Microsoft.DBforPostgreSQL/servers) / postgresqlServer | privatelink.postgres.database.chinacloudapi.cn | postgres.database.chinacloudapi.cn |
| Azure Database for MySQL (Microsoft.DBforMySQL/servers) / mysqlServer | privatelink.mysql.database.chinacloudapi.cn  | mysql.database.chinacloudapi.cn  |
| Azure Database for MariaDB (Microsoft.DBforMariaDB/servers) / mariadbServer | privatelink.mariadb.database.chinacloudapi.cn | mariadb.database.chinacloudapi.cn |

## DNS configuration scenarios

The FQDN of the services resolves automatically to a public IP address. To resolve to the private IP address of the private endpoint, change your DNS configuration.

DNS is a critical component to make the application work correctly by successfully resolving the private endpoint IP address.

Based on your preferences, the following scenarios are available with DNS resolution integrated:

- [Virtual network workloads without custom DNS server](#virtual-network-workloads-without-custom-dns-server)
- [On-premises workloads using a DNS forwarder](#on-premises-workloads-using-a-dns-forwarder)
- [Virtual network and on-premises workloads using a DNS forwarder](#virtual-network-and-on-premises-workloads-using-a-dns-forwarder)

> [!NOTE]
> [Azure Firewall DNS proxy](../firewall/dns-settings.md#dns-proxy) can be used as DNS forwarder for [On-premises workloads](#on-premises-workloads-using-a-dns-forwarder) and [Virtual network workloads using a DNS forwarder](#virtual-network-and-on-premises-workloads-using-a-dns-forwarder).

## Virtual network workloads without custom DNS server

This configuration is appropriate for virtual network workloads without a custom DNS server. In this scenario, the client queries for the private endpoint IP address to the Azure-provided DNS service [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md). Azure DNS will be responsible for DNS resolution of the private DNS zones.

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
> If you're using a private endpoint in a hub-and-spoke model from a different subscription, reuse the same private DNS zone on the hub.

In this scenario, there's a [hub and spoke](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) networking topology. The spoke networks share a private endpoint. The spoke virtual networks are linked to the same private DNS zone. 

:::image type="content" source="media/private-endpoint-dns/hub-and-spoke-azure-dns.png" alt-text="Hub and spoke with Azure-provided DNS":::

## On-premises workloads using a DNS forwarder

For on-premises workloads to resolve the FQDN of a private endpoint, use a DNS forwarder to resolve the Azure service [public DNS zone](#azure-services-dns-zone-configuration) in Azure.

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

## Next steps
- [Learn about private endpoints](private-endpoint-overview.md)
