---
title: What is a private endpoint?
description: In this article, you'll learn how to use the Private Endpoint feature of Azure Private Link.
services: private-link
author: asudbring
# Customer intent: As someone who has a basic network background but is new to Azure, I want to understand the capabilities of private endpoints so that I can securely connect to my Azure PaaS services within the virtual network.
ms.service: private-link
ms.topic: conceptual
ms.date: 02/17/2022
ms.author: allensu
---
# What is a private endpoint?

A private endpoint is a network interface that uses a private IP address from your virtual network. This network interface connects you privately and securely to a service that's powered by Azure Private Link. By enabling a private endpoint, you're bringing the service into your virtual network.

The service could be an Azure service such as:

* Azure Storage
* Azure Cosmos DB
* Azure SQL Database
* Your own service, using [Private Link service](private-link-service-overview.md).
  
## Private endpoint properties 

A private endpoint specifies the following properties: 

|Property  |Description |
|---------|---------|
|Name    |    A unique name within the resource group.      |
|Subnet    |  The subnet to deploy, where the private IP address is assigned. For subnet requirements, see the [Limitations](#limitations) section later in this article.         |
|Private-link resource    |   The private-link resource to connect by using a resource ID or alias, from the list of available types. A unique network identifier is generated for all traffic that's sent to this resource.       |
|Target subresource   |      The subresource to connect. Each private-link resource type has various options to select based on preference.    |
|Connection approval method    |  Automatic or manual. Depending on the Azure role-based access control (RBAC) permissions, your private endpoint can be approved automatically. If you're connecting to a private-link resource without Azure RBAC permissions, use the manual method to allow the owner of the resource to approve the connection.        |
|Request message     |  You can specify a message for requested connections to be approved manually. This message can be used to identify a specific request.        |
|Connection status   |   A read-only property that specifies whether the private endpoint is active. Only private endpoints in an approved state can be used to send traffic. Additional available states: <li>*Approved*: The connection was automatically or manually approved and is ready to be used.<li>*Pending*: The connection was created manually and is pending approval by the private-link resource owner.<li>*Rejected*: The connection was rejected by the private-link resource owner.<li>*Disconnected*: The connection was removed by the private-link resource owner. The private endpoint becomes informative and should be deleted for cleanup. </br>|

As you're creating private endpoints, consider the following: 

- Private endpoints enable connectivity between the customers from the same:
    
    - Virtual network
    - Regionally peered virtual networks
    - Globally peered virtual networks
    - On-premises environments that use [VPN](https://azure.microsoft.com/services/vpn-gateway/) or [Express Route](https://azure.microsoft.com/services/expressroute/)
    - Services that are powered by Private Link
 
- Network connections can be initiated only by clients that are connecting to the private endpoint. Service providers don't have a routing configuration to create connections into service customers. Connections can be established in a single direction only.

- A read-only network interface is *automatically created* for the lifecycle of the private endpoint. The interface is assigned a dynamic private IP address from the subnet that maps to the private-link resource. The value of the private IP address remains unchanged for the entire lifecycle of the private endpoint.
 
- The private endpoint must be deployed in the same region and subscription as the virtual network. 
 
- The private-link resource can be deployed in a different region than the one for the virtual network and private endpoint.
 
- Multiple private endpoints can be created with the same private-link resource. For a single network using a common DNS server configuration, the recommended practice is to use a single private endpoint for a specified private-link resource. Use this practice to avoid duplicate entries or conflicts in DNS resolution. 
 
- Multiple private endpoints can be created on the same or different subnets within the same virtual network. There are limits to the number of private endpoints you can create in a subscription. For more information, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits).

- The subscription from the private-link resource must also be registered with the Microsoft network resource provider. For more information, see [Azure Resource Providers](../azure-resource-manager/management/resource-providers-and-types.md).
 
## Private-link resource 
A private-link resource is the destination target of a specified private endpoint. The following table lists the available resources that support a private endpoint: 
 
| Private-link resource&nbsp;name | Resource type | Subresources |
| ---------------------------| ------------- | ------------- |
| Azure App Configuration | Microsoft.Appconfiguration/configurationStores | configurationStores |
| Azure Automation | Microsoft.Automation/automationAccounts | Webhook, DSCAndHybridWorker |
| Azure Cosmos DB | Microsoft.AzureCosmosDB/databaseAccounts | SQL, MongoDB, Cassandra, Gremlin, Table |
| Azure Batch | Microsoft.Batch/batchAccounts | batch account |
| Azure Cache for Redis | Microsoft.Cache/Redis | redisCache |
| Azure Cache for Redis Enterprise | Microsoft.Cache/redisEnterprise | redisEnterprise |
| Azure Cognitive Services | Microsoft.CognitiveServices/accounts | account |
| Azure Managed Disks | Microsoft.Compute/diskAccesses | managed disk |
| Azure Container Registry | Microsoft.ContainerRegistry/registries | registry |
| Azure Kubernetes Service - Kubernetes API | Microsoft.ContainerService/managedClusters | management |
| Azure Data Factory | Microsoft.DataFactory/factories | dataFactory |
| Azure Database for MariaDB | Microsoft.DBforMariaDB/servers | mariadbServer |
| Azure Database for MySQL | Microsoft.DBforMySQL/servers | mysqlServer |
| Azure Database for PostgreSQL - Single server | Microsoft.DBforPostgreSQL/servers | postgresqlServer |
| Azure Device Provisioning Service | Microsoft.Devices/provisioningServices | iotDps |
| Azure IoT Hub | Microsoft.Devices/IotHubs | iotHub |
| Azure IoT Central | Microsoft.IoTCentral/IoTApps | IoTApps |
| Azure Digital Twins | Microsoft.DigitalTwins/digitalTwinsInstances | digitaltwinsinstance |
| Azure Event Grid | Microsoft.EventGrid/domains | domain |
| Azure Event Grid | Microsoft.EventGrid/topics  | topic |
| Azure Event Hub | Microsoft.EventHub/namespaces | namespace |
| Azure HDInsight | Microsoft.HDInsight/clusters | cluster |
| Azure API for FHIR (Fast Healthcare Interoperability Resources) | Microsoft.HealthcareApis/services | fhir |
| Azure Key Vault HSM (hardware security module) | Microsoft.Keyvault/managedHSMs | HSM |
| Azure Key Vault | Microsoft.KeyVault/vaults | vault |
| Azure Machine Learning | Microsoft.MachineLearningServices/workspaces | amlworkspace |
| Azure Migrate | Microsoft.Migrate/assessmentProjects | project |
| Application Gateway | Microsoft.Network/applicationgateways | application gateway |
| Private Link service (your own service) |  Microsoft.Network/privateLinkServices | empty |
| Power BI | Microsoft.PowerBI/privateLinkServicesForPowerBI | Power BI |
| Microsoft Purview | Microsoft.Purview/accounts | account |
| Microsoft Purview | Microsoft.Purview/accounts | portal |
| Azure Backup | Microsoft.RecoveryServices/vaults | vault |
| Azure Relay | Microsoft.Relay/namespaces | namespace |
| Azure Cognitive Search | Microsoft.Search/searchServices | search service |
| Azure Service Bus | Microsoft.ServiceBus/namespaces | namespace |
| Azure SignalR Service | Microsoft.SignalRService/SignalR | signalr |
| Azure SignalR Service | Microsoft.SignalRService/webPubSub | webpubsub |
| Azure SQL Database | Microsoft.Sql/servers | SQL Server (sqlServer) |
| Azure Storage | Microsoft.Storage/storageAccounts | Blob (blob, blob_secondary)<BR> Table (table, table_secondary)<BR> Queue (queue, queue_secondary)<BR> File (file, file_secondary)<BR> Web (web, web_secondary) |
| Azure File Sync | Microsoft.StorageSync/storageSyncServices | File Sync Service |
| Azure Synapse | Microsoft.Synapse/privateLinkHubs | synapse |
| Azure Synapse Analytics | Microsoft.Synapse/workspaces | SQL, SqlOnDemand, Dev | 
| Azure App Service | Microsoft.Web/hostingEnvironments | hosting environment |
| Azure App Service | Microsoft.Web/sites | sites |
| Azure Static Web Apps | Microsoft.Web/staticSites | staticSites |

> [!NOTE]
> You can create private endpoints only on a General Purpose v2 (GPv2) storage account.
 
## Network security of private endpoints 

When you use private endpoints, traffic is secured to a private-link resource. The platform validates network connections, allowing only those that reach the specified private-link resource. To access additional sub-resources within the same Azure service, additional private endpoints with corresponding targets are required. In the case of Azure Storage, for instance, you would need separate private endpoints to access the _file_ and _blob_ sub-resources.

Private endpoints provide a privately accessible IP address for the Azure service, but do not necessarily restrict public network access to it. [Azure App Service](tutorial-private-endpoint-webapp-portal.md) and [Azure Functions](../azure-functions/functions-create-vnet.md) become inaccessible publicly when they are associated with a private endpoint. All other Azure services require additional [access controls](../event-hubs/event-hubs-ip-filtering.md), however. These controls provide an extra network security layer to your resources, providing protection that helps prevent access to the Azure service associated with the private-link resource. 
 
## Access to a private-link resource using approval workflow 

You can connect to a private-link resource by using the following connection approval methods:

- **Automatically approve**: Use this method when you own or have permissions for the specific private-link resource. The required permissions are based on the private-link resource type in the following format: 

   `Microsoft.<Provider>/<resource_type>/privateEndpointConnectionsApproval/action`

- **Manually request**: Use this method when you don't have the required permissions and want to request access. An approval workflow will be initiated. The private endpoint and later private-endpoint connections will be created in a *Pending* state. The private-link resource owner is responsible to approve the connection. After it's approved, the private endpoint is enabled to send traffic normally, as shown in the following approval workflow diagram:  

![Diagram of the workflow approval process.](media/private-endpoint-overview/private-link-paas-workflow.png)
 
Over a private-endpoint connection, a private-link resource owner can: 

- Review all private-endpoint connection details. 
- Approve a private-endpoint connection. The corresponding private endpoint will be enabled to send traffic to the private-link resource. 
- Reject a private-endpoint connection. The corresponding private endpoint will be updated to reflect the status.
- Delete a private-endpoint connection in any state. The corresponding private endpoint will be updated with a disconnected state to reflect the action. The private-endpoint owner can delete only the resource at this point. 
 
> [!NOTE]
> Only private endpoints in an *Approved* state can send traffic to a specified private-link resource. 

### Connect by using an alias

An alias is a unique moniker that's generated when a service owner creates a private-link service behind a standard load balancer. Service owners can share this alias offline with consumers of your service. 


The consumers can request a connection to a private-link service by using either the resource URI or the alias. To connect by using the alias, create a private endpoint by using the manual connection approval method. To use the manual connection approval method, set the manual request parameter to *True* during the private-endpoint create flow. For more information, see [New-AzPrivateEndpoint](/powershell/module/az.network/new-azprivateendpoint) and [az network private-endpoint create](/cli/azure/network/private-endpoint#az-network-private-endpoint-create).
                                     
> [!NOTE]
> This manual request can be auto approved if the consumer's subscription is allow-listed on the provider side. To learn more, go to [controlling service access](./private-link-service-overview.md#control-service-access).                                     

## DNS configuration

The DNS settings that you use to connect to a private-link resource are important. Existing Azure services might already have a DNS configuration you can use when you're connecting over a public endpoint. To connect to the same service over private endpoint, separate DNS settings, often configured via private DNS zones, are required. Ensure that your DNS settings are correct when you use the fully qualified domain name (FQDN) for the connection. The settings must resolve to the private IP address of the private endpoint. 
 
The network interface associated with the private endpoint contains the information that's required to configure your DNS. The information includes the FQDN and private IP address for a private-link resource. 

For complete, detailed information about recommendations to configure DNS for private endpoints, see [Private endpoint DNS configuration](private-endpoint-dns.md).
 
## Limitations
 
The following table list the known limitations to the use of private endpoints: 

| Limitation | Description |Mitigation |
| --------- | --------- | --------- |
| Traffic that's destined for a private endpoint through a user-defined route (UDR) might be asymmetric. | Return traffic from a private endpoint bypasses a network virtual appliance (NVA) and attempts to return to the source virtual machine. | Source network address translation (SNAT) is used to ensure symmetric routing. For all traffic to a private endpoint that uses a UDR, we recommend that you use SNAT for traffic at the NVA. |

> [!IMPORTANT]
> Network security group (NSG) and UDR support for private endpoints is in preview in select regions. For more information, see [Preview of Private Link UDR support](https://azure.microsoft.com/updates/public-preview-of-private-link-udr-support/) and [Preview of Private Link network security group support](https://azure.microsoft.com/updates/public-preview-of-private-link-network-security-group-support/).
>
> This preview version is provided without a service-level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. 
>
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Limitations of the preview version

### Network security groups

| Limitation | Description | Mitigation |
| ---------- | ----------- | ---------- |
| Obtaining effective routes and security rules isn't available on a private-endpoint network interface. | You can't navigate to the network interface to view relevant information about the effective routes and security rules. | Q4CY2021 |
| NSG flow logs aren't supported. | NSG flow logs don't work for inbound traffic that's destined for a private endpoint. | No mitigation information is available at this time. |
| Intermittent drops with zone-redundant storage (ZRS) storage accounts. | Customers that use ZRS storage accounts might see periodic intermittent drops, even with *allow NSG* applied on a storage private-endpoint subnet. | No mitigation information is available at this time. |
| Intermittent drops with Azure Key Vault. | Customers that use Azure Key Vault might see periodic intermittent drops, even with *allow NSG* applied on a Key Vault private-endpoint subnet. | No mitigation information is available at this time. |
| The number of address prefixes per NSG is limited. | Having more than 500 address prefixes in an NSG in a single rule isn't supported. | No mitigation information is available at this time. |
| AllowVirtualNetworkAccess flag | Customers that set virtual network peering on their virtual network (virtual network A) with the *AllowVirtualNetworkAccess* flag set to *false* on the peering link to another virtual network (virtual network B) can't use the *VirtualNetwork* tag to deny traffic from virtual network B accessing private endpoint resources. The customers need to explicitly place a block for virtual network B’s address prefix to deny traffic to the private endpoint. | No mitigation information is available at this time. |
| Dual port NSG rules are unsupported. | If multiple port ranges are used with NSG rules, only the first port range is honored for allow rules and deny rules. Rules with multiple port ranges are defaulted to *deny all* instead of to denying specific ports. </br><br>For more information, see the UDR rule example in the next table. | No mitigation information is available at this time. |
| | |
  
The following table shows an example of a dual port NSG rule:
  
| Priority | Source&nbsp;port&nbsp; | Destination&nbsp;port | Action | Effective&nbsp;action |
| -------- | ----------- | ---------------- | ------ | ---------------- |
| 10 | 10-12 | 10-12 | Allow/Deny | Single port range in source/destination ports will work as expected. |
| 10 | 10-12, 13-14 | 14-15, 16-17 | Allow | Only source ports 10-12 and destination ports 14-15 will be allowed. |
| 10 | 10-12, 13-14 | 120-130, 140-150 | Deny | Traffic from all source ports will be denied to all destination ports, because there are multiple source and destination port ranges. |
| 10 | 10-12, 13-14 | 120-130 | Deny | Traffic from all source ports will be denied to destination ports 120-130 only. There are multiple source port ranges and a single destination port range. |
| | |

| Limitation | Description | Mitigation |
| ---------- | ----------- | ---------- |
| Source Network Address Translation (SNAT) is recommended always. | Because of the variable nature of the private-endpoint data plane, we recommend using SNAT traffic that's destined to a private endpoint, which ensures that return traffic is honored. | No mitigation information is available at this time. |
| | |
 
## Next steps

- For more information about private endpoints and Private Link, see [What is Azure Private Link?](private-link-overview.md).
- To get started with creating a private endpoint for a web app, see [Quickstart: Create a private endpoint by using the Azure portal](create-private-endpoint-portal.md).
