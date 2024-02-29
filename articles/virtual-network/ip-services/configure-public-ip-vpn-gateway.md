---
title: Manage a public IP address with a VPN gateway
titleSuffix: Azure Virtual Network
description: Learn about the ways a public IP address is used with a VPN gateway and how to change the configuration.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to 
ms.date: 09/19/2023
ms.custom: template-how-to, engagement-fy23
---

# Manage a public IP address with a VPN gateway

Public IP addresses are available in two SKUs; standard, and basic. The selection of SKU determines the features of the IP address. The SKU determines the resources that the IP address can be associated with. 

A VPN gateway is a virtual network gateway used to send encrypted traffic between an Azure virtual network and an on-premises location over the public Internet. You can also use a VPN gateway to send encrypted traffic between Azure virtual networks over the Microsoft network. Each virtual network can have only one VPN gateway. A VPN gateway requires a public IP address for its configuration. A public IP address is used as the external connection point of the VPN.

VPN gateway supports standard and basic SKU public IP addresses depending on the SKU of the VPN gateway. Public IP prefixes aren't supported. 

In this article, you learn how to create a VPN gateway using an existing public IP in your subscription. 

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One standard SKU public IP address in your subscription. The IP address can't be associated with any resources. For more information on creating a standard SKU public IP address, see [Create a public IP address using the Azure portal](./create-public-ip-portal.md).
    - For the purposes of the examples in this article, name the new public IP addresses **myStandardPublicIP**.

## Create VPN gateway using existing public IP

In this section, you create a VPN gateway. You select the IP address you created in the prerequisites as the public IP for the VPN gateway.

### Create virtual network

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual network**.

1. In the search results, select **Virtual networks**.

1. Select **+ Create**.

1. In **Create virtual network**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroupVPN**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select **West US 2**. |
    
1. Select the **Review + create** tab, or select the blue **Review + create** button.

7. Select **Create**.

8. In the search box at the top of the portal, enter **Virtual network**.

9. In the search results, select **Virtual networks**.

10. Select **myVNET** in **Virtual networks**.

11. Select **Subnets** in **Settings** of **myVNET**.

12. Select **+ Gateway subnet**.

13. In **Add subnet**, change the **Subnet address range** from **/24** to **/27**.

14. Select **Save**.

### Create VPN gateway

2. In the search box at the top of the portal, enter **Virtual network gateway**.

3. In the search results, select **Virtual network gateways**.

4. Select **+ Create**.

5. In **Create virtual network gateway**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | **Instance details** |   |
    | Name | Enter **myVPNGateway**. |
    | Region | Select **West US 2**. |
    | Gateway type | Leave the default of **VPN**. |
    | VPN type | Leave the default of **Route-based**. |
    | SKU | Select **VpnGw1AZ**. |
    | Virtual network | Select **myVNet**. |
    | Subnet | Entry will autoselect **GatewaySubnet** you created earlier |
    | **Public IP address** |   |
    | Public IP address | Select **Use existing**. |
    | Choose public IP address | Select **myStandardPublicIP** or your public IP address |
    | Enable active-active mode | Leave the default of **Disabled**. |
    | Configure BGP | Leave the default of **Disabled**. |

6. Select the **Review + create** tab, or select the blue **Review + create** button.

7. Select **Create**.

> [!NOTE]
> This is a simple deployment of a VPN gateway. For advanced configuration and setup, see [Tutorial: Create and manage a VPN gateway using Azure portal](../../vpn-gateway/tutorial-create-gateway-portal.md).
>
> For more information on Azure VPN Gateway, see [What is VPN Gateway?](../../vpn-gateway/vpn-gateway-about-vpngateways.md)

## Change or remove public IP address

VPN Gateway doesn't support changing the primary public IP address after creation.

## Caveats

* Public IPv6 addresses aren't supported for VPN Gateways at this time.
 
## Next steps

In this article, you learned how to create a VPN gateway using an existing public IP address. 

- To learn more about public IP addresses in Azure, see [Public IP addresses](./public-ip-addresses.md).
- To learn more about VPN gateways, see [What is VPN Gateway?](../../vpn-gateway/vpn-gateway-about-vpngateways.md)
