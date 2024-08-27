---
title: 'About Azure Point-to-Site VPN connections'
titleSuffix: Azure VPN Gateway
description: Learn about Point-to-Site VPN.
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: linux-related-content
ms.topic: conceptual
ms.date: 08/08/2024
ms.author: cherylmc
---
# About Point-to-Site VPN

A Point-to-Site (P2S) VPN gateway connection lets you create a secure connection to your virtual network from an individual client computer. A P2S connection is established by starting it from the client computer. This solution is useful for telecommuters who want to connect to Azure VNets from a remote location, such as from home or a conference. P2S VPN is also a useful solution to use instead of S2S VPN when you have only a few clients that need to connect to a VNet. Point-to-site configurations require a **route-based** VPN type.

This article applies to the current deployment model. See [P2S - Classic](vpn-gateway-howto-point-to-site-classic-azure-portal.md) for legacy deployments.

## <a name="protocol"></a>What protocol does P2S use?

Point-to-site VPN can use one of the following protocols:

* **OpenVPN® Protocol**, an SSL/TLS based VPN protocol. A TLS VPN solution can penetrate firewalls, since most firewalls open TCP port 443 outbound, which TLS uses. OpenVPN can be used to connect from Android, iOS (versions 11.0 and above), Windows, Linux, and Mac devices (macOS versions 10.13 and above).

* **Secure Socket Tunneling Protocol (SSTP)**, a proprietary TLS-based VPN protocol. A TLS VPN solution can penetrate firewalls, since most firewalls open TCP port 443 outbound, which TLS uses. SSTP is only supported on Windows devices. Azure supports all versions of Windows that have SSTP and support TLS 1.2 (Windows 8.1 and later).

* **IKEv2 VPN**, a standards-based IPsec VPN solution. IKEv2 VPN can be used to connect from Mac devices (macOS versions 10.11 and above).

## <a name="authentication"></a>How are P2S VPN clients authenticated?

Before Azure accepts a P2S VPN connection, the user has to be authenticated first. There are three authentication types that you can select when you configure your P2S gateway. The options are:

* Azure certificate
* Microsoft Entra ID
* RADIUS and Active Directory Domain Server

You can select multiple authentication types for your P2S gateway configuration. If you select multiple authentication types, the VPN client you use must be supported by at least one authentication type and corresponding tunnel type. For example, if you select "IKEv2 and OpenVPN" for tunnel types, and "Microsoft Entra ID and Radius" or "Microsoft Entra ID and Azure Certificate" for authentication type, Microsoft Entra ID will only use the OpenVPN tunnel type since it's not supported by IKEv2.

The following table shows authentication mechanisms that are compatible with selected tunnel types. Each mechanism requires corresponding VPN client software on the connecting device to be configured with the proper settings available in the VPN client profile configuration files.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-multiauth-tunnel-mapping.md)]

### Certificate authentication

When you configure your P2S gateway for certificate authentication, you upload the trusted root certificate public key to the Azure gateway. You can use a root certificate that was generated using an Enterprise solution, or you can generate a self-signed certificate.

To authenticate, each client that connects must have an installed client certificate that's generated from the trusted root certificate. This is in addition to VPN client software. The validation of the client certificate is performed by the VPN gateway and happens during establishment of the P2S VPN connection.

#### <a name='certificate-workflow'></a>Certificate Workflow

At a high level, you need to perform the following steps to configure Certificate authentication:

1. Enable Certificate authentication on the P2S gateway, along with the additional required settings (client address pool, etc.), and upload the root CA public key information.
1. Generate and download VPN client profile configuration files (profile configuration package).
1. Install the client certificate on each connecting client computer.
1. Configure the VPN client on the client computer using the settings found in the VPN profile configuration package.
1. Connect.

### <a name='entra-id'></a>Microsoft Entra ID authentication

You can configure your P2S gateway to allow VPN users to authenticate using Microsoft Entra ID credentials. With Microsoft Entra ID authentication, you can use Microsoft Entra Conditional Access and multifactor authentication (MFA) features for VPN. Microsoft Entra ID authentication is supported only for the OpenVPN protocol. To authenticate and connect, clients must use the Azure VPN Client.

[!INCLUDE [entra app id descriptions](../../includes/vpn-gateway-entra-app-id-descriptions.md)]

#### <a name='entra-workflow'></a>Microsoft Entra ID Workflow

At a high level, you need to perform the following steps to configure Microsoft Entra ID authentication:

1. If using manual app registration, perform the necessary steps on the Entra tenant.
1. Enable Microsoft Entra ID authentication on the P2S gateway, along with the additional required settings (client address pool, etc.).
1. Generate and download VPN client profile configuration files (profile configuration package).
1. Download, install, and configure the Azure VPN Client on the client computer.
1. Connect.

### Active Directory (AD) Domain Server

AD Domain authentication allows users to connect to Azure using their organization domain credentials. It requires a RADIUS server that integrates with the AD server. Organizations can also use their existing RADIUS deployment.

The RADIUS server could be deployed on-premises or in your Azure VNet. During authentication, the Azure VPN Gateway acts as a pass through and forwards authentication messages back and forth between the RADIUS server and the connecting device. So Gateway reachability to the RADIUS server is important. If the RADIUS server is present on-premises, then a VPN S2S connection from Azure to the on-premises site is required for reachability.

The RADIUS server can also integrate with AD certificate services. This lets you use the RADIUS server and your enterprise certificate deployment for P2S certificate authentication as an alternative to the Azure certificate authentication. The advantage is that you don’t need to upload root certificates and revoked certificates to Azure.

A RADIUS server can also integrate with other external identity systems. This opens up plenty of authentication options for P2S VPN, including multi-factor options.

:::image type="content" source="./media/point-to-site-about/p2s.png" alt-text="Diagram that shows a point-to-site VPN with an on-premises site." lightbox="./media/point-to-site-about/p2s.png":::

For P2S gateway configuration steps, see [Configure P2S - RADIUS](point-to-site-how-to-radius-ps.md).

## What are the client configuration requirements?

The client configuration requirements vary, based on the VPN client that you use, the authentication type, and the protocol. The following table shows the available clients and the corresponding articles for each configuration.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

## <a name="gwsku"></a>Which gateway SKUs support P2S VPN?

The following table shows gateway SKUs by tunnel, connection, and throughput. For more information, see  [About gateway SKUs](about-gateway-skus.md).

[!INCLUDE [aggregate throughput sku](../../includes/vpn-gateway-table-gwtype-aggtput-include.md)]

> [!NOTE]
> The Basic SKU has limitations and does not support IKEv2, IPv6, or RADIUS authentication. For more information, see [VPN Gateway settings](vpn-gateway-about-vpn-gateway-settings.md#gwsku).
>

## <a name="IKE/IPsec policies"></a>What IKE/IPsec policies are configured on VPN gateways for P2S?

The tables in this section show the values for the default policies. However, they don't reflect the available supported values for custom policies. For custom policies, see the **Accepted values** listed in the [New-AzVpnClientIpsecParameter](/powershell/module/az.network/new-azvpnclientipsecparameter) PowerShell cmdlet.

**IKEv2**

| **Cipher** | **Integrity** | **PRF** | **DH Group** |
|--|--|--|--|
| GCM_AES256 | GCM_AES256 | SHA384 | GROUP_24 |
| GCM_AES256 | GCM_AES256 | SHA384 | GROUP_14 |
| GCM_AES256 | GCM_AES256 | SHA384 | GROUP_ECP384 |
| GCM_AES256 | GCM_AES256 | SHA384 | GROUP_ECP256 |
| GCM_AES256 | GCM_AES256 | SHA256 | GROUP_24 |
| GCM_AES256 | GCM_AES256 | SHA256 | GROUP_14 |
| GCM_AES256 | GCM_AES256 | SHA256 | GROUP_ECP384 |
| GCM_AES256 | GCM_AES256 | SHA256 | GROUP_ECP256 |
| AES256 | SHA384 | SHA384 | GROUP_24 |
| AES256 | SHA384 | SHA384 | GROUP_14 |
| AES256 | SHA384 | SHA384 | GROUP_ECP384 |
| AES256 | SHA384 | SHA384 | GROUP_ECP256 |
| AES256 | SHA256 | SHA256 | GROUP_24 |
| AES256 | SHA256 | SHA256 | GROUP_14 |
| AES256 | SHA256 | SHA256 | GROUP_ECP384 |
| AES256 | SHA256 | SHA256 | GROUP_ECP256 |
| AES256 | SHA256 | SHA256 | GROUP_2 |

**IPsec**

| **Cipher** | **Integrity** | **PFS Group** |
|--|--|--|
| GCM_AES256 | GCM_AES256 | GROUP_NONE |
| GCM_AES256 | GCM_AES256 | GROUP_24 |
| GCM_AES256 | GCM_AES256 | GROUP_14 |
| GCM_AES256 | GCM_AES256 | GROUP_ECP384 |
| GCM_AES256 | GCM_AES256 | GROUP_ECP256 |
| AES256 | SHA256 | GROUP_NONE |
| AES256 | SHA256 | GROUP_24 |
| AES256 | SHA256 | GROUP_14 |
| AES256 | SHA256 | GROUP_ECP384 |
| AES256 | SHA256 | GROUP_ECP256 |
| AES256 | SHA1 | GROUP_NONE |

## <a name="TLS policies"></a>What TLS policies are configured on VPN gateways for P2S?

[!INCLUDE [TLS policies table](../../includes/vpn-gateway-tls-policies.md)]


## <a name="configure"></a>How do I configure a P2S connection?

A P2S configuration requires quite a few specific steps. The following articles contain the steps to walk you through common P2S configuration steps.

* [Certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
* [Microsoft Entra ID authentication](point-to-site-entra-gateway.md)
* [RADIUS authentication](point-to-site-how-to-radius-ps.md)

### To remove the configuration of a P2S connection

You can remove the configuration of a connection by using PowerShell or CLI. For examples, see the [FAQ](vpn-gateway-vpn-faq.md#removeconfig).

## How does P2S routing work?

See the following articles:

* [About Point-to-Site VPN routing](vpn-gateway-about-point-to-site-routing.md)
* [How to advertise custom routes](vpn-gateway-p2s-advertise-custom-routes.md)

## FAQs

There are multiple FAQ entries for point-to-site. See the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md), paying particular attention to the [Certificate authentication](vpn-gateway-vpn-faq.md#P2S) and [RADIUS](vpn-gateway-vpn-faq.md#P2SRADIUS) sections, as appropriate.

## Next Steps

* [Configure a P2S connection - Azure certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
* [Configure a P2S connection - Microsoft Entra ID authentication](point-to-site-entra-gateway.md)
**"OpenVPN" is a trademark of OpenVPN Inc.**
