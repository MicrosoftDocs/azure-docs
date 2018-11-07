---
title: Secure access to an Azure Cosmos DB account by using Azure Virtual Network service endpoint 
description: This document describes about VNET and subnet access control for a Cosmos account.
author: kanshiG

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/06/2018
ms.author: govindk

---

# VNET and subnet access control for a Cosmos account

You can configure the Cosmos account to allow access only from a specific subnet of virtual network (VNET). By enabling [Service endpoint](../azure/virtual-network/virtual-network-service-endpoints-overview.md) to Cosmos DB on the subnet within a VNET, the traffic from that subnet is sent to Cosmos DB with the identity of the subnet and Virtual Network. Once the Cosmos DB service endpoint is enabled, you can limit access to the subnet by adding it to your Cosmos account.

![Virtual network service endpoint architecture](./media/vnet-service-endpoint/vnet-service-endpoint-architecture.png)

By default, an Azure Cosmos account is accessible from any source if the request is accompanied by a valid authorization token. When you add one or more subnets within VNETs, only requests originating from those subnets will get a valid response. Requests originating from any other source will receive a 404 (Not found) response. 

**Specifying both virtual network service endpoint and IP access control policy on your Cosmos account**
You can enable both the virtual network service endpoint and an IP access control policy (aka firewall) on your Cosmos account. These two features are complementary and collectively ensure isolation and security of your Cosmos account. Using IP firewall ensures that static IPs can access Cosmos account. 

**Two steps to limit access to subnet within VNET**
There are two steps required to limit access to Cosmos account from a subnet. First, you allow traffic from subnet to carry its subnet and VNET identity to Cosmos. This is done by enabling service endpoint for Cosmos DB on the subnet. Next is adding a rule in Cosmos account specifying this subnet as a source from which account can be accessed.

**VNET ACLs and IP Firewall reject requests not connections**
When IP firewall or VNET access rules are added, only requests from allowed sources get valid responses. Other requests are rejected with a 404 (Not found). It is important to distinguish Cosmos firewall from a connection level firewall. The source can still connect to the service and the connections themselves aren’t rejected.

**Source identity switch from public IP to VNET and subnet**
Once service endpoint for Cosmos is enabled on a subnet, the source of the traffic reaching Cosmos switches from public IP to VNET and subnet. If your Cosmos account has IP-based firewall only, traffic from service enabled subnet would no longer match the IP firewall rules and therefore be rejected. Go over the steps to seamlessly migrate from IP-based firewall to VNET-based access control.

**Peered virtual networks**
Note that only virtual network and their subnets added to Cosmos account have access. Their peered VNETs cannot access Cosmos account until the subnets within peered VNET(s) are added to Cosmos account.

**Maximum number of service endpoints** 
Currently, you can have at most 64 virtual network service endpoints on your Cosmos account.

**Enabling access from VPN and Express Route**
For accessing Cosmos over Express route from on prem, you would need to enable Microsoft peering. Once you put IP firewall or VNET access rules, you can add the public IP addresses used for Microsoft peering on your Cosmos account IP firewall to allow on premises services access to Cosmos account. 

**Network Security Groups (NSG) rules**
NSG rules are used to limit connectivity to and from a subnet with VNET. When you add service endpoint for Cosmos to the subnet, there is no need to open outbound connectivity in NSG for Cosmos. 

## Next steps

* [How to limit Cosmos account access to subnet(s) within virtual networks](how-to-configure-vnet-service-endpoint.md)
* [How to configure IP firewall for your Cosmos account](how-to-configure-firewall.md)

