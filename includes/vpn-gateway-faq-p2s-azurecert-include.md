---
 title: Include file
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.date: 10/18/2023
 ms.author: cherylmc
---


### What should I do if I get a certificate mismatch for a point-to-site certificate authentication connection?

Clear the **Verify the server's identity by validating the certificate** checkbox. Or, add the server's fully qualified domain name (FQDN) along with the certificate when you're creating a profile manually. You can do this by running `rasphone` from a command prompt and selecting the profile from the dropdown list.

We don't recommend bypassing validation of server identity in general. But with Azure certificate authentication, the same certificate is used for server validation in the VPN tunneling protocol (IKEv2 or SSTP) and the Extensible Authentication Protocol (EAP). Because the VPN tunneling protocol is already validating the server certificate and FQDN, it's redundant to validate them again in EAP.

![Screenshot that shows properties for point-to-site authentication.](./media/vpn-gateway-faq-p2s-all-include/servercert.png "Server Certificate")

### Can I use my own internal PKI root CA to generate certificates for point-to-site connectivity?

Yes. Previously, you could use only self-signed root certificates. You can still upload 20 root certificates.

### Can I use certificates from Azure Key Vault?

No.

### What tools can I use to create certificates?

You can use your enterprise public key infrastructure (PKI) solution (your internal PKI), Azure PowerShell, MakeCert, and OpenSSL.

### <a name="certsettings"></a>Are there instructions for certificate settings and parameters?

For .cer and .pfx file formats, see:

* [PowerShell](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md)
* [MakeCert](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site-makecert.md)

For .pem file format, see:

* [Linux: OpenSSL](../articles/vpn-gateway/point-to-site-certificates-linux-openssl.md)
* [Linux: strongSwan](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site-linux.md)
