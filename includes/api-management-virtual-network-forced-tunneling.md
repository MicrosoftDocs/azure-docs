---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 06/01/2022
ms.author: danlep
---

## Force tunnel traffic to on-premises firewall using ExpressRoute or network virtual appliance  

Forced tunneling lets you redirect or "force" all internet-bound traffic from your subnet back to on-premises for inspection and auditing. Commonly, you configure and define your own default route (`0.0.0.0/0`), forcing all traffic from the API Management subnet to flow through an on-premises firewall or to a network virtual appliance. This traffic flow breaks connectivity with API Management, since outbound traffic is either blocked on-premises, or NAT'd to an unrecognizable set of addresses that no longer work with various Azure endpoints. You can solve this issue via the following methods: 
 
  * Enable [service endpoints][ServiceEndpoints] on the subnet in which the API Management service is deployed for:
      * Azure SQL (required only in the primary region if the API Management service is deployed to [multiple regions](../articles/api-management/api-management-howto-deploy-multi-region.md))
      * Azure Storage
      * Azure Event Hubs
      * Azure Key Vault (required when API Management is deployed on the `stv2` platform) 
  
     By enabling endpoints directly from the API Management subnet to these services, you can use the Microsoft Azure backbone network, providing optimal routing for service traffic. If you use service endpoints with a force tunneled API Management, traffic for the preceding Azure services isn't force tunneled. However, the other API Management service dependency traffic remains force tunneled. Ensure that your firewall or virtual appliance doesn't block this traffic, or the API Management service may not function properly.

      > [!NOTE]
      > We strongly recommend enabling service endpoints directly from the API Management subnet to dependent services such as Azure SQL and Azure Storage that support them. However, some organizations may have requirements to force tunnel all traffic from the API Management subnet. In this case, ensure that you configure your firewall or virtual appliance to allow this traffic. You will need to allow the complete [IP address range](https://www.microsoft.com/download/details.aspx?id=56519) of each dependent service, and keep this configuration up to date when the Azure infrastructure changes. Your API Management service may also experience latency or unexpected timeouts because of the force tunneling of this network traffic.  

  * All the control plane traffic from the internet to the management endpoint of your API Management service is routed through a specific set of inbound IPs, hosted by API Management. When the traffic is force tunneled, the responses won't symmetrically map back to these inbound source IPs and connectivity to the management endpoint is lost. To overcome this limitation, configure user-defined routes ([UDRs][UDRs]) for these inbound IPs with next hop type set to "Internet", to steer traffic back to Azure. Configure the **ApiManagement** [service tag](../articles/virtual-network/service-tags-overview.md), or find the set of inbound IPs for control plane traffic documented in [Control plane IP addresses](../articles/api-management/virtual-network-reference.md#control-plane-ip-addresses).
    
    > [!IMPORTANT]
    > Control plane IP addresses should be configured for network access rules and routes only when needed in certain networking scenarios. We recommend using the ApiManagement service tag instead of control plane IP addresses to prevent downtime when infrastructure improvements necessitate IP address changes. 

    > [!NOTE]
    > Allowing API Management management traffic to bypass an on-premises firewall or network virtual appliance isn't considered a significant security risk. The [recommended configuration](../articles/api-management/virtual-network-reference.md#required-ports) for your API Management subnet allows inbound management traffic on port 3443 only from the set of Azure IP addresses encompassed by the ApiManagement service tag. The recommended UDR configuration is only for the return path of this Azure traffic.

  * (External VNet mode) Data plane traffic for clients attempting to reach the API Management gateway and developer portal from the internet will also be dropped by default because of asymmetric routing introduced by forced tunneling. For each client that requires access, configure an explicit UDR with next hop type "Internet" to bypass the firewall or virtual network appliance.

  * For other force tunneled API Management service dependencies, resolve the hostname and reach out to the endpoint. These include:
      - Metrics and Health Monitoring
      - Azure portal diagnostics
      - SMTP relay
      - Developer portal CAPTCHA
      - Azure KMS server

For more information, see [Virtual network configuration reference](../articles/api-management/virtual-network-reference.md).

[UDRs]: ../articles/virtual-network/virtual-networks-udr-overview.md
[NetworkSecurityGroups]: ../articles/virtual-network/network-security-groups-overview.md
[ServiceEndpoints]: ../articles/virtual-network/virtual-network-service-endpoints-overview.md
[ServiceTags]: ../articles/virtual-network/network-security-groups-overview.md#service-tags
