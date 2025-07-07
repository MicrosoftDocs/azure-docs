---
author: cherylmc
ms.author: cherylmc
ms.date: 03/19/2025
ms.service: azure-virtual-wan
ms.topic: include

# this file is used for both virtual wan and vpn gateway. When modifying, make sure that your changes work for both environments.
---


1. Open the Azure VPN Client.

1. Select **+** on the bottom left of the page, then select **Import**.

1. Browse to the Azure VPN Client profile configuration folder that you extracted. Open the **AzureVPN** folder and select the client profile configuration file (azurevpnconfig_aad.xml or azurevpnconfig.xml). Select **Open** to import the file.

1. On the client profile page, notice that many of the settings are already specified. The preconfigured settings are contained in the VPN client profile package that you imported. Even though most of the settings are already specified, you need to configure settings specific to the client computer.

1. Change the name of the Connection name (optional). In this example, notice that the Audience value shown is the value that's associated to the Microsoft-registered Azure VPN Client App ID. The value in this field must match the value that your P2S VPN gateway is configured to use.

   :::image type="content" source="./media/vpn-gateway-vwan-azure-vpn-client-entra-windows/connection-properties.png" alt-text="Screenshot shows Save the profile." lightbox="./media/vpn-gateway-vwan-azure-vpn-client-entra-windows/connection-properties.png":::

1. Click **Save** to save the connection profile.

1. In the left pane, select the connection profile that you want to use. Then click **Connect** to initiate the connection.

1. Authenticate using your credentials, if prompted.

1. Once connected, the icon turns green and shows  **Connected**.
1. [!INCLUDE [Azure VPN Client system tray](vpn-gateway-vwan-azure-vpn-client-tray.md)]

### <a name="export"></a>Export and distribute a client profile

Once you have a working profile and need to distribute it to other users, you can export it using the following steps:

1. Highlight the VPN client profile that you want to export, select the **...**, then select **Export**.

   :::image type="content" source="./media/vpn-gateway-vwan-azure-vpn-client-entra-windows/export.png" alt-text="Screenshot that shows the Azure VPN Client page, with the ellipsis selected and Export highlighted." lightbox="./media/vpn-gateway-vwan-azure-vpn-client-entra-windows/export.png":::

1. Select the location that you want to save this profile to, leave the file name as is, then select **Save** to save the xml file.

### <a name="delete"></a>Delete a client profile

1. Highlight the VPN client profile that you want to export, select the **...**, then select **Remove**.

1. On the confirmation popup, select **Remove** to delete.