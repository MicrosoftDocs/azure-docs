---
title: 'About Azure Point-to-Site VPN connections | VPN Gateway'
description: This article helps you understand Point-to-Site connections and helps you decide which P2S VPN gateway authentication type to use.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 02/19/2020
ms.author: cherylmc

---
# About Point-to-Site VPN

A Point-to-Site (P2S) VPN gateway connection lets you create a secure connection to your virtual network from an individual client computer. A P2S connection is established by starting it from the client computer. This solution is useful for telecommuters who want to connect to Azure VNets from a remote location, such as from home or a conference. P2S VPN is also a useful solution to use instead of S2S VPN when you have only a few clients that need to connect to a VNet. This article applies to the Resource Manager deployment model.

## <a name="protocol"></a>What protocol does P2S use?

Point-to-site VPN can use one of the following protocols:

* **OpenVPN® Protocol**, an SSL/TLS based VPN protocol. A TLS VPN solution can penetrate firewalls, since most firewalls open TCP port 443 outbound, which TLS uses. OpenVPN can be used to connect from Android, iOS (versions 11.0 and above), Windows, Linux and Mac devices (OSX versions 10.13 and above).

* Secure Socket Tunneling Protocol (SSTP), a proprietary TLS-based VPN protocol. A TLS VPN solution can penetrate firewalls, since most firewalls open TCP port 443 outbound, which TLS uses. SSTP is only supported on Windows devices. Azure supports all versions of Windows that have SSTP (Windows 7 and later).

* IKEv2 VPN, a standards-based IPsec VPN solution. IKEv2 VPN can be used to connect from Mac devices (OSX versions 10.11 and above).


>[!NOTE]
>IKEv2 and OpenVPN for P2S are available for the Resource Manager deployment model only. They are not available for the classic deployment model.
>

## <a name="authentication"></a>How are P2S VPN clients authenticated?

Before Azure accepts a P2S VPN connection, the user has to be authenticated first. There are two mechanisms that Azure offers to authenticate a connecting user.

### Authenticate using native Azure certificate authentication

When using the native Azure certificate authentication, a client certificate that is present on the device is used to authenticate the connecting user. Client certificates are generated from a trusted root certificate and then installed on each client computer. You can use a root certificate that was generated using an Enterprise solution, or you can generate a self-signed certificate.

The validation of the client certificate is performed by the VPN gateway and happens during establishment of the P2S VPN connection. The root certificate is required for the validation and must be uploaded to Azure.

### Authenticate using native Azure Active Directory authentication

Azure AD  authentication allows users to connect to Azure using their Azure Active Directory credentials. Native Azure AD authentication is only supported for OpenVPN protocol and Windows 10 and requires the use of the [Azure VPN Client](https://go.microsoft.com/fwlink/?linkid=2117554).

With native Azure AD authentication, you can leverage Azure AD's conditional access as well as Multi-Factor Authentication(MFA) features for VPN.

At a high level, you need to perform the following steps to configure Azure AD authentication:

1. [Configure an Azure AD tenant](openvpn-azure-ad-tenant.md)

2. [Enable Azure AD authentication on the gateway](openvpn-azure-ad-tenant.md#enable-authentication)

3. [Download and configure Azure VPN Client](https://go.microsoft.com/fwlink/?linkid=2117554)


### Authenticate using Active Directory (AD) Domain Server

AD Domain authentication allows users to connect to Azure using their organization domain credentials. It requires a RADIUS server that integrates with the AD server. Organizations can also leverage their existing RADIUS deployment.
  
The RADIUS server could be deployed on-premises or in your Azure VNet. During authentication, the Azure VPN Gateway acts as a pass through and forwards authentication messages back and forth between the RADIUS server and the connecting device. So Gateway reachability to the RADIUS server is important. If the RADIUS server is present on-premises, then a VPN S2S connection from Azure to the on-premises site is required for reachability.  
  
The RADIUS server can also integrate with AD certificate services. This lets you use the RADIUS server and your enterprise certificate deployment for P2S certificate authentication as an alternative to the Azure certificate authentication. The advantage is that you don’t need to upload root certificates and revoked certificates to Azure.

A RADIUS server can also integrate with other external identity systems. This opens up plenty of authentication options for P2S VPN, including multi-factor options.

![point-to-site](./media/point-to-site-about/p2s.png "Point-to-Site")

## What are the client configuration requirements?

>[!NOTE]
>For Windows clients, you must have administrator rights on the client device in order to initiate the VPN connection from the client device to Azure.
>

Users use the native VPN clients on Windows and Mac devices for P2S. Azure provides a VPN client configuration zip file that contains settings required by these native clients to connect to Azure.

* For Windows devices, the VPN client configuration consists of an installer package that users install on their devices.
* For Mac devices, it consists of the mobileconfig file that users install on their devices.

The zip file also provides the values of some of the important settings on the Azure side that you can use to create your own profile for these devices. Some of the values include the VPN gateway address, configured tunnel types, routes, and the root certificate for gateway validation.

>[!NOTE]
>[!INCLUDE [TLS version changes](../../includes/vpn-gateway-tls-change.md)]
>

## <a name="gwsku"></a>Which gateway SKUs support P2S VPN?

[!INCLUDE [aggregate throughput sku](../../includes/vpn-gateway-table-gwtype-aggtput-include.md)]

* For Gateway SKU recommendations, see [About VPN Gateway settings](vpn-gateway-about-vpn-gateway-settings.md#gwsku).

>[!NOTE]
>The Basic SKU does not support IKEv2 or RADIUS authentication.
>

## <a name="IKE/IPsec policies"></a>What IKE/IPsec policies are configured on VPN gateways for P2S?


**IKEv2**

|**Cipher** | **Integrity** | **PRF** | **DH Group** |
|---		| ---			| ---		| --- 	|
|GCM_AES256 |	GCM_AES256	| SHA384	| GROUP_24 |
|GCM_AES256 |	GCM_AES256	| SHA384	| GROUP_14 |
|GCM_AES256 |	GCM_AES256	| SHA384	| GROUP_ECP384 |
|GCM_AES256 |	GCM_AES256	| SHA384	| GROUP_ECP256 |
|GCM_AES256 |	GCM_AES256	| SHA256	| GROUP_24 |
|GCM_AES256 |	GCM_AES256	| SHA256	| GROUP_14 |
|GCM_AES256 |	GCM_AES256	| SHA256	| GROUP_ECP384 |
|GCM_AES256 |	GCM_AES256	| SHA256	| GROUP_ECP256 |
|AES256     |   SHA384		| SHA384	| GROUP_24 |
|AES256     |   SHA384		| SHA384	| GROUP_14 |
|AES256     |   SHA384		| SHA384	| GROUP_ECP384 |
|AES256     |   SHA384		| SHA384	| GROUP_ECP256 |
|AES256     |   SHA256		| SHA256	| GROUP_24 |
|AES256     |   SHA256		| SHA256	| GROUP_14 |
|AES256     |   SHA256		| SHA256	| GROUP_ECP384 |
|AES256     |   SHA256		| SHA256	| GROUP_ECP256 |
|AES256     |   SHA256		| SHA256	| GROUP_2 |

**IPsec**

|**Cipher** | **Integrity** | **PFS Group** |
|---		| ---			| ---		|
|GCM_AES256	| GCM_AES256 | GROUP_NONE |
|GCM_AES256	| GCM_AES256 | GROUP_24 |
|GCM_AES256	| GCM_AES256 | GROUP_14 |
|GCM_AES256	| GCM_AES256 | GROUP_ECP384 |
|GCM_AES256	| GCM_AES256 | GROUP_ECP256 |
| AES256	| SHA256 | GROUP_NONE |
| AES256	| SHA256 | GROUP_24 |
| AES256	| SHA256 | GROUP_14 |
| AES256	| SHA256 | GROUP_ECP384 |
| AES256	| SHA256 | GROUP_ECP256 |
| AES256	| SHA1 | GROUP_NONE |

## <a name="TLS policies"></a>What TLS policies are configured on VPN gateways for P2S?
**TLS**

|**Policies** |
|---| 
|TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 |
|TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 |
|TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 |
|TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 |
|TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256 |
|TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384 |
|TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 |
|TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 |
|TLS_RSA_WITH_AES_128_GCM_SHA256 |
|TLS_RSA_WITH_AES_256_GCM_SHA384 |
|TLS_RSA_WITH_AES_128_CBC_SHA256 |
|TLS_RSA_WITH_AES_256_CBC_SHA256 |

## <a name="configure"></a>How do I configure a P2S connection?

A P2S configuration requires quite a few specific steps. The following articles contain the steps to walk you through P2S configuration, and links to configure the VPN client devices:

* [Configure a P2S connection - RADIUS authentication](point-to-site-how-to-radius-ps.md)

* [Configure a P2S connection - Azure native certificate authentication](vpn-gateway-howto-point-to-site-rm-ps.md)

* [Configure OpenVPN](vpn-gateway-howto-openvpn.md)

### To remove the configuration of a P2S connection

For steps, see the [FAQ](#removeconfig), below.
 
## <a name="faqcert"></a>FAQ for native Azure certificate authentication

[!INCLUDE [vpn-gateway-point-to-site-faq-include](../../includes/vpn-gateway-faq-p2s-azurecert-include.md)]

## <a name="faqradius"></a>FAQ for RADIUS authentication

[!INCLUDE [vpn-gateway-point-to-site-faq-include](../../includes/vpn-gateway-faq-p2s-radius-include.md)]

## Next Steps

* [Configure a P2S connection - RADIUS authentication](point-to-site-how-to-radius-ps.md)

* [Configure a P2S connection - Azure native certificate authentication](vpn-gateway-howto-point-to-site-rm-ps.md)

**"OpenVPN" is a trademark of OpenVPN Inc.**
