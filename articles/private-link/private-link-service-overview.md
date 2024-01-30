---
title: What is Azure Private Link service?
description: Learn about Azure Private Link service.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: conceptual
ms.date: 10/27/2022
ms.author: allensu
ms.custom: template-concept
---

# What is Azure Private Link service?

Azure Private Link service is the reference to your own service that is powered by Azure Private Link. Your service that is running behind [Azure Standard Load Balancer](../load-balancer/load-balancer-overview.md) can be enabled for Private Link access so that consumers to your service can access it privately from their own VNets. Your customers can create a private endpoint inside their virtual network and map it to this service. This article explains concepts related to the service provider side. 

:::image type="content" source="./media/private-link-service-overview/private-link-service-workflow.png" alt-text="Diagram of Azure private link service." lightbox="media/private-link-service-overview/private-link-service-workflow-expanded.png":::

*Figure: Azure Private Link Service.*

## Workflow

:::image type="content" source="./media/private-link-service-overview/private-link-service-workflow-1.png" alt-text="Diagram of private link service workflow." lightbox="media/private-link-service-overview/private-link-service-workflow-1-expanded.png":::

*Figure: Azure Private Link service workflow.*

### Create your Private Link Service

- Configure your application to run behind a standard load balancer in your virtual network. If you already have your application configured behind a standard load balancer, you can skip this step.   

- Create a Private Link Service referencing the load balancer above. In the load balancer selection process, choose the frontend IP configuration where you want to receive the traffic. Choose a subnet for NAT IP addresses for the Private Link Service. It's recommended to have at least eight NAT IP addresses available in the subnet. All consumer traffic will appear to originate from this pool of private IP addresses to the service provider. Choose the appropriate properties/settings for the Private Link Service.    

    > [!NOTE]
    > Azure Private Link Service is only supported on Standard Load Balancer. 
    
### Share your service

After you create a Private Link service, Azure will generate a globally unique named moniker called **alias** based on the name you provide for your service. You can share either the alias or resource URI of your service with your customers offline. Consumers can start a Private Link connection using the alias or the resource URI.
 
### Manage your connection requests

After a consumer initiates a connection, the service provider can accept or reject the connection request. All connection requests will be listed under the **privateendpointconnections** property on the Private Link service.
 
### Delete your service

If the Private Link service is no longer in use, you can delete it. However, before you delete the service, ensure that there are no private endpoint connections associated with it. You can reject all connections and delete the service.

## Properties

A Private Link service specifies the following properties: 

|Property |Explanation  |
|---------|---------|
|Provisioning State (provisioningState)  |A read-only property that lists the current provisioning state for Private Link service. Applicable provisioning states are: **Deleting**, **Failed**,**Succeeded**,***Updating**. When the provisioning state is **Succeeded**, you've successfully provisioned your Private Link service.        |
|Alias (alias)     | Alias is a globally unique read-only string for your service. It helps you mask the customer data for your service and at the same time creates an easy-to-share name for your service. When you create a Private Link service, Azure generates the alias for your service that you can share with your customers. Your customers can use this alias to request a connection to your service.          |
|Visibility (visibility)     | Visibility is the property that controls the exposure settings for your Private Link service. Service providers can choose to limit the exposure to their service to subscriptions with Azure role-based access control permissions. A restricted set of subscriptions can also be used to limit exposure.         |
|Auto Approval (autoApproval)    |   Auto-approval controls the automated access to the Private Link service. The subscriptions specified in the auto-approval list are approved automatically when a connection is requested from private endpoints in those subscriptions.          |
|Load balancer frontend IP configuration (loadBalancerFrontendIpConfigurations)    |    Private Link service is tied to the frontend IP address of a Standard Load Balancer. All traffic destined for the service will reach the frontend of the SLB. You can configure SLB rules to direct this traffic to appropriate backend pools where your applications are running. Load balancer frontend IP configurations are different than NAT IP configurations.      |
|NAT IP configuration (ipConfigurations)    |    This property refers to the NAT (Network Address Translation) IP configuration for the Private Link service. The NAT IP can be chosen from any subnet in a service provider's virtual network. Private Link service performs destination side NAT-ing on the Private Link traffic. This NAT ensures that there's no IP conflict between source (consumer side) and destination (service provider) address space. On the destination or service provider side, the NAT IP address displays as **source IP** for all packets received by your service. **Destination IP** is displayed for all packets sent by your service.       |
|Private endpoint connections (privateEndpointConnections)     |  This property lists the private endpoints connecting to Private Link service. Multiple private endpoints can connect to the same Private Link service and the service provider can control the state for individual private endpoints.        |
|TCP Proxy V2 (EnableProxyProtocol)     |  This property lets the service provider use tcp proxy v2 to retrieve connection information about the service consumer. Service Provider is responsible for setting up receiver configs to be able to parse the proxy protocol v2 header.        |

### Details

- Private Link service can be accessed from approved private endpoints in any public region. The private endpoint can be reached from the same virtual network and regionally peered virtual networks. The private endpoint can be reached from globally peered virtual networks and on premises using private VPN or ExpressRoute connections. 
 
- Upon creation of a Private Link Service, a network interface is created for the lifecycle of the resource. This interface isn't manageable by the customer.
 
- The Private Link Service must be deployed in the same region as the virtual network and the Standard Load Balancer.  
 
- A single Private Link Service can be accessed from multiple Private Endpoints belonging to different virtual networks, subscriptions and/or Active Directory tenants. The connection is established through a connection workflow. 
 
- Multiple Private Link services can be created on the same Standard Load Balancer using different front-end IP configurations. There are limits to the number of Private Link services you can create per Standard Load Balancer and per subscription. For details, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits).
 
- Private Link service can have more than one NAT IP configurations linked to it. Choosing more than one NAT IP configurations can help service providers to scale. Today, service providers can assign up to eight NAT IP addresses per Private Link service. With each NAT IP address, you can assign more ports for your TCP connections and thus scale out. After you add multiple NAT IP addresses to a Private Link service, you can't delete the NAT IP addresses. This restriction is in place to ensure that active connections aren't impacted while deleting the NAT IP addresses.

## Alias

**Alias** is a globally unique name for your service. It helps you mask the customer data for your service and at the same time creates an easy-to-share name for your service. When you create a Private Link service, Azure generates an alias for your service that you can share with your customers. Your customers can use this alias to request a connection to your service.

The alias is composed of three parts: *Prefix*.*GUID*.*Suffix*

- Prefix is the service name. You can pick your own prefix. After "Alias" is created, you can't change it, so select your prefix appropriately.  

- GUID will be provided by platform. This GUID makes the name globally unique. 

- Suffix is appended by Azure: *region*.azure.privatelinkservice 

Complete alias:  *Prefix*. {GUID}.*region*.azure.privatelinkservice  

## Control service exposure

The Private Link service provides you with three options in the **Visibility** setting to control the exposure of your service. Your visibility setting determines whether a consumer can connect to your service. Here are the visibility setting options, from most restrictive to least restrictive:
 
- **Role-based access control only**: If your service is for private consumption from different virtual networks that you own, use role-based access control inside subscriptions that are associated with the same Active Directory tenant. **Cross tenant visibility is permitted through role-based access control**.

- **Restricted by subscription**: If your service will be consumed across different tenants, you can restrict the exposure to a limited set of subscriptions that you trust. Authorizations can be pre-approved.

- **Anyone with your alias**: If you want to make your service public and allow anyone with your Private Link service alias to request a connection, select this option. 

## Control service access

Consumers having exposure controlled by visibility setting to your Private Link service can create a private endpoint in their virtual networks and request a connection to your Private Link service. The private endpoint connection will be created in a **Pending** state on the Private Link service object. The service provider is responsible for acting on the connection request. You can either approve the connection, reject the connection, or delete the connection. Only connections that are approved can send traffic to the Private Link service.

The action of approving the connections can be automated by using the auto-approval property on the Private Link service. Auto-Approval is an ability for service providers to preapprove a set of subscriptions for automated access to their service. Customers will need to share their subscriptions offline for service providers to add to the auto-approval list. Auto-approval is a subset of the visibility array. 

Visibility controls the exposure settings whereas auto-approval controls the approval settings for your service. If a customer requests a connection from a subscription in the auto-approval list, the connection is automatically approved, and the connection is established. Service providers don’t need to manually approve the request. If a customer requests a connection from a subscription in the visibility array and not in the auto-approval array, the request will reach the service provider. The service provider must manually approve the connections.

## Getting connection Information using TCP Proxy v2

In the private link service, the source IP address of the packets coming from private endpoint is network address translated (NAT) on the service provider side using the NAT IP allocated from the provider's virtual network. The applications receive the allocated NAT IP address instead of actual source IP address of the service consumers. If your application needs an actual source IP address from the consumer side, you can enable proxy protocol on your service and retrieve the information from the proxy protocol header. In addition to source IP address, proxy protocol header also carries the LinkID of the private endpoint. Combination of source IP address and LinkID can help service providers uniquely identify their consumers. 

For more information on Proxy Protocol, visit [here](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt). 

This information is encoded using a custom Type-Length-Value (TLV) vector as follows:

Custom TLV details:

|Field |Length (Octets)  |Description  |
|---------|---------|----------|
|Type  |1        |PP2_TYPE_AZURE (0xEE)|
|Length  |2      |Length of value|
|Value  |1     |PP2_SUBTYPE_AZURE_PRIVATEENDPOINT_LINKID (0x01)|
|  |4        |UINT32 (4 bytes) representing the LINKID of the private endpoint. Encoded in little endian format.|

 > [!NOTE]
 > The service provider is responsible for making sure that the service behind the standard load balancer is configured to parse the proxy protocol header as per the [specification](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) when proxy protocol is enabled on private link service. The request will fail if proxy protocol setting is enabled on private link service but the service provider's service is not configured to parse the header. The request will fail if the service provider's service is expecting a proxy protocol header while the setting is not enabled on the private link service. Once proxy protocol setting is enabled, proxy protocol header will also be included in HTTP/TCP health probes from host to the backend virtual machines. Client information isn't contained in the header. 

The matching `LINKID` that is part of the PROXYv2 (TLV) protocol can be found at the `PrivateEndpointConnection` as property `linkIdentifier`. 

For more information, see [Private Link Services API](/../../../rest/api/virtualnetwork/private-link-services/get-private-endpoint-connection#privateendpointconnection).

## Limitations

The following are the known limitations when using the Private Link service:

- Supported only on Standard Load Balancer. Not supported on Basic Load Balancer.  

- Supported only on Standard Load Balancer where backend pool is configured by NIC. Not supported on Standard Load Balancer where backend pool is configured by IP address.

- Supports IPv4 traffic only

- Supports TCP and UDP traffic only

- Private Link Service has an idle timeout of ~5 minutes (300 seconds). To avoid hitting this limit, applications connecting through Private Link Service must use TCP Keepalives lower than that time.

## Next steps

- [Create a private link service using Azure PowerShell](create-private-link-service-powershell.md)

- [Create a private link service using Azure CLI](create-private-link-service-cli.md)
