---
title: 'Install Azure Firewall in a Virtual WAN hub'
titleSuffix: Azure Virtual WAN
description: Learn to configured forced tunneling for P2S VPN in Virtual WAN.
services: virtual-wan
author: wellee

ms.service: virtual-wan
ms.topic: how-to
ms.date: 10/4/2021
ms.author: wellee

---
# Configure forced tunneling for Virtual WAN Point-to-site VPN

Forced tunneling allows you to to force **all** traffic originating from your Point-to-site VPN remote users to be sent from your remote user devices to Azure for inspection. In Virtual WAN, forced tunneling for Point-to-site VPN remote users signifies that the 0.0.0.0/0 default route is advertised to remote VPN users.


## Creating a Virtual WAN hub

The steps in this article assume that you have already deployed a virtual WAN with one or more hubs.

To create a new virtual WAN and a new hub, use the steps in the following articles:

* [Create a Virtual WAN](virtual-wan-site-to-site-portal.md#openvwan)
* [Create a Virtual Hub](virtual-wan-site-to-site-portal.md#hub)

## Setting up  Point-to-site VPN

The steps in this article also assume that you already deployed a Point-to-site VPN Gateway in the Virtual WAN hub and have created Point-to-site VPN profiles to assign to the Gateway.

To create the Point-to-site VPN Gateway and related profiles, use the steps in the following articles

* [Create a Point-to-site VPN Gateway](virtual-wan-point-to-site-portal.md)

## Advertising default route to clients

There are a couple ways to configure forced-tunneling and advertise the default route (0.0.0.0/0) to your remote user VPN clients .

* You can specify a 0.0.0.0/0 route in the defaultRouteTable with next hop Virtual Network Connection. This will force all internet-bound traffic to be sent to a Network Virtual Appliance deployed in a spoke Virtual Network. For more detailed instructions, please consider the alternate workflow described in this [document](scenario-route-through-nvas-custom.md).
* You can use Firewall Manager to configure Virtual WAN to send all internet-bound traffic via Azure Firewall deployed in the Virtual WAN hub. For configuration steps and a tutorial, please reference following [document](/firewall-manager/secure-cloud-network.md). Alternatively, this can also be configured via Routing Policies and Routing Intent. For more information on Routing policies please read the following [document](how-to-routing-policies.md).
* You can use Firewall Manager to send internet traffic via a third-party security provider. For more information on this capability, please read the following [document](../firewall-manager/deploy-trusted-security-partner.md).
* You can configure one of your branches (Site-to-site VPN, ExpressRoute Circuit or Network Virtual Appliance in the Virtual WAN Hub) to advertise the 0.0.0.0/0 route to Virtual WAN.

## Downloading the Point-to-site VPN Profile

To download the Point-to-site VPN profile, please reference the instructions in the following [document](global-hub-profile.md). The information in the zip file downloaded from Azure Portal is critical to properly configuring your clients. 

## Configuring forced-tunneling for OpenVPN clients

OpenVPN based authentication with the Azure VPN client on Windows and MacOS clients will automatically configure forced tunneling on the client device. For instructions on how to use the Azure VPN client to connect to the Virtual WAN Point-to-site VPN Gateway, please reference the following documents:

* [Windows Configuration Guide](openvpn-azure-ad-client.md)
* [MacOS Configuration Guide](openvpn-azure-ad-client-mac.md)

## Configuring forced-tunneling for Ikev2 clients

For Ikev2 clients, you will **not** be able to directly use the executable profiles you downloaded from Azure Portal. To properly configure the client you will need to run a Powershell script or distribute the VPN profile via Intune. Based on the authentication method you have configured on your Point-to-site VPN Gateway, you will have to use a different EAP Configuration file. Samples for the EAP Configuration files are provided in the relevant section.

Additionally, for a full list of available options for client-side EAP Configuration files, please view the following [document](https://docs.microsoft.com/windows/client-management/mdm/eap-configuration).

The source code for the scripts and sample EAP XML files referenced in this document can be found in the following [GitHub repository](www,google.com).

### Ikev2  with user certificate authentication

If you chose Azure Certificate as your authentication method and the certificate is stored in the User Certificate Store in the client device, use the following script to configure forced tunneling.

The sample powershell script is below: 

   ```azurepowershell-interactive
   # specify the name of the VPN Connection to be installed on the client
$vpnConnectionName = "SampleConnectionName"

# get the VPN Server FQDN from the profile downloaded from Azure Portal
$downloadedXML = [xml] (Get-Content VpnSettings.xml)
$vpnserverFQDN.VpnProfile.VpnServer

# use the appropriate EAP XML file based on the authentication method specified on the Point-to-site VPN Gateway
$EAPXML = [xml] (Get-Content EapXML.xml)

# create the VPN Connection
Add-VpnConnection -Name $vpnConnectionName -ServerAddress $vpnserverFQDN -TunnelType Ikev2 -AuthenticationMethod Eap -EapConfigXmlStream $EAPXML

# enabled forced tunneling
Set-VpnConnection -Name $vpnConnectionName -SplitTunneling $false 
   ```

An example EAP XML file is the following. Please replace the *IssuerHash* field with the Thumbprint of the Root Certificate to ensure your client device selects the correct certificate to present for authentication. 

```xml
<EapHostConfig xmlns="http://www.microsoft.com/provisioning/EapHostConfig">
    <EapMethod>
        <Type xmlns="http://www.microsoft.com/provisioning/EapCommon">13</Type>
        <VendorId xmlns="http://www.microsoft.com/provisioning/EapCommon">0</VendorId>
        <VendorType xmlns="http://www.microsoft.com/provisioning/EapCommon">0</VendorType>
        <AuthorId xmlns="http://www.microsoft.com/provisioning/EapCommon">0</AuthorId>
    </EapMethod>
    <Config xmlns="http://www.microsoft.com/provisioning/EapHostConfig">
        <Eap xmlns="http://www.microsoft.com/provisioning/BaseEapConnectionPropertiesV1">
            <Type>13</Type>
            <EapType xmlns="http://www.microsoft.com/provisioning/EapTlsConnectionPropertiesV1">
                <CredentialsSource>
                    <CertificateStore>
                        <SimpleCertSelection>true</SimpleCertSelection>
                    </CertificateStore>
                </CredentialsSource>
                <ServerValidation>
                    <DisableUserPromptForServerValidation>false</DisableUserPromptForServerValidation>
                    <ServerNames></ServerNames>
                </ServerValidation>
                <DifferentUsername>false</DifferentUsername>
                <PerformServerValidation xmlns="http://www.microsoft.com/provisioning/EapTlsConnectionPropertiesV2">false</PerformServerValidation>
                <AcceptServerName xmlns="http://www.microsoft.com/provisioning/EapTlsConnectionPropertiesV2">false</AcceptServerName>
                <TLSExtensions xmlns="http://www.microsoft.com/provisioning/EapTlsConnectionPropertiesV2">
                    <FilteringInfo xmlns="http://www.microsoft.com/provisioning/EapTlsConnectionPropertiesV3">
                        <CAHashList Enabled="true">
                            <IssuerHash> REPLACE THIS WITH ROOT CERTIFICATE THUMBPRINT </IssuerHash>
                        </CAHashList>
                    </FilteringInfo>
                </TLSExtensions>
            </EapType>
        </Eap>
    </Config>
</EapHostConfig>
```
### Ikev2  with machine certificate authentication

If you choose to use a machine certificate as your authentication method, please use the following script.

   ```azurepowershell-interactive
   # specify the name of the VPN Connection to be installed on the client
$vpnConnectionName = "UserCertVPNConnection"

# get the VPN Server FQDN from the profile downloaded from Azure Portal
$downloadedXML = [xml] (Get-Content VpnSettings.xml)

# create the VPN Connection
Add-VpnConnection -Name $vpnConnectionName -ServerAddress $vpnserverFQDN -TunnelType Ikev2 -AuthenticationMethod MachineCertificate 

# enabled forced tunneling
Set-VpnConnection -Name $vpnConnectionName -SplitTunneling $false 
   ```

### Ikev2 with RADIUS server authentication with username and password (EAP-MSCHAPv2)

If you choose to use RADIUS server as your authentication method and users provide a username and password for authentication (EAP-MASCHAPv2), please use the following script.

   ```azurepowershell-interactive
   # specify the name of the VPN Connection to be installed on the client
$vpnConnectionName = "SampleConnectionName"

# get the VPN Server FQDN from the profile downloaded from Azure Portal
$downloadedXML = [xml] (Get-Content VpnSettings.xml)
$vpnserverFQDN.VpnProfile.VpnServer

# use the appropriate EAP XML file based on the authentication method specified on the Point-to-site VPN Gateway
$EAPXML = [xml] (Get-Content EapXML.xml)

# create the VPN Connection
Add-VpnConnection -Name $vpnConnectionName -ServerAddress $vpnserverFQDN -TunnelType Ikev2 -AuthenticationMethod Eap -EapConfigXmlStream $EAPXML

# enabled forced tunneling
Set-VpnConnection -Name $vpnConnectionName -SplitTunneling $false 
   ```

An example EAP XML file is the following.  

```xml
<EapHostConfig xmlns="http://www.microsoft.com/provisioning/EapHostConfig">
    <EapMethod>
        <Type xmlns="http://www.microsoft.com/provisioning/EapCommon">26</Type>
        <VendorId xmlns="http://www.microsoft.com/provisioning/EapCommon">0</VendorId>
        <VendorType xmlns="http://www.microsoft.com/provisioning/EapCommon">0</VendorType>
        <AuthorId xmlns="http://www.microsoft.com/provisioning/EapCommon">0</AuthorId>
    </EapMethod>
    <Config xmlns="http://www.microsoft.com/provisioning/EapHostConfig">
        <Eap xmlns="http://www.microsoft.com/provisioning/BaseEapConnectionPropertiesV1">
            <Type>26</Type>
            <EapType xmlns="http://www.microsoft.com/provisioning/MsChapV2ConnectionPropertiesV1">
                <UseWinLogonCredentials>false</UseWinLogonCredentials>
            </EapType>
        </Eap>
    </Config>
</EapHostConfig>
```
 
### Ikev2 with RADIUS server authentication with user certificates (EAP-TLS)

If you choose to use RADIUS server as your authentication method and users present a certificate for authentication, please use the following script.

   ```azurepowershell-interactive
   # specify the name of the VPN Connection to be installed on the client
$vpnConnectionName = "SampleConnectionName"

# get the VPN Server FQDN from the profile downloaded from Azure Portal
$downloadedXML = [xml] (Get-Content VpnSettings.xml)
$vpnserverFQDN.VpnProfile.VpnServer

# use the appropriate EAP XML file based on the authentication method specified on the Point-to-site VPN Gateway
$EAPXML = [xml] (Get-Content EapXML.xml)

# create the VPN Connection
Add-VpnConnection -Name $vpnConnectionName -ServerAddress $vpnserverFQDN -TunnelType Ikev2 -AuthenticationMethod Eap -EapConfigXmlStream $EAPXML

# enabled forced tunneling
Set-VpnConnection -Name $vpnConnectionName -SplitTunneling $false 
   ```

Below is a sample EAP XML file. Please change the *TrustedRootCA* field to the thumbprint of your Certificate Authority's certificate and the *IssuerHash* to be the thumbprint of the Root Certificate.
```xml
<EapHostConfig xmlns="http://www.microsoft.com/provisioning/EapHostConfig">
    <EapMethod>
        <Type xmlns="http://www.microsoft.com/provisioning/EapCommon">13</Type>
        <VendorId xmlns="http://www.microsoft.com/provisioning/EapCommon">0</VendorId>
        <VendorType xmlns="http://www.microsoft.com/provisioning/EapCommon">0</VendorType>
        <AuthorId xmlns="http://www.microsoft.com/provisioning/EapCommon">0</AuthorId>
    </EapMethod>
    <Config xmlns="http://www.microsoft.com/provisioning/EapHostConfig">
        <Eap xmlns="http://www.microsoft.com/provisioning/BaseEapConnectionPropertiesV1">
            <Type>13</Type>
            <EapType xmlns="http://www.microsoft.com/provisioning/EapTlsConnectionPropertiesV1">
                <CredentialsSource>
                    <CertificateStore>
                        <SimpleCertSelection>false</SimpleCertSelection>
                    </CertificateStore>
                </CredentialsSource>
                <ServerValidation>
                    <DisableUserPromptForServerValidation>false</DisableUserPromptForServerValidation>
                    <ServerNames></ServerNames>
                    <TrustedRootCA> CERTIFICATE AUTHORITY THUMBPRINT </TrustedRootCA>
                </ServerValidation>
                <DifferentUsername>true</DifferentUsername>
                <PerformServerValidation xmlns="http://www.microsoft.com/provisioning/EapTlsConnectionPropertiesV2">true</PerformServerValidation>
                <AcceptServerName xmlns="http://www.microsoft.com/provisioning/EapTlsConnectionPropertiesV2">true</AcceptServerName>
                <TLSExtensions xmlns="http://www.microsoft.com/provisioning/EapTlsConnectionPropertiesV2">
                    <FilteringInfo xmlns="http://www.microsoft.com/provisioning/EapTlsConnectionPropertiesV3">
                        <CAHashList Enabled="true">
                            <IssuerHash> ROOT CERTIFCATE THUMBPRINT  </IssuerHash>
                        </CAHashList>
                    </FilteringInfo>
                </TLSExtensions>
            </EapType>
        </Eap>
    </Config>
</EapHostConfig>
```

## Next steps
For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
