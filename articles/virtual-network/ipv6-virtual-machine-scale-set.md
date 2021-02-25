---
title: Deploy virtual machine scale sets with IPv6 in Azure
titlesuffix: Azure Virtual Network
description: This article shows how to deploy virtual machine scale sets with IPv6 in an Azure virtual network.
services: virtual-network
documentationcenter: na
author: KumudD
manager: mtillman
ms.service: virtual-network
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/31/2020
ms.author: kumud
---

# Deploy virtual machine scale sets with IPv6 in Azure

This article shows you how to deploy a dual stack (IPv4 + IPv6) Virtual Machine Scale Set with a dual stack external load balancer in an Azure virtual network. The process to create an IPv6-capable virtual machine scale set is nearly identical to the process for creating individual VMs described [here](ipv6-configure-standard-load-balancer-template-json.md). You'll start with the steps that are similar to ones described for individual VMs:
1.    Create IPv4 and IPv6 Public IPs.
2.    Create a dual stack load balancer.  
3.    Create network security group (NSG) rules.  

The only step that is different from individual VMs is creating the network interface (NIC) configuration that uses the virtual machine scale set resource:  networkProfile/networkInterfaceConfigurations. The JSON structure is similar to that of the Microsoft.Network/networkInterfaces object used for individual VMs with the addition of setting the NIC and the IPv4 IpConfiguration as the primary interface using the **"primary": true**  attribute as seen in the following example:

```json
          "networkProfile": {
            "networkInterfaceConfigurations": [
              {
                "name": "[variables('nicName')]",
                "properties": {
                  "primary": true,
          "networkSecurityGroup": {
            "id": "[resourceId('Microsoft.Network/networkSecurityGroups','VmssNsg')]"
          },                  
                  "ipConfigurations": [
                    {
                      "name": "[variables('ipConfigName')]",
                      "properties": {
                        "primary": true,
                        "subnet": {
                          "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets', 'MyvirtualNetwork','Mysubnet')]"
                        },
                        "privateIPAddressVersion":"IPv4",                       
                        "publicipaddressconfiguration": {
                          "name": "pub1",
                          "properties": {
                            "idleTimeoutInMinutes": 15
                          }
                        },
                        "loadBalancerBackendAddressPools": [
                          {
                            "id": "[resourceId('Microsoft.Network/loadBalancers/backendAddressPools', 'loadBalancer', 'bePool'))]"
                          }
                        ],
                        "loadBalancerInboundNatPools": [
                          {
                            "id": "[resourceId('Microsoft.Network/loadBalancers/inboundNatPools', 'loadBalancer', 'natPool')]"
                          }
                        ]
                      }
                    },
                    {
                      "name": "[variables('ipConfigNameV6')]",
                      "properties": {
                        "subnet": {
                          "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets','MyvirtualNetwork','Mysubnet')]"
                        },
                        "privateIPAddressVersion":"IPv6",
                        "loadBalancerBackendAddressPools": [
                          {
                            "id": "[resourceId('Microsoft.Network/loadBalancers/backendAddressPools', 'loadBalancer','bePoolv6')]"
                          }
                        ],                        
                      }
                    }
                  ]
                }
              }
            ]
          }

```


## Sample virtual machine scale set template JSON

To deploy a dual stack (IPv4 + IPv6) Virtual Machine Scale Set with dual stack external Load Balancer and virtual network view sample template [here](https://azure.microsoft.com/resources/templates/ipv6-in-vnet-vmss/).
## Next steps

To learn more about IPv6 support in Azure virtual networks, see [What is IPv6 for Azure Virtual Network?](ipv6-overview.md).
