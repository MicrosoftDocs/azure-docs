---
title: Prevent overlapping VNet address spaces using Azure Policy and IPAM 
description: 
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 03/10/2023
ms.custom: template-concept
---

# Prevent overlapping VNet address spaces using Azure Policy and IPAM

Azure Virtual Network Manager helps you centrally manage virtual networks (VNets) across your organization. While it provides governance for VNets, it doesn't automatically prevent overlapping address spaces during VNet creation or updates. You can enforce non-overlapping address spaces by combining Azure Policy with IP Address Management (IPAM) pools, ensuring network connectivity without IP conflicts in your environment.

 The following sample Azure policy definition ensures that any virtual network (Microsoft.Network/virtualNetworks) must have at least one IPAM pool prefix allocation from one of the two specified pools. If a virtual network lacks an allocation from either pool, the policy denies the deployment or update of that resource. This enforces VNets with only non-overlapped CIDRs can be created in the scope of this policy definition.

so the tutorial shows the policy definition
 
once this policy definition is applied to an Azure policy scope like subscription/management group, then it's enforced on the scope
 

```json
"mode": "All", 

    "parameters": {}, 

    "policyRule": { 

      "if": { 

        "allOf": [ 

          { 

            "field": "type", 

            "equals": "Microsoft.Network/virtualNetworks" 

          } 

          { 

            "not": { 

              "anyOf": [ 

                { 

                  "field": "Microsoft.Network/virtualnetworks/addressSpace.ipamPoolPrefixAllocations[*].pool.id", 

                  "equals": "/subscriptions/c9295b92-3574-4021-95a1-26c8f74f8359/resourceGroups/ipam-test-rg/providers/Microsoft.Network/networkManagers/ipam-test-nm/ipamPools/paigePolicyTestPool2" 

                }, 

                { 

                  "field": "Microsoft.Network/virtualnetworks/addressSpace.ipamPoolPrefixAllocations[*].pool.id", 

                  "equals": "/subscriptions/c9295b92-3574-4021-95a1-26c8f74f8359/resourceGroups/ipam-test-rg/providers/Microsoft.Network/networkManagers/ipam-test-nm/ipamPools/paigePolicyTestPool3" 

                } 

              ] 

            } 

          } 

        ] 

      }, 

      "then": { 

        "effect": "deny" 

      } 

    } 
```

This Azure Policy blocks the creation or update of a virtual network unless it includes an IPAM pool allocation from one of two approved pools. It works as follows: 

Resource Check: It applies only to virtual networks (Microsoft.Network/virtualNetworks). 

Pool Allocation Check: It verifies if the virtual network has an IPAM pool allocation from either:  

paigePolicyTestPool2, or 

paigePolicyTestPool3. 

Enforcement: If neither allocation is present, the policy denies the action. And in order to have pool allocation, IP prefixes must be non-overlapped within the pool, as such no VNets with overlapped prefixes can be created. 

## Next steps
- [Create a virtual network using Azure CLI](../quickstart-create-vnet-cli.md)