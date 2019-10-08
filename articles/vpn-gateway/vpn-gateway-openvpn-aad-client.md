---
title: 'Configure a VPN client for P2S VPN connections: AAD authentication| Microsoft Docs'
description: You can use P2S VPN to connect to your VNet using AAD authentication
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 09/23/2019
ms.author: cherylmc

---
# Configure a VPN client for P2S VPN connections: AAD authentication

This article helps you configure a VPN client to connect to a virtual network using Point-to-Site VPN and Azure Active Directory authentication. Before you can connect and authenticate using AAD, you must first configure your AAD tenant. For more information, see [Configure an AAD tenant](vpn-gateway-openvpn-aad-tenant.md).

## <a name="profile"></a>Working with client profiles

To connect, you need to configure a VPN client profile on every computer that wants to connect to the VNet. You can create a client profile on a computer, export it, and then import it to additional computers.

### <a name="cert"></a>To create a certificate-based client profile

When working with a certificate-based profile, make sure that the appropriate certificates are installed on the client computer. For more information about certificates, see [Install client certificates](point-to-site-how-to-vpn-client-install-azure-cert.md).

  ![cert](./media/vpn-gateway-openvpn-aad-client/create/create_cert1.jpg)

### <a name="radius"></a>To create a RADIUS client profile

  ![radius](./media/vpn-gateway-openvpn-aad-client/create/create_radius1.jpg)

### <a name="export"></a>To export and distribute a client profile

Once you have a working profile and need to distribute it to other users, you can export it using the following steps:

1. Hi-lite the VPN client profile that you want to export, click the **...**, then click **Export**.

    ![export](./media/vpn-gateway-openvpn-aad-client/export/export1.jpg)

2. Select the location that you want to save this profile to, leave the file name as is, then click **Save** to save the xml file.

    ![export](./media/vpn-gateway-openvpn-aad-client/export/export2.jpg)

### <a name="import"></a>To import a client profile

1. On the page, click **Import**.

    ![import](./media/vpn-gateway-openvpn-aad-client/import/import1.jpg)

2. Browse to the profile xml file and select it. With the file selected, click **Open**.

    ![import](./media/vpn-gateway-openvpn-aad-client/import/import2.jpg)

3. Specify the name of the profile and click **Save**.

    ![import](./media/vpn-gateway-openvpn-aad-client/import/import3.jpg)

4. Click **Connect** to connect to the VPN.

    ![import](./media/vpn-gateway-openvpn-aad-client/import/import4.jpg)

5. Once connected, the icon will turn green and say **Connected**.

    ![import](./media/vpn-gateway-openvpn-aad-client/import/import5.jpg)

### <a name="delete"></a>To delete a client profile

1. Select the ellipses next to the client profile that you want to delete. Then, click **Remove**.

    ![delete](./media/vpn-gateway-openvpn-aad-client/delete/delete1.jpg)

2. Click **Remove** to delete.

    ![delete](./media/vpn-gateway-openvpn-aad-client/delete/delete2.jpg)

## <a name="connection"></a>Create a connection

1. On the page, click **+**, then **+ Add**.

    ![connection](./media/vpn-gateway-openvpn-aad-client/create/create1.jpg)

2. Fill out the connection information. If you are unsure of the values, contact your administrator. After filling out the values, click **Save**.

    ![connection](./media/vpn-gateway-openvpn-aad-client/create/create2.jpg)

3. Click **Connect** to connect to the VPN.

    ![connection](./media/vpn-gateway-openvpn-aad-client/create/create3.jpg)

4. Select the proper credentials, then click **Continue**.

    ![connection](./media/vpn-gateway-openvpn-aad-client/create/create4.jpg)

5. Once successfully connected, the icon will turn green and say **Connected**.

    ![connection](./media/vpn-gateway-openvpn-aad-client/create/create5.jpg)

### <a name="autoconnect"></a>To connect automatically

These steps help you configure your connection to connect automatically with Always-on.

1. On the home page for your VPN client, click **VPN Settings**.

    ![auto](./media/vpn-gateway-openvpn-aad-client/auto/auto1.jpg)

2. Click **Yes** on the switch apps dialogue box.

    ![auto](./media/vpn-gateway-openvpn-aad-client/auto/auto2.jpg)

3. Make sure the connection that you want to set is not already connected, then hi-lite the profile and check the **Connect automatically** check box.

    ![auto](./media/vpn-gateway-openvpn-aad-client/auto/auto3.jpg)

4. Click **Connect** to initiate the VPN connection.

    ![auto](./media/vpn-gateway-openvpn-aad-client/auto/auto4.jpg)

## <a name="diagnose"></a>Diagnose connection issues

1. To diagnose connection issues, you can use the **Diagnose** tool. Click the **...** next to the VPN connection that you want to diagnose to reveal the menu. Then click **Diagnose**.

    ![diagnose](./media/vpn-gateway-openvpn-aad-client/diagnose/diagnose1.jpg)

2. On the **Connection Properties** page, click **Run Diagnosis**.

    ![diagnose](./media/vpn-gateway-openvpn-aad-client/diagnose/diagnose2.jpg)

3. Sign in with your credentials.

    ![diagnose](./media/vpn-gateway-openvpn-aad-client/diagnose/diagnose3.jpg)

4. View the diagnosis results.

    ![diagnose](./media/vpn-gateway-openvpn-aad-client/diagnose/diagnose4.jpg)
