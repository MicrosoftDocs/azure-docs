---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 03/21/2018
 ms.author: cherylmc
 ms.custom: include file
---
[!INCLUDE [P2S FAQ All](vpn-gateway-faq-p2s-all-include.md)]

### Can I use my own internal PKI root CA for Point-to-Site connectivity?

Yes. Previously, only self-signed root certificates could be used. You can still upload 20 root certificates.

### What tools can I use to create certificates?

You can use your Enterprise PKI solution (your internal PKI), Azure PowerShell, MakeCert, and OpenSSL.

### <a name="certsettings"></a>Are there instructions for certificate settings and parameters?

* **Internal PKI/Enterprise PKI solution:** See the steps to [Generate certificates](../articles/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md#generatecert).

* **Azure PowerShell:** See the [Azure PowerShell](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md) article for steps.

* **MakeCert:** See the [MakeCert](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site-makecert.md) article for steps.

* **OpenSSL:** 

    * When exporting certificates, be sure to convert the root certificate to Base64.

    * For the client certificate:

      * When creating the private key, specify the length as 4096.
      * When creating the certificate, for the *-extensions* parameter, specify *usr_cert*.