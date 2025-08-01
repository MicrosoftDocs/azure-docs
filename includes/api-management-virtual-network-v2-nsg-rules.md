---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 07/08/2025
ms.author: danlep
---


A network security group (NSG) must be associated with the subnet. To set up a network security group, see [Create a network security group](../articles/virtual-network/manage-network-security-group.md). 

* Configure the following rule to allow outbound access to Azure Storage, which is a dependency for API Management.
* Configure other outbound rules you need for the gateway to reach your API backends. 
* Configure other NSG rules to meet your organization’s network access requirements. For example, NSG rules can also be used to block outbound traffic to the internet and allow access only to resources in your virtual network. 

| Direction | Source  | Source port ranges | Destination | Destination port ranges | Protocol |  Action | Purpose | 
|-------|--------------|----------|---------|------------|-----------|-----|--------|
| Outbound | VirtualNetwork | * | Storage | 443 | TCP | Allow | Dependency on Azure Storage |