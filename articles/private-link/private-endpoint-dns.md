---
title: Azure Private Endpoint DNS Configuration
description: Learn Azure Private Endpoint DNS Configuration
services: private-link
author: mblanco77
ms.service: private-link
ms.topic: conceptual
ms.date: 04/14/2020
ms.author: allensu
---
# Azure Private Endpoint DNS Configuration


When connecting to a private link resource using a fully qualified domain name (FQDN) as part of the connection string, it's important to correctly configure your DNS settings to resolve to the allocated private IP address. Existing Azure services might already have a DNS configuration to use when connecting over a public endpoint. This needs to be overridden to connect using your private endpoint. 
 
The network interface associated with the private endpoint contains the complete set of information required to configure your DNS, including FQDN and private IP addresses allocated for a given private link resource. 
 
You can use the following options to configure your DNS settings for private endpoints: 
- **Use the Host file (only recommended for testing)**. You can use the host file on a virtual machine to override the DNS.  
- **Use a private DNS zone**. You can use [private DNS zones](../dns/private-dns-privatednszone.md) to override the DNS resolution for a given private endpoint. A private DNS zone can be linked to your virtual network to resolve specific domains.
- **Use your custom DNS server**. You can use your own DNS server to override the DNS resolution for a given private link resource. If your [DNS server](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) is hosted on a virtual network, you can create a DNS forwarding rule to use a private DNS zone to simplify the configuration for all private link resources.
 
> [!IMPORTANT]
> It's not recommended to override a zone that is actively in use to resolve public endpoints. Connections to resources won't be able to resolve correctly without DNS forwarding to the public DNS. To avoid issues, create a different domain name or follow the suggested name for each service below. 

## Azure services DNS zone configuration
Azure services will create a canonical name DNS record (CNAME) on the public DNS to redirect the resolution to the suggested private domain names. You'll be able to override the resolution with the private IP address of your private endpoints. 
 
Your applications don't need to change the connection URL. When attempting to resolve using a public DNS, the DNS server will now resolve to your private endpoints. The process does not impact your existing applications. 

For Azure services, use the recommended zone names as described in the following table:

| Private Link resource type / Subresource |Private DNS Zone name | Public DNS zone name |
|---|---|---|---|
| SQL DB (Microsoft.Sql/servers) / Sql Server | privatelink.database.windows.net | database.windows.net |
| Azure Synapse Analytics (Microsoft.Sql/servers) / Sql Server  | privatelink.database.windows.net | database.windows.net |
| Storage Account (Microsoft.Storage/storageAccounts) / Blob (blob, blob_secondary) | privatelink.blob.core.windows.net | blob.core.windows.net |
| Storage Account (Microsoft.Storage/storageAccounts) / Table (table, table_secondary) | privatelink.table.core.windows.net | table.core.windows.net |
| Storage Account (Microsoft.Storage/storageAccounts) / Queue (queue, queue_secondary) | privatelink.queue.core.windows.net | queue.core.windows.net |
| Storage Account (Microsoft.Storage/storageAccounts) / File (file, file_secondary) | privatelink.file.core.windows.net | file.core.windows.net |
| Storage Account (Microsoft.Storage/storageAccounts) / Web (web, web_secondary) | privatelink.web.core.windows.net | web.core.windows.net |
| Data Lake File System Gen2 (Microsoft.Storage/storageAccounts) / Data Lake File System Gen2 (dfs, dfs_secondary) | privatelink.dfs.core.windows.net | dfs.core.windows.net |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) / SQL | privatelink.documents.azure.com | documents.azure.com |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) / MongoDB | privatelink.mongo.cosmos.azure.com | mongo.cosmos.azure.com |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) / Cassandra | privatelink.cassandra.cosmos.azure.com | cassandra.cosmos.azure.com |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) / Gremlin | privatelink.gremlin.cosmos.azure.com | gremlin.cosmos.azure.com |
| Azure Cosmos DB (Microsoft.AzureCosmosDB/databaseAccounts) / Table | privatelink.table.cosmos.azure.com | table.cosmos.azure.com |
| Azure Database for PostgreSQL - Single server (Microsoft.DBforPostgreSQL/servers) / postgresqlServer | privatelink.postgres.database.azure.com | postgres.database.azure.com |
| Azure Database for MySQL (Microsoft.DBforMySQL/servers) / mysqlServer | privatelink.mysql.database.azure.com | mysql.database.azure.com |
| Azure Database for MariaDB (Microsoft.DBforMariaDB/servers) / mariadbServer | privatelink.mariadb.database.azure.com | mariadb.database.azure.com |
| Azure Key Vault (Microsoft.KeyVault/vaults) / vault | privatelink.vaultcore.azure.net | vault.azure.net |
| Azure Kubernetes Service - Kubernetes API (Microsoft.ContainerService/managedClusters) / managedCluster | privatelink.{region}.azmk8s.io | {region}.azmk8s.io |
| Azure Search (Microsoft.Search/searchServices) / searchService | privatelink.search.windows.net | search.windows.net |
| Azure Container Registry (Microsoft.ContainerRegistry/registries) / registry | privatelink.azurecr.io | azurecr.io |
| Azure App Configuration (Microsoft.AppConfiguration/configurationStores) / configurationStore | privatelink.azconfig.io | azconfig.io |
| Azure Backup (Microsoft.RecoveryServices/vaults) / vault | privatelink.{region}.backup.windowsazure.com | {region}.backup.windowsazure.com |
| Azure Event Hub (Microsoft.EventHub/namespaces) / namespace | privatelink.servicebus.windows.net | servicebus.windows.net |
| Azure Service Bus (Microsoft.ServiceBus/namespaces) / namespace | privatelink.servicebus.windows.net | servicebus.windows.net |
| Azure Relay (Microsoft.Relay/namespaces) / namespace | privatelink.servicebus.windows.net | servicebus.windows.net |
| Azure Event Grid (Microsoft.EventGrid/topics) / topic | privatelink.eventgrid.azure.net | eventgrid.azure.net |
| Azure Event Grid (Microsoft.EventGrid/domains) / domain | privatelink.eventgrid.azure.net | eventgrid.azure.net |
| Azure WebApps (Microsoft.Web/sites) / site | privatelink.azurewebsites.net | azurewebsites.net |
| Azure Machine Learning(Microsoft.MachineLearningServices/workspaces) / workspace | privatelink.api.azureml.ms | api.azureml.ms |

 


## DNS configuration scenarios

The FQDN of the services resolves automatically to a public IP address, so in order to resolve to the private IP address of the private endpoint you must change your DNS configuration accordingly.

DNS is a critical component to make the application work correctly by resolving in a right manner the private endpoint IP address.

Based on your preferences, the following scenarios are available for DNS resolution integrated:

- [Virtual network workloads without custom DNS server](#virtual-network-workloads-without-custom-dns-server)
- [On premises workloads using a DNS forwarder](#on-premises-workloads-using-a-dns-forwarder)

## Virtual network workloads without custom DNS server

This configuration is appropriate for virtual network workloads without custom DNS server. In this scenario the client queries for the private endpoint IP address to Azure provided DNS [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md). Azure DNS will be responsible for DNS resolution of the private DNS zones.


> [!NOTE]
> This scenario is using Azure SQL database recommended Private DNS zone. For other services you can adjust the model using the following reference [Azure services DNS zone configuration](#azure-services-dns-zone-configuration).

To configure properly you would need the following resources :

- Client virtual network

- Private DNS zone [privatelink.database.windows.net](../dns/private-dns-privatednszone.md)  with [type A Record](../dns/dns-zones-records.md#record-types)

- Private endpoint information (FQDN record name and Private IP Address)

The following diagram illustrates the DNS resolution sequence from virtual network workloads using private dns zone

:::image type="content" source="media/private-endpoint-dns/single-vnet-azure-dns.png" alt-text="Single virtual network and Azure-provided DNS":::

This model can be extended to multiple peered virtual networks that are associated to the same private endpoint. This can be done by [adding new virtual network links](../dns/private-dns-virtual-network-links.md) to the private DNS zone for all peered virtual networks.

> [!IMPORTANT]
>  A single private DNS zone is required for this configuration, creating multiple zones with the same name for different virtual networks would need manual operations to merge the DNS records

In this scenario there's a [hub & spoke](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) networking topology with the spoke networks sharing a common private endpoint and all the spoke virtual network are linked to the same private dns zone. 

:::image type="content" source="media/private-endpoint-dns/hub-and-spoke-azure-dns.png" alt-text="Hub and spoke with Azure-provided DNS":::

## On premises workloads using a DNS forwarder
 
For on premises workloads to be able to resolve an FQDN of a private endpoint into the private IP address, you must use a DNS forwarder to make the resolution of the Azure service [public DNS zone](#azure-services-dns-zone-configuration) deployed in Azure.


The following scenario is appropriate for an on premises network that has a DNS forwarder in Azure, which in turn is responsible for resolving all the DNS queries via a server level forwarder to the Azure provided DNS [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md) 

> [!NOTE]
> This scenario is using Azure SQL database recommended Private DNS zone. For other services you can adjust the model using the following reference [Azure services DNS zone configuration](#azure-services-dns-zone-configuration).

To configure properly you would need the following resources:

- On premises network
- Virtual network [connected to on premises](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/)
- DNS forwarder deployed in Azure 
- Private DNS zones [privatelink.database.windows.net](../dns/private-dns-privatednszone.md) with [type A Record](../dns/dns-zones-records.md#record-types)
- Private endpoint information (FQDN record name and Private IP Address)

The following diagram illustrates the DNS resolution sequence from an on premise network that use a DNS forwarder deployed in Azure,
where the resolution is made by an private DNS zone linked to a virtual network.

:::image type="content" source="media/private-endpoint-dns/on-premise-using-azure-dns.png" alt-text="On-premises using Azure DNS":::

This configuration can be extended for an on premise network that has already a DNS solution in place. 
The on premises DNS solution needs to be configured to forward DNS traffic to the Azure DNS via a [conditional forwarder](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) referencing the DNS forwarder deployed in Azure.

> [!NOTE]
> This scenario is using Azure SQL database recommended Private DNS zone. For other services you can adjust the model using the following reference [Azure services DNS zone configuration](#azure-services-dns-zone-configuration).

To configure properly you would need the following resources :


- On premises network with a custom DNS solution in place 
- Virtual network [connected to on premises](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/)
- DNS forwarder deployed in Azure
- Private DNS zones [privatelink.database.windows.net](../dns/private-dns-privatednszone.md)  with [type A Record](../dns/dns-zones-records.md#record-types)
- Private endpoint information (FQDN record name and Private IP Address)

The following diagram illustrates the DNS resolution sequence from an on premise network that conditionally forwards DNS traffic to Azure,where the resolution is made by an private DNS zone linked to a virtual network

> [!IMPORTANT]
> The conditional forwarding must be made to the [public DNS zone](#azure-services-dns-zone-configuration) Ex: `database.windows.net` , instead of **privatelink**.database.windows.net

:::image type="content" source="media/private-endpoint-dns/on-premise-forwarding-to-azure.png" alt-text="On-premises forwarding to Azure DNS":::


## Next steps
- [Learn about Private Endpoints](private-endpoint-overview.md)
