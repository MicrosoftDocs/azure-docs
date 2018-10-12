---
title: 'Use Azure Virtual WAN to create a Point-to-Site connection to Azure | Microsoft Docs'
description: In this tutorial, learn how to use Azure Virtual WAN to create a Point-to-Site VPN connection to Azure.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: tutorial
ms.date: 09/26/2018
ms.author: cherylmc
Customer intent: As someone with a networking background, I want to connect remote users to my VNets using Virtual WAN and I don't want to go through a Virtual WAN partner.
---
# Tutorial: Create a Point-to-Site connection using Azure Virtual WAN (Preview)

This tutorial shows you how to use Virtual WAN to connect to your resources in Azure over an IPsec/IKE (IKEv2) or OpenVPN VPN connection. This type of connection requires a client to be configured on the client computer. For more information about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a WAN
> * Create a P2S configuration
> * Create a hub
> * Apply P2S configuration to a hub
> * Connect a VNet to a hub
> * Download and apply the VPN client configuration
> * View your virtual WAN
> * View resource health
> * Monitor a connection

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## Before you begin

[!INCLUDE [Before you begin](../../includes/virtual-wan-tutorial-vwan-before-include.md)]

## <a name="register"></a>Register this feature

Click the **TryIt** to register this feature easily using Azure Cloud Shell.

>[!NOTE]
>If you don't register this feature, you will not be able to use it, or to see it in the portal.
>
>

After clicking **TryIt** to open the Azure Cloud Shell, copy and paste the following commands:

```azurepowershell-interactive
Register-AzureRmProviderFeature -ProviderNamespace Microsoft.Network -FeatureName AllowP2SCortexAccess
```
 
```azurepowershell-interactive
Register-AzureRmProviderFeature -ProviderNamespace Microsoft.Network -FeatureName AllowVnetGatewayOpenVpnProtocol
```

```azurepowershell-interactive
Get-AzureRmProviderFeature -ProviderNamespace Microsoft.Network -FeatureName AllowP2SCortexAccess
```

```azurepowershell-interactive
Get-AzureRmProviderFeature -ProviderNamespace Microsoft.Network -FeatureName AllowVnetGatewayOpenVpnProtocol
```

Once the feature shows as registered, reregister the subscription to Microsoft.Network namespace.

```azurepowershell-interactive
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network
```

## <a name="vnet"></a>1. Create a virtual network

[!INCLUDE [Create a virtual network](../../includes/virtual-wan-tutorial-vnet-include.md)]

## <a name="openvwan"></a>2. Create a virtual WAN

From a browser, navigate to the [Azure portal (Preview)](http://aka.ms/azurevirtualwanpreviewfeatures) and sign in with your Azure account.

[!INCLUDE [Create a virtual WAN](../../includes/virtual-wan-tutorial-vwan-include.md)]

## <a name="hub"></a>3. Create a hub

> [!NOTE]
> Don't select the setting "Include point-to-site gateway"" in this step.
>

[!INCLUDE [Create a virtual WAN](../../includes/virtual-wan-tutorial-hub-include.md)]

## <a name="site"></a>4. Create a P2S configuration

A P2S configuration defines the parameters for connecting remote clients.

1. Navigate to **All resources**.
2. Click the virtual WAN that you created.
3. Under **Virtual WAN architecture**, click **Point-to-site configurations**.
4. Click **+Add point-to-site config** at the top of the page to open the **Create new point-to-site configuration** page.
5. On the **Create new point-to-site configuration** page, fill in the following fields:

  *  **Configuration name** - This is the name by which you want to refer to your configuration.
  *  **Tunnel type** - The protocol to use for the tunnel.
  *  **Address pool** - This is the IP address pool that the clients will be assigned Is from.
  *  **Root Certificate Name** - A descriptive name for the certificate.
  *  **Root Certificate Data** - Base-64 encoded X.509 certificate data.

5. Click **Create** to create the configuration.

## <a name="hub"></a>5. Edit hub assignment

1. On the page for your virtual WAN, click **Point-to-site configurations**.
2. Under **Hub**, you see a list of configurations that haven't yet been connected to a hub.
3. Select the configuration that you want to associate and click **Edit hub assignment**
4. From the dropdown, select the hub(s) that you want to associate the configuration to.
5. Click **Assign**. 
6. The operation will can take upto 30 minutes to complete.

## <a name="vnet"></a>6. Connect your VNet to a hub

In this step, you create the peering connection between your hub and a VNet. Repeat these steps for each VNet that you want to connect.

1. On the page for your virtual WAN, click **Virtual network connection**.
2. On the virtual network connection page, click **+Add connection**.
3. On the **Add connection** page, fill in the following fields:

    * **Connection name** - Name your connection.
    * **Hubs** - Select the hub you want to associate with this connection.
    * **Subscription** - Verify the subscription.
    * **Virtual network** - Select the virtual network you want to connect to this hub. The virtual network cannot have an already existing virtual network gateway.

## <a name="device"></a>7. Download VPN profile

Use the VPN profile to configure your clients.

1. On the page for your virtual WAN, click **Point-to-site configurations**.
2. At the top of the  page, click **Download point-to-site profile**. 
3. Once the file has finished creating, you can click the link to download it.
4. Use the profile file to configure the point-to-site clients.

## <a name="device"></a>8. Configure point-to-site clients
Use the downloaded profile to configure the remote access clients. The procedure for each operating system is different, please follow the correct instructions below:

### Microsoft Windows
#### OpenVPN

1.	Download and install the OpenVPN client from the official website.
2.	Download the VPN profile for the gateway. This can be done from the Point-to-site configurations tab in Azure Portal, or New-AzureRmVpnClientConfiguration in PowerShell.
3.	Unzip the profile. Open the vpnconfig.ovpn configuration file from the OpenVPN folder in notepad.
4.	Fill in the P2S client certificate section with the P2S client certificate public key in base64. In a PEM formatted certificate, you can simply open the .cer file and copy over the base64 key between the certificate headers. See here how to export a certificate to get the encoded public key.
5.	Fill in the private key section with the P2S client certificate private key in base64. See here how to extract private key.
6.	Do not change any other fields. Use the filled in configuration in client input to connect to the VPN.
7.	Copy the vpnconfig.ovpn file to C:\Program Files\OpenVPN\config folder.
8.	Right-click the OpenVPN icon in the system tray and click connect.

#### IKEv2

1. Select the VPN client configuration files that correspond to the architecture of the Windows computer. For a 64-bit processor architecture, choose the 'VpnClientSetupAmd64' installer package. For a 32-bit processor architecture, choose the 'VpnClientSetupX86' installer package.
2. Double-click the package to install it. If you see a SmartScreen popup, click More info, then Run anyway.
3. On the client computer, navigate to Network Settings and click VPN. The VPN connection shows the name of the virtual network that it connects to.
4. Before you attempt to connect, verify that you have installed a client certificate on the client computer. A client certificate is required for authentication when using the native Azure certificate authentication type. For more information about generating certificates, see Generate Certificates. For information about how to install a client certificate, see Install a client certificate.

### Mac (OS X)
#### OpenVPN

1.	Download and install an OpenVPN client, such as TunnelBlik from https://tunnelblick.net/downloads.html 
2.	Download the VPN profile for the gateway. This can be done from the Point-to-site configuration tab in Azure Portal, or New-AzureRmVpnClientConfiguration in PowerShell.
3.	Unzip the profile. Open the vpnconfig.ovpn configuration file from the OpenVPN folder in notepad.
4.	Fill in the P2S client certificate section with the P2S client certificate public key in base64. In a PEM formatted certificate, you can simply open the .cer file and copy over the base64 key between the certificate headers. See here how to export a certificate to get the encoded public key.
5.	Fill in the private key section with the P2S client certificate private key in base64. See here how to extract private key.
6.	Do not change any other fields. Use the filled in configuration in client input to connect to the VPN.
7.	Double-click the profile file to create the profile in tunnelblik
8.	Launch Tunnelblik from the applications folder
9.	Click on the Tunneblik icon in the system tray and pick connect

#### IKEv2

Azure does not provide mobileconfig file for native Azure certificate authentication. You have to manually configure the native IKEv2 VPN client on every Mac that will connect to Azure. The Generic folder has all the information that you need to configure it. If you don't see the Generic folder in your download, it's likely that IKEv2 was not selected as a tunnel type. Once IKEv2 is selected, generate the zip file again to retrieve the Generic folder. The Generic folder contains the following files:

- VpnSettings.xml, which contains important settings like server address and tunnel type.
- VpnServerRoot.cer, which contains the root certificate required to validate the Azure VPN Gateway during P2S connection setup.

## <a name="viewwan"></a>9. View your virtual WAN

1. Navigate to the virtual WAN.
2. On the Overview page, each point on the map represents a hub. Hover over any point to view the hub health summary.
3. In the Hubs and connections section, you can view hub status, site, region, VPN connection status, and bytes in and out.

## <a name="viewhealth"></a>10. View your resource health

1. Navigate to your WAN.
2. On your WAN page, in the **SUPPORT + Troubleshooting** section, click **Health** and view your resource.

## <a name="connectmon"></a>11. Monitor a connection

Create a connection to monitor communication between an Azure VM and a remote site. For information about how to set up a connection monitor, see [Monitor network communication](~/articles/network-watcher/connection-monitor.md). The source field is the VM IP in Azure, and the destination IP is the Site IP.

## <a name="cleanup"></a>12. Clean up resources

When you no longer need these resources, you can use [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) to remove the resource group and all of the resources it contains. Replace "myResourceGroup" with the name of your resource group and run the following PowerShell command:

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroup -Force
```

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a WAN
> * Create a site
> * Create a hub
> * Connect a hub to a site
> * Connect a VNet to a hub
> * Download and apply the VPN device configuration
> * View your virtual WAN
> * View resource health
> * Monitor a connection

To learn more about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md) page.