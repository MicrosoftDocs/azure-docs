---
title: 'Download VPN device configuration scripts for S2S VPN connections'
description: Learn how to download VPN device configuration scripts for S2S VPN connections with Azure VPN Gateways.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 03/18/2024
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell

---
# Download VPN device configuration scripts for S2S VPN connections

This article walks you through downloading VPN device configuration scripts for site-to-site (S2S) VPN connections with Azure VPN Gateway. The following diagram shows the high-level workflow.

:::image type="content" source="./media/vpn-gateway-download-vpndevicescript/downloaddevicescript.png" alt-text="Diagram shows the high level workflow for VPN device configuration scripts." lightbox="./media/vpn-gateway-download-vpndevicescript/downloaddevicescript.png":::

## <a name="about"></a>About VPN device configuration scripts

A cross-premises VPN connection consists of an Azure VPN gateway, an on-premises VPN device, and an IPsec S2S VPN tunnel connecting the two.

The typical workflow includes the following steps:

1. Create and configure an Azure VPN gateway (virtual network gateway).
1. Create and configure an Azure local network gateway that represents your on-premises network and VPN device.
1. Create and configure an Azure VPN connection between the Azure VPN gateway and the local network gateway.
1. Configure the on-premises VPN device represented by the local network gateway to establish the actual S2S VPN tunnel with the Azure VPN gateway.

You can complete steps 1 through 3 in the workflow using the Azure [portal](./tutorial-site-to-site-portal.md), [PowerShell](vpn-gateway-create-site-to-site-rm-powershell.md), or [CLI](vpn-gateway-howto-site-to-site-resource-manager-cli.md). Step 4 involves configuring the on-premises VPN devices outside of Azure. The steps in this article help you download a configuration script for your VPN device with the corresponding values of your Azure VPN gateway, virtual network, on-premises network address prefixes, and VPN connection properties already filled in. You can use the script as a starting point, or apply the script directly to your on-premises VPN devices via the configuration console.

The syntax for each VPN device configuration script is different and heavily dependent on the models and firmware versions. Pay special attention to your device model and version information against the available templates.

* Some parameter values must be unique on the device, and can't be determined without accessing the device. The Azure-generated configuration scripts prefill these values, but you need to ensure the provided values are valid on your device. For example:

  * Interface numbers
  * Access control list numbers
  * Policy names or numbers, etc.

* Look for the keyword, "**REPLACE**", embedded in the script to find the parameters you need to verify before applying the script.
* Some templates include a "**CLEANUP**" section you can apply to remove the configurations. The cleanup sections are commented out by default.

## Download the configuration script - Azure portal

Create an Azure VPN gateway, local network gateway, and a connection resource connecting the two. The following article guides you through the steps:

* [Create a Site-to-Site connection in the Azure portal](./tutorial-site-to-site-portal.md)

Once the connection resource is created, use the following instructions to download the VPN device configuration scripts:

1. In the Azure portal, go to your VPN gateway.
1. In the left pane, select **Connections** to view a list of connections.
1. Select the connection to open the page for that connection. At the top of the page, click **Download configuration**.

   :::image type="content" source="./media/vpn-gateway-download-vpndevicescript/download-configuration.png" alt-text="Screenshot of the configuration screen showing the download configuration link." lightbox="./media/vpn-gateway-download-vpndevicescript/download-configuration.png":::

1. On the **Download configuration** page, from the dropdowns, select the device vendor, device family, and firmware version.

   :::image type="content" source="./media/vpn-gateway-download-vpndevicescript/download-configuration-page.png" alt-text="Screenshot of the configuration screen showing the download configuration page to select vendor, family, and firmware version." lightbox="./media/vpn-gateway-download-vpndevicescript/download-configuration-page.png":::

1. Once you've selected the device, click **Download configuration**. The configuration is generated and you're prompted to save the downloaded script (a text file) from your browser.
1. Open the configuration script with a text editor and search for the keyword "REPLACE" to identify and examine the parameters that might need to be replaced before applying the script to your VPN device.

   :::image type="content" source="./media/vpn-gateway-download-vpndevicescript/edit-script.png" alt-text="Screenshot shows the configuration file opened using a text editor." lightbox="./media/vpn-gateway-download-vpndevicescript/edit-script.png":::

## Download the configuration script - Azure PowerShell

You can also download the configuration script using Azure PowerShell, as shown in the following example:

```azurepowershell-interactive
$RG          = "TestRG1"
$GWName      = "VNet1GW"
$Connection  = "VNet1toSite1"

# List the available VPN device models and versions
Get-AzVirtualNetworkGatewaySupportedVpnDevice -Name $GWName -ResourceGroupName $RG

# Download the configuration script for the connection
Get-AzVirtualNetworkGatewayConnectionVpnDeviceConfigScript -Name $Connection -ResourceGroupName $RG -DeviceVendor Juniper -DeviceFamily Juniper_SRX_GA -FirmwareVersion Juniper_SRX_12.x_GA
```

## Apply the configuration script to your VPN device

After you've downloaded and validated the configuration script, the next step is to apply the script to your VPN device. The actual procedure varies based on your VPN device makes and models. Consult the operation manuals or the instruction pages for your VPN devices.

## Next steps

Continue configuring your [Site-to-Site connection](./tutorial-site-to-site-portal.md).
