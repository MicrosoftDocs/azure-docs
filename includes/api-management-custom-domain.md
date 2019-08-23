---
author: vladvino
ms.service: api-management
ms.topic: include
ms.date: 11/09/2018
ms.author: vlvinogr
---
## How APIM Proxy Server responds with SSL certificates in the TLS handshake

### Clients calling with SNI header
If the customer has one or multiple custom domains configured for Proxy, APIM can respond to HTTPS requests from the custom domain(s) (for example, contoso.com) as well as default domain (for example, apim-service-name.azure-api.net). Based on the information in the Server Name Indication (SNI) header, APIM responds with appropriate server certificate.

### Clients calling without SNI header
If the customer is using a client, which does not send the [SNI](https://tools.ietf.org/html/rfc6066#section-3) header, APIM creates responses based on the following logic:

* If the service has just one custom domain configured for Proxy, the Default Certificate is the certificate that was issued to the Proxy custom domain.
* If the service has configured multiple custom domains for Proxy (only supported in the **Premium** tier), the customer can designate which certificate should be the default certificate. To set the default certificate, the [defaultSslBinding](https://docs.microsoft.com/rest/api/apimanagement/2019-01-01/apimanagementservice/createorupdate#hostnameconfiguration) property should be set to true ("defaultSslBinding":"true"). If the customer does not set the property, the default certificate is the certificate issued to default Proxy domain hosted at *.azure-api.net.

## Support for PUT/POST request with large payload

APIM Proxy server supports request with large payload when using client-side certificates in HTTPS (for example, payload > 40 KB). To prevent the server's request from freezing, customers can set the property ["negotiateClientCertificate": "true"](https://docs.microsoft.com/rest/api/apimanagement/2019-01-01/ApiManagementService/CreateOrUpdate#hostnameconfiguration) on the Proxy hostname. If the property is set to true, the client certificate is requested at SSL/TLS connection time, before any HTTP request exchange. Since the setting applies at the **Proxy Hostname** level, all connection requests ask for the client certificate. Customers can configure up to 20 custom domains for Proxy (only supported in the **Premium** tier) and work around this limitation.

