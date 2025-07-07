---
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: include
ms.date: 01/28/2025
ms.author: cherylmc

#Customer intent: this file is used for both virtual wan and vpn gateway articles.
---

The following example shows a user profile configuration file for 3.x OpenVPN Connect clients. This example shows the log file commented out and the "ping-restart 0" option added to prevent periodic reconnects due to no traffic being sent to the client.

```
client
remote <vpnGatewayname>.ln.vpn.azure.com 443
verify-x509-name <IdGateway>.ln.vpn.azure.com name
remote-cert-tls server

dev tun
proto tcp
resolv-retry infinite
nobind

auth SHA256
cipher AES-256-GCM
persist-key
persist-tun

tls-timeout 30
tls-version-min 1.2
key-direction 1

#log openvpn.log
#inactive 0
ping-restart 0 
verb 3

# P2S CA root certificate
<ca>
-----BEGIN CERTIFICATE-----
……
……..
……..
……..

-----END CERTIFICATE-----
</ca>

# Pre Shared Key
<tls-auth>
-----BEGIN OpenVPN Static key V1-----
……..
……..
……..

-----END OpenVPN Static key V1-----
</tls-auth>

# P2S client certificate
# Please fill this field with a PEM formatted client certificate
# Alternatively, configure 'cert PATH_TO_CLIENT_CERT' to use input from a PEM certificate file.
<cert>
-----BEGIN CERTIFICATE-----
……..
……..
……..
-----END CERTIFICATE-----
</cert>

# P2S client certificate private key
# Please fill this field with a PEM formatted private key of the client certificate.
# Alternatively, configure 'key PATH_TO_CLIENT_KEY' to use input from a PEM key file.
<key>
-----BEGIN PRIVATE KEY-----
……..
……..
……..
-----END PRIVATE KEY-----
</key>
```