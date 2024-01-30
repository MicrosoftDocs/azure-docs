---
title: 'Configure active-active VPN gateways: Azure portal'
titleSuffix: Azure VPN Gateway
description: Learn how to configure active-active virtual network gateways using the Azure portal.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/22/2021
ms.author: cherylmc

---

# Configure active-active VPN gateways using the portal

This article helps you create highly available active-active VPN gateways using the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md) and Azure portal. You can also configure an active-active gateway using [PowerShell](vpn-gateway-activeactive-rm-powershell.md).

To achieve high availability for cross-premises and VNet-to-VNet connectivity, you should deploy multiple VPN gateways and establish multiple parallel connections between your networks and Azure. See [Highly Available cross-premises and VNet-to-VNet connectivity](vpn-gateway-highlyavailable.md) for an overview of connectivity options and topology.

> [!IMPORTANT]
> The active-active mode is available for all SKUs except Basic or Standard. For more information, see [Configuration settings](vpn-gateway-about-vpn-gateway-settings.md#gwsku).
>

The steps in this article help you configure a VPN gateway in active-active mode. There are a few differences between active-active and active-standby modes. The other properties are the same as the non-active-active gateways. 

* Active-active gateways have two Gateway IP configurations and two public IP addresses.
* Active-active gateways have active-active setting enabled.
* The virtual network gateway SKU can't be Basic or Standard.

If you already have a VPN gateway, you can [Update an existing VPN gateway](#update) from active-standby to active-active mode, or from active-active to active-standby mode.

## <a name="vnet"></a>Create a VNet

If you don't already have a VNet that you want to use, create a VNet using the following values:

* **Resource group:** TestRG1
* **Name:** VNet1
* **Region:** (US) East US
* **IPv4 address space:** 10.1.0.0/16
* **Subnet name:** FrontEnd
* **Subnet address space:** 10.1.0.0/24

[!INCLUDE [Create a virtual network](../../includes/vpn-gateway-basic-vnet-rm-portal-include.md)]

## <a name="gateway"></a>Create an active-active VPN gateway

In this step, you create an active-active virtual network gateway (VPN gateway) for your VNet. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

Create a virtual network gateway using the following values:

* **Name:** VNet1GW
* **Region:** East US
* **Gateway type:** VPN
* **VPN type:** Route-based
* **SKU:** VpnGw2
* **Generation:** Generation2
* **Virtual network:** VNet1
* **Gateway subnet address range:** 10.1.255.0/27
* **Public IP address:** Create new
* **Public IP address name:** VNet1GWpip

[!INCLUDE [Create a vpn gateway](../../includes/vpn-gateway-add-gw-portal-include.md)]
[!INCLUDE [Configure PIP settings](../../includes/vpn-gateway-add-gw-pip-active-portal-include.md)]

You can see the deployment status on the Overview page for your gateway. After the gateway is created, you can view the IP address that has been assigned to it by looking at the virtual network in the portal. The gateway appears as a connected device.

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

## <a name ="update"></a> Update an existing VPN gateway

This section helps you change an existing Azure VPN gateway from active-standby to active-active mode, and from active-active to active-standby mode. When you change an active-standby gateway to active-active, you create another public IP address, then add a second gateway IP configuration. 

### Change active-standby to active-active

Use the following steps to convert active-standby mode gateway to active-active mode. If your gateway was created using the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md), you can also upgrade the SKU on this page.

1. Navigate to the page for your virtual network gateway.

1. On the left menu, select **Configuration**.

1. On the **Configuration** page, configure the following settings: 

   * Change the Active-active mode to **Enabled**.
   * Click **Create another gateway IP configuration**.

   :::image type="content" source="./media/active-active-portal/configuration.png" alt-text="Screenshot shows the Configuration page.":::

1. On the **Choose public IP address** page and either specify an existing public IP address that meets the criteria, or select **+Create new** to create a new public IP address to use for the second VPN gateway instance.

1. On the **Create public IP address** page, select the **Basic** SKU, then click **OK**.

1. At the top of the **Configuration** page, click **Save**. This update can take about 30-45 minutes to complete.

> [!IMPORTANT]
> If you have BGP sessions running, be aware that the Azure VPN Gateway BGP configuration will change and two newly assigned BGP IPs will be provisioned within the Gateway Subnet address range. The old Azure VPN Gateway BGP IP address will no longer exist. This will incur downtime and updating the BGP peers on the on-premises devices will be required. Once the gateway is finished provisioning, the new BGP IPs can be obtained and the on-premises device configuration will need to be updated accordingly. This applies to non APIPA BGP IPs. To understand how to configure BGP in Azure, see [How to configure BGP on Azure VPN Gateways](bgp-howto.md).
> 

### Change active-active to active-standby

Use the following steps to convert active-active mode gateway to active-standby mode.

1. Navigate to the page for your virtual network gateway.

1. On the left menu, select **Configuration**.

1. On the **Configuration** page, change the Active-active mode to **Disabled**.

1. At the top of the **Configuration** page, click **Save**.

> [!IMPORTANT]
> If you have BGP sessions running, be aware that the Azure VPN Gateway BGP configuration will change from two BGP IP addresses to a single BGP address. The platform generally assigns the last usable IP of the Gateway Subnet. This will incur downtime and updating the BGP peers on the on-premises devices will be required. This applies to non APIPA BGP IPs. To understand how to configure BGP in Azure, see [How to configure BGP on Azure VPN Gateways](bgp-howto.md).
> 

## Next steps

To configure connections, see the following articles:

* [Site-to-Site VPN connections](./tutorial-site-to-site-portal.md)
* [VNet-to-VNet connections](vpn-gateway-howto-vnet-vnet-resource-manager-portal.md)
