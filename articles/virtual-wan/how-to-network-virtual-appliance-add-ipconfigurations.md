---
title: 'Azure Virtual WAN: Manage IP Configurations for Network Virtual Appliance (NVA) in the hub'
description: Learn how to manage  IP configurations for Network Virtual Appliance in the Virtual WAN hub.
author: wtnlee
ms.service: virtual-wan
ms.topic: how-to
ms.date: 01/04/2023
ms.author: wellee
# Customer intent: As someone with a networking background, I want to manage IP configurations to a Network Virtual Appliance (NVA) in my Virtual WAN hub.
---
# How to manage IP configurations for NVAs in the hub

The following article describes how to manage IP configurations for Network Virtual Appliances (NVAs) in the Virtual WAN hub.

> [!Important]
> IP configuration management for Virtual WAN integrated Network Virtual Appliances is currently in Public Preview and is provided without a service-level agreement. It shouldn't be used for production workloads. Certain features might not be supported, might have constrained capabilities, or might not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Background

Network Virtual Appliances (NVAs) in Azure Virtual WAN are deployed as Virtual Machine Scale Sets with Virtual Machine instances that have two or three network interfaces. Each interface on a Virtual Machine instance is automatically allocated one IP address. You can increase the number of IP configurations (which translates to number of IP addresses) assigned to each NVA network interface.

Common reasons to increase the number of IP configurations on NVA interfaces include:
* Allocating extra Public IP addresses:
    * Increasing the number of Source Network Address Translation (SNAT) ports available for each NVA instance for theInternet egress use case (for example Virtual Network to Internet traffic).
    * Allow SD-WAN/VPN tunnels from different sources to use different public IP addresses for tunnel termination on a single NVA instance.
    * Allow different applications to use different source IPs when communicating with the Internet.
* Allocating extra Private IP addresses:
    * Increasing the amount of ports available for [Destination Network Address Translation (DNAT)](how-to-network-virtual-appliance-inbound.md) use cases.

For a full-list of use-cases enabled with multiple IP addresses on NVA instances, reference your provider documentation.

## Concepts

IP configurations are logical representations of the IP addresses associated to each Network Interface Card (NIC) in a Virtual WAN NVA. Each NIC of a Virtual WAN NVA by default has one IP configuration. Therefore, exactly one IP (private or public/private pair) is assigned to each Virtual Machine (VM) instance's NICs. The default-assigned IP configuration and associated IP address is known as the **primary** IP configuration.

You can allocate additional IP addresses to your NVA NICs by creating additional IP configurations and associating it to your NVAs NICs. These additional IP configurations are called **secondary** IP configurations.

The following table describes the types of Network Interfaces that are attached to each NVA VM instance and the type of IPs allocated by each IP configuration:

|NIC Type| Mandatory/Optional Interface|IP address set allocated per IP configuration| Supports multiple IP configurations on NIC|
|--|--|--|--|
| External/Public |Mandatory| one \<private IP, public IP\> pair|Yes|
|Internal/Private| Mandatory | one private IP| Yes|
|Additional/Auxillary| Optional| one private IP or one \<private, public IP\> pair| No|

The following example describes a NVA in Virtual WAN hub where multiple IP configurations are assigned to NICs:

|NIC|IP Configuration count| IP Configurations| IPs assigned |
|--|--|--| --|
| External/Public|3|publicnicipconfig, publicnicipconfig-2, publicnicipconfig-3|  3 \<private IP, public IP \> adddress pairs per NVA instance|
| Internal/Private|2|privatenicipconfig, privatenicipconfig-2| 2 private IP address per NVA instance|

:::image type="content" source="./media/network-virtual-appliance-address/sample-address-allocation.png"alt-text="Screenshot showing sample IP address allocation scheme."lightbox="./media/network-virtual-appliance-address/sample-address-allocation.png":::

## Known Limitations and Considerations

The following section describes known limitations and considerations associated to assigning multiple IP configurations to NVA NICs.

### Limitations

* Each NVA NIC (External or Internal) can have at most three IP-configurations. This limit is to help ensure that there are sufficient IP addresses available in the Virtual WAN hub to allocate to NVA deployments.  
* Additonal/Auxillary NICs must have exactly one IP-configuration. You can't add additional IP addresses to Additional/Auxillary NICs.
* Azure Virtual WAN Hub routers initiates/accepts Border Gateway Protocol (BGP) sessions with the primary IP configuration of the internal/private NIC assigned to each NVA VM instance. Non-primary IP configurations assigned to the internal/private NIC of NVA instances can't be used to establish BGP.
* IP configurations must adhere to the following naming convention:
    * IP configurations on the private/internal NIC must have *privatenicipconfig* prefix. For example, *privatenicipconfig-1* is a valid name while *myprivateipconfig* isn't a valid name for private/internal NIC IP configurations.
    * IP configurations on the public/external NIC must have *publicnicipconfig* prefix. For example, *publicnicipconfig-1* is a valid name while *mypublicipconfig* isn't a valid name for public/external NIC IP configurations.
* You can't modify IP configurations on an NVA resource if the NVA isn't in a **Succeeded** provisioning state. Wait for any existing operations to complete before modifying IP configurations.


### Considerations

* Associating an additional IP configuration to your NVA allocates additional IP addresses to all NVA instances.
* The primary IP configuration associated to each NIC can't be modified or deleted.
* For the full list of use cases supported with assigning multiple IP configurations to NVA NICs, reference provider documentation. Depending on the implementation of your NVA operating system, you may not be able to apply multiple IP configurations for certain use cases.
* Azure automatically allocates IP addresses to each Network Virtual Appliance instance. You can't choose the IP addresses allocated to each NVA instance. Private IP addresses are allocated from the Virtual WAN hub address space that is reserved for Integrated NVAs in the hub. Public IP addresses are allocated from the set of available Azure-owned public IPs in the NVAs deployed Azure region.
* IP addresses aren't preserved. Once an IP configuration from a NIC, re-creating the IP configuration doesn't guarantee the same public and/or private IP addresses are allocated to the NVA.

## Creating IP configurations

The following section describes the steps needed to add additional IP configuration to your Network Virtual Appliance.
1. Navigate to your Virtual WAN hub and select **Network Virtual Appliances** under Third-party providers. 
:::image type="content" source="./media/network-virtual-appliance-address/select-network-virtual-appliance.png"alt-text="Screenshot showing how to find NVA from Virtual WAN Hub."lightbox="./media/network-virtual-appliance-address/select-network-virtual-appliance.png":::
2. Select your NVA and select **Manage configurations**.
:::image type="content" source="./media/network-virtual-appliance-address/manage-configurations.png"alt-text="Screenshot showing how to find Manage NVA configurations button."lightbox="./media/network-virtual-appliance-address/manage-configurations.png"::: 
3. Under Settings, select **Interface IP configurations**.
:::image type="content" source="./media/network-virtual-appliance-address/interface-ip-configurations.png"alt-text="Screenshot showing how to find IP configurations."lightbox="./media/network-virtual-appliance-address/interface-ip-configurations.png"::: 
4. Select the NIC you want to add IP configurations to.
:::image type="content" source="./media/network-virtual-appliance-address/select-interface.png"alt-text="Screenshot showing how to select NICs."lightbox="./media/network-virtual-appliance-address/select-interface.png"::: 
1. Select **Add configurations**.
:::image type="content" source="./media/network-virtual-appliance-address/add-configuration-button.png"alt-text="Screenshot showing how to find button used to manage NVA IP configurations."lightbox="./media/network-virtual-appliance-address/add-configuration-button.png"::: 
1. Type in the name of the new IP configuration and select **Save**.
:::image type="content" source="./media/network-virtual-appliance-address/add-and-save-configuration.png"alt-text="Screenshot showing how to create and save new  NVA IP configurations."lightbox="./media/network-virtual-appliance-address/add-and-save-configuration.png"::: 

## Checking IP addresses assigned to a VM instance
1. Select **Instances** under settings.
:::image type="content" source="./media/network-virtual-appliance-address/find-instance.png"alt-text="Screenshot showing how to select instance from the settings bar."lightbox="./media/network-virtual-appliance-address/find-instance.png"::: 
1. Select the VM instance for which you want to see assigned IP addresses.
:::image type="content" source="./media/network-virtual-appliance-address/select-instance-view.png"alt-text="Screenshot showing how to select instance to view configurations."lightbox="./media/network-virtual-appliance-address/select-instance-view.png"::: 

## Removing IP configurations

The following section describes the steps needed to remove IP configurations from  your Network Virtual Appliance.

1. Select the IP configuration you want to delete and select **Remove Configurations**.
:::image type="content" source="./media/network-virtual-appliance-address/delete-button.png"alt-text="Screenshot showing how to delete  NVA IP configurations."lightbox="./media/network-virtual-appliance-address/delete-button.png"::: 
