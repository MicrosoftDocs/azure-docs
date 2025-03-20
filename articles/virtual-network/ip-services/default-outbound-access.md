---
title: Default outbound access in Azure
titleSuffix: Azure Virtual Network
description: Learn about default outbound access in Azure.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: concept-article
ms.date: 10/23/2024
---

# Default outbound access in Azure

In Azure, virtual machines created in a virtual network without explicit outbound connectivity defined are assigned a default outbound public IP address. This IP address enables outbound connectivity from the resources to the Internet. This access is referred to as default outbound access. 

Examples of explicit outbound connectivity for virtual machines are:

* Created within a subnet associated to a NAT gateway.

* Deployed in the backend pool of a standard load balancer with outbound rules defined.

* Deployed in the backend pool of a basic public load balancer.

* Virtual machines with public IP addresses explicitly associated to them.

:::image type="content" source="./media/default-outbound-access/explicit-outbound-options.png" alt-text="Diagram of explicit outbound options.":::

## How is default outbound access provided?

The public IPv4 address used for the access is called the default outbound access IP. This IP is implicit and belongs to Microsoft. This IP address is subject to change and it's not recommended to depend on it for production workloads.

## When is default outbound access provided?

If you deploy a virtual machine in Azure and it doesn't have explicit outbound connectivity, it's assigned a default outbound access IP.

:::image type="content" source="./media/default-outbound-access/decision-tree-load-balancer-thumb.png"  alt-text="Diagram of decision tree for default outbound access." lightbox="./media/default-outbound-access/decision-tree-load-balancer.png":::

>[!Important]
>On September 30, 2025, default outbound access for new deployments will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/default-outbound-access-for-vms-in-azure-will-be-retired-transition-to-a-new-method-of-internet-access/).  We recommend that you use one of the explicit forms of connectivity discussed in the following section.

## Why is disabling default outbound access recommended?

* Secure by default
    
    * It's not recommended to open a virtual network to the Internet by default using the Zero Trust network security principle.

* Explicit vs. implicit

    * It's recommended to have explicit methods of connectivity instead of implicit when granting access to resources in your virtual network.

* Loss of IP address

    * Customers don't own the default outbound access IP. This IP might change, and any dependency on it could cause issues in the future.

Some examples of configurations that won't work when using default outbound access:
- When you have multiple NICs on the same VM, default outbound IPs won't consistently be the same across all NICs.
- When scaling up/down Virtual Machine Scale sets, default outbound IPs assigned to individual instances can change.
- Similarly, default outbound IPs aren't consistent or contiguous across VM instances in a Virtual Machine Scale Set.

## How can I transition to an explicit method of public connectivity (and disable default outbound access)?
 
There are multiple ways to turn off default outbound access. The following sections describe the options available to you.
 
### Utilize the Private Subnet parameter (public preview)

> [!IMPORTANT]
> Private Subnets are currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
 
* Creating a subnet to be Private prevents any virtual machines on the subnet from utilizing default outbound access to connect to public endpoints.
 
* VMs on a Private subnet can still access the Internet using explicit outbound connectivity.
 
    > [!NOTE]
    > Certain services won't function on a virtual machine in a Private Subnet without an explicit method of egress (examples are Windows Activation and Windows Updates).
 
#### Add the Private subnet feature

 * From the Azure portal, select the subnet and select the checkbox to enable Private subnet as shown below:

:::image type="content" source="./media/default-outbound-access/private-subnet-portal.png"  alt-text="Screenshot of Azure portal showing Private subnet option.":::

* Using Powershell, the following script takes the names of the Resource Group and Virtual Network and loops through each subnet to enable private subnet.

```
$resourceGroupName = ""
$vnetName = ""
 
$vnet = Get-AzVirtualNetwork -ResourceGroupName $resourceGroupName -Name $vnetName
 
foreach ($subnet in $vnet.Subnets) {
    if ($subnet.DefaultOutboundAccess -eq $null) {
        $subnet.DefaultOutboundAccess = $false
        Write-Output "Set 'defaultoutboundaccess' to \$false for subnet: $($subnet.Name)"
    } 
    elseif ($subnet.DefaultOutboundAccess -eq $false) {
        # Output message if the value is already $false
        Write-Output "already private for subnet: $($subnet.Name)"
    }
}
Set-AzVirtualNetwork -VirtualNetwork $vnet
```

* Using CLI, update the subnet with [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) and set `--default-outbound` to "false"

```
az network vnet subnet update --resource-group rgname --name subnetname --vnet-name vnetname --default-outbound false
```

* Using an Azure Resource Manager template, set the value of `defaultOutboundAccess` parameter to be "false"

```
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vnetName": {
      "type": "string",
      "defaultValue": "testvm-vnet"
    },
    "subnetName": {
      "type": "string",
      "defaultValue": "default"
    },
    "subnetPrefix": {
      "type": "string",
      "defaultValue": "10.1.0.0/24"
    },
    "vnetAddressPrefix": {
      "type": "string",
      "defaultValue": "10.1.0.0/16"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Network/virtualNetworks",
      "apiVersion": "2023-11-01",
      "name": "[parameters('vnetName')]",
      "location": "westus2",
      "properties": {
        "addressSpace": {
          "addressPrefixes": [
            "[parameters('vnetAddressPrefix')]"
          ]
        },
        "subnets": [
          {
            "name": "[parameters('subnetName')]",
            "properties": {
              "addressPrefix": "[parameters('subnetPrefix')]",
              "defaultoutboundaccess": false
            }
          }
        ]
      }
    }
  ]
}
```

#### Private subnet limitations
 
* To activate or update virtual machine operating systems, such as Windows, an explicit outbound connectivity method is required.

* In configurations using a User Defined Route (UDR) with a default route (0/0) that sends traffic to an upstream firewall/network virtual appliance, any traffic that bypasses this route (for example, to Service Tagged destinations) breaks in a Private subnet.
 
### Add an explicit outbound connectivity method
 
* Associate a NAT gateway to the subnet of your virtual machine.
 
* Associate a standard load balancer configured with outbound rules.
 
* Associate a Standard public IP to any of the virtual machine's network interfaces (if there are multiple network interfaces, having a single NIC with a standard public IP prevents default outbound access for the virtual machine).
 
### Use Flexible orchestration mode for Virtual Machine Scale Sets
 
* Flexible scale sets are secure by default. Any instances created via Flexible scale sets don't have the default outbound access IP associated with them, so an explicit outbound method is required. For more information, see [Flexible orchestration mode for Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes#what-has-changed-with-flexible-orchestration-mode)
 
>[!Important]
> When a load balancer backend pool is configured by IP address, it will use default outbound access due to an ongoing known issue. For secure by default configuration and applications with demanding outbound needs, associate a NAT gateway to the VMs in your load balancer's backend pool to secure traffic. See more on existing [known issues](../../load-balancer/whats-new.md#known-issues).

## If I need outbound access, what is the recommended way? 

NAT gateway is the recommended approach to have explicit outbound connectivity. A firewall can also be used to provide this access.

## Constraints

* Default outbound access IP doesn't support fragmented packets.

* Default outbound access IP doesn't support ICMP pings.

## Next steps

For more information on outbound connections in Azure and Azure NAT Gateway, see:

* [Source Network Address Translation (SNAT) for outbound connections](../../load-balancer/load-balancer-outbound-connections.md).

* [What is Azure NAT Gateway?](../../nat-gateway/nat-overview.md)

* [Azure NAT Gateway FAQ](../../nat-gateway/faq.yml)
