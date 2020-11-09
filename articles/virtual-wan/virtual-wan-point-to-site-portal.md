---

title: 'Tutorial: Use Azure Virtual WAN to create a Point-to-Site connection to Azure'
description: In this tutorial, learn how to use Azure Virtual WAN to create a Point-to-Site VPN connection to Azure.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: tutorial
ms.date: 11/09/2020
ms.author: cherylmc

---
# Tutorial: Create a User VPN connection using Azure Virtual WAN

This tutorial shows you how to use Virtual WAN to connect to your resources in Azure over an IPsec/IKE (IKEv2) or OpenVPN VPN connection. This type of connection requires the VPN client to be configured on the client computer. For more information about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual WAN
> * Create a P2S configuration
> * Create a virtual hub
> * Specify DNS servers
> * Generate VPN client profile configuration package
> * Configure VPN clients
> * View your virtual WAN

![Virtual WAN diagram](./media/virtual-wan-about/virtualwanp2s.png)

## Prerequisites

[!INCLUDE [Before beginning](../../includes/virtual-wan-before-include.md)]

## <a name="wan"></a>Create a virtual WAN

[!INCLUDE [Create a virtual WAN](../../includes/virtual-wan-create-vwan-include.md)]

## <a name="p2sconfig"></a>Create a P2S configuration

A point-to-site (P2S) configuration defines the parameters for connecting remote clients.

[!INCLUDE [Create P2S configuration](../../includes/virtual-wan-p2s-configuration-include.md)]

## <a name="hub"></a>Create virtual hub and gateway

[!INCLUDE [Create hub](../../includes/virtual-wan-p2s-hub-include.md)]

## <a name="dns"></a>Specify DNS server

You can configure this setting when you create the hub, or modify it at a later time. To modify, locate the virtual hub. Under **User VPN (point to site)**, select **Configure** and enter the DNS server IP address(es) in the **Custom DNS Servers** text box(es). You can specify up to 5 DNS Servers.

   :::image type="content" source="media/virtual-wan-point-to-site-portal/custom-dns.png" alt-text="custom DNS" lightbox="media/virtual-wan-point-to-site-portal/custom-dns-expand.png":::

## <a name="download"></a>Generate VPN client profile package

Generate and download the VPN client profile package to configure your VPN clients.

[!INCLUDE [Download profile](../../includes/virtual-wan-p2s-download-profile-include.md)]

## <a name="configure-client"></a>Configure VPN clients

Use the downloaded profile package to configure the remote access VPN clients. The procedure for each operating system is different. Follow the instructions that apply to your system.

[!INCLUDE [Configure clients](../../includes/virtual-wan-p2s-configure-clients-include.md)]

## <a name="viewwan"></a>View your virtual WAN

1. Navigate to the virtual WAN.
1. On the **Overview** page, each point on the map represents a hub.
1. In the **Hubs and connections** section, you can view hub status, site, region, VPN connection status, and bytes in and out.

## <a name="cleanup"></a>Clean up resources

When you no longer need these resources, you can use [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) to remove the resource group and all of the resources it contains. Replace "myResourceGroup" with the name of your resource group and run the following PowerShell command:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Next steps

Next, to learn more about Virtual WAN, see:

> [!div class="nextstepaction"]
> * [Virtual WAN FAQ](virtual-wan-faq.md)
