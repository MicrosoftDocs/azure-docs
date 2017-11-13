[!INCLUDE [P2S FAQ All](vpn-gateway-faq-p2s-all-include.md)]

### Can I use my own internal PKI root CA for Point-to-Site connectivity?

Yes. Previously, only self-signed root certificates could be used. You can still upload 20 root certificates.

### What tools can I use to create certificates?

You can use your enterprise PKI solution, Azure [PowerShell](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md), [MakeCert](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site-makecert.md), and OpenSSL.

### If I want to use OpenSSL to create certificates, are there specific parameters?

Yes.

* For the client certificate:

  * When creating the private key, specify the length as 4096.
  * When creating the certificate, for the *-extensions* parameter, specify *usr_cert*.

* When exporting the certificates, be sure to convert the root certificate to Base64.