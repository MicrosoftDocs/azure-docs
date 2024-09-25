---
title: 'Troubleshoot point-to-site connections: macOS X clients'
titleSuffix: Azure VPN Gateway
description: Learn how to troubleshoot point-to-site connectivity issues from macOS X using the native VPN client.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: troubleshooting
ms.date: 09/04/2024
ms.author: cherylmc
---

# Troubleshoot Point-to-Site VPN connections from macOS X VPN clients

This article helps you troubleshoot point-to-site connectivity issues from macOS X clients that use the native macOS X VPN client and IKEv2. VPN client configuration in macOS X is very basic for IKEv2 connections and doesn't allow for much customization. There are only four settings that need to be checked:

* Server Address
* Remote ID
* Local ID
* Authentication Settings
* OS Version (10.11 or higher)

## <a name="certificate"></a> Certificate-based authentication

1. Check the VPN client settings. Go to **Settings** and locate **VPN**.
1. From the list, click the **i** next to the VPN entry that you want to investigate. This opens the settings configuration for the VPN connection.
1. Verify that the **Server Address** is the complete FQDN and includes the cloudapp.net.
1. The **Remote ID** should be the same as the Server Address (Gateway FQDN).
1. The **Local ID** should be the same as the **Subject** of the client certificate.
1. For **Authentication**, verify that "Certificate" is selected.
1. Click the **Select** button and verify that the correct certificate is selected.
1. Click **OK** to save any changes.

If you're still having issues, see the [IKEv2 packet capture](#packet) section.

## <a name="ikev2"></a>Username and password authentication

1. Check the VPN client settings. Go to **Settings** and locate **VPN**.
1. From the list, click the **i** next to the VPN entry that you want to investigate. This opens the settings configuration for the VPN connection.
1. Verify that the **Server Address** is the complete FQDN and includes the cloudapp.net.
1. The **Remote ID** should be the same as the Server Address (Gateway FQDN).
1. The **Local ID** can be blank.
1. For **Authentication**, verify that "Username" is selected.
1. Verify that the correct credentials are entered.
1. Click **OK** to save any changes.

If you're still having issues, see the [IKEv2 packet capture](#packet) section.

## <a name="packet"></a>Packet capture - IKEv2

Download [Wireshark](https://www.wireshark.org/#download) and perform a packet capture.

1. Filter on *isakmp* and look at the **IKE_SA** packets. You should be able to look at the SA proposal details under the **Payload: Security Association**.
1. Verify that the client and the server have a common set.
1. If there's no server response on the network traces, verify you enabled IKEv2 protocol on the Azure VPN gateway. You can check by going to the Azure portal, selecting the VPN gateway, and then selecting **Point-to-site configuration**.

## Next steps

For more help, see [Microsoft Support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
