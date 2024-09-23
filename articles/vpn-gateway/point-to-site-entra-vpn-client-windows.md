---
title: 'Configure Azure VPN Client - Microsoft Entra ID authentication - Microsoft-registered App ID - Windows'
description: Learn how to configure the Azure VPN Client to connect to a VNet using VPN Gateway point-to-site VPN, OpenVPN protocol connections, and Microsoft Entra ID authentication from a Windows computer. This article applies to P2S gateways configured with the Microsoft-registered App ID.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 06/05/2024
ms.author: cherylmc

---

# Configure Azure VPN Client – Microsoft Entra ID authentication – Windows

This article helps you configure the Azure VPN Client on a Windows computer to connect to a virtual network using a VPN Gateway point-to-site (P2S) VPN and Microsoft Entra ID authentication. For more information about point-to-site connections, see [About point-to-site connections](point-to-site-about.md). The Azure VPN Client is supported with Windows FIPS mode by using the [KB4577063](https://support.microsoft.com/help/4577063/windows-10-update-kb4577063) hotfix.

## Prerequisites

Configure your VPN gateway for point-to-site VPN connections that specify Microsoft Entra ID authentication. See [Configure a P2S VPN gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md).

## Workflow

This article continues on from the [Configure a P2S VPN gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md) steps. This article helps you:

1. Download and install the Azure VPN Client for Windows.
1. Extract the VPN client profile configuration files.
1. Import the client profile settings to the VPN client.
1. Create a connection and connect to Azure.

## <a name="download"></a>Download the Azure VPN Client

[!INCLUDE [Download Azure VPN Client](../../includes/vpn-gateway-download-vpn-client.md)]

## <a name="generate"></a>Extract client profile configuration files

To configure your Azure VPN Client profile, you must first download the VPN client profile configuration package from the Azure P2S gateway. This package is specific to the configured VPN gateway and contains the necessary settings to configure the VPN client.

If you used the P2S server configuration steps as mentioned in the [Prerequisites](#prerequisites) section, you've already generated and downloaded the VPN client profile configuration package that contains the VPN profile configuration files. If you need to generate configuration files, see [Download the VPN client profile configuration package](point-to-site-entra-gateway.md#download).

After you obtain the VPN client profile configuration package, extract the zip file. The file contains the following folders:

* **AzureVPN**: The AzureVPN folder contains the **Azurevpnconfig.xml** file that is used to configure the Azure VPN Client.
* **Generic**: The generic folder contains the public server certificate and the VpnSettings.xml file. The VpnSettings.xml file contains information needed to configure a generic client.

## <a name="import"></a>Import client profile configuration settings

> [!NOTE]
> [!INCLUDE [Entra VPN client note](../../includes/vpn-gateway-entra-vpn-client-note.md)]

When your P2S configuration specifies Microsoft Entra ID authentication, the VPN client profile configuration settings are contained in the **azurevpnconfig.xml** file. This file is located in the **AzureVPN** folder of the VPN client profile configuration package.

1. On the page, select **Import**.

   :::image type="content" source="./media/point-to-site-entra-vpn-client-windows/import.png" alt-text="Screenshot that shows the Add button selected and the Import action highlighted in the lower left-side of the window." lightbox="./media/point-to-site-entra-vpn-client-windows/import.png":::

1. Browse to the Azure VPN Client profile configuration folder that you extracted. In the AzureVPN folder, select **azurevpnconfig.xml**. With the file selected, select **Open**.

1. Change the name of the Connection name (optional). In this example, you'll notice that the Audience value shown is the new Azure Public value associated to the Microsoft-registered Azure VPN Client App ID. The value in this field must match the value that your P2S VPN gateway is configured to use.

   :::image type="content" source="./media/point-to-site-entra-vpn-client-windows/connection-properties.png" alt-text="Screenshot shows Save the profile." lightbox="./media/point-to-site-entra-vpn-client-windows/connection-properties.png":::

1. Click **Save** to save the connection profile.

1. In the left pane, select the connection profile that you want to use. Then click **Connect** to initiate the connection.

   :::image type="content" source="./media/point-to-site-entra-vpn-client-windows/connect.png" alt-text="Screenshot that shows the VPN and Connect button selected." lightbox="./media/point-to-site-entra-vpn-client-windows/connect.png":::

1. Authenticate using your credentials, if prompted.

1. Once connected, the icon turns green and shows  **Connected**.

### <a name="autoconnect"></a>To connect automatically

These steps help you configure your connection to connect automatically with Always-on.

1. On the home page for your VPN client, select **VPN Settings**. If you see the switch apps dialogue box, select **Yes**.

   :::image type="content" source="./media/point-to-site-entra-vpn-client-windows/vpn-settings.png" alt-text="Screenshot of the VPN home page with VPN Settings selected." lightbox="./media/point-to-site-entra-vpn-client-windows/vpn-settings.png":::

1. If the connection you want to configure is connected, disconnect the connection, then highlight the profile and select the **Connect automatically** check box.

   :::image type="content" source="./media/point-to-site-entra-vpn-client-windows/automatic.png" alt-text="Screenshot of the Settings window, with the Connect automatically box checked." lightbox="./media/point-to-site-entra-vpn-client-windows/automatic.png":::

1. Select **Connect** to initiate the VPN connection.

## <a name="export"></a>Export and distribute a client profile

Once you have a working profile and need to distribute it to other users, you can export it using the following steps:

1. Highlight the VPN client profile that you want to export, select the **...**, then select **Export**.

   :::image type="content" source="./media/point-to-site-entra-vpn-client-windows/export.png" alt-text="Screenshot that shows the Azure VPN Client page, with the ellipsis selected and Export highlighted." lightbox="./media/point-to-site-entra-vpn-client-windows/export.png":::

1. Select the location that you want to save this profile to, leave the file name as is, then select **Save** to save the xml file.

## <a name="delete"></a>Delete a client profile

1. Select the ellipses next to the client profile that you want to delete. Then, select **Remove**.

   :::image type="content" source="./media/point-to-site-entra-vpn-client-windows/remove.png" alt-text="Screenshot that shows the ellipses and Remove option selected." lightbox="./media/point-to-site-entra-vpn-client-windows/remove.png":::

1. On the confirmation popup, select **Remove** to delete.

## <a name="diagnose"></a>Diagnose connection issues

1. To diagnose connection issues, you can use the **Diagnose** tool. Select the **...** next to the VPN connection that you want to diagnose to reveal the menu. Then select **Diagnose**. On the **Connection Properties** page, select **Run Diagnostics**.

   :::image type="content" source="./media/point-to-site-entra-vpn-client-windows/diagnose.png" alt-text="Screenshot of the ellipsis and Diagnose selected." lightbox="./media/point-to-site-entra-vpn-client-windows/diagnose.png":::

1. If asked, sign in with your credentials.

1. View the results.

## Optional client configuration settings

You can configure the Azure VPN Client with optional configuration settings such as additional DNS servers, custom DNS, forced tunneling, custom routes, and other settings. For more information, see [Azure VPN Client - optional settings](azure-vpn-client-optional-configurations.md).

## Azure VPN Client version information

For Azure VPN Client version information, see [Azure VPN Client versions](azure-vpn-client-versions.md).
  
## Next steps

[About point-to-site connections](point-to-site-about.md).