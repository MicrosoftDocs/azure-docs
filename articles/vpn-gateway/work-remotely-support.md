---
title: 'Remote work and point-to-site VPN gateways'
titleSuffix: Azure VPN Gateway
description: Learn how you can use VPN Gateway point-to-site connections in order to work remotely.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: conceptual
ms.date: 07/10/2024
ms.author: cherylmc

---
# Remote work using Azure VPN Gateway VPN connections

This article describes the options that are available to organizations to set up remote access for their users or to supplement their existing solutions with additional capacity. The Azure VPN Gateway point-to-site VPN solution is cloud-based and can be provisioned quickly to cater for the increased demand of users to work from home. It can scale up easily and turned off just as easily and quickly when the increased capacity isn't needed anymore.

## <a name="p2s"></a>About point-to-site VPN

A point-to-site (P2S) VPN gateway connection lets you create a secure connection to your virtual network from an individual client computer. A P2S connection is established by starting it from the client computer. This solution is useful for telecommuters who want to connect to Azure VNets or on-premises data centers from a remote location, such as from home or a conference. For more information about Azure point-to-site VPN, see [About VPN Gateway point-to-site VPN](point-to-site-about.md) and the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md).

The following table shows the client operating systems and the authentication options that are available to them. It would be helpful to select the authentication method based on the client OS that is already in use. For example, select OpenVPN with Certificate-based authentication if you have a mixture of client operating systems that need to connect. Also, note that point-to-site VPN is only supported on route-based VPN gateways.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

## <a name="scenario1"></a>Scenario 1 - Users need access to resources in Azure only

In this scenario, the remote users only need to access to resources that are in Azure.

:::image type="content" source="./media/working-remotely-support/scenario1.png" alt-text="Diagram that shows a point-to-site scenario for users that need access to resources in Azure only." lightbox="./media/working-remotely-support/scenario1.png":::

At a high level, the following steps are needed to enable users to connect to Azure resources securely:

1. Create a virtual network gateway (if one doesn't exist).
1. Configure point-to-site VPN on the gateway.

   * For certificate authentication, see [Configure point-to-site certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md).
   * For Microsoft Entra ID authentication, see [Configure point-to-site Microsoft Entra ID authentication](point-to-site-entra-gateway.md)
   * For troubleshooting point-to-site connections, see [Troubleshooting: Azure point-to-site connection problems](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).
1. Download and distribute the VPN client configuration.
1. Distribute the certificates (if certificate authentication is selected) to the clients.
1. Connect to Azure VPN.

## <a name="scenario2"></a>Scenario 2 - Users need access to resources in Azure and/or on-premises resources

In this scenario, the remote users need to access to resources that are in Azure and in the on premises data center(s).

:::image type="content" source="./media/working-remotely-support/scenario2.png" alt-text="Diagram that shows a point-to-site scenario for users that need access to resources in Azure." lightbox="./media/working-remotely-support/scenario2.png":::

At a high level, the following steps are needed to enable users to connect to Azure resources securely:

1. Create a virtual network gateway (if one doesn't exist).
1. Configure point-to-site VPN on the gateway (see [Scenario 1](#scenario1)).
1. Configure a site-to-site tunnel on the Azure virtual network gateway with BGP enabled.
1. Configure the on-premises device to connect to Azure virtual network gateway.
1. Download the point-to-site profile from the Azure portal and distribute to clients

To learn how to set up a site-to-site VPN tunnel, see [Create a site-to-site VPN connection](./tutorial-site-to-site-portal.md).

## Next Steps

* [Configure a P2S connection - Microsoft Entra ID authentication](point-to-site-entra-gateway.md)
* [Configure a P2S connection - Certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
* [Configure a P2S connection - RADIUS authentication](point-to-site-how-to-radius-ps.md)
* [About VPN Gateway point-to-site VPN](point-to-site-about.md)
* [About point-to-site VPN routing](vpn-gateway-about-point-to-site-routing.md)

**"OpenVPN" is a trademark of OpenVPN Inc.**
