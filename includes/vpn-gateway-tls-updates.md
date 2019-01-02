---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 07/30/2018
 ms.author: cherylmc
 ms.custom: include file
---
>[!NOTE]
>Starting July 1, 2018, support is being removed for TLS 1.0 and 1.1 from Azure VPN Gateway. VPN 
>Gateway will support only TLS 1.2. To maintain support, see the [updates to enable support for TLS1.2](#tls1).

Additionally, the following legacy algorithms will also be deprecated for TLS on July 1, 2018:

* RC4 (Rivest Cipher 4)
* DES (Data Encryption Algorithm)
* 3DES (Triple Data Encryption Algorithm)
* MD5 (Message Digest 5)

### <a name="tls1"></a>How do I enable support for TLS 1.2 in Windows 7 and Windows 8.1?

[!INCLUDE [tls 1.2](vpn-gateway-tls-include.md)]
