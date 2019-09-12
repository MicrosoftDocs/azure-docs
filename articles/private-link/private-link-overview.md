---
title: What is Azure Private Link?
description: Learn about Azure Private Link.
services: virtual-network
author: KumudD
# Customer intent: As someone with a basic network background, but is new to Azure, I want to understand the capabilities of Azure Private Link so that I can securely connect to my Azure PaaS services within the virtual network.

ms.service: virtual-network
ms.topic: overview
ms.date: 09/05/2019
ms.author: kumud

---
# What is Azure Private Link? (Preview)

Azure Private Link provides private connectivity between applications running in different Virtual Networks and to Azure PaaS services (such as Storage, SQL, Cosmos DB etc.) using the Microsoft network. Azure Private Link simplifies the network architecture and secures the connection between endpoints in Azure by eliminating the data exposure to the public internet. Azure Private Link also extends this ability to customer owned services as well as shared market place services ran by the partners. The setup and consumption experience using Azure private link is consistent across Azure PaaS, customer owned services, and shared partner services. The technology works on a provider and consumer model where the provider renders the service and consumer consumes the service. Connection is established between the provider and the consumer based on an approval call flow; once established all data that flows between the service provider and service consumer is isolated from internet and stays on the Microsoft backend. Both the provider and the consumer need to be on Azure to use the Azure Private Link service. There is no need for any sort of gateways, NAT devices, ExpressRoute, VPN connections, or public IP addresses to communicate with the service.   

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## Why use Azure private link?
Prior to using Azure Private Link, Azure Shared PaaS was accessed over either 1) Public endpoints (internet routable public IPs exposed by the service) or 2) Virtual network service endpoints. In both cases, Azure customers have to configure their Network Security Groups to allow access to internet routable service public IPs to access the service. Accessing services over Public IPs poses a security risk. Moreover, there is a risk of Data exfiltration with both access methods. 
 
Similarly, shared services offered by Microsoft Partners and customer owned services residing in one virtual network are accessed over either 1) Public endpoints or 2) Virtual network peering. In the first method, Network Security groups need to allow access to internet routable address space that poses security risk. In the second method, virtual network peering imposes restrictions in terms of non-overlapping IP address space requirements.  
 
Azure Private Link addresses the above issues and allows setting up TCP connectivity between applications running in different virtual networks and to Azure PaaS services in a simple, secure, and scalable manner.

## Key benefits
Azure Private Link provides the following benefits:  
- **Privately access services on Azure platform**: With Azure Private Link, you can connect your virtual networks to services delivered on the Azure platform in a secure and scalable manner. Service Providers can render their services privately in Consumer’s virtual networks and service consumers can consume services privately in their virtual networks on the Azure Platform. 
 
- **Works with on-premises and peered networks**: With Azure Private Link, customers can access private endpoints over private peering/VPN tunnels (from on-prem) and peered virtual networks. Traffic from the private endpoint to the service will be route optimized and will be carried over the Microsoft backbone. There is no need to set up public peering or traverse internet to reach the service. This ability provides flexibility for customers to migrate their workloads to the cloud.  
 
- **Data Exfil protection**: With Azure Private Link, you get implicit Data Exfil protection when connecting to Azure PaaS. Individual Azure PaaS resources are mapped to the private endpoints instead of the Azure Service. Hence a malicious insider can only access the mapped account and no other account thus eliminating the data exfil threat. 
 
- **Meet compliance needs**: With Azure Private Link, customer information is shared with services on the Azure Platform over a secured Microsoft backbone and doesn’t traverse the internet. It helps to prevent information from being compromised and maintains compliance with regulation authorities such as HIPAA or PCI.
 
- **Global reach**: With Azure Private Link, you can connect privately to services running in other regions. This means that the consumers virtual network and services can be in different regions. Azure Private Link is global in nature and there are no regional restrictions.   
 
- **Extend to your own services**: With Azure Private Link, you can leverage the same experience and functionality to render your own service privately in your customer virtual networks or your own virtual networks on the Azure platform. Azure Private Link works across AD tenants and work on the providers consumer model with a approval call flow. Moreover, there is no requirement of non-overlapping address spaces as in virtual network peering.

## Private Link service
The Private Link service is a virtual networking resource, modeled as a Network Interface card in the Service Provider's Virtual Network. This resource is applicable mainly in Microsoft partner Service and Customer own service scenarios. Service Providers need to create the resource to let consumers consume the service privately over the Azure Private Link. The resource is tied to the front-end IP configuration of a Standard Load Balancer. The Private Link service serves as a front end for the Service Provider's applications that are running behind the standard load balancer. Service consumers connect to the Private Link service over the Azure Private Link through private endpoints in the consumer's virtual networks. For more information about Private link service, see [What is Private Link service?](private-link-service-overview.md).

## Private Endpoint
Private Endpoint is a virtual networking resource, modeled as Network Interface card, in Service consumer's Virtual Network. Private Endpoints get assigned a private IP from the customer's virtual network. Private endpoints enables Azure customers to privately connect to supported Azure services through Azure Private Link. These services can include Azure PaaS, Microsoft partner services, and customer owned services. Supported Azure services are mapped inside the customer's virtual network as private endpoints. Private endpoints are the entry points for the service traffic over Private Links from Azure virtual network resources. The traffic never leaves the Microsoft Backbone. These 
are highly available instances and do not pose any bandwidth restrictions on the service traffic.
For more information about Private Link service, see [What is Private Endpoint?](private-endpoint-overview.md).

![Private endpoint overview](media/private-link-overview/private-endpoint.png)
## Availability 
 The following table lists the Private Link services and the regions where they are available:


|Scenario  |Supported services   |Availability regions |Time of availability   |
|---------|---------|---------|---------|
|Private Link for customer-owned services|Private Link services behind Standard Load Balancer |WestCentralUS; WestUS; SouthCentralUS; EastUS; NorthUS; WestUS2  |  Preview  |
|Private Link for Azure PaaS services   | Azure Storage        |  EastUS, WestUS, WestCentralUS, WestUS2       | Preview         |
|  | Azure Data Lake Service Gen2        |  EastUS, WestUS, WestCentralUS, WestUS2       | Preview         |
|  |  Azure SQL Database         | Azure Public Cloud Regions         |   Preview      |
||Azure SQL Data Warehouse|Azure Public Cloud Regions|Preview|


For the most up-to-date notifications, check the [Azure Virtual Network updates page](https://azure.microsoft.com/updates/?product=virtual-network). 

## Logging and Monitoring

Azure private link is fully integrated with Azure Monitor.  All events are integrated with Azure Monitor allow you to archive logs to a storage account, stream events to your Event Hub, or send them to Azure Monitor logs. You can access following information on Azure Monitor: 
- **Private endpoint**: Data processed by the Private Endpoint  (IN/OUT)
 
- **Private Link service**:
    - Data processed by the Private Link service (IN/OUT)
    - NAT port availability  
 
## Pricing   
For pricing details, see [Azure private link pricing](https://azure.microsoft.com/pricing/details/private-link/).
 
## FAQs  
For FAQs, see [Azure private link FAQs](private-link-faq.md).
 
## Limits  
For limits, see [Azure private link limits](../azure-subscription-service-limits.md#private-link-limits).

## Next steps
- [Create a Private Link service using Azure PowerShell](create-private-link-service-powershell.md)
 
