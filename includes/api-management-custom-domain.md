---
author: vladvino
ms.service: api-management
ms.topic: include
ms.date: 08/23/2021
ms.author: vlvinogr
---
## How API Management Proxy Server responds with SSL certificates in the TLS handshake

### Clients calling with Server Name Indication (SNI) header
If you have one or multiple custom domains configured for Proxy (Gateway), API Management can respond to HTTPS requests from both:
* Custom domain (for example, `contoso.com`)
* Default domain (for example, `apim-service-name.azure-api.net`). 

Based on the information in the SNI header, API Management responds with the appropriate server certificate.

### Clients calling without SNI header
If you are using a client that does not send the [SNI](https://tools.ietf.org/html/rfc6066#section-3) header, API Management creates responses based on the following logic:

* **If the service has just one custom domain configured for Proxy**, the default certificate is the certificate issued to the Proxy custom domain.
* **If the service has configured multiple custom domains for Proxy (supported in the **Developer** and **Premium** tier)**, you can designate the default certificate by setting the [defaultSslBinding](/rest/api/apimanagement/2020-12-01/api-management-service/create-or-update#hostnameconfiguration) property to true ("defaultSslBinding":"true"). If you do not set the property, the default certificate is the certificate issued to default Proxy domain hosted at `*.azure-api.net`.

## Support for PUT/POST request with large payload

API Management Proxy server supports requests with large payloads (> 40 KB) when using client-side certificates in HTTPS. To prevent the server's request from freezing, you can set the property ["negotiateClientCertificate": "true"](/rest/api/apimanagement/2020-12-01/api-management-service/create-or-update#hostnameconfiguration) on the Proxy hostname. 

If the property is set to true, the client certificate is requested at SSL/TLS connection time, before any HTTP request exchange. Since the setting applies at the **Proxy Hostname** level, all connection requests ask for the client certificate. You can work around this limitation and configure up to 20 custom domains for Proxy (only supported in the **Premium** tier).
