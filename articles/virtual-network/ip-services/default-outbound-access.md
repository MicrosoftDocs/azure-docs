---
title: Default Outbound Access in Azure
titleSuffix: Azure Virtual Network
description: Learn about default outbound access in Azure.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: concept-article
ms.date: 12/03/2025
# Customer intent: "As an Azure network administrator, I want to transition from default outbound access to explicit outbound connectivity for virtual machines, so that I can ensure secure and reliable internet access while avoiding potential disruptions from IP address changes."
---

# Default outbound access in Azure

In Azure, when you deploy a virtual machine (VM) in a virtual network without an explicitly defined outbound connectivity method, Azure automatically assigns it an outbound public IP address. This IP address enables outbound connectivity from the resources to the internet and to other public endpoints within Microsoft. This access is referred to as default outbound access.

Examples of explicit outbound connectivity for virtual machines are:

* Deployed in a subnet associated to a NAT gateway.
* Deployed in the backend pool of a standard load balancer with outbound rules defined.
* Deployed in the backend pool of a basic public load balancer.
* Virtual machines with public IP addresses explicitly associated to them.

:::image type="content" source="./media/default-outbound-access/explicit-outbound-options.png" alt-text="Diagram of explicit outbound options.":::

## How and when default outbound access is provided

If a Virtual Machine (VM) is deployed without an explicit outbound connectivity method, Azure assigns it a default outbound public IP address. This IP, known as the default outbound access IP, is owned by Microsoft and can change without notice. It isn't recommended for production workloads.

:::image type="content" source="./media/default-outbound-access/decision-tree-load-balancer.png"  alt-text="Diagram of decision tree for default outbound access." lightbox="./media/default-outbound-access/decision-tree-load-balancer.png":::

> [!NOTE]
> In some cases, a default outbound IP is still assigned to virtual machines in a nonprivate subnet, even when an explicit outbound method—such as a NAT Gateway or a UDR directing traffic to an NVA/firewall—is configured. This doesn't mean the default outbound IPs are used for egress unless those explicit methods are removed. To completely remove the default outbound IPs, the subnet must be made private, and the virtual machines must be stopped and deallocated.

> [!IMPORTANT]
> After March 31, 2026, new virtual networks will default to using private subnets, meaning that an explicit outbound method must be enabled in order to reach public endpoints on the internet and within Microsoft. For more information, see the [official announcement](https://azure.microsoft.com/updates/default-outbound-access-for-vms-in-azure-will-be-retired-transition-to-a-new-method-of-internet-access/). We recommend that you use one of the explicit forms of connectivity discussed in the following section. For other questions, see the "FAQs: Default Behavior Change to Private Subnets" section.

## Why is disabling default outbound access recommended?

**Security**: Default internet access contradicts Zero Trust principles.<br>
**Clarity**: Explicit connectivity is preferred over implicit access.<br>
**Stability**: The default outbound IP isn't customer-owned and can change, leading to potential disruptions.

Some examples of configurations that don't work when using default outbound access:

- Multiple NICs on a VM can yield inconsistent outbound IPs
- Scaling Azure Virtual Machine Scale Sets can result in changing outbound IPs
- Outbound IPs aren't consistent or contiguous across Virtual Machine Scale Set instances

Additionally,

* Default outbound access IPs don't support fragmented packets
* Default outbound access IPs don't support ICMP pings

## How can I transition to an explicit method of public connectivity (and disable default outbound access)?
 
### Private subnets overview

* Creating a subnet to be Private prevents any virtual machines on the subnet from utilizing default outbound access to connect to public endpoints.
* VMs on a Private subnet can still access the internet (or any public endpoints within Microsoft) using explicit outbound connectivity.
    > [!NOTE]
    > Certain services don't function on a virtual machine in a private subnet without an explicit method of egress (examples are Windows Activation and Windows Updates).
 
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

  * A common example is the use of a UDR to steer traffic to an upstream network virtual appliance/firewall, with exceptions for certain Azure Service Tags to bypass inspection. This is done by configuring routes to these Service Tags with next hop type `Internet`. In this scenario you configure the following:

    * A default route for the destination 0.0.0.0/0, with a next hop type of Virtual Appliance applies in the general case.

    * One or more routes are configured to [Service Tag destinations](../virtual-networks-udr-overview.md#service-tags-for-user-defined-routes) with next hop type `Internet`, to bypass the NVA/firewall. Unless an explicit outbound connectivity method is also configured for the source of the connection to these destinations, attempts to connect to these destinations fail, because default outbound access isn't available by default in a Private subnet.

  * This limitation doesn't apply to the use of Service Endpoints, which use a different next hop type `VirtualNetworkServiceEndpoint`. See [Virtual Network service endpoints](../virtual-network-service-endpoints-overview.md).
 
* Virtual machines are still able to access Azure Storage accounts in the same region in a private subnet without an explicit method of outbound. NSGs are recommended to control egress connectivity.

* Private subnets aren't applicable to delegated or managed subnets used for hosting PaaS services. In these scenarios, outbound connectivity is managed by the individual service.

> [!IMPORTANT]
> When a load balancer backend pool is configured by IP address, it uses default outbound access due to an ongoing known issue. For secure by default configuration and applications with demanding outbound needs, associate a NAT gateway to the VMs in your load balancer's backend pool to secure traffic. See more on existing [known issues](../../load-balancer/whats-new.md#known-issues).
 
### Add an explicit outbound method

* Associate a NAT gateway to the subnet of your virtual machine. Note this is the recommended method for most scenarios.
* Associate a standard load balancer configured with outbound rules.
* Associate a Standard public IP to any of the virtual machine's network interfaces.
* Add a Firewall or Network Virtual Appliance (NVA) to your virtual network and point traffic to it using a User Defined Route (UDR).

#### Use flexible orchestration mode for Virtual Machine Scale Sets
 
* Flexible scale sets are secure by default. Any instances created via Flexible scale sets don't have the default outbound access IP associated with them, so an explicit outbound method is required. For more information, see [Flexible orchestration mode for Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes#what-has-changed-with-flexible-orchestration-mode)

### FAQs: Clearing Default Outbound IP Alert

#### Why do I see an alert showing I have a default outbound IP on my VM?

There's a NIC-level parameter (defaultOutboundConnectivityEnabled) which tracks if default outbound IP is allocated to a VM/Virtual Machine Scale Set instance. This is used to generate an Azure portal banner for VM/Virtual Machine Scale Set that flags this state.  There are also specific Azure Advisor recommendations with this information for your subscriptions. If you want to view which of your virtual machines or Virtual Machine Scale Sets have a default outbound IP assigned to them, follow these steps:
1. Type 'Advisor' into the search bar in the Azure portal and then select this option when it comes up.
2. Select 'Operational Excellence'
3. Look for the recommendations 'Add explicit outbound method to disable default outbound' and/or 'Add explicit outbound method to disable default outbound for Virtual Machine Scale Sets' (note these are two different items)
4. If either of these exist, select the respective recommendation name and you will see the network interface cards (NICs) of all the virtual machnes/Virtual Machine Scale Set instances that have default outbound enabled.

#### How do I clear this alert?

1. An explicit method of outbound must be utilized for the flagged VM/Virtual Machine Scale Set. See the section above for different options.
2. The subnet should be made private to prevent new default outbound IPs from being created.
3. Any applicable virtual machines in the subnet with the flag must be stopped and deallocated for the changes to be reflected in the NIC-level parameter and the flag to clear. (Note this is also true in the reverse; in order for a machine to be given a default outbound IP after having the subnet-level parameter set to false, a stop/deallocate of the virtual machine is required.)

#### I already am using an explicit method of outbound, so why do I still see this alert?

In some cases, a default outbound IP is still assigned to virtual machines in a nonprivate subnet, even when an explicit outbound method—such as a NAT Gateway or a UDR directing traffic to an NVA/firewall—is configured. This doesn't mean the default outbound IPs are used for egress unless those explicit methods are removed. To completely remove the default outbound IPs (and remove the alert), the subnet must be made private, and the virtual machines must be stopped and deallocated.

### FAQs: Default Behavior Change to Private Subnets

#### What does making private subnets default mean, and how will it be implemented?
With the API version released after March 31, 2026, the defaultOutboundAccess property for subnets in new VNETs will be set to "false" by default. This change makes subnets private by default and prevents generation of default outbound IPs for virtual machines in those subnets.
This behavior applies across all configuration methods--ARM templates, Azure portal, PowerShell, and CLI. Earlier versions of ARM templates (or tools like Terraform that can specify older versions) will continue to set defaultOutboundAccess as null, which implicitly allows outbound access.

#### What happens to my existing VNETs and virtual machines? What about new virtual machines created in existing VNETs?
No changes are made to existing VNETs. This means that both existing virtual machines and newly created virtual machines in these VNETs continue to generate default outbound IP addresses unless the subnets are manually modified to become private.

#### What about new virtual network deployments? My infrastructure has a dependency on default outbound IPs and isn't ready to move to private subnets at this time.

You can still configure subnets as nonprivate using any supported method (ARM templates, portal, CLI, PowerShell). This ensures compatibility for infrastructures that rely on default outbound IPs and aren't yet ready to transition to private subnets.

## Next steps

For more information on outbound connections in Azure, see:

* [Source Network Address Translation (SNAT) for outbound connections](../../load-balancer/load-balancer-outbound-connections.md).

* [What is Azure NAT Gateway?](../../nat-gateway/nat-overview.md)
