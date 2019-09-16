---
title: What is Azure Private Link?
description: Learn about Azure Private Link.
services: virtual-network
author: KumudD
# Customer intent: As someone with a basic network background, but is new to Azure, I want to understand the capabilities of Azure Private Link so that I can securely connect to my Azure PaaS services within the virtual network.

ms.service: virtual-network
ms.topic: overview
ms.date: 09/17/2019
ms.author: kumud

---
# What is Azure Private Link? (Preview)
Azure Private Link enables you to access Azure PaaS Services (for example, Azure Storage and SQL Database) and Azure hosted customer/partner services over a [Private Endpoint](private-endpoint-overview.md) in your virtual network. You can also create your own [Private Link Service](private-link-service-overview.md) in your virtual network (VNet) and deliver it privately to your customers. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. The setup and consumption experience using Azure Private Link is consistent across Azure PaaS, customer-owned, and shared partner services.

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

> For known limitations, see [Private Endpoint](private-endpoint-overview.md#limitations) and [Private Link Service](private-link-service-overview.md#limitations).
>

![Private endpoint overview](media/private-link-overview/private-endpoint.png)

## Key benefits
Azure Private Link provides the following benefits:  
- **Privately access services on the Azure platform**: Connect your virtual network to services running in Azure privately without needing a public IP address at the source or destination. Service providers can render their services privately in their own virtual network and consumers can access those services privately in their local virtual network. The Private Link platform will handle the connectivity between the consumer and services over the Azure backbone network. 
 
- **On-premises and peered networks**: Access services running in Azure from on-premises over ExpressRoute private peering/VPN tunnels (from on-premises) and peered virtual networks using private endpoints. There is no need to set up public peering or traverse the internet to reach the service. This ability provides a secure way to migrate workloads to Azure.
 
- **Protection against data exfilteration**:  With Azure Private Link, the private endpoint in the VNet is mapped to a specific instance of the customer's PaaS resource as opposed to the entire service. Using the private endpoint consumers can only connect to the specific resource and not to any other resource in the service. This in built mechanism provides protection against data exfilteration risks. 
 
- **Global reach**: Connect privately to services running in other regions. This means that the consumer's virtual network could be in region A and it can connect to services behind Private Link in region B.  
 
- **Extend to your own services**: With Azure Private Link, you can leverage the same experience and functionality to render your own service privately in your customer virtual networks or your own virtual networks on the Azure platform. Azure Private Link works across Active Directory tenants and work on the provider's consumer model with an approval call flow. Moreover, there is no requirement of non-overlapping address spaces as in virtual network peering.

## Why use Azure Private Link?
Use Azure Private Link to access Azure services or your own services privately and securely. Previously, Azure services (such as Storage, SQL, etc.) or customer-owned services needed to be accessed over Public IP endpoints. With Azure Private Link, this is no longer the case. The need for Internet exposed endpoints is removed. You can privately connect to services in other Virtual Networks easily and securely.

## Availability 
 The following table lists the Private Link services and the regions where they are available. Note that the Private Link Service and the VNet hosting the private endpoint must be in the same region.


|Scenario  |Supported services   |Available regions | Status   |
|---------|---------|---------|---------|
|Private Link for customer-owned services|Private Link services behind Standard Load Balancer |West Central US; WestUS; South Central US; East US; North US  |  Preview  |
|Private Link for Azure PaaS services   | Azure Storage        |  East US, West US, West Central US       | Preview         |
|  | Azure Data Lake Storage Gen2        |  East US, West US, West Central US       | Preview         |
|  |  Azure SQL Database         | West Central US; WestUS; South Central US; East US; North US       |   Preview      |
||Azure SQL Data Warehouse| West Central US; WestUS; South Central US; East US; North US |Preview|


For the most up-to-date notifications, check the [Azure Virtual Network updates page](https://azure.microsoft.com/updates/?product=virtual-network). 

## Logging and monitoring

Azure Private Link is fully integrated with Azure Monitor. This integration allows you to archive logs to a storage account, stream events to your Event Hub, or send them to Azure Monitor logs. You can access the following information on Azure Monitor: 
- **Private endpoint**: Data processed by the Private Endpoint  (IN/OUT)
 
- **Private Link service**:
    - Data processed by the Private Link service (IN/OUT)
    - NAT port availability  
 
## Pricing   
For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).
 
## FAQs  
For FAQs, see [Azure Private Link FAQs](private-link-faq.md).
 
## Limits  
For limits, see [Azure Private Link limits](../azure-subscription-service-limits.md#private-link-limits).

## Next steps
- [Create a Private Endpoint for SQL Database Server using Portal ](create-private-endpoint-portal.md)
- [Create a Private Endpoint for SQL Database Server using PowerShell ](create-private-endpoint-powershell.md)
- [Create a Private Endpoint for SQL Database Server using CLI ](create-private-endpoint-cli.md)
- [Create a Private Endpoint for Storage account using Portal ](create-private-endpoint-storage-portal.md)
- [Create your own Private Link service using Azure PowerShell](create-private-link-service-powershell.md)


 
