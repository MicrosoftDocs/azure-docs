---
title: 'Azure VPN Client optional configuration steps: OpenVPN protocol'
titleSuffix: Azure Virtual WAN
description: Learn how to configure the Azure VPN Client optional configuration parameters for P2S OpenVPN connections.
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 08/24/2023
ms.author: cherylmc

---
# Configure Azure VPN Client optional settings - OpenVPN protocol

This article helps you configure optional settings for the Azure VPN Client.

* For information about installing the Azure VPN Client, see [Configure the Azure VPN client - Windows](openvpn-azure-ad-client.md).

* For information about how to download VPN client profile configuration file (xml file), see [Download a global or hub-based profile](global-hub-profile.md).

> [!NOTE]
> The Azure VPN Client is only supported for OpenVPN® protocol connections.
>

## <a name="xml"></a>Edit and import VPN client profile configuration files

The steps in this article require you to modify and import the Azure VPN Client profile configuration file. To work with VPN client profile configuration files (xml files), do the following:

1. Locate the profile configuration file and open it using the editor of your choice.
1. Modify the file as necessary, then save your changes.
1. Import the file to configure the Azure VPN client.

You can import the file using these methods:

* Import using the Azure VPN Client interface. Open the Azure VPN Client and click **+** and then **Import**. Locate the modified xml file, configure any additional settings in the Azure VPN Client interface (if necessary), then click **Save**.

* Import the profile from a command-line prompt. Add the downloaded **azurevpnconfig.xml** file to the **%userprofile%\AppData\Local\Packages\Microsoft.AzureVpn_8wekyb3d8bbwe\LocalState** folder, then run the following command. To force the import, use the **-f** switch.

   ```xml
   azurevpn -i azurevpnconfig.xml 
   ```

## DNS

### <a name="add-suffix"></a>Add DNS suffixes

Modify the downloaded profile xml file and add the **\<dnssuffixes>\<dnssufix> \</dnssufix>\</dnssuffixes>** tags.

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

### <a name="custom-dns"></a>Add custom DNS servers

Modify the downloaded profile xml file and add the **\<dnsservers>\<dnsserver> \</dnsserver>\</dnsservers>** tags.

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
> The OpenVPN Azure AD client utilizes DNS Name Resolution Policy Table (NRPT) entries, which means DNS servers will not be listed under the output of `ipconfig /all`. To confirm your in-use DNS settings, please consult [Get-DnsClientNrptPolicy](/powershell/module/dnsclient/get-dnsclientnrptpolicy) in PowerShell.
>

## Routing

### <a name="custom-routes"></a>Add custom routes

Modify the downloaded profile xml file and add the **\<includeroutes>\<route>\<destination>\<mask> \</destination>\</mask>\</route>\</includeroutes>** tags.

```xml
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

### <a name="forced-tunneling"></a>Direct all traffic to the VPN tunnel (forced tunneling)

You can include 0/0 if you're using the Azure VPN Client version 2.1900:39.0 or higher.

Modify the downloaded profile xml file and add the **\<includeroutes>\<route>\<destination>\<mask> \</destination>\</mask>\</route>\</includeroutes>** tags. Make sure to update the version number to **2**. For more information about forced tunneling, see [Configure forced tunneling](how-to-forced-tunnel.md).

```xml
<azvpnprofile>
<clientconfig>
  <includeroutes>
    <route>
      <destination>0.0.0.0</destination><mask>0</mask>
    </route>
  </includeroutes>
    </clientconfig>

<version>2</version>
</azvpnprofile>
```

### <a name="exclude-routes"></a>Block (exclude) routes

Modify the downloaded profile xml file and add the **\<excluderoutes>\<route>\<destination>\<mask> \</destination>\</mask>\</route>\</excluderoutes>** tags.

```xml
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

## Next steps

For more information, see [Create an Azure Active Directory tenant for P2S Open VPN connections that use Azure AD authentication](openvpn-azure-ad-tenant.md).
