---
 title: include file
 author: cherylmc
 ms.service: vpn-gateway
 ms.date: 10/18/2023
 ms.author: cherylmc
---


### What should I do if I'm getting a certificate mismatch when connecting using certificate authentication?

Uncheck **"Verify the server's identity by validating the certificate"**, or add the server FQDN along with the certificate when creating a profile manually. You can do this by running **rasphone** from a command prompt and picking the profile from the drop-down list.

Bypassing server identity validation isn't recommended in general, but with Azure certificate authentication, the same certificate is being used for server validation in the VPN tunneling protocol (IKEv2/SSTP) and the EAP protocol. Since the server certificate and FQDN are already validated by the VPN tunneling protocol, it's redundant to validate the same again in EAP.

![point-to-site auth](./media/vpn-gateway-faq-p2s-all-include/servercert.png "Server Certificate")

### Can I use my own internal PKI root CA to generate certificates for Point-to-Site connectivity?

Yes. Previously, only self-signed root certificates could be used. You can still upload 20 root certificates.

### Can I use certificates from Azure Key Vault?

No.

### What tools can I use to create certificates?

You can use your Enterprise PKI solution (your internal PKI), Azure PowerShell, MakeCert, and OpenSSL.

### <a name="certsettings"></a>Are there instructions for certificate settings and parameters?

For .cer and .pfx file format, see:

* [PowerShell](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md)
* [Makecert](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site-makecert.md)

For .pem file format, see:

* [Linux - OpenSSL](../articles/vpn-gateway/point-to-site-certificates-linux-openssl.md)
* [Linux - strongSwan](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site-linux.md)
