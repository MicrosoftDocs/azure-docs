---
title: Default Outbound Access in Azure
titleSuffix: Azure Virtual Network
description: Learn about default outbound access in Azure.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: concept-article
ms.date: 06/11/2025
# Customer intent: "As an Azure network administrator, I want to transition from default outbound access to explicit outbound connectivity for virtual machines, so that I can ensure secure and reliable internet access while avoiding potential disruptions from IP address changes."
---

# Default outbound access in Azure

In Azure, when a virtual machine (VM) is deployed in a virtual network without an explicitly defined outbound connectivity method, it's automatically assigned an outbound public IP address. This IP address enables outbound connectivity from the resources to the Internet and to other public endpoints within Microsoft. This access is referred to as default outbound access.

Examples of explicit outbound connectivity for virtual machines are:

* Deployed in a subnet associated to a NAT gateway.
* Deployed in the backend pool of a standard load balancer with outbound rules defined.
* Deployed in the backend pool of a basic public load balancer.
* Virtual machines with public IP addresses explicitly associated to them.

:::image type="content" source="./media/default-outbound-access/explicit-outbound-options.png" alt-text="Diagram of explicit outbound options.":::

## How and when default outbound access is provided

If a Virtual Machine (VM) is deployed without an explicit outbound connectivity method, Azure assigns it a default outbound public IP address. This IP, known as the default outbound access IP, is owned by Microsoft and may change without notice. It isn't recommended for production workloads.

:::image type="content" source="./media/default-outbound-access/decision-tree-load-balancer-thumb.png"  alt-text="Diagram of decision tree for default outbound access." lightbox="./media/default-outbound-access/decision-tree-load-balancer.png":::

>[!Important]
>After September 30, 2025, new virtual networks will default to using private subnets, meaning that an explicit outbound method must be enabled in order to reach public endpoints on the Internet and within Microsoft. For more information, see the [official announcement](https://azure.microsoft.com/updates/default-outbound-access-for-vms-in-azure-will-be-retired-transition-to-a-new-method-of-internet-access/).  We recommend that you use one of the explicit forms of connectivity discussed in the following section.

## Why is disabling default outbound access recommended?

* Security: Default Internet access contradicts Zero Trust principles.

* Clarity: Explicit connectivity is preferred over implicit access.

* Stability: The default outbound IP isn't customer-owned and may change, leading to potential disruptions.

Some examples of configurations that don't work when using default outbound access:
- Multiple NICs on a VM may yield inconsistent outbound IPs
- Scaling VM Scale Sets can result in changing outbound IPs
- Outbound IPs aren't consistent or contiguous across VMSS instances

Additionally,
* Default outbound access IPs don't support fragmented packets
* Default outbound access IPs don't support ICMP pings

## How can I transition to an explicit method of public connectivity (and disable default outbound access)?
 
### Private subnets overview

* Creating a subnet to be Private prevents any virtual machines on the subnet from utilizing default outbound access to connect to public endpoints.
* VMs on a Private subnet can still access the Internet (or any public endpoints within Microsoft) using explicit outbound connectivity.
    > [!NOTE]
    > Certain services don't function on a virtual machine in a Private Subnet without an explicit method of egress (examples are Windows Activation and Windows Updates).
 
### How to configure private subnets

 * From the Azure portal, select the subnet and select the checkbox to enable Private subnet as shown:

:::image type="content" source="./media/default-outbound-access/private-subnet-portal.png"  alt-text="Screenshot of Azure portal showing Private subnet option.":::

* Using PowerShell, the following script takes the names of the Resource Group and Virtual Network and loops through each subnet to enable private subnet.

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

### Limitations of private subnets
 
* To activate or update virtual machine operating systems, such as Windows, an explicit outbound connectivity method is required.

* In configurations using User Defined Routes (UDRs), any configured routes with [next hop type `Internet`](../virtual-networks-udr-overview.md#next-hop-types-across-azure-tools) break in a Private subnet.

  * A common example is the use of a UDR to steer traffic to an upstream network virtual appliance/firewall, with exceptions for certain Azure Service Tags to bypass inspection.

    * A default route for the destination 0.0.0.0/0, with a next hop type of Virtual Appliance applies in the general case.

    * One or more routes are configured to [Service Tag destinations](../virtual-networks-udr-overview.md#service-tags-for-user-defined-routes) with next hop type `Internet`, to bypass the NVA/firewall. Unless an explicit outbound connectivity method is also configured for the source of the connection to these destinations, attempts to connection to these destinations fail, because default outbound access isn't available.

  * This limitation doesn't apply to the use of Service Endpoints, which use a different next hop type `VirtualNetworkServiceEndpoint`. See [Virtual Network service endpoints](../virtual-network-service-endpoints-overview.md).

* Private Subnets aren't applicable to delegated or managed subnets used for hosting PaaS services. In these scenarios, outbound connectivity is managed by the individual service.

>[!Important]
> When a load balancer backend pool is configured by IP address, it uses default outbound access due to an ongoing known issue. For secure by default configuration and applications with demanding outbound needs, associate a NAT gateway to the VMs in your load balancer's backend pool to secure traffic. See more on existing [known issues](../../load-balancer/whats-new.md#known-issues).
 
### Add an explicit outbound method
 
* Associate a NAT gateway to the subnet of your virtual machine.  Note this is the recommended method for the majority of scenarios.
* Associate a standard load balancer configured with outbound rules.
* Associate a Standard public IP to any of the virtual machine's network interfaces (if there are multiple network interfaces, having a single NIC with a standard public IP prevents default outbound access for the virtual machine).
* Add a Firewall or Network Virtual Appliance (NVA) to your virtual network and point traffic to it using a User Defined Route (UDR).

>[!NOTE]
> There's a NIC-level parameter (defaultOutboundConnectivityEnabled) which tracks if default outbound access is being utilized.  The Advisor "Add explicit outbound method to disable default outbound" operates by checking for this parameter.

>[!IMPORTANT]
> A stop/deallocate of applicable virtual machines in a subnet is required for changes to be reflected and the action to clear. (This is also true in the reverse; in order for a machine to be given a default outbound IP after having the subnet-level parameter set to false, a stop/deallocate of the virtual machine is required.)

#### Use flexible orchestration mode for Virtual Machine Scale Sets
 
* Flexible scale sets are secure by default. Any instances created via Flexible scale sets don't have the default outbound access IP associated with them, so an explicit outbound method is required. For more information, see [Flexible orchestration mode for Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes#what-has-changed-with-flexible-orchestration-mode)

## Next steps

For more information on outbound connections in Azure, see:

* [Source Network Address Translation (SNAT) for outbound connections](../../load-balancer/load-balancer-outbound-connections.md).

* [What is Azure NAT Gateway?](../../nat-gateway/nat-overview.md)
