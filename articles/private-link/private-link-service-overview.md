---
title: Azure Private Link Service
description: Learn about Azure Private Link Services
services: virtual-network
author: KumudD
# Customer intent: As someone with a basic network background, but is new to Azure, I want to understand the  Azure Private Service concepts so that I can securely deliver them to my customers.

ms.service: virtual-network
ms.topic: article
ms.date: 09/06/2019
ms.author: kumud

---
# What is a Private Link Service? (Preview)

Using Private Link technology, you can create your own Private Link Service in your VNet. You can deliver this service privately to your customers by mapping it to Private Endpoint inside customer's VNet. This article explains private link service concepts, to help you use them effectively. 

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## Concepts
 
- **Standard Load Balancer**: Private Link Service can be created only using Standard Load Balancer. There is no support for Private Link Service on Basic Load Balancer SKU.  
 
- **Load Balancer Frontend IP Configurations**: Private Link Service is tied to frontend IP of an Standard Load Balancer. At the time of Private Link Service creation, you can choose the standard load balancer and associated frontend IP configuration where you want to run your service. All traffic destined for Service will reach the frontend of SLB. You can configure SLB rules to direct this traffic to appropriate backend pools where your applications are running. Note that load balancer frontend IP configurations are different than NAT IP configurations.   
 
- **NAT IP**: NAT stands for Network Address Translation. At the time of Private Link Service creation, you are asked to provide a NAT IP. This NAT IP can be chosen from any subnet in service provider's virtual network.   Private Link Service perform destination side NAT-ing on the private link traffic. This ensures that there is no IP conflict between source (consumer side) and destination (service provider) address space. On the destination side (service provider side), NAT IP will show up as Source IP for all packets received by your service and destination IP for all packets send by your service. NAT-ing also helps service providers to scale. Service Providers can assign up to 8 NAT IPs per private link service. With each NAT IP you can assign more ports for your TCP connections and scale out.  
 
- **FQDN**: FQDN stands for Fully Qualified Domain Name. Service Provider can share service’s FQDNs at the time of creation. These will be propagated to consumers at time of connection. Consumers can use these FQDNs to configure their DNS to resolve to private endpoint on their side. Note that Alias is used for connection request, not FQDN. FQDNs are for DNS configurations.   
 
- **Alias**: "Alias" is a globally unique name for your Service. It helps you mask the PII information for your service and at the same time create an easy to share name for your service. When you create a private link service, Azure will generate the alias for your service that you can share with your customers. Your customers can use this alias to request a connection to you service.  
Alias is composed of 3 parts: *Prefix*.*GUID*.*Suffix* 
- Prefix is the Service Name. You can pick you own prefix. Note that once *Alias* is created, you can't change it, so select your prefix appropriately.  
- GUID will be provided by platform. Will make name globally unique. 
- Suffix will be appended by Azure: *region*.azure.privatelinkservice. 
- Complete alias will be as follows:
    - *Prefix*. {GUID}.*region*.azure.privatelinkservice 
 
- **Visibility**:  Visibility lets you control how you expose your service. We offer you few different options to let you control the exposure of you service from being completely private (only visible to you) to being completely public (visible to everyone). Note that only consumers that can discover the service through Azure clients can request the connection. Visibility is an array and you can choose from following options:  
    - Visibility: Role Base Access Control Only 
        - Intake parameter: {} 
        - Your service is not discoverable from consumer side 
        - Only discoverable to customers with RBAC permissions 
    - Visibility: Anyone with Alias 
        - Intake parameter: {*} 
        - Discoverable to all Azure customers. All Azure subscriptions can discover your service  
        - Customers will need your alias for discovering your service. You need to share the alias offline.  
    - Visibility: Restricted by subscriptions  
        - Intake parameter:  {sub1, sub2, sub3}  
        - Discoverable to customer with RBAC permissions and to user subscriptions in your selected list 
        - Costumers not in visibility list will not discover the service even with alias unless added to visibility list 
 
- **Auto-Approval**: Auto-Approval is an ability for Service Providers to pre-approve set of subscriptions for automated access to their service. Customers will need to share their subscriptions offline for Service providers to add to auto-approval array. Auto-approval is a subset of visibility array.  Visibility controls the exposure settings whereas auto-approval controls the approval settings for your service. If a customer requests a connection from a subscription in auto-approval array, the connection will be automatically approved and connection will be established. Service provider don’t need to manually approve the request. On the other hand, if a customer requests a connection from a subscription in visibility array and not in auto-approval array, the request will reach service provider but service provider has to manually approve the connections.    
    - Auto Approval 
        - Intake parameters {sub1; sub2; sub3} 
        - Pre-approved subscriptions that can connect to Private Link Service. 
 
- **Private Endpoint Connections**: Private Endpoints connecting to Private link service show up as Private Endpoint connections on the Private link service. Multiple private endpoints can connect to same Private Link Service and Service provider can control state for individual private endpoints. 
 
- **Call flow states and operations** 
    - **States**:  
        - *Pending* - Service consumer requested to connect to Private Link Service. Waiting for service provider decision.  
        - *Approved* - Service Provider approved the service consumer's request. Connection is established.   
        - *Rejected* - Service Provider has rejected the service consumer's request/connection.  
    - **Operations**: 
        - *Create/Update* – Create/Update a Private Link Service. 
        - *Delete* - Delete a Private Link Service. 
## Next steps
- [Create a Private Link service using Azure PowerShell](create-private-link-service-powershell.md)
 
