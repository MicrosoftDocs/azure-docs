[!INCLUDE [P2S FAQ All](vpn-gateway-faq-p2s-all-include.md)]

### Can I use my own internal PKI root CA for Point-to-Site connectivity?

Yes. Previously, only self-signed root certificates could be used. You can still upload 20 root certificates.

### What tools can I use to create certificates?

You can use your Enterprise PKI solution (your internal PKI), Azure PowerShell, MakeCert], and OpenSSL.

### <a name="mkct"></a>If I want to use my internal PKI to create certificates, what are the required parameters?

See the steps to [Generate certificates](../articles/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md#generatecert).

### <a name="ps"></a>If I want to use Azure PowerShell to create certificates, what are the required parameters?

See the [Azure PowerShell](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md) article for steps.

### <a name="mkct"></a>If I want to use MakeCert to create certificates, what are the required parameters?

See the [MakeCert](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site-makecert.md) article for steps.

### <a name="openssl"></a>If I want to use OpenSSL to create certificates, what are the required parameters?

For the client certificate:

  * When creating the private key, specify the length as 4096.
  * When creating the certificate, for the *-extensions* parameter, specify *usr_cert*.

When exporting certificates, be sure to convert the root certificate to Base64.