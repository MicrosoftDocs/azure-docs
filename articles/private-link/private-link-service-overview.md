---
title: What is Azure Private Link Service?
description: Learn about Azure Private Link Service.
services: virtual-network
author: KumudD
ms.service: virtual-network
ms.topic: conceptual
ms.date: 09/17/2019
ms.author: kumud

---
# What is Azure Private Link Service?

Azure Private Link service is a service you can create in your virtual network (VNet) and deliver it privately to your customers. Your customers can access this service by mapping it to private endpoint inside their VNets. This article explains Private Link service concepts to help you use them effectively. 

## Workflow

![Private Link service workflow](media/private-link-service-overview/workflow-private-link-service.png)

### Create your Private Link Service

- Choose a name, location, and virtual network for your service.  
- Create either an internal load balancer (ILB) or a public load balancer. 
    > [!NOTE]
    > Azure Private Link Service is only supported on Standard Load Balancer. 
- Map the backend resources from the selected VNet to the load balancer. It is advisable to have at least one backend resource behind the load balancer.  
- Create a Private Link Service using the load balancer. In the load balancer selection process, choose the frontend IP configuration where you want to receive the traffic. Choose a subnet for NAT IP addresses for the Private Link Service. It is recommended to have at least eight NAT IP addresses available in the subnet. All consumer traffic will appear to originate from this pool of private IP addresses to the service provider. Choose the appropriate properties/settings for the Private Link Service.    
 
### Share your service

After you create a Private Link Service, the Azure infrastructure will generate a globally unique "alias" based on the name you provide for your service. You can share the alias with your customers offline or advertise it publicly. Consumers can start a Private Link connection using this alias.
 
### Manage your connection requests

After a consumer initiates a connection, the service provider can accept or reject the connection request. All connection requests will be listed under the **privateendpointconnections** property on the Private Link Service.
 
### Delete your service

If the Private Link Service is no longer in use, you can delete it. However, before your delete the service, ensure that there are no private endpoint connections associated with it. You can reject all connections and delete the service.

## Properties

A Private Link Service specifies the following properties: 

|Property |Explanation  |
|---------|---------|
|Provisioning State (provisioningState)  |A read-only property that lists the current provisioning state for Private Link Service. Applicable provisioning states are: "Deleting; Failed; Succeeded; Updating". When the provisioning state is "Succeeded", you have successfully provisioned your Private Link Service.        |
|Alias (alias)     | Alias is a globally unique read-only string for your service. It helps you mask the customer data for your service and at the same time creates an easy-to-share name for your service. When you create a Private Link Service, Azure generates the alias for your service that you can share with your customers. Your customers can use this alias to request a connection to your service.          |
|Visibility (visibility)     | Visibility is the property that controls the exposure settings for your Private Link Service. Service providers can choose to limit the exposure to their service to subscriptions with role-based access control (RBAC) permissions, a restricted set of subscriptions, or all Azure subscriptions.          |
|Auto Approval (autoApproval)    |   Auto-approval controls the automated access to the Private Link Service. The subscriptions specified in the auto-approval list are approved automatically when a connection is requested from private endpoints in those subscriptions.          |
|FQDN (fqdns)    |   FQDN stands for fully qualified domain name. Service provider can share a service’s FQDNs at the time of creation. These are propagated to consumers at the time of connection. Consumers can use these FQDNs to configure their DNS to resolve to private endpoints on their side. The alias is used for the connection request, not the FQDN. FQDNs are for DNS configurations.      |
|Load Balancer Frontend IP Configuration (loadBalancerFrontendIpConfigurations)    |    Private Link service is tied to the frontend IP address of a Standard Load Balancer. All traffic destined for the service will reach the frontend of the SLB. You can configure SLB rules to direct this traffic to appropriate backend pools where your applications are running. Load balancer frontend IP configurations are different than NAT IP configurations.      |
|NAT IP Configuration (ipConfigurations)    |    This property refers to the NAT (Network Address Translation) IP configuration for the Private Link Service. The NAT IP can be chosen from any subnet in a service provider's virtual network. Private Link service performs destination side NAT-ing on the Private Link traffic. This ensures that there is no IP conflict between source (consumer side) and destination (service provider) address space. On the destination side (service provider side), the NAT IP address will show up as Source IP for all packets received by your service and destination IP for all packets sent by your service.       |
|Network Interfaces (networkInterfaces)     |  A read-only property referencing the network interfaces created for the Private Link Service. You can't manage networkInterfaces.       |
|Private endpoint connections (privateEndpointConnections)     |  This property lists the private endpoints connecting to Private Link Service. Multiple private endpoints can connect to the same Private Link service and the service provider can control the state for individual private endpoints.        |
|||


### Details

- Private Link Service can be accessed from approved private endpoints in the same region. The private endpoint can be reached from the same virtual network, regionally peered VNets, globally peered VNets and on premises using private VPN or ExpressRoute connections. 
 
- When creating a Private Link Service, a network interface is created for the lifecycle of the resource. This interface is not manageable by the customer.
 
- The Private Link Service must be deployed in the same region as the virtual network and the Standard Load Balancer.  
 
- A single Private Link Service can be accessed from multiple Private Endpoints belonging to different VNets, subscriptions and/or Active Directory tenants. The connection is established through a connection workflow. 
 
- Multiple Private Link Services can be created on the same Standard Load Balancer using different front-end IP configurations. There are limits to the number of Private Link services you can create per Standard Load Balancer and per subscription. For details, see [Azure limits](https://docs.microsoft.com/azure/azure-subscription-service-limits.md#networking-limits).
 
- Private Link Service can have more than one NAT IP configurations linked to it. Choosing more than one NAT IP configurations can help service providers to scale. Today, service providers can assign up to eight NAT IP addresses per Private Link service. With each NAT IP address, you can assign more ports for your TCP connections and thus scale out. After you add multiple NAT IP addresses to a Private Link Service, you can't delete the NAT IP addresses. This is done to ensure that active connections are not impacted while deleting the NAT IP addresses.


## Alias

**Alias** is a globally unique name for your service. It helps you mask the customer data for your service and at the same time creates an easy-to-share name for your service. When you create a Private Link service, Azure generates an alias for your service that you can share with your customers. Your customers can use this alias to request a connection to your service.

The alias is composed of three parts: *Prefix*.*GUID*.*Suffix*

- Prefix is the service name. You can pick you own prefix. After "Alias" is created, you can't change it, so select your prefix appropriately.  
- GUID will be provided by platform. This helps make the name globally unique. 
- Suffix is appended by Azure: *region*.azure.privatelinkservice 

Complete alias:  *Prefix*. {GUID}.*region*.azure.privatelinkservice  

## Control service exposure

Private Link service provides you with a rich set of options to control the exposure of your service. These are the "Visibility" settings. You can make the service private for consumption from different VNets you own (RBAC permissions only), restrict the exposure to a limited set of subscriptions that you trust, or make it public so that all Azure subscriptions can request connections on the Private Link service. Only consumers that you expose your service to can request a connection through different Azure clients. Having access to Alias info doesn’t provide the ability to request a connection. Your visibility settings decide whether a consumer can request a connection to your service or not. If the consumer's subscription falls within your visibility scope settings and has the correct alias, the consumer can request a connection. The following options are provided for your visibility settings:

- Visibility: Role Base Access Control Only: 
    - Intake parameter: {}. 
    - Your service is not exposed from consumer side. 
    - Only exposed to customers with RBAC permissions.
- Visibility: Anyone with Alias: 
    - Intake parameter: {}. 
    - Exposed to all Azure customers. All Azure subscriptions can find your service. 
    - Customers will need your alias for finding your service. You need to share the alias offline.  
- Visibility: Restricted by subscriptions: 
    - Intake parameter:  {sub1, sub2, sub3}.  
    - Exposed to customer with RBAC permissions and to user subscriptions in your selected list. 
    - Consumers not in the visibility list will not be able to find the service even with alias information.

## Control service access

Consumers having exposure (controlled by visibility setting) to your Private Link service can create a private endpoint in their VNets and request a connection to your Private Link service. The private endpoint connection will be created in a "Pending" state on the Private Link service object. The service provider is responsible for acting on the connection request. You can either approve the connection, reject the connection, or delete the connection. Only connections that are approved can send traffic to the Private Link service.

The action of approving the connections can be automated by using the auto-approval property on the Private Link service. Auto-Approval is an ability for service providers to preapprove a set of subscriptions for automated access to their service. Customers will need to share their subscriptions offline for service providers to add to the auto-approval list. Auto-approval is a subset of the visibility array. Visibility controls the exposure settings whereas auto-approval controls the approval settings for your service. If a customer requests a connection from a subscription in the auto-approval list, the connection is automatically approved and the connection is established. Service providers don’t need to manually approve the request anymore. On the other hand, if a customer requests a connection from a subscription in the visibility array and not in the auto-approval array, the request will reach the service provider but the service provider has to manually approve the connections.

## Limitations

The following table lists known limitations when using the Private Link service:

|Limitation |Description |Mitigation |
|---------|---------|---------|
|Support only for IPv4    | Private Link service doesn’t support IPv6 traffic.         |  Use Private Link Service for IPv4 traffic only        |
|Support only for TCP-traffic     | Private Link service doesn’t support non-TCP  traffic.         |Use Private Link Service for IPv4 traffic only          |
|Support only for Azure Resource Manager virtual networks      |   Private Link service can be created only in Azure Resource Manager VNets.      |    Use Azure Resource Manager VNets for Private Link.      |
|Support for deploying Private Link service using Standard Load Balancer.       |    Private Link service can't be associated with the basic load balancer.       |     Use Standard Load Balancer to create your Private Link service.     |
|Support for same region scenarios for Private Link service    |   Connecting to a Private Link service (your own) from a private endpoint in a different region is not supported.      |    Private Link service and private endpoint need to be in the same region during Preview.      |
|Supports a single Standard Load Balancer running same Private Link service     |  Private Link service is tied to a single load balancer. You can't have multiple load balancers running same Private Link service.        |    No mitigation during Preview.      |
|Supports a single Private Link service using same backend pool    |   Multiple Private Link services can't use the same backend pool.        | Each Private Link service should have a dedicated backend pool.          |
|    |         |         |


## Next steps
- [Create a private link service using Azure PowerShell](create-private-link-service-powershell.md)
 
