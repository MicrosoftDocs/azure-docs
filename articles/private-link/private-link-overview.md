---
title: What is Azure Private Link?
description: Learn how to use Azure Private Link to access Azure PaaS Services (for example, Azure Storage and SQL Database) and Azure hosted customer/partner services over a Private Endpoint in your virtual network.
services: private-link
author: malopMSFT
# Customer intent: As someone with a basic network background, but is new to Azure, I want to understand the capabilities of Azure Private Link so that I can securely connect to my Azure PaaS services within the virtual network.

ms.service: private-link
ms.topic: overview
ms.date: 01/09/2020
ms.author: allensu
ms.custom: fasttrack-edit

---
# What is Azure Private Link? (Preview)
Azure Private Link enables you to access Azure PaaS Services (for example, Azure Storage, Azure Cosmos DB, and SQL Database) and Azure hosted customer/partner services over a [Private Endpoint](private-endpoint-overview.md) in your virtual network. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. You can also create your own [Private Link Service](private-link-service-overview.md) in your virtual network (VNet) and deliver it privately to your customers. The setup and consumption experience using Azure Private Link is consistent across Azure PaaS, customer-owned, and shared partner services.

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details. For known limitations, see [Private Endpoint](private-endpoint-overview.md#limitations) and [Private Link Service](private-link-service-overview.md#limitations).


![Private endpoint overview](media/private-link-overview/private-endpoint.png)

## Key benefits
Azure Private Link provides the following benefits:  
- **Privately access services on the Azure platform**: Connect your virtual network to services running in Azure privately without needing a public IP address at the source or destination. Service providers can render their services privately in their own virtual network and consumers can access those services privately in their local virtual network. The Private Link platform will handle the connectivity between the consumer and services over the Azure backbone network. 
 
- **On-premises and peered networks**: Access services running in Azure from on-premises over ExpressRoute private peering/VPN tunnels (from on-premises) and peered virtual networks using private endpoints. There is no need to set up public peering or traverse the internet to reach the service. This ability provides a secure way to migrate workloads to Azure.
 
- **Protection against data exfiltration**:  With Azure Private Link, the private endpoint in the VNet is mapped to a specific instance of the customer's PaaS resource as opposed to the entire service. Using the private endpoint consumers can only connect to the specific resource and not to any other resource in the service. This in built mechanism provides protection against data exfiltration risks. 
 
- **Global reach**: Connect privately to services running in other regions. This means that the consumer's virtual network could be in region A and it can connect to services behind Private Link in region B.  
 
- **Extend to your own services**: Leverage the same experience and functionality to render your own service privately to your consumers in Azure. By placing your service behind a Standard Load Balancer you can enable it for Private Link. The consumer can then connect directly to your service using a Private Endpoint in their own VNet. You can manage these connection requests using a simple approval call flow. Azure Private Link works for consumers and services belonging to different Active Directory tenants as well. 

## Availability 
 The following table lists the Private Link services and the regions where they are available. 

|Scenario  |Supported services  |Available regions | Status  |
|:---------|:-------------------|:-----------------|:--------|
|Private Link for customer-owned services|Private Link services behind Standard Load Balancer | All public regions  | Preview  |
|Private Link for Azure PaaS services   | Azure Storage        |  All public regions      | Preview <br/> [Learn more](/azure/storage/common/storage-private-endpoints).  |
|  | Azure Data Lake Storage Gen2        |  All public regions      | Preview <br/> [Learn more](/azure/storage/common/storage-private-endpoints).  |
|  |  Azure SQL Database         | All public regions      |   Preview      |
||Azure SQL Data Warehouse| All public regions |Preview|
||Azure Cosmos DB| West Central US, WestUS, North Central US |Preview|
|  |  Azure Database for PostgreSQL - Single server         | All public regions      |   Preview      |
|  |  Azure Database for MySQL         | All public regions      |   Preview      |
|  |  Azure Database for MariaDB         | All public regions      |   Preview      |
For the most up-to-date notifications, check the [Azure Virtual Network updates page](https://azure.microsoft.com/updates/?product=virtual-network).

## Logging and monitoring

Azure Private Link is integrated with Azure Monitor which allows you to archive logs to a storage account, stream events to your Event Hub, or send them to Azure Monitor logs. You can access the following information on Azure Monitor: 
- **Private endpoint**: Data processed by the Private Endpoint  (IN/OUT)
 
- **Private Link service**:
    - Data processed by the Private Link service (IN/OUT)
    - NAT port availability  
 
## Pricing   
For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).
 
## FAQs  
For FAQs, see [Azure Private Link FAQs](private-link-faq.md).
 
## Limits  
For limits, see [Azure Private Link limits](../azure-resource-manager/management/azure-subscription-service-limits.md#private-link-limits).

## Next steps
- [Create a Private Endpoint for SQL Database Server using Portal ](create-private-endpoint-portal.md)
- [Create a Private Endpoint for SQL Database Server using PowerShell ](create-private-endpoint-powershell.md)
- [Create a Private Endpoint for SQL Database Server using CLI ](create-private-endpoint-cli.md)
- [Create a Private Endpoint for Storage account using Portal ](create-private-endpoint-storage-portal.md)
- [Create a Private Endpoint for Azure Cosmos account using Portal ](../cosmos-db/how-to-configure-private-endpoints.md)
- [Create your own Private Link service using Azure PowerShell](create-private-link-service-powershell.md)


 
