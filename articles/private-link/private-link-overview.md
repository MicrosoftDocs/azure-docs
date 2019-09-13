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

Azure Private Link provides private connectivity between applications running in different virtual networks and to Azure PaaS services (such as Storage, SQL Database, etc.) using the Microsoft network. Azure Private Link simplifies the network architecture and secures the connection between endpoints in Azure by eliminating data exposure to the public internet. Azure Private Link also extends this ability to customer-owned services and shared marketplace services run by partners. The setup and consumption experience using Azure Private Link is consistent across Azure PaaS, customer-owned services, and shared partner services. The technology works on a provider and consumer model where the provider renders the service and consumer consumes the service. A connection is established between the provider and the consumer based on an approval call flow. After the connection is established, all data that flows between the service provider and service consumer is isolated from the internet and stays on the Microsoft backend. Both the provider and the consumer must be on Azure to use the Azure Private Link service. There is no need for any sort of gateways, NAT devices, ExpressRoute, VPN connections, or public IP addresses to communicate with the service.   

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## Why use Azure Private Link?
Before Azure Private Link, Azure shared PaaS was accessed over either 1) Public endpoints (internet routable public IP addresses exposed by the service) or 2) Virtual network service endpoints. In both cases, Azure customers have to configure their network security groups (NSGs) to allow access to internet-routable service public IP addresses to access the service. Accessing services over public IP addresses poses a security risk. Moreover, there is a risk of data exfiltration with both access methods. 
 
Similarly, shared services offered by Microsoft partners and customer-owned services that reside in one virtual network are accessed over either 1) Public endpoints or 2) Virtual network peering. In the first method, NSGs need to allow access to internet-routable address space which poses a security risk. In the second method, virtual network peering imposes restrictions in terms of non-overlapping IP address space requirements.  
 
Azure Private Link addresses these issues and allows you to set up TCP connectivity between applications that run in different virtual networks and to Azure PaaS services in a simple, secure, and scalable manner.

## Key benefits
Azure Private Link provides the following benefits:  
- **Privately access services on the Azure platform**: With Azure Private Link, you can connect your virtual networks to services delivered on the Azure platform in a secure and scalable manner. Service providers can render their services privately in consumer’s virtual networks and service consumers can consume services privately in their virtual networks on the Azure platform. 
 
- **Works with on-premises and peered networks**: With Azure Private Link, customers can access private endpoints over private peering/VPN tunnels (from on-premises) and peered virtual networks. Traffic from the private endpoint to the service are route-optimized and are carried over the Microsoft backbone. There is no need to set up public peering or traverse the internet to reach the service. This ability provides flexibility for customers to migrate their workloads to the cloud.  
 
- **Data Exfil protection**: With Azure Private Link, you get implicit Data Exfil protection when connecting to Azure PaaS. Individual Azure PaaS resources are mapped to the private endpoints instead of the Azure service. Therefore, a malicious insider can access only the mapped account and no other account thus eliminating the data exfil threat. 
 
- **Meet compliance needs**: With Azure Private Link, customer information is shared with services on the Azure platform over a secured Microsoft backbone and doesn’t traverse the internet. This helps to prevent information from being compromised and maintains compliance with regulation authorities such as HIPAA or PCI.
 
- **Global reach**: With Azure Private Link, you can connect privately to services running in other regions. This means that the consumers virtual network and services can be in different regions. Azure Private Link is global in nature and there are no regional restrictions.   
 
- **Extend to your own services**: With Azure Private Link, you can leverage the same experience and functionality to render your own service privately in your customer virtual networks or your own virtual networks on the Azure platform. Azure Private Link works across Active Directory tenants and work on the provider's consumer model with an approval call flow. Moreover, there is no requirement of non-overlapping address spaces as in virtual network peering.

## Private Link service
The Private Link service is a virtual networking resource, modeled as a network interface card in the service provider's virtual network. This resource is applicable mainly in Microsoft partner service and customer-owned service scenarios. Service providers need to create the resource to let consumers consume the service privately over the Azure Private Link. The resource is tied to the front-end IP configuration of a Standard Load Balancer. The Private Link service serves as a front end for the service provider's applications that are running behind the Standard Load Balancer. Service consumers connect to the Private Link service over the Azure Private Link through private endpoints in the consumer's virtual networks. For more information about the Private Link service, see [What is Private Link service?](private-link-service-overview.md)

## Private Endpoint
Private Endpoint is a virtual networking resource, modeled as a network interface card, in a service consumer's virtual network. Private endpoints get assigned a private IP address from the customer's virtual network. Private endpoints enable Azure customers to privately connect to supported Azure services through Azure Private Link. These services can include Azure PaaS, Microsoft partner services, and customer-owned services. Supported Azure services are mapped inside the customer's virtual network as private endpoints. Private endpoints are the entry points for the service traffic over Private Links from Azure virtual network resources. The traffic never leaves the Microsoft backbone. These are highly available instances and do not pose any bandwidth restrictions on the service traffic.
For more information about Private Endpoint, see [What is Private Endpoint?](private-endpoint-overview.md)

![Private endpoint overview](media/private-link-overview/private-endpoint.png)

## Availability 
 The following table lists the Private Link services and the regions where they are available. Note that the Private Link Service and the VNet hosting the private endpoint must be in the same region.


|Scenario  |Supported services   |Available regions |Time of availability   |
|---------|---------|---------|---------|
|Private Link for customer-owned services|Private Link services behind Standard Load Balancer |WestCentralUS; WestUS; SouthCentralUS; EastUS; NorthUS  |  Preview  |
|Private Link for Azure PaaS services   | Azure Storage        |  EastUS, WestUS, WestCentralUS, WestUS2       | Preview         |
|  | Azure Data Lake Storage Gen2        |  EastUS, WestUS, WestCentralUS, WestUS2       | Preview         |
|  |  Azure SQL Database         | Azure Public cloud regions         |   Preview      |
||Azure SQL Data Warehouse|Azure Public cloud regions|Preview|


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
- [Create a Private Link service using Azure PowerShell](create-private-link-service-powershell.md)
 
