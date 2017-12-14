## How APIM Proxy Server responds with SSL certificates in the TLS handshake

### Clients calling with SNI header
If the customer has one or multiple custom domains configured for Proxy, APIM can respond to HTTPS requests from the custom domain(s) (for example, contoso.com) as well as default domain (for example, apim-service-name.azure-api.net). Based on the information in the Server Name Indication (SNI) header, APIM responds with appropriate server certificate.

### Clients calling without SNI header
If the customer is using a client, which does not send the [SNI](https://tools.ietf.org/html/rfc6066#section-3) header, APIM creates responses based on the following logic:

(*) If the service has just one custom domain configured for Proxy, the Default Certificate is the certificate that was issued to the Proxy custom domain.
(*) If the service has configured multiple custom domains for Proxy (only supported in the **Premium** tier), the customer can designate which certificate should be the default certificate. To set the default certificate, the [defaultSslBinding](https://docs.microsoft.com/rest/api/apimanagement/apimanagementservice/createorupdate#definitions_hostnameconfiguration) property should be set to true ("defaultSslBinding":"true"). If the customer does not set the property, the default certificate is the certificate issued to default Proxy domain hosted at *.azure-api.net.
