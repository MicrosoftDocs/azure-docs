---

title: 'Use Azure Virtual WAN to create a Point-to-Site connection to Azure | Microsoft Docs'
description: In this tutorial, learn how to use Azure Virtual WAN to create a Point-to-Site VPN connection to Azure.
services: virtual-wan
author: anzaman

ms.service: virtual-wan
ms.topic: tutorial
ms.date: 06/29/2020
ms.author: alzam

---
# Tutorial: Create a User VPN connection using Azure Virtual WAN

This tutorial shows you how to use Virtual WAN to connect to your resources in Azure over an IPsec/IKE (IKEv2) or OpenVPN VPN connection. This type of connection requires a client to be configured on the client computer. For more information about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a WAN
> * Create a P2S configuration
> * Create a hub
> * Specify DNS servers
> * Download a VPN client profile
> * View your virtual WAN

![Virtual WAN diagram](./media/virtual-wan-about/virtualwanp2s.png)

## Before you begin

Verify that you have met the following criteria before beginning your configuration:

* You have a virtual network that you want to connect to. Verify that none of the subnets of your on-premises networks overlap with the virtual networks that you want to connect to. To create a virtual network in the Azure portal, see the [quickstart](../virtual-network/quick-create-portal.md).

* Your virtual network does not have any virtual network gateways. If your virtual network has a gateway (either VPN or ExpressRoute), you must remove all gateways. This configuration requires that virtual networks are connected instead, to the Virtual WAN hub gateway.

* Obtain an IP address range for your hub region. The hub is a virtual network that is created and used by Virtual WAN. The address range that you specify for the hub cannot overlap with any of your existing virtual networks that you connect to. It also cannot overlap with your address ranges that you connect to on premises. If you are unfamiliar with the IP address ranges located in your on-premises network configuration, coordinate with someone who can provide those details for you.

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## <a name="wan"></a>Create a virtual WAN

From a browser, navigate to the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

1. Navigate to the Virtual WAN page. In the portal, select **+Create a resource**. Type **Virtual WAN** into the search box and select **Enter**.
1. Select **Virtual WAN** from the results. On the Virtual WAN page, select **Create** to open the Create WAN page.
1. On the **Create WAN** page, on the **Basics** tab, fill in the following fields:

   ![Virtual WAN](./media/virtual-wan-point-to-site-portal/vwan.png)

   * **Subscription** - Select the subscription that you want to use.
   * **Resource group** - Create new or use existing.
   * **Resource group location** - Choose a resource location from the dropdown. A WAN is a global resource and does not live in a particular region. However, you must select a region in order to more easily manage and locate the WAN resource that you create.
   * **Name** - Type the Name that you want to call your WAN.
   * **Type:** Standard. If you create a Basic WAN, you can create only a Basic hub. Basic hubs are capable of VPN site-to-site connectivity only.
1. After you finish filling out the fields, select **Review +Create**.
1. Once validation passes, select **Create** to create the virtual WAN.

## <a name="p2sconfig"></a>Create a P2S configuration

A P2S configuration defines the parameters for connecting remote clients.

1. Navigate to **All resources**.
1. Select the virtual WAN that you created.
1. Select **+Create user VPN config** at the top of the page to open the **Create new user VPN configuration** page.

   :::image type="content" source="media/virtual-wan-point-to-site-portal/p2s1.jpg" alt-text="User VPN configurations":::

1. On the **Create new user VPN configuration** page, fill in the following fields:

   * **Configuration name** - This is the name by which you want to refer to your configuration.
   * **Tunnel type** - The protocol to use for the tunnel.
   * **Root Certificate Name** - A descriptive name for the certificate.
   * **Public Certificate Data** - Base-64 encoded X.509 certificate data.
  
1. Select **Create** to create the configuration.

## <a name="hub"></a>Create hub with point-to-site gateway

1. Under your virtual WAN, select Hubs and select **+New Hub**.

   :::image type="content" source="media/virtual-wan-point-to-site-portal/hub1.jpg" alt-text="new hub":::

1. On the create virtual hub page, fill in the following fields.

   * **Region** - Select the region that you want to deploy the virtual hub in.
   * **Name** - Enter the name that you want to call your virtual hub.
   * **Hub private address space** - The hub's address range in CIDR notation.

   :::image type="content" source="media/virtual-wan-point-to-site-portal/hub2.jpg" alt-text="create virtual hub":::

1. On the Point-to-site tab, complete the following fields:

   * **Gateway scale units** - which represents the aggregate capacity of the User VPN gateway.
   * **Point to site configuration** - which you created in the previous step.
   * **Client Address Pool** -  for the remote users.
   * **Custom DNS Server IP**.

   :::image type="content" source="media/virtual-wan-point-to-site-portal/hub-with-p2s.png" alt-text="hub with point-to-site":::

1. Select **Review + create**.
1. On the **validation passed** page, select **Create**.

## <a name="dns"></a>Specify DNS server

The Virtual WAN User VPN gateways allow you to specify up to 5 DNS Servers. You can configure this during the hub creation process or modify it at a later time. To do so, locate the virtual hub. Under **User VPN (point to site)** , click on configure and enter the DNS server IP address(es) in the **Custom DNS Servers** text box(es).

   :::image type="content" source="media/virtual-wan-point-to-site-portal/custom-dns.png" alt-text="custom DNS" lightbox="media/virtual-wan-point-to-site-portal/custom-dns-expand.png":::

## <a name="download"></a>Download VPN profile

Use the VPN profile to configure your clients.

1. On the page for your virtual WAN, select **User VPN configurations**.
2. At the top of the  page, select **Download user VPN config**. Downloading a WAN-level configuration provides a builtin Traffic Manager-based User VPN profile. For more information about Global profiles or a hub-based profiles, see this [Hub profiles](https://docs.microsoft.com/azure/virtual-wan/global-hub-profile).   Failover scenarios are simplified with global profile.

   If, for some reason, a hub is unavailable, the built-in traffic management provided by the service ensures connectivity via a different hub to Azure resources for point-to-site users. You can always download a hub-specific VPN configuration by navigating to the specific hub. Under **User VPN (point to site)**, download the virtual hub **User VPN** profile.

1. Once the file has finished creating, you can select the link to download it.
1. Use the profile file to configure the VPN clients.

### Configure User VPN clients

Use the downloaded profile to configure the remote access clients. The procedure for each operating system is different, please follow the correct instructions below:

#### Microsoft Windows
##### OpenVPN

1. Download and install the OpenVPN client from the official website.
1. Download the VPN profile for the gateway. This can be done from the User VPN configurations tab in Azure portal, or New-AzureRmVpnClientConfiguration in PowerShell.
1. Unzip the profile. Open the vpnconfig.ovpn configuration file from the OpenVPN folder in notepad.
1. Fill in the P2S client certificate section with the P2S client certificate public key in base64. In a PEM formatted certificate, you can simply open the .cer file and copy over the base64 key between the certificate headers. For steps, see [How to export a certificate to get the encoded public key.](certificates-point-to-site.md)
1. Fill in the private key section with the P2S client certificate private key in base64. For steps, see [How to extract private key.](howto-openvpn-clients.md#windows).
1. Do not change any other fields. Use the filled in configuration in client input to connect to the VPN.
1. Copy the vpnconfig.ovpn file to C:\Program Files\OpenVPN\config folder.
1. Right-click the OpenVPN icon in the system tray and select **connect**.

##### IKEv2

1. Select the VPN client configuration files that correspond to the architecture of the Windows computer. For a 64-bit processor architecture, choose the 'VpnClientSetupAmd64' installer package. For a 32-bit processor architecture, choose the 'VpnClientSetupX86' installer package.
1. Double-click the package to install it. If you see a SmartScreen popup, select **More info**, then **Run anyway**.
1. On the client computer, navigate to **Network Settings** and select **VPN**. The VPN connection shows the name of the virtual network that it connects to.
1. Before you attempt to connect, verify that you have installed a client certificate on the client computer. A client certificate is required for authentication when using the native Azure certificate authentication type. For more information about generating certificates, see [Generate Certificates](certificates-point-to-site.md). For information about how to install a client certificate, see [Install a client certificate](../vpn-gateway/point-to-site-how-to-vpn-client-install-azure-cert.md).

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

To learn more about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md) page.
