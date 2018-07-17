---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 06/05/2018
 ms.author: cherylmc
 ms.custom: include file
---
Starting July 1, 2018, support is being removed for TLS 1.0 and 1.1 from Azure VPN Gateway. VPN Gateway will support only TLS 1.2. To maintain TLS support and connectivity for your Windows 7 and Windows 8 point-to-site clients that use TLS, we recommend that you install the following updates:

•	[Update for Microsoft EAP implementation that enables the use of TLS](https://support.microsoft.com/help/2977292/microsoft-security-advisory-update-for-microsoft-eap-implementation-th)

•	[Update to enable TLS 1.1 and TLS 1.2 as default secure protocols in WinHTTP](https://support.microsoft.com/help/3140245/update-to-enable-tls-1-1-and-tls-1-2-as-a-default-secure-protocols-in)

The following legacy algorithms will also be deprecated for TLS on July 1, 2018:

* RC4 (Rivest Cipher 4)
* DES (Data Encryption Algorithm)
* 3DES (Triple Data Encryption Algorithm)
* MD5 (Message Digest 5)
