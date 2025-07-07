---
title: Prevent overlapping virtual network address spaces with Azure Policy and IPAM 
description: This article describes how to use Azure Policy and IPAM pools to prevent overlapping address spaces in Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 03/10/2025
ms.custom: template-concept
---

# Prevent overlapping virtual network address spaces with Azure Policy and IPAM

[!INCLUDE [virtual-network-manager-ipam](../../includes/virtual-network-manager-ipam.md)]

Azure Virtual Network Manager helps you centrally manage virtual networks across your organization. While it provides governance for VNets, it doesn't automatically prevent overlapping address spaces during virtual network creation or updates. You can enforce nonoverlapping address spaces by combining [Azure Policy](../governance/policy/overview.md) with [IP Address Management (IPAM) pools](concept-ip-address-management.md#manage-ip-address-pools), ensuring network connectivity without IP conflicts in your environment.

The following sample Azure policy definition ensures that any virtual network (`Microsoft.Network/virtualNetworks`) in the scope of this policy definition must have one IPAM pool prefix allocation from one of the two specified pools. If a virtual network lacks an allocation from either pool, the policy denies the creation or update of a virtual network by enforcing the use of nonoverlapped classless inter-domain routing (CIDRs) addresses.

```json
{
    "mode": "All", 
    
    "parameters": {}, 

    "policyRule": { 

      "if": { 

        "allOf": [ 

          { 

            "field": "type", 

            "equals": "Microsoft.Network/virtualNetworks" 

          },

          { 

            "not": { 

              "anyOf": [ 

                { 

                  "field": "Microsoft.Network/virtualnetworks/addressSpace.ipamPoolPrefixAllocations[*].pool.id", 

                  "equals": "/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/networkManagers/network-manager/ipamPools/IPAM-pool-2" 

                }, 

                { 

                  "field": "Microsoft.Network/virtualnetworks/addressSpace.ipamPoolPrefixAllocations[*].pool.id", 

                  "equals": "/subscriptions/subscriptionID/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/networkManagers/network-manager/ipamPools/IPAM-pool-3" 

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
} 

```

Included in the policy definition are the following actions:

- **Resource Check** - It applies only to virtual networks (`Microsoft.Network/virtualNetworks`).
- **Pool Allocation Check** - It verifies if the virtual network has an IPAM pool allocation from either:  
  - `IPAM-pool-2`, or 
  - `IPAM-pool-3`.
- **Enforcement** - If neither allocation is present, the policy denies the action. And in order to have pool allocation, IP prefixes must be nonoverlapped within the pool, as such no VNets with overlapped prefixes can be created.
Resource Check: It applies only to virtual networks (`Microsoft.Network/virtualNetworks`).

## Implementation steps of the policy

With the policy definition, you can enforce nonoverlapping address spaces in your Azure environment. Follow these steps to implement the policy:

1. **Identify existing network manager and IPAM pools** - Ensure you have an existing Azure Virtual Network Manager instance and at least two IPAM pools created. For more information, see [Create a virtual network manager](./create-virtual-network-manager-powershell.md) and [Create an IPAM pool](./how-to-manage-ip-addresses-network-manager.md).
1. **Create an Azure Policy definition** - Create a policy definition in Azure Policy using the JSON example. You can do this through the Azure portal, Azure CLI, or PowerShell. For more information, see [Create and assign a policy definition](../governance/policy/tutorials/create-and-manage.md).
2. **Assign the policy** - Assign the policy to a specific scope (subscription or management group) where you want to enforce the nonoverlapping address space rule.
1. **Test the policy** - Create or update a virtual network without an IPAM pool allocation from the specified pools. The operation should be denied if the policy is working correctly.


## Next steps
> [!div class="nextstepaction"]
> [Manage IP addresses with Azure Virtual Network Manager](./how-to-manage-ip-addresses-network-manager.md)