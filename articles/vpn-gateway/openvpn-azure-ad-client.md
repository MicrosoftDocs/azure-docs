---
title: 'Configure VPN clients for P2S OpenVPN protocol connections: Azure AD authentication'
description: Learn how to configure a VPN client to connect to a virtual network using VPN Gateway Point-to-Site VPN and Azure Active Directory authentication.
titleSuffix: Azure VPN Gateway
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 04/28/2021
ms.author: alzam

---
# Azure Active Directory authentication: Configure a VPN client for P2S OpenVPN protocol connections

This article helps you configure a VPN client to connect to a virtual network using Point-to-Site VPN and Azure Active Directory authentication. Before you can connect and authenticate using Azure AD, you must first configure your Azure AD tenant. For more information, see [Configure an Azure AD tenant](openvpn-azure-ad-tenant.md). For more information about Point-to-Site, see [About Point-to-Site VPN](point-to-site-about.md).

[!INCLUDE [OpenVPN note](../../includes/vpn-gateway-openvpn-auth-include.md)]

## <a name="profile"></a>Working with client profiles

For every computer that wants to connect to the VNet via the VPN client, you need to download the Azure VPN Client for the computer, and also configure a VPN client profile. If you want to configure multiple computers, you can create a client profile on one computer, export it, and then import it to other computers.

### To download the Azure VPN client

1. Download the [Azure VPN Client](https://go.microsoft.com/fwlink/?linkid=2117554) to the computer.
1. Verify that the Azure VPN Client has permission to run in the background. To check and enable permissions, navigate to **Start -> Settings -> Privacy -> Background Apps**.

   * Under **Background Apps**, make sure **Let apps run in the background** is turned **On**.
   * Under **Choose which apps can run in the background**, turn settings for **Azure VPN Client** to **On**.

     ![Screenshot of permissions.](./media/openvpn-azure-ad-client/backgroundpermission.png)

### <a name="cert"></a>To create a certificate-based client profile

When working with a certificate-based profile, make sure that the appropriate certificates are installed on the client computer. For more information about certificates, see [Install client certificates](point-to-site-how-to-vpn-client-install-azure-cert.md).

![Screenshot of certificate authentication.](./media/openvpn-azure-ad-client/create/create-cert1.jpg)

### <a name="radius"></a>To create a RADIUS client profile

![Screenshot of RADIUS authentication.](./media/openvpn-azure-ad-client/create/create-radius1.jpg)
  
> [!NOTE]
> The Server Secret can be exported in the P2S VPN client profile.  Instructions on how to export a client profile can be found [here](about-vpn-profile-download.md).
>

### <a name="export"></a>To export and distribute a client profile

Once you have a working profile and need to distribute it to other users, you can export it using the following steps:

1. Highlight the VPN client profile that you want to export, select the **...**, then select **Export**.

    ![Screenshot that shows the "Azure VPN Client" page, with the ellipsis selected and "Export" highlighted.](./media/openvpn-azure-ad-client/export/export1.jpg)

2. Select the location that you want to save this profile to, leave the file name as is, then select **Save** to save the xml file.

    ![export](./media/openvpn-azure-ad-client/export/export2.jpg)

### <a name="import"></a>To import a client profile

1. On the page, select **Import**.

    ![Screenshot that shows the "Add" button selected and the "Import" action highlighted in the lower left-side of the window.](./media/openvpn-azure-ad-client/import/import1.jpg)

2. Browse to the profile xml file and select it. With the file selected, select **Open**.

    ![Screenshot that shows a profile x m l file selected.](./media/openvpn-azure-ad-client/import/import2.jpg)

3. Specify the name of the profile and select **Save**.

    ![Screenshot that shows the "Connection Name" highlighted and the "Save" button selected.](./media/openvpn-azure-ad-client/import/import3.jpg)

4. Select **Connect** to connect to the VPN.

    ![Screenshot that shows the VPN and "Connect" button selected.](./media/openvpn-azure-ad-client/import/import4.jpg)

5. Once connected, the icon will turn green and say **Connected**.

    ![import](./media/openvpn-azure-ad-client/import/import5.jpg)

### <a name="delete"></a>To delete a client profile

1. Select the ellipses next to the client profile that you want to delete. Then, select **Remove**.

    ![Screenshot that shows the ellipses and "Remove" option selected.](./media/openvpn-azure-ad-client/delete/delete1.jpg)

2. Select **Remove** to delete.

    ![delete](./media/openvpn-azure-ad-client/delete/delete2.jpg)

## <a name="connection"></a>Create a connection

1. On the page, select **+**, then **+ Add**.

    ![Screenshot that shows the "Add" button selected.](./media/openvpn-azure-ad-client/create/create1.jpg)

2. Fill out the connection information. If you are unsure of the values, contact your administrator. After filling out the values, select **Save**.

    ![Screenshot that shows the VPN connection properties highlighted and the "Save" button selected.](./media/openvpn-azure-ad-client/create/create2.jpg)

3. Select **Connect** to connect to the VPN.

    ![Screenshot that shows the "Connect" button selected.](./media/openvpn-azure-ad-client/create/create3.jpg)

4. Select the proper credentials, then select **Continue**.

    ![Screenshot that shows example credentials highlighted and the "Continue" button selected.](./media/openvpn-azure-ad-client/create/create4.jpg)

5. Once successfully connected, the icon will turn green and say **Connected**.

    ![connection](./media/openvpn-azure-ad-client/create/create5.jpg)

### <a name="autoconnect"></a>To connect automatically

These steps help you configure your connection to connect automatically with Always-on.

1. On the home page for your VPN client, select **VPN Settings**.

    ![Screenshot of the VPN home page with "VPN Settings" selected.](./media/openvpn-azure-ad-client/auto/auto1.jpg)

2. Select **Yes** on the switch apps dialogue box.

    ![Screenshot of the "Did you mean to switch apps?" dialog with the "Yes" button selected.](./media/openvpn-azure-ad-client/auto/auto2.jpg)

3. Make sure the connection that you want to set is not already connected, then highlight the profile and check the **Connect automatically** check box.

    ![Screenshot of the "Settings" window, with the "Connect automatically" box checked.](./media/openvpn-azure-ad-client/auto/auto3.jpg)

4. Select **Connect** to initiate the VPN connection.

    ![auto](./media/openvpn-azure-ad-client/auto/auto4.jpg)

## <a name="diagnose"></a>Diagnose connection issues

1. To diagnose connection issues, you can use the **Diagnose** tool. Select the **...** next to the VPN connection that you want to diagnose to reveal the menu. Then select **Diagnose**.

    ![Screenshot of the ellipsis and "Diagnose selected."](./media/openvpn-azure-ad-client/diagnose/diagnose1.jpg)

2. On the **Connection Properties** page, select **Run Diagnosis**.

    ![Screenshot that shows the "Connection Properties" page with "Run Diagnosis" selected.](./media/openvpn-azure-ad-client/diagnose/diagnose2.jpg)

3. Sign in with your credentials.

    ![Screenshot that shows the "Let's get you signed in" dialog with a "Work or school account" selected.](./media/openvpn-azure-ad-client/diagnose/diagnose3.jpg)

4. View the diagnosis results.

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

For more information, see [Create an Azure Active Directory tenant for P2S Open VPN connections that use Azure AD authentication](openvpn-azure-ad-tenant.md).