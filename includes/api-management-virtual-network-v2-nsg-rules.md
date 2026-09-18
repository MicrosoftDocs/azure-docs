---
author: PatAltimore
ms.service: azure-api-management
ms.topic: include
ms.date: 08/26/2026
ms.author: patricka
---


You must associate a network security group (NSG) with the subnet. To set up a network security group, see [Create a network security group](../articles/virtual-network/manage-network-security-group.md). 

* Configure the rules in the following table to allow outbound access to Azure Key Vault, which is a dependency for API Management.
* Configure other outbound rules you need for the gateway to reach your API backends.
* Configure other NSG rules to meet your organization's network access requirements. For example, use NSG rules to block outbound traffic to the internet and allow access only to resources in your virtual network.

| Direction | Source  | Source port ranges | Destination | Destination port ranges | Protocol |  Action | Purpose | 
|-------|--------------|----------|---------|------------|-----------|-----|--------|
| Outbound | VirtualNetwork | * | AzureKeyVault | 443 | TCP | Allow | Dependency on Azure Key Vault |
