---
title: 'Configure Azure VPN Client - Microsoft Entra authentication - Windows'
description: Learn how to configure the Azure VPN Client to connect to a VNet using VPN Gateway point-to-site VPN, OpenVPN protocol connections, and Microsoft Entra authentication from a Windows computer.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 11/22/2022
ms.author: cherylmc

---
# Configure the Azure VPN Client - Microsoft Entra authentication - Windows

This article helps you configure the Azure VPN Client on a Windows computer to connect to a virtual network using a VPN Gateway point-to-site (P2S) VPN and Microsoft Entra authentication. Before you can connect and authenticate using Microsoft Entra ID, you must first configure your Microsoft Entra tenant. For more information, see [Configure a Microsoft Entra tenant](openvpn-azure-ad-tenant.md). For more information about point-to-site, see [About point-to-site VPN](point-to-site-about.md). The Azure VPN Client supported with Windows FIPS mode with the [KB4577063](https://support.microsoft.com/help/4577063/windows-10-update-kb4577063) hotfix.

[!INCLUDE [OpenVPN note](../../includes/vpn-gateway-openvpn-auth-include.md)]

## <a name="workflow"></a>Workflow

After your Azure VPN Gateway P2S configuration is complete, your next steps are as follows:

1. Download and install the Azure VPN Client.
1. Generate the VPN client profile configuration package.
1. Import the client profile settings to the VPN client.
1. Create a connection.
1. Optional - export the profile settings from the client and import to other client computers.

## <a name="download"></a>Download the Azure VPN Client

[!INCLUDE [Download Azure VPN Client](../../includes/vpn-gateway-download-vpn-client.md)]

## <a name="generate"></a>Generate VPN client profile configuration files

1. To generate the VPN client profile configuration package, see [Working with P2S VPN client profile files](about-vpn-profile-download.md).
1. Download and extract the VPN client profile configuration files.

## <a name="import"></a>Import VPN client profile configuration files

For Microsoft Entra authentication configurations, the **azurevpnconfig.xml** is used. The file is located in the **AzureVPN** folder of the VPN client profile configuration package.

1. On the page, select **Import**.

    ![Screenshot that shows the "Add" button selected and the "Import" action highlighted in the lower left-side of the window.](./media/openvpn-azure-ad-client/import/import1.jpg)

1. Browse to the profile xml file and select it. With the file selected, select **Open**.

    ![Screenshot that shows a profile x m l file selected.](./media/openvpn-azure-ad-client/import/import2.jpg)

1. Specify the name of the profile and select **Save**.

    ![Save the profile.](./media/openvpn-azure-ad-client/import/import3.jpg)

1. Select **Connect** to connect to the VPN.

    ![Screenshot that shows the VPN and "Connect" button selected.](./media/openvpn-azure-ad-client/import/import4.jpg)

1. Once connected, the icon will turn green and say **Connected**.

    ![import](./media/openvpn-azure-ad-client/import/import5.jpg)

## <a name="connection"></a>Create a connection

1. On the page, select **+**, then **+ Add**.

    ![Screenshot that shows the "Add" button selected.](./media/openvpn-azure-ad-client/create/create1.jpg)

1. Fill out the connection information. If you're unsure of the values, contact your administrator. After filling out the values, select **Save**.

1. Select **Connect** to connect to the VPN.

1. Select the proper credentials, then select **Continue**.

1. Once successfully connected, the icon will turn green and say **Connected**.

### <a name="autoconnect"></a>To connect automatically

These steps help you configure your connection to connect automatically with Always-on.

1. On the home page for your VPN client, select **VPN Settings**.

    ![Screenshot of the VPN home page with "VPN Settings" selected.](./media/openvpn-azure-ad-client/auto/auto1.jpg)

1. Select **Yes** on the switch apps dialogue box.

    ![Screenshot of the "Did you mean to switch apps?" dialog with the "Yes" button selected.](./media/openvpn-azure-ad-client/auto/auto2.jpg)

1. Make sure the connection that you want to set isn't already connected, then highlight the profile and check the **Connect automatically** check box.

    ![Screenshot of the "Settings" window, with the "Connect automatically" box checked.](./media/openvpn-azure-ad-client/auto/auto3.jpg)

1. Select **Connect** to initiate the VPN connection.

    ![auto](./media/openvpn-azure-ad-client/auto/auto4.jpg)

## <a name="export"></a>Export and distribute a client profile

Once you have a working profile and need to distribute it to other users, you can export it using the following steps:

1. Highlight the VPN client profile that you want to export, select the **...**, then select **Export**.

    ![Screenshot that shows the "Azure VPN Client" page, with the ellipsis selected and "Export" highlighted.](./media/openvpn-azure-ad-client/export/export1.jpg)

1. Select the location that you want to save this profile to, leave the file name as is, then select **Save** to save the xml file.

    ![export](./media/openvpn-azure-ad-client/export/export2.jpg)

## <a name="delete"></a>Delete a client profile

1. Select the ellipses next to the client profile that you want to delete. Then, select **Remove**.

    ![Screenshot that shows the ellipses and "Remove" option selected.](./media/openvpn-azure-ad-client/delete/delete1.jpg)

1. Select **Remove** to delete.

    ![delete](./media/openvpn-azure-ad-client/delete/delete2.jpg)

## <a name="diagnose"></a>Diagnose connection issues

1. To diagnose connection issues, you can use the **Diagnose** tool. Select the **...** next to the VPN connection that you want to diagnose to reveal the menu. Then select **Diagnose**.

    ![Screenshot of the ellipsis and "Diagnose selected."](./media/openvpn-azure-ad-client/diagnose/diagnose1.jpg)

1. On the **Connection Properties** page, select **Run Diagnosis**.

    ![Screenshot that shows the "Connection Properties" page with "Run Diagnosis" selected.](./media/openvpn-azure-ad-client/diagnose/diagnose2.jpg)

1. Sign in with your credentials.

    ![Screenshot that shows the "Let's get you signed in" dialog with a "Work or school account" selected.](./media/openvpn-azure-ad-client/diagnose/diagnose3.jpg)

1. View the diagnosis results.

    ![diagnose](./media/openvpn-azure-ad-client/diagnose/diagnose4.jpg)

## Optional Azure VPN Client configuration settings

You can configure the Azure VPN Client with optional configuration settings such as additional DNS servers, custom DNS, forced tunneling, custom routes, and other additional settings. For a description of the available optional settings and configuration steps, see [Azure VPN Client optional settings](azure-vpn-client-optional-configurations.md).

## Azure VPN Client version information

For Azure VPN Client version information, see [Azure VPN Client versions](azure-vpn-client-versions.md).
  
## Next steps

For more information, see [Create a Microsoft Entra tenant for P2S Open VPN connections that use Microsoft Entra authentication](openvpn-azure-ad-tenant.md).
