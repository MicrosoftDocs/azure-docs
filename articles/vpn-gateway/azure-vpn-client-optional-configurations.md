---
title: 'Configure Azure VPN Client optional settings'
titleSuffix: Azure VPN Gateway
description: Learn how to configure optional configuration settings for the Azure VPN Client. Settings include DNS suffixes, custom DNS servers, custom routes, and VPN client forced tunneling.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 10/05/2023
ms.author: cherylmc

---
# Azure VPN Client - configure optional DNS and routing settings

This article helps you configure optional settings for the Azure VPN Client for VPN Gateway P2S connections. You can configure DNS suffixes, custom DNS servers, custom routes, and VPN client-side forced tunneling.

> [!NOTE]
> The Azure VPN Client is only supported for OpenVPN® protocol connections.
>

## Before you begin

If you haven't already done so, make sure you complete the following items:

* Generate and download the VPN client profile configuration files for your P2S deployment. Use the following steps:

  1. In the Azure portal, go to the virtual network gateway.
  1. Click **Point-to-Site configuration**.
  1. Click **Download VPN client**.
  1. Select the client and fill out any information that is requested.
  1. Click **Download** to generate the .zip file.
  1. The .zip file will download, typically to your Downloads folder.

* Download and install the Azure VPN Client. For steps, see one of the following articles:

  * [Certificate authentication](point-to-site-vpn-client-cert-windows.md#download-the-azure-vpn-client)
  * [Microsoft Entra authentication](openvpn-azure-ad-client.md#download)

## Working with VPN client profile configuration files

The steps in this article require you to modify and import the Azure VPN Client profile configuration file. To work with VPN client profile configuration files (xml files), do the following:

1. Locate the profile configuration file and open it using the editor of your choice.
1. Using the examples in the sections below, modify the file as necessary, then save your changes.
1. Import the file to configure the Azure VPN client. You can import the file for the Azure VPN Client using these methods:

   * **Azure VPN Client interface**: Open the Azure VPN Client and click **+** and then **Import**. Locate the modified xml file, configure any additional settings in the Azure VPN Client interface (if necessary), then click **Save**.

   * **Command-line prompt**: Place the downloaded *azurevpnconfig.xml* file in the *%userprofile%\AppData\Local\Packages\Microsoft.AzureVpn_8wekyb3d8bbwe\LocalState* folder, then run the following command: `azurevpn -i azurevpnconfig.xml`. To force the import, use the **-f** switch.

## DNS

### Add DNS suffixes

To add DNS suffixes, modify the downloaded profile XML file and add the **\<dnssuffixes>\<dnssufix> \</dnssufix>\</dnssuffixes>** tags.

```xml
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

### Add custom DNS servers

To add custom DNS servers, modify the downloaded profile XML file and add the **\<dnsservers>\<dnsserver> \</dnsserver>\</dnsservers>** tags.

```xml
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
> The OpenVPN Microsoft Entra client utilizes DNS Name Resolution Policy Table (NRPT) entries, which means DNS servers will not be listed under the output of `ipconfig /all`. To confirm your in-use DNS settings, please consult [Get-DnsClientNrptPolicy](/powershell/module/dnsclient/get-dnsclientnrptpolicy) in PowerShell.
>

## Routing

### Split tunneling

Split tunneling is configured by default for the VPN client.

### Forced tunneling

You can configure forced tunneling in order to direct all traffic to the VPN tunnel. Forced tunneling can be configured using two different methods; either by advertising custom routes, or by modifying the profile XML file. You can include 0/0 if you're using the Azure VPN Client version 2.1900:39.0 or higher.

> [!NOTE]
> Internet connectivity is not provided through the VPN gateway. As a result, all traffic bound for the Internet is dropped.
>

* **Advertise custom routes:** You can advertise custom routes `0.0.0.0/1` and `128.0.0.0/1`. For more information, see [Advertise custom routes for P2S VPN clients](vpn-gateway-p2s-advertise-custom-routes.md).

* **Profile XML:** You can modify the downloaded profile xml file and add the **\<includeroutes>\<route>\<destination>\<mask> \</destination>\</mask>\</route>\</includeroutes>** tags. Make sure to update the version number to **2**.

   ```xml
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

> [!NOTE]
> * The default status for the clientconfig tag is `<clientconfig i:nil="true" />`, which can be modified based on the requirement.
> * A duplicate clientconfig tag is not supported on macOS, so make sure the clientconfig tag is not duplicated in the XML file.

### Add custom routes

You can add custom routes. Modify the downloaded profile XML file and add the **\<includeroutes>\<route>\<destination>\<mask> \</destination>\</mask>\</route>\</includeroutes>** tags.

```xml
<azvpnprofile>
<clientconfig>

    <includeroutes>
        <route>
            <destination>x.x.x.x</destination><mask>24</mask>
        </route>
        <route>
                <destination>y.y.y.y</destination><mask>24</mask>
            </route>
    </includeroutes>

</clientconfig>
</azvpnprofile>
```

### Block (exclude) routes

The ability to completely block routes isn't supported by the Azure VPN Client. The Azure VPN Client doesn't support dropping routes from the local routing table. Instead, you can exclude routes from the VPN interface. Modify the downloaded profile XML file and add the **\<excluderoutes>\<route>\<destination>\<mask> \</destination>\</mask>\</route>\</excluderoutes>** tags.

```xml
<azvpnprofile>
<clientconfig>

    <excluderoutes>
        <route>
            <destination>x.x.x.x</destination><mask>24</mask>
        </route>
        <route>
            <destination>y.y.y.y</destination><mask>24</mask>
        </route>
    </excluderoutes>

</clientconfig>
</azvpnprofile>
```

> [!NOTE]
> * To include/exclude multiple destination routes, put each destination address under a separate route tag _(as shown in the above examples)_, because multiple destination addresses in a single route tag won't work.
> * If you encounter the error "_Destination cannot be empty or have more than one entry inside route tag_", check the profile XML file and ensure that the includeroutes/excluderoutes section has only one destination address inside a route tag.
>

## Azure VPN Client version information

For Azure VPN Client version information, see [Azure VPN Client versions](azure-vpn-client-versions.md).

## Next steps

For more information about P2S VPN, see the following articles:

* [About point-to-site VPN](point-to-site-about.md)
* [About point-to-site VPN routing](vpn-gateway-about-point-to-site-routing.md)
