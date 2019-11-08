---
title: What is an Azure Private Endpoint?
description: Learn about Azure Private Endpoint
services: private-link
author: KumudD
# Customer intent: As someone with a basic network background, but is new to Azure, I want to understand the capabilities of Azure private endpoints so that I can securely connect to my Azure PaaS services within the virtual network.

ms.service: private-link
ms.topic: conceptual
ms.date: 09/16/2019
ms.author: kumud
---
# What is Azure Private Endpoint?

Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. Private Endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. The service could be an Azure service such as Azure Storage, SQL, etc. or your own [Private Link Service](private-link-service-overview.md).
  
## Private Endpoint properties 
 A Private Endpoint specifies the following properties: 


|Property  |Description |
|---------|---------|
|Name    |    A unique name within the resource group.      |
|Subnet    |  The subnet to deploy and allocate private IP addresses from a virtual network. For subnet requirements, see the Limitations section in this article.         |
|Private Link Resource    |   The private link resource to connect using resource ID or alias, from the list of available types. A unique network identifier will be generated for all traffic sent to this resource.       |
|Target subresource   |      The subresource to connect. Each private link resource type has different options to select based on preference.    |
|Connection approval method    |  Automatic or manual. Based on role-based access control (RBAC) permissions, your private endpoint can be approved automatically. If you try to connect to a private link resource without RBAC, use the manual method to allow the owner of the resource to approve the connection.        |
|Request Message     |  You can specify a message for requested connections to be approved manually. This message can be used to identify a specific request.        |
|Connection status   |   A read-only property that specifies if the private endpoint is active. Only private endpoints in an approved state can be used to send traffic. Additional states available: <br>-**Approved**: Connection was automatically or manually approved and is ready to be used.</br><br>-**Pending**: Connection was created manually and is pending approval by the private link resource owner.</br><br>-**Rejected**: Connection was rejected by the private link resource owner.</br><br>-**Disconnected**: Connection was removed by the private link resource owner. The private endpoint becomes informative and should be deleted for cleanup. </br>|

Here are some key details about private endpoints: 
- Private endpoint enables connectivity between the consumers from the same VNet, regionally peered VNets, globally peered VNets and on premises using [VPN](https://azure.microsoft.com/services/vpn-gateway/) or [Express Route](https://azure.microsoft.com/services/expressroute/) and services powered by Private Link.
 
- When creating a private endpoint, a network interface is also created for the lifecycle of the resource. The interface is assigned a private IP address from the subnet that maps to the Private Link Service.
 
- The private endpoint must be deployed in the same region as the virtual network. 
 
- The private link resource can be deployed in a different region than the virtual network and private endpoint.
 
- Multiple private endpoints can be created using the same private link resource. For a single network using a common DNS server configuration, the recommended practice is to use a single private endpoint for a given private link resource to avoid duplicate entries or conflicts in DNS resolution. 
 
- Multiple private endpoints can be created on the same or different subnets within the same virtual network. There are limits to the number of private endpoints you can create in a subscription. For details, see [Azure limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#networking-limits).


 
## Private link resource 
A private link resource is the destination target of a given private endpoint. The following is a list of available private link resource types: 
 
|Private link resource name  |Resource type   |Subresources  |
|---------|---------|---------|
|**Private Link Service** (Your own service)   |  Microsoft.Network/privateLinkServices       | empty |
|**Azure SQL Database** | Microsoft.Sql/servers    |  Sql Server (sqlServer)        |
|**Azure SQL Data Warehouse** | Microsoft.Sql/servers    |  Sql Server (sqlServer)        |
|**Azure Storage**  | Microsoft.Storage/storageAccounts    |  Blob (blob, blob_secondary)<BR> Table (table, table_secondary)<BR> Queue (queue, queue_secondary)<BR> File (file, file_secondary)<BR> Web (web, web_secondary)        |
|**Azure Data Lake Storage Gen2**  | Microsoft.Storage/storageAccounts    |  Blob (blob, blob_secondary)       |
 
 
## Network security of private endpoints 
When using private endpoints for Azure services, traffic is secured to a specific private link resource. The platform performs an access control to validate network connections reaching only the specified private link resource. To access additional resources within the same Azure service, additional private endpoints are required. 
 
You can completely lock down your workloads from accessing public endpoints to connect to a supported Azure service. This control provides an additional network security layer to your resources by providing a built-in exfiltration protection that prevents access to other resources hosted on the same Azure service. 
 
## Access to a private link resource using approval workflow 
You can connect to a private link resource using the following connection approval methods:
- **Automatically** approved when you own or have permission on the specific private link resource. The permission required is based on the private link resource type in the following format: Microsoft.\<Provider>/<resource_type>/privateEndpointConnectionApproval/action
- **Manual** request when you don't have the permission required and would like to request access. An approval workflow will be initiated. The private endpoint and subsequent private endpoint connection will be created in a "Pending" state. The private link resource owner is responsible to approve the connection. After it's approved, the private endpoint is enabled to send traffic normally, as shown in the following approval workflow diagram.  

![workflow approval](media/private-endpoint-overview/private-link-paas-workflow.png)
 
The private link resource owner can perform the following actions over a private endpoint connection: 
- Review all private endpoint connections details. 
- Approve a private endpoint connection. The corresponding private endpoint will be enabled to send traffic to the private link resource. 
- Reject a private endpoint connection. The corresponding private endpoint will be updated to reflect the status.
- Delete a private endpoint connection in any state. The corresponding private endpoint will be updated with a disconnected state to reflect the action, the private endpoint owner can only delete the resource at this point. 
 
> [!NOTE]
> Only a private endpoint in an approved state can send traffic to a given private link resource. 

### Connecting using Alias
Alias is a unique moniker that is generated when the service owner creates the private link service behind a standard load balancer. Service owner can share this Alias with their consumers offline. Consumers can request a connection to private link service using either the resource URI or the Alias. If you want to connect using Alias, you must create private endpoint using manual connection approval method. For using manual connection approval method, set manual request parameter to true during private endpoint create flow. Look at [New-AzPrivateEndpoint](/powershell/module/az.network/new-azprivateendpoint?view=azps-2.6.0) and [az network private-endpoint create](/cli/azure/network/private-endpoint?view=azure-cli-latest#az-network-private-endpoint-create) for details. 

## DNS configuration 
When connecting to a private link resource using a fully qualified domain name (FQDN) as part of the connection string, it's important to correctly configure your DNS settings to resolve to the allocated private IP address. Existing Azure services might already have a DNS configuration to use when connecting over a public endpoint. This needs to be overridden to connect using your private endpoint. 
 
The network interface associated with the private endpoint contains the complete set of information required to configure your DNS, including FQDN and private IP addresses allocated for a given private link resource. 
 
You can use the following options to configure your DNS settings for private endpoints: 
- **Use the Host file (only recommended for testing)**. You can use the host file on a virtual machine to override the DNS.  
- **Use a private DNS zone**. You can use private DNS zones to override the DNS resolution for a given private endpoint. A private DNS zone can be linked to your virtual network to resolve specific domains.
- **Use your custom DNS server**. You can use your own DNS server to override the DNS resolution for a given private link resource. If your [DNS server](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) is hosted on a virtual network, you can create a DNS forwarding rule to use a private DNS zone to simplify the configuration for all private link resources.
 
> [!IMPORTANT]
> It's not recommended to override a zone that is actively in use to resolve public endpoints. Connections to resources won't be able to resolve correctly without DNS forwarding to the public DNS. To avoid issues, create a different domain name or follow the suggested name for each service below. 
 
For Azure services, use the recommended zone names as described in the following table:

|Private Link resource type   |Subresource  |Zone name  |
|---------|---------|---------|
|SQL DB/DW (Microsoft.Sql/servers)    |  Sql Server (sqlServer)        |   privatelink.database.windows.net       |
|Storage Account (Microsoft.Storage/storageAccounts)    |  Blob (blob, blob_secondary)        |    privatelink.blob.core.windows.net      |
|Storage Account (Microsoft.Storage/storageAccounts)    |    Table (table, table_secondary)      |   privatelink.table.core.windows.net       |
|Storage Account (Microsoft.Storage/storageAccounts)    |    Queue (queue, queue_secondary)     |   privatelink.queue.core.windows.net       |
|Storage Account (Microsoft.Storage/storageAccounts)   |    File (file, file_secondary)      |    privatelink.file.core.windows.net      |
|Storage Account (Microsoft.Storage/storageAccounts)     |  Web (web, web_secondary)        |    privatelink.web.core.windows.net      |
|Data Lake File System Gen2 (Microsoft.Storage/storageAccounts)  |  Data Lake File System Gen2 (dfs, dfs_secondary)        |     privatelink.dfs.core.windows.net     |
||||
 

Azure will create a canonical name DNS record (CNAME) on the public DNS to redirect the resolution to the suggested domain names. You'll be able to override the resolution with the private IP address of your private endpoints. 
 
Your applications don't need to change the connection URL. When attempting to resolve using a public DNS, the DNS server will now resolve to your private endpoints. The process does not impact your applications. 
 
## Limitations
 
The following table includes a list of known limitations when using private endpoints: 


|Limitation |Description |Mitigation  |
|---------|---------|---------|
|Network Security Group (NSG) rules and User Defined Routes do not apply to Private Endpoint    |NSG is not supported on private endpoints. While subnets containing the private endpoint can have NSG associated with it, the rules will not be effective on traffic processed by the private endpoint. You must have [network policies enforcement disabled](disable-private-endpoint-network-policy.md) to deploy private endpoints in a subnet. NSG is still enforced on other workloads hosted on the same subnet. Routes on any client subnet will be using an /32 prefix, changing the default routing behavior requires a similar UDR  | Control the traffic by using NSG rules for outbound traffic on source clients. Deploy individual routes with /32 prefix to override private endpoint routes        |
|Private Endpoints cannot be created in subnets enabled for service endpoint or specialized workloads    |Private Endpoints cannot be deployed on subnets enabled for service endpoints or subnets delegated to specialized workloads|  Create a separate subnet to deploy the private endpoints.        |
|private endpoint can only be mapped to private link service (customer owned) in the same region    |   Connecting to a private link service (your own) from a different region is not supported       |  During Preview, you must deploy your Private Link service in the same region.        |
|  Peered Virtual Network with Private endpoints only are not supported   |   When connecting to private endpoints on a peered Virtual Network without any other workload is not supported       | Deploy a single VM on the peered Virtual Network to enable the connectivity |
|Specialized workloads cannot access private endpoints    |   The following services deployed into your virtual network cannot access any private link resource using private endpoints:<br>App Service Plan</br>Azure Container Instance</br>Azure NetApp Files</br>Azure Dedicated HSM<br>       |   No mitigation during preview.       |


## Next steps
- [Create a Private Endpoint for SQL Database Server using Portal ](create-private-endpoint-portal.md)
- [Create a Private Endpoint for SQL Database Server using PowerShell ](create-private-endpoint-powershell.md)
- [Create a Private Endpoint for SQL Database Server using CLI ](create-private-endpoint-cli.md)
- [Create a Private Endpoint for Storage account using Portal ](create-private-endpoint-storage-portal.md)
- [Create your own Private Link service using Azure PowerShell](create-private-link-service-powershell.md)
