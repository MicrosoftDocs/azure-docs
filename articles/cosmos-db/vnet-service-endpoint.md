---
title: Secure access to an Azure Cosmos DB account by using Azure Virtual Network service endpoint 
description: This document describes about virtual network and subnet access control for an Azure Cosmos account.
author: kanshiG
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/23/2019
ms.author: govindk
ms.reviewer: sngun

---

# Access Azure Cosmos DB from virtual networks (VNet)

You can configure the Azure Cosmos account to allow access only from a specific subnet of virtual network (VNet). By enabling [Service endpoint](../virtual-network/virtual-network-service-endpoints-overview.md) to access Azure Cosmos DB on the subnet within a virtual network, the traffic from that subnet is sent to Azure Cosmos DB with the identity of the subnet and Virtual Network. Once the Azure Cosmos DB service endpoint is enabled, you can limit access to the subnet by adding it to your Azure Cosmos account.

By default, an Azure Cosmos account is accessible from any source if the request is accompanied by a valid authorization token. When you add one or more subnets within VNets, only requests originating from those subnets will get a valid response. Requests originating from any other source will receive a 403 (Forbidden) response. 

## Frequently asked questions

Here are some frequently asked questions about configuring access from virtual networks:

### Can I specify both virtual network service endpoint and IP access control policy on an Azure Cosmos account? 

You can enable both the virtual network service endpoint and an IP access control policy (aka firewall) on your Azure Cosmos account. These two features are complementary and collectively ensure isolation and security of your Azure Cosmos account. Using IP firewall ensures that static IPs can access your account. 

### How do I limit access to subnet within a virtual network? 

There are two steps required to limit access to Azure Cosmos account from a subnet. First, you allow traffic from subnet to carry its subnet and virtual network identity to Azure Cosmos DB. This is done by enabling service endpoint for Azure Cosmos DB on the subnet. Next is adding a rule in the Azure Cosmos account specifying this subnet as a source from which account can be accessed.

### Will virtual network ACLs and IP Firewall reject requests or connections? 

When IP firewall or virtual network access rules are added, only requests from allowed sources get valid responses. Other requests are rejected with a 403 (Forbidden). It is important to distinguish Azure Cosmos account's firewall from a connection level firewall. The source can still connect to the service and the connections themselves aren’t rejected.

### My requests started getting blocked when I enabled service endpoint to Azure Cosmos DB on the subnet. What happened?

Once service endpoint for Azure Cosmos DB is enabled on a subnet, the source of the traffic reaching the account switches from public IP to virtual network and subnet. If your Azure Cosmos account has IP-based firewall only, traffic from service enabled subnet would no longer match the IP firewall rules and therefore be rejected. Go over the steps to seamlessly migrate from IP-based firewall to virtual network-based access control.

### Do the peered virtual networks also have access to Azure Cosmos account? 
Only virtual network and their subnets added to Azure Cosmos account have access. Their peered VNets cannot access the account until the subnets within peered virtual networks are added to the account.

### What is the maximum number of subnets allowed to access a single Cosmos account? 
Currently, you can have at most 64 subnets allowed for an Azure Cosmos account.

### Can I enable access from VPN and Express Route? 
For accessing Azure Cosmos account over Express route from on premises, you would need to enable Microsoft peering. Once you put IP firewall or virtual network access rules, you can add the public IP addresses used for Microsoft peering on your Azure Cosmos account IP firewall to allow on premises services access to Azure Cosmos account. 

### Do I need to update the Network Security Groups (NSG) rules? 
NSG rules are used to limit connectivity to and from a subnet with virtual network. When you add service endpoint for Azure Cosmos DB to the subnet, there is no need to open outbound connectivity in NSG for your Azure Cosmos account. 

### Are service endpoints available for all VNets?
No, Only Azure Resource Manager virtual networks can have service endpoint enabled. Classic virtual networks don’t support service endpoints.

### Can I "Accept connections from within public Azure datacenters" when service endpoint access is enabled for Azure Cosmos DB?  
This is required only when you want your Azure Cosmos DB account to be accessed by other Azure first party services like Azure Data factory, Azure Search or any service that is deployed in given Azure region.


## Next steps

* [How to limit Azure Cosmos account access to subnet(s) within virtual networks](how-to-configure-vnet-service-endpoint.md)
* [How to configure IP firewall for your Azure Cosmos account](how-to-configure-firewall.md)

