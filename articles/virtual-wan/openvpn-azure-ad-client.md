---
title: 'VPN client for OpenVPN protocol P2S connections: Microsoft Entra authentication'
titleSuffix: Azure Virtual WAN
description: Learn how to use P2S VPN to connect to your VNet using Microsoft Entra authentication.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 07/28/2023
ms.author: cherylmc

---
# Configure a VPN client for P2S OpenVPN protocol connections: Microsoft Entra authentication

This article helps you configure a VPN client to connect using point-to-site VPN and Microsoft Entra authentication. Before you can connect and authenticate using Microsoft Entra ID, you must first configure your Microsoft Entra tenant. For more information, see [Configure a Microsoft Entra tenant](openvpn-azure-ad-tenant.md).

> [!NOTE]
> Microsoft Entra authentication is supported only for OpenVPN® protocol connections.
>

## <a name="profile"></a>Working with client profiles

For every computer that wants to connect to the VNet via the VPN client, you need to download the Azure VPN Client for the computer, and also configure a VPN client profile. If you want to configure multiple computers, you can create a client profile on one computer, export it, and then import it to other computers.

### To download the Azure VPN client

[!INCLUDE [Download Azure VPN client](../../includes/vpn-gateway-download-vpn-client.md)]

### <a name="cert"></a>To create a certificate-based client profile

When working with a certificate-based profile, make sure that the appropriate certificates are installed on the client computer. You can install and specify more than one certificate when using the Azure VPN client version 2.1963.44.0 or higher. For more information about certificates, see [Install client certificates](certificates-point-to-site.md).

![Screenshot showing certificates certificate authentication.](./media/openvpn-azure-ad-client/create/create-cert1.jpg)

### <a name="radius"></a>To create a RADIUS client profile

![Screenshot shows RADIUS connection client information.](./media/openvpn-azure-ad-client/create/create-radius1.jpg)
  
> [!NOTE]
> The Server Secret can be exported in the P2S VPN client profile. To export a client profile, see [User VPN client profiles](about-vpn-profile-download.md).
>

### <a name="export"></a>To export and distribute a client profile

Once you have a working profile and need to distribute it to other users, you can export it using the following steps:

1. Highlight the VPN client profile that you want to export, select the **...**, then select **Export**.

    ![Screenshot shows Export selected from the menu.](./media/openvpn-azure-ad-client/export/export1.jpg)

2. Select the location that you want to save this profile to, leave the file name as is, then select **Save** to save the xml file.

    ![Screenshot shows a Save As dialog box where you can enter a file name.](./media/openvpn-azure-ad-client/export/export2.jpg)

### <a name="import"></a>To import a client profile

1. On the page, select **Import**.

    ![Screenshot shows Import selected from the plus menu.](./media/openvpn-azure-ad-client/import/import1.jpg)

2. Browse to the profile xml file and select it. With the file selected, select **Open**.

    ![Screenshot shows an Open dialog box where you can select a file.](./media/openvpn-azure-ad-client/import/import2.jpg)

3. Specify the name of the profile and select **Save**.

    ![Screenshot shows the Connection Name added and the Save button selected.](./media/openvpn-azure-ad-client/import/import3.jpg)

4. Select **Connect** to connect to the VPN.

    ![Screenshot shows the Connect button for the for the connection you just created.](./media/openvpn-azure-ad-client/import/import4.jpg)

5. Once connected, the icon will turn green and say **Connected**.

    ![Screenshot shows the connection in a Connected status with the option to disconnect.](./media/openvpn-azure-ad-client/import/import5.jpg)

### <a name="delete"></a>To delete a client profile

1. Select the ellipses next to the client profile that you want to delete. Then, select **Remove**.

    ![Screenshot shows Remove selected from the menu.](./media/openvpn-azure-ad-client/delete/delete1.jpg)

2. Select **Remove** to delete.

    ![Screenshot shows a confirmation dialog box with the option to Remove or Cancel.](./media/openvpn-azure-ad-client/delete/delete2.jpg)

## <a name="connection"></a>Create a connection

1. On the page, select **+**, then **+ Add**.

    ![Screenshot shows Add selected from the plus menu.](./media/openvpn-azure-ad-client/create/create1.jpg)

2. Fill out the connection information. If you are unsure of the values, contact your administrator. After filling out the values, select **Save**.

    ![Screenshot shows pane where you can enter the required values.](./media/openvpn-azure-ad-client/create/create2.jpg)

3. Select **Connect** to connect to the VPN.

    ![Screenshot shows the Connect button for your connection.](./media/openvpn-azure-ad-client/create/create3.jpg)

4. Select the proper credentials, then select **Continue**.

    ![Screenshot shows the Sign in dialog box.](./media/openvpn-azure-ad-client/create/create4.jpg)

5. Once successfully connected, the icon will turn green and say **Connected**.

    ![Screenshot shows the connection in a Connected status.](./media/openvpn-azure-ad-client/create/create5.jpg)

### <a name="autoconnect"></a>To connect automatically

These steps help you configure your connection to connect automatically with Always-on.

1. On the home page for your VPN client, select **VPN Settings**.

    ![Screenshot shows V P N Connections where you can select V P N Settings.](./media/openvpn-azure-ad-client/auto/auto1.jpg)

2. Select **Yes** on the switch apps dialogue box.

    ![Screenshot shows a verification message about switching apps.](./media/openvpn-azure-ad-client/auto/auto2.jpg)

3. Make sure the connection that you want to set is not already connected, then highlight the profile and check the **Connect automatically** check box.

    ![Screenshot shows a Settings dialog box where you can select Connect automatically.](./media/openvpn-azure-ad-client/auto/auto3.jpg)

4. Select **Connect** to initiate the VPN connection.

    ![Screenshot shows the Connect button.](./media/openvpn-azure-ad-client/auto/auto4.jpg)

## <a name="diagnose"></a>Diagnose connection issues

1. To diagnose connection issues, you can use the **Diagnose** tool. Select the **...** next to the VPN connection that you want to diagnose to reveal the menu. Then select **Diagnose**.

    ![Screenshot shows Diagnose selected from the menu.](./media/openvpn-azure-ad-client/diagnose/diagnose1.jpg)

2. On the **Connection Properties** page, select **Run Diagnosis**.

    ![Screenshot shows the Run Diagnosis button for a connection.](./media/openvpn-azure-ad-client/diagnose/diagnose2.jpg)

3. Sign in with your credentials.

    ![Screenshot shows the Sign in dialog box for this action.](./media/openvpn-azure-ad-client/diagnose/diagnose3.jpg)

4. View the diagnosis results.

    ![Screenshot shows the results of the diagnosis.](./media/openvpn-azure-ad-client/diagnose/diagnose4.jpg)

## Optional client settings

You can configure optional settings for the Azure VPN Client, such as forced tunneling, exclude routes, DNS, and certificate authentication settings. For steps, see [Configure Azure VPN Client optional settings](azure-vpn-client-optional-configurations-windows.md).

## Next steps

For more information, see [Create a Microsoft Entra tenant for P2S Open VPN connections that use Microsoft Entra authentication](openvpn-azure-ad-tenant.md).
