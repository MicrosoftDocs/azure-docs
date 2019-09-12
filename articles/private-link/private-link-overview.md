---
title: WHat is Azure private link?
description: Learn about Azure private link.
services: virtual-network
author: KumudD
# Customer intent: As someone with a basic network background, but is new to Azure, I want to understand the capabilities of Azure private link so that I can securely connect to my Azure PaaS services within the virtual network.

ms.service: virtual-network
ms.topic: overview
ms.date: 09/05/2019
ms.author: kumud

---
# What is Azure private link? (Preview)

Azure private link provides private connectivity between applications running in different Virtual Networks and to Azure PaaS services (such as Storage, SQL, Cosmos DB etc.)  using the Microsoft network. Azure private link simplifies the network architecture and secures the connection between endpoints in Azure by eliminating the data exposure to public internet. Azure private link also extends this ability to customer owned services as well as shared market place services run by the partners. The setup and consumption experience using Azure private link is consistent across Azure PaaS, customer owned services, and shared partner services.  The technology works on a provider and consumer model where the provider renders the service and consumer consumes the service.  Connection is established between provider and consumer based on an approval call flow and once established all data that flows between the service provider and service consumer is isolated from internet and stays on the Microsoft backend.  Both provider and consumer need to be on Azure to use Azure private link. There is no need for any sort of gateways, NAT devices, ExpressRoute, or VPN connections, public IP addresses to communicate with the service.   

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## Why use Azure private link?
Prior to using Azure private link,  Azure Shared PaaS was accessed over either 1) Public endpoints (internet routable public IPs exposed by service) or 2) Virtual network service endpoints. In both cases, Azure customers have to configure their Network Security Groups to allow access to internet routable service public IPs to access the Service. Accessing Service over Public IPs poses a security risk. Moreover, there is a risk of Data exfiltration with both above access methods.  
 
Similarly, shared services offered by Microsoft Partners and customer's own services residing in one virtual network were accessed over either 1) Public endpoints or 2) Virtual network peering. In first method, Network Security group needs to allow access to Internet routable address space that poses security risk. In second method, virtual network peering imposes restrictions in terms of non-overlapping IP address space requirements.  
 
Azure private link addresses above issues and allows setting up TCP connectivity between applications running in different virtual networks and to Azure PaaS services in a simple, secure, and scalable manner. 

## Key benefits
Azure private link provides following benefits:  
- **Privately access services on Azure platform**: With Azure private link, you can connect your virtual networks to services delivered on Azure platform  in a secure and scalable manner. Service Providers can render their services privately in Consumer’s virtual networks and service consumers can consume services privately in their virtual networks on Azure Platform. 
 
- **Works with on-premises and peered networks**: With Azure private link, customer can access private endpoints over private peering/VPN tunnels (from on-prem) and also from peered virtual networks. Traffic from private endpoint to service will be route optimized and will be carried over Microsoft backbone. There is no need to set up public peering or traverse internet to reach the service. This ability provides flexibility for customers to migrate their workloads to cloud.  
 
- **Data Exfil protection**: With Azure private link, you get implicit Data Exfil protection when connecting to Azure PaaS. Individual Azure PaaS resources are mapped to the private endpoints instead of Azure Service. Hence a malicious insider can only access the mapped account and no other account thus eliminating the data exfil threat. 
 
- **Meet compliance needs**: With Azure private link, customer information is shared with services on Azure Platform over a secured Microsoft backbone and doesn’t traverse the internet. It helps with information not getting compromised and maintains compliance with regulation authorities such as HIPAA or PCI.  
 
- **Global reach**: With Azure private link, you can connect privately to service running in other regions. This means that the consumer virtual network and service can be in different regions. Azure private link is global in nature and there are no regional restrictions.      
 
- **Extend to your own services**: With Azure private link, you can leverage the same experience and functionality to render your own service privately in your customer virtual networks or your own virtual networks on Azure platform. Azure private link works across AD tenants and works on provider consumer model with approval call flow. Moreover, there is no requirement of non-overlapping address space as in virtual network peering.

## Private link service
Private link service is a virtual networking resource, modeled as Network Interface card, in Service Provider's Virtual Network. This resource is applicable mainly in Microsoft partner Service and Customer own service scenarios. Service Provider needs to create this resource to let consumers consume the service privately over Azure private link.  The resource is tied to front-end IP configuration of a Standard Load Balancer. Private link service serves as a front end for the Service Provider's applications that are running behind the standard load balancer. Service consumers connect to private link service over Azure private link through private endpoints in consumer's virtual networks.
For more information about Private link service, see [What is private link service](private-link-overview.md)
## Private endpoint
Private Endpoint is a virtual networking resource, modeled as Network Interface card, in Service consumer's Virtual Network. Private Endpoints  get assigned a private IP from customer's virtual network. private endpoint enables Azure customers to privately connect to supported Azure services through Azure private link. These services can include Azure PaaS, Microsoft partner services and customer owned services. Supported Azure services are mapped inside the customer's virtual network as private endpoint. Private endpoint is the entry point for service traffic over private link from Azure virtual network resources. The traffic never leaves Microsoft Backbone. These are highly available instances and don’t impose any bandwidth restrictions on the Service traffic.
For more information about Private link service, see [What is private endpoint?](private-endpoint-overview.md)

![Private endpoint overview](media/private-link-overview/private-endpoint.png)
## Availability 
 The following table lists the services/regions that the Azure private link service is available:


|Scenario  |Supported services   |Availability regions |Time of availability   |
|---------|---------|---------|---------|
|Private link for customer-owned services|Private link services behind Standard Load Balancer |WestCentralUS; WestUS; SouthCentralUS; EastUS; NorthUS; WestUS2  |  Preview  |
|Private link for Azure PaaS Services   | Azure Storage        |  EastUS, WestUS, WestCentralUS, WestUS2       | Preview         |
|  | Azure Data Lake Service gen2        |  EastUS, WestUS, WestCentralUS, WestUS2       | Preview         |
|  |  Azure SQL Database         | Azure Public Cloud Regions         |   Preview      |
||Azure SQL Datawarehouse|Azure Public Cloud Regions|Preview|


For the most up-to-date notifications, check the [Azure Virtual Network updates page](https://azure.microsoft.com/updates/?product=virtual-network). 

## Logging and monitoring

Azure private link is fully integrated with Azure Monitor.  All events are integrated with Azure Monitor, allowing you to archive logs to a storage account, stream events to your Event Hub, or send them to Azure Monitor logs. You can access following info on Azure Monitor: 
- **Private endpoint**: Data processed by private endpoint  (IN/OUT)
 
- **Private link service**:
    - Data processed by private link service (IN/OUT)
    - NAT port availability  
 
## Pricing   
For pricing details, see [Azure private link pricing](https://azure.microsoft.com/pricing/details/private-link/).
 
## FAQs  
For FAQs, see [Azure private link FAQs](private-link-faq.md).
 
## Limits  
For limits, see [Azure private link limits](../azure-subscription-service-limits.md#private-link-limits).

## Next steps
- [Create a Private Link service using Azure PowerShell](create-private-link-service-powershell.md)
 
