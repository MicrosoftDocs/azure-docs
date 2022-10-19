---
title: 'Configure Azure VPN Client - Azure AD authentication - Windows'
description: Learn how to configure the Azure VPN Client to connect to a VNet using VPN Gateway point-to-site VPN, OpenVPN protocol connections, and Azure AD authentication from a Windows computer.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 05/05/2022
ms.author: cherylmc

---
# Configure an Azure VPN Client - Azure AD authentication - Windows

This article helps you configure the Azure VPN Client on a Windows computer to connect to a virtual network using a VPN Gateway point-to-site VPN and Azure Active Directory authentication. Before you can connect and authenticate using Azure AD, you must first configure your Azure AD tenant. For more information, see [Configure an Azure AD tenant](openvpn-azure-ad-tenant.md). For more information about point-to-site, see [About point-to-site VPN](point-to-site-about.md).

[!INCLUDE [OpenVPN note](../../includes/vpn-gateway-openvpn-auth-include.md)]

## <a name="workflow"></a>Workflow

After your Azure VPN Gateway point-to-site configuration is complete, your next steps are as follows:

1. Download and install the Azure VPN Client.
1. Generate the VPN client profile configuration package.
1. Import the client profile settings to the VPN client.
1. Create a connection.
1. Optional - export the profile settings from the client and import to other client computers.


## <a name="download"></a>Download the Azure VPN Client

[!INCLUDE [Download Azure VPN Client](../../includes/vpn-gateway-download-vpn-client.md)]

## <a name="generate"></a>Generate the VPN client profile configuration package

To generate the VPN client profile configuration package, see [Working with P2S VPN client profile files](about-vpn-profile-download.md). After you generate the package, follow the steps to extract the profile configuration files.

## <a name="import"></a>Import the profile file

For Azure AD authentication configurations, the **azurevpnconfig.xml** is used. The file is located in the **AzureVPN** folder of the VPN client profile configuration package.

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

## FAQ

### Is the Azure VPN Client supported with Windows FIPS mode?

Yes, with the [KB4577063](https://support.microsoft.com/help/4577063/windows-10-update-kb4577063) hotfix.

### How do I add DNS suffixes to the VPN client?

You can modify the downloaded profile XML file and add the **\<dnssuffixes>\<dnssufix> \</dnssufix>\</dnssuffixes>** tags.

```
<azvpnprofile>
<clientconfig>

    <dnssuffixes>
          <dnssuffix>.mycorp.com</dnssuffix>
          <dnssuffix>.xyz.com</dnssuffix>
          <dnssuffix>.etc.net</dnssuffix>
    </dnssuffixes>
    
</clientconfig>
</azvpnprofile>
```

### How do I add custom DNS servers to the VPN client?

You can modify the downloaded profile XML file and add the **\<dnsservers>\<dnsserver> \</dnsserver>\</dnsservers>** tags.

```
<azvpnprofile>
<clientconfig>

	<dnsservers>
		<dnsserver>x.x.x.x</dnsserver>
        <dnsserver>y.y.y.y</dnsserver>
	</dnsservers>
    
</clientconfig>
</azvpnprofile>
```

> [!NOTE]
> The OpenVPN Azure AD client utilizes DNS Name Resolution Policy Table (NRPT) entries, which means DNS servers will not be listed under the output of `ipconfig /all`. To confirm your in-use DNS settings, please consult [Get-DnsClientNrptPolicy](/powershell/module/dnsclient/get-dnsclientnrptpolicy) in PowerShell.
>

### <a name="split"></a>Can I configure split tunneling for the VPN client?

Split tunneling is configured by default for the VPN client.

### <a name="forced-tunnel"></a>How do I direct all traffic to the VPN tunnel (forced tunneling)?

You can configure forced tunneling using two different methods; either by advertising custom routes, or by modifying the profile XML file.    

> [!NOTE]
> Internet connectivity is not provided through the VPN gateway. As a result, all traffic bound for the Internet is dropped.
>

* **Advertise custom routes:** You can advertise custom routes 0.0.0.0/1 and 128.0.0.0/1. For more information, see [Advertise custom routes for P2S VPN clients](vpn-gateway-p2s-advertise-custom-routes.md).

* **Profile XML:** You can modify the downloaded profile XML file to add the **\<includeroutes>\<route>\<destination>\<mask> \</destination>\</mask>\</route>\</includeroutes>** tags.


    ```
    <azvpnprofile>
    <clientconfig>
          
    	<includeroutes>
    		<route>
    			<destination>0.0.0.0</destination><mask>1</mask>
    		</route>
    		<route>
    			<destination>128.0.0.0</destination><mask>1</mask>
    		</route>
    	</includeroutes>
           
    </clientconfig>
    </azvpnprofile>
    ```


### How do I add custom routes to the VPN client?

You can modify the downloaded profile XML file and add the **\<includeroutes>\<route>\<destination>\<mask> \</destination>\</mask>\</route>\</includeroutes>** tags.

```
<azvpnprofile>
<clientconfig>

	<includeroutes>
		<route>
			<destination>x.x.x.x</destination><mask>24</mask>
		</route>
	</includeroutes>
    
</clientconfig>
</azvpnprofile>
```

### How do I block (exclude) routes from the VPN client?

You can modify the downloaded profile XML file and add the **\<excluderoutes>\<route>\<destination>\<mask> \</destination>\</mask>\</route>\</excluderoutes>** tags.

```
<azvpnprofile>
<clientconfig>

	<excluderoutes>
		<route>
			<destination>x.x.x.x</destination><mask>24</mask>
		</route>
	</excluderoutes>
    
</clientconfig>
</azvpnprofile>
```

### Can I import the profile from a command-line prompt?

You can import the profile from a command-line prompt by placing the downloaded **azurevpnconfig.xml** file in the **%userprofile%\AppData\Local\Packages\Microsoft.AzureVpn_8wekyb3d8bbwe\LocalState** folder and running the following command:

```
azurevpn -i azurevpnconfig.xml 
```
To force the import, use the **-f** switch.


## Next steps

For more information, see [Create an Azure AD tenant for P2S Open VPN connections that use Azure AD authentication](openvpn-azure-ad-tenant.md).
