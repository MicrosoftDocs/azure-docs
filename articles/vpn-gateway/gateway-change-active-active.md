---
title: 'Change a gateway to active-active mode'
titleSuffix: Azure VPN Gateway
description: Learn how to change a VPN gateway from active-standby to active-active.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 07/29/2024
ms.author: cherylmc

---

# Change a VPN gateway to active-active

The steps in this article help you change active-standby VPN gateways to active-active. You can also change an active-active gateway to active-standby. For more information about active-active gateways, see [About active-active gateways](about-active-active-gateways.md) and [Design highly available gateway connectivity for cross-premises and VNet-to-VNet connections](vpn-gateway-highlyavailable.md).

## Change active-standby to active-active

Use the following steps to convert active-standby mode gateway to active-active mode.

1. Navigate to the page for your virtual network gateway.

1. On the left menu, select **Configuration**.

1. On the **Configuration** page, configure the following settings:

   * Change the Active-active mode to **Enabled**.
   * Click **Add new** to add another public IP address. If you already have an IP address that you previously created that's available to dedicate to this resource, you can instead select it from the **SECOND PUBLIC IP ADDRESS** dropdown.

   :::image type="content" source="./media/active-active-portal/active-active.png" alt-text="Screenshot shows the Configuration page with active-active mode enabled." lightbox="./media/active-active-portal/active-active.png":::

1. On the **Choose public IP address** page and either specify an existing public IP address that meets the criteria, or select **+Create new** to create a new public IP address to use for the second VPN gateway instance. After you've specified the second public IP address, click **OK**.

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

For more information about active-active gateways, see [About active-active gateways](vpn-gateway-about-vpn-gateway-settings.md#active).
